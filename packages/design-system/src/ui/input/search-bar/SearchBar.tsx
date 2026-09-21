import { IconSearch } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type SearchBarProps = React.ComponentProps<'input'> & {
  containerClassName?: string;
  iconClassName?: string;
};

export default function SearchBar({
  className,
  containerClassName,
  iconClassName,
  type = 'text',
  ...props
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-[0.8rem] rounded-[4rem] bg-gray-50 px-[1.5rem] py-[1.15rem] focus-within:outline-1 focus-within:outline-black',
        containerClassName,
      )}
    >
      <IconSearch
        className={cn('h-[2.4rem] w-[2.4rem] shrink-0 text-gray-700', iconClassName)}
        aria-hidden='true'
      />
      <input
        type={type}
        className={cn(
          'caption-14-md w-full bg-transparent text-black placeholder:text-gray-500 focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
}
