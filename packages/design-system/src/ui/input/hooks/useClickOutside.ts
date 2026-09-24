import { useEffect, useRef } from 'react';

/**
 * ref가 가리키는 요소 바깥을 클릭(또는 터치)하면 handleOutsideClick을 실행합니다.
 * @param ref 바깥 클릭 여부를 판단할 기준 요소의 ref
 * @param handleOutsideClick 바깥을 클릭했을 때 실행할 함수 (매 렌더마다 새로 만들어져도 안전합니다)
 * @example
 * const rootRef = useRef<HTMLDivElement>(null);
 * useClickOutside(rootRef, () => setIsOpen(false));
 */
const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handleOutsideClick: () => void,
) => {
  // 매 렌더의 최신 콜백을 담아둔다. effect 자체는 마운트 시 한 번만 리스너를 등록한다
  const handleOutsideClickRef = useRef(handleOutsideClick);
  handleOutsideClickRef.current = handleOutsideClick;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element) return;
      if (!element.contains(event.target as Node)) handleOutsideClickRef.current();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [ref]);
};

export default useClickOutside;
