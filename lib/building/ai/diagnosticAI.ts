/**
 * AI-POWERED GENERATOR DIAGNOSTIC ENGINE
 * Natural Language Processing for Fault Code Analysis
 * 
 * Features:
 * - Symptom-to-code mapping
 * - Natural language understanding
 * - Confidence scoring
 * - Context-aware solutions
 * - Multi-brand support
 * 
 * @copyright 2026 EmersonEIMS
 */

import { brandSpecificErrorCodes } from '@/app/data/diagnostic/brandSpecificErrorCodes';

// Symptom keywords mapped to categories and fault patterns
const SYMPTOM_KEYWORDS: Record<string, {
  categories: string[];
  keywords: string[];
  severity: string;
  relatedCodes: string[];
}> = {
  // Engine won't start
  'no_start': {
    categories: ['Starting System', 'Fuel System', 'Electrical'],
    keywords: ['won\'t start', 'no start', 'doesn\'t start', 'cranks but', 'won\'t crank', 'dead', 'nothing happens', 'no response', 'won\'t turn over'],
    severity: 'critical',
    relatedCodes: ['E1001', 'E1010', 'E2001', 'F101', 'F102']
  },
  
  // Overheating issues
  'overheating': {
    categories: ['Cooling System', 'Lubrication'],
    keywords: ['overheating', 'hot', 'temperature high', 'coolant', 'radiator', 'boiling', 'steam', 'thermal', 'heat'],
    severity: 'critical',
    relatedCodes: ['E1003', 'E1020', 'E2003', 'C101', 'C102']
  },
  
  // Smoke issues
  'black_smoke': {
    categories: ['Fuel System', 'Air Intake', 'Turbo/Air Intake'],
    keywords: ['black smoke', 'dark smoke', 'heavy smoke', 'smoking black', 'rich', 'soot'],
    severity: 'warning',
    relatedCodes: ['E1015', 'E2034', 'F201', 'A101']
  },
  
  'white_smoke': {
    categories: ['Cooling System', 'Fuel System', 'Engine'],
    keywords: ['white smoke', 'steam', 'coolant burning', 'head gasket', 'milky'],
    severity: 'critical',
    relatedCodes: ['E1021', 'C201', 'E301']
  },
  
  'blue_smoke': {
    categories: ['Lubrication', 'Engine'],
    keywords: ['blue smoke', 'oil burning', 'consuming oil', 'oil smoke'],
    severity: 'warning',
    relatedCodes: ['O101', 'E401', 'E402']
  },
  
  // Power issues
  'low_power': {
    categories: ['Fuel System', 'Turbo/Air Intake', 'ECM/Sensors', 'Exhaust/Emissions'],
    keywords: ['low power', 'weak', 'no power', 'underpowered', 'sluggish', 'won\'t reach', 'can\'t handle load', 'derated'],
    severity: 'warning',
    relatedCodes: ['E1001', 'E1002', 'T101', 'S101']
  },
  
  // Oil pressure
  'oil_pressure': {
    categories: ['Lubrication'],
    keywords: ['oil pressure', 'low oil', 'oil warning', 'oil light', 'pressure drop', 'oil leak'],
    severity: 'critical',
    relatedCodes: ['O101', 'O102', 'O103', 'E1004']
  },
  
  // Fuel issues
  'fuel_problem': {
    categories: ['Fuel System'],
    keywords: ['fuel', 'diesel', 'injector', 'filter', 'pump', 'contaminated', 'air in fuel', 'fuel leak', 'fuel pressure'],
    severity: 'warning',
    relatedCodes: ['E1001', 'E1002', 'F101', 'F102', 'F201']
  },
  
  // Electrical/voltage
  'electrical': {
    categories: ['Electrical', 'Generator'],
    keywords: ['voltage', 'electrical', 'battery', 'alternator', 'charging', 'no output', 'fluctuating', 'frequency', 'hertz', 'hz'],
    severity: 'warning',
    relatedCodes: ['V101', 'V102', 'G101', 'G102', 'E501']
  },
  
  // Noise issues
  'abnormal_noise': {
    categories: ['Engine', 'Turbo/Air Intake', 'Generator'],
    keywords: ['noise', 'knocking', 'rattling', 'grinding', 'squealing', 'vibration', 'shaking', 'loud', 'unusual sound'],
    severity: 'warning',
    relatedCodes: ['E601', 'E602', 'T201', 'B101']
  },
  
  // Shutdown
  'shutdown': {
    categories: ['ECM/Sensors', 'Cooling System', 'Lubrication', 'Fuel System'],
    keywords: ['shutdown', 'shuts down', 'stops', 'cuts off', 'dies', 'stalls', 'trips', 'emergency stop'],
    severity: 'critical',
    relatedCodes: ['E1010', 'E1020', 'E1030', 'S201']
  },
  
  // Sensor issues
  'sensor': {
    categories: ['ECM/Sensors'],
    keywords: ['sensor', 'fault code', 'error code', 'warning light', 'indicator', 'display', 'reading wrong'],
    severity: 'info',
    relatedCodes: ['S101', 'S102', 'S103', 'E701']
  },
  
  // Turbo issues
  'turbo': {
    categories: ['Turbo/Air Intake'],
    keywords: ['turbo', 'turbocharger', 'boost', 'wastegate', 'intercooler', 'charge air'],
    severity: 'warning',
    relatedCodes: ['T101', 'T102', 'T201', 'T202']
  },
  
  // Exhaust issues
  'exhaust': {
    categories: ['Exhaust/Emissions'],
    keywords: ['exhaust', 'dpf', 'egr', 'emissions', 'backpressure', 'catalyst', 'regen'],
    severity: 'warning',
    relatedCodes: ['EX101', 'EX102', 'DPF01', 'EGR01']
  }
};

