'use client';

import { useState } from 'react';
import { Button, ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';

type AccountSectionProps = {
  email: string | null;
  onPasswordReset: () => void;
  onDelete: () => void;
};

// 계정. 로그인 ID와 비밀번호 초기화·계정 삭제. 둘 다 한 번 더 묻고 실행한다.
// 비밀번호 초기화는 학교 메일로 재설정 링크를 보내는 것이라, 메일이 없으면 할 수 없다
export default function AccountSection({ email, onPasswordReset, onDelete }: AccountSectionProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  return (
    <section className='flex flex-col gap-[1.2rem]'>
      <h3 className='font-16-bd text-black'>계정</h3>
      <div className='flex items-baseline gap-[0.8rem] rounded-[1.2rem] border border-gray-50 px-[1.8rem] py-[1.6rem]'>
        <span className='caption-12-rg text-gray-500'>ID</span>
        <span className='font-16-md text-gray-700'>{email ?? EMPTY_STUDENT_TEXT}</span>
      </div>
      <div className='flex gap-[0.8rem]'>
        <Button
          size='medium'
          tone='subtle_2'
          color='black'
          disabled={!email}
          onClick={() => setIsResetConfirmOpen(true)}
        >
          비밀번호 초기화
        </Button>
        <Button
          size='medium'
          tone='subtle_2'
          color='red'
          className='bg-black-1 border-red/40 border'
          onClick={() => setIsDeleteConfirmOpen(true)}
        >
          계정 삭제
        </Button>
      </div>

      <ConfirmModal
        open={isResetConfirmOpen}
        handleOpenChange={setIsResetConfirmOpen}
        title='비밀번호를 초기화 하시겠습니까?'
        description='기존의 비밀번호가 삭제되며 새로운 비밀번호가 발급됩니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '초기화하기', color: 'blue', size: 'medium', onClick: onPasswordReset },
        ]}
      />
      <ConfirmModal
        open={isDeleteConfirmOpen}
        handleOpenChange={setIsDeleteConfirmOpen}
        title='계정을 삭제하시겠습니까?'
        description='시간표, 개인정보 등 근무자와 관련한 정보가 모두 삭제됩니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '삭제하기', color: 'red', size: 'medium', onClick: onDelete },
        ]}
      />
    </section>
  );
}
