'use client';

import { useState } from 'react';
import { Button, Input, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import type { TodoPeriod } from '../../../_apis/todos';
import { PERIODS } from '../../../_constants/period';

type TaskFormProps = {
  // 폼 묶음을 읽어 줄 이름 (예: '오전 업무 추가', '비품 재고 확인 수정')
  label: string;
  initialTitle?: string;
  initialPeriod: TodoPeriod;
  // 시간대를 바꿀 수 있는지. 추가는 누른 시간대로 정해져 있어 고칠 때만 연다
  canChangePeriod?: boolean;
  // 시간대를 바꿀 수 없을 때 가운데 칸에 보여 줄 안내
  hint?: string;
  submitLabel: string;
  onSubmit: (title: string, period: TodoPeriod) => void;
  onCancel: () => void;
};

// 업무 줄과 같은 높이·칸 그대로 업무를 추가하거나 고치는 입력 줄. Enter로 저장한다
export default function TaskForm({
  label,
  initialTitle = '',
  initialPeriod,
  canChangePeriod = false,
  hint,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [period, setPeriod] = useState(initialPeriod);
  const trimmedTitle = title.trim();

  const handleSubmit = () => {
    if (trimmedTitle.length === 0) return;
    onSubmit(trimmedTitle, period);
  };

  return (
    <div
      role='group'
      aria-label={label}
      className='-mx-[0.8rem] flex items-center gap-[1rem] rounded-[0.6rem] bg-gray-50 px-[0.8rem] py-[0.3rem]'
    >
      <Input
        aria-label='업무 명'
        placeholder='업무 이름'
        autoFocus
        className='caption-14-md bg-black-1 w-[18rem] shrink-0 px-[0.8rem] py-[0.5rem]'
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter') handleSubmit();
        }}
      />
      <div className='flex min-w-0 flex-1 items-center'>
        {canChangePeriod ? (
          <div role='group' aria-label='시간대' className='flex gap-[0.4rem]'>
            {PERIODS.map((option) => (
              <TagChip
                key={option.period}
                label={option.label}
                tone='blue'
                isSelected={period === option.period}
                onClick={() => setPeriod(option.period)}
              />
            ))}
          </div>
        ) : (
          <span className='caption-12-md truncate text-gray-500'>{hint}</span>
        )}
      </div>
      <div className='flex shrink-0 gap-[0.4rem]'>
        <Button
          display='inline'
          size='small'
          tone='subtle_2'
          color='gray'
          className='w-[5.2rem]'
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          display='inline'
          size='small'
          color='blue'
          className='w-[5.2rem]'
          disabled={trimmedTitle.length === 0}
          onClick={handleSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
