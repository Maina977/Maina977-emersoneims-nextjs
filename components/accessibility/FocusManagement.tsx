'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS FOCUS TRAP - For Modal & Dialog Accessibility
 * WCAG 2.1 AAA Compliant
 * 
 * Traps focus within modals/dialogs for keyboard users
 * Essential for visually impaired users using screen readers
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useCallback } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
  initialFocus?: string; // CSS selector for initial focus element
  returnFocus?: boolean; // Return focus to trigger element on close
}

export function FocusTrap({ 
  children, 
  active, 
  onEscape, 
  initialFocus,
  returnFocus = true 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element
  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Set initial focus and handle return focus
  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Set initial focus
    const setInitialFocus = () => {
      if (initialFocus) {
        const element = containerRef.current?.querySelector(initialFocus) as HTMLElement;
        if (element) {
          element.focus();
          return;
        }
      }
      
      // Default to first focusable element
      const focusable = getFocusableElements(containerRef.current!);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(setInitialFocus, 10);

    return () => {
      clearTimeout(timer);
      // Return focus to previous element
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, initialFocus, returnFocus]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!active || !containerRef.current) return;

    // Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Tab key - trap focus
    if (event.key === 'Tab') {
      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: go to last element if on first
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: go to first element if on last
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [active, onEscape]);

  useEffect(() => {
    if (active) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [active, handleKeyDown]);

  if (!active) return <>{children}</>;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}

// Get all focusable elements within a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    'details > summary',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * KEYBOARD NAVIGATION HELPER
 * Shows keyboard shortcuts for power users and screen reader users
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export function KeyboardShortcutsHelper() {
  return (
    <div className="sr-only" role="note" aria-label="Keyboard shortcuts">
      <h2>Keyboard Shortcuts</h2>
      <ul>
        <li>Alt + A: Open accessibility settings</li>
        <li>Tab: Navigate to next element</li>
        <li>Shift + Tab: Navigate to previous element</li>
        <li>Enter or Space: Activate buttons and links</li>
        <li>Escape: Close dialogs and menus</li>
        <li>Arrow keys: Navigate within menus and sliders</li>
        <li>Home: Go to beginning of list</li>
        <li>End: Go to end of list</li>
      </ul>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROVING TABINDEX - For Arrow Key Navigation in Lists/Menus
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface UseRovingTabIndexProps {
  itemCount: number;
  initialIndex?: number;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
}

export function useRovingTabIndex({
  itemCount,
  initialIndex = 0,
  orientation = 'vertical',
  loop = true,
}: UseRovingTabIndexProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    let newIndex = activeIndex;

    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (event.key) {
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          newIndex = loop 
            ? (activeIndex + 1) % itemCount 
            : Math.min(activeIndex + 1, itemCount - 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          newIndex = loop 
            ? (activeIndex - 1 + itemCount) % itemCount 
            : Math.max(activeIndex - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          newIndex = loop 
            ? (activeIndex + 1) % itemCount 
            : Math.min(activeIndex + 1, itemCount - 1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          newIndex = loop 
            ? (activeIndex - 1 + itemCount) % itemCount 
            : Math.max(activeIndex - 1, 0);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemCount, orientation, loop]);

  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getTabIndex,
  };
}

import { useState } from 'react';

export default FocusTrap;
