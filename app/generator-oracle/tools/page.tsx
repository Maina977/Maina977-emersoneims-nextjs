'use client';

/**
 * Generator Oracle Tools - Controller Simulators & Wiring Diagrams
 * Interactive tools for generator technicians
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ControllerSimulator, { CONTROLLER_TYPES } from '@/components/generator-oracle/ControllerSimulator';

// Define ControllerType from the exported CONTROLLER_TYPES
type ControllerType = keyof typeof CONTROLLER_TYPES;
import WiringDiagrams from '@/components/generator-oracle/WiringDiagrams';
import DetailedFaultDisplay, { DETAILED_FAULT_CODES } from '@/components/generator-oracle/DetailedFaultDisplay';
import { AnalogClock, AnalogCalendar, WeatherWidget } from '@/components/ui/AnalogWidgets';

export default function GeneratorOracleTools() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'wiring' | 'faults'>('simulator');
  const [selectedController, setSelectedController] = useState<ControllerType>('TYPE_A');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/generator-oracle" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Generator Oracle
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Advanced Tools</h1>
                <p className="text-slate-400 text-sm">Controller Simulators, Wiring Diagrams & More</p>
              </div>
            </div>

            {/* Widgets */}
            <div className="hidden lg:flex items-center gap-3">
              <AnalogClock size={60} />
              <AnalogCalendar />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Controller Type Selector */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Select Controller Type:</label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(CONTROLLER_TYPES) as ControllerType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedController(type)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedController === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {CONTROLLER_TYPES[type].name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'simulator', label: 'Controller Simulator', icon: '🎛️' },
            { id: 'wiring', label: 'Wiring Diagrams', icon: '📐' },
            { id: 'faults', label: 'Fault Analysis', icon: '🔍' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Controller Simulator</h2>
                <p className="text-slate-400 mb-4">
                  Enter your actual sensor readings below. The simulator will display them as they would appear on the controller,
                  helping you understand the relationship between physical values and controller display.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400">💡</span>
                    <div className="text-sm text-slate-300">
                      <strong className="text-amber-400">Pro Tip:</strong> Compare the simulated display with your actual controller.
                      If values don't match, the sensor or wiring may be faulty.
                    </div>
                  </div>
                </div>
              </div>

              <ControllerSimulator controllerType={selectedController} />
            </motion.div>
          )}

          {activeTab === 'wiring' && (
            <motion.div
              key="wiring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WiringDiagrams controllerType={selectedController} />
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Detailed Fault Analysis</h2>
                <p className="text-slate-400">
                  Each fault code includes comprehensive 2+ paragraph descriptions, diagnostic procedures,
                  step-by-step reset instructions, and repair solutions.
                </p>
              </div>

              <DetailedFaultDisplay faultCode={DETAILED_FAULT_CODES['190-0']} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Link href="/generator-oracle" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 hover:from-blue-500 hover:to-blue-600 transition-all">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-bold text-white">Fault Code Search</div>
            <div className="text-blue-200 text-sm">Search 90,000+ codes</div>
          </Link>
          <Link href="/maintenance-hub/solar" className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4 hover:from-amber-500 hover:to-orange-500 transition-all">
            <div className="text-2xl mb-2">☀️</div>
            <div className="font-bold text-white">Solar Maintenance</div>
            <div className="text-amber-200 text-sm">Solar diagnostics & repair</div>
          </Link>
          <Link href="/spare-parts" className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 hover:from-purple-500 hover:to-purple-600 transition-all">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-bold text-white">Spare Parts</div>
            <div className="text-purple-200 text-sm">1,560+ components</div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
