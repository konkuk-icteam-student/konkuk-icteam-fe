'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs } from '@konkuk-icteam-fe/design-system/ui';
import { TODO_PERIODS } from '@/app/(student)/_apis/todos';
import { ROUTES } from '@/shared/config/routes';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';
import { TodoSection, WorkTimeSection } from './_components';
import useTodayTodos from './_hooks/useTodayTodos';
import { getPeriodFromParam, PERIOD_LABELS, PERIOD_PARAMS } from './_utils/period';

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
      <Tabs className='bg-transparent'>
        <Tabs.List activeValue={period} className='px-0' aria-label='업무 시간대'>
          {TODO_PERIODS.map((tabPeriod) => (
            <Tabs.Item
              key={tabPeriod}
              as={Link}
              value={tabPeriod}
              activeValue={period}
              href={`${ROUTES.TODOS}?period=${PERIOD_PARAMS[tabPeriod]}`}
              replace
              scroll={false}
            >
              {PERIOD_LABELS[tabPeriod]}
            </Tabs.Item>
          ))}
        </Tabs.List>
      </Tabs>
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
