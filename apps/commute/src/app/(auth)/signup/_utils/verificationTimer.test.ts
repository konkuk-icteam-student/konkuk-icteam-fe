import { describe, expect, it } from 'vitest';
import { formatRemainingTime, getRemainingSeconds } from './verificationTimer';

const EXPIRES_AT = new Date(2026, 9, 30, 9, 5, 0);

describe('getRemainingSeconds', () => {
  it('만료 시각까지 남은 시간을 초로 돌려준다 (1초 미만은 올린다)', () => {
    expect(getRemainingSeconds(EXPIRES_AT, new Date(2026, 9, 30, 9, 0, 0))).toBe(300);
    expect(getRemainingSeconds(EXPIRES_AT, new Date(2026, 9, 30, 9, 4, 59, 500))).toBe(1);
  });

  it('만료 시각이 지나면 0이다', () => {
    expect(getRemainingSeconds(EXPIRES_AT, new Date(2026, 9, 30, 9, 5, 0))).toBe(0);
    expect(getRemainingSeconds(EXPIRES_AT, new Date(2026, 9, 30, 9, 10, 0))).toBe(0);
  });
});

describe('formatRemainingTime', () => {
  it('남은 초를 MM:SS로 나타낸다', () => {
    expect(formatRemainingTime(300)).toBe('05:00');
    expect(formatRemainingTime(65)).toBe('01:05');
    expect(formatRemainingTime(9)).toBe('00:09');
    expect(formatRemainingTime(0)).toBe('00:00');
  });
});
