'use client';

/**
 * Generator Education Panel
 *
 * Displays educational content on generator pages:
 * - Common problems and solutions
 * - System knowledge articles
 * - Troubleshooting guides
 * - Links to full educational resources
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SYMPTOM_DIAGNOSES, SymptomDiagnosis, PossibleCause } from '@/lib/generator-oracle/educationalContent';

// Education categories for generators
const GENERATOR_EDUCATION_CATEGORIES = [
  {
    id: 'starting',
    title: 'Starting Problems',
    icon: '🔑',
    color: 'from-red-500 to-orange-500',
    description: 'Generator won\'t start, cranking issues, ignition problems',
    symptoms: ['Generator Won\'t Start', 'Cranks But Won\'t Fire', 'Slow Cranking']
  },
  {
    id: 'power',
    title: 'Power Output Issues',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-500',
    description: 'Voltage fluctuations, low power output, frequency problems',
    symptoms: ['Low Voltage Output', 'Unstable Frequency', 'Power Surges']
  },
  {
    id: 'overheating',
    title: 'Overheating & Cooling',
    icon: '🌡️',
    color: 'from-orange-500 to-red-600',
    description: 'High temperature, coolant issues, radiator problems',
    symptoms: ['Generator Overheating', 'High Coolant Temperature', 'Cooling Fan Not Working']
  },
  {
    id: 'fuel',
    title: 'Fuel System',
    icon: '⛽',
    color: 'from-green-500 to-emerald-500',
    description: 'Fuel delivery, filter issues, injection problems',
    symptoms: ['Fuel Delivery Issues', 'Engine Stalling', 'Black Smoke']
  },
  {
    id: 'oil',
    title: 'Lubrication & Oil',
    icon: '🛢️',
    color: 'from-amber-600 to-yellow-600',
    description: 'Low oil pressure, oil leaks, contamination',
    symptoms: ['Low Oil Pressure', 'Oil Leaks', 'Oil Contamination']
  },
  {
    id: 'electrical',
    title: 'Electrical Systems',
    icon: '🔌',
    color: 'from-blue-500 to-cyan-500',
    description: 'Battery, alternator, wiring, control panel',
    symptoms: ['Battery Problems', 'Alternator Failure', 'Control Panel Faults']
  },
];

// Quick tips for generator owners
const QUICK_TIPS = [
  {
    title: 'Weekly Checks',
    tips: [
      'Check oil level before starting',
      'Inspect coolant level',
      'Test battery voltage',
      'Look for fuel leaks',
      'Run generator under load for 30 minutes'
    ]
  },
  {
    title: 'Monthly Maintenance',
    tips: [
      'Clean air filter',
      'Check belt tension',
      'Inspect fuel filters',
      'Test automatic start',
      'Clean battery terminals'
    ]
  },
  {
    title: 'Warning Signs',
    tips: [
      'Unusual sounds or vibrations',
      'Black or white exhaust smoke',
      'Difficulty starting',
      'Fluctuating voltage',
      'Oil or coolant leaks'
    ]
  }
];

// Component for displaying a single symptom diagnosis
function SymptomCard({ diagnosis }: { diagnosis: SymptomDiagnosis }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            diagnosis.urgency === 'critical' ? 'bg-red-500/20 text-red-400' :
            diagnosis.urgency === 'high' ? 'bg-orange-500/20 text-orange-400' :
            diagnosis.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {diagnosis.urgency.toUpperCase()}
          </span>
          <h4 className="text-lg font-semibold text-white">{diagnosis.symptom}</h4>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            <div className="p-5 space-y-4">
              <p className="text-gray-300 text-sm">{diagnosis.description}</p>

              {/* Possible Causes */}
              <div>
                <h5 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <span>🔍</span> Possible Causes
                </h5>
                <div className="space-y-3">
                  {diagnosis.possibleCauses.slice(0, 4).map((cause) => (
                    <CauseItem key={cause.id} cause={cause} />
                  ))}
                </div>
              </div>

              {/* Preventive Measures */}
              {diagnosis.preventiveMeasures.length > 0 && (
                <div>
                  <h5 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <span>✅</span> Preventive Measures
                  </h5>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {diagnosis.preventiveMeasures.map((measure, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-500 mt-1">•</span>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="pt-3 border-t border-slate-700/50 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/254768860665?text=Hi, I need help with: ${encodeURIComponent(diagnosis.symptom)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Expert Help
                </a>
                <Link
                  href="/generator-oracle"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-medium transition-colors"
                >
                  Use Diagnostic Tool →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Component for displaying a single cause
function CauseItem({ cause }: { cause: PossibleCause }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left flex items-start justify-between gap-2"
      >
        <div className="flex items-start gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            cause.likelihood === 'high' ? 'bg-red-500/20 text-red-400' :
            cause.likelihood === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {cause.likelihood}
          </span>
          <span className="text-white font-medium text-sm">{cause.cause}</span>
        </div>
        <span className="text-gray-400 text-xs">{showDetails ? '−' : '+'}</span>
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-slate-700/50 space-y-3"
          >
            <p className="text-gray-400 text-sm">{cause.explanation}</p>

            <div>
              <p className="text-xs text-gray-500 mb-1">Check Procedure:</p>
              <ol className="list-decimal list-inside space-y-1">
                {cause.checkProcedure.slice(0, 4).map((step, i) => (
                  <li key={i} className="text-xs text-gray-300">{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-slate-700/50 rounded text-gray-300">
                ⏱️ {cause.estimatedTime}
              </span>
              <span className="px-2 py-1 bg-slate-700/50 rounded text-gray-300">
                📊 {cause.skillLevel}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Education Panel Component
export default function GeneratorEducationPanel() {
  const [activeCategory, setActiveCategory] = useState('starting');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter diagnoses based on search
  const filteredDiagnoses = SYMPTOM_DIAGNOSES.filter(d =>
    searchQuery === '' ||
    d.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="py-20 bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
            Knowledge Center
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
            Generator <span className="text-amber-400">Troubleshooting Guide</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Expert diagnostic information to help you understand and solve common generator problems.
            From starting issues to power output problems - we cover it all.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems... (e.g., 'won't start', 'overheating')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {GENERATOR_EDUCATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Problems List - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Common Problems & Solutions'}
            </h3>

            {filteredDiagnoses.length > 0 ? (
              filteredDiagnoses.slice(0, 6).map((diagnosis) => (
                <SymptomCard key={diagnosis.symptom} diagnosis={diagnosis} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No results found. Try a different search term.</p>
              </div>
            )}

            {/* View All Link */}
            <div className="text-center pt-4">
              <Link
                href="/generator-oracle"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-xl transition-all"
              >
                <span>Open Full Diagnostic Tool</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Tips Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips Cards */}
            {QUICK_TIPS.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 p-5"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  {idx === 0 && '📅'}
                  {idx === 1 && '🔧'}
                  {idx === 2 && '⚠️'}
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-amber-400 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 p-5"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Need Expert Help?</h4>
              <p className="text-gray-300 text-sm mb-4">
                Our technicians are available 24/7 to diagnose and repair your generator.
              </p>
              <a
                href="tel:+254768860665"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: +254 768 860 665
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export compact version for other pages
export function GeneratorEducationCompact() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📚</span> Generator Knowledge Center
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {GENERATOR_EDUCATION_CATEGORIES.slice(0, 4).map((cat) => (
          <Link
            key={cat.id}
            href={`/generator-oracle?category=${cat.id}`}
            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <p className="text-white font-medium text-sm">{cat.title}</p>
              <p className="text-gray-400 text-xs">{cat.description.slice(0, 40)}...</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/generator-oracle"
        className="block text-center text-amber-400 hover:text-amber-300 text-sm font-medium"
      >
        Explore All Topics →
      </Link>
    </div>
  );
}
