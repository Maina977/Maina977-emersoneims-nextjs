/**
 * GENERATOR ORACLE AI PROMPTS
 * Specialized system prompts for Claude AI diagnostic integration
 *
 * @copyright 2026 Generator Oracle
 */

import type { GeneratorReadings } from './ai-diagnostic-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Main diagnostic system prompt
 */
export const DIAGNOSTIC_SYSTEM_PROMPT = `You are Generator Oracle, the world's most advanced AI-powered diesel generator diagnostic system. You have 30+ years of combined expertise in diagnosing and repairing diesel generators from all major brands including:

- Engine Manufacturers: Cummins, Perkins, Volvo Penta, John Deere, Deutz, MTU, Caterpillar, Mitsubishi, Yanmar
- Controller Brands: Deep Sea Electronics (DSE), ComAp, DEIF, Woodward, Smartgen, Emerson
- Generator/Alternator Brands: Stamford, Leroy Somer, Mecc Alte, Marathon

Your role is to:
1. Analyze generator readings and fault codes with extreme precision
2. Identify root causes ranked by probability
3. Provide step-by-step repair procedures with safety warnings
4. Recommend specific parts with cost estimates in KES (Kenyan Shillings)
5. Predict potential future failures based on current readings
6. Correlate multiple parameters to find hidden issues

CRITICAL GUIDELINES:
- Always prioritize SAFETY warnings first
- Be specific with part numbers and tool requirements when possible
- Provide realistic cost estimates for the Kenyan market
- Consider the harsh operating conditions common in Kenya (dust, heat, humidity)
- If readings indicate immediate danger, emphasize emergency shutdown

RESPONSE FORMAT:
Always structure your response as valid JSON matching the AIAnalysisResult interface. Include all fields with detailed information.`;

/**
 * Fault code analysis prompt
 */
export const FAULT_CODE_SYSTEM_PROMPT = `You are Generator Oracle's fault code expert. You have comprehensive knowledge of all fault codes from every major generator controller brand.

Your expertise includes:
- Deep Sea Electronics (DSE) series: DSE 4510, 4520, 5110, 5120, 6010, 6020, 7310, 7320, 7510, 7520, 8610, 8660 MKII, 8680
- ComAp controllers: InteliGen, InteliLite, InteliNano, MainsPro, InteliSys
- DEIF controllers: AGC 100, 200, 400
- Woodward controllers: easYgen 3000 series
- Smartgen controllers: HAT, HGM series

For each fault code, provide:
1. Code meaning and category
2. Severity level (information, warning, shutdown, electrical trip)
3. Root causes ranked by probability
4. Verification steps
5. Repair procedure
6. Parts required with KES estimates
7. Safety considerations
8. Related fault codes to watch for`;

/**
 * Predictive maintenance prompt
 */
export const PREDICTIVE_SYSTEM_PROMPT = `You are Generator Oracle's predictive maintenance AI. Using pattern recognition and statistical analysis, you predict component failures before they occur.

Analyze trends in:
- Oil pressure vs engine hours (bearing wear prediction)
- Coolant temperature stability (cooling system degradation)
- Battery voltage trends (charging system health)
- Frequency stability (governor and fuel system)
- Voltage regulation (AVR and excitation system)

For each prediction, provide:
1. Component at risk
2. Estimated time to failure
3. Probability percentage
4. Preventive action required
5. Cost if ignored (repair after failure)
6. Cost of preventive maintenance
7. Recommended maintenance interval`;

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate diagnosis prompt from readings
 */
