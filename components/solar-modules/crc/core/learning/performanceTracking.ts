// CORE LEARNING - PERFORMANCE TRACKING
// Tracks model performance over time

export interface PerformanceRecord {
  id: string;
  modelId: string;
  modelVersion: string;
  timestamp: Date;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    latency: number;
    throughput: number;
  };
  predictions: {
    total: number;
    correct: number;
    incorrect: number;
  };
  environment: {
    cpuUsage: number;
    memoryUsage: number;
    requestRate: number;
  };
}

export interface PerformanceTrend {
  modelId: string;
  period: { start: Date; end: Date };
  metrics: Array<{
    name: string;
    values: number[];
    timestamps: Date[];
    trend: 'improving' | 'declining' | 'stable';
    slope: number;
  }>;
  alert: PerformanceAlert | null;
}

export interface PerformanceAlert {
  type: 'degradation' | 'anomaly' | 'threshold';
  metric: string;
  threshold: number;
  actualValue: number;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
}

class PerformanceTracking {
  private records: PerformanceRecord[] = [];
  private maxRecords: number = 100000;
  private alertThresholds = {
    accuracy: { warning: 0.05, critical: 0.1 },
    latency: { warning: 100, critical: 200 },
    errorRate: { warning: 0.05, critical: 0.1 }
  };
  
  async recordPerformance(record: Omit<PerformanceRecord, 'id'>): Promise<PerformanceRecord> {
    const newRecord: PerformanceRecord = {
      ...record,
      id: this.generateId()
    };
    
    this.records.push(newRecord);
    
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
    
    // Check for alerts
    const alert = await this.checkForAlerts(newRecord);
    if (alert) {
      await this.triggerAlert(alert);
    }
    
    return newRecord;
  }
  
