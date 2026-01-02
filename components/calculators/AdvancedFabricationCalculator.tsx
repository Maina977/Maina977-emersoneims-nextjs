'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED FABRICATION CALCULATOR
// Steel Tanks, Canopies, Enclosures
// =====================================================

const STEEL_GRADES = [
  { grade: 'Mild Steel', density: 7850, pricePerKg: 180, corrosionFactor: 1.0 },
  { grade: 'Galvanized Steel', density: 7850, pricePerKg: 250, corrosionFactor: 0.2 },
  { grade: 'Stainless Steel 304', density: 8000, pricePerKg: 450, corrosionFactor: 0.05 },
  { grade: 'Stainless Steel 316', density: 8000, pricePerKg: 550, corrosionFactor: 0.02 },
  { grade: 'Aluminum', density: 2700, pricePerKg: 400, corrosionFactor: 0.1 },
];

const TANK_TYPES = [
  { type: 'Cylindrical Vertical', efficiencyFactor: 0.95 },
  { type: 'Cylindrical Horizontal', efficiencyFactor: 0.90 },
  { type: 'Rectangular', efficiencyFactor: 0.85 },
  { type: 'Conical Bottom', efficiencyFactor: 0.88 },
  { type: 'Underground', efficiencyFactor: 0.92 },
];

const CANOPY_STYLES = [
  { style: 'Flat Roof', materialFactor: 1.0, priceMultiplier: 1.0 },
  { style: 'Gable Roof', materialFactor: 1.15, priceMultiplier: 1.2 },
  { style: 'Hip Roof', materialFactor: 1.25, priceMultiplier: 1.35 },
  { style: 'Curved/Barrel', materialFactor: 1.3, priceMultiplier: 1.5 },
  { style: 'Mono-pitch', materialFactor: 1.05, priceMultiplier: 1.1 },
];

const SHEET_THICKNESSES = [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0];
const PAINT_TYPES = [
  { type: 'None', pricePerM2: 0, lifeYears: 0 },
  { type: 'Red Oxide Primer', pricePerM2: 200, lifeYears: 2 },
  { type: 'Epoxy Paint', pricePerM2: 500, lifeYears: 5 },
  { type: 'Polyurethane', pricePerM2: 700, lifeYears: 8 },
  { type: 'Marine Grade', pricePerM2: 1000, lifeYears: 12 },
];

