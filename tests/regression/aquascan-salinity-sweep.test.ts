/**
 * 2026-11-21 salinity sweep: wherever a MODELLED salinity reaches the reader
 * (page, PDF, Word, Excel, CSV, JSON, comparison) it is a screening class with
 * no concentration figure, no threshold attached to it and no treatment cost or
 * RO sizing. Measured values (laboratory, or the median of 3+ boreholes nearby)
 * keep their figures with their source.
 */
import { describe, it, expect } from 'vitest';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import { computeCanonicalEconomics } from '@/external/borehole-ai-engine/src/reportShared';
import { harmonizeHydrochem } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { redactModelledSalinity, screeningValues } from '@/external/borehole-ai-engine/src/reportGenerator';
import { calibrateWithFieldData } from '@/external/borehole-ai-engine/src/fieldCalibrationEngine';
import { salinityFromWaterQuality } from '@/external/borehole-ai-engine/src/verdict';

const MQ = { radius_km: 25, ec: { n: 7, median: 4200, over1500: 7, over3000: 4 } };
const base = (wq: Record<string, unknown>) => ({
  probability: 0.7, recommendedDepth: 90, estimatedYield: 3, site: { latitude: -0.45, longitude: 39.65 },
  risk: { overallRisk: 0.3 }, waterQuality: { fluoride: 0.6, iron: 0.1, isPotable: false, treatmentRequired: [], ...wq },
}) as any;
const modelled = (tds: number) => base({ tds, treatmentRequired: ['Desalination (reverse osmosis) only if a laboratory test of the first water confirms high salinity'] });
const measured = (tds: number) => base({ tds, measuredNearby: MQ });

const section = (r: any, title: string) => governingSummary(r, 'Test site').find((s) => s.title === title)!;
const row = (r: any, title: string, label: string) => section(r, title).rows.find((x) => x[0] === label);
const allText = (r: any) => governingSummary(r, 'Test site').flatMap((s) => [...s.rows.flat(), ...(s.notes ?? [])]).join(' | ');

describe('governing summary (Word, Excel, CSV and the Water tab): modelled salinity', () => {
  it('shows the screening class only: no mg/L figure, no "about", no threshold on the site value', () => {
    const salRow = row(modelled(8495), 'Water quality', 'Salinity (TDS)')!;
    expect(salRow[1]).toBe('Salinity risk: HIGH');
    expect(salRow[1]).not.toMatch(/mg\/L|\d/);
    expect(salRow[2]).toMatch(/^Regional screening, not measured at this site\. Regional data indicate a high risk of saline groundwater here\./);
    expect(salRow[2]).toMatch(/laboratory test of the first water is needed before drinking use or treatment design/);
    expect(salRow[2]).not.toMatch(/mg\/L|\d/);
    expect(allText(modelled(8495))).not.toMatch(/8,495|8495|about 8/);
  });
  it('an elevated model gives ELEVATED, a low one LOW, still with no figure', () => {
    expect(row(modelled(1800), 'Water quality', 'Salinity (TDS)')![1]).toBe('Salinity risk: ELEVATED');
    const low = row(modelled(400), 'Water quality', 'Salinity (TDS)')!;
    expect(low[1]).toBe('Salinity risk: LOW');
    expect(low.join(' ')).not.toMatch(/mg\/L|400/);
  });
  it('desalination is not sized or priced from a modelled value', () => {
    const r = modelled(8495);
    const eco = computeCanonicalEconomics(r);
    expect(eco.needsRO).toBe(false);
    expect(eco.salinityUnpriced).toBe(true);
    expect(eco.wqTreatmentCost).toBe(0);
    expect(eco.roRecovery).toBe(1);
    const costs = section(r, 'Costs (typical Kenyan prices, not a quotation)');
    expect(costs.rows.find((x) => /^Desalination \(reverse osmosis\)$/.test(x[0]))?.[1]).toBe('not priced');
    expect(costs.rows.some((x) => /allowance/i.test(x[0]) && /reverse osmosis/i.test(x[0]))).toBe(false);
    expect(costs.rows.map((x) => x.join(' ')).join(' ')).not.toMatch(/product water after reverse osmosis/);
  });
});

