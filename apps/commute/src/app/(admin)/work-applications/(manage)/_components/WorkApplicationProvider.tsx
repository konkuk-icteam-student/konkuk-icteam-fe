'use client';

import { createContext, useContext, useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { getNextYearMonth } from '@/shared/utils/calendar';
import {
  getWorkApplication,
  type GetWorkApplicationResponse,
  type YearMonth,
} from '../../../_apis/workApplications';

type WorkApplicationValue = {
  // 이 화면이 다루는 달. 처음 그릴 때의 다음 달로 고정해서, 자정을 넘겨도 모든 슬롯이 같은 달을 쓴다
  yearMonth: YearMonth;
  application: GetWorkApplicationResponse;
  // 왼쪽 칸이 입력 폼(@open)인지. 아니면 기준 보기(@settings)다
  isEditing: boolean;
  startEditing: () => void;
  // 저장했으면 저장된 근로신청을 넘겨 모든 슬롯이 새 기준을 읽게 한다
  finishEditing: (saved?: GetWorkApplicationResponse) => void;
  // 폼이 닫혀도 알림이 남도록 여기서 띄운다
  showToast: ReturnType<typeof useToast>['showToast'];
};

const WorkApplicationContext = createContext<WorkApplicationValue | null>(null);

// 근로신청 화면의 달·근로신청·수정 상태를 한 곳에서 정해 모든 슬롯에 내려 준다
export function WorkApplicationProvider({ children }: { children: React.ReactNode }) {
  const [yearMonth] = useState(getNextYearMonth);
  const [application, setApplication] = useState(() => getWorkApplication(yearMonth));
  // 아직 열지 않은 달은 바로 입력 폼을 보여 준다
  const [isEditing, setIsEditing] = useState(!application.isOpened);
  const { showToast, toast } = useToast();

  const finishEditing = (saved?: GetWorkApplicationResponse) => {
    if (saved) setApplication(saved);
    setIsEditing(false);
  };

  return (
    <WorkApplicationContext
      value={{
        yearMonth,
        application,
        isEditing,
        startEditing: () => setIsEditing(true),
        finishEditing,
        showToast,
      }}
    >
      {children}
      {toast}
    </WorkApplicationContext>
  );
}

export const useWorkApplication = () => {
  const value = useContext(WorkApplicationContext);
  if (!value) {
    throw new Error('useWorkApplication은 WorkApplicationProvider 안에서만 쓸 수 있어요.');
  }

  return value;
};
