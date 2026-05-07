'use client';

/**
 * Complete Incinerator Construction, Fabrication, Installation & Commissioning Guide — Kenya
 *
 * Continuation section appended below the existing Incinerator page content.
 * Self-contained, lazy-loadable client component. Uses the same design language
 * (gradient cards, slate/gray-900 surfaces, orange/red/teal accents) as the parent page.
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   DATA — kept module-scoped so it isn't re-allocated per render.
   All KES figures are indicative ranges for Kenyan market (Nairobi base).
   ────────────────────────────────────────────────────────────────────────── */

type GuideSection = {
  id: string;
  label: string;
  group: string;
};

const GUIDE_SECTIONS: GuideSection[] = [
  { id: 'g-overview',     label: 'Guide Overview',                     group: 'Start' },
  { id: 'g-sizing',       label: 'Sizing & Capacity Selection',        group: 'Planning' },
  { id: 'g-site',         label: 'Site Selection & Setback',           group: 'Planning' },
  { id: 'g-permits',      label: 'Kenyan Permits & NEMA Compliance',   group: 'Planning' },
  { id: 'g-excavation',   label: 'Excavation & Earthworks',            group: 'Civil Works' },
  { id: 'g-foundation',   label: 'Foundation & Slab',                  group: 'Civil Works' },
  { id: 'g-shed',         label: 'Incinerator Shed / Housing',         group: 'Civil Works' },
  { id: 'g-fabrication',  label: 'Shell & Chamber Fabrication',        group: 'Mechanical' },
  { id: 'g-refractory',   label: 'Refractory Lining System',           group: 'Mechanical' },
  { id: 'g-combustion',   label: 'Combustion & Burner System',         group: 'Mechanical' },
  { id: 'g-fuel',         label: 'Fuel Storage & Delivery',            group: 'Mechanical' },
  { id: 'g-stack',        label: 'Stack, Scrubber & Emission Control', group: 'Mechanical' },
  { id: 'g-electrical',   label: 'Electrical & Instrumentation',       group: 'Controls' },
  { id: 'g-automation',   label: 'PLC, HMI & Automation',              group: 'Controls' },
  { id: 'g-commissioning',label: 'Commissioning Workflow',             group: 'Handover' },
  { id: 'g-training',     label: 'Operator Training & SOPs',           group: 'Handover' },
  { id: 'g-maintenance',  label: 'Maintenance Schedule',               group: 'Operate' },
  { id: 'g-safety',       label: 'Safety, PPE & Emergency Response',   group: 'Operate' },
  { id: 'g-cost',         label: 'Cost Breakdown (KES)',               group: 'Economics' },
  { id: 'g-checklists',   label: 'Engineering Checklists',             group: 'Reference' },
];

const SIZING_TABLE = [
  { capacity: '10–25 kg/hr',   bedsServed: 'Clinic / 20–50 beds',  primaryVol: '0.10 m³', secondaryVol: '0.18 m³', stackHeight: '6–8 m',  diesel: '8–12 L/hr',  footprint: '2.4 × 1.8 m' },
  { capacity: '50 kg/hr',      bedsServed: 'Sub-county hospital',  primaryVol: '0.25 m³', secondaryVol: '0.45 m³', stackHeight: '8–10 m', diesel: '14–18 L/hr', footprint: '3.2 × 2.0 m' },
  { capacity: '100 kg/hr',     bedsServed: 'County referral',      primaryVol: '0.50 m³', secondaryVol: '0.90 m³', stackHeight: '10–12 m',diesel: '22–28 L/hr', footprint: '4.0 × 2.4 m' },
  { capacity: '200 kg/hr',     bedsServed: 'Level-5 / Industrial', primaryVol: '1.00 m³', secondaryVol: '1.80 m³', stackHeight: '12–15 m',diesel: '38–46 L/hr', footprint: '5.5 × 3.0 m' },
  { capacity: '500 kg/hr',     bedsServed: 'Regional / Municipal', primaryVol: '2.50 m³', secondaryVol: '4.50 m³', stackHeight: '15–20 m',diesel: '85–110 L/hr',footprint: '7.5 × 4.0 m' },
];

const EXCAVATION_STEPS = [
  { step: 'Pegging & layout',          detail: 'Mark foundation footprint with offset 300 mm beyond shell base. Verify diagonals to ±5 mm.', tool: 'Total station / builder’s square' },
  { step: 'Topsoil strip',             detail: 'Strip 150–250 mm of vegetative soil. Stockpile separately for landscape reuse.',               tool: 'Skid-steer / hand labour' },
  { step: 'Bulk excavation',           detail: 'Excavate to design depth (typ. 600–900 mm). Maintain side slopes ≥1:1 in soft soils.',          tool: 'Excavator 5–8 t' },
  { step: 'Subgrade compaction',       detail: 'Compact subgrade in 150 mm layers to ≥95 % MDD (AASHTO T-180). Proof-roll before blinding.',    tool: 'Plate compactor / roller' },
  { step: 'Hardcore & blinding',       detail: '300 mm graded hardcore (40–60 mm), blind with 50 mm sand. Wet and recompact.',                  tool: 'Vibrating plate' },
  { step: 'DPM & reinforcement',       detail: 'Lay 1000-gauge DPM. Place T12 @ 200 mm c/c bottom mat, T10 top mat with 50 mm chairs.',          tool: 'Bar bender, chairs' },
  { step: 'Service ducts',             detail: 'Cast-in 110 mm conduits for fuel line, power, instrumentation, draft sensor cables.',            tool: 'PVC ducts, sleeves' },
];

