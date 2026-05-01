// USER ACTIVITY LOGGING
// Tracks all user actions for audit and analytics

export interface ActivityLog {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  duration?: number;
  status: 'success' | 'failure' | 'pending';
}

class ActivityLogger {
  private logs: ActivityLog[] = [];
  private maxLogs: number = 10000;
  
  async log(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    const log: ActivityLog = {
      ...activity,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.logs.push(log);
    
    // Trim if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Also write to persistent storage
    await this.persist(log);
    
    return log;
  }
  
  async logAction(
    userId: string,
    tenantId: string,
    action: string,
    resource: string,
    details?: Record<string, any>,
    resourceId?: string
  ): Promise<ActivityLog> {
    return this.log({
      userId,
      tenantId,
      action,
      resource,
      resourceId,
      details: details || {},
      ipAddress: this.getIPAddress(),
      userAgent: this.getUserAgent(),
      status: 'success'
    });
  }
  
  async query(options: {
    userId?: string;
    tenantId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<ActivityLog[]> {
    let results = [...this.logs];
    
    if (options.userId) {
      results = results.filter(l => l.userId === options.userId);
    }
    if (options.tenantId) {
      results = results.filter(l => l.tenantId === options.tenantId);
    }
    if (options.action) {
      results = results.filter(l => l.action === options.action);
    }
    if (options.resource) {
      results = results.filter(l => l.resource === options.resource);
    }
    if (options.startDate) {
      results = results.filter(l => l.timestamp >= options.startDate!);
    }
    if (options.endDate) {
      results = results.filter(l => l.timestamp <= options.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    
    return results.slice(offset, offset + limit);
  }
  
  async getUserActivity(userId: string, days: number = 7): Promise<ActivityLog[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.query({ userId, startDate });
  }
  
  async getResourceActivity(resourceId: string): Promise<ActivityLog[]> {
    return this.logs.filter(l => l.resourceId === resourceId);
  }
  
  async getStatistics(tenantId: string, days: number = 30): Promise<{
    totalActions: number;
    uniqueUsers: number;
    topActions: Array<{ action: string; count: number }>;
    activityByHour: Record<number, number>;
    activityByDay: Record<string, number>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const relevant = this.logs.filter(l => l.tenantId === tenantId && l.timestamp >= startDate);
    
    // Count actions
    const actionCounts: Record<string, number> = {};
    for (const log of relevant) {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    }
    
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Activity by hour
    const activityByHour: Record<number, number> = {};
    for (let i = 0; i < 24; i++) activityByHour[i] = 0;
    for (const log of relevant) {
      const hour = log.timestamp.getHours();
      activityByHour[hour]++;
    }
    
    // Activity by day
    const activityByDay: Record<string, number> = {};
    for (const log of relevant) {
      const date = log.timestamp.toISOString().split('T')[0];
      activityByDay[date] = (activityByDay[date] || 0) + 1;
    }
    
    const uniqueUsers = new Set(relevant.map(l => l.userId)).size;
    
    return {
      totalActions: relevant.length,
      uniqueUsers,
      topActions,
      activityByHour,
      activityByDay
    };
  }
  
  async exportLogs(tenantId: string, startDate: Date, endDate: Date): Promise<string> {
    const logs = await this.query({ tenantId, startDate, endDate, limit: 10000 });
    return JSON.stringify(logs, null, 2);
  }
  
  async clearOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    const initialCount = this.logs.length;
    this.logs = this.logs.filter(l => l.timestamp > cutoff);
    
    return initialCount - this.logs.length;
  }
  
  private generateId(): string {
    return `act_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
  
  private async persist(log: ActivityLog): Promise<void> {
    // In production, write to database or log file
    console.log(`[ACTIVITY] ${log.timestamp.toISOString()} | ${log.userId} | ${log.action} | ${log.resource}`);
  }
  
  private getIPAddress(): string {
    // In browser context, this would come from request
    return 'client-ip';
  }
  
  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'server';
  }
}

export const activityLogger = new ActivityLogger();