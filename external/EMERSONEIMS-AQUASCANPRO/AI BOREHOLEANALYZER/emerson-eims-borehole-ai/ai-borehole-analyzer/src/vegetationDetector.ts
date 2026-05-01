/**
 * VEGETATION & PHREATOPHYTE DETECTOR
 * ───────────────────────────────────
 * Identifies vegetation types from images and determines if they indicate
 * shallow groundwater (phreatophytes = deep-rooted plants that tap water table).
 *
 * 100% real — combines pixel-level vegetation indices with MobileNet classification
 * against a comprehensive botanical database of groundwater indicator species.
 *
 * Science basis:
 *   • Excess Green Index (ExG): 2G - R - B (Woebbecke et al. 1995)
 *   • Green-Red Vegetation Index (GRVI): (G - R) / (G + R)
 *   • Canopy density from green pixel fraction
 *   • Phreatophyte indicator species (Meinzer 1927; Robinson 1958; USGS)
 *   • Vegetation vigor as groundwater proxy (Münch & Conrad 2007)
 */

// ═══════════════════════════════════════════════════════════════
// PHREATOPHYTE DATABASE
// ═══════════════════════════════════════════════════════════════

export interface PhreatophyteEntry {
  /** Common name */
  name: string;
  /** Scientific name */
  scientific: string;
  /** Visual features detectable from images */
  visualFeatures: string[];
  /** MobileNet labels that may match */
  mobilenetLabels: string[];
  /** Color signature (dominant RGB range) */
  colorSignature: { rRange: [number, number]; gRange: [number, number]; bRange: [number, number] };
  /** Groundwater depth indicator */
  waterDepthRange_m: [number, number];
  /** Confidence that this species indicates water */
  gwConfidence: number;
  /** Geographic distribution */
  regions: string[];
  /** Habitat description */
  habitat: string;
}

