import type { SlotStatus } from '@/shared/ui';

// edit 모드에서 슬롯을 눌렀을 때 바뀌는 상태. 없는 상태(신청 불가)는 누를 수 없다.
export const EDIT_NEXT_STATUS: Partial<Record<SlotStatus, SlotStatus>> = {
  AVAILABLE: 'PENDING_ADD',
  PENDING_ADD: 'AVAILABLE',
  APPLIED: 'PENDING_DELETE',
  PENDING_DELETE: 'APPLIED',
};

// apply 모드에서 슬롯을 눌렀을 때 바뀌는 상태. 신청은 예정 단계 없이 바로 신청·취소된다.
export const APPLY_NEXT_STATUS: Partial<Record<SlotStatus, SlotStatus>> = {
  AVAILABLE: 'APPLIED',
  APPLIED: 'AVAILABLE',
};

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금'];
