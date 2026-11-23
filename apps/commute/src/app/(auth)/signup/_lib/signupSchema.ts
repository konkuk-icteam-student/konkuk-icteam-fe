import { z } from 'zod';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// TODO: 인증번호 형식(문자 포함 여부, 대소문자 구분)은 서버 확인 후 변경 필요
export const verificationCodeSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{6}$/, '인증번호 6자리를 입력해 주세요.');

const signupFieldsSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해 주세요.'),
  email: schoolEmailSchema,
  verificationCode: verificationCodeSchema,
  password: z
    .string()
    .regex(PASSWORD_PATTERN, '비밀번호는 영문과 숫자를 섞어 8자 이상으로 입력해 주세요.'),
  passwordConfirm: z.string(),
  workDepartmentId: z.number({ error: '근무 부서를 골라 주세요.' }),
});

// 비밀번호와 확인 두 칸에 글자가 들어 있는지만 본다 (규칙에 맞는지는 보지 않는다)
const passwordPairSchema = z.object({ password: z.string(), passwordConfirm: z.string() });

// 회원가입 폼. 두 칸을 비교하는 규칙은 화면에 안내할 칸(path)에 오류를 붙인다.
// 객체 규칙은 기본으로 다른 칸에 오류가 하나라도 있으면 건너뛰므로, 비밀번호 두 칸만 있으면 늘 비교한다
export const signupSchema = signupFieldsSchema.refine(
  ({ password, passwordConfirm }) => password === passwordConfirm,
  {
    message: '비밀번호가 서로 달라요.',
    path: ['passwordConfirm'],
    when: ({ value }) => passwordPairSchema.safeParse(value).success,
  },
);

export type SignupFormValues = z.infer<typeof signupSchema>;
