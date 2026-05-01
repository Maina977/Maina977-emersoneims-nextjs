// MARKET INTELLIGENCE - DEMAND FORECAST
// Predicts solar demand trends

export interface DemandForecast {
  id: string;
  region: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    expectedDemandMW: number;
    growthRate: number;
    seasonalityFactor: number;
    confidence: number;
  };
  segments: {
    residential: number;
    commercial: number;
    industrial: number;
    agricultural: number;
  };
  drivers: DemandDriver[];
  createdAt: Date;
}

export interface DemandDriver {
  name: string;
  impact: number; // -1 to 1
  description: string;
}

export interface DemandPrediction {
  daily: number[];
  weekly: number[];
  monthly: number[];
  yearly: number[];
}

class DemandForecastEngine {
  private forecasts: Map<string, DemandForecast> = new Map();
  
  async generateForecast(region: string, days: number = 90): Promise<DemandForecast> {
    const id = this.generateId();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const drivers = await this.identifyDrivers(region);
    const growthRate = this.calculateGrowthRate(region);
    const seasonalityFactor = this.calculateSeasonality(region);
    
    const baseDemand = this.getBaseDemand(region);
    const expectedDemandMW = baseDemand * (1 + growthRate) * seasonalityFactor;
    
    const forecast: DemandForecast = {
      id,
      region,
      period: { start: startDate, end: endDate },
      metrics: {
        expectedDemandMW,
        growthRate,
        seasonalityFactor,
        confidence: 0.85
      },
      segments: await this.getSegmentBreakdown(region, expectedDemandMW),
      drivers,
      createdAt: new Date()
    };
    
    this.forecasts.set(id, forecast);
    return forecast;
  }
  
  async getForecast(region: string): Promise<DemandForecast | null> {
    for (const forecast of this.forecasts.values()) {
      if (forecast.region === region && forecast.period.end > new Date()) {
        return forecast;
      }
    }
    return this.generateForecast(region);
  }
  
  async getDailyPrediction(region: string, days: number = 30): Promise<DemandPrediction['daily']> {
    const forecast = await this.getForecast(region);
    if (!forecast) return [];
    
    const daily: number[] = [];
    const baseDaily = forecast.metrics.expectedDemandMW / 365;
    
    for (let i = 0; i < days; i++) {
      const dayOfWeek = new Date(Date.now() + i * 86400000).getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
      const seasonalFactor = this.getDailySeasonalFactor(i);
      daily.push(baseDaily * weekendFactor * seasonalFactor);
    }
    
    return daily;
  }
  
