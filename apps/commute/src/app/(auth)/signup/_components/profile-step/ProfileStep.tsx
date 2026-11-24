import { Button, Input, Message, Dropdown } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../../_apis/workDepartments';
import FormField from '../../../_components/FormField';
import type { SignupFormState } from '../../_hooks/useSignupForm';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type ProfileStepProps = Pick<SignupFormState, 'formValues' | 'formErrors' | 'formHandlers'> & {
  workDepartments: WorkDepartment[];
  isSubmitting: boolean;
};

export default function ProfileStep({
  formValues,
  formErrors,
  formHandlers,
  workDepartments,
  isSubmitting,
}: ProfileStepProps) {
  return (
    <>
      <FormField label='이름' htmlFor='name' error={formErrors.name}>
        <Input
          id='name'
          name='name'
          value={formValues.name}
          onChange={(event) => formHandlers.updateName(event.target.value)}
          autoComplete='name'
          placeholder='이름을 입력해 주세요'
          hasError={formErrors.name !== undefined}
          aria-invalid={formErrors.name !== undefined}
          aria-describedby='name-error'
        />
      </FormField>

      <div className='flex flex-col gap-[0.8rem]'>
        <span id='work-department-label' className='font-14-bd text-black'>
          근무 부서
        </span>
        <div className='flex flex-col'>
          <WorkDepartmentSelect
            id='work-department'
            workDepartments={workDepartments}
            value={formValues.workDepartmentId}
            onChange={formHandlers.updateWorkDepartment}
            labelId='work-department-label'
            errorId='work-department-error'
            hasError={formErrors.workDepartmentId !== undefined}
          />
          <Message
            id='work-department-error'
            message={formErrors.workDepartmentId}
            variant='error'
          />
        </div>
      </div>

      <Button type='submit' color='blue' isLoading={isSubmitting}>
        가입하기
      </Button>
    </>
  );
}

type WorkDepartmentSelectProps = {
  id: string;
  workDepartments: WorkDepartment[];
  value: number | undefined;
  onChange: (workDepartmentId: number) => void;
  labelId: string;
  errorId: string;
  hasError: boolean;
};

const WorkDepartmentSelect = ({
  id,
  workDepartments,
  value,
  onChange,
  labelId,
  errorId,
  hasError,
}: WorkDepartmentSelectProps) => {
  const selectedName =
    workDepartments.find(({ workDepartmentId }) => workDepartmentId === value)?.name ?? '';

  const handleNameChange = (name: string) => {
    const selected = workDepartments.find((workDepartment) => workDepartment.name === name);
    if (selected) onChange(selected.workDepartmentId);
  };

  return (
    <div
      id={id}
      role='group'
      aria-labelledby={labelId}
      aria-describedby={errorId}
      className='relative z-10'
    >
      <Dropdown
        options={workDepartments.map(({ name }) => name)}
        value={selectedName}
        onChange={handleNameChange}
        placeholder='근무 부서를 골라 주세요'
        triggerClassName={cn(hasError && 'border-red focus:border-red')}
        optionWrapperClassName='max-h-[16.8rem]'
      />
    </div>
  );
};
