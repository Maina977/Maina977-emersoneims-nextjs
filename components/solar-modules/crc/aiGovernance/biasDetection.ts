// BIAS DETECTION FOR AI MODELS
// Ensures fair and unbiased recommendations across regions, demographics, and system types

export interface BiasReport {
  modelId: string;
  modelName: string;
  timestamp: Date;
  overallBiasScore: number; // 0-100 (lower is better)
  biasMetrics: BiasMetric[];
  recommendations: string[];
  certified: boolean;
}

export interface BiasMetric {
  name: string;
  score: number;
  threshold: number;
  status: 'pass' | 'warning' | 'fail';
  details: string;
}

export interface DemographicGroup {
  region: string;
  incomeLevel: 'low' | 'medium' | 'high';
  propertyType: 'residential' | 'commercial' | 'industrial';
  gridAccess: 'good' | 'poor' | 'none';
}

class BiasDetection {
  private biasThresholds = {
    demographicParity: 0.8,    // 80% minimum
    equalOpportunity: 0.85,    // 85% minimum
    predictiveEquality: 0.9,   // 90% minimum
    treatmentEquality: 0.85    // 85% minimum
  };

  async detectBias(
    predictions: Array<{ value: any; actual: any; group: DemographicGroup }>,
    modelId: string,
    modelName: string
  ): Promise<BiasReport> {
    const biasMetrics: BiasMetric[] = [];

    // 1. Demographic Parity - Equal acceptance rates across groups
    const demographicParity = this.calculateDemographicParity(predictions);
    biasMetrics.push({
      name: 'Demographic Parity',
      score: demographicParity,
      threshold: this.biasThresholds.demographicParity,
      status: demographicParity >= this.biasThresholds.demographicParity ? 'pass' : 'fail',
      details: `Acceptance rates vary by ${(1 - demographicParity) * 100}% across demographic groups`
    });

    // 2. Equal Opportunity - Equal true positive rates
    const equalOpportunity = this.calculateEqualOpportunity(predictions);
    biasMetrics.push({
      name: 'Equal Opportunity',
      score: equalOpportunity,
      threshold: this.biasThresholds.equalOpportunity,
      status: equalOpportunity >= this.biasThresholds.equalOpportunity ? 'pass' : 'fail',
      details: `True positive rates vary by ${(1 - equalOpportunity) * 100}% across groups`
    });

    // 3. Predictive Equality - Equal false positive rates
    const predictiveEquality = this.calculatePredictiveEquality(predictions);
    biasMetrics.push({
      name: 'Predictive Equality',
      score: predictiveEquality,
      threshold: this.biasThresholds.predictiveEquality,
      status: predictiveEquality >= this.biasThresholds.predictiveEquality ? 'pass' : 'fail',
      details: `False positive rates vary by ${(1 - predictiveEquality) * 100}% across groups`
    });

    // 4. Regional Bias - Geographic fairness
    const regionalBias = this.calculateRegionalBias(predictions);
    biasMetrics.push({
      name: 'Regional Fairness',
      score: regionalBias,
      threshold: 0.85,
      status: regionalBias >= 0.85 ? 'pass' : 'warning',
      details: `Urban vs rural recommendation disparity detected`
    });

    // 5. Economic Bias - Income level fairness
    const economicBias = this.calculateEconomicBias(predictions);
    biasMetrics.push({
      name: 'Economic Fairness',
      score: economicBias,
      threshold: 0.8,
      status: economicBias >= 0.8 ? 'pass' : 'warning',
      details: `Low-income areas receive ${(1 - economicBias) * 100}% fewer recommendations`
    });

    const overallBiasScore = biasMetrics.reduce((sum, m) => sum + m.score, 0) / biasMetrics.length * 100;
    const failedMetrics = biasMetrics.filter(m => m.status === 'fail');
    
    const recommendations = this.generateRecommendations(biasMetrics, failedMetrics);
    
    return {
      modelId,
      modelName,
      timestamp: new Date(),
      overallBiasScore,
      biasMetrics,
      recommendations,
      certified: failedMetrics.length === 0 && overallBiasScore >= 85
    };
  }

