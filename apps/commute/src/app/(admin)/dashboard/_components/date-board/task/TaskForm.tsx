'use client';

import { useState } from 'react';
import { Button, Input, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import type { TodoPeriod } from '../../../../_apis/todos';
import { PERIODS } from '../../../../_constants/period';

type TaskFormProps = {
  // add: 누른 시간대에 새 업무를 더한다 (시간대 고정). rename: 기존 업무의 이름과 시간대를 고친다
  mode: 'add' | 'rename';
  initialTitle?: string;
  initialPeriod: TodoPeriod;
  onSubmit: (title: string, period: TodoPeriod) => void;
  onCancel: () => void;
};

// 업무 줄과 같은 높이·칸 그대로 업무를 추가하거나 고치는 입력 줄. Enter로 저장한다
export default function TaskForm({
  mode,
  initialTitle = '',
  initialPeriod,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [period, setPeriod] = useState(initialPeriod);
  const trimmedTitle = title.trim();
  const isRename = mode === 'rename';
  const periodLabel = PERIODS.find((option) => option.period === initialPeriod)?.label;

  const handleSubmit = () => {
    if (trimmedTitle.length === 0) return;
    onSubmit(trimmedTitle, period);
  };

  return (
    <div
      role='group'
      aria-label={isRename ? `${initialTitle} 수정` : `${periodLabel} 업무 추가`}
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
          // 한글 조합 중 Enter는 글자 확정이라 저장으로 보지 않는다
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter') handleSubmit();
        }}
      />
      <div className='flex min-w-0 flex-1 items-center'>
        {isRename && (
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
          {isRename ? '저장' : '추가'}
        </Button>
      </div>
    </div>
  );
}
