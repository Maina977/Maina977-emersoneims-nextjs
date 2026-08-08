/**
 * KENYA COUNTY SITE CONDITIONS — sourced physical data, not marketing copy.
 *
 * WHY THIS FILE EXISTS
 * The /kenya/* pages were 98% textually identical — a measurement, not an
 * impression. Four distinct words separated the Nairobi page from the Mombasa
 * one, because the template substituted a place name and changed nothing else.
 * Google reached the obvious conclusion and consolidated unrelated counties
 * onto one canonical. Rewording would not have changed that verdict: Google
 * was not confused about the words, it was right about the value.
 *
 * What genuinely differs between these places is the ENGINEERING. A generating
 * set is rated at ISO 8528-1 reference conditions — 100 kPa (about sea level),
 * 25 C, 30% RH. Almost nowhere in Kenya is at those conditions, and the ways
 * each place departs from them are different and measurable.
 *
 * THREE INDEPENDENT SOURCED AXES, so two counties that happen to match on one
 * still differ on the others:
 *   1. ALTITUDE     — thinner air, less oxygen, less power
 *   2. TEMPERATURE  — hotter air is less dense, and cools the set less well
 *   3. DISTANCE     — real separation from the Embakasi workshop
 *
 * PROVENANCE — every figure is sourced; none is estimated.
 *   Elevation & coordinates:
 *     GeoNames via the Open-Meteo Geocoding API (CC BY 4.0), retrieved
 *     2026-08-08. Elevation of the county headquarters town, in metres.
 *   Temperature:
 *     Open-Meteo ERA5 reanalysis archive (CC BY 4.0), retrieved 2026-08-08.
 *     Full calendar year 2025 of daily maximum 2 m air temperature, sampled at
 *     the SAME verified headquarters coordinates — so the climate figure comes
 *     from a point independently confirmed to sit in the county, not from a
 *     guessed centroid.
 *
 * Each elevation record was VERIFIED at fetch time, not trusted: the result had
 * to be in Kenya (country_code KE), had to be a populated place (never an
 * airport or a hill sharing the name), and its GeoNames admin1 had to match the
 * county — so a wrong headquarters guess failed loudly instead of quietly
 * producing a plausible number. Two counties failed that check (Murang'a, whose
 * typographic apostrophe broke the query, and Elgeyo-Marakwet, which GeoNames
 * spells "Elegeyo-Marakwet") and were resolved individually rather than filled
 * in from memory.
 *
 * geonamesAdmin1 is retained deliberately: it is the evidence the town belongs
 * to the county, in GeoNames' own spelling, so a future re-fetch can be diffed
 * against what was actually returned.
 *
 * IMPORTANT — these are HEADQUARTERS figures, not the customer's site.
 * Counties span large altitude and climate ranges. Everything rendered from
 * this file must be presented as a county reference point requiring site
 * confirmation, never as the site value.
 */

export interface CountySiteConditions {
  /** County headquarters town, as named by GeoNames. */
  readonly hq: string;
  /** Headquarters elevation in metres above sea level. */
  readonly elevationM: number;
  readonly lat: number;
  readonly lon: number;
  /** Mean daily maximum air temperature, C, 2025. */
  readonly meanMaxC: number;
  /** 95th-percentile daily maximum, C — the sensible design ambient. */
  readonly p95MaxC: number;
  /** Hottest single day in 2025, C. */
  readonly absMaxC: number;
  /** GeoNames admin1 — the evidence the town sits in this county. */
  readonly geonamesAdmin1: string;
  /** GeoNames feature code (PPLC capital, PPLA county seat, PPL town). */
  readonly featureCode: string;
}

export const COUNTY_CONDITIONS_SOURCE = {
  elevation: 'GeoNames, via the Open-Meteo Geocoding API',
  climate: 'Open-Meteo ERA5 reanalysis, 2025 daily maxima',
  licence: 'CC BY 4.0',
  retrieved: '2026-08-08',
} as const;

