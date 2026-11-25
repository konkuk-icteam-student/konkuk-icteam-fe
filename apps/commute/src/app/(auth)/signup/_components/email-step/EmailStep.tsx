import Link from 'next/link';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import FormField from '../../../_components/FormField';
import SchoolEmailInput from '../../../_components/SchoolEmailInput';
import hasEnterKey from '../../../_utils/hasEnterKey';
import schoolEmailSchema from '../../../_lib/schoolEmailSchema';
import type { SignupFormState } from '../../_hooks/useSignupForm';

const getCodeMessage = ({ codeError, isVerified }: { codeError?: string; isVerified: boolean }) => {
  if (codeError) return { message: codeError, variant: 'error' } as const;
  if (isVerified) return { message: '메일 인증을 마쳤어요.', variant: 'success' } as const;
  return {
    message: '메일로 받은 인증번호 6자리를 5분 안에 입력해 주세요.',
    variant: 'help',
  } as const;
};

type EmailStepProps = Pick<
  SignupFormState,
  'formValues' | 'formErrors' | 'formHandlers' | 'verification'
>;

export default function EmailStep({
  formValues,
  formErrors,
  formHandlers,
  verification,
}: EmailStepProps) {
  const isEmailReady = schoolEmailSchema.safeParse(formValues.email).success;
  const hasEmailError = formErrors.email !== undefined || verification.isAlreadyRegistered;
  const codeMessage = getCodeMessage(verification);

  return (
    <>
      <FormField label='학교 메일' htmlFor='email'>
        <div className='flex gap-[0.8rem]'>
          <div className='min-w-0 flex-1'>
            <SchoolEmailInput
              id='email'
              name='email'
              value={formValues.email}
              onChange={formHandlers.updateEmail}
              autoComplete='email'
              placeholder='아이디@konkuk.ac.kr'
              hasError={hasEmailError}
              aria-invalid={hasEmailError}
              aria-describedby='email-message'
            />
          </div>
          {!verification.isVerified && (
            <Button
              display='inline'
              size='medium'
              tone={isEmailReady ? 'solid' : 'subtle_2'}
              color={isEmailReady ? 'blue' : 'gray'}
              className='w-auto shrink-0 px-[1.6rem]'
              onClick={formHandlers.sendCode}
            >
              {verification.isSent ? '다시 받기' : '인증번호 받기'}
            </Button>
          )}
        </div>
        <div id='email-message'>
          <Message id='email-error' message={formErrors.email} variant='error' />
          {verification.isAlreadyRegistered && (
            <p role='alert' className='caption-10-md text-red mt-[0.4rem]'>
              {'이미 가입된 메일이에요. '}
              <Link href={ROUTES.LOGIN} className='underline'>
                로그인하기
              </Link>
            </p>
          )}
        </div>
      </FormField>

      {verification.isSent && (
        <FormField label='인증번호' htmlFor='verification-code'>
          <div className='flex gap-[0.8rem]'>
            <div className='relative min-w-0 flex-1'>
              <Input
                id='verification-code'
                name='verificationCode'
                value={verification.code}
                onChange={(event) => verification.updateCode(event.target.value)}
                onKeyDown={(event) => {
                  // 인증 전 Enter는 폼 제출(인증번호 받기)이 아니라 확인이다. 인증 뒤에는 폼 제출([다음])로 둔다
                  if (verification.isVerified || !hasEnterKey(event)) return;

                  event.preventDefault();
                  formHandlers.confirmCode();
                }}
                autoFocus
                readOnly={verification.isVerified}
                autoComplete='one-time-code'
                maxLength={6}
                placeholder='영문·숫자 6자리'
                className='pr-[6rem]'
                hasError={verification.codeError !== undefined}
                aria-invalid={verification.codeError !== undefined}
                aria-describedby='verification-code-message'
              />
              {!verification.isVerified && (
                <span className='caption-12-md text-red absolute top-1/2 right-[1.2rem] -translate-y-1/2'>
                  {verification.remainingTimeLabel}
                </span>
              )}
            </div>
            <Button
              display='inline'
              size='medium'
              color='blue'
              className='w-auto shrink-0 px-[1.6rem]'
              disabled={verification.isExpired || verification.isVerified}
              onClick={formHandlers.confirmCode}
            >
              확인
            </Button>
          </div>
          <Message key={codeMessage.variant} id='verification-code-message' {...codeMessage} />
        </FormField>
      )}

      {verification.isVerified && (
        <Button type='submit' color='blue' autoFocus>
          다음
        </Button>
      )}
    </>
  );
}
