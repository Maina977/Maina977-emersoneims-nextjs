'use client';

import { useEffect } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS CONTENT PROTECTION
 * Multi-layered defense against content theft and copying
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function ContentProtection() {
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12 (DevTools), Ctrl+Shift+I, Ctrl+A
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'a')) ||
        (e.metaKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'a')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && e.key === 'I') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection via double-click
    const handleMouseDown = (e: MouseEvent) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    };

    // Detect Print Screen attempts
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        // Intentionally do NOT touch the system clipboard here. Browsers
        // (Chromium 122+) treat any `navigator.clipboard.writeText()` call
        // outside an explicit user gesture as a permission-prompted action,
        // which surfaced an intrusive “wants to see text and images copied
        // to the clipboard” popup on first paint. PrintScreen detection in
        // a web page is unreliable anyway — leave the deterrent to CSP /
        // headers and keep the page load silent.
      }
    };

    // Add protection class to body
    document.body.classList.add('protected');

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('mousedown', handleMouseDown);

    // Disable developer tools debugger statement detection
    const interval = setInterval(() => {
      const before = Date.now();
      // This line detects if debugger is open (execution pauses)
      // eslint-disable-next-line no-debugger
      // debugger; // Uncomment in production if needed
      const after = Date.now();
      if (after - before > 100) {
        console.log('⚠️ Debugging detected');
      }
    }, 5000);

    return () => {
      document.body.classList.remove('protected');
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('mousedown', handleMouseDown);
      clearInterval(interval);
    };
  }, []);

  return null;
}
