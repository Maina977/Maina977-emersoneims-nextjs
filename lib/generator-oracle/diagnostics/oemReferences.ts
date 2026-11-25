/**
 * Published OEM reference data for Guided Diagnosis (2026-11-25).
 *
 * Source datasets: data/generator-oracle/references/*.json — each one public
 * document, cited by title, number, revision, date, URL, page and file hash.
 *
 * Applicability rule (binding): an entry is shown ONLY when the technician has
 * selected exactly one of the engine or controller models it names. Nothing is
 * matched by make, family or similarity, so a figure published for one model is
 * never shown for another; for anything else the answer is
 * "per OEM manual — NOT VERIFIED".
 *
 * Reference data is shown beside the questions as context. It is NEVER entered
 * as an answer and never changes a rule: every OEM figure the rules use is
 * still typed and confirmed by the technician for the set in front of them.
 */
import dse from '@/data/generator-oracle/references/dse-057-074-issue13.json';
import perkins from '@/data/generator-oracle/references/perkins-sebu8325-01.json';
import comap from '@/data/generator-oracle/references/comap-il4-amf25-datasheet-2021-04-29.json';

export const NOT_VERIFIED = 'per OEM manual — NOT VERIFIED';

export interface ReferenceSource {
  publisher: string; title: string; documentNumber: string; revision: string;
  documentDate: string | null; url: string; accessedVia: string; retrieved: string; sha256: string; permittedUse: string;
}
export interface ReferenceEntry {
  id: string;
  /** make = manufacturer; models = exact model names as the source states them; variant = configuration the entry is limited to. */
  equipment: { kind: 'engine' | 'controller'; make: string; models: string[]; firmware: string | null; variant: string };
  parameter: string;
  kind: 'alarm-meaning' | 'typical-range' | 'maximum' | 'procedure' | 'module-supply-range' | 'protection-available' | 'configuration-fact';
  value?: number; valueMin?: number; valueMax?: number;
  /** Units of the value, or 'none' for a non-numeric entry. */
  units: string;
  conditions?: string;
  meaning: string;
  /** What the source says the value is: a shutdown/stop value, a warning value, or not a limit at all. */
  classification: 'shutdown' | 'warning' | 'not-a-limit';
  /** Restrictions on where the entry applies (models, configuration, firmware). */
  applicability: string;
  /** How the source words the comparison, where it says anything (exact-threshold rule). */
  documentComparison?: string;
  /**
   * context-not-a-limit: shown beside the question only.
   * published-limit: may be entered as the limit for this exact model by the technician pressing
   * "Use published value" — never entered automatically.
   */
  relatesTo?: { family: string; question: string; relation: 'context-not-a-limit' | 'published-limit' };
  page: string;
  families: string[];
  verification: 'verified-from-public-document';
}
export interface ReferenceDataset { dataset: string; datasetVersion: number; compiled: string; source: ReferenceSource; entries: ReferenceEntry[]; gaps: string[] }

export const REFERENCE_DATASETS: ReferenceDataset[] = [dse, perkins, comap] as ReferenceDataset[];

/**
 * engine / controller: exact model strings from the datasets (selectors).
 * manufacturer / model / variant: free text describing the set in front of the
 * technician, recorded as the applicability of any limit they enter.
 */
export interface Equipment { engine?: string; controller?: string; manufacturer?: string; model?: string; variant?: string }

/** Every model named in the datasets, by kind, for the selectors. */
export function knownModels(kind: 'engine' | 'controller'): string[] {
  const s = new Set<string>();
  for (const d of REFERENCE_DATASETS) for (const e of d.entries) if (e.equipment.kind === kind) e.equipment.models.forEach((m) => s.add(m));
  return [...s].sort();
}

export interface ShownReference { entry: ReferenceEntry; source: ReferenceSource; matchedModel: string; text: string }

const valueText = (e: ReferenceEntry) => {
  if (e.value !== undefined) return `${e.value} ${e.units ?? ''}`.trim();
  if (e.valueMin !== undefined && e.valueMax !== undefined) return `${e.valueMin}–${e.valueMax} ${e.units ?? ''}`.trim();
  if (e.valueMax !== undefined) return `max ${e.valueMax} ${e.units ?? ''}`.trim();
  return null;
};

/** One line, the same on screen and in the job-card record. */
export function referenceText(e: ReferenceEntry, s: ReferenceSource, model: string): string {
  const v = valueText(e);
  const cls = e.classification === 'shutdown' ? 'SHUTDOWN / stop value' : e.classification === 'warning' ? 'WARNING value' : 'not a limit';
  return `${model} — ${e.parameter}${v ? `: ${v}` : ''} [${cls}]. ${e.meaning}${e.conditions ? ` (${e.conditions})` : ''} Applies only to: ${e.applicability} Variant: ${e.equipment.variant}.${e.documentComparison ? ` Comparison: ${e.documentComparison}` : ''} Source: ${s.publisher}, ${s.title}, ${s.documentNumber} ${s.revision}, ${s.documentDate ?? 'date not printed'}, ${e.page}. Reference only — not entered as an answer.`;
}

/** Entries that apply to exactly the selected models, for one family (and optionally one question). */
export function referencesFor(eq: Equipment, familyId: string, questionId?: string): ShownReference[] {
  const out: ShownReference[] = [];
  for (const d of REFERENCE_DATASETS) {
    for (const e of d.entries) {
      const selected = e.equipment.kind === 'engine' ? eq.engine : eq.controller;
      if (!selected || !e.equipment.models.includes(selected)) continue; // exact model only
      if (!e.families.includes(familyId)) continue;
      if (questionId !== undefined && !(e.relatesTo?.family === familyId && e.relatesTo.question === questionId)) continue;
      out.push({ entry: e, source: d.source, matchedModel: selected, text: referenceText(e, d.source, selected) });
    }
  }
  return out;
}

/** A published limit the technician may enter for this exact model (relation 'published-limit'), or null. */
export function publishedLimitFor(eq: Equipment, familyId: string, questionId: string): { value: number; classification: 'shutdown' | 'warning'; source: string; ref: ShownReference } | null {
  const r = referencesFor(eq, familyId, questionId).find((x) => x.entry.relatesTo?.relation === 'published-limit' && x.entry.value !== undefined && x.entry.classification !== 'not-a-limit');
  if (!r) return null;
  const s = r.source;
  return {
    value: r.entry.value!,
    classification: r.entry.classification as 'shutdown' | 'warning',
    source: `${s.documentNumber} ${s.revision}, ${s.documentDate ?? 'date not printed'}, ${r.entry.page} — published for ${r.matchedModel} (${r.entry.equipment.variant}); dataset entry ${r.entry.id}`,
    ref: r,
  };
}

/** What to show beside an OEM-figure question: the published context for the selected model, or NOT VERIFIED. */
export function questionReferenceNote(eq: Equipment, familyId: string, questionId: string): string {
  const refs = referencesFor(eq, familyId, questionId);
  if (!refs.length) return `${NOT_VERIFIED}: no published figure held for the selected equipment; enter the figure from the manual or settings sheet for this set.`;
  return refs.map((r) => r.text).join(' ');
}
