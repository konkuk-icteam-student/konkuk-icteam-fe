import { useEffect, useRef, useState } from 'react';
import { SIGNUP_STEP, type SignupStep } from '../_constants/signupSteps';

const useSignupStep = () => {
  const [step, setStep] = useState<SignupStep>(SIGNUP_STEP.EMAIL);
  const stepPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === SIGNUP_STEP.EMAIL) return;

    stepPanelsRef.current?.children[step]
      ?.querySelector<HTMLElement>('input, button')
      ?.focus({ preventScroll: true });
  }, [step]);

  const goNextStep = () => setStep((prevStep) => (prevStep + 1) as SignupStep);

  return { step, stepPanelsRef, goNextStep };
};

export default useSignupStep;
