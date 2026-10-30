'use client';

import { useRef, useState } from 'react';
import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../base/command';
import useClickOutside from '../hooks/useClickOutside';

// 펼치는 버튼에 그대로 넘기는 속성 (라벨과 잇는 id, aria-*, ref 등).
// 열고 닫기·글자·모양은 Dropdown이 다루므로 type·onClick·children·className은 받지 않는다
type DropdownTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'children' | 'className'
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

type DropdownProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  triggerClassName?: string;
  optionClassName?: string;
  optionWrapperClassName?: string;
  triggerProps?: DropdownTriggerProps;
  // 고른 값이 잘못됐을 때(예: 고르지 않고 제출) 테두리를 빨갛게 보여 준다
  hasError?: boolean;
};

export default function Dropdown({
  options,
  placeholder = '선택해주세요',
  value,
  onChange,
  onBlur,
  triggerClassName,
  optionClassName,
  optionWrapperClassName,
  triggerProps,
  hasError = false,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState('');

  const selectedValue = isControlled ? value : uncontrolledValue;

  const setSelectedValue = (next: string) => {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  useClickOutside(rootRef, () => setIsOpen(false));

  const handleOptionSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className='relative w-full'
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
          onBlur?.();
        }
      }}
    >
      <Command className='h-[4.2rem] w-full'>
        <button
          {...triggerProps}
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'bg-black-1 caption-14-md flex h-[4.2rem] w-full items-center justify-between rounded-[0.6rem] border border-gray-400 px-[1.2rem] text-left text-black focus:border-black focus:outline-none',
            !selectedValue && 'text-gray-400',
            hasError && 'border-red focus:border-red',
            triggerClassName,
          )}
        >
          <span className='truncate'>{selectedValue || placeholder}</span>
          <IconArrowDown
            aria-hidden='true'
            className='h-[2.4rem] w-[2.4rem] shrink-0 text-gray-500'
          />
        </button>

        {isOpen && (
          <div className='absolute top-[calc(4.2rem+0.5rem)] left-0 w-full'>
            <CommandList
              className={cn(
                'bg-black-1 max-h-[20rem] overflow-auto rounded-[0.4rem] p-[0.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]',
                optionWrapperClassName,
              )}
            >
              <CommandEmpty className='caption-14-md p-[1rem] text-gray-400'>
                결과가 없습니다.
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleOptionSelect(option)}
                    className={cn(
                      'caption-14-md rounded-[0.4rem] p-[1rem] hover:cursor-pointer hover:bg-gray-50',
                      option === selectedValue && 'bg-gray-50',
                      optionClassName,
                    )}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
