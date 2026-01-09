'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED AC SIZING CALCULATOR
// =====================================================

const ROOM_TYPES = [
  { type: 'Bedroom', btuPerSqm: 500, occupancy: 2 },
  { type: 'Living Room', btuPerSqm: 550, occupancy: 4 },
  { type: 'Office', btuPerSqm: 600, occupancy: 3 },
  { type: 'Server Room', btuPerSqm: 2000, occupancy: 0 },
  { type: 'Conference Room', btuPerSqm: 700, occupancy: 10 },
  { type: 'Restaurant', btuPerSqm: 800, occupancy: 20 },
  { type: 'Shop/Retail', btuPerSqm: 650, occupancy: 8 },
  { type: 'Kitchen (Commercial)', btuPerSqm: 1200, occupancy: 4 },
  { type: 'Hospital Ward', btuPerSqm: 700, occupancy: 6 },
  { type: 'Gym/Fitness', btuPerSqm: 900, occupancy: 15 },
];

const AC_TYPES = [
  { type: 'Split AC', efficiencyMin: 3.2, efficiencyMax: 5.5, priceMultiplier: 1.0 },
  { type: 'Window AC', efficiencyMin: 2.8, efficiencyMax: 3.5, priceMultiplier: 0.6 },
  { type: 'Cassette AC', efficiencyMin: 3.5, efficiencyMax: 5.0, priceMultiplier: 1.5 },
  { type: 'Floor Standing', efficiencyMin: 3.0, efficiencyMax: 4.5, priceMultiplier: 1.3 },
  { type: 'VRF System', efficiencyMin: 4.0, efficiencyMax: 6.5, priceMultiplier: 2.5 },
  { type: 'Chiller', efficiencyMin: 5.0, efficiencyMax: 7.0, priceMultiplier: 5.0 },
];

const STANDARD_AC_SIZES = [
  { btu: 9000, tons: 0.75, kw: 2.64 },
  { btu: 12000, tons: 1.0, kw: 3.52 },
  { btu: 18000, tons: 1.5, kw: 5.28 },
  { btu: 24000, tons: 2.0, kw: 7.03 },
  { btu: 30000, tons: 2.5, kw: 8.79 },
  { btu: 36000, tons: 3.0, kw: 10.55 },
  { btu: 48000, tons: 4.0, kw: 14.07 },
  { btu: 60000, tons: 5.0, kw: 17.58 },
];

