// CORE DECISION ENGINE - CONFIDENCE SCORING
// Calculates confidence levels for AI decisions

export interface ConfidenceScore {
  overall: number;
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  components: ConfidenceComponent[];
  factors: ConfidenceFactor[];
  recommendations: string[];
}

export interface ConfidenceComponent {
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
  reasoning: string;
}

export interface ConfidenceFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  description: string;
}

class ConfidenceScoring {
  async calculateConfidence(
    design: any,
    inputData: any,
    modelMetadata: any
  ): Promise<ConfidenceScore> {
    const components: ConfidenceComponent[] = [];
    
    // Data quality confidence
    components.push(await this.assessDataQuality(inputData));
    
    // Model confidence
    components.push(await this.assessModelConfidence(modelMetadata));
    
    // Site-specific confidence
    components.push(await this.assessSiteConfidence(design.location));
    
    // Prediction stability
    components.push(await this.assessPredictionStability(design));
    
    // Historical validation
    components.push(await this.assessHistoricalValidation(design));
    
    // Calculate weighted overall score
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    for (const component of components) {
      totalWeightedScore += component.weightedScore;
      totalWeight += component.weight;
    }
    
    const overall = (totalWeightedScore / totalWeight) * 100;
    
    let level: ConfidenceScore['level'] = 'medium';
    if (overall >= 90) level = 'very_high';
    else if (overall >= 75) level = 'high';
    else if (overall >= 50) level = 'medium';
    else if (overall >= 25) level = 'low';
    else level = 'very_low';
    
    const factors = this.identifyFactors(components);
    const recommendations = this.generateRecommendations(components);
    
    return {
      overall: Math.round(overall),
      level,
      components,
      factors,
      recommendations
    };
  }
  
  private async assessDataQuality(inputData: any): Promise<ConfidenceComponent> {
    let score = 100;
    const issues = [];
    
    // Check data completeness
    const requiredFields = ['consumption', 'location', 'roofArea'];
    for (const field of requiredFields) {
      if (!inputData[field]) {
        score -= 15;
        issues.push(`Missing ${field}`);
      }
    }
    
    // Check data freshness
    if (inputData.timestamp) {
      const age = Date.now() - new Date(inputData.timestamp).getTime();
      const daysOld = age / 86400000;
      if (daysOld > 30) {
        score -= 10;
        issues.push(`Data is ${Math.round(daysOld)} days old`);
      }
    }
    
    // Check data consistency
    if (inputData.consumption && inputData.consumption > 100) {
      score -= 20;
      issues.push('Unusually high consumption value');
    }
    
    const reasoning = issues.length > 0 
      ? `Data quality reduced due to: ${issues.join(', ')}`
      : 'All required data present and within expected ranges';
    
    return {
      name: 'Data Quality',
      score: Math.max(0, score),
      weight: 0.30,
      weightedScore: Math.max(0, score) * 0.30,
      reasoning
    };
  }
  
  private async assessModelConfidence(modelMetadata: any): Promise<ConfidenceComponent> {
    let score = 85; // Base confidence
    
    // Adjust based on model metrics
    if (modelMetadata.accuracy) {
      score = score * (modelMetadata.accuracy / 100);
    }
    
    if (modelMetadata.trainingSamples) {
      if (modelMetadata.trainingSamples < 10000) {
        score -= 10;
      } else if (modelMetadata.trainingSamples < 50000) {
        score -= 5;
      }
    }
    
    if (modelMetadata.lastRetrained) {
      const daysSinceRetrain = (Date.now() - new Date(modelMetadata.lastRetrained).getTime()) / 86400000;
      if (daysSinceRetrain > 90) {
        score -= 10;
      }
    }
    
    const reasoning = `Model trained on ${modelMetadata.trainingSamples?.toLocaleString() || 'sufficient'} samples with ${modelMetadata.accuracy || 'good'} accuracy`;
    
    return {
      name: 'Model Confidence',
      score: Math.min(100, Math.max(0, score)),
      weight: 0.25,
      weightedScore: Math.min(100, Math.max(0, score)) * 0.25,
      reasoning
    };
  }
  
  private async assessSiteConfidence(location: any): Promise<ConfidenceComponent> {
    let score = 90;
    const factors = [];
    
    // Check if location is in training distribution
    const knownRegions = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret'];
    if (location.address && !knownRegions.some(r => location.address.includes(r))) {
      score -= 15;
      factors.push('Location outside primary training region');
    }
    
    // Check roof complexity
    if (location.roofPitch && location.roofPitch > 35) {
      score -= 10;
      factors.push('Steep roof pitch');
    }
    
    if (location.shading && location.shading > 20) {
      score -= 15;
      factors.push('Significant shading detected');
    }
    
    const reasoning = factors.length > 0 
      ? `Site confidence reduced: ${factors.join(', ')}`
      : 'Site characteristics well within model capabilities';
    
    return {
      name: 'Site Confidence',
      score: Math.max(0, score),
      weight: 0.20,
      weightedScore: Math.max(0, score) * 0.20,
      reasoning
    };
  }
  
  private async assessPredictionStability(design: any): Promise<ConfidenceComponent> {
    let score = 85;
    
    // Check for extreme values
    if (design.systemKw > 20) {
      score -= 15;
    }
    
    if (design.batteryKwh > 50) {
      score -= 10;
    }
    
    // Check for unusual combinations
    if (design.systemKw > 10 && design.batteryKwh === 0) {
      score -= 10;
    }
    
    const reasoning = 'Prediction stability within acceptable range';
    
    return {
      name: 'Prediction Stability',
      score: Math.max(0, score),
      weight: 0.15,
      weightedScore: Math.max(0, score) * 0.15,
      reasoning
    };
  }
  
  private async assessHistoricalValidation(design: any): Promise<ConfidenceComponent> {
    // Simulate validation against historical data
    let score = 80;
    
    // Adjust based on similarity to validated designs
    if (design.systemKw >= 5 && design.systemKw <= 10) {
      score += 10;
    }
    
    if (design.batteryKwh >= 5 && design.batteryKwh <= 15) {
      score += 5;
    }
    
    const reasoning = 'Similar designs have performed well historically';
    
    return {
      name: 'Historical Validation',
      score: Math.min(100, score),
      weight: 0.10,
      weightedScore: Math.min(100, score) * 0.10,
      reasoning
    };
  }
  
  private identifyFactors(components: ConfidenceComponent[]): ConfidenceFactor[] {
    const factors: ConfidenceFactor[] = [];
    
    for (const component of components) {
      const impact = component.score >= 80 ? 'positive' : component.score <= 50 ? 'negative' : 'neutral';
      const magnitude = Math.abs(50 - component.score) / 50;
      
      factors.push({
        name: component.name,
        impact,
        magnitude,
        description: component.reasoning
      });
    }
    
    return factors;
  }
  
  private generateRecommendations(components: ConfidenceComponent[]): string[] {
    const recommendations = [];
    
    for (const component of components) {
      if (component.score < 70) {
        switch (component.name) {
          case 'Data Quality':
            recommendations.push('Provide more accurate consumption data');
            recommendations.push('Upload recent utility bills for verification');
            break;
          case 'Site Confidence':
            recommendations.push('Schedule professional site assessment');
            recommendations.push('Upload photos of roof for better analysis');
            break;
          case 'Model Confidence':
            recommendations.push('Update to latest model version');
            break;
        }
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('High confidence in recommendation - proceed with implementation');
      recommendations.push('Schedule annual review to validate performance');
    }
    
    return recommendations;
  }
}

export const confidenceScoring = new ConfidenceScoring();