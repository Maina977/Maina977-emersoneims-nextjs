'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENERATOR ORACLE - ENGINE ROOM COMMAND CENTER
 * Generator Diagnostic Platform - manufacturer-curated fault codes
 * (counts are read from /api/generator-oracle/health, never hardcoded)
 * Sci-Fi Cockpit Interface with Detailed Fault Analysis
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';
// SAFETY WITHDRAWAL (management rule, 2026-11-25; review finding S3). This page used to read
// lib/generator-oracle/data/comprehensive-faults-index.ts (ENHANCED_FAULT_DATABASE) and its
// pop-up showed that data's diagnostics, reset steps, repair guide, AI insights, case studies
// and figures. It now reads only the identification list (code, title, severity, category);
// the pop-up shows the shared notice in place of the withdrawn content. Previous version:
//   git show fa565ab1:app/maintenance-hub/generators/page.tsx
import {
  GENERATOR_FAULT_IDENTIFICATION,
  searchGeneratorFaultIdentification,
  generatorFaultCategories,
  type GeneratorFaultIdentification,
} from '@/lib/maintenance-hub/generator-fault-identification';
import OracleSafetyWithdrawnNotice from '@/components/generator-oracle/OracleSafetyWithdrawnNotice';

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATOR BRANDS
// ═══════════════════════════════════════════════════════════════════════════════
const GENERATOR_BRANDS = [
  { name: 'Cummins', logo: 'C', color: '#c41230' },
  { name: 'Caterpillar', logo: 'CAT', color: '#ffcd00' },
  { name: 'Perkins', logo: 'P', color: '#003366' },
  { name: 'FG Wilson', logo: 'FG', color: '#00a651' },
  { name: 'SDMO', logo: 'S', color: '#e31937' },
  { name: 'Kohler', logo: 'K', color: '#1a1a1a' },
  { name: 'MTU', logo: 'MTU', color: '#0033a0' },
  { name: 'Volvo Penta', logo: 'VP', color: '#003057' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const EngineRPMGauge = ({ value = 1500, max = 2000 }: { value?: number; max?: number }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="56" fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="64" cy="64" r="56" fill="none"
          stroke={percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : '#22c55e'}
          strokeWidth="8"
          strokeDasharray={`${percentage * 3.52} 352`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-cyan-400">{Math.round(value)}</div>
        <div className="text-xs text-gray-500">RPM</div>
      </div>
    </div>
  );
};

const PowerMeter = ({ value = 450, max = 500 }: { value?: number; max?: number }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>POWER OUTPUT</span>
        <span>{Math.round(value)} kW</span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #22c55e, #eab308, #ef4444)',
            width: `${percentage}%`
          }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StatusIndicator = ({ status, label }: { status: 'online' | 'warning' | 'error'; label: string }) => {
  const colors = {
    online: 'bg-green-500 shadow-green-500/50',
    warning: 'bg-yellow-500 shadow-yellow-500/50',
    error: 'bg-red-500 shadow-red-500/50 animate-pulse',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[status]} shadow-lg`} />
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE FAULT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════════
// Identification only (code, title, severity, category). The procedural content that was
// here is withdrawn and the shared notice is shown in its place.
const ComprehensiveFaultModal = ({
  fault,
  onClose
}: {
  fault: GeneratorFaultIdentification | null;
  onClose: () => void;
}) => {
  if (!fault) return null;

  const severityColors = {
    emergency: 'border-red-600 bg-red-900/30',
    shutdown: 'border-red-500 bg-red-900/20',
    critical: 'border-orange-500 bg-orange-900/20',
    warning: 'border-yellow-500 bg-yellow-900/20',
    info: 'border-blue-500 bg-blue-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen py-8 px-4">
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className={`max-w-5xl mx-auto ${severityColors[fault.severity]} border-2 rounded-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-mono font-bold text-amber-400">{fault.code}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    fault.severity === 'emergency' || fault.severity === 'shutdown' ? 'bg-red-500 text-white' :
                    fault.severity === 'critical' ? 'bg-orange-500 text-white' :
                    fault.severity === 'warning' ? 'bg-yellow-500 text-black' :
                    'bg-blue-500 text-white'
                  }`}>
                    {fault.severity}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{fault.title}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                  <span>Category: {fault.category}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content: withdrawn (safety withdrawal 2026-11-25) */}
          <div className="p-6 space-y-6 bg-slate-900/50">
            <OracleSafetyWithdrawnNotice surface="maintenance-hub-generators-fault-detail" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function GeneratorOracle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFault, setSelectedFault] = useState<GeneratorFaultIdentification | null>(null);
  const [simulatedRPM, setSimulatedRPM] = useState(1500);
  const [simulatedPower, setSimulatedPower] = useState(450);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayLimit, setDisplayLimit] = useState(12);

  const totalFaultCodes = GENERATOR_FAULT_IDENTIFICATION.length;
  const categories = useMemo(() => generatorFaultCategories(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedRPM(prev => 1480 + Math.random() * 40);
      setSimulatedPower(prev => 440 + Math.random() * 20);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredFaults = useMemo(() => {
    let faults = searchGeneratorFaultIdentification(searchQuery);

    if (selectedCategory !== 'all') {
      faults = faults.filter(f => f.category === selectedCategory);
    }

    return faults;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950/20">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/maintenance-hub" className="text-amber-400 hover:text-amber-300 text-sm mb-2 inline-flex items-center gap-2">
              ← Back to Command Bridge
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                GENERATOR
              </span>
              <span className="text-white ml-3">ORACLE</span>
            </motion.h1>
            <p className="text-slate-400 mt-2">Generator Diagnostic Platform</p>
          </div>

          {/* Live gauges */}
          <div className="hidden lg:flex items-center gap-6">
            <EngineRPMGauge value={simulatedRPM} />
            <div className="space-y-2">
              <StatusIndicator status="online" label="Engine Running" />
              <StatusIndicator status="online" label="Oil Pressure OK" />
              <StatusIndicator status="online" label="Coolant Temp OK" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{totalFaultCodes}</div>
            <div className="text-slate-400 text-sm">Fault Codes</div>
          </div>
        </motion.div>

        {/* Search and filters */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-amber-500/30 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search fault codes and titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generator brands */}
        <div className="mb-8">
          <h3 className="text-slate-400 text-sm mb-3">Supported Brands:</h3>
          <div className="flex flex-wrap gap-3">
            {GENERATOR_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.logo}
                </div>
                <span className="text-slate-300 text-sm">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fault codes grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaults.slice(0, displayLimit).map((fault) => (
            <motion.div
              key={fault.code}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedFault(fault)}
              className={`bg-slate-900/80 rounded-xl p-4 border cursor-pointer transition-all hover:border-amber-500/50 ${
                fault.severity === 'emergency' || fault.severity === 'shutdown' ? 'border-red-500/30' :
                fault.severity === 'critical' ? 'border-orange-500/30' :
                fault.severity === 'warning' ? 'border-yellow-500/30' :
                'border-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl font-mono font-bold text-amber-400">{fault.code}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  fault.severity === 'emergency' || fault.severity === 'shutdown' ? 'bg-red-500/20 text-red-400' :
                  fault.severity === 'critical' ? 'bg-orange-500/20 text-orange-400' :
                  fault.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {fault.severity?.toUpperCase()}
                </span>
              </div>
              <h4 className="text-white font-semibold mb-2">{fault.title}</h4>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">{fault.category}</span>
                <span className="text-amber-400 text-xs">Click for details →</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFaults.length > displayLimit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setDisplayLimit(prev => prev + 12)}
              className="px-6 py-3 bg-amber-500/20 text-amber-400 rounded-lg font-bold hover:bg-amber-500/30 transition-colors border border-amber-500/50"
            >
              Load More Fault Codes ({filteredFaults.length - displayLimit} more)
            </button>
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            GENERATOR ORACLE v3.0 | Generator Diagnostic Database
          </p>
          <p className="text-amber-400/50 text-xs mt-2">
            {totalFaultCodes} Fault Codes | 8+ Generator Brands
          </p>
        </motion.div>
        {/*
          Callout request, added 2026-08-25.
          Someone reading this page has a generator that is not working right
          now. That is the highest-intent visitor on the site, and until today
          the page gave them nothing to do about it — no form, no number, only
          a fault-code list. Placed after the results so it meets them at the
          point where they have found their code and want an engineer.
        */}
        <section className="mt-16 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-black p-7 sm:p-10">
          <h2 className="text-2xl font-bold text-white">Still showing the fault?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Codes tell you what the controller sees, not always what is wrong. If the fault
            persists, send us the code and the make — an engineer will
            tell you what it usually means on that machine before anyone is dispatched.
          </p>
          <div className="mt-7 max-w-xl">
            <QuickInquiryForm
              service="Generator Repair"
              ctaLabel="Request an engineer"
              source="maintenance-hub-generators"
            />
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Breakdown that cannot wait? Call{' '}
            <a href="tel:+254768860665" className="font-semibold text-amber-400 hover:underline">
              +254 768 860 665
            </a>{' '}
            — mobile workshop covers all 47 counties.
          </p>
        </section>
      </div>

      {/* Fault detail modal */}
      <AnimatePresence>
        {selectedFault && (
          <ComprehensiveFaultModal
            fault={selectedFault}
            onClose={() => setSelectedFault(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
