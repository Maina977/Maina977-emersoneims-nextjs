'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Trust badges and certifications - Only factual items
const capabilities = [
  { name: 'Generator Specialists', icon: '⚡', description: '12 Years Experience' },
  { name: '24/7 Support', icon: '🛠️', description: 'Emergency Response' },
  { name: 'All 47 Counties', icon: '🗺️', description: 'Kenya Coverage' },
  { name: 'Trained Technicians', icon: '👷', description: 'Professional Team' },
];

const partners = [
  { name: 'CUMMINS VOLTKA', logo: '/images/partners/cummins.svg', tier: 'Authorized Partner' },
];

const stats = [
  { value: '12+', label: 'Years Experience', icon: '📅' },
  { value: '500+', label: 'Generators Installed', icon: '⚡' },
  { value: '47', label: 'Counties Served', icon: '🗺️' },
  { value: '99.9%', label: 'Uptime Guaranteed', icon: '✅' },
  { value: '24/7', label: 'Support Available', icon: '🛠️' },
  { value: '4.9★', label: 'Google Rating', icon: '⭐' },
];

// Real projects portfolio
const projectHighlights = [
  { client: 'Schools & Academies', power: '50-100 kVA', type: 'Generator + UPS Systems' },
  { client: 'Flower Farms', power: '100-300 kVA', type: 'Industrial Power Solutions' },
  { client: 'Hospitals', power: '200+ kVA', type: 'Critical Power Infrastructure' },
  { client: 'NGO & Organizations', power: '100+ kVA', type: 'Reliable Backup Systems' },
];

export default function TrustBadgesSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by East Africa&apos;s
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> Leading Organizations</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Certified, licensed, and backed by world-class equipment partners.
          </p>
        </motion.div>

        {/* Stats counter row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Our Capabilities
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <span className="text-2xl">{cap.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{cap.name}</div>
                  <div className="text-gray-500 text-xs">{cap.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Authorized Partner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Authorized Partner
          </h3>
          <div className="flex justify-center">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-br from-amber-500/10 to-cyan-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all group"
              >
                <div className="text-white font-bold text-2xl mb-2 group-hover:text-amber-400 transition-colors">
                  {partner.name}
                </div>
                <div className="text-sm text-amber-400 uppercase tracking-wider">{partner.tier}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Portfolio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Project Portfolio
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {projectHighlights.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/30 transition-all text-center"
              >
                <div className="text-lg font-bold text-white mb-1">{project.client}</div>
                <div className="text-amber-400 font-semibold mb-1">{project.power}</div>
                <div className="text-xs text-gray-500">{project.type}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Google Reviews widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-xl">★</span>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">4.9 out of 5</div>
              <div className="text-gray-500 text-sm">Based on 127 Google Reviews</div>
            </div>
            <a
              href="https://g.page/emersoneims/review?rc"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Write a Review
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
