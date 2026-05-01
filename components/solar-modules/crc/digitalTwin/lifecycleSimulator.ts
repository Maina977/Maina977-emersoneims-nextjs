// DIGITAL TWIN - LIFECYCLE SIMULATOR
// 25-year system lifecycle simulation

export interface LifecycleSimulation {
  id: string;
  systemId: string;
  durationYears: number;
  scenarios: SimulationScenario[];
  summary: LifecycleSummary;
  createdAt: Date;
}

export interface SimulationScenario {
  name: string;
  parameters: {
    degradationRate: number;
    maintenanceFrequency: number;
    replacementSchedule: ReplacementEvent[];
    tariffEscalation: number;
    discountRate: number;
  };
  results: YearlyResult[];
}

export interface YearlyResult {
  year: number;
  production: number;
  degradation: number;
  revenue: number;
  maintenanceCost: number;
  replacementCost: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  systemHealth: number;
}

export interface ReplacementEvent {
  year: number;
  component: 'inverter' | 'battery' | 'cables';
  cost: number;
}

export interface LifecycleSummary {
  totalProduction: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  averageROI: number;
  paybackPeriod: number;
  npv: number;
  irr: number;
  levelizedCost: number;
}

class LifecycleSimulator {
  private simulations: Map<string, LifecycleSimulation> = new Map();
  
  async runSimulation(
    systemId: string,
    systemKw: number,
    initialCost: number,
    annualProduction: number,
    tariff: number,
    durationYears: number = 25
  ): Promise<LifecycleSimulation> {
    const id = this.generateId();
    
    const scenarios: SimulationScenario[] = [
      await this.createBaseScenario(systemKw, initialCost, annualProduction, tariff, durationYears),
      await this.createOptimisticScenario(systemKw, initialCost, annualProduction, tariff, durationYears),
      await this.createPessimisticScenario(systemKw, initialCost, annualProduction, tariff, durationYears)
    ];
    
    const summary = this.calculateSummary(scenarios[0].results);
    
    const simulation: LifecycleSimulation = {
      id,
      systemId,
      durationYears,
      scenarios,
      summary,
      createdAt: new Date()
    };
    
    this.simulations.set(id, simulation);
    return simulation;
  }
  
  private async createBaseScenario(
    systemKw: number,
    initialCost: number,
    annualProduction: number,
    tariff: number,
    years: number
  ): Promise<SimulationScenario> {
    const results: YearlyResult[] = [];
    let cumulativeCashFlow = -initialCost;
    const degradationRate = 0.005; // 0.5% per year
    const tariffEscalation = 0.03; // 3% per year
    const discountRate = 0.1; // 10%
    
    const replacementEvents: ReplacementEvent[] = [
      { year: 10, component: 'inverter', cost: 95000 },
      { year: 12, component: 'battery', cost: 185000 }
    ];
    
    for (let year = 1; year <= years; year++) {
      const degradation = 1 - Math.pow(1 - degradationRate, year);
      const production = annualProduction * (1 - degradation);
      const currentTariff = tariff * Math.pow(1 + tariffEscalation, year - 1);
      const revenue = production * currentTariff / 1000;
      
      let maintenanceCost = systemKw * 1500; // KSh 1,500 per kW per year
      let replacementCost = 0;
      
      for (const event of replacementEvents) {
        if (event.year === year) {
          replacementCost += event.cost;
        }
      }
      
      const netCashFlow = revenue - maintenanceCost - replacementCost;
      cumulativeCashFlow += netCashFlow;
      
      const discountedCashFlow = netCashFlow / Math.pow(1 + discountRate, year);
      const systemHealth = 100 - (degradation * 100);
      
      results.push({
        year,
        production,
        degradation: degradation * 100,
        revenue,
        maintenanceCost,
        replacementCost,
        netCashFlow,
        cumulativeCashFlow,
        systemHealth
      });
    }
    
    return {
      name: 'Base Scenario',
      parameters: {
        degradationRate,
        maintenanceFrequency: 12,
        replacementEvents,
        tariffEscalation,
        discountRate
      },
      results
    };
  }
  
  private async createOptimisticScenario(
    systemKw: number,
    initialCost: number,
    annualProduction: number,
    tariff: number,
    years: number
  ): Promise<SimulationScenario> {
    const results: YearlyResult[] = [];
    let cumulativeCashFlow = -initialCost;
    const degradationRate = 0.003; // 0.3% per year (better panels)
    const tariffEscalation = 0.05; // 5% per year (higher inflation)
    const discountRate = 0.08; // 8%
    
    const replacementEvents: ReplacementEvent[] = [
      { year: 12, component: 'inverter', cost: 85000 },
      { year: 15, component: 'battery', cost: 165000 }
    ];
    
    for (let year = 1; year <= years; year++) {
      const degradation = 1 - Math.pow(1 - degradationRate, year);
      const production = annualProduction * 1.05 * (1 - degradation);
      const currentTariff = tariff * Math.pow(1 + tariffEscalation, year - 1);
      const revenue = production * currentTariff / 1000;
      
      let maintenanceCost = systemKw * 1000;
      let replacementCost = 0;
      
      for (const event of replacementEvents) {
        if (event.year === year) {
          replacementCost += event.cost;
        }
      }
      
      const netCashFlow = revenue - maintenanceCost - replacementCost;
      cumulativeCashFlow += netCashFlow;
      
      results.push({
        year,
        production,
        degradation: degradation * 100,
        revenue,
        maintenanceCost,
        replacementCost,
        netCashFlow,
        cumulativeCashFlow,
        systemHealth: 100 - (degradation * 80)
      });
    }
    
    return {
      name: 'Optimistic Scenario',
      parameters: {
        degradationRate,
        maintenanceFrequency: 12,
        replacementEvents,
        tariffEscalation,
        discountRate
      },
      results
    };
  }
  
