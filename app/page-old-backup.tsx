// app/page.tsx - AWWWARDS SOTD: "EmersonEIMS - Power Redefined"
'use client';

import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Lazy load components
const MicroInteractions = lazy(() => import('@/components/interactions/MicroInteractions'));

export default function AwwwardsHomepage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax transformations
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <>
      <Suspense fallback={null}>
        <MicroInteractions intensity="high" theme="engineering" />
      </Suspense>
      
      <motion.div 
        ref={containerRef}
        className="relative bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        
        {/* ========== HERO: FULL-SCREEN VIDEO (TESLA STYLE) ========== */}
        <motion.section 
          className="relative h-screen overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          {/* Premium Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover scale-110"
            poster="/images/GEN%202-1920x1080.png"
          >
            <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
          </video>
          
          {/* Premium Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),transparent_60%)]" />
          
          {/* Hero Content - Apple Typography */}
          <motion.div
            className="relative z-20 h-full flex flex-col items-center justify-center px-6 sm:px-12 text-center"
            style={{ y: textY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 60, scale: videoLoaded ? 1 : 0.95 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="max-w-7xl"
            >
              <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[14rem] font-bold mb-8 leading-none tracking-tighter">
                <span className="block bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                  POWER
                </span>
                <span className="block text-amber-500 font-light">
                  REDEFINED
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1.2 }}
                className="text-2xl sm:text-3xl md:text-4xl text-gray-200 font-light mb-16 max-w-4xl mx-auto leading-relaxed"
              >
                Premium Energy Solutions.<br className="hidden sm:block" />
                Engineering-Grade Reliability.<br className="hidden sm:block" />
                Built for East Africa.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link 
                  href="/solution"
                  className="group px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl font-bold rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500"
                >
                  <span className="flex items-center gap-3">
                    Explore Solutions
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/contact"
                  className="px-12 py-6 bg-transparent border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white hover:text-black transition-all duration-500"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Apple-style Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 12, 0] }}
            transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
          >
            <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center pt-3">
              <motion.div 
                className="w-1.5 h-3 bg-white/60 rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.section>
            {/* Intelligent Core Badge - Animated telemetry */}
            <Suspense fallback={null}>
              <IntelligentCoreBadge />
            </Suspense>
            
            {/* CTA Buttons with shine effects */}
            <motion.div 
              className="hero-ctas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <button 
                className="cta-primary"
                aria-label="Explore our intelligent power solutions"
                data-magnetic="true"
                data-cursor="action"
              >
                <span className="cta-text">Explore Intelligence</span>
                <span className="cta-shine" aria-hidden="true" />
                <span className="cta-sparkle" aria-hidden="true" />
              </button>
              
              <button 
                className="cta-secondary"
                aria-label="Launch interactive diagnostics demo"
                data-magnetic="true"
              >
                <span className="cta-icon" aria-hidden="true">▶</span>
                <span>Live Demo</span>
              </button>
            </motion.div>
            
            {/* Scroll indicator with physics */}
            <motion.div 
              className="scroll-cue"
              animate={{ 
                y: [0, 12, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut"
              }}
              aria-hidden="true"
            >
              <div className="scroll-line" />
              <div className="scroll-dot" />
            </motion.div>
          </div>
          
          {/* Section progress indicator */}
          <motion.div 
            className="section-progress"
            style={{ scaleY: sectionProgress.hero }}
            aria-hidden="true"
          />
        </motion.section>
        
        {/* IMMERSIVE POWER JOURNEY - Horizontal scroll narrative */}
        <Suspense fallback={<SectionSkeleton />}>
          <PowerJourney 
            scrollProgress={smoothScroll}
            prefersReducedMotion={prefersReducedMotion}
            onSectionEnter={(section) => setActiveSection(section)}
          />
        </Suspense>
        
        {/* SERVICES SHOWCASE - 3D card interactions */}
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesTeaser />
        </Suspense>
        
        {/* TECHNICAL SHOWCASE - Interactive schematics */}
        <Suspense fallback={<SectionSkeleton />}>
          <TechnicalShowcase />
        </Suspense>
        
        {/* CASE STUDIES - Award-winning projects */}
        <Suspense fallback={<SectionSkeleton />}>
          <CaseStudies 
            onProjectSelect={(project) => {
              // Custom event for project detail view
              document.dispatchEvent(
                new CustomEvent('projectView', { detail: project })
              );
            }}
          />
        </Suspense>
        
        {/* DYNAMIC FOOTER - Minimal, functional */}
        <footer className="awards-footer">
          <div className="footer-content">
            <div className="footer-tech">
              <span>Tech Stack:</span>
              <span className="tech-pill">Next.js 15</span>
              <span className="tech-pill">React Three Fiber</span>
              <span className="tech-pill">Framer Motion</span>
              <span className="tech-pill">GSAP</span>
              <span className="tech-pill">WebGL</span>
            </div>
            
            <div className="footer-awards">
              <div className="award-mention" aria-label="Designed for Awwwards submission">
                <svg className="award-icon" viewBox="0 0 24 24">
                  <path d="M12 15l4.24 2.83-1.59-4.93L19 9.5h-4.93L12 4.5 9.93 9.5H5l4.35 3.4-1.59 4.93L12 15z" />
                </svg>
                <span>SOTD Contender</span>
              </div>
              
              <button 
                className="view-code"
                onClick={() => window.open('https://github.com/your-repo', '_blank')}
                aria-label="View source code on GitHub"
              >
                View Source
              </button>
            </div>
          </div>
        </footer>
      </motion.div>
      
      {/* Global styles for Awwwards polish */}
      <style jsx global>{`
        :root {
          --color-amber: 255, 183, 3;
          --color-energy: 0, 255, 255;
          --color-dark: 8, 8, 12;
          --color-light: 245, 245, 245;
          --ease-smooth: cubic-bezier(0.33, 1, 0.68, 1);
          --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .awwwards-container {
          position: relative;
          background: rgb(var(--color-dark));
          color: rgb(var(--color-light));
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        .hero-section {
          min-height: 130vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0 5vw;
        }
        
        .headline-container {
          position: relative;
          z-index: 20;
          text-align: center;
          margin-bottom: 8rem;
        }
        
        .headline-mask {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .headline-word {
          font-size: clamp(4rem, 12vw, 9rem);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.02em;
          color: white;
          position: relative;
        }
        
        .word-ampersand {
          display: inline-block;
          color: rgb(var(--color-amber));
          margin-left: 1rem;
          font-style: italic;
          font-weight: 400;
        }
        
        .subheadline {
          font-size: 1.5rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }
        
        .gradient-text {
          background: linear-gradient(
            90deg,
            rgb(var(--color-amber)),
            rgb(var(--color-energy))
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }
        
        .hero-ctas {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 5rem;
          position: relative;
          z-index: 10;
        }
        
        .cta-primary {
          padding: 1.25rem 2.5rem;
          background: linear-gradient(
            135deg,
            rgb(var(--color-amber)),
            rgb(var(--color-energy))
          );
          color: black;
          border: none;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1.125rem;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s var(--ease-bounce);
        }
        
        .cta-primary:hover {
          transform: scale(1.05) translateY(-2px);
        }
        
        .cta-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.7s ease;
        }
        
        .cta-primary:hover .cta-shine {
          left: 100%;
        }
        
        .scroll-cue {
          position: absolute;
          bottom: 4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .scroll-line {
          width: 1px;
          height: 4rem;
          background: linear-gradient(
            to bottom,
            rgb(var(--color-amber)),
            transparent
          );
        }
        
        .section-progress {
          position: absolute;
          top: 0;
          right: 3rem;
          width: 2px;
          height: 100%;
          background: rgb(var(--color-amber));
          transform-origin: top;
          opacity: 0.5;
        }
        
        /* High contrast theme */
        .awwwards-container.high-contrast {
          --color-dark: 255, 255, 255;
          --color-light: 8, 8, 12;
        }
        
        .high-contrast .hero-section {
          background: white;
          color: black;
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hero-ctas {
            flex-direction: column;
            align-items: center;
          }
          
          .subheadline {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}

// Skeleton loading component
function SectionSkeleton() {
  return (
    <div className="section-skeleton">
      <div className="skeleton-shimmer" />
    </div>
  );
}