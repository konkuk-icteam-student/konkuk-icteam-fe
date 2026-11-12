'use client';

import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import { getWorkApplication, saveWorkApplication } from '../_apis/workApplications';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../_utils/monthKey';
import ApplicationSummaryModal from './_components/ApplicationSummaryModal';
import SettingsPanel from './_components/SettingsPanel';
import ApplicationSummaryPanel from './_components/ApplicationSummaryPanel';
import { createDefaultSettings } from './_utils/createDefaultSettings';
import {
  workApplicationSchema,
  type SettingsErrors,
  type WorkApplication,
} from './_lib/workApplicationSchema';

/**
 * 그 달 근로신청 폼의 처음 값을 만듭니다. 연 달은 저장된 값, 처음 여는 달은 기본 설정입니다.
 * @param monthKey 근로신청 달 (YYYY-MM)
 * @returns 폼에 채울 근로신청
 * @example createInitialApplication('2026-11').settings.maxConcurrentWorkers; // 4
 */
const createInitialApplication = (monthKey: string): WorkApplication => ({
  settings: getWorkApplication(parseMonthKey(monthKey)).settings ?? createDefaultSettings(monthKey),
});

// 근로신청 관리. 신청은 다음 달만 열 수 있어서 다음 달 하나만 다룬다.
// 왼쪽에서 신청 기준을 정하고, 오른쪽에서 들어온 신청을 요약해 본다
export default function PageClient() {
  const [currentMonthKey] = useState(getCurrentMonthKey);
  // 이미 연 신청을 고치는 중인지. 열기 전에는 늘 고칠 수 있다
  const [isEditing, setIsEditing] = useState(false);
  // 확인 창에 요약해 보여 줄 값. 저장 버튼을 누른 순간의 값으로 고정한다
  const [summary, setSummary] = useState<WorkApplication | null>(null);
  const { showToast, toast } = useToast();

  const monthKey = shiftMonthKey(currentMonthKey, 1);
  const { control, formState, getValues, handleSubmit, reset, trigger } = useForm<WorkApplication>({
    resolver: zodResolver(workApplicationSchema),
    defaultValues: createInitialApplication(monthKey),
  });

  // 요약 패널에 왼쪽에서 고르고 있는 근무 불가 날짜를 바로 보여 준다
  const unavailableDates = useWatch({ control, name: 'settings.unavailableDates' });

  const [, month] = monthKey.split('-').map(Number);
  const monthLabel = `${month}월`;
  const { isOpened, settings: savedSettings } = getWorkApplication(parseMonthKey(monthKey));
  const isEditable = !isOpened || isEditing;
  // 고칠 수 있을 때만 칸 아래에 오류를 보여 준다
  const settingsErrors: SettingsErrors = isEditable
    ? Object.fromEntries(
        Object.entries(formState.errors.settings ?? {}).map(([key, error]) => [
          key,
          (error as { message?: string } | undefined)?.message,
        ]),
      )
    : {};

  // 저장된 값으로 되돌린다
  const handleEditCancel = () => {
    setIsEditing(false);
    reset(createInitialApplication(monthKey));
  };

  const handleSaveConfirm = (application: WorkApplication) => {
    saveWorkApplication({ ...parseMonthKey(monthKey), ...application });
    setIsEditing(false);
    reset(application);
    showToast(
      isOpened ? `${monthLabel} 근로신청을 수정했어요.` : `${monthLabel} 근로신청을 열었어요.`,
    );
  };

  const statusChip = isOpened
    ? { label: '신청 받는 중', tone: 'blue' as const }
    : { label: '신청 시간 전', tone: 'gray' as const };

  return (
    <div className='mx-auto flex w-full max-w-[140rem] flex-col gap-[2.4rem] p-[3.4rem]'>
      <h1 className='title-26-eb flex items-center justify-start gap-[1rem] text-black'>
        {`${monthLabel} 근로신청 열기`}
        <StateChip label={statusChip.label} tone={statusChip.tone} />
      </h1>

      <div className='grid grid-cols-[minmax(0,1fr)_42rem] gap-[2.4rem]'>
        <Controller
          control={control}
          name='settings'
          render={({ field }) => (
            <SettingsPanel
              monthKey={monthKey}
              settings={field.value}
              isEditable={isEditable}
              errors={settingsErrors}
              onChange={(settings) => {
                field.onChange(settings);
                void trigger();
              }}
            />
          )}
        />
        {/* 높이를 왼쪽 설정 패널에만 맞추도록 요약 패널은 칸 안에 띄워 둔다 */}
        <div className='relative'>
          <div className='absolute inset-0'>
            <ApplicationSummaryPanel
              monthKey={monthKey}
              monthLabel={monthLabel}
              savedSettings={savedSettings}
              unavailableDates={unavailableDates}
            />
          </div>
        </div>
      </div>

      {/* 저장 버튼은 설정을 다 보고 누르도록 맨 아래에 둔다 */}
      <div className='flex items-center justify-end gap-[0.8rem]'>
        {isEditable ? (
          <>
            {isOpened && (
              <Button
                display='inline'
                size='medium'
                tone='subtle_2'
                color='gray'
                className='w-[10rem]'
                onClick={handleEditCancel}
              >
                취소
              </Button>
            )}
            <Button
              display='inline'
              size='medium'
              color='blue'
              className='w-[14rem]'
              disabled={!formState.isValid}
              onClick={() => setSummary(getValues())}
            >
              {isOpened ? '수정 저장' : '신청 받기'}
            </Button>
          </>
        ) : (
          <Button
            display='inline'
            size='medium'
            tone='subtle_2'
            color='black'
            className='w-[12rem]'
            onClick={() => setIsEditing(true)}
          >
            수정하기
          </Button>
        )}
      </div>

      <ApplicationSummaryModal
        application={summary}
        monthLabel={monthLabel}
        isOpened={isOpened}
        onClose={() => setSummary(null)}
        onConfirm={() => void handleSubmit(handleSaveConfirm)()}
      />
      {toast}
    </div>
  );
}
