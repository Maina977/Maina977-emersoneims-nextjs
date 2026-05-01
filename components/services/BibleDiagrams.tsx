'use client';

/**
 * BibleDiagrams — hand-authored SVG schematics referenced by id from
 * serviceBibles.ts. Drawn to teach, not to scale. Each diagram is a
 * compact engineering schematic that renders crisply on dark backgrounds.
 */

import type { ReactNode } from 'react';

const DARK = '#0f172a';
const STROKE = '#e2e8f0';
const ACCENT = '#22d3ee';
const HOT = '#f97316';
const COOL = '#38bdf8';
const NEUTRAL = '#94a3b8';
const GREEN = '#22c55e';
const YELLOW = '#facc15';

interface Frame {
  title: string;
  caption: string;
  children: ReactNode;
  viewBox?: string;
}

function DiagramFrame({ title, caption, children, viewBox = '0 0 800 460' }: Frame) {
  return (
    <figure className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/70">
        <h4 className="text-sm font-semibold text-cyan-300">{title}</h4>
      </div>
      <div className="p-4 bg-slate-950">
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          role="img"
          aria-label={title}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100%" height="100%" fill={DARK} />
          {children}
        </svg>
      </div>
      <figcaption className="px-4 py-3 text-xs text-slate-400 bg-slate-900/40 border-t border-slate-800">
        {caption}
      </figcaption>
    </figure>
  );
}

function Box({ x, y, w, h, label, fill = '#1e293b', stroke = STROKE }: {
  x: number; y: number; w: number; h: number; label: string; fill?: string; stroke?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" rx="6" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill={STROKE} fontSize="13" fontWeight="600">
        {label}
      </text>
    </g>
  );
}

function Wire({ d, color = STROKE, dashed = false, label, lx, ly }: {
  d: string; color?: string; dashed?: boolean; label?: string; lx?: number; ly?: number;
}) {
  return (
    <g>
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeDasharray={dashed ? '6 4' : undefined} />
      {label && lx != null && ly != null && (
        <text x={lx} y={ly} fontSize="10" fill={NEUTRAL}>{label}</text>
      )}
    </g>
  );
}

