import type { TodoPeriod } from '../_apis/todos';

// 시각은 HH:mm(두 자리)라 문자열 비교로 앞뒤를 가린다
const NOON = '12:00';

// 근무·업무 시간대. 12시 전에 시작하는 근무는 오전, 나머지는 오후
export const PERIODS: {
  period: TodoPeriod;
  label: string;
  // 이 시각에 시작하는 근무 칸이 이 시간대에 드는지
  includesStart: (start: string) => boolean;
}[] = [
  { period: 'MORNING', label: '오전', includesStart: (start) => start < NOON },
  { period: 'AFTERNOON', label: '오후', includesStart: (start) => start >= NOON },
];
