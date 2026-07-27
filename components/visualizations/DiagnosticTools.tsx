'use client';

import React, { useState } from 'react';

// Generator Diagnostic Flowchart
export function GeneratorDiagnosticFlowchart() {
  return (
    <svg viewBox="0 0 1000 1200" className="w-full max-w-5xl mx-auto bg-slate-950 rounded-lg p-4 border border-slate-800">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
        </marker>
      </defs>

      <text x="500" y="30" fontSize="22" fontWeight="bold" fill="#60a5fa" textAnchor="middle">
        Generator Troubleshooting Decision Tree
      </text>

      {/* Start */}
      <ellipse cx="500" cy="80" rx="60" ry="40" fill="#10b981" stroke="#10b981" strokeWidth="2" />
      <text x="500" y="85" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">START</text>

      <line x1="500" y1="120" x2="500" y2="160" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Problem Definition */}
      <rect x="350" y="160" width="300" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
      <text x="500" y="190" fontSize="13" fontWeight="bold" fill="#f59e0b" textAnchor="middle">Generator Problem</text>
      <text x="500" y="210" fontSize="11" fill="#94a3b8" textAnchor="middle">No output / Low power / Overheating / Noise</text>
      <text x="500" y="228" fontSize="10" fill="#94a3b8" textAnchor="middle">Black smoke / Won't start</text>

      <line x1="500" y1="240" x2="500" y2="280" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Fuel Check */}
      <rect x="300" y="280" width="400" height="80" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="5" />
      <text x="500" y="310" fontSize="12" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Step 1: Check Fuel System</text>
      <text x="500" y="330" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ Fuel tank level | ✓ Fuel quality (water contamination?)</text>
      <text x="500" y="348" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ Fuel lines clear | ✓ Injectors working</text>

      {/* Y/N branches */}
      <line x1="300" y1="360" x2="200" y2="400" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="240" y="375" fontSize="10" fontWeight="bold" fill="#ec4899">FUEL OK</text>

      <line x1="700" y1="360" x2="800" y2="400" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="750" y="375" fontSize="10" fontWeight="bold" fill="#ef4444">NO FUEL</text>

      {/* Fuel OK path */}
      <rect x="50" y="400" width="300" height="80" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="5" />
      <text x="200" y="425" fontSize="11" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Step 2: Check Ignition</text>
      <text x="200" y="445" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ Battery voltage (24V OK?)</text>
      <text x="200" y="463" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ Starter motor engages</text>

      <line x1="200" y1="480" x2="200" y2="520" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Engine Starts */}
      <rect x="50" y="520" width="300" height="80" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="5" />
      <text x="200" y="545" fontSize="11" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Step 3: Check Output</text>
      <text x="200" y="565" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ AC voltage at terminals (230V/380V)?</text>
      <text x="200" y="583" fontSize="10" fill="#94a3b8" textAnchor="middle">✓ Frequency normal (50Hz)?</text>

      <line x1="200" y1="600" x2="200" y2="640" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Output Check */}
      <ellipse cx="200" cy="690" rx="80" ry="40" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
      <text x="200" y="695" fontSize="11" fontWeight="bold" fill="#10b981" textAnchor="middle">OUTPUT OK</text>
      <text x="200" y="713" fontSize="9" fill="#94a3b8" textAnchor="middle">Ready to load</text>

      {/* No Fuel path */}
      <rect x="650" y="400" width="300" height="80" fill="#1e293b" stroke="#ef4444" strokeWidth="2" rx="5" />
      <text x="800" y="430" fontSize="11" fontWeight="bold" fill="#ef4444" textAnchor="middle">ACTION: Refuel Generator</text>
      <text x="800" y="450" fontSize="10" fill="#94a3b8" textAnchor="middle">• Use quality diesel (HSD)</text>
      <text x="800" y="468" fontSize="10" fill="#94a3b8" textAnchor="middle">• Check for water in tank</text>

      <line x1="800" y1="480" x2="800" y2="520" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />

      <ellipse cx="800" cy="570" rx="80" ry="40" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
      <text x="800" y="575" fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">RETRY START</text>

      {/* Advanced Diagnostics */}
      <rect x="50" y="800" width="900" height="350" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" rx="5" />
      <text x="60" y="825" fontSize="12" fontWeight="bold" fill="#10b981">Advanced Diagnostic Measurements (If Output Abnormal)</text>

      <g fill="#94a3b8" fontSize="10">
        <text x="70" y="855">1. VOLTAGE CHECK (should be 230V±10% or 380V±10%):</text>
        <text x="90" y="875">   • Above 260V: Voltage regulator fault (AVR malfunction) → Replace AVR module</text>
        <text x="90" y="895">   • Below 200V: Load exceeds capacity OR alternator winding problem → Reduce load or test alternator</text>

        <text x="70" y="925">2. FREQUENCY CHECK (should be 50Hz±1%):</text>
        <text x="90" y="945">   • High freq (51-52Hz): Governor not holding speed → Adjust governor, check RPM sensor</text>
        <text x="90" y="965">   • Low freq (48-49Hz): Engine load too high OR governor failure → Reduce load</text>

        <text x="70" y="995">3. FUEL CONSUMPTION (normal = 0.2-0.25 L/kWh):</text>
        <text x="90" y="1015">   • High (>0.3 L/kWh): Poor combustion, worn injectors, fuel quality issue → Service injectors</text>
        <text x="90" y="1035">   • Black smoke: Over-fueling → Adjust injectors, check fuel system pressure</text>

        <text x="70" y="1065">4. TEMPERATURE (normal = 75-85°C):</text>
        <text x="90" y="1085">   • Above 90°C: Cooling system issue, radiator blocked → Clean radiator, check coolant</text>
        <text x="90" y="1105">   • Below 60°C: Thermostat stuck, engine not reaching proper temp → Replace thermostat</text>

        <text x="70" y="1135">5. NOISE/VIBRATION (should be smooth 55-65dB):</text>
        <text x="90" y="1155">   • Loud knocking: Engine bearing wear → Professional inspection required</text>
        <text x="90" y="1175">   • High vibration: Fuel alignment issue, worn mounts → Check fuel injection, inspect mounts</text>
      </g>

      {/* Service Recommendation */}
      <rect x="50" y="1170" width="900" height="50" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
      <text x="500" y="1195" fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">
        If any measurement is abnormal, contact EmersonEIMS (+254 768 860 665) for professional service
      </text>
    </svg>
  );
}

