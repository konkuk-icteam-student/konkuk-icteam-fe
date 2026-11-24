'use client';

import { useId } from 'react';
import { IconAdd } from '@konkuk-icteam-fe/design-system/assets';
import { Button, ConfirmModal, Input, Message, Textarea } from '@konkuk-icteam-fe/design-system/ui';
import DateRangeField from '../../../_components/DateRangeField';
import useNoticeForm from '../../_hooks/useNoticeForm';

type NoticeFormProps = {
  onNotify: (message: string) => void;
};

export default function NoticeForm({ onNotify }: NoticeFormProps) {
  const errorIdPrefix = useId();
  const { compatibleState, compatibleHandlers } = useNoticeForm(onNotify);
  const { values, errors, isValid, isConfirmOpen } = compatibleState;
  const {
    handleTitleChange,
    handlePeriodChange,
    handleContentChange,
    handleNoticeSubmit,
    handleConfirmOpenChange,
    handleRegisterConfirm,
  } = compatibleHandlers;

  return (
    <form
      noValidate
      className='flex flex-col gap-[1.6rem]'
      onSubmit={(event) => void handleNoticeSubmit(event)}
    >
      <label className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>제목</span>
        <Input
          placeholder='공지 제목을 입력하세요'
          hasError={errors.title !== undefined}
          aria-invalid={errors.title !== undefined}
          aria-describedby={`${errorIdPrefix}-title`}
          onChange={handleTitleChange}
          value={values.title}
        />
        <Message id={`${errorIdPrefix}-title`} message={errors.title} variant='error' />
      </label>

      <div className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>게시 기간</span>
        <DateRangeField
          startDate={values.startDateKey}
          endDate={values.endDateKey}
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
          placeholder='공지 내용을 입력하세요'
          className='resize-none'
          hasError={errors.content !== undefined}
          aria-invalid={errors.content !== undefined}
          aria-describedby={`${errorIdPrefix}-content`}
          onChange={handleContentChange}
          value={values.content}
        />
        <Message id={`${errorIdPrefix}-content`} message={errors.content} variant='error' />
      </label>

      <Button type='submit' size='medium' color='blue' className='gap-[0.4rem]' disabled={!isValid}>
        <IconAdd aria-hidden className='h-[1.8rem] w-[1.8rem]' />
        공지 등록
      </Button>

      <ConfirmModal
        open={isConfirmOpen}
        handleOpenChange={handleConfirmOpenChange}
        title='공지사항을 등록하시겠습니까?'
        description='등록한 공지는 수정할 수 없습니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          {
            label: '등록하기',
            color: 'blue',
            size: 'medium',
            onClick: () => void handleRegisterConfirm(),
          },
        ]}
      />
    </form>
  );
}
