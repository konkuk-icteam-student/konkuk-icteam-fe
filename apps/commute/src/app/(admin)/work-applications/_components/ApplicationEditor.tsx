'use client';

import { useWorkApplication } from './WorkApplicationProvider';

type ApplicationEditorProps = {
  // 연 기준을 글로 보여 주는 슬롯 (@settings)
  settings: React.ReactNode;
  // 기준을 입력하는 슬롯 (@open)
  open: React.ReactNode;
};

// 근로신청 왼쪽 칸. 아직 열지 않았으면 입력 폼을, 연 뒤에는 기준 보기를 보여 주고 '수정'으로 폼으로 바꾼다
export default function ApplicationEditor({ settings, open }: ApplicationEditorProps) {
  const { isEditing } = useWorkApplication();

  return isEditing ? open : settings;
}
