'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { USER_ROLE, type UserRole } from '@/shared/constants/userRole';
import { login } from '../../_apis/auth';
import FormField from '../../_components/FormField';
import PasswordInput from '../../_components/PasswordInput';
import SchoolEmailInput from '../../_components/SchoolEmailInput';
import useFormField from '../../_hooks/useFormField';
import { loginSchema, type LoginFormValues } from '../_lib/loginSchema';

// 로그인에 실패했을 때 비밀번호 칸 아래에 보여 줄 글자. 메일이 없는지 비밀번호가 틀렸는지는 알려 주지 않는다
const INVALID_CREDENTIALS_MESSAGE = '이메일 또는 비밀번호가 틀렸습니다.';

// 로그인한 뒤 역할에 따라 처음 보여 줄 화면
const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [USER_ROLE.STUDENT]: ROUTES.HOME,
  [USER_ROLE.ADMIN]: ROUTES.ADMIN_HOME,
};

// 로그인 폼. 학교 메일과 비밀번호를 받고, 성공하면 역할에 맞는 홈으로, 승인 대기 계정이면 승인 대기 화면으로 보낸다
export default function LoginForm() {
  const router = useRouter();
  // 로그인 뒤 다음 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { formState, handleSubmit, setError } = form;
  // 화면 순서대로 불러야 둘 다 틀렸을 때 메일 칸에 먼저 초점이 간다
  const email = useFormField(form, 'email');
  const password = useFormField(form, 'password');

  const handleValidSubmit = (values: LoginFormValues) => {
    const result = login(values);
    if (result.isSuccess) {
      startNavigation(() => router.push(HOME_ROUTE_BY_ROLE[result.user.role]));
      return;
    }
    if (result.errorCode === 'PENDING_APPROVAL') {
      startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
      return;
    }

    setError('password', { message: INVALID_CREDENTIALS_MESSAGE }, { shouldFocus: true });
  };

  return (
    <form
      noValidate
      className='flex flex-col gap-[2.4rem]'
      onSubmit={(event) => void handleSubmit(handleValidSubmit)(event)}
    >
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='학교 메일' htmlFor={email.inputId} errorProps={email.errorProps}>
          <SchoolEmailInput
            {...email.inputProps}
            name={email.field.name}
            value={email.field.value}
            onValueChange={email.field.onChange}
            onBlur={email.field.onBlur}
            inputMode='email'
            autoComplete='username'
            placeholder='아이디@konkuk.ac.kr'
          />
        </FormField>

        <FormField label='비밀번호' htmlFor={password.inputId} errorProps={password.errorProps}>
          <PasswordInput
            {...password.field}
            {...password.inputProps}
            autoComplete='current-password'
            placeholder='비밀번호를 입력해 주세요'
          />
        </FormField>
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        <Button type='submit' color='blue' isLoading={formState.isSubmitting || isNavigating}>
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
