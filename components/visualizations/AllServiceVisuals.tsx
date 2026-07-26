'use client';

import { motion } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════
// UPS SYSTEMS VISUALS
// ════════════════════════════════════════════════════════════════════════

export function UPSTransferTimeGauge() {
  return (
    <div className="bg-slate-900/50 border border-violet-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-violet-400 mb-6">Transfer Time Performance</h3>
      <svg viewBox="0 0 600 300" className="w-full h-auto bg-black/30 rounded p-4">
        <text x="50" y="30" className="fill-gray-400 text-sm font-bold">Mains Failure</text>
        <line x1="50" y1="50" x2="150" y2="50" stroke="green" strokeWidth="3"/>
        <circle cx="160" cy="50" r="6" fill="green"/>
        <text x="170" y="55" className="fill-green-400 text-xs">Utility Power</text>

        <text x="50" y="80" className="fill-gray-400 text-sm font-bold">Detection Delay</text>
        <line x1="160" y1="100" x2="210" y2="100" stroke="yellow" strokeWidth="3"/>
        <text x="215" y="105" className="fill-yellow-400 text-xs">2-8ms (online UPS)</text>

        <text x="50" y="130" className="fill-gray-400 text-sm font-bold">Transfer Execution</text>
        <line x1="210" y1="150" x2="250" y2="150" stroke="orange" strokeWidth="3"/>
        <text x="255" y="155" className="fill-orange-400 text-xs">&lt;100ms total</text>

        <text x="50" y="180" className="fill-gray-400 text-sm font-bold">UPS Output Stable</text>
        <line x1="250" y1="200" x2="550" y2="200" stroke="cyan" strokeWidth="3"/>
        <circle cx="560" cy="200" r="6" fill="cyan"/>
        <text x="410" y="220" className="fill-cyan-400 text-xs font-bold">Zero downtime for critical loads</text>

        <rect x="50" y="260" width="500" height="30" fill="red" opacity="0.1" rx="3"/>
        <text x="55" y="282" className="fill-red-300 text-xs">Line-interactive UPS: 5-20ms | Offline UPS: 20-100ms | Online UPS: &lt;5ms (ZERO DOWNTIME)</text>
      </svg>
    </div>
  );
}

