import { checkWeekend } from '@/shared/utils/calendar';
import { addDays, getMonthWeekInfo } from '@/shared/utils/week';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { parseMonthKey, shiftMonthKey } from '../../../_utils/monthKey';
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

/**
 * 시간표에서 볼 수 있는 마지막 달을 얻습니다. 이번 달이고, 다음 달 근로신청을 열었으면 그 달입니다.
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @param isApplicationOpened 다음 달 근로신청을 열었는지
 * @returns 마지막 달 (YYYY-MM)
 * @example getLastViewableMonthKey('2026-11', false); // '2026-11'
 */
export const getLastViewableMonthKey = (currentMonthKey: string, isApplicationOpened: boolean) =>
  isApplicationOpened ? shiftMonthKey(currentMonthKey, 1) : currentMonthKey;

/**
 * 시간표에서 다음 주로 넘길 수 있는 마지막 주를 얻습니다. 볼 수 있는 마지막 달의 마지막 주입니다.
 * 지난 주로는 막지 않으므로 처음 주는 없습니다.
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @param isApplicationOpened 다음 달 근로신청을 열었는지
 * @returns 마지막 주 월요일 (YYYY-MM-DD)
 * @example getLastViewableWeekStartKey('2026-11', true); // '2026-12-28'
 */
export const getLastViewableWeekStartKey = (
  currentMonthKey: string,
  isApplicationOpened: boolean,
) => getMonthLastWeekStartKey(getLastViewableMonthKey(currentMonthKey, isApplicationOpened));

/**
 * 날짜가 볼 수 있는 마지막 달보다 뒤인지 확인합니다. 신청을 열기 전 다음 달 칸처럼, 주에 걸쳐 보이지만 아직 다룰 수 없는 칸입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param lastViewableMonthKey 볼 수 있는 마지막 달 (YYYY-MM)
 * @returns 그 달보다 뒤면 true
 * @example checkDateBeyondMonth('2026-12-01', '2026-11'); // true
 */
export const checkDateBeyondMonth = (dateKey: string, lastViewableMonthKey: string) =>
  dateKey.slice(0, 7) > lastViewableMonthKey;

/**
 * 신청 받는 달(다음 달)이 든 주인지 확인합니다. 신청을 열었고 그 달 평일이 하루라도 있으면 true입니다.
 * 이 주에서는 설정 기준과 관계없이 편집할 수 있다고 알리고 승인 대기 패널을 숨깁니다.
 * @param weekStartKey 주의 월요일 (YYYY-MM-DD)
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @param isApplicationOpened 다음 달 근로신청을 열었는지
 * @returns 신청 받는 달이 든 주이면 true
 * @example checkApplicationWeek('2026-11-30', '2026-11', true); // true
 */
export const checkApplicationWeek = (
  weekStartKey: string,
  currentMonthKey: string,
  isApplicationOpened: boolean,
) => isApplicationOpened && checkWeekInMonth(weekStartKey, shiftMonthKey(currentMonthKey, 1));

/**
 * 근로신청 시간표를 처음 열 주를 얻습니다. 다음 달 신청을 열었으면 그 달 첫 주이고, 아니면 정하지 않습니다(이번 주).
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @param isApplicationOpened 다음 달 근로신청을 열었는지
 * @returns 처음 주 월요일 (YYYY-MM-DD). 신청 전이면 undefined
 * @example getApplicationInitialWeekStartKey('2026-11', true); // '2026-11-30'
 */
export const getApplicationInitialWeekStartKey = (
  currentMonthKey: string,
  isApplicationOpened: boolean,
) =>
  isApplicationOpened ? getMonthFirstWeekStartKey(shiftMonthKey(currentMonthKey, 1)) : undefined;

/**
 * 제목에 쓸 주의 달을 얻습니다.
 * - 신청을 열었고 신청 받는 달의 날이 하루라도 있으면 신청 받는 달 (11.30 - 12.04 → 12월)
 * - 신청을 열기 전 다음 달에 걸친 주는 이번 달 (11.30 - 12.04 → 11월)
 * - 그 밖에 두 달에 걸친 주는 목요일이 속한 달
 * @param weekStartKey 주의 월요일 (YYYY-MM-DD)
 * @param currentMonthKey 이번 달 (YYYY-MM)
 * @param isApplicationOpened 다음 달 근로신청을 열었는지
 * @returns 월 (1~12)
 * @example getWeekTitleMonth('2026-11-30', '2026-11', false); // 11
 */
export const getWeekTitleMonth = (
  weekStartKey: string,
  currentMonthKey: string,
  isApplicationOpened: boolean,
) => {
  const nextMonthKey = shiftMonthKey(currentMonthKey, 1);
  if (checkApplicationWeek(weekStartKey, currentMonthKey, isApplicationOpened)) {
    return parseMonthKey(nextMonthKey).month;
  }
  if (checkWeekInMonth(weekStartKey, nextMonthKey)) return parseMonthKey(currentMonthKey).month;

  return getMonthWeekInfo(parseISO(weekStartKey)).month;
};
