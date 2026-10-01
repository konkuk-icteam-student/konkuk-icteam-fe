import type { Meta, StoryObj } from '@storybook/react-vite';
import DateCell from './DateCell';
import { DATE_COLOR } from './constants/color';

const meta: Meta<typeof DateCell> = {
  title: 'date/DateCell',
  component: DateCell,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: Object.keys(DATE_COLOR) },
  },
  args: {
    value: '1',
    iso: '2025-01-01',
    isSelected: false,
    isDisabled: false,
    isToday: false,
  },
};

export default meta;

type Story = StoryObj<typeof DateCell>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    value: '15',
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const RangeBand: Story = {
  parameters: {
    docs: {
      description: {
        story: '기간 선택에서 시작(start) - 사이(middle) - 끝(end) 날짜가 이어지는 모양입니다.',
      },
    },
  },
  render: (args) => (
    <div className='grid w-[24rem] grid-cols-3'>
      <DateCell {...args} value='10' iso='2025-01-10' isSelected rangePosition='start' />
      <DateCell {...args} value='11' iso='2025-01-11' rangePosition='middle' />
      <DateCell {...args} value='12' iso='2025-01-12' isSelected rangePosition='end' />
    </div>
  ),
};

export const RangeBandBlue: Story = {
  args: { color: 'blue' },
  render: (args) => (
    <div className='grid w-[24rem] grid-cols-3'>
      <DateCell {...args} value='10' iso='2025-01-10' isSelected rangePosition='start' />
      <DateCell {...args} value='11' iso='2025-01-11' rangePosition='middle' />
      <DateCell {...args} value='12' iso='2025-01-12' isSelected rangePosition='end' />
    </div>
  ),
};
