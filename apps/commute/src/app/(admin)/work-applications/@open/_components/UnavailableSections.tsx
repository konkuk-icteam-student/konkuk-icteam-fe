'use client';

import { useState } from 'react';
import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { Button, DatePicker, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDay } from '@/shared/utils/formatDate';
import type { TimeRange } from '@/shared/utils/time';
import type { GetWorkApplicationRequest } from '../../../_apis/workApplications';
import { getNonWorkingDates } from '../_utils/date';
import { createAddedTimeRanges } from '../_utils/time';
import AddTimeRangePopover from './AddTimeRangePopover';
import FieldLayout from './FieldLayout';

type UnavailableDatesSectionProps = {
  yearMonth: GetWorkApplicationRequest;
  value: Date[];
  onChange: (dates: Date[]) => void;
};

// 근무 불가 날짜
export function UnavailableDatesSection({
  yearMonth: { year, month },
  value,
  onChange,
}: UnavailableDatesSectionProps) {
  return (
    <FieldLayout title='근무 불가 날짜' isRequired={false}>
      <div className='rounded-[1.2rem] border border-gray-50'>
        <DatePicker
          defaultViewDateMonth={new Date(year, month - 1, 1)}
          minDate={toISO(new Date(year, month - 1, 1))}
          maxDate={toISO(new Date(year, month, 0))}
          disablePastDates={false}
          disabledDates={getNonWorkingDates({ year, month })}
          color='red'
          mode='multiple'
          selectedDates={value.map(toISO)}
          handleDatesChangeAction={(dateKeys) => onChange(dateKeys.map(parseISO))}
        />
      </div>
      <ul aria-label='근무 불가 날짜' className='flex flex-wrap gap-[0.6rem]'>
        {value.length === 0 ? (
          <li className='caption-12-md text-gray-400'>근무 불가 날짜가 없어요.</li>
        ) : (
          value.map((date) => (
            <li key={date.getTime()}>
              <TagChip
                label={formatMonthDay(date)}
                tone='red'
                onRemove={() =>
                  onChange(value.filter((other) => other.getTime() !== date.getTime()))
                }
              />
            </li>
          ))
        )}
      </ul>
    </FieldLayout>
  );
}

type UnavailableTimeRangesSectionProps = {
  value: TimeRange[];
  onChange: (timeRanges: TimeRange[]) => void;
};

// 근무 불가 시간대
export function UnavailableTimeRangesSection({
  value,
  onChange,
}: UnavailableTimeRangesSectionProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <FieldLayout
      title='근무 불가 시간대'
      description='매일 같은 시간에 적용돼요'
      isRequired={false}
    >
      <ul aria-label='근무 불가 시간대' className='flex flex-wrap items-center gap-[0.6rem]'>
        {value.map(({ start, end }) => (
          <li key={start}>
            <TagChip
              label={`${start} - ${end}`}
              tone='red'
              onRemove={() => onChange(value.filter((range) => range.start !== start))}
            />
          </li>
        ))}

        <li className='relative'>
          <Button
            size='small'
            aria-expanded={isPopoverOpen}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            className='border-[0.1rem] border-solid bg-white text-gray-500 hover:text-black'
          >
            + 시간대 추가
          </Button>
          {isPopoverOpen && (
            <AddTimeRangePopover
              existingRanges={value}
              onAdd={(range) => {
                onChange(createAddedTimeRanges(value, range));
                setIsPopoverOpen(false);
              }}
              onClose={() => setIsPopoverOpen(false)}
            />
          )}
        </li>
      </ul>
    </FieldLayout>
  );
}
