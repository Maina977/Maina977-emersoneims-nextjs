/**
 * EAST AFRICA CITY SITE CONDITIONS — verified elevation and measured temperature.
 *
 * WHY THIS EXISTS
 * A duplication audit on 2026-08-26 measured the East Africa city pages at 89%
 * eight-word shingle overlap: /tanzania/dodoma, /rwanda/kigali, /drc/kinshasa
 * and /south-sudan/juba were the same ~590 words with the city name swapped.
 * That is the doorway pattern, and it is the same defect that was suppressing
 * the /kenya pages before they were differentiated (they now measure 55%).
 *
 * The only honest way to make pages genuinely different is to say something
 * that genuinely differs. Altitude and ambient temperature qualify: a diesel
 * set loses output to both, so the machine specified for Adama at 2,732 m and
 * 19.5 C is not the machine specified for Tadjoura at 3 m and 34.2 C, and the
 * advice that follows is opposite rather than reworded.
 *
 * SOURCES — fetched 2026-08-26, nothing invented:
 *   Elevation & coordinates : Open-Meteo Geocoding API (GeoNames-derived)
 *   Temperature             : Open-Meteo Archive, ERA5 reanalysis, 2025 daily
 *                             max/min averaged over the year
 *
 * Four of the 68 cities could not be resolved (Zanzibar City, Mekelle,
 * Djibouti City, Ali Sabieh) and are ABSENT rather than filled with a
 * plausible figure. Components must render nothing for a missing city.
 *
 * Derate formulas are shared with lib/data/kenya-county-conditions.ts so the
 * two page families cannot drift apart in what they claim.
 */

export interface CitySiteConditions {
  slug: string;
  city: string;
  country: string;
  /** Metres above sea level. */
  elevationM: number;
  lat: number;
  lon: number;
  /** Mean daily maximum, 2025. */
  meanMaxC?: number;
  /** Mean daily minimum, 2025. */
  meanMinC?: number;
  /** Design ambient for sizing: mean max plus 60% of the gap to annual peak. */
  p95MaxC?: number;
}

export const EA_CONDITIONS_SOURCE = {
  elevation: 'Open-Meteo Geocoding API (GeoNames elevation), retrieved 2026-08-26',
  temperature: 'Open-Meteo Archive (ERA5 reanalysis), 2025 daily maxima and minima',
} as const;

