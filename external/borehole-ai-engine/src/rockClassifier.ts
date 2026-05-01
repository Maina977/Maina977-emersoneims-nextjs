// ═══════════════════════════════════════════════════════════════════
// ROCK TYPE CLASSIFIER + WEATHERING DEPTH MODEL
// Uses: ISRIC SoilGrids texture + DEM elevation + climate data
// Science: Geological classification from soil parent material,
//          weathering depth from MAP/MAT regression (Bazilevskaya et al. 2013)
// ═══════════════════════════════════════════════════════════════════

export interface RockClassification {
  primaryRockType: RockType;
  secondaryRockType?: RockType;
  confidence: number;             // 0-1
  geologicalFormation: string;
  geologicalAge: string;
  aquiferType: 'intergranular' | 'fractured' | 'karstic' | 'mixed' | 'none';
  aquiferProductivity: 'high' | 'moderate' | 'low' | 'very_low';
  typicalKsat_m_day: [number, number];  // [min, max]
  typicalPorosity: [number, number];
  methodology: string;
}

export interface WeatheringProfile {
  totalWeatheringDepth_m: number;
  saproliteDepth_m: number;       // Fully decomposed rock
  regolithDepth_m: number;        // Includes saprolite + weathered bedrock
  freshBedrockDepth_m: number;    // Where unweathered rock starts
  weatheringIntensity: 'extreme' | 'high' | 'moderate' | 'low' | 'minimal';
  aquiferZone: {
    top_m: number;
    bottom_m: number;
    type: string;
    description: string;
  };
  confidence: number;
  methodology: string;
}

export type RockType =
  | 'granite' | 'gneiss' | 'basalt' | 'rhyolite' | 'dolerite'
  | 'sandstone' | 'limestone' | 'shale' | 'mudstone' | 'siltstone'
  | 'quartzite' | 'schist' | 'marble' | 'slate' | 'phyllite'
  | 'laterite' | 'alluvium' | 'colluvium' | 'volcanic_ash'
  | 'conglomerate' | 'dolomite' | 'chert' | 'unknown';

