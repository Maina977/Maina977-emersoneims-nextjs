/**
 * Candidate drilling locations on one property: the customer's observable-constraint
 * checklist, the rules that turn answers into constraints with plain-language reasons,
 * the outcome per location and the comparison across locations (AquaScan site-photo
 * workflow, 2026-11-25, branch ws/aquascan-site-photos).
 *
 * SAFETY RULES (independent safety review: these are the code paths to check):
 *  - Photos and answers are about ACCESS, HAZARDS and CONTAMINATION SOURCES that can be seen.
 *    Nothing here estimates groundwater, depth, yield, water quality or a success chance.
 *  - Outcomes are only OBSERVABLE CONSTRAINTS FOUND, NO BLOCKING CONSTRAINT OBSERVED or
 *    INSUFFICIENT PHOTO EVIDENCE. Never "suitable", never a groundwater ranking.
 *  - No setback distance is used as a number unless a verified source gives it. None was
 *    verified for Kenya (docs/engineering/aquascan-source-register.md, section D): the
 *    explanation says "distance requirement per WRA guidance — NOT VERIFIED" and asks for a
 *    professional check. The customer's estimated distance is reported as entered.
 *  - The customer's checklist answer governs. Automated hints (vision, if ever enabled) never
 *    change an outcome (VISION_HINTS_AFFECT_OUTCOME = false).
 */
import { SITE_PHOTO_THRESHOLDS, type SetResult } from './sitePhotoChecks';

export const GROUNDWATER_DISCLAIMER = 'Photographs cannot show whether groundwater exists, the drilling depth or the yield. Groundwater suitability is UNVERIFIED until a hydrogeological/geophysical survey is done.';
export const NOT_A_GROUNDWATER_RANKING = 'Observable access and hazard ranking only. This is not a groundwater ranking.';
export const DISTANCE_NOT_VERIFIED = 'distance requirement per WRA guidance — NOT VERIFIED';
export const VISION_HINTS_AFFECT_OUTCOME = false as const;

export type Answer<T extends string> = { value: T | ''; photo?: number | null };

export const CONTAMINATION_KINDS = [
  { key: 'pit-latrine', label: 'Pit latrine' },
  { key: 'septic-tank', label: 'Septic tank' },
  { key: 'soak-pit', label: 'Soak pit' },
  { key: 'cattle-dip', label: 'Cattle dip' },
  { key: 'fuel-storage', label: 'Fuel storage' },
  { key: 'waste-dump', label: 'Waste dump' },
  { key: 'graveyard', label: 'Graveyard' },
] as const;
export type ContaminationKind = typeof CONTAMINATION_KINDS[number]['key'];

export interface Checklist {
  powerLines: Answer<'none' | 'nearby' | 'over-working-area' | 'unsure'>;
  structures: Answer<'none' | 'within-working-area' | 'unsure'>;
  contamination: { kind: ContaminationKind; distanceM: number | null; photo?: number | null }[];
  contaminationNoneSeen: boolean;
  slope: Answer<'flat' | 'gentle' | 'steep' | 'unsure'>;
  flooding: Answer<'none' | 'signs' | 'unsure'>;
  access: Answer<'truck-to-spot' | 'narrow-or-soft' | 'no-vehicle-access' | 'unsure'>;
  existingWells: Answer<'none' | 'nearby' | 'unsure'> & { distanceM?: number | null };
}

export const emptyChecklist = (): Checklist => ({
  powerLines: { value: '' }, structures: { value: '' }, contamination: [], contaminationNoneSeen: false,
  slope: { value: '' }, flooding: { value: '' }, access: { value: '' }, existingWells: { value: '' },
});

