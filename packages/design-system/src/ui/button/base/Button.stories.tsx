import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'button/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    display: 'block',
    size: 'large',
    tone: 'solid',
    color: 'black',
    disabled: false,
    isLoading: false,
  },
  argTypes: {
    tone: { control: 'select', options: ['solid', 'subtle', 'subtle_2'] },
    color: { control: 'select', options: ['white', 'gray', 'blue', 'red', 'purple', 'black'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '기본 버튼 컴포넌트입니다. tone(solid/subtle/subtle_2) x color(white/gray/blue/red/purple/black) 조합으로 색을 정합니다. subtle은 배경이 gray-900(어두운 회색), subtle_2는 배경이 gray-50(밝은 회색)으로 고정되고 텍스트가 color를 따릅니다. solid는 배경이 color를 따르고 텍스트가 항상 흰색입니다. white color는 solid(배경과 텍스트가 겹침)와 subtle_2(밝은 배경과 겹침)에서는 지원하지 않고 subtle에서만 지원합니다.',
      },
    },
  },
};

export default meta;

type StoryButton = StoryObj<typeof Button>;

export const DefaultLarge: StoryButton = {};
export const SmallButton: StoryButton = {
  args: { size: 'small', children: 'Small Button' },
};

export const Solid: StoryButton = {
  args: { tone: 'solid', color: 'blue', children: 'Solid' },
};

export const Subtle: StoryButton = {
  args: { tone: 'subtle', color: 'red', children: 'Subtle' },
};
export const Subtle2: StoryButton = {
  args: { tone: 'subtle_2', color: 'gray', children: 'Subtle2' },
};
