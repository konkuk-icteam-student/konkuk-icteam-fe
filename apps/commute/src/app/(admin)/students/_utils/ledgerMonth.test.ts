import { describe, expect, it } from 'vitest';
import { getLedgerMonthBounds, getLedgerShiftRange } from './ledgerMonth';

describe('ledgerMonth', () => {
  describe('근로대장에서 넘길 수 있는 달', () => {
    it('근로 시작 달부터 이번 달까지다', () => {
      expect(getLedgerMonthBounds(new Date(2025, 2, 1), '2026-11')).toEqual({
        firstMonthKey: '2025-03',
        lastMonthKey: '2026-11',
      });
    });

    it('이번 달에 근로를 시작했으면 이번 달만 볼 수 있다', () => {
      expect(getLedgerMonthBounds(new Date(2026, 10, 1), '2026-11')).toEqual({
        firstMonthKey: '2026-11',
        lastMonthKey: '2026-11',
      });
    });

    it('근로 시작 달이 이번 달보다 뒤여도 이번 달부터 볼 수 있다', () => {
      expect(getLedgerMonthBounds(new Date(2027, 0, 1), '2026-11').firstMonthKey).toBe('2026-11');
    });
  });

  describe('불러올 근무 기간', () => {
    it('지난달은 그 달 1일부터 마지막 날까지다', () => {
      expect(getLedgerShiftRange('2026-10', new Date(2026, 10, 10))).toEqual({
        startDate: new Date(2026, 9, 1),
        endDate: new Date(2026, 9, 31),
        weekStartDate: null,
        weekEndDate: null,
      });
    });

    it('이번 달은 이번 주 월요일이 지난달이어도 이번 주 누적을 셀 수 있게 그 월요일부터 불러온다', () => {
      // 2026-12-02(수)가 속한 주의 월요일은 11-30
      expect(getLedgerShiftRange('2026-12', new Date(2026, 11, 2))).toEqual({
        startDate: new Date(2026, 10, 30),
        endDate: new Date(2026, 11, 31),
        weekStartDate: new Date(2026, 10, 30),
        weekEndDate: new Date(2026, 11, 6),
      });
    });

    it('이번 주가 이번 달 안에 있으면 그 달 1일부터 불러온다', () => {
      expect(getLedgerShiftRange('2026-11', new Date(2026, 10, 10))).toEqual({
        startDate: new Date(2026, 10, 1),
        endDate: new Date(2026, 10, 30),
        weekStartDate: new Date(2026, 10, 9),
        weekEndDate: new Date(2026, 10, 15),
      });
    });
  });
});
