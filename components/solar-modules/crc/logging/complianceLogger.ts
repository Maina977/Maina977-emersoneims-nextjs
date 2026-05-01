// COMPLIANCE LOGGING
// Tracks regulatory compliance events

export interface ComplianceEvent {
  id: string;
  tenantId: string;
  regulation: string;
  eventType: 'audit' | 'consent' | 'breach' | 'report' | 'certification';
  status: 'passed' | 'failed' | 'pending' | 'review';
  details: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export interface ComplianceReport {
  period: { start: Date; end: Date };
  regulations: string[];
  events: ComplianceEvent[];
  summary: Record<string, { passed: number; failed: number; pending: number }>;
}

class ComplianceLogger {
  private events: ComplianceEvent[] = [];
  private maxEvents: number = 50000;
  
  async log(event: Omit<ComplianceEvent, 'id' | 'timestamp'>): Promise<ComplianceEvent> {
    const complianceEvent: ComplianceEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.events.push(complianceEvent);
    
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    return complianceEvent;
  }
  
  async logAudit(tenantId: string, regulation: string, details: Record<string, any>, userId?: string): Promise<ComplianceEvent> {
    return this.log({
      tenantId,
      regulation,
      eventType: 'audit',
      status: 'passed',
      details,
      userId
    });
  }
  
  async logConsent(tenantId: string, userId: string, consentType: string, granted: boolean): Promise<ComplianceEvent> {
    return this.log({
      tenantId,
      regulation: 'GDPR',
      eventType: 'consent',
      status: granted ? 'passed' : 'failed',
      details: { consentType, granted, timestamp: new Date() },
      userId
    });
  }
  
  async logBreach(tenantId: string, regulation: string, details: Record<string, any>, userId?: string): Promise<ComplianceEvent> {
    return this.log({
      tenantId,
      regulation,
      eventType: 'breach',
      status: 'failed',
      details,
      userId
    });
  }
  
  async getEvents(options?: {
    tenantId?: string;
    regulation?: string;
    eventType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ComplianceEvent[]> {
    let results = [...this.events];
    
    if (options?.tenantId) {
      results = results.filter(e => e.tenantId === options.tenantId);
    }
    if (options?.regulation) {
      results = results.filter(e => e.regulation === options.regulation);
    }
    if (options?.eventType) {
      results = results.filter(e => e.eventType === options.eventType);
    }
    if (options?.status) {
      results = results.filter(e => e.status === options.status);
    }
    if (options?.startDate) {
      results = results.filter(e => e.timestamp >= options.startDate!);
    }
    if (options?.endDate) {
      results = results.filter(e => e.timestamp <= options.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const limit = options?.limit || 1000;
    return results.slice(0, limit);
  }
  
  async getComplianceReport(tenantId: string, startDate: Date, endDate: Date): Promise<ComplianceReport> {
    const events = await this.getEvents({ tenantId, startDate, endDate });
    const regulations = [...new Set(events.map(e => e.regulation))];
    
    const summary: Record<string, { passed: number; failed: number; pending: number }> = {};
    
    for (const regulation of regulations) {
      const regEvents = events.filter(e => e.regulation === regulation);
      summary[regulation] = {
        passed: regEvents.filter(e => e.status === 'passed').length,
        failed: regEvents.filter(e => e.status === 'failed').length,
        pending: regEvents.filter(e => e.status === 'pending').length
      };
    }
    
    return {
      period: { start: startDate, end: endDate },
      regulations,
      events,
      summary
    };
  }
  
  async getComplianceScore(tenantId: string, regulation: string): Promise<number> {
    const events = await this.getEvents({ tenantId, regulation });
    const passed = events.filter(e => e.status === 'passed').length;
    const total = events.length;
    
    return total > 0 ? (passed / total) * 100 : 100;
  }
  
  async exportReport(tenantId: string, startDate: Date, endDate: Date): Promise<string> {
    const report = await this.getComplianceReport(tenantId, startDate, endDate);
    return JSON.stringify(report, null, 2);
  }
  
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const complianceLogger = new ComplianceLogger();