  async getPerformance(modelId: string, hours: number = 24): Promise<PerformanceRecord[]> {
    const cutoff = new Date(Date.now() - hours * 3600000);
    return this.records
      .filter(r => r.modelId === modelId && r.timestamp > cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async getLatestPerformance(modelId: string): Promise<PerformanceRecord | null> {
    const records = await this.getPerformance(modelId, 24 * 30);
    return records.length > 0 ? records[records.length - 1] : null;
  }
  
  async getPerformanceTrend(modelId: string, days: number = 7): Promise<PerformanceTrend> {
    const records = await this.getPerformance(modelId, days * 24);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const metrics = ['accuracy', 'precision', 'recall', 'f1', 'latency'];
    const metricTrends = [];
    
    for (const metricName of metrics) {
      const values = records.map(r => r.metrics[metricName as keyof typeof r.metrics] as number);
      const timestamps = records.map(r => r.timestamp);
      
      // Calculate trend
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      let slope = 0;
      
      if (values.length >= 2) {
        const xMean = (values.length - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / values.length;
        
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < values.length; i++) {
          numerator += (i - xMean) * (values[i] - yMean);
          denominator += Math.pow(i - xMean, 2);
        }
        slope = numerator / denominator;
        
        if (Math.abs(slope) > 0.01) {
          const isImproving = (metricName !== 'latency' && slope > 0) || (metricName === 'latency' && slope < 0);
          trend = isImproving ? 'improving' : 'declining';
        }
      }
      
      metricTrends.push({
        name: metricName,
        values,
        timestamps,
        trend,
        slope
      });
    }
    
    // Check for alerts
    const alert = await this.detectAnomalies(records);
    
    return {
      modelId,
      period: { start: startDate, end: endDate },
      metrics: metricTrends,
      alert
    };
  }
  
  async getAggregatedStats(modelId: string, hours: number = 24): Promise<{
    averageMetrics: PerformanceRecord['metrics'];
    percentiles: {
      latency: { p50: number; p90: number; p99: number };
    };
    stabilityScore: number;
  }> {
    const records = await this.getPerformance(modelId, hours);
    
    if (records.length === 0) {
      return {
        averageMetrics: { accuracy: 0, precision: 0, recall: 0, f1: 0, latency: 0, throughput: 0 },
        percentiles: { latency: { p50: 0, p90: 0, p99: 0 } },
        stabilityScore: 0
      };
    }
    
    const sumMetrics = records.reduce((acc, r) => ({
      accuracy: acc.accuracy + r.metrics.accuracy,
      precision: acc.precision + r.metrics.precision,
      recall: acc.recall + r.metrics.recall,
      f1: acc.f1 + r.metrics.f1,
      latency: acc.latency + r.metrics.latency,
      throughput: acc.throughput + r.metrics.throughput
    }), { accuracy: 0, precision: 0, recall: 0, f1: 0, latency: 0, throughput: 0 });
    
    const latencies = records.map(r => r.metrics.latency).sort((a, b) => a - b);
    
    // Calculate stability (inverse of variance)
    const accuracyValues = records.map(r => r.metrics.accuracy);
    const meanAccuracy = sumMetrics.accuracy / records.length;
    const variance = accuracyValues.reduce((sum, v) => sum + Math.pow(v - meanAccuracy, 2), 0) / records.length;
    const stabilityScore = Math.max(0, 1 - Math.sqrt(variance));
    
    return {
      averageMetrics: {
        accuracy: sumMetrics.accuracy / records.length,
        precision: sumMetrics.precision / records.length,
        recall: sumMetrics.recall / records.length,
        f1: sumMetrics.f1 / records.length,
        latency: sumMetrics.latency / records.length,
        throughput: sumMetrics.throughput / records.length
      },
      percentiles: {
        latency: {
          p50: latencies[Math.floor(latencies.length * 0.5)],
          p90: latencies[Math.floor(latencies.length * 0.9)],
          p99: latencies[Math.floor(latencies.length * 0.99)]
        }
      },
      stabilityScore
    };
  }
  
  async compareVersions(modelId: string, versionA: string, versionB: string): Promise<{
    versionA: PerformanceRecord['metrics'];
    versionB: PerformanceRecord['metrics'];
    differences: Record<string, number>;
    recommendation: string;
  }> {
    const recordsA = this.records.filter(r => r.modelId === modelId && r.modelVersion === versionA);
    const recordsB = this.records.filter(r => r.modelId === modelId && r.modelVersion === versionB);
    
    const avgA = this.calculateAverageMetrics(recordsA);
    const avgB = this.calculateAverageMetrics(recordsB);
    
    const differences: Record<string, number> = {};
    for (const key of Object.keys(avgA)) {
      differences[key] = avgB[key as keyof typeof avgB] - avgA[key as keyof typeof avgA];
    }
    
    let recommendation = 'Versions perform similarly';
    if (differences.accuracy > 0.02) {
      recommendation = `Version ${versionB} shows significant improvement - recommended`;
    } else if (differences.accuracy < -0.02) {
      recommendation = `Version ${versionA} performs better - consider rollback`;
    }
    
    return {
      versionA: avgA,
      versionB: avgB,
      differences,
      recommendation
    };
  }
  
  async exportPerformanceReport(modelId: string, days: number = 30): Promise<string> {
    const trend = await this.getPerformanceTrend(modelId, days);
    const stats = await this.getAggregatedStats(modelId, days * 24);
    
    const report = {
      modelId,
      period: trend.period,
      summary: stats,
      trend: trend.metrics,
      alerts: trend.alert,
      generatedAt: new Date()
    };
    
    return JSON.stringify(report, null, 2);
  }
  
  private async checkForAlerts(record: PerformanceRecord): Promise<PerformanceAlert | null> {
    // Check for degradation
    const history = await this.getPerformance(record.modelId, 24);
    if (history.length >= 10) {
      const recentAvg = history.slice(-5).reduce((sum, r) => sum + r.metrics.accuracy, 0) / 5;
      const olderAvg = history.slice(0, 5).reduce((sum, r) => sum + r.metrics.accuracy, 0) / 5;
      const degradation = olderAvg - recentAvg;
      
      if (degradation > this.alertThresholds.accuracy.critical) {
        return {
          type: 'degradation',
          metric: 'accuracy',
          threshold: this.alertThresholds.accuracy.critical,
          actualValue: degradation,
          severity: 'critical',
          message: `Model accuracy degraded by ${(degradation * 100).toFixed(1)}% in last 24 hours`,
          timestamp: new Date()
        };
      }
      
      if (degradation > this.alertThresholds.accuracy.warning) {
        return {
          type: 'degradation',
          metric: 'accuracy',
          threshold: this.alertThresholds.accuracy.warning,
          actualValue: degradation,
          severity: 'warning',
          message: `Model accuracy degraded by ${(degradation * 100).toFixed(1)}% - monitor closely`,
          timestamp: new Date()
        };
      }
    }
    
    // Check latency threshold
    if (record.metrics.latency > this.alertThresholds.latency.critical) {
      return {
        type: 'threshold',
        metric: 'latency',
        threshold: this.alertThresholds.latency.critical,
        actualValue: record.metrics.latency,
        severity: 'critical',
        message: `Model latency exceeded critical threshold: ${record.metrics.latency}ms`,
        timestamp: new Date()
      };
    }
    
    return null;
  }
  
  private async detectAnomalies(records: PerformanceRecord[]): Promise<PerformanceAlert | null> {
    if (records.length < 10) return null;
    
    const latencies = records.map(r => r.metrics.latency);
    const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const stdDev = Math.sqrt(latencies.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / latencies.length);
    
    const latestLatency = latencies[latencies.length - 1];
    const zScore = Math.abs(latestLatency - mean) / stdDev;
    
    if (zScore > 3) {
      return {
        type: 'anomaly',
        metric: 'latency',
        threshold: 3,
        actualValue: zScore,
        severity: 'warning',
        message: `Anomalous latency detected (z-score: ${zScore.toFixed(2)})`,
        timestamp: new Date()
      };
    }
    
    return null;
  }
  
  private async triggerAlert(alert: PerformanceAlert): Promise<void> {
    console.log(`[PERFORMANCE ALERT] ${alert.severity}: ${alert.message}`);
    // Could send to notification system
  }
  
  private calculateAverageMetrics(records: PerformanceRecord[]): PerformanceRecord['metrics'] {
    if (records.length === 0) {
      return { accuracy: 0, precision: 0, recall: 0, f1: 0, latency: 0, throughput: 0 };
    }
    
    return {
      accuracy: records.reduce((sum, r) => sum + r.metrics.accuracy, 0) / records.length,
      precision: records.reduce((sum, r) => sum + r.metrics.precision, 0) / records.length,
      recall: records.reduce((sum, r) => sum + r.metrics.recall, 0) / records.length,
      f1: records.reduce((sum, r) => sum + r.metrics.f1, 0) / records.length,
      latency: records.reduce((sum, r) => sum + r.metrics.latency, 0) / records.length,
      throughput: records.reduce((sum, r) => sum + r.metrics.throughput, 0) / records.length
    };
  }
  
  private generateId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const performanceTracking = new PerformanceTracking();