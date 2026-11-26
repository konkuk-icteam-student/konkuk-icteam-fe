'use client';

import { createContext, useContext, useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { getNextYearMonth } from '@/shared/utils/calendar';
import { getWorkApplication } from '../../_apis/workApplications';

type ApplicationEditorValue = {
  startEditing: () => void;
  // 저장했으면 알릴 글을 넘긴다. 폼이 닫히면서 사라지지 않게 여기서 띄운다
  finishEditing: (message?: string) => void;
};

const ApplicationEditorContext = createContext<ApplicationEditorValue | null>(null);

type ApplicationEditorProps = {
  // 연 기준을 글로 보여 주는 슬롯 (@settings)
  settings: React.ReactNode;
  // 기준을 입력하는 슬롯 (@open)
  open: React.ReactNode;
};

// 근로신청 왼쪽 칸. 아직 열지 않았으면 입력 폼을, 연 뒤에는 기준 보기를 보여 주고 '수정'으로 폼으로 바꾼다
export function ApplicationEditor({ settings, open }: ApplicationEditorProps) {
  const [isEditing, setIsEditing] = useState(
    () => !getWorkApplication(getNextYearMonth()).isOpened,
  );
  const { showToast, toast } = useToast();

  const finishEditing = (message?: string) => {
    setIsEditing(false);
    if (message) showToast(message);
  };

  return (
    <ApplicationEditorContext value={{ startEditing: () => setIsEditing(true), finishEditing }}>
      {isEditing ? open : settings}
      {toast}
    </ApplicationEditorContext>
  );
}

export const useApplicationEditor = () => {
  const value = useContext(ApplicationEditorContext);
  if (!value) throw new Error('useApplicationEditor는 ApplicationEditor 안에서만 쓸 수 있어요.');

  return value;
};
