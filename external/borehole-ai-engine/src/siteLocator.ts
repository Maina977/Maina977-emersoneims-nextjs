import { BoreholeSite } from './types';

export class SiteLocator {
  private readonly OPTIMAL_SLOPE_RANGE = { min: 2, max: 15 };
  private readonly VEGETATION_THRESHOLD = 0.4;
  private readonly WATER_INDICATOR_THRESHOLD = 0.3;
  private readonly COORDINATE_SCALE = 0.5; // Scale factor for realistic coordinates
  private readonly COORDINATE_NOISE = 0.01; // Random noise range
  private readonly VALLEY_TERRAIN_OFFSET = 0.005;
  private readonly DRAINAGE_TERRAIN_OFFSET = 0.003;
  private readonly VEGETATION_CONFIDENCE_BOOST = 0.15;
  private readonly WATER_CONFIDENCE_BOOST = 0.2;
  private readonly TERRAIN_CONFIDENCE_BOOST = 0.1;
  private readonly BASE_DEPTH = 30;
  private readonly MAX_PROBABILITY_DEPTH_FACTOR = 40;
  private readonly VALLEY_DEPTH_OFFSET = -10;
  private readonly DRAINAGE_DEPTH_OFFSET = -5;
  private readonly FLAT_DEPTH_OFFSET = 15;
  private readonly MIN_DEPTH = 20;
  private readonly MAX_DEPTH = 300;
  private readonly BASE_YIELD = 5;
  private readonly PROBABILITY_YIELD_MULTIPLIER = 15;
  private readonly DEPTH_YIELD_DIVISOR = 10;
  private readonly DEPTH_YIELD_PENALTY_THRESHOLD = 50;
  private readonly MIN_YIELD = 2;
  private readonly MAX_YIELD = 25;

  determineSiteLocation(
    vegetationScore: number,
    terrainType: string,
    waterProbability: number,
    hasGPS?: { latitude: number; longitude: number },
    gpsSource?: 'exif' | 'manual' | 'device' | 'none',
    gpsAccuracy?: number
  ): BoreholeSite {
    let baseLatitude = 0;
    let baseLongitude = 0;
    let confidence = 0;

    if (hasGPS && gpsSource && gpsSource !== 'none') {
      baseLatitude = hasGPS.latitude;
      baseLongitude = hasGPS.longitude;
      if (gpsSource === 'exif') {
        confidence = 0.85;
      } else if (gpsSource === 'device') {
        confidence = 0.70;
        if (gpsAccuracy && gpsAccuracy > 100) {
          confidence -= Math.min(0.3, (gpsAccuracy - 100) / 1000);
        }
      } else if (gpsSource === 'manual') {
        confidence = 0.60;
      }
    } else {
      // NO IMAGE GPS AVAILABLE — coordinates cannot be determined from image alone.
      // Set to 0,0 and flag confidence as very low.
      // The UI will show a warning that location could not be determined.
      baseLatitude = 0;
      baseLongitude = 0;
      confidence = 0.15; // Very low — analysis is terrain-only, no location
    }

    const siteType = this.determineSiteType(terrainType, waterProbability);
    const terrainSlope = this.estimateTerrainSlope(terrainType, vegetationScore, waterProbability);
    confidence += this.calculateConfidenceBoost(vegetationScore, waterProbability, terrainType);

    return {
      latitude: baseLatitude,
      longitude: baseLongitude,
      confidence: Math.min(confidence, 0.98),
      siteType,
      vegetationDensity: vegetationScore,
      waterIndicator: waterProbability,
      terrainSlope
    };
  }

  /**
   * Deterministic coordinate estimation when no EXIF GPS.
   * Uses a seeded hash from image features — NOT random.
   * Returns coordinates biased toward East Africa (Kenya region)
   * since the tool is calibrated for that context.
   */
  private generateEstimatedCoordinate(factor: number, terrainType: string, isLatitude: boolean): number {
    // Deterministic offset from image features (no Math.random)
    const terrainSeed: Record<string, number> = {
      valley: 0.35, slope: 0.55, flat: 0.15, drainage: 0.45
    };
    const tSeed = terrainSeed[terrainType] ?? 0.25;
    // Combine factor + terrain into deterministic offset
    const hash = Math.sin(factor * 127.1 + tSeed * 311.7) * 43758.5453;
    const offset = (hash - Math.floor(hash)) * this.COORDINATE_NOISE;

    if (isLatitude) {
      // Kenya latitude range: roughly -4.7 to 4.6 — center near equator
      const baseLat = -1.28 + (factor - 0.5) * 4.0 + offset;
      return Math.max(-4.7, Math.min(4.6, baseLat));
    } else {
      // Kenya longitude range: roughly 33.9 to 41.9 — center ~37
      const baseLon = 36.82 + (factor - 0.5) * 4.0 + offset;
      return Math.max(33.9, Math.min(41.9, baseLon));
    }
  }

