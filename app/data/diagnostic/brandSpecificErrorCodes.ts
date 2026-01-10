/**
 * BRAND-SPECIFIC ERROR CODES DATABASE
 * Generated from PowerWizard and DeepSea controller documentation
 * Plus comprehensive manufacturer-specific fault codes:
 * - Cummins diesel engines
 * - Caterpillar (CAT) diesel engines
 * - Perkins diesel engines
 * - Deutz diesel engines
 * - SDMO generators
 * - Atlas Copco generators
 * - Weichai diesel engines
 * - Generac generators
 * - Kohler generators
 * - Doosan diesel engines
 * - World-class detailed generator error codes
 * 
 * Total: 25+ error codes (growing database)
 * Updated: January 2026
 */

import { generatePowerWizardErrorCodes, generateDeepSeaErrorCodes } from '@/lib/errorCodeGenerator';
import { CUMMINS_ERROR_CODES } from '@/lib/data/cumminsErrorCodes';
import { CATERPILLAR_ERROR_CODES } from '@/lib/data/caterpillarErrorCodes';
import { PERKINS_ERROR_CODES } from '@/lib/data/perkinsErrorCodes';
import { GENERATOR_ERROR_CODES } from '@/lib/data/generatorErrorCodes';
import { WORDPRESS_FAULT_CODES } from '@/lib/data/wordpressFaultCodes';

// Generate all controller codes
const powerWizardCodes = generatePowerWizardErrorCodes();
const deepSeaCodes = generateDeepSeaErrorCodes();

// Helper function to format manufacturer codes
const formatManufacturerCodes = (codes: any[], brand: string, service: string) => 
  codes.map(code => ({
    code: code.code,
    brand: brand,
    model: code.model || 'All Electronic',
    service: service,
    category: code.category,
    issue: code.title,
    severity: code.severity?.toUpperCase() || 'WARNING',
    symptoms: code.symptoms || [],
    causes: code.causes || [],
    solution: code.solution || '',
    parts: code.parts || [],
    tools: code.tools || [],
    downtime: code.estimatedTime || '1-4 hours',
    preventive: `Regular maintenance per ${brand} schedule`,
    verified: true
  }));

// Format world-class detailed codes from generatorErrorCodes.ts
const formatDetailedGeneratorCodes = (codes: any[]) =>
  codes.map(code => ({
    code: code.code,
    brand: code.brand,
    model: 'All Models',
    service: `${code.brand} Generator Diagnostics`,
    category: code.category,
    issue: code.title,
    severity: code.severity?.toUpperCase() || 'WARNING',
    symptoms: code.symptoms || [],
    causes: code.causes || [],
    solution: code.solutions?.[0]?.solution || code.description,
    detailedSolutions: code.solutions || [],
    diagnosticSteps: code.diagnosticSteps || [],
    parts: code.solutions?.flatMap((s: any) => s.parts || []) || [],
    tools: code.solutions?.flatMap((s: any) => s.tools || []) || [],
    downtime: code.solutions?.[0]?.timeEstimate || '1-4 hours',
    preventive: code.preventiveMeasures?.join('; ') || '',
    relatedCodes: code.relatedCodes || [],
    safetyWarnings: code.safetyWarnings || [],
    whenToCallExpert: code.whenToCallExpert || '',
    videoGuide: code.videoGuide || '',
    verified: true,
    detailedFormat: true
  }));

// Convert manufacturer codes to compatible format
const cumminsCodesFormatted = formatManufacturerCodes(CUMMINS_ERROR_CODES, 'Cummins', 'Cummins Engine Diagnostics');
const caterpillarCodesFormatted = formatManufacturerCodes(CATERPILLAR_ERROR_CODES, 'Caterpillar', 'CAT Engine Diagnostics');
const perkinsCodesFormatted = formatManufacturerCodes(PERKINS_ERROR_CODES, 'Perkins', 'Perkins Engine Diagnostics');
const detailedGeneratorCodes = formatDetailedGeneratorCodes(GENERATOR_ERROR_CODES);

// Format WordPress plugin fault codes (3,155+ enhanced codes with detailed solutions)
const wordpressFaultCodesFormatted = WORDPRESS_FAULT_CODES.map(code => ({
  code: code.code,
  brand: code.brand,
  model: code.model,
  service: `${code.brand} Generator Diagnostics`,
  category: code.category,
  issue: code.title,
  severity: code.severity?.toUpperCase() || 'WARNING',
  symptoms: code.symptoms || [code.description],
  causes: code.causes || [],
  solution: code.solutions?.[0]?.solution || code.description,
  detailedSolutions: code.solutions || [],
  diagnosticSteps: code.diagnosticSteps || [],
  parts: code.solutions?.flatMap((s: any) => s.parts || []) || [],
  tools: code.solutions?.flatMap((s: any) => s.tools || []) || [],
  downtime: code.solutions?.[0]?.timeEstimate || '1-4 hours',
  preventive: code.preventiveMeasures?.join('; ') || '',
  safetyWarnings: code.safetyWarnings || [],
  whenToCallExpert: code.whenToCallExpert || '',
  verified: true,
  source: 'wordpress-plugin',
  detailedFormat: true
}));

// Combine all brand-specific codes
export const brandSpecificErrorCodes: any[] = [
  ...detailedGeneratorCodes,  // Put detailed codes first for priority
  ...powerWizardCodes,
  ...deepSeaCodes,
  ...cumminsCodesFormatted,
  ...caterpillarCodesFormatted,
  ...perkinsCodesFormatted,
  ...wordpressFaultCodesFormatted  // Add 3,156 WordPress plugin codes
];

// Export code counts for statistics
export const CODE_STATISTICS = {
  detailedGeneratorCodes: detailedGeneratorCodes.length,
  powerWizard: powerWizardCodes.length,
  deepSea: deepSeaCodes.length,
  cummins: cumminsCodesFormatted.length,
  caterpillar: caterpillarCodesFormatted.length,
  perkins: perkinsCodesFormatted.length,
  wordpressPlugin: wordpressFaultCodesFormatted.length,
  total: brandSpecificErrorCodes.length
};