function Node({ cx, cy, r = 4, color = ACCENT }: { cx: number; cy: number; r?: number; color?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={color} />;
}

// ── DIAGRAMS ───────────────────────────────────────────────────────────────────

function GenSingleLine() {
  return (
    <DiagramFrame
      title="Genset Single-Line — Utility / ATS / Critical Loads"
      caption="Standard standby topology: utility and genset feed an automatic transfer switch, which routes power to a main distribution board split into critical (essential) and non-critical busbars."
    >
      <Box x={40} y={40} w={140} h={60} label="UTILITY" fill="#1e3a8a" />
      <Box x={40} y={140} w={140} h={60} label="GENSET" fill="#7c2d12" />
      <Wire d="M180,70 H300" color={COOL} />
      <Wire d="M180,170 H300" color={HOT} />
      <Box x={300} y={100} w={120} h={60} label="ATS" fill="#1f2937" />
      <Wire d="M420,130 H520" />
      <Box x={520} y={100} w={140} h={60} label="MAIN DB" />
      <Wire d="M660,115 H760" label="Critical" lx={680} ly={108} />
      <Wire d="M660,145 H760" label="Non-critical" lx={680} ly={138} />
      <Box x={700} y={70} w={80} h={36} label="UPS+IT" fill="#0f766e" />
      <Box x={700} y={130} w={80} h={36} label="Lights" fill="#1f2937" />
      <Box x={700} y={190} w={80} h={36} label="HVAC" fill="#1f2937" />
      <Wire d="M660,205 H700" />
      <Box x={300} y={260} w={120} h={50} label="EARTH BAR" fill="#064e3b" />
      <Wire d="M360,200 V260" color={GREEN} dashed />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Cabling sized per BS 7671 / IEC 60364 — voltage drop ≤ 3% to MDB, ≤ 5% to final circuit.
      </text>
    </DiagramFrame>
  );
}

function GenFuelSystem() {
  return (
    <DiagramFrame
      title="Diesel Fuel System — Tank to Injector"
      caption="Bulk tank feeds day tank via transfer pump; primary water-separating filter, lift pump, secondary fine filter, then high-pressure injection."
    >
      <Box x={30} y={200} w={120} h={60} label="BULK TANK" fill="#1f2937" />
      <Box x={210} y={200} w={120} h={60} label="DAY TANK" fill="#1f2937" />
      <Wire d="M150,230 H210" />
      <Box x={170} y={260} w={40} h={26} label="P" fill="#0e7490" />
      <text x={155} y={300} fontSize="10" fill={NEUTRAL}>Transfer pump</text>
      <Box x={360} y={200} w={100} h={60} label="PRIMARY FILTER" fill="#1f2937" />
      <Wire d="M330,230 H360" />
      <Box x={490} y={200} w={70} h={60} label="LIFT" fill="#0e7490" />
      <Wire d="M460,230 H490" />
      <Box x={590} y={200} w={120} h={60} label="SECONDARY FILTER" fill="#1f2937" />
      <Wire d="M560,230 H590" />
      <Wire d="M710,230 H760" />
      <Box x={580} y={100} w={130} h={60} label="INJECTION PUMP" fill="#7c2d12" />
      <Wire d="M650,200 V160" color={HOT} />
      <Box x={580} y={20} w={130} h={50} label="INJECTORS" fill="#7c2d12" />
      <Wire d="M650,100 V70" color={HOT} />
      <text x={30} y={420} fontSize="11" fill={NEUTRAL}>
        Primary filter typically 30 µm with water trap; secondary 2–10 µm. Common-rail systems
        require strict cleanliness — even 4-µm contamination can scrap injectors.
      </text>
    </DiagramFrame>
  );
}

function GenCoolingLoop() {
  return (
    <DiagramFrame
      title="Engine Cooling Loop — Closed-Circuit"
      caption="Coolant flows from engine block to thermostat housing; below 82 °C bypass returns to pump, above setpoint flows through radiator to reject heat."
    >
      <Box x={60} y={180} w={160} h={100} label="ENGINE BLOCK" fill="#7c2d12" />
      <Box x={300} y={200} w={120} h={60} label="THERMOSTAT" fill="#1f2937" />
      <Wire d="M220,210 H300" color={HOT} />
      <Box x={500} y={120} w={160} h={80} label="RADIATOR" fill="#1e3a8a" />
      <Wire d="M420,220 C460,220 480,170 500,160" color={HOT} />
      <Wire d="M580,200 V320 H260 V280" color={COOL} />
      <Box x={220} y={320} w={120} h={50} label="WATER PUMP" fill="#0e7490" />
      <Wire d="M280,320 V280" color={COOL} />
      <Box x={420} y={20} w={120} h={50} label="EXPANSION TANK" fill="#1f2937" />
      <Wire d="M480,200 V70" dashed />
      <text x={60} y={420} fontSize="11" fill={NEUTRAL}>
        Maintain 50/50 ethylene-glycol–water mix; pressure cap 90–110 kPa.
        Coolant pH 8.5–10.5 — drift triggers liner pitting via cavitation.
      </text>
    </DiagramFrame>
  );
}

function ATSWiring() {
  return (
    <DiagramFrame
      title="Automatic Transfer Switch — Wiring Sequence"
      caption="Open-transition ATS: detects utility loss → starts genset → transfers load after stable voltage/frequency confirmed (typically 10–30 s)."
    >
      <Box x={40} y={40} w={150} h={60} label="UTILITY 415 V" fill="#1e3a8a" />
      <Box x={40} y={300} w={150} h={60} label="GENSET 415 V" fill="#7c2d12" />
      <Box x={300} y={170} w={180} h={120} label="ATS CONTROLLER" fill="#1f2937" />
      <Wire d="M190,70 H300" color={COOL} />
      <Wire d="M190,330 H300" color={HOT} />
      <Box x={300} y={40} w={120} h={50} label="UTIL CONTACTOR" fill="#1f2937" />
      <Wire d="M360,90 V170" />
      <Box x={300} y={350} w={120} h={50} label="GEN CONTACTOR" fill="#1f2937" />
      <Wire d="M360,290 V350" />
      <Wire d="M480,230 H600" />
      <Box x={600} y={200} w={160} h={60} label="LOAD BUSBAR" />
      <Wire d="M680,260 V310" />
      <Box x={620} y={310} w={120} h={50} label="MDB" fill="#1f2937" />
      <text x={520} y={140} fontSize="11" fill={YELLOW}>
        Mechanical interlock prevents both contactors closing simultaneously.
      </text>
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Sense voltage 80–110% nominal · frequency 47–52 Hz · transfer delay 1–10 s · retransfer 5–30 min cool-down.
      </text>
    </DiagramFrame>
  );
}

function GenGrounding() {
  return (
    <DiagramFrame
      title="Genset Grounding — Bonded Neutral (TN-S)"
      caption="Genset frame and neutral are bonded at one point only (separately-derived source); local earth electrode bonded to building MET via earth conductor."
    >
      <Box x={60} y={120} w={180} h={100} label="GENSET ALTERNATOR" fill="#7c2d12" />
      <Wire d="M120,220 V300" color="#fb7185" />
      <Wire d="M180,220 V300" color="#facc15" />
      <Wire d="M240,220 V300" color={COOL} />
      <text x={120} y={314} fontSize="11" fill={NEUTRAL}>L1</text>
      <text x={180} y={314} fontSize="11" fill={NEUTRAL}>L2</text>
      <text x={240} y={314} fontSize="11" fill={NEUTRAL}>L3</text>
      <Wire d="M150,220 V270 H300 V310" color="#a3e635" />
      <text x={310} y={310} fontSize="11" fill={GREEN}>N + PE bond</text>
      <Box x={420} y={200} w={140} h={60} label="MAIN EARTH BAR" fill="#064e3b" />
      <Wire d="M350,310 H490 V260" color={GREEN} dashed />
      <Wire d="M490,260 V330" color={GREEN} dashed />
      <Box x={460} y={330} w={70} h={40} label="EARTH ROD" fill="#064e3b" />
      <text x={60} y={420} fontSize="11" fill={NEUTRAL}>
        Earth resistance target ≤ 1 Ω for medical / data-centre, ≤ 5 Ω general.
        Test by fall-of-potential method annually.
      </text>
    </DiagramFrame>
  );
}

function MdbLayout() {
  return (
    <DiagramFrame
      title="Main Distribution Board — Internal Layout"
      caption="Incoming MCCB → ammeter/voltmeter → main busbars → outgoing ways with discrimination-coordinated MCBs/RCBOs."
    >
      <Box x={40} y={40} w={120} h={60} label="INCOMING MCCB" fill="#1e3a8a" />
      <Wire d="M160,70 H260" />
      <Box x={260} y={40} w={120} h={60} label="METERING" fill="#1f2937" />
      <Wire d="M380,70 H520" />
      <Box x={520} y={40} w={140} h={60} label="MAIN BUSBARS" fill="#0e7490" />
      <Wire d="M590,100 V160" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Box x={120 + i * 130} y={180} w={100} h={50} label={`MCB-${i + 1}`} fill="#1f2937" />
          <Wire d={`M${170 + i * 130},230 V300`} />
          <text x={170 + i * 130} y={320} fontSize="10" fill={NEUTRAL} textAnchor="middle">
            Outgoing way
          </text>
        </g>
      ))}
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Cascade ratings ensure upstream device clears before downstream MCB welds — verified
        against manufacturer let-through curves (Type-2 coordination preferred for motors).
      </text>
    </DiagramFrame>
  );
}

