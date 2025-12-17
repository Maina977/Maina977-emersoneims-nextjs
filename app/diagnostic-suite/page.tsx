'use client';

import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageLayout from '@/components/shared/PageLayout';
import CTAButton from '@/components/shared/CTAButton';
import OptimizedImage from '@/components/media/OptimizedImage';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { DIAGNOSTIC_TOOLS } from '@/lib/data/diagnosticTools';
import { SectionHeading, SubsectionHeading } from '@/components/typography/CinematicHeadingVariants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load heavy components
const ErrorBoundary = lazy(() => import('@/components/error/ErrorBoundary'));
const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const GeneratorControlDiagnosticHub = lazy(() => import('@/components/diagnostics/GeneratorControlDiagnosticHub'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));
const TeslaStyleNavigation = lazy(() => import('@/components/navigation/TeslaStyleNavigation'));

/**
 * EmersonEIMS Diagnostic Suite Page
 * Generator Control Diagnostic Hub - Specialized for Generators, Controls, DeepSea, and PowerWizard
 * This is the generator-specific diagnostic tool, separate from the Universal Diagnostic Machine
 */
export default function DiagnosticSuitePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Section tracking for navigation
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

  const diagnosticTools = DIAGNOSTIC_TOOLS;

  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      <Suspense fallback={null}>
        <CustomCursor enabled={!prefersReducedMotion} />
      </Suspense>

      {/* Navigation */}
      <Suspense fallback={null}>
        <TeslaStyleNavigation activeSection={activeSection} />
      </Suspense>

      <div ref={containerRef} className="relative min-h-screen">
        {/* Holographic Laser Overlay */}
        <HolographicLaser intensity="high" color="#fbbf24" />
        
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <div className="fixed inset-0 -z-10 opacity-20">
            <SimpleThreeScene />
          </div>
        </Suspense>

        <PageLayout
          title="Generator Control Diagnostic Hub"
          subtitle="Specialized diagnostic suite for Diesel Generators, Generator Controls, DeepSea Controllers, and PowerWizard Systems. Technician-grade fault codes, diagnostics, and troubleshooting for generator systems across East Africa."
          heroImage="https://emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
        >
          {/* Overview Section */}
          <motion.section 
            className="py-20 bg-black relative"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <SectionHeading>Generator Control Diagnostic Tools</SectionHeading>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Specialized diagnostic suite for Generators, Controls, DeepSea, and PowerWizard systems.
                Designed for technicians, engineers, and service managers working with generator control systems.
              </p>
            </motion.div>

            {/* Diagnostic Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diagnosticTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-[#fbbf24]/50 transition-all overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={tool.image}
                      alt={tool.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute top-4 left-4 text-4xl">{tool.icon}</div>
                    {activeTab === tool.id && (
                      <div className="absolute inset-0 border-2 border-[#fbbf24] pointer-events-none" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-display">{tool.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                    <ul className="space-y-1">
                      {tool.features.map((feature) => (
                        <li key={feature} className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="text-[#fbbf24]">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          </motion.section>

          {/* Generator Control Diagnostic Hub - Main Tool */}
          <motion.section 
            className="py-20 bg-gradient-to-b from-black to-gray-900 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  <SectionHeading>Generator Control Diagnostic Hub</SectionHeading>
                </div>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Specialized diagnostic interface for Generators, Controls, DeepSea Controllers, and PowerWizard Systems
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Suspense fallback={
                  <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white">Loading Generator Control Diagnostic Hub...</p>
                    </div>
                  </div>
                }>
                  <GeneratorControlDiagnosticHub />
                </Suspense>
              </motion.div>
            </div>
          </motion.section>

          {/* Active Tool Display */}
          {activeTab !== 'overview' && (
            <motion.section 
              className="py-20 bg-gradient-to-b from-black to-gray-900 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-[#fbbf24]/20 p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-white font-display">
                    {diagnosticTools.find(t => t.id === activeTab)?.title}
                  </h3>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-300 mb-8">
                  {diagnosticTools.find(t => t.id === activeTab)?.description}
                </p>
                
                {/* WordPress Integration Placeholder */}
                <div className="bg-black/50 rounded-lg p-8 border border-gray-800">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {diagnosticTools.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4 font-display">
                      Diagnostic Tool Loading...
                    </h4>
                    <p className="text-gray-400 mb-8">
                      This tool integrates with the EmersonEIMS Diagnostic Suite WordPress plugin.
                      Connect to your WordPress installation to access full functionality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <CTAButton href="/contact" variant="primary">
                        Get Access
                      </CTAButton>
                      <CTAButton href="/diagnostics" variant="secondary">
                        Try Universal Diagnostic Machine
                      </CTAButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
          )}

          {/* Features Section */}
          <motion.section 
            className="py-20 bg-black relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <SectionHeading>Key Features</SectionHeading>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Real-time Diagnostics',
                  description: 'Instant fault code lookup and diagnostic recommendations',
                  icon: '⚡',
                },
                {
                  title: 'Intelligent Analysis',
                  description: 'AI-powered load analysis and performance optimization',
                  icon: '🧠',
                },
                {
                  title: 'Seamless Integration',
                  description: 'Works with your existing WordPress installation',
                  icon: '🔗',
                },
                {
                  title: 'Mobile Ready',
                  description: 'Access diagnostic tools from any device',
                  icon: '📱',
                },
                {
                  title: 'WhatsApp Dispatch',
                  description: 'Automated technician dispatch via WhatsApp',
                  icon: '💬',
                },
                {
                  title: 'Business Intelligence',
                  description: 'Conversion tracking and performance analytics',
                  icon: '📊',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6 hover:border-[#fbbf24]/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            className="py-20 bg-gradient-to-br from-[#fbbf24]/10 via-black to-[#fbbf24]/10 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading>Ready to Power Your Diagnostics?</SectionHeading>
            </motion.div>
            <p className="text-xl text-gray-300 mb-8">
              Get access to the Generator Control Diagnostic Hub and transform your generator and controller maintenance operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/contact" variant="primary" size="lg">
                Request Access
              </CTAButton>
              <CTAButton href="/diagnostics" variant="secondary" size="lg">
                Try Universal Diagnostic Machine
              </CTAButton>
            </div>
          </div>
          </motion.section>
        </PageLayout>
      </div>
    </ErrorBoundary>
  );
}
