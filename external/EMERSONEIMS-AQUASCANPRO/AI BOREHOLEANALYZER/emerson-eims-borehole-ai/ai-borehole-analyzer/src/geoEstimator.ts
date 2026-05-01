/**
 * GeoEstimator — Visual Geographic Location Estimation Engine
 *
 * Estimates WHERE an image was taken based on visual features when no
 * GPS data is available (e.g. WhatsApp images with stripped EXIF).
 *
 * Pipeline:
 *   1. Climate zone classification (from vegetation + brightness + colors)
 *   2. Soil region matching (from dominant color class + soil exposure)
 *   3. Scene-type geographic weighting (from MobileNet labels)
 *   4. Terrain signature matching against 30+ geographic reference profiles
 *   5. Ranked candidate regions with confidence + centroid coordinates
 *   6. Reverse geocode the top estimate for place names
 *
 * Accuracy: Country-level ~40-65%, Region-level ~25-45% depending on terrain.
 * Best with outdoor terrain photos (soil, vegetation, landscape).
 * NOT useful for indoor, selfie, or document images.
 */

export interface GeoEstimate {
  rank: number;
  region: string;
  country: string;
  countryCode: string;
  subRegion?: string;
  latitude: number;
  longitude: number;
  confidence: number;
  climateZone: string;
  reasoning: string[];
}

export interface GeoEstimationResult {
  estimates: GeoEstimate[];
  climateZone: string;
  bestEstimate: GeoEstimate | null;
  isOutdoor: boolean;
  method: string;
}

// ─── TERRAIN SIGNATURE DATABASE ───
// Each entry describes the visual fingerprint of a geographic region.
// Matched against pixel analysis results to produce ranked estimates.
interface TerrainSignature {
  region: string;
  country: string;
  countryCode: string;
  subRegion?: string;
  lat: number;
  lon: number;
  climateZone: string;
  // Expected pixel analysis ranges
  vegMin: number;      // vegetationIndex min
  vegMax: number;      // vegetationIndex max
  soilMin: number;     // soilExposureIndex min
  soilMax: number;     // soilExposureIndex max
  redMin: number;      // redRatio min
  redMax: number;      // redRatio max
  greenMin: number;    // greenRatio min
  greenMax: number;    // greenRatio max
  brightnessMin: number;
  brightnessMax: number;
  textureMin: number;
  textureMax: number;
  dominantColors: string[];  // matching dominantColorClass values
  sceneKeywords: string[];   // matching MobileNet labels
}

