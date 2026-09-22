type ChipTheme = {
  chipClassName: string;
  labelClassName: string;
};

export type ChipTone = 'gray' | 'blue' | 'red' | 'purple' | 'green' | 'black' | 'white';

// subtle: 옅은 배경 + tone 색 글자 / solid: tone 색으로 채운 배경
type ChipVariant = 'subtle' | 'solid';

/**
 * 칩 색 테마 = tone(색) x variant(옅은 배경 / 채운 배경).
 * - subtle: 옅은 배경에 tone 색 글자. black은 Button의 subtle_2처럼 gray-50 배경에 검정 글자,
 *   white는 Button의 subtle처럼 어두운 회색(gray-900) 배경에 흰 글자
 * - solid: tone 색으로 채우고 글자는 대비되는 색. white는 흰 배경에 검정 글자
 */
export const CHIP_THEME: Record<ChipTone, Record<ChipVariant, ChipTheme>> = {
  gray: {
    subtle: { chipClassName: 'bg-gray-50', labelClassName: 'text-gray-500' },
    solid: { chipClassName: 'bg-gray-700', labelClassName: 'text-black-1' },
  },
  blue: {
    subtle: { chipClassName: 'bg-blue/10', labelClassName: 'text-blue' },
    solid: { chipClassName: 'bg-blue', labelClassName: 'text-black-1' },
  },
  red: {
    subtle: { chipClassName: 'bg-red/10', labelClassName: 'text-red' },
    solid: { chipClassName: 'bg-red', labelClassName: 'text-black-1' },
  },
  purple: {
    subtle: { chipClassName: 'bg-purple/10', labelClassName: 'text-purple' },
    solid: { chipClassName: 'bg-purple', labelClassName: 'text-black-1' },
  },
  green: {
    subtle: { chipClassName: 'bg-green/10', labelClassName: 'text-green' },
    solid: { chipClassName: 'bg-green', labelClassName: 'text-black-1' },
  },
  black: {
    subtle: { chipClassName: 'bg-gray-50', labelClassName: 'text-black' },
    solid: { chipClassName: 'bg-black', labelClassName: 'text-black-1' },
  },
  white: {
    subtle: { chipClassName: 'bg-gray-900', labelClassName: 'text-black-1' },
    solid: { chipClassName: 'bg-black-1', labelClassName: 'text-black' },
  },
};
