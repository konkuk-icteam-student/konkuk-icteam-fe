import { z } from 'zod';
import { checkTimeFormat } from '../_utils/time';

// 인원·시간은 0 이상의 정수만 받는다. 입력칸의 min={0}은 직접 친 음수를 못 막는다
const requiredNumber = (message: string) =>
  z
    .number()
    .int({ message: '정수로 입력해 주세요.' })
    .min(0, { message: '0 이상으로 입력해 주세요.' })
    .nullable()
    .refine((value) => value !== null, { message });

const HoursLimitSchema = z
  .object({
    min: requiredNumber('최소 시간을 입력해 주세요.'),
    max: requiredNumber('최대 시간을 입력해 주세요.'),
  })
  .refine(({ min, max }) => min === null || max === null || min <= max, {
    message: '최소 시간이 최대 시간보다 클 수 없어요.',
  });

export const workApplicationSchema = z.object({
  applyDate: z
    .object({
      startDate: z.string().min(1, { message: '신청 기간을 골라 주세요.' }),
      endDate: z.string().min(1, { message: '신청 기간을 골라 주세요.' }),
      startTime: z.string().refine(checkTimeFormat, { message: '시작 시각을 입력해 주세요.' }),
      endTime: z.string().refine(checkTimeFormat, { message: '마감 시각을 입력해 주세요.' }),
    })
    .refine(({ startDate, endDate }) => startDate === '' || startDate !== endDate, {
      message: '신청 기간은 이틀 이상이어야 해요.',
    }),
  maxWorkers: requiredNumber('동시 근무 최대 인원을 입력해 주세요.').refine(
    (value) => value === null || value >= 1,
    { message: '동시 근무 최대 인원은 1명 이상이어야 해요.' },
  ),
  weeklyHoursLimit: HoursLimitSchema,
  monthlyHoursLimit: HoursLimitSchema,
  unavailableDates: z.array(z.date()),
  unavailableTimeRanges: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
    }),
  ),
});

export type WorkApplicationInput = z.input<typeof workApplicationSchema>;
export type WorkApplication = z.output<typeof workApplicationSchema>;
