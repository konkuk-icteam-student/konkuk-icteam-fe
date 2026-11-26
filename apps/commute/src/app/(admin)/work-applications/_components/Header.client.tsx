'use client';

import { useState } from 'react';
import { getNextYearMonth } from '@/shared/utils/calendar';

export default function Header() {
  const [{ month }] = useState(getNextYearMonth);

  return (
    <h1 className='title-26-eb flex items-center justify-start gap-[1rem] text-black'>
      {`${month}월 근로신청 열기`}
    </h1>
  );
}
