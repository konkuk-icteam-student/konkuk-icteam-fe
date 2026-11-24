import { parseApiDateTime, type ApiJson } from '@/app/(student)/_apis/common';
import {
  deleteNateonWebhookMock,
  getNateonWebhookMock,
  sendNateonWebhookTestMock,
  updateNateonWebhookMock,
} from './mock/nateonWebhook';

// 등록한 웹훅 링크로 마지막에 보낸 테스트 알림
export type NateonWebhookTest = {
  sentAt: Date;
  isSuccess: boolean;
};

// 출근부 알림을 받을 네이트온 팀룸 연결 상태
export type NateonWebhook = {
  // 등록한 웹훅 링크. 링크 끝의 토큰은 비밀값이라 서버가 가려서 보낸다
  // (예: https://teamroom.nate.com/api/webhook/••••••••). 연결 전이면 null
  maskedWebhookUrl: string | null;
  // 연결한 뒤 아직 테스트를 보내지 않았으면 null
  lastTest: NateonWebhookTest | null;
};

export type GetNateonWebhookResponse = NateonWebhook;

export type UpdateNateonWebhookRequest = {
  // 네이트온 팀룸에서 발급한 웹훅 링크 (가리지 않은 원래 값)
  webhookUrl: string;
};

export type UpdateNateonWebhookResponse = NateonWebhook;

export type SendNateonWebhookTestResponse = NateonWebhookTest;

const toNateonWebhookTest = ({
  sentAt,
  isSuccess,
}: ApiJson<NateonWebhookTest>): NateonWebhookTest => ({
  sentAt: parseApiDateTime(sentAt),
  isSuccess,
});

const toNateonWebhook = ({
  maskedWebhookUrl,
  lastTest,
}: ApiJson<NateonWebhook>): NateonWebhook => ({
  maskedWebhookUrl,
  lastTest: lastTest ? toNateonWebhookTest(lastTest) : null,
});

/**
 * GET /admin/nateon-webhook
 * 네이트온 팀룸 알림 연결 상태
 */
export const getNateonWebhook = (): GetNateonWebhookResponse =>
  toNateonWebhook(getNateonWebhookMock());

/**
 * PUT /admin/nateon-webhook
 * 웹훅 링크를 등록하거나 바꾼다. 링크가 바뀌면 이전 링크로 보낸 테스트 기록은 지운다
 */
export const updateNateonWebhook = ({
  webhookUrl,
}: UpdateNateonWebhookRequest): UpdateNateonWebhookResponse =>
  toNateonWebhook(updateNateonWebhookMock(webhookUrl));

/**
 * POST /admin/nateon-webhook/test
 * 등록한 웹훅 링크로 테스트 알림을 보낸다. 연결 전이면 보내지 않고 undefined
 */
export const sendNateonWebhookTest = (): SendNateonWebhookTestResponse | undefined => {
  const lastTest = sendNateonWebhookTestMock();

  return lastTest ? toNateonWebhookTest(lastTest) : undefined;
};

/**
 * DELETE /admin/nateon-webhook
 * 웹훅 링크를 지워 연결을 해제한다. 팀룸으로 알림이 더 가지 않는다
 */
export const deleteNateonWebhook = () => {
  deleteNateonWebhookMock();
};
