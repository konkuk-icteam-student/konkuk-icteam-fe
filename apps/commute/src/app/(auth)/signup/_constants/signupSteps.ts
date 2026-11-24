export const SIGNUP_STEP = {
  EMAIL: 0,
  PASSWORD: 1,
  PROFILE: 2,
} as const;

export type SignupStep = (typeof SIGNUP_STEP)[keyof typeof SIGNUP_STEP];
