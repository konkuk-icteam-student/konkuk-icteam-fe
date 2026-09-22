// 선택된 날짜(원)와 기간 띠의 색 조합
export const DATE_COLOR = {
  black: { selectedClassName: 'bg-black text-black-1', rangeClassName: 'bg-gray-50' },
  gray: { selectedClassName: 'bg-gray-700 text-black-1', rangeClassName: 'bg-gray-50' },
  blue: { selectedClassName: 'bg-blue text-black-1', rangeClassName: 'bg-blue/10' },
  red: { selectedClassName: 'bg-red text-black-1', rangeClassName: 'bg-red/10' },
  purple: { selectedClassName: 'bg-purple text-black-1', rangeClassName: 'bg-purple/10' },
  green: { selectedClassName: 'bg-green text-black-1', rangeClassName: 'bg-green/10' },
} as const;

export type DateColor = keyof typeof DATE_COLOR;
