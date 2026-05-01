// SMART ALERTS SYSTEM
// Proactive alerts based on system monitoring

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  category: 'performance' | 'maintenance' | 'safety' | 'financial' | 'weather';
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: Date;
  actions: AlertAction[];
  metadata: Record<string, any>;
}

export interface AlertAction {
  label: string;
  action: string;
  params: Record<string, any>;
}

class SmartAlerts {
  private alerts: SmartAlert[] = [];
  private maxAlerts: number = 5000;
  private subscribers: Array<(alert: SmartAlert) => void> = [];
  
  async create(alert: Omit<SmartAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>): Promise<SmartAlert> {
    const newAlert: SmartAlert = {
      ...alert,
      id: this.generateId(),
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      actions: alert.actions || []
    };
    
    this.alerts.push(newAlert);
    
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }
    
    // Notify subscribers
    for (const subscriber of this.subscribers) {
      subscriber(newAlert);
    }
    
    return newAlert;
  }
  
  async acknowledge(alertId: string, userId: string): Promise<boolean> {
    const alert = await this.getAlert(alertId);
    if (!alert) return false;
    
    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) this.alerts[index] = alert;
    
    return true;
  }
  
  async resolve(alertId: string): Promise<boolean> {
    const alert = await this.getAlert(alertId);
    if (!alert) return false;
    
    alert.resolved = true;
    alert.resolvedAt = new Date();
    
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) this.alerts[index] = alert;
    
    return true;
  }
  
  async getAlert(id: string): Promise<SmartAlert | null> {
    return this.alerts.find(a => a.id === id) || null;
  }
  
  async getAlerts(options?: {
    severity?: string;
    category?: string;
    acknowledged?: boolean;
    resolved?: boolean;
    limit?: number;
  }): Promise<SmartAlert[]> {
    let results = [...this.alerts];
    
    if (options?.severity) {
      results = results.filter(a => a.severity === options.severity);
    }
    if (options?.category) {
      results = results.filter(a => a.category === options.category);
    }
    if (options?.acknowledged !== undefined) {
      results = results.filter(a => a.acknowledged === options.acknowledged);
    }
    if (options?.resolved !== undefined) {
      results = results.filter(a => a.resolved === options.resolved);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const limit = options?.limit || 100;
    return results.slice(0, limit);
  }
  
  async getUnresolvedAlerts(): Promise<SmartAlert[]> {
    return this.getAlerts({ resolved: false });
  }
  
  async getUnacknowledgedAlerts(): Promise<SmartAlert[]> {
    return this.getAlerts({ acknowledged: false, resolved: false });
  }
  
  async getCriticalAlerts(): Promise<SmartAlert[]> {
    return this.getAlerts({ severity: 'critical', resolved: false });
  }
  
  subscribe(callback: (alert: SmartAlert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) this.subscribers.splice(index, 1);
    };
  }
  
  // Production alerts
  async alertLowProduction(deviceId: string, expectedKwh: number, actualKwh: number): Promise<SmartAlert> {
    const dropPercent = ((expectedKwh - actualKwh) / expectedKwh) * 100;
    const severity = dropPercent > 30 ? 'critical' : dropPercent > 15 ? 'warning' : 'info';
    
    return this.create({
      title: 'Low Production Detected',
      description: `Solar production is ${dropPercent.toFixed(1)}% below expected`,
      severity,
      category: 'performance',
      source: deviceId,
      actions: [
        { label: 'View Details', action: 'view_production', params: { deviceId } },
        { label: 'Schedule Maintenance', action: 'schedule_maintenance', params: { deviceId } }
      ],
      metadata: { expectedKwh, actualKwh, dropPercent }
    });
  }
  
  async alertInverterFault(deviceId: string, errorCode: string, errorMessage: string): Promise<SmartAlert> {
    return this.create({
      title: `Inverter Error: ${errorCode}`,
      description: errorMessage,
      severity: 'critical',
      category: 'maintenance',
      source: deviceId,
      actions: [
        { label: 'View Error Details', action: 'view_error', params: { deviceId, errorCode } },
        { label: 'Contact Support', action: 'contact_support', params: { deviceId } }
      ],
      metadata: { deviceId, errorCode, errorMessage }
    });
  }
  
  async alertBatteryDegradation(deviceId: string, currentSoh: number, expectedSoh: number): Promise<SmartAlert> {
    const degradation = expectedSoh - currentSoh;
    
    return this.create({
      title: 'Battery Degradation Warning',
      description: `Battery health is ${degradation.toFixed(1)}% below expected`,
      severity: degradation > 10 ? 'warning' : 'info',
      category: 'maintenance',
      source: deviceId,
      actions: [
        { label: 'View Battery Health', action: 'view_battery', params: { deviceId } },
        { label: 'Schedule Battery Check', action: 'schedule_check', params: { deviceId } }
      ],
      metadata: { deviceId, currentSoh, expectedSoh, degradation }
    });
  }
  
  async alertGridOutage(region: string, estimatedDuration: number): Promise<SmartAlert> {
    return this.create({
      title: 'Grid Outage Detected',
      description: `Power outage in ${region}. Estimated duration: ${estimatedDuration} minutes`,
      severity: 'critical',
      category: 'weather',
      source: 'grid_monitor',
      actions: [
        { label: 'View Affected Areas', action: 'view_affected', params: { region } },
        { label: 'Enable Battery Backup', action: 'enable_backup', params: {} }
      ],
      metadata: { region, estimatedDuration }
    });
  }
  
  async alertHighTemperature(deviceId: string, temperature: number, threshold: number): Promise<SmartAlert> {
    const excess = temperature - threshold;
    
    return this.create({
      title: 'High Temperature Warning',
      description: `${deviceId} temperature is ${excess.toFixed(1)}°C above safe limit`,
      severity: excess > 15 ? 'critical' : excess > 8 ? 'warning' : 'info',
      category: 'safety',
      source: deviceId,
      actions: [
        { label: 'View Temperature History', action: 'view_temp', params: { deviceId } },
        { label: 'Shutdown Device', action: 'shutdown', params: { deviceId } }
      ],
      metadata: { deviceId, temperature, threshold, excess }
    });
  }
  
  async alertPaybackOptimization(tenantId: string, currentPayback: number, optimizedPayback: number): Promise<SmartAlert> {
    const improvement = currentPayback - optimizedPayback;
    
    return this.create({
      title: 'Payback Optimization Opportunity',
      description: `System payback can be reduced by ${improvement.toFixed(1)} years with upgrades`,
      severity: 'info',
      category: 'financial',
      source: 'optimization_engine',
      actions: [
        { label: 'View Optimization', action: 'view_optimization', params: { tenantId } },
        { label: 'Apply Recommendation', action: 'apply_recommendation', params: { tenantId } }
      ],
      metadata: { tenantId, currentPayback, optimizedPayback, improvement }
    });
  }
  
  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const smartAlerts = new SmartAlerts();