'use client';

import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Message } from '@konkuk-icteam-fe/design-system/ui';
import PasswordInput from '../../../_components/PasswordInput';
import type { SignupFormValues } from '../../_lib/signupSchema';

// 2단계: 비밀번호와 확인. [다음](또는 Enter)을 누르면 폼이 두 칸을 검사하고 넘긴다
export default function PasswordStep() {
  const { formState, register } = useFormContext<SignupFormValues>();
  const fieldIdPrefix = useId();
  const passwordError = formState.errors.password?.message;
  const passwordConfirmError = formState.errors.passwordConfirm?.message;

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password`} className='font-14-bd text-black'>
            비밀번호
          </label>
          <div className='flex flex-col'>
            <PasswordInput
              id={`${fieldIdPrefix}-password`}
              autoComplete='new-password'
              placeholder='영문과 숫자를 섞어 8자 이상'
              hasError={passwordError !== undefined}
              aria-invalid={passwordError !== undefined}
              aria-describedby={`${fieldIdPrefix}-password-error`}
              {...register('password')}
            />
            <Message
              id={`${fieldIdPrefix}-password-error`}
              message={passwordError}
              variant='error'
            />
          </div>
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password-confirm`} className='font-14-bd text-black'>
            비밀번호 확인
          </label>
          <div className='flex flex-col'>
            <PasswordInput
              id={`${fieldIdPrefix}-password-confirm`}
              autoComplete='new-password'
              placeholder='비밀번호를 한 번 더 입력해 주세요'
              hasError={passwordConfirmError !== undefined}
              aria-invalid={passwordConfirmError !== undefined}
              aria-describedby={`${fieldIdPrefix}-password-confirm-error`}
              {...register('passwordConfirm')}
            />
            <Message
              id={`${fieldIdPrefix}-password-confirm-error`}
              message={passwordConfirmError}
              variant='error'
            />
          </div>
        </div>
      </div>

      <Button type='submit' color='blue'>
        다음
      </Button>
    </div>
  );
}
