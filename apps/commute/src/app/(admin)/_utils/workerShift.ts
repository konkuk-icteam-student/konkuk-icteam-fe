import type { TimeString } from '@/app/(student)/_apis/common';
import { LATE_GRACE_MINUTES } from '@/shared/config/workHours';
import { convertTimeToMinutes } from '@/shared/utils/time';
import type { DayRange } from '@/shared/utils/week';
import type { TodoPeriod } from '../_apis/todos';
import type { WorkerShift } from '../_apis/workers';
import { PERIODS } from '../_constants/period';

// 근무 구간과 출근 기록으로 지각·결근·근로대장을 정한다. 지각·결근 판정은 서버가 해 주는 값이지만,
// 상세보기에 쓸 서버 근태 API가 정해지기 전까지 서버와 같은 기준으로 화면에서 계산한다

const MILLISECONDS_PER_MINUTE = 60 * 1000;

// 출근한 근무만 담으므로 출근 시각이 늘 있다
export type LateRecord = WorkerShift & {
  checkedInAt: Date;
  lateMinutes: number;
};

export type AttendanceSummary = {
  lateCount: number;
  lateMinutes: number;
  absentCount: number;
};

// 시간은 배정된 시간이다 (퇴근 기록이 없다)
export type WorkLedgerRow = {
  date: Date;
  period: TodoPeriod;
  start: TimeString;
  end: TimeString;
  workedMinutes: number;
};

/**
 * 근무 날짜와 시각으로 그 순간을 만듭니다.
 * @param date 근무 날짜
 * @param time 시각 (HH:mm)
 * @returns 그 순간 (한국 시간)
 * @example createShiftDateTime(new Date(2026, 10, 4), '10:30').getHours(); // 10
 */
const createShiftDateTime = (date: Date, time: TimeString) => {
  const minutes = convertTimeToMinutes(time);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, minutes);
};

/**
 * 근무 구간을 날짜·시작 시각 순으로 비교합니다. sort에 넘깁니다.
 * @param first 앞 근무
 * @param second 뒤 근무
 * @returns 앞이 먼저면 음수
 * @example shifts.sort(compareShifts);
 */
const compareShifts = (
  first: Pick<WorkerShift, 'date' | 'start'>,
  second: Pick<WorkerShift, 'date' | 'start'>,
) =>
  createShiftDateTime(first.date, first.start).getTime() -
  createShiftDateTime(second.date, second.start).getTime();

/**
 * 근무에 늦은 분을 얻습니다. 시작 시각에서 LATE_GRACE_MINUTES(5분)를 넘겨 출근했으면 지각이고,
 * 늦은 분은 유예를 빼지 않고 시작 시각부터 세며 1분이 안 되는 나머지는 올립니다.
 * @param shift 근무 구간과 출근 시각
 * @returns 늦은 분. 지각이 아니거나 아직 출근하지 않았으면 0
 * @example getLateMinutes({ date, start: '10:30', end: '11:30', checkedInAt: new Date(2026, 10, 4, 10, 36) }); // 6
 */
const getLateMinutes = ({ date, start, checkedInAt }: WorkerShift) => {
  if (!checkedInAt) return 0;

  const lateMilliseconds = checkedInAt.getTime() - createShiftDateTime(date, start).getTime();

  return lateMilliseconds > LATE_GRACE_MINUTES * MILLISECONDS_PER_MINUTE
    ? Math.ceil(lateMilliseconds / MILLISECONDS_PER_MINUTE)
    : 0;
};

/**
 * 근무가 끝났는지 확인합니다.
 * @param shift 근무 구간
 * @param now 기준 시각
 * @returns 끝 시각이 지났으면 true
 * @example checkShiftEnded(shift, new Date(2026, 10, 4, 12, 0)); // true
 */
const checkShiftEnded = ({ date, end }: WorkerShift, now: Date) =>
  createShiftDateTime(date, end) <= now;

/**
 * 근무가 오전인지 오후인지 얻습니다. 기준은 관리자 화면 공통 PERIODS(12시 전 시작이면 오전)입니다.
 * @param start 근무 시작 시각 (HH:mm)
 * @returns 오전·오후
 * @example getShiftPeriod('13:00'); // 'AFTERNOON'
 */