// Brand aliases for fuzzy matching
const BRAND_ALIASES: Record<string, string[]> = {
  'Cummins': ['cummins', 'cummin', 'cummings', 'cumins'],
  'Caterpillar': ['caterpillar', 'cat', 'catepillar', 'catapillar'],
  'Perkins': ['perkins', 'perkings', 'perkin'],
  'Deutz': ['deutz', 'duetz', 'deutch'],
  'SDMO': ['sdmo', 'sdm'],
  'Kohler': ['kohler', 'koehler'],
  'Generac': ['generac', 'generak'],
  'Doosan': ['doosan', 'dosan'],
  'Weichai': ['weichai', 'weichi'],
  'Atlas Copco': ['atlas copco', 'atlascopco', 'atlas', 'copco']
};

export interface DiagnosticResult {
  query: string;
  detectedSymptoms: string[];
  detectedBrand: string | null;
  confidence: number;
  matchedCodes: MatchedCode[];
  aiSummary: string;
  recommendedActions: string[];
  safetyWarnings: string[];
  estimatedDifficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
  estimatedTime: string;
  whenToCallExpert: string;
}

export interface MatchedCode {
  code: string;
  brand: string;
  title: string;
  category: string;
  severity: string;
  confidence: number;
  description: string;
  causes: string[];
  solution: string;
  matchReason: string;
}

/**
 * Detect brand from natural language query
 */
function detectBrand(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
    for (const alias of aliases) {
      if (lowerQuery.includes(alias)) {
        return brand;
      }
    }
  }
  
  return null;
}

/**
 * Detect symptoms from natural language query
 */
function detectSymptoms(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const detectedSymptoms: string[] = [];
  
  for (const [symptom, config] of Object.entries(SYMPTOM_KEYWORDS)) {
    for (const keyword of config.keywords) {
      if (lowerQuery.includes(keyword)) {
        if (!detectedSymptoms.includes(symptom)) {
          detectedSymptoms.push(symptom);
        }
        break;
      }
    }
  }
  
  return detectedSymptoms;
}

/**
 * Calculate match confidence based on query and code
 */
