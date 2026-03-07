'use client';

/**
 * HeroSection - Lightweight animated hero
 * Only loads framer-motion, no Three.js or heavy libs
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const words = ['REDEFINED', 'ENGINEERED', 'GUARANTEED', 'UNSTOPPABLE'];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Show static version during SSR/hydration
  if (!mounted) {
    return (
      <section className="relative h-screen bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
            alt="EmersonEIMS Power Solutions"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-7xl">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm text-amber-300 tracking-wider uppercase">East Africa's #1 Power Solutions</span>
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9] tracking-tighter">
              <span className="block text-white">POWER</span>
              <span className="block text-amber-500">REDEFINED</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 font-light mb-12 max-w-4xl mx-auto">
              Premium Energy Solutions. Engineering-Grade Reliability.
              <span className="text-amber-400"> 12+ Years</span> Powering East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact?type=emergency"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-full"
              >
                ⚡ Emergency Power in 48 Hours
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full"
              >
                💬 Talk to Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <Image
          src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          alt="EmersonEIMS Power Solutions"
          fill
          priority
          className={`object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          sizes="100vw"
        />

        {/* Video - lazy loaded */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.15),transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-amber-300 tracking-wider uppercase">East Africa's #1 Power Solutions</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9] tracking-tighter">
            <span className="block text-white">POWER</span>
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="block text-amber-500"
            >
              {words[wordIndex]}
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl sm:text-2xl text-gray-200 font-light mb-12 max-w-4xl mx-auto"
          >
            Premium Energy Solutions. Engineering-Grade Reliability.
            <span className="text-amber-400"> 12+ Years</span> Powering East Africa.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/contact?type=emergency"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg shadow-amber-500/20"
            >
              ⚡ Emergency Power in 48 Hours
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              💬 Talk to Expert
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-gray-400 text-sm"
          >
            <span>✓ 500+ Projects</span>
            <span>✓ 98.7% Uptime</span>
            <span>✓ 47 Counties</span>
            <span>✓ 24/7 Support</span>
            <Link href="/generator-oracle" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              🔮 400,000+ Fault Codes
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-amber-400 rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