/**
 * The Embakasi workshop, from the same verified GeoNames lookup used for the
 * counties. NOTE: the EmersonEIMS mobile workshop covers all 47 counties —
 * this is the fixed base, never a limit on where we work.
 */
export const HQ_LOCATION = {
  name: 'Embakasi, Nairobi',
  lat: -1.3,
  lon: 36.91667,
  elevationM: 1615,
} as const;

export const COUNTY_SITE_CONDITIONS: Readonly<Record<string, CountySiteConditions>> = {
  'baringo': { hq: "Kabarnet", elevationM: 2048, lat: 0.49194, lon: 35.74303, meanMaxC: 23.3, p95MaxC: 26.5, absMaxC: 28.8, geonamesAdmin1: "Baringo", featureCode: 'PPLA' },
  'bomet': { hq: "Bomet", elevationM: 1959, lat: -0.78129, lon: 35.34156, meanMaxC: 24, p95MaxC: 27.7, absMaxC: 29.2, geonamesAdmin1: "Bomet County", featureCode: 'PPLA' },
  'bungoma': { hq: "Bungoma", elevationM: 1427, lat: 0.5635, lon: 34.56055, meanMaxC: 26.9, p95MaxC: 32.9, absMaxC: 35, geonamesAdmin1: "Bungoma County", featureCode: 'PPLA' },
  'busia': { hq: "Busia", elevationM: 1222, lat: 0.46005, lon: 34.11169, meanMaxC: 28.6, p95MaxC: 34.2, absMaxC: 36.8, geonamesAdmin1: "Busia County", featureCode: 'PPLA' },
  'elgeyo-marakwet': { hq: "Iten", elevationM: 2355, lat: 0.67, lon: 35.51, meanMaxC: 20.5, p95MaxC: 23.4, absMaxC: 25.5, geonamesAdmin1: "Elegeyo-Marakwet", featureCode: 'PPLA' },
  'embu': { hq: "Embu", elevationM: 1336, lat: -0.53987, lon: 37.45743, meanMaxC: 24.9, p95MaxC: 28.2, absMaxC: 31, geonamesAdmin1: "Embu County", featureCode: 'PPLA' },
  'garissa': { hq: "Garissa", elevationM: 147, lat: -0.45275, lon: 39.64601, meanMaxC: 34.8, p95MaxC: 37.9, absMaxC: 39.3, geonamesAdmin1: "Garissa County", featureCode: 'PPLA' },
  'homa-bay': { hq: "Homa Bay", elevationM: 1165, lat: -0.52731, lon: 34.45714, meanMaxC: 28, p95MaxC: 31.8, absMaxC: 34, geonamesAdmin1: "Homa Bay County", featureCode: 'PPLA' },
  'isiolo': { hq: "Isiolo", elevationM: 1095, lat: 0.35462, lon: 37.58218, meanMaxC: 29.7, p95MaxC: 32.9, absMaxC: 34.3, geonamesAdmin1: "Isiolo County", featureCode: 'PPLA' },
  'kajiado': { hq: "Kajiado", elevationM: 1725, lat: -1.85238, lon: 36.77683, meanMaxC: 25.4, p95MaxC: 28, absMaxC: 29.7, geonamesAdmin1: "Kajiado County", featureCode: 'PPLA' },
  'kakamega': { hq: "Kakamega", elevationM: 1563, lat: 0.28422, lon: 34.75229, meanMaxC: 26.8, p95MaxC: 32, absMaxC: 34.1, geonamesAdmin1: "Kakamega County", featureCode: 'PPLA' },
  'kericho': { hq: "Kericho", elevationM: 2002, lat: -0.36774, lon: 35.28314, meanMaxC: 22.4, p95MaxC: 25.9, absMaxC: 28.5, geonamesAdmin1: "Kericho County", featureCode: 'PPLA' },
  'kiambu': { hq: "Kiambu", elevationM: 1683, lat: -1.17139, lon: 36.83556, meanMaxC: 24.3, p95MaxC: 27.9, absMaxC: 29.5, geonamesAdmin1: "Kiambu County", featureCode: 'PPLA' },
  'kilifi': { hq: "Kilifi", elevationM: 24, lat: -3.63045, lon: 39.84992, meanMaxC: 29.4, p95MaxC: 32, absMaxC: 34.3, geonamesAdmin1: "Kilifi County", featureCode: 'PPLA' },
  'kirinyaga': { hq: "Kerugoya", elevationM: 1548, lat: -0.49887, lon: 37.28031, meanMaxC: 23.6, p95MaxC: 26.9, absMaxC: 29.9, geonamesAdmin1: "Kirinyaga County", featureCode: 'PPLA' },
  'kisii': { hq: "Kisii", elevationM: 1686, lat: -0.68174, lon: 34.76666, meanMaxC: 24.8, p95MaxC: 29.2, absMaxC: 31.7, geonamesAdmin1: "Kisii County", featureCode: 'PPLA' },
  'kisumu': { hq: "Kisumu", elevationM: 1174, lat: -0.10221, lon: 34.76171, meanMaxC: 29.1, p95MaxC: 33.5, absMaxC: 36.4, geonamesAdmin1: "Kisumu County", featureCode: 'PPLA' },
  'kitui': { hq: "Kitui", elevationM: 1154, lat: -1.36696, lon: 38.01055, meanMaxC: 27.2, p95MaxC: 30.7, absMaxC: 32.5, geonamesAdmin1: "Kitui County", featureCode: 'PPLA' },
  'kwale': { hq: "Kwale", elevationM: 403, lat: -4.17375, lon: 39.45206, meanMaxC: 28.6, p95MaxC: 32.7, absMaxC: 34.2, geonamesAdmin1: "Kwale County", featureCode: 'PPLA' },
  'laikipia': { hq: "Rumuruti", elevationM: 1846, lat: 0.2725, lon: 36.53806, meanMaxC: 25.8, p95MaxC: 29.2, absMaxC: 30.6, geonamesAdmin1: "Laikipia", featureCode: 'PPLA' },
  'lamu': { hq: "Lamu", elevationM: 14, lat: -2.27169, lon: 40.90201, meanMaxC: 30.1, p95MaxC: 32.8, absMaxC: 34.7, geonamesAdmin1: "Lamu", featureCode: 'PPLA' },
  'machakos': { hq: "Machakos", elevationM: 1619, lat: -1.52233, lon: 37.26521, meanMaxC: 23.7, p95MaxC: 26.4, absMaxC: 28.6, geonamesAdmin1: "Machakos County", featureCode: 'PPLA' },
  'makueni': { hq: "Wote", elevationM: 1128, lat: -1.78079, lon: 37.62882, meanMaxC: 27.5, p95MaxC: 30.4, absMaxC: 32.7, geonamesAdmin1: "Makueni County", featureCode: 'PPLA' },
  'mandera': { hq: "Mandera", elevationM: 217, lat: 3.93726, lon: 41.85688, meanMaxC: 35.3, p95MaxC: 38.2, absMaxC: 40, geonamesAdmin1: "Mandera County", featureCode: 'PPLA' },
  'marsabit': { hq: "Marsabit", elevationM: 1364, lat: 2.33468, lon: 37.99086, meanMaxC: 26.4, p95MaxC: 29.4, absMaxC: 31.1, geonamesAdmin1: "Marsabit County", featureCode: 'PPLA' },
  'meru': { hq: "Meru", elevationM: 1579, lat: 0.04626, lon: 37.65587, meanMaxC: 22.8, p95MaxC: 25.8, absMaxC: 27.3, geonamesAdmin1: "Meru County", featureCode: 'PPLA' },
  'migori': { hq: "Migori", elevationM: 1382, lat: -1.06343, lon: 34.47313, meanMaxC: 28.3, p95MaxC: 33.3, absMaxC: 35.8, geonamesAdmin1: "Migori County", featureCode: 'PPLA' },
  'mombasa': { hq: "Mombasa", elevationM: 20, lat: -4.05466, lon: 39.66359, meanMaxC: 29.2, p95MaxC: 32.3, absMaxC: 34.6, geonamesAdmin1: "Mombasa County", featureCode: 'PPLA' },
  'muranga': { hq: "Murang'a", elevationM: 1318, lat: -0.72, lon: 37.15, meanMaxC: 25.6, p95MaxC: 29.9, absMaxC: 32.4, geonamesAdmin1: "Murang'A", featureCode: 'PPLA' },
  'nairobi': { hq: "Nairobi", elevationM: 1684, lat: -1.28333, lon: 36.81667, meanMaxC: 25.5, p95MaxC: 29.3, absMaxC: 31.3, geonamesAdmin1: "Nairobi County", featureCode: 'PPLC' },
  'nakuru': { hq: "Nakuru", elevationM: 1802, lat: -0.30719, lon: 36.07225, meanMaxC: 25.2, p95MaxC: 29.2, absMaxC: 31.5, geonamesAdmin1: "Nakuru County", featureCode: 'PPLA' },
  'nandi': { hq: "Kapsabet", elevationM: 1998, lat: 0.20387, lon: 35.105, meanMaxC: 22.6, p95MaxC: 26.1, absMaxC: 28.3, geonamesAdmin1: "Nandi", featureCode: 'PPLA' },
  'narok': { hq: "Narok", elevationM: 1881, lat: -1.08083, lon: 35.87111, meanMaxC: 24.6, p95MaxC: 28.3, absMaxC: 30.3, geonamesAdmin1: "Narok County", featureCode: 'PPLA' },
  'nyamira': { hq: "Nyamira", elevationM: 2000, lat: -0.56333, lon: 34.93583, meanMaxC: 23.3, p95MaxC: 27.6, absMaxC: 30.2, geonamesAdmin1: "Nyamira county", featureCode: 'PPLA' },
  'nyandarua': { hq: "Ol Kalou", elevationM: 2348, lat: -0.27088, lon: 36.37917, meanMaxC: 20.8, p95MaxC: 23.7, absMaxC: 26.2, geonamesAdmin1: "Nyandarua County", featureCode: 'PPLA' },
  'nyeri': { hq: "Nyeri", elevationM: 1812, lat: -0.42013, lon: 36.94759, meanMaxC: 22.4, p95MaxC: 25.9, absMaxC: 28, geonamesAdmin1: "Nyeri County", featureCode: 'PPLA' },
  'samburu': { hq: "Maralal", elevationM: 1941, lat: 1.09667, lon: 36.69806, meanMaxC: 22.9, p95MaxC: 25.2, absMaxC: 26.9, geonamesAdmin1: "Samburu County", featureCode: 'PPLA' },
  'siaya': { hq: "Siaya", elevationM: 1321, lat: 0.0607, lon: 34.28806, meanMaxC: 27.3, p95MaxC: 32.1, absMaxC: 35.2, geonamesAdmin1: "Siaya County", featureCode: 'PPLA' },
  'taita-taveta': { hq: "Wundanyi", elevationM: 1472, lat: -3.39642, lon: 38.35729, meanMaxC: 24, p95MaxC: 26.6, absMaxC: 29, geonamesAdmin1: "Taita Taveta", featureCode: 'PPL' },
  'tana-river': { hq: "Hola", elevationM: 65, lat: -1.48256, lon: 40.03341, meanMaxC: 34.8, p95MaxC: 38.4, absMaxC: 40.5, geonamesAdmin1: "Tana River County", featureCode: 'PPLA' },
  'tharaka-nithi': { hq: "Kathwana", elevationM: 722, lat: -0.33139, lon: 37.86861, meanMaxC: 31.4, p95MaxC: 34.5, absMaxC: 36.4, geonamesAdmin1: "Tharaka - Nithi", featureCode: 'PPLA' },
  'trans-nzoia': { hq: "Kitale", elevationM: 1900, lat: 1.01572, lon: 35.00622, meanMaxC: 24.6, p95MaxC: 29, absMaxC: 31, geonamesAdmin1: "Trans Nzoia", featureCode: 'PPLA' },
  'turkana': { hq: "Lodwar", elevationM: 500, lat: 3.11988, lon: 35.59642, meanMaxC: 35, p95MaxC: 37.8, absMaxC: 39.3, geonamesAdmin1: "Turkana County", featureCode: 'PPLA' },
  'uasin-gishu': { hq: "Eldoret", elevationM: 2095, lat: 0.52036, lon: 35.26993, meanMaxC: 23.2, p95MaxC: 26.6, absMaxC: 28.7, geonamesAdmin1: "Uasin Gishu County", featureCode: 'PPLA' },
  'vihiga': { hq: "Mbale", elevationM: 1628, lat: 0.08213, lon: 34.72139, meanMaxC: 26.2, p95MaxC: 31, absMaxC: 33.2, geonamesAdmin1: "Vihiga County", featureCode: 'PPLA' },
  'wajir': { hq: "Wajir", elevationM: 258, lat: 1.7471, lon: 40.05732, meanMaxC: 34.2, p95MaxC: 37.5, absMaxC: 39.3, geonamesAdmin1: "Wajir County", featureCode: 'PPLA' },
  'west-pokot': { hq: "Kapenguria", elevationM: 2020, lat: 1.23889, lon: 35.11194, meanMaxC: 23, p95MaxC: 26.6, absMaxC: 28.2, geonamesAdmin1: "West Pokot County", featureCode: 'PPLA' },
};