function PvSystem() {
  return (
    <DiagramFrame
      title="PV System — Grid-Tie with Storage"
      caption="String of panels → DC isolator → MPPT inverter → AC isolator → import/export meter → distribution board → load and grid."
    >
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={40 + i * 50} y={40} width="40" height="80" fill="#1e3a8a" stroke={STROKE} />
        ))}
        <text x={130} y={150} textAnchor="middle" fontSize="11" fill={NEUTRAL}>PV STRING</text>
      </g>
      <Wire d="M240,80 H300" color={YELLOW} />
      <Box x={300} y={60} w={90} h={40} label="DC ISO" fill="#1f2937" />
      <Wire d="M390,80 H460" color={YELLOW} />
      <Box x={460} y={50} w={130} h={60} label="MPPT INVERTER" fill="#7c2d12" />
      <Wire d="M590,80 H660" color={HOT} />
      <Box x={660} y={60} w={90} h={40} label="AC ISO" fill="#1f2937" />
      <Wire d="M750,80 V200" color={HOT} />
      <Box x={660} y={200} w={120} h={50} label="METER" fill="#0e7490" />
      <Wire d="M720,250 V310" />
      <Box x={620} y={310} w={160} h={50} label="DB / LOAD" />
      <Box x={460} y={300} w={130} h={60} label="BATTERY BANK" fill="#064e3b" />
      <Wire d="M520,300 V110" color={GREEN} dashed />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Hybrid inverter manages PV / battery / grid priorities; DC isolator MUST be inside
        and outside the building per IEC 60364-7-712.
      </text>
    </DiagramFrame>
  );
}

