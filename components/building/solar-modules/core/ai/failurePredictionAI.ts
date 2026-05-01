// CORE AI - FAILURE PREDICTION
// Predicts component failures before they occur

export interface FailurePredictionRequest {
  systemId: string;
  component: 'inverter' | 'battery' | 'panels' | 'wiring' | 'all';
  historicalData?: ComponentTelemetry[];
  forecastDays?: number;
}

export interface ComponentTelemetry {
  timestamp: Date;
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  errorCount: number;
  runtimeHours: number;
}

export interface FailurePredictionResponse {
  predictions: ComponentPrediction[];
  overallRisk: RiskLevel;
  recommendations: MaintenanceRecommendation[];
  confidence: number;
}

export interface ComponentPrediction {
  component: string;
  failureProbability: number;
  estimatedRemainingLife: number;
  riskLevel: RiskLevel;
  contributingFactors: Factor[];
  nextInspectionDate: Date;
}

export interface Factor {
  name: string;
  impact: number;
  currentValue: number;
  threshold: number;
}

export interface MaintenanceRecommendation {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedTime: number;
  benefits: string[];
}

export type RiskLevel = 'very_low' | 'low' | 'medium' | 'high' | 'critical';

class FailurePredictionAI {
  private predictionsCache: Map<string, FailurePredictionResponse> = new Map();
  
  async predict(request: FailurePredictionRequest): Promise<FailurePredictionResponse> {
    const cacheKey = `${request.systemId}_${request.component}_${Date.now()}`;
    
    // Check cache (5 minute TTL)
    const cached = this.predictionsCache.get(request.systemId);
    if (cached && Date.now() - (cached as any)._timestamp < 300000) {
      return cached;
    }
    
    const predictions: ComponentPrediction[] = [];
    
    if (request.component === 'inverter' || request.component === 'all') {
      predictions.push(await this.predictInverterFailure(request));
    }
    if (request.component === 'battery' || request.component === 'all') {
      predictions.push(await this.predictBatteryFailure(request));
    }
    if (request.component === 'panels' || request.component === 'all') {
      predictions.push(await this.predictPanelDegradation(request));
    }
    if (request.component === 'wiring' || request.component === 'all') {
      predictions.push(await this.predictWiringFailure(request));
    }
    
    const overallRisk = this.calculateOverallRisk(predictions);
    const recommendations = this.generateRecommendations(predictions);
    const confidence = this.calculateConfidence(predictions, request.historicalData);
    
    const response: FailurePredictionResponse = {
      predictions,
      overallRisk,
      recommendations,
      confidence
    };
    
    (response as any)._timestamp = Date.now();
    this.predictionsCache.set(request.systemId, response);
    
    return response;
  }
  
  private async predictInverterFailure(request: FailurePredictionRequest): Promise<ComponentPrediction> {
    // Get telemetry data
    const telemetry = request.historicalData || await this.getTelemetry(request.systemId, 'inverter');
    
    let failureProbability = 5; // Base 5% probability
    const contributingFactors: Factor[] = [];
    
    // Analyze temperature
    if (telemetry.length > 0) {
      const avgTemp = telemetry.reduce((sum, t) => sum + t.temperature, 0) / telemetry.length;
      const maxTemp = Math.max(...telemetry.map(t => t.temperature));
      
      if (avgTemp > 65) {
        failureProbability += 25;
        contributingFactors.push({
          name: 'High Operating Temperature',
          impact: 25,
          currentValue: avgTemp,
          threshold: 65
        });
      } else if (avgTemp > 55) {
        failureProbability += 15;
        contributingFactors.push({
          name: 'Elevated Temperature',
          impact: 15,
          currentValue: avgTemp,
          threshold: 55
        });
      }
      
      if (maxTemp > 75) {
        failureProbability += 15;
        contributingFactors.push({
          name: 'Temperature Spikes',
          impact: 15,
          currentValue: maxTemp,
          threshold: 75
        });
      }
    }
    
    // Analyze error codes
    const errorCount = telemetry.reduce((sum, t) => sum + t.errorCount, 0);
    if (errorCount > 10) {
      failureProbability += 20;
      contributingFactors.push({
        name: 'Frequent Errors',
        impact: 20,
        currentValue: errorCount,
        threshold: 10
      });
    } else if (errorCount > 5) {
      failureProbability += 10;
    }
    
    // Analyze runtime
    const runtimeHours = telemetry[telemetry.length - 1]?.runtimeHours || 0;
    const runtimeYears = runtimeHours / 8760;
    
    if (runtimeYears > 8) {
      failureProbability += 20;
      contributingFactors.push({
        name: 'Component Age',
        impact: 20,
        currentValue: runtimeYears,
        threshold: 8
      });
    } else if (runtimeYears > 5) {
      failureProbability += 10;
    }
    
    failureProbability = Math.min(95, failureProbability);
    
    let riskLevel: RiskLevel = 'low';
    if (failureProbability > 70) riskLevel = 'critical';
    else if (failureProbability > 50) riskLevel = 'high';
    else if (failureProbability > 25) riskLevel = 'medium';
    else if (failureProbability > 10) riskLevel = 'low';
    else riskLevel = 'very_low';
    
    const estimatedRemainingLife = this.calculateRemainingLife(failureProbability, runtimeYears, 'inverter');
    const nextInspectionDate = new Date();
    nextInspectionDate.setMonth(nextInspectionDate.getMonth() + (riskLevel === 'critical' ? 1 : riskLevel === 'high' ? 3 : 6));
    
    return {
      component: 'inverter',
      failureProbability: Math.round(failureProbability),
      estimatedRemainingLife,
      riskLevel,
      contributingFactors,
      nextInspectionDate
    };
  }
  
