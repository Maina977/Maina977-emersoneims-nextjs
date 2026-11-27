/**
 * Review 328c44aa, M4 (management correction 2026-11-27): the two live cable sizers chose cable
 * from the 30 °C table with no correction. A 4 mm² cable (36 A at 30 °C, 31.3 A at 40 °C) went on
 * a 32 A breaker. Rule now: Iz = Iz,tab × Ca × Cg ≥ In and design current ≤ In; Ca (B.52.14) and
 * Cg (B.52.17) are lib/solar-genius's own tables; ambient not entered = assumed 40 °C, one circuit.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import SolarCalculatorEngine, { sizeConductor, conductorBasis } from '@/components/solar-modules/crc/core/calculator/SolarCalculatorEngine';
import { sizeAcCable, CABLE_B1_TWO_LOADED } from '@/components/solar/acCableSizing';
import { ambientFactorPvcAir, groupingFactorAir, AMBIENT_AIR_PVC, GROUPING_AIR } from '@/lib/solar/cableCorrections';

const req = createRequire(import.meta.url);
const lib = req(path.join(process.cwd(), 'lib/solar-genius/server/engineering-approval.js')) as {
  cableAmpacityDerated: (p: Record<string, unknown>) => { baseAmpacityA: number; deratedAmpacityA: number; correctionFactors: { ambientTemperature: number; grouping: number } };
};
const libC = (csaMm2: number, installationMethod: string, ambientC: number, groupedCircuits = 1) =>
  lib.cableAmpacityDerated({ conductorMaterial: 'copper', csaMm2, installationMethod, ambientC, groupedCircuits, insulationType: 'PVC' });
const LIB_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

describe('hand-worked cases (management)', () => {
  it('32 A at 40 °C, method C, PVC: 4 mm² (Iz 36 × 0.87 = 31.32 A) is NOT selected; 6 mm² (46 × 0.87 = 40.02 A) is', () => {
    const c = sizeConductor(32, 1, 230, 100, { ambientC: 40 })!;
    expect(c.mm2).toBe(6);
    expect(c.izA).toBeCloseTo(40.02, 2);
    expect(36 * 0.87).toBeLessThan(32);
    expect(conductorBasis(c, 32, { ambientC: 40 })).toContain('Iz = 46 × 0.87 × 1.00 = 40.02 A ≥ In 32 A');
  });
  it('160 A battery at 40 °C: 50 mm² (168 × 0.87 = 146.16 A) is NOT selected; 70 mm² (213 × 0.87 = 185.31 A) is', () => {
    const c = sizeConductor(160, 3, 48, 1, { ambientC: 40 })!;
    expect(c.mm2).toBe(70);
    expect(c.izA).toBeCloseTo(185.31, 2);
  });
  it('ambient not entered = assumed 40 °C, one circuit, and the basis says so', () => {
    expect(sizeConductor(32, 1, 230, 100)!.mm2).toBe(6);
    const b = conductorBasis(sizeConductor(32, 1, 230, 100), 32);
    expect(b).toContain('assumed design ambient 40 °C — enter the site value');
    expect(b).toContain('one circuit assumed');
    expect(b).toMatch(/method C .*Ca 0\.87 \(Table B\.52\.14\), Cg 1\.00 \(Table B\.52\.17\); Iz = .* ≥ In 32 A/);
  });
  it('at a site ambient of 30 °C the old 30 °C choice (4 mm² for 32 A) is still what the table gives', () => {
    expect(sizeConductor(32, 1, 230, 100, { ambientC: 30 })!.mm2).toBe(4);
  });
  it('grouping is applied: 32 A, 40 °C, 3 circuits: Cg 0.70, so 6 mm² (28.0 A) fails and 10 mm² (63 × 0.87 × 0.70 = 38.4 A) is chosen', () => {
    expect(sizeConductor(32, 1, 230, 100, { ambientC: 40, circuits: 3 })!.mm2).toBe(10);
  });
  it('above 60 °C PVC has no rating: no size is offered', () => {
    expect(sizeConductor(10, 1, 230, 100, { ambientC: 65 })).toBeNull();
  });
});

describe('/solar-genius-pro wiring table: every size carries method, ambient, Ca, Cg, Iz and In', () => {
  const e = new SolarCalculatorEngine();
  it('5 kW hybrid at the assumed 40 °C: AC 32 A MCB on 6 mm² (was 4 mm²); battery 160 A on 70 mm² (was 50 mm²)', () => {
    const specs = e.generateWiringSpecs({ panels: 12, panelWatt: 550, inverterKw: 5, batteryKwh: 10, systemType: 'hybrid' } as never);
    const ac = specs.find((s) => /AC out/.test(s.segment))!;
    const bat = specs.find((s) => /Battery/.test(s.segment))!;
    expect(ac.breaker).toBe('32 A AC MCB');
    expect(ac.cableSize).toBe('6');
    expect(bat.breaker).toBe('160 A DC breaker or fuse');
    expect(bat.cableSize).toBe('70');
  });
  it('for every spec with a size: Iz,tab × Ca × Cg ≥ In and the basis states all of them', () => {
    const amps: Record<string, number> = { '1.5': 19.5, '2.5': 27, '4': 36, '6': 46, '10': 63, '16': 85, '25': 112, '35': 138, '50': 168, '70': 213, '95': 258, '120': 299, '150': 344, '185': 392, '240': 461 };
    for (const kw of [3, 3.6, 5, 8, 10, 12]) for (const amb of [undefined, 25, 30, 35, 40, 45, 50]) {
      const specs = e.generateWiringSpecs({ panels: 20, panelWatt: 550, inverterKw: kw, batteryKwh: 10, systemType: 'hybrid' } as never, { ambientC: amb });
      for (const s of specs) {
        expect(s.sizingBasis, s.segment).toMatch(/installation method C/);
        expect(s.sizingBasis).toContain(amb === undefined ? 'assumed design ambient 40 °C' : `site ambient ${amb} °C`);
        if (s.cableSize === '—') continue;
        const m = /In ([\d.]+) A/.exec(s.sizingBasis)!;
        const ca = ambientFactorPvcAir(amb ?? 40)!;
        expect(amps[s.cableSize] * ca).toBeGreaterThanOrEqual(Number(m[1]));
        expect(s.sizingBasis).toMatch(/Ca \d\.\d\d \(Table B\.52\.14\), Cg 1\.00 \(Table B\.52\.17\); Iz = /);
        const br = /(\d+) A/.exec(s.breaker);
        if (br && !/fuse per string/.test(s.breaker)) expect(Number(m[1])).toBe(Number(br[1]));
        expect(s.current).toBeLessThanOrEqual(Number(m[1]) + 0.05); // design current ≤ In
      }
    }
  });
  it('the page has the ambient input and renders the basis in the size cell', () => {
    const s = read('components/solar-modules/crc/components/calculator/AdvancedSolarCalculator.tsx');
    expect(s).toContain('<label htmlFor="ac-ambient">Site design ambient for cables (°C, blank = assumed 40)</label>');
    expect(s).toContain('calculator.buildResult(location, load, s, { ambientC: amb })');
    expect(s).toMatch(/<td>\{spec\.cableSize\} mm²<div className="cable-sizing-basis"[^>]*>\{spec\.sizingBasis\}<\/div><\/td>/);
  });
});

describe('/solar-design-studio AC cable', () => {
  it('5 kW single phase, assumed 40 °C, B1 two loaded: 32 A MCB; 4 mm² (32 × 0.87 = 27.84 A) fails; 6 mm² (41 × 0.87 = 35.67 A)', () => {
    const c = sizeAcCable(5);
    expect(c.breakerA).toBe(32);
    expect(c.csaMm2).toBe(6);
    expect(c.basis).toContain('installation method B1 (in conduit), two loaded conductors; assumed design ambient 40 °C — enter the site value; one circuit assumed; Ca 0.87 (Table B.52.14), Cg 1.00 (Table B.52.17); Iz = 41 × 0.87 × 1.00 = 35.67 A ≥ In 32 A');
    expect(sizeAcCable(5, { ambientC: 30 }).csaMm2).toBe(4); // the old 30 °C answer
  });
  it('15 kW three phase, 40 °C, B1 three loaded: 32 A MCB; 6 mm² (36 × 0.87 = 31.32 A) fails; 10 mm² (43.5 A)', () => {
    const c = sizeAcCable(15);
    expect(c.breakerA).toBe(32);
    expect(c.csaMm2).toBe(10);
  });
  it('the page has the ambient input and shows the basis next to the size, on screen and in the text specification', () => {
    const s = read('components/solar/SolarDesignStudioPro.tsx');
    expect(s).toContain('Site design ambient for the AC cable (°C, blank = assumed 40)');
    expect(s).toMatch(/<td>\{acWire\}<div className="[^"]*">\{AC_CABLE_BASIS\}<\/div><\/td>/);
    expect(s).toMatch(/AC Cable Size +: \$\{acWire\} \(to DB; rated at least the breaker\)\r?\n +\$\{AC_CABLE_BASIS\}/);
    expect(s).toContain('const AC_CABLE_BASIS = ac.basis;');
  });
});

describe('lib and the two sizers agree on equivalent inputs', () => {
  it('Ca and Cg equal what lib cableAmpacityDerated applies (method C, PVC)', () => {
    for (const t of [0, 5, 10, 12, 15, 20, 25, 28, 30, 32, 35, 38, 40, 41, 45, 50, 55, 60]) expect(ambientFactorPvcAir(t), `${t} °C`).toBe(libC(6, 'C', t).correctionFactors.ambientTemperature);
    expect(() => libC(6, 'C', 61)).toThrow();
    expect(ambientFactorPvcAir(61)).toBeUndefined();
    for (let n = 1; n <= 20; n++) expect(groupingFactorAir(n), `${n} circuits`).toBe(libC(6, 'C', 30, n).correctionFactors.grouping);
    expect(() => libC(6, 'C', 30, 21)).toThrow();
    expect(groupingFactorAir(21)).toBeUndefined();
    expect(Object.keys(AMBIENT_AIR_PVC).length).toBe(11);
    expect(Object.keys(GROUPING_AIR).length).toBe(12);
  });
  it('engine (method C) picks the smallest size whose lib-derated rating carries In, 1.5–120 mm²', () => {
    let cases = 0;
    for (const t of [25, 30, 35, 40, 45, 50]) for (const n of [1, 2, 3, 6]) for (const In of [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160]) {
      const libPick = LIB_SIZES.find((mm2) => libC(mm2, 'C', t, n).deratedAmpacityA >= In);
      if (libPick === undefined) continue;
      const mine = sizeConductor(In, 0.001, 230, 100, { ambientC: t, circuits: n })!;
      expect(mine.mm2, `${In} A, ${t} °C, ${n} circuits`).toBe(libPick);
      // Same factors, multiplied in a different order: equal to within float rounding (0.01 A).
      expect(Math.abs(mine.izA - libC(mine.mm2, 'C', t, n).deratedAmpacityA)).toBeLessThanOrEqual(0.0101);
      cases++;
    }
    expect(cases).toBeGreaterThan(200);
  });
  it('studio (single phase, B1 two loaded) picks the size lib method B1 gives', () => {
    for (const [mm2, iz] of CABLE_B1_TWO_LOADED) expect(libC(mm2, 'B1', 30).baseAmpacityA, `${mm2} mm²`).toBe(iz);
    let cases = 0;
    for (const t of [25, 30, 35, 40, 45, 50]) for (const kw of [1, 2, 3, 5, 8, 10]) {
      const c = sizeAcCable(kw, { ambientC: t });
      const libPick = LIB_SIZES.filter((s) => s >= 4).find((mm2) => libC(mm2, 'B1', t).deratedAmpacityA >= c.breakerA!);
      expect(c.csaMm2, `${kw} kW, ${t} °C`).toBe(libPick);
      cases++;
    }
    expect(cases).toBe(36);
  });
});
