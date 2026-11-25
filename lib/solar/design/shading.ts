/**
 * Horizon / far-obstruction shading of the direct (beam) component
 * (Solar Genius Pro, 2026-11-25). Full method, worked example and
 * limitations: docs/engineering/solar-sld-and-shading.md.
 *
 * Inputs: a horizon profile seen from one reference point on the array, as
 *   - azimuth sectors with an obstruction elevation angle, and/or
 *   - obstacles modelled as vertical rectangles (walls) facing the array:
 *     height above the reference point h (m), perpendicular distance d (m),
 *     azimuth of the centre a (°, clockwise from north), width w (m).
 *
 * Formulas (angles in degrees, lengths in metres):
 *   Obstacle elevation at azimuth offset θ from its centre (|θ| ≤ atan(w/2 ÷ d)):
 *       e(θ) = atan(h × cos θ ÷ d)          (the wall is d/cos θ away along that bearing)
 *   Horizon elevation at azimuth φ: H(φ) = max of every sector and obstacle covering φ (0 if none).
 *   Sun altitude α = 90° − θz (true zenith from sunPosition.ts, no refraction).
 *   Beam blocked when α < H(φ_sun).
 *   Hour blocked fraction f = (sub-instants with 0 < α < H) ÷ (sub-instants with α > 0),
 *       6 sub-instants at the centres of six 10-minute slices of the hour.
 *   Shaded plane-of-array beam: B'_poa = B_poa × (1 − f).
 *   Monthly beam loss  = Σ B_poa·f ÷ Σ B_poa
 *   Monthly POA loss   = Σ B_poa·f ÷ Σ G_poa (unshaded total plane-of-array)
 *   Monthly energy loss = 1 − E_AC(shaded) ÷ E_AC(unshaded) (both from the same hourly chain)
 *
 * Diffuse: sky-diffuse and ground-reflected irradiance are NOT reduced
 * (explicit assumption). As an indication of what that leaves out, the
 * horizontal-surface sky-view factor of the profile is reported:
 *       SVF = 1 − (1/2π) ∫ sin²H(φ) dφ   (isotropic sky radiance; derivation in the doc)
 * and the indicative diffuse loss Σ D_sky,poa × (1 − SVF) ÷ Σ G_poa, which is NOT applied.
 */
import { solarPosition } from './sunPosition';

export const SHADING_ENGINE_VERSION = 'solar-horizon-shading 1.0.0 (2026-11-25)';
export const MAX_SECTORS = 72;
export const MAX_OBSTACLES = 50;
/** Offsets (minutes) of the six sub-instants from the middle of the hour. */
export const SUB_INSTANT_OFFSETS_MIN = [-25, -15, -5, 5, 15, 25] as const;
export const DIFFUSE_TREATMENT = 'Sky-diffuse and ground-reflected irradiance are not reduced by the horizon (assumption): only the direct beam is blocked. The indicative diffuse loss shown is NOT applied.';

const D = Math.PI / 180;

export interface HorizonSector { fromAzDeg: number; toAzDeg: number; elevationDeg: number }
export interface Obstacle { name: string; heightAboveArrayM: number; distanceM: number; azimuthDeg: number; widthM: number }
export interface HorizonProfile { sectors: HorizonSector[]; obstacles: Obstacle[]; source: string }

