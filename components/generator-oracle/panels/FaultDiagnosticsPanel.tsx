'use client';

/**
 * Fault Diagnostics Panel - Professional Error Management Interface
 * Technician-focused fault clearing guidance system
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaultCode {
  id: string;
  code: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  title: string;
  description: string;
  symptoms: string[];
  possibleCauses: { cause: string; likelihood: 'high' | 'medium' | 'low'; verification: string }[];
  resetSteps: ResetStep[];
  safetyWarnings: string[];
  estimatedTime: string;
}

interface ResetStep {
  step: number;
  action: string;
  keySequence?: string[];
  menuPath?: string[];
  expectedResult: string;
  warning?: string;
  image?: string;
}

// Sample fault data
const SAMPLE_FAULTS: FaultCode[] = [
  {
    id: '1',
    code: 'E1234',
    severity: 'shutdown',
    title: 'Over Speed Shutdown',
    description: 'Engine speed exceeded maximum safe limit. Immediate shutdown initiated to protect engine.',
    symptoms: ['Engine shut down unexpectedly', 'Alarm light flashing red', 'Speed indicator showing high reading before shutdown'],
    possibleCauses: [
      { cause: 'Faulty speed sensor', likelihood: 'high', verification: 'Check sensor resistance with multimeter' },
      { cause: 'Governor malfunction', likelihood: 'medium', verification: 'Inspect governor linkage and calibration' },
      { cause: 'Load dump (sudden load removal)', likelihood: 'medium', verification: 'Review load history before shutdown' },
    ],
    resetSteps: [
      { step: 1, action: 'Ensure engine is completely stopped', expectedResult: 'Engine at rest, no rotation' },
      { step: 2, action: 'Wait for 30 seconds cooldown period', expectedResult: 'Controller LED stops flashing' },
      { step: 3, action: 'Press and hold STOP button', keySequence: ['STOP'], expectedResult: 'Alarm horn stops' },
      { step: 4, action: 'Press RESET button once', keySequence: ['RESET'], expectedResult: 'Fault icon clears' },
      { step: 5, action: 'Verify fault has cleared', menuPath: ['Menu', 'Alarms', 'Active'], expectedResult: 'No active alarms shown' },
    ],
    safetyWarnings: ['Do not attempt to reset while engine is running', 'Ensure area is clear of personnel'],
    estimatedTime: '2-5 minutes',
  },
  {
    id: '2',
    code: 'W2045',
    severity: 'warning',
    title: 'Low Oil Pressure Warning',
    description: 'Oil pressure has dropped below the warning threshold.',
    symptoms: ['Yellow warning light illuminated', 'Oil pressure gauge reading low', 'Possible engine noise'],
    possibleCauses: [
      { cause: 'Low oil level', likelihood: 'high', verification: 'Check dipstick level' },
      { cause: 'Oil leak', likelihood: 'medium', verification: 'Inspect for oil around engine' },
      { cause: 'Faulty oil pressure sender', likelihood: 'low', verification: 'Verify with mechanical gauge' },
    ],
    resetSteps: [
      { step: 1, action: 'Stop the generator', keySequence: ['STOP'], expectedResult: 'Engine stops' },
      { step: 2, action: 'Check and top up oil level', expectedResult: 'Oil at proper level on dipstick' },
      { step: 3, action: 'Press RESET to clear warning', keySequence: ['RESET'], expectedResult: 'Warning clears' },
    ],
    safetyWarnings: ['Hot oil can cause burns', 'Use proper PPE when checking oil'],
    estimatedTime: '5-10 minutes',
  },
];

// ==================== SEVERITY BADGE ====================
function SeverityBadge({ severity }: { severity: FaultCode['severity'] }) {
  const config = {
    info: { color: 'bg-blue-500', text: 'INFO', glow: 'rgba(59,130,246,0.5)' },
    warning: { color: 'bg-amber-500', text: 'WARNING', glow: 'rgba(245,158,11,0.5)' },
    critical: { color: 'bg-orange-500', text: 'CRITICAL', glow: 'rgba(249,115,22,0.5)' },
    shutdown: { color: 'bg-red-500', text: 'SHUTDOWN', glow: 'rgba(239,68,68,0.5)' },
  };

  const { color, text, glow } = config[severity];

  return (
    <motion.span
      className={`px-3 py-1 ${color} text-white text-xs font-bold uppercase tracking-wider rounded`}
      animate={severity !== 'info' ? { opacity: [1, 0.7, 1] } : {}}
      transition={{ duration: severity === 'shutdown' ? 0.5 : 1, repeat: Infinity }}
      style={{ boxShadow: `0 0 15px ${glow}` }}
    >
      {text}
    </motion.span>
  );
}

// ==================== RESET STEP CARD ====================
function ResetStepCard({ step, isActive, isCompleted }: { step: ResetStep; isActive: boolean; isCompleted: boolean }) {
  return (
    <motion.div
      className={`relative p-4 rounded-xl border transition-all ${
        isCompleted
          ? 'bg-green-500/10 border-green-500/50'
          : isActive
          ? 'bg-cyan-500/10 border-cyan-500/50'
          : 'bg-slate-900/50 border-slate-700/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.step * 0.1 }}
    >
      {/* Step number */}
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isCompleted
              ? 'bg-green-500 text-white'
              : isActive
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 border border-slate-600'
          }`}
          style={{
            boxShadow: isActive ? '0 0 20px rgba(6,182,212,0.5)' : isCompleted ? '0 0 20px rgba(34,197,94,0.5)' : 'none',
          }}
        >
          {isCompleted ? '✓' : step.step}
        </div>

        <div className="flex-1">
          {/* Action */}
          <p className={`text-base font-medium ${isCompleted ? 'text-green-400' : isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
            {step.action}
          </p>

          {/* Key sequence */}
          {step.keySequence && step.keySequence.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-slate-500">Keys:</span>
              {step.keySequence.map((key, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-slate-600">+</span>}
                  <motion.span
                    className="px-3 py-1.5 bg-slate-800 border border-cyan-500/50 rounded-lg font-mono text-cyan-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    style={{ boxShadow: isActive ? '0 0 10px rgba(6,182,212,0.3)' : 'none' }}
                  >
                    {key}
                  </motion.span>
                </span>
              ))}
            </div>
          )}

          {/* Menu path */}
          {step.menuPath && step.menuPath.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-slate-500">Navigate:</span>
              {step.menuPath.map((menu, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-cyan-500">→</span>}
                  <span className="px-2 py-1 bg-slate-800 rounded text-cyan-300 text-sm">{menu}</span>
                </span>
              ))}
            </div>
          )}

          {/* Expected result */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-green-400">{step.expectedResult}</span>
          </div>

          {/* Warning */}
          {step.warning && (
            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <span className="text-amber-400 text-sm">⚠️ {step.warning}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== FAULT DETAIL MODAL ====================
function FaultDetailModal({
  fault,
  onClose,
}: {
  fault: FaultCode;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
      if (stepNum < fault.resetSteps.length) {
        setCurrentStep(stepNum);
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl max-h-[90vh] bg-slate-950 rounded-2xl border border-cyan-500/30 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(6,182,212,0.2)' }}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900/50 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="px-4 py-2 bg-slate-800 rounded-lg border border-cyan-500/30 font-mono text-2xl text-cyan-400"
                style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}
              >
                {fault.code}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{fault.title}</h2>
                  <SeverityBadge severity={fault.severity} />
                </div>
                <p className="text-sm text-slate-400">{fault.description}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick info */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded">
              <span className="text-slate-500">⏱️</span>
              <span className="text-sm text-slate-300">{fault.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded">
              <span className="text-slate-500">📋</span>
              <span className="text-sm text-slate-300">{fault.resetSteps.length} steps to clear</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2 gap-6">
            {/* Left - Information */}
            <div className="space-y-6">
              {/* Safety Warnings */}
              {fault.safetyWarnings.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>⚠️</span> Safety Warnings
                  </h3>
                  <ul className="space-y-2">
                    {fault.safetyWarnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                        <span className="text-red-500">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Symptoms */}
              <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Symptoms</h3>
                <ul className="space-y-2">
                  {fault.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-cyan-500">▸</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Possible Causes */}
              <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Possible Causes</h3>
                <div className="space-y-3">
                  {fault.possibleCauses.map((cause, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{cause.cause}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            cause.likelihood === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : cause.likelihood === 'medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {cause.likelihood.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400">Verify:</span> {cause.verification}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Reset Steps */}
            <div>
              <div className="sticky top-0">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🔄</span> Reset Procedure
                  <span className="ml-auto text-xs text-slate-500">
                    {completedSteps.length}/{fault.resetSteps.length} completed
                  </span>
                </h3>

                {/* Progress bar */}
                <div className="h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps.length / fault.resetSteps.length) * 100}%` }}
                    style={{ boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {fault.resetSteps.map((step) => (
                    <div
                      key={step.step}
                      onClick={() => handleStepComplete(step.step)}
                      className="cursor-pointer"
                    >
                      <ResetStepCard
                        step={step}
                        isActive={currentStep === step.step - 1}
                        isCompleted={completedSteps.includes(step.step)}
                      />
                    </div>
                  ))}
                </div>

                {/* Success message */}
                {completedSteps.length === fault.resetSteps.length && (
                  <motion.div
                    className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-lg font-bold text-green-400">Reset Complete!</div>
                    <div className="text-sm text-slate-400 mt-1">Fault should now be cleared from the system</div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== MAIN FAULT DIAGNOSTICS PANEL ====================
export default function FaultDiagnosticsPanel({
  onSearch,
  searchResults,
  isSearching,
}: {
  onSearch: (query: string) => void;
  searchResults: FaultCode[];
  isSearching: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [activeAlarms] = useState<FaultCode[]>(SAMPLE_FAULTS.slice(0, 2));

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔧</span>
          <div>
            <h2 className="text-xl font-bold text-purple-400 uppercase tracking-wider">Fault Diagnostics</h2>
            <p className="text-sm text-slate-500">Search faults, view solutions, and clear errors</p>
          </div>
        </div>

        {activeAlarms.length > 0 && (
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-red-500">🔴</span>
            <span className="text-red-400 font-medium">{activeAlarms.length} Active Alarm{activeAlarms.length > 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Search & Results */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Search Box */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Fault Code Search</h3>

            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter fault code, keyword, or description..."
                    className="w-full px-4 py-3 bg-slate-950/80 border border-purple-500/30 rounded-xl text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                    style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)' }}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none opacity-50">{'>'}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25"
                >
                  {isSearching ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    'Search'
                  )}
                </motion.button>
              </div>

              {/* Quick search tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Low Oil', 'Over Speed', 'High Temperature', 'Battery', 'Alternator', 'Fuel'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      onSearch(tag);
                    }}
                    className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg border border-slate-700/50 text-xs hover:bg-slate-700/50 hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">
              {searchResults.length > 0 ? `Results (${searchResults.length} found)` : 'Recent Faults'}
            </h3>

            <div className="space-y-3">
              {(searchResults.length > 0 ? searchResults : SAMPLE_FAULTS).map((fault) => (
                <motion.div
                  key={fault.id}
                  className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition-all"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedFault(fault)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 bg-slate-800 rounded-lg font-mono text-lg text-cyan-400 border border-cyan-500/30"
                        style={{ textShadow: '0 0 10px rgba(6,182,212,0.3)' }}
                      >
                        {fault.code}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{fault.title}</span>
                          <SeverityBadge severity={fault.severity} />
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{fault.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{fault.estimatedTime}</span>
                      <span className="text-cyan-500">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Active Alarms & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Active Alarms */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-red-500/30">
            <h3 className="text-xs text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔴
              </motion.span>
              Active Alarms
            </h3>

            {activeAlarms.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-green-400 font-medium">No Active Alarms</div>
                <div className="text-xs text-slate-500 mt-1">System operating normally</div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlarms.map((alarm) => (
                  <motion.div
                    key={alarm.id}
                    className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedFault(alarm)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-red-400">{alarm.code}</span>
                      <SeverityBadge severity={alarm.severity} />
                    </div>
                    <div className="text-sm text-white">{alarm.title}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-left hover:bg-cyan-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="text-sm font-medium text-cyan-400">Reset All Faults</div>
                    <div className="text-xs text-slate-500">Clear non-critical alarms</div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-left hover:bg-amber-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <div className="text-sm font-medium text-amber-400">View Fault History</div>
                    <div className="text-xs text-slate-500">Last 30 days of faults</div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-left hover:bg-green-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="text-sm font-medium text-green-400">Export Diagnostics</div>
                    <div className="text-xs text-slate-500">Download fault report</div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Support */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Need Help?</h3>

            <div className="space-y-3">
              <a
                href="tel:+254782914717"
                className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all"
              >
                <span className="text-2xl">📞</span>
                <div>
                  <div className="text-sm font-medium text-blue-400">Call Support</div>
                  <div className="text-xs text-slate-500">+254 782 914 717</div>
                </div>
              </a>

              <a
                href="https://wa.me/254768860665"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div className="text-sm font-medium text-green-400">WhatsApp</div>
                  <div className="text-xs text-slate-500">Quick response</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fault Detail Modal */}
      <AnimatePresence>
        {selectedFault && (
          <FaultDetailModal fault={selectedFault} onClose={() => setSelectedFault(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
