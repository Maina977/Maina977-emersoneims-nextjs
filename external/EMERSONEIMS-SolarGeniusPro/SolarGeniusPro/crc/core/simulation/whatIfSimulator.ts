// CORE SIMULATION - WHAT-IF SIMULATOR
// Interactive scenario analysis for solar investments

export interface WhatIfScenario {
  id: string;
  name: string;
  changes: ScenarioChanges;
  results: ScenarioResults;
  comparison: ScenarioComparison;
}

export interface ScenarioChanges {
  systemSize?: number; // kWp change percentage
  batterySize?: number; // kWh change
  panelEfficiency?: number; // percentage points
  tariffRate?: number; // KSh/kWh change
  interestRate?: number; // percentage points
  degradationRate?: number; // percentage points
  maintenanceCost?: number; // KSh/year change
  gridReliability?: number; // percentage points
}

export interface ScenarioResults {
  totalCost: number;
  annualProduction: number;
  annualSavings: number;
  paybackYears: number;
  roi10Year: number;
  npv: number;
  irr: number;
  co2Offset: number;
  energyIndependence: number;
}

export interface ScenarioComparison {
  vsBaseline: {
    costDifference: number;
    savingsDifference: number;
    paybackDifference: number;
    recommendation: string;
  };
  sensitivityRanking: Array<{
    factor: string;
    impact: number;
  }>;
}

class WhatIfSimulator {
  private baselineResults: ScenarioResults | null = null;
  
  async setBaseline(baseline: ScenarioResults): Promise<void> {
    this.baselineResults = baseline;
  }
  
  async simulateScenario(changes: ScenarioChanges): Promise<WhatIfScenario> {
    const id = this.generateId();
    const name = this.generateScenarioName(changes);
    
    // Start with default baseline
    let results = await this.calculateDefaultBaseline();
    
    // Apply each change
    if (changes.systemSize) {
      results = await this.applySystemSizeChange(results, changes.systemSize);
    }
    if (changes.batterySize) {
      results = await this.applyBatteryChange(results, changes.batterySize);
    }
    if (changes.panelEfficiency) {
      results = await this.applyEfficiencyChange(results, changes.panelEfficiency);
    }
    if (changes.tariffRate) {
      results = await this.applyTariffChange(results, changes.tariffRate);
    }
    if (changes.interestRate) {
      results = await this.applyInterestRateChange(results, changes.interestRate);
    }
    if (changes.degradationRate) {
      results = await this.applyDegradationChange(results, changes.degradationRate);
    }
    if (changes.maintenanceCost) {
      results = await this.applyMaintenanceChange(results, changes.maintenanceCost);
    }
    if (changes.gridReliability) {
      results = await this.applyGridReliabilityChange(results, changes.gridReliability);
    }
    
    // Calculate comparison with baseline
    const comparison = this.compareWithBaseline(results);
    
    // Calculate sensitivity ranking
    const sensitivityRanking = await this.calculateSensitivityRanking(changes);
    
    return {
      id,
      name,
      changes,
      results,
      comparison: {
        vsBaseline: comparison,
        sensitivityRanking
      }
    };
  }
  
  async compareScenarios(scenarios: WhatIfScenario[]): Promise<{
    bestByMetric: Record<string, WhatIfScenario>;
    tradeoffMatrix: TradeoffMatrix;
    recommendedScenario: WhatIfScenario;
  }> {
    const bestByMetric: Record<string, WhatIfScenario> = {
      savings: scenarios.reduce((best, curr) => 
        curr.results.annualSavings > best.results.annualSavings ? curr : best, scenarios[0]),
      payback: scenarios.reduce((best, curr) => 
        curr.results.paybackYears < best.results.paybackYears ? curr : best, scenarios[0]),
      roi: scenarios.reduce((best, curr) => 
        curr.results.roi10Year > best.results.roi10Year ? curr : best, scenarios[0]),
      independence: scenarios.reduce((best, curr) => 
        curr.results.energyIndependence > best.results.energyIndependence ? curr : best, scenarios[0]),
      co2: scenarios.reduce((best, curr) => 
        curr.results.co2Offset > best.results.co2Offset ? curr : best, scenarios[0])
    };
    
    // Calculate tradeoff matrix
    const tradeoffMatrix = this.calculateTradeoffMatrix(scenarios);
    
    // Find balanced recommendation
    const recommendedScenario = this.findBalancedRecommendation(scenarios);
    
    return {
      bestByMetric,
      tradeoffMatrix,
      recommendedScenario
    };
  }
  
