import { useState } from 'react';
import {
  confirmEmailVerification,
  sendEmailVerification,
  type EmailVerificationErrorCode,
} from '../../_apis/emailVerifications';
import { verificationCodeSchema } from '../_lib/signupSchema';
import useVerificationTimer from './useVerificationTimer';

// 인증번호를 확인하지 못했을 때 인증번호 칸 아래에 보여 줄 글자. 이미 가입된 메일은 메일 칸에서 따로 안내한다
const CONFIRM_ERROR_MESSAGE: Record<
  Exclude<EmailVerificationErrorCode, 'ALREADY_REGISTERED'>,
  string
> = {
  INVALID_CODE: '인증번호가 맞지 않아요.',
  EXPIRED_CODE: '인증번호가 만료됐어요. 다시 받아 주세요.',
};

// 회원가입 메일 인증. 인증번호 보내기 → 확인 순서이고, 확인하면 가입할 때 보낼 인증 토큰을 받는다
const useEmailVerification = () => {
  const timer = useVerificationTimer();
  // 인증번호를 보낸 메일. 확인할 때 이 메일로 확인한다
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState<string>();
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // 메일을 고치면 이전 메일로 한 인증은 쓸 수 없으니 처음으로 돌린다
  const reset = () => {
    timer.stop();
    setSentEmail(null);
    setVerificationCode('');
    setCodeError(undefined);
    setVerificationToken(null);
    setIsAlreadyRegistered(false);
  };

  const markAlreadyRegistered = () => {
    reset();
    setIsAlreadyRegistered(true);
  };

  // email은 검사를 마친 학교 메일 (소문자)
  const send = (email: string) => {
    const result = sendEmailVerification({ email });
    if (!result.isSuccess) {
      markAlreadyRegistered();
      return;
    }

    reset();
    setSentEmail(email);
    timer.start(result.expiresAt);
  };

  const confirm = () => {
    if (!sentEmail) return;

    const parsedCode = verificationCodeSchema.safeParse(verificationCode);
    if (!parsedCode.success) {
      setCodeError(parsedCode.error.issues[0]?.message);
      return;
    }

    const result = confirmEmailVerification({ email: sentEmail, code: parsedCode.data });
    if (result.isSuccess) {
      timer.stop();
      setCodeError(undefined);
      setVerificationToken(result.verificationToken);
      return;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') {
      markAlreadyRegistered();
      return;
    }

    setCodeError(CONFIRM_ERROR_MESSAGE[result.errorCode]);
  };

  const changeVerificationCode = (nextCode: string) => {
    setVerificationCode(nextCode);
    setCodeError(undefined);
  };

  return {
    isSent: sentEmail !== null,
    isVerified: verificationToken !== null,
    isAlreadyRegistered,
    verificationToken,
    verificationCode,
    codeError,
    isExpired: timer.isExpired,
    remainingTimeLabel: timer.remainingTimeLabel,
    send,
    confirm,
    reset,
    markAlreadyRegistered,
    changeVerificationCode,
  };
};

export default useEmailVerification;
