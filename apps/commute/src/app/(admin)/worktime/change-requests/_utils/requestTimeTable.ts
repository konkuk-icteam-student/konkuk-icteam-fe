import { toISO } from '@konkuk-icteam-fe/design-system/date';
import type { WorkTimeRange } from '@/app/(student)/_apis/common';
import { SLOT_MINUTES } from '@/shared/config/slot';
import type { SlotStatus, TimeTableCell } from '@/shared/ui';
import { checkUnavailableSlot } from '@/shared/utils/slot';
import { convertMinutesToTime, convertTimeToMinutes } from '@/shared/utils/time';
import type { TimeRange } from '@/shared/utils/timeRange';

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
export type RequestTimeTableFocus = {
  userId: number;
  addSlotKeys: Set<string>;
  deleteSlotKeys: Set<string>;
};

/**
 * 칸 하나를 가리키는 key를 만듭니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param start 칸 시작 시각 (HH:mm)
 * @returns 'YYYY-MM-DD HH:mm'
 * @example createSlotKey('2026-11-25', '11:00'); // '2026-11-25 11:00'
 */
export const createSlotKey = (dateKey: string, start: string) => `${dateKey} ${start}`;

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
 * 수정요청 화면 시간표의 칸을 만듭니다. 칸마다 인원/최대 인원과 근무자 명단을 보여 줍니다.
 * 칸 모양은 이 순서로 정합니다: 신청 불가 → (보고 있는 학생의) 삭제 예정 → 추가 예정 → 신청 완료 → 정원 초과 → 빈 칸
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
      const getStatus = (): SlotStatus => {
        if (isUnavailableDate || checkUnavailableSlot(start, unavailableTimeRanges)) {
          return 'UNAVAILABLE';
        }
        if (focus?.deleteSlotKeys.has(key)) return 'PENDING_DELETE';
        if (focus?.addSlotKeys.has(key)) return 'PENDING_ADD';
        if (focus && users.some(({ userId }) => userId === focus.userId)) return 'APPLIED';

        return users.length > maxCount ? 'OVER_CAPACITY' : 'AVAILABLE';
      };

      return {
        key,
        mode: 'detail',
        status: getStatus(),
        workers: users.map(({ userName }) => userName),
        maxCount,
      };
    }),
  );