/** The questions, as shown on screen (one source for the UI and the report). */
export const CHECKLIST_QUESTIONS = {
  powerLines: { q: 'Overhead power lines', options: { 'none': 'None visible', 'nearby': 'Visible nearby, not over the spot', 'over-working-area': 'Over or beside the drilling spot / working area', 'unsure': 'Not sure' } },
  structures: { q: 'Buildings or structures within the working area around the spot', options: { 'none': 'None', 'within-working-area': 'Yes, within the working area', 'unsure': 'Not sure' } },
  slope: { q: 'Ground slope at the spot', options: { 'flat': 'Flat', 'gentle': 'Gentle', 'steep': 'Steep', 'unsure': 'Not sure' } },
  flooding: { q: 'Signs of flooding or standing water', options: { 'none': 'None', 'signs': 'Yes (water marks, ponding, swampy ground, a drainage line)', 'unsure': 'Not sure' } },
  access: { q: 'Access route and width for a drilling rig truck', options: { 'truck-to-spot': 'A truck can drive to the spot', 'narrow-or-soft': 'Narrow, steep or soft route', 'no-vehicle-access': 'No vehicle access', 'unsure': 'Not sure' } },
  existingWells: { q: 'Existing boreholes or wells nearby', options: { 'none': 'None known', 'nearby': 'Yes', 'unsure': 'Not sure' } },
} as const;

export type Severity = 'constraint' | 'check';
export interface Finding { id: string; severity: Severity; title: string; explanation: string; photo: number | null; basis: string }

const ph = (n?: number | null) => (n ? ` (photo ${n})` : '');
const distTxt = (d: number | null) => (d != null && Number.isFinite(d) ? `about ${d} m away, as estimated by you` : 'distance not estimated');

