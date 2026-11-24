type StatCardProps = {
  label: string;
  value: string;
  caption: string;
};

export default function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
      <dt className='caption-12-md text-gray-500'>{label}</dt>
      <dd className='font-18-bd text-black'>{value}</dd>
      <dd className='caption-12-rg text-gray-400'>{caption}</dd>
    </div>
  );
}