function MpptStrings() {
  return (
    <DiagramFrame
      title="MPPT String Sizing — Series vs Parallel"
      caption="Voc(stc) × N_series × 1.25 must remain below inverter max DC. Isc(stc) × 1.25 sets parallel-string fuse rating."
    >
      <text x={40} y={40} fontSize="13" fill={ACCENT}>SERIES (sums voltage)</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 70} y={60} width="60" height="40" fill="#1e3a8a" stroke={STROKE} />
      ))}
      <Wire d="M40,80 H30 V160 H400" color={YELLOW} />
      <text x={40} y={200} fontSize="13" fill={ACCENT}>PARALLEL (sums current)</text>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={40 + i * 70} y={220 + row * 55} width="60" height="40" fill="#1e3a8a" stroke={STROKE} />
          ))}
        </g>
      ))}
      <Wire d="M40,240 H30 V395 H400" color={YELLOW} />
      <Wire d="M40,295 H30" color={YELLOW} />
      <Wire d="M40,350 H30" color={YELLOW} />
      <text x={500} y={240} fontSize="11" fill={NEUTRAL}>V = N × Vmpp</text>
      <text x={500} y={260} fontSize="11" fill={NEUTRAL}>I = Imp (single string)</text>
      <text x={500} y={310} fontSize="11" fill={NEUTRAL}>V = Vmpp</text>
      <text x={500} y={330} fontSize="11" fill={NEUTRAL}>I = N × Imp</text>
    </DiagramFrame>
  );
}

function BatteryBank() {
  return (
    <DiagramFrame
      title="Battery Bank — Series-Parallel Wiring"
      caption="48 V bank from 4 × 12 V batteries in series; capacity scales by adding identical strings in parallel. Always use cells of identical age, model, and SOC."
    >
      {[0, 1].map((row) => (
        <g key={row}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} x={60 + i * 150} y={80 + row * 140} w={120} h={70} label={`12V #${row * 4 + i + 1}`} fill="#1f2937" />
          ))}
          <Wire d={`M180,${115 + row * 140} H210`} color={HOT} />
          <Wire d={`M330,${115 + row * 140} H360`} color={HOT} />
          <Wire d={`M480,${115 + row * 140} H510`} color={HOT} />
        </g>
      ))}
      <Wire d="M60,115 V255" color={COOL} />
      <Wire d="M630,115 V255" color={HOT} />
      <Wire d="M60,255 V395" color={COOL} />
      <Wire d="M630,255 V395" color={HOT} />
      <Box x={60} y={395} w={570} h={40} label="DC BUSBAR — to MPPT / Inverter" fill="#0e7490" />
      <text x={40} y={50} fontSize="11" fill={NEUTRAL}>
        Series strings increase voltage; parallel strings multiply Ah.
      </text>
    </DiagramFrame>
  );
}

function MotorCrossSection() {
  return (
    <DiagramFrame
      title="3-Phase Induction Motor — Cross-Section"
      caption="Stator slots carry 3-phase windings; squirrel-cage rotor inside is induced by rotating magnetic field. Air-gap typically 0.3–0.7 mm."
    >
      <circle cx="400" cy="230" r="180" fill="#1f2937" stroke={STROKE} strokeWidth="2" />
      <circle cx="400" cy="230" r="120" fill="#0f172a" stroke={STROKE} strokeWidth="2" />
      <circle cx="400" cy="230" r="40" fill="#7c2d12" stroke={STROKE} strokeWidth="2" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = 130;
        const r2 = 175;
        return (
          <line
            key={i}
            x1={400 + r1 * Math.cos(a)}
            y1={230 + r1 * Math.sin(a)}
            x2={400 + r2 * Math.cos(a)}
            y2={230 + r2 * Math.sin(a)}
            stroke={ACCENT}
            strokeWidth="2"
          />
        );
      })}
      <text x={400} y={234} textAnchor="middle" fontSize="11" fill={STROKE}>SHAFT</text>
      <text x={400} y={130} textAnchor="middle" fontSize="11" fill={NEUTRAL}>STATOR SLOTS</text>
      <text x={400} y={345} textAnchor="middle" fontSize="11" fill={NEUTRAL}>ROTOR (cage)</text>
      <text x={40} y={430} fontSize="11" fill={NEUTRAL}>
        Slip = (ns − n) / ns. Typical 2–5% at full load. Higher slip = higher rotor I²R loss.
      </text>
    </DiagramFrame>
  );
}

