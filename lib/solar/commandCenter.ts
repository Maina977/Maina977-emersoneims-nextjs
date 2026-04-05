/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - COMMAND CENTER                                          ║
 * ║   AI Advisor, Voice Assistant, Smart Alerts, Digital Twin Sync              ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface SmartAlert {
  id: string;
  type: 'performance' | 'maintenance' | 'weather' | 'financial' | 'system' | 'anomaly';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  autoResolve?: boolean;
  resolvedAt?: string;
}

export interface AIAdvisorRecommendation {
  id: string;
  category: 'optimization' | 'maintenance' | 'financial' | 'safety' | 'growth';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  impact: string;
  effort: 'minimal' | 'moderate' | 'significant';
  estimatedSavings?: number;
  estimatedCost?: number;
  steps: string[];
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
}

export interface DigitalTwinState {
  systemId: string;
  lastSync: string;
  syncStatus: 'connected' | 'disconnected' | 'syncing' | 'error';
  liveData: {
    currentPower: number; // kW
    todayEnergy: number; // kWh
    monthEnergy: number; // kWh
    lifetimeEnergy: number; // MWh
    batteryLevel?: number; // %
    gridStatus: 'connected' | 'islanded' | 'offline';
    inverterStatus: 'online' | 'standby' | 'fault' | 'offline';
  };
  environmentData: {
    irradiance: number; // W/m²
    ambientTemp: number; // °C
    panelTemp: number; // °C
    humidity: number; // %
    windSpeed: number; // m/s
  };
  performanceMetrics: {
    performanceRatio: number; // %
    specificYield: number; // kWh/kWp
    capacityFactor: number; // %
    efficiency: number; // %
  };
  alerts: SmartAlert[];
  maintenanceSchedule: MaintenanceTask[];
}

export interface MaintenanceTask {
  id: string;
  type: 'cleaning' | 'inspection' | 'repair' | 'replacement' | 'testing';
  component: string;
  description: string;
  scheduledDate: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  estimatedCost: number;
  status: 'scheduled' | 'overdue' | 'in_progress' | 'completed';
  assignee?: string;
}

export interface ExecutiveDashboard {
  kpis: {
    totalSystems: number;
    totalCapacity: number; // MW
    totalEnergy: number; // MWh
    totalSavings: number; // Currency
    activeAlerts: number;
    systemUptime: number; // %
  };
  performance: {
    currentPower: number;
    dailyEnergy: number;
    monthlyEnergy: number;
    yearlyEnergy: number;
    co2Offset: number;
  };
  financials: {
    monthlyRevenue: number;
    monthlySavings: number;
    projectedROI: number;
    paybackProgress: number;
  };
  systemHealth: Array<{
    systemId: string;
    name: string;
    status: 'optimal' | 'degraded' | 'critical' | 'offline';
    lastUpdate: string;
    performance: number;
  }>;
  recentAlerts: SmartAlert[];
  upcomingMaintenance: MaintenanceTask[];
}

// ============================================================================
// SMART ALERTS ENGINE
// ============================================================================

export class SmartAlertsEngine {
  private alerts: SmartAlert[] = [];
  private subscribers: Array<(alert: SmartAlert) => void> = [];

