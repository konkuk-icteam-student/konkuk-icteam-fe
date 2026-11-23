import type { EmailVerificationErrorCode } from '../../_apis/emailVerifications';

// 인증번호를 확인하지 못했을 때 인증번호 칸 아래에 보여 줄 글자. 이미 가입된 메일은 메일 칸에서 따로 안내한다
export const VERIFICATION_CODE_ERROR_MESSAGE: Record<
  Exclude<EmailVerificationErrorCode, 'ALREADY_REGISTERED'>,
  string
> = {
  INVALID_CODE: '인증번호가 맞지 않아요.',
  EXPIRED_CODE: '인증번호가 만료됐어요. 다시 받아 주세요.',
};

export const VERIFICATION_CODE_HELP_MESSAGE =
  '메일로 받은 인증번호 6자리를 5분 안에 입력해 주세요.';
