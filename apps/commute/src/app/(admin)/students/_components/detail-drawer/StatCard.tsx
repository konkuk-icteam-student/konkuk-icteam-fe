type StatCardProps = {
  label: string;
  value: string;
  // 값 아래 작은 글자 (합계, 최대치 등)
  caption: string;
};

// 상세보기의 회색 숫자 카드. 근태 요약과 근로대장 누적 근무시간에 쓴다
export default function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
      <dt className='caption-12-md text-gray-500'>{label}</dt>
      <dd className='font-18-bd text-black'>{value}</dd>
      <dd className='caption-12-rg text-gray-400'>{caption}</dd>
    </div>
  );
}
