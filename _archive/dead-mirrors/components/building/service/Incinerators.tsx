'use client';

import { motion } from 'framer-motion';

type IncineratorsProps = {
  performanceTier?: string;
};

const incineratorServices = [
  {
    title: 'Medical Waste Incinerators',
    description: 'Safe disposal of infectious and hazardous medical waste',
    features: ['Hospital waste', 'Laboratory waste', 'Pharmaceutical waste', 'NEMA compliant'],
    icon: '🏥',
  },
  {
    title: 'Industrial Incinerators',
    description: 'High-capacity systems for industrial waste management',
    features: ['Chemical waste', 'Packaging waste', 'Production waste', 'Heat recovery options'],
    icon: '🏭',
  },
  {
    title: 'Agricultural Incinerators',
    description: 'Farm and agricultural waste disposal solutions',
    features: ['Animal carcasses', 'Crop residue', 'Veterinary waste', 'Rural installations'],
    icon: '🌾',
  },
  {
    title: 'Maintenance & Compliance',
    description: 'Ongoing support and regulatory compliance services',
    features: ['Emission testing', 'Refractory repairs', 'Burner servicing', 'NEMA audits'],
    icon: '📋',
  },
];

const compliance = [
  { icon: '✅', title: 'NEMA Licensed', desc: 'Environmental compliance certified' },
  { icon: '🌍', title: 'Eco-Friendly', desc: 'Emission control systems' },
  { icon: '📊', title: 'Monitoring', desc: 'Real-time emission tracking' },
  { icon: '📜', title: 'Documentation', desc: 'Complete audit trails' },
];

export default function Incinerators({ performanceTier }: IncineratorsProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-800 via-rose-950/20 to-slate-900" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(244,63,94,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-sm font-medium mb-4">
            WASTE MANAGEMENT
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Incinerator <span className="text-rose-400">Systems</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Environmentally responsible waste incineration solutions. NEMA-compliant systems 
            for medical, industrial, and agricultural waste disposal.
          </p>
        </motion.div>

        {/* Compliance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {compliance.map((item, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-rose-500/20 text-center hover:border-rose-500/50 transition-colors">
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <div className="text-white font-semibold mb-1">{item.title}</div>
              <div className="text-slate-400 text-sm">{item.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {incineratorServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-rose-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-rose-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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