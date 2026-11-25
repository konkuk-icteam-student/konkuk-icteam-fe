import { SLOT_ATTENDANCE_STATUS_THEME, type StatusTheme } from './attendanceStatus';

// 근무 상태 코드. 서버가 주는 값 그대로다
export const WORK_STATUS = {
  SCHEDULED: 'WK01',
  WORKING: 'WK02',
  DONE: 'WK03',
  ABSENT: 'WK04',
} as const;

export type WorkStatusCode = (typeof WORK_STATUS)[keyof typeof WORK_STATUS];

// 근무 상태별 문구와 상태 칩 색. 관리자 근태 칩과 같은 표를 쓴다
export const WORK_STATUS_THEME: Record<WorkStatusCode, StatusTheme> = {
  [WORK_STATUS.SCHEDULED]: SLOT_ATTENDANCE_STATUS_THEME.SCHEDULED,
  [WORK_STATUS.WORKING]: SLOT_ATTENDANCE_STATUS_THEME.WORKING,
  [WORK_STATUS.DONE]: SLOT_ATTENDANCE_STATUS_THEME.DONE,
  [WORK_STATUS.ABSENT]: SLOT_ATTENDANCE_STATUS_THEME.ABSENT,
};
