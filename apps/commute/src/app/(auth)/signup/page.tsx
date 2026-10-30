import type { Metadata } from 'next';
import { getWorkDepartments } from '../_apis/workDepartments';
import SignupForm from './_components/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 | Commute',
};

// 근로장학생 회원가입. 선생님(관리자)도 여기서 가입하고, 서버가 관리자로 지정한다
export default function SignupPage() {
  const { workDepartments } = getWorkDepartments();

  return (
    <div className='flex flex-col gap-[3.2rem]'>
      <header className='flex flex-col items-center gap-[0.8rem] text-center'>
        <h1 className='title-24-md text-black'>회원가입</h1>
        <p className='caption-14-md text-gray-400'>학교 메일로 출근부 계정을 만들어요</p>
      </header>
      <SignupForm workDepartments={workDepartments} />
    </div>
  );
}
