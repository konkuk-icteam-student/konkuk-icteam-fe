import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/config/routes';
import { USER_ROLE, type UserRole } from '@/shared/constants/userRole';
import { login } from '../../_apis/auth';
import { loginSchema, type LoginFormValues } from '../_lib/loginSchema';

const INVALID_CREDENTIALS_MESSAGE = '이메일 또는 비밀번호가 틀렸습니다.';

const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [USER_ROLE.STUDENT]: ROUTES.HOME,
  [USER_ROLE.ADMIN]: ROUTES.ADMIN_HOME,
};

const useLoginForm = () => {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const {
    handleSubmit,
    setValue,
    reset,
    trigger,
    setError,
    formState: { errors },
    control,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const formData = useWatch({ control });

  const formValues = {
    email: formData.email ?? '',
    password: formData.password ?? '',
  };

  const formErrors = {
    email: errors.email,
    password: errors.password,
  };

  const updateEmail = (value: string) => {
    setValue('email', value, { shouldValidate: true });
  };

  const updatePassword = (value: string) => {
    setValue('password', value, { shouldValidate: true });
  };

  const formHandler = {
    updateEmail,
    updatePassword,
    reset,
    trigger,
  };

  const submitLogin = (values: LoginFormValues) => {
    const result = login(values);
    if (result.isSuccess) {
      startNavigation(() => router.push(HOME_ROUTE_BY_ROLE[result.user.role]));
      return;
    }
    if (result.errorCode === 'PENDING_APPROVAL') {
      startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
      return;
    }

    setError('email', { message: INVALID_CREDENTIALS_MESSAGE });
    setError('password', { message: INVALID_CREDENTIALS_MESSAGE });
  };

  // 스키마로 검사한 뒤 맞으면 로그인한다
  const handleFormSubmit = () => void handleSubmit(submitLogin)();

  return {
    formValues,
    formHandler,
    formErrors,
    handleFormSubmit,
    isSubmitting: isNavigating,
  };
};

export default useLoginForm;