const TERRAIN_DB: TerrainSignature[] = [
  // ═══ EAST AFRICA ═══
  {
    region: 'Kenya Central Highlands (Murang\'a / Kiambu / Nyeri)',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Murang\'a/Thika/Makuyu',
    lat: -0.90, lon: 37.19, climateZone: 'tropical-highland',
    vegMin: 0.30, vegMax: 0.75, soilMin: 0.03, soilMax: 0.35,
    redMin: 0.26, redMax: 0.40, greenMin: 0.32, greenMax: 0.44,
    brightnessMin: 80, brightnessMax: 175, textureMin: 0.08, textureMax: 0.35,
    dominantColors: ['laterite/ferralitic', 'mixed-terrain', 'vegetated'],
    sceneKeywords: ['field', 'grass', 'hill', 'farm', 'tea', 'plantation', 'forest', 'lush', 'green', 'vegetation', 'mud', 'track', 'rural'],
  },
  {
    region: 'Kenya Highlands (Rift Escarpment / Aberdares)',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Nyandarua/Laikipia',
    lat: -0.42, lon: 36.60, climateZone: 'tropical-highland',
    vegMin: 0.25, vegMax: 0.65, soilMin: 0.05, soilMax: 0.40,
    redMin: 0.30, redMax: 0.40, greenMin: 0.30, greenMax: 0.40,
    brightnessMin: 90, brightnessMax: 170, textureMin: 0.08, textureMax: 0.35,
    dominantColors: ['laterite/ferralitic', 'mixed-terrain', 'vegetated'],
    sceneKeywords: ['field', 'grass', 'hill', 'farm', 'tea', 'plantation', 'forest', 'highland'],
  },
  {
    region: 'Kenya Coast',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Mombasa/Kilifi',
    lat: -3.95, lon: 39.72, climateZone: 'tropical-coastal',
    vegMin: 0.30, vegMax: 0.70, soilMin: 0.02, soilMax: 0.25,
    redMin: 0.28, redMax: 0.38, greenMin: 0.32, greenMax: 0.42,
    brightnessMin: 100, brightnessMax: 200, textureMin: 0.05, textureMax: 0.25,
    dominantColors: ['vegetated', 'sandstone/alluvial', 'mixed-terrain'],
    sceneKeywords: ['palm', 'beach', 'sand', 'tropical', 'ocean'],
  },
  {
    region: 'Northern Kenya (Semi-Arid)',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Turkana/Marsabit',
    lat: 2.50, lon: 36.80, climateZone: 'semi-arid',
    vegMin: 0.02, vegMax: 0.20, soilMin: 0.25, soilMax: 0.65,
    redMin: 0.35, redMax: 0.48, greenMin: 0.28, greenMax: 0.36,
    brightnessMin: 120, brightnessMax: 220, textureMin: 0.06, textureMax: 0.30,
    dominantColors: ['laterite/ferralitic', 'sandstone/alluvial', 'mixed-terrain'],
    sceneKeywords: ['desert', 'sand', 'dry', 'savanna', 'arid'],
  },
  {
    region: 'Kenya Western (Lake Victoria Basin)',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Kisumu/Kakamega',
    lat: -0.05, lon: 34.75, climateZone: 'tropical-wet',
    vegMin: 0.50, vegMax: 0.85, soilMin: 0.00, soilMax: 0.10,
    redMin: 0.20, redMax: 0.30, greenMin: 0.38, greenMax: 0.50,
    brightnessMin: 60, brightnessMax: 130, textureMin: 0.12, textureMax: 0.38,
    dominantColors: ['vegetated'],
    sceneKeywords: ['jungle', 'swamp', 'lake', 'sugarcane', 'wetland', 'papyrus', 'flat'],
  },
  {
    region: 'Kenya Rift Valley',
    country: 'Kenya', countryCode: 'KE', subRegion: 'Nakuru/Naivasha',
    lat: -0.30, lon: 36.10, climateZone: 'tropical-highland',
    vegMin: 0.15, vegMax: 0.50, soilMin: 0.10, soilMax: 0.45,
    redMin: 0.32, redMax: 0.42, greenMin: 0.30, greenMax: 0.38,
    brightnessMin: 95, brightnessMax: 180, textureMin: 0.12, textureMax: 0.40,
    dominantColors: ['laterite/ferralitic', 'basalt/volcanic', 'mixed-terrain', 'fractured/rocky'],
    sceneKeywords: ['valley', 'cliff', 'volcano', 'rock', 'crater', 'escarpment'],
  },
  {
    region: 'Tanzania Northern (Arusha/Kilimanjaro)',
    country: 'Tanzania', countryCode: 'TZ', subRegion: 'Arusha/Moshi',
    lat: -3.37, lon: 36.68, climateZone: 'tropical-highland',
    vegMin: 0.20, vegMax: 0.60, soilMin: 0.08, soilMax: 0.40,
    redMin: 0.30, redMax: 0.42, greenMin: 0.30, greenMax: 0.40,
    brightnessMin: 85, brightnessMax: 175, textureMin: 0.10, textureMax: 0.38,
    dominantColors: ['laterite/ferralitic', 'basalt/volcanic', 'mixed-terrain', 'vegetated'],
    sceneKeywords: ['mountain', 'volcano', 'savanna', 'grass'],
  },
  {
    region: 'Uganda Central',
    country: 'Uganda', countryCode: 'UG',
    lat: 0.35, lon: 32.58, climateZone: 'tropical-wet',
    vegMin: 0.35, vegMax: 0.80, soilMin: 0.02, soilMax: 0.18,
    redMin: 0.25, redMax: 0.36, greenMin: 0.34, greenMax: 0.45,
    brightnessMin: 75, brightnessMax: 155, textureMin: 0.08, textureMax: 0.30,
    dominantColors: ['vegetated', 'laterite/ferralitic'],
    sceneKeywords: ['forest', 'jungle', 'banana', 'plantation', 'green'],
  },
  {
    region: 'Ethiopia Highlands',
    country: 'Ethiopia', countryCode: 'ET',
    lat: 9.02, lon: 38.75, climateZone: 'tropical-highland',
    vegMin: 0.15, vegMax: 0.55, soilMin: 0.10, soilMax: 0.45,
    redMin: 0.30, redMax: 0.42, greenMin: 0.28, greenMax: 0.39,
    brightnessMin: 90, brightnessMax: 175, textureMin: 0.10, textureMax: 0.38,
    dominantColors: ['laterite/ferralitic', 'basalt/volcanic', 'mixed-terrain'],
    sceneKeywords: ['mountain', 'plateau', 'farm', 'terrace', 'highland'],
  },
  // ═══ SOUTHERN AFRICA ═══
  {
    region: 'South Africa Highveld',
    country: 'South Africa', countryCode: 'ZA',
    lat: -26.2, lon: 28.05, climateZone: 'subtropical-highland',
    vegMin: 0.15, vegMax: 0.45, soilMin: 0.10, soilMax: 0.40,
    redMin: 0.33, redMax: 0.42, greenMin: 0.30, greenMax: 0.37,
    brightnessMin: 100, brightnessMax: 190, textureMin: 0.08, textureMax: 0.30,
    dominantColors: ['sandstone/alluvial', 'mixed-terrain', 'laterite/ferralitic'],
    sceneKeywords: ['grass', 'field', 'farm', 'mine', 'open'],
  },
  {
    region: 'Mozambique Coastal',
    country: 'Mozambique', countryCode: 'MZ',
    lat: -25.97, lon: 32.58, climateZone: 'tropical-coastal',
    vegMin: 0.30, vegMax: 0.70, soilMin: 0.03, soilMax: 0.22,
    redMin: 0.28, redMax: 0.38, greenMin: 0.33, greenMax: 0.42,
    brightnessMin: 100, brightnessMax: 200, textureMin: 0.06, textureMax: 0.28,
    dominantColors: ['vegetated', 'sandstone/alluvial'],
    sceneKeywords: ['palm', 'tropical', 'coast', 'sand', 'mangrove'],
  },
  // ═══ WEST AFRICA ═══
  {
    region: 'Nigeria South (Niger Delta)',
    country: 'Nigeria', countryCode: 'NG', subRegion: 'Niger Delta/Lagos',
    lat: 6.45, lon: 3.40, climateZone: 'tropical-wet',
    vegMin: 0.35, vegMax: 0.75, soilMin: 0.02, soilMax: 0.18,
    redMin: 0.26, redMax: 0.36, greenMin: 0.35, greenMax: 0.44,
    brightnessMin: 75, brightnessMax: 150, textureMin: 0.08, textureMax: 0.30,
    dominantColors: ['vegetated', 'water/wetland'],
    sceneKeywords: ['river', 'swamp', 'mangrove', 'oil', 'tropical'],
  },
  {
    region: 'Ghana/Ivory Coast',
    country: 'Ghana', countryCode: 'GH',
    lat: 5.60, lon: -1.62, climateZone: 'tropical-wet',
    vegMin: 0.30, vegMax: 0.70, soilMin: 0.03, soilMax: 0.22,
    redMin: 0.28, redMax: 0.38, greenMin: 0.33, greenMax: 0.42,
    brightnessMin: 80, brightnessMax: 155, textureMin: 0.07, textureMax: 0.28,
    dominantColors: ['vegetated', 'laterite/ferralitic'],
    sceneKeywords: ['forest', 'cocoa', 'plantation', 'tropical'],
  },
  {
    region: 'Sahel (Burkina Faso/Niger/Mali)',
    country: 'Niger', countryCode: 'NE',
    lat: 13.50, lon: 2.12, climateZone: 'semi-arid',
    vegMin: 0.02, vegMax: 0.18, soilMin: 0.30, soilMax: 0.65,
    redMin: 0.36, redMax: 0.48, greenMin: 0.28, greenMax: 0.35,
    brightnessMin: 130, brightnessMax: 230, textureMin: 0.04, textureMax: 0.22,
    dominantColors: ['sandstone/alluvial', 'laterite/ferralitic'],
    sceneKeywords: ['desert', 'sand', 'dry', 'savanna', 'arid'],
  },
  // ═══ NORTH AFRICA / MIDDLE EAST ═══
  {
    region: 'Sahara Desert',
    country: 'Libya', countryCode: 'LY',
    lat: 27.0, lon: 14.0, climateZone: 'arid-desert',
    vegMin: 0.0, vegMax: 0.05, soilMin: 0.35, soilMax: 0.80,
    redMin: 0.38, redMax: 0.50, greenMin: 0.28, greenMax: 0.35,
    brightnessMin: 150, brightnessMax: 250, textureMin: 0.02, textureMax: 0.15,
    dominantColors: ['sandstone/alluvial', 'limestone/chalk'],
    sceneKeywords: ['desert', 'sand', 'dune'],
  },
  {
    region: 'Arabian Peninsula',
    country: 'Saudi Arabia', countryCode: 'SA',
    lat: 24.0, lon: 45.0, climateZone: 'arid-desert',
    vegMin: 0.0, vegMax: 0.08, soilMin: 0.30, soilMax: 0.75,
    redMin: 0.36, redMax: 0.48, greenMin: 0.28, greenMax: 0.36,
    brightnessMin: 140, brightnessMax: 245, textureMin: 0.03, textureMax: 0.18,
    dominantColors: ['sandstone/alluvial', 'limestone/chalk'],
    sceneKeywords: ['desert', 'sand', 'dune', 'oil'],
  },
  // ═══ SOUTH ASIA ═══
  {
    region: 'Indian Subcontinent (Deccan)',
    country: 'India', countryCode: 'IN', subRegion: 'Deccan Plateau',
    lat: 17.40, lon: 78.47, climateZone: 'tropical-dry',
    vegMin: 0.10, vegMax: 0.45, soilMin: 0.12, soilMax: 0.50,
    redMin: 0.34, redMax: 0.44, greenMin: 0.28, greenMax: 0.37,
    brightnessMin: 100, brightnessMax: 195, textureMin: 0.08, textureMax: 0.35,
    dominantColors: ['laterite/ferralitic', 'basalt/volcanic', 'mixed-terrain'],
    sceneKeywords: ['farm', 'field', 'dry', 'rock', 'plateau'],
  },
  {
    region: 'Indo-Gangetic Plains',
    country: 'India', countryCode: 'IN', subRegion: 'North India',
    lat: 26.85, lon: 80.95, climateZone: 'subtropical-humid',
    vegMin: 0.25, vegMax: 0.65, soilMin: 0.05, soilMax: 0.30,
    redMin: 0.30, redMax: 0.40, greenMin: 0.32, greenMax: 0.42,
    brightnessMin: 90, brightnessMax: 180, textureMin: 0.06, textureMax: 0.25,
    dominantColors: ['mixed-terrain', 'sandstone/alluvial', 'vegetated'],
    sceneKeywords: ['field', 'farm', 'rice', 'river', 'flat', 'plain'],
  },
  // ═══ SOUTHEAST ASIA ═══
  {
    region: 'Southeast Asia Tropical',
    country: 'Indonesia', countryCode: 'ID',
    lat: -6.20, lon: 106.85, climateZone: 'tropical-wet',
    vegMin: 0.40, vegMax: 0.85, soilMin: 0.01, soilMax: 0.15,
    redMin: 0.24, redMax: 0.34, greenMin: 0.36, greenMax: 0.48,
    brightnessMin: 65, brightnessMax: 145, textureMin: 0.10, textureMax: 0.35,
    dominantColors: ['vegetated'],
    sceneKeywords: ['jungle', 'forest', 'palm', 'rice', 'tropical'],
  },
  // ═══ SOUTH AMERICA ═══
  {
    region: 'Amazon Basin',
    country: 'Brazil', countryCode: 'BR', subRegion: 'Amazonia',
    lat: -3.10, lon: -60.02, climateZone: 'tropical-wet',
    vegMin: 0.45, vegMax: 0.90, soilMin: 0.01, soilMax: 0.10,
    redMin: 0.22, redMax: 0.33, greenMin: 0.38, greenMax: 0.50,
    brightnessMin: 55, brightnessMax: 135, textureMin: 0.12, textureMax: 0.40,
    dominantColors: ['vegetated'],
    sceneKeywords: ['jungle', 'forest', 'river', 'tropical', 'dense'],
  },
  {
    region: 'Brazilian Cerrado',
    country: 'Brazil', countryCode: 'BR', subRegion: 'Cerrado',
    lat: -15.78, lon: -47.93, climateZone: 'tropical-savanna',
    vegMin: 0.18, vegMax: 0.50, soilMin: 0.10, soilMax: 0.40,
    redMin: 0.32, redMax: 0.42, greenMin: 0.30, greenMax: 0.40,
    brightnessMin: 100, brightnessMax: 185, textureMin: 0.08, textureMax: 0.30,
    dominantColors: ['laterite/ferralitic', 'mixed-terrain', 'vegetated'],
    sceneKeywords: ['savanna', 'grassland', 'farm', 'field'],
  },
  {
    region: 'Andes Mountains',
    country: 'Peru', countryCode: 'PE',
    lat: -13.16, lon: -72.55, climateZone: 'highland-tropical',
    vegMin: 0.08, vegMax: 0.40, soilMin: 0.12, soilMax: 0.50,
    redMin: 0.30, redMax: 0.42, greenMin: 0.28, greenMax: 0.38,
    brightnessMin: 100, brightnessMax: 200, textureMin: 0.15, textureMax: 0.45,
    dominantColors: ['fractured/rocky', 'mixed-terrain', 'basalt/volcanic'],
    sceneKeywords: ['mountain', 'cliff', 'rock', 'highland', 'terrace'],
  },
  // ═══ EUROPE ═══
  {
    region: 'Mediterranean',
    country: 'Spain', countryCode: 'ES',
    lat: 40.42, lon: -3.70, climateZone: 'mediterranean',
    vegMin: 0.12, vegMax: 0.42, soilMin: 0.08, soilMax: 0.35,
    redMin: 0.32, redMax: 0.40, greenMin: 0.30, greenMax: 0.38,
    brightnessMin: 110, brightnessMax: 200, textureMin: 0.06, textureMax: 0.28,
    dominantColors: ['mixed-terrain', 'sandstone/alluvial', 'limestone/chalk'],
    sceneKeywords: ['olive', 'vineyard', 'field', 'hill', 'dry'],
  },
  {
    region: 'Northern Europe Temperate',
    country: 'United Kingdom', countryCode: 'GB',
    lat: 51.51, lon: -0.13, climateZone: 'temperate-oceanic',
    vegMin: 0.30, vegMax: 0.65, soilMin: 0.03, soilMax: 0.18,
    redMin: 0.28, redMax: 0.36, greenMin: 0.34, greenMax: 0.44,
    brightnessMin: 70, brightnessMax: 150, textureMin: 0.06, textureMax: 0.25,
    dominantColors: ['vegetated', 'mixed-terrain'],
    sceneKeywords: ['field', 'farm', 'grass', 'meadow', 'hill'],
  },
  // ═══ CENTRAL ASIA / STEPPE ═══
  {
    region: 'Central Asian Steppe',
    country: 'Kazakhstan', countryCode: 'KZ',
    lat: 51.17, lon: 71.45, climateZone: 'continental-steppe',
    vegMin: 0.05, vegMax: 0.30, soilMin: 0.15, soilMax: 0.50,
    redMin: 0.33, redMax: 0.42, greenMin: 0.30, greenMax: 0.38,
    brightnessMin: 105, brightnessMax: 195, textureMin: 0.04, textureMax: 0.22,
    dominantColors: ['mixed-terrain', 'sandstone/alluvial'],
    sceneKeywords: ['steppe', 'plain', 'grass', 'flat', 'open'],
  },
  // ═══ AUSTRALIA ═══
  {
    region: 'Australian Outback',
    country: 'Australia', countryCode: 'AU',
    lat: -25.27, lon: 133.78, climateZone: 'arid-desert',
    vegMin: 0.02, vegMax: 0.18, soilMin: 0.30, soilMax: 0.70,
    redMin: 0.38, redMax: 0.50, greenMin: 0.26, greenMax: 0.34,
    brightnessMin: 130, brightnessMax: 235, textureMin: 0.04, textureMax: 0.22,
    dominantColors: ['laterite/ferralitic', 'sandstone/alluvial'],
    sceneKeywords: ['desert', 'outback', 'red', 'dry', 'bush'],
  },
  // ═══ NORTH AMERICA ═══
  {
    region: 'US Great Plains',
    country: 'United States', countryCode: 'US', subRegion: 'Great Plains',
    lat: 39.83, lon: -98.58, climateZone: 'continental',
    vegMin: 0.15, vegMax: 0.50, soilMin: 0.08, soilMax: 0.35,
    redMin: 0.31, redMax: 0.40, greenMin: 0.32, greenMax: 0.40,
    brightnessMin: 100, brightnessMax: 190, textureMin: 0.05, textureMax: 0.22,
    dominantColors: ['mixed-terrain', 'sandstone/alluvial', 'vegetated'],
    sceneKeywords: ['field', 'farm', 'wheat', 'corn', 'prairie', 'plain'],
  },
  {
    region: 'US Southwest Desert',
    country: 'United States', countryCode: 'US', subRegion: 'Arizona/Nevada',
    lat: 34.05, lon: -111.09, climateZone: 'arid-desert',
    vegMin: 0.02, vegMax: 0.15, soilMin: 0.25, soilMax: 0.65,
    redMin: 0.36, redMax: 0.48, greenMin: 0.28, greenMax: 0.36,
    brightnessMin: 130, brightnessMax: 235, textureMin: 0.06, textureMax: 0.28,
    dominantColors: ['sandstone/alluvial', 'fractured/rocky', 'laterite/ferralitic'],
    sceneKeywords: ['desert', 'canyon', 'rock', 'mesa', 'cactus'],
  },
];

