/**
 * KENYA COUNTY SITE CONDITIONS — sourced physical data, not marketing copy.
 *
 * WHY THIS FILE EXISTS
 * The /kenya/* location pages were 98% textually identical: a measurement, not
 * an impression — four distinct words separated the Nairobi page from the
 * Mombasa one, because the template substituted a place name and changed
 * nothing else. Google reached the obvious conclusion and picked a single
 * canonical across unrelated counties (a Turkana URL was consolidated into a
 * Mombasa ward). Rewording those pages would not have changed that verdict;
 * Google was not confused about the words, it was right about the value.
 *
 * What genuinely differs between Lamu at 14 m and Iten at 2,355 m is the
 * ENGINEERING. Diesel gensets lose output with altitude and with ambient
 * temperature, so the same load needs a different machine in Kisumu than in
 * Nyandarua. That is a real difference, it is EmersonEIMS's actual expertise,
 * and it cannot be spun out of a thesaurus.
 *
 * PROVENANCE — every figure here is sourced, none is estimated.
 *   Source:    Open-Meteo Geocoding API, which republishes GeoNames
 *              (https://www.geonames.org/, CC BY 4.0)
 *   Retrieved: 2026-08-08
 *   Value:     elevation of the county headquarters town, in metres
 *
 * Each record was VERIFIED at fetch time, not trusted: the result had to be in
 * Kenya (country_code KE), had to be a populated place (never an airport or a
 * hill sharing the name), and its GeoNames admin1 had to match the county —
 * so a wrong headquarters guess failed loudly instead of silently producing a
 * plausible number. Two counties initially failed that check (Murang'a, whose
 * typographic apostrophe broke the query, and Elgeyo-Marakwet, which GeoNames
 * spells "Elegeyo-Marakwet") and were resolved individually rather than
 * filled in from memory.
 *
 * geonamesAdmin1 is retained deliberately: it is the evidence that the town
 * belongs to the county, and it preserves GeoNames' own spelling so a future
 * re-fetch can be diffed against what was actually returned.
 *
 * IMPORTANT — this is the HEADQUARTERS elevation, not the customer's site.
 * Counties span large altitude ranges. Every figure rendered from this file
 * must be presented as the county reference point with site confirmation
 * required, never as the site value. See countyEngineeringProfile().
 */

export interface CountySiteConditions {
  /** County headquarters town, as named by GeoNames. */
  readonly hq: string;
  /** Headquarters elevation in metres above sea level. */
  readonly elevationM: number;
  readonly lat: number;
  readonly lon: number;
  /** GeoNames' admin1 string — the evidence the town sits in this county. */
  readonly geonamesAdmin1: string;
  /** GeoNames feature code (PPLC capital, PPLA county seat, PPL town). */
  readonly featureCode: string;
}

export const COUNTY_CONDITIONS_SOURCE = {
  name: 'GeoNames, via the Open-Meteo Geocoding API',
  url: 'https://www.geonames.org/',
  licence: 'CC BY 4.0',
  retrieved: '2026-08-08',
} as const;

