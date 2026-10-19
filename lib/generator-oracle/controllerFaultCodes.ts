/**
 * Generator Oracle - Controller Fault Code Database
 * Hand-written controller alarm descriptions, one entry per brand + code.
 *
 * WHAT IS IN HERE (2026-10-18 tool audit — keep it this way)
 * ==========================================================
 * Only the hand-written entries in ./data/*-fault-codes.ts. Their own headers
 * say the descriptions are INDEPENDENTLY WRITTEN and may differ from the
 * manufacturer's documentation, so they are presented as our guides, never as
 * manufacturer text. Per-model copies are merged (see mergeModelCopies).
 *
 * Removed, and not to be reintroduced:
 *   - generateExtendedCodes(), a template expansion that walked every integer in
 *     ~99 invented ranges x 81 models (397,401 rows). It was the source of the
 *     "400,000+ / 451,593 fault codes" claims. The owner chose an honest count.
 *   - the generated Volvo Penta VODIA block (51,527 rows flagged verified, with
 *     wrong PID meanings) and the wrong CAT PowerWizard SPNs (520-523, 636, 637,
 *     1075, 3510-3512). See the notes in those files.
 *
 * Code numbers: CAT PowerWizard (J1939 SPN/FMI) and VODIA (MID/PID/FMI) use
 * the numbers the equipment reports. The other brands' numbers are our own
 * reference numbers — most of those controllers show a TEXT alarm — and the
 * API marks them codeKind: "reference" so the UI can say so.
 *
 * Covers: DSE, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, ENKO, Volvo Penta VODIA
 *
 * New client components must use:
 *   - `lib/generator-oracle/controllerMeta.ts` for types + brand/category metadata
 *   - `lib/generator-oracle/client/oracleClient.ts` for data access (via APIs)
 *
 * NOTE: a hard `import 'server-only'` directive is intentionally NOT applied
 * here. A handful of legacy panels (CompleteDiagnosticPanel, AIAnalysisPanel,
 * CommunityFaultCodesPanel, ECMDiagnosticsPanel, AdvancedDiagnosticsPanel,
 * UnifiedDiagnosticsPanel, ODIDashboardPanel, ExpertAIChatPanel) still import
 * helpers transitively through `integratedDiagnosticService.ts`. They are
 * code-split via `dynamic()` so they do NOT enter the initial bundle, but
 * marking this module server-only would fail their build. Refactor each of
 * those panels to `oracleClient` to fully eliminate the chain, then add the
 * directive.
 */

// Types and the small static brand/category configuration come from the
// client-safe metadata module and are re-exported for existing callers.
import {
  CONTROLLER_BRANDS,
  FAULT_CATEGORIES,
  type ControllerBrandKey,
  type FaultCategoryKey,
} from './controllerMeta';
export { CONTROLLER_BRANDS, FAULT_CATEGORIES };
export type { ControllerBrandKey, FaultCategoryKey };

// ==================== INTERFACES ====================

export interface TriggerParameter {
  parameter: string;
  condition: 'below' | 'above' | 'equals' | 'range';
  thresholdValue: number;
  unit: string;
  delay: number;
}

export interface PossibleCause {
  likelihood: 'high' | 'medium' | 'low';
  cause: string;
  verification: string;
}

export interface DiagnosticStep {
  step: number;
  action: string;
  expectedResult: string;
  tools?: string[];
}

export interface ResetStep {
  stepNumber: number;
  action: string;
  keySequence?: string[];
  menuPath?: string[];
  expectedResponse: string;
}

export interface ResetPathway {
  method: 'auto' | 'manual' | 'keypad' | 'software';
  applicableFirmware: string[];
  requiresCondition: string[];
  steps: ResetStep[];
  successIndicator: string;
}

