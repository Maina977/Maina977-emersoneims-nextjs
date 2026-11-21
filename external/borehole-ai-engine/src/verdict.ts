/**
 * ONE verdict for the web page and every PDF section.
 *
 * 2026-10-27 audit: the PDF printed "DRILL -- PROCEED" from desktop data
 * while the same report said "NOT FOR DRILLING MOBILISATION", the web page
 * never showed the verdict, and Kenyan practice (a hydrogeological survey for
 * the Water Resources Authority permit) means a desktop screen cannot by
 * itself justify drilling. Without field data the verdict says what to do
 * next; only field-validated results (ERT, pump test) can say "drill".
 */
import type { AnalysisResult } from './types';

export interface FinalVerdict {
  prob: number;
  risk: number;
  verdict: string;
  /** One sentence on what the client should do next. */
  next: string;
  color: [number, number, number];
  level: 'favourable' | 'mixed' | 'unfavourable';
}

/**
 * Where the salinity figure comes from (2026-11-21 management directive: a
 * modelled salinity must not read as a measured or verified concentration).
 *
 * - 'lab': the user's laboratory result for this borehole (a measurement).
 * - 'nearby': the median of 3 or more measured boreholes near the site.
 * - 'modelled': the regional model only. No concentration figure is shown,
 *   only a screening class; the internal number still drives the verdict.
 * - 'none': no salinity value at all.
 */
export type SalinityRisk = 'HIGH' | 'ELEVATED' | 'LOW';
export interface SalinityEvidence {
  basis: 'lab' | 'nearby' | 'modelled' | 'none';
  measured: boolean;
  /** The governing internal figure (mg/L). Display it only when `measured`. */
  tds: number | null;
  risk: SalinityRisk | null;
  /** The value cell: a figure when measured, the screening class when modelled. */
  value: string;
  /** Where the value comes from, in words. */
  source: string;
  /** One plain sentence for the reader. */
  sentence: string;
}

const NOT_MEASURED = 'regional screening, not measured at this site';
const LAB_NEEDED = 'Salinity has not been measured at this site; a laboratory test of the first water is needed before drinking use or treatment design.';

/** Screening class from an internal TDS figure: HIGH from 3,000, ELEVATED from 1,000 mg/L. */
export function salinityRisk(tds: number): SalinityRisk {
  return tds >= 3000 ? 'HIGH' : tds >= 1000 ? 'ELEVATED' : 'LOW';
}

const fmtMgL = (x: number) => `${Math.round(x).toLocaleString('en-KE')} mg/L`;

/** "Salinity risk: HIGH (regional screening, not measured at this site)". */
export function modelledSalinityLabel(risk: SalinityRisk): string {
  return `Salinity risk: ${risk} (${NOT_MEASURED})`;
}

/** The reader's sentence for a modelled salinity class. */
export function modelledSalinitySentence(risk: SalinityRisk): string {
  return risk === 'HIGH'
    ? `Regional data indicate a high risk of saline groundwater here. ${LAB_NEEDED}`
    : risk === 'ELEVATED'
      ? `Regional data indicate an elevated risk of brackish (salty) groundwater here. ${LAB_NEEDED}`
      : 'Regional data indicate a low risk of saline groundwater here. Salinity has not been measured at this site; a laboratory test of the first water confirms it.';
}

/**
 * "Measured: laboratory test (KEBS, sampled 2026-11-01)". Every laboratory
 * value carries this label so it cannot be confused with a modelled class
 * (2026-11-21 management requirement: source and date on measured values).
 */
export function labSourceLabel(lab: any): string {
  const name = String(lab?.labName ?? '').trim();
  const date = String(lab?.sampleDate ?? '').trim();
  return `Measured: laboratory test (${name || 'laboratory not named'}, ${date ? `sampled ${date}` : 'sample date not given'})`;
}

/**
 * "(sources: A; B; sample dates not given per borehole)": where the nearby
 * measurements come from and when. The open dataset records no sampling date
 * per borehole, so that is said rather than implied.
 */
