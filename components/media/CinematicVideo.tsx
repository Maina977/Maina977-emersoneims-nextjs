'use client';

import { forwardRef, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CinematicVideoProps {
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
  colorGrade?: 'hollywood' | 'teal-orange' | 'noir' | 'vintage' | 'blockbuster';
  vignette?: boolean;
  filmGrain?: boolean;
}

/**
 * CINEMATIC VIDEO COMPONENT
 * Hollywood-grade color grading with ultra-fast loading
 *
 * Color Grades:
 * - hollywood: Classic blockbuster look (warm highlights, cool shadows)
 * - teal-orange: Modern action movie style
 * - noir: High contrast black & white with slight blue
 * - vintage: Warm, faded film look
 * - blockbuster: High contrast, saturated colors
 */
const CinematicVideo = forwardRef<HTMLVideoElement, CinematicVideoProps>(
  (
    {
      src,
      className = '',
      autoPlay = true,
      loop = true,
      muted = true,
      playsInline = true,
      onLoadedData,
      poster,
      priority = true,
      preload = 'auto',
      controls = false,
      colorGrade = 'hollywood',
      vignette = true,
      filmGrain = false,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const actualRef = (ref as React.RefObject<HTMLVideoElement>) || videoRef;

    // Hollywood Color Grading CSS Filters
    const colorGrades = {
      hollywood: {
        filter: 'contrast(1.1) saturate(1.15) brightness(1.02) sepia(0.08)',
        overlay: 'linear-gradient(180deg, rgba(255,200,150,0.08) 0%, transparent 50%, rgba(0,50,100,0.12) 100%)',
      },
      'teal-orange': {
        filter: 'contrast(1.15) saturate(1.2) brightness(1.0) hue-rotate(-5deg)',
        overlay: 'linear-gradient(180deg, rgba(255,150,80,0.1) 0%, transparent 40%, rgba(0,100,120,0.15) 100%)',
      },
      noir: {
        filter: 'contrast(1.3) saturate(0.2) brightness(0.95) grayscale(0.7)',
        overlay: 'linear-gradient(180deg, rgba(100,120,140,0.1) 0%, transparent 50%, rgba(0,0,30,0.2) 100%)',
      },
      vintage: {
        filter: 'contrast(1.05) saturate(0.85) brightness(1.05) sepia(0.2)',
        overlay: 'linear-gradient(180deg, rgba(255,220,180,0.12) 0%, transparent 50%, rgba(80,60,40,0.1) 100%)',
      },
      blockbuster: {
        filter: 'contrast(1.2) saturate(1.3) brightness(1.05)',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, rgba(0,0,0,0.15) 100%)',
      },
    };

    const currentGrade = colorGrades[colorGrade];

    const handleLoad = () => {
      setIsLoading(false);
      if (onLoadedData) onLoadedData();
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
    };

    // Preload video for instant playback
    useEffect(() => {
      if (priority && actualRef.current) {
        actualRef.current.load();
      }
    }, [priority, actualRef]);

    if (error) {
      return (
        <div className={`w-full h-full bg-gray-900 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 text-sm">Video unavailable</span>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* Loading State - Cinematic Shimmer */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-black">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{
                animation: 'shimmer 1.5s infinite',
                backgroundSize: '200% 100%',
              }}
            />
            {poster && (
              <img
                src={poster}
                alt=""
                className="w-full h-full object-cover opacity-50"
                style={{ filter: currentGrade.filter }}
              />
            )}
          </div>
        )}

        {/* Main Video with Cinematic Color Grading */}
        <motion.video
          ref={actualRef}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          poster={poster}
          preload={preload}
          controls={controls}
          onLoadedData={handleLoad}
          onCanPlay={() => setIsLoading(false)}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            filter: currentGrade.filter,
            contentVisibility: 'auto',
          }}
          // Performance attributes
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        >
          {/* Multiple sources for best compression & compatibility */}
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          <source src={src} type="video/mp4" />
        </motion.video>

        {/* Hollywood Color Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: currentGrade.overlay }}
        />

        {/* Cinematic Vignette Effect */}
        {vignette && (
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        )}

        {/* Film Grain Overlay (Optional) */}
        {filmGrain && (
          <div
            className="absolute inset-0 pointer-events-none z-[3] opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: 'grain 0.5s steps(10) infinite',
            }}
          />
        )}

        {/* Cinematic Letterbox Bars (16:9 aspect enforcement) */}
        <div className="absolute top-0 left-0 right-0 h-[2%] bg-black pointer-events-none z-[4] hidden lg:block" />
        <div className="absolute bottom-0 left-0 right-0 h-[2%] bg-black pointer-events-none z-[4] hidden lg:block" />

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-1%, -1%); }
            20% { transform: translate(1%, 1%); }
            30% { transform: translate(-1%, 1%); }
            40% { transform: translate(1%, -1%); }
            50% { transform: translate(-1%, 0); }
            60% { transform: translate(1%, 0); }
            70% { transform: translate(0, 1%); }
            80% { transform: translate(0, -1%); }
            90% { transform: translate(1%, 1%); }
          }
        `}</style>
      </div>
    );
  }
);

CinematicVideo.displayName = 'CinematicVideo';

export default CinematicVideo;
