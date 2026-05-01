/**
 * ==================================================================================
 * ADVANCED FEATURES SUITE - PART 2
 * ==================================================================================
 * Remaining advanced engines: TIER 5, 6, and 7
 * 
 * TIER 5: ADVANCED IOT INTEGRATION (4 engines)
 * - GridConnectionIntelligenceEngine
 * - FleetManagementEngine
 * - EVChargingIntegrationEngine
 * - SmartWaterHeatingEngine
 * 
 * TIER 6: ADVANCED ANALYTICS (5 engines)
 * - WarrantyManagementEngine
 * - InsuranceIntegrationEngine
 * - WasteRecyclingTrackingEngine
 * - CustomerSuccessPredictionEngine
 * - AdvancedDiagnosticsMLEngine
 * 
 * TIER 7: BLOCKCHAIN & WEB3 (2 engines)
 * - P2PEnergyTradingEngine
 * - CarbonCreditNFTEngine
 * 
 * @version 1.0.0
 * @author SolarGeniusPro AI Team
 */

// ============================================================================
// TIER 5: GRID CONNECTION INTELLIGENCE ENGINE
// ============================================================================

export interface GridStatus {
  connected: boolean;
  frequency: number;
  voltage: number;
  isStressed: boolean;
  priceSignal: number;
  recommendation: string;
}

export class GridConnectionIntelligenceEngine {
  public analyzeGridStatus(
    frequency: number,
    voltage: number,
    gridPrice: number
  ): GridStatus {
    const connected = Math.abs(frequency - 50) < 0.5;
    const isStressed = frequency < 49.5; // Grid under stress

    let recommendation = '✅ Grid stable - use grid power normally';
    if (isStressed) {
      recommendation = '⚠️ Grid stressed - switch to battery to support grid';
    }
    if (gridPrice > 30) {
      recommendation = '💰 High grid prices - use solar/battery instead';
    }

    return {
      connected,
      frequency,
      voltage,
      isStressed,
      priceSignal: gridPrice,
      recommendation,
    };
  }

  public getGridServicePayment(frequency: number, duration: number): number {
    // Get paid when grid is stressed (frequency drops)
    if (frequency < 49.5) {
      return 500; // KSH 500 per hour frequency support
    }
    return 0;
  }
}

// ============================================================================
// TIER 5: FLEET MANAGEMENT ENGINE
// ============================================================================

export interface FleetMetrics {
  totalSystems: number;
  totalCapacity: number;
  totalProduction: number;
  averageEfficiency: number;
  underperformingCount: number;
  maintenanceRequired: number;
  totalValue: number;
  monthlyRevenue: number;
}

export class FleetManagementEngine {
  public getFleetMetrics(systems: Array<any>): FleetMetrics {
    const totalSystems = systems.length;
    const totalCapacity = systems.reduce((sum, s) => sum + (s.size || 0), 0);
    const totalProduction = systems.reduce((sum, s) => sum + (s.production || 0), 0);
    const averageEfficiency = systems.length > 0
      ? (totalProduction / totalCapacity / 1.2) * 100
      : 0;

    const underperformingCount = systems.filter((s) => (s.efficiency || 0) < 0.9).length;
    const maintenanceRequired = systems.filter((s) => (s.healthScore || 100) < 80).length;
    const totalValue = systems.reduce((sum, s) => sum + (s.value || 500000), 0);
    const monthlyRevenue = systems.reduce((sum, s) => sum + (s.monthlyRevenue || 50000), 0);

    return {
      totalSystems,
      totalCapacity,
      totalProduction,
      averageEfficiency: Math.round(averageEfficiency),
      underperformingCount,
      maintenanceRequired,
      totalValue,
      monthlyRevenue,
    };
  }

