'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Fabrication services
const fabricationServices = [
  {
    title: 'Generator Canopies',
    icon: '🏠',
    description: 'Custom soundproof and weatherproof enclosures',
    features: [
      'Soundproof design (85dB reduction)',
      'Weatherproof galvanized steel',
      'Ventilation and cooling',
      'Access doors and panels',
      'Fire-resistant materials',
      'NEMA noise compliance',
      'Custom sizes available'
    ],
    applications: ['Residential', 'Commercial', 'Industrial', 'Hospital'],
    pricing: 'From KSh 80,000'
  },
  {
    title: 'Exhaust Systems',
    icon: '💨',
    description: 'Complete exhaust and silencer fabrication',
    features: [
      'Industrial silencers',
      'Flexible exhaust pipes',
      'Stainless steel construction',
      'Spark arrestors',
      'Rain caps',
      'Custom bends and fittings',
      'Heat shielding'
    ],
    applications: ['Generators', 'Boilers', 'Incinerators', 'Engines'],
    pricing: 'From KSh 25,000'
  },
  {
    title: 'Fuel Reserve Tanks',
    icon: '⛽',
    description: 'Custom fuel storage solutions',
    features: [
      'Mild steel or stainless steel',
      '500L to 10,000L capacity',
      'Double-walled options',
      'Level gauges and sensors',
      'Lockable fill points',
      'Overflow protection',
      'NEMA environmental compliance'
    ],
    applications: ['Generators', 'Backup systems', 'Industrial'],
    pricing: 'From KSh 60,000'
  },
  {
    title: 'Control Panel Enclosures',
    icon: '⚡',
    description: 'Custom electrical enclosures',
    features: [
      'IP54/IP65 rated',
      'Wall-mounted or floor-standing',
      'Cable entry points',
      'Ventilation and cooling',
      'Lockable doors',
      'DIN rail mounting',
      'Powder-coated finish'
    ],
    applications: ['Generators', 'Solar', 'Industrial control'],
    pricing: 'From KSh 35,000'
  },
  {
    title: 'Generator Automation',
    icon: '🤖',
    description: 'Auto-start and monitoring systems',
    features: [
      'Auto-start on mains failure',
      'Auto-transfer switching',
      'Remote monitoring setup',
      'GSM/SMS alerts',
      'Mobile app integration',
      'Fuel level monitoring',
      'Temperature sensors'
    ],
    applications: ['Commercial', 'Industrial', 'Data centers'],
    pricing: 'From KSh 120,000'
  },
  {
    title: 'Structural Steelwork',
    icon: '🏗️',
    description: 'Generator bases and platforms',
    features: [
      'Anti-vibration mounts',
      'Raised platforms',
      'Roof-top installations',
      'Steel frames and bases',
      'Hot-dip galvanizing',
      'Load calculations',
      'Engineering certification'
    ],
    applications: ['Rooftop', 'Outdoor', 'Industrial'],
    pricing: 'From KSh 50,000'
  }
];

export default function FabricationPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Cinematic Hero Section with Hollywood Color Grading */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Background Image with Cinematic Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/brand/IMG_20200904_141639_5.jpg"
            alt="Steel Fabrication Workshop"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Hollywood Cinematic Color Grading Overlays */}
          {/* Teal/Orange Color Grade - Industrial Steel Theme */}
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 60, 80, 0.3) 0%, rgba(255, 140, 50, 0.25) 100%)' }} />

          {/* Deep Contrast Enhancement */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />

          {/* Blue Shadow Tint - Industrial Cinematic Shadows */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(10, 20, 35, 0.5) 0%, rgba(30, 20, 10, 0.4) 100%)' }} />

          {/* Warm Highlight Push - Welding Glow Feel */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255, 150, 50, 0.3) 0%, transparent 60%)' }} />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Cinematic Letterbox Gradient - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

          {/* Cinematic Letterbox Gradient - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        {/* Animated Forge Glow Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(255, 120, 50, 0.15) 50%, transparent 60%)' }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-5xl"
          >
            {/* Cinematic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Custom Steel Fabrication</span>
            </motion.div>

            {/* Main Title with Cinematic Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Generator Fabrication
              </span>
              <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Kenya
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Canopies • Exhaust Systems • Fuel Tanks • Automation • Structural Work
            </motion.p>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-lg px-6 py-3">
                <span className="text-amber-400 font-semibold">✓ Custom Design</span>
              </div>
              <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg px-6 py-3">
                <span className="text-green-400 font-semibold">✓ NEMA Compliant</span>
              </div>
              <div className="bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-6 py-3">
                <span className="text-cyan-400 font-semibold">✓ Fast Turnaround</span>
              </div>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Anamorphic Lens Flare */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-sm" />
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Fabrication Services
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
            From concept to installation - complete custom fabrication for generator systems
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fabricationServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/20 transition-all"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-amber-400">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, 5).map(feature => (
                      <li key={feature} className="text-sm text-gray-400 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Applications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.applications.map(app => (
                      <span key={app} className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-300">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="text-lg font-bold text-amber-400">{service.pricing}</div>
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all"
                  >
                    Get Quote
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Fabrication */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Choose EmersonEIMS Fabrication?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: 'Custom Design', desc: 'Tailored to your exact requirements' },
              { icon: '🏭', title: 'In-House Shop', desc: 'Full fabrication workshop in Nairobi' },
              { icon: '⚙️', title: 'Quality Materials', desc: 'Galvanized steel, stainless steel, powder coating' },
              { icon: '✓', title: 'NEMA Certified', desc: 'Environmental and noise compliance' },
              { icon: '⚡', title: 'Fast Turnaround', desc: 'Most projects in 5-10 days' },
              { icon: '🛡️', title: 'Warranty', desc: '12 months on all fabrication' },
              { icon: '🚚', title: 'Installation', desc: 'Complete installation service' },
              { icon: '💰', title: 'Competitive', desc: 'Best rates in Kenya' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-amber-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Our Process
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Consultation', desc: 'Discuss requirements, take measurements, provide recommendations' },
              { step: '2', title: 'Design & Quote', desc: 'CAD drawings, material selection, detailed quotation within 48 hours' },
              { step: '3', title: 'Approval', desc: 'Review and approve design, 50% deposit to commence fabrication' },
              { step: '4', title: 'Fabrication', desc: 'Precision cutting, welding, finishing in our workshop (5-10 days)' },
              { step: '5', title: 'Quality Check', desc: 'Inspection, testing, powder coating or galvanizing' },
              { step: '6', title: 'Installation', desc: 'Delivery and professional installation at your site' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                  {process.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-amber-400">{process.title}</h3>
                  <p className="text-gray-400">{process.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Serving All Kenya
          </motion.h2>
          <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
            Workshop in Nairobi with nationwide delivery and installation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', '+ 41 Counties'].map(area => (
              <span key={area} className="bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-lg text-amber-400 font-semibold">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Free site visit and consultation. CAD drawings and quote within 48 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254768860665"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                📞 Call Fabrication Shop
              </a>
              <a
                href="https://wa.me/254768860665"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                💬 WhatsApp Quote
              </a>
              <Link
                href="/contact"
                className="bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                📧 Email Requirements
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
