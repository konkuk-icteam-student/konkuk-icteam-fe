import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Slider from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'slider/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: 'object' },
    onChange: { action: 'changed' },
  },
  parameters: {
    docs: {
      description: {
        component: '양쪽 원을 움직여 범위를 지정하는 슬라이더 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

type StorySlider = StoryObj<typeof Slider>;

type SliderTemplateProps = React.ComponentProps<typeof Slider>;

const DEFAULT_ARGS = {
  min: 10000,
  max: 400000,
  step: 10000,
  value: [50000, 150000] as [number, number],
};

const useSliderValue = (args: Partial<SliderTemplateProps> | undefined) => {
  const [value, setValue] = useState<[number, number]>(args?.value ?? DEFAULT_ARGS.value);

  const handleChange = (nextValue: [number, number]) => {
    setValue(nextValue);
    args?.onChange?.(nextValue);
  };

  return { value, handleChange };
};

const DefaultTemplate = (args: Partial<SliderTemplateProps>) => {
  const { value, handleChange } = useSliderValue(args);

  return (
    <div className='flex w-[42rem] flex-col items-center gap-[2rem]'>
      <div className='font-16-md text-black'>
        {value[0]} ~ {value[1]}
      </div>
      <Slider
        min={args.min ?? DEFAULT_ARGS.min}
        max={args.max ?? DEFAULT_ARGS.max}
        step={args.step ?? DEFAULT_ARGS.step}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export const Default: StorySlider = {
  parameters: {
    layout: 'centered',
  },
  render: (args) => <DefaultTemplate {...args} />,
  args: DEFAULT_ARGS,
};
