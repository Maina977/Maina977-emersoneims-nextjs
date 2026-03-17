'use client';

/**
 * Complete Diagnostic Panel - INDEPENDENT REFERENCE
 *
 * DISCLAIMER: All diagnostic procedures and fault code interpretations are
 * independently developed. Brand names used for identification only.
 * Generator Oracle is NOT affiliated with any equipment manufacturer.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DiagnosticInput,
  CompleteSolution,
  ECMReprogrammingGuide,
  interpretDiagnosticInput,
  getSolutionById,
  getSolutionsByCategory,
  searchSolutions,
  getECMReprogrammingGuide,
  getAllECMGuides,
  COMPLETE_SOLUTIONS,
  ECM_REPROGRAMMING_GUIDES
} from '@/lib/generator-oracle/completeDiagnosticSolutions';
import {
  searchAllFaultCodes,
  getTotalFaultCodeCount,
  searchControllerFaults,
  getFaultCodesByBrand,
  CONTROLLER_BRANDS,
  type ControllerFaultCode
} from '@/lib/generator-oracle/integratedDiagnosticService';
import { DisclaimerBanner } from '../DisclaimerBanner';

// ==================== COMPONENTS ====================

function GlassCard({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden
        ${glow ? 'shadow-lg shadow-cyan-500/20' : 'shadow-lg shadow-black/20'}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
      }}
    >
      {children}
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    emergency: 'bg-red-600/30 text-red-300 border-red-500/50 animate-pulse'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${colors[severity as keyof typeof colors] || colors.medium}`}>
      {severity}
    </span>
  );
}

function WarningBox({ type, children }: { type: 'warning' | 'danger' | 'info'; children: React.ReactNode }) {
  const styles = {
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  };

  const icons = {
    warning: '⚠️',
    danger: '🚨',
    info: 'ℹ️'
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function DiagnosticStep({ step, isActive, isComplete }: {
  step: {
    step: number;
    action: string;
    details: string;
    expectedResult: string;
    measurements?: {
      parameter: string;
      normalRange: string;
      unit: string;
      howToMeasure: string;
    };
    ifPassed: string;
    ifFailed: string;
  };
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        isActive ? 'bg-cyan-500/10 border-cyan-500/30' :
        isComplete ? 'bg-green-500/10 border-green-500/30' :
        'bg-slate-800/50 border-slate-700/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
          isComplete ? 'bg-green-500 text-white' :
          isActive ? 'bg-cyan-500 text-white' :
          'bg-slate-700 text-slate-400'
        }`}>
          {isComplete ? '✓' : step.step}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-lg mb-2">{step.action}</h4>
          <p className="text-slate-300 mb-4">{step.details}</p>

          {step.measurements && (
            <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
              <h5 className="font-medium text-cyan-400 mb-2">Measurement Details</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Parameter:</p>
                  <p className="text-white font-medium">{step.measurements.parameter}</p>
                </div>
                <div>
                  <p className="text-slate-400">Normal Range:</p>
                  <p className="text-green-400 font-medium">{step.measurements.normalRange} {step.measurements.unit}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-slate-400 text-sm">How to Measure:</p>
                <p className="text-white text-sm mt-1">{step.measurements.howToMeasure}</p>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-800/50 rounded-lg mb-3">
            <p className="text-slate-400 text-sm">Expected Result:</p>
            <p className="text-white font-medium">{step.expectedResult}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-xs uppercase font-medium mb-1">If PASSED:</p>
              <p className="text-green-300 text-sm">{step.ifPassed}</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-xs uppercase font-medium mb-1">If FAILED:</p>
              <p className="text-red-300 text-sm">{step.ifFailed}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RepairStep({ step }: {
  step: {
    step: number;
    action: string;
    details: string;
    tips: string[];
    warnings?: string[];
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-lg">
          {step.step}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-lg mb-2">{step.action}</h4>
          <p className="text-slate-300 mb-4">{step.details}</p>

          {step.tips.length > 0 && (
            <div className="mb-4">
              <h5 className="text-cyan-400 font-medium mb-2">Pro Tips:</h5>
              <ul className="space-y-1">
                {step.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.warnings && step.warnings.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h5 className="text-red-400 font-medium mb-2">⚠️ Warnings:</h5>
              <ul className="space-y-1">
                {step.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-red-300">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SolutionDisplay({ solution }: { solution: CompleteSolution }) {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'repair' | 'verify'>('diagnosis');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markStepComplete = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
    }
    if (stepNum < solution.diagnosticSteps.length) {
      setCurrentStep(stepNum);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{solution.title}</h2>
            <SeverityBadge severity={solution.severity} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>Estimated Time: {solution.estimatedTime}</span>
            <span>Category: {solution.category.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Safety Warnings */}
      {solution.safetyWarnings.length > 0 && (
        <WarningBox type="danger">
          <h4 className="font-semibold mb-2">SAFETY WARNINGS</h4>
          <ul className="space-y-1">
            {solution.safetyWarnings.map((warning, idx) => (
              <li key={idx} className="text-sm">{warning}</li>
            ))}
          </ul>
        </WarningBox>
      )}

      {/* Likely Causes */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔍</span> Likely Causes (by Probability)
        </h3>
        <div className="space-y-3">
          {solution.likelyCauses.sort((a, b) => b.probability - a.probability).map((cause, idx) => (
            <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{cause.cause}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cause.probability >= 50 ? 'bg-orange-500' :
                        cause.probability >= 30 ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${cause.probability}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{cause.probability}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">{cause.explanation}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Tools and Parts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔧</span> Tools Required
          </h3>
          <ul className="space-y-2">
            {solution.toolsRequired.map((tool, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="text-cyan-400">✓</span>
                {tool}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📦</span> Parts Required
          </h3>
          <ul className="space-y-2">
            {solution.partsRequired.map((part, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="text-purple-400">•</span>
                {part}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'diagnosis', label: 'Diagnostic Steps', icon: '🔬' },
          { id: 'repair', label: 'Repair Procedure', icon: '🛠️' },
          { id: 'verify', label: 'Verification', icon: '✅' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'diagnosis' && (
          <motion.div
            key="diagnosis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">Follow each step carefully. Mark steps complete as you progress.</p>
              <p className="text-cyan-400 font-medium">
                Progress: {completedSteps.length}/{solution.diagnosticSteps.length} steps
              </p>
            </div>
            {solution.diagnosticSteps.map((step, idx) => (
              <div key={idx}>
                <DiagnosticStep
                  step={step}
                  isActive={currentStep === idx}
                  isComplete={completedSteps.includes(step.step)}
                />
                {!completedSteps.includes(step.step) && (
                  <div className="flex gap-2 mt-2 ml-14">
                    <button
                      onClick={() => markStepComplete(step.step)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Complete ✓
                    </button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'repair' && (
          <motion.div
            key="repair"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <WarningBox type="info">
              <p>Follow these repair procedures after completing the diagnostic steps to identify the root cause.</p>
            </WarningBox>
            {solution.repairProcedure.map((step, idx) => (
              <RepairStep key={idx} step={step} />
            ))}
          </motion.div>
        )}

        {activeTab === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Verification Steps
              </h3>
              <p className="text-slate-400 mb-4">Complete these verification steps after repair to confirm the issue is resolved:</p>
              <ol className="space-y-3">
                {solution.verificationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </GlassCard>

            <GlassCard className="p-6 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>💡</span> Preventive Advice
              </h3>
              <ul className="space-y-2">
                {solution.preventiveAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-yellow-400">→</span>
                    {advice}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-6 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔗</span> Related Fault Codes
              </h3>
              <div className="flex flex-wrap gap-2">
                {solution.relatedFaultCodes.map((code, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-full text-sm font-mono">
                    {code}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ECMReprogrammingDisplay({ guide }: { guide: ECMReprogrammingGuide }) {
  const [activeSection, setActiveSection] = useState<'procedure' | 'parameters' | 'wiring'>('procedure');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{guide.manufacturer} {guide.ecmModel} Reprogramming Guide</h2>
          <p className="text-slate-400 mt-1">Complete step-by-step ECM configuration and firmware update procedure</p>
        </div>
      </div>

      {/* Compatible Controllers */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compatible Controllers</h3>
        <div className="flex flex-wrap gap-2">
          {guide.compatibleControllers.map((controller, idx) => (
            <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm">
              {controller}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Firmware Versions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Firmware Versions</h3>
        <div className="space-y-4">
          {guide.firmwareVersions.map((fw, idx) => (
            <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-cyan-400 font-bold">v{fw.version}</span>
                <span className="text-slate-400 text-sm">{fw.releaseDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Features:</p>
                  <ul className="space-y-1">
                    {fw.features.map((f, i) => (
                      <li key={i} className="text-green-400">+ {f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Bug Fixes:</p>
                  <ul className="space-y-1">
                    {fw.bugFixes.map((b, i) => (
                      <li key={i} className="text-yellow-400">• {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-slate-400 text-sm">Compatible with: {fw.compatibility.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'procedure', label: 'Reprogramming Procedure', icon: '📝' },
          { id: 'parameters', label: 'Parameter Settings', icon: '⚙️' },
          { id: 'wiring', label: 'Wiring & Communication', icon: '🔌' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'procedure' && (
          <motion.div
            key="procedure"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <WarningBox type="danger">
              <p className="font-semibold mb-2">CRITICAL: Do not interrupt power during ECM reprogramming!</p>
              <p className="text-sm">Connect battery charger and ensure stable power supply throughout the process. Power loss during flash will brick the ECM.</p>
            </WarningBox>

            {guide.reprogrammingProcedure.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-2">{step.action}</h4>
                    <p className="text-slate-300 mb-4">{step.details}</p>
                    {step.criticalNotes.length > 0 && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h5 className="text-yellow-400 font-medium mb-2">Critical Notes:</h5>
                        <ul className="space-y-1">
                          {step.criticalNotes.map((note, i) => (
                            <li key={i} className="text-sm text-yellow-300">• {note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeSection === 'parameters' && (
          <motion.div
            key="parameters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-slate-400">These parameters must be configured correctly for proper ECM-Controller communication and engine operation.</p>
            {guide.parameterSettings.map((param, idx) => (
              <GlassCard key={idx} className="p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">{param.parameter}</h4>
                <p className="text-slate-300 text-sm mb-3">{param.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Default Value:</p>
                    <p className="text-white font-mono">{param.defaultValue}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Adjustment Range:</p>
                    <p className="text-green-400 font-mono">{param.adjustmentRange}</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase mb-1">How to Adjust:</p>
                  <p className="text-white text-sm">{param.adjustmentProcedure}</p>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeSection === 'wiring' && (
          <motion.div
            key="wiring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Communication Setup</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">Protocol:</p>
                  <p className="text-white font-bold">{guide.communicationSetup.protocol}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">Baud Rate:</p>
                  <p className="text-white font-bold">{guide.communicationSetup.baudRate.toLocaleString()} bps</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">TX Address:</p>
                  <p className="text-cyan-400 font-mono">{guide.communicationSetup.canAddresses.tx}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">RX Address:</p>
                  <p className="text-cyan-400 font-mono">{guide.communicationSetup.canAddresses.rx}</p>
                </div>
              </div>

              <div className={`p-3 rounded-lg mb-6 ${
                guide.communicationSetup.terminationRequired
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-green-500/10 border border-green-500/30'
              }`}>
                <p className={guide.communicationSetup.terminationRequired ? 'text-yellow-400' : 'text-green-400'}>
                  {guide.communicationSetup.terminationRequired
                    ? '⚠️ 120Ω termination resistor REQUIRED at end of CAN bus'
                    : '✓ No additional termination required'}
                </p>
              </div>

              <h4 className="font-semibold text-white mb-3">Wiring Diagram</h4>
              <pre className="p-4 bg-slate-900 rounded-lg text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
                {guide.communicationSetup.wiringDiagram}
              </pre>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function CompleteDiagnosticPanel() {
  const [activeMode, setActiveMode] = useState<'input' | 'solutions' | 'ecm'>('input');
  const [diagnosticInput, setDiagnosticInput] = useState<DiagnosticInput>({});
  const [selectedSolution, setSelectedSolution] = useState<CompleteSolution | null>(null);
  const [selectedECMGuide, setSelectedECMGuide] = useState<ECMReprogrammingGuide | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof interpretDiagnosticInput> | null>(null);
  const [symptomInput, setSymptomInput] = useState('');

  const handleAnalyze = () => {
    const symptoms = symptomInput.split(',').map(s => s.trim()).filter(s => s);
    const input = { ...diagnosticInput, symptoms };
    const result = interpretDiagnosticInput(input);
    setAnalysisResult(result);
    if (result.analysis.diagnosticFlow) {
      setSelectedSolution(result.analysis.diagnosticFlow);
    }
  };

  const allSolutions = useMemo(() => Object.values(COMPLETE_SOLUTIONS), []);
  const allECMGuides = useMemo(() => Object.values(ECM_REPROGRAMMING_GUIDES), []);

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <DisclaimerBanner type="faultCode" />

      {/* Header */}
      <GlassCard className="p-6" glow>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              Complete Diagnostic Solutions
            </h1>
            <p className="text-slate-400 mt-1">Independent diagnostic guidance - interpretations may differ from OEM documentation</p>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'input', label: 'Diagnose', icon: '📊' },
              { id: 'solutions', label: 'All Solutions', icon: '📚' },
              { id: 'ecm', label: 'ECM Guides', icon: '💾' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as typeof activeMode);
                  setSelectedSolution(null);
                  setSelectedECMGuide(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeMode === mode.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeMode === 'input' && !selectedSolution && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Enter Diagnostic Data</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Fault Code</label>
                  <input
                    type="text"
                    value={diagnosticInput.faultCode || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, faultCode: e.target.value })}
                    placeholder="e.g., 421039, SPN-110"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Voltage (V)</label>
                  <input
                    type="number"
                    value={diagnosticInput.voltage || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, voltage: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 24"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">RPM</label>
                  <input
                    type="number"
                    value={diagnosticInput.rpm || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, rpm: parseInt(e.target.value) || undefined })}
                    placeholder="e.g., 1500"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Load (kVA)</label>
                  <input
                    type="number"
                    value={diagnosticInput.load || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, load: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Fuel Pressure (PSI)</label>
                  <input
                    type="number"
                    value={diagnosticInput.fuelPressure || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, fuelPressure: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 45"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Coolant Temp (°C)</label>
                  <input
                    type="number"
                    value={diagnosticInput.coolantTemp || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, coolantTemp: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 85"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Oil Pressure (PSI)</label>
                  <input
                    type="number"
                    value={diagnosticInput.oilPressure || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, oilPressure: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 40"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Frequency (Hz)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={diagnosticInput.frequency || ''}
                    onChange={(e) => setDiagnosticInput({ ...diagnosticInput, frequency: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 50.0"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Symptoms (comma-separated)</label>
                <textarea
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g., no start, cranks but won't start, black smoke, low power, no ECM data, overheating"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAnalyze}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                🔍 ANALYZE AND GET COMPLETE SOLUTION
              </button>
            </GlassCard>

            {/* Analysis Result */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <GlassCard className={`p-6 ${
                  analysisResult.analysis.warningLevel === 'emergency' ? 'border-red-500/50 shadow-red-500/20' :
                  analysisResult.analysis.warningLevel === 'critical' ? 'border-orange-500/50' :
                  analysisResult.analysis.warningLevel === 'warning' ? 'border-yellow-500/50' :
                  ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Analysis Result</h3>
                    <SeverityBadge severity={analysisResult.analysis.warningLevel} />
                  </div>

                  {/* Immediate Actions */}
                  {analysisResult.analysis.immediateActions.length > 0 && (
                    <WarningBox type="danger">
                      <h4 className="font-semibold mb-2">IMMEDIATE ACTIONS REQUIRED</h4>
                      <ol className="space-y-1">
                        {analysisResult.analysis.immediateActions.map((action, idx) => (
                          <li key={idx} className="text-sm">{idx + 1}. {action}</li>
                        ))}
                      </ol>
                    </WarningBox>
                  )}

                  {/* Likely Causes */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-3">Identified Causes:</h4>
                    <div className="space-y-2">
                      {analysisResult.analysis.likelyCauses.map((cause, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-white">{cause.cause}</span>
                            <span className="text-cyan-400 font-bold">{cause.probability}%</span>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{cause.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Solution Button */}
                  {analysisResult.analysis.diagnosticFlow && (
                    <button
                      onClick={() => setSelectedSolution(analysisResult.analysis.diagnosticFlow)}
                      className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all"
                    >
                      📋 VIEW COMPLETE SOLUTION & REPAIR PROCEDURE
                    </button>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {(activeMode === 'input' && selectedSolution) && (
          <motion.div
            key="selected-solution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => setSelectedSolution(null)}
              className="mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              ← Back to Input
            </button>
            <SolutionDisplay solution={selectedSolution} />
          </motion.div>
        )}

        {activeMode === 'solutions' && !selectedSolution && (
          <motion.div
            key="solutions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">All Diagnostic Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSolutions.map((solution) => (
                  <motion.div
                    key={solution.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSolution(solution)}
                    className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl cursor-pointer hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{solution.title}</h3>
                      <SeverityBadge severity={solution.severity} />
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      {solution.likelyCauses[0]?.cause}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{solution.category.toUpperCase()}</span>
                      <span>{solution.estimatedTime}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeMode === 'solutions' && selectedSolution && (
          <motion.div
            key="solution-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => setSelectedSolution(null)}
              className="mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              ← Back to Solutions
            </button>
            <SolutionDisplay solution={selectedSolution} />
          </motion.div>
        )}

        {activeMode === 'ecm' && !selectedECMGuide && (
          <motion.div
            key="ecm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">ECM Reprogramming Guides</h2>
              <p className="text-slate-400 mb-6">Complete step-by-step guides for ECM firmware updates, parameter configuration, and controller compatibility setup.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allECMGuides.map((guide) => (
                  <motion.div
                    key={guide.ecmModel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedECMGuide(guide)}
                    className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl cursor-pointer hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">💾</span>
                      <div>
                        <h3 className="font-semibold text-white">{guide.manufacturer}</h3>
                        <p className="text-purple-400 font-mono">{guide.ecmModel}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      Compatible with: {guide.compatibleControllers.slice(0, 2).join(', ')}
                      {guide.compatibleControllers.length > 2 && ` +${guide.compatibleControllers.length - 2} more`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {guide.firmwareVersions.length} firmware version{guide.firmwareVersions.length > 1 ? 's' : ''} documented
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeMode === 'ecm' && selectedECMGuide && (
          <motion.div
            key="ecm-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => setSelectedECMGuide(null)}
              className="mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              ← Back to ECM Guides
            </button>
            <ECMReprogrammingDisplay guide={selectedECMGuide} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
