import type { WorkApplicationSettings } from '../../_apis/workApplications';
import { DEFAULT_UNAVAILABLE_TIME_RANGES } from '@/shared/config/slot';
import { parseMonthKey } from '../../_utils/monthKey';

/**
 * 아직 신청을 열지 않은 달의 기본 근로신청 설정을 만듭니다. 신청은 전달 20일 오전 9시부터 25일 오후 6시까지 받고, 점심시간(11:30 - 13:00)을 근무 불가 시간대로 미리 넣어 둡니다.
 * @param monthKey 신청을 받을 달 (YYYY-MM)
 * @returns 기본 설정
 * @example createDefaultSettings('2026-11').applyStartDate; // 2026년 10월 20일 09:00
 */
export const createDefaultSettings = (monthKey: string): WorkApplicationSettings => {
  const { year, month } = parseMonthKey(monthKey);

  return {
    applyStartDate: new Date(year, month - 2, 20, 9),
    applyEndDate: new Date(year, month - 2, 25, 18),
    maxConcurrentWorkers: 4,
    weeklyMinHours: 6,
    weeklyMaxHours: 15,
    monthlyMinHours: 30,
    monthlyMaxHours: 60,
    unavailableDates: [],
    unavailableTimeRanges: DEFAULT_UNAVAILABLE_TIME_RANGES.map((range) => ({ ...range })),
  };
};
