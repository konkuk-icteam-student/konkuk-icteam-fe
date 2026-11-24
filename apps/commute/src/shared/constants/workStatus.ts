import type { ChipTone } from '@/shared/ui';

// 근무 상태 코드. 서버가 주는 값 그대로다
export const WORK_STATUS = {
  SCHEDULED: 'WK01',
  WORKING: 'WK02',
  DONE: 'WK03',
  ABSENT: 'WK04',
} as const;

export type WorkStatusCode = (typeof WORK_STATUS)[keyof typeof WORK_STATUS];

// 근무 상태별 문구와 상태 칩 색
export const WORK_STATUS_THEME: Record<WorkStatusCode, { label: string; tone: ChipTone }> = {
  [WORK_STATUS.SCHEDULED]: { label: '예정', tone: 'gray' },
  [WORK_STATUS.WORKING]: { label: '근무중', tone: 'blue' },
  [WORK_STATUS.DONE]: { label: '근무 완료', tone: 'green' },
  [WORK_STATUS.ABSENT]: { label: '결근', tone: 'red' },
};
