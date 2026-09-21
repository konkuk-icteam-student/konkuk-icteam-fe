import { useState } from 'react';
import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CheckBox from './CheckBox';

const meta: Meta<typeof CheckBox> = {
  title: 'input/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  args: {
    'aria-label': '동의',
  },
  parameters: {
    docs: {
      description: {
        component:
          '네이티브 input[type=checkbox] 기반의 체크박스입니다. checked/defaultChecked/onChange/name/value 등 input 속성을 그대로 쓸 수 있어 폼과 함께 사용할 수 있습니다. children을 넘기면 라벨로 표시되며 글자를 눌러도 토글됩니다.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckBox>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithLabel: Story = {
  args: { 'aria-label': undefined, children: '이용약관에 동의합니다' },
};

export const Disabled: Story = {
  args: { disabled: true, children: '비활성' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, children: '비활성(체크됨)' },
};

const ControlledTemplate = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className='flex flex-col gap-[1.2rem]'>
      <CheckBox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
        제어형 체크박스
      </CheckBox>
      <span className='caption-12-md text-gray-500'>checked: {String(isChecked)}</span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTemplate />,
};

export const OnDarkBackground: Story = {
  parameters: {
    docs: {
      description: {
        story: '어두운 배경(흰 글자)에서도 체크 표시가 보이는지 확인용입니다.',
      },
    },
  },
  render: () => (
    <div className='text-black-1 bg-black p-[2rem]'>
      <CheckBox defaultChecked>어두운 배경</CheckBox>
    </div>
  ),
};

export const TogglesOnLabelClick: Story = {
  tags: ['ai-generated'],
  render: () => <ControlledTemplate />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: '제어형 체크박스' });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(canvas.getByText('제어형 체크박스'));
    await expect(checkbox).toBeChecked();
    await expect(canvas.getByText('checked: true')).toBeVisible();

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};
