'use client';

import { useId } from 'react';
import Link from 'next/link';
import { useController, useFormContext } from 'react-hook-form';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import FormField from '../../../_components/FormField';
import SchoolEmailInput from '../../../_components/SchoolEmailInput';
import schoolEmailSchema from '../../../_lib/schoolEmailSchema';
import {
  VERIFICATION_CODE_ERROR_MESSAGE,
  VERIFICATION_CODE_HELP_MESSAGE,
} from '../../_constants/verificationCodeMessages';
import type { SignupFormValues } from '../../_lib/signupSchema';

type EmailStepProps = {
  verification: {
    isSent: boolean;
    isVerified: boolean;
    isAlreadyRegistered: boolean;
    isExpired: boolean;
    remainingTimeLabel: string;
  };
  // 메일을 고치면 이전 메일로 한 인증을 처음으로 돌린다
  onEmailChange: () => void;
  onSendCode: () => void;
  onConfirmCode: () => void;
};

export default function EmailStep({
  verification,
  onEmailChange,
  onSendCode,
  onConfirmCode,
}: EmailStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const { field: emailField } = useController<SignupFormValues, 'email'>({ name: 'email' });
  const fieldIdPrefix = useId();
  const emailId = `${fieldIdPrefix}-email`;
  const codeId = `${fieldIdPrefix}-code`;
  const emailError = errors.email?.message;
  const hasEmailError = emailError !== undefined || verification.isAlreadyRegistered;
  // 오류 문구 말고도 '이미 가입된 메일', '인증을 마쳤어요' 안내를 함께 읽도록 묶음 전체에 잇는다
  const emailMessageId = `${emailId}-message`;
  const codeMessageId = `${codeId}-message`;
  // 학교 메일 형식으로 입력했으면 [인증번호 받기]를 파랗게 보여 눌러도 된다는 것을 알린다
  const isEmailReady = schoolEmailSchema.safeParse(emailField.value).success;
  const codeError = verification.isExpired
    ? VERIFICATION_CODE_ERROR_MESSAGE.EXPIRED_CODE
    : errors.verificationCode?.message;

  const handleEmailChange = (nextEmail: string) => {
    emailField.onChange(nextEmail);
    onEmailChange();
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
        <FormField label='학교 메일' htmlFor={emailId}>
          <div className='flex gap-[0.8rem]'>
            <div className='min-w-0 flex-1'>
              <SchoolEmailInput
                {...emailField}
                id={emailId}
                onChange={handleEmailChange}
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
              disabled={verification.isVerified}
              onClick={onSendCode}
            >
              {verification.isSent ? '다시 받기' : '인증번호 받기'}
            </Button>
          </div>
          <div id={emailMessageId}>
            <Message id={`${emailId}-error`} message={emailError} variant='error' />
            {verification.isAlreadyRegistered && (
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
                id={`${emailId}-verified`}
                message={verification.isVerified ? '메일 인증을 마쳤어요.' : undefined}
                variant='success'
              />
            </div>
          </div>
        </FormField>

        {verification.isSent && !verification.isVerified && (
          // 오류와 도움말을 함께 보여야 해 문구는 직접 둔다
          <FormField label='인증번호' htmlFor={codeId}>
            <div className='flex gap-[0.8rem]'>
              <div className='relative min-w-0 flex-1'>
                {/* 인증번호를 보내면 이 칸이 나타나며 초점을 받고, 스크린리더가 아래 안내를 함께 읽는다 */}
                <Input
                  id={codeId}
                  {...register('verificationCode')}
                  autoFocus
                  autoComplete='one-time-code'
                  maxLength={6}
                  placeholder='영문·숫자 6자리'
                  className='pr-[6rem]'
                  hasError={codeError !== undefined}
                  aria-invalid={codeError !== undefined}
                  aria-describedby={codeMessageId}
                  onKeyDown={handleCodeKeyDown}
                />
                {/* 남은 시간. 매초 바뀌므로 스크린리더가 계속 읽지 않게 라이브 영역으로 두지 않는다 */}
                <span className='caption-12-md text-red absolute top-1/2 right-[1.2rem] -translate-y-1/2'>
                  {verification.remainingTimeLabel}
                </span>
              </div>
              <Button
                display='inline'
                size='medium'
                color='blue'
                className='w-auto shrink-0 px-[1.6rem]'
                disabled={verification.isExpired}
                onClick={onConfirmCode}
              >
                확인
              </Button>
            </div>
            <div id={codeMessageId}>
              <Message id={`${codeId}-error`} message={codeError} variant='error' />
              <Message
                id={`${codeId}-help`}
                message={codeError ? undefined : VERIFICATION_CODE_HELP_MESSAGE}
              />
            </div>
          </FormField>
        )}
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        {/* 인증을 마친 뒤 뒤로 돌아왔을 때 다시 넘어가는 버튼. 처음에는 인증하면 바로 넘어간다 */}
        {verification.isVerified && (
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
