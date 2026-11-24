import { useMemo, useState } from 'react';
import { getWorkerShifts } from '../../_apis/workers';
import { getMonthDateRange, getMonthKeyOfDate } from '../../_utils/monthKey';
import { createAttendanceSummary, createLateRecords } from '../../_utils/workerShift';

export const useMonthlyAttendance = (userId: number) => {
  // 상세보기를 연 순간을 기준으로 끝난 근무·결근을 가른다
  const [now] = useState(() => new Date());

  return useMemo(() => {
    const { startDate, endDate } = getMonthDateRange(getMonthKeyOfDate(now));
    const { shifts } = getWorkerShifts({ userId, startDate, endDate });

    return {
      summary: createAttendanceSummary(shifts, now),
      lateRecords: createLateRecords(shifts),
    };
  }, [userId, now]);
};
