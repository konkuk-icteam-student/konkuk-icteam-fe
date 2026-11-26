'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Modal } from '@konkuk-icteam-fe/design-system/ui';
import { logout } from '@/app/(auth)/_apis/auth';
import { ROUTES } from '@/shared/config/routes';
import { MODAL_BUTTON_CLASS_NAME, OUTLINE_BUTTON_CLASS_NAME } from '../../_constants/button';

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
};

// 로그아웃 전에 한 번 더 묻는다.
// ConfirmModal은 버튼 className을 덮어써서 테두리 버튼을 만들 수 없어, 같은 Modal 조각으로 직접 짠다
export default function LogoutModal({ open, onClose }: LogoutModalProps) {
  const router = useRouter();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  // 로그아웃한 뒤 뒤로 가기로 관리자 화면에 돌아오지 않도록 방문 기록을 로그인 화면으로 바꿔 끼운다
  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <Modal
      open={open}
      handleOpenChange={handleOpenChange}
      showCloseButton={false}
      className='flex w-[36rem] flex-col items-center gap-[2.4rem] rounded-[1.2rem] border-gray-50 p-[2.8rem] shadow-[0_0.8rem_2.4rem_0_rgb(0_0_0_/_0.1)] sm:max-w-none'
    >
      <Modal.Title className='font-18-bd text-black'>로그아웃 하시겠습니까?</Modal.Title>
      {/* 화면에는 없지만 스크린리더가 창을 열 때 무슨 일이 생기는지 함께 읽도록 설명을 둔다 */}
      <Modal.Description className='sr-only'>
        로그아웃하면 로그인 화면으로 이동해요.
      </Modal.Description>
      <Modal.Footer className='w-full flex-row gap-[0.8rem]'>
        <Modal.Button
          label='취소'
          size='medium'
          tone='subtle_2'
          color='gray'
          className={cn('flex-1', MODAL_BUTTON_CLASS_NAME, OUTLINE_BUTTON_CLASS_NAME)}
        />
        <Modal.Button
          label='로그아웃'
          size='medium'
          color='blue'
          onClick={handleLogout}
          className={cn('flex-1', MODAL_BUTTON_CLASS_NAME)}
        />
      </Modal.Footer>
    </Modal>
  );
}
