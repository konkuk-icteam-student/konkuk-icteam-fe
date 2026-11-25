import { describe, expect, it } from 'vitest';
import { getWorkApplicationSubmissions } from '@/app/(admin)/_apis/workApplications';
import { saveWorkApplicationMock } from '@/app/(admin)/_apis/mock/workApplications';
import { DEFAULT_UNAVAILABLE_TIME_RANGES } from '@/shared/config/slot';
import { MY_USER_ID } from './me';
import { getMyWorkApplicationMock, saveMyWorkApplicationMock } from './workApplications';

// 다른 테스트와 겹치지 않게 먼 달(2030년 1월)에 신청을 연다
const YEAR = 2030;
const MONTH = 1;

describe('근로학생 신청과 관리자 근무표', () => {
  saveWorkApplicationMock(YEAR, MONTH, {
    settings: {
      applyStartDate: '2029-12-20T09:00:00',
      applyEndDate: '2029-12-25T18:00:00',
      maxConcurrentWorkers: 4,
      weeklyMinHours: 6,
      weeklyMaxHours: 15,
      monthlyMinHours: 30,
      monthlyMaxHours: 60,
      unavailableDates: [],
      unavailableTimeRanges: DEFAULT_UNAVAILABLE_TIME_RANGES.map((range) => ({ ...range })),
    },
  });

  it('신청을 저장하면 그 달 내 근무가 신청한 칸으로 바뀐다', () => {
    saveMyWorkApplicationMock(YEAR, MONTH, [{ date: '2030-01-02', start: '09:00', end: '11:00' }]);

    expect(getMyWorkApplicationMock(YEAR, MONTH)).toEqual([
      { date: '2030-01-02', start: '09:00', end: '11:00' },
    ]);
  });

  it('관리자 근로신청 요약에 제출 시간과 최근 신청이 보인다', () => {
    const mine = getWorkApplicationSubmissions({ year: YEAR, month: MONTH }).submissions.find(
      ({ userId }) => userId === MY_USER_ID,
    );

    expect(mine?.submittedMinutes).toBe(120);
    expect(mine?.lastSubmittedAt).not.toBeNull();
  });
});