  public generateFleetAlert(systems: Array<any>): string[] {
    const alerts: string[] = [];

    const underperforming = systems.filter((s) => (s.efficiency || 0) < 0.85);
    if (underperforming.length > 0) {
      alerts.push(`⚠️ ${underperforming.length} systems underperforming`);
    }

    const failureRisk = systems.filter((s) => (s.healthScore || 100) < 60);
    if (failureRisk.length > 0) {
      alerts.push(`🚨 ${failureRisk.length} systems at failure risk`);
    }

    const avgEfficiency = systems.length > 0
      ? systems.reduce((sum, s) => sum + (s.efficiency || 0), 0) / systems.length
      : 0;

    if (avgEfficiency < 0.9) {
      alerts.push(`📉 Fleet average efficiency: ${(avgEfficiency * 100).toFixed(1)}% (below 90% target)`);
    }

    return alerts;
  }
}

// ============================================================================
// TIER 5: EV CHARGING INTEGRATION ENGINE
// ============================================================================

export interface EVChargingOptimization {
  recommendedChargeTime: string;
  estimatedCost: number;
  co2Saved: number;
  solarPercentage: number;
  gridPercentage: number;
}

export class EVChargingIntegrationEngine {
  public optimizeEVCharging(
    batterySize: number, // kWh
    currentCharge: number, // %
    targetCharge: number, // %
    solarProduction: number, // kW
    gridPrice: number // KSH/kWh
  ): EVChargingOptimization {
    const energyNeeded = (batterySize * (targetCharge - currentCharge)) / 100;

    // Find cheapest charging window
    let recommendedChargeTime = '14:00-16:00'; // Peak solar
    if (gridPrice > 30) {
      recommendedChargeTime = '22:00-06:00'; // Off-peak grid
    }

    const solarPercentage = solarProduction > 6.6 ? 100 : Math.max(0, (solarProduction / 6.6) * 100);
    const gridPercentage = 100 - solarPercentage;

    const estimatedCost = solarPercentage > 80 ? 0 : energyNeeded * gridPrice * (gridPercentage / 100);

    const co2Saved = energyNeeded * 0.85 * (solarPercentage / 100); // kg CO2 avoided

    return {
      recommendedChargeTime,
      estimatedCost,
      co2Saved,
      solarPercentage: Math.round(solarPercentage),
      gridPercentage: Math.round(gridPercentage),
    };
  }
}

// ============================================================================
// TIER 5: SMART WATER HEATING ENGINE
// ============================================================================

export interface WaterHeatingOptimization {
  optimalHeatingHour: number;
  estimatedEnergy: number;
  estimatedCost: number;
  co2Offset: number;
  recommendation: string;
}

export class SmartWaterHeatingEngine {
  public optimizeWaterHeating(
    tankCapacity: number, // Liters
    currentTemp: number, // °C
    targetTemp: number, // °C
    solarForecast: Array<{ hour: number; production: number }>,
    gridPrice: number // KSH/kWh
  ): WaterHeatingOptimization {
    // Energy needed = mass * specific heat * temperature change
    const energyNeeded = (tankCapacity / 1000) * 4.18 * (targetTemp - currentTemp) / 3600; // kWh

    // Find best hour (high solar, low grid price)
    let bestHour = 0;
    let bestScore = -Infinity;

    solarForecast.forEach(({ hour, production }) => {
      const solarScore = production * 10; // Prefer solar
      const priceScore = (50 - gridPrice) * 5; // Prefer low prices
      const score = solarScore + priceScore;

      if (score > bestScore) {
        bestScore = score;
        bestHour = hour;
      }
    });

    const solarProduction = solarForecast[bestHour]?.production || 0;
    const solarPercentage = Math.min(100, (solarProduction / 2) * 100);
    const gridPercentage = 100 - solarPercentage;

    const estimatedCost = energyNeeded * gridPrice * (gridPercentage / 100);
    const co2Offset = energyNeeded * solarPercentage * 0.85;

    const recommendation =
      solarPercentage > 80
        ? `✅ Excellent: Heat water at ${bestHour}:00 using mostly solar (${solarPercentage.toFixed(0)}%)`
        : `ℹ️ Heat water at ${bestHour}:00 (${solarPercentage.toFixed(0)}% solar, cost: KSH ${estimatedCost.toFixed(0)})`;

    return {
      optimalHeatingHour: bestHour,
      estimatedEnergy: energyNeeded,
      estimatedCost,
      co2Offset,
      recommendation,
    };
  }
}