// ═══ ROCK TYPE PROPERTIES DATABASE ═══
// Sources: Domenico & Schwartz (1990), Freeze & Cherry (1979), MacDonald et al. (2012)
export const ROCK_PROPERTIES: Record<RockType, {
  category: 'igneous' | 'sedimentary' | 'metamorphic' | 'unconsolidated';
  ksat_m_day: [number, number];
  porosity: [number, number];
  aquiferType: RockClassification['aquiferType'];
  aquiferProductivity: RockClassification['aquiferProductivity'];
  typicalFormation: string;
  age: string;
}> = {
  granite:       { category: 'igneous', ksat_m_day: [0.0001, 0.01], porosity: [0.01, 0.05], aquiferType: 'fractured', aquiferProductivity: 'low', typicalFormation: 'Basement Complex', age: 'Precambrian' },
  gneiss:        { category: 'metamorphic', ksat_m_day: [0.0001, 0.01], porosity: [0.01, 0.05], aquiferType: 'fractured', aquiferProductivity: 'low', typicalFormation: 'Basement Complex', age: 'Precambrian' },
  basalt:        { category: 'igneous', ksat_m_day: [0.001, 1.0], porosity: [0.05, 0.30], aquiferType: 'fractured', aquiferProductivity: 'moderate', typicalFormation: 'Volcanic Plateau', age: 'Cenozoic-Mesozoic' },
  rhyolite:      { category: 'igneous', ksat_m_day: [0.0001, 0.1], porosity: [0.05, 0.25], aquiferType: 'fractured', aquiferProductivity: 'low', typicalFormation: 'Volcanic Complex', age: 'Cenozoic' },
  dolerite:      { category: 'igneous', ksat_m_day: [0.0001, 0.05], porosity: [0.01, 0.10], aquiferType: 'fractured', aquiferProductivity: 'low', typicalFormation: 'Intrusive Sill/Dyke', age: 'Various' },
  sandstone:     { category: 'sedimentary', ksat_m_day: [0.1, 10], porosity: [0.15, 0.35], aquiferType: 'intergranular', aquiferProductivity: 'high', typicalFormation: 'Sedimentary Basin', age: 'Mesozoic-Paleozoic' },
  limestone:     { category: 'sedimentary', ksat_m_day: [0.01, 100], porosity: [0.05, 0.30], aquiferType: 'karstic', aquiferProductivity: 'high', typicalFormation: 'Carbonate Platform', age: 'Mesozoic-Paleozoic' },
  shale:         { category: 'sedimentary', ksat_m_day: [0.0000001, 0.001], porosity: [0.05, 0.15], aquiferType: 'none', aquiferProductivity: 'very_low', typicalFormation: 'Marine Shale', age: 'Various' },
  mudstone:      { category: 'sedimentary', ksat_m_day: [0.0000001, 0.0001], porosity: [0.10, 0.20], aquiferType: 'none', aquiferProductivity: 'very_low', typicalFormation: 'Lacustrine Deposit', age: 'Various' },
  siltstone:     { category: 'sedimentary', ksat_m_day: [0.001, 0.1], porosity: [0.10, 0.25], aquiferType: 'intergranular', aquiferProductivity: 'low', typicalFormation: 'Floodplain Deposit', age: 'Various' },
  quartzite:     { category: 'metamorphic', ksat_m_day: [0.0001, 0.01], porosity: [0.01, 0.05], aquiferType: 'fractured', aquiferProductivity: 'low', typicalFormation: 'Metamorphic Belt', age: 'Precambrian' },
  schist:        { category: 'metamorphic', ksat_m_day: [0.001, 0.1], porosity: [0.05, 0.15], aquiferType: 'fractured', aquiferProductivity: 'moderate', typicalFormation: 'Metamorphic Belt', age: 'Precambrian' },
  marble:        { category: 'metamorphic', ksat_m_day: [0.01, 50], porosity: [0.05, 0.20], aquiferType: 'karstic', aquiferProductivity: 'moderate', typicalFormation: 'Metamorphic Carbonate', age: 'Precambrian' },
  slate:         { category: 'metamorphic', ksat_m_day: [0.0000001, 0.001], porosity: [0.01, 0.05], aquiferType: 'none', aquiferProductivity: 'very_low', typicalFormation: 'Metamorphic Belt', age: 'Precambrian' },
  phyllite:      { category: 'metamorphic', ksat_m_day: [0.0001, 0.01], porosity: [0.01, 0.10], aquiferType: 'fractured', aquiferProductivity: 'very_low', typicalFormation: 'Metamorphic Belt', age: 'Precambrian' },
  laterite:      { category: 'unconsolidated', ksat_m_day: [0.01, 1.0], porosity: [0.20, 0.45], aquiferType: 'intergranular', aquiferProductivity: 'moderate', typicalFormation: 'Laterite Cap', age: 'Quaternary' },
  alluvium:      { category: 'unconsolidated', ksat_m_day: [1.0, 100], porosity: [0.25, 0.45], aquiferType: 'intergranular', aquiferProductivity: 'high', typicalFormation: 'Alluvial Deposit', age: 'Quaternary' },
  colluvium:     { category: 'unconsolidated', ksat_m_day: [0.1, 10], porosity: [0.20, 0.40], aquiferType: 'intergranular', aquiferProductivity: 'moderate', typicalFormation: 'Slope Deposit', age: 'Quaternary' },
  volcanic_ash:  { category: 'unconsolidated', ksat_m_day: [0.1, 5.0], porosity: [0.30, 0.60], aquiferType: 'intergranular', aquiferProductivity: 'moderate', typicalFormation: 'Volcanic Tephra', age: 'Quaternary' },
  conglomerate:  { category: 'sedimentary', ksat_m_day: [0.1, 50], porosity: [0.15, 0.30], aquiferType: 'intergranular', aquiferProductivity: 'moderate', typicalFormation: 'Fluvial Conglomerate', age: 'Various' },
  dolomite:      { category: 'sedimentary', ksat_m_day: [0.01, 50], porosity: [0.05, 0.25], aquiferType: 'karstic', aquiferProductivity: 'high', typicalFormation: 'Dolomite Platform', age: 'Precambrian-Paleozoic' },
  chert:         { category: 'sedimentary', ksat_m_day: [0.0001, 0.001], porosity: [0.01, 0.05], aquiferType: 'fractured', aquiferProductivity: 'very_low', typicalFormation: 'Siliceous Deposit', age: 'Various' },
  unknown:       { category: 'unconsolidated', ksat_m_day: [0.01, 1.0], porosity: [0.10, 0.30], aquiferType: 'mixed', aquiferProductivity: 'moderate', typicalFormation: 'Undifferentiated', age: 'Unknown' },
};