function StarDelta() {
  return (
    <DiagramFrame
      title="Star (Y) vs Delta (Δ) — 3-Phase Connection"
      caption="Star starting reduces inrush by ⅓ at the cost of ⅓ torque; star-delta starter switches to delta at ~85% of full speed."
    >
      <text x={120} y={40} textAnchor="middle" fontSize="14" fill={ACCENT}>STAR (Y)</text>
      <line x1="120" y1="80" x2="120" y2="160" stroke={STROKE} strokeWidth="2" />
      <line x1="60" y1="240" x2="120" y2="160" stroke={STROKE} strokeWidth="2" />
      <line x1="180" y1="240" x2="120" y2="160" stroke={STROKE} strokeWidth="2" />
      <Node cx={120} cy={160} />
      <text x={120} y={70} textAnchor="middle" fontSize="11" fill={NEUTRAL}>U1</text>
      <text x={50} y={258} fontSize="11" fill={NEUTRAL}>V1</text>
      <text x={186} y={258} fontSize="11" fill={NEUTRAL}>W1</text>
      <text x={120} y={300} textAnchor="middle" fontSize="11" fill={GREEN}>Vphase = Vline / √3</text>
      <text x={120} y={320} textAnchor="middle" fontSize="11" fill={GREEN}>Iphase = Iline</text>
      <text x={560} y={40} textAnchor="middle" fontSize="14" fill={ACCENT}>DELTA (Δ)</text>
      <polygon points="500,80 620,80 560,180" fill="none" stroke={STROKE} strokeWidth="2" />
      <text x={500} y={70} fontSize="11" fill={NEUTRAL}>U1</text>
      <text x={620} y={70} fontSize="11" fill={NEUTRAL}>V1</text>
      <text x={560} y={200} fontSize="11" fill={NEUTRAL} textAnchor="middle">W1</text>
      <text x={560} y={300} textAnchor="middle" fontSize="11" fill={GREEN}>Vphase = Vline</text>
      <text x={560} y={320} textAnchor="middle" fontSize="11" fill={GREEN}>Iphase = Iline / √3</text>
      <text x={40} y={430} fontSize="11" fill={NEUTRAL}>
        For 400 V supply: Δ-rated motor runs delta; Y-only motor at 400 V acts as star and develops only ⅓ rated torque.
      </text>
    </DiagramFrame>
  );
}

function InsulationTest() {
  return (
    <DiagramFrame
      title="Megger / Insulation Resistance Test"
      caption="500 V or 1000 V DC applied between winding and frame for 60 s. PI = R₆₀ / R₃₀ ≥ 2 indicates dry, healthy winding."
    >
      <Box x={40} y={180} w={120} h={80} label="MEGGER 1 kV" fill="#0e7490" />
      <Wire d="M160,210 H280" color={HOT} />
      <text x={200} y={200} fontSize="11" fill={NEUTRAL}>+ Line</text>
      <Wire d="M160,240 H280" color={GREEN} dashed />
      <text x={200} y={260} fontSize="11" fill={NEUTRAL}>− Earth</text>
      <Box x={280} y={140} w={300} h={180} label="" fill="#1f2937" />
      <text x={430} y={170} textAnchor="middle" fontSize="13" fill={STROKE}>MOTOR FRAME</text>
      <circle cx="400" cy="230" r="55" fill="#0f172a" stroke={STROKE} />
      <text x={400} y={234} textAnchor="middle" fontSize="11" fill={ACCENT}>WINDING</text>
      <Wire d="M280,210 V230 H345" color={HOT} />
      <Wire d="M280,240 V310 H580 V240" color={GREEN} dashed />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Pass criteria: ≥ 1 MΩ per kV +1 (e.g. 415 V motor → ≥ 2 MΩ minimum, ideal &gt; 100 MΩ).
        Polarisation index R₆₀/R₃₀ &gt; 2.0 indicates moisture-free insulation.
      </text>
    </DiagramFrame>
  );
}

function AcRefrigerationCycle() {
  return (
    <DiagramFrame
      title="Vapour-Compression Refrigeration Cycle"
      caption="Compressor → condenser (heat rejection) → expansion valve (pressure drop) → evaporator (heat absorption) → back to compressor."
    >
      <Box x={40} y={200} w={130} h={60} label="COMPRESSOR" fill="#7c2d12" />
      <Wire d="M170,230 H280" color={HOT} />
      <text x={210} y={220} fontSize="11" fill={HOT}>High P / High T gas</text>
      <Box x={280} y={200} w={150} h={60} label="CONDENSER" fill="#1e3a8a" />
      <Wire d="M430,230 H560" color={YELLOW} />
      <text x={460} y={220} fontSize="11" fill={YELLOW}>High P liquid</text>
      <Box x={560} y={200} w={140} h={60} label="EXPANSION VALVE" fill="#1f2937" />
      <Wire d="M630,260 V340 H280" color={COOL} />
      <text x={640} y={300} fontSize="11" fill={COOL}>Low P 2-phase</text>
      <Box x={150} y={310} w={150} h={60} label="EVAPORATOR" fill="#0e7490" />
      <Wire d="M150,340 H100 V230 H40" color={COOL} />
      <text x={70} y={290} fontSize="11" fill={COOL}>Low P / Low T gas</text>
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Typical R-410A: low-side 110–125 PSI, high-side 250–275 PSI at 27 °C ambient.
        Superheat 8–12 °F · subcooling 8–14 °F.
      </text>
    </DiagramFrame>
  );
}

