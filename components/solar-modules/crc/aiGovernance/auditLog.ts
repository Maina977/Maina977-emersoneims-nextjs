// AI DECISION AUDIT LOG
// Complete traceability of all AI decisions

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  tenantId: string;
  action: string;
  entityType: 'design' | 'quote' | 'report' | 'prediction' | 'recommendation';
  entityId: string;
  input: any;
  output: any;
  modelId: string;
  modelVersion: string;
  confidence: number;
  latency: number;
  explanation?: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  tenantId?: string;
  entityType?: string;
  modelId?: string;
  limit?: number;
  offset?: number;
}

class AuditLog {
  private entries: AuditEntry[] = [];
  private maxEntries: number = 100000; // Keep last 100k entries in memory
  
  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<AuditEntry> {
    const fullEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`,
      timestamp: new Date()
    };
    
    this.entries.push(fullEntry);
    
    // Trim if needed
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
    
    // Also write to persistent storage
    await this.persist(fullEntry);
    
    return fullEntry;
  }
  
  async query(query: AuditQuery): Promise<AuditEntry[]> {
    let results = [...this.entries];
    
    if (query.startDate) {
      results = results.filter(e => e.timestamp >= query.startDate!);
    }
    if (query.endDate) {
      results = results.filter(e => e.timestamp <= query.endDate!);
    }
    if (query.userId) {
      results = results.filter(e => e.userId === query.userId);
    }
    if (query.tenantId) {
      results = results.filter(e => e.tenantId === query.tenantId);
    }
    if (query.entityType) {
      results = results.filter(e => e.entityType === query.entityType);
    }
    if (query.modelId) {
      results = results.filter(e => e.modelId === query.modelId);
    }
    
    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return results.slice(offset, offset + limit);
  }
  
  async getByEntity(entityType: string, entityId: string): Promise<AuditEntry[]> {
    return this.entries.filter(e => e.entityType === entityType && e.entityId === entityId);
  }
  
  async getByModel(modelId: string, hours: number = 24): Promise<AuditEntry[]> {
    const cutoff = new Date(Date.now() - hours * 3600000);
    return this.entries.filter(e => e.modelId === modelId && e.timestamp > cutoff);
  }
  
  async getStatistics(tenantId: string, hours: number = 24): Promise<{
    totalPredictions: number;
    averageConfidence: number;
    averageLatency: number;
    topModels: Array<{ modelId: string; count: number }>;
    topActions: Array<{ action: string; count: number }>;
  }> {
    const cutoff = new Date(Date.now() - hours * 3600000);
    const relevant = this.entries.filter(e => e.tenantId === tenantId && e.timestamp > cutoff);
    
    const totalPredictions = relevant.length;
    const averageConfidence = relevant.reduce((sum, e) => sum + e.confidence, 0) / totalPredictions;
    const averageLatency = relevant.reduce((sum, e) => sum + e.latency, 0) / totalPredictions;
    
    // Count by model
    const modelCounts: Record<string, number> = {};
    for (const e of relevant) {
      modelCounts[e.modelId] = (modelCounts[e.modelId] || 0) + 1;
    }
    const topModels = Object.entries(modelCounts)
      .map(([modelId, count]) => ({ modelId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Count by action
    const actionCounts: Record<string, number> = {};
    for (const e of relevant) {
      actionCounts[e.action] = (actionCounts[e.action] || 0) + 1;
    }
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalPredictions,
      averageConfidence,
      averageLatency,
      topModels,
      topActions
    };
  }
  
  async exportForCompliance(tenantId: string, startDate: Date, endDate: Date): Promise<string> {
    const entries = await this.query({ tenantId, startDate, endDate, limit: 10000 });
    return JSON.stringify(entries, null, 2);
  }
  
  private async persist(entry: AuditEntry): Promise<void> {
    // In production, write to database or log file
    console.log(`[AUDIT] ${entry.timestamp.toISOString()} | ${entry.userId} | ${entry.action} | ${entry.entityType}:${entry.entityId}`);
  }
}

export const auditLog = new AuditLog();