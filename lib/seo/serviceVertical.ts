/**
 * WHICH TRADE IS A COUNTY/CONSTITUENCY SERVICE PAGE ABOUT?
 *
 * THE BUG THIS EXISTS TO PREVENT. Until 2026-09-27 the site-conditions blocks
 * rendered generator derating — "indicative total derate", "to deliver 100 kVA
 * here", and prose about what governs engine sizing — on every county+service
 * page regardless of the service. Measured live on that date:
 *
 *   /kenya/kakamega/solar-installation   6 kVA refs, 7 "derate", 0 irradiation
 *   /kenya/kakamega/motor-rewinding      6 kVA refs, 6 "derate"
 *   /kenya/kakamega/generators           6 kVA refs, 6 "derate"
 *
 * All three carried the identical sentence "To deliver 100 kVA here ≈ 118 kVA
 * nameplate required". One template's physics was leaking across unrelated
 * trades, which is bad for a reader who asked about panels and was told about
 * engine aspiration, and bad for the site, because it made a solar page and a
 * motor page substantially the same document.
 *
 * Altitude and design ambient stay on every trade — every machine on a site
 * experiences them. What is specific to engines renders only for engines.
 *
 * Lives in lib/ rather than in one component because two components need the
 * same answer, and two copies of a classifier is how they drift apart.
 */

export type Vertical = 'generator' | 'solar' | 'motor' | 'plumbing' | 'other';

/**
 * A bare county page (no service) is the generator hub — that is what it has
 * always been and what it still ranks for — so it keeps the engine treatment.
 */
export function verticalOf(slug: string | undefined): Vertical {
  if (!slug) return 'generator';
  if (/^generator|^automatic-transfer-switch$/.test(slug)) return 'generator';
  if (/^solar/.test(slug)) return 'solar';
  if (/^motor|^industrial-motors$|^pump-motors$/.test(slug)) return 'motor';
  if (/^plumbing/.test(slug)) return 'plumbing';
  return 'other';
}

/**
 * Optimal fixed tilt, and the direction an array has to face.
 *
 * Kenya straddles the equator — county HQs run from about 4.7°S at Kwale to
 * 4.6°N at Mandera — so the correct azimuth genuinely REVERSES across the
 * country. That is a real, county-specific, checkable fact, and it is exactly
 * the kind of thing these pages were missing while they recited engine physics.
 *
 * Tilt is floored at 10°: a panel laid flatter stops shedding dust when it
 * rains, and in most of Kenya soiling costs more yield than the couple of
 * percent gained by chasing latitude exactly.
 */
export function solarGeometry(lat: number): {
  tilt: number;
  facing: 'true north' | 'true south' | 'either north or south';
  nearEquator: boolean;
} {
  const tilt = Math.max(10, Math.round(Math.abs(lat)));
  const nearEquator = Math.abs(lat) <= 0.5;
  const facing = nearEquator
    ? 'either north or south'
    : lat < 0
      ? 'true north'
      : 'true south';
  return { tilt, facing, nearEquator };
}