const PHREATOPHYTE_DATABASE: PhreatophyteEntry[] = [
  // ── HIGH CONFIDENCE INDICATORS ──
  {
    name: 'Papyrus / Bulrushes',
    scientific: 'Cyperus papyrus',
    visualFeatures: ['tall reed-like plants', 'feathery tops', 'dense green stands near water', 'marshland'],
    mobilenetLabels: ['lakeside', 'marsh', 'swamp', 'bulrush'],
    colorSignature: { rRange: [40, 120], gRange: [100, 200], bRange: [30, 100] },
    waterDepthRange_m: [0, 2],
    gwConfidence: 0.95,
    regions: ['Africa', 'Mediterranean', 'Tropical'],
    habitat: 'Permanent swamps, lake margins, river banks — roots in standing water',
  },
  {
    name: 'Cattail / Typha',
    scientific: 'Typha latifolia',
    visualFeatures: ['tall narrow leaves', 'brown cylindrical seed heads', 'dense stands in shallow water'],
    mobilenetLabels: ['marsh', 'swamp', 'lakeside', 'pond'],
    colorSignature: { rRange: [50, 130], gRange: [90, 180], bRange: [30, 90] },
    waterDepthRange_m: [0, 1.5],
    gwConfidence: 0.95,
    regions: ['Global', 'Wetlands'],
    habitat: 'Shallow standing water, marshes, lake edges — obligate wetland species',
  },
  {
    name: 'Willow',
    scientific: 'Salix spp.',
    visualFeatures: ['drooping branches', 'narrow leaves', 'growing near streams', 'light green foliage'],
    mobilenetLabels: ['willow', 'tree', 'riverbank', 'park'],
    colorSignature: { rRange: [60, 140], gRange: [110, 200], bRange: [40, 110] },
    waterDepthRange_m: [0, 5],
    gwConfidence: 0.90,
    regions: ['Global temperate', 'Riparian zones'],
    habitat: 'River banks, stream sides, floodplains — roots penetrate to water table',
  },
  {
    name: 'Acacia (Fever Tree)',
    scientific: 'Vachellia xanthophloea',
    visualFeatures: ['yellow-green bark', 'flat canopy', 'thorns visible', 'savanna setting'],
    mobilenetLabels: ['acacia', 'savanna', 'tree', 'african'],
    colorSignature: { rRange: [80, 160], gRange: [120, 190], bRange: [40, 100] },
    waterDepthRange_m: [0, 15],
    gwConfidence: 0.90,
    regions: ['East Africa', 'Southern Africa', 'Sub-Saharan'],
    habitat: 'Near rivers, seasonal pans, shallow water tables — the "fever tree" always indicates water',
  },
  {
    name: 'Fig Tree (Strangler Fig)',
    scientific: 'Ficus spp.',
    visualFeatures: ['large spreading canopy', 'thick trunk', 'aerial roots', 'evergreen in dry season'],
    mobilenetLabels: ['fig', 'tree', 'banyan', 'tropical'],
    colorSignature: { rRange: [30, 100], gRange: [80, 170], bRange: [20, 80] },
    waterDepthRange_m: [0, 20],
    gwConfidence: 0.85,
    regions: ['Tropical', 'Subtropical', 'Global'],
    habitat: 'Often marks springs, shallow aquifers — roots seek water to great depth',
  },
  {
    name: 'Date Palm',
    scientific: 'Phoenix dactylifera',
    visualFeatures: ['tall single trunk', 'feather-like fronds at top', 'oasis setting', 'arid landscape'],
    mobilenetLabels: ['palm', 'date palm', 'oasis', 'coconut palm'],
    colorSignature: { rRange: [50, 130], gRange: [90, 170], bRange: [30, 80] },
    waterDepthRange_m: [1, 20],
    gwConfidence: 0.92,
    regions: ['North Africa', 'Middle East', 'Arid'],
    habitat: 'Oases, wadis — classic desert water indicator, roots reach 20m+ depth',
  },
  {
    name: 'Eucalyptus',
    scientific: 'Eucalyptus spp.',
    visualFeatures: ['peeling bark', 'narrow hanging leaves', 'tall straight trunk', 'grey-green foliage'],
    mobilenetLabels: ['eucalyptus', 'gum tree', 'tree'],
    colorSignature: { rRange: [70, 150], gRange: [100, 170], bRange: [50, 120] },
    waterDepthRange_m: [2, 30],
    gwConfidence: 0.80,
    regions: ['Australia', 'Global planted'],
    habitat: 'Can access very deep water tables — known to dry out shallow aquifers',
  },
  // ── MODERATE CONFIDENCE INDICATORS ──
  {
    name: 'Reeds / Phragmites',
    scientific: 'Phragmites australis',
    visualFeatures: ['tall grass-like stands', 'feathery plume tops', 'wetland margins', 'reed beds'],
    mobilenetLabels: ['marsh', 'grassland', 'reed', 'wetland'],
    colorSignature: { rRange: [80, 160], gRange: [120, 200], bRange: [50, 120] },
    waterDepthRange_m: [0, 3],
    gwConfidence: 0.90,
    regions: ['Global wetlands'],
    habitat: 'Shallow water, wet ground, seasonal wetlands — indicates water within 0-3m',
  },
  {
    name: 'Tamarisk / Saltcedar',
    scientific: 'Tamarix spp.',
    visualFeatures: ['feathery foliage', 'small pink flowers', 'shrub/small tree', 'desert/riverside'],
    mobilenetLabels: ['shrub', 'bush', 'desert vegetation', 'tree'],
    colorSignature: { rRange: [80, 160], gRange: [100, 170], bRange: [60, 130] },
    waterDepthRange_m: [1, 15],
    gwConfidence: 0.85,
    regions: ['Arid', 'Middle East', 'North Africa', 'SW USA'],
    habitat: 'Desert rivers, saline flats — deep-rooted phreatophyte tapping saline water',
  },
  {
    name: 'Mesquite',
    scientific: 'Prosopis spp.',
    visualFeatures: ['thorny shrub/tree', 'small compound leaves', 'bean-like pods', 'arid landscape'],
    mobilenetLabels: ['desert', 'shrub', 'tree', 'mesquite'],
    colorSignature: { rRange: [70, 150], gRange: [100, 170], bRange: [40, 100] },
    waterDepthRange_m: [3, 50],
    gwConfidence: 0.85,
    regions: ['Arid Americas', 'East Africa', 'Sahel'],
    habitat: 'Desert/semi-arid — roots documented to 50m depth, strong water indicator in arid zones',
  },
  {
    name: 'Baobab',
    scientific: 'Adansonia digitata',
    visualFeatures: ['massive trunk', 'bulbous shape', 'few branches at top', 'deciduous'],
    mobilenetLabels: ['baobab', 'tree', 'african'],
    colorSignature: { rRange: [80, 160], gRange: [90, 160], bRange: [60, 120] },
    waterDepthRange_m: [5, 30],
    gwConfidence: 0.70,
    regions: ['Africa', 'Madagascar', 'Australia'],
    habitat: 'Savanna/semi-arid — stores water in trunk, can indicate deeper water sources',
  },
  {
    name: 'Mango Tree',
    scientific: 'Mangifera indica',
    visualFeatures: ['large dense canopy', 'dark green leaves', 'evergreen', 'fruit visible'],
    mobilenetLabels: ['mango', 'tree', 'tropical', 'fruit tree'],
    colorSignature: { rRange: [20, 80], gRange: [60, 150], bRange: [10, 60] },
    waterDepthRange_m: [2, 15],
    gwConfidence: 0.70,
    regions: ['Tropical', 'Subtropical'],
    habitat: 'Deep-rooted fruit tree — thrives where shallow groundwater available',
  },
  // ── VEGETATION COVER TYPES (general) ──
  {
    name: 'Dense Green Vegetation (riparian)',
    scientific: 'Mixed riparian species',
    visualFeatures: ['lush green corridor', 'follows drainage line', 'denser than surroundings', 'linear pattern'],
    mobilenetLabels: ['forest', 'jungle', 'vegetation', 'rainforest'],
    colorSignature: { rRange: [20, 80], gRange: [80, 180], bRange: [10, 60] },
    waterDepthRange_m: [0, 10],
    gwConfidence: 0.80,
    regions: ['Global'],
    habitat: 'Riparian corridors — lush vegetation following water courses/shallow water table',
  },
  {
    name: 'Green Patch in Dry Landscape',
    scientific: 'Phreatophytic assemblage',
    visualFeatures: ['green area surrounded by brown/dry land', 'isolated lush vegetation', 'spring-fed'],
    mobilenetLabels: ['oasis', 'garden', 'park', 'grassland'],
    colorSignature: { rRange: [40, 120], gRange: [100, 200], bRange: [30, 90] },
    waterDepthRange_m: [0, 5],
    gwConfidence: 0.90,
    regions: ['Arid', 'Semi-arid', 'Global'],
    habitat: 'Classic spring/seep indicator — green islands in dry terrain mark shallow water',
  },
  {
    name: 'Algal Mat / Green Surface',
    scientific: 'Cyanobacteria / algae',
    visualFeatures: ['green film on soil', 'wet appearance', 'dark green patches on ground'],
    mobilenetLabels: ['moss', 'algae', 'wet ground'],
    colorSignature: { rRange: [20, 80], gRange: [60, 130], bRange: [20, 70] },
    waterDepthRange_m: [0, 1],
    gwConfidence: 0.95,
    regions: ['Global'],
    habitat: 'Surface moisture indicator — algal growth requires persistent dampness/seepage',
  },
];

