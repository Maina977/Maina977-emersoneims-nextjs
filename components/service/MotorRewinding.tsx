'use client';

import { motion } from 'framer-motion';

type MotorRewindingProps = {
  performanceTier?: string;
};

const motorServices = [
  {
    title: 'Complete Rewinding',
    description: 'Full stator and rotor rewinding with premium copper wire',
    features: ['Single & three phase motors', 'Up to 500 HP capacity', 'Class H insulation', 'Varnish impregnation'],
    icon: '🔄',
  },
  {
    title: 'Motor Repairs',
    description: 'Comprehensive motor diagnostics and mechanical repairs',
    features: ['Bearing replacement', 'Shaft repair/replacement', 'Fan & housing repairs', 'Coupling alignment'],
    icon: '🔧',
  },
  {
    title: 'Pump Motor Services',
    description: 'Specialized services for submersible and centrifugal pump motors',
    features: ['Borehole pump motors', 'Sewage pump motors', 'Centrifugal pumps', 'Seal replacement'],
    icon: '💧',
  },
  {
    title: 'Testing & Balancing',
    description: 'Precision testing and dynamic balancing services',
    features: ['Insulation resistance', 'Hi-pot testing', 'Dynamic balancing', 'Vibration analysis'],
    icon: '⚖️',
  },
];

const motorTypes = [
  { type: 'AC Induction Motors', range: '0.5 HP - 500 HP' },
  { type: 'DC Motors', range: 'All sizes' },
  { type: 'Submersible Motors', range: '1 HP - 100 HP' },
  { type: 'Servo Motors', range: 'Industrial grade' },
  { type: 'Alternators', range: 'All kVA ratings' },
  { type: 'Transformers', range: 'Up to 5 MVA' },
];

export default function MotorRewinding({ performanceTier }: MotorRewindingProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-800 via-orange-950/20 to-slate-900" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.2),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-4">
            MOTOR SERVICES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Motor <span className="text-orange-400">Rewinding</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Expert motor rewinding and repair services. We restore motors to OEM specifications 
            with quality materials and precision workmanship.
          </p>
        </motion.div>

        {/* Motor Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {motorTypes.map((motor, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 text-center hover:border-orange-500/50 transition-colors">
              <div className="text-white font-semibold text-sm mb-1">{motor.type}</div>
              <div className="text-orange-400 text-xs">{motor.range}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {motorServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-orange-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Quality Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏆</span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">12-Month Warranty on All Rewinding Work</h3>
              <p className="text-slate-300">Every motor we rewind comes with a comprehensive 12-month warranty covering materials and workmanship. We stand behind our quality.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}