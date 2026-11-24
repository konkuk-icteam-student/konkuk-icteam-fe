import type { TodoPeriod } from '@/app/(student)/_apis/todos';
import { convertDateToTime } from '@/shared/utils/time';

// 시간대 이름. 탭과 빈 상태 문구가 같이 쓴다
export const PERIOD_LABELS: Record<TodoPeriod, string> = {
  MORNING: '오전',
  AFTERNOON: '오후',
};

// 화면에 놓는 시간대 순서
export const TODO_PERIODS: TodoPeriod[] = ['MORNING', 'AFTERNOON'];

// 주소 쿼리(?period=)
export const PERIOD_PARAMS: Record<TodoPeriod, string> = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
};

const NOON = '12:00';

/**
 * 시각이 어느 시간대인지 얻습니다. 근무 칸 시작 시각과 지금 시각에 같이 씁니다.
 * @param start 시각 (HH:mm)
 * @returns 12시 전이면 MORNING, 아니면 AFTERNOON
 * @example getSlotPeriod('11:00'); // 'MORNING'
 */
export const getSlotPeriod = (start: string): TodoPeriod =>
  start < NOON ? 'MORNING' : 'AFTERNOON';

/**
 * 주소 쿼리에서 시간대를 얻습니다. 쿼리가 없거나 모르는 값이면 지금 시각으로 정합니다.
 * @param periodParam ?period= 값
 * @param now 지금 시각
 * @returns 보여 줄 시간대
 * @example getPeriodFromParam('afternoon', new Date()); // 'AFTERNOON'
 * @example getPeriodFromParam(undefined, new Date(2026, 10, 24, 9)); // 'MORNING'
 */
export const getPeriodFromParam = (periodParam: string | undefined, now: Date): TodoPeriod => {
  const matchedPeriod = TODO_PERIODS.find((period) => PERIOD_PARAMS[period] === periodParam);

  return matchedPeriod ?? getSlotPeriod(convertDateToTime(now));
};
