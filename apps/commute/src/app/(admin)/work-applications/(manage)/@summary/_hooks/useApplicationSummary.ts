import { useState } from 'react';
import { getWorkApplicationSubmissions } from '../../../../_apis/workApplications';
import { useWorkApplication } from '../../_components/WorkApplicationProvider';
import {
  checkMonthlyHoursMet,
  createSortedSubmissions,
  getSubmissionCounts,
  SUBMISSION_SORT_LABELS,
  type SubmissionSortKey,
} from '../_utils/submission';

const SORT_KEYS = Object.keys(SUBMISSION_SORT_LABELS) as SubmissionSortKey[];

// 근로신청 요약
export default function useApplicationSummary() {
  const [sortKey, setSortKey] = useState<SubmissionSortKey>('STATUS');
  // 기준을 저장하면 context의 근로신청이 바뀌어서 제출 현황도 다시 읽는다
  const {
    yearMonth,
    application: { settings },
  } = useWorkApplication();
  const { submissions } = getWorkApplicationSubmissions(yearMonth);

  const counts = settings ? getSubmissionCounts(submissions, settings) : null;
  const sortedSubmissions = settings
    ? createSortedSubmissions(submissions, sortKey, settings).map((submission) => ({
        ...submission,
        isMet: checkMonthlyHoursMet(submission.submittedMinutes, settings),
      }))
    : [];

  const handleSortChange = (label: string) => {
    const nextKey = SORT_KEYS.find((key) => SUBMISSION_SORT_LABELS[key] === label);
    if (nextKey) setSortKey(nextKey);
  };

  return {
    month: yearMonth.month,
    counts,
    sortedSubmissions,
    sortOptions: SORT_KEYS.map((key) => SUBMISSION_SORT_LABELS[key]),
    sortLabel: SUBMISSION_SORT_LABELS[sortKey],
    handleSortChange,
  };
}
