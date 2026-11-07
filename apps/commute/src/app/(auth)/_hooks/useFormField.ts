import { useId } from 'react';
import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

type UseFormFieldOptions<TFieldValues extends FieldValues> = {
  // 이 칸을 고치면 함께 다시 검사할 칸 (예: 비밀번호를 고치면 비밀번호 확인). 오류가 떠 있을 때만 검사한다
  relatedFields?: FieldPath<TFieldValues>[];
};

// 폼 칸 하나를 잇는다. 값·바꾸기(field), 오류 문구, 입력칸과 오류 문구를 서로 잇는 id와 aria 속성을 한 번에 만든다.
// 라벨은 FormField에 inputId를 넘겨 잇는다.
// 부르는 순서대로 칸이 폼에 등록되므로, 여러 칸이 틀렸을 때 먼저 부른 칸에 초점이 간다. 화면 순서대로 부른다
const useFormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  form: Pick<UseFormReturn<TFieldValues>, 'control' | 'trigger' | 'getFieldState'>,
  name: TName,
  { relatedFields = [] }: UseFormFieldOptions<TFieldValues> = {},
) => {
  const { control, trigger, getFieldState } = form;
  // ref는 따로 꺼내 둔다. 같은 객체에서 ref와 값을 함께 읽으면 렌더 중에 ref를 읽는 것으로 본다
  const {
    field: { ref, onChange, ...field },
    fieldState,
  } = useController({ control, name });
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const error = fieldState.error?.message;
  const hasError = error !== undefined;

  // 오류가 떠 있는 칸은 고칠 때마다 다시 검사해, 올바르게 고치면 버튼을 누르지 않아도 오류 문구가 사라진다.
  // 단계별로 trigger만 쓰는 회원가입 폼은 제출 전이라 react-hook-form이 알아서 다시 검사하지 않는다.
  // 오류가 없는 칸은 검사하지 않아, 아직 입력하지 않은 칸에 오류가 미리 뜨지 않는다
  const handleChange = (...event: Parameters<typeof onChange>) => {
    onChange(...event);
    const fieldsWithError = [name, ...relatedFields].filter(
      (fieldName) => getFieldState(fieldName).error !== undefined,
    );
    if (fieldsWithError.length > 0) void trigger(fieldsWithError);
  };

  return {
    // name, value, onChange, onBlur
    field: { ...field, onChange: handleChange },
    error,
    hasError,
    inputId,
    errorId,
    // ref도 여기 넣어 펼쳐서 넘긴다. 폼이 오류 칸에 초점을 둘 때 쓴다
    inputProps: {
      ref,
      id: inputId,
      hasError,
      'aria-invalid': hasError,
      'aria-describedby': errorId,
    },
    errorProps: { id: errorId, message: error, variant: 'error' as const },
  };
};

export default useFormField;
