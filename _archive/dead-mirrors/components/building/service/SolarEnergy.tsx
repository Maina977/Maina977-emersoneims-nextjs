'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type SolarEnergyProps = {
  performanceTier?: string;
};

const solarServices = [
  {
    title: 'Grid-Tie Solar Systems',
    description: 'Reduce electricity bills with net-metering enabled solar installations',
    features: ['KPLC net-metering approval', 'Real-time monitoring', 'ROI within 3-5 years', 'Zero maintenance panels'],
    icon: '☀️',
  },
  {
    title: 'Off-Grid Solar Solutions',
    description: 'Complete energy independence for remote locations and backup power',
    features: ['Battery storage systems', 'Hybrid inverters', 'Remote monitoring', '24/7 power availability'],
    icon: '🔋',
  },
  {
    title: 'Commercial Solar Farms',
    description: 'Large-scale solar installations for businesses and industrial facilities',
    features: ['500 kW - 10 MW capacity', 'Land lease optimization', 'PPA arrangements', 'Maintenance contracts'],
    icon: '🏭',
  },
  {
    title: 'Solar Water Heating',
    description: 'Reduce water heating costs by up to 70% with solar thermal systems',
    features: ['Hotels & hospitals', 'Residential systems', 'Industrial pre-heating', 'Swimming pool heating'],
    icon: '🌡️',
  },
];

const solarStats = [
  { value: '500+', label: 'Installations' },
  { value: '15 MW', label: 'Capacity Installed' },
  { value: '25 Years', label: 'Panel Warranty' },
  { value: '70%', label: 'Bill Reduction' },
];

export default function SolarEnergy({ performanceTier }: SolarEnergyProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-800" data-performance-tier={performanceTier}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
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
          <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
            RENEWABLE ENERGY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Solar Energy <span className="text-blue-400">Systems</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Harness Kenya&apos;s abundant sunshine with our premium solar solutions. 
            From residential rooftops to commercial solar farms — clean energy, guaranteed savings.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {solarStats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero Images Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          <div className="relative h-48 rounded-xl overflow-hidden col-span-2 row-span-2">
            <Image src="/images/solar power farms.png" alt="Solar Farm Installation" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-semibold">Solar Farms</span>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden">
            <Image src="/images/solar hotel heaters.png" alt="Solar Water Heaters" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Water Heating</span>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden">
            <Image src="/images/solar for flower farms.png" alt="Agricultural Solar" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Agriculture</span>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden col-span-2">
            <Image src="/images/solar power for farms.png" alt="Commercial Solar" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-semibold">Commercial Installations</span>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solarServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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