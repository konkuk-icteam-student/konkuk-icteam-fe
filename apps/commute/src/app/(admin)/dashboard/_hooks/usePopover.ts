import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 버튼으로 여닫는 팝업. 영역 바깥을 누르거나 포커스가 나가면 닫아서, 팝업은 한 번에 하나만 열려 있다
// 열리면 패널 첫 칸으로 포커스를 옮기고, Escape로 닫으면 버튼으로 돌려준다
// 패널 아래 공간이 모자라면 패널에 data-side='top'을 달아 버튼 위로 띄울 수 있게 한다
// (넘치면 안 되는 영역은 data-popover-boundary로 표시하고, 없으면 화면 기준)
export default function usePopover<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const areaRef = useRef<T>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const area = areaRef.current;
    const panel = panelRef.current;
    if (!isOpen || !area || !panel) return;

    const areaRect = area.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const boundaryRect = area.closest('[data-popover-boundary]')?.getBoundingClientRect();
    const limitTop = Math.max(boundaryRect?.top ?? 0, 0);
    const limitBottom = Math.min(boundaryRect?.bottom ?? Infinity, window.innerHeight);
    // 버튼과 패널 사이 간격. 위로 띄울 때도 같은 간격을 둔다
    const gap = panelRect.top - areaRect.bottom;
    const fitsBelow = panelRect.bottom <= limitBottom;
    const fitsAbove = areaRect.top - gap - panelRect.height >= limitTop;
    panel.dataset.side = !fitsBelow && fitsAbove ? 'top' : 'bottom';

    panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const isOutside = (target: EventTarget | null) => !areaRef.current?.contains(target as Node);
    const handlePointerDown = (event: PointerEvent) => {
      if (isOutside(event.target)) setIsOpen(false);
    };
    // 키보드로 다른 버튼에 옮겨 가도 닫는다
    const handleFocusIn = (event: FocusEvent) => {
      if (isOutside(event.target)) setIsOpen(false);
    };
    // 안쪽 드롭다운 목록이 Escape를 먼저 썼으면(preventDefault) 팝업은 그대로 둔다
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  // 패널 안에서 무언가를 골라 닫을 때 쓴다. 포커스를 버튼으로 돌려준다
  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return { isOpen, areaRef, triggerRef, panelRef, handleToggle, handleClose };
}
