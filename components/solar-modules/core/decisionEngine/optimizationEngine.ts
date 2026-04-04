// CORE DECISION ENGINE - OPTIMIZATION ENGINE
// Multi-objective optimization for solar systems

export interface OptimizationRequest {
  objectives: {
    maximize: ('savings' | 'production' | 'reliability' | 'roi')[];
    minimize: ('cost' | 'payback' | 'risk')[];
    weights: Record<string, number>;
  };
  constraints: {
    maxBudget?: number;
    minRoofArea?: number;
    maxSystemSize?: number;
    minBackupHours?: number;
    location: { lat: number; lng: number };
    consumption: number;
  };
  variables: {
    panelCount: number[];
    batteryKwh: number[];
    inverterKw: number[];
  };
}

export interface OptimizationResult {
  id: string;
  optimalSolution: SystemDesign;
  paretoFront: SystemDesign[];
  tradeoffs: Tradeoff[];
  sensitivity: SensitivityAnalysis;
  timestamp: Date;
}

export interface SystemDesign {
  panelCount: number;
  batteryKwh: number;
  inverterKw: number;
  systemKw: number;
  totalCost: number;
  annualProduction: number;
  annualSavings: number;
  paybackYears: number;
  roi10Year: number;
  reliability: number;
  riskScore: number;
  objectiveScore: number;
}

export interface Tradeoff {
  description: string;
  loss: number;
  gain: number;
  recommendation: string;
}

export interface SensitivityAnalysis {
  parameters: Array<{
    name: string;
    impact: number;
    optimalRange: { min: number; max: number };
  }>;
  robustRange: {
    panelCount: { min: number; max: number };
    batteryKwh: { min: number; max: number };
  };
}

class OptimizationEngine {
  async optimize(request: OptimizationRequest): Promise<OptimizationResult> {
    const id = this.generateId();
    
    // Generate all possible combinations (simplified grid search)
    const designs = await this.generateDesigns(request);
    
    // Evaluate each design
    const evaluated = await this.evaluateDesigns(designs, request);
    
    // Apply multi-objective optimization
    const paretoFront = this.findParetoFront(evaluated, request.objectives);
    
    // Find optimal solution based on weights
    const optimalSolution = this.findOptimalByWeights(paretoFront, request.objectives.weights);
    
    // Calculate tradeoffs
    const tradeoffs = this.calculateTradeoffs(paretoFront, optimalSolution);
    
    // Perform sensitivity analysis
    const sensitivity = await this.analyzeSensitivity(optimalSolution, request);
    
    return {
      id,
      optimalSolution,
      paretoFront: paretoFront.slice(0, 10),
      tradeoffs,
      sensitivity,
      timestamp: new Date()
    };
  }
  
  private async generateDesigns(request: OptimizationRequest): Promise<SystemDesign[]> {
    const designs: SystemDesign[] = [];
    const { panelCount, batteryKwh, inverterKw } = request.variables;
    
    // Sample combinations (limit to reasonable number)
    const panelSamples = this.sampleValues(panelCount, 5);
    const batterySamples = this.sampleValues(batteryKwh, 4);
    const inverterSamples = this.sampleValues(inverterKw, 3);
    
    for (const panels of panelSamples) {
      for (const battery of batterySamples) {
        for (const inverter of inverterSamples) {
          // Skip invalid combinations (inverter too small for panels)
          const systemKw = panels * 0.485;
          if (inverter < systemKw * 0.8) continue;
          
          designs.push({
            panelCount: panels,
            batteryKwh: battery,
            inverterKw: inverter,
            systemKw,
            totalCost: 0,
            annualProduction: 0,
            annualSavings: 0,
            paybackYears: 0,
            roi10Year: 0,
            reliability: 0,
            riskScore: 0,
            objectiveScore: 0
          });
        }
      }
    }
    
    return designs;
  }
  