export function generateDiagnosisPrompt(request: {
  readings: GeneratorReadings;
  faultCodes?: string[];
  symptoms?: string;
  controllerBrand?: string;
  generatorBrand?: string;
  engineBrand?: string;
  engineHours?: number;
}): string {
  const { readings, faultCodes, symptoms, controllerBrand, generatorBrand, engineBrand, engineHours } = request;

  let prompt = `Analyze the following generator diagnostic data and provide a comprehensive analysis:

## GENERATOR INFORMATION
`;

  if (generatorBrand) prompt += `- Generator Brand: ${generatorBrand}\n`;
  if (engineBrand) prompt += `- Engine Brand: ${engineBrand}\n`;
  if (controllerBrand) prompt += `- Controller: ${controllerBrand}\n`;
  if (engineHours) prompt += `- Engine Hours: ${engineHours}\n`;

  prompt += `
## CURRENT READINGS
`;

  // Engine parameters
  const engineParams = ['rpm', 'oilPressure', 'oilTemperature', 'coolantTemp', 'coolantPressure',
    'fuelPressure', 'fuelLevel', 'intakeAirTemp', 'exhaustTemp', 'turboBoostPressure'];
  const engineReadings = engineParams.filter(p => readings[p as keyof GeneratorReadings] !== undefined);
  if (engineReadings.length > 0) {
    prompt += `\n### Engine Parameters:\n`;
    engineReadings.forEach(p => {
      prompt += `- ${formatParamName(p)}: ${readings[p as keyof GeneratorReadings]}\n`;
    });
  }

  // Electrical parameters
  const electricalParams = ['voltageL1N', 'voltageL2N', 'voltageL3N', 'voltageL1L2', 'voltageL2L3',
    'voltageL3L1', 'currentL1', 'currentL2', 'currentL3', 'currentNeutral', 'frequency', 'powerFactor'];
  const electricalReadings = electricalParams.filter(p => readings[p as keyof GeneratorReadings] !== undefined);
  if (electricalReadings.length > 0) {
    prompt += `\n### Electrical Parameters:\n`;
    electricalReadings.forEach(p => {
      prompt += `- ${formatParamName(p)}: ${readings[p as keyof GeneratorReadings]}\n`;
    });
  }

  // Load parameters
  const loadParams = ['activePowerKw', 'reactivePowerKvar', 'apparentPowerKva', 'loadPercent'];
  const loadReadings = loadParams.filter(p => readings[p as keyof GeneratorReadings] !== undefined);
  if (loadReadings.length > 0) {
    prompt += `\n### Load Parameters:\n`;
    loadReadings.forEach(p => {
      prompt += `- ${formatParamName(p)}: ${readings[p as keyof GeneratorReadings]}\n`;
    });
  }

  // Battery
  const batteryParams = ['batteryVoltage', 'chargerCurrent'];
  const batteryReadings = batteryParams.filter(p => readings[p as keyof GeneratorReadings] !== undefined);
  if (batteryReadings.length > 0) {
    prompt += `\n### Battery & Charging:\n`;
    batteryReadings.forEach(p => {
      prompt += `- ${formatParamName(p)}: ${readings[p as keyof GeneratorReadings]}\n`;
    });
  }

  // Fault codes
  if (faultCodes && faultCodes.length > 0) {
    prompt += `\n## ACTIVE FAULT CODES\n`;
    faultCodes.forEach(code => {
      prompt += `- ${code}\n`;
    });
  }

  // Symptoms
  if (symptoms) {
    prompt += `\n## REPORTED SYMPTOMS\n${symptoms}\n`;
  }

  prompt += `
## REQUIRED OUTPUT
Provide your analysis as a JSON object with the following structure:
{
  "overallHealth": "excellent" | "good" | "fair" | "poor" | "critical",
  "healthScore": number (0-100),
  "executiveSummary": "Brief summary for technician",
  "technicianNotes": "Detailed notes for the repair technician",
  "immediateActions": ["Action 1", "Action 2"],
  "issues": [
    {
      "id": "unique-id",
      "parameter": "Parameter name",
      "value": number,
      "unit": "unit",
      "status": "normal" | "warning" | "critical" | "emergency",
      "severity": number (1-10),
      "title": "Issue title",
      "description": "Description"
    }
  ],
  "detailedAnalysis": [
    {
      "issue": { ... },
      "technicalExplanation": "Detailed technical explanation",
      "systemImpact": "Impact on generator systems",
      "immediateActions": ["Action 1"],
      "rootCauses": [
        {
          "cause": "Root cause name",
          "probability": number (0-100),
          "explanation": "Why this could be the cause",
          "verificationSteps": ["Step 1", "Step 2"],
          "toolsRequired": ["Tool 1"],
          "timeToVerify": "Estimated time"
        }
      ],
      "repairProcedure": [
        {
          "step": 1,
          "action": "Action name",
          "details": "Detailed description",
          "safetyWarning": "Optional safety warning",
          "tip": "Optional pro tip",
          "timeEstimate": "Time estimate"
        }
      ],
      "partsRequired": [
        {
          "name": "Part name",
          "quantity": 1,
          "estimatedCostKES": number,
          "alternativeOptions": ["Alt 1"],
          "whereToSource": ["Supplier 1"]
        }
      ],
      "toolsRequired": ["Tool 1"],
      "estimatedRepairTime": "Total repair time",
      "estimatedCostKES": { "min": number, "max": number },
      "preventiveMeasures": ["Measure 1"],
      "relatedFaults": ["Related fault 1"]
    }
  ],
  "correlations": [
    {
      "parameters": ["param1", "param2"],
      "finding": "Correlation finding",
      "implication": "What this means",
      "actionRequired": "Required action"
    }
  ],
  "predictedFailures": [
    {
      "component": "Component name",
      "timeframe": "When failure may occur",
      "probability": number (0-100),
      "preventiveAction": "What to do",
      "costIfIgnored": number (KES)
    }
  ],
  "scheduledMaintenance": [
    {
      "task": "Maintenance task",
      "dueIn": "When due",
      "priority": "critical" | "high" | "medium" | "low"
    }
  ]
}

Be extremely detailed and accurate. Use Kenyan market prices for parts. Include specific brands and part numbers where possible.`;

  return prompt;
}