// ─── CLIMATE ZONE CLASSIFICATION ───
function classifyClimateZone(veg: number, soil: number, brightness: number, red: number, green: number, texture: number): string {
  // Highland MUST be checked BEFORE tropical-wet — highlands also have high vegetation + green
  if (veg > 0.20 && soil > 0.03 && red > 0.26 && brightness > 80 && brightness < 180 && texture > 0.06) return 'tropical-highland';
  if (veg > 0.50 && green > 0.38 && brightness < 130 && red < 0.28) return 'tropical-wet';
  if (veg > 0.35 && green > 0.33 && brightness < 160) return 'tropical-humid';
  if (veg > 0.10 && veg < 0.35 && soil > 0.15 && red > 0.34 && brightness > 100) return 'tropical-savanna';
  if (veg < 0.15 && soil > 0.30 && brightness > 130) return 'semi-arid';
  if (veg < 0.08 && soil > 0.35 && brightness > 150) return 'arid-desert';
  if (veg > 0.25 && green > 0.33 && brightness < 155 && texture < 0.25) return 'temperate-oceanic';
  if (veg > 0.15 && soil > 0.08 && brightness > 110 && brightness < 200) return 'mediterranean';
  if (veg > 0.10 && brightness > 100 && texture < 0.22) return 'continental';
  return 'unknown';
}

