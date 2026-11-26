'use client';

import Link from 'next/link';
import { ROUTES } from '@/shared/config/routes';
import AdminPanel from '../../../_layouts/AdminPanel';
import useApplicationSummary from '../_hooks/useApplicationSummary';
import SubmissionList from './SubmissionList';

// 근로신청 요약. 신청을 열기 전에는 빈 상태를, 연 뒤에는 모든 근로장학생의 제출 현황을 보여 준다
export default function ApplicationSummaryPanel() {
  const { month, counts, sortedSubmissions, sortOptions, sortLabel, handleSortChange } =
    useApplicationSummary();

  return (
    // 오른쪽 칸 높이는 왼쪽 열기 폼에 맞춘다. 학생이 많으면 목록 안에서 스크롤한다
    <AdminPanel
      title={`${month}월 근로신청 요약`}
      className='flex h-full flex-col'
      action={
        // 화면 이동이라 링크로 두고, 모양만 디자인 시스템 Button(small·solid·blue)에 맞춘다
        // TODO: 근로신청 시간표 화면을 근로신청 관리 아래로 옮기면 그 주소로 바꾼다
        <Link
          href={ROUTES.ADMIN_WORKTIME}
          className='bg-blue text-black-1 caption-12-md inline-flex items-center justify-center rounded-[0.4rem] px-[1.2rem] py-[0.6rem]'
        >
          시간표 자세히보기
        </Link>
      }
    >
      <div className='mx-[2.1rem] mb-[2rem] flex min-h-0 flex-1 flex-col gap-[1.2rem]'>
        {counts ? (
          <SubmissionList
            counts={counts}
            submissions={sortedSubmissions}
            sortOptions={sortOptions}
            sortLabel={sortLabel}
            onSortChange={handleSortChange}
          />
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] text-center'>
            <p className='font-14-bd text-gray-700'>근로신청이 시작되지 않았습니다.</p>
            <p className='caption-12-md text-gray-500'>
              신청 기간을 설정한 뒤 신청 받기를 눌러 시작하세요.
            </p>
          </div>
        )}
      </div>
    </AdminPanel>
  );
}
