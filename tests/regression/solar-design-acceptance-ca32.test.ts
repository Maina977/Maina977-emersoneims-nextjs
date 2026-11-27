/**
 * CA-32 / P1-B REQ-23, REQ-25, SG-G: "no unsafe design is ever marked valid".
 *
 * 21 SYNTHETIC designs (TEST components and numbers, not project data), each
 * hand-worked below, run through the full design-to-proposal engine
 * (buildProposal) and its single-line diagram (designValid). An unsafe design
 * must come back REFUSED, with the named check refused. A control must not
 * be refused (DRAFT: no approval is ever attached in tests).
 *
 * Types: residential grid-tied (R), commercial (C), off-grid with battery (O),
 * hybrid with generator (G).
 *
 * TEST module: 550 W, Voc 49.5 V, Isc 13.9 A, Vmp 41.5 V, Imp 13.1 A,
 *   β_Voc −0.27 %/°C, β_Vmp −0.35 %/°C, NOCT 45 °C, max system 1,500 V,
 *   max series fuse 25 A.
 * TEST inverter: 15 kW, max DC 1,000 V, MPPT 200–850 V, 2 MPPTs,
 *   26 A input and 40 A Isc per MPPT.
 * Site: record low 10 °C, max ambient 35 °C (unless stated).
 *   Cold Voc per module at 10 °C = 49.5 × (1 + 0.0027 × 15) = 51.505 V.
 *   Cell at 35 °C = 35 + 25/800 × 1000 = 66.25 °C; hot Vmp per module =
 *   41.5 × (1 − 0.0035 × 41.25) = 35.508 V. Cold Vmp per module =
 *   41.5 × (1 + 0.0035 × 15) = 43.679 V.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import type { Module, Inverter, Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import type { HybridResult } from '@/lib/solar/design/hybrid';

const MOD: Module = { model: 'TEST-module-550', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'TEST module rev A' };
const INV: Inverter = { model: 'TEST-inverter-15', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'TEST inverter rev B' };
const BAT: Battery = { model: 'TEST-LFP-5', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'TEST battery rev C' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter' | 'battery'): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] } as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST year'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number, source = 'TEST source') => ({ value, source });
const GEN_OK = 'TEST datasheet §4: generator input supported';

type Over = Partial<Omit<ProposalInput, 'module' | 'inverter'>> & { mod?: Partial<Module>; inv?: Partial<Inverter> };
const design = (o: Over = {}): ProposalInput => {
  const { mod, inv, ...rest } = o;
  return {
    reference: 'TEST-CA32', client: { name: 'TEST client', siteAddress: 'TEST site', lat: -1.29, lon: 36.82 },
    module: entry({ ...MOD, ...mod }, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST station record' },
    cables: [], production,
    bom: [{ item: 'PV modules', model: 'TEST', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
    ...rest,
  };
};
const battery = (units: number, need: number) => ({ entry: entry(BAT, 'battery'), units, requiredUsableAcKwh: need });
const hybridWithGenerator = { hours: 8760, totals: { loadKwh: 20000, pvKwh: 20000, pvToLoadKwh: 12000, pvToBatteryKwh: 0, batteryToLoadKwh: 0, gridImportKwh: 0, gridExportKwh: 0, generatorKwh: 800, generatorToBatteryKwh: 0, generatorDumpedKwh: 0, generatorHours: 120, generatorFuelL: 300, generatorStarts: 60, curtailedKwh: 0, unservedKwh: 0, batteryLossKwh: 0 }, renewableFraction: 0.9, unservedHours: 0, finalSocFrac: null, balanceErrorKwh: 0, assumptions: [], engineVersion: 'solar-hybrid test' } as HybridResult;

interface Case { id: string; type: 'R' | 'C' | 'O' | 'G'; title: string; input: ProposalInput; refuse: string[] | null }

const CASES: Case[] = [
  // ── Controls ──────────────────────────────────────────────────────────
  { id: 'C1', type: 'R', title: 'control: 2 × 16 modules — cold Voc 51.505 × 16 = 824.1 ≤ 1,000 V; hot Vmp 35.508 × 16 = 568.1 ≥ 200; cold Vmp 698.9 ≤ 850; Isc 17.4 ≤ 40',
    input: design(), refuse: null },
  { id: 'C2', type: 'C', title: 'control cable: 16 mm², It 76 A × 0.87 × 0.8 = 52.9 A ≥ 40 A; drop 2 × 20 × 40 × 0.0225 ÷ 16 = 2.25 V = 0.38 % of 600 V',
    input: design({ cables: [{ name: 'DC main', lengthM: 20, csaMm2: 16, designCurrentA: 40, systemV: 600, tabulatedAmpacityA: 76, ambientFactor: 0.87, groupingFactor: 0.8, maxDropPct: 3 }] }), refuse: null },
  { id: 'C3', type: 'O', title: 'control battery: 4 × 5 = 20 kWh ≥ 10 ÷ (0.9 × 0.95) = 11.70 kWh; 8 kW ÷ 20 kWh = 0.40 C ≤ 0.5 C both ways',
    input: design({ inv: { batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, battery: battery(4, 10) }), refuse: null },
  { id: 'C4', type: 'G', title: 'control generator: listed compatible, no back-feed, 20 kW set, min site load 8 kW ≥ 30 % × 20 = 6 kW',
    input: design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } }), refuse: null },
  { id: 'C5', type: 'G', title: 'control (warned, not refused): min site load 4 kW < 6 kW is a wet-stacking WARN',
    input: design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 4, pvCanBackfeedGenerator: false } }), refuse: null },
  // ── Unsafe: voltage ───────────────────────────────────────────────────
  { id: 'U1', type: 'R', title: 'cold Voc over inverter max: 20 × 51.505 = 1,030.1 V > 1,000 V (cold Vmp 873.6 > 850 too)',
    input: design({ design: { modulesPerString: 20, stringsPerMppt: [1, 1] } }), refuse: ['cold-voc', 'cold-vmp'] },
  { id: 'U2', type: 'C', title: 'cold Voc over MODULE max system V: 1,500 V inverter, 1,000 V-class module, 20 × 51.505 = 1,030.1 V > min(1,500, 1,000)',
    input: design({ mod: { maxSystemV: 1000 }, inv: { maxDcV: 1500, mpptMaxV: 1300 }, design: { modulesPerString: 20, stringsPerMppt: [1, 1] } }), refuse: ['cold-voc'] },
  { id: 'U3', type: 'R', title: 'cold Voc at a −5 °C record low: 19 × 49.5 × (1 + 0.0027 × 30) = 19 × 53.51 = 1,016.7 V > 1,000 V (978.6 V at 10 °C would pass)',
    input: design({ design: { modulesPerString: 19, stringsPerMppt: [1, 1] }, temps: { recordLowC: -5, maxAmbientC: 35, source: 'TEST station record' } }), refuse: ['cold-voc'] },
  { id: 'U4', type: 'R', title: 'hot Vmp below MPPT min: 5 × 35.508 = 177.5 V < 200 V',
    input: design({ design: { modulesPerString: 5, stringsPerMppt: [1, 1] } }), refuse: ['hot-vmp'] },
  // ── Unsafe: current / fusing ──────────────────────────────────────────
  { id: 'U5', type: 'C', title: 'Isc × 1.25 over MPPT max: 3 × 13.9 × 1.25 = 52.1 A > 40 A (Imp 39.3 A, 51 % over 26 A)',
    input: design({ design: { modulesPerString: 16, stringsPerMppt: [3, 1] } }), refuse: ['isc-mppt1', 'imp-mppt1'] },
  { id: 'U6', type: 'C', title: 'Imp > 10 % over input limit: 2 × 13.1 = 26.2 A on a 22 A input (19 % over); Isc 34.75 ≤ 40',
    input: design({ inv: { maxInputA: 22 }, design: { modulesPerString: 16, stringsPerMppt: [2, 1] } }), refuse: ['imp-mppt1'] },
  { id: 'U7', type: 'C', title: 'no valid string-fuse rating: 3 strings need fuses; 1.5 × 13.9 = 20.85 A ≥ module max series fuse 20 A',
    input: design({ mod: { maxSeriesFuseA: 20 }, inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] } }), refuse: ['fuse-window-mppt1'] },
  // ── Unsafe: cable ─────────────────────────────────────────────────────
  { id: 'U8', type: 'C', title: 'undersized cable: 6 mm², It 41 A × 0.87 × 0.8 = 28.5 A < 40 A design current',
    input: design({ cables: [{ name: 'DC main', lengthM: 20, csaMm2: 6, designCurrentA: 40, systemV: 600, tabulatedAmpacityA: 41, ambientFactor: 0.87, groupingFactor: 0.8, maxDropPct: 3 }] }), refuse: ['ampacity-DC main'] },
  // ── Unsafe: battery ───────────────────────────────────────────────────
  { id: 'U9', type: 'O', title: 'battery too small: 2 × 5 = 10 kWh < 10 ÷ (0.9 × 0.95) = 11.70 kWh',
    input: design({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: battery(2, 10) }), refuse: ['battery-energy'] },
  { id: 'U10', type: 'O', title: 'battery C-rate exceeded: 10 kW ÷ 10 kWh = 1.0 C > 0.5 C (discharge and charge)',
    input: design({ inv: { batteryMaxDischargeKw: 10, batteryMaxChargeKw: 10 }, battery: battery(2, 5) }), refuse: ['battery-discharge-c', 'battery-charge-c'] },
  { id: 'U11', type: 'O', title: 'battery C-rate UNKNOWN: inverter battery power not given — was marked valid before CA-32',
    input: design({ battery: battery(4, 10) }), refuse: ['battery-discharge-c', 'battery-charge-c'] },
  // ── Unsafe: generator ─────────────────────────────────────────────────
  { id: 'U12', type: 'G', title: 'generator with an inverter that has NO compatibility statement — was marked valid before CA-32',
    input: design({ connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } }), refuse: ['gen-compat'] },
  { id: 'U13', type: 'G', title: 'reverse power: PV can back-feed the running generator — was marked valid before CA-32',
    input: design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: true } }), refuse: ['gen-reverse-power'] },
  { id: 'U14', type: 'G', title: 'reverse power not stated (unknown is refused, never assumed safe)',
    input: design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8 } }), refuse: ['gen-backfeed-stated'] },
  { id: 'U15', type: 'G', title: 'generator connected with no rating',
    input: design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, pvCanBackfeedGenerator: false } }), refuse: ['gen-rating'] },
  { id: 'U16', type: 'G', title: 'hybrid balance runs a generator (800 kWh, 120 h) but no generator connection is stated',
    input: design({ hybrid: hybridWithGenerator }), refuse: ['gen-rating', 'gen-backfeed-stated', 'gen-compat'] },
];

describe('CA-32: 21 synthetic designs — no unsafe design is ever marked valid', () => {
  it('the set covers every required type and has at least 20 designs, unsafe and control', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(20);
    for (const t of ['R', 'C', 'O', 'G'] as const) expect(CASES.some((c) => c.type === t)).toBe(true);
    expect(CASES.filter((c) => c.refuse === null).length).toBeGreaterThanOrEqual(4);
    expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length);
  });

  for (const c of CASES) {
    it(`${c.id} [${c.type}] ${c.title}`, () => {
      const p = buildProposal(c.input);
      const refusedIds = p.checks.filter((k) => k.verdict === 'REFUSE').map((k) => k.id);
      if (c.refuse === null) {
        expect(refusedIds, `${c.id} must not be refused`).toEqual([]);
        expect(p.status).not.toBe('REFUSED');
        expect(p.sld.designValid).toBe(true);
      } else {
        expect(p.status, `${c.id} must be REFUSED`).toBe('REFUSED');
        for (const id of c.refuse) expect(refusedIds, `${c.id} must refuse ${id}`).toContain(id);
        expect(p.sld.designValid).toBe(false);
        // The reason is stated to the user.
        expect(p.statusReasons.some((r) => r.startsWith('REFUSE: '))).toBe(true);
      }
    });
  }

  it('C5 carries the light-loading warning; U16 explains the missing connection', () => {
    const c5 = buildProposal(CASES.find((c) => c.id === 'C5')!.input);
    expect(c5.checks.find((k) => k.id === 'gen-min-load')?.verdict).toBe('WARN');
    const u16 = buildProposal(CASES.find((c) => c.id === 'U16')!.input);
    expect(u16.statusReasons.join(' ')).toMatch(/hybrid balance runs a generator/);
  });
  it('an unstated minimum site load is shown as NOT checked (WARN), never as a pass', () => {
    const p = buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, pvCanBackfeedGenerator: false } }));
    const k = p.checks.find((x) => x.id === 'gen-min-load');
    expect(k?.verdict).toBe('WARN');
    expect(k?.note).toMatch(/NOT checked/);
    expect(p.status).not.toBe('REFUSED');
  });
});

describe('CA-32: the proposal form carries the generator answers to the engine', () => {
  it('generator yes + back-feed unanswered → null (refused); answered no → false; no generator → no generator fields', async () => {
    const { connectionsFromForm } = await import('@/lib/solar/design/proposalForm');
    expect(connectionsFromForm({ 'sld.generator': 'yes', 'hgen.ratedKw': '20' })).toEqual({ grid: null, generator: true, generatorRatedKw: 20, pvCanBackfeedGenerator: null });
    expect(connectionsFromForm({ 'sld.generator': 'yes', 'hgen.ratedKw': '20', 'sld.pvBackfeed': 'no', 'sld.genMinSiteLoadKw': '8', 'sld.genOemMinLoadPct': '25' }))
      .toEqual({ grid: null, generator: true, generatorRatedKw: 20, pvCanBackfeedGenerator: false, generatorMinSiteLoadKw: 8, generatorOemMinLoadPct: 25 });
    expect(connectionsFromForm({ 'sld.grid': 'yes', 'sld.generator': 'no', 'sld.pvBackfeed': 'yes' })).toEqual({ grid: true, generator: false });
  });
  it('the request validator accepts the new fields and refuses a wrong type', async () => {
    const { connectionsFromForm } = await import('@/lib/solar/design/proposalForm');
    const conn = connectionsFromForm({ 'sld.generator': 'yes', 'hgen.ratedKw': '20', 'sld.pvBackfeed': 'no' })!;
    // OEM minimum 25 % of 20 kW = 5 kW; no site load given → WARN (not checked), back-feed false, compatible → not refused.
    const p = buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { ...conn, generatorOemMinLoadPct: 25 } }));
    expect(p.status).not.toBe('REFUSED');
    expect(() => buildProposal(design({ connections: { grid: null, generator: true, pvCanBackfeedGenerator: 'maybe' as unknown as boolean } }))).toThrow(/pvCanBackfeedGenerator/);
  });
});

// ── Review of ccdb2404 (REVIEW-SOLAR-CA32.md): G1–G4 ─────────────────────
const MORE: Case[] = [
  { id: 'U17', type: 'O', title: 'G1: inverter battery power 0 kW (0 ÷ 20 kWh = 0 C "passed") → C-rate not checkable → refused',
    input: design({ inv: { batteryMaxDischargeKw: 0, batteryMaxChargeKw: 0 }, battery: battery(4, 10) }), refuse: ['battery-discharge-c', 'battery-charge-c'] },
  { id: 'U18', type: 'O', title: 'G1: inverter battery power −5 kW (−0.25 C "passed") → refused',
    input: design({ inv: { batteryMaxDischargeKw: -5, batteryMaxChargeKw: -5 }, battery: battery(4, 10) }), refuse: ['battery-discharge-c', 'battery-charge-c'] },
  { id: 'U19', type: 'G', title: 'G2: a generator-compatibility "statement" of only spaces is no statement → refused',
    input: design({ inv: { generatorCompatibility: '   ' }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } }), refuse: ['gen-compat'] },
  { id: 'U20', type: 'C', title: 'G3: 4 mm² DC cable entered at 20 A on a 3-string MPPT: 3 × 13.9 × 1.25 = 52.1 A > 20 A entered → refused',
    input: design({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'DC', lengthM: 10, csaMm2: 4, designCurrentA: 20, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3 }] }), refuse: ['cable-current-DC'] },
  { id: 'C6', type: 'O', title: 'G4 control: need 8.55 kWh usable → 8.55 ÷ (0.9 × 0.95) = 10.000 kWh nominal on exactly 2 × 5 kWh passes',
    input: design({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: battery(2, 8.55) }), refuse: null },
  { id: 'U21', type: 'O', title: 'G4 still refuses a genuinely short bank: need 8.56 kWh → 10.012 kWh > 10 kWh',
    input: design({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: battery(2, 8.56) }), refuse: ['battery-energy'] },
  { id: 'C7', type: 'C', title: 'G3 control: the same cable entered at 52.2 A, 16 mm² (It 76 A) on MPPT 1 → passes',
    input: design({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'DC', lengthM: 10, csaMm2: 16, designCurrentA: 52.2, systemV: 600, tabulatedAmpacityA: 76, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'dc-pv', mppt: 1 }] }), refuse: null },
  { id: 'C8', type: 'C', title: 'G3 control: an AC cable is not tied to the strings (20 A AC on a 3-string design passes)',
    input: design({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'AC', lengthM: 10, csaMm2: 4, designCurrentA: 20, systemV: 400, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'ac' }] }), refuse: null },
];

describe('CA-32 review G1–G4: further designs', () => {
  for (const c of MORE) {
    it(`${c.id} [${c.type}] ${c.title}`, () => {
      const p = buildProposal(c.input);
      const refusedIds = p.checks.filter((k) => k.verdict === 'REFUSE').map((k) => k.id);
      if (c.refuse === null) {
        expect(refusedIds, `${c.id} must not be refused`).toEqual([]);
        expect(p.status).not.toBe('REFUSED');
        expect(p.sld.designValid).toBe(true);
      } else {
        expect(p.status, `${c.id} must be REFUSED`).toBe('REFUSED');
        for (const id of c.refuse) expect(refusedIds, `${c.id} must refuse ${id}`).toContain(id);
        expect(p.sld.designValid).toBe(false);
      }
    });
  }
  it('G2 also in the datasheet import: spaces are stored as no statement', async () => {
    const { importInverter } = await import('@/lib/solar/design/datasheet');
    const r = importInverter({ manufacturer: 'TEST', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', model: 'T', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40', batteryMaxDischargeKw: '', batteryMaxChargeKw: '', generatorCompatibility: '   ' } as never);
    expect(r.entry?.data.generatorCompatibility).toBeNull();
  });
});

// ── Review of 39fa8535 (REVIEW-SOLAR-CA32-39fa8535.md): M1–M4 and the API cable check ──
describe('CA-32 review of 39fa8535: missing or nonsensical data is never valid', () => {
  it('M1 (U22): inverter MPPT count missing or NaN with a 3-MPPT design → REFUSED, not valid', async () => {
    for (const mpptCount of [undefined, NaN, 0, 1.5]) {
      const i = design({ design: { modulesPerString: 16, stringsPerMppt: [1, 1, 1] } });
      (i.inverter.data as unknown as Record<string, unknown>).mpptCount = mpptCount;
      const p = buildProposal(i);
      expect(p.status, String(mpptCount)).toBe('REFUSED');
      expect(p.statusReasons.join(' ')).toMatch(/MPPT count must be a whole number/);
      expect(p.sld.designValid).toBe(false);
    }
    // Control: count 3 with 3 MPPTs used is accepted.
    expect(buildProposal(design({ inv: { mpptCount: 3 }, design: { modulesPerString: 16, stringsPerMppt: [1, 1, 1] } })).status).not.toBe('REFUSED');
  });
  it('M2 (U23): inverter count −1, 0, 1.5 is refused by the engine, the diagram and the form', async () => {
    const { buildSld } = await import('@/lib/solar/design/sld');
    const { formToProposalInput, sldPreviewFromForm, WORKED_EXAMPLE_FORM } = await import('@/lib/solar/design/proposalForm');
    for (const n of [-1, 0, 1.5]) {
      expect(() => buildProposal(design({ inverterCount: n }))).toThrow(/Inverter count must be a whole number/);
      expect(buildSld({ reference: 'T', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: n, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] }).designValid).toBe(false);
      const f = { ...WORKED_EXAMPLE_FORM, 'd.inverterCount': String(n) };
      const r = formToProposalInput(f, [{ item: 'PV modules', model: 'm', quantity: '32', unit: 'No', rate: '15000', rateSource: 'q', rateDate: '2026-11-01' }], production, null);
      expect(r.input).toBeNull();
      expect(r.errors.join(' ')).toMatch(/Inverter count must be a whole number of inverters, 1 or more/);
      expect(sldPreviewFromForm(f).model).toBeNull();
    }
  });
  it('M3 (U24): datasheet references of only spaces are no references → REFUSED', () => {
    expect(buildProposal(design({ mod: { datasheet: '   ' } })).status).toBe('REFUSED');
    expect(buildProposal(design({ inv: { datasheet: ' ' } })).status).toBe('REFUSED');
    const p = buildProposal(design({ inv: { batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, battery: { entry: entry({ ...BAT, datasheet: ' ' }, 'battery'), units: 4, requiredUsableAcKwh: 10 } }));
    expect(p.statusReasons.join(' ')).toMatch(/Battery datasheet reference is required/);
    expect(p.sld.designValid).toBe(false);
  });
  it('M4 (U25): the diagram with a battery but no energy need is not valid, and its C-rate is still checked', async () => {
    const { buildSld } = await import('@/lib/solar/design/sld');
    const sld = (inv: Inverter) => buildSld({ reference: 'T', module: MOD, inverter: inv, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, battery: { data: BAT, units: 1 }, cables: [] });
    expect(sld(INV).designValid).toBe(false); // no inverter battery power and no need
    expect(sld({ ...INV, batteryMaxDischargeKw: 2, batteryMaxChargeKw: 2 }).designValid).toBe(false); // C-rate fine (0.4 C), energy need missing
  });
  it('API (F-G3d): cable kind and MPPT are validated by the request check', async () => {
    const { checkProposalRequest } = await import('@/lib/solar/design/proposalRequest');
    const cable = { name: 'DC', lengthM: 10, csaMm2: 16, designCurrentA: 40, systemV: 600, tabulatedAmpacityA: 76, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3 };
    for (const bad of [{ kind: 'DC-PV' }, { kind: 'string' }, { mppt: 0 }, { mppt: 1.5 }, { mppt: '1' }]) {
      const r = checkProposalRequest({ format: 'json', input: design({ cables: [{ ...cable, ...bad } as never] }) });
      expect('error' in r ? r.error : '', JSON.stringify(bad)).toMatch(/cable kind must be dc-pv, dc-string, dc-battery or ac, and mppt a whole number/);
    }
    expect('error' in checkProposalRequest({ format: 'json', input: design({ cables: [{ ...cable, kind: 'dc-pv', mppt: 1 }] }) })).toBe(false);
  });
});

// ── R1: a cable serving ONE string (IEC 62548-1, string cable current rating: Iz ≥ 1.25 × Isc and ≥ the string fuse In;
//    clause and edition to be confirmed against the purchased standard — re-review S1) ──
// Module Isc 13.9 A: 1.25 × Isc = 17.375 A; fuse window 1.5 × 13.9 = 20.85 A < In ≤ min(2.4 × 13.9 = 33.36, 25) = 25 A.
describe('CA-32 R1: single-string cable on a fused 3-string MPPT', () => {
  const D = { inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] } };
  const cable = (o: Record<string, unknown>) => ({ name: 'S1', lengthM: 10, csaMm2: 4, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'dc-string' as const, mppt: 1, ...o });
  const run = (o: Record<string, unknown>) => buildProposal(design({ ...D, cables: [cable(o) as never] }));
  const k = (p: ReturnType<typeof buildProposal>) => p.checks.find((c) => c.id === 'cable-current-S1')!;
  it('C9: fused 25 A, entered 25 A → required max(17.375, 25) = 25 A: passes (G3 refused it at 52.1 A)', () => {
    const p = run({ designCurrentA: 25, stringFuseA: 25 });
    expect(k(p)).toMatchObject({ verdict: 'PASS', limit: 25 });
    expect(p.checks.filter((c) => c.verdict === 'REFUSE')).toEqual([]);
    expect(p.status).not.toBe('REFUSED');
  });
  it('U26: fused 25 A but entered 20 A → refused (below In)', () => {
    expect(k(run({ designCurrentA: 20, stringFuseA: 25 })).verdict).toBe('REFUSE');
  });
  it('U27: a 20 A fuse is outside the window (≤ 20.85 A) → refused', () => {
    expect(k(run({ designCurrentA: 25, stringFuseA: 20 }))).toMatchObject({ verdict: 'REFUSE', title: 'S1: string fuse rating' });
  });
  it('U28 (revised after re-review S2): unfused string cable on a 2-string MPPT, where fuses are not required → max(17.375, (2 − 1) × 17.375) = 17.375 A; 15 A refused, 17.4 A passes', () => {
    const run2 = (o: Record<string, unknown>) => buildProposal(design({ ...D, design: { modulesPerString: 16, stringsPerMppt: [2, 1] }, cables: [cable(o) as never] }));
    expect(k(run2({ designCurrentA: 15 }))).toMatchObject({ verdict: 'REFUSE', limit: 17.38 });
    expect(k(run2({ designCurrentA: 17.4 })).verdict).toBe('PASS');
  });
  it('U29 (re-review S2): unfused string cable on a 3-string MPPT, where fuses ARE required (3 ≥ 3; reverse 34.75 A > 25 A fuse) → refused, whatever current is entered', () => {
    for (const a of [25, 35, 60]) expect(k(run({ designCurrentA: a, tabulatedAmpacityA: 76, csaMm2: 16 }))).toMatchObject({ verdict: 'REFUSE', note: 'String fuses are required on this MPPT: give the string fuse rating' });
  });
  it('without the dc-string input the safe refusal stays (all-strings current 52.1 A)', () => {
    expect(k(run({ kind: 'dc-pv', designCurrentA: 25, stringFuseA: 25 })).verdict).toBe('REFUSE');
  });
});

describe('CA-32 R2/R3 (review of 39fa8535)', () => {
  it('R2: a non-string generator statement is a clean 400 from the API and a refusal in the engine', async () => {
    const { checkProposalRequest } = await import('@/lib/solar/design/proposalRequest');
    for (const g of [123, true, {}]) {
      const r = checkProposalRequest({ format: 'json', input: design({ inv: { generatorCompatibility: g as unknown as string } }) });
      expect('error' in r ? r.error : '', JSON.stringify(g)).toMatch(/generatorCompatibility must be text/);
      expect('error' in r ? r.error : '').not.toMatch(/is not a function/);
      const p = buildProposal(design({ inv: { generatorCompatibility: g as unknown as string }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } }));
      expect(p.checks.find((c) => c.id === 'gen-compat')?.verdict).toBe('REFUSE');
    }
  });
  it('R3: an OEM minimum of 0 % is not a figure: 30 % applies, so 0.5 kW on a 20 kW set (6 kW) still warns', () => {
    const p = buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 0.5, generatorOemMinLoadPct: 0, pvCanBackfeedGenerator: false } }));
    const k = p.checks.find((c) => c.id === 'gen-min-load')!;
    expect(k).toMatchObject({ verdict: 'WARN', limit: 6 });
    expect(k.reference).toMatch(/the 0 % entered is not a usable OEM figure/);
    // A real OEM figure still replaces the default: 20 % of 20 kW = 4 kW; 4.5 kW passes.
    expect(buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 4.5, generatorOemMinLoadPct: 20, pvCanBackfeedGenerator: false } })).checks.find((c) => c.id === 'gen-min-load')?.verdict).toBe('PASS');
  });
});

describe('CA-32 re-review of 221d977a: S1, S3, S4, fraction guard, bifacial note', () => {
  it('S1: the string-cable basis cites only the contents-list clause number and says the rule is to be confirmed', async () => {
    const { STRING_CABLE_BASIS } = await import('@/lib/solar/design/validate');
    expect(STRING_CABLE_BASIS).toBe('IEC 62548-1:2023+AMD1:2025, clause 7.2.2 Current rating of PV circuits (clause number from the official contents list; clause text not reviewed). The rule (protected: Iz ≥ In of the string fuse; unprotected: ≥ (N − 1) × 1.25 × Isc, min 1.25 × Isc) is to be confirmed against the purchased standard.');
    const p = buildProposal(design({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'S1', lengthM: 10, csaMm2: 4, designCurrentA: 25, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'dc-string', mppt: 1, stringFuseA: 25 }] }));
    expect(p.checks.find((c) => c.id === 'cable-current-S1')?.reference).toBe(STRING_CABLE_BASIS);
  });
  it('S3: with the energy need blank the diagram battery box says NOT CHECKED … refused, never PASS', async () => {
    const { buildSld } = await import('@/lib/solar/design/sld');
    const m = buildSld({ reference: 'T', module: MOD, inverter: { ...INV, batteryMaxDischargeKw: 2, batteryMaxChargeKw: 2 }, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, battery: { data: BAT, units: 1 }, cables: [] });
    const line = m.boxes.find((b) => b.id === 'battery')!.lines.join(' ');
    expect(line).toMatch(/Energy check: NOT CHECKED \(energy needed per cycle not given\): refused/);
    expect(line).not.toMatch(/Energy check: PASS/);
    // With the need given, the real verdict is printed: 4 × 5 = 20 kWh vs 10 ÷ 0.855 = 11.7 kWh → PASS.
    const ok = buildSld({ reference: 'T', module: MOD, inverter: { ...INV, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, battery: { data: BAT, units: 4, requiredUsableAcKwh: 10 }, cables: [] });
    expect(ok.boxes.find((b) => b.id === 'battery')!.lines.join(' ')).toMatch(/Energy check: PASS \(20 kWh installed vs 11.7 kWh required\)/);
  });
  it('S4: a battery entered with blank units gives no preview and "Battery units is required"', async () => {
    const { sldPreviewFromForm, WORKED_EXAMPLE_FORM } = await import('@/lib/solar/design/proposalForm');
    const bat = { 'b.manufacturer': 'TEST', 'b.datasheetUrl': 'https://example.com/b.pdf', 'b.datasheetRevision': 'A', 'b.datasheetDate': '2026-01-01', 'b.enteredBy': 'test', 'b.enteredOn': '2026-11-20',
      'b.model': 'TEST-LFP-5', 'b.nominalKwh': '5', 'b.usableDoD': '0.9', 'b.dischargeEfficiency': '0.95', 'b.maxDischargeC': '0.5', 'b.maxChargeC': '0.5', 'b.requiredUsableAcKwh': '10' };
    const r = sldPreviewFromForm({ ...WORKED_EXAMPLE_FORM, ...bat });
    expect(r.model).toBeNull();
    expect(r.errors).toContain('Battery units is required');
  });
  it('fraction guard: an OEM minimum of 0.3 % (meaning 30 %) warns "check units", never passes on that value', () => {
    const p = buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 0.5, generatorOemMinLoadPct: 0.3, pvCanBackfeedGenerator: false } }));
    const k = p.checks.find((c) => c.id === 'gen-min-load')!;
    // 0.3 % of 20 kW = 0.06 kW, so 0.5 kW would "pass"; the guard makes it a WARN.
    expect(k.verdict).toBe('WARN');
    expect(k.note).toMatch(/Check units: an OEM minimum of 0.3 % is probably a fraction; did you mean 30 %\?/);
    // 5 % and above is taken as a real OEM figure: 5 % of 20 = 1 kW; 1.2 kW passes.
    expect(buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 1.2, generatorOemMinLoadPct: 5, pvCanBackfeedGenerator: false } })).checks.find((c) => c.id === 'gen-min-load')?.verdict).toBe('PASS');
  });
  it('bifacial: the proposal says 1.25 × Isc at STC does not cover bifacial gain', () => {
    expect(buildProposal(design()).disclosures.join(' ')).toMatch(/1.25 × Isc at STC, which does not cover bifacial gain: for bifacial modules, use the datasheet's bifacial Isc/);
  });
});

describe('CA-32 third review: display', () => {
  const gen = (pct: number) => buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 0.5, generatorOemMinLoadPct: pct, pvCanBackfeedGenerator: false } })).checks.find((c) => c.id === 'gen-min-load')!;
  it('OEM minimum ≤ 1 suggests × 100; 1–5 % says it is unusual (no "did you mean 499 %")', () => {
    expect(gen(1).note).toMatch(/did you mean 100 %\?/);
    const k = gen(4.99);
    expect(k.verdict).toBe('WARN');
    expect(k.note).toMatch(/Check the OEM minimum load: 4.99 % is below 5 %, which is unusual/);
    expect(k.note).not.toMatch(/did you mean/);
  });
  it('the S2 refusal reason gives the required current, never "NaN A"', () => {
    const p = buildProposal(design({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'S1', lengthM: 10, csaMm2: 16, designCurrentA: 35, systemV: 600, tabulatedAmpacityA: 76, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'dc-string', mppt: 1 }] }));
    const r = p.statusReasons.find((x) => x.startsWith('REFUSE: S1: string fuse rating'))!;
    expect(r).toBe('REFUSE: S1: string fuse rating (required 34.75 A): String fuses are required on this MPPT: give the string fuse rating');
    expect(p.statusReasons.join(' ')).not.toMatch(/NaN/);
  });
});
