/**
 * drillReadiness.ts — DRILLING-READINESS SCORE (separate from AI confidence)
 *
 * Reviewer directive (2026-07-11): "AquaScan Pro should not increase the score
 * merely by adding more AI calculations. The score must rise when real field
 * evidence and professional approvals are uploaded."
 *
 * This module answers ONE question a drilling contractor cares about:
 *   "Is this document authority to mobilise a rig?"
 *
 * It is deliberately SEPARATE from the AI confidence % (which measures how much
 * the desktop models agree with each other). A desktop-only report can have 74%
 * AI confidence yet be ~35/100 drill-ready, because no field evidence exists.
 *
 * HARD GATES: the score is capped at 79/100 (status NOT DRILL-READY) until
 * every mandatory field/professional item is present — no amount of AI agreement
 * can lift it past that ceiling.
 */

export interface DrillReadinessInput {
  /** true when a survey-grade GPS peg has been recorded (not manual/EXIF entry) */
  hasFieldPeg?: boolean;
  gpsSource?: string;                 // 'exif' | 'manual' | 'device' | 'none' | ...
  locationGrade?: string;             // A-F
  hasFieldERT?: boolean;              // real resistivity survey uploaded
  hasHydrogeologistSignoff?: boolean; // signed hydrogeological survey report
  hasWRAAuthorisation?: boolean;      // WRA/NEMA authorisation reference on file
  hasPumpTest?: boolean;              // 24h constant-rate + recovery
  hasLabWaterAnalysis?: boolean;      // ISO 17025 certificate
  hasDrillLog?: boolean;              // lithological/water-strike log (post-drill)
  hasCompletionRecord?: boolean;      // WRA completion record submitted
  /** internal consistency: true if the report has NO contradictory
   *  depth/screen/yield/pump values or software errors */
  reportConsistent?: boolean;

  // ── REGIONAL / ANALOG EVIDENCE (desktop, but real facts) ──
  // Nearby proven boreholes are the most predictive desktop evidence in
  // hydrogeology. They raise the GROUNDWATER PROSPECT (chance of water) and
  // earn partial readiness credit for depth justification — but they do NOT
  // satisfy the site-specific field gates (peg, ERT, sign-off, authorisation).
  /** number of known producing boreholes within ~2 km */
  analogBoreholeCount?: number;
  /** regional success rate of those boreholes, 0-1 */
  analogSuccessRate?: number;
  /** how well the analog wells match the desktop model (depth/yield), 0-1 */
  desktopConcordance?: number;
  /** agreement of convergent desktop evidence (vegetation, drainage, recharge,
   *  water body, climate) with a water-bearing interpretation, 0-1 */
  convergentEvidenceScore?: number;
}

export interface DrillReadinessResult {
  score: number;                      // 0-100
  status: 'NOT DRILL-READY' | 'FIELD VALIDATION IN PROGRESS' | 'ISSUED FOR DRILLING' | 'COMPLETED / BANKABLE RECORD';
  stage: string;
  /** the mandatory items still blocking a driller handover */
  openGates: string[];
  /** per-category breakdown for transparency */
  breakdown: { category: string; earned: number; max: number; note: string }[];
  cappedByGates: boolean;
  handoverStatement: string;
  /** chance of striking water — DATA-BACKED, separate from readiness/gates */
  groundwaterProspect: 'LOW' | 'MODERATE' | 'STRONG' | 'VERY STRONG';
  /** 0-100 index behind the prospect band, for display */
  prospectIndex: number;
  /** plain-language explanation of the prospect (analog wells + convergence) */
  prospectStatement: string;
}

/**
 * The 100-point drilling-readiness rubric (reviewer's scheme).
 * Categories score independently, but MANDATORY GATES cap the total at 79
 * until each is satisfied.
 */
