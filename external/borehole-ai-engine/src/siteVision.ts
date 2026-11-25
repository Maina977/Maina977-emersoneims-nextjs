/**
 * Automated visual review of site photos: provider interface and the evaluation gate
 * (AquaScan site-photo workflow, 2026-11-25).
 *
 * Management decision: NO paid vision service. A local, commercially licensed open model may
 * be added later (docs/engineering/aquascan-vision-model-evaluation.md). Until then the
 * provider is DISABLED, and even when one is enabled:
 *  - a detection is shown only as "Possible <object> seen in photo N — please confirm in the
 *    checklist" and NEVER changes the outcome (siteConstraints.VISION_HINTS_AFFECT_OUTCOME);
 *  - a class may be promoted beyond a hint only after it meets PROMOTION_THRESHOLD on the
 *    documented, openly licensed evaluation set (evaluateClass below); none has;
 *  - a generic class never becomes a specific hazard (a "structure" is never a "septic tank").
 */
import type { Hint } from './siteConstraints';

export const VISION_STATUS = 'Automated visual review not enabled: the assessment uses the measured photo checks and your checklist answers only.';

export interface VisionDetection { photo: number; label: string; score: number }
export interface VisionProvider {
  id: string; licence: string; enabled: boolean;
  detect(image: { width: number; height: number; data: Uint8ClampedArray | Uint8Array }, photo: number): Promise<VisionDetection[]>;
}

/** The only provider shipped: disabled, returns nothing. */
export const DISABLED_PROVIDER: VisionProvider = { id: 'none', licence: 'n/a', enabled: false, detect: async () => [] };

export function getVisionProvider(): VisionProvider { return DISABLED_PROVIDER; }

export const VISION_UNAVAILABLE = 'Automated photo review unavailable — checklist only.';

/**
 * Failure-safe run of a provider: disabled, failing to load, throwing or timing out all give
 * NO hints and an explicit status. Unusable photos (blurred, too dark) are not sent at all.
 */
export async function runVisionSafely(provider: VisionProvider, photos: { image: { width: number; height: number; data: Uint8ClampedArray | Uint8Array }; usable: boolean }[], timeoutMs = 15000): Promise<{ hints: Hint[]; status: string }> {
  if (!provider.enabled) return { hints: [], status: VISION_STATUS };
  const dets: VisionDetection[] = [];
  try {
    for (let i = 0; i < photos.length; i++) {
      if (!photos[i].usable) continue;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const r = await Promise.race([
        provider.detect(photos[i].image, i + 1),
        new Promise<'timeout'>((res) => { timer = setTimeout(() => res('timeout'), timeoutMs); }),
      ]).finally(() => timer && clearTimeout(timer));
      if (r === 'timeout') return { hints: [], status: `${VISION_UNAVAILABLE} (the model did not answer within ${timeoutMs / 1000} s)` };
      dets.push(...r);
    }
  } catch (e) {
    return { hints: [], status: `${VISION_UNAVAILABLE} (${(e as Error)?.message || 'the model failed'})` };
  }
  return { hints: detectionsToHints(dets, provider.id), status: `Automated photo review by ${provider.id}: hints only, not used in the assessment.` };
}

/**
 * Site-relevant generic labels a model could name, mapped to the checklist question they
 * point to. Deliberately generic: no latrine, septic tank, fuel store or graveyard class.
 */
export const HINT_LABELS: Record<string, { hint: string; question: string }> = {
  'utility pole': { hint: 'utility pole or power line', question: 'Overhead power lines' },
  'power line': { hint: 'utility pole or power line', question: 'Overhead power lines' },
  building: { hint: 'building or structure', question: 'Buildings or structures within the working area' },
  truck: { hint: 'vehicle', question: 'Access route' },
  car: { hint: 'vehicle', question: 'Access route' },
  water: { hint: 'water surface', question: 'Signs of flooding or standing water' },
};