  createAlert(data: Omit<SmartAlert, 'id' | 'timestamp' | 'read' | 'dismissed'>): SmartAlert {
    const alert: SmartAlert = {
      ...data,
      id: `alert-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
    };

    this.alerts.unshift(alert);
    this.notifySubscribers(alert);
    return alert;
  }

  subscribe(callback: (alert: SmartAlert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(alert: SmartAlert): void {
    this.subscribers.forEach(cb => cb(alert));
  }

  getAlerts(filters?: { type?: string; severity?: string; unreadOnly?: boolean }): SmartAlert[] {
    let filtered = [...this.alerts];

    if (filters?.type) {
      filtered = filtered.filter(a => a.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(a => a.severity === filters.severity);
    }
    if (filters?.unreadOnly) {
      filtered = filtered.filter(a => !a.read);
    }

    return filtered;
  }

  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.read = true;
  }

  dismissAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.dismissed = true;
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      alert.actionRequired = false;
    }
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.read && !a.dismissed).length;
  }

  // Auto-generate alerts based on system data
  generateSmartAlerts(systemState: DigitalTwinState): SmartAlert[] {
    const generated: SmartAlert[] = [];

    // Performance alert
    if (systemState.performanceMetrics.performanceRatio < 75) {
      generated.push(this.createAlert({
        type: 'performance',
        severity: 'warning',
        title: 'Performance Below Threshold',
        message: `System performance ratio is ${systemState.performanceMetrics.performanceRatio}%, which is below the expected 80%. Consider panel cleaning or inspection.`,
        actionRequired: true,
        actionUrl: '/maintenance/schedule'
      }));
    }

    // Temperature alert
    if (systemState.environmentData.panelTemp > 70) {
      generated.push(this.createAlert({
        type: 'system',
        severity: 'warning',
        title: 'High Panel Temperature',
        message: `Panel temperature is ${systemState.environmentData.panelTemp}°C. This may cause efficiency losses. Monitor closely.`,
        actionRequired: false
      }));
    }

    // Battery alert
    if (systemState.liveData.batteryLevel !== undefined && systemState.liveData.batteryLevel < 20) {
      generated.push(this.createAlert({
        type: 'system',
        severity: 'critical',
        title: 'Low Battery Level',
        message: `Battery level is at ${systemState.liveData.batteryLevel}%. Consider reducing load or switching to grid power.`,
        actionRequired: true
      }));
    }

    // Inverter fault
    if (systemState.liveData.inverterStatus === 'fault') {
      generated.push(this.createAlert({
        type: 'anomaly',
        severity: 'emergency',
        title: 'Inverter Fault Detected',
        message: 'The inverter has reported a fault condition. Immediate attention required.',
        actionRequired: true,
        actionUrl: '/systems/troubleshoot'
      }));
    }

    // Weather alert
    if (systemState.environmentData.windSpeed > 15) {
      generated.push(this.createAlert({
        type: 'weather',
        severity: 'info',
        title: 'High Wind Speed',
        message: `Current wind speed is ${systemState.environmentData.windSpeed} m/s. Monitor panel mounting.`,
        actionRequired: false
      }));
    }

    return generated;
  }
}

// ============================================================================
// AI ADVISOR ENGINE
// ============================================================================

export class AIAdvisorEngine {
  private recommendations: AIAdvisorRecommendation[] = [];

  generateRecommendations(systemState: DigitalTwinState, analytics: any): AIAdvisorRecommendation[] {
    this.recommendations = [];

    // Maintenance recommendation
    if (systemState.performanceMetrics.performanceRatio < 85) {
      this.recommendations.push({
        id: `rec-${Date.now().toString(36)}-1`,
        category: 'maintenance',
        priority: 'high',
        title: 'Schedule Panel Cleaning',
        description: 'System performance has dropped below optimal levels. Soiling on panels is the most common cause.',
        impact: 'Potential 5-10% improvement in energy production',
        effort: 'minimal',
        estimatedSavings: systemState.liveData.monthEnergy * 0.08 * 25, // 8% improvement at KES 25/kWh
        estimatedCost: 5000,
        steps: [
          'Schedule professional cleaning service',
          'Inspect panels for damage during cleaning',
          'Check for shading from new vegetation',
          'Verify performance improvement after cleaning'
        ],
        status: 'pending'
      });
    }

    // Optimization recommendation
    if (systemState.performanceMetrics.capacityFactor < 18) {
      this.recommendations.push({
        id: `rec-${Date.now().toString(36)}-2`,
        category: 'optimization',
        priority: 'medium',
        title: 'Review Panel Orientation',
        description: 'Capacity factor is below regional average. Panel tilt or azimuth adjustment may improve yield.',
        impact: 'Could increase annual production by 3-5%',
        effort: 'moderate',
        estimatedCost: 15000,
        steps: [
          'Analyze solar path for location',
          'Calculate optimal tilt angle',
          'Assess cost vs benefit of adjustment',
          'If beneficial, schedule adjustment'
        ],
        status: 'pending'
      });
    }

    // Battery optimization
    if (systemState.liveData.batteryLevel !== undefined) {
      this.recommendations.push({
        id: `rec-${Date.now().toString(36)}-3`,
        category: 'financial',
        priority: 'medium',
        title: 'Optimize Battery Charging Schedule',
        description: 'Time-of-use arbitrage opportunity: Charge batteries during off-peak hours for maximum savings.',
        impact: 'Reduce electricity costs by 15-20%',
        effort: 'minimal',
        estimatedSavings: 3000,
        steps: [
          'Review utility time-of-use rates',
          'Configure inverter charging schedule',
          'Set peak shaving parameters',
          'Monitor savings after changes'
        ],
        status: 'pending'
      });
    }

    // Growth recommendation
    this.recommendations.push({
      id: `rec-${Date.now().toString(36)}-4`,
      category: 'growth',
      priority: 'low',
      title: 'Consider System Expansion',
      description: 'Based on consumption patterns, additional capacity could further reduce grid dependency.',
      impact: 'Achieve 90%+ self-consumption',
      effort: 'significant',
      estimatedCost: systemState.liveData.currentPower * 85000, // KES 85,000 per kW
      steps: [
        'Analyze available roof space',
        'Review current consumption patterns',
        'Design expansion with SolarGenius Pro',
        'Obtain quotes from installers'
      ],
      status: 'pending'
    });

    // Safety recommendation
    this.recommendations.push({
      id: `rec-${Date.now().toString(36)}-5`,
      category: 'safety',
      priority: 'high',
      title: 'Annual Safety Inspection Due',
      description: 'Regular safety inspections ensure system compliance and prevent hazards.',
      impact: 'Maintain insurance validity and system safety',
      effort: 'minimal',
      estimatedCost: 8000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      steps: [
        'Schedule certified inspector',
        'Prepare system documentation',
        'Ensure DC/AC isolators accessible',
        'Review and act on inspector report'
      ],
      status: 'pending'
    });

    return this.recommendations;
  }

  getRecommendations(): AIAdvisorRecommendation[] {
    return this.recommendations;
  }

  updateRecommendationStatus(id: string, status: AIAdvisorRecommendation['status']): void {
    const rec = this.recommendations.find(r => r.id === id);
    if (rec) rec.status = status;
  }
}

// ============================================================================
// DIGITAL TWIN ENGINE
// ============================================================================

export class DigitalTwinEngine {
  private systemStates: Map<string, DigitalTwinState> = new Map();
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private onUpdateCallbacks: Map<string, Array<(state: DigitalTwinState) => void>> = new Map();

  initializeDigitalTwin(systemId: string): DigitalTwinState {
    const state: DigitalTwinState = {
      systemId,
      lastSync: new Date().toISOString(),
      syncStatus: 'connected',
      liveData: {
        currentPower: 0,
        todayEnergy: 0,
        monthEnergy: 0,
        lifetimeEnergy: 0,
        batteryLevel: 85,
        gridStatus: 'connected',
        inverterStatus: 'online'
      },
      environmentData: {
        irradiance: 0,
        ambientTemp: 25,
        panelTemp: 30,
        humidity: 60,
        windSpeed: 2
      },
      performanceMetrics: {
        performanceRatio: 82,
        specificYield: 4.5,
        capacityFactor: 18,
        efficiency: 18.5
      },
      alerts: [],
      maintenanceSchedule: []
    };

    this.systemStates.set(systemId, state);
    this.startRealTimeSync(systemId);
    return state;
  }

  startRealTimeSync(systemId: string, intervalMs: number = 5000): void {
    if (this.syncIntervals.has(systemId)) {
      clearInterval(this.syncIntervals.get(systemId)!);
    }

    const interval = setInterval(() => {
      this.simulateDataUpdate(systemId);
    }, intervalMs);

    this.syncIntervals.set(systemId, interval);
  }

  stopRealTimeSync(systemId: string): void {
    const interval = this.syncIntervals.get(systemId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(systemId);
    }

    const state = this.systemStates.get(systemId);
    if (state) {
      state.syncStatus = 'disconnected';
    }
  }

  private simulateDataUpdate(systemId: string): void {
    const state = this.systemStates.get(systemId);
    if (!state) return;

    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour <= 18;

    // Simulate irradiance based on time
    const peakIrradiance = 1000;
    const hourFactor = isDaytime ? Math.sin((hour - 6) / 12 * Math.PI) : 0;
    const cloudFactor = 0.7 + Math.random() * 0.3;

    state.environmentData.irradiance = Math.round(peakIrradiance * hourFactor * cloudFactor);
    state.environmentData.ambientTemp = 22 + Math.sin((hour - 6) / 12 * Math.PI) * 10 + (Math.random() - 0.5) * 2;
    state.environmentData.panelTemp = state.environmentData.ambientTemp + (state.environmentData.irradiance / 100) * 2;
    state.environmentData.humidity = 50 + Math.random() * 30;
    state.environmentData.windSpeed = 1 + Math.random() * 5;

    // Simulate power production
    const systemSize = 10; // kWp
    state.liveData.currentPower = systemSize * (state.environmentData.irradiance / 1000) * 0.85;
    state.liveData.todayEnergy += state.liveData.currentPower * (5 / 3600); // 5 second interval
    state.liveData.monthEnergy = state.liveData.todayEnergy * new Date().getDate() * 0.9;
    state.liveData.lifetimeEnergy = state.liveData.monthEnergy * 24 / 1000;

    // Battery simulation
    if (state.liveData.batteryLevel !== undefined) {
      const charging = state.liveData.currentPower > 5;
      state.liveData.batteryLevel = Math.min(100, Math.max(10,
        state.liveData.batteryLevel + (charging ? 0.1 : -0.05)
      ));
    }

    // Update performance metrics
    state.performanceMetrics.performanceRatio = 78 + Math.random() * 10;
    state.performanceMetrics.efficiency = 17 + Math.random() * 3;

    state.lastSync = new Date().toISOString();
    state.syncStatus = 'connected';

    // Notify subscribers
    this.notifySubscribers(systemId, state);
  }

  subscribe(systemId: string, callback: (state: DigitalTwinState) => void): () => void {
    if (!this.onUpdateCallbacks.has(systemId)) {
      this.onUpdateCallbacks.set(systemId, []);
    }
    this.onUpdateCallbacks.get(systemId)!.push(callback);

    return () => {
      const callbacks = this.onUpdateCallbacks.get(systemId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      }
    };
  }

  private notifySubscribers(systemId: string, state: DigitalTwinState): void {
    const callbacks = this.onUpdateCallbacks.get(systemId);
    if (callbacks) {
      callbacks.forEach(cb => cb(state));
    }
  }

  getSystemState(systemId: string): DigitalTwinState | undefined {
    return this.systemStates.get(systemId);
  }

  // What-if scenario simulation
  simulateScenario(systemId: string, changes: Partial<DigitalTwinState['liveData']>): DigitalTwinState {
    const currentState = this.systemStates.get(systemId);
    if (!currentState) throw new Error('System not found');

    const scenarioState: DigitalTwinState = JSON.parse(JSON.stringify(currentState));
    scenarioState.liveData = { ...scenarioState.liveData, ...changes };

    return scenarioState;
  }
}

// ============================================================================
// COMMAND CENTER
// ============================================================================

export class CommandCenter {
  private alertsEngine: SmartAlertsEngine;
  private advisorEngine: AIAdvisorEngine;
  private digitalTwinEngine: DigitalTwinEngine;

  constructor() {
    this.alertsEngine = new SmartAlertsEngine();
    this.advisorEngine = new AIAdvisorEngine();
    this.digitalTwinEngine = new DigitalTwinEngine();
  }

  getExecutiveDashboard(systemIds: string[]): ExecutiveDashboard {
    const systems = systemIds.map(id => this.digitalTwinEngine.getSystemState(id)).filter(Boolean) as DigitalTwinState[];

    const totalCapacity = systems.length * 10; // Assuming 10kW average
    const totalEnergy = systems.reduce((sum, s) => sum + s.liveData.lifetimeEnergy, 0);

    return {
      kpis: {
        totalSystems: systems.length,
        totalCapacity: totalCapacity / 1000, // MW
        totalEnergy: totalEnergy, // MWh
        totalSavings: totalEnergy * 25000, // KES 25 per kWh
        activeAlerts: this.alertsEngine.getUnreadCount(),
        systemUptime: 98.5 + Math.random() * 1.5,
      },
      performance: {
        currentPower: systems.reduce((sum, s) => sum + s.liveData.currentPower, 0),
        dailyEnergy: systems.reduce((sum, s) => sum + s.liveData.todayEnergy, 0),
        monthlyEnergy: systems.reduce((sum, s) => sum + s.liveData.monthEnergy, 0),
        yearlyEnergy: systems.reduce((sum, s) => sum + s.liveData.monthEnergy * 12, 0),
        co2Offset: totalEnergy * 0.5, // 0.5 kg CO2 per kWh
      },
      financials: {
        monthlyRevenue: systems.reduce((sum, s) => sum + s.liveData.monthEnergy * 25, 0),
        monthlySavings: systems.reduce((sum, s) => sum + s.liveData.monthEnergy * 20, 0),
        projectedROI: 22 + Math.random() * 8,
        paybackProgress: 35 + Math.random() * 20,
      },
      systemHealth: systems.map(s => ({
        systemId: s.systemId,
        name: `System ${s.systemId.slice(-4)}`,
        status: s.performanceMetrics.performanceRatio > 80 ? 'optimal' :
               s.performanceMetrics.performanceRatio > 70 ? 'degraded' : 'critical',
        lastUpdate: s.lastSync,
        performance: s.performanceMetrics.performanceRatio,
      })),
      recentAlerts: this.alertsEngine.getAlerts({ unreadOnly: true }).slice(0, 5),
      upcomingMaintenance: systems.flatMap(s => s.maintenanceSchedule).slice(0, 5),
    };
  }

  getAlerts(): SmartAlertsEngine {
    return this.alertsEngine;
  }

  getAdvisor(): AIAdvisorEngine {
    return this.advisorEngine;
  }

  getDigitalTwin(): DigitalTwinEngine {
    return this.digitalTwinEngine;
  }
}

// Export singleton
export const commandCenter = new CommandCenter();
export const smartAlerts = commandCenter.getAlerts();
export const aiAdvisor = commandCenter.getAdvisor();
export const digitalTwin = commandCenter.getDigitalTwin();