export const EA_CITY_CONDITIONS: Readonly<Record<string, CitySiteConditions>> = {
  'kampala': { slug: 'kampala', city: "Kampala", country: "Uganda", elevationM: 1223, lat: 0.3163, lon: 32.5822, meanMaxC: 26.4, meanMinC: 18, p95MaxC: 31 },
  'entebbe': { slug: 'entebbe', city: "Entebbe", country: "Uganda", elevationM: 1151, lat: 0.0562, lon: 32.4795, meanMaxC: 25.3, meanMinC: 19.2, p95MaxC: 27.8 },
  'jinja': { slug: 'jinja', city: "Jinja", country: "Uganda", elevationM: 1187, lat: 0.439, lon: 33.2032, meanMaxC: 26.6, meanMinC: 17.9, p95MaxC: 30.6 },
  'mbale': { slug: 'mbale', city: "Mbale", country: "Uganda", elevationM: 1125, lat: 1.0821, lon: 34.175 },
  'mbarara': { slug: 'mbarara', city: "Mbarara", country: "Uganda", elevationM: 1422, lat: -0.6047, lon: 30.6485, meanMaxC: 28.1, meanMinC: 16, p95MaxC: 32.2 },
  'gulu': { slug: 'gulu', city: "Gulu", country: "Uganda", elevationM: 1104, lat: 2.7746, lon: 32.299, meanMaxC: 29.8, meanMinC: 19.1, p95MaxC: 34.8 },
  'lira': { slug: 'lira', city: "Lira", country: "Uganda", elevationM: 1104, lat: 2.2499, lon: 32.8999, meanMaxC: 29.8, meanMinC: 19, p95MaxC: 34.5 },
  'fort-portal': { slug: 'fort-portal', city: "Fort Portal", country: "Uganda", elevationM: 1518, lat: 0.6617, lon: 30.2748, meanMaxC: 24.5, meanMinC: 16.1, p95MaxC: 28.3 },
  'masaka': { slug: 'masaka', city: "Masaka", country: "Uganda", elevationM: 1292, lat: -0.3338, lon: 31.7341, meanMaxC: 26.5, meanMinC: 17, p95MaxC: 30.4 },
  'kasese': { slug: 'kasese', city: "Kasese", country: "Uganda", elevationM: 989, lat: 0.1833, lon: 30.0833, meanMaxC: 30.1, meanMinC: 19.9, p95MaxC: 34.4 },
  'dar-es-salaam': { slug: 'dar-es-salaam', city: "Dar es Salaam", country: "Tanzania", elevationM: 24, lat: -6.8235, lon: 39.2695, meanMaxC: 30.3, meanMinC: 23.6, p95MaxC: 33.5 },
  'dodoma': { slug: 'dodoma', city: "Dodoma", country: "Tanzania", elevationM: 1125, lat: -6.1722, lon: 35.7395, meanMaxC: 29, meanMinC: 17.3, p95MaxC: 32.1 },
  'arusha': { slug: 'arusha', city: "Arusha", country: "Tanzania", elevationM: 1415, lat: -3.3667, lon: 36.6833, meanMaxC: 24.6, meanMinC: 15.1, p95MaxC: 28.2 },
  'mwanza': { slug: 'mwanza', city: "Mwanza", country: "Tanzania", elevationM: 1144, lat: -2.5167, lon: 32.9, meanMaxC: 26.4, meanMinC: 19, p95MaxC: 29.6 },
  'moshi': { slug: 'moshi', city: "Moshi", country: "Tanzania", elevationM: 854, lat: -3.35, lon: 37.3333, meanMaxC: 29.2, meanMinC: 18.2, p95MaxC: 34.2 },
  'tanga': { slug: 'tanga', city: "Tanga", country: "Tanzania", elevationM: 22, lat: -5.0689, lon: 39.0988, meanMaxC: 29.9, meanMinC: 22.7, p95MaxC: 33.1 },
  'morogoro': { slug: 'morogoro', city: "Morogoro", country: "Tanzania", elevationM: 504, lat: -6.821, lon: 37.6612, meanMaxC: 30.3, meanMinC: 20.3, p95MaxC: 33.8 },
  'mbeya': { slug: 'mbeya', city: "Mbeya", country: "Tanzania", elevationM: 1697, lat: -8.9, lon: 33.45, meanMaxC: 23.7, meanMinC: 14, p95MaxC: 27.8 },
  'iringa': { slug: 'iringa', city: "Iringa", country: "Tanzania", elevationM: 1625, lat: -7.7667, lon: 35.7, meanMaxC: 25.4, meanMinC: 14.8, p95MaxC: 29.4 },
  'kigali': { slug: 'kigali', city: "Kigali", country: "Rwanda", elevationM: 1542, lat: -1.95, lon: 30.0588, meanMaxC: 26.3, meanMinC: 15.2, p95MaxC: 30.3 },
  'butare': { slug: 'butare', city: "Butare", country: "Rwanda", elevationM: 1769, lat: -2.5967, lon: 29.7394, meanMaxC: 24.4, meanMinC: 14, p95MaxC: 27.2 },
  'gisenyi': { slug: 'gisenyi', city: "Gisenyi", country: "Rwanda", elevationM: 1461, lat: -1.7028, lon: 29.2564, meanMaxC: 22.9, meanMinC: 16.9, p95MaxC: 25.2 },
  'ruhengeri': { slug: 'ruhengeri', city: "Ruhengeri", country: "Rwanda", elevationM: 1849, lat: -1.4998, lon: 29.635, meanMaxC: 22.6, meanMinC: 13.4, p95MaxC: 25.7 },
  'gitarama': { slug: 'gitarama', city: "Gitarama", country: "Rwanda", elevationM: 1824, lat: -2.0744, lon: 29.7567, meanMaxC: 23.6, meanMinC: 13.6, p95MaxC: 26 },
  'cyangugu': { slug: 'cyangugu', city: "Cyangugu", country: "Rwanda", elevationM: 1582, lat: -2.4846, lon: 28.9075, meanMaxC: 23.4, meanMinC: 15.5, p95MaxC: 26 },
  'byumba': { slug: 'byumba', city: "Byumba", country: "Rwanda", elevationM: 2263, lat: -1.5763, lon: 30.0675, meanMaxC: 20.2, meanMinC: 10.6, p95MaxC: 23.9 },
  'nyanza': { slug: 'nyanza', city: "Nyanza", country: "Rwanda", elevationM: 1792, lat: -2.3519, lon: 29.7509, meanMaxC: 23.6, meanMinC: 12.7, p95MaxC: 26.2 },
  'juba': { slug: 'juba', city: "Juba", country: "South Sudan", elevationM: 518, lat: 4.8517, lon: 31.5825, meanMaxC: 34.4, meanMinC: 23.1, p95MaxC: 38.8 },
  'wau': { slug: 'wau', city: "Wau", country: "South Sudan", elevationM: 440, lat: 7.7011, lon: 27.9897, meanMaxC: 34.3, meanMinC: 23, p95MaxC: 38.4 },
  'malakal': { slug: 'malakal', city: "Malakal", country: "South Sudan", elevationM: 400, lat: 9.5334, lon: 31.6605, meanMaxC: 35.4, meanMinC: 24.5, p95MaxC: 39.1 },
  'bor': { slug: 'bor', city: "Bor", country: "South Sudan", elevationM: 429, lat: 6.2089, lon: 31.5586, meanMaxC: 34.7, meanMinC: 23.6, p95MaxC: 39 },
  'yei': { slug: 'yei', city: "Yei", country: "South Sudan", elevationM: 836, lat: 4.0944, lon: 30.6764, meanMaxC: 31.9, meanMinC: 20.1, p95MaxC: 37 },
  'torit': { slug: 'torit', city: "Torit", country: "South Sudan", elevationM: 617, lat: 4.4118, lon: 32.5705, meanMaxC: 33.2, meanMinC: 22, p95MaxC: 38.1 },
  'rumbek': { slug: 'rumbek', city: "Rumbek", country: "South Sudan", elevationM: 428, lat: 6.8062, lon: 29.6774, meanMaxC: 34.8, meanMinC: 23, p95MaxC: 39.1 },
  'aweil': { slug: 'aweil', city: "Aweil", country: "South Sudan", elevationM: 425, lat: 8.7619, lon: 27.3919, meanMaxC: 35.2, meanMinC: 23.2, p95MaxC: 39.5 },
  'kinshasa': { slug: 'kinshasa', city: "Kinshasa", country: "DR Congo", elevationM: 281, lat: -4.3276, lon: 15.3136, meanMaxC: 30.5, meanMinC: 22.6, p95MaxC: 33.3 },
  'lubumbashi': { slug: 'lubumbashi', city: "Lubumbashi", country: "DR Congo", elevationM: 1260, lat: -11.6609, lon: 27.4794, meanMaxC: 27, meanMinC: 16.4, p95MaxC: 31.1 },
  'goma': { slug: 'goma', city: "Goma", country: "DR Congo", elevationM: 1518, lat: -1.6741, lon: 29.2284, meanMaxC: 22.5, meanMinC: 16.5, p95MaxC: 24.8 },
  'bukavu': { slug: 'bukavu', city: "Bukavu", country: "DR Congo", elevationM: 1631, lat: -2.4908, lon: 28.8428, meanMaxC: 23.8, meanMinC: 15.8, p95MaxC: 26.4 },
  'kisangani': { slug: 'kisangani', city: "Kisangani", country: "DR Congo", elevationM: 400, lat: 0.5153, lon: 25.191, meanMaxC: 31.1, meanMinC: 22.2, p95MaxC: 34.8 },
  'mbuji-mayi': { slug: 'mbuji-mayi', city: "Mbuji-Mayi", country: "DR Congo", elevationM: 621, lat: -6.136, lon: 23.5898, meanMaxC: 32.3, meanMinC: 21.7, p95MaxC: 35.8 },
  'kananga': { slug: 'kananga', city: "Kananga", country: "DR Congo", elevationM: 643, lat: -5.8962, lon: 22.4166, meanMaxC: 32, meanMinC: 20.7, p95MaxC: 35.4 },
  'kolwezi': { slug: 'kolwezi', city: "Kolwezi", country: "DR Congo", elevationM: 1485, lat: -10.7148, lon: 25.4667, meanMaxC: 25.5, meanMinC: 15.7, p95MaxC: 29.1 },
  'addis-ababa': { slug: 'addis-ababa', city: "Addis Ababa", country: "Ethiopia", elevationM: 2405, lat: 9.025, lon: 38.7469, meanMaxC: 21.8, meanMinC: 9.5, p95MaxC: 24.8 },
  'dire-dawa': { slug: 'dire-dawa', city: "Dire Dawa", country: "Ethiopia", elevationM: 1204, lat: 9.5931, lon: 41.8661, meanMaxC: 30.9, meanMinC: 18.3, p95MaxC: 34.1 },
  'gondar': { slug: 'gondar', city: "Gondar", country: "Ethiopia", elevationM: 2201, lat: 12.6, lon: 37.4667, meanMaxC: 23.1, meanMinC: 13.1, p95MaxC: 26.4 },
  'hawassa': { slug: 'hawassa', city: "Hawassa", country: "Ethiopia", elevationM: 1697, lat: 7.0621, lon: 38.4763, meanMaxC: 24.8, meanMinC: 16.4, p95MaxC: 28.2 },
  'bahir-dar': { slug: 'bahir-dar', city: "Bahir Dar", country: "Ethiopia", elevationM: 1799, lat: 11.5936, lon: 37.3908, meanMaxC: 26, meanMinC: 14.7, p95MaxC: 29.2 },
  'adama': { slug: 'adama', city: "Adama", country: "Ethiopia", elevationM: 2732, lat: 10.7059, lon: 39.552, meanMaxC: 19.5, meanMinC: 9.1, p95MaxC: 23.1 },
  'jimma': { slug: 'jimma', city: "Jimma", country: "Ethiopia", elevationM: 1719, lat: 7.6734, lon: 36.8344, meanMaxC: 24.1, meanMinC: 13.4, p95MaxC: 27.1 },
  'tadjoura': { slug: 'tadjoura', city: "Tadjoura", country: "Djibouti", elevationM: 3, lat: 11.7878, lon: 42.8822, meanMaxC: 34.2, meanMinC: 26.3, p95MaxC: 40.9 },
  'obock': { slug: 'obock', city: "Obock", country: "Djibouti", elevationM: 13, lat: 11.9669, lon: 43.2884, meanMaxC: 33.2, meanMinC: 27, p95MaxC: 40.3 },
  'dikhil': { slug: 'dikhil', city: "Dikhil", country: "Djibouti", elevationM: 479, lat: 11.1045, lon: 42.3697, meanMaxC: 35.2, meanMinC: 22.8, p95MaxC: 39.5 },
  'asmara': { slug: 'asmara', city: "Asmara", country: "Eritrea", elevationM: 2334, lat: 15.3381, lon: 38.9318, meanMaxC: 22, meanMinC: 12.4, p95MaxC: 25.5 },
  'massawa': { slug: 'massawa', city: "Massawa", country: "Eritrea", elevationM: 9, lat: 15.6081, lon: 39.4746, meanMaxC: 32.2, meanMinC: 27.9, p95MaxC: 37.2 },
  'keren': { slug: 'keren', city: "Keren", country: "Eritrea", elevationM: 1399, lat: 15.7779, lon: 38.4511, meanMaxC: 28.9, meanMinC: 15.8, p95MaxC: 33.9 },
  'assab': { slug: 'assab', city: "Assab", country: "Eritrea", elevationM: 22, lat: 13.0092, lon: 42.7394, meanMaxC: 35, meanMinC: 26.7, p95MaxC: 40.2 },
  'mendefera': { slug: 'mendefera', city: "Mendefera", country: "Eritrea", elevationM: 1977, lat: 14.8872, lon: 38.8153, meanMaxC: 27.1, meanMinC: 13.3, p95MaxC: 30.8 },
  'hargeisa': { slug: 'hargeisa', city: "Hargeisa", country: "Somaliland", elevationM: 1261, lat: 9.56, lon: 44.065, meanMaxC: 29.5, meanMinC: 17, p95MaxC: 33.3 },
  'berbera': { slug: 'berbera', city: "Berbera", country: "Somaliland", elevationM: 11, lat: 10.4396, lon: 45.0143, meanMaxC: 34, meanMinC: 26.5, p95MaxC: 39.9 },
  'burao': { slug: 'burao', city: "Burao", country: "Somaliland", elevationM: 1041, lat: 9.5221, lon: 45.5336, meanMaxC: 30.9, meanMinC: 18.6, p95MaxC: 34.2 },
  'borama': { slug: 'borama', city: "Borama", country: "Somaliland", elevationM: 1468, lat: 9.9361, lon: 43.1828, meanMaxC: 28.7, meanMinC: 16, p95MaxC: 32.7 },
  'las-anod': { slug: 'las-anod', city: "Las Anod", country: "Somaliland", elevationM: 692, lat: 8.4774, lon: 47.3597, meanMaxC: 31.6, meanMinC: 20.2, p95MaxC: 34.4 },
  'erigavo': { slug: 'erigavo', city: "Erigavo", country: "Somaliland", elevationM: 1786, lat: 10.6162, lon: 47.368, meanMaxC: 26.6, meanMinC: 14.5, p95MaxC: 30.3 },
};

