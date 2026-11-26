import { ApplicationEditor } from './_components/ApplicationEditor';
import Header from './_components/Header.client';

// '다음 달'을 빌드한 날이 아니라 접속한 날 기준으로 그리도록 요청마다 렌더한다
export const dynamic = 'force-dynamic';

type LayoutProps = {
  // 왼쪽: 근로신청 기준 입력 폼 (@open)
  open: React.ReactNode;
  // 왼쪽: 연 기준 보기 (@settings). 연 뒤에는 이걸 보여 주고, 수정할 때만 폼으로 바꾼다
  settings: React.ReactNode;
  // 오른쪽: 근로신청 요약 (@summary)
  summary: React.ReactNode;
};

export default function Layout({ open, settings, summary }: LayoutProps) {
  return (
    <div className='mx-auto flex w-full max-w-[140rem] flex-col gap-[2.4rem] p-[3.4rem]'>
      <Header />
      {/* 오른쪽 요약은 왼쪽 높이를 따른다. 짧은 기준 보기일 때도 입력 폼만큼은 높이를 둔다 */}
      <div className='grid min-h-[66rem] grid-cols-[minmax(0,1fr)_42rem] gap-[2.4rem]'>
        <ApplicationEditor settings={settings} open={open} />
        <div className='relative'>
          <div className='absolute inset-0'>{summary}</div>
        </div>
      </div>
    </div>
  );
}
