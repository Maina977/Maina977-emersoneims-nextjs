'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Trust badges and certifications
const certifications = [
  { name: 'ISO 9001:2015', icon: '🏆', description: 'Quality Management' },
  { name: 'ISO 14001:2018', icon: '🌿', description: 'Environmental' },
  { name: 'EPRA Licensed', icon: '⚡', description: 'Kenya Energy Regulator' },
  { name: 'CAK Certified', icon: '✓', description: 'Competition Authority' },
];

const partners = [
  { name: 'Caterpillar', logo: '/images/partners/caterpillar.svg', tier: 'Authorized Dealer' },
  { name: 'Cummins', logo: '/images/partners/cummins.svg', tier: 'Certified Partner' },
  { name: 'Perkins', logo: '/images/partners/perkins.svg', tier: 'Distributor' },
  { name: 'FG Wilson', logo: '/images/partners/fgwilson.svg', tier: 'Service Partner' },
  { name: 'Kohler', logo: '/images/partners/kohler.svg', tier: 'Authorized Dealer' },
  { name: 'MTU', logo: '/images/partners/mtu.svg', tier: 'Certified Partner' },
];

const stats = [
  { value: '15+', label: 'Years Experience', icon: '📅' },
  { value: '2,500+', label: 'Generators Installed', icon: '⚡' },
  { value: '47', label: 'Counties Served', icon: '🗺️' },
  { value: '99.9%', label: 'Uptime Guaranteed', icon: '✅' },
  { value: '24/7', label: 'Support Available', icon: '🛠️' },
  { value: '4.9★', label: 'Google Rating', icon: '⭐' },
];

const awards = [
  { year: '2024', title: 'Best Energy Solutions Provider - East Africa', org: 'Kenya Energy Awards' },
  { year: '2023', title: 'Innovation in Power Technology', org: 'KEPSA Business Excellence' },
  { year: '2023', title: 'Customer Service Excellence', org: 'Kenya Institute of Management' },
  { year: '2022', title: 'Top 100 SME in Kenya', org: 'KPMG & Nation Media' },
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

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Certifications & Licenses
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <span className="text-2xl">{cert.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{cert.name}</div>
                  <div className="text-gray-500 text-xs">{cert.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Authorized Equipment Partners
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all group"
              >
                <div className="text-white font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                  {partner.name}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{partner.tier}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            Awards & Recognition
          </h3>
          <div className="flex overflow-hidden relative">
            <motion.div
              animate={{
                x: [0, -50 + '%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[...awards, ...awards].map((award, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 min-w-fit"
                >
                  <span className="text-amber-400 text-2xl">🏆</span>
                  <div>
                    <div className="text-white font-semibold">{award.title}</div>
                    <div className="text-gray-500 text-xs">{award.org} • {award.year}</div>
                  </div>
                </div>
              ))}
            </motion.div>
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
