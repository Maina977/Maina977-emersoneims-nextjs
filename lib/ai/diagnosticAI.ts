/**
 * RULE-BASED GENERATOR FAULT LOOKUP: keyword matching of a plain-language
 * description against the fault-code reference. Not a language model; the
 * match score is a ranking aid only.
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
    keywords: ['overheating', 'overheat', 'hot', 'temperature high', 'high temperature', 'coolant', 'radiator', 'boiling', 'steam', 'thermal', 'heat'],
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
  model?: string;
  title: string;
  category: string;
  severity: string;
  confidence: number;
  description: string;
  causes: string[];
  solution: string;
  matchReason: string;
  // Diagnostic content from lib/data/faultKnowledge.ts. Present on codes whose
  // fault type has content written for it. Without these the caller receives a
  // fault name and a remedy list but no way to work through the fault, which
  // defeats the purpose of the knowledge layer.
  summary?: string;
  symptoms?: string[];
  diagnosticSteps?: { step: number; action: string; expectedResult: string; tools?: string[] }[];
  safetyWarnings?: string[];
  tools?: string[];
  preventive?: string;
  /** How the fault is cleared on the controller. */
  resetSteps?: string[];
  /** Likelihood-weighted causes, each with how to verify it. */
  causeDetail?: { likelihood: string; cause: string; verification: string }[];
  parts?: string[];
  /** True where diagnostic content was attached; false where only base data exists. */
  enriched?: boolean;
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

