// app/page.tsx - Awwwards SOTD Contender: "Intelligent Power Core"
'use client';

import { Suspense, lazy, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWindowSize } from '@/hooks/useWindowSize';
import LoadingSequence from '@/components/awwwards/LoadingSequence';
import SkipAnimation from '@/components/accessibility/SkipAnimation';
import EnhancedAccessibility from '@/components/accessibility/EnhancedAccessibility';
import EmotionalNarrative from '@/components/narrative/EmotionalNarrative';
import PageTransitions from '@/components/animations/PageTransitions';
import { Reveal, ParallaxReveal, StaggerReveal } from '@/components/animations/RevealAnimations';

// Lazy load heavy sections
const HeroCanvas = lazy(() => import('@/components/hero/HeroCanvas'));
const PowerJourney = lazy(() => import('@/components/narrative/PowerJourney'));
const ServicesTeaser = lazy(() => import('@/components/services/ServicesTeaser'));
const CaseStudies = lazy(() => import('@/components/cases/CaseStudies'));
const TechnicalShowcase = lazy(() => import('@/components/technical/TechnicalShowcase'));

// Force dynamic rendering to avoid prerendering issues with i18n
export const dynamic = 'force-dynamic';

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
    let timer: NodeJS.Timeout;
    
    const initExperience = async () => {
      if (prefersReducedMotion) {
        setIsLoaded(true);
        return;
      }
      
      try {
        // Preload critical assets with error handling
        await Promise.allSettled([
          import('@/lib/three/loadTextures').catch(() => null),
          import('@/lib/animations/fluidSimulation').catch(() => null)
        ]);
      } catch (error) {
        // Silently handle import errors
        console.warn('Some assets failed to load:', error);
      }
      
      // Start loading sequence
      timer = setTimeout(() => setIsLoaded(true), 2200);
    };
    
    initExperience();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
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
    dpr: Math.min((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1, windowWidth < 768 ? 1 : 1.5),
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
      <EnhancedAccessibility />
      
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
                <span className="gradient-text font-body text-lg md:text-xl">
                  Powering Kenya's Future Through Intelligent Energy Solutions
                </span>
                <span className="separator">|</span>
                <span className="font-body">Nairobi Engineered, Globally Trusted</span>
              </motion.div>
              {/* Enhanced emotional copywriting */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="font-body text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-8 leading-relaxed"
              >
                We don't just provide energy solutionsâ€”we power the dreams that fuel Kenya's future. 
                From life-saving hospital generators to transformative solar farms, every installation 
                tells a story of progress, resilience, and hope.
              </motion.p>
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
                <span className="cta-icon" aria-hidden="true">â–¶</span>
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
        
        {/* Emotional Narrative - Nike-level storytelling */}
        <Reveal direction="up" delay={0.1}>
          <EmotionalNarrative />
        </Reveal>
        
        {/* IMMERSIVE POWER JOURNEY - Horizontal scroll narrative */}
        <ParallaxReveal speed={0.3}>
          <Suspense fallback={<SectionSkeleton />}>
            <PowerJourney 
              scrollProgress={smoothScroll}
              prefersReducedMotion={prefersReducedMotion}
              onSectionEnter={(section) => setActiveSection(section)}
            />
          </Suspense>
        </ParallaxReveal>
        
        {/* SERVICES SHOWCASE - 3D card interactions */}
        <Reveal direction="up" delay={0.2}>
          <Suspense fallback={<SectionSkeleton />}>
            <ServicesTeaser 
              config={performanceConfig}
              isVisible={activeSection === 'services'}
            />
          </Suspense>
        </Reveal>
        
        {/* TECHNICAL SHOWCASE - Interactive schematics */}
        <Reveal direction="up" delay={0.3}>
          <Suspense fallback={<SectionSkeleton />}>
            <TechnicalShowcase 
              prefersReducedMotion={prefersReducedMotion}
              theme={themeMode}
            />
          </Suspense>
        </Reveal>
        
        {/* CASE STUDIES - Award-winning projects */}
        <Reveal direction="up" delay={0.4}>
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
        </Reveal>
        
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

