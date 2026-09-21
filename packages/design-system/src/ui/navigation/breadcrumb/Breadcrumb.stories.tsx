import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'FAQ', href: '/faq' },
      { label: '기술', href: '/faq/tech' },
      { label: '학사정보시스템' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          '현재 위치까지의 경로를 보여줍니다. 마지막 항목이 현재 위치이며 aria-current="page"로 표시되고, href가 있는 앞쪽 항목은 링크가 됩니다. next/link 같은 링크 컴포넌트는 LinkComponent로 넘깁니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const WithoutHomeIcon: Story = {
  args: { showHomeIcon: false },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: '업무일지', href: '/worklog' }, { label: '2025.05.21' }],
  },
};

export const MarksCurrentPage: Story = {
  tags: ['ai-generated'],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: '경로' });
    await expect(nav).toBeVisible();

    // 마지막 항목만 현재 위치로 표시되고 링크가 아니다
    await expect(canvas.getByText('학사정보시스템')).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: '학사정보시스템' })).not.toBeInTheDocument();

    // 앞쪽 항목은 링크
    await expect(canvas.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
    await expect(canvas.getByRole('link', { name: '기술' })).toHaveAttribute('href', '/faq/tech');
  },
};
