import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'input/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: '내용을 입력해주세요',
    rows: 4,
  },
  argTypes: {
    hasError: { control: 'boolean', description: '에러 상태 (테두리가 빨간색으로 바뀝니다)' },
    disabled: { control: 'boolean' },
    rows: {
      control: 'number',
      description: '표시할 줄 수 (크기 조절은 막혀 있어 rows나 className으로 정합니다)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '여러 줄 입력 컴포넌트입니다. 네이티브 textarea 속성을 그대로 쓸 수 있고, hasError로 에러 상태를 표시합니다. 라벨과 도움말이 필요하면 TextareaField를 사용하세요.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='w-[36rem]'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: '오늘 진행한 업무를 자유롭게 작성합니다.\n여러 줄도 입력할 수 있어요.',
  },
};

export const HasError: Story = {
  args: {
    hasError: true,
    defaultValue: '잘못된 내용',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '수정할 수 없는 내용입니다.',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: '읽기만 가능한 내용입니다.',
  },
};
