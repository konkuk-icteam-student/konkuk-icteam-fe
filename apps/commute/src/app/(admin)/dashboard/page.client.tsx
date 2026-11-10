'use client';

import { useToast } from '@/shared/hooks/useToast';
import DateBoard from './_components/date-board/DateBoard';
import NoticePanel from './_components/notice/NoticePanel';

// 관리자 메인 대시보드
export default function PageClient() {
  const { showToast, toast } = useToast();

  return (
    <>
      <DateBoard onNotify={showToast} />
      <NoticePanel onNotify={showToast} />

      {toast}
    </>
  );
}
