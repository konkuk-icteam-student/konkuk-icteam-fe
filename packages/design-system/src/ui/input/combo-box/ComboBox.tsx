'use client';

import { useRef, useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import Input from '../base/Input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../base/command';
import useClickOutside from '../hooks/useClickOutside';

type ComboBoxProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputClassName?: string;
  optionClassName?: string;
  optionWrapperClassName?: string;
  onBlur?: () => void;
};

export default function ComboBox({
  options,
  placeholder = '검색어를 입력해주세요',
  value,
  onChange,
  onBlur,
  inputClassName,
  optionClassName,
  optionWrapperClassName,
}: ComboBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledQuery, setUncontrolledQuery] = useState('');

  const query = isControlled ? value : uncontrolledQuery;

  const setQuery = (next: string) => {
    if (!isControlled) setUncontrolledQuery(next);
    onChange?.(next);
  };

  useClickOutside(rootRef, () => setIsOpen(false));

  const handleOptionSelect = (option: string) => {
    setQuery(option);
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
        <Input
          placeholder={placeholder}
          hasBorder={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          value={query}
          className={cn('h-[4.2rem] w-full', inputClassName)}
        />

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
