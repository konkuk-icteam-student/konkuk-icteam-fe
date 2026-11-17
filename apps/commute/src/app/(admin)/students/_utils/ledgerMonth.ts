import { getMonthDateRange, getMonthKeyOfDate } from '../../_utils/monthKey';

/**
 * 근로대장에서 넘길 수 있는 달의 처음과 끝을 얻습니다. 근로 시작 달부터 이번 달까지입니다.
 * 근로 시작 달이 이번 달보다 뒤면 이번 달만 볼 수 있습니다.
 * @param workStartDate 근로를 시작한 날
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
 * 근로대장 카드에 쓸 누적 근무시간을 받으려고 상세 API에 보낼 기준일을 얻습니다.
 * 이번 달은 오늘(이번 주·이번 달 누적), 지난달은 그 달 마지막 날(그 달 누적)입니다.
 * @param monthKey 보는 달 (YYYY-MM)
 * @param today 오늘
 * @returns 기준일
 * @example getLedgerDate('2026-09', new Date(2026, 10, 17)); // 2026-09-30
 */
export const getLedgerDate = (monthKey: string, today: Date) =>
  monthKey === getMonthKeyOfDate(today) ? today : getMonthDateRange(monthKey).endDate;
