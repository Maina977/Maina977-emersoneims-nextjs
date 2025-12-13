'use client';

'use client';

import { forwardRef, useState } from 'react';
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
}

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
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
      if (onLoadedData) onLoadedData();
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
    };

    if (error) {
      return (
        <div className={`w-full h-full bg-gray-900 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 text-sm">Video unavailable</span>
        </div>
      );
    }

    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
        )}
        <motion.video
          ref={ref}
          src={src}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          poster={poster}
          onLoadedData={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
