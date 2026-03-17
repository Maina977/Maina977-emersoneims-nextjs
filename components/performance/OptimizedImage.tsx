'use client';

/**
 * Ultra-Optimized Image Component
 *
 * Features:
 * - Automatic WebP/AVIF format selection
 * - Responsive srcset generation
 * - Lazy loading with blur placeholder
 * - Intersection Observer for deferred loading
 * - Skeleton loading state
 * - Mobile-first optimization
 * - Zero CLS (Cumulative Layout Shift)
 */

import { useState, useRef, useEffect, memo } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  /** Show skeleton while loading */
  showSkeleton?: boolean;
  /** Blur hash or data URL for placeholder */
  blurDataURL?: string;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Aspect ratio for skeleton (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Fade in duration in ms */
  fadeInDuration?: number;
  /** Custom skeleton color */
  skeletonColor?: string;
  /** Disable lazy loading */
  eager?: boolean;
  /** Mobile-specific src */
  mobileSrc?: string;
  /** Threshold for intersection observer (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  showSkeleton = true,
  blurDataURL,
  priority = false,
  aspectRatio,
  fadeInDuration = 300,
  skeletonColor = '#1a1a2e',
  eager = false,
  mobileSrc,
  threshold = 0.01,
  rootMargin = '200px 0px',
  className = '',
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || eager);
  const [currentSrc, setCurrentSrc] = useState(src);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mobile-specific image
  useEffect(() => {
    if (mobileSrc && typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      setCurrentSrc(isMobile ? mobileSrc : src);

      const handleResize = () => {
        const isMobileNow = window.innerWidth <= 768;
        setCurrentSrc(isMobileNow ? mobileSrc : src);
      };

      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [src, mobileSrc]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || eager || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, eager, isInView, threshold, rootMargin]);

  // Calculate aspect ratio padding
  const aspectPadding = aspectRatio
    ? `${(1 / eval(aspectRatio)) * 100}%`
    : height && width
    ? `${(Number(height) / Number(width)) * 100}%`
    : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        paddingBottom: aspectPadding,
        backgroundColor: showSkeleton && !isLoaded ? skeletonColor : undefined,
      }}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(90deg, ${skeletonColor} 25%, #16213e 50%, ${skeletonColor} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
          aria-hidden="true"
        />
      )}

      {/* Actual image - only render when in view */}
      {isInView && (
        <Image
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoaded(true)}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-${fadeInDuration}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          sizes={props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw'}
          {...props}
        />
      )}
    </div>
  );
});

export default OptimizedImage;

/**
 * Hero Image - Optimized for above-the-fold LCP
 */
export const HeroImage = memo(function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      priority
      eager
      showSkeleton={false}
      fetchPriority="high"
      {...props}
    />
  );
});

/**
 * Thumbnail Image - Small images with aggressive optimization
 */
export const ThumbnailImage = memo(function ThumbnailImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      quality={60}
      showSkeleton
      threshold={0.1}
      rootMargin="100px 0px"
      {...props}
    />
  );
});

/**
 * Background Image - For decorative images
 */
export const BackgroundImage = memo(function BackgroundImage({
  src,
  alt = '',
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      quality={70}
      showSkeleton
      className={`object-cover ${className}`}
      {...props}
    />
  );
});
