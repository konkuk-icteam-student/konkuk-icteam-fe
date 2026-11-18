import { ArrowButton } from '@/shared/ui';
import { formatWeekRange } from '../_utils/weekKey';

type WeekRangeNavigatorProps = {
  weekStartKey: string;
  // 다음 주로 넘길 수 있는지. 볼 수 있는 마지막 주에서는 막는다
  canMoveNext?: boolean;
  onMove: (delta: number) => void;
};

// 양 끝 화살표로 주를 옮기고, 가운데에 그 주의 월~금 날짜를 보여 준다
export default function WeekRangeNavigator({
  weekStartKey,
  canMoveNext = true,
  onMove,
}: WeekRangeNavigatorProps) {
  return (
    <div className='flex items-center gap-[2rem]'>
      <ArrowButton direction='left' size='medium' aria-label='이전 주' onClick={() => onMove(-1)} />
      <h2 className='title-20-sb min-w-[26rem] text-center text-black'>
        {formatWeekRange(weekStartKey)}
      </h2>
      <ArrowButton
        direction='right'
        size='medium'
        aria-label='다음 주'
        disabled={!canMoveNext}
        className='disabled:cursor-not-allowed disabled:opacity-40'
        onClick={() => onMove(1)}
      />
    </div>
  );
}
