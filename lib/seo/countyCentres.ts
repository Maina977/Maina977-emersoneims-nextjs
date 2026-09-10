import { COUNTIES } from '@/lib/seo/kenyaLocations';

/**
 * The town a county is actually SEARCHED by, when that differs from the
 * county's administrative name.
 *
 * Kenya has 47 counties and 16 of them are commercially known by their
 * principal town rather than by the county: nobody types "Uasin Gishu
 * generator repair", they type "Eldoret generator repair". Eldoret is Kenya's
 * fifth-largest city and one of the eight commercial centres the owner named
 * as priorities on 2026-09-03 — and until that date the word "Eldoret"
 * appeared nowhere in the title of the page that serves it.
 *
 * Verified live the same day: all 16 of these town names returned 404 under
 * /kenya/, and /kenya/eldoret was linked from two pages on this site, so those
 * were broken internal links as well as missed searches.
 *
 * The pairs are not hand-typed. They are derived from the `capital` field
 * already carried in lib/seo/kenyaLocations.ts, so adding or correcting a
 * county capital there updates the titles and the redirect check together.
 *
 * "City" and "Town" suffixes are trimmed before comparing, so Nairobi County
 * (capital "Nairobi City") and Mombasa County ("Mombasa City") correctly count
 * as NOT differing — their pages already carry the right name.
 */

/** Strip the administrative suffix so "Mombasa City" compares as "Mombasa". */
function bare(capital: string): string {
  return capital.replace(/\s+(City|Town)$/i, '').trim();
}

/**
 * The commercial centre for a county, or null when the county is already known
 * by its own name. Null means "leave the existing title alone".
 */
export function commercialCentre(countySlug: string, countyName: string): string | null {
  const record = COUNTIES.find((c) => c.slug === countySlug);
  if (!record?.capital) return null;

  const centre = bare(record.capital);
  if (!centre) return null;

  return centre.toLowerCase() === countyName.toLowerCase() ? null : centre;
}

/**
 * Every county whose principal town differs from its name, as
 * { townSlug, countySlug } — the source for the /kenya/<town> redirects in
 * next.config.ts, and for the guard that keeps the two in step.
 */
export function commercialCentreAliases(): { town: string; townSlug: string; countySlug: string }[] {
  const out: { town: string; townSlug: string; countySlug: string }[] = [];

  for (const county of COUNTIES) {
    const centre = commercialCentre(county.slug, county.name);
    if (!centre) continue;
    out.push({
      town: centre,
      townSlug: centre.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-'),
      countySlug: county.slug,
    });
  }

  return out;
}
