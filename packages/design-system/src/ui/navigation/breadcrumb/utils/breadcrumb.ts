import { BreadcrumbItem } from '../types/breadcrumbItem';

/**
 * URL 경로 조각을 사람이 읽을 수 있는 문자열로 디코딩합니다. 잘못된 인코딩이면 원본을 그대로 돌려줍니다.
 * @param segment 경로 조각 (예: '%ED%95%99%EC%82%AC')
 * @returns 디코딩된 문자열 (예: '학사')
 * @example const label = decodePathSegment('%ED%95%99%EC%82%AC'); // '학사'
 */
const decodePathSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

/**
 * URL 경로를 Breadcrumb에 넘길 항목 목록으로 바꿉니다. 쿼리(?)와 해시(#)는 무시합니다.
 * 각 항목의 href는 그 조각까지의 경로이고, 표시 이름은 labels에서 찾고 없으면 경로 조각을 그대로 씁니다.
 * @param pathname 현재 경로 (예: '/faq/tech/academic'). 루트('/')면 빈 배열을 반환합니다
 * @param labels 경로 조각 -> 표시 이름 (예: { faq: 'FAQ', tech: '기술' })
 * @returns Breadcrumb items
 * @example
 * const items = createBreadcrumbItems('/faq/tech', { faq: 'FAQ', tech: '기술' });
 * // [{ label: 'FAQ', href: '/faq' }, { label: '기술', href: '/faq/tech' }]
 */
export const createBreadcrumbItems = (
  pathname: string,
  labels: Record<string, string> = {},
): BreadcrumbItem[] => {
  const segments = (pathname.split(/[?#]/)[0] ?? '').split('/').filter(Boolean);

  return segments.map((segment, index) => ({
    label: labels[segment] ?? decodePathSegment(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }));
};
