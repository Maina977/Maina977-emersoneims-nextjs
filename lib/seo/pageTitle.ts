import type { Metadata } from 'next';

/**
 * TITLES THAT FIT IN A SEARCH RESULT.
 *
 * THE PROBLEM, MEASURED. app/layout.tsx sets a title template:
 *
 *     template: "%s | EmersonEIMS Kenya"
 *
 * which appends 20 characters — " | EmersonEIMS Kenya" — to every page that
 * does not opt out. Page titles across the site were written without budgeting
 * for those 20 characters, so on 2026-09-29, of 4,886 prerendered pages:
 *
 *     1,382 (28.3%) had a title longer than 60 characters
 *     4,449 of them ended in "| EmersonEIMS Kenya"
 *     the longest ran to 101 characters
 *
 * Google truncates around 60 characters — the real limit is pixel width, not
 * character count, but 60 is the usable working figure. A truncated title
 * loses the end of the sentence, which on this site is frequently the place
 * name: "Generator & Solar Services in Chuka Igambangombe, Tharaka Nithi |
 * EmersonEIMS Kenya" is 83 characters, and the county a searcher typed is the
 * part that disappears.
 *
 * THE FIX, AND WHY IT IS NOT "SHORTEN THE SUFFIX". Trimming the brand to
 * "| EmersonEIMS" saves six characters and leaves most of these still over the
 * limit. The suffix is not the problem; spending it unconditionally is.
 *
 * So this helper spends it only when there is room:
 *
 *   base + suffix fits in 60   ->  return the base, template appends the brand
 *   base alone fits in 60      ->  return { absolute: base }, no brand
 *   base alone exceeds 60      ->  return { absolute: base } and REPORT it
 *
 * The third case is deliberately not truncated with an ellipsis. A machine
 * cutting a sentence mid-word produces exactly the result we are trying to
 * avoid; a title that long is a content decision for whoever wrote it, and
 * scripts/check-titles.mjs names them so they can be fixed rather than hidden.
 *
 * Measured against the build: dropping the suffix where it does not fit brings
 * 1,138 of the 1,382 under 60 on its own.
 */

/** Exactly what app/layout.tsx appends, including the separator. */
export const BRAND_SUFFIX = ' | EmersonEIMS Kenya';

/**
 * Google truncates on pixel width; 60 characters is the conventional proxy and
 * the figure scripts/check-titles.mjs enforces.
 */
export const TITLE_LIMIT = 60;

/**
 * Compose a title that fits, keeping the brand only when it costs nothing.
 *
 * Returns the type Next expects for `metadata.title`, so it can be dropped
 * straight into a generateMetadata return.
 */
export function seoTitle(base: string): NonNullable<Metadata['title']> {
  const t = base.replace(/\s+/g, ' ').trim();
  if (t.length + BRAND_SUFFIX.length <= TITLE_LIMIT) return t;
  return { absolute: t };
}

/**
 * Compose from parts, dropping OPTIONAL trailing parts until it fits.
 *
 * For a location title the county is useful but not essential — "Generator &
 * Solar Services in Chuka Igambangombe" is a complete, accurate title, and
 * ", Tharaka Nithi" is what pushes it past the limit. Dropping a qualifier is
 * better than having Google cut one mid-word.
 *
 * `required` is never dropped. If it alone exceeds the limit the title is
 * returned as-is and the guard reports it.
 */
export function seoTitleParts(
  required: string,
  ...optional: Array<string | undefined | false>
): NonNullable<Metadata['title']> {
  const opts = optional.filter((x): x is string => typeof x === 'string' && x.trim() !== '');

  for (let keep = opts.length; keep >= 0; keep--) {
    const candidate = [required, ...opts.slice(0, keep)].join('').replace(/\s+/g, ' ').trim();
    if (candidate.length + BRAND_SUFFIX.length <= TITLE_LIMIT) return candidate;
    if (keep === 0 && candidate.length <= TITLE_LIMIT) return { absolute: candidate };
  }

  return { absolute: required.replace(/\s+/g, ' ').trim() };
}

/**
 * Fit a title that already contains its own "| qualifier" segments.
 *
 * Several families build titles from a metaTemplate that carries a trailing
 * qualifier of its own, and those were the 631 still over the limit after the
 * brand suffix was made conditional:
 *
 *   "Generators for Private Hospitals in Uasin Gishu | Medical Power Solutions"
 *   "Lister Petter Generator Repair & Spare Parts in Uasin Gishu | EmersonEIMS"
 *   "Diagnostics in Industrial Area, Nairobi | Install & Service"
 *
 * In every one the first segment is the whole claim and the rest is a
 * qualifier a searcher does not need. So segments are dropped from the right
 * until the title fits, and the brand suffix is spent only if there is still
 * room afterwards.
 *
 * The first segment is never dropped. If it alone exceeds the limit, the title
 * is returned intact rather than cut mid-word, and scripts/check-titles.mjs
 * names the page so a human can shorten it.
 */
export function seoTitleSmart(raw: string): NonNullable<Metadata['title']> {
  const parts = raw
    .split('|')
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (parts.length === 0) return { absolute: raw.trim() };

  for (let keep = parts.length; keep >= 1; keep--) {
    const candidate = parts.slice(0, keep).join(' | ');
    if (candidate.length + BRAND_SUFFIX.length <= TITLE_LIMIT) return candidate;
    if (candidate.length <= TITLE_LIMIT) return { absolute: candidate };
  }

  return { absolute: parts[0] };
}