export const COUNTY_SITE_CONDITIONS: Readonly<Record<string, CountySiteConditions>> = {
  'baringo': { hq: "Kabarnet", elevationM: 2048, lat: 0.49194, lon: 35.74303, geonamesAdmin1: "Baringo", featureCode: 'PPLA' },
  'bomet': { hq: "Bomet", elevationM: 1959, lat: -0.78129, lon: 35.34156, geonamesAdmin1: "Bomet County", featureCode: 'PPLA' },
  'bungoma': { hq: "Bungoma", elevationM: 1427, lat: 0.5635, lon: 34.56055, geonamesAdmin1: "Bungoma County", featureCode: 'PPLA' },
  'busia': { hq: "Busia", elevationM: 1222, lat: 0.46005, lon: 34.11169, geonamesAdmin1: "Busia County", featureCode: 'PPLA' },
  'elgeyo-marakwet': { hq: "Iten", elevationM: 2355, lat: 0.67, lon: 35.51, geonamesAdmin1: "Elegeyo-Marakwet", featureCode: 'PPLA' },
  'embu': { hq: "Embu", elevationM: 1336, lat: -0.53987, lon: 37.45743, geonamesAdmin1: "Embu County", featureCode: 'PPLA' },
  'garissa': { hq: "Garissa", elevationM: 147, lat: -0.45275, lon: 39.64601, geonamesAdmin1: "Garissa County", featureCode: 'PPLA' },
  'homa-bay': { hq: "Homa Bay", elevationM: 1165, lat: -0.52731, lon: 34.45714, geonamesAdmin1: "Homa Bay County", featureCode: 'PPLA' },
  'isiolo': { hq: "Isiolo", elevationM: 1095, lat: 0.35462, lon: 37.58218, geonamesAdmin1: "Isiolo County", featureCode: 'PPLA' },
  'kajiado': { hq: "Kajiado", elevationM: 1725, lat: -1.85238, lon: 36.77683, geonamesAdmin1: "Kajiado County", featureCode: 'PPLA' },
  'kakamega': { hq: "Kakamega", elevationM: 1563, lat: 0.28422, lon: 34.75229, geonamesAdmin1: "Kakamega County", featureCode: 'PPLA' },
  'kericho': { hq: "Kericho", elevationM: 2002, lat: -0.36774, lon: 35.28314, geonamesAdmin1: "Kericho County", featureCode: 'PPLA' },
  'kiambu': { hq: "Kiambu", elevationM: 1683, lat: -1.17139, lon: 36.83556, geonamesAdmin1: "Kiambu County", featureCode: 'PPLA' },
  'kilifi': { hq: "Kilifi", elevationM: 24, lat: -3.63045, lon: 39.84992, geonamesAdmin1: "Kilifi County", featureCode: 'PPLA' },
  'kirinyaga': { hq: "Kerugoya", elevationM: 1548, lat: -0.49887, lon: 37.28031, geonamesAdmin1: "Kirinyaga County", featureCode: 'PPLA' },
  'kisii': { hq: "Kisii", elevationM: 1686, lat: -0.68174, lon: 34.76666, geonamesAdmin1: "Kisii County", featureCode: 'PPLA' },
  'kisumu': { hq: "Kisumu", elevationM: 1174, lat: -0.10221, lon: 34.76171, geonamesAdmin1: "Kisumu County", featureCode: 'PPLA' },
  'kitui': { hq: "Kitui", elevationM: 1154, lat: -1.36696, lon: 38.01055, geonamesAdmin1: "Kitui County", featureCode: 'PPLA' },
  'kwale': { hq: "Kwale", elevationM: 403, lat: -4.17375, lon: 39.45206, geonamesAdmin1: "Kwale County", featureCode: 'PPLA' },
  'laikipia': { hq: "Rumuruti", elevationM: 1846, lat: 0.2725, lon: 36.53806, geonamesAdmin1: "Laikipia", featureCode: 'PPLA' },
  'lamu': { hq: "Lamu", elevationM: 14, lat: -2.27169, lon: 40.90201, geonamesAdmin1: "Lamu", featureCode: 'PPLA' },
  'machakos': { hq: "Machakos", elevationM: 1619, lat: -1.52233, lon: 37.26521, geonamesAdmin1: "Machakos County", featureCode: 'PPLA' },
  'makueni': { hq: "Wote", elevationM: 1128, lat: -1.78079, lon: 37.62882, geonamesAdmin1: "Makueni County", featureCode: 'PPLA' },
  'mandera': { hq: "Mandera", elevationM: 217, lat: 3.93726, lon: 41.85688, geonamesAdmin1: "Mandera County", featureCode: 'PPLA' },
  'marsabit': { hq: "Marsabit", elevationM: 1364, lat: 2.33468, lon: 37.99086, geonamesAdmin1: "Marsabit County", featureCode: 'PPLA' },
  'meru': { hq: "Meru", elevationM: 1579, lat: 0.04626, lon: 37.65587, geonamesAdmin1: "Meru County", featureCode: 'PPLA' },
  'migori': { hq: "Migori", elevationM: 1382, lat: -1.06343, lon: 34.47313, geonamesAdmin1: "Migori County", featureCode: 'PPLA' },
  'mombasa': { hq: "Mombasa", elevationM: 20, lat: -4.05466, lon: 39.66359, geonamesAdmin1: "Mombasa County", featureCode: 'PPLA' },
  'muranga': { hq: "Murang'a", elevationM: 1318, lat: -0.72, lon: 37.15, geonamesAdmin1: "Murang'A", featureCode: 'PPLA' },
  'nairobi': { hq: "Nairobi", elevationM: 1684, lat: -1.28333, lon: 36.81667, geonamesAdmin1: "Nairobi County", featureCode: 'PPLC' },
  'nakuru': { hq: "Nakuru", elevationM: 1802, lat: -0.30719, lon: 36.07225, geonamesAdmin1: "Nakuru County", featureCode: 'PPLA' },
  'nandi': { hq: "Kapsabet", elevationM: 1998, lat: 0.20387, lon: 35.105, geonamesAdmin1: "Nandi", featureCode: 'PPLA' },
  'narok': { hq: "Narok", elevationM: 1881, lat: -1.08083, lon: 35.87111, geonamesAdmin1: "Narok County", featureCode: 'PPLA' },
  'nyamira': { hq: "Nyamira", elevationM: 2000, lat: -0.56333, lon: 34.93583, geonamesAdmin1: "Nyamira county", featureCode: 'PPLA' },
  'nyandarua': { hq: "Ol Kalou", elevationM: 2348, lat: -0.27088, lon: 36.37917, geonamesAdmin1: "Nyandarua County", featureCode: 'PPLA' },
  'nyeri': { hq: "Nyeri", elevationM: 1812, lat: -0.42013, lon: 36.94759, geonamesAdmin1: "Nyeri County", featureCode: 'PPLA' },
  'samburu': { hq: "Maralal", elevationM: 1941, lat: 1.09667, lon: 36.69806, geonamesAdmin1: "Samburu County", featureCode: 'PPLA' },
  'siaya': { hq: "Siaya", elevationM: 1321, lat: 0.0607, lon: 34.28806, geonamesAdmin1: "Siaya County", featureCode: 'PPLA' },
  'taita-taveta': { hq: "Wundanyi", elevationM: 1472, lat: -3.39642, lon: 38.35729, geonamesAdmin1: "Taita Taveta", featureCode: 'PPL' },
  'tana-river': { hq: "Hola", elevationM: 65, lat: -1.48256, lon: 40.03341, geonamesAdmin1: "Tana River County", featureCode: 'PPLA' },
  'tharaka-nithi': { hq: "Kathwana", elevationM: 722, lat: -0.33139, lon: 37.86861, geonamesAdmin1: "Tharaka - Nithi", featureCode: 'PPLA' },
  'trans-nzoia': { hq: "Kitale", elevationM: 1900, lat: 1.01572, lon: 35.00622, geonamesAdmin1: "Trans Nzoia", featureCode: 'PPLA' },
  'turkana': { hq: "Lodwar", elevationM: 500, lat: 3.11988, lon: 35.59642, geonamesAdmin1: "Turkana County", featureCode: 'PPLA' },
  'uasin-gishu': { hq: "Eldoret", elevationM: 2095, lat: 0.52036, lon: 35.26993, geonamesAdmin1: "Uasin Gishu County", featureCode: 'PPLA' },
  'vihiga': { hq: "Mbale", elevationM: 1628, lat: 0.08213, lon: 34.72139, geonamesAdmin1: "Vihiga County", featureCode: 'PPLA' },
  'wajir': { hq: "Wajir", elevationM: 258, lat: 1.7471, lon: 40.05732, geonamesAdmin1: "Wajir County", featureCode: 'PPLA' },
  'west-pokot': { hq: "Kapenguria", elevationM: 2020, lat: 1.23889, lon: 35.11194, geonamesAdmin1: "West Pokot County", featureCode: 'PPLA' },
};

