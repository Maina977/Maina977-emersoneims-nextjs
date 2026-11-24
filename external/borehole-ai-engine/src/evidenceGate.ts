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
import type { AnalysisResult, EvidenceProvenance, FieldValidationData } from './types';

export const DEPTH_NEEDS = 'Needs a field survey';
export const YIELD_NEEDS = 'Needs a test-pumped borehole';
export const COST_NEEDS = 'Quotation after survey';

export interface EvidenceGate {
  depth: boolean; yield: boolean; cost: boolean;
  methods: string[];
  /** The entered evidence behind depth and yield, for citing beside the figures. */
  citations: { depth?: string; yield?: string };
  /** One-line explanation for the screen and report. */
  note: string;
}

export function evidenceGate(result: Pick<AnalysisResult, 'siteEvidence'> | null | undefined): EvidenceGate {
  const e = result?.siteEvidence;
  const depth = !!e?.depth, yld = !!e?.yield;
  const cost = depth && yld;
  const methods = e?.methods ?? [];
  const citations = { depth: depth ? e?.citations?.depth : undefined, yield: yld ? e?.citations?.yield : undefined };
  const note = depth && yld
    ? `Depth and yield are based on the field evidence supplied: ${methods.join(', ')}.`
    : 'This is a desktop screen from public maps and regional models. It does not give a drilling depth, a yield or a project cost for this point: a geophysical survey (ERT/VES) gives the depth, test-pumping gives the yield, and the quotation follows from both.';
  return { depth, yield: yld, cost, methods, citations, note };
}

/** "(Contractor, 2026-10-01, Schlumberger VES, report R-12)" from what the user entered. */
export function provenanceText(p: EvidenceProvenance | undefined | null, fallback: { source?: string; date?: string } = {}): string {
  const parts = [
    (p?.source ?? fallback.source ?? '').trim(),
    (p?.date ?? fallback.date ?? '').trim(),
    (p?.method ?? '').trim(),
    p?.reference?.trim() ? `report ${p.reference.trim()}` : '',
    p?.accreditation?.trim() ? `accreditation ${p.accreditation.trim()}` : '',
    p?.samplePoint?.trim() ? `sample point ${p.samplePoint.trim()}` : '',
    p?.reportFile ? `file ${p.reportFile.name}, SHA-256 ${p.reportFile.sha256}` : '',
  ].filter(Boolean);
  return parts.length ? `(${parts.join(', ')})` : '(source not entered)';
}

const fmt = (x: number, dp = 1) => String(Math.round(x * 10 ** dp) / 10 ** dp);

/**
 * The site evidence for a point, from the field data the user entered. The
 * conditions are the Release 5 gate, unchanged:
 * - depth: an ERT/VES survey with an aquifer depth > 0, or a seismic fracture-zone depth;
 * - yield: a pumping test, or a step-drawdown test with steps;
 * - cost: both (evidenceGate).
 * Each figure carries a citation of the entered source, date, method and reference.
 */
export function siteEvidenceFrom(fieldData: FieldValidationData | null | undefined): NonNullable<AnalysisResult['siteEvidence']> {
  const fd = fieldData ?? undefined;
  const ert = fd?.ertSurvey, seis = fd?.seismicSurvey, pt = fd?.pumpTest, sd = fd?.stepDrawdownTest;
  const depth = !!(ert?.aquiferDepthM && ert.aquiferDepthM > 0) || !!(seis?.fractureZoneDepthM);
  const yld = !!pt || !!(sd?.steps?.length);
  const ertText = ert ? `${ert.method ? `${ert.method} survey` : 'ERT/VES survey'} ${provenanceText(ert.provenance, { source: ert.contractor, date: ert.surveyDate })}` : null;
  const seisText = seis ? `seismic survey ${provenanceText(null, { source: seis.contractor, date: seis.surveyDate })}` : null;
  const ptText = pt ? `constant-rate pumping test ${provenanceText(pt.provenance, { date: pt.testDate })}` : null;
  const sdText = sd?.steps?.length ? `step-drawdown test ${provenanceText(sd.provenance, { date: sd.testDate })}` : null;
  let depthCite: string | undefined;
  if (ert?.aquiferDepthM && ert.aquiferDepthM > 0) {
    const bottom = ert.aquiferDepthM + (Number(ert.aquiferThicknessM) || 0);
    depthCite = `${ertText}: interpreted aquifer ${fmt(ert.aquiferDepthM, 0)}${bottom > ert.aquiferDepthM ? `-${fmt(bottom, 0)}` : ''} m`;
  } else if (seis?.fractureZoneDepthM) {
    depthCite = `${seisText}: fracture zone at ${fmt(seis.fractureZoneDepthM, 0)} m`;
  }
  let yieldCite: string | undefined;
  if (pt) {
    yieldCite = `${ptText}: tested rate ${fmt(pt.sustainableYieldM3Hr)} m³/h for ${fmt(pt.testDurationHrs)} h, drawdown ${fmt(pt.drawdownM, 2)} m`;
  } else if (sd?.steps?.length) {
    const top = Math.max(...sd.steps.map((s) => Number(s.pumpingRate_m3hr) || 0));
    yieldCite = `${sdText}: highest step rate tested ${fmt(top)} m³/h (${sd.steps.length} steps); a constant-rate test confirms the sustainable yield`;
  }
  return {
    depth,
    yield: yld,
    methods: [ertText, seisText, ptText, sdText].filter((x): x is string => !!x),
    citations: { depth: depthCite, yield: yieldCite },
  };
}

export interface EvidenceNeed { figure: 'Drilling depth' | 'Yield' | 'Project cost'; ok: boolean; basis?: string; needs: string[] }

/** "What evidence is still needed for: drilling depth / yield / project cost". */
export function evidenceChecklist(fieldData: FieldValidationData | null | undefined): EvidenceNeed[] {
  const se = siteEvidenceFrom(fieldData);
  const g = evidenceGate({ siteEvidence: se });
  return [
    { figure: 'Drilling depth', ok: g.depth, basis: g.citations.depth,
      needs: g.depth ? [] : ['A geophysical survey (VES or ERT) at the drilling point: contractor, survey date, method, the interpreted aquifer depth range and the report reference.'] },
    { figure: 'Yield', ok: g.yield, basis: g.citations.yield,
      needs: g.yield ? [] : ['A pumping test of the borehole (constant-rate or step-drawdown): contractor, date, method, duration, pumping rate, static and dynamic water levels, recovery and the report reference.'] },
    { figure: 'Project cost', ok: g.cost, basis: g.cost ? 'Survey and pumping test entered; priced at sourced rates only' : undefined,
      needs: [
        ...(g.depth ? [] : ['The geophysical survey (drilling depth).']),
        ...(g.yield ? [] : ['The pumping test (yield).']),
        'Items without a sourced rate (pump, screen, installation, treatment) are priced by the supplier\'s quotation.',
      ] },
  ];
}

/** Show a figure only when its evidence exists; otherwise the evidence it needs. */
export function gated(ok: boolean, value: string, needs: string): string {
  return ok ? value : needs;
}