  private calculateDemographicParity(predictions: Array<{ value: any; group: DemographicGroup }>): number {
    // Group predictions by demographic
    const groups: Record<string, number[]> = {};
    
    for (const pred of predictions) {
      const key = `${pred.group.region}_${pred.group.incomeLevel}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(pred.value.accepted ? 1 : 0);
    }
    
    // Calculate acceptance rate per group
    const acceptanceRates = Object.values(groups).map(g => 
      g.reduce((a,b) => a + b, 0) / g.length
    );
    
    // Calculate parity (min/max ratio)
    const minRate = Math.min(...acceptanceRates);
    const maxRate = Math.max(...acceptanceRates);
    
    return minRate / maxRate;
  }

  private calculateEqualOpportunity(predictions: Array<{ value: any; actual: any; group: DemographicGroup }>): number {
    const groups: Record<string, { tp: number; fn: number }> = {};
    
    for (const pred of predictions) {
      const key = `${pred.group.region}_${pred.group.incomeLevel}`;
      if (!groups[key]) groups[key] = { tp: 0, fn: 0 };
      
      const isPositive = pred.actual === 1;
      const predictedPositive = pred.value.accepted === true;
      
      if (isPositive && predictedPositive) groups[key].tp++;
      if (isPositive && !predictedPositive) groups[key].fn++;
    }
    
    const tprs = Object.values(groups).map(g => g.tp / (g.tp + g.fn));
    const minTpr = Math.min(...tprs);
    const maxTpr = Math.max(...tprs);
    
    return minTpr / maxTpr;
  }

  private calculatePredictiveEquality(predictions: Array<{ value: any; actual: any; group: DemographicGroup }>): number {
    const groups: Record<string, { fp: number; tn: number }> = {};
    
    for (const pred of predictions) {
      const key = `${pred.group.region}_${pred.group.incomeLevel}`;
      if (!groups[key]) groups[key] = { fp: 0, tn: 0 };
      
      const isNegative = pred.actual === 0;
      const predictedPositive = pred.value.accepted === true;
      
      if (isNegative && predictedPositive) groups[key].fp++;
      if (isNegative && !predictedPositive) groups[key].tn++;
    }
    
    const fprs = Object.values(groups).map(g => g.fp / (g.fp + g.tn));
    const minFpr = Math.min(...fprs);
    const maxFpr = Math.max(...fprs);
    
    return minFpr / maxFpr;
  }

  private calculateRegionalBias(predictions: Array<{ value: any; group: DemographicGroup }>): number {
    const regions: Record<string, number[]> = {};
    
    for (const pred of predictions) {
      if (!regions[pred.group.region]) regions[pred.group.region] = [];
      regions[pred.group.region].push(pred.value.accepted ? 1 : 0);
    }
    
    const regionalRates = Object.values(regions).map(r => 
      r.reduce((a,b) => a + b, 0) / r.length
    );
    
    const minRate = Math.min(...regionalRates);
    const maxRate = Math.max(...regionalRates);
    
    return minRate / maxRate;
  }

  private calculateEconomicBias(predictions: Array<{ value: any; group: DemographicGroup }>): number {
    const incomeGroups: Record<string, number[]> = {
      low: [],
      medium: [],
      high: []
    };
    
    for (const pred of predictions) {
      incomeGroups[pred.group.incomeLevel].push(pred.value.accepted ? 1 : 0);
    }
    
    const lowRate = incomeGroups.low.reduce((a,b) => a + b, 0) / incomeGroups.low.length;
    const highRate = incomeGroups.high.reduce((a,b) => a + b, 0) / incomeGroups.high.length;
    
    return lowRate / highRate;
  }

  private generateRecommendations(biasMetrics: BiasMetric[], failedMetrics: BiasMetric[]): string[] {
    const recommendations: string[] = [];
    
    for (const metric of failedMetrics) {
      switch (metric.name) {
        case 'Demographic Parity':
          recommendations.push('Retrain model with balanced dataset across demographic groups');
          recommendations.push('Apply reweighting techniques to underrepresented groups');
          break;
        case 'Equal Opportunity':
          recommendations.push('Increase true positive rate for disadvantaged groups');
          recommendations.push('Adjust decision threshold per group');
          break;
        case 'Predictive Equality':
          recommendations.push('Reduce false positive rate disparity across groups');
          recommendations.push('Implement group-specific calibration');
          break;
        case 'Regional Fairness':
          recommendations.push('Collect more training data from underrepresented regions');
          recommendations.push('Implement region-specific model variants');
          break;
        case 'Economic Fairness':
          recommendations.push('Ensure low-income areas receive equal recommendation access');
          recommendations.push('Add economic indicators to feature set');
          break;
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Model passes all bias checks. Continue monitoring.');
      recommendations.push('Schedule quarterly bias re-evaluation.');
    }
    
    return recommendations;
  }

  async generateBiasReportForModel(
    modelId: string,
    modelName: string,
    testData: Array<{ features: any; label: number; group: DemographicGroup }>,
    predictFn: (features: any) => any
  ): Promise<BiasReport> {
    const predictions = [];
    
    for (const item of testData) {
      const value = await predictFn(item.features);
      predictions.push({
        value: { accepted: value.accepted },
        actual: item.label,
        group: item.group
      });
    }
    
    return this.detectBias(predictions, modelId, modelName);
  }
}

export const biasDetection = new BiasDetection();