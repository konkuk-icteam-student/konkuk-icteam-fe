import { useState } from 'react';
import { getWorkApplicationSettings } from '@/app/(student)/_apis/workApplications';
import { getNextYearMonth } from '@/shared/utils/calendar';

// 다음 달 근로 신청 기간. 관리자가 신청을 열면 그 기간 안에서 신청하고 마감 전까지 바꿀 수 있다
export const useApplyPeriod = () => {
  const [now] = useState(() => new Date());
  const { year, month } = getNextYearMonth(now);
  const { settings } = getWorkApplicationSettings({ year, month });
  const isApplyOpen =
    settings !== null && settings.applyStartDate <= now && now <= settings.applyEndDate;

  return { year, month, isApplyOpen, settings };
};
