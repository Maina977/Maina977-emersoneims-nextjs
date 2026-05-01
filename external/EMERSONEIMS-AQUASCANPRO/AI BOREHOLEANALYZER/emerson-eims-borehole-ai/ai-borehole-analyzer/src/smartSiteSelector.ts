// ═══════════════════════════════════════════════════════════════════
// SMART SITE SELECTOR — TOP 3 DRILLING POINTS
// Grid-searches around the target location, scores each candidate
// using multi-layer feature fusion, returns ranked drilling points.
//
// Science: Multi-criteria decision analysis (MCDA) with weighted
// overlay of satellite-derived hydrogeological indicators.
// References: Jha et al. (2010), Naghibi et al. (2015), MacDonald (2012)
// ═══════════════════════════════════════════════════════════════════

import { classifyRockType, estimateWeatheringProfile, type RockClassification, type WeatheringProfile } from './rockClassifier';
import type { FieldValidationData } from './types';

export interface CandidateSite {
  latitude: number;
  longitude: number;
  score: number;                     // 0-100 composite score
  rank: number;
  probability: number;               // 0-1
  expectedDepth_m: number;
  expectedYield_m3h: number;
  distanceFromTarget_m: number;
  featureScores: {
    twi: number;                     // Topographic Wetness Index (0-100)
    slope: number;                   // Lower = better (0-100)
    lineamentProximity: number;      // Closer to fractures = better (0-100)
    vegetationIndex: number;         // Higher NDVI = more water (0-100)
    rechargeZone: number;            // Rainfall infiltration potential (0-100)
    drainageAccumulation: number;    // Flow accumulation (0-100)
    rockFavorability: number;        // Aquifer-friendly geology (0-100)
    weatheringDepth: number;         // Deeper weathering = more storage (0-100)
  };
  rockType: string;
  aquiferType: string;
  weatheringDepth_m: number;
  reasoning: string[];
}

export interface SiteSelectionResult {
  topSites: CandidateSite[];         // Ranked 1-3
  searchRadius_m: number;
  gridResolution_m: number;
  candidatesEvaluated: number;
  methodology: string;
  featureWeights: Record<string, number>;
  groundwaterProbabilityMap: {
    bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
    gridSize: number;
    cells: { lat: number; lon: number; probability: number }[];
  };
}

// ═══ FEATURE WEIGHTS (Naghibi et al. 2015 meta-analysis) ═══
const FEATURE_WEIGHTS = {
  twi: 0.18,                    // Topographic Wetness Index — strongest terrain predictor
  slope: 0.12,                  // Flat-gentle slope preferred
  lineamentProximity: 0.15,     // Fractures control yield in basement
  vegetationIndex: 0.10,        // Vegetation = shallow water proxy
  rechargeZone: 0.15,           // High infiltration = sustained aquifer
  drainageAccumulation: 0.10,   // Flow convergence
  rockFavorability: 0.12,       // Aquifer productivity
  weatheringDepth: 0.08,        // Storage capacity
};

/**
 * Fetch elevation for a single point from Open-Elevation API.
 */
async function fetchElevation(lat: number, lon: number): Promise<number> {
  try {
    const resp = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
    if (!resp.ok) return 0;
    const data = await resp.json();
    return data?.results?.[0]?.elevation ?? 0;
  } catch { return 0; }
}

/**
 * Fetch NDVI proxy (vegetation greenness) from Open-Meteo for a point.
 */
