/**
 * Electrical single-line diagram from a Solar Genius Pro design (2026-11-25).
 *
 * The diagram is built from the same values and checks as the proposal:
 *   - PV strings per MPPT, modules per string, module Voc / Isc / Pmax (datasheet);
 *   - string Voc at the site record low and 1.25 × Isc per MPPT (validate.ts,
 *     IEC 62548-1 checks cold-voc and isc-mpptN);
 *   - string fuses only as the IEC 62548-1 fusing check requires (fusing-mpptN),
 *     with its rating window;
 *   - inverter, battery and cable data with their check verdicts.
 * What the design does not determine (AC breaker rating, SPD type, isolator
 * make, earthing, grid connection details, generator changeover...) is
 * labelled TBS ("to be specified by the engineer"); nothing is invented.
 *
 * One layout model feeds every output: sldToSvg (screen) and the PDF and
 * Excel exports (proposalExport.ts), so they cannot disagree.
 */
import { validateStrings, checkCable, checkBattery, type Module, type Inverter, type Battery, type ArrayDesign, type SiteTemps, type CableRun, type Check, generatorConnectionChecks, cableStringCurrentCheck } from './validate';

export const SLD_ENGINE_VERSION = 'solar-sld 1.0.0 (2026-11-25)';
export const TBS = 'to be specified by the engineer';

