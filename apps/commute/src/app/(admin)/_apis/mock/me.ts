import type { AdminMe } from '../me';

// 로그인한 관리자 (서버가 보낼 JSON 모양). 관리자 화면은 로그인 없이 주소로 들어가므로 늘 이 사람으로 본다.
// 근무 부서는 회원가입 근무 부서 목록(GET /auth/work-departments)의 정보운영팀이다
const ADMIN_ME_MOCK: AdminMe = {
  userId: 100,
  name: '김정보',
  workDepartment: { workDepartmentId: 1, name: '정보운영팀' },
};

export default ADMIN_ME_MOCK;
