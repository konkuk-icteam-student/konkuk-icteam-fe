import { cn } from '@konkuk-icteam-fe/design-system/cn';

type StepPanelProps = {
  isActive: boolean;
  children: React.ReactNode;
};

export default function StepPanel({ isActive, children }: StepPanelProps) {
  return (
    <div
      className={cn('flex w-full shrink-0 flex-col gap-[1.6rem]', !isActive && 'h-0')}
      inert={!isActive}
    >
      {children}
    </div>
  );
}
