'use client';

import { motion } from 'framer-motion';

type WaterSystemsProps = {
  performanceTier?: string;
};

const waterServices = [
  {
    title: 'Borehole Drilling & Equipping',
    description: 'Complete borehole solutions from survey to commissioning',
    features: ['Hydrogeological surveys', 'Rotary & percussion drilling', 'Pump installation', 'Water quality testing'],
    icon: '🕳️',
  },
  {
    title: 'Water Treatment Systems',
    description: 'Purification solutions for safe drinking water',
    features: ['Reverse osmosis (RO)', 'UV sterilization', 'Iron & manganese removal', 'Softening systems'],
    icon: '💧',
  },
  {
    title: 'Pumping Systems',
    description: 'Efficient water pumping solutions for all applications',
    features: ['Submersible pumps', 'Surface pumps', 'Booster systems', 'Solar water pumping'],
    icon: '⬆️',
  },
  {
    title: 'Storage & Distribution',
    description: 'Water storage and distribution infrastructure',
    features: ['Elevated tanks', 'Ground reservoirs', 'Piping networks', 'Pressure management'],
    icon: '🏗️',
  },
];

const applications = [
  { icon: '🏨', title: 'Hotels & Resorts', desc: 'Complete water solutions' },
  { icon: '🏭', title: 'Industrial', desc: 'Process water systems' },
  { icon: '🌾', title: 'Agriculture', desc: 'Irrigation systems' },
  { icon: '🏠', title: 'Residential', desc: 'Home water systems' },
];

export default function WaterSystems({ performanceTier }: WaterSystemsProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-800 via-cyan-950/20 to-slate-900" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
            WATER SOLUTIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Water <span className="text-cyan-400">Systems</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Complete water solutions from source to tap. Borehole drilling, treatment, pumping, 
            and distribution systems for all applications.
          </p>
        </motion.div>

        {/* Applications Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {applications.map((app, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20 text-center hover:border-cyan-500/50 transition-colors">
              <span className="text-3xl mb-3 block">{app.icon}</span>
              <div className="text-white font-semibold mb-1">{app.title}</div>
              <div className="text-slate-400 text-sm">{app.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {waterServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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