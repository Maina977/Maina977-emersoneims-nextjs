/**
 * INTEGRATED DIAGNOSTIC SERVICE — server-only orchestration layer
 *
 * Connects:
 * - ECM Database (11+ ECM manufacturers)         — defined in `integratedDiagnosticData.ts`
 * - Controller Database (DSE/ComAp/Woodward/...) — defined in `integratedDiagnosticData.ts`
 * - 451,593 controller fault codes               — `controllerFaultCodes.ts`
 * - AI Diagnostic Engine                          — `ai-diagnostic-engine.ts`
 *
 * Client components MUST NOT import this file directly. They access the heavy
 * operations through `lib/generator-oracle/client/oracleClient.ts` (the typed
 * fetch wrapper for the /api/generator-oracle/* routes), and import the small
 * static catalogues from `integratedDiagnosticData.ts`.
 */

import 'server-only';

import { getFaultByCode, searchFaultCodes as searchEnhancedFaults, type EnhancedFaultCode } from './enhanced-fault-database';
import { COMPREHENSIVE_FAULT_CODES } from './comprehensiveFaultCodes';
import { performAIDiagnosis, performHybridDiagnosis, type GeneratorReadings, type AIAnalysisResult } from './ai-diagnostic-engine';
import { getAIDiagnosis, streamAIDiagnosis, type StreamingDiagnosticEvent } from './aiDiagnosticService';
import {
  getAllFaultCodes,
  searchFaultCodes as searchControllerFaults,
  getFaultCodesByBrand,
  getFaultCodesByModel,
  getFaultCodeById,
  getTotalFaultCodeCount,
  getFaultCodeStats,
  CONTROLLER_BRANDS,
  type ControllerFaultCode,
} from './controllerFaultCodes';
// ECM/Controller catalogues + small types live in the client-safe data file.
// We re-export them from this module for backward compatibility, but new
// client code should import them from `./integratedDiagnosticData` directly.
import {
  ECM_DATABASE,
  CONTROLLER_DATABASE,
  findECM,
  findController,
  getECMFaultCodes,
  getECMManufacturers,
  getControllerBrands,
  getECMsByManufacturer,
  searchECMs,
  type ECMEntry,
  type ControllerInfo,
  type TechnicianInput,
  type IntegratedDiagnosisResult,
} from './integratedDiagnosticData';
export {
  ECM_DATABASE,
  CONTROLLER_DATABASE,
  findECM,
  findController,
  getECMFaultCodes,
  getECMManufacturers,
  getControllerBrands,
  getECMsByManufacturer,
  searchECMs,
};
export type { ECMEntry, ControllerInfo, TechnicianInput, IntegratedDiagnosisResult };

// ═══════════════════════════════════════════════════════════════════════════════
// ECM/Controller catalogues + small types/helpers moved to
// `./integratedDiagnosticData.ts` (client-safe). Imported and re-exported above.
// ═══════════════════════════════════════════════════════════════════════════════


/**
 * Look up fault code across all databases
 */
export function lookupFaultCode(code: string): {
  enhancedFault?: EnhancedFaultCode;
  comprehensiveFault?: typeof COMPREHENSIVE_FAULT_CODES[string];
  ecmFaults: Array<{ ecm: string; code: string; description: string; severity: string }>;
} {
  // Check enhanced fault database
  const enhancedFault = getFaultByCode(code);

  // Check comprehensive fault codes
  const comprehensiveFault = COMPREHENSIVE_FAULT_CODES[code];

  // Check ECM-specific faults
  const ecmFaults: Array<{ ecm: string; code: string; description: string; severity: string }> = [];
  for (const ecm of ECM_DATABASE) {
    for (const faultGroup of ecm.faultCodes) {
      const matchingCode = faultGroup.codes.find(c =>
        c.code.toLowerCase() === code.toLowerCase() ||
        c.code.toLowerCase().includes(code.toLowerCase())
      );
      if (matchingCode) {
        ecmFaults.push({
          ecm: ecm.name,
          ...matchingCode
        });
      }
    }
  }

  return { enhancedFault, comprehensiveFault, ecmFaults };
}

/**
 * Correlate multiple fault codes to find root cause
 */
