import WORK_DEPARTMENTS_MOCK from './mock/workDepartments';

// 근로장학생이 일하는 학교 부서 (예: 정보운영팀). 학과(department)와 다르다
export type WorkDepartment = {
  workDepartmentId: number;
  name: string;
};

export type GetWorkDepartmentsResponse = {
  workDepartments: WorkDepartment[];
};

/**
 * GET /auth/work-departments
 * 회원가입 때 고를 근무 부서 목록. 로그인하기 전에 부르므로 /auth로 시작한다
 */
export const getWorkDepartments = (): GetWorkDepartmentsResponse => ({
  workDepartments: WORK_DEPARTMENTS_MOCK,
});
