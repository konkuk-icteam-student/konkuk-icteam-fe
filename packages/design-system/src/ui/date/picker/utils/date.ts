import { DateRange, DateRangePosition } from '../types/dateRange';

/**
 * 숫자를 2자리로 패딩합니다. (예: 5 -> "05")
 * @param num 숫자
 * @returns 2자리로 패딩된 문자열
 * @example const padded = formatNumber(5); // '05'
 */
export const formatNumber = (num: number) => String(num).padStart(2, '0');

/**
 * 날짜를 ISO 형식(YYYY-MM-DD)으로 변환합니다.
 * @param date 날짜 객체
 * @returns ISO 형식 문자열 (YYYY-MM-DD)
 * @example const isoString = toISO(new Date(2024, 0, 15)); // '2024-01-15'
 */
export const toISO = (date: Date) => {
  const y = date.getFullYear();
  const m = formatNumber(date.getMonth() + 1);
  const d = formatNumber(date.getDate());
  return `${y}-${m}-${d}`;
};

/**
 * ISO 형식(YYYY-MM-DD) 문자열을 로컬 시간 기준 날짜 객체로 변환합니다.
 * (new Date('YYYY-MM-DD')는 UTC로 해석되어 시간대에 따라 하루가 어긋날 수 있어 직접 파싱합니다)
 * @param iso ISO 형식 문자열 (YYYY-MM-DD)
 * @returns 로컬 시간 기준 날짜 객체
 * @example const date = parseISO('2024-01-15'); // 2024년 1월 15일 (로컬)
 */
export const parseISO = (iso: string) => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 해당 날짜의 월 시작일을 반환합니다.
 * @param date 날짜 객체
 * @returns 해당 월의 시작일 날짜 객체
 * @example const start = startOfMonth(new Date(2024, 0, 15)); // 2024년 1월 1일
 */
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * 날짜에 월 단위로 델타를 더한 새로운 날짜 객체를 반환합니다.
 * @param date 기준 날짜 객체
 * @param delta 더할 월 수 (음수 가능)
 * @returns 새로운 날짜 객체 (월의 첫째 날)
 * @example const nextMonth = addMonths(new Date(2024, 0, 15), 1); // 2024년 2월 1일
 */
export const addMonths = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

/**
 * 해당 날짜가 속한 월의 총 일수를 반환합니다.
 * @param date 날짜 객체
 * @returns 해당 월의 총 일수
 * @example const totalDays = daysInMonth(new Date(2024, 1, 1)); // 29 (2024년 2월)
 */
export const daysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

/**
 * 두 ISO 형식 날짜 문자열을 비교합니다.
 * @param a 첫 번째 ISO 형식 문자열
 * @param b 두 번째 ISO 형식 문자열
 * @returns 비교 결과 (음수: a < b, 0: a == b, 양수: a > b)
 * @example const result = compareISO('2024-01-15', '2024-01-20'); // result < 0
 */
export const compareISO = (a: string, b: string) => a.localeCompare(b);

/**
 * 기간 선택 중 날짜를 클릭했을 때의 다음 기간을 만듭니다.
 * - 시작일이 없거나 이미 기간이 완성된 상태에서 클릭하면 그 날짜를 새 시작일로 잡습니다.
 * - 시작일만 있는 상태에서 시작일 이후 날짜를 클릭하면 종료일로 확정합니다. (시작일과 같은 날도 가능)
 * - 시작일보다 이전 날짜이거나, 시작일과 클릭한 날짜 사이에 선택 불가 날짜가 있으면 그 날짜를 새 시작일로 잡습니다.
 * @param current 현재 선택된 기간
 * @param iso 클릭한 날짜 (YYYY-MM-DD)
 * @param disabledDates 선택할 수 없는 날짜 목록 (기간 안에 포함될 수 없음)
 * @returns 클릭 이후의 기간
 * @example const next = createNextDateRange({ start: '2024-01-10' }, '2024-01-15'); // { start: '2024-01-10', end: '2024-01-15' }
 */
export const createNextDateRange = (
  current: DateRange | undefined,
  iso: string,
  disabledDates: string[] = [],
): DateRange => {
  const start = current?.start;
  const end = current?.end;

  if (!start || end) return { start: iso };

  const isBeforeStart = compareISO(iso, start) < 0;
  const hasDisabledDateInRange = disabledDates.some(
    (disabledDate) => compareISO(disabledDate, start) > 0 && compareISO(disabledDate, iso) < 0,
  );
  if (isBeforeStart || hasDisabledDateInRange) return { start: iso };

  return { start, end: iso };
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
