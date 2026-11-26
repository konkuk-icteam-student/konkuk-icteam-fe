'use client';

import { Fragment } from 'react';
import { Button, ConfirmModal, Input } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import useWorkApplicationForm from '../_hooks/useWorkApplicationForm';
import ApplyPeriodSection from './ApplyPeriodSection';
import FieldLayout from './FieldLayout';
import { UnavailableDatesSection, UnavailableTimeRangesSection } from './UnavailableSections';
import { getNextYearMonth } from '@/shared/utils/calendar';

// 근로신청 열기
export default function OpenApplicationPanel() {
  const yearMonth = getNextYearMonth();
  const { showToast, toast } = useToast();
  const {
    handleSubmitForm,
    handleConfirmSubmit,
    isConfirmOpen,
    setIsConfirmOpen,
    errors,
    formData,
    formHandlers,
  } = useWorkApplicationForm(yearMonth, showToast);
  const hoursLimitRows = [
    {
      label: '주간',
      limit: formData.weeklyHoursLimit,
      error: errors.weeklyHoursLimit,
      onChange: formHandlers.updateWeeklyHoursLimit,
    },
    {
      label: '월간',
      limit: formData.monthlyHoursLimit,
      error: errors.monthlyHoursLimit,
      onChange: formHandlers.updateMonthlyHoursLimit,
    },
  ];

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
              if (error?.min || error?.max) return `${label} 근로시간을 모두 입력해 주세요.`;
              if (error?.message) return `${label} ${error.message}`;
              return undefined;
            })
            .find(Boolean)}
        >
          <div className='grid grid-cols-[3.2rem_1fr_auto_1fr_auto] items-center gap-x-[0.8rem] gap-y-[0.8rem]'>
            {hoursLimitRows.map(({ label, limit, error, onChange }) => (
              <Fragment key={label}>
                <span className='caption-14-md text-gray-700'>{label}</span>
                <Input
                  type='number'
                  min={0}
                  aria-label={`${label} 최소`}
                  placeholder='최소'
                  hasError={error?.min !== undefined || error?.message !== undefined}
                  value={limit.min ?? ''}
                  onChange={(event) => onChange('min', event.target.value)}
                />
                <span className='caption-14-md text-gray-500'>~</span>
                <Input
                  type='number'
                  min={0}
                  aria-label={`${label} 최대`}
                  placeholder='최대'
                  hasError={error?.max !== undefined || error?.message !== undefined}
                  value={limit.max ?? ''}
                  onChange={(event) => onChange('max', event.target.value)}
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

      <div className='col-span-2 flex justify-end border-t border-gray-50 pt-[2.4rem]'>
        <Button
          display='inline'
          size='medium'
          color='blue'
          className='w-[14rem]'
          onClick={() => void handleSubmitForm()}
        >
          신청 받기
        </Button>
      </div>

      <ConfirmModal
        open={isConfirmOpen}
        handleOpenChange={setIsConfirmOpen}
        title={`${yearMonth.month}월 근로신청을 열까요?`}
        description='신청 기간 동안 근로장학생이 근무 시간을 신청할 수 있어요.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          {
            label: '열기',
            color: 'blue',
            size: 'medium',
            onClick: () => void handleConfirmSubmit(),
          },
        ]}
      />
      {toast}
    </div>
  );
}
