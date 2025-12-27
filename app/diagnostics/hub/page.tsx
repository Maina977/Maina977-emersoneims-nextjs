'use client';

import { useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamicImport from 'next/dynamic';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { HeroHeading, SectionHeading } from '@/components/typography/CinematicHeadingVariants';
import { DiagnosticHub } from '@/components/diagnostics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

// Force dynamic rendering to avoid prerendering issues with i18n
export const dynamic = 'force-dynamic';

export default function DiagnosticHubPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="bg-black text-white min-h-screen relative">
      {/* Holographic Laser Overlay */}
      <HolographicLaser intensity="high" color="#fbbf24" />
      
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 opacity-15">
          <SimpleThreeScene />
        </div>
      </Suspense>

      {/* Hero Section */}
      <motion.section
        className="hero-diagnostics px-4 py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <HeroHeading>DIAGNOSTIC HUB</HeroHeading>
          </div>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Comprehensive Diagnostic Dashboard
          </motion.p>
          <motion.p
            className="text-lg text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Real-time Monitoring â€¢ Advanced Analytics â€¢ Predictive Maintenance
          </motion.p>
        </div>
      </motion.section>

      {/* Diagnostic Hub */}
      <section className="px-4 mt-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white">Loading Diagnostic Hub...</p>
              </div>
            </div>
          }>
            <DiagnosticHub />
          </Suspense>
        </div>
      </section>
    </main>
  );
}


