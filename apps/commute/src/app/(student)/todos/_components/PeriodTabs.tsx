import Link from 'next/link';
import { Tabs } from '@konkuk-icteam-fe/design-system/ui';
import type { TodoPeriod } from '@/app/(student)/_apis/todos';
import { ROUTES } from '@/shared/config/routes';
import { PERIOD_LABELS, PERIOD_PARAMS, TODO_PERIODS } from '../_utils/period';

type PeriodTabsProps = {
  period: TodoPeriod;
};

// 오전·오후 탭. 고른 시간대는 주소(?period=)에 남아서 새로 고침해도 그대로다
export default function PeriodTabs({ period }: PeriodTabsProps) {
  return (
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
  );
}
