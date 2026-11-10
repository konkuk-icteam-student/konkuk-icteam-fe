import type { DefaultValues } from 'react-hook-form';
import { z } from 'zod';

/**
 * 공지 등록 폼 스키마를 만듭니다. 게시 기간에 오늘 이전 날짜는 넣을 수 없습니다.
 * @param minStartDate 고를 수 있는 가장 이른 시작일 (0시)
 * @returns 제목과 내용은 앞뒤 공백을 빼고 돌려주는 zod 스키마
 * @example createNoticeSchema(today).safeParse(values).success; // false (시작일이 어제면)
 */
export const createNoticeSchema = (minStartDate: Date) =>
  z.object({
    title: z.string().trim().min(1, '제목을 입력해 주세요.'),
    content: z.string().trim().min(1, '내용을 입력해 주세요.'),
    startDate: z
      .date({ error: '게시 기간을 골라 주세요.' })
      .min(minStartDate, '오늘 이전 날짜는 고를 수 없어요.'),
    endDate: z.date({ error: '게시 기간을 골라 주세요.' }),
  });

export type NoticeFormValues = z.infer<ReturnType<typeof createNoticeSchema>>;

// 게시 기간은 고르기 전까지 비워 둔다
export const defaultNoticeFormValues: DefaultValues<NoticeFormValues> = {
  title: '',
  content: '',
};
