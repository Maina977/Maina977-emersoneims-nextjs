/**
 * "Compare Multiple Sites": figures and ranking through the evidence gate (safety hotfix
 * 2026-11-25, hotfix/aquascan-photo-gate).
 *
 * Defect: the site cards printed the modelled depth and yield, the ranking weighted them
 * (25 % yield, 10 % shallow depth), the radar chart plotted them and the recommendation
 * sentence stated "an estimated yield of … m³/h at … m depth", none of it through the
 * evidence gate. A comparison site has no field survey or pumping test, so these were
 * desktop-model guesses presented as site figures. Now depth, yield and cost appear, and
 * count in the score, only where evidenceGate allows them.
 */
import type { AnalysisResult } from './types';
import { evidenceGate, DEPTH_NEEDS, YIELD_NEEDS, COST_NEEDS } from './evidenceGate';
import { probabilityBand } from './governingSummary';

/** Composite score 0-100. Yield and depth count only when the evidence gate allows them; the weights used are rescaled to 100. */
export function siteScore(r: AnalysisResult): { total: number; breakdown: Record<string, number> } {
  const g = evidenceGate(r);
  const parts: [string, number, number][] = [
    ['Modelled Success Score', r.probability * 100, 0.30],
    ...(g.yield ? [['Yield Potential', Math.min(r.estimatedYield / 5, 1) * 100, 0.25] as [string, number, number]] : []),
    ['Low Risk', (1 - r.risk.overallRisk) * 100, 0.20],
    ['Data Confidence', r.confidenceMetrics?.overall ?? 50, 0.15],
    ...(g.depth ? [['Cost Efficiency', Math.max(0, 100 - r.recommendedDepth), 0.10] as [string, number, number]] : []),
  ];
  const wSum = parts.reduce((a, p) => a + p[2], 0);
  const breakdown: Record<string, number> = {};
  for (const [k, v, w] of parts) breakdown[k] = Math.round((v * w) / wSum);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total: Math.min(total, 100), breakdown };
}

/** Figures for a site card. */
export function compareCardFigures(r: AnalysisResult): { chance: string; depth: string; yield: string } {
  const g = evidenceGate(r);
  return {
    chance: probabilityBand(r.probability),
    depth: g.depth ? `${r.recommendedDepth.toFixed(0)}m` : DEPTH_NEEDS,
    yield: g.yield ? `${r.estimatedYield.toFixed(1)} m³/h` : YIELD_NEEDS,
  };
}

/** The recommendation sentence, without ungated figures. */
export function compareVerdictSentence(r: AnalysisResult, name: string, score: number): string {
  const g = evidenceGate(r);
  const parts = [`${name} has the highest composite score (${score}/100), from desktop data. It has ${probabilityBand(r.probability)} chance of success (planning estimate).`];
  if (g.yield) parts.push(`Estimated yield ${r.estimatedYield.toFixed(1)} m³/h (pumping test).`);
  if (g.depth) parts.push(`Depth ${r.recommendedDepth.toFixed(0)} m (field survey).`);
  if (!g.depth || !g.yield) parts.push('Depth and yield need a geophysical survey and a pumping test at the site; they are not shown.');
  return parts.join(' ');
}

/** Radar axes: yield and depth only when every compared site has the evidence. */
export function radarAxes(results: AnalysisResult[]): { labels: string[]; values: (r: AnalysisResult) => number[] } {
  const yieldOk = results.length > 0 && results.every((r) => evidenceGate(r).yield);
  const depthOk = results.length > 0 && results.every((r) => evidenceGate(r).depth);
  const maxYield = Math.max(...results.map((r) => r.estimatedYield), 1);
  const maxDepth = Math.max(...results.map((r) => r.recommendedDepth), 1);
  const labels = ['Success %', ...(yieldOk ? ['Yield'] : []), 'Low Risk', 'Confidence', ...(depthOk ? ['Shallow Depth'] : [])];
  return {
    labels,
    values: (r) => [r.probability, ...(yieldOk ? [r.estimatedYield / maxYield] : []), 1 - r.risk.overallRisk, (r.confidenceMetrics?.overall ?? 50) / 100, ...(depthOk ? [1 - r.recommendedDepth / (maxDepth * 1.5)] : [])],
  };
}

/** The drilling-cost row is shown only when every compared site has the evidence for a cost. */
export const costRowAllowed = (results: AnalysisResult[]) => results.length > 0 && results.every((r) => evidenceGate(r).cost);
export { COST_NEEDS };

/** Index of the single best value, or -1 when two or more share it (a tie is not a win). */
export function uniqueBest(values: number[], higherBetter: boolean): number {
  const fin = values.filter(Number.isFinite);
  if (!fin.length) return -1;
  const target = higherBetter ? Math.max(...fin) : Math.min(...fin);
  const idx = values.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0);
  return idx.length === 1 ? idx[0] : -1;
}
