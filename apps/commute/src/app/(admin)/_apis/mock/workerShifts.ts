import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { parseApiDate, parseApiDateTime, type ApiJson } from '@/app/(student)/_apis/common';
import { MINUTES_PER_HOUR } from '@/shared/utils/time';
import { addDays, MILLISECONDS_PER_DAY } from '@/shared/utils/week';
import {
  createAttendanceSummary,
  createWorkLedgerRows,
  getTotalWorkedMinutes,
} from '../../_utils/workerShift';
import type { MonthlyWorkRecord, WorkerShift } from '../workers';
import { getDayAttendanceShiftsMock } from './attendances';
import { getWorkApplicationMock } from './workApplications';
import { getWorkChangeRequestsMock } from './workChangeRequests';

// 근로장학생 한 명의 근무 구간·한 달 근무 기록 목업. 대시보드 출근 기록과 수정요청 목업에서 그 사람 것만 골라서,
// 목록·상세보기·근로대장·대시보드·수정요청 숫자가 어긋나지 않는다

// 근로신청을 열지 않은 달의 최대 근로시간
const DEFAULT_MONTHLY_MAX_HOURS = 60;

// 근태를 계산하려고 JSON을 Date로 바꾼다. _apis/workers.ts의 같은 변환을 가져오면 서로를 불러오게 되어 여기 따로 둔다
const toWorkerShift = (json: ApiJson<WorkerShift>): WorkerShift => ({
  ...json,
  date: parseApiDate(json.date),
  checkedInAt: json.checkedInAt ? parseApiDateTime(json.checkedInAt) : null,
});

/**
 * 한 사람의 기간 근무 구간과 출근 기록 목업을 얻습니다.
 * @param userId 근로장학생 id
 * @param startDateKey 첫날 (YYYY-MM-DD)
 * @param endDateKey 마지막 날 (YYYY-MM-DD, 포함)
 * @returns 근무 구간 JSON (날짜·시작 시각 순)
 * @example getWorkerShiftsMock(1, '2026-11-01', '2026-11-30')[0]; // { date: '2026-11-02', start: '13:00', end: '16:30', checkedInAt: '2026-11-02T12:57:00' }
 */
export const getWorkerShiftsMock = (
  userId: number,
  startDateKey: string,
  endDateKey: string,
): ApiJson<WorkerShift>[] => {
  const startDate = parseISO(startDateKey);
  const dayCount =
    Math.round((parseISO(endDateKey).getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY) + 1;

  return Array.from({ length: Math.max(dayCount, 0) }, (_, index) =>
    toISO(addDays(startDate, index)),
  ).flatMap((dateKey) =>
    getDayAttendanceShiftsMock(dateKey)
      .filter((shift) => shift.userId === userId)
      .map(({ start, end, checkedInAt }) => ({ date: dateKey, start, end, checkedInAt })),
  );
};

/**
 * 한 사람의 한 달 근무 기록 목업을 얻습니다. 누적 근로시간·지각은 그 달 근무 구간으로, 근무 변경 요청은 그 달 수정요청으로 셉니다.
 * @param userId 근로장학생 id
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 누적 시간(분)과 한도, 지각·근무 변경 횟수
 * @example getMonthlyRecordMock(1, 2026, 11).monthlyLimitMinutes; // 3600
 */
export const getMonthlyRecordMock = (
  userId: number,
  year: number,
  month: number,
): MonthlyWorkRecord => {
  const now = new Date();
  const shifts = getWorkerShiftsMock(
    userId,
    toISO(new Date(year, month - 1, 1)),
    toISO(new Date(year, month, 0)),
  ).map(toWorkerShift);
  const { lateCount, lateMinutes } = createAttendanceSummary(shifts, now);
  const monthlyMaxHours =
    getWorkApplicationMock(year, month)?.settings.monthlyMaxHours ?? DEFAULT_MONTHLY_MAX_HOURS;
  const changeRequests = getWorkChangeRequestsMock(year, month).filter(
    (request) => request.userId === userId,
  );

  return {
    monthlyWorkedMinutes: getTotalWorkedMinutes(createWorkLedgerRows(shifts, now)),
    monthlyLimitMinutes: monthlyMaxHours * MINUTES_PER_HOUR,
    lateCount,
    lateMinutes,
    totalChangeRequestCount: changeRequests.length,
    // CS02: 승인
    approvedChangeRequestCount: changeRequests.filter(({ statusCode }) => statusCode === 'CS02')
      .length,
  };
};