const REFRACTORY_LAYERS = [
  { layer: 'Hot face',         material: 'High-alumina firebrick (≥ 60% Al₂O₃)', thickness: '115 mm', service: '1450 °C', notes: 'Lay in tongue-and-groove; mortar joints ≤ 3 mm.' },
  { layer: 'Castable lining',  material: 'Low-cement castable (45 % Al₂O₃)',      thickness: '75 mm',  service: '1400 °C', notes: 'Anchored on Y-studs welded to shell at 200 mm c/c.' },
  { layer: 'Insulation',       material: 'Insulating firebrick (IFB-26)',         thickness: '64 mm',  service: '1260 °C', notes: 'Reduces shell temperature, saves fuel ~12 %.' },
  { layer: 'Back-up blanket',  material: 'Ceramic fibre blanket 128 kg/m³',       thickness: '50 mm',  service: '1260 °C', notes: 'Absorbs thermal expansion of inner courses.' },
  { layer: 'Cold face',        material: 'Calcium silicate board',                thickness: '25 mm',  service: '1000 °C', notes: 'Protects steel shell; keep dry until commissioning.' },
];

const COMBUSTION_TARGETS = [
  { param: 'Primary chamber temp',  target: '800 – 1000 °C',  rationale: 'Volatilises waste, sustains pyrolysis without slagging refractory.' },
  { param: 'Secondary chamber temp',target: '1100 – 1200 °C', rationale: 'Destroys dioxins, furans, pathogens; required by NEMA & WHO.' },
  { param: 'Residence time',        target: '≥ 2 seconds',    rationale: 'Ensures complete oxidation of organic gases at temperature.' },
  { param: 'O₂ in flue',            target: '6 – 11 %',       rationale: 'Confirms excess air; below 6 % risks CO and soot, above 11 % wastes fuel.' },
  { param: 'CO in flue',            target: '< 100 mg/Nm³',   rationale: 'Indicator of combustion completeness; NEMA limit.' },
  { param: 'Particulate (PM)',      target: '< 50 mg/Nm³',    rationale: 'Stack emission limit per NEMA Air Quality Regulations 2014.' },
  { param: 'Furnace draft',         target: '−2 to −5 mmH₂O', rationale: 'Negative pressure prevents backdraft when loading door is opened.' },
];

const COMMISSIONING_PHASES = [
  { phase: 'Pre-commissioning checks', days: '1–2', items: ['Mechanical completion certificate', 'Electrical megger & loop test', 'Refractory dry-out schedule confirmed', 'Fuel system pressure test (1.5× working pressure, 10 min hold)', 'Stack and scrubber clear of debris'] },
  { phase: 'Refractory dry-out',       days: '3–5', items: ['Hold 100 °C for 24 h (drive off free water)', 'Ramp 25 °C/hr to 300 °C, hold 24 h', 'Ramp 25 °C/hr to 600 °C, hold 12 h', 'Ramp to operating temp, hold 8 h', 'Cool naturally; inspect for hairline cracks'] },
  { phase: 'Cold loop checks',         days: '1',   items: ['Verify all I/O on PLC matches drawings', 'Force interlocks: door, flame, low-fuel, over-temp', 'Confirm emergency stop kills burners and opens stack damper', 'Test UPS / standby power transfer'] },
  { phase: 'Hot commissioning',        days: '2–3', items: ['Light primary burner, observe flame stability', 'Bring secondary chamber to 1100 °C before charging', 'First charge: 25 % rated load, increase stepwise', 'Tune air-fuel ratio for clear stack (Ringelmann ≤ 1)', 'Record temperatures, pressures, opacity per hour'] },
  { phase: 'Performance test',         days: '1',   items: ['8-hour continuous run at rated capacity', 'NEMA-accredited stack test (PM, CO, HCl, dioxins)', 'Ash sterility / DRE verification', 'Noise survey at 1 m & boundary', 'Sign-off PTW and handover documents'] },
];

const MAINTENANCE_SCHEDULE = [
  { interval: 'Daily',    tasks: ['Remove ash & weigh', 'Inspect burner flame pattern', 'Log primary/secondary temperatures', 'Check fuel level & filter sight-glass', 'Wipe down HMI & control panel'] },
  { interval: 'Weekly',   tasks: ['Clean photocell / UV scanner', 'Test door interlocks', 'Drain fuel filter water trap', 'Inspect stack base for soot / corrosion', 'Verify draft fan amperage'] },
  { interval: 'Monthly',  tasks: ['Service burner nozzle & electrodes', 'Calibrate thermocouples (3-point)', 'Tighten refractory anchor nuts', 'Lubricate fan bearings', 'Backup PLC program & HMI screens'] },
  { interval: 'Quarterly',tasks: ['Borescope inspection of refractory hot face', 'Replace fuel pump filter cartridge', 'Test emergency stop & fire suppression', 'Megger motors & cables'] },
  { interval: 'Annually', tasks: ['Full refractory survey & patch repairs', 'Burner overhaul (rebuild kit)', 'NEMA stack emission test', 'Renew operating license & EIA addendum', 'Replace gaskets, seals, viewing-port glass'] },
];

const SAFETY_RULES = [
  { level: 'critical', rule: 'Never open the loading door while furnace draft is positive. Backdraft can cause fatal burns.' },
  { level: 'critical', rule: 'Never charge aerosols, sealed containers, lithium batteries, radioactive or explosive waste.' },
  { level: 'critical', rule: 'Lock-out / tag-out fuel and power before any internal inspection. Confirm chamber < 50 °C.' },
  { level: 'high',     rule: 'PPE on charging deck: heat-resistant apron, face shield, leather gauntlets, P3 respirator.' },
  { level: 'high',     rule: 'Keep a 9 kg DCP and CO₂ extinguisher within 5 m of the burner skid; service every 6 months.' },
  { level: 'medium',   rule: 'Ash is hot and may contain heavy metals — quench in dedicated bin, label, dispose via licensed handler.' },
  { level: 'medium',   rule: 'Restrict the incinerator yard with chain-link fencing and signage; only trained operators allowed.' },
];

