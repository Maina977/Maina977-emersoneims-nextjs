/**
 * KENYA CONSTITUENCY SITE CONDITIONS — sourced, verified, and DELIBERATELY
 * INCOMPLETE.
 *
 * WHY ONLY SOME CONSTITUENCIES ARE HERE
 * 289 constituencies were attempted; 119 could be confirmed. The rest are
 * absent on purpose. Many Kenyan constituencies are directional divisions —
 * "Kajiado North", "Igembe South", "Tigania West" — and no populated place
 * carries that name. The tempting shortcut is to strip the direction and use
 * the county town's figures, which would have produced full coverage. It would
 * also have been false: it asserts Kajiado town's altitude for Kajiado North,
 * and it gives all five Kajiado constituencies identical data, which is the
 * exact duplication this work exists to remove.
 *
 * So a constituency with no confirmed record renders NOTHING and keeps
 * consolidating to its county+service page. Partial honest coverage beats
 * complete fabricated coverage.
 *
 * VERIFICATION was stricter here than for counties, because a constituency
 * name collides far more easily: the candidate had to be in Kenya
 * (country_code KE), had to be a populated place, and its GeoNames admin1 had
 * to match the expected county. Anything that failed was recorded unresolved
 * rather than guessed.
 *
 * PROVENANCE
 *   Elevation & coordinates: GeoNames via the Open-Meteo Geocoding API
 *     (CC BY 4.0), retrieved 2026-08-08.
 *   Temperature: Open-Meteo ERA5 reanalysis (CC BY 4.0), retrieved 2026-08-08 —
 *     full-year 2025 daily maxima at the SAME verified coordinates.
 *
 * `place` is the GeoNames settlement the figures actually describe, and it is
 * shown on the page. It is frequently not identical to the constituency name,
 * and pretending otherwise would misstate what was measured.
 */

export interface ConstituencyConditions {
  readonly county: string;
  readonly slug: string;
  /** Constituency name as held in kenya-locations.ts. */
  readonly name: string;
  /** The GeoNames settlement these figures describe. */
  readonly place: string;
  readonly elevationM: number;
  readonly lat: number;
  readonly lon: number;
  readonly meanMaxC: number;
  readonly p95MaxC: number;
  readonly absMaxC: number;
  readonly geonamesAdmin1: string;
}

