'use client';

/**
 * WORLD-CLASS COMPARISON SECTION
 * Shows why EmersonEIMS is the best choice vs competitors
 * Honest, factual comparison without naming competitors directly
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

const COMPARISON_POINTS = [
  {
    feature: 'Response Time',
    emersonEIMS: '< 2 hours (Nairobi), < 24 hours (47 counties)',
    industry: '24-72 hours average',
    advantage: true,
  },
  {
    feature: 'Service Coverage',
    emersonEIMS: 'All 47 Kenya counties + East Africa',
    industry: 'Major cities only',
    advantage: true,
  },
  {
    feature: 'Generator Range',
    emersonEIMS: '20 kVA to 2000 kVA (All brands)',
    industry: 'Limited range or single brand',
    advantage: true,
  },
  {
    feature: 'Diagnostic Capability',
    emersonEIMS: '90,000+ error codes with step-by-step guides',
    industry: 'Basic diagnostics only',
    advantage: true,
  },
  {
    feature: 'Support Hours',
    emersonEIMS: '24/7/365 with emergency hotline',
    industry: 'Business hours only',
    advantage: true,
  },
  {
    feature: 'Warranty Support',
    emersonEIMS: 'Factory-authorized, warranty-compliant service',
    industry: 'May void manufacturer warranty',
    advantage: true,
  },
  {
    feature: 'Remote Monitoring',
    emersonEIMS: 'IoT integration, SMS alerts, cloud dashboard',
    industry: 'Manual checks only',
    advantage: true,
  },
  {
    feature: 'Pricing Transparency',
    emersonEIMS: 'Fixed quotes, no hidden fees, AMC options',
    industry: 'Variable pricing, add-on charges',
    advantage: true,
  },
];

const VALUE_PROPOSITIONS = [
  {
    title: 'Engineering-First Approach',
    description: 'Every solution designed by certified engineers with deep technical expertise, not sales-driven recommendations.',
    icon: '🔬',
  },
  {
    title: 'Single Point of Contact',
    description: 'From initial consultation through installation and lifetime support - one team, complete accountability.',
    icon: '🤝',
  },
  {
    title: 'Preventive Over Reactive',
    description: 'Scheduled maintenance and monitoring prevents failures before they happen, minimizing costly downtime.',
    icon: '🛡️',
  },
  {
    title: 'Local Expertise, Global Standards',
    description: 'Deep understanding of Kenya&apos;s power challenges combined with international best practices and equipment.',
    icon: '🌍',
  },
];

export default function CompetitiveAdvantage() {
  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Why EmersonEIMS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            The EmersonEIMS
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> Difference</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Industry-leading service standards that set us apart from the rest.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-gray-500 text-sm uppercase tracking-wider">Feature</th>
                <th className="text-left py-4 px-4 text-amber-400 text-sm uppercase tracking-wider">EmersonEIMS</th>
                <th className="text-left py-4 px-4 text-gray-500 text-sm uppercase tracking-wider">Industry Average</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_POINTS.map((point, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-white font-medium">{point.feature}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-green-400">{point.emersonEIMS}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{point.industry}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Value Propositions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6 mb-16"
        >
          {VALUE_PROPOSITIONS.map((prop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-amber-500/30 transition-all group"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{prop.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {prop.title}
              </h3>
              <p className="text-gray-400">{prop.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Our Service Guarantee</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              If we don&apos;t meet our promised response time, your first service call is free. 
              That&apos;s our commitment to reliability.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all"
            >
              Get Your Free Quote
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