const COST_BREAKDOWN = [
  { item: 'Site survey, EIA & NEMA licensing',          small: '120,000 – 250,000',   medium: '250,000 – 450,000',   large: '450,000 – 900,000' },
  { item: 'Excavation, hardcore, RC slab (M25)',        small: '180,000 – 320,000',   medium: '320,000 – 600,000',   large: '600,000 – 1,200,000' },
  { item: 'Incinerator shed (steel + roofing)',         small: '220,000 – 400,000',   medium: '400,000 – 750,000',   large: '750,000 – 1,400,000' },
  { item: 'Incinerator shell & secondary chamber',      small: '650,000 – 1,200,000', medium: '1,800,000 – 3,500,000', large: '5,000,000 – 9,000,000' },
  { item: 'Refractory system (5-layer)',                small: '180,000 – 320,000',   medium: '450,000 – 850,000',   large: '1,200,000 – 2,400,000' },
  { item: 'Burners, fuel skid & piping',                small: '220,000 – 380,000',   medium: '480,000 – 850,000',   large: '1,100,000 – 1,900,000' },
  { item: 'Stack, scrubber & emission control',         small: '140,000 – 260,000',   medium: '380,000 – 700,000',   large: '1,400,000 – 2,800,000' },
  { item: 'Electrical, PLC/HMI & instrumentation',      small: '180,000 – 320,000',   medium: '420,000 – 780,000',   large: '950,000 – 1,800,000' },
  { item: 'Commissioning, testing & training',          small: '90,000 – 180,000',    medium: '180,000 – 350,000',   large: '350,000 – 700,000' },
];

