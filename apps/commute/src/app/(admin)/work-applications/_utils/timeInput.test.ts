import { describe, expect, it } from 'vitest';
import { checkTimeFormat, formatTimeInput } from './timeInput';

describe('formatTimeInput', () => {
  it('숫자만 쳐도 두 자리 뒤에 콜론을 넣는다', () => {
    expect(formatTimeInput('17')).toBe('17');
    expect(formatTimeInput('170')).toBe('17:0');
    expect(formatTimeInput('1700')).toBe('17:00');
  });

  it('숫자가 아닌 글자는 빼고 4자리까지만 받는다', () => {
    expect(formatTimeInput('17:00')).toBe('17:00');
    expect(formatTimeInput('17:000')).toBe('17:00');
    expect(formatTimeInput('ab9')).toBe('9');
  });
});

describe('checkTimeFormat', () => {
  it('24시간 HH:mm 모양만 받는다', () => {
    expect(checkTimeFormat('09:00')).toBe(true);
    expect(checkTimeFormat('23:59')).toBe(true);
    expect(checkTimeFormat('9:00')).toBe(false);
    expect(checkTimeFormat('24:00')).toBe(false);
    expect(checkTimeFormat('17:0')).toBe(false);
  });
});