export function nearbyProvenance(mq: any): string {
  const src = Array.isArray(mq?.sources) && mq.sources.length ? `sources: ${mq.sources.join('; ')}; ` : '';
  return `(${src}sample dates not given per borehole)`;
}

/** True when the water-quality TDS is the median of 3 or more measured boreholes nearby. */
export function tdsMeasuredNearby(wq: any): boolean {
  return Number(wq?.measuredNearby?.ec?.n) >= 3 && Number.isFinite(Number(wq?.tds));
}

/**
 * Salinity evidence from a water-quality block and, optionally, a laboratory
 * result. The laboratory governs, then the measured nearby median, then the
 * regional model (screening class only).
 */
export function salinityFromWaterQuality(wq: any, lab?: any): SalinityEvidence {
  const labTds = Number(lab?.tds);
  if (lab && Number.isFinite(labTds)) {
    return {
      basis: 'lab', measured: true, tds: labTds, risk: salinityRisk(labTds),
      value: fmtMgL(labTds), source: labSourceLabel(lab),
      sentence: `Laboratory TDS ${fmtMgL(labTds)}; the drinking-water limit (KS EAS 12) is 1,000 mg/L.`,
    };
  }
  const tds = Number(wq?.tds);
  if (!Number.isFinite(tds)) {
    return { basis: 'none', measured: false, tds: null, risk: null, value: 'laboratory test needed', source: 'No salinity estimate for this site', sentence: LAB_NEEDED };
  }
  if (tdsMeasuredNearby(wq)) {
    const mq = wq.measuredNearby;
    const where = `median of ${mq.ec.n} boreholes${mq.radius_km != null ? ` within ${mq.radius_km} km` : ' nearby'}`;
    return {
      basis: 'nearby', measured: true, tds, risk: salinityRisk(tds),
      value: fmtMgL(tds), source: `Measured: ${where} ${nearbyProvenance(mq)}`,
      sentence: `Measured nearby: TDS ${fmtMgL(tds)} (${where}); the drinking-water limit (KS EAS 12) is 1,000 mg/L.`,
    };
  }
  const risk = salinityRisk(tds);
  return {
    basis: 'modelled', measured: false, tds, risk,
    value: `Salinity risk: ${risk}`, source: `Regional screening, not measured at this site`,
    sentence: modelledSalinitySentence(risk),
  };
}

/** The laboratory result for this borehole, if one was entered. */
export function labWaterResult(result: AnalysisResult | null | undefined): any {
  const r: any = result;
  return r?.calibrationResult?.calibratedWaterQuality ?? r?.fieldData?.labWaterAnalysis;
}

/** Salinity evidence for a whole analysis (laboratory result, then nearby boreholes, then the model). */
export function salinityEvidence(result: AnalysisResult): SalinityEvidence {
  const r: any = result;
  return salinityFromWaterQuality(r?.waterQuality, labWaterResult(result));
}

/**
 * Fluoride and nitrate follow the salinity rule (2026-11-21 management
 * directive: AquaScan "must distinguish laboratory measurements from modelled
 * risk"). One helper for both:
 * - laboratory value: the figure with "Measured: laboratory test (lab, date)";
 * - median of 3 or more measured boreholes nearby: the figure with its source;
 * - otherwise the regional model: a risk class only, no mg/L figure and no
 *   threshold attached to the site value. The internal number still drives the
 *   verdict level when it is the best evidence there is.
 *
 * Classes use only the guideline values already in the code: fluoride against
 * the WHO guideline 1.5 mg/L (HIGH above 4 mg/L, the code's existing "well
 * above the guideline" break for defluoridation), nitrate against the WHO
 * guideline 50 mg/L.
 */
export type ChemParam = 'fluoride' | 'nitrate';
export type ChemRisk = 'HIGH' | 'ELEVATED' | 'LOW';
export interface ChemEvidence {
  param: ChemParam;
  name: string;
  basis: 'lab' | 'nearby' | 'modelled' | 'none';
  measured: boolean;
  /** The governing internal figure (mg/L). Display it only when `measured`. */
  mgL: number | null;
  risk: ChemRisk | null;
  /** The value cell: a figure when measured, the risk class when modelled. */
  value: string;
  /** Where the value comes from, in words. */
  source: string;
  /** One plain sentence for the reader. */
  sentence: string;
}

