// Technical Bible Library Index
// Re-export all types and utilities from technicalBible

export * from './technicalBible';

// Service Documentation Modules
export { cumminsGeneratorsService } from './services/cumminsGenerators';
export { cumminsGeneratorsTroubleshooting } from './services/cumminsGeneratorsTroubleshooting';
export { cumminsGeneratorsRepairs } from './services/cumminsGeneratorsRepairs';
export { atsChangeoverService } from './services/atsChangeover';
export { solarEnergyService } from './services/solarEnergy';
export { distributionBoardsService } from './services/distributionBoards';
export { motorRewindingService } from './services/motorRewinding';
export { upsSystemsService, boreholeService } from './services/upsSystemsBorehole';
export { acInstallationService } from './services/acInstallation';
export { hospitalIncineratorsService } from './services/hospitalIncinerators';

// Consolidated service list for Technical Bible Hub
import { cumminsGeneratorsService } from './services/cumminsGenerators';
import { atsChangeoverService } from './services/atsChangeover';
import { solarEnergyService } from './services/solarEnergy';
import { distributionBoardsService } from './services/distributionBoards';
import { motorRewindingService } from './services/motorRewinding';
import { upsSystemsService, boreholeService } from './services/upsSystemsBorehole';
import { acInstallationService } from './services/acInstallation';
import { hospitalIncineratorsService } from './services/hospitalIncinerators';
import type { ServiceDocumentation } from './technicalBible';

export const ALL_SERVICES: ServiceDocumentation[] = [
  cumminsGeneratorsService,
  atsChangeoverService,
  solarEnergyService,
  distributionBoardsService,
  motorRewindingService,
  upsSystemsService,
  boreholeService,
  acInstallationService,
  hospitalIncineratorsService,
];
