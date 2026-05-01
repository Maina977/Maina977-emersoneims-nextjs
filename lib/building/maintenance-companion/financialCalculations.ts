// Financial Calculations for Generator Maintenance Companion

export interface RepairLogEntry {
  id: string;
  date: string;
  description: string;
  partsCost: number;
  laborCost: number;
  partsReplaced: string[];
  engineHoursAtService: number;
  technician?: string;
  notes?: string;
}

export interface GeneratorAsset {
  id: string;
  name: string;
  brand: string;
  model: string;
  ratedCapacity: number; // kW
  purchaseDate: string;
  purchasePrice: number;
  currentHours: number;
  estimatedLifeHours: number; // Typically 20,000-50,000 hours
  repairHistory: RepairLogEntry[];
}

export interface RepairVsReplaceResult {
  recommendation: 'repair' | 'replace' | 'consider-replacement';
  remainingLifePercentage: number;
  totalMaintenanceCost: number;
  averageAnnualMaintenance: number;
  maintenanceCostPerHour: number;
  currentBookValue: number;
  replacementCost: number;
  breakEvenAnalysis: {
    yearsUntilBreakeven: number;
    hoursUntilBreakeven: number;
    worthRepairing: boolean;
  };
  factors: {
    age: { score: number; note: string };
    hours: { score: number; note: string };
    repairFrequency: { score: number; note: string };
    repairCostTrend: { score: number; note: string };
    reliability: { score: number; note: string };
  };
  summary: string;
}

export interface ROIAnalysis {
  totalInvestment: number;
  totalOperatingCost: number;
  totalValueGenerated: number;
  netROI: number;
  paybackPeriodMonths: number;
  costPerHourOfOperation: number;
  costPerKwhGenerated: number;
  annualDepreciation: number;
  currentAssetValue: number;
}

export interface UpsizingRecommendation {
  currentCapacity: number;
  recommendedCapacity: number;
  reason: string;
  costAnalysis: {
    currentCostPerKwh: number;
    projectedCostPerKwh: number;
    annualSavings: number;
    paybackPeriod: number;
  };
  upgrade: boolean;
}

// Calculate total maintenance costs
export function calculateTotalMaintenanceCost(repairHistory: RepairLogEntry[]): number {
  return repairHistory.reduce((total, entry) => total + entry.partsCost + entry.laborCost, 0);
}

// Calculate average annual maintenance
export function calculateAverageAnnualMaintenance(asset: GeneratorAsset): number {
  const years = getAssetAgeYears(asset.purchaseDate);
  if (years === 0) return 0;
  return calculateTotalMaintenanceCost(asset.repairHistory) / years;
}

// Calculate maintenance cost per running hour
export function calculateMaintenanceCostPerHour(asset: GeneratorAsset): number {
  if (asset.currentHours === 0) return 0;
  return calculateTotalMaintenanceCost(asset.repairHistory) / asset.currentHours;
}