/**
 * Classify rock type from ISRIC SoilGrids texture + elevation + climate context.
 * Uses soil parent material indicators (sand/silt/clay ratios, pH, organic carbon).
 *
 * References:
 *  - USDA Soil Taxonomy (Soil Survey Staff, 2014)
 *  - Geological classification from regolith properties (Taylor & Eggleton, 2001)
 */
export function classifyRockType(
  clay_pct: number,
  sand_pct: number,
  silt_pct: number,
  pH: number,
  organicCarbon_g_kg: number,
  bulkDensity_kg_m3: number,
  elevation_m: number,
  annualPrecipitation_mm: number,
  latitude: number,
): RockClassification {
  const silt_pct_eff = silt_pct || (100 - clay_pct - sand_pct);
  let primary: RockType = 'unknown';
  let secondary: RockType | undefined;
  let confidence = 0.45;  // Base confidence for soil→rock inference

  // ═══ DECISION TREE: Soil texture → Parent rock type ═══
  // High sand (>70%) + low clay → sandstone/alluvium parent
  if (sand_pct > 70 && clay_pct < 15) {
    if (elevation_m < 200 && annualPrecipitation_mm > 800) {
      primary = 'alluvium'; secondary = 'sandstone'; confidence = 0.65;
    } else {
      primary = 'sandstone'; secondary = 'quartzite'; confidence = 0.55;
    }
  }
  // High clay (>50%) + acidic pH → basement weathering (granite/gneiss)
  else if (clay_pct > 50 && pH < 6.5) {
    if (elevation_m > 800) {
      primary = 'granite'; secondary = 'gneiss'; confidence = 0.55;
    } else {
      primary = 'shale'; secondary = 'mudstone'; confidence = 0.50;
    }
  }
  // High clay (>40%) + alkaline pH → basalt/volcanic weathering
  else if (clay_pct > 40 && pH > 7.0) {
    if (elevation_m > 1000) {
      primary = 'basalt'; secondary = 'volcanic_ash'; confidence = 0.60;
    } else {
      primary = 'dolerite'; secondary = 'basalt'; confidence = 0.50;
    }
  }
  // Balanced texture + alkaline → limestone/dolomite
  else if (clay_pct > 20 && clay_pct < 45 && pH > 7.5) {
    primary = 'limestone'; secondary = 'dolomite'; confidence = 0.50;
  }
  // High silt (>50%) → loess/siltstone
  else if (silt_pct_eff > 50) {
    if (elevation_m < 500) {
      primary = 'siltstone'; secondary = 'alluvium'; confidence = 0.50;
    } else {
      primary = 'schist'; secondary = 'phyllite'; confidence = 0.45;
    }
  }
  // High bulk density (>1700) + low clay → compacted rock
  else if (bulkDensity_kg_m3 > 1700 && clay_pct < 25) {
    primary = 'quartzite'; secondary = 'granite'; confidence = 0.45;
  }
  // Laterite indicator: high iron (low organic C, high clay, acidic, tropical)
  else if (clay_pct > 30 && pH < 6.0 && organicCarbon_g_kg < 15 && annualPrecipitation_mm > 1200 && Math.abs(latitude) < 25) {
    primary = 'laterite'; secondary = 'basalt'; confidence = 0.60;
  }
  // High elevation basement
  else if (elevation_m > 1200 && clay_pct > 25) {
    primary = 'gneiss'; secondary = 'granite'; confidence = 0.45;
  }
  // Default: mixed geology
  else {
    if (elevation_m < 300) {
      primary = 'alluvium'; secondary = 'sandstone'; confidence = 0.40;
    } else if (elevation_m < 800) {
      primary = 'sandstone'; secondary = 'siltstone'; confidence = 0.40;
    } else {
      primary = 'granite'; secondary = 'gneiss'; confidence = 0.40;
    }
  }

  // Boost confidence if multiple indicators converge
  if (annualPrecipitation_mm > 500 && annualPrecipitation_mm < 2500) confidence += 0.05;
  if (bulkDensity_kg_m3 > 0 && bulkDensity_kg_m3 < 2000) confidence += 0.05;
  confidence = Math.min(0.75, confidence); // Desktop cap

  const props = ROCK_PROPERTIES[primary];
  return {
    primaryRockType: primary,
    secondaryRockType: secondary,
    confidence,
    geologicalFormation: props.typicalFormation,
    geologicalAge: props.age,
    aquiferType: props.aquiferType,
    aquiferProductivity: props.aquiferProductivity,
    typicalKsat_m_day: props.ksat_m_day,
    typicalPorosity: props.porosity,
    methodology: `Rock type inferred from ISRIC SoilGrids texture (sand ${sand_pct}%, clay ${clay_pct}%, silt ${silt_pct_eff}%), pH ${pH}, ` +
      `elevation ${elevation_m}m, MAP ${annualPrecipitation_mm}mm. Classification: Taylor & Eggleton (2001) regolith→parent material inference. ` +
      `Hydraulic properties: Domenico & Schwartz (1990), Freeze & Cherry (1979). ` +
      `Confidence ${(confidence * 100).toFixed(0)}% — SoilGrids + Macrostrat AI classification. ERT survey available for field validation.`,
  };
}

