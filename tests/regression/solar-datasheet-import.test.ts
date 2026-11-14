import { describe, it, expect } from 'vitest';
import { importModule, importInverter, importBattery, verify, usableForQuotation, parseCsv, parseCsvLine } from '@/lib/solar/design/datasheet';
import { validateStrings } from '@/lib/solar/design/validate';

// TEST rows: values shaped like a datasheet, used only to exercise the checks.
const PROV = { manufacturer: 'TestCo', datasheetUrl: 'https://example.com/ds.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-15', enteredBy: 'Engineer A', enteredOn: '2026-11-14' };
const MOD = { ...PROV, model: 'TM-550', pmaxW: '550', vocV: '49.5', iscA: '13.9', vmpV: '41.5', impA: '13.25', betaVocPct: '-0.27', betaVmpPct: '-0.35', alphaIscPct: '0.048', gammaPmaxPct: '-0.35', noctC: '45', maxSystemV: '1500', maxSeriesFuseA: '25' };
const INV = { ...PROV, model: 'TI-15', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40', batteryMaxDischargeKw: '', batteryMaxChargeKw: '', generatorCompatibility: '' };
const BAT = { ...PROV, model: 'TB-5', nominalKwh: '5.12', usableDoD: '0.9', dischargeEfficiency: '0.95', maxDischargeC: '1', maxChargeC: '0.5' };

describe('CSV parsing', () => {
  it('quoted fields with commas and escaped quotes', () => {
    expect(parseCsvLine('a,"b, c","say ""hi""",4')).toEqual(['a', 'b, c', 'say "hi"', '4']);
  });
  it('comment lines skipped; header mapped', () => {
    const rows = parseCsv('# note\nmodel,pmaxW\nX,550\n');
    expect(rows).toEqual([{ model: 'X', pmaxW: '550' }]);
  });
});

describe('module import', () => {
  it('a consistent row imports as unverified, id from manufacturer + model + revision', () => {
    const r = importModule(MOD);
    expect(r.errors).toEqual([]);
    expect(r.entry!.status).toBe('unverified');
    expect(r.entry!.id).toBe('testco|tm-550|a');
    expect(r.entry!.data.datasheet).toMatch(/rev A \(2026-01-15\) https:/);
  });
  it.each([
    [{ betaVocPct: '0.27' }, /negative/],
    [{ betaVocPct: '-135' }, /mV\/°C/],
    [{ vmpV: '50' }, /Vmp must be below Voc/],
    [{ impA: '14.5' }, /Imp must be below Isc/],
    [{ pmaxW: '600' }, /does not match Pmax/],
    [{ vocV: '49.5 V' }, /number only/],
    [{ datasheetUrl: 'http://example.com' }, /https/],
    [{ datasheetDate: 'Jan 2026x' }, /date/],
    [{ maxSystemV: '' }, /maxSystemV is required/],
    [{ alphaIscPct: '-0.05' }, /α_Isc/],
  ])('refuses %o', (patch, msg) => {
    const r = importModule({ ...MOD, ...patch });
    expect(r.entry).toBeNull();
    expect(r.errors.join(' ')).toMatch(msg);
  });
  it('warns on an unusual NOCT and a fuse rating that leaves no fuse window', () => {
    const r = importModule({ ...MOD, noctC: '52', maxSeriesFuseA: '20' });
    expect(r.entry!.warnings.join(' ')).toMatch(/NOCT/);
    expect(r.entry!.warnings.join(' ')).toMatch(/fusing will be impossible/);
  });
});

describe('inverter and battery import', () => {
  it('inverter without a generator statement imports with a warning', () => {
    const r = importInverter(INV);
    expect(r.entry!.data.generatorCompatibility).toBeNull();
    expect(r.entry!.warnings.join(' ')).toMatch(/generator/);
  });
  it('inverter MPPT window above max DC voltage refused', () => {
    expect(importInverter({ ...INV, mpptMaxV: '1100' }).errors.join(' ')).toMatch(/MPPT/);
  });
  it('battery DoD entered as a percentage refused', () => {
    expect(importBattery({ ...BAT, usableDoD: '90' }).errors.join(' ')).toMatch(/fraction/);
  });
  it('battery current entered as C-rate warns', () => {
    expect(importBattery({ ...BAT, maxDischargeC: '100' }).entry!.warnings.join(' ')).toMatch(/C-rate/);
  });
});

describe('second-person verification gates quotation', () => {
  it('unverified entries cannot be quoted', () => {
    const m = importModule(MOD).entry!;
    expect(usableForQuotation(m).ok).toBe(false);
  });
  it('the person who entered it cannot verify it', () => {
    const m = importModule(MOD).entry!;
    expect(() => verify(m, 'engineer a', '2026-11-15')).toThrow(/different person/);
  });
  it('verified by a second person → usable', () => {
    const m = verify(importModule(MOD).entry!, 'Engineer B', '2026-11-15');
    const i = verify(importInverter(INV).entry!, 'Engineer B', '2026-11-15');
    expect(usableForQuotation(m, i).ok).toBe(true);
    expect(m.provenance.verifiedBy).toBe('Engineer B');
  });
});

describe('imported components drive the string checks at temperature extremes', () => {
  const m = importModule(MOD).entry!.data;
  const i = importInverter(INV).entry!.data;
  // Test design temperatures (inputs for this test, not climate records):
  // a cold highland site (record low −2 °C) and a hot lowland site (max ambient 42 °C).
  it('cold highland, 19 modules: Voc 49.5 × (1 + 0.0027 × 27) × 19 = 1009.06 V > 1000 V → refused', () => {
    const r = validateStrings(m, i, { modulesPerString: 19, stringsPerMppt: [1] }, { recordLowC: -2, maxAmbientC: 28 });
    const c = r.checks.find((x) => x.id === 'cold-voc')!;
    expect(c.value).toBeCloseTo(1009.06, 1);
    expect(c.verdict).toBe('REFUSE');
  });
  it('hot lowland, 6 modules: Tcell 73.25 °C; Vmp 41.5 × (1 − 0.0035 × 48.25) × 6 = 206.95 V ≥ 200 V passes; 5 modules refused', () => {
    const r6 = validateStrings(m, i, { modulesPerString: 6, stringsPerMppt: [1] }, { recordLowC: 15, maxAmbientC: 42 });
    expect(r6.checks.find((x) => x.id === 'hot-vmp')!.value).toBeCloseTo(206.95, 1);
    expect(r6.checks.find((x) => x.id === 'hot-vmp')!.verdict).toBe('PASS');
    const r5 = validateStrings(m, i, { modulesPerString: 5, stringsPerMppt: [1] }, { recordLowC: 15, maxAmbientC: 42 });
    expect(r5.checks.find((x) => x.id === 'hot-vmp')!.verdict).toBe('REFUSE');
  });
});
