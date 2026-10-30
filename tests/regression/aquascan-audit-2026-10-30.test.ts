/**
 * AquaScan round-6 audit (2026-10-30): strict coordinates, Kenya's real
 * outline, an honest GRACE trend error, named months, lab results that never
 * pass an untested parameter, and one water-quality section everywhere.
 */
import { describe, it, expect } from 'vitest';
import { parseCoordPair, parseCoordValue } from '../../external/borehole-ai-engine/src/coordParse';
import { inKenya } from '../../external/borehole-ai-engine/src/kenyaLand';
import { olsTrend } from '../../external/borehole-ai-engine/src/advancedHydroEngine';
import { governingSummary, last12Months, probabilityBand } from '../../external/borehole-ai-engine/src/governingSummary';
import { calibrateWithFieldData } from '../../external/borehole-ai-engine/src/fieldCalibrationEngine';
import { generateSubsurfaceModel } from '../../external/borehole-ai-engine/src/subsurfaceModeler';
import { WaterQualityAnalyzer } from '../../external/borehole-ai-engine/src/waterQualityAnalyzer';

describe('coordinates are parsed strictly', () => {
  it('reads hemispheres, comma decimals and DMS', () => {
    expect(parseCoordPair('1.2921 S', '36.8219 E')).toEqual({ lat: -1.2921, lon: 36.8219 });
    expect(parseCoordPair('-1,2921', '36,8219')).toEqual({ lat: -1.2921, lon: 36.8219 });
    expect(parseCoordPair('36.8219 E, 1.2921 S', '')).toEqual({ lat: -1.2921, lon: 36.8219 });
    expect(parseCoordPair('-1.2921,36.8219', '')).toEqual({ lat: -1.2921, lon: 36.8219 });
    const dms = parseCoordValue(`1°17'31.6"S`)!;
    expect(dms.value).toBeCloseTo(-1.29211, 4);
    expect(dms.axis).toBe('lat');
  });
  it('refuses trailing text and contradictions', () => {
    expect('error' in parseCoordPair('34.6abc', '0.02')).toBe(true);
    expect('error' in parseCoordPair('-1.29 S', '36.8')).toBe(true);
    expect('error' in parseCoordPair('1.29 S', '0.5 N')).toBe(true);
    expect(parseCoordValue(`1°75'0"S`)).toBeNull();
  });
});

describe('Kenya land check uses the real outline', () => {
  it('accepts border, coastal and island towns', () => {
    for (const [la, lo] of [[-1.2921, 36.8219], [-4.0435, 39.6682], [3.5167, 39.0584], [0.4608, 34.1115], [-2.2717, 40.902], [-0.465, 34.0], [4.93385, 34.56121]]) expect(inKenya(la, lo)).toBe(true);
  });
  it('refuses the sea and neighbours', () => {
    for (const [la, lo] of [[-4.06, 39.78], [-3.22, 40.2], [0.6929, 34.1809], [-3.3869, 36.683], [0.47, 34.05], [4.08394, 38.1507]]) expect(inKenya(la, lo)).toBe(false);
  });
});

describe('GRACE trend error', () => {
  const months: string[] = [];
  for (let y = 2003; y <= 2022; y++) for (let m = 1; m <= 12; m++) months.push(`${y}-${String(m).padStart(2, '0')}`);
  it('removes the seasonal cycle: a pure annual cycle has no trend and the trend is recovered under one', () => {
    const season = months.map((m) => 8 * Math.sin((Number(m.slice(5)) / 12) * 2 * Math.PI));
    const flat = olsTrend(months, season)!;
    expect(Math.abs(flat.slope)).toBeLessThan(0.05);
    const trended = olsTrend(months, season.map((v, i) => v + 0.5 * (i / 12)))!;
    expect(trended.slope).toBeCloseTo(0.5, 2);
  });
  it('widens the error for autocorrelated residuals', () => {
    let e = 0; let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
    const red = months.map(() => (e = 0.9 * e + rnd()));
    const t = olsTrend(months, red)!;
    expect(t.nEff).toBeLessThan(t.n / 4);
  });
});

describe('named months and probability band', () => {
  it('names the 12 months ending a record', () => {
    expect(last12Months('2002-04 to 2025-06')).toBe('Jul 2024 to Jun 2025');
    expect(last12Months('2002-04 to 2024-12')).toBe('Jan 2024 to Dec 2024');
    expect(last12Months('n/a')).toBeNull();
  });
  it('bands a probability', () => {
    expect(probabilityBand(0.68)).toBe('about 7 in 10');
    expect(probabilityBand(0.02)).toBe('about 1 in 10');
  });
});

describe('laboratory results', () => {
  const desktop: any = { recommendedDepth: 80, estimatedYield: 3, probability: 0.6, waterQuality: { tds: 400, pH: 7.2 } };
  it('an untested coliform is never a pass', () => {
    const cal = calibrateWithFieldData(desktop, { labWaterAnalysis: { labName: 'X', sampleDate: '2026-10-01', tds: 350 } } as any);
    expect(cal.calibratedWaterQuality!.isPotable).toBe(false);
    expect(cal.calibrationNotes.join(' ')).toMatch(/Not yet tested: coliform/);
  });
  it('lab values govern the water-quality section, untested ones say so', () => {
    const cal = calibrateWithFieldData(desktop, { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-10-01', tds: 350, fluoride: 2.1 } } as any);
    const r: any = { probability: 0.6, recommendedDepth: 80, estimatedYield: 3, site: {}, waterQuality: { tds: 900, fluoride: 0.5 }, calibrationResult: cal };
    const wq = governingSummary(r, 'Test').find((s) => s.title === 'Water quality')!;
    const row = (k: string) => wq.rows.find((x) => x[0] === k)!;
    expect(row('Salinity (TDS)')[1]).toBe('350 mg/L');
    expect(row('Salinity (TDS)')[2]).toMatch(/Laboratory test \(KEBS, 2026-10-01\)/);
    expect(row('Bacteria (coliform)')[1]).toBe('not tested');
    expect(row('Safe to drink')[1]).toBe('Not confirmed');
  });
});

describe('SoilGrids values are read in their real units', () => {
  // Kitale, as ISRIC returns it: clay 476 g/kg, pH x10, bulk density cg/cm3.
  const kitale = { available: true, clay: 476, sand: 280, silt: 244, phH2O: 58, organicCarbon: 220, bulkDensity: 130, cec: 210 };
  it('the soil layers come out physically possible', () => {
    const m = generateSubsurfaceModel(kitale, 1900, 30, 1, 35);
    const top: any = m.lithologicalColumn.layers[0];
    expect(top.clay).toBeGreaterThan(40);
    expect(top.clay).toBeLessThanOrEqual(65);
    expect(top.sand).toBeLessThan(100);
    expect(top.pH).toBeGreaterThan(5);
    expect(top.pH).toBeLessThan(8.3);
    expect(top.bulkDensity).toBeGreaterThan(1000);
    expect(top.bulkDensity).toBeLessThanOrEqual(1950);
    expect(top.porosity).toBeGreaterThan(0.2);
    expect(top.porosity).toBeLessThan(0.7);
  });
});

describe('water quality from real soil values', () => {
  it('a fertile highland soil (mmol/kg CEC) is not called saline', () => {
    const a: any = new WaterQualityAnalyzer();
    const q = a.calculateBaseQualityFromSoilGrids({ clay: 476, sand: 280, phH2O: 58, organicCarbon: 220, bulkDensity: 130, cec: 210, nitrogen: 300 }, 61);
    expect(q.tds).toBeLessThan(600);
    expect(q.hardness).toBeLessThan(300);
  });
});
