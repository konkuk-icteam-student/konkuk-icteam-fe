import Link from 'next/link';
import { Tabs } from '@konkuk-icteam-fe/design-system/ui';
import {
  WORK_CHANGE_REQUEST_STATUS,
  WORK_CHANGE_REQUEST_STATUS_THEME,
} from '@/shared/constants/workChangeRequestStatus';
import type { WorkChangeRequestSummary } from '../../../_apis/workChangeRequests';
import {
  createStatusFilterHref,
  STATUS_FILTER_ALL,
  type StatusFilter,
} from '../_utils/statusFilter';

// 탭마다 보여 줄 건수는 응답 summary의 어느 값인지
const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
  countKey: keyof WorkChangeRequestSummary;
}[] = [
  { value: STATUS_FILTER_ALL, label: '전체', countKey: 'totalCount' },
  {
    value: WORK_CHANGE_REQUEST_STATUS.PENDING,
    label: WORK_CHANGE_REQUEST_STATUS_THEME[WORK_CHANGE_REQUEST_STATUS.PENDING].label,
    countKey: 'pendingCount',
  },
  {
    value: WORK_CHANGE_REQUEST_STATUS.APPROVED,
    label: WORK_CHANGE_REQUEST_STATUS_THEME[WORK_CHANGE_REQUEST_STATUS.APPROVED].label,
    countKey: 'approvedCount',
  },
  {
    value: WORK_CHANGE_REQUEST_STATUS.REJECTED,
    label: WORK_CHANGE_REQUEST_STATUS_THEME[WORK_CHANGE_REQUEST_STATUS.REJECTED].label,
    countKey: 'rejectedCount',
  },
];

type StatusFilterTabsProps = {
  summary: WorkChangeRequestSummary;
  selected: StatusFilter;
};

// 처리 상태별 건수 탭. 누르면 주소가 바뀌고 그 상태의 요청만 보여 준다
export default function StatusFilterTabs({ summary, selected }: StatusFilterTabsProps) {
  return (
    <Tabs>
      <Tabs.List activeValue={selected} tabs={STATUS_FILTERS} aria-label='처리 상태'>
        {STATUS_FILTERS.map(({ value, label, countKey }) => (
          <Tabs.Item
            key={value}
            as={Link}
            value={value}
            activeValue={selected}
            href={createStatusFilterHref(value)}
            scroll={false}
          >
            {summary[countKey] > 0 ? `${label} (${summary[countKey]})` : label}
          </Tabs.Item>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
