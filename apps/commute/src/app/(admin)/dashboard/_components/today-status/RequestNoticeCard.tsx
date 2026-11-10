'use client';

import Link from 'next/link';
import { IconArrowRight, IconInfo } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { WORK_CHANGE_REQUEST_STATUS } from '@/shared/constants/workChangeRequestStatus';
import {
  createStatusFilterHref,
  STATUS_FILTER_ALL,
} from '../../../worktime/change-requests/_utils/statusFilter';

// 승인 대기 요청 수를 알리고 근로시간 수정요청 화면으로 보내는 카드
export default function RequestNoticeCard() {
  // TODO: 근로시간 수정요청 API에서 승인 대기 요청 수를 가져와서 넣어야 함
  const count = 0;
  const hasRequests = count > 0;
  const href = createStatusFilterHref(
    hasRequests ? WORK_CHANGE_REQUEST_STATUS.PENDING : STATUS_FILTER_ALL,
  );

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-[1.2rem] rounded-[1.2rem] px-[2rem] py-[1.4rem] transition-colors',
        hasRequests ? 'bg-blue/10 hover:bg-blue/15' : 'bg-gray-50 hover:bg-gray-50/70',
      )}
    >
      <span
        className={cn(
          'flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-full',
          hasRequests ? 'bg-blue text-black-1' : 'bg-black-1 text-gray-400',
        )}
      >
        <IconInfo aria-hidden className='h-[1.6rem] w-[1.6rem]' />
      </span>
      <span className='flex min-w-0 flex-1 flex-col gap-[0.4rem]'>
        <span className='caption-14-md text-black'>
          {hasRequests ? (
            <>
              처리할 근로시간 승인 요청이{' '}
              <strong className='font-14-bd text-blue'>{`${count}건`}</strong>
            </>
          ) : (
            <span className='text-gray-500'>처리할 승인 요청이 없어요</span>
          )}
        </span>
        <span
          className={cn(
            'caption-12-md flex items-center gap-[0.2rem]',
            hasRequests ? 'text-blue' : 'text-gray-500',
          )}
        >
          요청 내역 보기
          <IconArrowRight
            aria-hidden
            className='h-[1.6rem] w-[1.6rem] transition-transform group-hover:translate-x-[0.2rem]'
          />
        </span>
      </span>
    </Link>
  );
}
