// ERROR TRACKING AND REPORTING
// Captures and tracks application errors

export interface ErrorLog {
  id: string;
  type: string;
  message: string;
  stack?: string;
  context: Record<string, any>;// ERROR TRACKING AND REPORTING
// Captures and tracks application errors

export interface ErrorLog {
  id: string;
  type: string;
  message: string;
  stack?: string;
  context: Record<string, any>;
  userId?: string;
  tenantId?: string;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface ErrorStats {
  totalErrors: number;
  uniqueErrors: number;
  topErrors: Array<{ type: string; count: number }>;
  errorsByHour: Record<number, number>;
  resolutionRate: number;
}

class ErrorTracker {
  private errors: ErrorLog[] = [];
  private maxErrors: number = 10000;
  private errorCallbacks: Array<(error: ErrorLog) => void> = [];
  
  async track(error: Error | string, context?: Record<string, any>, userId?: string, tenantId?: string): Promise<ErrorLog> {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      type: error instanceof Error ? error.name : 'ApplicationError',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context: context || {},
      userId,
      tenantId,
      timestamp: new Date(),
      resolved: false
    };
    
    this.errors.push(errorLog);
    
    // Trim if needed
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    
    // Trigger callbacks
    for (const callback of this.errorCallbacks) {
      callback(errorLog);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${errorLog.type}: ${errorLog.message}`, errorLog.context);
    }
    
    return errorLog;
  }
  
  async resolve(errorId: string, resolution: string): Promise<boolean> {
    const error = this.errors.find(e => e.id === errorId);
    if (!error) return false;
    
    error.resolved = true;
    error.resolution = resolution;
    return true;
  }
  
  async getError(errorId: string): Promise<ErrorLog | null> {
    return this.errors.find(e => e.id === errorId) || null;
  }
  
  async getErrors(options?: {
    type?: string;
    userId?: string;
    tenantId?: string;
    resolved?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ErrorLog[]> {
    let results = [...this.errors];
    
    if (options?.type) {
      results = results.filter(e => e.type === options.type);
    }
    if (options?.userId) {
      results = results.filter(e => e.userId === options.userId);
    }
    if (options?.tenantId) {
      results = results.filter(e => e.tenantId === options.tenantId);
    }
    if (options?.resolved !== undefined) {
      results = results.filter(e => e.resolved === options.resolved);
    }
    if (options?.startDate) {
      results = results.filter(e => e.timestamp >= options.startDate!);
    }
    if (options?.endDate) {
      results = results.filter(e => e.timestamp <= options.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const limit = options?.limit || 100;
    return results.slice(0, limit);
  }
  
  async getStats(tenantId?: string, days: number = 30): Promise<ErrorStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let relevant = this.errors.filter(e => e.timestamp >= startDate);
    if (tenantId) {
      relevant = relevant.filter(e => e.tenantId === tenantId);
    }
    
    // Count by type
    const typeCounts: Record<string, number> = {};
    for (const error of relevant) {
      typeCounts[error.type] = (typeCounts[error.type] || 0) + 1;
    }
    
    const topErrors = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Errors by hour
    const errorsByHour: Record<number, number> = {};
    for (let i = 0; i < 24; i++) errorsByHour[i] = 0;
    for (const error of relevant) {
      const hour = error.timestamp.getHours();
      errorsByHour[hour]++;
    }
    
    const resolved = relevant.filter(e => e.resolved).length;
    const resolutionRate = relevant.length > 0 ? resolved / relevant.length : 0;
    
    return {
      totalErrors: relevant.length,
      uniqueErrors: Object.keys(typeCounts).length,
      topErrors,
      errorsByHour,
      resolutionRate
    };
  }
  
  async clearResolved(): Promise<number> {
    const initialCount = this.errors.length;
    this.errors = this.errors.filter(e => !e.resolved);
    return initialCount - this.errors.length;
  }
  
  async clearOldErrors(daysToKeep: number = 90): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    const initialCount = this.errors.length;
    this.errors = this.errors.filter(e => e.timestamp > cutoff);
    return initialCount - this.errors.length;
  }
  
  onError(callback: (error: ErrorLog) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index !== -1) this.errorCallbacks.splice(index, 1);
    };
  }
  
  async wrap<T>(fn: () => Promise<T>, context?: Record<string, any>, userId?: string, tenantId?: string): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      await this.track(error as Error, context, userId, tenantId);
      throw error;
    }
  }
  
  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const errorTracker = new ErrorTracker();