/**
 * ISO 8528-1 reference conditions: 100 kPa (about sea level), 25 C, 30% RH.
 * Above those, an engine cannot draw the same mass of air, so it cannot burn
 * the same mass of fuel, so it cannot make the same power.
 *
 * DELIBERATELY APPROXIMATE, AND THE PAGES SAY SO. Real derating comes from the
 * specific engine's derate table and varies with aspiration (naturally
 * aspirated engines lose far more than turbocharged ones) and charge-air
 * cooling. These are the planning figures used across the industry — about 1%
 * of output per 100 m above 300 m, and about 2% per 5 C above 25 C. They tell a
 * buyer whether altitude or heat matters at their site at all, which is
 * genuinely useful; a precise-looking number we cannot stand behind would not
 * be.
 */
export function altitudeDeratePercent(elevationM: number): number {
  if (elevationM <= 300) return 0;
  return Math.round(((elevationM - 300) / 100) * 10) / 10;
}

export function temperatureDeratePercent(designAmbientC: number): number {
  if (designAmbientC <= 25) return 0;
  return Math.round(((designAmbientC - 25) / 5) * 2 * 10) / 10;
}

/** Combined planning derate. Additive is the standard planning simplification. */
export function combinedDeratePercent(c: CountySiteConditions): number {
  return (
    Math.round(
      (altitudeDeratePercent(c.elevationM) + temperatureDeratePercent(c.p95MaxC)) * 10
    ) / 10
  );
}

