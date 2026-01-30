'use client';

/**
 * Generator Oracle Showcase Section
 * Premium promotional section for the Generator Oracle diagnostic tool
 * Highlights capabilities, features, and drives conversions
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

const ORACLE_FEATURES = [
  {
    icon: '🔍',
    stat: '20,000+',
    label: 'Fault Codes',
    desc: 'Comprehensive database',
  },
  {
    icon: '⚡',
    stat: '5',
    label: 'Controller Brands',
    desc: 'DSE, ComAp, Woodward, SmartGen, PowerWizard',
  },
  {
    icon: '🔄',
    stat: '100%',
    label: 'Reset Pathways',
    desc: 'Step-by-step clearing',
  },
  {
    icon: '📴',
    stat: '100%',
    label: 'Offline Ready',
    desc: 'Works without internet',
  },
];

const SUPPORTED_CONTROLLERS = [
  'DSE 4520', 'DSE 7320', 'DSE 8610', 'DSE 8620',
  'InteliLite NT', 'InteliGen NT', 'InteliSys NT',
  'EasyGen 3000', 'EasyGen 3500',
  'HGM6120', 'HGM6120N', 'HGM9320',
  'PowerWizard 1.0', 'PowerWizard 1.1', 'PowerWizard 2.0',
];

export default function GeneratorOracleShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)]" />

        {/* Side glows */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* NEW Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-cyan-500/30"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">New Premium Tool</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text">
              Generator Oracle
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-4">
            The Most Advanced Generator Diagnostic Tool in East Africa
          </p>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Instant fault code lookup, step-by-step reset pathways, and parameter-based diagnosis for all major controller brands.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Visual Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-amber-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

            {/* Preview Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Bar */}
              <div className="bg-slate-950/80 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-xl">🔮</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">Generator Oracle</div>
                    <div className="text-cyan-400 text-xs">Professional Diagnostics</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-400">ONLINE</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="flex items-center gap-3 bg-slate-950 rounded-lg border border-cyan-500/30 px-4 py-3">
                  <span className="text-cyan-500">{'>'}</span>
                  <span className="text-cyan-300 font-mono">E1234</span>
                  <span className="text-slate-600 ml-auto">Search 20,000+ codes</span>
                </div>

                {/* Sample Result */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-900/80 rounded-xl border border-cyan-500/20 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 font-mono font-bold">
                      E1234
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">
                      CRITICAL
                    </span>
                  </div>
                  <div className="text-white font-medium mb-2">Over Speed Shutdown</div>
                  <div className="text-slate-400 text-sm mb-3">Engine speed exceeded maximum safe limit</div>

                  {/* Reset Pathway Preview */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                      <span>🔄</span> Reset Pathway Available
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-slate-800 border border-cyan-500/50 rounded text-cyan-300 font-mono text-xs">STOP</span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-1 bg-slate-800 border border-cyan-500/50 rounded text-cyan-300 font-mono text-xs">RESET</span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-1 bg-slate-800 border border-cyan-500/50 rounded text-cyan-300 font-mono text-xs">START</span>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Row */}
                <div className="flex justify-around pt-4 border-t border-slate-700">
                  {['DSE', 'ComAp', 'Woodward', 'SmartGen', 'PWiz'].map((brand, i) => (
                    <motion.div
                      key={brand}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-cyan-400 font-bold text-sm">{brand}</div>
                      <div className="text-slate-500 text-xs">Supported</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              Why Technicians Love Generator Oracle
            </h3>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {ORACLE_FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-colors group"
                >
                  <span className="text-3xl mb-2 block">{feature.icon}</span>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{feature.stat}</div>
                  <div className="text-white font-medium text-sm">{feature.label}</div>
                  <div className="text-slate-500 text-xs">{feature.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Additional Benefits */}
            <div className="space-y-3 pt-4">
              {[
                '7 languages including Swahili & Arabic',
                'Parameter-based diagnosis with live readings',
                'Technician feedback loop for improved solutions',
                'Install as app - works on phone, tablet, desktop',
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Supported Controllers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-center text-lg font-medium text-slate-400 mb-6">
            Supported Controllers
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {SUPPORTED_CONTROLLERS.map((controller, i) => (
              <motion.span
                key={controller}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              >
                {controller}
              </motion.span>
            ))}
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 font-medium">
              +35 more models
            </span>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/generator-oracle"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🔮</span>
                Launch Generator Oracle
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </Link>

            <span className="text-slate-500">or</span>

            <Link
              href="/generator-oracle/purchase"
              className="px-8 py-4 bg-amber-500/10 text-amber-400 font-bold text-lg rounded-xl border-2 border-amber-500/50 hover:bg-amber-500/20 hover:border-amber-400 transition-all"
            >
              Get PRO License - KES 5,000
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            Free preview available • PRO unlocks all 20,000+ codes • Lifetime access
          </p>
        </motion.div>
      </div>
    </section>
  );
}
