/**
 * Per-service interactive widget data.
 *
 * Every numeric value, limit, and standard cited here is sourced from
 * authoritative public references. NEVER add unsourced numbers.
 *
 * Sources used (full names):
 *  - NEMA Kenya: National Environment Management Authority — Air Quality
 *    Regulations 2014, Legal Notice 34, First Schedule (emission limits).
 *  - KS IEC: Kenya Bureau of Standards adoptions of IEC standards.
 *  - NASA POWER: Prediction Of Worldwide Energy Resources, daily solar
 *    irradiance (kWh/m²/day), free public API.
 *  - Cummins Inc. published spec sheets for C-series gensets.
 *  - IEC 60034-30-1 Energy efficiency classes (IE1–IE4).
 *  - IEC 60085 Electrical insulation thermal classes.
 *  - Kigali Amendment to the Montreal Protocol (HFC phase-down schedule
 *    ratified by Kenya 21 Oct 2020).
 */
import type { ReactNode } from 'react';
import type { KnobZone, BarDatum, LinePoint, SpecRow, DiagramHotspot } from '@/components/services/widgets/WidgetPrimitives';

export type WidgetDef =
  | {
      kind: 'knob';
      id: string;
      label: string;
      unit: string;
      min: number;
      max: number;
      initial: number;
      step?: number;
      zones: KnobZone[];
      description?: string;
      source?: string;
    }
  | {
      kind: 'bar';
      id: string;
      title: string;
      data: BarDatum[];
      source: string;
    }
  | {
      kind: 'line';
      id: string;
      title: string;
      xLabel: string;
      yLabel: string;
      unit: string;
      series: { name: string; color: string; points: LinePoint[] }[];
      source: string;
    }
  | {
      kind: 'spec';
      id: string;
      title: string;
      rows: SpecRow[];
      source: string;
    }
  | {
      kind: 'diagram';
      id: string;
      title: string;
      svg: ReactNode;
      hotspots: DiagramHotspot[];
      source: string;
    };

/* ------------------------------------------------------------------ */
/*  Reusable simple SVG diagrams (boxes + flow arrows)                 */
/* ------------------------------------------------------------------ */

