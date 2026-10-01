import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import IconButton from '../../button/icon-button/IconButton';
import Chip from '../base/Chip';
import { CHIP_THEME, ChipTone } from '../constants/chipTheme';

type TagChipProps = {
  label: string;
  tone?: ChipTone;
  // 전달하면 칩 전체를 클릭할 수 있다 (필터/토글 용도)
  onClick?: (label: string) => void;
  // 선택 여부. 선택되면 tone 색으로 채워진다
  isSelected?: boolean;
  // 전달하면 X 버튼이 표시된다
  onRemove?: (label: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children' | 'onClick'>;

export default function TagChip({
  label,
  tone = 'gray',
  onClick,
  isSelected = false,
  onRemove,
  ...props
}: TagChipProps) {
  const { chipClassName, labelClassName } = CHIP_THEME[tone][isSelected ? 'solid' : 'subtle'];

  return (
    <Chip
      label={
        onClick ? (
          <button
            type='button'
            aria-pressed={isSelected}
            onClick={() => onClick(label)}
            // 버튼의 클릭 영역을 칩 전체로 넓힌다
            className='cursor-pointer after:absolute after:inset-0'
          >
            {label}
          </button>
        ) : (
          label
        )
      }
      chipClassName={cn(
        'relative px-[0.8rem] py-[0.5rem] transition-colors duration-200 ease-in-out',
        onRemove && 'gap-[0.2rem] pr-[0.4rem]',
        chipClassName,
      )}
      labelClassName={cn('transition-colors duration-200 ease-in-out', labelClassName)}
      {...props}
    >
      {onRemove && (
        <IconButton
          aria-label={`${label} 삭제`}
          onClick={() => onRemove(label)}
          className='relative z-10'
        >
          <IconClose className={cn('h-[1.6rem] w-[1.6rem]', labelClassName)} />
        </IconButton>
      )}
    </Chip>
  );
}