  private async createPessimisticScenario(
    systemKw: number,
    initialCost: number,
    annualProduction: number,
    tariff: number,
    years: number
  ): Promise<SimulationScenario> {
    const results: YearlyResult[] = [];
    let cumulativeCashFlow = -initialCost;
    const degradationRate = 0.008; // 0.8% per year
    const tariffEscalation = 0.01; // 1% per year
    const discountRate = 0.12; // 12%
    
    const replacementEvents: ReplacementEvent[] = [
      { year: 8, component: 'inverter', cost: 110000 },
      { year: 10, component: 'battery', cost: 210000 },
      { year: 16, component: 'inverter', cost: 120000 }
    ];
    
    for (let year = 1; year <= years; year++) {
      const degradation = 1 - Math.pow(1 - degradationRate, year);
      const production = annualProduction * 0.95 * (1 - degradation);
      const currentTariff = tariff * Math.pow(1 + tariffEscalation, year - 1);
      const revenue = production * currentTariff / 1000;
      
      let maintenanceCost = systemKw * 2000;
      let replacementCost = 0;
      
      for (const event of replacementEvents) {
        if (event.year === year) {
          replacementCost += event.cost;
        }
      }
      
      const netCashFlow = revenue - maintenanceCost - replacementCost;
      cumulativeCashFlow += netCashFlow;
      
      results.push({
        year,
        production,
        degradation: degradation * 100,
        revenue,
        maintenanceCost,
        replacementCost,
        netCashFlow,
        cumulativeCashFlow,
        systemHealth: 100 - (degradation * 120)
      });
    }
    
    return {
      name: 'Pessimistic Scenario',
      parameters: {
        degradationRate,
        maintenanceFrequency: 12,
        replacementEvents,
        tariffEscalation,
        discountRate
      },
      results
    };
  }
  
  private calculateSummary(results: YearlyResult[]): LifecycleSummary {
    const totalProduction = results.reduce((sum, r) => sum + r.production, 0);
    const totalRevenue = results.reduce((sum, r) => sum + r.revenue, 0);
    const totalCost = results.reduce((sum, r) => sum + r.maintenanceCost + r.replacementCost, 0) + 969818;
    const netProfit = totalRevenue - totalCost;
    
    // Find payback period
    let paybackPeriod = 0;
    for (const result of results) {
      if (result.cumulativeCashFlow >= 0) {
        paybackPeriod = result.year;
        break;
      }
    }
    
    // Calculate IRR (simplified)
    const cashFlows = [-969818, ...results.map(r => r.netCashFlow)];
    let irr = 0.1;
    for (let i = 0; i < 20; i++) {
      let npv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + irr, t);
      }
      irr += npv > 0 ? 0.005 : -0.005;
    }
    
    // Calculate NPV at 10% discount rate
    let npv = -969818;
    for (let t = 0; t < results.length; t++) {
      npv += results[t].netCashFlow / Math.pow(1.1, t + 1);
    }
    
    // Calculate Levelized Cost of Energy (LCOE)
    const levelizedCost = totalCost / totalProduction * 1000;
    
    return {
      totalProduction,
      totalRevenue,
      totalCost,
      netProfit,
      averageROI: (netProfit / 969818) * 100 / results.length,
      paybackPeriod,
      npv,
      irr: irr * 100,
      levelizedCost
    };
  }
  
  async getSimulation(id: string): Promise<LifecycleSimulation | null> {
    return this.simulations.get(id) || null;
  }
  
  async compareScenarios(systemId: string): Promise<{
    scenarioName: string;
    npv: number;
    irr: number;
    payback: number;
    netProfit: number;
  }[]> {
    const simulation = Array.from(this.simulations.values()).find(s => s.systemId === systemId);
    if (!simulation) return [];
    
    return simulation.scenarios.map(scenario => {
      const summary = this.calculateSummary(scenario.results);
      return {
        scenarioName: scenario.name,
        npv: summary.npv,
        irr: summary.irr,
        payback: summary.paybackPeriod,
        netProfit: summary.netProfit
      };
    });
  }
  
  async exportReport(simulationId: string): Promise<string> {
    const simulation = await this.getSimulation(simulationId);
    if (!simulation) throw new Error('Simulation not found');
    
    return JSON.stringify(simulation, null, 2);
  }
  
  private generateId(): string {
    return `lifecycle_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const lifecycleSimulator = new LifecycleSimulator();