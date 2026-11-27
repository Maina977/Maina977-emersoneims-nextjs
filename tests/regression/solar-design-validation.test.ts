import { describe, it, expect } from 'vitest';
import { validateStrings, checkCable, checkBattery, checkGenerator, cellTemperature, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';

// Test component: values typical of a 600 W-class bifacial module datasheet;
// the hand calculations below use exactly these numbers.
const MOD: Module = {
  model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1,
  betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45,
  maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A',
};
const INV: Inverter = {
  model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2,
  maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 10, batteryMaxChargeKw: 10,
  generatorCompatibility: null, datasheet: 'test inverter datasheet rev B',
};
const NAIROBI = { recordLowC: 10, maxAmbientC: 35 };
const get = (r: ReturnType<typeof validateStrings>, id: string) => r.checks.find((c) => c.id === id)!;

describe('temperature corrections (hand calculations)', () => {
  it('NOCT cell model: 35 °C + (45 − 20)/800 × 1000 = 66.25 °C', () => expect(cellTemperature(35, 45)).toBeCloseTo(66.25, 10));
  it('cold Voc: 49.5 × (1 + 0.0027 × 15) × 16 = 824.08 V', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'cold-voc').value).toBeCloseTo(824.08, 2);
    expect(get(r, 'cold-voc').verdict).toBe('PASS');
  });
  it('hot Vmp: 41.5 × (1 − 0.0035 × 41.25) × 16 = 568.13 V', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'hot-vmp').value).toBeCloseTo(568.13, 1);
  });
  it('cold Vmp: 41.5 × 1.0525 × 16 = 698.86 V', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'cold-vmp').value).toBeCloseTo(698.86, 1);
  });
});

describe('unsafe designs are refused', () => {
  it('20 modules: cold Voc 1030.1 V exceeds the 1000 V inverter limit', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 20, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'cold-voc').verdict).toBe('REFUSE');
    expect(r.valid).toBe(false);
  });
  it('colder site moves the limit: 19 modules pass at 10 °C but fail at −10 °C', () => {
    expect(get(validateStrings(MOD, INV, { modulesPerString: 19, stringsPerMppt: [1] }, NAIROBI), 'cold-voc').verdict).toBe('PASS');
    expect(get(validateStrings(MOD, INV, { modulesPerString: 19, stringsPerMppt: [1] }, { recordLowC: -10, maxAmbientC: 30 }), 'cold-voc').verdict).toBe('REFUSE');
  });
  it('module max system voltage applies when it is lower than the inverter', () => {
    const r = validateStrings({ ...MOD, maxSystemV: 600 }, INV, { modulesPerString: 12, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'cold-voc').limit).toBe(600);
    expect(get(r, 'cold-voc').verdict).toBe('REFUSE');
  });
  it('5 modules: hot Vmp 177.5 V below the 200 V MPPT minimum', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 5, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'hot-vmp').value).toBeCloseTo(177.54, 1);
    expect(get(r, 'hot-vmp').verdict).toBe('REFUSE');
  });
  it('3 strings: Isc × 1.25 = 52.1 A over the 40 A MPPT limit', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [3] }, NAIROBI);
    expect(get(r, 'isc-mppt1').value).toBeCloseTo(52.13, 1);
    expect(get(r, 'isc-mppt1').verdict).toBe('REFUSE');
  });
  it('more MPPTs than the inverter has → refused with the reason', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1, 1, 1] }, NAIROBI);
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toMatch(/inverter has 2/);
  });
});