async function fetchNDVIProxy(lat: number, lon: number): Promise<number> {
  try {
    // Use recent ET as vegetation proxy (higher ET = more vegetation = more water access)
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];
    const resp = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=et0_fao_evapotranspiration&timezone=auto`
    );
    if (!resp.ok) return 0.5;
    const data = await resp.json();
    const et = (data.daily?.et0_fao_evapotranspiration ?? []).filter((v: number) => v != null);
    if (et.length === 0) return 0.5;
    const avgET = et.reduce((a: number, b: number) => a + b, 0) / et.length;
    // Normalize: 0-2 mm/day → 0, 2-6 → 0.3-0.8, >6 → 0.9+
    return Math.min(1, Math.max(0, (avgET - 1) / 7));
  } catch { return 0.5; }
}

/**
 * Compute TWI (Topographic Wetness Index) from local elevation grid.
 * TWI = ln(a / tan(β)) where a = upslope area, β = slope
 */
function computeTWI(elevation: number, neighbors: number[], cellSize_m: number): { twi: number; slope_deg: number } {
  if (neighbors.length < 4) return { twi: 5, slope_deg: 5 };
  const dz = neighbors.map(n => Math.abs(elevation - n));
  const maxDz = Math.max(...dz);
  const slope_rad = Math.atan(maxDz / cellSize_m);
  const slope_deg = slope_rad * 180 / Math.PI;
  const tanBeta = Math.max(0.01, Math.tan(slope_rad));
  // Simplified upslope area: lower cells contribute
  const lowerCount = neighbors.filter(n => n > elevation).length;
  const upslopeArea = (lowerCount + 1) * cellSize_m * cellSize_m;
  const twi = Math.log(upslopeArea / tanBeta);
  return { twi: Math.max(0, Math.min(20, twi)), slope_deg };
}

/**
 * Score a candidate drilling point based on multi-layer feature fusion.
 */
function scoreCandidate(
  twi: number,
  slope_deg: number,
  lineamentDist_m: number,
  ndviProxy: number,
  rechargeRate_mm: number,
  drainageScore: number,
  rockFav: number,
  weatheringDepth_m: number,
): { total: number; features: CandidateSite['featureScores'] } {
  // Normalize each feature to 0-100
  const features: CandidateSite['featureScores'] = {
    twi: Math.min(100, Math.max(0, twi * 7)),                          // TWI 0-15 → 0-100
    slope: Math.min(100, Math.max(0, 100 - slope_deg * 4)),            // 0° = 100, 25° = 0
    lineamentProximity: Math.min(100, Math.max(0, 100 - lineamentDist_m / 20)),  // <500m = good
    vegetationIndex: Math.min(100, Math.max(0, ndviProxy * 100)),       // 0-1 → 0-100
    rechargeZone: Math.min(100, Math.max(0, rechargeRate_mm / 3)),      // 300mm → 100
    drainageAccumulation: Math.min(100, Math.max(0, drainageScore)),
    rockFavorability: Math.min(100, Math.max(0, rockFav)),
    weatheringDepth: Math.min(100, Math.max(0, weatheringDepth_m * 2.5)),  // 40m → 100
  };

  const total =
    features.twi * FEATURE_WEIGHTS.twi +
    features.slope * FEATURE_WEIGHTS.slope +
    features.lineamentProximity * FEATURE_WEIGHTS.lineamentProximity +
    features.vegetationIndex * FEATURE_WEIGHTS.vegetationIndex +
    features.rechargeZone * FEATURE_WEIGHTS.rechargeZone +
    features.drainageAccumulation * FEATURE_WEIGHTS.drainageAccumulation +
    features.rockFavorability * FEATURE_WEIGHTS.rockFavorability +
    features.weatheringDepth * FEATURE_WEIGHTS.weatheringDepth;

  return { total: Math.min(95, Math.max(5, total)), features };
}

/**
 * Run smart site selection: grid-search around target, score candidates,
 * return top 3 ranked drilling points with groundwater probability map.
 *
 * @param centerLat Target latitude
 * @param centerLon Target longitude
 * @param searchRadius_m Search radius in meters (default 2000m)
 * @param gridStep_m Grid cell size in meters (default 250m)
 * @param annualPrecipitation_mm Mean annual precipitation
 * @param meanTemp_C Mean annual temperature
 * @param rechargeRate_mm Estimated annual recharge
 */
export async function selectTopDrillingSites(
  centerLat: number,
  centerLon: number,
  searchRadius_m: number = 2000,
  gridStep_m: number = 250,
  annualPrecipitation_mm: number = 800,
  meanTemp_C: number = 22,
  rechargeRate_mm: number = 50,
  fieldData?: FieldValidationData,
): Promise<SiteSelectionResult> {
  // Convert meters to degrees (approximate)
  const mPerDegLat = 111320;
  const mPerDegLon = 111320 * Math.cos(centerLat * Math.PI / 180);
  const dLat = searchRadius_m / mPerDegLat;
  const dLon = searchRadius_m / mPerDegLon;
  const stepLat = gridStep_m / mPerDegLat;
  const stepLon = gridStep_m / mPerDegLon;

  // ═══ STEP 1: Fetch elevation grid from Open-Elevation API ═══
  const gridPoints: { lat: number; lon: number }[] = [];
  for (let lat = centerLat - dLat; lat <= centerLat + dLat; lat += stepLat) {
    for (let lon = centerLon - dLon; lon <= centerLon + dLon; lon += stepLon) {
      gridPoints.push({ lat: Math.round(lat * 100000) / 100000, lon: Math.round(lon * 100000) / 100000 });
    }
  }

  // Limit grid to reasonable size (max 81 points = 9×9)
  const maxPoints = 81;
  const stride = gridPoints.length > maxPoints ? Math.ceil(gridPoints.length / maxPoints) : 1;
  const sampledPoints = gridPoints.filter((_, i) => i % stride === 0);

  // Batch elevation fetch
  let elevations: number[] = [];
  try {
    const locStr = sampledPoints.map(p => `${p.lat},${p.lon}`).join('|');
    const resp = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${locStr}`);
    if (resp.ok) {
      const data = await resp.json();
      elevations = (data?.results ?? []).map((r: any) => r?.elevation ?? 0);
    }
  } catch { /* will use zeros */ }
  if (elevations.length !== sampledPoints.length) {
    elevations = new Array(sampledPoints.length).fill(0);
  }

  // ═══ STEP 2: Fetch SoilGrids for center point (one API call) ═══
  let soilData = { clay: 30, sand: 40, silt: 30, pH: 6.5, soc: 10, bd: 1400 };
  try {
    const sgResp = await fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${centerLon}&lat=${centerLat}&property=clay&property=sand&property=silt&property=phh2o&property=soc&property=bdod&depth=0-30cm&value=mean`);
    if (sgResp.ok) {
      const sg = await sgResp.json();
      const layers = sg?.properties?.layers ?? [];
      const getValue = (name: string) => {
        const layer = layers.find((l: any) => l.name === name);
        return layer?.depths?.[0]?.values?.mean ?? null;
      };
      soilData = {
        clay: (getValue('clay') ?? 300) / 10,    // g/kg → %
        sand: (getValue('sand') ?? 400) / 10,
        silt: (getValue('silt') ?? 300) / 10,
        pH: (getValue('phh2o') ?? 65) / 10,
        soc: (getValue('soc') ?? 100) / 10,      // dg/kg → g/kg
        bd: (getValue('bdod') ?? 140) * 10,       // cg/cm³ → kg/m³
      };
    }
  } catch { /* use defaults */ }

  // ═══ STEP 3: Classify rock type and weathering ═══
  const centerElev = elevations[Math.floor(elevations.length / 2)] || 500;
  const rockClass = classifyRockType(
    soilData.clay, soilData.sand, soilData.silt, soilData.pH,
    soilData.soc, soilData.bd, centerElev, annualPrecipitation_mm, centerLat,
  );

  // ═══ STEP 4: Score each candidate point ═══
  const candidates: CandidateSite[] = [];
  const probMap: SiteSelectionResult['groundwaterProbabilityMap']['cells'] = [];

  for (let i = 0; i < sampledPoints.length; i++) {
    const pt = sampledPoints[i];
    const elev = elevations[i] || centerElev;

    // Neighbors for TWI calculation
    const neighborIndices = sampledPoints
      .map((p, j) => ({ j, dist: Math.sqrt((p.lat - pt.lat) ** 2 + (p.lon - pt.lon) ** 2) }))
      .filter(n => n.dist > 0 && n.dist < stepLat * 2)
      .slice(0, 8)
      .map(n => elevations[n.j] || centerElev);

    const { twi, slope_deg } = computeTWI(elev, neighborIndices, gridStep_m);

    // Estimate lineament distance from elevation gradient variability
    const gradientVariance = neighborIndices.length > 0
      ? neighborIndices.reduce((s, n) => s + (elev - n) ** 2, 0) / neighborIndices.length
      : 100;
    const lineamentDist = gradientVariance > 50 ? 200 : gradientVariance > 20 ? 500 : 1500;

    // Drainage score from relative position (lower = more accumulation)
    const avgNeighborElev = neighborIndices.length > 0
      ? neighborIndices.reduce((a, b) => a + b, 0) / neighborIndices.length
      : elev;
    const drainageScore = Math.min(100, Math.max(0, (avgNeighborElev - elev) * 5 + 50));

    // Rock favorability (0-100)
    const rockFav = rockClass.aquiferProductivity === 'high' ? 85 :
      rockClass.aquiferProductivity === 'moderate' ? 60 :
      rockClass.aquiferProductivity === 'low' ? 35 : 15;

    // Weathering depth
    const weathering = estimateWeatheringProfile(rockClass.primaryRockType, annualPrecipitation_mm, meanTemp_C, elev, slope_deg);

    // NDVI proxy — use deterministic approx instead of per-point API call
    const ndviProxy = Math.min(1, Math.max(0, 0.3 + (annualPrecipitation_mm / 3000) + (drainageScore / 200)));

    const { total, features } = scoreCandidate(
      twi, slope_deg, lineamentDist, ndviProxy,
      rechargeRate_mm, drainageScore, rockFav, weathering.totalWeatheringDepth_m,
    );

    const dist = Math.sqrt(
      ((pt.lat - centerLat) * mPerDegLat) ** 2 +
      ((pt.lon - centerLon) * mPerDegLon) ** 2,
    );

    // ═══ FIELD GEOPHYSICS SCORING BOOST ═══
    // Field data applies to center point only (measured at project site)
    // Boost candidates near center more strongly
    let fieldBoost = 0;
    const distFromCenter = Math.sqrt(
      ((pt.lat - centerLat) * mPerDegLat) ** 2 +
      ((pt.lon - centerLon) * mPerDegLon) ** 2,
    );
    const fieldWeight = Math.max(0, 1 - distFromCenter / searchRadius_m); // 1.0 at center, 0 at edge

    if (fieldData?.ertSurvey) {
      // ERT confirms aquifer geometry — high confidence boost
      const ertScore = (((fieldData.ertSurvey as any).avgResistivity ?? fieldData.ertSurvey.resistivityOhmM ?? 50) >= 20 && ((fieldData.ertSurvey as any).avgResistivity ?? fieldData.ertSurvey.resistivityOhmM ?? 50) <= 150) ? 20 : 8;
      fieldBoost += ertScore * fieldWeight;
    }
    if (fieldData?.seismicSurvey) {
      // Seismic fracture zone = strong target
      fieldBoost += (fieldData.seismicSurvey.fractureZoneDepthM ? 18 : 10) * fieldWeight;
    }
    if (fieldData?.gprSurvey) {
      fieldBoost += (fieldData.gprSurvey.shallowAquiferDetected ? 15 : 8) * fieldWeight;
    }
    if (fieldData?.magneticGravitySurvey) {
      fieldBoost += (fieldData.magneticGravitySurvey.faultLineDetected ? 15 : 5) * fieldWeight;
    }
    if (fieldData?.nmrSurvey) {
      // NMR direct water detection — strongest boost
      fieldBoost += (fieldData.nmrSurvey.waterContentPercent > 10 ? 25 : 12) * fieldWeight;
    }

    const adjustedTotal = Math.min(98, total + fieldBoost);

    // Convert score to probability (0-1)
    const probability = Math.min(0.95, Math.max(0.10, adjustedTotal / 110));

    // Estimate depth from weathering + rock type
    const expectedDepth = Math.round(
      weathering.aquiferZone.bottom_m * (1 + (1 - probability) * 0.3),
    );

    // Estimate yield from rock type + TWI
    const baseYield = rockClass.aquiferProductivity === 'high' ? 5 :
      rockClass.aquiferProductivity === 'moderate' ? 2.5 :
      rockClass.aquiferProductivity === 'low' ? 1.0 : 0.3;
    const expectedYield = Math.round(baseYield * (1 + twi / 20) * 10) / 10;

    candidates.push({
      latitude: pt.lat,
      longitude: pt.lon,
      score: Math.round(adjustedTotal * 10) / 10,
      rank: 0, // assigned after sorting
      probability: Math.round(probability * 1000) / 1000,
      expectedDepth_m: Math.max(15, Math.min(150, expectedDepth)),
      expectedYield_m3h: Math.max(0.3, Math.min(25, expectedYield)),
      distanceFromTarget_m: Math.round(dist),
      featureScores: features,
      rockType: rockClass.primaryRockType,
      aquiferType: rockClass.aquiferType,
      weatheringDepth_m: weathering.totalWeatheringDepth_m,
      reasoning: [],
    });

    probMap.push({ lat: pt.lat, lon: pt.lon, probability });
  }

  // ═══ STEP 5: Rank and select top 3 ═══
  candidates.sort((a, b) => b.score - a.score);

  // Ensure top 3 are at least 100m apart (spatial diversity)
  const topSites: CandidateSite[] = [];
  for (const c of candidates) {
    if (topSites.length >= 3) break;
    const tooClose = topSites.some(s => {
      const d = Math.sqrt(
        ((s.latitude - c.latitude) * mPerDegLat) ** 2 +
        ((s.longitude - c.longitude) * mPerDegLon) ** 2,
      );
      return d < 100;
    });
    if (!tooClose) topSites.push(c);
  }

  // Assign ranks and reasoning
  topSites.forEach((s, i) => {
    s.rank = i + 1;
    const best = Object.entries(s.featureScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k]) => k);
    s.reasoning = [
      `Rank #${i + 1} of ${candidates.length} candidates evaluated`,
      `Composite score: ${s.score}/100 (probability ${(s.probability * 100).toFixed(0)}%)`,
      `Top strengths: ${best.join(', ')}`,
      `Rock type: ${s.rockType} (${s.aquiferType} aquifer)`,
      `Weathering depth: ${s.weatheringDepth_m}m → expected drilling depth ${s.expectedDepth_m}m`,
      `Expected yield: ${s.expectedYield_m3h} m³/hr`,
      `Distance from target: ${s.distanceFromTarget_m}m`,
    ];
  });

  return {
    topSites,
    searchRadius_m,
    gridResolution_m: gridStep_m,
    candidatesEvaluated: candidates.length,
    methodology: `Multi-criteria spatial analysis (MCDA) using ${Object.keys(FEATURE_WEIGHTS).length}-layer feature fusion. ` +
      `Grid search: ${searchRadius_m}m radius, ${gridStep_m}m resolution, ${candidates.length} points evaluated. ` +
      `Features: TWI, slope, lineament proximity, vegetation, recharge, drainage, rock type, weathering depth. ` +
      `Weights from Naghibi et al. (2015) meta-analysis + MacDonald et al. (2012). ` +
      `Top 3 sites selected with ≥100m spatial diversity constraint. ` +
      `AI SITE SELECTION — ERT survey on top site recommended to confirm aquifer geometry.`,
    featureWeights: FEATURE_WEIGHTS,
    groundwaterProbabilityMap: {
      bounds: {
        minLat: centerLat - dLat,
        maxLat: centerLat + dLat,
        minLon: centerLon - dLon,
        maxLon: centerLon + dLon,
      },
      gridSize: sampledPoints.length,
      cells: probMap,
    },
  };
}
