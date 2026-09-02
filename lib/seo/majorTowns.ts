/**
 * The fifteen town landing pages the sitemap publishes.
 *
 * This list used to live as a local const inside app/sitemap.ts, which meant
 * the sitemap listed these towns and NOTHING linked to them. Measured on
 * 2026-09-02 by building the internal link graph of every sitemap URL: five of
 * the fifteen — diani, eldoret, kitale, malindi and naivasha — had zero inbound
 * internal links anywhere on the site. A URL that only a sitemap knows about is
 * a URL Google has little reason to value.
 *
 * app/locations/page.tsx now renders these as links, so the set is shared
 * rather than copied. Add a town here and it is both listed and linked; a
 * second hand-typed copy would drift.
 *
 * NOTE ON SCOPE: this is the TOWN tier only. The town+service tier
 * (/locations/<town>/<service>) is deliberately absent from the sitemap —
 * see the long comment in app/sitemap.ts. Those pages measured 64% identical
 * to one another and Google returned "Crawled - currently not indexed".
 * Do not add them here.
 */
export const MAJOR_TOWN_SLUGS = [
  'thika', 'eldoret', 'malindi', 'kitale', 'naivasha', 'ruiru', 'juja', 'kikuyu',
  'westlands', 'karen', 'ngong', 'ongata-rongai', 'mtwapa', 'nyali', 'diani',
] as const;

/** Slug -> display name, for link text. */
export function townLabel(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