describe('warnings that do not refuse', () => {
  it('2 strings: 26.2 A is 0.8 % over 26 A → clipping warning', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [2, 2] }, NAIROBI);
    expect(get(r, 'imp-mppt1').verdict).toBe('WARN');
    expect(get(r, 'isc-mppt1').verdict).toBe('PASS'); // 34.75 A ≤ 40 A
    expect(r.kWp).toBeCloseTo(35.2, 5);
  });
  it('DC/AC ratio 35.2 / 15 = 2.35 → warning, reported', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [2, 2] }, NAIROBI);
    expect(get(r, 'dc-ac').value).toBeCloseTo(2.35, 2);
    expect(get(r, 'dc-ac').verdict).toBe('WARN');
  });
  it('DC/AC inside 1.0–1.35 passes: 16 × 2 × 550 W = 17.6 kWp on 15 kW = 1.17', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1, 1] }, NAIROBI);
    expect(get(r, 'dc-ac').value).toBeCloseTo(1.17, 2);
    expect(get(r, 'dc-ac').verdict).toBe('PASS');
    expect(r.valid).toBe(true);
  });
});

describe('string fusing (IEC 62548-1)', () => {
  it('1 string: not required', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1] }, NAIROBI);
    expect(get(r, 'fusing-mppt1').verdict).toBe('PASS');
  });
  it('3 strings: required, window 1.5 × 13.9 = 20.85 A to min(2.4 × 13.9, 25) = 25 A', () => {
    const big = { ...INV, maxInputA: 50, maxIscA: 60 };
    const r = validateStrings(MOD, big, { modulesPerString: 16, stringsPerMppt: [3] }, NAIROBI);
    const f = get(r, 'fusing-mppt1');
    expect(f.verdict).toBe('WARN');
    expect(f.note).toMatch(/above 20.85 A and at most 25 A/);
  });
  it('2 strings with a low module fuse rating: reverse current 17.4 A > 15 A → required', () => {
    const r = validateStrings({ ...MOD, maxSeriesFuseA: 15 }, INV, { modulesPerString: 16, stringsPerMppt: [2] }, NAIROBI);
    expect(get(r, 'fusing-mppt1').verdict).toBe('WARN');
  });
  it('no valid fuse rating (1.5 × Isc ≥ module max fuse) → refused', () => {
    const big = { ...INV, maxInputA: 50, maxIscA: 60 };
    const r = validateStrings({ ...MOD, maxSeriesFuseA: 20 }, big, { modulesPerString: 16, stringsPerMppt: [3] }, NAIROBI);
    expect(get(r, 'fuse-window-mppt1').verdict).toBe('REFUSE');
  });
});

describe('invalid datasheet entries are refused, not guessed', () => {
  it.each([
    [{ betaVocPct: 0.27 }, /negative/],
    [{ betaVocPct: -140 }, /mV/],
    [{ vmpV: 52 }, /Vmp must be below Voc/],
    [{ impA: 14 }, /Imp must be below Isc/],
    [{ datasheet: '' }, /datasheet/],
    [{ vocV: NaN }, /Voc must be a positive/],
  ])('%o', (patch, msg) => {
    const r = validateStrings({ ...MOD, ...patch } as Module, INV, { modulesPerString: 16, stringsPerMppt: [1] }, NAIROBI);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(msg);
  });
  it('fractional module count refused', () => {
    expect(validateStrings(MOD, INV, { modulesPerString: 15.5, stringsPerMppt: [1] }, NAIROBI).valid).toBe(false);
  });
  it('impossible site temperatures refused', () => {
    expect(validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1] }, { recordLowC: 30, maxAmbientC: 20 }).errors.length).toBeGreaterThan(0);
  });
});

