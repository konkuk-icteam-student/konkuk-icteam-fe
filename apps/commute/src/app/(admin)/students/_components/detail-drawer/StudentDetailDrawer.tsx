'use client';

import { useEffect, useState } from 'react';
import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { Button, IconButton, Tabs } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker, WorkerDetail } from '../../../_apis/workers';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';
import { formatGrade } from '../../_utils/studentFormat';
import AccountSection from './AccountSection';
import BasicInfoTab from './BasicInfoTab';
import StudentEditForm from './StudentEditForm';
import WorkLedgerTab from './WorkLedgerTab';

type DetailTab = 'BASIC' | 'LEDGER';

const DETAIL_TABS: { value: DetailTab; label: string }[] = [
  { value: 'BASIC', label: '기본 정보' },
  { value: 'LEDGER', label: '근로대장' },
];

// 탭 아래 내용 영역. 내용 길이와 상관없이 서랍 끝까지 같은 높이를 차지하고 그 안에서만 스크롤한다.
// 스크롤바는 서랍 오른쪽 끝에 붙이고, 스크롤바가 생겼다 없어져도 폭이 흔들리지 않게 자리를 늘 비워 둔다
const PANEL_CLASS_NAME =
  'flex min-h-0 flex-1 flex-col gap-[2.4rem] overflow-y-auto [scrollbar-gutter:stable] -mr-[3.2rem] pr-[3.2rem] pb-[4rem]';

type StudentDetailDrawerProps = {
  // 열린 학생의 상세 정보 (오늘 기준). 없으면 닫혀 있다
  student: WorkerDetail | null;
  onClose: () => void;
  onUpdate: (profile: Worker) => void;
  onPasswordReset: (student: Worker) => void;
  onDelete: (student: Worker) => void;
};

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
        className='bg-black-1 relative flex h-full w-[48rem] flex-col gap-[2.4rem] px-[3.2rem] pt-[4rem]'
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
          <div className={PANEL_CLASS_NAME}>
            <StudentEditForm
              profile={student}
              onCancel={() => setIsEditing(false)}
              onSubmit={handleSubmit}
            />
          </div>
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

            {/* 탭을 바꾸면 영역을 새로 그려 스크롤을 맨 위로 되돌린다 */}
            <div key={activeTab} role='tabpanel' className={PANEL_CLASS_NAME}>
              {activeTab === 'BASIC' ? (
                <>
                  <BasicInfoTab student={student} />
                  <AccountSection
                    email={student.email}
                    onPasswordReset={() => onPasswordReset(student)}
                    onDelete={() => onDelete(student)}
                  />
                </>
              ) : (
                <WorkLedgerTab student={student} />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
