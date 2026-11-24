'use client';

import { SearchBar } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import { ArrowButton } from '@/shared/ui';
import type { Worker } from '../_apis/workers';
import StudentDetailDrawer from './_components/detail-drawer/StudentDetailDrawer';
import StudentsTable from './_components/student-list/StudentsTable';
import { useStudents } from './_hooks/useStudents';

export default function PageClient() {
  const students = useStudents();
  const { showToast, toast } = useToast();

  const handleProfileUpdate = (profile: Worker) => {
    students.handleProfileUpdate(profile);
    showToast('근로장학생 정보를 수정했어요.');
  };

  const handlePasswordReset = ({ userId, name }: Worker) => {
    students.handlePasswordReset(userId);
    showToast(`${name}님 학교 메일로 비밀번호 재설정 링크를 보냈어요.`);
  };

  const handleDelete = ({ userId, name }: Worker) => {
    students.handleDelete(userId);
    showToast(`${name}님 계정을 삭제했어요.`);
  };

  return (
    <div className='mx-auto w-full max-w-[140rem] p-[3.4rem]'>
      <section className='bg-black-1 flex flex-col gap-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[3.2rem]'>
        <h1 className='title-23-eb text-center text-black'>
          {`근무인원 정보 (총 인원 수 : ${students.totalCount}명)`}
        </h1>

        <SearchBar
          aria-label='이름 검색'
          placeholder='이름을 검색하세요.'
          value={students.keyword}
          onChange={(event) => students.handleKeywordChange(event.target.value)}
          containerClassName='w-[28rem] rounded-[0.8rem]'
        />

        <StudentsTable
          students={students.students}
          startNumber={students.startNumber}
          onDetailOpen={students.handleDetailOpen}
        />

        <div className='flex items-center gap-[1.2rem] self-end'>
          <ArrowButton
            direction='left'
            size='medium'
            aria-label='이전 페이지'
            disabled={students.isFirstPage}
            onClick={() => students.handlePageChange(students.page - 1)}
          />
          <span className='font-16-rg text-black'>
            <strong className='font-bold'>{students.page + 1}</strong>
            {`/${students.totalPages}`}
          </span>
          <ArrowButton
            direction='right'
            size='medium'
            aria-label='다음 페이지'
            disabled={students.isLastPage}
            onClick={() => students.handlePageChange(students.page + 1)}
          />
        </div>
      </section>

      {/* 다른 근로장학생을 열면 탭·수정 중 상태를 처음부터 다시 시작한다 */}
      <StudentDetailDrawer
        key={students.selectedStudent?.userId}
        student={students.selectedStudent}
        onClose={students.handleDetailClose}
        onUpdate={handleProfileUpdate}
        onPasswordReset={handlePasswordReset}
        onDelete={handleDelete}
      />
      {toast}
    </div>
  );
}
