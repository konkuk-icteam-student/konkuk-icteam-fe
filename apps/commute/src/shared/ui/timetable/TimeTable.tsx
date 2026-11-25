import type { TimeLabelFormat, TimeTableCell, TimeTableDay } from './types';
import TimeTableDayColumn from './TimeTableDayColumn';
import TimeColumn from './TimeColumn';

type TimeTableProps = {
  days: TimeTableDay[];
  // 요일별 칸 목록. 화면이 칸 상태를 계산해 넘긴다 (근로학생은 useTimeTable, 관리자 수정요청은 createRequestTimeTableCells)
  cells: TimeTableCell[][];
  // 시간 열 표기. 기본은 근로학생 화면의 시만 쓰는 표기
  timeLabelFormat?: TimeLabelFormat;
};

// 주간 시간표 카드 (근로학생·관리자 공통). 칸 상태 계산은 화면에서 끝내고, 여기서는 그리기만 한다.
export default function TimeTable({ days, cells, timeLabelFormat = 'hour' }: TimeTableProps) {
  return (
    <div className='bg-black-1 flex items-start gap-[0.4rem] rounded-[1.2rem] border border-gray-400/30 px-[1.2rem] py-[1.6rem]'>
      <TimeColumn format={timeLabelFormat} />
      {days.map((day, dayIndex) => (
        <TimeTableDayColumn key={day.date} day={day} cells={cells[dayIndex] ?? []} />
      ))}
    </div>
  );
}
