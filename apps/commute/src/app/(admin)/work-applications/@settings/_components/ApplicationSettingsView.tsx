'use client';

import { useState } from 'react';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDay, formatMonthDayTime } from '@/shared/utils/formatDate';
import { useWorkApplication } from '../../_components/WorkApplicationProvider';

// 연 근로신청 기준을 글로 보여 준다. 신청 마감 전에는 '수정'으로 입력 폼으로 바꿀 수 있다
export default function ApplicationSettingsView() {
  const {
    application: { settings },
    startEditing,
  } = useWorkApplication();
  // 마감은 처음 그릴 때 기준으로 본다
  const [isClosed] = useState(() => settings !== null && settings.applyEndDate < new Date());

  if (!settings) return null;

  const rows = [
    {
      title: '신청 기간',
      value: `${formatMonthDayTime(settings.applyStartDate)} - ${formatMonthDayTime(settings.applyEndDate)}`,
    },
    {
      title: '근로시간 기준',
      value: `주간 ${settings.weeklyMinHours} - ${settings.weeklyMaxHours}시간 · 월간 ${settings.monthlyMinHours} - ${settings.monthlyMaxHours}시간`,
    },
    { title: '동시 근무 최대 인원', value: `${settings.maxConcurrentWorkers}명` },
    {
      title: '근무 불가 날짜',
      value: settings.unavailableDates.map(formatMonthDay).join(', ') || '없음',
    },
    {
      title: '근무 불가 시간대',
      value:
        settings.unavailableTimeRanges.map(({ start, end }) => `${start} - ${end}`).join(', ') ||
        '없음',
    },
  ];

  return (
    <div className='bg-black-1 mx-[2.1rem] mb-[2rem] flex flex-col justify-between gap-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[3rem]'>
      <dl className='grid grid-cols-[14rem_1fr] gap-y-[2rem]'>
        {rows.map(({ title, value }) => (
          <div key={title} className='contents'>
            <dt className='font-14-bd text-black'>{title}</dt>
            <dd className='caption-14-md text-gray-700'>{value}</dd>
          </div>
        ))}
      </dl>

      <div className='flex items-center justify-end gap-[1.6rem] border-t border-gray-50 pt-[2.4rem]'>
        {isClosed && (
          <p className='caption-12-rg text-gray-500'>신청이 마감돼서 기준을 고칠 수 없어요.</p>
        )}
        <Button
          display='inline'
          size='medium'
          color='blue'
          className='w-[14rem]'
          disabled={isClosed}
          onClick={startEditing}
        >
          {isClosed ? '신청 마감' : '수정'}
        </Button>
      </div>
    </div>
  );
}
