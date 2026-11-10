import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  type ApiJson,
  type WorkTimeRange,
} from '@/app/(student)/_apis/common';
import { getMonthlyRecordMock, getWorkerShiftsMock } from './mock/workerShifts';
import { WORKERS_MOCK } from './mock/workers';
import { getMonthlyUserIdsMock } from './mock/workApplications';

// 근로장학생 기본 정보. 아직 채우지 않은 정보는 null로 온다
export type Worker = {
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  // 로그인 아이디로 쓰는 학교 메일
  email: string | null;
  // 근로를 시작한 달의 1일
  workStartDate: Date;
};

// 한 달 근무 기록. 시간은 모두 분 단위다
export type MonthlyWorkRecord = {
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
  lateCount: number;
  lateMinutes: number;
  totalChangeRequestCount: number;
  approvedChangeRequestCount: number;
};

export type MonthlyWorker = Worker & {
  monthlyRecord: MonthlyWorkRecord;
};

export type GetWorkersResponse = {
  workers: Worker[];
};

export type GetMonthlyWorkersRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetMonthlyWorkersResponse = {
  year: number;
  month: number;
  // 그 달 근로학생 (근로신청 때 고른 학생). 아직 정하지 않은 달은 빈 배열
  workers: MonthlyWorker[];
};

// 바꾼 항목만 보낸다. 비운 항목은 null로 보낸다. 이메일·근로 시작일은 바꿀 수 없다
export type UpdateWorkerRequest = {
  userId: number;
  name?: string;
  studentId?: string | null;
  department?: string | null;
  grade?: number | null;
  phoneNumber?: string | null;
};

export type UpdateWorkerResponse = Worker;

// 한 근로장학생의 근무 한 구간과 출근 기록. 점심시간으로 끊기면 두 구간이 된다
export type WorkerShift = WorkTimeRange & {
  // 출근 체크한 시각. 아직 출근하지 않았거나 결근했으면 null
  checkedInAt: Date | null;
};

export type GetWorkerShiftsRequest = {
  userId: number;
  startDate: Date;
  // 이 날까지 포함한다
  endDate: Date;
};

export type GetWorkerShiftsResponse = {
  userId: number;
  // 날짜·시작 시각 순. 예정·근무중·결근 근무도 모두 온다 (근태는 화면에서 정한다)
  shifts: WorkerShift[];
};

export type ResetWorkerPasswordRequest = {
  userId: number;
};

export type DeleteWorkerRequest = {
  userId: number;
};

const toWorker = (json: ApiJson<Worker>): Worker => ({
  ...json,
  workStartDate: parseApiDate(json.workStartDate),
});

const toWorkerShift = (json: ApiJson<WorkerShift>): WorkerShift => ({
  ...json,
  date: parseApiDate(json.date),
  checkedInAt: json.checkedInAt ? parseApiDateTime(json.checkedInAt) : null,
});

/**
 * 근로장학생 목업과 그 자리를 찾습니다. 없으면 오류를 냅니다.
 * @param userId 근로장학생 id
 * @returns WORKERS_MOCK 안의 순서와 그 근로장학생 JSON
 * @example findWorkerMock(1).index; // 0
 */
const findWorkerMock = (userId: number) => {
  const index = WORKERS_MOCK.findIndex((worker) => worker.userId === userId);
  const worker = WORKERS_MOCK[index];
  if (!worker) throw new Error(`근로장학생(${userId})을 찾을 수 없습니다.`);

  return { index, worker };
};

/**
 * GET /admin/workers
 * 같은 조직의 모든 근로장학생. 근로장학생 목록, 검색·선택 목록에 쓴다 (이름 검색은 화면에서 한다)
 */
export const getWorkers = (): GetWorkersResponse => ({
  workers: WORKERS_MOCK.map(toWorker),
});

/**
 * GET /admin/workers/monthly?year=&month=
 * 그 달 근로학생과 그 달 근무 기록
 */
export const getMonthlyWorkers = ({
  year,
  month,
}: GetMonthlyWorkersRequest): GetMonthlyWorkersResponse => {
  const userIds = getMonthlyUserIdsMock(year, month);

  return {
    year,
    month,
    workers: WORKERS_MOCK.filter(({ userId }) => userIds.includes(userId)).map((json) => ({
      ...toWorker(json),
      monthlyRecord: getMonthlyRecordMock(json.userId, year, month),
    })),
  };
};

/**
 * PATCH /admin/workers/{userId}
 * body: userId를 뺀 나머지 (바꾼 항목만)
 */
export const updateWorker = ({ userId, ...changes }: UpdateWorkerRequest): UpdateWorkerResponse => {
  const { index, worker } = findWorkerMock(userId);
  const updated = { ...worker, ...changes };
  WORKERS_MOCK[index] = updated;

  return toWorker(updated);
};

/**
 * GET /admin/workers/{userId}/work-shifts?startDate=&endDate=
 * 한 근로장학생의 기간 근무 구간과 출근 기록. 근태 요약·지각 기록·근로대장에 쓴다
 */
export const getWorkerShifts = ({
  userId,
  startDate,
  endDate,
}: GetWorkerShiftsRequest): GetWorkerShiftsResponse => ({
  userId,
  shifts: getWorkerShiftsMock(userId, toApiDate(startDate), toApiDate(endDate)).map(toWorkerShift),
});

/**
 * POST /admin/workers/{userId}/password-reset
 * 기존 비밀번호를 지우고 새 비밀번호를 발급한다. 새 비밀번호를 어떻게 전달할지는 아직 정하지 않았다 (응답 본문 없음)
 */
export const resetWorkerPassword = ({ userId }: ResetWorkerPasswordRequest) => {
  findWorkerMock(userId);
};

/**
 * DELETE /admin/workers/{userId}
 * 계정과 시간표·근로대장·개인정보 등 관련 정보를 모두 지운다 (응답 본문 없음, ADR 0001)
 */
export const deleteWorker = ({ userId }: DeleteWorkerRequest) => {
  WORKERS_MOCK.splice(findWorkerMock(userId).index, 1);
};
