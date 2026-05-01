'use client';

import { motion } from 'framer-motion';

type UPSSystemsProps = {
  performanceTier?: string;
};

const upsServices = [
  {
    title: 'Online UPS Systems',
    description: 'Double-conversion UPS for critical loads requiring zero transfer time',
    features: ['Data centers & servers', 'Medical equipment', 'Banking systems', 'Telecom infrastructure'],
    icon: '🔋',
    capacity: '1 kVA - 800 kVA',
  },
  {
    title: 'Line-Interactive UPS',
    description: 'Cost-effective protection with automatic voltage regulation',
    features: ['Office equipment', 'POS systems', 'Networking equipment', 'Security systems'],
    icon: '💡',
    capacity: '600 VA - 10 kVA',
  },
  {
    title: 'Modular UPS Solutions',
    description: 'Scalable N+X redundancy for growing power requirements',
    features: ['Hot-swappable modules', 'Parallel redundancy', 'Easy capacity upgrades', 'Remote monitoring'],
    icon: '🧱',
    capacity: '10 kVA - 2 MVA',
  },
  {
    title: 'Battery Services',
    description: 'Complete battery lifecycle management and replacement',
    features: ['Battery testing', 'Capacity testing', 'Battery replacement', 'Disposal & recycling'],
    icon: '🔌',
    capacity: 'All Brands',
  },
];

const brands = ['APC', 'Eaton', 'Vertiv/Emerson', 'Schneider', 'Riello', 'Delta'];

export default function UPSSystems({ performanceTier }: UPSSystemsProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-800" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_50%)]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
            POWER PROTECTION
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            UPS <span className="text-emerald-400">Systems</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Uninterruptible Power Supply solutions for mission-critical applications. 
            From small offices to large data centers — we keep your systems running.
          </p>
        </motion.div>

        {/* Brands Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {brands.map((brand, index) => (
            <span key={index} className="px-6 py-3 bg-white/5 border border-emerald-500/20 rounded-full text-slate-300 font-medium hover:border-emerald-500/50 transition-colors">
              {brand}
            </span>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upsServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {service.capacity}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Free UPS Health Check</h3>
            <p className="text-slate-300 mb-6">Schedule a free assessment of your current UPS systems and get expert recommendations.</p>
            <a href="/contact?type=ups-assessment" className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
              Schedule Assessment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}