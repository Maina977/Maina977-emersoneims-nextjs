'use client'

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLead, GeneratorCalculator, MTBFChart, ErrorFrequencyChart } from "@/components/generators";
import OptimizedImage from "@/components/media/OptimizedImage";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

// Case Study Data
const caseStudies = [
  {
    id: 'st-austin',
    title: 'St. Austin Academy',
    category: 'Education',
    location: 'Nairobi, Kenya',
    generator: 'Cummins 200kVA',
    challenge: 'Frequent power outages disrupting classes and administrative operations',
    solution: 'Installation of Cummins 200kVA generator with DeepSea controller and automatic transfer switch',
    results: [
      '99.8% uptime achieved',
      'Zero class disruptions',
      'KSh 2.3M saved in operational costs',
      '5-year maintenance contract',
    ],
    image: '/images/GEN%202-1920x1080.png',
    testimonial: 'EmersonEIMS transformed our power reliability. No more interruptions during critical exams.',
    author: 'Principal, St. Austin Academy',
  },
  {
    id: 'kivukoni',
    title: 'Kivukoni International School',
    category: 'Education',
    location: 'Nairobi, Kenya',
    generator: 'Cummins 150kVA',
    challenge: 'Unreliable grid power affecting boarding school operations',
    solution: 'Hybrid solar-diesel system with 150kVA Cummins backup generator',
    results: [
      '100% power reliability',
      '40% reduction in energy costs',
      'Solar integration completed',
      '24/7 monitoring enabled',
    ],
    image: '/images/solar%20power%20farms.png',
    testimonial: 'The hybrid system exceeded expectations. Our students now have uninterrupted power.',
    author: 'Facilities Manager, Kivukoni School',
  },
  {
    id: 'bigot-flowers',
    title: 'Bigot Flowers',
    category: 'Agriculture',
    location: 'Naivasha, Kenya',
    generator: 'Cummins 300kVA',
    challenge: 'Critical cooling systems requiring constant power for flower preservation',
    solution: 'Primary Cummins 300kVA generator with redundant backup system',
    results: [
      'Zero product loss',
      '99.9% uptime',
      'Automated failover system',
      'Remote monitoring implemented',
    ],
    image: '/images/GEN%202-1920x1080.png',
    testimonial: 'Our flower export business depends on reliable power. EmersonEIMS delivered perfectly.',
    author: 'Operations Director, Bigot Flowers',
  },
  {
    id: 'greenheart',
    title: 'Greenheart Hotel',
    category: 'Hospitality',
    location: 'Mombasa, Kenya',
    generator: 'Cummins 500kVA',
    challenge: 'Hotel operations requiring 24/7 power for guest comfort and safety',
    solution: 'Dual Cummins 500kVA generators with load sharing and hotel management integration',
    results: [
      '100% guest satisfaction',
      'Zero service interruptions',
      'Energy efficiency improved',
      'Maintenance cost reduced by 30%',
    ],
    image: '/images/GEN%202-1920x1080.png',
    testimonial: 'Our guests never experience power issues. The system is flawless.',
    author: 'General Manager, Greenheart Hotel',
  },
  {
    id: 'ntsa',
    title: 'NTSA Headquarters',
    category: 'Government',
    location: 'Nairobi, Kenya',
    generator: 'Cummins 400kVA',
    challenge: 'Critical government operations requiring uninterrupted power',
    solution: 'Redundant generator system with automatic failover and remote monitoring',
    results: [
      '100% operational continuity',
      'Compliance with government standards',
      'Real-time monitoring dashboard',
      'Predictive maintenance enabled',
    ],
    image: '/images/GEN%202-1920x1080.png',
    testimonial: 'EmersonEIMS ensured our critical operations never fail. Exceptional service.',
    author: 'IT Director, NTSA',
  },
  {
    id: 'sanergy',
    title: 'Sanergy Limited',
    category: 'Waste Management',
    location: 'Nairobi, Kenya',
    generator: 'Cummins 250kVA',
    challenge: 'Waste processing facility requiring reliable power for continuous operations',
    solution: 'Cummins 250kVA generator with advanced control systems and monitoring',
    results: [
      'Continuous operations achieved',
      '95% reduction in downtime',
      'Automated load management',
      'Cost savings of KSh 1.8M annually',
    ],
    image: '/images/GEN%202-1920x1080.png',
    testimonial: 'The reliability of our power system transformed our operations.',
    author: 'Plant Manager, Sanergy Limited',
  },
];

export default function CaseStudiesPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { isLite } = usePerformanceTier();

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
          className="relative py-32 overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          <div className="eims-shell py-0">
            <SectionLead
              title="Case Studies"
              subtitle="Real-world success stories from our generator installations across East Africa"
              centered
              showWebGL={false}
            />
          </div>
        </motion.section>

        {/* Case Studies Grid */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="eims-shell py-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCase(selectedCase === study.id ? null : study.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={study.image}
                      alt={study.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500/80 backdrop-blur-sm text-black text-xs font-bold rounded">
                        {study.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{study.title}</h3>
                      <p className="text-sm text-gray-300">{study.location}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-amber-400 font-semibold mb-2">Generator: {study.generator}</p>
                      <p className="text-sm text-gray-400">{study.challenge}</p>
                    </div>
                    
                    {selectedCase === study.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white mb-2">Solution:</h4>
                          <p className="text-sm text-gray-300">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-2">Results:</h4>
                          <ul className="space-y-1">
                            {study.results.map((result, idx) => (
                              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-amber-400 mt-1">✓</span>
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-gray-800">
                          <p className="text-sm italic text-gray-400 mb-2">"{study.testimonial}"</p>
                          <p className="text-xs text-gray-500">— {study.author}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator & Charts Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="eims-shell py-0">
            <SectionLead
              title="ROI Analysis & Reliability Metrics"
              subtitle="Calculate your generator ROI and compare reliability metrics"
              centered
            />
            
            <div className="mt-12 grid lg:grid-cols-2 gap-8">
              <GeneratorCalculator />
              <div className="space-y-8">
                <MTBFChart />
                <ErrorFrequencyChart />
              </div>
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
              Ready to Join Our Success Stories?
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how we can power your success with reliable generator solutions.
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