describe('cables (IEC 60364-5-52)', () => {
  // REQ-05: a PASS needs the installation method and the conductor (missing data is never compliant; see solar-req05-cables-ac-protection.test.ts).
  const run = { name: 'string 1', lengthM: 40, csaMm2: 6, designCurrentA: 17.4, systemV: 568, tabulatedAmpacityA: 70, ambientFactor: 0.87, groupingFactor: 0.8, maxDropPct: 1.5, method: 'C', conductor: 'copper' as const };
  it('ΔV = 2 × 40 × 17.4 × 0.0225 ÷ 6 = 5.22 V = 0.92 %', () => {
    const c = checkCable(run).checks.find((x) => x.id.startsWith('vdrop'))!;
    expect(c.value).toBeCloseTo(0.92, 2);
    expect(c.verdict).toBe('PASS');
  });
  it('I_z = 70 × 0.87 × 0.8 = 48.72 A ≥ 17.4 A', () => {
    const c = checkCable(run).checks.find((x) => x.id.startsWith('ampacity'))!;
    expect(c.limit).toBeCloseTo(48.72, 2);
    expect(c.verdict).toBe('PASS');
  });
  it('overloaded cable refused', () => {
    expect(checkCable({ ...run, designCurrentA: 60 }).checks.find((x) => x.id.startsWith('ampacity'))!.verdict).toBe('REFUSE');
  });
  it('made-up correction factor refused', () => {
    expect(checkCable({ ...run, groupingFactor: 1.4 }).errors.length).toBe(1);
  });
});

describe('battery', () => {
  const BAT: Battery = { model: 'test-battery', nominalKwh: 5.12, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 1, maxChargeC: 0.5, datasheet: 'test battery datasheet' };
  it('20 kWh usable → 20 ÷ (0.9 × 0.95) = 23.39 kWh nominal; 5 units = 25.6 kWh passes', () => {
    const r = checkBattery(BAT, INV, 20, 5);
    expect(r.requiredNominalKwh).toBeCloseTo(23.39, 2);
    expect(r.checks[0].verdict).toBe('PASS');
  });
  it('4 units (20.48 kWh) is not enough → refused', () => {
    expect(checkBattery(BAT, INV, 20, 4).checks[0].verdict).toBe('REFUSE');
  });
  it('charge C-rate 10 kW ÷ 10.24 kWh = 0.98 C over the 0.5 C limit → refused', () => {
    const r = checkBattery(BAT, INV, 8, 2);
    const c = r.checks.find((x) => x.id === 'battery-charge-c')!;
    expect(c.value).toBeCloseTo(0.98, 2);
    expect(c.verdict).toBe('REFUSE');
  });
  it('DoD above 1 refused', () => expect(checkBattery({ ...BAT, usableDoD: 1.2 }, INV, 10, 3).errors.length).toBe(1));
});

describe('hybrid with a generator: never assumed safe', () => {
  it('no manufacturer compatibility statement → refused', () => {
    expect(checkGenerator(INV, { ratedKw: 50 }, 20, false)[0].verdict).toBe('REFUSE');
  });
  it('listed inverter, 12 kW minimum load on 50 kW (needs 15 kW) → light-loading warning', () => {
    const c = checkGenerator({ ...INV, generatorCompatibility: 'Datasheet §4: generator input supported' }, { ratedKw: 50 }, 12, false);
    expect(c[0].verdict).toBe('PASS');
    expect(c[1].verdict).toBe('WARN');
    expect(c[1].limit).toBe(15);
  });
  it('OEM minimum load figure replaces the 30 % default', () => {
    const c = checkGenerator({ ...INV, generatorCompatibility: 'yes' }, { ratedKw: 50, oemMinLoadPct: 20 }, 12, false);
    expect(c[1].verdict).toBe('PASS');
    expect(c[1].reference).toMatch(/OEM/);
  });
  it('PV that can back-feed a running generator → refused', () => {
    const c = checkGenerator({ ...INV, generatorCompatibility: 'yes' }, { ratedKw: 50 }, 30, true);
    expect(c.find((x) => x.id === 'gen-reverse-power')!.verdict).toBe('REFUSE');
  });
});

describe('determinism', () => {
  it('identical inputs give identical output', () => {
    const a = JSON.stringify(validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [2, 1] }, NAIROBI));
    for (let i = 0; i < 50; i++) expect(JSON.stringify(validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [2, 1] }, NAIROBI))).toBe(a);
  });
});
