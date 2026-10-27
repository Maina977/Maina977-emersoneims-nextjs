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
  const level: FinalVerdict['level'] = prob >= 0.65 && risk < 0.5 ? 'favourable' : prob >= 0.5 && risk < 0.65 ? 'mixed' : 'unfavourable';
  const color: [number, number, number] = level === 'favourable' ? [22, 163, 74] : level === 'mixed' ? [217, 119, 6] : [220, 38, 38];
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
