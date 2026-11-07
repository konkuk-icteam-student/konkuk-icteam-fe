import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { login, signup } from './auth';
import { confirmEmailVerification, sendEmailVerification } from './emailVerifications';

// 인증번호를 보낸 시각. 가짜 시계를 여기에 맞춘다
const SENT_AT = new Date(2026, 9, 30, 9, 0, 0);

describe('회원가입 API', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(SENT_AT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('이미 가입된 메일로는 인증번호를 보내지 않는다', () => {
    expect(sendEmailVerification({ email: 'gildong@konkuk.ac.kr' })).toEqual({
      isSuccess: false,
      errorCode: 'ALREADY_REGISTERED',
    });
  });

  it('새 메일이면 인증번호를 보내고, 5분 뒤에 만료된다', () => {
    expect(sendEmailVerification({ email: 'send@konkuk.ac.kr' })).toEqual({
      isSuccess: true,
      expiresAt: new Date(2026, 9, 30, 9, 5, 0),
    });
  });

  it('인증번호가 틀리면 확인되지 않는다', () => {
    sendEmailVerification({ email: 'wrong-code@konkuk.ac.kr' });

    expect(confirmEmailVerification({ email: 'wrong-code@konkuk.ac.kr', code: '000000' })).toEqual({
      isSuccess: false,
      errorCode: 'INVALID_CODE',
    });
  });

  it('5분이 지나면 맞는 인증번호라도 만료돼 확인되지 않는다', () => {
    sendEmailVerification({ email: 'expired@konkuk.ac.kr' });
    vi.setSystemTime(new Date(2026, 9, 30, 9, 5, 1));

    expect(confirmEmailVerification({ email: 'expired@konkuk.ac.kr', code: '123456' })).toEqual({
      isSuccess: false,
      errorCode: 'EXPIRED_CODE',
    });
  });

  it('메일 인증을 하지 않으면 가입되지 않는다', () => {
    expect(
      signup({
        name: '이인증',
        email: 'not-verified@konkuk.ac.kr',
        password: 'password1234',
        workDepartmentId: 1,
        verificationToken: 'not-a-real-token',
      }),
    ).toEqual({ isSuccess: false, errorCode: 'EMAIL_NOT_VERIFIED' });
  });

  it('메일 인증을 마치고 가입하면 승인 대기 계정이 되고, 그 메일로는 다시 가입할 수 없다', () => {
    const email = 'newcomer@konkuk.ac.kr';
    sendEmailVerification({ email });
    const confirmed = confirmEmailVerification({ email, code: '123456' });
    if (!confirmed.isSuccess) throw new Error('인증번호 확인에 실패했습니다');

    expect(
      signup({
        name: '김새내',
        email,
        password: 'password1234',
        workDepartmentId: 1,
        verificationToken: confirmed.verificationToken,
      }),
    ).toEqual({ isSuccess: true });
    expect(login({ email, password: 'password1234' })).toEqual({
      isSuccess: false,
      errorCode: 'PENDING_APPROVAL',
    });
    expect(sendEmailVerification({ email })).toEqual({
      isSuccess: false,
      errorCode: 'ALREADY_REGISTERED',
    });
  });

  it('같은 인증으로 두 번 가입하면 두 번째는 이미 가입된 메일로 막힌다', () => {
    const email = 'twice@konkuk.ac.kr';
    sendEmailVerification({ email });
    const confirmed = confirmEmailVerification({ email, code: '123456' });
    if (!confirmed.isSuccess) throw new Error('인증번호 확인에 실패했습니다');
    const request = {
      name: '두번가',
      email,
      password: 'password1234',
      workDepartmentId: 1,
      verificationToken: confirmed.verificationToken,
    };

    signup(request);
    expect(signup(request)).toEqual({ isSuccess: false, errorCode: 'ALREADY_REGISTERED' });
  });
});
