import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import type { ComponentProps } from 'react';
import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'tabs/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

type TabItem = {
  label: string;
  value: string;
};

type TabsStoryArgs = ComponentProps<typeof Tabs> & {
  tabs: TabItem[];
  activeValue: string;
  basePath: string;
};

const TabsTemplate = ({ tabs, activeValue, basePath }: TabsStoryArgs) => {
  return (
    <Tabs>
      <Tabs.List activeValue={activeValue} tabs={tabs}>
        {tabs.map(({ label, value }) => {
          return (
            <Tabs.Item
              key={value}
              value={value}
              activeValue={activeValue}
              href={`${basePath}?tab=${value}`}
            >
              {label}
            </Tabs.Item>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
};

export default meta;

type Story = StoryObj<TabsStoryArgs>;

const DEFAULT_TABS: TabItem[] = [
  { label: '업무일지', value: 'worklog' },
  { label: '이슈', value: 'issue' },
];

const FOUR_TABS: TabItem[] = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'progress' },
  { label: '검토 중', value: 'review' },
  { label: '완료', value: 'done' },
];

export const Default: Story = {
  args: {
    tabs: DEFAULT_TABS,
    activeValue: 'worklog',
    basePath: '/worklog',
  },
  render: (args) => <TabsTemplate {...args} />,
};

export const FourTabs: Story = {
  args: {
    tabs: FOUR_TABS,
    activeValue: 'all',
    basePath: '/issues',
  },
  render: (args) => <TabsTemplate {...args} />,
};

export const MarksActiveTab: Story = {
  tags: ['ai-generated'],
  args: {
    tabs: DEFAULT_TABS,
    activeValue: 'issue',
    basePath: '/worklog',
  },
  render: (args) => <TabsTemplate {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: '이슈' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tab', { name: '업무일지' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};
