import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import {
  getWorkApplication,
  saveWorkApplication,
  type GetWorkApplicationRequest,
} from '../../../_apis/workApplications';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workApplicationSchema,
  type WorkApplication,
  type WorkApplicationInput,
} from '../_lib/workApplicationSchema';
import { toWorkApplicationInput, toWorkApplicationSettings } from '../_utils/work';
import { useApplicationEditor } from '../../_components/ApplicationEditor';

// 그 달 근로신청 기준 폼. 신청을 열거나, 이미 연 신청의 기준을 고쳐 저장한다
export default function useWorkApplicationForm(
  yearMonth: GetWorkApplicationRequest,
  onNotify: (message: string, variant?: 'success' | 'error') => void,
) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // 이미 연 달은 저장된 기준을 채워 둔다. 고쳐 저장해도 들어온 근로신청은 그대로 남는다
  const [{ isOpened, settings }] = useState(() => getWorkApplication(yearMonth));
  const { finishEditing } = useApplicationEditor();
  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<WorkApplicationInput, unknown, WorkApplication>({
    resolver: zodResolver(workApplicationSchema),
    defaultValues: settings
      ? toWorkApplicationInput(settings)
      : {
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
    setValue(`${name}.${key}`, toNullableNumber(value));
    // 묶음 이름만 검증하면 RHF가 하위 칸 에러를 지워서, 묶음(최소 ≤ 최대·주간 ≤ 월간) 다음에 하위 칸을 검증한다
    // 주간을 고쳐도 월간 에러가 바뀌어서 두 묶음을 다 검증한다
    void trigger(
      (['weeklyHoursLimit', 'monthlyHoursLimit'] as const).flatMap((group) => [
        group,
        `${group}.min` as const,
        `${group}.max` as const,
      ]),
    );
  };

  const updateUnavailableDates = (dates: Date[]) => {
    setValue('unavailableDates', dates, { shouldValidate: true });
  };

  const updateUnavailableTimeRanges = (timeRanges: { start: string; end: string }[]) => {
    setValue('unavailableTimeRanges', timeRanges, { shouldValidate: true });
  };

  const formHandlers = {
    updateApplyDate,
    updateMaxWorkers,
    updateHoursLimit,
    updateUnavailableDates,
    updateUnavailableTimeRanges,
  };

  // 칸을 다 채웠으면 확인 모달부터 띄운다
  const handleSubmitForm = handleSubmit(() => setIsConfirmOpen(true));

  // 확인하면 저장하고 모달을 닫는다. 요약 슬롯도 새 기준을 다시 읽게 새로 고친다
  const handleConfirmSubmit = handleSubmit((data) => {
    try {
      saveWorkApplication({
        ...yearMonth,
        settings: toWorkApplicationSettings(data),
      });
      setIsConfirmOpen(false);
      // 저장하면 기준 보기로 돌아간다
      finishEditing(
        isOpened
          ? `${yearMonth.month}월 근로신청 기준을 수정했어요.`
          : `${yearMonth.month}월 근로신청을 열었어요.`,
      );
      router.refresh();
    } catch {
      onNotify('근로신청을 열지 못했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  });

  return {
    handleSubmitForm,
    handleConfirmSubmit,
    cancelEditing: () => finishEditing(),
    isConfirmOpen,
    setIsConfirmOpen,
    isOpened,
    errors,
    formData,
    formHandlers,
  };
}