  async visualizeImpact(changes: ScenarioChanges, range: { min: number; max: number; steps: number }): Promise<{
    parameter: string;
    values: number[];
    impacts: {
      payback: number[];
      savings: number[];
      roi: number[];
    };
  }> {
    const parameter = Object.keys(changes)[0];
    const baseChange = { ...changes };
    const values = [];
    const paybackImpacts = [];
    const savingsImpacts = [];
    const roiImpacts = [];
    
    const stepSize = (range.max - range.min) / range.steps;
    
    for (let value = range.min; value <= range.max; value += stepSize) {
      values.push(value);
      baseChange[parameter as keyof ScenarioChanges] = value;
      
      const scenario = await this.simulateScenario(baseChange);
      paybackImpacts.push(scenario.results.paybackYears);
      savingsImpacts.push(scenario.results.annualSavings);
      roiImpacts.push(scenario.results.roi10Year);
    }
    
    return {
      parameter,
      values,
      impacts: {
        payback: paybackImpacts,
        savings: savingsImpacts,
        roi: roiImpacts
      }
    };
  }
  
  async findOptimalScenario(constraints: {
    maxBudget?: number;
    minSavings?: number;
    maxPayback?: number;
    minIndependence?: number;
  }): Promise<WhatIfScenario> {
    const testScenarios: WhatIfScenario[] = [];
    
    // Test different system sizes
    for (const size of [0.8, 1.0, 1.2, 1.5]) {
      const scenario = await this.simulateScenario({ systemSize: size });
      testScenarios.push(scenario);
    }
    
    // Test different battery sizes
    for (const battery of [0, 5, 10, 15]) {
      const scenario = await this.simulateScenario({ batterySize: battery });
      testScenarios.push(scenario);
    }
    
    // Filter by constraints
    let feasible = testScenarios;
    
    if (constraints.maxBudget) {
      feasible = feasible.filter(s => s.results.totalCost <= constraints.maxBudget!);
    }
    if (constraints.minSavings) {
      feasible = feasible.filter(s => s.results.annualSavings >= constraints.minSavings!);
    }
    if (constraints.maxPayback) {
      feasible = feasible.filter(s => s.results.paybackYears <= constraints.maxPayback!);
    }
    if (constraints.minIndependence) {
      feasible = feasible.filter(s => s.results.energyIndependence >= constraints.minIndependence!);
    }
    
    if (feasible.length === 0) {
      // Return scenario closest to constraints
      return this.findClosestScenario(testScenarios, constraints);
    }
    
    // Score feasible scenarios
    for (const scenario of feasible) {
      (scenario as any).score = 
        (scenario.results.roi10Year / 100) * 0.4 +
        (1 / scenario.results.paybackYears) * 0.3 +
        (scenario.results.energyIndependence / 100) * 0.3;
    }
    
    return feasible.sort((a, b) => (b as any).score - (a as any).score)[0];
  }
  
  private async calculateDefaultBaseline(): Promise<ScenarioResults> {
    return {
      totalCost: 969818,
      annualProduction: 10842,
      annualSavings: 135000,
      paybackYears: 7.2,
      roi10Year: 139,
      npv: 487000,
      irr: 18.4,
      co2Offset: 94.5,
      energyIndependence: 93
    };
  }
  
  private async applySystemSizeChange(results: ScenarioResults, factor: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    newResults.totalCost = results.totalCost * factor;
    newResults.annualProduction = results.annualProduction * factor;
    newResults.annualSavings = results.annualSavings * factor;
    newResults.paybackYears = results.paybackYears / factor;
    newResults.roi10Year = results.roi10Year * (1 + (factor - 1) * 0.5);
    newResults.npv = results.npv * factor;
    newResults.co2Offset = results.co2Offset * factor;
    return newResults;
  }
  
  private async applyBatteryChange(results: ScenarioResults, additionalKwh: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    const batteryCost = additionalKwh * 36000;
    newResults.totalCost = results.totalCost + batteryCost;
    newResults.energyIndependence = Math.min(99, results.energyIndependence + additionalKwh * 2);
    newResults.paybackYears = newResults.totalCost / results.annualSavings;
    return newResults;
  }
  
  private async applyEfficiencyChange(results: ScenarioResults, points: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    const efficiencyFactor = 1 + points / 100;
    newResults.annualProduction = results.annualProduction * efficiencyFactor;
    newResults.annualSavings = results.annualSavings * efficiencyFactor;
    newResults.paybackYears = results.totalCost / newResults.annualSavings;
    return newResults;
  }
  
  private async applyTariffChange(results: ScenarioResults, newTariff: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    const ratio = newTariff / 25.5;
    newResults.annualSavings = results.annualSavings * ratio;
    newResults.paybackYears = results.totalCost / newResults.annualSavings;
    newResults.roi10Year = results.roi10Year * ratio;
    return newResults;
  }
  
  private async applyInterestRateChange(results: ScenarioResults, newRate: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    // Higher interest rate reduces effective ROI
    const impact = 1 - (newRate - 12) / 100;
    newResults.roi10Year = results.roi10Year * impact;
    newResults.npv = results.npv * impact;
    return newResults;
  }
  
  private async applyDegradationChange(results: ScenarioResults, newRate: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    const degradationImpact = 1 - (newRate - 0.5) / 100;
    newResults.annualProduction = results.annualProduction * degradationImpact;
    newResults.annualSavings = results.annualSavings * degradationImpact;
    newResults.roi10Year = results.roi10Year * degradationImpact;
    return newResults;
  }
  
