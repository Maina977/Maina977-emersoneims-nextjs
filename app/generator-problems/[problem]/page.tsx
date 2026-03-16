'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPTOM_DIAGNOSES, type PossibleCause } from '@/lib/generator-oracle/educationalContent';

// Problem slug to symptom mapping
const PROBLEM_MAP: Record<string, string> = {
  'wont-start': "Generator Won't Start",
  'overheating': "Generator Overheating",
  'low-oil-pressure': "Low Oil Pressure",
  'voltage-frequency-unstable': "Unstable Voltage or Frequency",
  'exhaust-smoke': "Excessive Exhaust Smoke",
};

// Interactive diagnostic questions for each problem
const DIAGNOSTIC_QUESTIONS: Record<string, {
  id: string;
  question: string;
  options: { label: string; eliminates?: string[]; suggests?: string[] }[];
}[]> = {
  'wont-start': [
    {
      id: 'crank',
      question: 'Does the starter motor crank (turn) when you press start?',
      options: [
        { label: 'Yes, it cranks normally', eliminates: ['FLAT_BATTERY', 'STARTER_MOTOR_FAULT'] },
        { label: 'Yes, but slowly/weakly', suggests: ['FLAT_BATTERY'] },
        { label: 'No, nothing happens', suggests: ['FLAT_BATTERY', 'STARTER_MOTOR_FAULT', 'CONTROL_PANEL_FAULT'] },
        { label: 'Just a clicking sound', suggests: ['FLAT_BATTERY', 'STARTER_MOTOR_FAULT'] },
      ],
    },
    {
      id: 'fuel',
      question: 'Is there fuel in the tank and is it fresh (less than 6 months old)?',
      options: [
        { label: 'Yes, tank is full with fresh fuel', eliminates: ['AIR_IN_FUEL'] },
        { label: 'Tank is low or recently refilled', suggests: ['AIR_IN_FUEL'] },
        { label: 'Fuel is old/contaminated', suggests: ['AIR_IN_FUEL'] },
        { label: 'Not sure about fuel condition' },
      ],
    },
    {
      id: 'display',
      question: 'What does the controller display show?',
      options: [
        { label: 'Shows fault code or alarm', suggests: ['CONTROL_PANEL_FAULT'] },
        { label: 'Emergency stop indicator', suggests: ['CONTROL_PANEL_FAULT'] },
        { label: 'Normal display, no errors', eliminates: ['CONTROL_PANEL_FAULT'] },
        { label: 'Display is blank/off', suggests: ['FLAT_BATTERY', 'CONTROL_PANEL_FAULT'] },
      ],
    },
  ],
  'overheating': [
    {
      id: 'coolant',
      question: 'What is the coolant level in the expansion tank?',
      options: [
        { label: 'At normal level', eliminates: ['LOW_COOLANT'] },
        { label: 'Below minimum mark', suggests: ['LOW_COOLANT'] },
        { label: 'Empty or very low', suggests: ['LOW_COOLANT'] },
        { label: 'Unable to check right now' },
      ],
    },
    {
      id: 'load',
      question: 'What load percentage is the generator running at?',
      options: [
        { label: 'Less than 70%', eliminates: ['OVERLOAD'] },
        { label: '70-90%', },
        { label: 'Above 90% or unknown', suggests: ['OVERLOAD'] },
      ],
    },
    {
      id: 'fan',
      question: 'Is the cooling fan spinning when the engine is running?',
      options: [
        { label: 'Yes, spinning normally', eliminates: ['FAN_BELT_BROKEN'] },
        { label: 'No or spinning slowly', suggests: ['FAN_BELT_BROKEN'] },
        { label: 'Unable to check safely' },
      ],
    },
  ],
  'low-oil-pressure': [
    {
      id: 'level',
      question: 'What does the dipstick show for oil level?',
      options: [
        { label: 'Between min and max', eliminates: ['LOW_OIL_LEVEL'] },
        { label: 'Below minimum mark', suggests: ['LOW_OIL_LEVEL'] },
        { label: 'No oil on dipstick', suggests: ['LOW_OIL_LEVEL'] },
      ],
    },
    {
      id: 'oil_type',
      question: 'When was the oil last changed and what type was used?',
      options: [
        { label: 'Recent change, correct spec', eliminates: ['WRONG_OIL_VISCOSITY'] },
        { label: 'Not sure of oil spec used', suggests: ['WRONG_OIL_VISCOSITY'] },
        { label: 'Overdue for oil change' },
      ],
    },
  ],
  'voltage-frequency-unstable': [
    {
      id: 'load_balance',
      question: 'Is the load balanced across all three phases?',
      options: [
        { label: 'Yes, roughly equal', eliminates: ['LOAD_IMBALANCE'] },
        { label: 'No, unbalanced', suggests: ['LOAD_IMBALANCE'] },
        { label: 'Single phase system' },
        { label: 'Unknown' },
      ],
    },
    {
      id: 'fuel_steady',
      question: 'Is the engine speed steady or hunting (surging)?',
      options: [
        { label: 'Steady speed', eliminates: ['GOVERNOR_FAULT', 'FUEL_SUPPLY_ISSUE'] },
        { label: 'Hunting/surging', suggests: ['GOVERNOR_FAULT', 'FUEL_SUPPLY_ISSUE'] },
      ],
    },
  ],
  'exhaust-smoke': [
    {
      id: 'smoke_color',
      question: 'What color is the exhaust smoke?',
      options: [
        { label: 'Black smoke', suggests: ['BLACK_SMOKE_OVERLOAD', 'BLACK_SMOKE_AIR_FILTER'] },
        { label: 'White smoke', suggests: ['WHITE_SMOKE_COOLANT'] },
        { label: 'Blue smoke', suggests: ['BLUE_SMOKE_OIL'] },
        { label: 'Gray or mixed' },
      ],
    },
    {
      id: 'when_smoke',
      question: 'When does the smoke appear?',
      options: [
        { label: 'Only at startup', suggests: ['BLUE_SMOKE_OIL'] },
        { label: 'Under load', suggests: ['BLACK_SMOKE_OVERLOAD'] },
        { label: 'All the time', suggests: ['BLACK_SMOKE_AIR_FILTER', 'WHITE_SMOKE_COOLANT'] },
      ],
    },
  ],
};