// ============================================================================
// TIER 6: WARRANTY MANAGEMENT ENGINE
// ============================================================================

export interface WarrantyInfo {
  equipment: string;
  warrantyYears: number;
  expirationDate: Date;
  daysRemaining: number;
  claimEligible: boolean;
  claimValue: number;
}

export class WarrantyManagementEngine {
  public trackWarranty(equipmentType: string, purchaseDate: Date): WarrantyInfo {
    // Standard warranty periods
    const warrantyPeriods: Record<string, number> = {
      'solar-panel': 25,
      'inverter': 10,
      'battery': 12,
      'controller': 5,
      'meter': 5,
    };

    const warrantyYears = warrantyPeriods[equipmentType] || 5;
    const expirationDate = new Date(purchaseDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + warrantyYears);

    const now = new Date();
    const daysRemaining = Math.floor((expirationDate.getTime() - now.getTime()) / (24 * 3600000));
    const claimEligible = daysRemaining > 0;

    // Claim value: 50% of typical equipment cost
    const claimValues: Record<string, number> = {
      'solar-panel': 15000,
      'inverter': 80000,
      'battery': 100000,
      'controller': 40000,
      'meter': 20000,
    };

    return {
      equipment: equipmentType,
      warrantyYears,
      expirationDate,
      daysRemaining,
      claimEligible,
      claimValue: claimValues[equipmentType] || 0,
    };
  }
}

// ============================================================================
// TIER 6: INSURANCE INTEGRATION ENGINE
// ============================================================================

export interface InsuranceQuote {
  provider: string;
  monthlyPremium: number;
  coverageAmount: number;
  deductible: number;
  coverage: string[];
}

export class InsuranceIntegrationEngine {
  public getInsuranceQuotes(systemValue: number, location: string): InsuranceQuote[] {
    const quotes: InsuranceQuote[] = [];

    const basePremium = systemValue * 0.001; // 0.1% of system value

    // Quote 1: Basic coverage
    quotes.push({
      provider: 'InsureCo Solar',
      monthlyPremium: basePremium,
      coverageAmount: systemValue * 0.8,
      deductible: 50000,
      coverage: ['Equipment damage', 'Theft', 'Natural disaster'],
    });

    // Quote 2: Comprehensive
    quotes.push({
      provider: 'SolarGuard Insurance',
      monthlyPremium: basePremium * 1.5,
      coverageAmount: systemValue,
      deductible: 25000,
      coverage: ['Equipment damage', 'Theft', 'Natural disaster', 'Performance guarantee', 'Liability'],
    });

    // Quote 3: Premium
    quotes.push({
      provider: 'Elite Solar Cover',
      monthlyPremium: basePremium * 2,
      coverageAmount: systemValue * 1.2, // Replacement value
      deductible: 0,
      coverage: [
        'Equipment damage',
        'Theft',
        'Natural disaster',
        'Performance guarantee',
        'Liability',
        'Lost income during repair',
      ],
    });

    return quotes;
  }
}

// ============================================================================
// TIER 6: WASTE & RECYCLING TRACKING ENGINE
// ============================================================================

export interface RecyclingData {
  endOfLifeYear: number;
  wasteGenerated: number; // kg
  recycleablePercentage: number; // %
  partnerRecycler: string;
  secondLifePotential: string;
}

export class WasteRecyclingTrackingEngine {
  public trackEndOfLife(equipmentType: string, purchaseDate: Date): RecyclingData {
    const lifespan: Record<string, number> = {
      'panel': 25,
      'inverter': 10,
      'battery': 12,
      'controller': 15,
    };

    const years = lifespan[equipmentType] || 10;
    const endOfLifeYear = new Date().getFullYear() + years;

    // Weights
    const weights: Record<string, number> = {
      'panel': 20, // kg
      'inverter': 15,
      'battery': 60,
      'controller': 5,
    };

    const weight = weights[equipmentType] || 10;
    const recycleable = 0.95; // 95% recyclable

    // Second life potential
    let secondLife = '';
    if (equipmentType === 'battery') {
      secondLife = 'Can be used for 5-7 more years in second-life applications (stationary storage)';
    }

    return {
      endOfLifeYear,
      wasteGenerated: weight,
      recycleablePercentage: recycleable * 100,
      partnerRecycler: 'SolarCycle Africa / E-Waste Partners',
      secondLifePotential: secondLife,
    };
  }
}

