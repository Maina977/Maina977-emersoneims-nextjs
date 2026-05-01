/**
 * 🌟 INTELLIGENT SOLAR CALCULATOR ENGINE
 * 
 * Harvard-level solar system sizing and configuration engine
 * - Location-based irradiance calculations
 * - Load profiling and system sizing
 * - Equipment recommendation AI
 * - Cost calculation engine
 * - Labour and miscellaneous estimations
 * 
 * This engine powers the market-disrupting solar calculator
 */

// ==================== TYPES & INTERFACES ====================

export interface Location {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  altitude: number; // meters
}

export interface Appliance {
  name: string;
  wattage: number;
  dailyHours: number;
  quantity: number;
  priority: 'essential' | 'important' | 'optional';
}

export interface LoadProfile {
  totalDailyEnergy: number; // kWh/day
  peakLoad: number; // kW
  averageLoad: number; // kW
  nightLoad: number; // kW
  appliances: Appliance[];
}

export interface SolarIrradiance {
  location: Location;
  ghi: number; // Global Horizontal Irradiance (kWh/m²/day)
  dni: number; // Direct Normal Irradiance
  gti: number; // Global Tilted Irradiance
  peakSunHours: number; // equivalent peak sun hours
  clearSkyIndex: number; // 0-1, cloud factor
}

export interface SystemRecommendation {
  systemSizeKW: number;
  panelCount: number;
  panelWattage: number;
  panelType: string;
  inverterSize: number; // kW
  inverterType: string; // string, hybrid, grid-tie
  batteryCapacityKWh: number;
  batteryType: string; // LiFePO4, AGM, Gel
  batteryVoltage: number; // 24V, 48V, 96V
  cableMainSize: string; // mm² (e.g., "6", "10", "16")
  cableSubSize: string;
  estimatedROI: number; // years
  estimatedProduction: number; // kWh/year
  paybackPeriod: number; // months
}

export interface CostEstimate {
  panels: number;
  inverter: number;
  battery: number;
  cables: number;
  breakers: number;
  disconnects: number;
  miscellaneous: number; // conduit, fittings, etc
  installation: number; // labour
  permitting: number;
  subtotal: number;
  contingency: number; // 10% buffer
  total: number;
  costPerKW: number;
  currency: string;
}

export interface WiringSpec {
  segment: string; // "PV Array to Combiner", "Combiner to Inverter", etc
  voltage: number; // volts
  current: number; // amps
  distance: number; // meters
  cableSize: string; // mm² (AWG equivalent)
  cableType: string; // PV-rated, etc
  colors: string[]; // positive, negative, ground
  breaker: string; // 20A, 30A, etc
  disconnect: boolean;
  notes: string;
}

export interface CalculationResult {
  location: Location;
  loadProfile: LoadProfile;
  irradiance: SolarIrradiance;
  recommendation: SystemRecommendation;
  costEstimate: CostEstimate;
  wiringSpecs: WiringSpec[];
  qualityWarnings: string[];
  safetyNotes: string[];
}

// ==================== SOLAR IRRADIANCE DATABASE ====================

const IRRADIANCE_DATABASE: Record<string, SolarIrradiance> = {
  'Nairobi, Kenya': {
    location: { latitude: -1.2921, longitude: 36.8219, country: 'Kenya', city: 'Nairobi', altitude: 1661 },
    ghi: 5.2,
    gti: 6.1,
    peakSunHours: 5.0,
    clearSkyIndex: 0.85,
  } as any,
  'Dar es Salaam, Tanzania': {
    location: { latitude: -6.8, longitude: 39.2833, country: 'Tanzania', city: 'Dar es Salaam', altitude: 14 },
    ghi: 5.0,
    gti: 5.8,
    peakSunHours: 4.8,
    clearSkyIndex: 0.80,
  } as any,
  'Lagos, Nigeria': {
    location: { latitude: 6.5244, longitude: 3.3792, country: 'Nigeria', city: 'Lagos', altitude: 0 },
    ghi: 4.8,
    gti: 5.4,
    peakSunHours: 4.5,
    clearSkyIndex: 0.75,
  } as any,
  'Cape Town, South Africa': {
    location: { latitude: -33.9249, longitude: 18.4241, country: 'South Africa', city: 'Cape Town', altitude: 42 },
    ghi: 5.5,
    gti: 6.3,
    peakSunHours: 5.2,
    clearSkyIndex: 0.88,
  } as any,
};

