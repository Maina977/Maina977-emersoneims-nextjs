'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceOption {
  name: string;
  price: string;
  features: string[];
  bestFor: string;
  popular?: boolean;
}

interface ServiceComparisonProps {
  services: ServiceOption[];
  title?: string;
}

export default function ServiceComparison({
  services,
  title = 'Compare Services',
}: ServiceComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleService = (name: string) => {
    setSelectedServices(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : prev.length < 3
          ? [...prev, name]
          : prev
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_30px_rgba(255,209,102,0.1)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
        {title}
      </h3>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedServices.includes(service.name)
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 hover:border-gray-600'
            } ${service.popular ? 'ring-2 ring-amber-500' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleService(service.name)}
          >
            {service.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                POPULAR
              </div>
            )}
            <h4 className="text-xl font-bold text-white mb-2">{service.name}</h4>
            <p className="text-2xl font-bold text-amber-400 mb-4">{service.price}</p>
            <p className="text-sm text-gray-400 mb-4">{service.bestFor}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-x-auto"
        >
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3">Feature</th>
                {selectedServices.map((name) => {
                  const service = services.find(s => s.name === name);
                  return <th key={name} className="text-left p-3">{service?.name}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="p-3 text-gray-400">Price</td>
                {selectedServices.map((name) => {
                  const service = services.find(s => s.name === name);
                  return <td key={name} className="p-3">{service?.price}</td>;
                })}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-3 text-gray-400">Best For</td>
                {selectedServices.map((name) => {
                  const service = services.find(s => s.name === name);
                  return <td key={name} className="p-3">{service?.bestFor}</td>;
                })}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-3 text-gray-400">Features</td>
                {selectedServices.map((name) => {
                  const service = services.find(s => s.name === name);
                  return (
                    <td key={name} className="p-3">
                      <ul className="space-y-1">
                        {service?.features.map((f, idx) => (
                          <li key={idx} className="text-sm">• {f}</li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

