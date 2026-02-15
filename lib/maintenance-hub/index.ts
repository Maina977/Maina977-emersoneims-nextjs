/**
 * Enhanced Maintenance Hub Services - Combined Export
 * World's Most Comprehensive Maintenance Hub
 * Comprehensive, detailed content for all 9 service categories
 * Including 700+ fault codes, detailed procedures, and professional documentation
 */

import { ENHANCED_SERVICE_CATEGORIES, type EnhancedServiceCategory, type DetailedProblem, type DetailedGuideline } from './enhanced-services-data';
import { ENHANCED_SERVICES_PART2 } from './enhanced-services-part2';
import { ENHANCED_SERVICES_PART3 } from './enhanced-services-part3';
import { ENHANCED_SERVICES_PART4 } from './enhanced-services-part4';

// Import comprehensive fault databases
import {
  GENERATOR_FAULT_DATABASE,
  SOLAR_FAULT_DATABASE,
  MOTOR_FAULT_DATABASE,
  UPS_FAULT_DATABASE,
  AC_FAULT_DATABASE,
  ELECTRICAL_FAULT_DATABASE,
  ALL_FAULT_DATABASES,
  getFaultByCode,
  getFaultsByService,
  getFaultsBySeverity,
  searchFaults,
  getTotalFaultCount,
  type FaultCode,
  type ServiceFaultDatabase
} from './comprehensive-fault-database';

// Import comprehensive services data
import {
  GENERATOR_SERVICE,
  COMPREHENSIVE_SERVICES,
  getServiceById as getComprehensiveServiceById,
  searchFAQs,
  type ComprehensiveService,
  type ComprehensiveSubService,
  type ComprehensiveProblem,
  type ComprehensiveSafetyGuideline,
  type ComprehensiveTool,
  type IndustryApplication,
  type MaintenanceTask,
  type PricingTier,
  type FAQ
} from './comprehensive-services-data';

// Combine all services into single array
export const ALL_ENHANCED_SERVICES: EnhancedServiceCategory[] = [
  ...ENHANCED_SERVICE_CATEGORIES,
  ...ENHANCED_SERVICES_PART2,
  ...ENHANCED_SERVICES_PART3,
  ...ENHANCED_SERVICES_PART4,
];

// Export fault databases
export {
  GENERATOR_FAULT_DATABASE,
  SOLAR_FAULT_DATABASE,
  MOTOR_FAULT_DATABASE,
  UPS_FAULT_DATABASE,
  AC_FAULT_DATABASE,
  ELECTRICAL_FAULT_DATABASE,
  ALL_FAULT_DATABASES,
  getFaultByCode,
  getFaultsByService,
  getFaultsBySeverity,
  searchFaults,
  getTotalFaultCount
};

// Export comprehensive services
export {
  GENERATOR_SERVICE,
  COMPREHENSIVE_SERVICES,
  getComprehensiveServiceById,
  searchFAQs
};

// Import comprehensive solar faults (legacy)
import {
  ALL_SOLAR_FAULTS,
  GROWATT_FAULTS as GROWATT_LEGACY,
  DEYE_FAULTS as DEYE_LEGACY,
  VICTRON_FAULTS,
  HUAWEI_FAULTS,
  SOLAR_FAULT_BRANDS,
  getSolarFaultByCode,
  getSolarFaultsByBrand,
  getSolarFaultsBySeverity,
  searchSolarFaults,
  getTotalSolarFaultCount,
  type SolarFaultCode
} from './comprehensive-solar-faults';

// Import NEW comprehensive solar faults database (1000+ fault codes)
import SolarFaultDatabase, {
  ALL_INVERTER_FAULTS,
  ALL_BATTERY_FAULTS,
  ALL_PANEL_FAULTS,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  PANEL_CATEGORIES,
  getInverterFaultByCode,
  getInverterFaultsByBrand,
  getInverterFaultsBySeverity,
  getInverterFaultsByCategory,
  searchInverterFaults,
  getTotalInverterFaultCount,
  getBatteryFaultByCode,
  getBatteryFaultsByBrand,
  getBatteryFaultsBySeverity,
  searchBatteryFaults,
  getTotalBatteryFaultCount,
  getPanelFaultByCode,
  getPanelFaultsByCategory,
  getPanelFaultsBySeverity,
  searchPanelFaults,
  getTotalPanelFaultCount,
  searchAllSolarFaults,
  getSolarFaultDatabaseStats,
  type InverterFault,
  type BatteryFault,
  type PanelFault
} from './solar-faults';