// Enhanced Spare Part with OEM details
export interface SparePart {
  name: string;
  partNumber: string;                          // OEM part number
  alternatePartNumbers?: string[];             // Cross-reference numbers
  manufacturer: string;
  category: 'electrical' | 'mechanical' | 'sensor' | 'filter' | 'gasket' | 'belt' | 'bearing' | 'consumable' | 'controller';
  estimatedCost: { min: number; max: number; currency: string };
  leadTime?: string;                           // Typical delivery time
  criticalSpare: boolean;                      // Should be stocked?
  quantity: number;                            // Qty needed for repair
  specifications?: string;                     // Technical specs
  compatibleModels?: string[];                 // Compatible generator models
  suppliers?: { name: string; location: string; contact?: string }[];
}

// Manual Reference for parts and repair
export interface ManualReference {
  type: 'parts' | 'service' | 'operation' | 'troubleshooting' | 'wiring';
  title: string;
  documentNumber?: string;                     // Publication number
  manufacturer: string;
  section: string;                             // Section/chapter
  page?: string;                               // Page number(s)
  figureNumber?: string;                       // Figure/diagram reference
  downloadUrl?: string;                        // If available online
  isbn?: string;
  edition?: string;
  notes?: string;
}

// Controller Navigation - How to access faults on actual hardware
export interface ControllerNavigation {
  brand: string;
  model: string;
  accessPath: {                                // Step by step navigation
    step: number;
    button: string;                            // Button to press
    display: string;                           // What appears on display
    holdTime?: number;                         // Seconds to hold if needed
    notes?: string;
  }[];
  menuPath: string[];                          // Simplified menu breadcrumb
  passwordRequired?: boolean;
  defaultPassword?: string;
  firmwareNotes?: string;
  alternativeMethod?: string;                  // Via software/PC connection
  screenshotUrl?: string;
}

// Verification Steps - Confirm issue is resolved
export interface VerificationStep {
  step: number;
  action: string;
  expectedResult: string;
  measurement?: {
    parameter: string;
    expectedValue: string;
    unit: string;
    tolerance?: string;
  };
  waitTime?: number;                           // Seconds to wait
  tools?: string[];
  failureAction: string;                       // What to do if verification fails
  passIndicator: string;                       // Clear sign that step passed
}

// Required Tools with specifications
export interface RequiredTool {
  name: string;
  specification?: string;                      // Size, rating, etc
  category: 'hand' | 'power' | 'diagnostic' | 'safety' | 'special' | 'calibration' | 'consumable';
  essential: boolean;                          // Can't do job without it
  alternativeTools?: string[];                 // Acceptable substitutes
  rentalAvailable?: boolean;
  estimatedCost?: { min: number; max: number; currency: string };
}

export interface Solution {
  difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
  timeEstimate: string;
  procedureSteps: string[];
  tools: string[];
  parts: string[];
  estimatedCost: { min: number; max: number; currency: string };
  // Enhanced fields
  spareParts?: SparePart[];                    // Detailed parts with part numbers
  requiredTools?: RequiredTool[];              // Tools with specifications
  manualReferences?: ManualReference[];        // Where to find in manuals
  controllerNavigation?: ControllerNavigation; // How to navigate controller
  verificationSteps?: VerificationStep[];      // Confirm repair success
  safetyPrecautions?: string[];               // Job-specific safety
  technicianLevel?: 'apprentice' | 'journeyman' | 'master' | 'specialist';
  certificationRequired?: string[];            // Required certs
  specialNotes?: string;                       // Important considerations
}

export interface ControllerFaultCode {
  id: string;
  code: string;
  brand: string;
  model: string;
  /** Every controller model this code applies to (set when per-model copies are merged). */
  models?: string[];
  firmwareVersions: string[];
  category: string;
  subcategory: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  alarmType: 'warning' | 'trip' | 'shutdown' | 'lockout';
  title: string;
  description: string;
  triggerParameters: TriggerParameter[];
  symptoms: string[];
  possibleCauses: PossibleCause[];
  diagnosticSteps: DiagnosticStep[];
  resetPathways: ResetPathway[];
  solutions: Solution[];
  safetyWarnings: string[];
  preventiveMeasures: string[];
  interactiveQuestions?: string[]; // Interactive follow-up questions for technician guidance
  verified: boolean;
  lastUpdated: string;
}

