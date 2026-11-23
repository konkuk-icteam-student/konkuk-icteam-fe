'use client';

import { useId } from 'react';
import { FormProvider } from 'react-hook-form';
import { Message } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../_apis/workDepartments';
import { SIGNUP_STEP, SIGNUP_STEPS } from '../_constants/signupSteps';
import useSignupForm from '../_hooks/useSignupForm';
import EmailStep from './email-step/EmailStep';
import PasswordStep from './password-step/PasswordStep';
import ProfileStep from './profile-step/ProfileStep';
import SignupProgress from './SignupProgress';

type SignupFormProps = {
  workDepartments: WorkDepartment[];
};

export default function SignupForm({ workDepartments }: SignupFormProps) {
  const { form, step, goBack, handleFormSubmit, signupError, isSubmitting, emailStep } =
    useSignupForm();
  const titleId = useId();
  const currentStep = SIGNUP_STEPS[step];

  return (
    <FormProvider {...form}>
      <form
        noValidate
        aria-labelledby={titleId}
        className='flex flex-col gap-[3.2rem]'
        onSubmit={handleFormSubmit}
      >
        <div className='flex flex-col gap-[2.4rem]'>
          <SignupProgress currentStep={step} totalSteps={SIGNUP_STEPS.length} onBack={goBack} />
          <header className='flex flex-col gap-[0.8rem]'>
            <p className='caption-12-md text-gray-400'>회원가입</p>
            <h1 id={titleId} className='title-20-bd text-black'>
              {currentStep?.title}
            </h1>
            <p className='caption-14-md text-gray-400'>{currentStep?.description}</p>
          </header>
          <Message id={`${titleId}-signup-error`} message={signupError} variant='error' />
        </div>

        {step === SIGNUP_STEP.EMAIL && <EmailStep {...emailStep} />}
        {step === SIGNUP_STEP.PASSWORD && <PasswordStep />}
        {step === SIGNUP_STEP.PROFILE && (
          <ProfileStep workDepartments={workDepartments} isSubmitting={isSubmitting} />
        )}
      </form>
    </FormProvider>
  );
}
