/**
 * REQ-27 (RS20 P5, 2026-11-27): the site confirmed on the Solar Genius Pro
 * Dashboard is carried into the Proposal page.
 *
 * Address → site → design check → proposal: the Dashboard finds the address
 * (place search), the user chooses a result and presses "Use this site in the
 * Proposal". Only what the user confirmed there is carried:
 *  - the address text of the chosen place-search result;
 *  - its coordinates;
 *  - the looked-up elevation, only when the user ticked it, with the service
 *    that answered.
 * Nothing else is carried. Irradiance, the current air temperature and the
 * roof footprint are NOT design values (the Proposal fetches its own hourly
 * weather; a current temperature is not a record low or a design maximum; a
 * footprint is not the usable area), so they are never pre-filled.
 *
 * Pre-filling only fills fields that are blank; a field the designer already
 * typed is never overwritten (it is listed as a difference instead). Each
 * pre-filled value is labelled with its source, and the label disappears as
 * soon as the value is edited.
 */
import type { ProposalForm } from './proposalForm';

export const SITE_HANDOFF_KEY = 'solargeniuspro_site_handoff_v1';
/** Form key holding the pre-fill record (value + source per field), so the labels survive a saved draft. */
export const HANDOFF_FORM_KEY = 'hand.site';
export const PLACE_SEARCH_SOURCE = 'OpenStreetMap Nominatim place search (result chosen on the Dashboard)';

export interface SiteHandoff {
  v: 1;
  /** When the user pressed "Use this site in the Proposal" (ISO). */
  confirmedAt: string;
  address: string;
  lat: number;
  lon: number;
  coordinatesSource: string;
  /** Only when the user ticked "include the elevation". */
  elevationM?: number;
  elevationSource?: string;
}

/** A pre-filled form value and the source it is labelled with. */
export interface Prefill { key: string; label: string; value: string; source: string }

const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const text = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/**
 * The hand-off from the Dashboard's site, or an error saying what is missing.
 * The elevation is included only when `includeElevation` is true and the
 * lookup gave a value with its source.
 */
export function buildSiteHandoff(
  site: { lat: number | null; lon: number | null; displayName: string; elevationM?: number | null; elevationSource?: string },
  includeElevation: boolean, now: Date = new Date(),
): { handoff: SiteHandoff; error: null } | { handoff: null; error: string } {
  if (!fin(site.lat) || !fin(site.lon) || !(site.lat >= -90 && site.lat <= 90 && site.lon >= -180 && site.lon <= 180)) return { handoff: null, error: 'Choose a place-search result first: the site has no coordinates.' };
  if (!text(site.displayName)) return { handoff: null, error: 'The chosen site has no address text.' };
  const h: SiteHandoff = { v: 1, confirmedAt: now.toISOString(), address: site.displayName.trim(), lat: site.lat, lon: site.lon, coordinatesSource: PLACE_SEARCH_SOURCE };
  if (includeElevation) {
    if (!fin(site.elevationM) || !(site.elevationM >= -500 && site.elevationM <= 6000) || !text(site.elevationSource)) return { handoff: null, error: 'No elevation with its source is available to include: untick it, or look it up again.' };
    h.elevationM = site.elevationM; h.elevationSource = site.elevationSource.trim();
  }
  return { handoff: h, error: null };
}

/** Strict read of a stored hand-off; anything malformed is null (never partly used). */
export function readSiteHandoff(raw: string | null): SiteHandoff | null {
  if (!raw) return null;
  let d: unknown;
  try { d = JSON.parse(raw); } catch { return null; }
  if (typeof d !== 'object' || d === null || Array.isArray(d)) return null;
  const x = d as Record<string, unknown>;
  if (x.v !== 1 || !text(x.confirmedAt) || Number.isNaN(Date.parse(x.confirmedAt)) || !text(x.address) || !text(x.coordinatesSource)) return null;
  if (!fin(x.lat) || !fin(x.lon) || !(x.lat >= -90 && x.lat <= 90 && x.lon >= -180 && x.lon <= 180)) return null;
  const hasEl = x.elevationM !== undefined || x.elevationSource !== undefined;
  if (hasEl && !(fin(x.elevationM) && x.elevationM >= -500 && x.elevationM <= 6000 && text(x.elevationSource))) return null;
  return { v: 1, confirmedAt: x.confirmedAt, address: x.address.trim(), lat: x.lat, lon: x.lon, coordinatesSource: x.coordinatesSource.trim(), ...(hasEl ? { elevationM: x.elevationM as number, elevationSource: (x.elevationSource as string).trim() } : {}) };
}

