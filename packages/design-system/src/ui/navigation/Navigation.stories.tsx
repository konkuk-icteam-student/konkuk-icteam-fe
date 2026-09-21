import type { Meta, StoryObj } from '@storybook/react-vite';
import Navigation from './Navigation';
import { IconAdd, IconArrowBack, IconSearch } from '@konkuk-icteam-fe/design-system/assets';

const meta: Meta<typeof Navigation> = {
  title: 'navigation/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '상단 네비게이션 바 컴포넌트입니다. left, center, right 영역에 컨텐츠를 배치할 수 있습니다.',
      },
    },
  },
  argTypes: {
    isSticky: {
      control: 'boolean',
      description: '네비게이션을 sticky로 고정할지 여부',
    },
    isFixed: {
      control: 'boolean',
      description: '네비게이션을 fixed로 고정할지 여부',
    },
    left: {
      control: false,
      description: '왼쪽 영역에 표시할 컨텐츠',
    },
    center: {
      control: false,
      description: '중앙 영역에 표시할 컨텐츠',
    },
    right: {
      control: false,
      description: '오른쪽 영역에 표시할 컨텐츠',
    },
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen bg-black'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type StoryNavigation = StoryObj<typeof Navigation>;

export const Default: StoryNavigation = {
  args: {
    left: <IconArrowBack />,
    center: <span className='text-black'>Title</span>,
    right: <IconSearch />,
    isFixed: true,
  },
};

export const WithCenterAndRight: StoryNavigation = {
  args: {
    center: <span className='text-black'>Title</span>,
    right: <IconSearch />,
    isFixed: true,
  },
};

export const WithLeftAndRight: StoryNavigation = {
  args: {
    left: <IconArrowBack />,
    right: <IconSearch />,
    isFixed: true,
  },
};

export const WithLeftAndCenter: StoryNavigation = {
  args: {
    left: <IconArrowBack />,
    center: <span className='text-black'>Settings</span>,
    isFixed: true,
  },
};

export const WithLeftAndCenterAndRight: StoryNavigation = {
  args: {
    left: <IconArrowBack />,
    center: <span className='text-black'>My List</span>,
    right: <IconAdd />,
    isFixed: true,
  },
};

export const OnlyCenter: StoryNavigation = {
  args: {
    center: <span className='text-lg font-semibold text-black'>Center Title</span>,
    isFixed: true,
  },
};
