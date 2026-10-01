'use client';

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useRef,
  useState,
} from 'react';
import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import IconButton from '../button/icon-button/IconButton';
import {
  SECTION_STACK_DEFAULT_WIDTH,
  SECTION_STACK_KEYBOARD_STEP,
  SECTION_STACK_MAX_WIDTH,
  SECTION_STACK_MIN_WIDTH,
} from './constants/sectionStack';

// 너비 조절 손잡이의 색
const ACCENT_CLASS_NAME = 'bg-gray-50 text-gray-500';

const clampWidth = (width: number) =>
  Math.min(SECTION_STACK_MAX_WIDTH, Math.max(SECTION_STACK_MIN_WIDTH, width));

type SectionStackItemProps = {
  id: string;
  // 탭에 표시되는 이름 (길면 말줄임)
  title: string;
  children: React.ReactNode;
};

function SectionStackItem({ children }: SectionStackItemProps) {
  return <>{children}</>;
}

type SectionStackItemElement = React.ReactElement<SectionStackItemProps>;

type SectionStackContextValue = {
  items: SectionStackItemElement[];
  activeItem?: SectionStackItemElement;
  getTabId: (id: string) => string;
  panelId: string;
  label: string;
  handleActivate: (id: string) => void;
  handleClose: (id: string) => void;
};

const SectionStackContext = createContext<SectionStackContextValue | null>(null);

const useSectionStackContext = () => {
  const context = useContext(SectionStackContext);
  if (!context) {
    throw new Error('SectionStack의 하위 요소는 SectionStack 안에서만 쓸 수 있습니다.');
  }
  return context;
};

function SectionStackTab({ item }: { item: SectionStackItemElement }) {
  const { activeItem, getTabId, panelId, handleActivate, handleClose } = useSectionStackContext();
  const isActive = item.props.id === activeItem?.props.id;

  return (
    <div
      className={cn(
        'flex max-w-[16rem] items-center gap-[0.4rem] rounded-t-[0.6rem] border border-b-0 pl-[1.2rem] transition-colors',
        isActive
          ? 'bg-black-1 border-gray-50 text-black'
          : 'border-transparent bg-gray-50 text-gray-400 hover:text-gray-700',
      )}
    >
      <button
        id={getTabId(item.props.id)}
        type='button'
        role='tab'
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        onClick={() => handleActivate(item.props.id)}
        className='caption-12-md min-w-0 flex-1 truncate py-[0.8rem] text-left'
      >
        {item.props.title}
      </button>
      <IconButton
        aria-label={`${item.props.title} 닫기`}
        onClick={(event) => {
          event.stopPropagation();
          handleClose(item.props.id);
        }}
        className='flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-[0.4rem]'
      >
        <IconClose aria-hidden='true' className='h-[1.4rem] w-[1.4rem]' />
      </IconButton>
    </div>
  );
}

type SectionStackResizeHandleProps = {
  width: number;
  onWidthChange: (updater: (prev: number) => number) => void;
};

// 오른쪽 가장자리의 너비 조절 손잡이. 드래그하거나 방향키로 조절한다
function SectionStackResizeHandle({ width, onWidthChange }: SectionStackResizeHandleProps) {
  const dragStart = useRef<{ x: number; width: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, width };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const start = dragStart.current;
    onWidthChange(() => clampWidth(start.width + (event.clientX - start.x)));
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight')
      onWidthChange((prev) => clampWidth(prev + SECTION_STACK_KEYBOARD_STEP));
    if (event.key === 'ArrowLeft')
      onWidthChange((prev) => clampWidth(prev - SECTION_STACK_KEYBOARD_STEP));
  };

  return (
    <div
      role='separator'
      aria-orientation='vertical'
      aria-label='항목 너비 조절'
      aria-valuemin={SECTION_STACK_MIN_WIDTH}
      aria-valuemax={SECTION_STACK_MAX_WIDTH}
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'absolute top-1/2 -right-[0.7rem] flex h-[4.8rem] w-[1.4rem] -translate-y-1/2 cursor-ew-resize touch-none flex-col items-center justify-center gap-[0.3rem] rounded-full',
        ACCENT_CLASS_NAME,
      )}
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          aria-hidden='true'
          className='h-[0.3rem] w-[0.3rem] rounded-full bg-current'
        />
      ))}
    </div>
  );
}