export default function AdvancedFabricationCalculator() {
  const [activeTab, setActiveTab] = useState<'tank' | 'canopy' | 'enclosure' | 'quote'>('tank');
  const [calculatorType, setCalculatorType] = useState<'tank' | 'canopy' | 'enclosure'>('tank');

  // Tank state
  const [tank, setTank] = useState({
    type: 'Cylindrical Vertical',
    diameter: 3,
    height: 4,
    width: 0, // For rectangular
    length: 0, // For rectangular
    thickness: 3.0,
    material: 'Mild Steel',
    paint: 'Epoxy Paint',
    hasRoof: true,
    hasManhole: true,
    hasLadder: false,
    hasLevel: false,
    capacity: 0,
  });

  // Canopy state
  const [canopy, setCanopy] = useState({
    style: 'Flat Roof',
    length: 6,
    width: 4,
    height: 3, // Column height
    material: 'Galvanized Steel',
    roofSheet: 0.5, // mm
    columnSize: 100, // mm square
    hasSides: false,
    sideCount: 0,
    hasGutters: true,
    paint: 'Red Oxide Primer',
  });

  // Enclosure state (generator, transformer)
  const [enclosure, setEnclosure] = useState({
    length: 3,
    width: 2,
    height: 2.5,
    material: 'Galvanized Steel',
    thickness: 1.5,
    ventilation: 30, // % open area
    hasLouvers: true,
    hasDoor: true,
    doorWidth: 1.2,
    doorHeight: 2.0,
    soundProof: false,
    weatherProof: true,
    paint: 'Epoxy Paint',
  });

  const tankResults = useMemo(() => {
    const materialData = STEEL_GRADES.find(s => s.grade === tank.material) || STEEL_GRADES[0];
    const typeData = TANK_TYPES.find(t => t.type === tank.type) || TANK_TYPES[0];
    const paintData = PAINT_TYPES.find(p => p.type === tank.paint) || PAINT_TYPES[0];
    
    let volume = 0;
    let surfaceArea = 0;
    let sheetWeight = 0;
    
    if (tank.type.includes('Cylindrical')) {
      const radius = tank.diameter / 2;
      volume = Math.PI * Math.pow(radius, 2) * tank.height;
      // Surface area: sides + bottom + top (if roof)
      surfaceArea = 2 * Math.PI * radius * tank.height + Math.PI * Math.pow(radius, 2); // Sides + bottom
      if (tank.hasRoof) surfaceArea += Math.PI * Math.pow(radius, 2); // Top
    } else if (tank.type === 'Rectangular') {
      volume = tank.length * tank.width * tank.height;
      surfaceArea = 2 * (tank.length * tank.width + tank.length * tank.height + tank.width * tank.height);
      if (!tank.hasRoof) surfaceArea -= tank.length * tank.width;
    } else if (tank.type === 'Conical Bottom') {
      const radius = tank.diameter / 2;
      const cylinderHeight = tank.height * 0.7;
      const coneHeight = tank.height * 0.3;
      volume = Math.PI * Math.pow(radius, 2) * cylinderHeight + (1/3) * Math.PI * Math.pow(radius, 2) * coneHeight;
      surfaceArea = 2 * Math.PI * radius * cylinderHeight + Math.PI * radius * Math.sqrt(Math.pow(radius, 2) + Math.pow(coneHeight, 2));
      if (tank.hasRoof) surfaceArea += Math.PI * Math.pow(radius, 2);
    }
    
    const capacityLiters = volume * 1000 * typeData.efficiencyFactor;
    
    // Weight calculation
    const thicknessM = tank.thickness / 1000;
    sheetWeight = surfaceArea * thicknessM * materialData.density;
    
    // Add 15% for stiffeners, reinforcement
    const totalWeight = sheetWeight * 1.15;
    
    // Accessories weight
    let accessoriesWeight = 0;
    if (tank.hasManhole) accessoriesWeight += 50;
    if (tank.hasLadder) accessoriesWeight += 30;
    if (tank.hasLevel) accessoriesWeight += 10;
    
    // Cost calculation
    const materialCost = (totalWeight + accessoriesWeight) * materialData.pricePerKg;
    const paintCost = surfaceArea * paintData.pricePerM2;
    const laborCost = materialCost * 0.4; // 40% of material cost
    
    return {
      volume,
      capacityLiters,
      surfaceArea,
      sheetWeight,
      totalWeight: totalWeight + accessoriesWeight,
      materialCost,
      paintCost,
      laborCost,
      totalCost: materialCost + paintCost + laborCost,
      materialData,
    };
  }, [tank]);

  const canopyResults = useMemo(() => {
    const materialData = STEEL_GRADES.find(s => s.grade === canopy.material) || STEEL_GRADES[0];
    const styleData = CANOPY_STYLES.find(s => s.style === canopy.style) || CANOPY_STYLES[0];
    const paintData = PAINT_TYPES.find(p => p.type === canopy.paint) || PAINT_TYPES[0];
    
    const roofArea = canopy.length * canopy.width * styleData.materialFactor;
    const columnCount = Math.ceil(canopy.length / 3) * 2; // Columns every 3m
    
    // Roof weight
    const roofWeight = roofArea * (canopy.roofSheet / 1000) * materialData.density;
    
    // Column weight (square hollow section)
    const columnPerimeter = canopy.columnSize * 4 / 1000;
    const columnThickness = canopy.columnSize > 80 ? 3 : 2; // mm
    const columnWeight = columnCount * canopy.height * columnPerimeter * (columnThickness / 1000) * materialData.density;
    
    // Beam weight (estimate 20% of roof weight)
    const beamWeight = roofWeight * 0.2;
    
    // Side panels
    let sideWeight = 0;
    if (canopy.hasSides) {
      const sideArea = canopy.sideCount * ((canopy.length + canopy.width) / 2) * canopy.height;
      sideWeight = sideArea * (1.0 / 1000) * materialData.density; // 1mm sheet
    }
    
    const totalWeight = roofWeight + columnWeight + beamWeight + sideWeight;
    
    // Gutters (if selected)
    let gutterCost = 0;
    if (canopy.hasGutters) {
      gutterCost = (canopy.length * 2 + canopy.width * 2) * 500; // KES per meter
    }
    
    const materialCost = totalWeight * materialData.pricePerKg;
    const paintCost = (roofArea + (canopy.hasSides ? canopy.sideCount * canopy.length * canopy.height : 0)) * paintData.pricePerM2;
    const laborCost = materialCost * 0.5 * styleData.priceMultiplier;
    
    return {
      roofArea,
      columnCount,
      roofWeight,
      columnWeight,
      totalWeight,
      materialCost,
      paintCost,
      gutterCost,
      laborCost,
      totalCost: materialCost + paintCost + gutterCost + laborCost,
      styleData,
    };
  }, [canopy]);

  const enclosureResults = useMemo(() => {
    const materialData = STEEL_GRADES.find(s => s.grade === enclosure.material) || STEEL_GRADES[0];
    const paintData = PAINT_TYPES.find(p => p.type === enclosure.paint) || PAINT_TYPES[0];
    
    // Surface area
    const wallArea = 2 * (enclosure.length * enclosure.height + enclosure.width * enclosure.height);
    const roofArea = enclosure.length * enclosure.width;
    const floorArea = enclosure.length * enclosure.width;
    const totalArea = wallArea + roofArea + floorArea;
    
    // Door cutout
    const doorArea = enclosure.hasDoor ? enclosure.doorWidth * enclosure.doorHeight : 0;
    
    // Louvers area
    const louverArea = enclosure.hasLouvers ? (wallArea * enclosure.ventilation / 100) : 0;
    
    const sheetArea = totalArea - doorArea;
    const sheetWeight = sheetArea * (enclosure.thickness / 1000) * materialData.density;
    
    // Frame weight (estimate 30% of sheet weight)
    const frameWeight = sheetWeight * 0.3;
    
    // Sound proofing adds weight
    const soundProofWeight = enclosure.soundProof ? sheetArea * 10 : 0; // 10kg/m² for acoustic panels
    
    const totalWeight = sheetWeight + frameWeight + soundProofWeight;
    
    // Door cost
    const doorCost = enclosure.hasDoor ? 15000 : 0;
    const louverCost = enclosure.hasLouvers ? louverArea * 2000 : 0;
    const soundProofCost = enclosure.soundProof ? sheetArea * 3000 : 0;
    
    const materialCost = totalWeight * materialData.pricePerKg;
    const paintCost = sheetArea * paintData.pricePerM2;
    const laborCost = materialCost * 0.45;
    
    return {
      totalArea,
      sheetArea,
      sheetWeight,
      totalWeight,
      doorArea,
      louverArea,
      materialCost,
      paintCost,
      doorCost,
      louverCost,
      soundProofCost,
      laborCost,
      totalCost: materialCost + paintCost + laborCost + doorCost + louverCost + soundProofCost,
    };
  }, [enclosure]);

  return (
    <div className="bg-gray-900 rounded-xl border border-orange-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 p-4 border-b border-orange-500/30">
        <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
          <span>🏭</span> Advanced Fabrication Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Steel tanks, canopies, enclosures - Complete design & costing
        </p>
      </div>

      {/* Calculator Type Selection */}
      <div className="flex border-b border-gray-700 bg-gray-800/50">
        {[
          { id: 'tank', label: '🛢️ Steel Tank' },
          { id: 'canopy', label: '🏗️ Canopy' },
          { id: 'enclosure', label: '📦 Enclosure' },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setCalculatorType(type.id as typeof calculatorType)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              calculatorType === type.id
                ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {calculatorType === 'tank' && (
            <motion.div
              key="tank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tank Type</label>
                  <select
                    value={tank.type}
                    onChange={(e) => setTank({...tank, type: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {TANK_TYPES.map(t => (
                      <option key={t.type} value={t.type}>{t.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Material</label>
                  <select
                    value={tank.material}
                    onChange={(e) => setTank({...tank, material: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {STEEL_GRADES.map(s => (
                      <option key={s.grade} value={s.grade}>{s.grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Thickness (mm)</label>
                  <select
                    value={tank.thickness}
                    onChange={(e) => setTank({...tank, thickness: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {SHEET_THICKNESSES.map(t => (
                      <option key={t} value={t}>{t} mm</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Paint/Coating</label>
                  <select
                    value={tank.paint}
                    onChange={(e) => setTank({...tank, paint: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {PAINT_TYPES.map(p => (
                      <option key={p.type} value={p.type}>{p.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tank.type.includes('Cylindrical') || tank.type === 'Conical Bottom' ? (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Diameter (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tank.diameter}
                        onChange={(e) => setTank({...tank, diameter: parseFloat(e.target.value) || 0})}
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Height (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tank.height}
                        onChange={(e) => setTank({...tank, height: parseFloat(e.target.value) || 0})}
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Length (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tank.length}
                        onChange={(e) => setTank({...tank, length: parseFloat(e.target.value) || 0})}
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Width (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tank.width}
                        onChange={(e) => setTank({...tank, width: parseFloat(e.target.value) || 0})}
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Height (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tank.height}
                        onChange={(e) => setTank({...tank, height: parseFloat(e.target.value) || 0})}
                        className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={tank.hasRoof} onChange={(e) => setTank({...tank, hasRoof: e.target.checked})} className="rounded" />
                  Roof/Cover
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={tank.hasManhole} onChange={(e) => setTank({...tank, hasManhole: e.target.checked})} className="rounded" />
                  Manhole
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={tank.hasLadder} onChange={(e) => setTank({...tank, hasLadder: e.target.checked})} className="rounded" />
                  External Ladder
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={tank.hasLevel} onChange={(e) => setTank({...tank, hasLevel: e.target.checked})} className="rounded" />
                  Level Indicator
                </label>
              </div>

              {/* Tank Results */}
              <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-lg p-6 border border-orange-500/30">
                <h4 className="text-lg font-bold text-orange-400 mb-4">🛢️ TANK SPECIFICATIONS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{(tankResults.capacityLiters / 1000).toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Capacity (m³)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">{tankResults.capacityLiters.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Liters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{tankResults.surfaceArea.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Surface (m²)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{tankResults.totalWeight.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Weight (kg)</div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-400">Material ({tank.material}):</span>
                    <span className="text-white">KES {tankResults.materialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-400">Paint/Coating ({tank.paint}):</span>
                    <span className="text-white">KES {tankResults.paintCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-400">Fabrication & Labor:</span>
                    <span className="text-white">KES {tankResults.laborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-700">
                    <span className="text-green-400">TOTAL COST:</span>
                    <span className="text-green-400">KES {tankResults.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {calculatorType === 'canopy' && (
            <motion.div
              key="canopy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Roof Style</label>
                  <select
                    value={canopy.style}
                    onChange={(e) => setCanopy({...canopy, style: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {CANOPY_STYLES.map(s => (
                      <option key={s.style} value={s.style}>{s.style}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Length (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={canopy.length}
                    onChange={(e) => setCanopy({...canopy, length: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Width (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={canopy.width}
                    onChange={(e) => setCanopy({...canopy, width: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Column Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={canopy.height}
                    onChange={(e) => setCanopy({...canopy, height: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Material</label>
                  <select
                    value={canopy.material}
                    onChange={(e) => setCanopy({...canopy, material: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {STEEL_GRADES.map(s => (
                      <option key={s.grade} value={s.grade}>{s.grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Column Size (mm)</label>
                  <select
                    value={canopy.columnSize}
                    onChange={(e) => setCanopy({...canopy, columnSize: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {[75, 100, 125, 150, 200].map(s => (
                      <option key={s} value={s}>{s}x{s} SHS</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Paint</label>
                  <select
                    value={canopy.paint}
                    onChange={(e) => setCanopy({...canopy, paint: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {PAINT_TYPES.map(p => (
                      <option key={p.type} value={p.type}>{p.type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" checked={canopy.hasGutters} onChange={(e) => setCanopy({...canopy, hasGutters: e.target.checked})} className="rounded" />
                    Rain Gutters
                  </label>
                </div>
              </div>

              {/* Canopy Results */}
              <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-lg p-6 border border-orange-500/30">
                <h4 className="text-lg font-bold text-orange-400 mb-4">🏗️ CANOPY SPECIFICATIONS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{canopyResults.roofArea.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Roof Area (m²)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">{canopyResults.columnCount}</div>
                    <div className="text-xs text-gray-400">Columns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{canopyResults.totalWeight.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Weight (kg)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{canopy.length * canopy.width}</div>
                    <div className="text-xs text-gray-400">Coverage (m²)</div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL COST:</span>
                    <span className="text-green-400">KES {canopyResults.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {calculatorType === 'enclosure' && (
            <motion.div
              key="enclosure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Length (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={enclosure.length}
                    onChange={(e) => setEnclosure({...enclosure, length: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Width (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={enclosure.width}
                    onChange={(e) => setEnclosure({...enclosure, width: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={enclosure.height}
                    onChange={(e) => setEnclosure({...enclosure, height: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Ventilation (%)</label>
                  <input
                    type="number"
                    value={enclosure.ventilation}
                    onChange={(e) => setEnclosure({...enclosure, ventilation: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={enclosure.hasLouvers} onChange={(e) => setEnclosure({...enclosure, hasLouvers: e.target.checked})} className="rounded" />
                  Ventilation Louvers
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={enclosure.hasDoor} onChange={(e) => setEnclosure({...enclosure, hasDoor: e.target.checked})} className="rounded" />
                  Access Door
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={enclosure.soundProof} onChange={(e) => setEnclosure({...enclosure, soundProof: e.target.checked})} className="rounded" />
                  Sound Proofing
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={enclosure.weatherProof} onChange={(e) => setEnclosure({...enclosure, weatherProof: e.target.checked})} className="rounded" />
                  Weather Proof
                </label>
              </div>

              {/* Enclosure Results */}
              <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-lg p-6 border border-orange-500/30">
                <h4 className="text-lg font-bold text-orange-400 mb-4">📦 ENCLOSURE SPECIFICATIONS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{enclosureResults.totalArea.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Surface (m²)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">{(enclosure.length * enclosure.width * enclosure.height).toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Volume (m³)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{enclosureResults.totalWeight.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Weight (kg)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{enclosureResults.louverArea.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Vent Area (m²)</div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL COST:</span>
                    <span className="text-green-400">KES {enclosureResults.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Precision fabrication with quality materials
        </div>
        <a 
          href="https://wa.me/254768860655?text=I%20need%20fabrication%20quote"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}
