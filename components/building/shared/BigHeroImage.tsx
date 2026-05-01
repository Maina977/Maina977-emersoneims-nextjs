'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import OptimizedImage from '@/components/media/OptimizedImage';
import { useRef } from 'react';

interface BigHeroImageProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
  overlay?: 'dark' | 'light' | 'gradient' | 'none';
  parallax?: boolean;
}

/**
 * Big Hero Image Component
 * Creates impactful, full-width hero sections with parallax effects
 * Optimized for performance with lazy loading and responsive images
 */
export default function BigHeroImage({
  src,
  alt,
  title,
  subtitle,
  height = 'large',
  overlay = 'gradient',
  parallax = true
}: BigHeroImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', parallax ? '30%' : '0%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const heightClasses = {
    small: 'h-[40vh] md:h-[50vh]',
    medium: 'h-[60vh] md:h-[70vh]',
    large: 'h-[80vh] md:h-[90vh]',
    full: 'h-screen'
  };

  const overlayClasses = {
    dark: 'bg-black/60',
    light: 'bg-white/20',
    gradient: 'bg-gradient-to-b from-black/70 via-black/40 to-black/70',
    none: ''
  };

  return (
    <div 
      ref={ref}
      className={`relative w-full ${heightClasses[height]} overflow-hidden`}
    >
      {/* Parallax Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <OptimizedImage
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          priority
          className="object-cover w-full h-full"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay */}
      {overlay !== 'none' && (
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      )}

      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Content */}
      {(title || subtitle) && (
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-4 max-w-5xl">
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent font-display leading-tight"
              >
                {title}
              </motion.h1>
            )}
            
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Decorative elements */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 w-32 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto"
            />
          </div>
        </motion.div>
      )}

      {/* Scan lines effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(251,191,36,0.02)_50%)] bg-[length:100%_4px] pointer-events-none animate-scan" />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[#fbbf24]/30" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[#fbbf24]/30" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[#fbbf24]/30" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[#fbbf24]/30" />

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
