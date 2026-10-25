// app/innovations/page.tsx - what we build in-house: live tools and work in progress
// DISCLAIMER: Generator Oracle is independently developed and not affiliated with any manufacturer
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import GlassmorphicCard from '@/components/effects/GlassmorphicCard';

interface Innovation {
  id: string;
  title: string;
  category: 'Diagnostics' | 'Water' | 'Solar' | 'Engineering' | 'Maintenance' | 'Parts';
  status: 'Live' | 'Beta' | 'Coming Soon';
  description: string;
  features: string[];
  icon: string;
  color: string;
  patent?: string;
  href?: string;
}

// 2026-10-25 audit: this list showed unbuilt features as "Live" or "Beta"
// with invented accuracy figures (92%, 95%, 99.9%), "world's first" claims and
// an implied integration with other manufacturers' databases. Live entries are
// now the tools that exist on this site, described as they work; everything
// else is labelled as in development, with no performance figures.
const innovations: Innovation[] = [
  {
    id: 'generator-oracle',
    title: 'Generator Oracle fault-code lookup',
    category: 'Diagnostics',
    status: 'Live',
    description: 'Look up J1939 SPN/FMI codes and controller alarm text, or describe a symptom, and get the likely causes and checks written by our engineers. Rule-based: it matches your words to our reference; it does not guess.',
    features: [
      'Reads codes as technicians write them: "SPN 110 FMI 0", "SPN110-FMI0", "110/0"',
      'Says plainly when a code is not in our reference',
      'Symptom search ranked by title and listed symptoms',
      'Ask-an-engineer link on every result',
    ],
    icon: '🔧',
    color: 'from-amber-500 to-orange-500',
    href: '/generator-oracle',
  },
  {
    id: 'aquascan',
    title: 'AquaScan Pro borehole pre-screen',
    category: 'Water',
    status: 'Live',
    description: 'A desktop pre-screen for a borehole site in Kenya: planning depth, yield range, water-quality risks and budget from public data and nearby drilled-borehole records. It is not a survey, and the report says so on every page.',
    features: [
      'Depth and yield anchored to real drilled boreholes nearby where they exist',
      'One set of figures on the web page and in the PDF',
      'Measured record published: modelled depth inside the drilled band about 40% of the time so far',
    ],
    icon: '💧',
    color: 'from-cyan-500 to-blue-500',
    href: '/aquascan-pro-v3',
  },
  {
    id: 'solargenius',
    title: 'SolarGenius Pro sizing and quote checker',
    category: 'Solar',
    status: 'Live',
    description: 'Size a solar system from your bill using NASA sun-hours for your location, and check a supplier\'s quotation line by line against stated rule-of-thumb prices.',
    features: [
      'Grid-tied, hybrid and off-grid sizing with every assumption listed',
      'Quote checker that reads common Kenyan quote formats and skips VAT and total lines',
      'String, cable and inverter-match checks to IEC 62548 / IEC 60364',
    ],
    icon: '☀️',
    color: 'from-yellow-500 to-orange-500',
    href: '/solar-genius-pro',
  },
  {
    id: 'building-suite',
    title: 'Building Suite engineering calculators',
    category: 'Engineering',
    status: 'Live',
    description: 'Desk checks for RC beams, bolted connections, wind and seismic loads, drainage, daylight, acoustics and U-values, each to the code clause it cites. A check, not a signed design.',
    features: [
      'Inputs outside a code\'s scope are refused with the reason',
      'Every result states the clause and assumptions used',
    ],
    icon: '🏗️',
    color: 'from-indigo-500 to-purple-500',
    href: '/solutions/building',
  },
  {
    id: 'severity',
    title: 'Fault severity for Kenyan conditions',
    category: 'Diagnostics',
    status: 'Coming Soon',
    description: 'In development: adjusting how urgent a fault is for heat, altitude and load, so a technician in Garissa and one in Nairobi get advice that fits the site.',
    features: ['Temperature and altitude factors', 'Load and maintenance-history factors'],
    icon: '🧭',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'maintenance-index',
    title: 'Predictive maintenance index',
    category: 'Maintenance',
    status: 'Coming Soon',
    description: 'In development: using service records from sets we maintain to flag which machines are due for attention first. It will publish how well its warnings match what actually failed.',
    features: ['Built from our own service records', 'Results checked against real failures before release'],
    icon: '🔮',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'voice-search',
    title: 'Voice fault-code lookup',
    category: 'Diagnostics',
    status: 'Coming Soon',
    description: 'In development: saying a fault code or symptom instead of typing it, for technicians with their hands full.',
    features: ['English and Swahili', 'Same reference as the typed lookup'],
    icon: '🎙️',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'remote-monitoring',
    title: 'Remote generator monitoring',
    category: 'Maintenance',
    status: 'Coming Soon',
    description: 'In development: voltage, frequency, temperature, fuel and run-hours from installed sets, with alerts by SMS or WhatsApp.',
    features: ['Alerts by SMS, email or WhatsApp', 'Fuel-level and run-hour history'],
    icon: '📡',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'parts-check',
    title: 'Genuine-parts check',
    category: 'Parts',
    status: 'Coming Soon',
    description: 'In development: checking a part\'s serial number against our supply records to help spot counterfeits.',
    features: ['QR code scan', 'Install and replacement history per part'],
    icon: '🔐',
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function InnovationsPage() {
  const [filter, setFilter] = useState<'All' | Innovation['status']>('All');

  const filtered = filter === 'All' 
    ? innovations 
    : innovations.filter(i => i.status === filter);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <span className="text-7xl">🚀</span>
          </motion.div>
          <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Innovations
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light mb-8">
            The tools we build in-house for generator, solar, borehole and building work in Kenya — what is live today and what we are working on
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
              {innovations.filter(i => i.status === 'Live').length} live tools
            </span>
            <span className="px-6 py-3 bg-amber-500/20 text-amber-300 rounded-full text-sm font-semibold border border-amber-500/30">
              {innovations.filter(i => i.status === 'Coming Soon').length} in development
            </span>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12">
          {(['All', 'Live', 'Coming Soon'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {status === 'Coming Soon' ? 'In development' : status}
            </button>
          ))}
        </div>

        {/* Innovations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((innovation, index) => (
            <motion.div
              key={innovation.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8 h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`text-5xl bg-gradient-to-br ${innovation.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                      {innovation.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{innovation.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          innovation.status === 'Live' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          innovation.status === 'Beta' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {innovation.status === 'Coming Soon' ? 'In development' : innovation.status}
                        </span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                          {innovation.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {innovation.description}
                </p>
                {innovation.href && (
                  <Link href={innovation.href} className="inline-block mb-6 text-amber-300 underline font-semibold">Open the tool →</Link>
                )}

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">{innovation.status === 'Live' ? 'What it does:' : 'Planned:'}</h4>
                  <ul className="space-y-2">
                    {innovation.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start">
                        <span className={`bg-gradient-to-r ${innovation.color} bg-clip-text text-transparent mr-2`}>▸</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Patent Notice */}
                {innovation.patent && (
                  <div className={`border-l-4 border-amber-500 bg-gradient-to-r ${innovation.color} bg-opacity-10 rounded-r-lg p-4`}>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-amber-400 font-bold">🏆 Technology:</span>
                      <span className="text-white font-mono">{innovation.patent}</span>
                    </div>
                  </div>
                )}
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-5xl font-bold mb-8">Try the live tools</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            They are free to use. Tell us what would help your site and we will tell you honestly whether we can build it.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/diagnostics"
              className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              Diagnostics
            </Link>
            <Link 
              href="/contact"
              className="px-12 py-6 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-full hover:bg-white/20 transition-all border-2 border-white/20"
            >
              Talk to us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
