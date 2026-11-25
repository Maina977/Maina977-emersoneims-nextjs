/**
 * Photo-only results (2026-11-25, audit of the site-photo workflow). A run whose location
 * came only from the photo itself — no coordinates typed, no place searched, no camera GPS —
 * has its position guessed from the photo's colours ('visual-estimate') or not at all
 * ('none'). Such a run must not show a chance of a productive borehole, and (like every run
 * without field evidence) no depth or yield. Photographs cannot give groundwater figures.
 */
import type { AnalysisResult } from './types';
import { evidenceGate, DEPTH_NEEDS, YIELD_NEEDS } from './evidenceGate';
import { probabilityBand } from './governingSummary';

export const PHOTO_ONLY_NO_CHANCE = 'Not estimated: the location came only from the photo. Enter the coordinates of the site.';

export function photoOnlyLocation(r: Pick<AnalysisResult, 'locationMethod'> | null | undefined): boolean {
  const m = (r as { locationMethod?: string } | null | undefined)?.locationMethod;
  return m == null || m === 'none' || m === 'visual-estimate';
}

/** The chance-of-success text for any card: withheld for photo-only locations. */
export function chanceText(r: AnalysisResult): string {
  return photoOnlyLocation(r) ? PHOTO_ONLY_NO_CHANCE : probabilityBand(r.probability);
}

/** Figures for a site card in "Compare Multiple Sites" (one photo per site, no field evidence). */
export function compareCardFigures(r: AnalysisResult): { chance: string; depth: string; yield: string } {
  const g = evidenceGate(r);
  return {
    chance: chanceText(r),
    depth: g.depth ? `${r.recommendedDepth.toFixed(0)}m` : DEPTH_NEEDS,
    yield: g.yield ? `${r.estimatedYield.toFixed(1)} m³/h` : YIELD_NEEDS,
  };
}

/** The "Engineering Recommendation" sentence in compare mode, without ungated figures. */
export function compareVerdictSentence(r: AnalysisResult, name: string, score: number): string {
  const g = evidenceGate(r);
  const parts = [`${name} has the highest composite score (${score}/100).`];
  if (!photoOnlyLocation(r)) parts.push(`Chance of success: ${probabilityBand(r.probability)} (planning estimate).`);
  if (g.yield) parts.push(`Estimated yield ${r.estimatedYield.toFixed(1)} m³/h.`);
  if (g.depth) parts.push(`Depth ${r.recommendedDepth.toFixed(0)} m.`);
  if (!g.depth || !g.yield) parts.push('Depth and yield need a geophysical survey and a pumping test; photographs cannot give them.');
  return parts.join(' ');
}