// ==================== APPLIANCE DATABASE ====================

export const APPLIANCE_DATABASE = {
  lights: [
    { name: 'LED Light (10W)', wattage: 10, dailyHours: 4 },
    { name: 'LED Light (20W)', wattage: 20, dailyHours: 4 },
    { name: 'Fluorescent Tube (40W)', wattage: 40, dailyHours: 6 },
  ],
  kitchen: [
    { name: 'Electric Kettle (2000W)', wattage: 2000, dailyHours: 0.5 },
    { name: 'Refrigerator (500W)', wattage: 500, dailyHours: 24 },
    { name: 'Microwave (1000W)', wattage: 1000, dailyHours: 0.5 },
    { name: 'Electric Stove (3000W)', wattage: 3000, dailyHours: 1 },
    { name: 'Blender (500W)', wattage: 500, dailyHours: 0.25 },
  ],
  entertainment: [
    { name: 'TV 32" (100W)', wattage: 100, dailyHours: 5 },
    { name: 'TV 55" (150W)', wattage: 150, dailyHours: 5 },
    { name: 'Radio (20W)', wattage: 20, dailyHours: 4 },
    { name: 'Computer (200W)', wattage: 200, dailyHours: 6 },
  ],
  climate: [
    { name: 'Air Conditioner 1.5 ton (1200W)', wattage: 1200, dailyHours: 8 },
    { name: 'Fan (100W)', wattage: 100, dailyHours: 8 },
    { name: 'Water Heater (1500W)', wattage: 1500, dailyHours: 2 },
  ],
  other: [
    { name: 'Washing Machine (1000W)', wattage: 1000, dailyHours: 1.5 },
    { name: 'Iron (1500W)', wattage: 1500, dailyHours: 1 },
    { name: 'Water Pump (750W)', wattage: 750, dailyHours: 2 },
  ],
};

// ==================== EQUIPMENT DATABASE ====================

export const EQUIPMENT_DATABASE = {
  panels: [
    { model: 'JA Solar 550W Mono', wattage: 550, efficiency: 0.215, price: 15000, authenticity: 'high', lifespan: 25 },
    { model: 'Canadian Solar 545W', wattage: 545, efficiency: 0.213, price: 14500, authenticity: 'high', lifespan: 25 },
    { model: 'JinkoSolar 550W', wattage: 550, efficiency: 0.216, price: 14800, authenticity: 'high', lifespan: 25 },
    { model: 'Trina Solar 545W', wattage: 545, efficiency: 0.212, price: 13500, authenticity: 'high', lifespan: 25 },
    { model: 'Generic 400W', wattage: 400, efficiency: 0.18, price: 8000, authenticity: 'low', lifespan: 15 },
  ],
  inverters: [
    { model: 'Deye SUN5K-G03 5kW Hybrid', wattage: 5000, type: 'hybrid', voltage: '48V', price: 85000, authenticity: 'high', warranty: 5 },
    { model: 'Solis 5kW Hybrid', wattage: 5000, type: 'hybrid', voltage: '48V', price: 88000, authenticity: 'high', warranty: 5 },
    { model: 'Growatt SPH 6000TL3 6kW', wattage: 6000, type: 'hybrid', voltage: '48V', price: 92000, authenticity: 'high', warranty: 5 },
    { model: 'Victron Multiplus II 5kW', wattage: 5000, type: 'hybrid', voltage: '48V', price: 110000, authenticity: 'high', warranty: 5 },
    { model: 'Generic 5kW Inverter', wattage: 5000, type: 'hybrid', voltage: '48V', price: 35000, authenticity: 'low', warranty: 1 },
  ],
  batteries: [
    { model: 'LiFePO4 48V 200Ah (9.6kWh)', capacity: 9.6, voltage: 48, type: 'LiFePO4', price: 450000, authenticity: 'high', cycles: 6000 },
    { model: 'LiFePO4 48V 100Ah (4.8kWh)', capacity: 4.8, voltage: 48, type: 'LiFePO4', price: 250000, authenticity: 'high', cycles: 6000 },
    { model: 'AGM 48V 100Ah (4.8kWh)', capacity: 4.8, voltage: 48, type: 'AGM', price: 180000, authenticity: 'medium', cycles: 1000 },
    { model: 'Gel 48V 100Ah (4.8kWh)', capacity: 4.8, voltage: 48, type: 'Gel', price: 150000, authenticity: 'medium', cycles: 800 },
    { model: 'Generic Lead-Acid 48V 100Ah', capacity: 4.8, voltage: 48, type: 'Lead-Acid', price: 80000, authenticity: 'low', cycles: 300 },
  ],
};

