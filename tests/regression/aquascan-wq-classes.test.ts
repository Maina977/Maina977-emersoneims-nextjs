/**
 * 2026-11-21 fluoride and nitrate (and the other modelled chemistry) follow
 * the salinity rule: a MODELLED value reaches the reader as a risk class only
 * (no mg/L figure, no threshold attached to it, no treatment priced from it);
 * a MEASURED value (laboratory, or the median of 3+ boreholes nearby) keeps its
 * figure with a "Measured: ..." label. The best evidence sets the verdict level.
 */
import { describe, it, expect } from 'vitest';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import { computeCanonicalEconomics } from '@/external/borehole-ai-engine/src/reportShared';
import { harmonizeHydrochem } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { redactModelledChemistry } from '@/external/borehole-ai-engine/src/reportGenerator';
import { calibrateWithFieldData } from '@/external/borehole-ai-engine/src/fieldCalibrationEngine';
import { finalVerdict, chemFromWaterQuality, fluorideRisk, nitrateRisk } from '@/external/borehole-ai-engine/src/verdict';

const base = (wq: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  probability: 0.75, recommendedDepth: 90, estimatedYield: 3, site: { latitude: -0.45, longitude: 36.1 },
  risk: { overallRisk: 0.3 }, waterQuality: { tds: 400, fluoride: 0.6, nitrate: 5, iron: 0.1, isPotable: true, treatmentRequired: [], ...wq }, ...extra,
}) as any;
const MQ = { radius_km: 25, fluoride: { n: 6, median: 3.2, max: 7.1, over1_5: 5 }, nitrate: { n: 4, median: 62 } };
const wqSection = (r: any) => governingSummary(r, 'Test site').find((s) => s.title === 'Water quality')!;
const row = (r: any, label: string) => wqSection(r).rows.find((x) => x[0] === label)!;

describe('classes from the cited guideline values only', () => {
  it('fluoride against WHO 1.5 mg/L (HIGH above 4), nitrate against WHO 50 mg/L', () => {
    expect([fluorideRisk(0.8), fluorideRisk(2.0), fluorideRisk(6)]).toEqual(['LOW', 'ELEVATED', 'HIGH']);
    expect([nitrateRisk(10), nitrateRisk(80)]).toEqual(['LOW', 'HIGH']);
  });
});

