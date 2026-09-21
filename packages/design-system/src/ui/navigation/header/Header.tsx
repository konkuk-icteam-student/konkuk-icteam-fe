import React from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  isSticky?: boolean;
  isFixed?: boolean;
};

const HEADER_HEIGHT = 'h-[5.6rem]';

export default function Header({
  left,
  center,
  right,
  className,
  isSticky = false,
  isFixed = false,
  ...props
}: HeaderProps) {
  return (
    <>
      <header
        className={cn(
          'bg-black-1 grid w-full grid-cols-3 items-center px-[2rem] py-[0.3rem]',
          HEADER_HEIGHT,
          isSticky && 'sticky top-0 z-10',
          isFixed && 'fixed inset-x-0 top-0 z-10',
          className,
        )}
        {...props}
      >
        <div className='justify-self-start'>{left}</div>
        <div className='justify-self-center'>{center}</div>
        <div className='justify-self-end'>{right}</div>
      </header>
      {/* fixed일 때 본문이 네비게이션에 가려지지 않도록 같은 높이의 자리를 차지한다 */}
      {isFixed && <div aria-hidden='true' className={HEADER_HEIGHT} />}
    </>
  );
}
