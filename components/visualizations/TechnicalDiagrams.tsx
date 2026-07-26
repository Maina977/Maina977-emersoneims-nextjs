'use client';

import { motion } from 'framer-motion';

// DC-to-AC Inverter Circuit Diagram
export function DCtoACCircuitDiagram() {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-yellow-400 mb-6">DC-to-AC Conversion Circuit</h3>
      <svg viewBox="0 0 800 300" className="w-full h-auto bg-black/30 rounded p-4">
        {/* PV Panel Side */}
        <text x="50" y="30" className="fill-yellow-400 text-sm font-bold">PV Panels (DC)</text>
        <rect x="30" y="50" width="80" height="60" fill="none" stroke="yellow" strokeWidth="2"/>
        <text x="50" y="90" className="fill-yellow-300 text-xs text-center">+</text>
        <text x="50" y="100" className="fill-yellow-300 text-xs text-center">DC Input</text>

        {/* MPPT Controller */}
        <circle cx="250" cy="80" r="40" fill="none" stroke="cyan" strokeWidth="2"/>
        <text x="240" y="85" className="fill-cyan-300 text-xs">MPPT</text>
        <line x1="110" y1="80" x2="210" y2="80" stroke="yellow" strokeWidth="2"/>
        <line x1="290" y1="80" x2="350" y2="80" stroke="cyan" strokeWidth="2"/>

        {/* Inverter Bridge */}
        <rect x="350" y="30" width="100" height="100" fill="none" stroke="purple" strokeWidth="2"/>
        <text x="365" y="85" className="fill-purple-300 text-xs">Inverter</text>
        <text x="365" y="100" className="fill-purple-300 text-xs">Bridge</text>

        {/* Filter */}
        <circle cx="550" cy="80" r="30" fill="none" stroke="green" strokeWidth="2"/>
        <text x="540" y="85" className="fill-green-300 text-xs">Filter</text>
        <line x1="450" y1="80" x2="520" y2="80" stroke="purple" strokeWidth="2"/>
        <line x1="580" y1="80" x2="640" y2="80" stroke="green" strokeWidth="2"/>

        {/* AC Output */}
        <text x="680" y="30" className="fill-emerald-400 text-sm font-bold">AC Output</text>
        <rect x="660" y="50" width="80" height="60" fill="none" stroke="emerald" strokeWidth="2"/>
        <text x="680" y="90" className="fill-emerald-300 text-xs text-center">~</text>
        <text x="680" y="100" className="fill-emerald-300 text-xs text-center">AC Output</text>

        {/* Waveforms */}
        <text x="50" y="160" className="fill-gray-400 text-xs">DC Input (Flat Line)</text>
        <line x1="30" y1="180" x2="150" y2="180" stroke="yellow" strokeWidth="1"/>

        <text x="350" y="160" className="fill-gray-400 text-xs">MPPT Tracking Point</text>
        <path d="M 330 190 Q 340 170 350 190 Q 360 170 370 190 Q 380 170 390 190" fill="none" stroke="cyan" strokeWidth="1"/>

        <text x="640" y="160" className="fill-gray-400 text-xs">AC Output (Sinusoidal)</text>
        <path d="M 630 190 Q 640 160 650 190 Q 660 220 670 190 Q 680 160 690 190 Q 700 220 710 190" fill="none" stroke="emerald" strokeWidth="1"/>

        {/* Specifications */}
        <text x="50" y="250" className="fill-gray-300 text-xs">Typical Efficiency: 96-98%</text>
        <text x="350" y="250" className="fill-gray-300 text-xs">Switching Frequency: 16-20 kHz</text>
        <text x="630" y="250" className="fill-gray-300 text-xs">Output: 230V/400V AC</text>
      </svg>
      <p className="text-gray-300 text-sm mt-4">Modern inverters use MPPT tracking to optimize power extraction from solar panels, then convert DC to AC through high-speed switching circuits, followed by filtering for clean sine-wave output.</p>
    </div>
  );
}