// ============================================================================
// TIER 6: CUSTOMER SUCCESS PREDICTION ENGINE
// ============================================================================

export interface SuccessPrediction {
  riskScore: number; // 0-100, higher = more at-risk
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  interventionRecommended: string;
  retentionOffer?: string;
}

export class CustomerSuccessPredictionEngine {
  public predictChurn(
    monthsSinceInstall: number,
    monthlyBillReduction: number, // %
    maintenanceIssues: number,
    supportTickets: number,
    systemEfficiency: number // %
  ): SuccessPrediction {
    let riskScore = 0;

    // New customers (< 6 months) are always higher risk
    if (monthsSinceInstall < 6) {
      riskScore += 20;
    }

    // Poor bill reduction = dissatisfaction
    if (monthlyBillReduction < 20) {
      riskScore += 30;
    }

    // Maintenance issues = frustration
    riskScore += Math.min(30, maintenanceIssues * 15);

    // High support ticket volume
    riskScore += Math.min(20, supportTickets * 2);

    // Low efficiency
    if (systemEfficiency < 80) {
      riskScore += 25;
    }

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';

    const riskFactors: string[] = [];
    if (monthlyBillReduction < 20) riskFactors.push('Below-target bill reduction');
    if (maintenanceIssues > 3) riskFactors.push('Multiple maintenance issues');
    if (supportTickets > 5) riskFactors.push('High support ticket volume');
    if (systemEfficiency < 80) riskFactors.push('System underperforming');

    let intervention = 'Continue regular monitoring';
    if (riskLevel === 'critical') {
      intervention = 'URGENT: Customer support call recommended within 48 hours';
    } else if (riskLevel === 'high') {
      intervention = 'Schedule system health check and maintenance visit';
    }

    let retentionOffer = undefined;
    if (riskLevel === 'high' || riskLevel === 'critical') {
      retentionOffer = 'Free system optimization + 20% discount on future upgrades';
    }

    return {
      riskScore,
      riskLevel,
      riskFactors,
      interventionRecommended: intervention,
      retentionOffer,
    };
  }
}

// ============================================================================
// TIER 6: ADVANCED DIAGNOSTICS ML ENGINE
// ============================================================================

export interface MLDiagnosis {
  problem: string;
  probability: number; // 0-100%
  rootCause: string;
  solution: string;
  successRate: number; // %
  estimatedCost: number;
}

export class AdvancedDiagnosticsMLEngine {
  private diagnosticModels: Record<string, any> = {
    'low-production': {
      causes: ['Cloud cover', 'Dust on panels', 'Inverter fault', 'Wiring fault', 'Battery issue'],
      solutions: [
        'Check weather forecast',
        'Clean panels',
        'Restart inverter',
        'Check connections',
        'Test battery voltage',
      ],
    },
    'high-temperature': {
      causes: ['Poor ventilation', 'High ambient temp', 'Inverter overload', 'Dust accumulation'],
      solutions: [
        'Improve airflow',
        'Reduce load',
        'Check cooling system',
        'Clean equipment',
      ],
    },
  };

  public diagnose(symptom: string, metrics: any): MLDiagnosis[] {
    const diagnoses: MLDiagnosis[] = [];

    // Simple pattern matching (in production use trained ML model)
    if (symptom.includes('production') || symptom.includes('low')) {
      diagnoses.push({
        problem: 'Cloud cover',
        probability: 60,
        rootCause: 'Weather phenomenon',
        solution: 'Wait for clear skies',
        successRate: 100,
        estimatedCost: 0,
      });

      diagnoses.push({
        problem: 'Dust accumulation',
        probability: 40,
        rootCause: 'Panel cleanliness',
        solution: 'Clean panels with soft brush',
        successRate: 95,
        estimatedCost: 2000,
      });
    }

    return diagnoses.sort((a, b) => b.probability - a.probability);
  }
}

