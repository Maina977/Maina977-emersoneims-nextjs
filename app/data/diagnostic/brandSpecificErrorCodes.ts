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
 * Total: 9,000+ error codes (growing database)
 * Updated: January 2026
 */

// NOTE: PowerWizard and DeepSea codes were previously pulled from
// lib/errorCodeGenerator.ts. That module did not contain real controller data —
// it generated code numbers sequentially (i + 100) and assigned meanings by
// `issues[idx % issues.length]`, so every 20th code number shared a meaning and
// no number corresponded to anything a technician could verify against an OEM
// manual. It has been removed. Only verified, hand-curated codes are served.
import { CUMMINS_ERROR_CODES } from '@/lib/data/cumminsErrorCodes';
import { CATERPILLAR_ERROR_CODES } from '@/lib/data/caterpillarErrorCodes';
import { PERKINS_ERROR_CODES } from '@/lib/data/perkinsErrorCodes';
import { GENERATOR_ERROR_CODES } from '@/lib/data/generatorErrorCodes';
import { VERIFIED_FAULT_CODES } from '@/lib/data/verifiedFaultCodes';
import { CURATED_FAULT_CODES } from '@/lib/data/curatedFaultCodes';

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

// Combine all brand-specific codes
// Curated CSV-sourced codes (lib/data/fault-codes-raw.csv via
// scripts/buildVerifiedFaultCodes.mjs). Real brand/model/code/description data
// that had never been wired into the app.
//
// severity is deliberately 'UNSPECIFIED'. The source carries no severity rating
// and inventing one is precisely how this system previously told a technician
// that low oil pressure was LOW severity. An unrated code must render as
// unrated.
const verifiedCsvCodes = VERIFIED_FAULT_CODES.map(c => ({
  code: c.code,
  brand: c.brand,
  model: c.model || 'All Models',
  service: `${c.brand} Generator Diagnostics`,
  category: 'Fault Code',
  issue: c.description,
  severity: 'UNSPECIFIED',
  symptoms: [],
  causes: c.causes,
  solution: c.remedies.join('; '),
  parts: [],
  tools: [],
  downtime: '',
  preventive: '',
  verified: true
}));

export const brandSpecificErrorCodes: any[] = [
  ...detailedGeneratorCodes,
  ...cumminsCodesFormatted,
  ...caterpillarCodesFormatted,
  ...perkinsCodesFormatted,
  ...verifiedCsvCodes,
  // Hand-written controller families (DSE, ComAp, Woodward, SmartGen,
  // PowerWizard, Datakom, Lovato, Siemens, Enko, Vodia) and solar
  // inverter/battery codes. These carry per-code severities assigned by hand,
  // so their severity is preserved rather than blanked.
  ...CURATED_FAULT_CODES
];

// Export code counts for statistics
export const CODE_STATISTICS = {
  detailedGeneratorCodes: detailedGeneratorCodes.length,
  cummins: cumminsCodesFormatted.length,
  caterpillar: caterpillarCodesFormatted.length,
  perkins: perkinsCodesFormatted.length,
  verifiedCsv: verifiedCsvCodes.length,
  curatedControllerAndSolar: CURATED_FAULT_CODES.length,
  total: brandSpecificErrorCodes.length
};
