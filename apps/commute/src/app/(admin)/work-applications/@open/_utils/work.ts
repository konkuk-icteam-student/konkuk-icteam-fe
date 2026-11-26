import type { WorkApplicationSettings } from '../../../_apis/workApplications';
import type { WorkApplication } from '../_lib/workApplicationSchema';
import { combineDateTime } from './date';

/**
 * 검사를 통과한 근로신청 열기 폼 값을 저장 API가 받는 기준으로 바꿉니다.
 * @param application 폼 값
 * @param application.applyDate 신청 기간 (날짜·시각을 따로 받은 값)
 * @param application.maxWorkers 동시 근무 최대 인원
 * @param application.weeklyHoursLimit 주간 최소·최대 근로시간
 * @param application.monthlyHoursLimit 월간 최소·최대 근로시간
 * @param application.unavailableDates 근무 불가 날짜
 * @param application.unavailableTimeRanges 근무 불가 시간대
 * @returns 저장할 근로신청 기준
 * @example toWorkApplicationSettings(values).applyStartDate; // 2026년 11월 20일 09:00
 */
export const toWorkApplicationSettings = ({
  applyDate,
  maxWorkers,
  weeklyHoursLimit,
  monthlyHoursLimit,
  unavailableDates,
  unavailableTimeRanges,
}: WorkApplication): WorkApplicationSettings => ({
  applyStartDate: combineDateTime(applyDate.startDate, applyDate.startTime),
  applyEndDate: combineDateTime(applyDate.endDate, applyDate.endTime),
  maxConcurrentWorkers: maxWorkers,
  weeklyMinHours: weeklyHoursLimit.min,
  weeklyMaxHours: weeklyHoursLimit.max,
  monthlyMinHours: monthlyHoursLimit.min,
  monthlyMaxHours: monthlyHoursLimit.max,
  unavailableDates,
  unavailableTimeRanges,
});