// ============================================================================
// TIER 7: P2P ENERGY TRADING ENGINE
// ============================================================================

export interface P2PTransaction {
  id: string;
  buyer: string;
  seller: string;
  energyAmount: number; // kWh
  pricePerKwh: number;
  totalAmount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  smartContractHash?: string;
}

export class P2PEnergyTradingEngine {
  public facilitateTrade(
    buyerId: string,
    sellerId: string,
    energyAmount: number,
    gridPrice: number
  ): P2PTransaction {
    // P2P price: 10% discount from grid
    const p2pPrice = gridPrice * 0.9;
    const totalAmount = energyAmount * p2pPrice;

    const transaction: P2PTransaction = {
      id: `P2P-${Date.now()}`,
      buyer: buyerId,
      seller: sellerId,
      energyAmount,
      pricePerKwh: p2pPrice,
      totalAmount,
      timestamp: new Date(),
      status: 'completed',
      // DATA POLICY: a real smart-contract hash requires an on-chain tx
      // (e.g. Celo / Polygon). Refusing to fabricate one.
      smartContractHash: (() => { throw new Error('DATA_POLICY: smartContractHash requires a real on-chain transaction. See DATA_POLICY.md'); })(),
    };

    return transaction;
  }

  public calculateMarketPrice(
    gridPrice: number,
    localSupply: number,
    localDemand: number
  ): number {
    // Dynamic pricing based on supply/demand
    const ratio = localDemand / localSupply;

    if (ratio > 1.5) {
      return gridPrice * 0.95; // High demand, stay competitive
    } else if (ratio < 0.5) {
      return gridPrice * 0.7; // Oversupply, discount to sell
    }

    return gridPrice * 0.85; // Normal, 15% discount from grid
  }
}

// ============================================================================
// TIER 7: CARBON CREDIT NFT ENGINE
// ============================================================================

export interface CarbonNFT {
  tokenId: string;
  co2Amount: number; // kg CO2
  year: number;
  owner: string;
  mintDate: Date;
  expirationDate: Date;
  marketValue: number; // KSH
  blockchainTransaction: string;
}

export class CarbonCreditNFTEngine {
  public mintCarbonNFT(
    systemId: string,
    co2Offset: number,
    owner: string
  ): CarbonNFT {
    const year = new Date().getFullYear();
    const marketValue = (co2Offset / 1000) * 15; // KSH 15 per ton CO2

    const tokenId = `CNT-${year}-${systemId}`;
    const mintDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5); // 5-year validity

    return {
      tokenId,
      co2Amount: co2Offset,
      year,
      owner,
      mintDate,
      expirationDate,
      marketValue,
      // DATA POLICY: real NFT mint must come from a verified contract.
      blockchainTransaction: (() => { throw new Error('DATA_POLICY: NFT mint requires a real on-chain transaction hash. See DATA_POLICY.md'); })(),
    };
  }

  public tradeCarbonNFT(tokenId: string, newOwner: string, price: number): any {
    return {
      tokenId,
      previousOwner: 'seller-address',
      newOwner,
      price,
      timestamp: new Date(),
      // DATA POLICY: a trade hash must come from the chain after settlement.
      transactionHash: (() => { throw new Error('DATA_POLICY: trade transactionHash requires a real on-chain transfer. See DATA_POLICY.md'); })(),
      status: 'completed',
    };
  }
}

export default {
  GridConnectionIntelligenceEngine,
  FleetManagementEngine,
  EVChargingIntegrationEngine,
  SmartWaterHeatingEngine,
  WarrantyManagementEngine,
  InsuranceIntegrationEngine,
  WasteRecyclingTrackingEngine,
  CustomerSuccessPredictionEngine,
  AdvancedDiagnosticsMLEngine,
  P2PEnergyTradingEngine,
  CarbonCreditNFTEngine,
};
