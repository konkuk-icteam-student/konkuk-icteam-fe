type WorkHoursSummaryProps = {
  items: { label: string; hours: number }[];
};

// 근무시간을 한 줄씩 짧게 보여 주는 칸들 (수정 요청 화면). 바꾼 칸을 반영한 시간이다
export default function WorkHoursSummary({ items }: WorkHoursSummaryProps) {
  return (
    <dl className='grid grid-cols-2 gap-[1.2rem]'>
      {items.map(({ label, hours }) => (
        <div
          key={label}
          className='flex items-center justify-between rounded-[1.2rem] border border-gray-50 px-[1.6rem] py-[1.6rem]'
        >
          <dt className='font-14-bd text-black'>{label}</dt>
          <dd className='font-14-bd text-blue'>{`${hours}h`}</dd>
        </div>
      ))}
    </dl>
  );
}
