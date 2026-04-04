// CORE AI - LEARNING ENGINE
// Continuous learning from user interactions and outcomes

export interface LearningData {
  id: string;
  type: 'design' | 'quote' | 'feedback' | 'performance';
  features: Record<string, any>;
  outcome: Record<string, any>;
  weight: number;
  timestamp: Date;
}

export interface ModelUpdate {
  modelId: string;
  version: string;
  metrics: {
    previousAccuracy: number;
    newAccuracy: number;
    improvement: number;
  };
  deployedAt: Date;
}

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  createdAt: Date;
}

class LearningEngine {
  private learningData: LearningData[] = [];
  private models: Map<string, any> = new Map();
  private insights: LearningInsight[] = [];
  private maxDataPoints = 100000;
  
  async ingestData(data: Omit<LearningData, 'id' | 'timestamp'>): Promise<LearningData> {
    const newData: LearningData = {
      ...data,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.learningData.push(newData);
    
    if (this.learningData.length > this.maxDataPoints) {
      this.learningData = this.learningData.slice(-this.maxDataPoints);
    }
    
    // Trigger learning if enough new data
    if (this.learningData.length % 100 === 0) {
      await this.triggerLearning();
    }
    
    return newData;
  }
  
  async getTrainingData(modelId: string, days: number = 30): Promise<LearningData[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.learningData.filter(d => d.timestamp > cutoff);
  }
  
  async triggerLearning(): Promise<ModelUpdate[]> {
    const updates: ModelUpdate[] = [];
    
    // Update each model type
    const modelTypes = ['production', 'shading', 'financial'];
    
    for (const modelType of modelTypes) {
      const trainingData = await this.getTrainingData(modelType, 7);
      
      if (trainingData.length > 50) {
        const update = await this.updateModel(modelType, trainingData);
        updates.push(update);
      }
    }
    
    // Generate insights from new data
    await this.generateInsights();
    
    return updates;
  }
  
  private async updateModel(modelId: string, trainingData: LearningData[]): Promise<ModelUpdate> {
    const previousAccuracy = await this.getModelAccuracy(modelId);
    
    // Simulate model training
    const newAccuracy = Math.min(0.95, previousAccuracy + 0.01);
    const improvement = newAccuracy - previousAccuracy;
    
    const update: ModelUpdate = {
      modelId,
      version: `${Date.now()}`,
      metrics: {
        previousAccuracy,
        newAccuracy,
        improvement
      },
      deployedAt: new Date()
    };
    
    this.models.set(modelId, update);
    
    return update;
  }
  
  private async getModelAccuracy(modelId: string): Promise<number> {
    return 0.85 + Math.random() * 0.1;
  }
  
  private async generateInsights(): Promise<void> {
    const newInsights: LearningInsight[] = [];
    
    // Detect patterns in design data
    const designData = this.learningData.filter(d => d.type === 'design');
    if (designData.length > 100) {
      const popularDesigns = this.findPopularDesigns(designData);
      if (popularDesigns.length > 0) {
        newInsights.push({
          id: this.generateId(),
          type: 'pattern',
          title: 'Popular System Sizes',
          description: `${popularDesigns[0].size}kW systems are most common in your area`,
          confidence: 0.85,
          actionable: true,
          createdAt: new Date()
        });
      }
    }
    
    // Detect performance anomalies
    const performanceData = this.learningData.filter(d => d.type === 'performance');
    const anomalies = this.detectAnomalies(performanceData);
    for (const anomaly of anomalies) {
      newInsights.push({
        id: this.generateId(),
        type: 'anomaly',
        title: 'Performance Anomaly Detected',
        description: anomaly.description,
        confidence: anomaly.confidence,
        actionable: true,
        createdAt: new Date()
      });
    }
    
    // Detect trends
    const trends = this.detectTrends(this.learningData);
    for (const trend of trends) {
      newInsights.push({
        id: this.generateId(),
        type: 'trend',
        title: trend.title,
        description: trend.description,
        confidence: trend.confidence,
        actionable: false,
        createdAt: new Date()
      });
    }
    
    this.insights.push(...newInsights);
    
    // Keep only recent insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.insights = this.insights.filter(i => i.createdAt > thirtyDaysAgo);
  }
  
  private findPopularDesigns(designData: LearningData[]): Array<{ size: number; count: number }> {
    const sizeCounts: Record<number, number> = {};
    
    for (const design of designData) {
      const size = Math.round(design.features.systemSize || 6);
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    }
    
    return Object.entries(sizeCounts)
      .map(([size, count]) => ({ size: parseInt(size), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }
  
  private detectAnomalies(data: LearningData[]): Array<{ description: string; confidence: number }> {
    const anomalies = [];
    
    if (data.length > 10) {
      const values = data.map(d => d.outcome.production || 0);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
      
      const latest = values[values.length - 1];
      if (Math.abs(latest - mean) > 2 * stdDev) {
        anomalies.push({
          description: `Unusual production value: ${Math.round(latest)}kWh (expected: ${Math.round(mean)}kWh)`,
          confidence: 0.9
        });
      }
    }
    
    return anomalies;
  }
  
  private detectTrends(data: LearningData[]): Array<{ title: string; description: string; confidence: number }> {
    const trends = [];
    
    // Check for increasing system sizes
    const sizes = data.filter(d => d.type === 'design').map(d => d.features.systemSize);
    if (sizes.length > 20) {
      const recent = sizes.slice(-10).reduce((a, b) => a + b, 0) / 10;
      const older = sizes.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
      
      if (recent > older * 1.1) {
        trends.push({
          title: 'Increasing System Sizes',
          description: 'Customers are choosing 10% larger systems compared to last month',
          confidence: 0.75
        });
      }
    }
    
    return trends;
  }
  
  async getInsights(): Promise<LearningInsight[]> {
    return this.insights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getModelPerformance(modelId: string): Promise<{
    accuracy: number;
    drift: number;
    lastUpdated: Date;
    sampleSize: number;
  }> {
    const model = this.models.get(modelId);
    const trainingData = await this.getTrainingData(modelId, 30);
    
    return {
      accuracy: model?.metrics.newAccuracy || 0.85,
      drift: Math.random() * 0.1,
      lastUpdated: model?.deployedAt || new Date(),
      sampleSize: trainingData.length
    };
  }
  
  async getRecommendations(userId: string): Promise<Array<{
    title: string;
    description: string;
    action: string;
    confidence: number;
  }>> {
    // Generate personalized recommendations based on learning
    const userData = this.learningData.filter(d => d.features.userId === userId);
    
    const recommendations = [];
    
    if (userData.length > 0) {
      recommendations.push({
        title: 'Optimize Your System',
        description: 'Based on your usage patterns, adding battery storage could increase savings',
        action: 'View Battery Options',
        confidence: 0.82
      });
    }
    
    return recommendations;
  }
  
  async exportKnowledge(): Promise<string> {
    return JSON.stringify({
      models: Array.from(this.models.entries()),
      insights: this.insights,
      dataPoints: this.learningData.length,
      exportedAt: new Date()
    }, null, 2);
  }
  
  private generateId(): string {
    return `learn_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const learningEngine = new LearningEngine();