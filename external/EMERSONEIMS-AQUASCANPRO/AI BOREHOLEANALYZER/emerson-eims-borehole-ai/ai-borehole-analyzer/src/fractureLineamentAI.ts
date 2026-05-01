/* ═══════════════════════════════════════════════════════════════════════
   FRACTURE & LINEAMENT AI ENGINE
   Satellite + DEM + structural geology → fracture detection & ranking
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface FractureAnalysisInput {
  latitude: number;
  longitude: number;
  elevation_m?: number;
  slope_deg?: number;
  aspect_deg?: number;
  rockType?: string;
  /** Existing lineament data from advancedHydroEngine (if available) */
  existingLineaments?: {
    lineamentDensity: number;
    dominantDirection_deg: number;
    intersectionCount: number;
    fractureZoneProximity_m: number;
  };
  /** DEM-derived terrain data */
  twi?: number;              // Topographic Wetness Index
  drainageDensity?: number;  // km/km²
  /** Seismic survey (if available) */
  seismicFractureDepth_m?: number;
  seismicFractureThickness_m?: number;
  /** Magnetic anomaly (if available) */
  magneticAnomalyDetected?: boolean;
  faultAzimuth_deg?: number;
}

export interface Lineament {
  id: string;
  azimuth_deg: number;       // 0-180° from north
  length_km: number;
  type: 'fault' | 'fracture' | 'joint' | 'dyke' | 'contact' | 'inferred';
  confidence: number;        // 0-1
  source: string;            // 'DEM' | 'satellite' | 'magnetic' | 'manual'
  distanceFromSite_km: number;
}

export interface FractureIntersection {
  latitude: number;
  longitude: number;
  lineament1Id: string;
  lineament2Id: string;
  angleBetween_deg: number;  // acute angle between lineaments
  distanceFromSite_km: number;
  permeabilityScore: number; // 0-1
  priority: 'high' | 'medium' | 'low';
}

export interface FractureAnalysisResult {
  // Lineament detection
  lineaments: Lineament[];
  totalLineamentCount: number;
  lineamentDensity_km_per_km2: number;
  dominantOrientation_deg: number;
  roseHistogram: { binStart: number; binEnd: number; count: number }[];

  // Fracture intersections (best drilling targets)
  intersections: FractureIntersection[];
  topIntersections: FractureIntersection[];   // top 5 ranked by permeability

  // Fracture scores
  fractureDensityScore: number;     // 0-100
  intersectionPriorityScore: number; // 0-100
  permeabilityScore: number;         // 0-100
  overallFractureScore: number;      // 0-100 weighted composite

  // Hydrogeological implications
  estimatedFracturePermeability: 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';
  yieldMultiplier: number;           // 1.0-3.0 (boost to expected yield)
  preferredDrillingAzimuth_deg: number; // drill perpendicular to dominant fracture
  fractureAquiferLikelihood: number;    // 0-1

  // Advanced fracture intelligence (Phase 8)
  depthApertureProfile: { depth_m: number; aperture_mm: number; permeability_m2: number }[];
  fractureConnectivity: {
    networkDensity: number;         // 0-1 (how interconnected)
    longestPathKm: number;
    clusterCount: number;
    percolationThreshold: boolean;  // true = connected fracture network exists
    effectiveTransmissivity_m2d: number;
  };
  stressField: {
    maxHorizontalStress_deg: number;  // SHmax azimuth
    openFractureAzimuths: number[];   // fractures likely open (perpendicular to SHmax)
    criticallyStressed: boolean;      // fractures on verge of slip (high permeability)
  };
  anisotropyRatio: number;            // permeability anisotropy Kmax/Kmin

  // Risk factors
  structuralComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  collapsRisk: 'low' | 'moderate' | 'high';

  diagnostics: string[];
  methodology: string;
  confidence: number;
}

/* ── Rose Diagram / Orientation Analysis ──────────────────── */

function buildRoseHistogram(lineaments: Lineament[]): { binStart: number; binEnd: number; count: number }[] {
  const binSize = 10; // 10° bins
  const histogram: { binStart: number; binEnd: number; count: number }[] = [];
  for (let start = 0; start < 180; start += binSize) {
    histogram.push({
      binStart: start,
      binEnd: start + binSize,
      count: lineaments.filter(l => l.azimuth_deg >= start && l.azimuth_deg < start + binSize).length,
    });
  }
  return histogram;
}

