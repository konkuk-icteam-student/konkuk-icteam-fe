import { SectionStackItem } from '../types/sectionStackItem';

/**
 * 항목을 스택에 추가합니다. 이미 열려 있는 id면 그대로 두고, 최대 개수를 넘으면 가장 오래된 항목부터 뺍니다.
 * @param items 현재 열려 있는 항목 (오래된 순서)
 * @param item 새로 열 항목
 * @param maxSize 최대 개수
 * @returns 추가된 항목 목록 (오래된 순서)
 * @example const next = pushSectionStackItem(items, { id: 'a', title: 'A', content: null }, 5);
 */
export const pushSectionStackItem = (
  items: SectionStackItem[],
  item: SectionStackItem,
  maxSize: number,
): SectionStackItem[] => {
  if (items.some((existing) => existing.id === item.id)) return items;
  return [...items, item].slice(-maxSize);
};

/**
 * 항목을 스택에서 뺍니다.
 * @param items 현재 열려 있는 항목 (오래된 순서)
 * @param id 닫을 항목 id
 * @returns 닫은 항목을 제외한 목록
 * @example const next = removeSectionStackItem(items, 'a');
 */
export const removeSectionStackItem = (items: SectionStackItem[], id: string): SectionStackItem[] =>
  items.filter((item) => item.id !== id);

/**
 * 항목을 닫은 뒤 화면에 보여줄 항목 id를 정합니다.
 * - 보고 있던 항목이 아닌 다른 항목을 닫으면 보던 항목을 그대로 둡니다.
 * - 보고 있던 항목을 닫으면 그 전에 열었던(이전) 항목을 보여주고, 이전 항목이 없으면 다음 항목을 보여줍니다.
 * @param items 닫기 전 항목 목록 (오래된 순서)
 * @param closedId 닫는 항목 id
 * @param activeId 지금 보고 있는 항목 id
 * @returns 닫은 뒤 보여줄 항목 id (남은 항목이 없으면 undefined)
 * @example const nextId = getActiveIdAfterClose(items, 'c', 'c'); // 'c' 바로 앞에 열었던 항목의 id
 */
export const getActiveIdAfterClose = (
  items: SectionStackItem[],
  closedId: string,
  activeId: string | undefined,
): string | undefined => {
  if (closedId !== activeId) return activeId;

  const closedIndex = items.findIndex((item) => item.id === closedId);
  const remaining = removeSectionStackItem(items, closedId);
  return remaining[Math.max(closedIndex - 1, 0)]?.id;
};
