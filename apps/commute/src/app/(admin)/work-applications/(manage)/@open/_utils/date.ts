import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { checkHoliday, checkWeekend, getMonthDates } from '@/shared/utils/calendar';
import type { GetWorkApplicationRequest } from '../../../../_apis/workApplications';

/**
 * 한 달 중 원래 근무가 없는 날(주말·공휴일)을 얻습니다.
 * @param yearMonth 달
 * @returns 그 달의 주말·공휴일 (YYYY-MM-DD, 날짜순)
 * @example getNonWorkingDates({ year: 2026, month: 10 }).slice(0, 3); // ['2026-10-03', '2026-10-04', '2026-10-05']
 */
export const getNonWorkingDates = ({ year, month }: GetWorkApplicationRequest) =>
  getMonthDates(new Date(year, month - 1, 1)).filter(
    (dateKey) => checkWeekend(parseISO(dateKey)) || checkHoliday(dateKey),
  );

/**
 * 날짜(YYYY-MM-DD)와 시각(HH:mm)을 하나의 Date로 합칩니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param time 시각 (HH:mm)
 * @returns 그 날짜 그 시각의 Date
 * @example combineDateTime('2026-11-20', '09:00'); // 2026년 11월 20일 09:00
 */
export const combineDateTime = (dateKey: string, time: string) => {
  const date = parseISO(dateKey);
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
};
