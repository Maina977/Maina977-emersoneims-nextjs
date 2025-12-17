/**
 * Generators Module - Type Definitions and Utilities
 * Centralized type definitions and utilities for generators module
 */

export interface GeneratorSpec {
  id: string;
  brand: string;
  model: string;
  kva: number;
  kw: number;
  fuelType: 'diesel' | 'gas' | 'biogas';
  phase: 'single' | 'three';
  voltage: number;
  frequency: number;
  price: number;
  image?: string;
}

export interface GeneratorHealth {
  generatorId: string;
  healthScore: number;
  status: 'excellent' | 'good' | 'fair' | 'needs_attention';
  lastMaintenance: Date;
  nextMaintenance: Date;
  runtimeHours: number;
  errors: number;
}

export interface MaintenanceRecord {
  id: string;
  generatorId: string;
  type: 'preventive' | 'corrective' | 'emergency';
  date: Date;
  cost: number;
  description: string;
  technician: string;
}

export interface MTBFData {
  generatorId: string;
  meanTimeBetweenFailures: number; // in hours
  totalFailures: number;
  totalRuntime: number;
  lastFailure?: Date;
}

export interface ErrorFrequency {
  generatorId: string;
  errorType: string;
  frequency: number;
  lastOccurrence: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Calculate generator health score
 */
export function calculateHealthScore(health: GeneratorHealth): number {
  let score = 100;

  // Deduct points for errors
  score -= health.errors * 5;

  // Deduct points for overdue maintenance
  const daysSinceMaintenance = Math.floor(
    (Date.now() - health.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceMaintenance > 90) {
    score -= 10;
  } else if (daysSinceMaintenance > 60) {
    score -= 5;
  }

  // Deduct points for high runtime
  if (health.runtimeHours > 10000) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get health status from score
 */
export function getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'needs_attention' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'needs_attention';
}

/**
 * Calculate MTBF
 */
export function calculateMTBF(totalRuntime: number, totalFailures: number): number {
  if (totalFailures === 0) return totalRuntime;
  return totalRuntime / totalFailures;
}

