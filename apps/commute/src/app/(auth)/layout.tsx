export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-[1.6rem] py-[4rem]'>
      <main className='bg-black-1 w-full max-w-[45rem] rounded-[1.6rem] px-[2.4rem] py-[4rem]'>
        {children}
      </main>
    </div>
  );
}
