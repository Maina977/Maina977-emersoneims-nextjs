/**
 * Re-review of 126efdbc, M-1 (2026-11-25): how the site location was obtained, and the state of the
 * water-body check, in ONE wording for the page and every export (screening PDF, Word, Excel, CSV,
 * JSON). Before, the screen said "Searched place, confirmed by the customer — centre of …" while the
 * exports printed bare coordinates.
 */
export function locationStatusText(result: any): string {
  const r = result ?? {};
  if (r.locationFromSearchedPin) return `Searched place, confirmed by the customer — centre of ${r.locationFromSearchedPin}`;
  if (r.locationFromPhotoGps) return `Camera GPS — position read from the photo’s EXIF data${r.locationNote ? `. ${r.locationNote}` : ''}`;
  if (r.gpsSource === 'device') return `Device GPS — the customer confirmed being at the site${r.gpsAccuracy ? ` (±${Math.round(Number(r.gpsAccuracy))} m)` : ''}`;
  if (r.gpsSource === 'manual') return 'Manual entry — coordinates typed by the customer';
  return 'Location source not recorded';
}

/** The photo-GPS conflict note (4e), or null. */
export function photoGpsConflictText(result: any): string | null {
  return result?.photoGpsConflictNote ? String(result.photoGpsConflictNote) : null;
}

/** The water-body check, as printed on the page and in the exports. */
export function waterCheckStatusText(result: any): string {
  const r = result ?? {};
  if (r.waterBodyCheckUnavailable) {
    return `${r.waterCheckNote ? String(r.waterCheckNote) : 'Water-body check unavailable'} — confirmed on land by the customer`;
  }
  return r.waterCheckNote ? String(r.waterCheckNote) : 'Not on a mapped lake, reservoir or the sea';
}
