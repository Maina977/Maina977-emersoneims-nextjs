'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Premium Service Data with correct image mappings
const SERVICES = [
  {
    id: 'generators',
    title: 'Diesel Generators',
    subtitle: 'Power When You Need It Most',
    description: 'Complete generator solutions from 5kVA to 2000kVA. Installation, maintenance, repairs, and 24/7 emergency service across Kenya.',
    features: ['Installation & Commissioning', 'Preventive Maintenance', 'Emergency Repairs 24/7', 'AMF & ATS Panels', 'Load Bank Testing', 'Parts & Consumables'],
    image: '/images/GEN 2-1920x1080.png',
    gallery: ['/images/GEN 2-1920x1080.png', '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp', '/images/ENGINE PARTS.png', '/images/gen00011.jpg'],
    color: 'from-amber-500 to-orange-600',
    stats: { projects: '500+', uptime: '99.9%', response: '2hr' },
    href: '/solutions/generators',
  },
  {
    id: 'solar',
    title: 'Solar Energy Systems',
    subtitle: 'Harness the African Sun',
    description: 'Residential, commercial, and industrial solar installations. Grid-tie, hybrid, and off-grid systems with KPLC net metering support.',
    features: ['System Design & Sizing', 'Panel Installation', 'Inverter Setup', 'Battery Storage', 'Net Metering', 'Monitoring Systems'],
    image: '/images/solar power for farms.png',
    gallery: ['/images/solar power for farms.png', '/images/solar for flower farms.png', '/images/solar hotel heaters.png', '/images/solar changeover control.png'],
    color: 'from-yellow-400 to-amber-500',
    stats: { installed: '2MW+', savings: '60%', warranty: '25yr' },
    href: '/solutions/solar',
  },
  {
    id: 'ups',
    title: 'UPS & Power Protection',
    subtitle: 'Uninterrupted Power Supply',
    description: 'Protect critical equipment with online, line-interactive, and modular UPS systems. Data centers, hospitals, and enterprise solutions.',
    features: ['UPS Installation', 'Battery Replacement', 'Load Sizing', 'Preventive Maintenance', 'Emergency Support', 'Remote Monitoring'],
    image: '/images/ups-power-protection-system.png',
    gallery: ['/images/ups-power-protection-system.png', '/images/ups-battery-bank.png', '/images/ups-rack-mount.png', '/images/ups-control-panel.png'],
    color: 'from-purple-500 to-indigo-600',
    stats: { capacity: '500kVA', brands: '10+', uptime: '99.99%' },
    href: '/solutions/ups',
  },
  {
    id: 'hvac',
    title: 'HVAC & Air Conditioning',
    subtitle: 'Climate Control Excellence',
    description: 'Commercial and industrial HVAC solutions. Split systems, VRF, chillers, and precision cooling for data centers.',
    features: ['AC Installation', 'VRF Systems', 'Chillers', 'Maintenance Contracts', 'Refrigerant Services', 'Energy Optimization'],
    image: '/images/hvac-air-conditioning-unit.png',
    gallery: ['/images/hvac-air-conditioning-unit.png', '/images/hvac-commercial-system.png', '/images/hvac-industrial-cooling.png', '/images/hvac-vrf-system.png'],
    color: 'from-cyan-400 to-blue-500',
    stats: { tonnage: '1000+', efficiency: '40%', clients: '200+' },
    href: '/solutions/ac',
  },
  {
    id: 'motors',
    title: 'Motors & Rewinding',
    subtitle: 'Industrial Motor Experts',
    description: 'Electric motor rewinding, repair, and diagnostics. From 0.5HP to 500HP. VFD integration and preventive maintenance.',
    features: ['Motor Rewinding', 'Diagnostics & Testing', 'VFD Installation', 'Bearing Replacement', 'Balancing', 'Preventive Maintenance'],
    image: '/images/motor-rewinding-workshop.png',
    gallery: ['/images/motor-rewinding-workshop.png', '/images/electric-motor-repair.png', '/images/motor-diagnostics-testing.png', '/images/Multimeter.png'],
    color: 'from-orange-500 to-red-500',
    stats: { motors: '1000+', turnaround: '48hr', warranty: '1yr' },
    href: '/solutions/motor-rewinding',
  },
  {
    id: 'water',
    title: 'Borehole & Water Systems',
    subtitle: 'Water Solutions for Africa',
    description: 'Borehole drilling, pump installation, VFD systems, and water treatment. Solar-powered and grid solutions.',
    features: ['Pump Installation', 'VFD Systems', 'Solar Pumping', 'Water Treatment', 'Tank Installation', 'Maintenance'],
    image: '/images/borehole-pump-installation.png',
    gallery: ['/images/borehole-pump-installation.png', '/images/water-pump-system.png', '/images/solar-water-pumping.png', '/images/water-treatment-plant.png'],
    color: 'from-blue-400 to-cyan-500',
    stats: { boreholes: '200+', depth: '500m', flow: '200m³/hr' },
    href: '/solutions/borehole-pumps',
  },
  {
    id: 'highvoltage',
    title: 'High Voltage Infrastructure',
    subtitle: 'Power Distribution Excellence',
    description: 'Transformer installation, switchgear, power factor correction, and high voltage infrastructure for industrial clients.',
    features: ['Transformer Installation', 'Switchgear', 'Power Factor Correction', 'Cable Termination', 'Protection Systems', 'Testing'],
    image: '/images/high-voltage-transformer.png',
    gallery: ['/images/high-voltage-transformer.png', '/images/switchgear-panel.png', '/images/power-distribution-board.png', '/images/7320-1920x1080.png'],
    color: 'from-red-500 to-rose-600',
    stats: { voltage: '33kV', projects: '100+', safety: '100%' },
    href: '/solutions/power-interruptions',
  },
  {
    id: 'fabrication',
    title: 'Steel & Fabrication',
    subtitle: 'Precision Engineering',
    description: 'Custom fabrication for generator canopies, control panels, structural steel, and industrial equipment enclosures.',
    features: ['Generator Canopies', 'Control Panels', 'Fuel Tanks', 'Structural Steel', 'Custom Enclosures', 'Powder Coating'],
    image: '/images/steel-fabrication-workshop.png',
    gallery: ['/images/steel-fabrication-workshop.png', '/images/generator-canopy-fabrication.png', '/images/custom-control-panel.png', '/images/structural-steel-work.png'],
    color: 'from-slate-400 to-zinc-600',
    stats: { capacity: '50T/mo', precision: '±1mm', coating: 'Yes' },
    href: '/fabrication',
  },
  {
    id: 'incinerators',
    title: 'Incinerators',
    subtitle: 'Waste Management Solutions',
    description: 'Medical, industrial, and general waste incinerators. NEMA compliant with emission controls and monitoring.',
    features: ['Medical Waste', 'Industrial Waste', 'Installation', 'NEMA Compliance', 'Emission Control', 'Maintenance'],
    image: '/images/medical-waste-incinerator.png',
    gallery: ['/images/medical-waste-incinerator.png', '/images/industrial-incinerator.png', '/images/incinerator-emission-control.png', '/images/waste-management-system.png'],
    color: 'from-emerald-500 to-green-600',
    stats: { capacity: '500kg/hr', temp: '1200°C', compliance: 'NEMA' },
    href: '/solutions/incinerators',
  },
];

