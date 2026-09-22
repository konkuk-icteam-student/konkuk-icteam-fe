import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Breadcrumb from './Breadcrumb';
import { createBreadcrumbItems } from './utils/breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '현재 위치까지의 경로를 보여주는 컴파운드 컴포넌트입니다. Breadcrumb 안에 Breadcrumb.Item을 경로 순서대로 넣으면 마지막 항목이 현재 위치(aria-current="page")가 되고, href가 있는 앞쪽 항목은 링크가 됩니다. next/link 같은 링크 컴포넌트는 LinkComponent로 넘깁니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item href='/faq'>FAQ</Breadcrumb.Item>
      <Breadcrumb.Item href='/faq/tech'>기술</Breadcrumb.Item>
      <Breadcrumb.Item>학사정보시스템</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const TwoLevels: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item href='/worklog'>업무일지</Breadcrumb.Item>
      <Breadcrumb.Item>2025.05.21</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const MarksCurrentPage: Story = {
  tags: ['ai-generated'],
  render: Default.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: '경로' })).toBeVisible();

    // 마지막 항목만 현재 위치로 표시되고 링크가 아니다
    await expect(canvas.getByText('학사정보시스템')).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: '학사정보시스템' })).not.toBeInTheDocument();

    // 앞쪽 항목은 링크
    await expect(canvas.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
    await expect(canvas.getByRole('link', { name: '기술' })).toHaveAttribute('href', '/faq/tech');
  },
};

// 앱에서는 현재 경로(예: Next App Router의 usePathname())를 createBreadcrumbItems에 넘겨서 항목을 만든다
const PathnameTemplate = ({
  pathname,
  labels,
}: {
  pathname: string;
  labels?: Record<string, string>;
}) => (
  <Breadcrumb>
    {createBreadcrumbItems(pathname, labels).map(({ label, href }) => (
      <Breadcrumb.Item key={href} href={href}>
        {label}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);

export const FromPathname: Story = {
  tags: ['ai-generated'],
  render: () => (
    <PathnameTemplate
      pathname='/faq/tech/academic?tab=1#top'
      labels={{ faq: 'FAQ', tech: '기술', academic: '학사정보시스템' }}
    />
  ),
  play: async ({ canvas }) => {
    // 쿼리와 해시는 무시하고, 각 항목의 링크는 그 조각까지의 경로다
    await expect(canvas.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
    await expect(canvas.getByRole('link', { name: '기술' })).toHaveAttribute('href', '/faq/tech');
    await expect(canvas.getByText('학사정보시스템')).toHaveAttribute('aria-current', 'page');
  },
};

export const FromPathnameWithoutLabels: Story = {
  tags: ['ai-generated'],
  render: () => <PathnameTemplate pathname='/faq/%ED%95%99%EC%82%AC' />,
  play: async ({ canvas }) => {
    // 이름을 안 넘기면 경로 조각을 그대로(디코딩해서) 보여준다
    await expect(canvas.getByText('학사')).toHaveAttribute('aria-current', 'page');
  },
};

export const RootPathRendersNothing: Story = {
  tags: ['ai-generated'],
  render: () => <PathnameTemplate pathname='/' />,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument();
  },
};