/**
 * Which constraint actually governs at this site. This is what makes two
 * counties read differently even when their total derate is similar: at
 * Nyandarua altitude is the whole story, at Tana River heat is, and the
 * engineering advice that follows is not the same.
 */
export type GoverningConstraint = 'altitude' | 'temperature' | 'both' | 'neither';

export function governingConstraint(c: CountySiteConditions): GoverningConstraint {
  const a = altitudeDeratePercent(c.elevationM);
  const t = temperatureDeratePercent(c.p95MaxC);
  if (a < 1 && t < 1) return 'neither';
  if (a >= 1 && t >= 1 && Math.abs(a - t) < Math.max(a, t) * 0.4) return 'both';
  return a >= t ? 'altitude' : 'temperature';
}

export type ExposureFlag = 'marine-air' | 'arid-dust' | 'high-ambient' | 'highland';

/**
 * Exposure classification, derived from VERIFIED elevation, MEASURED
 * temperature and the county's region — all already established, none
 * invented here.
 */
export function countyExposure(
  slug: string,
  region: string,
  c: CountySiteConditions
): ExposureFlag[] {
  const flags: ExposureFlag[] = [];
  // Marine air: the low-lying coastal strip only. Taita Taveta is a Coast
  // county but its headquarters sits inland at 1,472 m, so it is not flagged.
  if (region === 'Coast' && c.elevationM < 200) flags.push('marine-air');
  // Arid/dust: the northern rangelands, where filter restriction rather than
  // running hours governs service intervals.
  if (region === 'North Eastern' || slug === 'turkana' || slug === 'samburu') {
    flags.push('arid-dust');
  }
  // High ambient: judged on MEASURED design temperature, not inferred from
  // altitude — Kisumu at 1,174 m runs hotter than Nakuru at 1,802 m.
  if (c.p95MaxC >= 32) flags.push('high-ambient');
  if (c.elevationM >= 1500) flags.push('highland');
  return flags;
}

