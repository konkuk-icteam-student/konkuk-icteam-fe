import {
  getWorkApplicationMock,
  recordSubmissionMock,
} from '@/app/(admin)/_apis/mock/workApplications';
import {
  getUserMonthRangesMock,
  replaceUserMonthSchedulesMock,
} from '@/app/(admin)/_apis/mock/workSchedules';
import { MY_USER_ID } from './me';
import type { ApiJson, WorkTimeRange } from '../common';

/**
 * 그 달 근로신청 기준 목업을 얻습니다. 관리자가 신청을 연(기준을 저장한) 달만 있습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 기준 JSON. 열지 않은 달이면 undefined
 * @example getWorkApplicationSettingsMock(2026, 11)?.settings.weeklyMaxHours; // 15
 */
export const getWorkApplicationSettingsMock = (year: number, month: number) => {
  const saved = getWorkApplicationMock(year, month);

  return saved ? { settings: saved.settings } : undefined;
};

/**
 * 그 달 내 신청 목업을 얻습니다. 신청은 곧 그 달 근무표이므로 관리자 근무표 목업에서 내 칸을 읽습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 신청 근무 JSON (이어진 칸은 한 구간)
 * @example getMyWorkApplicationMock(2026, 12)[0]; // { date: '2026-12-01', start: '09:00', end: '11:00' }
 */
export const getMyWorkApplicationMock = (year: number, month: number): ApiJson<WorkTimeRange>[] =>
  getUserMonthRangesMock(MY_USER_ID, year, month);

/**
 * 내 신청을 저장합니다. 관리자 근무표 목업의 내 그 달 칸을 통째로 바꾸고, 관리자 근로신청 요약에 제출을 기록합니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @param schedules 신청 근무 JSON
 * @example saveMyWorkApplicationMock(2026, 12, [{ date: '2026-12-01', start: '09:00', end: '11:00' }]);
 */
export const saveMyWorkApplicationMock = (
  year: number,
  month: number,
  schedules: ApiJson<WorkTimeRange>[],
) => {
  // 제출을 먼저 기록해야 그 달 근로학생 명단에 들어가 근무표에서 내 칸을 다룰 수 있다
  recordSubmissionMock(year, month, MY_USER_ID, new Date());
  replaceUserMonthSchedulesMock(MY_USER_ID, year, month, schedules);
};
