'use client';

import { useEffect } from 'react';

type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

const INPUT_STYLE = `
  absolute top-1/2 -translate-y-1/2 z-20 w-full
  appearance-none pointer-events-none bg-transparent
  [&::-webkit-slider-runnable-track]:appearance-none
  [&::-webkit-slider-runnable-track]:border-0
  [&::-webkit-slider-runnable-track]:bg-transparent
  [&::-webkit-slider-runnable-track]:shadow-none
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:pointer-events-auto
  [&::-webkit-slider-thumb]:w-[2rem]
  [&::-webkit-slider-thumb]:h-[2rem]
  [&::-webkit-slider-thumb]:border-[0.3rem]
  [&::-webkit-slider-thumb]:border-black
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-black-1
  [&::-moz-range-track]:appearance-none
  [&::-moz-range-track]:border-0
  [&::-moz-range-track]:bg-transparent
  [&::-moz-range-track]:shadow-none
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:pointer-events-auto
  [&::-moz-range-thumb]:w-[2rem]
  [&::-moz-range-thumb]:h-[2rem] 
  [&::-moz-range-thumb]:border-[0.3rem]
  [&::-moz-range-thumb]:border-black
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-black-1
`;

export default function Slider({
  min: initialMin,
  max: initialMax,
  step,
  value,
  onChange,
}: SliderProps) {
  // min < max 보장
  const min = initialMin;
  const max = initialMax <= min ? min + step : initialMax;
  // min <= value[0], value[1] <= max 보장
  const clampedStart = Math.min(Math.max(value[0], min), max);
  const clampedEnd = Math.min(Math.max(value[1], min), max);
  // value[0] <= value[1] 보장
  const startValue = clampedStart;
  const endValue = Math.max(clampedEnd, clampedStart);
  const startPercent = ((startValue - min) / (max - min)) * 100;
  const endPercent = ((endValue - min) / (max - min)) * 100;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange([Math.min(newValue, endValue - step), endValue]);
  };
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange([startValue, Math.max(newValue, startValue + step)]);
  };

  useEffect(() => {
    if (value[0] !== startValue || value[1] !== endValue) {
      onChange([startValue, endValue]);
    }
  }, []);

  return (
    <div className='relative h-[2rem] w-full'>
      <div className='absolute top-1/2 right-[1rem] left-[1rem] h-[0.2rem] -translate-y-1/2 bg-gray-400' />
      <div
        className='absolute top-1/2 right-[1rem] left-[1rem] z-10 h-[0.3rem] -translate-y-1/2 rounded-full'
        style={{
          background: `linear-gradient(to right, transparent ${startPercent}%, #000000 ${startPercent}%, #000000 ${endPercent}%, transparent ${endPercent}%)`,
        }}
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={startValue}
        className={INPUT_STYLE}
        onChange={handleStartChange}
        aria-label='최솟값'
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={endValue}
        className={INPUT_STYLE}
        onChange={handleEndChange}
        aria-label='최댓값'
      />
    </div>
  );
}