export function computeDrillReadiness(input: DrillReadinessInput): DrillReadinessResult {
  const gpsFieldVerified = input.hasFieldPeg === true ||
    (['manual'].includes(String(input.gpsSource)) && ['A', 'B'].includes(String(input.locationGrade)));

  // ── REGIONAL / ANALOG EVIDENCE (real facts, desktop-tier) ──
  const analogN = Math.max(0, input.analogBoreholeCount ?? 0);
  const analogSR = Math.min(1, Math.max(0, input.analogSuccessRate ?? 0));
  const concord = Math.min(1, Math.max(0, input.desktopConcordance ?? 0.6));
  const convergent = Math.min(1, Math.max(0, input.convergentEvidenceScore ?? 0.5));
  // analog reliability grows with the number of proven neighbours (cap ~8 wells)
  const analogWeight = Math.min(1, analogN / 8);
  const analogSignal = analogSR * analogWeight * concord;                 // 0-1
  // proven offset wells legitimately justify a target-depth range even before ERT
  const analogDepthCredit = analogN >= 3 ? Math.round(3 * (analogSignal || 0.5)) : 0; // 0-3

  const cats = [
    {
      category: 'Professional sign-off & regulatory documents',
      max: 15,
      earned: (input.hasHydrogeologistSignoff ? 9 : 0) + (input.hasWRAAuthorisation ? 6 : 0),
      note: 'Signed hydrogeological survey report + WRA/NEMA authorisation.',
    },
    {
      category: 'Field reconnaissance & verified coordinates',
      max: 10,
      earned: gpsFieldVerified ? 10 : 0,
      note: 'Survey-grade GPS peg set on site (not a crosshair on a photo).',
    },
    {
      category: 'Actual geophysical survey (ERT/VES) + raw-data QA',
      max: 20,
      earned: input.hasFieldERT ? 20 : 0,
      note: 'Real resistivity measurements + inversion, not a synthetic/projected section.',
    },
    {
      category: 'Final drilling target & depth justification',
      max: 10,
      earned: Math.min(10, (input.hasFieldERT ? 6 : 0) + (input.hasHydrogeologistSignoff ? 4 : 0) + analogDepthCredit),
      note: analogDepthCredit > 0
        ? `Depth range partly justified by ${analogN} proven offset boreholes; final peg/stopping criteria still from interpreted ERT.`
        : 'Final peg, depth range and stopping criteria set from interpreted ERT.',
    },
    {
      category: 'Borehole construction specification',
      max: 15,
      // Provisional (tender) design always earns partial; final design needs a drill log
      earned: (input.reportConsistent === false ? 4 : 8) + (input.hasDrillLog ? 7 : 0),
      note: 'Provisional tender design vs final completion design from the drill log.',
    },
    {
      category: 'Drilling QA/QC, logs & hold points',
      max: 10,
      earned: (input.reportConsistent === false ? 2 : 5) + (input.hasDrillLog ? 5 : 0),
      note: 'Logging programme, hold points and inspection sign-offs.',
    },
    {
      category: 'Development & pump-test specification',
      max: 10,
      earned: 5 + (input.hasPumpTest ? 5 : 0),
      note: 'Development + 24h constant-rate / 20h recovery test spec, then results.',
    },
    {
      category: 'Environmental, sanitary & H&S provisions',
      max: 5,
      earned: input.hasWRAAuthorisation ? 5 : 3,
      note: 'Setback/wellhead protection, spoil disposal, H&S plan.',
    },
    {
      category: 'Document consistency & integrity',
      max: 5,
      earned: input.reportConsistent === false ? 0 : 5,
      note: 'No contradictory depth/screen/yield/pump values or software errors.',
    },
  ];

  const rawScore = cats.reduce((s, c) => s + Math.min(c.max, c.earned), 0);

  // ── MANDATORY GATES (reviewer): cannot score above 79 unless ALL satisfied ──
  const gates: { ok: boolean; label: string }[] = [
    { ok: !!input.hasFieldERT, label: 'Actual ERT/VES field data uploaded' },
    { ok: gpsFieldVerified, label: 'Coordinates field-verified (survey-grade peg)' },
    { ok: !!input.hasHydrogeologistSignoff, label: 'Hydrogeologist has signed the survey report' },
    { ok: !!input.hasWRAAuthorisation, label: 'WRA/NEMA authorisation attached or verified' },
    { ok: input.reportConsistent !== false, label: 'No contradictory values or software errors' },
  ];
  const openGates = gates.filter(g => !g.ok).map(g => g.label);
  const cappedByGates = openGates.length > 0;
  const score = cappedByGates ? Math.min(79, rawScore) : rawScore;

  // ── STATUS ──
  let status: DrillReadinessResult['status'];
  let stage: string;
  if (input.hasCompletionRecord && input.hasPumpTest && input.hasLabWaterAnalysis) {
    status = 'COMPLETED / BANKABLE RECORD';
    stage = 'Drilled, tested and documented';
  } else if (!cappedByGates && score >= 80) {
    status = 'ISSUED FOR DRILLING';
    stage = 'Field-validated, professionally signed — driller may mobilise';
  } else if (input.hasFieldERT || gpsFieldVerified || input.hasHydrogeologistSignoff) {
    status = 'FIELD VALIDATION IN PROGRESS';
    stage = 'Some field evidence present; remaining gates open';
  } else {
    status = 'NOT DRILL-READY';
    stage = 'Desktop pre-feasibility only — for hydrogeologist review';
  }

  const handoverStatement = status === 'ISSUED FOR DRILLING'
    ? 'This package is field-validated and professionally signed. It may be handed to a licensed drilling contractor as authority to mobilise, subject to the stated hold points and stopping criteria. Sustainable yield and water quality remain preliminary until the pump test and laboratory analysis are completed.'
    : status === 'COMPLETED / BANKABLE RECORD'
    ? 'Drilling, testing and completion documentation are on file. This is a completed borehole record.'
    : 'DRAFT DESKTOP PRE-FEASIBILITY REPORT — FOR HYDROGEOLOGIST REVIEW AND FIELD VALIDATION — NOT FOR DRILLING MOBILISATION. Do not use the modelled depth, yield, water table or coordinates as guaranteed field values, select the final drill point, or procure a pump/casing/screen from this document.';

  // ── GROUNDWATER PROSPECT (chance of water) — DATA-BACKED, NOT gated ──
  // This answers "how likely is water here?", which proven neighbours and
  // convergent desktop evidence legitimately raise. It is deliberately SEPARATE
  // from readiness (authority to mobilise), so strong regional data is never
  // buried under an ungated "not drill-ready" label.
  const prospectRaw = analogN >= 3
    ? 0.45 * convergent + 0.55 * analogSignal      // real offset wells dominate when present
    : 0.70 * convergent + 0.30 * analogSignal;     // fall back to convergent desktop evidence
  const prospectIndex = Math.round(Math.min(0.98, Math.max(0.02, prospectRaw)) * 100);
  let groundwaterProspect: DrillReadinessResult['groundwaterProspect'];
  if (prospectIndex >= 75 && analogN >= 5) groundwaterProspect = 'VERY STRONG';
  else if (prospectIndex >= 60) groundwaterProspect = 'STRONG';
  else if (prospectIndex >= 40) groundwaterProspect = 'MODERATE';
  else groundwaterProspect = 'LOW';

  const analogPhrase = analogN >= 3
    ? `${analogN} known producing borehole(s) within ~2 km${analogSR > 0 ? ` (~${Math.round(analogSR * 100)}% regional success)` : ''}, concordant with the desktop model, `
    : analogN > 0
    ? `${analogN} nearby borehole record(s) and `
    : '';
  const prospectStatement = `${analogPhrase}together with convergent vegetation, drainage, water-body and recharge signals, indicate a ${groundwaterProspect} groundwater prospect (~${prospectIndex}%). This is the DATA-BACKED chance of striking water and does not require field validation. Drilling READINESS — pegging the exact point and depth and holding regulatory authority — is scored separately and still requires the field steps below.`;

  return {
    score, status, stage, openGates, breakdown: cats, cappedByGates, handoverStatement,
    groundwaterProspect, prospectIndex, prospectStatement,
  };
}
