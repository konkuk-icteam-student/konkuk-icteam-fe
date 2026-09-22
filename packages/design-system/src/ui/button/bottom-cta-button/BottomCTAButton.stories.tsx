import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomCTAButton from './BottomCTAButton';
import Button from '../base/Button';

const meta: Meta<typeof BottomCTAButton.Single> = {
  title: 'button/BottomCTAButton',
  component: BottomCTAButton.Single,
  tags: ['autodocs'],
  args: {
    size: 'large',
    color: 'black',
    display: 'block',
    children: '확인',
  },
};

export default meta;

type Story = StoryObj<typeof BottomCTAButton.Single>;

export const Single: Story = {
  render: () => (
    <div className='bg-black-1 flex h-[50rem] flex-col border p-4'>
      <div>콘텐츠 영역</div>

      <BottomCTAButton.Single size='large' color='black' className={'mt-auto'}>
        확인
      </BottomCTAButton.Single>
    </div>
  ),
};

export const BottomDoubleSingle = {
  render: () => (
    <div className='bg-black-1 flex h-[50rem] flex-col border p-4'>
      <div>콘텐츠 영역</div>

      <BottomCTAButton className='flex flex-col gap-[0.6rem]'>
        <BottomCTAButton.Single size='large' color='black'>
          확인
        </BottomCTAButton.Single>
        <BottomCTAButton.Single size='large' color='black'>
          확인
        </BottomCTAButton.Single>
      </BottomCTAButton>
    </div>
  ),
};

export const Double: StoryObj = {
  render: () => (
    <div className='bg-black-1 flex h-[50rem] flex-col border p-4'>
      <div>콘텐츠 영역</div>

      <BottomCTAButton>
        <BottomCTAButton.Double
          leftButton={
            <Button size='large' tone='subtle_2' color='gray'>
              취소
            </Button>
          }
          rightButton={
            <Button size='large' color='black'>
              확인
            </Button>
          }
        />
      </BottomCTAButton>
    </div>
  ),
};
