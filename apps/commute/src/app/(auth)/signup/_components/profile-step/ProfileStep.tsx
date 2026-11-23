'use client';

import { useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../../_apis/workDepartments';
import FormField from '../../../_components/FormField';
import type { SignupFormValues } from '../../_lib/signupSchema';
import WorkDepartmentSelect from './WorkDepartmentSelect';

type ProfileStepProps = {
  workDepartments: WorkDepartment[];
  isSubmitting: boolean;
};

export default function ProfileStep({ workDepartments, isSubmitting }: ProfileStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  // 화면 순서대로 등록해야 둘 다 틀렸을 때 이름 칸에 먼저 초점이 간다
  const nameField = register('name');
  // 근무 부서 고르기는 입력칸이 아니라 ref를 따로 꺼내 넘긴다. 같은 객체에서 ref와 값을 함께 읽으면 렌더 중에 ref를 읽는 것으로 본다
  const {
    field: { ref: workDepartmentRef, ...workDepartmentField },
  } = useController<SignupFormValues, 'workDepartmentId'>({ name: 'workDepartmentId' });
  const fieldIdPrefix = useId();
  const nameId = `${fieldIdPrefix}-name`;
  // Dropdown 펼침 버튼에 id를 줄 수 없어 label 대신 이름 글자를 두고 묶음에 잇는다
  const workDepartmentLabelId = `${fieldIdPrefix}-work-department-label`;
  const workDepartmentErrorId = `${fieldIdPrefix}-work-department-error`;
  const nameError = errors.name?.message;
  const workDepartmentError = errors.workDepartmentId?.message;

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='이름' htmlFor={nameId} error={nameError}>
          <Input
            id={nameId}
            {...nameField}
            autoComplete='name'
            placeholder='이름을 입력해 주세요'
            hasError={nameError !== undefined}
            aria-invalid={nameError !== undefined}
            aria-describedby={`${nameId}-error`}
          />
        </FormField>

        <div className='flex flex-col gap-[0.8rem]'>
          <span id={workDepartmentLabelId} className='font-14-bd text-black'>
            근무 부서
          </span>
          <div className='flex flex-col'>
            <WorkDepartmentSelect
              ref={workDepartmentRef}
              workDepartments={workDepartments}
              value={workDepartmentField.value}
              onChange={workDepartmentField.onChange}
              onBlur={workDepartmentField.onBlur}
              labelId={workDepartmentLabelId}
              errorId={workDepartmentErrorId}
              hasError={workDepartmentError !== undefined}
            />
            <Message id={workDepartmentErrorId} message={workDepartmentError} variant='error' />
          </div>
        </div>
      </div>

      <Button type='submit' color='blue' isLoading={isSubmitting}>
        가입하기
      </Button>
    </div>
  );
}