/** Words a fault title must contain to be relevant to a symptom (2026-10-20). */
const SYMPTOM_TITLE_TERMS: Record<string, string[]> = {
  overheating: ['coolant temp', 'coolant level', 'temperature', 'fan', 'overheat'],
  oil_pressure: ['oil pressure', 'oil level'],
  low_power: ['derate', 'boost', 'power', 'torque', 'intake manifold', 'fuel rail', 'fuel delivery', 'injector'],
  fuel_problem: ['fuel'],
  electrical: ['voltage', 'battery', 'charg', 'frequency', 'alternator'],
  no_start: ['start', 'crank', 'speed sensor', 'position', 'shutoff', 'speed'],
  turbo: ['turbo', 'boost', 'charge air', 'intake manifold'],
  exhaust: ['exhaust', 'dpf', 'egr', 'particulate', 'def', 'scr'],
  shutdown: ['shutdown', 'protection'],
  black_smoke: ['boost', 'intake manifold', 'air filter', 'turbo', 'injector', 'fuel rail', 'charge air', 'exhaust'],
  white_smoke: ['coolant', 'injector', 'intake air temp', 'start enable'],
  blue_smoke: ['oil', 'crankcase', 'turbo'],
};

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
        const cat = category.toLowerCase();
        if (codeCategory && (codeCategory.includes(cat) || cat.includes(codeCategory))) {
          confidence += 10;
          break;
        }
      }
    }
  }
  
  // The symptom's own vocabulary in the code title (2026-10-20): "overheating"
  // must rank Coolant Temperature above Oil Pressure, which only shares a category.
  const TITLE_TERMS = SYMPTOM_TITLE_TERMS;
  for (const symptom of detectedSymptoms) {
    const terms = TITLE_TERMS[symptom] || [];
    if (terms.some((t) => new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(codeTitle))) {
      confidence += 20;
      // Overheating is first a COOLANT temperature fault; oil temperature follows it.
      if (symptom === 'overheating' && codeTitle.includes('coolant')) confidence += 10;
      break;
    }
  }

  // Direction (2026-10-20 audit): "overheating" is an ABOVE-normal reading (FMI 0/15/16);
  // "low oil pressure" is BELOW normal (FMI 1/17/18). The opposite direction is penalised,
  // so coolant temperature FMI 1 (too cold) no longer answers "overheating".
  const fmiMatch = /FMI ?(\d+)/i.exec(String(code.code || ''));
  if (fmiMatch) {
    const fmi = Number(fmiMatch[1]);
    const HIGH = [0, 15, 16], LOW = [1, 17, 18];
    const wantHigh = detectedSymptoms.includes('overheating');
    const wantLow = detectedSymptoms.includes('oil_pressure');
    if (wantHigh !== wantLow) {
      const want = wantHigh ? HIGH : LOW, opp = wantHigh ? LOW : HIGH;
      if (want.includes(fmi)) confidence += 15;
      else if (opp.includes(fmi)) confidence -= 30;
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
  
  // Uncapped: the score only ranks matches (it is not shown as a percentage), and a
  // cap made coolant and oil temperature tie for "overheating" (2026-10-20).
  return confidence;
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
    // Engine brands (Cummins, Perkins…) now match the J1939 reference through its
    // model list; controller brands match the brand field (2026-10-20).
    if (detectedBrand && code.brand &&
        !code.brand.toLowerCase().includes(detectedBrand.toLowerCase()) &&
        !String(code.model || '').toLowerCase().includes(detectedBrand.toLowerCase())) {
      continue;
    }
    
    // Filter by category if symptoms detected
    if (relevantCategories.size > 0) {
      const codeCategory = (code.category || '').toLowerCase();
      if (!codeCategory) continue; // an empty category must not match every symptom
      let categoryMatch = false;
      for (const cat of relevantCategories) {
        if (codeCategory.includes(cat) || cat.includes(codeCategory)) {
          categoryMatch = true;
          break;
        }
      }
      if (!categoryMatch) continue;
    }
    
    // A generic J1939 row must name the symptom in its title; sharing a broad
    // category ("Fuel") is not enough (2026-10-20).
    if (/^SPN/i.test(String(code.code)) && detectedSymptoms.length) {
      const title = String(code.issue || code.title || '').toLowerCase();
      const terms = detectedSymptoms.flatMap((s) => SYMPTOM_TITLE_TERMS[s] || []);
      // Word-start match: "moderately" must not count as "derate".
      if (terms.length && !terms.some((w) => new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(title))) continue;
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
  // Ranked on the full score; the score returned is capped at 99 (it is a match
  // score, never a probability).
  const topMatches = matchedCodes.slice(0, 10).map((m) => ({ ...m, confidence: Math.min(99, m.confidence) }));
  
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
  
  let summary = `Matching your description${brandText} against our fault-code reference found ${matches.length} potentially related fault codes. `;
  
  // A keyword match is not a diagnosis (2026-10-25 audit: "A probable cause is
  // Injector Metering Rail 1 Pressure — Data erratic" for black smoke).
  if (topMatch.confidence >= 90) {
    summary += `The closest entry in our reference is **${topMatch.title}** (Code: ${topMatch.code}). `;
  } else {
    summary += `Entries that mention these symptoms include **${topMatch.title}** (Code: ${topMatch.code}). This is a keyword match, not a diagnosis — check the basics below first. `;
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
/** "SPN 110 FMI 0", "SPN110-FMI0", "110-0", "110/0" → "spn110-fmi0" (the stored form). */
export function normalizeJ1939(s: string): string | null {
  const m = /^\s*(?:SPN\s*[:#-]?\s*)?(\d{1,6})\s*(?:[/-]|\s)\s*(?:FMI\s*[:#-]?\s*)?(\d{1,2})\s*$/i.exec(s);
  if (!m) return null;
  if (!/spn|fmi|[/-]/i.test(s)) return null; // two bare numbers are not a J1939 code
  return `spn${+m[1]}-fmi${+m[2]}`;
}

export function getExactCode(codeStr: string): MatchedCode | null {
  const wanted = normalizeJ1939(codeStr) ?? codeStr.toLowerCase();
  // A bare J1939 code is brand-neutral: prefer the generic entry over a
  // controller-specific one (2026-10-25 audit: "SPN 110 FMI 0" answered with
  // the CAT PowerWizard entry and "connect CAT ET").
  const isGeneric = (c: any) => /^(j1939|generic|universal)/i.test(String(c?.brand ?? ''));
  const allCodes = [...(brandSpecificErrorCodes || [])].sort((a: any, b: any) => Number(isGeneric(b)) - Number(isGeneric(a)));

  for (const code of allCodes) {
    const stored = code.code ? (normalizeJ1939(code.code) ?? code.code.toLowerCase()) : '';
    if (stored === wanted || code.code?.toLowerCase() === codeStr.toLowerCase()) {
      return {
        code: code.code,
        brand: code.brand || 'Generic',
        model: code.model || undefined,
        title: code.issue || code.title || 'Unknown',
        category: code.category || 'General',
        severity: code.severity || 'WARNING',
        confidence: 100,
        description: code.description || code.summary || '',
        causes: code.causes || [],
        solution: code.solution || '',
        matchReason: 'Exact match',
        summary: code.summary || undefined,
        symptoms: code.symptoms?.length ? code.symptoms : undefined,
        diagnosticSteps: code.diagnosticSteps?.length ? code.diagnosticSteps : undefined,
        safetyWarnings: code.safetyWarnings?.length ? code.safetyWarnings : undefined,
        tools: code.tools?.length ? code.tools : undefined,
        preventive: code.preventive || undefined,
        resetSteps: code.resetSteps?.length ? code.resetSteps : undefined,
        causeDetail: code.causeDetail?.length ? code.causeDetail : undefined,
        parts: code.parts?.length ? code.parts : undefined,
        enriched: Boolean(code.enriched)
      };
    }
  }
  
  return null;
}
