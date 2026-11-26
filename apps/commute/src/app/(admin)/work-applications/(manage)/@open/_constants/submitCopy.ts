// 근로신청을 처음 열 때와 연 기준을 고칠 때 버튼·확인 모달·알림 문구
export const SUBMIT_COPY = {
  OPEN: {
    submitLabel: '신청 받기',
    confirmTitle: (month: number) => `${month}월 근로신청을 열까요?`,
    confirmDescription: '신청 기간 동안 근로장학생이 근무 시간을 신청할 수 있어요.',
    confirmLabel: '열기',
    successMessage: (month: number) => `${month}월 근로신청을 열었어요.`,
    failureMessage: '근로신청을 열지 못했어요. 잠시 후 다시 시도해 주세요.',
  },
  EDIT: {
    submitLabel: '수정 저장',
    confirmTitle: (month: number) => `${month}월 근로신청 기준을 수정할까요?`,
    confirmDescription: '이미 들어온 근로신청은 그대로 남아요.',
    confirmLabel: '저장',
    successMessage: (month: number) => `${month}월 근로신청 기준을 수정했어요.`,
    failureMessage: '근로신청 기준을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.',
  },
} as const;
