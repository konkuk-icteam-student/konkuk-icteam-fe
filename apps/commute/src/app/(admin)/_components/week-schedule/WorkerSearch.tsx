'use client';

import { useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ComboBox } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../_apis/workers';
import { findWorkerByOptionLabel, getWorkerOptionLabels } from './lib/workerSearch';

type WorkerSearchProps = {
  placeholder: string;
  onSelect: (worker: Worker) => void;
  autoFocus?: boolean;
  className?: string;
  // 입력칸 모양을 덮어쓴다. transparent면 바깥 배경이 보이도록 입력칸과 그 상자를 투명하게 한다
  inputClassName?: string;
  isTransparent?: boolean;
};

// 이름으로 근로학생을 찾아 고르는 입력칸. 디자인 시스템 ComboBox를 쓰고, 고르면 입력칸을 비운다
export default function WorkerSearch({
  placeholder,
  onSelect,
  autoFocus = false,
  className,
  inputClassName,
  isTransparent = false,
}: WorkerSearchProps) {
  const [keyword, setKeyword] = useState('');

  // ComboBox는 목록에서 고를 때도 고른 글자로 onChange를 부른다. 그 글자가 근로학생 항목과 같으면 고른 것으로 본다
  const handleChange = (nextKeyword: string) => {
    const selectedWorker = findWorkerByOptionLabel(nextKeyword);

    if (!selectedWorker) {
      setKeyword(nextKeyword);
      return;
    }
    onSelect(selectedWorker);
    setKeyword('');
  };

  return (
    <div className={className}>
      <ComboBox
        aria-label={placeholder}
        placeholder={placeholder}
        autoFocus={autoFocus}
        // ComboBox는 받은 목록을 그대로 보여 주므로, 입력한 글자가 들어간 항목만 넘긴다
        options={getWorkerOptionLabels().filter((label) => label.includes(keyword.trim()))}
        value={keyword}
        onChange={handleChange}
        className={isTransparent ? 'bg-transparent' : undefined}
        inputClassName={cn(isTransparent && 'border-0 bg-transparent', inputClassName)}
        optionWrapperClassName='relative z-30'
      />
    </div>
  );
}
