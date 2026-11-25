/**
 * Solar Genius Pro benchmark and test-case programme (2026-11-25).
 * Case register with problem, principle, independent calculation, tolerance
 * and source: docs/engineering/solar-sld-and-shading.md §8 and
 * docs/engineering/solar-source-register.md.
 *
 * Evidence classes used below:
 *   MS  = manufacturer specification (data/solar/equipment/*.json, unverified)
 *   PR  = published reference (PVWatts v5 manual, Dobos 2014, NREL/TP-6A20-62641)
 *   UA  = user assumption (labelled; stands in for a site value or an unprinted datasheet value)
 *   SYN = synthetic case (not field data; never field validation)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pvwattsInverter, pvwattsInverterDetail, PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';
import { validateStrings, type Module } from '@/lib/solar/design/validate';
import { recordErrors, recordWarnings, moduleFromRecord, inverterFromRecord, recordValue, type EquipmentRecord } from '@/lib/solar/design/equipmentData';

const DIR = path.resolve('data/solar/equipment');
const records: Record<string, EquipmentRecord> = Object.fromEntries(readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => [f, JSON.parse(readFileSync(path.join(DIR, f), 'utf8'))]));
const rec = (name: string) => { const r = records[name]; if (!r) throw new Error(`missing dataset file ${name}`); return r; };

describe('PR: PVWatts v5 manual (Dobos 2014) — documented equations, matched inputs', () => {
  it('B1 Eqn 9 / Table 6: default losses multiply to 14.08 % (manual prints "14 %")', () => {
    const table6 = [2, 3, 0, 2, 2, 0.5, 1.5, 1, 0, 3]; // soiling, shading, snow, mismatch, wiring, connections, LID, nameplate, age, availability (%)
    const hand = 100 * (1 - table6.reduce((p, l) => p * (1 - l / 100), 1));
    expect(hand).toBeCloseTo(14.0757, 3);
    const ours = 100 * (1 - Object.values(PVWATTS_DEFAULT_LOSSES).reduce((p, l) => p * (1 - l), 1));
    expect(Math.abs(ours - hand)).toBeLessThan(1e-9);
  });
  it('B2 Eqn 10: η = (η_nom/η_ref)(−0.0162 ζ − 0.0059/ζ + 0.9858), η_ref = 0.9637, η_nom = 0.96', () => {
    const hand = (z: number) => (0.96 / 0.9637) * (-0.0162 * z - 0.0059 / z + 0.9858);
    expect(hand(1)).toBeCloseTo(0.96, 12); // −0.0162 − 0.0059 + 0.9858 = 0.9637 exactly
    expect(hand(0.5)).toBeCloseTo(0.962192, 5);
    expect(hand(0.1)).toBeCloseTo(0.921628, 5);
    const pdc0 = 10 / 0.96; // Pdc0 = Pac0 / η_nom (Eqn 10)
    for (const z of [0.1, 0.25, 0.5, 0.75, 1]) expect(Math.abs(pvwattsInverter(z * pdc0, pdc0, 0.96) / (z * pdc0) - hand(z))).toBeLessThan(1e-9);
  });
  it('B3 Eqn 11: P_ac = P_ac0 when P_dc ≥ P_dc0 (clipping), 0 when P_dc = 0', () => {
    const pdc0 = 10 / 0.96;
    expect(pvwattsInverterDetail(1.3 * pdc0, pdc0, 0.96).ac).toBeCloseTo(10, 9);
    expect(pvwattsInverterDetail(0, pdc0, 0.96).ac).toBe(0);
  });
});

describe('MS: equipment dataset records are well formed and keep their evidence class', () => {
  it.each(Object.keys(records))('%s', (f) => {
    expect(recordErrors(records[f])).toEqual([]);
    expect(records[f].evidenceClass).toBe('manufacturer specification');
    expect(records[f].verification.status).toBe('unverified'); // no second-person check has been done yet
  });
  it('weak provenance is flagged: undated Victron sheet; Pylontech copy from a distributor', () => {
    expect(recordWarnings(rec('victron-smartsolar-mppt-150-45-undated.json')).join(' ')).toMatch(/Undated datasheet/);
    expect(recordWarnings(rec('pylontech-us5000-py21us05-1.json')).join(' ')).toMatch(/not from the manufacturer/);
  });
  it('a record with a null value and no reason, or a self-verified record, is refused', () => {
    const r = structuredClone(rec('jinko-jkm590n-72hl4-v-f8-en.json'));
    r.parameters.voc = { value: null, unit: 'V' };
    r.verification = { status: 'verified', enteredBy: 'a', verifiedBy: 'a' };
    expect(recordErrors(r).join(' ')).toMatch(/voc: a null value needs a note.*second person|second person.*voc/);
  });
  it('C6 missing evidence: the Jinko F8 sheet prints no NOCT and no Vmp coefficient → no module is built, the gaps are named', () => {
    const m = moduleFromRecord(rec('jinko-jkm590n-72hl4-v-f8-en.json'));
    expect(m.module).toBeNull();
    expect(m.missing.join(' ')).toMatch(/tempCoeffVmp.*noct/);
  });
});

/**
 * Realistic SAFETY-CRITICAL cases built from manufacturer specifications.
 * UA: site record low 5 °C and max ambient 30 °C (stand-ins until the site's
 * station record is entered); β_Vmp −0.30 %/°C and NOCT 45 °C are NOT printed on
 * the Jinko sheet and are labelled assumptions — they do not enter cold Voc or Isc,
 * which are the values asserted here.
 */
