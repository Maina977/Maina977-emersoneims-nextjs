/**
 * Final review (ae19f257): (1) the API applies the datasheet import's
 * provenance rules; (2) the IEC 62446-1 commissioning report never claims an
 * on-site inspection or test it cannot have done. TEST data only.
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import fs from 'fs';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { provenanceErrors, type LibraryEntry } from '@/lib/solar/design/datasheet';
import type { Module, Inverter, Battery } from '@/lib/solar/design/validate';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const require = createRequire(import.meta.url);
const ea = require('../../lib/solar-genius/server/engineering-approval.js');

const MOD: Module = { model: 'T', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'T' };
const INV: Inverter = { model: 'T', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, generatorCompatibility: null, datasheet: 'T' };
const BAT: Battery = { model: 'T', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'T' };
const PROV = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string, prov: Record<string, unknown> = PROV) => ({ kind, id: `${kind}-t`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['T'], engineVersion: 't' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'T' });
type P = Record<string, unknown>;
const body = (o: { mod?: P; inv?: P; bat?: P } = {}) => JSON.parse(JSON.stringify({ format: 'json', input: {
  reference: 'T', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module', { ...PROV, ...o.mod }), inverter: entry(INV, 'inverter', { ...PROV, ...o.inv }),
  battery: { entry: entry(BAT, 'battery', { ...PROV, ...o.bat }), units: 4, requiredUsableAcKwh: 10 },
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'T' }, cables: [], production,
  bom: [{ item: 'PV', model: 'T', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'T', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
} }));
const err = (b: unknown) => { const r = checkProposalRequest(b); return 'error' in r ? r.error : ''; };

describe('(1) API provenance: the import rules apply to API entries', () => {
  it('good provenance passes', () => expect(err(body())).toBe(''));
  it('the reviewer probe: URL "not-a-link" and date "someday" → 400', () => {
    const e = err(body({ mod: { datasheetUrl: 'not-a-link', datasheetDate: 'someday' } }));
    expect(e).toMatch(/module.provenance.datasheetUrl must be an https link/);
    expect(e).toMatch(/module.provenance.datasheetDate must be a date \(YYYY-MM-DD\)/);
  });
  it('inverter and battery entries too; missing fields, http, impossible dates', () => {
    expect(err(body({ inv: { manufacturer: '  ' } }))).toMatch(/inverter.provenance.manufacturer is required/);
    expect(err(body({ inv: { datasheetUrl: 'http://example.com/t.pdf' } }))).toMatch(/inverter.provenance.datasheetUrl must be an https link/);
    expect(err(body({ bat: { enteredOn: '2026-02-30' } }))).toMatch(/battery.provenance.enteredOn must be a date/);
    expect(err(body({ bat: { verifiedOn: 'tomorrow' } }))).toMatch(/battery.provenance.verifiedOn must be a date/);
  });
  it('the same function serves the import (one rule set)', () => {
    expect(provenanceErrors({ ...PROV, datasheetUrl: 'not-a-link', datasheetDate: 'someday' })).toEqual([
      'datasheetUrl must be an https link to the manufacturer document', 'datasheetDate must be a date (YYYY-MM-DD)',
    ]);
  });
});

describe('(2) commissioning report: on-site items are never a hard-coded pass', () => {
  type Item = { id: string; pass: boolean | null };
  it('VI-1…VI-4, VI-6, VI-8…VI-10 and T-1, T-2, T-6 are null "not inspected / not tested"', () => {
    const r = ea.iec62446CommissioningReport({});
    const vi = (id: string) => r.visualInspection.items.find((x: Item) => x.id === id);
    for (const id of ['VI-1', 'VI-2', 'VI-3', 'VI-4', 'VI-6', 'VI-8', 'VI-9', 'VI-10']) expect(vi(id)).toMatchObject({ pass: null, status: 'not inspected: requires on-site inspection by the engineer' });
    const t = (id: string) => r.testing.items.find((x: Item) => x.id === id);
    for (const id of ['T-1', 'T-2', 'T-6']) expect(t(id)).toMatchObject({ pass: null, measured: 'not measured', status: 'not tested: requires on-site test by the engineer' });
    // Only items derived from inputs can pass: VI-5 (OCPD rating) and VI-7 (earth resistance).
    expect(r.visualInspection.items.filter((x: Item) => x.pass !== null).map((x: Item) => x.id)).toEqual(['VI-5', 'VI-7']);
  });
  it('null counts as not passed: totals, allPass and the verdict say NOT COMPLETE, never PASS', () => {
    const r = ea.iec62446CommissioningReport({ vocMeasuredV: 500, vocExpectedV: 500, iscMeasuredA: 9.8, iscExpectedA: 9.8, insulationResistanceMOhm: 50, earthResistanceOhm: 5, ocpdRatingA: 15 });
    expect(r.visualInspection.allPass).toBe(false);
    expect(r.visualInspection.itemsNotInspected).toBe(8);
    expect(r.testing.allPass).toBe(false);
    expect(r.testing.testsNotDone).toBe(3);
    expect(r.overallVerdict).toBe('NOT COMPLETE — 11 inspection / test items need the engineer on site; do not energise on this report.');
    expect(r.failedItems).toEqual([]);
    expect(r.notInspectedItems).toHaveLength(11);
  });
  it('a real failure still says FAIL', () => {
    expect(ea.iec62446CommissioningReport({ earthResistanceOhm: 15 }).overallVerdict).toMatch(/^FAIL/);
  });
  it('the three copies of the module agree: none hard-codes a visual pass', () => {
    for (const f of ['lib/solar-genius/server/engineering-approval.js', 'components/solar-modules/crc/server/engineering-approval.js', 'external/EMERSONEIMS-SolarGeniusPro/SolarGeniusPro/crc/server/engineering-approval.js']) {
      const src = fs.readFileSync(f, 'utf8');
      expect(src, f).not.toMatch(/id: 'VI-\d+',\s+item: '[^']*',\s+pass: true/);
      expect(src, f).toMatch(/NOT COMPLETE — /);
    }
  });
});
