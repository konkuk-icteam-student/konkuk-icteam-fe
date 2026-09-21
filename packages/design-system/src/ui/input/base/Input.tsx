import { cn } from '@konkuk-icteam-fe/design-system/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  hasBorder?: boolean;
};

export default function Input({ hasError, hasBorder = true, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'bg-black-1 caption-14-md w-full border-b border-black px-[0.7rem] py-[1.2rem] placeholder:text-gray-400',
        hasBorder && 'rounded-[0.6rem] border border-gray-400 focus:border-black',
        hasError && hasBorder && 'border-red focus:border-red',
        className,
      )}
      {...props}
    />
  );
}
