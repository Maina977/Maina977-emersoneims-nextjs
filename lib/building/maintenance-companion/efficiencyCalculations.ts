// Efficiency Calculator for Generator Maintenance Companion

export interface EfficiencyInput {
  fuelConsumption: number; // L/hour
  loadKw: number; // kW output
  ratedCapacity: number; // kW rated
  runningHours: number; // hours per day/week/month
  fuelPrice: number; // KES per liter
  electricityTariff: number; // KES per kWh (grid comparison)
  generatorAge?: number; // years
  lastServiceHours?: number; // hours since last service
}

export interface EfficiencyResult {
  efficiency: number; // percentage
  costPerKwh: number; // KES
  optimalLoadRange: { min: number; max: number }; // percentage of rated
  isOverloaded: boolean;
  isUnderloaded: boolean;
  loadPercentage: number;
  recommendation: string;
  comparisonToGrid: {
    generatorCost: number;
    gridCost: number;
    savings: number; // positive = generator cheaper
    percentageDifference: number;
  };
  projections: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  fuelEfficiencyRating: 'excellent' | 'good' | 'average' | 'poor' | 'very-poor';
  potentialSavings: {
    monthly: number;
    yearly: number;
    recommendation: string;
  };
}

export interface LoadAnalysis {
  currentLoad: number;
  optimalLoad: number;
  loadStatus: 'underloaded' | 'optimal' | 'overloaded';
  efficiencyAtCurrentLoad: number;
  efficiencyAtOptimalLoad: number;
  recommendation: string;
}

// Standard fuel consumption rates (L/kWh) for different load levels
const fuelConsumptionRates: Record<number, number> = {
  25: 0.35, // 25% load - poor efficiency
  50: 0.28, // 50% load - moderate efficiency
  75: 0.25, // 75% load - good efficiency
  100: 0.27, // 100% load - slightly reduced efficiency
  110: 0.32, // 110% overload - poor efficiency
};

export function calculateEfficiency(input: EfficiencyInput): EfficiencyResult {
  const { fuelConsumption, loadKw, ratedCapacity, runningHours, fuelPrice, electricityTariff } = input;

  // Calculate load percentage
  const loadPercentage = (loadKw / ratedCapacity) * 100;

  // Calculate actual efficiency (kWh per liter)
  const kwhPerLiter = loadKw / fuelConsumption;

  // Calculate cost per kWh
  const costPerKwh = fuelPrice / kwhPerLiter;

  // Determine theoretical optimal efficiency at this load
  const theoreticalEfficiency = getTheoreticalEfficiency(loadPercentage);

  // Calculate actual efficiency percentage (compared to theoretical max of ~3.5 kWh/L)
  const maxTheoreticalKwhPerLiter = 3.5; // Top-tier diesel genset efficiency
  const efficiency = (kwhPerLiter / maxTheoreticalKwhPerLiter) * 100;

  // Load status
  const isOverloaded = loadPercentage > 100;
  const isUnderloaded = loadPercentage < 40;

  // Optimal load range (60-80% is typically most efficient)
  const optimalLoadRange = { min: 60, max: 80 };

  // Grid comparison
  const generatorCost = costPerKwh * loadKw * runningHours;
  const gridCost = electricityTariff * loadKw * runningHours;
  const savings = gridCost - generatorCost;
  const percentageDifference = ((gridCost - generatorCost) / gridCost) * 100;

  // Projections (assuming 8 hours/day if not specified)
  const dailyHours = runningHours;
  const projections = {
    daily: costPerKwh * loadKw * dailyHours,
    weekly: costPerKwh * loadKw * dailyHours * 7,
    monthly: costPerKwh * loadKw * dailyHours * 30,
    yearly: costPerKwh * loadKw * dailyHours * 365
  };

  // Fuel efficiency rating
  const fuelEfficiencyRating = getFuelEfficiencyRating(kwhPerLiter);

  // Calculate potential savings if operating at optimal load
  const potentialSavings = calculatePotentialSavings(input, efficiency, loadPercentage);

  // Generate recommendation
  const recommendation = generateRecommendation(loadPercentage, efficiency, isOverloaded, isUnderloaded, fuelEfficiencyRating);

  return {
    efficiency: Math.round(efficiency * 10) / 10,
    costPerKwh: Math.round(costPerKwh * 100) / 100,
    optimalLoadRange,
    isOverloaded,
    isUnderloaded,
    loadPercentage: Math.round(loadPercentage * 10) / 10,
    recommendation,
    comparisonToGrid: {
      generatorCost: Math.round(generatorCost),
      gridCost: Math.round(gridCost),
      savings: Math.round(savings),
      percentageDifference: Math.round(percentageDifference * 10) / 10
    },
    projections: {
      daily: Math.round(projections.daily),
      weekly: Math.round(projections.weekly),
      monthly: Math.round(projections.monthly),
      yearly: Math.round(projections.yearly)
    },
    fuelEfficiencyRating,
    potentialSavings
  };
}