/**
 * Great-circle distance in km from the Embakasi workshop. This is straight-line
 * separation, not road distance, and is labelled as such wherever it is shown.
 */
export function distanceFromHqKm(c: CountySiteConditions): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(c.lat - HQ_LOCATION.lat);
  const dLon = toRad(c.lon - HQ_LOCATION.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(HQ_LOCATION.lat)) * Math.cos(toRad(c.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/** Compass bearing from the Embakasi workshop, as a cardinal word. */
export function bearingFromHq(c: CountySiteConditions): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLon = toRad(c.lon - HQ_LOCATION.lon);
  const y = Math.sin(dLon) * Math.cos(toRad(c.lat));
  const x =
    Math.cos(toRad(HQ_LOCATION.lat)) * Math.sin(toRad(c.lat)) -
    Math.sin(toRad(HQ_LOCATION.lat)) * Math.cos(toRad(c.lat)) * Math.cos(dLon);
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  const dirs = [
    'north', 'north-east', 'east', 'south-east',
    'south', 'south-west', 'west', 'north-west',
  ];
  return dirs[Math.round(((deg + 360) % 360) / 45) % 8];
}

/*
 * BANDS.
 *
 * The four governing-constraint branches alone were not enough: measured
 * across the 47 counties they produced only 10 distinct narratives, with 22
 * counties sharing a single one. The numbers differed but the prose did not,
 * which is the same duplication problem in a smarter disguise.
 *
 * These bands add further axes that are still derived from SOURCED data —
 * altitude, measured design temperature, real distance from the workshop, and
 * the county population already in the repo. Each band carries genuinely
 * different engineering advice, not a reworded version of the same advice:
 * what you do at 2,300 m is not what you do at 1,550 m, and a 4.4-million
 * county is not a 144-thousand one.
 */

export type AltitudeBand = 'sea-level' | 'low' | 'mid' | 'high' | 'very-high';

export function altitudeBand(elevationM: number): AltitudeBand {
  if (elevationM < 300) return 'sea-level';
  if (elevationM < 1000) return 'low';
  if (elevationM < 1500) return 'mid';
  if (elevationM < 2000) return 'high';
  return 'very-high';
}

export type ThermalBand = 'temperate' | 'warm' | 'hot' | 'extreme';

/** Banded on the MEASURED 95th-percentile daily maximum. */
export function thermalBand(p95MaxC: number): ThermalBand {
  if (p95MaxC < 27) return 'temperate';
  if (p95MaxC < 31) return 'warm';
  if (p95MaxC < 36) return 'hot';
  return 'extreme';
}

export type ReachBand = 'metro' | 'near' | 'regional' | 'remote';

export function reachBand(km: number): ReachBand {
  if (km < 40) return 'metro';
  if (km < 150) return 'near';
  if (km < 350) return 'regional';
  return 'remote';
}

export type ScaleBand = 'major' | 'large' | 'mid' | 'small';

/** Banded on county population, which is already in lib/data/kenya-locations.ts. */
export function scaleBand(population: number): ScaleBand {
  if (population >= 2_000_000) return 'major';
  if (population >= 1_000_000) return 'large';
  if (population >= 500_000) return 'mid';
  return 'small';
}

/** Look up a county's conditions, or undefined if it has no sourced record. */
export function getCountyConditions(slug: string): CountySiteConditions | undefined {
  return COUNTY_SITE_CONDITIONS[slug];
}
