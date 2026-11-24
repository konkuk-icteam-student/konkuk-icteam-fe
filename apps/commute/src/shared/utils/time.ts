import { TimeString } from '@/app/(student)/_apis/common';
import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

export const MINUTES_PER_HOUR = 60;

/**
 * 'HH:mm' 형식의 시각을 자정부터 지난 분으로 바꿉니다.
 * @param time 'HH:mm' 형식의 시각
 * @returns 자정부터 지난 분
 * @example const minutes = convertTimeToMinutes('09:30'); // 570
 */
export const convertTimeToMinutes = (time: TimeString) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);

  return hours * MINUTES_PER_HOUR + minutes;
};

/**
 * 자정부터 지난 분을 'HH:mm' 형식의 시각으로 바꿉니다.
 * @param minutesFromMidnight 자정부터 지난 분
 * @returns 'HH:mm' 형식의 시각
 * @example const time = convertMinutesToTime(570); // '09:30'
 */
export const convertMinutesToTime = (minutesFromMidnight: number) =>
  `${formatNumber(Math.floor(minutesFromMidnight / MINUTES_PER_HOUR))}:${formatNumber(minutesFromMidnight % MINUTES_PER_HOUR)}`;

// 하루 안의 시작·끝 시각 (HH:mm). 30분 근무 칸이나 이어진 근무 구간에 쓴다
export type TimeRange = {
  start: TimeString;
  end: TimeString;
};

/**
 * 시작 시각 순으로 놓인 칸들 중 이어진 칸(앞 칸의 끝 = 다음 칸의 시작)을 한 구간으로 묶습니다.
 * 점심시간처럼 사이가 비면 다른 구간이 됩니다.
 * @param slots 시작 시각 순 칸 목록
 * @returns 이어진 구간 목록
 * @example mergeContinuousSlots([{ start: '09:00', end: '09:30' }, { start: '09:30', end: '10:00' }]); // [{ start: '09:00', end: '10:00' }]
 */
export const mergeContinuousSlots = (slots: TimeRange[]) =>
  slots.reduce<TimeRange[]>((ranges, { start, end }) => {
    const lastRange = ranges.at(-1);

    return lastRange && lastRange.end === start
      ? [...ranges.slice(0, -1), { start: lastRange.start, end }]
      : [...ranges, { start, end }];
  }, []);