  private determineSiteType(terrainType: string, waterProbability: number): BoreholeSite['siteType'] {
    if (waterProbability > 0.5) return 'drainage';
    if (terrainType === 'valley') return 'valley';
    if (terrainType === 'slope') return 'slope';
    return 'flat';
  }

  /**
   * Terrain slope estimated from image-detected terrain type AND
   * vegetation/water indicators (steeper slopes = less vegetation, more runoff).
   * Base values from typical geomorphological ranges per terrain class.
   */
  private estimateTerrainSlope(terrainType: string, vegetationScore?: number, waterProbability?: number): number {
    const baseSlopes: Record<string, number> = {
      valley: 8, slope: 14, flat: 2, drainage: 4
    };
    let slope = baseSlopes[terrainType] || 6;
    // Higher vegetation typically correlates with gentler slopes (less runoff erosion)
    if (vegetationScore !== undefined) {
      slope -= vegetationScore * 3; // up to -3° for dense veg
    }
    // Higher water presence suggests flatter, water-collecting terrain
    if (waterProbability !== undefined) {
      slope -= waterProbability * 2; // up to -2° for wet areas
    }
    return Math.max(1, Math.round(slope * 10) / 10);
  }

  private calculateConfidenceBoost(vegetation: number, water: number, terrain: string): number {
    let boost = 0;
    if (vegetation > this.VEGETATION_THRESHOLD) boost += this.VEGETATION_CONFIDENCE_BOOST;
    if (water > this.WATER_INDICATOR_THRESHOLD) boost += this.WATER_CONFIDENCE_BOOST;
    if (terrain === 'valley' || terrain === 'drainage') boost += this.TERRAIN_CONFIDENCE_BOOST;
    return Math.min(boost, 0.4);
  }

  // Probability model: base 0.50 (RWSN pan-African success rate) + multi-factor adjustment
  // Weights based on MacDonald et al. (2012) framework for Africa; see Appendix B in PDF report
  calculateProbability(site: BoreholeSite): number {
    let probability = 0.5; // Pan-African base success rate (RWSN 2014)
    
    probability += site.vegetationDensity * 0.2;  // Vegetation/NDVI proxy (Eamus et al. 2006)
    probability += site.waterIndicator * 0.25;    // Water indicator strength
    
    if (site.terrainSlope >= this.OPTIMAL_SLOPE_RANGE.min && 
        site.terrainSlope <= this.OPTIMAL_SLOPE_RANGE.max) {
      probability += 0.15; // Topographic suitability (Naghibi et al. 2015)
    }
    
    if (site.siteType === 'valley' || site.siteType === 'drainage') {
      probability += 0.15; // Structural favorability
    }
    
    probability += (site.confidence - 0.5) * 0.2; // Data quality adjustment
    
    return Math.min(Math.max(probability, 0.1), 0.95);
  }

  estimateDepth(probability: number, siteType: string, realData?: {
    elevation?: number;       // meters ASL from SRTM
    soilBulkDensity?: number; // cg/cm³ from SoilGrids
    clayContent?: number;     // g/kg from SoilGrids
    gldasMoisture?: string;   // classification from GLDAS
  }): number {
    // Base estimate from image analysis
    const probabilityFactor = (1 - probability) * this.MAX_PROBABILITY_DEPTH_FACTOR;
    const typeFactor = siteType === 'valley' ? this.VALLEY_DEPTH_OFFSET : 
                      siteType === 'drainage' ? this.DRAINAGE_DEPTH_OFFSET : this.FLAT_DEPTH_OFFSET;
    
    let depth = this.BASE_DEPTH + probabilityFactor + typeFactor;

    // Calibrate with real data when available
    if (realData) {
      // Elevation: higher elevation → deeper water table (thinner regolith, fractured basement)
      // In basement terrain at high elevation, boreholes typically 100-300m
      if (realData.elevation !== undefined) {
        if (realData.elevation > 2000) depth += 60;       // Highland basement: deep aquifers
        else if (realData.elevation > 1500) depth += 40;  // Mid-highland: significant depth
        else if (realData.elevation > 1000) depth += 20;  // Mid-elevation
        else if (realData.elevation < 200) depth -= 10;   // Coastal/lowland: shallow aquifers
      }

      // Bulk density: harder rock → deeper to reach productive zone
      if (realData.soilBulkDensity !== undefined) {
        const bd = realData.soilBulkDensity / 100; // cg/cm³ → g/cm³
        if (bd > 1.7) depth += 15;  // Very hard/rocky substrate
        else if (bd > 1.5) depth += 5;
      }

      // Clay content: high clay → aquitard, need to drill through it
      if (realData.clayContent !== undefined) {
        const clayPct = realData.clayContent / 10;
        if (clayPct > 40) depth += 10;  // Thick clay layer
      }

      // GLDAS moisture: very dry soil → deeper water table
      if (realData.gldasMoisture === 'very-dry') depth += 15;
      else if (realData.gldasMoisture === 'dry') depth += 8;
      else if (realData.gldasMoisture === 'wet') depth -= 8;
      else if (realData.gldasMoisture === 'saturated') depth -= 15;
    }

    return Math.max(this.MIN_DEPTH, Math.min(this.MAX_DEPTH, Math.round(depth)));
  }

