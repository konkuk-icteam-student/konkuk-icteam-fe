import PageClient from './page.client';

export default async function TodosPage({ searchParams }: PageProps<'/todos'>) {
  const { period } = await searchParams;

  return (
    <main className='bg-black-1 min-h-screen w-full pb-[11rem] text-black'>
      <PageClient periodParam={typeof period === 'string' ? period : undefined} />
    </main>
  );
}
