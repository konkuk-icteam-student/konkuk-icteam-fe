import type { Metadata } from 'next';
import { getWorkDepartments } from '../_apis/workDepartments';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: '회원가입 | Commute',
};

export default function SignupPage() {
  const { workDepartments } = getWorkDepartments();

  return (
    <div className='flex flex-col gap-[3.2rem]'>
      <SignupForm workDepartments={workDepartments} />
    </div>
  );
}