function calculateConfidence(
  query: string,
  code: any,
  detectedSymptoms: string[],
  detectedBrand: string | null
): number {
  let confidence = 50; // Base confidence
  
  const lowerQuery = query.toLowerCase();
  const codeTitle = (code.issue || code.title || '').toLowerCase();
  const codeDescription = (code.description || '').toLowerCase();
  const codeCategory = (code.category || '').toLowerCase();
  const codeBrand = (code.brand || '').toLowerCase();
  
  // Brand match bonus
  if (detectedBrand && codeBrand.includes(detectedBrand.toLowerCase())) {
    confidence += 20;
  }
  
  // Category match from symptoms
  for (const symptom of detectedSymptoms) {
    const symptomConfig = SYMPTOM_KEYWORDS[symptom];
    if (symptomConfig) {
      for (const category of symptomConfig.categories) {
        if (codeCategory.includes(category.toLowerCase())) {
          confidence += 10;
          break;
        }
      }
    }
  }
  
  // Keyword match in title/description
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
  for (const word of queryWords) {
    if (codeTitle.includes(word) || codeDescription.includes(word)) {
      confidence += 5;
    }
  }
  
  // Severity match
  for (const symptom of detectedSymptoms) {
    const symptomConfig = SYMPTOM_KEYWORDS[symptom];
    if (symptomConfig && code.severity?.toLowerCase() === symptomConfig.severity) {
      confidence += 5;
    }
  }
  
  return Math.min(99, confidence);
}

/**
 * Main AI diagnostic function
 */
export function analyzeSymptoms(query: string): DiagnosticResult {
  const detectedSymptoms = detectSymptoms(query);
  const detectedBrand = detectBrand(query);
  
  // Get relevant categories from symptoms
  const relevantCategories = new Set<string>();
  for (const symptom of detectedSymptoms) {
    const config = SYMPTOM_KEYWORDS[symptom];
    if (config) {
      config.categories.forEach(cat => relevantCategories.add(cat.toLowerCase()));
    }
  }
  
  // Search and rank codes
  const matchedCodes: MatchedCode[] = [];
  const allCodes = brandSpecificErrorCodes || [];
  
  for (const code of allCodes) {
    // Filter by brand if detected
    if (detectedBrand && code.brand && 
        !code.brand.toLowerCase().includes(detectedBrand.toLowerCase())) {
      continue;
    }
    
    // Filter by category if symptoms detected
    if (relevantCategories.size > 0) {
      const codeCategory = (code.category || '').toLowerCase();
      let categoryMatch = false;
      for (const cat of relevantCategories) {
        if (codeCategory.includes(cat) || cat.includes(codeCategory)) {
          categoryMatch = true;
          break;
        }
      }
      if (!categoryMatch) continue;
    }
    
    const confidence = calculateConfidence(query, code, detectedSymptoms, detectedBrand);
    
    if (confidence >= 60) {
      matchedCodes.push({
        code: code.code,
        brand: code.brand || 'Generic',
        title: code.issue || code.title || 'Unknown Issue',
        category: code.category || 'General',
        severity: code.severity || 'WARNING',
        confidence,
        description: code.description || '',
        causes: code.causes || [],
        solution: code.solution || '',
        matchReason: generateMatchReason(detectedSymptoms, code)
      });
    }
  }
  
  // Sort by confidence
  matchedCodes.sort((a, b) => b.confidence - a.confidence);
  
  // Take top 10
  const topMatches = matchedCodes.slice(0, 10);
  
  // Generate AI summary
  const aiSummary = generateAISummary(query, detectedSymptoms, detectedBrand, topMatches);
  
  // Generate recommended actions
  const recommendedActions = generateRecommendedActions(detectedSymptoms, topMatches);
  
  // Generate safety warnings
  const safetyWarnings = generateSafetyWarnings(detectedSymptoms, topMatches);
  
  // Estimate difficulty
  const difficulty = estimateDifficulty(detectedSymptoms, topMatches);
  
  // Estimate time
  const estimatedTime = estimateRepairTime(detectedSymptoms, topMatches);
  
  // When to call expert
  const whenToCallExpert = generateExpertGuidance(detectedSymptoms, topMatches);
  
  return {
    query,
    detectedSymptoms,
    detectedBrand,
    confidence: topMatches.length > 0 ? topMatches[0].confidence : 0,
    matchedCodes: topMatches,
    aiSummary,
    recommendedActions,
    safetyWarnings,
    estimatedDifficulty: difficulty,
    estimatedTime,
    whenToCallExpert
  };
}

function generateMatchReason(symptoms: string[], code: any): string {
  const reasons: string[] = [];
  
  if (symptoms.length > 0) {
    reasons.push(`Matches symptoms: ${symptoms.join(', ')}`);
  }
  
  if (code.category) {
    reasons.push(`Category: ${code.category}`);
  }
  
  return reasons.join(' | ') || 'General match';
}

