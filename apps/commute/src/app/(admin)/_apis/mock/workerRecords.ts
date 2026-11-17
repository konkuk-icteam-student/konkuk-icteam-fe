import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { parseApiDate, parseApiDateTime, type ApiJson } from '@/app/(student)/_apis/common';
import { convertTimeToMinutes, MINUTES_PER_HOUR } from '@/shared/utils/time';
import { addDays, DAYS_PER_WEEK, getMondayOfWeek } from '@/shared/utils/week';
import {
  createAttendanceSummary,
  createWorkLedgerRows,
  filterShiftsBetween,
  getTotalWorkedMinutes,
} from '../../_utils/workerShift';
import type {
  GetWorkerListResponse,
  WorkerDetail,
  WorkerListItem,
  WorkerShift,
  WorkerWorkRecord,
} from '../workers';
import { getWorkerShiftsMock } from './workerShifts';
import { getMonthlyUserIdsMock, getWorkApplicationMock } from './workApplications';
import { getWorkChangeRequestsMock } from './workChangeRequests';
import { WORKERS_MOCK } from './workers';

// 근무 인원 목록·상세 목업. 근무 기록은 근무 구간(대시보드 출근 기록)과 수정요청 목업에서 세서
// 목록·상세보기·근로대장·대시보드·수정요청 숫자가 어긋나지 않는다

// 근로신청을 열지 않은 달의 주·월 최대 근로시간
const DEFAULT_WEEKLY_MAX_HOURS = 15;
const DEFAULT_MONTHLY_MAX_HOURS = 60;

// 목록·상세에 함께 붙는 근무 기록(record)과, 목록에만 붙는 지각·근태 이상
type WorkerRecordMock = {
  record: WorkerWorkRecord;
  attendanceIssues: Pick<WorkerListItem, 'lateCount' | 'lateMinutes' | 'totalAttendanceIssueCount'>;
};

// 그 달 근로학생이 아니면 근무 기록이 모두 0이다 (최대 근로시간도 0)
const EMPTY_RECORD: WorkerRecordMock = {
  record: {
    weeklyWorkedMinutes: 0,
    weeklyLimitMinutes: 0,
    monthlyWorkedMinutes: 0,
    monthlyLimitMinutes: 0,
    totalChangeRequestCount: 0,
    approvedChangeRequestCount: 0,
  },
  attendanceIssues: { lateCount: 0, lateMinutes: 0, totalAttendanceIssueCount: 0 },
};

// 근태를 계산하려고 JSON을 Date로 바꾼다. _apis/workers.ts의 같은 변환을 가져오면 서로를 불러오게 되어 여기 따로 둔다
const toWorkerShift = (json: ApiJson<WorkerShift>): WorkerShift => ({
  ...json,
  date: parseApiDate(json.date),
  checkedInAt: json.checkedInAt ? parseApiDateTime(json.checkedInAt) : null,
});

/**
 * 한 사람의 근무 기록 목업을 얻습니다. 기준일이 속한 주(월~일)·달의 근무 완료 시간, 그 달 지각·근태 이상과 수정요청을 셉니다.
 * 그 달 근로학생이 아니면 모두 0입니다.
 * @param userId 근로장학생 id
 * @param dateKey 기준일 (YYYY-MM-DD)
 * @returns 주·월 누적과 최대 근로시간(분)·수정요청 횟수(record), 지각·근태 이상 횟수(attendanceIssues)
 * @example getWorkerRecordMock(1, '2026-11-17').record.monthlyLimitMinutes; // 3600
 */
