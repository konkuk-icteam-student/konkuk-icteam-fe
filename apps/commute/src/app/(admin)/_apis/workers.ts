import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  type ApiJson,
  type WorkTimeRange,
} from '@/app/(student)/_apis/common';
import { getWorkerDetailMock, getWorkerListMock } from './mock/workerRecords';
import { getWorkerShiftsMock } from './mock/workerShifts';
import { WORKERS_MOCK } from './mock/workers';

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
  // 근로를 시작한 날
  workStartDate: Date;
};

// 근무 기록. 기준일(date)이 속한 주(월~일)·달 기준이고, 시간은 모두 분 단위다.
// 최대 근로시간은 사람마다 다를 수 있고, 그 달 근로학생이 아니면 0이다
export type WorkerWorkRecord = {
  weeklyWorkedMinutes: number;
  weeklyLimitMinutes: number;
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
  totalChangeRequestCount: number;
  approvedChangeRequestCount: number;
};

// 근무 인원 목록 한 줄. workStartDate·lateMinutes는 목록 화면에 필요해 백엔드에 추가를 요청한 필드다
export type WorkerListItem = Pick<
  Worker,
  'userId' | 'name' | 'studentId' | 'department' | 'grade' | 'phoneNumber' | 'workStartDate'
> &
  WorkerWorkRecord & {
    // 그 달 근태 이상(지각·결근) 횟수
    totalAttendanceIssueCount: number;
    // 그 달 지각 횟수와 늦은 분 합계
    lateCount: number;
    lateMinutes: number;
  };

export type GetWorkerListRequest = {
  date: Date;
  // 이름 검색어. 비우면 모두
  keyword?: string;
  // 0부터
  page: number;
  size: number;
};

export type GetWorkerListResponse = {
  date: Date;
  workers: WorkerListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// 근무 인원 상세
export type WorkerDetail = Worker &
  WorkerWorkRecord & {
    date: Date;
    // 그 달 제출한 근무시간 (분). 뜻은 백엔드 확인 필요
    submittedMinutes: number;
    // 마지막 근무 변경 요청 시각. 요청한 적이 없으면 null
    lastRequestedAt: Date | null;
  };

export type GetWorkerDetailRequest = {
  userId: number;
  date: Date;
};

export type GetWorkerDetailResponse = WorkerDetail;

export type GetWorkersResponse = {
  workers: Worker[];
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
  // 날짜·시작 시각 순. 예정·근무중·결근 근무도 모두 온다 (서버 근태 API가 정해지기 전까지 근태는 화면에서 계산한다)
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

const toWorkerDetail = (json: ApiJson<WorkerDetail>): WorkerDetail => ({
  ...json,
  workStartDate: parseApiDate(json.workStartDate),
  date: parseApiDate(json.date),
  // 이 값만 'YYYY-MM-DD HH:mm' 모양으로 온다 (공통 규칙과 달라 백엔드 확인 필요)
  lastRequestedAt: json.lastRequestedAt
    ? parseApiDateTime(json.lastRequestedAt.replace(' ', 'T'))
    : null,
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
 * GET /admin/workers?date=&keyword=&page=&size=
 * 근무 인원 목록. 기준일이 속한 주·달의 근무 기록이 붙는다. 이름 검색과 페이지 나누기는 서버가 한다
 */
export const getWorkerList = ({
  date,
  keyword = '',
  page,
  size,
}: GetWorkerListRequest): GetWorkerListResponse => {
  const json = getWorkerListMock({ dateKey: toApiDate(date), keyword: keyword.trim(), page, size });

  return {
    ...json,
    date: parseApiDate(json.date),
    workers: json.workers.map((worker) => ({
      ...worker,
      workStartDate: parseApiDate(worker.workStartDate),
    })),
  };
};

/**
 * GET /admin/workers/{userId}?date=
 * 근무 인원 상세. 기준일이 속한 주·달의 근무 기록이 붙는다
 */
export const getWorkerDetail = ({
  userId,
  date,
}: GetWorkerDetailRequest): GetWorkerDetailResponse =>
  toWorkerDetail(getWorkerDetailMock(userId, toApiDate(date)));

/**
 * 모든 근로장학생 (페이지 없이). 근로시간 관리·근로신청 관리의 검색·선택 목록에 쓴다.
 * 실제 GET /admin/workers는 페이지로 나눠 주므로, 이 화면들이 전체 목록을 받을 방법은 백엔드와 정해야 한다
 */
export const getWorkers = (): GetWorkersResponse => ({
  workers: WORKERS_MOCK.map(toWorker),
});

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
 * GET /admin/workers/{userId}/work-shifts?startDate=&endDate= (백엔드에 요청할 API)
 * 한 근로장학생의 기간 근무 구간과 출근 기록. 상세 API에 없는 근태 요약(지각·결근)·지각 기록·근로대장 표에 쓴다
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
 * 근로장학생 학교 메일로 비밀번호 재설정 링크를 보낸다. 근로장학생이 링크를 눌러 새 비밀번호를 정한다 (응답 본문 없음)
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
