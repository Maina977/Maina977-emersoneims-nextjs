'use client';

import { useEffect } from 'react';

/**
 * Enhanced Accessibility Component
 * WCAG AAA Compliance - Apple Level Standards
 */
export default function EnhancedAccessibility() {
  useEffect(() => {
    // Keyboard navigation enhancements
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      // Skip to main content
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Focus visible enhancements
    const addFocusVisible = () => {
      const style = document.createElement('style');
      style.textContent = `
        *:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
          border-radius: 4px;
        }
        .skip-link {
          position: absolute;
          left: -9999px;
          z-index: 999;
        }
        .skip-link:focus {
          left: 6px;
          top: 7px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    };

    document.addEventListener('keydown', handleKeyboardNavigation);
    addFocusVisible();

    // ARIA live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);

    // Announce page changes
    const announcePageChange = (message: string) => {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    };

    // Monitor route changes (Next.js)
    const observer = new MutationObserver(() => {
      const title = document.title;
      announcePageChange(`Navigated to ${title}`);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
      observer.disconnect();
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  return (
    <>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
    </>
  );
}