describe('screen data and Word/Excel/CSV rows (governing summary)', () => {
  it('a modelled fluoride shows the class only: no figure, no "about", no threshold', () => {
    const fl = row(base({ fluoride: 6.2, isPotable: false }), 'Fluoride');
    expect(fl[1]).toBe('Fluoride risk: HIGH');
    expect(fl.join(' ')).not.toMatch(/mg\/L|\d|about/);
    expect(fl[2]).toMatch(/^Regional screening, not measured at this site\. Regional data indicate a high risk of excess fluoride/);
    expect(row(base({ fluoride: 2.0 }), 'Fluoride')[1]).toBe('Fluoride risk: ELEVATED');
    expect(row(base({ fluoride: 0.6 }), 'Fluoride')[1]).toBe('Fluoride risk: LOW');
  });
  it('a modelled nitrate is never a figure', () => {
    const ni = row(base({ nitrate: 80 }), 'Nitrate');
    expect(ni[1]).toBe('laboratory test needed');
    expect(ni.join(' ')).not.toMatch(/80/);
  });
  it('measured nearby medians keep their figure and the Measured label', () => {
    const r = base({ fluoride: 3.2, nitrate: 62, measuredNearby: MQ });
    expect(row(r, 'Fluoride')[1]).toBe('3.2 mg/L');
    expect(row(r, 'Fluoride')[2]).toMatch(/^Measured: median of 6 boreholes within 25 km/);
    expect(row(r, 'Nitrate')[1]).toBe('62 mg/L');
    expect(row(r, 'Nitrate')[2]).toMatch(/^Measured: median of 4 boreholes within 25 km/);
  });
  it('one or two nearby tests are reported as measurements at those boreholes, the site value stays a class', () => {
    const r = base({ fluoride: 5.5, fluorideAreaSurvey: { name: 'Kisumu', sampled: '2014', values: [5.5, 9.9] } });
    const fl = row(r, 'Fluoride');
    expect(fl[1]).toBe('Fluoride risk: HIGH');
    expect(fl[2]).toMatch(/Measured at 2 boreholes in Kisumu \(2014\): 5\.5 and 9\.9 mg\/L; too few for a site value/);
  });
  it('laboratory values keep their figure with source and date', () => {
    const desktop: any = { recommendedDepth: 90, estimatedYield: 3, probability: 0.7, waterQuality: { tds: 400, fluoride: 6, nitrate: 10, pH: 7 } };
    const cal = calibrateWithFieldData(desktop, { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-11-01', fluoride: 0.8, nitrate: 80, pH: 7.2 } } as any);
    const r = { ...base({ fluoride: 6, nitrate: 10 }), calibrationResult: cal };
    expect(row(r, 'Fluoride')[1]).toBe('0.8 mg/L');
    expect(row(r, 'Fluoride')[2]).toMatch(/^Measured: laboratory test \(KEBS, sampled 2026-11-01\)/);
    expect(row(r, 'Nitrate')[1]).toBe('80 mg/L');
    // The calibration notes compare with the desktop class, never a modelled figure.
    const notes = cal.calibrationNotes.join(' ');
    expect(notes).toMatch(/Lab fluoride: 0\.8 mg\/L \(the desktop screen classed the fluoride risk as HIGH; that class was not a measurement\)/);
    expect(notes).not.toMatch(/predicted 7|desktop predicted/);
  });
});

describe('best evidence sets the verdict level', () => {
  it('a laboratory fluoride of 0.8 overrides a modelled 6', () => {
    const modelledOnly = finalVerdict(base({ fluoride: 6 }));
    expect(modelledOnly.level).toBe('mixed');
    expect(modelledOnly.next).toMatch(/Fluoride risk: HIGH \(regional screening, not measured at this site\)/);
    expect(modelledOnly.next).not.toMatch(/\b6\b|1\.5 mg\/L/);
    const withLab = finalVerdict(base({ fluoride: 6 }, { fieldData: { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-11-01', fluoride: 0.8 } } }));
    expect(withLab.level).toBe('favourable');
    expect(withLab.next).not.toMatch(/fluoride/i);
  });
  it('a laboratory nitrate of 80 overrides a modelled 10', () => {
    expect(finalVerdict(base({ nitrate: 10 })).level).toBe('favourable');
    const withLab = finalVerdict(base({ nitrate: 10 }, { fieldData: { labWaterAnalysis: { labName: 'KEBS', sampleDate: '2026-11-01', nitrate: 80 } } }));
    expect(withLab.level).toBe('mixed');
    expect(withLab.next).toMatch(/measured nitrate is above the WHO 50 mg\/L guideline \(80 mg\/L, laboratory test\)/);
  });
  it('a modelled nitrate above the guideline is a class with no figure', () => {
    const v = finalVerdict(base({ nitrate: 80 }));
    expect(v.next).toMatch(/Nitrate risk: HIGH \(regional screening, not measured at this site\)/);
    expect(v.next).not.toMatch(/80|50 mg\/L/);
  });
});

describe('no treatment sized or priced from a modelled value', () => {
  it('modelled fluoride: defluoridation not priced', () => {
    const r = base({ fluoride: 6, isPotable: false, treatmentRequired: ['Defluoridation only if a laboratory test of the first water confirms excess fluoride'] });
    const eco = computeCanonicalEconomics(r);
    expect(eco.defluoridationCost).toBe(0);
    expect(eco.fluorideUnpriced).toBe(true);
    expect(eco.wqTreatmentCost).toBe(0);
    const costs = governingSummary(r, 'x').find((s) => s.title.startsWith('Costs'))!;
    expect(costs.rows.find((x) => x[0] === 'Defluoridation')?.[1]).toBe('not priced');
  });
  it('measured fluoride prices defluoridation', () => {
    const eco = computeCanonicalEconomics(base({ fluoride: 3.2, measuredNearby: MQ, isPotable: false, treatmentRequired: ['Defluoridation (activated alumina or bone char): measured nearby fluoride 3.2 mg/L'] }));
    expect(eco.defluoridationCost).toBe(2500);
    expect(eco.fluorideUnpriced).toBe(false);
  });
});

describe('hydrochemistry panel (page and PDF section 32)', () => {
  const hc = () => ({
    predictions: [
      { parameter: 'fluoride', predictedValue: 2, unit: 'mg/L', whoGuideline: 1.5, exceedsGuideline: true, healthRisk: 'moderate', reasoning: 'rock' },
      { parameter: 'nitrate', predictedValue: 10, unit: 'mg/L', whoGuideline: 50, exceedsGuideline: false, healthRisk: 'none', reasoning: 'rock' },
      { parameter: 'iron', predictedValue: 0.9, unit: 'mg/L', whoGuideline: 0.3, exceedsGuideline: true, healthRisk: 'low', reasoning: 'rock' },
      { parameter: 'pH', predictedValue: 7, unit: '', whoGuideline: 8.5, exceedsGuideline: false, healthRisk: 'none', reasoning: 'rock' },
    ],
    waterType: 'Na-HCO3', waterTypeDescription: 'x', primaryConcerns: ['fluoride: 2 mg/L (WHO: 1.5 mg/L)', 'iron: 0.9 mg/L (WHO: 0.3 mg/L)'],
    treatmentRequired: ['Iron removal (aeration + sand filtration)', 'Defluoridation (bone char / activated alumina)'], treatmentCost: 'moderate',
    narrative: 'Overall quality: poor. Concerns: fluoride: 2 mg/L (WHO: 1.5 mg/L); iron: 0.9 mg/L (WHO: 0.3 mg/L).',
    recommendations: [], validation: [{ parameter: 'fluoride', predicted: 2, actual: 0.4, error_pct: 400, unit: 'mg/L', predictedExceeds: true }],
  });
  it('every modelled parameter prints a class, never a figure, and buys nothing', () => {
    const out = harmonizeHydrochem(hc(), { tds: 400, fluoride: 6, nitrate: 10, iron: 0.9, pH: 7 });
    const f = out.predictions.find((p: any) => p.parameter === 'fluoride');
    expect(f.displayValue).toBe('Fluoride risk: HIGH (regional screening, not measured at this site)');
    expect(out.predictions.find((p: any) => p.parameter === 'iron').displayValue).toBe('Iron risk: ELEVATED (regional screening, not measured at this site)');
    expect(out.predictions.every((p: any) => typeof p.displayValue === 'string')).toBe(true);
    const shown = JSON.stringify({ c: out.primaryConcerns, n: out.narrative, t: out.treatmentRequired });
    expect(shown).not.toMatch(/mg\/L|\d+(\.\d+)? mg/);
    expect(out.treatmentRequired.every((t: string) => /only if a laboratory test/.test(t))).toBe(true);
    expect(out.treatmentCost).toBe('not_priced');
    expect(out.validation[0].predictedDisplay).toBe('ELEVATED risk (screening class, not measured at this site)');
  });
  it('a measured nearby fluoride keeps its figure', () => {
    const out = harmonizeHydrochem(hc(), { tds: 400, fluoride: 3.2, nitrate: 62, iron: 0.9, pH: 7, measuredNearby: MQ });
    expect(out.predictions.find((p: any) => p.parameter === 'fluoride').displayValue).toBeUndefined();
    expect(out.predictions.find((p: any) => p.parameter === 'fluoride').predictedValue).toBe(3.2);
  });
});

describe('JSON download', () => {
  it('withholds modelled fluoride, nitrate and soil-model figures and adds the classes', () => {
    const r: any = {
      ...base({ fluoride: 6.2, nitrate: 33, iron: 0.48, arsenic: 0.034, pH: 6.9, tds: 8495 }),
      waterDesign: { waterChemistry: { fluoride_mgL: 6.2, iron_mgL: 0.48, pH: 6.9 } },
      fieldData: { labWaterAnalysis: { pH: 7.1, fluoride: 0.8 } },
      soil: { pH: 5.8 },
    };
    const out: any = redactModelledChemistry(r);
    const txt = JSON.stringify({ wq: out.waterQuality, wd: out.waterDesign });
    expect(txt).not.toMatch(/6\.2|\b33\b|0\.48|0\.034|6\.9|8495/);
    expect(out.chemistryScreening.fluoride.risk).toBe('HIGH');
    expect(out.salinityScreening.risk).toBe('HIGH');
    expect(out.fieldData.labWaterAnalysis.fluoride).toBe(0.8); // measured kept
    expect(out.soil.pH).toBe(5.8); // not water chemistry
    expect(r.waterQuality.fluoride).toBe(6.2); // the input is not changed
  });
  it('keeps measured nearby fluoride and nitrate', () => {
    const out: any = redactModelledChemistry(base({ fluoride: 3.2, nitrate: 62, measuredNearby: MQ }));
    expect(out.waterQuality.fluoride).toBe(3.2);
    expect(out.waterQuality.nitrate).toBe(62);
    expect(chemFromWaterQuality('fluoride', out.waterQuality).measured).toBe(true);
  });
});
