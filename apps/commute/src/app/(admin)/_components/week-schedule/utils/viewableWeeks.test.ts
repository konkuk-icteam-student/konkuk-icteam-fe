import { describe, expect, it } from 'vitest';
import {
  checkApplicationWeek,
  checkDateBeyondMonth,
  getApplicationInitialWeekStartKey,
  getLastViewableWeekStartKey,
  getWeekTitleMonth,
} from './viewableWeeks';

// 첫 인자는 이번 달, 둘째는 다음 달 근로신청을 열었는지. 특별한 말이 없으면 이번 달은 2026년 11월
describe('시간표 주 범위', () => {
  describe('getLastViewableWeekStartKey', () => {
    it('말일이 주말이면 마지막 평일이 든 주까지다', () => {
      // 2026.10.31은 토요일 → 마지막 평일 10.30(금)이 든 주
      expect(getLastViewableWeekStartKey('2026-10', false)).toBe('2026-10-26');
    });

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
    it('신청 받는 달 1일이 주말이면 첫 평일이 든 주부터 연다', () => {
      // 2026.08.01은 토요일, 2026.11.01은 일요일
      expect(getApplicationInitialWeekStartKey('2026-07', true)).toBe('2026-08-03');
      expect(getApplicationInitialWeekStartKey('2026-10', true)).toBe('2026-11-02');
    });

    it('신청 전에는 정하지 않아 이번 주부터 연다', () => {
      expect(getApplicationInitialWeekStartKey('2026-11', false)).toBeUndefined();
    });

    it('신청 후에는 신청 받는 달 첫 주부터 연다', () => {
      expect(getApplicationInitialWeekStartKey('2026-11', true)).toBe('2026-11-30');
    });
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
