'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { IconArrowDown, IconArrowRight, IconUser } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import { getAdminMe } from '../../_apis/me';
import { getNateonWebhook } from '../../_apis/nateonWebhook';
import LogoutModal from './LogoutModal';
import NateonWebhookModal from './NateonWebhookModal';

// 내 정보 메뉴에서 여는 창. 한 번에 하나만 열리므로 열린 창 이름 하나로 들고 있는다
type OpenedModal = 'NATEON_WEBHOOK' | 'LOGOUT' | null;

type ProfileAvatarProps = {
  className: string;
};

// 회색 동그라미 안의 사람 아이콘. 헤더(3.2rem)와 메뉴(4.4rem)에서 크기만 다르고 아이콘은 같은 2rem이다
function ProfileAvatar({ className }: ProfileAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400',
        className,
      )}
    >
      <IconUser />
    </span>
  );
}

// 헤더 오른쪽 끝의 내 정보 버튼과 그 아래로 펼쳐지는 메뉴.
// 메뉴의 네이트온 연결 칩이 창에서 저장·해제한 결과를 바로 따라가야 해서, 연결 상태를 여기서 들고 창에 내려 준다
export default function AdminProfileMenu() {
  const menuId = useId();
  const menuAreaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [
    {
      name,
      workDepartment: { name: workDepartmentName },
    },
  ] = useState(getAdminMe);
  const [nateonWebhook, setNateonWebhook] = useState(getNateonWebhook);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openedModal, setOpenedModal] = useState<OpenedModal>(null);
  // 창을 닫은 뒤에도 결과 알림이 남아 있도록 알림은 창 안이 아니라 여기서 띄운다
  const { showToast, toast } = useToast();
  const isNateonConnected = nateonWebhook.maskedWebhookUrl !== null;

  // 메뉴 바깥을 누르면 닫는다. Escape로 닫으면 포커스를 내 정보 버튼으로 돌려준다
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuAreaRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const handleModalOpen = (modal: NonNullable<OpenedModal>) => {
    setIsMenuOpen(false);
    setOpenedModal(modal);
  };

  const handleModalClose = () => setOpenedModal(null);

  return (
    <div ref={menuAreaRef} className='relative'>
      <button
        ref={triggerRef}
        type='button'
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className='flex items-center gap-[0.8rem] rounded-full py-[0.4rem] pr-[1rem] pl-[0.6rem]'
      >
        <ProfileAvatar className='h-[3.2rem] w-[3.2rem]' />
        <span className='caption-14-md whitespace-nowrap text-gray-700'>
          {`${name}님 (${workDepartmentName})`}
        </span>
        {/* 펼쳐져 있는 동안은 화살표를 위로 뒤집어 닫을 수 있다는 걸 보여 준다 */}
        <IconArrowDown
          aria-hidden
          className={cn(
            'h-[2rem] w-[2rem] text-gray-500 transition-transform duration-200 motion-reduce:transition-none',
            isMenuOpen && 'rotate-180',
          )}
        />
      </button>
      {isMenuOpen ? (
        <div
          id={menuId}
          className='bg-black-1 absolute top-full right-0 z-30 mt-[0.5rem] w-[30rem] divide-y divide-gray-50 overflow-hidden rounded-[1.2rem] border border-gray-50 shadow-[0_0.8rem_2.4rem_0_rgb(0_0_0_/_0.1)]'
        >
          <div className='flex items-center gap-[1.2rem] px-[2rem] py-[1.8rem]'>
            <ProfileAvatar className='h-[4.4rem] w-[4.4rem]' />
            <div className='flex min-w-0 flex-col gap-[0.2rem]'>
              <p className='font-16-bd text-black'>{name}</p>
              {/* 13px 글자는 타이포 토큰에 없어서 이 자리에서만 크기를 직접 준다 */}
              <p className='text-[1.3rem] leading-normal text-gray-500'>{`${workDepartmentName} · 관리자`}</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => handleModalOpen('NATEON_WEBHOOK')}
            className='flex w-full items-center gap-[0.8rem] px-[2rem] py-[1.4rem] transition-colors hover:bg-gray-50'
          >
            <span className='caption-14-md text-black'>네이트온 알림 연결</span>
            <span className='ml-auto flex items-center gap-[0.6rem]'>
              {isNateonConnected ? (
                <StateChip label='연결됨' tone='green' />
              ) : (
                <StateChip label='미연결' tone='gray' />
              )}
              <IconArrowRight aria-hidden className='h-[2rem] w-[2rem] text-gray-400' />
            </span>
          </button>
          <button
            type='button'
            onClick={() => handleModalOpen('LOGOUT')}
            className='caption-14-md text-red flex w-full px-[2rem] py-[1.4rem] transition-colors hover:bg-gray-50'
          >
            로그아웃
          </button>
        </div>
      ) : null}
      <NateonWebhookModal
        open={openedModal === 'NATEON_WEBHOOK'}
        nateonWebhook={nateonWebhook}
        onNateonWebhookChange={setNateonWebhook}
        onNotify={showToast}
        onClose={handleModalClose}
      />
      <LogoutModal open={openedModal === 'LOGOUT'} onClose={handleModalClose} />
      {toast}
    </div>
  );
}
