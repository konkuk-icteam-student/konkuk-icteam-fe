import { toISO } from '@konkuk-icteam-fe/design-system/date';
import type { WorkTimeRange } from '@/app/(student)/_apis/common';
import { SLOT_MINUTES } from '@/shared/config/slot';
import type { SlotStatus, TimeTableCell } from '@/shared/ui';
import { checkUnavailableSlot, createSlotKey } from '@/shared/utils/slot';
import {
  convertMinutesToTime,
  convertTimeToMinutes,
  mergeContinuousSlots,
  type TimeRange,
} from '@/shared/utils/time';

// 시간표 하루치 입력. 칸마다 그 칸에 근무하는 사람이 들어 있다
export type RequestTimeTableDay = {
  dateKey: string;
  slots: { start: string; users: { userId: number; userName: string }[] }[];
  // 하루 통째로 근무할 수 없는 날인지 (공휴일·근무 불가 날짜)
  isUnavailableDate: boolean;
  // 그 날이 속한 달의 근무 불가 시간대
  unavailableTimeRanges: readonly TimeRange[];
};

// 시간표에서 보고 있는 학생과, 승인되면 그 학생에게 더해지거나 빠질 칸 (createSlotKey로 만든 key)
type RequestTimeTableFocus = {
  userId: number;
  userName: string;
  addSlotKeys: Set<string>;
  deleteSlotKeys: Set<string>;
};

/**
 * 근무 구간들을 30분 칸 key로 펼칩니다.
 * @param ranges 근무 구간 목록 (날짜·시작·끝)
 * @returns 칸 key 모음
 * @example createSlotKeys([{ date: new Date(2026, 10, 25), start: '11:00', end: '12:00' }]); // Set { '2026-11-25 11:00', '2026-11-25 11:30' }
 */
export const createSlotKeys = (ranges: WorkTimeRange[]) =>
  new Set(
    ranges.flatMap(({ date, start, end }) => {
      const startMinutes = convertTimeToMinutes(start);
      const slotCount = (convertTimeToMinutes(end) - startMinutes) / SLOT_MINUTES;

      return Array.from({ length: slotCount }, (_, index) =>
        createSlotKey(toISO(date), convertMinutesToTime(startMinutes + index * SLOT_MINUTES)),
      );
    }),
  );

/**
 * 승인한 뒤 칸에 근무할 사람 이름을 얻습니다. 추가 예정 칸에는 보고 있는 학생을 더하고, 삭제 예정 칸에서는 뺍니다.
 * @param slotKey 칸 key
 * @param users 지금 그 칸에 근무하는 사람
 * @param focus 보고 있는 학생과 예정 칸
 * @returns 근무자 이름 목록
 * @example getWorkersAfterApproval(key, [{ userId: 1, userName: '홍길동' }], focus); // ['홍길동', '최유나']
 */
const getWorkersAfterApproval = (
  slotKey: string,
  users: RequestTimeTableDay['slots'][number]['users'],
  focus: RequestTimeTableFocus | null,
) => {
  const names = users
    .filter(({ userId }) => !(focus?.deleteSlotKeys.has(slotKey) && userId === focus.userId))
    .map(({ userName }) => userName);
  const isAdded =
    focus?.addSlotKeys.has(slotKey) && !users.some(({ userId }) => userId === focus.userId);

  return isAdded && focus ? [...names, focus.userName] : names;
};

/**
 * 수정요청 화면 시간표의 칸을 만듭니다. 칸마다 요청을 승인한 뒤의 인원/최대 인원과 근무자 명단을 보여 줍니다.
 * 칸 모양은 이 순서로 정합니다: 신청 불가 → (보고 있는 학생의) 삭제 예정(빨간 테두리) → 신청 완료 → 추가 예정.
 * 추가 예정 칸은 승인하면 정원을 넘으면 정원 초과(빨간 테두리·옅은 빨간 배경), 아니면 파란 테두리입니다.
 * 추가하지 않는 칸은 인원이 정원을 넘어도 따로 칠하지 않습니다
 * @param days 요일별 칸과 그 날의 근무 불가 정보
 * @param maxCount 동시 근무 최대 인원
 * @param focus 보고 있는 학생과 예정 칸. 없으면 인원만 보여 준다
 * @returns 요일별 칸 목록
 * @example createRequestTimeTableCells(days, 4, null)[0][0].status; // 'AVAILABLE'
 */
export const createRequestTimeTableCells = (
  days: RequestTimeTableDay[],
  maxCount: number,
  focus: RequestTimeTableFocus | null,
): TimeTableCell[][] =>
  days.map(({ dateKey, slots, isUnavailableDate, unavailableTimeRanges }) =>
    slots.map(({ start, users }) => {
      const key = createSlotKey(dateKey, start);
      const workers = getWorkersAfterApproval(key, users, focus);
      const getStatus = (): SlotStatus => {
        if (isUnavailableDate || checkUnavailableSlot(start, unavailableTimeRanges)) {
          return 'UNAVAILABLE';
        }
        if (focus?.deleteSlotKeys.has(key)) return 'PENDING_DELETE';
        if (focus && users.some(({ userId }) => userId === focus.userId)) return 'APPLIED';
        if (!focus?.addSlotKeys.has(key)) return 'AVAILABLE';

        return workers.length > maxCount ? 'OVER_CAPACITY' : 'PENDING_ADD';
      };

      return { key, mode: 'detail', status: getStatus(), workers, maxCount };
    }),
  );

/**
 * 요청을 승인하면 정원을 넘게 되는 시간대를 모읍니다. 보고 있는 학생이 새로 들어가는 칸 중 인원이 최대를 넘는 칸을 이어진 구간으로 묶습니다.
 * @param days 요일별 칸과 그 날의 근무 불가 정보
 * @param maxCount 동시 근무 최대 인원
 * @param focus 보고 있는 학생과 예정 칸
 * @returns 날짜(YYYY-MM-DD)와 구간 목록. 날짜·시각 순
 * @example createOverCapacityRanges(days, 4, focus); // [{ dateKey: '2026-11-24', start: '14:00', end: '15:00' }]
 */
export const createOverCapacityRanges = (
  days: RequestTimeTableDay[],
  maxCount: number,
  focus: RequestTimeTableFocus | null,
) =>
  createRequestTimeTableCells(days, maxCount, focus).flatMap((cells, dayIndex) => {
    const dateKey = days[dayIndex]?.dateKey ?? '';
    const overSlots = cells
      .filter(({ status }) => status === 'OVER_CAPACITY')
      .map(({ key }) => {
        const start = key.slice(-5);

        return { start, end: convertMinutesToTime(convertTimeToMinutes(start) + SLOT_MINUTES) };
      });

    return mergeContinuousSlots(overSlots).map((range) => ({ dateKey, ...range }));
  });