export function correlateFaultCodes(codes: string[]): {
  correlations: string[];
  rootCauses: Array<{ cause: string; probability: number; affectedCodes: string[] }>;
} {
  const correlations: string[] = [];
  const rootCauses: Array<{ cause: string; probability: number; affectedCodes: string[] }> = [];

  // Define correlation patterns
  const correlationPatterns = [
    {
      pattern: ['SPN-100', 'SPN-110', 'SPN-94'],
      correlation: 'Oil and cooling system interdependency - check water pump and oil cooler',
      rootCause: 'Coolant system failure affecting oil cooling',
      probability: 85
    },
    {
      pattern: ['P0335', 'P0340', 'P0016'],
      correlation: 'Timing system fault - check timing chain/belt and sensors',
      rootCause: 'Timing synchronization loss between crank and cam',
      probability: 90
    },
    {
      pattern: ['SPN-629', 'SPN-627', 'E151'],
      correlation: 'ECM communication failure - check CAN bus wiring and termination',
      rootCause: 'CAN bus communication fault',
      probability: 88
    },
    {
      pattern: ['P0087', 'P0088', 'P0089'],
      correlation: 'Fuel rail pressure system fault - check high pressure pump and rail',
      rootCause: 'High pressure fuel system failure',
      probability: 92
    },
    {
      pattern: ['168-0', '168-1'],
      correlation: 'Battery/charging system issue - check alternator and batteries',
      rootCause: 'Electrical system voltage regulation failure',
      probability: 80
    }
  ];

  // Check for pattern matches
  const upperCodes = codes.map(c => c.toUpperCase());
  for (const pattern of correlationPatterns) {
    const matchCount = pattern.pattern.filter(p =>
      upperCodes.some(c => c.includes(p.toUpperCase()) || p.toUpperCase().includes(c))
    ).length;

    if (matchCount >= 2) {
      correlations.push(pattern.correlation);
      rootCauses.push({
        cause: pattern.rootCause,
        probability: pattern.probability * (matchCount / pattern.pattern.length),
        affectedCodes: codes.filter(c =>
          pattern.pattern.some(p => c.toUpperCase().includes(p.toUpperCase()))
        )
      });
    }
  }

  // Sort by probability
  rootCauses.sort((a, b) => b.probability - a.probability);

  return { correlations, rootCauses };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN INTEGRATED DIAGNOSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform comprehensive integrated diagnosis
 * This is the main entry point that connects ECMs, Controllers, Fault Codes, and AI
 */
export async function performIntegratedDiagnosis(
  input: TechnicianInput
): Promise<IntegratedDiagnosisResult> {
  const timestamp = new Date().toISOString();
  const diagnosisId = `DIAG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Step 1: Find ECM information
  const ecm = findECM(input.ecmManufacturer, input.ecmModel);
  let ecmInfo: IntegratedDiagnosisResult['ecmInfo'];

  if (ecm) {
    const relevantFaultCodes = getECMFaultCodes(ecm.id, input.controllerBrand);
    ecmInfo = {
      ecm,
      relevantFaultCodes,
      diagnosticSteps: ecm.troubleshooting.diagnosticSteps,
      pinoutDiagram: ecm.pinout,
      wiringDiagram: ecm.wiringDiagram,
      requiredTools: ecm.troubleshooting.tools,
      diagnosticSoftware: ecm.diagnosticSoftware || []
    };
  }

  // Step 2: Find controller information
  const controller = findController(input.controllerBrand, input.controllerModel);
  let controllerInfo: IntegratedDiagnosisResult['controllerInfo'];

  if (controller) {
    const compatibleWithECM = ecm ? controller.compatibleECMs.includes(ecm.id) : true;
    controllerInfo = {
      controller,
      compatibleWithECM,
      communicationStatus: compatibleWithECM ? 'verified' : 'needs-check'
    };
  }

  // Step 3: Analyze fault codes
  const faultCodeAnalysis: IntegratedDiagnosisResult['faultCodeAnalysis'] = {
    codesFound: 0,
    codeDetails: [],
    correlatedFaults: [],
    rootCauseProbability: []
  };

  if (input.faultCodes && input.faultCodes.length > 0) {
    for (const code of input.faultCodes) {
      const lookup = lookupFaultCode(code);
      const found = !!(lookup.enhancedFault || lookup.comprehensiveFault || lookup.ecmFaults.length > 0);

      faultCodeAnalysis.codeDetails.push({
        code,
        found,
        faultInfo: lookup.enhancedFault,
        ecmSpecificInfo: lookup.ecmFaults[0],
        severity: lookup.enhancedFault?.severity || lookup.ecmFaults[0]?.severity || 'unknown',
        category: lookup.enhancedFault?.category || 'Unknown'
      });

      if (found) faultCodeAnalysis.codesFound++;
    }

    // Correlate faults
    const { correlations, rootCauses } = correlateFaultCodes(input.faultCodes);
    faultCodeAnalysis.correlatedFaults = correlations;
    faultCodeAnalysis.rootCauseProbability = rootCauses;
  }

  // Step 4: Run AI analysis if readings are provided
  let aiAnalysis: AIAnalysisResult | undefined;

  if (input.readings) {
    try {
      const hybridResult = await performHybridDiagnosis({
        readings: input.readings,
        faultCodes: input.faultCodes,
        controllerBrand: input.controllerBrand
      });
      if (hybridResult.success) {
        aiAnalysis = hybridResult.result;
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    }
  }

  // Step 5: Generate unified solution
  const solution = generateUnifiedSolution(input, ecmInfo, faultCodeAnalysis, aiAnalysis);

  // Step 6: Gather resources
  const resources = gatherResources(ecm, controller, input.engineBrand);

  return {
    timestamp,
    diagnosisId,
    ecmInfo,
    controllerInfo,
    faultCodeAnalysis,
    aiAnalysis,
    solution,
    resources
  };
}

/**
 * Generate unified solution from all analysis sources
 */
function generateUnifiedSolution(
  input: TechnicianInput,
  ecmInfo: IntegratedDiagnosisResult['ecmInfo'],
  faultCodeAnalysis: IntegratedDiagnosisResult['faultCodeAnalysis'],
  aiAnalysis?: AIAnalysisResult
): IntegratedDiagnosisResult['solution'] {
  // Determine primary diagnosis
  let primaryDiagnosis = 'System diagnosis in progress';
  let confidence = 50;

  if (faultCodeAnalysis.rootCauseProbability.length > 0) {
    primaryDiagnosis = faultCodeAnalysis.rootCauseProbability[0].cause;
    confidence = faultCodeAnalysis.rootCauseProbability[0].probability;
  } else if (aiAnalysis?.primaryDiagnosis) {
    primaryDiagnosis = aiAnalysis.primaryDiagnosis.title;
    confidence = aiAnalysis.primaryDiagnosis.confidence;
  } else if (faultCodeAnalysis.codeDetails.length > 0 && faultCodeAnalysis.codeDetails[0].faultInfo) {
    primaryDiagnosis = faultCodeAnalysis.codeDetails[0].faultInfo.title;
    confidence = 75;
  }

  // Compile immediate actions
  const immediateActions: string[] = [];

  if (ecmInfo) {
    immediateActions.push(...ecmInfo.diagnosticSteps.slice(0, 3));
  }

  for (const detail of faultCodeAnalysis.codeDetails) {
    if (detail.faultInfo?.diagnosticProcedures) {
      immediateActions.push(detail.faultInfo.diagnosticProcedures[0]?.instruction || '');
    }
  }

  if (aiAnalysis?.detailedAnalysis[0]?.immediateActions) {
    immediateActions.push(...aiAnalysis.detailedAnalysis[0].immediateActions);
  }

  // Build step-by-step procedure
  const stepByStepProcedure: IntegratedDiagnosisResult['solution']['stepByStepProcedure'] = [];
  let stepNum = 1;

  // Add ECM diagnostic steps
  if (ecmInfo) {
    stepByStepProcedure.push({
      step: stepNum++,
      action: 'Connect Diagnostic Tool',
      details: `Connect ${ecmInfo.diagnosticSoftware.join(' or ')} to ${ecmInfo.ecm.name}`,
      tools: ecmInfo.requiredTools,
      timeEstimate: '5 minutes'
    });
  }

  // Add fault-specific procedures
  for (const detail of faultCodeAnalysis.codeDetails) {
    if (detail.faultInfo?.diagnosticProcedures) {
      for (const proc of detail.faultInfo.diagnosticProcedures.slice(0, 2)) {
        stepByStepProcedure.push({
          step: stepNum++,
          action: proc.title,
          details: proc.instruction,
          safetyWarning: proc.safetyWarning,
          tools: proc.toolsRequired,
          timeEstimate: proc.estimatedTime
        });
      }
    }
  }

  // Add AI-suggested steps
  if (aiAnalysis?.detailedAnalysis[0]?.repairProcedure) {
    for (const step of aiAnalysis.detailedAnalysis[0].repairProcedure.slice(0, 3)) {
      stepByStepProcedure.push({
        step: stepNum++,
        action: step.action,
        details: step.details,
        safetyWarning: step.safetyWarning,
        timeEstimate: step.timeEstimate
      });
    }
  }

  // Compile parts list
  const partsRequired: IntegratedDiagnosisResult['solution']['partsRequired'] = [];

  if (ecmInfo) {
    for (const part of ecmInfo.ecm.partNumbers) {
      partsRequired.push({
        name: part.description,
        partNumber: part.partNumber,
        quantity: 1,
        estimatedCostKES: 15000, // Default estimate
        source: [part.manufacturer, 'Authorized Dealer']
      });
    }
  }

  for (const detail of faultCodeAnalysis.codeDetails) {
    if (detail.faultInfo?.repairProcedures) {
      for (const repair of detail.faultInfo.repairProcedures) {
        for (const part of repair.partsRequired || []) {
          partsRequired.push({
            name: part.name,
            partNumber: part.oemPartNumber,
            quantity: part.quantity,
            estimatedCostKES: part.estimatedCost,
            source: ['OEM Dealer', 'Authorized Parts Supplier']
          });
        }
      }
    }
  }

  // Calculate estimates
  const estimatedRepairTime = aiAnalysis?.detailedAnalysis[0]?.estimatedRepairTime || '2-4 hours';
  const estimatedCostKES = aiAnalysis?.detailedAnalysis[0]?.estimatedCostKES || { min: 5000, max: 50000 };

  // Preventive measures
  const preventiveMeasures: string[] = [];

  for (const detail of faultCodeAnalysis.codeDetails) {
    if (detail.faultInfo?.preventionStrategies) {
      preventiveMeasures.push(...detail.faultInfo.preventionStrategies.slice(0, 2));
    }
  }

  if (ecmInfo) {
    preventiveMeasures.push(`Regular ${ecmInfo.ecm.manufacturer} ECM firmware updates`);
    preventiveMeasures.push(`Scheduled diagnostics using ${ecmInfo.diagnosticSoftware.join(' or ')}`);
  }

  return {
    primaryDiagnosis,
    confidence,
    immediateActions: [...new Set(immediateActions)].filter(Boolean).slice(0, 5),
    stepByStepProcedure,
    partsRequired,
    estimatedRepairTime,
    estimatedCostKES,
    preventiveMeasures: [...new Set(preventiveMeasures)].slice(0, 5)
  };
}

/**
 * Gather relevant resources
 */
function gatherResources(
  ecm?: ECMEntry,
  controller?: ControllerInfo,
  engineBrand?: string
): IntegratedDiagnosisResult['resources'] {
  const resources: IntegratedDiagnosisResult['resources'] = {
    serviceManuals: [],
    technicalBulletins: [],
    trainingVideos: [],
    supportContacts: []
  };

  if (ecm) {
    resources.serviceManuals.push(`${ecm.manufacturer} ${ecm.name} Service Manual`);
    resources.serviceManuals.push(`${ecm.manufacturer} Wiring Diagram Manual`);
    resources.supportContacts.push({
      name: `${ecm.manufacturer} Technical Support`,
      phone: '+1-800-SUPPORT',
      email: `support@${ecm.manufacturer.toLowerCase().replace(' ', '')}.com`
    });
  }

  if (controller) {
    resources.serviceManuals.push(`${controller.name} Configuration Manual`);
    resources.technicalBulletins.push(`${controller.manufacturer} Latest Software Updates`);
  }

  if (engineBrand) {
    resources.serviceManuals.push(`${engineBrand} Engine Service Manual`);
  }

  return resources;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STREAMING AI DIAGNOSIS WITH INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Stream AI diagnosis with ECM and controller context
 */
export async function* streamIntegratedDiagnosis(
  input: TechnicianInput
): AsyncGenerator<StreamingDiagnosticEvent> {
  const ecm = findECM(input.ecmManufacturer, input.ecmModel);
  const controller = findController(input.controllerBrand, input.controllerModel);

  // Stream from AI service - include ECM context in symptoms
  const enhancedSymptoms = [
    input.symptoms,
    ecm ? `ECM: ${ecm.name} (${ecm.manufacturer})` : '',
    controller ? `Controller: ${controller.name}` : '',
    input.faultCodes?.length ? `Fault Codes: ${input.faultCodes.join(', ')}` : ''
  ].filter(Boolean).join('. ');

  const stream = streamAIDiagnosis({
    faultCodes: input.faultCodes || [],
    readings: input.readings || {},
    symptoms: enhancedSymptoms,
    controllerBrand: input.controllerBrand
  });

  for await (const chunk of stream) {
    yield chunk;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED FAULT CODE SEARCH - Combines 400,000+ controller codes with enhanced database
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Search across ALL fault code databases (400,000+ codes)
 * Returns combined results from both controller codes and enhanced descriptions
 */
export function searchAllFaultCodes(query: string, options?: {
  brand?: string;
  model?: string;
  maxResults?: number;
}): {
  controllerCodes: ControllerFaultCode[];
  enhancedCodes: EnhancedFaultCode[];
  totalCount: number;
} {
  const maxResults = options?.maxResults || 100;

  // Search controller fault codes (400,000+)
  let controllerCodes: ControllerFaultCode[] = [];
  if (options?.brand) {
    controllerCodes = getFaultCodesByBrand(options.brand)
      .filter(code =>
        code.code.toLowerCase().includes(query.toLowerCase()) ||
        code.title.toLowerCase().includes(query.toLowerCase()) ||
        code.description.toLowerCase().includes(query.toLowerCase())
      );
  } else if (options?.model) {
    controllerCodes = getFaultCodesByModel(options.model)
      .filter(code =>
        code.code.toLowerCase().includes(query.toLowerCase()) ||
        code.title.toLowerCase().includes(query.toLowerCase()) ||
        code.description.toLowerCase().includes(query.toLowerCase())
      );
  } else {
    controllerCodes = searchControllerFaults(query);
  }

  // Limit results for performance
  controllerCodes = controllerCodes.slice(0, maxResults);

  // Search enhanced fault codes (with detailed descriptions)
  const enhancedCodes = searchEnhancedFaults(query).slice(0, maxResults);

  return {
    controllerCodes,
    enhancedCodes,
    totalCount: controllerCodes.length + enhancedCodes.length
  };
}

/**
 * Get fault code statistics across all databases
 */
export function getAllFaultCodeStats() {
  const controllerStats = getFaultCodeStats();
  return {
    totalCodes: getTotalFaultCodeCount(),
    byBrand: controllerStats.byBrand,
    bySeverity: controllerStats.bySeverity,
    byCategory: controllerStats.byCategory,
    controllerBrands: Object.keys(CONTROLLER_BRANDS)
  };
}

// Re-export all fault code functions for unified access
export {
  // From enhanced-fault-database
  getFaultByCode,
  searchEnhancedFaults,
  // From controllerFaultCodes (400,000+ codes)
  getAllFaultCodes,
  searchControllerFaults,
  getFaultCodesByBrand,
  getFaultCodesByModel,
  getFaultCodeById,
  getTotalFaultCodeCount,
  getFaultCodeStats,
  CONTROLLER_BRANDS,
  // AI functions
  performAIDiagnosis,
  performHybridDiagnosis
};

// Re-export types
export type { ControllerFaultCode } from './controllerFaultCodes';
export type { EnhancedFaultCode } from './enhanced-fault-database';
export type { GeneratorReadings, AIAnalysisResult } from './ai-diagnostic-engine';
export type { StreamingDiagnosticEvent } from './aiDiagnosticService';

// Legacy export for backward compatibility
export const searchFaultCodes = searchEnhancedFaults;

// `getECMManufacturers`, `getControllerBrands`, `getECMsByManufacturer`,
// `searchECMs` were moved to `./integratedDiagnosticData.ts` and are
// re-exported via the top-of-file import block.
