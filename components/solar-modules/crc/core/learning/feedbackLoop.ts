// CORE LEARNING - FEEDBACK LOOP
// Continuous learning from user feedback and outcomes

export interface FeedbackEntry {
  id: string;
  predictionId: string;
  modelType: string;
  actualOutcome: any;
  predictedOutcome: any;
  error: number;
  userRating: number; // 1-5
  userComment?: string;
  context: Record<string, any>;
  timestamp: Date;
  processed: boolean;
}

export interface FeedbackStats {
  totalEntries: number;
  averageError: number;
  averageRating: number;
  byModelType: Record<string, {
    count: number;
    avgError: number;
    avgRating: number;
  }>;
  improvementTrend: number[];
}

class FeedbackLoop {
  private feedbacks: FeedbackEntry[] = [];
  private maxFeedbacks: number = 10000;
  private callbacks: Array<(feedback: FeedbackEntry) => void> = [];
  
  async recordFeedback(
    predictionId: string,
    modelType: string,
    predictedOutcome: any,
    actualOutcome: any,
    userRating: number,
    userComment?: string,
    context?: Record<string, any>
  ): Promise<FeedbackEntry> {
    const error = this.calculateError(predictedOutcome, actualOutcome);
    
    const feedback: FeedbackEntry = {
      id: this.generateId(),
      predictionId,
      modelType,
      actualOutcome,
      predictedOutcome,
      error,
      userRating,
      userComment,
      context: context || {},
      timestamp: new Date(),
      processed: false
    };
    
    this.feedbacks.push(feedback);
    
    if (this.feedbacks.length > this.maxFeedbacks) {
      this.feedbacks = this.feedbacks.slice(-this.maxFeedbacks);
    }
    
    // Notify subscribers
    for (const callback of this.callbacks) {
      callback(feedback);
    }
    
    return feedback;
  }
  
  async getFeedback(id: string): Promise<FeedbackEntry | null> {
    return this.feedbacks.find(f => f.id === id) || null;
  }
  
  async getUnprocessedFeedback(): Promise<FeedbackEntry[]> {
    return this.feedbacks.filter(f => !f.processed);
  }
  
  async markProcessed(feedbackId: string): Promise<void> {
    const feedback = await this.getFeedback(feedbackId);
    if (feedback) {
      feedback.processed = true;
    }
  }
  
  async getStats(days?: number): Promise<FeedbackStats> {
    let filtered = [...this.feedbacks];
    
    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(f => f.timestamp > cutoff);
    }
    
    const totalEntries = filtered.length;
    const averageError = filtered.reduce((sum, f) => sum + f.error, 0) / totalEntries;
    const averageRating = filtered.reduce((sum, f) => sum + f.userRating, 0) / totalEntries;
    
    const byModelType: FeedbackStats['byModelType'] = {};
    for (const feedback of filtered) {
      if (!byModelType[feedback.modelType]) {
        byModelType[feedback.modelType] = { count: 0, avgError: 0, avgRating: 0 };
      }
      const stats = byModelType[feedback.modelType];
      stats.count++;
      stats.avgError = (stats.avgError * (stats.count - 1) + feedback.error) / stats.count;
      stats.avgRating = (stats.avgRating * (stats.count - 1) + feedback.userRating) / stats.count;
    }
    
    // Calculate improvement trend (error over time)
    const sorted = [...filtered].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const windowSize = Math.max(1, Math.floor(sorted.length / 10));
    const improvementTrend = [];
    
    for (let i = 0; i < sorted.length; i += windowSize) {
      const window = sorted.slice(i, i + windowSize);
      const avgError = window.reduce((sum, f) => sum + f.error, 0) / window.length;
      improvementTrend.push(avgError);
    }
    
    return {
      totalEntries,
      averageError,
      averageRating,
      byModelType,
      improvementTrend
    };
  }
  
  async getLowRatedFeedback(threshold: number = 3): Promise<FeedbackEntry[]> {
    return this.feedbacks.filter(f => f.userRating <= threshold);
  }
  
  async getHighErrorFeedback(threshold: number = 0.3): Promise<FeedbackEntry[]> {
    return this.feedbacks.filter(f => f.error > threshold);
  }
  
  async generateImprovementReport(): Promise<{
    topIssues: Array<{ issue: string; frequency: number; impact: number }>;
    recommendations: string[];
    modelRetrainingUrgency: 'low' | 'medium' | 'high';
  }> {
    const lowRated = await this.getLowRatedFeedback(3);
    const highError = await this.getHighErrorFeedback(0.3);
    
    // Analyze common issues
    const issues: Record<string, { count: number; totalError: number }> = {};
    
    for (const feedback of [...lowRated, ...highError]) {
      const contextKeys = Object.keys(feedback.context);
      for (const key of contextKeys) {
        if (!issues[key]) {
          issues[key] = { count: 0, totalError: 0 };
        }
        issues[key].count++;
        issues[key].totalError += feedback.error;
      }
    }
    
    const topIssues = Object.entries(issues)
      .map(([issue, data]) => ({
        issue,
        frequency: data.count,
        impact: data.totalError / data.count
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
    
    const recommendations = [];
    const stats = await this.getStats();
    
    if (stats.averageRating < 4) {
      recommendations.push('Collect more training data for edge cases');
    }
    if (stats.averageError > 0.15) {
      recommendations.push('Retrain model with recent feedback data');
    }
    if (topIssues.length > 0) {
      recommendations.push(`Focus improvement on: ${topIssues[0].issue}`);
    }
    
    let modelRetrainingUrgency: 'low' | 'medium' | 'high' = 'low';
    if (stats.averageError > 0.25 || stats.averageRating < 3.5) {
      modelRetrainingUrgency = 'high';
    } else if (stats.averageError > 0.15 || stats.averageRating < 4) {
      modelRetrainingUrgency = 'medium';
    }
    
    return {
      topIssues,
      recommendations,
      modelRetrainingUrgency
    };
  }
  
  subscribe(callback: (feedback: FeedbackEntry) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) this.callbacks.splice(index, 1);
    };
  }
  
  private calculateError(predicted: any, actual: any): number {
    if (typeof predicted === 'number' && typeof actual === 'number') {
      return Math.abs(predicted - actual) / Math.max(Math.abs(actual), 1);
    }
    if (typeof predicted === 'boolean' && typeof actual === 'boolean') {
      return predicted === actual ? 0 : 1;
    }
    return 0.5;
  }
  
  private generateId(): string {
    return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const feedbackLoop = new FeedbackLoop();