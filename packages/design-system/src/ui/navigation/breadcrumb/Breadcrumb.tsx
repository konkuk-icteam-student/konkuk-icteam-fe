import { Children, cloneElement, isValidElement } from 'react';
import { IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type BreadcrumbItemProps = {
  // 없으면 링크가 아닌 텍스트로만 표시한다 (마지막 항목은 href가 있어도 현재 위치라 링크가 아니다)
  href?: string;
  children: React.ReactNode;
  className?: string;
  // 아래 값들은 Breadcrumb이 항목 위치에 맞게 자동으로 넣어주므로 직접 넘기지 않는다
  isFirst?: boolean;
  isLast?: boolean;
  LinkComponent?: React.ElementType;
};

function BreadcrumbItem({
  href,
  children,
  className,
  isFirst = false,
  isLast = false,
  LinkComponent = 'a',
}: BreadcrumbItemProps) {
  const itemClassName = cn(
    'inline-flex items-center gap-[0.4rem]',
    isFirst ? 'font-bold text-gray-700' : 'text-gray-400',
    className,
  );
  if (isLast || !href) {
    return (
      <span aria-current={isLast ? 'page' : undefined} className={itemClassName}>
        {children}
      </span>
    );
  }

  return (
    <LinkComponent href={href} className={cn(itemClassName, 'hover:underline')}>
      {children}
    </LinkComponent>
  );
}

type BreadcrumbRootProps = {
  // Breadcrumb.Item들을 경로 순서대로 넣는다 (마지막이 현재 위치). Item이 Breadcrumb의 바로 아래 자식이어야 한다
  children: React.ReactNode;
  // 링크 컴포넌트(next/link 등)로 교체할 때 사용 (기본값: 'a')
  LinkComponent?: React.ElementType;
  className?: string;
};

function BreadcrumbRoot({ children, LinkComponent = 'a', className }: BreadcrumbRootProps) {
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<BreadcrumbItemProps> => isValidElement(child),
  );
  if (items.length === 0) return null;

  return (
    <nav aria-label='경로' className={cn('caption-14-md', className)}>
      <ol className='flex flex-wrap items-center gap-[0.6rem]'>
        {items.map((item, index) => (
          <li key={item.key} className='flex items-center gap-[0.6rem]'>
            {index > 0 && (
              <IconArrowRight aria-hidden='true' className='h-[1.6rem] w-[1.6rem] text-gray-400' />
            )}
            {cloneElement(item, {
              isFirst: index === 0,
              isLast: index === items.length - 1,
              LinkComponent,
            })}
          </li>
        ))}
      </ol>
    </nav>
  );
}

type BreadcrumbComponent = typeof BreadcrumbRoot & {
  Item: typeof BreadcrumbItem;
};

const Breadcrumb: BreadcrumbComponent = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
});

export default Breadcrumb;
