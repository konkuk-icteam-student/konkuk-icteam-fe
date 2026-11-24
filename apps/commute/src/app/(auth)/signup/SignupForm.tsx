'use client';

import Link from 'next/link';
import { ROUTES } from '@/shared/config/routes';
import type { WorkDepartment } from '../_apis/workDepartments';
import EmailStep from './_components/email-step/EmailStep';
import PasswordStep from './_components/password-step/PasswordStep';
import ProfileStep from './_components/profile-step/ProfileStep';
import StepPanel from './_components/StepPanel';
import { SIGNUP_STEP } from './_constants/signupSteps';
import useSignupForm from './_hooks/useSignupForm';
import useSignupStep from './_hooks/useSignupStep';

const SIGNUP_STEP_COUNT = Object.keys(SIGNUP_STEP).length;

type SignupFormProps = {
  workDepartments: WorkDepartment[];
};

export default function SignupForm({ workDepartments }: SignupFormProps) {
  const { step, stepPanelsRef, goNextStep } = useSignupStep();
  const { formValues, formErrors, formHandlers, verification, handleFormSubmit, isSubmitting } =
    useSignupForm({ step, goNextStep });
  const fieldProps = { formValues, formErrors, formHandlers };

  return (
    <>
      <header className='flex flex-col gap-[0.8rem]'>
        <div
          role='progressbar'
          aria-label='회원가입 진행'
          aria-valuemin={0}
          aria-valuemax={SIGNUP_STEP_COUNT}
          aria-valuenow={step + 1}
          className='h-[0.4rem] w-full overflow-hidden rounded-full bg-gray-50'
        >
          <div
            className='bg-blue h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none'
            style={{ width: `${((step + 1) / SIGNUP_STEP_COUNT) * 100}%` }}
          />
        </div>
        <h1 className='title-20-bd mt-[0.8rem] text-black'>회원가입</h1>
      </header>

      <form
        noValidate
        className='flex flex-col gap-[2.4rem]'
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit();
        }}
      >
        <div className='overflow-x-clip'>
          <div
            ref={stepPanelsRef}
            className='flex items-start transition-transform duration-400 ease-out motion-reduce:transition-none'
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            <StepPanel isActive={step === SIGNUP_STEP.EMAIL}>
              <EmailStep {...fieldProps} verification={verification} />
            </StepPanel>
            <StepPanel isActive={step === SIGNUP_STEP.PASSWORD}>
              <PasswordStep {...fieldProps} />
            </StepPanel>
            <StepPanel isActive={step === SIGNUP_STEP.PROFILE}>
              <ProfileStep
                {...fieldProps}
                workDepartments={workDepartments}
                isSubmitting={isSubmitting}
              />
            </StepPanel>
          </div>
        </div>

        <p className='caption-12-md text-center text-gray-400'>
          {'이미 계정이 있나요? '}
          <Link href={ROUTES.LOGIN} className='text-blue underline'>
            로그인
          </Link>
        </p>
      </form>
    </>
  );
}
