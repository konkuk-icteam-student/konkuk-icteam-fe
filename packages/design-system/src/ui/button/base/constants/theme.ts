import { ButtonAccent, ButtonDisplay, ButtonSize, ButtonTone } from '../types/variant';

export const BUTTON_BASE = 'items-center justify-center';

export const BUTTON_DISABLED = 'disabled:cursor-not-allowed disabled:opacity-40';

export const BUTTON_DISPLAY: Record<NonNullable<ButtonDisplay>, string> = {
  inline: 'inline-flex w-auto',
  block: 'flex',
};

export const BUTTON_SIZE: Record<NonNullable<ButtonSize>, string> = {
  small: 'py-[0.6rem] px-[1.2rem] caption-12-md rounded-[0.4rem]',
  medium: 'py-[1.25rem] w-full caption-14-md rounded-[0.6rem]',
  large: 'py-[1.3rem] w-full font-16-md rounded-[0.6rem]',
};

/**
 * 색 조합 = tone(배경 성격) x accent(강조색).
 * - subtle: 배경은 항상 gray-900(어두운 회색) 고정, 텍스트 색이 accent를 따름
 *   (white/gray/blue/red/purple 가능 — black은 어두운 배경과 겹쳐 보이지 않아 제공하지 않음)
 * - subtle_2: 배경은 항상 gray-50(밝은 회색) 고정, 텍스트 색이 accent를 따름
 *   (gray/blue/red/purple/black 가능 — white는 밝은 배경과 겹쳐 보이지 않아 제공하지 않음)
 * - solid: 배경이 accent를 따르고, 텍스트는 항상 흰색
 *   (gray/blue/red/purple/black 가능 — white는 배경과 텍스트가 겹쳐 보이지 않아 제공하지 않음)
 */
export const BUTTON_COLOR: Record<ButtonTone, Partial<Record<ButtonAccent, string>>> = {
  subtle: {
    white: 'bg-gray-900 text-black-1',
    gray: 'bg-gray-900 text-gray-400',
    blue: 'bg-gray-900 text-blue',
    red: 'bg-gray-900 text-red',
    purple: 'bg-gray-900 text-purple',
  },
  subtle_2: {
    gray: 'bg-gray-50 text-gray-400',
    blue: 'bg-gray-50 text-blue',
    red: 'bg-gray-50 text-red',
    purple: 'bg-gray-50 text-purple',
    black: 'bg-gray-50 text-black',
  },
  solid: {
    gray: 'bg-gray-700 text-black-1',
    blue: 'bg-blue text-black-1',
    red: 'bg-red text-black-1',
    purple: 'bg-purple text-black-1',
    black: 'bg-black text-black-1',
  },
};
