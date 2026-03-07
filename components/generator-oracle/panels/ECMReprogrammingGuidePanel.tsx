'use client';

/**
 * ECM Reprogramming Guide Panel - INDEPENDENT REFERENCE
 *
 * DISCLAIMER: All procedures are independently developed based on general industry
 * knowledge. ECM/ECU model names are used for identification purposes only.
 * Generator Oracle is NOT affiliated with any equipment manufacturer.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReprogrammingGuide,
  ALL_ECM_REPROGRAMMING_GUIDES,
  getReprogrammingGuide,
  getAllManufacturers
} from '@/lib/generator-oracle/ecmReprogrammingGuides';
import { DisclaimerBanner, FooterDisclaimer } from '../DisclaimerBanner';

// ==================== COMPONENTS ====================

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
      }}
    >
      {children}
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🚨</span>
        <div className="text-red-400">{children}</div>
      </div>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-2xl">ℹ️</span>
        <div className="text-cyan-400">{children}</div>
      </div>
    </div>
  );
}

function StepCard({ step, phase, action, details, expectedResult, criticalNotes, timeEstimate, screenPath, recoveryAction }: {
  step: number;
  phase: string;
  action: string;
  details: string;
  expectedResult: string;
  criticalNotes: string[];
  timeEstimate: string;
  screenPath?: string;
  recoveryAction?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const phaseColors: Record<string, string> = {
    preparation: 'bg-blue-500',
    connection: 'bg-purple-500',
    backup: 'bg-yellow-500',
    programming: 'bg-orange-500',
    configuration: 'bg-green-500',
    verification: 'bg-cyan-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer hover:bg-slate-800/70 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${phaseColors[phase] || 'bg-slate-600'}`}>
              {step}
            </div>
            <span className="text-xs text-slate-500 mt-1 uppercase">{phase}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-lg">{action}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">{timeEstimate}</span>
                <span className="text-slate-400">{expanded ? '▼' : '▶'}</span>
              </div>
            </div>
            <p className="text-slate-400 mt-1">{details}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-4">
              {screenPath && (
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase mb-1">Navigation Path</p>
                  <p className="text-cyan-400 font-mono text-sm">{screenPath}</p>
                </div>
              )}

              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-green-500 uppercase mb-1">Expected Result</p>
                <p className="text-green-400">{expectedResult}</p>
              </div>

              {criticalNotes.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-xs text-yellow-500 uppercase mb-2">Critical Notes</p>
                  <ul className="space-y-1">
                    {criticalNotes.map((note, idx) => (
                      <li key={idx} className="text-yellow-400 text-sm flex items-start gap-2">
                        <span>⚠</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recoveryAction && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-500 uppercase mb-1">If Failed - Recovery Action</p>
                  <p className="text-red-400 text-sm">{recoveryAction}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GuideDisplay({ guide }: { guide: ReprogrammingGuide }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'connection' | 'programming' | 'parameters' | 'j1939' | 'troubleshooting'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <span className="text-3xl">💾</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{guide.ecmName}</h1>
          <p className="text-slate-400">{guide.manufacturer} | Models: {guide.models.join(', ')}</p>
        </div>
      </div>

      {/* Safety Warnings */}
      <WarningBox>
        <h4 className="font-semibold mb-2">CRITICAL SAFETY WARNINGS</h4>
        <ul className="space-y-1 text-sm">
          {guide.safetyWarnings.map((warning, idx) => (
            <li key={idx}>• {warning}</li>
          ))}
        </ul>
      </WarningBox>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'connection', label: 'Connection', icon: '🔌' },
          { id: 'programming', label: 'Programming Steps', icon: '💻' },
          { id: 'parameters', label: 'Parameters', icon: '⚙️' },
          { id: 'j1939', label: 'J1939 Setup', icon: '📡' },
          { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === section.id
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
              <p className="text-slate-300">{guide.overview}</p>
            </GlassCard>

            {/* Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">🔧 Required Tools</h3>
                <ul className="space-y-3">
                  {guide.prerequisites.tools.map((tool, idx) => (
                    <li key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{tool.name}</span>
                        {tool.essential && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">REQUIRED</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{tool.description}</p>
                      {tool.alternatives && tool.alternatives.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          Alternatives: {tool.alternatives.join(', ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">💿 Required Software</h3>
                <ul className="space-y-3">
                  {guide.prerequisites.software.map((sw, idx) => (
                    <li key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{sw.name}</span>
                        {sw.licenseRequired && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">LICENSE NEEDED</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Version: {sw.version}</p>
                      <p className="text-xs text-slate-500 mt-1">Source: {sw.source}</p>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Conditions */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">✓ Required Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {guide.prerequisites.conditions.map((condition, idx) => (
                  <span key={idx} className="px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/20">
                    {condition}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Common Mistakes */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {guide.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-red-400">✗</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {activeSection === 'connection' && (
          <motion.div
            key="connection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <InfoBox>
              <p>Follow these steps carefully to establish communication with the ECM. Incorrect connections can damage the ECM.</p>
            </InfoBox>

            {guide.connectionProcedure.map((step, idx) => (
              <GlassCard key={idx} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-2">{step.action}</h4>
                    <p className="text-slate-300 mb-4">{step.details}</p>

                    {step.pinout && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-cyan-400 mb-2">Connector Pinout:</h5>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-slate-400 border-b border-slate-700">
                                <th className="text-left py-2 px-3">Pin</th>
                                <th className="text-left py-2 px-3">Function</th>
                                <th className="text-left py-2 px-3">Wire Color</th>
                              </tr>
                            </thead>
                            <tbody>
                              {step.pinout.map((pin, pidx) => (
                                <tr key={pidx} className="border-b border-slate-800">
                                  <td className="py-2 px-3 font-mono text-cyan-400">{pin.pin}</td>
                                  <td className="py-2 px-3 text-white">{pin.function}</td>
                                  <td className="py-2 px-3 text-slate-400">{pin.wire}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {step.voltage && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                        <p className="text-sm text-green-400">
                          <span className="font-medium">Voltage Check:</span> {step.voltage}
                        </p>
                      </div>
                    )}

                    {step.warnings && step.warnings.length > 0 && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm font-medium text-yellow-400 mb-1">Warnings:</p>
                        <ul className="space-y-1">
                          {step.warnings.map((w, widx) => (
                            <li key={widx} className="text-sm text-yellow-300">⚠ {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeSection === 'programming' && (
          <motion.div
            key="programming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <WarningBox>
              <h4 className="font-semibold mb-2">BEFORE YOU START</h4>
              <ul className="text-sm space-y-1">
                <li>• Connect battery charger and verify voltage above 24V</li>
                <li>• Back up current ECM configuration FIRST</li>
                <li>• Do NOT interrupt programming process</li>
                <li>• Ensure stable power supply throughout</li>
              </ul>
            </WarningBox>

            <div className="space-y-3">
              {guide.reprogrammingProcedure.map((step, idx) => (
                <StepCard
                  key={idx}
                  step={step.step}
                  phase={step.phase}
                  action={step.action}
                  details={step.details}
                  expectedResult={step.expectedResult}
                  criticalNotes={step.criticalNotes}
                  timeEstimate={step.timeEstimate}
                  screenPath={step.screenPath}
                  recoveryAction={step.recoveryAction}
                />
              ))}
            </div>

            {/* Verification Checklist */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">✓ Verification Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {guide.verificationChecklist.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-600 text-green-500 focus:ring-green-500" />
                    <span className="text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeSection === 'parameters' && (
          <motion.div
            key="parameters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <InfoBox>
              <p>These parameters must be configured correctly after programming for proper engine operation.</p>
            </InfoBox>

            {guide.parameterConfiguration.map((category, cidx) => (
              <GlassCard key={cidx} className="p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">{category.category}</h3>
                <div className="space-y-4">
                  {category.parameters.map((param, pidx) => (
                    <div key={pidx} className="p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{param.name}</h4>
                        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">{param.unit}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{param.description}</p>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-slate-500">Default Value:</p>
                          <p className="text-green-400 font-mono">{param.defaultValue}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Valid Range:</p>
                          <p className="text-cyan-400 font-mono">{param.range}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-500 uppercase mb-1">Navigation Path</p>
                        <p className="text-cyan-400 font-mono text-sm">{param.path}</p>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-1">How to Set:</p>
                        <p className="text-sm text-slate-300">{param.howToSet}</p>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs text-yellow-500">Affects: {param.affectsWhat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeSection === 'j1939' && (
          <motion.div
            key="j1939"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">J1939 Communication Setup</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Protocol</p>
                  <p className="text-cyan-400 font-bold">{guide.j1939Setup.protocol}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Baud Rate</p>
                  <p className="text-cyan-400 font-bold">{guide.j1939Setup.baudRate.toLocaleString()} bps</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Source Address</p>
                  <p className="text-cyan-400 font-bold font-mono">{guide.j1939Setup.sourceAddress}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Termination</p>
                  <p className="text-cyan-400 font-bold">{guide.j1939Setup.terminationResistor.value}</p>
                </div>
              </div>

              {/* Termination Info */}
              <div className={`p-4 rounded-lg mb-6 ${
                guide.j1939Setup.terminationResistor.required
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-green-500/10 border border-green-500/30'
              }`}>
                <p className={guide.j1939Setup.terminationResistor.required ? 'text-yellow-400' : 'text-green-400'}>
                  <strong>Termination Resistor:</strong> {guide.j1939Setup.terminationResistor.required ? 'REQUIRED' : 'Built-in'}
                </p>
                <p className="text-sm text-slate-400 mt-1">Location: {guide.j1939Setup.terminationResistor.location}</p>
              </div>

              {/* Transmit PGNs */}
              <div className="mb-6">
                <h4 className="font-medium text-white mb-3">Transmitted PGNs (ECM → Controller)</h4>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700 bg-slate-800/50">
                        <th className="text-left py-3 px-4">PGN</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Rate</th>
                        <th className="text-left py-3 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guide.j1939Setup.transmitPGNs.map((pgn, idx) => (
                        <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4 font-mono text-cyan-400">{pgn.pgn}</td>
                          <td className="py-3 px-4 text-white font-medium">{pgn.name}</td>
                          <td className="py-3 px-4 text-slate-400">{pgn.rate}</td>
                          <td className="py-3 px-4 text-slate-400">{pgn.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wiring Diagram */}
              <div>
                <h4 className="font-medium text-white mb-3">Wiring Diagram</h4>
                <pre className="p-4 bg-slate-900 rounded-lg text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                  {guide.j1939Setup.wiringDiagram}
                </pre>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeSection === 'troubleshooting' && (
          <motion.div
            key="troubleshooting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {guide.troubleshooting.map((item, idx) => (
              <GlassCard key={idx} className="p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <span>❓</span> {item.problem}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400 mb-2">Possible Causes:</h4>
                    <ul className="space-y-1">
                      {item.possibleCauses.map((cause, cidx) => (
                        <li key={cidx} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-yellow-400">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-2">Solutions:</h4>
                    <ul className="space-y-1">
                      {item.solutions.map((solution, sidx) => (
                        <li key={sidx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ECMReprogrammingGuidePanel() {
  const [selectedGuide, setSelectedGuide] = useState<ReprogrammingGuide | null>(null);
  const [filterManufacturer, setFilterManufacturer] = useState<string>('all');

  const manufacturers = useMemo(() => getAllManufacturers(), []);

  const filteredGuides = useMemo(() => {
    if (filterManufacturer === 'all') return ALL_ECM_REPROGRAMMING_GUIDES;
    return ALL_ECM_REPROGRAMMING_GUIDES.filter(g => g.manufacturer === filterManufacturer);
  }, [filterManufacturer]);

  if (selectedGuide) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedGuide(null)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          ← Back to All Guides
        </button>
        <GuideDisplay guide={selectedGuide} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <DisclaimerBanner type="ecm" />

      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">💾</span>
              ECM/ECU Reprogramming Guides
            </h1>
            <p className="text-slate-400 mt-1">Independent reference - procedures based on general industry practice</p>
          </div>
          <select
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map(mfr => (
              <option key={mfr} value={mfr}>{mfr}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide) => (
          <motion.div
            key={guide.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGuide(guide)}
            className="cursor-pointer"
          >
            <GlassCard className="p-6 hover:border-amber-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{guide.ecmName}</h3>
                  <p className="text-amber-400 text-sm">{guide.manufacturer}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Models: {guide.models.slice(0, 3).join(', ')}
                    {guide.models.length > 3 && ` +${guide.models.length - 3} more`}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                      {guide.reprogrammingProcedure.length} steps
                    </span>
                    <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                      {guide.parameterConfiguration.reduce((sum, c) => sum + c.parameters.length, 0)} parameters
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      J1939 wiring included
                    </span>
                  </div>
                </div>
                <span className="text-slate-500">→</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <span className="text-4xl mb-4 block">📭</span>
          <p>No guides found for the selected manufacturer.</p>
        </div>
      )}
    </div>
  );
}
