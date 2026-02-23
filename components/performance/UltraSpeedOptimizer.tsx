/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 ULTRA SPEED OPTIMIZER
 * World's #1 Fastest Website - Performance Enhancement Module
 *
 * Features:
 * - Predictive prefetching based on user behavior
 * - Intelligent resource prioritization
 * - Connection warmup for faster subsequent requests
 * - Memory-efficient lazy loading
 * - Real-time performance monitoring
 *
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

// Performance thresholds
const PERFORMANCE_TARGETS = {
  FCP: 500,   // First Contentful Paint: 500ms
  LCP: 1000,  // Largest Contentful Paint: 1000ms
  FID: 50,    // First Input Delay: 50ms
  CLS: 0.1,   // Cumulative Layout Shift: 0.1
  TTFB: 100,  // Time to First Byte: 100ms
};

// Pages to prefetch based on common navigation patterns
const PREFETCH_ROUTES = [
  '/generators',
  '/solar',
  '/contact',
  '/services',
  '/generator-oracle',
  '/generators/maintenance-companion',
];

// External resources to preconnect
const PRECONNECT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.google-analytics.com',
  'https://vitals.vercel-insights.com',
];

export default function UltraSpeedOptimizer() {
  const hasInitialized = useRef(false);
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  // ═══════════════════════════════════════════════════════════════════════════
  // PREDICTIVE PREFETCHING
  // ═══════════════════════════════════════════════════════════════════════════

  const prefetchRoute = useCallback((route: string) => {
    if (prefetchedRoutes.current.has(route)) return;

    // Use Intersection Observer for lazy prefetching
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);

    prefetchedRoutes.current.add(route);
  }, []);

  const handleLinkHover = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href && link.href.startsWith(window.location.origin)) {
      const path = new URL(link.href).pathname;
      prefetchRoute(path);
    }
  }, [prefetchRoute]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE MONITORING
  // ═══════════════════════════════════════════════════════════════════════════

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Core Web Vitals
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const metric = {
          name: entry.name,
          value: entry.startTime || (entry as PerformanceEntry & { value?: number }).value || 0,
          target: PERFORMANCE_TARGETS[entry.name as keyof typeof PERFORMANCE_TARGETS],
        };

        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          const status = metric.value <= (metric.target || Infinity) ? '✅' : '⚠️';
          console.log(`${status} ${metric.name}: ${metric.value.toFixed(2)}ms (target: ${metric.target}ms)`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Some browsers don't support all entry types
    }

    return () => observer.disconnect();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTION WARMUP
  // ═══════════════════════════════════════════════════════════════════════════

  const warmupConnections = useCallback(() => {
    PRECONNECT_ORIGINS.forEach((origin) => {
      // Check if preconnect already exists
      if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // IDLE PREFETCHING
  // ═══════════════════════════════════════════════════════════════════════════

  const idlePrefetch = useCallback(() => {
    if ('requestIdleCallback' in window) {
      (window as Window & typeof globalThis & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        PREFETCH_ROUTES.forEach((route) => {
          prefetchRoute(route);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        PREFETCH_ROUTES.forEach((route) => {
          prefetchRoute(route);
        });
      }, 2000);
    }
  }, [prefetchRoute]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SERVICE WORKER COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════

  const notifyServiceWorker = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send prefetch hints to service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH',
        urls: PREFETCH_ROUTES,
      });
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RESOURCE HINTS
  // ═══════════════════════════════════════════════════════════════════════════

  const addResourceHints = useCallback(() => {
    // Preload critical fonts
    const criticalFonts = [
      { href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', type: 'font/woff2' },
    ];

    criticalFonts.forEach(({ href, type }) => {
      if (!document.querySelector(`link[rel="preload"][href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.type = type;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Warmup connections immediately
    warmupConnections();

    // Add resource hints
    addResourceHints();

    // Start performance monitoring
    measurePerformance();

    // Add hover listener for predictive prefetching
    document.addEventListener('mouseover', handleLinkHover, { passive: true });

    // Prefetch common routes when idle
    idlePrefetch();

    // Notify service worker
    notifyServiceWorker();

    // Log performance badge
    if (process.env.NODE_ENV === 'development') {
      console.log('%c⚡ EmersonEIMS Ultra Speed Optimizer Active',
        'background: linear-gradient(135deg, #FFD166, #06B6D4); color: #000; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 4px;');
    }

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, [warmupConnections, addResourceHints, measurePerformance, handleLinkHover, idlePrefetch, notifyServiceWorker]);

  // This component doesn't render anything - it's purely for performance optimization
  return null;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LAZY IMAGE COMPONENT
 * Ultra-optimized image loading with blur placeholder
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export function useLazyLoad(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('loaded');
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CRITICAL CSS STYLES
 * Inline styles for above-the-fold content
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export const criticalCSS = `
  /* Critical Above-the-fold styles */
  body { margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; }
  .loading-skeleton { background: linear-gradient(90deg, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .lazy-image { opacity: 0; transition: opacity 0.3s ease-in-out; }
  .lazy-image.loaded { opacity: 1; }
`;
