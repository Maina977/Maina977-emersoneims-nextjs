// COMPLETE AUDIT TRAIL
// Tracks all changes for compliance

export interface AuditEntry {
  id: string;
  userId: string;
  tenantId: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT';
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  changes?: Array<{ field: string; old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  reason?: string;
}

export interface AuditQuery {
  userId?: string;
  tenantId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

class AuditTrail {
  private entries: AuditEntry[] = [];
  private maxEntries: number = 50000;
  
  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<AuditEntry> {
    const auditEntry: AuditEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.entries.push(auditEntry);
    
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
    
    await this.persist(auditEntry);
    
    return auditEntry;
  }
  
  async logChange(
    userId: string,
    tenantId: string,
    entityType: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    reason?: string
  ): Promise<AuditEntry> {
    const changes = this.computeChanges(oldValue, newValue);
    
    return this.log({
      userId,
      tenantId,
      action: 'UPDATE',
      entityType,
      entityId,
      oldValue,
      newValue,
      changes,
      ipAddress: this.getIPAddress(),
      userAgent: this.getUserAgent(),
      reason
    });
  }
  
  async logDelete(
    userId: string,
    tenantId: string,
    entityType: string,
    entityId: string,
    deletedValue: any,
    reason?: string
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      tenantId,
      action: 'DELETE',
      entityType,
      entityId,
      oldValue: deletedValue,
      ipAddress: this.getIPAddress(),
      userAgent: this.getUserAgent(),
      reason
    });
  }
  
  async logCreate(
    userId: string,
    tenantId: string,
    entityType: string,
    entityId: string,
    newValue: any,
    reason?: string
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      tenantId,
      action: 'CREATE',
      entityType,
      entityId,
      newValue,
      ipAddress: this.getIPAddress(),
      userAgent: this.getUserAgent(),
      reason
    });
  }
  
  async logLogin(
    userId: string,
    tenantId: string,
    success: boolean,
    reason?: string
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      tenantId,
      action: success ? 'LOGIN' : 'LOGIN_FAILED',
      entityType: 'session',
      entityId: userId,
      ipAddress: this.getIPAddress(),
      userAgent: this.getUserAgent(),
      reason
    });
  }
  
  async query(query: AuditQuery): Promise<AuditEntry[]> {
    let results = [...this.entries];
    
    if (query.userId) {
      results = results.filter(e => e.userId === query.userId);
    }
    if (query.tenantId) {
      results = results.filter(e => e.tenantId === query.tenantId);
    }
    if (query.action) {
      results = results.filter(e => e.action === query.action);
    }
    if (query.entityType) {
      results = results.filter(e => e.entityType === query.entityType);
    }
    if (query.entityId) {
      results = results.filter(e => e.entityId === query.entityId);
    }
    if (query.startDate) {
      results = results.filter(e => e.timestamp >= query.startDate!);
    }
    if (query.endDate) {
      results = results.filter(e => e.timestamp <= query.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return results.slice(offset, offset + limit);
  }
  
  async getEntityHistory(entityType: string, entityId: string): Promise<AuditEntry[]> {
    return this.query({ entityType, entityId });
  }
  
  async getUserHistory(userId: string, days: number = 30): Promise<AuditEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.query({ userId, startDate });
  }
  
  async getTenantHistory(tenantId: string, days: number = 30): Promise<AuditEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.query({ tenantId, startDate });
  }
  
  async exportForCompliance(tenantId: string, startDate: Date, endDate: Date): Promise<string> {
    const entries = await this.query({ tenantId, startDate, endDate, limit: 10000 });
    return JSON.stringify(entries, null, 2);
  }
  
  async getSummary(tenantId: string, days: number = 30): Promise<{
    totalActions: number;
    actionsByType: Record<string, number>;
    uniqueUsers: number;
    topEntities: Array<{ entityType: string; count: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const relevant = this.entries.filter(e => e.tenantId === tenantId && e.timestamp >= startDate);
    
    const actionsByType: Record<string, number> = {};
    const entitiesByType: Record<string, number> = {};
    const users = new Set<string>();
    
    for (const entry of relevant) {
      actionsByType[entry.action] = (actionsByType[entry.action] || 0) + 1;
      entitiesByType[entry.entityType] = (entitiesByType[entry.entityType] || 0) + 1;
      users.add(entry.userId);
    }
    
    const topEntities = Object.entries(entitiesByType)
      .map(([entityType, count]) => ({ entityType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalActions: relevant.length,
      actionsByType,
      uniqueUsers: users.size,
      topEntities
    };
  }
  
  private computeChanges(oldValue: any, newValue: any): Array<{ field: string; old: any; new: any }> {
    const changes: Array<{ field: string; old: any; new: any }> = [];
    
    if (!oldValue || !newValue) return changes;
    
    const allKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    
    for (const key of allKeys) {
      const old = oldValue[key];
      const newVal = newValue[key];
      
      if (JSON.stringify(old) !== JSON.stringify(newVal)) {
        changes.push({ field: key, old, new: newVal });
      }
    }
    
    return changes;
  }
  
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
  
  private async persist(entry: AuditEntry): Promise<void> {
    console.log(`[AUDIT] ${entry.timestamp.toISOString()} | ${entry.userId} | ${entry.action} | ${entry.entityType}:${entry.entityId}`);
  }
  
  private getIPAddress(): string {
    return 'client-ip';
  }
  
  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'server';
  }
}

export const auditTrail = new AuditTrail();