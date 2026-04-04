// @ts-nocheck
// lib/ai/siteAnalyzer.ts

import axios from 'axios';

export interface SiteAnalysisInput {
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  city?: string;
}

export interface SiteAnalysisResult {
  success: boolean;
  data?: {
    terrain: TerrainData;
    soil: SoilData;
    floodRisk: FloodRiskData;
    waterTable: WaterTableData;
    climate: ClimateData;
    utilities: UtilitiesData;
    suitabilityScore: number;
    recommendations: string[];
    warnings: string[];
  };
  error?: string;
}

export interface TerrainData {
  elevationM: number;
  slopePercent: number;
  slopeCategory: 'flat' | 'gentle' | 'moderate' | 'steep';
  aspect: string;
  landform: string;
}

export interface SoilData {
  type: string;
  bearingCapacityKpa: number;
  shrinkSwellRisk: 'low' | 'moderate' | 'high';
  excavationDifficulty: 'easy' | 'medium' | 'hard';
  recommendedFoundation: string;
  ph?: number;
  organicMatter?: number;
}

export interface FloodRiskData {
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  floodZone: string;
  distanceToRiverM: number;
  historicalFloods: boolean;
  floodDepthPotential?: number;
}

export interface WaterTableData {
  depthM: number;
  seasonalVariationM: number;
  boreholeFeasibility: 'poor' | 'good' | 'excellent';
  waterQuality?: 'good' | 'moderate' | 'poor';
}

export interface ClimateData {
  rainfallMmYear: number;
  avgTemperatureC: number;
  minTemperatureC: number;
  maxTemperatureC: number;
  windSpeedMs: number;
  sunHoursDay: number;
  solarIrradiance: number;
}

export interface UtilitiesData {
  gridDistanceM: number;
  gridProvider: string;
  transformerCapacity?: string;
  waterDistanceM: number;
  waterProvider: string;
  sewerAvailable: boolean;
  sewerDistanceM?: number;
  roadDistanceM: number;
  roadType: 'tarmac' | 'gravel' | 'dirt' | 'none';
  cellularCoverage?: string;
}

export async function analyzeSite(input: SiteAnalysisInput): Promise<SiteAnalysisResult> {
  try {
    // Parallel fetch all data sources
    const [terrainData, soilData, floodData, waterData, climateData, utilitiesData] = await Promise.all([
      fetchTerrainData(input.latitude, input.longitude),
      fetchSoilData(input.latitude, input.longitude, input.country),
      fetchFloodRisk(input.latitude, input.longitude),
      fetchWaterTable(input.latitude, input.longitude, input.country),
      fetchClimateData(input.latitude, input.longitude),
      fetchUtilitiesData(input.latitude, input.longitude),
    ]);
    
    // Calculate suitability score
    const suitabilityScore = calculateSuitabilityScore({
      terrain: terrainData,
      soil: soilData,
      flood: floodData,
      utilities: utilitiesData,
    });
    
    // Generate recommendations
    const { recommendations, warnings } = generateRecommendations({
      terrain: terrainData,
      soil: soilData,
      flood: floodData,
      water: waterData,
      utilities: utilitiesData,
      climate: climateData,
    });
    
    return {
      success: true,
      data: {
        terrain: terrainData,
        soil: soilData,
        floodRisk: floodData,
        waterTable: waterData,
        climate: climateData,
        utilities: utilitiesData,
        suitabilityScore,
        recommendations,
        warnings,
      },
    };
  } catch (error) {
    console.error('EMERSON EIMS - Site analysis failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze site',
    };
  }
}

async function fetchTerrainData(lat: number, lng: number): Promise<TerrainData> {
  // Using Open-Elevation API
  const response = await axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
  const elevation = response.data.results[0].elevation;
  
  // Calculate slope using surrounding points
  const offset = 0.001;
  const east = await getElevation(lat, lng + offset);
  const north = await getElevation(lat + offset, lng);
  const slopePercent = Math.sqrt(Math.pow(east - elevation, 2) + Math.pow(north - elevation, 2)) * 100;
  
  let slopeCategory: 'flat' | 'gentle' | 'moderate' | 'steep';
  if (slopePercent < 2) slopeCategory = 'flat';
  else if (slopePercent < 8) slopeCategory = 'gentle';
  else if (slopePercent < 15) slopeCategory = 'moderate';
  else slopeCategory = 'steep';
  
  let landform = 'plateau';
  if (slopePercent > 15) landform = 'mountainous';
  else if (slopePercent > 5) landform = 'hills';
  
  return {
    elevationM: Math.round(elevation),
    slopePercent: Math.round(slopePercent * 10) / 10,
    slopeCategory,
    aspect: 'east',
    landform,
  };
}

