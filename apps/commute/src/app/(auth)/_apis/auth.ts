import type { UserRole } from '@/shared/constants/userRole';
import { loginMock } from './mock/auth';
import signupMock from './mock/signup';

export type LoginRequest = {
  // 학교 메일 (@konkuk.ac.kr)
  email: string;
  password: string;
};

// 로그인한 사용자
export type LoginUser = {
  userId: number;
  name: string;
  role: UserRole;
};

// 로그인에 성공하면 서버가 보내는 본문 (200)
export type LoginResponse = LoginUser;

// 로그인에 실패한 까닭
// - INVALID_CREDENTIALS: 메일이 없거나 비밀번호가 틀림. 어느 쪽인지 알려 주지 않는다
// - PENDING_APPROVAL: 메일·비밀번호는 맞지만 관리자가 아직 가입을 승인하지 않음
export type LoginErrorCode = 'INVALID_CREDENTIALS' | 'PENDING_APPROVAL';

// 로그인에 실패하면 서버가 보내는 본문 (401·403)
export type LoginErrorResponse = {
  code: LoginErrorCode;
};

// 화면이 받는 로그인 결과. 성공·실패 응답을 한 모양으로 묶는다
export type LoginResult =
  { isSuccess: true; user: LoginUser } | { isSuccess: false; errorCode: LoginErrorCode };

/**
 * POST /auth/login
 * 학교 메일과 비밀번호로 로그인한다. 성공하면 사용자를, 실패하면 그 까닭을 돌려준다
 */
export const login = (request: LoginRequest): LoginResult => {
  const response = loginMock(request);

  return 'code' in response
    ? { isSuccess: false, errorCode: response.code }
    : { isSuccess: true, user: response };
};

export type SignupRequest = {
  name: string;
  // 학교 메일 (@konkuk.ac.kr)
  email: string;
  password: string;
  // 근무 부서 목록(GET /auth/work-departments)에서 고른 부서
  workDepartmentId: number;
  // 메일 인증을 마치고 받은 토큰 (POST /auth/email-verifications/confirm)
  verificationToken: string;
};

// 가입에 실패한 까닭
// - EMAIL_NOT_VERIFIED: 메일 인증을 하지 않았거나 인증 토큰이 맞지 않음
// - ALREADY_REGISTERED: 인증한 뒤 같은 메일로 이미 가입됨 (가입 요청이 겹친 경우)
export type SignupErrorCode = 'EMAIL_NOT_VERIFIED' | 'ALREADY_REGISTERED';

// 가입에 실패하면 서버가 보내는 본문. 가입되면 본문 없이 201을 보낸다
export type SignupErrorResponse = {
  code: SignupErrorCode;
};

// 화면이 받는 가입 결과
export type SignupResult = { isSuccess: true } | { isSuccess: false; errorCode: SignupErrorCode };

/**
 * POST /auth/signup
 * 근로장학생 계정을 만든다. 가입한 계정은 관리자가 승인할 때까지 승인 대기 상태다
 */
export const signup = (request: SignupRequest): SignupResult => {
  const errorResponse = signupMock(request);

  return errorResponse ? { isSuccess: false, errorCode: errorResponse.code } : { isSuccess: true };
};