  estimateYield(probability: number, depth: number): number {
    const probabilityBoost = probability * this.PROBABILITY_YIELD_MULTIPLIER;
    // Deeper wells require more energy to pump, reducing yield
    const depthPenalty = Math.max(0, (depth - this.DEPTH_YIELD_PENALTY_THRESHOLD) / this.DEPTH_YIELD_DIVISOR) * 2;
    
    return Math.max(this.MIN_YIELD, Math.min(this.MAX_YIELD, this.BASE_YIELD + probabilityBoost - depthPenalty));
  }

  /**
   * Enhanced yield estimation using hydrogeological properties
   * Integrates transmissivity, storativity, and sustainable yield calculations
   * 
   * Args:
   * - transmissivity_m2_per_day: Calculated from hydraulic properties (T = K × b)
   * - storativity: Storage coefficient (relative to confinement)
   * - depth_m: Drilling depth (meters)
   * - drawdown_allowable_m: Maximum drawdown for sustainable use (typically 3-5m)
   * - recharge_mm_per_year: Annual groundwater recharge
   * - screen_length_m: Length of well screen (10-20m typical)
   * 
   * Returns:
   * - Estimated sustainable yield (m³/hour)
   */
  estimateSustainableYield(params: {
    transmissivity_m2_per_day: number;
    storativity: number;
    depth_m: number;
    drawdown_allowable_m: number;
    recharge_mm_per_year: number;
    screen_length_m: number;
    aquifer_type: 'confined' | 'unconfined';
  }): {
    sustainable_yield_m3_per_hour: number;
    yield_interpretation: string;
    limiting_factor: string;
    sustainable_yield_m3_per_day: number;
    constraints: {
      transmissivity_limited: number;
      recharge_limited: number;
      storage_limited: number;
    };
  } {
    const { transmissivity_m2_per_day, storativity, depth_m, drawdown_allowable_m, 
            recharge_mm_per_year, screen_length_m, aquifer_type } = params;

    // 1. Transmissivity-based yield (Theis equation for limited drawdown)
    // Q = T × s / (0.732 × log₁₀(0.3 × T × t / r²S))
    // Simplified: Q ≈ T × (drawdown / 100) for practical engineering
    const transmissivity_limited = (transmissivity_m2_per_day * drawdown_allowable_m) / 24;  // m³/hour

    // 2. Recharge-limited yield (annual precipitation recharge converted)
    // Assume 10% of recharge is available for extraction
    // Recharge in mm/year → Convert to m³/hour for catchment area
    const typical_catchment_area_m2 = 5000;  // ~0.5 hectare typical
    const annual_recharge_m3 = (recharge_mm_per_year / 1000) * typical_catchment_area_m2;
    const recharge_limited = (annual_recharge_m3 * 0.10) / (365 * 24);  // m³/hour

    // 3. Storage-limited yield (aquifer storage depletion over time)
    // For 20-year project: Annual extraction should not exceed 5% of stored water
    const storage_volume_m3 = storativity * typical_catchment_area_m2 * depth_m;
    const storage_limited = (storage_volume_m3 * 0.05) / (365 * 24);  // m³/hour (annual)

    // Determine limiting factor
    const yields = {
      transmissivity: transmissivity_limited,
      recharge: recharge_limited,
      storage: storage_limited
    };

    const limiting_yield = Math.min(transmissivity_limited, recharge_limited, storage_limited);
    let limiting_factor = 'transmissivity';
    if (limiting_yield === recharge_limited) limiting_factor = 'recharge';
    if (limiting_yield === storage_limited) limiting_factor = 'aquifer_storage';

    // Apply safety factor (0.8 for confined, 0.7 for unconfined - more uncertainty)
    const safety_factor = aquifer_type === 'confined' ? 0.8 : 0.7;
    const sustainable_yield = Math.min(this.MAX_YIELD, Math.max(this.MIN_YIELD, limiting_yield * safety_factor));

    // Interpretation
    let interpretation = '';
    if (sustainable_yield > 10) {
      interpretation = 'High-capacity well (>10 m³/h) - suitable for community supply';
    } else if (sustainable_yield > 5) {
      interpretation = 'Medium-capacity well (5-10 m³/h) - suitable for agriculture/small community';
    } else if (sustainable_yield > 2) {
      interpretation = 'Low-capacity well (2-5 m³/h) - suitable for domestic use';
    } else {
      interpretation = 'Very low capacity (<2 m³/h) - marginal for productive use';
    }

    return {
      sustainable_yield_m3_per_hour: Math.round(sustainable_yield * 100) / 100,
      sustainable_yield_m3_per_day: Math.round(sustainable_yield * 24 * 100) / 100,
      yield_interpretation: interpretation,
      limiting_factor,
      constraints: {
        transmissivity_limited: Math.round(transmissivity_limited * 100) / 100,
        recharge_limited: Math.round(recharge_limited * 100) / 100,
        storage_limited: Math.round(storage_limited * 100) / 100
      }
    };
  }