async function getElevation(lat: number, lng: number): Promise<number> {
  const response = await axios.get(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
  return response.data.results[0].elevation;
}

async function fetchSoilData(lat: number, lng: number, country: string): Promise<SoilData> {
  // In production, use USGS SoilGrids or local databases
  const soilTypes: Record<string, SoilData> = {
    clay_loam: {
      type: 'Clay Loam',
      bearingCapacityKpa: 120,
      shrinkSwellRisk: 'moderate',
      excavationDifficulty: 'medium',
      recommendedFoundation: 'reinforced_raft',
      ph: 6.5,
      organicMatter: 3.5,
    },
    sandy_loam: {
      type: 'Sandy Loam',
      bearingCapacityKpa: 150,
      shrinkSwellRisk: 'low',
      excavationDifficulty: 'easy',
      recommendedFoundation: 'strip',
      ph: 7.0,
      organicMatter: 2.0,
    },
    silty_clay: {
      type: 'Silty Clay',
      bearingCapacityKpa: 80,
      shrinkSwellRisk: 'high',
      excavationDifficulty: 'hard',
      recommendedFoundation: 'pile',
      ph: 6.0,
      organicMatter: 4.5,
    },
    rocky: {
      type: 'Rocky',
      bearingCapacityKpa: 300,
      shrinkSwellRisk: 'low',
      excavationDifficulty: 'hard',
      recommendedFoundation: 'raft',
      ph: 7.5,
      organicMatter: 1.0,
    },
  };
  
  // Simple deterministic selection based on coordinates
  const index = Math.floor(Math.abs(Math.sin(lat + lng) * 100) % 4);
  const keys = Object.keys(soilTypes);
  return soilTypes[keys[index] as keyof typeof soilTypes];
}

async function fetchFloodRisk(lat: number, lng: number): Promise<FloodRiskData> {
  // In production, use Global Flood Database or FEMA
  const isFloodZone = Math.abs(Math.sin(lat * lng)) < 0.1;
  
  return {
    riskLevel: isFloodZone ? 'moderate' : 'low',
    floodZone: isFloodZone ? 'Zone A' : 'Zone X',
    distanceToRiverM: Math.round(Math.abs(Math.sin(lat) * 500) + 100),
    historicalFloods: isFloodZone,
    floodDepthPotential: isFloodZone ? 0.5 : 0,
  };
}

async function fetchWaterTable(lat: number, lng: number, country: string): Promise<WaterTableData> {
  const depthM = Math.round(Math.abs(Math.sin(lat + lng) * 30) + 10);
  
  let feasibility: 'poor' | 'good' | 'excellent' = 'good';
  let waterQuality: 'good' | 'moderate' | 'poor' = 'moderate';
  
  if (depthM < 15) {
    feasibility = 'excellent';
    waterQuality = 'good';
  } else if (depthM > 40) {
    feasibility = 'poor';
    waterQuality = 'poor';
  }
  
  return {
    depthM,
    seasonalVariationM: Math.round(Math.abs(Math.cos(lat) * 3)),
    boreholeFeasibility: feasibility,
    waterQuality,
  };
}

async function fetchClimateData(lat: number, lng: number): Promise<ClimateData> {
  // In production, use OpenWeatherMap or similar
  const isTropical = Math.abs(lat) < 23.5;
  const isEquatorial = Math.abs(lat) < 10;
  
  let rainfallMmYear = isTropical ? 1200 : 800;
  let avgTemperatureC = isTropical ? 24 : 16;
  let minTemperatureC = avgTemperatureC - 5;
  let maxTemperatureC = avgTemperatureC + 5;
  let sunHoursDay = isTropical ? 6.5 : 5.5;
  let solarIrradiance = isEquatorial ? 5.5 : 4.5;
  
  // Adjust for Kenya/Savanna regions
  if (lat > -5 && lat < 5 && lng > 34 && lng < 42) {
    rainfallMmYear = 950;
    avgTemperatureC = 19;
    minTemperatureC = 14;
    maxTemperatureC = 26;
    sunHoursDay = 6.2;
    solarIrradiance = 5.2;
  }
  
  return {
    rainfallMmYear,
    avgTemperatureC,
    minTemperatureC,
    maxTemperatureC,
    windSpeedMs: 4.5,
    sunHoursDay,
    solarIrradiance,
  };
}

async function fetchUtilitiesData(lat: number, lng: number): Promise<UtilitiesData> {
  // In production, use OpenStreetMap Overpass API
  return {
    gridDistanceM: Math.round(Math.abs(Math.sin(lat) * 300) + 50),
    gridProvider: 'Kenya Power (KPLC)',
    waterDistanceM: Math.round(Math.abs(Math.cos(lng) * 200) + 50),
    waterProvider: 'Nairobi Water',
    sewerAvailable: Math.random() > 0.5,
    sewerDistanceM: Math.random() > 0.5 ? Math.round(Math.random() * 200) : undefined,
    roadDistanceM: Math.round(Math.abs(Math.sin(lat + lng) * 100) + 20),
    roadType: Math.random() > 0.7 ? 'tarmac' : Math.random() > 0.5 ? 'gravel' : 'dirt',
    cellularCoverage: Math.random() > 0.2 ? '4G' : '3G',
  };
}

function calculateSuitabilityScore(data: {
  terrain: TerrainData;
  soil: SoilData;
  flood: FloodRiskData;
  utilities: UtilitiesData;
}): number {
  let score = 100;
  
  // Slope deduction
  if (data.terrain.slopePercent > 15) score -= 20;
  else if (data.terrain.slopePercent > 8) score -= 10;
  else if (data.terrain.slopePercent > 5) score -= 5;
  
  // Soil deduction
  if (data.soil.shrinkSwellRisk === 'high') score -= 15;
  else if (data.soil.shrinkSwellRisk === 'moderate') score -= 5;
  
  if (data.soil.excavationDifficulty === 'hard') score -= 10;
  
  // Flood risk deduction
  if (data.flood.riskLevel === 'high') score -= 25;
  else if (data.flood.riskLevel === 'moderate') score -= 10;
  
  // Utilities deduction
  if (data.utilities.gridDistanceM > 500) score -= 10;
  if (data.utilities.waterDistanceM > 500) score -= 5;
  if (data.utilities.roadDistanceM > 200) score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

function generateRecommendations(data: {
  terrain: TerrainData;
  soil: SoilData;
  flood: FloodRiskData;
  water: WaterTableData;
  utilities: UtilitiesData;
  climate: ClimateData;
}): { recommendations: string[]; warnings: string[] } {
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  // Terrain recommendations
  if (data.terrain.slopePercent > 10) {
    recommendations.push('Steep slope detected - consider terraced foundation and retaining walls');
  }
  
  // Soil recommendations
  if (data.soil.shrinkSwellRisk === 'high') {
    recommendations.push('Expansive clay soil - use reinforced raft foundation and proper drainage');
    warnings.push('High shrink-swell soil risk - foundation design critical');
  }
  
  if (data.soil.excavationDifficulty === 'hard') {
    recommendations.push('Hard excavation expected - budget for rock breaking equipment');
  }
  
  // Flood recommendations
  if (data.flood.riskLevel !== 'low') {
    recommendations.push(`Flood risk area - elevate building ${data.flood.floodDepthPotential ? `by ${data.flood.floodDepthPotential + 0.5}m` : 'by 1m'}, use flood-resistant materials`);
    warnings.push('Flood zone detected - building elevation required');
  }
  
  // Utilities recommendations
  if (data.utilities.gridDistanceM > 300) {
    recommendations.push(`Grid connection requires ${data.utilities.gridDistanceM}m trenching - consider solar system alternative`);
  }
  
  if (!data.utilities.sewerAvailable) {
    recommendations.push('No municipal sewer - design septic tank and soakaway system');
  }
  
  // Water recommendations
  if (data.water.boreholeFeasibility === 'excellent') {
    recommendations.push('Excellent borehole potential - consider water self-sufficiency');
  } else if (data.water.boreholeFeasibility === 'good') {
    recommendations.push('Good borehole potential - recommended for water security');
  }
  
  // Climate recommendations
  if (data.climate.sunHoursDay > 6) {
    recommendations.push(`Excellent solar potential (${data.climate.sunHoursDay} sun hours/day) - solar system highly recommended`);
  }
  
  if (data.climate.rainfallMmYear > 1000) {
    recommendations.push('High rainfall area - ensure adequate roof drainage and rainwater harvesting');
  }
  
  return { recommendations, warnings };
}