/**
 * Generator Oracle - Fault to Repair Integration
 * Connects 400K+ fault codes with comprehensive repair data
 *
 * OUTSMART COMPETITORS BY BEING THOROUGH
 */

import type {
  ControllerFaultCode,
  Solution,
  SparePart,
  RequiredTool,
  ManualReference,
  ControllerNavigation,
  VerificationStep
} from './controllerFaultCodes';

import {
  ENGINE_SPARE_PARTS,
  CONTROLLER_SPARE_PARTS,
  ELECTRICAL_SPARE_PARTS,
  DIAGNOSTIC_TOOLS,
  MANUAL_REFERENCES,
  CONTROLLER_NAVIGATION,
  VERIFICATION_STEPS,
  SPARE_PARTS_PAGES,
  PARTS_ORDER_INFO,
  getSparePartsForFault,
  getToolsForRepair,
  getManualReferences,
  getControllerNavigation,
  getVerificationSteps,
  getPartsPageForCategory
} from './data/spare-parts-database';

// ==================== COMPREHENSIVE REPAIR INFO ====================

export interface ComprehensiveRepairInfo {
  faultCode: string;
  faultDescription: string;
  severity: string;
  category: string;
  subcategory: string;

  // Diagnosis
  symptoms: string[];
  possibleCauses: { likelihood: string; cause: string; verification: string }[];
  diagnosticSteps: { step: number; action: string; expectedResult: string; tools?: string[] }[];

  // Parts with full details
  requiredParts: {
    part: SparePart;
    purpose: string;
    urgency: 'immediate' | 'recommended' | 'optional';
  }[];
  totalPartsCost: { min: number; max: number; currency: string };

  // Tools
  requiredTools: RequiredTool[];
  toolsCost: { min: number; max: number; currency: string };

  // Manuals
  manualReferences: ManualReference[];

  // Controller Navigation
  navigationToViewFault: ControllerNavigation | null;
  navigationToResetFault: ControllerNavigation | null;

  // Repair Procedure
  repairSteps: string[];
  estimatedTime: string;
  difficultyLevel: string;
  technicianLevel: string;

  // Verification
  verificationSteps: VerificationStep[];

  // Safety
  safetyWarnings: string[];
  certificationRequired: string[];

  // Internal Parts Pages (SEO)
  partsPage: { name: string; url: string; description: string };
  orderInfo: typeof PARTS_ORDER_INFO;

  // Cost Summary
  totalEstimatedCost: { min: number; max: number; currency: string };
  laborCost: { min: number; max: number; currency: string };
}

// ==================== FAULT TO REPAIR MAPPING ====================

const CATEGORY_TO_REPAIR_TYPE: Record<string, string> = {
  'Oil Pressure': 'oil_pressure_repair',
  'Coolant': 'coolant_system_repair',
  'Temperature': 'coolant_system_repair',
  'Electrical': 'electrical_repair',
  'Voltage': 'electrical_repair',
  'Current': 'electrical_repair',
  'Frequency': 'electrical_repair',
  'Starting': 'oil_pressure_repair',
  'Speed': 'oil_pressure_repair',
  'Fuel': 'oil_pressure_repair'
};

const CATEGORY_TO_TOOLS: Record<string, string> = {
  'Oil Pressure': 'oil_pressure',
  'Coolant': 'coolant_system',
  'Temperature': 'coolant_system',
  'Engine': 'oil_pressure',
  'Electrical': 'electrical_system',
  'Control': 'controller_diagnostic',
  'Communication': 'controller_diagnostic',
  'Synchronization': 'electrical_system'
};

const CONTROLLER_TO_NAVIGATION_PREFIX: Record<string, string> = {
  'DSE': 'dse_7320',
  'ComAp': 'comap_intelilite',
  'SmartGen': 'smartgen_hgm9500',
  'DATAKOM': 'datakom_d500',
  'CAT PowerWizard': 'powerwizard'
};

// ==================== MAIN INTEGRATION FUNCTION ====================

