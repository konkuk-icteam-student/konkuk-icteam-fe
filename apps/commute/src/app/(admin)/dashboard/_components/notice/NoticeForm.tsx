'use client';

import { useId } from 'react';
import { IconAdd } from '@konkuk-icteam-fe/design-system/assets';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { Button, Input, Message, Textarea } from '@konkuk-icteam-fe/design-system/ui';
import type { Notice, NoticeInput } from '../../../_apis/notices';
import DateRangeField from '../../../_components/DateRangeField';
import { useNoticeForm } from '../../_hooks/useNoticeForm';

type NoticeFormProps = {
  // 고치는 공지. 없으면 새 공지를 등록한다
  notice?: Notice;
  onSubmit: (input: NoticeInput) => void;
  onCancel?: () => void;
};

// 공지 등록·수정 폼. 제목, 게시 기간, 내용을 받는다. 게시 기간 동안만 근로학생에게 보인다
export default function NoticeForm({ notice, onSubmit, onCancel }: NoticeFormProps) {
  const {
    isEditing,
    isValid,
    register,
    startDate,
    endDate,
    errors,
    handlePeriodChange,
    handleFormSubmit,
  } = useNoticeForm(notice, onSubmit);
  const errorIdPrefix = useId();

  return (
    <form noValidate className='flex flex-col gap-[1.6rem]' onSubmit={handleFormSubmit}>
      <label className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>제목</span>
        <Input
          placeholder='공지 제목을 입력하세요'
          hasError={errors.title !== undefined}
          aria-invalid={errors.title !== undefined}
          aria-describedby={`${errorIdPrefix}-title`}
          {...register('title')}
        />
        <Message id={`${errorIdPrefix}-title`} message={errors.title} variant='error' />
      </label>

      <div className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>게시 기간</span>
        <DateRangeField
          startDate={toISO(startDate)}
          endDate={toISO(endDate)}
          placeholder='게시 기간을 골라 주세요'
          disablePastDates
          onChange={handlePeriodChange}
        />
        <Message id={`${errorIdPrefix}-period`} message={errors.period} variant='error' />
      </div>

      <label className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>내용</span>
        <Textarea
          rows={5}
          placeholder='근무자에게 알릴 내용을 입력하세요'
          className='resize-none'
          hasError={errors.content !== undefined}
          aria-invalid={errors.content !== undefined}
          aria-describedby={`${errorIdPrefix}-content`}
          {...register('content')}
        />
        <Message id={`${errorIdPrefix}-content`} message={errors.content} variant='error' />
      </label>

      <div className='flex flex-col gap-[0.6rem]'>
        {isEditing ? (
          <div className='grid grid-cols-2 gap-[0.8rem]'>
            <Button size='medium' tone='subtle_2' color='gray' onClick={onCancel}>
              취소
            </Button>
            <Button type='submit' size='medium' color='blue' disabled={!isValid}>
              수정 저장
            </Button>
          </div>
        ) : (
          <>
            <Button
              type='submit'
              size='medium'
              color='blue'
              className='gap-[0.4rem]'
              disabled={!isValid}
            >
              <IconAdd aria-hidden className='h-[1.8rem] w-[1.8rem]' />
              공지 등록
            </Button>
            <p className='caption-10-md text-center text-gray-400'>
              게시 기간 동안 모든 근무자에게 보입니다
            </p>
          </>
        )}
      </div>
    </form>
  );
}
