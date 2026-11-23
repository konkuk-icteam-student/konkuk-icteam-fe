import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/config/routes';
import { signup } from '../../_apis/auth';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';
import { SIGNUP_STEP, SIGNUP_STEPS } from '../_constants/signupSteps';
import { VERIFICATION_CODE_ERROR_MESSAGE } from '../_constants/verificationCodeMessages';
import { signupSchema, type SignupFormValues } from '../_lib/signupSchema';
import useEmailVerification from './useEmailVerification';

// 지나간 단계의 칸은 화면에서 빠져도 값은 폼에 남는다
const useSignupForm = () => {
  const router = useRouter();
  // 가입 뒤 승인 대기 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const [step, setStep] = useState<number>(SIGNUP_STEP.EMAIL);
  // 단계가 바뀐 때만 초점을 옮기려고 직전 단계를 기억한다 (처음 열 때는 옮기지 않는다)
  const previousStepRef = useRef(step);
  const emailVerification = useEmailVerification();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    // 입력할 때마다 검사해, 고치면 오류 문구가 바로 사라지고 deps로 이은 칸도 함께 검사된다
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    },
  });
  const { formState, clearErrors, getValues, handleSubmit, setError, setFocus, setValue, trigger } =
    form;

  useEffect(() => {
    if (previousStepRef.current === step) return;

    previousStepRef.current = step;
    const firstField = SIGNUP_STEPS[step]?.fields[0];
    if (firstField) setFocus(firstField);
  }, [step, setFocus]);

  // 이전 메일로 받은 인증번호와 인증은 더 쓸 수 없으니 인증번호 칸까지 비운다
  const resetVerification = () => {
    emailVerification.reset();
    setValue('verificationCode', '');
    clearErrors('verificationCode');
  };

  // 메일 칸만 먼저 검사하고, 맞으면 그 메일(소문자)로 인증번호를 보낸다
  const sendCode = async () => {
    const isEmailValid = await trigger('email', { shouldFocus: true });
    if (!isEmailValid) return;

    resetVerification();
    emailVerification.send(schoolEmailSchema.parse(getValues('email')));
  };

  // 만료된 번호는 서버에 보내지 않는다 (버튼이 꺼져도 Enter로 부를 수 있다)
  const confirmCode = async () => {
    if (!emailVerification.isSent || emailVerification.isExpired) return;

    const isCodeValid = await trigger('verificationCode', { shouldFocus: true });
    if (!isCodeValid) return;

    const result = emailVerification.confirm(getValues('verificationCode'));
    if (!result) return;
    if (result.isSuccess) {
      setStep(SIGNUP_STEP.PASSWORD);
      return;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') {
      setValue('verificationCode', '');
      return;
    }

    setError('verificationCode', { message: VERIFICATION_CODE_ERROR_MESSAGE[result.errorCode] });
  };

  const goToProfileStep = async () => {
    const isPasswordValid = await trigger(['password', 'passwordConfirm'], { shouldFocus: true });
    if (isPasswordValid) setStep(SIGNUP_STEP.PROFILE);
  };

  const submitSignup = (values: SignupFormValues) => {
    const { verificationToken } = emailVerification;
    if (!verificationToken) {
      setStep(SIGNUP_STEP.EMAIL);
      return;
    }

    const result = signup({
      name: values.name,
      email: values.email,
      password: values.password,
      workDepartmentId: values.workDepartmentId,
      verificationToken,
    });
    if (result.isSuccess) {
      startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
      return;
    }

    // 메일 문제는 메일 단계에서 다시 해야 하므로 그 단계로 돌아간다
    setStep(SIGNUP_STEP.EMAIL);
    resetVerification();
    if (result.errorCode === 'ALREADY_REGISTERED') {
      emailVerification.markAlreadyRegistered();
      return;
    }

    setError('root', { message: '메일 인증이 풀렸어요. 메일을 다시 인증해 주세요.' });
  };

  // 지나간 단계의 칸이 틀렸으면(드문 경우) 그 단계로 돌아가 보여 준다
  const showInvalidStep = (errors: FieldErrors<SignupFormValues>) => {
    const errorStep = SIGNUP_STEPS.findIndex(({ fields }) =>
      fields.some((field) => errors[field] !== undefined),
    );
    if (errorStep !== -1 && errorStep < step) setStep(errorStep);
  };

  // Enter와 [다음]·[가입하기]는 모두 폼 제출로 들어온다. 단계마다 할 일이 다르다
  const submitByStep: Record<number, (event: React.FormEvent<HTMLFormElement>) => void> = {
    [SIGNUP_STEP.EMAIL]: () => {
      if (emailVerification.isVerified) setStep(SIGNUP_STEP.PASSWORD);
      else void sendCode();
    },
    [SIGNUP_STEP.PASSWORD]: () => void goToProfileStep(),
    [SIGNUP_STEP.PROFILE]: (event) => void handleSubmit(submitSignup, showInvalidStep)(event),
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitByStep[step]?.(event);
  };

  return {
    form,
    step,
    goBack: step > SIGNUP_STEP.EMAIL ? () => setStep(step - 1) : undefined,
    handleFormSubmit,
    signupError: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting || isNavigating,
    emailStep: {
      verification: {
        isSent: emailVerification.isSent,
        isVerified: emailVerification.isVerified,
        isAlreadyRegistered: emailVerification.isAlreadyRegistered,
        isExpired: emailVerification.isExpired,
        remainingTimeLabel: emailVerification.remainingTimeLabel,
      },
      onEmailChange: resetVerification,
      onSendCode: () => void sendCode(),
      onConfirmCode: () => void confirmCode(),
    },
  };
};

export default useSignupForm;