// Temperature Derating Curve
export function TemperatureDeratingCurve() {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-amber-400 mb-6">Temperature Derating Impact on Output</h3>
      <svg viewBox="0 0 700 400" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Axes */}
        <line x1="80" y1="50" x2="80" y2="330" stroke="gray" strokeWidth="2"/>
        <line x1="80" y1="330" x2="650" y2="330" stroke="gray" strokeWidth="2"/>

        {/* Y-axis label */}
        <text x="20" y="200" className="fill-gray-400 text-xs text-center">Power Output %</text>

        {/* X-axis label */}
        <text x="365" y="370" className="fill-gray-400 text-xs text-center">Ambient Temperature °C</text>

        {/* Y-axis scale */}
        <text x="50" y="335" className="fill-gray-400 text-xs text-right">0%</text>
        <text x="40" y="250" className="fill-gray-400 text-xs text-right">50%</text>
        <text x="40" y="165" className="fill-gray-400 text-xs text-right">100%</text>

        {/* X-axis scale */}
        {[0, 10, 20, 30, 40, 50].map((temp, i) => (
          <text key={i} x={80 + i * 110} y="355" className="fill-gray-400 text-xs text-center">{temp}°</text>
        ))}

        {/* Reference line at 25°C (STC) */}
        <line x1="170" y1="50" x2="170" y2="330" stroke="gray" strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
        <text x="155" y="40" className="fill-gray-500 text-xs">STC 25°C</text>

        {/* Derating curve */}
        <polyline points="80,165 170,165 280,213 390,262 500,310 610,330" fill="none" stroke="red" strokeWidth="3"/>

        {/* Derating rate annotation */}
        <text x="400" y="250" className="fill-red-400 text-xs">-0.35% to -0.45% per °C</text>

        {/* Kenya climate zones */}
        <rect x="80" y="300" width="530" height="20" fill="red" opacity="0.2"/>
        <text x="90" y="315" className="fill-red-300 text-xs">Typical Kenya Climate Zone (30-45°C): ~15-25% output loss in hot afternoons</text>
      </svg>
      <p className="text-gray-300 text-sm mt-4">In Kenya's hot climate, inverter output degrades significantly during peak afternoon temperatures. This is why proper ventilation and thermal management are critical for system design.</p>
    </div>
  );
}

// MPPT Tracking Efficiency Gauge
export function MPPTEfficiencyGauge({ current = 75 }: { current?: number }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-yellow-400 mb-6">MPPT Algorithm Tracking Efficiency</h3>
      <div className="flex items-center justify-center gap-8">
        <div className="w-48 h-48 relative">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Gauge background */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="gray" strokeWidth="2"/>

            {/* Colored segments */}
            <path d="M 100 20 A 80 80 0 0 1 179 100" fill="none" stroke="green" strokeWidth="8" opacity="0.3"/>
            <path d="M 179 100 A 80 80 0 0 1 100 180" fill="none" stroke="yellow" strokeWidth="8" opacity="0.3"/>
            <path d="M 100 180 A 80 80 0 0 1 21 100" fill="none" stroke="red" strokeWidth="8" opacity="0.3"/>

            {/* Labels */}
            <text x="100" y="50" className="fill-green-400 text-xs font-bold text-center">Excellent</text>
            <text x="150" y="110" className="fill-yellow-400 text-xs font-bold text-center">Good</text>
            <text x="50" y="150" className="fill-red-400 text-xs font-bold text-center">Poor</text>

            {/* Needle */}
            <line x1="100" y1="100" x2={100 + 60 * Math.cos((current - 90) * Math.PI / 180)} y2={100 + 60 * Math.sin((current - 90) * Math.PI / 180)} stroke="white" strokeWidth="3"/>
            <circle cx="100" cy="100" r="8" fill="white"/>

            {/* Center value */}
            <text x="100" y="120" className="fill-white text-lg font-bold text-center">{current}%</text>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-yellow-300 font-semibold mb-4">Tracking Status</h4>
          <div className="space-y-3">
            <div>
              <p className="text-gray-300 text-sm mb-1">Real-time Efficiency</p>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full" style={{width: `${current}%`}}></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">MPPT algorithm continuously adjusts inverter impedance to extract maximum power from solar array. Efficiency typically >97% under normal conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Efficiency Comparison Chart
export function EfficiencyComparisonChart() {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-emerald-400 mb-6">Inverter Efficiency Comparison (European Rating)</h3>
      <svg viewBox="0 0 800 300" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Axes */}
        <line x1="80" y1="40" x2="80" y2="250" stroke="gray" strokeWidth="2"/>
        <line x1="80" y1="250" x2="750" y2="250" stroke="gray" strokeWidth="2"/>

        {/* Y-axis (Efficiency %) */}
        <text x="30" y="150" className="fill-gray-400 text-xs">Efficiency %</text>
        {[85, 90, 95, 97].map((val, i) => (
          <g key={i}>
            <line x1="75" y1={250 - (val - 85) * 30} x2="80" y2={250 - (val - 85) * 30} stroke="gray" strokeWidth="1"/>
            <text x="40" y={255 - (val - 85) * 30} className="fill-gray-400 text-xs text-right">{val}%</text>
          </g>
        ))}

        {/* X-axis (Load %) */}
        <text x="415" y="280" className="fill-gray-400 text-xs text-center">Load Percentage</text>
        {['10%', '25%', '50%', '75%', '100%'].map((load, i) => (
          <text key={i} x={120 + i * 130} y="270" className="fill-gray-400 text-xs text-center">{load}</text>
        ))}

        {/* Efficiency curves for different inverter types */}
        {/* Premium (SMA/Fronius) */}
        <polyline points="100,140 230,110 360,100 490,98 620,100" fill="none" stroke="#22c55e" strokeWidth="3"/>
        <text x="650" y="95" className="fill-green-400 text-xs font-bold">Premium (98.2%)</text>

        {/* High Quality (Huawei/GoodWe) */}
        <polyline points="100,150 230,125 360,110 490,105 620,110" fill="none" stroke="#3b82f6" strokeWidth="3"/>
        <text x="650" y="130" className="fill-blue-400 text-xs font-bold">High Quality (97.5%)</text>

        {/* Standard */}
        <polyline points="100,170 230,145 360,130 490,120 620,125" fill="none" stroke="#f59e0b" strokeWidth="3"/>
        <text x="650" y="160" className="fill-amber-400 text-xs font-bold">Standard (96.5%)</text>

        {/* Budget */}
        <polyline points="100,195 230,170 360,150 490,135 620,140" fill="none" stroke="#ef4444" strokeWidth="3"/>
        <text x="650" y="195" className="fill-red-400 text-xs font-bold">Budget (95%)</text>
      </svg>
      <p className="text-gray-300 text-sm mt-4">European efficiency rating averages performance across 10%, 25%, 50%, 75%, and 100% load points, providing a better real-world efficiency indicator than peak ratings.</p>
    </div>
  );
}

