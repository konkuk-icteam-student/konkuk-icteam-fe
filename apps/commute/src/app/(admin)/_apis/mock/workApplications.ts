import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import { parseApiDateTime, toApiDateTime, type ApiJson } from '@/app/(student)/_apis/common';
import type { WorkApplicationSettings, WorkApplicationSubmission } from '../workApplications';
import { WORKERS_MOCK } from './workers';

type SavedApplication = {
  settings: ApiJson<WorkApplicationSettings>;
};

// 근로장학생 한 명의 제출 (서버가 보낼 JSON 모양에서 학생 정보를 뺀 것)
type SavedSubmission = Pick<
  ApiJson<WorkApplicationSubmission>,
  'submittedMinutes' | 'lastSubmittedAt'
>;

// 화면 확인용 데모 제출 시간 (시간 단위). 명단 순서대로 돌려 쓴다. 월간 30~60시간 기준에서 24·18시간은 미충족이다
const DEMO_SUBMITTED_HOURS = [40, 36, 24, 52, 18, 44, 32, 60];

const createMonthKey = (year: number, month: number) => `${year}-${formatNumber(month)}`;

const getCurrentMonth = () => {
  const today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
};

/**
 * 그 달 근무를 신청할 수 있는 근로장학생 목업을 얻습니다. 근로를 시작하기 전 달에는 넣지 않습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 근로장학생 JSON 목록
 * @example getEligibleWorkersMock(2026, 9).length; // 9월에 근로 중인 학생 수
 */
const getEligibleWorkersMock = (year: number, month: number) => {
  const monthKey = createMonthKey(year, month);

  return WORKERS_MOCK.filter(({ workStartDate }) => workStartDate.slice(0, 7) <= monthKey);
};

/**
 * 근로신청을 열지 않고 지난 달 명단 목업을 만듭니다. 근로를 시작하기 전 달에는 넣지 않고, 달마다 한 명씩 돌아가며 쉽니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 그 달 근로학생 id 목록
 * @example createPastRosterMock(2026, 9); // [1, 2, 3, ...]
 */
const createPastRosterMock = (year: number, month: number) => {
  const monthKey = createMonthKey(year, month);
  const current = getCurrentMonth();
  const restingIndex =
    monthKey === createMonthKey(current.year, current.month)
      ? WORKERS_MOCK.length - 1
      : month % WORKERS_MOCK.length;

  return WORKERS_MOCK.filter(
    ({ workStartDate }, index) => workStartDate.slice(0, 7) <= monthKey && index !== restingIndex,
  ).map(({ userId }) => userId);
};

/**
 * 화면 확인용 데모 제출을 만듭니다. 지난 달 명단 규칙대로 쉬는 학생은 미제출이고, 나머지는 신청 기간 시작 뒤 몇 시간 간격으로 제출한 것으로 둡니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @param settings 그 달 근로신청 기준 JSON
 * @returns 근로장학생 id → 제출. 미제출 학생은 들어 있지 않다
 * @example createDemoSubmissionsMock(2026, 12, settings)[1]?.submittedMinutes; // 2400
 */
const createDemoSubmissionsMock = (
  year: number,
  month: number,
  settings: ApiJson<WorkApplicationSettings>,
): Record<number, SavedSubmission> => {
  const applyStart = parseApiDateTime(settings.applyStartDate);

  return Object.fromEntries(
    createPastRosterMock(year, month).map((userId, index) => {
      const submittedAt = new Date(applyStart);
      submittedAt.setHours(submittedAt.getHours() + index * 5, 41);

      return [
        userId,
        {
          submittedMinutes: DEMO_SUBMITTED_HOURS[index % DEMO_SUBMITTED_HOURS.length]! * 60,
          lastSubmittedAt: toApiDateTime(submittedAt),
        },
      ];
    }),
  );
};

