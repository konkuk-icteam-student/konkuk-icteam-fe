import { describe, expect, it } from 'vitest';
import { signupSchema, verificationCodeSchema, type SignupFormValues } from './signupSchema';

const VALID_VALUES: SignupFormValues = {
  name: '홍길동',
  email: 'gildong@konkuk.ac.kr',
  password: 'password1234',
  passwordConfirm: 'password1234',
  workDepartmentId: 1,
};

/**
 * 회원가입 폼 값을 검사하고, 칸에 보일 첫 번째 오류 글자를 돌려줍니다.
 * @param values 바꿔 볼 폼 값 (나머지는 올바른 값)
 * @param field 오류를 볼 칸
 * @returns 그 칸의 첫 번째 오류 글자. 오류가 없으면 undefined
 * @example getFieldError({ name: '' }, 'name'); // '이름을 입력해 주세요.'
 */
const getFieldError = (values: Partial<SignupFormValues>, field: keyof SignupFormValues) =>
  signupSchema
    .safeParse({ ...VALID_VALUES, ...values })
    .error?.issues.find(({ path }) => path[0] === field)?.message;

describe('signupSchema', () => {
  it('이름·학교 메일·비밀번호·비밀번호 확인·근무 부서가 맞으면 통과한다', () => {
    expect(signupSchema.safeParse(VALID_VALUES).success).toBe(true);
  });

  it('비밀번호가 8자보다 짧거나 영문·숫자 중 하나가 없으면 규칙을 안내한다', () => {
    ['pass123', 'passwordonly', '12345678'].forEach((password) => {
      expect(getFieldError({ password, passwordConfirm: password }, 'password')).toBe(
        '비밀번호는 영문과 숫자를 섞어 8자 이상으로 입력해 주세요.',
      );
    });
  });

  it('비밀번호 확인이 비밀번호와 다르면 확인 칸에 알려 준다', () => {
    expect(getFieldError({ passwordConfirm: 'password9999' }, 'passwordConfirm')).toBe(
      '비밀번호가 서로 달라요.',
    );
  });

  it('다른 칸을 아직 채우지 않았어도 비밀번호 확인이 다르면 바로 알려 준다', () => {
    expect(
      getFieldError(
        { name: '', workDepartmentId: undefined, passwordConfirm: 'password9999' },
        'passwordConfirm',
      ),
    ).toBe('비밀번호가 서로 달라요.');
  });

  it('비밀번호가 규칙에 맞지 않아도 확인이 다르면 두 칸 모두에 알려 준다', () => {
    const values = { password: 'pass123', passwordConfirm: 'pass124' };

    expect(getFieldError(values, 'password')).toBe(
      '비밀번호는 영문과 숫자를 섞어 8자 이상으로 입력해 주세요.',
    );
    expect(getFieldError(values, 'passwordConfirm')).toBe('비밀번호가 서로 달라요.');
  });

  it('이름이 비어 있으면 이름을 입력하라고 안내한다', () => {
    ['', '   '].forEach((name) => {
      expect(getFieldError({ name }, 'name')).toBe('이름을 입력해 주세요.');
    });
  });

  it('근무 부서를 고르지 않으면 고르라고 안내한다', () => {
    expect(getFieldError({ workDepartmentId: undefined }, 'workDepartmentId')).toBe(
      '근무 부서를 골라 주세요.',
    );
  });
});

describe('verificationCodeSchema', () => {
  it('숫자 6자리면 통과하고, 아니면 6자리를 입력하라고 안내한다', () => {
    expect(verificationCodeSchema.safeParse('123456').success).toBe(true);
    ['', '12345', '1234567', '12345a'].forEach((code) => {
      expect(verificationCodeSchema.safeParse(code).error?.issues[0]?.message).toBe(
        '인증번호 6자리를 입력해 주세요.',
      );
    });
  });
});
