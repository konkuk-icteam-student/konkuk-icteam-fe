import { ButtonHTMLAttributes } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ButtonAccent, ButtonDisplay, ButtonSize, ButtonTone } from './types/variant';
import {
  BUTTON_BASE,
  BUTTON_COLOR,
  BUTTON_DISABLED,
  BUTTON_DISPLAY,
  BUTTON_SIZE,
} from './constants/theme';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  display?: ButtonDisplay;
  size?: ButtonSize;
  tone?: ButtonTone;
  color?: ButtonAccent;
  isLoading?: boolean;
};

export default function Button({
  children,
  display = 'block',
  size = 'large',
  tone = 'solid',
  color = 'black',
  disabled = false,
  type = 'button',
  isLoading = false,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={cn(
        BUTTON_BASE,
        BUTTON_DISPLAY[display],
        BUTTON_SIZE[size],
        BUTTON_COLOR[tone][color],
        isDisabled && BUTTON_DISABLED,
        className,
      )}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {children}
    </button>
  );
}
