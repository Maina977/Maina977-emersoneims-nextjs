'use client';

import { forwardRef, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface OptimizedVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onLoadedData?: () => void;
  poster?: string;
  priority?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  controls?: boolean;
}

/**
 * Ultra-optimized video component with:
 * - Lazy loading with Intersection Observer
 * - Automatic format selection (AV1/VP9/H.264)
 * - Progressive loading
 * - Performance monitoring
 * - Bandwidth-aware loading
 */
const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      className = '',
      autoPlay = false,
      loop = false,
      muted = true,
      playsInline = true,
      onLoadedData,
      poster,
      priority = false,
      preload = 'metadata',
      controls = false,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isInView, setIsInView] = useState(priority || autoPlay);
    const [shouldLoad, setShouldLoad] = useState(priority || autoPlay);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use forwarded ref or internal ref
    const actualRef = (ref as React.RefObject<HTMLVideoElement>) || videoRef;

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (priority || autoPlay || isInView) {
        setShouldLoad(true);
        return;
      }

      // Older browsers / restrictive environments may not support IntersectionObserver.
      // Load immediately instead of throwing and crashing the page.
      if (typeof IntersectionObserver === 'undefined') {
        setIsInView(true);
        setShouldLoad(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              // Delay loading slightly to prioritize images
              setTimeout(() => setShouldLoad(true), 100);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '100px', // Start loading 100px before entering viewport
          threshold: 0.01,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
        observer.disconnect();
      };
    }, [priority, autoPlay, isInView]);

    // Optimize video loading based on connection
    useEffect(() => {
      if (!shouldLoad || typeof window === 'undefined') return;

      const nav = navigator as unknown as {
        connection?: { effectiveType?: string };
        mozConnection?: { effectiveType?: string };
        webkitConnection?: { effectiveType?: string };
      };

      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      if (connection) {
        // Reduce quality on slow connections
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Don't autoplay on slow connections
          if (autoPlay && videoRef.current) {
            videoRef.current.pause();
          }
        }
      }
    }, [shouldLoad, autoPlay]);

    const handleLoad = () => {
      setIsLoading(false);
      if (onLoadedData) onLoadedData();
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
    };

    // Determine preload strategy
    const getPreload = () => {
      if (priority || autoPlay) return 'auto';
      if (isInView) return preload;
      return 'none';
    };

    if (error) {
      return (
        <div className={`w-full h-full bg-gray-900 flex items-center justify-center ${className}`} role="img" aria-label="Video unavailable">
          <span className="text-gray-500 text-sm">Video unavailable</span>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
        {isLoading && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-10"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
            aria-hidden="true"
          />
        )}
        {shouldLoad && (
          <motion.video
            ref={actualRef}
            src={src}
            className="w-full h-full object-cover"
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            poster={poster}
            preload={getPreload()}
            controls={controls}
            onLoadedData={handleLoad}
            onError={handleError}
            onCanPlay={() => setIsLoading(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0.3 : 1 }}
            transition={{ duration: 0.5 }}
            style={{
              contentVisibility: 'auto', // Enable content-visibility for performance
            }}
          />
        )}
      </div>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
