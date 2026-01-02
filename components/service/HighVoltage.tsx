'use client';

import { motion } from 'framer-motion';

type HighVoltageProps = {
  performanceTier?: string;
};

const hvServices = [
  {
    title: '11kV/33kV Infrastructure',
    description: 'Complete high voltage distribution network design and installation',
    features: ['Substation construction', 'Transformer installation', 'Switchgear commissioning', 'Protection relay setup'],
    icon: '⚡',
  },
  {
    title: 'Power Line Installation',
    description: 'Overhead and underground HV cable installation services',
    features: ['Overhead line construction', 'Underground cable laying', 'Jointing & termination', 'Route surveys'],
    icon: '🔌',
  },
  {
    title: 'Testing & Commissioning',
    description: 'Comprehensive HV equipment testing and system commissioning',
    features: ['Insulation resistance testing', 'Hi-pot testing', 'Protection coordination', 'SCADA integration'],
    icon: '📊',
  },
  {
    title: 'Maintenance & Repairs',
    description: 'Preventive and corrective maintenance for HV systems',
    features: ['Transformer oil analysis', 'Circuit breaker servicing', 'Busbar maintenance', 'Emergency repairs'],
    icon: '🛠️',
  },
];

const safetyFeatures = [
  { icon: '🛡️', title: 'Arc Flash Analysis', desc: 'Complete arc flash studies per IEEE 1584' },
  { icon: '📋', title: 'Safety Compliance', desc: 'KEBS and IEC standards compliant' },
  { icon: '👷', title: 'Trained Personnel', desc: 'Certified HV switching operators' },
  { icon: '🚨', title: '24/7 Emergency', desc: 'Round-the-clock emergency response' },
];

export default function HighVoltage({ performanceTier }: HighVoltageProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-800 via-red-950/20 to-slate-900" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(239,68,68,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
            HIGH VOLTAGE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            High Voltage <span className="text-red-400">Infrastructure</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Expert 11kV/33kV electrical infrastructure services. From substations to distribution networks — 
            powering Kenya&apos;s industrial growth with safety-first engineering.
          </p>
        </motion.div>

        {/* Safety Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-red-500/20 text-center hover:border-red-500/50 transition-colors">
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <div className="text-white font-semibold mb-1">{feature.title}</div>
              <div className="text-slate-400 text-sm">{feature.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-16"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h3 className="text-red-400 font-bold text-lg">High Voltage Warning</h3>
              <p className="text-slate-300">All HV work is performed by certified engineers with proper permits and KPLC coordination. Safety is our top priority.</p>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hvServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    </section>
  );
}