/**
 * ISO 8528-1 states standard reference conditions for generating sets:
 * 100 kPa barometric (≈ sea level), 25 °C air inlet, 30% relative humidity.
 * Above those conditions an engine cannot draw the same mass of air, so it
 * cannot burn the same mass of fuel, so it cannot make the same power.
 *
 * DELIBERATELY APPROXIMATE, AND SAID SO IN THE COPY. Real derating comes from
 * the specific engine's derate table — it varies with aspiration (naturally
 * aspirated engines lose far more than turbocharged ones), with charge-air
 * cooling and with the engine family. The widely used planning figure is on
 * the order of 1% of output per 100 m above 300 m. We publish it as a
 * planning indication that tells a buyer whether altitude matters at their
 * site at all, and we say plainly that the engine's own table governs the
 * order. That is genuinely useful and it is honest; a precise-looking number
 * we cannot stand behind would be neither.
 */
export function altitudeDeratePercent(elevationM: number): number {
  if (elevationM <= 300) return 0;
  return Math.round(((elevationM - 300) / 100) * 10) / 10;
}

export type ExposureFlag = 'marine-air' | 'arid-dust' | 'high-ambient' | 'highland';

/**
 * Exposure classification. Derived from the VERIFIED elevation plus the
 * county's region — both already in the repo, neither invented here.
 * These drive which engineering notes a county page shows.
 */
export function countyExposure(slug: string, region: string, elevationM: number): ExposureFlag[] {
  const flags: ExposureFlag[] = [];
  // Marine air: littoral counties. Kept to the low-lying coastal strip —
  // Taita Taveta is a Coast-region county but its headquarters sits at
  // 1,472 m inland, so it is not flagged for salt exposure.
  if (region === 'Coast' && elevationM < 200) flags.push('marine-air');
  // Arid/dust: the northern rangelands. Filter service intervals shorten
  // sharply in airborne dust.
  if (region === 'North Eastern' || slug === 'turkana' || slug === 'samburu') flags.push('arid-dust');
  // High ambient: low altitude AND hot. Thermal derating dominates here even
  // though altitude derating is negligible.
  if (elevationM < 700) flags.push('high-ambient');
  // Highland: altitude derating is the governing constraint on sizing.
  if (elevationM >= 1500) flags.push('highland');
  return flags;
}

/** Look up a county's conditions, or undefined if it has no sourced record. */
export function getCountyConditions(slug: string): CountySiteConditions | undefined {
  return COUNTY_SITE_CONDITIONS[slug];
}
