'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GeneratorAsset,
  RepairLogEntry,
  RepairVsReplaceResult,
  ROIAnalysis,
  UpsizingRecommendation,
  calculateTotalMaintenanceCost,
  calculateAverageAnnualMaintenance,
  analyzeRepairVsReplace,
  calculateROI,
  analyzeUpsizing,
  formatCurrency,
  sampleRepairHistory
} from '@/lib/maintenance-companion/financialCalculations';
import MetricGauge from './shared/MetricGauge';

type Tab = 'cost-tracker' | 'repair-vs-replace' | 'roi' | 'upsizing';

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('cost-tracker');

  // Demo asset
  const [asset] = useState<GeneratorAsset>({
    id: 'gen-001',
    name: 'Main Power Generator',
    brand: 'Cummins',
    model: 'C100D5',
    ratedCapacity: 100,
    purchaseDate: '2021-03-15',
    purchasePrice: 2500000,
    currentHours: 4500,
    estimatedLifeHours: 25000,
    repairHistory: sampleRepairHistory
  });

  const [repairVsReplaceInput, setRepairVsReplaceInput] = useState({
    upcomingRepairCost: 150000,
    newGeneratorCost: 3000000
  });

  const [roiInput, setRoiInput] = useState({
    monthlyRunningHours: 200,
    averageLoadKw: 75,
    valuePerKwh: 35
  });

  const [upsizingInput, setUpsizingInput] = useState({
    averageLoad: 75,
    peakLoad: 95,
    growthRate: 10
  });

  // Calculations
  const totalMaintenanceCost = calculateTotalMaintenanceCost(asset.repairHistory);
  const avgAnnualMaintenance = calculateAverageAnnualMaintenance(asset);

  const repairVsReplaceResult = analyzeRepairVsReplace(
    asset,
    repairVsReplaceInput.upcomingRepairCost,
    repairVsReplaceInput.newGeneratorCost
  );

  const roiResult = calculateROI(
    asset,
    roiInput.monthlyRunningHours,
    roiInput.averageLoadKw,
    roiInput.valuePerKwh
  );

  const upsizingResult = analyzeUpsizing(
    asset.ratedCapacity,
    upsizingInput.averageLoad,
    upsizingInput.peakLoad,
    80, // current efficiency
    upsizingInput.growthRate
  );

  const tabs = [
    { id: 'cost-tracker' as Tab, name: 'Cost Tracker', icon: '📊' },
    { id: 'repair-vs-replace' as Tab, name: 'Repair vs Replace', icon: '⚖️' },
    { id: 'roi' as Tab, name: 'ROI Analysis', icon: '💰' },
    { id: 'upsizing' as Tab, name: 'Upsizing Advice', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Financial Dashboard
        </h2>
        <p className="text-slate-400">
          Track costs, analyze ROI, and make data-driven maintenance decisions
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'}
            `}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Generator Info Header */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold">{asset.name}</h3>
            <p className="text-slate-400 text-sm">
              {asset.brand} {asset.model} • {asset.ratedCapacity} kW
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <span className="text-slate-500 text-xs block">Current Hours</span>
              <span className="text-white font-mono">{asset.currentHours.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Total Maintenance</span>
              <span className="text-amber-400 font-mono">{formatCurrency(totalMaintenanceCost)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Avg Annual</span>
              <span className="text-white font-mono">{formatCurrency(avgAnnualMaintenance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'cost-tracker' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Total Spent</span>
              <span className="text-amber-400 font-mono text-xl font-bold">
                {formatCurrency(totalMaintenanceCost)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Repair Count</span>
              <span className="text-white font-mono text-xl font-bold">
                {asset.repairHistory.length}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Cost Per Hour</span>
              <span className="text-cyan-400 font-mono text-xl font-bold">
                KES {(totalMaintenanceCost / asset.currentHours).toFixed(0)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Life Remaining</span>
              <span className="text-emerald-400 font-mono text-xl font-bold">
                {Math.round(((asset.estimatedLifeHours - asset.currentHours) / asset.estimatedLifeHours) * 100)}%
              </span>
            </div>
          </div>

          {/* Repair History */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Repair History</h3>
            </div>
            <div className="divide-y divide-slate-700/50">
              {asset.repairHistory.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{entry.description}</span>
                        {entry.description.toLowerCase().includes('emergency') && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                            Emergency
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <span className="text-slate-500">{entry.date}</span>
                        <span className="text-slate-500">@ {entry.engineHoursAtService.toLocaleString()} hours</span>
                        {entry.technician && (
                          <span className="text-slate-500">by {entry.technician}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {entry.partsReplaced.map((part, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-400 font-mono font-medium">
                        {formatCurrency(entry.partsCost + entry.laborCost)}
                      </span>
                      <div className="text-slate-500 text-xs mt-1">
                        Parts: {formatCurrency(entry.partsCost)}
                      </div>
                      <div className="text-slate-500 text-xs">
                        Labor: {formatCurrency(entry.laborCost)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'repair-vs-replace' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Input Form */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Analysis Parameters</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Upcoming Repair Cost (KES)</label>
                <input
                  type="number"
                  min="0"
                  value={repairVsReplaceInput.upcomingRepairCost}
                  onChange={(e) => setRepairVsReplaceInput(prev => ({
                    ...prev,
                    upcomingRepairCost: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">New Generator Cost (KES)</label>
                <input
                  type="number"
                  min="0"
                  value={repairVsReplaceInput.newGeneratorCost}
                  onChange={(e) => setRepairVsReplaceInput(prev => ({
                    ...prev,
                    newGeneratorCost: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`
            rounded-xl p-6 border
            ${repairVsReplaceResult.recommendation === 'repair'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : repairVsReplaceResult.recommendation === 'replace'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-amber-500/10 border-amber-500/30'}
          `}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl ${
                repairVsReplaceResult.recommendation === 'repair' ? 'text-emerald-400' :
                repairVsReplaceResult.recommendation === 'replace' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {repairVsReplaceResult.recommendation === 'repair' ? '✅' :
                 repairVsReplaceResult.recommendation === 'replace' ? '🔄' : '⚠️'}
              </span>
              <h3 className={`text-xl font-bold uppercase ${
                repairVsReplaceResult.recommendation === 'repair' ? 'text-emerald-400' :
                repairVsReplaceResult.recommendation === 'replace' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {repairVsReplaceResult.recommendation.replace('-', ' ')}
              </h3>
            </div>
            <p className="text-slate-300">{repairVsReplaceResult.summary}</p>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center">
              <MetricGauge
                value={repairVsReplaceResult.remainingLifePercentage}
                max={100}
                label="Remaining Life"
                showPercentage
                color="#10B981"
                warningThreshold={30}
                criticalThreshold={15}
              />
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-2">Current Book Value</span>
              <span className="text-cyan-400 font-mono text-2xl font-bold">
                {formatCurrency(repairVsReplaceResult.currentBookValue)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-2">Maintenance Cost/Hour</span>
              <span className="text-amber-400 font-mono text-2xl font-bold">
                KES {repairVsReplaceResult.maintenanceCostPerHour.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Factor Analysis */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Analysis Factors</h3>
            <div className="space-y-4">
              {Object.entries(repairVsReplaceResult.factors).map(([key, factor]) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-32 text-slate-400 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: factor.score > 70 ? '#EF4444' :
                                        factor.score > 40 ? '#F59E0B' : '#10B981'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="w-24 text-right text-slate-300 text-sm">{factor.note}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'roi' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Input Form */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">ROI Parameters</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Monthly Running Hours</label>
                <input
                  type="number"
                  min="0"
                  value={roiInput.monthlyRunningHours}
                  onChange={(e) => setRoiInput(prev => ({
                    ...prev,
                    monthlyRunningHours: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Average Load (kW)</label>
                <input
                  type="number"
                  min="0"
                  value={roiInput.averageLoadKw}
                  onChange={(e) => setRoiInput(prev => ({
                    ...prev,
                    averageLoadKw: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Value per kWh (KES)</label>
                <input
                  type="number"
                  min="0"
                  value={roiInput.valuePerKwh}
                  onChange={(e) => setRoiInput(prev => ({
                    ...prev,
                    valuePerKwh: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ROI Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Total Investment</span>
              <span className="text-white font-mono text-xl font-bold">
                {formatCurrency(roiResult.totalInvestment)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Total Operating Cost</span>
              <span className="text-amber-400 font-mono text-xl font-bold">
                {formatCurrency(roiResult.totalOperatingCost)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Value Generated</span>
              <span className="text-emerald-400 font-mono text-xl font-bold">
                {formatCurrency(roiResult.totalValueGenerated)}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
              <span className="text-slate-500 text-xs block mb-1">Net ROI</span>
              <span className={`font-mono text-xl font-bold ${roiResult.netROI > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {roiResult.netROI.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4">Cost Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost per Hour of Operation</span>
                  <span className="text-white font-mono">KES {roiResult.costPerHourOfOperation.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost per kWh Generated</span>
                  <span className="text-white font-mono">KES {roiResult.costPerKwhGenerated.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Depreciation</span>
                  <span className="text-white font-mono">{formatCurrency(roiResult.annualDepreciation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Asset Value</span>
                  <span className="text-cyan-400 font-mono">{formatCurrency(roiResult.currentAssetValue)}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4">Payback Analysis</h3>
              <div className="text-center">
                <span className="text-6xl font-bold text-cyan-400 font-mono">
                  {roiResult.paybackPeriodMonths}
                </span>
                <span className="text-slate-400 text-xl ml-2">months</span>
                <p className="text-slate-400 text-sm mt-4">
                  Time to recover initial investment based on current operating parameters
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'upsizing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Input Form */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Load Profile</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Average Load (kW)</label>
                <input
                  type="number"
                  min="0"
                  value={upsizingInput.averageLoad}
                  onChange={(e) => setUpsizingInput(prev => ({
                    ...prev,
                    averageLoad: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Peak Load (kW)</label>
                <input
                  type="number"
                  min="0"
                  value={upsizingInput.peakLoad}
                  onChange={(e) => setUpsizingInput(prev => ({
                    ...prev,
                    peakLoad: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Annual Growth Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={upsizingInput.growthRate}
                  onChange={(e) => setUpsizingInput(prev => ({
                    ...prev,
                    growthRate: parseInt(e.target.value) || 0
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`
            rounded-xl p-6 border
            ${upsizingResult.upgrade
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'}
          `}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">
                {upsizingResult.upgrade ? '📈' : '✅'}
              </span>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${upsizingResult.upgrade ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {upsizingResult.upgrade
                    ? `Consider Upgrading to ${upsizingResult.recommendedCapacity} kW`
                    : 'Current Size is Appropriate'}
                </h3>
                <p className="text-slate-300">{upsizingResult.reason}</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4">Current Generator</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-white font-mono">
                  {upsizingResult.currentCapacity}
                </span>
                <span className="text-slate-400 text-xl ml-2">kW</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost per kWh</span>
                  <span className="text-white font-mono">KES {upsizingResult.costAnalysis.currentCostPerKwh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Load</span>
                  <span className="text-white font-mono">{((upsizingInput.averageLoad / asset.ratedCapacity) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {upsizingResult.upgrade && (
              <div className="bg-cyan-500/10 rounded-xl p-6 border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-4">Recommended Upgrade</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-cyan-400 font-mono">
                    {upsizingResult.recommendedCapacity}
                  </span>
                  <span className="text-slate-400 text-xl ml-2">kW</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Projected Cost per kWh</span>
                    <span className="text-white font-mono">KES {upsizingResult.costAnalysis.projectedCostPerKwh}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Savings</span>
                    <span className="text-emerald-400 font-mono">{formatCurrency(upsizingResult.costAnalysis.annualSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payback Period</span>
                    <span className="text-white font-mono">{upsizingResult.costAnalysis.paybackPeriod} years</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
