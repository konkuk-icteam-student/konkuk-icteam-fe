'use client';

import { useId, useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Button, Input, Modal, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { useToast } from '@/shared/hooks/useToast';
import { formatMonthDayTime } from '@/shared/utils/formatDate';
import {
  deleteNateonWebhook,
  getNateonWebhook,
  sendNateonWebhookTest,
  updateNateonWebhook,
  type NateonWebhook,
} from '../../_apis/nateonWebhook';
import { MODAL_BUTTON_CLASS_NAME, OUTLINE_BUTTON_CLASS_NAME } from '../../_constants/button';

type NateonWebhookModalProps = {
  open: boolean;
  nateonWebhook: NateonWebhook;
  // 저장·테스트·해제로 바뀐 연결 상태를 내 정보 메뉴에 알려 메뉴의 칩도 같이 바뀌게 한다
  onNateonWebhookChange: (nateonWebhook: NateonWebhook) => void;
  onNotify: ReturnType<typeof useToast>['showToast'];
  onClose: () => void;
};

// 아래쪽 버튼은 글자 길이만큼만 넓다. 디자인 시스템 Button(medium)이 너비를 꽉 채워서 덧씌운다
const FOOTER_BUTTON_CLASS_NAME = cn('w-auto px-[1.6rem]', MODAL_BUTTON_CLASS_NAME);

const WEBHOOK_URL_HINT = '네이트온 팀룸에서 발급한 웹훅 링크를 붙여 넣어 주세요.';

/**
 * 입력한 글자가 https로 시작하는 웹 주소인지 확인합니다.
 * @param value 입력한 웹훅 링크 (앞뒤 공백 제외)
 * @returns https 주소면 true
 * @example checkHttpsUrl('https://teamroom.nate.com/api/webhook/abc'); // true
 * @example checkHttpsUrl('teamroom.nate.com'); // false
 */
const checkHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * 저장할 웹훅 링크가 잘못됐을 때 입력칸 아래에 보여 줄 안내를 얻습니다.
 * @param webhookUrl 입력한 웹훅 링크 (앞뒤 공백 제외)
 * @returns 잘못된 까닭. 저장할 수 있는 링크면 null
 * @example getWebhookUrlError(''); // '웹훅 링크를 넣어 주세요.'
 */
const getWebhookUrlError = (webhookUrl: string) => {
  if (webhookUrl === '') return '웹훅 링크를 넣어 주세요.';
  if (!checkHttpsUrl(webhookUrl)) return 'https://로 시작하는 웹훅 링크를 넣어 주세요.';

  return null;
};

/**
 * 연결 칩 옆에 보여 줄 설명을 얻습니다.
 * @param nateonWebhook 연결 상태
 * @returns 연결 전 안내, 테스트 전 안내, 또는 마지막 테스트 결과
 * @example getStatusText({ maskedWebhookUrl: '…', lastTest: { sentAt, isSuccess: true } });
 * // '마지막 테스트 전송 11.06 09:12 · 성공'
 */
const getStatusText = ({ maskedWebhookUrl, lastTest }: NateonWebhook) => {
  if (maskedWebhookUrl === null) return '웹훅 링크를 저장하면 연결돼요.';
  if (lastTest === null) return '아직 테스트 전송을 하지 않았어요.';

  return `마지막 테스트 전송 ${formatMonthDayTime(lastTest.sentAt)} · ${lastTest.isSuccess ? '성공' : '실패'}`;
};

// 네이트온 팀룸 웹훅 링크를 등록해 출근부 알림을 팀룸으로 받는다.
// 저장은 창의 할 일을 끝내는 버튼이라 창을 닫고, 테스트 전송·연결 해제는 결과를 창에서 바로 보도록 닫지 않는다
export default function NateonWebhookModal({
  open,
  nateonWebhook,
  onNateonWebhookChange,
  onNotify,
  onClose,
}: NateonWebhookModalProps) {
  const inputId = useId();
  const hintId = useId();
  // 서버는 저장된 링크의 토큰을 가려서 보낸다. 연결돼 있으면 입력칸에 가려진 링크를 그대로 보여 준다
  const savedWebhookUrl = nateonWebhook.maskedWebhookUrl ?? '';
  const [webhookUrlDraft, setWebhookUrlDraft] = useState(savedWebhookUrl);
  const [webhookUrlError, setWebhookUrlError] = useState<string | null>(null);
  const isConnected = nateonWebhook.maskedWebhookUrl !== null;

  // 바뀐 연결 상태를 메뉴에 올리고, 입력칸도 그 상태의 링크로 되돌린다
  const applyNateonWebhook = (nextNateonWebhook: NateonWebhook) => {
    onNateonWebhookChange(nextNateonWebhook);
    setWebhookUrlDraft(nextNateonWebhook.maskedWebhookUrl ?? '');
    setWebhookUrlError(null);
  };

  // 저장하지 않고 닫으면 다음에 열 때 입력하던 글자가 남지 않게 지금 연결 상태로 되돌린다
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) return;
    setWebhookUrlDraft(savedWebhookUrl);
    setWebhookUrlError(null);
    onClose();
  };

  const handleWebhookUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrlDraft(event.target.value);
    setWebhookUrlError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedWebhookUrl = webhookUrlDraft.trim();

    // 가려진 저장값을 그대로 두고 누르면 바꿀 것이 없으니 저장 요청 없이 닫는다
    if (isConnected && trimmedWebhookUrl === savedWebhookUrl) {
      handleOpenChange(false);
      return;
    }

    const error = getWebhookUrlError(trimmedWebhookUrl);
    if (error) {
      setWebhookUrlError(error);
      return;
    }

    applyNateonWebhook(updateNateonWebhook({ webhookUrl: trimmedWebhookUrl }));
    onNotify('네이트온 알림을 연결했어요.');
    onClose();
  };

  const handleTestSend = () => {
    const lastTest = sendNateonWebhookTest();
    if (!lastTest) return;

    onNateonWebhookChange({ ...nateonWebhook, lastTest });
    onNotify(
      lastTest.isSuccess ? '테스트 알림을 보냈어요.' : '테스트 알림을 보내지 못했어요.',
      lastTest.isSuccess ? 'success' : 'error',
    );
  };

  // 해제 응답에는 본문이 없어서, 해제한 뒤의 상태는 서버에서 다시 받아 온다
  const handleDisconnect = () => {
    deleteNateonWebhook();
    applyNateonWebhook(getNateonWebhook());
    onNotify('네이트온 알림 연결을 해제했어요.');
  };

  return (
    <Modal
      open={open}
      handleOpenChange={handleOpenChange}
      showCloseButton={false}
      className='flex w-[52rem] flex-col gap-[2rem] rounded-[1.2rem] border-gray-50 p-[2.8rem] shadow-[0_0.8rem_2.4rem_0_rgb(0_0_0_/_0.1)] sm:max-w-none'
    >
      <Modal.Header className='gap-[0.6rem] text-left'>
        <Modal.Title className='title-20-bd text-black'>네이트온 알림 연결</Modal.Title>
        <Modal.Description className='caption-14-rg text-gray-500'>
          네이트온 팀룸 웹훅 링크를 등록하면 출근부 알림을 팀룸으로 받을 수 있어요.
        </Modal.Description>
      </Modal.Header>
      {/* 입력칸에서 Enter를 눌러도 저장되도록 입력칸과 버튼을 form으로 묶는다.
          브라우저 기본 검사 말풍선 대신 입력칸 아래 안내 글로 알려 주려고 noValidate를 건다 */}
      <form noValidate onSubmit={handleSubmit} className='flex flex-col gap-[2rem]'>
        <div className='flex flex-col gap-[0.8rem]'>
          {/* 13px 글자는 타이포 토큰에 없어서 이 자리에서만 크기를 직접 준다 */}
          <label
            htmlFor={inputId}
            className='text-[1.3rem] leading-normal font-semibold text-gray-700'
          >
            웹훅 URL
          </label>
          {/* 피그마 입력칸은 테두리 없는 회색 칸이라 Input의 테두리를 끄고 덧씌운다.
              caption-14-rg가 Input 기본 글자(caption-14-md)보다 CSS에서 뒤에 정의돼 있어 보통 굵기가 이긴다 */}
          <Input
            id={inputId}
            type='url'
            inputMode='url'
            autoComplete='off'
            hasBorder={false}
            placeholder='https://teamroom.nate.com/api/webhook/...'
            value={webhookUrlDraft}
            aria-invalid={webhookUrlError !== null}
            aria-describedby={hintId}
            onChange={handleWebhookUrlChange}
            className={cn(
              'caption-14-rg rounded-[0.8rem] border-0 bg-gray-50 px-[1.4rem] py-[1rem] text-gray-700 outline-none focus:ring-1 focus:ring-gray-400',
              webhookUrlError && 'ring-red focus:ring-red ring-1',
            )}
          />
          {/* 잘못 넣었을 때는 같은 자리의 안내 글을 빨간 오류 글로 바꿔, 화면 높이가 출렁이지 않게 한다 */}
          <p
            id={hintId}
            className={cn('caption-12-rg', webhookUrlError ? 'text-red' : 'text-gray-400')}
          >
            {webhookUrlError ?? WEBHOOK_URL_HINT}
          </p>
        </div>
        <div className='flex items-center gap-[0.8rem]'>
          {isConnected ? (
            <StateChip label='연결됨' tone='green' />
          ) : (
            <StateChip label='미연결' tone='gray' />
          )}
          <p className='text-[1.3rem] leading-normal text-gray-500'>
            {getStatusText(nateonWebhook)}
          </p>
        </div>
        <Modal.Footer className='flex-row items-center gap-[0.8rem]'>
          <Button
            size='medium'
            tone='subtle_2'
            color='gray'
            disabled={!isConnected}
            onClick={handleTestSend}
            className={cn(FOOTER_BUTTON_CLASS_NAME, OUTLINE_BUTTON_CLASS_NAME)}
          >
            테스트 전송
          </Button>
          <Button
            size='medium'
            tone='subtle_2'
            color='gray'
            disabled={!isConnected}
            onClick={handleDisconnect}
            className={cn('ml-auto', FOOTER_BUTTON_CLASS_NAME, OUTLINE_BUTTON_CLASS_NAME)}
          >
            연결 해제
          </Button>
          <Button type='submit' size='medium' color='blue' className={FOOTER_BUTTON_CLASS_NAME}>
            저장
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
