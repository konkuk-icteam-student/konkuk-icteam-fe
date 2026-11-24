import { describe, expect, it } from 'vitest';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { MIN_WORK_HOURS_PER_SHIFT } from '@/shared/config/workHours';
import { getMonthDates } from '@/shared/utils/calendar';
import { checkUnavailableSlot } from '@/shared/utils/slot';
import { getUnavailableTimeRangesMock } from './workApplications';
import { convertTimeToMinutes } from '@/shared/utils/time';
import { createWorkScheduleMock, getDaySlotsMock } from './workSchedules';
import { getCurrentMonthKey, parseMonthKey } from '@/app/(admin)/_utils/monthKey';

const MIN_SHIFT_MINUTES = MIN_WORK_HOURS_PER_SHIFT * 60;

/**
 * 한 사람이 그날 근무하는 칸들을 이어진 구간의 길이(분)로 묶습니다.
 * @param startTimes 근무 칸 시작 시각 목록 (HH:mm, 시간순)
 * @returns 이어진 구간마다의 길이 (분)
 * @example getShiftLengths(['09:00', '09:30', '13:00']); // [60, 30]
 */
const getShiftLengths = (startTimes: string[]) =>
  startTimes
    .reduce<{ end: number; length: number }[]>((shifts, startTime) => {
      const start = convertTimeToMinutes(startTime);
      const lastShift = shifts.at(-1);

      return lastShift?.end === start
        ? [
            ...shifts.slice(0, -1),
            { end: start + SLOT_MINUTES, length: lastShift.length + SLOT_MINUTES },
          ]
        : [...shifts, { end: start + SLOT_MINUTES, length: SLOT_MINUTES }];
    }, [])
    .map(({ length }) => length);

describe('관리자 근무 시간표 목업', () => {
  // 근로신청을 저장해 둔 이번 달로 본다 (저장 안 한 달은 막힌 칸이 없다)
  const monthKey = getCurrentMonthKey();
  const { year, month } = parseMonthKey(monthKey);
  const dateKeys = getMonthDates(new Date(year, month - 1, 1));

  it('그 달 근무 불가 시간대 칸에는 아무도 근무하지 않는다', () => {
    const unavailableTimeRanges = getUnavailableTimeRangesMock(year, month);

    dateKeys.forEach((dateKey) => {
      getDaySlotsMock(dateKey)
        .filter(({ start }) => checkUnavailableSlot(start, unavailableTimeRanges))
        .forEach(({ users }) => expect(users).toEqual([]));
    });
  });

  it('이어진 근무는 모두 최소 근무 시간 이상이다 (30분만 근무하는 구간이 없다)', () => {
    dateKeys.forEach((dateKey) => {
      const slots = getDaySlotsMock(dateKey);
      const userIds = [...new Set(slots.flatMap(({ users }) => users.map(({ userId }) => userId)))];

      userIds.forEach((userId) => {
        const startTimes = slots
          .filter(({ users }) => users.some((user) => user.userId === userId))
          .map(({ start }) => start);

        getShiftLengths(startTimes).forEach((length) =>
          expect(length, `${dateKey} userId ${userId}`).toBeGreaterThanOrEqual(MIN_SHIFT_MINUTES),
        );
      });
    });
  });

  it('근무 불가 시간대 칸에 근무를 넣으려 하면 거부한다', () => {
    expect(() =>
      createWorkScheduleMock({ userId: 1, date: `${monthKey}-15`, start: '12:00', end: '12:30' }),
    ).toThrow();
  });
});
