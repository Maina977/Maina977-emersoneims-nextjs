// Maintenance Companion Library Index

// Schematic Data
export {
  systemLayers,
  getAllParts,
  getPartsBySystem,
  getPartById,
  searchParts as searchSchematicParts
} from './schematicData';
export type {
  GeneratorSystem,
  SchematicPart,
  SystemLayer
} from './schematicData';

// Repair Guides
export {
  repairGuides,
  getRepairGuideById,
  getGuidesByCategory,
  getGuidesByDifficulty,
  searchGuides,
  getGuidesByFaultCode,
  difficultyColors,
  difficultyLabels
} from './repairGuides';
export type {
  DifficultyLevel,
  RepairStep,
  RepairGuide
} from './repairGuides';

// Parts Database
export {
  partsDatabase,
  getPartById as getCatalogPartById,
  getPartsBySystem as getCatalogPartsBySystem,
  getPartsByAvailability,
  searchParts as searchCatalogParts,
  getPartsForModel,
  availabilityColors,
  availabilityLabels
} from './partsDatabase';
export type {
  PartAvailability,
  PartSystem,
  GeneratorPart
} from './partsDatabase';

// Predictive Engine
export {
  predictiveRules,
  analyzeSymptoms,
  urgencyColors,
  urgencyLabels
} from './predictiveEngine';
export type {
  UrgencyLevel,
  SymptomCategory,
  PredictiveRule,
  SymptomInput,
  PredictionResult
} from './predictiveEngine';

// Efficiency Calculations
export {
  calculateEfficiency,
  analyzeLoad,
  calculateBreakeven,
  efficiencyRatingColors,
  efficiencyRatingLabels
} from './efficiencyCalculations';
export type {
  EfficiencyInput,
  EfficiencyResult,
  LoadAnalysis
} from './efficiencyCalculations';

// Financial Calculations
export {
  calculateTotalMaintenanceCost,
  calculateAverageAnnualMaintenance,
  calculateMaintenanceCostPerHour,
  getAssetAgeYears,
  calculateBookValue,
  analyzeRepairVsReplace,
  calculateROI,
  analyzeUpsizing,
  formatCurrency,
  sampleRepairHistory
} from './financialCalculations';
export type {
  RepairLogEntry,
  GeneratorAsset,
  RepairVsReplaceResult,
  ROIAnalysis,
  UpsizingRecommendation
} from './financialCalculations';
