import { IconEllipse } from '@konkuk-icteam-fe/design-system/assets';
import { Message } from '@konkuk-icteam-fe/design-system/ui';

type FieldLayoutProps = {
  title: string;
  description?: string;
  isRequired?: boolean;
  errorId?: string;
  errorMessage?: string;
  children: React.ReactNode;
};

// 근로신청 열기 폼 layout
export default function FieldLayout({
  title,
  description,
  isRequired = true,
  errorId,
  errorMessage,
  children,
}: FieldLayoutProps) {
  return (
    <section className='flex flex-col gap-[0.8rem]'>
      <div className='flex items-center gap-[0.8rem]'>
        <h3 className='font-14-bd flex items-start gap-[0.3rem] text-black'>
          {title}
          {isRequired && (
            <IconEllipse aria-hidden className='text-red mt-[0.1rem] h-[0.4rem] w-[0.4rem]' />
          )}
        </h3>
        {description && <p className='caption-12-md text-gray-400'>{description}</p>}
      </div>
      {children}
      {errorId && <Message id={errorId} message={errorMessage} variant='error' />}
    </section>
  );
}
