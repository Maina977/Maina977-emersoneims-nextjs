// Solar System Type Definitions

export interface SystemDesign {
  id: string;
  name: string;
  projectId: string;
  systemKw: number;
  panelCount: number;
  panelModel: string;
  panelWattage: number;
  inverterModel: string;
  inverterKw: number;
  batteryModel?: string;
  batteryKwh?: number;
  roofType: string;
  roofPitch: number;
  orientation: number;
  shadingLoss: number;
  annualYield: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Panel {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
  warranty: number;
  price: number;
  currency: string;
  inStock: boolean;
}

export interface Inverter {
  id: string;
  brand: string;
  model: string;
  power: number;
  efficiency: number;
  mpptChannels: number;
  voltageRange: {
    min: number;
    max: number;
  };
  ipRating: string;
  warranty: number;
  price: number;
  currency: string;
  inStock: boolean;
}

export interface Battery {
  id: string;
  brand: string;
  model: string;
  capacity: number;
  voltage: number;
  chemistry: 'LFP' | 'NMC' | 'LTO';
  cycleLife: number;
  depthOfDischarge: number;
  efficiency: number;
  warranty: number;
  price: number;
  currency: string;
  inStock: boolean;
}

export interface ProductionData {
  timestamp: Date;
  powerKw: number;
  energyKwh: number;
  voltage: number;
  current: number;
  temperature: number;
  irradiance: number;
}

export interface FinancialAnalysis {
  totalInvestment: number;
  annualSavings: number;
  paybackYears: number;
  roi10Year: number;
  npv: number;
  irr: number;
  lcoe: number;
  cashFlows: CashFlowYear[];
}

export interface CashFlowYear {
  year: number;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface SiteAssessment {
  id: string;
  projectId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  roofArea: number;
  roofPitch: number;
  roofOrientation: number;
  shadingFactors: ShadingFactor[];
  obstructions: Obstruction[];
  images: string[];
  assessedAt: Date;
  assessedBy: string;
}

export interface ShadingFactor {
  hour: number;
  month: number;
  factor: number;
}

export interface Obstruction {
  type: 'tree' | 'building' | 'chimney' | 'vent' | 'other';
  height: number;
  distance: number;
  azimuth: number;
  impact: number;
}