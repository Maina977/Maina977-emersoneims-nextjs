// CORE DECISION ENGINE - RECOMMENDATION ENGINE
// AI-powered system recommendations

export interface RecommendationRequest {
  location: { lat: number; lng: number; address: string };
  consumption: {
    daily: number;
    monthly?: number;
    peak?: number;
  };
  budget?: number;
  preferences: {
    backupHours: number;
    gridTied: boolean;
    preferLocalContent?: boolean;
    environmentalPriority?: boolean;
  };
  constraints?: {
    roofArea?: number;
    maxInverterSize?: number;
    hoaRestrictions?: boolean;
  };
}

export interface RecommendationResponse {
  id: string;
  timestamp: Date;
  recommendation: {
    systemType: 'solar_only' | 'solar_battery' | 'hybrid' | 'offgrid';
    systemSizeKw: number;
    batteryKwh: number;
    inverterKw: number;
    confidence: number;
  };
  financials: {
    totalCost: number;
    monthlySaving: number;
    paybackYears: number;
    roi10Year: number;
    npv: number;
    irr: number;
  };
  environmental: {
    co2OffsetTons: number;
    treesEquivalent: number;
    homesPoweredEquivalent: number;
  };
  alternatives: AlternativeRecommendation[];
  reasoning: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AlternativeRecommendation {
  systemType: string;
  systemSizeKw: number;
  totalCost: number;
  monthlySaving: number;
  paybackYears: number;
  pros: string[];
  cons: string[];
}

class RecommendationEngine {
  async generateRecommendation(request: RecommendationRequest): Promise<RecommendationResponse> {
    const id = this.generateId();
    
    // Calculate solar potential
    const solarPotential = await this.calculateSolarPotential(request.location);
    const gridTariff = await this.getGridTariff(request.location);
    const consumption = request.consumption.daily;
    
    // Evaluate options
    const options = [
      await this.evaluateSolarOnly(consumption, solarPotential, gridTariff, request),
      await this.evaluateSolarBattery(consumption, solarPotential, gridTariff, request),
      await this.evaluateHybrid(consumption, solarPotential, gridTariff, request),
      await this.evaluateOffgrid(consumption, solarPotential, gridTariff, request)
    ];
    
    // Score and select best option
    const scored = await this.scoreOptions(options, request.preferences);
    const best = scored[0];
    
    // Calculate environmental impact
    const environmental = this.calculateEnvironmentalImpact(best.systemSizeKw);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(best, request, solarPotential, gridTariff);
    
    // Assess risk
    const riskLevel = await this.assessRisk(best, request);
    
    return {
      id,
      timestamp: new Date(),
      recommendation: {
        systemType: best.systemType,
        systemSizeKw: best.systemSizeKw,
        batteryKwh: best.batteryKwh,
        inverterKw: best.inverterKw,
        confidence: best.confidence
      },
      financials: {
        totalCost: best.totalCost,
        monthlySaving: best.monthlySaving,
        paybackYears: best.paybackYears,
        roi10Year: best.roi10Year,
        npv: best.npv,
        irr: best.irr
      },
      environmental,
      alternatives: scored.slice(1, 4).map(alt => ({
        systemType: alt.systemType,
        systemSizeKw: alt.systemSizeKw,
        totalCost: alt.totalCost,
        monthlySaving: alt.monthlySaving,
        paybackYears: alt.paybackYears,
        pros: alt.pros,
        cons: alt.cons
      })),
      reasoning,
      riskLevel
    };
  }
  
  private async calculateSolarPotential(location: { lat: number; lng: number }): Promise<number> {
    // In production, call NASA POWER API
    return 5.2; // kWh/m²/day
  }
  
  private async getGridTariff(location: { lat: number; lng: number }): Promise<number> {
    // In production, lookup by location
    return 25.5; // KSh/kWh
  }
  
