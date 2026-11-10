import type { TodoPeriod } from '../../_apis/todos';
import type { WorkScheduleSlot } from '../../_apis/workSchedules';
import { removeDuplicatesBy } from '@/shared/utils/array';
import type { TimeRange } from '@/shared/utils/time';
import { PERIODS } from '../../_constants/period';

// 그 시간대에 근무하는 근로학생. 업무는 이 사람들에게만, 근무하는 칸 안의 시간으로만 맡길 수 있다
export type OnDutyWorker = {
  userId: number;
  userName: string;
  // 그 시간대에 근무하는 칸. 시작 시각 순이다
  workSlots: TimeRange[];
};

/**
 * 오전·오후를 합쳐 사람마다 그날 근무하는 칸 수를 셉니다.
 * @param slots 하루치 근무 칸
 * @returns 근로학생 id → 그날 근무 칸 수
 * @example countDailySlots(slots).get(1); // 4
 */
const countDailySlots = (slots: WorkScheduleSlot[]) => {
  const dailySlotCounts = new Map<number, number>();
  slots.forEach(({ users }) =>
    users.forEach(({ userId }) =>
      dailySlotCounts.set(userId, (dailySlotCounts.get(userId) ?? 0) + 1),
    ),
  );
  return dailySlotCounts;
};

/**
 * 주어진 칸에서 근무자를 한 번씩만 모읍니다. 그날 근무 칸이 많은 순이고, 같으면 먼저 근무를 시작하는 순입니다.
 * @param targetSlots 근무자를 모을 칸
 * @param dailySlotCounts 근로학생 id → 그날 근무 칸 수 (countDailySlots 결과)
 * @returns 근무자 목록과 사람마다 targetSlots 안에서 근무하는 칸
 * @example collectWorkers(morningSlots, countDailySlots(slots))[0].userName; // '김민지'
 */
const collectWorkers = (
  targetSlots: WorkScheduleSlot[],
  dailySlotCounts: Map<number, number>,
): OnDutyWorker[] => {
  const getDailySlotCount = (userId: number) => dailySlotCounts.get(userId) ?? 0;

  return removeDuplicatesBy(
    targetSlots.flatMap(({ users }) => users),
    ({ userId }) => userId,
  )
    .map(({ userId, userName }) => ({
      userId,
      userName,
      workSlots: targetSlots
        .filter(({ users }) => users.some((user) => user.userId === userId))
        .map(({ start, end }) => ({ start, end })),
    }))
    .sort((first, second) => getDailySlotCount(second.userId) - getDailySlotCount(first.userId));
};

/**
 * 근무 칸에서 시간대별로 근무하는 근로학생을 한 번씩만 모읍니다. 시간대는 PERIODS 기준(12시 전 시작이면 오전)이고,
 * 사람 순서는 오전·오후를 합친 그날 근무 칸이 많은 순이고, 같으면 그 시간대에 먼저 근무를 시작하는 순서입니다.
 * @param slots 하루치 근무 칸
 * @returns 오전·오후 근무자 목록과 사람마다 근무하는 칸
 * @example getWorkersByPeriod(slots).MORNING[0]; // { userId: 2, userName: '김민지', workSlots: [{ start: '09:00', end: '09:30' }, ...] }
 */
export const getWorkersByPeriod = (
  slots: WorkScheduleSlot[],
): Record<TodoPeriod, OnDutyWorker[]> => {
  const dailySlotCounts = countDailySlots(slots);

  return Object.fromEntries(
    PERIODS.map(({ period, checkHour }) => [
      period,
      collectWorkers(
        slots.filter(({ start }) => checkHour(Number(start.split(':')[0]))),
        dailySlotCounts,
      ),
    ]),
  ) as Record<TodoPeriod, OnDutyWorker[]>;
};

/**
 * 하루 동안 근무하는 근로학생을 오전·오후 구분 없이 한 번씩만 모읍니다.
 * 사람 순서는 그날 근무 칸이 많은 순이고, 같으면 먼저 근무를 시작하는 순서입니다.
 * @param slots 하루치 근무 칸
 * @returns 그날 근무자 목록과 사람마다 근무하는 칸
 * @example getDailyWorkers(slots)[0]; // { userId: 5, userName: '정하준', workSlots: [{ start: '14:00', end: '14:30' }, ...] }
 */
export const getDailyWorkers = (slots: WorkScheduleSlot[]): OnDutyWorker[] =>
  collectWorkers(slots, countDailySlots(slots));
