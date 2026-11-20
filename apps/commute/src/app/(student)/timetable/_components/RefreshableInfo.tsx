import { IconRestore } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type RefreshableInfoProps = {
  children: React.ReactNode;
  // 글자를 빨갛게 보여 줄지 (한도를 넘었을 때 등)
  isWarning?: boolean;
  // 바꾼 칸은 그대로 두고 칸 인원을 다시 불러온다
  onRefresh: () => void;
};

// 시간표 위 안내 한 줄. 가운데에 글자, 오른쪽에 새로고침 버튼을 둔다
export default function RefreshableInfo({
  children,
  isWarning = false,
  onRefresh,
}: RefreshableInfoProps) {
  return (
    <div className='grid grid-cols-[1fr_auto_1fr] items-center'>
      <div />
      <p className={cn('caption-12-md text-center', isWarning ? 'text-red' : 'text-gray-500')}>
        {children}
      </p>
      <button
        type='button'
        aria-label='인원 새로고침'
        onClick={onRefresh}
        className='bg-black-1 flex h-[3.6rem] w-[3.6rem] items-center justify-center justify-self-end rounded-full border border-gray-50 text-black'
      >
        <IconRestore aria-hidden className='h-[2rem] w-[2rem]' />
      </button>
    </div>
  );
}
