/**
 * Diagnostics Module - Type Definitions and Utilities
 * Centralized type definitions and utilities for diagnostics module
 */

export interface DiagnosticAlert {
  id: number;
  title: string;
  message: string;
  level: 'HIGH' | 'MED' | 'LOW';
  timestamp: Date;
}

export interface DiagnosticLog {
  timestamp: Date;
  service: string;
  message: string;
  severity: 'HIGH' | 'MED' | 'LOW';
}

export interface HealthStatus {
  status: 'green' | 'amber' | 'red';
  score: number;
  lastUpdated: Date;
}

export interface ServiceMetrics {
  service: string;
  uptime: number;
  errors: number;
  warnings: number;
  lastMaintenance: Date;
}

export interface DiagnosticConfig {
  refreshInterval: number;
  alertThreshold: number;
  logRetention: number;
}

export const DEFAULT_DIAGNOSTIC_CONFIG: DiagnosticConfig = {
  refreshInterval: 5000,
  alertThreshold: 10,
  logRetention: 100,
};

/**
 * Generate a diagnostic log entry
 */
export function generateDiagnosticLog(
  service: string,
  message: string,
  severity: 'HIGH' | 'MED' | 'LOW' = 'LOW'
): DiagnosticLog {
  return {
    timestamp: new Date(),
    service,
    message,
    severity,
  };
}

/**
 * Calculate health status from metrics
 */
export function calculateHealthStatus(metrics: ServiceMetrics[]): HealthStatus {
  const totalUptime = metrics.reduce((sum, m) => sum + m.uptime, 0);
  const avgUptime = totalUptime / metrics.length;
  const totalErrors = metrics.reduce((sum, m) => sum + m.errors, 0);

  let status: 'green' | 'amber' | 'red';
  if (avgUptime >= 99 && totalErrors === 0) {
    status = 'green';
  } else if (avgUptime >= 95 && totalErrors < 5) {
    status = 'amber';
  } else {
    status = 'red';
  }

  return {
    status,
    score: Math.round(avgUptime * 10) / 10,
    lastUpdated: new Date(),
  };
}

