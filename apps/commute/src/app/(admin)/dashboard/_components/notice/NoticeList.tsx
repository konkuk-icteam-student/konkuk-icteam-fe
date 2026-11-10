'use client';

import { useState } from 'react';
import { IconTrash } from '@konkuk-icteam-fe/design-system/assets';
import { ConfirmModal, IconButton, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { deleteNotice, type Notice } from '../../../_apis/notices';
import { formatDateRange } from '@/shared/utils/formatDate';

type NoticeListProps = {
  notices: Notice[];
  onNotify: (message: string) => void;
};

// TODO: react-query 도입 후 삭제 성공 시 공지 목록 쿼리키 무효화
export default function NoticeList({ notices, onNotify }: NoticeListProps) {
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDeleteConfirm = () => {
    if (!deletingNotice) return;
    deleteNotice({ noticeId: deletingNotice.noticeId });
    setDeletingNotice(null);
    onNotify('공지사항을 삭제했어요.');
  };

  if (notices.length === 0) {
    return (
      <p className='caption-14-md py-[4rem] text-center text-gray-400'>
        근로학생에게 보이는 공지가 없어요.
      </p>
    );
  }

  return (
    <>
      <ul className='flex flex-col'>
        {notices.map((notice) => {
          const { noticeId, title, content, startDate, endDate } = notice;
          const isPosted = endDate >= today && startDate <= today;

          return (
            <li
              key={noticeId}
              className='flex flex-col gap-[0.6rem] border-b border-gray-50 px-[0.4rem] py-[1.2rem] last:border-b-0'
            >
              <div className='flex items-center gap-[0.8rem]'>
                <StateChip
                  label={isPosted ? '게시 중' : '게시 예정'}
                  tone={isPosted ? 'green' : 'blue'}
                />
                <p className='font-14-bd min-w-0 flex-1 truncate text-black'>{title}</p>

                <IconButton
                  aria-label={`${title} 삭제`}
                  className='group'
                  onClick={() => setDeletingNotice(notice)}
                >
                  <IconTrash
                    aria-hidden
                    className='group-hover:text-red h-[1.6rem] w-[1.6rem] text-gray-400'
                  />
                </IconButton>
              </div>
              <p className='caption-12-md text-gray-500'>{formatDateRange(startDate, endDate)}</p>
              <p className='caption-14-rg line-clamp-2 whitespace-pre-line text-gray-700'>
                {content}
              </p>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        open={deletingNotice !== null}
        handleOpenChange={(open) => {
          if (!open) setDeletingNotice(null);
        }}
        title='공지사항을 삭제하시겠습니까?'
        description='지운 공지는 근로학생에게서도 바로 사라집니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '삭제하기', color: 'red', size: 'medium', onClick: handleDeleteConfirm },
        ]}
      />
    </>
  );
}
