import { useMemo, useState } from 'react';
import { MINUTES_PER_HOUR } from '@/shared/utils/time';
import { getWorkApplication } from '../../_apis/workApplications';
import { getMonthlyWorkers, getWorkerShifts, type Worker } from '../../_apis/workers';
import {
  getMonthDateRange,
  getMonthKeyOfDate,
  parseMonthKey,
  shiftMonthKey,
} from '../../_utils/monthKey';
import {
  createWorkLedgerRows,
  filterShiftsBetween,
  getTotalWorkedMinutes,
} from '../../_utils/workerShift';
import { getLedgerMonthBounds, getLedgerShiftRange } from '../_utils/ledgerMonth';

// 근로대장 탭. 근로 시작 달부터 이번 달까지 넘겨 보고, 카드는 고른 달 기준이다 (주 카드는 이번 달만)
export const useWorkLedger = ({
  userId,
  workStartDate,
}: Pick<Worker, 'userId' | 'workStartDate'>) => {
  // 서랍을 연 순간을 기준으로 끝난 근무를 가른다
  const [now] = useState(() => new Date());
  const currentMonthKey = getMonthKeyOfDate(now);
  const { firstMonthKey, lastMonthKey } = getLedgerMonthBounds(workStartDate, currentMonthKey);
  const [monthKey, setMonthKey] = useState(currentMonthKey);

  const ledger = useMemo(() => {
    // 불러올 기간은 그 달보다 넓을 수 있다 (이번 주 월요일이 지난달일 때)
    const fetchRange = getLedgerShiftRange(monthKey, now);
    const { shifts } = getWorkerShifts({
      userId,
      startDate: fetchRange.startDate,
      endDate: fetchRange.endDate,
    });
    const month = getMonthDateRange(monthKey);
    const rows = createWorkLedgerRows(
      filterShiftsBetween(shifts, month.startDate, month.endDate),
      now,
    );
    const weeklyWorkedMinutes =
      fetchRange.weekStartDate && fetchRange.weekEndDate
        ? getTotalWorkedMinutes(
            createWorkLedgerRows(
              filterShiftsBetween(shifts, fetchRange.weekStartDate, fetchRange.weekEndDate),
              now,
            ),
          )
        : null;
    const monthlyRecord = getMonthlyWorkers(parseMonthKey(monthKey)).workers.find(
      (worker) => worker.userId === userId,
    )?.monthlyRecord;

    return {
      rows,
      // 근무 완료 건만 싣기 때문에 월 총 근로시간이 곧 그 달 누적 근무시간이다
      monthlyWorkedMinutes: getTotalWorkedMinutes(rows),
      weeklyWorkedMinutes,
      // 그 달 근로학생이 아니었으면 최대 근로시간이 없다
      monthlyLimitMinutes: monthlyRecord?.monthlyLimitMinutes ?? null,
    };
  }, [userId, monthKey, now]);

  // 주 최대 근로시간은 이번 달 근로신청 기준이다
  const weeklyLimitMinutes = useMemo(() => {
    const weeklyMaxHours = getWorkApplication(parseMonthKey(currentMonthKey)).settings
      ?.weeklyMaxHours;

    return weeklyMaxHours === undefined ? null : weeklyMaxHours * MINUTES_PER_HOUR;
  }, [currentMonthKey]);

  const handleMonthMove = (delta: number) => {
    setMonthKey((previous) => {
      const nextMonthKey = shiftMonthKey(previous, delta);
      if (nextMonthKey < firstMonthKey) return firstMonthKey;

      return nextMonthKey > lastMonthKey ? lastMonthKey : nextMonthKey;
    });
  };

  return {
    ...parseMonthKey(monthKey),
    isCurrentMonth: monthKey === currentMonthKey,
    isPrevMonthDisabled: monthKey <= firstMonthKey,
    isNextMonthDisabled: monthKey >= lastMonthKey,
    ...ledger,
    weeklyLimitMinutes,
    handleMonthMove,
  };
};
