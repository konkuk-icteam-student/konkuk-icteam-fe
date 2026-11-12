import type {
  WorkApplicationSettings,
  WorkApplicationSubmission,
} from '../../_apis/workApplications';

export type SubmissionSortKey = 'STATUS' | 'NAME' | 'RECENT';

// 근로신청 요약 정렬. 드롭다운에 이 순서로 보인다
export const SUBMISSION_SORT_LABELS: Record<SubmissionSortKey, string> = {
  STATUS: '상태순',
  NAME: '이름순',
  RECENT: '최근 신청순',
};

type MonthlyHoursRange = Pick<WorkApplicationSettings, 'monthlyMinHours' | 'monthlyMaxHours'>;

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
) => submittedMinutes >= monthlyMinHours * 60 && submittedMinutes <= monthlyMaxHours * 60;

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
) => {
  const metCount = submissions.filter(({ submittedMinutes }) =>
    checkMonthlyHoursMet(submittedMinutes, range),
  ).length;

  return {
    submittedCount: submissions.filter(({ lastSubmittedAt }) => lastSubmittedAt !== null).length,
    metCount,
    unmetCount: submissions.length - metCount,
  };
};

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

  return [...submissions].sort((a, b) => {
    const order =
      sortKey === 'STATUS'
        ? getStatusOrder(a) - getStatusOrder(b)
        : sortKey === 'RECENT'
          ? getRecentTime(b) - getRecentTime(a)
          : 0;

    return order !== 0 ? order : compareName(a, b);
  });
};

/**
 * 분을 시간 글자로 바꿉니다. 30분 단위가 남으면 분까지 적습니다.
 * @param minutes 분
 * @returns N시간 또는 N시간 M분
 * @example formatSubmittedHours(24 * 60); // '24시간'
 * @example formatSubmittedHours(90); // '1시간 30분'
 */
export const formatSubmittedHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  return restMinutes === 0 ? `${hours}시간` : `${hours}시간 ${restMinutes}분`;
};
