import { describe, expect, it } from 'vitest';
import {
  checkApplicationWeek,
  checkDateBeyondMonth,
  checkWeekInMonth,
  getApplicationInitialWeekStartKey,
  getLastViewableMonthKey,
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

describe('getLastViewableMonthKey', () => {
  it('신청 전에는 이번 달, 신청 후에는 신청 받는 달이다', () => {
    expect(getLastViewableMonthKey('2026-11', false)).toBe('2026-11');
    expect(getLastViewableMonthKey('2026-11', true)).toBe('2026-12');
  });
});

describe('checkDateBeyondMonth', () => {
  it('볼 수 있는 마지막 달보다 뒤인 날만 true다', () => {
    expect(checkDateBeyondMonth('2026-12-01', '2026-11')).toBe(true);
    expect(checkDateBeyondMonth('2026-11-30', '2026-11')).toBe(false);
    expect(checkDateBeyondMonth('2026-12-01', '2026-12')).toBe(false);
  });
});

describe('getWeekTitleMonth', () => {
  it('신청 전에는 다음 달에 걸친 주도 이번 달이다', () => {
    expect(getWeekTitleMonth('2026-11-30', '2026-11', false)).toBe(11);
  });

  it('신청 후에는 신청 받는 달 날이 하루라도 있으면 신청 받는 달이다', () => {
    expect(getWeekTitleMonth('2026-11-30', '2026-11', true)).toBe(12);
    // 12.28 - 01.01도 12월 날이 있어서 12월
    expect(getWeekTitleMonth('2026-12-28', '2026-11', true)).toBe(12);
  });

  it('그 밖에 두 달에 걸친 주는 목요일이 속한 달이다', () => {
    // 10.26 - 10.30, 09.28 - 10.02 (목요일 10.01)
    expect(getWeekTitleMonth('2026-10-26', '2026-11', true)).toBe(10);
    expect(getWeekTitleMonth('2026-09-28', '2026-11', true)).toBe(10);
  });
});
