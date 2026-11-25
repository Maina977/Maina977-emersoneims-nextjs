'use client';

/**
 * WITHDRAWN (safety withdrawal, management rule, 2026-11-25; review finding S8).
 *
 * The Repair Manuals > Repair Procedures and Fault Codes (Common Faults) views,
 * moved unchanged out of ControllerRepairManualsPanel.tsx. NOTHING MAY IMPORT
 * THIS FILE until they are corrected and independently re-verified: STOP first
 * for every shutdown alarm, no test-run / start-engine / rated-speed steps in
 * reset, safety precautions rendered first, every figure cited to an OEM source.
 * tests/regression/oracle-safety-withdrawal-2026-11-25.test.ts enforces that no
 * shipped source imports it.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ControllerManual } from '@/lib/generator-oracle/controller-repair-manuals';

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR PROCEDURES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export function RepairProceduresSection({ manual }: { manual: ControllerManual }) {
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {manual.repairProcedures.map((procedure) => (
        <div key={procedure.id} className="bg-slate-800/50 rounded-xl border border-amber-500/30 overflow-hidden">
          <button
            onClick={() => setExpandedProcedure(expandedProcedure === procedure.id ? null : procedure.id)}
            className="w-full px-4 py-3 flex items-start justify-between text-left"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold text-amber-400">{procedure.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  procedure.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  procedure.difficultyLevel === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                  procedure.difficultyLevel === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {procedure.difficultyLevel.toUpperCase()}
                </span>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs">
                  {procedure.estimatedTime}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Symptom: {procedure.symptom}</p>
            </div>
            <span className={`text-slate-400 transition-transform ${expandedProcedure === procedure.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {expandedProcedure === procedure.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  {/* Possible Causes */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-red-400 font-bold text-sm mb-2">🔍 Possible Causes</h5>
                    <ul className="space-y-1">
                      {procedure.possibleCauses.map((cause, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-red-400">•</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagnostic Steps */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-cyan-400 font-bold text-sm mb-2">🔬 Diagnostic Steps</h5>
                    <ol className="space-y-1">
                      {procedure.diagnosticSteps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-cyan-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Repair Steps */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-green-400 font-bold text-sm mb-2">🔧 Repair Steps</h5>
                    <ol className="space-y-1">
                      {procedure.repairSteps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-green-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Test Procedure */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-purple-400 font-bold text-sm mb-2">✅ Test Procedure</h5>
                    <ol className="space-y-1">
                      {procedure.testProcedure.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-purple-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Safety Precautions */}
                  <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                    <h5 className="text-red-400 font-bold text-sm mb-2">⚠️ Safety Precautions</h5>
                    <ul className="space-y-1">
                      {procedure.safetyPrecautions.map((precaution, i) => (
                        <li key={i} className="text-red-300 text-sm flex gap-2">
                          <span className="text-red-400">!</span> {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Parts and Tools */}
                  <div className="flex flex-wrap gap-2">
                    {procedure.partsNeeded.map((part, j) => (
                      <span key={j} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                        📦 {part}
                      </span>
                    ))}
                    {procedure.specialTools.map((tool, j) => (
                      <span key={j} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {manual.repairProcedures.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-2">📋</div>
          <p>Detailed repair procedures coming soon</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON FAULTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export function CommonFaultsSection({ manual }: { manual: ControllerManual }) {
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Numbers such as {manual.commonFaults[0]?.code || 'DSE-001'} are our reference numbers for this list. The controller display shows the alarm name: match it by the title.</p>
      {manual.commonFaults.map((fault) => (
        <div
          key={fault.code}
          className={`bg-slate-800/50 rounded-xl border overflow-hidden ${
            fault.severity === 'critical' ? 'border-red-500/50' :
            fault.severity === 'shutdown' ? 'border-orange-500/50' :
            'border-yellow-500/50'
          }`}
        >
          <button
            onClick={() => setExpandedFault(expandedFault === fault.code ? null : fault.code)}
            className="w-full px-4 py-3 flex items-start justify-between text-left"
          >
            <div className="flex items-start gap-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                fault.severity === 'shutdown' ? 'bg-orange-500/20 text-orange-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                <span className="sr-only">Reference </span>{fault.code}
              </span>
              <div>
                <div className="text-white font-medium">{fault.title}</div>
                <div className="text-slate-400 text-sm mt-1">{fault.description}</div>
              </div>
            </div>
            <span className={`text-slate-400 transition-transform ${expandedFault === fault.code ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {expandedFault === fault.code && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-amber-400 font-bold text-sm mb-2">🔍 Causes</h5>
                    <ul className="space-y-1">
                      {fault.causes.map((cause, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-amber-400">•</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-green-400 font-bold text-sm mb-2">✅ Solutions</h5>
                    <ul className="space-y-1">
                      {fault.solutions.map((solution, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-green-400">{i + 1}.</span> {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                    <h5 className="text-cyan-400 font-bold text-sm mb-2">🔄 Reset Procedure</h5>
                    <ol className="space-y-1">
                      {fault.resetProcedure.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-cyan-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {manual.commonFaults.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Fault code database for this controller coming soon</p>
        </div>
      )}
    </div>
  );
}

