import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import ResultModal from './ResultModal';
import { ModalButtonProps } from '../base/Modal';

const meta: Meta<typeof ResultModal> = {
  title: 'modal/ResultModal',
  component: ResultModal,
  tags: ['autodocs'],
  args: {
    open: true,
    showCloseButton: false,
    type: 'success',
    title: '제목',
    description: '설명',
    buttons: [
      {
        label: '왼쪽 버튼',
        size: 'medium',
        tone: 'subtle_2',
        color: 'gray',
        onClick: () => alert('버튼 클릭'),
      },
      { label: '오른쪽 버튼', size: 'medium', color: 'black', onClick: () => alert('버튼 클릭') },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: '결과를 안내하는 ResultModal 컴포넌트입니다.',
      },
      // 모달은 fixed 오버레이라서 Docs 페이지에 여러 스토리가 한 문서에 동시에 열려 있으면
      // 서로 겹쳐 보인다. 스토리마다 자기 iframe에서 따로 렌더링되도록 분리한다
      story: { inline: false, iframeHeight: 420 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResultModal>;

export const Default: Story = {};

function ModalWrapper(
  props: Omit<React.ComponentProps<typeof ResultModal>, 'open' | 'handleOpenChange'>,
) {
  const [open, setOpen] = useState(true);

  const buttons: ModalButtonProps[] = (props.buttons ?? []).map((button) => ({
    ...button,
    onClick: () => setOpen(false),
  }));

  return <ResultModal {...props} open={open} handleOpenChange={setOpen} buttons={buttons} />;
}

export const Success: Story = {
  render: () => (
    <ModalWrapper
      showCloseButton={false}
      type='success'
      title='업무일지 작성이 완료되었어요!'
      description="'내 업무일지'에서 작성한 내용을 확인해보세요"
      buttons={[
        {
          label: '닫기',
          size: 'medium',
          tone: 'subtle_2',
          color: 'gray',
        },
        {
          label: '내 업무일지 확인',
          size: 'medium',
          color: 'black',
        },
      ]}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ModalWrapper
      showCloseButton={false}
      type='error'
      title={'결제 요청에 실패했습니다.\n잠시 후 다시 시도해 주세요.'}
      buttons={[
        {
          label: '닫기',
          size: 'medium',
          tone: 'subtle_2',
          color: 'gray',
        },
        {
          label: '결제하기',
          size: 'medium',
          color: 'black',
        },
      ]}
    />
  ),
};
