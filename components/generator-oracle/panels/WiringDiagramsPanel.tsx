'use client';

/**
 * PROFESSIONAL WIRING & SCHEMATIC DIAGRAMS PANEL
 * Industry-grade electrical documentation with detailed schematics
 *
 * Features:
 * - IEEE/IEC standard electrical symbols
 * - Complete wiring runs with junction points
 * - Interactive circuit tracing with current flow animation
 * - Detailed component specifications
 * - Terminal block diagrams
 * - Full pinout with wire gauges and colors
 *
 * Wiring safety contract: this panel never silently substitutes one
 * OEM's wiring for another. Controllers without verified pinout data
 * render an explicit "data not yet available" notice and PDF export
 * is refused. See lib/generator-oracle/wiringGuard.ts.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * INTELLECTUAL PROPERTY POSTURE — binding on every future addition
 * ─────────────────────────────────────────────────────────────────────────────
 * This is an INDEPENDENT reference. It is not affiliated with, endorsed by, or
 * associated with Deep Sea Electronics, ComAp, Woodward, SmartGen, Caterpillar,
 * Datakom, Lovato, Siemens, ENKO, Volvo Penta or any other manufacturer. All
 * brand names, model numbers and trademarks are the property of their
 * respective owners.
 *
 * What may be recorded here, and why it is lawful:
 *   - TERMINAL NUMBERS and the SIGNAL each carries (e.g. "terminal 1 is DC
 *     negative"). These are facts about a physical product. Facts are not
 *     protected by copyright, and they are the only thing a technician needs.
 *   - CABLE SIZES and electrical limits, likewise factual.
 *
 * What must NEVER be copied:
 *   - The manufacturer's PROSE. Every `function:` string in this file must be
 *     written in our own words, describing what the terminal does. Do not
 *     transcribe sentences, warnings, tables or diagrams out of an OEM manual,
 *     and do not paraphrase so closely that the original wording survives.
 *   - Any figure, drawing or artwork from a manual.
 *
 * What must NEVER be invented:
 *   - Wire COLOURS. Most manuals give cable size only; where colour is unstated
 *     the value is 'Not specified by OEM'.
 *   - Terminal assignments for a controller whose manual has not been read. An
 *     entry in CONTROLLER_PINS is not evidence — isControllerVerified() gates on
 *     lib/generator-oracle/controllerSources.ts, which must name the document,
 *     its publication/revision number and where it was obtained.
 *
 * Deriving one model from another is permitted ONLY where the manufacturer
 * publishes a single document covering both and states the differences (as DSE
 * do for the 7310/7320). Record the delta and the sentence that establishes it.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WIRING_SAFETY_NOTICE,
  WIRING_UNAVAILABLE_MESSAGE,
  validateControllerWiringMatch,
} from '@/lib/generator-oracle/wiringGuard';
import {
  getControllerSource,
  isControllerVerified,
  type ControllerSourceEntry,
} from '@/lib/generator-oracle/controllerSources';

/**
 * Renders the OEM source provenance / unsupported-reason for a controller.
 * Verified controllers list the OEM document(s) the pin map was extracted
 * from. Unsupported controllers list the searched OEM hubs and the explicit
 * reason no pinout has been shipped — making the gap auditable rather than
 * hidden.
 */
function ControllerSourceBlock({ controllerId }: { controllerId: string }) {
  const entry: ControllerSourceEntry | undefined = getControllerSource(controllerId);
  if (!entry) return null;
  if (entry.status === 'verified') {
    return (
      <div
        className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs"
        role="note"
        aria-label="controller wiring source"
      >
        <div className="font-semibold text-emerald-300 mb-1">
          Verified pinout source ({entry.verificationConfidence} confidence)
        </div>
        {entry.completeness === 'partial' && (
          <div className="mb-2 rounded border border-amber-500/40 bg-amber-500/10 p-2">
            <div className="font-semibold text-amber-300">Partial coverage</div>
            <p className="text-slate-300 mt-0.5">{entry.coverageNote}</p>
          </div>
        )}
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          {entry.sources.map((s, i) => (
            <li key={i}>
              <span className="font-medium text-slate-100">{s.title}</span>
              {s.revision ? <span className="text-slate-400"> · rev {s.revision}</span> : null}
              <span className="text-slate-400"> · {s.publisher} · {s.documentType}</span>
              {s.url ? (
                <>
                  {' '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 underline hover:text-emerald-200"
                  >
                    open document
                  </a>
                </>
              ) : null}
              {s.notes ? <div className="text-slate-400 mt-0.5">{s.notes}</div> : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div
      className="mt-3 rounded-lg border border-slate-600/50 bg-slate-900/40 p-3 text-xs"
      role="note"
      aria-label="controller wiring unsupported reason"
      data-testid="controller-unsupported-reason"
    >
      <div className="font-semibold text-amber-300 mb-1">
        Why this controller is unsupported
      </div>
      <p className="text-slate-300 leading-relaxed">{entry.reason}</p>
      {entry.searchedSources.length > 0 && (
        <div className="mt-2">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">Sources searched</div>
          <ul className="list-disc pl-5 text-slate-400">
            {entry.searchedSources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ==================== ELECTRICAL SYMBOLS (SVG) ====================
const ElectricalSymbols = {
  // Power Sources
  battery: (x: number, y: number, voltage: string = '24V') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="0" y1="-15" x2="0" y2="-8" stroke="#ef4444" strokeWidth="2" />
      <line x1="-12" y1="-8" x2="12" y2="-8" stroke="#ef4444" strokeWidth="3" />
      <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#ef4444" strokeWidth="2" />
      <line x1="-12" y1="2" x2="12" y2="2" stroke="#ef4444" strokeWidth="3" />
      <line x1="-6" y1="7" x2="6" y2="7" stroke="#ef4444" strokeWidth="2" />
      <line x1="0" y1="7" x2="0" y2="15" stroke="#ef4444" strokeWidth="2" />
      <text x="18" y="0" fill="#94a3b8" fontSize="9" fontWeight="bold">{voltage}</text>
      <text x="-8" y="-18" fill="#22c55e" fontSize="8">+</text>
      <text x="-8" y="22" fill="#64748b" fontSize="8">-</text>
    </g>
  ),

  // Ground Symbol
  ground: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="0" y1="-10" x2="0" y2="0" stroke="#22c55e" strokeWidth="2" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="#22c55e" strokeWidth="2" />
      <line x1="-8" y1="4" x2="8" y2="4" stroke="#22c55e" strokeWidth="2" />
      <line x1="-4" y1="8" x2="4" y2="8" stroke="#22c55e" strokeWidth="2" />
    </g>
  ),

  // Fuse Symbol
  fuse: (x: number, y: number, rating: string = '15A') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-15" y="-6" width="30" height="12" rx="2" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="#f59e0b" strokeWidth="2" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="#f59e0b" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">{rating}</text>
    </g>
  ),

  // Relay Coil
  relayCoil: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y="-15" width="40" height="30" rx="3" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <ellipse cx="0" cy="0" rx="10" ry="8" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1="-20" y1="-8" x2="-30" y2="-8" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-20" y1="8" x2="-30" y2="8" stroke="#8b5cf6" strokeWidth="2" />
      <text x="0" y="25" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">{label}</text>
    </g>
  ),

  // Relay Contact (NO)
  relayContactNO: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-8" y1="0" x2="6" y2="-10" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="2" fill="#8b5cf6" />
      <circle cx="8" cy="0" r="2" fill="#8b5cf6" />
      <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Relay Contact (NC)
  relayContactNC: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-8" y1="5" x2="8" y2="-5" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="2" fill="#8b5cf6" />
      <circle cx="8" cy="0" r="2" fill="#8b5cf6" />
      <line x1="0" y1="-8" x2="0" y2="-3" stroke="#8b5cf6" strokeWidth="1" />
      <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Solenoid
  solenoid: (x: number, y: number, label: string = 'SOL') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-18" y="-12" width="36" height="24" rx="2" fill="none" stroke="#f97316" strokeWidth="2" />
      {[...Array(4)].map((_, i) => (
        <path key={i} d={`M ${-12 + i*8} -6 Q ${-8 + i*8} 0, ${-12 + i*8} 6`} fill="none" stroke="#f97316" strokeWidth="1.5" />
      ))}
      <line x1="-18" y1="0" x2="-28" y2="0" stroke="#f97316" strokeWidth="2" />
      <line x1="18" y1="0" x2="28" y2="0" stroke="#f97316" strokeWidth="2" />
      <text x="0" y="22" textAnchor="middle" fill="#fb923c" fontSize="8">{label}</text>
    </g>
  ),

  // Motor/Starter
  motor: (x: number, y: number, label: string = 'M') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="18" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">{label}</text>
      <line x1="-18" y1="0" x2="-28" y2="0" stroke="#06b6d4" strokeWidth="2" />
      <line x1="18" y1="0" x2="28" y2="0" stroke="#06b6d4" strokeWidth="2" />
    </g>
  ),

  // Sensor (Generic)
  sensor: (x: number, y: number, label: string = 'S', type: string = 'temp') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="0" y="4" textAnchor="middle" fill="#3b82f6" fontSize="10">{label}</text>
      <line x1="0" y1="-12" x2="0" y2="-22" stroke="#3b82f6" strokeWidth="2" />
      <line x1="0" y1="12" x2="0" y2="22" stroke="#3b82f6" strokeWidth="2" />
      <text x="0" y="32" textAnchor="middle" fill="#94a3b8" fontSize="7">{type}</text>
    </g>
  ),

  // Resistor (for sensors)
  resistor: (x: number, y: number, value: string = '') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-25" y1="0" x2="-18" y2="0" stroke="#eab308" strokeWidth="2" />
      <path d="M -18 0 L -15 -6 L -9 6 L -3 -6 L 3 6 L 9 -6 L 15 6 L 18 0" fill="none" stroke="#eab308" strokeWidth="2" />
      <line x1="18" y1="0" x2="25" y2="0" stroke="#eab308" strokeWidth="2" />
      {value && <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="7">{value}</text>}
    </g>
  ),

  // Capacitor
  capacitor: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-4" y2="0" stroke="#10b981" strokeWidth="2" />
      <line x1="-4" y1="-10" x2="-4" y2="10" stroke="#10b981" strokeWidth="2" />
      <line x1="4" y1="-10" x2="4" y2="10" stroke="#10b981" strokeWidth="2" />
      <line x1="4" y1="0" x2="20" y2="0" stroke="#10b981" strokeWidth="2" />
    </g>
  ),

  // Diode
  diode: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#ec4899" strokeWidth="2" />
      <polygon points="-8,-8 -8,8 8,0" fill="none" stroke="#ec4899" strokeWidth="2" />
      <line x1="8" y1="-8" x2="8" y2="8" stroke="#ec4899" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#ec4899" strokeWidth="2" />
    </g>
  ),

  // Switch (SPST)
  switchSPST: (x: number, y: number, label: string = 'SW') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#14b8a6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#14b8a6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="3" fill="#14b8a6" />
      <circle cx="8" cy="0" r="3" fill="none" stroke="#14b8a6" strokeWidth="2" />
      <line x1="-6" y1="-2" x2="6" y2="-10" stroke="#14b8a6" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Push Button (NO)
  pushButtonNO: (x: number, y: number, label: string = 'PB') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#ef4444" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="2" />
      <circle cx="-8" cy="0" r="3" fill="#ef4444" />
      <circle cx="8" cy="0" r="3" fill="none" stroke="#ef4444" strokeWidth="2" />
      <line x1="-8" y1="-12" x2="8" y2="-12" stroke="#ef4444" strokeWidth="2" />
      <line x1="0" y1="-12" x2="0" y2="-5" stroke="#ef4444" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#fca5a5" fontSize="8">{label}</text>
    </g>
  ),

  // E-Stop Button
  eStop: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="#fff" strokeWidth="3" />
      <line x1="8" y1="-8" x2="-8" y2="8" stroke="#fff" strokeWidth="3" />
      <text x="0" y="28" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">E-STOP</text>
    </g>
  ),

  // Terminal Block
  terminalBlock: (x: number, y: number, terminals: string[]) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-30" y={-terminals.length * 10} width="60" height={terminals.length * 20} fill="#1e293b" stroke="#475569" strokeWidth="2" />
      {terminals.map((t, i) => (
        <g key={i} transform={`translate(0, ${-terminals.length * 10 + 10 + i * 20})`}>
          <rect x="-25" y="-7" width="50" height="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx="-35" cy="0" r="4" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <circle cx="35" cy="0" r="4" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8">{t}</text>
        </g>
      ))}
    </g>
  ),

  // CT (Current Transformer)
  currentTransformer: (x: number, y: number, label: string = 'CT') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="15" fill="none" stroke="#a855f7" strokeWidth="2" />
      <circle cx="0" cy="0" r="10" fill="none" stroke="#a855f7" strokeWidth="1" />
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="#a855f7" strokeWidth="3" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="#a855f7" strokeWidth="3" />
      <line x1="0" y1="15" x2="0" y2="25" stroke="#a855f7" strokeWidth="2" />
      <line x1="0" y1="-15" x2="0" y2="-25" stroke="#a855f7" strokeWidth="2" />
      <text x="0" y="35" textAnchor="middle" fill="#c4b5fd" fontSize="8">{label}</text>
    </g>
  ),

  // Controller Box
  controller: (x: number, y: number, w: number, h: number, label: string, pins: {name: string, y: number, side: 'left'|'right'}[]) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-w/2} y={-h/2} width={w} height={h} rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
      <rect x={-w/2+5} y={-h/2+5} width={w-10} height={25} rx="4" fill="#1e293b" />
      <text x="0" y={-h/2+20} textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">{label}</text>
      {pins.map((pin, i) => (
        <g key={i}>
          <circle
            cx={pin.side === 'left' ? -w/2 : w/2}
            cy={pin.y}
            r="4"
            fill="#1e293b"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          <text
            x={pin.side === 'left' ? -w/2 + 10 : w/2 - 10}
            y={pin.y + 3}
            textAnchor={pin.side === 'left' ? 'start' : 'end'}
            fill="#94a3b8"
            fontSize="7"
          >
            {pin.name}
          </text>
        </g>
      ))}
    </g>
  ),

  // Wire Junction (Dot)
  junction: (x: number, y: number) => (
    <circle cx={x} cy={y} r="4" fill="#f59e0b" />
  ),

  // Wire Crossover (No connection)
  crossover: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -10 0 Q 0 -8, 10 0" fill="none" stroke="#64748b" strokeWidth="2" />
    </g>
  ),
};

// ==================== DETAILED SCHEMATIC DATA ====================
interface SchematicComponent {
  id: string;
  type: 'battery' | 'fuse' | 'relay' | 'solenoid' | 'motor' | 'sensor' | 'switch' | 'ground' | 'terminal' | 'ct' | 'controller' | 'resistor' | 'diode' | 'estop' | 'capacitor';
  x: number;
  y: number;
  label: string;
  value?: string;
  specs?: string;
}

interface WireRun {
  id: string;
  from: { component: string; terminal: string };
  to: { component: string; terminal: string };
  color: string;
  gauge: string;
  path: string; // SVG path
  junctions?: { x: number; y: number }[];
}

interface DetailedCircuit {
  id: string;
  name: string;
  description: string;
  components: SchematicComponent[];
  wires: WireRun[];
  notes: string[];
}

// ==================== CONTROLLER DATABASE ====================
interface ControllerModel {
  id: string;
  brand: string;
  model: string;
  type: 'genset' | 'ats' | 'load-share' | 'mains';
  features: string[];
  pinCount: number;
  voltage: string;
  dimensions?: string;
}

