'use client';

/**
 * INDUSTRY-LEADING TRUST SECTION
 * Real certifications, partnerships, and achievements
 * Designed to build credibility at Tesla/Apple/Siemens level
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

// Real company data - factual only
const COMPANY_FACTS = {
  founded: 2012,
  yearsExperience: 12,
  totalProjects: 523,
  totalKVA: 45000,
  countiesServed: 47,
  engineersOnStaff: 18,
  uptime: 98.7,
  clientRetention: 96,
};

// Real partnerships and certifications
const PARTNERSHIPS = [
  { 
    name: 'Cummins Voltka', 
    type: 'Authorized Dealer', 
    description: 'Factory-authorized sales and service partner',
    verified: true,
  },
];

// Real client portfolio - verified projects
const VERIFIED_CLIENTS = [
  { 
    name: 'St. Austins Academy Nairobi', 
    project: '50 kVA Generator + UPS', 
    sector: 'Education',
    year: 2023,
  },
  { 
    name: 'Kivukoni International School', 
    project: '60 kVA Generator', 
    sector: 'Education',
    year: 2023,
  },
  { 
    name: 'Bigot Flowers - Naivasha', 
    project: '300 kVA + 100 kVA Systems', 
    sector: 'Agriculture/Horticulture',
    year: 2022,
  },
  { 
    name: 'Afriherb Kenya Limited', 
    project: '300 kVA Industrial', 
    sector: 'Manufacturing',
    year: 2022,
  },
  { 
    name: 'Maua Methodist Hospital', 
    project: '200 kVA Critical Power', 
    sector: 'Healthcare',
    year: 2021,
  },
  { 
    name: 'FAO Somalia Operations', 
    project: '100 kVA Field Operations', 
    sector: 'International NGO',
    year: 2021,
  },
  { 
    name: 'AMH Nairobi', 
    project: '200 kVA Generator', 
    sector: 'Corporate',
    year: 2022,
  },
  { 
    name: 'Takaungu Regeneration Project', 
    project: '44 kVA Community Power', 
    sector: 'Development/NGO',
    year: 2023,
  },
];

// Industry coverage
const SECTORS_SERVED = [
  { name: 'Healthcare', icon: '🏥', projects: 45 },
  { name: 'Education', icon: '🎓', projects: 78 },
  { name: 'Manufacturing', icon: '🏭', projects: 92 },
  { name: 'Agriculture', icon: '🌾', projects: 67 },
  { name: 'Hospitality', icon: '🏨', projects: 54 },
  { name: 'Commercial', icon: '🏢', projects: 112 },
  { name: 'NGO/Development', icon: '🌍', projects: 38 },
  { name: 'Government', icon: '🏛️', projects: 37 },
];

// Service capabilities
const CAPABILITIES = [
  {
    title: 'Generator Solutions',
    range: '20 kVA - 2000 kVA',
    brands: ['Cummins', 'Caterpillar', 'FG Wilson'],
    services: ['Sales', 'Installation', 'Maintenance', 'Repairs', 'Parts'],
  },
  {
    title: 'Solar Energy',
    range: '5 kW - 500 kW',
    brands: ['JA Solar', 'Longi', 'Canadian Solar', 'Huawei'],
    services: ['Design', 'Installation', 'Grid-tie', 'Off-grid', 'Hybrid'],
  },
  {
    title: 'UPS Systems',
    range: '1 kVA - 800 kVA',
    brands: ['APC', 'Eaton', 'Vertiv', 'Schneider'],
    services: ['Supply', 'Installation', 'Battery Replacement', 'Maintenance'],
  },
  {
    title: 'Control Systems',
    range: 'Industrial Automation',
    brands: ['ComAp', 'PowerWizard', 'ABB'],
    services: ['ATS', 'Synchronization', 'SCADA', 'Remote Monitoring'],
  },
];

export default function IndustryLeadingTrust() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 relative overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Verified Credentials
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            East Africa&apos;s Most Trusted
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text"> Power Partner</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            {COMPANY_FACTS.yearsExperience} years of proven excellence. {COMPANY_FACTS.totalProjects}+ completed projects. 
            {COMPANY_FACTS.totalKVA.toLocaleString()}+ kVA installed capacity across {COMPANY_FACTS.countiesServed} counties.
          </p>
        </motion.div>

        {/* Key Metrics - Apple Style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            { value: `${COMPANY_FACTS.totalProjects}+`, label: 'Projects Completed', sublabel: 'Across East Africa' },
            { value: `${COMPANY_FACTS.uptime}%`, label: 'System Uptime', sublabel: 'Industry Leading' },
            { value: `${COMPANY_FACTS.clientRetention}%`, label: 'Client Retention', sublabel: 'Long-term Partnerships' },
            { value: `${COMPANY_FACTS.engineersOnStaff}+`, label: 'Expert Engineers', sublabel: 'Factory Certified' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 group-hover:border-amber-500/30 transition-all text-center">
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Authorized Partnerships */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-[0.3em] mb-8">
            Authorized Partnerships
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {PARTNERSHIPS.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-green-400 uppercase tracking-wider">Verified Partner</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {partner.name}
                </h4>
                <p className="text-amber-400 text-sm font-medium mb-2">{partner.type}</p>
                <p className="text-gray-400 text-sm">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-[0.3em] mb-8">
            Service Capabilities
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <h4 className="text-lg font-bold text-white mb-2">{cap.title}</h4>
                <p className="text-cyan-400 text-sm font-medium mb-3">{cap.range}</p>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Brands: </span>
                  <span className="text-xs text-gray-400">{cap.brands.join(' • ')}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cap.services.map((service, j) => (
                    <span key={j} className="px-2 py-0.5 text-xs bg-white/5 rounded text-gray-400">
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sectors Served */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-[0.3em] mb-8">
            Industries We Power
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SECTORS_SERVED.map((sector, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:border-amber-500/30 transition-all group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{sector.icon}</span>
                <div className="text-white font-semibold text-sm mb-1">{sector.name}</div>
                <div className="text-xs text-amber-400">{sector.projects}+ projects</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Clients */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-[0.3em] mb-8">
            Featured Client Portfolio
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VERIFIED_CLIENTS.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-xs">●</span>
                  <span className="text-xs text-gray-500">{client.sector}</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{client.name}</h4>
                <p className="text-amber-400 text-xs mb-1">{client.project}</p>
                <p className="text-gray-600 text-xs">{client.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 border border-amber-500/30">
            <div className="text-left">
              <h4 className="text-xl font-bold text-white mb-1">Ready to Power Your Project?</h4>
              <p className="text-gray-400 text-sm">Get expert consultation from our certified engineers</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="https://wa.me/254768860655"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all"
              >
                WhatsApp
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-all"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
