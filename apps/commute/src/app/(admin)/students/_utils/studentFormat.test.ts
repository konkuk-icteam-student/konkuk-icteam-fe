import { describe, expect, it } from 'vitest';
import { NO_GRADE_LABEL } from '../_constants/student';
import {
  formatGrade,
  formatMinutesToHours,
  formatWorkedOverLimit,
  parseGradeLabel,
} from './studentFormat';

describe('studentFormat', () => {
  it('학년을 글자로 바꾸고, 없으면 -로 채운다', () => {
    expect(formatGrade(3)).toBe('3학년');
    expect(formatGrade(null)).toBe('-');
  });

  it('드롭다운 글자를 학년 숫자로 바꾼다', () => {
    expect(parseGradeLabel('2학년')).toBe(2);
    expect(parseGradeLabel(NO_GRADE_LABEL)).toBeNull();
  });

  it('분을 시간으로 바꾸고, 나누어떨어지지 않으면 소수 첫째 자리까지 보여 준다', () => {
    expect(formatMinutesToHours(240)).toBe('4');
    expect(formatMinutesToHours(270)).toBe('4.5');
    expect(formatMinutesToHours(250)).toBe('4.2');
  });

  it('누적 근무시간을 최대 근로시간과 함께 "N시간 / M시간"으로 보여 준다', () => {
    expect(formatWorkedOverLimit(750, 3600)).toBe('12.5시간 / 60시간');
  });

  it('최대 근로시간이 0이면 그 기간 근로학생이 아니라서 -로 채운다', () => {
    expect(formatWorkedOverLimit(0, 0)).toBe('-');
  });
});
