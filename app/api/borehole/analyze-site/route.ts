/**
 * Complete Borehole Site Analysis API
 * Combines all data sources for comprehensive pre-assessment
 *
 * This is the MAIN endpoint that calls all other APIs
 */

import { NextRequest, NextResponse } from 'next/server';

interface SiteAnalysisRequest {
  latitude: number;
  longitude: number;
  projectType?: 'domestic' | 'agricultural' | 'commercial' | 'industrial';
  expectedDemand?: number;  // m³/day
}

interface CompleteSiteAnalysis {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    county?: string;
    country: string;
  };
  successProbability: number;
  recommendedDepth: { min: number; max: number; optimal: number };
  expectedYield: { min: number; max: number; likely: number };
  waterQuality: {
    overallRating: string;
    potable: boolean;
    treatmentNeeded: string[];
    concerns: string[];
  };
  terrain: {
    slope: number;
    aspect: string;
    accessibility: string;
    suitability: string;
  };
  satellite: {
    ndvi: number;
    ndwi: number;
    landCover: string;
    droughtRisk: string;
  };
  groundwater: {
    soilMoisture: number;
    rechargeRate: number;
    trend: string;
  };
  nearbyBoreholes: {
    count: number;
    averageDepth: number;
    averageYield: number;
    successRate: number;
  };
  risks: Array<{
    type: string;
    level: 'low' | 'medium' | 'high';
    description: string;
  }>;
  costEstimate: {
    drillingCost: number;
    pumpCost: number;
    totalEstimate: number;
    currency: string;
  };
  recommendations: string[];
  confidence: number;
  dataSources: string[];
  analysisTimestamp: string;
}

interface SiteAnalysisResponse {
  success: boolean;
  data?: CompleteSiteAnalysis;
  error?: string;
}

// Helper to call internal APIs
async function callInternalAPI(endpoint: string, body: any): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`[Site Analysis] Failed to call ${endpoint}:`, error);
    return null;
  }
}

// Reverse geocoding using Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<{
  address: string;
  county: string;
  country: string;
}> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: { 'User-Agent': 'AquaScanPro/1.0' },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        address: data.display_name || '',
        county: data.address?.county || data.address?.state_district || data.address?.state || '',
        country: data.address?.country || 'Unknown',
      };
    }
  } catch (error) {
    console.error('[Geocode] Failed:', error);
  }

  return { address: '', county: '', country: 'Unknown' };
}

function calculateSuccessProbability(
  satellite: any,
  groundwater: any,
  nearbyBoreholes: any,
  waterQuality: any
): number {
  let score = 50; // Base score

  // Satellite indicators
  if (satellite) {
    if (satellite.indices?.ndwi?.value > 0) score += 10;
    if (satellite.indices?.ndvi?.value > 0.3) score += 5;
    if (satellite.groundwaterIndicators?.favorability > 60) score += 15;
  }

  // Groundwater data
  if (groundwater) {
    if (groundwater.soilMoisture?.layer100_200cm > 100) score += 10;
    if (groundwater.groundwater?.trend === 'increasing') score += 5;
    if (groundwater.rechargeEstimate > 100) score += 5;
  }

  // Nearby boreholes
  if (nearbyBoreholes) {
    if (nearbyBoreholes.statistics?.successRate > 70) score += 15;
    else if (nearbyBoreholes.statistics?.successRate > 50) score += 8;
    else if (nearbyBoreholes.statistics?.successRate < 30) score -= 10;
  }

  // Water quality
  if (waterQuality) {
    if (waterQuality.overallQuality?.score > 70) score += 5;
    else if (waterQuality.overallQuality?.score < 50) score -= 5;
  }

  return Math.min(95, Math.max(20, score));
}