// Get asset age in years
export function getAssetAgeYears(purchaseDate: string): number {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  return Math.max(0, (now.getTime() - purchase.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

// Calculate book value using straight-line depreciation
export function calculateBookValue(asset: GeneratorAsset): number {
  const ageYears = getAssetAgeYears(asset.purchaseDate);
  const depreciationYears = 10; // Standard depreciation period for generators
  const residualValue = asset.purchasePrice * 0.1; // 10% residual value

  if (ageYears >= depreciationYears) {
    return residualValue;
  }

  const annualDepreciation = (asset.purchasePrice - residualValue) / depreciationYears;
  return Math.max(residualValue, asset.purchasePrice - (annualDepreciation * ageYears));
}

// Repair vs Replace Analysis
export function analyzeRepairVsReplace(
  asset: GeneratorAsset,
  upcomingRepairCost: number,
  newGeneratorCost: number
): RepairVsReplaceResult {
  const ageYears = getAssetAgeYears(asset.purchaseDate);
  const remainingLifeHours = Math.max(0, asset.estimatedLifeHours - asset.currentHours);
  const remainingLifePercentage = (remainingLifeHours / asset.estimatedLifeHours) * 100;
  const totalMaintenanceCost = calculateTotalMaintenanceCost(asset.repairHistory);
  const averageAnnualMaintenance = calculateAverageAnnualMaintenance(asset);
  const maintenanceCostPerHour = calculateMaintenanceCostPerHour(asset);
  const currentBookValue = calculateBookValue(asset);

  // Factor analysis
  const factors = analyzeFactors(asset, ageYears, remainingLifePercentage, totalMaintenanceCost);

  // Overall score (0-100, higher = more reason to replace)
  const overallScore = (
    factors.age.score * 0.2 +
    factors.hours.score * 0.25 +
    factors.repairFrequency.score * 0.2 +
    factors.repairCostTrend.score * 0.2 +
    factors.reliability.score * 0.15
  );

  // Break-even analysis
  const estimatedAnnualHours = asset.currentHours / Math.max(1, ageYears);
  const remainingYears = remainingLifeHours / estimatedAnnualHours;

  // Cost to continue with repair
  const costToRepair = upcomingRepairCost + (averageAnnualMaintenance * remainingYears);

  // Cost of new generator over same period (lower maintenance for new unit)
  const newMaintenanceRate = averageAnnualMaintenance * 0.3; // New generator costs 30% of old for maintenance
  const costOfNewUnit = newGeneratorCost + (newMaintenanceRate * remainingYears);

  const breakEvenYears = (newGeneratorCost - upcomingRepairCost) / (averageAnnualMaintenance - newMaintenanceRate);
  const breakEvenHours = breakEvenYears * estimatedAnnualHours;
  const worthRepairing = costToRepair < costOfNewUnit && remainingLifeHours > breakEvenHours;

  // Recommendation
  let recommendation: 'repair' | 'replace' | 'consider-replacement';
  let summary: string;

  if (overallScore >= 70 || remainingLifePercentage < 15) {
    recommendation = 'replace';
    summary = `This generator has reached ${(100 - remainingLifePercentage).toFixed(0)}% of its expected life with increasing maintenance costs. Replacement is recommended to avoid escalating repair bills and unexpected downtime.`;
  } else if (overallScore >= 50 || (upcomingRepairCost > currentBookValue * 0.5)) {
    recommendation = 'consider-replacement';
    summary = `The upcoming repair (KES ${upcomingRepairCost.toLocaleString()}) represents ${((upcomingRepairCost / currentBookValue) * 100).toFixed(0)}% of the current asset value. Consider replacement, especially if reliability has been declining.`;
  } else {
    recommendation = 'repair';
    summary = `Generator has ${remainingLifePercentage.toFixed(0)}% life remaining and maintenance costs are manageable. Proceed with repair and continue monitoring trends.`;
  }

  return {
    recommendation,
    remainingLifePercentage: Math.round(remainingLifePercentage * 10) / 10,
    totalMaintenanceCost,
    averageAnnualMaintenance: Math.round(averageAnnualMaintenance),
    maintenanceCostPerHour: Math.round(maintenanceCostPerHour * 100) / 100,
    currentBookValue: Math.round(currentBookValue),
    replacementCost: newGeneratorCost,
    breakEvenAnalysis: {
      yearsUntilBreakeven: Math.round(breakEvenYears * 10) / 10,
      hoursUntilBreakeven: Math.round(breakEvenHours),
      worthRepairing
    },
    factors,
    summary
  };
}

function analyzeFactors(
  asset: GeneratorAsset,
  ageYears: number,
  remainingLifePercentage: number,
  totalMaintenanceCost: number
): RepairVsReplaceResult['factors'] {
  // Age factor (0-100, higher = older/worse)
  const ageScore = Math.min(100, ageYears * 8); // Max out at ~12.5 years
  const ageNote = ageYears < 5 ? 'Relatively new' :
                  ageYears < 10 ? 'Mid-life' :
                  ageYears < 15 ? 'Aging unit' : 'End of typical lifespan';

  // Hours factor
  const hoursPercentUsed = 100 - remainingLifePercentage;
  const hoursScore = hoursPercentUsed;
  const hoursNote = hoursPercentUsed < 30 ? 'Low hours - plenty of life remaining' :
                    hoursPercentUsed < 60 ? 'Moderate hours - mid-life' :
                    hoursPercentUsed < 80 ? 'High hours - consider major service' :
                    'Very high hours - approaching end of life';

  // Repair frequency (repairs per year)
  const repairsPerYear = asset.repairHistory.length / Math.max(1, ageYears);
  const repairFrequencyScore = Math.min(100, repairsPerYear * 25); // 4+ repairs/year = 100
  const repairFrequencyNote = repairsPerYear < 1 ? 'Low repair frequency' :
                              repairsPerYear < 2 ? 'Normal repair frequency' :
                              repairsPerYear < 4 ? 'Increasing repairs' :
                              'Frequent breakdowns - reliability concern';

  // Repair cost trend (compare recent to earlier)
  const midpoint = Math.floor(asset.repairHistory.length / 2);
  const earlyRepairs = asset.repairHistory.slice(0, midpoint);
  const recentRepairs = asset.repairHistory.slice(midpoint);
  const earlyAvgCost = earlyRepairs.length > 0
    ? earlyRepairs.reduce((sum, r) => sum + r.partsCost + r.laborCost, 0) / earlyRepairs.length
    : 0;
  const recentAvgCost = recentRepairs.length > 0
    ? recentRepairs.reduce((sum, r) => sum + r.partsCost + r.laborCost, 0) / recentRepairs.length
    : 0;
  const costTrendRatio = earlyAvgCost > 0 ? recentAvgCost / earlyAvgCost : 1;
  const repairCostTrendScore = Math.min(100, Math.max(0, (costTrendRatio - 1) * 100));
  const repairCostTrendNote = costTrendRatio < 1 ? 'Repair costs decreasing' :
                              costTrendRatio < 1.5 ? 'Repair costs stable' :
                              costTrendRatio < 2 ? 'Repair costs increasing' :
                              'Repair costs escalating significantly';

  // Reliability score (based on unplanned failures)
  const unplannedRepairs = asset.repairHistory.filter(r =>
    r.description.toLowerCase().includes('emergency') ||
    r.description.toLowerCase().includes('breakdown') ||
    r.description.toLowerCase().includes('failure')
  ).length;
  const reliabilityScore = Math.min(100, unplannedRepairs * 20);
  const reliabilityNote = unplannedRepairs === 0 ? 'No unplanned failures recorded' :
                          unplannedRepairs < 3 ? 'Occasional unplanned failures' :
                          unplannedRepairs < 5 ? 'Reliability declining' :
                          'Frequent unplanned failures';

  return {
    age: { score: ageScore, note: ageNote },
    hours: { score: hoursScore, note: hoursNote },
    repairFrequency: { score: repairFrequencyScore, note: repairFrequencyNote },
    repairCostTrend: { score: repairCostTrendScore, note: repairCostTrendNote },
    reliability: { score: reliabilityScore, note: reliabilityNote }
  };
}

// ROI Analysis
export function calculateROI(
  asset: GeneratorAsset,
  monthlyRunningHours: number,
  averageLoadKw: number,
  valuePerKwh: number // Value of power generated (avoided grid cost + downtime cost)
): ROIAnalysis {
  const ageYears = getAssetAgeYears(asset.purchaseDate);
  const totalMaintenanceCost = calculateTotalMaintenanceCost(asset.repairHistory);

  // Calculate fuel cost (approximate)
  const fuelConsumptionRate = 0.27; // L/kWh average
  const fuelPrice = 180; // KES/L average
  const totalFuelCost = asset.currentHours * averageLoadKw * fuelConsumptionRate * fuelPrice;

  const totalInvestment = asset.purchasePrice;
  const totalOperatingCost = totalMaintenanceCost + totalFuelCost;

  // Total value generated
  const totalKwhGenerated = asset.currentHours * averageLoadKw;
  const totalValueGenerated = totalKwhGenerated * valuePerKwh;

  // Net ROI
  const netProfit = totalValueGenerated - totalInvestment - totalOperatingCost;
  const netROI = (netProfit / totalInvestment) * 100;

  // Payback period
  const monthlyValue = monthlyRunningHours * averageLoadKw * valuePerKwh;
  const monthlyFuelCost = monthlyRunningHours * averageLoadKw * fuelConsumptionRate * fuelPrice;
  const monthlyMaintenance = calculateAverageAnnualMaintenance(asset) / 12;
  const monthlyNetValue = monthlyValue - monthlyFuelCost - monthlyMaintenance;
  const paybackPeriodMonths = monthlyNetValue > 0 ? asset.purchasePrice / monthlyNetValue : Infinity;

  // Cost metrics
  const costPerHourOfOperation = asset.currentHours > 0
    ? (totalOperatingCost + (asset.purchasePrice - calculateBookValue(asset))) / asset.currentHours
    : 0;
  const costPerKwhGenerated = totalKwhGenerated > 0
    ? (totalOperatingCost + (asset.purchasePrice - calculateBookValue(asset))) / totalKwhGenerated
    : 0;

  // Depreciation
  const annualDepreciation = (asset.purchasePrice - (asset.purchasePrice * 0.1)) / 10;
  const currentAssetValue = calculateBookValue(asset);

  return {
    totalInvestment,
    totalOperatingCost: Math.round(totalOperatingCost),
    totalValueGenerated: Math.round(totalValueGenerated),
    netROI: Math.round(netROI * 10) / 10,
    paybackPeriodMonths: Math.round(paybackPeriodMonths),
    costPerHourOfOperation: Math.round(costPerHourOfOperation * 100) / 100,
    costPerKwhGenerated: Math.round(costPerKwhGenerated * 100) / 100,
    annualDepreciation: Math.round(annualDepreciation),
    currentAssetValue: Math.round(currentAssetValue)
  };
}

// Upsizing Recommendation
export function analyzeUpsizing(
  currentCapacity: number,
  averageLoad: number,
  peakLoad: number,
  currentEfficiency: number,
  growthRate: number // Annual load growth percentage
): UpsizingRecommendation {
  const currentLoadPercentage = (averageLoad / currentCapacity) * 100;
  const peakLoadPercentage = (peakLoad / currentCapacity) * 100;

  // Project 3 years ahead
  const projectedPeakLoad = peakLoad * Math.pow(1 + growthRate / 100, 3);
  const projectedLoadPercentage = (projectedPeakLoad / currentCapacity) * 100;

  let recommendedCapacity = currentCapacity;
  let reason = '';
  let upgrade = false;

  if (peakLoadPercentage > 100) {
    // Already overloaded
    recommendedCapacity = Math.ceil(peakLoad * 1.25 / 10) * 10; // 25% headroom, round to nearest 10kW
    reason = 'Generator is currently overloaded. Immediate upgrade recommended to prevent damage and ensure reliability.';
    upgrade = true;
  } else if (projectedLoadPercentage > 100) {
    // Will be overloaded within 3 years
    recommendedCapacity = Math.ceil(projectedPeakLoad * 1.25 / 10) * 10;
    reason = `Based on ${growthRate}% annual growth, generator will be overloaded within 3 years. Plan for upgrade.`;
    upgrade = true;
  } else if (currentLoadPercentage < 30 && peakLoadPercentage < 50) {
    // Oversized - could downsize
    recommendedCapacity = Math.ceil(peakLoad * 1.5 / 10) * 10;
    reason = 'Generator is significantly oversized. Consider downsizing for better fuel efficiency.';
    upgrade = false; // Downsize recommendation
  } else if (currentLoadPercentage > 80) {
    // Running hot - add headroom
    recommendedCapacity = Math.ceil(peakLoad * 1.4 / 10) * 10;
    reason = 'Running close to capacity limits. Consider upsizing for reliability and efficiency.';
    upgrade = true;
  } else {
    reason = 'Current generator size is appropriate for load profile.';
  }

  // Cost analysis
  const currentCostPerKwh = calculateCostPerKwh(currentLoadPercentage);
  const optimalLoadWithNewGen = (averageLoad / recommendedCapacity) * 100;
  const projectedCostPerKwh = calculateCostPerKwh(Math.min(80, Math.max(60, optimalLoadWithNewGen)));

  const annualKwh = averageLoad * 8 * 365; // 8 hours/day
  const annualSavings = (currentCostPerKwh - projectedCostPerKwh) * annualKwh;

  const newGeneratorCost = recommendedCapacity * 50000; // Approximate KES 50,000 per kW
  const paybackPeriod = annualSavings > 0 ? newGeneratorCost / annualSavings : Infinity;

  return {
    currentCapacity,
    recommendedCapacity,
    reason,
    costAnalysis: {
      currentCostPerKwh: Math.round(currentCostPerKwh * 100) / 100,
      projectedCostPerKwh: Math.round(projectedCostPerKwh * 100) / 100,
      annualSavings: Math.round(annualSavings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10
    },
    upgrade
  };
}

function calculateCostPerKwh(loadPercentage: number): number {
  // Approximate cost per kWh based on load percentage
  const fuelPrice = 180; // KES/L
  let fuelConsumption: number;

  if (loadPercentage < 30) fuelConsumption = 0.38;
  else if (loadPercentage < 50) fuelConsumption = 0.30;
  else if (loadPercentage < 70) fuelConsumption = 0.26;
  else if (loadPercentage < 90) fuelConsumption = 0.25;
  else fuelConsumption = 0.28;

  return fuelConsumption * fuelPrice;
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

// Sample repair history for demo
export const sampleRepairHistory: RepairLogEntry[] = [
  {
    id: '1',
    date: '2023-01-15',
    description: 'Scheduled 500-hour service',
    partsCost: 8500,
    laborCost: 5000,
    partsReplaced: ['Oil filter', 'Fuel filter', 'Air filter'],
    engineHoursAtService: 500,
    technician: 'John Kamau'
  },
  {
    id: '2',
    date: '2023-06-20',
    description: '1000-hour major service',
    partsCost: 25000,
    laborCost: 12000,
    partsReplaced: ['Oil filter', 'Fuel filter', 'Air filter', 'Coolant', 'Fan belt'],
    engineHoursAtService: 1000,
    technician: 'John Kamau'
  },
  {
    id: '3',
    date: '2023-09-10',
    description: 'Emergency - Starter motor failure',
    partsCost: 65000,
    laborCost: 8000,
    partsReplaced: ['Starter motor'],
    engineHoursAtService: 1250,
    technician: 'Peter Ochieng',
    notes: 'Starter failed during morning start. Caused 4-hour downtime.'
  },
  {
    id: '4',
    date: '2024-01-08',
    description: 'Scheduled 1500-hour service',
    partsCost: 12000,
    laborCost: 6000,
    partsReplaced: ['Oil filter', 'Fuel filter', 'Primary fuel filter'],
    engineHoursAtService: 1500,
    technician: 'John Kamau'
  },
  {
    id: '5',
    date: '2024-05-15',
    description: 'AVR replacement - voltage instability',
    partsCost: 85000,
    laborCost: 15000,
    partsReplaced: ['AVR SX460'],
    engineHoursAtService: 1850,
    technician: 'Peter Ochieng'
  },
  {
    id: '6',
    date: '2024-08-22',
    description: '2000-hour major service',
    partsCost: 45000,
    laborCost: 18000,
    partsReplaced: ['Oil filter', 'Fuel filters', 'Air filter', 'Coolant', 'Fan belt', 'Water pump'],
    engineHoursAtService: 2000,
    technician: 'John Kamau'
  }
];
