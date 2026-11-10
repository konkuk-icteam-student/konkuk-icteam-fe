'use client';

import { useId, type KeyboardEvent } from 'react';
import { IconMore } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconButton } from '@konkuk-icteam-fe/design-system/ui';
import usePopover from '../../_hooks/usePopover';

type TaskMoreMenuProps = {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
};

// 업무 줄 끝의 ⋯ 버튼. 누르면 수정·삭제 메뉴가 열린다
export default function TaskMoreMenu({ title, onEdit, onDelete }: TaskMoreMenuProps) {
  const menuId = useId();
  const { isOpen, areaRef, triggerRef, panelRef, handleToggle, handleClose } =
    usePopover<HTMLDivElement>();

  const handleSelect = (action: () => void) => {
    handleClose();
    action();
  };

  // 위아래 화살표로 항목을 옮겨 다니고 끝에서는 반대쪽으로 돈다. Home·End는 처음·끝 항목
  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    const nextIndexByKey: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    const nextIndex = nextIndexByKey[event.key];
    if (nextIndex === undefined) return;

    event.preventDefault();
    items[(nextIndex + items.length) % items.length]?.focus();
  };

  const menuItems = [
    { label: '수정', className: 'text-black', onSelect: onEdit },
    { label: '삭제', className: 'text-red', onSelect: onDelete },
  ];

  return (
    <div ref={areaRef} className='relative shrink-0'>
      <IconButton
        ref={triggerRef}
        aria-label={`${title} 더보기`}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(
          'flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-[0.6rem] text-gray-400 transition-colors hover:bg-gray-50 hover:text-black',
          isOpen && 'bg-gray-50 text-black',
        )}
        onClick={handleToggle}
      >
        <IconMore aria-hidden className='h-[2rem] w-[2rem]' />
      </IconButton>
      {isOpen && (
        <div
          ref={panelRef}
          id={menuId}
          role='menu'
          aria-label={`${title} 메뉴`}
          className='bg-black-1 absolute top-[calc(100%+0.4rem)] right-0 z-30 flex w-[9.6rem] flex-col rounded-[0.8rem] py-[0.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)] data-[side=top]:top-auto data-[side=top]:bottom-[calc(100%+0.4rem)]'
          onKeyDown={handleMenuKeyDown}
        >
          {menuItems.map(({ label, className, onSelect }) => (
            <button
              key={label}
              type='button'
              role='menuitem'
              tabIndex={-1}
              className={cn(
                'caption-14-md cursor-pointer px-[1.2rem] py-[0.8rem] text-left hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none',
                className,
              )}
              onClick={() => handleSelect(onSelect)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
