import { MY_USER_ID } from '@/app/(student)/_apis/mock/me';
import { USER_ROLE, type UserRole } from '@/shared/constants/userRole';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  userId: number;
  name: string;
  role: UserRole;
};

export type LoginResponse = LoginUser;

// - INVALID_CREDENTIALS: 메일이 없거나 비밀번호가 틀림. 어느 쪽인지 알려 주지 않는다
// - PENDING_APPROVAL: 메일·비밀번호는 맞지만 관리자가 아직 가입을 승인하지 않음
export type LoginErrorCode = 'INVALID_CREDENTIALS' | 'PENDING_APPROVAL';

// 로그인에 실패하면 서버가 보내는 본문 (401·403)
export type LoginErrorResponse = {
  code: LoginErrorCode;
};

export type LoginResult =
  { isSuccess: true; user: LoginUser } | { isSuccess: false; errorCode: LoginErrorCode };

/**
 * POST /auth/login
 */
export const login: (request: LoginRequest) => LoginResult = () => ({
  isSuccess: true,
  // 서버가 없어 늘 근로학생 화면 목업의 본인(홍길동)으로 로그인한다
  user: { userId: MY_USER_ID, name: '홍길동', role: USER_ROLE.STUDENT },
});

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  // 근무 부서 목록(GET /auth/work-departments)에서 고른 부서
  workDepartmentId: number;
  // 메일 인증을 마치고 받은 토큰 (POST /auth/email-verifications/confirm)
  verificationToken: string;
};

// - EMAIL_NOT_VERIFIED: 메일 인증을 하지 않았거나 인증 토큰이 맞지 않음
// - ALREADY_REGISTERED: 인증한 뒤 같은 메일로 이미 가입됨 (가입 요청이 겹친 경우)
export type SignupErrorCode = 'EMAIL_NOT_VERIFIED' | 'ALREADY_REGISTERED';

// 가입에 실패하면 서버가 보내는 본문. 가입되면 본문 없이 201을 보낸다
export type SignupErrorResponse = {
  code: SignupErrorCode;
};

export type SignupResult = { isSuccess: true } | { isSuccess: false; errorCode: SignupErrorCode };

/**
 * POST /auth/signup
 * 근로장학생 계정을 만든다. 가입한 계정은 관리자가 승인할 때까지 승인 대기 상태다
 */
export const signup: (request: SignupRequest) => SignupResult = () => ({ isSuccess: true });

/**
 * POST /auth/logout
 * 로그아웃한다. 서버가 로그인 상태를 지우고, 응답 본문은 없다
 * 서버가 없고 로그인 상태도 저장하지 않아서 지금은 할 일이 없다
 */
export const logout = (): void => undefined;
