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

// 인증번호 칸 아래에 오류가 없을 때 보여 줄 안내
const CODE_HELP_MESSAGE = '메일로 받은 인증번호 6자리를 5분 안에 입력해 주세요.';

// 회원가입 메일 인증. 인증번호 보내기 → 확인 순서이고, 확인하면 가입할 때 보낼 인증 토큰을 받는다
const useEmailVerification = () => {
  const timer = useVerificationTimer();
  // 인증번호를 보낸 메일. 확인할 때 이 메일로 확인한다
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  // [확인]을 눌렀을 때 생긴 오류 (번호 형식·틀린 번호)
  const [confirmError, setConfirmError] = useState<string>();
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // 메일을 고치면 이전 메일로 한 인증은 쓸 수 없으니 처음으로 돌린다
  const reset = () => {
    timer.stop();
    setSentEmail(null);
    setVerificationCode('');
    setConfirmError(undefined);
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

  // 인증을 마쳤으면 true. 만료된 번호는 서버에 보내지 않는다 (버튼이 꺼져도 Enter로 부를 수 있다)
  const confirm = () => {
    if (!sentEmail || timer.isExpired) return false;

    const parsedCode = verificationCodeSchema.safeParse(verificationCode);
    if (!parsedCode.success) {
      setConfirmError(parsedCode.error.issues[0]?.message);
      return false;
    }

    const result = confirmEmailVerification({ email: sentEmail, code: parsedCode.data });
    if (result.isSuccess) {
      timer.stop();
      setConfirmError(undefined);
      setVerificationToken(result.verificationToken);
      return true;
    }
    if (result.errorCode === 'ALREADY_REGISTERED') {
      markAlreadyRegistered();
      return false;
    }

    setConfirmError(CONFIRM_ERROR_MESSAGE[result.errorCode]);
    return false;
  };

  const changeVerificationCode = (nextCode: string) => {
    setVerificationCode(nextCode);
    setConfirmError(undefined);
  };

  // 인증번호 칸 아래 글자. 만료됐으면 만료 안내, 아니면 [확인] 오류, 오류가 없으면 도움말
  const codeError = timer.isExpired ? CONFIRM_ERROR_MESSAGE.EXPIRED_CODE : confirmError;
  const codeHelp = codeError ? undefined : CODE_HELP_MESSAGE;

  return {
    isSent: sentEmail !== null,
    isVerified: verificationToken !== null,
    isAlreadyRegistered,
    verificationToken,
    verificationCode,
    codeError,
    codeHelp,
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
