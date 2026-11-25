'use client';

import { useId, useState } from 'react';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import type { TimeRange } from '@/shared/utils/timeRange';
import { formatTimeInput } from '../_utils/timeInput';
import { getTimeRangeError } from '../_utils/unavailableTimeRanges';

type AddTimeRangePopoverProps = {
  // 이미 넣은 시간대. 겹치는지 확인한다
  existingRanges: TimeRange[];
  onAdd: (range: TimeRange) => void;
  onClose: () => void;
};

// 근무 불가 시간대를 하나 더하는 작은 카드. 시각은 직접 입력하고(숫자만 쳐도 HH:mm로 맞춘다),
// 추가를 누르거나 Enter를 칠 때 규칙을 확인한다. Esc로 닫는다
export default function AddTimeRangePopover({
  existingRanges,
  onAdd,
  onClose,
}: AddTimeRangePopoverProps) {
  const headingId = useId();
  const errorId = useId();
  const [range, setRange] = useState<TimeRange>({ start: '', end: '' });
  // 추가를 누른 뒤에만 오류를 보여 준다
  const [error, setError] = useState<string>();

  const handleRangeChange = (key: keyof TimeRange, value: string) => {
    setRange((prev) => ({ ...prev, [key]: formatTimeInput(value) }));
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
        <Input
          type='text'
          inputMode='numeric'
          maxLength={5}
          placeholder='17:00'
          aria-label='시작 시각'
          autoFocus
          hasError={error !== undefined}
          aria-invalid={error !== undefined}
          aria-describedby={error ? errorId : undefined}
          value={range.start}
          onChange={(event) => handleRangeChange('start', event.target.value)}
        />
        <span aria-hidden className='caption-14-md text-gray-500'>
          -
        </span>
        <Input
          type='text'
          inputMode='numeric'
          maxLength={5}
          placeholder='18:00'
          aria-label='끝 시각'
          hasError={error !== undefined}
          aria-invalid={error !== undefined}
          aria-describedby={error ? errorId : undefined}
          value={range.end}
          onChange={(event) => handleRangeChange('end', event.target.value)}
        />
      </div>
      <Message id={errorId} message={error} variant='error' />
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
