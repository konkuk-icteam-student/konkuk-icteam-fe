'use client';

import { getNotices } from '../../../_apis/notices';
import AdminPanel from '../../../_layouts/AdminPanel';
import NoticeForm from './NoticeForm';
import NoticeList from './NoticeList';

type NoticePanelProps = {
  onNotify: (message: string) => void;
};

export default function NoticePanel({ onNotify }: NoticePanelProps) {
  const { notices } = getNotices();

  return (
    <AdminPanel title='공지사항'>
      <div className='mx-[2.1rem] mb-[2rem] grid grid-cols-2 items-start gap-[2.4rem]'>
        <section className='bg-black-1 flex flex-col gap-[1.6rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
          <h3 className='font-16-bd text-black'>공지 등록</h3>
          <NoticeForm onNotify={onNotify} />
        </section>
        <section className='bg-black-1 flex flex-col gap-[0.8rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
          <div className='flex items-baseline justify-between'>
            <h3 className='font-16-bd text-black'>근로학생에게 보이는 공지</h3>
            <span className='caption-12-md text-gray-400'>{`${notices.length}건`}</span>
          </div>
          <NoticeList notices={notices} onNotify={onNotify} />
        </section>
      </div>
    </AdminPanel>
  );
}
