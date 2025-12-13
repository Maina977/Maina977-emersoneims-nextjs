'use client';

import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load components
const CumminsGenerator3D = lazy(() => import('@/components/webgl/CumminsGenerator3D'));
const TeslaStyleNavigation = lazy(() => import('@/components/navigation/TeslaStyleNavigation'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

export default function FuturisticHomepage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    // Initialize experience
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const generatorScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <>
      {/* Custom Cursor */}
      <Suspense fallback={null}>
        <CustomCursor enabled={!prefersReducedMotion} />
      </Suspense>

      {/* Main Container */}
      <motion.div
        ref={containerRef}
        className="relative w-full min-h-screen bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Navigation */}
        <Suspense fallback={null}>
          <TeslaStyleNavigation activeSection={activeSection} />
        </Suspense>

        {/* HERO SECTION - Full Screen 3D Generator */}
        <motion.section
          ref={heroRef}
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          style={{ y: heroY }}
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid-pattern-sci-fi" />
          </div>

          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 3D Generator */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ scale: generatorScale }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <p className="text-text-secondary">Initializing Generator...</p>
                  </div>
                </div>
              }
            >
              <CumminsGenerator3D
                prefersReducedMotion={prefersReducedMotion}
                autoRotate={true}
              />
            </Suspense>
          </motion.div>

          {/* Hero Content Overlay */}
          <motion.div
            className="relative z-20 text-center px-4 max-w-6xl mx-auto"
            style={{ opacity: textOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h1 className="text-hero font-display text-white mb-6">
                <span className="block gradient-text-gold">CUMMINS</span>
                <span className="block text-6xl md:text-8xl mt-2">POWER</span>
                <span className="block text-4xl md:text-6xl mt-2 text-cyan-400">
                  ENGINEERED
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-body-large text-text-secondary max-w-3xl mx-auto mb-12 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Premium diesel generators engineered for reliability, performance, and
              excellence. Powering Kenya's future with intelligent energy solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-6 justify-center flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              <button className="cta-button-sci-fi-primary">
                <span>Explore Generator</span>
                <span className="cta-shine" />
              </button>
              <button className="cta-button-sci-fi-secondary">
                <span>Request Quote</span>
                <span className="cta-icon">→</span>
              </button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              {[
                { value: '500+', label: 'Projects' },
                { value: '98.7%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-display-2 font-display gradient-text-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-body-small text-text-tertiary uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                Scroll
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent" />
            </div>
          </motion.div>
        </motion.section>

        {/* FEATURES SECTION - Sci-Fi Cards */}
        <section className="relative py-32 md:py-48 bg-black">
          <div className="container-wide container-spacing">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-display-1 font-display text-white mb-4">
                <span className="gradient-text-cyan">INTELLIGENT</span>{' '}
                <span className="text-white">FEATURES</span>
              </h2>
              <p className="text-body-large text-text-secondary max-w-2xl mx-auto">
                Advanced technology meets engineering excellence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI Diagnostics',
                  description: 'Predictive maintenance with machine learning algorithms',
                  icon: '⚡',
                  color: 'cyan',
                },
                {
                  title: 'Remote Monitoring',
                  description: 'Real-time performance tracking from anywhere',
                  icon: '📡',
                  color: 'amber',
                },
                {
                  title: 'Auto-Sync',
                  description: 'Seamless integration with existing power systems',
                  icon: '🔗',
                  color: 'cyan',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="sci-fi-card group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="sci-fi-card-content">
                    <div className={`text-6xl mb-4 ${feature.color === 'cyan' ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-heading-2 font-display text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-body text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                  <div className="sci-fi-card-glow" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SPECIFICATIONS SECTION - Holographic Display */}
        <section className="relative py-32 md:py-48 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container-wide container-spacing">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-display-1 font-display text-white mb-6">
                  <span className="gradient-text-gold">TECHNICAL</span>{' '}
                  <span className="text-white">SPECIFICATIONS</span>
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Power Range', value: '10 - 2000 kVA' },
                    { label: 'Fuel Type', value: 'Diesel / Gas' },
                    { label: 'Efficiency', value: '98.7%' },
                    { label: 'Warranty', value: '5 Years' },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-body text-text-secondary">{spec.label}</span>
                      <span className="text-body font-display text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="h-96 rounded-2xl overflow-hidden border border-cyan-400/30 relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-amber-400/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gradient-to-br from-cyan-400/20 to-amber-400/20 border border-cyan-400/30" />
                    <p className="text-text-secondary text-sm">3D Specification View</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,255,255,0.1)_100%)]" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION - Final */}
        <section className="relative py-32 md:py-48 bg-black">
          <div className="container-wide container-spacing text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-display-1 font-display text-white mb-6">
                Ready to Power Your Future?
              </h2>
              <p className="text-body-large text-text-secondary max-w-2xl mx-auto mb-12">
                Experience the reliability and performance of Cummins generators.
                Get a custom quote for your project today.
              </p>
              <button className="cta-button-sci-fi-primary text-lg px-12 py-4">
                <span>Get Started</span>
                <span className="cta-shine" />
              </button>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
}

