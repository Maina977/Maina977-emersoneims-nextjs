'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// CABLE MATERIALS DATA
// =====================================================
const CABLE_MATERIALS = {
  copper: { resistivity: 0.0175, name: 'Copper', pricePerKg: 1200, density: 8.96 },
  aluminum: { resistivity: 0.0282, name: 'Aluminum', pricePerKg: 350, density: 2.7 },
};

const CABLE_SIZES = [
  { size: 1.5, currentCapacity: { pvc: 15, xlpe: 20 }, pricePerM: 45 },
  { size: 2.5, currentCapacity: { pvc: 20, xlpe: 27 }, pricePerM: 65 },
  { size: 4, currentCapacity: { pvc: 27, xlpe: 36 }, pricePerM: 95 },
  { size: 6, currentCapacity: { pvc: 35, xlpe: 46 }, pricePerM: 140 },
  { size: 10, currentCapacity: { pvc: 48, xlpe: 63 }, pricePerM: 220 },
  { size: 16, currentCapacity: { pvc: 65, xlpe: 85 }, pricePerM: 350 },
  { size: 25, currentCapacity: { pvc: 85, xlpe: 110 }, pricePerM: 540 },
  { size: 35, currentCapacity: { pvc: 105, xlpe: 135 }, pricePerM: 750 },
  { size: 50, currentCapacity: { pvc: 125, xlpe: 160 }, pricePerM: 1050 },
  { size: 70, currentCapacity: { pvc: 155, xlpe: 200 }, pricePerM: 1500 },
  { size: 95, currentCapacity: { pvc: 185, xlpe: 240 }, pricePerM: 2000 },
  { size: 120, currentCapacity: { pvc: 215, xlpe: 280 }, pricePerM: 2500 },
  { size: 150, currentCapacity: { pvc: 250, xlpe: 320 }, pricePerM: 3100 },
  { size: 185, currentCapacity: { pvc: 285, xlpe: 365 }, pricePerM: 3800 },
  { size: 240, currentCapacity: { pvc: 335, xlpe: 430 }, pricePerM: 4900 },
  { size: 300, currentCapacity: { pvc: 385, xlpe: 495 }, pricePerM: 6100 },
];

const INSTALLATION_METHODS = [
  { id: 'A1', name: 'Conduit in thermally insulated wall', factor: 0.77 },
  { id: 'A2', name: 'Multi-core cable in conduit in thermally insulated wall', factor: 0.77 },
  { id: 'B1', name: 'Conduit on wall', factor: 1.00 },
  { id: 'B2', name: 'Multi-core cable in conduit on wall', factor: 1.00 },
  { id: 'C', name: 'Single-core cables on/in wall', factor: 1.00 },
  { id: 'D', name: 'Direct in ground', factor: 1.00 },
  { id: 'E', name: 'Free air', factor: 1.21 },
  { id: 'F', name: 'Cable tray (touching)', factor: 0.95 },
  { id: 'G', name: 'Cable ladder (spaced)', factor: 1.05 },
];