const getShiftPeriod = (start: TimeString): TodoPeriod =>
  // PERIODS의 두 시간대가 하루의 모든 시각을 나눠 가져서 늘 하나가 맞는다
  PERIODS.find(({ includesStart }) => includesStart(start))?.period ?? 'AFTERNOON';

/**
 * 지각한 근무를 늦은 분과 함께 모읍니다.
 * @param shifts 근무 구간과 출근 기록
 * @returns 지각 기록 (날짜·시작 시각 순)
 * @example createLateRecords(shifts)[0]; // { date, start: '10:30', end: '11:30', checkedInAt, lateMinutes: 6 }
 */
export const createLateRecords = (shifts: WorkerShift[]): LateRecord[] =>
  shifts
    .flatMap(({ checkedInAt, ...shift }) => {
      const lateMinutes = getLateMinutes({ ...shift, checkedInAt });

      return checkedInAt && lateMinutes > 0 ? [{ ...shift, checkedInAt, lateMinutes }] : [];
    })
    .sort(compareShifts);

/**
 * 지각 횟수·늦은 분 합계와 결근 횟수를 셉니다. 결근은 끝난 근무에 출근하지 않은 것입니다.
 * @param shifts 근무 구간과 출근 기록
 * @param now 기준 시각
 * @returns 지각 횟수, 늦은 분 합계, 결근 횟수
 * @example createAttendanceSummary(shifts, new Date()); // { lateCount: 1, lateMinutes: 6, absentCount: 0 }
 */
export const createAttendanceSummary = (shifts: WorkerShift[], now: Date): AttendanceSummary => {
  const lateRecords = createLateRecords(shifts);

  return {
    lateCount: lateRecords.length,
    lateMinutes: lateRecords.reduce((sum, { lateMinutes }) => sum + lateMinutes, 0),
    absentCount: shifts.filter((shift) => !shift.checkedInAt && checkShiftEnded(shift, now)).length,
  };
};

/**
 * 근로대장 줄을 만듭니다. 출근했고 끝난 근무(근무 완료)만 싣고, 시작·종료·근무시간은 배정된 시간 그대로 적습니다.
 * @param shifts 근무 구간과 출근 기록
 * @param now 기준 시각
 * @returns 근로대장 줄 (날짜·시작 시각 순)
 * @example createWorkLedgerRows(shifts, new Date())[0]; // { date, period: 'AFTERNOON', start: '13:00', end: '16:30', workedMinutes: 210 }
 */
export const createWorkLedgerRows = (shifts: WorkerShift[], now: Date): WorkLedgerRow[] =>
  shifts
    .filter((shift) => shift.checkedInAt !== null && checkShiftEnded(shift, now))
    .sort(compareShifts)
    .map(({ date, start, end }) => ({
      date,
      period: getShiftPeriod(start),
      start,
      end,
      workedMinutes: convertTimeToMinutes(end) - convertTimeToMinutes(start),
    }));

/**
 * 근로대장 줄의 근무시간을 모두 더합니다.
 * @param rows 근로대장 줄
 * @returns 총 근로시간 (분)
 * @example getTotalWorkedMinutes(rows); // 780
 */
export const getTotalWorkedMinutes = (rows: WorkLedgerRow[]) =>
  rows.reduce((sum, { workedMinutes }) => sum + workedMinutes, 0);

/**
 * 시작일부터 마지막 날까지(둘 다 포함)의 근무만 고릅니다.
 * @param shifts 근무 구간
 * @param range 기간
 * @param range.startDate 시작일
 * @param range.endDate 마지막 날
 * @returns 그 기간의 근무
 * @example filterShiftsBetween(shifts, { startDate: monday, endDate: sunday });
 */
export const filterShiftsBetween = (shifts: WorkerShift[], { startDate, endDate }: DayRange) => {
  const startTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  ).getTime();
  const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

  return shifts.filter(({ date }) => startTime <= date.getTime() && date.getTime() <= endTime);
};