/** Naturally aspirated diesel: roughly 1% output lost per 100 m above 300 m. */
export function eaAltitudeDeratePercent(elevationM: number): number {
  if (elevationM <= 300) return 0;
  return Math.round(((elevationM - 300) / 100) * 10) / 10;
}

/** Roughly 2% lost per 5 C of intake air above 25 C. */
export function eaTemperatureDeratePercent(designAmbientC: number): number {
  if (designAmbientC <= 25) return 0;
  return Math.round(((designAmbientC - 25) / 5) * 2 * 10) / 10;
}

export function eaCombinedDeratePercent(c: CitySiteConditions): number {
  if (c.p95MaxC == null) return eaAltitudeDeratePercent(c.elevationM);
  return Math.round((eaAltitudeDeratePercent(c.elevationM) + eaTemperatureDeratePercent(c.p95MaxC)) * 10) / 10;
}

export type EaGoverning = 'altitude' | 'temperature' | 'both' | 'neither';

/**
 * Which constraint actually governs. This is what makes two cities read
 * differently even at a similar total derate: at Addis Ababa altitude is the
 * whole story, at Berbera heat is, and the engineering that follows differs.
 */
export function eaGoverningConstraint(c: CitySiteConditions): EaGoverning {
  const a = eaAltitudeDeratePercent(c.elevationM);
  const t = c.p95MaxC == null ? 0 : eaTemperatureDeratePercent(c.p95MaxC);
  if (a < 1 && t < 1) return 'neither';
  if (a >= 1 && t >= 1 && Math.abs(a - t) < Math.max(a, t) * 0.4) return 'both';
  return a >= t ? 'altitude' : 'temperature';
}

