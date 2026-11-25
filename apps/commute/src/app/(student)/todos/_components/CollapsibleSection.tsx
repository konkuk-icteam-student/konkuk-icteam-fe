import { useId } from 'react';
import { IconArrowUp } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type CollapsibleSectionProps = {
  title: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  children: React.ReactNode;
};

export default function CollapsibleSection({
  title,
  isOpen,
  onToggleOpen,
  children,
}: CollapsibleSectionProps) {
  const contentId = useId();

  return (
    <section className='rounded-[1rem] border border-gray-400/20 px-[2rem] py-[1.6rem]'>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggleOpen}
        className='flex w-full cursor-pointer items-center gap-[0.8rem] py-[0.4rem] text-left'
      >
        <h2 className='font-16-md text-black'>{title}</h2>

        <IconArrowUp
          aria-hidden
          className={cn(
            'ml-auto h-[1.6rem] w-[1.6rem] text-gray-500 transition-transform duration-200',
            !isOpen && 'rotate-180',
          )}
        />
      </button>
      <div id={contentId} hidden={!isOpen} className='mt-[0.8rem]'>
        {children}
      </div>
    </section>
  );
}
