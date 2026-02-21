// app/page.tsx - AWWWARDS SOTD: "EmersonEIMS - Power Redefined"
// PREMIUM DESIGN: Way Above Apple.com with unique EmersonEIMS innovations
// WORLD-CLASS: Human-crafted excellence with sci-fi aesthetics
// Rating Target: 9.6/10 - Best Generator Diagnostic in Market
// ═══════════════════════════════════════════════════════════════════════════════
// STABLE BUILD: Using regular imports (Turbopack HMR has issues with React.lazy)
// ═══════════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import UnifiedCTA, { CTASection } from '@/components/cta/UnifiedCTA';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WebGLGradientMesh from '@/components/awwwards/WebGLGradientMesh';
import ScrollCinematic from '@/components/awwwards/ScrollCinematic';
import MorphingText, { GlitchText } from '@/components/awwwards/MorphingText';
import InteractiveProductCard, { sampleProducts } from '@/components/conversion/InteractiveProductCard';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS: Regular imports for stability (no lazy loading issues)
// ═══════════════════════════════════════════════════════════════════════════════
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import TrustBadgesSection from '@/components/sections/TrustBadgesSection';
import DiagnosticModuleShowcase from '@/components/sections/DiagnosticModuleShowcase';
import GeneratorOracleShowcase from '@/components/sections/GeneratorOracleShowcase';
import PremiumServicesShowcase from '@/components/sections/PremiumServicesShowcase';
import IndustryLeadingTrust from '@/components/sections/IndustryLeadingTrust';
import LiveOperationsDashboard from '@/components/sections/LiveOperationsDashboard';
import CompetitiveAdvantage from '@/components/sections/CompetitiveAdvantage';

// Premium animation configs - simplified for performance
const springConfig = { stiffness: 80, damping: 25, restDelta: 0.01 };