type SectionStackRootProps = {
  // SectionStack.Item들을 연 순서대로 넣는다 (오래된 순서). 개수 제한은 useSectionStack이 관리한다. Item이 SectionStack의 바로 아래 자식이어야 한다
  children: React.ReactNode;
  // 지금 보고 있는 항목 id (없으면 가장 최근 항목)
  activeId?: string;
  handleActivate: (id: string) => void;
  // 보고 있는 항목을 닫는다 (닫기 버튼)
  handleClose: (id: string) => void;
  // 섹션의 접근 가능한 이름 (기본값: '열린 항목')
  label?: string;
  className?: string;
};

function SectionStackRoot({
  children,
  activeId,
  handleActivate,
  handleClose,
  label = '열린 항목',
  className,
}: SectionStackRootProps) {
  const baseId = useId();
  const [width, setWidth] = useState(SECTION_STACK_DEFAULT_WIDTH);

  const items = Children.toArray(children).filter((child): child is SectionStackItemElement =>
    isValidElement(child),
  );
  const activeItem = items.find((item) => item.props.id === activeId) ?? items.at(-1);

  const getTabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  if (items.length === 0) return null;

  return (
    <SectionStackContext.Provider
      value={{ items, activeItem, getTabId, panelId, label, handleActivate, handleClose }}
    >
      <section
        aria-label={label}
        style={{ width }}
        className={cn('relative max-w-full', className)}
      >
        <SectionStackTabList />

        <SectionStackPanel
          id={panelId}
          aria-labelledby={activeItem ? getTabId(activeItem.props.id) : undefined}
          className='bg-black-1 rounded-[1.2rem] rounded-tl-none border border-gray-50'
        >
          {activeItem}
        </SectionStackPanel>

        <SectionStackResizeHandle width={width} onWidthChange={setWidth} />
      </section>
    </SectionStackContext.Provider>
  );
}

// 상단의 탭 목록. 좌우 방향키로 이웃 탭으로 이동한다
function SectionStackTabList() {
  const { items, activeItem, getTabId, label, handleActivate } = useSectionStackContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const currentIndex = items.findIndex((item) => item.props.id === activeItem?.props.id);
    const nextIndex = currentIndex + (event.key === 'ArrowRight' ? 1 : -1);
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    event.preventDefault();
    handleActivate(nextItem.props.id);
    document.getElementById(getTabId(nextItem.props.id))?.focus();
  };

  return (
    <div
      role='tablist'
      aria-label={label}
      onKeyDown={handleKeyDown}
      className='flex items-end gap-[0.1rem]'
    >
      {items.map((item) => (
        <SectionStackTab key={item.key} item={item} />
      ))}
    </div>
  );
}

function SectionStackPanel({ id, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      id={id}
      role='tabpanel'
      aria-labelledby={`${id}-tab`}
      className={cn('relative', className)}
      {...props}
    />
  );
}

function SectionStackItemContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />;
}

function SectionStackItemTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('title-20-sb truncate text-black', className)} {...props} />;
}

function SectionStackItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-[2.4rem] pb-[2.4rem]', className)} {...props} />;
}

type SectionStackComponent = typeof SectionStackRoot & {
  Item: typeof SectionStackItem;
  // 패널 안쪽 레이아웃을 직접 구성할 때 쓰는 조각들. SectionStack.Item의 children으로 넣는다
  Panel: typeof SectionStackPanel;
  ItemContainer: typeof SectionStackItemContainer;
  ItemTitle: typeof SectionStackItemTitle;
  ItemContent: typeof SectionStackItemContent;
};

const SectionStack: SectionStackComponent = Object.assign(SectionStackRoot, {
  Item: SectionStackItem,
  Panel: SectionStackPanel,
  ItemContainer: SectionStackItemContainer,
  ItemTitle: SectionStackItemTitle,
  ItemContent: SectionStackItemContent,
});

export default SectionStack;
