import { describe, expect, it } from 'vitest';
import { getLedgerDate, getLedgerMonthBounds } from './ledgerMonth';

describe('ledgerMonth', () => {
  describe('근로대장에서 넘길 수 있는 달', () => {
    it('근로 시작 달부터 이번 달까지다', () => {
      expect(getLedgerMonthBounds(new Date(2025, 2, 1), '2026-11')).toEqual({
        firstMonthKey: '2025-03',
        lastMonthKey: '2026-11',
      });
    });

    it('이번 달에 근로를 시작했으면 이번 달만 볼 수 있다', () => {
      expect(getLedgerMonthBounds(new Date(2026, 10, 7), '2026-11')).toEqual({
        firstMonthKey: '2026-11',
        lastMonthKey: '2026-11',
      });
    });

    it('근로 시작 달이 이번 달보다 뒤여도 이번 달부터 볼 수 있다', () => {
      expect(getLedgerMonthBounds(new Date(2027, 0, 1), '2026-11').firstMonthKey).toBe('2026-11');
    });
  });

  describe('상세 API에 보낼 기준일', () => {
    it('이번 달은 오늘이라 이번 주·이번 달 누적을 받는다', () => {
      expect(getLedgerDate('2026-11', new Date(2026, 10, 17))).toEqual(new Date(2026, 10, 17));
    });

    it('지난달은 그 달 마지막 날이라 그 달 누적을 받는다', () => {
      expect(getLedgerDate('2026-09', new Date(2026, 10, 17))).toEqual(new Date(2026, 8, 30));
    });
  });
});
