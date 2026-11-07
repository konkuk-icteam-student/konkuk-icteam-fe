import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

/**
 * 인증번호가 만료되기까지 남은 시간을 초로 구합니다. 1초 미만은 올려서 마지막 1초도 보이게 합니다.
 * @param expiresAt 인증번호가 만료되는 시각
 * @param now 지금 시각
 * @returns 남은 초. 만료 시각이 지났으면 0
 * @example getRemainingSeconds(new Date(2026, 9, 30, 9, 5), new Date(2026, 9, 30, 9, 0)); // 300
 */
export const getRemainingSeconds = (expiresAt: Date, now: Date) =>
  Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

/**
 * 남은 초를 화면에 보일 MM:SS 글자로 바꿉니다.
 * @param remainingSeconds 남은 초
 * @returns MM:SS
 * @example formatRemainingTime(65); // '01:05'
 */
export const formatRemainingTime = (remainingSeconds: number) =>
  `${formatNumber(Math.floor(remainingSeconds / 60))}:${formatNumber(remainingSeconds % 60)}`;
