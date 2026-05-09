/**
 * Pro Building Suite API Service
 * Connects frontend to REAL backend APIs
 *
 * NO MORE FAKE DATA - All real API calls
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ElevationData {
  elevation: number;
  slope: number;
  aspect: string;
  terrainType: string;
  resolution: string;
  source: string;
}

export interface SoilData {
  soilType: string;
  classification: string;
  properties: {
    clay: number;
    sand: number;
    silt: number;
    organicCarbon: number;
    ph: number;
    bulkDensity: number;
    coarseFragments: number;
    nitrogen: number;
    cationExchange: number;
  };
  bearingCapacity: number;
  waterTable: number;
  permeability: string;
  expansive: boolean;
  corrosivity: string;
  foundationRecommendation: string;
  excavationDifficulty: string;
  source: string;
}

export interface ClimateData {
  temperature: {
    annual: number;
    summer: number;
    winter: number;
    max: number;
    min: number;
  };
  humidity: {
    annual: number;
    max: number;
    min: number;
  };
  rainfall: {
    annual: number;
    wetSeason: number;
    drySeason: number;
    maxMonthly: number;
    rainyDays: number;
  };
  wind: {
    avgSpeed: number;
    maxSpeed: number;
    prevailingDirection: string;
    designPressure: number;
  };
  solar: {
    irradiance: number;
    sunHours: number;
    uvIndex: number;
  };
  extremes: {
    frostDays: number;
    hotDays: number;
    stormDays: number;
    hailRisk: string;
  };
  climateZone: string;
  buildingDesignCode: string;
  source: string;
}

export interface FloodData {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  floodZone: string;
  factors: {
    elevation: number;
    nearestWaterBody: { name: string; type: string; distance: number } | null;
    historicalPrecipitation: number;
    maxDailyPrecipitation: number;
    drainageCapacity: string;
    urbanization: string;
  };
  historicalEvents: number;
  projectedDepth: {
    '10yr': number;
    '50yr': number;
    '100yr': number;
  };
  mitigations: string[];
  insuranceCategory: string;
  buildingRecommendations: string[];
  source: string;
}

export interface CompleteSiteAnalysis {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    county: string;
    country: string;
  };
  terrain: {
    elevation: number;
    slope: number;
    aspect: string;
    terrainType: string;
    accessibility: string;
  };
  soil: {
    type: string;
    classification: string;
    bearingCapacity: number;
    waterTable: number;
    expansive: boolean;
    corrosivity: string;
    foundationRecommendation: string;
    excavationDifficulty: string;
    properties: {
      clay: number;
      sand: number;
      silt: number;
      ph: number;
    };
  };
  climate: {
    zone: string;
    temperature: { annual: number; max: number; min: number };
    rainfall: { annual: number; maxMonthly: number };
    wind: { avgSpeed: number; maxSpeed: number; designPressure: number };
    solar: { irradiance: number; sunHours: number };
    buildingCode: string;
  };
  flood: {
    riskLevel: string;
    riskScore: number;
    floodZone: string;
    nearestWaterBody: { name: string; distance: number } | null;
    mitigations: string[];
  };
  seismic: {
    zone: number;
    riskLevel: string;
    pga: number;
    requirements: string[];
  };
  infrastructure: {
    roadAccess: { available: boolean; type: string; distance: number };
    electricity: { available: boolean; distance: number; voltage: string };
    water: { available: boolean; type: string; distance: number };
    sewer: { available: boolean; type: string; distance: number };
    telecom: { fiberAvailable: boolean; mobileSignal: string };
  };
  amenities: {
    hospital: number;
    school: number;
    shopping: number;
    police: number;
    publicTransport: number;
  };
  legal: {
    zoning: string;
    maxHeight: number;
    maxCoverage: number;
    setbacks: { front: number; rear: number; side: number };
  };
  overallScore: number;
  buildingSuitability: string;
  recommendations: string[];
  risks: Array<{ type: string; level: string; description: string }>;
  dataSources: string[];
  analysisTimestamp: string;
}

// =============================================================================
// API SERVICE CLASS
// =============================================================================

class BuildingAPIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_SITE_URL || '';
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  }

  // ===========================================================================
  // Elevation / Terrain
  // ===========================================================================

  async getElevation(coords: Coordinates): Promise<ElevationData> {
    return this.fetch('/api/building/elevation', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Soil Analysis
  // ===========================================================================

  async getSoilData(coords: Coordinates): Promise<SoilData> {
    return this.fetch('/api/building/soil', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Climate Data
  // ===========================================================================

  async getClimateData(coords: Coordinates): Promise<ClimateData> {
    return this.fetch('/api/building/climate', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Flood Risk Assessment
  // ===========================================================================

  async getFloodRisk(coords: Coordinates): Promise<FloodData> {
    return this.fetch('/api/building/flood', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Complete Site Analysis - MAIN FUNCTION
  // ===========================================================================

  async analyzeSite(coords: Coordinates, options?: {
    buildingType?: string;
    plotSize?: number;
  }): Promise<CompleteSiteAnalysis> {
    return this.fetch('/api/building/site-analysis', {
      method: 'POST',
      body: JSON.stringify({ ...coords, ...options }),
    });
  }

  // ===========================================================================
  // Solar Analysis (reuse solar APIs)
  // ===========================================================================

  async getSolarData(coords: Coordinates): Promise<any> {
    return this.fetch('/api/solar/nasa-power', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Borehole Analysis (reuse borehole APIs)
  // ===========================================================================

  async getBoreholeData(coords: Coordinates): Promise<any> {
    return this.fetch('/api/borehole/analyze-site', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Image Analysis (OpenAI Vision)
  // ===========================================================================

  async analyzeSiteImage(imageBase64: string): Promise<any> {
    return this.fetch('/api/ml/analyze-image', {
      method: 'POST',
      body: JSON.stringify({
        image: imageBase64,
        type: 'site-analysis',
        prompt: 'Analyze this construction site image. Identify: terrain type, vegetation, existing structures, access roads, potential hazards, and construction feasibility.',
      }),
    });
  }

  // ===========================================================================
  // BOQ Parsing (OpenAI)
  // ===========================================================================

  async parseBOQ(documentBase64: string, filename: string): Promise<any> {
    return this.fetch('/api/ml/parse-boq', {
      method: 'POST',
      body: JSON.stringify({
        document: documentBase64,
        filename,
      }),
    });
  }

  // ===========================================================================
  // Payments
  // ===========================================================================

  async initiateMpesaPayment(phoneNumber: string, amount: number, reference: string) {
    return this.fetch('/api/payments/mpesa', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        amount,
        accountReference: reference,
        transactionDesc: 'Pro Building Suite Analysis',
      }),
    });
  }

  async initiateCardPayment(amount: number, email: string, currency: string = 'KES') {
    return this.fetch('/api/payments/flutterwave', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        email,
        currency,
        redirect_url: `${this.baseUrl}/payment/callback`,
      }),
    });
  }

  // ===========================================================================
  // Notifications
  // ===========================================================================

  async sendReportEmail(to: string, reportData: any) {
    return this.fetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        type: 'email',
        to,
        subject: 'Your Pro Building Suite Analysis Report',
        message: 'Your comprehensive building site analysis is ready.',
        template: 'report',
        data: reportData,
      }),
    });
  }

  // ===========================================================================
  // Floor Plan Generation (FREE AI)
  // ===========================================================================

  async generateFloorPlan(params: {
    description: string;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    totalArea: number;
    style: string;
    plotWidth?: number;
    plotDepth?: number;
    features?: string[];
  }): Promise<any> {
    return this.fetch('/api/building/floor-plan', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ===========================================================================
  // 3D Model Generation (FREE)
  // ===========================================================================

  async generate3DModel(params: {
    description: string;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    totalArea: number;
    style: string;
    format?: 'threejs' | 'gltf';
  }): Promise<any> {
    return this.fetch('/api/building/model-3d', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ===========================================================================
  // Comprehensive Report - ALL 10 OUTPUTS (FREE)
  // ===========================================================================

  async generateComprehensiveReport(params: {
    description: string;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    totalArea: number;
    style: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    clientName?: string;
    currency?: string;
  }): Promise<any> {
    return this.fetch('/api/building/comprehensive-report', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const buildingAPI = new BuildingAPIService();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Run complete site analysis with progress tracking
 */
