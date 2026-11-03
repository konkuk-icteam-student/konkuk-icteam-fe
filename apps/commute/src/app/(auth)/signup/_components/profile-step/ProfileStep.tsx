'use client';

import { useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../../_apis/workDepartments';
import type { SignupFormValues } from '../../_lib/signupSchema';
import WorkDepartmentSelect from './WorkDepartmentSelect';

type ProfileStepProps = {
  workDepartments: WorkDepartment[];
  // 가입하는 중이거나 승인 대기 화면으로 넘어가는 중
  isSubmitting: boolean;
};

// 3단계: 이름과 근무 부서. [가입하기]를 누르면 폼이 전체를 검사하고 가입한다
export default function ProfileStep({ workDepartments, isSubmitting }: ProfileStepProps) {
  const { control, formState, register } = useFormContext<SignupFormValues>();
  // 화면 순서대로 등록해야 둘 다 틀렸을 때 이름 칸에 먼저 초점이 간다
  const nameRegistration = register('name');
  const {
    field: { ref: workDepartmentRef, ...workDepartmentField },
  } = useController({ control, name: 'workDepartmentId' });
  const fieldIdPrefix = useId();
  const nameError = formState.errors.name?.message;
  const workDepartmentError = formState.errors.workDepartmentId?.message;

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-name`} className='font-14-bd text-black'>
            이름
          </label>
          <div className='flex flex-col'>
            <Input
              id={`${fieldIdPrefix}-name`}
              autoComplete='name'
              placeholder='이름을 입력해 주세요'
              hasError={nameError !== undefined}
              aria-invalid={nameError !== undefined}
              aria-describedby={`${fieldIdPrefix}-name-error`}
              {...nameRegistration}
            />
            <Message id={`${fieldIdPrefix}-name-error`} message={nameError} variant='error' />
          </div>
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          {/* Dropdown 펼침 버튼에 id를 줄 수 없어 label 대신 이름 글자를 두고 묶음에 잇는다 */}
          <span id={`${fieldIdPrefix}-work-department`} className='font-14-bd text-black'>
            근무 부서
          </span>
          <div className='flex flex-col'>
            <WorkDepartmentSelect
              ref={workDepartmentRef}
              workDepartments={workDepartments}
              value={workDepartmentField.value}
              onChange={workDepartmentField.onChange}
              onBlur={workDepartmentField.onBlur}
              labelId={`${fieldIdPrefix}-work-department`}
              errorId={`${fieldIdPrefix}-work-department-error`}
              hasError={workDepartmentError !== undefined}
            />
            <Message
              id={`${fieldIdPrefix}-work-department-error`}
              message={workDepartmentError}
              variant='error'
            />
          </div>
        </div>
      </div>

      <Button type='submit' color='blue' isLoading={isSubmitting}>
        가입하기
      </Button>
    </div>
  );
}
