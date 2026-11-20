type WorkHoursCardProps = {
  title: string;
  hours: number;
  maxHours: number;
  minHours: number;
};

// 근무시간 요약 카드. 지금 시간 / 최대 시간과 진행 막대, 최소 시간을 보여 준다
export default function WorkHoursCard({ title, hours, maxHours, minHours }: WorkHoursCardProps) {
  // 최대를 넘어도 막대는 끝까지만 채운다
  const progressPercent = maxHours > 0 ? Math.min((hours / maxHours) * 100, 100) : 0;

  return (
    <section className='flex flex-col gap-[0.8rem] rounded-[1.2rem] border border-gray-50 px-[1.6rem] py-[1.6rem]'>
      <h3 className='caption-12-md text-gray-500'>{title}</h3>
      <p className='flex items-baseline gap-[0.4rem]'>
        <strong className='title-20-bd text-black'>{hours}</strong>
        <span className='caption-14-md text-gray-500'>{`/ ${maxHours}h`}</span>
      </p>
      <div
        role='progressbar'
        aria-label={title}
        aria-valuenow={hours}
        aria-valuemin={0}
        aria-valuemax={maxHours}
        className='h-[0.6rem] w-full overflow-hidden rounded-full bg-gray-50'
      >
        <div className='bg-blue h-full rounded-full' style={{ width: `${progressPercent}%` }} />
      </div>
      <p className='caption-12-md text-gray-500'>{`최소 ${minHours}h`}</p>
    </section>
  );
}
