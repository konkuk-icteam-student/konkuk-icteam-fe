import type { SignupErrorResponse, SignupRequest } from '../auth';
import { addSignedUpAccountMock, findAccountMock } from './auth';
import { checkVerificationTokenMock } from './emailVerifications';

/**
 * 서버의 회원가입을 흉내 냅니다.
 * @param request 회원가입 요청
 * @returns 가입되면 undefined(본문 없음), 아니면 오류 코드 (서버가 보낼 JSON 모양)
 * @example signupMock({ ...request, verificationToken: 'not-a-real-token' }); // { code: 'EMAIL_NOT_VERIFIED' }
 */
export const signupMock = ({
  name,
  email,
  password,
  verificationToken,
}: SignupRequest): SignupErrorResponse | undefined => {
  if (!checkVerificationTokenMock(email, verificationToken)) return { code: 'EMAIL_NOT_VERIFIED' };
  if (findAccountMock(email)) return { code: 'ALREADY_REGISTERED' };

  addSignedUpAccountMock({ email, password, name });
  return undefined;
};
