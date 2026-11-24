'use client';

import { useId, useState } from 'react';
import { Input } from '@konkuk-icteam-fe/design-system/ui';
import hasEnterKey from '../_utils/hasEnterKey';

const SCHOOL_EMAIL_DOMAIN = 'konkuk.ac.kr';

// 학교 메일 도메인의 앞부분까지만 입력했으면 나머지를 채운 메일을, 아니면 undefined를 돌려준다
const getSchoolEmailSuggestion = (input: string) => {
  const [localPart, domainPart = ''] = input.trim().split('@');
  if (!localPart) return undefined;

  const typedDomain = domainPart.toLowerCase();
  const isTypingSchoolDomain =
    typedDomain !== SCHOOL_EMAIL_DOMAIN && SCHOOL_EMAIL_DOMAIN.startsWith(typedDomain);

  return isTypingSchoolDomain ? `${localPart}@${SCHOOL_EMAIL_DOMAIN}` : undefined;
};

type SchoolEmailInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> & {
  value: string;
  onChange: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

export default function SchoolEmailInput({
  value,
  onChange,
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
    onChange(selectedEmail);
    setIsOpen(false);
  };

  // 후보 고르기에 쓴 키는 바깥 onKeyDown으로 넘기지 않는다
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 후보가 열려 있을 때 Enter는 폼 제출이 아니라 후보 고르기다
    if (isListOpen && hasEnterKey(event)) {
      event.preventDefault();
      handleSuggestionSelect(suggestion);
      return;
    }
    if (isListOpen && event.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    onKeyDown?.(event);
  };

  return (
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
          onChange(event.target.value);
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
