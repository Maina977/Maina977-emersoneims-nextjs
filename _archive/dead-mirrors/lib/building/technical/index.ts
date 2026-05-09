/**
 * TECHNICAL DOCUMENTATION CENTER
 *
 * Central export for all technical content including:
 * - Technical Bible infrastructure
 * - Controller schematics and wiring diagrams
 * - ECM documentation and programming guides
 * - Inverter maintenance and repair manuals
 * - Service modules
 */

// Technical Bible Library
export * from './technicalBible';

// Re-export service modules
export { default as cumminsGeneratorsService } from './services/cumminsGenerators';
export { default as cumminsGeneratorsTroubleshooting } from './services/cumminsGeneratorsTroubleshooting';
export { default as cumminsGeneratorsRepairs } from './services/cumminsGeneratorsRepairs';
export { default as atsChangeoverService } from './services/atsChangeover';
export { default as solarEnergyService } from './services/solarEnergy';
export { default as distributionBoardsService } from './services/distributionBoards';
export { default as motorRewindingService } from './services/motorRewinding';
export { default as upsSystemsBoreholeService } from './services/upsSystemsBorehole';
export { default as acInstallationService } from './services/acInstallation';
export { default as hospitalIncineratorsService } from './services/hospitalIncinerators';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER SCHEMATICS - Detailed wiring diagrams for all controller brands
// ═══════════════════════════════════════════════════════════════════════════════

// Import for local use
import {
  DSE_CONTROLLERS as _DSE,
  searchControllers as _searchControllers
} from './controller-schematics';

import { COMAP_CONTROLLERS as _COMAP } from './controller-schematics/comap-controllers';
import { WOODWARD_CONTROLLERS as _WOODWARD } from './controller-schematics/woodward-controllers';
import { SMARTGEN_CONTROLLERS as _SMARTGEN } from './controller-schematics/smartgen-controllers';
import { DATAKOM_CONTROLLERS as _DATAKOM } from './controller-schematics/datakom-controllers';
import { CUMMINS_ECMS as _CUMMINS_ECMS, searchECMs as _searchECMs } from './ecm-schematics';
import {
  VICTRON_INVERTERS as _VICTRON,
  GROWATT_INVERTERS as _GROWATT,
  searchInverters as _searchInverters
} from './inverter-maintenance';

// Re-export controller schematics
export {
  type ControllerSchematic,
  type WireConnection,
  type ControllerTerminal,
  type WiringDiagram,
  type TroubleshootingGuide,
  type InstallationStep,
  type MaintenanceTask,
  type RepairProcedure,
  type SparePart,
  DSE_CONTROLLERS,
  getControllerById,
  getControllersByManufacturer,
  searchControllers
} from './controller-schematics';

export {
  COMAP_CONTROLLERS,
  getAllComApControllers,
  getComApControllerById
} from './controller-schematics/comap-controllers';

export {
  WOODWARD_CONTROLLERS,
  getAllWoodwardControllers,
  getWoodwardControllerById
} from './controller-schematics/woodward-controllers';

export {
  SMARTGEN_CONTROLLERS,
  getAllSmartGenControllers,
  getSmartGenControllerById
} from './controller-schematics/smartgen-controllers';

export {
  DATAKOM_CONTROLLERS,
  getAllDatakomControllers,
  getDatakomControllerById
} from './controller-schematics/datakom-controllers';

// ═══════════════════════════════════════════════════════════════════════════════
// ECM SCHEMATICS - Complete ECM pinouts, programming, and diagnostics
// ═══════════════════════════════════════════════════════════════════════════════

export {
  type ECMSchematic,
  type ECMPinout,
  type ECMConnector,
  type ECMFaultCode,
  type ProgrammingInfo,
  CUMMINS_ECMS,
  getAllCumminsECMs,
  getCumminsECMById,
  searchECMs
} from './ecm-schematics';

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER MAINTENANCE - Repair guides for 100+ inverter models
// ═══════════════════════════════════════════════════════════════════════════════

export {
  type InverterModel,
  type InverterSpecs,
  type InverterTerminal,
  type InverterWiringDiagram,
  type InverterFaultCode,
  type InverterMaintenanceTask,
  type InverterRepairProcedure,
  VICTRON_INVERTERS,
  GROWATT_INVERTERS,
  getAllInverters,
  getInverterById,
  getInvertersByBrand,
  searchInverters
} from './inverter-maintenance';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED SEARCH & STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TechnicalSearchResult {
  type: 'controller' | 'ecm' | 'inverter' | 'part';
  id: string;
  title: string;
  brand: string;
  model: string;
  description: string;
  image?: string;
}

/**
 * Search across all technical documentation
 */
export function searchAllTechnical(query: string): TechnicalSearchResult[] {
  const results: TechnicalSearchResult[] = [];
  const q = query.toLowerCase();

  // Search controllers
  const controllers = _searchControllers(q);
  controllers.forEach((c) => {
    results.push({
      type: 'controller',
      id: c.id,
      title: c.fullName,
      brand: c.manufacturer,
      model: c.model,
      description: c.description,
      image: c.image
    });
  });

  // Search ECMs
  const ecms = _searchECMs(q);
  ecms.forEach((e) => {
    results.push({
      type: 'ecm',
      id: e.id,
      title: e.fullName,
      brand: e.manufacturer,
      model: e.model,
      description: e.description,
      image: e.image
    });
  });

  // Search inverters
  const inverters = _searchInverters(q);
  inverters.forEach((i) => {
    results.push({
      type: 'inverter',
      id: i.id,
      title: i.fullName,
      brand: i.brand,
      model: i.model,
      description: i.description,
      image: i.image
    });
  });

  return results;
}

/**
 * Get statistics about technical documentation coverage
 */
export function getTechnicalStats() {
  return {
    controllers: {
      dse: _DSE.length,
      comap: _COMAP.length,
      woodward: _WOODWARD.length,
      smartgen: _SMARTGEN.length,
      datakom: _DATAKOM.length,
      total: _DSE.length + _COMAP.length + _WOODWARD.length + _SMARTGEN.length + _DATAKOM.length
    },
    ecms: {
      cummins: _CUMMINS_ECMS.length,
      total: _CUMMINS_ECMS.length
    },
    inverters: {
      victron: _VICTRON.length,
      growatt: _GROWATT.length,
      total: _VICTRON.length + _GROWATT.length
    }
  };
}