/**
 * Fluoride class against the WHO guideline 1.5 mg/L. HIGH is above 4 mg/L,
 * the US EPA maximum contaminant level for fluoride (40 CFR 141.62), used
 * here only as the "well above the guideline" band edge (re-audit LOW 1, 2026-11-21).
 */
export function fluorideRisk(f: number): ChemRisk {
  return f > 4 ? 'HIGH' : f > 1.5 ? 'ELEVATED' : 'LOW';
}
/** Nitrate class against the WHO guideline 50 mg/L. */
export function nitrateRisk(no3: number): ChemRisk {
  return no3 > 50 ? 'HIGH' : 'LOW';
}

const CHEM: Record<ChemParam, { name: string; guideline: string; risk: (v: number) => ChemRisk; dp: number }> = {
  fluoride: { name: 'Fluoride', guideline: 'the WHO guideline is 1.5 mg/L', risk: fluorideRisk, dp: 2 },
  nitrate: { name: 'Nitrate', guideline: 'the WHO guideline is 50 mg/L', risk: nitrateRisk, dp: 1 },
};

/** A measured concentration, e.g. "0.8 mg/L". */
export function fmtChem(param: ChemParam, x: number): string {
  return `${x.toLocaleString('en-KE', { maximumFractionDigits: CHEM[param].dp })} mg/L`;
}

/** "Fluoride risk: HIGH (regional screening, not measured at this site)". */
export function modelledChemLabel(name: string, risk: ChemRisk): string {
  return `${name} risk: ${risk} (${NOT_MEASURED})`;
}

/** The reader's sentence for a modelled fluoride or nitrate class. */
export function modelledChemSentence(param: ChemParam, risk: ChemRisk): string {
  const name = CHEM[param].name;
  const what = param === 'fluoride' ? 'excess fluoride' : 'nitrate pollution (from latrines or farming)';
  const level = risk === 'HIGH' ? 'a high' : risk === 'ELEVATED' ? 'an elevated' : 'a low';
  const tail = risk === 'LOW'
    ? `${name} has not been measured at this site; a laboratory test of the first water confirms it.`
    : `${name} has not been measured at this site; a laboratory test of the first water is needed before drinking use or treatment design.`;
  return `Regional data indicate ${level} risk of ${what} here. ${tail}`;
}

/** True when the water-quality figure for `param` is the median of 3 or more measured boreholes nearby. */
export function chemMeasuredNearby(param: ChemParam, wq: any): boolean {
  return Number(wq?.measuredNearby?.[param]?.n) >= 3 && Number.isFinite(Number(wq?.[param]));
}

/** Fluoride or nitrate evidence: the laboratory governs, then the measured nearby median, then the model (class only). */
export function chemFromWaterQuality(param: ChemParam, wq: any, lab?: any): ChemEvidence {
  const { name, guideline, risk: cls } = CHEM[param];
  const labV = Number(lab?.[param]);
  if (lab && lab[param] != null && Number.isFinite(labV)) {
    return {
      param, name, basis: 'lab', measured: true, mgL: labV, risk: cls(labV),
      value: fmtChem(param, labV), source: labSourceLabel(lab),
      sentence: `Laboratory ${name.toLowerCase()} ${fmtChem(param, labV)}; ${guideline}.`,
    };
  }
  const v = Number(wq?.[param]);
  if (wq?.[param] == null || !Number.isFinite(v)) {
    return { param, name, basis: 'none', measured: false, mgL: null, risk: null, value: 'laboratory test needed', source: `No ${name.toLowerCase()} estimate for this site`, sentence: `${name} has not been measured at this site; a laboratory test of the first water is needed.` };
  }
  if (chemMeasuredNearby(param, wq)) {
    const mq = wq.measuredNearby;
    const where = `median of ${mq[param].n} boreholes${mq.radius_km != null ? ` within ${mq.radius_km} km` : ' nearby'}`;
    return {
      param, name, basis: 'nearby', measured: true, mgL: v, risk: cls(v),
      value: fmtChem(param, v), source: `Measured: ${where} ${nearbyProvenance(mq)}`,
      sentence: `Measured nearby: ${name.toLowerCase()} ${fmtChem(param, v)} (${where}); ${guideline}.`,
    };
  }
  const risk = cls(v);
  return {
    param, name, basis: 'modelled', measured: false, mgL: v, risk,
    value: `${name} risk: ${risk}`, source: 'Regional screening, not measured at this site',
    sentence: modelledChemSentence(param, risk),
  };
}

