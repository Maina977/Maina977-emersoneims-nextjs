'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENERATOR ORACLE - ENGINE ROOM COMMAND CENTER
 * World's Most Comprehensive Generator Diagnostic Platform
 * Sci-Fi Cockpit Interface with Detailed Fault Analysis
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ALL_COMPREHENSIVE_FAULTS,
  searchComprehensiveFaults,
  getFaultByCode,
  getCategories,
  getDatabaseStats,
  type EnhancedFaultCode
} from '@/lib/generator-oracle/data/comprehensive-faults-index';

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
const ComprehensiveFaultModal = ({
  fault,
  onClose
}: {
  fault: EnhancedFaultCode | null;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics' | 'reset' | 'repair' | 'insights'>('overview');

  if (!fault) return null;

  const severityColors = {
    emergency: 'border-red-600 bg-red-900/30',
    shutdown: 'border-red-500 bg-red-900/20',
    critical: 'border-orange-500 bg-orange-900/20',
    warning: 'border-yellow-500 bg-yellow-900/20',
    info: 'border-blue-500 bg-blue-900/20',
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
    { id: 'reset', label: 'Reset Steps', icon: '🔄' },
    { id: 'repair', label: 'Repair Guide', icon: '🔧' },
    { id: 'insights', label: 'AI Insights', icon: '🤖' },
  ];

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
                  <span>•</span>
                  <span>Subcategory: {fault.subcategory}</span>
                  <span>•</span>
                  <span>Alt codes: {fault.alternativeCodes?.join(', ')}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 bg-slate-900/50">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Technical Overview - 4+ paragraphs */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span>📖</span> Technical Overview
                  </h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed">
                    {fault.technicalOverview?.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* System Impact - 4+ paragraphs */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-red-500/30">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <span>⚠️</span> System Impact
                  </h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed">
                    {fault.systemImpact?.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Safety Considerations - 4+ paragraphs */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-yellow-500/30">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <span>🛡️</span> Safety Considerations
                  </h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed">
                    {fault.safetyConsiderations?.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Root Causes with Probabilities */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <span>🎯</span> Root Causes Analysis
                  </h3>
                  <div className="space-y-4">
                    {fault.rootCauses?.map((cause, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{cause.cause}</h4>
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm font-bold">
                            {cause.probability}% likely
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{cause.explanation}</p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-cyan-400 font-semibold">Test Method:</span>
                            <p className="text-slate-400">{cause.testMethod}</p>
                          </div>
                          <div>
                            <span className="text-cyan-400 font-semibold">Time to Test:</span>
                            <p className="text-slate-400">{cause.timeToTest}</p>
                          </div>
                        </div>
                        {cause.symptomsIndicating && (
                          <div className="mt-3">
                            <span className="text-yellow-400 font-semibold text-sm">Symptoms:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {cause.symptomsIndicating.map((symptom, j) => (
                                <span key={j} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Context */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span>📚</span> Historical Context
                  </h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed">
                    {fault.historicalContext?.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* DIAGNOSTICS TAB */}
            {activeTab === 'diagnostics' && (
              <>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/30">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span>🔍</span> Step-by-Step Diagnostic Procedures
                  </h3>
                  <div className="space-y-6">
                    {fault.diagnosticProcedures?.map((proc, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-5 border border-slate-600">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                            {proc.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-2">{proc.title}</h4>
                            <p className="text-slate-300 mb-4">{proc.instruction}</p>

                            {proc.safetyWarning && (
                              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
                                <span className="text-red-400 font-semibold">⚠️ Safety Warning:</span>
                                <p className="text-red-300 text-sm mt-1">{proc.safetyWarning}</p>
                              </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <span className="text-cyan-400 font-semibold">Tools Required:</span>
                                <ul className="text-slate-400 mt-1">
                                  {proc.toolsRequired?.map((tool, j) => (
                                    <li key={j}>• {tool}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <span className="text-cyan-400 font-semibold">Expected Result:</span>
                                <p className="text-slate-400 mt-1">{proc.expectedResult}</p>
                              </div>
                              <div className="bg-green-900/30 rounded-lg p-3">
                                <span className="text-green-400 font-semibold">If Passed:</span>
                                <p className="text-green-300 text-sm mt-1">{proc.ifPassed}</p>
                              </div>
                              <div className="bg-red-900/30 rounded-lg p-3">
                                <span className="text-red-400 font-semibold">If Failed:</span>
                                <p className="text-red-300 text-sm mt-1">{proc.ifFailed}</p>
                              </div>
                            </div>

                            {proc.technicalNote && (
                              <div className="mt-4 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                                <span className="text-amber-400 font-semibold">📝 Technical Note:</span>
                                <p className="text-amber-200 text-sm mt-1">{proc.technicalNote}</p>
                              </div>
                            )}

                            <div className="mt-3 text-slate-500 text-sm">
                              Estimated time: {proc.estimatedTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* RESET STEPS TAB */}
            {activeTab === 'reset' && (
              <>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-green-500/30">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <span>🔄</span> Controller Reset Sequences
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Select your controller type below for specific reset instructions.
                  </p>

                  <div className="space-y-6">
                    {/* DSE Controllers */}
                    {fault.resetSequences?.TYPE_A && (
                      <div className="bg-slate-900/50 rounded-lg p-5 border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">DSE</span>
                          Deep Sea Electronics (DSE 7xxx, 8xxx Series)
                        </h4>
                        <ol className="space-y-2 mb-4">
                          {fault.resetSequences.TYPE_A.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="bg-blue-900/30 rounded-lg p-3 mb-3">
                          <span className="text-blue-400 font-semibold">Key Sequence:</span>
                          <div className="flex gap-2 mt-2">
                            {fault.resetSequences.TYPE_A.keySequence.map((key, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-500/30 border border-blue-500/50 rounded text-blue-300 font-mono text-sm">
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm italic">{fault.resetSequences.TYPE_A.notes}</p>
                      </div>
                    )}

                    {/* ComAp Controllers */}
                    {fault.resetSequences?.TYPE_B && (
                      <div className="bg-slate-900/50 rounded-lg p-5 border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">CA</span>
                          ComAp (InteliLite, InteliGen Series)
                        </h4>
                        <ol className="space-y-2 mb-4">
                          {fault.resetSequences.TYPE_B.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="bg-green-900/30 rounded-lg p-3 mb-3">
                          <span className="text-green-400 font-semibold">Key Sequence:</span>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {fault.resetSequences.TYPE_B.keySequence.map((key, i) => (
                              <span key={i} className="px-3 py-1 bg-green-500/30 border border-green-500/50 rounded text-green-300 font-mono text-sm">
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm italic">{fault.resetSequences.TYPE_B.notes}</p>
                      </div>
                    )}

                    {/* Woodward Controllers */}
                    {fault.resetSequences?.TYPE_C && (
                      <div className="bg-slate-900/50 rounded-lg p-5 border border-purple-500/30">
                        <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">WW</span>
                          Woodward (easYgen Series)
                        </h4>
                        <ol className="space-y-2 mb-4">
                          {fault.resetSequences.TYPE_C.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <p className="text-slate-500 text-sm italic">{fault.resetSequences.TYPE_C.notes}</p>
                      </div>
                    )}

                    {/* SmartGen Controllers */}
                    {fault.resetSequences?.TYPE_D && (
                      <div className="bg-slate-900/50 rounded-lg p-5 border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">SG</span>
                          SmartGen (HGM Series)
                        </h4>
                        <ol className="space-y-2 mb-4">
                          {fault.resetSequences.TYPE_D.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <p className="text-slate-500 text-sm italic">{fault.resetSequences.TYPE_D.notes}</p>
                      </div>
                    )}

                    {/* CAT EMCP Controllers */}
                    {fault.resetSequences?.TYPE_E && (
                      <div className="bg-slate-900/50 rounded-lg p-5 border border-yellow-500/30">
                        <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-black text-xs font-bold">CAT</span>
                          Caterpillar (EMCP Series)
                        </h4>
                        <ol className="space-y-2 mb-4">
                          {fault.resetSequences.TYPE_E.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <p className="text-slate-500 text-sm italic">{fault.resetSequences.TYPE_E.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* REPAIR GUIDE TAB */}
            {activeTab === 'repair' && (
              <>
                {fault.repairProcedures?.map((repair, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-5 border border-green-500/30">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                        <span>🔧</span> {repair.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        repair.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        repair.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        repair.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {repair.difficulty}
                      </span>
                    </div>

                    {/* Repair Info */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-cyan-400">{repair.estimatedTime}</div>
                        <div className="text-slate-500 text-sm">Time Required</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          KES {repair.laborCost?.min?.toLocaleString()}-{repair.laborCost?.max?.toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-sm">Labor Cost</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-amber-400">
                          KES {repair.partsCost?.min?.toLocaleString()}-{repair.partsCost?.max?.toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-sm">Parts Cost</div>
                      </div>
                    </div>

                    {/* Parts Required */}
                    {repair.partsRequired && repair.partsRequired.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-amber-400 font-semibold mb-3">Parts Required:</h4>
                        <div className="space-y-2">
                          {repair.partsRequired.map((part, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <span className="text-white font-medium">{part.name}</span>
                                <span className="text-slate-500 ml-2">(Qty: {part.quantity})</span>
                                <div className="text-slate-500 text-xs">OEM: {part.oemPartNumber}</div>
                              </div>
                              <span className="text-green-400 font-bold">KES {part.estimatedCost?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools Required */}
                    {repair.toolsRequired && (
                      <div className="mb-6">
                        <h4 className="text-cyan-400 font-semibold mb-3">Tools Required:</h4>
                        <div className="flex flex-wrap gap-2">
                          {repair.toolsRequired.map((tool, i) => (
                            <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded text-sm">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Repair Steps - Detailed 5+ paragraph solutions */}
                    <div className="mb-6">
                      <h4 className="text-green-400 font-semibold mb-3">Step-by-Step Repair Procedure:</h4>
                      <div className="space-y-4">
                        {repair.steps?.map((step, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-start gap-3">
                              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {step.step}
                              </span>
                              <div className="flex-1">
                                <p className="text-slate-300">{step.instruction}</p>
                                {step.warning && (
                                  <div className="mt-2 bg-red-900/30 border border-red-500/50 rounded p-2 text-red-300 text-sm">
                                    ⚠️ {step.warning}
                                  </div>
                                )}
                                {step.tip && (
                                  <div className="mt-2 bg-blue-900/30 border border-blue-500/50 rounded p-2 text-blue-300 text-sm">
                                    💡 {step.tip}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification Steps */}
                    {repair.verificationSteps && (
                      <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                        <h4 className="text-green-400 font-semibold mb-3">✅ Verification Checklist:</h4>
                        <ul className="space-y-2">
                          {repair.verificationSteps.map((step, i) => (
                            <li key={i} className="flex items-center gap-2 text-green-300">
                              <span>☐</span> {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Prevention Strategies */}
                {fault.preventionStrategies && (
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-blue-500/30">
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <span>🛡️</span> Prevention Strategies
                    </h3>
                    <ul className="space-y-2">
                      {fault.preventionStrategies.map((strategy, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-blue-400 mt-1">▸</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Maintenance Schedule */}
                {fault.maintenanceSchedule && (
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <span>📅</span> Maintenance Schedule
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-600">
                            <th className="text-left py-2 text-slate-400">Interval</th>
                            <th className="text-left py-2 text-slate-400">Task</th>
                            <th className="text-left py-2 text-slate-400">Importance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fault.maintenanceSchedule.map((item, i) => (
                            <tr key={i} className="border-b border-slate-700">
                              <td className="py-2 text-purple-400 font-medium">{item.interval}</td>
                              <td className="py-2 text-slate-300">{item.task}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  item.importance === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  item.importance === 'important' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {item.importance}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* AI INSIGHTS TAB */}
            {activeTab === 'insights' && (
              <>
                {/* AI Pattern Analysis */}
                {fault.aiInsights && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-5 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <span>🤖</span> AI-Powered Pattern Analysis
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-6">{fault.aiInsights.patternAnalysis}</p>

                    {/* Predictive Indicators */}
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                      <h4 className="text-cyan-400 font-semibold mb-3">📊 Predictive Indicators:</h4>
                      <ul className="space-y-2">
                        {fault.aiInsights.predictiveIndicators?.map((indicator, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                            <span className="text-cyan-400 mt-1">▸</span>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Environmental & Seasonal Factors */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-semibold mb-2">🌦️ Seasonal Factors:</h4>
                        <p className="text-slate-400 text-sm">{fault.aiInsights.seasonalFactors}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">🌍 Environmental Factors:</h4>
                        <p className="text-slate-400 text-sm">{fault.aiInsights.environmentalFactors}</p>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4">
                      <h4 className="text-cyan-400 font-semibold mb-3">💡 AI Recommendations:</h4>
                      <ul className="space-y-2">
                        {fault.aiInsights.recommendations?.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-cyan-300 text-sm">
                            <span className="text-cyan-400 mt-1">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Case Studies */}
                {fault.caseStudies && fault.caseStudies.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-amber-500/30">
                    <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <span>📖</span> Real-World Case Studies from Kenya
                    </h3>
                    <div className="space-y-6">
                      {fault.caseStudies.map((study, i) => (
                        <div key={i} className="bg-slate-900/50 rounded-lg p-5 border border-slate-600">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📍</span>
                            <div>
                              <h4 className="text-white font-bold">{study.location}</h4>
                              <p className="text-slate-500 text-sm">{study.generatorModel}</p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-red-400 font-semibold">Symptom:</span>
                              <p className="text-slate-300 mt-1">{study.symptom}</p>
                            </div>
                            <div>
                              <span className="text-cyan-400 font-semibold">Diagnosis:</span>
                              <p className="text-slate-300 mt-1">{study.diagnosis}</p>
                            </div>
                            <div>
                              <span className="text-green-400 font-semibold">Solution:</span>
                              <p className="text-slate-300 mt-1">{study.solution}</p>
                            </div>
                            <div className="bg-amber-900/30 rounded-lg p-3">
                              <span className="text-amber-400 font-semibold">💡 Lessons Learned:</span>
                              <p className="text-amber-200 mt-1">{study.lessonsLearned}</p>
                            </div>
                            <div className="text-slate-500">
                              Resolution time: {study.timeToResolve}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {fault.frequentlyAskedQuestions && fault.frequentlyAskedQuestions.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>❓</span> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {fault.frequentlyAskedQuestions.map((faq, i) => (
                        <div key={i} className="bg-slate-900/50 rounded-lg p-4">
                          <h4 className="text-cyan-400 font-semibold mb-2">{faq.question}</h4>
                          <p className="text-slate-300 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
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
  const [selectedFault, setSelectedFault] = useState<EnhancedFaultCode | null>(null);
  const [simulatedRPM, setSimulatedRPM] = useState(1500);
  const [simulatedPower, setSimulatedPower] = useState(450);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stats = useMemo(() => getDatabaseStats(), []);
  const categories = useMemo(() => getCategories(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedRPM(prev => 1480 + Math.random() * 40);
      setSimulatedPower(prev => 440 + Math.random() * 20);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredFaults = useMemo(() => {
    let faults = Object.values(ALL_COMPREHENSIVE_FAULTS);

    if (searchQuery) {
      faults = searchComprehensiveFaults(searchQuery);
    }

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
            <p className="text-slate-400 mt-2">World's Most Comprehensive Generator Diagnostic Platform</p>
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
            <div className="text-3xl font-bold text-amber-400">{stats.totalFaultCodes}+</div>
            <div className="text-slate-400 text-sm">Fault Codes</div>
          </div>
          <div className="bg-slate-900/80 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.totalDiagnosticSteps}+</div>
            <div className="text-slate-400 text-sm">Diagnostic Steps</div>
          </div>
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">{stats.totalRepairProcedures}+</div>
            <div className="text-slate-400 text-sm">Repair Procedures</div>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.totalCaseStudies}+</div>
            <div className="text-slate-400 text-sm">Case Studies</div>
          </div>
        </motion.div>

        {/* Search and filters */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-amber-500/30 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search fault codes, descriptions, symptoms..."
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
          {filteredFaults.slice(0, 12).map((fault) => (
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
              <p className="text-slate-400 text-sm line-clamp-2">{fault.technicalOverview?.slice(0, 150)}...</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">{fault.category}</span>
                <span className="text-amber-400 text-xs">Click for full analysis →</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFaults.length > 12 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-amber-500/20 text-amber-400 rounded-lg font-bold hover:bg-amber-500/30 transition-colors border border-amber-500/50">
              Load More Fault Codes ({filteredFaults.length - 12} more)
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
            GENERATOR ORACLE v3.0 | World's Most Comprehensive Generator Diagnostic Database
          </p>
          <p className="text-amber-400/50 text-xs mt-2">
            {stats.totalFaultCodes}+ Fault Codes | {stats.totalRootCauses}+ Root Causes | {stats.totalDiagnosticSteps}+ Diagnostic Steps | 8+ Generator Brands
          </p>
        </motion.div>
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
