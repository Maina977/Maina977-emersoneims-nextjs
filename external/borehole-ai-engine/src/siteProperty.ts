/**
 * Property and candidate locations (A, B, C…), up to four photos each, and the history of
 * every location, kept in the customer's browser only (AquaScan site-photo workflow,
 * 2026-11-25). Nothing is uploaded: photos and answers stay in this browser's storage.
 */
import { SITE_PHOTO_THRESHOLDS, checkPhoto, checkPhotoSet, type PhotoFacts, type PhotoCheck, type SetResult } from './sitePhotoChecks';
import { assessLocation, compareLocations, emptyChecklist, type Checklist, type LocationAssessment, type Hint } from './siteConstraints';

export interface StoredPhoto { id: string; facts: PhotoFacts; checks: PhotoCheck[]; dataUrl: string | null; addedAt: string }
export interface Revision { at: string; outcome: string; reasons: string[]; photos: string[]; checklist: Checklist }
export interface CandidateLocation {
  id: string; label: string; description: string;
  gps: { latitude: number; longitude: number } | null;
  photos: StoredPhoto[];
  checklist: Checklist;
  history: Revision[];
  createdAt: string;
}
export interface Property { name: string; county: string; gps: { latitude: number; longitude: number } | null; locations: CandidateLocation[]; updatedAt: string }

export const STORAGE_KEY = 'aquascan.sitePhotos.v1';
export const PRIVACY_NOTE = 'Your photos stay in this browser. They are not uploaded to EmersonEIMS or any other server; they are saved only on this device so you can come back to them.';

export const nextLabel = (p: Property) => String.fromCharCode(65 + p.locations.length); // A, B, C…

export function newProperty(): Property { return { name: '', county: '', gps: null, locations: [], updatedAt: new Date(0).toISOString() }; }

export function addLocation(p: Property, now = new Date()): Property {
  if (p.locations.length >= 26) return p;
  const label = nextLabel(p);
  return { ...p, updatedAt: now.toISOString(), locations: [...p.locations, { id: `loc-${label}-${now.getTime()}`, label: `Location ${label}`, description: '', gps: null, photos: [], checklist: emptyChecklist(), history: [], createdAt: now.toISOString() }] };
}

export type AddPhotoResult = { ok: true; property: Property } | { ok: false; reason: string };

/** Adds a photo to a location; a fifth photo is refused with the reason. */
export function addPhoto(p: Property, locId: string, photo: { facts: PhotoFacts; dataUrl: string | null }, now = new Date()): AddPhotoResult {
  const loc = p.locations.find((l) => l.id === locId);
  if (!loc) return { ok: false, reason: 'Unknown location.' };
  const max = SITE_PHOTO_THRESHOLDS.maxPhotosPerLocation;
  if (loc.photos.length >= max) return { ok: false, reason: `${loc.label} already has ${max} photos (the maximum). Remove one first, or add photos to another location.` };
  const stored: StoredPhoto = { id: `${locId}-p${now.getTime()}-${loc.photos.length + 1}`, facts: photo.facts, checks: checkPhoto(photo.facts, now), dataUrl: photo.dataUrl, addedAt: now.toISOString() };
  return { ok: true, property: updateLocation(p, locId, { photos: [...loc.photos, stored] }, now) };
}

export function removePhoto(p: Property, locId: string, photoId: string, now = new Date()): Property {
  const loc = p.locations.find((l) => l.id === locId);
  return loc ? updateLocation(p, locId, { photos: loc.photos.filter((x) => x.id !== photoId) }, now) : p;
}

export function updateLocation(p: Property, locId: string, patch: Partial<CandidateLocation>, now = new Date()): Property {
  return { ...p, updatedAt: now.toISOString(), locations: p.locations.map((l) => (l.id === locId ? { ...l, ...patch } : l)) };
}

export function photoSetOf(p: Property, loc: CandidateLocation): SetResult {
  return checkPhotoSet(loc.photos.map((x) => ({ facts: x.facts, checks: x.checks })), loc.gps ?? p.gps);
}

export function assess(p: Property, loc: CandidateLocation, hints: Hint[] = []): { set: SetResult; assessment: LocationAssessment } {
  const set = photoSetOf(p, loc);
  return { set, assessment: assessLocation(set, loc.checklist, hints) };
}

/** Records a revision in the location's history (when the customer presses "Assess"). */
export function recordRevision(p: Property, locId: string, now = new Date()): Property {
  const loc = p.locations.find((l) => l.id === locId);
  if (!loc) return p;
  const { assessment } = assess(p, loc);
  const rev: Revision = { at: now.toISOString(), outcome: assessment.outcome, reasons: assessment.reasons, photos: loc.photos.map((x) => x.facts.fileName), checklist: JSON.parse(JSON.stringify(loc.checklist)) };
  return updateLocation(p, locId, { history: [...loc.history, rev] }, now);
}

export function comparison(p: Property) {
  return compareLocations(p.locations.map((l) => ({ label: l.label, assessment: assess(p, l).assessment })));
}

// ───────────── browser storage (best effort; the workflow works without it) ─────────────

export interface KV { getItem(k: string): string | null; setItem(k: string, v: string): void }

export function save(p: Property, store: KV | null): { saved: boolean; photosSaved: boolean; note?: string } {
  if (!store) return { saved: false, photosSaved: false, note: 'Browser storage unavailable: this session only.' };
  try { store.setItem(STORAGE_KEY, JSON.stringify(p)); return { saved: true, photosSaved: true }; } catch {
    // Quota: keep the record (answers, checks, history) without the photo images.
    try {
      const lite = { ...p, locations: p.locations.map((l) => ({ ...l, photos: l.photos.map((x) => ({ ...x, dataUrl: null })) })) };
      store.setItem(STORAGE_KEY, JSON.stringify(lite));
      return { saved: true, photosSaved: false, note: 'Storage is full: the record was saved without the photo images.' };
    } catch { return { saved: false, photosSaved: false, note: 'Could not save in this browser.' }; }
  }
}

export function load(store: KV | null): Property | null {
  try {
    const raw = store?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Property;
    return p && Array.isArray(p.locations) ? p : null;
  } catch { return null; }
}