// ═══════════════════════════════════════════════════════════════
// VEGETATION ANALYSIS TYPES
// ═══════════════════════════════════════════════════════════════

export interface VegetationPixelStats {
  /** Fraction of image that is vegetation (0-1) */
  vegetationCover: number;
  /** Average Excess Green index for vegetation pixels */
  avgExG: number;
  /** Average Green-Red Vegetation Index */
  avgGRVI: number;
  /** Vegetation vigor classification */
  vigor: 'Lush' | 'Healthy' | 'Moderate' | 'Stressed' | 'Sparse' | 'None';
  /** Is there a green-in-dry pattern? (strong water indicator) */
  greenInDryPattern: boolean;
  /** Vegetation spatial distribution */
  distribution: 'Uniform' | 'Riparian corridor' | 'Isolated patches' | 'Clustered' | 'Sparse scattered';
}

export interface VegetationDetectionResult {
  /** Pixel-level vegetation statistics */
  pixelStats: VegetationPixelStats;
  /** Identified phreatophyte indicators */
  phreatophytes: {
    species: string;
    scientific: string;
    matchConfidence: number;
    matchedBy: string;
    waterDepthRange_m: [number, number];
    gwConfidence: number;
    habitat: string;
  }[];
  /** Overall groundwater assessment from vegetation */
  groundwaterAssessment: {
    likelihood: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
    estimatedDepthRange_m: [number, number];
    confidence: number;
    reasoning: string[];
    vegetationEvidence: string[];
  };
  /** MobileNet scene classification labels */
  sceneLabels: { label: string; probability: number }[];
  /** Vegetation zones detected in the image */
  zones: {
    region: string;
    coverPercent: number;
    vigor: string;
    waterIndicator: boolean;
  }[];
}

