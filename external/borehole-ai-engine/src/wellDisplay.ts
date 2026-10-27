/**
 * How a nearby water-point record is described to a customer (web table and
 * PDF), without changing the engine's statistics.
 *
 * 2026-10-25 audit: a registry "functional" status merged onto an unprotected
 * dug well was printed as "Success" in the borehole table; "Test" and
 * "fcuyvchsc" appeared as wells; one project was listed four times.
 */

export type WellKind = 'spring' | 'dug well' | 'borehole' | 'water point';

function text(w: any): string {
  return `${w?.id ?? ''} ${w?.aquiferType ?? ''} ${w?.name ?? ''}`.toLowerCase();
}

export function wellKind(w: any): WellKind {
  const s = text(w);
  if (/sp?ring/.test(s)) return 'spring';
  if (/\bdug\b|hand[- ]?dug|shallow well|protected well|unprotected well|open well/.test(s)) return 'dug well';
  if (/borehole|tube ?well|drilled|\bb\/?h\b|\bbh\s*\d/.test(s) || /field|wra|completion/i.test(String(w?.source ?? ''))) return 'borehole';
  return 'water point';
}

/** "Success"/"Dry" only for a drilled borehole with a tested yield or a field record. */
export function displayOutcome(w: any): string {
  const o = String(w?.outcome ?? 'Unknown');
  if (o === 'Unknown' || !o) return '—';
  const measured = Number(w?.yield_m3h) > 0 || /field|wra|completion/i.test(String(w?.source ?? ''));
  // An outcome inferred from the tested yield is not a recorded outcome (2026-10-27 audit).
  const inferred = w?.outcomeFromYield ? ' (from yield)' : '';
  if (wellKind(w) === 'borehole' && measured) return (o === 'Fail' ? 'Dry / failed' : o) + inferred;
  // Registry status for anything else is whether the point works today.
  if (o === 'Success' || o === 'Moderate') return 'Working';
  if (o === 'Fail') return 'Not working';
  return o;
}

/** Placeholder or junk names that are not real records. */
export function isJunkRecord(w: any): boolean {
  const id = String(w?.id ?? '').trim();
  if (!id) return true;
  if (/^(test|testing|xxx+|asdf|n\/?a|none|unknown)\b/i.test(id)) return true;
  // A single "word" with five consonants in a row is keyboard noise ("fcuyvchsc").
  const first = id.split(/[\s—,(-]/)[0];
  if (/^[a-z]+$/i.test(first) && first.length >= 6 && /[bcdfghjklmnpqrstvwxz]{5,}/i.test(first)) return true;
  // Mis-placed registry points (2026-10-25 audit round 5): a record named for a
  // town in a neighbouring country, or sitting exactly on the queried point
  // (a place-name centroid, not a surveyed position).
  if (/\b(mbarara|kampala|wakiso|mukono|jinja|gulu|mbale|arusha|moshi|dodoma|mwanza|kigali|juba|addis ababa|mogadishu)\b/i.test(id)) return true;
  if (Number(w?.distance_km) === 0 && !/field|wra|completion/i.test(String(w?.source ?? ''))) return true;
  return false;
}

/** Drop junk and repeat listings of the same named point within 1 km. */
export function cleanWellsForDisplay<T = any>(wells: T[]): T[] {
  const out: T[] = [];
  const seen: { key: string; d: number }[] = [];
  for (const w of wells as any[]) {
    if (isJunkRecord(w)) continue;
    const key = String(w.id ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
    const d = Number(w.distance_km) || 0;
    if (seen.some((s) => s.key === key && Math.abs(s.d - d) <= 1)) continue;
    seen.push({ key, d });
    out.push(w);
  }
  return out;
}
