/**
 * 🚀 REVOLUTIONARY SPARE PARTS PAGE
 *
 * THE FEATURE THAT CHANGES WEBSITE HISTORY
 *
 * - 1,560+ parts with complete specifications
 * - Sci-fi holographic interface
 * - Real-time inventory tracking
 * - Instant WhatsApp quotations
 * - AI-powered search
 * - 3D card effects
 *
 * NO COMPETITOR HAS THIS
 */

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import SparePartsModule from '@/components/parts/SparePartsModule';

export default function SparePartsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="min-h-screen bg-black">
      {/* Cinematic Hero Section with Hollywood Color Grading */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background Image with Cinematic Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/images/5 (3).png"
            alt="Generator Spare Parts"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Hollywood Cinematic Color Grading Overlays */}
          {/* Teal/Cyan Color Grade - Tech & Parts Theme */}
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 80, 100, 0.3) 0%, rgba(0, 200, 255, 0.2) 100%)' }} />

          {/* Deep Contrast Enhancement */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Blue Shadow Tint - Cinematic Shadows */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(0, 20, 50, 0.5) 0%, rgba(0, 30, 60, 0.4) 100%)' }} />

          {/* Cool Cyan Highlight Push - Tech Feel */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 200, 255, 0.3) 0%, transparent 60%)' }} />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Cinematic Letterbox Gradient - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

          {/* Cinematic Letterbox Gradient - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        {/* Animated Tech Pulse Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(0, 220, 255, 0.15) 50%, transparent 60%)' }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-5xl"
          >
            {/* Cinematic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">1,560+ Parts in Stock</span>
            </motion.div>

            {/* Main Title with Cinematic Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Generator
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Spare Parts
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Real-Time Inventory • Instant WhatsApp Quotes • All Major Brands
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest">Browse Parts</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-cyan-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Anamorphic Lens Flare */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />
      </section>

      {/* Spare Parts Module */}
      <SparePartsModule />
    </main>
  );
}
