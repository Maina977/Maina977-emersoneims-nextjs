'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  hollywoodGrading?: boolean;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 1920,
  height = 1080,
  priority = false,
  className = '',
  quality = 85,
  hollywoodGrading = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check if external URL or local
  const isExternal = src.startsWith('http');
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
      )}
      
      {error ? (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image failed to load</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.3 }}
          className={`relative w-full h-full ${hollywoodGrading ? 'hollywood-grade' : ''}`}
        >
          {isExternal ? (
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true);
                setIsLoading(false);
              }}
              style={{
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority={priority}
              quality={quality}
              sizes={sizes}
              loading={priority ? undefined : 'lazy'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true);
                setIsLoading(false);
              }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}


