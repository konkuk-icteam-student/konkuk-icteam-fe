import { Dropdown } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkApplicationSubmission } from '../../../_apis/workApplications';
import SubmissionCard from './SubmissionCard';

type SubmissionListProps = {
  counts: { submittedCount: number; metCount: number; unmetCount: number };
  submissions: (WorkApplicationSubmission & { isMet: boolean })[];
  sortOptions: string[];
  sortLabel: string;
  onSortChange: (label: string) => void;
};

export default function SubmissionList({
  counts: { submittedCount, metCount, unmetCount },
  submissions,
  sortOptions,
  sortLabel,
  onSortChange,
}: SubmissionListProps) {
  return (
    <>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <p className='caption-12-md text-gray-500'>
          {`제출 ${submittedCount}명 · 충족 ${metCount}명 · 미충족 ${unmetCount}명`}
        </p>
        <div className='w-[11rem] shrink-0'>
          <Dropdown
            options={sortOptions}
            value={sortLabel}
            onChange={onSortChange}
            triggerClassName='caption-12-md justify-end gap-[0.2rem] border-none bg-transparent px-0 text-gray-700'
            optionClassName='caption-12-md'
          />
        </div>
      </div>

      {submissions.length === 0 ? (
        <p className='caption-14-md flex flex-1 items-center justify-center rounded-[1.2rem] bg-gray-50 text-gray-400'>
          신청한 근로장학생이 없습니다.
        </p>
      ) : (
        <ul className='flex min-h-0 flex-1 flex-col gap-[1rem] overflow-y-auto'>
          {submissions.map(({ userId, ...submission }) => (
            <SubmissionCard key={userId} {...submission} />
          ))}
        </ul>
      )}
    </>
  );
}
