'use client';

/**
 * Performance Optimization Hooks
 *
 * React hooks for:
 * - Device capability detection
 * - Connection-aware loading
 * - Intersection-based lazy loading
 * - Performance monitoring
 *
 * © 2026 EmersonEIMS. All Rights Reserved.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getConnectionProfile, isMobileDevice, getOptimalViewport } from '@/lib/performance/mobileOptimization';
import { getDeviceCapabilities, PERFORMANCE_BUDGET } from '@/lib/performance/ultraPerformance';

/**
 * Hook to detect device capabilities
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => getDeviceCapabilities());

  useEffect(() => {
    // Update on resize
    const handleResize = () => {
      setCapabilities(getDeviceCapabilities());
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}

/**
 * Hook for connection-aware loading
 */
export function useConnectionProfile() {
  const [profile, setProfile] = useState(() => getConnectionProfile());

  useEffect(() => {
    const connection = (navigator as unknown as {
      connection?: {
        addEventListener?: (event: string, handler: () => void) => void;
        removeEventListener?: (event: string, handler: () => void) => void;
      };
    }).connection;

    if (connection?.addEventListener) {
      const handleChange = () => setProfile(getConnectionProfile());
      connection.addEventListener('change', handleChange);
      return () => connection.removeEventListener?.('change', handleChange);
    }
  }, []);

  return profile;
}

/**
 * Hook for lazy loading with Intersection Observer
 */
export function useLazyLoad<T extends HTMLElement>(
  options: {
    rootMargin?: string;
    threshold?: number | number[];
    triggerOnce?: boolean;
  } = {}
) {
  const { rootMargin = '200px 0px', threshold = 0.01, triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasTriggered(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return { ref, isVisible };
}

/**
 * Hook for deferred loading
 */
export function useDeferred<T>(
  value: T,
  delay: number = 0,
  options: { useIdleCallback?: boolean } = {}
): T | undefined {
  const { useIdleCallback = true } = options;
  const [deferredValue, setDeferredValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    const schedule = () => {
      if (useIdleCallback && 'requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => void })
          .requestIdleCallback(() => setDeferredValue(value));
      } else {
        setDeferredValue(value);
      }
    };

    if (delay > 0) {
      const timer = setTimeout(schedule, delay);
      return () => clearTimeout(timer);
    } else {
      schedule();
    }
  }, [value, delay, useIdleCallback]);

  return deferredValue;
}

/**
 * Hook for performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    fcp: number | null;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    ttfb: number | null;
  }>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // FCP & LCP
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(m => ({ ...m, fcp: entry.startTime }));
        }
      }
    });

    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(m => ({ ...m, lcp: lastEntry.startTime }));
      }
    });

    // FID
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        setMetrics(m => ({ ...m, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
          setMetrics(m => ({ ...m, cls: clsValue }));
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch {
      // Some entry types may not be supported
    }

    // TTFB
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      setMetrics(m => ({ ...m, ttfb: navEntry.responseStart - navEntry.requestStart }));
    }

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const isWithinBudget = useMemo(() => ({
    fcp: metrics.fcp !== null && metrics.fcp <= PERFORMANCE_BUDGET.FCP,
    lcp: metrics.lcp !== null && metrics.lcp <= PERFORMANCE_BUDGET.LCP,
    fid: metrics.fid !== null && metrics.fid <= PERFORMANCE_BUDGET.FID,
    cls: metrics.cls !== null && metrics.cls <= PERFORMANCE_BUDGET.CLS,
    ttfb: metrics.ttfb !== null && metrics.ttfb <= PERFORMANCE_BUDGET.TTFB,
  }), [metrics]);

  return { metrics, isWithinBudget, budget: PERFORMANCE_BUDGET };
}

/**
 * Hook for responsive values
 */
export function useResponsive<T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}): T {
  const [value, setValue] = useState<T>(values.desktop);

  useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setValue(values.mobile);
      } else if (width < 1024 && values.tablet !== undefined) {
        setValue(values.tablet);
      } else {
        setValue(values.desktop);
      }
    };

    updateValue();
    window.addEventListener('resize', updateValue, { passive: true });
    return () => window.removeEventListener('resize', updateValue);
  }, [values.mobile, values.tablet, values.desktop]);

  return value;
}

/**
 * Hook for throttled callback
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for prefetching pages
 */
export function usePrefetch(paths: string[]) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Use requestIdleCallback for non-blocking prefetch
    const prefetch = () => {
      paths.forEach(path => {
        const existing = document.querySelector(`link[rel="prefetch"][href="${path}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = path;
          link.as = 'document';
          document.head.appendChild(link);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void) => number })
        .requestIdleCallback(prefetch);
      return () => (window as Window & { cancelIdleCallback: (id: number) => void })
        .cancelIdleCallback(id);
    } else {
      const timer = setTimeout(prefetch, 2000);
      return () => clearTimeout(timer);
    }
  }, [paths]);
}

/**
 * Hook for image loading state
 */
export function useImageLoaded() {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;

    if (img.complete) {
      setIsLoaded(true);
    } else {
      const handleLoad = () => setIsLoaded(true);
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, []);

  return { ref, isLoaded };
}