// Error Code Severity Matrix
export function ErrorCodeSeverityMatrix() {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-red-400 mb-6">Error Code Severity Classification</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-slate-700 px-4 py-2 text-left text-red-400">CRITICAL</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-yellow-400">WARNING</th>
              <th className="border border-slate-700 px-4 py-2 text-left text-blue-400">INFO</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-red-900/20">
              <td className="border border-slate-700 px-4 py-2">
                <span className="text-red-400 font-bold">E003, E004, E006</span>
                <p className="text-xs text-gray-300 mt-1">Grid voltage abnormal, frequency out of range, ground fault</p>
                <p className="text-xs text-gray-400 mt-1">⚠️ Immediate action required - risk of equipment damage</p>
              </td>
              <td className="border border-slate-700 px-4 py-2">
                <span className="text-yellow-400 font-bold">E001, E002, E005</span>
                <p className="text-xs text-gray-300 mt-1">Voltage out of range, temperature high</p>
                <p className="text-xs text-gray-400 mt-1">⚠️ Intervention recommended - monitoring suggested</p>
              </td>
              <td className="border border-slate-700 px-4 py-2">
                <span className="text-blue-400 font-bold">S002, S003, S004</span>
                <p className="text-xs text-gray-300 mt-1">Communication error, fan failure, data storage</p>
                <p className="text-xs text-gray-400 mt-1">ℹ️ Informational - minor or non-critical</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-red-900/20 rounded border border-red-700">
        <p className="text-red-300 text-sm"><strong>Response Guidance:</strong> Critical errors = stop inverter and call service engineer. Warning errors = log and monitor. Info errors = note for next scheduled maintenance.</p>
      </div>
    </div>
  );
}

// Annual Maintenance Timeline
export function MaintenanceTimeline() {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-purple-400 mb-6">Annual Maintenance Timeline</h3>
      <svg viewBox="0 0 800 250" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Timeline line */}
        <line x1="80" y1="120" x2="750" y2="120" stroke="purple" strokeWidth="2"/>

        {/* Months */}
        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, i) => {
          const x = 80 + i * 56;
          return (
            <g key={i}>
              <circle cx={x} cy="120" r="4" fill="purple"/>
              <text x={x} y="145" className="fill-gray-400 text-xs text-center">{month}</text>
            </g>
          );
        })}

        {/* Tasks */}
        <g>
          {/* Monthly visual inspection */}
          <rect x="85" y="60" width="650" height="20" fill="blue" opacity="0.3" rx="3"/>
          <text x="90" y="73" className="fill-blue-300 text-xs font-semibold">MONTHLY: Visual Inspection, Dust/Debris Check</text>
        </g>

        <g>
          {/* Quarterly cleaning */}
          <circle cx="200" cy="150" r="8" fill="green"/>
          <text x="200" y="185" className="fill-green-300 text-xs text-center font-semibold">Q1</text>
          <text x="180" y="210" className="fill-green-300 text-xs text-center">Panel Cleaning</text>
        </g>

        <g>
          {/* Mid-year filter check */}
          <circle cx="420" cy="150" r="8" fill="yellow"/>
          <text x="420" y="185" className="fill-yellow-300 text-xs text-center font-semibold">MID</text>
          <text x="400" y="210" className="fill-yellow-300 text-xs text-center">Filter Inspect</text>
        </g>

        <g>
          {/* Annual professional service */}
          <circle cx="640" cy="150" r="8" fill="red"/>
          <text x="640" y="185" className="fill-red-300 text-xs text-center font-semibold">ANN</text>
          <text x="620" y="210" className="fill-red-300 text-xs text-center">Pro Service</text>
        </g>
      </svg>
      <p className="text-gray-300 text-sm mt-4">Consistent maintenance prevents 80% of common inverter issues and extends system life by 5+ years.</p>
    </div>
  );
}

export default function TechnicalDiagrams() {
  return (
    <div className="space-y-8">
      <DCtoACCircuitDiagram />
      <TemperatureDeratingCurve />
      <MPPTEfficiencyGauge />
      <EfficiencyComparisonChart />
      <ErrorCodeSeverityMatrix />
      <MaintenanceTimeline />
    </div>
  );
}