// ==================== CABLE SIZING CHART ====================

const CABLE_SIZING_CHART: Record<string, { amps: number; size: string }[]> = {
  'DC Circuit': [
    { amps: 0, size: '2.5' },
    { amps: 20, size: '4' },
    { amps: 35, size: '6' },
    { amps: 50, size: '10' },
    { amps: 70, size: '16' },
    { amps: 100, size: '25' },
    { amps: 150, size: '35' },
  ],
  'AC Circuit': [
    { amps: 0, size: '2.5' },
    { amps: 16, size: '4' },
    { amps: 25, size: '6' },
    { amps: 32, size: '10' },
    { amps: 50, size: '16' },
    { amps: 63, size: '25' },
    { amps: 100, size: '35' },
  ],
};

// ==================== CORE CALCULATOR CLASS ====================

export class SolarCalculatorEngine {
  /**
   * Calculate load profile from appliances
   */
  calculateLoadProfile(appliances: Appliance[]): LoadProfile {
    let totalDailyEnergy = 0;
    let peakLoad = 0;
    let nightLoad = 0;

    for (const appliance of appliances) {
      const dailyEnergy = (appliance.wattage * appliance.dailyHours * appliance.quantity) / 1000;
      totalDailyEnergy += dailyEnergy;

      const totalWattage = appliance.wattage * appliance.quantity;
      if (totalWattage > peakLoad) {
        peakLoad = totalWattage;
      }

      // If appliance runs during night (evening/night hours), add to night load
      if (appliance.dailyHours > 4) {
        nightLoad += totalWattage * 0.4; // 40% during night
      }
    }

    const averageLoad = (totalDailyEnergy * 1000) / 24; // Watts

    return {
      totalDailyEnergy,
      peakLoad: peakLoad / 1000, // kW
      averageLoad: averageLoad / 1000,
      nightLoad: nightLoad / 1000,
      appliances,
    };
  }

  /**
   * Get solar irradiance for location (API simulation)
   */
  getIrradiance(location: Location): SolarIrradiance {
    const key = `${location.city}, ${location.country}`;
    if (IRRADIANCE_DATABASE[key]) {
      return IRRADIANCE_DATABASE[key];
    }

    // Fallback: Calculate based on latitude (simplified)
    const latitude = Math.abs(location.latitude);
    const ghi = latitude < 15 ? 5.2 : latitude < 30 ? 5.0 : 4.5;
    const peakSunHours = ghi / 1000;

    return {
      location,
      ghi,
      gti: ghi * 1.15, // Tilted is 15% higher
      peakSunHours: ghi / 1000,
      clearSkyIndex: 0.82,
    } as any;
  }

