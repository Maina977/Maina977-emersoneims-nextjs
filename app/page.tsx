// app/page.tsx - AWWWARDS SOTD: "EmersonEIMS - Power Redefined"
// PREMIUM DESIGN: Way Above Apple.com with unique EmersonEIMS innovations
// WORLD-CLASS: Human-crafted excellence with sci-fi aesthetics
// Rating Target: 9.6/10 - Best Generator Diagnostic in Market
'use client';

import { Suspense, lazy, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import UnifiedCTA, { CTASection, GetQuoteCTA, SiteSurveyCTA, DiagnosticCTA, LearnMoreCTA } from '@/components/cta/UnifiedCTA';

// Premium section components for 9.6 rating
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const CaseStudiesSection = lazy(() => import('@/components/sections/CaseStudiesSection'));
const TrustBadgesSection = lazy(() => import('@/components/sections/TrustBadgesSection'));

// World-Class Components - Exceeding Tesla/Apple/Siemens/ABB
const WorldClassHero = lazy(() => import('@/components/sections/WorldClassHero'));
const IndustryLeadingTrust = lazy(() => import('@/components/sections/IndustryLeadingTrust'));
const LiveOperationsDashboard = lazy(() => import('@/components/sections/LiveOperationsDashboard'));
const CompetitiveAdvantage = lazy(() => import('@/components/sections/CompetitiveAdvantage'));
const PremiumServicesShowcase = lazy(() => import('@/components/sections/PremiumServicesShowcase'));
const DiagnosticModuleShowcase = lazy(() => import('@/components/sections/DiagnosticModuleShowcase'));

const MicroInteractions = lazy(() => import('@/components/interactions/MicroInteractions'));
const ParticleField = lazy(() => import('@/components/effects/ParticleField'));
const MagneticCursor = lazy(() => import('@/components/effects/MagneticCursor'));

// Premium animation configs
const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

export default function AwwwardsHomepage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Smooth spring-based animations
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 1.15]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.5], [0, -120]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -200]);
  
  // Mouse parallax for hero section
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  };
  
  return (
    <>
      {/* Premium Effects - Beyond Apple.com */}
      <Suspense fallback={null}>
        <MicroInteractions intensity="high" theme="engineering" />
        <ParticleField />
        <MagneticCursor />
      </Suspense>
      
      <motion.div 
        ref={containerRef}
        className="relative bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        
        {/* HERO: FULL-SCREEN VIDEO with 3D Parallax */}
        <motion.section 
          className="relative h-screen overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
          onMouseMove={handleMouseMove}
        >
          {/* Video with parallax effect - OPTIMIZED FOR FAST LOADING */}
          <motion.div
            className="absolute inset-0"
            style={{ y: parallaxY }}
          >
            <video
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlayThrough={() => setVideoLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover scale-110"
              poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
              style={{ 
                willChange: 'transform',
                contentVisibility: 'auto',
              }}
            >
              {/* Multiple sources for better compatibility and faster loading */}
              <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          
          {/* Premium overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.15),transparent_60%)]" />
          
          {/* Scanline effect for sci-fi feel */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
          
          <motion.div
            className="relative z-20 h-full flex flex-col items-center justify-center px-6 sm:px-12 text-center"
            style={{ 
              y: textY,
              x: useSpring(mouseX, springConfig),
              rotateY: useSpring(useTransform(mouseX, [-20, 20], [-2, 2]), springConfig),
              rotateX: useSpring(useTransform(mouseY, [-20, 20], [2, -2]), springConfig),
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={{ opacity: videoLoaded ? 1 : 0, y: 0, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="max-w-7xl"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Premium badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-300 tracking-wider uppercase font-medium">East Africa&apos;s #1 Power Solutions</span>
              </motion.div>
              
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[12rem] font-bold mb-8 leading-[0.9] tracking-tighter">
                <motion.span 
                  className="block bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent"
                  style={{ 
                    textShadow: '0 0 80px rgba(251,191,36,0.3)',
                  }}
                >
                  POWER
                </motion.span>
                <motion.span 
                  className="block text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text font-light"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                >
                  REDEFINED
                </motion.span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light mb-16 max-w-4xl mx-auto leading-relaxed"
              >
                Premium Energy Solutions. Engineering-Grade Reliability. 
                <span className="text-amber-400"> 12+ Years</span> Powering East Africa.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              >
                <UnifiedCTA 
                  action="get-quote" 
                  size="lg" 
                  label="⚡ Emergency Power in 48 Hours"
                  href="/contact?type=emergency"
                />
                <UnifiedCTA 
                  action="consultation" 
                  variant="secondary" 
                  size="lg"
                  label="💬 Talk to Expert"
                />
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 500+ Projects
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 98.7% Uptime
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 47 Counties
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 24/7 Support
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator - Enhanced */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-white/50 uppercase tracking-widest">Scroll to explore</span>
              <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center pt-3 backdrop-blur-sm">
                <motion.div 
                  className="w-1.5 h-3 bg-amber-400 rounded-full"
                  animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 1: CINEMATIC HERO IMAGE - Cummins Generator with Hollywood Color Grading */}
        <section className="relative py-32 sm:py-40 bg-black overflow-hidden">
          {/* Cinematic ambient lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
          
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Premium cinematic frame glow */}
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-cyan-500/30 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
              <div className="absolute -inset-3 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] group-hover:shadow-[0_40px_120px_-20px_rgba(251,191,36,0.3)] transition-all duration-1000">
                {/* Main Cummins Generator Image with Cinematic Treatment */}
                <div className="relative">
                  <Image
                    src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
                    alt="Cummins Industrial Diesel Generator - Premium Power Solutions Kenya"
                    width={1920}
                    height={1080}
                    className="w-full h-[70vh] sm:h-[85vh] object-cover transform group-hover:scale-[1.03] transition-transform duration-1000"
                    style={{
                      filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                    }}
                    priority
                  />
                  
                  {/* Hollywood Color Grading Overlays */}
                  {/* Teal & Orange cinematic look */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-600/15 mix-blend-overlay" />
                  
                  {/* Vignette effect for depth */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
                  
                  {/* Top light leak */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-400/10 to-transparent" />
                  
                  {/* Bottom cinematic gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Side light streaks */}
                  <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-amber-500/5 to-transparent" />
                  <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-cyan-500/5 to-transparent" />
                  
                  {/* Film grain texture overlay */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    }} 
                  />
                </div>
                
                {/* Floating Cummins badge */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12"
                >
                  <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-amber-500/30 shadow-2xl">
                    <div className="flex flex-col">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Cummins Powered</span>
                      <span className="text-white text-lg font-semibold">20kVA - 2000kVA Available</span>
                    </div>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  </div>
                </motion.div>
                
                {/* Top right premium badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute top-8 right-8 sm:top-12 sm:right-12"
                >
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold uppercase tracking-wider shadow-lg">
                    Premium Quality
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Apple-Style Text Block with Human Touch */}
        <section className="py-32 sm:py-40 bg-black relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
          
          <div className="max-w-6xl mx-auto px-6 sm:px-12 relative">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Section kicker */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-amber-500 text-sm uppercase tracking-[0.3em] mb-6 font-medium"
              >
                Our Promise
              </motion.p>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center sm:text-left mb-10 leading-tight">
                Engineering Excellence
                <br />
                <span className="text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">
                  Meets Reliability
                </span>
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-xl sm:text-2xl lg:text-3xl text-gray-300 text-center sm:text-left leading-relaxed font-light max-w-4xl"
            >
              Over <span className="text-white font-semibold">12 years</span> powering East Africa&apos;s critical infrastructure. 
              From <span className="text-amber-400">20kVA</span> residential systems to <span className="text-amber-400">2000kVA</span> industrial installations. 
              <span className="text-white font-semibold"> 98.7%</span> uptime guaranteed.
            </motion.p>
            
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-12 h-[2px] w-32 bg-gradient-to-r from-amber-500 to-transparent origin-left"
            />
          </div>
        </section>

        {/* SECTION 3: Split Layout - Solar with Premium Image Effects */}
        <section className="py-32 sm:py-40 bg-black">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="order-2 lg:order-1"
              >
                <span className="text-cyan-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">Clean Energy</span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1]">
                  Solar
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 bg-clip-text">
                    Innovation
                  </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-transparent mb-8" />
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                  Harnessing Kenya&apos;s <span className="text-amber-400 font-medium">5.5-5.9 kWh/m²/day</span> solar irradiance. 
                  Tier-1 panels. Tesla Powerwall integration. <span className="text-white font-semibold">3-4 year ROI</span>.
                </p>
                
                {/* Quick stats */}
                <div className="mt-10 flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-amber-500">30%</div>
                    <div className="text-sm text-gray-500">Energy Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-500">25yr</div>
                    <div className="text-sm text-gray-500">Panel Warranty</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="order-1 lg:order-2 group"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-[0_35px_80px_-15px_rgba(251,191,36,0.2)] transition-all duration-700">
                  <Image
                    src="/images/solar%20power%20farms.png"
                    alt="Solar Power Installation Kenya"
                    width={1920}
                    height={1280}
                    className="w-full h-[500px] sm:h-[600px] object-cover transform group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  
                  {/* Premium overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-amber-500/10" />
                  
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-amber-500/50 rounded-tl-xl" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-amber-500/50 rounded-br-xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Full-Width Feature Image with Premium Effects */}
        <section className="py-32 sm:py-40 bg-black">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[70vh] sm:h-[80vh] rounded-3xl overflow-hidden group shadow-2xl"
            >
              {/* Premium glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-amber-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
              
              <Image
                src="/images/solar%20changeover%20control.png"
                alt="Intelligent Control Systems"
                width={1920}
                height={1280}
                className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-1000"
              />
              
              {/* Premium overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              
              {/* Content */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-cyan-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">Smart Systems</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                  Intelligent Control
                  <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> Systems</span>
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed">
                  Advanced automation systems. Remote monitoring. Predictive maintenance. 
                  <span className="text-amber-400 font-medium"> 24/7 support</span>.
                </p>
                
                {/* Feature tags */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Remote Access', 'Real-time Alerts', 'Predictive AI', 'Auto-Sync'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-white/80 backdrop-blur-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              
              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-cyan-400/50 rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: Stats - Apple Style with Premium Animation */}
        <section className="py-32 sm:py-40 bg-black relative overflow-hidden">
          {/* Ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]" />
          
          <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-amber-500 text-sm uppercase tracking-[0.3em] mb-16 font-medium"
            >
              By The Numbers
            </motion.p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
              {[
                { num: '500+', label: 'Projects Delivered', icon: '🔧' },
                { num: '98.7%', label: 'System Uptime', icon: '📊' },
                { num: '47', label: 'Counties Served', icon: '🌍' },
                { num: '12+', label: 'Years Experience', icon: '🏆' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-4">
                    <span className="text-4xl">{stat.icon}</span>
                    <div className="absolute inset-0 blur-lg bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
                    <span className="text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text">
                      {stat.num}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Social Proof - Testimonials with Real Clients */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <TestimonialsSection />
        </Suspense>

        {/* SECTION 7: Case Studies - Real Projects, Real Results */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <CaseStudiesSection />
        </Suspense>

        {/* SECTION 7.5: WORLD'S MOST ADVANCED DIAGNOSTIC MODULE - Our Unique Advantage */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <DiagnosticModuleShowcase />
        </Suspense>

        {/* SECTION 7.6: Premium Services Showcase - All 9 Services */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <PremiumServicesShowcase />
        </Suspense>

        {/* SECTION 8: Trust Badges & Certifications */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <TrustBadgesSection />
        </Suspense>

        {/* SECTION 9: Industry-Leading Trust & Partnerships */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <IndustryLeadingTrust />
        </Suspense>

        {/* SECTION 10: Live Operations Dashboard - SpaceX Style */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <LiveOperationsDashboard />
        </Suspense>

        {/* SECTION 11: Competitive Advantage - Why Choose EmersonEIMS */}
        <Suspense fallback={<div className="py-32 bg-black" />}>
          <CompetitiveAdvantage />
        </Suspense>

        {/* FINAL CTA with Premium Design - Apple Clean Spacing */}
        <CTASection 
          title="Ready to Power Your Future?"
          subtitle="Get a free consultation with our engineering team. No obligations, just expert advice for your power needs."
          primaryAction="consultation"
          secondaryAction="diagnostic"
          showEmergency={true}
        />

      </motion.div>
    </>
  );
}