export function getComprehensiveRepairInfo(
  faultCode: ControllerFaultCode,
  controllerBrand: string
): ComprehensiveRepairInfo {
  const category = faultCode.category;
  const subcategory = faultCode.subcategory;

  // Get relevant spare parts
  const relevantParts = getSparePartsForFault(category, subcategory);
  const partsWithPurpose = relevantParts.map(part => ({
    part,
    purpose: getPurposeForPart(part, subcategory),
    urgency: getUrgencyForPart(part, faultCode.severity) as 'immediate' | 'recommended' | 'optional'
  }));

  // Calculate parts cost
  const totalPartsCost = relevantParts.reduce(
    (acc, part) => ({
      min: acc.min + part.estimatedCost.min * part.quantity,
      max: acc.max + part.estimatedCost.max * part.quantity,
      currency: 'USD'
    }),
    { min: 0, max: 0, currency: 'USD' }
  );

  // Get required tools
  const toolType = CATEGORY_TO_TOOLS[category] || CATEGORY_TO_TOOLS[subcategory] || 'oil_pressure';
  const requiredTools = DIAGNOSTIC_TOOLS[toolType] || [];
  const toolsCost = requiredTools
    .filter(t => t.estimatedCost)
    .reduce(
      (acc, t) => ({
        min: acc.min + (t.estimatedCost?.min || 0),
        max: acc.max + (t.estimatedCost?.max || 0),
        currency: 'USD'
      }),
      { min: 0, max: 0, currency: 'USD' }
    );

  // Get manual references
  const engineType = getEngineTypeFromModel(faultCode.model);
  const manualRefs = [...(MANUAL_REFERENCES[engineType] || []), ...(MANUAL_REFERENCES[`${controllerBrand.toLowerCase()}_controller`] || [])];

  // Get controller navigation
  const navPrefix = CONTROLLER_TO_NAVIGATION_PREFIX[controllerBrand] || 'dse_7320';
  const navigationToView = CONTROLLER_NAVIGATION[`${navPrefix}_view_alarms`] || null;
  const navigationToReset = CONTROLLER_NAVIGATION[`${navPrefix}_reset_alarm`] || null;

  // Get verification steps
  const repairType = CATEGORY_TO_REPAIR_TYPE[subcategory] || CATEGORY_TO_REPAIR_TYPE[category] || 'controller_alarm_reset';
  const verificationSteps = VERIFICATION_STEPS[repairType] || VERIFICATION_STEPS['controller_alarm_reset'];

  // Calculate labor cost based on difficulty
  const laborCost = calculateLaborCost(faultCode.solutions[0]?.difficulty || 'moderate');

  // Get internal parts page (SEO - links to our own spare parts catalog)
  const partsPage = getPartsPageForCategory(subcategory || category);

  // Calculate total cost
  const totalEstimatedCost = {
    min: totalPartsCost.min + laborCost.min,
    max: totalPartsCost.max + laborCost.max,
    currency: 'USD'
  };

  return {
    faultCode: faultCode.code,
    faultDescription: faultCode.description,
    severity: faultCode.severity,
    category,
    subcategory,

    symptoms: faultCode.symptoms,
    possibleCauses: faultCode.possibleCauses.map(c => ({
      likelihood: c.likelihood,
      cause: c.cause,
      verification: c.verification
    })),
    diagnosticSteps: faultCode.diagnosticSteps,

    requiredParts: partsWithPurpose,
    totalPartsCost,

    requiredTools,
    toolsCost,

    manualReferences: manualRefs,

    navigationToViewFault: navigationToView,
    navigationToResetFault: navigationToReset,

    repairSteps: faultCode.solutions[0]?.procedureSteps || [],
    estimatedTime: faultCode.solutions[0]?.timeEstimate || '1-2 hours',
    difficultyLevel: faultCode.solutions[0]?.difficulty || 'moderate',
    technicianLevel: getTechnicianLevel(faultCode.solutions[0]?.difficulty),

    verificationSteps,

    safetyWarnings: faultCode.safetyWarnings,
    certificationRequired: getCertificationRequired(category, subcategory),

    // Internal spare parts pages (SEO)
    partsPage,
    orderInfo: PARTS_ORDER_INFO,

    totalEstimatedCost,
    laborCost
  };
}

// ==================== AI ANALYZER ENHANCED RESPONSE ====================

