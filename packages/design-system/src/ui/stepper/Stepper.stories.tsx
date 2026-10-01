import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Stepper from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'stepper/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'value와 disabled 상태를 그대로 보여주기만 하는 컴포넌트입니다. 최소/최대값 제한은 컴포넌트 안에 없고, handleClickMinus/handleClickAdd와 isDisabledMinus/isDisabledAdd를 통해 사용하는 쪽에서 관리합니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: '현재 값',
    },
    isDisabledMinus: {
      control: { type: 'boolean' },
      description: '감소 버튼 비활성화 여부',
    },
    isDisabledAdd: {
      control: { type: 'boolean' },
      description: '증가 버튼 비활성화 여부',
    },
    handleClickMinus: {
      action: 'minus clicked',
      description: '감소 버튼 클릭 핸들러',
    },
    handleClickAdd: {
      action: 'add clicked',
      description: '증가 버튼 클릭 핸들러',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const MIN = 0;
const MAX = 10;

// 최소/최대값을 컨슈머가 직접 관리하는 실제 사용 예시
const StepperTemplate = () => {
  const [value, setValue] = useState(1);

  return (
    <Stepper
      value={value}
      isDisabledMinus={value <= MIN}
      isDisabledAdd={value >= MAX}
      handleClickMinus={() => setValue((prev) => Math.max(MIN, prev - 1))}
      handleClickAdd={() => setValue((prev) => Math.min(MAX, prev + 1))}
    />
  );
};

export const Default: Story = {
  render: () => <StepperTemplate />,
};

export const AtMinimum: Story = {
  args: {
    value: 0,
    isDisabledMinus: true,
    isDisabledAdd: false,
  },
};

export const AtMaximum: Story = {
  args: {
    value: 10,
    isDisabledMinus: false,
    isDisabledAdd: true,
  },
};