function ChillerSystem() {
  return (
    <DiagramFrame
      title="Water-Cooled Chiller — Plant Schematic"
      caption="Evaporator chills primary water loop; cooling tower rejects heat from condenser loop. Pumps and expansion vessels keep loops pressurised."
    >
      <Box x={40} y={180} w={140} h={80} label="CHILLER" fill="#0e7490" />
      <Box x={300} y={40} w={140} h={80} label="COOLING TOWER" fill="#1e3a8a" />
      <Wire d="M120,180 V120 H300" color={COOL} />
      <Wire d="M440,80 H560 V180" color={HOT} />
      <Box x={500} y={180} w={120} h={80} label="COND PUMP" fill="#1f2937" />
      <Wire d="M500,220 H180" color={HOT} />
      <Wire d="M180,260 H560" color={COOL} />
      <Box x={300} y={310} w={160} h={60} label="AHU / FCUs" fill="#1f2937" />
      <Wire d="M300,340 H180 V260" color={COOL} />
      <Wire d="M460,340 H620 V260" color={COOL} />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        ΔT of 5–7 °C across evaporator typical · COP target 5.5+ (water-cooled) · 3.0+ (air-cooled).
      </text>
    </DiagramFrame>
  );
}

function UpsDoubleConversion() {
  return (
    <DiagramFrame
      title="Online Double-Conversion UPS"
      caption="AC mains → rectifier (AC→DC) → battery + inverter (DC→AC) → critical load. Static bypass routes raw mains during inverter fault."
    >
      <Box x={40} y={140} w={120} h={70} label="MAINS AC" fill="#1e3a8a" />
      <Wire d="M160,175 H230" />
      <Box x={230} y={140} w={130} h={70} label="RECTIFIER" fill="#1f2937" />
      <Wire d="M360,175 H440" color={YELLOW} />
      <Box x={440} y={140} w={130} h={70} label="INVERTER" fill="#7c2d12" />
      <Wire d="M570,175 H660" />
      <Box x={660} y={140} w={120} h={70} label="LOAD" fill="#0e7490" />
      <Box x={300} y={290} w={130} h={60} label="BATTERY" fill="#064e3b" />
      <Wire d="M365,290 V210" color={GREEN} />
      <Wire d="M40,400 H80 V60 H720 V140" color={NEUTRAL} dashed />
      <text x={400} y={50} fontSize="11" fill={NEUTRAL}>STATIC BYPASS LINE (raw mains)</text>
      <text x={40} y={430} fontSize="11" fill={NEUTRAL}>
        VFI-SS-111 classified per IEC 62040-3: full input frequency, voltage, and waveform conditioning. {'<'}1 ms transfer.
      </text>
    </DiagramFrame>
  );
}

function UpsOffline() {
  return (
    <DiagramFrame
      title="Offline (Standby) UPS"
      caption="Mains feeds load directly via relay; on failure, transfer switch routes battery → inverter → load (typically 4–10 ms transfer)."
    >
      <Box x={40} y={140} w={120} h={70} label="MAINS AC" fill="#1e3a8a" />
      <Wire d="M160,175 H320" />
      <Box x={320} y={140} w={130} h={70} label="TRANSFER SW" fill="#1f2937" />
      <Wire d="M450,175 H580" />
      <Box x={580} y={140} w={140} h={70} label="LOAD" fill="#0e7490" />
      <Box x={200} y={290} w={130} h={60} label="BATTERY" fill="#064e3b" />
      <Box x={380} y={290} w={130} h={60} label="INVERTER" fill="#7c2d12" />
      <Wire d="M330,320 H380" color={GREEN} />
      <Wire d="M510,290 H530 V210" color={HOT} />
      <text x={40} y={430} fontSize="11" fill={NEUTRAL}>
        VFD per IEC 62040-3 — voltage and frequency dependent. Cheaper, but transfer time disqualifies sensitive medical / IT loads.
      </text>
    </DiagramFrame>
  );
}