export interface EnhancedDiagnosticResponse {
  problem: string;
  diagnosis: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Root cause analysis
  rootCauseAnalysis: {
    mostLikely: string;
    probability: number;
    verification: string;
  }[];

  // Complete repair package
  repairPackage: {
    immediateActions: string[];
    stepByStepRepair: {
      step: number;
      action: string;
      tools: string[];
      time: string;
      notes: string;
    }[];
    partsRequired: {
      name: string;
      partNumber: string;
      quantity: number;
      cost: string;
      supplier: string;
    }[];
    toolsRequired: {
      name: string;
      specification: string;
      essential: boolean;
    }[];
  };

  // Controller-specific info
  controllerGuidance: {
    howToViewAlarm: string[];
    howToResetAlarm: string[];
    passwordRequired: boolean;
    defaultPassword?: string;
  };

  // Documentation references
  documentation: {
    partsManual: { title: string; section: string; page: string } | null;
    serviceManual: { title: string; section: string; page: string } | null;
    troubleshootingGuide: { title: string; section: string } | null;
  };

  // Verification
  verificationChecklist: {
    step: number;
    check: string;
    expectedResult: string;
    passIndicator: string;
  }[];

  // Cost breakdown
  costBreakdown: {
    parts: { min: number; max: number };
    labor: { min: number; max: number };
    total: { min: number; max: number };
    currency: string;
  };

  // Safety
  safetyWarnings: string[];

  // Internal Spare Parts Links (SEO)
  sparePartsLinks: {
    mainPage: string;
    categoryPage: { name: string; url: string };
    quotePage: string;
  };

  // Timestamp
  generatedAt: Date;
}

