'use client';

import { useId } from 'react';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import FormField from '../../../_components/FormField';
import SchoolEmailInput from '../../../_components/SchoolEmailInput';
import useFormField from '../../../_hooks/useFormField';
import schoolEmailSchema from '../../../_lib/schoolEmailSchema';
import type useEmailVerification from '../../_hooks/useEmailVerification';
import type { SignupFormValues } from '../../_lib/signupSchema';

type EmailStepProps = {
  emailVerification: ReturnType<typeof useEmailVerification>;
  onSendCode: () => void;
  onConfirmCode: () => void;
};

// 1단계: 학교 메일 인증. 인증번호를 확인하면 폼이 바로 다음 단계로 넘긴다
export default function EmailStep({
  emailVerification,
  onSendCode,
  onConfirmCode,
}: EmailStepProps) {
  const form = useFormContext<SignupFormValues>();
  const email = useFormField(form, 'email');
  const codeIdPrefix = useId();
  // 이미 가입된 메일도 오류로 보인다
  const hasEmailError = email.hasError || emailVerification.isAlreadyRegistered;
  // 오류 문구 말고도 '이미 가입된 메일', '인증을 마쳤어요' 안내를 함께 읽도록 묶음 전체에 잇는다
  const emailMessageId = `${email.inputId}-message`;
  // 학교 메일 형식으로 입력했으면 [인증번호 받기]를 파랗게 보여 눌러도 된다는 것을 알린다
  const isEmailReady = schoolEmailSchema.safeParse(email.field.value).success;

  // 메일을 고치면 이전 메일로 한 인증은 쓸 수 없으니 처음으로 돌린다
  const handleEmailChange = (nextEmail: string) => {
    email.field.onChange(nextEmail);
    emailVerification.reset();
  };

  // 인증번호 칸에서 Enter를 누르면 다음 단계가 아니라 인증번호 확인을 한다
  const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    onConfirmCode();
  };

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        {/* 오류 말고 '이미 가입된 메일', '인증을 마쳤어요' 안내도 함께 보여야 해 문구는 직접 둔다 */}
        <FormField label='학교 메일' htmlFor={email.inputId}>
          <div className='flex gap-[0.8rem]'>
            <div className='min-w-0 flex-1'>
              <SchoolEmailInput
                {...email.inputProps}
                name={email.field.name}
                value={email.field.value}
                onValueChange={handleEmailChange}
                onBlur={email.field.onBlur}
                inputMode='email'
                autoComplete='email'
                placeholder='아이디@konkuk.ac.kr'
                hasError={hasEmailError}
                aria-invalid={hasEmailError}
                aria-describedby={emailMessageId}
              />
            </div>
            <Button
              display='inline'
              size='medium'
              tone={isEmailReady ? 'solid' : 'subtle_2'}
              color={isEmailReady ? 'blue' : 'gray'}
              className='w-auto shrink-0 px-[1.6rem]'
              disabled={emailVerification.isVerified}
              onClick={onSendCode}
            >
              {emailVerification.isSent ? '다시 받기' : '인증번호 받기'}
            </Button>
          </div>
          <div id={emailMessageId}>
            <Message {...email.errorProps} />
            {emailVerification.isAlreadyRegistered && (
              <p role='alert' className='caption-10-md text-red mt-[0.4rem]'>
                {'이미 가입된 메일이에요. '}
                <Link href={ROUTES.LOGIN} className='underline'>
                  로그인하기
                </Link>
              </p>
            )}
            {/* 늘 그려 두는 알림 영역이라, 인증을 마친 순간 스크린리더가 읽어 준다 */}
            <div role='status'>
              <Message
                id={`${email.inputId}-verified`}
                message={emailVerification.isVerified ? '메일 인증을 마쳤어요.' : undefined}
                variant='success'
              />
            </div>
          </div>
        </FormField>

        {emailVerification.isSent && !emailVerification.isVerified && (
          // 오류와 도움말을 함께 보여야 해 문구는 직접 둔다
          <FormField label='인증번호' htmlFor={`${codeIdPrefix}-code`}>
            <div className='flex gap-[0.8rem]'>
              <div className='relative min-w-0 flex-1'>
                {/* 인증번호를 보내면 이 칸이 나타나며 초점을 받고, 스크린리더가 아래 안내를 함께 읽는다 */}
                <Input
                  id={`${codeIdPrefix}-code`}
                  autoFocus
                  inputMode='numeric'
                  autoComplete='one-time-code'
                  maxLength={6}
                  placeholder='숫자 6자리'
                  className='pr-[6rem]'
                  value={emailVerification.verificationCode}
                  hasError={emailVerification.codeError !== undefined}
                  aria-invalid={emailVerification.codeError !== undefined}
                  aria-describedby={`${codeIdPrefix}-code-message`}
                  onChange={(event) => emailVerification.changeVerificationCode(event.target.value)}
                  onKeyDown={handleCodeKeyDown}
                />
                {/* 남은 시간. 매초 바뀌므로 스크린리더가 계속 읽지 않게 라이브 영역으로 두지 않는다 */}
                <span className='caption-12-md text-red absolute top-1/2 right-[1.2rem] -translate-y-1/2'>
                  {emailVerification.remainingTimeLabel}
                </span>
              </div>
              <Button
                display='inline'
                size='medium'
                color='blue'
                className='w-auto shrink-0 px-[1.6rem]'
                disabled={emailVerification.isExpired}
                onClick={onConfirmCode}
              >
                확인
              </Button>
            </div>
            <div id={`${codeIdPrefix}-code-message`}>
              <Message
                id={`${codeIdPrefix}-code-error`}
                message={emailVerification.codeError}
                variant='error'
              />
              <Message id={`${codeIdPrefix}-code-help`} message={emailVerification.codeHelp} />
            </div>
          </FormField>
        )}
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        {/* 인증을 마친 뒤 뒤로 돌아왔을 때 다시 넘어가는 버튼. 처음에는 인증하면 바로 넘어간다 */}
        {emailVerification.isVerified && (
          <Button type='submit' color='blue'>
            다음
          </Button>
        )}
        <p className='caption-12-md text-center text-gray-400'>
          {'이미 계정이 있나요? '}
          <Link href={ROUTES.LOGIN} className='text-blue underline'>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
