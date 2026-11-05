import type { Metadata } from 'next';
import keepList from './locationKeepIndexed.json';

/**
 * LOCATION PAGE INDEX POLICY (stage 1, 2026-11-05).
 *
 * About 3,000 /kenya/{county}/... and /locations/{place}/{service} pages are
 * built from one template, and sampled pairs were about 71% the same text.
 * Google's guidance treats many near-identical town pages as doorway pages.
 * Most had no clicks and almost no impressions in three months.
 *
 * These pages stay online and keep working for visitors and for links. Only
 * the pages that EARNED search traffic keep their place in Google's index:
 *   - every location page in the sitemap, and
 *   - every page with a click, or more than 20 impressions, in the Search
 *     Console export of the last three months.
 * The rest get "noindex, follow", which is Google's documented way to keep a
 * page out of search while still letting its links be followed. Nothing is
 * cloaked: users and Googlebot see the same page.
 *
 * The list is in locationKeepIndexed.json, made by the keep_list script from
 * the Search Console Pages export. Re-running it with a newer export can add
 * pages back.
 */
const KEEP = new Set<string>(keepList as string[]);

export function isLocationPageKeptIndexed(path: string): boolean {
  return KEEP.has(path.replace(/\/$/, ''));
}

/** Adds noindex, follow to a location page's metadata unless it is kept. */
export function withLocationIndexPolicy(path: string, meta: Metadata): Metadata {
  if (isLocationPageKeptIndexed(path)) return meta;
  // A page whose canonical already names ANOTHER page is consolidated by that
  // canonical. Google advises against sending noindex and a cross-page
  // canonical together (conflicting signals), so only self-canonical pages
  // get the noindex.
  const canonical = meta.alternates?.canonical;
  const canonicalPath = typeof canonical === 'string' ? canonical.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') : null;
  if (canonicalPath && canonicalPath !== path.replace(/\/$/, '')) return meta;
  return { ...meta, robots: { index: false, follow: true } };
}