export function generateEnhancedDiagnosticResponse(
  problem: string,
  controllerBrand: string,
  controllerModel: string,
  analysisResult: {
    diagnosis: string;
    possibleCauses: string[];
    recommendedActions: string[];
    urgency: string;
    faultCode?: ControllerFaultCode;
  }
): EnhancedDiagnosticResponse {
  const faultCode = analysisResult.faultCode;
  const repairInfo = faultCode ? getComprehensiveRepairInfo(faultCode, controllerBrand) : null;

  // Build root cause analysis
  const rootCauseAnalysis = analysisResult.possibleCauses.slice(0, 5).map((cause, idx) => ({
    mostLikely: cause,
    probability: Math.max(20, 90 - idx * 15),
    verification: getVerificationForCause(cause)
  }));

  // Build repair package
  const repairPackage = {
    immediateActions: analysisResult.recommendedActions.slice(0, 3),
    stepByStepRepair: generateStepByStepRepair(problem, analysisResult),
    partsRequired: repairInfo?.requiredParts.map(p => ({
      name: p.part.name,
      partNumber: p.part.partNumber,
      quantity: p.part.quantity,
      cost: `$${p.part.estimatedCost.min}-${p.part.estimatedCost.max}`,
      supplier: p.part.suppliers?.[0]?.name || 'Local supplier'
    })) || [],
    toolsRequired: repairInfo?.requiredTools.map(t => ({
      name: t.name,
      specification: t.specification || '',
      essential: t.essential
    })) || []
  };

  // Build controller guidance
  const navPrefix = CONTROLLER_TO_NAVIGATION_PREFIX[controllerBrand] || 'dse_7320';
  const viewNav = CONTROLLER_NAVIGATION[`${navPrefix}_view_alarms`];
  const resetNav = CONTROLLER_NAVIGATION[`${navPrefix}_reset_alarm`];

  const controllerGuidance = {
    howToViewAlarm: viewNav?.accessPath.map(s => `${s.step}. ${s.button} → ${s.display}`) || [
      '1. Press MENU button',
      '2. Navigate to ALARMS',
      '3. Select ACTIVE ALARMS'
    ],
    howToResetAlarm: resetNav?.accessPath.map(s => `${s.step}. ${s.button} → ${s.display}`) || [
      '1. Set mode to OFF/STOP',
      '2. Press and hold RESET for 3 seconds',
      '3. Wait for confirmation beep'
    ],
    passwordRequired: resetNav?.passwordRequired || false,
    defaultPassword: resetNav?.defaultPassword
  };

  // Build documentation references
  const documentation = {
    partsManual: repairInfo?.manualReferences.find(m => m.type === 'parts')
      ? {
          title: repairInfo.manualReferences.find(m => m.type === 'parts')!.title,
          section: repairInfo.manualReferences.find(m => m.type === 'parts')!.section,
          page: repairInfo.manualReferences.find(m => m.type === 'parts')!.page || 'See section'
        }
      : null,
    serviceManual: repairInfo?.manualReferences.find(m => m.type === 'service')
      ? {
          title: repairInfo.manualReferences.find(m => m.type === 'service')!.title,
          section: repairInfo.manualReferences.find(m => m.type === 'service')!.section,
          page: repairInfo.manualReferences.find(m => m.type === 'service')!.page || 'See section'
        }
      : null,
    troubleshootingGuide: repairInfo?.manualReferences.find(m => m.type === 'troubleshooting')
      ? {
          title: repairInfo.manualReferences.find(m => m.type === 'troubleshooting')!.title,
          section: repairInfo.manualReferences.find(m => m.type === 'troubleshooting')!.section
        }
      : null
  };

  // Build verification checklist
  const verificationChecklist = repairInfo?.verificationSteps.slice(0, 5).map(v => ({
    step: v.step,
    check: v.action,
    expectedResult: v.expectedResult,
    passIndicator: v.passIndicator
  })) || [
    { step: 1, check: 'Verify root cause addressed', expectedResult: 'Problem fixed', passIndicator: 'No symptoms present' },
    { step: 2, check: 'Reset alarm on controller', expectedResult: 'Alarm clears', passIndicator: 'No active alarms' },
    { step: 3, check: 'Test run generator', expectedResult: 'Normal operation', passIndicator: 'All parameters normal' }
  ];

  // Build cost breakdown
  const laborCost = calculateLaborCost(repairInfo?.difficultyLevel || 'moderate');
  const costBreakdown = {
    parts: repairInfo?.totalPartsCost || { min: 50, max: 200 },
    labor: laborCost,
    total: {
      min: (repairInfo?.totalPartsCost?.min || 50) + laborCost.min,
      max: (repairInfo?.totalPartsCost?.max || 200) + laborCost.max
    },
    currency: 'USD'
  };

  // Internal spare parts links (SEO - all links go to our website)
  const categoryPage = repairInfo?.partsPage || SPARE_PARTS_PAGES.all;
  const sparePartsLinks = {
    mainPage: PARTS_ORDER_INFO.mainPage,
    categoryPage: { name: categoryPage.name, url: categoryPage.url },
    quotePage: PARTS_ORDER_INFO.quotePage
  };

  return {
    problem,
    diagnosis: analysisResult.diagnosis,
    confidence: calculateConfidence(analysisResult),
    severity: mapUrgencyToSeverity(analysisResult.urgency),

    rootCauseAnalysis,
    repairPackage,
    controllerGuidance,
    documentation,
    verificationChecklist,
    costBreakdown,
    safetyWarnings: repairInfo?.safetyWarnings || [
      '⚠️ Always disconnect power before working on electrical systems',
      '⚠️ Allow engine to cool before working on cooling/exhaust systems',
      '⚠️ Wear appropriate PPE for the task'
    ],
    sparePartsLinks,
    generatedAt: new Date()
  };
}

// ==================== HELPER FUNCTIONS ====================

function getPurposeForPart(part: SparePart, subcategory: string): string {
  const purposes: Record<string, string> = {
    sensor: `Replace faulty ${subcategory.toLowerCase()} sensor`,
    filter: 'Replace contaminated filter element',
    mechanical: 'Replace worn mechanical component',
    electrical: 'Replace failed electrical component',
    consumable: 'Service consumable item',
    belt: 'Replace worn or damaged belt',
    gasket: 'Seal component after disassembly',
    bearing: 'Replace worn bearing'
  };
  return purposes[part.category] || 'Component replacement';
}

function getUrgencyForPart(part: SparePart, severity: string): string {
  if (part.criticalSpare && (severity === 'shutdown' || severity === 'critical')) {
    return 'immediate';
  }
  if (part.criticalSpare) {
    return 'recommended';
  }
  return 'optional';
}

