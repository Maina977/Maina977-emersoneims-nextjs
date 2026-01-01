// components/diagnostics/DiagnosticMachine.tsx
'use client';

import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AllServicesQA = lazy(() => import('./AllServicesQA'));
const NineInOneCalculator = lazy(() => import('./NineInOneCalculator'));

// The 9 core services
const NINE_SERVICES = [
  {
    id: 'generators',
    name: 'Generators',
    icon: '⚡',
    description: 'Controls, Engine, Electricals diagnostics',
    subServices: ['Controls', 'Engine', 'Electricals'],
  },
  {
    id: 'solar',
    name: 'Solar',
    icon: '☀️',
    description: 'Panels, Batteries, Inverter diagnostics',
    subServices: ['Panels', 'Batteries', 'Inverter'],
  },
  {
    id: 'high-voltage',
    name: 'High Power Voltage & Infrastructure',
    icon: '🔌',
    description: 'Construction, Installation, Connection, Distribution, Maintenance',
    subServices: ['Construction & Installation', 'Connection & Distribution', 'Maintenance & Repairs', 'Safety & Compliance', 'Upgrades & Modernization'],
  },
  {
    id: 'motor-rewinding',
    name: 'Motor Rewinding',
    icon: '🔧',
    description: 'Motor coil replacement and optimization',
    subServices: ['Rewinding', 'Testing', 'Balancing'],
  },
  {
    id: 'ac',
    name: 'AC (Air Conditioning)',
    icon: '❄️',
    description: 'Cooling system diagnostics and maintenance',
    subServices: ['Compressor', 'Refrigerant', 'Controls'],
  },
  {
    id: 'ups',
    name: 'UPS Systems',
    icon: '🔋',
    description: 'Uninterruptible Power Supply diagnostics',
    subServices: ['Battery', 'Inverter', 'Transfer Switch'],
  },
  {
    id: 'borehole-pumps',
    name: 'Borehole Pumps',
    icon: '💧',
    description: 'Water pump system diagnostics',
    subServices: ['Pump Motor', 'Control Panel', 'Piping'],
  },
  {
    id: 'fabrications',
    name: 'Fabrications',
    icon: '🛠️',
    description: 'Canopies, Hammer Mills, Generator Canopies, Exhaust Pipes, Fuel Reserve Tanks, Automations',
    subServices: ['Canopies', 'Hammer Mills', 'Exhaust Pipes', 'Fuel Tanks', 'Automations'],
  },
  {
    id: 'hospital-incinerators',
    name: 'Hospital Incinerators Controls',
    icon: '🏥',
    description: 'Medical waste incinerator control systems',
    subServices: ['Temperature Control', 'Safety Systems', 'Emissions'],
  },
];

export default function DiagnosticMachine() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQA, setShowQA] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <section className="my-8" aria-labelledby="diagnostic-heading">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 id="diagnostic-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">Universal Diagnostic Machine</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Comprehensive diagnostics for all 9 services - with Q&A troubleshooting and advanced calculators
        </p>
      </div>

      {/* 9 Services Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8" 
        role="group" 
        aria-label="Select a service for diagnostics"
      >
        {NINE_SERVICES.map((service) => (
          <motion.button
            key={service.id}
            onClick={() => setActiveService(activeService === service.id ? null : service.id)}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            className={`p-4 sm:p-6 rounded-xl border transition-all text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black ${
              activeService === service.id
                ? 'bg-amber-500/20 border-amber-500/50'
                : 'bg-gray-900/60 border-gray-700 hover:border-amber-500/30'
            }`}
            aria-pressed={activeService === service.id}
            aria-label={`${service.name}: ${service.description}. ${service.subServices.length} sub-services available`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{service.icon}</span>
              <h3 className="text-base sm:text-lg font-bold text-white">{service.name}</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-3">{service.description}</p>
            <div className="flex flex-wrap gap-1" aria-label="Sub-services">
              {service.subServices.slice(0, 3).map((sub) => (
                <span key={sub} className="text-[10px] sm:text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                  {sub}
                </span>
              ))}
              {service.subServices.length > 3 && (
                <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-800 rounded text-amber-400">
                  +{service.subServices.length - 3} more
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8" role="group" aria-label="Diagnostic tools">
        <motion.button
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={() => setShowQA(!showQA)}
          className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            showQA
              ? 'bg-amber-500 text-black'
              : 'bg-gray-800 text-white border border-gray-700 hover:border-amber-500/50'
          }`}
          aria-expanded={showQA}
          aria-controls="qa-section"
          aria-label={showQA ? 'Close Q&A Troubleshooting' : 'Open Q&A Troubleshooting for all 9 services'}
        >
          <span aria-hidden="true">📋</span> {showQA ? 'Close' : 'Open'} Q&A Troubleshooting
        </motion.button>
        <motion.button
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={() => setShowCalculator(!showCalculator)}
          className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            showCalculator
              ? 'bg-cyan-500 text-black'
              : 'bg-gray-800 text-white border border-gray-700 hover:border-cyan-500/50'
          }`}
          aria-expanded={showCalculator}
          aria-controls="calculator-section"
          aria-label={showCalculator ? 'Close Advanced Calculator' : 'Open 9-in-1 Advanced Calculator'}
        >
          <span aria-hidden="true">🧮</span> {showCalculator ? 'Close' : 'Open'} Advanced Calculator
        </motion.button>
      </div>

      {/* Q&A Section */}
      <AnimatePresence>
        {showQA && (
          <motion.div
            id="qa-section"
            initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
            role="region"
            aria-label="Q&A Troubleshooting System"
          >
            <Suspense fallback={
              <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 text-center" role="status" aria-label="Loading Q&A system">
                <div className={`${prefersReducedMotion ? '' : 'animate-spin'} w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4`} aria-hidden="true" />
                <p className="text-gray-400">Loading Q&A System...</p>
              </div>
            }>
              <AllServicesQA />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calculator Section */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            id="calculator-section"
            initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
            role="region"
            aria-label="9-in-1 Electrical Calculator"
          >
            <Suspense fallback={
              <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 text-center" role="status" aria-label="Loading calculator">
                <div className={`${prefersReducedMotion ? '' : 'animate-spin'} w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4`} aria-hidden="true" />
                <p className="text-gray-400">Loading Calculator...</p>
              </div>
            }>
              <NineInOneCalculator />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Service Details */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
            className="p-4 sm:p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl border border-amber-500/30"
            role="region"
            aria-label="Selected service details"
          >
            {(() => {
              const service = NINE_SERVICES.find(s => s.id === activeService);
              if (!service) return null;
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl sm:text-4xl" aria-hidden="true">{service.icon}</span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{service.name}</h3>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3" role="list" aria-label="Available sub-services">
                    {service.subServices.map((sub) => (
                      <button
                        key={sub}
                        className="p-2 sm:p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-center hover:border-amber-500/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                        role="listitem"
                        aria-label={`${sub} diagnostics for ${service.name}`}
                      >
                        <span className="text-xs sm:text-sm text-white">{sub}</span>
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
