import { describe, expect, it } from 'vitest';
import type { WorkerShift } from '../_apis/workers';
import {
  createAttendanceSummary,
  createLateRecords,
  createWorkLedgerRows,
  filterShiftsBetween,
  getTotalWorkedMinutes,
} from './workerShift';

// 2026-11-04(수) 오전 10:30 ~ 11:30 근무를 기준으로 출근 시각만 바꿔 쓴다
const createShift = (overrides: Partial<WorkerShift> = {}): WorkerShift => ({
  date: new Date(2026, 10, 4),
  start: '10:30',
  end: '11:30',
  checkedInAt: new Date(2026, 10, 4, 10, 25),
  ...overrides,
});

const AFTER_ALL_SHIFTS = new Date(2026, 10, 30, 18, 0);

describe('workerShift', () => {
  describe('지각 기록', () => {
    it('근무 시작 시각이 지난 뒤 출근한 근무만 늦은 분과 함께 담는다', () => {
      const lateShift = createShift({ checkedInAt: new Date(2026, 10, 4, 10, 36) });
      const onTimeShift = createShift({ date: new Date(2026, 10, 5) });

      expect(createLateRecords([onTimeShift, lateShift])).toEqual([
        { ...lateShift, lateMinutes: 6 },
      ]);
    });

    it('정각에 출근하면 지각이 아니다', () => {
      const shift = createShift({ checkedInAt: new Date(2026, 10, 4, 10, 30) });

      expect(createLateRecords([shift])).toEqual([]);
    });

    it('1분이 안 되게 늦어도 1분 지각으로 센다', () => {
      const shift = createShift({ checkedInAt: new Date(2026, 10, 4, 10, 30, 20) });

      expect(createLateRecords([shift])[0]?.lateMinutes).toBe(1);
    });

    it('아직 출근하지 않은 근무는 지각 기록에 넣지 않는다', () => {
      expect(createLateRecords([createShift({ checkedInAt: null })])).toEqual([]);
    });

    it('날짜·시작 시각 순으로 놓는다', () => {
      const later = createShift({
        date: new Date(2026, 10, 6),
        checkedInAt: new Date(2026, 10, 6, 10, 40),
      });
      const earlier = createShift({ checkedInAt: new Date(2026, 10, 4, 10, 31) });

      expect(createLateRecords([later, earlier]).map(({ date }) => date.getDate())).toEqual([4, 6]);
    });
  });

  describe('근태 요약', () => {
    it('지각 횟수와 늦은 분 합계, 끝났는데 출근하지 않은 결근 횟수를 센다', () => {
      const shifts = [
        createShift({ checkedInAt: new Date(2026, 10, 4, 10, 36) }),
        createShift({ date: new Date(2026, 10, 5), checkedInAt: new Date(2026, 10, 5, 10, 40) }),
        createShift({ date: new Date(2026, 10, 6), checkedInAt: null }),
        createShift({ date: new Date(2026, 10, 9) }),
      ];

      expect(createAttendanceSummary(shifts, AFTER_ALL_SHIFTS)).toEqual({
        lateCount: 2,
        lateMinutes: 16,
        absentCount: 1,
      });
    });

    it('아직 끝나지 않은 근무는 출근하지 않았어도 결근이 아니다', () => {
      const now = new Date(2026, 10, 4, 11, 0);

      expect(createAttendanceSummary([createShift({ checkedInAt: null })], now).absentCount).toBe(
        0,
      );
    });
  });

  describe('근로대장', () => {
    it('출근했고 끝난 근무(근무 완료)만 배정된 시간 그대로 싣는다', () => {
      const lateButDone = createShift({ checkedInAt: new Date(2026, 10, 4, 10, 36) });
      const absent = createShift({ date: new Date(2026, 10, 5), checkedInAt: null });

      expect(createWorkLedgerRows([lateButDone, absent], AFTER_ALL_SHIFTS)).toEqual([
        {
          date: lateButDone.date,
          period: 'MORNING',
          start: '10:30',
          end: '11:30',
          workedMinutes: 60,
        },
      ]);
    });

    it('진행 중인 근무와 아직 오지 않은 근무는 싣지 않는다', () => {
      const now = new Date(2026, 10, 4, 11, 0);
      const working = createShift();
      const upcoming = createShift({ date: new Date(2026, 10, 5), checkedInAt: null });

      expect(createWorkLedgerRows([working, upcoming], now)).toEqual([]);
    });

    it('12시 전에 시작하면 오전, 나머지는 오후다', () => {
      const afternoon = createShift({
        start: '13:00',
        end: '16:30',
        checkedInAt: new Date(2026, 10, 4, 12, 55),
      });

      const [morningRow, afternoonRow] = createWorkLedgerRows(
        [afternoon, createShift()],
        AFTER_ALL_SHIFTS,
      );

      expect(morningRow?.period).toBe('MORNING');
      expect(afternoonRow).toMatchObject({ period: 'AFTERNOON', workedMinutes: 210 });
    });

    it('줄마다 근무시간을 더해 총 근로시간을 얻는다', () => {
      const rows = createWorkLedgerRows(
        [
          createShift(),
          createShift({ start: '13:00', end: '16:30', checkedInAt: new Date(2026, 10, 4, 13, 0) }),
        ],
        AFTER_ALL_SHIFTS,
      );

      expect(getTotalWorkedMinutes(rows)).toBe(270);
      expect(getTotalWorkedMinutes([])).toBe(0);
    });
  });

  it('시작일부터 마지막 날까지(마지막 날 포함)의 근무만 고른다', () => {
    const shifts = [3, 4, 8, 9].map((day) => createShift({ date: new Date(2026, 10, day) }));

    expect(
      filterShiftsBetween(shifts, {
        startDate: new Date(2026, 10, 4),
        endDate: new Date(2026, 10, 8),
      }).map(({ date }) => date.getDate()),
    ).toEqual([4, 8]);
  });
});