// 이번 달 근로신청 기준 (지난 달에 이미 신청을 받았다)
const createCurrentMonthSettings = (): ApiJson<WorkApplicationSettings> => {
  const { year, month } = getCurrentMonth();
  const previous = new Date(year, month - 2, 1);
  const previousMonthKey = createMonthKey(previous.getFullYear(), previous.getMonth() + 1);

  return {
    applyStartDate: `${previousMonthKey}-20T09:00:00`,
    applyEndDate: `${previousMonthKey}-25T18:00:00`,
    maxConcurrentWorkers: 4,
    weeklyMinHours: 6,
    weeklyMaxHours: 15,
    monthlyMinHours: 30,
    monthlyMaxHours: 60,
    unavailableDates: [],
  };
};

// 저장한 근로신청 (YYYY-MM → 신청). 이번 달은 이미 신청을 받아 명단이 정해져 있다
const SAVED_APPLICATIONS: Record<string, SavedApplication> = (() => {
  const { year, month } = getCurrentMonth();

  return { [createMonthKey(year, month)]: { settings: createCurrentMonthSettings() } };
})();

// 들어온 제출 (YYYY-MM → 근로장학생 id → 제출)
const SAVED_SUBMISSIONS: Record<string, Record<number, SavedSubmission>> = (() => {
  const { year, month } = getCurrentMonth();

  return {
    [createMonthKey(year, month)]: createDemoSubmissionsMock(
      year,
      month,
      createCurrentMonthSettings(),
    ),
  };
})();

export const getWorkApplicationMock = (year: number, month: number) =>
  SAVED_APPLICATIONS[createMonthKey(year, month)];

/**
 * 근로신청 기준을 저장합니다. 처음 열면 화면 확인용 데모 제출을 채우고, 이미 연 달을 다시 저장하면 들어온 제출을 모두 지웁니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @param application 저장할 기준 JSON
 * @example saveWorkApplicationMock(2026, 12, { settings });
 */
export const saveWorkApplicationMock = (
  year: number,
  month: number,
  application: SavedApplication,
) => {
  const monthKey = createMonthKey(year, month);
  const isOpened = Boolean(SAVED_APPLICATIONS[monthKey]);

  SAVED_APPLICATIONS[monthKey] = application;
  SAVED_SUBMISSIONS[monthKey] = isOpened
    ? {}
    : createDemoSubmissionsMock(year, month, application.settings);
};

/**
 * 그 달 제출 현황 목업을 얻습니다. 신청을 연 달은 신청할 수 있는 모든 근로장학생이 나오고, 미제출이면 0분입니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 제출 JSON 목록. 열지 않은 달은 빈 배열
 * @example getWorkApplicationSubmissionsMock(2026, 12)[0]?.name; // '홍길동'
 */
export const getWorkApplicationSubmissionsMock = (
  year: number,
  month: number,
): ApiJson<WorkApplicationSubmission>[] => {
  if (!getWorkApplicationMock(year, month)) return [];

  const submissions = SAVED_SUBMISSIONS[createMonthKey(year, month)] ?? {};

  return getEligibleWorkersMock(year, month).map(
    ({ userId, name, studentId, department, grade }) => ({
      userId,
      name,
      studentId,
      department,
      grade,
      submittedMinutes: submissions[userId]?.submittedMinutes ?? 0,
      lastSubmittedAt: submissions[userId]?.lastSubmittedAt ?? null,
    }),
  );
};

/**
 * 그 달 근로학생 id 목업을 얻습니다. 신청을 연 달은 실제로 제출한 학생, 지난 달은 정해진 명단, 아직 열지 않은 달은 비어 있습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 그 달 근로학생 id 목록
 * @example getMonthlyUserIdsMock(2026, 10); // [1, 2, 3, 4, 5, 6, 7]
 */
export const getMonthlyUserIdsMock = (year: number, month: number) => {
  const submissions = SAVED_SUBMISSIONS[createMonthKey(year, month)];
  if (getWorkApplicationMock(year, month) && submissions) {
    return Object.keys(submissions).map(Number);
  }

  const current = getCurrentMonth();
  const isPastMonth = year * 12 + month < current.year * 12 + current.month;

  return isPastMonth ? createPastRosterMock(year, month) : [];
};
