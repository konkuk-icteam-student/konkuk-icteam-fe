import type {
  ConfirmEmailVerificationRequest,
  ConfirmEmailVerificationResponse,
  EmailVerificationErrorResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
} from '../emailVerifications';
import { findAccountMock } from './auth';

// 인증번호가 유효한 시간 (초)
const VERIFICATION_EXPIRES_IN_SECONDS = 5 * 60;

// 목업은 메일을 보내지 않으므로 인증번호가 늘 같다
const VERIFICATION_CODE_MOCK = '123456';

// 인증번호를 보낸 메일과 그 인증번호가 만료되는 시각(ms). 다시 보내면 새 시각으로 바뀐다
const SENT_VERIFICATIONS_MOCK = new Map<string, number>();

// 인증을 마친 메일과 그때 준 인증 토큰. 가입할 때 이 토큰이 맞는지 본다
const VERIFIED_TOKENS_MOCK = new Map<string, string>();

/**
 * 서버의 인증번호 보내기를 흉내 냅니다. 이미 가입된 메일이면 보내지 않습니다.
 * @param request 인증번호 보내기 요청
 * @param request.email 학교 메일 (소문자)
 * @returns 성공하면 인증번호 유효 시간, 실패하면 오류 코드 (서버가 보낼 JSON 모양)
 * @example sendEmailVerificationMock({ email: 'admin@konkuk.ac.kr' }); // { code: 'ALREADY_REGISTERED' }
 */
export const sendEmailVerificationMock = ({
  email,
}: SendEmailVerificationRequest):
  SendEmailVerificationResponse | EmailVerificationErrorResponse => {
  if (findAccountMock(email)) return { code: 'ALREADY_REGISTERED' };

  SENT_VERIFICATIONS_MOCK.set(email, Date.now() + VERIFICATION_EXPIRES_IN_SECONDS * 1000);
  return { expiresInSeconds: VERIFICATION_EXPIRES_IN_SECONDS };
};

/**
 * 서버의 인증번호 확인을 흉내 냅니다. 보낸 적 없는 메일이면 틀린 번호로, 시간이 지났으면 만료로 봅니다.
 * @param request 인증번호 확인 요청
 * @param request.email 학교 메일 (소문자)
 * @param request.code 메일로 받은 인증번호
 * @returns 맞으면 가입할 때 보낼 인증 토큰, 아니면 오류 코드 (서버가 보낼 JSON 모양)
 * @example confirmEmailVerificationMock({ email, code: '000000' }); // { code: 'INVALID_CODE' }
 */
export const confirmEmailVerificationMock = ({
  email,
  code,
}: ConfirmEmailVerificationRequest):
  ConfirmEmailVerificationResponse | EmailVerificationErrorResponse => {
  const expiresAt = SENT_VERIFICATIONS_MOCK.get(email);
  if (expiresAt === undefined) return { code: 'INVALID_CODE' };
  if (Date.now() > expiresAt) return { code: 'EXPIRED_CODE' };
  if (code !== VERIFICATION_CODE_MOCK) return { code: 'INVALID_CODE' };

  const verificationToken = `verified:${email}:${Date.now()}`;
  VERIFIED_TOKENS_MOCK.set(email, verificationToken);
  return { verificationToken };
};

/**
 * 가입 요청의 인증 토큰이 그 메일로 인증을 마치고 받은 토큰인지 확인합니다.
 * @param email 학교 메일 (소문자)
 * @param verificationToken 가입 요청에 실린 인증 토큰
 * @returns 맞으면 true
 * @example checkVerificationTokenMock('a@konkuk.ac.kr', 'not-a-real-token'); // false
 */
export const checkVerificationTokenMock = (email: string, verificationToken: string) =>
  VERIFIED_TOKENS_MOCK.get(email) === verificationToken;
