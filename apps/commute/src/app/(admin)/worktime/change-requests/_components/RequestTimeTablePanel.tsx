'use client';

import { IconSearch } from '@konkuk-icteam-fe/design-system/assets';
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
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';
import {
  createOverCapacityRanges,
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
  // 보고 있는 학생. 없으면 시간표 대신 고르는 방법을 안내한다
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
// 칸마다 승인한 뒤의 인원/최대 인원을 보여 주고(마우스를 올리면 근무자 명단), 정원을 넘게 되면 위에 알린다
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
  const focus = focusedUser
    ? {
        userId: focusedUser.userId,
        userName: focusedUser.name,
        addSlotKeys: createSlotKeys(pendingChanges.addSchedules),
        deleteSlotKeys: createSlotKeys(pendingChanges.deleteSchedules),
      }
    : null;
  const cells = createRequestTimeTableCells(timeTableDays, maxConcurrentWorkers, focus);
  // 승인하면 정원을 넘는 시간대. 예: 11.24 (화) 14:00 - 15:00
  const overCapacityLabel = createOverCapacityRanges(timeTableDays, maxConcurrentWorkers, focus)
    .map(({ dateKey, start, end }) => `${formatMonthDayWithWeekday(dateKey)} ${start} - ${end}`)
    .join(', ');

  return (
    <section className='bg-black-1 flex flex-col gap-[1.6rem] rounded-[1.2rem] border border-gray-50 p-[2rem]'>
      <div className='flex items-center gap-[0.8rem]'>
        {/* 디자인 시스템 SearchBar와 같은 모양: 옅은 회색 배경에 돋보기 */}
        <div className='flex flex-1 items-center gap-[0.8rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem]'>
          <IconSearch aria-hidden className='h-[2.4rem] w-[2.4rem] shrink-0 text-gray-700' />
          <WorkerSearch
            placeholder='이름을 검색하세요.'
            onSelect={onWorkerSelect}
            className='flex-1'
            inputClassName='h-[5rem] border-0 bg-transparent px-0 placeholder:text-gray-500'
          />
        </div>
        <Button display='inline' size='small' color='blue' onClick={onReset}>
          초기화
        </Button>
      </div>

      {focusedUser ? (
        <>
          <div className='flex items-end justify-between gap-[1.2rem]'>
            <div className='flex flex-col gap-[0.2rem]'>
              <span className='caption-12-md text-gray-500'>지금 보고 있는 시간표</span>
              <div className='flex items-center gap-[0.8rem]'>
                <h2 className='font-18-bd text-black'>{focusedUser.name}</h2>
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

          {overCapacityLabel ? (
            <p
              role='alert'
              className='caption-12-md bg-red/10 text-red rounded-[0.8rem] px-[1.2rem] py-[1rem]'
            >
              {`승인하면 ${overCapacityLabel}에 정원(${maxConcurrentWorkers}명)을 넘어요.`}
            </p>
          ) : null}

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
        </>
      ) : (
        // 아직 아무도 고르지 않았으면 시간표 대신 고르는 방법을 알려 준다
        <div className='flex min-h-[80rem] flex-col items-center justify-center gap-[0.4rem] rounded-[1.2rem] bg-gray-50 text-center'>
          <p className='font-16-bd text-gray-500'>학생을 검색하거나 왼쪽 수정요청 카드를 고르면</p>
          <p className='caption-14-md text-gray-400'>
            그 학생의 시간표에 추가·삭제할 칸이 표시돼요.
          </p>
        </div>
      )}
    </section>
  );
}
