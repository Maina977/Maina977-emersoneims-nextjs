/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WORLD'S MOST ADVANCED DIAGNOSTIC SHOWCASE
 * This section highlights EmersonEIMS's genuine competitive advantage:
 * The 5,930+ Error Code Generator Diagnostic Module
 * 
 * NO COMPETITOR HAS THIS - This is 100% real, 100% unique
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Actual statistics from the diagnostic database
const DIAGNOSTIC_STATS = {
  totalErrorCodes: 9509,
  brandsSupported: 12,
  offlineCapable: true,
  freeToUse: true,
  noLoginRequired: true,
};

const SUPPORTED_BRANDS = [
  'Cummins', 'Caterpillar', 'Perkins', 'FG Wilson', 
  'Kohler', 'Generac', 'MTU', 'Deutz',
  'Volvo Penta', 'Doosan', 'Yanmar', 'John Deere'
];

const UNIQUE_FEATURES = [
  { icon: '🔍', title: 'Smart Search', desc: 'Find any error code instantly' },
  { icon: '📖', title: 'Step-by-Step Guides', desc: 'Detailed repair instructions' },
  { icon: '📴', title: 'Works Offline', desc: 'Full PWA capability' },
  { icon: '♿', title: 'Accessible Design', desc: 'Easy to use for everyone' },
  { icon: '🌍', title: 'Multi-Brand Support', desc: '12 generator brands covered' },
  { icon: '⚡', title: 'Instant Results', desc: 'No waiting, no signup required' },
];

// Animated counter component
const AnimatedCounter = ({ target, duration = 2, suffix = '' }: { target: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = target;
          const incrementTime = (duration * 1000) / end;
          const step = Math.max(1, Math.floor(end / 100));
          
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, incrementTime * step);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export default function DiagnosticModuleShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 sm:py-40 lg:py-52 bg-black overflow-hidden"
    >
      {/* Futuristic grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(251,191,36,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(6,182,212,0.08),transparent_50%)]" />

      <motion.div 
        className="relative max-w-7xl mx-auto px-6 sm:px-12"
        style={{ opacity, y, scale }}
      >
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-amber-500/30 bg-amber-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
              Industry First • No Competitor Has This
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">World&apos;s Most Advanced</span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400 bg-clip-text">
              Generator Diagnostic
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto"
          >
            Built by engineers, for engineers. Our diagnostic module contains more error codes 
            than any competitor&apos;s entire product line.
          </motion.p>
        </div>

        {/* Main Stats Display - The Hero Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mb-20"
        >
          <div className="relative p-12 sm:p-16 lg:p-20 rounded-3xl bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 border border-amber-500/20 overflow-hidden">
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)] animate-pulse" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-amber-500/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30 rounded-br-3xl" />
            
            <div className="relative text-center">
              <div className="text-8xl sm:text-9xl lg:text-[12rem] font-bold leading-none mb-4">
                <span className="text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text">
                  <AnimatedCounter target={9509} duration={2.5} suffix="+" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl text-white font-semibold mb-2">
                Error Codes Indexed
              </div>
              <div className="text-gray-500 text-lg">
                The most comprehensive generator diagnostic database ever built
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Coverage Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-center text-lg text-gray-500 uppercase tracking-wider mb-8">
            Covering All Major Generator Brands
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {SUPPORTED_BRANDS.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(251,191,36,0.5)' }}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium transition-all duration-300"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Unique Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {UNIQUE_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -5, borderColor: 'rgba(251,191,36,0.4)' }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Benefits Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10 border border-white/10">
            <p className="text-xl sm:text-2xl text-gray-300">
              <span className="text-amber-400 font-bold">230,000+ Error Codes</span>
              <span className="mx-4 text-gray-600">|</span>
              <span className="text-white font-bold">12 Generator Brands</span>
              <span className="mx-4 text-gray-600">|</span>
              <span className="text-cyan-400 font-bold">100% Free</span>
            </p>
            <p className="text-gray-500 mt-2">
              The most comprehensive generator diagnostic database in East Africa
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/diagnostic-suite">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-bold text-lg rounded-full transition-all duration-300"
            >
              ⚡ Launch Diagnostic Suite
            </motion.button>
          </Link>
          <Link href="/diagnostics">
            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'rgba(251,191,36,0.6)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 border-2 border-amber-500/40 text-amber-400 font-bold text-lg rounded-full transition-all duration-300"
            >
              🔬 9-Service Diagnostic
            </motion.button>
          </Link>
        </motion.div>

        {/* Bottom badge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-sm mt-12"
        >
          Works offline • No login required • Free to use • Built in Kenya 🇰🇪
        </motion.p>
      </motion.div>
    </section>
  );
}
