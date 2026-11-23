'use client';

import { useId, useState } from 'react';
import { Input } from '@konkuk-icteam-fe/design-system/ui';
import { getSchoolEmailSuggestion } from '../_utils/schoolEmail';

type SchoolEmailInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> & {
  value: string;
  onValueChange: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

export default function SchoolEmailInput({
  value,
  onValueChange,
  onKeyDown,
  onBlur,
  ...props
}: SchoolEmailInputProps) {
  const listboxId = useId();
  const optionId = `${listboxId}-option`;
  const [isOpen, setIsOpen] = useState(false);
  const suggestion = getSchoolEmailSuggestion(value);
  const isListOpen = isOpen && suggestion !== undefined;

  const handleSuggestionSelect = (selectedEmail: string) => {
    onValueChange(selectedEmail);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // 한글 조합 중에 누른 키는 조합을 끝내는 키라 후보 고르기로 쓰지 않는다
    if (!isListOpen || event.nativeEvent.isComposing) return;

    // 후보가 열려 있을 때 Enter는 폼 제출이 아니라 후보 고르기다
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSuggestionSelect(suggestion);
      return;
    }
    if (event.key === 'Escape') setIsOpen(false);
  };

  return (
    // 펼친 목록이 아래 칸·버튼에 가려지지 않게 이 칸 전체를 위에 쌓는다
    <div className='relative z-10'>
      <Input
        {...props}
        type='email'
        role='combobox'
        aria-autocomplete='list'
        aria-expanded={isListOpen}
        aria-controls={listboxId}
        aria-activedescendant={isListOpen ? optionId : undefined}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          setIsOpen(false);
          onBlur?.(event);
        }}
      />
      {isListOpen && (
        <ul
          id={listboxId}
          role='listbox'
          className='bg-black-1 absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-[0.4rem] p-[0.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]'
        >
          <li
            id={optionId}
            role='option'
            aria-selected
            className='caption-14-md cursor-pointer rounded-[0.4rem] bg-gray-50 p-[1rem]'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSuggestionSelect(suggestion)}
          >
            {suggestion}
          </li>
        </ul>
      )}
    </div>
  );
}