function BoreholeSection() {
  return (
    <DiagramFrame
      title="Borehole Section — Casing, Screen, Pump"
      caption="Surface seal prevents contamination; casing extends to confining layer; screened section faces aquifer; gravel pack improves yield and reduces sand entry."
      viewBox="0 0 800 520"
    >
      <rect x={350} y={40} width={100} height={460} fill="#1f2937" stroke={STROKE} />
      <rect x={355} y={45} width={90} height={120} fill="#475569" />
      <text x={500} y={100} fontSize="11" fill={NEUTRAL}>Sanitary seal · grout</text>
      <rect x={355} y={170} width={90} height={170} fill="#0f172a" />
      <text x={500} y={250} fontSize="11" fill={NEUTRAL}>Plain casing (PVC / steel)</text>
      <rect x={355} y={345} width={90} height={130} fill="#0e7490" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1="365" y1={350 + i * 12} x2="435" y2={350 + i * 12} stroke="#000" strokeWidth="1" />
      ))}
      <text x={500} y={410} fontSize="11" fill={NEUTRAL}>Screen / slotted section</text>
      <rect x={340} y={340} width={10} height={140} fill="#fbbf24" />
      <rect x={450} y={340} width={10} height={140} fill="#fbbf24" />
      <text x={50} y={420} fontSize="11" fill={NEUTRAL}>Gravel pack</text>
      <rect x={385} y={400} width={30} height={70} fill="#7c2d12" stroke={STROKE} />
      <text x={500} y={450} fontSize="11" fill={ACCENT}>Submersible pump</text>
      <line x1="400" y1="400" x2="400" y2="40" stroke={COOL} strokeWidth="3" />
      <text x="410" y="40" fontSize="11" fill={COOL}>Riser pipe</text>
      <text x={350} y={20} textAnchor="middle" fontSize="12" fill={ACCENT}>Surface</text>
      <line x1="50" y1="60" x2="750" y2="60" stroke={NEUTRAL} strokeWidth="1" strokeDasharray="4 4" />
      <text x={50} y={500} fontSize="11" fill={NEUTRAL}>
        Static water level, drawdown, and yield determined by 24-hour pump test before final pump selection.
      </text>
    </DiagramFrame>
  );
}

function PumpVsd() {
  return (
    <DiagramFrame
      title="Variable-Speed Drive (VSD) Pump Control"
      caption="VSD adjusts motor frequency to maintain pressure setpoint — affinity laws give cubic energy savings vs throttling."
    >
      <Box x={40} y={140} w={140} h={70} label="3-PH SUPPLY" fill="#1e3a8a" />
      <Wire d="M180,175 H260" />
      <Box x={260} y={140} w={150} h={70} label="VSD" fill="#7c2d12" />
      <Wire d="M410,175 H520" color={HOT} />
      <Box x={520} y={140} w={130} h={70} label="PUMP MOTOR" fill="#0e7490" />
      <Box x={420} y={290} w={170} h={60} label="PRESSURE SENSOR" fill="#1f2937" />
      <Wire d="M510,290 V210" color={GREEN} dashed />
      <Wire d="M335,210 V310 H420" color={GREEN} dashed />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Affinity laws: Q ∝ N · H ∝ N² · P ∝ N³ — running at 80% speed cuts power to ≈ 50%.
      </text>
    </DiagramFrame>
  );
}

function PressureTank() {
  return (
    <DiagramFrame
      title="Bladder Pressure Tank — Piping"
      caption="Bladder tank dampens cycling between cut-in and cut-out pressures. Air pre-charge = cut-in − 0.2 bar."
    >
      <Box x={60} y={120} w={120} h={70} label="WELL / PUMP" fill="#0e7490" />
      <Wire d="M180,155 H300" />
      <Box x={300} y={120} w={120} h={70} label="CHECK VALVE" fill="#1f2937" />
      <Wire d="M420,155 H540" />
      <Box x={540} y={120} w={120} h={70} label="PRESSURE SW" fill="#1f2937" />
      <Wire d="M660,155 H760" />
      <Wire d="M600,190 V270" color={COOL} />
      <Box x={520} y={270} w={160} h={80} label="BLADDER TANK" fill="#1e3a8a" />
      <Wire d="M600,350 V400" color={COOL} />
      <text x={40} y={430} fontSize="11" fill={NEUTRAL}>
        Effective drawdown = total volume × ((P_low + P_atm) / (P_high + P_atm) − (P_low + P_atm) / (P_pre + P_atm)).
      </text>
    </DiagramFrame>
  );
}

