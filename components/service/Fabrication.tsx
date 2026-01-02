'use client';

import { motion } from 'framer-motion';

type FabricationProps = {
  performanceTier?: string;
};

const fabServices = [
  {
    title: 'Generator Canopies',
    description: 'Custom acoustic enclosures for noise reduction and weather protection',
    features: ['Sound-proof design', 'Weather resistant', 'Ventilation systems', 'Access doors & panels'],
    icon: '🏗️',
  },
  {
    title: 'Electrical Enclosures',
    description: 'Custom control panels and electrical housing fabrication',
    features: ['MCC panels', 'Distribution boards', 'IP65/66 rated', 'Stainless steel options'],
    icon: '📦',
  },
  {
    title: 'Structural Steel',
    description: 'Heavy-duty structural fabrication for industrial applications',
    features: ['Equipment bases', 'Support structures', 'Platforms & ladders', 'Pipe supports'],
    icon: '🔩',
  },
  {
    title: 'Tank Fabrication',
    description: 'Custom fuel and water tank manufacturing',
    features: ['Fuel day tanks', 'Bulk storage tanks', 'Water tanks', 'Pressure vessels'],
    icon: '🛢️',
  },
];

const capabilities = [
  { icon: '⚙️', title: 'CNC Cutting', desc: 'Precision plasma & laser cutting' },
  { icon: '🔧', title: 'MIG/TIG Welding', desc: 'Certified welding processes' },
  { icon: '📐', title: 'CAD Design', desc: '3D modeling & drawings' },
  { icon: '🎨', title: 'Powder Coating', desc: 'Durable finish options' },
];

export default function Fabrication({ performanceTier }: FabricationProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-800" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(161,161,170,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-zinc-500/10 border border-zinc-500/30 rounded-full text-zinc-400 text-sm font-medium mb-4">
            METAL WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Custom <span className="text-zinc-400">Fabrication</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Precision metal fabrication for power systems and industrial applications. 
            From design to delivery — quality craftsmanship guaranteed.
          </p>
        </motion.div>

        {/* Capabilities Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {capabilities.map((cap, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-zinc-500/20 text-center hover:border-zinc-400/50 transition-colors">
              <span className="text-3xl mb-3 block">{cap.icon}</span>
              <div className="text-white font-semibold mb-1">{cap.title}</div>
              <div className="text-slate-400 text-sm">{cap.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fabServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-zinc-400/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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