export const getWorkerRecordMock = (userId: number, dateKey: string): WorkerRecordMock => {
  const date = parseISO(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (!getMonthlyUserIdsMock(year, month).includes(userId)) return EMPTY_RECORD;

  const now = new Date();
  const monday = getMondayOfWeek(date);
  const week = { startDate: monday, endDate: addDays(monday, DAYS_PER_WEEK - 1) };
  const monthRange = { startDate: new Date(year, month - 1, 1), endDate: new Date(year, month, 0) };
  // 주가 두 달에 걸칠 수 있어 주와 달을 모두 담는 기간을 불러온다
  const shifts = getWorkerShiftsMock(
    userId,
    toISO(week.startDate < monthRange.startDate ? week.startDate : monthRange.startDate),
    toISO(week.endDate > monthRange.endDate ? week.endDate : monthRange.endDate),
  ).map(toWorkerShift);
  const monthShifts = filterShiftsBetween(shifts, monthRange);
  const { lateCount, lateMinutes, absentCount } = createAttendanceSummary(monthShifts, now);
  const settings = getWorkApplicationMock(year, month)?.settings;
  const changeRequests = getWorkChangeRequestsMock(year, month).filter(
    (request) => request.userId === userId,
  );

  return {
    record: {
      weeklyWorkedMinutes: getTotalWorkedMinutes(
        createWorkLedgerRows(filterShiftsBetween(shifts, week), now),
      ),
      weeklyLimitMinutes: (settings?.weeklyMaxHours ?? DEFAULT_WEEKLY_MAX_HOURS) * MINUTES_PER_HOUR,
      monthlyWorkedMinutes: getTotalWorkedMinutes(createWorkLedgerRows(monthShifts, now)),
      monthlyLimitMinutes:
        (settings?.monthlyMaxHours ?? DEFAULT_MONTHLY_MAX_HOURS) * MINUTES_PER_HOUR,
      totalChangeRequestCount: changeRequests.length,
      // CS02: 승인
      approvedChangeRequestCount: changeRequests.filter(({ statusCode }) => statusCode === 'CS02')
        .length,
    },
    attendanceIssues: {
      lateCount,
      lateMinutes,
      // 근태 이상은 지각과 결근을 합친 수로 본다 (서버 정의 확인 필요)
      totalAttendanceIssueCount: lateCount + absentCount,
    },
  };
};

type WorkerListMockRequest = {
  dateKey: string;
  keyword: string;
  page: number;
  size: number;
};

/**
 * 근무 인원 목록 목업을 얻습니다. 이름에 검색어가 든 근로장학생을 페이지로 나눠 근무 기록과 함께 줍니다.
 * @param request 조회 조건
 * @param request.dateKey 기준일 (YYYY-MM-DD)
 * @param request.keyword 이름 검색어 (빈 글자면 모두)
 * @param request.page 페이지 (0부터)
 * @param request.size 한 페이지 인원
 * @returns 근무 인원 목록 JSON
 * @example getWorkerListMock({ dateKey: '2026-11-17', keyword: '', page: 0, size: 10 }).totalElements; // 8
 */
export const getWorkerListMock = ({
  dateKey,
  keyword,
  page,
  size,
}: WorkerListMockRequest): ApiJson<GetWorkerListResponse> => {
  const matched = WORKERS_MOCK.filter(({ name }) => name.includes(keyword));
  const totalPages = Math.ceil(matched.length / size);

  return {
    date: dateKey,
    workers: matched
      .slice(page * size, (page + 1) * size)
      .map(({ userId, name, studentId, department, grade, phoneNumber, workStartDate }) => {
        const { record, attendanceIssues } = getWorkerRecordMock(userId, dateKey);

        return {
          userId,
          name,
          studentId,
          department,
          grade,
          phoneNumber,
          workStartDate,
          ...record,
          ...attendanceIssues,
        };
      }),
    page,
    size,
    totalElements: matched.length,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };
};

/**
 * 근무 인원 상세 목업을 얻습니다. 제출한 근무시간은 그 달 배정된 근무 시간의 합, 마지막 요청 시각은 그 달 마지막 수정요청 시각으로 둡니다.
 * @param userId 근로장학생 id
 * @param dateKey 기준일 (YYYY-MM-DD)
 * @returns 근무 인원 상세 JSON. 마지막 요청 시각은 서버 예시처럼 'YYYY-MM-DD HH:mm'
 * @example getWorkerDetailMock(1, '2026-11-17').submittedMinutes; // 3900
 */
export const getWorkerDetailMock = (userId: number, dateKey: string): ApiJson<WorkerDetail> => {
  const worker = WORKERS_MOCK.find((item) => item.userId === userId);
  if (!worker) throw new Error(`근로장학생(${userId})을 찾을 수 없습니다.`);

  const date = parseISO(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  // 지각·근태 이상 횟수는 목록에만 있고 상세 응답에는 없다
  const { record } = getWorkerRecordMock(userId, dateKey);
  const monthShifts = getWorkerShiftsMock(
    userId,
    toISO(new Date(year, month - 1, 1)),
    toISO(new Date(year, month, 0)),
  );
  const lastRequestedAt = getWorkChangeRequestsMock(year, month)
    .filter((request) => request.userId === userId)
    .map(({ requestedAt }) => requestedAt)
    .sort()
    .at(-1);

  return {
    ...worker,
    ...record,
    date: dateKey,
    submittedMinutes: monthShifts.reduce(
      (sum, { start, end }) => sum + convertTimeToMinutes(end) - convertTimeToMinutes(start),
      0,
    ),
    lastRequestedAt: lastRequestedAt
      ? `${lastRequestedAt.slice(0, 10)} ${lastRequestedAt.slice(11, 16)}`
      : null,
  };
};