  private async evaluateSolarOnly(
    consumption: number,
    solarPotential: number,
    gridTariff: number,
    request: RecommendationRequest
  ): Promise<any> {
    const systemSizeKw = consumption / (solarPotential * 0.85);
    const totalCost = systemSizeKw * 95000;
    const monthlyProduction = systemSizeKw * solarPotential * 30 * 0.85;
    const monthlySaving = monthlyProduction * gridTariff / 1000;
    const paybackYears = totalCost / (monthlySaving * 12);
    const roi10Year = ((monthlySaving * 12 * 10 - totalCost) / totalCost) * 100;
    const npv = monthlySaving * 12 * 10 - totalCost;
    const irr = this.calculateIRR(totalCost, monthlySaving * 12, 10);
    
    return {
      systemType: 'solar_only',
      systemSizeKw: Math.round(systemSizeKw * 100) / 100,
      batteryKwh: 0,
      inverterKw: Math.round(systemSizeKw * 0.85 * 100) / 100,
      totalCost: Math.round(totalCost),
      monthlySaving: Math.round(monthlySaving),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi10Year: Math.round(roi10Year),
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      confidence: 85,
      pros: ['Lowest upfront cost', 'Simple installation', 'No battery maintenance'],
      cons: ['No backup during outages', 'Nighttime grid dependency']
    };
  }
  
  private async evaluateSolarBattery(
    consumption: number,
    solarPotential: number,
    gridTariff: number,
    request: RecommendationRequest
  ): Promise<any> {
    const systemSizeKw = consumption / (solarPotential * 0.85);
    const batteryKwh = request.preferences.backupHours * (consumption / 24) * 1.2;
    const totalCost = systemSizeKw * 95000 + batteryKwh * 36000;
    const monthlyProduction = systemSizeKw * solarPotential * 30 * 0.85;
    const monthlySaving = monthlyProduction * gridTariff / 1000;
    const paybackYears = totalCost / (monthlySaving * 12);
    const roi10Year = ((monthlySaving * 12 * 10 - totalCost) / totalCost) * 100;
    const npv = monthlySaving * 12 * 10 - totalCost;
    const irr = this.calculateIRR(totalCost, monthlySaving * 12, 10);
    
    return {
      systemType: 'solar_battery',
      systemSizeKw: Math.round(systemSizeKw * 100) / 100,
      batteryKwh: Math.round(batteryKwh * 100) / 100,
      inverterKw: Math.round(systemSizeKw * 0.85 * 100) / 100,
      totalCost: Math.round(totalCost),
      monthlySaving: Math.round(monthlySaving),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi10Year: Math.round(roi10Year),
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      confidence: 92,
      pros: ['Energy independence', 'Outage protection', 'Nighttime solar usage'],
      cons: ['Higher upfront cost', 'Battery replacement after 10 years']
    };
  }
  
  private async evaluateHybrid(
    consumption: number,
    solarPotential: number,
    gridTariff: number,
    request: RecommendationRequest
  ): Promise<any> {
    const systemSizeKw = consumption * 0.7 / (solarPotential * 0.85);
    const batteryKwh = request.preferences.backupHours * (consumption / 24) * 1.2;
    const generatorCost = 250000;
    const totalCost = systemSizeKw * 95000 + batteryKwh * 36000 + generatorCost;
    const monthlySaving = consumption * 30 * gridTariff / 1000 * 0.8;
    const paybackYears = totalCost / (monthlySaving * 12);
    const roi10Year = ((monthlySaving * 12 * 10 - totalCost) / totalCost) * 100;
    const npv = monthlySaving * 12 * 10 - totalCost;
    const irr = this.calculateIRR(totalCost, monthlySaving * 12, 10);
    
    return {
      systemType: 'hybrid',
      systemSizeKw: Math.round(systemSizeKw * 100) / 100,
      batteryKwh: Math.round(batteryKwh * 100) / 100,
      inverterKw: Math.round(systemSizeKw * 0.85 * 100) / 100,
      totalCost: Math.round(totalCost),
      monthlySaving: Math.round(monthlySaving),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi10Year: Math.round(roi10Year),
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      confidence: 88,
      pros: ['99.9% reliability', 'Works in any weather', 'Fuel backup for rainy season'],
      cons: ['Fuel cost', 'Generator maintenance', 'Highest upfront cost']
    };
  }
  
  private async evaluateOffgrid(
    consumption: number,
    solarPotential: number,
    gridTariff: number,
    request: RecommendationRequest
  ): Promise<any> {
    const systemSizeKw = consumption / (solarPotential * 0.7);
    const batteryKwh = 24 * (consumption / 24) * 1.5;
    const generatorCost = 400000;
    const totalCost = systemSizeKw * 95000 + batteryKwh * 36000 + generatorCost;
    const monthlySaving = consumption * 30 * 45 / 1000; // vs generator only
    const paybackYears = totalCost / (monthlySaving * 12);
    const roi10Year = ((monthlySaving * 12 * 10 - totalCost) / totalCost) * 100;
    const npv = monthlySaving * 12 * 10 - totalCost;
    const irr = this.calculateIRR(totalCost, monthlySaving * 12, 10);
    
    return {
      systemType: 'offgrid',
      systemSizeKw: Math.round(systemSizeKw * 100) / 100,
      batteryKwh: Math.round(batteryKwh * 100) / 100,
      inverterKw: Math.round(systemSizeKw * 0.85 * 100) / 100,
      totalCost: Math.round(totalCost),
      monthlySaving: Math.round(monthlySaving),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi10Year: Math.round(roi10Year),
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      confidence: 75,
      pros: ['Complete independence', 'Works anywhere', 'No grid dependency'],
      cons: ['Highest cost', 'Requires generator backup', 'Complex maintenance']
    };
  }
  