// CONTROLLER_BRANDS and FAULT_CATEGORIES are exported from controllerMeta.ts
// and re-exported at the top of this file. Keeping them in a single module
// guarantees the client gets identical typed metadata without pulling in any
// of the brand-curated data files below.

// ==================== IMPORT BRAND-SPECIFIC CODES ====================

import { getDSEFaultCodes } from './data/dse-fault-codes';
import { getComApFaultCodes } from './data/comap-fault-codes';
import { getWoodwardFaultCodes } from './data/woodward-fault-codes';
import { getSmartGenFaultCodes } from './data/smartgen-fault-codes';
import { getPowerWizardFaultCodes } from './data/powerwizard-fault-codes';
import { getDatakomFaultCodes } from './data/datakom-fault-codes';
import { getLovatoFaultCodes } from './data/lovato-fault-codes';
import { getSiemensFaultCodes } from './data/siemens-fault-codes';
import { getEnkoFaultCodes } from './data/enko-fault-codes';
import { getVODIAFaultCodes } from './data/vodia-fault-codes';

// ==================== MAIN DATABASE ====================

let _allFaultCodes: ControllerFaultCode[] | null = null;

/**
 * One entry per brand + code (2026-10-18 tool audit).
 *
 * The brand files emit one row per (code x applicable model), so DeepSea's 63
 * alarms were stored as 630 rows and a search for one alarm showed five
 * identical results. Rows are merged here: the first row is kept, its
 * "<model>: " description prefix is dropped, and every model it applies to is
 * listed in `models` (and joined into `model` for older consumers). Measured
 * before merging: no brand uses one code for two different meanings, so
 * nothing is lost.
 */
function mergeModelCopies(codes: ControllerFaultCode[]): ControllerFaultCode[] {
  const byKey = new Map<string, ControllerFaultCode>();
  for (const c of codes) {
    const key = `${c.brand}|${c.code}`;
    const hit = byKey.get(key);
    if (!hit) {
      const prefix = `${c.model}: `;
      byKey.set(key, {
        ...c,
        models: [c.model],
        description: c.description.startsWith(prefix) ? c.description.slice(prefix.length) : c.description,
      });
    } else if (!hit.models!.includes(c.model)) {
      hit.models!.push(c.model);
    }
  }
  const out = [...byKey.values()];
  for (const c of out) c.model = c.models!.join(', ');
  return out;
}

// Lazy-loaded brand code caches
const _brandCodeCache: Map<string, ControllerFaultCode[]> = new Map();

// Brand to loader function mapping for lazy loading
const BRAND_LOADERS: Record<string, () => ControllerFaultCode[]> = {
  // DSE / DeepSea Electronics
  'DSE': getDSEFaultCodes,
  'DeepSea': getDSEFaultCodes,
  'DEEPSEA': getDSEFaultCodes,
  // ComAp
  'COMAP': getComApFaultCodes,
  'ComAp': getComApFaultCodes,
  // Woodward
  'WOODWARD': getWoodwardFaultCodes,
  'Woodward': getWoodwardFaultCodes,
  // SmartGen
  'SMARTGEN': getSmartGenFaultCodes,
  'SmartGen': getSmartGenFaultCodes,
  // CAT / PowerWizard
  'POWERWIZARD': getPowerWizardFaultCodes,
  'PowerWizard': getPowerWizardFaultCodes,
  'CAT': getPowerWizardFaultCodes,
  'CAT_POWERWIZARD': getPowerWizardFaultCodes,
  // Datakom
  'DATAKOM': getDatakomFaultCodes,
  'Datakom': getDatakomFaultCodes,
  // Lovato
  'LOVATO': getLovatoFaultCodes,
  'Lovato': getLovatoFaultCodes,
  // Siemens
  'SIEMENS': getSiemensFaultCodes,
  'Siemens': getSiemensFaultCodes,
  // Enko
  'ENKO': getEnkoFaultCodes,
  'Enko': getEnkoFaultCodes,
  // VODIA / Volvo
  'VODIA': getVODIAFaultCodes,
  'Volvo': getVODIAFaultCodes,
  'VOLVO': getVODIAFaultCodes,
};

