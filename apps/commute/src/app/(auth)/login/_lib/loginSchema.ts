import { z } from 'zod';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';

// 로그인 폼. 학교 메일과 비밀번호를 받는다
export const loginSchema = z.object({
  email: schoolEmailSchema,
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
