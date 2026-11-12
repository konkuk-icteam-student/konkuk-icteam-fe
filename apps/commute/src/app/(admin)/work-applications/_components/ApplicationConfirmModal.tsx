import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDay, formatMonthDayTime } from '@/shared/utils/formatDate';
import type { WorkApplication } from '../_lib/workApplicationSchema';

type ApplicationConfirmModalProps = {
  // 확인받을 근로신청. 없으면 닫혀 있다
  application: WorkApplication | null;
  monthLabel: string;
  // 이미 연 신청을 고치는 중인지
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

// 근로신청을 열기 전에는 정한 기준을 한눈에 요약해서 확인받고,
// 이미 연 신청을 고칠 때는 들어온 신청이 초기화된다는 것만 확인받는다
export default function ApplicationConfirmModal({
  application,
  monthLabel,
  isOpened,
  onClose,
  onConfirm,
}: ApplicationConfirmModalProps) {
  if (!application) return null;

  const { settings } = application;
  const summaryRows = [
    {
      label: '신청 기간',
      value: `${formatMonthDayTime(settings.applyStartDate)} - ${formatMonthDayTime(settings.applyEndDate)}`,
    },
    { label: '동시 근무 최대 인원', value: `${settings.maxConcurrentWorkers}명` },
    {
      label: '주간 근로시간',
      value: `${settings.weeklyMinHours} - ${settings.weeklyMaxHours}시간`,
    },
    {
      label: '월간 근로시간',
      value: `${settings.monthlyMinHours} - ${settings.monthlyMaxHours}시간`,
    },
    {
      label: '근무 불가 날짜',
      // 날짜가 많으면 여러 줄로 넘긴다
      canWrap: true,
      value:
        settings.unavailableDates.length > 0
          ? settings.unavailableDates.map(formatMonthDay).join(', ')
          : '없음',
    },
  ];

  return (
    <ConfirmModal
      open
      handleOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={
        isOpened
          ? `${monthLabel} 근로신청을 수정하시겠습니까?`
          : `${monthLabel} 근로신청을 받으시겠습니까?`
      }
      description={
        isOpened
          ? '설정이 바뀌면 지금까지 들어온 근로신청은 모두 초기화됩니다.'
          : '아래 기준으로 근로신청을 받습니다.'
      }
      layoutClassName='w-[32rem]'
      buttons={[
        { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
        {
          label: isOpened ? '수정하기' : '신청받기',
          color: 'blue',
          size: 'medium',
          onClick: onConfirm,
        },
      ]}
    >
      {isOpened ? null : (
        <dl className='flex flex-col gap-[1rem] rounded-[0.8rem] bg-gray-50 p-[1.6rem]'>
          {summaryRows.map(({ label, value, canWrap }) => (
            <div key={label} className='flex items-start justify-between gap-[1.6rem]'>
              <dt className='caption-14-md whitespace-nowrap text-gray-500'>{label}</dt>
              <dd
                className={cn(
                  'caption-14-md text-right text-black',
                  canWrap ? 'break-keep' : 'whitespace-nowrap',
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </ConfirmModal>
  );
}
