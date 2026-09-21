import { IconArrowRight, IconHome } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

export type BreadcrumbItem = {
  label: string;
  // 없으면 링크가 아닌 텍스트로만 표시한다
  href?: string;
};

type BreadcrumbProps = {
  // 경로 순서대로 (마지막이 현재 위치)
  items: BreadcrumbItem[];
  // 첫 번째 항목 앞에 홈 아이콘을 보여준다 (기본값: true)
  showHomeIcon?: boolean;
  // 링크 컴포넌트(next/link 등)로 교체할 때 사용 (기본값: 'a')
  LinkComponent?: React.ElementType;
  className?: string;
};

export default function Breadcrumb({
  items,
  showHomeIcon = true,
  LinkComponent = 'a',
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label='경로' className={cn('caption-14-md', className)}>
      <ol className='flex flex-wrap items-center gap-[0.6rem]'>
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const itemClassName = cn(
            'inline-flex items-center gap-[0.4rem]',
            isFirst ? 'font-bold text-gray-700' : 'text-gray-400',
          );
          const content = (
            <>
              {isFirst && showHomeIcon && (
                <IconHome aria-hidden='true' className='h-[2rem] w-[2rem]' />
              )}
              {item.label}
            </>
          );

          return (
            <li key={`${item.label}-${item.href ?? ''}`} className='flex items-center gap-[0.6rem]'>
              {!isFirst && (
                <IconArrowRight
                  aria-hidden='true'
                  className='h-[1.6rem] w-[1.6rem] text-gray-400'
                />
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className={itemClassName}>
                  {content}
                </span>
              ) : (
                <LinkComponent href={item.href} className={cn(itemClassName, 'hover:underline')}>
                  {content}
                </LinkComponent>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
