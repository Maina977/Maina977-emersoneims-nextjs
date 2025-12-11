'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
  hollywoodGrading?: boolean;
  priority?: boolean;
}

export default function OptimizedVideo({
  src,
  poster,
  alt = 'Video',
  autoplay = false,
  loop = true,
  muted = true,
  playsInline = true,
  className = '',
  hollywoodGrading = true,
  priority = false,
}: OptimizedVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (autoplay && videoRef.current) {
            videoRef.current.play().catch(() => {
              // Autoplay failed, user interaction required
            });
          }
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [autoplay]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && poster && (
        <div className="absolute inset-0 z-10">
          <OptimizedImage
            src={poster}
            alt={alt}
            hollywoodGrading={hollywoodGrading}
            priority={priority}
            className="w-full h-full"
          />
        </div>
      )}

      {error ? (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center min-h-[400px]">
          <span className="text-gray-500 text-sm">Video failed to load</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full h-full ${hollywoodGrading ? 'hollywood-grade' : ''}`}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload={priority ? 'auto' : 'metadata'}
            className="w-full h-full object-cover"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setError(true);
              setIsLoading(false);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {!isPlaying && !autoplay && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
              aria-label="Play video"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-8 h-8 text-gray-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}


