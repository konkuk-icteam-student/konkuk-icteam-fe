import { IconCheck } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

// className은 전체(label)에 적용되고, 나머지 props는 네이티브 input에 그대로 전달된다
type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  children?: React.ReactNode;
};

export default function CheckBox({ children, className, ...props }: CheckBoxProps) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-[0.8rem] has-disabled:cursor-not-allowed has-disabled:opacity-40',
        className,
      )}
    >
      <span className='relative inline-flex h-[2.1rem] w-[2.1rem] shrink-0 transition-transform duration-200 ease-out has-active:scale-95'>
        <input
          type='checkbox'
          className='peer bg-black-1 absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[0.3rem] border-[1.5px] border-gray-400 transition-[border-color] duration-200 ease-out checked:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed'
          {...props}
        />
        <IconCheck
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 m-auto h-[1rem] w-[1.3rem] scale-75 text-black opacity-0 transition-all duration-200 ease-out peer-checked:scale-100 peer-checked:opacity-100'
        />
      </span>
      {children}
    </label>
  );
}
