import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { createSlotKey } from '@/shared/utils/slot';
import { convertMinutesToTime, convertTimeToMinutes, MINUTES_PER_HOUR } from '@/shared/utils/time';

/**
 * 칸들을 날짜별로 이어진 구간으로 묶습니다. 요청·신청을 보낼 때 씁니다.
 * @param slots 칸 목록
 * @param slots[].date 날짜 'YYYY-MM-DD'
 * @param slots[].startTime 칸 시작 시각 'HH:mm'
 * @param slotMinutes 칸 하나의 길이 (분)
 * @returns 날짜·시작 시각 순으로 정렬한 구간 목록 (date는 'YYYY-MM-DD', start·end는 'HH:mm')
 * @example const ranges = mergeSlotsToRanges([{ date: '2026-10-27', startTime: '09:00' }, { date: '2026-10-27', startTime: '10:00' }], 60); // [{ date: '2026-10-27', start: '09:00', end: '11:00' }]
 */
export const mergeSlotsToRanges = (
  slots: { date: string; startTime: string }[],
  slotMinutes: number,
) => {
  const sortedSlots = [...slots].sort((a, b) =>
    createSlotKey(a.date, a.startTime).localeCompare(createSlotKey(b.date, b.startTime)),
  );

  return sortedSlots.reduce<{ date: string; start: string; end: string }[]>((ranges, slot) => {
    const startMinutes = convertTimeToMinutes(slot.startTime);
    const end = convertMinutesToTime(startMinutes + slotMinutes);
    const lastRange = ranges.at(-1);
    const isContinued =
      lastRange?.date === slot.date && convertTimeToMinutes(lastRange.end) === startMinutes;

    return isContinued
      ? [...ranges.slice(0, -1), { ...lastRange, end }]
      : [...ranges, { date: slot.date, start: slot.startTime, end }];
  }, []);
};

/**
 * 근무 칸 수를 시간으로 바꿉니다.
 * @param slotCount 30분 칸 수
 * @returns 근무 시간 (30분 칸은 0.5시간)
 * @example convertSlotCountToHours(3); // 1.5
 */
export const convertSlotCountToHours = (slotCount: number) =>
  (slotCount * SLOT_MINUTES) / MINUTES_PER_HOUR;

/**
 * 그 달에 든 근무 칸을 시간으로 셉니다. 표는 앞뒤 달 날짜도 보여 주므로 그 달 날짜만 셉니다.
 * @param slots 근무 칸 목록 (date는 'YYYY-MM-DD')
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 근무 시간 (30분 칸은 0.5시간)
 * @example getMonthWorkHours([{ date: '2026-11-02' }, { date: '2026-10-30' }], 2026, 11); // 0.5
 */
export const getMonthWorkHours = (slots: { date: string }[], year: number, month: number) =>
  convertSlotCountToHours(
    slots.filter(({ date }) => date.startsWith(`${year}-${formatNumber(month)}-`)).length,
  );
