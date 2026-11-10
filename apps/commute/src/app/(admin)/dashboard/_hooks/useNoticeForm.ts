import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { createNotice } from '../../_apis/notices';
import {
  createNoticeSchema,
  defaultNoticeFormValues,
  type NoticeFormValues,
} from '../_lib/noticeSchema';

const SET_VALUE_OPTIONS = { shouldDirty: true, shouldValidate: true };

// TODO: react-query 도입 후 등록 성공 시 공지 목록 쿼리키 무효화
export default function useNoticeForm(onNotify: (message: string) => void) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(createNoticeSchema(parseISO(toISO(new Date())))),
    mode: 'onChange',
    defaultValues: defaultNoticeFormValues,
  });

  const { title, startDate, endDate, content } = useWatch({ control });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value, SET_VALUE_OPTIONS);
  };

  const handlePeriodChange = (startDateKey: string, endDateKey: string) => {
    setValue('startDate', parseISO(startDateKey), SET_VALUE_OPTIONS);
    setValue('endDate', parseISO(endDateKey), SET_VALUE_OPTIONS);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue('content', event.target.value, SET_VALUE_OPTIONS);
  };

  const handleNoticeSubmit = handleSubmit(() => setIsConfirmOpen(true));

  const handleConfirmOpenChange = (open: boolean) => setIsConfirmOpen(open);

  const handleRegisterConfirm = handleSubmit((values) => {
    createNotice(values);
    setIsConfirmOpen(false);
    onNotify('공지사항을 등록했어요.');
    reset();
  });

  const compatibleState = {
    values: {
      title: title ?? '',
      startDateKey: startDate ? toISO(startDate) : '',
      endDateKey: endDate ? toISO(endDate) : '',
      content: content ?? '',
    },
    errors: {
      title: errors.title?.message,
      period: errors.startDate?.message ?? errors.endDate?.message,
      content: errors.content?.message,
    },
    isValid,
    isConfirmOpen,
  };

  const compatibleHandlers = {
    handleTitleChange,
    handlePeriodChange,
    handleContentChange,
    handleNoticeSubmit,
    handleConfirmOpenChange,
    handleRegisterConfirm,
  };

  return {
    compatibleState,
    compatibleHandlers,
  };
}