function getTheoreticalEfficiency(loadPercentage: number): number {
  // Interpolate fuel consumption rate based on load
  if (loadPercentage <= 25) return fuelConsumptionRates[25];
  if (loadPercentage <= 50) {
    return interpolate(25, 50, fuelConsumptionRates[25], fuelConsumptionRates[50], loadPercentage);
  }
  if (loadPercentage <= 75) {
    return interpolate(50, 75, fuelConsumptionRates[50], fuelConsumptionRates[75], loadPercentage);
  }
  if (loadPercentage <= 100) {
    return interpolate(75, 100, fuelConsumptionRates[75], fuelConsumptionRates[100], loadPercentage);
  }
  return fuelConsumptionRates[110];
}

function interpolate(x1: number, x2: number, y1: number, y2: number, x: number): number {
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

function getFuelEfficiencyRating(kwhPerLiter: number): 'excellent' | 'good' | 'average' | 'poor' | 'very-poor' {
  if (kwhPerLiter >= 3.2) return 'excellent';
  if (kwhPerLiter >= 2.8) return 'good';
  if (kwhPerLiter >= 2.4) return 'average';
  if (kwhPerLiter >= 2.0) return 'poor';
  return 'very-poor';
}

function calculatePotentialSavings(
  input: EfficiencyInput,
  currentEfficiency: number,
  currentLoadPercentage: number
): { monthly: number; yearly: number; recommendation: string } {
  const { fuelPrice, loadKw, runningHours } = input;

  // If already in optimal range, minimal savings
  if (currentLoadPercentage >= 60 && currentLoadPercentage <= 80) {
    return {
      monthly: 0,
      yearly: 0,
      recommendation: 'Operating at optimal load range. Maintain current operation.'
    };
  }

  // Calculate potential improvement
  let recommendation = '';
  let efficiencyImprovement = 0;

  if (currentLoadPercentage < 40) {
    // Severely underloaded - consolidate loads or downsize
    efficiencyImprovement = 15; // Could improve 15%
    recommendation = 'Consider consolidating loads to this generator or downsizing to a smaller unit for better efficiency.';
  } else if (currentLoadPercentage < 60) {
    // Underloaded - add loads
    efficiencyImprovement = 8;
    recommendation = 'Adding more load to reach 60-80% capacity would improve fuel efficiency.';
  } else if (currentLoadPercentage > 100) {
    // Overloaded - upgrade or load shed
    efficiencyImprovement = 12;
    recommendation = 'Generator is overloaded. Consider upgrading to larger unit or load shedding non-critical equipment.';
  } else if (currentLoadPercentage > 80) {
    // Slightly high - minor adjustment
    efficiencyImprovement = 5;
    recommendation = 'Operating slightly above optimal. Consider load management to stay within 60-80% capacity.';
  }

  // Calculate monetary savings from efficiency improvement
  const currentMonthlyFuel = (loadKw / (currentEfficiency / 100 * 3.5)) * runningHours * 30 * fuelPrice;
  const improvedEfficiency = currentEfficiency + efficiencyImprovement;
  const improvedMonthlyFuel = (loadKw / (improvedEfficiency / 100 * 3.5)) * runningHours * 30 * fuelPrice;
  const monthlySavings = currentMonthlyFuel - improvedMonthlyFuel;

  return {
    monthly: Math.round(monthlySavings),
    yearly: Math.round(monthlySavings * 12),
    recommendation
  };
}

function generateRecommendation(
  loadPercentage: number,
  efficiency: number,
  isOverloaded: boolean,
  isUnderloaded: boolean,
  rating: string
): string {
  if (isOverloaded) {
    return `⚠️ OVERLOAD WARNING: Generator is running at ${loadPercentage.toFixed(0)}% capacity. This reduces efficiency, increases wear, and risks equipment damage. Reduce load immediately or upgrade to a larger generator.`;
  }

  if (isUnderloaded) {
    return `📉 UNDERLOADED: Running at only ${loadPercentage.toFixed(0)}% capacity wastes fuel due to inefficient operation. Consider adding loads or switching to a smaller generator to improve efficiency by up to 30%.`;
  }

  if (loadPercentage >= 60 && loadPercentage <= 80) {
    return `✅ OPTIMAL OPERATION: Generator running at ${loadPercentage.toFixed(0)}% capacity in the sweet spot for fuel efficiency. Current efficiency rating: ${rating}. Maintain this load profile for best results.`;
  }

  if (loadPercentage > 80 && loadPercentage <= 100) {
    return `⚡ HIGH LOAD: Operating at ${loadPercentage.toFixed(0)}% capacity. Generator is working hard but within limits. Consider load management to stay in the 60-80% optimal range for extended component life.`;
  }

  if (loadPercentage >= 40 && loadPercentage < 60) {
    return `💡 MODERATE LOAD: Running at ${loadPercentage.toFixed(0)}% capacity. Efficiency is acceptable but could be improved by adding load to reach the 60-80% optimal range.`;
  }

  return `Generator efficiency: ${efficiency.toFixed(1)}%. Load: ${loadPercentage.toFixed(0)}% of rated capacity.`;
}

export function analyzeLoad(loadKw: number, ratedCapacity: number): LoadAnalysis {
  const currentLoad = (loadKw / ratedCapacity) * 100;
  const optimalLoad = 70; // 70% is the sweet spot

  let loadStatus: 'underloaded' | 'optimal' | 'overloaded';
  if (currentLoad < 40) {
    loadStatus = 'underloaded';
  } else if (currentLoad > 100) {
    loadStatus = 'overloaded';
  } else if (currentLoad >= 60 && currentLoad <= 80) {
    loadStatus = 'optimal';
  } else if (currentLoad < 60) {
    loadStatus = 'underloaded';
  } else {
    loadStatus = 'overloaded'; // 80-100% is not optimal but acceptable
  }

  // Efficiency estimates at different loads
  const efficiencyAtCurrentLoad = estimateEfficiency(currentLoad);
  const efficiencyAtOptimalLoad = estimateEfficiency(optimalLoad);

  let recommendation = '';
  switch (loadStatus) {
    case 'underloaded':
      const additionalLoad = (optimalLoad / 100 * ratedCapacity) - loadKw;
      recommendation = `Add approximately ${additionalLoad.toFixed(0)} kW of load to reach optimal efficiency. Or consider using a smaller generator if load cannot be increased.`;
      break;
    case 'overloaded':
      const excessLoad = loadKw - ratedCapacity;
      recommendation = `Reduce load by ${excessLoad.toFixed(0)} kW or upgrade to a ${Math.ceil(loadKw * 1.25)} kW generator for safe operation.`;
      break;
    case 'optimal':
      recommendation = 'Generator is operating in the optimal efficiency range. Maintain current load profile.';
      break;
  }

  return {
    currentLoad: Math.round(currentLoad * 10) / 10,
    optimalLoad,
    loadStatus,
    efficiencyAtCurrentLoad: Math.round(efficiencyAtCurrentLoad * 10) / 10,
    efficiencyAtOptimalLoad: Math.round(efficiencyAtOptimalLoad * 10) / 10,
    recommendation
  };
}

function estimateEfficiency(loadPercentage: number): number {
  // Approximate efficiency curve
  if (loadPercentage <= 25) return 55;
  if (loadPercentage <= 40) return 65;
  if (loadPercentage <= 60) return 80;
  if (loadPercentage <= 80) return 90;
  if (loadPercentage <= 100) return 85;
  return 70; // Overloaded
}

export function calculateBreakeven(
  generatorCostPerKwh: number,
  gridCostPerKwh: number,
  dailyLoadKw: number,
  dailyRunningHours: number
): { breakevenHours: number; recommendation: string } {
  if (generatorCostPerKwh <= gridCostPerKwh) {
    return {
      breakevenHours: 0,
      recommendation: 'Generator power is already cheaper than grid. Maximize generator usage during operating hours.'
    };
  }

  // Calculate when generator becomes worth using (accounting for grid unreliability)
  const costDifference = generatorCostPerKwh - gridCostPerKwh;
  const dailyLoadCost = dailyLoadKw * dailyRunningHours * costDifference;

  // If grid is unreliable, factor in downtime cost
  const typicalDowntimeCost = dailyLoadKw * 50; // Assume KES 50/kWh downtime cost
  const gridOutageHoursForBreakeven = dailyLoadCost / typicalDowntimeCost;

  return {
    breakevenHours: Math.round(gridOutageHoursForBreakeven * 10) / 10,
    recommendation: `Generator costs more than grid by KES ${costDifference.toFixed(2)}/kWh. However, if grid outages exceed ${gridOutageHoursForBreakeven.toFixed(1)} hours/day, generator provides net value through avoided downtime.`
  };
}

// Efficiency rating colors
export const efficiencyRatingColors: Record<string, string> = {
  'excellent': '#10B981', // Emerald
  'good': '#22C55E', // Green
  'average': '#F59E0B', // Amber
  'poor': '#EF4444', // Red
  'very-poor': '#991B1B' // Dark red
};

export const efficiencyRatingLabels: Record<string, string> = {
  'excellent': 'Excellent (≥3.2 kWh/L)',
  'good': 'Good (2.8-3.2 kWh/L)',
  'average': 'Average (2.4-2.8 kWh/L)',
  'poor': 'Poor (2.0-2.4 kWh/L)',
  'very-poor': 'Very Poor (<2.0 kWh/L)'
};