const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** Every problem with a profile, each with its reason; empty when the profile is usable. */
export function horizonErrors(p: unknown): string[] {
  const e: string[] = [];
  if (typeof p !== 'object' || p === null) return ['The horizon profile must be an object { sectors, obstacles, source }'];
  const h = p as Partial<HorizonProfile>;
  if (typeof h.source !== 'string' || !h.source.trim()) e.push('Horizon: the source of the profile is required (e.g. site survey with inclinometer and compass, date, surveyor)');
  const sectors = h.sectors ?? [], obstacles = h.obstacles ?? [];
  if (!Array.isArray(sectors) || !Array.isArray(obstacles)) return [...e, 'Horizon: sectors and obstacles must be lists'];
  if (sectors.length + obstacles.length === 0) e.push('Horizon: enter at least one sector or obstacle (or leave the horizon section empty for no horizon shading)');
  if (sectors.length > MAX_SECTORS) e.push(`Horizon: at most ${MAX_SECTORS} sectors`);
  if (obstacles.length > MAX_OBSTACLES) e.push(`Horizon: at most ${MAX_OBSTACLES} obstacles`);
  sectors.forEach((s, i) => {
    const l = `Horizon sector ${i + 1}`;
    if (!fin(s?.fromAzDeg) || !fin(s?.toAzDeg) || !fin(s?.elevationDeg)) { e.push(`${l}: from-azimuth, to-azimuth and elevation must be numbers`); return; }
    if (!(s.fromAzDeg >= 0 && s.fromAzDeg <= 360) || !(s.toAzDeg >= 0 && s.toAzDeg <= 360)) e.push(`${l}: azimuths must be 0–360° (clockwise from north)`);
    if (s.fromAzDeg % 360 === s.toAzDeg % 360 && Math.abs(s.toAzDeg - s.fromAzDeg) !== 360) e.push(`${l}: from- and to-azimuth are the same, so the sector has no width (use 0 to 360 for the full circle)`);
    if (!(s.elevationDeg >= 0 && s.elevationDeg < 90)) e.push(`${l}: elevation must be 0° or more and below 90°`);
  });
  obstacles.forEach((o, i) => {
    const l = `Obstacle ${i + 1}${typeof o?.name === 'string' && o.name.trim() ? ` (${o.name.trim()})` : ''}`;
    if (typeof o?.name !== 'string' || !o.name.trim()) e.push(`${l}: a name is required`);
    if (!fin(o?.heightAboveArrayM) || !fin(o?.distanceM) || !fin(o?.azimuthDeg) || !fin(o?.widthM)) { e.push(`${l}: height, distance, azimuth and width must be numbers`); return; }
    if (!(o.heightAboveArrayM > 0 && o.heightAboveArrayM <= 1000)) e.push(`${l}: height above the array must be above 0 and at most 1000 m (an obstacle lower than the array does not shade it)`);
    if (!(o.distanceM > 0 && o.distanceM <= 100000)) e.push(`${l}: distance must be above 0 and at most 100 000 m`);
    if (!(o.azimuthDeg >= 0 && o.azimuthDeg <= 360)) e.push(`${l}: azimuth must be 0–360° (clockwise from north)`);
    if (!(o.widthM > 0 && o.widthM <= 10000)) e.push(`${l}: width must be above 0 and at most 10 000 m`);
  });
  return e;
}

/** Signed difference a − b in degrees, in (−180, 180]. */
function angleDiff(a: number, b: number): number {
  const d = ((((a - b) % 360) + 540) % 360) - 180;
  return d === -180 ? 180 : d;
}

/** Elevation (°) of an obstacle seen at azimuth az, or 0 when az is outside its width. */
export function obstacleElevationDeg(o: Obstacle, azDeg: number): number {
  const theta = angleDiff(azDeg, o.azimuthDeg);
  const half = Math.atan(o.widthM / 2 / o.distanceM) / D;
  if (Math.abs(theta) > half) return 0;
  return Math.atan((o.heightAboveArrayM * Math.cos(theta * D)) / o.distanceM) / D;
}

/** True when the sector [from, to) clockwise covers az (wrapping through north when from > to; 0→360 is the full circle). */
export function sectorCovers(s: HorizonSector, azDeg: number): boolean {
  const az = ((azDeg % 360) + 360) % 360;
  const from = s.fromAzDeg % 360, to = s.toAzDeg % 360;
  if (Math.abs(s.toAzDeg - s.fromAzDeg) === 360) return true;
  return from < to ? az >= from && az < to : az >= from || az < to;
}

/** Horizon elevation H(φ) in degrees. */
export function horizonElevationDeg(p: HorizonProfile, azDeg: number): number {
  let h = 0;
  for (const s of p.sectors) if (sectorCovers(s, azDeg)) h = Math.max(h, s.elevationDeg);
  for (const o of p.obstacles) h = Math.max(h, obstacleElevationDeg(o, azDeg));
  return h;
}

/** Horizontal-surface sky-view factor, SVF = 1 − (1/2π)∫ sin²H dφ, midpoint rule on 0.1° steps. */
export function skyViewFactorHorizontal(p: HorizonProfile): number {
  const N = 3600;
  let s = 0;
  for (let k = 0; k < N; k++) s += Math.sin(horizonElevationDeg(p, (k + 0.5) * (360 / N)) * D) ** 2;
  return 1 - s / N;
}

/**
 * Fraction of the hour centred on midUtcMs during which the sun is up but
 * behind the horizon profile (0–1). Hours with the sun down throughout give 0.
 */
