'use client';

import { useState } from 'react';
import { Button, ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import type { Worker } from '../../_apis/workers';
import type { WorkScheduleUser } from '../../_apis/workSchedules';
import EditableScheduleCell from './EditableScheduleCell';
import PendingRequestsPanel from './PendingRequestsPanel';
import QuickSearchPanel from './QuickSearchPanel';
import WeekRangeNavigator from './WeekRangeNavigator';
import WeekScheduleGrid from './WeekScheduleGrid';
import WorkerTimePanel from './WorkerTimePanel';
import {
  useWeekSchedule,
  type ScheduleCell,
  type ScheduleCellWorker,
} from './hooks/useWeekSchedule';
import { getWeekStartKey, shiftWeek } from './utils/weekKey';
import {
  checkApplicationWeek,
  getLastViewableMonthKey,
  getLastViewableWeekStartKey,
} from './utils/viewableWeeks';
import { getWorkApplication } from '../../_apis/workApplications';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../../_utils/monthKey';
import { formatMonthDay } from '@/shared/utils/formatDate';

type RemoveTarget = { cell: ScheduleCell; user: WorkScheduleUser };

// 이 요일 열부터(0 = 월) 칸의 검색창을 왼쪽으로 연다
const SEARCH_TO_LEFT_FROM_COLUMN = 3;

type WeekScheduleProps = {
  // 처음 보여 줄 주의 월요일 (YYYY-MM-DD). 없으면 이번 주
  initialWeekStartKey?: string;
  // 시간표 위에 붙일 제목 줄. 보고 있는 주(월요일, YYYY-MM-DD)를 받아 그린다
  renderHeader?: (weekStartKey: string) => React.ReactNode;
};

// 근로시간 관리와 근로신청 시간표가 함께 쓰는 주간 시간표. 편집하기를 누르면 칸마다 근무자를 넣고 뺄 수 있다. 오른쪽에서 승인 대기 수정요청을 미리 보고,
// 근무자를 찾으면 시간표에서 그 사람 칸을 강조하며 검색창 바로 아래에 그 주 근무 시간을 보여 준다.
// 다음 달 근로신청을 열었으면 그 달까지 넘겨 볼 수 있다. 신청 받는 달의 칸은 학생이 낸 신청이고,
// 고치면 그 학생의 제출에 반영된다 (신청 마감 뒤에는 그대로 그 달 근무 시간표가 된다)
export default function WeekSchedule({ initialWeekStartKey, renderHeader }: WeekScheduleProps) {
  const [currentMonthKey] = useState(getCurrentMonthKey);
  const isApplicationOpened = getWorkApplication(
    parseMonthKey(shiftMonthKey(currentMonthKey, 1)),
  ).isOpened;
  // 지난 주로는 막지 않고, 다음 주로는 이번 달(다음 달 신청을 열었으면 그 달)까지 넘긴다
  const lastWeekStartKey = getLastViewableWeekStartKey(currentMonthKey, isApplicationOpened);
  const [weekStartKey, setWeekStartKey] = useState(
    () => initialWeekStartKey ?? getWeekStartKey(new Date()),
  );
  // 신청 받는 달이 든 주. 설정 기준과 관계없이 편집할 수 있다고 알리고, 확정된 달의 승인 대기 패널은 숨긴다
  const isApplicationWeek = checkApplicationWeek(
    weekStartKey,
    currentMonthKey,
    isApplicationOpened,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredWorker, setFilteredWorker] = useState<Worker | null>(null);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);
  const { showToast, toast } = useToast();
  const schedule = useWeekSchedule(
    weekStartKey,
    getLastViewableMonthKey(currentMonthKey, isApplicationOpened),
  );

  const handleAdd = (cell: ScheduleCell, user: ScheduleCellWorker) => {
    const isAdded = schedule.handleUserAdd(cell, user);
    showToast(
      isAdded
        ? `${user.userName}님을 ${cell.start}에 배치했어요.`
        : `${user.userName}님은 이미 이 시간에 배치되어 있어요.`,
    );
  };

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    schedule.handleUserRemove(removeTarget.user.scheduleId);
    showToast(`${removeTarget.user.userName}님을 뺐어요.`);
  };

  return (
    <div className='mx-auto grid w-full max-w-[150rem] grid-cols-[minmax(0,1fr)_30rem] items-start gap-[2.4rem] p-[3.4rem]'>
      {renderHeader ? <div className='col-span-2'>{renderHeader(weekStartKey)}</div> : null}
      <section className='bg-black-1 flex flex-col gap-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[2.4rem]'>
        <div className='flex items-center justify-between gap-[1.6rem]'>
          <WeekRangeNavigator
            weekStartKey={weekStartKey}
            canMoveNext={weekStartKey < lastWeekStartKey}
            onMove={(delta) => setWeekStartKey((prev) => shiftWeek(prev, delta))}
          />
          {isApplicationWeek ? (
            <p className='caption-12-md bg-blue/10 text-blue ml-auto rounded-full px-[1.2rem] py-[0.6rem]'>
              ⓘ 최대 인원 등 설정 기준과 관계없이 편집할 수 있습니다.
            </p>
          ) : null}
          <Button
            display='inline'
            size='medium'
            tone={isEditMode ? 'subtle_2' : 'solid'}
            color={isEditMode ? 'black' : 'blue'}
            className='w-[12rem]'
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            {isEditMode ? '편집 끝내기' : '편집하기'}
          </Button>
        </div>

        <WeekScheduleGrid
          days={schedule.days}
          maxConcurrentWorkers={schedule.maxConcurrentWorkers}
          focusedUserId={filteredWorker?.userId ?? null}
          renderCell={(cell, columnIndex) => (
            <EditableScheduleCell
              cell={cell}
              isEditMode={isEditMode}
              // 목·금 열은 검색창을 왼쪽으로 연다
              opensSearchToLeft={columnIndex >= SEARCH_TO_LEFT_FROM_COLUMN}
              onAdd={handleAdd}
              onRemoveRequest={(targetCell, user) => setRemoveTarget({ cell: targetCell, user })}
            />
          )}
        />
      </section>

      {/* 스크롤해도 오른쪽 칸은 화면에 붙어 있다 */}
      <div className='sticky top-[2.4rem] flex flex-col gap-[1.6rem]'>
        <QuickSearchPanel onSelectedWorkerChange={setFilteredWorker} />
        {filteredWorker ? (
          <WorkerTimePanel
            worker={filteredWorker}
            days={schedule.days}
            onClose={() => setFilteredWorker(null)}
          />
        ) : null}
        {isApplicationWeek ? null : <PendingRequestsPanel />}
      </div>

      <ConfirmModal
        open={removeTarget !== null}
        handleOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title='인원을 빼시겠습니까?'
        description={
          removeTarget
            ? `${removeTarget.user.userName} / ${formatMonthDay(removeTarget.cell.dateKey)} ${removeTarget.cell.start}-${removeTarget.cell.end}`
            : undefined
        }
        buttons={[
          { label: '취소', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '빼기', color: 'red', size: 'medium', onClick: handleRemoveConfirm },
        ]}
      />
      {toast}
    </div>
  );
}
