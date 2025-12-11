'use client';

import { motion } from 'framer-motion';

interface PerformanceConfig {
  dpr?: number;
  shadows?: boolean;
  particles?: number;
  quality?: 'low' | 'medium' | 'high';
}

interface ServicesTeaserProps {
  config?: PerformanceConfig;
  isVisible?: boolean;
}

export default function ServicesTeaser({ config, isVisible = true }: ServicesTeaserProps) {
  const services = [
    {
      title: 'Generator Solutions',
      description: 'Premium power generation systems',
      href: '/services/generators',
    },
    {
      title: 'Solar Energy',
      description: 'Renewable energy integration',
      href: '/services/solar',
    },
    {
      title: 'UPS Systems',
      description: 'Uninterruptible power supply',
      href: '/services/ups',
    },
  ];

  return (
    <section className="services-teaser-section py-20 px-5vw">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-hero font-bold text-white mb-6 text-center"
        >
          Engineering Excellence, Delivered
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-lg text-gray-400 mb-12 text-center max-w-2xl mx-auto"
        >
          From precision-engineered generators to cutting-edge solar solutions, 
          we deliver energy infrastructure that exceeds expectations and transforms businesses.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="service-card bg-gray-900 border-2 border-gray-700 rounded-lg p-6 hover:border-amber-500 transition-colors"
            >
              <h3 className="text-2xl font-bold text-amber-500 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <a
                href={service.href}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Learn More →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




