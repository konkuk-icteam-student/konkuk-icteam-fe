'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import FormField from '../../../_components/FormField';
import PasswordInput from '../../../_components/PasswordInput';
import useFormField from '../../../_hooks/useFormField';
import type { SignupFormValues } from '../../_lib/signupSchema';

// 2단계: 비밀번호와 확인. [다음](또는 Enter)을 누르면 폼이 두 칸을 검사하고 넘긴다
export default function PasswordStep() {
  const form = useFormContext<SignupFormValues>();
  // 비밀번호를 고쳐 확인과 같아지면 확인 칸의 '서로 달라요'도 바로 사라지게 함께 다시 검사한다
  const password = useFormField(form, 'password', { relatedFields: ['passwordConfirm'] });
  const passwordConfirm = useFormField(form, 'passwordConfirm');

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='비밀번호' htmlFor={password.inputId} errorProps={password.errorProps}>
          <PasswordInput
            {...password.field}
            {...password.inputProps}
            autoComplete='new-password'
            placeholder='영문과 숫자를 섞어 8자 이상'
          />
        </FormField>

        <FormField
          label='비밀번호 확인'
          htmlFor={passwordConfirm.inputId}
          errorProps={passwordConfirm.errorProps}
        >
          <PasswordInput
            {...passwordConfirm.field}
            {...passwordConfirm.inputProps}
            autoComplete='new-password'
            placeholder='비밀번호를 한 번 더 입력해 주세요'
          />
        </FormField>
      </div>

      <Button type='submit' color='blue'>
        다음
      </Button>
    </div>
  );
}