function getEngineTypeFromModel(model: string): string {
  if (model.toLowerCase().includes('perkins') || model.includes('403') || model.includes('404')) {
    return 'perkins_400';
  }
  if (model.toLowerCase().includes('cummins') || model.toLowerCase().includes('qsb')) {
    return 'cummins_qsb';
  }
  if (model.toLowerCase().includes('cat') || model.toLowerCase().includes('c4')) {
    return 'cat_c4';
  }
  return 'perkins_400'; // Default
}

function calculateLaborCost(difficulty: string): { min: number; max: number; currency: string } {
  const laborRates: Record<string, { min: number; max: number }> = {
    easy: { min: 30, max: 60 },
    moderate: { min: 60, max: 150 },
    advanced: { min: 150, max: 350 },
    expert: { min: 350, max: 800 }
  };
  const rate = laborRates[difficulty] || laborRates.moderate;
  return { ...rate, currency: 'USD' };
}

function getTechnicianLevel(difficulty?: string): string {
  const levels: Record<string, string> = {
    easy: 'Apprentice or DIY',
    moderate: 'Journeyman Technician',
    advanced: 'Master Technician',
    expert: 'Specialist / OEM Trained'
  };
  return levels[difficulty || 'moderate'] || 'Journeyman Technician';
}

function getCertificationRequired(category: string, subcategory: string): string[] {
  const certs: string[] = [];

  if (category === 'Electrical' || subcategory.includes('Voltage') || subcategory.includes('High')) {
    certs.push('Electrical License (where required)');
    certs.push('Arc Flash Training');
  }
  if (subcategory.includes('Refrigerant') || category.includes('HVAC')) {
    certs.push('EPA Section 608 Certification');
  }
  if (category === 'Engine' || subcategory.includes('ECU')) {
    certs.push('Manufacturer-specific training recommended');
  }

  return certs;
}

function getVerificationForCause(cause: string): string {
  // Generate contextual verification based on cause keywords
  const lowerCause = cause.toLowerCase();

  if (lowerCause.includes('sensor')) {
    return 'Compare sensor reading with mechanical gauge. Check sensor resistance vs. spec';
  }
  if (lowerCause.includes('low') && lowerCause.includes('level')) {
    return 'Physically check fluid level on dipstick or sight glass';
  }
  if (lowerCause.includes('filter')) {
    return 'Inspect filter condition. Check hours since last change';
  }
  if (lowerCause.includes('wire') || lowerCause.includes('connection')) {
    return 'Inspect wiring for damage. Test continuity and resistance';
  }
  if (lowerCause.includes('belt')) {
    return 'Inspect belt for wear, cracks, glazing. Check tension';
  }
  if (lowerCause.includes('pump')) {
    return 'Check pump output pressure/flow. Listen for bearing noise';
  }

  return 'Verify condition matches the suspected cause before repair';
}

function generateStepByStepRepair(
  problem: string,
  analysis: { diagnosis: string; recommendedActions: string[] }
): { step: number; action: string; tools: string[]; time: string; notes: string }[] {
  const steps: { step: number; action: string; tools: string[]; time: string; notes: string }[] = [];

  // Always start with safety
  steps.push({
    step: 1,
    action: 'Ensure generator is stopped and safe to work on',
    tools: ['Lockout/tagout kit'],
    time: '2 min',
    notes: 'Verify no voltage present before touching any electrical components'
  });

  // Add diagnostic step
  steps.push({
    step: 2,
    action: 'Confirm and document the fault condition',
    tools: ['Multimeter', 'Notepad', 'Camera for documentation'],
    time: '5 min',
    notes: 'Record fault code, readings, and any visible issues'
  });

  // Add recommended actions as steps
  analysis.recommendedActions.forEach((action, idx) => {
    steps.push({
      step: idx + 3,
      action: action,
      tools: getToolsForAction(action),
      time: estimateTimeForAction(action),
      notes: getNotesForAction(action)
    });
  });

  // Add verification step
  steps.push({
    step: steps.length + 1,
    action: 'Verify repair and clear alarm from controller',
    tools: ['Controller display'],
    time: '5 min',
    notes: 'Ensure fault condition is resolved before reset'
  });

  // Add test run step
  steps.push({
    step: steps.length + 1,
    action: 'Test run generator and monitor for normal operation',
    tools: ['Clamp meter', 'Thermometer'],
    time: '15 min',
    notes: 'Run under load if possible to fully verify repair'
  });

  return steps;
}

