'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { signup } from '../../_apis/auth';
import type { WorkDepartment } from '../../_apis/workDepartments';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';
import { SIGNUP_STEP, SIGNUP_STEPS } from '../_constants/signupSteps';
import useEmailVerification from '../_hooks/useEmailVerification';
import { signupSchema, type SignupFormValues } from '../_lib/signupSchema';
import EmailStep from './email-step/EmailStep';
import PasswordStep from './password-step/PasswordStep';
import ProfileStep from './profile-step/ProfileStep';
import SignupProgress from './SignupProgress';

type SignupFormProps = {
  workDepartments: WorkDepartment[];
};

// 회원가입 폼. 한 폼을 메일 인증 → 비밀번호 → 이름·근무 부서 3단계로 나눠 보여 주고, 가입하면 승인 대기 화면으로 보낸다.
// 지나간 단계의 칸은 화면에서 빠져도 값은 폼에 남는다
export default function SignupForm({ workDepartments }: SignupFormProps) {
  const router = useRouter();
  // 가입 뒤 승인 대기 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const [step, setStep] = useState<number>(SIGNUP_STEP.EMAIL);
  // 단계가 바뀐 때만 초점을 옮기려고 직전 단계를 기억한다 (처음 열 때는 옮기지 않는다)
  const previousStepRef = useRef(step);
  const emailVerification = useEmailVerification();
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
  });
  const { formState, getValues, handleSubmit, setError, setFocus, trigger } = methods;
  const titleId = useId();
  const currentStep = SIGNUP_STEPS[step];

  // 단계가 바뀌면 그 단계의 첫 칸에 초점을 둔다
  useEffect(() => {
    if (previousStepRef.current === step) return;

    previousStepRef.current = step;
    const firstField = SIGNUP_STEPS[step]?.fields[0];
    if (firstField) setFocus(firstField);
  }, [step, setFocus]);

  // 메일 칸만 먼저 검사하고, 맞으면 그 메일(소문자)로 인증번호를 보낸다
  const handleSendCode = async () => {
    const isEmailValid = await trigger('email', { shouldFocus: true });
    if (!isEmailValid) return;

    emailVerification.send(schoolEmailSchema.parse(getValues('email')));
  };

  // 인증번호가 맞으면 바로 비밀번호 단계로 넘어간다
  const handleConfirmCode = () => {
    if (emailVerification.confirm()) setStep(SIGNUP_STEP.PASSWORD);
  };

  const handlePasswordNext = async () => {
    const isPasswordValid = await trigger(['password', 'passwordConfirm'], { shouldFocus: true });
    if (isPasswordValid) setStep(SIGNUP_STEP.PROFILE);
  };

  const handleValidSubmit = (values: SignupFormValues) => {
    const { verificationToken } = emailVerification;
    if (!verificationToken) {
      setStep(SIGNUP_STEP.EMAIL);
      return;
    }

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

    // 메일 문제는 메일 단계에서 다시 해야 하므로 그 단계로 돌아간다
    setStep(SIGNUP_STEP.EMAIL);
    if (result.errorCode === 'ALREADY_REGISTERED') {
      emailVerification.markAlreadyRegistered();
      return;
    }

    emailVerification.reset();
    setError('root', { message: '메일 인증이 풀렸어요. 메일을 다시 인증해 주세요.' });
  };

  // 지나간 단계의 칸이 틀렸으면(드문 경우) 그 단계로 돌아가 보여 준다
  const handleInvalidSubmit = (errors: FieldErrors<SignupFormValues>) => {
    const errorStep = SIGNUP_STEPS.findIndex(({ fields }) =>
      fields.some((field) => errors[field] !== undefined),
    );
    if (errorStep !== -1 && errorStep < step) setStep(errorStep);
  };

  // Enter와 [다음]·[가입하기]는 모두 폼 제출로 들어온다. 단계마다 할 일이 다르다
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === SIGNUP_STEP.EMAIL) {
      if (emailVerification.isVerified) setStep(SIGNUP_STEP.PASSWORD);
      else void handleSendCode();
      return;
    }
    if (step === SIGNUP_STEP.PASSWORD) {
      void handlePasswordNext();
      return;
    }

    void handleSubmit(handleValidSubmit, handleInvalidSubmit)(event);
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        aria-labelledby={titleId}
        className='flex flex-col gap-[3.2rem]'
        onSubmit={handleFormSubmit}
      >
        <div className='flex flex-col gap-[2.4rem]'>
          <SignupProgress
            currentStep={step}
            totalSteps={SIGNUP_STEPS.length}
            onBack={step > SIGNUP_STEP.EMAIL ? () => setStep(step - 1) : undefined}
          />
          <header className='flex flex-col gap-[0.8rem]'>
            <p className='caption-12-md text-gray-400'>회원가입</p>
            <h1 id={titleId} className='title-20-bd text-black'>
              {currentStep?.title}
            </h1>
            <p className='caption-14-md text-gray-400'>{currentStep?.description}</p>
          </header>
          <Message
            id={`${titleId}-signup-error`}
            message={formState.errors.root?.message}
            variant='error'
          />
        </div>

        {step === SIGNUP_STEP.EMAIL && (
          <EmailStep
            emailVerification={emailVerification}
            onSendCode={() => void handleSendCode()}
            onConfirmCode={handleConfirmCode}
          />
        )}
        {step === SIGNUP_STEP.PASSWORD && <PasswordStep />}
        {step === SIGNUP_STEP.PROFILE && (
          <ProfileStep
            workDepartments={workDepartments}
            isSubmitting={formState.isSubmitting || isNavigating}
          />
        )}
      </form>
    </FormProvider>
  );
}