function generateAISummary(
  query: string,
  symptoms: string[],
  brand: string | null,
  matches: MatchedCode[]
): string {
  if (matches.length === 0) {
    return `I couldn't find specific fault codes matching your description. Please provide more details about the symptoms, or try searching with a specific error code if you have one displayed.`;
  }
  
  const topMatch = matches[0];
  const brandText = brand ? ` for ${brand} generators` : '';
  
  let summary = `Based on your description${brandText}, I found ${matches.length} potentially related fault codes. `;
  
  if (topMatch.confidence >= 90) {
    summary += `The most likely issue is **${topMatch.title}** (Code: ${topMatch.code}) with ${topMatch.confidence}% confidence. `;
  } else if (topMatch.confidence >= 75) {
    summary += `A probable cause is **${topMatch.title}** (Code: ${topMatch.code}). `;
  } else {
    summary += `Possible causes include **${topMatch.title}** (Code: ${topMatch.code}), but further diagnosis is recommended. `;
  }
  
  if (symptoms.includes('shutdown') || symptoms.includes('oil_pressure') || symptoms.includes('overheating')) {
    summary += `⚠️ **CAUTION: This appears to be a critical issue. Do not continue operating the generator until the problem is resolved.**`;
  }
  
  return summary;
}

function generateRecommendedActions(symptoms: string[], matches: MatchedCode[]): string[] {
  const actions: string[] = [];
  
  // Always start with safety
  actions.push('Ensure the generator is in a safe state before any inspection');
  
  if (symptoms.includes('no_start')) {
    actions.push('Check battery voltage (should be 12.6V+ for 12V system)');
    actions.push('Verify fuel level and quality');
    actions.push('Inspect fuel filter for blockage');
    actions.push('Check for air in fuel lines');
  }
  
  if (symptoms.includes('overheating')) {
    actions.push('STOP the generator immediately if running');
    actions.push('Allow engine to cool before inspection');
    actions.push('Check coolant level when cold');
    actions.push('Inspect radiator for blockage or damage');
    actions.push('Verify thermostat operation');
  }
  
  if (symptoms.includes('black_smoke')) {
    actions.push('Inspect and replace air filter if dirty');
    actions.push('Check for restricted air intake');
    actions.push('Verify injection timing');
    actions.push('Test fuel quality');
  }
  
  if (symptoms.includes('oil_pressure')) {
    actions.push('STOP the generator immediately');
    actions.push('Check oil level on dipstick');
    actions.push('Inspect for visible oil leaks');
    actions.push('Install mechanical oil pressure gauge to verify');
  }
  
  if (symptoms.includes('electrical')) {
    actions.push('Disconnect loads before testing');
    actions.push('Measure output voltage at terminals');
    actions.push('Check AVR settings and connections');
    actions.push('Inspect brushes and slip rings');
  }
  
  if (matches.length > 0 && matches[0].solution) {
    actions.push(`Primary fix: ${matches[0].solution}`);
  }
  
  return actions.slice(0, 8); // Max 8 actions
}

function generateSafetyWarnings(symptoms: string[], matches: MatchedCode[]): string[] {
  const warnings: string[] = [];
  
  warnings.push('Always follow lockout/tagout procedures');
  warnings.push('Wear appropriate PPE (gloves, safety glasses)');
  
  if (symptoms.includes('overheating')) {
    warnings.push('⚠️ HOT SURFACES - Risk of severe burns');
    warnings.push('Never remove radiator cap when hot');
  }
  
  if (symptoms.includes('fuel_problem') || symptoms.includes('black_smoke')) {
    warnings.push('⚠️ FIRE HAZARD - No smoking or open flames');
    warnings.push('Keep fire extinguisher nearby');
  }
  
  if (symptoms.includes('electrical')) {
    warnings.push('⚠️ ELECTRICAL HAZARD - Generator produces lethal voltages');
    warnings.push('Disconnect battery and isolate before electrical work');
  }
  
  if (symptoms.includes('oil_pressure')) {
    warnings.push('⚠️ ENGINE DAMAGE RISK - Do not operate with low oil pressure');
  }
  
  return warnings;
}

