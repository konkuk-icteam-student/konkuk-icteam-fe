import { Message } from '@konkuk-icteam-fe/design-system/ui';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  // 오류 문구의 id는 `${htmlFor}-error`다. 입력칸의 aria-describedby에 같은 id를 넣는다
  error?: string;
  children: React.ReactNode;
};

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className='flex flex-col gap-[0.8rem]'>
      <label htmlFor={htmlFor} className='font-14-bd text-black'>
        {label}
      </label>
      <div className='flex flex-col'>
        {children}
        <Message id={`${htmlFor}-error`} message={error} variant='error' />
      </div>
    </div>
  );
}
