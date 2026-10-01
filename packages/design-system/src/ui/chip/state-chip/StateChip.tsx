import { cn } from '@konkuk-icteam-fe/design-system/cn';
import Chip from '../base/Chip';
import { CHIP_THEME, ChipTone } from '../constants/chipTheme';

type StateChipProps = {
  label: string;
  tone?: ChipTone;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

export default function StateChip({ label, tone = 'gray', ...props }: StateChipProps) {
  const { chipClassName, labelClassName } = CHIP_THEME[tone].subtle;

  return (
    <Chip
      label={label}
      chipClassName={cn('px-[0.5rem] py-[0.2rem]', chipClassName)}
      labelClassName={labelClassName}
      {...props}
    />
  );
}
