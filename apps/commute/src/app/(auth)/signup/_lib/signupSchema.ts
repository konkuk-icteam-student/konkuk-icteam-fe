import { z } from 'zod';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';

// 비밀번호: 영문과 숫자를 하나 이상씩 넣어 8자 이상
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// 회원가입 폼. 이름, 학교 메일, 비밀번호와 확인, 근무 부서를 받는다.
// 두 칸을 비교하는 규칙은 화면에 안내할 칸(path)에 오류를 붙인다
export const signupSchema = z
  .object({
    name: z.string().trim().min(1, '이름을 입력해 주세요.'),
    email: schoolEmailSchema,
    password: z
      .string()
      .regex(PASSWORD_PATTERN, '비밀번호는 영문과 숫자를 섞어 8자 이상으로 입력해 주세요.'),
    passwordConfirm: z.string(),
    // 근무 부서 목록에서 고른 부서의 id. 고르기 전에는 비어 있다
    workDepartmentId: z.number({ error: '근무 부서를 골라 주세요.' }),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: '비밀번호가 서로 달라요.',
    path: ['passwordConfirm'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

// 메일로 받은 인증번호. 가입할 때 보내는 값이 아니라 [확인]을 누를 때만 검사한다
export const verificationCodeSchema = z
  .string()
  .regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.');
