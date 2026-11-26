'use client';

import { useId, useState } from 'react';
import { Button, Message } from '@konkuk-icteam-fe/design-system/ui';
import type { TimeRange } from '@/shared/utils/time';
import { getTimeRangeError } from '../_utils/time';
import TimeInput from './TimeInput';

type AddTimeRangePopoverProps = {
  // 이미 넣은 시간대. 겹치는지 확인한다
  existingRanges: TimeRange[];
  onAdd: (range: TimeRange) => void;
  onClose: () => void;
};

// 근무 불가 시간대 추가 팝오버.
export default function AddTimeRangePopover({
  existingRanges,
  onAdd,
  onClose,
}: AddTimeRangePopoverProps) {
  const headingId = useId();
  const [range, setRange] = useState<TimeRange>({ start: '', end: '' });
  const [error, setError] = useState<string>();

  const handleRangeChange = (key: keyof TimeRange, value: string) => {
    setRange((prev) => ({ ...prev, [key]: value }));
    setError(undefined);
  };

  const handleAdd = () => {
    const nextError = getTimeRangeError(range, existingRanges);
    if (nextError) {
      setError(nextError);
      return;
    }
    onAdd(range);
  };

  return (
    <div
      role='dialog'
      aria-labelledby={headingId}
      className='bg-black-1 absolute top-[calc(100%+0.8rem)] left-0 z-30 flex w-[30rem] flex-col gap-[1.2rem] rounded-[1.2rem] p-[1.6rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]'
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
        if (event.key === 'Enter') {
          event.preventDefault();
          handleAdd();
        }
      }}
    >
      <h4 id={headingId} className='font-14-bd text-black'>
        시간대 추가
      </h4>
      <div className='flex items-center gap-[0.8rem]'>
        <TimeInput
          placeholder='17:00'
          aria-label='시작 시각'
          autoFocus
          hasError={error !== undefined}
          aria-invalid={error !== undefined}
          aria-describedby={error ? 'time-range-error' : undefined}
          value={range.start}
          onChange={(time) => handleRangeChange('start', time)}
        />
        <span aria-hidden className='caption-14-md text-gray-500'>
          -
        </span>
        <TimeInput
          placeholder='18:00'
          aria-label='끝 시각'
          hasError={error !== undefined}
          aria-invalid={error !== undefined}
          aria-describedby={error ? 'time-range-error' : undefined}
          value={range.end}
          onChange={(time) => handleRangeChange('end', time)}
        />
      </div>
      <Message id='time-range-error' message={error} variant='error' />
      <div className='flex gap-[0.8rem]'>
        <Button size='medium' tone='subtle_2' color='gray' onClick={onClose}>
          취소
        </Button>
        <Button size='medium' color='blue' onClick={handleAdd}>
          추가
        </Button>
      </div>
    </div>
  );
}