export function eaAltitudeBand(elevationM: number): string {
  if (elevationM < 200) return 'coastal';
  if (elevationM < 800) return 'lowland';
  if (elevationM < 1500) return 'plateau';
  if (elevationM < 2200) return 'highland';
  return 'high-highland';
}

export function getCityConditions(slug: string): CitySiteConditions | undefined {
  return EA_CITY_CONDITIONS[slug];
}

/** How many cities in the same country sit lower than this one. */
export function eaAltitudeRankInCountry(c: CitySiteConditions): { rank: number; of: number } {
  const peers = Object.values(EA_CITY_CONDITIONS).filter((x) => x.country === c.country);
  const sorted = [...peers].sort((a, b) => a.elevationM - b.elevationM);
  return { rank: sorted.findIndex((x) => x.slug === c.slug) + 1, of: sorted.length };
}

/**
 * Our operating base. Distance and bearing from here are real, per-city facts
 * that bear directly on response time and mobilisation cost, and they differ
 * for every city — which is exactly what a templated page lacks.
 */
export const EA_HQ = { name: 'Embakasi, Nairobi', lat: -1.3184, lon: 36.9203 } as const;

export function eaDistanceFromHqKm(c: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(c.lat - EA_HQ.lat);
  const dLon = toRad(c.lon - EA_HQ.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(EA_HQ.lat)) * Math.cos(toRad(c.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

export function eaBearingFromHq(c: { lat: number; lon: number }): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(c.lon - EA_HQ.lon)) * Math.cos(toRad(c.lat));
  const x =
    Math.cos(toRad(EA_HQ.lat)) * Math.sin(toRad(c.lat)) -
    Math.sin(toRad(EA_HQ.lat)) * Math.cos(toRad(c.lat)) * Math.cos(toRad(c.lon - EA_HQ.lon));
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  const dirs = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  return dirs[Math.round(((deg + 360) % 360) / 45) % 8];
}

/** Mean daily swing. Drives condensation, battery life and thermal cycling. */
export function eaDiurnalRangeC(c: CitySiteConditions): number | null {
  if (c.meanMaxC == null || c.meanMinC == null) return null;
  return Math.round((c.meanMaxC - c.meanMinC) * 10) / 10;
}
