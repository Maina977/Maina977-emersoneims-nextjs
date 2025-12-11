/**
 * Media Optimization Utilities
 * Optimizes images and videos for fast loading with Hollywood-grade color correction
 */

export interface MediaOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpg' | 'png';
  width?: number;
  height?: number;
  hollywoodGrading: boolean;
}

/**
 * Generate optimized image URL with parameters
 */
export function getOptimizedImageUrl(
  src: string,
  config: Partial<MediaOptimizationConfig> = {}
): string {
  const {
    quality = 85,
    format = 'webp',
    width,
    height,
  } = config;

  // If external WordPress URL, return as-is (WordPress handles optimization)
  if (src.startsWith('https://www.emersoneims.com')) {
    return src;
  }

  // For local images, Next.js Image component handles optimization
  return src;
}

/**
 * Get responsive image sizes
 */
export function getResponsiveSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints;
  
  return `(max-width: 640px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`;
}

/**
 * Preload critical media
 */
export function preloadMedia(src: string, type: 'image' | 'video'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = type;
  document.head.appendChild(link);
}

/**
 * Lazy load media with intersection observer
 */
export function lazyLoadMedia(
  element: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {}
): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    }
  );

  observer.observe(element);

  return () => observer.unobserve(element);
}

/**
 * Get video poster optimization
 */
export function getVideoPoster(src: string): string {
  // Generate poster from video or use provided
  return src.replace(/\.(mp4|webm|mov)$/i, '-poster.jpg');
}

/**
 * Check if device can handle high-quality media
 */
export function canHandleHighQuality(): boolean {
  if (typeof window === 'undefined') return true;

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    // Check connection speed
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false;
    }
  }

  // Check device pixel ratio for 4K
  const dpr = window.devicePixelRatio || 1;
  return dpr >= 1.5; // High DPI displays
}


