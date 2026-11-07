'use client';

import { useFormContext } from 'react-hook-form';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../../_apis/workDepartments';
import FormField from '../../../_components/FormField';
import useFormField from '../../../_hooks/useFormField';
import type { SignupFormValues } from '../../_lib/signupSchema';
import WorkDepartmentSelect from './WorkDepartmentSelect';

type ProfileStepProps = {
  workDepartments: WorkDepartment[];
  // 가입하는 중이거나 승인 대기 화면으로 넘어가는 중
  isSubmitting: boolean;
};

// 3단계: 이름과 근무 부서. [가입하기]를 누르면 폼이 전체를 검사하고 가입한다
export default function ProfileStep({ workDepartments, isSubmitting }: ProfileStepProps) {
  const form = useFormContext<SignupFormValues>();
  // 화면 순서대로 불러야 둘 다 틀렸을 때 이름 칸에 먼저 초점이 간다
  const name = useFormField(form, 'name');
  const workDepartment = useFormField(form, 'workDepartmentId');
  // 근무 부서 고르기는 입력칸이 아니라 inputProps를 펼쳐 넘기지 않으므로 ref만 꺼내 넘긴다
  const {
    inputProps: { ref: workDepartmentRef },
  } = workDepartment;
  // Dropdown 펼침 버튼에 id를 줄 수 없어 label 대신 이름 글자를 두고 묶음에 잇는다
  const workDepartmentLabelId = `${workDepartment.inputId}-label`;

  return (
    <div className='flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <FormField label='이름' htmlFor={name.inputId} errorProps={name.errorProps}>
          <Input
            {...name.field}
            {...name.inputProps}
            autoComplete='name'
            placeholder='이름을 입력해 주세요'
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
              value={workDepartment.field.value}
              onChange={workDepartment.field.onChange}
              onBlur={workDepartment.field.onBlur}
              labelId={workDepartmentLabelId}
              errorId={workDepartment.errorId}
              hasError={workDepartment.hasError}
            />
            <Message {...workDepartment.errorProps} />
          </div>
        </div>
      </div>

      <Button type='submit' color='blue' isLoading={isSubmitting}>
        가입하기
      </Button>
    </div>
  );
}