// ═══════════════════════════════════════════════════════════════
// PIXEL-LEVEL VEGETATION ANALYSIS
// ═══════════════════════════════════════════════════════════════

/**
 * Analyze vegetation coverage and vigor from image pixels.
 * Uses ExG (Excess Green) and GRVI (Green-Red Vegetation Index).
 */
export function analyzeVegetationPixels(
  imageElement: HTMLImageElement | HTMLCanvasElement,
): VegetationPixelStats {
  const canvas = document.createElement('canvas');
  const W = 512, H = 512;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageElement, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  let vegPixels = 0;
  let totalExG = 0;
  let totalGRVI = 0;
  let totalPixels = 0;
  // Quadrant analysis for spatial distribution
  const quadVeg = [0, 0, 0, 0]; // TL, TR, BL, BR
  const quadTotal = [0, 0, 0, 0];
  // Row analysis for riparian detection
  const rowVegFraction: number[] = [];

  for (let row = 0; row < H; row++) {
    let rowVeg = 0;
    for (let col = 0; col < W; col++) {
      const i = (row * W + col) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const avg = (r + g + b) / 3;
      if (avg < 10 || avg > 250) continue; // skip black/white

      totalPixels++;
      const quadIdx = (row < H / 2 ? 0 : 2) + (col < W / 2 ? 0 : 1);
      quadTotal[quadIdx]++;

      // ExG = 2G - R - B (normalized)
      const sum = r + g + b || 1;
      const exG = (2 * g - r - b) / sum * 255;
      // GRVI = (G - R) / (G + R)
      const grvi = (g + r) > 0 ? (g - r) / (g + r) : 0;

      if (exG > 20 && grvi > 0.05 && g > r && g > b) {
        vegPixels++;
        rowVeg++;
        totalExG += exG;
        totalGRVI += grvi;
        quadVeg[quadIdx]++;
      }
    }
    rowVegFraction.push(totalPixels > 0 ? rowVeg / W : 0);
  }

  const vegCover = totalPixels > 0 ? vegPixels / totalPixels : 0;
  const avgExG = vegPixels > 0 ? totalExG / vegPixels : 0;
  const avgGRVI = vegPixels > 0 ? totalGRVI / vegPixels : 0;

  // Vigor classification
  let vigor: VegetationPixelStats['vigor'] = 'None';
  if (vegCover > 0.60 && avgExG > 60) vigor = 'Lush';
  else if (vegCover > 0.40 && avgExG > 40) vigor = 'Healthy';
  else if (vegCover > 0.25 && avgExG > 25) vigor = 'Moderate';
  else if (vegCover > 0.10) vigor = 'Stressed';
  else if (vegCover > 0.02) vigor = 'Sparse';

  // Green-in-dry pattern: check if green is concentrated in a band (riparian)
  // or isolated patch (spring) rather than uniform
  const quadFractions = quadVeg.map((v, i) => quadTotal[i] > 0 ? v / quadTotal[i] : 0);
  const maxQuadFrac = Math.max(...quadFractions);
  const minQuadFrac = Math.min(...quadFractions);
  const greenInDry = vegCover > 0.05 && vegCover < 0.50 && (maxQuadFrac - minQuadFrac > 0.20);

  // Spatial distribution
  let distribution: VegetationPixelStats['distribution'] = 'Uniform';
  const variance = quadFractions.reduce((s, f) => s + (f - vegCover) ** 2, 0) / 4;
  // Check for linear (riparian) pattern: middle rows green, edges dry
  const midRowAvg = rowVegFraction.slice(Math.floor(H * 0.3), Math.floor(H * 0.7))
    .reduce((a, b) => a + b, 0) / (H * 0.4);
  const edgeRowAvg = [...rowVegFraction.slice(0, Math.floor(H * 0.2)), ...rowVegFraction.slice(Math.floor(H * 0.8))]
    .reduce((a, b) => a + b, 0) / (H * 0.4) || 0;

  if (vegCover < 0.05) distribution = 'Sparse scattered';
  else if (midRowAvg > edgeRowAvg * 2.5 && vegCover < 0.6) distribution = 'Riparian corridor';
  else if (variance > 0.02 && greenInDry) distribution = 'Isolated patches';
  else if (variance > 0.01) distribution = 'Clustered';
  else distribution = 'Uniform';

  return {
    vegetationCover: Math.round(vegCover * 1000) / 1000,
    avgExG: Math.round(avgExG * 10) / 10,
    avgGRVI: Math.round(avgGRVI * 1000) / 1000,
    vigor,
    greenInDryPattern: greenInDry,
    distribution,
  };
}

