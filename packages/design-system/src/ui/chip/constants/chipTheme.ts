type ChipTheme = {
  chipClassName: string;
  labelClassName: string;
};

export type ChipTone =
  | 'gray'
  | 'blue'
  | 'red'
  | 'purple'
  | 'green'
  | 'black'
  | 'white'
  | 'lavender'
  | 'cotton'
  | 'powder'
  | 'sage'
  | 'peach'
  | 'blush'
  | 'mauve'
  | 'dusk'
  | 'navy'
  | 'gold';

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
  // 팔레트 색: 다른 tone처럼 subtle은 연한 파스텔 배경에 같은 계열 진한 글자, solid는 진한 색으로 채운다
  lavender: {
    subtle: { chipClassName: 'bg-lavender-200/20', labelClassName: 'text-lavender-600' },
    solid: { chipClassName: 'bg-lavender-600', labelClassName: 'text-black-1' },
  },
  cotton: {
    subtle: { chipClassName: 'bg-cotton-100/25', labelClassName: 'text-cotton-600' },
    solid: { chipClassName: 'bg-cotton-600', labelClassName: 'text-black-1' },
  },
  powder: {
    subtle: { chipClassName: 'bg-powder-100/25', labelClassName: 'text-powder-600' },
    solid: { chipClassName: 'bg-powder-600', labelClassName: 'text-black-1' },
  },
  sage: {
    subtle: { chipClassName: 'bg-sage/30', labelClassName: 'text-sage-600' },
    solid: { chipClassName: 'bg-sage-600', labelClassName: 'text-black-1' },
  },
  peach: {
    subtle: { chipClassName: 'bg-peach-100/40', labelClassName: 'text-peach-600' },
    solid: { chipClassName: 'bg-peach-600', labelClassName: 'text-black-1' },
  },
  blush: {
    subtle: { chipClassName: 'bg-blush-100/30', labelClassName: 'text-blush-600' },
    solid: { chipClassName: 'bg-blush-600', labelClassName: 'text-black-1' },
  },
  mauve: {
    subtle: { chipClassName: 'bg-mauve-300/10', labelClassName: 'text-mauve-600' },
    solid: { chipClassName: 'bg-mauve-600', labelClassName: 'text-black-1' },
  },
  dusk: {
    subtle: { chipClassName: 'bg-dusk-100/30', labelClassName: 'text-dusk-500' },
    solid: { chipClassName: 'bg-dusk-500', labelClassName: 'text-black-1' },
  },
  navy: {
    subtle: { chipClassName: 'bg-navy-700/5', labelClassName: 'text-navy-700' },
    solid: { chipClassName: 'bg-navy-700', labelClassName: 'text-black-1' },
  },
  gold: {
    subtle: { chipClassName: 'bg-gold-400/10', labelClassName: 'text-gold-600' },
    solid: { chipClassName: 'bg-gold-600', labelClassName: 'text-black-1' },
  },
};