  async getPeakDemandPeriod(region: string): Promise<{
    month: string;
    expectedDemand: number;
    preparationNeeded: string[];
  }> {
    const forecast = await this.getForecast(region);
    if (!forecast) throw new Error('No forecast available');
    
    const monthlyDemands = await this.getMonthlyPrediction(region);
    const peakMonth = monthlyDemands.reduce((max, curr, idx) => 
      curr > monthlyDemands[max] ? idx : max, 0);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      month: monthNames[peakMonth],
      expectedDemand: monthlyDemands[peakMonth],
      preparationNeeded: [
        'Increase inventory levels',
        'Hire temporary installation staff',
        'Extend customer service hours',
        'Run targeted marketing campaigns'
      ]
    };
  }
  
  async getMonthlyPrediction(region: string): Promise<number[]> {
    const forecast = await this.getForecast(region);
    if (!forecast) return [];
    
    const monthly: number[] = [];
    const baseMonthly = forecast.metrics.expectedDemandMW / 12;
    const seasonalFactors = this.getSeasonalFactors(region);
    
    for (let i = 0; i < 12; i++) {
      monthly.push(baseMonthly * seasonalFactors[i]);
    }
    
    return monthly;
  }
  
  async getYearlyPrediction(region: string, years: number = 5): Promise<DemandPrediction['yearly']> {
    const forecast = await this.getForecast(region);
    if (!forecast) return [];
    
    const yearly: number[] = [];
    let currentDemand = forecast.metrics.expectedDemandMW;
    
    for (let i = 0; i < years; i++) {
      yearly.push(currentDemand);
      currentDemand *= (1 + forecast.metrics.growthRate);
    }
    
    return yearly;
  }
  
  async identifyMarketOpportunities(region: string): Promise<{
    segments: string[];
    growthPotential: number;
    recommendedStrategies: string[];
  }> {
    const forecast = await this.getForecast(region);
    if (!forecast) throw new Error('No forecast available');
    
    const segments = Object.entries(forecast.segments)
      .filter(([_, value]) => value > forecast.metrics.expectedDemandMW * 0.2)
      .map(([key]) => key);
    
    return {
      segments,
      growthPotential: forecast.metrics.growthRate * 100,
      recommendedStrategies: [
        'Expand sales team in high-growth segments',
        'Launch targeted digital campaigns',
        'Develop segment-specific financing options',
        'Partner with industry associations'
      ]
    };
  }
  
  private async identifyDrivers(region: string): Promise<DemandDriver[]> {
    // Identify factors driving demand in the region
    return [
      {
        name: 'Electricity Tariff Increase',
        impact: 0.8,
        description: 'Rising grid tariffs make solar more attractive'
      },
      {
        name: 'Grid Reliability',
        impact: 0.7,
        description: 'Poor grid stability drives battery adoption'
      },
      {
        name: 'Solar Component Prices',
        impact: -0.5,
        description: 'Falling equipment costs increase adoption'
      },
      {
        name: 'Government Incentives',
        impact: 0.4,
        description: 'Tax exemptions and net metering policies'
      }
    ];
  }
  
  private calculateGrowthRate(region: string): number {
    const rates: Record<string, number> = {
      'Nairobi': 0.25,
      'Mombasa': 0.22,
      'Kisumu': 0.28,
      'Eldoret': 0.26,
      'default': 0.20
    };
    return rates[region] || rates.default;
  }
  
  private calculateSeasonality(region: string): number {
    // Seasonal factor based on region's weather patterns
    const currentMonth = new Date().getMonth();
    const seasonalPeaks = [9, 10, 11]; // Oct-Dec peak demand in Kenya
    return seasonalPeaks.includes(currentMonth) ? 1.3 : 0.9;
  }
  
  private getBaseDemand(region: string): number {
    const baseDemands: Record<string, number> = {
      'Nairobi': 150,
      'Mombasa': 80,
      'Kisumu': 60,
      'Eldoret': 45,
      'default': 30
    };
    return baseDemands[region] || baseDemands.default;
  }
  
  private async getSegmentBreakdown(region: string, totalDemand: number): Promise<DemandForecast['segments']> {
    // Segment distribution varies by region
    const distributions: Record<string, { residential: number; commercial: number; industrial: number; agricultural: number }> = {
      'Nairobi': { residential: 0.45, commercial: 0.35, industrial: 0.15, agricultural: 0.05 },
      'Mombasa': { residential: 0.40, commercial: 0.30, industrial: 0.20, agricultural: 0.10 },
      'Kisumu': { residential: 0.35, commercial: 0.25, industrial: 0.15, agricultural: 0.25 },
      'default': { residential: 0.40, commercial: 0.30, industrial: 0.20, agricultural: 0.10 }
    };
    
    const dist = distributions[region] || distributions.default;
    
    return {
      residential: totalDemand * dist.residential,
      commercial: totalDemand * dist.commercial,
      industrial: totalDemand * dist.industrial,
      agricultural: totalDemand * dist.agricultural
    };
  }
  
  private getSeasonalFactors(region: string): number[] {
    // Seasonal factors for solar demand (higher in dry seasons)
    if (region === 'Nairobi') {
      return [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8];
    }
    return [0.8, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7];
  }
  
  private getDailySeasonalFactor(dayOffset: number): number {
    // Adjust for time of year
    const month = new Date(Date.now() + dayOffset * 86400000).getMonth();
    const seasonalFactors = [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 0.95, 0.9];
    return seasonalFactors[month];
  }
  
  private generateId(): string {
    return `demand_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const demandForecast = new DemandForecastEngine();