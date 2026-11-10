'use client';

import { useId } from 'react';
import { IconAdd } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Dropdown } from '@konkuk-icteam-fe/design-system/ui';
import type { TimeString } from '@/app/(student)/_apis/common';
import { getTodoAssigneeCounts } from '../../../_apis/todos';
import usePopover from '../../_hooks/usePopover';
import type { OnDutyWorker } from '../../_utils/getWorkersByPeriod';
import { getTaskStartOptions, getWorkersAt } from '../../_utils/taskTime';

type AssigneePickerProps = {
  todoId: number;
  // 업무 이름. 버튼과 팝오버를 읽어 줄 때 쓴다
  title: string;
  workers: OnDutyWorker[];
  // 고른 업무 시작 시각. 아직 고르지 않았으면 null
  start: TimeString | null;
  userIds: number[];
  onStartChange: (start: TimeString) => void;
  onToggle: (userId: number) => void;
};

// 업무 줄의 지정 버튼. 누르면 아래에 팝오버가 열려 시작 시각을 고르고, 그 시각에 근무하는 사람을 눌러 맡기거나 뺀다
export default function AssigneePicker({
  todoId,
  title,
  workers,
  start,
  userIds,
  onStartChange,
  onToggle,
}: AssigneePickerProps) {
  const panelId = useId();
  const { isOpen, areaRef, triggerRef, panelRef, handleToggle } = usePopover<HTMLDivElement>();
  const availableWorkers = start ? getWorkersAt(workers, start) : [];
  // 근로학생 id → 이 업무를 지금까지 한 횟수. 팝오버를 열 때만 읽는다
  const countByUserId: Record<number, number> = isOpen
    ? Object.fromEntries(
        getTodoAssigneeCounts({ todoId }).counts.map(({ userId, count }) => [userId, count]),
      )
    : {};

  return (
    <div ref={areaRef} className='relative shrink-0'>
      <button
        ref={triggerRef}
        type='button'
        aria-label={`${title} 지정`}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={workers.length === 0}
        className={cn(
          'caption-12-md text-blue focus-visible:outline-blue flex cursor-pointer items-center gap-[0.2rem] rounded-[0.6rem] px-[0.8rem] py-[0.4rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
          isOpen ? 'bg-blue/15' : 'hover:bg-blue/10 bg-gray-50',
        )}
        onClick={handleToggle}
      >
        {userIds.length === 0 && <IconAdd aria-hidden className='h-[1.4rem] w-[1.4rem]' />}
        지정
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role='dialog'
          aria-label={`${title} 근로학생 지정`}
          className='bg-black-1 absolute top-[calc(100%+0.4rem)] right-0 z-30 flex w-[30rem] flex-col gap-[1.2rem] rounded-[1rem] p-[1.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)] data-[side=top]:top-auto data-[side=top]:bottom-[calc(100%+0.4rem)]'
        >
          <div className='flex items-center gap-[1rem]'>
            <span className='caption-14-md shrink-0 text-gray-700'>시작 시각</span>
            <div className='w-[12rem]'>
              <Dropdown
                options={getTaskStartOptions(workers)}
                placeholder='시간 선택'
                value={start ?? ''}
                triggerClassName='px-[1rem]'
                optionWrapperClassName='relative z-40'
                onChange={onStartChange}
              />
            </div>
          </div>

          {start ? (
            <div className='flex flex-col gap-[0.8rem]'>
              <p className='caption-12-md text-gray-500'>
                이름 옆 숫자는 지금까지 이 업무를 맡은 횟수예요.
              </p>
              <div className='flex flex-wrap gap-[0.6rem]'>
                {availableWorkers.map(({ userId, userName }) => {
                  const isAssigned = userIds.includes(userId);

                  return (
                    <button
                      key={userId}
                      type='button'
                      aria-pressed={isAssigned}
                      className={cn(
                        'caption-12-md cursor-pointer rounded-full border px-[1rem] py-[0.4rem] transition-colors',
                        isAssigned
                          ? 'border-blue bg-blue text-black-1'
                          : 'bg-black-1 hover:border-blue border-gray-400 text-gray-700',
                      )}
                      onClick={() => onToggle(userId)}
                    >
                      {`${userName} · ${countByUserId[userId] ?? 0}회`}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className='caption-12-md text-gray-500'>
              시작 시각을 고르면 그때 근무하는 사람이 보여요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
