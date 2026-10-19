'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, Zap, Sun, Droplets, Cpu, Brain, Sparkles, ArrowRight,
  CheckCircle2, Globe, Clock, Award, TrendingUp, Shield,
  Wrench, Search, BarChart3, Calculator, Layers
} from 'lucide-react';

// AI Tool Card Component
interface AIToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  icon: React.ReactNode;
  href: string;
  gradient: string;
  badge?: string;
  isPrimary?: boolean;
}

function AIToolCard({ title, subtitle, description, features, stats, icon, href, gradient, badge, isPrimary }: AIToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border ${
        isPrimary
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-900'
          : 'border-gray-700/50 bg-gray-900/80'
      } backdrop-blur-sm`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            badge === 'FLAGSHIP SUITE'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${gradient}`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-gray-300">{description}</p>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700/50">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={href}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isPrimary
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
            }`}
          >
            Launch Tool
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function AIToolsPage() {
  /*
   * 2026-10-18 tool audit: this page claimed "the world's most powerful AI
   * construction platform", 99.8% / 98.5% / 97% accuracy, "195+ countries with
   * real-time pricing", "75+ AI engines", "450k+ fault codes", "+25% ROI boost"
   * and "thousands of professionals". None was measured or true. Each card now
   * says what the tool does; the full can/cannot list is at /ai-tools/capabilities.
   * The Solar and AquaScan cards also linked to /solar and
   * /services/borehole-pumps instead of the tools themselves.
   */
  const aiTools = [
    {
      title: 'Generator Oracle',
      subtitle: 'Generator fault codes & diagnosis',
      description: 'Look up a controller alarm or J1939 engine code, see the likely causes and checks, and reach an engineer in one tap.',
      features: [
        'Alarms for DeepSea, ComAp, Woodward, SmartGen, CAT PowerWizard and more',
        'J1939 engine codes, typed the way the display shows them',
        'Symptom search that points to the right diagnostic guide',
        'Reset steps, wiring references and training simulators',
        'WhatsApp an engineer from any result',
      ],
      stats: [
        { label: 'Controller brands', value: '10' },
        { label: 'Engine codes', value: 'J1939' },
        { label: 'Cost', value: 'Free' },
      ],
      icon: <Zap className="w-8 h-8 text-white" />,
      href: '/generator-oracle',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      badge: 'FLAGSHIP',
      isPrimary: true,
    },
    {
      title: 'Solar Genius Pro',
      subtitle: 'Solar sizing estimate',
      description: 'A first estimate of the panels, inverter and battery you need, with cost and payback, from your own consumption.',
      features: [
        'NASA POWER sun-hours for your location',
        'Battery sized to the backup you actually want',
        'Your tariff, residential or commercial',
        'Inverter and battery fault-code library',
        'Send the result to us for a site survey and quote',
      ],
      stats: [
        { label: 'Sun data', value: 'NASA' },
        { label: 'Sign-up', value: 'None' },
        { label: 'Cost', value: 'Free' },
      ],
      icon: <Sun className="w-8 h-8 text-white" />,
      href: '/solar-genius-pro',
      gradient: 'from-yellow-500 via-orange-500 to-amber-600',
      badge: 'FREE',
    },
    {
      title: 'AquaScan Pro',
      subtitle: 'Borehole pre-screen',
      description: 'A desktop first look at a borehole site from public rainfall, soil and water-point data — the step before a field survey.',
      features: [
        'Long-term rainfall, temperature and soils for the site',
        'Mapped water points and borehole records nearby',
        'Rough depth range and drilling-cost band',
        'Every data source named',
        'Book a field survey from the result',
      ],
      stats: [
        { label: 'Type', value: 'Pre-screen' },
        { label: 'Sources', value: 'Named' },
        { label: 'Cost', value: 'Free' },
      ],
      icon: <Droplets className="w-8 h-8 text-white" />,
      href: '/aquascan-pro-v3',
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
      badge: 'FREE',
    },
    {
      title: 'Building Suite',
      subtitle: 'Engineering reference calculators',
      description: 'Hand-checked calculators for building work. Each one uses every input you type and names the method it follows.',
      features: [
        'Wind pressure and steel bolt shear',
        'Reinforced-concrete beam bending',
        'Rational-method drainage runoff',
        'Bearing capacity, U-values, daylight and acoustics',
        'Talk to an engineer for full design',
      ],
      stats: [
        { label: 'Methods', value: 'Named' },
        { label: 'Sign-up', value: 'None' },
        { label: 'Cost', value: 'Free' },
      ],
      icon: <Building2 className="w-8 h-8 text-white" />,
      href: '/solutions/building',
      gradient: 'from-indigo-600 via-purple-600 to-violet-600',
    },
    {
      title: 'Plant & Equipment Oracle',
      subtitle: 'Excavator, Loader & Machine Fault Codes',
      description:
        'Fault codes for plant and heavy equipment — the engines that power excavators, loaders and rollers are the ones we already hold, plus sourced tables for the machine makers themselves.',
      features: [
        'Machine-maker tables: Bobcat, Kubota, John Deere, Volvo CE, Komatsu, SANY and more',
        'Engine-brand codes: Perkins, Cummins, Caterpillar, Deutz',
        'SAE J1939 decoder for any machine we hold no table for',
        'Unknown codes classified by their published code space',
        'Gaps declared openly — no invented codes, no invented fixes',
      ],
      stats: [
        { label: 'Curated codes', value: 'Verified' },
        { label: 'Brands', value: '21' },
        { label: 'Cost', value: 'Free' },
      ],
      icon: <Wrench className="w-8 h-8 text-white" />,
      href: '/plant-equipment-oracle',
      gradient: 'from-cyan-600 via-teal-600 to-emerald-600',
      badge: 'NEW',
    },
  ];

  const additionalTools = [
    {
      title: 'Fault Code Guides',
      description: 'Common generator alarms explained',
      icon: <Search className="w-6 h-6" />,
      href: '/faults',
    },
    {
      title: 'Diagnostic Suite',
      description: 'Guided fault trees',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/diagnostics',
    },
    {
      title: 'Solar Sizing Guide',
      description: 'How sizing works, step by step',
      icon: <Calculator className="w-6 h-6" />,
      href: '/solutions/solar-sizing',
    },
    {
      title: 'What Each Tool Does',
      description: 'Can and cannot do, plainly',
      icon: <Layers className="w-6 h-6" />,
      href: '/ai-tools/capabilities',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-amber-500/20 rounded-full border border-purple-500/30 mb-6"
          >
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Free · No sign-up · Engineers behind every tool</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6"
          >
            Engineering Tools{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Suite
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Free tools for generator diagnosis, solar sizing, borehole pre-screening and building calculations.
            Each one says what it can and cannot do, and ends with a route to our engineers.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { icon: <Cpu className="w-5 h-5" />, value: '5', label: 'Free Tools' },
              { icon: <TrendingUp className="w-5 h-5" />, value: '10', label: 'Controller Brands' },
              { icon: <Shield className="w-5 h-5" />, value: 'ISO 9001', label: '& KEBS Registered' },
              { icon: <Award className="w-5 h-5" />, value: '1 tap', label: 'To an Engineer' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <span className="text-amber-400">{stat.icon}</span>
                <span className="text-white font-bold">{stat.value}</span>
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main AI Tools Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {aiTools.map((tool, idx) => (
              <AIToolCard key={idx} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Tools */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">More Free Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalTools.map((tool, idx) => (
              <Link key={idx} href={tool.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-amber-500/50 transition-all text-center"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 text-amber-400">
                    {tool.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{tool.title}</h3>
                  <p className="text-gray-400 text-xs">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Why Use EmersonEIMS Tools
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Shield className="w-8 h-8" />, title: 'Honest Limits', desc: 'Every tool says what it cannot do, so you know when to call an engineer' },
                { icon: <Search className="w-8 h-8" />, title: 'Named Sources', desc: 'Data comes from NASA POWER, SAE J1939, ISRIC and other public sources, named on screen' },
                { icon: <Clock className="w-8 h-8" />, title: 'Free, No Sign-up', desc: 'Open any tool and use it straight away' },
                { icon: <Wrench className="w-8 h-8" />, title: 'Written by Engineers', desc: 'Fault guides and calculators written and checked by our engineering team' },
                { icon: <Globe className="w-8 h-8" />, title: 'Built for Kenya', desc: 'Kenyan tariffs, sun-hours, borehole records and the equipment we service' },
                { icon: <TrendingUp className="w-8 h-8" />, title: 'A Person Behind It', desc: 'WhatsApp or call 0768 860 665 when the tool reaches its limit' },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-amber-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Need a Hand With the Real Thing?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Use the tools to get started, then bring in EmersonEIMS for the survey, the design
              and the work on site.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/generator-oracle">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Try Generator Oracle
                </motion.button>
              </Link>
              <Link href="/contact?type=engineer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors"
                >
                  Talk to an Engineer
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