const TRANSFORMER_TYPES = [
  { type: 'Distribution', voltages: ['11kV/415V', '33kV/415V', '11kV/433V'], efficiency: 98.5 },
  { type: 'Power', voltages: ['33kV/11kV', '66kV/11kV', '132kV/33kV'], efficiency: 99.0 },
  { type: 'Isolation', voltages: ['415V/415V', '240V/240V'], efficiency: 97.5 },
  { type: 'Step-up', voltages: ['415V/11kV', '415V/33kV'], efficiency: 98.0 },
];

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function AdvancedHighVoltageCalculator() {
  const [activeTab, setActiveTab] = useState<'voltage-drop' | 'cable-sizing' | 'transformer' | 'earthing'>('voltage-drop');
  
  // Voltage Drop Calculator State
  const [voltageDrop, setVoltageDrop] = useState({
    voltage: 415,
    current: 100,
    length: 50,
    cableSize: 25,
    material: 'copper' as keyof typeof CABLE_MATERIALS,
    phase: 'three' as 'single' | 'three',
    powerFactor: 0.85,
    insulation: 'pvc' as 'pvc' | 'xlpe',
    installationMethod: 'B1',
    ambientTemp: 30,
    grouping: 1,
  });

  // Cable Sizing Calculator State
  const [cableSizing, setCableSizing] = useState({
    power: 50, // kW
    voltage: 415,
    powerFactor: 0.85,
    length: 100,
    maxVoltageDrop: 3, // %
    material: 'copper' as keyof typeof CABLE_MATERIALS,
    phase: 'three' as 'single' | 'three',
    insulation: 'pvc' as 'pvc' | 'xlpe',
    installationMethod: 'B1',
    ambientTemp: 30,
    grouping: 1,
    safetyFactor: 1.25,
  });

  // Transformer Calculator State
  const [transformer, setTransformer] = useState({
    loadKW: 200,
    powerFactor: 0.85,
    safetyMargin: 25,
    futureExpansion: 20,
    transformerType: 'Distribution',
    primaryVoltage: 11000,
    secondaryVoltage: 415,
    coolingType: 'ONAN' as 'ONAN' | 'ONAF' | 'OFAF',
    tapRange: 5,
  });

  // Earthing Calculator State
  const [earthing, setEarthing] = useState({
    faultCurrent: 10000, // A
    faultDuration: 0.5, // seconds
    soilResistivity: 100, // ohm-m
    rodDiameter: 16, // mm
    rodLength: 3, // m
    numberOfRods: 1,
    rodMaterial: 'copper' as 'copper' | 'galvanized',
    targetResistance: 1, // ohm
  });

  // Voltage Drop Calculation
  const voltageDropResult = useMemo(() => {
    const material = CABLE_MATERIALS[voltageDrop.material];
    const cable = CABLE_SIZES.find(c => c.size === voltageDrop.cableSize) || CABLE_SIZES[0];
    const installMethod = INSTALLATION_METHODS.find(m => m.id === voltageDrop.installationMethod);
    
    // Resistance per km (mΩ/m)
    const resistance = (material.resistivity * 1000) / voltageDrop.cableSize;
    
    // Reactance (typical value for medium voltage)
    const reactance = 0.08; // mΩ/m
    
    // Voltage drop calculation
    let vd: number;
    if (voltageDrop.phase === 'single') {
      vd = 2 * voltageDrop.length * voltageDrop.current * 
           (resistance * voltageDrop.powerFactor + reactance * Math.sqrt(1 - voltageDrop.powerFactor ** 2)) / 1000;
    } else {
      vd = Math.sqrt(3) * voltageDrop.length * voltageDrop.current * 
           (resistance * voltageDrop.powerFactor + reactance * Math.sqrt(1 - voltageDrop.powerFactor ** 2)) / 1000;
    }
    
    const vdPercent = (vd / voltageDrop.voltage) * 100;
    const endVoltage = voltageDrop.voltage - vd;
    
    // Power loss
    const powerLoss = voltageDrop.phase === 'single' 
      ? 2 * voltageDrop.current ** 2 * resistance * voltageDrop.length / 1000000
      : 3 * voltageDrop.current ** 2 * resistance * voltageDrop.length / 1000000;
    
    // Cable current capacity
    const baseCapacity = cable.currentCapacity[voltageDrop.insulation];
    const deratedCapacity = baseCapacity * (installMethod?.factor || 1) * 
                           (voltageDrop.ambientTemp <= 30 ? 1 : 0.94) / Math.sqrt(voltageDrop.grouping);
    
    // Compliance check
    const compliant = vdPercent <= 3 && voltageDrop.current <= deratedCapacity;
    
    return {
      voltageDrop: vd,
      voltageDropPercent: vdPercent,
      endVoltage,
      powerLoss,
      cableCapacity: deratedCapacity,
      resistance: resistance * voltageDrop.length / 1000,
      compliant,
      recommendation: vdPercent > 3 ? 'Increase cable size or reduce length' : 
                     voltageDrop.current > deratedCapacity ? 'Cable undersized for current' : 'System compliant',
    };
  }, [voltageDrop]);

  // Cable Sizing Calculation
  const cableSizingResult = useMemo(() => {
    const material = CABLE_MATERIALS[cableSizing.material];
    const installMethod = INSTALLATION_METHODS.find(m => m.id === cableSizing.installationMethod);
    
    // Calculate current
    const current = cableSizing.phase === 'single'
      ? (cableSizing.power * 1000) / (cableSizing.voltage * cableSizing.powerFactor)
      : (cableSizing.power * 1000) / (Math.sqrt(3) * cableSizing.voltage * cableSizing.powerFactor);
    
    const designCurrent = current * cableSizing.safetyFactor;
    
    // Find suitable cable based on current capacity
    const tempFactor = cableSizing.ambientTemp <= 30 ? 1 : 0.94;
    const groupFactor = 1 / Math.sqrt(cableSizing.grouping);
    
    let selectedCable = CABLE_SIZES[0];
    for (const cable of CABLE_SIZES) {
      const deratedCapacity = cable.currentCapacity[cableSizing.insulation] * 
                             (installMethod?.factor || 1) * tempFactor * groupFactor;
      if (deratedCapacity >= designCurrent) {
        selectedCable = cable;
        break;
      }
      selectedCable = cable;
    }
    
    // Check voltage drop with selected cable
    const resistance = (material.resistivity * 1000) / selectedCable.size;
    const reactance = 0.08;
    
    let vd: number;
    if (cableSizing.phase === 'single') {
      vd = 2 * cableSizing.length * current * 
           (resistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
    } else {
      vd = Math.sqrt(3) * cableSizing.length * current * 
           (resistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
    }
    
    const vdPercent = (vd / cableSizing.voltage) * 100;
    
    // If voltage drop exceeds limit, upsize cable
    let finalCable = selectedCable;
    if (vdPercent > cableSizing.maxVoltageDrop) {
      for (let i = CABLE_SIZES.indexOf(selectedCable) + 1; i < CABLE_SIZES.length; i++) {
        const testCable = CABLE_SIZES[i];
        const testResistance = (material.resistivity * 1000) / testCable.size;
        let testVd: number;
        if (cableSizing.phase === 'single') {
          testVd = 2 * cableSizing.length * current * 
                   (testResistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
        } else {
          testVd = Math.sqrt(3) * cableSizing.length * current * 
                   (testResistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
        }
        if ((testVd / cableSizing.voltage) * 100 <= cableSizing.maxVoltageDrop) {
          finalCable = testCable;
          break;
        }
        finalCable = testCable;
      }
    }
    
    // Recalculate voltage drop with final cable
    const finalResistance = (material.resistivity * 1000) / finalCable.size;
    let finalVd: number;
    if (cableSizing.phase === 'single') {
      finalVd = 2 * cableSizing.length * current * 
               (finalResistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
    } else {
      finalVd = Math.sqrt(3) * cableSizing.length * current * 
               (finalResistance * cableSizing.powerFactor + reactance * Math.sqrt(1 - cableSizing.powerFactor ** 2)) / 1000;
    }
    
    const finalVdPercent = (finalVd / cableSizing.voltage) * 100;
    const cableCost = finalCable.pricePerM * cableSizing.length * (cableSizing.phase === 'three' ? 4 : 2);
    
    return {
      loadCurrent: current,
      designCurrent,
      recommendedSize: finalCable.size,
      cableCapacity: finalCable.currentCapacity[cableSizing.insulation] * (installMethod?.factor || 1) * tempFactor * groupFactor,
      voltageDrop: finalVd,
      voltageDropPercent: finalVdPercent,
      cableCost,
      cableWeight: (finalCable.size * material.density * cableSizing.length * (cableSizing.phase === 'three' ? 4 : 2)) / 1000,
    };
  }, [cableSizing]);

  // Transformer Sizing Calculation
  const transformerResult = useMemo(() => {
    // Calculate apparent power
    const apparentPower = transformer.loadKW / transformer.powerFactor;
    
    // Apply safety margin and future expansion
    const designKVA = apparentPower * (1 + transformer.safetyMargin / 100) * (1 + transformer.futureExpansion / 100);
    
    // Standard transformer sizes (kVA)
    const standardSizes = [25, 50, 63, 100, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];
    const selectedSize = standardSizes.find(s => s >= designKVA) || standardSizes[standardSizes.length - 1];
    
    // Transformer specifications
    const type = TRANSFORMER_TYPES.find(t => t.type === transformer.transformerType)!;
    
    // Calculate currents
    const primaryCurrent = (selectedSize * 1000) / (Math.sqrt(3) * transformer.primaryVoltage);
    const secondaryCurrent = (selectedSize * 1000) / (Math.sqrt(3) * transformer.secondaryVoltage);
    
    // Losses estimation (typical values)
    const noLoadLoss = selectedSize * 0.002; // 0.2% no-load loss
    const fullLoadLoss = selectedSize * 0.01; // 1% full-load copper loss
    const loadFactor = transformer.loadKW / selectedSize;
    const totalLosses = noLoadLoss + (fullLoadLoss * loadFactor ** 2);
    
    // Impedance (typical)
    const impedance = selectedSize <= 630 ? 4 : selectedSize <= 1600 ? 5 : 6;
    
    // Fault current
    const faultMVA = selectedSize / impedance * 100;
    const faultCurrent = (faultMVA * 1000) / (Math.sqrt(3) * transformer.secondaryVoltage);
    
    // Oil quantity estimation (for oil-immersed transformers)
    const oilQuantity = selectedSize * 0.5; // Approximate 0.5 liters per kVA
    
    // Cost estimation
    const baseCost = selectedSize * 2500; // Approximate KES 2500 per kVA
    const coolingMultiplier = transformer.coolingType === 'ONAN' ? 1 : transformer.coolingType === 'ONAF' ? 1.15 : 1.3;
    const estimatedCost = baseCost * coolingMultiplier;
    
    return {
      requiredKVA: designKVA,
      selectedKVA: selectedSize,
      loadingPercent: (apparentPower / selectedSize) * 100,
      primaryCurrent,
      secondaryCurrent,
      efficiency: type.efficiency,
      impedance,
      losses: totalLosses,
      faultCurrent,
      oilQuantity,
      estimatedCost,
      tapRange: transformer.tapRange,
    };
  }, [transformer]);

  // Earthing Calculation
  const earthingResult = useMemo(() => {
    // Single rod resistance
    const rodRadius = earthing.rodDiameter / 2000; // Convert mm to m
    const singleRodResistance = (earthing.soilResistivity / (2 * Math.PI * earthing.rodLength)) * 
                                Math.log(4 * earthing.rodLength / rodRadius);
    
    // Parallel rods (with spacing factor)
    const spacing = earthing.rodLength * 2; // Typical spacing = 2 × rod length
    let parallelResistance = singleRodResistance / earthing.numberOfRods;
    
    // Correction factor for rod interaction
    if (earthing.numberOfRods > 1) {
      const interactionFactor = 1 + (earthing.numberOfRods - 1) * 0.1; // Simplified factor
      parallelResistance *= interactionFactor;
    }
    
    // Calculate required number of rods for target resistance
    let requiredRods = 1;
    let testResistance = singleRodResistance;
    while (testResistance > earthing.targetResistance && requiredRods < 20) {
      requiredRods++;
      testResistance = (singleRodResistance / requiredRods) * (1 + (requiredRods - 1) * 0.1);
    }
    
    // Ground potential rise
    const gpr = earthing.faultCurrent * parallelResistance;
    
    // Step voltage (simplified)
    const stepVoltage = gpr * 0.1; // Approximately 10% of GPR
    
    // Touch voltage
    const touchVoltage = gpr * 0.7; // Approximately 70% of GPR
    
    // Conductor cross-section (for fault current)
    const kFactor = earthing.rodMaterial === 'copper' ? 226 : 78; // k factor for different materials
    const conductorSize = earthing.faultCurrent * Math.sqrt(earthing.faultDuration) / kFactor;
    
    // Cost estimation
    const rodCost = earthing.numberOfRods * (earthing.rodMaterial === 'copper' ? 15000 : 5000);
    const conductorCost = Math.ceil(conductorSize) * 10 * 150; // 10m per rod, KES 150/mm²
    const installationCost = earthing.numberOfRods * 3000;
    const totalCost = rodCost + conductorCost + installationCost;
    
    return {
      singleRodResistance,
      parallelResistance,
      requiredRods,
      achievedResistance: testResistance,
      groundPotentialRise: gpr,
      stepVoltage,
      touchVoltage,
      conductorSize: Math.ceil(conductorSize),
      spacing,
      totalCost,
      compliant: parallelResistance <= earthing.targetResistance,
    };
  }, [earthing]);

  return (
    <div className="bg-gray-900 rounded-xl border border-red-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4 border-b border-red-500/30">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
          <span>🔌</span> High Voltage & Infrastructure Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Voltage drop, cable sizing, transformer selection & earthing calculations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {[
          { id: 'voltage-drop', label: '⚡ Voltage Drop' },
          { id: 'cable-sizing', label: '🔌 Cable Sizing' },
          { id: 'transformer', label: '🔄 Transformer' },
          { id: 'earthing', label: '⏚ Earthing' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-400 border-b-2 border-red-500'
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
          {/* VOLTAGE DROP TAB */}
          {activeTab === 'voltage-drop' && (
            <motion.div
              key="voltage-drop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Input Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">System Voltage (V)</label>
                  <select
                    value={voltageDrop.voltage}
                    onChange={(e) => setVoltageDrop({...voltageDrop, voltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={230}>230V (1-Phase)</option>
                    <option value={240}>240V (1-Phase)</option>
                    <option value={380}>380V (3-Phase)</option>
                    <option value={400}>400V (3-Phase)</option>
                    <option value={415}>415V (3-Phase)</option>
                    <option value={11000}>11kV (MV)</option>
                    <option value={33000}>33kV (HV)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Load Current (A)</label>
                  <input
                    type="number"
                    value={voltageDrop.current}
                    onChange={(e) => setVoltageDrop({...voltageDrop, current: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cable Length (m)</label>
                  <input
                    type="number"
                    value={voltageDrop.length}
                    onChange={(e) => setVoltageDrop({...voltageDrop, length: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cable Size (mm²)</label>
                  <select
                    value={voltageDrop.cableSize}
                    onChange={(e) => setVoltageDrop({...voltageDrop, cableSize: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {CABLE_SIZES.map(c => (
                      <option key={c.size} value={c.size}>{c.size} mm²</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Material</label>
                  <select
                    value={voltageDrop.material}
                    onChange={(e) => setVoltageDrop({...voltageDrop, material: e.target.value as keyof typeof CABLE_MATERIALS})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="copper">Copper</option>
                    <option value="aluminum">Aluminum</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phase</label>
                  <select
                    value={voltageDrop.phase}
                    onChange={(e) => setVoltageDrop({...voltageDrop, phase: e.target.value as 'single' | 'three'})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="single">Single Phase</option>
                    <option value="three">Three Phase</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Power Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="1"
                    value={voltageDrop.powerFactor}
                    onChange={(e) => setVoltageDrop({...voltageDrop, powerFactor: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Insulation</label>
                  <select
                    value={voltageDrop.insulation}
                    onChange={(e) => setVoltageDrop({...voltageDrop, insulation: e.target.value as 'pvc' | 'xlpe'})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="pvc">PVC (70°C)</option>
                    <option value="xlpe">XLPE (90°C)</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`rounded-lg p-4 text-center border ${voltageDropResult.voltageDropPercent <= 3 ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                  <div className={`text-3xl font-bold ${voltageDropResult.voltageDropPercent <= 3 ? 'text-green-400' : 'text-red-400'}`}>
                    {voltageDropResult.voltageDropPercent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">Voltage Drop</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-cyan-400">{voltageDropResult.voltageDrop.toFixed(2)}V</div>
                  <div className="text-xs text-gray-400">Absolute Drop</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-yellow-400">{voltageDropResult.endVoltage.toFixed(1)}V</div>
                  <div className="text-xs text-gray-400">End Voltage</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-orange-400">{voltageDropResult.powerLoss.toFixed(2)}kW</div>
                  <div className="text-xs text-gray-400">Power Loss</div>
                </div>
              </div>

              {/* Compliance */}
              <div className={`p-4 rounded-lg border ${voltageDropResult.compliant ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className={`font-bold ${voltageDropResult.compliant ? 'text-green-400' : 'text-red-400'}`}>
                  {voltageDropResult.compliant ? '✅ COMPLIANT' : '⚠️ NON-COMPLIANT'}
                </div>
                <div className="text-gray-400 text-sm mt-1">{voltageDropResult.recommendation}</div>
                <div className="text-gray-500 text-xs mt-2">
                  Standard: IEC 60364 recommends max 3% voltage drop for mains, 5% for final circuits
                </div>
              </div>
            </motion.div>
          )}

          {/* CABLE SIZING TAB */}
          {activeTab === 'cable-sizing' && (
            <motion.div
              key="cable-sizing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Load Power (kW)</label>
                  <input
                    type="number"
                    value={cableSizing.power}
                    onChange={(e) => setCableSizing({...cableSizing, power: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">System Voltage (V)</label>
                  <select
                    value={cableSizing.voltage}
                    onChange={(e) => setCableSizing({...cableSizing, voltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={230}>230V</option>
                    <option value={240}>240V</option>
                    <option value={380}>380V</option>
                    <option value={400}>400V</option>
                    <option value={415}>415V</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cable Length (m)</label>
                  <input
                    type="number"
                    value={cableSizing.length}
                    onChange={(e) => setCableSizing({...cableSizing, length: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Max Voltage Drop (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="5"
                    value={cableSizing.maxVoltageDrop}
                    onChange={(e) => setCableSizing({...cableSizing, maxVoltageDrop: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
                <h4 className="text-lg font-bold text-cyan-400 mb-4">RECOMMENDED CABLE</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {cableSizingResult.recommendedSize} mm² {cableSizing.material.toUpperCase()} {cableSizing.insulation.toUpperCase()}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400">Load Current:</span>
                    <span className="text-white ml-2">{cableSizingResult.loadCurrent.toFixed(1)} A</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cable Capacity:</span>
                    <span className="text-white ml-2">{cableSizingResult.cableCapacity.toFixed(1)} A</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Voltage Drop:</span>
                    <span className="text-white ml-2">{cableSizingResult.voltageDropPercent.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cable Cost:</span>
                    <span className="text-white ml-2">KES {cableSizingResult.cableCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TRANSFORMER TAB */}
          {activeTab === 'transformer' && (
            <motion.div
              key="transformer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Load (kW)</label>
                  <input
                    type="number"
                    value={transformer.loadKW}
                    onChange={(e) => setTransformer({...transformer, loadKW: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Power Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transformer.powerFactor}
                    onChange={(e) => setTransformer({...transformer, powerFactor: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Primary Voltage</label>
                  <select
                    value={transformer.primaryVoltage}
                    onChange={(e) => setTransformer({...transformer, primaryVoltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={11000}>11 kV</option>
                    <option value={33000}>33 kV</option>
                    <option value={66000}>66 kV</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Secondary Voltage</label>
                  <select
                    value={transformer.secondaryVoltage}
                    onChange={(e) => setTransformer({...transformer, secondaryVoltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={415}>415V</option>
                    <option value={433}>433V</option>
                    <option value={11000}>11 kV</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-6 border border-orange-500/30">
                <h4 className="text-lg font-bold text-orange-400 mb-4">RECOMMENDED TRANSFORMER</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {transformerResult.selectedKVA} kVA
                </div>
                <div className="text-gray-400">
                  {transformer.primaryVoltage / 1000}kV / {transformer.secondaryVoltage}V | {transformer.coolingType} Cooling
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400">Loading:</span>
                    <span className="text-white ml-2">{transformerResult.loadingPercent.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Primary I:</span>
                    <span className="text-white ml-2">{transformerResult.primaryCurrent.toFixed(1)} A</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Secondary I:</span>
                    <span className="text-white ml-2">{transformerResult.secondaryCurrent.toFixed(1)} A</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fault I:</span>
                    <span className="text-white ml-2">{transformerResult.faultCurrent.toFixed(0)} A</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-400">Estimated Cost:</span>
                  <span className="text-green-400 font-bold ml-2">KES {transformerResult.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* EARTHING TAB */}
          {activeTab === 'earthing' && (
            <motion.div
              key="earthing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Fault Current (A)</label>
                  <input
                    type="number"
                    value={earthing.faultCurrent}
                    onChange={(e) => setEarthing({...earthing, faultCurrent: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Soil Resistivity (Ω·m)</label>
                  <input
                    type="number"
                    value={earthing.soilResistivity}
                    onChange={(e) => setEarthing({...earthing, soilResistivity: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Rod Length (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={earthing.rodLength}
                    onChange={(e) => setEarthing({...earthing, rodLength: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Target Resistance (Ω)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={earthing.targetResistance}
                    onChange={(e) => setEarthing({...earthing, targetResistance: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className={`rounded-lg p-6 border ${earthingResult.compliant ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <h4 className={`text-lg font-bold ${earthingResult.compliant ? 'text-green-400' : 'text-red-400'} mb-4`}>
                  EARTHING SYSTEM DESIGN
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-400">{earthingResult.requiredRods}</div>
                    <div className="text-xs text-gray-400">Rods Required</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">{earthingResult.achievedResistance.toFixed(2)} Ω</div>
                    <div className="text-xs text-gray-400">Earth Resistance</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-400">{earthingResult.conductorSize} mm²</div>
                    <div className="text-xs text-gray-400">Earth Conductor</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Ground Potential Rise:</span>
                    <span className="text-white ml-2">{earthingResult.groundPotentialRise.toFixed(0)} V</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Step Voltage:</span>
                    <span className="text-white ml-2">{earthingResult.stepVoltage.toFixed(0)} V</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Touch Voltage:</span>
                    <span className="text-white ml-2">{earthingResult.touchVoltage.toFixed(0)} V</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rod Spacing:</span>
                    <span className="text-white ml-2">{earthingResult.spacing.toFixed(1)} m</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-400">Total Installation Cost:</span>
                  <span className="text-green-400 font-bold ml-2">KES {earthingResult.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Standards: IEC 60364, IEEE 80, BS 7671
        </div>
        <a 
          href="https://wa.me/254768860665?text=I%20need%20help%20with%20electrical%20infrastructure%20design"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Expert Help
        </a>
      </div>
    </div>
  );
}
