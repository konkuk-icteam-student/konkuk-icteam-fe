'use client';

import { useId, useState } from 'react';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import useWorkSchedule from '../../_hooks/useWorkSchedule';
import AssignTaskList from './task/AssignTaskList';
import DateSelector from './DateSelector';
import WorkScheduleList from './schedule/WorkScheduleList';

type BoardColumnProps = {
  title: string;
  children: React.ReactNode;
};

const BoardColumn = ({ title, children }: BoardColumnProps) => (
  <div className='px-[2.1rem] py-[1.6rem]'>
    <h3 className='font-16-bd mb-[2rem] text-black'>{title}</h3>
    {children}
  </div>
);

type DateBoardProps = {
  onNotify: (message: string) => void;
};

// 날짜를 고르면 그날 근무 시간표와 업무 지정이 함께 바뀌는 카드
export default function DateBoard({ onNotify }: DateBoardProps) {
  const [selectedDateKey, setSelectedDateKey] = useState(() => toISO(new Date()));
  const { scheduleGroups, workersByPeriod } = useWorkSchedule(selectedDateKey);
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      // 업무 줄의 팝업이 카드 아래로 넘치면 위로 띄운다
      data-popover-boundary
      className='rounded-[1.2rem] border border-gray-50'
    >
      <div className='flex items-center justify-center border-b border-gray-50 px-[2.1rem] py-[1.6rem]'>
        <DateSelector
          selectedDateKey={selectedDateKey}
          headingId={headingId}
          onSelect={setSelectedDateKey}
        />
      </div>

      <div className='grid grid-cols-2 divide-x divide-gray-50'>
        <BoardColumn title='근무 시간표'>
          <WorkScheduleList groups={scheduleGroups} />
        </BoardColumn>
        <BoardColumn title='업무 지정'>
          <AssignTaskList
            dateKey={selectedDateKey}
            workersByPeriod={workersByPeriod}
            onNotify={onNotify}
          />
        </BoardColumn>
      </div>
    </section>
  );
}