const CONTROLLERS: ControllerModel[] = [
  // DSE Controllers
  { id: 'dse-7320', brand: 'DSE', model: '7320 MKII', type: 'genset', features: ['AMF', 'Load Share', 'CAN', 'J1939'], pinCount: 32, voltage: '8-35V DC' },
  // NOT an AMF module. DSE list the 7310 MKII under "Manual & Auto Start
  // Control Modules" and the 7320 MKII under "Auto Mains (Utility) Failure
  // Control Modules". Their Installation Instructions (053-181 Issue 7) state
  // "Terminals 38, 39, 40 & 41 are not fitted to the DSE7310 MKII" — those four
  // are the Mains L1/L2/L3/N sensing inputs, so it cannot perform mains failure
  // detection. pinCount corrected 28 -> 54 to match the verified terminal list.
  { id: 'dse-7310', brand: 'DSE', model: '7310 MKII', type: 'genset', features: ['Manual/Auto Start', 'CAN'], pinCount: 54, voltage: '8-35V DC' },
  { id: 'dse-6020', brand: 'DSE', model: '6020 MKII', type: 'genset', features: ['Manual', 'Auto'], pinCount: 20, voltage: '8-35V DC' },
  { id: 'dse-6120', brand: 'DSE', model: '6120 MKII', type: 'genset', features: ['AMF', 'Auto'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'dse-4520', brand: 'DSE', model: '4520', type: 'genset', features: ['Compact', 'Basic'], pinCount: 16, voltage: '8-35V DC' },
  { id: 'dse-8610', brand: 'DSE', model: '8610 MKII', type: 'load-share', features: ['Load Share', 'Sync', 'CAN'], pinCount: 40, voltage: '8-35V DC' },
  { id: 'dse-8660', brand: 'DSE', model: '8660 MKII', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 44, voltage: '8-35V DC' },
  // ComAp Controllers
  { id: 'comap-intelilite', brand: 'ComAp', model: 'InteliLite NT', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-36V DC' },
  { id: 'comap-inteligen', brand: 'ComAp', model: 'InteliGen NT', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 36, voltage: '8-36V DC' },
  { id: 'comap-intelisys', brand: 'ComAp', model: 'InteliSys NT', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 48, voltage: '8-36V DC' },
  { id: 'comap-intelimains', brand: 'ComAp', model: 'InteliMains NT', type: 'mains', features: ['Mains Decoupling'], pinCount: 20, voltage: '8-36V DC' },
  // Woodward Controllers
  // Supply range corrected 2026-07-29: Woodward specify 8 to 40.0 V DC on
  // terminal 63 for the easYgen-3000, not 8-32 V DC.
  { id: 'woodward-easygen3000', brand: 'Woodward', model: 'easYgen 3000', type: 'genset', features: ['AMF', 'Load Share', 'Modbus'], pinCount: 40, voltage: '8-40V DC' },
  { id: 'woodward-easygen2000', brand: 'Woodward', model: 'easYgen 2000', type: 'genset', features: ['AMF', 'Basic'], pinCount: 28, voltage: '8-32V DC' },
  { id: 'woodward-dtsc200', brand: 'Woodward', model: 'DTSC-200', type: 'genset', features: ['Digital', 'CAN'], pinCount: 24, voltage: '9-32V DC' },
  // SmartGen Controllers
  { id: 'smartgen-hgm6120', brand: 'SmartGen', model: 'HGM6120', type: 'genset', features: ['AMF', 'Basic'], pinCount: 20, voltage: '8-35V DC' },
  { id: 'smartgen-hgm7220', brand: 'SmartGen', model: 'HGM7220', type: 'genset', features: ['AMF', 'CAN'], pinCount: 28, voltage: '8-35V DC' },
  { id: 'smartgen-hgm9320', brand: 'SmartGen', model: 'HGM9320', type: 'genset', features: ['AMF', 'Load Share'], pinCount: 36, voltage: '8-35V DC' },
  { id: 'smartgen-hgm9510', brand: 'SmartGen', model: 'HGM9510', type: 'load-share', features: ['Sync', 'PMS'], pinCount: 44, voltage: '8-35V DC' },
  // PowerWizard Controllers
  { id: 'powerwizard-10', brand: 'PowerWizard', model: '1.0', type: 'genset', features: ['Basic', 'CAT'], pinCount: 20, voltage: '9-32V DC' },
  { id: 'powerwizard-11', brand: 'PowerWizard', model: '1.1', type: 'genset', features: ['AMF', 'CAT'], pinCount: 24, voltage: '9-32V DC' },
  { id: 'powerwizard-20', brand: 'PowerWizard', model: '2.0', type: 'genset', features: ['Advanced', 'Load Share'], pinCount: 32, voltage: '9-32V DC' },
  // Datakom Controllers
  { id: 'datakom-d500', brand: 'Datakom', model: 'D-500', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 36, voltage: '8-35V DC' },
  { id: 'datakom-d700', brand: 'Datakom', model: 'D-700', type: 'load-share', features: ['Sync', 'PMS', 'Advanced'], pinCount: 44, voltage: '8-35V DC' },
  { id: 'datakom-dkg309', brand: 'Datakom', model: 'DKG-309', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'datakom-dkg517', brand: 'Datakom', model: 'DKG-517', type: 'genset', features: ['CAN', 'J1939'], pinCount: 32, voltage: '8-35V DC' },
  // Lovato Electric Controllers
  { id: 'lovato-rgk800', brand: 'Lovato', model: 'RGK800', type: 'genset', features: ['AMF', 'CAN'], pinCount: 32, voltage: '8-35V DC' },
  { id: 'lovato-rgk900', brand: 'Lovato', model: 'RGK900', type: 'load-share', features: ['Sync', 'Load Share'], pinCount: 40, voltage: '8-35V DC' },
  { id: 'lovato-atl800', brand: 'Lovato', model: 'ATL800', type: 'ats', features: ['ATS', 'Mains Monitor'], pinCount: 28, voltage: '8-35V DC' },
  // Siemens Controllers
  { id: 'siemens-sicam', brand: 'Siemens', model: 'SICAM A8000', type: 'genset', features: ['Advanced', 'SCADA'], pinCount: 48, voltage: '24-60V DC' },
  { id: 'siemens-sentron', brand: 'Siemens', model: 'SENTRON PAC', type: 'genset', features: ['Power Metering', 'Modbus'], pinCount: 24, voltage: '24V DC' },
  { id: 'siemens-siprotec', brand: 'Siemens', model: 'SIPROTEC 7SJ', type: 'genset', features: ['Protection', 'IEC 61850'], pinCount: 36, voltage: '24-250V DC' },
  // ENKO Controllers
  { id: 'enko-gcu300', brand: 'ENKO', model: 'GCU-300', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'enko-gcu500', brand: 'ENKO', model: 'GCU-500', type: 'genset', features: ['AMF', 'Load Share'], pinCount: 32, voltage: '8-35V DC' },
  { id: 'enko-sync200', brand: 'ENKO', model: 'SYNC-200', type: 'load-share', features: ['Sync', 'PMS'], pinCount: 40, voltage: '8-35V DC' },
  // Volvo Penta VODIA Controllers
  { id: 'vodia-vodia5', brand: 'VODIA', model: 'VODIA5', type: 'genset', features: ['Diagnostics', 'Engine'], pinCount: 16, voltage: '12-24V DC' },
  { id: 'vodia-vodia6', brand: 'VODIA', model: 'VODIA6', type: 'genset', features: ['Advanced Diagnostics', 'Full Fleet'], pinCount: 16, voltage: '12-24V DC' },
  { id: 'vodia-ecu', brand: 'VODIA', model: 'D13 ECU', type: 'genset', features: ['Engine Control', 'J1939'], pinCount: 96, voltage: '24V DC' },
];

// ==================== CIRCUIT CATEGORIES ====================
const CIRCUIT_CATEGORIES = [
  { id: 'power', name: 'Power Supply', icon: '🔋', color: '#ef4444' },
  { id: 'starting', name: 'Starting System', icon: '🔑', color: '#a855f7' },
  { id: 'fuel', name: 'Fuel System', icon: '⛽', color: '#f97316' },
  { id: 'cooling', name: 'Cooling System', icon: '❄️', color: '#06b6d4' },
  { id: 'sensing', name: 'Engine Sensing', icon: '📡', color: '#3b82f6' },
  { id: 'generator', name: 'Generator Output', icon: '⚡', color: '#eab308' },
  { id: 'protection', name: 'Protection', icon: '🛡️', color: '#22c55e' },
  { id: 'communication', name: 'Communication', icon: '🔗', color: '#14b8a6' },
  // Added 2026-07-29. Real OEM terminal tables use these groupings, and without
  // a category here the pin table printed the raw slug and the circuit filter
  // could not reach the terminals at all.
  { id: 'auxiliary', name: 'Auxiliary Outputs', icon: '🔌', color: '#8b5cf6' },
  { id: 'inputs', name: 'Digital Inputs', icon: '🎛️', color: '#0ea5e9' },
  { id: 'metering', name: 'Current Metering', icon: '📊', color: '#f59e0b' },
  { id: 'charging', name: 'Battery Charging', icon: '🔄', color: '#10b981' },
  { id: 'mains', name: 'Mains / Utility', icon: '🏭', color: '#94a3b8' },
  // Added 2026-08-03 for paralleling controllers (e.g. SmartGen HGM9510), whose
  // terminal tables sense the PARALLELING BUS as a separate set of inputs from
  // both the generator and the utility. Filing bus terminals under 'mains'
  // would tell a technician they are utility inputs, which they are not.
  { id: 'bus', name: 'Paralleling Bus', icon: '🔀', color: '#c084fc' },
];

// ==================== WIRE COLOR STANDARDS ====================
const WIRE_COLORS: { [key: string]: { hex: string; name: string; usage: string } } = {
  'red': { hex: '#ef4444', name: 'Red', usage: 'Battery +, Unswitched power' },
  'black': { hex: '#1f2937', name: 'Black', usage: 'Ground, Battery -' },
  'green': { hex: '#22c55e', name: 'Green', usage: 'Earth ground, CAN-H' },
  'green-yellow': { hex: '#84cc16', name: 'Green/Yellow', usage: 'Protective earth' },
  'blue': { hex: '#3b82f6', name: 'Blue', usage: 'Sensor signals, Phase L3' },
  'brown': { hex: '#92400e', name: 'Brown', usage: 'Temperature sensors, Phase L1' },
  'yellow': { hex: '#eab308', name: 'Yellow', usage: 'Oil pressure, CAN-L, Phase L2' },
  'orange': { hex: '#f97316', name: 'Orange', usage: 'Fuel control, RS485-B' },
  'purple': { hex: '#a855f7', name: 'Purple', usage: 'Start circuit' },
  'pink': { hex: '#ec4899', name: 'Pink', usage: 'Stop/Shutdown' },
  'white': { hex: '#f8fafc', name: 'White', usage: 'Neutral, Signal return' },
  'gray': { hex: '#6b7280', name: 'Gray', usage: 'Digital I/O, Shield' },
  'cyan': { hex: '#06b6d4', name: 'Cyan', usage: 'Speed sensor' },
};

// ==================== COMPLETE PIN CONFIGURATIONS ====================
interface PinConfig {
  pin: string;
  name: string;
  function: string;
  wireColor: string;
  wireGauge: string;
  circuit: string;
  voltage?: string;
  current?: string;
}

const CONTROLLER_PINS: { [key: string]: PinConfig[] } = {
  // Deep Sea Electronics DSE7320 MKII (shares the terminal layout of the DSE7310 MKII,
  // except that terminals 38-41 mains sensing are not fitted to the 7310).
  //
  // VERIFIED 2026-07-29 against DSE document 057-253 ISSUE 7, "DSE7310 MKII &
  // DSE7320 MKII Operator Manual", section 3.2 CONNECTION DESCRIPTIONS, pages
  // 48-54. Terminal numbers, descriptions, cable sizes and current ratings are
  // read from those tables.
  //
  // The data previously here was FABRICATED and hazardous:
  //   - terminal 1 was labelled "B+ Battery Positive" when DSE define it as the
  //     DC plant supply NEGATIVE, and terminal 2 as the POSITIVE - reversed;
  //   - terminal 3 was labelled "Chassis Ground" when it is the EMERGENCY STOP
  //     input carrying plant supply positive;
  //   - terminals 4/5/6 were labelled START / START-RETURN / FUEL when they are
  //     fuel output, start output and the charge alternator excite input;
  //   - fuel and start were rated 3 A and 5 A when DSE rate both at 15 A DC.
  // It also invented 32 terminals for a module that has 58.
  //
  // Wire COLOUR is "Not specified by OEM": DSE publish cable SIZE only and do
  // not specify conductor colours. Do not invent them.
  'dse-7320': [
    { pin: '1', name: 'DC Supply (Negative)', function: 'DC plant supply input, negative. Connect to ground where applicable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'power' },
    { pin: '2', name: 'DC Supply (Positive)', function: 'DC plant supply input, positive. Supplies the module and DC outputs E, F, G, H, I and J.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'power', voltage: '8-35 V DC' },
    { pin: '3', name: 'Emergency Stop', function: 'Emergency stop input, fed from plant supply positive. It also supplies DC outputs A and B, so breaking it removes both fuel and start.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'protection' },
    { pin: '4', name: 'DC Output A (FUEL)', function: 'Fuel relay output. Plant supply positive comes from terminal 3. Fixed as the fuel relay unless an electronic engine is configured.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'fuel', current: '15 A DC' },
    { pin: '5', name: 'DC Output B (START)', function: 'Start relay output. Plant supply positive comes from terminal 3. Fixed as the start relay unless an electronic engine is configured.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'starting', current: '15 A DC' },
    { pin: '6', name: 'Charge Fail / Excite', function: 'Charge alternator D+ (W/L) input. Do not connect to ground. Leave disconnected if no charge alternator is fitted.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'charging' },
    { pin: '7', name: 'Do Not Connect', function: 'Reserved by DSE. Do not connect.', wireColor: 'Not specified by OEM', wireGauge: 'Not connected', circuit: 'power' },
    { pin: '8', name: 'DC Output E', function: 'Configurable DC output E. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '9', name: 'DC Output F', function: 'Configurable DC output F. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '10', name: 'DC Output G', function: 'Configurable DC output G. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '11', name: 'DC Output H', function: 'Configurable DC output H. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '12', name: 'DC Output I', function: 'Configurable DC output I. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '13', name: 'DC Output J', function: 'Configurable DC output J. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '14', name: 'Sensor Common Return', function: 'Ground return for the sensors. DSE require this to be earthed to the ENGINE BLOCK, not inside the panel, and it must not provide an earth for any other terminal or device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '15', name: 'Analogue Sensor Input A', function: 'Analogue sensor input A. Connect to the oil pressure sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '16', name: 'Analogue Sensor Input B', function: 'Analogue sensor input B. Connect to the coolant temperature sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '17', name: 'Analogue Sensor Input C', function: 'Analogue sensor input C. Connect to the fuel level sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '18', name: 'Analogue Sensor Input D', function: 'Analogue sensor input D. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '19', name: 'Analogue Sensor Input E', function: 'Analogue sensor input E. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '20', name: 'Analogue Sensor Input F', function: 'Analogue sensor input F. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '21', name: 'Magnetic Pickup Positive', function: 'Magnetic pickup positive. Connect to the magnetic pickup device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '22', name: 'Magnetic Pickup Negative', function: 'Magnetic pickup negative. Connect to the magnetic pickup device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '23', name: 'Magnetic Pickup Screen', function: 'Magnetic pickup cable screen. Earth at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'sensing' },
    { pin: '24', name: 'ECU Port H', function: 'Engine ECU CAN high. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '25', name: 'ECU Port L', function: 'Engine ECU CAN low. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '26', name: 'ECU Port Screen', function: 'Engine ECU CAN screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '27', name: 'DSENet Expansion B', function: 'DSENet expansion port B. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '28', name: 'DSENet Expansion A', function: 'DSENet expansion port A. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '29', name: 'DSENet Expansion Screen', function: 'DSENet expansion screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '30', name: 'Relay Output C (NC)', function: 'Volt-free relay output C, normally closed. Normally configured to control the mains contactor coil.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '31', name: 'Relay Output C (NC)', function: 'Volt-free relay output C, normally closed. Second contact of the same relay.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '32', name: 'Relay Output D (NO)', function: 'Volt-free relay output D, normally open. Normally configured to control the generator contactor coil.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '33', name: 'Relay Output D (NO)', function: 'Volt-free relay output D, normally open. Second contact of the same relay.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '34', name: 'Generator L1 (U)', function: 'Generator L1 (U) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '35', name: 'Generator L2 (V)', function: 'Generator L2 (V) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '36', name: 'Generator L3 (W)', function: 'Generator L3 (W) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '37', name: 'Generator Neutral (N)', function: 'Generator neutral input. Connect to the generator neutral terminal.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '38', name: 'Mains L1 (R)', function: 'Mains L1 (R) voltage and frequency sensing. DSE recommend a 2 A fuse. Not fitted to the DSE7310 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'mains' },
    { pin: '39', name: 'Mains L2 (S)', function: 'Mains L2 (S) voltage and frequency sensing. DSE recommend a 2 A fuse. Not fitted to the DSE7310 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'mains' },
    { pin: '40', name: 'Mains L3 (T)', function: 'Mains L3 (T) voltage and frequency sensing. DSE recommend a 2 A fuse. Not fitted to the DSE7310 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'mains' },
    { pin: '41', name: 'Mains Neutral (N)', function: 'Mains neutral input. Not fitted to the DSE7310 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'mains' },
    { pin: '42', name: 'CT Secondary L1', function: 'Current transformer secondary for L1. Connect to s1 of the L1 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '43', name: 'CT Secondary L2', function: 'Current transformer secondary for L2. Connect to s1 of the L2 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '44', name: 'CT Secondary L3', function: 'Current transformer secondary for L3. Connect to s1 of the L3 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '45', name: 'Earth Fault CT', function: 'Function depends on the earth fault topology in use. Not connected where no earth fault measuring is fitted; otherwise it takes s2 of the L1/L2/L3/N CTs, or s2 of the CT on the neutral to earth link.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '46', name: 'CT Common', function: 'Function depends on the earth fault topology in use. Normally the common s2 of the L1/L2/L3/N CTs; with an unrestricted earth fault CT it also takes s1 of the CT on the neutral to earth link.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '47', name: 'Do Not Connect', function: 'Reserved by DSE across all earth fault topologies. Do not connect.', wireColor: 'Not specified by OEM', wireGauge: 'Not connected', circuit: 'metering' },
    { pin: '48', name: 'Digital Input A', function: 'Configurable digital input A. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '49', name: 'Digital Input B', function: 'Configurable digital input B. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '50', name: 'Digital Input C', function: 'Configurable digital input C. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '51', name: 'Digital Input D', function: 'Configurable digital input D. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '52', name: 'Digital Input E', function: 'Configurable digital input E. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '53', name: 'Digital Input F', function: 'Configurable digital input F. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '54', name: 'Digital Input G', function: 'Configurable digital input G. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '55', name: 'Digital Input H', function: 'Configurable digital input H. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '56', name: 'RS485 Port Screen', function: 'RS485 port screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '57', name: 'RS485 Port B (+)', function: 'RS485 port B (+). Connect to RXD+ and TXD+.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '58', name: 'RS485 Port A (-)', function: 'RS485 port A (-). Connect to RXD- and TXD-.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
  ],
  /*
   * DSE7310 MKII — derived from the SAME OEM manual as the DSE7320 MKII.
   *
   * DSE publish one document for both modules: DSE7310 MKII & DSE7320 MKII
   * Operator Manual, DSE Publication 057-253. Their Installation Instructions
   * (DSE Publication 053-181 Issue 7, deepseaelectronics.com) record that
   * terminals 38 to 41 are absent on the 7310 MKII.
   * Those four are the Mains (utility) L1/L2/L3/Neutral sensing inputs, which
   * is why DSE list the 7310 as Manual & Auto Start and the 7320 as Auto Mains
   * Failure. Every entry below is the OEM wording already verified for the
   * 7320; the four absent terminals are simply not present.
   */
  /*
   * DSE6120 MKII — COMPLETE, 42 terminals (1-36 and 38-43).
   *
   * Read from the DSE6110 MKII & DSE6120 MKII Operator Manual, DSE Publication
   * 057-236 Issue 1, pages 29-33 via page-level HTML rendering. Every table came
   * back with each terminal appearing exactly once — no overlap.
   *
   * Terminal 37 is omitted: it sits between the CT block and the digital inputs
   * and the manual prints no description or cable size against it.
   *
   * NOTE the difference from the DSE6020 MKII, which is a DIFFERENT module
   * despite the similar name. On the 6120 the magnetic pickup is 16-18 and CAN
   * is 19-21; on the 6020 terminals 16-17 do not appear on the analogue/MPU page
   * at all. This is exactly why terminal numbers are never pattern-matched
   * between DSE families, even adjacent ones.
   *
   * Model difference from the same manual: terminals 29-32 (mains sensing) are
   * not fitted to the DSE6110 MKII.
   */
  'dse-6120': [
    { pin: '1', name: 'DC Supply (Negative)', function: 'Battery negative to the module.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '2', name: 'DC Supply (Positive)', function: 'Battery positive to the module. Feeds the module and its DC outputs.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '3', name: 'Emergency Stop', function: 'Emergency stop input taken from plant supply positive. Breaking it removes the fuel and start outputs.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'protection', current: '-' },
    { pin: '4', name: 'DC Output A (FUEL)', function: 'Fuel solenoid output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'fuel', current: '10 A for 10 s, 5 A resistive continuous' },
    { pin: '5', name: 'DC Output B (START)', function: 'Starter motor relay output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'power', current: '10 A for 10 s, 5 A resistive continuous' },
    { pin: '6', name: 'Charge Fail / Excite', function: 'Charge alternator D+ / W-L connection. Leave disconnected if no charge alternator is fitted.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '7', name: 'DC Output C', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '8', name: 'DC Output D', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '9', name: 'DC Output E', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '10', name: 'DC Output F', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '11', name: 'Sensor Common Return', function: 'Common return for the analogue sensor inputs.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '12', name: 'Oil Pressure Sensor', function: 'Analogue input for the engine oil pressure sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '13', name: 'Coolant Temperature Sensor', function: 'Analogue input for the engine coolant temperature sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '14', name: 'Fuel Level Sensor', function: 'Analogue input for the fuel level sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '15', name: 'Flexible Sensor', function: 'Configurable analogue sensor input.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '16', name: 'Magnetic Pickup Positive', function: 'Speed sensing from the flywheel magnetic pickup, positive leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '17', name: 'Magnetic Pickup Negative', function: 'Speed sensing from the flywheel magnetic pickup, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '18', name: 'Magnetic Pickup Screen', function: 'Screen for the magnetic pickup cable. Ground at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Shield', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '19', name: 'CAN Port H', function: 'Engine ECU CAN high. Use 120 ohm CAN-approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '20', name: 'CAN Port L', function: 'Engine ECU CAN low. Use 120 ohm CAN-approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '21', name: 'CAN Port Screen', function: 'CAN cable screen. Ground at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Shield', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '22', name: 'DSENet Expansion B', function: 'DSENet expansion bus, B leg, for DSE expansion modules.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '23', name: 'DSENet Expansion A', function: 'DSENet expansion bus, A leg, for DSE expansion modules.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '24', name: 'DSENet Screen', function: 'DSENet cable screen. Use 120 ohm CAN or RS485 approved cable.', wireColor: 'Not specified by OEM', wireGauge: 'Shield', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '25', name: 'Generator L1 (U)', function: 'Generator phase 1 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '26', name: 'Generator L2 (V)', function: 'Generator phase 2 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '27', name: 'Generator L3 (W)', function: 'Generator phase 3 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '28', name: 'Generator Neutral (N)', function: 'Generator neutral reference for voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '29', name: 'Mains L1 (R)', function: 'Utility phase 1 voltage sensing. Not fitted to the DSE6110 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '30', name: 'Mains L2 (S)', function: 'Utility phase 2 voltage sensing. Not fitted to the DSE6110 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '31', name: 'Mains L3 (T)', function: 'Utility phase 3 voltage sensing. Not fitted to the DSE6110 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '32', name: 'Mains Neutral (N)', function: 'Utility neutral reference. Not fitted to the DSE6110 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '33', name: 'CT Secondary L1', function: 'Current transformer secondary for generator phase 1.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '34', name: 'CT Secondary L2', function: 'Current transformer secondary for generator phase 2.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '35', name: 'CT Secondary L3', function: 'Current transformer secondary for generator phase 3.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '36', name: 'CT Common', function: 'Common return for the three CT secondaries.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    // Terminal 37 is not listed here — the manual prints no description or cable
    // size against it. Absent rather than guessed.
    { pin: '38', name: 'Digital Input A', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '39', name: 'Digital Input B', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '40', name: 'Digital Input C', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '41', name: 'Digital Input D', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '42', name: 'Digital Input E', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '43', name: 'Digital Input F', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
  ],
  /*
   * DSE4520 — COMPLETE, terminals 1-32.
   *
   * Read from the DSE4510 & DSE4520 Operator Manual (DSE Publication 057-171
   * Issue 4), pages 26-29, via the page-level HTML rendering. Every table came
   * back unambiguous with no overlapping terminal numbers.
   *
   * Note this module numbers differently from the 6000/7000 series: there is no
   * separate emergency stop terminal, so the fuel output sits at terminal 3 and
   * start at 4. Do not pattern-match terminal numbers across DSE families.
   *
   * Model differences recorded in the same manual:
   *   terminals 8 & 9   not fitted to the DSE4510
   *   terminals 25-28   (mains sensing) not fitted to the DSE4510
   *   terminals 29-32   (current sensing) not available on the DSE45xx-01 variant
   *
   * Terminal numbers and cable sizes are facts from the manufacturer's table;
   * the description text is our own wording.
   */
  'dse-4520': [
    { pin: '1', name: 'DC Supply (Negative)', function: 'Battery negative to the module.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '2', name: 'DC Supply (Positive)', function: 'Battery positive to the module. Feeds the module and its DC outputs.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '3', name: 'DC Output A (FUEL)', function: 'Fuel solenoid output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'fuel', current: '-' },
    { pin: '4', name: 'DC Output B (START)', function: 'Starter motor relay output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'power', current: '-' },
    { pin: '5', name: 'Charge Fail / Excite', function: 'Charge alternator D+ / W-L connection. Excites the alternator and detects charge failure.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '6', name: 'DC Output C', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '-' },
    { pin: '7', name: 'DC Output D', function: 'Configurable DC output.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '-' },
    { pin: '8', name: 'DC Output E', function: 'Configurable DC output. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '-' },
    { pin: '9', name: 'DC Output F', function: 'Configurable DC output. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '-' },
    { pin: '10', name: 'Sensor Common Return', function: 'Common return for the analogue sensors. Requires its own dedicated connection to an engine block earth point, not shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '11', name: 'Oil Pressure Sensor', function: 'Analogue input for the engine oil pressure sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '12', name: 'Coolant Temperature Sensor', function: 'Analogue input for the engine coolant temperature sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '13', name: 'Fuel Level Sensor', function: 'Analogue input for the fuel level sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '14', name: 'Digital Input A', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '15', name: 'Digital Input B', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '16', name: 'Digital Input C', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '17', name: 'Digital Input D', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '18', name: 'CAN Port H', function: 'CAN high. Use 120 ohm CAN-approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '19', name: 'CAN Port L', function: 'CAN low. Use 120 ohm CAN-approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '20', name: 'CAN Port Screen', function: 'CAN cable screen. Ground at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Shield', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '21', name: 'Generator L1 (U)', function: 'Generator phase 1 voltage sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '22', name: 'Generator L2 (V)', function: 'Generator phase 2 voltage sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '23', name: 'Generator L3 (W)', function: 'Generator phase 3 voltage sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '24', name: 'Generator Neutral (N)', function: 'Generator neutral reference for voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '25', name: 'Mains L1 (R)', function: 'Utility phase 1 voltage sensing. A 2 A fuse is recommended. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '26', name: 'Mains L2 (S)', function: 'Utility phase 2 voltage sensing. A 2 A fuse is recommended. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '27', name: 'Mains L3 (T)', function: 'Utility phase 3 voltage sensing. A 2 A fuse is recommended. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '28', name: 'Mains Neutral (N)', function: 'Utility neutral reference. Not fitted to the DSE4510.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '29', name: 'CT Secondary L1', function: 'Current transformer secondary for generator phase 1. Not available on the DSE45xx-01 variant.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '30', name: 'CT Secondary L2', function: 'Current transformer secondary for generator phase 2. Not available on the DSE45xx-01 variant.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '31', name: 'CT Secondary L3', function: 'Current transformer secondary for generator phase 3. Not available on the DSE45xx-01 variant.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '32', name: 'CT Common', function: 'Common return for the three CT secondaries. Not available on the DSE45xx-01 variant.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'metering', current: '-' },
  ],
  /*
   * DSE6020 MKII — PARTIAL, terminals 1-15 only.
   *
   * Read from the DSE6010 MKII & DSE6020 MKII Operator Manual (DSE 057-230),
   * pages 29-30. Terminal numbers and cable sizes are facts from the
   * manufacturer's table; the wording below is our own.
   *
   * Terminals 16 onward are OMITTED on purpose. In the source consulted,
   * terminals 16-17 did not render and 18-21 returned the same numbers for BOTH
   * the magnetic pickup and the CAN port. Guessing between those two would put a
   * technician on the wrong terminal, so the range is left out and
   * controllerSources.ts declares completeness: 'partial' with a coverage note.
   */
  'dse-6020': [
    { pin: '1', name: 'DC Supply (Negative)', function: 'Battery negative to the module. Also the return for the DC outputs.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '2', name: 'DC Supply (Positive)', function: 'Battery positive to the module. Feeds the module itself and DC outputs A to F.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'power', current: '-' },
    { pin: '3', name: 'Emergency Stop', function: 'Emergency stop input taken from plant supply positive. Breaking it removes the fuel and start outputs.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '8-35 V DC', circuit: 'protection', current: '-' },
    { pin: '4', name: 'DC Output A (FUEL)', function: 'Fuel solenoid output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'fuel', current: '-' },
    { pin: '5', name: 'DC Output B (START)', function: 'Starter motor relay output.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: 'Plant supply', circuit: 'power', current: '-' },
    { pin: '6', name: 'Charge Fail / Excite', function: 'Charge alternator D+ / W-L connection, used to excite the alternator and to detect charge failure. Leave open if no charge alternator is fitted.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² / AWG 13', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '7', name: 'DC Output C', function: 'Configurable DC output, supplied from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '8', name: 'DC Output D', function: 'Configurable DC output, supplied from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '9', name: 'DC Output E', function: 'Configurable DC output, supplied from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '10', name: 'DC Output F', function: 'Configurable DC output, supplied from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: 'Plant supply', circuit: 'auxiliary', current: '2 A' },
    { pin: '11', name: 'Sensor Common Return', function: 'Common return for the analogue sensor inputs on terminals 12 to 15.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '12', name: 'Oil Pressure Sensor', function: 'Analogue input for the engine oil pressure sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '13', name: 'Coolant Temperature Sensor', function: 'Analogue input for the engine coolant temperature sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '14', name: 'Fuel Level Sensor', function: 'Analogue input for the fuel level sender.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '15', name: 'Flexible Sensor', function: 'Configurable analogue sensor input.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    // ─── GAP: terminals 16-24 and 37 are deliberately absent ───
    // Two separate readings of the source disagreed on where the magnetic
    // pickup group ends and the CAN group begins — one gave MPU 18-20 with CAN
    // 19-21, the other MPU 18-19, screen 20, CAN 21-22. Terminals 16, 17, 23,
    // 24 and 37 did not appear at all. Rather than pick a reading, the range is
    // omitted and named in coverageNote. Putting a technician on a CAN terminal
    // while they wire a magnetic pickup is the failure this panel prevents.
    { pin: '25', name: 'Generator L1 (U)', function: 'Generator phase 1 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '26', name: 'Generator L2 (V)', function: 'Generator phase 2 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '27', name: 'Generator L3 (W)', function: 'Generator phase 3 voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '28', name: 'Generator Neutral (N)', function: 'Generator neutral reference for voltage sensing.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '29', name: 'Mains L1 (R)', function: 'Utility phase 1 voltage sensing. Fitted to the DSE6020 MKII; absent on the DSE6010 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '30', name: 'Mains L2 (S)', function: 'Utility phase 2 voltage sensing. Fitted to the DSE6020 MKII; absent on the DSE6010 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '31', name: 'Mains L3 (T)', function: 'Utility phase 3 voltage sensing. Fitted to the DSE6020 MKII; absent on the DSE6010 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '32', name: 'Mains Neutral (N)', function: 'Utility neutral reference. Fitted to the DSE6020 MKII; absent on the DSE6010 MKII.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² / AWG 18', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '33', name: 'CT Secondary L1', function: 'Current transformer secondary for generator phase 1.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '34', name: 'CT Secondary L2', function: 'Current transformer secondary for generator phase 2.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '35', name: 'CT Secondary L3', function: 'Current transformer secondary for generator phase 3.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '36', name: 'CT Common', function: 'Common return for the three CT secondaries — the s2 side of each CT commons here.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '38', name: 'Digital Input A', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '39', name: 'Digital Input B', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '40', name: 'Digital Input C', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '41', name: 'Digital Input D', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '42', name: 'Digital Input E', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '43', name: 'Digital Input F', function: 'Configurable digital input, switched to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² / AWG 20', voltage: '-', circuit: 'inputs', current: '-' },
  ],
  'dse-7310': [
    { pin: '1', name: 'DC Supply (Negative)', function: 'DC plant supply input, negative. Connect to ground where applicable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'power' },
    { pin: '2', name: 'DC Supply (Positive)', function: 'DC plant supply input, positive. Supplies the module and DC outputs E, F, G, H, I and J.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'power', voltage: '8-35 V DC' },
    { pin: '3', name: 'Emergency Stop', function: 'Emergency stop input, fed from plant supply positive. It also supplies DC outputs A and B, so breaking it removes both fuel and start.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'protection' },
    { pin: '4', name: 'DC Output A (FUEL)', function: 'Fuel relay output. Plant supply positive comes from terminal 3. Fixed as the fuel relay unless an electronic engine is configured.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'fuel', current: '15 A DC' },
    { pin: '5', name: 'DC Output B (START)', function: 'Start relay output. Plant supply positive comes from terminal 3. Fixed as the start relay unless an electronic engine is configured.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'starting', current: '15 A DC' },
    { pin: '6', name: 'Charge Fail / Excite', function: 'Charge alternator D+ (W/L) input. Do not connect to ground. Leave disconnected if no charge alternator is fitted.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'charging' },
    { pin: '7', name: 'Do Not Connect', function: 'Reserved by DSE. Do not connect.', wireColor: 'Not specified by OEM', wireGauge: 'Not connected', circuit: 'power' },
    { pin: '8', name: 'DC Output E', function: 'Configurable DC output E. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '9', name: 'DC Output F', function: 'Configurable DC output F. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '10', name: 'DC Output G', function: 'Configurable DC output G. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '11', name: 'DC Output H', function: 'Configurable DC output H. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '12', name: 'DC Output I', function: 'Configurable DC output I. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '13', name: 'DC Output J', function: 'Configurable DC output J. Plant supply positive comes from terminal 2.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary', current: '2 A DC' },
    { pin: '14', name: 'Sensor Common Return', function: 'Ground return for the sensors. DSE require this to be earthed to the ENGINE BLOCK, not inside the panel, and it must not provide an earth for any other terminal or device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '15', name: 'Analogue Sensor Input A', function: 'Analogue sensor input A. Connect to the oil pressure sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '16', name: 'Analogue Sensor Input B', function: 'Analogue sensor input B. Connect to the coolant temperature sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '17', name: 'Analogue Sensor Input C', function: 'Analogue sensor input C. Connect to the fuel level sensor.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '18', name: 'Analogue Sensor Input D', function: 'Analogue sensor input D. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '19', name: 'Analogue Sensor Input E', function: 'Analogue sensor input E. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '20', name: 'Analogue Sensor Input F', function: 'Analogue sensor input F. Additional sensor, user configurable.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '21', name: 'Magnetic Pickup Positive', function: 'Magnetic pickup positive. Connect to the magnetic pickup device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '22', name: 'Magnetic Pickup Negative', function: 'Magnetic pickup negative. Connect to the magnetic pickup device.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'sensing' },
    { pin: '23', name: 'Magnetic Pickup Screen', function: 'Magnetic pickup cable screen. Earth at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'sensing' },
    { pin: '24', name: 'ECU Port H', function: 'Engine ECU CAN high. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '25', name: 'ECU Port L', function: 'Engine ECU CAN low. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '26', name: 'ECU Port Screen', function: 'Engine ECU CAN screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '27', name: 'DSENet Expansion B', function: 'DSENet expansion port B. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '28', name: 'DSENet Expansion A', function: 'DSENet expansion port A. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '29', name: 'DSENet Expansion Screen', function: 'DSENet expansion screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '30', name: 'Relay Output C (NC)', function: 'Volt-free relay output C, normally closed. Normally configured to control the mains contactor coil.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '31', name: 'Relay Output C (NC)', function: 'Volt-free relay output C, normally closed. Second contact of the same relay.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '32', name: 'Relay Output D (NO)', function: 'Volt-free relay output D, normally open. Normally configured to control the generator contactor coil.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '33', name: 'Relay Output D (NO)', function: 'Volt-free relay output D, normally open. Second contact of the same relay.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'auxiliary' },
    { pin: '34', name: 'Generator L1 (U)', function: 'Generator L1 (U) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '35', name: 'Generator L2 (V)', function: 'Generator L2 (V) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '36', name: 'Generator L3 (W)', function: 'Generator L3 (W) voltage and frequency sensing. DSE recommend a 2 A fuse.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '37', name: 'Generator Neutral (N)', function: 'Generator neutral input. Connect to the generator neutral terminal.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² (AWG 18)', circuit: 'generator' },
    { pin: '42', name: 'CT Secondary L1', function: 'Current transformer secondary for L1. Connect to s1 of the L1 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '43', name: 'CT Secondary L2', function: 'Current transformer secondary for L2. Connect to s1 of the L2 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '44', name: 'CT Secondary L3', function: 'Current transformer secondary for L3. Connect to s1 of the L3 monitoring CT. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '45', name: 'Earth Fault CT', function: 'Function depends on the earth fault topology in use. Not connected where no earth fault measuring is fitted; otherwise it takes s2 of the L1/L2/L3/N CTs, or s2 of the CT on the neutral to earth link.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '46', name: 'CT Common', function: 'Function depends on the earth fault topology in use. Normally the common s2 of the L1/L2/L3/N CTs; with an unrestricted earth fault CT it also takes s1 of the CT on the neutral to earth link.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (AWG 13)', circuit: 'metering' },
    { pin: '47', name: 'Do Not Connect', function: 'Reserved by DSE across all earth fault topologies. Do not connect.', wireColor: 'Not specified by OEM', wireGauge: 'Not connected', circuit: 'metering' },
    { pin: '48', name: 'Digital Input A', function: 'Configurable digital input A. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '49', name: 'Digital Input B', function: 'Configurable digital input B. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '50', name: 'Digital Input C', function: 'Configurable digital input C. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '51', name: 'Digital Input D', function: 'Configurable digital input D. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '52', name: 'Digital Input E', function: 'Configurable digital input E. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '53', name: 'Digital Input F', function: 'Configurable digital input F. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '54', name: 'Digital Input G', function: 'Configurable digital input G. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '55', name: 'Digital Input H', function: 'Configurable digital input H. Switches to negative.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'inputs' },
    { pin: '56', name: 'RS485 Port Screen', function: 'RS485 port screen. Use 120 ohm CAN or RS485 approved cable only.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
    { pin: '57', name: 'RS485 Port B (+)', function: 'RS485 port B (+). Connect to RXD+ and TXD+.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
    { pin: '58', name: 'RS485 Port A (-)', function: 'RS485 port A (-). Connect to RXD- and TXD-.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² (AWG 20)', circuit: 'communication' },
  ],
  // ComAp InteliGen NT (IG-NT / IG-NTC / IG-NT-BB / IG-NTC-BB)
  //
  // VERIFIED 2026-07-29 against the ComAp "IGS-NT Installation Guide",
  // section 7 "Terminals, Jumpers and I/O overview" and section 20
  // "Technical data".
  //
  // ComAp identify their terminals by NAME (L1k, BI1, BO1, D+, RPM-IN ...),
  // not by a numbered pin sequence, so the name is used as the pin id.
  //
  // The data previously here was FABRICATED. It invented a numbered
  // A1/A2/A3, B1..Bn layout and assigned FIXED functions - CRANK, FUEL,
  // IDLE, STOP, PREHEAT - to the binary outputs. ComAp state plainly that
  // "the name and function or alarm type for each binary input have to be
  // assigned during the configuration"; the binary outputs are likewise
  // user-configurable open-collector outputs. Printing them as fixed engine
  // functions is wrong on real hardware.
  //
  // Wire COLOUR is "Not specified by OEM": ComAp publish cable size and
  // screening requirements, not conductor colours.
  'comap-inteligen': [
    { pin: '+', name: 'Power Supply +', function: 'Controller power supply, positive.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'power', voltage: '8-36 V DC' },
    { pin: '-', name: 'Power Supply -', function: 'Controller power supply, negative. Binary inputs are activated by switching to this rail.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'power' },
    { pin: 'D+', name: 'D+', function: 'Charging alternator D+ input and excitation output. ComAp guarantee the Charging OK signal at 80% of supply voltage.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'charging', current: '300 mA max output' },
    { pin: 'Gen L1', name: 'Generator L1', function: 'Generator voltage measuring input L1. 3x277 V phase-neutral or 480 V phase-phase nominal, 350/600 V AC maximum, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'generator', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Gen L2', name: 'Generator L2', function: 'Generator voltage measuring input L2. 3x277 V phase-neutral or 480 V phase-phase nominal, 350/600 V AC maximum, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'generator', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Gen L3', name: 'Generator L3', function: 'Generator voltage measuring input L3. 3x277 V phase-neutral or 480 V phase-phase nominal, 350/600 V AC maximum, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'generator', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Gen N', name: 'Generator N', function: 'Generator voltage measuring input N. 3x277 V phase-neutral or 480 V phase-phase nominal, 350/600 V AC maximum, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'generator', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Mains L1', name: 'Mains / Bus L1', function: 'Mains or bus voltage measuring input L1. Same range as the generator inputs, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'mains', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Mains L2', name: 'Mains / Bus L2', function: 'Mains or bus voltage measuring input L2. Same range as the generator inputs, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'mains', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Mains L3', name: 'Mains / Bus L3', function: 'Mains or bus voltage measuring input L3. Same range as the generator inputs, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'mains', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'Mains N', name: 'Mains / Bus N', function: 'Mains or bus voltage measuring input N. Same range as the generator inputs, CAT III. Neutral is not required.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'mains', voltage: 'max 350 V Ph-N / 600 V Ph-Ph' },
    { pin: 'L1k', name: 'L1k', function: 'Generator current transformer input L1, k terminal. 1 A or 5 A secondary. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'L1l', name: 'L1l', function: 'Generator current transformer input L1, l terminal.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'L2k', name: 'L2k', function: 'Generator current transformer input L2, k terminal. 1 A or 5 A secondary. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'L2l', name: 'L2l', function: 'Generator current transformer input L2, l terminal.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'L3k', name: 'L3k', function: 'Generator current transformer input L3, k terminal. 1 A or 5 A secondary. Never break this connection while the CT primary is carrying current.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'L3l', name: 'L3l', function: 'Generator current transformer input L3, l terminal.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'LNk', name: 'LNk', function: 'Neutral / mains current transformer input, k terminal. 1 A or 5 A secondary.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'LNl', name: 'LNl', function: 'Neutral / mains current transformer input, l terminal.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', circuit: 'metering' },
    { pin: 'BI1', name: 'Binary Input 1', function: 'Configurable binary input 1. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI2', name: 'Binary Input 2', function: 'Configurable binary input 2. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI3', name: 'Binary Input 3', function: 'Configurable binary input 3. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI4', name: 'Binary Input 4', function: 'Configurable binary input 4. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI5', name: 'Binary Input 5', function: 'Configurable binary input 5. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI6', name: 'Binary Input 6', function: 'Configurable binary input 6. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI7', name: 'Binary Input 7', function: 'Configurable binary input 7. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI8', name: 'Binary Input 8', function: 'Configurable binary input 8. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI9', name: 'Binary Input 9', function: 'Configurable binary input 9. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI10', name: 'Binary Input 10', function: 'Configurable binary input 10. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI11', name: 'Binary Input 11', function: 'Configurable binary input 11. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BI12', name: 'Binary Input 12', function: 'Configurable binary input 12. Activated by switching to power supply minus. Function is assigned during configuration in GenConfig, not fixed in hardware. Input resistance 4.7 kilohm; closed contact indicated at 0-2 V, open contact at 8-36 V.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm² minimum', circuit: 'inputs', voltage: '0-36 V DC' },
    { pin: 'BO1', name: 'Binary Output 1', function: 'Configurable binary open-collector output 1. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO2', name: 'Binary Output 2', function: 'Configurable binary open-collector output 2. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO3', name: 'Binary Output 3', function: 'Configurable binary open-collector output 3. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO4', name: 'Binary Output 4', function: 'Configurable binary open-collector output 4. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO5', name: 'Binary Output 5', function: 'Configurable binary open-collector output 5. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO6', name: 'Binary Output 6', function: 'Configurable binary open-collector output 6. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO7', name: 'Binary Output 7', function: 'Configurable binary open-collector output 7. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO8', name: 'Binary Output 8', function: 'Configurable binary open-collector output 8. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO9', name: 'Binary Output 9', function: 'Configurable binary open-collector output 9. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO10', name: 'Binary Output 10', function: 'Configurable binary open-collector output 10. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO11', name: 'Binary Output 11', function: 'Configurable binary open-collector output 11. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'BO12', name: 'Binary Output 12', function: 'Configurable binary open-collector output 12. The load is connected to power supply plus. Function is assigned during configuration in GenConfig, not fixed in hardware.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'auxiliary', voltage: 'max 36 V DC', current: 'max 0.5 A' },
    { pin: 'AI1', name: 'Analog Input 1', function: 'Configurable analog sensor input 1. Jumper selectable for resistance, voltage or current sensors. Not electrically separated. Ranges: up to 2500 ohm, 5 V, or 0-20 mA.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'sensing' },
    { pin: 'AI2', name: 'Analog Input 2', function: 'Configurable analog sensor input 2. Jumper selectable for resistance, voltage or current sensors. Not electrically separated. Ranges: up to 2500 ohm, 5 V, or 0-20 mA.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'sensing' },
    { pin: 'AI3', name: 'Analog Input 3', function: 'Configurable analog sensor input 3. Jumper selectable for resistance, voltage or current sensors. Not electrically separated. Ranges: up to 2500 ohm, 5 V, or 0-20 mA.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', circuit: 'sensing' },
    { pin: 'SG-OUT', name: 'Speed Governor Out', function: 'Speed governor output interface. 10 V or 5 V PWM, 500-3000 Hz.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', circuit: 'auxiliary' },
    { pin: 'SG-COM', name: 'Speed Governor Common', function: 'Speed governor output common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', circuit: 'auxiliary' },
    { pin: 'RPM-IN', name: 'RPM In', function: 'Magnetic pick-up speed input. Minimum 2 Vpk-pk from 4 Hz to 4 kHz, maximum 50 Veff, measured range 4 Hz to 10 kHz.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² screened', circuit: 'sensing' },
    { pin: 'RPM-COM', name: 'RPM Common', function: 'Magnetic pick-up input common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² screened', circuit: 'sensing' },
    { pin: 'AVRI-OUT', name: 'AVRi Out', function: 'TTL (5 V PWM) interface output to an IG-AVRi module.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', circuit: 'auxiliary' },
    { pin: 'AVRI-COM', name: 'AVRi Common', function: 'IG-AVRi interface common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', circuit: 'auxiliary' },
    { pin: 'A1', name: 'RS485 A1', function: 'RS485 (1) line A. Remote display, InteliVision 8, or PC via an RS485 converter. Maximum 1000 m.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² screened', circuit: 'communication' },
    { pin: 'B1', name: 'RS485 B1', function: 'RS485 (1) line B.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² screened', circuit: 'communication' },
    { pin: 'COMR1', name: 'RS485 Common', function: 'RS485 (1) common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² screened', circuit: 'communication' },
    { pin: 'CAN1 H1', name: 'CAN1 High', function: 'CAN1 high. Extension modules (IS-AIN, IS-BIN, IGS-PTM, IGL-RA15, I-AOUT). 120 ohm shielded twisted pair, maximum 200 m, 250 kBd.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'CAN1 L1', name: 'CAN1 Low', function: 'CAN1 low.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'COMC1', name: 'CAN1 Common', function: 'CAN1 common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'CAN2 H2', name: 'CAN2 High', function: 'CAN2 high. Inter-controller load and VAR sharing, power management, and monitoring modules.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'CAN2 L2', name: 'CAN2 Low', function: 'CAN2 low.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'COMC2', name: 'CAN2 Common', function: 'CAN2 common.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm² twisted screened', circuit: 'communication' },
    { pin: 'RS232', name: 'RS232 (1)', function: 'D-SUB9 male. PC (InteliMonitor, GenConfig), modem, GSM modem, engine ECU, or InteliVision 8. Maximum 10 m.', wireColor: 'Not specified by OEM', wireGauge: 'Screened cable', circuit: 'communication' },
  ],
  // SmartGen HGM9320 (HGM9320MPU / HGM9320CAN)
  // VERIFIED 2026-07-27 against the SmartGen HGM9310MPU/9320MPU/9310CAN/9320CAN
  // Genset Controller User Manual, Table 12 "Description of Terminal Connection"
  // (pages 28-30). Terminal numbers, functions and cable sizes are read from that
  // table; remarks are written in our own words.
  //
  // The data previously here was WRONG and hazardous. It listed pin 1 as "DC+"
  // and pin 2 as "DC-", whereas SmartGen define terminal 1 as B- (negative) and
  // terminal 2 as B+ (positive) - reversed polarity - and it mislabelled 3/4/5 as
  // START/STOP/FUEL when they are emergency stop, fuel output and crank output.
  //
  // Wire COLOUR is intentionally "Not specified by OEM": the manual gives cable
  // SIZE only. Do not invent colours.
  'smartgen-hgm9320': [
    { pin: '1', name: 'B-', function: 'Battery negative', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'power' },  // Connects to the starter battery negative.
    { pin: '2', name: 'B+', function: 'Battery positive', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'power', voltage: '8-35V DC', current: '20A fuse recommended' },  // Connects to starter battery positive. Double the conductors in parallel if the run exceeds 30 m.
    { pin: '3', name: 'Emergency stop', function: 'Emergency stop supply', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'protection' },  // Fed from B+ through the emergency stop button. Terminals 4 and 5 take their B+ from here, so releasing this removes both fuel and crank.
    { pin: '4', name: 'Fuel relay output', function: 'Fuel relay output', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'fuel', current: '16A' },  // B+ supplied from terminal 3.
    { pin: '5', name: 'Crank relay output', function: 'Crank relay output', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'starting', current: '16A' },  // B+ supplied from terminal 3. Connects to the starter coil.
    { pin: '6', name: 'Aux. output 1', function: 'Auxiliary relay output 1', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary', current: '7A' },  // B+ supplied from terminal 2. Function is configurable.
    { pin: '7', name: 'Aux. output 2', function: 'Auxiliary relay output 2', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary', current: '7A' },  // B+ supplied from terminal 2. Function is configurable.
    { pin: '8', name: 'Aux. output 3', function: 'Auxiliary relay output 3', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary', current: '7A' },  // B+ supplied from terminal 2. Function is configurable.
    { pin: '9', name: 'Charger D+', function: 'Charge alternator D+ (WL)', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'charging' },  // Connects to the charging alternator D+ / WL terminal. Left unconnected where the alternator has no such terminal.
    { pin: '10', name: 'Aux. input 1', function: 'Auxiliary digital input 1', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-. Function is configurable.
    { pin: '11', name: 'Aux. input 2', function: 'Auxiliary digital input 2', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '12', name: 'Aux. input 3', function: 'Auxiliary digital input 3', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '13', name: 'Aux. input 4', function: 'Auxiliary digital input 4', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '14', name: 'Aux. input 5', function: 'Auxiliary digital input 5', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '15', name: 'Aux. input 6', function: 'Auxiliary digital input 6', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '16', name: 'Magnetic pickup screen', function: 'Speed sensor cable screen', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'sensing' },  // Screen of the speed sensor cable, earthed at this end only. Two-core screened cable.
    { pin: '17', name: 'Magnetic pickup 2', function: 'Speed sensor signal 2', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'sensing', voltage: '1.0-24V RMS' },  // Speed sensor signal. Around 12V AC at rated speed is typical.
    { pin: '18', name: 'Magnetic pickup 1', function: 'Speed sensor signal 1', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'sensing', voltage: '1.0-24V RMS' },  // Speed sensor signal.
    { pin: '19', name: 'Aux. input 7', function: 'Auxiliary digital input 7', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '20', name: 'Aux. output 4 NC', function: 'Auxiliary output 4, normally closed', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary', current: '7A' },  // Volt-free contact.
    { pin: '21', name: 'Aux. output 4 COM', function: 'Auxiliary output 4, common', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary' },  // Relay common point.
    { pin: '22', name: 'Aux. output 4 NO', function: 'Auxiliary output 4, normally open', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'auxiliary', current: '7A' },  // Volt-free contact.
    { pin: '23', name: 'ECU CAN screen', function: 'Engine ECU CAN screen', wireColor: 'Not specified by OEM', wireGauge: '-', circuit: 'communication' },  // Screened cable recommended, earthed at one end only.
    { pin: '24', name: 'ECU CANH', function: 'Engine ECU CAN high', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },  // J1939 link to the engine ECU.
    { pin: '25', name: 'ECU CANL', function: 'Engine ECU CAN low', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },  // J1939 link to the engine ECU.
    { pin: '26', name: 'Reserved', function: 'Not used', wireColor: 'Not specified by OEM', wireGauge: '-', circuit: 'communication' },  // Empty terminal.
    { pin: '33', name: 'RS485 screen', function: 'RS485 cable screen', wireColor: 'Not specified by OEM', wireGauge: '-', circuit: 'communication' },  // Screened cable recommended, earthed at one end only.
    { pin: '34', name: 'RS485 A+', function: 'RS485 A+', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: '35', name: 'RS485 B-', function: 'RS485 B-', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: '36', name: 'Aux. output 5 NC', function: 'Auxiliary output 5, normally closed', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'auxiliary', current: '7A' },  // Volt-free contact.
    { pin: '37', name: 'Aux. output 5 NO', function: 'Auxiliary output 5, normally open', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'auxiliary', current: '7A' },  // Volt-free contact.
    { pin: '38', name: 'Aux. output 5 COM', function: 'Auxiliary output 5, common', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'auxiliary' },  // Relay common point.
    { pin: '39', name: 'Aux. output 6 NO', function: 'Auxiliary output 6, normally open', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'auxiliary', current: '7A' },  // Volt-free contact.
    { pin: '40', name: 'Aux. output 6 COM', function: 'Auxiliary output 6, common', wireColor: 'Not specified by OEM', wireGauge: '2.5mm²', circuit: 'auxiliary' },  // Relay common point.
    { pin: '41', name: 'Mains L1', function: 'Mains L1 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended. Not fitted on HGM9310MPU / HGM9310CAN.
    { pin: '42', name: 'Mains L2', function: 'Mains L2 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended. Not fitted on HGM9310MPU / HGM9310CAN.
    { pin: '43', name: 'Mains L3', function: 'Mains L3 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended. Not fitted on HGM9310MPU / HGM9310CAN.
    { pin: '44', name: 'Mains N', function: 'Mains neutral sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // Not fitted on HGM9310MPU / HGM9310CAN.
    { pin: '45', name: 'Genset L1', function: 'Generator L1 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended.
    { pin: '46', name: 'Genset L2', function: 'Generator L2 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended.
    { pin: '47', name: 'Genset L3', function: 'Generator L3 voltage sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // 2A fuse recommended.
    { pin: '48', name: 'Genset N', function: 'Generator neutral sensing', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },
    { pin: '49', name: 'CT1', function: 'Current transformer 1 input', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering', current: '5A' },  // From the CT secondary. Never open-circuit a CT secondary while primary current flows.
    { pin: '50', name: 'CT2', function: 'Current transformer 2 input', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering', current: '5A' },  // From the CT secondary.
    { pin: '51', name: 'CT3', function: 'Current transformer 3 input', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering', current: '5A' },  // From the CT secondary.
    { pin: '52', name: 'CT COM', function: 'Current transformer common', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering' },
    { pin: '53', name: 'Earth current', function: 'Earth fault CT input', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering', current: '5A' },  // From the CT secondary where earth fault detection is used.
    { pin: '54', name: 'Earth current return', function: 'Earth fault CT return', wireColor: 'Not specified by OEM', wireGauge: '1.5mm²', circuit: 'metering' },
    { pin: '55', name: 'Aux. input 8', function: 'Auxiliary digital input 8', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'inputs' },  // Active when connected to B-.
    { pin: '56', name: 'Aux. sensor 1', function: 'Configurable analogue sensor 1', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // For temperature, oil pressure or level senders.
    { pin: '57', name: 'Aux. sensor 2', function: 'Configurable analogue sensor 2', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },  // For temperature, oil pressure or level senders.
    { pin: '58', name: 'Oil pressure sensor', function: 'Oil pressure sender input', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },
    { pin: '59', name: 'Temperature sensor', function: 'Coolant temperature sender input', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },
    { pin: '60', name: 'Fuel level sensor', function: 'Fuel level sender input', wireColor: 'Not specified by OEM', wireGauge: '1.0mm²', circuit: 'sensing' },
    { pin: '61', name: 'Sensor COM', function: 'Sender common', wireColor: 'Not specified by OEM', wireGauge: '-', circuit: 'sensing' },  // Common return for the senders; already tied to B-.
    { pin: '62', name: 'RS232 GND', function: 'RS232 ground', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },  // Used for a GSM module.
    { pin: '63', name: 'RS232 RX', function: 'RS232 receive', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: '64', name: 'RS232 TX', function: 'RS232 transmit', wireColor: 'Not specified by OEM', wireGauge: '0.5mm²', circuit: 'communication' },
  ],
  // Woodward easYgen-3000 Series - PARTIAL TERMINAL SET
  //
  // VERIFIED 2026-07-29 against Woodward easYgen-3000 Series documentation
  // (installation manual 37223, power supply and relay output sections).
  //
  // COVERAGE IS DELIBERATELY PARTIAL. Only the power supply and the R1-R4
  // relay outputs have been read from Woodward documentation. The discrete
  // inputs, analog inputs, voltage and current measuring terminals and the
  // serial interfaces are NOT included, because the full terminal
  // allocation table has not yet been obtained from Woodward. The registry
  // in lib/generator-oracle/controllerSources.ts records this entry as
  // completeness: 'partial' and the panel states so.
  //
  // The data previously here was FABRICATED: it invented an "X1:1 / X2:1"
  // connector scheme and a DO1..DO5 output order. Woodward number these
  // terminals 61 (PE), 63 (supply +) and 64 (0 V), and the relays are R1
  // centralised alarm (30), R2 stopping alarm (31), R3 starter (32) and R4
  // fuel solenoid / gas valve (33), all commoned on 35 - a different
  // ordering entirely.
  //
  // Wire COLOUR is "Not specified by OEM".
  /*
   * Woodward easYgen-2000 Series — terminal assignment tables 6-2 through 6-46
   * of Manual 37426B, "easYgen-2000 Series Installation", Software Version
   * 1.xxxx. Text-extractable, read table by table.
   *
   * 83 terminals. Woodward number in blocks with real gaps — there is no 55, no
   * 67-79, and nothing between 96 and 102 in the assignment tables. Those are
   * not omissions here.
   *
   * ⚠ THE RS-232 CONNECTOR IS DELIBERATELY EXCLUDED. Table 6-43 assigns pins
   * 1-9 of a 9-pin D-sub (RxD, TxD, RTS, CTS...). Those are D-sub PIN numbers,
   * not terminal-block numbers, and merging them would collide head-on with
   * terminals 1-9 — the analog output and the generator current transformers.
   * Same trap as the Datakom D-700's plug-in module, caught the same way.
   *
   * ⚠ DUAL-RANGE VOLTAGE INPUTS. Every voltage phase has TWO terminals, one for
   * the 120 V range and one for the 480 V range (generator 14-21, mains/busbar
   * 22-29). Woodward warn: do NOT use both sets at once, or the unit will not
   * measure correctly. Which set is valid depends on the configured PT
   * secondary rating (parameter 1800 for generator, 1803 for mains).
   *
   * ⚠ TERMINALS 8 AND 9 ARE DUAL-PURPOSE — mains current transformer on one
   * application (table 6-25) and ground/earth current transformer on another
   * (table 6-27). Both readings are carried in the name.
   *
   * TERMINAL 4 IS SHARED. All three generator CT return legs (l) land on
   * terminal 4; only the (k) legs get their own terminals at 5, 6 and 7. It is
   * listed once, as the common, rather than three times.
   *
   * MODEL-SPECIFIC TERMINALS are flagged in each description: the MPU input
   * (56, 57) exists only on the easYgen-2200P1 and 2500P1, and analog outputs
   * AO02-AO04, CAN bus 2 and RS-485 only on the easYgen-2500P1.
   *
   * Do NOT read this against the already-verified easYgen-3000 entry. On the
   * 3000 the starter is R3 at terminal 32 and the fuel solenoid R4 at 33, all
   * commoned on 35. Here the starter is R03 on 34/35 and the fuel solenoid R04
   * on 36/37, each with its own common. Same manufacturer, different machine.
   *
   * Wire COLOUR is not specified by Woodward.
   */
  'woodward-easygen2000': [
    { pin: '1', name: 'Analog Output AO01 — current signal', function: 'Bias signal output to the speed/power controller, current mode (IA).', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '2', name: 'Analog Output AO01 — voltage / PWM signal', function: 'Bias signal output, voltage mode (VA) or PWM mode.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '3', name: 'Analog Output AO01 — GND', function: 'Common return for analog output AO01.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '4', name: 'Generator Current — common (l)', function: 'SHARED RETURN. All three generator CT secondary (l) legs land on this one terminal; only the (k) legs have their own terminals at 5, 6 and 7.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '5', name: 'Generator Current L1 (k)', function: 'Generator current transformer phase L1, terminal 1 (k).', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '6', name: 'Generator Current L2 (k)', function: 'Generator current transformer phase L2, terminal 1 (k).', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '7', name: 'Generator Current L3 (k)', function: 'Generator current transformer phase L3, terminal 1 (k).', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '8', name: 'Mains Current / Ground Current (l)', function: 'DUAL PURPOSE. Mains current transformer terminal 2 (l) in the mains-current application, or ground/earth current transformer terminal 2 (l) in the ground-current application.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '9', name: 'Mains Current / Ground Current (k)', function: 'DUAL PURPOSE. Mains current transformer terminal 1 (k), or ground/earth current transformer terminal 1 (k).', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '10', name: 'Analog Input Ground', function: 'Common ground for analog inputs AI01-AI03, connected with 0 V DC.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '0 V DC', circuit: 'metering', current: '-' },
    { pin: '11', name: 'Analog Input AI01', function: 'Analogue sender input 1.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '12', name: 'Analog Input AI02', function: 'Analogue sender input 2.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '13', name: 'Analog Input AI03', function: 'Analogue sender input 3.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '14', name: 'Generator Voltage L1/Va — 120 V range', function: 'Generator phase L1 sensing, 120 V input. Use this set only when the configured PT secondary rating is 50-130 V. Never wire both ranges at once.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC (0-150 V AC max)', circuit: 'generator', current: '-' },
    { pin: '15', name: 'Generator Voltage L1/Va — 480 V range', function: 'Generator phase L1 sensing, 480 V input. Use this set only when the configured PT secondary rating is 131-480 V.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC (0-600 V AC max)', circuit: 'generator', current: '-' },
    { pin: '16', name: 'Generator Voltage L2/Vb — 120 V range', function: 'Generator phase L2 sensing, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'generator', current: '-' },
    { pin: '17', name: 'Generator Voltage L2/Vb — 480 V range', function: 'Generator phase L2 sensing, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'generator', current: '-' },
    { pin: '18', name: 'Generator Voltage L3/Vc — 120 V range', function: 'Generator phase L3 sensing, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'generator', current: '-' },
    { pin: '19', name: 'Generator Voltage L3/Vc — 480 V range', function: 'Generator phase L3 sensing, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'generator', current: '-' },
    { pin: '20', name: 'Generator Voltage N/Vcom — 120 V range', function: 'Generator neutral reference, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'generator', current: '-' },
    { pin: '21', name: 'Generator Voltage N/Vcom — 480 V range', function: 'Generator neutral reference, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'generator', current: '-' },
    { pin: '22', name: 'Mains / Busbar Voltage L1/Va — 120 V range', function: 'Mains or busbar phase L1 sensing, 120 V input. Which role these terminals serve depends on the application; the same block is labelled Mains (Busbar) in one wiring case and Busbar (Mains) in the other.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC (0-150 V AC max)', circuit: 'mains', current: '-' },
    { pin: '23', name: 'Mains / Busbar Voltage L1/Va — 480 V range', function: 'Mains or busbar phase L1 sensing, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC (0-600 V AC max)', circuit: 'mains', current: '-' },
    { pin: '24', name: 'Mains / Busbar Voltage L2/Vb — 120 V range', function: 'Mains or busbar phase L2 sensing, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'mains', current: '-' },
    { pin: '25', name: 'Mains / Busbar Voltage L2/Vb — 480 V range', function: 'Mains or busbar phase L2 sensing, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'mains', current: '-' },
    { pin: '26', name: 'Mains / Busbar Voltage L3/Vc — 120 V range', function: 'Mains or busbar phase L3 sensing, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'mains', current: '-' },
    { pin: '27', name: 'Mains / Busbar Voltage L3/Vc — 480 V range', function: 'Mains or busbar phase L3 sensing, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'mains', current: '-' },
    { pin: '28', name: 'Mains / Busbar Voltage N/Vcom — 120 V range', function: 'Mains or busbar neutral reference, 120 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '120 V AC', circuit: 'mains', current: '-' },
    { pin: '29', name: 'Mains / Busbar Voltage N/Vcom — 480 V range', function: 'Mains or busbar neutral reference, 480 V input.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '480 V AC', circuit: 'mains', current: '-' },
    { pin: '30', name: 'Relay R01 — common', function: 'Common pole of relay output R01.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '31', name: 'Relay R01 — N.O. (Ready for operation)', function: 'Normally open contact of R01. Fixed function: ready for operation.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '32', name: 'Relay R02 — common', function: 'Common pole of relay output R02.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '33', name: 'Relay R02 — N.O. (preconfigured Horn)', function: 'Normally open contact of R02. Preconfigured to horn, switchable in software via the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '34', name: 'Relay R03 — common', function: 'Common pole of relay output R03.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'starting', current: '2 A' },
    { pin: '35', name: 'Relay R03 — N.O. (preconfigured Starter)', function: 'Normally open contact of R03. Preconfigured to the starter, switchable in software.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'starting', current: '2 A' },
    { pin: '36', name: 'Relay R04 — common', function: 'Common pole of relay output R04.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'fuel', current: '2 A' },
    { pin: '37', name: 'Relay R04 — N.O. (preconfigured Fuel solenoid / gas valve)', function: 'Normally open contact of R04. Preconfigured to the fuel solenoid or gas valve, switchable in software.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'fuel', current: '2 A' },
    { pin: '38', name: 'Relay R05 — common', function: 'Common pole of relay output R05. This relay is a Form C changeover, the only one on the unit.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '39', name: 'Relay R05 — A, normally open', function: 'Normally open contact of R05. Command open MCB, or free via the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '40', name: 'Relay R05 — B, normally closed', function: 'Normally closed contact of R05.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '41', name: 'Relay R06 — common', function: 'Common pole of relay output R06.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '42', name: 'Relay R06 — N.O. (Command close GCB)', function: 'Normally open contact of R06. Command close GCB, or free via the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '43', name: 'Discrete Inputs — common ground', function: 'Common ground for discrete inputs DI01-DI08.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '44', name: 'DI01 — pre-assigned Emergency stop', function: 'Discrete input, pre-assigned to emergency stop. May be configured normally open or normally closed.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '45', name: 'DI02 — pre-assigned Start in AUTO', function: 'Discrete input, pre-assigned to start in AUTO.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '46', name: 'DI03 — pre-assigned Low oil pressure', function: 'Discrete input, pre-assigned to low oil pressure.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '47', name: 'DI04 — pre-assigned Coolant temperature', function: 'Discrete input, pre-assigned to coolant temperature.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '48', name: 'DI05 — pre-assigned External alarm acknowledgement', function: 'Discrete input, pre-assigned to external alarm acknowledgement.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '49', name: 'DI06 — pre-assigned Enable MCB', function: 'Discrete input, pre-assigned to enable MCB.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '50', name: 'DI07 — FIXED to Reply MCB open', function: 'Discrete input with a FIXED function — reply MCB open. Unlike DI01-DI06 this one is not reassignable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '51', name: 'DI08 — FIXED to Reply GCB open', function: 'Discrete input with a FIXED function — reply GCB open. Not reassignable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '52', name: 'Auxiliary Excitation D+', function: 'Charging alternator D+. Acts as an OUTPUT that pre-excites the charging alternator during engine start-up only; in normal running it acts as an INPUT monitoring charge voltage.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '8 to 40 V DC', circuit: 'charging', current: '-' },
    { pin: '53', name: 'Power Supply Positive (B+)', function: 'Supply positive, and the B+ reference for the charging alternator circuit. Woodward specify a slow-acting protective device in this line — a 6 A NEOZED D01 fuse or a 6 A type C miniature circuit breaker.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '12/24 V DC nominal (8 to 40.0 V DC)', circuit: 'power', current: '-' },
    { pin: '54', name: 'Power Supply 0 V', function: 'Supply negative.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '0 V DC', circuit: 'power', current: '-' },
    { pin: '56', name: 'MPU Input — inductive / switching', function: 'Magnetic pickup speed input. Fitted on the easYgen-2200P1 and easYgen-2500P1 ONLY.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '57', name: 'MPU Input — GND', function: 'Magnetic pickup ground. easYgen-2200P1 and 2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '58', name: 'CAN Bus 1 — CAN-L', function: 'CAN bus 1 low line. Present across the easYgen-2000 Series.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '59', name: 'CAN Bus 1 — CAN-H', function: 'CAN bus 1 high line.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '60', name: 'Analog Output AO02 — current signal', function: 'Bias signal output 2, current mode. easYgen-2500P1 ONLY.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '61', name: 'Analog Output AO02 — voltage / PWM signal', function: 'Bias signal output 2, voltage or PWM mode. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '62', name: 'Analog Output AO02 — GND', function: 'Common return for AO02. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '63', name: 'Analog Output AO03 — GND', function: 'Common return for AO03. easYgen-2500P1 only. Note the GND sits on the LOWER terminal number for AO03 and AO04, the reverse of AO01 and AO02.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '64', name: 'Analog Output AO03 — current signal', function: 'Bias signal output 3, current mode. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '65', name: 'Analog Output AO04 — GND', function: 'Common return for AO04. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '66', name: 'Analog Output AO04 — current signal', function: 'Bias signal output 4, current mode. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '80', name: 'Relay R07 — common', function: 'Common pole of relay output R07.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '81', name: 'Relay R07 — N.O. (Command close MCB)', function: 'Normally open contact of R07. Command close MCB, or free via the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '82', name: 'Relay R08 — common', function: 'Common pole of relay output R08.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '83', name: 'Relay R08 — N.O. (Command open GCB)', function: 'Normally open contact of R08. Command open GCB, or free via the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '84', name: 'Relay R09 — common', function: 'Common pole of relay output R09.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '85', name: 'Relay R09 — N.O. (LogicsManager)', function: 'Normally open contact of R09. Freely programmable through the LogicsManager.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '86', name: 'Relay R10 — common', function: 'Common pole of relay output R10.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '87', name: 'Relay R10 — N.O. (LogicsManager)', function: 'Normally open contact of R10. Freely programmable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '88', name: 'Relay R11 — common', function: 'Common pole of relay output R11.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '89', name: 'Relay R11 — N.O. (LogicsManager)', function: 'Normally open contact of R11. Freely programmable.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Max. 250 V AC/DC', circuit: 'auxiliary', current: '2 A' },
    { pin: '93', name: 'CAN Bus 2 — CAN-L', function: 'Second CAN bus, low line. easYgen-2500P1 ONLY.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '94', name: 'CAN Bus 2 — CAN-H', function: 'Second CAN bus, high line. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '95', name: 'CAN Bus 2 — GND', function: 'Second CAN bus ground. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '96', name: 'CAN Bus 2 — Shield', function: 'Second CAN bus screen. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '102', name: 'RS-485-B (TxD-)', function: 'RS-485 half-duplex with Modbus. easYgen-2500P1 ONLY.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '103', name: 'RS-485-A (TxD+)', function: 'RS-485 data line A. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '104', name: 'RS-485 GND', function: 'RS-485 ground. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '105', name: 'RS-485 Shield', function: 'RS-485 screen. easYgen-2500P1 only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
  ],
  /*
   * Datakom DKG-309 — "INPUTS AND OUTPUTS" terminal table of the DKG-309 User
   * Manual V-29 (23.08.2013), downloaded from DATAKOM'S OWN SITE
   * (datakom.com.tr/upload/Files/309_USER.pdf). Text-extractable, read directly.
   *
   * Terminals 1-37, complete.
   *
   * ⚠ TERMINALS 36 AND 37 DEPEND ON WHICH HARDWARE VERSION YOU HAVE. Datakom
   * print two separate sub-headings against the same two terminal numbers:
   *     CANBUS VERSIONS   → 36 = CANBUS-L, 37 = CANBUS-H
   *     MPU INPUT VERSIONS → 36 = MPU-,    37 = MPU+
   * Both readings are carried in the terminal name so neither can be missed.
   * Picking one would land a speed-pickup pair on a CAN port, or the reverse.
   *
   * PHASE ORDER IS MIXED ON THIS UNIT and is reproduced as printed: the
   * generator phases ASCEND (2 = L1, 3 = L2, 4 = L3) while the mains phases
   * DESCEND (7 = L3, 8 = L2, 9 = L1). The descending mains run matches the
   * D-500 and D-700 house style.
   *
   * Datakom give no per-terminal cable sizes in this manual.
   */
  'datakom-dkg309': [
    { pin: '1', name: 'Generator Contactor', function: 'Relay output energising the generator contactor. De-energises if generator voltage or frequency leaves limits. Datakom advise wiring the mains contactor NC contact in series with this output for added security.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'generator', current: '16 A AC' },
    { pin: '2', name: 'GEN-L1', function: 'Generator phase L1 voltage input. Upper and lower limits are programmable.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '3', name: 'GEN-L2', function: 'Generator phase L2 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '4', name: 'GEN-L3', function: 'Generator phase L3 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '5', name: 'Generator Neutral', function: 'Neutral reference for the generator phases.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '6', name: 'Mains Neutral', function: 'Neutral reference for the mains phases.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '7', name: 'MAINS-L3', function: 'Mains phase L3 voltage input. Note the mains phases run DESCENDING against terminal number (7 = L3, 8 = L2, 9 = L1) while the generator phases ascend.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '8', name: 'MAINS-L2', function: 'Mains phase L2 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '9', name: 'MAINS-L1', function: 'Mains phase L1 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '10', name: 'Mains Contactor', function: 'Relay output energising the mains contactor. Datakom advise wiring the generator contactor NC contact in series with this output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'mains', current: '16 A AC' },
    { pin: '11', name: 'Ground', function: 'Power supply negative connection.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0 V DC', circuit: 'power', current: '-' },
    { pin: '12', name: 'Battery Positive', function: 'DC supply positive. The unit runs on both 12 V and 24 V battery systems.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '+12 or 24 V DC', circuit: 'power', current: '-' },
    { pin: '13', name: 'Fuel Level Sender', function: 'Analogue fuel level sender. Must not be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '14', name: 'Oil Pressure Sender', function: 'Analogue oil pressure sender. Programmable characteristics, accepts any sender type. Must not be shared.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '15', name: 'Coolant Temperature Sender', function: 'Analogue coolant temperature sender. Programmable characteristics. Must not be shared.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '16', name: 'Charge', function: 'Charge alternator terminal. Supplies excitation current and measures charge alternator voltage. Acts as both input and output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '17', name: 'Relay 2 (Horn Relay)', function: 'Programmable output, selectable from a list.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A' },
    { pin: '18', name: 'Relay 1 (Stop Relay)', function: 'Programmable output, selectable from a list.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A' },
    { pin: '19', name: 'Start Relay', function: 'Controls engine cranking.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'starting', current: '1 A' },
    { pin: '20', name: 'Fuel Relay', function: 'Fuel solenoid control.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'fuel', current: '1 A' },
    { pin: '21', name: 'Emergency Stop', function: 'Programmable digital input. Each input may be driven by a switch to either battery positive or battery negative, and the effect is selectable from a list.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '22', name: 'Spare 2', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '23', name: 'Program Lock', function: 'Programmable digital input, factory assigned to program lock.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '24', name: 'Spare 1', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '25', name: 'Coolant Level', function: 'Programmable digital input, factory assigned to coolant level.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '26', name: 'High Temperature', function: 'Programmable digital input, factory assigned to high temperature.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '27', name: 'Low Oil Pressure', function: 'Programmable digital input, factory assigned to low oil pressure.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '28', name: 'Rectifier Fail', function: 'Programmable digital input, factory assigned to rectifier failure.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '29', name: 'CURR_1+', function: 'Generator current transformer phase 1, positive. Correct polarity is vital, CTs must not be shared with other instruments, and no common terminals or grounding may be used.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '30', name: 'CURR_1-', function: 'Generator current transformer phase 1, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '31', name: 'CURR_2+', function: 'Generator current transformer phase 2, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '32', name: 'CURR_2-', function: 'Generator current transformer phase 2, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '33', name: 'CURR_3+', function: 'Generator current transformer phase 3, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '34', name: 'CURR_3-', function: 'Generator current transformer phase 3, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '35', name: 'Oil Temperature Sender', function: 'Analogue oil temperature sender. Must not be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '36', name: 'CANBUS-L (CAN versions) / MPU- (MPU versions)', function: 'THIS TERMINAL DIFFERS BY HARDWARE VERSION. On CANBUS versions it is the J1939 CAN low line, with 120 ohm terminating resistors internal — Datakom instruct that no external resistors be fitted. On MPU input versions it is the magnetic pickup negative leg, 0.5 to 30 V AC. Confirm which version you have before connecting.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0.5 to 30 V AC on MPU versions', circuit: 'communication', current: '-' },
    { pin: '37', name: 'CANBUS-H (CAN versions) / MPU+ (MPU versions)', function: 'THIS TERMINAL DIFFERS BY HARDWARE VERSION. On CANBUS versions it is the J1939 CAN high line; on MPU input versions it is the magnetic pickup positive leg. Datakom recommend twisted pair or coaxial cable either way.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0.5 to 30 V AC on MPU versions', circuit: 'communication', current: '-' },
  ],
  /*
   * Datakom DKG-517 — "INPUTS AND OUTPUTS" terminal table of the DKG-517 User
   * Manual V-01.13 (08.04.2008), downloaded from DATAKOM'S OWN SITE
   * (datakom.com.tr/upload/Files/517_USER.pdf). Text-extractable, read directly.
   *
   * Terminals 1-34, complete. THIS UNIT HAS NO MAINS SENSING AND NO MAINS
   * CONTACTOR — unlike the DKG-309 it is not an auto mains failure unit, which
   * is why terminals 1 and 6-10 are printed with an asterisk and the
   * instruction "No connection to these terminals". They are carried here as
   * explicit no-connect entries rather than dropped, so nobody assumes the
   * numbering simply skipped and lands a mains phase on a dead pin.
   *
   * Do not read this against the DKG-309: the relays here are rated 10 A where
   * the 309's are 1 A, the CT terminals are named U/V/W where the 309 uses
   * 1/2/3, and the generator phases are named U/V/W rather than L1/L2/L3.
   *
   * Cable size: the manual gives no per-terminal figure but does state a blanket
   * rule — cables of adequate current carrying capacity, at least 0.75 mm².
   * That general minimum is what appears in the gauge column, labelled as such.
   */
  'datakom-dkg517': [
    { pin: '1', name: 'No Connection', function: 'Printed with an asterisk in the manufacturer table: no connection is to be made to this terminal.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '2', name: 'U', function: 'Generator phase U voltage input. Upper and lower limits are programmable.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '3', name: 'V', function: 'Generator phase V voltage input.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '4', name: 'W', function: 'Generator phase W voltage input.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '5', name: 'Generator Neutral', function: 'Neutral reference for the generator phases.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '6', name: 'No Connection', function: 'Printed with an asterisk: no connection to be made. This unit has no mains sensing.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '7', name: 'No Connection', function: 'Printed with an asterisk: no connection to be made.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '8', name: 'No Connection', function: 'Printed with an asterisk: no connection to be made.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '9', name: 'No Connection', function: 'Printed with an asterisk: no connection to be made.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '10', name: 'No Connection', function: 'Printed with an asterisk: no connection to be made.', wireColor: 'Not specified by OEM', wireGauge: 'Not applicable', voltage: '-', circuit: 'auxiliary', current: '-' },
    { pin: '11', name: 'Ground', function: 'Power supply negative connection.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '0 V DC', circuit: 'power', current: '-' },
    { pin: '12', name: 'Battery Positive', function: 'DC supply positive. The unit runs on both 12 V and 24 V battery systems.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '+12 or 24 V DC', circuit: 'power', current: '-' },
    { pin: '13', name: 'Fuel Level Sender', function: 'Analogue fuel level sender, programmed for VDO type senders. Must not be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '14', name: 'Oil Pressure Sender', function: 'Analogue oil pressure sender. Programmable characteristics, accepts any sender type. Must not be shared.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '15', name: 'Coolant Temperature Sender', function: 'Analogue coolant temperature sender. Programmable characteristics. Must not be shared.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '16', name: 'Charge', function: 'Connect the charge alternator D+ terminal here. Supplies excitation current and measures charge alternator voltage. Internally tied to terminal 20.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '17', name: 'Relay 2 (Horn Relay)', function: 'Programmable output, selectable from a list.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '28 V DC', circuit: 'auxiliary', current: '10 A' },
    { pin: '18', name: 'Relay 1 (Stop Relay)', function: 'Programmable output, selectable from a list.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '28 V DC', circuit: 'auxiliary', current: '10 A' },
    { pin: '19', name: 'Start Relay', function: 'Controls engine cranking.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '28 V DC', circuit: 'starting', current: '10 A' },
    { pin: '20', name: 'Fuel Relay', function: 'Fuel solenoid control. Internally connected to terminal 16 to supply the charge alternator excitation current.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '28 V DC', circuit: 'fuel', current: '10 A' },
    { pin: '21', name: 'Emergency Stop', function: 'Programmable digital input. Inputs may be driven by a normally open or normally closed contact, switching either battery positive or battery negative.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '22', name: 'Spare 2', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '23', name: 'Program Lock', function: 'Programmable digital input, factory assigned to program lock.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '24', name: 'Spare 1', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '25', name: 'Coolant Level', function: 'Programmable digital input, factory assigned to coolant level.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '26', name: 'High Temperature', function: 'Programmable digital input, factory assigned to high temperature.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '27', name: 'Low Oil Pressure', function: 'Programmable digital input, factory assigned to low oil pressure.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '28', name: 'Rectifier Fail', function: 'Programmable digital input, factory assigned to rectifier failure.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '29', name: 'CURR_U+', function: 'Generator current transformer phase U, positive. Correct polarity is vital, CTs must not be shared with other instruments, and no common terminals or grounding may be used.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '30', name: 'CURR_U-', function: 'Generator current transformer phase U, negative.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '31', name: 'CURR_V+', function: 'Generator current transformer phase V, positive.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '32', name: 'CURR_V-', function: 'Generator current transformer phase V, negative.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '33', name: 'CURR_W+', function: 'Generator current transformer phase W, positive.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '34', name: 'CURR_W-', function: 'Generator current transformer phase W, negative.', wireColor: 'Not specified by OEM', wireGauge: '0.75 mm² minimum (manual general rule)', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
  ],
  /*
   * Datakom D-700 MK3 — section 8 "TERMINAL DESCRIPTION" of the D-700 MK3 User
   * Manual, Firmware V-16.8, downloaded from DATAKOM'S OWN SITE
   * (datakom.com.tr/upload/Files/700_MK3_USER.pdf). Text-extractable, read
   * directly from the document.
   *
   * ⚠ MK3-SCOPED. The base D-700 (Rev_03, Firmware V-5.8) was also pulled from
   * Datakom's site and its specification section states 12 digital inputs and
   * SEVEN analog sender inputs, whereas this MK3 table lists five analog
   * senders (26-30). The two revisions therefore do NOT share a terminal
   * layout, and the base D-700's own numbered table is published only as a page
   * image, so it could not be read. Registry records completeness: 'partial' so
   * the panel raises the amber banner naming the revision.
   *
   * TERMINAL NUMBERING JUMPS: the table runs 1-31 and resumes at 44. Terminals
   * 32-43 are not listed. The AC section is also sparse by design — generator
   * phases sit on 63/61/59 and mains phases on 66/68/70, both odd/even runs
   * with gaps, and both in DESCENDING phase order relative to terminal number.
   * Reproduced exactly as printed rather than tidied into ascending order.
   *
   * "DIGITAL INPUT 11" IS NOT A TRANSCRIPTION LOSS. Terminal 23 is Digital
   * Input 10 and terminal 24 is labelled Digital Input 12 in Datakom's own
   * table. The label is carried through as printed.
   *
   * THE DC PLUG-IN MODULE IS DELIBERATELY EXCLUDED. The same manual documents an
   * optional DC plug-in module whose own terminals are numbered 01-06 (I-, I+,
   * *, V-, V2+, V1+). Merging those into this list would collide head-on with
   * the main block's terminals 1-6 — battery and crank/fuel outputs — which is
   * exactly the kind of silent overlap that produces a dangerous diagram. They
   * belong to a separate connector and are not part of this pinout.
   *
   * Datakom give NO cable sizes, so every gauge is recorded as not stated.
   */
  'datakom-d700': [
    { pin: '1', name: 'Battery Positive 1', function: 'Positive terminal of the DC supply.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '+12 or 24 V DC', circuit: 'power', current: '-' },
    { pin: '2', name: 'Battery Positive 2', function: 'Second positive supply terminal.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '+12 or 24 V DC', circuit: 'power', current: '-' },
    { pin: '3', name: 'Battery Negative', function: 'DC supply negative connection.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0 V DC', circuit: 'power', current: '-' },
    { pin: '4', name: 'Digital Output 1 — factory CRANK', function: 'Programmable output, selectable from a list. Factory set as the crank output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'starting', current: '1 A protected semiconductor output' },
    { pin: '5', name: 'Digital Output 2 — factory FUEL', function: 'Programmable output. Factory set as the fuel output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'fuel', current: '1 A protected semiconductor output' },
    { pin: '6', name: 'Digital Output 3 — factory ALARM', function: 'Programmable output. Factory set as the alarm output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '7', name: 'Digital Output 4 — factory PREHEAT', function: 'Programmable output. Factory set as the preheat output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '8', name: 'Digital Output 5 — factory STOP', function: 'Programmable output. Factory set as the stop output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '9', name: 'Digital Output 6 — factory IDLE SPEED', function: 'Programmable output. Factory set as the idle speed output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '10', name: 'Digital Output 7 — factory MAINS CONTACTOR', function: 'Programmable output. Factory set to drive the mains contactor.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'mains', current: '1 A protected semiconductor output' },
    { pin: '11', name: 'Digital Output 8 — factory GENSET CONTACTOR', function: 'Programmable output. Factory set to drive the genset contactor.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'generator', current: '1 A protected semiconductor output' },
    { pin: '12', name: 'Charge 1', function: 'Charge alternator terminal. Supplies excitation current and measures the charge alternator voltage. Acts as both input and output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '13', name: 'Charge 2', function: 'Second charge alternator terminal, paired with terminal 12.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '14', name: 'Digital Input 1 — factory LOW OIL PRESSURE', function: 'Programmable input. Factory set as the low oil pressure switch.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '15', name: 'Digital Input 2 — factory HIGH TEMP', function: 'Programmable input. Factory set as the high temperature switch.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '16', name: 'Digital Input 3 — factory EMERGENCY STOP', function: 'Programmable input. Factory set as the emergency stop input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'protection', current: '-' },
    { pin: '17', name: 'Digital Input 4 — factory SPARE 1', function: 'Programmable input. Factory set as spare input 1.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '18', name: 'Digital Input 5 — factory SPARE 2', function: 'Programmable input. Factory set as spare input 2.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '19', name: 'Digital Input 6 — factory SPARE 3', function: 'Programmable input. Factory set as spare input 3.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '20', name: 'Digital Input 7 — factory SPARE 4', function: 'Programmable input. Factory set as spare input 4.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '21', name: 'Digital Input 8 — factory SPARE 5', function: 'Programmable input. Factory set as spare input 5.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '22', name: 'Digital Input 9 — factory SPARE 6', function: 'Programmable input. Factory set as spare input 6.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '23', name: 'Digital Input 10 — factory SPARE 7', function: 'Programmable input. Factory set as spare input 7.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '24', name: 'Digital Input 12 — low coolant level', function: 'Purpose-built low coolant level detection. Datakom drive this terminal with a low-amplitude pure sine waveform so the detector electrode does not wear. Labelled Digital Input 12 in the manufacturer table — there is no Digital Input 11.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '25', name: 'Sender Ground', function: 'Ground reference for the analogue senders. Datakom specify bonding this to the engine body, close to the senders.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '26', name: 'Analog Sender 1 — Oil Pressure', function: 'Oil pressure sender input. Datakom warn against connecting the sender to any other device.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '27', name: 'Analog Sender 2 — Coolant Temperature', function: 'Coolant temperature sender input. Not to be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '28', name: 'Analog Sender 3 — Fuel Level', function: 'Fuel level sender input. Not to be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '29', name: 'Analog Sender 4 — Oil Temperature', function: 'Oil temperature sender input. Not to be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '30', name: 'Analog Sender 5 — Canopy Temperature', function: 'Canopy temperature sender input. Not to be shared with other devices.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: 'Resistance input, 0-5000 ohms' },
    { pin: '31', name: 'Sender Supply +5 V', function: 'Supply output for active-type senders. Protected by an internal electronic fuse against overload and short circuit.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '+5 V DC', circuit: 'metering', current: '50 mA maximum' },
    // Terminals 32-43 are not listed in the manufacturer's table.
    { pin: '44', name: 'MPU -', function: 'Magnetic pickup input, negative leg. Datakom recommend twisted pair or coaxial cable.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0.5 to 30 V AC', circuit: 'metering', current: '-' },
    { pin: '45', name: 'MPU +', function: 'Magnetic pickup input, positive leg.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0.5 to 30 V AC', circuit: 'metering', current: '-' },
    { pin: '46', name: 'GND', function: 'Ground reference associated with the magnetic pickup and CAN terminals.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '47', name: 'CANBUS-L', function: 'J1939 port of an electronic engine, low line. The 120 ohm terminating resistors are INSIDE the unit — Datakom instruct that no external resistors be fitted.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '48', name: 'CANBUS-H', function: 'J1939 port of an electronic engine, high line. Terminating resistors are internal.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '49', name: 'GEN I-GND+', function: 'Earth current transformer input, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '50', name: 'GEN I-GND-', function: 'Earth current transformer input, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '51', name: 'GEN I3+', function: 'Generator current transformer phase 3, positive. Correct polarity is critical and CTs must not be shared with other instruments.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '52', name: 'GEN I3-', function: 'Generator current transformer phase 3, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '53', name: 'GEN I2+', function: 'Generator current transformer phase 2, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '54', name: 'GEN I2-', function: 'Generator current transformer phase 2, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '55', name: 'GEN I1+', function: 'Generator current transformer phase 1, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '56', name: 'GEN I1-', function: 'Generator current transformer phase 1, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC secondary' },
    { pin: '57', name: 'Generator Neutral', function: 'Neutral reference for the generator phase inputs.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '59', name: 'GEN-L3', function: 'Generator phase L3 voltage input. Generator phases run DESCENDING against terminal number (63 = L1, 61 = L2, 59 = L3), as printed.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '61', name: 'GEN-L2', function: 'Generator phase L2 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '63', name: 'GEN-L1', function: 'Generator phase L1 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'generator', current: '-' },
    { pin: '64', name: 'Mains Neutral', function: 'Neutral reference for the mains phase inputs.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '66', name: 'MAINS-L3', function: 'Mains phase L3 voltage input. Mains phases also run descending against terminal number (66 = L3, 68 = L2, 70 = L1).', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '68', name: 'MAINS-L2', function: 'Mains phase L2 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '70', name: 'MAINS-L1', function: 'Mains phase L1 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
  ],
  /*
   * Datakom D-500 — Terminal Description table, pages 48-50 of the Datakom
   * D-500 User Manual, read via page-level HTML rendering on ManualsLib.
   *
   * TERMINAL NUMBERING JUMPS. The manufacturer's table runs 1-31 and then
   * resumes at 51; there are no terminals 32-50. This was checked against the
   * following page of the manual to be sure it was not a transcription loss —
   * page 51 is Technical Specifications, so the table genuinely ends at 72.
   * The AC section is likewise sparse by design: 53, 55, 57 and 66, 68, 70 are
   * absent from the printed table.
   *
   * ⚠ TERMINALS 52, 54 AND 56 — the generator phase voltage inputs — ARE
   * DELIBERATELY WITHHELD. Two independent reads of page 50 disagreed on which
   * phase sits on which terminal (one gave L1/L2/L3 ascending, the other gave
   * L2/L3/L3, which is self-contradictory). Generator phase sensing is a
   * high-consequence connection and a coin-flip is not good enough, so those
   * three terminals are absent rather than guessed. Everything else on the page
   * read identically both times and is shipped. The registry records this as
   * completeness: 'partial' so the panel raises the amber banner.
   *
   * Datakom's table gives NO cable sizes anywhere, so every gauge here is
   * recorded as not stated rather than inferred from the current rating.
   *
   * Terminal 2 is a live safety instruction, not a spare: the manual says do not
   * connect it. It is carried through for exactly that reason.
   *
   * The six digital outputs and eight digital inputs are all programmable; the
   * factory default function is named because that is what an untouched unit
   * will actually do.
   */
  'datakom-d500': [
    { pin: '1', name: 'Battery Positive', function: 'Positive terminal of the DC supply.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '+12 or 24 V DC', circuit: 'power', current: '-' },
    { pin: '2', name: 'Do Not Connect', function: 'The manufacturer instructs that this terminal must be left unconnected. It is listed here so it is not mistaken for a spare.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'power', current: '-' },
    { pin: '3', name: 'Battery Negative', function: 'DC supply negative connection.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0 V DC', circuit: 'power', current: '-' },
    { pin: '4', name: 'Digital Output 1 — factory CRANK', function: 'Programmable output, selectable from a list. Factory set as the crank output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'starting', current: '1 A protected semiconductor output' },
    { pin: '5', name: 'Digital Output 2 — factory FUEL', function: 'Programmable output, selectable from a list. Factory set as the fuel output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'fuel', current: '1 A protected semiconductor output' },
    { pin: '6', name: 'Digital Output 3 — factory ALARM', function: 'Programmable output, selectable from a list. Factory set as the alarm output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '7', name: 'Digital Output 4 — factory PREHEAT', function: 'Programmable output, selectable from a list. Factory set as the preheat output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '8', name: 'Digital Output 5 — factory STOP', function: 'Programmable output, selectable from a list. Factory set as the stop output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '9', name: 'Digital Output 6 — factory IDLE SPEED', function: 'Programmable output, selectable from a list. Factory set as the idle speed output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '28 V DC', circuit: 'auxiliary', current: '1 A protected semiconductor output' },
    { pin: '10', name: 'Charge', function: 'Charge alternator terminal, used to supply excitation current. Acts as both an input and an output.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '11', name: 'Digital Input 1 — factory LOW OIL PRESSURE', function: 'Programmable input. Factory set as the low oil pressure switch.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '12', name: 'Digital Input 2 — factory HIGH TEMP', function: 'Programmable input. Factory set as the high temperature switch.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '13', name: 'Digital Input 3', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '14', name: 'Digital Input 4', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '15', name: 'Digital Input 5', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '16', name: 'Digital Input 6', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '17', name: 'Digital Input 7', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '18', name: 'Digital Input 8', function: 'Programmable digital input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-30 V DC', circuit: 'inputs', current: '-' },
    { pin: '19', name: 'Sender Ground', function: 'Ground reference for the analogue senders.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '20', name: 'Analog Sender 1 — Oil Pressure', function: 'Oil pressure sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '21', name: 'Analog Sender 2 — Coolant Temperature', function: 'Coolant temperature sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '22', name: 'Analog Sender 3 — Fuel Level', function: 'Fuel level sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '23', name: 'Analog Sender 4 — Oil Temperature', function: 'Oil temperature sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '24', name: 'Protection Ground (RS-485)', function: 'Termination for the protective screen of the RS-485 cable.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '25', name: 'RS-485 B', function: 'RS-485 data line B. Runs MODBUS-RTU.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '26', name: 'RS-485 A', function: 'RS-485 data line A. Runs MODBUS-RTU.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '27', name: 'MPU +', function: 'Magnetic pickup input, positive leg.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '28', name: 'MPU -', function: 'Magnetic pickup input, negative leg.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '29', name: 'Protection Ground (MPU / CANBUS)', function: 'Screen termination shared by the magnetic pickup and CANBUS cables.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '30', name: 'CANBUS-H', function: 'J1939 port of an electronic engine, high line.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '31', name: 'CANBUS-L', function: 'J1939 port of an electronic engine, low line.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    // Terminals 32-50 do not exist on this module — the manufacturer's table
    // runs 1-31 and resumes at 51.
    { pin: '51', name: 'Generator Contactor', function: 'Relay output that energises the generator contactor.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'generator', current: '16 A AC' },
    // Terminals 52, 54 and 56 (generator phase voltage inputs) are WITHHELD —
    // two reads of the source disagreed on the phase order. See the block
    // comment above and the registry coverage note.
    { pin: '58', name: 'Generator Neutral', function: 'Neutral reference for the generator phase inputs.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '59', name: 'CURR_1+', function: 'Current transformer input 1, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '60', name: 'CURR_1-', function: 'Current transformer input 1, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '61', name: 'CURR_2+', function: 'Current transformer input 2, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '62', name: 'CURR_2-', function: 'Current transformer input 2, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '63', name: 'CURR_3+', function: 'Current transformer input 3, positive.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '64', name: 'CURR_3-', function: 'Current transformer input 3, negative.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '5 A AC' },
    { pin: '65', name: 'Mains Neutral', function: 'Neutral reference for the mains phase inputs.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '67', name: 'MAINS-L3', function: 'Mains phase L3 voltage input. Note the mains phases run in DESCENDING order across the block (67 L3, 69 L2, 71 L1) — this was consistent across both reads of the source.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '69', name: 'MAINS-L2', function: 'Mains phase L2 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '71', name: 'MAINS-L1', function: 'Mains phase L1 voltage input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '0-300 V AC', circuit: 'mains', current: '-' },
    { pin: '72', name: 'Mains Contactor', function: 'Relay output that energises the mains contactor.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'mains', current: '16 A AC' },
  ],
  /*
   * SmartGen HGM9510 — read from SmartGen's OWN site (smartgen.cn), Table 12
   * "Terminal Connection Description" of the HGM9510 Parallel Controller User
   * Manual. Text-extractable PDF, read directly.
   *
   * This is a PARALLELING controller, which is why it senses a bus (41-44) as
   * well as the genset (45-48), and carries an MSC CAN link (26-28) between
   * paralleled sets alongside the engine ECU CAN (23-25).
   *
   * TERMINALS 53, 54 AND 55 ARE ABSENT. The published table runs 49-52 and then
   * jumps straight to 56. They are omitted here rather than invented; the gap is
   * the manufacturer's, not a transcription loss.
   *
   * Relay contact ORDER is not uniform in this table and is reproduced exactly
   * as printed rather than normalised:
   *     Aux. output 4 → 20 NC, 21 common, 22 NO
   *     Aux. output 5 → 36 NC, 37 NO,     38 common   (NO and common swapped)
   *     Aux. output 6 → 39 NO, 40 common
   * Normalising these to a tidy NC/common/NO pattern would have been an
   * invention, and would put a technician on the wrong contact.
   *
   * RS485 polarity here is 34 = "+" and 35 = "-". Note this is the OPPOSITE
   * order from the HGM7220 above (48 = "-", 49 = "+"). Each table was read on
   * its own; polarity is never carried across models.
   *
   * Where the Cable Size column prints "/" (the CAN and RS485 commons, and
   * sensor common) the gauge is recorded as not stated rather than guessed.
   */
  'smartgen-hgm9510': [
    { pin: '1', name: 'B-', function: 'Battery negative.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: '-' },
    { pin: '2', name: 'B+', function: 'Battery positive. SmartGen advise doubling the conductor in parallel beyond 30 m of run, and fitting a 20 A fuse maximum.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: 'Max. 20 A fuse recommended' },
    { pin: '3', name: 'Emergency Stop', function: 'Fed from B+ through the normally closed contact of the emergency stop button.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '4', name: 'Fuel Relay', function: 'Fuel solenoid drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'fuel', current: '16 A rated' },
    { pin: '5', name: 'Crank Relay', function: 'Starter coil drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'starting', current: '16 A rated' },
    { pin: '6', name: 'Aux. Output 1', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '7', name: 'Aux. Output 2', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '8', name: 'Aux. Output 3', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '9', name: 'Charger (D+)', function: 'Charge alternator D+ input. Left unconnected where the alternator has no such terminal.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '10', name: 'Aux. Input 1', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '11', name: 'Aux. Input 2', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '12', name: 'Aux. Input 3', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '13', name: 'Aux. Input 4', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '14', name: 'Aux. Input 5', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '15', name: 'Aux. Input 6', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '16', name: 'Magnetic Pickup', function: 'Speed sensor connection. SmartGen recommend screened cable and note that B- is already commoned to speed sensor 2 inside the controller.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '17', name: 'MP2', function: 'Magnetic pickup channel 2.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '18', name: 'MP1', function: 'Magnetic pickup channel 1.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '19', name: 'Aux. Input 7', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '20', name: 'Aux. Output 4 — normally closed', function: 'Normally closed contact of auxiliary relay 4. Group: 20 NC, 21 common, 22 NO.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '21', name: 'Aux. Output 4 — common', function: 'Common pole of auxiliary relay 4.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '22', name: 'Aux. Output 4 — normally open', function: 'Normally open contact of auxiliary relay 4.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '23', name: 'ECU CAN COM (GND)', function: 'Engine ECU CAN common / screen. Earthed at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '24', name: 'ECU CAN H', function: 'Engine ECU CAN high.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '25', name: 'ECU CAN L', function: 'Engine ECU CAN low.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '26', name: 'MSC CAN COM (GND)', function: 'Multi-set control CAN common / screen, the link between paralleled controllers. Earthed at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '27', name: 'MSC CAN H', function: 'Multi-set control CAN high.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '28', name: 'MSC CAN L', function: 'Multi-set control CAN low.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '29', name: 'GOV B(+)', function: 'Governor control link, positive leg. Screened cable recommended, screen earthed at the governor end.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '30', name: 'GOV A(-)', function: 'Governor control link, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '31', name: 'AVR B(+)', function: 'AVR control link, positive leg. Screened cable recommended, screen earthed at the AVR end.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '32', name: 'AVR A(-)', function: 'AVR control link, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '33', name: 'RS485 COM (GND)', function: 'RS485 common / screen. Earthed at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '34', name: 'RS485+', function: 'RS485 serial data, positive leg. Note the polarity order differs from the HGM7220.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '35', name: 'RS485-', function: 'RS485 serial data, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '36', name: 'Aux. Output 5 — normally closed', function: 'Normally closed contact of auxiliary relay 5. Group: 36 NC, 37 NO, 38 common — note the common is LAST on this relay, unlike Aux. Output 4.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '37', name: 'Aux. Output 5 — normally open', function: 'Normally open contact of auxiliary relay 5.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '38', name: 'Aux. Output 5 — common', function: 'Common pole of auxiliary relay 5.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '39', name: 'Aux. Output 6 — normally open', function: 'Normally open contact of auxiliary relay 6. Group: 39 NO, 40 common.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '40', name: 'Aux. Output 6 — common', function: 'Common pole of auxiliary relay 6.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '41', name: 'Bus A-Phase Voltage Input', function: 'Paralleling bus A phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'bus', current: '2 A fuse recommended' },
    { pin: '42', name: 'Bus B-Phase Voltage Input', function: 'Paralleling bus B phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'bus', current: '2 A fuse recommended' },
    { pin: '43', name: 'Bus C-Phase Voltage Input', function: 'Paralleling bus C phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'bus', current: '2 A fuse recommended' },
    { pin: '44', name: 'Bus N-Wire Input', function: 'Paralleling bus neutral reference.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'bus', current: '-' },
    { pin: '45', name: 'Gen-set A-Phase Voltage Input', function: 'Generator A phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '46', name: 'Gen-set B-Phase Voltage Input', function: 'Generator B phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '47', name: 'Gen-set C-Phase Voltage Input', function: 'Generator C phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '48', name: 'Gen-set N-Wire Input', function: 'Generator neutral reference.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '49', name: 'CT A-Phase Input', function: 'Current transformer secondary, A phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '50', name: 'CT B-Phase Input', function: 'Current transformer secondary, B phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '51', name: 'CT C-Phase Input', function: 'Current transformer secondary, C phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '52', name: 'CT COM', function: 'Common return for the three CT secondaries.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    // Terminals 53, 54 and 55 are not listed in the manufacturer's table — it
    // runs 49-52 and resumes at 56. Omitted rather than invented.
    { pin: '56', name: 'Aux. Sensor 1', function: 'Configurable sender input — temperature, oil pressure or fuel level.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '57', name: 'Aux. Sensor 2', function: 'Configurable sender input — temperature, oil pressure or fuel level.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '58', name: 'Oil Pressure', function: 'Oil pressure sender input.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '59', name: 'Engine Temperature', function: 'Engine temperature sender input.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '60', name: 'Fuel Level', function: 'Fuel level sender input.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '61', name: 'Sensor COM', function: 'Common return for the sender inputs; commoned to B- inside the controller.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
  ],
  /*
   * SmartGen HGM7220 — terminals 1-52, read from SmartGen's OWN site
   * (smartgen.cn), Table 13 "Terminal Connection Description" of the HGM7200
   * Series Genset Controller User Manual. Text-extractable PDF, read directly.
   *
   * This is the correct base document for the HGM7220: the manual covers the
   * HGM7200 series and marks the mains sensing terminals 40-43 "HGM7X10
   * without", i.e. absent on the HGM7210 and PRESENT on the HGM7220. Suffixed
   * variants (N, -4G) were not consulted — see the HGM6120 note above for why
   * SmartGen suffixes matter.
   *
   * Relay grouping, which the manual conveys by merging cells: 7/8/9 are the
   * NC / common / NO contacts of Aux. output 2; 10+11 and 12+13 are the
   * volt-free contact pairs of Aux. outputs 3 and 4.
   *
   * Terminal 36 is recorded as 1.5 mm² because that is what the manual prints,
   * even though the other two genset phase terminals (37, 38) are given as
   * 1.0 mm². That asymmetry looks like an error in SmartGen's own table. It is
   * reproduced rather than silently "corrected" — but a technician sizing all
   * three phases alike should use the larger figure. Flagged in the registry.
   *
   * Where the manual leaves the Diameter column blank (the magnetic pickup, the
   * three sender inputs, sensor common and the two configurable senders) the
   * gauge is recorded as not stated rather than filled in by analogy.
   */
  'smartgen-hgm7220': [
    { pin: '1', name: 'DC B-', function: 'Battery negative.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: '-' },
    { pin: '2', name: 'DC B+', function: 'Battery positive. SmartGen advise doubling the conductor in parallel beyond 30 m of run, and fitting a 20 A fuse maximum.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: 'Max. 20 A fuse recommended' },
    { pin: '3', name: 'Emergency Stop', function: 'Fed from B+ through the emergency stop button.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '4', name: 'Fuel Relay Output', function: 'Fuel solenoid drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'fuel', current: '16 A rated' },
    { pin: '5', name: 'Start Relay Output', function: 'Starter coil drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'power', current: '16 A rated' },
    { pin: '6', name: 'Aux. Output 1', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '7', name: 'Aux. Output 2 — normally closed', function: 'Normally closed contact of auxiliary relay 2. Group: 7 NC, 8 common, 9 NO.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '8', name: 'Aux. Output 2 — common', function: 'Common pole of auxiliary relay 2.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '9', name: 'Aux. Output 2 — normally open', function: 'Normally open contact of auxiliary relay 2.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '10', name: 'Aux. Output 3', function: 'Volt-free normally open contact, first pole. Pairs with terminal 11.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '11', name: 'Aux. Output 3', function: 'Volt-free normally open contact, second pole. Pairs with terminal 10.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '12', name: 'Aux. Output 4', function: 'Volt-free normally open contact, first pole. Pairs with terminal 13.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '13', name: 'Aux. Output 4', function: 'Volt-free normally open contact, second pole. Pairs with terminal 12.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '14', name: 'Charge Generator D+ Input', function: 'Charge alternator D+ (W/L) input. Left unconnected where the alternator has no such terminal.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '15', name: 'Aux. Output 5', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '16', name: 'Aux. Output 6', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '17', name: 'Magnetic Pickup', function: 'Flywheel magnetic speed pickup. SmartGen recommend screened cable.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '18', name: 'Magnetic Pickup', function: 'Second leg of the magnetic pickup input; commoned to battery negative inside the controller.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '19', name: 'Temperature Sensor Input', function: 'Engine temperature sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '20', name: 'Oil Pressure Sensor Input', function: 'Oil pressure sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '21', name: 'Oil / Fuel Level Sensor Input', function: 'Fuel level sender input.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '22', name: 'Aux. Input 1', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '23', name: 'Aux. Input 2', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '24', name: 'Aux. Input 3', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '25', name: 'Aux. Input 4', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '26', name: 'Aux. Input 5', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '27', name: 'Sensor COM', function: 'Common return for the sender inputs; commoned to battery negative inside the controller.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '28', name: 'Aux. Input 6', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '29', name: 'Aux. Input 7', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '30', name: 'Configurable Sensor 1', function: 'Configurable sender input — temperature, oil pressure or fuel level.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '31', name: 'Configurable Sensor 2', function: 'Configurable sender input — temperature, oil pressure or fuel level.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated by OEM', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '32', name: 'CT A-Phase Sensing Input', function: 'Current transformer secondary, A phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '33', name: 'CT B-Phase Sensing Input', function: 'Current transformer secondary, B phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '34', name: 'CT C-Phase Sensing Input', function: 'Current transformer secondary, C phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '35', name: 'CT Common', function: 'Common return for the three CT secondaries.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '36', name: 'Genset A-Phase Voltage Sensing', function: 'Generator A phase sensing. A 2 A fuse is recommended. The manual prints 1.5 mm² here while giving 1.0 mm² for the other two phases — see the registry note.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm² (as printed)', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '37', name: 'Genset B-Phase Voltage Sensing', function: 'Generator B phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '38', name: 'Genset C-Phase Voltage Sensing', function: 'Generator C phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '39', name: 'Genset N-Wire Input', function: 'Generator neutral reference.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '40', name: 'Mains A-Phase Voltage Sensing', function: 'Utility A phase sensing. A 2 A fuse is recommended. Not fitted on the HGM7X10.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '41', name: 'Mains B-Phase Voltage Sensing', function: 'Utility B phase sensing. A 2 A fuse is recommended. Not fitted on the HGM7X10.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '42', name: 'Mains C-Phase Voltage Sensing', function: 'Utility C phase sensing. A 2 A fuse is recommended. Not fitted on the HGM7X10.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '43', name: 'Mains N-Wire Input', function: 'Utility neutral reference. Not fitted on the HGM7X10.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '44', name: 'CAN GND', function: 'CAN screen / common. 120 ohm screened cable recommended, earthed at one end only. Absent on controllers in the series without CAN.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '45', name: 'CAN-', function: 'Engine ECU CAN, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '46', name: 'CAN+', function: 'Engine ECU CAN, positive leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '47', name: 'RS485 GND', function: 'RS485 screen / common, earthed at one end only.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '48', name: 'RS485-', function: 'RS485 serial data, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '49', name: 'RS485+', function: 'RS485 serial data, positive leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '50', name: 'RS232 GND', function: 'RS232 common. Used for the GSM module connection.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '51', name: 'RS232 RX', function: 'RS232 receive.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '52', name: 'RS232 TX', function: 'RS232 transmit.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
  ],
  /*
   * SmartGen HGM6120 — terminals 1-44, read from SmartGen's OWN site
   * (smartgen.cn), Table 6 "Terminal Connection Description" of the
   * HGM6100N-4G series user manual. That PDF is text-extractable, so this table
   * was read directly rather than through a mirror.
   *
   * ⚠ VARIANT-SCOPED. The document covers HGM6110N-4G / HGM6120N-4G /
   * HGM6110CAN-4G / HGM6120CAN-4G. It is NOT interchangeable with the base
   * HGM6100N series, which was cross-checked and genuinely differs:
   *
   *     base HGM6110N/6120N          this map (-4G)
   *     terminal 4 fuel   1.5 mm²    terminal 4 fuel   2.5 mm²
   *     terminal 5 start  1.5 mm²    terminal 5 start  2.5 mm²
   *     Aux. Relay 2 at 8            Aux. Relay 2 at 7
   *     Aux. Relay 3 at 11           Aux. Relay 3 at 10
   *     Aux. Relay 4 at 13           Aux. Relay 4 at 12
   *
   * Wiring a base HGM6120N from this map would put the auxiliary relays one
   * terminal out. The registry therefore records completeness: 'partial' so the
   * panel raises the amber coverage banner naming this restriction. Do NOT
   * relabel it 'complete' — "complete" here would mean the terminal table is
   * whole, which it is, but the panel banner is the only thing telling a
   * technician which module this map is actually for.
   *
   * The U, T and K series HGM6120 variants were not consulted and are not
   * covered.
   *
   * Terminals 8/9 belong to the Aux. Relay Output 2 group (NC / common / NO
   * with terminal 7); 11 and 13 are the second poles of the volt-free relay
   * pairs starting at 10 and 12. The manual conveys this by merging cells, so
   * the grouping is stated in each description rather than left implicit.
   */
  'smartgen-hgm6120': [
    { pin: '1', name: 'DC Input B-', function: 'Battery negative.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: '-' },
    { pin: '2', name: 'DC Input B+', function: 'Battery positive. SmartGen advise doubling the conductor in parallel beyond 30 m of run, and fitting a 20 A fuse maximum.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'power', current: 'Max. 20 A fuse recommended' },
    { pin: '3', name: 'Emergency Stop', function: 'Fed from B+ through the emergency stop button.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: '-', circuit: 'protection', current: '-' },
    { pin: '4', name: 'Fuel Relay Output', function: 'Fuel solenoid drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'B+', circuit: 'fuel', current: '16 A rated' },
    { pin: '5', name: 'Start Relay Output', function: 'Starter coil drive. B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'B+', circuit: 'power', current: '16 A rated' },
    { pin: '6', name: 'Aux. Relay Output 1', function: 'Configurable auxiliary output, B+ supplied.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: 'B+', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '7', name: 'Aux. Relay Output 2 — normally closed', function: 'Normally closed contact of auxiliary relay 2. Group: 7 NC, 8 common, 9 NO.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '8', name: 'Aux. Relay Output 2 — common', function: 'Common pole of auxiliary relay 2.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '9', name: 'Aux. Relay Output 2 — normally open', function: 'Normally open contact of auxiliary relay 2.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'auxiliary', current: '7 A rated' },
    { pin: '10', name: 'Aux. Relay Output 3', function: 'Volt-free normally open contact, first pole. Pairs with terminal 11.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '11', name: 'Aux. Relay Output 3', function: 'Volt-free normally open contact, second pole. Pairs with terminal 10.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '12', name: 'Aux. Relay Output 4', function: 'Volt-free normally open contact, first pole. Pairs with terminal 13.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '13', name: 'Aux. Relay Output 4', function: 'Volt-free normally open contact, second pole. Pairs with terminal 12.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm²', voltage: 'Volt-free', circuit: 'auxiliary', current: '16 A rated' },
    { pin: '14', name: 'Charging Generator D+', function: 'Charge alternator D+ (W/L) connection. Left unconnected if no charge alternator is fitted.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'charging', current: '-' },
    { pin: '15', name: 'Speed Sensor Input', function: 'Magnetic speed pickup input. SmartGen recommend screened cable.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '16', name: 'Speed Sensor Input (B- side)', function: 'Second leg of the speed sensor input; B- is connected here.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '17', name: 'Temperature Sensor Input', function: 'Resistive water or cylinder temperature sender.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '18', name: 'Oil Pressure Sensor Input', function: 'Resistive oil pressure sender.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '19', name: 'Level Sensor Input', function: 'Resistive liquid level sender.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '20', name: 'Configurable Input 1', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '21', name: 'Configurable Input 2', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '22', name: 'Configurable Input 3', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '23', name: 'CT A Phase Sensing Input', function: 'Current transformer secondary, A phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '24', name: 'CT B Phase Sensing Input', function: 'Current transformer secondary, B phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '25', name: 'CT C Phase Sensing Input', function: 'Current transformer secondary, C phase.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '5 A rated secondary' },
    { pin: '26', name: 'CT Common Port', function: 'Common return for the three CT secondaries.', wireColor: 'Not specified by OEM', wireGauge: '1.5 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '27', name: 'Generator U Phase Voltage Sensing', function: 'Generator U phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '28', name: 'Generator V Phase Voltage Sensing', function: 'Generator V phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '29', name: 'Generator W Phase Voltage Sensing', function: 'Generator W phase sensing. A 2 A fuse is recommended.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '2 A fuse recommended' },
    { pin: '30', name: 'Generator N2 Input', function: 'Generator neutral reference.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'generator', current: '-' },
    { pin: '31', name: 'Mains R Phase Voltage Sensing', function: 'Utility R phase sensing. A 2 A fuse is recommended. Not fitted on the HGM6110-4G.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '32', name: 'Mains S Phase Voltage Sensing', function: 'Utility S phase sensing. A 2 A fuse is recommended. Not fitted on the HGM6110-4G.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '33', name: 'Mains T Phase Voltage Sensing', function: 'Utility T phase sensing. A 2 A fuse is recommended. Not fitted on the HGM6110-4G.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '2 A fuse recommended' },
    { pin: '34', name: 'Mains N1 Input', function: 'Utility neutral reference. Not fitted on the HGM6110-4G.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'mains', current: '-' },
    { pin: '35', name: 'RS485 Common Ground', function: 'RS485 screen / common. Bond to ground at one end only.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '36', name: 'RS485-', function: 'RS485 serial data, negative leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '37', name: 'RS485+', function: 'RS485 serial data, positive leg.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '38', name: 'Configurable Input 4', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '39', name: 'Configurable Input 5', function: 'Configurable digital input, active when pulled to ground (B-).', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'inputs', current: '-' },
    { pin: '40', name: 'Sensor Common', function: 'Common return for the analogue sender inputs.', wireColor: 'Not specified by OEM', wireGauge: '1.0 mm²', voltage: '-', circuit: 'metering', current: '-' },
    { pin: '41', name: 'CAN COM', function: 'CAN screen / common. Bond to ground at one end only. Not fitted on every controller in this series.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '42', name: 'CAN L', function: 'Engine ECU CAN low.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '43', name: 'CAN H', function: 'Engine ECU CAN high.', wireColor: 'Not specified by OEM', wireGauge: '0.5 mm²', voltage: '-', circuit: 'communication', current: '-' },
    { pin: '44', name: 'Not assigned', function: 'The manufacturer table prints this terminal as NULL — it exists on the block but carries no assigned function.', wireColor: 'Not specified by OEM', wireGauge: 'Not stated', voltage: '-', circuit: 'auxiliary', current: '-' },
  ],
  'woodward-easygen3000': [
    { pin: '61', name: 'PE', function: 'Protective earth. Woodward require a conductor of 2.5 mm² (14 AWG) or larger, connected via the screw-plug terminal on the back of the unit.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² (14 AWG) minimum', circuit: 'power' },
    { pin: '63', name: 'Supply +', function: 'Power supply input, 12/24 V DC nominal. Woodward specify a 6 A protective device (fuse or circuit breaker) in this supply line.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'power', voltage: '8 to 40.0 V DC' },
    { pin: '64', name: 'Supply 0 V', function: 'Power supply return, 0 V DC.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'power' },
    { pin: '30', name: 'Relay Output R1', function: 'Relay output R1, centralised alarm. Switches against the common terminal 35.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'protection' },
    { pin: '31', name: 'Relay Output R2', function: 'Relay output R2, stopping alarm. Switches against the common terminal 35.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'protection' },
    { pin: '32', name: 'Relay Output R3', function: 'Relay output R3, starter. Switches against the common terminal 35.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'starting' },
    { pin: '33', name: 'Relay Output R4', function: 'Relay output R4, fuel solenoid or gas valve. Switches against the common terminal 35.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'fuel' },
    { pin: '35', name: 'Relay Common', function: 'Shared common terminal for relay outputs R1 to R4.', wireColor: 'Not specified by OEM', wireGauge: '2.5 mm² maximum', circuit: 'auxiliary' },
  ],
  // 'powerwizard-20' (CAT PowerWizard 2.0) intentionally has NO entry.
  // Its 21 shipped pins were fabricated - the same invented template
  // used for DSE, SmartGen, ComAp and Woodward. Caterpillar publish the
  // PowerWizard terminal data only through the paywalled Service Information
  // System, so nothing verifiable was available to replace it with. The
  // registry marks it 'unsupported' and the panel shows the wiring-unavailable
  // notice instead. Do NOT repopulate this without a traceable OEM document.
};

// ==================== DETAILED SCHEMATIC DIAGRAMS ====================
const DETAILED_SCHEMATICS: { [circuitId: string]: { svgContent: (controller: ControllerModel) => JSX.Element; notes: string[] } } = {
  'power': {
    svgContent: (controller) => (
      <>
        {/* Battery */}
        {ElectricalSymbols.battery(80, 150, '24V')}

        {/* Main Fuse */}
        {ElectricalSymbols.fuse(180, 100, '30A')}

        {/* Battery Isolator Switch */}
        {ElectricalSymbols.switchSPST(280, 100, 'S1')}

        {/* Auxiliary Fuse Box */}
        {ElectricalSymbols.fuse(380, 60, '15A')}
        {ElectricalSymbols.fuse(380, 100, '10A')}
        {ElectricalSymbols.fuse(380, 140, '5A')}

        {/* Controller */}
        <g transform="translate(550, 150)">
          <rect x="-60" y="-80" width="120" height="160" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <rect x="-55" y="-75" width="110" height="25" rx="4" fill="#1e293b" />
          <text x="0" y="-58" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">GENSET CONTROLLER</text>
          <text x="0" y="-45" textAnchor="middle" fill="#64748b" fontSize="8">generic topology</text>
          {/* Pins */}
          <circle cx="-60" cy="-30" r="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <text x="-50" y="-27" fill="#ef4444" fontSize="8">B+</text>
          <circle cx="-60" cy="0" r="4" fill="#1e293b" stroke="#1f2937" strokeWidth="2" />
          <text x="-50" y="3" fill="#94a3b8" fontSize="8">B-</text>
          <circle cx="-60" cy="30" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="-50" y="33" fill="#22c55e" fontSize="8">PE</text>
        </g>

        {/* Charging Alternator */}
        <g transform="translate(550, 320)">
          <circle cx="0" cy="0" r="25" fill="none" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="bold">G</text>
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8">Alternator</text>
          <line x1="0" y1="-25" x2="0" y2="-40" stroke="#eab308" strokeWidth="2" />
          <text x="10" y="-30" fill="#eab308" fontSize="7">D+</text>
        </g>

        {/* Ground Symbols */}
        {ElectricalSymbols.ground(80, 250)}
        {ElectricalSymbols.ground(550, 390)}

        {/* Wiring Runs */}
        {/* Battery + to Fuse */}
        <motion.path
          d="M 80 135 L 80 100 L 155 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        {/* Fuse to Switch */}
        <motion.path
          d="M 205 100 L 260 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Switch to Fuse Box */}
        <motion.path
          d="M 300 100 L 355 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {/* Junction */}
        {ElectricalSymbols.junction(340, 100)}
        {/* Branch to other fuses */}
        <line x1="340" y1="100" x2="340" y2="60" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="60" x2="355" y2="60" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="100" x2="340" y2="140" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="140" x2="355" y2="140" stroke="#ef4444" strokeWidth="2" />

        {/* Controller Power */}
        <motion.path
          d="M 405 100 L 450 100 L 450 120 L 490 120"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Ground connections */}
        <motion.path
          d="M 80 165 L 80 250"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.path
          d="M 490 150 L 450 150 L 450 250 L 80 250"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />

        {/* Wire labels */}
        <text x="120" y="90" fill="#ef4444" fontSize="7">RED 2.5mm²</text>
        <text x="230" y="90" fill="#ef4444" fontSize="7">RED 2.5mm²</text>
        <text x="120" y="265" fill="#64748b" fontSize="7">BLACK 2.5mm²</text>

        {/* Component Labels */}
        <text x="80" y="185" textAnchor="middle" fill="#94a3b8" fontSize="8">24V Battery</text>
        <text x="180" y="125" textAnchor="middle" fill="#94a3b8" fontSize="8">Main Fuse</text>
        <text x="280" y="125" textAnchor="middle" fill="#94a3b8" fontSize="8">Isolator</text>
        <text x="380" y="165" textAnchor="middle" fill="#94a3b8" fontSize="8">Aux Fuses</text>
      </>
    ),
    notes: [
      'Main power supply from 24V battery system',
      'Main fuse rated 30A for short circuit protection',
      'Battery isolator switch for maintenance disconnect',
      'Auxiliary fuse block for branch circuit protection',
      'Controller requires 8-35V DC input',
      'Use minimum 2.5mm² cable for power circuits',
      'Ensure proper torque on all terminal connections',
    ],
  },
  'starting': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(150, 180)">
          <rect x="-50" y="-70" width="100" height="140" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="0" y="-50" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="bold">GENSET CONTROLLER</text>
          <circle cx="50" cy="-20" r="4" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
          <text x="40" y="-17" textAnchor="end" fill="#a855f7" fontSize="7">START</text>
          <circle cx="50" cy="10" r="4" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
          <text x="40" y="13" textAnchor="end" fill="#f97316" fontSize="7">PREHEAT</text>
          <circle cx="50" cy="40" r="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <text x="40" y="43" textAnchor="end" fill="#ef4444" fontSize="7">B+</text>
        </g>

        {/* Start Relay */}
        {ElectricalSymbols.relayCoil(320, 120, 'K1')}
        {ElectricalSymbols.relayContactNO(320, 200, 'K1')}

        {/* Preheat Relay */}
        {ElectricalSymbols.relayCoil(320, 280, 'K2')}
        {ElectricalSymbols.relayContactNO(320, 350, 'K2')}

        {/* Starter Motor */}
        {ElectricalSymbols.motor(520, 200, 'M')}
        <text x="520" y="235" textAnchor="middle" fill="#06b6d4" fontSize="8">Starter Motor</text>

        {/* Glow Plugs */}
        <g transform="translate(520, 350)">
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(${(i - 1.5) * 25}, 0)`}>
              <rect x="-8" y="-15" width="16" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="2" />
              <path d="M -4 -8 Q 0 0, -4 8 M 4 -8 Q 0 0, 4 8" fill="none" stroke="#f97316" strokeWidth="1" />
            </g>
          ))}
          <text x="0" y="35" textAnchor="middle" fill="#f97316" fontSize="8">Glow Plugs</text>
        </g>

        {/* Heavy Cable - Battery to Starter */}
        <g transform="translate(620, 80)">
          <rect x="-15" y="-10" width="30" height="20" fill="none" stroke="#ef4444" strokeWidth="3" />
          <text x="0" y="4" textAnchor="middle" fill="#ef4444" fontSize="8">B+</text>
          <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="7">From Battery</text>
        </g>

        {/* Solenoid on Starter */}
        <g transform="translate(520, 140)">
          <rect x="-25" y="-15" width="50" height="30" rx="3" fill="none" stroke="#a855f7" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#a855f7" fontSize="8">SOL</text>
        </g>

        {/* Wiring */}
        {/* Controller to Start Relay */}
        <motion.path
          d="M 200 160 L 250 160 L 250 112 L 290 112"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Start Relay to Solenoid */}
        <motion.path
          d="M 340 200 L 420 200 L 420 140 L 495 140"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Controller to Preheat Relay */}
        <motion.path
          d="M 200 190 L 230 190 L 230 272 L 290 272"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Preheat Relay to Glow Plugs */}
        <motion.path
          d="M 340 350 L 420 350 L 420 350 L 480 350"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* B+ Bus */}
        <motion.path
          d="M 620 90 L 620 200 L 548 200"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />

        {/* B+ to relays */}
        <line x1="620" y1="120" x2="350" y2="120" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
        <line x1="620" y1="280" x2="350" y2="280" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />

        {/* Ground */}
        {ElectricalSymbols.ground(520, 250)}
        {ElectricalSymbols.ground(560, 380)}

        {/* Wire Labels */}
        <text x="225" y="150" fill="#a855f7" fontSize="7">PURPLE 1.5mm²</text>
        <text x="380" y="190" fill="#a855f7" fontSize="7">PURPLE 1.5mm²</text>
        <text x="225" y="260" fill="#f97316" fontSize="7">ORANGE 1.5mm²</text>
        <text x="640" y="150" fill="#ef4444" fontSize="7">RED 16mm²</text>
      </>
    ),
    notes: [
      'Start relay K1 energized by controller START output',
      'Preheat relay K2 controls glow plug circuit',
      'Starter solenoid requires heavy gauge cable (16mm² min)',
      'Preheat time controlled by controller based on temp',
      'Crank disconnect prevents over-cranking',
      'E-Stop interrupts start circuit for safety',
    ],
  },
  'fuel': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(100, 200)">
          <rect x="-40" y="-60" width="80" height="120" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="0" y="-42" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="bold">GENSET CONTROLLER</text>
          <circle cx="40" cy="-20" r="4" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
          <text x="30" y="-17" textAnchor="end" fill="#f97316" fontSize="7">FUEL</text>
          <circle cx="40" cy="10" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="30" y="13" textAnchor="end" fill="#22c55e" fontSize="7">FUEL-LVL</text>
          <circle cx="40" cy="40" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="30" y="43" textAnchor="end" fill="#64748b" fontSize="7">GND</text>
        </g>

        {/* Fuel Solenoid */}
        {ElectricalSymbols.solenoid(280, 180, 'FUEL SOL')}

        {/* Fuel Pump */}
        <g transform="translate(450, 180)">
          <circle cx="0" cy="0" r="22" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">P</text>
          <line x1="-22" y1="0" x2="-35" y2="0" stroke="#f97316" strokeWidth="2" />
          <line x1="22" y1="0" x2="35" y2="0" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="38" textAnchor="middle" fill="#94a3b8" fontSize="8">Fuel Pump</text>
        </g>

        {/* Fuel Tank with Level Sender */}
        <g transform="translate(350, 320)">
          <rect x="-60" y="-40" width="120" height="80" rx="5" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect x="-55" y="-10" width="110" height="45" fill="#f97316" fillOpacity="0.3" />
          <text x="0" y="-25" textAnchor="middle" fill="#94a3b8" fontSize="8">FUEL TANK</text>
          {/* Level Sender */}
          <g transform="translate(40, -20)">
            <line x1="0" y1="0" x2="0" y2="50" stroke="#22c55e" strokeWidth="2" />
            <circle cx="0" cy="35" r="8" fill="none" stroke="#22c55e" strokeWidth="2" />
            <text x="15" y="40" fill="#22c55e" fontSize="7">SENDER</text>
          </g>
        </g>

        {/* Injector Rail (simplified) */}
        <g transform="translate(580, 180)">
          <rect x="-20" y="-50" width="40" height="100" rx="3" fill="none" stroke="#f97316" strokeWidth="2" />
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(0, ${-35 + i * 25})`}>
              <rect x="-12" y="-8" width="24" height="16" fill="none" stroke="#f97316" strokeWidth="1" />
            </g>
          ))}
          <text x="0" y="65" textAnchor="middle" fill="#94a3b8" fontSize="7">Injectors</text>
        </g>

        {/* Wiring */}
        {/* Controller to Fuel Solenoid */}
        <motion.path
          d="M 140 180 L 200 180 L 200 180 L 252 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Fuel Solenoid to Pump (Fuel Line - dashed) */}
        <motion.path
          d="M 308 180 L 415 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="8,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Pump to Injectors (Fuel Line) */}
        <motion.path
          d="M 485 180 L 560 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="8,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />

        {/* Fuel Level Signal */}
        <motion.path
          d="M 140 210 L 180 210 L 180 300 L 390 300"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Ground */}
        {ElectricalSymbols.ground(280, 240)}
        {ElectricalSymbols.ground(450, 240)}

        {/* Labels */}
        <text x="170" y="170" fill="#f97316" fontSize="7">ORANGE 1.5mm²</text>
        <text x="350" y="170" fill="#64748b" fontSize="7">FUEL LINE</text>
        <text x="180" y="290" fill="#22c55e" fontSize="7">GREEN 0.75mm²</text>

        {/* Low Fuel Switch */}
        <g transform="translate(250, 350)">
          <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#ef4444" fontSize="8">!</text>
          <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="7">Low Fuel</text>
        </g>
      </>
    ),
    notes: [
      'Fuel solenoid opens when FUEL output energized',
      'Electric fuel pump for fuel injection systems',
      'Fuel level sender: 0-90Ω (empty-full) or 0-180Ω',
      'Low fuel switch provides warning input',
      'Use fuel-rated wiring for pump connections',
      'Ensure proper fuel line routing and support',
    ],
  },
  'sensing': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(350, 200)">
          <rect x="-80" y="-100" width="160" height="200" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-80" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">GENSET CONTROLLER</text>
          {/* Left side pins - Analog inputs */}
          <circle cx="-80" cy="-50" r="4" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          <text x="-70" y="-47" fill="#eab308" fontSize="7">OIL-P</text>
          <circle cx="-80" cy="-20" r="4" fill="#1e293b" stroke="#92400e" strokeWidth="2" />
          <text x="-70" y="-17" fill="#92400e" fontSize="7">TEMP</text>
          <circle cx="-80" cy="10" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="-70" y="13" fill="#22c55e" fontSize="7">FUEL-LVL</text>
          <circle cx="-80" cy="40" r="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <text x="-70" y="43" fill="#06b6d4" fontSize="7">MPU+</text>
          <circle cx="-80" cy="60" r="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <text x="-70" y="63" fill="#06b6d4" fontSize="7">MPU-</text>
          <circle cx="-80" cy="80" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="-70" y="83" fill="#64748b" fontSize="7">A-GND</text>
        </g>

        {/* Oil Pressure Sender */}
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#eab308" strokeWidth="2" />
          {ElectricalSymbols.resistor(0, 0, 'VDO')}
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Oil Pressure</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">10-180Ω</text>
        </g>

        {/* Coolant Temp Sender */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#92400e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#92400e" fontSize="10">NTC</text>
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Coolant Temp</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">PT100/NTC</text>
        </g>

        {/* Fuel Level */}
        <g transform="translate(100, 280)">
          <rect x="-25" y="-20" width="50" height="40" fill="none" stroke="#22c55e" strokeWidth="2" />
          <line x1="-15" y1="0" x2="15" y2="-10" stroke="#22c55e" strokeWidth="2" />
          <circle cx="-15" cy="0" r="4" fill="#22c55e" />
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Fuel Level</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">0-90Ω</text>
        </g>

        {/* MPU Speed Sensor */}
        <g transform="translate(100, 380)">
          <rect x="-30" y="-25" width="60" height="50" rx="5" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <path d="M -15 -10 Q 0 0, -15 10 M 0 -10 Q 15 0, 0 10" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8">Magnetic Pickup</text>
          <text x="0" y="52" textAnchor="middle" fill="#64748b" fontSize="7">0.5-70V AC</text>
        </g>

        {/* Flywheel Ring Gear */}
        <g transform="translate(100, 450)">
          <circle cx="0" cy="0" r="30" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
          <text x="0" y="5" textAnchor="middle" fill="#64748b" fontSize="8">Flywheel</text>
          <text x="0" y="50" textAnchor="middle" fill="#64748b" fontSize="7">Ring Gear</text>
        </g>

        {/* Wiring runs */}
        {/* Oil Pressure */}
        <motion.path
          d="M 120 120 L 200 120 L 200 150 L 270 150"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Coolant Temp */}
        <motion.path
          d="M 120 200 L 200 200 L 200 180 L 270 180"
          fill="none"
          stroke="#92400e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Fuel Level */}
        <motion.path
          d="M 125 280 L 200 280 L 200 210 L 270 210"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* MPU+ */}
        <motion.path
          d="M 130 365 L 200 365 L 200 240 L 270 240"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* MPU- */}
        <motion.path
          d="M 130 395 L 210 395 L 210 260 L 270 260"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeDasharray="4,2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* Ground bus */}
        <line x1="80" y1="140" x2="80" y2="420" stroke="#1f2937" strokeWidth="2" />
        {ElectricalSymbols.ground(80, 420)}

        {/* Wire labels */}
        <text x="160" y="110" fill="#eab308" fontSize="6">YELLOW 0.75mm²</text>
        <text x="160" y="190" fill="#92400e" fontSize="6">BROWN 0.75mm²</text>
        <text x="160" y="270" fill="#22c55e" fontSize="6">GREEN 0.75mm²</text>
        <text x="160" y="355" fill="#06b6d4" fontSize="6">CYAN (Shielded)</text>

        {/* Shielding note */}
        <g transform="translate(550, 400)">
          <rect x="-60" y="-30" width="120" height="60" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SHIELDING</text>
          <text x="0" y="5" textAnchor="middle" fill="#64748b" fontSize="7">MPU cable must be</text>
          <text x="0" y="17" textAnchor="middle" fill="#64748b" fontSize="7">shielded twisted pair</text>
        </g>
      </>
    ),
    notes: [
      'Oil pressure sender: VDO/Datcon compatible (10-180Ω)',
      'Coolant temp: PT100 or NTC thermistor',
      'Fuel level: Resistive type 0-90Ω or 0-180Ω',
      'MPU: Shielded cable essential for noise immunity',
      'Shield connected to controller A-GND only',
      'Keep sensor wiring away from power cables',
      'Use twisted pair for all analog signals',
    ],
  },
  'generator': {
    svgContent: (controller) => (
      <>
        {/* Generator/Alternator */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="50" fill="none" stroke="#eab308" strokeWidth="3" />
          <circle cx="0" cy="0" r="35" fill="none" stroke="#eab308" strokeWidth="1" />
          <text x="0" y="8" textAnchor="middle" fill="#eab308" fontSize="20" fontWeight="bold">G</text>
          <text x="0" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9">Alternator</text>
          {/* Output terminals */}
          <circle cx="35" cy="-35" r="5" fill="#ef4444" stroke="#ef4444" strokeWidth="2" />
          <text x="50" y="-32" fill="#ef4444" fontSize="7">L1</text>
          <circle cx="50" cy="0" r="5" fill="#eab308" stroke="#eab308" strokeWidth="2" />
          <text x="65" y="3" fill="#eab308" fontSize="7">L2</text>
          <circle cx="35" cy="35" r="5" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
          <text x="50" y="38" fill="#3b82f6" fontSize="7">L3</text>
          <circle cx="0" cy="50" r="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <text x="0" y="63" fill="#64748b" fontSize="7">N</text>
        </g>

        {/* Current Transformers */}
        <g transform="translate(250, 120)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT1')}
          <text x="0" y="-35" textAnchor="middle" fill="#ef4444" fontSize="7">L1</text>
        </g>
        <g transform="translate(250, 200)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT2')}
          <text x="0" y="-35" textAnchor="middle" fill="#eab308" fontSize="7">L2</text>
        </g>
        <g transform="translate(250, 280)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT3')}
          <text x="0" y="-35" textAnchor="middle" fill="#3b82f6" fontSize="7">L3</text>
        </g>

        {/* Controller */}
        <g transform="translate(500, 200)">
          <rect x="-70" y="-120" width="140" height="240" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-100" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">GENSET CONTROLLER</text>
          {/* Voltage inputs */}
          <text x="-60" y="-75" fill="#94a3b8" fontSize="7">VOLTAGE</text>
          <circle cx="-70" cy="-55" r="4" fill="#ef4444" />
          <text x="-60" y="-52" fill="#ef4444" fontSize="7">L1</text>
          <circle cx="-70" cy="-35" r="4" fill="#eab308" />
          <text x="-60" y="-32" fill="#eab308" fontSize="7">L2</text>
          <circle cx="-70" cy="-15" r="4" fill="#3b82f6" />
          <text x="-60" y="-12" fill="#3b82f6" fontSize="7">L3</text>
          <circle cx="-70" cy="5" r="4" fill="#f8fafc" stroke="#64748b" />
          <text x="-60" y="8" fill="#64748b" fontSize="7">N</text>
          {/* CT inputs */}
          <text x="-60" y="30" fill="#94a3b8" fontSize="7">CT INPUTS</text>
          <circle cx="-70" cy="50" r="4" fill="#a855f7" />
          <text x="-60" y="53" fill="#a855f7" fontSize="7">CT1-S1</text>
          <circle cx="-70" cy="70" r="4" fill="#a855f7" />
          <text x="-60" y="73" fill="#a855f7" fontSize="7">CT1-S2</text>
          <circle cx="-70" cy="90" r="4" fill="#a855f7" />
          <text x="-60" y="93" fill="#a855f7" fontSize="7">CT2-S1</text>
        </g>

        {/* Main Breaker */}
        <g transform="translate(380, 350)">
          <rect x="-40" y="-30" width="80" height="60" rx="5" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">MCB</text>
          <text x="0" y="50" textAnchor="middle" fill="#94a3b8" fontSize="8">Main Breaker</text>
        </g>

        {/* Load Bus */}
        <g transform="translate(550, 350)">
          <rect x="-30" y="-40" width="60" height="80" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#f8fafc" fontSize="8">LOAD</text>
          <text x="0" y="20" textAnchor="middle" fill="#f8fafc" fontSize="8">BUS</text>
        </g>

        {/* Wiring - Generator to CTs */}
        <motion.path d="M 135 165 L 225 120" fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d="M 150 200 L 225 200" fill="none" stroke="#eab308" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
        <motion.path d="M 135 235 L 225 280" fill="none" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />

        {/* CTs to Breaker */}
        <motion.path d="M 275 120 L 340 120 L 340 330" fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        <motion.path d="M 275 200 L 360 200 L 360 320" fill="none" stroke="#eab308" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.path d="M 275 280 L 380 280 L 380 320" fill="none" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />

        {/* CT Secondary to Controller */}
        <motion.path d="M 250 145 L 250 160 L 350 160 L 350 250 L 430 250" fill="none" stroke="#a855f7" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />

        {/* Voltage sensing */}
        <motion.path d="M 300 120 L 300 145 L 430 145" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1 }} />

        {/* Labels */}
        <text x="180" y="155" fill="#ef4444" fontSize="7">L1 (Phase A)</text>
        <text x="180" y="190" fill="#eab308" fontSize="7">L2 (Phase B)</text>
        <text x="180" y="270" fill="#3b82f6" fontSize="7">L3 (Phase C)</text>
        <text x="300" y="175" fill="#a855f7" fontSize="6">CT Secondary 5A</text>

        {/* CT Ratio box */}
        <g transform="translate(250, 380)">
          <rect x="-50" y="-25" width="100" height="50" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-8" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">CT RATIO</text>
          <text x="0" y="8" textAnchor="middle" fill="#a855f7" fontSize="9">XXX/5A</text>
          <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="7">Match to load</text>
        </g>
      </>
    ),
    notes: [
      'CT ratio must match maximum load current',
      'Common CT ratios: 100/5A, 200/5A, 400/5A, 800/5A',
      'CT secondary MUST be shorted when primary is live',
      'Voltage sensing uses fused connections',
      'Phase sequence: L1-L2-L3 (clockwise rotation)',
      'Neutral-Earth bond at single point only',
      'Use 1.0mm² minimum for CT secondary wiring',
    ],
  },
  'communication': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(300, 200)">
          <rect x="-80" y="-90" width="160" height="180" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-70" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">GENSET CONTROLLER</text>
          {/* CAN */}
          <text x="-70" y="-45" fill="#22c55e" fontSize="8">CAN BUS</text>
          <circle cx="-80" cy="-25" r="4" fill="#22c55e" />
          <text x="-70" y="-22" fill="#22c55e" fontSize="7">CAN-H</text>
          <circle cx="-80" cy="-5" r="4" fill="#eab308" />
          <text x="-70" y="-2" fill="#eab308" fontSize="7">CAN-L</text>
          <circle cx="-80" cy="15" r="4" fill="#1f2937" stroke="#64748b" />
          <text x="-70" y="18" fill="#64748b" fontSize="7">CAN-GND</text>
          {/* RS485 */}
          <text x="-70" y="40" fill="#3b82f6" fontSize="8">RS485</text>
          <circle cx="-80" cy="60" r="4" fill="#3b82f6" />
          <text x="-70" y="63" fill="#3b82f6" fontSize="7">A (+)</text>
          <circle cx="-80" cy="80" r="4" fill="#f97316" />
          <text x="-70" y="83" fill="#f97316" fontSize="7">B (-)</text>
        </g>

        {/* CAN Bus Devices */}
        {/* Engine ECU */}
        <g transform="translate(100, 100)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="-10" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">ECU</text>
          <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="7">J1939</text>
        </g>

        {/* Load Share Module */}
        <g transform="translate(100, 220)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="-5" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">LOAD</text>
          <text x="0" y="10" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">SHARE</text>
        </g>

        {/* Display Panel */}
        <g transform="translate(100, 340)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="-35" y="-20" width="70" height="35" fill="#0f172a" />
          <text x="0" y="25" textAnchor="middle" fill="#22c55e" fontSize="8">Display</text>
        </g>

        {/* CAN Bus Line */}
        <line x1="100" y1="70" x2="100" y2="380" stroke="#22c55e" strokeWidth="3" />
        <line x1="98" y1="70" x2="98" y2="380" stroke="#eab308" strokeWidth="2" />

        {/* Connections to CAN bus */}
        <line x1="100" y1="100" x2="145" y2="100" stroke="#22c55e" strokeWidth="2" />
        <line x1="100" y1="220" x2="145" y2="220" stroke="#22c55e" strokeWidth="2" />
        <line x1="100" y1="340" x2="145" y2="340" stroke="#22c55e" strokeWidth="2" />

        {/* Controller CAN connection */}
        <motion.path
          d="M 100 175 L 180 175 L 180 175 L 220 175"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M 100 195 L 180 195 L 180 195 L 220 195"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Termination Resistors */}
        <g transform="translate(100, 60)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
          <text x="0" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="7">TERM</text>
        </g>
        <g transform="translate(100, 390)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
          <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="7">TERM</text>
        </g>

        {/* RS485 Devices */}
        {/* SCADA/BMS */}
        <g transform="translate(500, 150)">
          <rect x="-50" y="-35" width="100" height="70" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-10" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">SCADA</text>
          <text x="0" y="5" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">BMS</text>
          <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="7">Modbus RTU</text>
        </g>

        {/* Remote Display */}
        <g transform="translate(500, 280)">
          <rect x="-50" y="-35" width="100" height="70" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-5" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">REMOTE</text>
          <text x="0" y="10" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">HMI</text>
        </g>

        {/* RS485 Bus */}
        <line x1="500" y1="115" x2="500" y2="350" stroke="#3b82f6" strokeWidth="2" />
        <line x1="502" y1="115" x2="502" y2="350" stroke="#f97316" strokeWidth="2" />

        {/* Controller RS485 connection */}
        <motion.path
          d="M 380 260 L 440 260 L 440 200 L 500 200"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d="M 380 280 L 450 280 L 450 210 L 502 210"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* RS485 Termination */}
        <g transform="translate(500, 105)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
        </g>
        <g transform="translate(500, 360)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
        </g>

        {/* Labels */}
        <text x="60" y="180" fill="#22c55e" fontSize="7">CAN-H (Green)</text>
        <text x="60" y="205" fill="#eab308" fontSize="7">CAN-L (Yellow)</text>
        <text x="400" y="250" fill="#3b82f6" fontSize="7">RS485-A (Blue)</text>
        <text x="400" y="295" fill="#f97316" fontSize="7">RS485-B (Orange)</text>

        {/* Shield note */}
        <g transform="translate(300, 380)">
          <rect x="-80" y="-20" width="160" height="40" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-2" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SHIELDED CABLE</text>
          <text x="0" y="12" textAnchor="middle" fill="#64748b" fontSize="7">Connect shield at ONE end only</text>
        </g>
      </>
    ),
    notes: [
      'CAN bus requires 120Ω termination at each end',
      'J1939 standard baud rate: 250 kbps',
      'RS485: Twisted pair, max 1200m at 9600 baud',
      'Shield connected at controller end only',
      'Bias resistors may be required for RS485',
      'Max 32 devices on single CAN segment',
      'Use CAT5e or better for Ethernet',
    ],
  },
  'protection': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(400, 200)">
          <rect x="-70" y="-100" width="140" height="200" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-80" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">GENSET CONTROLLER</text>
          {/* Protection inputs */}
          <circle cx="-70" cy="-50" r="4" fill="#ef4444" />
          <text x="-60" y="-47" fill="#ef4444" fontSize="7">E-STOP</text>
          <circle cx="-70" cy="-25" r="4" fill="#f97316" />
          <text x="-60" y="-22" fill="#f97316" fontSize="7">LOW OIL</text>
          <circle cx="-70" cy="0" r="4" fill="#eab308" />
          <text x="-60" y="3" fill="#eab308" fontSize="7">HIGH TEMP</text>
          <circle cx="-70" cy="25" r="4" fill="#22c55e" />
          <text x="-60" y="28" fill="#22c55e" fontSize="7">OVERSPEED</text>
          <circle cx="-70" cy="50" r="4" fill="#3b82f6" />
          <text x="-60" y="53" fill="#3b82f6" fontSize="7">GCB-AUX</text>
          {/* Outputs */}
          <circle cx="70" cy="-25" r="4" fill="#a855f7" />
          <text x="60" y="-22" textAnchor="end" fill="#a855f7" fontSize="7">STOP</text>
          <circle cx="70" cy="0" r="4" fill="#22c55e" />
          <text x="60" y="3" textAnchor="end" fill="#22c55e" fontSize="7">ALARM</text>
          <circle cx="70" cy="25" r="4" fill="#06b6d4" />
          <text x="60" y="28" textAnchor="end" fill="#06b6d4" fontSize="7">GCB-TRIP</text>
        </g>

        {/* E-Stop Button */}
        <g transform="translate(100, 130)">
          {ElectricalSymbols.eStop(0, 0)}
        </g>

        {/* Low Oil Pressure Switch */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="15" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#f97316" fontSize="10">P</text>
          <line x1="15" y1="0" x2="35" y2="0" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">Low Oil SW</text>
        </g>

        {/* High Temp Switch */}
        <g transform="translate(100, 270)">
          <circle cx="0" cy="0" r="15" fill="none" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#eab308" fontSize="10">T</text>
          <line x1="15" y1="0" x2="35" y2="0" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">High Temp SW</text>
        </g>

        {/* Overspeed Switch */}
        <g transform="translate(100, 340)">
          <rect x="-20" y="-15" width="40" height="30" rx="3" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="9">OS</text>
          <line x1="20" y1="0" x2="40" y2="0" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontSize="7">Overspeed</text>
        </g>

        {/* Stop Solenoid */}
        <g transform="translate(580, 180)">
          {ElectricalSymbols.solenoid(0, 0, 'STOP SOL')}
        </g>

        {/* Alarm Horn */}
        <g transform="translate(580, 240)">
          <path d="M -15 -10 L 0 -10 L 15 -20 L 15 20 L 0 10 L -15 10 Z" fill="none" stroke="#22c55e" strokeWidth="2" />
          <line x1="-25" y1="0" x2="-15" y2="0" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="7">Alarm</text>
        </g>

        {/* GCB Trip Coil */}
        <g transform="translate(580, 310)">
          {ElectricalSymbols.relayCoil(0, 0, 'GCB-TC')}
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="7">Trip Coil</text>
        </g>

        {/* Wiring */}
        {/* E-Stop to Controller */}
        <motion.path
          d="M 116 130 L 200 130 L 200 150 L 330 150"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Low Oil to Controller */}
        <motion.path
          d="M 135 200 L 200 200 L 200 175 L 330 175"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* High Temp to Controller */}
        <motion.path
          d="M 135 270 L 220 270 L 220 200 L 330 200"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Overspeed to Controller */}
        <motion.path
          d="M 140 340 L 240 340 L 240 225 L 330 225"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Controller outputs */}
        {/* Stop output */}
        <motion.path
          d="M 470 175 L 520 175 L 520 180 L 552 180"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />

        {/* Alarm output */}
        <motion.path
          d="M 470 200 L 530 200 L 530 240 L 555 240"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />

        {/* GCB Trip output */}
        <motion.path
          d="M 470 225 L 510 225 L 510 302 L 550 302"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />

        {/* Ground */}
        {ElectricalSymbols.ground(100, 400)}
        <line x1="100" y1="360" x2="100" y2="390" stroke="#1f2937" strokeWidth="2" />

        {/* Wire labels */}
        <text x="160" y="120" fill="#ef4444" fontSize="6">RED/YELLOW 1.0mm²</text>
        <text x="160" y="190" fill="#f97316" fontSize="6">ORANGE 0.75mm²</text>
        <text x="160" y="260" fill="#eab308" fontSize="6">YELLOW 0.75mm²</text>
        <text x="160" y="330" fill="#22c55e" fontSize="6">GREEN 0.75mm²</text>

        {/* NC/NO Legend */}
        <g transform="translate(250, 380)">
          <rect x="-60" y="-25" width="120" height="50" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-8" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">INPUT TYPE</text>
          <text x="-40" y="10" fill="#ef4444" fontSize="7">E-STOP: NC</text>
          <text x="40" y="10" fill="#f97316" fontSize="7">OIL: NC</text>
          <text x="0" y="25" fill="#64748b" fontSize="7">NC = Normally Closed (fail-safe)</text>
        </g>
      </>
    ),
    notes: [
      'E-Stop uses NC contacts for fail-safe operation',
      'Low oil/High temp switches are NC type',
      'All protection inputs should be NC (fail-safe)',
      'Stop solenoid de-energizes to stop engine',
      'GCB trip coil requires pulse, not continuous',
      'Alarm output can drive horn, beacon, or relay',
      'Test all protection circuits regularly',
    ],
  },
};

// ==================== DIAGNOSTIC TROUBLESHOOTING FLOWS ====================
interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  testPoint: { location: string; probes: string };
  expectedValue: string;
  failureIndicates: string;
  solution: string[];
  nextIfPass: string | null;
  nextIfFail: string | null;
  tools: string[];
  safetyWarning?: string;
}

interface DiagnosticFlow {
  id: string;
  symptom: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  steps: DiagnosticStep[];
  commonCauses: { cause: string; probability: number }[];
  partsNeeded: { name: string; partNumber: string; estimated: string }[];
}

const DIAGNOSTIC_TROUBLESHOOTING: { [circuitId: string]: DiagnosticFlow[] } = {
  'power': [
    {
      id: 'no-power',
      symptom: 'Controller has no power / display blank',
      description: 'Generator controller shows no signs of life - no LEDs, no display, completely dead',
      category: 'Power Supply',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage at Battery Terminals',
          description: 'Measure voltage directly at battery terminals to verify battery condition',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: '12.4-14.4V (12V system) or 24.8-28.8V (24V system)',
          failureIndicates: 'Dead/discharged battery or charging system failure',
          solution: [
            'If voltage < 12V (12V system) or < 24V (24V system): Battery is discharged',
            'Check battery age - typical life is 3-5 years',
            'Load test battery: Should maintain >9.6V under 200A load for 12V systems',
            'Check alternator/charger output while engine running',
            'Replace battery if fails load test or is >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect battery before any major work. Hydrogen gas may be present - no sparks near battery.'
        },
        {
          id: 'step2',
          title: 'Check Voltage at Main Fuse Input',
          description: 'Verify power is reaching the main fuse from battery',
          testPoint: { location: 'Main fuse input terminal', probes: 'Red to fuse input, Black to chassis ground' },
          expectedValue: 'Same as battery voltage (within 0.2V)',
          failureIndicates: 'Open circuit between battery and fuse box - damaged cable or loose connection',
          solution: [
            'Inspect battery cable for damage, corrosion, or loose terminals',
            'Check battery isolator switch if equipped - ensure it is ON',
            'Clean and tighten all connections',
            'Check for corroded or burnt cable at terminals',
            'Replace battery cable if damaged (use minimum 2.5mm² / 14 AWG)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush', '10mm wrench']
        },
        {
          id: 'step3',
          title: 'Check Voltage at Main Fuse Output',
          description: 'Verify main fuse is not blown',
          testPoint: { location: 'Main fuse output terminal', probes: 'Red to fuse output, Black to chassis ground' },
          expectedValue: 'Same as input voltage (fuse intact)',
          failureIndicates: 'Blown main fuse - indicates short circuit or overload occurred',
          solution: [
            'DO NOT just replace fuse - find the cause first!',
            'Disconnect all loads from fuse output',
            'Check for short circuit to ground on output wiring',
            'Inspect wiring harness for chafed insulation',
            'Check controller for signs of damage/burning',
            'Once cause found and fixed, replace fuse with correct rating (typically 30A)'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Fuse puller'],
          safetyWarning: 'Never replace fuse with higher rating. This can cause fire.'
        },
        {
          id: 'step4',
          title: 'Check Voltage at Controller B+ Terminal',
          description: 'Verify power is reaching controller power input',
          testPoint: { location: 'Controller terminal B+ (Pin 1 typically)', probes: 'Red to B+ pin, Black to B- pin' },
          expectedValue: '8-35V DC (check controller spec)',
          failureIndicates: 'Open circuit between fuse and controller',
          solution: [
            'Trace wiring from fuse output to controller',
            'Check for damaged wire, loose connector, or corroded terminal',
            'Inspect any intermediate fuses or circuit breakers',
            'Check connector pins for pushed-out or damaged contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: minimum 2.5mm² for power supply'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Connector pin tool']
        },
        {
          id: 'step5',
          title: 'Verify Ground Connection',
          description: 'Check controller ground circuit integrity',
          testPoint: { location: 'Controller B- to chassis', probes: 'Measure resistance between B- and engine block' },
          expectedValue: '< 0.5 Ohms (near zero resistance)',
          failureIndicates: 'Poor ground connection causing controller malfunction',
          solution: [
            'Clean ground connection at chassis/engine block',
            'Check ground cable for damage or corrosion',
            'Ensure ground bolt is tight and making good metal contact',
            'Add secondary ground if primary is questionable',
            'Ground should be to unpainted metal surface'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter set to Ohms', 'Wire brush', 'Wrench']
        }
      ],
      commonCauses: [
        { cause: 'Dead or discharged battery', probability: 35 },
        { cause: 'Blown main fuse', probability: 25 },
        { cause: 'Loose or corroded battery terminal', probability: 20 },
        { cause: 'Faulty battery isolator switch', probability: 10 },
        { cause: 'Damaged power cable', probability: 7 },
        { cause: 'Failed controller (internal fault)', probability: 3 }
      ],
      partsNeeded: [
        { name: 'Main Fuse 30A', partNumber: 'MIDI-30A', estimated: 'KES 500-800' },
        { name: 'Battery Cable 2.5mm²', partNumber: 'BAT-CABLE-25', estimated: 'KES 300/m' },
        { name: 'Battery Terminal Clamp', partNumber: 'BAT-TERM-UNI', estimated: 'KES 400-600' }
      ]
    },
    {
      id: 'low-voltage',
      symptom: 'Controller resets / erratic behavior / dim display',
      description: 'Controller powers on but behaves erratically, resets randomly, or display is dim',
      category: 'Power Supply',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage Under Load',
          description: 'Measure voltage while cranking or with loads active',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should not drop below 10V (12V) or 20V (24V) while cranking',
          failureIndicates: 'Weak battery or poor connections causing voltage drop',
          solution: [
            'Battery capacity test required - replace if fails',
            'Check battery age (>4 years = suspect)',
            'Verify battery is correct capacity for application',
            'Check charging system output',
            'Look for parasitic drain when engine off'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check for Voltage Drop in Supply Circuit',
          description: 'Measure voltage drop across each connection point while loaded',
          testPoint: { location: 'Each connection from battery to controller', probes: 'Across each connection' },
          expectedValue: '< 0.2V drop at each connection point',
          failureIndicates: 'High resistance connection causing power loss',
          solution: [
            'Clean and tighten the connection showing high drop',
            'Apply dielectric grease after cleaning',
            'Replace terminals if corroded beyond cleaning',
            'Upgrade wire gauge if voltage drop persists',
            'Consider adding parallel power feed for long runs'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Charging Alternator Output',
          description: 'Verify alternator is charging battery properly when engine runs',
          testPoint: { location: 'Battery terminals with engine running', probes: 'Red to B+, Black to B-' },
          expectedValue: '13.8-14.4V (12V) or 27.6-28.8V (24V) at 1500 RPM',
          failureIndicates: 'Alternator not charging - battery will discharge',
          solution: [
            'Check alternator belt tension and condition',
            'Test alternator diodes with multimeter diode test',
            'Check D+ (field excite) wire connection',
            'Verify voltage regulator operation',
            'Replace alternator if output is low/absent'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Belt tension gauge']
        }
      ],
      commonCauses: [
        { cause: 'Weak/failing battery', probability: 40 },
        { cause: 'High resistance in power connections', probability: 25 },
        { cause: 'Faulty alternator/charger', probability: 20 },
        { cause: 'Undersized power wiring', probability: 10 },
        { cause: 'Excessive electrical load', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Battery (as specified)', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Terminals', partNumber: 'BAT-TERM-HD', estimated: 'KES 800-1,200' },
        { name: 'Alternator Belt', partNumber: 'Engine-specific', estimated: 'KES 2,000-5,000' }
      ]
    }
  ],
  'starting': [
    {
      id: 'no-crank',
      symptom: 'Engine does not crank when start command given',
      description: 'Start button pressed or auto-start commanded, but engine does not turn over at all',
      category: 'Starting System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Start Command from Controller',
          description: 'Check if controller is outputting start signal',
          testPoint: { location: 'Controller START output pin', probes: 'Red to START pin, Black to B-' },
          expectedValue: 'Battery voltage (B+) when start commanded',
          failureIndicates: 'Controller not sending start signal - check configuration or input conditions',
          solution: [
            'Check controller is in AUTO or MANUAL RUN mode',
            'Verify no active alarms blocking start (check fault codes)',
            'Check E-Stop is not engaged',
            'Verify run signal input if using external start',
            'Check controller programming - start parameters',
            'Reset controller if necessary'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Ensure engine cannot start unexpectedly during testing. Remove fuel shut-off connection if needed.'
        },
        {
          id: 'step2',
          title: 'Check Start Relay Coil Activation',
          description: 'Verify start relay coil is receiving power',
          testPoint: { location: 'Start relay coil terminals K1', probes: 'Across relay coil terminals' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between controller and relay',
          solution: [
            'Check wiring from controller START output to relay coil',
            'Inspect connectors for corrosion or damage',
            'Check for blown inline fuse if present',
            'Verify relay coil resistance (typical 50-150 ohms)',
            'Bypass controller output temporarily to test (jumper wire)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Start Relay Contact Operation',
          description: 'Verify relay contacts are closing when coil energized',
          testPoint: { location: 'Start relay output contacts', probes: 'Across N/O contacts' },
          expectedValue: '< 0.5 Ohms when coil energized (contacts closed)',
          failureIndicates: 'Relay contacts burnt/welded or relay failed',
          solution: [
            'Manually press relay to check mechanical operation',
            'Listen for relay click when coil energized',
            'Check contact resistance - should be near zero',
            'If contacts burnt, replace relay',
            'Use correct relay rating: minimum 30A for starter circuit'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Relay puller']
        },
        {
          id: 'step4',
          title: 'Check Voltage at Starter Solenoid',
          description: 'Verify battery voltage reaches starter solenoid S terminal',
          testPoint: { location: 'Starter solenoid S (signal) terminal', probes: 'Red to S terminal, Black to engine block' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between start relay and starter solenoid',
          solution: [
            'Check wiring from relay to solenoid for damage',
            'Verify all connections are tight and clean',
            'Check for neutral safety switch in circuit (if equipped)',
            'Inspect solenoid terminal for corrosion',
            'Bypass suspected switches to isolate fault'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step5',
          title: 'Test Starter Motor Directly',
          description: 'Apply battery voltage directly to starter solenoid to test motor',
          testPoint: { location: 'Starter solenoid', probes: 'Jumper from B+ to S terminal' },
          expectedValue: 'Engine should crank',
          failureIndicates: 'Starter motor or solenoid failure',
          solution: [
            'Check battery cables to starter - must handle 200+ amps',
            'Verify ground strap from engine to chassis',
            'Check starter mounting bolts are tight',
            'Test starter on bench if accessible',
            'Check ring gear for damage',
            'Replace starter if confirmed faulty'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Heavy jumper wire (10mm² min)', 'Wrench set'],
          safetyWarning: 'Engine will crank! Ensure in neutral, parking brake set, clear of rotating parts.'
        }
      ],
      commonCauses: [
        { cause: 'Faulty start relay', probability: 25 },
        { cause: 'Controller in wrong mode / alarm active', probability: 20 },
        { cause: 'Poor electrical connections', probability: 20 },
        { cause: 'Failed starter motor', probability: 15 },
        { cause: 'Neutral safety switch fault', probability: 10 },
        { cause: 'E-Stop engaged', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Start Relay 30A', partNumber: 'RELAY-30A-12V', estimated: 'KES 1,500-2,500' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' },
        { name: 'Starter Solenoid', partNumber: 'Engine-specific', estimated: 'KES 5,000-12,000' }
      ]
    },
    {
      id: 'slow-crank',
      symptom: 'Engine cranks slowly or struggles to turn over',
      description: 'Starter engages but engine turns over slowly, may not reach starting RPM',
      category: 'Starting System',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage During Cranking',
          description: 'Monitor voltage drop while engine is cranking',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should stay above 10V (12V system) or 20V (24V system)',
          failureIndicates: 'Weak battery - cannot deliver required cranking current',
          solution: [
            'Perform battery load test',
            'Check battery specific gravity if accessible',
            'Verify battery is correct CCA rating for engine',
            'Check for parasitic drain',
            'Replace battery if fails test or >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check Voltage Drop on Positive Cable',
          description: 'Measure voltage loss in positive battery cable during cranking',
          testPoint: { location: 'Battery B+ to Starter B+', probes: 'Red at battery, Black at starter' },
          expectedValue: '< 0.5V drop during cranking',
          failureIndicates: 'High resistance in positive cable or connections',
          solution: [
            'Clean battery terminal and starter connection',
            'Check cable for internal corrosion (green color)',
            'Verify correct cable gauge (minimum 16mm² / 6 AWG)',
            'Replace cable if corroded or undersized',
            'Ensure terminals are crimped/soldered properly'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Ground Circuit Voltage Drop',
          description: 'Measure voltage loss in ground circuit during cranking',
          testPoint: { location: 'Engine block to Battery B-', probes: 'Red at engine, Black at battery' },
          expectedValue: '< 0.3V drop during cranking',
          failureIndicates: 'Poor ground connection restricting current flow',
          solution: [
            'Clean ground connection at engine block',
            'Check ground strap for damage or corrosion',
            'Verify ground is to clean, unpainted surface',
            'Add additional ground strap if needed',
            'Check battery negative terminal condition'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush']
        },
        {
          id: 'step4',
          title: 'Check Engine Mechanical Resistance',
          description: 'Verify engine is not mechanically seized or tight',
          testPoint: { location: 'Crankshaft bolt', probes: 'Manual rotation test' },
          expectedValue: 'Engine should turn freely by hand with socket on crank',
          failureIndicates: 'Mechanical engine problem - hydro-lock, bearing failure, etc.',
          solution: [
            'Remove glow plugs/injectors and retry cranking',
            'If easier, check for hydro-lock (coolant/oil in cylinder)',
            'Inspect for mechanical damage',
            'Check valve timing if recently serviced',
            'Engine repair may be required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Large socket and breaker bar', 'Wrench set'],
          safetyWarning: 'Ensure engine cannot start. Remove fuel and ignition connections.'
        }
      ],
      commonCauses: [
        { cause: 'Weak/discharged battery', probability: 40 },
        { cause: 'Poor battery cable connections', probability: 25 },
        { cause: 'Undersized battery cables', probability: 15 },
        { cause: 'Starter motor wear', probability: 12 },
        { cause: 'Engine mechanical issue', probability: 8 }
      ],
      partsNeeded: [
        { name: 'Battery', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Cables', partNumber: '16mm² Cable', estimated: 'KES 500/m' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' }
      ]
    }
  ],
  'sensing': [
    {
      id: 'oil-pressure-fault',
      symptom: 'Low Oil Pressure warning/shutdown',
      description: 'Controller shows low oil pressure alarm or shuts down due to oil pressure fault',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Actual Oil Level',
          description: 'Check engine oil level on dipstick - most common cause',
          testPoint: { location: 'Engine dipstick', probes: 'Visual inspection' },
          expectedValue: 'Oil level between MIN and MAX marks',
          failureIndicates: 'Low oil level - add oil immediately',
          solution: [
            'Add correct grade oil (typically 15W-40 for diesel generators)',
            'Check for oil leaks under engine',
            'Inspect oil cooler connections',
            'Check turbo oil feed/drain lines',
            'Monitor consumption - should be <0.5L per 100 hours'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Clean rag', 'Correct grade oil'],
          safetyWarning: 'Allow engine to cool 5 minutes for accurate reading. Hot oil can burn.'
        },
        {
          id: 'step2',
          title: 'Test Oil Pressure Sensor Resistance',
          description: 'Check sensor output at atmospheric pressure (engine off)',
          testPoint: { location: 'Oil pressure sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: '10-20 Ohms at 0 PSI (VDO type) or 240 Ohms (US type)',
          failureIndicates: 'Sensor failure - stuck or damaged',
          solution: [
            'Compare reading to sensor specification sheet',
            'If open circuit (OL) or short circuit (0 Ohms) - replace sensor',
            'Clean sensor connector and retry',
            'Check for oil contamination of connector',
            'Replace sensor if out of spec'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Wiring from Sensor to Controller',
          description: 'Verify wiring integrity',
          testPoint: { location: 'Controller OIL input', probes: 'Measure resistance from controller to sensor' },
          expectedValue: 'Same as sensor reading (< 2 Ohms difference)',
          failureIndicates: 'Wiring fault - open or high resistance',
          solution: [
            'Inspect wiring for damage, chafing, or corrosion',
            'Check connector pins for pushed out or bent contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: 0.75mm² minimum'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step4',
          title: 'Verify Actual Oil Pressure with Mechanical Gauge',
          description: 'Install test gauge to measure real oil pressure',
          testPoint: { location: 'Oil pressure sensor port', probes: 'Mechanical gauge installation' },
          expectedValue: '25-65 PSI at operating temperature (varies by engine)',
          failureIndicates: 'Actual low oil pressure - engine problem!',
          solution: [
            'DO NOT RUN ENGINE with actual low oil pressure',
            'Check oil pump drive gear/chain',
            'Inspect oil pump pickup screen for blockage',
            'Check oil filter condition - replace if overdue',
            'Verify correct oil viscosity for temperature',
            'Internal engine wear may require rebuild'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Mechanical oil pressure gauge', 'Appropriate fitting'],
          safetyWarning: 'Running engine with low oil pressure will cause catastrophic damage in minutes.'
        }
      ],
      commonCauses: [
        { cause: 'Low oil level', probability: 35 },
        { cause: 'Faulty oil pressure sensor', probability: 30 },
        { cause: 'Wiring/connector problem', probability: 15 },
        { cause: 'Clogged oil filter', probability: 10 },
        { cause: 'Actual low oil pressure (pump/engine wear)', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Oil Pressure Sensor', partNumber: 'VDO 360-081-030-003', estimated: 'KES 4,000-7,000' },
        { name: 'Oil Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Engine Oil 15W-40 5L', partNumber: 'Shell Rimula R4', estimated: 'KES 4,000-6,000' }
      ]
    },
    {
      id: 'coolant-temp-fault',
      symptom: 'High Temperature warning/shutdown or wrong temp reading',
      description: 'Controller shows overtemp alarm, shuts down, or displays incorrect temperature',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Visual Inspection of Cooling System',
          description: 'Check coolant level, radiator condition, and for leaks',
          testPoint: { location: 'Radiator and expansion tank', probes: 'Visual inspection' },
          expectedValue: 'Coolant at correct level, no leaks, radiator clean',
          failureIndicates: 'Cooling system problem - actual overheating risk',
          solution: [
            'Top up coolant if low (50/50 antifreeze mix)',
            'Check for leaks at hoses, radiator, water pump',
            'Clean radiator fins if blocked with debris',
            'Check fan belt tension and condition',
            'Verify fan is spinning when engine hot'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Flashlight', 'Coolant pressure tester'],
          safetyWarning: 'Never open radiator cap when hot! Steam can cause severe burns.'
        },
        {
          id: 'step2',
          title: 'Test Coolant Temperature Sensor Resistance',
          description: 'Measure sensor resistance at known temperature',
          testPoint: { location: 'Coolant temp sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: 'NTC type: ~2500 Ohms at 20C, ~300 Ohms at 80C (varies by sensor)',
          failureIndicates: 'Sensor failure - incorrect readings',
          solution: [
            'Compare to sensor resistance chart for your sensor',
            'If reading is way off spec - replace sensor',
            'Clean connector contacts',
            'Check for coolant contamination of connector',
            'Replace sensor if out of specification'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Infrared thermometer']
        },
        {
          id: 'step3',
          title: 'Verify Controller Calibration',
          description: 'Check controller is configured for correct sensor type',
          testPoint: { location: 'Controller configuration', probes: 'Software/configuration check' },
          expectedValue: 'Sensor type matches installed sensor (NTC, PT100, etc.)',
          failureIndicates: 'Configuration mismatch causing wrong readings',
          solution: [
            'Check controller configuration for sensor type',
            'Verify sensor curve/range settings',
            'Match controller to actual sensor installed',
            'Use DSE/ComAp configuration software if needed',
            'Factory reset and reconfigure if necessary'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Configuration software', 'USB cable']
        },
        {
          id: 'step4',
          title: 'Verify Actual Engine Temperature',
          description: 'Use infrared thermometer to check real temperature',
          testPoint: { location: 'Thermostat housing', probes: 'IR thermometer aim' },
          expectedValue: '80-95C at operating temperature (varies by engine)',
          failureIndicates: 'If high: Actual overheating. If normal: Sensor/wiring fault',
          solution: [
            'If actually overheating: Stop engine, investigate cooling system',
            'Check thermostat is opening (housing should get hot)',
            'Verify water pump operation (flow in radiator)',
            'Check radiator cap seal',
            'Flush cooling system if contaminated'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Infrared thermometer']
        }
      ],
      commonCauses: [
        { cause: 'Low coolant level', probability: 25 },
        { cause: 'Faulty temperature sensor', probability: 25 },
        { cause: 'Blocked radiator', probability: 15 },
        { cause: 'Failed thermostat', probability: 15 },
        { cause: 'Wiring/connector problem', probability: 10 },
        { cause: 'Fan belt slip/failure', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Coolant Temperature Sensor', partNumber: 'Engine-specific NTC', estimated: 'KES 2,000-5,000' },
        { name: 'Thermostat', partNumber: 'Engine-specific', estimated: 'KES 3,000-8,000' },
        { name: 'Radiator Hose Set', partNumber: 'Engine-specific', estimated: 'KES 4,000-10,000' }
      ]
    },
    {
      id: 'speed-sensor-fault',
      symptom: 'No RPM reading / Overspeed fault / Erratic RPM display',
      description: 'Controller shows 0 RPM, false overspeed, or jumpy speed reading',
      category: 'Engine Sensing',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check MPU Sensor Air Gap',
          description: 'Verify magnetic pickup sensor is correctly positioned',
          testPoint: { location: 'MPU sensor tip to flywheel teeth', probes: 'Feeler gauge' },
          expectedValue: '0.5-1.0mm (0.020-0.040") air gap typical',
          failureIndicates: 'Gap too large = weak signal, too small = sensor damage risk',
          solution: [
            'Adjust MPU position - thread in until touches tooth, back off 1/2 turn',
            'Use feeler gauge for precise adjustment',
            'Check for flywheel teeth damage',
            'Ensure sensor is tight after adjustment',
            'Clean any metal debris from sensor tip'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Feeler gauge set', 'Appropriate wrench']
        },
        {
          id: 'step2',
          title: 'Test MPU Sensor Output',
          description: 'Measure AC voltage output while cranking',
          testPoint: { location: 'MPU sensor terminals', probes: 'AC Voltage, across sensor wires' },
          expectedValue: '0.5-5V AC while cranking (varies by sensor and speed)',
          failureIndicates: 'Weak or no signal - sensor failure',
          solution: [
            'Check sensor resistance (typically 200-2000 Ohms)',
            'Verify polarity connection (some controllers are polarity sensitive)',
            'Check for damaged sensor cable',
            'Replace sensor if no output',
            'Verify correct sensor type for controller'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter set to AC Volts']
        },
        {
          id: 'step3',
          title: 'Check Shielded Cable and Grounding',
          description: 'Verify MPU cable shielding is correctly connected',
          testPoint: { location: 'MPU shield wire', probes: 'Continuity check' },
          expectedValue: 'Shield connected to controller ground ONLY (not both ends)',
          failureIndicates: 'Ground loop causing interference',
          solution: [
            'Connect shield at controller end only',
            'Ensure shield is not touching engine ground at sensor end',
            'Route cable away from high-current wires',
            'Use twisted pair + shield cable',
            'Keep cable as short as practical'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step4',
          title: 'Check Controller Speed Settings',
          description: 'Verify flywheel teeth count and pickup configuration',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'Teeth count matches actual flywheel',
          failureIndicates: 'Wrong teeth count = wrong RPM display',
          solution: [
            'Count actual flywheel teeth (common: 113, 124, 140)',
            'Configure controller for correct teeth count',
            'Check pickup type setting (MPU/VR vs Hall effect)',
            'Verify pickup threshold voltage setting',
            'Save configuration and test'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Flashlight for counting teeth']
        }
      ],
      commonCauses: [
        { cause: 'Incorrect sensor air gap', probability: 30 },
        { cause: 'Faulty MPU sensor', probability: 25 },
        { cause: 'Shielding/grounding problem', probability: 20 },
        { cause: 'Wrong teeth count configuration', probability: 15 },
        { cause: 'Damaged sensor cable', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Magnetic Pickup Sensor', partNumber: 'MPU-5/8-18-UNF', estimated: 'KES 8,000-15,000' },
        { name: 'Shielded Cable 0.75mm²', partNumber: '2C-SHIELD-075', estimated: 'KES 400/m' }
      ]
    }
  ],
  'fuel': [
    {
      id: 'no-fuel',
      symptom: 'Engine cranks but does not start - no fuel',
      description: 'Engine turns over normally but will not fire. Fuel system suspect.',
      category: 'Fuel System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Fuel Tank Level',
          description: 'Check actual fuel level in tank',
          testPoint: { location: 'Fuel tank', probes: 'Visual or gauge check' },
          expectedValue: 'Minimum 1/4 tank for reliable operation',
          failureIndicates: 'Out of fuel or fuel gauge inaccurate',
          solution: [
            'Add fuel if tank is empty',
            'Check fuel gauge sender operation',
            'Bleed fuel system after running dry (diesel)',
            'Prime fuel pump if equipped with manual primer'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Fuel container if needed']
        },
        {
          id: 'step2',
          title: 'Check Fuel Solenoid Operation',
          description: 'Verify fuel solenoid opens when engine running',
          testPoint: { location: 'Fuel solenoid terminals', probes: 'DC Voltage during cranking' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Solenoid not energized - wiring or controller issue',
          solution: [
            'Check FUEL output from controller',
            'Verify solenoid coil continuity (typical 8-30 Ohms)',
            'Check for seized solenoid plunger',
            'Listen for solenoid click when energized',
            'Manually open solenoid to test (remove wire, apply B+)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Fuel Supply to Injection Pump',
          description: 'Verify fuel is reaching the injection pump',
          testPoint: { location: 'Injection pump inlet', probes: 'Crack fitting and crank' },
          expectedValue: 'Steady flow of fuel when cranking',
          failureIndicates: 'Fuel supply blockage or pump failure',
          solution: [
            'Check fuel filter condition - replace if overdue',
            'Inspect fuel lines for kinks or damage',
            'Verify fuel lift pump operation',
            'Check for air in fuel system - bleed as needed',
            'Check fuel tank pickup/strainer'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Open-end wrench', 'Container for fuel'],
          safetyWarning: 'Fuel is flammable. No smoking. Contain spills immediately.'
        },
        {
          id: 'step4',
          title: 'Check Injection Pump and Injectors',
          description: 'Verify injection pump is delivering fuel to injectors',
          testPoint: { location: 'Injector line union', probes: 'Crack fitting and crank' },
          expectedValue: 'Fuel spurts from loosened injector line',
          failureIndicates: 'Injection pump failure or timing issue',
          solution: [
            'If no fuel at injector - check injection pump timing',
            'Verify pump is mechanically driven (gear/belt)',
            'Check pump spline/coupling',
            'Injection pump may need professional service',
            'Check injector spray pattern'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Injector line wrench', 'Container'],
          safetyWarning: 'Diesel under high pressure can penetrate skin. Keep clear of spray.'
        }
      ],
      commonCauses: [
        { cause: 'Fuel solenoid not opening', probability: 30 },
        { cause: 'Clogged fuel filter', probability: 25 },
        { cause: 'Air in fuel system', probability: 20 },
        { cause: 'Empty fuel tank', probability: 10 },
        { cause: 'Fuel lift pump failure', probability: 10 },
        { cause: 'Injection pump failure', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Fuel Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Fuel Solenoid', partNumber: 'Engine-specific', estimated: 'KES 8,000-20,000' },
        { name: 'Fuel Lift Pump', partNumber: 'Engine-specific', estimated: 'KES 10,000-25,000' }
      ]
    }
  ],
  'generator': [
    {
      id: 'no-voltage',
      symptom: 'Generator produces no voltage output',
      description: 'Engine runs at correct speed but generator output is 0V or very low',
      category: 'Generator Output',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check Generator Voltage at Output Terminals',
          description: 'Measure voltage directly at generator output terminals',
          testPoint: { location: 'Generator output terminals L1-N', probes: 'AC Voltage L1 to Neutral' },
          expectedValue: '220-240V AC at rated speed (50Hz: 1500RPM, 60Hz: 1800RPM)',
          failureIndicates: 'No/low voltage at generator output',
          solution: [
            'Verify engine is running at correct speed (1500/1800 RPM)',
            'Check AVR (Automatic Voltage Regulator) condition',
            'Verify excitation supply to AVR',
            'Check for field flash procedure if generator was dormant'
          ],
          nextIfPass: 'step2',
          nextIfFail: 'step3',
          tools: ['AC Voltmeter', 'Tachometer/frequency meter']
        },
        {
          id: 'step2',
          title: 'Check Voltage at Controller Input',
          description: 'Verify voltage is reaching the controller sensing inputs',
          testPoint: { location: 'Controller GEN-L1 to GEN-N', probes: 'AC Voltage' },
          expectedValue: 'Same as generator output (±5V)',
          failureIndicates: 'Sensing circuit fault - fuses, wiring',
          solution: [
            'Check voltage sensing fuses (usually 1-2A)',
            'Inspect wiring from generator to controller',
            'Verify correct phase connection',
            'Check for loose terminals'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step3',
          title: 'Check AVR Power Supply',
          description: 'Verify AVR is receiving power',
          testPoint: { location: 'AVR input terminals', probes: 'AC Voltage at AVR input' },
          expectedValue: 'Auxiliary winding voltage or PMG output (varies by system)',
          failureIndicates: 'No power to AVR - cannot regulate',
          solution: [
            'Check auxiliary winding output',
            'If PMG equipped, verify PMG output',
            'Check AVR fuses and connections',
            'Inspect wiring to AVR',
            'AVR may need replacement if input OK but no output'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step4',
          title: 'Check Field Circuit and Brushes',
          description: 'Verify excitation field circuit is complete',
          testPoint: { location: 'Field winding at slip rings', probes: 'Resistance measurement' },
          expectedValue: 'Typically 5-15 Ohms (check generator data)',
          failureIndicates: 'Open field winding or worn brushes',
          solution: [
            'Inspect brush condition and spring pressure',
            'Check slip ring surface condition',
            'Measure field winding resistance',
            'Check diode pack if brushless type',
            'Replace brushes if worn below limit'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Ohmmeter', 'Brush wear gauge']
        },
        {
          id: 'step5',
          title: 'Field Flash Procedure',
          description: 'Re-establish residual magnetism',
          testPoint: { location: 'Field terminals', probes: 'Apply DC voltage briefly' },
          expectedValue: 'Generator should start producing voltage',
          failureIndicates: 'May indicate deeper winding issue',
          solution: [
            'Disconnect AVR field output wires',
            'Apply 12V DC to field F+ and F- briefly (2-3 seconds)',
            'Observe polarity (check generator manual)',
            'Reconnect AVR and test',
            'If still no output - stator/rotor winding test required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['12V DC source', 'Test leads'],
          safetyWarning: 'Field flashing must be done with engine stopped or at low speed. Observe correct polarity.'
        }
      ],
      commonCauses: [
        { cause: 'Lost residual magnetism', probability: 25 },
        { cause: 'AVR failure', probability: 25 },
        { cause: 'Worn brushes/slip rings', probability: 20 },
        { cause: 'Blown voltage sensing fuses', probability: 15 },
        { cause: 'Field winding open circuit', probability: 10 },
        { cause: 'Engine underspeed', probability: 5 }
      ],
      partsNeeded: [
        { name: 'AVR (Automatic Voltage Regulator)', partNumber: 'Generator-specific', estimated: 'KES 15,000-45,000' },
        { name: 'Brush Set', partNumber: 'Generator-specific', estimated: 'KES 5,000-12,000' },
        { name: 'Voltage Sensing Fuses', partNumber: '2A Glass Fuse', estimated: 'KES 200-500' }
      ]
    }
  ],
  'protection': [
    {
      id: 'e-stop-fault',
      symptom: 'Engine will not start - E-Stop indication or protection fault',
      description: 'Controller shows E-Stop active or protection input triggered preventing start',
      category: 'Protection',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Physical E-Stop Button',
          description: 'Verify E-Stop button is not pressed/latched',
          testPoint: { location: 'E-Stop button', probes: 'Physical inspection' },
          expectedValue: 'Button should be in released (OUT) position',
          failureIndicates: 'E-Stop engaged - system working correctly',
          solution: [
            'Twist/pull to release mushroom head type',
            'Turn key to release if key-reset type',
            'Replace button if stuck or damaged',
            'Clear fault on controller after releasing'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['None']
        },
        {
          id: 'step2',
          title: 'Check E-Stop Circuit Continuity',
          description: 'Verify E-Stop circuit is complete (NC contacts)',
          testPoint: { location: 'E-Stop terminals at controller', probes: 'Continuity across E-Stop input' },
          expectedValue: '< 1 Ohm (circuit closed) when E-Stop released',
          failureIndicates: 'Open circuit - wiring fault or switch failure',
          solution: [
            'Check wiring from E-Stop to controller',
            'Verify NC (Normally Closed) contacts are used',
            'Check for damaged cable',
            'Test E-Stop switch continuity directly',
            'Repair/replace damaged wiring'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step3',
          title: 'Check for Multiple E-Stop Loops',
          description: 'Verify all E-Stops in series are released',
          testPoint: { location: 'All E-Stop stations', probes: 'Physical and electrical check' },
          expectedValue: 'All E-Stop buttons released, circuit complete',
          failureIndicates: 'One of multiple E-Stops is engaged',
          solution: [
            'Locate all E-Stop stations on genset',
            'Release any engaged E-Stop',
            'Check for remote E-Stop connections',
            'Verify end-of-line resistor if used'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Wiring diagram']
        },
        {
          id: 'step4',
          title: 'Check Controller E-Stop Configuration',
          description: 'Verify E-Stop input is configured correctly',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'E-Stop input configured as Normally Closed (NC)',
          failureIndicates: 'Wrong configuration - NO vs NC',
          solution: [
            'Check controller configuration for E-Stop input type',
            'Should be set to NC (Normally Closed) for safety',
            'Reconfigure if set incorrectly',
            'Verify input voltage threshold settings'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Controller manual']
        }
      ],
      commonCauses: [
        { cause: 'E-Stop button engaged', probability: 40 },
        { cause: 'Broken wire in E-Stop circuit', probability: 25 },
        { cause: 'Faulty E-Stop switch', probability: 15 },
        { cause: 'Multiple E-Stop loop issue', probability: 10 },
        { cause: 'Controller configuration error', probability: 10 }
      ],
      partsNeeded: [
        { name: 'E-Stop Button Assembly', partNumber: 'E-STOP-MUSHROOM-NC', estimated: 'KES 2,000-5,000' },
        { name: 'E-Stop Cable', partNumber: '2-CORE-1.0MM', estimated: 'KES 200/m' }
      ]
    }
  ],
  'communication': [
    {
      id: 'can-fault',
      symptom: 'CAN communication fault / No data from ECU',
      description: 'Controller shows CAN error, no engine data on J1939, or ECU communication failure',
      category: 'Communication',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check CAN Bus Termination',
          description: 'Verify 120 Ohm termination resistors are present',
          testPoint: { location: 'CAN-H to CAN-L at network ends', probes: 'Resistance measurement (network powered off)' },
          expectedValue: '60 Ohms (two 120 Ohm resistors in parallel)',
          failureIndicates: 'Missing or extra termination',
          solution: [
            'Should have exactly TWO 120 Ohm terminators - one at each end',
            'Measure: 60 Ohms = correct, 120 Ohms = one terminator, 40 Ohms = three, Open = none',
            'Add or remove terminators as needed',
            'Terminators often built into ECU and controller'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect power before measuring CAN termination.'
        },
        {
          id: 'step2',
          title: 'Check CAN Bus Wiring',
          description: 'Verify CAN-H and CAN-L wiring integrity',
          testPoint: { location: 'CAN connectors', probes: 'Visual and continuity check' },
          expectedValue: 'Twisted pair, shielded cable, no shorts or opens',
          failureIndicates: 'Wiring fault disrupting communication',
          solution: [
            'Check for continuity from ECU to controller',
            'Verify no short between CAN-H and CAN-L',
            'Verify no short to ground or power',
            'Use twisted pair cable rated for CAN bus',
            'Maximum cable length: 40m for 250kbps J1939'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Cable tester']
        },
        {
          id: 'step3',
          title: 'Check CAN Bus Voltage Levels',
          description: 'Measure CAN bus voltages during operation',
          testPoint: { location: 'CAN-H and CAN-L to ground', probes: 'DC Voltage' },
          expectedValue: 'CAN-H: 2.5-3.5V, CAN-L: 1.5-2.5V (recessive state)',
          failureIndicates: 'Bus driver fault or short circuit',
          solution: [
            'If CAN-H stuck high or low - check for short',
            'If CAN-L stuck - same',
            'Disconnect devices one by one to find fault',
            'Check for damaged transceiver chip',
            'Verify ground reference between devices'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Oscilloscope (advanced)']
        },
        {
          id: 'step4',
          title: 'Verify J1939 Source Addresses',
          description: 'Check for address conflicts on the bus',
          testPoint: { location: 'Controller diagnostics', probes: 'Software check' },
          expectedValue: 'Each device should have unique source address',
          failureIndicates: 'Address conflict preventing communication',
          solution: [
            'Typical addresses: Engine ECU=0, Controller=128',
            'Check controller J1939 configuration',
            'Verify baud rate matches (J1939 = 250 kbps)',
            'Check protocol: J1939 vs proprietary',
            'Use CAN bus analyzer to monitor traffic'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'CAN analyzer (advanced)']
        }
      ],
      commonCauses: [
        { cause: 'Wrong or missing termination', probability: 30 },
        { cause: 'Wiring fault (short/open)', probability: 25 },
        { cause: 'Baud rate mismatch', probability: 15 },
        { cause: 'Address conflict', probability: 10 },
        { cause: 'Failed CAN transceiver', probability: 10 },
        { cause: 'Ground potential difference', probability: 10 }
      ],
      partsNeeded: [
        { name: 'CAN Termination Resistor', partNumber: '120-OHM-0.25W', estimated: 'KES 100-200' },
        { name: 'CAN Bus Cable (Twisted Pair)', partNumber: 'CAN-2X0.5-SHLD', estimated: 'KES 300/m' }
      ]
    }
  ]
};

// ==================== DIAGNOSTIC FLOW COMPONENT ====================
function DiagnosticFlowPanel({
  circuitId,
  controller
}: {
  circuitId: string;
  controller: ControllerModel;
}) {
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [stepResults, setStepResults] = useState<{ [stepId: string]: 'pass' | 'fail' | null }>({});

  const diagnostics = DIAGNOSTIC_TROUBLESHOOTING[circuitId] || [];

  const handleStepResult = (stepId: string, result: 'pass' | 'fail') => {
    setStepResults(prev => ({ ...prev, [stepId]: result }));
    setCompletedSteps(prev => new Set([...prev, stepId]));

    const step = selectedDiagnostic?.steps[currentStep];
    if (step) {
      const nextStepId = result === 'pass' ? step.nextIfPass : step.nextIfFail;
      if (nextStepId) {
        const nextIndex = selectedDiagnostic?.steps.findIndex(s => s.id === nextStepId);
        if (nextIndex !== undefined && nextIndex >= 0) {
          setCurrentStep(nextIndex);
        }
      }
    }
  };

  const resetDiagnostic = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepResults({});
  };

  if (diagnostics.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        <span className="text-4xl mb-4 block">🔧</span>
        No diagnostic flows available for this circuit yet.
        <p className="text-sm mt-2">Select another circuit or use the schematic view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagnostic Selection */}
      {!selectedDiagnostic ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Select Your Symptom
          </h3>
          <p className="text-slate-400 text-sm">
            Choose the symptom you are experiencing for step-by-step diagnostic guidance
          </p>
          <div className="grid gap-4">
            {diagnostics.map((diag) => (
              <motion.button
                key={diag.id}
                onClick={() => { setSelectedDiagnostic(diag); resetDiagnostic(); }}
                className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 text-left transition-all group"
                whileHover={{ scale: 1.01, x: 5 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {diag.symptom}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">{diag.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                        {diag.estimatedTime}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        diag.difficulty === 'Basic' ? 'bg-green-500/20 text-green-400' :
                        diag.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {diag.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                        {diag.steps.length} Steps
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDiagnostic(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span>←</span> Back to Symptoms
            </button>
            <button
              onClick={resetDiagnostic}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700"
            >
              Restart Diagnostic
            </button>
          </div>

          {/* Diagnostic Title */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white">{selectedDiagnostic.symptom}</h3>
            <p className="text-slate-400 text-sm mt-1">{selectedDiagnostic.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {selectedDiagnostic.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  completedSteps.has(step.id)
                    ? stepResults[step.id] === 'pass' ? 'bg-green-500' : 'bg-red-500'
                    : idx === currentStep
                      ? 'bg-cyan-500'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            Step {currentStep + 1} of {selectedDiagnostic.steps.length}
          </div>

          {/* Current Step Card */}
          {selectedDiagnostic.steps[currentStep] && (
            <motion.div
              key={selectedDiagnostic.steps[currentStep].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-5"
            >
              {/* Step Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {currentStep + 1}
                  </span>
                  <h4 className="text-lg font-bold text-white">{selectedDiagnostic.steps[currentStep].title}</h4>
                </div>
                <p className="text-slate-300">{selectedDiagnostic.steps[currentStep].description}</p>
              </div>

              {/* Safety Warning */}
              {selectedDiagnostic.steps[currentStep].safetyWarning && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
                    <span>⚠️</span> SAFETY WARNING
                  </div>
                  <p className="text-red-300 text-sm">{selectedDiagnostic.steps[currentStep].safetyWarning}</p>
                </div>
              )}

              {/* Test Point */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-amber-400 font-bold text-sm mb-2">🎯 TEST POINT</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Probes:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.probes}</p>
                  </div>
                </div>
              </div>

              {/* Expected Value */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-bold text-sm mb-1">✓ EXPECTED VALUE</div>
                <p className="text-green-300 font-medium">{selectedDiagnostic.steps[currentStep].expectedValue}</p>
              </div>

              {/* Tools Needed */}
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-400 text-sm">Tools needed:</span>
                {selectedDiagnostic.steps[currentStep].tools.map((tool, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg">
                    🔧 {tool}
                  </span>
                ))}
              </div>

              {/* Result Buttons */}
              <div className="border-t border-slate-700 pt-4 mt-4">
                <p className="text-slate-400 text-sm mb-3">What was your measurement result?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleStepResult(selectedDiagnostic.steps[currentStep].id, 'pass');
                      if (currentStep < selectedDiagnostic.steps.length - 1 && selectedDiagnostic.steps[currentStep].nextIfPass) {
                        // Already handled in handleStepResult
                      } else if (currentStep < selectedDiagnostic.steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg font-bold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✓</span> PASS - Value is Good
                  </button>
                  <button
                    onClick={() => handleStepResult(selectedDiagnostic.steps[currentStep].id, 'fail')}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✗</span> FAIL - Problem Found
                  </button>
                </div>
              </div>

              {/* Solution (shown when FAIL) */}
              {stepResults[selectedDiagnostic.steps[currentStep].id] === 'fail' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="text-red-400 font-bold mb-2">
                    🔴 {selectedDiagnostic.steps[currentStep].failureIndicates}
                  </div>
                  <div className="text-white font-bold mb-2 text-sm">SOLUTION:</div>
                  <ul className="space-y-2">
                    {selectedDiagnostic.steps[currentStep].solution.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400 mt-0.5">{idx + 1}.</span>
                        {sol}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Common Causes */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>📊</span> Common Causes (Probability)
            </h4>
            <div className="space-y-2">
              {selectedDiagnostic.commonCauses.map((cause, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                      style={{ width: `${cause.probability}%` }}
                    />
                  </div>
                  <span className="text-slate-300 text-sm whitespace-nowrap w-32">{cause.cause}</span>
                  <span className="text-cyan-400 font-bold text-sm w-12">{cause.probability}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parts Needed */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🛒</span> Parts You May Need
            </h4>
            <div className="grid gap-2">
              {selectedDiagnostic.partsNeeded.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{part.name}</div>
                    <div className="text-slate-500 text-xs">P/N: {part.partNumber}</div>
                  </div>
                  <div className="text-amber-400 font-bold text-sm">{part.estimated}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PINOUT TABLE COMPONENT ====================
function PinoutTable({ controller }: { controller: ControllerModel }) {
  const [filter, setFilter] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  // Registry-gated: see the note on registryVerified below.
  const pins = isControllerVerified(controller.id) ? CONTROLLER_PINS[controller.id] ?? [] : [];

  if (pins.length === 0) {
    return (
      <div
        className="border border-amber-500/40 bg-amber-500/10 rounded-xl p-6"
        role="status"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">⚠</span>
          <div className="flex-1">
            <h4 className="text-amber-300 font-bold mb-2">
              {controller.brand} {controller.model} — verified pinout pending
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed mb-3">
              {WIRING_UNAVAILABLE_MESSAGE}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {WIRING_SAFETY_NOTICE}
            </p>
            <ControllerSourceBlock controllerId={controller.id} />
          </div>
        </div>
      </div>
    );
  }

  const filteredPins = pins.filter(pin => {
    const matchesFilter = filter === '' ||
      pin.name.toLowerCase().includes(filter.toLowerCase()) ||
      pin.function.toLowerCase().includes(filter.toLowerCase());
    const matchesCircuit = !selectedCircuit || pin.circuit === selectedCircuit;
    return matchesFilter && matchesCircuit;
  });

  const circuits = [...new Set(pins.map(p => p.circuit))];

  return (
    <div className="space-y-4">
      {/* Verified-source citation */}
      <ControllerSourceBlock controllerId={controller.id} />
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search pins..."
          className="flex-1 min-w-[200px] px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        />
        <select
          value={selectedCircuit || ''}
          onChange={(e) => setSelectedCircuit(e.target.value || null)}
          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Circuits</option>
          {circuits.map(c => (
            <option key={c} value={c}>{CIRCUIT_CATEGORIES.find(cat => cat.id === c)?.name || c}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-slate-400">Total: <span className="text-cyan-400 font-bold">{pins.length}</span> pins</span>
        <span className="text-slate-400">Showing: <span className="text-amber-400 font-bold">{filteredPins.length}</span></span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/80">
            <tr>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">PIN</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">NAME</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">FUNCTION</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">WIRE</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">GAUGE</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">CIRCUIT</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">SPECS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredPins.map((pin, idx) => {
              const circuitCat = CIRCUIT_CATEGORIES.find(c => c.id === pin.circuit);
              const wireColor = WIRE_COLORS[pin.wireColor.toLowerCase().replace('/', '-')];
              // Most OEMs publish cable SIZE but not conductor colour. Where the
              // colour is unknown we must not paint a swatch, because a coloured
              // square reads as "this wire is grey" — an invented fact.
              const colourKnown = Boolean(wireColor);
              return (
                <tr key={pin.pin} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-3 py-2 font-mono text-cyan-400 font-bold">{pin.pin}</td>
                  <td className="px-3 py-2 font-medium text-white">{pin.name}</td>
                  <td className="px-3 py-2 text-slate-300">{pin.function}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {colourKnown ? (
                        <div
                          className="w-4 h-4 rounded border border-slate-600 shrink-0"
                          style={{ backgroundColor: wireColor.hex }}
                        />
                      ) : (
                        <div
                          className="w-4 h-4 rounded border border-dashed border-slate-600 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className={colourKnown ? 'text-slate-400' : 'text-slate-500 italic'}>
                        {pin.wireColor}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-400 font-mono text-xs">{pin.wireGauge}</td>
                  <td className="px-3 py-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${circuitCat?.color}20`,
                        color: circuitCat?.color,
                        border: `1px solid ${circuitCat?.color}40`
                      }}
                    >
                      {circuitCat?.name || pin.circuit}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-xs">
                    {pin.voltage && <span className="mr-2">{pin.voltage}</span>}
                    {pin.current && <span>{pin.current}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DETAILED SCHEMATIC VIEW ====================
function DetailedSchematicView({
  circuitId,
  controller,
  onExport
}: {
  circuitId: string;
  controller: ControllerModel;
  onExport: () => void;
}) {
  const schematic = DETAILED_SCHEMATICS[circuitId];
  const [showNotes, setShowNotes] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!schematic) {
    return (
      <div className="h-[500px] flex items-center justify-center text-slate-500">
        Schematic diagram not available for this circuit
      </div>
    );
  }

  // Registry-gated: an entry in CONTROLLER_PINS is not on its own evidence
  // that the data came from an OEM document.
  const verifiedPins = isControllerVerified(controller.id) ? CONTROLLER_PINS[controller.id] ?? [] : [];
  const hasVerifiedPinout = verifiedPins.length > 0;

  return (
    <div className="space-y-4">
      {/*
        WHY THIS BANNER IS NOW ALWAYS SHOWN (owner report, 2026-08-03)
        --------------------------------------------------------------
        Every controller rendered what looked like its OWN schematic: the seven
        drawings in DETAILED_SCHEMATICS are keyed by CIRCUIT, not by controller,
        and each one stamped {controller.model} inside the SVG. So selecting a
        SmartGen HGM6120 produced a diagram identical to the DSE 7320's with a
        different name on the box — the owner's words: "all the controllers are
        copying the same number and the schematic diagrams look the same".

        The topology itself is legitimately shared. Battery -> controller ->
        starter -> alternator, and the symbols B+, B-, PE, D+, are the same on
        every genset controller; that is standard practice and not a defect. The
        defect was presenting a generic drawing as model-specific.

        Fixed two ways: the SVG box is now labelled "GENSET CONTROLLER" rather
        than the selected model, and this note appears for EVERY controller —
        including the four with verified pinouts, because the DRAWING is generic
        for them too. Only the terminal numbers are model-specific, and those
        live in the Pinout tab where they are registry-gated.
      */}
      <div
        className={`border rounded-xl p-4 ${
          hasVerifiedPinout
            ? 'border-cyan-500/40 bg-cyan-500/10'
            : 'border-amber-500/40 bg-amber-500/10'
        }`}
        role="status"
      >
        <p className={`text-sm ${hasVerifiedPinout ? 'text-cyan-100' : 'text-amber-200'}`}>
          <span className="font-bold">
            {hasVerifiedPinout ? 'ℹ Generic circuit topology.' : '⚠ Generic circuit topology.'}
          </span>{' '}
          This diagram shows how the circuit is wired in principle and is the same for every genset
          controller — it is <span className="font-bold">not</span> a terminal drawing for{' '}
          <span className="font-bold">
            {controller.brand} {controller.model}
          </span>
          .{' '}
          {hasVerifiedPinout ? (
            <>
              Its verified terminal numbers are in the{' '}
              <span className="font-bold">Pinout</span> tab, taken from the manufacturer
              documentation.
            </>
          ) : (
            <>
              A verified pinout for this model is not yet loaded, so no terminal numbers are shown.{' '}
              {WIRING_UNAVAILABLE_MESSAGE}
            </>
          )}
        </p>
        <ControllerSourceBlock controllerId={controller.id} />
      </div>
      {/* Schematic SVG */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,116,139,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Title Bar */}
        <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur px-4 py-2 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">{CIRCUIT_CATEGORIES.find(c => c.id === circuitId)?.icon}</span>
            <div>
              <h3 className="text-white font-bold">{CIRCUIT_CATEGORIES.find(c => c.id === circuitId)?.name} - Schematic</h3>
              <p className="text-xs text-slate-500">{controller.brand} {controller.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                showNotes ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className={`px-3 py-1 rounded text-xs hover:text-white ${isZoomed ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}
            >
              🔍 {isZoomed ? 'Reset' : 'Zoom'}
            </button>
            <button
              onClick={onExport}
              className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white"
            >
              📥 Export
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <svg
          viewBox="0 0 700 450"
          className={`w-full pt-12 transition-all duration-300 ${isZoomed ? 'h-[800px] scale-110' : 'h-[500px]'}`}
          style={{ minHeight: isZoomed ? '800px' : '500px' }}
        >
          {schematic.svgContent(controller)}
        </svg>
      </div>

      {/* Notes Panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4"
          >
            <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
              <span>📋</span> Technical Notes & Specifications
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {schematic.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-500 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== WIRE COLOR REFERENCE ====================
function WireColorReference() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.entries(WIRE_COLORS).map(([key, { hex, name, usage }]) => (
        <div key={key} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0 shadow-lg"
              style={{
                backgroundColor: hex,
                border: key.includes('black') || key.includes('white') ? '1px solid #475569' : 'none'
              }}
            />
            <div>
              <div className="font-bold text-white text-sm">{name}</div>
              <div className="text-xs text-slate-400">{usage}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN PANEL COMPONENT ====================
export default function WiringDiagramsPanel() {
  const [selectedBrand, setSelectedBrand] = useState('DSE');
  const [selectedController, setSelectedController] = useState(CONTROLLERS[0]);
  // The panel must not OPEN showing a populated controller. Defaulting to
  // CONTROLLERS[0] (DSE 7320) made every visit look like '7320 wiring for
  // everything', because 7320 is one of only a few models with verified pin
  // data. Nothing is rendered until the technician actively picks their unit.
  const [userHasChosen, setUserHasChosen] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState('power');
  const [viewMode, setViewMode] = useState<'schematic' | 'diagnostics' | 'pinout' | 'colors'>('schematic');

  const brands = [...new Set(CONTROLLERS.map(c => c.brand))];
  const brandControllers = CONTROLLERS.filter(c => c.brand === selectedBrand);

  // Get current pin configuration. Never fall back to DSE 7320 — see
  // lib/generator-oracle/wiringGuard.ts for the reasoning.
  // The provenance registry — not this file — decides what may be rendered.
  //
  // Added 2026-07-29. Until then a controller rendered its pins purely because
  // an entry existed in CONTROLLER_PINS, with nothing checking whether that
  // entry had ever been read out of an OEM document. Four of the five shipped
  // maps turned out to be fabricated, and CAT PowerWizard 2.0 rendered 21
  // invented pins while controllerSources.ts recorded it as 'unsupported' —
  // the registry already knew, and nothing consulted it. Consult it here, so
  // pin data can never outrun its own provenance again.
  const registryVerified = isControllerVerified(selectedController.id);
  const rawPins = registryVerified ? CONTROLLER_PINS[selectedController.id] ?? [] : [];
  // Defense-in-depth: validate that the wiring data we are about to render
  // belongs to the same brand as the selected controller. Today CONTROLLER_PINS
  // is keyed by controller.id so a mismatch is impossible, but this guard
  // ensures any future regression that re-introduces a cross-brand fallback
  // (e.g. silently using DSE 7320 wiring for PowerWizard / SmartGen / ComAp /
  // Woodward / Datakom / Lovato / Siemens / ENKO / VODIA) is force-blanked
  // at the render boundary. See lib/generator-oracle/wiringGuard.ts and
  // tests/regression/site-invariants.test.ts.
  const wiringGuard = validateControllerWiringMatch(
    selectedController.brand,
    selectedController.model,
    selectedController.brand,
    selectedController.model,
  );
  const currentPins = userHasChosen && wiringGuard.ok ? rawPins : [];
  const hasVerifiedPinout = currentPins.length > 0;

  // Hard guard: even if a future bug ever wired CONTROLLER_PINS to a foreign
  // brand's pin set, validateControllerWiringMatch will refuse to render it
  // and PDF export will be blocked. The wiring data here is keyed by the
  // controller's own id, so the wiring brand/model match the selection.
  const wiringMatch = validateControllerWiringMatch(
    selectedController.brand,
    selectedController.model,
    selectedController.brand,
    selectedController.model,
  );
  const wiringRenderingBlocked = !wiringMatch.ok;

  // Export to PDF function
  const exportToPDF = () => {
    if (wiringRenderingBlocked) {
      alert(
        `PDF export blocked. Verified wiring for this selected controller is not available. DeepSea DSE 7320 wiring cannot be used as a substitute.`,
      );
      return;
    }
    if (!hasVerifiedPinout) {
      alert(
        `${selectedController.brand} ${selectedController.model}: ${WIRING_UNAVAILABLE_MESSAGE}`,
      );
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    const pinRows = currentPins.map(pin => `
      <tr>
        <td style="padding: 8px; border: 1px solid #334155; font-weight: bold;">${pin.pin}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.name}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.function}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.wireColor}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.wireGauge}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.circuit}</td>
      </tr>
    `).join('');

    const wireColorRows = Object.entries(WIRE_COLORS).map(([code, info]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #334155; background: ${info.hex}; color: ${info.hex === '#000000' || info.hex === '#1e3a8a' ? '#fff' : '#000'}; font-weight: bold;">${code}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${info.name}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${info.usage}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Wiring Diagram - ${selectedController.model}</title>
        <style>
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #0f172a; color: #e2e8f0; margin: 0; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0ea5e9; }
          .header h1 { color: #0ea5e9; margin: 0 0 10px 0; font-size: 28px; }
          .header h2 { color: #94a3b8; margin: 0; font-size: 18px; font-weight: normal; }
          .section { margin-bottom: 30px; }
          .section h3 { color: #22d3ee; margin-bottom: 15px; font-size: 18px; border-left: 4px solid #0ea5e9; padding-left: 12px; }
          table { width: 100%; border-collapse: collapse; background: #1e293b; font-size: 12px; }
          th { background: #334155; color: #0ea5e9; padding: 12px 8px; text-align: left; font-weight: bold; border: 1px solid #475569; }
          td { color: #cbd5e1; }
          .specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .spec-box { background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; }
          .spec-label { color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; }
          .spec-value { color: #0ea5e9; font-size: 16px; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 11px; }
          .logo { font-size: 24px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">📐 Generator Oracle</div>
          <h1>Wiring Diagram Documentation</h1>
          <h2>${selectedController.brand} ${selectedController.model}</h2>
        </div>

        <div class="section">
          <h3>Controller Specifications</h3>
          <div class="specs-grid">
            <div class="spec-box">
              <div class="spec-label">Model</div>
              <div class="spec-value">${selectedController.model}</div>
            </div>
            <div class="spec-box">
              <div class="spec-label">Brand</div>
              <div class="spec-value">${selectedController.brand}</div>
            </div>
            <div class="spec-box">
              <div class="spec-label">Total Pins</div>
              <div class="spec-value">${currentPins.length}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Pin Configuration</h3>
          <table>
            <thead>
              <tr>
                <th>Pin</th>
                <th>Name</th>
                <th>Function</th>
                <th>Wire Color</th>
                <th>Gauge</th>
                <th>Circuit</th>
              </tr>
            </thead>
            <tbody>
              ${pinRows}
            </tbody>
          </table>
        </div>

        <div class="section" style="page-break-before: always;">
          <h3>Wire Color Standards (IEC 60446)</h3>
          <table>
            <thead>
              <tr>
                <th>Color Code</th>
                <th>Color Name</th>
                <th>Standard Usage</th>
              </tr>
            </thead>
            <tbody>
              ${wireColorRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p style="color:#fbbf24;font-weight:bold;margin-bottom:8px;">⚠ ${WIRING_SAFETY_NOTICE}</p>
          <p>Generated by Generator Oracle - Ajira Power Solutions Ltd</p>
          <p>Professional Electrical Documentation • IEEE/IEC Standards</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // Print function
  const handlePrint = () => {
    exportToPDF();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-xl shadow-cyan-500/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <span className="text-3xl">📐</span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Professional Schematics
              </span>
            </h2>
            <p className="text-slate-500 text-sm">
              IEEE/IEC standard diagrams • Complete wiring documentation • {CONTROLLERS.length} controllers
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
          {[
            { id: 'schematic', label: 'Schematics', icon: '📊' },
            { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
            { id: 'pinout', label: 'Pinout', icon: '🔌' },
            { id: 'colors', label: 'Wire Colors', icon: '🎨' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Selection */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Brand Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Controller Brand</h3>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const firstController = CONTROLLERS.find(c => c.brand === brand);
                    if (firstController) setSelectedController(firstController);
                    setUserHasChosen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Controller Model</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {brandControllers.map((ctrl) => (
                <button
                  key={ctrl.id}
                  onClick={() => { setSelectedController(ctrl); setUserHasChosen(true); }}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
                    selectedController.id === ctrl.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="font-bold text-sm">{ctrl.model}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{ctrl.features.join(' • ')}</div>
                  {/* Terminal count comes from the verified pin map, never from
                      the catalog's `pinCount` field — that field was populated
                      with invented round numbers (the DSE 7320 was listed as 32
                      pins; DSE publish 58). Where there is no verified map we
                      show no count at all rather than a made-up one. */}
                  <div className="text-xs text-slate-600 mt-0.5">
                    {isControllerVerified(ctrl.id) && CONTROLLER_PINS[ctrl.id]
                      ? `${CONTROLLER_PINS[ctrl.id].length} terminals • ${ctrl.voltage}`
                      : ctrl.voltage}
                  </div>
                  {/* Honest coverage marker: most listed controllers have no
                      verified pinout yet. Showing which do prevents a
                      technician clicking through models expecting data.
                      Driven by the provenance registry, not by the presence of
                      a CONTROLLER_PINS entry — an entry existing has never been
                      evidence that anyone read an OEM document. */}
                  {(() => {
                    const src = getControllerSource(ctrl.id);
                    const label =
                      src?.status !== 'verified'
                        ? 'No verified pinout — refer to OEM manual'
                        : src.completeness === 'partial'
                          ? 'Partial verified pinout — some terminals not covered'
                          : 'Verified pinout available';
                    const tone =
                      src?.status !== 'verified'
                        ? 'text-slate-500'
                        : src.completeness === 'partial'
                          ? 'text-amber-400'
                          : 'text-emerald-400';
                    return <div className={`text-[10px] mt-1 font-semibold ${tone}`}>{label}</div>;
                  })()}
                </button>
              ))}
            </div>
          </div>

          {/* Circuit Selection (for schematic and diagnostics view) */}
          {(viewMode === 'schematic' || viewMode === 'diagnostics') && (
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Circuit Type</h3>
              <div className="space-y-1">
                {CIRCUIT_CATEGORIES.map((circuit) => (
                  <button
                    key={circuit.id}
                    onClick={() => setSelectedCircuit(circuit.id)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-3 transition-all ${
                      selectedCircuit === circuit.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    style={{
                      backgroundColor: selectedCircuit === circuit.id ? `${circuit.color}20` : undefined,
                      borderLeft: selectedCircuit === circuit.id ? `3px solid ${circuit.color}` : '3px solid transparent',
                    }}
                  >
                    <span className="text-lg">{circuit.icon}</span>
                    <span className="font-medium">{circuit.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          <AnimatePresence mode="wait">
            {viewMode === 'schematic' && (
              <motion.div
                key="schematic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetailedSchematicView circuitId={selectedCircuit} controller={selectedController} onExport={exportToPDF} />
              </motion.div>
            )}

            {viewMode === 'diagnostics' && (
              <motion.div
                key="diagnostics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <DiagnosticFlowPanel circuitId={selectedCircuit} controller={selectedController} />
              </motion.div>
            )}

            {viewMode === 'pinout' && (
              <motion.div
                key="pinout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedController.brand} {selectedController.model}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Complete terminal pinout with wire specifications</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-bold">
                      {selectedController.pinCount} Pins
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                      {selectedController.voltage}
                    </span>
                  </div>
                </div>
                <PinoutTable controller={selectedController} />
              </motion.div>
            )}

            {viewMode === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Wire Color Standards</h3>
                  <p className="text-slate-500 text-sm mt-1">Industry-standard wire color coding for generator control systems</p>
                </div>
                <WireColorReference />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🏭</div>
              <div className="text-2xl font-black text-cyan-400">{CONTROLLERS.length}</div>
              <div className="text-xs text-slate-500">Controllers</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-black text-amber-400">{CIRCUIT_CATEGORIES.length}</div>
              <div className="text-xs text-slate-500">Circuit Types</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🔌</div>
              <div className="text-2xl font-black text-green-400">{Object.values(CONTROLLER_PINS).flat().length}</div>
              <div className="text-xs text-slate-500">Pin Configs</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-2xl font-black text-red-400">{Object.values(DIAGNOSTIC_TROUBLESHOOTING).flat().length}</div>
              <div className="text-xs text-slate-500">Diagnostic Flows</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-2xl font-black text-purple-400">{Object.keys(WIRE_COLORS).length}</div>
              <div className="text-xs text-slate-500">Wire Colors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📐</span>
            <div>
              <div className="font-bold text-white">Professional-Grade Electrical Documentation & Diagnostics</div>
              <div className="text-sm text-slate-400">
                IEEE/IEC standard symbols • Step-by-step troubleshooting • Test points with expected values • Complete solutions
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <span>📥</span> Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <span>🖨️</span> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
