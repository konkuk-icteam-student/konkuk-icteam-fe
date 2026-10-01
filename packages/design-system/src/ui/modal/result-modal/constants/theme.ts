import { ResultModalType } from '../types/resultModalType';

type Theme = { contentTheme: string; headerTheme: string; graphicTheme: string };

export const THEME: Record<ResultModalType, Theme> = {
  success: {
    contentTheme: 'p-[1.6rem] gap-[2rem]',
    headerTheme: 'gap-[1.3rem]',
    graphicTheme: 'bg-green',
  },
  error: {
    contentTheme: 'p-[1.5rem] gap-[2rem]',
    headerTheme: 'gap-[1.4rem]',
    graphicTheme: 'bg-red',
  },
};
