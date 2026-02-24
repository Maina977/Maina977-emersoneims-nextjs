'use client';

/**
 * Generator Oracle Showcase Section
 * Premium promotional section highlighting key features
 * Showcases advanced diagnostic capabilities
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names are trademarks of their respective owners.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import OracleDemoVideo from '@/components/generator-oracle/OracleDemoVideo';

// Advanced Features
const ADVANCED_FEATURES = [
  {
    icon: '🤖',
    title: 'AI Predictive Failure',
    description: 'Predicts component failures before they happen',
    stats: 'Hours-to-failure prediction',
    color: '#06b6d4',
    benefit: 'Reduce unexpected downtime',
  },
  {
    icon: '🎮',
    title: '3D Engine Visualization',
    description: 'Animated engine with Exterior/Cutaway/X-Ray views',
    stats: 'Real-time component tracking',
    color: '#8b5cf6',
    benefit: 'Visual troubleshooting made easy',
  },
  {
    icon: '🌡️',
    title: 'Thermal Mapping System',
    description: 'Color-coded heat zones & temperature gradients',
    stats: 'Hotspot identification',
    color: '#ef4444',
    benefit: 'Prevent overheating issues',
  },
  {
    icon: '📊',
    title: 'Vibration Analysis',
    description: 'Real-time frequency spectrum analysis',
    stats: 'Bearing wear detection',
    color: '#22c55e',
    benefit: 'Early mechanical fault detection',
  },
  {
    icon: '🔮',
    title: 'Smart Parts Finder',
    description: 'Intelligent parts recommendations with pricing',
    stats: 'Priority-based suggestions',
    color: '#f59e0b',
    benefit: 'Find the right part quickly',
  },
  {
    icon: '📐',
    title: 'Professional Schematics',
    description: 'IEEE/IEC animated wiring diagrams',
    stats: '21 controllers, 7 circuit types',
    color: '#3b82f6',
    benefit: 'Clear electrical reference',
  },
];

// Core Features
const CORE_FEATURES = [
  { icon: '🔍', stat: '400,000+', label: 'Fault Codes', desc: 'Comprehensive database' },
  { icon: '⚡', stat: '9', label: 'Controller Types', desc: 'Wide compatibility' },
  { icon: '🔄', stat: '100%', label: 'Reset Pathways', desc: 'Step-by-step guides' },
  { icon: '📴', stat: '100%', label: 'Offline Ready', desc: 'No internet required' },
  { icon: '🌍', stat: '7+', label: 'Languages', desc: 'Including Arabic RTL' },
  { icon: '📱', stat: 'PWA', label: 'Install as App', desc: 'Phone, tablet, desktop' },
];

// Feature Highlights
const FEATURE_HIGHLIGHTS = [
  { feature: 'Multi-type compatibility', description: 'Compatible with DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, ENKO type controllers' },
  { feature: 'AI-powered diagnostics', description: 'Intelligent fault analysis and recommendations' },
  { feature: 'Offline capability', description: 'Works without internet connection' },
  { feature: 'Affordable pricing', description: 'One-time payment, no subscription fees' },
];

// Compatible controller types (50+ models from 9 types)
// DISCLAIMER: Not affiliated with any manufacturer
const COMPATIBLE_CONTROLLERS = [
  // Compatible with DSE type
  'DSE 7320 MKII', 'DSE 7310 MKII', 'DSE 6020 MKII', 'DSE 6120 MKII', 'DSE 4520', 'DSE 8610 MKII', 'DSE 8660 MKII',
  // Compatible with ComAp type
  'InteliLite NT', 'InteliGen NT', 'InteliSys NT', 'InteliMains NT',
  // Compatible with Woodward type
  'easYgen 3000', 'easYgen 2000', 'DTSC-200',
  // Compatible with SmartGen type
  'HGM6120', 'HGM7220', 'HGM9320', 'HGM9510',
  // Compatible with PowerWizard type
  'PowerWizard 1.0', 'PowerWizard 1.1', 'PowerWizard 2.0',
  // Compatible with Datakom type
  'DKG-109', 'DKG-307', 'DKG-509', 'D-500', 'D-700',
  // Compatible with Lovato type
  'RGK600', 'RGK800', 'ATL600', 'ATL900',
  // Compatible with Siemens type
  'SICAM A8000', 'SIPROTEC 7SJ', 'SIPROTEC 7UT', 'SENTRON PAC',
  // Compatible with ENKO type
  'GCU-100', 'GCU-300', 'GCU-500', 'AMF-100', 'SYNC-100',
];

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const numericPart = value.replace(/[^0-9]/g, '');
    const target = parseInt(numericPart) || 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplayValue(current.toLocaleString() + (value.includes('+') ? '+' : '') + suffix);

      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, suffix]);

  return <span>{displayValue}</span>;
}

// Feature Card
function FeatureCard({ feature, index }: { feature: typeof ADVANCED_FEATURES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{ backgroundColor: `${feature.color}30` }}
      />

      <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 h-full"
        style={{ borderColor: `${feature.color}50` }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
          style={{ backgroundColor: `${feature.color}20` }}
        >
          {feature.icon}
        </div>

        {/* Content */}
        <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
        <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
        <p className="text-sm font-medium mb-4" style={{ color: feature.color }}>{feature.stats}</p>

        {/* Benefit */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">Benefit:</span>
            <span className="text-slate-400">{feature.benefit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GeneratorOracleShowcase() {
  const [activeTab, setActiveTab] = useState<'features' | 'comparison'>('features');

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">
      {/* Epic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cyber grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Radial glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* HERO HEADER - Market Dominance Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-amber-500/20 border border-amber-500/50"
          >
            <span className="text-2xl">🔮</span>
            <span className="text-amber-400 text-lg font-black uppercase tracking-wider">
              Professional Diagnostic Tool
            </span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text">
              Generator Oracle
            </span>
          </h2>

          <p className="text-2xl sm:text-3xl text-slate-300 max-w-4xl mx-auto mb-6 font-light">
            Complete Generator Diagnostic Suite
          </p>

          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            A comprehensive diagnostic tool with <span className="text-cyan-400 font-bold">AI-Powered Analysis</span>,{' '}
            <span className="text-purple-400 font-bold">3D Visualization</span>,{' '}
            <span className="text-green-400 font-bold">Vibration Analysis</span>, and{' '}
            <span className="text-amber-400 font-bold">400,000+ fault codes</span> across{' '}
            <span className="text-white font-bold">5 major brands</span>.
          </p>
        </motion.div>

        {/* MASSIVE STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { value: '400,000+', label: 'Fault Codes', color: '#06b6d4' },
            { value: '6', label: 'Advanced Features', color: '#f59e0b' },
            { value: '21', label: 'Controllers Supported', color: '#22c55e' },
            { value: '5', label: 'Major Brands', color: '#8b5cf6' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800"
            >
              <div className="text-4xl sm:text-5xl font-black mb-2" style={{ color: stat.color }}>
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CINEMATIC DEMO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-bold">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-purple-500 rounded-full"
              />
              WATCH: See It In Action
            </span>
          </div>
          <OracleDemoVideo autoPlay={true} />
        </motion.div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-900/80 rounded-xl p-1 border border-slate-700">
            {[
              { id: 'features', label: 'Key Features', icon: '🚀' },
              { id: 'comparison', label: 'Why Choose Us', icon: '✓' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURES GRID */}
        <AnimatePresence mode="wait">
          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
              {ADVANCED_FEATURES.map((feature, idx) => (
                <FeatureCard key={feature.title} feature={feature} index={idx} />
              ))}
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {FEATURE_HIGHLIGHTS.map((item, idx) => (
                  <motion.div
                    key={item.feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-slate-900/50 rounded-xl border border-slate-700"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-green-400 text-2xl">✓</span>
                      <div>
                        <h4 className="text-white font-bold mb-2">{item.feature}</h4>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Value Statement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-500/30 rounded-2xl text-center"
              >
                <p className="text-xl text-white font-bold mb-2">
                  Built for Professional Technicians
                </p>
                <p className="text-slate-400">
                  Generator Oracle combines comprehensive fault databases with AI-powered diagnostics to help you troubleshoot faster.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORE FEATURES ROW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {CORE_FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors"
            >
              <span className="text-2xl mb-2 block">{feature.icon}</span>
              <div className="text-xl font-black text-cyan-400">{feature.stat}</div>
              <div className="text-white text-sm font-medium">{feature.label}</div>
              <div className="text-slate-500 text-xs">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* COMPATIBLE CONTROLLERS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center text-lg font-bold text-white mb-6">
            21 Controllers Supported Across 5 Major Brands
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {COMPATIBLE_CONTROLLERS.map((controller, i) => (
              <motion.span
                key={controller}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="px-3 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              >
                {controller}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* FREE TRIAL MEGA BANNER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-green-500/20 via-emerald-500/30 to-green-500/20 border-2 border-green-500/50 rounded-3xl p-8 text-center">
            {/* Animated shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                <span className="text-5xl">🎉</span>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white">FREE TRIAL ACCESS</div>
                  <div className="text-xl text-green-400 font-bold">Until April 1st, 2026</div>
                </div>
                <span className="text-5xl">🎉</span>
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Try Generator Oracle completely free during our launch period.
                Full access to all features. All 400,000+ fault codes. AI diagnostics included. No credit card required.
              </p>
              <p className="text-amber-400 font-bold mt-4">
                After trial: KES 5,000 one-time purchase
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/generator-oracle"
              className="group relative px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-black text-xl rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-green-700 transition-all shadow-2xl shadow-green-500/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">🔮</span>
                Launch Generator Oracle FREE
                <motion.span
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-8 max-w-2xl mx-auto">
            🔮 <span className="text-cyan-400">Professional-grade</span> diagnostic tool with AI Analysis, 3D Visualization, Thermal Mapping, and Vibration Analysis.
            <br />
            <span className="text-amber-400">Built for generator technicians in Africa.</span>
          </p>
        </motion.div>

        {/* Trademark Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-slate-800"
        >
          <p className="text-slate-600 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> Generator Oracle is an independent diagnostic assistant developed by Emerson EIMS.
            Compatible with controllers from DSE (Deep Sea Electronics), ComAp, Woodward, SmartGen, Caterpillar PowerWizard, Datakom, Lovato Electric, Siemens, and ENKO.
            These are trademarks of their respective owners. This tool is not affiliated with or endorsed by these companies.
            Feature comparisons based on publicly available product specifications as of 2024.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
