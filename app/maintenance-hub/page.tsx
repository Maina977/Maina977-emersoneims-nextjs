'use client';

/**
 * Maintenance Hub - Main Landing Page
 * Central hub for all maintenance services
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnalogClock, AnalogCalendar, WeatherWidget, FloatingWidgetPanel } from '@/components/ui/AnalogWidgets';

const SERVICES = [
  {
    id: 'generator',
    name: 'Generator Oracle',
    icon: '🔌',
    description: '90,000+ fault codes for DeepSea, ComAp, Woodward, SmartGen & CAT controllers. Instant diagnostics with step-by-step repair guides.',
    href: '/generator-oracle',
    color: 'from-blue-600 to-indigo-700',
    features: ['90,000+ Fault Codes', 'Controller Simulators', 'Wiring Diagrams', 'Offline Mode'],
    stats: { value: '90K+', label: 'Fault Codes' }
  },
  {
    id: 'solar',
    name: 'Solar Maintenance',
    icon: '☀️',
    description: 'Complete solar system diagnostics and maintenance. Panel cleaning, battery service, inverter repair with weather-integrated recommendations.',
    href: '/solar',
    color: 'from-amber-500 to-orange-600',
    features: ['System Calculator', 'Weather Integration', 'Fault Diagnostics', 'Maintenance Schedule'],
    stats: { value: '6', label: 'System Types' }
  },
  {
    id: 'general',
    name: 'General Services',
    icon: '🔧',
    description: 'Borehole pumps, motor rewinding, AC installation, electrical services, welding, and plumbing. 24/7 professional support.',
    href: '/services',
    color: 'from-green-500 to-emerald-600',
    features: ['Pump Repair', 'Motor Rewinding', 'AC Service', 'Electrical Work'],
    stats: { value: '6', label: 'Service Categories' }
  },
  {
    id: 'parts',
    name: 'Spare Parts',
    icon: '🛒',
    description: 'Over 1,560+ genuine spare parts for generators, solar systems, pumps, and electrical equipment. Fast delivery across Kenya.',
    href: '/spare-parts',
    color: 'from-purple-500 to-violet-600',
    features: ['1,560+ Parts', 'Genuine Quality', 'Fast Delivery', 'All Brands'],
    stats: { value: '1,560+', label: 'Parts Available' }
  }
];

const TESTIMONIALS = [
  {
    quote: "Generator Oracle saved us 3 hours of troubleshooting. Found the exact fault code and fix in seconds!",
    author: "James M.",
    role: "Chief Engineer, Safari Lodge",
    location: "Masai Mara"
  },
  {
    quote: "The best motor rewinding service in Kenya. Our pump has been running perfectly for 2 years now.",
    author: "Sarah K.",
    role: "Farm Manager",
    location: "Nakuru"
  },
  {
    quote: "Their solar maintenance team optimized our system and increased production by 25%.",
    author: "Peter O.",
    role: "Factory Owner",
    location: "Industrial Area, Nairobi"
  }
];

export default function MaintenanceHubPage() {
  const [selectedLocation, setSelectedLocation] = useState('nairobi');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Floating Widget Panel */}
      <FloatingWidgetPanel location={selectedLocation} position="top-right" />

      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Maintenance Hub</h1>
                <p className="text-slate-400 text-sm">Professional maintenance services across Kenya</p>
              </div>
            </div>

            {/* Location Selector */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-slate-400 text-sm">📍</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
              >
                {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi'].map(loc => (
                  <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Complete Maintenance Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            From generators to solar systems, pumps to electrical work - everything your facility needs in one place.
          </motion.p>
        </div>

        {/* Time & Weather Display (Mobile) */}
        <div className="lg:hidden flex justify-center gap-3 mb-8 flex-wrap">
          <AnalogClock size={80} />
          <AnalogCalendar />
          <WeatherWidget location={selectedLocation} />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={service.href}>
                <div className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl mb-2">{service.icon}</div>
                      <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white/90">{service.stats.value}</div>
                      <div className="text-white/70 text-sm">{service.stats.label}</div>
                    </div>
                  </div>
                  <p className="text-white/80 mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, j) => (
                      <span key={j} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Why Choose Emerson EiMS?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: '24/7 Support', desc: 'Emergency services available round the clock' },
              { icon: '🎯', title: 'Expert Technicians', desc: 'Certified professionals with years of experience' },
              { icon: '🛡️', title: 'Quality Guaranteed', desc: 'All work backed by our service warranty' },
              { icon: '📍', title: 'Kenya-Wide', desc: 'Service coverage across all major towns' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-bold text-white mb-1">{item.title}</div>
                <div className="text-slate-400 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">What Our Clients Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="text-amber-400 text-2xl mb-3">"</div>
                <p className="text-slate-300 mb-4">{testimonial.quote}</p>
                <div className="border-t border-slate-700 pt-4">
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  <div className="text-slate-500 text-sm">📍 {testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Get Started?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Contact us today for a free consultation. Our experts are ready to help with all your maintenance needs.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:+254782914717"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-bold transition-colors"
            >
              📞 Call: 0782 914 717
            </a>
            <a
              href="https://wa.me/254782914717"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Emerson EiMS</h4>
              <p className="text-slate-400 text-sm">
                Professional industrial maintenance services across Kenya and East Africa.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/generator-oracle" className="text-slate-400 hover:text-amber-400">Generator Oracle</Link></li>
                <li><Link href="/maintenance-hub/solar" className="text-slate-400 hover:text-amber-400">Solar Maintenance</Link></li>
                <li><Link href="/maintenance-hub/general" className="text-slate-400 hover:text-amber-400">General Services</Link></li>
                <li><Link href="/spare-parts" className="text-slate-400 hover:text-amber-400">Spare Parts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📞 0782 914 717</li>
                <li>📞 0768 860 665</li>
                <li>📧 info@emersoneims.com</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Banking</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Equity Bank</li>
                <li>Embakasi Branch</li>
                <li>A/C: 1320285133753</li>
                <li>Emerson Industrial Maintenance Services Ltd</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
