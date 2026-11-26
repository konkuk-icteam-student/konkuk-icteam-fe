import { useId } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type AdminPanelProps = {
  title: string;
  // 제목 줄 오른쪽에 둘 버튼·링크 등. 없으면 제목만 그린다
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

// 관리자 화면들이 함께 쓰는 회색 카드. 제목 줄 오른쪽에 버튼 등을 둘 수 있다
export default function AdminPanel({ title, action, children, className }: AdminPanelProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn('rounded-[1.2rem] border border-gray-50', className)}
    >
      <div className='flex items-center justify-between px-[2.1rem] pt-[2.4rem] pb-[2.1rem]'>
        <div className='flex items-center gap-[0.8rem]'>
          <h2 id={headingId} className='font-16-bd text-black'>
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
