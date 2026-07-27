'use client';

import React from 'react';

// Generator Schematic
export function GeneratorSchematic() {
  return (
    <svg viewBox="0 0 800 500" className="w-full max-w-4xl mx-auto bg-slate-950 rounded-lg p-4 border border-slate-800">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
        </marker>
      </defs>

      {/* Title */}
      <text x="400" y="30" fontSize="24" fontWeight="bold" fill="#60a5fa" textAnchor="middle">
        Diesel Generator Power Flow Diagram
      </text>

      {/* Diesel Engine */}
      <rect x="50" y="100" width="120" height="80" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="5" />
      <text x="110" y="150" fontSize="14" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Diesel Engine</text>
      <text x="110" y="170" fontSize="11" fill="#94a3b8" textAnchor="middle">(Prime Mover)</text>

      {/* Alternator */}
      <circle cx="280" cy="140" r="50" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
      <text x="280" y="145" fontSize="13" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Alternator</text>
      <text x="280" y="162" fontSize="10" fill="#94a3b8" textAnchor="middle">AC Gen</text>

      {/* Engine to Alternator Arrow */}
      <line x1="170" y1="140" x2="230" y2="140" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="200" y="130" fontSize="10" fill="#94a3b8" textAnchor="middle">Mechanical Power</text>

      {/* Control Panel */}
      <rect x="380" y="80" width="140" height="120" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="5" />
      <text x="450" y="105" fontSize="13" fontWeight="bold" fill="#10b981" textAnchor="middle">Control Panel</text>
      <circle cx="420" cy="140" r="8" fill="#f59e0b" />
      <text x="435" y="145" fontSize="10" fill="#94a3b8">Voltage Reg</text>
      <circle cx="420" cy="165" r="8" fill="#f59e0b" />
      <text x="435" y="170" fontSize="10" fill="#94a3b8">Governor</text>
      <circle cx="480" cy="140" r="8" fill="#f59e0b" />
      <text x="495" y="145" fontSize="10" fill="#94a3b8">Protection</text>
      <circle cx="480" cy="165" r="8" fill="#f59e0b" />
      <text x="495" y="170" fontSize="10" fill="#94a3b8">Monitoring</text>

      {/* Alternator to Control */}
      <line x1="330" y1="140" x2="380" y2="140" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Rectifier/Battery Charger */}
      <rect x="580" y="100" width="120" height="80" fill="#1e293b" stroke="#ec4899" strokeWidth="2" rx="5" />
      <text x="640" y="150" fontSize="13" fontWeight="bold" fill="#ec4899" textAnchor="middle">Battery Charger</text>
      <text x="640" y="167" fontSize="10" fill="#94a3b8" textAnchor="middle">(Rectifier)</text>

      {/* Control to Rectifier */}
      <line x1="520" y1="140" x2="580" y2="140" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="550" y="125" fontSize="9" fill="#94a3b8" textAnchor="middle">Control Signal</text>

      {/* Battery */}
      <rect x="50" y="250" width="100" height="80" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" rx="5" />
      <text x="100" y="290" fontSize="13" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">Battery Bank</text>
      <text x="100" y="310" fontSize="10" fill="#94a3b8" textAnchor="middle">(24V/48V)</text>

      {/* Rectifier to Battery */}
      <line x1="100" y1="180" x2="100" y2="250" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="75" y="215" fontSize="10" fill="#94a3b8">DC Charging</text>

      {/* AC Output */}
      <rect x="380" y="280" width="140" height="100" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="450" y="310" fontSize="13" fontWeight="bold" fill="#06b6d4" textAnchor="middle">AC Output</text>
      <text x="450" y="335" fontSize="11" fill="#94a3b8" textAnchor="middle">230V/380V</text>
      <text x="450" y="355" fontSize="10" fill="#94a3b8" textAnchor="middle">50Hz/60Hz</text>
      <text x="450" y="372" fontSize="10" fill="#94a3b8" textAnchor="middle">3-Phase or Single</text>

      {/* Alternator to AC Output */}
      <path d="M 280 190 Q 350 250 380 330" stroke="#06b6d4" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
      <text x="320" y="240" fontSize="10" fill="#94a3b8">AC Power</text>

      {/* Load Panel */}
      <rect x="580" y="280" width="140" height="100" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" rx="5" />
      <text x="650" y="315" fontSize="13" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Connected Loads</text>
      <text x="650" y="340" fontSize="10" fill="#94a3b8" textAnchor="middle">• Motors</text>
      <text x="650" y="358" fontSize="10" fill="#94a3b8" textAnchor="middle">• Lighting</text>
      <text x="650" y="376" fontSize="10" fill="#94a3b8" textAnchor="middle">• Electronics</text>

      {/* AC Output to Load */}
      <line x1="520" y1="330" x2="580" y2="330" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="550" y="315" fontSize="10" fill="#94a3b8" textAnchor="middle">Power Delivery</text>

      {/* Fuel Tank */}
      <ellipse cx="110" cy="420" rx="60" ry="40" fill="#1e293b" stroke="#14b8a6" strokeWidth="2" />
      <text x="110" y="420" fontSize="12" fontWeight="bold" fill="#14b8a6" textAnchor="middle">Fuel Tank</text>
      <text x="110" y="438" fontSize="9" fill="#94a3b8" textAnchor="middle">Diesel/HSD</text>

      {/* Fuel line */}
      <line x1="110" y1="380" x2="110" y2="220" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="70" y="300" fontSize="10" fill="#94a3b8">Fuel Supply</text>

      {/* Cooling System */}
      <rect x="250" y="400" width="120" height="60" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="310" y="432" fontSize="12" fontWeight="bold" fill="#06b6d4" textAnchor="middle">Cooling System</text>
      <line x1="110" y1="180" x2="310" y2="430" stroke="#06b6d4" strokeWidth="1" strokeDasharray="5,5" />
      <text x="200" y="300" fontSize="9" fill="#94a3b8">Heat Removal</text>
    </svg>
  );
}

