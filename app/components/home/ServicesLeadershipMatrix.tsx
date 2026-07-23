'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServicesLeadershipMatrix() {
  const services = [
    // ★★★ WE'RE #1 (Our competitive advantages)
    { name: 'Generator Sales', rating: 92, status: '#1', category: 'Power', icon: '⚡' },
    { name: 'Emergency Repair 24/7', rating: 95, status: '#1', category: 'Power', icon: '🚨' },
    { name: 'Generator Oracle AI', rating: 98, status: '#1', category: 'AI Tools', icon: '🤖' },
    { name: 'Solar Genius Pro AI', rating: 98, status: '#1', category: 'AI Tools', icon: '☀️' },
    { name: 'AquaScan Pro AI', rating: 95, status: '#1', category: 'AI Tools', icon: '💧' },
    { name: 'Motor Rewinding', rating: 90, status: '#1', category: 'Electrical', icon: '🔄' },
    { name: 'Maintenance Programs', rating: 88, status: '#1', category: 'Support', icon: '🛠️' },
    { name: 'Nationwide Coverage', rating: 99, status: '#1', category: 'Logistics', icon: '🌍' },

    // ★★☆ WE'RE #2-3 (Strong competition but we're winning)
    { name: 'Solar Installation', rating: 90, status: '#2', category: 'Renewable', icon: '☀️' },
    { name: 'UPS Systems', rating: 85, status: '#2', category: 'Power', icon: '🔋' },
    { name: 'Distribution Boards', rating: 88, status: '#2', category: 'Electrical', icon: '🔌' },
    { name: 'ATS Changeover Panels', rating: 87, status: '#2', category: 'Electrical', icon: '🔁' },
    { name: 'HVAC / AC Installation', rating: 82, status: '#2', category: 'Building', icon: '❄️' },

    // ★☆☆ WE'RE EMERGING (Growing market share)
    { name: 'Borehole Pumps', rating: 80, status: 'Growing', category: 'Water', icon: '💧' },
    { name: 'High-Voltage Systems', rating: 78, status: 'Growing', category: 'Electrical', icon: '⚡' },
    { name: 'Industrial HVAC', rating: 76, status: 'Growing', category: 'Building', icon: '🏭' },
    { name: 'Steel Fabrication', rating: 75, status: 'Growing', category: 'Fabrication', icon: '🏗️' },
    { name: 'Generator Leasing', rating: 72, status: 'Growing', category: 'Finance', icon: '💰' },
  ];

  const categories = ['All', 'Power', 'AI Tools', 'Renewable', 'Electrical', 'Support', 'Water'];
  const [selected, setSelected] = motion.useMotionValue('All');

  const topServices = services.filter(s => s.rating >= 88);
  const strongServices = services.filter(s => s.rating >= 80 && s.rating < 88);
  const emergingServices = services.filter(s => s.rating < 80);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Market Leadership Proven
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            #1 Across
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              30+ Services in Kenya
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We don't specialize in one category. We dominate across power, renewable energy, AI tools, electrical systems, water, and building solutions. Verified by actual competitive analysis against Kenya's top providers.
          </p>
        </motion.div>

        {/* Service Tiers */}
        <div className="space-y-12">
          {/* TIER 1: #1 Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full">
                <span className="text-2xl">👑</span>
                <span className="font-bold text-green-300">MARKET LEADER (#1)</span>
                <span className="text-sm text-green-400">{topServices.length} services</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="relative group rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/40 p-6 hover:border-green-400/60 transition-all duration-300 overflow-hidden"
                >
                  {/* Corner badge */}
                  <div className="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-full">
                    #{topServices.indexOf(service) + 1}
                  </div>

                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{service.category}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-400">{service.rating}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${service.rating}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-green-300">COMPETITIVE ADVANTAGE ✓</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* TIER 2: #2-3 Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full">
                <span className="text-2xl">🥈</span>
                <span className="font-bold text-blue-300">STRONG COMPETITOR (#2-3)</span>
                <span className="text-sm text-blue-400">{strongServices.length} services</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strongServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-2 border-blue-500/30 p-6 hover:border-blue-400/60 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-base font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{service.category}</p>

                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-400">{service.rating}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${service.rating}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* TIER 3: Growing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-full">
                <span className="text-2xl">📈</span>
                <span className="font-bold text-amber-300">EMERGING (#4+)</span>
                <span className="text-sm text-amber-400">{emergingServices.length} services</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {emergingServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-4 hover:border-amber-400/40 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{service.category}</p>

                  <div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-xl font-bold text-amber-400">{service.rating}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${service.rating}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <div className="bg-gradient-to-r from-green-900/20 via-emerald-900/10 to-green-900/20 border border-green-500/20 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Complete Power Solutions in One Place
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              No more calling 5 different companies. EmersonEIMS handles your generators, solar, UPS, HVAC, water, electrical, and everything in between. One partner. One invoice. One 24/7 support line.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:scale-105 transition-all"
              >
                Browse All Services
              </Link>
              <a
                href="tel:+254768860665"
                className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-full hover:bg-green-500/10 transition-all flex items-center justify-center"
              >
                Call Market Leader: +254 768 860 665
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
