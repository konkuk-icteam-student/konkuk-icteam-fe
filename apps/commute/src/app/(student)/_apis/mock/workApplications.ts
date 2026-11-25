import { formatNumber, parseISO } from '@konkuk-icteam-fe/design-system/date';
import { getWorkApplicationMock } from '@/app/(admin)/_apis/mock/workApplications';
import { getMonthDates } from '@/shared/utils/calendar';
import type { ApiJson, WorkTimeRange } from '../common';

const createMonthKey = (year: number, month: number) => `${year}-${formatNumber(month)}`;

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
 * 처음 보여 줄 내 신청 목업을 만듭니다. 화요일 오전 09~11시, 목요일 오후 13~15시에 신청해 둔 상태입니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 신청 근무 JSON
 * @example createBaseApplication(2026, 11).length; // 화·목 수만큼
 */
const createBaseApplication = (year: number, month: number): ApiJson<WorkTimeRange>[] =>
  getMonthDates(new Date(year, month - 1, 1)).flatMap((dateKey) => {
    const day = parseISO(dateKey).getDay();
    if (day === 2) return [{ date: dateKey, start: '09:00', end: '11:00' }];
    if (day === 4) return [{ date: dateKey, start: '13:00', end: '15:00' }];

    return [];
  });

// 저장한 내 신청 (YYYY-MM → 신청 근무). 새로 고침하면 처음으로 돌아간다
const SAVED_APPLICATIONS: Record<string, ApiJson<WorkTimeRange>[]> = {};

export const getMyWorkApplicationMock = (year: number, month: number) =>
  SAVED_APPLICATIONS[createMonthKey(year, month)] ?? createBaseApplication(year, month);

export const saveMyWorkApplicationMock = (
  year: number,
  month: number,
  schedules: ApiJson<WorkTimeRange>[],
) => {
  SAVED_APPLICATIONS[createMonthKey(year, month)] = schedules;
};
