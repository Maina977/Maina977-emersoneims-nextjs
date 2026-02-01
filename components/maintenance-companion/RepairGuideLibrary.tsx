'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RepairGuide,
  repairGuides,
  searchGuides,
  getGuidesByCategory,
  difficultyColors,
  difficultyLabels
} from '@/lib/maintenance-companion/repairGuides';
import RepairStepCard from './shared/RepairStepCard';

interface RepairGuideLibraryProps {
  initialGuideId?: string;
  isTechnicianMode?: boolean;
}

export default function RepairGuideLibrary({ initialGuideId, isTechnicianMode = true }: RepairGuideLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<RepairGuide | null>(
    initialGuideId ? repairGuides.find(g => g.id === initialGuideId) || null : null
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const categories = [
    { id: 'general', name: 'General', icon: '📋' },
    { id: 'engine', name: 'Engine', icon: '⚙️' },
    { id: 'fuel', name: 'Fuel System', icon: '⛽' },
    { id: 'cooling', name: 'Cooling', icon: '❄️' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'exhaust', name: 'Exhaust', icon: '💨' },
    { id: 'control', name: 'Control', icon: '🎛️' }
  ];

  const filteredGuides = searchQuery
    ? searchGuides(searchQuery)
    : selectedCategory
      ? getGuidesByCategory(selectedCategory as RepairGuide['category'])
      : repairGuides;

  const handleSelectGuide = (guide: RepairGuide) => {
    setSelectedGuide(guide);
    setCompletedSteps([]);
    setActiveStep(0);
  };

  const handleCompleteStep = (stepNumber: number) => {
    setCompletedSteps(prev => [...prev, stepNumber]);
    if (selectedGuide && stepNumber < selectedGuide.steps.length) {
      setActiveStep(stepNumber + 1);
    }
  };

  const handleBack = () => {
    setSelectedGuide(null);
    setCompletedSteps([]);
    setActiveStep(0);
  };

  // Guide Detail View
  if (selectedGuide) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Guides
        </button>

        {/* Guide Header */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedGuide.title}</h2>
              <p className="text-slate-400 mb-4">{selectedGuide.description}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${difficultyColors[selectedGuide.difficulty]}20`,
                    color: difficultyColors[selectedGuide.difficulty]
                  }}
                >
                  {difficultyLabels[selectedGuide.difficulty]}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                  {selectedGuide.timeEstimate}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-sm block">Progress</span>
              <span className="text-white font-mono text-2xl">
                {completedSteps.length} / {selectedGuide.steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Safety Warnings */}
        {selectedGuide.safetyWarnings.length > 0 && (
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Safety Warnings
            </h3>
            <ul className="space-y-2">
              {selectedGuide.safetyWarnings.map((warning, index) => (
                <li key={index} className="text-red-300 text-sm flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools Required */}
        {isTechnicianMode && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tools Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedGuide.tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-900 text-slate-300 rounded-lg text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Step-by-Step Instructions</h3>
          {selectedGuide.steps.map((step, index) => (
            <RepairStepCard
              key={step.stepNumber}
              step={step}
              isActive={activeStep === index}
              isCompleted={completedSteps.includes(step.stepNumber)}
              onComplete={() => handleCompleteStep(step.stepNumber)}
            />
          ))}
        </div>

        {/* Completion Status */}
        {completedSteps.length === selectedGuide.steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30 text-center"
          >
            <svg className="w-16 h-16 mx-auto text-emerald-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-emerald-400 text-xl font-bold mb-2">Repair Complete!</h3>
            <p className="text-slate-400">All steps have been completed successfully.</p>
          </motion.div>
        )}

        {/* Related Info */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Fault Codes */}
          {selectedGuide.linkedFaultCodes.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3">Related Fault Codes</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGuide.linkedFaultCodes.map((code) => (
                  <span
                    key={code}
                    className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded text-sm font-mono"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Part Numbers */}
          {selectedGuide.partNumbers.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3">Required Parts</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGuide.partNumbers.map((part) => (
                  <span
                    key={part}
                    className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded text-sm font-mono"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Guide List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Repair Guide Library
        </h2>
        <p className="text-slate-400">
          Step-by-step repair instructions for common generator issues
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by symptom, part, or fault code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            selectedCategory === null
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          All Guides
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Guide List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredGuides.map((guide) => (
            <motion.div
              key={guide.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
              onClick={() => handleSelectGuide(guide)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{guide.symptom}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${difficultyColors[guide.difficulty]}20`,
                        color: difficultyColors[guide.difficulty]
                      }}
                    >
                      {guide.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                      {guide.timeEstimate}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 capitalize">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400">No repair guides found matching your search.</p>
        </div>
      )}
    </div>
  );
}