export function BatteryDischargeProfile() {
  return (
    <div className="bg-slate-900/50 border border-violet-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-violet-400 mb-6">Battery Discharge Curve (100kVA UPS)</h3>
      <svg viewBox="0 0 700 350" className="w-full h-auto bg-black/30 rounded p-4">
        <line x1="80" y1="50" x2="80" y2="280" stroke="gray" strokeWidth="2"/>
        <line x1="80" y1="280" x2="650" y2="280" stroke="gray" strokeWidth="2"/>

        <text x="20" y="170" className="fill-gray-400 text-xs">Battery %</text>
        <text x="365" y="320" className="fill-gray-400 text-xs text-center">Runtime (minutes)</text>

        {[0, 20, 40, 60, 80, 100].map((val, i) => (
          <text key={i} x={40} y={285 - val * 2} className="fill-gray-400 text-xs text-right">{val}%</text>
        ))}

        {[0, 5, 10, 15, 20, 25, 30].map((val, i) => (
          <text key={i} x={80 + i * 95} y="305" className="fill-gray-400 text-xs text-center">{val}m</text>
        ))}

        {/* 50% Load Profile */}
        <polyline points="80,80 175,120 270,160 365,200 460,240 550,270 650,280" fill="none" stroke="#3b82f6" strokeWidth="3"/>
        <text x="655" y="275" className="fill-blue-400 text-xs">50% Load (30min)</text>

        {/* 75% Load Profile */}
        <polyline points="80,80 170,135 260,190 350,240 440,270 530,290 650,300" fill="none" stroke="#f59e0b" strokeWidth="3"/>
        <text x="655" y="305" className="fill-amber-400 text-xs">75% Load (15min)</text>

        {/* 100% Load Profile */}
        <polyline points="80,80 160,155 240,230 320,280 400,290 480,295 560,298 650,300" fill="none" stroke="#ef4444" strokeWidth="3"/>
        <text x="655" y="330" className="fill-red-400 text-xs">100% Load (5min)</text>
      </svg>
      <p className="text-gray-300 text-sm mt-4">Battery discharge rate depends on load percentage. Design backup runtime based on critical application requirements, not best-case scenarios.</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// BOREHOLE DRILLING VISUALS
// ════════════════════════════════════════════════════════════════════════

export function AquiferCrossSectionDiagram() {
  return (
    <div className="bg-slate-900/50 border border-blue-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-blue-400 mb-6">Typical Aquifer Cross-Section (Kenya)</h3>
      <svg viewBox="0 0 800 500" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Surface */}
        <rect x="50" y="50" width="700" height="20" fill="#8b7355"/>
        <text x="70" y="70" className="fill-amber-300 text-xs font-semibold">Land Surface</text>

        {/* Soil & Weathered Zone */}
        <rect x="50" y="70" width="700" height="80" fill="#cd853f" opacity="0.5"/>
        <text x="70" y="120" className="fill-gray-300 text-xs">Soil & Weathering Zone (0-30m)</text>
        <text x="70" y="135" className="fill-gray-400 text-xs">Low yield, high contamination risk</text>

        {/* Water Table */}
        <line x1="50" y1="150" x2="750" y2="150" stroke="cyan" strokeWidth="3" strokeDasharray="5,5"/>
        <text x="760" y="155" className="fill-cyan-400 text-xs font-bold">Water Table</text>

        {/* Shallow Weathered Aquifer */}
        <rect x="50" y="150" width="700" height="100" fill="#4169e1" opacity="0.3"/>
        <text x="70" y="200" className="fill-cyan-300 text-xs font-semibold">Shallow Weathered Aquifer (30-100m)</text>
        <text x="70" y="215" className="fill-cyan-300 text-xs">Yield: 0.5-5 m³/day | Variable, seasonal</text>

        {/* Bedrock */}
        <rect x="50" y="250" width="700" height="15" fill="#696969"/>
        <text x="70" y="265" className="fill-gray-400 text-xs">Weathered Bedrock Interface</text>

        {/* Fractured Hard Rock Aquifer */}
        <rect x="50" y="265" width="700" height="150" fill="#4169e1" opacity="0.5"/>
        <text x="70" y="310" className="fill-blue-300 text-xs font-semibold">Fractured Hard Rock Aquifer (100-500m)</text>
        <text x="70" y="325" className="fill-blue-300 text-xs">Yield: 2-30 m³/day | Better quality, more stable</text>
        <text x="70" y="340" className="fill-blue-300 text-xs">Productivity depends on fracture density</text>

        {/* Deep Confined Aquifer */}
        <rect x="50" y="415" width="700" height="50" fill="#00008b" opacity="0.4"/>
        <text x="70" y="448" className="fill-blue-200 text-xs">Deep Confined Aquifer (&gt;500m)</text>

        {/* Borehole Drilling Indicators */}
        <line x1="750" y1="70" x2="790" y2="70" stroke="red" strokeWidth="2"/>
        <circle cx="800" cy="70" r="4" fill="red"/>
        <text x="810" y="75" className="fill-red-400 text-xs">Borehole Location</text>

        {/* Depth Scale */}
        <text x="20" y="40" className="fill-gray-400 text-xs font-bold">Depth (m)</text>
        <text x="20" y="80" className="fill-gray-400 text-xs">0-30</text>
        <text x="20" y="180" className="fill-gray-400 text-xs">30-100</text>
        <text x="20" y="300" className="fill-gray-400 text-xs">100-500</text>
        <text x="20" y="440" className="fill-gray-400 text-xs">500+</text>
      </svg>
    </div>
  );
}

export function DrillingMethodsComparisonChart() {
  return (
    <div className="bg-slate-900/50 border border-blue-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-blue-400 mb-6">Drilling Methods Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-slate-700 px-4 py-2 text-left text-blue-400">Method</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-cyan-400">Max Depth</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-green-400">Speed</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-yellow-400">Cost</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-purple-400">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-900/10 hover:bg-blue-900/20">
              <td className="border border-slate-700 px-4 py-2"><span className="font-semibold text-blue-300">Percussion/Cable Tool</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-cyan-400">0-300m</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-yellow-400">5-30m/day</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-green-400">LOW</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-purple-300">Consolidated rock, remote areas</span></td>
            </tr>
            <tr className="bg-cyan-900/10 hover:bg-cyan-900/20">
              <td className="border border-slate-700 px-4 py-2"><span className="font-semibold text-cyan-300">Rotary Mud Circulation</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-cyan-400">0-1000m</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-yellow-400">20-100m/day</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-green-400">MEDIUM</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-purple-300">Production wells, mixed geology</span></td>
            </tr>
            <tr className="bg-orange-900/10 hover:bg-orange-900/20">
              <td className="border border-slate-700 px-4 py-2"><span className="font-semibold text-orange-300">Air Percussion</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-cyan-400">0-500m</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-yellow-400">50-300m/day</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-green-400">MEDIUM-HIGH</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-purple-300">Hard rock, fast penetration</span></td>
            </tr>
            <tr className="bg-red-900/10 hover:bg-red-900/20">
              <td className="border border-slate-700 px-4 py-2"><span className="font-semibold text-red-300">DTH (Down-The-Hole)</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-cyan-400">0-2000m+</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-yellow-400">100-400m/day</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-green-400">HIGH</span></td>
              <td className="border border-slate-700 px-4 py-2"><span className="text-purple-300">Deep exploration, mining</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MOTOR VISUALS
// ════════════════════════════════════════════════════════════════════════

export function MotorEfficiencyCurve() {
  return (
    <div className="bg-slate-900/50 border border-orange-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-orange-400 mb-6">Motor Efficiency vs. Load</h3>
      <svg viewBox="0 0 700 350" className="w-full h-auto bg-black/30 rounded p-4">
        <line x1="80" y1="50" x2="80" y2="280" stroke="gray" strokeWidth="2"/>
        <line x1="80" y1="280" x2="650" y2="280" stroke="gray" strokeWidth="2"/>

        <text x="20" y="170" className="fill-gray-400 text-xs">Efficiency %</text>
        <text x="365" y="320" className="fill-gray-400 text-xs text-center">Load %</text>

        {[70, 75, 80, 85, 90, 95].map((val, i) => (
          <text key={i} x={40} y={280 - (val - 70) * 7} className="fill-gray-400 text-xs text-right">{val}%</text>
        ))}

        {[0, 25, 50, 75, 100].map((val, i) => (
          <text key={i} x={80 + i * 142} y="305" className="fill-gray-400 text-xs text-center">{val}%</text>
        ))}

        {/* IE1 (Standard) */}
        <polyline points="80,180 150,200 220,215 290,225 360,230 430,225 500,220 570,215" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <text x="580" y="215" className="fill-red-400 text-xs">IE1 Standard</text>

        {/* IE3 (Premium) */}
        <polyline points="80,160 150,185 220,210 290,235 360,245 430,240 500,235 570,230" fill="none" stroke="#22c55e" strokeWidth="2"/>
        <text x="580" y="230" className="fill-green-400 text-xs">IE3 Premium</text>

        {/* Best Efficiency Zone */}
        <rect x="290" y="220" width="140" height="30" fill="yellow" opacity="0.1" rx="3" strokeDasharray="5,5" stroke="yellow"/>
        <text x="365" y="243" className="fill-yellow-300 text-xs text-center font-semibold">Peak Efficiency Zone (50-100% load)</text>
      </svg>
      <p className="text-gray-300 text-sm mt-4">Motors operate most efficiently between 50-100% of rated load. Oversizing reduces efficiency significantly. Undersizing causes overheating.</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// AC/HVAC VISUALS
// ════════════════════════════════════════════════════════════════════════

export function VaporCompressionCycleDiagram() {
  return (
    <div className="bg-slate-900/50 border border-cyan-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-cyan-400 mb-6">Vapor-Compression Refrigeration Cycle</h3>
      <svg viewBox="0 0 800 400" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Main cycle circle */}
        <circle cx="400" cy="200" r="150" fill="none" stroke="gray" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>

        {/* Compressor (bottom-left) */}
        <rect x="250" y="300" width="80" height="60" fill="none" stroke="red" strokeWidth="2" rx="5"/>
        <text x="290" y="335" className="fill-red-400 text-xs font-bold">Compressor</text>
        <text x="280" y="350" className="fill-red-300 text-xs">(High Pressure)</text>

        {/* Condenser (top-right) */}
        <rect x="520" y="100" width="80" height="60" fill="none" stroke="blue" strokeWidth="2" rx="5"/>
        <text x="530" y="135" className="fill-blue-400 text-xs font-bold">Condenser</text>
        <text x="525" y="150" className="fill-blue-300 text-xs">(Outdoor Unit)</text>

        {/* Expansion Valve (top-left) */}
        <rect x="250" y="100" width="80" height="60" fill="none" stroke="yellow" strokeWidth="2" rx="5"/>
        <text x="255" y="135" className="fill-yellow-400 text-xs font-bold">Expansion</text>
        <text x="260" y="150" className="fill-yellow-300 text-xs">Valve</text>

        {/* Evaporator (bottom-right) */}
        <rect x="520" y="300" width="80" height="60" fill="none" stroke="green" strokeWidth="2" rx="5"/>
        <text x="530" y="335" className="fill-green-400 text-xs font-bold">Evaporator</text>
        <text x="525" y="350" className="fill-green-300 text-xs">(Indoor Unit)</text>

        {/* Flow arrows and labels */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="white"/>
          </marker>
        </defs>

        {/* 1-2: Compression */}
        <line x1="290" y1="300" x2="400" y2="250" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="330" y="270" className="fill-white text-xs">1-2: Compression</text>
        <text x="330" y="283" className="fill-gray-400 text-xs">(P↑ T↑)</text>

        {/* 2-3: Condensation */}
        <line x1="520" y1="130" x2="410" y2="180" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="440" y="145" className="fill-white text-xs">2-3: Condensation</text>
        <text x="440" y="158" className="fill-gray-400 text-xs">(Heat out)</text>

        {/* 3-4: Expansion */}
        <line x1="330" y1="100" x2="240" y2="170" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="260" y="115" className="fill-white text-xs">3-4: Throttling</text>
        <text x="260" y="128" className="fill-gray-400 text-xs">(P↓)</text>

        {/* 4-1: Evaporation */}
        <line x1="560" y1="300" x2="470" y2="240" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="490" y="265" className="fill-white text-xs">4-1: Evaporation</text>
        <text x="490" y="278" className="fill-gray-400 text-xs">(Heat in)</text>

        {/* Performance metrics */}
        <rect x="50" y="360" width="700" height="35" fill="blue" opacity="0.1" rx="3"/>
        <text x="60" y="380" className="fill-blue-300 text-xs">Refrigerant Flow: Liquid → Gas → Liquid | COP (Coefficient of Performance) = 3-6 | SEER = 13-22</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// HIGH-VOLTAGE VISUALS
// ════════════════════════════════════════════════════════════════════════

export function OneLineDiagram() {
  return (
    <div className="bg-slate-900/50 border border-amber-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-amber-400 mb-6">Typical 3-Phase Distribution One-Line Diagram</h3>
      <svg viewBox="0 0 900 350" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Utility Supply */}
        <text x="30" y="50" className="fill-gray-300 text-xs font-bold">Utility Grid</text>
        <line x1="50" y1="60" x2="50" y2="100" stroke="green" strokeWidth="3"/>
        <circle cx="50" cy="110" r="8" fill="green"/>

        {/* Main Transformer */}
        <text x="80" y="50" className="fill-gray-300 text-xs">HV/LV Transform</text>
        <circle cx="100" cy="100" r="20" fill="none" stroke="orange" strokeWidth="2"/>
        <text x="93" y="105" className="fill-orange-400 text-xs">T1</text>

        {/* Connection */}
        <line x1="58" y1="110" x2="80" y2="110" stroke="gray" strokeWidth="2"/>
        <line x1="120" y1="110" x2="150" y2="110" stroke="gray" strokeWidth="2"/>

        {/* Main DB */}
        <rect x="150" y="90" width="50" height="40" fill="none" stroke="red" strokeWidth="2"/>
        <text x="165" y="115" className="fill-red-400 text-xs">Main</text>
        <text x="165" y="125" className="fill-red-400 text-xs">DB</text>

        {/* Branch Distribution */}
        <line x1="200" y1="110" x2="250" y2="110" stroke="gray" strokeWidth="2"/>

        {/* DB-1 (Lighting) */}
        <rect x="250" y="90" width="50" height="40" fill="none" stroke="yellow" strokeWidth="2"/>
        <text x="260" y="115" className="fill-yellow-400 text-xs">DB-1</text>
        <text x="256" y="125" className="fill-yellow-400 text-xs">Light</text>
        <line x1="275" y1="130" x2="275" y2="160" stroke="yellow" strokeWidth="1"/>
        <text x="260" y="180" className="fill-yellow-300 text-xs text-center">Lighting Load</text>

        {/* DB-2 (Power) */}
        <rect x="330" y="90" width="50" height="40" fill="none" stroke="cyan" strokeWidth="2"/>
        <text x="345" y="115" className="fill-cyan-400 text-xs">DB-2</text>
        <text x="340" y="125" className="fill-cyan-400 text-xs">Power</text>
        <line x1="355" y1="130" x2="355" y2="160" stroke="cyan" strokeWidth="1"/>
        <text x="340" y="180" className="fill-cyan-300 text-xs text-center">Power Load</text>

        {/* DB-3 (HVAC) */}
        <rect x="410" y="90" width="50" height="40" fill="none" stroke="purple" strokeWidth="2"/>
        <text x="420" y="115" className="fill-purple-400 text-xs">DB-3</text>
        <text x="415" y="125" className="fill-purple-400 text-xs">HVAC</text>
        <line x1="435" y1="130" x2="435" y2="160" stroke="purple" strokeWidth="1"/>
        <text x="420" y="180" className="fill-purple-300 text-xs text-center">HVAC Load</text>

        {/* Protection Info */}
        <rect x="50" y="240" width="400" height="90" fill="slate-800" opacity="0.5" rx="5" border="border-slate-700"/>
        <text x="60" y="260" className="fill-gray-300 text-xs font-bold">Protection Strategy:</text>
        <text x="60" y="280" className="fill-gray-400 text-xs">• Main DB: 400A ACB with overload & short circuit protection</text>
        <text x="60" y="295" className="fill-gray-400 text-xs">• Each DB: MCCB sized for respective load, selectivity maintained</text>
        <text x="60" y="310" className="fill-gray-400 text-xs">• Earthing: TN-S system, main bond &lt;0.8Ω, branch bonds &lt;1Ω</text>
        <text x="60" y="325" className="fill-gray-400 text-xs">• RCD/GFCI: 30mA on final circuits, 300mA on feeder</text>
      </svg>
    </div>
  );
}

export default function AllServiceVisuals() {
  return (
    <div className="space-y-8">
      <UPSTransferTimeGauge />
      <BatteryDischargeProfile />
      <AquiferCrossSectionDiagram />
      <DrillingMethodsComparisonChart />
      <MotorEfficiencyCurve />
      <VaporCompressionCycleDiagram />
      <OneLineDiagram />
    </div>
  );
}
