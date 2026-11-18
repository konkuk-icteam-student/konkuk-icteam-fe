import { describe, expect, it } from 'vitest';
import {
  checkWeekInMonth,
  getMonthFirstWeekStartKey,
  getMonthLastWeekStartKey,
} from './viewableWeeks';

describe('getMonthFirstWeekStartKey', () => {
  it('1일이 평일이면 1일이 든 주의 월요일이다', () => {
    // 2026.12.01은 화요일
    expect(getMonthFirstWeekStartKey('2026-12')).toBe('2026-11-30');
  });

  it('1일이 주말이면 첫 평일이 든 주다', () => {
    // 2026.08.01은 토요일, 2026.11.01은 일요일
    expect(getMonthFirstWeekStartKey('2026-08')).toBe('2026-08-03');
    expect(getMonthFirstWeekStartKey('2026-11')).toBe('2026-11-02');
  });
});

describe('getMonthLastWeekStartKey', () => {
  it('마지막 평일이 든 주의 월요일이다', () => {
    // 2026.12.31은 목요일
    expect(getMonthLastWeekStartKey('2026-12')).toBe('2026-12-28');
    // 2026.10.31은 토요일 → 마지막 평일은 10.30(금)
    expect(getMonthLastWeekStartKey('2026-10')).toBe('2026-10-26');
  });
});

describe('checkWeekInMonth', () => {
  it('평일 중 그 달 날짜가 있으면 true다', () => {
    expect(checkWeekInMonth('2026-11-30', '2026-12')).toBe(true);
    expect(checkWeekInMonth('2026-11-30', '2026-11')).toBe(true);
    expect(checkWeekInMonth('2026-11-23', '2026-12')).toBe(false);
  });
});