/** Rules: answers → findings with plain-language reasons. Deterministic. */
export function constraintsFrom(c: Checklist): { findings: Finding[]; unanswered: string[] } {
  const f: Finding[] = [];
  const unanswered: string[] = [];
  const need = (k: keyof typeof CHECKLIST_QUESTIONS, v: string) => { if (!v) unanswered.push(CHECKLIST_QUESTIONS[k].q); };
  need('powerLines', c.powerLines.value); need('structures', c.structures.value); need('slope', c.slope.value);
  need('flooding', c.flooding.value); need('access', c.access.value); need('existingWells', c.existingWells.value);
  if (!c.contaminationNoneSeen && !c.contamination.length) unanswered.push('Contamination sources nearby (pit latrine, septic tank, soak pit, cattle dip, fuel storage, waste dump, graveyard)');

  if (c.powerLines.value === 'over-working-area') f.push({ id: 'power-over', severity: 'constraint', title: 'Overhead power line at the drilling spot', photo: c.powerLines.photo ?? null, basis: 'Your checklist answer', explanation: `A drilling rig raises a mast several metres high; near an overhead line it can touch or arc to it, which can kill.${ph(c.powerLines.photo)} The clearance needed is set by the power utility (clearance requirement per Kenya Power wayleave guidance — NOT VERIFIED): a professional must check before any rig is brought in, or choose another spot.` });
  if (c.powerLines.value === 'nearby') f.push({ id: 'power-near', severity: 'check', title: 'Power line visible nearby', photo: c.powerLines.photo ?? null, basis: 'Your checklist answer', explanation: `A line is visible but not over the spot${ph(c.powerLines.photo)}. The rig's route and mast position must keep clear of it; the driller must confirm on site.` });
  if (c.structures.value === 'within-working-area') f.push({ id: 'structures', severity: 'constraint', title: 'Buildings or structures within the working area', photo: c.structures.photo ?? null, basis: 'Your checklist answer', explanation: `A rig, its compressor and the mud pits need clear, level space around the borehole (working-area dimension — NOT VERIFIED, depends on the rig)${ph(c.structures.photo)}. Structures inside it can block setting up or be damaged.` });
  for (const s of c.contamination) {
    const label = CONTAMINATION_KINDS.find((k) => k.key === s.kind)?.label ?? s.kind;
    f.push({ id: `contamination-${s.kind}`, severity: 'constraint', title: `${label} nearby`, photo: s.photo ?? null, basis: 'Your checklist answer', explanation: `${label} ${distTxt(s.distanceM)}${ph(s.photo)}. Waste from it can pollute groundwater drawn by a nearby borehole. The minimum separation is a regulatory and hydrogeological matter (${DISTANCE_NOT_VERIFIED}): a professional must check this distance before this spot is chosen.` });
  }
  if (c.slope.value === 'steep') f.push({ id: 'slope', severity: 'constraint', title: 'Steep ground', photo: c.slope.photo ?? null, basis: 'Your checklist answer', explanation: `A rig must stand level and stable; steep ground may need levelling or make the spot unsafe${ph(c.slope.photo)}.` });
  if (c.flooding.value === 'signs') f.push({ id: 'flooding', severity: 'constraint', title: 'Signs of flooding or standing water', photo: c.flooding.photo ?? null, basis: 'Your checklist answer', explanation: `Flood water can enter a borehole head and carry surface pollution into it, and soft ground can trap the rig${ph(c.flooding.photo)}. A professional must judge whether the spot can be protected.` });
  if (c.access.value === 'no-vehicle-access') f.push({ id: 'access-none', severity: 'constraint', title: 'No vehicle access for a drilling rig', photo: c.access.photo ?? null, basis: 'Your checklist answer', explanation: `A truck-mounted rig cannot reach the spot${ph(c.access.photo)} (access width needed — NOT VERIFIED, depends on the rig). A track must be made, a smaller rig used, or another spot chosen.` });
  if (c.access.value === 'narrow-or-soft') f.push({ id: 'access-narrow', severity: 'check', title: 'Narrow, steep or soft access route', photo: c.access.photo ?? null, basis: 'Your checklist answer', explanation: `The route may not take a rig truck${ph(c.access.photo)} (access width needed — NOT VERIFIED). The driller must inspect the route.` });
  if (c.existingWells.value === 'nearby') f.push({ id: 'wells', severity: 'check', title: 'Existing borehole or well nearby', photo: c.existingWells.photo ?? null, basis: 'Your checklist answer', explanation: `A borehole or well ${distTxt(c.existingWells.distanceM ?? null)}${ph(c.existingWells.photo)}. Spacing between boreholes is regulated (spacing requirement per WRA guidance — NOT VERIFIED); a new borehole can also affect the existing one. A hydrogeologist must check.` });
  for (const [k, a] of [['powerLines', c.powerLines], ['structures', c.structures], ['slope', c.slope], ['flooding', c.flooding], ['access', c.access], ['existingWells', c.existingWells]] as const) {
    if (a.value === 'unsure') f.push({ id: `unsure-${k}`, severity: 'check', title: `Not confirmed: ${CHECKLIST_QUESTIONS[k].q.toLowerCase()}`, photo: a.photo ?? null, basis: 'Your checklist answer: not sure', explanation: 'The photos did not settle this; check it at the site before choosing this spot.' });
  }
  return { findings: f, unanswered };
}

export type Outcome = 'OBSERVABLE CONSTRAINTS FOUND' | 'NO BLOCKING CONSTRAINT OBSERVED' | 'INSUFFICIENT PHOTO EVIDENCE';

export interface Hint { photo: number; label: string; source: string }

export interface LocationAssessment {
  outcome: Outcome;
  reasons: string[];
  findings: Finding[];
  unanswered: string[];
  requestAlternative: string | null;
  hints: string[];
  disclaimer: string;
  referral: string;
}

export const REFERRAL = 'Before any conclusion about groundwater, commission a hydrogeological and geophysical survey of the chosen spot (it is required for the Water Resources Authority permit).';

