/**
 * PERFORMANCE OPTIMIZATION UTILITIES
 * Tesla-level performance best practices
 */

// Image Optimization
export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

// Lazy Load Images
export const lazyLoadImage = (src: string, placeholder = '/placeholder.svg') => {
  return {
    src: placeholder,
    'data-src': src,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
};

// Preload Critical Assets
export const preloadCriticalAssets = () => {
  if (typeof window === 'undefined') return;

  const criticalAssets = [
    '/fonts/inter-var.woff2',
    '/logo.svg',
    '/hero-bg.jpg',
  ];

  criticalAssets.forEach((asset) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = asset.endsWith('.woff2') ? 'font' : 'image';
    link.href = asset;
    if (asset.endsWith('.woff2')) {
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

// DNS Prefetch for External Domains
export const dnsPrefetch = (domains: string[]) => {
  if (typeof window === 'undefined') return;

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Preconnect to Critical Origins
export const preconnect = (origins: string[]) => {
  if (typeof window === 'undefined') return;

  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Debounce Function
export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): ((...args: Args) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle Function
export const throttle = <Args extends unknown[]>(
  func: (...args: Args) => void,
  limit: number
): ((...args: Args) => void) => {
  let inThrottle: boolean;
  return (...args: Args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for Lazy Loading
export const createLazyLoader = (
  elements: NodeListOf<Element>,
  callback: (element: Element) => void,
  options?: IntersectionObserverInit
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  elements.forEach((element) => observer.observe(element));

  return observer;
};

// Request Idle Callback Polyfill
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(cb, 1);

// Cancel Idle Callback Polyfill
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

// Resource Hints
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  // DNS Prefetch
  dnsPrefetch([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
  ]);

  // Preconnect
  preconnect([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]);

  // Preload Critical Resources
  preloadCriticalAssets();
};

// Web Vitals Reporting
type WebVitalMetric = {
  name: string;
  value: number;
  id: string;
};

export const reportWebVitals = (metric: WebVitalMetric) => {
  if (typeof window === 'undefined') return;

  // Send to analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, metric.value);
  }
};

// Animation Performance
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// GPU Acceleration
export const gpuAccelerate = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform';
};

// Remove GPU Acceleration
export const removeGpuAcceleration = (element: HTMLElement) => {
  element.style.transform = '';
  element.style.willChange = 'auto';
};

// Critical CSS Inline
export const inlineCriticalCSS = (css: string) => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker Registration
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
