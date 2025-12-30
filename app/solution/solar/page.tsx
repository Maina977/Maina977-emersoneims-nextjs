'use client';

import { useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLead } from "@/components/generators";
import AnimatedImage from "@/components/effects/AnimatedImage";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

// Force dynamic rendering to avoid prerendering issues with i18n
export const dynamic = 'force-dynamic';

export default function SolarSolutionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { isLite } = usePerformanceTier();

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
    <ErrorBoundary>
      <main ref={containerRef} className="eims-section min-h-screen relative">
        {/* Holographic Laser Overlay */}
        {!isLite && <HolographicLaser intensity="high" color="#fbbf24" />}
        
        {/* 3D Background Scene */}
        {!isLite && (
          <Suspense fallback={null}>
            <div className="fixed inset-0 -z-10 opacity-20">
              <SimpleThreeScene />
            </div>
          </Suspense>
        )}

        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          <div className="eims-shell py-32">
            <SectionLead
              title="Solar Energy Solutions"
              subtitle="Harness the power of the sun with our comprehensive solar energy solutions"
              centered
              showWebGL={false}
            />
          </div>
        </motion.section>

        {/* Solution Overview */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="eims-shell py-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimatedImage
                src="/images/solar%20power%20farms.png"
                alt="Solar Solutions"
                width={3840}
                height={2160}
                animationType="parallax"
                intensity="high"
                className="rounded-2xl overflow-hidden"
              />
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold mb-6 text-amber-400">Solar Energy Excellence</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  From residential rooftop installations to commercial solar farms, we deliver 
                  solar solutions that maximize energy independence and ROI.
                </p>
                <ul className="space-y-3">
                  {[
                    'Solar panel installation',
                    'Battery storage systems',
                    'Grid-tie and off-grid solutions',
                    'Solar water heating',
                    'Maintenance and repairs',
                    'Performance monitoring',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-amber-400 mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-500/10 via-black to-amber-500/10">
          <div className="eims-shell py-0 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Go Solar Today
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Get a free solar assessment and quote for your property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
              >
                Get Free Assessment
              </a>
              <a
                href="/solar"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}


