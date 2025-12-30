'use client';

import React, { Suspense, useState, lazy, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from "@/components/media/OptimizedImage";
import HolographicLaser from '@/components/effects/HolographicLaser';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

// Force dynamic rendering to avoid prerendering issues with i18n
export const dynamic = 'force-dynamic';

const SEOHead = lazy(() => import("@/components/contact/SEOHead"));
const AdaptivePerformanceMonitor = lazy(() => import("@/components/contact/AdaptivePerformanceMonitor"));
const DieselGenerators = lazy(() => import("@/components/service/DieselGenerators"));
const SolarEnergy = lazy(() => import("@/components/service/SolarEnergy"));
const HighVoltage = lazy(() => import("@/components/service/HighVoltage"));
const UPSSystems = lazy(() => import("@/components/service/UPSSystems"));
const MotorRewinding = lazy(() => import("@/components/service/MotorRewinding"));
const Fabrication = lazy(() => import("@/components/service/Fabrication"));
const WaterSystems = lazy(() => import("@/components/service/WaterSystems"));
const HVACSystems = lazy(() => import("@/components/service/HVACSystems"));
const Incinerators = lazy(() => import("@/components/service/Incinerators"));
const CrossServiceOptimizers = lazy(() => import("@/components/service/CrossServiceOptimizers"));

// Service Hero Section
const ServiceHero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section 
      className="eims-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
      style={{ y }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
      
      <div className="relative z-10 eims-shell text-center">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent font-display">
            Premium Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ten comprehensive service chapters. From diesel generators to solar systems, 
            we deliver engineering excellence across Kenya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
              ⚡ Generators
            </span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              ☀️ Solar
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              🔋 UPS
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
              ⚙️ Automation
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </motion.section>
  );
};