describe('governing summary: measured salinity keeps its figure and source', () => {
  it('median of 7 boreholes within 25 km', () => {
    const salRow = row(measured(5850), 'Water quality', 'Salinity (TDS)')!;
    expect(salRow[1]).toBe('5,850 mg/L');
    expect(salRow[2]).toMatch(/^Measured: median of 7 boreholes within 25 km/);
    expect(salRow[2]).not.toMatch(/Regional screening/);
  });
  it('a measured high salinity sizes and prices reverse osmosis as before', () => {
    const eco = computeCanonicalEconomics(measured(5850));
    expect(eco.needsRO).toBe(true);
    expect(eco.salinityUnpriced).toBe(false);
    expect(eco.wqTreatmentCost).toBeGreaterThanOrEqual(8000);
    expect(eco.roRecovery).toBe(0.55);
  });
  it('a laboratory TDS governs and is shown with the laboratory as source', () => {
    const desktop: any = { recommendedDepth: 90, estimatedYield: 3, probability: 0.7, waterQuality: { tds: 8495 } };
    const cal = calibrateWithFieldData(desktop, { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-11-01', tds: 2400 } } as any);
    const r = { ...modelled(8495), calibrationResult: cal };
    expect(row(r, 'Water quality', 'Salinity (TDS)')![1]).toBe('2400 mg/L');
    expect(allText(r)).not.toMatch(/8,495|8495/);
    // The calibration note compares with the desktop class, not a modelled figure.
    expect(cal.calibrationNotes.join(' ')).toMatch(/Lab TDS: 2400 mg\/L \(the desktop screen classed the salinity risk as HIGH; that class was not a measurement\)/);
    expect(cal.calibrationNotes.join(' ')).not.toMatch(/8495|predicted 8/);
  });
});

describe('hydrochemistry panel (page and PDF section 32)', () => {
  const hc = () => ({
    predictions: [
      { parameter: 'TDS', predictedValue: 1600, unit: 'mg/L', whoGuideline: 1000, exceedsGuideline: true, healthRisk: 'low', reasoning: 'rock' },
      { parameter: 'fluoride', predictedValue: 0.5, unit: 'mg/L', whoGuideline: 1.5, exceedsGuideline: false, healthRisk: 'none', reasoning: 'rock' },
    ],
    waterType: 'Na-Cl', waterTypeDescription: 'x',
    primaryConcerns: ['TDS: 1600 mg/L (WHO: 1000 mg/L)'],
    treatmentRequired: ['Reverse osmosis (high TDS)'], treatmentCost: 'very_high',
    narrative: 'Overall quality: good. Concerns: TDS: 1600 mg/L (WHO: 1000 mg/L). Treatment required: Reverse osmosis (high TDS).',
    recommendations: ['Treatment needed: Reverse osmosis (high TDS)'],
    validation: [{ parameter: 'TDS', predicted: 1600, actual: 2400, error_pct: 33.3, unit: 'mg/L' }],
  });
  it('a modelled TDS prints its class, never the figure, and buys no RO', () => {
    const out = harmonizeHydrochem(hc(), { tds: 8495, fluoride: 0.6 });
    const tds = out.predictions.find((p: any) => p.parameter === 'TDS');
    expect(tds.predictedValue).toBe(8495); // internal value kept for the quality logic
    expect(tds.displayValue).toBe('Salinity risk: HIGH (regional screening, not measured at this site)');
    const shown = JSON.stringify({ d: out.waterTypeDescription, c: out.primaryConcerns, n: out.narrative, r: out.recommendations, t: out.treatmentRequired });
    expect(shown).not.toMatch(/8,495|8495|1600|mg\/L/);
    expect(out.waterTypeDescription).toMatch(/regional data indicate a high risk of saline groundwater/);
    expect(out.treatmentCost).not.toBe('very_high');
    expect(out.treatmentRequired).toEqual(['Desalination (reverse osmosis) only if a laboratory test of the first water confirms high salinity']);
    expect(out.validation[0].predictedDisplay).toBe('ELEVATED risk (screening class, not measured at this site)');
  });
  it('a measured nearby median keeps its figure in the description', () => {
    const out = harmonizeHydrochem(hc(), { tds: 5850, fluoride: 0.6, measuredNearby: MQ });
    expect(out.waterTypeDescription).toMatch(/measured salinity \(TDS 5,850 mg\/L, median of 7 boreholes within 25 km \(sample dates not given per borehole\)\)/);
    expect(out.predictions.find((p: any) => p.parameter === 'TDS').displayValue).toBeUndefined();
  });
});

describe('JSON download and screening values', () => {
  it('withholds every modelled salinity figure and adds the screening class', () => {
    const r: any = { ...modelled(8495), hydrochemPrediction: hc2(), waterDesign: { waterChemistry: { tds_mgL: 8495, pH: 7 } }, fieldData: { labWaterAnalysis: { pH: 7.1 } } };
    const out: any = redactModelledSalinity(r);
    expect(JSON.stringify(out)).not.toMatch(/8495/);
    expect(out.waterQuality.tds).toBeNull();
    expect(out.salinityScreening.risk).toBe('HIGH');
    expect(out.fieldData.labWaterAnalysis.pH).toBe(7.1);
    expect(r.waterQuality.tds).toBe(8495); // the input is not changed
  });
  it('leaves a measured salinity untouched', () => {
    const r = measured(5850);
    expect(redactModelledSalinity(r)).toBe(r);
  });
  it('the screening values decide on measured salinity only', () => {
    expect(screeningValues(modelled(8495).waterQuality).tds).toBeNull();
    expect(screeningValues(measured(5850).waterQuality).tds).toBe(5850);
    expect(salinityFromWaterQuality(measured(5850).waterQuality).source).toBe('Measured: median of 7 boreholes within 25 km (sample dates not given per borehole)');
  });
});

describe('measured values cannot be confused with modelled risk (Word, Excel, CSV, Water tab)', () => {
  it('every laboratory value carries "Measured", its laboratory and its sample date', () => {
    const desktop: any = { recommendedDepth: 90, estimatedYield: 3, probability: 0.7, waterQuality: { tds: 8495 } };
    const cal = calibrateWithFieldData(desktop, { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-11-01', tds: 2400, fluoride: 0.4, pH: 7.2 } } as any);
    const wq = section({ ...modelled(8495), calibrationResult: cal }, 'Water quality');
    for (const label of ['pH', 'Salinity (TDS)', 'Fluoride']) {
      expect(wq.rows.find((x) => x[0] === label)![2]).toMatch(/^Measured: laboratory test \(KEBS, sampled 2026-11-01\)/);
    }
    expect(wq.rows.map((x) => x.join(' ')).join(' ')).not.toMatch(/not measured at this site|Salinity risk/);
  });
  it('a laboratory result without a date says so', () => {
    expect(salinityFromWaterQuality({}, { tds: 900, labName: 'X' }).source).toBe('Measured: laboratory test (X, sample date not given)');
  });
  it('nearby measurements name their sources and say the dataset gives no per-borehole date', () => {
    const r = base({ tds: 5850, measuredNearby: { ...MQ, sources: ['UNICEF Turkana borehole chemistry (UNESCO IHP-WINS)'] } });
    expect(row(r, 'Water quality', 'Salinity (TDS)')![2]).toMatch(/^Measured: median of 7 boreholes within 25 km \(sources: UNICEF Turkana borehole chemistry \(UNESCO IHP-WINS\); sample dates not given per borehole\)/);
  });
  it('a modelled value shows only a class marked "not measured at this site", never "Measured"', () => {
    const salRow = row(modelled(1800), 'Water quality', 'Salinity (TDS)')!;
    expect(salRow[1]).toBe('Salinity risk: ELEVATED');
    expect(salRow[2]).toMatch(/not measured at this site/);
    expect(salRow.join(' ')).not.toMatch(/Measured/);
  });
});

function hc2() {
  return { predictions: [{ parameter: 'TDS', predictedValue: 8495, unit: 'mg/L' }], validation: [{ parameter: 'TDS', predicted: 8495, actual: 1, error_pct: 5 }] };
}
