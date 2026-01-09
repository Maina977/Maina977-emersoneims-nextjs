'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED MOTOR REWINDING CALCULATOR
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
  const [activeTab, setActiveTab] = useState<'motor-specs' | 'winding' | 'testing' | 'cost'>('motor-specs');
  
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
          <span>🔄</span> Advanced Motor Rewinding Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete motor analysis, winding design & testing specifications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {[
          { id: 'motor-specs', label: '⚡ Motor Specs' },
          { id: 'winding', label: '🔄 Winding Design' },
          { id: 'testing', label: '🔍 Testing' },
          { id: 'cost', label: '💰 Cost' },
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
            </motion.div>
          )}

          {activeTab === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
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
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded border border-gray-600">
                    <div>
                      <div className="text-sm text-gray-400">Winding Resistance</div>
                      <div className="text-xl font-bold text-cyan-400">{results.resistancePerPhase.toFixed(3)} Ω ±5%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Phase Unbalance</div>
                      <div className="text-xl font-bold text-green-400">≤ 2%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-900/20 rounded border border-red-500/30">
                    <h5 className="text-red-400 font-bold mb-2">⚠️ CRITICAL TESTS</h5>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Surge comparison test - check for turn-to-turn shorts</li>
                      <li>• Polarization Index (PI) &gt; 2.0 for Class F insulation</li>
                      <li>• No-load current test - should be 25-40% of FLA</li>
                      <li>• Locked rotor current test - check starting current</li>
                      <li>• Vibration analysis after assembly</li>
                    </ul>
                  </div>
                </div>
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
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 REWINDING COST ESTIMATE</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Copper Wire ({results.copperWeight.toFixed(2)} kg)</span>
                    <span className="text-white">KES {results.copperCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Insulation Materials</span>
                    <span className="text-white">KES {(motorData.power * 500).toLocaleString()}</span>
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
