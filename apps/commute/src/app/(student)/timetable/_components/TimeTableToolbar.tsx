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

// 시간표 위 한 줄. 오른쪽에 주차 이동과 자세히보기 스위치를 나란히 둔다
export default function TimeTableToolbar({
  isDetailVisible,
  onDetailVisibleChange,
  ...weekNavigatorProps
}: TimeTableToolbarProps) {
  return (
    <div className='flex items-center justify-end gap-[1.6rem]'>
      <MonthWeekNavigator {...weekNavigatorProps} />
      <Toggle
        label='자세히보기'
        checked={isDetailVisible}
        onCheckedChange={onDetailVisibleChange}
      />
    </div>
  );
}