  private async applyMaintenanceChange(results: ScenarioResults, additionalCost: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    newResults.annualSavings = results.annualSavings - additionalCost;
    newResults.paybackYears = results.totalCost / newResults.annualSavings;
    return newResults;
  }
  
  private async applyGridReliabilityChange(results: ScenarioResults, reliability: number): Promise<ScenarioResults> {
    const newResults = { ...results };
    // Lower grid reliability increases value of battery
    const valueFactor = (100 - reliability) / 100;
    newResults.energyIndependence = Math.min(99, results.energyIndependence + valueFactor * 20);
    return newResults;
  }
  
  private compareWithBaseline(results: ScenarioResults): {
    costDifference: number;
    savingsDifference: number;
    paybackDifference: number;
    recommendation: string;
  } {
    if (!this.baselineResults) {
      return {
        costDifference: 0,
        savingsDifference: 0,
        paybackDifference: 0,
        recommendation: 'Set baseline first for comparison'
      };
    }
    
    const costDiff = results.totalCost - this.baselineResults.totalCost;
    const savingsDiff = results.annualSavings - this.baselineResults.annualSavings;
    const paybackDiff = this.baselineResults.paybackYears - results.paybackYears;
    
    let recommendation = '';
    if (savingsDiff > 0 && paybackDiff > 0) {
      recommendation = 'This scenario improves both savings and payback - recommended';
    } else if (savingsDiff > 0 && paybackDiff < 0) {
      recommendation = 'Higher savings but longer payback - consider if long-term ownership';
    } else if (savingsDiff < 0 && paybackDiff > 0) {
      recommendation = 'Faster payback but lower savings - good for budget-conscious';
    } else {
      recommendation = 'This scenario underperforms baseline - not recommended';
    }
    
    return {
      costDifference: costDiff,
      savingsDifference: savingsDiff,
      paybackDifference: paybackDiff,
      recommendation
    };
  }
  
  private async calculateSensitivityRanking(changes: ScenarioChanges): Promise<Array<{ factor: string; impact: number }>> {
    const impacts = [];
    
    for (const [factor, value] of Object.entries(changes)) {
      if (value !== undefined) {
        // Calculate approximate impact (higher is more sensitive)
        const impact = Math.abs(value) * 50;
        impacts.push({ factor, impact: Math.min(100, impact) });
      }
    }
    
    return impacts.sort((a, b) => b.impact - a.impact);
  }
  
  private calculateTradeoffMatrix(scenarios: WhatIfScenario[]): TradeoffMatrix {
    const matrix: TradeoffMatrix = {
      labels: scenarios.map(s => s.name),
      data: {
        payback: scenarios.map(s => s.results.paybackYears),
        savings: scenarios.map(s => s.results.annualSavings),
        roi: scenarios.map(s => s.results.roi10Year),
        independence: scenarios.map(s => s.results.energyIndependence)
      }
    };
    return matrix;
  }
  
  private findBalancedRecommendation(scenarios: WhatIfScenario[]): WhatIfScenario {
    // Score each scenario on balance
    for (const scenario of scenarios) {
      const scores = [
        scenario.results.roi10Year / 200,
        1 / (scenario.results.paybackYears / 10),
        scenario.results.energyIndependence / 100,
        scenario.results.annualSavings / 200000
      ];
      (scenario as any).balanceScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    
    return scenarios.sort((a, b) => (b as any).balanceScore - (a as any).balanceScore)[0];
  }
  
  private findClosestScenario(scenarios: WhatIfScenario[], constraints: any): WhatIfScenario {
    // Find scenario with minimum constraint violation
    let best = scenarios[0];
    let bestViolation = Infinity;
    
    for (const scenario of scenarios) {
      let violation = 0;
      if (constraints.maxBudget && scenario.results.totalCost > constraints.maxBudget) {
        violation += (scenario.results.totalCost - constraints.maxBudget) / constraints.maxBudget;
      }
      if (constraints.minSavings && scenario.results.annualSavings < constraints.minSavings) {
        violation += (constraints.minSavings - scenario.results.annualSavings) / constraints.minSavings;
      }
      
      if (violation < bestViolation) {
        bestViolation = violation;
        best = scenario;
      }
    }
    
    return best;
  }
  
  private generateScenarioName(changes: ScenarioChanges): string {
    const parts = [];
    if (changes.systemSize) parts.push(`${Math.round(changes.systemSize * 100)}% size`);
    if (changes.batterySize) parts.push(`+${changes.batterySize}kWh battery`);
    if (changes.tariffRate) parts.push(`KSh ${changes.tariffRate}/kWh tariff`);
    if (changes.interestRate) parts.push(`${changes.interestRate}% interest`);
    return parts.join(', ') || 'Custom Scenario';
  }
  
  private generateId(): string {
    return `whatif_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export interface TradeoffMatrix {
  labels: string[];
  data: {
    payback: number[];
    savings: number[];
    roi: number[];
    independence: number[];
  };
}

export const whatIfSimulator = new WhatIfSimulator();