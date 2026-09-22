import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { DATE_COLOR, DateColor } from './constants/color';
import { DateRangePosition } from '../picker/types/dateRange';

type DateCellProps = {
  value: string;
  iso: string;
  isSelected: boolean;
  isDisabled: boolean;
  isToday?: boolean;
  // 선택된 날짜(원)와 기간 띠의 색 (기본값: 'black')
  color?: DateColor;
  // 기간 선택에서 이 날짜가 기간의 어디에 속하는지 (띠 모양을 결정)
  rangePosition?: DateRangePosition;
  handleSelect?: () => void;
};

// 셀 너비를 꽉 채워 이웃 셀과 이어지는 띠. 시작/끝은 반쪽만 칠해서 원과 자연스럽게 이어 붙인다
const RANGE_BAND_POSITION: Record<DateRangePosition, string> = {
  start: 'right-0 left-1/2',
  middle: 'inset-x-0',
  end: 'right-1/2 left-0',
};

export default function DateCell({
  value,
  iso,
  isDisabled,
  isSelected,
  isToday,
  color = 'black',
  rangePosition,
  handleSelect,
}: DateCellProps) {
  const { selectedClassName, rangeClassName } = DATE_COLOR[color];
  const [y, m, d] = iso.split('-');
  const srLabel = `${y}-${Number(m)}-${Number(d)}`;

  return (
    <div
      role='gridcell'
      aria-selected={isSelected || rangePosition === 'middle'}
      aria-disabled={isDisabled}
      aria-current={isToday ? 'date' : undefined}
      className='relative flex w-full min-w-[3.2rem] justify-center py-[0.4rem]'
    >
      {rangePosition && (
        <div
          aria-hidden='true'
          className={cn(
            'absolute inset-y-[0.4rem]',
            rangeClassName,
            RANGE_BAND_POSITION[rangePosition],
          )}
        />
      )}
      <button
        type='button'
        aria-label={srLabel}
        disabled={isDisabled}
        onClick={handleSelect}
        className={cn(
          'font-16-md relative w-[3.2rem] rounded-full py-[0.6rem] text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400',
          isSelected && selectedClassName,
        )}
      >
        {value}
      </button>
    </div>
  );
}
