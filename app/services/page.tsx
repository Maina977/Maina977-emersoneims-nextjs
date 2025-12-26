'use client';

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLead } from "@/components/generators";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceOverview from "@/components/services/ServiceOverview";
import ServiceComparison from "@/components/services/ServiceComparison";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

// Services Data
const services = [
  {
    title: 'Diesel Generators',
    description: 'Complete generator solutions from installation to maintenance',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
    href: '/service/generators',
    features: ['Installation', 'Maintenance', 'Repairs', 'Parts'],
    icon: '⚡',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    title: 'Solar Systems',
    description: 'Solar energy solutions for residential and commercial applications',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
    href: '/service/solar',
    features: ['Installation', 'Maintenance', 'Repairs', 'Sizing'],
    icon: '☀️',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Control Systems',
    description: 'Advanced control systems for generator automation',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/controls.jpg',
    href: '/service/controls',
    features: ['DeepSea', 'PowerWizard', 'Remote Monitoring', 'Automation'],
    icon: '🎛️',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'AC & HVAC',
    description: 'Complete air conditioning and HVAC solutions',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/ac-systems.jpg',
    href: '/service/ac',
    features: ['Installation', 'Maintenance', 'Repairs', 'Energy Efficiency'],
    icon: '❄️',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    title: 'UPS Systems',
    description: 'Uninterruptible power supply systems for critical loads',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/ups-systems.jpg',
    href: '/service/ups',
    features: ['Installation', 'Battery Backup', 'Maintenance', 'Monitoring'],
    icon: '🔋',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Motor Rewinding',
    description: 'Professional motor repair and rewinding services',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/motors.jpg',
    href: '/service/motors',
    features: ['Rewinding', 'Repairs', 'Testing', 'Maintenance'],
    icon: '⚙️',
    color: 'from-gray-500 to-gray-600',
  },
];

const comparisonServices = [
  {
    name: 'Basic Service',
    price: 'From KSh 15,000',
    features: ['Monthly inspection', 'Basic maintenance', 'Email support'],
    bestFor: 'Small businesses',
  },
  {
    name: 'Premium Service',
    price: 'From KSh 50,000',
    features: ['Weekly inspection', 'Full maintenance', '24/7 support', 'Remote monitoring'],
    bestFor: 'Medium businesses',
    popular: true,
  },
  {
    name: 'Enterprise Service',
    price: 'Custom Quote',
    features: ['Daily monitoring', 'Dedicated technician', 'Predictive maintenance', 'Custom SLA'],
    bestFor: 'Large enterprises',
  },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
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
            title="Our Services"
            subtitle="Comprehensive energy infrastructure solutions across East Africa"
            centered
            showWebGL={false}
          />
        </motion.section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  image={service.image}
                  href={service.href}
                  features={service.features}
                  icon={service.icon}
                  color={service.color}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Service Comparison */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLead
              title="Service Plans Comparison"
              subtitle="Choose the service plan that fits your needs"
              centered
            />
            
            <div className="mt-12">
              <ServiceComparison services={comparisonServices} />
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
              Ready to Get Started?
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us today to discuss your energy infrastructure needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
              >
                Get Free Consultation
              </a>
              <a
                href="/diagnostics"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                Try Diagnostics Tool
              </a>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}

