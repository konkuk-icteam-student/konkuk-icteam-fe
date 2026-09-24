import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import useSectionStack from './hooks/useSectionStack';
import SectionStack from './SectionStack';
import Button from '../button/base/Button';

const meta: Meta<typeof SectionStack> = {
  title: 'section-stack/SectionStack',
  component: SectionStack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '페이지 안에 놓는 섹션으로, 열어 본 항목들을 탭으로 쌓아 보여줍니다. SectionStack.Item을 연 순서대로 자식으로 넣는 컴파운드 컴포넌트입니다. useSectionStack 훅이 상태를 관리하며 최대 5개까지 열리고(넘으면 가장 오래된 항목이 닫힘), 보고 있는 항목을 닫으면 이전 항목이 표시됩니다. 오른쪽 손잡이를 끌거나 방향키로 너비를 조절할 수 있습니다.',
      },
    },
  },
  // 이 스토리들은 훅으로 상태를 관리하는 Template이 직접 렌더링하므로 컴포넌트에 args를 넘기지 않는다
  args: { children: null, handleActivate: () => {}, handleClose: () => {} },
};

export default meta;
type Story = StoryObj<typeof SectionStack>;

type SectionContentProps = {
  number: number;
};

const SectionContent = ({ number }: SectionContentProps) => (
  <p className='caption-14-rg text-gray-700'>섹션 {number}의 내용입니다.</p>
);

const SectionStackTemplate = () => {
  const { items, activeId, openSection, closeSection, activateSection } = useSectionStack();
  const nextNumber = useRef(1);

  const openNextSection = () => {
    const number = nextNumber.current;
    nextNumber.current += 1;
    openSection({
      id: `section-${number}`,
      title: `항목 ${number}`,
      content: <SectionContent number={number} />,
    });
  };

  return (
    <div className='flex flex-col gap-[2rem] p-[2rem]'>
      <Button display='inline' size='small' onClick={openNextSection}>
        항목 열기
      </Button>

      <SectionStack activeId={activeId} handleActivate={activateSection} handleClose={closeSection}>
        {items.map((item) => (
          <SectionStack.Item key={item.id} id={item.id} title={item.title}>
            <SectionStack.ItemContainer>
              <SectionStack.ItemTitle className='px-[2.4rem] pt-[2.4rem] pb-[1.6rem]'>
                {item.title}
              </SectionStack.ItemTitle>
              <SectionStack.ItemContent>{item.content}</SectionStack.ItemContent>
            </SectionStack.ItemContainer>
          </SectionStack.Item>
        ))}
      </SectionStack>
    </div>
  );
};

export const Default: Story = {
  render: () => <SectionStackTemplate />,
};

// '항목 열기'를 count번 눌러서 항목을 연다
const openSections = async (
  count: number,
  canvas: ReturnType<typeof within>,
  click: (element: HTMLElement) => Promise<void>,
) => {
  const openButton = canvas.getByRole('button', { name: '항목 열기' });
  await Array.from({ length: count }).reduce<Promise<void>>(async (previous) => {
    await previous;
    await click(openButton);
  }, Promise.resolve());
};

export const LimitsToFiveSections: Story = {
  tags: ['ai-generated'],
  render: () => <SectionStackTemplate />,
  play: async ({ canvas, userEvent }) => {
    await openSections(6, canvas, (element) => userEvent.click(element));

    // 6개를 열었지만 최신 5개만 남고 가장 오래된 항목 1은 닫힌다
    await expect(await canvas.findAllByRole('tab')).toHaveLength(5);
    await expect(canvas.queryByRole('tab', { name: '항목 1' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('tab', { name: '항목 6' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