// ═══════════════════════════════════════════════════════════════
// PHREATOPHYTE MATCHING
// ═══════════════════════════════════════════════════════════════

/**
 * Match MobileNet scene labels against phreatophyte database.
 */
function matchPhreatophytesFromLabels(
  labels: { className: string; probability: number }[],
  pixelStats: VegetationPixelStats,
): VegetationDetectionResult['phreatophytes'] {
  const matches: VegetationDetectionResult['phreatophytes'] = [];

  for (const entry of PHREATOPHYTE_DATABASE) {
    let bestLabelMatch = 0;
    let matchSource = '';

    // Check MobileNet label matches
    for (const label of labels) {
      const labelLower = label.className.toLowerCase();
      for (const target of entry.mobilenetLabels) {
        if (labelLower.includes(target) || target.includes(labelLower)) {
          const score = label.probability * 0.8;
          if (score > bestLabelMatch) {
            bestLabelMatch = score;
            matchSource = `MobileNet: "${label.className}" (${(label.probability * 100).toFixed(0)}%)`;
          }
        }
      }
    }

    // Check visual feature keywords in labels
    for (const label of labels) {
      for (const feature of entry.visualFeatures) {
        const featureWords = feature.toLowerCase().split(/\s+/);
        const labelWords = label.className.toLowerCase().split(/[\s,_]+/);
        const overlap = featureWords.filter(w => labelWords.some(lw => lw.includes(w) || w.includes(lw)));
        if (overlap.length >= 2) {
          const score = label.probability * 0.6;
          if (score > bestLabelMatch) {
            bestLabelMatch = score;
            matchSource = `Visual feature: "${feature}" matched "${label.className}"`;
          }
        }
      }
    }

    // Boost for spatial patterns
    if (entry.name.includes('Green Patch') && pixelStats.greenInDryPattern) {
      const score = 0.75;
      if (score > bestLabelMatch) {
        bestLabelMatch = score;
        matchSource = 'Green-in-dry spatial pattern detected';
      }
    }
    if (entry.name.includes('riparian') && pixelStats.distribution === 'Riparian corridor') {
      const score = 0.70;
      if (score > bestLabelMatch) {
        bestLabelMatch = score;
        matchSource = 'Riparian corridor distribution pattern';
      }
    }
    if (entry.name.includes('Algal') && pixelStats.vigor === 'Lush' && pixelStats.vegetationCover < 0.3) {
      const score = 0.60;
      if (score > bestLabelMatch) {
        bestLabelMatch = score;
        matchSource = 'Low-cover lush vegetation (potential surface moisture)';
      }
    }

    if (bestLabelMatch > 0.15) {
      matches.push({
        species: entry.name,
        scientific: entry.scientific,
        matchConfidence: Math.round(bestLabelMatch * 100) / 100,
        matchedBy: matchSource,
        waterDepthRange_m: entry.waterDepthRange_m,
        gwConfidence: entry.gwConfidence,
        habitat: entry.habitat,
      });
    }
  }

  return matches.sort((a, b) => b.matchConfidence - a.matchConfidence);
}

