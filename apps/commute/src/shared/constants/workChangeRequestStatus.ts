import type { ChipTone } from '@/shared/ui';

// 근무 변경 요청 처리 상태 코드. 서버가 주는 값 그대로다
export const WORK_CHANGE_REQUEST_STATUS = {
  PENDING: 'CS01',
  APPROVED: 'CS02',
  REJECTED: 'CS03',
} as const;

export type WorkChangeRequestStatusCode =
  (typeof WORK_CHANGE_REQUEST_STATUS)[keyof typeof WORK_CHANGE_REQUEST_STATUS];

// 처리 상태별 문구와 상태 칩 색
export const WORK_CHANGE_REQUEST_STATUS_THEME: Record<
  WorkChangeRequestStatusCode,
  { label: string; tone: ChipTone }
> = {
  [WORK_CHANGE_REQUEST_STATUS.PENDING]: { label: '승인 대기', tone: 'gray' },
  [WORK_CHANGE_REQUEST_STATUS.APPROVED]: { label: '승인', tone: 'blue' },
  [WORK_CHANGE_REQUEST_STATUS.REJECTED]: { label: '반려', tone: 'red' },
};