function estimateCosts(depth: number, yield_rate: number): {
  drillingCost: number;
  pumpCost: number;
  totalEstimate: number;
} {
  // Kenya market rates (2024)
  const costPerMeter = depth > 100 ? 6500 : 5500; // KES per meter (harder rock at depth)
  const drillingCost = depth * costPerMeter;

  // Pump cost based on expected yield and depth
  let pumpCost = 45000; // Basic submersible
  if (yield_rate > 10) pumpCost = 85000; // Higher capacity pump
  if (depth > 150) pumpCost += 25000; // Deep well pump premium

  // Add casing, development, testing
  const casingCost = depth * 1200;
  const developmentCost = 35000;
  const testingCost = 25000;

  const totalEstimate = drillingCost + pumpCost + casingCost + developmentCost + testingCost;

  return {
    drillingCost: Math.round(drillingCost),
    pumpCost: Math.round(pumpCost),
    totalEstimate: Math.round(totalEstimate),
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: SiteAnalysisRequest = await request.json();
    const { latitude, longitude, projectType = 'domestic', expectedDemand = 5 } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Site Analysis] Starting comprehensive analysis for ${latitude}, ${longitude}`);

    const dataSources: string[] = [];

    // Parallel API calls for speed
    const [
      geoResult,
      gldasResult,
      satelliteResult,
      waterQualityResult,
      nearbyResult,
    ] = await Promise.all([
      reverseGeocode(latitude, longitude),
      callInternalAPI('/api/borehole/nasa-gldas', { latitude, longitude }),
      callInternalAPI('/api/borehole/satellite', { latitude, longitude }),
      callInternalAPI('/api/borehole/water-quality', { latitude, longitude }),
      callInternalAPI('/api/borehole/nearby-boreholes', { latitude, longitude, radius: 10 }),
    ]);

    if (geoResult.address) dataSources.push('OpenStreetMap Geocoding');
    if (gldasResult) dataSources.push(gldasResult.source || 'NASA GLDAS/Open-Meteo');
    if (satelliteResult) dataSources.push(satelliteResult.dataSource || 'Satellite Indices');
    if (waterQualityResult) dataSources.push('Water Quality Model');
    if (nearbyResult) dataSources.push(...(nearbyResult.dataSources || []));

    // Calculate success probability
    const successProbability = calculateSuccessProbability(
      satelliteResult, gldasResult, nearbyResult, waterQualityResult
    );

    // Determine recommended depth
    const nearbyAvgDepth = nearbyResult?.statistics?.averageDepth || 120;
    const recommendedDepth = {
      min: Math.round(nearbyAvgDepth * 0.7),
      max: Math.round(nearbyAvgDepth * 1.3),
      optimal: Math.round(nearbyAvgDepth),
    };

    // Expected yield
    const nearbyAvgYield = nearbyResult?.statistics?.averageYield || 6;
    const expectedYield = {
      min: Math.round(nearbyAvgYield * 0.5 * 10) / 10,
      max: Math.round(nearbyAvgYield * 1.5 * 10) / 10,
      likely: Math.round(nearbyAvgYield * 10) / 10,
    };

    // Water quality summary
    const waterQuality = {
      overallRating: waterQualityResult?.overallQuality?.rating || 'Unknown',
      potable: waterQualityResult?.overallQuality?.potability ?? true,
      treatmentNeeded: waterQualityResult?.overallQuality?.treatmentRequired || [],
      concerns: waterQualityResult?.geologicalFactors?.naturalContaminants || [],
    };

    // Satellite summary
    const satellite = {
      ndvi: satelliteResult?.indices?.ndvi?.value || 0,
      ndwi: satelliteResult?.indices?.ndwi?.value || 0,
      landCover: satelliteResult?.landCover?.classification || 'Unknown',
      droughtRisk: satelliteResult?.droughtIndices?.condition || 'Unknown',
    };

    // Groundwater summary
    const groundwater = {
      soilMoisture: gldasResult?.soilMoisture?.rootZone || 0,
      rechargeRate: gldasResult?.rechargeEstimate || 0,
      trend: gldasResult?.groundwater?.trend || 'stable',
    };

    // Nearby boreholes summary
    const nearbyBoreholes = {
      count: nearbyResult?.totalFound || 0,
      averageDepth: nearbyResult?.statistics?.averageDepth || 0,
      averageYield: nearbyResult?.statistics?.averageYield || 0,
      successRate: nearbyResult?.statistics?.successRate || 0,
    };

    // Identify risks
    const risks: Array<{ type: string; level: 'low' | 'medium' | 'high'; description: string }> = [];

    if (waterQuality.concerns.includes('Fluoride')) {
      risks.push({
        type: 'Water Quality',
        level: 'high',
        description: 'High fluoride risk - treatment likely required',
      });
    }
    if (successProbability < 50) {
      risks.push({
        type: 'Drilling',
        level: 'high',
        description: 'Low success probability - geophysical survey recommended',
      });
    }
    if (recommendedDepth.optimal > 200) {
      risks.push({
        type: 'Cost',
        level: 'medium',
        description: 'Deep drilling required - higher costs expected',
      });
    }
    if (satellite.droughtRisk.includes('drought')) {
      risks.push({
        type: 'Climate',
        level: 'medium',
        description: 'Drought conditions may affect groundwater levels',
      });
    }
    if (nearbyBoreholes.successRate < 50) {
      risks.push({
        type: 'Geological',
        level: 'medium',
        description: 'Challenging geology indicated by nearby borehole performance',
      });
    }

    // Cost estimate
    const costEstimate = {
      ...estimateCosts(recommendedDepth.optimal, expectedYield.likely),
      currency: 'KES',
    };

    // Generate recommendations
    const recommendations: string[] = [];

    recommendations.push(`Recommended drilling depth: ${recommendedDepth.optimal}m (range ${recommendedDepth.min}-${recommendedDepth.max}m)`);
    recommendations.push(`Expected yield: ${expectedYield.likely} m³/hr (${expectedYield.min}-${expectedYield.max} m³/hr)`);

    if (successProbability >= 70) {
      recommendations.push('Good drilling conditions - proceed with standard site preparation');
    } else if (successProbability >= 50) {
      recommendations.push('Moderate conditions - consider geophysical survey for optimal siting');
    } else {
      recommendations.push('Challenging conditions - STRONGLY recommend detailed geophysical survey before drilling');
    }

    if (waterQuality.treatmentNeeded.length > 0) {
      recommendations.push(`Water treatment needed: ${waterQuality.treatmentNeeded.join(', ')}`);
    }

    if (expectedDemand > expectedYield.likely * 8) {
      recommendations.push('Expected demand exceeds likely yield - consider multiple boreholes or storage tank');
    }

    // Add nearby borehole recommendations
    if (nearbyResult?.recommendations) {
      recommendations.push(...nearbyResult.recommendations.slice(0, 2));
    }

    const processingTime = Date.now() - startTime;
    console.log(`[Site Analysis] Complete in ${processingTime}ms`);

    const result: SiteAnalysisResponse = {
      success: true,
      data: {
        location: {
          latitude,
          longitude,
          address: geoResult.address,
          county: geoResult.county,
          country: geoResult.country,
        },
        successProbability,
        recommendedDepth,
        expectedYield,
        waterQuality,
        terrain: {
          slope: 5, // Would come from elevation API
          aspect: 'Level',
          accessibility: 'Good',
          suitability: successProbability > 60 ? 'Suitable' : 'Challenging',
        },
        satellite,
        groundwater,
        nearbyBoreholes,
        risks,
        costEstimate,
        recommendations,
        confidence: Math.round(65 + (dataSources.length * 5)),
        dataSources: [...new Set(dataSources)],
        analysisTimestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Site Analysis] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Missing lat and lon parameters' },
      { status: 400 }
    );
  }

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lon) }),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
