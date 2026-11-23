import { useState } from 'react';
import { confirmEmailVerification, sendEmailVerification } from '../../_apis/emailVerifications';
import useVerificationTimer from './useVerificationTimer';

// 인증번호 칸의 값과 오류는 폼이 갖고, 여기서는 보낸 메일·남은 시간·인증 토큰만 갖는다
const useEmailVerification = () => {
  const timer = useVerificationTimer();
  // 인증번호를 보낸 메일. 확인할 때 이 메일로 확인한다
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const reset = () => {
    timer.stop();
    setSentEmail(null);
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

  // code는 형식 검사를 마친 인증번호. 맞으면 타이머를 멈추고 인증 토큰을 둔다
  const confirm = (code: string) => {
    if (!sentEmail) return undefined;

    const result = confirmEmailVerification({ email: sentEmail, code });
    if (result.isSuccess) {
      timer.stop();
      setVerificationToken(result.verificationToken);
      return result;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') markAlreadyRegistered();

    return result;
  };

  return {
    isSent: sentEmail !== null,
    isVerified: verificationToken !== null,
    isAlreadyRegistered,
    isExpired: timer.isExpired,
    remainingTimeLabel: timer.remainingTimeLabel,
    verificationToken,
    send,
    confirm,
    reset,
    markAlreadyRegistered,
  };
};

export default useEmailVerification;
