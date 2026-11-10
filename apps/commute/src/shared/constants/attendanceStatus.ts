import type { ChipTone } from '@/shared/ui';

// 근무 칸 하나의 근태. 예정 · 근무중 · 근무 완료 · 지각 · 결근
export type SlotAttendanceStatus = 'SCHEDULED' | 'WORKING' | 'DONE' | 'LATE' | 'ABSENT';

// 근무 시간표 칩의 근태별 문구와 색
export const SLOT_ATTENDANCE_STATUS_THEME: Record<
  SlotAttendanceStatus,
  { label: string; tone: ChipTone }
> = {
  WORKING: { label: '근무중', tone: 'blue' },
  DONE: { label: '근무 완료', tone: 'green' },
  SCHEDULED: { label: '근무 예정', tone: 'gray' },
  LATE: { label: '지각', tone: 'purple' },
  ABSENT: { label: '결근', tone: 'red' },
};