  private async scoreOptions(options: any[], preferences: any): Promise<any[]> {
    return options.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Financial score
      scoreA += (1 / a.paybackYears) * 30;
      scoreB += (1 / b.paybackYears) * 30;
      
      scoreA += a.roi10Year / 10;
      scoreB += b.roi10Year / 10;
      
      // Reliability preference
      if (preferences.backupHours > 4) {
        scoreA += a.systemType !== 'solar_only' ? 20 : 0;
        scoreB += b.systemType !== 'solar_only' ? 20 : 0;
      }
      
      // Confidence score
      scoreA += a.confidence / 10;
      scoreB += b.confidence / 10;
      
      return scoreB - scoreA;
    });
  }
  
  private calculateEnvironmentalImpact(systemSizeKw: number): {
    co2OffsetTons: number;
    treesEquivalent: number;
    homesPoweredEquivalent: number;
  } {
    const annualProduction = systemSizeKw * 4.8 * 365 * 0.85;
    const co2PerKwh = 0.42; // kg CO2 per kWh from grid
    const co2OffsetTons = annualProduction * co2PerKwh / 1000;
    const treesEquivalent = co2OffsetTons * 45; // 1 ton CO2 ≈ 45 trees
    const homesPoweredEquivalent = annualProduction / 3500; // Average home uses 3500 kWh/year
    
    return {
      co2OffsetTons: Math.round(co2OffsetTons * 10) / 10,
      treesEquivalent: Math.round(treesEquivalent),
      homesPoweredEquivalent: Math.round(homesPoweredEquivalent * 10) / 10
    };
  }
  
  private generateReasoning(best: any, request: RecommendationRequest, solarPotential: number, gridTariff: number): string[] {
    const reasoning = [];
    
    reasoning.push(`Location receives ${solarPotential} kWh/m²/day - excellent solar resource`);
    reasoning.push(`Current grid tariff of KSh ${gridTariff}/kWh makes solar very attractive`);
    reasoning.push(`Daily consumption of ${request.consumption.daily}kWh requires ${best.systemSizeKw}kW system`);
    
    if (best.systemType === 'solar_battery') {
      reasoning.push(`Battery provides ${request.preferences.backupHours} hours backup for outage protection`);
      reasoning.push(`System will save KSh ${best.monthlySaving.toLocaleString()} per month`);
      reasoning.push(`Payback period of ${best.paybackYears} years with ${best.roi10Year}% ROI over 10 years`);
    }
    
    if (request.budget && best.totalCost > request.budget) {
      reasoning.push(`System cost (KSh ${best.totalCost.toLocaleString()}) exceeds budget (KSh ${request.budget.toLocaleString()})`);
      reasoning.push(`Consider financing options or smaller system`);
    }
    
    return reasoning;
  }
  
  private async assessRisk(best: any, request: RecommendationRequest): Promise<'low' | 'medium' | 'high'> {
    let riskScore = 0;
    
    if (best.paybackYears > 8) riskScore += 30;
    if (request.budget && best.totalCost > request.budget * 1.2) riskScore += 25;
    if (best.systemType === 'hybrid') riskScore += 15;
    
    if (riskScore > 50) return 'high';
    if (riskScore > 25) return 'medium';
    return 'low';
  }
  
  private calculateIRR(initialInvestment: number, annualCashFlow: number, years: number): number {
    let irr = 0.1;
    const cashFlows = [-initialInvestment];
    for (let i = 0; i < years; i++) {
      cashFlows.push(annualCashFlow);
    }
    
    for (let iteration = 0; iteration < 20; iteration++) {
      let npv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + irr, t);
      }
      irr += npv > 0 ? 0.005 : -0.005;
    }
    
    return irr;
  }
  
  private generateId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const recommendationEngine = new RecommendationEngine();