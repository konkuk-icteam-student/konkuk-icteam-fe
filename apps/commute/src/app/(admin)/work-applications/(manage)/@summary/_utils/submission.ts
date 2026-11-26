import { MINUTES_PER_HOUR } from '@/shared/utils/time';
import type {
  WorkApplicationSettings,
  WorkApplicationSubmission,
} from '../../../../_apis/workApplications';

export type SubmissionSortKey = 'STATUS' | 'NAME' | 'RECENT';

// 근로신청 요약 정렬
export const SUBMISSION_SORT_LABELS: Record<SubmissionSortKey, string> = {
  STATUS: '상태순',
  NAME: '이름순',
  RECENT: '최근 신청순',
};

type MonthlyHoursRange = Pick<WorkApplicationSettings, 'monthlyMinHours' | 'monthlyMaxHours'>;

// 제출 현황 인원
export type SubmissionCounts = {
  submittedCount: number;
  metCount: number;
  unmetCount: number;
};

// 월간 기준 충족 여부를 붙인 제출
export type SubmissionWithStatus = WorkApplicationSubmission & { isMet: boolean };

/**
 * 총 제출시간이 월간 근로시간 기준을 충족하는지 확인합니다. 주간 기준은 보지 않습니다.
 * @param submittedMinutes 총 제출시간 (분). 미제출이면 0
 * @param range 월간 근로시간 기준
 * @param range.monthlyMinHours 월간 최소 (시간)
 * @param range.monthlyMaxHours 월간 최대 (시간)
 * @returns 월간 최소 이상, 최대 이하이면 true
 * @example checkMonthlyHoursMet(30 * 60, { monthlyMinHours: 30, monthlyMaxHours: 60 }); // true
 */
export const checkMonthlyHoursMet = (
  submittedMinutes: number,
  { monthlyMinHours, monthlyMaxHours }: MonthlyHoursRange,
) =>
  submittedMinutes >= monthlyMinHours * MINUTES_PER_HOUR &&
  submittedMinutes <= monthlyMaxHours * MINUTES_PER_HOUR;

/**
 * 제출 현황을 셉니다. 미제출은 미충족에 함께 세서 충족 + 미충족 = 전체 근로장학생입니다.
 * @param submissions 근로장학생별 제출
 * @param range 월간 근로시간 기준
 * @param range.monthlyMinHours 월간 최소 (시간)
 * @param range.monthlyMaxHours 월간 최대 (시간)
 * @returns 제출·충족·미충족 인원
 * @example getSubmissionCounts(submissions, settings); // { submittedCount: 6, metCount: 4, unmetCount: 3 }
 */
export const getSubmissionCounts = (
  submissions: WorkApplicationSubmission[],
  range: MonthlyHoursRange,
): SubmissionCounts => {
  const metCount = submissions.filter(({ submittedMinutes }) =>
    checkMonthlyHoursMet(submittedMinutes, range),
  ).length;

  return {
    submittedCount: submissions.filter(({ lastSubmittedAt }) => lastSubmittedAt !== null).length,
    metCount,
    unmetCount: submissions.length - metCount,
  };
};

/**
 * 두 제출을 학생 이름 가나다순으로 비교합니다. 정렬 기준이 같을 때 순서를 정합니다.
 * @param a 앞 제출
 * @param b 뒤 제출
 * @returns a가 앞이면 음수, 뒤면 양수, 같으면 0
 * @example compareName(김민지의 제출, 윤도현의 제출); // 음수 (김민지가 앞)
 */
const compareName = (a: WorkApplicationSubmission, b: WorkApplicationSubmission) =>
  a.name.localeCompare(b.name, 'ko');

/**
 * 제출 목록을 정렬한 새 배열을 만듭니다.
 * 상태순은 미충족(미제출 포함)이 먼저, 최근 신청순은 최근에 낸 학생이 먼저이고 미제출은 맨 뒤입니다. 순서가 같으면 이름순입니다.
 * @param submissions 근로장학생별 제출
 * @param sortKey 정렬 기준
 * @param range 월간 근로시간 기준
 * @param range.monthlyMinHours 월간 최소 (시간)
 * @param range.monthlyMaxHours 월간 최대 (시간)
 * @returns 정렬한 제출 목록 (원래 배열은 그대로)
 * @example createSortedSubmissions(submissions, 'STATUS', settings)[0]; // 미충족인 학생
 */
export const createSortedSubmissions = (
  submissions: WorkApplicationSubmission[],
  sortKey: SubmissionSortKey,
  range: MonthlyHoursRange,
) => {
  const getStatusOrder = ({ submittedMinutes }: WorkApplicationSubmission) =>
    checkMonthlyHoursMet(submittedMinutes, range) ? 1 : 0;
  // 미제출은 0으로 두어 최근 신청순에서 맨 뒤로 간다
  const getRecentTime = ({ lastSubmittedAt }: WorkApplicationSubmission) =>
    lastSubmittedAt?.getTime() ?? 0;

  // 이름순은 기준이 따로 없어서 아래 이름 비교로만 정한다
  const compareBySortKey: Record<
    SubmissionSortKey,
    (a: WorkApplicationSubmission, b: WorkApplicationSubmission) => number
  > = {
    STATUS: (a, b) => getStatusOrder(a) - getStatusOrder(b),
    NAME: () => 0,
    RECENT: (a, b) => getRecentTime(b) - getRecentTime(a),
  };

  return [...submissions].sort((a, b) => compareBySortKey[sortKey](a, b) || compareName(a, b));
};
