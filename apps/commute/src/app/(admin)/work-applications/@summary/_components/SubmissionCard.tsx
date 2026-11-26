import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDayTime } from '@/shared/utils/formatDate';
import { formatWorkDuration } from '@/shared/utils/time';
import type { SubmissionWithStatus } from '../_utils/submission';

type SubmissionCardProps = Omit<SubmissionWithStatus, 'userId' | 'grade'>;

// 근로장학생 한 명의 제출 카드
export default function SubmissionCard({
  name,
  department,
  studentId,
  submittedMinutes,
  lastSubmittedAt,
  isMet,
}: SubmissionCardProps) {
  return (
    <li className='flex flex-col gap-[0.4rem] rounded-[1.2rem] border border-gray-50 p-[1.4rem]'>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <span className='font-14-bd text-black'>{name}</span>
        <StateChip label={isMet ? '충족' : '미충족'} tone={isMet ? 'blue' : 'gray'} />
      </div>
      <span className='caption-12-rg truncate text-gray-500'>
        {[department, studentId].join(' · ')}
      </span>
      <div className='caption-12-rg flex items-center justify-between gap-[0.8rem] text-gray-500'>
        <span>
          총 제출시간{' '}
          <span className={cn('caption-12-md', isMet ? 'text-black' : 'text-red')}>
            {formatWorkDuration(submittedMinutes)}
          </span>
        </span>
        <span>
          {lastSubmittedAt ? `최근 신청 ${formatMonthDayTime(lastSubmittedAt)}` : '미제출'}
        </span>
      </div>
    </li>
  );
}
