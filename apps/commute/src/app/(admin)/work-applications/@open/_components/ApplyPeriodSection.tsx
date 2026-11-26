import { Fragment } from 'react';
import type { FieldErrors } from 'react-hook-form';
import DateRangeField from '../../../_components/DateRangeField';
import type { WorkApplication } from '../_lib/workApplicationSchema';
import FieldLayout from './FieldLayout';
import TimeInput from './TimeInput';

type ApplyPeriodSectionProps = {
  value: WorkApplication['applyDate'];
  errors?: FieldErrors<WorkApplication>['applyDate'];
  onChange: (value: WorkApplication['applyDate']) => void;
};

const TIME_FIELDS = [
  { key: 'startTime', label: '신청 시작 시각', placeholder: '09:00' },
  { key: 'endTime', label: '신청 마감 시각', placeholder: '18:00' },
] as const;

export default function ApplyPeriodSection({ value, errors, onChange }: ApplyPeriodSectionProps) {
  const errorMessage =
    errors?.message ??
    errors?.startDate?.message ??
    errors?.startTime?.message ??
    errors?.endTime?.message;

  return (
    <FieldLayout title='신청 기간' errorId='apply-period-error' errorMessage={errorMessage}>
      <DateRangeField
        placeholder='신청 기간을 골라 주세요'
        disablePastDates
        startDate={value.startDate}
        endDate={value.endDate}
        onChange={(startDate, endDate) => onChange({ ...value, startDate, endDate })}
      />
      <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-[0.8rem]'>
        {TIME_FIELDS.map(({ key, label, placeholder }) => (
          <Fragment key={key}>
            {key === 'endTime' && <span className='caption-14-md text-gray-500'>~</span>}
            <TimeInput
              aria-label={label}
              placeholder={placeholder}
              value={value[key]}
              onChange={(time) => onChange({ ...value, [key]: time })}
            />
          </Fragment>
        ))}
      </div>
    </FieldLayout>
  );
}
