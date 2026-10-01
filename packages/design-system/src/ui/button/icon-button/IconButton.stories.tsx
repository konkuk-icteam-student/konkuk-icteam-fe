import type { Meta, StoryObj } from '@storybook/react-vite';
import IconButton from './IconButton';
import { IconClose } from '@konkuk-icteam-fe/design-system/assets';

const meta: Meta<typeof IconButton> = {
  title: 'button/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: '아이콘이 포함된 버튼입니다.',
      },
    },
  },
};

export default meta;

type StoryIconButton = StoryObj<typeof IconButton>;

export const Default: StoryIconButton = {
  args: {
    'aria-label': '닫기',
    children: <IconClose />,
  },
};
