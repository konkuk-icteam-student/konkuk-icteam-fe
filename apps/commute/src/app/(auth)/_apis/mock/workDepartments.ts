import type { WorkDepartment } from '../workDepartments';

// 근로장학생이 일하는 학교 부서 (서버가 보낼 JSON 모양). 기존 출근부 회원가입의 부서 목록을 옮겼다
export const WORK_DEPARTMENTS_MOCK: WorkDepartment[] = [
  { workDepartmentId: 1, name: '정보운영팀' },
  { workDepartmentId: 2, name: '장학관리팀' },
  { workDepartmentId: 3, name: '도서관' },
  { workDepartmentId: 4, name: '학생지원팀' },
  { workDepartmentId: 5, name: '교무팀' },
  { workDepartmentId: 6, name: '총무팀' },
  { workDepartmentId: 7, name: '기획팀' },
  { workDepartmentId: 8, name: '입학관리팀' },
  { workDepartmentId: 9, name: '취업지원팀' },
];
