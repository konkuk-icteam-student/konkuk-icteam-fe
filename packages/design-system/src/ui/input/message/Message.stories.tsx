import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Message from './Message';

const meta: Meta<typeof Message> = {
  title: 'input/Message',
  tags: ['autodocs'],
  component: Message,
  args: {
    id: 'field-message',
    message: '도움말 메시지입니다.',
    variant: 'help',
  },
  parameters: {
    docs: {
      description: {
        component: 'Message 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

type StoryInputField = StoryObj<typeof Message>;

export const DefaultInputField: StoryInputField = {};

export const ErrorMessage: StoryInputField = {
  args: {
    message: '에러 메시지입니다.',
    variant: 'error',
  },
};

export const SuccessMessage: StoryInputField = {
  args: {
    message: '성공 메시지입니다.',
    variant: 'success',
  },
};

export const HelpMessage: StoryInputField = {
  args: {
    message: '도움말 메시지입니다.',
    variant: 'help',
  },
};

export const ErrorAnnouncedAsAlert: StoryInputField = {
  tags: ['ai-generated'],
  args: {
    message: '에러 메시지입니다.',
    variant: 'error',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('에러 메시지입니다.');
  },
};
