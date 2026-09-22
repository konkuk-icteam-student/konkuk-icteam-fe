import { cn } from '@konkuk-icteam-fe/design-system/cn';

type ChipProps = {
  label: React.ReactNode;
  chipClassName: string;
  labelClassName: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

export default function Chip({
  label,
  chipClassName,
  labelClassName,
  children,
  ...props
}: ChipProps) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[0.3rem]',
        chipClassName,
      )}
      {...props}
    >
      <span className={cn('caption-12-md', labelClassName)}>{label}</span>
      {children}
    </div>
  );
}
