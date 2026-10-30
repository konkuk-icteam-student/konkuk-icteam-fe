'use client';

import { useId, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dropdown, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { signup } from '../../_apis/auth';
import type { WorkDepartment } from '../../_apis/workDepartments';
import PasswordInput from '../../_components/PasswordInput';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';
import useEmailVerification from '../_hooks/useEmailVerification';
import { signupSchema, type SignupFormValues } from '../_lib/signupSchema';

// 메일 인증이 풀린 채로 가입을 누르면(다른 곳에서 인증이 끝났거나 만료) 다시 인증하게 한다
const EMAIL_NOT_VERIFIED_MESSAGE = '메일 인증이 풀렸어요. 메일을 다시 인증해 주세요.';

type SignupFormProps = {
  workDepartments: WorkDepartment[];
};

// 회원가입 폼. 메일 인증을 마쳐야 가입할 수 있고, 가입하면 승인 대기 화면으로 보낸다
export default function SignupForm({ workDepartments }: SignupFormProps) {
  const router = useRouter();
  // 가입 뒤 승인 대기 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const emailVerification = useEmailVerification();
  const { control, formState, getValues, handleSubmit, register, setError, setFocus, trigger } =
    useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
    });
  // 둘 다 틀렸을 때 화면 위쪽 칸에 먼저 초점이 가도록 화면 순서대로 등록한다
  // (메일·근무 부서는 디자인 시스템 ComboBox·Dropdown이라 register 대신 useController로 잇는다)
  const nameRegistration = register('name');
  const { field: emailField } = useController({ control, name: 'email' });
  const passwordRegistration = register('password');
  const passwordConfirmRegistration = register('passwordConfirm');
  const { field: workDepartmentField } = useController({ control, name: 'workDepartmentId' });
  const fieldIdPrefix = useId();
  const { errors } = formState;
  const hasEmailError = errors.email !== undefined || emailVerification.isAlreadyRegistered;
  const selectedWorkDepartmentName =
    workDepartments.find(({ workDepartmentId }) => workDepartmentId === workDepartmentField.value)
      ?.name ?? '';

  const handleEmailChange = (nextEmail: string) => {
    emailField.onChange(nextEmail);
    emailVerification.reset();
  };

  // 메일 칸만 먼저 검사하고, 맞으면 그 메일(소문자)로 인증번호를 보낸다
  const handleSendCode = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    emailVerification.send(schoolEmailSchema.parse(getValues('email')));
  };

  // 인증을 마치면 인증번호 칸이 사라지므로, 초점을 다음 칸(비밀번호)으로 옮긴다
  const handleConfirmCode = () => {
    if (emailVerification.confirm()) setFocus('password');
  };

  // 인증번호 칸에서 Enter를 누르면 가입이 아니라 인증번호 확인을 한다
  const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    handleConfirmCode();
  };

  const handleWorkDepartmentChange = (workDepartmentName: string) => {
    workDepartmentField.onChange(
      workDepartments.find(({ name }) => name === workDepartmentName)?.workDepartmentId,
    );
  };

  const handleValidSubmit = (values: SignupFormValues) => {
    const { verificationToken } = emailVerification;
    if (!verificationToken) return;

    const result = signup({
      name: values.name,
      email: values.email,
      password: values.password,
      workDepartmentId: values.workDepartmentId,
      verificationToken,
    });
    if (result.isSuccess) {
      startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
      return;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') {
      emailVerification.markAlreadyRegistered();
      return;
    }

    emailVerification.reset();
    setError('root', { message: EMAIL_NOT_VERIFIED_MESSAGE });
  };

  return (
    <form
      noValidate
      className='flex flex-col gap-[2.4rem]'
      onSubmit={(event) => void handleSubmit(handleValidSubmit)(event)}
    >
      <div className='flex flex-col gap-[1.6rem]'>
        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-name`} className='font-14-bd text-black'>
            이름
          </label>
          <Input
            id={`${fieldIdPrefix}-name`}
            autoComplete='name'
            placeholder='이름을 입력해 주세요'
            className='h-[4.2rem]'
            hasError={errors.name !== undefined}
            aria-invalid={errors.name !== undefined}
            aria-describedby={`${fieldIdPrefix}-name-error`}
            {...nameRegistration}
          />
          <Message
            id={`${fieldIdPrefix}-name-error`}
            message={errors.name?.message}
            variant='error'
          />
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-email`} className='font-14-bd text-black'>
            학교 메일
          </label>
          <div className='flex gap-[0.8rem]'>
            <div className='min-w-0 flex-1'>
              <SchoolEmailInput
                value={emailField.value}
                onChange={handleEmailChange}
                onBlur={emailField.onBlur}
                inputProps={{
                  id: `${fieldIdPrefix}-email`,
                  name: emailField.name,
                  ref: emailField.ref,
                  autoComplete: 'email',
                  hasError: hasEmailError,
                  'aria-invalid': hasEmailError,
                  'aria-describedby': `${fieldIdPrefix}-email-message`,
                }}
              />
            </div>
            <Button
              display='inline'
              size='medium'
              tone='subtle_2'
              color='gray'
              className='h-[4.2rem] w-auto shrink-0 px-[1.6rem]'
              disabled={emailVerification.isVerified}
              onClick={() => void handleSendCode()}
            >
              {emailVerification.isSent ? '다시 받기' : '인증번호 받기'}
            </Button>
          </div>
          <div id={`${fieldIdPrefix}-email-message`}>
            <Message
              id={`${fieldIdPrefix}-email-error`}
              message={errors.email?.message}
              variant='error'
            />
            {emailVerification.isAlreadyRegistered && (
              <p role='alert' className='caption-10-md text-red'>
                {'이미 가입된 메일이에요. '}
                <Link href={ROUTES.LOGIN} className='underline'>
                  로그인하기
                </Link>
              </p>
            )}
            {/* 늘 그려 두는 알림 영역이라, 인증을 마친 순간 스크린리더가 읽어 준다 */}
            <div role='status'>
              <Message
                id={`${fieldIdPrefix}-email-verified`}
                message={emailVerification.isVerified ? '메일 인증을 마쳤어요.' : undefined}
                variant='success'
              />
            </div>
          </div>
        </div>

        {emailVerification.isSent && !emailVerification.isVerified && (
          <div className='flex flex-col gap-[0.8rem]'>
            <label htmlFor={`${fieldIdPrefix}-code`} className='font-14-bd text-black'>
              인증번호
            </label>
            <div className='flex gap-[0.8rem]'>
              <div className='relative min-w-0 flex-1'>
                {/* 인증번호를 보내면 이 칸이 나타나며 초점을 받고, 스크린리더가 아래 안내를 함께 읽는다 */}
                <Input
                  id={`${fieldIdPrefix}-code`}
                  autoFocus
                  inputMode='numeric'
                  autoComplete='one-time-code'
                  maxLength={6}
                  placeholder='숫자 6자리'
                  className='h-[4.2rem] pr-[6rem]'
                  value={emailVerification.verificationCode}
                  hasError={emailVerification.codeError !== undefined}
                  aria-invalid={emailVerification.codeError !== undefined}
                  aria-describedby={`${fieldIdPrefix}-code-message`}
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
                className='h-[4.2rem] w-auto shrink-0 px-[1.6rem]'
                disabled={emailVerification.isExpired}
                onClick={handleConfirmCode}
              >
                확인
              </Button>
            </div>
            <div id={`${fieldIdPrefix}-code-message`}>
              <Message
                id={`${fieldIdPrefix}-code-error`}
                message={emailVerification.codeError}
                variant='error'
              />
              <Message id={`${fieldIdPrefix}-code-help`} message={emailVerification.codeHelp} />
            </div>
          </div>
        )}

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password`} className='font-14-bd text-black'>
            비밀번호
          </label>
          <PasswordInput
            id={`${fieldIdPrefix}-password`}
            autoComplete='new-password'
            placeholder='영문과 숫자를 섞어 8자 이상'
            className='h-[4.2rem]'
            hasError={errors.password !== undefined}
            aria-invalid={errors.password !== undefined}
            aria-describedby={`${fieldIdPrefix}-password-error`}
            {...passwordRegistration}
          />
          <Message
            id={`${fieldIdPrefix}-password-error`}
            message={errors.password?.message}
            variant='error'
          />
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password-confirm`} className='font-14-bd text-black'>
            비밀번호 확인
          </label>
          <PasswordInput
            id={`${fieldIdPrefix}-password-confirm`}
            autoComplete='new-password'
            placeholder='비밀번호를 한 번 더 입력해 주세요'
            className='h-[4.2rem]'
            hasError={errors.passwordConfirm !== undefined}
            aria-invalid={errors.passwordConfirm !== undefined}
            aria-describedby={`${fieldIdPrefix}-password-confirm-error`}
            {...passwordConfirmRegistration}
          />
          <Message
            id={`${fieldIdPrefix}-password-confirm-error`}
            message={errors.passwordConfirm?.message}
            variant='error'
          />
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-work-department`} className='font-14-bd text-black'>
            근무 부서
          </label>
          <Dropdown
            options={workDepartments.map(({ name }) => name)}
            value={selectedWorkDepartmentName}
            onChange={handleWorkDepartmentChange}
            onBlur={workDepartmentField.onBlur}
            placeholder='근무 부서를 골라 주세요'
            hasError={errors.workDepartmentId !== undefined}
            triggerProps={{
              id: `${fieldIdPrefix}-work-department`,
              ref: workDepartmentField.ref,
              'aria-invalid': errors.workDepartmentId !== undefined,
              'aria-describedby': `${fieldIdPrefix}-work-department-error`,
            }}
          />
          <Message
            id={`${fieldIdPrefix}-work-department-error`}
            message={errors.workDepartmentId?.message}
            variant='error'
          />
        </div>
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        <Message
          id={`${fieldIdPrefix}-signup-error`}
          message={errors.root?.message}
          variant='error'
        />
        <Button
          type='submit'
          color='blue'
          disabled={!emailVerification.isVerified}
          isLoading={formState.isSubmitting || isNavigating}
        >
          가입하기
        </Button>
        <Message
          id={`${fieldIdPrefix}-signup-help`}
          message={
            emailVerification.isVerified ? undefined : '메일 인증을 마치면 가입할 수 있어요.'
          }
        />
        <p className='caption-12-md text-center text-gray-400'>
          {'이미 계정이 있나요? '}
          <Link href={ROUTES.LOGIN} className='text-blue underline'>
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
