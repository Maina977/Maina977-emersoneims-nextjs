// DIGITAL TWIN - SYSTEM MODEL
// Models solar system components and behavior

export interface SystemModel {
  id: string;
  siteId: string;
  name: string;
  components: SystemComponents;
  configuration: SystemConfiguration;
  performance: SystemPerformance;
  status: SystemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemComponents {
  panels: PanelModel[];
  inverter: InverterModel;
  battery?: BatteryModel[];
  meter: MeterModel;
  wiring: WiringModel;
}

export interface PanelModel {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  count: number;
  location: Array<{ x: number; y: number; z: number }>;
  orientation: number;
  tilt: number;
  degradation: number;
}

export interface InverterModel {
  brand: string;
  model: string;
  power: number;
  efficiency: number;
  mpptChannels: number;
  voltageRange: { min: number; max: number };
}

export interface BatteryModel {
  brand: string;
  model: string;
  capacity: number;
  voltage: number;
  chemistry: string;
  cycleLife: number;
  currentSOH: number;
}

export interface SystemConfiguration {
  topology: 'string' | 'hybrid' | 'offgrid';
  strings: Array<{
    id: string;
    panels: string[];
    voltage: number;
    current: number;
  }>;
  acConnection: {
    phase: 'single' | 'three';
    voltage: number;
    gridTied: boolean;
  };
}

export interface SystemPerformance {
  annualProduction: number;
  monthlyProduction: number[];
  hourlyProduction: number[];
  performanceRatio: number;
  capacityFactor: number;
  losses: {
    shading: number;
    temperature: number;
    soiling: number;
    mismatch: number;
    dcAc: number;
  };
}

export interface SystemStatus {
  operational: boolean;
  lastMaintenance: Date;
  nextMaintenance: Date;
  alerts: string[];
  healthScore: number;
}

class SystemModelService {
  private models: Map<string, SystemModel> = new Map();
  