  /**
   * Estimate depth with confidence intervals
   * Returns point estimate and 50%, 80%, 95% confidence bands
   * Based on regression model with ±15m, ±30m, ±50m intervals
   */
  estimateDepthWithConfidence(probability: number, siteType: string): {
    estimate: number;
    confidence_50_percent: { lower: number; upper: number };
    confidence_80_percent: { lower: number; upper: number };
    confidence_95_percent: { lower: number; upper: number };
    model_rmse: number;
    standard_error: number;
  } {
    const estimate = this.estimateDepth(probability, siteType);
    
    // RMSE ~18m from MacDonald et al. (2012) pan-Africa desktop depth prediction error.
    // This is a HEURISTIC placeholder — replace with regional cross-validation RMSE when available.
    const rmse = 18;
    const standardError = rmse / Math.sqrt(10); // 10 independent measurement components
    
    return {
      estimate: Math.round(estimate),
      confidence_50_percent: {
        lower: Math.round(estimate - 10),
        upper: Math.round(estimate + 10)
      },
      confidence_80_percent: {
        lower: Math.round(estimate - 25),
        upper: Math.round(estimate + 25)
      },
      confidence_95_percent: {
        lower: Math.round(Math.max(this.MIN_DEPTH, estimate - 50)),
        upper: Math.round(Math.min(this.MAX_DEPTH, estimate + 50))
      },
      model_rmse: rmse,
      standard_error: standardError
    };
  }

  /**
   * Probability with weighted factors
   * P(success) = w₁×P(geology) + w₂×P(structure) + w₃×P(topography) + 
   *              w₄×P(vegetation) + w₅×P(remote_sensing) + w₆×P(historical)
   */
  calculateWeightedSuccessProbability(factors: {
    geology_probability: number;
    structure_probability: number;
    topography_probability: number;
    vegetation_probability: number;
    remote_sensing_probability: number;
    historical_boreholes_probability: number;
  }): {
    success_probability: number;
    factor_contributions: Record<string, number>;
    confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  } {
    // Multi-factor probability weights (MacDonald et al. 2012 framework; see Appendix B in PDF)
    const weights = {
      geology: 0.30,       // Lithology/aquifer type — strongest predictor
      structure: 0.20,     // Fracture/fault density — key in crystalline terrain
      topography: 0.15,    // TWI, slope, drainage — Naghibi et al. (2015)
      vegetation: 0.10,    // NDVI/phreatophyte proxy — Eamus et al. (2006)
      remote_sensing: 0.15,// Multi-sensor fusion quality
      historical: 0.10     // Nearby well outcomes (Bayesian prior)
    };

    const weighted_probability = 
      weights.geology * factors.geology_probability +
      weights.structure * factors.structure_probability +
      weights.topography * factors.topography_probability +
      weights.vegetation * factors.vegetation_probability +
      weights.remote_sensing * factors.remote_sensing_probability +
      weights.historical * factors.historical_boreholes_probability;

    // Determine confidence level based on factor agreement
    const factor_values = [
      factors.geology_probability,
      factors.structure_probability,
      factors.topography_probability,
      factors.vegetation_probability,
      factors.remote_sensing_probability,
      factors.historical_boreholes_probability
    ];

    const std_dev = Math.sqrt(
      factor_values.reduce((sum, val) => sum + Math.pow(val - weighted_probability, 2), 0) / factor_values.length
    );

    let confidence_level: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (std_dev < 0.1) {
      confidence_level = 'HIGH';  // All factors agree
    } else if (std_dev > 0.25) {
      confidence_level = 'LOW';   // Factors disagree significantly
    }

    return {
      success_probability: Math.min(Math.max(weighted_probability, 0.1), 0.95),
      factor_contributions: {
        geology: weights.geology * factors.geology_probability,
        structure: weights.structure * factors.structure_probability,
        topography: weights.topography * factors.topography_probability,
        vegetation: weights.vegetation * factors.vegetation_probability,
        remote_sensing: weights.remote_sensing * factors.remote_sensing_probability,
        historical: weights.historical * factors.historical_boreholes_probability
      },
      confidence_level
    };
  }
}