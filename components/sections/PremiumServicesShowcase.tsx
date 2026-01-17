'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';

// All 9 services from EmersonEIMS - Real data only
const services = [
  {
    id: 'generators',
    title: 'Generator Solutions',
    subtitle: 'Sales • Service • Maintenance',
    description: 'Cummins Voltka authorized dealer. 20kVA to 2000kVA diesel generators with remote monitoring.',
    icon: '⚡',
    color: 'from-amber-500 to-orange-600',
    stats: { capacity: '45,000+ kVA', installed: '523+ units' },
    features: ['24/7 Emergency Response', 'Scheduled Maintenance', 'Remote Monitoring', 'Parts Inventory'],
    href: '/services/generators',
  },
  {
    id: 'solar',
    title: 'Solar Energy Systems',
    subtitle: 'Grid-Tied • Off-Grid • Hybrid',
    description: 'Tier-1 panels with Tesla Powerwall integration. 5.5-5.9 kWh/m²/day Kenya irradiance.',
    icon: '☀️',
    color: 'from-yellow-400 to-amber-500',
    stats: { savings: '30% Energy', roi: '3-4 Years' },
    features: ['Net Metering', 'Battery Storage', 'Smart Inverters', '25yr Warranty'],
    href: '/services/solar',
  },
  {
    id: 'high-voltage',
    title: 'High Voltage Infrastructure',
    subtitle: 'Transformers • Switchgear • Substations',
    description: 'KPLC-approved installations. 11kV-33kV infrastructure, transformer servicing and protection.',
    icon: '🔌',
    color: 'from-cyan-400 to-blue-600',
    stats: { voltage: 'Up to 33kV', transformers: '200+ Serviced' },
    features: ['KPLC Compliance', 'Protection Systems', 'Oil Testing', 'Thermography'],
    href: '/services/high-voltage',
  },
  {
    id: 'motor-rewinding',
    title: 'Motor Rewinding',
    subtitle: 'Repair • Rewinding • Testing',
    description: 'Industrial motor repair up to 500HP. VPI impregnation, dynamic balancing, vibration analysis.',
    icon: '⚙️',
    color: 'from-purple-500 to-indigo-600',
    stats: { capacity: 'Up to 500HP', efficiency: '98%+ Restored' },
    features: ['Surge Testing', 'Core Loss Testing', 'Dynamic Balancing', 'VPI Treatment'],
    href: '/services/motors',
  },
  {
    id: 'ac-systems',
    title: 'AC & HVAC Systems',
    subtitle: 'Installation • Maintenance • Repair',
    description: 'Commercial and industrial HVAC. VRF systems, chillers, precision cooling for data centers.',
    icon: '❄️',
    color: 'from-sky-400 to-cyan-500',
    stats: { coverage: 'All Brands', response: '< 4hrs' },
    features: ['VRF Systems', 'Chillers', 'Air Handling Units', 'Precision Cooling'],
    href: '/services/ac',
  },
  {
    id: 'ups-systems',
    title: 'UPS Systems',
    subtitle: 'Online • Offline • Line-Interactive',
    description: 'Critical power protection 1kVA-800kVA. Data center UPS, battery replacement, maintenance.',
    icon: '🔋',
    color: 'from-green-500 to-emerald-600',
    stats: { range: '1-800 kVA', uptime: '99.999%' },
    features: ['APC/Schneider', 'Battery Testing', 'Remote Monitoring', 'Hot-swap'],
    href: '/services/ups',
  },
  {
    id: 'borehole-pumps',
    title: 'Borehole Pumps',
    subtitle: 'Installation • Solar Pumping • Service',
    description: 'Submersible pump installation, solar-powered pumping systems, water supply solutions.',
    icon: '💧',
    color: 'from-blue-500 to-sky-600',
    stats: { depth: 'Up to 300m', flow: '100+ m³/hr' },
    features: ['Solar Pumping', 'Grundfos Partner', 'VFD Control', 'Water Level Sensors'],
    href: '/services/borehole-pumps',
  },
  {
    id: 'fabrication',
    title: 'Steel Fabrication',
    subtitle: 'Structures • Enclosures • Custom Work',
    description: 'Generator enclosures, fuel tanks, steel structures, custom fabrication to specification.',
    icon: '🏗️',
    color: 'from-gray-500 to-zinc-600',
    stats: { projects: '150+ Completed', capacity: 'Industrial Scale' },
    features: ['Acoustic Enclosures', 'Fuel Tanks', 'Canopies', 'Custom Steel'],
    href: '/services/fabrication',
  },
  {
    id: 'incinerators',
    title: 'Hospital Incinerators',
    subtitle: 'Medical Waste • NEMA Compliant',
    description: 'NEMA-approved hospital waste incinerators. Complete installation and maintenance.',
    icon: '🏥',
    color: 'from-red-500 to-orange-600',
    stats: { capacity: 'Up to 500kg/hr', compliance: 'NEMA Certified' },
    features: ['Medical Waste', 'Emission Control', 'Auto-Feed', 'Remote Monitoring'],
    href: '/services/incinerators',
  },
];

export default function PremiumServicesShowcase() {
  const [activeService, setActiveService] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={containerRef}
      className="py-24 sm:py-32 bg-black relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.02]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Complete Power Solutions
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            9 Specialized
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> Services</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From generators to solar, UPS to fabrication - comprehensive energy solutions under one roof.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActiveService(index)}
              className={`relative group cursor-pointer ${activeService === index ? 'z-10' : ''}`}
            >
              <div className={`
                relative overflow-hidden rounded-2xl p-6 
                bg-gradient-to-br from-white/5 to-transparent 
                border border-white/10 
                hover:border-amber-500/50 
                transition-all duration-500
                ${activeService === index ? 'scale-[1.02] shadow-2xl shadow-amber-500/10' : ''}
              `}>
                {/* Glow effect on active */}
                <div className={`
                  absolute -inset-1 bg-gradient-to-r ${service.color} 
                  rounded-2xl opacity-0 blur-xl transition-opacity duration-500
                  ${activeService === index ? 'opacity-20' : 'group-hover:opacity-10'}
                `} />
                
                <div className="relative">
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-4xl mb-3 block">{service.icon}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500">{service.subtitle}</p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <motion.div
                      initial={{ x: 0, opacity: 0.5 }}
                      whileHover={{ x: 4, opacity: 1 }}
                      className="text-amber-500"
                    >
                      →
                    </motion.div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    {Object.entries(service.stats).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm font-bold text-white">{value}</div>
                        <div className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Features pills */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((feature) => (
                      <span 
                        key={feature}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs px-2 py-1 text-amber-400">
                        +{service.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <Link
            href="/diagnostics"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300"
          >
            <span className="text-xl">🔬</span>
            Access Universal Diagnostic Center
            <span className="text-lg">→</span>
          </Link>
          <p className="mt-4 text-gray-500 text-sm">
            Free diagnostic tools for all 9 services • Q&A • Calculators • Instant Quotes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
