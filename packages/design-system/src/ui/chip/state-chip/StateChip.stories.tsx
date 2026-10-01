import type { Meta, StoryObj } from '@storybook/react-vite';
import { CHIP_THEME, ChipTone } from '../constants/chipTheme';

import StateChip from './StateChip';

const TONES = Object.keys(CHIP_THEME) as ChipTone[];

const meta: Meta<typeof StateChip> = {
  title: 'chip/StateChip',
  component: StateChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '상태를 나타내는 칩입니다. 상태 값의 의미는 사용하는 앱에서 정하고, 여기서는 label과 tone(색)만 받습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '상태 이름' },
    tone: {
      control: { type: 'select' },
      options: TONES,
      description: '칩 색',
    },
  },
  args: {
    label: '대기',
    tone: 'gray',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gray: Story = {};

export const Blue: Story = {
  args: { label: '진행 중', tone: 'blue' },
};

export const Red: Story = {
  args: { label: '반려', tone: 'red' },
};

export const Purple: Story = {
  args: { label: '검토 중', tone: 'purple' },
};

export const Green: Story = {
  args: { label: '완료', tone: 'green' },
};

export const Black: Story = {
  args: { label: '보류', tone: 'black' },
};

export const White: Story = {
  args: { label: '신규', tone: 'white' },
};
