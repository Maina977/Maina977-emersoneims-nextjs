'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// All generator services
const services = [
  {
    title: 'Generator Installation',
    icon: '🏗️',
    description: 'Professional installation from site survey to commissioning',
    features: [
      'Site survey and load assessment',
      'Civil works and foundation',
      'Electrical connections and wiring',
      'Fuel system installation',
      'Control panel setup',
      'Load testing and commissioning',
      'Staff training included'
    ],
    pricing: 'From KSh 50,000',
    timeline: '3-7 days',
    link: '/contact'
  },
  {
    title: 'Generator Repairs',
    icon: '🔧',
    description: '24/7 emergency repair service for all brands',
    features: [
      'Emergency call-out (2-hour response)',
      'All brands serviced',
      'Mobile repair units',
      'On-site diagnostics',
      'Genuine parts used',
      'Warranty on repairs',
      'Follow-up service included'
    ],
    pricing: 'From KSh 15,000',
    timeline: 'Same day',
    link: '/contact'
  },
  {
    title: 'Preventive Maintenance',
    icon: '📋',
    description: 'Scheduled maintenance to prevent breakdowns',
    features: [
      '250hr / 500hr / 1000hr servicing',
      'Oil and filter changes',
      'Belt and hose inspection',
      'Battery testing',
      'Coolant system service',
      'Load bank testing',
      'Detailed service reports'
    ],
    pricing: 'AMC from KSh 8,000/month',
    timeline: '2-4 hours',
    link: '/contact'
  },
  {
    title: 'Engine Overhauls',
    icon: '⚙️',
    description: 'Complete engine rebuild and refurbishment',
    features: [
      'Complete engine teardown',
      'Cylinder head machining',
      'Piston and ring replacement',
      'Bearing replacement',
      'Valve grinding',
      'Engine block inspection',
      '6-month warranty'
    ],
    pricing: 'From KSh 150,000',
    timeline: '2-4 weeks',
    link: '/contact'
  },
  {
    title: 'Generator Lease/Rental',
    icon: '🚛',
    description: 'Short-term and long-term generator hire',
    features: [
      '10kVA to 500kVA available',
      'Delivery and installation',
      'Fuel included (optional)',
      'Maintenance included',
      'Operator training',
      '24/7 technical support',
      'Flexible rental periods'
    ],
    pricing: 'From KSh 15,000/day',
    timeline: 'Same day delivery',
    link: '/contact'
  },
  {
    title: 'Control Panel Upgrades',
    icon: '⚡',
    description: 'Modernize your generator control systems',
    features: [
      'DeepSea controller installation',
      'PowerWizard upgrades',
      'Remote monitoring setup',
      'Auto-start systems',
      'Load sharing configuration',
      'Telemetry integration',
      'Mobile app control'
    ],
    pricing: 'From KSh 80,000',
    timeline: '1-2 days',
    link: '/solutions/controls'
  }
];

// Service coverage areas
const serviceAreas = [
  'Nairobi - 2hr response',
  'Mombasa - 4hr response',
  'Kisumu - 4hr response',
  'Nakuru - 3hr response',
  'Eldoret - 4hr response',
  'Thika - 2hr response',
  '+ 41 more counties'
];

export default function GeneratorServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="eims-shell relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
              Generator Services Kenya
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Installation • Repairs • Maintenance • Overhauls • Lease • 24/7 Emergency Support
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-3">
                <span className="text-green-400 font-semibold">✓ 24/7 Emergency</span>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-6 py-3">
                <span className="text-cyan-400 font-semibold">✓ All Brands</span>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-6 py-3">
                <span className="text-amber-400 font-semibold">✓ 47 Counties</span>
              </div>
            </div>
          </motion.div>
        </div>
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
            Complete Service Solutions
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
            From new installations to emergency repairs - we cover every aspect of generator service
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-cyan-400">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, 4).map(feature => (
                      <li key={feature} className="text-sm text-gray-400 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Starting from</div>
                    <div className="text-lg font-bold text-amber-400">{service.pricing}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Timeline</div>
                    <div className="text-sm font-semibold">{service.timeline}</div>
                  </div>
                </div>

                <Link
                  href={service.link}
                  className="block w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-center py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all"
                >
                  Request Service
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose EmersonEIMS */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Choose Us?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🏆', title: '15+ Years', desc: 'Industry experience since 2009' },
              { icon: '⚡', title: '24/7 Support', desc: 'Emergency response anytime' },
              { icon: '✓', title: 'All Brands', desc: 'Cummins, Perkins, CAT, Volvo, FG Wilson' },
              { icon: '🛡️', title: 'Warranty', desc: 'All work guaranteed' },
              { icon: '👨‍🔧', title: 'Certified', desc: 'Factory-trained technicians' },
              { icon: '📍', title: '47 Counties', desc: 'Nationwide coverage' },
              { icon: '💰', title: 'Best Rates', desc: 'Competitive pricing' },
              { icon: '📊', title: 'Reports', desc: 'Detailed service documentation' }
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
                <h3 className="text-xl font-bold mb-2 text-cyan-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Maintenance Contracts (AMC) */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Annual Maintenance Contracts
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
            Protect your investment with proactive maintenance. Reduce breakdowns by 90%.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Basic AMC',
                price: 'KSh 8,000/month',
                features: [
                  'Quarterly servicing (4x per year)',
                  'Oil and filter changes',
                  'Visual inspections',
                  'Battery testing',
                  'Service reports',
                  'Priority support'
                ]
              },
              {
                name: 'Premium AMC',
                price: 'KSh 15,000/month',
                features: [
                  'Monthly servicing (12x per year)',
                  'All consumables included',
                  'Load bank testing',
                  'Coolant system service',
                  '24/7 emergency call-out',
                  'Spare parts discount (20%)'
                ],
                recommended: true
              },
              {
                name: 'Enterprise AMC',
                price: 'Custom quote',
                features: [
                  'Dedicated technician',
                  'On-site spare parts stock',
                  'Remote monitoring',
                  'Predictive maintenance',
                  'SLA guarantees',
                  'Priority parts supply'
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br from-gray-900 to-black border-2 rounded-2xl p-8 ${
                  plan.recommended
                    ? 'border-amber-500/40 shadow-2xl shadow-amber-500/20 scale-105'
                    : 'border-cyan-500/20'
                }`}
              >
                {plan.recommended && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-center py-2 px-4 rounded-lg font-bold mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-cyan-400">{plan.name}</h3>
                <div className="text-3xl font-bold mb-6 text-white">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start text-gray-300">
                      <span className="text-green-400 mr-2 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-600 hover:to-amber-700'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            We Service All 47 Kenya Counties
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {serviceAreas.map(area => (
              <span key={area} className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-lg text-cyan-400 font-semibold">
                {area}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Emergency response available 24/7. Average response time: 2-4 hours in major cities.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-cyan-500/10 to-amber-500/10 border-2 border-cyan-500/30 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Need Generator Service Now?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              24/7 emergency support. Free quotes. Same-day service in Nairobi.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254768860665"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all animate-pulse"
              >
                🚨 Emergency: Call Now
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
                📧 Schedule Service
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
