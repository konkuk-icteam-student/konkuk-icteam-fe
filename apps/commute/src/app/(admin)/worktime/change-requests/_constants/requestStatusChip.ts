import type { WorkChangeRequestStatusCode } from '../../../_apis/workChangeRequests';
import type { ChipTone } from '@/shared/ui';

// 요청 상태 칩 (카드와 시간표 패널의 이름 옆에 함께 쓴다)
export const REQUEST_STATUS_CHIP: Record<
  WorkChangeRequestStatusCode,
  { label: string; tone: ChipTone }
> = {
  CS01: { label: '승인 대기', tone: 'gray' },
  CS02: { label: '승인', tone: 'blue' },
  CS03: { label: '반려', tone: 'red' },
};
