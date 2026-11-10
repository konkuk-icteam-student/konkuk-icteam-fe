import { ROUTES } from '@/shared/config/routes';
import {
  WORK_CHANGE_REQUEST_STATUS,
  type WorkChangeRequestStatusCode,
} from '@/shared/constants/workChangeRequestStatus';

// 전체 탭의 주소 status 값
export const STATUS_FILTER_ALL = 'ALL';

// 처리 상태 탭. 주소의 ?status= 값이고, 전체가 기본이다
export type StatusFilter = typeof STATUS_FILTER_ALL | WorkChangeRequestStatusCode;

const STATUS_FILTER_VALUES: StatusFilter[] = [
  STATUS_FILTER_ALL,
  ...Object.values(WORK_CHANGE_REQUEST_STATUS),
];

/**
 * 주소의 status 값을 처리 상태 탭으로 바꿉니다. 모르는 값이면 전체입니다.
 * @param value 주소의 status 값
 * @returns 처리 상태 탭
 * @example parseStatusFilter('CS01'); // 'CS01'
 */
export const parseStatusFilter = (value: unknown): StatusFilter =>
  STATUS_FILTER_VALUES.find((filter) => filter === value) ?? STATUS_FILTER_ALL;

/**
 * 처리 상태 탭을 연 근무 변경 요청 화면 주소를 만듭니다.
 * @param filter 열 처리 상태 탭
 * @returns 근무 변경 요청 화면 주소
 * @example createStatusFilterHref(WORK_CHANGE_REQUEST_STATUS.PENDING); // '/worktime/change-requests?status=CS01'
 */
export const createStatusFilterHref = (filter: StatusFilter) =>
  `${ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS}?status=${filter}`;
