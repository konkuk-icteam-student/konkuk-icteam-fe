export type SendEmailVerificationRequest = {
  email: string;
};

// 인증번호를 보내면 서버가 보내는 본문 (200). 인증번호가 몇 초 동안 유효한지
export type SendEmailVerificationResponse = {
  expiresInSeconds: number;
};

export type ConfirmEmailVerificationRequest = {
  email: string;
  // 메일로 받은 인증번호 (영문·숫자 6자리)
  // TODO: 인증번호 형식은 서버 확인 후 변경 필요
  code: string;
};

// 인증번호가 맞으면 서버가 보내는 본문 (200). 가입할 때 이 토큰을 함께 보낸다
export type ConfirmEmailVerificationResponse = {
  verificationToken: string;
};

// - ALREADY_REGISTERED: 이미 가입된 메일
// - INVALID_CODE: 인증번호가 틀림
// - EXPIRED_CODE: 인증번호를 받은 지 5분이 지남. 다시 받아야 한다
export type EmailVerificationErrorCode = 'ALREADY_REGISTERED' | 'INVALID_CODE' | 'EXPIRED_CODE';

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
export const sendEmailVerification: (
  request: SendEmailVerificationRequest,
) => SendEmailVerificationResult = () => ({
  isSuccess: true,
  // 서버가 없어 늘 보낸 것으로 본다. 인증번호는 5분 동안 유효하다
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
});

export type ConfirmEmailVerificationResult =
  | { isSuccess: true; verificationToken: string }
  | { isSuccess: false; errorCode: EmailVerificationErrorCode };

/**
 * POST /auth/email-verifications/confirm
 * 메일로 받은 인증번호를 확인한다. 맞으면 가입할 때 보낼 인증 토큰을 돌려준다
 */
export const confirmEmailVerification: (
  request: ConfirmEmailVerificationRequest,
) => ConfirmEmailVerificationResult = () => ({
  isSuccess: true,
  // 서버가 없어 형식만 맞으면 어떤 번호든 맞은 것으로 본다
  verificationToken: 'verification-token-mock',
});
