'use client';

import { motion } from 'framer-motion';

type HVACSystemsProps = {
  performanceTier?: string;
};

const hvacServices = [
  {
    title: 'Commercial Air Conditioning',
    description: 'Large-scale cooling solutions for offices, malls, and commercial spaces',
    features: ['VRF/VRV systems', 'Chilled water systems', 'Package units', 'Ductwork design'],
    icon: '❄️',
  },
  {
    title: 'Industrial Ventilation',
    description: 'Factory and warehouse ventilation for air quality and temperature control',
    features: ['Exhaust systems', 'Fresh air handling', 'Dust extraction', 'Fume hoods'],
    icon: '💨',
  },
  {
    title: 'Cold Room & Refrigeration',
    description: 'Temperature-controlled storage for food and pharmaceuticals',
    features: ['Walk-in cold rooms', 'Blast freezers', 'Display coolers', 'Transport refrigeration'],
    icon: '🧊',
  },
  {
    title: 'Maintenance & Repairs',
    description: 'Preventive maintenance and emergency repair services',
    features: ['AMC contracts', 'Filter replacement', 'Gas recharging', '24/7 emergency'],
    icon: '🔧',
  },
];

const brands = ['Daikin', 'Carrier', 'Mitsubishi', 'LG', 'Samsung', 'Gree'];

export default function HVACSystems({ performanceTier }: HVACSystemsProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-sky-950/20 to-slate-800" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(56,189,248,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-400 text-sm font-medium mb-4">
            CLIMATE CONTROL
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            HVAC <span className="text-sky-400">Systems</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Heating, ventilation, and air conditioning solutions for comfort and productivity. 
            From design to installation and maintenance — we keep you cool.
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
            <span key={index} className="px-6 py-3 bg-white/5 border border-sky-500/20 rounded-full text-slate-300 font-medium hover:border-sky-500/50 transition-colors">
              {brand}
            </span>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hvacServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-sky-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Energy Savings CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-sky-500/10 border border-sky-500/30 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <span className="text-5xl">🌡️</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Save Up to 40% on Energy Bills</h3>
              <p className="text-slate-300">Upgrade to inverter technology and smart controls. Our energy-efficient HVAC solutions pay for themselves.</p>
            </div>
            <a href="/contact?type=hvac-consultation" className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
              Get Free Assessment
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}