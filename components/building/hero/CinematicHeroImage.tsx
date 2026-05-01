'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface CinematicHeroImageProps {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  height?: string;
  colorGrade?: 'hollywood' | 'teal-orange' | 'noir' | 'vintage' | 'blockbuster';
  overlayOpacity?: number;
}

/**
 * CINEMATIC HERO IMAGE COMPONENT
 * Hollywood-grade color grading with parallax effect
 */
export default function CinematicHeroImage({
  src,
  alt,
  title,
  subtitle,
  height = 'h-[60vh]',
  colorGrade = 'hollywood',
  overlayOpacity = 0.5,
}: CinematicHeroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
  const darkOverlay = `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.3}) 0%, rgba(0,0,0,${overlayOpacity * 0.1}) 40%, rgba(0,0,0,${overlayOpacity * 0.6}) 70%, rgba(0,0,0,${overlayOpacity}) 100%)`;

  return (
    <section
      ref={containerRef}
      className={`relative ${height} min-h-[400px] w-full overflow-hidden`}
    >
      {/* Cinematic Image with Parallax */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover"
          style={{ filter: currentGrade.filter }}
          sizes="100vw"
        />
      </motion.div>

      {/* Color Grade Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: currentGrade.overlay }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Film Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div
        className="absolute inset-0"
        style={{ background: darkOverlay }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-20 h-0.5 bg-gradient-to-r from-amber-500 to-cyan-500 mx-auto mb-6"
          />

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-20 h-0.5 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-6"
          />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-white/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
