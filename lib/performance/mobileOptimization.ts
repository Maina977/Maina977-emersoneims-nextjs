/**
 * Mobile Performance Optimization Library
 *
 * Optimizations for mobile devices across all networks:
 * - 2G/3G/4G/5G adaptive loading
 * - Battery-aware optimizations
 * - Touch-optimized interactions
 * - Reduced memory footprint
 *
 * © 2026 EmersonEIMS. All Rights Reserved.
 */

// Connection types and their characteristics
export const CONNECTION_PROFILES = {
  'slow-2g': {
    maxImageQuality: 40,
    disableAnimations: true,
    disableVideos: true,
    reducedComponents: true,
    deferAllImages: true,
    prefetchLimit: 0,
  },
  '2g': {
    maxImageQuality: 50,
    disableAnimations: true,
    disableVideos: true,
    reducedComponents: true,
    deferAllImages: true,
    prefetchLimit: 1,
  },
  '3g': {
    maxImageQuality: 60,
    disableAnimations: false,
    disableVideos: true,
    reducedComponents: false,
    deferAllImages: false,
    prefetchLimit: 2,
  },
  '4g': {
    maxImageQuality: 75,
    disableAnimations: false,
    disableVideos: false,
    reducedComponents: false,
    deferAllImages: false,
    prefetchLimit: 5,
  },
  '5g': {
    maxImageQuality: 85,
    disableAnimations: false,
    disableVideos: false,
    reducedComponents: false,
    deferAllImages: false,
    prefetchLimit: 10,
  },
} as const;

export type ConnectionType = keyof typeof CONNECTION_PROFILES;

/**
 * Get current connection profile
 */
export function getConnectionProfile(): typeof CONNECTION_PROFILES[ConnectionType] {
  if (typeof navigator === 'undefined') {
    return CONNECTION_PROFILES['4g'];
  }

  const connection = (navigator as unknown as {
    connection?: {
      effectiveType?: ConnectionType;
      saveData?: boolean;
      downlink?: number;
      rtt?: number;
    };
  }).connection;

  if (!connection) {
    return CONNECTION_PROFILES['4g'];
  }

  // If user has save-data enabled, use 2g profile
  if (connection.saveData) {
    return CONNECTION_PROFILES['2g'];
  }

  const type = connection.effectiveType || '4g';
  return CONNECTION_PROFILES[type] || CONNECTION_PROFILES['4g'];
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
}

/**
 * Check if device is in low battery mode
 */
export async function isLowBattery(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  try {
    const battery = await (navigator as unknown as {
      getBattery?: () => Promise<{ level: number; charging: boolean }>;
    }).getBattery?.();

    if (battery) {
      return battery.level < 0.2 && !battery.charging;
    }
  } catch {
    // Battery API not supported
  }

  return false;
}

/**
 * Get optimal viewport dimensions for current device
 */
export function getOptimalViewport(): {
  width: number;
  height: number;
  pixelRatio: number;
  isLandscape: boolean;
} {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080, pixelRatio: 1, isLandscape: true };
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio,
    isLandscape: window.innerWidth > window.innerHeight,
  };
}

/**
 * Optimize touch interactions
 */
export function enableFastTap(element: HTMLElement): () => void {
  let touchStartY = 0;
  let touchStartX = 0;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    // If scroll distance is minimal, treat as tap
    if (Math.abs(touchEndY - touchStartY) < 10 && Math.abs(touchEndX - touchStartX) < 10) {
      e.preventDefault();
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      e.target?.dispatchEvent(clickEvent);
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: false });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Reduce memory usage by cleaning up unused elements
 */
export function cleanupHiddenElements(): void {
  if (typeof document === 'undefined') return;

  // Find images that are far from viewport
  const images = document.querySelectorAll('img[data-src]');
  const viewportHeight = window.innerHeight;

  images.forEach((img) => {
    const rect = img.getBoundingClientRect();
    // If image is more than 3 screens away, unload it
    if (rect.top > viewportHeight * 4 || rect.bottom < -viewportHeight * 3) {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.src && !htmlImg.dataset.src) {
        htmlImg.dataset.src = htmlImg.src;
        htmlImg.src = '';
      }
    }
  });
}

/**
 * Optimize scrolling performance
 */
export function enableSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  let ticking = false;
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Emit custom event for scroll-based animations
        window.dispatchEvent(new CustomEvent('optimizedScroll', {
          detail: { scrollY: lastScrollY }
        }));
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

/**
 * Preload critical resources for mobile
 */
export function preloadMobileCritical(): void {
  if (typeof document === 'undefined') return;

  const criticalResources = [
    { href: '/images/logo-tagline.png', as: 'image' },
  ];

  criticalResources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
}

/**
 * Adaptive font loading for mobile
 */
export function loadFontsAdaptively(): void {
  if (typeof document === 'undefined') return;

  const profile = getConnectionProfile();

  // On slow connections, use system fonts
  if (profile.maxImageQuality <= 50) {
    document.documentElement.style.setProperty(
      '--font-sans',
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    );
    return;
  }

  // Otherwise, load custom fonts with display: swap
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
}

/**
 * Initialize all mobile optimizations
 */
export function initMobileOptimizations(): () => void {
  if (typeof window === 'undefined') return () => {};

  const cleanups: Array<() => void> = [];

  // Enable smooth scroll handling
  cleanups.push(enableSmoothScroll());

  // Preload critical resources
  preloadMobileCritical();

  // Adaptive font loading
  loadFontsAdaptively();

  // Periodic memory cleanup
  const cleanupInterval = setInterval(cleanupHiddenElements, 30000);
  cleanups.push(() => clearInterval(cleanupInterval));

  // Listen for visibility changes to pause animations
  const handleVisibilityChange = () => {
    if (document.hidden) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  cleanups.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange));

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Get mobile-optimized image URL
 */
export function getMobileImageUrl(
  src: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}
): string {
  const profile = getConnectionProfile();
  const viewport = getOptimalViewport();

  const width = options.width || Math.min(viewport.width * viewport.pixelRatio, 1200);
  const quality = Math.min(options.quality || profile.maxImageQuality, 85);
  const format = options.format || 'auto';

  // If using Next.js Image optimization
  if (src.startsWith('/') || src.startsWith('/_next/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }

  return src;
}