  private async predictBatteryFailure(request: FailurePredictionRequest): Promise<ComponentPrediction> {
    const telemetry = request.historicalData || await this.getTelemetry(request.systemId, 'battery');
    
    let failureProbability = 10;
    const contributingFactors: Factor[] = [];
    
    // Analyze cycle count (simulated)
    const estimatedCycles = 500 + Math.random() * 1000;
    if (estimatedCycles > 3000) {
      failureProbability += 30;
      contributingFactors.push({
        name: 'High Cycle Count',
        impact: 30,
        currentValue: estimatedCycles,
        threshold: 3000
      });
    } else if (estimatedCycles > 2000) {
      failureProbability += 15;
    }
    
    // Analyze temperature
    if (telemetry.length > 0) {
      const avgTemp = telemetry.reduce((sum, t) => sum + t.temperature, 0) / telemetry.length;
      if (avgTemp > 35) {
        failureProbability += 20;
        contributingFactors.push({
          name: 'High Operating Temperature',
          impact: 20,
          currentValue: avgTemp,
          threshold: 35
        });
      }
    }
    
    failureProbability = Math.min(90, failureProbability);
    
    let riskLevel: RiskLevel = 'low';
    if (failureProbability > 60) riskLevel = 'high';
    else if (failureProbability > 35) riskLevel = 'medium';
    else if (failureProbability > 15) riskLevel = 'low';
    else riskLevel = 'very_low';
    
    const estimatedRemainingLife = this.calculateRemainingLife(failureProbability, 0, 'battery');
    const nextInspectionDate = new Date();
    nextInspectionDate.setMonth(nextInspectionDate.getMonth() + (riskLevel === 'high' ? 2 : 6));
    
    return {
      component: 'battery',
      failureProbability: Math.round(failureProbability),
      estimatedRemainingLife,
      riskLevel,
      contributingFactors,
      nextInspectionDate
    };
  }
  
  private async predictPanelDegradation(request: FailurePredictionRequest): Promise<ComponentPrediction> {
    let failureProbability = 5;
    const contributingFactors: Factor[] = [];
    
    // Panel degradation is typically slow
    const ageYears = 2 + Math.random() * 8;
    if (ageYears > 20) {
      failureProbability += 30;
      contributingFactors.push({
        name: 'Panel Age',
        impact: 30,
        currentValue: ageYears,
        threshold: 20
      });
    } else if (ageYears > 15) {
      failureProbability += 15;
    }
    
    failureProbability = Math.min(70, failureProbability);
    
    let riskLevel: RiskLevel = 'low';
    if (failureProbability > 50) riskLevel = 'high';
    else if (failureProbability > 30) riskLevel = 'medium';
    else riskLevel = 'low';
    
    const estimatedRemainingLife = this.calculateRemainingLife(failureProbability, ageYears, 'panels');
    const nextInspectionDate = new Date();
    nextInspectionDate.setFullYear(nextInspectionDate.getFullYear() + 1);
    
    return {
      component: 'panels',
      failureProbability: Math.round(failureProbability),
      estimatedRemainingLife,
      riskLevel,
      contributingFactors,
      nextInspectionDate
    };
  }
  
  private async predictWiringFailure(request: FailurePredictionRequest): Promise<ComponentPrediction> {
    let failureProbability = 8;
    const contributingFactors: Factor[] = [];
    
    const ageYears = 3 + Math.random() * 10;
    if (ageYears > 15) {
      failureProbability += 25;
      contributingFactors.push({
        name: 'Installation Age',
        impact: 25,
        currentValue: ageYears,
        threshold: 15
      });
    }
    
    failureProbability = Math.min(60, failureProbability);
    
    let riskLevel: RiskLevel = 'low';
    if (failureProbability > 40) riskLevel = 'medium';
    else riskLevel = 'low';
    
    const estimatedRemainingLife = 20 - ageYears;
    const nextInspectionDate = new Date();
    nextInspectionDate.setFullYear(nextInspectionDate.getFullYear() + 2);
    
    return {
      component: 'wiring',
      failureProbability: Math.round(failureProbability),
      estimatedRemainingLife: Math.max(1, Math.round(estimatedRemainingLife)),
      riskLevel,
      contributingFactors,
      nextInspectionDate
    };
  }
  