// UPS System Schematic
export function UPSSchematic() {
  return (
    <svg viewBox="0 0 900 550" className="w-full max-w-4xl mx-auto bg-slate-950 rounded-lg p-4 border border-slate-800">
      <text x="450" y="30" fontSize="24" fontWeight="bold" fill="#60a5fa" textAnchor="middle">
        UPS System Architecture (Online Double-Conversion)
      </text>

      <defs>
        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
        </marker>
      </defs>

      {/* AC Mains Input */}
      <rect x="30" y="80" width="110" height="80" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" rx="5" />
      <text x="85" y="130" fontSize="12" fontWeight="bold" fill="#fbbf24" textAnchor="middle">AC Mains</text>
      <text x="85" y="150" fontSize="10" fill="#94a3b8" textAnchor="middle">230V/380V</text>

      {/* Rectifier */}
      <rect x="200" y="80" width="100" height="80" fill="#1e293b" stroke="#ec4899" strokeWidth="2" rx="5" />
      <text x="250" y="115" fontSize="12" fontWeight="bold" fill="#ec4899" textAnchor="middle">Rectifier</text>
      <text x="250" y="135" fontSize="10" fill="#94a3b8" textAnchor="middle">AC→DC</text>

      <line x1="140" y1="120" x2="200" y2="120" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* DC Bus */}
      <rect x="200" y="200" width="100" height="50" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" rx="5" />
      <text x="250" y="235" fontSize="11" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">DC Bus (400V)</text>

      <line x1="250" y1="160" x2="250" y2="200" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Inverter */}
      <rect x="380" y="80" width="100" height="80" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="5" />
      <text x="430" y="115" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle">Inverter</text>
      <text x="430" y="135" fontSize="10" fill="#94a3b8" textAnchor="middle">DC→AC</text>

      <line x1="300" y1="120" x2="380" y2="120" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Battery Charger */}
      <rect x="380" y="200" width="100" height="50" fill="#1e293b" stroke="#ec4899" strokeWidth="2" rx="5" />
      <text x="430" y="235" fontSize="11" fontWeight="bold" fill="#ec4899" textAnchor="middle">Charger (24V)</text>

      <line x1="300" y1="225" x2="380" y2="225" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Battery Bank */}
      <rect x="380" y="310" width="100" height="80" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" rx="5" />
      <text x="430" y="350" fontSize="12" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">Battery Bank</text>
      <text x="430" y="370" fontSize="10" fill="#94a3b8" textAnchor="middle">Lead-Acid/Lithium</text>

      <line x1="430" y1="250" x2="430" y2="310" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Static Transfer Switch */}
      <rect x="560" y="100" width="100" height="60" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
      <text x="610" y="138" fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">STS (Transfer)</text>

      <line x1="480" y1="120" x2="560" y2="120" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-blue)" />
      <text x="515" y="105" fontSize="9" fill="#94a3b8">Inverter AC</text>

      <line x1="140" y1="120" x2="560" y2="140" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow-blue)" />
      <text x="300" y="105" fontSize="9" fill="#94a3b8">Bypass Path (Mains)</text>

      {/* Output Transformer */}
      <rect x="720" y="100" width="100" height="60" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="770" y="135" fontSize="11" fontWeight="bold" fill="#06b6d4" textAnchor="middle">Isolation Xfmr</text>

      <line x1="660" y1="130" x2="720" y2="130" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Load Output */}
      <rect x="720" y="200" width="100" height="80" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" rx="5" />
      <text x="770" y="240" fontSize="12" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Load</text>
      <text x="770" y="260" fontSize="10" fill="#94a3b8" textAnchor="middle">230V/380V</text>
      <text x="770" y="280" fontSize="10" fill="#94a3b8" textAnchor="middle">50Hz/60Hz</text>

      <line x1="770" y1="160" x2="770" y2="200" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-blue)" />

      {/* Control Logic Box */}
      <rect x="30" y="310" width="140" height="120" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="5" />
      <text x="100" y="330" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle">Control Logic</text>
      <circle cx="55" cy="360" r="6" fill="#f59e0b" />
      <text x="70" y="365" fontSize="9" fill="#94a3b8">Voltage Sensing</text>
      <circle cx="55" cy="385" r="6" fill="#f59e0b" />
      <text x="70" y="390" fontSize="9" fill="#94a3b8">Freq Monitoring</text>
      <circle cx="55" cy="410" r="6" fill="#f59e0b" />
      <text x="70" y="415" fontSize="9" fill="#94a3b8">Load Tracking</text>

      {/* Monitoring Display */}
      <rect x="30" y="460" width="140" height="70" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="100" y="485" fontSize="11" fontWeight="bold" fill="#06b6d4" textAnchor="middle">Monitoring</text>
      <text x="100" y="505" fontSize="9" fill="#94a3b8" textAnchor="middle">• Input Voltage</text>
      <text x="100" y="520" fontSize="9" fill="#94a3b8" textAnchor="middle">• Battery Status</text>

      {/* Information boxes */}
      <rect x="200" y="430" width="280" height="100" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" rx="3" />
      <text x="210" y="450" fontSize="11" fontWeight="bold" fill="#10b981">Online UPS Key Features:</text>
      <text x="215" y="470" fontSize="9" fill="#94a3b8">✓ Continuous inverter operation isolates load from disturbances</text>
      <text x="215" y="487" fontSize="9" fill="#94a3b8">✓ Zero transfer time: seamless battery switchover</text>
      <text x="215" y="504" fontSize="9" fill="#94a3b8">✓ Protects against sags, surges, harmonics, frequency variations</text>
      <text x="215" y="521" fontSize="9" fill="#94a3b8">✓ Best protection but 92-94% efficiency (vs 85-88% standby)</text>
    </svg>
  );
}

