import { Toggle } from '@konkuk-icteam-fe/design-system/ui';
import MonthWeekNavigator from './MonthWeekNavigator';

type TimeTableToolbarProps = {
  week: number;
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  // '자세히보기'를 켜면 칸마다 신청 인원을 보여 준다
  isDetailVisible: boolean;
  onDetailVisibleChange: (isVisible: boolean) => void;
};

// 시간표 위 한 줄. 가운데에 주차 이동, 오른쪽에 자세히보기 스위치를 둔다
export default function TimeTableToolbar({
  isDetailVisible,
  onDetailVisibleChange,
  ...weekNavigatorProps
}: TimeTableToolbarProps) {
  return (
    <div className='grid grid-cols-[1fr_auto_1fr] items-center'>
      <div />
      <MonthWeekNavigator {...weekNavigatorProps} />
      <Toggle
        className='justify-self-end'
        label='자세히보기'
        checked={isDetailVisible}
        onCheckedChange={onDetailVisibleChange}
      />
    </div>
  );
}
