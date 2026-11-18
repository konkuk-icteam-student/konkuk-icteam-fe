import { describe, expect, it } from 'vitest';
import {
  checkApplicationWeek,
  checkWeekInMonth,
  getApplicationInitialWeekStartKey,
  getLastViewableWeekStartKey,
  getMonthFirstWeekStartKey,
  getMonthLastWeekStartKey,
  getWeekTitleMonth,
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

// 이번 달이 2026년 11월이고, 다음 달(12월) 신청을 열기 전·후
describe('시간표 주 범위 (이번 달 2026-11)', () => {
  describe('getLastViewableWeekStartKey', () => {
    it('신청 전에는 이번 달 마지막 주까지다', () => {
      expect(getLastViewableWeekStartKey('2026-11', false)).toBe('2026-11-30');
    });

    it('신청 후에는 신청 받는 달 마지막 주까지다', () => {
      expect(getLastViewableWeekStartKey('2026-11', true)).toBe('2026-12-28');
    });
  });

  describe('checkApplicationWeek', () => {
    it('신청 전에는 어느 주도 신청 받는 주가 아니다', () => {
      expect(checkApplicationWeek('2026-12-07', '2026-11', false)).toBe(false);
    });

    it('신청 후에는 다음 달 평일이 든 주가 신청 받는 주다', () => {
      expect(checkApplicationWeek('2026-11-30', '2026-11', true)).toBe(true);
      expect(checkApplicationWeek('2026-12-28', '2026-11', true)).toBe(true);
      // 이번 달 주는 확정된 근무라 신청 받는 주가 아니다
      expect(checkApplicationWeek('2026-11-23', '2026-11', true)).toBe(false);
    });
  });

  describe('getApplicationInitialWeekStartKey', () => {
    it('신청 전에는 정하지 않아 이번 주부터 연다', () => {
      expect(getApplicationInitialWeekStartKey('2026-11', false)).toBeUndefined();
    });

    it('신청 후에는 신청 받는 달 첫 주부터 연다', () => {
      expect(getApplicationInitialWeekStartKey('2026-11', true)).toBe('2026-11-30');
    });
  });
});

describe('getWeekTitleMonth', () => {
  it('두 달에 걸친 주는 목요일이 속한 달이다', () => {
    expect(getWeekTitleMonth('2026-11-30')).toBe(12);
    // 12.28 - 01.01은 목요일(12.31)이 12월
    expect(getWeekTitleMonth('2026-12-28')).toBe(12);
  });
});
