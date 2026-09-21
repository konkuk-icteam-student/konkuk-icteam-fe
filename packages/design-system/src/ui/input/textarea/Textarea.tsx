import { cn } from '@konkuk-icteam-fe/design-system/cn';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export default function Textarea({ hasError, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'bg-black-1 caption-14-rg w-full rounded-[0.6rem] border border-gray-400 px-[1.2rem] py-[1.1rem] placeholder:text-gray-400 focus:border-black focus:outline-none',
        hasError && 'border-red focus:border-red',
        className,
      )}
      {...props}
    />
  );
}
