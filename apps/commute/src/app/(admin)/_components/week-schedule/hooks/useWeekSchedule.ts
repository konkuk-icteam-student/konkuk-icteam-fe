import { useReducer } from 'react';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import {
  createWorkSchedule,
  deleteWorkSchedule,
  getWorkSchedules,
  type WorkScheduleUser,
} from '../../../_apis/workSchedules';
import { checkUnavailableSlot } from '@/shared/utils/slot';
import { getWorkApplication } from '../../../_apis/workApplications';
import { checkDateBeyondMonth } from '../utils/viewableWeeks';
import { getWeekDays, type WeekDay } from '../utils/weekKey';

// 칸에 넣을 사람. 배치 id는 넣은 뒤에 서버가 정한다
export type ScheduleCellWorker = Pick<WorkScheduleUser, 'userId' | 'userName'>;

export type ScheduleCell = {
  dateKey: string;
  start: string;
  end: string;
  users: WorkScheduleUser[];
  // 그 달 근무 불가 시간대 칸. 아무도 넣을 수 없다
  isUnavailable: boolean;
  // 볼 수 있는 마지막 달보다 뒤인 칸 (신청을 열기 전 다음 달). 회색으로 막아 둔다
  isBeyondViewableMonth: boolean;
};

// 시간표 한 열 (하루). 요일·날짜 글자와 30분 단위 칸
export type ScheduleDay = WeekDay & { cells: ScheduleCell[] };

// 한 주(월~금)의 30분 단위 근무 칸. 사람을 넣고 빼면 바로 저장하고 다시 불러온다
// lastViewableMonthKey: 볼 수 있는 마지막 달 (YYYY-MM). 그 뒤 날짜 칸은 막아 둔다
export const useWeekSchedule = (weekStartKey: string, lastViewableMonthKey: string) => {
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const weekDays = getWeekDays(weekStartKey);
  const response = getWorkSchedules({
    startDate: parseISO(weekStartKey),
    endDate: parseISO(weekDays[weekDays.length - 1]?.dateKey ?? weekStartKey),
  });
  const days: ScheduleDay[] = weekDays.map((day, index) => {
    // 한 주가 두 달에 걸칠 수 있어서 날마다 그 달 근로신청 기준을 본다
    const date = parseISO(day.dateKey);
    const unavailableTimeRanges =
      getWorkApplication({ year: date.getFullYear(), month: date.getMonth() + 1 }).settings
        ?.unavailableTimeRanges ?? [];

    return {
      ...day,
      cells: (response.days[index]?.slots ?? []).map(({ start, end, users }) => ({
        dateKey: day.dateKey,
        start,
        end,
        users,
        isUnavailable: checkUnavailableSlot(start, unavailableTimeRanges),
        isBeyondViewableMonth: checkDateBeyondMonth(day.dateKey, lastViewableMonthKey),
      })),
    };
  });

  // 칸에 사람을 넣는다. 막힌 칸이거나 이미 그 칸에 있으면 넣지 않고 false를 돌려준다
  const handleUserAdd = (cell: ScheduleCell, { userId }: ScheduleCellWorker) => {
    if (
      cell.isUnavailable ||
      cell.isBeyondViewableMonth ||
      cell.users.some((user) => user.userId === userId)
    )
      return false;

    createWorkSchedule({ userId, date: parseISO(cell.dateKey), start: cell.start, end: cell.end });
    refresh();
    return true;
  };

  const handleUserRemove = (scheduleId: number) => {
    deleteWorkSchedule({ scheduleId });
    refresh();
  };

  return {
    days,
    maxConcurrentWorkers: response.maxConcurrentWorkers,
    handleUserAdd,
    handleUserRemove,
  };
};
