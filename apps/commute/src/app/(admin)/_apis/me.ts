import type { WorkDepartment } from '@/app/(auth)/_apis/workDepartments';
import ADMIN_ME_MOCK from './mock/me';

// 로그인한 관리자 본인
export type AdminMe = {
  userId: number;
  name: string;
  // 관리자도 회원가입 때 근무 부서를 고른다 (예: 정보운영팀). 학과(department)와 다르다
  workDepartment: WorkDepartment;
};

/**
 * GET /admin/me
 * 로그인한 관리자 본인 정보
 */
export const getAdminMe = (): AdminMe => ADMIN_ME_MOCK;