/**
 * Match vegetation by color signature (when MobileNet labels are insufficient).
 */
function matchPhreatophytesByColor(
  dominantColors: { rgb: [number, number, number]; percentage: number }[],
  pixelStats: VegetationPixelStats,
): VegetationDetectionResult['phreatophytes'] {
  const matches: VegetationDetectionResult['phreatophytes'] = [];

  for (const entry of PHREATOPHYTE_DATABASE) {
    for (const dc of dominantColors) {
      const [r, g, b] = dc.rgb;
      const sig = entry.colorSignature;
      if (
        r >= sig.rRange[0] && r <= sig.rRange[1] &&
        g >= sig.gRange[0] && g <= sig.gRange[1] &&
        b >= sig.bRange[0] && b <= sig.bRange[1]
      ) {
        // Check if the green is actually vegetation (not just green paint/etc)
        if (g > r && g > b && pixelStats.vegetationCover > 0.05) {
          const conf = 0.3 + dc.percentage / 200; // max ~0.8
          matches.push({
            species: entry.name,
            scientific: entry.scientific,
            matchConfidence: Math.min(0.60, Math.round(conf * 100) / 100),
            matchedBy: `Color signature match (${dc.percentage}% coverage)`,
            waterDepthRange_m: entry.waterDepthRange_m,
            gwConfidence: entry.gwConfidence,
            habitat: entry.habitat,
          });
        }
      }
    }
  }

  // Deduplicate by species
  const seen = new Set<string>();
  return matches.filter(m => {
    if (seen.has(m.species)) return false;
    seen.add(m.species);
    return true;
  }).sort((a, b) => b.matchConfidence - a.matchConfidence);
}

// ═══════════════════════════════════════════════════════════════
// MAIN VEGETATION DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Full vegetation and phreatophyte analysis from an image.
 *
 * @param imageElement - The uploaded image
 * @param mobilenetLabels - Classification labels from TensorFlow.js MobileNet
 * @param dominantColors - From soil color engine (non-vegetation colors)
 */
