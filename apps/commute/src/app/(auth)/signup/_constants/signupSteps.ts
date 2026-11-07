import type { SignupFormValues } from '../_lib/signupSchema';

type SignupStep = {
  title: string;
  description: string;
  // 이 단계에서 검사하는 칸. 첫 칸에 초점을 둔다
  fields: readonly (keyof SignupFormValues)[];
};

// 회원가입 단계 순서 (SIGNUP_STEPS의 자리)
export const SIGNUP_STEP = {
  EMAIL: 0,
  PASSWORD: 1,
  PROFILE: 2,
} as const;

// 회원가입 단계. 한 주소(/signup) 안에서 메일 인증 → 비밀번호 → 이름·근무 부서 순서로 넘긴다
export const SIGNUP_STEPS: readonly SignupStep[] = [
  {
    title: '학교 메일을 인증해 주세요',
    description: '메일로 받은 인증번호로 본인 메일인지 확인해요',
    fields: ['email'],
  },
  {
    title: '비밀번호를 정해 주세요',
    description: '영문과 숫자를 섞어 8자 이상으로 정해 주세요',
    fields: ['password', 'passwordConfirm'],
  },
  {
    title: '이름과 근무 부서를 알려 주세요',
    description: '관리자가 가입을 승인할 때 확인해요',
    fields: ['name', 'workDepartmentId'],
  },
];
