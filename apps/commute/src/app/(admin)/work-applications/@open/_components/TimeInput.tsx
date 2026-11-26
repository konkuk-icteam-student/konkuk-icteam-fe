import { Input } from '@konkuk-icteam-fe/design-system/ui';
import { formatTimeInput } from '../_utils/time';

type TimeInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'inputMode' | 'maxLength' | 'value' | 'onChange'
> & {
  value: string;
  // 숫자만 쳐도 'HH:mm' 모양으로 바꿔서 넘긴다
  onChange: (value: string) => void;
};

// 시각(HH:mm) 입력칸
export default function TimeInput({ value, onChange, ...props }: TimeInputProps) {
  return (
    <Input
      {...props}
      type='text'
      inputMode='numeric'
      maxLength={5}
      value={value}
      onChange={(event) => onChange(formatTimeInput(event.target.value))}
    />
  );
}