export const CONSTITUENCY_CONDITIONS: Readonly<Record<string, ConstituencyConditions>> = {
  'baringo/eldama-ravine': { county: 'baringo', slug: 'eldama-ravine', name: "Eldama Ravine", place: "Eldama Ravine", elevationM: 2142, lat: 0.05196, lon: 35.72734, meanMaxC: 22.9, p95MaxC: 25.8, absMaxC: 27.6, geonamesAdmin1: "Baringo" },
  'baringo/mogotio': { county: 'baringo', slug: 'mogotio', name: "Mogotio", place: "Mogotio", elevationM: 1582, lat: -0.02236, lon: 35.96124, meanMaxC: 27.5, p95MaxC: 31.5, absMaxC: 33.6, geonamesAdmin1: "Baringo" },
  'bomet/sotik': { county: 'bomet', slug: 'sotik', name: "Sotik", place: "Bomet", elevationM: 1959, lat: -0.78129, lon: 35.34156, meanMaxC: 24, p95MaxC: 27.7, absMaxC: 29.2, geonamesAdmin1: "Bomet County" },
  'bungoma/kabuchai': { county: 'bungoma', slug: 'kabuchai', name: "Kabuchai", place: "Kabuchai", elevationM: 1580, lat: 0.65011, lon: 34.56261, meanMaxC: 26.8, p95MaxC: 32.9, absMaxC: 35.3, geonamesAdmin1: "Bungoma County" },
  'bungoma/kanduyi': { county: 'bungoma', slug: 'kanduyi', name: "Kanduyi", place: "Kanduyi", elevationM: 1449, lat: 0.59344, lon: 34.55263, meanMaxC: 26.9, p95MaxC: 32.9, absMaxC: 35, geonamesAdmin1: "Bungoma County" },
  'bungoma/kimilili': { county: 'bungoma', slug: 'kimilili', name: "Kimilili", place: "Kimilili", elevationM: 1697, lat: 0.78775, lon: 34.71562, meanMaxC: 25.4, p95MaxC: 31.2, absMaxC: 33.7, geonamesAdmin1: "Bungoma County" },
  'bungoma/sirisia': { county: 'bungoma', slug: 'sirisia', name: "Sirisia", place: "Sirisia", elevationM: 1535, lat: 0.75471, lon: 34.50351, meanMaxC: 26.1, p95MaxC: 30.9, absMaxC: 34.4, geonamesAdmin1: "Bungoma County" },
  'busia/butula': { county: 'busia', slug: 'butula', name: "Butula", place: "Butula", elevationM: 1305, lat: 0.33796, lon: 34.3355, meanMaxC: 28, p95MaxC: 33.5, absMaxC: 35.7, geonamesAdmin1: "Busia County" },
  'busia/funyula': { county: 'busia', slug: 'funyula', name: "Funyula", place: "Funyula", elevationM: 1251, lat: 0.27878, lon: 34.11869, meanMaxC: 27.8, p95MaxC: 32.8, absMaxC: 35.8, geonamesAdmin1: "Busia County" },
  'busia/matayos': { county: 'busia', slug: 'matayos', name: "Matayos", place: "Matayos", elevationM: 1218, lat: 0.35958, lon: 34.17005, meanMaxC: 28.1, p95MaxC: 33.5, absMaxC: 36, geonamesAdmin1: "Busia County" },
  'embu/manyatta': { county: 'embu', slug: 'manyatta', name: "Manyatta", place: "Manyata", elevationM: 1711, lat: -0.43146, lon: 37.47795, meanMaxC: 21.4, p95MaxC: 24.2, absMaxC: 26.9, geonamesAdmin1: "Embu County" },
  'embu/runyenjes': { county: 'embu', slug: 'runyenjes', name: "Runyenjes", place: "Runyenjes", elevationM: 1505, lat: -0.42304, lon: 37.57043, meanMaxC: 22.5, p95MaxC: 25.4, absMaxC: 27.8, geonamesAdmin1: "Embu County" },
  'garissa/dadaab': { county: 'garissa', slug: 'dadaab', name: "Dadaab", place: "Dadaab", elevationM: 125, lat: 0.05244, lon: 40.30855, meanMaxC: 34.9, p95MaxC: 37.7, absMaxC: 39.5, geonamesAdmin1: "Garissa County" },
  'garissa/ijara': { county: 'garissa', slug: 'ijara', name: "Ijara", place: "Ijara", elevationM: 63, lat: -1.59517, lon: 40.51444, meanMaxC: 34.1, p95MaxC: 38.5, absMaxC: 40.5, geonamesAdmin1: "Garissa County" },
  'homa-bay/ndhiwa': { county: 'homa-bay', slug: 'ndhiwa', name: "Ndhiwa", place: "Ndhiwa", elevationM: 1312, lat: -0.73148, lon: 34.36785, meanMaxC: 27.4, p95MaxC: 32.4, absMaxC: 35.1, geonamesAdmin1: "Homa Bay County" },
  'homa-bay/rangwe': { county: 'homa-bay', slug: 'rangwe', name: "Rangwe", place: "Rangwe", elevationM: 1341, lat: -0.60032, lon: 34.58353, meanMaxC: 27.9, p95MaxC: 33.3, absMaxC: 35.5, geonamesAdmin1: "Homa Bay County" },
  'kakamega/butere': { county: 'kakamega', slug: 'butere', name: "Butere", place: "Butere", elevationM: 1380, lat: 0.20694, lon: 34.49006, meanMaxC: 28.2, p95MaxC: 34.5, absMaxC: 36.2, geonamesAdmin1: "Kakamega County" },
  'kakamega/khwisero': { county: 'kakamega', slug: 'khwisero', name: "Khwisero", place: "Khwisero", elevationM: 1498, lat: 0.17124, lon: 34.59466, meanMaxC: 27.1, p95MaxC: 32.4, absMaxC: 34.6, geonamesAdmin1: "Kakamega County" },
  'kakamega/lugari': { county: 'kakamega', slug: 'lugari', name: "Lugari", place: "Lugari", elevationM: 1595, lat: 0.65071, lon: 34.87673, meanMaxC: 26.3, p95MaxC: 30.9, absMaxC: 33.1, geonamesAdmin1: "Kakamega County" },
  'kakamega/lurambi': { county: 'kakamega', slug: 'lurambi', name: "Lurambi", place: "Lurambi", elevationM: 1546, lat: 0.2998, lon: 34.76485, meanMaxC: 27.3, p95MaxC: 32.5, absMaxC: 34.6, geonamesAdmin1: "Kakamega County" },
  'kakamega/malava': { county: 'kakamega', slug: 'malava', name: "Malava", place: "Malava", elevationM: 1640, lat: 0.44714, lon: 34.85387, meanMaxC: 25.5, p95MaxC: 29.7, absMaxC: 32.7, geonamesAdmin1: "Kakamega County" },
  'kakamega/matungu': { county: 'kakamega', slug: 'matungu', name: "Matungu", place: "Matungu", elevationM: 1327, lat: 0.39048, lon: 34.46921, meanMaxC: 28.5, p95MaxC: 34.7, absMaxC: 36.6, geonamesAdmin1: "Kakamega County" },
  'kakamega/navakholo': { county: 'kakamega', slug: 'navakholo', name: "Navakholo", place: "Navakholo", elevationM: 1519, lat: 0.41403, lon: 34.68217, meanMaxC: 27.5, p95MaxC: 33.1, absMaxC: 35.5, geonamesAdmin1: "Kakamega County" },
  'kakamega/shinyalu': { county: 'kakamega', slug: 'shinyalu', name: "Shinyalu", place: "Shinyalu", elevationM: 1600, lat: 0.22396, lon: 34.80807, meanMaxC: 27.2, p95MaxC: 32.4, absMaxC: 34.5, geonamesAdmin1: "Kakamega County" },
  'kericho/ainamoi': { county: 'kericho', slug: 'ainamoi', name: "Ainamoi", place: "Ainamoi", elevationM: 1919, lat: -0.30038, lon: 35.27383, meanMaxC: 22.9, p95MaxC: 27.3, absMaxC: 29.5, geonamesAdmin1: "Kericho County" },
  'kiambu/githunguri': { county: 'kiambu', slug: 'githunguri', name: "Githunguri", place: "Githunguri", elevationM: 1971, lat: -1.05754, lon: 36.77625, meanMaxC: 21.2, p95MaxC: 24.1, absMaxC: 27, geonamesAdmin1: "Kiambu County" },
  'kiambu/juja': { county: 'kiambu', slug: 'juja', name: "Juja", place: "Juja", elevationM: 1521, lat: -1.10148, lon: 37.0132, meanMaxC: 25.8, p95MaxC: 29.1, absMaxC: 30.9, geonamesAdmin1: "Kiambu County" },
  'kiambu/kabete': { county: 'kiambu', slug: 'kabete', name: "Kabete", place: "Kabete", elevationM: 1838, lat: -1.24098, lon: 36.7273, meanMaxC: 23.2, p95MaxC: 26.3, absMaxC: 28.2, geonamesAdmin1: "Kiambu County" },
  'kiambu/kiambaa': { county: 'kiambu', slug: 'kiambaa', name: "Kiambaa", place: "Kiambaa", elevationM: 2095, lat: -1.19929, lon: 36.65659, meanMaxC: 22.6, p95MaxC: 25.6, absMaxC: 27.7, geonamesAdmin1: "Kiambu County" },
  'kiambu/kiambu-town': { county: 'kiambu', slug: 'kiambu-town', name: "Kiambu", place: "Kiambu", elevationM: 1683, lat: -1.17139, lon: 36.83556, meanMaxC: 24.3, p95MaxC: 27.9, absMaxC: 29.5, geonamesAdmin1: "Kiambu County" },
  'kiambu/kikuyu': { county: 'kiambu', slug: 'kikuyu', name: "Kikuyu", place: "Kikuyu", elevationM: 2047, lat: -1.24627, lon: 36.66291, meanMaxC: 22.6, p95MaxC: 25.6, absMaxC: 27.7, geonamesAdmin1: "Kiambu County" },
  'kiambu/lari': { county: 'kiambu', slug: 'lari', name: "Lari", place: "Lari", elevationM: 2369, lat: -1.02538, lon: 36.63087, meanMaxC: 19.3, p95MaxC: 21.9, absMaxC: 23.8, geonamesAdmin1: "Kiambu County" },
  'kiambu/limuru': { county: 'kiambu', slug: 'limuru', name: "Limuru", place: "Limuru", elevationM: 2251, lat: -1.1136, lon: 36.64205, meanMaxC: 20.3, p95MaxC: 23, absMaxC: 25.4, geonamesAdmin1: "Kiambu County" },
  'kiambu/ruiru': { county: 'kiambu', slug: 'ruiru', name: "Ruiru", place: "Ruiru", elevationM: 1531, lat: -1.14665, lon: 36.96087, meanMaxC: 26, p95MaxC: 29.5, absMaxC: 31.1, geonamesAdmin1: "Kiambu County" },
  'kilifi/ganze': { county: 'kilifi', slug: 'ganze', name: "Ganze", place: "Ganze", elevationM: 167, lat: -3.54388, lon: 39.69277, meanMaxC: 31.2, p95MaxC: 34.9, absMaxC: 36.3, geonamesAdmin1: "Kilifi County" },
  'kilifi/kaloleni': { county: 'kilifi', slug: 'kaloleni', name: "Kaloleni", place: "Kaloleni", elevationM: 233, lat: -3.81413, lon: 39.63144, meanMaxC: 29.8, p95MaxC: 33.7, absMaxC: 35.5, geonamesAdmin1: "Kilifi County" },
  'kilifi/magarini': { county: 'kilifi', slug: 'magarini', name: "Magarini", place: "Magarini", elevationM: 129, lat: -3.03681, lon: 40.06946, meanMaxC: 29.9, p95MaxC: 32.6, absMaxC: 34.4, geonamesAdmin1: "Kilifi County" },
  'kilifi/malindi': { county: 'kilifi', slug: 'malindi', name: "Malindi", place: "Malindi", elevationM: 7, lat: -3.21799, lon: 40.11692, meanMaxC: 30.1, p95MaxC: 33, absMaxC: 35, geonamesAdmin1: "Kilifi County" },
  'kilifi/rabai': { county: 'kilifi', slug: 'rabai', name: "Rabai", place: "Rabai", elevationM: 195, lat: -3.93168, lon: 39.57041, meanMaxC: 30.6, p95MaxC: 35.1, absMaxC: 36.6, geonamesAdmin1: "Kilifi County" },
  'kisumu/kisumu-east': { county: 'kisumu', slug: 'kisumu-east', name: "Kisumu East", place: "Kisumu East", elevationM: 1293, lat: -0.0589, lon: 34.71032, meanMaxC: 27, p95MaxC: 31.5, absMaxC: 33.8, geonamesAdmin1: "Kisumu County" },
  'kisumu/muhoroni': { county: 'kisumu', slug: 'muhoroni', name: "Muhoroni", place: "Muhoroni", elevationM: 1290, lat: -0.15816, lon: 35.19645, meanMaxC: 29.4, p95MaxC: 35.2, absMaxC: 37.4, geonamesAdmin1: "Kisumu County" },
  'kwale/kinango': { county: 'kwale', slug: 'kinango', name: "Kinango", place: "Kinango", elevationM: 206, lat: -4.13723, lon: 39.31528, meanMaxC: 30.5, p95MaxC: 34.9, absMaxC: 37, geonamesAdmin1: "Kwale County" },
  'kwale/matuga': { county: 'kwale', slug: 'matuga', name: "Matuga", place: "Matuga", elevationM: 132, lat: -4.168, lon: 39.57068, meanMaxC: 29.3, p95MaxC: 32.1, absMaxC: 35, geonamesAdmin1: "Kwale County" },
  'kwale/msambweni': { county: 'kwale', slug: 'msambweni', name: "Msambweni", place: "Msambweni", elevationM: 19, lat: -4.4619, lon: 39.48265, meanMaxC: 29.5, p95MaxC: 33, absMaxC: 35.6, geonamesAdmin1: "Kwale County" },
  'machakos/kangundo': { county: 'machakos', slug: 'kangundo', name: "Kangundo", place: "Kangundo", elevationM: 1608, lat: -1.30342, lon: 37.34813, meanMaxC: 24.9, p95MaxC: 28.1, absMaxC: 30.3, geonamesAdmin1: "Machakos County" },
  'machakos/masinga': { county: 'machakos', slug: 'masinga', name: "Masinga", place: "Masinga", elevationM: 1147, lat: -0.97521, lon: 37.60448, meanMaxC: 28.1, p95MaxC: 31.1, absMaxC: 32.7, geonamesAdmin1: "Machakos County" },
  'machakos/matungulu': { county: 'machakos', slug: 'matungulu', name: "Matungulu", place: "Matungulu", elevationM: 1518, lat: -1.2324, lon: 37.33157, meanMaxC: 25.2, p95MaxC: 28.5, absMaxC: 30.4, geonamesAdmin1: "Machakos County" },
  'machakos/mwala': { county: 'machakos', slug: 'mwala', name: "Mwala", place: "Mwala", elevationM: 1256, lat: -1.35255, lon: 37.45482, meanMaxC: 26.4, p95MaxC: 29.5, absMaxC: 31.6, geonamesAdmin1: "Machakos County" },
  'machakos/yatta': { county: 'machakos', slug: 'yatta', name: "Yatta", place: "Yatta", elevationM: 1315, lat: -1.11816, lon: 37.3839, meanMaxC: 26.8, p95MaxC: 30.1, absMaxC: 32.1, geonamesAdmin1: "Machakos County" },
  'makueni/kilome': { county: 'makueni', slug: 'kilome', name: "Kilome", place: "Kilome", elevationM: 1969, lat: -1.80934, lon: 37.34742, meanMaxC: 21.8, p95MaxC: 24.8, absMaxC: 27.3, geonamesAdmin1: "Makueni County" },
  'makueni/makueni-const': { county: 'makueni', slug: 'makueni-const', name: "Makueni", place: "Makueni Boma", elevationM: 1207, lat: -1.80388, lon: 37.62405, meanMaxC: 27.5, p95MaxC: 30.4, absMaxC: 32.7, geonamesAdmin1: "Makueni County" },
  'makueni/mbooni': { county: 'makueni', slug: 'mbooni', name: "Mbooni", place: "Mbooni", elevationM: 1902, lat: -1.66079, lon: 37.45415, meanMaxC: 22.3, p95MaxC: 25.5, absMaxC: 28.1, geonamesAdmin1: "Makueni County" },
  'mandera/banissa': { county: 'mandera', slug: 'banissa', name: "Banissa", place: "Banissa", elevationM: 935, lat: 3.94102, lon: 40.34248, meanMaxC: 29.2, p95MaxC: 33.1, absMaxC: 34.4, geonamesAdmin1: "Mandera County" },
  'mandera/lafey': { county: 'mandera', slug: 'lafey', name: "Lafey", place: "Lafey", elevationM: 418, lat: 3.15106, lon: 41.18577, meanMaxC: 33.2, p95MaxC: 36.7, absMaxC: 38.6, geonamesAdmin1: "Mandera County" },
  'marsabit/laisamis': { county: 'marsabit', slug: 'laisamis', name: "Laisamis", place: "Laisamis", elevationM: 575, lat: 1.5932, lon: 37.80595, meanMaxC: 34.2, p95MaxC: 36.6, absMaxC: 37.6, geonamesAdmin1: "Marsabit County" },
  'marsabit/moyale': { county: 'marsabit', slug: 'moyale', name: "Moyale", place: "Moyale", elevationM: 1068, lat: 3.52661, lon: 39.0561, meanMaxC: 27.9, p95MaxC: 33.1, absMaxC: 34.4, geonamesAdmin1: "Marsabit County" },
  'marsabit/north-horr': { county: 'marsabit', slug: 'north-horr', name: "North Horr", place: "North Horr", elevationM: 382, lat: 3.32205, lon: 37.07032, meanMaxC: 36.2, p95MaxC: 39, absMaxC: 40.3, geonamesAdmin1: "Marsabit County" },
  'migori/awendo': { county: 'migori', slug: 'awendo', name: "Awendo", place: "Awendo", elevationM: 1437, lat: -0.90711, lon: 34.52895, meanMaxC: 27.9, p95MaxC: 33.5, absMaxC: 35.2, geonamesAdmin1: "Migori County" },
  'migori/rongo': { county: 'migori', slug: 'rongo', name: "Rongo", place: "Rongo", elevationM: 1474, lat: -0.75675, lon: 34.59833, meanMaxC: 27.4, p95MaxC: 33.3, absMaxC: 35.7, geonamesAdmin1: "Migori County" },
  'migori/uriri': { county: 'migori', slug: 'uriri', name: "Uriri", place: "Uriri", elevationM: 1523, lat: -0.95543, lon: 34.5119, meanMaxC: 27.7, p95MaxC: 32.9, absMaxC: 34.8, geonamesAdmin1: "Migori County" },
  'mombasa/changamwe': { county: 'mombasa', slug: 'changamwe', name: "Changamwe", place: "Changamwe", elevationM: 56, lat: -4.01659, lon: 39.62893, meanMaxC: 30.3, p95MaxC: 33.7, absMaxC: 35.5, geonamesAdmin1: "Mombasa County" },
  'mombasa/jomvu': { county: 'mombasa', slug: 'jomvu', name: "Jomvu", place: "Jomvu", elevationM: 21, lat: -3.98623, lon: 39.6082, meanMaxC: 30.8, p95MaxC: 34.8, absMaxC: 36.5, geonamesAdmin1: "Mombasa County" },
  'mombasa/kisauni': { county: 'mombasa', slug: 'kisauni', name: "Kisauni", place: "Kisauni", elevationM: 22, lat: -4.03287, lon: 39.68574, meanMaxC: 29.2, p95MaxC: 32.3, absMaxC: 34.6, geonamesAdmin1: "Mombasa County" },
  'mombasa/likoni': { county: 'mombasa', slug: 'likoni', name: "Likoni", place: "Likoni", elevationM: 19, lat: -4.08394, lon: 39.66161, meanMaxC: 29.8, p95MaxC: 32.5, absMaxC: 35.4, geonamesAdmin1: "Mombasa County" },
  'mombasa/mvita': { county: 'mombasa', slug: 'mvita', name: "Mvita", place: "Old Mombasa", elevationM: 22, lat: -4.05053, lon: 39.6649, meanMaxC: 29.2, p95MaxC: 32.3, absMaxC: 34.6, geonamesAdmin1: "Mombasa County" },
  'muranga/gatanga': { county: 'muranga', slug: 'gatanga', name: "Gatanga", place: "Gatanga", elevationM: 1672, lat: -0.93968, lon: 36.96667, meanMaxC: 23.9, p95MaxC: 27.4, absMaxC: 29.4, geonamesAdmin1: "Murang'A" },
  'muranga/kandara': { county: 'muranga', slug: 'kandara', name: "Kandara", place: "Kandara", elevationM: 1669, lat: -0.89715, lon: 37.00279, meanMaxC: 23.3, p95MaxC: 26.8, absMaxC: 29.3, geonamesAdmin1: "Murang'A" },
  'muranga/kangema': { county: 'muranga', slug: 'kangema', name: "Kangema", place: "Kangema", elevationM: 1810, lat: -0.68553, lon: 36.96463, meanMaxC: 21.9, p95MaxC: 25.2, absMaxC: 27.3, geonamesAdmin1: "Murang'A" },
  'muranga/kigumo': { county: 'muranga', slug: 'kigumo', name: "Kigumo", place: "Kigumo", elevationM: 1916, lat: -0.8021, lon: 36.92525, meanMaxC: 21.5, p95MaxC: 24.7, absMaxC: 27, geonamesAdmin1: "Murang'A" },
  'muranga/kiharu': { county: 'muranga', slug: 'kiharu', name: "Kiharu", place: "Kiharu", elevationM: 1288, lat: -0.71954, lon: 37.13987, meanMaxC: 26.3, p95MaxC: 30.6, absMaxC: 33.1, geonamesAdmin1: "Murang'A" },
  'nairobi/kamukunji': { county: 'nairobi', slug: 'kamukunji', name: "Kamukunji", place: "Kamukunji", elevationM: 1713, lat: -1.28714, lon: 36.83868, meanMaxC: 25.5, p95MaxC: 29.3, absMaxC: 31.3, geonamesAdmin1: "Nairobi County" },
  'nairobi/kasarani': { county: 'nairobi', slug: 'kasarani', name: "Kasarani", place: "Kasarani", elevationM: 1600, lat: -1.21743, lon: 36.89759, meanMaxC: 25.4, p95MaxC: 29.2, absMaxC: 31, geonamesAdmin1: "Nairobi County" },
  'nairobi/makadara': { county: 'nairobi', slug: 'makadara', name: "Makadara", place: "Makadara", elevationM: 1686, lat: -1.29557, lon: 36.87186, meanMaxC: 25.9, p95MaxC: 29.8, absMaxC: 31.6, geonamesAdmin1: "Nairobi County" },
  'nairobi/mathare': { county: 'nairobi', slug: 'mathare', name: "Mathare", place: "Mathare North", elevationM: 1614, lat: -1.25412, lon: 36.86682, meanMaxC: 25.4, p95MaxC: 29.2, absMaxC: 31, geonamesAdmin1: "Nairobi County" },
  'nairobi/roysambu': { county: 'nairobi', slug: 'roysambu', name: "Roysambu", place: "Roysambu", elevationM: 1615, lat: -1.21411, lon: 36.88335, meanMaxC: 25.4, p95MaxC: 29.2, absMaxC: 31, geonamesAdmin1: "Nairobi County" },
  'nairobi/ruaraka': { county: 'nairobi', slug: 'ruaraka', name: "Ruaraka", place: "Ruaraka Estate", elevationM: 1652, lat: -1.24383, lon: 36.8808, meanMaxC: 25.4, p95MaxC: 29.2, absMaxC: 31, geonamesAdmin1: "Nairobi County" },
  'nairobi/starehe': { county: 'nairobi', slug: 'starehe', name: "Starehe", place: "Starehe", elevationM: 1654, lat: -1.28119, lon: 36.84165, meanMaxC: 25.5, p95MaxC: 29.3, absMaxC: 31.3, geonamesAdmin1: "Nairobi County" },
  'nairobi/westlands': { county: 'nairobi', slug: 'westlands', name: "Westlands", place: "Westlands", elevationM: 1730, lat: -1.26683, lon: 36.80806, meanMaxC: 25.5, p95MaxC: 29.3, absMaxC: 31.3, geonamesAdmin1: "Nairobi County" },
  'nakuru/bahati': { county: 'nakuru', slug: 'bahati', name: "Bahati", place: "Bahati", elevationM: 2061, lat: -0.15407, lon: 36.14634, meanMaxC: 22.8, p95MaxC: 26.5, absMaxC: 28.5, geonamesAdmin1: "Nakuru County" },
  'nakuru/gilgil': { county: 'nakuru', slug: 'gilgil', name: "Gilgil", place: "Gilgil", elevationM: 2009, lat: -0.50397, lon: 36.31845, meanMaxC: 23.8, p95MaxC: 27.8, absMaxC: 29.9, geonamesAdmin1: "Nakuru County" },
  'nakuru/molo': { county: 'nakuru', slug: 'molo', name: "Molo", place: "Molo", elevationM: 2451, lat: -0.24849, lon: 35.73194, meanMaxC: 20.5, p95MaxC: 23.8, absMaxC: 25.9, geonamesAdmin1: "Nakuru County" },
  'nakuru/naivasha': { county: 'nakuru', slug: 'naivasha', name: "Naivasha", place: "Naivasha", elevationM: 1902, lat: -0.71383, lon: 36.43261, meanMaxC: 24.2, p95MaxC: 28.1, absMaxC: 30.6, geonamesAdmin1: "Nakuru County" },
  'nakuru/njoro': { county: 'nakuru', slug: 'njoro', name: "Njoro", place: "Njoro", elevationM: 2169, lat: -0.33024, lon: 35.94445, meanMaxC: 22.5, p95MaxC: 26.1, absMaxC: 28.5, geonamesAdmin1: "Nakuru County" },
  'nakuru/rongai': { county: 'nakuru', slug: 'rongai', name: "Rongai", place: "Rongai", elevationM: 1875, lat: -0.17344, lon: 35.86313, meanMaxC: 25.5, p95MaxC: 29.3, absMaxC: 30.9, geonamesAdmin1: "Nakuru County" },
  'nakuru/subukia': { county: 'nakuru', slug: 'subukia', name: "Subukia", place: "Subukia", elevationM: 2316, lat: -0.01644, lon: 36.20927, meanMaxC: 21.4, p95MaxC: 24.5, absMaxC: 27.2, geonamesAdmin1: "Nakuru County" },
  'nandi/nandi-hills': { county: 'nandi', slug: 'nandi-hills', name: "Nandi Hills", place: "Nandi Hills", elevationM: 2028, lat: 0.10366, lon: 35.18426, meanMaxC: 22.1, p95MaxC: 25.5, absMaxC: 27.9, geonamesAdmin1: "Nandi" },
  'narok/kilgoris': { county: 'narok', slug: 'kilgoris', name: "Kilgoris", place: "Kilgoris", elevationM: 1772, lat: -1.00819, lon: 34.87809, meanMaxC: 25.5, p95MaxC: 30.1, absMaxC: 31.8, geonamesAdmin1: "Narok County" },
  'nyandarua/kipipiri': { county: 'nyandarua', slug: 'kipipiri', name: "Kipipiri", place: "Kipipiri", elevationM: 2474, lat: -0.44921, lon: 36.49826, meanMaxC: 20, p95MaxC: 23.8, absMaxC: 25.8, geonamesAdmin1: "Nyandarua County" },
  'nyandarua/ndaragwa': { county: 'nyandarua', slug: 'ndaragwa', name: "Ndaragwa", place: "Ndaragwa", elevationM: 2322, lat: -0.0636, lon: 36.52432, meanMaxC: 22.6, p95MaxC: 25.5, absMaxC: 27.6, geonamesAdmin1: "Nyandarua County" },
  'nyandarua/ol-kalou': { county: 'nyandarua', slug: 'ol-kalou', name: "Ol Kalou", place: "Ol Kalou", elevationM: 2348, lat: -0.27088, lon: 36.37917, meanMaxC: 20.8, p95MaxC: 23.7, absMaxC: 26.2, geonamesAdmin1: "Nyandarua County" },
  'nyeri/mukurweini': { county: 'nyeri', slug: 'mukurweini', name: "Mukurweini", place: "Mukuruweini", elevationM: 1747, lat: -0.56115, lon: 37.04474, meanMaxC: 22.5, p95MaxC: 25.9, absMaxC: 28.6, geonamesAdmin1: "Nyeri County" },
  'nyeri/othaya': { county: 'nyeri', slug: 'othaya', name: "Othaya", place: "Othaya", elevationM: 1873, lat: -0.54655, lon: 36.93178, meanMaxC: 21.7, p95MaxC: 24.9, absMaxC: 27.1, geonamesAdmin1: "Nyeri County" },
  'nyeri/tetu': { county: 'nyeri', slug: 'tetu', name: "Tetu", place: "Tetu", elevationM: 1937, lat: -0.43419, lon: 36.91681, meanMaxC: 21.4, p95MaxC: 24.9, absMaxC: 26.8, geonamesAdmin1: "Nyeri County" },
  'siaya/bondo': { county: 'siaya', slug: 'bondo', name: "Bondo", place: "Bondo", elevationM: 1272, lat: -0.0962, lon: 34.27322, meanMaxC: 27.8, p95MaxC: 32, absMaxC: 35.3, geonamesAdmin1: "Siaya County" },
  'siaya/rarieda': { county: 'siaya', slug: 'rarieda', name: "Rarieda", place: "Rarieda", elevationM: 1146, lat: -0.20172, lon: 34.3386, meanMaxC: 28.1, p95MaxC: 32, absMaxC: 35.1, geonamesAdmin1: "Siaya County" },
  'taita-taveta/mwatate': { county: 'taita-taveta', slug: 'mwatate', name: "Mwatate", place: "Mwatate", elevationM: 860, lat: -3.505, lon: 38.37722, meanMaxC: 28.6, p95MaxC: 31.7, absMaxC: 33.6, geonamesAdmin1: "Taita Taveta" },
  'taita-taveta/taveta': { county: 'taita-taveta', slug: 'taveta', name: "Taveta", place: "Taveta", elevationM: 753, lat: -3.39879, lon: 37.68336, meanMaxC: 30.9, p95MaxC: 35.1, absMaxC: 37.1, geonamesAdmin1: "Taita Taveta" },
  'taita-taveta/voi': { county: 'taita-taveta', slug: 'voi', name: "Voi", place: "Voi", elevationM: 580, lat: -3.39605, lon: 38.55609, meanMaxC: 31.5, p95MaxC: 34.9, absMaxC: 36.8, geonamesAdmin1: "Taita Taveta" },
  'taita-taveta/wundanyi': { county: 'taita-taveta', slug: 'wundanyi', name: "Wundanyi", place: "Wundanyi", elevationM: 1472, lat: -3.39642, lon: 38.35729, meanMaxC: 24, p95MaxC: 26.6, absMaxC: 29, geonamesAdmin1: "Taita Taveta" },
  'tana-river/galole': { county: 'tana-river', slug: 'galole', name: "Galole", place: "Hola", elevationM: 65, lat: -1.48256, lon: 40.03341, meanMaxC: 34.8, p95MaxC: 38.4, absMaxC: 40.5, geonamesAdmin1: "Tana River County" },
  'tana-river/garsen': { county: 'tana-river', slug: 'garsen', name: "Garsen", place: "Garsen", elevationM: 15, lat: -2.26645, lon: 40.10975, meanMaxC: 33.6, p95MaxC: 38.3, absMaxC: 41, geonamesAdmin1: "Tana River County" },
  'tharaka-nithi/tharaka': { county: 'tharaka-nithi', slug: 'tharaka', name: "Tharaka", place: "Tharaka", elevationM: 577, lat: -0.30861, lon: 38.02691, meanMaxC: 32.9, p95MaxC: 36.1, absMaxC: 37.6, geonamesAdmin1: "Tharaka - Nithi" },
  'trans-nzoia/endebess': { county: 'trans-nzoia', slug: 'endebess', name: "Endebess", place: "Endebess", elevationM: 1879, lat: 1.07959, lon: 34.85651, meanMaxC: 24.5, p95MaxC: 29.1, absMaxC: 30.9, geonamesAdmin1: "Trans Nzoia" },
  'trans-nzoia/kiminini': { county: 'trans-nzoia', slug: 'kiminini', name: "Kiminini", place: "Kiminini", elevationM: 1788, lat: 0.89284, lon: 34.92468, meanMaxC: 25.9, p95MaxC: 31.2, absMaxC: 33.5, geonamesAdmin1: "Trans Nzoia" },
  'trans-nzoia/kwanza': { county: 'trans-nzoia', slug: 'kwanza', name: "Kwanza", place: "Kwanza", elevationM: 2023, lat: 1.16837, lon: 34.99256, meanMaxC: 23.6, p95MaxC: 27.8, absMaxC: 29, geonamesAdmin1: "Trans Nzoia" },
  'trans-nzoia/saboti': { county: 'trans-nzoia', slug: 'saboti', name: "Saboti", place: "Saboti", elevationM: 1869, lat: 0.94104, lon: 34.84419, meanMaxC: 24, p95MaxC: 29.2, absMaxC: 31.4, geonamesAdmin1: "Trans Nzoia" },
  'uasin-gishu/kesses': { county: 'uasin-gishu', slug: 'kesses', name: "Kesses", place: "Kesses", elevationM: 2211, lat: 0.30206, lon: 35.31441, meanMaxC: 22.3, p95MaxC: 26, absMaxC: 28.1, geonamesAdmin1: "Uasin Gishu County" },
  'uasin-gishu/moiben': { county: 'uasin-gishu', slug: 'moiben', name: "Moiben", place: "Moiben", elevationM: 2135, lat: 0.81743, lon: 35.38452, meanMaxC: 23.5, p95MaxC: 26.7, absMaxC: 28.5, geonamesAdmin1: "Uasin Gishu County" },
  'uasin-gishu/soy': { county: 'uasin-gishu', slug: 'soy', name: "Soy", place: "Soy", elevationM: 1941, lat: 0.67315, lon: 35.15771, meanMaxC: 24, p95MaxC: 27.7, absMaxC: 29.7, geonamesAdmin1: "Uasin Gishu County" },
  'uasin-gishu/turbo': { county: 'uasin-gishu', slug: 'turbo', name: "Turbo", place: "Turbo", elevationM: 1813, lat: 0.63367, lon: 35.04815, meanMaxC: 24.7, p95MaxC: 28.5, absMaxC: 30.6, geonamesAdmin1: "Uasin Gishu County" },
  'vihiga/emuhaya': { county: 'vihiga', slug: 'emuhaya', name: "Emuhaya", place: "Emuhaya", elevationM: 1567, lat: 0.03691, lon: 34.62694, meanMaxC: 26.6, p95MaxC: 31.2, absMaxC: 33.5, geonamesAdmin1: "Vihiga County" },
  'vihiga/luanda': { county: 'vihiga', slug: 'luanda', name: "Luanda", place: "Luanda", elevationM: 1530, lat: 0.02333, lon: 34.58661, meanMaxC: 26.9, p95MaxC: 31.5, absMaxC: 34.7, geonamesAdmin1: "Vihiga County" },
  'vihiga/sabatia': { county: 'vihiga', slug: 'sabatia', name: "Sabatia", place: "Sabatia", elevationM: 1632, lat: 0.12079, lon: 34.78472, meanMaxC: 25.7, p95MaxC: 30.8, absMaxC: 33, geonamesAdmin1: "Vihiga County" },
  'vihiga/vihiga-const': { county: 'vihiga', slug: 'vihiga-const', name: "Vihiga", place: "Vihiga", elevationM: 1669, lat: 0.03692, lon: 34.7101, meanMaxC: 25.4, p95MaxC: 30, absMaxC: 32.1, geonamesAdmin1: "Vihiga County" },
  'wajir/eldas': { county: 'wajir', slug: 'eldas', name: "Eldas", place: "Eldas", elevationM: 405, lat: 2.49184, lon: 39.56653, meanMaxC: 33.2, p95MaxC: 37.1, absMaxC: 39.5, geonamesAdmin1: "Wajir County" },
  'wajir/tarbaj': { county: 'wajir', slug: 'tarbaj', name: "Tarbaj", place: "Tarbaj", elevationM: 417, lat: 2.2085, lon: 40.11812, meanMaxC: 32.7, p95MaxC: 36.1, absMaxC: 38, geonamesAdmin1: "Wajir County" },
  'west-pokot/kacheliba': { county: 'west-pokot', slug: 'kacheliba', name: "Kacheliba", place: "Kacheliba", elevationM: 1284, lat: 1.4805, lon: 35.01207, meanMaxC: 29.8, p95MaxC: 34.2, absMaxC: 35.6, geonamesAdmin1: "West Pokot County" },
  'west-pokot/kapenguria': { county: 'west-pokot', slug: 'kapenguria', name: "Kapenguria", place: "Kapenguria", elevationM: 2020, lat: 1.23889, lon: 35.11194, meanMaxC: 23, p95MaxC: 26.6, absMaxC: 28.2, geonamesAdmin1: "West Pokot County" },
  'west-pokot/sigor': { county: 'west-pokot', slug: 'sigor', name: "Sigor", place: "Sigor", elevationM: 985, lat: 1.48806, lon: 35.46948, meanMaxC: 32.5, p95MaxC: 36.3, absMaxC: 37.3, geonamesAdmin1: "West Pokot County" },
};

