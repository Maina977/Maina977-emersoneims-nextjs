/**
 * engineIndex — pivots the parts catalogue by ENGINE MODEL.
 *
 * WHY (owner, 2026-07-21): "we have over 200 generator makes — we have so many
 * different makes and models."
 *
 * That is the right challenge, and it exposed what the catalogue was actually
 * missing. The answer was never more rows: it was the MAKE/MODEL dimension.
 * The data already carries real fitment — 6BT5.9 appears on 75 parts, 4BT3.9 on
 * 54, Perkins 1104C-44 on 46 — but nothing on the site let a customer say
 * "I have a 6BT5.9, show me what fits it".
 *
 * This module inverts the existing compatibility data into an engine index. It
 * is pure faceted navigation over parts that are already in the catalogue:
 * every engine listed is one a real part already claims to fit, and every part
 * shown is a real part. NOTHING is generated — no invented engines, no invented
 * fitment, no invented part numbers.
 *
 * That distinction matters. Padding the catalogue with fabricated SKUs would
 * multiply the credibility problem; pivoting real data multiplies genuine
 * coverage of high-intent searches ("6BT5.9 oil filter Kenya", "Perkins
 * 1104C-44 parts").
 */

import partsDb from '@/app/data/spare-parts-database-COMPLETE.json';
import verifiedAdditions from '@/app/data/spare-parts-verified-additions.json';
import { cleanParts, type PartLike } from '@/lib/parts/partsQuality';

export type EnginePart = PartLike & { categoryId: string };

export type EngineEntry = {
  /** URL slug, e.g. "6bt5-9". */
  slug: string;
  /** Display name exactly as it appears in the fitment data, e.g. "6BT5.9". */
  model: string;
  /** Engine manufacturer, inferred only from unambiguous model conventions. */
  make?: string;
  parts: EnginePart[];
};

/**
 * Fitment values that describe an APPLICATION or an electrical system rather
 * than an engine model. These are legitimate fitment (a DSE7320 really does run
 * on any diesel genset) but they are not engines, so they get no engine page.
 */
const NOT_AN_ENGINE =
  /universal|^12v|^24v|any diesel|single-set|multi-set|lead-acid|generator starting|brushless|^stamford [a-z]|leroy somer lsa series|mecc alte alternators|kva$|racor \d|series$|applications?$|systems?$/i;

/**
 * Engine make inferred from well-established model conventions only. Anything
 * not confidently recognised is left undefined rather than guessed — the same
 * rule applied to part fitment.
 */
function inferMake(model: string): string | undefined {
  const m = model.toUpperCase();
  if (/^\d?[46]BTA?\d|^6C?TA?\d|^ISBE|^QS[BCX]|^NT\d|^NTA\d|^KTA\d|^K\d{2}|^M11$|^L10$|^ISX/.test(m)) return 'Cummins';
  if (/^1\d{3}[A-Z]?|^30\d{2}[A-Z]?|^40\d[A-Z]?-/.test(m)) return 'Perkins';
  if (/^C\d(\.\d)?$|^3\d{3}$/.test(m)) return 'Caterpillar';
  return undefined;
}

/** "6BT5.9" -> "6bt5-9"; stable and URL-safe. */
export function engineSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/[.\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type Sub = { id: string; name: string; parts?: PartLike[] };

function allSubcategories(): Sub[] {
  const root = partsDb as unknown as Record<string, unknown>;
  const cats = (Array.isArray(root) ? root : Object.values(root).find((v) => Array.isArray(v))) as
    | Array<{ subcategories?: Sub[] }>
    | undefined;
  return cats?.[0]?.subcategories ?? [];
}

function additionsFor(id: string): PartLike[] {
  const add = verifiedAdditions as { additions?: Array<{ subcategoryId: string; parts: PartLike[] }> };
  return add.additions?.find((a) => a.subcategoryId === id)?.parts ?? [];
}

/**
 * Build the engine index. Only engines meeting MIN_PARTS get a page — a page
 * listing one part is not worth publishing and would be the thin-content
 * pattern this audit has spent its time removing.
 */
const MIN_PARTS = 5;

let cached: EngineEntry[] | null = null;

export function getEngineIndex(): EngineEntry[] {
  if (cached) return cached;

  const byModel = new Map<string, { model: string; parts: Map<string, EnginePart> }>();

  for (const sub of allSubcategories()) {
    const merged = [...(sub.parts ?? []), ...additionsFor(sub.id)];
    for (const p of cleanParts(merged)) {
      for (const raw of p.compatibility ?? []) {
        const model = String(raw).trim();
        if (!model || NOT_AN_ENGINE.test(model)) continue;
        const key = model.toUpperCase();
        if (!byModel.has(key)) byModel.set(key, { model, parts: new Map() });
        byModel.get(key)!.parts.set(p.partNo.toUpperCase(), { ...p, categoryId: sub.id });
      }
    }
  }

  cached = [...byModel.values()]
    .map(({ model, parts }) => ({
      slug: engineSlug(model),
      model,
      make: inferMake(model),
      parts: [...parts.values()],
    }))
    .filter((e) => e.slug && e.parts.length >= MIN_PARTS)
    .sort((a, b) => b.parts.length - a.parts.length);

  return cached;
}

export function getEngineBySlug(slug: string): EngineEntry | undefined {
  return getEngineIndex().find((e) => e.slug === slug);
}

/** Engines a given part fits, for cross-linking from category pages. */
export function enginesForPart(partNo: string): EngineEntry[] {
  const key = partNo.toUpperCase();
  return getEngineIndex().filter((e) => e.parts.some((p) => p.partNo.toUpperCase() === key));
}
