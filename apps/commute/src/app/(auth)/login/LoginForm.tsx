'use client';

import { useId } from 'react';
import Link from 'next/link';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import FormField from '../_components/FormField';
import PasswordInput from '../_components/PasswordInput';
import SchoolEmailInput from '../_components/SchoolEmailInput';
import useLoginForm from './_hooks/useLoginForm';

export default function LoginForm() {
  const { formValues, formHandler, formErrors, handleFormSubmit, isSubmitting } = useLoginForm();
  const fieldIdPrefix = useId();
  const emailId = `${fieldIdPrefix}-email`;
  const passwordId = `${fieldIdPrefix}-password`;

  return (
    <form
      noValidate
      className='flex flex-col gap-[2.4rem]'
      onSubmit={(event) => {
        event.preventDefault();
        handleFormSubmit();
      }}
    >
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='학교 메일' htmlFor={emailId} error={formErrors.email?.message}>
          <SchoolEmailInput
            id={emailId}
            name='email'
            value={formValues.email}
            onChange={formHandler.updateEmail}
            autoComplete='username'
            placeholder='아이디@konkuk.ac.kr'
            hasError={formErrors.email !== undefined}
            aria-invalid={formErrors.email !== undefined}
            aria-describedby={`${emailId}-error`}
          />
        </FormField>

        <FormField label='비밀번호' htmlFor={passwordId} error={formErrors.password?.message}>
          <PasswordInput
            id={passwordId}
            name='password'
            value={formValues.password}
            onChange={(event) => formHandler.updatePassword(event.target.value)}
            autoComplete='current-password'
            placeholder='비밀번호를 입력해 주세요'
            hasError={formErrors.password !== undefined}
            aria-invalid={formErrors.password !== undefined}
            aria-describedby={`${passwordId}-error`}
          />
        </FormField>
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        <Button type='submit' color='blue' isLoading={isSubmitting}>
          로그인
        </Button>
        <p className='caption-12-md text-center text-gray-400'>
          {'아직 계정이 없나요? '}
          <Link href={ROUTES.SIGNUP} className='text-blue underline'>
            회원가입
          </Link>
        </p>
      </div>
    </form>
  );
}
