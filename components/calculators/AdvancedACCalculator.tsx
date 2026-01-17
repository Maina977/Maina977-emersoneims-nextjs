/**
 * 🚀 WORLD-CLASS AC SIZING CALCULATOR WITH CHART.JS
 *
 * Features:
 * ✅ Real-time circular pressure gauges showing cooling metrics
 * ✅ Live Chart.js visualizations (Line, Bar, Doughnut, Radar)
 * ✅ Comprehensive heat load breakdown with visual analysis
 * ✅ Energy efficiency ratings and cost projections
 * ✅ Professional glassmorphic UI
 */

'use client';

import { useState, useMemo } from 'react';
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
// DATA CONSTANTS
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
    const baseBTU = area * roomTypeData.btuPerSqm;

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
      computerBTU,
      lightingBTU,
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
      tempDiff,
      coolingEfficiency: (designBTU / powerConsumption) * 100,
    };
  }, [roomData]);

  return (
    <div className="bg-gray-900 rounded-xl border border-blue-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-4 border-b border-blue-500/30">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span>❄️</span> World-Class AC Sizing Calculator with Chart.js
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Professional heat load analysis • Pressure gauges • Real-time visualizations • Energy optimization
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'room', label: '🏠 Room Details' },
          { id: 'loads', label: '🔥 Heat Loads' },
          { id: 'results', label: '📊 Results & Charts' },
          { id: 'cost', label: '💰 Cost Analysis' },
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
                      <option key={s} value={s}>{s} Star{'*'.repeat(s)}</option>
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
              {/* Heat Load Breakdown */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-orange-400 mb-4">🔥 HEAT LOAD BREAKDOWN</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Room Base Load', value: results.baseBTU, color: 'bg-blue-500' },
                    { label: 'Window Heat Gain', value: results.windowBTU, color: 'bg-yellow-500' },
                    { label: 'Roof Exposure', value: results.roofBTU, color: 'bg-orange-500' },
                    { label: 'People (Occupancy)', value: results.peopleBTU, color: 'bg-red-500' },
                    { label: 'Equipment & Lighting', value: results.equipmentBTU, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="text-gray-400 w-40">{item.label}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full ${item.color}`}
                          style={{
                            width: `${Math.min((item.value / results.totalBTU) * 100, 100)}%`
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

              {/* Heat Load Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <ChartCard title="Heat Load Distribution" icon="🔥">
                  <Doughnut
                    data={{
                      labels: ['Room Base', 'Windows', 'Roof', 'People', 'Equipment'],
                      datasets: [{
                        data: [
                          results.baseBTU,
                          results.windowBTU,
                          results.roofBTU,
                          results.peopleBTU,
                          results.equipmentBTU
                        ],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(251, 191, 36, 0.8)',
                          'rgba(251, 146, 60, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(168, 85, 247, 0.8)'
                        ],
                        borderColor: [
                          'rgb(59, 130, 246)',
                          'rgb(251, 191, 36)',
                          'rgb(251, 146, 60)',
                          'rgb(239, 68, 68)',
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

                <ChartCard title="Heat Load Comparison" icon="📊">
                  <Bar
                    data={{
                      labels: ['Base', 'Windows', 'Roof', 'People', 'Equipment'],
                      datasets: [{
                        label: 'BTU/hr',
                        data: [
                          results.baseBTU,
                          results.windowBTU,
                          results.roofBTU,
                          results.peopleBTU,
                          results.equipmentBTU
                        ],
                        backgroundColor: 'rgba(6, 182, 212, 0.8)',
                        borderColor: 'rgb(6, 182, 212)',
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
                  label="Cooling Capacity"
                  value={results.tons}
                  max={10}
                  unit=" Tons"
                  color="from-blue-500 to-cyan-600"
                />
                <CircularGauge
                  label="EER Rating"
                  value={results.eer}
                  max={7}
                  unit=""
                  color="from-green-500 to-emerald-600"
                />
                <CircularGauge
                  label="Power Draw"
                  value={results.powerConsumption / 1000}
                  max={10}
                  unit=" kW"
                  color="from-yellow-500 to-orange-600"
                />
                <CircularGauge
                  label="Temp Diff"
                  value={results.tempDiff}
                  max={20}
                  unit="°C"
                  color="from-red-500 to-pink-600"
                />
              </div>

              {/* Main Sizing Results */}
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

              {/* Recommended AC */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">✅ RECOMMENDED AC</h4>
                <div className="text-3xl font-bold text-white mb-2">
                  {results.selectedSize.btu.toLocaleString()} BTU ({results.selectedSize.tons} Ton) {roomData.acType}
                </div>
                <p className="text-gray-400 text-sm">
                  Room Area: {results.area}m² | Volume: {results.volume}m³ | EER: {results.eer.toFixed(1)}
                </p>
              </div>

              {/* CHART.JS VISUALIZATIONS */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Energy Cost Projection */}
                <ChartCard title="12-Month Energy Cost Projection" icon="💰">
                  <Line
                    data={{
                      labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
                      datasets: [{
                        label: 'Monthly Cost (KES)',
                        data: Array.from({ length: 12 }, () => results.monthlyCost),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                      }, {
                        label: 'Cumulative Cost (KES)',
                        data: Array.from({ length: 12 }, (_, i) => results.monthlyCost * (i + 1)),
                        borderColor: 'rgb(251, 191, 36)',
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
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
                          ticks: {
                            color: '#9ca3af',
                            callback: (value) => `KES ${(Number(value) / 1000).toFixed(0)}K`
                          }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af', font: { size: 10 } }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* AC Type Comparison */}
                <ChartCard title="AC Type Efficiency Comparison" icon="❄️">
                  <Bar
                    data={{
                      labels: AC_TYPES.map(a => a.type),
                      datasets: [{
                        label: 'Max EER',
                        data: AC_TYPES.map(a => a.efficiencyMax),
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: 'rgb(34, 197, 94)',
                        borderWidth: 2
                      }, {
                        label: 'Min EER',
                        data: AC_TYPES.map(a => a.efficiencyMin),
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af', font: { size: 9 } }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Energy Analysis */}
                <ChartCard title="Energy Performance Analysis" icon="⚡">
                  <Radar
                    data={{
                      labels: ['Efficiency', 'Cooling Power', 'Energy Savings', 'Room Coverage', 'Cost Efficiency', 'Environmental'],
                      datasets: [{
                        label: 'Your AC System',
                        data: [
                          (results.eer / 7) * 100,
                          (results.tons / 5) * 100,
                          roomData.energyRating * 20,
                          (results.area / 50) * 100,
                          (1 - results.monthlyCost / 50000) * 100,
                          roomData.energyRating * 20
                        ],
                        backgroundColor: 'rgba(6, 182, 212, 0.2)',
                        borderColor: 'rgb(6, 182, 212)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(6, 182, 212)',
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

                {/* Standard AC Sizes */}
                <ChartCard title="Standard AC Sizes vs Your Need" icon="📐">
                  <Bar
                    data={{
                      labels: STANDARD_AC_SIZES.map(s => `${s.tons}T`),
                      datasets: [{
                        label: 'BTU Capacity',
                        data: STANDARD_AC_SIZES.map(s => s.btu),
                        backgroundColor: STANDARD_AC_SIZES.map(s =>
                          s.btu === results.selectedSize.btu ? 'rgba(34, 197, 94, 0.8)' : 'rgba(107, 114, 128, 0.5)'
                        ),
                        borderColor: STANDARD_AC_SIZES.map(s =>
                          s.btu === results.selectedSize.btu ? 'rgb(34, 197, 94)' : 'rgb(107, 114, 128)'
                        ),
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

              {/* Cost Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <ChartCard title="Investment vs Operating Cost (5 Years)" icon="📈">
                  <Line
                    data={{
                      labels: ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                      datasets: [{
                        label: 'Total Cost (KES)',
                        data: [
                          results.totalCost,
                          results.totalCost + results.monthlyCost * 12,
                          results.totalCost + results.monthlyCost * 24,
                          results.totalCost + results.monthlyCost * 36,
                          results.totalCost + results.monthlyCost * 48,
                          results.totalCost + results.monthlyCost * 60
                        ],
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
                        legend: { labels: { color: '#ffffff' } }
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

                <ChartCard title="Cost Breakdown" icon="💵">
                  <Doughnut
                    data={{
                      labels: ['AC Unit', 'Installation', 'Annual Electricity'],
                      datasets: [{
                        data: [results.purchaseCost, results.installationCost, results.monthlyCost * 12],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(251, 191, 36, 0.8)'
                        ],
                        borderColor: [
                          'rgb(59, 130, 246)',
                          'rgb(34, 197, 94)',
                          'rgb(251, 191, 36)'
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
            stroke="url(#acGaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="acGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
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
