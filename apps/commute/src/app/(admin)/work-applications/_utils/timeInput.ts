// 직접 입력한 시각 모양 (24시간 HH:mm)
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * 직접 입력한 글자를 HH:mm 모양으로 맞춥니다. 숫자만 남기고 4자리까지 받으며, 두 자리 뒤에 콜론을 넣습니다.
 * @param value 입력한 글자
 * @returns 맞춘 글자 (예: '17', '17:0', '17:00')
 * @example formatTimeInput('1700'); // '17:00'
 */
export const formatTimeInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
};

/**
 * 직접 입력한 시각이 24시간 HH:mm 모양인지 확인합니다.
 * @param value 입력한 글자
 * @returns HH:mm 모양이면 true
 * @example checkTimeFormat('09:00'); // true
 * @example checkTimeFormat('25:00'); // false
 */
export const checkTimeFormat = (value: string) => TIME_PATTERN.test(value);
