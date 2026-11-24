import { useMemo, useState } from 'react';
import { getWorkerDetail, getWorkerShifts, type Worker } from '../../_apis/workers';
import {
  getMonthDateRange,
  getMonthKeyOfDate,
  parseMonthKey,
  shiftMonthKey,
} from '../../_utils/monthKey';
import { createWorkLedgerRows, getTotalWorkedMinutes } from '../../_utils/workerShift';
import { getLedgerDate, getLedgerMonthBounds } from '../_utils/ledgerMonth';

// 카드 숫자는 상세 API에서, 근로대장 표는 상세 API에 없어서 근무 구간에서 만든다
export const useWorkLedger = ({
  userId,
  workStartDate,
}: Pick<Worker, 'userId' | 'workStartDate'>) => {
  // 상세보기를 연 순간을 기준으로 끝난 근무를 가른다
  const [now] = useState(() => new Date());
  const currentMonthKey = getMonthKeyOfDate(now);
  const { firstMonthKey, lastMonthKey } = getLedgerMonthBounds(workStartDate, currentMonthKey);
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const isCurrentMonth = monthKey === currentMonthKey;

  const ledger = useMemo(() => {
    const record = getWorkerDetail({ userId, date: getLedgerDate(monthKey, now) });
    const { shifts } = getWorkerShifts({ userId, ...getMonthDateRange(monthKey) });
    const rows = createWorkLedgerRows(shifts, now);

    return {
      rows,
      // 근무 완료 건만 싣기 때문에 표의 월 총 근로시간은 그 달 누적 근무시간과 같아야 한다
      totalWorkedMinutes: getTotalWorkedMinutes(rows),
      monthlyWorkedMinutes: record.monthlyWorkedMinutes,
      monthlyLimitMinutes: record.monthlyLimitMinutes,
      weeklyWorkedMinutes: record.weeklyWorkedMinutes,
      weeklyLimitMinutes: record.weeklyLimitMinutes,
    };
  }, [userId, monthKey, now]);

  const handleMonthMove = (delta: number) => {
    setMonthKey((previous) => {
      const nextMonthKey = shiftMonthKey(previous, delta);
      if (nextMonthKey < firstMonthKey) return firstMonthKey;

      return nextMonthKey > lastMonthKey ? lastMonthKey : nextMonthKey;
    });
  };

  return {
    ...parseMonthKey(monthKey),
    isCurrentMonth,
    isPrevMonthDisabled: monthKey <= firstMonthKey,
    isNextMonthDisabled: monthKey >= lastMonthKey,
    ...ledger,
    handleMonthMove,
  };
};
