// FEATURE ENGINEERING PIPELINE
// Creates derived features for ML models

export interface FeatureSet {
  original: Record<string, any>;
  derived: Record<string, any>;
  interactions: Record<string, any>;
  aggregations: Record<string, any>;
}

class FeatureEngineering {
  async engineerSolarFeatures(rawData: Record<string, any>): Promise<FeatureSet> {
    const derived: Record<string, any> = {};
    const interactions: Record<string, any> = {};
    const aggregations: Record<string, any> = {};
    
    // Derived features
    if (rawData.dailyConsumption && rawData.systemSize) {
      derived.coverageRatio = (rawData.systemSize * 4.8 * 0.85) / rawData.dailyConsumption;
    }
    
    if (rawData.roofArea && rawData.systemSize) {
      derived.areaEfficiency = rawData.systemSize / rawData.roofArea;
    }
    
    if (rawData.batteryKwh && rawData.dailyConsumption) {
      derived.backupHours = rawData.batteryKwh / (rawData.dailyConsumption / 24);
    }
    
    if (rawData.totalCost && rawData.annualSaving) {
      derived.paybackYears = rawData.totalCost / rawData.annualSaving;
      derived.roi = (rawData.annualSaving / rawData.totalCost) * 100;
    }
    
    if (rawData.irradiance && rawData.temperature) {
      derived.temperatureAdjustedIrradiance = rawData.irradiance * (1 - (rawData.temperature - 25) * 0.004);
    }
    
    // Interaction features
    if (rawData.roofPitch && rawData.orientation) {
      const orientationRad = (rawData.orientation * Math.PI) / 180;
      const pitchRad = (rawData.roofPitch * Math.PI) / 180;
      interactions.tiltFactor = Math.cos(pitchRad) * Math.cos(orientationRad);
      interactions.azimuthFactor = Math.sin(orientationRad);
    }
    
    if (rawData.batteryKwh && rawData.systemSize) {
      interactions.batteryToSolarRatio = rawData.batteryKwh / rawData.systemSize;
    }
    
    if (rawData.shadingLoss && rawData.irradiance) {
      interactions.effectiveIrradiance = rawData.irradiance * (1 - rawData.shadingLoss / 100);
    }
    
    // Aggregation features
    if (rawData.monthlyData && Array.isArray(rawData.monthlyData)) {
      const monthlyValues = rawData.monthlyData;
      aggregations.annualTotal = monthlyValues.reduce((a: number, b: number) => a + b, 0);
      aggregations.averageMonthly = aggregations.annualTotal / 12;
      aggregations.peakMonth = Math.max(...monthlyValues);
      aggregations.lowMonth = Math.min(...monthlyValues);
      aggregations.seasonalVariation = aggregations.peakMonth / aggregations.lowMonth;
    }
    
    if (rawData.hourlyData && Array.isArray(rawData.hourlyData)) {
      aggregations.daytimeAverage = rawData.hourlyData.slice(6, 18).reduce((a: number, b: number) => a + b, 0) / 12;
      aggregations.nighttimeAverage = [...rawData.hourlyData.slice(0, 6), ...rawData.hourlyData.slice(18)].reduce((a: number, b: number) => a + b, 0) / 12;
      aggregations.dayNightRatio = aggregations.daytimeAverage / aggregations.nighttimeAverage;
    }
    
    return {
      original: rawData,
      derived,
      interactions,
      aggregations
    };
  }
  
  async engineerFinancialFeatures(rawData: Record<string, any>): Promise<FeatureSet> {
    const derived: Record<string, any> = {};
    const interactions: Record<string, any> = {};
    const aggregations: Record<string, any> = {};
    
    // Derived financial features
    if (rawData.totalCost && rawData.annualSaving) {
      derived.simplePayback = rawData.totalCost / rawData.annualSaving;
      derived.roi10Year = ((rawData.annualSaving * 10 - rawData.totalCost) / rawData.totalCost) * 100;
    }
    
    if (rawData.totalCost && rawData.monthlyBill && rawData.gridTariff) {
      derived.monthlySavingPercent = (rawData.monthlySaving / rawData.monthlyBill) * 100;
      derived.breakEvenPoint = rawData.totalCost / rawData.monthlySaving;
    }
    
    // NPV and IRR calculations
    if (rawData.cashFlows && Array.isArray(rawData.cashFlows)) {
      const discountRate = 0.1; // 10%
      let npv = -rawData.totalCost;
      for (let i = 0; i < rawData.cashFlows.length; i++) {
        npv += rawData.cashFlows[i] / Math.pow(1 + discountRate, i + 1);
      }
      derived.npv = npv;
      
      // Simple IRR approximation
      let irr = 0.1;
      for (let i = 0; i < 10; i++) {
        let npvIrr = -rawData.totalCost;
        for (let j = 0; j < rawData.cashFlows.length; j++) {
          npvIrr += rawData.cashFlows[j] / Math.pow(1 + irr, j + 1);
        }
        irr += npvIrr > 0 ? 0.01 : -0.01;
      }
      derived.irr = irr;
    }
    
    return {
      original: rawData,
      derived,
      interactions,
      aggregations
    };
  }
  
  async engineerRiskFeatures(rawData: Record<string, any>): Promise<FeatureSet> {
    const derived: Record<string, any> = {};
    const interactions: Record<string, any> = {};
    const aggregations: Record<string, any> = {};
    
    // Risk scoring
    let riskScore = 0;
    
    if (rawData.gridReliability && rawData.gridReliability < 70) {
      riskScore += 20;
      derived.gridRisk = 'high';
    } else if (rawData.gridReliability && rawData.gridReliability < 85) {
      riskScore += 10;
      derived.gridRisk = 'medium';
    } else {
      derived.gridRisk = 'low';
    }
    
    if (rawData.shadingLoss && rawData.shadingLoss > 15) {
      riskScore += 15;
      derived.shadingRisk = 'high';
    } else if (rawData.shadingLoss && rawData.shadingLoss > 8) {
      riskScore += 8;
      derived.shadingRisk = 'medium';
    } else {
      derived.shadingRisk = 'low';
    }
    
    if (rawData.budget && rawData.totalCost && rawData.totalCost > rawData.budget) {
      riskScore += 25;
      derived.budgetRisk = 'high';
    }
    
    derived.overallRiskScore = riskScore;
    derived.riskLevel = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
    
    return {
      original: rawData,
      derived,
      interactions,
      aggregations
    };
  }
}

export const featureEngineering = new FeatureEngineering();