/**
 * Ultra Performance Optimization Library
 * Target: World's Fastest Website
 *
 * Performance Targets:
 * - FCP (First Contentful Paint): < 500ms
 * - LCP (Largest Contentful Paint): < 1000ms
 * - FID (First Input Delay): < 50ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - TTFB (Time to First Byte): < 100ms
 * - TTI (Time to Interactive): < 2000ms
 */

// Performance budget thresholds
export const PERFORMANCE_BUDGET = {
  // Core Web Vitals
  FCP: 500,    // First Contentful Paint (ms)
  LCP: 1000,   // Largest Contentful Paint (ms)
  FID: 50,     // First Input Delay (ms)
  CLS: 0.1,    // Cumulative Layout Shift (score)
  TTFB: 100,   // Time to First Byte (ms)
  TTI: 2000,   // Time to Interactive (ms)

  // Bundle sizes (KB)
  INITIAL_JS: 100,      // Initial JS bundle
  INITIAL_CSS: 30,      // Initial CSS
  TOTAL_JS: 300,        // Total JS (all chunks)
  TOTAL_CSS: 50,        // Total CSS
  IMAGE_HERO: 100,      // Hero image
  IMAGE_THUMBNAIL: 20,  // Thumbnail images

  // Network
  REQUESTS_INITIAL: 10, // Initial page requests
  REQUESTS_TOTAL: 50,   // Total requests after load
} as const;

// Device categories for responsive optimization
export const DEVICE_CATEGORIES = {
  MOBILE_SLOW: { maxWidth: 480, connection: '2g', memory: 2 },
  MOBILE_FAST: { maxWidth: 480, connection: '4g', memory: 4 },
  TABLET: { maxWidth: 1024, connection: '4g', memory: 4 },
  DESKTOP: { maxWidth: Infinity, connection: '4g', memory: 8 },
} as const;

/**
 * Detect device capabilities for adaptive loading
 */
export function getDeviceCapabilities(): {
  isMobile: boolean;
  isSlowConnection: boolean;
  isLowMemory: boolean;
  prefersReducedMotion: boolean;
  supportsWebP: boolean;
  supportsAVIF: boolean;
  connectionType: string;
  deviceMemory: number;
} {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isSlowConnection: false,
      isLowMemory: false,
      prefersReducedMotion: false,
      supportsWebP: true,
      supportsAVIF: true,
      connectionType: '4g',
      deviceMemory: 8,
    };
  }

  const connection = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  return {
    isMobile: window.innerWidth <= 768,
    isSlowConnection: connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g' || connection?.saveData === true,
    isLowMemory: deviceMemory < 4,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    supportsWebP: true, // Assume modern browsers
    supportsAVIF: CSS.supports?.('background-image', 'url("data:image/avif;base64,")') ?? false,
    connectionType: connection?.effectiveType || '4g',
    deviceMemory,
  };
}

/**
 * Adaptive image quality based on device/connection
 */
export function getOptimalImageQuality(): number {
  const capabilities = getDeviceCapabilities();

  if (capabilities.isSlowConnection || capabilities.isLowMemory) {
    return 60; // Lower quality for slow connections
  }
  if (capabilities.isMobile) {
    return 75; // Medium quality for mobile
  }
  return 85; // High quality for desktop
}

/**
 * Get optimal image dimensions based on viewport
 */
export function getOptimalImageSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number
): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: originalWidth, height: originalHeight };
  }

  const viewportWidth = window.innerWidth;
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
  const effectiveMaxWidth = maxWidth || viewportWidth;

  const targetWidth = Math.min(originalWidth, effectiveMaxWidth * devicePixelRatio);
  const aspectRatio = originalHeight / originalWidth;

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetWidth * aspectRatio),
  };
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources: Array<{
  href: string;
  as: 'image' | 'script' | 'style' | 'font' | 'fetch';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}>): void {
  if (typeof document === 'undefined') return;

  resources.forEach(({ href, as, type, crossOrigin }) => {
    // Check if already preloaded
    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossOrigin) link.crossOrigin = crossOrigin;

    document.head.appendChild(link);
  });
}

/**
 * Prefetch pages for instant navigation
 */
export function prefetchPages(paths: string[]): void {
  if (typeof document === 'undefined') return;

  // Use requestIdleCallback for non-blocking prefetch
  const prefetch = () => {
    paths.forEach(path => {
      const existing = document.querySelector(`link[rel="prefetch"][href="${path}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      link.as = 'document';
      document.head.appendChild(link);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(prefetch);
  } else {
    setTimeout(prefetch, 1000);
  }
}

/**
 * Defer non-critical JavaScript execution
 */
export function deferExecution(fn: () => void, priority: 'idle' | 'low' | 'normal' = 'idle'): void {
  if (typeof window === 'undefined') return;

  switch (priority) {
    case 'idle':
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(fn);
      } else {
        setTimeout(fn, 2000);
      }
      break;
    case 'low':
      setTimeout(fn, 100);
      break;
    case 'normal':
      queueMicrotask(fn);
      break;
  }
}

/**
 * Intersection Observer for lazy loading with performance optimization
 */
export function createLazyLoadObserver(
  onIntersect: (element: Element) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '200px 0px', // Start loading 200px before visible
    threshold: 0.01,
    ...options,
  };

  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onIntersect(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);
}

/**
 * Resource timing analysis
 */
export function analyzeResourceTiming(): {
  totalResources: number;
  totalSize: number;
  slowestResources: Array<{ name: string; duration: number }>;
  recommendations: string[];
} {
  if (typeof performance === 'undefined') {
    return { totalResources: 0, totalSize: 0, slowestResources: [], recommendations: [] };
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const recommendations: string[] = [];

  const slowestResources = [...resources]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5)
    .map(r => ({ name: r.name, duration: r.duration }));

  const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

  // Generate recommendations
  if (resources.length > PERFORMANCE_BUDGET.REQUESTS_TOTAL) {
    recommendations.push(`Reduce requests: ${resources.length} > ${PERFORMANCE_BUDGET.REQUESTS_TOTAL} budget`);
  }

  const largeImages = resources.filter(r =>
    r.initiatorType === 'img' && (r.transferSize || 0) > PERFORMANCE_BUDGET.IMAGE_HERO * 1024
  );
  if (largeImages.length > 0) {
    recommendations.push(`Optimize ${largeImages.length} large images`);
  }

  return {
    totalResources: resources.length,
    totalSize,
    slowestResources,
    recommendations,
  };
}

/**
 * Memory-efficient event listener that auto-cleans
 */
export function addCleanableEventListener<K extends keyof WindowEventMap>(
  target: Window | Document | Element,
  type: K,
  listener: (ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener as EventListener, options);
  return () => target.removeEventListener(type, listener as EventListener, options);
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): T {
  let inThrottle = false;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as T;
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element, offset = 0): boolean {
  if (typeof window === 'undefined') return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

/**
 * Generate responsive srcset for images
 */
export function generateSrcSet(
  basePath: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map(w => `${basePath}?w=${w} ${w}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: Record<string, string> = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '75vw',
  'default': '50vw'
}): string {
  return Object.entries(breakpoints)
    .map(([media, size]) => media === 'default' ? size : `${media} ${size}`)
    .join(', ');
}