// Cinematic Service Card Component
function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [activeImage, setActiveImage] = useState(0);
  const isEven = index % 2 === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="relative min-h-screen flex items-center py-20 overflow-hidden"
    >
      {/* Cinematic Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5`} />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
          
          {/* Image Section - Cinematic Treatment */}
          <motion.div 
            className={`relative ${!isEven ? 'lg:order-2' : ''}`}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              {/* Glowing Border Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${service.color} rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500`} />
              
              {/* Main Image with AnimatePresence for smooth transitions */}
              <div className="relative h-full rounded-2xl overflow-hidden border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={service.gallery[activeImage]}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-10`} />
                
                {/* Film Grain Effect - subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-gradient-to-br from-white/5 to-transparent" />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-end">
                    {Object.entries(service.stats).map(([key, value]) => (
                      <motion.div 
                        key={key} 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent drop-shadow-lg`}>
                          {value}
                        </div>
                        <div className="text-xs text-white/70 uppercase tracking-wider mt-1 font-medium">
                          {key}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-gradient-to-r ${service.color.includes('amber') ? 'border-amber-500' : service.color.includes('yellow') ? 'border-yellow-400' : service.color.includes('purple') ? 'border-purple-500' : service.color.includes('cyan') ? 'border-cyan-400' : service.color.includes('orange') ? 'border-orange-500' : service.color.includes('blue') ? 'border-blue-400' : service.color.includes('red') ? 'border-red-500' : service.color.includes('slate') ? 'border-slate-400' : 'border-emerald-500'} opacity-50`} />
              </div>
            </div>

            {/* Gallery Thumbnails with Active Indicator */}
            <div className="flex gap-3 mt-4 justify-center lg:justify-start">
              {service.gallery.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    activeImage === i 
                      ? 'ring-2 ring-offset-2 ring-offset-black shadow-lg' 
                      : 'border border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    // @ts-ignore
                    '--tw-ring-color': activeImage === i ? (
                      service.color.includes('amber') ? '#f59e0b' : 
                      service.color.includes('yellow') ? '#facc15' : 
                      service.color.includes('purple') ? '#a855f7' : 
                      service.color.includes('cyan') ? '#22d3ee' : 
                      service.color.includes('orange') ? '#f97316' : 
                      service.color.includes('blue') ? '#60a5fa' : 
                      service.color.includes('red') ? '#ef4444' : 
                      service.color.includes('slate') ? '#94a3b8' : '#10b981'
                    ) : 'transparent'
                  }}
                >
                  <Image 
                    src={img} 
                    alt={`${service.title} ${i + 1}`} 
                    fill 
                    className="object-cover" 
                    sizes="80px" 
                  />
                  {activeImage === i && (
                    <motion.div 
                      layoutId={`indicator-${service.id}`}
                      className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-20`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className={`space-y-8 ${!isEven ? 'lg:order-1' : ''}`}
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Service Number Badge */}
            <div className="inline-flex items-center gap-3">
              <span className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${service.color} bg-clip-text text-transparent opacity-20 select-none`}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="-mt-20 relative">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {service.title}
              </motion.h2>
              <motion.p 
                className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {service.subtitle}
              </motion.p>
            </div>

            {/* Description */}
            <motion.p 
              className="text-gray-400 text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {service.description}
            </motion.p>

            {/* Features Grid with Icons */}
            <div className="grid grid-cols-2 gap-3">
              {service.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 text-gray-300 group"
                >
                  <span className={`w-8 h-8 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href={service.href}>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2`}
                >
                  Explore Solutions
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </Link>
              <Link href="/contact?type=quote">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                >
                  Get Quote
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </motion.section>
  );
}

