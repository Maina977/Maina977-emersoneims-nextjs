/**
 * Comprehensive Solar Fault Database Index
 * World's Most Comprehensive Solar Maintenance Hub
 *
 * This module exports all solar-related fault codes including:
 * - Inverter faults (1000+ codes from 20+ brands)
 * - Battery faults (100+ codes from 10+ brands)
 * - Panel faults (50+ fault types)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER FAULT IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

import {
  InverterFault,
  GROWATT_FAULTS,
  DEYE_FAULTS,
  SMA_FAULTS,
  FRONIUS_FAULTS,
  INVERTER_FAULTS_PART1
} from './inverter-faults-part1';

import {
  GOODWE_FAULTS,
  SUNGROW_FAULTS,
  SOLAREDGE_FAULTS,
  ENPHASE_FAULTS,
  SOFAR_FAULTS,
  SOLIS_FAULTS,
  INVERTER_FAULTS_PART2
} from './inverter-faults-part2';

import {
  VOLTRONIC_AXPERT_FAULTS,
  MUST_SOLAR_FAULTS,
  MPP_SOLAR_FAULTS,
  ABB_FIMER_FAULTS,
  SCHNEIDER_FAULTS,
  OUTBACK_FAULTS,
  ALL_INVERTER_FAULTS_PART3
} from './inverter-faults-part3';

// ═══════════════════════════════════════════════════════════════════════════════
// BATTERY FAULT IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

import {
  BatteryFault,
  PYLONTECH_FAULTS,
  BYD_FAULTS,
  LG_CHEM_FAULTS,
  TESLA_FAULTS,
  DYNESS_FAULTS,
  FREEDOM_WON_FAULTS,
  HUBBLE_FAULTS,
  ALL_BATTERY_FAULTS,
  BATTERY_BRANDS,
  getBatteryFaultByCode,
  getBatteryFaultsByBrand,
  getBatteryFaultsBySeverity,
  searchBatteryFaults,
  getTotalBatteryFaultCount
} from './battery-faults';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL FAULT IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PanelFault,
  GENERAL_PANEL_FAULTS,
  THIN_FILM_FAULTS,
  BIFACIAL_FAULTS,
  ALL_PANEL_FAULTS,
  PANEL_CATEGORIES,
  getPanelFaultByCode,
  getPanelFaultsByCategory,
  getPanelFaultsBySeverity,
  searchPanelFaults,
  getTotalPanelFaultCount
} from './panel-faults';

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED INVERTER FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_INVERTER_FAULTS: InverterFault[] = [
  ...INVERTER_FAULTS_PART1,
  ...INVERTER_FAULTS_PART2,
  ...ALL_INVERTER_FAULTS_PART3
];

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER BRANDS LIST
// ═══════════════════════════════════════════════════════════════════════════════

export const INVERTER_BRANDS = [
  'Growatt',
  'Deye',
  'SMA',
  'Fronius',
  'GoodWe',
  'Sungrow',
  'SolarEdge',
  'Enphase',
  'Sofar',
  'Solis',
  'Voltronic/Axpert',
  'Must Solar',
  'MPP Solar',
  'ABB/FIMER',
  'Schneider Electric',
  'Outback Power'
];

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getInverterFaultByCode(code: string): InverterFault | undefined {
  return ALL_INVERTER_FAULTS.find(f => f.code.toLowerCase() === code.toLowerCase());
}

export function getInverterFaultsByBrand(brand: string): InverterFault[] {
  return ALL_INVERTER_FAULTS.filter(f => f.brand.toLowerCase().includes(brand.toLowerCase()));
}

export function getInverterFaultsBySeverity(severity: string): InverterFault[] {
  return ALL_INVERTER_FAULTS.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
}

export function getInverterFaultsByCategory(category: string): InverterFault[] {
  return ALL_INVERTER_FAULTS.filter(f => f.category.toLowerCase() === category.toLowerCase());
}

export function searchInverterFaults(keyword: string): InverterFault[] {
  const term = keyword.toLowerCase();
  return ALL_INVERTER_FAULTS.filter(f =>
    f.code.toLowerCase().includes(term) ||
    f.name.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term) ||
    f.brand.toLowerCase().includes(term) ||
    (f.model && f.model.toLowerCase().includes(term))
  );
}

export function getTotalInverterFaultCount(): number {
  return ALL_INVERTER_FAULTS.length;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED SOLAR FAULT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export interface SolarFaultDatabaseStats {
  totalFaults: number;
  inverterFaults: number;
  batteryFaults: number;
  panelFaults: number;
  inverterBrands: number;
  batteryBrands: number;
  panelCategories: number;
}

export function getSolarFaultDatabaseStats(): SolarFaultDatabaseStats {
  return {
    totalFaults: ALL_INVERTER_FAULTS.length + ALL_BATTERY_FAULTS.length + ALL_PANEL_FAULTS.length,
    inverterFaults: ALL_INVERTER_FAULTS.length,
    batteryFaults: ALL_BATTERY_FAULTS.length,
    panelFaults: ALL_PANEL_FAULTS.length,
    inverterBrands: INVERTER_BRANDS.length,
    batteryBrands: BATTERY_BRANDS.length,
    panelCategories: PANEL_CATEGORIES.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL SEARCH FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface UniversalSearchResult {
  type: 'inverter' | 'battery' | 'panel';
  fault: InverterFault | BatteryFault | PanelFault;
}

export function searchAllSolarFaults(keyword: string): UniversalSearchResult[] {
  const results: UniversalSearchResult[] = [];
  const term = keyword.toLowerCase();

  // Search inverter faults
  ALL_INVERTER_FAULTS.filter(f =>
    f.code.toLowerCase().includes(term) ||
    f.name.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term) ||
    f.brand.toLowerCase().includes(term)
  ).forEach(f => results.push({ type: 'inverter', fault: f }));

  // Search battery faults
  ALL_BATTERY_FAULTS.filter(f =>
    f.code.toLowerCase().includes(term) ||
    f.name.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term) ||
    f.brand.toLowerCase().includes(term)
  ).forEach(f => results.push({ type: 'battery', fault: f }));

  // Search panel faults
  ALL_PANEL_FAULTS.filter(f =>
    f.code.toLowerCase().includes(term) ||
    f.name.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term)
  ).forEach(f => results.push({ type: 'panel', fault: f }));

  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS - Inverter Faults by Brand
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Part 1
  GROWATT_FAULTS,
  DEYE_FAULTS,
  SMA_FAULTS,
  FRONIUS_FAULTS,
  // Part 2
  GOODWE_FAULTS,
  SUNGROW_FAULTS,
  SOLAREDGE_FAULTS,
  ENPHASE_FAULTS,
  SOFAR_FAULTS,
  SOLIS_FAULTS,
  // Part 3
  VOLTRONIC_AXPERT_FAULTS,
  MUST_SOLAR_FAULTS,
  MPP_SOLAR_FAULTS,
  ABB_FIMER_FAULTS,
  SCHNEIDER_FAULTS,
  OUTBACK_FAULTS
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS - Battery Faults by Brand
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PYLONTECH_FAULTS,
  BYD_FAULTS,
  LG_CHEM_FAULTS,
  TESLA_FAULTS,
  DYNESS_FAULTS,
  FREEDOM_WON_FAULTS,
  HUBBLE_FAULTS,
  ALL_BATTERY_FAULTS,
  BATTERY_BRANDS,
  getBatteryFaultByCode,
  getBatteryFaultsByBrand,
  getBatteryFaultsBySeverity,
  searchBatteryFaults,
  getTotalBatteryFaultCount
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS - Panel Faults
// ═══════════════════════════════════════════════════════════════════════════════

export {
  GENERAL_PANEL_FAULTS,
  THIN_FILM_FAULTS,
  BIFACIAL_FAULTS,
  ALL_PANEL_FAULTS,
  PANEL_CATEGORIES,
  getPanelFaultByCode,
  getPanelFaultsByCategory,
  getPanelFaultsBySeverity,
  searchPanelFaults,
  getTotalPanelFaultCount
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS - Types
// ═══════════════════════════════════════════════════════════════════════════════

export type { InverterFault, BatteryFault, PanelFault };

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

const SolarFaultDatabase = {
  // Inverters
  inverterFaults: ALL_INVERTER_FAULTS,
  inverterBrands: INVERTER_BRANDS,
  getInverterFaultByCode,
  getInverterFaultsByBrand,
  getInverterFaultsBySeverity,
  getInverterFaultsByCategory,
  searchInverterFaults,
  getTotalInverterFaultCount,

  // Batteries
  batteryFaults: ALL_BATTERY_FAULTS,
  batteryBrands: BATTERY_BRANDS,
  getBatteryFaultByCode,
  getBatteryFaultsByBrand,
  getBatteryFaultsBySeverity,
  searchBatteryFaults,
  getTotalBatteryFaultCount,

  // Panels
  panelFaults: ALL_PANEL_FAULTS,
  panelCategories: PANEL_CATEGORIES,
  getPanelFaultByCode,
  getPanelFaultsByCategory,
  getPanelFaultsBySeverity,
  searchPanelFaults,
  getTotalPanelFaultCount,

  // Universal
  searchAllSolarFaults,
  getStats: getSolarFaultDatabaseStats
};

export default SolarFaultDatabase;
