'use client';

import { motion } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════
// ELECTRICAL SYMBOL LIBRARY (Standard IEC/IEEE Symbols)
// ════════════════════════════════════════════════════════════════════════

export function ElectricalSymbolsReference() {
  return (
    <div className="bg-slate-900/50 border border-cyan-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-cyan-400 mb-6">Electrical Components & Symbols (IEC Standards)</h3>
      <svg viewBox="0 0 1000 600" className="w-full h-auto bg-black/30 rounded p-4">
        {/* Row 1: Power Components */}
        <text x="20" y="40" className="fill-yellow-400 text-sm font-bold">Power Components</text>

        {/* AC Source */}
        <circle cx="80" cy="100" r="15" fill="none" stroke="yellow" strokeWidth="2"/>
        <path d="M 70 100 Q 75 110 80 100 Q 85 90 90 100" fill="none" stroke="yellow" strokeWidth="2"/>
        <text x="60" y="135" className="fill-gray-300 text-xs text-center">AC Source</text>

        {/* DC Source */}
        <circle cx="160" cy="100" r="15" fill="none" stroke="yellow" strokeWidth="2"/>
        <line x1="155" y1="85" x2="155" y2="115" stroke="yellow" strokeWidth="2"/>
        <line x1="165" y1="90" x2="165" y2="110" stroke="yellow" strokeWidth="2"/>
        <text x="145" y="135" className="fill-gray-300 text-xs text-center">DC Source</text>

        {/* Resistor */}
        <rect x="220" y="90" width="40" height="20" fill="none" stroke="green" strokeWidth="2"/>
        <text x="210" y="135" className="fill-gray-300 text-xs text-center">Resistor</text>

        {/* Capacitor */}
        <line x1="280" y1="85" x2="280" y2="115" stroke="green" strokeWidth="2"/>
        <line x1="300" y1="85" x2="300" y2="115" stroke="green" strokeWidth="2"/>
        <text x="275" y="135" className="fill-gray-300 text-xs text-center">Capacitor</text>

        {/* Inductor */}
        <path d="M 340 100 Q 350 85 360 100 Q 370 115 380 100" fill="none" stroke="green" strokeWidth="2"/>
        <text x="340" y="135" className="fill-gray-300 text-xs text-center">Inductor</text>

        {/* Diode */}
        <line x1="410" y1="85" x2="410" y2="115" stroke="blue" strokeWidth="2"/>
        <polygon points="420,85 420,115 400,100" fill="none" stroke="blue" strokeWidth="2"/>
        <text x="405" y="135" className="fill-gray-300 text-xs text-center">Diode</text>

        {/* LED */}
        <polygon points="490,85 490,115 470,100" fill="none" stroke="red" strokeWidth="2"/>
        <line x1="490" y1="85" x2="490" y2="115" stroke="red" strokeWidth="2"/>
        <line x1="500" y1="80" x2="510" y2="70" stroke="red" strokeWidth="1"/>
        <line x1="510" y1="80" x2="520" y2="70" stroke="red" strokeWidth="1"/>
        <text x="485" y="135" className="fill-gray-300 text-xs text-center">LED</text>

        {/* Transistor (NPN) */}
        <line x1="560" y1="85" x2="560" y2="115" stroke="purple" strokeWidth="2"/>
        <line x1="545" y1="100" x2="560" y2="100" stroke="purple" strokeWidth="2"/>
        <line x1="560" y1="100" x2="575" y2="85" stroke="purple" strokeWidth="2"/>
        <line x1="560" y1="100" x2="575" y2="115" stroke="purple" strokeWidth="2"/>
        <text x="545" y="135" className="fill-gray-300 text-xs text-center">Transistor</text>

        {/* Switch */}
        <circle cx="620" cy="85" r="4" fill="purple"/>
        <line x1="624" y1="85" x2="640" y2="115" stroke="purple" strokeWidth="2"/>
        <line x1="640" y1="115" x2="650" y2="115" stroke="purple" strokeWidth="2"/>
        <circle cx="650" cy="115" r="4" fill="purple"/>
        <text x="615" y="135" className="fill-gray-300 text-xs text-center">Switch</text>

        {/* Row 2: Control Components */}
        <text x="20" y="200" className="fill-cyan-400 text-sm font-bold">Control & Protection</text>

        {/* Relay */}
        <rect x="60" y="220" width="30" height="30" fill="none" stroke="orange" strokeWidth="2"/>
        <text x="62" y="240" className="fill-orange-300 text-xs text-center">K</text>
        <line x1="90" y1="230" x2="110" y2="230" stroke="orange" strokeWidth="2"/>
        <line x1="110" y1="220" x2="130" y2="240" stroke="orange" strokeWidth="2"/>
        <line x1="130" y1="240" x2="140" y2="240" stroke="orange" strokeWidth="2"/>
        <text x="75" y="270" className="fill-gray-300 text-xs text-center">Relay</text>

        {/* Contactor */}
        <rect x="160" y="220" width="30" height="30" fill="none" stroke="orange" strokeWidth="2"/>
        <text x="162" y="240" className="fill-orange-300 text-xs text-center">C</text>
        <line x1="90" y1="235" x2="160" y2="235" stroke="orange" strokeWidth="1"/>
        <text x="175" y="270" className="fill-gray-300 text-xs text-center">Contactor</text>

        {/* Circuit Breaker */}
        <rect x="250" y="220" width="30" height="30" fill="none" stroke="red" strokeWidth="2"/>
        <line x1="250" y1="225" x2="240" y2="220" stroke="red" strokeWidth="2"/>
        <text x="255" y="270" className="fill-gray-300 text-xs text-center">CB</text>

        {/* Fuse */}
        <rect x="320" y="228" width="20" height="14" fill="none" stroke="yellow" strokeWidth="2"/>
        <circle cx="330" cy="235" r="3" fill="yellow"/>
        <text x="315" y="270" className="fill-gray-300 text-xs text-center">Fuse</text>

        {/* Motor */}
        <circle cx="390" cy="235" r="15" fill="none" stroke="green" strokeWidth="2"/>
        <text x="385" y="242" className="fill-green-400 text-sm font-bold">M</text>
        <text x="375" y="270" className="fill-gray-300 text-xs text-center">Motor</text>

        {/* Transformer */}
        <circle cx="450" cy="215" r="8" fill="none" stroke="blue" strokeWidth="2"/>
        <circle cx="470" cy="215" r="8" fill="none" stroke="blue" strokeWidth="2"/>
        <line x1="450" y1="223" x2="470" y2="223" stroke="blue" strokeWidth="1"/>
        <text x="440" y="270" className="fill-gray-300 text-xs text-center">Transform</text>

        {/* Ground Symbol */}
        <line x1="530" y1="215" x2="530" y2="235" stroke="green" strokeWidth="2"/>
        <line x1="520" y1="235" x2="540" y2="235" stroke="green" strokeWidth="2"/>
        <line x1="525" y1="245" x2="535" y2="245" stroke="green" strokeWidth="2"/>
        <line x1="528" y1="253" x2="532" y2="253" stroke="green" strokeWidth="2"/>
        <text x="515" y="270" className="fill-gray-300 text-xs text-center">Ground</text>

        {/* Row 3: Integrated Circuits */}
        <text x="20" y="320" className="fill-purple-400 text-sm font-bold">Integrated Circuits & ICs</text>

        {/* IC Chip */}
        <rect x="60" y="340" width="60" height="50" fill="none" stroke="purple" strokeWidth="2"/>
        <circle cx="65" cy="345" r="3" fill="purple"/>
        <text x="70" y="372" className="fill-purple-300 text-xs text-center">IC1</text>
        <line x1="45" y1="355" x2="60" y2="355" stroke="purple" strokeWidth="1"/>
        <line x1="45" y1="365" x2="60" y2="365" stroke="purple" strokeWidth="1"/>
        <line x1="120" y1="355" x2="135" y2="355" stroke="purple" strokeWidth="1"/>
        <line x1="120" y1="365" x2="135" y2="365" stroke="purple" strokeWidth="1"/>
        <text x="55" y="415" className="fill-gray-300 text-xs text-center">MCU/IC</text>

        {/* Microcontroller */}
        <text x="180" y="340" className="fill-gray-300 text-xs">Microcontroller</text>
        <text x="180" y="355" className="fill-cyan-300 text-xs">• STM32 ARM</text>
        <text x="180" y="370" className="fill-cyan-300 text-xs">• PIC16/18/24</text>
        <text x="180" y="385" className="fill-cyan-300 text-xs">• Arduino</text>

        {/* Operational Amplifier */}
        <text x="350" y="340" className="fill-gray-300 text-xs">Op-Amp (TL072)</text>
        <text x="350" y="355" className="fill-green-300 text-xs">• Input Stage</text>
        <text x="350" y="370" className="fill-green-300 text-xs">• Gain Control</text>
        <text x="350" y="385" className="fill-green-300 text-xs">• Output Driver</text>

        {/* Power IC */}
        <text x="550" y="340" className="fill-gray-300 text-xs">Power IC (LM7812)</text>
        <text x="550" y="355" className="fill-yellow-300 text-xs">• Voltage Regulator</text>
        <text x="550" y="370" className="fill-yellow-300 text-xs">• Current Source</text>
        <text x="550" y="385" className="fill-yellow-300 text-xs">• Protection</text>

        {/* Connection Labels */}
        <rect x="20" y="450" width="900" height="120" fill="blue" opacity="0.05" rx="5"/>
        <text x="40" y="475" className="fill-blue-300 text-xs font-bold">Common Connection Styles:</text>
        <text x="40" y="495" className="fill-gray-300 text-xs">• Wire Connection (solid line) = electrical connection</text>
        <text x="40" y="510" className="fill-gray-300 text-xs">• Node (dot at intersection) = multiple connections meet</text>
        <text x="40" y="525" className="fill-gray-300 text-xs">• Crossing wires (arc bridge) = no electrical connection</text>
        <text x="40" y="540" className="fill-gray-300 text-xs">• Bus (thick line) = multiple signals on same conductor</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SOLAR INVERTER POWER STAGE SCHEMATIC
// ════════════════════════════════════════════════════════════════════════

export function InverterPowerStageSchemematic() {
  return (
    <div className="bg-slate-900/50 border border-yellow-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-yellow-400 mb-6">Solar Inverter Power Stage Schematic</h3>
      <svg viewBox="0 0 1000 400" className="w-full h-auto bg-black/30 rounded p-4">
        {/* DC Input */}
        <text x="20" y="50" className="fill-yellow-400 text-sm font-bold">DC Input (400V)</text>
        <line x1="50" y1="60" x2="50" y2="120" stroke="yellow" strokeWidth="3"/>
        <circle cx="50" cy="130" r="8" fill="yellow"/>
        <text x="30" y="160" className="fill-gray-300 text-xs text-center">+400V DC</text>

        {/* DC Capacitor Bank */}
        <text x="140" y="50" className="fill-gray-300 text-xs">Bulk Cap Bank</text>
        <line x1="160" y1="60" x2="160" y2="80" stroke="yellow" strokeWidth="2"/>
        <line x1="150" y1="80" x2="170" y2="80" stroke="yellow" strokeWidth="2"/>
        <line x1="150" y1="90" x2="170" y2="90" stroke="yellow" strokeWidth="2"/>
        <line x1="160" y1="90" x2="160" y2="120" stroke="yellow" strokeWidth="2"/>
        <text x="140" y="160" className="fill-gray-300 text-xs text-center">2200µF</text>

        {/* Gate Driver Circuit */}
        <rect x="280" y="60" width="80" height="60" fill="none" stroke="purple" strokeWidth="2"/>
        <text x="295" y="95" className="fill-purple-400 text-xs text-center">Gate</text>
        <text x="295" y="108" className="fill-purple-400 text-xs text-center">Driver</text>
        <text x="270" y="150" className="fill-gray-300 text-xs text-center">IR2110</text>

        {/* Power MOSFET Bridge */}
        <text x="420" y="50" className="fill-gray-300 text-xs">3-Phase</text>
        <text x="410" y="65" className="fill-gray-300 text-xs">IGBT Bridge</text>

        {/* Phase A */}
        <rect x="420" y="80" width="50" height="20" fill="none" stroke="red" strokeWidth="2"/>
        <text x="430" y="95" className="fill-red-400 text-xs">IGBT</text>
        <text x="485" y="95" className="fill-gray-300 text-xs">Phase A</text>

        {/* Phase B */}
        <rect x="420" y="110" width="50" height="20" fill="none" stroke="green" strokeWidth="2"/>
        <text x="430" y="125" className="fill-green-400 text-xs">IGBT</text>
        <text x="485" y="125" className="fill-gray-300 text-xs">Phase B</text>

        {/* Phase C */}
        <rect x="420" y="140" width="50" height="20" fill="none" stroke="blue" strokeWidth="2"/>
        <text x="430" y="155" className="fill-blue-400 text-xs">IGBT</text>
        <text x="485" y="155" className="fill-gray-300 text-xs">Phase C</text>

        {/* Freewheeling Diodes */}
        <polygon points="485,80 485,100 475,90" fill="none" stroke="red" strokeWidth="1"/>
        <polygon points="485,110 485,130 475,120" fill="none" stroke="green" strokeWidth="1"/>
        <polygon points="485,140 485,160 475,150" fill="none" stroke="blue" strokeWidth="1"/>

        {/* LC Filter */}
        <text x="600" y="50" className="fill-gray-300 text-xs">LC Filter</text>
        <text x="600" y="65" className="fill-gray-300 text-xs">3Ω @ 16kHz</text>

        {/* Inductor */}
        <path d="M 630 90 Q 640 75 650 90 Q 660 105 670 90" fill="none" stroke="green" strokeWidth="2"/>
        <text x="625" y="130" className="fill-gray-300 text-xs text-center">500µH</text>

        {/* Capacitor */}
        <line x1="710" y1="85" x2="710" y2="115" stroke="green" strokeWidth="2"/>
        <line x1="730" y1="85" x2="730" y2="115" stroke="green" strokeWidth="2"/>
        <text x="705" y="140" className="fill-gray-300 text-xs text-center">10µF</text>

        {/* AC Output */}
        <text x="800" y="50" className="fill-emerald-400 text-sm font-bold">AC Output</text>
        <line x1="820" y1="90" x2="850" y2="90" stroke="emerald" strokeWidth="2"/>
        <line x1="820" y1="100" x2="850" y2="100" stroke="emerald" strokeWidth="2"/>
        <line x1="820" y1="110" x2="850" y2="110" stroke="emerald" strokeWidth="2"/>
        <text x="795" y="140" className="fill-gray-300 text-xs text-center">3ph 230/400V</text>

        {/* Control Signal Flow */}
        <rect x="50" y="200" width="900" height="180" fill="slate-800" opacity="0.3" rx="5"/>
        <text x="70" y="225" className="fill-cyan-400 text-sm font-bold">Control & Monitoring Path:</text>

        <text x="70" y="250" className="fill-gray-300 text-xs">① Voltage Sensors (4ch): Sample AC output phase voltages</text>
        <text x="70" y="268" className="fill-gray-300 text-xs">② Current Sensors (4ch): Measure output current (Hall effect)</text>
        <text x="70" y="286" className="fill-gray-300 text-xs">③ Temperature Sensor: Monitor heatsink temperature (NTC 10kΩ)</text>
        <text x="70" y="304" className="fill-gray-300 text-xs">④ ADC (Analog-to-Digital): Sample at 20kHz, 12-bit resolution</text>
        <text x="70" y="322" className="fill-gray-300 text-xs">⑤ MCU (STM32F401): Calculate Iq/Id, SVPWM modulation, protection logic</text>
        <text x="70" y="340" className="fill-gray-300 text-xs">⑥ PWM Output (16kHz): Gate driver signals to IGBT switches</text>
        <text x="70" y="358" className="fill-gray-300 text-xs">⑦ Protection Circuit: Over-current, over-temperature, ground fault detection</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// UPS BATTERY CHARGING CIRCUIT SCHEMATIC
// ════════════════════════════════════════════════════════════════════════

export function UPSChargerSchematic() {
  return (
    <div className="bg-slate-900/50 border border-violet-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-violet-400 mb-6">UPS Battery Charging Circuit Schematic</h3>
      <svg viewBox="0 0 950 350" className="w-full h-auto bg-black/30 rounded p-4">
        {/* AC Input */}
        <circle cx="50" cy="80" r="12" fill="none" stroke="green" strokeWidth="2"/>
        <path d="M 40 80 Q 45 88 50 80 Q 55 72 60 80" fill="none" stroke="green" strokeWidth="2"/>
        <text x="35" y="110" className="fill-gray-300 text-xs text-center">AC Input</text>

        {/* Transformer */}
        <circle cx="130" cy="60" r="8" fill="none" stroke="blue" strokeWidth="2"/>
        <circle cx="150" cy="60" r="8" fill="none" stroke="blue" strokeWidth="2"/>
        <line x1="130" y1="68" x2="150" y2="68" stroke="blue" strokeWidth="1"/>
        <line x1="62" y1="80" x2="120" y2="80" stroke="green" strokeWidth="1"/>
        <line x1="160" y1="60" x2="180" y2="60" stroke="green" strokeWidth="2"/>
        <text x="120" y="110" className="fill-gray-300 text-xs text-center">24V Transformer</text>

        {/* Rectifier Bridge */}
        <rect x="200" y="50" width="30" height="30" fill="none" stroke="red" strokeWidth="2"/>
        <text x="206" y="70" className="fill-red-400 text-xs">GBU</text>
        <line x1="180" y1="60" x2="200" y2="60" stroke="green" strokeWidth="1"/>
        <line x1="230" y1="60" x2="250" y2="60" stroke="red" strokeWidth="2"/>
        <text x="195" y="105" className="fill-gray-300 text-xs text-center">4A Bridge</text>

        {/* Bulk Capacitor */}
        <line x1="270" y1="50" x2="270" y2="70" stroke="red" strokeWidth="2"/>
        <line x1="280" y1="50" x2="280" y2="70" stroke="red" strokeWidth="2"/>
        <line x1="250" y1="60" x2="270" y2="60" stroke="red" strokeWidth="1"/>
        <text x="260" y="105" className="fill-gray-300 text-xs text-center">2200µF</text>

        {/* Voltage Regulator */}
        <rect x="310" y="50" width="40" height="20" fill="none" stroke="yellow" strokeWidth="2"/>
        <text x="316" y="64" className="fill-yellow-400 text-xs">LM7824</text>
        <line x1="280" y1="60" x2="310" y2="60" stroke="red" strokeWidth="1"/>
        <line x1="350" y1="60" x2="380" y2="60" stroke="yellow" strokeWidth="2"/>
        <text x="300" y="105" className="fill-gray-300 text-xs text-center">Reg +24V</text>

        {/* Current Sense Resistor */}
        <rect x="400" y="55" width="30" height="10" fill="none" stroke="orange" strokeWidth="2"/>
        <line x1="380" y1="60" x2="400" y2="60" stroke="yellow" strokeWidth="1"/>
        <text x="390" y="105" className="fill-gray-300 text-xs text-center">0.47Ω</text>

        {/* Charging Control Comparator */}
        <rect x="450" y="40" width="50" height="40" fill="none" stroke="purple" strokeWidth="2"/>
        <text x="460" y="68" className="fill-purple-400 text-xs">Comp</text>
        <text x="450" y="105" className="fill-gray-300 text-xs text-center">Op-Amp</text>

        {/* MOSFET Charger Switch */}
        <line x1="530" y1="40" x2="530" y2="60" stroke="purple" strokeWidth="2"/>
        <circle cx="520" cy="60" r="4" fill="purple"/>
        <line x1="530" y1="50" x2="545" y2="40" stroke="purple" strokeWidth="1.5"/>
        <line x1="530" y1="50" x2="545" y2="60" stroke="purple" strokeWidth="1.5"/>
        <text x="525" y="105" className="fill-gray-300 text-xs text-center">MOSFET</text>

        {/* Battery Connection */}
        <circle cx="630" cy="60" r="8" fill="none" stroke="green" strokeWidth="2"/>
        <line x1="545" y1="40" x2="630" y2="40" stroke="purple" strokeWidth="2"/>
        <line x1="545" y1="60" x2="630" y2="60" stroke="purple" strokeWidth="2"/>
        <line x1="622" y1="68" x2="638" y2="68" stroke="green" strokeWidth="2"/>
        <text x="615" y="110" className="fill-gray-300 text-xs text-center">Battery</text>
        <text x="610" y="125" className="fill-gray-300 text-xs text-center">24V/7Ah</text>

        {/* Charging Process Info */}
        <rect x="50" y="160" width="850" height="170" fill="slate-800" opacity="0.3" rx="5"/>
        <text x="70" y="185" className="fill-cyan-400 text-sm font-bold">Charging Algorithm (Constant Current / Constant Voltage):</text>

        <text x="70" y="210" className="fill-gray-300 text-xs">Phase 1 - Bulk Charging: Current held at 3A (Ibulk) until battery reaches 26.4V</text>
        <text x="70" y="230" className="fill-gray-300 text-xs">Phase 2 - Absorption: Voltage held at 26.4V, current tapers as battery charges</text>
        <text x="70" y="250" className="fill-gray-300 text-xs">Phase 3 - Float Maintenance: Voltage reduced to 24V, trickle current &lt;100mA</text>
        <text x="70" y="270" className="fill-gray-300 text-xs">Temperature Compensation: Vfloat = 24V - (T-25°C) × 0.03V/°C (lower voltage in hot climates)</text>
        <text x="70" y="290" className="fill-gray-300 text-xs">Safety Features: Over-voltage protection (&gt;28V trip), reverse polarity diode, thermal foldback</text>
        <text x="70" y="310" className="fill-gray-300 text-xs">Typical Charging Time: 7 hours full cycle at 3A rate from 50% SOC</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// THREE-PHASE MOTOR CONTROL SCHEMATIC
// ════════════════════════════════════════════════════════════════════════

export function MotorControlSchematic() {
  return (
    <div className="bg-slate-900/50 border border-orange-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-orange-400 mb-6">Three-Phase Motor Control Schematic</h3>
      <svg viewBox="0 0 1000 400" className="w-full h-auto bg-black/30 rounded p-4">
        {/* AC Supply */}
        <text x="20" y="50" className="fill-green-400 text-sm font-bold">AC Supply (380-415V)</text>
        <circle cx="60" cy="100" r="8" fill="none" stroke="green" strokeWidth="2"/>
        <path d="M 52 100 Q 57 108 62 100 Q 67 92 72 100" fill="none" stroke="green" strokeWidth="2"/>
        <text x="50" y="130" className="fill-gray-300 text-xs text-center">L1/R</text>

        <circle cx="120" cy="100" r="8" fill="none" stroke="green" strokeWidth="2"/>
        <path d="M 112 100 Q 117 108 122 100 Q 127 92 132 100" fill="none" stroke="green" strokeWidth="2"/>
        <text x="110" y="130" className="fill-gray-300 text-xs text-center">L2/Y</text>

        <circle cx="180" cy="100" r="8" fill="none" stroke="green" strokeWidth="2"/>
        <path d="M 172 100 Q 177 108 182 100 Q 187 92 192 100" fill="none" stroke="green" strokeWidth="2"/>
        <text x="170" y="130" className="fill-gray-300 text-xs text-center">L3/B</text>

        {/* Main Contactor */}
        <rect x="50" y="150" width="35" height="35" fill="none" stroke="red" strokeWidth="2"/>
        <text x="55" y="173" className="fill-red-400 text-sm">K1</text>
        <text x="40" y="205" className="fill-gray-300 text-xs text-center">Main</text>
        <text x="40" y="218" className="fill-gray-300 text-xs text-center">Contactor</text>

        {/* Overload Relay */}
        <circle cx="140" cy="168" r="12" fill="none" stroke="yellow" strokeWidth="2"/>
        <text x="136" y="173" className="fill-yellow-400 text-xs">OL</text>
        <text x="130" y="205" className="fill-gray-300 text-xs text-center">Overload</text>
        <text x="135" y="218" className="fill-gray-300 text-xs text-center">Relay</text>

        {/* Soft Starter / VFD */}
        <rect x="220" y="140" width="70" height="50" fill="none" stroke="purple" strokeWidth="2"/>
        <text x="240" y="172" className="fill-purple-400 text-xs font-semibold">Soft</text>
        <text x="240" y="185" className="fill-purple-400 text-xs font-semibold">Starter</text>
        <text x="210" y="215" className="fill-gray-300 text-xs text-center">SCR-based</text>

        {/* Power to Motor */}
        <line x1="85" y1="155" x2="220" y2="155" stroke="red" strokeWidth="2"/>
        <line x1="290" y1="155" x2="350" y2="155" stroke="purple" strokeWidth="2"/>
        <line x1="350" y1="150" x2="350" y2="160" stroke="purple" strokeWidth="1"/>

        {/* Motor */}
        <circle cx="400" cy="160" r="20" fill="none" stroke="green" strokeWidth="2"/>
        <text x="395" y="167" className="fill-green-400 text-lg font-bold">M</text>
        <text x="385" y="205" className="fill-gray-300 text-xs text-center">3-Phase</text>
        <text x="385" y="218" className="fill-gray-300 text-xs text-center">Motor 7.5kW</text>

        {/* Control Circuit */}
        <text x="20" y="260" className="fill-cyan-400 text-sm font-bold">Control Circuit (24V DC)</text>

        {/* Start Button */}
        <circle cx="80" cy="300" r="6" fill="none" stroke="green" strokeWidth="2"/>
        <circle cx="80" cy="300" r="3" fill="green"/>
        <text x="70" y="330" className="fill-gray-300 text-xs text-center">Start</text>

        {/* Stop Button */}
        <circle cx="140" cy="300" r="6" fill="none" stroke="red" strokeWidth="2"/>
        <circle cx="140" cy="300" r="3" fill="red"/>
        <text x="130" y="330" className="fill-gray-300 text-xs text-center">Stop</text>

        {/* Pilot Light */}
        <circle cx="200" cy="300" r="8" fill="none" stroke="yellow" strokeWidth="2"/>
        <circle cx="200" cy="300" r="5" fill="yellow" opacity="0.5"/>
        <text x="190" y="330" className="fill-gray-300 text-xs text-center">Run</text>

        {/* Temperature Switch */}
        <rect x="240" y="290" width="30" height="20" fill="none" stroke="orange" strokeWidth="1.5"/>
        <text x="242" y="305" className="fill-orange-300 text-xs">TS</text>
        <text x="235" y="330" className="fill-gray-300 text-xs text-center">Therm</text>

        {/* Protection Features */}
        <rect x="350" y="260" width="550" height="130" fill="slate-800" opacity="0.3" rx="5"/>
        <text x="370" y="285" className="fill-cyan-400 text-sm font-bold">Built-in Protections:</text>

        <text x="370" y="310" className="fill-gray-300 text-xs">✓ Phase Failure Relay: Detects missing phase, prevents single-phase operation</text>
        <text x="370" y="328" className="fill-gray-300 text-xs">✓ Over-current Protection: Overload relay trips at 115-125% for thermal protection</text>
        <text x="370" y="346" className="fill-gray-300 text-xs">✓ Short-circuit Protection: Main breaker provides instantaneous trip at 300-500% rated current</text>
        <text x="370" y="364" className="fill-gray-300 text-xs">✓ Thermal Compensation: Temperature sensor adjusts trip point (cold = lower threshold)</text>
        <text x="370" y="382" className="fill-gray-300 text-xs">✓ Reverse Phase Detection: Prevents accidental backward rotation that could damage driven equipment</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// AC/HVAC COMPRESSOR CONTROL PCB SCHEMATIC
// ════════════════════════════════════════════════════════════════════════

export function ACCompressorPCB() {
  return (
    <div className="bg-slate-900/50 border border-cyan-700 rounded-lg p-8 my-8">
      <h3 className="text-xl font-bold text-cyan-400 mb-6">AC Compressor Control PCB Layout (Typical Split Unit)</h3>
      <svg viewBox="0 0 1000 500" className="w-full h-auto bg-black/30 rounded p-4">
        {/* PCB Frame */}
        <rect x="50" y="50" width="900" height="350" fill="none" stroke="cyan" strokeWidth="3" rx="10"/>
        <text x="500" y="35" className="fill-cyan-400 text-sm font-bold text-center">Compressor Control PCB (Simplified Schematic)</text>

        {/* AC Input Section */}
        <rect x="70" y="80" width="120" height="120" fill="blue" opacity="0.1" rx="5" strokeDasharray="5,5" stroke="blue"/>
        <text x="90" y="105" className="fill-blue-400 text-xs font-bold">AC Input Stage</text>
        <text x="80" y="125" className="fill-gray-300 text-xs">• Transformer 220V→24V</text>
        <text x="80" y="140" className="fill-gray-300 text-xs">• Bridge Rectifier GBU8</text>
        <text x="80" y="155" className="fill-gray-300 text-xs">• Filter Cap 2200µF/50V</text>
        <text x="80" y="170" className="fill-gray-300 text-xs">• Fuse 5A 250V</text>
        <text x="80" y="185" className="fill-gray-300 text-xs">Output: +24V DC / GND</text>

        {/* Microcontroller Section */}
        <rect x="230" y="80" width="140" height="120" fill="purple" opacity="0.1" rx="5" strokeDasharray="5,5" stroke="purple"/>
        <text x="250" y="105" className="fill-purple-400 text-xs font-bold">Microcontroller</text>
        <text x="240" y="125" className="fill-gray-300 text-xs">• STM32L011F4</text>
        <text x="240" y="140" className="fill-gray-300 text-xs">• 32 GPIO Pins</text>
        <text x="240" y="155" className="fill-gray-300 text-xs">• 12-bit ADC 12ch</text>
        <text x="240" y="170" className="fill-gray-300 text-xs">• UART Debug Port</text>
        <text x="240" y="185" className="fill-gray-300 text-xs">• CRC Protection</text>

        {/* Sensor Input Stage */}
        <rect x="410" y="80" width="140" height="120" fill="green" opacity="0.1" rx="5" strokeDasharray="5,5" stroke="green"/>
        <text x="430" y="105" className="fill-green-400 text-xs font-bold">Sensor Inputs (ADC)</text>
        <text x="420" y="125" className="fill-gray-300 text-xs">• Temperature NTC 10k</text>
        <text x="420" y="140" className="fill-gray-300 text-xs">• Pressure Switch 2ch</text>
        <text x="420" y="155" className="fill-gray-300 text-xs">• Current Sense (Hall)</text>
        <text x="420" y="170" className="fill-gray-300 text-xs">• Voltage Divider 310V</text>
        <text x="420" y="185" className="fill-gray-300 text-xs">• Thermal Foldback</text>

        {/* Relay Driver Section */}
        <rect x="590" y="80" width="140" height="120" fill="red" opacity="0.1" rx="5" strokeDasharray="5,5" stroke="red"/>
        <text x="610" y="105" className="fill-red-400 text-xs font-bold">Relay Drivers</text>
        <text x="600" y="125" className="fill-gray-300 text-xs">• Comp Relay UNI 30A</text>
        <text x="600" y="140" className="fill-gray-300 text-xs">• Fan Relay 10A</text>
        <text x="600" y="155" className="fill-gray-300 text-xs">• Solenoid Valve 24V</text>
        <text x="600" y="170" className="fill-gray-300 text-xs">• Transient Protection</text>
        <text x="600" y="185" className="fill-gray-300 text-xs">• Flyback Diodes 1N4007</text>

        {/* Communication Section */}
        <rect x="770" y="80" width="120" height="120" fill="yellow" opacity="0.1" rx="5" strokeDasharray="5,5" stroke="yellow"/>
        <text x="790" y="105" className="fill-yellow-400 text-xs font-bold">Communications</text>
        <text x="780" y="125" className="fill-gray-300 text-xs">• UART (Console)</text>
        <text x="780" y="140" className="fill-gray-300 text-xs">• Modbus RTU</text>
        <text x="780" y="155" className="fill-gray-300 text-xs">• IR Receiver (RC)</text>
        <text x="780" y="170" className="fill-gray-300 text-xs">• LED Indicators 3ch</text>
        <text x="780" y="185" className="fill-gray-300 text-xs">• Buzzer PWM</text>

        {/* Power Distribution */}
        <line x1="130" y1="200" x2="900" y2="200" stroke="yellow" strokeWidth="2"/>
        <text x="400" y="220" className="fill-yellow-400 text-xs text-center">+24V Power Rail (600mA)</text>

        {/* Ground Plane */}
        <line x1="130" y1="230" x2="900" y2="230" stroke="green" strokeWidth="2"/>
        <text x="400" y="250" className="fill-green-400 text-xs text-center">Ground Plane (Star Point Connection)</text>

        {/* Signal Routing */}
        <text x="70" y="290" className="fill-cyan-400 text-xs font-bold">Critical Signal Paths:</text>
        <text x="70" y="310" className="fill-gray-300 text-xs">1. Temperature Sensing → ADC Ch1 → MCU → Thermal Calculation → Frequency Mod</text>
        <text x="70" y="328" className="fill-gray-300 text-xs">2. Current Sensing → ADC Ch2 → OCP Logic → Soft Shutdown if &gt;6A for &gt;5s</text>
        <text x="70" y="346" className="fill-gray-300 text-xs">3. Pressure Switch → GPIO Int → Emergency Shutdown (safety critical path)</text>
        <text x="70" y="364" className="fill-gray-300 text-xs">4. Motor Control → PWM 25kHz @ GPIO P4 → Relay Driver ULN2003 → Compressor Relay</text>
        <text x="70" y="382" className="fill-gray-300 text-xs">5. Watchdog Timer → Monitors MCU health; resets if no heartbeat for &gt;2 seconds</text>

        {/* Design Features */}
        <rect x="70" y="410" width="860" height="65" fill="slate-800" opacity="0.3" rx="5"/>
        <text x="90" y="435" className="fill-blue-300 text-xs">PCB Design: 4-layer (Power, Ground, Signal, Signal) | 0.3mm trace width | 0.25mm clearance | <0.5mm via</text>
        <text x="90" y="453" className="fill-blue-300 text-xs">Protection: Transient suppression on all relay coils, motor power connections shielded, input filtering 10mH @10A</text>
        <text x="90" y="468" className="fill-blue-300 text-xs">Reliability: MTBF &gt;50,000h (1000h burn-in test passed), ESD protection &gt;15kV HBM all signal pins</text>
      </svg>
    </div>
  );
}

export default function ElectricalSchematics() {
  return (
    <div className="space-y-8">
      <ElectricalSymbolsReference />
      <InverterPowerStageSchemematic />
      <UPSChargerSchematic />
      <MotorControlSchematic />
      <ACCompressorPCB />
    </div>
  );
}
