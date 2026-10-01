import { useState } from 'react';
import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CHIP_THEME, ChipTone } from '../constants/chipTheme';
import TagChip from './TagChip';

const TONES = Object.keys(CHIP_THEME) as ChipTone[];
const FILTER_OPTIONS = ['프론트엔드', '백엔드', '디자인', '인프라', '기획'];

const meta: Meta<typeof TagChip> = {
  title: 'chip/TagChip',
  component: TagChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '태그/필터 칩입니다. tone으로 색을 고르고, onClick을 넘기면 클릭 가능한 필터(isSelected로 선택 표시), onRemove를 넘기면 X 버튼이 표시됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '칩 이름' },
    tone: { control: { type: 'select' }, options: TONES, description: '칩 색' },
    isSelected: { control: 'boolean', description: '선택 여부 (선택되면 tone 색으로 채워짐)' },
    onClick: { control: false, description: '전달하면 칩 전체가 클릭 가능해집니다' },
    onRemove: { control: false, description: '전달하면 X 버튼이 표시됩니다' },
  },
  args: {
    label: '프론트엔드',
    tone: 'gray',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: {
    onRemove: () => {},
  },
};

export const Tones: Story = {
  render: (args) => (
    <div className='flex flex-col gap-[1.2rem]'>
      <div className='flex gap-[0.8rem]'>
        {TONES.map((tone) => (
          <TagChip key={tone} {...args} tone={tone} label={tone} />
        ))}
      </div>
      <div className='flex gap-[0.8rem]'>
        {TONES.map((tone) => (
          <TagChip key={tone} {...args} tone={tone} label={tone} isSelected onClick={() => {}} />
        ))}
      </div>
      <div className='flex gap-[0.8rem]'>
        {TONES.map((tone) => (
          <TagChip key={tone} {...args} tone={tone} label={tone} onRemove={() => {}} />
        ))}
      </div>
    </div>
  ),
};

const FilteringSectionTemplate = (args: React.ComponentProps<typeof TagChip>) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((selected) => selected !== option) : [...prev, option],
    );
  };

  return (
    <div className='flex max-w-[45rem] flex-col gap-[1.6rem]'>
      <div className='flex min-h-[2.8rem] flex-wrap gap-[0.8rem]'>
        {selectedOptions.map((option) => (
          <TagChip key={option} tone={args.tone} label={option} onRemove={handleToggle} />
        ))}
      </div>

      <div className='flex flex-wrap gap-[0.8rem]'>
        {FILTER_OPTIONS.map((option) => (
          <TagChip
            key={option}
            tone={args.tone}
            label={option}
            isSelected={selectedOptions.includes(option)}
            onClick={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export const FilteringSection: Story = {
  args: { tone: 'blue' },
  render: (args) => <FilteringSectionTemplate {...args} />,
};

export const SelectThenRemove: Story = {
  tags: ['ai-generated'],
  args: { tone: 'blue' },
  render: (args) => <FilteringSectionTemplate {...args} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole('button', { name: '프론트엔드 삭제' })).not.toBeInTheDocument();

    const chip = canvas.getByRole('button', { name: '프론트엔드' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    const removeButton = await canvas.findByRole('button', { name: '프론트엔드 삭제' });

    await userEvent.click(removeButton);
    await expect(canvas.queryByRole('button', { name: '프론트엔드 삭제' })).not.toBeInTheDocument();
  },
};
