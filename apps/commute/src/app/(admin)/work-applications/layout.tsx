import Header from './_components/Header.client';

// '다음 달'을 빌드한 날이 아니라 접속한 날 기준으로 그리도록 요청마다 렌더한다
export const dynamic = 'force-dynamic';

type LayoutProps = {
  // 왼쪽: 근로신청 열기 폼 (@open)
  open: React.ReactNode;
  // 오른쪽: 근로신청 요약 (@summary)
  summary: React.ReactNode;
};

export default function Layout({ open, summary }: LayoutProps) {
  return (
    <div className='mx-auto flex w-full max-w-[140rem] flex-col gap-[2.4rem] p-[3.4rem]'>
      <Header />
      <div className='grid grid-cols-[minmax(0,1fr)_42rem] gap-[2.4rem]'>
        {open}
        <div className='relative'>
          <div className='absolute inset-0'>{summary}</div>
        </div>
      </div>
    </div>
  );
}