/** Detections → hint wording only (never an outcome). Unknown labels are dropped. */
export function detectionsToHints(dets: VisionDetection[], providerId: string, minScore = 0.5): Hint[] {
  return dets.filter((d) => d.score >= minScore && HINT_LABELS[d.label]).map((d) => ({ photo: d.photo, label: HINT_LABELS[d.label].hint, source: `automated label from ${providerId}` }));
}

// ───────────── evaluation framework (independent testing before influence) ─────────────

export interface EvalImage { id: string; source: string; licence: string; attribution: string; truth: string[] }
export interface EvalPrediction { id: string; predicted: string[] }
export interface ClassScore { label: string; hits: number; misses: number; falseAlarms: number; precision: number | null; recall: number | null; meetsThreshold: boolean }

/** Documented promotion threshold (per class, on the evaluation set): both must be met, with at least MIN_POSITIVES examples. */
export const PROMOTION_THRESHOLD = { precision: 0.9, recall: 0.8, minPositives: 30 } as const;

export function evaluateClass(label: string, set: EvalImage[], preds: EvalPrediction[]): ClassScore {
  let hits = 0, misses = 0, falseAlarms = 0;
  for (const img of set) {
    const truth = img.truth.includes(label);
    const pred = (preds.find((p) => p.id === img.id)?.predicted ?? []).includes(label);
    if (truth && pred) hits++; else if (truth) misses++; else if (pred) falseAlarms++;
  }
  const precision = hits + falseAlarms ? hits / (hits + falseAlarms) : null;
  const recall = hits + misses ? hits / (hits + misses) : null;
  const meetsThreshold = hits + misses >= PROMOTION_THRESHOLD.minPositives && precision != null && recall != null && precision >= PROMOTION_THRESHOLD.precision && recall >= PROMOTION_THRESHOLD.recall;
  return { label, hits, misses, falseAlarms, precision, recall, meetsThreshold };
}

/** Classes promoted beyond hints. Empty: no class has been evaluated (evaluation pending). */
export const PROMOTED_CLASSES: readonly string[] = [];

// ───────────── three certainty levels per visual feature ─────────────

/** The visual features the workflow asks about. Specific hazards have no detector at all. */
export const VISUAL_FEATURES = [
  'overhead power lines or poles', 'buildings or structures', 'vehicle access', 'standing water',
  'pit latrine', 'septic tank', 'soak pit', 'cattle dip', 'fuel storage', 'waste dump', 'graveyard', 'ground slope',
] as const;
export type VisualFeature = typeof VISUAL_FEATURES[number];
export type Certainty = 'VALIDATED DETECTION' | 'POSSIBLE' | 'NOT ASSESSED';

/** Generic hint wording → the one feature it may point to (never a specific hazard). */
const HINT_TO_FEATURE: Record<string, VisualFeature> = {
  'utility pole or power line': 'overhead power lines or poles',
  'building or structure': 'buildings or structures',
  vehicle: 'vehicle access',
  'water surface': 'standing water',
};

export interface FeatureStatement { feature: VisualFeature; certainty: Certainty; text: string }

/**
 * One statement per visual feature:
 *  VALIDATED DETECTION only for a class in PROMOTED_CLASSES (none today);
 *  POSSIBLE for an unvalidated hint (the checklist decides);
 *  NOT ASSESSED otherwise. A generic hint maps to its generic feature only.
 */
export function featureStatements(hints: Hint[], promoted: readonly string[] = PROMOTED_CLASSES): FeatureStatement[] {
  return VISUAL_FEATURES.map((feature) => {
    const h = hints.find((x) => HINT_TO_FEATURE[x.label] === feature);
    if (h && promoted.includes(feature)) return { feature, certainty: 'VALIDATED DETECTION', text: `Observed in photo ${h.photo}: ${feature} (automated, validated on the AquaScan evaluation set; limitations: see the vision evaluation record).` };
    if (h) return { feature, certainty: 'POSSIBLE', text: `Possible ${feature} in photo ${h.photo} — please confirm in the checklist.` };
    return { feature, certainty: 'NOT ASSESSED', text: `${feature[0].toUpperCase()}${feature.slice(1)}: this feature could not be assessed automatically (your checklist answer is used).` };
  });
}
