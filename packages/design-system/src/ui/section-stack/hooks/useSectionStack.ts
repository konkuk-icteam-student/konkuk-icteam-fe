import { useState } from 'react';
import { MAX_SECTION_STACK_SIZE } from '../constants/sectionStack';
import { SectionStackItem } from '../types/sectionStackItem';
import {
  getActiveIdAfterClose,
  pushSectionStackItem,
  removeSectionStackItem,
} from '../utils/sectionStack';

/**
 * 여러 항목을 스택으로 관리하는 훅입니다. (최대 개수를 넘으면 가장 오래된 항목부터 닫힘)
 * @param maxSize 동시에 열어둘 최대 항목 개수 (기본값: 5)
 * @returns items(열린 항목), activeId(보고 있는 항목), openSection/closeSection/activateSection
 * @example const { items, activeId, openSection, closeSection, activateSection } = useSectionStack();
 */
const useSectionStack = (maxSize = MAX_SECTION_STACK_SIZE) => {
  const [items, setItems] = useState<SectionStackItem[]>([]);
  const [activeId, setActiveId] = useState<string>();

  // 새 항목을 열고 바로 보여준다. 이미 열려 있으면 그 항목로 이동만 한다
  const openSection = (item: SectionStackItem) => {
    setItems((prev) => pushSectionStackItem(prev, item, maxSize));
    setActiveId(item.id);
  };

  // 항목을 닫는다. 보고 있던 항목이면 이전 항목이 표시된다
  const closeSection = (id: string) => {
    setActiveId((prevActiveId) => getActiveIdAfterClose(items, id, prevActiveId));
    setItems((prev) => removeSectionStackItem(prev, id));
  };

  const activateSection = (id: string) => setActiveId(id);

  return { items, activeId, openSection, closeSection, activateSection };
};

export default useSectionStack;