// Export legacy solar faults
export {
  ALL_SOLAR_FAULTS,
  VICTRON_FAULTS,
  HUAWEI_FAULTS,
  SOLAR_FAULT_BRANDS,
  getSolarFaultByCode,
  getSolarFaultsByBrand,
  getSolarFaultsBySeverity,
  searchSolarFaults,
  getTotalSolarFaultCount
};

// Export NEW comprehensive solar fault database
export {
  SolarFaultDatabase,
  ALL_INVERTER_FAULTS,
  ALL_BATTERY_FAULTS,
  ALL_PANEL_FAULTS,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  PANEL_CATEGORIES,
  getInverterFaultByCode,
  getInverterFaultsByBrand,
  getInverterFaultsBySeverity,
  getInverterFaultsByCategory,
  searchInverterFaults,
  getTotalInverterFaultCount,
  getBatteryFaultByCode,
  getBatteryFaultsByBrand,
  getBatteryFaultsBySeverity,
  searchBatteryFaults,
  getTotalBatteryFaultCount,
  getPanelFaultByCode,
  getPanelFaultsByCategory,
  getPanelFaultsBySeverity,
  searchPanelFaults,
  getTotalPanelFaultCount,
  searchAllSolarFaults,
  getSolarFaultDatabaseStats
};

// Export types
export type {
  FaultCode,
  ServiceFaultDatabase,
  ComprehensiveService,
  ComprehensiveSubService,
  ComprehensiveProblem,
  ComprehensiveSafetyGuideline,
  ComprehensiveTool,
  IndustryApplication,
  MaintenanceTask,
  PricingTier,
  FAQ,
  SolarFaultCode,
  InverterFault,
  BatteryFault,
  PanelFault
};

// ═══════════════════════════════════════════════════════════════════════════════
// WORLD'S MOST COMPREHENSIVE MAINTENANCE HUB STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

// Get comprehensive solar stats
const solarStats = getSolarFaultDatabaseStats();

export const MAINTENANCE_HUB_STATS = {
  totalServices: 9,
  totalFaultCodes: getTotalFaultCount() + solarStats.totalFaults,
  generatorFaults: GENERATOR_FAULT_DATABASE.faults.length,
  solarFaults: solarStats.totalFaults,
  solarInverterFaults: solarStats.inverterFaults,
  solarBatteryFaults: solarStats.batteryFaults,
  solarPanelFaults: solarStats.panelFaults,
  motorFaults: MOTOR_FAULT_DATABASE.faults.length,
  upsFaults: UPS_FAULT_DATABASE.faults.length,
  acFaults: AC_FAULT_DATABASE.faults.length,
  electricalFaults: ELECTRICAL_FAULT_DATABASE.faults.length,
  solarBrands: SOLAR_FAULT_BRANDS.length,
  inverterBrands: solarStats.inverterBrands,
  batteryBrands: solarStats.batteryBrands,
  description: 'World\'s Most Comprehensive Maintenance Hub - 1000+ Fault Codes'
};

// Re-export types
export type { EnhancedServiceCategory, DetailedProblem, DetailedGuideline };

// Helper function to find service by ID
export function getServiceById(id: string): EnhancedServiceCategory | undefined {
  return ALL_ENHANCED_SERVICES.find(service => service.id === id);
}

// Helper function to get all service IDs
export function getAllServiceIds(): string[] {
  return ALL_ENHANCED_SERVICES.map(service => service.id);
}

// Quick reference data for cards
export const SERVICE_QUICK_DATA = ALL_ENHANCED_SERVICES.map(service => ({
  id: service.id,
  name: service.name,
  icon: service.icon,
  iconBg: service.iconBg,
  shortDescription: service.shortDescription,
  href: service.href,
  color: service.color,
  glowColor: service.glowColor,
  features: service.features,
  stats: service.stats,
}));

export default ALL_ENHANCED_SERVICES;
