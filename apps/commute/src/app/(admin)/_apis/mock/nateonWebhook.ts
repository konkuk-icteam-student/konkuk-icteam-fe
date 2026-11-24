import { toApiDateTime, type ApiJson } from '@/app/(student)/_apis/common';
import type { NateonWebhook, NateonWebhookTest } from '../nateonWebhook';

type NateonWebhookJson = ApiJson<NateonWebhook>;

type NateonWebhookTestJson = ApiJson<NateonWebhookTest>;

// 서버가 웹훅 토큰 자리에 넣어 보내는 가림 글자
const WEBHOOK_TOKEN_MASK = '••••••••';

/**
 * 웹훅 링크 끝의 토큰을 가립니다. 서버가 비밀 토큰을 그대로 보내지 않는 것을 흉내 냅니다.
 * @param webhookUrl 등록한 웹훅 링크
 * @returns 마지막 / 뒤를 가린 링크
 * @example createMaskedWebhookUrl('https://teamroom.nate.com/api/webhook/abc123');
 * // 'https://teamroom.nate.com/api/webhook/••••••••'
 */
const createMaskedWebhookUrl = (webhookUrl: string) =>
  `${webhookUrl.slice(0, webhookUrl.lastIndexOf('/') + 1)}${WEBHOOK_TOKEN_MASK}`;

// 피그마 시안처럼 이미 연결돼 있고, 테스트도 한 번 성공한 상태로 시작한다
let nateonWebhookMock: NateonWebhookJson = {
  maskedWebhookUrl: `https://teamroom.nate.com/api/webhook/${WEBHOOK_TOKEN_MASK}`,
  lastTest: { sentAt: '2026-11-06T09:12:00', isSuccess: true },
};

export const getNateonWebhookMock = () => nateonWebhookMock;

export const updateNateonWebhookMock = (webhookUrl: string) => {
  nateonWebhookMock = { maskedWebhookUrl: createMaskedWebhookUrl(webhookUrl), lastTest: null };

  return nateonWebhookMock;
};

// 목업에서는 테스트 전송이 늘 성공한다
export const sendNateonWebhookTestMock = (): NateonWebhookTestJson | undefined => {
  if (nateonWebhookMock.maskedWebhookUrl === null) return undefined;

  const lastTest = { sentAt: toApiDateTime(new Date()), isSuccess: true };
  nateonWebhookMock = { ...nateonWebhookMock, lastTest };

  return lastTest;
};

export const deleteNateonWebhookMock = () => {
  nateonWebhookMock = { maskedWebhookUrl: null, lastTest: null };
};
