/**
 * COMPREHENSIVE GENERATOR FAULT DATABASE INDEX
 * World's Most Detailed Generator Diagnostic Platform
 *
 * This module combines all comprehensive fault codes from multiple files
 * into a single searchable database.
 */

import { STARTING_SYSTEM_FAULTS } from './comprehensive-faults-part1';
import { COOLING_SYSTEM_FAULTS, LUBRICATION_FAULTS } from './comprehensive-faults-part2';
import { ENHANCED_FAULT_DATABASE, type EnhancedFaultCode } from '../enhanced-fault-database';

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED COMPREHENSIVE FAULT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_COMPREHENSIVE_FAULTS: Record<string, EnhancedFaultCode> = {
  // Original enhanced faults
  ...ENHANCED_FAULT_DATABASE,

  // Starting System Faults
  ...STARTING_SYSTEM_FAULTS,

  // Cooling System Faults
  ...COOLING_SYSTEM_FAULTS,

  // Lubrication System Faults
  ...LUBRICATION_FAULTS,
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

export function getDatabaseStats() {
  const faults = Object.values(ALL_COMPREHENSIVE_FAULTS);

  const stats = {
    totalFaultCodes: faults.length,
    bySeverity: {
      emergency: faults.filter(f => f.severity === 'emergency').length,
      shutdown: faults.filter(f => f.severity === 'shutdown').length,
      critical: faults.filter(f => f.severity === 'critical').length,
      warning: faults.filter(f => f.severity === 'warning').length,
      info: faults.filter(f => f.severity === 'info').length,
    },
    byCategory: {} as Record<string, number>,
    totalCaseStudies: faults.reduce((sum, f) => sum + (f.caseStudies?.length || 0), 0),
    totalDiagnosticSteps: faults.reduce((sum, f) => sum + (f.diagnosticProcedures?.length || 0), 0),
    totalRepairProcedures: faults.reduce((sum, f) => sum + (f.repairProcedures?.length || 0), 0),
    totalRootCauses: faults.reduce((sum, f) => sum + (f.rootCauses?.length || 0), 0),
  };

  // Count by category
  faults.forEach(f => {
    const cat = f.category || 'Uncategorized';
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
  });

  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function searchComprehensiveFaults(query: string): EnhancedFaultCode[] {
  const lowercaseQuery = query.toLowerCase();
  const faults = Object.values(ALL_COMPREHENSIVE_FAULTS);

  return faults.filter(fault => {
    // Search in code
    if (fault.code.toLowerCase().includes(lowercaseQuery)) return true;

    // Search in title
    if (fault.title.toLowerCase().includes(lowercaseQuery)) return true;

    // Search in alternative codes
    if (fault.alternativeCodes?.some(code => code.toLowerCase().includes(lowercaseQuery))) return true;

    // Search in category
    if (fault.category?.toLowerCase().includes(lowercaseQuery)) return true;

    // Search in technical overview
    if (fault.technicalOverview?.toLowerCase().includes(lowercaseQuery)) return true;

    // Search in root causes
    if (fault.rootCauses?.some(rc => rc.cause.toLowerCase().includes(lowercaseQuery))) return true;

    return false;
  });
}

export function getFaultByCode(code: string): EnhancedFaultCode | undefined {
  // Direct match
  if (ALL_COMPREHENSIVE_FAULTS[code]) {
    return ALL_COMPREHENSIVE_FAULTS[code];
  }

  // Check alternative codes
  const faults = Object.values(ALL_COMPREHENSIVE_FAULTS);
  return faults.find(fault =>
    fault.alternativeCodes?.some(altCode =>
      altCode.toLowerCase() === code.toLowerCase()
    )
  );
}

export function getFaultsByCategory(category: string): EnhancedFaultCode[] {
  return Object.values(ALL_COMPREHENSIVE_FAULTS).filter(
    fault => fault.category?.toLowerCase() === category.toLowerCase()
  );
}

export function getFaultsBySeverity(severity: string): EnhancedFaultCode[] {
  return Object.values(ALL_COMPREHENSIVE_FAULTS).filter(
    fault => fault.severity === severity
  );
}

export function getAllFaultCodes(): EnhancedFaultCode[] {
  return Object.values(ALL_COMPREHENSIVE_FAULTS);
}

export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(ALL_COMPREHENSIVE_FAULTS).forEach(fault => {
    if (fault.category) categories.add(fault.category);
  });
  return Array.from(categories).sort();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type { EnhancedFaultCode };

export default ALL_COMPREHENSIVE_FAULTS;