// Efficiency Gauge Component
export function EfficiencyGauge({ current = 85, optimal = 90 }: { current?: number; optimal?: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="200" height="220" viewBox="0 0 200 220" className="drop-shadow-lg">
        {/* Background Arc */}
        <path d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

        {/* Red Zone (60-70) */}
        <path d="M 30 100 A 70 70 0 0 1 53 38" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />

        {/* Yellow Zone (70-85) */}
        <path d="M 53 38 A 70 70 0 0 1 105 22" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />

        {/* Green Zone (85-95) */}
        <path d="M 105 22 A 70 70 0 0 1 170 100" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />

        {/* Center circle */}
        <circle cx="100" cy="100" r="50" fill="#1e293b" stroke="#475569" strokeWidth="2" />

        {/* Needle */}
        <g>
          <line
            x1="100"
            y1="100"
            x2={100 + 50 * Math.sin((current - 60) * 2.4 * Math.PI / 180)}
            y2={100 - 50 * Math.cos((current - 60) * 2.4 * Math.PI / 180)}
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="#60a5fa" />
        </g>

        {/* Text labels */}
        <text x="40" y="180" fontSize="12" fontWeight="bold" fill="#ef4444" textAnchor="middle">Poor</text>
        <text x="100" y="195" fontSize="12" fontWeight="bold" fill="#f59e0b" textAnchor="middle">Fair</text>
        <text x="160" y="180" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle">Optimal</text>

        {/* Center value */}
        <text x="100" y="105" fontSize="24" fontWeight="bold" fill="#60a5fa" textAnchor="middle">{current}%</text>
        <text x="100" y="125" fontSize="11" fill="#94a3b8" textAnchor="middle">Current Efficiency</text>
      </svg>

      <div className="text-center text-sm">
        <p className="text-gray-400">Optimal Range: <span className="text-green-400 font-bold">{optimal}%+</span></p>
        {current >= optimal ? (
          <p className="text-green-400 font-semibold mt-2">✓ System operating efficiently</p>
        ) : (
          <p className="text-yellow-400 font-semibold mt-2">⚠ Maintenance recommended</p>
        )}
      </div>
    </div>
  );
}

// Component Status Dashboard
export function ComponentStatusDashboard() {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const components = [
    {
      name: 'Alternator',
      status: 'healthy',
      details: 'Output: 380V, 50Hz, 92% efficiency',
      lastService: '180 days ago'
    },
    {
      name: 'Voltage Regulator (AVR)',
      status: 'healthy',
      details: 'Voltage stable ±2%, Response time <100ms',
      lastService: '300 days ago'
    },
    {
      name: 'Governor',
      status: 'warning',
      details: 'Frequency variation ±0.8Hz (should be <0.5Hz)',
      lastService: '600 days ago - Due for inspection'
    },
    {
      name: 'Diesel Engine',
      status: 'healthy',
      details: 'Temperature: 82°C, Oil pressure: 3.2 bar, Fuel consumption: 0.22 L/kWh',
      lastService: '120 days ago'
    },
    {
      name: 'Cooling System',
      status: 'warning',
      details: 'Radiator blocked by 30% - Clean immediately',
      lastService: 'Never'
    },
    {
      name: 'Battery & Charger',
      status: 'healthy',
      details: 'Voltage: 24.8V, Charging current: 8A, All cells healthy',
      lastService: '90 days ago'
    },
  ];

  return (
    <div className="space-y-3">
      {components.map((component, idx) => (
        <div
          key={idx}
          className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setExpandedComponent(expandedComponent === idx.toString() ? null : idx.toString())}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  component.status === 'healthy'
                    ? 'bg-green-500'
                    : component.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="font-semibold text-white">{component.name}</span>
            </div>
            <span className={`text-sm font-bold ${
              component.status === 'healthy'
                ? 'text-green-400'
                : component.status === 'warning'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {component.status.toUpperCase()}
            </span>
          </button>

          {expandedComponent === idx.toString() && (
            <div className="px-4 pb-4 border-t border-slate-800 pt-4 bg-slate-950/50">
              <p className="text-sm text-gray-400 mb-2">{component.details}</p>
              <p className="text-xs text-gray-500">Last Service: {component.lastService}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default { GeneratorDiagnosticFlowchart, EfficiencyGauge, ComponentStatusDashboard };