  async createSystemModel(siteId: string, config: Partial<SystemModel>): Promise<SystemModel> {
    const id = this.generateId();
    
    const systemModel: SystemModel = {
      id,
      siteId,
      name: config.name || `System_${id.substring(0, 8)}`,
      components: config.components || await this.getDefaultComponents(),
      configuration: config.configuration || await this.getDefaultConfiguration(),
      performance: config.performance || await this.calculatePerformance(config.components),
      status: {
        operational: true,
        lastMaintenance: new Date(),
        nextMaintenance: new Date(Date.now() + 180 * 86400000),
        alerts: [],
        healthScore: 98
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.models.set(id, systemModel);
    return systemModel;
  }
  
  async getSystemModel(id: string): Promise<SystemModel | null> {
    return this.models.get(id) || null;
  }
  
  async updateSystemModel(id: string, updates: Partial<SystemModel>): Promise<SystemModel | null> {
    const model = await this.getSystemModel(id);
    if (!model) return null;
    
    const updated = { ...model, ...updates, updatedAt: new Date() };
    this.models.set(id, updated);
    return updated;
  }
  
  async simulatePerformance(systemId: string, weatherData: any): Promise<SystemPerformance> {
    const system = await this.getSystemModel(systemId);
    if (!system) throw new Error('System not found');
    
    // Simulate based on weather data
    const totalPower = system.components.panels.reduce((sum, p) => sum + p.wattage * p.count, 0);
    const irradiance = weatherData.irradiance || 5.2;
    const temperature = weatherData.temperature || 25;
    
    const temperatureLoss = (temperature - 25) * 0.004;
    const efficiency = system.components.inverter.efficiency * (1 - temperatureLoss);
    
    const dailyProduction = totalPower * irradiance * efficiency / 1000;
    const annualProduction = dailyProduction * 365;
    
    return {
      annualProduction,
      monthlyProduction: Array(12).fill(annualProduction / 12),
      hourlyProduction: this.calculateHourlyProfile(dailyProduction),
      performanceRatio: efficiency * 0.95,
      capacityFactor: annualProduction / (totalPower / 1000 * 8760) * 100,
      losses: {
        shading: 7.2,
        temperature: temperatureLoss * 100,
        soiling: 3.5,
        mismatch: 2.0,
        dcAc: 5.0
      }
    };
  }
  
  async predictDegradation(systemId: string, years: number = 25): Promise<{
    year: number;
    capacity: number;
    production: number;
  }[]> {
    const system = await this.getSystemModel(systemId);
    if (!system) throw new Error('System not found');
    
    const results = [];
    const initialCapacity = system.components.panels.reduce((sum, p) => sum + p.wattage * p.count, 0);
    const annualDegradation = 0.005; // 0.5% per year
    const initialProduction = system.performance.annualProduction;
    
    for (let year = 1; year <= years; year++) {
      const capacity = initialCapacity * Math.pow(1 - annualDegradation, year);
      const production = initialProduction * Math.pow(1 - annualDegradation, year);
      results.push({ year, capacity, production });
    }
    
    return results;
  }
  
  async optimizeConfiguration(systemId: string): Promise<SystemConfiguration> {
    const system = await this.getSystemModel(systemId);
    if (!system) throw new Error('System not found');
    
    // Optimize string configuration for maximum efficiency
    const panels = system.components.panels;
    const inverter = system.components.inverter;
    
    const optimalPanelsPerString = Math.floor(inverter.voltageRange.max / (panels[0].wattage / 1000 * 380));
    const numStrings = Math.ceil(panels[0].count / optimalPanelsPerString);
    
    return {
      topology: system.configuration.topology,
      strings: Array(numStrings).fill(null).map((_, i) => ({
        id: `string_${i + 1}`,
        panels: panels[0].count > 0 ? Array(optimalPanelsPerString).fill(panels[0].id) : [],
        voltage: optimalPanelsPerString * 38,
        current: panels[0].wattage / 380 * optimalPanelsPerString
      })),
      acConnection: system.configuration.acConnection
    };
  }
  
  async getHealthAssessment(systemId: string): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
    components: Array<{ name: string; health: number; remainingLife: number }>;
  }> {
    const system = await this.getSystemModel(systemId);
    if (!system) throw new Error('System not found');
    
    const inverterHealth = 92;
    const panelHealth = 96;
    const batteryHealth = system.components.battery?.[0]?.currentSOH || 100;
    
    const issues = [];
    const recommendations = [];
    
    if (inverterHealth < 85) {
      issues.push('Inverter showing signs of wear');
      recommendations.push('Schedule inverter maintenance');
    }
    
    if (batteryHealth < 80) {
      issues.push('Battery degradation accelerating');
      recommendations.push('Consider battery replacement in 12-18 months');
    }
    
    const score = (inverterHealth + panelHealth + batteryHealth) / 3;
    
    return {
      score,
      issues,
      recommendations,
      components: [
        { name: 'Inverter', health: inverterHealth, remainingLife: 5.5 },
        { name: 'Panels', health: panelHealth, remainingLife: 22 },
        { name: 'Battery', health: batteryHealth, remainingLife: batteryHealth > 80 ? 8 : 4 }
      ]
    };
  }
  
  private async getDefaultComponents(): Promise<SystemComponents> {
    return {
      panels: [{
        id: 'panel_1',
        brand: 'JA Solar',
        model: 'JAM54S30-485',
        wattage: 485,
        efficiency: 21.5,
        count: 14,
        location: [],
        orientation: 15,
        tilt: 22.5,
        degradation: 0.5
      }],
      inverter: {
        brand: 'Deye',
        model: 'SUN-6K-SG01LP1',
        power: 6000,
        efficiency: 97.5,
        mpptChannels: 2,
        voltageRange: { min: 150, max: 500 }
      },
      battery: [{
        brand: 'Dyness',
        model: 'BX51100',
        capacity: 5.12,
        voltage: 51.2,
        chemistry: 'LFP',
        cycleLife: 6000,
        currentSOH: 98
      }],
      meter: {
        brand: 'Emerson',
        model: 'EM-485',
        type: 'bi-directional'
      },
      wiring: {
        dcGauge: 6,
        acGauge: 4,
        length: 25
      }
    };
  }
  
  private async getDefaultConfiguration(): Promise<SystemConfiguration> {
    return {
      topology: 'hybrid',
      strings: [],
      acConnection: {
        phase: 'single',
        voltage: 230,
        gridTied: true
      }
    };
  }
  
  private async calculatePerformance(components?: SystemComponents): Promise<SystemPerformance> {
    const totalPower = components?.panels.reduce((sum, p) => sum + p.wattage * p.count, 0) || 6790;
    const annualProduction = totalPower * 4.8 * 365 * 0.85 / 1000;
    
    return {
      annualProduction,
      monthlyProduction: Array(12).fill(annualProduction / 12),
      hourlyProduction: [],
      performanceRatio: 0.85,
      capacityFactor: 18.5,
      losses: {
        shading: 7.2,
        temperature: 4.5,
        soiling: 3.5,
        mismatch: 2.0,
        dcAc: 5.0
      }
    };
  }
  
  private calculateHourlyProfile(dailyProduction: number): number[] {
    const hourly = [];
    for (let hour = 0; hour < 24; hour++) {
      let factor = 0;
      if (hour >= 6 && hour <= 18) {
        factor = Math.sin((hour - 6) / 12 * Math.PI);
      }
      hourly.push(dailyProduction * factor);
    }
    return hourly;
  }
  
  private generateId(): string {
    return `sys_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const systemModel = new SystemModelService();