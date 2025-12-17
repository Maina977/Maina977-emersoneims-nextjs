'use client';

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLead from "@/components/generators/SectionLead";
import ServiceAnalytics from "@/components/diagnostics/ServiceAnalytics";
import MaintenanceCharts from "@/components/generators/MaintenanceCharts";
import GeneratorHealthIndex from "@/components/generators/GeneratorHealthIndex";
import OptimizedImage from "@/components/media/OptimizedImage";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

// Maintenance Services
const maintenanceServices = [
  {
    title: 'Preventive Maintenance',
    description: 'Regular scheduled maintenance to prevent breakdowns',
    frequency: 'Monthly/Quarterly',
    price: 'From KSh 15,000',
    features: ['Oil & filter change', 'Battery check', 'Coolant inspection', 'Load testing'],
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
  },
  {
    title: 'Emergency Repairs',
    description: '24/7 emergency repair service',
    frequency: 'On-demand',
    price: 'Call for quote',
    features: ['24/7 availability', 'Rapid response', 'Expert technicians', 'Genuine parts'],
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
  },
  {
    title: 'Major Overhaul',
    description: 'Complete engine and alternator overhaul',
    frequency: 'Every 10,000 hours',
    price: 'From KSh 500,000',
    features: ['Engine rebuild', 'Alternator service', 'Full system check', 'Warranty included'],
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
  },
  {
    title: 'Remote Monitoring',
    description: 'Real-time generator monitoring and diagnostics',
    frequency: '24/7',
    price: 'From KSh 25,000/month',
    features: ['Real-time alerts', 'Performance tracking', 'Predictive maintenance', 'Mobile app'],
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/controls.jpg',
  },
];

const questionsData = [
  { service: 'Preventive Maintenance', count: 150 },
  { service: 'Emergency Repairs', count: 45 },
  { service: 'Major Overhaul', count: 12 },
  { service: 'Remote Monitoring', count: 80 },
];

export default function MaintenancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

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

  return (
    <ErrorBoundary>
      <main ref={containerRef} className="min-h-screen bg-black text-white relative">
        {/* Holographic Laser Overlay */}
        <HolographicLaser intensity="high" color="#fbbf24" />
        
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <div className="fixed inset-0 -z-10 opacity-20">
            <SimpleThreeScene />
          </div>
        </Suspense>

        {/* Hero Section */}
        <motion.section
          className="relative py-32 px-4 overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          <SectionLead
            title="Generator Maintenance"
            subtitle="Comprehensive maintenance services to keep your generators running at peak performance"
            centered
            showWebGL={false}
          />
        </motion.section>

        {/* Service Analytics */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Suspense fallback={
                <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white">Loading Service Analytics...</p>
                  </div>
                </div>
              }>
                <ServiceAnalytics questionsData={questionsData} />
              </Suspense>
            </motion.div>
          </div>
        </section>

        {/* Maintenance Charts & Health Index */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLead
              title="Maintenance Analytics & Health Monitoring"
              subtitle="Track maintenance schedules, costs, and generator health in real-time"
              centered
            />
            
            <div className="mt-12 grid lg:grid-cols-2 gap-8">
              <MaintenanceCharts />
              <GeneratorHealthIndex />
            </div>
          </div>
        </section>

        {/* Maintenance Services */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLead
              title="Our Maintenance Services"
              subtitle="Comprehensive maintenance solutions for all generator types"
              centered
            />
            
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {maintenanceServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-300">{service.frequency}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <p className="text-amber-400 font-semibold mb-4">{service.price}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="text-amber-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/contact"
                      className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
                    >
                      Request Service
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-500/10 via-black to-amber-500/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Keep Your Generators Running Smoothly
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule maintenance or get emergency support 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
              >
                Schedule Maintenance
              </a>
              <a
                href="tel:+254700000000"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                Emergency: 24/7 Hotline
              </a>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}