export default function GeneratorProblemPage() {
  const params = useParams();
  const problemSlug = params.problem as string;
  const symptomName = PROBLEM_MAP[problemSlug];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedCause, setExpandedCause] = useState<string | null>(null);

  // Find the diagnosis data
  const diagnosis = SYMPTOM_DIAGNOSES.find(d => d.symptom === symptomName);
  const questions = DIAGNOSTIC_QUESTIONS[problemSlug] || [];

  if (!diagnosis) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Problem Not Found</h1>
          <Link href="/generator-problems" className="text-cyan-400 hover:underline">
            View All Generator Problems
          </Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate cause scores based on answers
  const getCauseScores = (): { cause: PossibleCause; score: number }[] => {
    const scores: Record<string, number> = {};

    // Initialize all causes with base scores based on likelihood
    diagnosis.possibleCauses.forEach(cause => {
      scores[cause.id] = cause.likelihood === 'high' ? 3 : cause.likelihood === 'medium' ? 2 : 1;
    });

    // Adjust scores based on answers
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options[optionIndex];
        option.suggests?.forEach(causeId => {
          if (scores[causeId] !== undefined) scores[causeId] += 2;
        });
        option.eliminates?.forEach(causeId => {
          if (scores[causeId] !== undefined) scores[causeId] -= 3;
        });
      }
    });

    return diagnosis.possibleCauses
      .map(cause => ({ cause, score: Math.max(0, scores[cause.id] || 0) }))
      .sort((a, b) => b.score - a.score);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetDiagnostic = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const rankedCauses = getCauseScores();

  const urgencyColors = {
    critical: 'bg-red-500/20 border-red-500/50 text-red-400',
    high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    low: 'bg-green-500/20 border-green-500/50 text-green-400',
  };

  const skillLevelColors = {
    basic: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400',
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <section className="py-8 md:py-12 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/generator-problems"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Problems
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {diagnosis.symptom}
              </h1>
              <p className="text-slate-300">{diagnosis.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${urgencyColors[diagnosis.urgency]}`}>
              {diagnosis.urgency.toUpperCase()} URGENCY
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Diagnostic Section */}
      {questions.length > 0 && !showResults && (
        <section className="py-8 md:py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 md:p-8">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span>Diagnostic Progress</span>
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                    {currentQuestion.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full p-4 text-left bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-cyan-500 flex items-center justify-center text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-white">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Skip to Results */}
              <button
                onClick={() => setShowResults(true)}
                className="mt-6 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Skip to all possible causes
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {(showResults || questions.length === 0) && (
        <section className="py-8 md:py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Reset Button */}
            {questions.length > 0 && (
              <button
                onClick={resetDiagnostic}
                className="mb-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart Diagnostic
              </button>
            )}

            <h2 className="text-2xl font-bold text-white mb-6">
              Possible Causes
              {questions.length > 0 && Object.keys(answers).length > 0 && (
                <span className="text-slate-400 font-normal text-lg ml-2">(Ranked by your answers)</span>
              )}
            </h2>

            {/* Causes List */}
            <div className="space-y-4">
              {rankedCauses.map(({ cause, score }, idx) => (
                <motion.div
                  key={cause.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-slate-900/50 border rounded-xl overflow-hidden transition-all ${
                    idx === 0 && score > 0 ? 'border-cyan-500/50' : 'border-slate-700'
                  }`}
                >
                  {/* Cause Header */}
                  <button
                    onClick={() => setExpandedCause(expandedCause === cause.id ? null : cause.id)}
                    className="w-full p-4 md:p-6 flex items-start justify-between text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{cause.cause}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`capitalize ${
                            cause.likelihood === 'high' ? 'text-red-400' :
                            cause.likelihood === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {cause.likelihood} likelihood
                          </span>
                          <span className="text-slate-500">|</span>
                          <span className={skillLevelColors[cause.skillLevel]}>
                            {cause.skillLevel.charAt(0).toUpperCase() + cause.skillLevel.slice(1)} level
                          </span>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-400">{cause.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expandedCause === cause.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedCause === cause.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 md:p-6 pt-0 space-y-6 border-t border-slate-700">
                          {/* Explanation */}
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Explanation</h4>
                            <p className="text-slate-300">{cause.explanation}</p>
                          </div>

                          {/* Check Procedure */}
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">Step-by-Step Check Procedure</h4>
                            <ol className="space-y-3">
                              {cause.checkProcedure.map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-medium">
                                    {i + 1}
                                  </span>
                                  <span className="text-slate-300">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Required Tools */}
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Required Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {cause.requiredTools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Parts Needed */}
                          {cause.partsNeeded && cause.partsNeeded.length > 0 && (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Parts That May Be Needed</h4>
                              <div className="flex flex-wrap gap-2">
                                {cause.partsNeeded.map((part, i) => (
                                  <span key={i} className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm text-amber-400">
                                    {part}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Safety Warnings */}
                          {cause.safetyWarnings && cause.safetyWarnings.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                              <h4 className="text-xs uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
                                <span>Warning</span> Safety Precautions
                              </h4>
                              <ul className="space-y-1">
                                {cause.safetyWarnings.map((warning, i) => (
                                  <li key={i} className="text-sm text-red-300 flex items-start gap-2">
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
                </motion.div>
              ))}
            </div>

            {/* Preventive Measures */}
            <div className="mt-12 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">Preventive Measures</h3>
              <ul className="space-y-2">
                {diagnosis.preventiveMeasures.map((measure, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Fault Codes */}
            {diagnosis.relatedFaultCodes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">Related Fault Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.relatedFaultCodes.map((code, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-cyan-400">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Professional Help?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            If you're not comfortable diagnosing or repairing this issue yourself,
            our certified technicians are available 24/7 across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Launch Generator Oracle
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors"
            >
              Call Emergency Service
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
