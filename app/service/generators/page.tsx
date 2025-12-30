'use client'

import { useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLead } from "@/components/generators";
import ServiceOverview from "@/components/services/ServiceOverview";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

export default function GeneratorsServicePage() {
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
              title="Diesel Generator Services"
              subtitle="Complete generator services from installation to maintenance and repairs"
              centered
              showWebGL={false}
            />
          </div>
        </motion.section>

        {/* Service Overview */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="eims-shell py-0">
            <ServiceOverview
              title="Diesel Generator Services"
              description="Comprehensive generator services including installation, maintenance, repairs, and parts supply for all major brands including Cummins, Perkins, Caterpillar, and more."
              image="/images/GEN%202-1920x1080.png"
              features={[
                'Generator installation and commissioning',
                'Preventive and corrective maintenance',
                'Emergency repair services 24/7',
                'Genuine parts supply',
                'Load testing and performance optimization',
                'Remote monitoring and diagnostics',
              ]}
              benefits={[
                '99.8% system uptime guarantee',
                'Certified technicians',
                'OEM parts and components',
                '24/7 emergency support',
                'Predictive maintenance',
                'Cost-effective solutions',
              ]}
              stats={[
                { label: 'Projects Completed', value: '500+' },
                { label: 'System Uptime', value: '99.8%' },
                { label: 'Response Time', value: '<2 hours' },
                { label: 'Client Satisfaction', value: '98%' },
              ]}
            />
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
              Need Generator Services?
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us for professional generator services and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
              >
                Request Service
              </a>
              <a
                href="/generators"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                View Generators
              </a>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}


