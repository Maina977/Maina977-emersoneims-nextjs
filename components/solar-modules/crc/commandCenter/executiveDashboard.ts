// EXECUTIVE DASHBOARD
// High-level overview for management

export interface ExecutiveMetrics {
  period: { start: Date; end: Date };
  financial: {
    totalRevenue: number;
    totalSavings: number;
    projectedROI: number;
    averagePayback: number;
  };
  operational: {
    totalSystems: number;
    totalCapacityMW: number;
    activeProjects: number;
    completedProjects: number;
  };
  performance: {
    averageSystemEfficiency: number;
    averageUptime: number;
    totalEnergyGenerated: number;
    co2Offset: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
  trends: {
    revenueTrend: number[];
    adoptionTrend: number[];
    efficiencyTrend: number[];
  };
}

class ExecutiveDashboard {
  private cachedMetrics: Map<string, ExecutiveMetrics> = new Map();
  private updateInterval: number | null = null;
  
  constructor() {
    this.startAutoUpdate();
  }
  
  private startAutoUpdate(): void {
    this.updateInterval = window.setInterval(() => {
      this.refreshMetrics();
    }, 300000); // Update every 5 minutes
  }
  
  async refreshMetrics(tenantId?: string): Promise<ExecutiveMetrics> {
    const metrics = await this.calculateMetrics(tenantId);
    const key = tenantId || 'global';
    this.cachedMetrics.set(key, metrics);
    return metrics;
  }
  
  async getMetrics(tenantId?: string): Promise<ExecutiveMetrics> {
    const key = tenantId || 'global';
    const cached = this.cachedMetrics.get(key);
    if (cached) return cached;
    return this.refreshMetrics(tenantId);
  }
  
  private async calculateMetrics(tenantId?: string): Promise<ExecutiveMetrics> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    // Simulate metrics calculation
    return {
      period: { start: startDate, end: endDate },
      financial: {
        totalRevenue: 12500000,
        totalSavings: 8750000,
        projectedROI: 18.5,
        averagePayback: 6.2
      },
      operational: {
        totalSystems: 342,
        totalCapacityMW: 2.4,
        activeProjects: 28,
        completedProjects: 314
      },
      performance: {
        averageSystemEfficiency: 87.5,
        averageUptime: 99.2,
        totalEnergyGenerated: 12500000,
        co2Offset: 5250
      },
      alerts: {
        critical: 2,
        warning: 8,
        info: 15
      },
      trends: {
        revenueTrend: [850000, 920000, 1100000, 1250000, 1400000, 1550000],
        adoptionTrend: [12, 15, 18, 22, 28, 34],
        efficiencyTrend: [82.5, 83.2, 84.1, 85.3, 86.4, 87.5]
      }
    };
  }
  
  async getKPIs(tenantId?: string): Promise<{
    kpis: Array<{ name: string; value: number; unit: string; trend: 'up' | 'down' | 'stable'; change: number }>;
  }> {
    const metrics = await this.getMetrics(tenantId);
    
    return {
      kpis: [
        { name: 'Total Revenue', value: metrics.financial.totalRevenue / 1000000, unit: 'M KSh', trend: 'up', change: 12.5 },
        { name: 'Customer Savings', value: metrics.financial.totalSavings / 1000000, unit: 'M KSh', trend: 'up', change: 15.2 },
        { name: 'ROI', value: metrics.financial.projectedROI, unit: '%', trend: 'up', change: 2.3 },
        { name: 'Systems Installed', value: metrics.operational.totalSystems, unit: '', trend: 'up', change: 8.7 },
        { name: 'CO2 Offset', value: metrics.performance.co2Offset, unit: 'tons', trend: 'up', change: 11.4 },
        { name: 'Uptime', value: metrics.performance.averageUptime, unit: '%', trend: 'stable', change: 0.5 }
      ]
    };
  }
  
  async getRegionalBreakdown(): Promise<{
    regions: Array<{ name: string; systems: number; capacityMW: number; revenue: number }>;
  }> {
    return {
      regions: [
        { name: 'Nairobi', systems: 156, capacityMW: 1.2, revenue: 5200000 },
        { name: 'Mombasa', systems: 78, capacityMW: 0.6, revenue: 2600000 },
        { name: 'Kisumu', systems: 54, capacityMW: 0.4, revenue: 1800000 },
        { name: 'Eldoret', systems: 32, capacityMW: 0.2, revenue: 1100000 },
        { name: 'Other', systems: 22, capacityMW: 0.1, revenue: 800000 }
      ]
    };
  }
  
  async getForecast(months: number = 12): Promise<{
    revenue: Array<{ month: string; value: number }>;
    adoption: Array<{ month: string; value: number }>;
  }> {
    const forecast = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= months; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() + i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      forecast.push({
        revenue: { month: monthName, value: 1250000 + i * 85000 },
        adoption: { month: monthName, value: 34 + i * 2.5 }
      });
    }
    
    return {
      revenue: forecast.map(f => f.revenue),
      adoption: forecast.map(f => f.adoption)
    };
  }
  
  async exportReport(tenantId?: string, format: 'pdf' | 'json' = 'json'): Promise<string> {
    const metrics = await this.getMetrics(tenantId);
    const kpis = await this.getKPIs(tenantId);
    const regions = await this.getRegionalBreakdown();
    const forecast = await this.getForecast();
    
    const report = {
      generatedAt: new Date(),
      metrics,
      kpis,
      regions,
      forecast
    };
    
    return JSON.stringify(report, null, 2);
  }
}

export const executiveDashboard = new ExecutiveDashboard();