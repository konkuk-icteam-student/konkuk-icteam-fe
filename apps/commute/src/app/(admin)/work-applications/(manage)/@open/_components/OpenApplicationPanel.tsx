'use client';

import { Fragment } from 'react';
import { Button, ConfirmModal, Input } from '@konkuk-icteam-fe/design-system/ui';
import useWorkApplicationForm from '../_hooks/useWorkApplicationForm';
import ApplyPeriodSection from './ApplyPeriodSection';
import FieldLayout from './FieldLayout';
import { UnavailableDatesSection, UnavailableTimeRangesSection } from './UnavailableSections';

// 근로신청 열기
export default function OpenApplicationPanel() {
  const {
    handleSubmitForm,
    handleConfirmSubmit,
    cancelEditing,
    isConfirmOpen,
    setIsConfirmOpen,
    isOpened,
    yearMonth,
    copy,
    errors,
    formData,
    formHandlers,
  } = useWorkApplicationForm();
  const hoursLimitRows = [
    {
      label: '주간',
      name: 'weeklyHoursLimit',
      limit: formData.weeklyHoursLimit,
      error: errors.weeklyHoursLimit,
    },
    {
      label: '월간',
      name: 'monthlyHoursLimit',
      limit: formData.monthlyHoursLimit,
      error: errors.monthlyHoursLimit,
    },
  ] as const;

  return (
    <div className='bg-black-1 mx-[2.1rem] mb-[2rem] grid grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[3rem]'>
      <div className='flex flex-col gap-[3.2rem]'>
        <ApplyPeriodSection
          value={formData.applyDate}
          errors={errors.applyDate}
          onChange={formHandlers.updateApplyDate}
        />

        <FieldLayout
          title='근로시간 기준'
          errorId='hours-limit-error'
          errorMessage={hoursLimitRows
            .map(({ label, error }) => {
              const message = error?.min?.message ?? error?.max?.message ?? error?.message;
              return message && `${label} ${message}`;
            })
            .find(Boolean)}
        >
          <div className='grid grid-cols-[3.2rem_1fr_auto_1fr_auto] items-center gap-x-[0.8rem] gap-y-[0.8rem]'>
            {hoursLimitRows.map(({ label, name, limit, error }) => (
              <Fragment key={label}>
                <span className='caption-14-md text-gray-700'>{label}</span>
                <Input
                  type='number'
                  min={0}
                  aria-label={`${label} 최소`}
                  placeholder='최소'
                  hasError={error?.min !== undefined || error?.message !== undefined}
                  value={limit.min ?? ''}
                  onChange={(event) =>
                    formHandlers.updateHoursLimit(name, 'min', event.target.value)
                  }
                />
                <span className='caption-14-md text-gray-500'>~</span>
                <Input
                  type='number'
                  min={0}
                  aria-label={`${label} 최대`}
                  placeholder='최대'
                  hasError={error?.max !== undefined || error?.message !== undefined}
                  value={limit.max ?? ''}
                  onChange={(event) =>
                    formHandlers.updateHoursLimit(name, 'max', event.target.value)
                  }
                />
                <span className='caption-14-md text-gray-500'>시간</span>
              </Fragment>
            ))}
          </div>
        </FieldLayout>
        <FieldLayout
          title='동시 근무 최대 인원'
          errorId='max-workers-error'
          errorMessage={errors.maxWorkers?.message}
        >
          <div className='flex items-center gap-[0.8rem]'>
            <div className='w-[12rem]'>
              <Input
                type='number'
                min={0}
                aria-label='동시 근무 최대 인원'
                placeholder='4'
                hasError={errors.maxWorkers !== undefined}
                aria-invalid={errors.maxWorkers !== undefined}
                aria-describedby='max-workers-error'
                value={formData.maxWorkers ?? ''}
                onChange={(event) => formHandlers.updateMaxWorkers(event.target.value)}
              />
            </div>
            <span className='caption-14-md text-gray-500'>명</span>
          </div>
        </FieldLayout>
      </div>

      <div className='flex flex-col gap-[3.2rem]'>
        <UnavailableDatesSection
          yearMonth={yearMonth}
          value={formData.unavailableDates}
          onChange={formHandlers.updateUnavailableDates}
        />
        <UnavailableTimeRangesSection
          value={formData.unavailableTimeRanges}
          onChange={formHandlers.updateUnavailableTimeRanges}
        />
      </div>

      <div className='col-span-2 flex items-center justify-end gap-[1.6rem] border-t border-gray-50 pt-[2.4rem]'>
        {isOpened && (
          <Button
            display='inline'
            size='medium'
            color='gray'
            tone='subtle_2'
            className='w-[14rem]'
            onClick={cancelEditing}
          >
            취소
          </Button>
        )}
        <Button
          display='inline'
          size='medium'
          color='blue'
          className='w-[14rem]'
          onClick={() => void handleSubmitForm()}
        >
          {copy.submitLabel}
        </Button>
      </div>

      <ConfirmModal
        open={isConfirmOpen}
        handleOpenChange={setIsConfirmOpen}
        title={copy.confirmTitle(yearMonth.month)}
        description={copy.confirmDescription}
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          {
            label: copy.confirmLabel,
            color: 'blue',
            size: 'medium',
            onClick: () => void handleConfirmSubmit(),
          },
        ]}
      />
    </div>
  );
}
