import type { ChipTone } from '@/shared/ui';

// 근무 칸 하나의 근태. 예정 · 근무중 · 근무 완료 · 지각 · 결근
export type SlotAttendanceStatus = 'SCHEDULED' | 'WORKING' | 'DONE' | 'LATE' | 'ABSENT';

// 상태 칩 하나의 문구와 색
export type StatusTheme = { label: string; tone: ChipTone };

// 근태별 문구와 칩 색. 학생 근무 상태(WK0x, workStatus.ts)도 이 표를 쓴다
export const SLOT_ATTENDANCE_STATUS_THEME: Record<SlotAttendanceStatus, StatusTheme> = {
  WORKING: { label: '근무중', tone: 'blue' },
  DONE: { label: '근무 완료', tone: 'green' },
  SCHEDULED: { label: '근무 예정', tone: 'gray' },
  LATE: { label: '지각', tone: 'gold' },
  ABSENT: { label: '결근', tone: 'red' },
};