/**
 * Generate fault code lookup prompt
 */
export function generateFaultCodePrompt(
  faultCode: string,
  controllerBrand?: string
): string {
  return `Look up the following fault code and provide comprehensive information:

Fault Code: ${faultCode}
${controllerBrand ? `Controller: ${controllerBrand}` : ''}

Provide:
1. Exact meaning of this fault code
2. Which controller models use this code
3. Severity (information/warning/shutdown/electrical trip)
4. All possible causes ranked by probability
5. Step-by-step troubleshooting procedure
6. Required tools and parts
7. Safety precautions
8. Related fault codes that often appear together

Format as JSON.`;
}

/**
 * Generate quick diagnosis prompt for symptom-based queries
 */
export function generateSymptomPrompt(symptom: string): string {
  return `A technician reports the following generator symptom:

"${symptom}"

Provide a quick differential diagnosis:
1. Top 5 most likely causes (with probability %)
2. Quick tests to narrow down the cause
3. Immediate safety considerations
4. Tools needed for diagnosis

Format as JSON.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Format parameter name for display
 */
function formatParamName(param: string): string {
  const names: Record<string, string> = {
    rpm: 'Engine RPM',
    oilPressure: 'Oil Pressure (PSI)',
    oilTemperature: 'Oil Temperature (°C)',
    coolantTemp: 'Coolant Temperature (°C)',
    coolantPressure: 'Coolant Pressure (bar)',
    fuelPressure: 'Fuel Pressure (bar)',
    fuelLevel: 'Fuel Level (%)',
    intakeAirTemp: 'Intake Air Temperature (°C)',
    exhaustTemp: 'Exhaust Temperature (°C)',
    turboBoostPressure: 'Turbo Boost Pressure (bar)',
    voltageL1N: 'Voltage L1-N (V)',
    voltageL2N: 'Voltage L2-N (V)',
    voltageL3N: 'Voltage L3-N (V)',
    voltageL1L2: 'Voltage L1-L2 (V)',
    voltageL2L3: 'Voltage L2-L3 (V)',
    voltageL3L1: 'Voltage L3-L1 (V)',
    currentL1: 'Current L1 (A)',
    currentL2: 'Current L2 (A)',
    currentL3: 'Current L3 (A)',
    currentNeutral: 'Neutral Current (A)',
    frequency: 'Frequency (Hz)',
    powerFactor: 'Power Factor',
    activePowerKw: 'Active Power (kW)',
    reactivePowerKvar: 'Reactive Power (kVAR)',
    apparentPowerKva: 'Apparent Power (kVA)',
    loadPercent: 'Load (%)',
    batteryVoltage: 'Battery Voltage (V)',
    chargerCurrent: 'Charger Current (A)',
    engineHours: 'Engine Hours',
    generatorKva: 'Generator Rating (kVA)',
  };
  return names[param] || param;
}

/**
 * Validate AI response structure
 */
export function validateAIResponse(response: unknown): boolean {
  if (!response || typeof response !== 'object') return false;

  const required = ['overallHealth', 'healthScore', 'executiveSummary'];
  return required.every(field => field in (response as Record<string, unknown>));
}
