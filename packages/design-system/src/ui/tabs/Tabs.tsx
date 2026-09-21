import {
  HTMLAttributes,
  ReactNode,
  Children,
  ComponentPropsWithoutRef,
  ElementType,
  isValidElement,
} from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type TabProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  activeValue: string;
  tabs?: { value: string }[];
  children: ReactNode;
};

type TabItemProps<T extends ElementType> = {
  // 링크 컴포넌트(next/link 등)로 교체할 때 사용 (기본값: 'a')
  as?: T;
  value: string;
  activeValue: string;
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'value' | 'href' | 'children' | 'className'>;

function Tab({ className, children, ...props }: TabProps) {
  return (
    <div className={cn('bg-black-1 w-full', className)} {...props}>
      {children}
    </div>
  );
}

function TabsList({ activeValue, tabs, className, children, ...props }: TabsListProps) {
  const fallbackTabs = Children.toArray(children)
    .map((child) => {
      if (!isValidElement<{ value?: unknown }>(child)) return null;
      const value = child.props?.value;
      if (typeof value !== 'string') return null;
      return { value };
    })
    .filter((tab): tab is { value: string } => tab !== null);

  const resolvedTabs = tabs ?? fallbackTabs;
  const selectedTabIndex = resolvedTabs.findIndex((tab) => tab.value === activeValue);
  const activeIndex = selectedTabIndex >= 0 ? selectedTabIndex : 0;
  const tabCount = resolvedTabs.length;

  return (
    <div
      role='tablist'
      className={cn(
        'relative flex h-[4.5rem] w-full border-b border-gray-400 px-[2rem]',
        className,
      )}
      {...props}
    >
      {children}
      {tabCount > 0 && (
        <div
          className='pointer-events-none absolute bottom-0 h-[0.2rem] bg-black transition-transform duration-200 ease-out'
          style={{
            left: '2rem',
            width: `calc((100% - 4rem) / ${tabCount})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
    </div>
  );
}

function TabItem<T extends ElementType = 'a'>({
  as,
  value,
  activeValue,
  href,
  children,
  className,
  ...props
}: TabItemProps<T>) {
  const Component: ElementType = as ?? 'a';
  const isActive = value === activeValue;

  return (
    <Component
      role='tab'
      aria-selected={isActive}
      href={href}
      className={cn(
        'caption-14-bd flex flex-1 items-center justify-center transition-colors',
        isActive ? 'text-black' : 'text-gray-400',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

const Tabs = Object.assign(Tab, { List: TabsList, Item: TabItem });

export default Tabs;
