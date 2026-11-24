import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/config/routes';
import { signup } from '../../_apis/auth';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';
import { SIGNUP_STEP, type SignupStep } from '../_constants/signupSteps';
import { signupFieldsSchema, type SignupFormValues } from '../_lib/signupSchema';
import useEmailVerification from './useEmailVerification';

const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 서로 달라요.';

type FocusableField = keyof SignupFormValues | 'passwordConfirm' | 'verificationCode';

// 칸의 name은 값 이름과 같다. 근무 부서는 입력칸이 없어 Dropdown의 버튼에 초점을 둔다
const focusField = (field: FocusableField) =>
  (field === 'workDepartmentId'
    ? document.querySelector<HTMLElement>('#work-department button')
    : document.getElementsByName(field)[0]
  )?.focus();

type UseSignupFormParams = {
  step: SignupStep;
  goNextStep: () => void;
};

const useSignupForm = ({ step, goNextStep }: UseSignupFormParams) => {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const { send, confirm, reset, verificationToken, ...verification } = useEmailVerification();
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // 확인 칸을 벗어나거나 [다음]을 누르기 전에는 '서로 달라요'를 보이지 않는다
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);

  const {
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFieldsSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      workDepartmentId: undefined,
    },
  });

  const formData = useWatch({ control });
  const isPasswordConfirmed = passwordConfirm === (formData.password ?? '');

  const updateEmail = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    reset();
  };

  const updatePassword = (password: string) => {
    setValue('password', password, { shouldValidate: true });
  };

  const updatePasswordConfirm = (nextPasswordConfirm: string) => {
    setPasswordConfirm(nextPasswordConfirm);
  };

  const checkPasswordConfirm = () => {
    setIsConfirmChecked(true);
  };

  const updateName = (name: string) => {
    setValue('name', name, { shouldValidate: true });
  };

  const updateWorkDepartment = (workDepartmentId: number) => {
    setValue('workDepartmentId', workDepartmentId, { shouldValidate: true });
  };

  const sendCode = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) {
      focusField('email');
      return;
    }

    if (send(schoolEmailSchema.parse(getValues('email')))) focusField('verificationCode');
  };

  // 두 칸의 오류를 함께 보이도록 둘 다 검사한 뒤 넘어간다
  const goToProfileStep = async () => {
    setIsConfirmChecked(true);
    const isPasswordValid = await trigger('password');
    if (!isPasswordValid) focusField('password');
    else if (!isPasswordConfirmed) focusField('passwordConfirm');
    else goNextStep();
  };

  const submitSignup = ({ name, email, password, workDepartmentId }: SignupFormValues) => {
    if (!verificationToken) return;

    // TODO: 가입 API 연결 후 실패하면 오류 메시지 표시
    const result = signup({ name, email, password, workDepartmentId, verificationToken });
    if (result.isSuccess) startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
  };

  // Enter와 [다음]·[가입하기]는 모두 폼 제출로 들어온다. 단계마다 할 일이 다르다
  const focusFirstProfileError = (fieldErrors: FieldErrors<SignupFormValues>) => {
    const firstErrorField = (['name', 'workDepartmentId'] as const).find(
      (field) => fieldErrors[field] !== undefined,
    );
    if (firstErrorField) focusField(firstErrorField);
  };

  const submitByStep: Record<SignupStep, () => void> = {
    [SIGNUP_STEP.EMAIL]: () => (verificationToken ? goNextStep() : void sendCode()),
    [SIGNUP_STEP.PASSWORD]: () => void goToProfileStep(),
    [SIGNUP_STEP.PROFILE]: () => void handleSubmit(submitSignup, focusFirstProfileError)(),
  };

  const handleFormSubmit = () => submitByStep[step]();

  const formValues = {
    email: formData.email ?? '',
    password: formData.password ?? '',
    passwordConfirm,
    name: formData.name ?? '',
    workDepartmentId: formData.workDepartmentId,
  };

  const formErrors = {
    email: errors.email?.message,
    password: errors.password?.message,
    passwordConfirm:
      isConfirmChecked && !isPasswordConfirmed ? PASSWORD_MISMATCH_MESSAGE : undefined,
    name: errors.name?.message,
    workDepartmentId: errors.workDepartmentId?.message,
  };

  const formHandlers = {
    updateEmail,
    updatePassword,
    updatePasswordConfirm,
    checkPasswordConfirm,
    updateName,
    updateWorkDepartment,
    sendCode,
    confirmCode: confirm,
  };

  return {
    formValues,
    formErrors,
    formHandlers,
    verification,
    handleFormSubmit,
    isSubmitting: isNavigating,
  };
};

export type SignupFormState = ReturnType<typeof useSignupForm>;

export default useSignupForm;
