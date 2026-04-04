// CORE AI - ENERGY SIMULATION ENGINE
// AI-powered energy production simulation

export interface EnergySimulationRequest {
  systemSpecs: {
    panelCount: number;
    panelWattage: number;
    inverterEfficiency: number;
    tilt: number;
    azimuth: number;
  };
  location: {
    lat: number;
    lng: number;
    elevation?: number;
  };
  weatherData?: {
    irradiance: number[];
    temperature: number[];
    cloudCover: number[];
  };
  simulationPeriod: {
    startDate: Date;
    endDate: Date;
    interval: 'hourly' | 'daily' | 'monthly';
  };
}

export interface EnergySimulationResponse {
  predictions: TimeSeriesPrediction[];
  totalEnergy: number;
  averageDaily: number;
  peakPower: number;
  capacityFactor: number;
  confidence: ConfidenceInterval;
  metadata: SimulationMetadata;
}

export interface TimeSeriesPrediction {
  timestamp: Date;
  value: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface ConfidenceInterval {
  p10: number;
  p50: number;
  p90: number;
  p95: number;
}

export interface SimulationMetadata {
  modelVersion: string;
  simulationTime: number;
  inputQuality: number;
  warnings: string[];
}

class EnergySimulationEngine {
  private modelVersion = '3.0.0';
  
  async simulate(request: EnergySimulationRequest): Promise<EnergySimulationResponse> {
    const startTime = Date.now();
    const warnings: string[] = [];
    
    // Validate inputs
    const inputQuality = this.validateInputs(request, warnings);
    
    // Calculate base production using PVWatts algorithm
    const baseProduction = this.calculateBaseProduction(request);
    
    // Apply weather adjustments
    const weatherAdjusted = this.applyWeatherAdjustments(baseProduction, request);
    
    // Apply ML-based corrections
    const mlCorrected = await this.applyMLCorrections(weatherAdjusted, request);
    
    // Generate time series
    const timeSeries = this.generateTimeSeries(mlCorrected, request);
    
    // Calculate statistics
    const totalEnergy = timeSeries.reduce((sum, t) => sum + t.value, 0);
    const averageDaily = totalEnergy / this.getDaysInPeriod(request.simulationPeriod);
    const peakPower = Math.max(...timeSeries.map(t => t.value)) / 1000;
    const capacityFactor = (totalEnergy / this.getHoursInPeriod(request.simulationPeriod)) / (request.systemSpecs.panelCount * request.systemSpecs.panelWattage / 1000) * 100;
    
    // Calculate confidence intervals
    const confidence = this.calculateConfidence(inputQuality, timeSeries.length);
    
    return {
      predictions: timeSeries,
      totalEnergy: Math.round(totalEnergy),
      averageDaily: Math.round(averageDaily),
      peakPower: Math.round(peakPower * 100) / 100,
      capacityFactor: Math.round(capacityFactor * 10) / 10,
      confidence,
      metadata: {
        modelVersion: this.modelVersion,
        simulationTime: Date.now() - startTime,
        inputQuality,
        warnings
      }
    };
  }
  
  private validateInputs(request: EnergySimulationRequest, warnings: string[]): number {
    let quality = 100;
    
    if (!request.location.lat || !request.location.lng) {
      quality -= 30;
      warnings.push('Missing location coordinates');
    }
    
    if (request.systemSpecs.panelCount <= 0) {
      quality -= 50;
      warnings.push('Invalid panel count');
    }
    
    if (request.systemSpecs.tilt < 0 || request.systemSpecs.tilt > 90) {
      quality -= 20;
      warnings.push('Unusual tilt angle');
    }
    
    if (!request.weatherData) {
      quality -= 40;
      warnings.push('Using default weather data - accuracy reduced');
    }
    
    return Math.max(0, quality);
  }
  
  private calculateBaseProduction(request: EnergySimulationRequest): number {
    const totalWattage = request.systemSpecs.panelCount * request.systemSpecs.panelWattage;
    const irradiance = this.getAverageIrradiance(request.location.lat);
    
    // PVWatts simplified formula
    const tiltFactor = Math.cos((request.systemSpecs.tilt - Math.abs(request.location.lat) * 0.9) * Math.PI / 180);
    const azimuthFactor = Math.cos((request.systemSpecs.azimuth - 180) * Math.PI / 180);
    
    const effectiveIrradiance = irradiance * tiltFactor * azimuthFactor;
    const annualEnergy = totalWattage * effectiveIrradiance * 365 * request.systemSpecs.inverterEfficiency / 1000;
    
    return annualEnergy;
  }
  
