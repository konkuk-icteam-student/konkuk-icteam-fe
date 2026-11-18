import { checkWeekend } from '@/shared/utils/calendar';
import { addDays } from '@/shared/utils/week';
import { parseMonthKey } from '../../../_utils/monthKey';
import { getWeekDays, getWeekStartKey } from './weekKey';

/**
 * 그 달의 첫 평일이 들어 있는 주를 얻습니다. 1일이 주말이면 다음 주 월요일입니다.
 * @param monthKey 달 (YYYY-MM)
 * @returns 그 주 월요일 (YYYY-MM-DD)
 * @example getMonthFirstWeekStartKey('2026-12'); // '2026-11-30' (12.01이 화요일)
 */
export const getMonthFirstWeekStartKey = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey);
  const firstDate = new Date(year, month - 1, 1);
  const weekendDayCount = checkWeekend(firstDate) ? (firstDate.getDay() === 6 ? 2 : 1) : 0;

  return getWeekStartKey(addDays(firstDate, weekendDayCount));
};

/**
 * 그 달의 마지막 평일이 들어 있는 주를 얻습니다. 주를 넘길 수 있는 끝으로 씁니다.
 * @param monthKey 달 (YYYY-MM)
 * @returns 그 주 월요일 (YYYY-MM-DD)
 * @example getMonthLastWeekStartKey('2026-12'); // '2026-12-28'
 */
export const getMonthLastWeekStartKey = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey);
  const lastDate = new Date(year, month, 0);
  const weekendDayCount = checkWeekend(lastDate) ? (lastDate.getDay() === 0 ? 2 : 1) : 0;

  return getWeekStartKey(addDays(lastDate, -weekendDayCount));
};

/**
 * 주의 평일(월~금) 중 그 달 날짜가 하루라도 있는지 확인합니다.
 * @param weekStartKey 주의 월요일 (YYYY-MM-DD)
 * @param monthKey 달 (YYYY-MM)
 * @returns 그 달 평일이 있으면 true
 * @example checkWeekInMonth('2026-11-30', '2026-12'); // true (12.01 ~ 12.04)
 */
export const checkWeekInMonth = (weekStartKey: string, monthKey: string) =>
  getWeekDays(weekStartKey).some(({ dateKey }) => dateKey.startsWith(`${monthKey}-`));
