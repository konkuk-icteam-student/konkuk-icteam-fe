import { useState } from 'react';
import {
  confirmEmailVerification,
  sendEmailVerification,
  type EmailVerificationErrorCode,
} from '../../_apis/emailVerifications';
import { verificationCodeSchema } from '../_lib/signupSchema';
import useVerificationTimer from './useVerificationTimer';

// 이미 가입된 메일은 인증번호 칸이 아니라 메일 칸에서 따로 안내한다
const VERIFICATION_CODE_ERROR_MESSAGE: Record<
  Exclude<EmailVerificationErrorCode, 'ALREADY_REGISTERED'>,
  string
> = {
  INVALID_CODE: '인증번호가 맞지 않아요.',
  EXPIRED_CODE: '인증번호가 만료됐어요. 다시 받아 주세요.',
};

const getCodeFormatError = (code: string) =>
  verificationCodeSchema.safeParse(code).error?.issues[0]?.message;

const useEmailVerification = () => {
  const timer = useVerificationTimer();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>();

  const reset = () => {
    timer.stop();
    setSentEmail(null);
    setVerificationToken(null);
    setIsAlreadyRegistered(false);
    setCode('');
    setCodeError(undefined);
  };

  const markAlreadyRegistered = () => {
    reset();
    setIsAlreadyRegistered(true);
  };

  // 칠 때마다 형식 오류를 띄우지 않고, 고치기 시작하면 이전 오류만 지운다. 형식은 확인할 때 본다
  const updateCode = (nextCode: string) => {
    setCode(nextCode);
    setCodeError(undefined);
  };

  // email은 검사를 마친 학교 메일 (소문자). 보냈으면 true
  const send = (email: string) => {
    const result = sendEmailVerification({ email });
    if (!result.isSuccess) {
      markAlreadyRegistered();
      return false;
    }

    reset();
    setSentEmail(email);
    timer.start(result.expiresAt);
    return true;
  };

  const confirm = () => {
    if (!sentEmail || timer.isExpired) return;

    const formatError = getCodeFormatError(code);
    if (formatError) {
      setCodeError(formatError);
      return;
    }

    const result = confirmEmailVerification({ email: sentEmail, code });
    if (result.isSuccess) {
      timer.stop();
      setVerificationToken(result.verificationToken);
      return;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') {
      markAlreadyRegistered();
      return;
    }

    setCodeError(VERIFICATION_CODE_ERROR_MESSAGE[result.errorCode]);
  };

  return {
    code,
    codeError: timer.isExpired ? VERIFICATION_CODE_ERROR_MESSAGE.EXPIRED_CODE : codeError,
    isSent: sentEmail !== null,
    verificationToken,
    isVerified: verificationToken !== null,
    isAlreadyRegistered,
    isExpired: timer.isExpired,
    remainingTimeLabel: timer.remainingTimeLabel,
    updateCode,
    send,
    confirm,
    reset,
  };
};

export default useEmailVerification;