const jk = rec('jinko-jkm590n-72hl4-v-f8-en.json');
const MOD: Module = {
  model: jk.model, datasheet: jk.datasheet.url,
  pmaxW: recordValue(jk, 'pmax')!, vocV: recordValue(jk, 'voc')!, iscA: recordValue(jk, 'isc')!, vmpV: recordValue(jk, 'vmp')!, impA: recordValue(jk, 'imp')!,
  betaVocPct: recordValue(jk, 'tempCoeffVoc')!, alphaIscPct: recordValue(jk, 'tempCoeffIsc')!, gammaPmaxPct: recordValue(jk, 'tempCoeffPmax')!,
  maxSystemV: recordValue(jk, 'maxSystemVoltage')!, maxSeriesFuseA: recordValue(jk, 'maxSeriesFuseRating')!,
  betaVmpPct: -0.30, noctC: 45, // UA (not printed)
};
const TEMPS = { recordLowC: 5, maxAmbientC: 30 }; // UA
// Hand: Voc,cold per module = 52.63 × (1 + (−0.25/100) × (5 − 25)) = 52.63 × 1.05 = 55.2615 V
const vocColdModule = 52.63 * 1.05;

describe('safety-critical cases (MS + UA, hand-calculated, tolerance 0.01 V / 0.01 A)', () => {
  const smaB = inverterFromRecord(rec('sma-stp10-0-3av-40-ds-en-40.json'), { maxInputAKey: 'maxInputCurrentMpptB', maxIscAKey: 'maxShortCircuitCurrentMpptB' });
  const smaA = inverterFromRecord(rec('sma-stp10-0-3av-40-ds-en-40.json'), { maxInputAKey: 'maxInputCurrentMpptA', maxIscAKey: 'maxShortCircuitCurrentMpptA' });
  const deye = inverterFromRecord(rec('deye-sun-8k-sg01lp1-eu-20260911.json'), { maxInputAKey: 'maxInputCurrentPerMppt', maxIscAKey: 'maxShortCircuitCurrentPerMppt' });
  it('inverter records map (SMA 1000 V; Deye 500 V)', () => {
    expect(smaB.missing).toEqual([]); expect(deye.missing).toEqual([]);
    expect(smaB.inverter!.maxDcV).toBe(1000); expect(deye.inverter!.maxDcV).toBe(500);
  });
  const cold = (inv: NonNullable<typeof smaB.inverter>, n: number, strings: number[]) => validateStrings(MOD, inv, { modulesPerString: n, stringsPerMppt: strings }, TEMPS);
  it('C1 SMA STP10.0, 18 × JKM590N: cold Voc 18 × 55.2615 = 994.71 V ≤ 1000 V → PASS (margin 0.53 %)', () => {
    const c = cold(smaB.inverter!, 18, [1]).checks.find((x) => x.id === 'cold-voc')!;
    expect(c.value).toBeCloseTo(18 * vocColdModule, 2); expect(c.verdict).toBe('PASS');
  });
  it('C2 SAFETY: 19 × JKM590N on SMA: cold Voc 1049.97 V > 1000 V → REFUSE', () => {
    const r = cold(smaB.inverter!, 19, [1]);
    const c = r.checks.find((x) => x.id === 'cold-voc')!;
    expect(c.value).toBeCloseTo(19 * vocColdModule, 2); expect(c.verdict).toBe('REFUSE'); expect(r.valid).toBe(false);
  });
  it('C3 SAFETY: Deye SUN-8K (500 V max): 9 modules 497.35 V PASS; 10 modules 552.62 V REFUSE', () => {
    expect(cold(deye.inverter!, 9, [1]).checks.find((x) => x.id === 'cold-voc')!.verdict).toBe('PASS');
    const c = cold(deye.inverter!, 10, [1]).checks.find((x) => x.id === 'cold-voc')!;
    expect(c.value).toBeCloseTo(10 * vocColdModule, 2); expect(c.verdict).toBe('REFUSE');
  });
  it('C4 boundary: SMA input B (18 A max Isc): 1 string, 1.25 × 14.13 = 17.66 A → PASS with 1.9 % margin', () => {
    const c = cold(smaB.inverter!, 16, [1]).checks.find((x) => x.id === 'isc-mppt1')!;
    expect(c.value).toBeCloseTo(17.66, 2); expect(c.verdict).toBe('PASS');
  });
  it('C5 SAFETY: SMA input A (30 A max Isc): 2 parallel strings, 2 × 1.25 × 14.13 = 35.33 A → REFUSE', () => {
    const c = cold(smaA.inverter!, 16, [2]).checks.find((x) => x.id === 'isc-mppt1')!;
    expect(c.value).toBeCloseTo(35.325, 1); expect(c.verdict).toBe('REFUSE');
  });
});
