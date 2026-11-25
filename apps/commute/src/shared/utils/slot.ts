import type { TimeRange } from '@/shared/utils/timeRange';

/**
 * 칸이 근무 불가 시간대에 걸리는지 확인합니다. 시간대의 시작은 포함하고 끝은 포함하지 않습니다.
 * @param start 칸 시작 시각 (HH:mm)
 * @param unavailableTimeRanges 그 달 근로신청 기준의 근무 불가 시간대
 * @returns 근무 불가 칸이면 true
 * @example checkUnavailableSlot('12:00', [{ start: '11:30', end: '13:00' }]); // true
 */
export const checkUnavailableSlot = (start: string, unavailableTimeRanges: readonly TimeRange[]) =>
  unavailableTimeRanges.some((range) => start >= range.start && start < range.end);
