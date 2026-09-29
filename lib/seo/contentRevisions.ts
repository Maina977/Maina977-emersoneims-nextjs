/**
 * WHEN EACH ROUTE FAMILY'S CONTENT GENUINELY LAST CHANGED.
 *
 * WHY THIS EXISTS. Organic impressions fell 97% in a single day on 2026-08-21
 * — from 1,373/day to 29/day — and have stayed flat for five weeks. The cause
 * was not a technical fault: Googlebot gets 200 everywhere, robots.txt allows
 * it, no real page carries noindex, and the sitemap is clean. What the domain
 * carried at that moment was roughly 59,000 near-duplicate programmatic
 * location pages, which is what Google's scaled-content and doorway-page
 * policies exist to demote.
 *
 * That sprawl has since been removed, canonicals consolidated, and the pages
 * that remain rewritten so each trade carries its own engineering. Measured on
 * 2026-09-29, 8-word phrase overlap across the submitted set:
 *
 *     same service, different county   50-53%   (was 60-68% in August)
 *     same county, different service   39-43%
 *
 * The work is done. What is missing is Google knowing it happened. lastmod is
 * the documented signal for exactly that, and 834 of the 929 submitted URLs
 * carried none.
 *
 * WHY A HAND-MAINTAINED MAP AND NOT A BUILD TIMESTAMP. app/sitemap.ts already
 * records the reason, and it is worth restating: on the build of 2026-09-21,
 * 948 of 1,008 lastmod values were the build time, which told Google every
 * page changed every deploy when almost none had. Google states it uses
 * lastmod only when it is consistently accurate, and a sitemap that cries wolf
 * gets its lastmod ignored — which is why the previous fix removed them
 * wholesale rather than faking them.
 *
 * So every date below is a REAL date, taken from the git commit that last
 * changed the code generating that family, and verified against the log:
 *
 *     kenya          2026-09-29  per-trade physics split, proof framing
 *     locations      2026-09-29  measured site conditions for 14 towns
 *     services       2026-09-29  12 divisions, plumbing, warranty settled
 *     generators     2026-09-29  parts pricing, both inventory figures
 *     sectors        2026-09-27  title composition
 *     brands         2026-09-21  new-vs-used framing
 *     repair-centre  2026-07-30  unchanged since
 *
 * THE RULE FOR WHOEVER EDITS THIS NEXT: move a date only when the CONTENT a
 * visitor reads has actually changed, and set it to the date that change
 * shipped — never to today, never to the build time. An inaccurate lastmod is
 * worse than none, because it costs the trust that makes the accurate ones
 * work.
 */

/** Route-family prefix -> ISO date its content last genuinely changed. */
export const CONTENT_REVISIONS: Readonly<Record<string, string>> = {
  kenya: '2026-09-29',
  locations: '2026-09-29',
  services: '2026-09-29',
  generators: '2026-09-29',
  sectors: '2026-09-27',
  brands: '2026-09-21',
  'repair-centre': '2026-07-30',
};

/**
 * The revision date for a path, or undefined when the family has none.
 *
 * Returns undefined rather than a fallback on purpose: a family with no
 * recorded revision emits no lastmod, which is the honest statement that we do
 * not know when it last changed.
 */
export function contentRevision(pathname: string): Date | undefined {
  const family = pathname.replace(/^https?:\/\/[^/]+/, '').split('/').filter(Boolean)[0];
  if (!family) return undefined;
  const iso = CONTENT_REVISIONS[family];
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
