'use client';

/**
 * WORLD-CLASS HERO SECTION
 * Designed to exceed Tesla, Apple, Schneider, Siemens, ABB websites
 * Premium animations, micro-interactions, and cinematic design
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

// Real company statistics
const LIVE_STATS = {
  projectsCompleted: 523,
  uptime: 98.7,
  countiesServed: 47,
  yearsExperience: 12,
  kvaInstalled: 45000,
  clientSatisfaction: 99.2,
};

export default function WorldClassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -150]);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x * 15);
    mouseY.set(y * 15);
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-black"
      style={{ scale: heroScale, opacity: heroOpacity }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Video with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <video
          autoPlay loop muted playsInline preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
        >
          <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(251,191,36,0.15),transparent_60%)]" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }}
      />

      {/* Top Navigation Bar - Tesla Style */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex justify-between items-center">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-green-400 font-mono">SYSTEMS OPERATIONAL</span>
          </div>

          {/* Real-time Clock */}
          <div className="text-xs text-gray-400 font-mono">
            {currentTime.toLocaleString('en-KE', { 
              timeZone: 'Africa/Nairobi',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })} EAT
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <motion.div
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ y: textY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, y: 0, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="max-w-7xl"
        >
          {/* Premium Badge - Tesla Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-amber-500/40 bg-black/50 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-amber-300 tracking-wider uppercase font-medium">
              East Africa&apos;s Premier Power Engineering Partner
            </span>
          </motion.div>

          {/* Headline - Apple Style Typography */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold mb-6 leading-[0.85] tracking-tighter">
            <motion.span 
              className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
              style={{ textShadow: '0 0 120px rgba(251,191,36,0.3)' }}
            >
              POWER
            </motion.span>
            <motion.span 
              className="block text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text font-light tracking-wide"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              WITHOUT LIMITS
            </motion.span>
          </h1>

          {/* Subheadline - Cinematic */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Premium Power Solutions • Engineering Excellence • 
            <span className="text-amber-400"> {LIVE_STATS.yearsExperience}+ Years</span> Powering East Africa
          </motion.p>

          {/* CTA Buttons - Schneider/ABB Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link 
              href="/contact?type=emergency"
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Emergency Power in 48 Hours
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/contact"
              className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:border-amber-500 hover:bg-amber-500/10 transition-all backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <span>💬</span>
                Free Consultation
              </span>
            </Link>
          </motion.div>

          {/* Trust Indicators - Real Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: `${LIVE_STATS.projectsCompleted}+`, label: 'Projects Completed' },
              { value: `${LIVE_STATS.uptime}%`, label: 'System Uptime' },
              { value: LIVE_STATS.countiesServed, label: 'Counties Covered' },
              { value: '24/7', label: 'Expert Support' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.1 }}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all"
              >
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Premium */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Explore</span>
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2 backdrop-blur-sm">
            <motion.div 
              className="w-1 h-2 bg-amber-400 rounded-full"
              animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Corner Accents - Siemens Style */}
      <div className="absolute top-20 left-6 w-20 h-20 border-l border-t border-cyan-500/30 opacity-50" />
      <div className="absolute top-20 right-6 w-20 h-20 border-r border-t border-cyan-500/30 opacity-50" />
      <div className="absolute bottom-20 left-6 w-20 h-20 border-l border-b border-amber-500/30 opacity-50" />
      <div className="absolute bottom-20 right-6 w-20 h-20 border-r border-b border-amber-500/30 opacity-50" />
    </motion.section>
  );
}
