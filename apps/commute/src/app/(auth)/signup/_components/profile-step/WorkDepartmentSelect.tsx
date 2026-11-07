'use client';

import { useImperativeHandle, useRef } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Dropdown } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkDepartment } from '../../../_apis/workDepartments';

type WorkDepartmentSelectProps = {
  workDepartments: WorkDepartment[];
  // 고른 근무 부서 id. 고르기 전에는 비어 있다
  value: number | undefined;
  onChange: (workDepartmentId: number | undefined) => void;
  onBlur?: () => void;
  // 칸 이름을 가진 요소의 id (Dropdown 펼침 버튼에 id를 줄 수 없어 묶음에 이름을 붙인다)
  labelId: string;
  errorId: string;
  hasError: boolean;
  // 폼이 오류 칸에 초점을 둘 때 쓴다
  ref?: React.Ref<{ focus: () => void }>;
};

// 근무 부서 고르기. 디자인 시스템 Dropdown은 고치지 않고 감싸서, 라벨·오류 테두리·초점·펼친 목록 겹침을 여기서 처리한다
export default function WorkDepartmentSelect({
  workDepartments,
  value,
  onChange,
  onBlur,
  labelId,
  errorId,
  hasError,
  ref,
}: WorkDepartmentSelectProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const selectedName =
    workDepartments.find(({ workDepartmentId }) => workDepartmentId === value)?.name ?? '';

  useImperativeHandle(ref, () => ({
    focus: () => groupRef.current?.querySelector('button')?.focus(),
  }));

  const handleNameChange = (name: string) => {
    onChange(
      workDepartments.find((workDepartment) => workDepartment.name === name)?.workDepartmentId,
    );
  };

  return (
    // 펼친 목록이 아래 버튼(꺼진 버튼은 opacity 때문에 위에 그려진다)에 가려지지 않게 위에 쌓는다
    <div
      ref={groupRef}
      role='group'
      aria-labelledby={labelId}
      aria-describedby={errorId}
      className={cn('relative z-10 rounded-[0.6rem]', hasError && 'ring-red ring-1')}
    >
      <Dropdown
        options={workDepartments.map(({ name }) => name)}
        value={selectedName}
        onChange={handleNameChange}
        onBlur={onBlur}
        placeholder='근무 부서를 골라 주세요'
        // 한 번에 4개씩 보이게 한다 (항목 4rem × 4 + 위아래 여백 0.8rem)
        optionWrapperClassName='max-h-[16.8rem]'
      />
    </div>
  );
}
