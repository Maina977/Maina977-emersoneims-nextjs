// app/page.tsx - Awwwards SOTD Contender: "Intelligent Power Core"
'use client';

import { Suspense, lazy, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWindowSize } from '@/hooks/useWindowSize';
import LoadingSequence from '@/components/awwwards/LoadingSequence';
import SkipAnimation from '@/components/accessibility/SkipAnimation';

// Lazy load heavy sections
const HeroCanvas = lazy(() => import('@/components/hero/HeroCanvas'));
const PowerJourney = lazy(() => import('@/components/narrative/PowerJourney'));
const ServicesTeaser = lazy(() => import('@/components/services/ServicesTeaser'));
const CaseStudies = lazy(() => import('@/components/cases/CaseStudies'));
const TechnicalShowcase = lazy(() => import('@/components/technical/TechnicalShowcase'));

// Performance-optimized static components
const IntelligentCoreBadge = lazy(() => import('@/components/core/IntelligentCoreBadge'));
const NavigationBar = lazy(() => import('@/components/navigation/NavigationBar'));
const MicroInteractions = lazy(() => import('@/components/interactions/MicroInteractions'));

export default function AwwwardsHomepage() {
  // State management
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [themeMode, setThemeMode] = useState<'engineering' | 'high-contrast'>('engineering');
  const prefersReducedMotion = useReducedMotion();
  const { width: windowWidth } = useWindowSize();
  
  // Refs for scroll and interaction
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });
  
  // Spring-based scroll transformations
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Parallax effects
  const heroParallax = useTransform(smoothScroll, [0, 1], ['0%', '15%']);
  const coreScale = useTransform(smoothScroll, [0, 0.5, 1], [1, 1.2, 0.8]);
  
  // Section tracking
  const sectionProgress = {
    hero: useTransform(smoothScroll, [0, 0.25], [1, 0]),
    journey: useTransform(smoothScroll, [0.2, 0.4, 0.6], [0, 1, 0]),
    services: useTransform(smoothScroll, [0.5, 0.7], [0, 1])
  };
  
  // Initialize experience
  useEffect(() => {
    const initExperience = async () => {
      if (prefersReducedMotion) {
        setIsLoaded(true);
        return;
      }
      
      // Preload critical assets
      await Promise.all([
        import('@/lib/three/loadTextures'),
        import('@/lib/animations/fluidSimulation')
      ]);
      
      // Start loading sequence
      const timer = setTimeout(() => setIsLoaded(true), 2200);
      return () => clearTimeout(timer);
    };
    
    initExperience();
  }, [prefersReducedMotion]);
  
  // Handle visibility changes
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.dispatchEvent(new CustomEvent('animationPause'));
      } else {
        document.dispatchEvent(new CustomEvent('animationResume'));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);
  
  // Memoized config for performance
  const performanceConfig = useMemo(() => ({
    dpr: Math.min(window.devicePixelRatio || 1, windowWidth < 768 ? 1 : 1.5),
    shadows: windowWidth > 1024,
    particles: windowWidth > 768 ? 2000 : 800,
    quality: (windowWidth < 768 ? 'medium' : 'high') as 'low' | 'medium' | 'high'
  }), [windowWidth]);
  
  // ARIA live announcements
  const pageStatus = isLoaded ? 'Experience fully loaded' : 'Loading intelligent power interface';
  
  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {pageStatus}
      </div>
      
      {/* Accessibility: Skip animations */}
      <SkipAnimation />
      
      {/* Global micro-interactions layer */}
      <Suspense fallback={null}>
        <MicroInteractions 
          intensity={prefersReducedMotion ? 'low' : 'high'}
          theme={themeMode}
        />
      </Suspense>
      
      {/* Loading sequence - First impression critical */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <LoadingSequence 
            onComplete={() => setIsLoaded(true)}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>
      
      {/* Main container with scroll-snap */}
      <motion.div 
        ref={containerRef}
        className={`awwwards-container ${themeMode}`}
        data-performance={performanceConfig.quality}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Navigation - Sticky, minimal */}
        <Suspense fallback={<div className="navigation-placeholder" />}>
          <NavigationBar 
            activeSection={activeSection}
            onThemeToggle={() => setThemeMode(prev => 
              prev === 'engineering' ? 'high-contrast' : 'engineering'
            )}
          />
        </Suspense>
        
        {/* HERO SECTION - Award-winning first impression */}
        <motion.section 
          ref={heroRef}
          className="hero-section"
          style={{ y: heroParallax }}
          role="region" 
          aria-label="Hero introduction"
        >
          <div className="hero-content">
            {/* Animated headline with stagger */}
            <motion.div 
              className="headline-container"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.03, delayChildren: 0.2 }
                }
              }}
            >
              <h1 className="visually-hidden">
                EmersonEIMS - Premium Power Engineering & Intelligent Energy Solutions
              </h1>
              
              <div className="headline-mask">
                {['PREMIUM', 'POWER', 'ENGINEERING'].map((word, i) => (
                  <motion.div 
                    key={word}
                    className="headline-word"
                    variants={{
                      hidden: { 
                        y: 60, 
                        opacity: 0,
                        filter: 'blur(10px)'
                      },
                      visible: { 
                        y: 0, 
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: {
                          type: 'spring',
                          damping: 25,
                          stiffness: 200
                        }
                      }
                    }}
                  >
                    <span className="word-text">{word}</span>
                    {i === 2 && (
                      <motion.span 
                        className="word-ampersand"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.8, 
                          type: 'spring',
                          damping: 15
                        }}
                      >
                        &
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="subheadline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <span className="gradient-text">Intelligent Energy</span>
                <span className="separator">|</span>
                <span>Nairobi Engineered</span>
              </motion.div>
            </motion.div>
            
            {/* WebGL Canvas - Performance optimized */}
            <Suspense 
              fallback={
                <div className="canvas-fallback">
                  <div className="core-pulse" />
                </div>
              }
            >
              <HeroCanvas 
                config={performanceConfig}
                prefersReducedMotion={prefersReducedMotion}
                progress={smoothScroll}
              />
            </Suspense>
            
            {/* Intelligent Core Badge - Animated telemetry */}
            <Suspense fallback={null}>
              <IntelligentCoreBadge 
                progress={smoothScroll}
                isVisible={activeSection === 'hero'}
              />
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
          <ServicesTeaser 
            config={performanceConfig}
            isVisible={activeSection === 'services'}
          />
        </Suspense>
        
        {/* TECHNICAL SHOWCASE - Interactive schematics */}
        <Suspense fallback={<SectionSkeleton />}>
          <TechnicalShowcase 
            prefersReducedMotion={prefersReducedMotion}
            theme={themeMode}
          />
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