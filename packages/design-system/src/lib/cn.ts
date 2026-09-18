import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스를 조건부로 합치고, 충돌하는 유틸리티 클래스는 뒤에 오는 값으로 정리합니다.
 * @param inputs 합칠 클래스 값들 (문자열, 조건부 객체, 배열 등)
 * @returns 정리된 클래스 문자열
 * @example cn("px-2", isActive && "bg-black", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
