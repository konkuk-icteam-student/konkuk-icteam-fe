import { SLOT_TIMES } from '@/shared/config/slot';

import type { SlotStatus } from './types';

// 표에 그릴 칸 시작 시각 목록 ('09:00', '09:30', ..., '17:30'). 관리자 시간표와 같은 30분 칸이다
export const SLOT_START_TIMES = SLOT_TIMES.map(({ start }) => start);

export const SLOT_STATUS_CLASS_NAME: Record<SlotStatus, string> = {
  AVAILABLE: 'border border-gray-400/30 bg-black-1',
  UNAVAILABLE: 'border border-gray-400/30 bg-gray-50',
  PENDING_ADD: 'border-2 border-blue bg-black-1',
  PENDING_DELETE: 'border-2 border-red bg-black-1',
  APPLIED: 'border border-blue bg-blue',
};
