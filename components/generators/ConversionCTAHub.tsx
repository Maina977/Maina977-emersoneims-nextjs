'use client';

import { motion } from 'framer-motion';
import ConversionCTA from '@/components/cta/ConversionCTA';

export default function ConversionCTAHub() {
  const ctas = [
    {
      label: 'Request Generator Price',
      icon: '💰',
      service: 'Generator Quote',
      description: 'Get an instant quote for new generators'
    },
    {
      label: 'Book Generator Inspection',
      icon: '🔍',
      service: 'Inspection',
      description: 'Schedule a site visit from our engineers'
    },
    {
      label: 'Request Maintenance Contract',
      icon: '🛠️',
      service: 'Maintenance Contract',
      description: 'Protect your investment with SLA-backed service'
    },
    {
      label: 'Check Generator Availability',
      icon: '📦',
      service: 'Stock Check',
      description: 'Verify availability for immediate deployment'
    },
    {
      label: 'Request Spare-Part Price',
      icon: '⚙️',
      service: 'Spare Parts',
      description: '2000+ parts in stock — same-day delivery'
    },
    {
      label: 'Sell or Trade In Your Generator',
      icon: '🔄',
      service: 'Trade-In / Sell',
      description: 'Get best value for your used equipment'
    },
    {
      label: 'Speak to an Engineer',
      icon: '👨‍🔧',
      service: 'Engineer Consultation',
      description: 'Direct line to our technical experts'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-amber-900/10 to-black border-y border-amber-500/20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            🎯 Direct Action Required?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Can We Help With?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pick your need. We'll respond within 2 hours (business hours).
          </p>
        </motion.div>

        {/* CTA Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {ctas.map((cta, index) => (
            <motion.div
              key={cta.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-all h-full flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-3xl mb-2">{cta.icon}</div>
                  <h3 className="text-white font-semibold text-sm">{cta.label}</h3>
                  <p className="text-gray-500 text-xs mt-1">{cta.description}</p>
                </div>

                <div className="mt-auto">
                  <ConversionCTA
                    label="Click Here"
                    service={cta.service}
                    style="secondary"
                    size="sm"
                    icon="→"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alternative Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/50 rounded-lg p-6 border border-slate-800 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Prefer to contact us directly?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+254768860665"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all"
            >
              📞 Call +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all"
            >
              💬 WhatsApp Now
            </a>
            <a
              href="mailto:emersoneimservices@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500/50 text-amber-400 font-semibold rounded-lg hover:bg-amber-500/10 transition-all"
            >
              ✉️ Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
