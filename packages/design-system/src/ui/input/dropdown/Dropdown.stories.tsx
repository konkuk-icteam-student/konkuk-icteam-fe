import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Dropdown from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'input/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    options: ['옵션 1', '옵션 2', '옵션 3'],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '클릭으로 목록을 열어 값을 고르는 드롭다운 컴포넌트입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='w-[20rem]'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const ManyOptions: Story = {
  args: {
    options: [
      '서울',
      '부산',
      '대구',
      '인천',
      '광주',
      '대전',
      '울산',
      '세종',
      '경기',
      '강원',
      '충북',
      '충남',
      '전북',
      '전남',
      '경북',
      '경남',
      '제주',
    ],
  },
};

export const SelectsOption: Story = {
  tags: ['ai-generated'],
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByText('선택해주세요');
    await userEvent.click(trigger);

    await userEvent.click(await canvas.findByText('옵션 2'));
    await expect(canvas.getByRole('button')).toHaveTextContent('옵션 2');
  },
};
