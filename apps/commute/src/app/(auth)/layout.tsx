// 근로장학생은 휴대폰, 관리자는 데스크톱에서 같은 화면을 쓰므로 모바일 폭 카드로 둔다
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-[1.6rem] py-[4rem]'>
      <main className='bg-black-1 w-full max-w-[45rem] rounded-[1.6rem] px-[2.4rem] py-[4rem]'>
        {children}
      </main>
    </div>
  );
}
