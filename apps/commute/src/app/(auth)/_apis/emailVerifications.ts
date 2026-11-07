import { confirmEmailVerificationMock, sendEmailVerificationMock } from './mock/emailVerifications';

export type SendEmailVerificationRequest = {
  // 학교 메일 (@konkuk.ac.kr)
  email: string;
};

// 인증번호를 보내면 서버가 보내는 본문 (200). 인증번호가 몇 초 동안 유효한지
export type SendEmailVerificationResponse = {
  expiresInSeconds: number;
};

export type ConfirmEmailVerificationRequest = {
  email: string;
  // 메일로 받은 인증번호 (숫자 6자리)
  code: string;
};

// 인증번호가 맞으면 서버가 보내는 본문 (200). 가입할 때 이 토큰을 함께 보낸다
export type ConfirmEmailVerificationResponse = {
  verificationToken: string;
};

// 메일 인증에 실패한 까닭
// - ALREADY_REGISTERED: 이미 가입된 메일
// - INVALID_CODE: 인증번호가 틀림
// - EXPIRED_CODE: 인증번호를 받은 지 5분이 지남. 다시 받아야 한다
export type EmailVerificationErrorCode = 'ALREADY_REGISTERED' | 'INVALID_CODE' | 'EXPIRED_CODE';

// 메일 인증에 실패하면 서버가 보내는 본문
export type EmailVerificationErrorResponse = {
  code: EmailVerificationErrorCode;
};

// 화면이 받는 인증번호 보내기 결과. 만료 시각은 받은 때부터 유효 시간을 더해 화면 시계로 정한다
export type SendEmailVerificationResult =
  | { isSuccess: true; expiresAt: Date }
  | { isSuccess: false; errorCode: EmailVerificationErrorCode };

/**
 * POST /auth/email-verifications
 * 학교 메일로 인증번호를 보낸다. 이미 가입된 메일이면 보내지 않는다
 */
export const sendEmailVerification = (
  request: SendEmailVerificationRequest,
): SendEmailVerificationResult => {
  const response = sendEmailVerificationMock(request);

  return 'code' in response
    ? { isSuccess: false, errorCode: response.code }
    : { isSuccess: true, expiresAt: new Date(Date.now() + response.expiresInSeconds * 1000) };
};

// 화면이 받는 인증번호 확인 결과
export type ConfirmEmailVerificationResult =
  | { isSuccess: true; verificationToken: string }
  | { isSuccess: false; errorCode: EmailVerificationErrorCode };

/**
 * POST /auth/email-verifications/confirm
 * 메일로 받은 인증번호를 확인한다. 맞으면 가입할 때 보낼 인증 토큰을 돌려준다
 */
export const confirmEmailVerification = (
  request: ConfirmEmailVerificationRequest,
): ConfirmEmailVerificationResult => {
  const response = confirmEmailVerificationMock(request);

  return 'code' in response
    ? { isSuccess: false, errorCode: response.code }
    : { isSuccess: true, verificationToken: response.verificationToken };
};