export interface SldConnections {
  /** true = connected to the utility grid, false = not connected, null = not stated. */
  grid: boolean | null;
  generator: boolean | null;
  /** Rated kW from the hybrid generator data, when entered. */
  generatorRatedKw?: number;
  /** Lowest site load while the generator runs, kW (generator checks, CA-32). */
  generatorMinSiteLoadKw?: number;
  /** Generator OEM minimum load, %. */
  generatorOemMinLoadPct?: number;
  /** Whether PV can back-feed the running generator; null = not stated (refused). */
  pvCanBackfeedGenerator?: boolean | null;
}
export interface SldInput {
  reference: string;
  module: Module; inverter: Inverter; design: ArrayDesign; inverterCount: number; temps: SiteTemps;
  battery?: { data: Battery; units: number; requiredUsableAcKwh?: number };
  cables: CableRun[];
  connections?: SldConnections;
}
export interface SldBox { id: string; title: string; lines: string[]; x: number; y: number; w: number; h: number; dashed: boolean }
export interface SldWire { x1: number; y1: number; x2: number; y2: number; label?: string }
export interface SldModel {
  engineVersion: string;
  reference: string;
  title: string;
  /** False when the design checks refuse the input or the design. */
  designValid: boolean;
  width: number; height: number;
  boxes: SldBox[]; wires: SldWire[];
  legend: string;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
export const SLD_FONT = { title: 11, line: 9.5, lineHeight: 12, charWidth: 5.1 };

/** Greedy word wrap to a width in characters (long words are split). */
export function wrap(text: string, maxChars: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (let word of text.split(/\s+/).filter(Boolean)) {
    while (word.length > maxChars) { if (cur) { out.push(cur); cur = ''; } out.push(word.slice(0, maxChars)); word = word.slice(maxChars); }
    if (!cur) cur = word;
    else if (cur.length + 1 + word.length <= maxChars) cur += ` ${word}`;
    else { out.push(cur); cur = word; }
  }
  if (cur) out.push(cur);
  return out;
}

function box(id: string, title: string, text: string[], x: number, y: number, w: number, dashed = false): SldBox {
  const chars = Math.floor((w - 12) / SLD_FONT.charWidth);
  const lines = text.flatMap((t) => wrap(t, chars));
  return { id, title, lines, x, y, w, h: 26 + lines.length * SLD_FONT.lineHeight, dashed };
}
const find = (checks: Check[], id: string) => checks.find((c) => c.id === id);

export function buildSld(i: SldInput): SldModel {
  const str = validateStrings(i.module, i.inverter, i.design, i.temps);
  const checks = [...str.checks];
  const cableResults = i.cables.map((c) => ({ c, r: checkCable(c) }));
  cableResults.forEach(({ c, r }) => { checks.push(...r.checks); const sc = cableStringCurrentCheck(c, i.module, i.design); if (sc) checks.push(sc); });
  // Review of 39fa8535, M4: with the energy need blank, checkBattery (and so
  // the C-rate checks) was skipped and the preview showed valid. The C-rate
  // checks do not depend on the need, so they run on a token need; the energy
  // check itself is REFUSED as not checkable.
  const needGiven = !!i.battery && typeof i.battery.requiredUsableAcKwh === 'number' && Number.isFinite(i.battery.requiredUsableAcKwh);
  const bat = i.battery ? checkBattery(i.battery.data, i.inverter, needGiven ? (i.battery.requiredUsableAcKwh as number) : 1e-9, i.battery.units) : null;
  if (bat) {
    if (needGiven) checks.push(...bat.checks);
    else {
      checks.push(...bat.checks.filter((c) => c.id !== 'battery-energy'));
      checks.push({ id: 'battery-energy', title: 'Installed battery energy', verdict: 'REFUSE', value: NaN, limit: NaN, unit: 'kWh', marginPct: -100, formula: 'energy needed from the battery per cycle not entered', reference: 'Design input', note: 'Enter the energy needed from the battery per cycle: the battery cannot be checked without it' });
    }
  }
  // A connected generator is checked as the proposal checks it (CA-32).
  if (i.connections?.generator === true) checks.push(...generatorConnectionChecks(i.inverter, i.connections));
  const designValid = str.errors.length === 0 && !checks.some((c) => c.verdict === 'REFUSE') && cableResults.every(({ r }) => !r.errors.length) && !(bat && bat.errors.length)
    && Number.isInteger(i.inverterCount) && i.inverterCount >= 1; // M2
  const m = i.module, inv = i.inverter, N = i.design.modulesPerString;
  const cold = find(checks, 'cold-voc');
  const coldTxt = cold ? `${cold.value} V` : `not available (design check refused the input) — ${TBS}`;
  const multi = i.inverterCount > 1;

  const X = { pv: 20, fuse: 300, iso: 530, inv: 790, ac: 1030, poc: 1260 };
  const W = { pv: 250, fuse: 200, iso: 230, inv: 210, ac: 200, poc: 220 };
  const top = 70;
  const boxes: SldBox[] = [], wires: SldWire[] = [];
  let y = top;
  const rowMids: number[] = [];
  i.design.stringsPerMppt.forEach((s, k) => {
    const n = k + 1;
    const isc = find(checks, `isc-mppt${n}`), fusing = find(checks, `fusing-mppt${n}`), window = find(checks, `fuse-window-mppt${n}`);
    const pv = box(`pv-${n}`, `PV array, MPPT ${n}${multi ? ' (each inverter)' : ''}`, [
      `${s} string${s === 1 ? '' : 's'} × ${N} modules = ${s * N} modules, ${r2((s * N * m.pmaxW) / 1000)} kWp`,
      `Module: ${m.model}, ${m.pmaxW} W (datasheet ${m.datasheet})`,
      `String Voc (STC) = ${N} × ${m.vocV} V = ${r2(N * m.vocV)} V`,
      `String Voc at ${i.temps.recordLowC} °C record low = ${coldTxt} (check cold-voc)`,
      `Isc = ${m.iscA} A per string; 1.25 × Isc × ${s} = ${isc ? `${isc.value} A (check isc-mppt${n})` : TBS}`,
    ], X.pv, y, W.pv);
    let fuseLines: string[];
    if (!fusing) fuseLines = [`Not determined (design check refused the input): ${TBS}`];
    else if (window) fuseLines = [`REFUSE: no valid string-fuse rating exists (1.5 × Isc = ${window.value} A is not below the module maximum series fuse ${window.limit} A; check fuse-window-mppt${n})`];
    else if (fusing.verdict === 'WARN') fuseLines = [
      `String fuses required on both poles (IEC 62548-1, check fusing-mppt${n})`,
      `Rating I_n: above ${r2(1.5 * m.iscA)} A and at most ${r2(Math.min(2.4 * m.iscA, m.maxSeriesFuseA))} A`,
      `Voltage rating ≥ ${coldTxt} DC`,
      `Exact rating, type and holder: ${TBS}`,
    ];
    else fuseLines = [`String fuses: not required (check fusing-mppt${n}: reverse current ${fusing.value} A ≤ module maximum series fuse ${fusing.limit} A, fewer than 3 strings)`];
    const fuse = box(`fuse-${n}`, 'String overcurrent protection', fuseLines, X.fuse, y, W.fuse, !!fusing && fusing.verdict === 'PASS');
    const iso = box(`iso-${n}`, 'DC isolation and surge protection', [
      `DC switch-disconnector: rated ≥ ${coldTxt} DC and ≥ ${isc ? `${isc.value} A` : TBS} (checks cold-voc, isc-mppt${n})`,
      `Make, model and utilisation category: ${TBS}`,
      `DC SPD: need, type and rating ${TBS}; if fitted, maximum continuous voltage ≥ ${coldTxt}`,
    ], X.iso, y, W.iso);
    const rowH = Math.max(pv.h, fuse.h, iso.h);
    for (const b of [pv, fuse, iso]) { b.h = rowH; boxes.push(b); }
    const mid = y + rowH / 2;
    rowMids.push(mid);
    wires.push({ x1: X.pv + W.pv, y1: mid, x2: X.fuse, y2: mid, label: 'DC' }, { x1: X.fuse + W.fuse, y1: mid, x2: X.iso, y2: mid, label: 'DC' }, { x1: X.iso + W.iso, y1: mid, x2: X.inv, y2: mid, label: `MPPT ${n}` });
    y += rowH + 24;
  });
  const arrayBottom = y - 24;

  const totalKwp = r2((N * i.design.stringsPerMppt.reduce((a, b) => a + b, 0) * m.pmaxW * i.inverterCount) / 1000);
  const invBox = box('inverter', multi ? `Inverter × ${i.inverterCount} (identical, each as drawn)` : 'Inverter', [
    `${inv.model} (datasheet ${inv.datasheet})`,
    `${inv.acKw} kW AC each${multi ? `, ${r2(inv.acKw * i.inverterCount)} kW AC in total` : ''}; array ${totalKwp} kWp DC in total`,
    `Max DC input ${inv.maxDcV} V; MPPT range ${inv.mpptMinV}–${inv.mpptMaxV} V`,
    `${i.design.stringsPerMppt.length} of ${inv.mpptCount} MPPTs used; per MPPT max input ${inv.maxInputA} A, max Isc ${inv.maxIscA} A`,
    ...(i.battery ? [`Battery port: ${inv.batteryMaxDischargeKw !== undefined ? `discharge ${inv.batteryMaxDischargeKw} kW` : `discharge power ${TBS}`}, ${inv.batteryMaxChargeKw !== undefined ? `charge ${inv.batteryMaxChargeKw} kW` : `charge power ${TBS}`}`] : []),
  ], X.inv, top, W.inv);
  invBox.h = Math.max(invBox.h, arrayBottom - top);
  boxes.push(invBox);

  const ac = box('ac', `AC protection${multi ? ' (each inverter)' : ''}`, [
    `AC circuit breaker / isolator: rating ${TBS} (the inverter maximum AC output current, supply voltage and phases are not in the design data)`,
    `AC SPD and residual-current protection: need and type ${TBS}`,
  ], X.ac, top, W.ac);
  boxes.push(ac);
  const acMid = top + ac.h / 2;
  wires.push({ x1: X.inv + W.inv, y1: acMid, x2: X.ac, y2: acMid, label: 'AC' });

  const conn = i.connections ?? { grid: null, generator: null };
  const bus = X.poc - 15;
  const grid = conn.grid === true
    ? box('grid', 'Utility grid (point of connection)', [`Connection agreement, metering, interface protection and settings: ${TBS} and agreed with the utility`], X.poc, top, W.poc)
    : conn.grid === false
      ? box('grid', 'No grid connection', ['Stated in the design (off-grid)'], X.poc, top, W.poc)
      : box('grid', 'Grid connection', [`Whether and how the system connects to the grid: ${TBS}`], X.poc, top, W.poc, true);
  boxes.push(grid);
  const gridMid = top + grid.h / 2;
  wires.push({ x1: X.ac + W.ac, y1: acMid, x2: bus, y2: acMid }, { x1: bus, y1: Math.min(acMid, gridMid), x2: bus, y2: Math.max(acMid, gridMid) }, { x1: bus, y1: gridMid, x2: X.poc, y2: gridMid, label: 'AC' });
  let rightBottom = top + grid.h;
  if (conn.generator !== false) {
    const gy = top + grid.h + 30;
    const gen = conn.generator === true
      ? box('generator', 'Generator', [
        `Rating: ${conn.generatorRatedKw !== undefined ? `${conn.generatorRatedKw} kW (from the hybrid generator data)` : TBS}`,
        inv.generatorCompatibility ? `Inverter generator compatibility (manufacturer): "${inv.generatorCompatibility}"` : `No manufacturer generator-compatibility statement entered for the inverter: connection not confirmed; ${TBS}`,
        `Changeover / interlock and reverse-power protection: ${TBS}`,
      ], X.poc, gy, W.poc)
      : box('generator', 'Generator', [`Whether a generator is connected: ${TBS}`], X.poc, gy, W.poc, true);
    boxes.push(gen);
    const genMid = gy + gen.h / 2;
    wires.push({ x1: bus, y1: gridMid, x2: bus, y2: genMid }, { x1: bus, y1: genMid, x2: X.poc, y2: genMid, label: 'AC' });
    rightBottom = gy + gen.h;
  }

  let bottom = Math.max(arrayBottom, top + invBox.h, rightBottom);
  if (i.battery) {
    const b = i.battery.data, by = top + invBox.h + 40;
    const bv = bat ? find(bat.checks, 'battery-energy') : undefined;
    const bb = box('battery', 'Battery', [
      `${i.battery.units} × ${b.model} (datasheet ${b.datasheet})`,
      `${b.nominalKwh} kWh nominal each = ${r2(b.nominalKwh * i.battery.units)} kWh nominal`,
      `Usable DoD ${b.usableDoD}; max discharge ${b.maxDischargeC} C, max charge ${b.maxChargeC} C`,
      bv ? `Energy check: ${bv.verdict} (${bv.value} kWh installed vs ${bv.limit} kWh required)` : 'Energy check: not run (energy needed per cycle not given)',
      `Battery DC voltage, DC breaker / fuse and cable: ${TBS}`,
    ], X.inv, by, W.inv);
    boxes.push(bb);
    wires.push({ x1: X.inv + W.inv / 2, y1: top + invBox.h, x2: X.inv + W.inv / 2, y2: by, label: 'DC (battery)' });
    bottom = Math.max(bottom, by + bb.h);
  }

  const cableLines = cableResults.length ? cableResults.map(({ c, r }) => {
    if (r.errors.length) return `Cable ${c.name}: refused input (${r.errors.join('; ')})`;
    const amp = find(r.checks, `ampacity-${c.name}`), vd = find(r.checks, `vdrop-${c.name}`);
    return `Cable ${c.name}: ${c.csaMm2} mm², ${c.lengthM} m one way, design current ${c.designCurrentA} A; capacity ${amp?.verdict} (I_z ${amp?.limit} A), voltage drop ${vd?.value} % ${vd?.verdict} (IEC 60364-5-52)`;
  }) : [`Cable runs: none entered; every cable size and route ${TBS}`];
  const notes = box('notes', 'Notes', [
    ...(designValid ? [] : ['DESIGN CHECKS REFUSE THIS DESIGN: this diagram is for review only.']),
    ...cableLines,
    `Earthing, equipotential bonding and lightning protection: ${TBS}.`,
    `Diagram generated from the design values (${SLD_ENGINE_VERSION}). It is not a construction drawing until a qualified engineer has completed every item marked "${TBS}", checked it and signed it.`,
  ], 20, bottom + 30, 1460);
  boxes.push(notes);

  return {
    engineVersion: SLD_ENGINE_VERSION, reference: i.reference, title: `Single-line diagram, ${i.reference}`,
    designValid, width: 1500, height: notes.y + notes.h + 20, boxes, wires,
    legend: `Values come from the design and its checks; "${TBS}" marks what the design does not determine. Dashed boxes: not stated or not required.`,
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** SVG text of the model (self-contained, white sheet, black lines). */
export function sldToSvg(mo: SldModel): string {
  const f = SLD_FONT;
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mo.width} ${mo.height}" width="100%" role="img" aria-label="${esc(mo.title)}" font-family="Helvetica, Arial, sans-serif">`);
  parts.push(`<title>${esc(mo.title)}</title>`);
  parts.push(`<rect x="0" y="0" width="${mo.width}" height="${mo.height}" fill="#ffffff"/>`);
  parts.push(`<text x="20" y="28" font-size="16" font-weight="700" fill="#111">${esc(mo.title)}</text>`);
  parts.push(`<text x="20" y="48" font-size="${f.line}" fill="#333">${esc(mo.legend)}</text>`);
  for (const w of mo.wires) {
    parts.push(`<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}" stroke="#111" stroke-width="1.6"/>`);
    if (w.label && w.y1 === w.y2) parts.push(`<text x="${(w.x1 + w.x2) / 2}" y="${w.y1 - 4}" font-size="8" text-anchor="middle" fill="#333">${esc(w.label)}</text>`);
    else if (w.label) parts.push(`<text x="${w.x1 + 4}" y="${(w.y1 + w.y2) / 2}" font-size="8" fill="#333">${esc(w.label)}</text>`);
  }
  for (const b of mo.boxes) {
    parts.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#ffffff" stroke="#111" stroke-width="1.2"${b.dashed ? ' stroke-dasharray="5 3"' : ''}/>`);
    parts.push(`<text x="${b.x + 6}" y="${b.y + 15}" font-size="${f.title}" font-weight="700" fill="#111">${esc(b.title)}</text>`);
    b.lines.forEach((l, k) => parts.push(`<text x="${b.x + 6}" y="${b.y + 30 + k * f.lineHeight}" font-size="${f.line}" fill="${l.includes(TBS) ? '#8a4b00' : '#111'}">${esc(l)}</text>`));
  }
  parts.push('</svg>');
  return parts.join('');
}

/** Flat list (component, text) for tables: the same text as the drawing. */
export function sldRows(mo: SldModel): Array<[string, string]> {
  return mo.boxes.flatMap((b) => [[b.title, b.lines.join(' ')] as [string, string]]);
}
