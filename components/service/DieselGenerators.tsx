'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type DieselGeneratorsProps = {
  performanceTier?: string;
};

const generatorServices = [
  {
    title: 'Installation & Commissioning',
    description: 'Complete turnkey generator installation from foundation to first power-on',
    features: ['Site assessment & preparation', 'Foundation design & construction', 'Electrical integration & ATS setup', 'Load bank testing & commissioning'],
    icon: '⚡',
  },
  {
    title: 'Preventive Maintenance',
    description: 'Scheduled maintenance programs to maximize uptime and extend equipment life',
    features: ['Oil & filter replacement', 'Coolant system service', 'Fuel system inspection', 'Load testing & calibration'],
    icon: '🔧',
  },
  {
    title: 'Emergency Repairs',
    description: '24/7 emergency response for critical power failures across Kenya',
    features: ['Same-day response guarantee', 'On-site diagnostic equipment', 'Genuine spare parts stock', 'Temporary power solutions'],
    icon: '🚨',
  },
  {
    title: 'Parts & Components',
    description: 'Genuine OEM parts for Cummins, Caterpillar, FG Wilson, and more',
    features: ['Engine components', 'Alternator parts', 'Control panels', 'Fuel system parts'],
    icon: '🔩',
  },
];

const specifications = [
  { label: 'Power Range', value: '20 kVA - 3,000 kVA' },
  { label: 'Fuel Types', value: 'Diesel, HFO, Dual-Fuel' },
  { label: 'Voltage Options', value: '240V / 415V / 11kV' },
  { label: 'Response Time', value: '< 4 Hours Emergency' },
];

export default function DieselGenerators({ performanceTier }: DieselGeneratorsProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" data-performance-tier={performanceTier}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("/images/grid-pattern.svg")', backgroundSize: '60px 60px' }} />
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
          <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4">
            CORE SERVICE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Diesel Generator <span className="text-amber-400">Solutions</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Kenya&apos;s trusted partner for industrial diesel generators. From 20 kVA backup units 
            to 3,000 kVA power plants — we deliver reliable power solutions.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-16 shadow-2xl"
        >
          <Image
            src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
            alt="Industrial Diesel Generator"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-4">
              {specifications.map((spec, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <div className="text-amber-400 text-sm font-medium">{spec.label}</div>
                  <div className="text-white font-bold">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {generatorServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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