/**
 * Curated location × service matrix — the ONLY (location, service) pairs that
 * render a real /locations/[location]/[service] page. Kept as plain string
 * arrays here (edge-runtime safe) so BOTH the page/sitemap (via
 * kenyaLocations.ts) AND the middleware can share one source of truth.
 *
 * WHY the middleware needs it (2026-07-18): Next 16 serves `notFound()` inside
 * a matched dynamic route with HTTP 200 (a soft-404 that Google penalises).
 * The middleware validates the combo up-front and returns a real HTTP 404 for
 * anything outside this set — a hard, cacheable 404 that no streaming quirk
 * can turn back into a 200.
 */

export const INDEXED_TOP_LOCATIONS = [
  // Major cities / towns
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika',
  // Nairobi commercial & industrial areas (B2B power demand)
  'westlands', 'karen', 'kilimani', 'industrial-area', 'embakasi',
  'ruaraka', 'kasarani',
  // Regional economic centres (counties)
  'kiambu', 'machakos', 'kajiado', 'uasin-gishu', 'kakamega', 'meru',
  'nyeri', 'kericho', 'kisii', 'kilifi', 'bungoma', 'kitui', 'nyandarua',
];

export const INDEXED_TOP_SERVICES = [
  'generators',
  'solar',
  'ups',
  'electrical',
  'generator-diagnostics',
  'spare-parts',
  'borehole',
  'ac',
];

const LOC_SET = new Set(INDEXED_TOP_LOCATIONS);
const SVC_SET = new Set(INDEXED_TOP_SERVICES);

/** True when (location, service) is a curated, renderable pair. */
export function isIndexedLocationService(location: string, service: string): boolean {
  return LOC_SET.has(location) && SVC_SET.has(service);
}
