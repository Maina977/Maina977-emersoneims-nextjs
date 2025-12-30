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

// Force dynamic rendering to avoid prerendering issues with i18n
export const dynamic = 'force-dynamic';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

export default function GeneratorsSolutionPage() {
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
              title="Diesel Generator Solutions"
              subtitle="Complete generator solutions from 20kVA to 2000kVA with comprehensive support"
              centered
              showWebGL={false}
            />
          </div>
        </motion.section>

        {/* Solution Overview */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="eims-shell py-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold mb-6 text-amber-400">Complete Generator Solutions</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  From initial load analysis to installation, commissioning, and 24/7 maintenance support, 
                  we provide end-to-end generator solutions tailored to your specific needs.
                </p>
                <ul className="space-y-3">
                  {[
                    'Load analysis and system design',
                    'Generator selection and sizing',
                    'Professional installation',
                    'Commissioning and testing',
                    '24/7 maintenance support',
                    'Remote monitoring and diagnostics',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-amber-400 mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <AnimatedImage
                src="/images/GEN%202-1920x1080.png"
                alt="Generator Solutions"
                width={800}
                height={600}
                animationType="3d"
                intensity="high"
                className="rounded-2xl overflow-hidden"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="eims-shell py-0">
            <SectionLead
              title="Why Choose Our Generator Solutions"
              subtitle="Industry-leading expertise and comprehensive support"
              centered
            />
            
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Expert Installation',
                  description: 'Certified technicians with 15+ years experience',
                  icon: '🔧',
                },
                {
                  title: '24/7 Support',
                  description: 'Round-the-clock emergency support and monitoring',
                  icon: '📞',
                },
                {
                  title: 'Genuine Parts',
                  description: 'OEM parts and components for optimal performance',
                  icon: '⚙️',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-amber-500/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
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
              Ready to Power Your Business?
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Get a free consultation and quote for your generator needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
              >
                Get Free Consultation
              </a>
              <a
                href="/generators"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                Explore Generators
              </a>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}


