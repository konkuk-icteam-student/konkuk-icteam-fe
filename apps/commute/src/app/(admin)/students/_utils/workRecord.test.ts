import { describe, expect, it } from 'vitest';
import { checkMonthWorker } from './workRecord';

describe('workRecord', () => {
  it('그 달 최대 근로시간이 있으면 그 달 근로학생이다', () => {
    expect(checkMonthWorker({ monthlyLimitMinutes: 3600 })).toBe(true);
  });

  it('그 달 최대 근로시간이 0이면 그 달 근로학생이 아니다 (근로신청 명단에 없음)', () => {
    expect(checkMonthWorker({ monthlyLimitMinutes: 0 })).toBe(false);
  });
});
