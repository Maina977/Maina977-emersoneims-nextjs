/**
 * SolarGenius Pro API Service
 * Connects frontend to all backend APIs
 *
 * This is the REAL production service - no mock data
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NASAPowerData {
  location: { latitude: number; longitude: number; elevation: number };
  parameters: Record<string, Record<string, number>>;
  summary: {
    annualGHI: number;
    averageDailyGHI: number;
    peakSunHours: number;
    optimalTiltAngle: number;
    temperatureCoefficient: number;
  };
}

export interface WeatherData {
  location: { name: string; country: string; latitude: number; longitude: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    cloudCover: number;
    visibility: number;
    uvIndex: number;
    description: string;
    icon: string;
    sunrise: string;
    sunset: string;
  };
  solarAnalysis: {
    currentCondition: 'excellent' | 'good' | 'moderate' | 'poor';
    estimatedEfficiency: number;
    daylightHours: number;
    recommendedActions: string[];
  };
  forecast?: Array<{
    date: string;
    temperature: { min: number; max: number };
    humidity: number;
    cloudCover: number;
    precipitation: number;
    windSpeed: number;
    description: string;
    solarImpact: 'excellent' | 'good' | 'moderate' | 'poor';
  }>;
}

export interface ElevationData {
  location: { latitude: number; longitude: number; elevation: number };
  terrain: {
    slope: number;
    aspect: number;
    slopeDirection: string;
    terrainType: string;
  };
  solarImpact: {
    suitability: string;
    shadeRisk: string;
    optimalOrientation: string;
    recommendations: string[];
  };
}

export interface RoofAnalysis {
  roofType: string;
  roofMaterial: string;
  estimatedArea: { total: number; usable: number; confidence: number };
  orientation: { primary: string; optimalForSolar: boolean };
  pitch: { estimated: number; category: string };
  obstacles: Array<{ type: string; impact: string; recommendation: string }>;
  condition: { rating: string; notes: string[] };
  solarSuitability: {
    score: number;
    rating: string;
    maxPanels: number;
    maxCapacity: number;
    recommendations: string[];
  };
}

export interface ParsedBOQ {
  projectInfo: {
    name?: string;
    client?: string;
    location?: string;
    date?: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    category: string;
  }>;
  summary: {
    totalItems: number;
    subtotal: number;
    vat: number;
    grandTotal: number;
    currency: string;
  };
  solarAnalysis?: {
    panelCount: number;
    totalCapacity: number;
    inverterCapacity: number;
    batteryCapacity: number;
    estimatedProduction: number;
    recommendations: string[];
  };
}

export interface PaymentResult {
  success: boolean;
  checkoutRequestId?: string;
  paymentUrl?: string;
  reference?: string;
  error?: string;
}

// =============================================================================
// API SERVICE CLASS
// =============================================================================

class SolarAPIService {
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
  // NASA POWER API - Solar Irradiance Data
  // ===========================================================================

  async getNASAPowerData(coords: Coordinates): Promise<NASAPowerData> {
    return this.fetch('/api/solar/nasa-power', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Weather Data
  // ===========================================================================

  async getWeatherData(coords: Coordinates, includeForecast = false): Promise<WeatherData> {
    return this.fetch('/api/solar/weather', {
      method: 'POST',
      body: JSON.stringify({
        ...coords,
        type: includeForecast ? 'forecast' : 'current',
      }),
    });
  }

  // ===========================================================================
  // Elevation / Terrain Data
  // ===========================================================================

  async getElevationData(coords: Coordinates): Promise<ElevationData> {
    return this.fetch('/api/solar/elevation', {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  }

  // ===========================================================================
  // Complete Site Analysis
  // ===========================================================================

  async getCompleteSiteAnalysis(coords: Coordinates): Promise<{
    nasa: NASAPowerData;
    weather: WeatherData;
    elevation: ElevationData;
    summary: {
      location: string;
      peakSunHours: number;
      optimalTilt: number;
      terrainSuitability: string;
      currentConditions: string;
      recommendations: string[];
    };
  }> {
    // Fetch all data in parallel
    const [nasa, weather, elevation] = await Promise.all([
      this.getNASAPowerData(coords),
      this.getWeatherData(coords, true),
      this.getElevationData(coords),
    ]);

    // Generate summary
    const recommendations: string[] = [];

    if (nasa.summary.peakSunHours >= 5) {
      recommendations.push('Excellent solar resource - ideal for solar installation');
    } else if (nasa.summary.peakSunHours >= 4) {
      recommendations.push('Good solar resource - suitable for solar installation');
    } else {
      recommendations.push('Moderate solar resource - consider system sizing carefully');
    }

    if (elevation.solarImpact.suitability === 'excellent' || elevation.solarImpact.suitability === 'good') {
      recommendations.push('Terrain is suitable for standard mounting systems');
    } else {
      recommendations.push('Consider specialized mounting due to terrain conditions');
    }

    recommendations.push(...weather.solarAnalysis.recommendedActions);
    recommendations.push(...elevation.solarImpact.recommendations);

    return {
      nasa,
      weather,
      elevation,
      summary: {
        location: weather.location.name || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
        peakSunHours: nasa.summary.peakSunHours,
        optimalTilt: nasa.summary.optimalTiltAngle,
        terrainSuitability: elevation.solarImpact.suitability,
        currentConditions: weather.solarAnalysis.currentCondition,
        recommendations: [...new Set(recommendations)].slice(0, 6),
      },
    };
  }

  // ===========================================================================
  // Image Analysis
  // ===========================================================================

  async analyzeImage(imageData: string): Promise<RoofAnalysis> {
    const result = await this.fetch<{ analysis: RoofAnalysis }>('/api/ml/analyze-image', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    });
    return result.analysis;
  }

  // ===========================================================================
  // Video Analysis
  // ===========================================================================

  async analyzeVideo(frameUrls: string[]): Promise<{
    overview: { siteType: string; totalAreaEstimate: number; overallSuitability: number };
    roofSections: Array<{ id: string; type: string; area: number; maxPanels: number }>;
    recommendations: {
      systemSize: { optimal: number };
      panelCount: { optimal: number };
      nextSteps: string[];
    };
  }> {
    const result = await this.fetch<{ analysis: any }>('/api/ml/analyze-video', {
      method: 'POST',
      body: JSON.stringify({ frameUrls }),
    });
    return result.analysis;
  }

  // ===========================================================================
  // BOQ Parsing
  // ===========================================================================

  async parseBOQ(document: string, documentType: string = 'auto'): Promise<ParsedBOQ> {
    const result = await this.fetch<{ parsedBOQ: ParsedBOQ }>('/api/ml/parse-boq', {
      method: 'POST',
      body: JSON.stringify({ document, documentType }),
    });
    return result.parsedBOQ;
  }

  // ===========================================================================
  // PAYMENTS
  // ===========================================================================

  async initiateMpesaPayment(
    phoneNumber: string,
    amount: number,
    reference: string
  ): Promise<PaymentResult> {
    try {
      const result = await this.fetch<{
        CheckoutRequestID: string;
        CustomerMessage: string;
      }>('/api/payments/mpesa', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          amount,
          accountReference: reference,
          transactionDesc: 'SolarGenius Pro Payment',
        }),
      });

      return {
        success: true,
        checkoutRequestId: result.CheckoutRequestID,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  async checkMpesaPaymentStatus(checkoutRequestId: string): Promise<{
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    receipt?: string;
    amount?: number;
  }> {
    const response = await fetch(
      `/api/payments/mpesa/callback?checkoutRequestId=${checkoutRequestId}`
    );
    const data = await response.json();

    if (data.success) {
      return {
        status: data.data.status,
        receipt: data.data.receipt,
        amount: data.data.amount,
      };
    }

    return { status: 'pending' };
  }

  async initiateFlutterwavePayment(
    amount: number,
    email: string,
    name: string,
    phone?: string
  ): Promise<PaymentResult> {
    try {
      const result = await this.fetch<{
        link: string;
        transactionRef: string;
      }>('/api/payments/flutterwave', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          email,
          name,
          phone,
          currency: 'KES',
          description: 'SolarGenius Pro Solar Quote',
        }),
      });

      return {
        success: true,
        paymentUrl: result.link,
        reference: result.transactionRef,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  async initiatePaystackPayment(
    amount: number,
    email: string
  ): Promise<PaymentResult> {
    try {
      const result = await this.fetch<{
        authorizationUrl: string;
        reference: string;
      }>('/api/payments/paystack', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount * 100, // Convert to smallest unit
          email,
          currency: 'KES',
        }),
      });

      return {
        success: true,
        paymentUrl: result.authorizationUrl,
        reference: result.reference,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  // ===========================================================================
  // NOTIFICATIONS
  // ===========================================================================

  async sendEmail(
    to: string,
    subject: string,
    message: string,
    template?: 'quote' | 'payment' | 'report',
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      await this.fetch('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          type: 'email',
          to,
          subject,
          message,
          template,
          data,
        }),
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      await this.fetch('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          type: 'sms',
          to,
          message,
        }),
      });
      return true;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const solarAPI = new SolarAPIService();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export async function calculateSolarSystem(params: {
  coordinates: Coordinates;
  monthlyConsumption?: number;  // kWh
  roofArea?: number;            // m²
  budget?: number;              // KES
}): Promise<{
  recommendedSize: number;      // kWp
  panelCount: number;
  annualProduction: number;     // kWh
  estimatedCost: number;        // KES
  paybackPeriod: number;        // years
  roi: number;                  // %
  co2Savings: number;           // kg/year
}> {
  // Get real solar data
  const nasa = await solarAPI.getNASAPowerData(params.coordinates);

  // Calculate based on consumption or area
  let systemSize: number;

  if (params.monthlyConsumption) {
    // Size based on consumption: annual consumption / (peak sun hours × 365 × 0.8 efficiency)
    const annualConsumption = params.monthlyConsumption * 12;
    systemSize = annualConsumption / (nasa.summary.peakSunHours * 365 * 0.8);
  } else if (params.roofArea) {
    // Size based on area: usable area × 0.15 (panel efficiency) × 0.7 (utilization)
    systemSize = params.roofArea * 0.15 * 0.7;
  } else {
    // Default 5kWp residential system
    systemSize = 5;
  }

  // Limit by budget if provided
  const costPerKWp = 85000; // KES
  if (params.budget) {
    const maxSizeByBudget = params.budget / costPerKWp;
    systemSize = Math.min(systemSize, maxSizeByBudget);
  }

  // Round to reasonable size
  systemSize = Math.round(systemSize * 10) / 10;

  // Calculate outputs
  const panelWattage = 400; // W per panel
  const panelCount = Math.ceil((systemSize * 1000) / panelWattage);
  const actualSize = (panelCount * panelWattage) / 1000;

  const annualProduction = actualSize * nasa.summary.peakSunHours * 365 * 0.8;
  const estimatedCost = actualSize * costPerKWp;

  // Financial calculations (Kenya electricity ~KES 20/kWh)
  const electricityRate = 20;
  const annualSavings = annualProduction * electricityRate;
  const paybackPeriod = estimatedCost / annualSavings;
  const roi = ((annualSavings * 25 - estimatedCost) / estimatedCost) * 100; // 25-year ROI

  // Environmental impact (0.4 kg CO2 per kWh in Kenya)
  const co2Savings = annualProduction * 0.4;

  return {
    recommendedSize: actualSize,
    panelCount,
    annualProduction: Math.round(annualProduction),
    estimatedCost: Math.round(estimatedCost),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    roi: Math.round(roi),
    co2Savings: Math.round(co2Savings),
  };
}

export default solarAPI;
