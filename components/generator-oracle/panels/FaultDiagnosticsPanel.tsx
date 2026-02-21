'use client';

/**
 * Fault Diagnostics Panel - Professional Error Management Interface
 * Comprehensive technician-focused fault clearing guidance system
 * Now with full detailed troubleshooting from the Oracle database
 *
 * ENHANCED: Now includes 4+ paragraph detailed descriptions per fault
 * with AI insights, case studies, and predictive maintenance indicators
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ControllerFaultCode } from '@/lib/generator-oracle/controllerFaultCodes';
import { getFaultByCode, type EnhancedFaultCode } from '@/lib/generator-oracle/enhanced-fault-database';

// Extended interface to include interactive questions
interface ExtendedFaultCode extends ControllerFaultCode {
  interactiveQuestions?: string[];
}

// ==================== SEVERITY BADGE ====================
function SeverityBadge({ severity }: { severity: ControllerFaultCode['severity'] }) {
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

// ==================== LIKELIHOOD BADGE ====================
function LikelihoodBadge({ likelihood }: { likelihood: 'high' | 'medium' | 'low' }) {
  const config = {
    high: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🔴' },
    medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '🟡' },
    low: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🔵' },
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${config[likelihood].color}`}>
      {config[likelihood].icon} {likelihood.toUpperCase()}
    </span>
  );
}

// ==================== COMPREHENSIVE FAULT DETAIL MODAL ====================
function FaultDetailModal({
  fault,
  onClose,
}: {
  fault: ExtendedFaultCode;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics' | 'reset' | 'solution' | 'ai-insights'>('overview');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [completedDiagnostics, setCompletedDiagnostics] = useState<number[]>([]);

  // Get enhanced fault data if available (4+ paragraph detailed descriptions)
  const enhancedFault = useMemo(() => getFaultByCode(fault.code), [fault.code]);

  // Get the first reset pathway and solution
  const resetPathway = fault.resetPathways?.[0];
  const solution = fault.solutions?.[0];
  const timeEstimate = solution?.timeEstimate || '15-60 minutes';

  const handleResetStepComplete = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  const handleDiagnosticComplete = (stepNum: number) => {
    if (!completedDiagnostics.includes(stepNum)) {
      setCompletedDiagnostics([...completedDiagnostics, stepNum]);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
    { id: 'reset', label: 'Reset Steps', icon: '🔄' },
    { id: 'solution', label: 'Solution', icon: '🔧' },
    ...(enhancedFault ? [{ id: 'ai-insights', label: 'AI Insights', icon: '🤖' }] : []),
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-5xl max-h-[95vh] bg-slate-950 rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(6,182,212,0.2)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 bg-slate-900/50 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className="px-4 py-2 bg-slate-800 rounded-lg border border-cyan-500/30 font-mono text-2xl text-cyan-400"
                style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}
              >
                {fault.code}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{fault.title}</h2>
                  <SeverityBadge severity={fault.severity} />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>📦 {fault.brand}</span>
                  <span>📱 {fault.model}</span>
                  <span>📂 {fault.category}</span>
                  <span>⏱️ {timeEstimate}</span>
                </div>
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

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Enhanced Description - 4+ Paragraphs when available */}
                {enhancedFault ? (
                  <div className="space-y-4">
                    {/* Technical Overview */}
                    <div className="p-5 bg-slate-900/50 border border-cyan-500/30 rounded-xl">
                      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>📖</span> Technical Overview
                      </h3>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {enhancedFault.technicalOverview}
                      </div>
                    </div>

                    {/* System Impact */}
                    <div className="p-5 bg-slate-900/50 border border-orange-500/30 rounded-xl">
                      <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>⚡</span> System Impact
                      </h3>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {enhancedFault.systemImpact}
                      </div>
                    </div>

                    {/* Safety Considerations */}
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>🛡️</span> Safety Considerations
                      </h3>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {enhancedFault.safetyConsiderations}
                      </div>
                    </div>

                    {/* Historical Context */}
                    <div className="p-5 bg-slate-900/50 border border-purple-500/30 rounded-xl">
                      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>📚</span> Historical Context
                      </h3>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {enhancedFault.historicalContext}
                      </div>
                    </div>

                    {/* Case Studies from Kenya */}
                    {enhancedFault.caseStudies && enhancedFault.caseStudies.length > 0 && (
                      <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span>🇰🇪</span> Real Case Studies from Kenya
                        </h3>
                        <div className="space-y-4">
                          {enhancedFault.caseStudies.map((cs, idx) => (
                            <div key={idx} className="p-4 bg-slate-900/50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-400 font-bold">{cs.location}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400 text-sm">{cs.generatorModel}</span>
                              </div>
                              <p className="text-slate-300 text-sm mb-2"><strong>Symptom:</strong> {cs.symptom}</p>
                              <p className="text-slate-300 text-sm mb-2"><strong>Diagnosis:</strong> {cs.diagnosis}</p>
                              <p className="text-slate-300 text-sm mb-2"><strong>Solution:</strong> {cs.solution}</p>
                              <p className="text-amber-400 text-sm"><strong>Lesson:</strong> {cs.lessonsLearned}</p>
                              <p className="text-slate-500 text-xs mt-2">Time to resolve: {cs.timeToResolve}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>📖</span> What This Means
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{fault.description}</p>
                  </div>
                )}

                {/* Safety Warnings - Show prominently if shutdown/critical */}
                {fault.safetyWarnings && fault.safetyWarnings.length > 0 && (
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>⚠️</span> Safety Warnings - READ FIRST
                    </h3>
                    <ul className="space-y-2">
                      {fault.safetyWarnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-red-300">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Symptoms */}
                  <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>👁️</span> Symptoms to Look For
                    </h3>
                    <ul className="space-y-2">
                      {fault.symptoms?.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-amber-500 mt-0.5">▸</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Possible Causes */}
                  <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>🎯</span> Possible Causes
                    </h3>
                    <div className="space-y-3">
                      {fault.possibleCauses?.map((cause, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-sm text-white font-medium">{cause.cause}</span>
                            <LikelihoodBadge likelihood={cause.likelihood} />
                          </div>
                          <p className="text-xs text-slate-400">
                            <span className="text-cyan-400">How to verify:</span> {cause.verification}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Questions */}
                {fault.interactiveQuestions && fault.interactiveQuestions.length > 0 && (
                  <div className="p-5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>💬</span> Technician Guidance - Answer These Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fault.interactiveQuestions.map((question, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                          <p className="text-sm text-slate-300">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* DIAGNOSTICS TAB */}
            {activeTab === 'diagnostics' && (
              <motion.div
                key="diagnostics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-cyan-400">Step-by-Step Diagnostics</h3>
                  <span className="text-sm text-slate-400">
                    {completedDiagnostics.length}/{fault.diagnosticSteps?.length || 0} completed
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedDiagnostics.length / (fault.diagnosticSteps?.length || 1)) * 100}%` }}
                  />
                </div>

                <div className="space-y-4 mt-6">
                  {fault.diagnosticSteps?.map((step, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        completedDiagnostics.includes(step.step)
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/50'
                      }`}
                      onClick={() => handleDiagnosticComplete(step.step)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            completedDiagnostics.includes(step.step)
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-800 text-cyan-400 border border-cyan-500/50'
                          }`}
                        >
                          {completedDiagnostics.includes(step.step) ? '✓' : step.step}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${completedDiagnostics.includes(step.step) ? 'text-green-400' : 'text-white'}`}>
                            {step.action}
                          </p>
                          <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                            <span>✓</span> Expected: {step.expectedResult}
                          </p>
                          {step.tools && step.tools.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {step.tools.map((tool, toolIdx) => (
                                <span key={toolIdx} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                                  🔧 {tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESET TAB */}
            {activeTab === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-400">How to Reset/Clear This Alarm</h3>
                  <span className="text-sm text-slate-400">
                    {completedSteps.length}/{resetPathway?.steps?.length || 0} completed
                  </span>
                </div>

                {/* Reset method info */}
                {resetPathway && (
                  <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl mb-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-slate-400">
                        Method: <span className="text-cyan-400 font-medium">{resetPathway.method?.toUpperCase()}</span>
                      </span>
                      {resetPathway.requiresCondition && (
                        <span className="text-slate-400">
                          Requires: <span className="text-amber-400">{resetPathway.requiresCondition.join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps.length / (resetPathway?.steps?.length || 1)) * 100}%` }}
                  />
                </div>

                <div className="space-y-4 mt-6">
                  {resetPathway?.steps?.map((step, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        completedSteps.includes(step.stepNumber)
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-slate-900/50 border-slate-700/50 hover:border-green-500/50'
                      }`}
                      onClick={() => handleResetStepComplete(step.stepNumber)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            completedSteps.includes(step.stepNumber)
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-800 text-green-400 border border-green-500/50'
                          }`}
                        >
                          {completedSteps.includes(step.stepNumber) ? '✓' : step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${completedSteps.includes(step.stepNumber) ? 'text-green-400' : 'text-white'}`}>
                            {step.action}
                          </p>

                          {/* Key sequence */}
                          {step.keySequence && step.keySequence.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs text-slate-500">Press:</span>
                              {step.keySequence.map((key, keyIdx) => (
                                <span key={keyIdx} className="flex items-center gap-1">
                                  {keyIdx > 0 && <span className="text-slate-600">→</span>}
                                  <span className="px-3 py-1.5 bg-slate-800 border border-cyan-500/50 rounded-lg font-mono text-cyan-300 text-sm">
                                    {key}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Menu path */}
                          {step.menuPath && step.menuPath.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <span className="text-xs text-slate-500">Navigate:</span>
                              {step.menuPath.map((menu, menuIdx) => (
                                <span key={menuIdx} className="flex items-center gap-1">
                                  {menuIdx > 0 && <span className="text-cyan-500">→</span>}
                                  <span className="px-2 py-1 bg-slate-800 rounded text-cyan-300 text-sm">{menu}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-sm text-green-400 mt-3 flex items-center gap-2">
                            <span>✓</span> Expected: {step.expectedResponse}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Success message */}
                {completedSteps.length === (resetPathway?.steps?.length || 0) && (resetPathway?.steps?.length || 0) > 0 && (
                  <motion.div
                    className="mt-6 p-6 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-5xl mb-3">✅</div>
                    <div className="text-xl font-bold text-green-400">Reset Procedure Complete!</div>
                    <div className="text-slate-400 mt-2">
                      {resetPathway?.successIndicator || 'The fault should now be cleared from the system'}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SOLUTION TAB */}
            {activeTab === 'solution' && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {solution && (
                  <>
                    {/* Solution overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center">
                        <div className="text-2xl mb-2">⚙️</div>
                        <div className="text-xs text-slate-500 uppercase">Difficulty</div>
                        <div className="text-lg font-bold text-cyan-400">{solution.difficulty}</div>
                      </div>
                      <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center">
                        <div className="text-2xl mb-2">⏱️</div>
                        <div className="text-xs text-slate-500 uppercase">Time Estimate</div>
                        <div className="text-lg font-bold text-cyan-400">{solution.timeEstimate}</div>
                      </div>
                      <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <div className="text-xs text-slate-500 uppercase">Estimated Cost</div>
                        <div className="text-lg font-bold text-green-400">
                          ${solution.estimatedCost?.min || 0} - ${solution.estimatedCost?.max || 500}
                        </div>
                      </div>
                    </div>

                    {/* Procedure steps */}
                    <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span>📝</span> Repair Procedure
                      </h3>
                      <div className="space-y-3">
                        {solution.procedureSteps?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <p className="text-slate-300">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools and Parts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tools */}
                      <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span>🔧</span> Tools Required
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {solution.tools?.map((tool, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-300">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Parts */}
                      <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span>📦</span> Parts That May Be Needed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {solution.parts && solution.parts.length > 0 ? (
                            solution.parts.map((part, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-300">
                                {part}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-sm">Parts depend on specific fault found during diagnosis</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preventive Measures */}
                    {fault.preventiveMeasures && fault.preventiveMeasures.length > 0 && (
                      <div className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span>🛡️</span> Preventive Measures - Avoid This Problem
                        </h3>
                        <ul className="space-y-2">
                          {fault.preventiveMeasures.map((measure, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                              <span className="text-blue-400 mt-0.5">✓</span>
                              <span>{measure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* AI INSIGHTS TAB - Unique Feature */}
            {activeTab === 'ai-insights' && enhancedFault && (
              <motion.div
                key="ai-insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* AI Pattern Analysis */}
                <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>🧠</span> AI Pattern Analysis
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{enhancedFault.aiInsights.patternAnalysis}</p>
                </div>

                {/* Predictive Indicators */}
                <div className="p-5 bg-slate-900/50 border border-cyan-500/30 rounded-xl">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>🔮</span> Predictive Indicators - Early Warning Signs
                  </h3>
                  <ul className="space-y-2">
                    {enhancedFault.aiInsights.predictiveIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-cyan-400 mt-0.5">▸</span>
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Correlated Faults */}
                <div className="p-5 bg-slate-900/50 border border-amber-500/30 rounded-xl">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>🔗</span> Correlated Faults - Check These Too
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {enhancedFault.aiInsights.correlatedFaults.map((fault, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-300">
                        {fault}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Environmental Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-900/50 border border-blue-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>📅</span> Seasonal Factors (Kenya)
                    </h3>
                    <p className="text-slate-300 text-sm">{enhancedFault.aiInsights.seasonalFactors}</p>
                  </div>
                  <div className="p-5 bg-slate-900/50 border border-green-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>🌍</span> Environmental Factors
                    </h3>
                    <p className="text-slate-300 text-sm">{enhancedFault.aiInsights.environmentalFactors}</p>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>💡</span> AI Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {enhancedFault.aiInsights.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Wiring Information */}
                <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>🔌</span> Wiring & Sensor Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.sensorLocation}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Wire Colors:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.wireColors.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Signal Type:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.signalType}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Voltage Range:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.voltageRange}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Resistance:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.resistance}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Pin Config:</span>
                      <p className="text-slate-300">{enhancedFault.wiringDiagram.pinConfiguration}</p>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                {enhancedFault.frequentlyAskedQuestions && enhancedFault.frequentlyAskedQuestions.length > 0 && (
                  <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>❓</span> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {enhancedFault.frequentlyAskedQuestions.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-white font-medium mb-2">Q: {faq.question}</p>
                          <p className="text-slate-400 text-sm">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 bg-slate-900/50 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Last updated: {fault.lastUpdated} | {fault.verified ? '✓ Verified' : 'Unverified'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <a
                href="https://wa.me/254768860665"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                💬 Need Help?
              </a>
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
  searchResults: ExtendedFaultCode[];
  isSearching: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFault, setSelectedFault] = useState<ExtendedFaultCode | null>(null);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  // Sample codes for when there are no search results
  const displayResults = searchResults.length > 0 ? searchResults : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔮</span>
          <div>
            <h2 className="text-xl font-bold text-purple-400 uppercase tracking-wider">Generator Oracle</h2>
            <p className="text-sm text-slate-500">230,000+ fault codes with detailed troubleshooting</p>
          </div>
        </div>
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
                    placeholder="Enter fault code (e.g., 1100), keyword, or description..."
                    className="w-full px-4 py-3 pl-8 bg-slate-950/80 border border-purple-500/30 rounded-xl text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                    style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)' }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">🔍</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50"
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
                {['1100', 'Oil Pressure', 'Coolant', 'Overspeed', 'Battery', 'Fuel', 'Voltage', 'Starting'].map((tag) => (
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
              {displayResults.length > 0 ? `Results (${displayResults.length} found)` : 'Search for a fault code to see detailed troubleshooting'}
            </h3>

            {displayResults.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔮</div>
                <div className="text-xl font-bold text-cyan-400 mb-2">Generator Oracle Ready</div>
                <div className="text-slate-500 max-w-md mx-auto">
                  Enter a fault code like <span className="text-cyan-400 font-mono">1100</span> or search for keywords like{' '}
                  <span className="text-cyan-400">"oil pressure"</span> to get detailed troubleshooting guidance.
                </div>
              </div>
            )}

            <div className="space-y-3">
              {displayResults.slice(0, 20).map((fault) => (
                <motion.div
                  key={fault.id}
                  className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition-all"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedFault(fault)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <span
                        className="flex-shrink-0 px-3 py-1 bg-slate-800 rounded-lg font-mono text-lg text-cyan-400 border border-cyan-500/30"
                        style={{ textShadow: '0 0 10px rgba(6,182,212,0.3)' }}
                      >
                        {fault.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium">{fault.title}</span>
                          <SeverityBadge severity={fault.severity} />
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{fault.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                          <span>{fault.brand}</span>
                          <span>•</span>
                          <span>{fault.model}</span>
                          <span>•</span>
                          <span>{fault.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-500">
                        {fault.solutions?.[0]?.timeEstimate || 'View details'}
                      </span>
                      <span className="text-cyan-500">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {displayResults.length > 20 && (
                <div className="text-center text-slate-500 text-sm py-4">
                  Showing 20 of {displayResults.length} results. Refine your search for more specific results.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Help & Support */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Features */}
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/30">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">What You Get</h3>
            <ul className="space-y-3">
              {[
                { icon: '📖', text: 'Detailed fault descriptions' },
                { icon: '👁️', text: 'Symptoms to look for' },
                { icon: '🎯', text: 'Ranked possible causes' },
                { icon: '🔍', text: 'Step-by-step diagnostics' },
                { icon: '🔄', text: 'Reset procedures with key sequences' },
                { icon: '🔧', text: 'Complete repair solutions' },
                { icon: '💬', text: 'Interactive guidance questions' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controllers Supported */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Controllers Supported</h3>
            <div className="space-y-2">
              {[
                { name: 'DeepSea Electronics', models: 'DSE 4510, 5210, 7320, 8660+' },
                { name: 'ComAp', models: 'InteliLite, InteliGen, InteliSys' },
                { name: 'Woodward', models: 'EasyGen 3000/3500, LS-5, GCP-30' },
                { name: 'SmartGen', models: 'HGM6100, HGM9500, HGM420' },
                { name: 'CAT PowerWizard', models: '1.0, 2.0, 4.1' },
              ].map((ctrl, idx) => (
                <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-sm font-medium text-white">{ctrl.name}</div>
                  <div className="text-xs text-slate-500">{ctrl.models}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Need Expert Help?</h3>

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
