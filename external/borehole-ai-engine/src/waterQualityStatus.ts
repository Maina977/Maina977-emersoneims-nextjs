/**
 * ONE water-quality status for the screen and every export (re-review of f89698e8, BLOCKING 3,
 * 2026-11-25). A potability or treatment conclusion exists only with a laboratory result (the
 * entered lab analysis, or a calibration from one). Before, the full PDF's executive line printed
 * "WATER QUALITY POTABLE (modelled)" while the screen said "Not known: needs a laboratory test".
 */
export function hasLabWaterResult(result: any): boolean {
  return !!(result?.calibrationResult?.calibratedWaterQuality || result?.fieldData?.labWaterAnalysis);
}

export interface WaterQualityStatus {
  known: boolean;
  /** The potability line, as on the screen. */
  potability: string;
  /** NOT KNOWN | NO | YES */
  treatment: 'NOT KNOWN' | 'NO' | 'YES';
  treatmentNote: string;
  /** Short form for a "Safe to drink" cell. */
  safeToDrink: string;
}

export const WQ_NEEDS_LAB = 'Not known: needs a laboratory test of a water sample';

export function waterQualityStatus(result: any): WaterQualityStatus {
  if (!hasLabWaterResult(result)) {
    return { known: false, potability: WQ_NEEDS_LAB, treatment: 'NOT KNOWN', treatmentNote: 'Needs a laboratory test of a water sample (modelled water quality only)', safeToDrink: 'NOT KNOWN (needs a laboratory test)' };
  }
  const ok = !!result?.waterQuality?.isPotable;
  return ok
    ? { known: true, potability: 'Meets the guideline values on the parameters the laboratory tested', treatment: 'NO', treatmentNote: 'Disinfection only (standard)', safeToDrink: 'YES on the parameters the laboratory tested' }
    : { known: true, potability: 'Treatment required (laboratory result)', treatment: 'YES', treatmentNote: 'Per the laboratory result', safeToDrink: 'NO without treatment (laboratory result)' };
}