export async function runCompleteSiteAnalysis(
  coords: Coordinates,
  onProgress?: (step: number, total: number, message: string) => void
): Promise<CompleteSiteAnalysis> {
  const totalSteps = 6;
  let currentStep = 0;

  const report = (message: string) => {
    currentStep++;
    onProgress?.(currentStep, totalSteps, message);
  };

  report('Fetching terrain and elevation data...');
  const elevation = await buildingAPI.getElevation(coords).catch(() => null);

  report('Analyzing soil composition...');
  const soil = await buildingAPI.getSoilData(coords).catch(() => null);

  report('Fetching climate data from NASA POWER...');
  const climate = await buildingAPI.getClimateData(coords).catch(() => null);

  report('Assessing flood risk...');
  const flood = await buildingAPI.getFloodRisk(coords).catch(() => null);

  report('Running comprehensive site analysis...');
  const analysis = await buildingAPI.analyzeSite(coords);

  report('Generating recommendations...');
  // Already included in analysis

  return analysis;
}

/**
 * Quick site check for real-time feedback
 */
export async function quickSiteCheck(coords: Coordinates): Promise<{
  suitability: string;
  score: number;
  mainConcerns: string[];
  elevation: number;
}> {
  try {
    const [elevation, flood] = await Promise.all([
      buildingAPI.getElevation(coords).catch(() => null),
      buildingAPI.getFloodRisk(coords).catch(() => null),
    ]);

    let score = 60;
    const concerns: string[] = [];

    if (elevation) {
      if (elevation.slope > 15) {
        score -= 15;
        concerns.push('Steep terrain');
      }
    }

    if (flood) {
      if (flood.riskLevel === 'high' || flood.riskLevel === 'critical') {
        score -= 20;
        concerns.push(`${flood.riskLevel} flood risk`);
      }
    }

    const suitability = score >= 70 ? 'Excellent' :
      score >= 55 ? 'Good' :
        score >= 40 ? 'Moderate' : 'Challenging';

    return {
      suitability,
      score,
      mainConcerns: concerns,
      elevation: elevation?.elevation || 0,
    };
  } catch {
    return {
      suitability: 'Unknown',
      score: 50,
      mainConcerns: ['Unable to fetch site data'],
      elevation: 0,
    };
  }
}

export default buildingAPI;
