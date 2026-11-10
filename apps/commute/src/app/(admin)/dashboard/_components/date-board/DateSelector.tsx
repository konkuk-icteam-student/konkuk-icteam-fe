'use client';

import { useId } from 'react';
import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { DatePicker } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';
import usePopover from '../../_hooks/usePopover';

type DateSelectorProps = {
  selectedDateKey: string;
  // 날짜 제목에 붙일 id. 카드 전체의 이름으로 쓴다
  headingId: string;
  onSelect: (dateKey: string) => void;
};

// 누르면 달력이 열리는 날짜 제목
export default function DateSelector({ selectedDateKey, headingId, onSelect }: DateSelectorProps) {
  const calendarId = useId();
  const { isOpen, areaRef, handleToggle, handleClose } = usePopover<HTMLDivElement>();

  const handleDateSelect = (dateKey: string) => {
    onSelect(dateKey);
    handleClose();
  };

  return (
    <div ref={areaRef} className='relative'>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={calendarId}
        aria-haspopup='dialog'
        className='hover:text-blue flex min-w-[24rem] cursor-pointer items-center justify-center gap-[0.4rem] text-black'
        onClick={handleToggle}
      >
        <h2 id={headingId} className='title-20-bd'>
          {formatMonthDayWithWeekday(selectedDateKey)}
        </h2>
        <IconArrowDown
          aria-hidden
          className={cn(
            'h-[2rem] w-[2rem] text-gray-500 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && (
        <div
          id={calendarId}
          role='dialog'
          aria-label='날짜 고르기'
          className='bg-black-1 animate-nav-rise absolute top-[calc(100%+1.2rem)] left-1/2 z-30 w-[36rem] -translate-x-1/2 rounded-[1.2rem] p-[1.2rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)] motion-reduce:animate-none'
        >
          <DatePicker
            selectedDate={selectedDateKey}
            // 다시 열 때 이번 달이 아니라 고른 날짜의 달을 보여 준다
            defaultViewDateMonth={parseISO(selectedDateKey)}
            // 지난 날의 근태를 돌아보는 화면이라, 기본으로 막혀 있는 지난 날짜를 연다
            disablePastDates={false}
            color='blue'
            handleDateChangeAction={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
}
