// Digital Twin Type Definitions

export interface SiteModel {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  geometry: {
    boundaries: number[][];
    area: number;
    perimeter: number;
  };
  terrain: {
    elevation: number;
    slope: number;
    aspect: number;
    hillshade: number;
  };
  buildings: BuildingModel[];
  vegetation: VegetationModel[];
  obstructions: ObstructionModel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingModel {
  id: string;
  footprint: number[][];
  height: number;
  roofType: string;
  roofPitch: number;
  orientation: number;
  area: number;
  material: string;
  age: number;
  solarPotential: number;
}

export interface VegetationModel {
  id: string;
  type: string;
  location: { x: number; y: number };
  height: number;
  canopyDiameter: number;
  species: string;
  seasonalImpact: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  };
}

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