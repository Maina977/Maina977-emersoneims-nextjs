/**
 * Centralized Diagnostic Services Data
 * No duplications - single source of truth
 */

export const UNIVERSAL_SERVICES = [
  'Solar Systems',
  'Diesel Generators',
  'Controls',
  'AC & UPS',
  'Automation',
  'Pumps',
  'Incinerators',
  'Motors/Rewinding',
  'Diagnostics Hub',
] as const;

export const GENERATOR_SERVICES = [
  'Diesel Generators',
  'Generator Controls',
  'DeepSea Controllers',
  'PowerWizard Systems',
] as const;

export type UniversalService = typeof UNIVERSAL_SERVICES[number];
export type GeneratorService = typeof GENERATOR_SERVICES[number];