// Service Navigation Component
const ServiceNavigation = ({
  activeService,
  onServiceSelect,
}: {
  activeService: string;
  onServiceSelect: (service: string) => void;
}) => {
  const services = [
    { id: 'diesel', name: 'Diesel Generators', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
    { id: 'solar', name: 'Solar Energy', icon: '☀️', color: 'from-blue-500 to-blue-600' },
    { id: 'hv', name: 'High Voltage', icon: '🔌', color: 'from-red-500 to-red-600' },
    { id: 'ups', name: 'UPS Systems', icon: '🔋', color: 'from-green-500 to-green-600' },
    { id: 'motor', name: 'Motor Rewinding', icon: '⚙️', color: 'from-purple-500 to-purple-600' },
    { id: 'fab', name: 'Fabrication', icon: '🔧', color: 'from-cyan-500 to-cyan-600' },
    { id: 'water', name: 'Water Systems', icon: '💧', color: 'from-blue-400 to-blue-500' },
    { id: 'hvac', name: 'HVAC Systems', icon: '❄️', color: 'from-indigo-500 to-indigo-600' },
    { id: 'incin', name: 'Incinerators', icon: '🔥', color: 'from-orange-500 to-orange-600' },
    { id: 'opt', name: 'Optimizers', icon: '📊', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <section className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4">
      <div className="eims-shell py-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                onServiceSelect(service.id);
              }}
              aria-current={activeService === service.id ? 'true' : undefined}
              className={`flex-shrink-0 px-6 py-3 rounded-lg text-black font-bold transition-all whitespace-nowrap font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                activeService === service.id
                  ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] ring-2 ring-amber-400/40'
                  : 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] opacity-80 hover:opacity-100 hover:scale-105'
              }`}
            >
              <span className="mr-2">{service.icon}</span>
              {service.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// Service Stats Component
const ServiceStats = () => {
  const stats = [
    { value: "10", label: "Service Categories", icon: "📋" },
    { value: "500", label: "Projects Completed", icon: "🏗️" },
    { value: "98.7%", label: "Success Rate", icon: "✅" },
    { value: "24/7", label: "Support Available", icon: "🔄" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="eims-shell py-0">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent mb-2 font-display">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function ServicePage() {
  const [performanceTier, setPerformanceTier] = useState("high");
  const [activeService, setActiveService] = useState<string>('diesel');
  const prefersReducedMotion = useReducedMotion();
  const { isLite } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);

  const setHash = (id: string) => {
    if (typeof window === 'undefined') return;
    const nextHash = `#${id}`;
    if (window.location.hash === nextHash) return;
    window.history.replaceState(null, '', nextHash);
  };

  const scrollToService = (id: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleServiceSelect = (id: string) => {
    setActiveService(id);
    setHash(id);
    scrollToService(id);
  };

  // GSAP ScrollTrigger animations
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

  // Sync active section + support deep-linking via hash
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ids = ['diesel', 'solar', 'hv', 'ups', 'motor', 'fab', 'water', 'hvac', 'incin', 'opt'] as const;

    const initial = window.location.hash.replace('#', '');
    if (initial && (ids as readonly string[]).includes(initial)) {
      setActiveService(initial);
      // Let the layout settle before scrolling (header + sticky nav)
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToService(initial)));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        const top = visible[0];
        const id = top?.target?.id;
        if (!id) return;

        setActiveService(id);
        setHash(id);
      },
      {
        root: null,
        // Bias towards the section that sits under the header + sticky nav
        rootMargin: '-30% 0px -60% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      {!isLite && (
        <Suspense fallback={null}>
          <CustomCursor enabled={!prefersReducedMotion} />
        </Suspense>
      )}

      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading services...</p>
          </div>
        </div>
      }>
        <SEOHead
          title="EmersonEIMS Services | Generator Intelligence, Solar, UPS, HV Infrastructure & More"
          description="Ten premium service chapters. Calculators, charts, adaptive performance, and cinematic design that sells — built for Kenya and beyond."
          keywords="services, generators, solar, UPS, high voltage, infrastructure, Kenya, EmersonEIMS, engineering, maintenance"
        />
      </Suspense>

      <main ref={containerRef} role="main" className="eims-section relative">
        {/* Holographic Laser Overlay */}
        {!isLite && <HolographicLaser intensity="medium" color="#fbbf24" />}
        
        {/* 3D Background Scene */}
        {!isLite && (
          <Suspense fallback={null}>
            <div className="fixed inset-0 -z-10 opacity-15">
              <SimpleThreeScene />
            </div>
          </Suspense>
        )}

        {/* Hero Section */}
        <ServiceHero />

        {/* Service Navigation */}
        <ServiceNavigation activeService={activeService} onServiceSelect={handleServiceSelect} />

        {/* Service Stats */}
        <ServiceStats />

        {/* Visual Brand Element */}
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="eims-shell py-0">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <OptimizedImage
                src="https://emersoneims.com/wp-content/uploads/2025/10/Untitled-design-4.svg"
                alt="EmersonEIMS design graphic"
                width={800}
                height={400}
                className="max-w-2xl opacity-80 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </div>
        </section>

        {/* Service Sections */}
        <ErrorBoundary>
          <Suspense fallback={
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading service content...</p>
            </div>
          }>
            <div id="diesel" className="scroll-mt-32">
              <DieselGenerators key="diesel" performanceTier={performanceTier} />
            </div>
            <div id="solar" className="scroll-mt-32">
              <SolarEnergy key="solar" performanceTier={performanceTier} />
            </div>
            <div id="hv" className="scroll-mt-32">
              <HighVoltage key="hv" performanceTier={performanceTier} />
            </div>
            <div id="ups" className="scroll-mt-32">
              <UPSSystems key="ups" performanceTier={performanceTier} />
            </div>
            <div id="motor" className="scroll-mt-32">
              <MotorRewinding key="motor" performanceTier={performanceTier} />
            </div>
            <div id="fab" className="scroll-mt-32">
              <Fabrication key="fab" performanceTier={performanceTier} />
            </div>
            <div id="water" className="scroll-mt-32">
              <WaterSystems key="water" performanceTier={performanceTier} />
            </div>
            <div id="hvac" className="scroll-mt-32">
              <HVACSystems key="hvac" performanceTier={performanceTier} />
            </div>
            <div id="incin" className="scroll-mt-32">
              <Incinerators key="incin" performanceTier={performanceTier} />
            </div>
            <div id="opt" className="scroll-mt-32">
              <CrossServiceOptimizers key="opt" performanceTier={performanceTier} />
            </div>
            <AdaptivePerformanceMonitor onPerformanceChange={setPerformanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
          <div className="eims-shell py-0 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent font-display">
              Ready to Transform Your Energy Infrastructure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let our experts design the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="cta-button-primary">
                <span>Get Free Consultation →</span>
              </Link>
              <Link href="/diagnostics" className="cta-button-secondary">
                <span>Try Diagnostics Tool →</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}

