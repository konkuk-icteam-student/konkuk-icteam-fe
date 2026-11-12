'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Dropdown, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { formatMonthDay, formatMonthDayTime } from '@/shared/utils/formatDate';
import AdminPanel from '../../_layouts/AdminPanel';
import {
  getWorkApplicationSubmissions,
  type WorkApplicationSettings,
} from '../../_apis/workApplications';
import { parseMonthKey } from '../../_utils/monthKey';
import {
  checkMonthlyHoursMet,
  createSortedSubmissions,
  formatSubmittedHours,
  getSubmissionCounts,
  SUBMISSION_SORT_LABELS,
  type SubmissionSortKey,
} from '../_utils/applicationSummary';

type ApplicationSummaryPanelProps = {
  // 근로신청 달 (YYYY-MM)
  monthKey: string;
  monthLabel: string;
  // 저장된 근로신청 기준. 신청을 열지 않았으면 null
  savedSettings: WorkApplicationSettings | null;
  // 왼쪽에서 고르고 있는 근무 불가 날짜
  unavailableDates: Date[];
};

const SORT_KEYS = Object.keys(SUBMISSION_SORT_LABELS) as SubmissionSortKey[];

// 근로신청 요약. 신청을 열기 전에는 빈 상태를, 연 뒤에는 모든 근로장학생의 제출 현황을 보여 준다.
// 충족 판정은 저장된 기준으로 한다 (기준을 고쳐 저장하면 제출이 모두 초기화된다)
export default function ApplicationSummaryPanel({
  monthKey,
  monthLabel,
  savedSettings,
  unavailableDates,
}: ApplicationSummaryPanelProps) {
  const [sortKey, setSortKey] = useState<SubmissionSortKey>('STATUS');

  return (
    // 오른쪽 칸 높이는 왼쪽 설정 패널에 맞춘다. 학생이 많으면 목록 안에서 스크롤한다
    <AdminPanel
      title={`${monthLabel} 근로신청 요약`}
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
        {savedSettings ? (
          <SubmissionList
            monthKey={monthKey}
            settings={savedSettings}
            sortKey={sortKey}
            onSortChange={setSortKey}
          />
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] text-center'>
            <p className='font-14-bd text-gray-700'>근로신청이 시작되지 않았습니다.</p>
            <p className='caption-12-md text-gray-500'>
              신청 기간을 설정한 뒤 신청 받기를 눌러 시작하세요.
            </p>
          </div>
        )}

        <dl className='flex flex-col gap-[0.6rem] rounded-[1.2rem] bg-gray-50 p-[1.4rem]'>
          <dt className='caption-12-md text-gray-700'>근무 불가 날짜</dt>
          <dd className='caption-12-md break-keep text-gray-500'>
            {unavailableDates.length > 0 ? unavailableDates.map(formatMonthDay).join(', ') : '없음'}
          </dd>
        </dl>
      </div>
    </AdminPanel>
  );
}

type SubmissionListProps = {
  monthKey: string;
  settings: WorkApplicationSettings;
  sortKey: SubmissionSortKey;
  onSortChange: (sortKey: SubmissionSortKey) => void;
};

// 제출 집계와 근로장학생별 제출 카드
function SubmissionList({ monthKey, settings, sortKey, onSortChange }: SubmissionListProps) {
  const { submissions } = getWorkApplicationSubmissions(parseMonthKey(monthKey));
  const { submittedCount, metCount, unmetCount } = getSubmissionCounts(submissions, settings);
  const sortedSubmissions = createSortedSubmissions(submissions, sortKey, settings);

  return (
    <>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <p className='caption-12-md text-gray-500'>
          {`제출 ${submittedCount}명 · 충족 ${metCount}명 · 미충족 ${unmetCount}명`}
        </p>
        <div className='w-[11rem] shrink-0'>
          <Dropdown
            options={SORT_KEYS.map((key) => SUBMISSION_SORT_LABELS[key])}
            value={SUBMISSION_SORT_LABELS[sortKey]}
            onChange={(label) => {
              const nextKey = SORT_KEYS.find((key) => SUBMISSION_SORT_LABELS[key] === label);
              if (nextKey) onSortChange(nextKey);
            }}
            triggerClassName='caption-12-md justify-end gap-[0.2rem] border-none bg-transparent px-0 text-gray-700'
            optionClassName='caption-12-md'
          />
        </div>
      </div>

      {sortedSubmissions.length === 0 ? (
        <p className='caption-14-md flex flex-1 items-center justify-center rounded-[1.2rem] bg-gray-50 text-gray-400'>
          신청할 수 있는 근로장학생이 없습니다.
        </p>
      ) : (
        <ul className='flex min-h-0 flex-1 flex-col gap-[1rem] overflow-y-auto'>
          {sortedSubmissions.map(
            ({ userId, name, department, studentId, grade, submittedMinutes, lastSubmittedAt }) => {
              const isMet = checkMonthlyHoursMet(submittedMinutes, settings);

              return (
                <li
                  key={userId}
                  className='flex flex-col gap-[0.4rem] rounded-[1.2rem] border border-gray-50 p-[1.4rem]'
                >
                  <div className='flex items-center justify-between gap-[0.8rem]'>
                    <span className='font-14-bd text-black'>{name}</span>
                    <StateChip label={isMet ? '충족' : '미충족'} tone={isMet ? 'blue' : 'gray'} />
                  </div>
                  <span className='caption-12-rg truncate text-gray-500'>
                    {[
                      department ?? '학과 미입력',
                      studentId ?? '학번 미입력',
                      grade ? `${grade}학년` : '학년 미입력',
                    ].join(' · ')}
                  </span>
                  <div className='caption-12-rg flex items-center justify-between gap-[0.8rem] text-gray-500'>
                    <span>
                      총 제출시간{' '}
                      <span className={cn('caption-12-md', isMet ? 'text-black' : 'text-red')}>
                        {formatSubmittedHours(submittedMinutes)}
                      </span>
                    </span>
                    <span>
                      {lastSubmittedAt
                        ? `최근 신청 ${formatMonthDayTime(lastSubmittedAt)}`
                        : '미제출'}
                    </span>
                  </div>
                </li>
              );
            },
          )}
        </ul>
      )}
    </>
  );
}
