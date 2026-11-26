import { describe, expect, it } from 'vitest';
import { checkUnavailableSlot } from './slot';

const RANGES = [
  { start: '11:30', end: '13:00' },
  { start: '17:00', end: '18:00' },
];

describe('checkUnavailableSlot', () => {
  it('근무 불가 시간대 안에서 시작하는 칸이면 true다 (시작 포함, 끝 미포함)', () => {
    expect(checkUnavailableSlot('11:30', RANGES)).toBe(true);
    expect(checkUnavailableSlot('17:30', RANGES)).toBe(true);
    expect(checkUnavailableSlot('13:00', RANGES)).toBe(false);
    expect(checkUnavailableSlot('11:00', RANGES)).toBe(false);
  });

  it('근무 불가 시간대가 없으면 모든 칸이 근무 가능하다', () => {
    expect(checkUnavailableSlot('12:00', [])).toBe(false);
  });
});
