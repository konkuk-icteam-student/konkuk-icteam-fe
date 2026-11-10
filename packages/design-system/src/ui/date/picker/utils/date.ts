import { compareISO } from '@konkuk-icteam-fe/design-system/date';
import { DateRange, DateRangePosition } from '../types/dateRange';

/**
 * 기간 선택 중 날짜를 클릭했을 때의 다음 기간을 만듭니다.
 * - 시작일이 없거나 이미 기간이 완성된 상태에서 클릭하면 그 날짜를 새 시작일로 잡습니다.
 * - 시작일만 있는 상태에서 다른 날짜를 클릭하면 기간을 확정합니다. (시작일과 같은 날도 가능)
 * - 시작일보다 이전 날짜를 클릭하면 두 날짜를 바꿔 이른 날을 시작일, 늦은 날을 종료일로 잡습니다.
 * - 두 날짜 사이에 선택 불가 날짜가 있으면 클릭한 날짜를 새 시작일로 잡습니다.
 * @param current 현재 선택된 기간
 * @param iso 클릭한 날짜 (YYYY-MM-DD)
 * @param disabledDates 선택할 수 없는 날짜 목록 (기간 안에 포함될 수 없음)
 * @returns 클릭 이후의 기간
 * @example const next = createNextDateRange({ start: '2024-01-10' }, '2024-01-15'); // { start: '2024-01-10', end: '2024-01-15' }
 * @example const swapped = createNextDateRange({ start: '2024-01-15' }, '2024-01-10'); // { start: '2024-01-10', end: '2024-01-15' }
 */
export const createNextDateRange = (
  current: DateRange | undefined,
  iso: string,
  disabledDates: string[] = [],
): DateRange => {
  const start = current?.start;
  const end = current?.end;

  if (!start || end) return { start: iso };

  // 시작일보다 앞 날짜를 누르면 두 날짜를 바꾼다
  const isBeforeStart = compareISO(iso, start) < 0;
  const rangeStart = isBeforeStart ? iso : start;
  const rangeEnd = isBeforeStart ? start : iso;

  const hasDisabledDateInRange = disabledDates.some(
    (disabledDate) =>
      compareISO(disabledDate, rangeStart) > 0 && compareISO(disabledDate, rangeEnd) < 0,
  );
  if (hasDisabledDateInRange) return { start: iso };

  return { start: rangeStart, end: rangeEnd };
};

/**
 * 기간 안에서 해당 날짜의 위치를 반환합니다.
 * 시작일만 고른 상태이거나 시작일과 종료일이 같은 경우처럼 띠를 그릴 필요가 없으면 undefined를 반환합니다.
 * @param iso 확인할 날짜 (YYYY-MM-DD)
 * @param range 선택된 기간
 * @returns 'start' | 'middle' | 'end' | undefined
 * @example const position = getDateRangePosition('2024-01-12', { start: '2024-01-10', end: '2024-01-15' }); // 'middle'
 */
export const getDateRangePosition = (
  iso: string,
  range?: DateRange,
): DateRangePosition | undefined => {
  const start = range?.start;
  const end = range?.end;

  if (!start || !end || start === end) return undefined;
  if (iso === start) return 'start';
  if (iso === end) return 'end';
  return compareISO(iso, start) > 0 && compareISO(iso, end) < 0 ? 'middle' : undefined;
};
