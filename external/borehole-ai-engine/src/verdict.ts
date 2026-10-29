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
  if (tds >= 3000) { level = 'unfavourable'; quality.push(`Expected salinity (TDS about ${Math.round(tds)} mg/L) is too high for drinking without desalination`); }
  else if (tds >= 1000) { if (level === 'favourable') level = 'mixed'; quality.push(`Expected salinity (TDS about ${Math.round(tds)} mg/L) is above the 1,000 mg/L drinking limit: budget for reverse osmosis`); }
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