function dominantOrientation(lineaments: Lineament[]): number {
  if (lineaments.length === 0) return 0;
  // Circular mean of azimuths (doubled to handle 0/180 wraparound)
  let sinSum = 0, cosSum = 0;
  for (const l of lineaments) {
    const rad = l.azimuth_deg * 2 * Math.PI / 180;
    sinSum += Math.sin(rad) * l.length_km;
    cosSum += Math.cos(rad) * l.length_km;
  }
  let mean = Math.atan2(sinSum, cosSum) * 180 / Math.PI / 2;
  if (mean < 0) mean += 180;
  return Math.round(mean);
}

/* ── Seeded PRNG for deterministic lineament generation ──── */

/** Mulberry32: seeded 32-bit PRNG — same seed always gives the same sequence */
function createLineamentRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** DJB2 hash of site coordinates → deterministic seed */
function lineamentSeed(lat: number, lon: number, extra: string): number {
  const str = `${lat.toFixed(4)}_${lon.toFixed(4)}_${extra}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/* ── DEM-based Lineament Generation ──────────────────────── */

function generateDEMLineaments(input: FractureAnalysisInput): Lineament[] {
  const lineaments: Lineament[] = [];
  const { latitude, longitude, slope_deg, aspect_deg, drainageDensity, twi } = input;

  // Seeded RNG — same coordinates always produce same lineaments
  const rng = createLineamentRNG(lineamentSeed(latitude, longitude, 'dem'));

  // Use terrain characteristics to infer lineament patterns
  // Higher slope + drainage density = more likely fracture-controlled terrain
  const structuralActivity = (slope_deg ?? 5) / 30 + (drainageDensity ?? 1) / 5;

  // Regional fracture patterns by tectonic setting
  const tectonicPatterns = getTectonicFracturePatterns(latitude, longitude);

  // Generate lineaments based on tectonic patterns + local terrain
  for (const pattern of tectonicPatterns) {
    // Number of lineaments proportional to structural activity (deterministic variation)
    const count = Math.round(pattern.density * (0.5 + structuralActivity) * (1 + rng() * 0.3));

    for (let i = 0; i < count; i++) {
      // Vary azimuth within ±15° of pattern direction (seeded)
      const azimuth = (pattern.azimuth + (rng() - 0.5) * 30 + 180) % 180;
      const length = pattern.avgLength * (0.5 + rng());
      const dist = rng() * 5; // within 5km, deterministic per site

      lineaments.push({
        id: `DEM-${lineaments.length}`,
        azimuth_deg: Math.round(azimuth * 10) / 10,
        length_km: Math.round(length * 100) / 100,
        type: pattern.type,
        confidence: Math.min(0.85, 0.4 + structuralActivity * 0.2 + (twi ?? 5) / 20 * 0.1),
        source: 'DEM',
        distanceFromSite_km: Math.round(dist * 100) / 100,
      });
    }
  }

  return lineaments;
}

/* ── Tectonic Fracture Pattern Library ────────────────────── */

interface TectonicPattern {
  azimuth: number;
  density: number;     // lineaments per km²
  avgLength: number;   // km
  type: Lineament['type'];
}

function getTectonicFracturePatterns(lat: number, lon: number): TectonicPattern[] {
  // East African Rift System
  if (lat >= -15 && lat <= 15 && lon >= 25 && lon <= 45) {
    return [
      { azimuth: 10, density: 3, avgLength: 2.5, type: 'fault' },     // N-S rift faults
      { azimuth: 45, density: 2, avgLength: 1.5, type: 'fracture' },  // NE-SW conjugate
      { azimuth: 135, density: 1.5, avgLength: 1.0, type: 'joint' },  // NW-SE cross-faults
    ];
  }
  // West Africa (craton)
  if (lat >= 0 && lat <= 20 && lon >= -20 && lon <= 5) {
    return [
      { azimuth: 30, density: 1.5, avgLength: 3, type: 'fault' },      // NE-SW Pan-African
      { azimuth: 120, density: 1, avgLength: 2, type: 'fracture' },     // NW-SE
      { azimuth: 0, density: 0.8, avgLength: 1.5, type: 'joint' },      // N-S
    ];
  }
  // Southern Africa (Kaapvaal craton)
  if (lat >= -35 && lat <= -20 && lon >= 15 && lon <= 35) {
    return [
      { azimuth: 45, density: 2, avgLength: 2, type: 'fault' },
      { azimuth: 135, density: 1.5, avgLength: 1.5, type: 'dyke' },    // NW-SE dyke swarms
      { azimuth: 90, density: 1, avgLength: 1, type: 'joint' },         // E-W
    ];
  }
  // Indian subcontinent (Deccan)
  if (lat >= 5 && lat <= 35 && lon >= 65 && lon <= 95) {
    return [
      { azimuth: 10, density: 2, avgLength: 2, type: 'fault' },
      { azimuth: 70, density: 1.5, avgLength: 1.5, type: 'fracture' },
      { azimuth: 160, density: 1, avgLength: 1, type: 'dyke' },
    ];
  }
  // Mediterranean / Middle East
  if (lat >= 30 && lat <= 45 && lon >= -10 && lon <= 50) {
    return [
      { azimuth: 60, density: 2.5, avgLength: 2, type: 'fault' },       // Alpine thrusts
      { azimuth: 150, density: 1.5, avgLength: 1.5, type: 'fracture' },
      { azimuth: 0, density: 1, avgLength: 1, type: 'joint' },
    ];
  }
  // Americas
  if (lon >= -130 && lon <= -30) {
    return [
      { azimuth: 0, density: 1.5, avgLength: 2, type: 'fault' },
      { azimuth: 60, density: 1, avgLength: 1.5, type: 'fracture' },
      { azimuth: 120, density: 1, avgLength: 1, type: 'joint' },
    ];
  }
  // Default global pattern
  return [
    { azimuth: 30, density: 1.5, avgLength: 1.5, type: 'fracture' },
    { azimuth: 120, density: 1, avgLength: 1, type: 'joint' },
    { azimuth: 75, density: 0.8, avgLength: 1, type: 'fault' },
  ];
}

/* ── Intersection Finder ──────────────────────────────────── */

function findIntersections(lineaments: Lineament[], siteLat: number, siteLon: number): FractureIntersection[] {
  const intersections: FractureIntersection[] = [];

  for (let i = 0; i < lineaments.length; i++) {
    for (let j = i + 1; j < lineaments.length; j++) {
      const l1 = lineaments[i];
      const l2 = lineaments[j];

      // Calculate acute angle between lineaments
      let angle = Math.abs(l1.azimuth_deg - l2.azimuth_deg);
      if (angle > 90) angle = 180 - angle;
      if (angle < 10) continue; // nearly parallel, no intersection

      // Proximity: both lineaments must be reasonably close
      const avgDist = (l1.distanceFromSite_km + l2.distanceFromSite_km) / 2;
      if (avgDist > 5) continue;

      // Permeability score: higher angles = better (orthogonal fractures = most permeable)
      // Closer to site = better
      const angleScore = angle / 90;                    // 0-1 (90° = best)
      const proximityScore = 1 - avgDist / 5;           // 0-1 (closer = better)
      const lengthScore = Math.min(1, (l1.length_km + l2.length_km) / 6); // longer = better
      const confScore = (l1.confidence + l2.confidence) / 2;

      const permeabilityScore = angleScore * 0.4 + proximityScore * 0.3 + lengthScore * 0.15 + confScore * 0.15;

      const priority: FractureIntersection['priority'] =
        permeabilityScore > 0.65 ? 'high' : permeabilityScore > 0.4 ? 'medium' : 'low';

      // Approximate intersection location — deterministic from lineament azimuths & distances
      // Use lineament midpoint angles to compute offset direction, no randomness
      const azAvg = ((l1.azimuth_deg + l2.azimuth_deg) / 2) * Math.PI / 180;
      const offsetScale = avgDist / 111;
      const intLat = siteLat + Math.cos(azAvg) * offsetScale * 0.5;
      const intLon = siteLon + Math.sin(azAvg) * offsetScale * 0.5 / Math.cos(siteLat * Math.PI / 180);

      intersections.push({
        latitude: Math.round(intLat * 100000) / 100000,
        longitude: Math.round(intLon * 100000) / 100000,
        lineament1Id: l1.id,
        lineament2Id: l2.id,
        angleBetween_deg: Math.round(angle),
        distanceFromSite_km: Math.round(avgDist * 100) / 100,
        permeabilityScore: Math.round(permeabilityScore * 1000) / 1000,
        priority,
      });
    }
  }

  return intersections.sort((a, b) => b.permeabilityScore - a.permeabilityScore);
}

/* ── Rock-Fracture Permeability Model ─────────────────────── */

interface RockFractureProperties {
  baseFractureAperture_mm: number;
  fractureFrequency: number; // per meter
  matrixPermeability_m_day: number;
  yieldMultiplier: number;
}

function getRockFractureProperties(rockType?: string): RockFractureProperties {
  const rt = (rockType || '').toLowerCase();
  if (rt.includes('granite') || rt.includes('gneiss'))
    return { baseFractureAperture_mm: 0.5, fractureFrequency: 2, matrixPermeability_m_day: 0.0001, yieldMultiplier: 2.0 };
  if (rt.includes('basalt'))
    return { baseFractureAperture_mm: 1.0, fractureFrequency: 5, matrixPermeability_m_day: 0.001, yieldMultiplier: 2.5 };
  if (rt.includes('sandstone'))
    return { baseFractureAperture_mm: 0.3, fractureFrequency: 3, matrixPermeability_m_day: 1.0, yieldMultiplier: 1.3 };
  if (rt.includes('limestone') || rt.includes('dolomite'))
    return { baseFractureAperture_mm: 2.0, fractureFrequency: 4, matrixPermeability_m_day: 0.1, yieldMultiplier: 3.0 }; // karst potential
  if (rt.includes('schist') || rt.includes('phyllite'))
    return { baseFractureAperture_mm: 0.3, fractureFrequency: 6, matrixPermeability_m_day: 0.01, yieldMultiplier: 1.8 };
  if (rt.includes('quartzite'))
    return { baseFractureAperture_mm: 0.4, fractureFrequency: 3, matrixPermeability_m_day: 0.001, yieldMultiplier: 2.2 };
  if (rt.includes('shale') || rt.includes('mudstone'))
    return { baseFractureAperture_mm: 0.1, fractureFrequency: 8, matrixPermeability_m_day: 0.00001, yieldMultiplier: 1.2 };
  if (rt.includes('laterite'))
    return { baseFractureAperture_mm: 0.2, fractureFrequency: 1, matrixPermeability_m_day: 0.5, yieldMultiplier: 1.1 };
  // Default (mixed/unknown)
  return { baseFractureAperture_mm: 0.5, fractureFrequency: 3, matrixPermeability_m_day: 0.01, yieldMultiplier: 1.5 };
}

/* ── Depth-Dependent Aperture Model (Snow 1968, Oda 1985) ── */

function computeDepthApertureProfile(
  rockProps: RockFractureProperties,
  maxDepth_m: number,
): { depth_m: number; aperture_mm: number; permeability_m2: number }[] {
  const profile: { depth_m: number; aperture_mm: number; permeability_m2: number }[] = [];
  const baseAperture = rockProps.baseFractureAperture_mm;

  // Aperture decreases exponentially with depth due to lithostatic stress
  // b(z) = b0 * exp(-λz)  where λ depends on rock stiffness
  const lambda = rockProps.matrixPermeability_m_day > 0.1 ? 0.02 : 0.015; // softer rock closes faster

  for (let z = 5; z <= maxDepth_m; z += 5) {
    const aperture = baseAperture * Math.exp(-lambda * z);
    // Cubic law: k = (b²) / 12  where b is aperture in meters
    const b_m = aperture / 1000;
    const permeability = (b_m * b_m) / 12 * rockProps.fractureFrequency;
    profile.push({
      depth_m: z,
      aperture_mm: Math.round(aperture * 1000) / 1000,
      permeability_m2: parseFloat(permeability.toExponential(2)),
    });
  }
  return profile;
}

/* ── Fracture Network Connectivity (Percolation Theory) ─── */

function analyzeFractureConnectivity(
  lineaments: Lineament[],
  intersections: FractureIntersection[],
  rockProps: RockFractureProperties,
): FractureAnalysisResult['fractureConnectivity'] {
  const n = lineaments.length;

  // Build adjacency from intersections
  const adj = new Map<string, Set<string>>();
  for (const l of lineaments) adj.set(l.id, new Set());
  for (const ix of intersections) {
    adj.get(ix.lineament1Id)?.add(ix.lineament2Id);
    adj.get(ix.lineament2Id)?.add(ix.lineament1Id);
  }

  // Count connected components (BFS)
  const visited = new Set<string>();
  let clusterCount = 0;
  let largestCluster = 0;
  for (const l of lineaments) {
    if (visited.has(l.id)) continue;
    clusterCount++;
    let size = 0;
    const queue = [l.id];
    while (queue.length > 0) {
      const id = queue.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      size++;
      for (const neighbor of adj.get(id) ?? []) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
    if (size > largestCluster) largestCluster = size;
  }

  // Network density = actual connections / max possible
  const maxConnections = n > 1 ? n * (n - 1) / 2 : 1;
  const networkDensity = Math.min(1, intersections.length / maxConnections);

  // Longest path estimate (from largest cluster total lineament length)
  const largestClusterLength = lineaments
    .filter(l => visited.has(l.id))
    .reduce((sum, l) => sum + l.length_km, 0);
  const longestPath = largestClusterLength * 0.6; // ~60% of total = connected path

  // Percolation threshold: connected network exists if largest cluster > 50% of total
  const percolation = largestCluster > n * 0.5 && intersections.length > n * 0.8;

  // Effective transmissivity (m²/day) from connected fracture network
  const avgAperture_m = rockProps.baseFractureAperture_mm / 1000;
  const T = (avgAperture_m ** 3 * 9810) / (12 * 0.001) * rockProps.fractureFrequency * (percolation ? 1.5 : 0.3);

  return {
    networkDensity: Math.round(networkDensity * 1000) / 1000,
    longestPathKm: Math.round(longestPath * 100) / 100,
    clusterCount,
    percolationThreshold: percolation,
    effectiveTransmissivity_m2d: Math.round(T * 100) / 100,
  };
}

/* ── Regional Stress Field Estimation ─────────────────────── */

function estimateStressField(lat: number, lon: number, lineaments: Lineament[]): FractureAnalysisResult['stressField'] {
  // Estimate SHmax from World Stress Map regional patterns
  let shmax = 0;
  if (lat >= -15 && lat <= 15 && lon >= 25 && lon <= 45) shmax = 100;  // E Africa: ~E-W extension → N-S SHmax
  else if (lat >= 0 && lat <= 20 && lon >= -20 && lon <= 5) shmax = 30; // W Africa: NE-SW
  else if (lat >= -35 && lat <= -20 && lon >= 15 && lon <= 35) shmax = 60; // S Africa: ENE-WSW
  else if (lat >= 5 && lat <= 35 && lon >= 65 && lon <= 95) shmax = 10; // India: N-S (collision)
  else if (lat >= 30 && lat <= 45 && lon >= -10 && lon <= 50) shmax = 150; // Mediterranean: NNW-SSE
  else shmax = 45; // default NE-SW

  // Open fractures are perpendicular (±30°) to SHmax
  const openAzimuths = lineaments
    .filter(l => {
      let diff = Math.abs(l.azimuth_deg - (shmax + 90) % 180);
      if (diff > 90) diff = 180 - diff;
      return diff < 30;
    })
    .map(l => l.azimuth_deg);

  // Critically stressed: fractures at 30° to SHmax (Mohr-Coulomb)
  const criticalCount = lineaments.filter(l => {
    let diff = Math.abs(l.azimuth_deg - (shmax + 30) % 180);
    if (diff > 90) diff = 180 - diff;
    return diff < 15;
  }).length;

  return {
    maxHorizontalStress_deg: shmax,
    openFractureAzimuths: [...new Set(openAzimuths.map(a => Math.round(a / 5) * 5))],
    criticallyStressed: criticalCount >= 2,
  };
}

/* ── Main Analysis Function ───────────────────────────────── */

export function analyzeFracturesAndLineaments(input: FractureAnalysisInput): FractureAnalysisResult {
  const diagnostics: string[] = [];

  // 1. Generate lineaments from DEM/terrain
  let lineaments = generateDEMLineaments(input);
  diagnostics.push(`DEM analysis: ${lineaments.length} lineaments modelled (inferred from DEM morphometry and tectonic pattern library — not field-detected)`);

  // 2. If existing lineament analysis available (from advancedHydroEngine), merge
  if (input.existingLineaments) {
    const el = input.existingLineaments;
    // Add the dominant lineament direction as a high-confidence lineament
    lineaments.push({
      id: 'HYDRO-main',
      azimuth_deg: el.dominantDirection_deg,
      length_km: 3,
      type: 'fault',
      confidence: 0.8,
      source: 'satellite',
      distanceFromSite_km: el.fractureZoneProximity_m / 1000,
    });
    diagnostics.push(`Satellite lineament data: density=${el.lineamentDensity}, dominant=${el.dominantDirection_deg}°`);
  }

  // 3. If magnetic anomaly detected, add fault lineament
  if (input.magneticAnomalyDetected && input.faultAzimuth_deg != null) {
    lineaments.push({
      id: 'MAG-fault',
      azimuth_deg: input.faultAzimuth_deg,
      length_km: 5,
      type: 'fault',
      confidence: 0.85,
      source: 'magnetic',
      distanceFromSite_km: 0.5,
    });
    diagnostics.push(`Magnetic fault detected: azimuth=${input.faultAzimuth_deg}°`);
  }

  // 4. If seismic fracture detected, boost confidence
  if (input.seismicFractureDepth_m != null) {
    diagnostics.push(`Seismic fracture zone: ${input.seismicFractureDepth_m}m depth, ${input.seismicFractureThickness_m ?? '?'}m thick`);
  }

  // 5. Find intersections
  const allIntersections = findIntersections(lineaments, input.latitude, input.longitude);
  const topIntersections = allIntersections.slice(0, 5);
  diagnostics.push(`Fracture intersections: ${allIntersections.length} total, ${topIntersections.filter(i => i.priority === 'high').length} high-priority`);

  // 6. Rose histogram
  const roseHistogram = buildRoseHistogram(lineaments);
  const domOrientation = dominantOrientation(lineaments);

  // 7. Scores
  const lineamentDensity = lineaments.length / 25; // per 5×5 km area
  const fractureDensityScore = Math.min(100, lineamentDensity * 15);

  const highPriorityCount = allIntersections.filter(i => i.priority === 'high').length;
  const intersectionPriorityScore = Math.min(100, highPriorityCount * 20 + allIntersections.length * 3);

  const rockProps = getRockFractureProperties(input.rockType);
  // Cubic law: Q ∝ aperture³
  const apertureScore = Math.min(100, rockProps.baseFractureAperture_mm * 50);
  const frequencyScore = Math.min(100, rockProps.fractureFrequency * 10);
  const permeabilityScore = Math.min(100, (apertureScore * 0.6 + frequencyScore * 0.4));

  const overallFractureScore = Math.round(
    fractureDensityScore * 0.50 +
    intersectionPriorityScore * 0.20 +
    permeabilityScore * 0.20 +
    (input.seismicFractureDepth_m != null ? 10 : 0) // bonus for field confirmation
  );

  // Physical constraint: low fracture density caps the overall score
  // (intersections mean nothing if actual fractures are sparse)
  const cappedFractureScore = fractureDensityScore < 10
    ? Math.min(overallFractureScore, 30)
    : overallFractureScore;

  // 8. Permeability classification
  const permeabilityClass: FractureAnalysisResult['estimatedFracturePermeability'] =
    cappedFractureScore >= 80 ? 'very_high'
    : cappedFractureScore >= 60 ? 'high'
    : cappedFractureScore >= 40 ? 'moderate'
    : cappedFractureScore >= 20 ? 'low'
    : 'very_low';

  // 9. Yield multiplier (how much fractures boost expected yield)
  const yieldMult = 1 + (cappedFractureScore / 100) * (rockProps.yieldMultiplier - 1);

  // 10. Preferred drilling azimuth: perpendicular to dominant fracture direction
  const preferredAzimuth = (domOrientation + 90) % 180;

  // 11. Fracture aquifer likelihood
  const fractureAqLikelihood = Math.min(1, cappedFractureScore / 80 * (input.seismicFractureDepth_m != null ? 1.2 : 1));

  // 12. Structural complexity
  const orientationSpread = lineaments.length > 0
    ? new Set(lineaments.map(l => Math.round(l.azimuth_deg / 30))).size
    : 1;
  const structuralComplexity: FractureAnalysisResult['structuralComplexity'] =
    orientationSpread >= 5 ? 'very_complex'
    : orientationSpread >= 4 ? 'complex'
    : orientationSpread >= 2 ? 'moderate'
    : 'simple';

  // 13. Collapse risk
  const collapsRisk: FractureAnalysisResult['collapsRisk'] =
    rockProps.baseFractureAperture_mm > 1.5 && rockProps.fractureFrequency > 5 ? 'high'
    : rockProps.baseFractureAperture_mm > 0.5 && rockProps.fractureFrequency > 3 ? 'moderate'
    : 'low';

  // Overall confidence
  const confidence = Math.min(0.95, 0.4 +
    (input.existingLineaments ? 0.15 : 0) +
    (input.magneticAnomalyDetected ? 0.1 : 0) +
    (input.seismicFractureDepth_m != null ? 0.15 : 0) +
    (lineaments.length > 5 ? 0.1 : lineaments.length > 2 ? 0.05 : 0));

  // Phase 8: Advanced Fracture Intelligence
  const depthApertureProfile = computeDepthApertureProfile(rockProps, 100);
  const connectivity = analyzeFractureConnectivity(lineaments, allIntersections, rockProps);
  const stressField = estimateStressField(input.latitude, input.longitude, lineaments);

  diagnostics.push(`Fracture connectivity: density=${connectivity.networkDensity}, clusters=${connectivity.clusterCount}, percolation=${connectivity.percolationThreshold}`);
  diagnostics.push(`Stress field: SHmax=${stressField.maxHorizontalStress_deg}°, ${stressField.openFractureAzimuths.length} open directions, critical=${stressField.criticallyStressed}`);

  // Anisotropy ratio: ratio of max to min directional permeability
  const dirPerms = roseHistogram.map(b => b.count * rockProps.baseFractureAperture_mm);
  const maxPerm = Math.max(...dirPerms, 1);
  const minPerm = Math.max(...dirPerms.filter(p => p > 0), 0.1) === maxPerm ? maxPerm : Math.min(...dirPerms.filter(p => p > 0), maxPerm);
  const anisotropyRatio = Math.round((maxPerm / Math.max(0.01, minPerm)) * 10) / 10;

  return {
    lineaments,
    totalLineamentCount: lineaments.length,
    lineamentDensity_km_per_km2: Math.round(lineamentDensity * 100) / 100,
    dominantOrientation_deg: domOrientation,
    roseHistogram,
    intersections: allIntersections,
    topIntersections,
    fractureDensityScore: Math.round(fractureDensityScore),
    intersectionPriorityScore: Math.round(intersectionPriorityScore),
    permeabilityScore: Math.round(permeabilityScore),
    overallFractureScore: cappedFractureScore,
    estimatedFracturePermeability: permeabilityClass,
    yieldMultiplier: Math.round(yieldMult * 100) / 100,
    preferredDrillingAzimuth_deg: Math.round(preferredAzimuth),
    fractureAquiferLikelihood: Math.round(fractureAqLikelihood * 1000) / 1000,
    depthApertureProfile,
    fractureConnectivity: connectivity,
    stressField,
    anisotropyRatio,
    structuralComplexity,
    collapsRisk,
    diagnostics,
    methodology: 'DEM morphometric analysis + tectonic pattern library + structural intersection ranking (Sander 2007) + depth-aperture decay (Snow 1968) + fracture connectivity (percolation theory) + stress field analysis',
    confidence,
  };
}
