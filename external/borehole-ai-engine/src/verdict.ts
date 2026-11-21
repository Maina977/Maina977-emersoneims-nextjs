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

/** Salinity evidence for a whole analysis (laboratory result, then nearby boreholes, then the model). */
export function salinityEvidence(result: AnalysisResult): SalinityEvidence {
  const r: any = result;
  const lab = r?.calibrationResult?.calibratedWaterQuality ?? r?.fieldData?.labWaterAnalysis;
  return salinityFromWaterQuality(r?.waterQuality, lab);
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
  if (tds >= 3000) level = 'unfavourable';
  else if (tds >= 1000 && level === 'favourable') level = 'mixed';
  // A laboratory result is reported on its own figure; otherwise the note
  // follows the same internal value as the level.
  if (sal.basis === 'lab' || tds >= 1000) { const s = salNote(); if (s) quality.push(s); }
  if (no3 > 50) { if (level === 'favourable') level = 'mixed'; quality.push(`Nitrate may exceed 50 mg/L (pollution from latrines or farming): site the borehole away from them and test the water`); }
  if (f > 4) { if (level === 'favourable') level = 'mixed'; quality.push(`Fluoride may be well above 1.5 mg/L: defluoridation is needed for drinking`); }
  else if (f > 1.5) quality.push(`Fluoride may exceed 1.5 mg/L: plan defluoridation for drinking water`);
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
