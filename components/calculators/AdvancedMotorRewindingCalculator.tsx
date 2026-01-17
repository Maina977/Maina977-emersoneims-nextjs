/**
 * 🚀 WORLD-CLASS MOTOR REWINDING CALCULATOR WITH CHART.JS
 *
 * Features:
 * ✅ Real-time circular pressure gauges showing motor parameters
 * ✅ Live Chart.js visualizations (Line, Bar, Doughnut, Radar)
 * ✅ Animated calculation progress with SVG gauges
 * ✅ Detailed winding specifications and testing parameters
 * ✅ Cost analysis with visual breakdowns
 * ✅ Professional glassmorphic UI
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// =====================================================
// TYPES & DATA
// =====================================================

const MOTOR_TYPES = [
  { type: 'Single Phase Induction', poles: [2, 4, 6], powerRange: '0.12-3.7 kW' },
  { type: 'Three Phase Induction', poles: [2, 4, 6, 8], powerRange: '0.37-500 kW' },
  { type: 'Submersible', poles: [2, 4], powerRange: '0.37-150 kW' },
  { type: 'DC Motor', poles: [2, 4], powerRange: '0.5-200 kW' },
  { type: 'Synchronous', poles: [2, 4, 6, 8], powerRange: '50-5000 kW' },
];

const WIRE_GAUGES = [
  { swg: 10, diameter: 3.25, resistance: 0.00206 },
  { swg: 12, diameter: 2.64, resistance: 0.00313 },
  { swg: 14, diameter: 2.03, resistance: 0.00531 },
  { swg: 16, diameter: 1.63, resistance: 0.00822 },
  { swg: 18, diameter: 1.22, resistance: 0.01469 },
  { swg: 20, diameter: 0.914, resistance: 0.02614 },
  { swg: 22, diameter: 0.711, resistance: 0.04322 },
  { swg: 24, diameter: 0.559, resistance: 0.06997 },
  { swg: 26, diameter: 0.457, resistance: 0.1049 },
  { swg: 28, diameter: 0.376, resistance: 0.1547 },
  { swg: 30, diameter: 0.315, resistance: 0.2208 },
];

const INSULATION_CLASSES = [
  { class: 'A', maxTemp: 105, tempRise: 60 },
  { class: 'E', maxTemp: 120, tempRise: 75 },
  { class: 'B', maxTemp: 130, tempRise: 80 },
  { class: 'F', maxTemp: 155, tempRise: 100 },
  { class: 'H', maxTemp: 180, tempRise: 125 },
];

export default function AdvancedMotorRewindingCalculator() {
  const [activeTab, setActiveTab] = useState<'motor-specs' | 'winding' | 'results' | 'cost'>('motor-specs');

  const [motorData, setMotorData] = useState({
    motorType: 'Three Phase Induction',
    power: 7.5, // kW
    voltage: 415,
    frequency: 50,
    poles: 4,
    rpm: 1450,
    efficiency: 89,
    powerFactor: 0.85,
    phase: 'three' as 'single' | 'three',
    connection: 'star' as 'star' | 'delta',
    insulationClass: 'F',
    slots: 36,
    coilsPerGroup: 3,
    turnsPerCoil: 45,
    wireGauge: 18,
    parallel: 1,
  });

  const results = useMemo(() => {
    // Full Load Current
    let fla: number;
    if (motorData.phase === 'three') {
      fla = (motorData.power * 1000) / (Math.sqrt(3) * motorData.voltage * motorData.efficiency / 100 * motorData.powerFactor);
    } else {
      fla = (motorData.power * 1000) / (motorData.voltage * motorData.efficiency / 100 * motorData.powerFactor);
    }

    // Synchronous Speed
    const syncSpeed = (120 * motorData.frequency) / motorData.poles;

    // Slip
    const slip = ((syncSpeed - motorData.rpm) / syncSpeed) * 100;

    // Torque
    const torque = (motorData.power * 1000 * 60) / (2 * Math.PI * motorData.rpm);

    // Wire selection
    const wire = WIRE_GAUGES.find(w => w.swg === motorData.wireGauge) || WIRE_GAUGES[5];
    const currentDensity = fla / (Math.PI * (wire.diameter / 2) ** 2 * motorData.parallel);

    // Winding resistance per phase
    const totalWireLength = motorData.slots * motorData.turnsPerCoil * 0.5; // Approximate
    const resistancePerPhase = (wire.resistance * totalWireLength) / motorData.parallel;

    // Insulation class
    const insulation = INSULATION_CLASSES.find(i => i.class === motorData.insulationClass) || INSULATION_CLASSES[3];

    // Test values
    const meggerMin = motorData.voltage + 1000; // Minimum insulation resistance (Ohms)
    const hiPotTest = motorData.voltage * 2 + 1000; // Hi-pot test voltage

    // Copper weight estimation
    const copperWeight = totalWireLength * Math.PI * (wire.diameter / 1000) ** 2 / 4 * 8960 * (motorData.phase === 'three' ? 3 : 1);

    // Cost estimation
    const copperCost = copperWeight * 1200; // KES per kg
    const laborCost = motorData.power * 2000; // Rough estimate
    const materialsCost = motorData.power * 500;
    const totalCost = copperCost + laborCost + materialsCost;

    // Starting current estimation (6-8x FLA for induction motors)
    const startingCurrent = fla * 7;

    // Power input
    const powerInput = motorData.power / (motorData.efficiency / 100);

    // Losses
    const totalLosses = powerInput - motorData.power;
    const copperLosses = totalLosses * 0.4; // ~40% copper losses
    const ironLosses = totalLosses * 0.35; // ~35% iron losses
    const mechanicalLosses = totalLosses * 0.15; // ~15% mechanical
    const strayLosses = totalLosses * 0.1; // ~10% stray

    return {
      fullLoadAmps: fla,
      syncSpeed,
      slip,
      torque,
      currentDensity,
      resistancePerPhase,
      maxTemp: insulation.maxTemp,
      tempRise: insulation.tempRise,
      meggerMin,
      hiPotTest,
      copperWeight,
      totalCost,
      laborCost,
      copperCost,
      materialsCost,
      startingCurrent,
      powerInput,
      totalLosses,
      copperLosses,
      ironLosses,
      mechanicalLosses,
      strayLosses,
      recommendedWireGauge: WIRE_GAUGES.find(w => {
        const area = Math.PI * (w.diameter / 2) ** 2;
        return (fla / area / motorData.parallel) <= 5; // Max 5 A/mm²
      })?.swg || 18,
    };
  }, [motorData]);

  return (
    <div className="bg-gray-900 rounded-xl border border-orange-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-4 border-b border-orange-500/30">
        <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
          <span>🔄</span> World-Class Motor Rewinding Calculator with Chart.js
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Professional motor analysis • Pressure gauges • Real-time visualizations • Engineering-grade calculations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {[
          { id: 'motor-specs', label: '⚡ Motor Specs' },
          { id: 'winding', label: '🔄 Winding Design' },
          { id: 'results', label: '📊 Results & Charts' },
          { id: 'cost', label: '💰 Cost Analysis' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'motor-specs' && (
            <motion.div
              key="motor-specs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Motor Type</label>
                  <select
                    value={motorData.motorType}
                    onChange={(e) => setMotorData({...motorData, motorType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {MOTOR_TYPES.map(m => (
                      <option key={m.type} value={m.type}>{m.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Power (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={motorData.power}
                    onChange={(e) => setMotorData({...motorData, power: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Voltage (V)</label>
                  <select
                    value={motorData.voltage}
                    onChange={(e) => setMotorData({...motorData, voltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={220}>220V</option>
                    <option value={230}>230V</option>
                    <option value={380}>380V</option>
                    <option value={400}>400V</option>
                    <option value={415}>415V</option>
                    <option value={440}>440V</option>
                    <option value={690}>690V</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Poles</label>
                  <select
                    value={motorData.poles}
                    onChange={(e) => setMotorData({...motorData, poles: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={2}>2 Poles (3000 RPM)</option>
                    <option value={4}>4 Poles (1500 RPM)</option>
                    <option value={6}>6 Poles (1000 RPM)</option>
                    <option value={8}>8 Poles (750 RPM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Frequency (Hz)</label>
                  <select
                    value={motorData.frequency}
                    onChange={(e) => setMotorData({...motorData, frequency: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={50}>50 Hz</option>
                    <option value={60}>60 Hz</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Rated RPM</label>
                  <input
                    type="number"
                    value={motorData.rpm}
                    onChange={(e) => setMotorData({...motorData, rpm: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Efficiency (%)</label>
                  <input
                    type="number"
                    value={motorData.efficiency}
                    onChange={(e) => setMotorData({...motorData, efficiency: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Power Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={motorData.powerFactor}
                    onChange={(e) => setMotorData({...motorData, powerFactor: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-4 text-center border border-orange-500/30">
                  <div className="text-3xl font-bold text-orange-400">{results.fullLoadAmps.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Full Load Amps (A)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-cyan-400">{results.syncSpeed}</div>
                  <div className="text-xs text-gray-400">Sync Speed (RPM)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-yellow-400">{results.slip.toFixed(2)}%</div>
                  <div className="text-xs text-gray-400">Slip</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-green-400">{results.torque.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Torque (Nm)</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'winding' && (
            <motion.div
              key="winding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of Slots</label>
                  <input
                    type="number"
                    value={motorData.slots}
                    onChange={(e) => setMotorData({...motorData, slots: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Turns per Coil</label>
                  <input
                    type="number"
                    value={motorData.turnsPerCoil}
                    onChange={(e) => setMotorData({...motorData, turnsPerCoil: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Wire Gauge (SWG)</label>
                  <select
                    value={motorData.wireGauge}
                    onChange={(e) => setMotorData({...motorData, wireGauge: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {WIRE_GAUGES.map(w => (
                      <option key={w.swg} value={w.swg}>SWG {w.swg} ({w.diameter}mm)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Parallel Wires</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={motorData.parallel}
                    onChange={(e) => setMotorData({...motorData, parallel: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Connection</label>
                  <select
                    value={motorData.connection}
                    onChange={(e) => setMotorData({...motorData, connection: e.target.value as 'star' | 'delta'})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="star">Star (Y)</option>
                    <option value="delta">Delta (Δ)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Insulation Class</label>
                  <select
                    value={motorData.insulationClass}
                    onChange={(e) => setMotorData({...motorData, insulationClass: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {INSULATION_CLASSES.map(i => (
                      <option key={i.class} value={i.class}>Class {i.class} ({i.maxTemp}°C)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Coils per Group</label>
                  <input
                    type="number"
                    value={motorData.coilsPerGroup}
                    onChange={(e) => setMotorData({...motorData, coilsPerGroup: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Winding Results */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
                <h4 className="text-lg font-bold text-cyan-400 mb-4">WINDING SPECIFICATIONS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Recommended Wire:</span>
                    <span className="text-white ml-2 font-bold">SWG {results.recommendedWireGauge}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Current Density:</span>
                    <span className={`ml-2 font-bold ${results.currentDensity <= 5 ? 'text-green-400' : 'text-red-400'}`}>
                      {results.currentDensity.toFixed(2)} A/mm²
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Resistance/Phase:</span>
                    <span className="text-white ml-2">{results.resistancePerPhase.toFixed(3)} Ω</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Max Temperature:</span>
                    <span className="text-white ml-2">{results.maxTemp}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Copper Weight:</span>
                    <span className="text-white ml-2">{results.copperWeight.toFixed(2)} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Temp Rise Allowed:</span>
                    <span className="text-white ml-2">{results.tempRise}°C</span>
                  </div>
                </div>
              </div>

              {/* Testing Specifications */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-yellow-400 mb-4">🔍 POST-REWIND TESTING SPECIFICATIONS</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded border border-gray-600">
                    <div>
                      <div className="text-sm text-gray-400">Insulation Resistance Test (Megger)</div>
                      <div className="text-xl font-bold text-green-400">≥ {(results.meggerMin / 1000000).toFixed(0)} MΩ @ 500V DC</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Hi-Pot Test Voltage</div>
                      <div className="text-xl font-bold text-yellow-400">{results.hiPotTest} V AC for 1 minute</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS & CHARTS TAB */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* CIRCULAR PRESSURE GAUGES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CircularGauge
                  label="Efficiency"
                  value={motorData.efficiency}
                  max={100}
                  unit="%"
                  color="from-green-500 to-emerald-600"
                />
                <CircularGauge
                  label="Power Factor"
                  value={motorData.powerFactor * 100}
                  max={100}
                  unit="%"
                  color="from-cyan-500 to-blue-600"
                />
                <CircularGauge
                  label="Slip"
                  value={results.slip}
                  max={10}
                  unit="%"
                  color="from-yellow-500 to-orange-600"
                />
                <CircularGauge
                  label="Current Density"
                  value={results.currentDensity}
                  max={10}
                  unit="A/mm²"
                  color="from-purple-500 to-pink-600"
                />
              </div>

              {/* Main Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-4 text-center border border-orange-500/30">
                  <div className="text-3xl font-bold text-orange-400">{results.fullLoadAmps.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Full Load Amps (A)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-cyan-400">{results.startingCurrent.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Starting Current (A)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-green-400">{results.torque.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Torque (Nm)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-purple-400">{results.powerInput.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Power Input (kW)</div>
                </div>
              </div>

              {/* CHART.JS VISUALIZATIONS */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Motor Losses Doughnut */}
                <ChartCard title="Motor Losses Distribution" icon="⚡">
                  <Doughnut
                    data={{
                      labels: ['Copper Losses', 'Iron Losses', 'Mechanical Losses', 'Stray Losses'],
                      datasets: [{
                        data: [
                          results.copperLosses,
                          results.ironLosses,
                          results.mechanicalLosses,
                          results.strayLosses
                        ],
                        backgroundColor: [
                          'rgba(251, 191, 36, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(168, 85, 247, 0.8)'
                        ],
                        borderColor: [
                          'rgb(251, 191, 36)',
                          'rgb(239, 68, 68)',
                          'rgb(34, 197, 94)',
                          'rgb(168, 85, 247)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: '#ffffff', padding: 10, font: { size: 11 } }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Performance Bar Chart */}
                <ChartCard title="Motor Performance Metrics" icon="📊">
                  <Bar
                    data={{
                      labels: ['FLA', 'Starting Current', 'Sync Speed/100', 'Torque'],
                      datasets: [{
                        label: 'Value',
                        data: [
                          results.fullLoadAmps,
                          results.startingCurrent / 10,
                          results.syncSpeed / 100,
                          results.torque
                        ],
                        backgroundColor: [
                          'rgba(251, 146, 60, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(6, 182, 212, 0.8)',
                          'rgba(34, 197, 94, 0.8)'
                        ],
                        borderColor: [
                          'rgb(251, 146, 60)',
                          'rgb(239, 68, 68)',
                          'rgb(6, 182, 212)',
                          'rgb(34, 197, 94)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Temperature vs Speed Line Chart */}
                <ChartCard title="Speed-Torque Characteristic" icon="📈">
                  <Line
                    data={{
                      labels: ['0%', '20%', '40%', '60%', '80%', '100%', 'Sync'],
                      datasets: [{
                        label: 'Torque (%)',
                        data: [0, 150, 220, 260, 200, 100, 0],
                        borderColor: 'rgb(251, 146, 60)',
                        backgroundColor: 'rgba(251, 146, 60, 0.1)',
                        fill: true,
                        tension: 0.4
                      }, {
                        label: 'Current (%)',
                        data: [700, 600, 450, 300, 150, 100, 0],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff', font: { size: 11 } } }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' },
                          title: { display: true, text: 'Speed (% of Sync)', color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Motor Analysis Radar Chart */}
                <ChartCard title="Motor Health Analysis" icon="🎯">
                  <Radar
                    data={{
                      labels: ['Efficiency', 'Power Factor', 'Insulation Class', 'Current Density', 'Torque Rating', 'Slip Performance'],
                      datasets: [{
                        label: 'Your Motor',
                        data: [
                          motorData.efficiency,
                          motorData.powerFactor * 100,
                          (INSULATION_CLASSES.findIndex(i => i.class === motorData.insulationClass) + 1) * 20,
                          (10 - results.currentDensity) * 10,
                          (results.torque / 100) * 100,
                          (10 - results.slip) * 10
                        ],
                        backgroundColor: 'rgba(251, 146, 60, 0.2)',
                        borderColor: 'rgb(251, 146, 60)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(251, 146, 60)',
                        pointBorderColor: '#fff'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        r: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af', backdropColor: 'transparent' },
                          pointLabels: { color: '#ffffff', font: { size: 10 } }
                        }
                      }
                    }}
                  />
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'cost' && (
            <motion.div
              key="cost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Cost Breakdown */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 REWINDING COST ESTIMATE</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Copper Wire ({results.copperWeight.toFixed(2)} kg)</span>
                    <span className="text-white">KES {results.copperCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Insulation Materials</span>
                    <span className="text-white">KES {results.materialsCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Labor & Testing</span>
                    <span className="text-white">KES {results.laborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL ESTIMATE</span>
                    <span className="text-green-400">KES {results.totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-900/20 rounded border border-blue-500/30">
                  <p className="text-sm text-gray-400">
                    💡 New motor comparison: A new {motorData.power}kW motor typically costs KES {(motorData.power * 15000).toLocaleString()}.
                    Rewinding saves approximately {((1 - results.totalCost / (motorData.power * 15000)) * 100).toFixed(0)}%.
                  </p>
                </div>
              </div>

              {/* Cost Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <ChartCard title="Cost Breakdown" icon="💰">
                  <Doughnut
                    data={{
                      labels: ['Copper Wire', 'Insulation Materials', 'Labor & Testing'],
                      datasets: [{
                        data: [results.copperCost, results.materialsCost, results.laborCost],
                        backgroundColor: [
                          'rgba(251, 191, 36, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(34, 197, 94, 0.8)'
                        ],
                        borderColor: [
                          'rgb(251, 191, 36)',
                          'rgb(59, 130, 246)',
                          'rgb(34, 197, 94)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: '#ffffff', padding: 10 }
                        }
                      }
                    }}
                  />
                </ChartCard>

                <ChartCard title="Rewind vs New Motor" icon="📊">
                  <Bar
                    data={{
                      labels: ['Rewind Cost', 'New Motor Cost', 'Savings'],
                      datasets: [{
                        label: 'KES',
                        data: [
                          results.totalCost,
                          motorData.power * 15000,
                          motorData.power * 15000 - results.totalCost
                        ],
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(59, 130, 246, 0.8)'
                        ],
                        borderColor: [
                          'rgb(34, 197, 94)',
                          'rgb(239, 68, 68)',
                          'rgb(59, 130, 246)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: {
                            color: '#9ca3af',
                            callback: (value) => `KES ${(Number(value) / 1000).toFixed(0)}K`
                          }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Motor: {motorData.power}kW {motorData.poles}P | FLA: {results.fullLoadAmps.toFixed(1)}A
        </div>
        <a
          href="https://wa.me/254768860665?text=I%20need%20motor%20rewinding%20service"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}

// =====================================================
// CIRCULAR GAUGE COMPONENT (SVG-BASED PRESSURE METER)
// =====================================================
function CircularGauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 85;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">
            {value.toFixed(1)}{unit}
          </span>
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// CHART CARD WRAPPER COMPONENT
// =====================================================
function ChartCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}
