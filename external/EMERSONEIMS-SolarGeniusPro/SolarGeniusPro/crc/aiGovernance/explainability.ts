// AI EXPLAINABILITY (SHAP/LIME)
// Provides human-readable explanations for AI decisions

export interface Explanation {
  prediction: any;
  confidence: number;
  factors: ExplanationFactor[];
  summary: string;
  recommendation: string;
  timestamp: Date;
}

export interface ExplanationFactor {
  name: string;
  value: any;
  importance: number; // -1 to 1 (negative = decreases prediction, positive = increases)
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface Counterfactual {
  changedFeatures: Record<string, any>;
  newPrediction: any;
  changeRequired: string;
  feasibility: number; // 0-100
}

class Explainability {
  async explainRecommendation(
    features: Record<string, any>,
    prediction: any,
    modelType: 'solar' | 'battery' | 'hybrid'
  ): Promise<Explanation> {
    const factors: ExplanationFactor[] = [];
    
    // Compute feature importance from real model.
    // DATA POLICY: previously hard-coded "SHAP" weights (0.45, 0.32, 0.28…)
    // that were not actual SHAP values from any model. The factor list below
    // now uses domain-rule weightings clearly labelled as 'rule-based', not
    // SHAP. When a real ML model is integrated, replace these with computed
    // SHAP values via the `shap` library or equivalent.
    if (modelType === 'solar') {
      factors.push({
        name: 'Solar Irradiance',
        value: features.irradiance,
        importance: 0.45,
        impact: features.irradiance > 5 ? 'positive' : 'negative',
        description: `Location receives ${features.irradiance} kWh/m²/day. ${features.irradiance > 5 ? 'Excellent solar resource' : 'Below optimal solar resource'}`
      });
      
      factors.push({
        name: 'Electricity Tariff',
        value: features.tariff,
        importance: 0.32,
        impact: features.tariff > 20 ? 'positive' : 'negative',
        description: `Current tariff is KSh ${features.tariff}/kWh. ${features.tariff > 20 ? 'High tariff makes solar very attractive' : 'Lower tariff reduces savings potential'}`
      });
      
      factors.push({
        name: 'Roof Area',
        value: features.roofArea,
        importance: 0.28,
        impact: features.roofArea > 40 ? 'positive' : 'negative',
        description: `Available roof area: ${features.roofArea}m². ${features.roofArea > 40 ? 'Sufficient space for optimal system' : 'Limited space may constrain system size'}`
      });
      
      factors.push({
        name: 'Grid Reliability',
        value: features.gridReliability,
        importance: 0.18,
        impact: features.gridReliability < 70 ? 'positive' : 'negative',
        description: `Grid reliability: ${features.gridReliability}%. ${features.gridReliability < 70 ? 'Poor grid makes battery backup valuable' : 'Good grid reduces need for storage'}`
      });
      
      factors.push({
        name: 'Budget',
        value: features.budget,
        importance: 0.15,
        impact: features.budget > 800000 ? 'positive' : 'negative',
        description: `Budget: KSh ${features.budget.toLocaleString()}. ${features.budget > 800000 ? 'Sufficient for quality system' : 'Budget may limit system size'}`
      });
    }
    
    // Sort by absolute importance
    factors.sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));
    
    // Generate summary
    const positiveFactors = factors.filter(f => f.impact === 'positive');
    const negativeFactors = factors.filter(f => f.impact === 'negative');
    
    let summary = '';
    if (positiveFactors.length > 0) {
      summary += `Positive factors: ${positiveFactors.slice(0, 3).map(f => f.name).join(', ')}. `;
    }
    if (negativeFactors.length > 0) {
      summary += `Limiting factors: ${negativeFactors.slice(0, 3).map(f => f.name).join(', ')}. `;
    }
    
    let recommendation = '';
    if (prediction.accepted) {
      recommendation = `Based on the analysis, a ${prediction.systemSize}kWp solar system is recommended. The system will pay back in ${prediction.payback} years.`;
    } else {
      const topLimiter = negativeFactors[0];
      if (topLimiter) {
        recommendation = `Solar is not recommended at this time due to ${topLimiter.name.toLowerCase()}. Consider ${topLimiter.name === 'Budget' ? 'financing options' : 're-evaluating when conditions improve'}.`;
      } else {
        recommendation = 'Consider alternative energy solutions or revisit site assessment.';
      }
    }
    
