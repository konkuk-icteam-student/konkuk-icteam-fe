'use client';

import { useWorkApplication } from './WorkApplicationProvider';

export default function Header() {
  const {
    yearMonth: { month },
  } = useWorkApplication();

  return (
    <h1 className='title-26-eb flex items-center justify-start gap-[1rem] text-black'>
      {`${month}월 근로신청 열기`}
    </h1>
  );
}
