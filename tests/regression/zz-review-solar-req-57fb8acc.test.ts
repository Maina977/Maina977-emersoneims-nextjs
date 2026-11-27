/**
 * Independent review probes for 784b496d, 811b1d1f, 197fe499, 2ee5dc3b,
 * 7b52b1b8, fd636409, 57fb8acc (branch fix/solar-hub-2026-11-26 @ 57fb8acc).
 * TEST data only. No network: NASA POWER is stubbed.
 *
 * Tests named "FINDING" assert the behaviour the company rules require; a
 * failure there is a review finding, not a broken test.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { proposalRevisionHash } from '@/lib/solar/design/proposalApproval';
import { importModule } from '@/lib/solar/design/datasheet';
import { componentChecks, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import { parseReplacements, siteFromForm, formToProposalInput } from '@/lib/solar/design/proposalForm';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { parsePowerHourly, fetchPowerHourly, powerApiVersion } from '@/lib/solar/design/nasaPowerHourly';
import { sizeUps, CHEM_DOD } from '@/components/hub/SimulatorClient';
import { SpecTable } from '@/components/content/EngineeringDeepDive';

afterEach(() => cleanup());

const MOD: Module = { model: 'R-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, lengthMm: 2278, widthMm: 1134, datasheet: 'R' };
const INV: Inverter = { model: 'R-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, batteryMinV: 40, batteryMaxV: 60, batteryMaxDischargeA: 150, batteryMaxChargeA: 150, generatorCompatibility: null, datasheet: 'R' };
const BAT: Battery = { model: 'R-bat', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, chemistry: 'LiFePO4', nominalV: 51.2, cycleLife: 6000, cycleLifeDoD: 0.9, minTempC: 0, maxTempC: 45, warrantyYears: 10, datasheet: 'R' };
const prov = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-r`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['Weather: R-SOURCE retrieved 2026-11-27T08:15:00.000Z; API POWER Hourly API v2.5.22'], engineVersion: 'r' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'R' });
const fin = (o: Partial<ProposalInput['finance']> = {}): ProposalInput['finance'] => ({ tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20, ...o });
const input = (o: Partial<ProposalInput> = {}, battery = false): ProposalInput => ({
  reference: 'R-1', client: { name: 'R', siteAddress: 'R', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  ...(battery ? { battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } } : {}),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'R' }, cables: [], production,
  bom: [{ item: 'PV modules', model: 'R', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'R quote', date: '2026-11-01' } },
        { item: 'Inverter', model: 'R', quantity: 1, unit: 'No', rate: { valueKes: 320000, source: 'R quote', date: '2026-11-01' } }],
  finance: fin(),
  ...o,
});
const chk = (p: ReturnType<typeof buildProposal>, id: string) => p.checks.find((k) => k.id === id);

describe('REQ-17 sensitivity: independent hand check with escalation, degradation and export', () => {
  it('energy yield +10 % and tariff −10 % match a cash flow computed here from first principles', () => {
    // 20,000 kWh, 70 % used at 25 KES, 30 % exported at 10 KES, esc 5 %, deg 0.5 %, disc 10 %, O&M 20,000, 20 y.
    const f = fin({ selfConsumedFraction: s(0.7), exportTariffKesPerKwh: s(10), tariffEscalationPct: s(5), degradationPctPerYear: s(0.5) });
    const p = buildProposal(input({ finance: f }));
    const ref = (capX: number, tarX: number, yX: number) => {
      let v = -800000 * capX;
      for (let y = 1; y <= 20; y++) {
        const k = 0.995 ** (y - 1) * yX, t = 1.05 ** (y - 1);
        v += (14000 * k * 25 * tarX * t + 6000 * k * 10 * tarX - 20000) / 1.1 ** y;
      }
      return v;
    };
    const row = (v: string, c: number) => p.finance!.sensitivity.rows.find((r) => r.variable === v && r.changePct === c)!;
    expect(Math.abs(p.finance!.npvKes - ref(1, 1, 1))).toBeLessThanOrEqual(1);
    expect(Math.abs(row('energy yield', 10).npvKes - ref(1, 1, 1.1))).toBeLessThanOrEqual(1);
    expect(Math.abs(row('tariff', -10).npvKes - ref(1, 0.9, 1))).toBeLessThanOrEqual(1);
    expect(Math.abs(row('installed cost', 10).npvKes - ref(1.1, 1, 1))).toBeLessThanOrEqual(1);
    // Ordering sanity: a higher tariff / yield / lower cost never lowers NPV.
    expect(row('tariff', 10).npvKes).toBeGreaterThan(row('tariff', -10).npvKes);
    expect(row('installed cost', -10).npvKes).toBeGreaterThan(row('installed cost', 10).npvKes);
  });
  it('a loss-making case: payback and IRR are stated as absent, not invented', () => {
    const p = buildProposal(input({ finance: fin({ tariffKesPerKwh: s(1) }) })); // 16,000 KES savings < 20,000 O&M
    expect(p.finance!.simplePaybackYears).toBeNull();
    for (const r of p.finance!.sensitivity.rows) expect(r.simplePaybackYears).toBeNull();
  });
});

describe('REQ-06 replacements: edges', () => {
  const R = (o: object) => [{ item: 'Battery', year: 10, costKes: 400000, source: 'R quote', date: '2026-11-01', ...o }];
  it('negative cost, year 0, fractional year, year past life, missing date are all refused', () => {
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ costKes: -1 }) }) }))).toThrow(/cost/);
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ year: 0 }) }) }))).toThrow(/year/);
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ year: 10.5 }) }) }))).toThrow(/year/);
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ year: 21 }) }) }))).toThrow(/year/);
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ date: 'not a date' }) }) }))).toThrow(/source and date/);
    expect(() => buildProposal(input({ finance: fin({ replacements: R({ costKes: NaN }) }) }))).toThrow(/cost/);
  });
  it('two replacements in the same year add; the revision hash changes with a replacement', () => {
    const two = [...R({}), ...R({ item: 'Inverter', costKes: 100000 })];
    const p = buildProposal(input({ finance: fin({ replacements: two }) }));
    expect(p.finance!.cashflows[9].replacementKes).toBe(500000);
    expect(proposalRevisionHash(input({ finance: fin({ replacements: R({}) }) }))).not.toBe(proposalRevisionHash(input()));
  });
  it('the form: cost with thousands separators, wrong part count, blank text', () => {
    const e: string[] = [];
    expect(parseReplacements('', e)).toEqual([]);
    expect(parseReplacements('Inverter; 12; 320,000; Q-7; 2026-11-01', e)[0].costKes).toBe(320000);
    parseReplacements('Inverter; 12; 320000; Q-7', e); // 4 parts
    parseReplacements('Inverter; 12; -5; Q-7; 2026-11-01', e);
    expect(e).toHaveLength(2);
  });
  it('the request validator rejects a replacement with a string cost', () => {
    const bad = checkProposalRequest({ format: 'json', input: input({ finance: fin({ replacements: [{ item: 'x', year: 1, costKes: '5' as unknown as number, source: 'q', date: '2026-01-01' }] }) }) });
    expect('error' in bad).toBe(true);
  });
});

describe('REQ-19: unpriced line', () => {
  it('no capex, no finance, no sensitivity; Excel line says Request a quotation', async () => {
    const i = input(); i.bom[1].rate = null;
    const p = buildProposal(i);
    expect(p.costing.capexKes).toBeNull();
    expect(p.finance).toBeNull();
    const { proposalToXlsx } = await import('@/lib/solar/design/proposalExport');
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(p) as unknown as ArrayBuffer);
    const cells: string[] = []; wb.getWorksheet('Equipment & costs')!.eachRow((r) => r.eachCell((c) => { cells.push(String(c.value)); }));
    expect(cells).toContain('Request a quotation');
    expect(wb.worksheets.map((w) => w.name)).not.toContain('Sensitivity');
    // Observation (advisory A1) — fixed after this review: the Equipment & costs "Capital cost" cell
    // read 'incomplete'; it now reads "No total: request a quotation for …" (REQ-19 wording).
    expect(cells).not.toContain('incomplete');
    expect(cells.some((c) => /^No total: request a quotation for /.test(c))).toBe(true);
  }, 30000);
});

describe('REQ-01: site edges', () => {
  it('elevation limits, NaN, negative area; site with a source only is null', () => {
    expect(() => buildProposal(input({ site: { elevationM: -501, source: 'R' } }))).toThrow(/elevation/i);
    expect(buildProposal(input({ site: { elevationM: 6000, source: 'R' } })).site?.elevationM).toBe(6000);
    expect(() => buildProposal(input({ site: { elevationM: NaN, source: 'R' } }))).toThrow(/elevation/i);
    expect(() => buildProposal(input({ site: { usableAreaM2: -5, source: 'R' } }))).toThrow(/area/i);
    expect(buildProposal(input({ site: { source: 'R' } })).site).toBeNull();
    const e: string[] = [];
    siteFromForm({ 's.elevationM': '1,661', 's.source': 'R' }, e);
    expect(e.join(' ')).toMatch(/elevation/i); // a comma-formatted number is reported, not guessed
  });
});

describe('REQ-04: datasheet fields, missing / negative / unit mix-up', () => {
  const base = (o: Partial<Parameters<typeof componentChecks>[0]> = {}) => componentChecks({ module: MOD, inverter: INV, modules: 32, temps: { recordLowC: 10, maxAmbientC: 35 }, grid: null, ...o });
  it('hand check: 8 × 12.8 V units, 4 in series → 51.2 V; Ah = 5,000 ÷ 12.8 = 390.63; 0.5 C × 390.63 × 2 = 390.63 A', () => {
    const c = base({ battery: { data: { ...BAT, nominalV: 12.8 }, units: 8, seriesPerString: 4 } });
    expect(c.find((k) => k.id === 'battery-voltage')).toMatchObject({ verdict: 'PASS', value: 51.2 });
    expect(c.find((k) => k.id === 'battery-discharge-current')).toMatchObject({ verdict: 'PASS', limit: 390.63 });
  });
  it('arrangement: series 0, series 2.5 and 6 units in strings of 4 are refused', () => {
    for (const sp of [0, 2.5]) expect(base({ battery: { data: BAT, units: 4, seriesPerString: sp } }).find((k) => k.id === 'battery-arrangement')?.verdict).toBe('REFUSE');
    expect(base({ battery: { data: BAT, units: 6, seriesPerString: 4 } }).find((k) => k.id === 'battery-arrangement')?.verdict).toBe('REFUSE');
  });
  it('area: no usable area → no area check; usable area without dimensions → WARN not checked', () => {
    expect(base().find((k) => k.id === 'array-area')).toBeUndefined();
    expect(base({ module: { ...MOD, lengthMm: undefined }, usableAreaM2: 50 }).find((k) => k.id === 'array-area')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('FINDING: negative module dimensions (JSON request path) must not PASS the area check', () => {
    const r = checkProposalRequest({ format: 'json', input: input({ module: entry({ ...MOD, lengthMm: -2278 }, 'module'), site: { usableAreaM2: 10, source: 'R' } }) });
    // Updated after re-review Q6: the request validator now applies the import's dimension rule (300–3,500 mm).
    expect('error' in r ? r.error : '').toMatch(/module.lengthMm must be 300–3500 mm when given/);
    const a = chk(buildProposal(input({ module: entry({ ...MOD, lengthMm: -2278 }, 'module'), site: { usableAreaM2: 10, source: 'R' } })), 'array-area');
    expect(a?.verdict).not.toBe('PASS');
  });
  it('FINDING: module length typed in metres (2.278) is accepted and the area check passes on 0.00 m²', () => {
    const P = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20' };
    const r = importModule({ ...P, model: 'M', pmaxW: '550', vocV: '49.5', iscA: '13.9', vmpV: '41.95', impA: '13.11', betaVocPct: '-0.27', betaVmpPct: '-0.35', alphaIscPct: '0.048', gammaPmaxPct: '-0.35', noctC: '45', maxSystemV: '1500', maxSeriesFuseA: '25', lengthMm: '2.278', widthMm: '1.134' });
    expect(r.errors.length, 'a 2.278 mm module length should be reported as implausible (metres typed in a mm field)').toBeGreaterThan(0);
  });
  it('FINDING: inverter battery-port current not entered → a visible "not checked", not silence', () => {
    const c = base({ inverter: { ...INV, batteryMaxDischargeA: undefined, batteryMaxChargeA: undefined }, battery: { data: BAT, units: 4 } });
    expect(c.find((k) => k.id === 'battery-discharge-current'), 'discharge-current check missing entirely').toBeDefined();
    expect(c.find((k) => k.id === 'battery-discharge-current')?.verdict).not.toBe('PASS');
  });
  it('FINDING: battery nominal voltage not entered → the current checks are shown as not checked', () => {
    const c = base({ battery: { data: { ...BAT, nominalV: undefined }, units: 4 } });
    expect(c.find((k) => k.id === 'battery-voltage')?.verdict).toBe('WARN');
    expect(c.find((k) => k.id === 'battery-discharge-current'), 'current check silently omitted').toBeDefined();
  });
  it('FINDING: a non-integer "units in series" typed in the form is reported, not silently replaced by 1', () => {
    const f: Record<string, string> = { 'b.model': 'B', 'b.seriesPerString': '2.5' };
    const r = formToProposalInput(f as never, [], null as never, null as never);
    expect(r.errors.join(' '), 'seriesPerString 2.5 was silently dropped (default 1 used)').toMatch(/seriesPerString|in series/i);
  });
  it('grid-connected without anti-islanding: WARN (not PASS); WARN alone does not refuse', () => {
    const p = buildProposal(input({ connections: { grid: true, generator: false } }));
    expect(chk(p, 'anti-islanding')?.verdict).toBe('WARN');
    expect(p.status).not.toBe('REFUSED');
  });
});

describe('REQ-02: NASA POWER provenance (stubbed, no network)', () => {
  const body = (header?: unknown) => {
    const ghi: Record<string, number> = {}, t2m: Record<string, number> = {};
    for (let ms = Date.UTC(2025, 0, 1); ms < Date.UTC(2026, 0, 1); ms += 3600000) {
      const d = new Date(ms);
      const k = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCHours()).padStart(2, '0')}`;
      ghi[k] = 0; t2m[k] = 20;
    }
    return { ...(header ? { header } : {}), properties: { parameter: { ALLSKY_SFC_SW_DWN: ghi, T2M: t2m } } };
  };
  it('name without version, non-string version, HTTP 500, thrown fetch', async () => {
    expect(powerApiVersion({ header: { api: { name: 'POWER Hourly API' } } })).toBe('POWER Hourly API');
    expect(powerApiVersion({ header: { api: { version: 2.5 } } })).toBeNull();
    expect((await fetchPowerHourly(0, 0, 2025, (async () => new Response('x', { status: 500 })) as unknown as typeof fetch)).status).toBe('SERVICE UNAVAILABLE');
    expect((await fetchPowerHourly(0, 0, 2025, (async () => { throw new Error('offline'); }) as unknown as typeof fetch)).status).toBe('SERVICE UNAVAILABLE');
    const w = parsePowerHourly(body(), 2025, null);
    expect(w.status === 'OK' && w.retrievedAt).toBe(null);
  });
  it('FINDING: the PDF export carries the energy/weather source (retrieval time and API version)', async () => {
    const { proposalToPdf } = await import('@/lib/solar/design/proposalExport');
    const pdf = Buffer.from(proposalToPdf(buildProposal(input()))).toString('latin1');
    expect(pdf).toContain('Disclosures'); // control: plain text is findable in this PDF
    expect(pdf, 'PDF has no energy source / NASA POWER retrieval line').toContain('retrieved 2026-11-27');
  }, 30000);
});

describe('SH-08: UPS battery chemistry', () => {
  it('Flooded UPS battery: 25 kW × 0.25 h ÷ (0.9 × 0.4) = 17,361 Wh; zero / negative inputs give 0', () => {
    const b = { criticalLoadKw: 25, powerFactor: 0.85, upsAutonomyMin: 15, batteryChemistry: 'LFP' as const };
    expect(sizeUps({ ...b, upsBatteryChemistry: 'Flooded' }).wh).toBeCloseTo(6250 / 0.36, 0);
    expect(sizeUps({ ...b, upsBatteryChemistry: 'NMC' }).wh).toBeCloseTo(6250 / (0.9 * CHEM_DOD.NMC), 0);
    expect(sizeUps({ ...b, criticalLoadKw: -5, upsBatteryChemistry: 'AGM' }).wh).toBe(0);
    expect(sizeUps({ ...b, upsAutonomyMin: -10, upsBatteryChemistry: 'AGM' }).wh).toBe(0);
  });
});

describe('HUB-02: SpecTable accessible name edges', () => {
  it('no caption and no headers: the focusable region has an empty name (advisory)', () => {
    const { container } = render(React.createElement(SpecTable, { headers: [], rows: [] }));
    const fig = container.querySelector('figure')!;
    expect(fig.getAttribute('tabindex')).toBe('0');
    expect(fig.getAttribute('aria-label')).toBe('');
  });
});