  private calculateOverallRisk(predictions: ComponentPrediction[]): RiskLevel {
    const riskScores = {
      critical: 100,
      high: 70,
      medium: 40,
      low: 15,
      very_low: 5
    };
    
    const maxRisk = Math.max(...predictions.map(p => riskScores[p.riskLevel]));
    
    if (maxRisk >= 70) return 'high';
    if (maxRisk >= 40) return 'medium';
    if (maxRisk >= 15) return 'low';
    return 'very_low';
  }
  
  private generateRecommendations(predictions: ComponentPrediction[]): MaintenanceRecommendation[] {
    const recommendations: MaintenanceRecommendation[] = [];
    
    for (const prediction of predictions) {
      if (prediction.riskLevel === 'critical' || prediction.riskLevel === 'high') {
        recommendations.push({
          action: `Schedule immediate ${prediction.component} inspection`,
          priority: prediction.riskLevel === 'critical' ? 'critical' : 'high',
          estimatedCost: prediction.component === 'inverter' ? 5000 : 
                        prediction.component === 'battery' ? 8000 : 3000,
          estimatedTime: prediction.component === 'inverter' ? 2 : 
                        prediction.component === 'battery' ? 3 : 1,
          benefits: [`Prevent unexpected ${prediction.component} failure`, 'Extend equipment life']
        });
      } else if (prediction.riskLevel === 'medium') {
        recommendations.push({
          action: `Schedule ${prediction.component} maintenance`,
          priority: 'medium',
          estimatedCost: 2500,
          estimatedTime: 1,
          benefits: ['Optimize performance', 'Prevent future issues']
        });
      }
    }
    
    return recommendations;
  }
  
  private calculateConfidence(predictions: ComponentPrediction[], historicalData?: ComponentTelemetry[]): number {
    let confidence = 85;
    
    if (!historicalData || historicalData.length < 100) {
      confidence -= 20;
    }
    
    if (predictions.some(p => p.riskLevel === 'critical')) {
      confidence -= 10;
    }
    
    return Math.max(50, Math.min(95, confidence));
  }
  
  private calculateRemainingLife(failureProbability: number, currentAge: number, component: string): number {
    const maxLife = {
      inverter: 12,
      battery: 10,
      panels: 25,
      wiring: 20
    };
    
    const remainingPercent = (100 - failureProbability) / 100;
    const maxLifeYears = maxLife[component as keyof typeof maxLife];
    const remainingYears = maxLifeYears * remainingPercent - currentAge;
    
    return Math.max(1, Math.round(remainingYears));
  }
  
  private async getTelemetry(systemId: string, component: string): Promise<ComponentTelemetry[]> {
    // In production, fetch from database
    return Array(30).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000),
      temperature: 45 + Math.random() * 15,
      voltage: 380 + (Math.random() - 0.5) * 20,
      current: 15 + Math.random() * 10,
      power: 5000 + Math.random() * 2000,
      errorCount: Math.random() > 0.9 ? 1 : 0,
      runtimeHours: (24 * 365 * 2) + i
    }));
  }
  
  async getMaintenanceSchedule(systemId: string, months: number = 12): Promise<{
    tasks: Array<{ date: Date; component: string; task: string; estimatedCost: number }>;
    totalCost: number;
  }> {
    const predictions = await this.predict({ systemId, component: 'all' });
    const tasks = [];
    let totalCost = 0;
    
    for (const prediction of predictions) {
      tasks.push({
        date: prediction.nextInspectionDate,
        component: prediction.component,
        task: `${prediction.component.charAt(0).toUpperCase() + prediction.component.slice(1)} inspection and maintenance`,
        estimatedCost: prediction.component === 'inverter' ? 5000 : 
                       prediction.component === 'battery' ? 8000 : 3000
      });
      totalCost += 5000;
    }
    
    return { tasks, totalCost };
  }
  
  async getFailureProbabilityTrend(systemId: string, days: number = 30): Promise<{
    dates: Date[];
    probabilities: number[];
    component: string;
  }> {
    const dates = [];
    const probabilities = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
      probabilities.push(5 + Math.sin(i / 10) * 10 + Math.random() * 5);
    }
    
    return {
      dates,
      probabilities: probabilities.map(p => Math.round(p)),
      component: 'inverter'
    };
  }
}

export const failurePredictionAI = new FailurePredictionAI();