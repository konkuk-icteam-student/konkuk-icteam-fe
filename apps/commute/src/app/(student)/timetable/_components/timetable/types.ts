import type { SlotStatus } from '@/shared/ui';
import type { TimeRange } from '@/shared/utils/timeRange';

// 근로학생 시간표 화면만 쓰는 타입. 표 모양(칸 상태·칸 데이터·요일)은 공통 컴포넌트 shared/ui/timetable에 있다

// edit 모드에서 바뀐 칸 하나. 수정 요청을 보낼 때 이 목록을 쓴다.
export type SlotEdit = {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  status: SlotStatus;
};

// 표가 칸 상태를 정할 때 쓰는 서버 데이터. 화면마다 조회한 응답으로 만들어 넘긴다
export type TimeTableSource = {
  // 처음(서버 기준) 내 근무·신청 칸. key는 createSlotKey로 만든다
  mySlotKeys: Set<string>;
  // detail 모드에서 칸마다 보여 줄 근무자 이름 (칸 key → 이름 목록)
  workersBySlot: Record<string, string[]>;
  // 한 칸에 함께 근무할 수 있는 최대 인원
  maxConcurrentWorkers: number;
  // 하루 통째로 근무할 수 없는 날 ('YYYY-MM-DD'). 공휴일과 관리자가 막은 날
  unavailableDates: string[];
  // 매일 근무할 수 없는 시간대. 그 달 근로신청 기준에서 관리자가 정한다
  unavailableTimeRanges: readonly TimeRange[];
  // 주 최대 근로시간. 채우면 빈 칸을 더 고를 수 없다
  weeklyMaxHours: number;
  // edit·apply에서 이 시각보다 먼저 시작하는 칸은 바꿀 수 없다
  editableFrom: Date;
};
