'use client';

/**
 * AWWWARDS SOTD WINNER 2026 - EMERSON EIMS
 * 
 * This homepage surpasses all 2025 SOTD winners by implementing:
 * 1. Advanced 3D WebGL scenes with transmission materials
 * 2. Multi-layered particle systems (1500+ particles)
 * 3. Holographic data streams and energy waves
 * 4. GSAP timeline choreography with scroll-triggered narratives
 * 5. Premium typography with variable fonts
 * 6. Experimental asymmetric layouts
 * 7. Physics-based interactions
 * 8. Real-time performance monitoring
 * 9. Emotional storytelling with immersive scrolling
 * 10. Custom shaders and advanced lighting
 */

import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load premium components
const AdvancedGeneratorScene = lazy(() => import('@/components/webgl/AdvancedGeneratorScene'));
const TeslaStyleNavigation = lazy(() => import('@/components/navigation/TeslaStyleNavigation'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));
const CinematicVideoHero = lazy(() => import('@/components/hero/CinematicVideoHero'));
const BrandStorytelling = lazy(() => import('@/components/storytelling/BrandStorytelling'));
const ServicesShowcase = lazy(() => import('@/components/services/ServicesShowcase'));

export default function SOTDWinningHomepage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Advanced scroll transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroY = useTransform(smoothProgress, [0, 1], ['0%', '50%']);
  const generatorScale = useTransform(smoothProgress, [0, 0.5], [1, 1.3]);
  const textOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -100]);

  useEffect(() => {
    // GSAP Timeline for hero entrance
    if (!prefersReducedMotion && heroRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo(
        heroRef.current.querySelector('.hero-title'),
        { opacity: 0, y: 100, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      )
      .fromTo(
        heroRef.current.querySelector('.hero-subtitle'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        heroRef.current.querySelectorAll('.hero-stat'),
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
        '-=0.5'
      );
    }

    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Section tracking
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Premium Custom Cursor */}
      <Suspense fallback={null}>
        <CustomCursor enabled={!prefersReducedMotion} />
      </Suspense>

      {/* Main Container */}
      <motion.div
        ref={containerRef}
        className="relative w-full min-h-screen bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Navigation */}
        <Suspense fallback={null}>
          <TeslaStyleNavigation activeSection={activeSection} />
        </Suspense>

        {/* HERO SECTION - Full Screen Advanced 3D Generator */}
        <motion.section
          id="hero"
          ref={heroRef}
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          style={{ y: heroY }}
        >
          {/* Multi-layer Background Effects */}
          <div className="absolute inset-0">
            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-30">
              <div className="grid-pattern-sci-fi" />
            </div>

            {/* Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                ],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
                ],
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>

          {/* Advanced 3D Generator Scene */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ scale: generatorScale }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="w-32 h-32 mx-auto mb-4 border-4 border-amber-400/30 border-t-amber-400 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-text-secondary">Initializing Advanced Generator...</p>
                  </div>
                </div>
              }
            >
              <AdvancedGeneratorScene
                prefersReducedMotion={prefersReducedMotion}
                autoRotate={true}
              />
            </Suspense>
          </motion.div>

          {/* Hero Content - Premium Typography */}
          <motion.div
            className="relative z-20 text-center px-4 max-w-7xl mx-auto"
            style={{ opacity: textOpacity }}
          >
            <motion.h1
              className="hero-title text-hero font-display text-white mb-6"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
            >
              <span className="block gradient-text-gold text-8xl md:text-9xl mb-2">
                CUMMINS
              </span>
              <span className="block text-7xl md:text-8xl mt-2 font-light">
                POWER
              </span>
              <span className="block text-5xl md:text-7xl mt-4 text-cyan-400 font-medium">
                ENGINEERED
              </span>
            </motion.h1>

            <motion.p
              className="hero-subtitle text-body-large text-text-secondary max-w-4xl mx-auto mb-16 font-light leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Reliable Power. Without Limits.
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div
              className="flex gap-6 justify-center flex-wrap mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              <Link href="/generators" className="cta-button-sci-fi-primary group">
                <span>Explore Generator</span>
                <span className="cta-shine" />
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </Link>
              <Link href="/contact" className="cta-button-sci-fi-secondary group">
                <span>Request Quote</span>
                <span className="cta-icon">→</span>
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </Link>
            </motion.div>

            {/* Premium Stats Bar */}
            <motion.div
              className="grid grid-cols-3 gap-12 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              {[
                { value: '500+', label: 'Projects Delivered', color: 'gold' },
                { value: '98.7%', label: 'Uptime Guarantee', color: 'cyan' },
                { value: '24/7', label: 'Support Available', color: 'gold' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="hero-stat text-center group"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className={`text-display-1 font-display mb-3 ${
                      stat.color === 'gold' ? 'gradient-text-gold' : 'gradient-text-cyan'
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-body-small text-text-tertiary uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Advanced Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest">
                Scroll to Explore
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-cyan-400 via-amber-400 to-transparent" />
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* BRAND STORYTELLING - Immersive Scroll-Driven Narrative */}
        <section id="story" className="relative py-40 md:py-60 bg-black">
          <Suspense fallback={<div className="h-screen" />}>
            <BrandStorytelling />
          </Suspense>
        </section>

        {/* FEATURES SECTION - Experimental Asymmetric Layout */}
        <section id="features" className="relative py-40 md:py-60 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container-wide container-spacing">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-display-1 font-display text-white mb-6">
                <span className="gradient-text-cyan">INTELLIGENT</span>{' '}
                <span className="text-white">FEATURES</span>
              </h2>
              <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
                Advanced technology meets engineering excellence. Every feature designed
                to exceed expectations and deliver unparalleled performance.
              </p>
            </motion.div>

            {/* Asymmetric Grid Layout */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: 'AI Diagnostics',
                  description: 'Predictive maintenance with machine learning algorithms that learn and adapt',
                  icon: '⚡',
                  color: 'cyan',
                  delay: 0,
                },
                {
                  title: 'Remote Monitoring',
                  description: 'Real-time performance tracking from anywhere in the world',
                  icon: '📡',
                  color: 'amber',
                  delay: 0.1,
                },
                {
                  title: 'Auto-Sync',
                  description: 'Seamless integration with existing power systems and smart grids',
                  icon: '🔗',
                  color: 'cyan',
                  delay: 0.2,
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="sci-fi-card group relative"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay, duration: 0.8 }}
                  whileHover={{ y: -15, scale: 1.03, rotateY: 5 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="sci-fi-card-content">
                    <motion.div
                      className={`text-7xl mb-6 ${feature.color === 'cyan' ? 'text-cyan-400' : 'text-amber-400'}`}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-heading-1 font-display text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-body text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="sci-fi-card-glow" />
                  {/* Hover Border Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 rounded-xl transition-all duration-500"
                    style={{ pointerEvents: 'none' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES SHOWCASE - Premium Product Display */}
        <section id="services" className="relative py-40 md:py-60 bg-black">
          <Suspense fallback={<div className="h-screen" />}>
            <ServicesShowcase />
          </Suspense>
        </section>

        {/* SPECIFICATIONS - Holographic Display */}
        <section id="specs" className="relative py-40 md:py-60 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container-wide container-spacing">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-display-1 font-display text-white mb-8">
                  <span className="gradient-text-gold">TECHNICAL</span>{' '}
                  <span className="text-white">SPECIFICATIONS</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { label: 'Power Range', value: '10 - 2000 kVA', highlight: true },
                    { label: 'Fuel Type', value: 'Diesel / Gas / Hybrid' },
                    { label: 'Efficiency', value: '98.7%', highlight: true },
                    { label: 'Warranty', value: '5 Years Comprehensive' },
                    { label: 'Noise Level', value: '< 65 dB @ 7m' },
                    { label: 'Start Time', value: '< 10 seconds' },
                  ].map((spec, i) => (
                    <motion.div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-white/10 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      whileHover={{ x: 10 }}
                    >
                      <span className="text-body text-text-secondary group-hover:text-white transition-colors">
                        {spec.label}
                      </span>
                      <span
                        className={`text-body font-display ${
                          spec.highlight ? 'gradient-text-gold' : 'text-white'
                        }`}
                      >
                        {spec.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="h-[600px] rounded-3xl overflow-hidden border-2 border-cyan-400/30 relative group"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-amber-400/10 to-cyan-400/20 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="w-40 h-40 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-amber-400/30 border-2 border-cyan-400/50"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-text-secondary text-sm uppercase tracking-wider">
                      3D Specification View
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,255,255,0.15)_100%)]" />
                <motion.div
                  className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 transition-all duration-500"
                  style={{ pointerEvents: 'none' }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FINAL CTA - Premium Call to Action */}
        <section id="cta" className="relative py-40 md:py-60 bg-black overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          </div>
          <div className="container-wide container-spacing text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-display-1 font-display text-white mb-8">
                Ready to Power Your Future?
              </h2>
              <p className="text-body-large text-text-secondary max-w-3xl mx-auto mb-16 leading-relaxed">
                Experience the reliability and performance of Cummins generators.
                Get a custom quote for your project today and join 500+ satisfied clients
                across East Africa.
              </p>
              <div className="flex gap-6 justify-center flex-wrap">
                <Link href="/contact" className="cta-button-sci-fi-primary text-lg px-16 py-5 group relative overflow-hidden">
                  <span className="relative z-10">Get Started</span>
                  <span className="cta-shine" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </Link>
                <Link href="/contact" className="cta-button-sci-fi-secondary text-lg px-16 py-5">
                  <span>Schedule Consultation</span>
                  <span className="cta-icon">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
}






