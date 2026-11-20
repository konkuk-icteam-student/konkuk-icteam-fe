import { cn } from '@konkuk-icteam-fe/design-system/cn';

import { SLOT_START_TIMES } from './constants';
import type { TimeLabelFormat } from './types';

/**
 * 시간 열에 쓸 글자를 얻습니다. 정시 칸에만 붙이고, 30분 칸은 비워 둡니다.
 * @param startTime 칸 시작 시각 (HH:mm)
 * @param format hour면 시만('9'), time이면 시각 그대로('09:00')
 * @returns 표시할 글자. 30분 칸이면 빈 글자
 * @example getTimeLabel('09:00', 'hour'); // '9'
 */
const getTimeLabel = (startTime: string, format: TimeLabelFormat) => {
  if (!startTime.endsWith(':00')) return '';

  return format === 'hour' ? String(Number(startTime.slice(0, 2))) : startTime;
};

type TimeColumnProps = {
  format: TimeLabelFormat;
};

// 표 가장 왼쪽의 시간 열. 요일 열과 같은 높이로 줄을 맞춘다.
export default function TimeColumn({ format }: TimeColumnProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 flex-col items-end',
        format === 'hour' ? 'w-[1.6rem]' : 'w-[3.2rem]',
      )}
    >
      {/* 요일 열 머리(요일·날짜)와 높이를 맞추기 위한 빈 자리 */}
      <span className='caption-14-bd invisible'>-</span>
      <span className='caption-11-md invisible'>-</span>
      <div className='flex w-full flex-col gap-[0.4rem] pt-[0.8rem]'>
        {SLOT_START_TIMES.map((startTime) => (
          <div key={startTime} className='relative h-[2.8rem] w-full'>
            <span className='caption-10-md absolute top-0 right-0 text-gray-500'>
              {getTimeLabel(startTime, format)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