// Solar Inverter Schematic
export function SolarInverterSchematic() {
  return (
    <svg viewBox="0 0 900 500" className="w-full max-w-4xl mx-auto bg-slate-950 rounded-lg p-4 border border-slate-800">
      <text x="450" y="30" fontSize="24" fontWeight="bold" fill="#fbbf24" textAnchor="middle">
        Solar PV System with MPPT Inverter
      </text>

      <defs>
        <marker id="arrow-sun" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Sun */}
      <circle cx="80" cy="80" r="40" fill="#fbbf24" opacity="0.3" />
      <text x="80" y="85" fontSize="28" textAnchor="middle">☀️</text>

      {/* Solar Panels */}
      <rect x="30" y="150" width="100" height="100" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" rx="5" />
      <text x="80" y="200" fontSize="12" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Solar Array</text>
      <text x="80" y="220" fontSize="10" fill="#94a3b8" textAnchor="middle">400-500Vdc</text>
      <text x="80" y="235" fontSize="9" fill="#94a3b8" textAnchor="middle">10-50 kW</text>

      <line x1="80" y1="120" x2="80" y2="150" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-sun)" />

      {/* DC Combiner/Breaker */}
      <rect x="180" y="150" width="90" height="100" fill="#1e293b" stroke="#ec4899" strokeWidth="2" rx="5" />
      <text x="225" y="190" fontSize="11" fontWeight="bold" fill="#ec4899" textAnchor="middle">DC Combiner</text>
      <text x="225" y="210" fontSize="10" fill="#94a3b8" textAnchor="middle">& Breaker</text>
      <text x="225" y="228" fontSize="9" fill="#94a3b8" textAnchor="middle">Series/Parallel</text>

      <line x1="130" y1="200" x2="180" y2="200" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-sun)" />

      {/* MPPT Tracker */}
      <rect x="320" y="150" width="100" height="60" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="5" />
      <text x="370" y="185" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle">MPPT Tracker</text>

      <line x1="270" y1="200" x2="320" y2="180" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow-sun)" />
      <text x="290" y="185" fontSize="9" fill="#94a3b8">Voltage Matching</text>

      {/* Battery Storage (Optional) */}
      <rect x="320" y="250" width="100" height="70" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" rx="5" />
      <text x="370" y="285" fontSize="11" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">Battery Storage</text>
      <text x="370" y="305" fontSize="9" fill="#94a3b8" textAnchor="middle">(Optional)</text>

      {/* Inverter */}
      <rect x="480" y="150" width="100" height="100" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="530" y="190" fontSize="12" fontWeight="bold" fill="#06b6d4" textAnchor="middle">Inverter</text>
      <text x="530" y="210" fontSize="10" fill="#94a3b8" textAnchor="middle">DC → AC</text>
      <text x="530" y="228" fontSize="9" fill="#94a3b8" textAnchor="middle">3-phase 380V</text>

      <line x1="420" y1="180" x2="480" y2="180" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-sun)" />
      <text x="450" y="165" fontSize="9" fill="#94a3b8" textAnchor="middle">MPPT Voltage</text>

      <line x1="370" y1="250" x2="530" y2="220" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow-sun)" />
      <text x="430" y="235" fontSize="9" fill="#94a3b8">Battery Support</text>

      {/* Grid/Load */}
      <rect x="640" y="150" width="100" height="100" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" rx="5" />
      <text x="690" y="190" fontSize="12" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Grid/Load</text>
      <text x="690" y="210" fontSize="10" fill="#94a3b8" textAnchor="middle">230V/380V</text>
      <text x="690" y="228" fontSize="9" fill="#94a3b8" textAnchor="middle">50Hz</text>

      <line x1="580" y1="200" x2="640" y2="200" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-sun)" />

      {/* Disconnects & Protection */}
      <rect x="480" y="310" width="180" height="100" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
      <text x="570" y="330" fontSize="12" fontWeight="bold" fill="#f59e0b" textAnchor="middle">Protection & Safety</text>
      <circle cx="510" cy="360" r="5" fill="#f59e0b" />
      <text x="530" y="365" fontSize="9" fill="#94a3b8">DC Disconnect Switch</text>
      <circle cx="510" cy="385" r="5" fill="#f59e0b" />
      <text x="530" y="390" fontSize="9" fill="#94a3b8">AC Breaker & RCD</text>
      <circle cx="510" cy="410" r="5" fill="#f59e0b" />
      <text x="530" y="415" fontSize="9" fill="#94a3b8">SPD Surge Protection</text>

      {/* Monitoring */}
      <rect x="30" y="310" width="140" height="100" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" rx="5" />
      <text x="100" y="330" fontSize="11" fontWeight="bold" fill="#06b6d4" textAnchor="middle">Monitoring Display</text>
      <text x="100" y="352" fontSize="9" fill="#94a3b8" textAnchor="middle">• Real-time Power (kW)</text>
      <text x="100" y="370" fontSize="9" fill="#94a3b8" textAnchor="middle">• Daily Energy (kWh)</text>
      <text x="100" y="388" fontSize="9" fill="#94a3b8" textAnchor="middle">• Temperature</text>
      <text x="100" y="406" fontSize="9" fill="#94a3b8" textAnchor="middle">• Inverter Status</text>

      {/* Performance Info */}
      <rect x="200" y="310" width="260" height="100" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" rx="3" />
      <text x="210" y="330" fontSize="11" fontWeight="bold" fill="#10b981">MPPT Efficiency Benefits:</text>
      <text x="215" y="350" fontSize="9" fill="#94a3b8">✓ Tracks optimal voltage continuously (changes with temperature/irradiance)</text>
      <text x="215" y="368" fontSize="9" fill="#94a3b8">✓ 98-99% efficiency: losses only 1-2% vs 15-25% without MPPT</text>
      <text x="215" y="386" fontSize="9" fill="#94a3b8">✓ String voltage can be 2-4× higher than load: more power, less current loss</text>
      <text x="215" y="404" fontSize="9" fill="#94a3b8">✓ Enables series connection of 10-20 panels instead of parallel</text>
    </svg>
  );
}

export default { GeneratorSchematic, UPSSchematic, SolarInverterSchematic };
