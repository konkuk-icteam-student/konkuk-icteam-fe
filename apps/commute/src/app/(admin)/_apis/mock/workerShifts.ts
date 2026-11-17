import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/app/(student)/_apis/common';
import { addDays, MILLISECONDS_PER_DAY } from '@/shared/utils/week';
import type { WorkerShift } from '../workers';
import { getDayAttendanceShiftsMock } from './attendances';

// 근로장학생 한 명의 근무 구간 목업. 대시보드 출근 기록 목업에서 그 사람 것만 골라서 숫자가 어긋나지 않는다

/**
 * 한 사람의 기간 근무 구간과 출근 기록 목업을 얻습니다.
 * @param userId 근로장학생 id
 * @param startDateKey 첫날 (YYYY-MM-DD)
 * @param endDateKey 마지막 날 (YYYY-MM-DD, 포함)
 * @returns 근무 구간 JSON (날짜·시작 시각 순)
 * @example getWorkerShiftsMock(1, '2026-11-01', '2026-11-30')[0]; // { date: '2026-11-02', start: '13:00', end: '16:30', checkedInAt: '2026-11-02T12:57:00' }
 */
export const getWorkerShiftsMock = (
  userId: number,
  startDateKey: string,
  endDateKey: string,
): ApiJson<WorkerShift>[] => {
  const startDate = parseISO(startDateKey);
  const dayCount =
    Math.round((parseISO(endDateKey).getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY) + 1;

  return Array.from({ length: Math.max(dayCount, 0) }, (_, index) =>
    toISO(addDays(startDate, index)),
  ).flatMap((dateKey) =>
    getDayAttendanceShiftsMock(dateKey)
      .filter((shift) => shift.userId === userId)
      .map(({ start, end, checkedInAt }) => ({ date: dateKey, start, end, checkedInAt })),
  );
};
