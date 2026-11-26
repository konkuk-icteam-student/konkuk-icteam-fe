import { useState } from 'react';
import {
  getWorkApplication,
  GetWorkApplicationRequest,
  getWorkApplicationSubmissions,
} from '../../../_apis/workApplications';
import {
  checkMonthlyHoursMet,
  createSortedSubmissions,
  getSubmissionCounts,
  SUBMISSION_SORT_LABELS,
  type SubmissionSortKey,
} from '../_utils/submission';

const SORT_KEYS = Object.keys(SUBMISSION_SORT_LABELS) as SubmissionSortKey[];

// 근로신청 요약
export default function useApplicationSummary(yearMonth: GetWorkApplicationRequest) {
  const [sortKey, setSortKey] = useState<SubmissionSortKey>('STATUS');

  const { settings } = getWorkApplication(yearMonth);
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
