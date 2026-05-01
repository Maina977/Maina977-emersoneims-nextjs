'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EfficiencyInput,
  EfficiencyResult,
  calculateEfficiency,
  analyzeLoad,
  LoadAnalysis,
  efficiencyRatingColors
} from '@/lib/maintenance-companion/efficiencyCalculations';
import MetricGauge from './shared/MetricGauge';

export default function EfficiencyCalculator() {
  const [input, setInput] = useState<EfficiencyInput>({
    fuelConsumption: 0,
    loadKw: 0,
    ratedCapacity: 100,
    runningHours: 8,
    fuelPrice: 180,
    electricityTariff: 25
  });

  const [result, setResult] = useState<EfficiencyResult | null>(null);
  const [loadAnalysis, setLoadAnalysis] = useState<LoadAnalysis | null>(null);

  useEffect(() => {
    if (input.fuelConsumption > 0 && input.loadKw > 0 && input.ratedCapacity > 0) {
      const effResult = calculateEfficiency(input);
      setResult(effResult);
      setLoadAnalysis(analyzeLoad(input.loadKw, input.ratedCapacity));
    } else {
      setResult(null);
      setLoadAnalysis(null);
    }
  }, [input]);

  const updateInput = <K extends keyof EfficiencyInput>(key: K, value: EfficiencyInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const loadStatusColors = {
    underloaded: '#F59E0B',
    optimal: '#10B981',
    overloaded: '#EF4444'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Generator Efficiency Calculator
        </h2>
        <p className="text-slate-400">
          Real-time fuel efficiency analysis and cost comparison
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-white font-semibold mb-4">Operating Parameters</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-400 text-sm block mb-2">Fuel Consumption (L/hour)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 25"
              value={input.fuelConsumption || ''}
              onChange={(e) => updateInput('fuelConsumption', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Current Load (kW)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 75"
              value={input.loadKw || ''}
              onChange={(e) => updateInput('loadKw', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Rated Capacity (kW)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 100"
              value={input.ratedCapacity || ''}
              onChange={(e) => updateInput('ratedCapacity', parseFloat(e.target.value) || 100)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Daily Running Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              placeholder="e.g., 8"
              value={input.runningHours || ''}
              onChange={(e) => updateInput('runningHours', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Fuel Price (KES/L)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 180"
              value={input.fuelPrice || ''}
              onChange={(e) => updateInput('fuelPrice', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Grid Tariff (KES/kWh)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 25"
              value={input.electricityTariff || ''}
              onChange={(e) => updateInput('electricityTariff', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Gauges Row */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center">
              <MetricGauge
                value={result.efficiency}
                max={100}
                label="Efficiency"
                unit="%"
                color={efficiencyRatingColors[result.fuelEfficiencyRating]}
                size="lg"
                showPercentage
              />
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center">
              <MetricGauge
                value={result.loadPercentage}
                max={120}
                label="Load Level"
                unit="%"
                color={loadAnalysis ? loadStatusColors[loadAnalysis.loadStatus] : '#06B6D4'}
                size="lg"
                showPercentage
                warningThreshold={80}
                criticalThreshold={100}
              />
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center">
              <MetricGauge
                value={result.costPerKwh}
                max={100}
                label="Cost per kWh"
                unit="KES"
                color="#F59E0B"
                size="lg"
              />
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center">
              <div className="text-center">
                <span
                  className="text-4xl font-bold uppercase"
                  style={{ color: efficiencyRatingColors[result.fuelEfficiencyRating] }}
                >
                  {result.fuelEfficiencyRating}
                </span>
                <span className="text-slate-400 text-sm block mt-2">Fuel Efficiency Rating</span>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              rounded-xl p-4 border
              ${result.isOverloaded
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : result.isUnderloaded
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}
            `}
          >
            <p className="text-sm leading-relaxed">{result.recommendation}</p>
          </motion.div>

          {/* Grid Comparison */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Generator vs Grid Comparison (Daily)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Generator Cost</span>
                <span className="text-amber-400 font-mono text-xl font-bold">
                  KES {result.comparisonToGrid.generatorCost.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Grid Cost (Equivalent)</span>
                <span className="text-blue-400 font-mono text-xl font-bold">
                  KES {result.comparisonToGrid.gridCost.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">
                  {result.comparisonToGrid.savings > 0 ? 'Your Savings' : 'Extra Cost'}
                </span>
                <span
                  className={`font-mono text-xl font-bold ${
                    result.comparisonToGrid.savings > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  KES {Math.abs(result.comparisonToGrid.savings).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cost Projections */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Fuel Cost Projections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Daily</span>
                <span className="text-white font-mono text-lg font-bold">
                  KES {result.projections.daily.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Weekly</span>
                <span className="text-white font-mono text-lg font-bold">
                  KES {result.projections.weekly.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Monthly</span>
                <span className="text-cyan-400 font-mono text-lg font-bold">
                  KES {result.projections.monthly.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <span className="text-slate-500 text-xs block mb-1">Yearly</span>
                <span className="text-amber-400 font-mono text-lg font-bold">
                  KES {result.projections.yearly.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Potential Savings */}
          {result.potentialSavings.monthly > 0 && (
            <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-emerald-400 font-semibold mb-2">Potential Savings Opportunity</h3>
              <p className="text-slate-300 text-sm mb-4">{result.potentialSavings.recommendation}</p>
              <div className="flex gap-6">
                <div>
                  <span className="text-slate-500 text-xs block">Monthly Savings</span>
                  <span className="text-emerald-400 font-mono text-xl font-bold">
                    KES {result.potentialSavings.monthly.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Yearly Savings</span>
                  <span className="text-emerald-400 font-mono text-xl font-bold">
                    KES {result.potentialSavings.yearly.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Load Analysis */}
          {loadAnalysis && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4">Load Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Load</span>
                  <span className="text-white font-mono">{loadAnalysis.currentLoad}% of rated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Optimal Load</span>
                  <span className="text-white font-mono">{loadAnalysis.optimalLoad}% of rated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Load Status</span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium uppercase"
                    style={{
                      backgroundColor: `${loadStatusColors[loadAnalysis.loadStatus]}20`,
                      color: loadStatusColors[loadAnalysis.loadStatus]
                    }}
                  >
                    {loadAnalysis.loadStatus}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-slate-300 text-sm">{loadAnalysis.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!result && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-slate-400">
            Enter your generator&apos;s operating parameters to calculate efficiency
          </p>
        </div>
      )}
    </div>
  );
}
