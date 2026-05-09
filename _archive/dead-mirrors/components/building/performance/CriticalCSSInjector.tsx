'use client';

import { useEffect } from 'react';

export default function CriticalCSSInjector() {
  useEffect(() => {
    // Inject critical CSS for above-the-fold content
    const criticalCSS = `
      /* Critical CSS for instant rendering */
      body {
        margin: 0;
        font-family: var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #000000;
        color: #ffffff;
        line-height: 1.6;
      }

      /* Header critical styles */
      .header-critical {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 1000;
        border-bottom: 1px solid rgba(251, 191, 36, 0.1);
      }

      /* Hero critical styles */
      .hero-critical {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
        position: relative;
        overflow: hidden;
      }

      .hero-title-critical {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 700;
        color: #fbbf24;
        text-align: center;
        margin: 0;
        font-family: var(--font-display), sans-serif;
        animation: fadeInUp 1s ease-out;
      }

      .hero-subtitle-critical {
        font-size: clamp(1rem, 2vw, 1.25rem);
        color: #ffffff;
        text-align: center;
        margin: 1rem 0 2rem 0;
        max-width: 600px;
        opacity: 0.9;
      }

      /* Button critical styles */
      .btn-critical {
        display: inline-block;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #000000;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 1rem;
      }

      .btn-critical:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
      }

      /* Loading animation */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .loading-critical {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(251, 191, 36, 0.3);
        border-radius: 50%;
        border-top-color: #fbbf24;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Responsive critical styles */
      @media (max-width: 768px) {
        .hero-title-critical {
          font-size: 2.5rem;
        }
        .hero-subtitle-critical {
          font-size: 1rem;
          padding: 0 1rem;
        }
        .btn-critical {
          padding: 0.875rem 1.5rem;
          font-size: 0.875rem;
        }
      }

      /* Accessibility critical styles */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* High contrast mode critical styles */
      @media (prefers-contrast: high) {
        .hero-title-critical {
          color: #ffffff;
        }
        .btn-critical {
          background: #ffffff;
          color: #000000;
        }
      }
    `;

    // Inject critical CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');

    // Insert at the beginning of head for highest priority
    const firstStyle = document.head.querySelector('style') || document.head.querySelector('link[rel="stylesheet"]');
    if (firstStyle) {
      document.head.insertBefore(style, firstStyle);
    } else {
      document.head.appendChild(style);
    }

    // Remove critical CSS after main CSS loads
    const removeCriticalCSS = () => {
      const criticalStyle = document.querySelector('style[data-critical]');
      if (criticalStyle) {
        criticalStyle.remove();
      }
    };

    // Remove after 3 seconds or when main CSS loads
    setTimeout(removeCriticalCSS, 3000);

    // Listen for main CSS load
    const mainCSS = document.querySelector('link[rel="stylesheet"]');
    if (mainCSS) {
      mainCSS.addEventListener('load', removeCriticalCSS);
    }

  }, []);

  return null;
}