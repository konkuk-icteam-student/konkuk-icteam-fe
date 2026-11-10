import { addDays, DAYS_PER_WEEK, getMondayOfWeek, type DayRange } from '@/shared/utils/week';
import { getMonthDateRange, getMonthKeyOfDate } from '../../_utils/monthKey';

/**
 * 근로대장에서 넘길 수 있는 달의 처음과 끝을 얻습니다. 근로 시작 달부터 이번 달까지입니다.
 * 근로 시작 달이 이번 달보다 뒤면 이번 달만 볼 수 있습니다.
 * @param workStartDate 근로를 시작한 달의 1일
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @returns 처음 달과 마지막 달 (YYYY-MM)
 * @example getLedgerMonthBounds(new Date(2025, 2, 1), '2026-11'); // { firstMonthKey: '2025-03', lastMonthKey: '2026-11' }
 */
export const getLedgerMonthBounds = (workStartDate: Date, currentMonthKey: string) => {
  const workStartMonthKey = getMonthKeyOfDate(workStartDate);

  return {
    firstMonthKey: workStartMonthKey < currentMonthKey ? workStartMonthKey : currentMonthKey,
    lastMonthKey: currentMonthKey,
  };
};

/**
 * 근로대장에 쓸 근무를 불러올 기간을 얻습니다. 그 달 전체를 불러오고, 이번 달이면 이번 주 누적을 셀 수 있게
 * 이번 주 월요일이 지난달이어도 그 월요일부터 불러옵니다.
 * @param monthKey 보는 달 (YYYY-MM)
 * @param today 오늘
 * @returns 불러올 기간(fetchRange)과 이번 주 월~일(week). 이번 달이 아니면 week는 null
 * @example getLedgerShiftRange('2026-12', new Date(2026, 11, 2)).fetchRange.startDate; // 2026-11-30
 */
export const getLedgerShiftRange = (
  monthKey: string,
  today: Date,
): { fetchRange: DayRange; week: DayRange | null } => {
  const month = getMonthDateRange(monthKey);
  if (monthKey !== getMonthKeyOfDate(today)) return { fetchRange: month, week: null };

  const monday = getMondayOfWeek(today);

  return {
    fetchRange: {
      startDate: monday < month.startDate ? monday : month.startDate,
      endDate: month.endDate,
    },
    week: { startDate: monday, endDate: addDays(monday, DAYS_PER_WEEK - 1) },
  };
};