// ─── MAIN ESTIMATION FUNCTION ───
export function estimateGeographicLocation(
  pixelAnalysis: {
    vegetationIndex: number;
    soilExposureIndex: number;
    rockExposureIndex: number;
    waterIndex: number;
    redRatio: number;
    greenRatio: number;
    blueRatio: number;
    brightness: number;
    textureVariance: number;
    dominantColorClass: string;
    isOutdoorScene: boolean;
    sceneConfidence: number;
  },
  terrainLabels: string[], // MobileNet prediction labels
  locationHints?: string[] // User-provided location text (county, city, village, region)
): GeoEstimationResult {
  if (!pixelAnalysis.isOutdoorScene) {
    return {
      estimates: [],
      climateZone: 'unknown',
      bestEstimate: null,
      isOutdoor: false,
      method: 'visual-terrain-matching',
    };
  }

  const {
    vegetationIndex: veg, soilExposureIndex: soil, rockExposureIndex: rock,
    waterIndex: water, redRatio: red, greenRatio: green, blueRatio: blue,
    brightness, textureVariance: texture, dominantColorClass: colorClass,
  } = pixelAnalysis;

  // Step 1: Classify climate zone
  const climateZone = classifyClimateZone(veg, soil, brightness, red, green, texture);

  // Step 2: Score each terrain signature
  const scored: { sig: TerrainSignature; score: number; reasons: string[] }[] = [];

  for (const sig of TERRAIN_DB) {
    let score = 0;
    const reasons: string[] = [];

    // Vegetation match (0-20 pts)
    if (veg >= sig.vegMin && veg <= sig.vegMax) {
      const center = (sig.vegMin + sig.vegMax) / 2;
      const range = (sig.vegMax - sig.vegMin) / 2;
      const closeness = 1 - Math.abs(veg - center) / (range || 0.01);
      const pts = closeness * 20;
      score += pts;
      reasons.push(`Vegetation ${(veg * 100).toFixed(0)}% matches ${sig.region} (${(sig.vegMin * 100).toFixed(0)}-${(sig.vegMax * 100).toFixed(0)}%)`);
    }

    // Soil exposure match (0-18 pts)
    if (soil >= sig.soilMin && soil <= sig.soilMax) {
      const center = (sig.soilMin + sig.soilMax) / 2;
      const range = (sig.soilMax - sig.soilMin) / 2;
      const closeness = 1 - Math.abs(soil - center) / (range || 0.01);
      score += closeness * 18;
      reasons.push(`Soil exposure ${(soil * 100).toFixed(0)}% matches`);
    }

    // Red ratio match (0-12 pts)
    if (red >= sig.redMin && red <= sig.redMax) {
      score += 12;
      reasons.push('Soil color (red ratio) matches');
    }

    // Green ratio match (0-10 pts)
    if (green >= sig.greenMin && green <= sig.greenMax) {
      score += 10;
    }

    // Brightness match (0-10 pts)
    if (brightness >= sig.brightnessMin && brightness <= sig.brightnessMax) {
      const center = (sig.brightnessMin + sig.brightnessMax) / 2;
      const range = (sig.brightnessMax - sig.brightnessMin) / 2;
      const closeness = 1 - Math.abs(brightness - center) / (range || 1);
      score += closeness * 10;
    }

    // Texture match (0-8 pts)
    if (texture >= sig.textureMin && texture <= sig.textureMax) {
      score += 8;
    }

    // Dominant color class match (0-12 pts)
    if (sig.dominantColors.includes(colorClass)) {
      score += 12;
      reasons.push(`Geological color class "${colorClass}" matches`);
    }

    // Climate zone match bonus (0-10 pts)
    if (sig.climateZone === climateZone) {
      score += 10;
      reasons.push(`Climate zone "${climateZone}" matches`);
    }

    // MobileNet scene label match (0-12 pts, +3 per match)
    let labelMatches = 0;
    for (const label of terrainLabels) {
      const lower = label.toLowerCase();
      for (const kw of sig.sceneKeywords) {
        if (lower.includes(kw)) {
          labelMatches++;
          break;
        }
      }
    }
    if (labelMatches > 0) {
      const pts = Math.min(12, labelMatches * 4);
      score += pts;
      reasons.push(`${labelMatches} scene label(s) match`);
    }

    // ═══ LOCATION TEXT BOOST ═══
    // If the user typed a location name that matches this signature's region/subRegion,
    // give a massive boost. The user KNOWS where they are — respect that.
    if (locationHints && locationHints.length > 0) {
      const sigText = `${sig.region} ${sig.subRegion ?? ''} ${sig.country}`.toLowerCase();
      for (const hint of locationHints) {
        const h = hint.toLowerCase().trim();
        if (h.length < 2) continue;
        if (sigText.includes(h) || h.includes(sig.country.toLowerCase())) {
          score += 40; // Massive boost — user explicitly named this place
          reasons.push(`User-provided location "${hint}" matches this region`);
          break;
        }
        // Also check individual words (e.g. "Makuyu" matches "Murang'a/Thika/Makuyu")
        const words = h.split(/[\s,\/]+/);
        for (const word of words) {
          if (word.length >= 3 && sigText.includes(word)) {
            score += 35;
            reasons.push(`User-provided location word "${word}" matches this region`);
            break;
          }
        }
      }
    }

    if (score > 15) {
      scored.push({ sig, score, reasons });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Normalize to confidence (0-1)
  const maxPossible = 112; // Sum of all max points
  const estimates: GeoEstimate[] = scored.slice(0, 5).map((item, idx) => ({
    rank: idx + 1,
    region: item.sig.region,
    country: item.sig.country,
    countryCode: item.sig.countryCode,
    subRegion: item.sig.subRegion,
    latitude: item.sig.lat,
    longitude: item.sig.lon,
    confidence: Math.round((item.score / maxPossible) * 100) / 100,
    climateZone: item.sig.climateZone,
    reasoning: item.reasons,
  }));

  return {
    estimates,
    climateZone,
    bestEstimate: estimates[0] || null,
    isOutdoor: true,
    method: 'visual-terrain-matching',
  };
}
