import { useState, type FormEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import type { Notice, NoticeInput } from '../../_apis/notices';
import { createNoticeSchema, type NoticeFormValues } from '../_lib/noticeSchema';

// 새 공지는 오늘부터 일주일 동안 보이게 둔다
const DEFAULT_POSTING_DAYS = 7;

// 오늘 0시
const getToday = () => parseISO(toISO(new Date()));

/**
 * 공지 폼의 처음 값을 만듭니다. 고치는 공지가 있으면 그 값을, 없으면 오늘부터 일주일 게시로 둡니다.
 * @param notice 고치는 공지
 * @returns 폼 처음 값
 * @example createInitialValues().endDate; // 오늘 + 6일
 */
const createInitialValues = (notice?: Notice): NoticeFormValues => {
  if (notice) {
    const { title, content, startDate, endDate } = notice;
    return { title, content, startDate, endDate };
  }

  const startDate = getToday();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + DEFAULT_POSTING_DAYS - 1);

  return { title: '', content: '', startDate, endDate };
};

// 공지 등록·수정 폼의 값, 검증 오류, 제출. notice가 있으면 수정, 없으면 새 공지 등록
export const useNoticeForm = (
  notice: Notice | undefined,
  onSubmit: (input: NoticeInput) => void,
) => {
  const isEditing = notice !== undefined;
  // 오늘 이전은 고를 수 없다. 이미 게시 중인 공지는 원래 시작일을 그대로 둘 수 있다
  const [noticeSchema] = useState(() => {
    const today = getToday();
    const minStartDate = notice && notice.startDate < today ? notice.startDate : today;
    return createNoticeSchema(minStartDate);
  });
  const { control, formState, handleSubmit, register, reset, setValue } = useForm<NoticeFormValues>(
    {
      resolver: zodResolver(noticeSchema),
      mode: 'onChange',
      defaultValues: createInitialValues(notice),
    },
  );
  const [startDate, endDate] = useWatch({ control, name: ['startDate', 'endDate'] });
  const errors = {
    title: formState.errors.title?.message,
    // 시작일·마감일은 한 칸에서 고르니 오류도 한 줄로 보여 준다
    period: formState.errors.startDate?.message ?? formState.errors.endDate?.message,
    content: formState.errors.content?.message,
  };

  const handlePeriodChange = (startDateKey: string, endDateKey: string) => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue('startDate', parseISO(startDateKey), options);
    setValue('endDate', parseISO(endDateKey), options);
  };

  const handleValidSubmit = (values: NoticeFormValues) => {
    onSubmit(values);
    // 새 공지는 등록한 뒤 다음 공지를 쓰도록 비운다. 수정은 부모가 폼을 닫는다
    if (!isEditing) reset(createInitialValues());
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) =>
    void handleSubmit(handleValidSubmit)(event);

  return {
    isEditing,
    isValid: formState.isValid,
    register,
    startDate,
    endDate,
    errors,
    handlePeriodChange,
    handleFormSubmit,
  };
};
