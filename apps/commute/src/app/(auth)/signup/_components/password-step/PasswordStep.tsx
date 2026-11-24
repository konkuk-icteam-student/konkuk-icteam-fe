import { Button } from '@konkuk-icteam-fe/design-system/ui';
import FormField from '../../../_components/FormField';
import PasswordInput from '../../../_components/PasswordInput';
import type { SignupFormState } from '../../_hooks/useSignupForm';

type PasswordStepProps = Pick<SignupFormState, 'formValues' | 'formErrors' | 'formHandlers'>;

export default function PasswordStep({ formValues, formErrors, formHandlers }: PasswordStepProps) {
  return (
    <>
      <FormField label='비밀번호' htmlFor='password' error={formErrors.password}>
        <PasswordInput
          id='password'
          name='password'
          value={formValues.password}
          onChange={(event) => formHandlers.updatePassword(event.target.value)}
          autoComplete='new-password'
          placeholder='영문과 숫자를 섞어 8자 이상'
          hasError={formErrors.password !== undefined}
          aria-invalid={formErrors.password !== undefined}
          aria-describedby='password-error'
        />
      </FormField>

      <FormField
        label='비밀번호 확인'
        htmlFor='password-confirm'
        error={formErrors.passwordConfirm}
      >
        <PasswordInput
          id='password-confirm'
          name='passwordConfirm'
          value={formValues.passwordConfirm}
          onChange={(event) => formHandlers.updatePasswordConfirm(event.target.value)}
          onBlur={formHandlers.checkPasswordConfirm}
          autoComplete='new-password'
          placeholder='비밀번호를 한 번 더 입력해 주세요'
          hasError={formErrors.passwordConfirm !== undefined}
          aria-invalid={formErrors.passwordConfirm !== undefined}
          aria-describedby='password-confirm-error'
        />
      </FormField>

      <Button type='submit' color='blue'>
        다음
      </Button>
    </>
  );
}