function estimateDifficulty(
  symptoms: string[],
  matches: MatchedCode[]
): 'easy' | 'moderate' | 'advanced' | 'expert' {
  // Critical issues usually need expert
  if (symptoms.includes('shutdown') || symptoms.includes('oil_pressure')) {
    return 'advanced';
  }
  
  // Engine internals need expert
  if (symptoms.includes('white_smoke') || symptoms.includes('abnormal_noise')) {
    return 'expert';
  }
  
  // Electrical needs moderate-advanced
  if (symptoms.includes('electrical')) {
    return 'advanced';
  }
  
  // Basic issues
  if (symptoms.includes('black_smoke') || symptoms.includes('fuel_problem')) {
    return 'moderate';
  }
  
  if (symptoms.includes('sensor') || symptoms.includes('no_start')) {
    return 'moderate';
  }
  
  return 'moderate';
}

function estimateRepairTime(symptoms: string[], matches: MatchedCode[]): string {
  if (symptoms.includes('white_smoke') || symptoms.includes('shutdown')) {
    return '4-8 hours (may require major repair)';
  }
  
  if (symptoms.includes('overheating') || symptoms.includes('oil_pressure')) {
    return '2-4 hours';
  }
  
  if (symptoms.includes('electrical') || symptoms.includes('turbo')) {
    return '2-4 hours';
  }
  
  if (symptoms.includes('fuel_problem') || symptoms.includes('black_smoke')) {
    return '1-2 hours';
  }
  
  if (symptoms.includes('no_start')) {
    return '30 minutes - 2 hours';
  }
  
  return '1-3 hours';
}

function generateExpertGuidance(symptoms: string[], matches: MatchedCode[]): string {
  if (symptoms.includes('white_smoke')) {
    return 'Contact EmersonEIMS immediately - white smoke may indicate head gasket failure or cracked head requiring professional repair.';
  }
  
  if (symptoms.includes('oil_pressure')) {
    return 'Contact EmersonEIMS if oil pressure remains low after verifying oil level - may indicate pump failure or bearing damage.';
  }
  
  if (symptoms.includes('shutdown')) {
    return 'Contact EmersonEIMS if shutdown recurs after clearing codes - may indicate underlying protection system fault.';
  }
  
  if (symptoms.includes('electrical')) {
    return 'Contact EmersonEIMS for AVR replacement or winding repairs - requires specialized test equipment.';
  }
  
  return 'Contact EmersonEIMS (+254768860665) if the issue persists after basic troubleshooting or if you lack the required tools.';
}

/**
 * Search fault codes by keyword
 */
export function searchFaultCodes(query: string, limit: number = 20): MatchedCode[] {
  const lowerQuery = query.toLowerCase();
  const allCodes = brandSpecificErrorCodes || [];
  const results: MatchedCode[] = [];
  
  for (const code of allCodes) {
    const codeStr = (code.code || '').toLowerCase();
    const title = (code.issue || code.title || '').toLowerCase();
    const description = (code.description || '').toLowerCase();
    const brand = (code.brand || '').toLowerCase();
    
    if (codeStr.includes(lowerQuery) || 
        title.includes(lowerQuery) || 
        description.includes(lowerQuery) ||
        brand.includes(lowerQuery)) {
      results.push({
        code: code.code,
        brand: code.brand || 'Generic',
        title: code.issue || code.title || 'Unknown',
        category: code.category || 'General',
        severity: code.severity || 'WARNING',
        confidence: codeStr === lowerQuery ? 100 : 80,
        description: code.description || '',
        causes: code.causes || [],
        solution: code.solution || '',
        matchReason: 'Keyword match'
      });
    }
    
    if (results.length >= limit) break;
  }
  
  return results;
}

/**
 * Get code by exact code string
 */
export function getExactCode(codeStr: string): MatchedCode | null {
  const allCodes = brandSpecificErrorCodes || [];
  
  for (const code of allCodes) {
    if (code.code?.toLowerCase() === codeStr.toLowerCase()) {
      return {
        code: code.code,
        brand: code.brand || 'Generic',
        title: code.issue || code.title || 'Unknown',
        category: code.category || 'General',
        severity: code.severity || 'WARNING',
        confidence: 100,
        description: code.description || '',
        causes: code.causes || [],
        solution: code.solution || '',
        matchReason: 'Exact match'
      };
    }
  }
  
  return null;
}