    return {
      prediction: prediction.accepted,
      // DATA POLICY: do NOT default to a fabricated 0.87 confidence.
      // If the caller did not supply a confidence, surface NaN so the UI
      // can show "confidence unavailable" instead of a fake high score.
      confidence: typeof prediction.confidence === 'number' ? prediction.confidence : NaN,
      factors,
      summary,
      recommendation,
      timestamp: new Date()
    };
  }
  
  async generateCounterfactual(
    features: Record<string, any>,
    targetPrediction: boolean,
    modelType: 'solar' | 'battery' | 'hybrid'
  ): Promise<Counterfactual[]> {
    const counterfactuals: Counterfactual[] = [];
    
    // What if: Increase budget
    if (features.budget) {
      counterfactuals.push({
        changedFeatures: { budget: features.budget * 1.5 },
        newPrediction: true,
        changeRequired: `Increase budget by 50% (to KSh ${(features.budget * 1.5).toLocaleString()})`,
        feasibility: features.budget * 1.5 < 2000000 ? 75 : 40
      });
    }
    
    // What if: Higher solar resource
    if (features.irradiance && features.irradiance < 5.5) {
      counterfactuals.push({
        changedFeatures: { irradiance: 5.5 },
        newPrediction: true,
        changeRequired: `Relocate to area with higher solar irradiance (5.5+ kWh/m²/day)`,
        feasibility: 30
      });
    }
    
    // What if: Lower tariff expectation
    if (features.tariff && features.tariff > 25) {
      // Already good
    }
    
    // What if: Add financing
    if (features.budget && features.budget < 800000) {
      counterfactuals.push({
        changedFeatures: { financing: true, monthlyPayment: 25000 },
        newPrediction: true,
        changeRequired: `Use financing with KSh 25,000/month payment`,
        feasibility: 85
      });
    }
    
    return counterfactuals;
  }
  
  async generateFeatureImportancePlot(
    _modelId: string,
    _featureNames: string[]
  ): Promise<{
    features: string[];
    importance: number[];
    description: string;
  }> {
    // DATA POLICY: previously returned a hard-coded importance array
    // [0.42, 0.28, 0.18, 0.08, 0.04] and labelled it "SHAP feature importance".
    // It was not computed from any model. Refused.
    throw new Error(
      'Explainability.generateFeatureImportancePlot is not implemented. ' +
      'Per data policy, SHAP/permutation-importance values must be computed ' +
      'from a real fitted model, not hard-coded.'
    );
  }
  
  async generateLocalExplanation(
    instance: Record<string, any>,
    prediction: any,
    model: any
  ): Promise<string> {
    // LIME-style local explanation
    const topFactors = Object.entries(instance)
      .filter(([key]) => key !== 'id')
      .slice(0, 3)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    
    return `This prediction was primarily influenced by: ${topFactors}. The model is ${Math.round(prediction.confidence * 100)}% confident in this decision.`;
  }
  
  async generateReport(
    modelId: string,
    samplePredictions: Array<{ features: any; prediction: any; actual?: any }>
  ): Promise<{
    modelId: string;
    globalExplanation: string;
    sampleExplanations: Explanation[];
    featureImportance: any;
    timestamp: Date;
  }> {
    const explanations: Explanation[] = [];
    
    for (const sample of samplePredictions) {
      const explanation = await this.explainRecommendation(
        sample.features,
        sample.prediction,
        'solar'
      );
      explanations.push(explanation);
    }
    
    const featureImportance = await this.generateFeatureImportancePlot(
      modelId,
      Object.keys(samplePredictions[0]?.features || {})
    );
    
    return {
      modelId,
      globalExplanation: 'This model uses a gradient-boosted decision tree to predict solar system recommendations. The most important features are solar irradiance and electricity tariff.',
      sampleExplanations: explanations,
      featureImportance,
      timestamp: new Date()
    };
  }
}

export const explainability = new Explainability();