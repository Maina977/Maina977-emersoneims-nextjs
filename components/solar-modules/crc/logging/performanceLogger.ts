// PERFORMANCE LOGGING
// Tracks system performance metrics

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  timestamp: Date;
}

export interface PerformanceSpan {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  parentId?: string;
  metadata: Record<string, any>;
}

class PerformanceLogger {
  private metrics: PerformanceMetric[] = [];
  private spans: Map<string, PerformanceSpan> = new Map();
  private maxMetrics: number = 10000;
  
  async recordMetric(name: string, value: number, unit: string = 'ms', tags?: Record<string, string>): Promise<PerformanceMetric> {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      name,
      value,
      unit,
      tags: tags || {},
      timestamp: new Date()
    };
    
    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    return metric;
  }
  
  startSpan(name: string, parentId?: string, metadata?: Record<string, any>): string {
    const spanId = this.generateId();
    const span: PerformanceSpan = {
      id: spanId,
      name,
      startTime: new Date(),
      parentId,
      metadata: metadata || {}
    };
    
    this.spans.set(spanId, span);
    return spanId;
  }
  
  endSpan(spanId: string, metadata?: Record<string, any>): PerformanceSpan | null {
    const span = this.spans.get(spanId);
    if (!span) return null;
    
    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();
    if (metadata) {
      span.metadata = { ...span.metadata, ...metadata };
    }
    
    this.spans.set(spanId, span);
    
    // Record as metric
    this.recordMetric(span.name, span.duration, 'ms', { spanId });
    
    return span;
  }
  
  async measure<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const spanId = this.startSpan(name, undefined, metadata);
    try {
      const result = await fn();
      this.endSpan(spanId, { success: true });
      return result;
    } catch (error) {
      this.endSpan(spanId, { success: false, error: error.message });
      throw error;
    }
  }
  
  async measureSync<T>(name: string, fn: () => T, metadata?: Record<string, any>): Promise<T> {
    const spanId = this.startSpan(name, undefined, metadata);
    try {
      const result = fn();
      this.endSpan(spanId, { success: true });
      return result;
    } catch (error) {
      this.endSpan(spanId, { success: false, error: error.message });
      throw error;
    }
  }
  
  async getMetrics(options?: {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<PerformanceMetric[]> {
    let results = [...this.metrics];
    
    if (options?.name) {
      results = results.filter(m => m.name === options.name);
    }
    if (options?.startDate) {
      results = results.filter(m => m.timestamp >= options.startDate!);
    }
    if (options?.endDate) {
      results = results.filter(m => m.timestamp <= options.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const limit = options?.limit || 1000;
    return results.slice(0, limit);
  }
  
  async getMetricStats(name: string, hours: number = 24): Promise<{
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p90: number;
    p99: number;
  }> {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    const metrics = await this.getMetrics({ name, startDate });
    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    
    if (values.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, p50: 0, p90: 0, p99: 0 };
    }
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = values[0];
    const max = values[values.length - 1];
    const p50 = values[Math.floor(values.length * 0.5)];
    const p90 = values[Math.floor(values.length * 0.9)];
    const p99 = values[Math.floor(values.length * 0.99)];
    
    return {
      count: values.length,
      avg,
      min,
      max,
      p50,
      p90,
      p99
    };
  }
  
  async getSpanTree(spanId: string): Promise<PerformanceSpan[]> {
    const result: PerformanceSpan[] = [];
    const span = this.spans.get(spanId);
    if (!span) return result;
    
    result.push(span);
    
    for (const [id, child] of this.spans) {
      if (child.parentId === spanId) {
        result.push(...await this.getSpanTree(id));
      }
    }
    
    return result;
  }
  
  async getSlowestSpans(limit: number = 10): Promise<PerformanceSpan[]> {
    const spans = Array.from(this.spans.values())
      .filter(s => s.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0));
    
    return spans.slice(0, limit);
  }
  
  async clearOldMetrics(daysToKeep: number = 30): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    const initialCount = this.metrics.length;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    
    return initialCount - this.metrics.length;
  }
  
  private generateId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const performanceLogger = new PerformanceLogger();