  private getAverageIrradiance(latitude: number): number {
    const absLat = Math.abs(latitude);
    if (absLat < 10) return 5.5;
    if (absLat < 20) return 5.2;
    if (absLat < 30) return 4.8;
    if (absLat < 40) return 4.2;
    return 3.5;
  }
  
  private applyWeatherAdjustments(production: number, request: EnergySimulationRequest): number {
    if (!request.weatherData) return production;
    
    const avgCloudCover = request.weatherData.cloudCover.reduce((a, b) => a + b, 0) / request.weatherData.cloudCover.length;
    const cloudFactor = 1 - (avgCloudCover / 100) * 0.5;
    
    const avgTemperature = request.weatherData.temperature.reduce((a, b) => a + b, 0) / request.weatherData.temperature.length;
    const tempFactor = 1 - Math.max(0, (avgTemperature - 25) * 0.004);
    
    return production * cloudFactor * tempFactor;
  }
  
  private async applyMLCorrections(production: number, request: EnergySimulationRequest): Promise<number> {
    // Simulate ML model corrections
    // In production, this would call a trained model
    const correctionFactor = 0.95 + Math.random() * 0.1;
    return production * correctionFactor;
  }
  
  private generateTimeSeries(annualEnergy: number, request: EnergySimulationRequest): TimeSeriesPrediction[] {
    const series: TimeSeriesPrediction[] = [];
    const startDate = new Date(request.simulationPeriod.startDate);
    const endDate = new Date(request.simulationPeriod.endDate);
    const intervalHours = request.simulationPeriod.interval === 'hourly' ? 1 : 
                          request.simulationPeriod.interval === 'daily' ? 24 : 720;
    
    const dailyAverage = annualEnergy / 365;
    const seasonalFactors = this.getSeasonalFactors(request.location.lat);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfYear = this.getDayOfYear(currentDate);
      const month = currentDate.getMonth();
      const seasonalFactor = seasonalFactors[month];
      
      let value: number;
      if (request.simulationPeriod.interval === 'hourly') {
        const hourOfDay = currentDate.getHours();
        const hourlyFactor = Math.sin((hourOfDay - 6) / 12 * Math.PI);
        value = dailyAverage * seasonalFactor * hourlyFactor * 0.95;
      } else {
        value = dailyAverage * seasonalFactor;
      }
      
      const uncertainty = 0.1 * (1 - seasonalFactor);
      
      series.push({
        timestamp: new Date(currentDate),
        value: Math.round(value),
        lowerBound: Math.round(value * (1 - uncertainty)),
        upperBound: Math.round(value * (1 + uncertainty)),
        confidence: 1 - uncertainty
      });
      
      if (intervalHours === 1) currentDate.setHours(currentDate.getHours() + 1);
      else if (intervalHours === 24) currentDate.setDate(currentDate.getDate() + 1);
      else currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return series;
  }
  
  private getSeasonalFactors(latitude: number): number[] {
    const isNorthern = latitude > 0;
    if (isNorthern) {
      return [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.8, 0.7];
    }
    return [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
  }
  
  private calculateConfidence(inputQuality: number, sampleCount: number): ConfidenceInterval {
    const baseUncertainty = (100 - inputQuality) / 100;
    const sampleUncertainty = 1 / Math.sqrt(sampleCount);
    const totalUncertainty = baseUncertainty + sampleUncertainty;
    
    return {
      p10: Math.max(0, 1 - totalUncertainty * 1.28),
      p50: 1 - totalUncertainty * 0.67,
      p90: 1 + totalUncertainty * 1.28,
      p95: 1 + totalUncertainty * 1.64
    };
  }
  
  private getDaysInPeriod(period: EnergySimulationRequest['simulationPeriod']): number {
    const diff = period.endDate.getTime() - period.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  private getHoursInPeriod(period: EnergySimulationRequest['simulationPeriod']): number {
    const diff = period.endDate.getTime() - period.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60));
  }
  
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 86400000;
    return Math.floor(diff / oneDay);
  }
}

export const energySimulationEngine = new EnergySimulationEngine();