'use client';

/**
 * AI ANALYSIS PANEL
 * The most comprehensive AI-powered generator diagnostic interface
 * Provides 100% detailed, accurate analysis with predictive capabilities
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  performAIDiagnosis,
  performHybridDiagnosis,
  getAllParameterSpecs,
  type GeneratorReadings,
  type AIAnalysisResult,
} from '@/lib/generator-oracle/ai-diagnostic-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AIAnalysisPanelProps {
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: 'normal' | 'warning' | 'critical' | 'emergency' }) {
  const configs = {
    normal: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'NORMAL', pulse: false },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'WARNING', pulse: false },
    critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'CRITICAL', pulse: true },
    emergency: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', label: 'EMERGENCY', pulse: true },
  };

  const config = configs[status];

  return (
    <motion.span
      className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${config.bg} ${config.text} border ${config.border}`}
      animate={config.pulse ? { opacity: [1, 0.5, 1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      {config.label}
    </motion.span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH GAUGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function HealthGauge({ score, health }: { score: number; health: string }) {
  const getColor = () => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#84cc16';
    if (score >= 50) return '#f59e0b';
    if (score >= 25) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        <motion.circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={439.8}
          initial={{ strokeDashoffset: 439.8 }}
          animate={{ strokeDashoffset: 439.8 - (score / 100) * 439.8 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
        />
      </svg>
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: getColor() }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{health}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROBABILITY BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ProbabilityBar({ probability }: { probability: number }) {
  const getColor = () => {
    if (probability >= 70) return 'bg-red-500';
    if (probability >= 40) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <span className="text-sm font-bold text-white w-12 text-right">{probability}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ISSUE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function IssueCard({
  analysis,
  isExpanded,
  onToggle,
}: {
  analysis: AIAnalysisResult['detailedAnalysis'][0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'causes' | 'repair' | 'parts' | 'prevention'>('causes');

  return (
    <motion.div
      className={`rounded-xl border overflow-hidden ${
        analysis.issue.status === 'critical' || analysis.issue.status === 'emergency'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}
      layout
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">
              {analysis.issue.status === 'critical' || analysis.issue.status === 'emergency' ? '🚨' : '⚠️'}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-lg font-bold text-white">{analysis.issue.parameter}</h4>
                <StatusBadge status={analysis.issue.status} />
              </div>
              <p className="text-slate-300 mt-1">
                Reading: <span className="font-mono font-bold text-cyan-400">{analysis.issue.value} {analysis.issue.unit}</span>
              </p>
              <p className="text-slate-400 text-sm mt-1">{analysis.issue.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Est. Repair Cost</div>
              <div className="text-amber-400 font-bold">
                KES {analysis.estimatedCostKES.min.toLocaleString()} - {analysis.estimatedCostKES.max.toLocaleString()}
              </div>
            </div>
            <motion.span
              className="text-slate-400 text-xl"
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              ▼
            </motion.span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            {/* Tabs */}
            <div className="flex gap-1 p-2 bg-slate-900/50">
              {[
                { id: 'causes', label: 'Root Causes', icon: '🎯' },
                { id: 'repair', label: 'Repair Steps', icon: '🔧' },
                { id: 'parts', label: 'Parts & Tools', icon: '📦' },
                { id: 'prevention', label: 'Prevention', icon: '🛡️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-900/30">
              {/* ROOT CAUSES TAB */}
              {activeTab === 'causes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h5 className="text-sm font-bold text-cyan-400 mb-2">Technical Explanation</h5>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {analysis.technicalExplanation.slice(0, 800)}...
                    </p>
                  </div>

                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🎯</span> Possible Root Causes (Ranked by Probability)
                  </h5>

                  <div className="space-y-3">
                    {analysis.rootCauses.slice(0, 5).map((cause, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h6 className="text-white font-semibold">{cause.cause}</h6>
                            <ProbabilityBar probability={cause.probability} />
                          </div>
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            {cause.timeToVerify}
                          </span>
                        </div>

                        <p className="text-slate-400 text-sm mb-3">{cause.explanation}</p>

                        <div className="space-y-2">
                          <h6 className="text-xs text-cyan-400 font-bold uppercase">Verification Steps:</h6>
                          <ol className="list-decimal list-inside space-y-1">
                            {cause.verificationSteps.map((step, stepIdx) => (
                              <li key={stepIdx} className="text-slate-300 text-sm">{step}</li>
                            ))}
                          </ol>
                        </div>

                        {cause.toolsRequired.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            <span className="text-xs text-slate-500">Tools:</span>
                            {cause.toolsRequired.map((tool, toolIdx) => (
                              <span key={toolIdx} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <h5 className="text-sm font-bold text-orange-400 mb-2">System Impact</h5>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {analysis.systemImpact.slice(0, 600)}
                    </p>
                  </div>
                </div>
              )}

              {/* REPAIR STEPS TAB */}
              {activeTab === 'repair' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Estimated Total Repair Time:</span>
                    <span className="text-cyan-400 font-bold">{analysis.estimatedRepairTime}</span>
                  </div>

                  <div className="space-y-3">
                    {analysis.repairProcedure.map((step, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h6 className="text-white font-semibold mb-1">{step.action}</h6>
                            <p className="text-slate-400 text-sm mb-2">{step.details}</p>

                            {step.safetyWarning && (
                              <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm mb-2">
                                ⚠️ {step.safetyWarning}
                              </div>
                            )}

                            {step.tip && (
                              <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
                                💡 {step.tip}
                              </div>
                            )}

                            <div className="mt-2 text-xs text-slate-500">
                              Time: {step.timeEstimate}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PARTS & TOOLS TAB */}
              {activeTab === 'parts' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                      <span>📦</span> Parts Required
                    </h5>
                    <div className="space-y-3">
                      {analysis.partsRequired.map((part, idx) => (
                        <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="text-white font-semibold">{part.name}</h6>
                            <span className="text-amber-400 font-bold">
                              KES {part.estimatedCostKES.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mb-2">Quantity: {part.quantity}</div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-slate-500">Alternatives:</span>
                              {part.alternativeOptions.map((alt, altIdx) => (
                                <span key={altIdx} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                                  {alt}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-slate-500">Where to buy:</span>
                              {part.whereToSource.map((source, srcIdx) => (
                                <span key={srcIdx} className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">Estimated Total Parts Cost:</span>
                        <span className="text-amber-400 font-bold text-xl">
                          KES {analysis.partsRequired.reduce((acc, p) => acc + p.estimatedCostKES * p.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                      <span>🔧</span> Tools Required
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.toolsRequired.map((tool, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm text-cyan-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PREVENTION TAB */}
              {activeTab === 'prevention' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h5 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                      <span>🛡️</span> Preventive Measures
                    </h5>
                    <ul className="space-y-2">
                      {analysis.preventiveMeasures.map((measure, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-blue-400 mt-0.5">✓</span>
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h5 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <span>🔗</span> Related Faults to Watch For
                    </h5>
                    <ul className="space-y-2">
                      {analysis.relatedFaults.map((fault, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-purple-400 mt-0.5">▸</span>
                          <span>{fault}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AI ANALYSIS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

export default function AIAnalysisPanel({ className = '' }: AIAnalysisPanelProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [useAI, setUseAI] = useState(true);
  const [analysisSource, setAnalysisSource] = useState<'ai' | 'local' | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const parameterSpecs = useMemo(() => getAllParameterSpecs(), []);

  const handleInputChange = useCallback((key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const performAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setExpandedIssues(new Set());
    setAnalysisError(null);
    setAnalysisSource(null);

    // Convert string inputs to numbers for the readings
    const readings: GeneratorReadings = {};
    Object.entries(inputs).forEach(([key, value]) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        (readings as Record<string, number>)[key] = numValue;
      }
    });

    try {
      if (useAI) {
        // Use hybrid diagnosis (API call to AI with fallback)
        const response = await performHybridDiagnosis({
          readings,
          useAI: true,
        });

        setAnalysisResult(response.result);
        setAnalysisSource(response.source);
        if (response.error) {
          setAnalysisError(response.error);
        }
      } else {
        // Local analysis only
        await new Promise(resolve => setTimeout(resolve, 800)); // Brief delay for UX
        const result = performAIDiagnosis(readings);
        setAnalysisResult(result);
        setAnalysisSource('local');
      }
    } catch (error) {
      // Fallback to local on any error
      console.error('Analysis error:', error);
      const result = performAIDiagnosis(readings);
      setAnalysisResult(result);
      setAnalysisSource('local');
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
    }

    setIsAnalyzing(false);

    // Auto-expand first critical/warning issue (after state updates)
  }, [inputs, useAI]);

  // Auto-expand first issue when results change
  const lastResultRef = useRef<AIAnalysisResult | null>(null);
  useEffect(() => {
    if (analysisResult && analysisResult !== lastResultRef.current) {
      lastResultRef.current = analysisResult;
      if (analysisResult.detailedAnalysis.length > 0) {
        setExpandedIssues(new Set([analysisResult.detailedAnalysis[0].issue.id]));
      }
    }
  }, [analysisResult]);

  const clearAll = useCallback(() => {
    setInputs({});
    setAnalysisResult(null);
    setExpandedIssues(new Set());
    setAnalysisSource(null);
    setAnalysisError(null);
  }, []);

  const toggleIssue = useCallback((id: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Group parameters by category
  const parameterGroups = useMemo(() => {
    const groups: Record<string, Array<[string, typeof parameterSpecs[string]]>> = {};
    Object.entries(parameterSpecs).forEach(([key, spec]) => {
      if (!groups[spec.category]) {
        groups[spec.category] = [];
      }
      groups[spec.category].push([key, spec]);
    });
    return groups;
  }, [parameterSpecs]);

  const categoryLabels: Record<string, { label: string; icon: string }> = {
    engine: { label: 'Engine Parameters', icon: '⚙️' },
    electrical: { label: 'Electrical Parameters', icon: '⚡' },
    fuel: { label: 'Fuel System', icon: '⛽' },
    cooling: { label: 'Cooling System', icon: '❄️' },
    battery: { label: 'Battery & Charging', icon: '🔋' },
    load: { label: 'Load Parameters', icon: '📊' },
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          animate={{
            boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 40px rgba(236,72,153,0.5)', '0 0 20px rgba(168,85,247,0.5)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">🧠</span>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            AI Diagnostic Engine
          </h2>
          <p className="text-slate-400">100% detailed analysis with predictive intelligence</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Enter Your Generator Readings
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Input your meter readings below. The AI will analyze all parameters, detect problems, identify root causes, and provide 100% detailed solutions.
        </p>

        <div className="space-y-6">
          {Object.entries(parameterGroups).map(([category, params]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <span>{categoryLabels[category]?.icon || '📍'}</span>
                {categoryLabels[category]?.label || category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {params.map(([key, spec]) => (
                  <div key={key} className="bg-slate-800/50 rounded-lg p-3">
                    <label className="block text-slate-400 text-xs mb-1 truncate" title={spec.name}>
                      {spec.name}
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="--"
                        value={inputs[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-white text-sm font-mono focus:border-purple-500 focus:outline-none w-full min-w-0"
                      />
                      <span className="text-slate-500 text-xs whitespace-nowrap">{spec.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1">
                      Normal: {spec.normalMin}-{spec.normalMax}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mt-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{useAI ? '🤖' : '⚙️'}</span>
            <div>
              <h4 className="text-white font-semibold">Analysis Mode</h4>
              <p className="text-slate-400 text-sm">
                {useAI ? 'Claude AI - Advanced reasoning with real-time insights' : 'Local Engine - Fast rule-based analysis'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setUseAI(!useAI)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              useAI ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-600'
            }`}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
              animate={{ left: useAI ? '30px' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <motion.button
            onClick={performAnalysis}
            disabled={isAnalyzing || Object.keys(inputs).length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-4 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
              useAI
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/30'
            }`}
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>{useAI ? 'AI Analyzing...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <span className="text-xl">{useAI ? '🧠' : '⚙️'}</span>
                <span>{useAI ? 'PERFORM AI ANALYSIS' : 'PERFORM LOCAL ANALYSIS'}</span>
              </>
            )}
          </motion.button>
          <button
            onClick={clearAll}
            className="px-6 py-4 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Analysis Source Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  analysisSource === 'ai'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                }`}>
                  {analysisSource === 'ai' ? '🤖 AI Analysis' : '⚙️ Local Analysis'}
                </span>
                {analysisError && (
                  <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/50">
                    ⚠️ {analysisError}
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-sm">
                {new Date(analysisResult.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Health Score */}
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <HealthGauge score={analysisResult.healthScore} health={analysisResult.overallHealth} />
                <p className="text-center text-slate-400 text-sm mt-2">Overall Generator Health</p>
              </div>

              {/* Issue Summary */}
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <span className="text-red-400">Critical Issues</span>
                    <span className="text-2xl font-bold text-red-400">{analysisResult.criticalCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <span className="text-amber-400">Warnings</span>
                    <span className="text-2xl font-bold text-amber-400">{analysisResult.warningCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <span className="text-green-400">Normal</span>
                    <span className="text-2xl font-bold text-green-400">{analysisResult.normalCount}</span>
                  </div>
                </div>
              </div>

              {/* Primary Diagnosis */}
              <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/30">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Primary Diagnosis</h4>
                <h3 className="text-lg font-bold text-white mb-2">{analysisResult.primaryDiagnosis.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{analysisResult.primaryDiagnosis.summary}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Confidence:</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisResult.primaryDiagnosis.confidence}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 font-bold">{analysisResult.primaryDiagnosis.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className={`p-6 rounded-xl border ${
              analysisResult.criticalCount > 0
                ? 'bg-red-500/10 border-red-500/30'
                : analysisResult.warningCount > 0
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-green-500/10 border-green-500/30'
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                {analysisResult.criticalCount > 0 ? (
                  <><span className="text-red-400">🚨</span><span className="text-red-400">Executive Summary - CRITICAL</span></>
                ) : analysisResult.warningCount > 0 ? (
                  <><span className="text-amber-400">⚠️</span><span className="text-amber-400">Executive Summary - WARNING</span></>
                ) : (
                  <><span className="text-green-400">✅</span><span className="text-green-400">Executive Summary - HEALTHY</span></>
                )}
              </h4>
              <p className="text-white">{analysisResult.executiveSummary}</p>
            </div>

            {/* Immediate Actions */}
            {analysisResult.immediateActions.length > 0 && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-orange-500/30">
                <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>⚡</span> Immediate Actions Required
                </h4>
                <ol className="space-y-2">
                  {analysisResult.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Detailed Analysis */}
            {analysisResult.detailedAnalysis.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📋</span> Detailed Issue Analysis
                </h4>
                {analysisResult.detailedAnalysis.map((analysis) => (
                  <IssueCard
                    key={analysis.issue.id}
                    analysis={analysis}
                    isExpanded={expandedIssues.has(analysis.issue.id)}
                    onToggle={() => toggleIssue(analysis.issue.id)}
                  />
                ))}
              </div>
            )}

            {/* Correlations */}
            {analysisResult.correlations.length > 0 && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/30">
                <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🔗</span> Multi-Parameter Correlations Detected
                </h4>
                <div className="space-y-4">
                  {analysisResult.correlations.map((corr, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 font-semibold">{corr.parameters.join(' + ')}</span>
                      </div>
                      <h5 className="text-white font-medium mb-1">{corr.finding}</h5>
                      <p className="text-slate-400 text-sm mb-2">{corr.implication}</p>
                      <p className="text-amber-400 text-sm">
                        <strong>Action Required:</strong> {corr.actionRequired}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Predicted Failures */}
            {analysisResult.predictedFailures.length > 0 && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
                <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🔮</span> Predicted Failures (AI Insights)
                </h4>
                <div className="space-y-4">
                  {analysisResult.predictedFailures.map((pred, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{pred.component}</h5>
                        <span className="text-red-400 text-sm">
                          Cost if ignored: KES {pred.costIfIgnored.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-slate-400 text-sm">Timeframe: {pred.timeframe}</span>
                        <ProbabilityBar probability={pred.probability} />
                      </div>
                      <p className="text-green-400 text-sm">
                        <strong>Preventive Action:</strong> {pred.preventiveAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technician Notes */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📝</span> Technician Notes
              </h4>
              <p className="text-slate-300">{analysisResult.technicianNotes}</p>
            </div>

            {/* Support CTA */}
            <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Need Expert Assistance?</h4>
                  <p className="text-slate-400 text-sm">Our technicians are available 24/7 for emergency support</p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="tel:+254782914717"
                    className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    📞 Call Now
                  </a>
                  <a
                    href="https://wa.me/254768860665"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