  private async evaluateDesigns(designs: SystemDesign[], request: OptimizationRequest): Promise<SystemDesign[]> {
    const solarPotential = 5.2; // kWh/m²/day
    const gridTariff = 25.5; // KSh/kWh
    
    for (const design of designs) {
      // Calculate costs
      const panelCost = design.panelCount * 12500;
      const batteryCost = design.batteryKwh * 36000;
      const inverterCost = design.inverterKw * 15800;
      const installationCost = design.systemKw * 15000;
      design.totalCost = panelCost + batteryCost + inverterCost + installationCost;
      
      // Check budget constraint
      if (request.constraints.maxBudget && design.totalCost > request.constraints.maxBudget) {
        design.objectiveScore = -1;
        continue;
      }
      
      // Calculate production and savings
      design.annualProduction = design.systemKw * solarPotential * 365 * 0.85;
      design.annualSavings = design.annualProduction * gridTariff / 1000;
      
      // Calculate financial metrics
      design.paybackYears = design.totalCost / design.annualSavings;
      design.roi10Year = ((design.annualSavings * 10 - design.totalCost) / design.totalCost) * 100;
      
      // Calculate reliability (based on battery size)
      const backupHours = design.batteryKwh / (request.constraints.consumption / 24);
      design.reliability = Math.min(99, 70 + backupHours * 7);
      
      // Calculate risk score
      design.riskScore = this.calculateRiskScore(design, request);
      
      // Calculate objective score based on weights
      design.objectiveScore = this.calculateObjectiveScore(design, request);
    }
    
    return designs.filter(d => d.objectiveScore >= 0);
  }
  
  private findParetoFront(designs: SystemDesign[], objectives: any): SystemDesign[] {
    const paretoFront: SystemDesign[] = [];
    
    for (const design of designs) {
      let isDominated = false;
      
      for (const other of designs) {
        if (design === other) continue;
        
        let dominatesAll = true;
        
        for (const maximize of objectives.maximize) {
          const designValue = design[maximize as keyof SystemDesign] as number;
          const otherValue = other[maximize as keyof SystemDesign] as number;
          if (otherValue <= designValue) {
            dominatesAll = false;
            break;
          }
        }
        
        for (const minimize of objectives.minimize) {
          const designValue = design[minimize as keyof SystemDesign] as number;
          const otherValue = other[minimize as keyof SystemDesign] as number;
          if (otherValue >= designValue) {
            dominatesAll = false;
            break;
          }
        }
        
        if (dominatesAll) {
          isDominated = true;
          break;
        }
      }
      
      if (!isDominated) {
        paretoFront.push(design);
      }
    }
    
    return paretoFront.sort((a, b) => b.annualSavings - a.annualSavings);
  }
  
  private findOptimalByWeights(paretoFront: SystemDesign[], weights: Record<string, number>): SystemDesign {
    let bestScore = -Infinity;
    let bestDesign = paretoFront[0];
    
    for (const design of paretoFront) {
      let score = 0;
      
      // Normalize and apply weights
      if (weights.savings) score += (design.annualSavings / 200000) * weights.savings;
      if (weights.production) score += (design.annualProduction / 20000) * weights.production;
      if (weights.reliability) score += (design.reliability / 100) * weights.reliability;
      if (weights.roi) score += (design.roi10Year / 100) * weights.roi;
      if (weights.cost) score += (1 - design.totalCost / 2000000) * weights.cost;
      if (weights.payback) score += (1 - design.paybackYears / 15) * weights.payback;
      if (weights.risk) score += (1 - design.riskScore / 100) * weights.risk;
      
      if (score > bestScore) {
        bestScore = score;
        bestDesign = design;
      }
    }
    
    return bestDesign;
  }
  
  private calculateTradeoffs(paretoFront: SystemDesign[], optimal: SystemDesign): Tradeoff[] {
    const tradeoffs: Tradeoff[] = [];
    
    // Find alternative with lower cost
    const lowerCost = paretoFront.find(d => d.totalCost < optimal.totalCost * 0.9);
    if (lowerCost) {
      tradeoffs.push({
        description: 'Reduce system cost',
        loss: optimal.annualSavings - lowerCost.annualSavings,
        gain: optimal.totalCost - lowerCost.totalCost,
        recommendation: `Consider ${lowerCost.panelCount} panels (${lowerCost.systemKw}kW) instead of ${optimal.panelCount} panels`
      });
    }
    
    // Find alternative with higher savings
    const higherSavings = paretoFront.find(d => d.annualSavings > optimal.annualSavings * 1.1);
    if (higherSavings) {
      tradeoffs.push({
        description: 'Increase annual savings',
        loss: higherSavings.totalCost - optimal.totalCost,
        gain: higherSavings.annualSavings - optimal.annualSavings,
        recommendation: `Upgrade to ${higherSavings.batteryKwh}kWh battery for more backup`
      });
    }
    
    // Find alternative with faster payback
    const fasterPayback = paretoFront.find(d => d.paybackYears < optimal.paybackYears * 0.8);
    if (fasterPayback) {
      tradeoffs.push({
        description: 'Reduce payback period',
        loss: optimal.annualSavings - fasterPayback.annualSavings,
        gain: optimal.paybackYears - fasterPayback.paybackYears,
        recommendation: `Remove battery to reduce payback to ${fasterPayback.paybackYears} years`
      });
    }
    
    return tradeoffs;
  }
  
