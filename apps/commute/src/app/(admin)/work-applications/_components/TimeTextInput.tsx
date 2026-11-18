'use client';

import { useState } from 'react';
import { Input } from '@konkuk-icteam-fe/design-system/ui';
import { checkTimeFormat, formatTimeInput } from '../_utils/timeInput';

type TimeTextInputProps = {
  // 지금 정해진 시각 (HH:mm)
  value: string;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  'aria-label'?: string;
  // HH:mm을 다 입력했을 때만 부른다
  onChange: (time: string) => void;
};

// 시각을 직접 입력하는 칸. 숫자만 쳐도 HH:mm로 맞추고, 다 입력하면 바로 반영한다.
// 덜 입력한 채로 칸을 벗어나면 원래 시각으로 되돌린다
export default function TimeTextInput({
  value,
  placeholder,
  disabled,
  hasError,
  'aria-label': ariaLabel,
  onChange,
}: TimeTextInputProps) {
  // 입력 중인 글자. 입력하지 않을 때는 정해진 시각을 그대로 보여 준다
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <Input
      type='text'
      inputMode='numeric'
      maxLength={5}
      placeholder={placeholder}
      aria-label={ariaLabel}
      disabled={disabled}
      hasError={hasError}
      aria-invalid={hasError}
      value={draft ?? value}
      onFocus={() => setDraft(value)}
      onBlur={() => setDraft(null)}
      onChange={(event) => {
        const nextDraft = formatTimeInput(event.target.value);
        setDraft(nextDraft);
        if (checkTimeFormat(nextDraft)) onChange(nextDraft);
      }}
    />
  );
}
