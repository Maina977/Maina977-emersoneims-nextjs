'use client';

import { useEffect } from 'react';

/**
 * Enhanced focus-visible polyfill and styling
 * Ensures keyboard navigation is always visible
 */
export default function FocusVisible() {
  useEffect(() => {
    // Add focus-visible class when keyboard is used
    let hadKeyboardEvent = false;
    let keyboardThrottleTimeout: NodeJS.Timeout;

    const matcher = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return;
      }
      hadKeyboardEvent = true;
    };

    const onPointerDown = () => {
      hadKeyboardEvent = false;
    };

    const onFocus = (e: FocusEvent) => {
      if (hadKeyboardEvent || (e.target as HTMLElement)?.matches(':focus-visible')) {
        (e.target as HTMLElement)?.classList.add('focus-visible');
      }
    };

    const onBlur = (e: FocusEvent) => {
      (e.target as HTMLElement)?.classList.remove('focus-visible');
    };

    document.addEventListener('keydown', matcher, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('focusin', onFocus, true);
    document.addEventListener('focusout', onBlur, true);

    return () => {
      document.removeEventListener('keydown', matcher, true);
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('focusin', onFocus, true);
      document.removeEventListener('focusout', onBlur, true);
    };
  }, []);

  return null;
}