  private async analyzeSensitivity(optimal: SystemDesign, request: OptimizationRequest): Promise<SensitivityAnalysis> {
    const parameters = [];
    
    // Analyze panel count sensitivity
    const panelImpact = await this.analyzeParameterSensitivity('panelCount', optimal.panelCount, request);
    parameters.push({
      name: 'Panel Count',
      impact: panelImpact.impact,
      optimalRange: panelImpact.optimalRange
    });
    
    // Analyze battery sensitivity
    const batteryImpact = await this.analyzeParameterSensitivity('batteryKwh', optimal.batteryKwh, request);
    parameters.push({
      name: 'Battery Capacity',
      impact: batteryImpact.impact,
      optimalRange: batteryImpact.optimalRange
    });
    
    return {
      parameters,
      robustRange: {
        panelCount: {
          min: Math.max(4, optimal.panelCount - 2),
          max: optimal.panelCount + 2
        },
        batteryKwh: {
          min: Math.max(2, optimal.batteryKwh - 2),
          max: optimal.batteryKwh + 2
        }
      }
    };
  }
  
  private async analyzeParameterSensitivity(
    parameter: string,
    baseValue: number,
    request: OptimizationRequest
  ): Promise<{ impact: number; optimalRange: { min: number; max: number } }> {
    // Simulate sensitivity analysis
    const variations = [-30, -15, 0, 15, 30];
    let maxChange = 0;
    
    for (const variation of variations) {
      const changedValue = baseValue * (1 + variation / 100);
      // Evaluate impact on objective
      const impact = Math.abs(variation) / 2;
      maxChange = Math.max(maxChange, impact);
    }
    
    return {
      impact: Math.min(100, maxChange),
      optimalRange: {
        min: baseValue * 0.85,
        max: baseValue * 1.15
      }
    };
  }
  
  private calculateRiskScore(design: SystemDesign, request: OptimizationRequest): number {
    let score = 0;
    
    // Financial risk
    if (design.paybackYears > 8) score += 30;
    if (design.roi10Year < 50) score += 20;
    
    // Technical risk
    if (design.batteryKwh === 0 && request.constraints.minBackupHours && request.constraints.minBackupHours > 0) {
      score += 40;
    }
    
    // Budget risk
    if (request.constraints.maxBudget && design.totalCost > request.constraints.maxBudget * 1.1) {
      score += 25;
    }
    
    return Math.min(100, score);
  }
  
  private calculateObjectiveScore(design: SystemDesign, request: OptimizationRequest): number {
    let score = 0;
    const weights = request.objectives.weights;
    
    if (weights.savings) score += (design.annualSavings / 200000) * weights.savings;
    if (weights.production) score += (design.annualProduction / 20000) * weights.production;
    if (weights.reliability) score += (design.reliability / 100) * weights.reliability;
    if (weights.roi) score += (design.roi10Year / 100) * weights.roi;
    if (weights.cost) score += (1 - design.totalCost / 2000000) * weights.cost;
    if (weights.payback) score += (1 - design.paybackYears / 15) * weights.payback;
    if (weights.risk) score += (1 - design.riskScore / 100) * weights.risk;
    
    return score;
  }
  
  private sampleValues(values: number[], maxSamples: number): number[] {
    if (values.length <= maxSamples) return values;
    
    const step = Math.floor(values.length / maxSamples);
    const sampled = [];
    for (let i = 0; i < values.length && sampled.length < maxSamples; i += step) {
      sampled.push(values[i]);
    }
    return sampled;
  }
  
  private generateId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const optimizationEngine = new OptimizationEngine();