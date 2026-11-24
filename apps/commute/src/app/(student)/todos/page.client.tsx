'use client';

import { useState } from 'react';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';
import { PeriodTabs, TodoSection, WorkTimeSection } from './_components';
import { useTodayTodos } from './_hooks/useTodayTodos';
import { getPeriodFromParam } from './_utils/period';

type PageClientProps = {
  periodParam: string | undefined;
};

export default function PageClient({ periodParam }: PageClientProps) {
  const [today] = useState(() => new Date());
  const period = getPeriodFromParam(periodParam, today);
  const { myUserId, todos, periodSlots, isOnDuty, handleToggleTodo } = useTodayTodos(today, period);

  const [isTodoOpen, setIsTodoOpen] = useState(true);
  const [isWorkTimeOpen, setIsWorkTimeOpen] = useState(true);

  return (
    <div className='flex w-full flex-col gap-[2.4rem] px-[2rem] py-[2.4rem]'>
      <div>
        <h2 className='font-16-md text-blue'>{formatMonthDayWithWeekday(today)}</h2>
        <h1 className='title-20-bd text-black'>오늘의 업무</h1>
      </div>
      <PeriodTabs period={period} />
      <TodoSection
        period={period}
        todos={todos}
        myUserId={myUserId}
        isOnDuty={isOnDuty}
        isOpen={isTodoOpen}
        onToggleOpen={() => setIsTodoOpen((prev) => !prev)}
        onToggleTodo={handleToggleTodo}
      />
      <WorkTimeSection
        slots={periodSlots}
        myUserId={myUserId}
        isOpen={isWorkTimeOpen}
        onToggleOpen={() => setIsWorkTimeOpen((prev) => !prev)}
      />
    </div>
  );
}
