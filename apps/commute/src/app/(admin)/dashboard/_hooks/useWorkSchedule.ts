import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { getAttendances } from '../../_apis/attendances';
import { getWorkSchedules, type WorkScheduleSlot } from '../../_apis/workSchedules';
import { PERIODS } from '../../_constants/period';
import { SLOT_ATTENDANCE_STATUS_THEME } from '@/shared/constants/attendanceStatus';
import { findSlotShift, getSlotAttendanceStatus } from '../_utils/attendanceStatus';
import {
  getDailyWorkers,
  getWorkersByPeriod,
  type OnDutyWorker,
} from '../_utils/getWorkersByPeriod';
import useCurrentTime from './useCurrentTime';

// 고른 날의 근무 시간표를 화면에 그릴 모양으로 정렬·맵핑한다
// scheduleGroups: 오전·오후 묶음 → 시작 시각 순 칸 → 그날 근무자 열마다 근태 칩 (근무하지 않으면 attendance null)
// workersByPeriod: 업무 지정에 쓰는 시간대별 근무자
export default function useWorkSchedule(dateKey: string) {
  const now = useCurrentTime();
  const date = parseISO(dateKey);
  const slots = getWorkSchedules({ startDate: date, endDate: date }).days[0]?.slots ?? [];
  const { shifts } = getAttendances({ date });
  // 시간표 열 순서. 그날 근무 칸이 많은 순, 같으면 먼저 근무를 시작하는 순
  const dailyWorkers = getDailyWorkers(slots);

  const toCell = (slot: WorkScheduleSlot, { userId, userName }: OnDutyWorker) => {
    const isWorking = slot.users.some((user) => user.userId === userId);
    const shift = findSlotShift(shifts, userId, slot.start);

    return {
      userId,
      userName,
      attendance:
        isWorking && shift
          ? SLOT_ATTENDANCE_STATUS_THEME[getSlotAttendanceStatus(dateKey, slot, shift, now)]
          : null,
    };
  };

  const scheduleGroups = PERIODS.map(({ label, checkHour }) => ({
    label,
    rows: slots
      .filter(({ start, users }) => users.length > 0 && checkHour(Number(start.split(':')[0])))
      .toSorted((first, second) => first.start.localeCompare(second.start))
      .map((slot) => ({
        start: slot.start,
        userCount: slot.users.length,
        cells: dailyWorkers.map((worker) => toCell(slot, worker)),
      })),
  })).filter(({ rows }) => rows.length > 0);

  return { scheduleGroups, workersByPeriod: getWorkersByPeriod(slots) };
}