/** Outcome for one location. Automated hints are listed but never change it. */
export function assessLocation(photoSet: SetResult, checklist: Checklist, hints: Hint[] = []): LocationAssessment {
  const { findings, unanswered } = constraintsFrom(checklist);
  const reasons: string[] = [];
  let outcome: Outcome;
  if (!photoSet.sufficient || unanswered.length) {
    outcome = 'INSUFFICIENT PHOTO EVIDENCE';
    reasons.push(...photoSet.reasons);
    if (unanswered.length) reasons.push(`Checklist not finished: ${unanswered.join('; ')}.`);
  } else if (findings.some((x) => x.severity === 'constraint')) {
    outcome = 'OBSERVABLE CONSTRAINTS FOUND';
    reasons.push(...findings.filter((x) => x.severity === 'constraint').map((x) => x.title));
  } else {
    outcome = 'NO BLOCKING CONSTRAINT OBSERVED';
    reasons.push('No blocking constraint was observed in the photos or reported in the checklist. This says nothing about groundwater.');
  }
  const requestAlternative = outcome === 'OBSERVABLE CONSTRAINTS FOUND'
    ? `Please add up to ${SITE_PHOTO_THRESHOLDS.maxPhotosPerLocation} photos of another possible location on the same property, away from the constraints above.`
    : outcome === 'INSUFFICIENT PHOTO EVIDENCE' && photoSet.reasons.length
      ? `Please retake up to ${SITE_PHOTO_THRESHOLDS.maxPhotosPerLocation} photos of this location (sharp, in daylight, with the phone's location turned on, each a different view).`
      : null;
  return {
    outcome, reasons, findings, unanswered, requestAlternative,
    hints: hints.map((h) => `Possible ${h.label} seen in photo ${h.photo} — please confirm in the checklist (${h.source}, unverified; not used in the assessment).`),
    disclaimer: GROUNDWATER_DISCLAIMER, referral: REFERRAL,
  };
}

const OUTCOME_ORDER: Record<Outcome, number> = { 'NO BLOCKING CONSTRAINT OBSERVED': 0, 'OBSERVABLE CONSTRAINTS FOUND': 1, 'INSUFFICIENT PHOTO EVIDENCE': 2 };

export interface ComparedLocation { label: string; assessment: LocationAssessment }
/** Ranking by observable constraints only (fewer and less severe first); ties keep entry order. */
export function compareLocations(locs: ComparedLocation[]): { order: { rank: number; label: string; outcome: Outcome; constraints: number; checks: number }[]; summary: string; note: string } {
  const rows = locs.map((l, i) => ({ i, label: l.label, outcome: l.assessment.outcome, constraints: l.assessment.findings.filter((f) => f.severity === 'constraint').length, checks: l.assessment.findings.filter((f) => f.severity === 'check').length }));
  rows.sort((a, b) => OUTCOME_ORDER[a.outcome] - OUTCOME_ORDER[b.outcome] || a.constraints - b.constraints || a.checks - b.checks || a.i - b.i);
  const first = rows[0], second = rows[1];
  // Only when the first location is clearly ahead on observable constraints (never a groundwater statement).
  const summary = first && second && first.outcome === 'NO BLOCKING CONSTRAINT OBSERVED' && (second.outcome !== first.outcome || second.constraints > first.constraints)
    ? `${first.label} is a better candidate for a field hydrogeological survey based on observable access and hazards.`
    : rows.length > 1 ? 'No location is clearly ahead on observable access and hazards.' : '';
  return { order: rows.map((r, k) => ({ rank: k + 1, label: r.label, outcome: r.outcome, constraints: r.constraints, checks: r.checks })), summary, note: `${NOT_A_GROUNDWATER_RANKING} ${GROUNDWATER_DISCLAIMER}` };
}

/** Words and figures that must never appear in this workflow's outputs (tests scan for them). */
export const FORBIDDEN_IN_PHOTO_OUTPUTS: RegExp[] = [
  /\bsuitable for (water|drilling|a borehole)\b/i, /\bgood (site|aquifer|location) for water\b/i, /\bbetter for water\b/i, /\bbest (site|location|spot) for (water|drilling)\b/i, /\bsuitable for drilling\b/i,
  /\d+(\.\d+)?\s*m\s*(deep|depth)\b/i, /\bdepth of \d/i, /\d+(\.\d+)?\s*m(³|3)\/h/i, /\byield of \d/i,
  /\b\d{1,3}\s*%\s*(chance|probability|success)/i, /\b(chance|probability) of (success|a productive)/i, /\bin 10 chance\b/i,
  /\b(transmissivity|storativity|aquifer depth)\b/i, /\bmg\/L\b/i,
];