// Hero Section
function ServicesHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-black to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15),transparent_70%)]" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </motion.div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }} />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            9 Premium Service Categories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          Our{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Services
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Comprehensive power and infrastructure solutions for Kenya&apos;s leading businesses. 
          From generators to solar, UPS to HVAC — we deliver excellence.
        </motion.p>

        {/* Service Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {SERVICES.map((service, i) => (
            <motion.a
              key={service.id}
              href={`#${service.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm`}
            >
              {service.title}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-white/50 rounded-full" 
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Quick Contact CTA
function QuickContactCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600" />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Animated Background Pattern */}
      <motion.div 
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Ready to Transform Your 
            <br />
            <span className="text-white/90">Power Infrastructure?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get a free consultation and quote for any of our services. Our experts are ready to help 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-gray-900 font-bold rounded-xl text-lg shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                Contact Us Today
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
            <a href="tel:+254768860665">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-white text-white font-bold rounded-xl text-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 768 860 665
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Trust Badges Section
function TrustBadges() {
  const badges = [
    { icon: '🏆', label: 'Award Winning', value: 'ISO Certified' },
    { icon: '⚡', label: 'Fast Response', value: '2hr Emergency' },
    { icon: '🔧', label: 'Expert Team', value: '50+ Engineers' },
    { icon: '🌍', label: 'Coverage', value: 'All Kenya' },
  ];

  return (
    <section className="py-16 border-y border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <span className="text-4xl mb-3 block">{badge.icon}</span>
              <div className="text-white font-bold text-lg">{badge.value}</div>
              <div className="text-gray-500 text-sm">{badge.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PremiumServicesPage() {
  return (
    <main className="bg-black min-h-screen">
      <ServicesHero />
      <TrustBadges />
      
      {/* Service Sections */}
      <div className="relative">
        {SERVICES.map((service, index) => (
          <div key={service.id} id={service.id}>
            <ServiceCard service={service} index={index} />
          </div>
        ))}
      </div>

      <QuickContactCTA />
    </main>
  );
}
