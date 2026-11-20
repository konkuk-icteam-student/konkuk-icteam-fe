'use client';

import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { Button, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkTimeRange } from '@/app/(student)/_apis/common';
import {
  ArrowButton,
  SlotLegend,
  TimeTable,
  type ChipTone,
  type SlotLegendItem,
} from '@/shared/ui';
import { checkHoliday } from '@/shared/utils/calendar';
import { getWorkApplication } from '../../../_apis/workApplications';
import type { Worker } from '../../../_apis/workers';
import { getWorkSchedules } from '../../../_apis/workSchedules';
import WorkerSearch from '../../../_components/week-schedule/WorkerSearch';
import { formatWeekRange, getWeekDays } from '../../../_components/week-schedule/utils/weekKey';
import {
  createRequestTimeTableCells,
  createSlotKeys,
  type RequestTimeTableDay,
} from '../_utils/requestTimeTable';

const LEGEND_ITEMS: SlotLegendItem[] = [
  { status: 'APPLIED', label: '신청 완료' },
  { status: 'PENDING_ADD', label: '추가 예정' },
  { status: 'PENDING_DELETE', label: '삭제 예정' },
  { status: 'UNAVAILABLE', label: '신청 불가' },
  { status: 'OVER_CAPACITY', label: '정원 초과' },
];

type RequestTimeTablePanelProps = {
  // 보고 있는 학생. 없으면 칸마다 인원만 보여 준다
  focusedUser: { userId: number; name: string } | null;
  // 이름 옆에 붙일 요청 상태 (요청 카드를 골랐을 때)
  statusChip: { label: string; tone: ChipTone } | null;
  // 승인되면 그 학생에게 더해지거나 빠질 근무
  pendingChanges: { addSchedules: WorkTimeRange[]; deleteSchedules: WorkTimeRange[] };
  weekStartKey: string;
  onWeekMove: (delta: number) => void;
  onWorkerSelect: (worker: Worker) => void;
  onReset: () => void;
};

// 수정요청 화면 오른쪽. 고른 학생의 한 주 시간표에 요청이 승인되면 빠질 칸·더해질 칸을 예정으로 보여 준다.
// 칸마다 그 칸 인원/최대 인원을 보여 주고, 마우스를 올리면 근무자 명단이 뜬다
export default function RequestTimeTablePanel({
  focusedUser,
  statusChip,
  pendingChanges,
  weekStartKey,
  onWeekMove,
  onWorkerSelect,
  onReset,
}: RequestTimeTablePanelProps) {
  const weekDays = getWeekDays(weekStartKey);
  const { maxConcurrentWorkers, days } = getWorkSchedules({
    startDate: parseISO(weekStartKey),
    endDate: parseISO(weekDays[weekDays.length - 1]?.dateKey ?? weekStartKey),
  });
  const timeTableDays: RequestTimeTableDay[] = weekDays.map(({ dateKey }, index) => {
    // 한 주가 두 달에 걸칠 수 있어서 날마다 그 달 근로신청 기준을 본다
    const date = parseISO(dateKey);
    const settings = getWorkApplication({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    }).settings;

    return {
      dateKey,
      slots: days[index]?.slots ?? [],
      isUnavailableDate:
        checkHoliday(dateKey) || (settings?.unavailableDates.map(toISO).includes(dateKey) ?? false),
      unavailableTimeRanges: settings?.unavailableTimeRanges ?? [],
    };
  });
  const cells = createRequestTimeTableCells(
    timeTableDays,
    maxConcurrentWorkers,
    focusedUser
      ? {
          userId: focusedUser.userId,
          addSlotKeys: createSlotKeys(pendingChanges.addSchedules),
          deleteSlotKeys: createSlotKeys(pendingChanges.deleteSchedules),
        }
      : null,
  );

  return (
    <section className='bg-black-1 flex flex-col gap-[1.6rem] rounded-[1.2rem] border border-gray-50 p-[2rem]'>
      <div className='flex items-center gap-[0.8rem]'>
        <WorkerSearch
          placeholder='이름을 검색하세요.'
          onSelect={onWorkerSelect}
          className='flex-1'
        />
        <Button display='inline' size='small' color='blue' onClick={onReset}>
          초기화
        </Button>
      </div>

      <div className='flex items-end justify-between gap-[1.2rem]'>
        <div className='flex flex-col gap-[0.2rem]'>
          <span className='caption-12-md text-gray-500'>지금 보고 있는 시간표</span>
          <div className='flex items-center gap-[0.8rem]'>
            <h2 className='font-18-bd text-black'>{focusedUser?.name ?? '전체'}</h2>
            {statusChip ? <StateChip label={statusChip.label} tone={statusChip.tone} /> : null}
          </div>
        </div>
        <div className='flex items-center gap-[1.2rem]'>
          <ArrowButton direction='left' aria-label='이전 주' onClick={() => onWeekMove(-1)} />
          <span className='font-16-bd min-w-[11rem] text-center text-black'>
            {formatWeekRange(weekStartKey)}
          </span>
          <ArrowButton direction='right' aria-label='다음 주' onClick={() => onWeekMove(1)} />
        </div>
      </div>

      <TimeTable
        days={weekDays.map(({ dateKey, weekday, dateLabel }) => ({
          date: dateKey,
          label: weekday,
          dateLabel,
        }))}
        cells={cells}
        timeLabelFormat='time'
      />
      <SlotLegend items={LEGEND_ITEMS} />
    </section>
  );
}