export function hourBlockedFraction(p: HorizonProfile, midUtcMs: number, latDeg: number, lonDeg: number): number {
  let up = 0, blocked = 0;
  for (const off of SUB_INSTANT_OFFSETS_MIN) {
    const sp = solarPosition(midUtcMs + off * 60000, latDeg, lonDeg);
    const alt = 90 - sp.zenith;
    if (alt <= 0) continue;
    up++;
    if (alt < horizonElevationDeg(p, sp.azimuth)) blocked++;
  }
  return up ? blocked / up : 0;
}

// ---------------------------------------------------------------- monthly accumulation
export interface ShadingMonth {
  month: number;                    // 1–12
  beamPoaKwhM2: number;             // unshaded beam on the plane
  beamBlockedKwhM2: number;
  poaUnshadedKwhM2: number;
  /** null when the month has no beam in the weather series. */
  beamLossPct: number | null;
  poaLossPct: number | null;
  energyLossPct: number | null;
}
export interface ShadingSummary {
  engineVersion: string;
  horizon: HorizonProfile;
  monthly: ShadingMonth[];
  annual: { beamLossPct: number | null; poaLossPct: number | null; energyLossPct: number | null; unshadedAnnualKwh: number; shadedAnnualKwh: number };
  skyViewFactorHorizontal: number;
  indicativeDiffuseLossPct: number | null;
  diffuseTreatment: string;
  method: string;
}

/** Running sums per month (Wh/m² and kWh), turned into a summary at the end. */
export class ShadingAccumulator {
  private beam = Array(12).fill(0); private blocked = Array(12).fill(0); private poa = Array(12).fill(0);
  private skyDiffuse = Array(12).fill(0); private acUn = Array(12).fill(0); private acSh = Array(12).fill(0);
  add(month: number, s: { beamPoaWm2: number; blockedFraction: number; skyDiffusePoaWm2: number; poaUnshadedWm2: number; acUnshadedKwh: number; acShadedKwh: number }): void {
    this.beam[month] += s.beamPoaWm2; this.blocked[month] += s.beamPoaWm2 * s.blockedFraction; this.poa[month] += s.poaUnshadedWm2;
    this.skyDiffuse[month] += s.skyDiffusePoaWm2; this.acUn[month] += s.acUnshadedKwh; this.acSh[month] += s.acShadedKwh;
  }
  summary(p: HorizonProfile): ShadingSummary {
    const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 10000) / 100 : null);
    const kwh = (wh: number) => Math.round(wh / 10) / 100; // Wh/m² over 1-h steps → kWh/m², 2 dp
    const monthly: ShadingMonth[] = this.beam.map((b, m) => ({
      month: m + 1, beamPoaKwhM2: kwh(b), beamBlockedKwhM2: kwh(this.blocked[m]), poaUnshadedKwhM2: kwh(this.poa[m]),
      beamLossPct: pct(this.blocked[m], b), poaLossPct: pct(this.blocked[m], this.poa[m]), energyLossPct: pct(this.acUn[m] - this.acSh[m], this.acUn[m]),
    }));
    const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
    const B = sum(this.beam), X = sum(this.blocked), G = sum(this.poa), Ds = sum(this.skyDiffuse), Eu = sum(this.acUn), Es = sum(this.acSh);
    const svf = skyViewFactorHorizontal(p);
    return {
      engineVersion: SHADING_ENGINE_VERSION, horizon: p, monthly,
      annual: { beamLossPct: pct(X, B), poaLossPct: pct(X, G), energyLossPct: pct(Eu - Es, Eu), unshadedAnnualKwh: Math.round(Eu), shadedAnnualKwh: Math.round(Es) },
      skyViewFactorHorizontal: Math.round(svf * 10000) / 10000,
      indicativeDiffuseLossPct: pct(Ds * (1 - svf), G),
      diffuseTreatment: DIFFUSE_TREATMENT,
      method: 'Beam blocked when the sun altitude is below the horizon elevation at the sun azimuth (6 sub-instants per hour; NOAA/Meeus sun position, no refraction). Horizon seen from one reference point on the array.',
    };
  }
}

/**
 * Beam-only shading loss of a given direct-normal series, for checks and the
 * worked example: B_poa = DNI × max(0, cos AOI) evaluated at the middle of each hour.
 * Returns the fraction Σ B_poa·f ÷ Σ B_poa.
 */
