'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IconArrowLeft } from '@konkuk-icteam-fe/design-system/assets';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { ROUTES } from '@/shared/config/routes';
import { getMonthWeekInfo } from '@/shared/utils/week';
import { getWorkApplication } from '../../_apis/workApplications';
import WeekSchedule from '../../_components/week-schedule/WeekSchedule';
import { getMonthFirstWeekStartKey } from '../../_components/week-schedule/utils/viewableWeeks';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../../_utils/monthKey';

// 근로신청 시간표. 근로시간 관리와 같은 주간 시간표에 제목 줄을 붙인다.
// 다음 달 신청을 열었으면 그 달 첫 주부터, 아니면 이번 주부터 연다
// (주소가 근로신청 관리 아래라 사이드바도 근로신청 관리가 켜진다)
export default function PageClient() {
  const [initialWeekStartKey] = useState(() => {
    const applicationMonthKey = shiftMonthKey(getCurrentMonthKey(), 1);
    const { isOpened } = getWorkApplication(parseMonthKey(applicationMonthKey));

    return isOpened ? getMonthFirstWeekStartKey(applicationMonthKey) : undefined;
  });

  return (
    <WeekSchedule
      initialWeekStartKey={initialWeekStartKey}
      renderHeader={(weekStartKey) => {
        // 두 달에 걸친 주는 목요일이 속한 달로 센다 (11.30 - 12.04는 12월)
        const { month } = getMonthWeekInfo(parseISO(weekStartKey));

        return (
          <h1 className='title-20-bd flex items-center gap-[1.2rem] text-black'>
            <Link
              href={ROUTES.ADMIN_WORK_APPLICATIONS}
              aria-label='근로신청 관리로 돌아가기'
              className='flex h-[2.4rem] w-[2.4rem] items-center justify-center text-black'
            >
              <IconArrowLeft aria-hidden className='h-[2rem] w-[2rem]' />
            </Link>
            {`근로신청 관리 - ${month}월 근로신청 시간표`}
          </h1>
        );
      }}
    />
  );
}