const CHECKLISTS = [
  {
    title: 'Pre-installation site checklist',
    items: [
      'Setback ≥ 50 m from wards, kitchens and residential blocks',
      'Prevailing wind blows away from occupied buildings',
      'Vehicle access for 7 t crane and 20 ft container',
      '3-phase 415 V supply within 30 m, 32 A spare capacity',
      'Water point (≥ 1 bar) within 15 m for scrubber make-up',
      'Designated waste storage room within 50 m of charging door',
    ],
  },
  {
    title: 'Mechanical fabrication QA',
    items: [
      'Shell plate: mild steel BS-EN 10025 S275JR, ≥ 6 mm',
      'All structural welds full-penetration, visually inspected; 10 % DPI',
      'Refractory anchors stainless 310, welded at 200 mm c/c staggered pattern',
      'Loading door gasket: ceramic rope 25 mm, replaceable',
      'Stack: 6 mm CS up to 10 m, 4 mm above; flanged in 3 m sections with sample port at 8× diameter',
    ],
  },
  {
    title: 'Electrical & controls QA',
    items: [
      'Earthing: separate stack earth ≤ 1 Ω; control panel ≤ 5 Ω',
      'Burner controller: certified flame-safeguard (Honeywell / Siemens LME)',
      'Thermocouples Type-K, duplex, with cold-junction compensation',
      'Door interlock disables burner if open > 3 s',
      'Over-temp trip at 1300 °C (secondary chamber)',
      'PLC battery / SD card backup; HMI password-protected',
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS — small inline vector graphics, no external assets.
   ────────────────────────────────────────────────────────────────────────── */

function FurnaceCutawaySVG() {
  return (
    <svg viewBox="0 0 480 260" role="img" aria-label="Dual-chamber incinerator cutaway diagram" className="w-full h-auto">
      <defs>
        <linearGradient id="ic-shell" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="ic-flame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* Ground */}
      <rect x="0" y="230" width="480" height="30" fill="#111827" />
      <line x1="0" y1="230" x2="480" y2="230" stroke="#f97316" strokeOpacity="0.4" />
      {/* Primary chamber */}
      <rect x="40" y="110" width="180" height="120" rx="8" fill="url(#ic-shell)" stroke="#f97316" />
      <rect x="56" y="126" width="148" height="88" rx="4" fill="#7c2d12" stroke="#fdba74" strokeDasharray="3 3" />
      <rect x="80" y="170" width="100" height="40" rx="3" fill="url(#ic-flame)" opacity="0.85" />
      <text x="130" y="106" textAnchor="middle" fill="#fdba74" fontSize="11" fontFamily="monospace">PRIMARY · 800–1000 °C</text>
      {/* Door */}
      <rect x="30" y="150" width="14" height="44" fill="#374151" stroke="#9ca3af" />
      <text x="22" y="178" textAnchor="end" fill="#9ca3af" fontSize="9">Charge door</text>
      {/* Throat */}
      <polygon points="220,150 260,140 260,200 220,190" fill="#7c2d12" stroke="#fdba74" />
      {/* Secondary */}
      <rect x="260" y="80" width="160" height="150" rx="8" fill="url(#ic-shell)" stroke="#ef4444" />
      <rect x="276" y="96" width="128" height="118" rx="4" fill="#7f1d1d" stroke="#fca5a5" strokeDasharray="3 3" />
      <rect x="296" y="170" width="88" height="40" rx="3" fill="url(#ic-flame)" />
      <text x="340" y="76" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="monospace">SECONDARY · 1100–1200 °C</text>
      {/* Stack */}
      <rect x="430" y="20" width="20" height="210" fill="#1f2937" stroke="#94a3b8" />
      <rect x="425" y="14" width="30" height="10" fill="#475569" />
      <text x="440" y="10" textAnchor="middle" fill="#94a3b8" fontSize="9">Stack</text>
      {/* Burners */}
      <circle cx="60" cy="200" r="6" fill="#f59e0b" />
      <circle cx="280" cy="200" r="6" fill="#f59e0b" />
      <text x="50" y="220" fill="#f59e0b" fontSize="9">Burner 1</text>
      <text x="270" y="220" fill="#f59e0b" fontSize="9">Burner 2</text>
      {/* Flow arrows */}
      <path d="M 230 170 L 255 170" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#ic-arrow)" fill="none" />
      <path d="M 410 100 L 432 100" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#ic-arrow)" fill="none" />
      <defs>
        <marker id="ic-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
        </marker>
      </defs>
    </svg>
  );
}

function FoundationSVG() {
  return (
    <svg viewBox="0 0 480 220" role="img" aria-label="Foundation cross-section" className="w-full h-auto">
      {/* Sky */}
      <rect x="0" y="0" width="480" height="60" fill="#0f172a" />
      {/* Slab */}
      <rect x="40" y="60" width="400" height="30" fill="#475569" stroke="#cbd5e1" />
      <text x="240" y="80" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">RC slab 200 mm · M25 · T12 @ 200 mm</text>
      {/* DPM */}
      <line x1="40" y1="92" x2="440" y2="92" stroke="#22d3ee" strokeDasharray="2 3" />
      <text x="446" y="96" fill="#22d3ee" fontSize="9">DPM</text>
      {/* Sand blinding */}
      <rect x="40" y="92" width="400" height="10" fill="#facc15" opacity="0.6" />
      <text x="240" y="100" textAnchor="middle" fill="#1f2937" fontSize="9">Sand blinding 50 mm</text>
      {/* Hardcore */}
      <rect x="40" y="102" width="400" height="40" fill="#78350f" />
      <text x="240" y="128" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily="monospace">Hardcore 300 mm · graded 40–60 mm</text>
      {/* Subgrade */}
      <rect x="40" y="142" width="400" height="60" fill="#1c1917" />
      <text x="240" y="178" textAnchor="middle" fill="#a8a29e" fontSize="11" fontFamily="monospace">Compacted subgrade · ≥ 95 % MDD</text>
      {/* Conduits */}
      <circle cx="120" cy="75" r="6" fill="#0f172a" stroke="#38bdf8" />
      <circle cx="240" cy="75" r="6" fill="#0f172a" stroke="#38bdf8" />
      <circle cx="360" cy="75" r="6" fill="#0f172a" stroke="#38bdf8" />
      <text x="240" y="55" textAnchor="middle" fill="#38bdf8" fontSize="9">Cast-in service conduits (110 mm)</text>
    </svg>
  );
}

function RefractoryStackSVG() {
  const layers = [
    { c: '#7f1d1d', t: 'Hot face firebrick' },
    { c: '#9a3412', t: 'Castable lining' },
    { c: '#b45309', t: 'Insulating firebrick' },
    { c: '#facc15', t: 'Ceramic fibre blanket' },
    { c: '#e2e8f0', t: 'Calcium silicate board' },
    { c: '#475569', t: 'Steel shell' },
  ];
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label="Refractory layer stack" className="w-full h-auto">
      {layers.map((l, i) => (
        <g key={l.t}>
          <rect x="40" y={20 + i * 28} width="180" height="24" fill={l.c} stroke="#0f172a" />
          <text x="230" y={36 + i * 28} fill="#e2e8f0" fontSize="11" fontFamily="monospace">{l.t}</text>
        </g>
      ))}
      <text x="40" y="208" fill="#94a3b8" fontSize="10">Hot face → Cold face (inside chamber to outside shell)</text>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PRIMITIVES
   ────────────────────────────────────────────────────────────────────────── */

function SectionHeader({ id, kicker, title, blurb }: { id: string; kicker: string; title: string; blurb?: string }) {
  return (
    <div id={id} className="scroll-mt-28 mb-6">
      <p className="text-xs uppercase tracking-widest text-orange-400/80 mb-2">{kicker}</p>
      <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
      {blurb && <p className="mt-3 text-gray-400 max-w-3xl">{blurb}</p>}
    </div>
  );
}

function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'danger' | 'success';
  title: string;
  children: React.ReactNode;
}) {
  const palette = {
    info:    { ring: 'border-blue-500/30',  bg: 'from-blue-900/20 to-cyan-900/10',   t: 'text-blue-300',   icon: 'i' },
    warn:    { ring: 'border-amber-500/30', bg: 'from-amber-900/20 to-orange-900/10', t: 'text-amber-300', icon: '!' },
    danger:  { ring: 'border-red-500/30',   bg: 'from-red-900/30 to-rose-900/10',     t: 'text-red-300',   icon: '⚠' },
    success: { ring: 'border-emerald-500/30', bg: 'from-emerald-900/20 to-teal-900/10', t: 'text-emerald-300', icon: '✓' },
  }[tone];
  return (
    <div className={`rounded-xl border ${palette.ring} bg-gradient-to-br ${palette.bg} p-5`}>
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-black/40 grid place-items-center font-bold ${palette.t}`}>{palette.icon}</span>
        <div className="min-w-0">
          <h4 className={`font-bold mb-1 ${palette.t}`}>{title}</h4>
          <div className="text-sm text-gray-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ items, color = 'orange' }: { items: { id: string; title: string; body: React.ReactNode }[]; color?: 'orange' | 'blue' | 'emerald' | 'amber' | 'red' }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const ring = {
    orange: 'border-orange-500/25',
    blue: 'border-blue-500/25',
    emerald: 'border-emerald-500/25',
    amber: 'border-amber-500/25',
    red: 'border-red-500/25',
  }[color];
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className={`rounded-xl border ${ring} bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : it.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition"
            >
              <span className="text-white font-medium">{it.title}</span>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="px-5 py-4 text-gray-300 text-sm leading-relaxed">{it.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────────────────── */

export default function ConstructionGuide() {
  const [costSize, setCostSize] = useState<'small' | 'medium' | 'large'>('medium');

  const grouped = useMemo(() => {
    const map = new Map<string, GuideSection[]>();
    for (const s of GUIDE_SECTIONS) {
      const arr = map.get(s.group) ?? [];
      arr.push(s);
      map.set(s.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  const jumpTo = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const totals = useMemo(() => {
    const parseRange = (r: string) => {
      const nums = r.replace(/,/g, '').match(/\d+/g)?.map(Number) ?? [];
      if (nums.length < 2) return [0, 0];
      return [nums[0], nums[1]];
    };
    let lo = 0, hi = 0;
    for (const row of COST_BREAKDOWN) {
      const [a, b] = parseRange(row[costSize]);
      lo += a; hi += b;
    }
    const fmt = (n: number) => n.toLocaleString('en-KE');
    return { lo: fmt(lo), hi: fmt(hi) };
  }, [costSize]);

  return (
    <section
      aria-labelledby="construction-guide-title"
      className="relative border-t border-white/10 bg-gradient-to-b from-black via-gray-950 to-black"
    >
      {/* Transition band */}
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-500/10 text-orange-300 border border-orange-500/30">
            Continuation · Technical Resource
          </span>
          <h2
            id="construction-guide-title"
            className="mt-4 text-3xl md:text-5xl font-bold text-white leading-tight"
          >
            Complete Incinerator Construction & Commissioning Guide
            <span className="block text-orange-400 text-xl md:text-2xl mt-2 font-semibold">
              Engineering Handbook for Kenya
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
            A consulting-grade reference for project owners, contractors and operators —
            covering excavation through commissioning, NEMA compliance and lifecycle maintenance.
            Use the table of contents to jump between sections.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Guide contents" className="rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur p-5">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Contents</p>
              <ul className="space-y-4 text-sm">
                {grouped.map(([group, items]) => (
                  <li key={group}>
                    <p className="text-orange-400/80 font-semibold mb-1">{group}</p>
                    <ul className="space-y-1">
                      {items.map((it) => (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => jumpTo(it.id)}
                            className="text-left w-full text-gray-300 hover:text-white hover:translate-x-0.5 transition"
                          >
                            {it.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-16 min-w-0">
            {/* Overview */}
            <div>
              <SectionHeader
                id="g-overview"
                kicker="01 · Start"
                title="Guide Overview"
                blurb="This guide extends the page above with deep technical content. The sections that follow assume you have read the overview, types, components and operation tabs."
              />
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Planning', d: 'Sizing, site, NEMA permits and EIA workflow.' },
                  { t: 'Civil & Mechanical', d: 'Excavation, slab, shed, shell fabrication, refractory, burners, stack.' },
                  { t: 'Controls & Handover', d: 'Electrical, PLC/HMI, commissioning, training, maintenance, safety, costs.' },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <p className="text-orange-400 text-sm font-semibold mb-1">{c.t}</p>
                    <p className="text-gray-300 text-sm">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizing */}
            <div>
              <SectionHeader
                id="g-sizing"
                kicker="02 · Planning"
                title="Sizing & Capacity Selection"
                blurb="Select capacity from peak daily generation and operating window. Round up to the next standard size; never undersize a healthcare incinerator."
              />
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/60 text-gray-400">
                    <tr>
                      <th className="text-left py-3 px-4">Rated capacity</th>
                      <th className="text-left py-3 px-4">Typical user</th>
                      <th className="text-left py-3 px-4">Primary vol.</th>
                      <th className="text-left py-3 px-4">Secondary vol.</th>
                      <th className="text-left py-3 px-4">Stack height</th>
                      <th className="text-left py-3 px-4">Diesel use</th>
                      <th className="text-left py-3 px-4">Footprint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZING_TABLE.map((row, i) => (
                      <tr key={row.capacity} className={i % 2 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                        <td className="py-3 px-4 font-semibold text-white">{row.capacity}</td>
                        <td className="py-3 px-4 text-gray-300">{row.bedsServed}</td>
                        <td className="py-3 px-4 text-gray-300">{row.primaryVol}</td>
                        <td className="py-3 px-4 text-gray-300">{row.secondaryVol}</td>
                        <td className="py-3 px-4 text-gray-300">{row.stackHeight}</td>
                        <td className="py-3 px-4 text-amber-300">{row.diesel}</td>
                        <td className="py-3 px-4 text-gray-300">{row.footprint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Site */}
            <div>
              <SectionHeader
                id="g-site"
                kicker="03 · Planning"
                title="Site Selection & Setback Requirements"
                blurb="Site selection is the single most common cause of NEMA objection and community complaints. Get this right before pouring concrete."
              />
              <div className="grid md:grid-cols-2 gap-5">
                <Callout tone="warn" title="Mandatory setbacks">
                  <ul className="list-disc ml-5 space-y-1">
                    <li>≥ 50 m from nearest occupied building or food handling area</li>
                    <li>≥ 100 m from boreholes, springs and surface water</li>
                    <li>≥ 30 m from fuel stores and oxygen manifolds</li>
                    <li>Stack tip ≥ 3 m above the highest roof within 50 m radius</li>
                  </ul>
                </Callout>
                <Callout tone="info" title="Wind & topography">
                  Site so that prevailing wind carries plume <em>away</em> from wards, kitchens
                  and residential plots. Avoid valleys where inversion layers can trap emissions.
                  Confirm with a 12-month wind-rose from the nearest KMD station.
                </Callout>
              </div>
            </div>

            {/* Permits */}
            <div>
              <SectionHeader
                id="g-permits"
                kicker="04 · Planning"
                title="Kenyan Permits & NEMA Compliance"
                blurb="Authoritative regulatory framework. Allow 8–14 weeks lead time for full permitting."
              />
              <Accordion
                color="blue"
                items={[
                  {
                    id: 'p-eia',
                    title: 'Environmental Impact Assessment (EIA)',
                    body: (
                      <>
                        Required under the <strong>Environmental Management and Co-ordination Act (EMCA) 1999</strong>,
                        Second Schedule. A licensed NEMA Lead Expert prepares the EIA Project Report (small projects)
                        or full EIA Study (≥ 100 kg/hr). Public participation, gazettement and licence fee apply.
                      </>
                    ),
                  },
                  {
                    id: 'p-air',
                    title: 'Air Quality Regulations 2014',
                    body: (
                      <>Sets stack emission limits used in the Combustion Targets table below: PM &lt; 50 mg/Nm³, CO &lt; 100 mg/Nm³,
                        HCl &lt; 30 mg/Nm³, SO₂ &lt; 200 mg/Nm³, dioxins &lt; 0.1 ng TEQ/Nm³. Annual stack test by NEMA-accredited lab.</>
                    ),
                  },
                  {
                    id: 'p-waste',
                    title: 'Waste Management Regulations 2006',
                    body: 'Defines hazardous, biomedical and chemical waste categories, generator responsibilities, transport manifests and approved disposal/treatment methods. Healthcare facilities require a Waste Generator Licence.',
                  },
                  {
                    id: 'p-poh',
                    title: 'Public Health Act & MoH Guidelines',
                    body: 'Health Care Waste Management Plan required for all hospitals; segregation by colour-coded bins (yellow infectious, red highly infectious, black general, sharps in puncture-proof containers).',
                  },
                  {
                    id: 'p-occ',
                    title: 'OSHA 2007 & Building Code',
                    body: 'DOSHS workplace registration, fire-engineer-approved layout, structural drawings stamped by a registered engineer, county council development permit before construction.',
                  },
                ]}
              />
            </div>

            {/* Excavation */}
            <div>
              <SectionHeader
                id="g-excavation"
                kicker="05 · Civil Works"
                title="Excavation & Earthworks"
                blurb="Sequence and quality control for the foundation pit. Document each step with photos and a survey log for handover."
              />
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/60 text-gray-400">
                    <tr>
                      <th className="text-left py-3 px-4">Step</th>
                      <th className="text-left py-3 px-4">Detail</th>
                      <th className="text-left py-3 px-4">Tool / equipment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXCAVATION_STEPS.map((s, i) => (
                      <tr key={s.step} className={i % 2 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                        <td className="py-3 px-4 text-white font-semibold whitespace-nowrap">{i + 1}. {s.step}</td>
                        <td className="py-3 px-4 text-gray-300">{s.detail}</td>
                        <td className="py-3 px-4 text-gray-400">{s.tool}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Foundation */}
            <div>
              <SectionHeader
                id="g-foundation"
                kicker="06 · Civil Works"
                title="Foundation & Reinforced Slab"
                blurb="Typical RC slab build-up. Adjust thickness for unit mass: 200 mm for ≤ 100 kg/hr, 250–300 mm for larger units, on engineered subgrade."
              />
              <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <FoundationSVG />
                </div>
                <div className="space-y-3">
                  <Callout tone="info" title="Concrete spec">
                    Use M25 (1:1.5:3) minimum, slump 75 ± 25 mm. Cure under wet hessian for 7 days
                    before erecting the shell. Take 6 cube samples; release at 21 N/mm² @ 7 days.
                  </Callout>
                  <Callout tone="warn" title="Drainage">
                    Slab finished 150 mm above surrounding ground level. Provide a 1 % fall to a
                    kerbed bund channelling washdown water to a 1000 L oil-interceptor before
                    discharge.
                  </Callout>
                </div>
              </div>
            </div>

            {/* Shed */}
            <div>
              <SectionHeader
                id="g-shed"
                kicker="07 · Civil Works"
                title="Incinerator Shed / Housing"
                blurb="A roof over the unit protects controls and operators without obstructing the stack."
              />
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Structure', items: ['100×100×3 mm SHS columns on base plates', 'Light truss roof, slope 10°', '2 m clearance above shell top'] },
                  { t: 'Cladding', items: ['IT5 pre-painted profile sheet roof', 'Open sides for natural ventilation', 'Mesh fence, lockable gate, signage'] },
                  { t: 'Services', items: ['LED high-bay lighting (IP65)', '13 A & 16 A sockets, RCD-protected', 'Wash-down tap & eye-wash station'] },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <p className="text-orange-400 font-semibold mb-2">{c.t}</p>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {c.items.map((i) => <li key={i} className="flex gap-2"><span className="text-emerald-400">▸</span>{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Fabrication */}
            <div>
              <SectionHeader
                id="g-fabrication"
                kicker="08 · Mechanical"
                title="Shell & Chamber Fabrication"
                blurb="Cutaway of a typical dual-chamber unit. Detail drawings should always be approved by a registered mechanical engineer before cutting plate."
              />
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                <FurnaceCutawaySVG />
              </div>
            </div>

            {/* Refractory */}
            <div>
              <SectionHeader
                id="g-refractory"
                kicker="09 · Mechanical"
                title="Refractory Lining System"
                blurb="A staged five-layer build-up gives long service life and low shell temperature."
              />
              <div className="grid md:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800/60 text-gray-400">
                      <tr>
                        <th className="text-left py-3 px-4">Layer</th>
                        <th className="text-left py-3 px-4">Material</th>
                        <th className="text-left py-3 px-4">Thickness</th>
                        <th className="text-left py-3 px-4">Service temp</th>
                        <th className="text-left py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REFRACTORY_LAYERS.map((l, i) => (
                        <tr key={l.layer} className={i % 2 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                          <td className="py-3 px-4 text-white font-semibold">{l.layer}</td>
                          <td className="py-3 px-4 text-gray-300">{l.material}</td>
                          <td className="py-3 px-4 text-gray-300">{l.thickness}</td>
                          <td className="py-3 px-4 text-amber-300">{l.service}</td>
                          <td className="py-3 px-4 text-gray-400">{l.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <RefractoryStackSVG />
                </div>
              </div>
              <div className="mt-5">
                <Callout tone="danger" title="Never skip the dry-out">
                  Firing wet refractory causes steam spalling and permanent damage. Always follow
                  the dry-out curve in the Commissioning Workflow before commercial loads.
                </Callout>
              </div>
            </div>

            {/* Combustion */}
            <div>
              <SectionHeader
                id="g-combustion"
                kicker="10 · Mechanical"
                title="Combustion & Burner System"
                blurb="Set-points and instrumentation that define a compliant burn."
              />
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/60 text-gray-400">
                    <tr>
                      <th className="text-left py-3 px-4">Parameter</th>
                      <th className="text-left py-3 px-4">Target</th>
                      <th className="text-left py-3 px-4">Why it matters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMBUSTION_TARGETS.map((p, i) => (
                      <tr key={p.param} className={i % 2 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                        <td className="py-3 px-4 text-white font-semibold">{p.param}</td>
                        <td className="py-3 px-4 text-emerald-300 font-mono">{p.target}</td>
                        <td className="py-3 px-4 text-gray-300">{p.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fuel */}
            <div>
              <SectionHeader
                id="g-fuel"
                kicker="11 · Mechanical"
                title="Fuel Storage & Delivery"
                blurb="Diesel is the most common primary fuel in Kenya. LPG and natural gas are used where available and economic."
              />
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <p className="text-orange-400 font-semibold mb-2">Diesel skid (≤ 200 kg/hr)</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 1000–2500 L bunded steel day-tank, 110 % secondary containment</li>
                    <li>• Suction strainer, water trap, 10 µm spin-on filter</li>
                    <li>• 3-bar electric pump; pressure gauge & relief valve to tank</li>
                    <li>• Schedule-40 black steel pipe; flexible braided hose at burner</li>
                    <li>• Earth-bonded fill point; no PVC anywhere on the wet side</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <p className="text-orange-400 font-semibold mb-2">LPG manifold (alternative)</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 6 × 50 kg cylinders, two banks with auto changeover</li>
                    <li>• First-stage regulator 2 bar, second-stage 50 mbar at burner</li>
                    <li>• Solenoid + slam-shut valve interlocked with flame failure</li>
                    <li>• Bund wall, ventilated cage, 3 m clearance from openings</li>
                    <li>• Gas detector at low level inside shed (LPG is heavier than air)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stack */}
            <div>
              <SectionHeader
                id="g-stack"
                kicker="12 · Mechanical"
                title="Stack, Scrubber & Emission Control"
                blurb="The stack does more than vent — it controls draft, dilutes residual emissions and provides the sampling port for compliance testing."
              />
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Stack design', d: 'Self-supporting CS pipe in flanged sections, guyed if H/D > 25. Sample port at 8× diameter from base, with platform & ladder cage.' },
                  { t: 'Wet scrubber', d: 'Venturi + packed-bed for HCl and SO₂. Caustic dosing keeps pH 7–9. Mist eliminator before stack to avoid plume droplets.' },
                  { t: 'Bag filter', d: 'PTFE-coated bags rated 250 °C for PM control after gas cooling. Pulse-jet cleaning, ash conveyed to sealed drum.' },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <p className="text-orange-400 font-semibold mb-2">{c.t}</p>
                    <p className="text-sm text-gray-300">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Electrical */}
            <div>
              <SectionHeader
                id="g-electrical"
                kicker="13 · Controls"
                title="Electrical & Instrumentation"
                blurb="A typical 100 kg/hr unit draws 6–10 kW continuous. Larger systems with scrubbers and bag filters reach 25–40 kW."
              />
              <Accordion
                color="emerald"
                items={[
                  {
                    id: 'e-power',
                    title: 'Power supply & distribution',
                    body: '3-phase 415 V / 50 Hz, dedicated MCCB at the main DB. Local MCC houses motor starters (DOL ≤ 3 kW, soft-start above), VFDs for ID/FD fans, surge protection, and a UPS for the PLC and HMI.',
                  },
                  {
                    id: 'e-instr',
                    title: 'Instrumentation list',
                    body: 'Type-K thermocouples (×4: primary, secondary, stack, refractory shell). Differential pressure transmitters (furnace draft, bag-filter ΔP). Fuel flow meter. Stack opacity sensor. Door limit switches. Flame UV scanners.',
                  },
                  {
                    id: 'e-earth',
                    title: 'Earthing & lightning',
                    body: 'Separate earth electrode for the stack (≤ 1 Ω). Equipotential bonding of all metallic structures. Lightning air terminal at stack tip with down-conductor to dedicated earth pit.',
                  },
                ]}
              />
            </div>

            {/* Automation */}
            <div>
              <SectionHeader
                id="g-automation"
                kicker="14 · Controls"
                title="PLC, HMI & Automation"
                blurb="Automation removes operator guesswork on the most critical safety interlocks."
              />
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <p className="text-orange-400 font-semibold mb-2">Recommended platforms</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Siemens S7-1200 + KTP700 HMI (mid-range)</li>
                    <li>• Schneider M221 + HMIGTO (entry)</li>
                    <li>• Allen-Bradley Micro850 + PanelView 800 (where AB is standard)</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <p className="text-orange-400 font-semibold mb-2">Mandatory interlocks</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• No charge until secondary &gt; 1100 °C</li>
                    <li>• Burner trip on flame failure within 4 s</li>
                    <li>• ID-fan run-proof before fuel admit</li>
                    <li>• Door-open inhibits fuel and disables charging</li>
                    <li>• Over-temp 1300 °C → master shutdown</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Commissioning */}
            <div>
              <SectionHeader
                id="g-commissioning"
                kicker="15 · Handover"
                title="Commissioning Workflow"
                blurb="Sequenced phases from mechanical completion to performance acceptance."
              />
              <div className="space-y-4">
                {COMMISSIONING_PHASES.map((p, i) => (
                  <div key={p.phase} className="rounded-xl border border-orange-500/25 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <p className="text-white font-bold">{i + 1}. {p.phase}</p>
                      <span className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">{p.days} day(s)</span>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
                      {p.items.map((it) => <li key={it} className="flex gap-2"><span className="text-emerald-400">✓</span>{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Training */}
            <div>
              <SectionHeader
                id="g-training"
                kicker="16 · Handover"
                title="Operator Training & Standard Operating Procedures"
                blurb="Two operators per shift, minimum, with a documented competency log."
              />
              <Accordion
                color="amber"
                items={[
                  { id: 't-startup', title: 'Cold start-up SOP', body: 'Pre-checks → ID-fan on → purge 5 min → secondary burner light → ramp to 1100 °C → primary burner light → verify draft → first charge ≤ 25 % capacity.' },
                  { id: 't-shutdown', title: 'Normal shutdown SOP', body: 'Stop charging → burn-down 30 min → secondary burner off when primary < 400 °C → ID-fan continues 60 min → primary burner off → fan off when shell < 200 °C.' },
                  { id: 't-emergency', title: 'Emergency shutdown', body: 'E-stop → fuel solenoids close → ID-fan continues → wear PPE before approach → only re-enter when chamber < 50 °C and atmosphere tested.' },
                  { id: 't-records', title: 'Mandatory records', body: 'Per-batch log: date, operator, waste type, weight, primary/secondary temps every 15 min, fuel used, ash weight, anomalies.' },
                ]}
              />
            </div>

            {/* Maintenance */}
            <div>
              <SectionHeader
                id="g-maintenance"
                kicker="17 · Operate"
                title="Maintenance Schedule"
                blurb="Minimum lifecycle plan. Heavy-use units (multiple shifts) should compress intervals by 30–50 %."
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MAINTENANCE_SCHEDULE.map((b) => (
                  <div key={b.interval} className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <p className="text-orange-400 font-bold mb-2">{b.interval}</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {b.tasks.map((t) => <li key={t} className="flex gap-2"><span className="text-emerald-400">▸</span>{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div>
              <SectionHeader
                id="g-safety"
                kicker="18 · Operate"
                title="Safety, PPE & Emergency Response"
              />
              <div className="space-y-3">
                {SAFETY_RULES.map((r, i) => (
                  <Callout
                    key={i}
                    tone={r.level === 'critical' ? 'danger' : r.level === 'high' ? 'warn' : 'info'}
                    title={r.level.toUpperCase()}
                  >
                    {r.rule}
                  </Callout>
                ))}
              </div>
            </div>

            {/* Cost */}
            <div>
              <SectionHeader
                id="g-cost"
                kicker="19 · Economics"
                title="Cost Breakdown (KES)"
                blurb="Indicative ranges for turn-key delivery in Nairobi. Add 8–18 % for upcountry sites depending on logistics."
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {(['small', 'medium', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCostSize(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                      costSize === s
                        ? 'bg-orange-500 text-black border-orange-500'
                        : 'bg-transparent text-gray-300 border-white/15 hover:border-orange-500/50'
                    }`}
                  >
                    {s === 'small' ? 'Small (≤ 25 kg/hr)' : s === 'medium' ? 'Medium (50–100 kg/hr)' : 'Large (≥ 200 kg/hr)'}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/60 text-gray-400">
                    <tr>
                      <th className="text-left py-3 px-4">Line item</th>
                      <th className="text-left py-3 px-4">KES range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COST_BREAKDOWN.map((row, i) => (
                      <tr key={row.item} className={i % 2 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                        <td className="py-3 px-4 text-white">{row.item}</td>
                        <td className="py-3 px-4 text-emerald-300 font-mono">KES {row[costSize]}</td>
                      </tr>
                    ))}
                    <tr className="bg-orange-500/10 border-t border-orange-500/30">
                      <td className="py-3 px-4 text-orange-300 font-bold">Indicative project total</td>
                      <td className="py-3 px-4 text-orange-300 font-mono font-bold">KES {totals.lo} – {totals.hi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Ranges are indicative engineering estimates compiled from recent Kenyan project tenders;
                final pricing depends on site survey, currency movements and specification choices. Not a quotation.
              </p>
            </div>

            {/* Checklists */}
            <div>
              <SectionHeader
                id="g-checklists"
                kicker="20 · Reference"
                title="Engineering Checklists"
                blurb="Print these before site visits and project gate reviews."
              />
              <div className="grid md:grid-cols-3 gap-4">
                {CHECKLISTS.map((c) => (
                  <div key={c.title} className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                    <p className="text-orange-400 font-semibold mb-3">{c.title}</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {c.items.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-block w-4 h-4 border border-orange-400/60 rounded-sm flex-shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
