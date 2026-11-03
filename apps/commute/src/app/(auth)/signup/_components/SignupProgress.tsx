import { IconArrowLeft } from '@konkuk-icteam-fe/design-system/assets';
import { IconButton } from '@konkuk-icteam-fe/design-system/ui';

type SignupProgressProps = {
  // 지금 단계 (0부터)
  currentStep: number;
  totalSteps: number;
  // 없으면 뒤로 버튼을 두지 않는다 (첫 단계)
  onBack?: () => void;
};

// 회원가입 진행 표시. 뒤로 버튼, n/전체, 진행 막대를 보여 준다.
// 디자인 시스템 Stepper는 숫자를 올리고 내리는 입력이라 단계 표시는 여기서 만든다
export default function SignupProgress({ currentStep, totalSteps, onBack }: SignupProgressProps) {
  const stepNumber = currentStep + 1;

  return (
    <div className='flex flex-col gap-[1.2rem]'>
      <div className='flex h-[2.4rem] items-center justify-between'>
        {onBack ? (
          <IconButton aria-label='이전 단계' className='text-black' onClick={onBack}>
            <IconArrowLeft aria-hidden className='h-[2.4rem] w-[2.4rem]' />
          </IconButton>
        ) : (
          <span aria-hidden />
        )}
        <span className='caption-12-md text-gray-400'>{`${stepNumber}/${totalSteps}`}</span>
      </div>
      <div
        role='progressbar'
        aria-label='회원가입 진행'
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={stepNumber}
        className='h-[0.4rem] w-full overflow-hidden rounded-full bg-gray-50'
      >
        <div
          className='bg-blue h-full rounded-full transition-[width] duration-300'
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
