import { describe, expect, it } from 'vitest';
import { createAddedTimeRanges, getTimeRangeError } from './unavailableTimeRanges';

const LUNCH = { start: '11:30', end: '13:00' };

describe('getTimeRangeError', () => {
  it('근무 시간 안의 30분 단위이고 겹치지 않으면 넣을 수 있다', () => {
    expect(getTimeRangeError({ start: '17:00', end: '18:00' }, [LUNCH])).toBeUndefined();
    // 끝과 시작이 맞닿기만 하면 겹친 것이 아니다
    expect(getTimeRangeError({ start: '13:00', end: '14:00' }, [LUNCH])).toBeUndefined();
  });

  it('시각을 비우면 안 된다', () => {
    expect(getTimeRangeError({ start: '', end: '18:00' }, [])).toBe(
      '시작·끝 시각을 모두 입력해 주세요.',
    );
  });

  it('HH:mm 모양이 아니면 안 된다', () => {
    expect(getTimeRangeError({ start: '17:0', end: '18:00' }, [])).toBe(
      '시각을 09:00처럼 24시간 형식으로 입력해 주세요.',
    );
    expect(getTimeRangeError({ start: '17:00', end: '25:00' }, [])).toBe(
      '시각을 09:00처럼 24시간 형식으로 입력해 주세요.',
    );
  });

  it('끝이 시작보다 늦어야 한다', () => {
    expect(getTimeRangeError({ start: '15:00', end: '15:00' }, [])).toBe(
      '끝 시각이 시작보다 늦어야 해요.',
    );
  });

  it('근무 시간(09:00 - 18:00) 밖은 안 된다', () => {
    expect(getTimeRangeError({ start: '08:30', end: '09:30' }, [])).toBe(
      '근무 시간(09:00 - 18:00) 안에서 입력해 주세요.',
    );
    expect(getTimeRangeError({ start: '17:30', end: '18:30' }, [])).toBe(
      '근무 시간(09:00 - 18:00) 안에서 입력해 주세요.',
    );
  });

  it('30분 단위가 아니면 안 된다', () => {
    expect(getTimeRangeError({ start: '14:10', end: '15:00' }, [])).toBe(
      '30분 단위로 입력해 주세요.',
    );
  });

  it('이미 넣은 시간대와 겹치면 안 된다', () => {
    expect(getTimeRangeError({ start: '12:00', end: '14:00' }, [LUNCH])).toBe(
      '이미 넣은 시간대와 겹쳐요.',
    );
  });
});

describe('createAddedTimeRanges', () => {
  it('더한 뒤 시작 시각 순으로 놓는다', () => {
    expect(createAddedTimeRanges([{ start: '17:00', end: '18:00' }], LUNCH)).toEqual([
      LUNCH,
      { start: '17:00', end: '18:00' },
    ]);
  });
});
