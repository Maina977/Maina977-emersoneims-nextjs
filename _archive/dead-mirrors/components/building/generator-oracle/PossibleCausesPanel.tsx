'use client';

/**
 * PossibleCausesPanel - Educational Diagnostic Content
 *
 * Displays possible causes, check procedures, and solutions.
 * Optimized for SEO and turning the tool into a knowledge base.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  searchSymptoms,
  type SymptomDiagnosis,
  type PossibleCause
} from '@/lib/generator-oracle/educationalContent';

interface PossibleCausesPanelProps {
  faultDescription?: string;
  symptomKeyword?: string;
}

export default function PossibleCausesPanel({
  faultDescription,
  symptomKeyword
}: PossibleCausesPanelProps) {
  const [expandedCause, setExpandedCause] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(symptomKeyword || '');

  // Find matching diagnoses
  const diagnoses = searchSymptoms(searchQuery || faultDescription || '');
  const primaryDiagnosis = diagnoses[0];

  if (!primaryDiagnosis && !searchQuery) {
    return null;
  }

  const urgencyColors = {
    critical: 'bg-red-500/20 border-red-500/50 text-red-400',
    high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    low: 'bg-green-500/20 border-green-500/50 text-green-400'
  };

  const likelihoodColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const skillLevelLabels = {
    basic: { label: 'Basic', color: 'text-green-400' },
    intermediate: { label: 'Intermediate', color: 'text-yellow-400' },
    advanced: { label: 'Advanced', color: 'text-red-400' }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 md:p-6">
      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
          Search Problem / Symptom
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g., generator won't start, overheating, black smoke..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {primaryDiagnosis ? (
        <>
          {/* Symptom Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {primaryDiagnosis.symptom}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${urgencyColors[primaryDiagnosis.urgency]}`}>
                {primaryDiagnosis.urgency.toUpperCase()} URGENCY
              </span>
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {primaryDiagnosis.description}
            </p>
          </div>

          {/* Possible Causes List */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              Possible Causes ({primaryDiagnosis.possibleCauses.length})
            </h4>

            <div className="space-y-3">
              {primaryDiagnosis.possibleCauses.map((cause) => (
                <CauseCard
                  key={cause.id}
                  cause={cause}
                  isExpanded={expandedCause === cause.id}
                  onToggle={() => setExpandedCause(expandedCause === cause.id ? null : cause.id)}
                  likelihoodColors={likelihoodColors}
                  skillLevelLabels={skillLevelLabels}
                />
              ))}
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              Preventive Measures
            </h4>
            <ul className="space-y-2">
              {primaryDiagnosis.preventiveMeasures.map((measure, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  {measure}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Fault Codes */}
          {primaryDiagnosis.relatedFaultCodes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Related Fault Codes:</h4>
              <div className="flex flex-wrap gap-2">
                {primaryDiagnosis.relatedFaultCodes.map((code) => (
                  <span
                    key={code}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-cyan-400"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : searchQuery ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No matching diagnoses found for "{searchQuery}"</p>
          <p className="text-sm text-slate-500 mt-2">Try searching for: generator won't start, overheating, low oil pressure, voltage fluctuation, or smoke</p>
        </div>
      ) : null}
    </div>
  );
}

// Separate component for cause card to reduce re-renders
function CauseCard({
  cause,
  isExpanded,
  onToggle,
  likelihoodColors,
  skillLevelLabels
}: {
  cause: PossibleCause;
  isExpanded: boolean;
  onToggle: () => void;
  likelihoodColors: Record<string, string>;
  skillLevelLabels: Record<string, { label: string; color: string }>;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      {/* Cause Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Likelihood Indicator */}
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${likelihoodColors[cause.likelihood]}`} />
            <span className="text-[10px] text-slate-500 mt-1">{cause.likelihood}</span>
          </div>

          <div>
            <h5 className="font-semibold text-white">{cause.cause}</h5>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className={skillLevelLabels[cause.skillLevel].color}>
                {skillLevelLabels[cause.skillLevel].label}
              </span>
              <span>•</span>
              <span>{cause.estimatedTime}</span>
            </div>
          </div>
        </div>

        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-slate-700">
              {/* Explanation */}
              <div>
                <h6 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Explanation</h6>
                <p className="text-sm text-slate-300">{cause.explanation}</p>
              </div>

              {/* Check Procedure */}
              <div>
                <h6 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Check Procedure</h6>
                <ol className="space-y-2">
                  {cause.checkProcedure.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="flex-shrink-0 w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Required Tools */}
              <div>
                <h6 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Required Tools</h6>
                <div className="flex flex-wrap gap-2">
                  {cause.requiredTools.map((tool) => (
                    <span key={tool} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parts Needed */}
              {cause.partsNeeded && cause.partsNeeded.length > 0 && (
                <div>
                  <h6 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Parts That May Be Needed</h6>
                  <div className="flex flex-wrap gap-2">
                    {cause.partsNeeded.map((part) => (
                      <span key={part} className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-400">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Warnings */}
              {cause.safetyWarnings && cause.safetyWarnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <h6 className="text-xs uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
                    <span>⚠️</span> Safety Warnings
                  </h6>
                  <ul className="space-y-1">
                    {cause.safetyWarnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
