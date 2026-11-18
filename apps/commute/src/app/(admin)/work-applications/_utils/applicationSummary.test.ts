import { describe, expect, it } from 'vitest';
import type { WorkApplicationSubmission } from '../../_apis/workApplications';
import {
  checkMonthlyHoursMet,
  createSortedSubmissions,
  formatSubmittedHours,
  getSubmissionCounts,
} from './applicationSummary';

const RANGE = { monthlyMinHours: 30, monthlyMaxHours: 60 };

const createSubmission = (
  name: string,
  submittedHours: number,
  lastSubmittedAt: Date | null,
): WorkApplicationSubmission => ({
  userId: name.charCodeAt(0),
  name,
  studentId: null,
  department: null,
  grade: null,
  submittedMinutes: submittedHours * 60,
  lastSubmittedAt,
});

// 충족 2명(가·나), 미충족 1명(다), 미제출 1명(라)
const SUBMISSIONS = [
  createSubmission('나', 40, new Date(2026, 10, 21, 10)),
  createSubmission('라', 0, null),
  createSubmission('가', 30, new Date(2026, 10, 20, 9)),
  createSubmission('다', 24, new Date(2026, 10, 23, 9)),
];

describe('checkMonthlyHoursMet', () => {
  it('월간 최소 이상, 최대 이하이면 충족이다', () => {
    expect(checkMonthlyHoursMet(30 * 60, RANGE)).toBe(true);
    expect(checkMonthlyHoursMet(60 * 60, RANGE)).toBe(true);
  });

  it('최소보다 적거나 최대보다 많으면 미충족이다', () => {
    expect(checkMonthlyHoursMet(29 * 60 + 30, RANGE)).toBe(false);
    expect(checkMonthlyHoursMet(60 * 60 + 30, RANGE)).toBe(false);
    expect(checkMonthlyHoursMet(0, RANGE)).toBe(false);
  });
});

describe('getSubmissionCounts', () => {
  it('미제출은 미충족에 함께 센다', () => {
    expect(getSubmissionCounts(SUBMISSIONS, RANGE)).toEqual({
      submittedCount: 3,
      metCount: 2,
      unmetCount: 2,
    });
  });
});

describe('createSortedSubmissions', () => {
  const getNames = (submissions: WorkApplicationSubmission[]) =>
    submissions.map(({ name }) => name);

  it('상태순은 미충족이 먼저이고 같은 상태끼리는 이름순이다', () => {
    expect(getNames(createSortedSubmissions(SUBMISSIONS, 'STATUS', RANGE))).toEqual([
      '다',
      '라',
      '가',
      '나',
    ]);
  });

  it('이름순으로 정렬한다', () => {
    expect(getNames(createSortedSubmissions(SUBMISSIONS, 'NAME', RANGE))).toEqual([
      '가',
      '나',
      '다',
      '라',
    ]);
  });

  it('최근 신청순은 최근에 낸 학생이 먼저이고 미제출은 맨 뒤다', () => {
    expect(getNames(createSortedSubmissions(SUBMISSIONS, 'RECENT', RANGE))).toEqual([
      '다',
      '나',
      '가',
      '라',
    ]);
  });

  it('원래 배열은 바꾸지 않는다', () => {
    const original = [...SUBMISSIONS];
    createSortedSubmissions(SUBMISSIONS, 'NAME', RANGE);

    expect(SUBMISSIONS).toEqual(original);
  });
});

describe('formatSubmittedHours', () => {
  it('정시간이면 시간만, 30분이 남으면 분까지 적는다', () => {
    expect(formatSubmittedHours(24 * 60)).toBe('24시간');
    expect(formatSubmittedHours(0)).toBe('0시간');
    expect(formatSubmittedHours(90)).toBe('1시간 30분');
  });
});
