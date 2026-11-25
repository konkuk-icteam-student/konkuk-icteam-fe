import { toApiDate, type ApiJson } from '@/app/(student)/_apis/common';
import { toNotice, type Notice } from '@/app/(student)/_apis/notices';
import { createNoticeMock, deleteNoticeMock, getNoticesMock } from './mock/notices';

// 공지 한 건의 모양은 근로학생 API(shared/apis/notices)와 같다
export type { Notice } from '@/app/(student)/_apis/notices';

// 공지를 등록할 때 보내는 값
export type NoticeInput = Pick<Notice, 'title' | 'content' | 'startDate' | 'endDate'>;

export type GetNoticesResponse = {
  // 게시가 끝나지 않은 공지 (게시 중·게시 예정). 시작일 순
  notices: Notice[];
};

export type CreateNoticeRequest = NoticeInput;

export type CreateNoticeResponse = Notice;

export type DeleteNoticeRequest = {
  noticeId: number;
};

const toNoticeInputJson = ({
  title,
  content,
  startDate,
  endDate,
}: NoticeInput): ApiJson<NoticeInput> => ({
  title,
  content,
  startDate: toApiDate(startDate),
  endDate: toApiDate(endDate),
});

/**
 * GET /admin/notices
 * 게시 중이거나 게시 예정인 공지사항
 */
export const getNotices = (): GetNoticesResponse => ({
  notices: getNoticesMock(toApiDate(new Date())).map(toNotice),
});

/**
 * POST /admin/notices
 * 공지사항을 등록한다
 */
export const createNotice = (request: CreateNoticeRequest): CreateNoticeResponse =>
  toNotice(createNoticeMock(toNoticeInputJson(request)));

/**
 * DELETE /admin/notices/{noticeId}
 * 공지사항을 지운다. 근로학생에게서도 바로 사라진다
 */
export const deleteNotice = ({ noticeId }: DeleteNoticeRequest) => {
  deleteNoticeMock(noticeId);
};
