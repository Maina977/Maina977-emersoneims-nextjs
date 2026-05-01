// CONCEPT DRIFT DETECTION
// Detects when model performance degrades due to changing data patterns

export interface DriftReport {
  modelId: string;
  timestamp: Date;
  driftDetected: boolean;
  driftScore: number;
  driftType: 'concept' | 'data' | 'label' | 'feature';
  affectedFeatures: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface FeatureDistribution {
  feature: string;
  trainingMean: number;
  trainingStd: number;
  currentMean: number;
  currentStd: number;
  driftMagnitude: number;
  pValue: number;
}

class DriftDetection {
  private referenceDistributions: Map<string, Map<string, FeatureDistribution>> = new Map();
  private driftHistory: Map<string, DriftReport[]> = new Map();
  
  async setReferenceDistribution(modelId: string, features: Record<string, number[]>): Promise<void> {
    const distributions = new Map<string, FeatureDistribution>();
    
    for (const [feature, values] of Object.entries(features)) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);
      
      distributions.set(feature, {
        feature,
        trainingMean: mean,
        trainingStd: std,
        currentMean: mean,
        currentStd: std,
        driftMagnitude: 0,
        pValue: 1
      });
    }
    
    this.referenceDistributions.set(modelId, distributions);
  }
  
  async detectDrift(
    modelId: string,
    currentData: Record<string, number[]>,
    windowSize: number = 1000
  ): Promise<DriftReport> {
    const reference = this.referenceDistributions.get(modelId);
    if (!reference) {
      throw new Error(`No reference distribution for model ${modelId}`);
    }
    
    const affectedFeatures: string[] = [];
    let maxDrift = 0;
    
    for (const [feature, currentValues] of Object.entries(currentData)) {
      const refDist = reference.get(feature);
      if (!refDist) continue;
      
      const currentMean = currentValues.reduce((a, b) => a + b, 0) / currentValues.length;
      const driftMagnitude = Math.abs(currentMean - refDist.trainingMean) / refDist.trainingStd;
      
      // Update distribution
      refDist.currentMean = currentMean;
      refDist.driftMagnitude = driftMagnitude;
      
      // Calculate p-value using Kolmogorov-Smirnov test approximation
      const pValue = this.calculatePValue(currentValues, refDist.trainingMean, refDist.trainingStd);
      refDist.pValue = pValue;
      
      if (driftMagnitude > 0.5) {
        affectedFeatures.push(feature);
        maxDrift = Math.max(maxDrift, driftMagnitude);
      }
    }
    
    const driftDetected = affectedFeatures.length > 0;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let driftType: 'concept' | 'data' | 'label' | 'feature' = 'feature';
    
    if (driftDetected) {
      if (maxDrift > 2) severity = 'critical';
      else if (maxDrift > 1.5) severity = 'high';
      else if (maxDrift > 1) severity = 'medium';
      
      // Determine drift type
      if (affectedFeatures.includes('target') || affectedFeatures.includes('label')) {
        driftType = 'label';
      } else if (affectedFeatures.length > 3) {
        driftType = 'concept';
      } else {
        driftType = 'feature';
      }
    }
    
    const recommendations = this.generateRecommendations(driftType, affectedFeatures, severity);
    
    const report: DriftReport = {
      modelId,
      timestamp: new Date(),
      driftDetected,
      driftScore: maxDrift,
      driftType,
      affectedFeatures,
      severity,
      recommendations
    };
    
    // Store history
    const history = this.driftHistory.get(modelId) || [];
    history.push(report);
    if (history.length > 100) history.shift();
    this.driftHistory.set(modelId, history);
    
    return report;
  }
  
  async getDriftHistory(modelId: string, hours: number = 168): Promise<DriftReport[]> {
    const history = this.driftHistory.get(modelId) || [];
    const cutoff = new Date(Date.now() - hours * 3600000);
    return history.filter(r => r.timestamp > cutoff);
  }
  
  async getCurrentDistributions(modelId: string): Promise<FeatureDistribution[]> {
    const distributions = this.referenceDistributions.get(modelId);
    if (!distributions) return [];
    return Array.from(distributions.values());
  }
  
  async getDriftTrend(modelId: string): Promise<{
    driftScores: number[];
    dates: Date[];
    trend: 'increasing' | 'decreasing' | 'stable';
    alertThreshold: number;
  }> {
    const history = await this.getDriftHistory(modelId, 168);
    const driftScores = history.map(r => r.driftScore);
    const dates = history.map(r => r.timestamp);
    
    // Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (driftScores.length > 5) {
      const recent = driftScores.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const older = driftScores.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
      if (recent > older * 1.1) trend = 'increasing';
      else if (recent < older * 0.9) trend = 'decreasing';
    }
    
    return {
      driftScores,
      dates,
      trend,
      alertThreshold: 1.5
    };
  }
  
  async resetReference(modelId: string): Promise<void> {
    this.referenceDistributions.delete(modelId);
    this.driftHistory.delete(modelId);
  }
  
  private calculatePValue(sample: number[], populationMean: number, populationStd: number): number {
    const sampleMean = sample.reduce((a, b) => a + b, 0) / sample.length;
    const standardError = populationStd / Math.sqrt(sample.length);
    const zScore = Math.abs((sampleMean - populationMean) / standardError);
    
    // Approximate p-value from z-score
    // Using normal distribution approximation
    return Math.exp(-0.5 * zScore * zScore) / (Math.sqrt(2 * Math.PI) * zScore);
  }
  
  private generateRecommendations(
    driftType: string,
    affectedFeatures: string[],
    severity: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (driftType === 'concept') {
      recommendations.push('Retrain model with recent data');
      recommendations.push('Review feature engineering pipeline');
      recommendations.push('Consider ensemble methods for stability');
    } else if (driftType === 'data') {
      recommendations.push('Validate data pipeline integrity');
      recommendations.push('Check for data source changes');
      recommendations.push('Implement data validation checks');
    } else if (driftType === 'label') {
      recommendations.push('Review labeling process');
      recommendations.push('Check for annotation drift');
      recommendations.push('Re-label recent samples');
    } else {
      recommendations.push(`Monitor feature: ${affectedFeatures.join(', ')}`);
      recommendations.push('Consider feature normalization');
    }
    
    if (severity === 'high' || severity === 'critical') {
      recommendations.push('Immediate model retraining recommended');
      recommendations.push('Rollback to previous model version');
    }
    
    return recommendations;
  }
}

export const driftDetection = new DriftDetection();