/** Confirmed record for a constituency, or undefined if it could not be verified. */
export function getConstituencyConditions(
  countySlug: string,
  constituencySlug: string
): ConstituencyConditions | undefined {
  return CONSTITUENCY_CONDITIONS[`${countySlug}/${constituencySlug}`];
}

/** True when this constituency has its own sourced data worth indexing on. */
export function hasConstituencyData(countySlug: string, constituencySlug: string): boolean {
  return getConstituencyConditions(countySlug, constituencySlug) !== undefined;
}

/** Every confirmed constituency in a county, ascending by altitude. */
export function countyConstituencyRecords(countySlug: string): ConstituencyConditions[] {
  return Object.values(CONSTITUENCY_CONDITIONS)
    .filter((r) => r.county === countySlug)
    .sort((a, b) => a.elevationM - b.elevationM);
}

/**
 * Where this constituency sits among its own county's confirmed constituencies.
 *
 * This is the differentiator that is unique BY CONSTRUCTION: "the highest of
 * the seven confirmed constituencies in Nakuru" can be true of exactly one
 * page. It is computed from sourced altitudes, so it costs nothing to be
 * honest about, and it gives each page a fact none of its siblings can repeat.
 *
 * Returns null when fewer than two constituencies in the county are confirmed —
 * a ranking of one is not a ranking.
 */
export function altitudeRankInCounty(
  countySlug: string,
  constituencySlug: string
): { rank: number; total: number; spreadM: number } | null {
  const rows = countyConstituencyRecords(countySlug);
  if (rows.length < 2) return null;
  const i = rows.findIndex((r) => r.slug === constituencySlug);
  if (i < 0) return null;
  return {
    // rank 1 = highest, to match how the copy reads.
    rank: rows.length - i,
    total: rows.length,
    spreadM: rows[rows.length - 1].elevationM - rows[0].elevationM,
  };
}
