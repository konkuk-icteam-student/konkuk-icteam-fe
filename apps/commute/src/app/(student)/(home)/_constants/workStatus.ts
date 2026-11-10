import type { TodoPeriod } from '@/app/(student)/_apis/todos';
// 오전·오후 근무 이름
export const WORK_SHIFT_LABEL: Record<TodoPeriod, string> = {
  MORNING: '오전 근무',
  AFTERNOON: '오후 근무',
};
