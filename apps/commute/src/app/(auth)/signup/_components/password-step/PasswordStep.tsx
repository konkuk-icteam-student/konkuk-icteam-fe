'use client';

import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import FormField from '../../../_components/FormField';
import PasswordInput from '../../../_components/PasswordInput';
import type { SignupFormValues } from '../../_lib/signupSchema';

export default function PasswordStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const fieldIdPrefix = useId();
  const passwordId = `${fieldIdPrefix}-password`;
  const passwordConfirmId = `${fieldIdPrefix}-password-confirm`;
  const passwordError = errors.password?.message;
  const passwordConfirmError = errors.passwordConfirm?.message;

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='비밀번호' htmlFor={passwordId} error={passwordError}>
          <PasswordInput
            id={passwordId}
            // 비밀번호를 고쳐 확인과 같아지면 확인 칸의 '서로 달라요'도 바로 사라지게 함께 다시 검사한다
            {...register('password', { deps: ['passwordConfirm'] })}
            autoComplete='new-password'
            placeholder='영문과 숫자를 섞어 8자 이상'
            hasError={passwordError !== undefined}
            aria-invalid={passwordError !== undefined}
            aria-describedby={`${passwordId}-error`}
          />
        </FormField>

        <FormField label='비밀번호 확인' htmlFor={passwordConfirmId} error={passwordConfirmError}>
          <PasswordInput
            id={passwordConfirmId}
            {...register('passwordConfirm')}
            autoComplete='new-password'
            placeholder='비밀번호를 한 번 더 입력해 주세요'
            hasError={passwordConfirmError !== undefined}
            aria-invalid={passwordConfirmError !== undefined}
            aria-describedby={`${passwordConfirmId}-error`}
          />
        </FormField>
      </div>

      <Button type='submit' color='blue'>
        다음
      </Button>
    </div>
  );
}