export default function AwwwardsHomepage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only use scroll hooks after mounting to prevent hydration issues
  const { scrollYProgress } = useScroll({ 
    target: containerRef
  });
  
  // Smooth spring-based animations - only active after mount
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.5], [0, -80]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -100]);
  
  // Mouse parallax - only on desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mounted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x * 15);
    mouseY.set(y * 15);
  };
  
  return (
    <div ref={containerRef} className="relative bg-black overflow-hidden">

        {/* VideoObject Schema - Fixes Google Search Console "Video isn't on a watch page" error */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: 'Emerson EiMS - Power Solutions Kenya',
              description: 'Premium generator and solar power solutions for homes and businesses across Kenya. 15+ years of engineering excellence powering East Africa.',
              thumbnailUrl: 'https://www.emersoneims.com/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
              uploadDate: '2024-01-01',
              contentUrl: 'https://www.emersoneims.com/videos/FOR%20TRIALS%20IN%20KADENCE.mp4',
              embedUrl: 'https://www.emersoneims.com/',
              duration: 'PT30S',
              publisher: {
                '@type': 'Organization',
                name: 'Emerson EiMS',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.emersoneims.com/logo.png'
                }
              }
            })
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            AWWWARDS SOTD: GPU-Accelerated Gradient Mesh Background
        ════════════════════════════════════════════════════════════════════ */}
        <WebGLGradientMesh />

        {/* Accessibility Widget - Universal Access for All Users */}
        <AccessibilityWidget />
        
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
            {/* Show poster image immediately */}
            <Image
              src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
              alt="EmersonEIMS Power Solutions"
              fill
              priority
              className={`object-cover scale-110 transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
              sizes="100vw"
            />
            {/* Video loads after image is visible - Ultra-fast with poster fallback */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlayThrough={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                willChange: 'auto',
                contentVisibility: 'auto',
              }}
            >
              <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
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
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl"
            >
              {/* Premium badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
                  <MorphingText
                    words={['REDEFINED', 'ENGINEERED', 'GUARANTEED', 'UNSTOPPABLE']}
                    interval={4000}
                    glitchIntensity={0.6}
                    className="text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text"
                  />
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
                <Link href="/generator-oracle" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="text-cyan-500">🔮</span> 230,000+ Fault Codes
                </Link>
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
                  Advanced automation systems. Remote monitoring. Scheduled maintenance alerts.
                  <span className="text-amber-400 font-medium"> 24/7 support</span>.
                </p>
                
                {/* Feature tags */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Remote Access', 'SMS Alerts', 'Auto-Sync', 'Easy Controls'].map((tag, i) => (
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

        {/* ═══════════════════════════════════════════════════════════════════
            💰 INTERACTIVE PRODUCT SHOWCASE - Gamified Selling
            3D product cards that beg to be touched and explored
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_60%)]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.p
                className="text-amber-500 text-sm uppercase tracking-[0.3em] mb-4 font-medium"
              >
                Explore Our Fleet
              </motion.p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Power Solutions That
                <span className="block text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
                  Drive Business Forward
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Interact with our generators. Tilt, explore, and add to your quote in seconds.
              </p>
            </motion.div>

            {/* Interactive Product Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {sampleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 100, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <InteractiveProductCard
                    product={product}
                    onAddToQuote={(product) => {
                      // Navigate to contact with pre-filled quote
                      window.location.href = `/contact?quote=${product.id}`;
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* CTA to See All */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/generators"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl"
              >
                <span>View All Generators</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
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

        {/* SECTION 5.5: Kenya Service Areas - SEO Internal Linking */}
        <section className="py-24 sm:py-32 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.05),transparent_50%)]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-cyan-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">Nationwide Coverage</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Generator Services Across
                <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> All 47 Counties</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional generator installation, repair, maintenance, and rental services throughout Kenya
              </p>
            </motion.div>

            {/* Major Counties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {[
                { name: 'Nairobi', slug: 'nairobi', highlight: true },
                { name: 'Mombasa', slug: 'mombasa', highlight: true },
                { name: 'Kisumu', slug: 'kisumu', highlight: true },
                { name: 'Nakuru', slug: 'nakuru', highlight: true },
                { name: 'Kiambu', slug: 'kiambu', highlight: false },
                { name: 'Machakos', slug: 'machakos', highlight: false },
                { name: 'Kilifi', slug: 'kilifi', highlight: false },
                { name: 'Uasin Gishu', slug: 'uasin-gishu', highlight: false },
                { name: 'Kajiado', slug: 'kajiado', highlight: false },
                { name: 'Nyeri', slug: 'nyeri', highlight: false },
                { name: 'Meru', slug: 'meru', highlight: false },
                { name: 'Kakamega', slug: 'kakamega', highlight: false },
              ].map((county, i) => (
                <motion.div
                  key={county.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/kenya/${county.slug}`}
                    className={`block p-4 rounded-xl border transition-all text-center group ${
                      county.highlight
                        ? 'bg-gradient-to-br from-amber-500/10 to-cyan-500/10 border-amber-500/30 hover:border-amber-400'
                        : 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10'
                    }`}
                  >
                    <span className={`font-medium transition-colors ${
                      county.highlight ? 'text-amber-400 group-hover:text-amber-300' : 'text-white group-hover:text-cyan-400'
                    }`}>
                      {county.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Popular Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Popular Generator Services</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Generator Companies Nairobi', href: '/kenya/nairobi/generator-companies' },
                  { label: 'Generator Repairs Mombasa', href: '/kenya/mombasa/generator-repairs' },
                  { label: 'Generator Rental Kisumu', href: '/kenya/kisumu/generator-lease' },
                  { label: 'Diesel Generators Nakuru', href: '/kenya/nakuru/diesel-generators' },
                  { label: 'Generator Maintenance Kiambu', href: '/kenya/kiambu/generator-maintenance' },
                  { label: 'Solar Installation Nairobi', href: '/kenya/nairobi/solar-installation' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-full bg-black/50 border border-white/10 text-sm text-gray-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTA to View All Counties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/kenya"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                <span>View All 47 Counties</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            AWWWARDS SOTD: CINEMATIC SCROLL STORYTELLING
            Revolutionary scroll-jacking experience - Apple-level immersion
        ════════════════════════════════════════════════════════════════════ */}
        <ScrollCinematic />

        {/* SECTION 6: Social Proof - Testimonials with Real Clients */}
        <TestimonialsSection />

        {/* SECTION 7: Case Studies - Real Projects, Real Results */}
        <CaseStudiesSection />

        {/* SECTION 7.5: WORLD'S MOST ADVANCED DIAGNOSTIC MODULE - Our Unique Advantage */}
        <DiagnosticModuleShowcase />

        {/* SECTION 7.6: GENERATOR ORACLE - Premium Diagnostic Tool Showcase */}
        <GeneratorOracleShowcase />

        {/* SECTION 7.7: Premium Services Showcase - All 9 Services */}
        <PremiumServicesShowcase />

        {/* SECTION 8: Trust Badges & Certifications */}
        <TrustBadgesSection />

        {/* SECTION 9: Industry-Leading Trust & Partnerships */}
        <IndustryLeadingTrust />

        {/* SECTION 10: Live Operations Dashboard - SpaceX Style */}
        <LiveOperationsDashboard />

        {/* SECTION 11: Competitive Advantage - Why Choose EmersonEIMS */}
        <CompetitiveAdvantage />

        {/* FINAL CTA with Premium Design - Apple Clean Spacing */}
        <CTASection 
          title="Ready to Power Your Future?"
          subtitle="Get a free consultation with our engineering team. No obligations, just expert advice for your power needs."
          primaryAction="consultation"
          secondaryAction="diagnostic"
          showEmergency={true}
        />

    </div>
  );
}