function IncineratorTwoChamber() {
  return (
    <DiagramFrame
      title="Two-Chamber Incinerator — Air Flow"
      caption="Primary chamber: 850 °C waste gasification. Secondary: 1100 °C, 2 s residence to crack dioxins. Stack discharges cleaned flue gas."
    >
      <Box x={40} y={200} w={220} h={140} label="" fill="#7c2d12" />
      <text x={150} y={250} textAnchor="middle" fontSize="13" fill={STROKE}>PRIMARY CHAMBER</text>
      <text x={150} y={280} textAnchor="middle" fontSize="11" fill={YELLOW}>≥ 850 °C</text>
      <text x={150} y={300} textAnchor="middle" fontSize="11" fill={NEUTRAL}>Waste gasification</text>
      <Wire d="M260,260 H360" color={HOT} />
      <Box x={360} y={150} w={220} h={210} label="" fill="#dc2626" />
      <text x={470} y={210} textAnchor="middle" fontSize="13" fill={STROKE}>SECONDARY CHAMBER</text>
      <text x={470} y={235} textAnchor="middle" fontSize="11" fill={YELLOW}>≥ 1100 °C, 2 s</text>
      <text x={470} y={255} textAnchor="middle" fontSize="11" fill={NEUTRAL}>Volatile gas burnout</text>
      <Wire d="M580,200 H620 V60" color={HOT} />
      <rect x={600} y={20} width={40} height={40} fill="#475569" />
      <text x={620} y={50} textAnchor="middle" fontSize="11" fill={STROKE}>STACK</text>
      <text x={680} y={140} fontSize="11" fill={NEUTRAL}>Flue gas → scrubber → stack</text>
      <Wire d="M40,260 H10" color={ACCENT} />
      <text x={20} y={250} fontSize="11" fill={ACCENT}>Primary air</text>
      <Wire d="M360,310 H320 V400" color={ACCENT} />
      <text x={300} y={420} fontSize="11" fill={ACCENT}>Secondary air injection</text>
    </DiagramFrame>
  );
}

function CombustionAirFlow() {
  return (
    <DiagramFrame
      title="Combustion Air & Stack Draft"
      caption="Forced-draft fans push primary/secondary air; induced-draft fan creates negative pressure to draw flue gas through cleaning train and up the stack."
    >
      <Box x={40} y={200} w={140} h={70} label="FD FAN" fill="#0e7490" />
      <Wire d="M180,235 H280" color={ACCENT} />
      <Box x={280} y={200} w={150} h={70} label="INCINERATOR" fill="#7c2d12" />
      <Wire d="M430,235 H530" color={HOT} />
      <Box x={530} y={200} w={120} h={70} label="SCRUBBER" fill="#1e3a8a" />
      <Wire d="M650,235 H720" color={NEUTRAL} />
      <Box x={720} y={140} w={50} h={200} label="" fill="#475569" />
      <text x={745} y={250} textAnchor="middle" fontSize="11" fill={STROKE}>STACK</text>
      <Box x={530} y={320} w={120} h={50} label="ID FAN" fill="#0e7490" />
      <Wire d="M590,320 V270" color={NEUTRAL} dashed />
      <text x={40} y={420} fontSize="11" fill={NEUTRAL}>
        Excess air typically 50–100% (lambda ≈ 1.5–2.0) for solid waste. Higher excess wastes fuel; lower = soot and CO.
      </text>
    </DiagramFrame>
  );
}

const REGISTRY: Record<string, () => ReactNode> = {
  'gen-single-line': GenSingleLine,
  'gen-fuel-system': GenFuelSystem,
  'gen-cooling-loop': GenCoolingLoop,
  'ats-wiring': ATSWiring,
  'gen-grounding': GenGrounding,
  'mdb-layout': MdbLayout,
  'pv-system': PvSystem,
  'mppt-strings': MpptStrings,
  'battery-bank': BatteryBank,
  'motor-cross-section': MotorCrossSection,
  'star-delta': StarDelta,
  'insulation-test': InsulationTest,
  'ac-refrigeration-cycle': AcRefrigerationCycle,
  'chiller-system': ChillerSystem,
  'ups-double-conversion': UpsDoubleConversion,
  'ups-offline': UpsOffline,
  'borehole-section': BoreholeSection,
  'pump-vsd': PumpVsd,
  'pressure-tank': PressureTank,
  'incinerator-two-chamber': IncineratorTwoChamber,
  'combustion-air-flow': CombustionAirFlow,
};

export const AVAILABLE_DIAGRAMS = Object.keys(REGISTRY);

export default function BibleDiagram({ id }: { id: string }) {
  const D = REGISTRY[id];
  if (!D) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-300">
        Diagram <code>{id}</code> not registered.
      </div>
    );
  }
  return <>{D()}</>;
}