/** Fluoride or nitrate evidence for a whole analysis. */
export function chemEvidence(result: AnalysisResult, param: ChemParam): ChemEvidence {
  return chemFromWaterQuality(param, (result as any)?.waterQuality, labWaterResult(result));
}

/** The site-value cell for a report: the measured figure with its source, or the modelled class. */
export function chemCell(e: ChemEvidence): string {
  return e.measured ? `${e.value}. ${e.source}` : e.risk ? modelledChemLabel(e.name, e.risk) : 'laboratory test needed';
}

export function finalVerdict(result: AnalysisResult): FinalVerdict {
  const prob = result.probability ?? 0.5;
  const risk = (result as any).risk?.overallRisk ?? 0.5;
  const field = (result as any).fieldValidated === true;
  let level: FinalVerdict['level'] = prob >= 0.65 && risk < 0.5 ? 'favourable' : prob >= 0.5 && risk < 0.65 ? 'mixed' : 'unfavourable';
  // Water quality gates the verdict (2026-10-29 audit: Mombasa island was
  // FAVOURABLE while the same page said "likely too salty"). Limits: TDS 1,000
  // mg/L (KS EAS 12 / WHO taste), nitrate 50 mg/L and fluoride 1.5 mg/L (WHO).
  const wq = (result as any).waterQuality as { tds?: number; nitrate?: number; fluoride?: number } | undefined;
  const tds = Number(wq?.tds), no3 = Number(wq?.nitrate), f = Number(wq?.fluoride);
  const quality: string[] = [];
  // 2026-11-21: the level still follows the internal TDS figure, but a
  // modelled value is stated as a screening class only: no mg/L figure and no
  // threshold attached to it. Measured values keep their figure and source.
  const sal = salinityEvidence(result);
  const salNote = (): string | null => {
    if (sal.basis === 'lab' || sal.basis === 'nearby') {
      const t = sal.tds as number;
      const src = sal.basis === 'lab' ? 'laboratory test' : sal.source.replace(/^Measured: /, '');
      if (t >= 3000) return `measured salinity is high (TDS ${fmtMgL(t)}, ${src}; the drinking-water limit is 1,000 mg/L): too salty for drinking without desalination`;
      if (t >= 1000) return `measured salinity is above the 1,000 mg/L drinking-water limit (TDS ${fmtMgL(t)}, ${src}): budget for reverse osmosis`;
      return null;
    }
    if (sal.risk === 'HIGH') return `${modelledSalinityLabel('HIGH')}. Regional data indicate a high risk of saline groundwater here, which may be too salty to drink without desalination`;
    if (sal.risk === 'ELEVATED') return `${modelledSalinityLabel('ELEVATED')}. Regional data indicate an elevated risk of brackish groundwater here, which may need treatment before drinking`;
    return null;
  };
  // 2026-11-21: the best evidence sets the level. A laboratory result (or the
  // measured nearby median) overrides the regional model, so a lab reading of
  // 500 mg/L is no longer "unfavourable" because the model said 8,495.
  const governingTds = (sal.basis === 'lab' || sal.basis === 'nearby') && Number.isFinite(Number(sal.tds)) ? Number(sal.tds) : tds;
  if (governingTds >= 3000) level = 'unfavourable';
  else if (governingTds >= 1000 && level === 'favourable') level = 'mixed';
  if (sal.basis === 'lab' || governingTds >= 1000) { const s = salNote(); if (s) quality.push(s); }
  // 2026-11-21: fluoride and nitrate follow the same rule. The best evidence
  // (laboratory, then the measured nearby median, then the model) sets the
  // level; a modelled value is stated as a risk class with no figure and no
  // threshold attached to it.
  const fl = chemEvidence(result, 'fluoride');
  const ni = chemEvidence(result, 'nitrate');
  const measSrc = (e: ChemEvidence) => (e.basis === 'lab' ? 'laboratory test' : e.source.replace(/^Measured: /, ''));
  const governingNo3 = ni.measured && ni.mgL != null ? ni.mgL : no3;
  const governingF = fl.measured && fl.mgL != null ? fl.mgL : f;
  if (governingNo3 > 50) {
    if (level === 'favourable') level = 'mixed';
    quality.push(ni.measured
      ? `measured nitrate is above the WHO 50 mg/L guideline (${ni.value}, ${measSrc(ni)}): pollution from latrines or farming; find and remove the source, and treat before drinking`
      : `${modelledChemLabel('Nitrate', 'HIGH')}. Regional data indicate a high risk of nitrate pollution from latrines or farming: site the borehole away from them and test the water`);
  }
  if (governingF > 4) {
    if (level === 'favourable') level = 'mixed';
    quality.push(fl.measured
      ? `measured fluoride is well above the WHO 1.5 mg/L guideline (${fl.value}, ${measSrc(fl)}): defluoridation is needed for drinking`
      : `${modelledChemLabel('Fluoride', 'HIGH')}. Regional data indicate a high risk of excess fluoride here: defluoridation is likely to be needed for drinking if a laboratory test confirms it`);
  } else if (governingF > 1.5) {
    quality.push(fl.measured
      ? `measured fluoride is above the WHO 1.5 mg/L guideline (${fl.value}, ${measSrc(fl)}): plan defluoridation for drinking water`
      : `${modelledChemLabel('Fluoride', 'ELEVATED')}. Regional data indicate an elevated risk of excess fluoride here: plan for defluoridation if a laboratory test confirms it`);
  }
  const qualityNote = quality.length ? ` Water quality: ${quality.join('; ')}. A laboratory test of the first water confirms it.` : '';
  const color: [number, number, number] = level === 'favourable' ? [22, 163, 74] : level === 'mixed' ? [217, 119, 6] : [220, 38, 38];
  const withQuality = (v: FinalVerdict): FinalVerdict => ({ ...v, next: v.next + qualityNote });
  return withQuality(baseVerdict(prob, risk, level, color, field));
}

