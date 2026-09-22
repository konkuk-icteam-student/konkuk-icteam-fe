'use client';

import { IconAdd, IconRemove } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import IconButton from '../button/icon-button/IconButton';

type StepperProps = {
  value: string | number;
  handleClickMinus: () => void;
  handleClickAdd: () => void;
  isDisabledMinus?: boolean;
  isDisabledAdd?: boolean;
  className?: string;
};

export default function Stepper({
  value,
  handleClickMinus,
  handleClickAdd,
  isDisabledMinus,
  isDisabledAdd,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        'flex h-[3.6rem] w-fit items-center gap-[1rem] rounded-[0.4rem] bg-gray-50 px-[0.8rem] py-[0.3rem]',
        className,
      )}
    >
      <IconButton
        aria-label='감소'
        disabled={isDisabledMinus}
        onClick={isDisabledMinus ? undefined : handleClickMinus}
      >
        <IconRemove />
      </IconButton>
      <span className='bg-black-1 caption-14-md flex h-[3rem] w-[6.8rem] items-center justify-center rounded-[0.4rem] py-[0.2rem] text-center'>
        {value}
      </span>
      <IconButton
        aria-label='증가'
        disabled={isDisabledAdd}
        onClick={isDisabledAdd ? undefined : handleClickAdd}
      >
        <IconAdd />
      </IconButton>
    </div>
  );
}