export default function AdvancedACCalculator() {
  const [activeTab, setActiveTab] = useState<'room' | 'loads' | 'results' | 'cost'>('room');
  
  const [roomData, setRoomData] = useState({
    length: 5,
    width: 4,
    height: 3,
    roomType: 'Office',
    windows: 2,
    windowArea: 2, // m² per window
    windowOrientation: 'West',
    roofExposure: true,
    numPeople: 4,
    numComputers: 3,
    lighting: 500, // Watts
    otherEquipment: 1000, // Watts
    outdoorTemp: 35,
    indoorTemp: 24,
    humidity: 60,
    acType: 'Split AC',
    energyRating: 5, // Stars (1-5)
  });

  const results = useMemo(() => {
    const area = roomData.length * roomData.width;
    const volume = area * roomData.height;
    
    // Base heat load from room
    const roomTypeData = ROOM_TYPES.find(r => r.type === roomData.roomType) || ROOM_TYPES[0];
    let baseBTU = area * roomTypeData.btuPerSqm;
    
    // Window heat gain
    const windowOrientationFactor = {
      'North': 1.0,
      'South': 1.1,
      'East': 1.15,
      'West': 1.2,
    }[roomData.windowOrientation] || 1.0;
    const windowBTU = roomData.windows * roomData.windowArea * 800 * windowOrientationFactor;
    
    // Roof exposure
    const roofBTU = roomData.roofExposure ? area * 150 : 0;
    
    // People heat load (400 BTU per person for office, 600 for active)
    const peopleBTU = roomData.numPeople * (roomData.roomType === 'Gym/Fitness' ? 600 : 400);
    
    // Equipment heat load (3.41 BTU per Watt)
    const computerBTU = roomData.numComputers * 300 * 3.41; // 300W per computer
    const lightingBTU = roomData.lighting * 3.41;
    const equipmentBTU = roomData.otherEquipment * 3.41;
    
    // Temperature differential factor
    const tempDiff = roomData.outdoorTemp - roomData.indoorTemp;
    const tempFactor = 1 + (tempDiff - 10) * 0.02; // Adjust for temperature difference
    
    // Humidity factor
    const humidityFactor = 1 + (roomData.humidity - 50) * 0.005;
    
    // Total heat load
    const totalBTU = (baseBTU + windowBTU + roofBTU + peopleBTU + computerBTU + lightingBTU + equipmentBTU) * tempFactor * humidityFactor;
    
    // Safety factor (20%)
    const designBTU = totalBTU * 1.2;
    
    // Convert to tons and kW
    const tons = designBTU / 12000;
    const kw = designBTU / 3412;
    
    // Select nearest standard size
    const selectedSize = STANDARD_AC_SIZES.find(s => s.btu >= designBTU) || STANDARD_AC_SIZES[STANDARD_AC_SIZES.length - 1];
    
    // Multiple units calculation
    const unitsNeeded = Math.ceil(designBTU / 24000); // Max 2-ton units for residential
    
    // Energy efficiency
    const acTypeData = AC_TYPES.find(a => a.type === roomData.acType) || AC_TYPES[0];
    const eer = acTypeData.efficiencyMin + (roomData.energyRating - 1) * (acTypeData.efficiencyMax - acTypeData.efficiencyMin) / 4;
    const powerConsumption = designBTU / (eer * 3.412); // Watts
    
    // Operating cost
    const hoursPerDay = 10;
    const daysPerMonth = 30;
    const electricityRate = 25; // KES per kWh
    const monthlyConsumption = powerConsumption / 1000 * hoursPerDay * daysPerMonth;
    const monthlyCost = monthlyConsumption * electricityRate;
    
    // Purchase cost estimate
    const baseCost = selectedSize.btu * 6; // KES 6 per BTU base
    const purchaseCost = baseCost * acTypeData.priceMultiplier;
    const installationCost = purchaseCost * 0.15;
    
    return {
      area,
      volume,
      baseBTU,
      windowBTU,
      roofBTU,
      peopleBTU,
      equipmentBTU: computerBTU + lightingBTU + equipmentBTU,
      totalBTU,
      designBTU,
      tons,
      kw,
      selectedSize,
      unitsNeeded,
      eer,
      powerConsumption,
      monthlyConsumption,
      monthlyCost,
      purchaseCost,
      installationCost,
      totalCost: purchaseCost + installationCost,
    };
  }, [roomData]);

  return (
    <div className="bg-gray-900 rounded-xl border border-blue-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-4 border-b border-blue-500/30">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span>❄️</span> Advanced AC Sizing Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete heat load calculation with energy analysis & cost estimation
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'room', label: '🏠 Room Details' },
          { id: 'loads', label: '🔥 Heat Loads' },
          { id: 'results', label: '❄️ AC Sizing' },
          { id: 'cost', label: '💰 Costs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'room' && (
            <motion.div
              key="room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Length (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roomData.length}
                    onChange={(e) => setRoomData({...roomData, length: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Width (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roomData.width}
                    onChange={(e) => setRoomData({...roomData, width: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roomData.height}
                    onChange={(e) => setRoomData({...roomData, height: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Room Type</label>
                  <select
                    value={roomData.roomType}
                    onChange={(e) => setRoomData({...roomData, roomType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {ROOM_TYPES.map(r => (
                      <option key={r.type} value={r.type}>{r.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of Windows</label>
                  <input
                    type="number"
                    value={roomData.windows}
                    onChange={(e) => setRoomData({...roomData, windows: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Window Orientation</label>
                  <select
                    value={roomData.windowOrientation}
                    onChange={(e) => setRoomData({...roomData, windowOrientation: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West (Hottest)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of People</label>
                  <input
                    type="number"
                    value={roomData.numPeople}
                    onChange={(e) => setRoomData({...roomData, numPeople: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Computers</label>
                  <input
                    type="number"
                    value={roomData.numComputers}
                    onChange={(e) => setRoomData({...roomData, numComputers: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Outdoor Temp (°C)</label>
                  <input
                    type="number"
                    value={roomData.outdoorTemp}
                    onChange={(e) => setRoomData({...roomData, outdoorTemp: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Desired Temp (°C)</label>
                  <input
                    type="number"
                    value={roomData.indoorTemp}
                    onChange={(e) => setRoomData({...roomData, indoorTemp: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">AC Type</label>
                  <select
                    value={roomData.acType}
                    onChange={(e) => setRoomData({...roomData, acType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {AC_TYPES.map(a => (
                      <option key={a.type} value={a.type}>{a.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Energy Rating (Stars)</label>
                  <select
                    value={roomData.energyRating}
                    onChange={(e) => setRoomData({...roomData, energyRating: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[1, 2, 3, 4, 5].map(s => (
                      <option key={s} value={s}>{s} Star{'⭐'.repeat(s)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={roomData.roofExposure}
                      onChange={(e) => setRoomData({...roomData, roofExposure: e.target.checked})}
                      className="rounded"
                    />
                    Roof directly exposed to sun
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'loads' && (
            <motion.div
              key="loads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-orange-400 mb-4">🔥 HEAT LOAD BREAKDOWN</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Room Base Load', value: results.baseBTU, color: 'blue' },
                    { label: 'Window Heat Gain', value: results.windowBTU, color: 'yellow' },
                    { label: 'Roof Exposure', value: results.roofBTU, color: 'orange' },
                    { label: 'People (Occupancy)', value: results.peopleBTU, color: 'red' },
                    { label: 'Equipment & Lighting', value: results.equipmentBTU, color: 'purple' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="text-gray-400 w-40">{item.label}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full bg-${item.color}-500`}
                          style={{ 
                            width: `${(item.value / results.totalBTU) * 100}%`,
                            backgroundColor: `var(--color-${item.color}-500, #3b82f6)`
                          }}
                        />
                      </div>
                      <span className="text-white font-mono w-24 text-right">{item.value.toLocaleString()} BTU</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-600 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-cyan-400">TOTAL HEAT LOAD</span>
                    <span className="text-cyan-400">{results.totalBTU.toLocaleString()} BTU/hr</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-green-400">DESIGN CAPACITY (+20%)</span>
                    <span className="text-green-400">{results.designBTU.toLocaleString()} BTU/hr</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-lg p-4 text-center border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400">{results.designBTU.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Required BTU/hr</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-cyan-400">{results.tons.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Tons of Cooling</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-green-400">{results.kw.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">kW Cooling</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-3xl font-bold text-yellow-400">{results.unitsNeeded}</div>
                  <div className="text-xs text-gray-400">Units Needed</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">✅ RECOMMENDED AC</h4>
                <div className="text-3xl font-bold text-white mb-2">
                  {results.selectedSize.btu.toLocaleString()} BTU ({results.selectedSize.tons} Ton) {roomData.acType}
                </div>
                <p className="text-gray-400 text-sm">
                  Room Area: {results.area}m² | Volume: {results.volume}m³ | EER: {results.eer.toFixed(1)}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">⚡ ENERGY ANALYSIS</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Power Consumption:</span>
                    <span className="text-white ml-2">{(results.powerConsumption / 1000).toFixed(2)} kW</span>
                  </div>
                  <div>
                    <span className="text-gray-400">EER (Efficiency):</span>
                    <span className="text-white ml-2">{results.eer.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Monthly Usage:</span>
                    <span className="text-white ml-2">{results.monthlyConsumption.toFixed(0)} kWh</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Monthly Cost:</span>
                    <span className="text-green-400 ml-2">KES {results.monthlyCost.toLocaleString()}</span>
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
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 COST ESTIMATION</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">AC Unit ({results.selectedSize.btu.toLocaleString()} BTU {roomData.acType})</span>
                    <span className="text-white">KES {results.purchaseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Installation</span>
                    <span className="text-white">KES {results.installationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL INVESTMENT</span>
                    <span className="text-green-400">KES {results.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">📊 OPERATING COSTS</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">KES {(results.monthlyCost / 30).toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Per Day</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">KES {results.monthlyCost.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Per Month</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">KES {(results.monthlyCost * 12).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Per Year</div>
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
          Room: {results.area}m² | Capacity: {results.selectedSize.btu.toLocaleString()} BTU
        </div>
        <a 
          href="https://wa.me/254768860665?text=I%20need%20AC%20installation"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}