/**
 * Lazy load fault codes for a specific brand
 * More memory efficient than loading all codes at once
 */
export function loadFaultCodesByBrand(brand: string): ControllerFaultCode[] {
  const normalizedBrand = brand.toUpperCase();

  // Check cache first
  if (_brandCodeCache.has(normalizedBrand)) {
    return _brandCodeCache.get(normalizedBrand)!;
  }

  // Find matching loader
  const loader = BRAND_LOADERS[brand] || BRAND_LOADERS[normalizedBrand];
  if (loader) {
    const codes = mergeModelCopies(loader());
    _brandCodeCache.set(normalizedBrand, codes);
    return codes;
  }

  // Fallback: search all codes (loads everything)
  return getAllFaultCodes().filter(code =>
    code.brand.toLowerCase().includes(brand.toLowerCase())
  );
}

export function getAllFaultCodes(): ControllerFaultCode[] {
  if (!_allFaultCodes) {
    const dseCodes = getDSEFaultCodes();
    const comapCodes = getComApFaultCodes();
    const woodwardCodes = getWoodwardFaultCodes();
    const smartgenCodes = getSmartGenFaultCodes();
    const pwCodes = getPowerWizardFaultCodes();
    const datakomCodes = getDatakomFaultCodes();
    const lovatoCodes = getLovatoFaultCodes();
    const siemensCodes = getSiemensFaultCodes();
    const enkoCodes = getEnkoFaultCodes();
    const vodiaCodes = getVODIAFaultCodes();

    _allFaultCodes = mergeModelCopies([
      ...dseCodes,
      ...comapCodes,
      ...woodwardCodes,
      ...smartgenCodes,
      ...pwCodes,
      ...datakomCodes,
      ...lovatoCodes,
      ...siemensCodes,
      ...enkoCodes,
      ...vodiaCodes,
    ]);
  }
  return _allFaultCodes;
}

export function getFaultCodesByBrand(brand: string): ControllerFaultCode[] {
  // Use lazy loading when possible for memory efficiency
  return loadFaultCodesByBrand(brand);
}

export function getFaultCodesByModel(model: string): ControllerFaultCode[] {
  return getAllFaultCodes().filter(code =>
    code.model.toLowerCase().includes(model.toLowerCase())
  );
}

export function searchFaultCodes(query: string): ControllerFaultCode[] {
  const q = query.toLowerCase();
  return getAllFaultCodes().filter(code =>
    code.code.toLowerCase().includes(q) ||
    code.title.toLowerCase().includes(q) ||
    code.description.toLowerCase().includes(q) ||
    code.brand.toLowerCase().includes(q) ||
    code.model.toLowerCase().includes(q) ||
    code.category.toLowerCase().includes(q)
  );
}

export function getFaultCodeById(id: string): ControllerFaultCode | undefined {
  return getAllFaultCodes().find(code => code.id === id);
}

export function getTotalFaultCodeCount(): number {
  return getAllFaultCodes().length;
}

export function getFaultCodeStats(): {
  total: number;
  byBrand: Record<string, number>;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
} {
  const codes = getAllFaultCodes();
  const byBrand: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  codes.forEach(code => {
    byBrand[code.brand] = (byBrand[code.brand] || 0) + 1;
    bySeverity[code.severity] = (bySeverity[code.severity] || 0) + 1;
    byCategory[code.category] = (byCategory[code.category] || 0) + 1;
  });

  return {
    total: codes.length,
    byBrand,
    bySeverity,
    byCategory
  };
}