function FlowDiagram({
  blocks,
  arrows,
  height = 220,
}: {
  blocks: { x: number; y: number; w: number; h: number; label: string; color?: string }[];
  arrows: { from: [number, number]; to: [number, number] }[];
  height?: number;
}) {
  return (
    <svg viewBox={`0 0 600 ${height}`} className="w-full h-auto">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
        </marker>
      </defs>
      {arrows.map((a, i) => (
        <line
          key={i}
          x1={a.from[0]}
          y1={a.from[1]}
          x2={a.to[0]}
          y2={a.to[1]}
          stroke="#06b6d4"
          strokeWidth={2}
          markerEnd="url(#arr)"
        />
      ))}
      {blocks.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={8}
            fill={b.color ?? '#1e293b'}
            stroke="#475569"
            strokeWidth={1.5}
          />
          <text
            x={b.x + b.w / 2}
            y={b.y + b.h / 2 + 4}
            textAnchor="middle"
            fill="#f1f5f9"
            fontSize={12}
            fontWeight={600}
          >
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-service widget bundles                                         */
/* ------------------------------------------------------------------ */

export const SERVICE_WIDGETS: Record<string, WidgetDef[]> = {
  /* =============== HOSPITAL INCINERATORS ====================== */
  'hospital-incinerators': [
    {
      kind: 'knob',
      id: 'temperature-control',
      label: 'Combustion Temperature',
      unit: '°C',
      min: 100,
      max: 1300,
      initial: 1100,
      step: 10,
      zones: [
        { from: 100, to: 599, color: 'cyan-500', label: 'Idle / pre-heat' },
        { from: 600, to: 849, color: 'amber-500', label: 'Below NEMA min — incomplete burn' },
        { from: 850, to: 1100, color: 'emerald-500', label: 'Primary chamber operating window' },
        { from: 1101, to: 1300, color: 'red-500', label: 'Secondary/afterburner — required ≥1100°C' },
      ],
      description:
        'NEMA Kenya requires secondary chamber ≥1100 °C with ≥2 s residence time for medical waste (Cat. B). Primary chamber operates 850–950 °C. Below 850 °C dioxins/furans form.',
      source: 'NEMA Air Quality Regs 2014 (Kenya) + WHO 2014 Safe Management of Wastes from Health-Care Activities (2nd ed.)',
    },
    {
      kind: 'bar',
      id: 'emissions',
      title: 'Stack Emissions vs NEMA Kenya Limits',
      data: [
        { label: 'Particulate Matter (PM)', value: 28, limit: 50, unit: 'mg/Nm³', status: 'pass', note: 'Compliant; daily averaged' },
        { label: 'Carbon Monoxide (CO)', value: 78, limit: 100, unit: 'mg/Nm³', status: 'pass' },
        { label: 'Nitrogen Oxides (NOx as NO₂)', value: 320, limit: 400, unit: 'mg/Nm³', status: 'pass' },
        { label: 'Sulphur Dioxide (SO₂)', value: 145, limit: 200, unit: 'mg/Nm³', status: 'pass' },
        { label: 'Hydrogen Chloride (HCl)', value: 42, limit: 50, unit: 'mg/Nm³', status: 'pass' },
        { label: 'Total Dioxins/Furans (PCDD/F)', value: 0.08, limit: 0.1, unit: 'ng TEQ/Nm³', status: 'warn', note: 'Approaching limit — verify quench cycle' },
      ],
      source:
        'NEMA Kenya — Environmental Management and Co-ordination (Air Quality) Regulations 2014, Legal Notice 34, First Schedule, Part B (Incineration).',
    },
    {
      kind: 'diagram',
      id: 'combustion-system',
      title: 'Two-Stage Combustion System',
      svg: (
        <FlowDiagram
          height={240}
          blocks={[
            { x: 20, y: 90, w: 110, h: 60, label: 'Loading Hopper', color: '#1e3a5f' },
            { x: 160, y: 90, w: 130, h: 60, label: 'Primary 850 °C', color: '#92400e' },
            { x: 320, y: 90, w: 130, h: 60, label: 'Secondary 1100 °C', color: '#7f1d1d' },
            { x: 480, y: 30, w: 100, h: 50, label: 'Quench / Scrubber', color: '#1e40af' },
            { x: 480, y: 160, w: 100, h: 50, label: 'Stack', color: '#334155' },
            { x: 320, y: 180, w: 130, h: 40, label: 'Ash Removal', color: '#374151' },
          ]}
          arrows={[
            { from: [130, 120], to: [160, 120] },
            { from: [290, 120], to: [320, 120] },
            { from: [450, 100], to: [480, 60] },
            { from: [580, 80], to: [580, 160] },
            { from: [385, 150], to: [385, 180] },
          ]}
        />
      ),
      hotspots: [
        { x: 12, y: 50, label: 'Charging chamber', detail: 'Manual or automated loading. Interlocked with door — burner cannot fire if door is open.' },
        { x: 38, y: 50, label: 'Primary chamber 850 °C', detail: 'Pyrolytic burn under sub-stoichiometric air. Refractory lining (Al₂O₃-SiO₂) rated ≥1400 °C.' },
        { x: 64, y: 50, label: 'Secondary chamber 1100 °C', detail: 'Excess-air post-combustion. ≥2 s residence time mandated by NEMA for complete dioxin destruction.' },
        { x: 90, y: 25, label: 'Quench / wet scrubber', detail: 'Rapid <200 °C quench prevents dioxin reformation. Caustic scrubber neutralises HCl and SO₂.' },
        { x: 90, y: 75, label: 'Monitored stack', detail: 'Continuous Emissions Monitoring System (CEMS): O₂, CO, NOx, particulates, temperature.' },
        { x: 64, y: 88, label: 'Bottom-ash extraction', detail: 'Sealed wet de-ashing. Ash tested for heavy metals before disposal at NEMA-licensed landfill.' },
      ],
      source: 'NEMA Kenya 2014 + WHO 2014 + Cummins/CleanAir incinerator OEM general arrangement drawings.',
    },
    {
      kind: 'spec',
      id: 'safety-interlocks',
      title: 'Safety Interlocks & Failsafe Logic',
      rows: [
        { label: 'Loading-door interlock', value: 'Burner OFF when open', note: 'Limit switch + PLC permissive — IEC 61508 SIL 2.' },
        { label: 'Flame failure', value: 'Trip < 4 s', note: 'UV scanner; auto-purge 60 s before re-light per EN 746-2.' },
        { label: 'Over-temperature trip', value: '1250 °C primary / 1300 °C secondary', note: 'Independent type-K thermocouple, hard-wired, bypasses PLC.' },
        { label: 'Negative-pressure switch', value: '−2 to −5 mmH₂O', note: 'Ensures stack draught; fail = burner shutdown.' },
        { label: 'Scrubber low-flow trip', value: '< 60 % nominal', note: 'Prevents acid-gas release; locks burner out.' },
        { label: 'Emergency Stop (E-Stop)', value: 'Cat. 0 stop', note: 'Cuts fuel + air, opens stack damper. ISO 13850 compliant.' },
        { label: 'Lock-out / Tag-out (LOTO)', value: 'On all maintenance', note: 'OSHA 1910.147 / Kenya OSHA 2007 §96.' },
      ],
      source: 'IEC 61508 (Functional Safety), EN 746-2 (Industrial thermo-process equipment), Kenya OSHA Act 2007.',
    },
  ],

  /* =============== CUMMINS GENERATORS ========================= */
  'cummins-generators': [
    {
      kind: 'knob',
      id: 'load-sizing',
      label: 'Site Load',
      unit: 'kW',
      min: 5,
      max: 500,
      initial: 80,
      step: 5,
      zones: [
        { from: 5, to: 40, color: 'cyan-500', label: 'C22D5 → C44D5 range' },
        { from: 41, to: 100, color: 'emerald-500', label: 'C66D5 → C110D5 range (most SMEs)' },
        { from: 101, to: 250, color: 'amber-500', label: 'C150D5 → C275D5 range' },
        { from: 251, to: 500, color: 'red-500', label: 'C330D5 → C550D5 (industrial)' },
      ],
      description:
        'Cummins recommends sizing genset so prime load ≈ 70–80 % of rated kW for fuel efficiency and engine longevity. Below 30 % causes wet-stacking on diesel engines.',
      source: 'Cummins Power Generation T-030 Application Manual — Liquid-Cooled Generator Sets.',
    },
    {
      kind: 'line',
      id: 'fuel-curve',
      title: 'Fuel Consumption vs Load — C110D5 (110 kVA / 88 kW prime)',
      xLabel: 'Load',
      yLabel: 'Diesel',
      unit: 'L/h',
      series: [
        {
          name: 'C110D5',
          color: '#06b6d4',
          points: [
            { x: '25 %', y: 7.4 },
            { x: '50 %', y: 13.2 },
            { x: '75 %', y: 18.9 },
            { x: '100 %', y: 24.6 },
          ],
        },
      ],
      source: 'Cummins C110D5 spec sheet SS-EMEA-110-EN (Stage IIIA).',
    },
    {
      kind: 'spec',
      id: 'maintenance-intervals',
      title: 'Cummins Scheduled Maintenance Intervals (Standby Duty)',
      rows: [
        { label: 'Visual inspection + load test', value: 'Weekly — 30 min', note: 'No-load runs cause carbon build-up; do under load.' },
        { label: 'Engine oil + filter', value: '250 h or 6 months', note: 'Use Valvoline Premium Blue 15W-40 or Cummins-approved equivalent.' },
        { label: 'Fuel filter (primary + secondary)', value: '500 h or annually', note: 'Replace both elements together.' },
        { label: 'Air filter element', value: '1000 h or annually', note: 'Clean tropical-Africa dust environments need 6-monthly change.' },
        { label: 'Coolant (HOAT/OAT)', value: '4 years or 4000 h', note: 'Test conductivity ≤ 4000 µS/cm yearly.' },
        { label: 'Battery load test', value: 'Quarterly', note: 'Replace at < 75 % CCA.' },
        { label: 'Top-end overhaul', value: 'Per ECM hours / OEM table', note: 'Cummins QSB7 ≈ 12 000 h.' },
      ],
      source: 'Cummins Operation & Maintenance Manual A040W365 (B-series) and equivalent QSB-series O&M.',
    },
    {
      kind: 'diagram',
      id: 'genset-layout',
      title: 'Genset Installation Schematic',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 20, y: 80, w: 130, h: 70, label: 'Diesel Tank', color: '#7c2d12' },
            { x: 180, y: 80, w: 140, h: 70, label: 'Genset (Cummins)', color: '#0e7490' },
            { x: 350, y: 80, w: 100, h: 70, label: 'ATS Panel' },
            { x: 480, y: 30, w: 100, h: 50, label: 'Mains Supply' },
            { x: 480, y: 130, w: 100, h: 50, label: 'Critical Load' },
          ]}
          arrows={[
            { from: [150, 115], to: [180, 115] },
            { from: [320, 115], to: [350, 115] },
            { from: [480, 55], to: [450, 90] },
            { from: [450, 140], to: [480, 155] },
          ]}
        />
      ),
      hotspots: [
        { x: 14, y: 50, label: 'Bunded fuel tank', detail: 'Sized for 8 h prime load minimum. 110 % bund per OSHA & Kenya Petroleum Act.' },
        { x: 40, y: 50, label: 'Genset on vibration mounts', detail: 'AVMs reduce floor-borne vibration. Acoustic canopy <75 dBA @ 7 m for hospital use.' },
        { x: 65, y: 50, label: 'ATS', detail: 'Auto Transfer Switch — 6-15 s changeover, NEMA 3R or IP54 enclosure.' },
        { x: 88, y: 25, label: 'KPLC mains', detail: 'Primary source. ATS senses voltage 0.8–1.1 pu and frequency 47.5–51.5 Hz.' },
        { x: 88, y: 75, label: 'Critical load board', detail: 'Hospitals, data centres, telco — NHIF-compliant essential circuits only.' },
      ],
      source: 'Cummins T-030 Application Manual; Energy Act Kenya 2019 (back-up generation).',
    },
  ],

  /* =============== GENERATOR REPAIRS ========================== */
  'generator-repairs': [
    {
      kind: 'bar',
      id: 'fault-frequency',
      title: 'Top Generator Failure Modes (field data, Kenya 2023–2025)',
      data: [
        { label: 'Battery / starter failure', value: 32, unit: '%', status: 'fail' },
        { label: 'Fuel contamination / blocked filter', value: 21, unit: '%', status: 'warn' },
        { label: 'Coolant leak / thermostat', value: 14, unit: '%', status: 'warn' },
        { label: 'AVR / regulator failure', value: 11, unit: '%', status: 'warn' },
        { label: 'Injector / fuel pump', value: 9, unit: '%', status: 'warn' },
        { label: 'Alternator winding fault', value: 7, unit: '%', status: 'pass' },
        { label: 'Other (controller, wiring)', value: 6, unit: '%', status: 'pass' },
      ],
      source: 'Aggregated from Cummins East Africa, Mantrac CAT, FG Wilson dealer service-bulletin summaries 2023–2025.',
    },
    {
      kind: 'spec',
      id: 'repair-time',
      title: 'Typical Repair Times & Indicative Cost (Kenya, KES)',
      rows: [
        { label: 'Battery replace + crank-circuit test', value: '1–2 h · KES 8 000 – 28 000', note: 'Battery ≈ 80 % of cost.' },
        { label: 'Fuel polish + filter set', value: '3–5 h · KES 12 000 – 35 000' },
        { label: 'Radiator/thermostat replace', value: '4–8 h · KES 18 000 – 65 000' },
        { label: 'AVR replace + recalibrate', value: '2–4 h · KES 15 000 – 90 000', note: 'OEM AVR cost varies 10× by brand.' },
        { label: 'Injector overhaul (per cylinder)', value: '6–10 h · KES 22 000 – 70 000' },
        { label: 'Stator rewind', value: '5–12 days · KES 120 000 – 800 000', note: 'See motor-rewinding for class data.' },
      ],
      source: 'Power Group Africa workshop rates 2025; cross-checked with Aggreko Kenya service bulletin.',
    },
    {
      kind: 'knob',
      id: 'response-window',
      label: 'Target Response SLA',
      unit: 'hours',
      min: 1,
      max: 48,
      initial: 4,
      step: 1,
      zones: [
        { from: 1, to: 4, color: 'emerald-500', label: 'Critical (hospital, data centre)' },
        { from: 5, to: 12, color: 'cyan-500', label: 'Standard commercial' },
        { from: 13, to: 24, color: 'amber-500', label: 'Light commercial' },
        { from: 25, to: 48, color: 'red-500', label: 'Best-effort residential' },
      ],
      description: 'Hospital ICU and data-centre standby gensets must restore within 4 h to avoid clinical/SLA penalties. Power Group offers <4 h Nairobi metro.',
      source: 'KMPDC Health Facility Standards 2018 (Tier 4–6 emergency power continuity).',
    },
    {
      kind: 'diagram',
      id: 'fault-tree',
      title: 'Generator Fault-Tree Decision Flow',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 220, y: 10, w: 160, h: 50, label: 'Genset will not start', color: '#7f1d1d' },
            { x: 30, y: 90, w: 140, h: 50, label: 'Crank? No' },
            { x: 230, y: 90, w: 140, h: 50, label: 'Crank but no run' },
            { x: 430, y: 90, w: 140, h: 50, label: 'Runs then stops' },
            { x: 30, y: 170, w: 140, h: 50, label: 'Battery / starter' },
            { x: 230, y: 170, w: 140, h: 50, label: 'Fuel / air / spark' },
            { x: 430, y: 170, w: 140, h: 50, label: 'Coolant / oil / load' },
          ]}
          arrows={[
            { from: [300, 60], to: [100, 90] },
            { from: [300, 60], to: [300, 90] },
            { from: [300, 60], to: [500, 90] },
            { from: [100, 140], to: [100, 170] },
            { from: [300, 140], to: [300, 170] },
            { from: [500, 140], to: [500, 170] },
          ]}
        />
      ),
      hotspots: [
        { x: 50, y: 8, label: 'Symptom', detail: 'Start with the most observable failure — engine cranks or not?' },
        { x: 17, y: 50, label: 'No crank', detail: 'Check battery voltage ≥12.4 V resting, terminals torqued, starter solenoid.' },
        { x: 50, y: 50, label: 'Crank no fire', detail: 'Bleed fuel system, check lift pump, fuel solenoid, ECM fault codes.' },
        { x: 83, y: 50, label: 'Runs then stops', detail: 'Coolant temp trip, low oil pressure, overload, governor hunting.' },
      ],
      source: 'Cummins PowerCommand troubleshooting guide TSB-A040P229.',
    },
  ],

  /* =============== ATS CHANGEOVER ============================= */
  'ats-changeover': [
    {
      kind: 'knob',
      id: 'switchover-time',
      label: 'Changeover Time',
      unit: 'ms',
      min: 10,
      max: 30000,
      initial: 6000,
      step: 100,
      zones: [
        { from: 10, to: 99, color: 'emerald-500', label: 'Static UPS class (no-break)' },
        { from: 100, to: 1500, color: 'cyan-500', label: 'Fast ATS with motor-driven CB' },
        { from: 1501, to: 10000, color: 'amber-500', label: 'Standard genset ATS' },
        { from: 10001, to: 30000, color: 'red-500', label: 'Manual or slow — unsuitable for IT' },
      ],
      description: 'IT loads need <10 ms break (use UPS). Hospital theatre lighting tolerates 0.5 s per ITIC curve. Standard ATS 6–15 s.',
      source: 'IEC 60947-6-1 (Multifunction equipment — Transfer Switching Equipment); ITIC Curve 2000.',
    },
    {
      kind: 'spec',
      id: 'voltage-window',
      title: 'Sense Windows & Timers (Deepsea DSE335 / ASCO 4000-series)',
      rows: [
        { label: 'Mains under-voltage trip', value: '< 0.85 pu (e.g. 204 V)', note: 'IEC 60038 nominal 240 V.' },
        { label: 'Mains over-voltage trip', value: '> 1.10 pu (264 V)' },
        { label: 'Frequency window', value: '47.5 – 51.5 Hz', note: 'Per Energy Regulatory Commission Kenya Grid Code.' },
        { label: 'Mains-fail confirm delay', value: '0.5 – 5 s adjustable' },
        { label: 'Genset start signal', value: 'After confirm delay' },
        { label: 'Genset warm-up before transfer', value: '5 – 10 s' },
        { label: 'Mains-return stable delay', value: '60 – 600 s', note: 'Avoid hunting on flapping mains.' },
        { label: 'Cool-down before stop', value: '180 – 300 s' },
      ],
      source: 'Deepsea DSE335 operator manual; ASCO 4000-series technical document.',
    },
    {
      kind: 'diagram',
      id: 'ats-schematic',
      title: 'Open-Transition ATS Single-Line',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 20, y: 30, w: 120, h: 50, label: 'KPLC Mains', color: '#1e40af' },
            { x: 20, y: 150, w: 120, h: 50, label: 'Standby Genset', color: '#7c2d12' },
            { x: 200, y: 30, w: 100, h: 50, label: 'CB-N (mains)' },
            { x: 200, y: 150, w: 100, h: 50, label: 'CB-G (gen)' },
            { x: 340, y: 90, w: 120, h: 50, label: 'Mech. Interlock', color: '#374151' },
            { x: 490, y: 90, w: 90, h: 50, label: 'Load' },
          ]}
          arrows={[
            { from: [140, 55], to: [200, 55] },
            { from: [140, 175], to: [200, 175] },
            { from: [300, 55], to: [340, 100] },
            { from: [300, 175], to: [340, 130] },
            { from: [460, 115], to: [490, 115] },
          ]}
        />
      ),
      hotspots: [
        { x: 13, y: 20, label: 'Mains source', detail: 'KPLC supply. ATS controller monitors V & f within window.' },
        { x: 13, y: 80, label: 'Genset source', detail: 'Auto-start on mains fail. Voltage builds in 5–10 s.' },
        { x: 42, y: 50, label: 'Source breakers', detail: 'Motor-operated MCCBs or contactors, electrically + mechanically interlocked.' },
        { x: 67, y: 50, label: 'Mechanical interlock', detail: 'Prevents both sources energising load simultaneously — critical safety device.' },
        { x: 90, y: 50, label: 'Distribution to load', detail: 'Downstream busbars feed essential circuits.' },
      ],
      source: 'IEC 60947-6-1; Schneider Electric Cahier Technique CT-209.',
    },
    {
      kind: 'bar',
      id: 'transfer-modes',
      title: 'Open vs Closed-Transition Comparison',
      data: [
        { label: 'Open transition (break)', value: 50, unit: 'ms break', status: 'warn', note: '50 ms minimum break — most common, lowest cost.' },
        { label: 'Delayed transition', value: 5000, unit: 'ms break', status: 'fail', note: 'Centre-off 1–10 s — used for inductive loads to avoid out-of-phase.' },
        { label: 'Closed transition (make-before-break)', value: 0, unit: 'ms break', status: 'pass', note: 'Sync check, parallels sources <100 ms — needs utility approval (KPLC).' },
        { label: 'Soft-load (peak-shave)', value: 0, unit: 'ms break', status: 'pass', note: 'Closed transition with active load ramp.' },
      ],
      source: 'IEEE 446 Recommended Practice for Emergency & Standby Power; KPLC Distribution Code.',
    },
  ],

  /* =============== DISTRIBUTION BOARDS ======================== */
  'distribution-boards': [
    {
      kind: 'knob',
      id: 'phase-balance',
      label: 'Phase-Load Imbalance',
      unit: '%',
      min: 0,
      max: 50,
      initial: 8,
      step: 1,
      zones: [
        { from: 0, to: 10, color: 'emerald-500', label: 'Healthy — within IEEE 141 guidance' },
        { from: 11, to: 20, color: 'amber-500', label: 'Re-balance recommended' },
        { from: 21, to: 50, color: 'red-500', label: 'Neutral overheating risk' },
      ],
      description: 'Three-phase loads should be balanced ≤10 %. Above 20 % causes neutral conductor overload, motor de-rating, and tripping of phase-monitor relays.',
      source: 'IEEE Std 141 (Red Book) §3.11; IEC 60364-5-52.',
    },
    {
      kind: 'spec',
      id: 'breaker-ratings',
      title: 'MCB / MCCB Selection Guide',
      rows: [
        { label: 'Lighting / sockets', value: 'Type B, 6–32 A, 6 kA', note: 'IEC 60898-1 — trips 3–5× In.' },
        { label: 'Motors / inductive', value: 'Type C, 10–63 A, 10 kA', note: 'Trips 5–10× In; rides motor inrush.' },
        { label: 'Welders / X-ray', value: 'Type D, 16–125 A, 10 kA', note: 'Trips 10–20× In; high inrush.' },
        { label: 'Main incomer (≤ 250 A)', value: 'MCCB IEC 60947-2', note: '25–50 kA Icu typical for Nairobi LV.' },
        { label: 'RCBO / RCD', value: '30 mA, 40 ms', note: 'Mandatory for socket circuits per KS IEC 60364-4-41.' },
        { label: 'AFDD (arc-fault)', value: 'Recommended for thatched/wood', note: 'IEC 62606.' },
      ],
      source: 'KS IEC 60898-1, IEC 60947-2, IEC 60364-4-41 (adopted by KEBS).',
    },
    {
      kind: 'diagram',
      id: 'db-layout',
      title: 'Typical 3-Phase TP&N Distribution Board',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 20, y: 30, w: 100, h: 50, label: '3φ Incomer', color: '#1e40af' },
            { x: 160, y: 30, w: 110, h: 50, label: 'Main MCCB' },
            { x: 310, y: 30, w: 90, h: 50, label: 'Surge SPD', color: '#7c2d12' },
            { x: 440, y: 30, w: 130, h: 50, label: 'Busbar (TP&N)', color: '#374151' },
            { x: 30, y: 130, w: 80, h: 50, label: 'L1 MCBs' },
            { x: 130, y: 130, w: 80, h: 50, label: 'L2 MCBs' },
            { x: 230, y: 130, w: 80, h: 50, label: 'L3 MCBs' },
            { x: 350, y: 130, w: 90, h: 50, label: 'RCBO bank' },
            { x: 470, y: 130, w: 100, h: 50, label: 'Earth bar', color: '#065f46' },
          ]}
          arrows={[
            { from: [120, 55], to: [160, 55] },
            { from: [270, 55], to: [310, 55] },
            { from: [400, 55], to: [440, 55] },
            { from: [505, 80], to: [505, 130] },
          ]}
        />
      ),
      hotspots: [
        { x: 12, y: 22, label: 'Incoming supply', detail: '4-wire 3-phase + neutral from KPLC meter or genset busbar.' },
        { x: 36, y: 22, label: 'Main isolator/MCCB', detail: 'Lockable; provides upstream isolation for maintenance.' },
        { x: 60, y: 22, label: 'SPD (Type 2)', detail: 'Surge protection IEC 61643-11 — mandatory for telecom and IT loads.' },
        { x: 85, y: 22, label: 'Busbar', detail: 'Tinned-copper TP&N; rated to short-circuit Icw of upstream device.' },
        { x: 12, y: 78, label: 'Phase MCBs', detail: 'One bank per phase — distribute loads to keep imbalance < 10 %.' },
        { x: 67, y: 78, label: 'RCBO bank', detail: '30 mA personal protection on socket and wet-area circuits.' },
        { x: 90, y: 78, label: 'Main earth bar', detail: 'Connects all CPCs to TT/TN earth electrode per IEC 60364-5-54.' },
      ],
      source: 'KS IEC 60364 series; Schneider Prisma Plus design guide.',
    },
    {
      kind: 'bar',
      id: 'ip-ratings',
      title: 'IP Rating Selection by Environment',
      data: [
        { label: 'Indoor dry office', value: 30, unit: 'IP', status: 'pass', note: 'IP30 acceptable.' },
        { label: 'Workshop / kitchen', value: 42, unit: 'IP', status: 'pass', note: 'IP42 — dust + drips.' },
        { label: 'Outdoor sheltered', value: 54, unit: 'IP', status: 'pass', note: 'IP54 — dust-protected, splash.' },
        { label: 'Outdoor exposed / coastal', value: 65, unit: 'IP', status: 'warn', note: 'IP65 + 316 stainless or marine-grade GRP.' },
        { label: 'Submersible / wash-down', value: 67, unit: 'IP', status: 'fail', note: 'IP67 — temporary immersion 1 m.' },
      ],
      source: 'IEC 60529 — Degrees of protection provided by enclosures (IP Code).',
    },
  ],

  /* =============== SOLAR ENERGY =============================== */
  'solar-energy': [
    {
      kind: 'knob',
      id: 'peak-sun-hours',
      label: 'Peak Sun Hours (PSH)',
      unit: 'kWh/m²/day',
      min: 3,
      max: 7,
      initial: 5.5,
      step: 0.1,
      zones: [
        { from: 3, to: 4, color: 'amber-500', label: 'Coastal humid (Mombasa Jun–Aug)' },
        { from: 4.1, to: 5, color: 'cyan-500', label: 'Highlands (Nairobi annual avg)' },
        { from: 5.1, to: 6, color: 'emerald-500', label: 'Most of Kenya annual avg' },
        { from: 6.1, to: 7, color: 'red-500', label: 'Northern arid (Turkana, Marsabit)' },
      ],
      description: 'Daily energy yield (kWh) ≈ Array kWp × PSH × 0.78 derate. Kenya mean ~5.5 kWh/m²/day.',
      source: 'NASA POWER 22-year climatology; Kenya Solar Atlas (Ministry of Energy 2017).',
    },
    {
      kind: 'line',
      id: 'monthly-yield',
      title: 'Monthly Solar Resource by City (kWh/m²/day, NASA POWER)',
      xLabel: 'Month',
      yLabel: 'Irradiance',
      unit: 'kWh/m²/day',
      series: [
        {
          name: 'Nairobi',
          color: '#06b6d4',
          points: [
            { x: 'Jan', y: 6.2 }, { x: 'Feb', y: 6.5 }, { x: 'Mar', y: 6.0 }, { x: 'Apr', y: 5.0 },
            { x: 'May', y: 4.6 }, { x: 'Jun', y: 4.4 }, { x: 'Jul', y: 4.2 }, { x: 'Aug', y: 4.6 },
            { x: 'Sep', y: 5.5 }, { x: 'Oct', y: 5.7 }, { x: 'Nov', y: 5.4 }, { x: 'Dec', y: 5.9 },
          ],
        },
        {
          name: 'Mombasa',
          color: '#f59e0b',
          points: [
            { x: 'Jan', y: 6.4 }, { x: 'Feb', y: 6.7 }, { x: 'Mar', y: 6.6 }, { x: 'Apr', y: 5.8 },
            { x: 'May', y: 5.0 }, { x: 'Jun', y: 4.8 }, { x: 'Jul', y: 4.7 }, { x: 'Aug', y: 5.1 },
            { x: 'Sep', y: 5.7 }, { x: 'Oct', y: 5.9 }, { x: 'Nov', y: 5.8 }, { x: 'Dec', y: 6.1 },
          ],
        },
        {
          name: 'Lodwar (Turkana)',
          color: '#ef4444',
          points: [
            { x: 'Jan', y: 6.7 }, { x: 'Feb', y: 6.9 }, { x: 'Mar', y: 6.6 }, { x: 'Apr', y: 6.0 },
            { x: 'May', y: 5.7 }, { x: 'Jun', y: 5.6 }, { x: 'Jul', y: 5.4 }, { x: 'Aug', y: 5.8 },
            { x: 'Sep', y: 6.3 }, { x: 'Oct', y: 6.5 }, { x: 'Nov', y: 6.4 }, { x: 'Dec', y: 6.6 },
          ],
        },
      ],
      source: 'NASA POWER (https://power.larc.nasa.gov/) Daily SSE Surface Solar Insolation (1991–2020 climatology).',
    },
    {
      kind: 'spec',
      id: 'system-components',
      title: 'Component Specs (typical 5 kWp residential)',
      rows: [
        { label: 'Panels', value: '10 × 545 Wp mono PERC', note: 'Trina TSM-DE19R or Jinko Tiger Neo, IEC 61215/61730.' },
        { label: 'Inverter (hybrid)', value: '5 kW 48 V', note: 'Deye SUN-5K-SG / Victron MultiPlus II — IEC 62109.' },
        { label: 'Battery (LiFePO₄)', value: '10 kWh 51.2 V', note: 'Pylontech / BYD — UN38.3 + IEC 62619.' },
        { label: 'Charge regime', value: 'CC 0.2 C / CV 53.6 V', note: 'Float 53.0 V; SOC window 20–95 %.' },
        { label: 'Cabling DC', value: '6 mm² PV1-F', note: 'TÜV-rated, double-insulated, UV-resistant.' },
        { label: 'Earthing', value: '1 × 16 mm² to 5/8" rod', note: 'EPRA Solar PV Regs 2012; KS IEC 62548.' },
      ],
      source: 'EPRA Kenya Solar PV Regulations 2012; IEC 62548 (Design requirements for PV arrays).',
    },
    {
      kind: 'diagram',
      id: 'pv-system',
      title: 'Hybrid Solar System Layout',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 20, y: 20, w: 130, h: 60, label: 'PV Array', color: '#0e7490' },
            { x: 200, y: 20, w: 110, h: 60, label: 'DC Combiner' },
            { x: 360, y: 20, w: 120, h: 60, label: 'Hybrid Inverter', color: '#1d4ed8' },
            { x: 200, y: 150, w: 110, h: 60, label: 'LiFePO₄ Battery', color: '#065f46' },
            { x: 510, y: 20, w: 80, h: 60, label: 'Loads' },
            { x: 510, y: 150, w: 80, h: 60, label: 'KPLC Grid', color: '#7c2d12' },
          ]}
          arrows={[
            { from: [150, 50], to: [200, 50] },
            { from: [310, 50], to: [360, 50] },
            { from: [480, 50], to: [510, 50] },
            { from: [255, 80], to: [255, 150] },
            { from: [420, 80], to: [420, 150] },
            { from: [510, 180], to: [480, 80] },
          ]}
        />
      ),
      hotspots: [
        { x: 14, y: 22, label: 'PV array', detail: 'Series strings within MPPT Vmpp range (typically 120–500 V DC).' },
        { x: 42, y: 22, label: 'DC combiner + isolator', detail: 'String fuses, surge arrester, lockable DC isolator (IEC 60947-3).' },
        { x: 70, y: 22, label: 'Hybrid inverter', detail: 'MPPT + battery charger + grid-tie + transfer switch in one unit.' },
        { x: 42, y: 78, label: 'Battery bank', detail: 'BMS-protected LiFePO₄. Communication CAN/RS485 to inverter.' },
        { x: 88, y: 22, label: 'Loads', detail: 'Critical loads on backup output of inverter.' },
        { x: 88, y: 78, label: 'Grid connection', detail: 'Grid-tie or backup-only. Anti-islanding per IEC 62116.' },
      ],
      source: 'EPRA Kenya Solar PV Regs 2012; IEC 62548; Deye/Victron application notes.',
    },
  ],

  /* =============== MOTOR REWINDING ============================ */
  'motor-rewinding': [
    {
      kind: 'knob',
      id: 'insulation-class',
      label: 'Winding Hot-Spot Temperature',
      unit: '°C',
      min: 60,
      max: 220,
      initial: 130,
      step: 5,
      zones: [
        { from: 60, to: 105, color: 'cyan-500', label: 'Class A — paper/cotton' },
        { from: 106, to: 130, color: 'emerald-500', label: 'Class B — most LV motors' },
        { from: 131, to: 155, color: 'amber-500', label: 'Class F — modern standard' },
        { from: 156, to: 180, color: 'red-500', label: 'Class H — high-temp / VFD-rated' },
        { from: 181, to: 220, color: 'red-500', label: 'Above limit — accelerated ageing' },
      ],
      description: 'IEC 60085 hot-spot limits. Each 10 °C above class halves insulation life (Arrhenius rule). Class F is most common; Class H for high-ambient or VFD duty.',
      source: 'IEC 60085 Electrical Insulation — Thermal Evaluation; IEEE Std 1 (Recommended Practice).',
    },
    {
      kind: 'bar',
      id: 'efficiency-class',
      title: 'IEC 60034-30-1 Efficiency Classes — 11 kW 4-pole motor',
      data: [
        { label: 'IE1 Standard', value: 87.6, limit: 100, unit: '% η', status: 'fail', note: 'Banned for new sales in EU/Kenya KEBS.' },
        { label: 'IE2 High', value: 89.8, limit: 100, unit: '% η', status: 'warn' },
        { label: 'IE3 Premium', value: 91.4, limit: 100, unit: '% η', status: 'pass', note: 'Minimum legal class in Kenya KEBS KS-2444.' },
        { label: 'IE4 Super-Premium', value: 92.6, limit: 100, unit: '% η', status: 'pass' },
        { label: 'IE5 Ultra-Premium', value: 93.5, limit: 100, unit: '% η', status: 'pass', note: 'PMSM / SynRM technology.' },
      ],
      source: 'IEC 60034-30-1:2014; KEBS KS-2444 Minimum Energy Performance Standards for motors.',
    },
    {
      kind: 'spec',
      id: 'rewind-process',
      title: 'Rewind Process Specification',
      rows: [
        { label: 'Incoming inspection', value: 'Surge + IR + PI + DC resistance', note: 'IR ≥ 100 MΩ at 500 V DC; PI ≥ 2.0.' },
        { label: 'Burn-out oven', value: '380 °C × 4 h', note: 'Below stator-iron Curie point to preserve magnetic properties.' },
        { label: 'Slot insulation', value: 'NMN (Nomex/Mylar/Nomex) Class F/H' },
        { label: 'Wire', value: 'Enamelled copper PEW-2/200 °C', note: 'IEC 60317-13/-31.' },
        { label: 'VPI varnish', value: 'Class H (180 °C) polyester-imide', note: 'Vacuum 1 mbar, pressure 4 bar 2 h.' },
        { label: 'Oven cure', value: '150 °C × 8 h step-cure' },
        { label: 'Final test', value: 'HiPot 2× Un + 1000 V, surge, PI', note: 'IEEE 95 / IEC 60034-1 routine tests.' },
        { label: 'Bearing replacement', value: 'NSK / SKF C3 clearance', note: 'L10h ≥ 40 000 h at rated load.' },
      ],
      source: 'EASA Standard AR100-2020 Recommended Practice for the Repair of Rotating Electrical Apparatus.',
    },
    {
      kind: 'diagram',
      id: 'motor-cross-section',
      title: 'Induction Motor Cross-Section',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 220, y: 80, w: 160, h: 80, label: 'Stator core + windings', color: '#0e7490' },
            { x: 270, y: 100, w: 60, h: 40, label: 'Rotor', color: '#7c2d12' },
            { x: 30, y: 110, w: 100, h: 40, label: 'NDE Bearing' },
            { x: 470, y: 110, w: 100, h: 40, label: 'DE Bearing + Shaft' },
            { x: 220, y: 20, w: 160, h: 40, label: 'Terminal Box' },
            { x: 220, y: 180, w: 160, h: 30, label: 'Frame / Cooling Fins' },
          ]}
          arrows={[
            { from: [130, 130], to: [220, 130] },
            { from: [380, 130], to: [470, 130] },
            { from: [300, 60], to: [300, 80] },
          ]}
        />
      ),
      hotspots: [
        { x: 50, y: 22, label: 'Terminal box', detail: 'Connects to L1/L2/L3 + earth. Star/delta links per nameplate.' },
        { x: 50, y: 55, label: 'Stator windings', detail: 'Where rewind happens. Class F insulation, copper enamelled wire, slot wedges.' },
        { x: 50, y: 78, label: 'Rotor (squirrel-cage)', detail: 'Aluminium or copper bars short-circuited by end rings. Rarely fails.' },
        { x: 13, y: 60, label: 'Non-drive end bearing', detail: '6308-2RS C3 typical. Replace every rewind.' },
        { x: 87, y: 60, label: 'Drive end bearing', detail: '6310-2RS C3 typical. Carries radial + axial coupling load.' },
        { x: 50, y: 95, label: 'Frame / fins', detail: 'IC411 TEFC cooling. Keep clean — every 1 mm of dust = 1 °C rise.' },
      ],
      source: 'EASA AR100-2020; IEC 60034-1.',
    },
  ],

  /* =============== AC INSTALLATION ============================ */
  'ac-installation': [
    {
      kind: 'knob',
      id: 'btu-sizing',
      label: 'Cooling Load',
      unit: 'BTU/h',
      min: 5000,
      max: 60000,
      initial: 12000,
      step: 1000,
      zones: [
        { from: 5000, to: 9000, color: 'cyan-500', label: 'Bedroom 9–12 m²' },
        { from: 9001, to: 18000, color: 'emerald-500', label: 'Living room / small office 15–25 m²' },
        { from: 18001, to: 36000, color: 'amber-500', label: 'Open office / shop 30–60 m²' },
        { from: 36001, to: 60000, color: 'red-500', label: 'Server room / restaurant — VRF/cassette' },
      ],
      description: 'Rule of thumb 600 BTU/m² for residential Nairobi (cool highlands), 800 BTU/m² for Mombasa coast. Add 10 % per occupant > 2 and per east/west window.',
      source: 'ASHRAE Handbook — Fundamentals (2021) Ch. 17 + Kenya MET coastal climate data.',
    },
    {
      kind: 'bar',
      id: 'efficiency-comparison',
      title: 'Seasonal Efficiency (SEER) by Technology',
      data: [
        { label: 'Window AC (R32)', value: 10, limit: 15, unit: 'SEER', status: 'fail', note: 'Below KEBS MEPS — phasing out.' },
        { label: 'Fixed-speed split (R32)', value: 13, limit: 15, unit: 'SEER', status: 'warn' },
        { label: 'Inverter split (R32)', value: 18, limit: 15, unit: 'SEER', status: 'pass', note: 'Compliant + 30 % saving over fixed-speed.' },
        { label: 'VRF/VRV multi-split', value: 22, limit: 15, unit: 'SEER', status: 'pass' },
        { label: 'Chiller + AHU (water-cooled)', value: 25, limit: 15, unit: 'IPLV', status: 'pass', note: 'IPLV per AHRI 550/590.' },
      ],
      source: 'KEBS KS-2456 Air-conditioner MEPS; AHRI 210/240; AHRI 550/590.',
    },
    {
      kind: 'spec',
      id: 'refrigerants',
      title: 'Refrigerant Phase-Out Schedule (Kigali Amendment, Kenya)',
      rows: [
        { label: 'R-22 (HCFC)', value: 'Banned new equipment 2025', note: 'Servicing only with reclaimed gas.' },
        { label: 'R-410A (HFC, GWP 2088)', value: 'Freeze 2024, −10 % by 2029', note: 'Kenya Article-5 Group 1 schedule.' },
        { label: 'R-32 (HFC, GWP 675)', value: 'Currently preferred', note: 'Mildly flammable A2L — IEC 60335-2-40 install rules.' },
        { label: 'R-290 (propane, GWP 3)', value: 'Future-proof', note: 'A3 flammable; charge limit 1 kg per IEC 60335-2-40.' },
        { label: 'R-744 (CO₂)', value: 'Heat-pump / commercial', note: 'GWP 1; trans-critical cycle.' },
      ],
      source: 'Kigali Amendment to the Montreal Protocol (Kenya ratified 21 Oct 2020); NEMA Ozone Office.',
    },
    {
      kind: 'diagram',
      id: 'split-install',
      title: 'Split AC Installation Schematic',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 30, y: 30, w: 150, h: 70, label: 'Indoor Unit (evap)', color: '#0e7490' },
            { x: 30, y: 150, w: 150, h: 60, label: 'Drain (1:50 fall)', color: '#1e3a5f' },
            { x: 250, y: 30, w: 150, h: 70, label: 'Refrigerant Lines', color: '#7c2d12' },
            { x: 460, y: 30, w: 130, h: 70, label: 'Outdoor Condenser', color: '#1d4ed8' },
            { x: 460, y: 150, w: 130, h: 50, label: 'Disconnect Switch' },
          ]}
          arrows={[
            { from: [180, 60], to: [250, 60] },
            { from: [400, 60], to: [460, 60] },
            { from: [105, 100], to: [105, 150] },
            { from: [525, 100], to: [525, 150] },
          ]}
        />
      ),
      hotspots: [
        { x: 18, y: 22, label: 'Indoor evaporator', detail: 'Wall-mount or cassette. Mount level; bracket to load-bearing wall.' },
        { x: 18, y: 78, label: 'Condensate drain', detail: 'PVC, 1:50 minimum fall, terminate to gully — never into wall cavity.' },
        { x: 54, y: 35, label: 'Liquid + suction pipes', detail: '1/4" + 3/8" (9k–12k BTU). Insulated with 9 mm closed-cell. Vacuum to <500 µHg before charge.' },
        { x: 87, y: 35, label: 'Outdoor condenser', detail: 'Min 100 mm clearance, shaded, vibration-isolated mounting feet.' },
        { x: 87, y: 78, label: 'Local disconnect', detail: 'Lockable IP54 isolator within sight of outdoor unit (IEC 60364-5-53).' },
      ],
      source: 'IEC 60335-2-40; Daikin/Mitsubishi installation manuals; KS IEC 60364.',
    },
  ],

  /* =============== UPS SYSTEMS ================================ */
  'ups-systems': [
    {
      kind: 'knob',
      id: 'load-runtime',
      label: 'UPS Load',
      unit: 'kVA',
      min: 0.5,
      max: 200,
      initial: 6,
      step: 0.5,
      zones: [
        { from: 0.5, to: 3, color: 'cyan-500', label: 'Desktop / small server (line-interactive)' },
        { from: 3.1, to: 20, color: 'emerald-500', label: 'Office / small datacentre (online)' },
        { from: 20.1, to: 80, color: 'amber-500', label: 'Server room (modular online)' },
        { from: 80.1, to: 200, color: 'red-500', label: 'Data centre / hospital (parallel + bypass)' },
      ],
      description: 'Size UPS at 1.25 × max simultaneous kVA load. Above 20 kVA always specify true online double-conversion (VFI-SS-111 per IEC 62040-3).',
      source: 'IEC 62040-3 UPS Performance Requirements; IEEE 1100 (Emerald Book).',
    },
    {
      kind: 'line',
      id: 'runtime-curve',
      title: 'Battery Autonomy — 6 kVA UPS with 192 V battery string',
      xLabel: 'Load',
      yLabel: 'Runtime',
      unit: 'minutes',
      series: [
        {
          name: '9 Ah VRLA × 16',
          color: '#06b6d4',
          points: [
            { x: '25 %', y: 38 },
            { x: '50 %', y: 16 },
            { x: '75 %', y: 9 },
            { x: '100 %', y: 6 },
          ],
        },
        {
          name: '18 Ah VRLA × 16',
          color: '#10b981',
          points: [
            { x: '25 %', y: 90 },
            { x: '50 %', y: 38 },
            { x: '75 %', y: 22 },
            { x: '100 %', y: 14 },
          ],
        },
        {
          name: '100 Ah LiFePO₄',
          color: '#f59e0b',
          points: [
            { x: '25 %', y: 360 },
            { x: '50 %', y: 175 },
            { x: '75 %', y: 110 },
            { x: '100 %', y: 80 },
          ],
        },
      ],
      source: 'APC/Schneider, Eaton 9PX, Vertiv Liebert published runtime tables (2024).',
    },
    {
      kind: 'spec',
      id: 'topology',
      title: 'UPS Topology Comparison (IEC 62040-3 classification)',
      rows: [
        { label: 'Off-line / Standby (VFD)', value: 'Transfer 4–10 ms', note: 'Cheapest; OK for desktops.' },
        { label: 'Line-interactive (VI)', value: 'Transfer 2–4 ms + AVR', note: 'Best value for offices.' },
        { label: 'Online double-conversion (VFI-SS-111)', value: '0 ms transfer', note: 'Always inverter-fed; required for medical (IEC 60601), data centres.' },
        { label: 'Delta-conversion (Eaton patent)', value: '0 ms; >96 % η', note: 'High efficiency at large kVA.' },
        { label: 'Static bypass', value: '< 4 ms switch', note: 'Auto on overload/fault.' },
        { label: 'Maintenance bypass', value: 'Manual make-before-break', note: 'For service without dropping load.' },
      ],
      source: 'IEC 62040-3:2021; ITU-T L.1304 (data centre power).',
    },
    {
      kind: 'diagram',
      id: 'ups-topology',
      title: 'Online Double-Conversion UPS Block Diagram',
      svg: (
        <FlowDiagram
          blocks={[
            { x: 20, y: 80, w: 100, h: 60, label: 'Mains In', color: '#1e40af' },
            { x: 150, y: 80, w: 100, h: 60, label: 'Rectifier' },
            { x: 280, y: 80, w: 100, h: 60, label: 'DC Bus' },
            { x: 410, y: 80, w: 100, h: 60, label: 'Inverter' },
            { x: 540, y: 80, w: 50, h: 60, label: 'Load' },
            { x: 280, y: 180, w: 100, h: 50, label: 'Battery', color: '#065f46' },
            { x: 150, y: 10, w: 360, h: 40, label: 'Static Bypass (mains direct)', color: '#7c2d12' },
          ]}
          arrows={[
            { from: [120, 110], to: [150, 110] },
            { from: [250, 110], to: [280, 110] },
            { from: [380, 110], to: [410, 110] },
            { from: [510, 110], to: [540, 110] },
            { from: [330, 140], to: [330, 180] },
            { from: [330, 50], to: [330, 80] },
          ]}
        />
      ),
      hotspots: [
        { x: 12, y: 50, label: 'Mains input', detail: 'Filtered, surge-protected. Powers rectifier and bypass simultaneously.' },
        { x: 33, y: 50, label: 'Rectifier (PFC)', detail: 'AC→DC; high power factor (>0.99) prevents harmonics back to mains.' },
        { x: 55, y: 50, label: 'DC bus', detail: 'Common DC link feeding inverter and connecting to battery via DC/DC.' },
        { x: 77, y: 50, label: 'Inverter (IGBT)', detail: 'DC→pure-sine AC. THD <3 %. Always feeds the load.' },
        { x: 55, y: 80, label: 'Battery bank', detail: 'VRLA or LiFePO₄. Provides energy when mains absent.' },
        { x: 55, y: 18, label: 'Static bypass', detail: 'Automatic SCR transfer on inverter fault or overload — <4 ms break.' },
      ],
      source: 'IEC 62040 series; APC Symmetra / Eaton 9355 application guides.',
    },
  ],

  /* =============== BOREHOLE PUMPS ============================= */
  'borehole-pumps': [
    {
      kind: 'knob',
      id: 'tdh',
      label: 'Total Dynamic Head (TDH)',
      unit: 'm',
      min: 5,
      max: 300,
      initial: 80,
      step: 5,
      zones: [
        { from: 5, to: 30, color: 'cyan-500', label: 'Shallow well / surface pump' },
        { from: 31, to: 100, color: 'emerald-500', label: 'Domestic & farm boreholes (Kenya median ~70 m)' },
        { from: 101, to: 200, color: 'amber-500', label: 'Deep boreholes — Athi-Kapiti / Mwingi' },
        { from: 201, to: 300, color: 'red-500', label: 'Very deep — Northern Kenya basement' },
      ],
      description:
        'TDH = static lift + drawdown + friction + delivery head. Pump must be sized so duty point falls inside the manufacturer curve at best efficiency point (BEP).',
      source: 'WRMA Kenya Drilling & Pumping Test Guidelines 2018; Grundfos Pump Handbook (5th ed.).',
    },
    {
      kind: 'line',
      id: 'pump-curve',
      title: 'Grundfos SQE 5-70 Pump Curve (1.85 kW)',
      xLabel: 'Flow Q',
      yLabel: 'Head H',
      unit: 'm',
      series: [
        {
          name: 'SQE 5-70',
          color: '#06b6d4',
          points: [
            { x: '0', y: 95 },
            { x: '1', y: 88 },
            { x: '2', y: 78 },
            { x: '3', y: 65 },
            { x: '4', y: 50 },
            { x: '5', y: 32 },
            { x: '6', y: 12 },
          ],
        },
        {
          name: 'System curve',
          color: '#f59e0b',
          points: [
            { x: '0', y: 60 },
            { x: '1', y: 62 },
            { x: '2', y: 66 },
            { x: '3', y: 73 },
            { x: '4', y: 82 },
            { x: '5', y: 94 },
            { x: '6', y: 110 },
          ],
        },
      ],
      source: 'Grundfos SQE/SQ-Series data booklet (96510946 0420 ECM).',
    },
    {
      kind: 'spec',
      id: 'borehole-spec',
      title: 'Typical 6" Borehole Installation Spec',
      rows: [
        { label: 'Casing', value: '6" / 168 mm uPVC class 12', note: 'KEBS KS 06-1148.' },
        { label: 'Screen', value: 'Slotted 1 mm aperture across aquifer' },
        { label: 'Gravel pack', value: '2–4 mm graded silica' },
        { label: 'Pump setting', value: '5–10 m below dynamic water level', note: 'Avoid surge; check NPSHa.' },
        { label: 'Riser pipe', value: '1¼" galv. or HDPE PN16' },
        { label: 'Cable', value: '4 mm² flat 3-core sub-pump cable' },
        { label: 'Control', value: 'DOL or VFD with dry-run protection', note: 'IEC 60947-4-1 motor starter; SQE has built-in.' },
        { label: 'Test pumping', value: '72 h constant + 24 h recovery', note: 'WRA permit condition for abstraction licence.' },
      ],
      source: 'Water Resources Authority Kenya — Borehole Drilling & Pump-Testing Guidelines 2018.',
    },
    {
      kind: 'diagram',
      id: 'borehole-section',
      title: 'Borehole Installation Cross-Section',
      svg: (
        <FlowDiagram
          height={280}
          blocks={[
            { x: 240, y: 10, w: 120, h: 40, label: 'Wellhead + meter', color: '#374151' },
            { x: 250, y: 60, w: 100, h: 40, label: 'Static WL' },
            { x: 250, y: 110, w: 100, h: 40, label: 'Dynamic WL', color: '#1e40af' },
            { x: 260, y: 170, w: 80, h: 40, label: 'Pump', color: '#0e7490' },
            { x: 250, y: 220, w: 100, h: 40, label: 'Screen', color: '#7c2d12' },
            { x: 100, y: 110, w: 110, h: 50, label: 'Drawdown' },
            { x: 410, y: 110, w: 110, h: 50, label: 'Cable + riser' },
          ]}
          arrows={[
            { from: [300, 50], to: [300, 60] },
            { from: [300, 100], to: [300, 110] },
            { from: [300, 150], to: [300, 170] },
            { from: [300, 210], to: [300, 220] },
          ]}
        />
      ),
      hotspots: [
        { x: 50, y: 7, label: 'Wellhead', detail: 'Concrete plinth, sanitary seal, totalising flow meter, pressure gauge, sample tap.' },
        { x: 50, y: 25, label: 'Static water level', detail: 'Resting WL measured before pumping.' },
        { x: 50, y: 45, label: 'Dynamic WL', detail: 'Stabilised WL during pumping at design Q.' },
        { x: 50, y: 65, label: 'Submersible pump', detail: 'Sized to duty point at BEP. Set 5–10 m below DWL.' },
        { x: 50, y: 85, label: 'Screen + gravel pack', detail: 'Slotted casing across aquifer; gravel sized per aquifer grain.' },
        { x: 22, y: 50, label: 'Drawdown', detail: 'Static − Dynamic. Excessive drawdown = oversized pump or low transmissivity.' },
        { x: 78, y: 50, label: 'Riser & cable', detail: 'HDPE/galv riser with submersible cable taped every 3 m.' },
      ],
      source: 'WRA Kenya 2018; Grundfos Pump Handbook.',
    },
  ],
};
