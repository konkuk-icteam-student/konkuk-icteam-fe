import { SLOT_MINUTES, SLOT_TIMES } from '@/shared/config/slot';
import { convertTimeToMinutes, type TimeRange } from '@/shared/utils/time';
import { checkTimeFormat } from './timeInput';

const DAY_START_MINUTES = convertTimeToMinutes(SLOT_TIMES[0]!.start);
const DAY_END_MINUTES = convertTimeToMinutes(SLOT_TIMES[SLOT_TIMES.length - 1]!.end);

/**
 * 근무 불가 시간대로 넣을 수 없는 까닭을 얻습니다. 근무 시간(09:00 - 18:00) 안의 30분 단위여야 하고, 이미 넣은 시간대와 겹치면 안 됩니다.
 * @param range 넣으려는 시간대
 * @param range.start 시작 시각 (HH:mm)
 * @param range.end 끝 시각 (HH:mm)
 * @param existingRanges 이미 넣은 시간대
 * @returns 넣을 수 없으면 안내 글자, 넣을 수 있으면 undefined
 * @example getTimeRangeError({ start: '12:00', end: '13:00' }, [{ start: '11:30', end: '13:00' }]); // '이미 넣은 시간대와 겹쳐요.'
 */
export const getTimeRangeError = ({ start, end }: TimeRange, existingRanges: TimeRange[]) => {
  if (!start || !end) return '시작·끝 시각을 모두 입력해 주세요.';
  if (!checkTimeFormat(start) || !checkTimeFormat(end)) {
    return '시각을 09:00처럼 24시간 형식으로 입력해 주세요.';
  }

  const startMinutes = convertTimeToMinutes(start);
  const endMinutes = convertTimeToMinutes(end);

  if (startMinutes >= endMinutes) return '끝 시각이 시작보다 늦어야 해요.';
  if (startMinutes < DAY_START_MINUTES || endMinutes > DAY_END_MINUTES) {
    return `근무 시간(${SLOT_TIMES[0]!.start} - ${SLOT_TIMES[SLOT_TIMES.length - 1]!.end}) 안에서 입력해 주세요.`;
  }
  if (startMinutes % SLOT_MINUTES !== 0 || endMinutes % SLOT_MINUTES !== 0) {
    return `${SLOT_MINUTES}분 단위로 입력해 주세요.`;
  }

  const isOverlapping = existingRanges.some(
    (existing) =>
      startMinutes < convertTimeToMinutes(existing.end) &&
      convertTimeToMinutes(existing.start) < endMinutes,
  );

  return isOverlapping ? '이미 넣은 시간대와 겹쳐요.' : undefined;
};

/**
 * 시간대를 하나 더한 새 목록을 시작 시각 순으로 만듭니다.
 * @param ranges 지금 시간대 목록
 * @param range 더할 시간대
 * @returns 시작 시각 순 새 목록 (원래 배열은 그대로)
 * @example createAddedTimeRanges([{ start: '17:00', end: '18:00' }], { start: '11:30', end: '13:00' })[0].start; // '11:30'
 */
export const createAddedTimeRanges = (ranges: TimeRange[], range: TimeRange) =>
  [...ranges, range].sort((a, b) => convertTimeToMinutes(a.start) - convertTimeToMinutes(b.start));