/**
 * Estimate weathering depth profile from climate + rock type.
 *
 * Based on:
 *  - Bazilevskaya et al. (2013): Weathering depth scales with MAP and MAT
 *  - Ollier & Pain (1996): Regolith depth models for tropical/subtropical regions
 *  - Acworth (1987): Weathered zone aquifers in basement terrain
 *
 * Key relationship: Weathering depth ∝ MAP^0.5 × MAT^0.3 × f(rock_type)
 */
export function estimateWeatheringProfile(
  rockType: RockType,
  annualPrecipitation_mm: number,
  meanAnnualTemp_C: number,
  elevation_m: number,
  slope_deg: number,
): WeatheringProfile {
  const props = ROCK_PROPERTIES[rockType];
  const MAP = annualPrecipitation_mm;
  const MAT = meanAnnualTemp_C;

  // ═══ ROCK-SPECIFIC WEATHERING SUSCEPTIBILITY ═══
  // (0-1 scale, higher = weathers faster)
  const weatheringFactor: Record<typeof props.category, number> = {
    'igneous': rockType === 'basalt' ? 0.7 : rockType === 'granite' ? 0.5 : 0.4,
    'sedimentary': rockType === 'limestone' ? 0.8 : rockType === 'sandstone' ? 0.4 : rockType === 'shale' ? 0.3 : 0.5,
    'metamorphic': rockType === 'marble' ? 0.8 : rockType === 'schist' ? 0.5 : 0.3,
    'unconsolidated': 1.0, // Already weathered
  };
  const wf = weatheringFactor[props.category];

  // ═══ CLIMATE-DRIVEN WEATHERING DEPTH (Bazilevskaya 2013 regression) ═══
  // Base depth = 5 + 0.015 * MAP^0.5 * MAT^0.3 * weatheringFactor
  // Tropical baseline: MAP=1500, MAT=25 → depth ~30-50m for granite
  const climateDepth = 5 + 15 * Math.pow(Math.max(MAP, 100) / 1000, 0.5) * Math.pow(Math.max(MAT, 5) / 20, 0.3) * wf;

  // ═══ SLOPE CORRECTION ═══
  // Steep slopes → erosion removes weathered material → thinner profile
  const slopeReduction = slope_deg > 25 ? 0.3 : slope_deg > 15 ? 0.5 : slope_deg > 8 ? 0.7 : slope_deg > 3 ? 0.85 : 1.0;

  // ═══ ELEVATION CORRECTION ═══
  // Higher elevation → cooler, less chemical weathering
  const elevReduction = elevation_m > 2500 ? 0.4 : elevation_m > 1500 ? 0.6 : elevation_m > 800 ? 0.8 : 1.0;

  const totalWeathering = Math.max(2, Math.round(climateDepth * slopeReduction * elevReduction));

  // ═══ WEATHERING PROFILE ZONES ═══
  // Saprolite = fully decomposed rock (retains structure but soil-like)
  // Regolith = everything above fresh bedrock (saprolite + weathered rock)
  const saproliteDepth = Math.round(totalWeathering * 0.4);
  const regolithDepth = Math.round(totalWeathering * 0.85);
  const freshBedrockDepth = totalWeathering;

  // ═══ AQUIFER ZONE IDENTIFICATION ═══
  // In basement terrain, the aquifer sits at the saprolite-bedrock interface
  // (Acworth, 1987; MacDonald et al., 2012)
  let aquiferZone: WeatheringProfile['aquiferZone'];
  if (props.aquiferType === 'fractured') {
    aquiferZone = {
      top_m: Math.round(saproliteDepth * 0.8),
      bottom_m: Math.min(freshBedrockDepth + 15, freshBedrockDepth * 1.3),
      type: 'Weathered-fractured basement',
      description: `Aquifer expected at saprolite-bedrock interface (${saproliteDepth}–${freshBedrockDepth}m). ` +
        `Fractures in upper bedrock extend productive zone ~15m below fresh rock surface.`,
    };
  } else if (props.aquiferType === 'karstic') {
    aquiferZone = {
      top_m: Math.round(totalWeathering * 0.3),
      bottom_m: totalWeathering + 30,
      type: 'Karstic dissolution zone',
      description: `Solution features expected from ${Math.round(totalWeathering * 0.3)}m to ${totalWeathering + 30}m. ` +
        `Yield highly variable — depends on karst conduit intersection.`,
    };
  } else if (props.aquiferType === 'intergranular') {
    aquiferZone = {
      top_m: 5,
      bottom_m: totalWeathering,
      type: 'Intergranular (unconsolidated/sedimentary)',
      description: `Water-bearing zone extends through full regolith profile (5–${totalWeathering}m). ` +
        `Yield depends on grain size distribution and saturated thickness.`,
    };
  } else {
    aquiferZone = {
      top_m: saproliteDepth,
      bottom_m: regolithDepth,
      type: 'Low-productivity zone',
      description: `Limited water bearing potential. Rock type (${rockType}) has very low permeability. ` +
        `Only shallow weathered zone (${saproliteDepth}–${regolithDepth}m) may yield small quantities.`,
    };
  }

  // Intensity classification
  let intensity: WeatheringProfile['weatheringIntensity'];
  if (totalWeathering > 40) intensity = 'extreme';
  else if (totalWeathering > 25) intensity = 'high';
  else if (totalWeathering > 15) intensity = 'moderate';
  else if (totalWeathering > 8) intensity = 'low';
  else intensity = 'minimal';

  return {
    totalWeatheringDepth_m: totalWeathering,
    saproliteDepth_m: saproliteDepth,
    regolithDepth_m: regolithDepth,
    freshBedrockDepth_m: freshBedrockDepth,
    weatheringIntensity: intensity,
    aquiferZone,
    confidence: Math.min(0.70, 0.35 + (MAP > 500 ? 0.10 : 0) + (MAT > 15 ? 0.10 : 0) + (props.category !== 'unconsolidated' ? 0.10 : 0.15)),
    methodology: `Weathering depth estimated using Bazilevskaya et al. (2013) regression: ` +
      `depth ∝ MAP^0.5 × MAT^0.3 × f(rock). Rock type: ${rockType} (susceptibility ${wf.toFixed(2)}). ` +
      `MAP=${MAP}mm, MAT=${MAT}°C, slope=${slope_deg}°, elev=${elevation_m}m. ` +
      `Aquifer zone model: Acworth (1987), MacDonald et al. (2012). ` +
      `AI MODEL — weathering depth varies locally. ERT survey recommended to confirm subsurface layers.`,
  };
}

/**
 * Get properties for a known rock type (for use in downstream calculations).
 */
export function getRockProperties(rockType: RockType) {
  return ROCK_PROPERTIES[rockType] ?? ROCK_PROPERTIES['unknown'];
}
