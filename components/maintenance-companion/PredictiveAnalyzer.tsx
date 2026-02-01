'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SymptomInput,
  PredictionResult,
  analyzeSymptoms
} from '@/lib/maintenance-companion/predictiveEngine';
import PredictionCard from './shared/PredictionCard';

interface PredictiveAnalyzerProps {
  onViewGuide?: (guideId: string) => void;
  onViewPart?: (partId: string) => void;
}

export default function PredictiveAnalyzer({ onViewGuide, onViewPart }: PredictiveAnalyzerProps) {
  const [symptoms, setSymptoms] = useState<SymptomInput>({});
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('oil');

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      const results = analyzeSymptoms(symptoms);
      setPredictions(results);
      setIsAnalyzing(false);
    }, 1500);
  };

  const updateSymptom = <K extends keyof SymptomInput>(key: K, value: SymptomInput[K]) => {
    setSymptoms(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'oil', name: 'Oil System', icon: '🛢️' },
    { id: 'exhaust', name: 'Exhaust & Smoke', icon: '💨' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'power', name: 'Power Output', icon: '⚡' },
    { id: 'starting', name: 'Starting', icon: '🔑' },
    { id: 'noise', name: 'Noise & Vibration', icon: '📢' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Generator Talks - We Listen
        </h2>
        <p className="text-slate-400">
          Describe the symptoms and let our AI predict potential failures before they happen
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${activeSection === section.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'}
            `}
          >
            <span>{section.icon}</span>
            <span className="text-sm font-medium">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Symptom Input Forms */}
      <AnimatePresence mode="wait">
        {activeSection === 'oil' && (
          <motion.div
            key="oil"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🛢️</span> Oil System Symptoms
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Oil Consumption Rate (L/hour)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 0.3"
                  value={symptoms.oilConsumptionRate || ''}
                  onChange={(e) => updateSymptom('oilConsumptionRate', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Oil Pressure (bar)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 3.5"
                  value={symptoms.oilPressure || ''}
                  onChange={(e) => updateSymptom('oilPressure', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 text-sm block mb-2">Oil Condition</label>
                <div className="flex flex-wrap gap-2">
                  {(['clean', 'dark', 'milky', 'metallic'] as const).map((condition) => (
                    <button
                      key={condition}
                      onClick={() => updateSymptom('oilCondition', condition)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.oilCondition === condition
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'exhaust' && (
          <motion.div
            key="exhaust"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>💨</span> Exhaust & Smoke Symptoms
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Exhaust Smoke Color</label>
                <div className="flex flex-wrap gap-2">
                  {(['none', 'white', 'blue', 'black', 'grey'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSymptom('exhaustSmokeColor', color)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.exhaustSmokeColor === color
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {color === 'none' ? 'No Smoke' : color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">When Does Smoke Appear?</label>
                <div className="flex flex-wrap gap-2">
                  {(['startup', 'idle', 'load', 'constant'] as const).map((timing) => (
                    <button
                      key={timing}
                      onClick={() => updateSymptom('exhaustSmokeTiming', timing)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.exhaustSmokeTiming === timing
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {timing === 'startup' ? 'At Startup' :
                       timing === 'idle' ? 'At Idle' :
                       timing === 'load' ? 'Under Load' : 'Constant'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'temperature' && (
          <motion.div
            key="temperature"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🌡️</span> Temperature Symptoms
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Coolant Temperature (°C)</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  placeholder="e.g., 85"
                  value={symptoms.coolantTemp || ''}
                  onChange={(e) => updateSymptom('coolantTemp', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Temperature Rise Rate</label>
                <div className="flex flex-wrap gap-2">
                  {(['normal', 'fast', 'very-fast'] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => updateSymptom('tempRiseRate', rate)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        symptoms.tempRiseRate === rate
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {rate === 'normal' ? 'Normal' :
                       rate === 'fast' ? 'Faster Than Normal' : 'Very Fast'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'power' && (
          <motion.div
            key="power"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span> Power Output Symptoms
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">
                  Maximum Load Capacity (% of rated - can it reach 100%?)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="e.g., 75"
                  value={symptoms.maxLoadCapacity || ''}
                  onChange={(e) => updateSymptom('maxLoadCapacity', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Voltage Stability</label>
                <div className="flex flex-wrap gap-2">
                  {(['stable', 'fluctuating', 'dropping'] as const).map((stability) => (
                    <button
                      key={stability}
                      onClick={() => updateSymptom('voltageStability', stability)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.voltageStability === stability
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {stability}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Frequency Stability (50Hz)</label>
                <div className="flex flex-wrap gap-2">
                  {(['stable', 'fluctuating', 'hunting'] as const).map((stability) => (
                    <button
                      key={stability}
                      onClick={() => updateSymptom('frequencyStability', stability)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.frequencyStability === stability
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {stability === 'hunting' ? 'Hunting (±2Hz+)' : stability}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'starting' && (
          <motion.div
            key="starting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🔑</span> Starting Symptoms
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Starting Behavior</label>
                <div className="flex flex-wrap gap-2">
                  {(['instant', 'slow', 'difficult', 'no-start'] as const).map((behavior) => (
                    <button
                      key={behavior}
                      onClick={() => updateSymptom('startingBehavior', behavior)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        symptoms.startingBehavior === behavior
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {behavior === 'instant' ? 'Starts Instantly' :
                       behavior === 'slow' ? 'Slow to Start' :
                       behavior === 'difficult' ? 'Multiple Attempts' : 'Won\'t Start'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Cranking Speed</label>
                <div className="flex flex-wrap gap-2">
                  {(['normal', 'slow', 'very-slow'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateSymptom('crankingSpeed', speed)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        symptoms.crankingSpeed === speed
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {speed === 'normal' ? 'Normal' :
                       speed === 'slow' ? 'Slow Cranking' : 'Very Slow'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'noise' && (
          <motion.div
            key="noise"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>📢</span> Noise & Vibration Symptoms
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Unusual Noise Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['none', 'knocking', 'rattling', 'whistling', 'grinding'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateSymptom('noiseType', type)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.noiseType === type
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {type === 'none' ? 'No Unusual Noise' : type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Noise Location</label>
                <div className="flex flex-wrap gap-2">
                  {(['engine', 'turbo', 'alternator', 'exhaust', 'unknown'] as const).map((location) => (
                    <button
                      key={location}
                      onClick={() => updateSymptom('noiseLocation', location)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.noiseLocation === location
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Vibration Level</label>
                <div className="flex flex-wrap gap-2">
                  {(['normal', 'increased', 'excessive'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSymptom('vibrationLevel', level)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        symptoms.vibrationLevel === level
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleAnalyze}
          disabled={isAnalyzing || Object.keys(symptoms).length === 0}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
            transition-all transform
            ${isAnalyzing || Object.keys(symptoms).length === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 shadow-lg shadow-cyan-500/25'}
          `}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full"
              />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analyze & Predict
            </>
          )}
        </motion.button>
      </div>

      {/* Predictions Results */}
      {predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              AI Predictions ({predictions.length})
            </h3>
            <button
              onClick={() => setPredictions([])}
              className="text-slate-400 hover:text-white text-sm"
            >
              Clear Results
            </button>
          </div>
          <div className="grid gap-4">
            {predictions.map((prediction, index) => (
              <PredictionCard
                key={index}
                prediction={prediction}
                onViewGuide={onViewGuide}
                onViewPart={onViewPart}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* No Predictions State */}
      {predictions.length === 0 && !isAnalyzing && Object.keys(symptoms).length > 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Click &quot;Analyze &amp; Predict&quot; to get AI-powered failure predictions</p>
        </div>
      )}
    </div>
  );
}
