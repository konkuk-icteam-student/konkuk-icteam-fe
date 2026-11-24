import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import type { DayRange } from '@/shared/utils/week';

/**
 * 년·월 키를 만듭니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns YYYY-MM
 * @example createMonthKey(2026, 10); // '2026-10'
 */
export const createMonthKey = (year: number, month: number) => `${year}-${formatNumber(month)}`;

/**
 * 날짜가 속한 달의 년·월 키를 얻습니다.
 * @param date 날짜
 * @returns YYYY-MM
 * @example getMonthKeyOfDate(new Date(2025, 2, 1)); // '2025-03'
 */
export const getMonthKeyOfDate = (date: Date) =>
  createMonthKey(date.getFullYear(), date.getMonth() + 1);

/**
 * 이번 달 년·월 키를 얻습니다.
 * @returns 오늘이 속한 달의 YYYY-MM
 * @example getCurrentMonthKey(); // '2026-10'
 */
export const getCurrentMonthKey = () => {
  const today = new Date();
  return createMonthKey(today.getFullYear(), today.getMonth() + 1);
};

/**
 * 년·월 키를 연도와 월 숫자로 나눕니다. API 요청에 쓰는 모양입니다.
 * @param monthKey YYYY-MM
 * @returns 연도와 월 (1~12)
 * @example parseMonthKey('2026-10'); // { year: 2026, month: 10 }
 */
export const parseMonthKey = (monthKey: string) => {
  const [year = 0, month = 1] = monthKey.split('-').map(Number);
  return { year, month };
};

/**
 * 그 달의 첫날과 마지막 날을 얻습니다.
 * @param monthKey YYYY-MM
 * @returns 첫날과 마지막 날 (0시)
 * @example getMonthDateRange('2026-02'); // { startDate: 2026-02-01, endDate: 2026-02-28 }
 */
export const getMonthDateRange = (monthKey: string): DayRange => {
  const { year, month } = parseMonthKey(monthKey);

  return { startDate: new Date(year, month - 1, 1), endDate: new Date(year, month, 0) };
};

/**
 * 년·월 키를 앞뒤로 옮깁니다.
 * @param monthKey YYYY-MM
 * @param delta 옮길 달 수 (음수면 이전 달)
 * @returns 옮긴 달의 YYYY-MM
 * @example shiftMonthKey('2026-12', 1); // '2027-01'
 */
export const shiftMonthKey = (monthKey: string, delta: number) => {
  const { year, month } = parseMonthKey(monthKey);
  const date = new Date(year, month - 1 + delta, 1);

  return createMonthKey(date.getFullYear(), date.getMonth() + 1);
};