function getToolsForAction(action: string): string[] {
  const lowerAction = action.toLowerCase();
  const tools: string[] = [];

  if (lowerAction.includes('check') || lowerAction.includes('measure')) {
    tools.push('Multimeter');
  }
  if (lowerAction.includes('oil') || lowerAction.includes('pressure')) {
    tools.push('Pressure gauge');
  }
  if (lowerAction.includes('temperature') || lowerAction.includes('coolant')) {
    tools.push('Infrared thermometer');
  }
  if (lowerAction.includes('replace') || lowerAction.includes('remove')) {
    tools.push('Socket set', 'Wrench set');
  }
  if (lowerAction.includes('filter')) {
    tools.push('Filter wrench', 'Drain pan');
  }
  if (lowerAction.includes('wire') || lowerAction.includes('connection')) {
    tools.push('Wire strippers', 'Crimping tool', 'Heat shrink');
  }

  return tools.length > 0 ? tools : ['Basic hand tools'];
}

function estimateTimeForAction(action: string): string {
  const lowerAction = action.toLowerCase();

  if (lowerAction.includes('check') || lowerAction.includes('inspect')) {
    return '5-10 min';
  }
  if (lowerAction.includes('replace filter')) {
    return '15-30 min';
  }
  if (lowerAction.includes('replace sensor')) {
    return '20-45 min';
  }
  if (lowerAction.includes('replace pump')) {
    return '1-2 hours';
  }
  if (lowerAction.includes('repair wire') || lowerAction.includes('connection')) {
    return '15-45 min';
  }
  if (lowerAction.includes('adjust')) {
    return '10-20 min';
  }

  return '15-30 min';
}

function getNotesForAction(action: string): string {
  const lowerAction = action.toLowerCase();

  if (lowerAction.includes('oil')) {
    return 'Use correct grade oil. Dispose of used oil properly';
  }
  if (lowerAction.includes('coolant')) {
    return 'Allow engine to cool. Use correct coolant mixture';
  }
  if (lowerAction.includes('electrical') || lowerAction.includes('wire')) {
    return 'Ensure power is disconnected. Use insulated tools';
  }
  if (lowerAction.includes('filter')) {
    return 'Prime system after filter change if required';
  }
  if (lowerAction.includes('sensor')) {
    return 'Use thread sealant on threaded sensors. Torque to spec';
  }

  return 'Follow manufacturer procedures';
}

function calculateConfidence(analysis: { possibleCauses: string[]; diagnosis: string }): number {
  // More specific diagnosis = higher confidence
  let confidence = 70;

  if (analysis.possibleCauses.length <= 2) {
    confidence += 15;
  }
  if (analysis.diagnosis.length > 50) {
    confidence += 10;
  }
  if (analysis.diagnosis.toLowerCase().includes('likely') || analysis.diagnosis.toLowerCase().includes('probably')) {
    confidence -= 5;
  }

  return Math.min(95, Math.max(50, confidence));
}

function mapUrgencyToSeverity(urgency: string): 'low' | 'medium' | 'high' | 'critical' {
  const mapping: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'critical': 'critical',
    'urgent': 'high',
    'emergency': 'critical',
    'normal': 'medium',
    'advisory': 'low'
  };
  return mapping[urgency.toLowerCase()] || 'medium';
}

// ==================== EXPORT FOR USE IN COMPONENTS ====================

export {
  ENGINE_SPARE_PARTS,
  CONTROLLER_SPARE_PARTS,
  ELECTRICAL_SPARE_PARTS,
  DIAGNOSTIC_TOOLS,
  MANUAL_REFERENCES,
  CONTROLLER_NAVIGATION,
  VERIFICATION_STEPS,
  SPARE_PARTS_PAGES,
  PARTS_ORDER_INFO,
  getSparePartsForFault,
  getToolsForRepair,
  getManualReferences,
  getControllerNavigation,
  getVerificationSteps,
  getPartsPageForCategory
};