/** The form values the hand-off carries, each with its source label. */
export function siteHandoffPrefill(h: SiteHandoff): Prefill[] {
  const when = h.confirmedAt.slice(0, 10);
  const out: Prefill[] = [
    { key: 'c.address', label: 'Site address', value: h.address, source: `${h.coordinatesSource}, confirmed ${when}` },
    { key: 'c.lat', label: 'Latitude', value: String(h.lat), source: `${h.coordinatesSource}, confirmed ${when}` },
    { key: 'c.lon', label: 'Longitude', value: String(h.lon), source: `${h.coordinatesSource}, confirmed ${when}` },
  ];
  if (h.elevationM !== undefined && h.elevationSource) {
    out.push({ key: 's.elevationM', label: 'Site elevation', value: String(h.elevationM), source: `${h.elevationSource}, confirmed on the Dashboard ${when}` });
    out.push({ key: 's.source', label: 'Source of these site details', value: `Elevation: ${h.elevationSource} (Dashboard, ${when}); confirm on site`, source: `Dashboard hand-off ${when}` });
  }
  return out;
}

/**
 * Fill the blank form fields from the hand-off. A field already typed is not
 * touched: it is returned in `differences` when its value differs. The
 * applied values and their sources are recorded under HANDOFF_FORM_KEY.
 */
export function applySiteHandoff(f: ProposalForm, h: SiteHandoff): { form: ProposalForm; applied: Prefill[]; differences: Array<Prefill & { current: string }> } {
  const form: ProposalForm = { ...f };
  const applied: Prefill[] = [], differences: Array<Prefill & { current: string }> = [];
  const record = prefillRecord(f);
  for (const p of siteHandoffPrefill(h)) {
    const cur = (f[p.key] ?? '').trim();
    if (cur === '') { form[p.key] = p.value; applied.push(p); record[p.key] = { value: p.value, source: p.source }; }
    else if (cur !== p.value) differences.push({ ...p, current: cur });
  }
  if (applied.length) form[HANDOFF_FORM_KEY] = JSON.stringify(record);
  return { form, applied, differences };
}

/** Replace the listed fields with the hand-off values (the designer chose to), recording their sources. */
export function replaceWithHandoff(f: ProposalForm, items: Prefill[]): ProposalForm {
  const form: ProposalForm = { ...f };
  const record = prefillRecord(f);
  for (const p of items) { form[p.key] = p.value; record[p.key] = { value: p.value, source: p.source }; }
  if (items.length) form[HANDOFF_FORM_KEY] = JSON.stringify(record);
  return form;
}

/** The pre-fill record in the form (value and source per field); {} when absent or malformed. */
export function prefillRecord(f: ProposalForm): Record<string, { value: string; source: string }> {
  try {
    const d = JSON.parse(f[HANDOFF_FORM_KEY] ?? '{}');
    if (typeof d !== 'object' || d === null || Array.isArray(d)) return {};
    const out: Record<string, { value: string; source: string }> = {};
    for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
      const r = v as { value?: unknown; source?: unknown };
      if (r && typeof r.value === 'string' && typeof r.source === 'string') out[k] = { value: r.value, source: r.source };
    }
    return out;
  } catch { return {}; }
}

/** The source label of a field, shown only while its value is still the pre-filled one. */
export function prefillSource(f: ProposalForm, key: string): string | null {
  const r = prefillRecord(f)[key];
  return r && (f[key] ?? '').trim() === r.value ? r.source : null;
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
/** The browser's localStorage, or null where it is blocked (private mode, SSR). */
export function browserStore(): Store | null {
  try { return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null; } catch { return null; }
}
/** Dashboard side: store the confirmed site for the Proposal page. */
export function storeSiteHandoff(store: Store | null, h: SiteHandoff): { ok: true } | { ok: false; message: string } {
  if (!store) return { ok: false, message: 'This browser blocks local storage, so the site cannot be passed to the Proposal page: copy the address and coordinates by hand.' };
  try { store.setItem(SITE_HANDOFF_KEY, JSON.stringify(h)); return { ok: true }; }
  catch (e) { return { ok: false, message: `The site could not be stored for the Proposal page (${(e as Error).message}).` }; }
}
/** Proposal side: read the hand-off once and remove it, so later edits are never overwritten by it again. */
export function takeSiteHandoff(store: Store | null): SiteHandoff | null {
  if (!store) return null;
  try {
    const h = readSiteHandoff(store.getItem(SITE_HANDOFF_KEY));
    store.removeItem(SITE_HANDOFF_KEY);
    return h;
  } catch { return null; }
}
