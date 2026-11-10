import { useEffect, useRef, useState } from 'react';

// 버튼으로 여닫는 팝업. 영역 바깥을 누르거나 Escape를 누르면 닫는다
export const usePopover = <T extends HTMLElement>() => {
  const [isOpen, setIsOpen] = useState(false);
  // 버튼과 팝업을 함께 감싸는 영역. 이 안을 누르면 닫지 않는다
  const areaRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!areaRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleClose = () => setIsOpen(false);

  return { isOpen, areaRef, handleToggle, handleClose };
};
