'use client';

import { useEffect } from 'react';

/**
 * Apple-Level Font Loading Optimization
 * Ensures fonts load efficiently and don't block rendering
 */
export default function FontOptimizer() {
  useEffect(() => {
    // Preload critical fonts
    if (typeof window !== 'undefined' && 'fonts' in document) {
      const fonts = [
        { family: 'Geist Sans', weight: '400' },
        { family: 'Space Grotesk', weight: '700' },
        { family: 'Inter', weight: '400' },
      ];

      fonts.forEach((font) => {
        try {
          document.fonts.load(`400 16px "${font.family}"`);
        } catch {
          // Fallback for browsers without Font Loading API
        }
      });
    }

    // Add font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Geist Sans';
        font-display: swap;
      }
      @font-face {
        font-family: 'Space Grotesk';
        font-display: swap;
      }
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
}