  /**
   * Recommend system configuration
   */
  recommendSystem(
    loadProfile: LoadProfile,
    irradiance: SolarIrradiance,
    daysAutonomy: number = 3, // days of backup
    systemLosses: number = 0.15 // 15% losses
  ): SystemRecommendation {
    // Panel sizing
    const panelArraySize = (loadProfile.totalDailyEnergy * (1 + systemLosses)) / irradiance.peakSunHours;
    const panelWattage = 550;
    const panelCount = Math.ceil(panelArraySize * 1000 / panelWattage);
    const systemSizeKW = (panelCount * panelWattage) / 1000;

    // Inverter sizing (typically 1.25x peak load)
    const inverterSize = Math.ceil(loadProfile.peakLoad * 1.25);

    // Battery sizing
    const batteryEnergyNeeded = loadProfile.totalDailyEnergy * daysAutonomy;
    const depthOfDischarge = 0.8; // 80% DoD typical
    const batteryCapacityKWh = batteryEnergyNeeded / depthOfDischarge;
    const batteryVoltage = inverterSize > 4 ? 48 : 24;

    // Cable sizing
    const dcCurrent = (systemSizeKW * 1000) / (batteryVoltage * 0.9); // rough estimate
    const cableMainSize = this.calculateCableSize(dcCurrent, 'DC Circuit');
    const acCurrent = inverterSize * 1000 / 230;
    const cableSubSize = this.calculateCableSize(acCurrent / 2, 'AC Circuit'); // assuming split between sub-circuits

    // ROI Calculation
    const annualProduction = systemSizeKW * irradiance.peakSunHours * 365 * 0.85; // 85% system efficiency
    const costPerKW = 250000; // KSH per kW (rough estimate)
    const totalCost = systemSizeKW * costPerKW;
    const energyCostPerKWh = 35; // KSH in Kenya
    const annualSavings = annualProduction * energyCostPerKWh;
    const roi = totalCost / annualSavings;

    return {
      systemSizeKW,
      panelCount,
      panelWattage,
      panelType: 'Mono-crystalline 550W',
      inverterSize,
      inverterType: 'Hybrid',
      batteryCapacityKWh: Math.ceil(batteryCapacityKWh * 2) / 2, // round to 0.5
      batteryType: batteryCapacityKWh > 5 ? 'LiFePO4' : 'AGM',
      batteryVoltage,
      cableMainSize,
      cableSubSize,
      estimatedROI: Math.ceil(roi * 10) / 10,
      estimatedProduction: Math.ceil(annualProduction),
      paybackPeriod: Math.ceil(roi * 12),
    };
  }

  /**
   * Calculate cable size from current rating
   */
  private calculateCableSize(amps: number, circuitType: string): string {
    const chart = CABLE_SIZING_CHART[circuitType];
    let selectedSize = '2.5';
    for (const entry of chart) {
      if (amps <= entry.amps) {
        selectedSize = entry.size;
        break;
      }
    }
    return selectedSize;
  }

  /**
   * Estimate costs
   */
  estimateCosts(
    recommendation: SystemRecommendation,
    location: Location,
    hasInstallation: boolean = true
  ): CostEstimate {
    // Panel costs
    const panelCost = recommendation.panelCount * 15000; // avg price

    // Inverter cost
    const inverterCost = recommendation.inverterSize > 5 ? 90000 : 85000;

    // Battery cost
    const batteryCost = recommendation.batteryCapacityKWh > 5 ? 400000 : 200000;

    // Cable costs (rough estimate)
    const cableCost = 15000; // installation wiring

    // Breakers, disconnects, etc
    const breakerCost = 20000;
    const disconnectCost = 15000;

    // Miscellaneous (conduit, fittings, grounding, etc)
    const miscCost = 25000;

    // Installation labour (depends on location and system size)
    const installCost = hasInstallation ? recommendation.systemSizeKW * 30000 : 0;

    // Permitting
    const permitCost = 5000;

    const subtotal = panelCost + inverterCost + batteryCost + cableCost + breakerCost + disconnectCost + miscCost + permitCost;
    const contingency = subtotal * 0.1;
    const total = subtotal + contingency + installCost;

    return {
      panels: panelCost,
      inverter: inverterCost,
      battery: batteryCost,
      cables: cableCost,
      breakers: breakerCost,
      disconnects: disconnectCost,
      miscellaneous: miscCost,
      installation: installCost,
      permitting: permitCost,
      subtotal,
      contingency,
      total,
      costPerKW: total / recommendation.systemSizeKW,
      currency: 'KSH',
    };
  }

