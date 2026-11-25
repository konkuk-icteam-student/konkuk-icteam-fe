import { z } from 'zod';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// TODO: 인증번호 형식(문자 포함 여부, 대소문자 구분)은 서버 확인 후 변경 필요
export const verificationCodeSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{6}$/, '인증번호 6자리를 입력해 주세요.');

export const signupFieldsSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해 주세요.'),
  email: schoolEmailSchema,
  password: z
    .string()
    .regex(PASSWORD_PATTERN, '비밀번호는 영문과 숫자를 섞어 8자 이상으로 입력해 주세요.'),
  workDepartmentId: z.number({ error: '근무 부서를 골라 주세요.' }),
});

export type SignupFormValues = z.infer<typeof signupFieldsSchema>;
