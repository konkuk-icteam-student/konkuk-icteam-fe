import { describe, expect, it } from 'vitest';
import { getMonthWorkHours } from './utils';

describe('getMonthWorkHours', () => {
  it('그 달 날짜의 칸만 30분씩 센다', () => {
    const slots = [
      { date: '2026-11-02' },
      { date: '2026-11-02' },
      { date: '2026-11-30' },
      // 표에 함께 보이는 앞뒤 달 날짜는 세지 않는다
      { date: '2026-10-30' },
      { date: '2026-12-01' },
    ];

    expect(getMonthWorkHours(slots, 2026, 11)).toBe(1.5);
  });
});
