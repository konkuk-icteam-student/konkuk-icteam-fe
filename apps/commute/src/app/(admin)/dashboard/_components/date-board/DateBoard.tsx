'use client';

import { useId, useState } from 'react';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { useCurrentTime } from '../../_hooks/useCurrentTime';
import { useWorkSchedule } from '../../_hooks/useWorkSchedule';
import { getWorkersByPeriod } from '../../_utils/getWorkersByPeriod';
import AssignTaskList from './AssignTaskList';
import DateSelector from './DateSelector';
import WorkScheduleList from './WorkScheduleList';

type DateBoardProps = {
  // 업무를 추가·수정·삭제한 뒤 알릴 글자
  onNotify: (message: string) => void;
};

type BoardColumnProps = {
  title: string;
  children: React.ReactNode;
};

// 날짜 카드 아래 두 칸 중 하나. 제목 밑에 내용을 둔다
const BoardColumn = ({ title, children }: BoardColumnProps) => (
  <div className='px-[2.1rem] py-[1.6rem]'>
    <h3 className='font-16-bd mb-[2rem] text-black'>{title}</h3>
    {children}
  </div>
);

// 그날 하루를 보는 카드. 근무 시간표는 직접 불러온다. 맨 위 날짜를 바꾸면 아래 근무 시간표와 업무 지정이 함께 바뀐다
export default function DateBoard({ onNotify }: DateBoardProps) {
  // 처음에는 오늘을 본다
  const [selectedDateKey, setSelectedDateKey] = useState(() => toISO(new Date()));
  const { slots, shifts } = useWorkSchedule(selectedDateKey);
  const currentTime = useCurrentTime();
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className='rounded-[1.2rem] border border-gray-50'>
      <div className='flex items-center justify-center border-b border-gray-50 px-[2.1rem] py-[1.6rem]'>
        <DateSelector
          selectedDateKey={selectedDateKey}
          headingId={headingId}
          onSelect={setSelectedDateKey}
        />
      </div>

      <div className='grid grid-cols-2 divide-x divide-gray-50'>
        <BoardColumn title='근무 시간표'>
          <WorkScheduleList
            dateKey={selectedDateKey}
            slots={slots}
            shifts={shifts}
            now={currentTime}
          />
        </BoardColumn>
        <BoardColumn title='업무 지정'>
          <AssignTaskList
            dateKey={selectedDateKey}
            workersByPeriod={getWorkersByPeriod(slots)}
            onNotify={onNotify}
          />
        </BoardColumn>
      </div>
    </section>
  );
}
