/**
 * Evidence gate for AquaScan's site figures (Release 5, 2026-11-20).
 *
 * Management requirement: "Avoid predicting drilling depth or sustainable
 * yield without sufficient evidence", and no fabricated prices.
 *
 * A desktop analysis (public maps, regional models, county statistics) is
 * screening evidence. It cannot set a drilling depth, a yield, or the cost and
 * payback that follow from them. Those are shown only when the user has
 * supplied site-level field evidence for this point:
 * - depth: a resistivity (ERT/VES) or seismic survey;
 * - yield: a pumping or step-drawdown test.
 * Costs and payback depend on both, and on a quotation, so they are never
 * shown from a desktop screen.
 */
import type { AnalysisResult } from './types';

export const DEPTH_NEEDS = 'Needs a field survey';
export const YIELD_NEEDS = 'Needs a test-pumped borehole';
export const COST_NEEDS = 'Quotation after survey';

export interface EvidenceGate {
  depth: boolean; yield: boolean; cost: boolean;
  methods: string[];
  /** One-line explanation for the screen and report. */
  note: string;
}

export function evidenceGate(result: Pick<AnalysisResult, 'siteEvidence'> | null | undefined): EvidenceGate {
  const e = result?.siteEvidence;
  const depth = !!e?.depth, yld = !!e?.yield;
  const cost = depth && yld;
  const methods = e?.methods ?? [];
  const note = depth && yld
    ? `Depth and yield are based on the field evidence supplied: ${methods.join(', ')}.`
    : 'This is a desktop screen from public maps and regional models. It does not give a drilling depth, a yield or a project cost for this point: a geophysical survey (ERT/VES) gives the depth, test-pumping gives the yield, and the quotation follows from both.';
  return { depth, yield: yld, cost, methods, note };
}

/** Show a figure only when its evidence exists; otherwise the evidence it needs. */
export function gated(ok: boolean, value: string, needs: string): string {
  return ok ? value : needs;
}
