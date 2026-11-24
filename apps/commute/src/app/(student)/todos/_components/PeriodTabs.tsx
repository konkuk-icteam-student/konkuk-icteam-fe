import Link from 'next/link';
import { Tabs } from '@konkuk-icteam-fe/design-system/ui';
import type { TodoPeriod } from '@/app/(student)/_apis/todos';
import { ROUTES } from '@/shared/config/routes';
import { PERIOD_PARAMS } from '../_utils/period';

const PERIOD_TABS: { period: TodoPeriod; label: string }[] = [
  { period: 'MORNING', label: '오전' },
  { period: 'AFTERNOON', label: '오후' },
];

type PeriodTabsProps = {
  period: TodoPeriod;
};

// 오전·오후 탭. 고른 시간대는 주소(?period=)에 남아서 새로 고침해도 그대로다
export default function PeriodTabs({ period }: PeriodTabsProps) {
  return (
    <Tabs className='bg-transparent'>
      <Tabs.List activeValue={period} className='px-0' aria-label='업무 시간대'>
        {PERIOD_TABS.map((tab) => (
          <Tabs.Item
            key={tab.period}
            as={Link}
            value={tab.period}
            activeValue={period}
            href={`${ROUTES.TODOS}?period=${PERIOD_PARAMS[tab.period]}`}
            replace
            scroll={false}
          >
            {tab.label}
          </Tabs.Item>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
