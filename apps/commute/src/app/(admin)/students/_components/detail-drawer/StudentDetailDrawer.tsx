'use client';

import { useEffect, useState } from 'react';
import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { Button, IconButton, Tabs } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../../_apis/workers';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';
import type { StudentRow } from '../../_hooks/useStudents';
import { formatGrade } from '../../_utils/studentFormat';
import BasicInfoTab from './BasicInfoTab';
import StudentEditForm from './StudentEditForm';
import WorkLedgerTab from './WorkLedgerTab';

type DetailTab = 'BASIC' | 'LEDGER';

const DETAIL_TABS: { value: DetailTab; label: string }[] = [
  { value: 'BASIC', label: '기본 정보' },
  { value: 'LEDGER', label: '근로대장' },
];

type StudentDetailDrawerProps = {
  // 열린 학생. 없으면 닫혀 있다
  student: StudentRow | null;
  onClose: () => void;
  onUpdate: (profile: Worker) => void;
  onPasswordReset: (student: Worker) => void;
  onDelete: (student: Worker) => void;
};

// 근로장학생 상세 정보. 화면 오른쪽에서 열리고 기본 정보·근로대장 탭으로 나뉜다.
// 정보 수정을 누르면 탭 대신 같은 자리에서 수정 화면으로 바뀐다
export default function StudentDetailDrawer({
  student,
  onClose,
  onUpdate,
  onPasswordReset,
  onDelete,
}: StudentDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('BASIC');

  useEffect(() => {
    if (!student) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [student, onClose]);

  if (!student) return null;

  const handleSubmit = (profile: Worker) => {
    onUpdate(profile);
    setIsEditing(false);
  };

  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      {/* 바깥 어두운 곳을 누르면 닫힌다 */}
      <button
        type='button'
        aria-label='상세보기 닫기'
        className='absolute inset-0 cursor-default bg-gray-900/30'
        onClick={onClose}
      />
      <section
        role='dialog'
        aria-modal='true'
        aria-label='근로장학생 상세보기'
        className='bg-black-1 relative flex h-full w-[48rem] flex-col gap-[2.4rem] overflow-y-auto px-[3.2rem] py-[4rem]'
      >
        <div className='flex items-center justify-between'>
          <h2 className='title-23-eb text-black'>근로장학생 상세보기</h2>
          <IconButton aria-label='닫기' onClick={onClose}>
            <IconClose aria-hidden className='h-[2.4rem] w-[2.4rem] text-gray-700' />
          </IconButton>
        </div>

        <div className='flex items-end justify-between'>
          <div className='flex flex-col gap-[0.4rem]'>
            <p className='title-23-eb text-black'>{student.name}</p>
            <p className='font-16-rg text-gray-500'>
              {isEditing
                ? '정보 수정'
                : `${student.studentId ?? EMPTY_STUDENT_TEXT} · ${student.department ?? EMPTY_STUDENT_TEXT} · ${formatGrade(student.grade)}`}
            </p>
          </div>
          {isEditing ? null : (
            <Button
              display='inline'
              size='small'
              tone='subtle_2'
              color='black'
              onClick={() => setIsEditing(true)}
            >
              정보 수정
            </Button>
          )}
        </div>

        {isEditing ? (
          <StudentEditForm
            profile={student}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            <Tabs.List activeValue={activeTab} tabs={DETAIL_TABS} aria-label='상세보기'>
              {DETAIL_TABS.map(({ value, label }) => (
                // 주소를 바꾸지 않는 탭이라 링크 이동은 막고 탭만 바꾼다
                <Tabs.Item
                  key={value}
                  value={value}
                  activeValue={activeTab}
                  href={`#${value}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveTab(value);
                  }}
                >
                  {label}
                </Tabs.Item>
              ))}
            </Tabs.List>

            {activeTab === 'BASIC' ? (
              <BasicInfoTab
                student={student}
                onPasswordReset={() => onPasswordReset(student)}
                onDelete={() => onDelete(student)}
              />
            ) : (
              <WorkLedgerTab student={student} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
