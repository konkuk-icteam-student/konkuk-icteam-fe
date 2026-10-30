'use client';

import { ComboBox } from '@konkuk-icteam-fe/design-system/ui';
import { getSchoolEmailSuggestions } from '../_utils/schoolEmail';

type SchoolEmailInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  // 안쪽 입력칸에 넘길 속성 (라벨과 잇는 id, 오류 표시, ref 등). 메일 칸 기본값을 덮어쓸 수 있다
  inputProps?: React.ComponentProps<typeof ComboBox>['inputProps'];
};

// 학교 메일 칸 (로그인·회원가입 공통). 아이디만 입력해도 @konkuk.ac.kr을 붙인 메일을 후보로 띄운다
export default function SchoolEmailInput({
  value,
  onChange,
  onBlur,
  inputProps,
}: SchoolEmailInputProps) {
  return (
    <ComboBox
      options={getSchoolEmailSuggestions(value)}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder='아이디@konkuk.ac.kr'
      showEmptyMessage={false}
      inputProps={{
        type: 'email',
        inputMode: 'email',
        autoComplete: 'username',
        hasBorder: true,
        ...inputProps,
      }}
    />
  );
}
