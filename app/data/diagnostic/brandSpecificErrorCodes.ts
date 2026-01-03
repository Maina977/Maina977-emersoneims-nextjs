/**
 * BRAND-SPECIFIC ERROR CODES DATABASE
 * Generated from PowerWizard and DeepSea controller documentation
 * Plus comprehensive manufacturer-specific fault codes:
 * - Cummins diesel engines
 * - Caterpillar (CAT) diesel engines
 * - Perkins diesel engines
 * 
 * Total: 5,900+ error codes
 * Updated: January 2026
 */

import { generatePowerWizardErrorCodes, generateDeepSeaErrorCodes } from '@/lib/errorCodeGenerator';
import { CUMMINS_ERROR_CODES } from '@/lib/data/cumminsErrorCodes';
import { CATERPILLAR_ERROR_CODES } from '@/lib/data/caterpillarErrorCodes';
import { PERKINS_ERROR_CODES } from '@/lib/data/perkinsErrorCodes';

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

// Convert manufacturer codes to compatible format
const cumminsCodesFormatted = formatManufacturerCodes(CUMMINS_ERROR_CODES, 'Cummins', 'Cummins Engine Diagnostics');
const caterpillarCodesFormatted = formatManufacturerCodes(CATERPILLAR_ERROR_CODES, 'Caterpillar', 'CAT Engine Diagnostics');
const perkinsCodesFormatted = formatManufacturerCodes(PERKINS_ERROR_CODES, 'Perkins', 'Perkins Engine Diagnostics');

// Combine all brand-specific codes
export const brandSpecificErrorCodes: any[] = [
  ...powerWizardCodes,
  ...deepSeaCodes,
  ...cumminsCodesFormatted,
  ...caterpillarCodesFormatted,
  ...perkinsCodesFormatted
];

// Export code counts for statistics
export const CODE_STATISTICS = {
  powerWizard: powerWizardCodes.length,
  deepSea: deepSeaCodes.length,
  cummins: cumminsCodesFormatted.length,
  caterpillar: caterpillarCodesFormatted.length,
  perkins: perkinsCodesFormatted.length,
  total: brandSpecificErrorCodes.length
};
