import { ButtonHTMLAttributes } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

// 아이콘만 있는 버튼은 눈에 보이는 글자가 없으므로 접근 가능한 이름(aria-label)을 반드시 받는다
type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  'aria-label': string;
};

export default function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <button
      type='button'
      className={cn('cursor-pointer disabled:cursor-not-allowed disabled:opacity-40', className)}
      {...props}
    >
      {children}
    </button>
  );
}
