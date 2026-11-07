import type { Metadata } from 'next';
import { getWorkDepartments } from '../_apis/workDepartments';
import SignupForm from './_components/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 | Commute',
};

// 근로장학생 회원가입. 선생님(관리자)도 여기서 가입하고, 서버가 관리자로 지정한다
export default function SignupPage() {
  const { workDepartments } = getWorkDepartments();

  return <SignupForm workDepartments={workDepartments} />;
}