function baseVerdict(prob: number, risk: number, level: FinalVerdict['level'], color: [number, number, number], field: boolean): FinalVerdict {
  if (field) {
    return level === 'favourable'
      ? { prob, risk, level, color, verdict: 'DRILL -- PROCEED', next: 'Field data supports drilling at the surveyed point. Obtain the WRA permit and drill to the recommended depth.' }
      : level === 'mixed'
      ? { prob, risk, level, color, verdict: 'INVESTIGATE FURTHER BEFORE DRILLING', next: 'Field data is mixed. Extend the survey (another ERT line or VES) before committing to drill.' }
      : { prob, risk, level, color, verdict: 'HIGH RISK -- ADDITIONAL SURVEYS REQUIRED', next: 'Field data does not support this point. Survey alternative sites.' };
  }
  return level === 'favourable'
    ? { prob, risk, level, color, verdict: 'FAVOURABLE -- COMMISSION A HYDROGEOLOGICAL SURVEY', next: 'The desktop screen is favourable. A hydrogeological survey (required for the WRA permit) confirms the drilling point and depth.' }
    : level === 'mixed'
    ? { prob, risk, level, color, verdict: 'MIXED -- SURVEY BEFORE ANY DRILLING COMMITMENT', next: 'The desktop screen is mixed. Commission a survey before paying for drilling.' }
    : { prob, risk, level, color, verdict: 'UNFAVOURABLE -- SURVEY ALTERNATIVE SITES', next: 'The desktop screen is unfavourable here. Survey other sites on the property or nearby before drilling.' };
}