export function detectVegetationAndPhreatophytes(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  mobilenetLabels: { className: string; probability: number }[],
  dominantColors?: { rgb: [number, number, number]; percentage: number }[],
): VegetationDetectionResult {
  // Step 1: Pixel-level vegetation analysis
  const pixelStats = analyzeVegetationPixels(imageElement);

  // Step 2: Match phreatophytes from MobileNet labels
  const labelMatches = matchPhreatophytesFromLabels(
    mobilenetLabels.map(l => ({ ...l })),
    pixelStats,
  );

  // Step 3: Color-based matching (supplement label matches)
  const colorMatches = dominantColors
    ? matchPhreatophytesByColor(dominantColors, pixelStats)
    : [];

  // Merge matches, preferring label-based
  const seenSpecies = new Set(labelMatches.map(m => m.species));
  const allMatches = [
    ...labelMatches,
    ...colorMatches.filter(m => !seenSpecies.has(m.species)),
  ];

  // Step 4: Generate zones
  const zones: VegetationDetectionResult['zones'] = [];
  if (pixelStats.vegetationCover > 0.05) {
    zones.push({
      region: pixelStats.distribution === 'Riparian corridor' ? 'Central riparian band'
        : pixelStats.distribution === 'Isolated patches' ? 'Isolated green patches'
        : 'General vegetation cover',
      coverPercent: Math.round(pixelStats.vegetationCover * 100),
      vigor: pixelStats.vigor,
      waterIndicator: pixelStats.greenInDryPattern || pixelStats.distribution === 'Riparian corridor',
    });
  }
  if (1 - pixelStats.vegetationCover > 0.10) {
    zones.push({
      region: 'Exposed soil/rock area',
      coverPercent: Math.round((1 - pixelStats.vegetationCover) * 100),
      vigor: 'N/A',
      waterIndicator: false,
    });
  }

  // Step 5: Overall groundwater assessment
  const reasoning: string[] = [];
  const evidence: string[] = [];
  let gwScore = 0;
  let depthMin = 100, depthMax = 0;

  // Pixel evidence
  if (pixelStats.greenInDryPattern) {
    gwScore += 0.30;
    reasoning.push('Green vegetation patches in otherwise dry/brown landscape — classic spring/seep indicator');
    evidence.push('Green-in-dry spatial pattern');
  }
  if (pixelStats.distribution === 'Riparian corridor') {
    gwScore += 0.25;
    reasoning.push('Linear green corridor suggests riparian zone following shallow water table');
    evidence.push('Riparian corridor distribution');
  }
  if (pixelStats.vigor === 'Lush' && pixelStats.vegetationCover > 0.4) {
    gwScore += 0.15;
    reasoning.push('Lush, dense vegetation indicates reliable water access');
    evidence.push(`Lush vegetation (${Math.round(pixelStats.vegetationCover * 100)}% cover, ExG=${pixelStats.avgExG.toFixed(0)})`);
  }

  // Species evidence
  for (const match of allMatches.slice(0, 5)) {
    gwScore += match.gwConfidence * match.matchConfidence * 0.3;
    evidence.push(`${match.species} detected (${(match.matchConfidence * 100).toFixed(0)}% match)`);
    if (match.waterDepthRange_m[0] < depthMin) depthMin = match.waterDepthRange_m[0];
    if (match.waterDepthRange_m[1] > depthMax) depthMax = match.waterDepthRange_m[1];
  }

  if (allMatches.length === 0 && pixelStats.vegetationCover < 0.1) {
    reasoning.push('Very sparse vegetation — may indicate arid conditions or deep water table');
    gwScore = Math.max(0.05, gwScore);
  }

  // Clamp
  gwScore = Math.min(1.0, gwScore);
  if (depthMin === 100) { depthMin = 5; depthMax = 50; } // default if no species matched
  if (depthMax === 0) depthMax = 20;

  const gwLikelihood: VegetationDetectionResult['groundwaterAssessment']['likelihood'] =
    gwScore > 0.75 ? 'Very High' :
    gwScore > 0.55 ? 'High' :
    gwScore > 0.35 ? 'Moderate' :
    gwScore > 0.15 ? 'Low' : 'Very Low';

  return {
    pixelStats,
    phreatophytes: allMatches,
    groundwaterAssessment: {
      likelihood: gwLikelihood,
      estimatedDepthRange_m: [Math.round(depthMin), Math.round(depthMax)],
      confidence: Math.round(gwScore * 100) / 100,
      reasoning,
      vegetationEvidence: evidence,
    },
    sceneLabels: mobilenetLabels.slice(0, 10).map(l => ({
      label: l.className, probability: Math.round(l.probability * 1000) / 1000,
    })),
    zones,
  };
}