  /**
   * Generate wiring specifications
   */
  generateWiringSpecs(recommendation: SystemRecommendation): WiringSpec[] {
    return [
      {
        segment: 'PV Array to Combiner Box',
        voltage: 600,
        current: (recommendation.systemSizeKW * 1000) / 600,
        distance: 20,
        cableSize: recommendation.cableMainSize,
        cableType: 'PV Rated',
        colors: ['Red', 'Black', 'Green'],
        breaker: '20A DC',
        disconnect: true,
        notes: 'Use MC4 connectors, UV-rated cable',
      },
      {
        segment: 'Combiner to MPPT Controller',
        voltage: 600,
        current: (recommendation.systemSizeKW * 1000) / 600,
        distance: 15,
        cableSize: recommendation.cableMainSize,
        cableType: 'PV Rated',
        colors: ['Red', 'Black', 'Green'],
        breaker: '25A DC',
        disconnect: true,
        notes: 'DC disconnect switch required',
      },
      {
        segment: 'MPPT to Battery',
        voltage: recommendation.batteryVoltage,
        current: (recommendation.systemSizeKW * 1000) / recommendation.batteryVoltage,
        distance: 10,
        cableSize: recommendation.cableMainSize,
        cableType: 'Multi-strand',
        colors: ['Red (+)', 'Black (-)', 'Green (GND)'],
        breaker: '50A DC',
        disconnect: true,
        notes: 'Shortest possible run to minimize voltage drop',
      },
      {
        segment: 'Battery to Inverter',
        voltage: recommendation.batteryVoltage,
        current: (recommendation.inverterSize * 1000) / recommendation.batteryVoltage,
        distance: 5,
        cableSize: '16',
        cableType: 'Battery Cable',
        colors: ['Red (+)', 'Black (-)', 'Green (GND)'],
        breaker: '100A DC',
        disconnect: true,
        notes: 'Large gauge, short distance critical',
      },
      {
        segment: 'Inverter AC Out to Load Center',
        voltage: 230,
        current: recommendation.inverterSize * 1000 / 230,
        distance: 30,
        cableSize: recommendation.cableSubSize,
        cableType: 'AC Rated',
        colors: ['Brown (L)', 'Blue (N)', 'Green/Yellow (PE)'],
        breaker: '40A AC',
        disconnect: true,
        notes: 'AC disconnect switch required',
      },
    ];
  }

  /**
   * Complete system calculation
   */
  calculateCompleteSystem(
    location: Location,
    appliances: Appliance[],
    daysAutonomy: number = 3
  ): CalculationResult {
    const loadProfile = this.calculateLoadProfile(appliances);
    const irradiance = this.getIrradiance(location);
    const recommendation = this.recommendSystem(loadProfile, irradiance, daysAutonomy);
    const costEstimate = this.estimateCosts(recommendation, location);
    const wiringSpecs = this.generateWiringSpecs(recommendation);

    // Quality warnings
    const qualityWarnings: string[] = [];
    if (recommendation.panelType.toLowerCase().includes('generic')) {
      qualityWarnings.push('⚠️ Warning: Check panel authenticity - request certification documents');
    }
    if (recommendation.batteryType === 'Lead-Acid') {
      qualityWarnings.push('⚠️ Warning: Lead-acid batteries have shorter lifespan - consider LiFePO4');
    }

    // Safety notes
    const safetyNotes: string[] = [
      '🔒 Always install DC disconnect between PV array and controller',
      '🔒 AC disconnect switch required between inverter and load',
      '🔒 Use breakers on all circuits as specified',
      '🔒 Ground all metal components',
      '🔒 Use UV-rated PV cables for outdoor runs',
      '🔒 Label all connections clearly',
    ];

    return {
      location,
      loadProfile,
      irradiance,
      recommendation,
      costEstimate,
      wiringSpecs,
      qualityWarnings,
      safetyNotes,
    };
  }
}

export default SolarCalculatorEngine;