export function beamLossFromDni(p: HorizonProfile, site: { latDeg: number; lonDeg: number; tiltDeg: number; azimuthDeg: number }, startMidHourUtc: string, dniWm2: number[]): { beamWhM2: number; blockedWhM2: number; lossFraction: number; blockedFractions: number[] } {
  const errs = horizonErrors(p);
  if (errs.length) throw new Error(errs.join('; '));
  const t0 = Date.parse(startMidHourUtc);
  if (Number.isNaN(t0)) throw new Error('Start time must be an ISO date-time (UTC, middle of the first hour)');
  if (dniWm2.some((v) => !(v >= 0 && v < 1500))) throw new Error('DNI values must be 0–1500 W/m²');
  const tilt = site.tiltDeg * D, sAz = site.azimuthDeg * D;
  let beam = 0, blocked = 0;
  const fr: number[] = [];
  dniWm2.forEach((dni, h) => {
    const t = t0 + h * 3600000;
    const sp = solarPosition(t, site.latDeg, site.lonDeg);
    const z = sp.zenith * D, a = sp.azimuth * D;
    const cosAoi = Math.cos(z) * Math.cos(tilt) + Math.sin(z) * Math.sin(tilt) * Math.cos(a - sAz);
    const b = sp.zenith < 90 ? dni * Math.max(0, cosAoi) : 0;
    const f = hourBlockedFraction(p, t, site.latDeg, site.lonDeg);
    fr.push(f); beam += b; blocked += b * f;
  });
  return { beamWhM2: beam, blockedWhM2: blocked, lossFraction: beam > 0 ? blocked / beam : 0, blockedFractions: fr };
}

// ---------------------------------------------------------------- form text
/**
 * Parse the form text. Sectors: one per line (or separated by ";"),
 * "from,to,elevation" in degrees. Obstacles: "name,height m,distance m,azimuth °,width m".
 * All three blank → null (no horizon shading). Anything else must be complete.
 */
export function parseHorizonText(sectorsText: string, obstaclesText: string, source: string): { profile: HorizonProfile | null; errors: string[] } {
  const rows = (t: string) => (t ?? '').split(/[;\r\n]+/).map((x) => x.trim()).filter((x) => x !== '');
  const sr = rows(sectorsText), or = rows(obstaclesText);
  if (!sr.length && !or.length && !(source ?? '').trim()) return { profile: null, errors: [] };
  const errors: string[] = [];
  const toNum = (x: string) => (x.trim() === '' ? NaN : Number(x.trim()));
  const sectors: HorizonSector[] = [];
  sr.forEach((r, i) => {
    const c = r.split(',');
    if (c.length !== 3) { errors.push(`Horizon sector line ${i + 1} ("${r.slice(0, 40)}"): expected from-azimuth, to-azimuth, elevation`); return; }
    sectors.push({ fromAzDeg: toNum(c[0]), toAzDeg: toNum(c[1]), elevationDeg: toNum(c[2]) });
  });
  const obstacles: Obstacle[] = [];
  or.forEach((r, i) => {
    const c = r.split(',');
    if (c.length !== 5) { errors.push(`Obstacle line ${i + 1} ("${r.slice(0, 40)}"): expected name, height above array (m), distance (m), azimuth (°), width (m)`); return; }
    obstacles.push({ name: c[0].trim(), heightAboveArrayM: toNum(c[1]), distanceM: toNum(c[2]), azimuthDeg: toNum(c[3]), widthM: toNum(c[4]) });
  });
  const profile: HorizonProfile = { sectors, obstacles, source: (source ?? '').trim() };
  errors.push(...horizonErrors(profile));
  return errors.length ? { profile: null, errors } : { profile, errors };
}

// ---------------------------------------------------------------- shared table rows

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pctTxt = (x: number | null) => (x === null ? 'no beam in the data' : `${x} %`);
/** Monthly shading rows, shared by the Excel sheet and the PDF table (same numbers as the screen). */
export function shadingRows(s: ShadingSummary): Array<[string, number, number, string, string, string]> {
  return [
    ...s.monthly.map((m) => [MONTHS[m.month - 1], m.beamPoaKwhM2, m.beamBlockedKwhM2, pctTxt(m.beamLossPct), pctTxt(m.poaLossPct), pctTxt(m.energyLossPct)] as [string, number, number, string, string, string]),
    ['Year', Math.round(s.monthly.reduce((a, m) => a + m.beamPoaKwhM2, 0) * 100) / 100, Math.round(s.monthly.reduce((a, m) => a + m.beamBlockedKwhM2, 0) * 100) / 100, pctTxt(s.annual.beamLossPct), pctTxt(s.annual.poaLossPct), pctTxt(s.annual.energyLossPct)],
  ];
}
export const SHADING_HEAD = ['Month', 'Beam on plane, unshaded (kWh/m²)', 'Beam blocked (kWh/m²)', 'Beam loss', 'Plane-of-array loss', 'AC energy loss'];
