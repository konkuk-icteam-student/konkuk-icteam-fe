import { z } from 'zod';
import schoolEmailSchema from '../../_lib/schoolEmailSchema';

export const loginSchema = z.object({
  email: schoolEmailSchema,
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
