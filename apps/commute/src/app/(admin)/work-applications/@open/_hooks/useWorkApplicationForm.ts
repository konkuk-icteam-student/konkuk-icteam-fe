import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import {
  saveWorkApplication,
  type GetWorkApplicationRequest,
} from '../../../_apis/workApplications';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workApplicationSchema,
  type WorkApplication,
  type WorkApplicationInput,
} from '../_lib/workApplicationSchema';
import { toWorkApplicationSettings } from '../_utils/work';

// 그 달 근로신청 기준 폼. 신청을 열거나, 이미 연 신청의 기준을 고쳐 저장한다
export default function useWorkApplicationForm(
  yearMonth: GetWorkApplicationRequest,
  onNotify: (message: string, variant?: 'success' | 'error') => void,
) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  //todo: 해당 달에 근로신청이 이미 열려있다면, 그 신청의 기준을 불러와서 defaultValues로 넣어주기
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<WorkApplicationInput, unknown, WorkApplication>({
    resolver: zodResolver(workApplicationSchema),
    defaultValues: {
      applyDate: { startDate: '', endDate: '', startTime: '', endTime: '' },
      maxWorkers: null,
      weeklyHoursLimit: { min: null, max: null },
      monthlyHoursLimit: { min: null, max: null },
      unavailableDates: [],
      unavailableTimeRanges: [],
    },
    mode: 'onChange',
  });

  const formData = useWatch({ control, compute: (values: WorkApplicationInput) => values });

  const updateApplyDate = (value: WorkApplication['applyDate']) => {
    setValue('applyDate', value, { shouldValidate: true });
  };

  const toNullableNumber = (value: string) => (value === '' ? null : Number(value));

  const updateMaxWorkers = (value: string) => {
    setValue('maxWorkers', toNullableNumber(value), { shouldValidate: true });
  };

  const updateHoursLimit = (
    name: 'weeklyHoursLimit' | 'monthlyHoursLimit',
    key: 'min' | 'max',
    value: string,
  ) => {
    setValue(name, { ...formData[name], [key]: toNullableNumber(value) }, { shouldValidate: true });
  };

  const updateWeeklyHoursLimit = (key: 'min' | 'max', value: string) =>
    updateHoursLimit('weeklyHoursLimit', key, value);

  const updateMonthlyHoursLimit = (key: 'min' | 'max', value: string) =>
    updateHoursLimit('monthlyHoursLimit', key, value);

  const updateUnavailableDates = (dates: Date[]) => {
    setValue('unavailableDates', dates, { shouldValidate: true });
  };

  const updateUnavailableTimeRanges = (timeRanges: { start: string; end: string }[]) => {
    setValue('unavailableTimeRanges', timeRanges, { shouldValidate: true });
  };

  const formHandlers = {
    updateApplyDate,
    updateMaxWorkers,
    updateWeeklyHoursLimit,
    updateMonthlyHoursLimit,
    updateUnavailableDates,
    updateUnavailableTimeRanges,
  };

  // 칸을 다 채웠으면 확인 모달부터 띄운다
  const handleSubmitForm = handleSubmit(() => setIsConfirmOpen(true));

  // 확인하면 저장하고 모달을 닫는다. 요약 슬롯도 새 기준을 다시 읽게 새로 고친다
  const handleConfirmSubmit = handleSubmit((data) => {
    try {
      saveWorkApplication({ ...yearMonth, settings: toWorkApplicationSettings(data) });
      setIsConfirmOpen(false);
      onNotify(`${yearMonth.month}월 근로신청을 열었어요.`);
      router.refresh();
    } catch {
      onNotify('근로신청을 열지 못했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  });

  return {
    handleSubmitForm,
    handleConfirmSubmit,
    isConfirmOpen,
    setIsConfirmOpen,
    errors,
    formData,
    formHandlers,
  };
}
