import { describe, expect, it } from 'vitest';
import {
  createOverCapacityRanges,
  createRequestTimeTableCells,
  createSlotKey,
  createSlotKeys,
  type RequestTimeTableDay,
} from './requestTimeTable';

const LUNCH = [{ start: '11:30', end: '13:00' }];
const createUsers = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    userId: index + 1,
    userName: `학생${index + 1}`,
  }));

const DAY: RequestTimeTableDay = {
  dateKey: '2026-11-25',
  slots: [
    { start: '09:00', users: createUsers(1) },
    { start: '09:30', users: createUsers(2) },
    { start: '10:00', users: createUsers(5) },
    { start: '10:30', users: [] },
    { start: '11:30', users: [] },
  ],
  isUnavailableDate: false,
  unavailableTimeRanges: LUNCH,
};

const getStatuses = (cells: { status: string }[][]) => cells[0]?.map(({ status }) => status);

describe('createSlotKeys', () => {
  it('구간을 30분 칸 key로 펼친다', () => {
    expect([
      ...createSlotKeys([{ date: new Date(2026, 10, 25), start: '11:00', end: '12:00' }]),
    ]).toEqual(['2026-11-25 11:00', '2026-11-25 11:30']);
  });
});

describe('createRequestTimeTableCells', () => {
  it('보고 있는 학생이 없으면 인원만 보고, 최대를 넘으면 정원 초과다', () => {
    expect(getStatuses(createRequestTimeTableCells([DAY], 4, null))).toEqual([
      'AVAILABLE',
      'AVAILABLE',
      'OVER_CAPACITY',
      'AVAILABLE',
      'UNAVAILABLE',
    ]);
  });

  it('칸마다 근무자 명단과 최대 인원을 담는다', () => {
    const [cell] = createRequestTimeTableCells([DAY], 4, null)[0] ?? [];

    expect(cell).toMatchObject({ mode: 'detail', workers: ['학생1'], maxCount: 4 });
  });

  it('보고 있는 학생의 칸은 신청 완료, 요청 칸은 삭제·추가 예정이다', () => {
    const focus = {
      userId: 2,
      userName: '학생2',
      deleteSlotKeys: new Set([createSlotKey('2026-11-25', '09:30')]),
      addSlotKeys: new Set([createSlotKey('2026-11-25', '10:30')]),
    };

    expect(getStatuses(createRequestTimeTableCells([DAY], 4, focus))).toEqual([
      'AVAILABLE',
      'PENDING_DELETE',
      // 학생2가 있는 칸은 정원을 넘어도 신청 완료로 보인다
      'APPLIED',
      'PENDING_ADD',
      'UNAVAILABLE',
    ]);
  });

  it('인원은 승인한 뒤 기준이다 (추가 칸은 더하고, 삭제 칸은 뺀다)', () => {
    const focus = {
      userId: 2,
      userName: '학생2',
      deleteSlotKeys: new Set([createSlotKey('2026-11-25', '09:30')]),
      addSlotKeys: new Set([createSlotKey('2026-11-25', '10:30')]),
    };
    const [, deleteCell, , addCell] = createRequestTimeTableCells([DAY], 4, focus)[0] ?? [];

    expect(deleteCell).toMatchObject({ workers: ['학생1'] });
    expect(addCell).toMatchObject({ workers: ['학생2'] });
  });

  it('근무 불가 날짜는 하루 통째로 신청 불가다', () => {
    const cells = createRequestTimeTableCells([{ ...DAY, isUnavailableDate: true }], 4, null);

    expect(new Set(getStatuses(cells))).toEqual(new Set(['UNAVAILABLE']));
  });
});

describe('createOverCapacityRanges', () => {
  // 09:00~10:00에 4명이 있는 날, 다섯 번째 학생이 09:00~10:30을 더하려 한다
  const FULL_DAY: RequestTimeTableDay = {
    dateKey: '2026-11-24',
    slots: [
      { start: '09:00', users: createUsers(4) },
      { start: '09:30', users: createUsers(4) },
      { start: '10:00', users: createUsers(3) },
    ],
    isUnavailableDate: false,
    unavailableTimeRanges: LUNCH,
  };
  const focus = {
    userId: 5,
    userName: '학생5',
    deleteSlotKeys: new Set<string>(),
    addSlotKeys: new Set(['2026-11-24 09:00', '2026-11-24 09:30', '2026-11-24 10:00']),
  };

  it('승인하면 정원을 넘는 추가 칸을 이어진 구간으로 묶는다', () => {
    expect(createOverCapacityRanges([FULL_DAY], 4, focus)).toEqual([
      { dateKey: '2026-11-24', start: '09:00', end: '10:00' },
    ]);
  });

  it('넘는 칸은 정원 초과로, 넘지 않는 추가 칸은 추가 예정으로 보인다', () => {
    expect(getStatuses(createRequestTimeTableCells([FULL_DAY], 4, focus))).toEqual([
      'OVER_CAPACITY',
      'OVER_CAPACITY',
      'PENDING_ADD',
    ]);
  });

  it('보고 있는 학생이 없으면 경고할 구간도 없다', () => {
    expect(createOverCapacityRanges([FULL_DAY], 4, null)).toEqual([]);
  });
});
