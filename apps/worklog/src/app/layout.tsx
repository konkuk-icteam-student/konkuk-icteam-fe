import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Worklog',
  description: '건국대학교 정보운영팀 업무일지 서비스',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='ko' className='h-full antialiased'>
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  );
}
