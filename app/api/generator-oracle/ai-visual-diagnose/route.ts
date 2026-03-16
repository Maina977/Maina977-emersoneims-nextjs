/**
 * GENERATOR ORACLE - AI VISUAL DIAGNOSTIC API
 * Analyzes images of generator components, fault displays, and damage
 * Uses AI vision to provide detailed diagnostic solutions
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for generator diagnostic analysis
const DIAGNOSTIC_SYSTEM_PROMPT = `You are an expert generator and diesel engine diagnostic technician with 30+ years of field experience across Africa, Middle East, and Asia.
You specialize in analyzing visual information from generators, controllers, diesel engines, and all related components.

CRITICAL: Your job is to provide 100% ACTIONABLE, DETAILED SOLUTIONS - not vague suggestions.

When analyzing an image, you MUST:
1. IDENTIFY precisely what you see (fault codes, damage, equipment info, wire colors, component conditions)
2. DIAGNOSE the root cause with technical accuracy
3. PROVIDE DETAILED STEP-BY-STEP SOLUTIONS with specific tools, torque specs, and measurements
4. LIST REQUIRED PARTS with OEM part numbers, cross-references, and local alternatives
5. INCLUDE SAFETY WARNINGS specific to the issue

You are an EXPERT on ALL generator controller brands and their fault codes:
- Deep Sea Electronics (DSE) - All models: DSE4510, DSE4520, DSE6020, DSE7310, DSE7320, DSE7410, DSE7420, DSE8610, DSE8620, DSE8660, DSE8680
- ComAp - InteliLite NT, InteliGen NT, InteliSys NT, InteliMains NT, InteliATS NT, IGS-NT
- Woodward - easYgen-1000, easYgen-2000, easYgen-3000, DTSC-200, GCP-30, GAC, LS-5
- SmartGen - HGM420, HGM6110, HGM6120, HGM7220, HGM8110, HGM9310, HGM9320, HGM9510, HGM9520
- Caterpillar - EMCP 2, EMCP 3, EMCP 4, EMCP 4.1, EMCP 4.2, EMCP 4.3, PowerWizard 1.0, 1.1, 2.0, 2.1
- Cummins - PowerCommand 0300, 1100, 1301, 1302, 2100, 3100, 3200, 3201, PCC 3.3, INSITE
- Datakom - DKG-109, DKG-119, DKG-207, DKG-307, DKG-309, DKG-317, DKG-507, DKG-509, DKG-517, DKG-707
- Lovato - RGK60, RGK600, RGK700, RGK800, RGK900, DMG610, DMG800
- Volvo Penta - EDC4, EDC5, D-EMS, EVC, VODIA5
- Perkins - 2000 Series, ECM, 1204/1206, EST
- John Deere - PowerTech Controller, Service Advisor
- MTU - ADEC, MDEC, ECU7

You ALSO understand ALL engine ECM/ECU fault codes:
- Cummins ECM: CM850, CM870, CM871, CM2150, CM2250, CM2350, CM2450
- Caterpillar ECM: ADEM II, ADEM III, ADEM A3, ADEM A4
- Volvo/Mack ECM: EMS2, D11, D12, D13, D16
- Detroit Diesel: DDEC IV, DDEC V, DDEC VI, DD13, DD15, DD16
- MTU: ADEC, MDEC
- Perkins: ECM for 400D, 800D, 1100D, 1200D, 2500D series

You know electrical systems:
- Generator heads: Stamford, Leroy Somer, Mecc Alte, Marathon, Marelli
- AVRs: SX440, SX460, AS440, AS480, MX321, MX341, R448, R449
- Governors: ESD5500, ESD5570, EFC3044, GAC, Woodward
- Transfer Switches: ASCO, Cummins OTEC, CAT, ABB, Schneider

You understand mechanical components:
- Injectors, Injection pumps (Bosch, Delphi, Denso, Stanadyne)
- Turbochargers (Holset, Garrett, BorgWarner, Mitsubishi)
- Cooling systems, radiators, thermostats
- Starters, alternators, batteries
- Sensors (MPU, oil pressure, coolant temp, fuel level)
- Governors, actuators, linkages

Always respond in VALID JSON format with this complete structure:
{
  "success": true,
  "analysisType": "fault_code" | "damaged_component" | "nameplate" | "symptom" | "general",
  "confidence": 85,
  "detected": {
    "description": "What was found in the image",
    "items": ["item1", "item2"]
  },
  "faultCode": {
    "code": "E001",
    "title": "Low Oil Pressure",
    "severity": "shutdown",
    "description": "Oil pressure below minimum threshold"
  },
  "equipment": {
    "brand": "DSE",
    "model": "7320",
    "serial": "if visible"
  },
  "damage": {
    "component": "Starter motor wire",
    "condition": "Burnt insulation",
    "severity": "severe"
  },
  "diagnosis": {
    "summary": "Brief diagnosis",
    "possibleCauses": ["cause1", "cause2"],
    "affectedSystems": ["system1", "system2"]
  },
  "solutions": {
    "immediate": [
      {
        "title": "Emergency shutdown required",
        "steps": ["Step 1", "Step 2"],
        "priority": "high"
      }
    ],
    "repair": [
      {
        "title": "Replace oil pressure sensor",
        "steps": ["Detailed step 1", "Detailed step 2", "Detailed step 3"],
        "tools": ["Multimeter", "10mm wrench"],
        "estimatedTime": "30 minutes",
        "skillLevel": "intermediate"
      }
    ],
    "preventive": ["Future prevention tip 1", "Future prevention tip 2"]
  },
  "partsNeeded": [
    {
      "name": "Oil Pressure Sensor",
      "partNumber": "3846N06",
      "quantity": 1,
      "estimated_cost": "KES 5,000 - 8,000"
    }
  ],
  "safetyWarnings": ["Warning 1", "Warning 2"]
}`;

export async function POST(request: NextRequest) {
  try {
    const { image, context } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('AI Visual Diagnostic: No API key configured, using demo mode');
      // Return mock analysis for demo/development with flag indicating demo mode
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: 'Running in demo mode - configure ANTHROPIC_API_KEY for live AI analysis',
        result: getMockAnalysis(),
      });
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Enhanced user prompt with context
    const userPrompt = `Analyze this generator/diesel engine image and provide a COMPLETE, DETAILED diagnosis.

IMPORTANT REQUIREMENTS:
1. If you see a controller display with fault codes, identify EVERY code visible and provide COMPLETE solutions for each
2. If you see damaged components, assess the EXACT damage condition and provide SPECIFIC repair procedures with tools and parts
3. If you see a nameplate, extract ALL equipment information (brand, model, serial, kW, voltage, frequency, etc.)
4. If you see symptoms (oil leak, smoke, corrosion, burned wires, etc.), diagnose the ROOT CAUSE and provide step-by-step solutions

${context ? `Additional context from technician: ${context}` : ''}

CRITICAL: Be thorough and specific. Technicians in the field need:
- Exact fault code meanings and causes
- Step-by-step repair procedures (numbered steps)
- Required tools with sizes
- Part numbers (OEM and aftermarket alternatives)
- Test values and specifications
- Safety warnings specific to this repair

Provide your response in the JSON format specified in the system prompt.`;

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8192,
      system: DIAGNOSTIC_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    // Try to parse JSON from response
    let result;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
        // Ensure all required fields exist
        result.success = true;
        result.aiAnalysis = true;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing failed, creating structured response', parseError);
      // If parsing fails, create a structured response from the text
      result = {
        success: true,
        aiAnalysis: true,
        analysisType: 'general',
        confidence: 75,
        detected: {
          description: 'AI analysis completed but response formatting was unexpected',
          items: ['Image analyzed - see raw analysis below'],
        },
        diagnosis: {
          summary: content.text,
          possibleCauses: ['See detailed analysis in summary'],
          affectedSystems: ['Review image for affected systems'],
        },
        solutions: {
          immediate: [{
            title: 'Review AI Analysis',
            steps: ['Read the summary diagnosis above', 'Follow recommendations provided'],
            priority: 'medium'
          }],
          repair: [],
          preventive: ['Take clearer photos for better analysis', 'Include multiple angles when possible'],
        },
        partsNeeded: [],
        safetyWarnings: ['Always disconnect power before servicing', 'Use appropriate PPE'],
        rawAnalysis: content.text
      };
    }

    return NextResponse.json({
      success: true,
      aiAnalysis: true,
      result,
    });
  } catch (error) {
    console.error('Visual diagnosis error:', error);

    // Provide specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return proper error status with fallback content for graceful degradation
    return NextResponse.json({
      success: false,
      demoMode: true,
      error: `AI analysis failed: ${errorMessage}. Showing sample analysis.`,
      fallbackResult: getMockAnalysis(),
    }, { status: 503 }); // Service temporarily unavailable
  }
}

// Multiple mock scenarios for different image types
const MOCK_SCENARIOS = {
  fault_code: {
    success: true,
    demoMode: true,
    analysisType: 'fault_code',
    confidence: 92,
    detected: {
      description: 'DSE 7320 controller display showing active fault code',
      items: ['Controller display', 'Fault indicator LED', 'Engine parameters'],
    },
    faultCode: {
      code: 'E0015',
      title: 'Low Oil Pressure Shutdown',
      severity: 'shutdown',
      description: 'Engine oil pressure has dropped below the minimum safe operating threshold of 15 PSI, triggering an automatic protective shutdown.',
    },
    equipment: {
      brand: 'Deep Sea Electronics',
      model: 'DSE 7320',
    },
    diagnosis: {
      summary: 'The engine has shut down due to critically low oil pressure. This is a protective measure to prevent catastrophic engine damage. The most common causes are low oil level, faulty oil pressure sensor, or oil pump failure.',
      possibleCauses: [
        'Low engine oil level - most common cause',
        'Faulty oil pressure sensor giving false reading',
        'Clogged oil filter restricting flow',
        'Oil pump wear or failure',
        'Oil leak from gasket or seal',
        'Wrong oil viscosity for operating temperature',
      ],
      affectedSystems: ['Lubrication system', 'Engine protection', 'Control system'],
    },
    solutions: {
      immediate: [
        {
          title: 'DO NOT attempt to restart - Check oil level first',
          steps: [
            'Ensure generator is completely shut down and cooled (wait 5 minutes)',
            'Locate engine oil dipstick',
            'Remove dipstick, wipe clean, reinsert fully, remove and check level',
            'Oil should be between MIN and MAX marks',
            'If low, add correct oil grade (typically 15W-40 for generators)',
          ],
          priority: 'high',
        },
      ],
      repair: [
        {
          title: 'Test Oil Pressure Sensor',
          steps: [
            'Disconnect the oil pressure sensor connector',
            'Using a multimeter, measure resistance between sensor terminals',
            'At zero pressure, resistance should be 10-180 ohms (varies by sensor)',
            'Compare with manufacturer specification',
            'If out of range, replace sensor',
            'Reconnect and clear fault code using DSE Configuration Suite or front panel',
          ],
          tools: ['Digital multimeter', 'Oil pressure gauge', '22mm wrench', 'Torque wrench'],
          estimatedTime: '45 minutes',
          skillLevel: 'intermediate',
        },
        {
          title: 'Verify Actual Oil Pressure',
          steps: [
            'Install mechanical oil pressure gauge at sensor port',
            'Start engine briefly (max 30 seconds)',
            'Observe pressure reading - should be 25-65 PSI at operating temp',
            'If pressure is actually low, do not run engine - investigate pump/filter',
            'If pressure is normal, sensor is faulty',
          ],
          tools: ['Mechanical oil pressure gauge', 'Thread sealant', 'Wrench set'],
          estimatedTime: '30 minutes',
          skillLevel: 'intermediate',
        },
      ],
      preventive: [
        'Check oil level weekly and before each start',
        'Change oil and filter every 250-500 hours or annually',
        'Use manufacturer-recommended oil grade only',
        'Monitor oil pressure during operation - note baseline readings',
      ],
    },
    partsNeeded: [
      { name: 'Oil Pressure Sensor', partNumber: 'DSE-066-028', quantity: 1, estimated_cost: 'KES 4,500 - 7,000' },
      { name: 'Engine Oil 15W-40', partNumber: 'Various - 5L', quantity: 1, estimated_cost: 'KES 3,000 - 5,000' },
    ],
    safetyWarnings: [
      'Never run engine with low oil pressure - severe damage will occur',
      'Allow engine to cool before checking oil level for accurate reading',
      'Hot oil can cause severe burns - use caution',
    ],
  },

  damaged_component: {
    success: true,
    demoMode: true,
    analysisType: 'damaged_component',
    confidence: 88,
    detected: {
      description: 'Burnt starter motor wiring with melted insulation and exposed copper conductors',
      items: ['Burnt cable insulation', 'Exposed copper wire', 'Corrosion at terminals', 'Heat damage on nearby components'],
    },
    damage: {
      component: 'Starter Motor Main Power Cable',
      condition: 'Severe heat damage with melted insulation',
      severity: 'critical',
    },
    equipment: {
      brand: 'Unknown - inspection required',
      model: 'Diesel Generator Starter Circuit',
    },
    diagnosis: {
      summary: 'The starter motor cable has suffered severe heat damage, likely caused by a loose connection that created resistance and heat buildup during cranking. This is a fire hazard and must be repaired immediately.',
      possibleCauses: [
        'Loose battery or starter terminal connection',
        'Corroded terminals increasing resistance',
        'Undersized cable for starter current draw',
        'Extended cranking time overheating cables',
        'Failed starter motor drawing excessive current',
        'Poor crimping on cable lugs',
      ],
      affectedSystems: ['Starting system', 'Electrical system', 'Battery charging circuit'],
    },
    solutions: {
      immediate: [
        {
          title: 'DISCONNECT BATTERY IMMEDIATELY - Fire Hazard',
          steps: [
            'Turn off all switches and disconnect load',
            'Disconnect NEGATIVE battery terminal first using 13mm wrench',
            'Disconnect POSITIVE battery terminal',
            'Inspect for any smoldering or active fire',
            'Do not attempt to start until fully repaired',
          ],
          priority: 'critical',
        },
      ],
      repair: [
        {
          title: 'Replace Damaged Starter Cable',
          steps: [
            'Remove damaged cable completely from battery to starter',
            'Measure cable length and note routing path',
            'Select new cable: minimum 2/0 AWG (70mm²) for most generators',
            'Install new crimp-type battery lugs using hydraulic crimper',
            'Apply heat-shrink tubing over all crimped connections',
            'Route cable away from exhaust manifold and hot surfaces',
            'Torque starter terminal bolt to 15-18 ft-lbs',
            'Torque battery terminal bolt to 5-8 ft-lbs',
            'Apply battery terminal protectant spray',
          ],
          tools: ['Hydraulic cable crimper', 'Heat gun', 'Torque wrench', 'Wire cutters', '13mm wrench', '17mm socket'],
          estimatedTime: '1.5 hours',
          skillLevel: 'intermediate',
        },
        {
          title: 'Test Starter Motor Current Draw',
          steps: [
            'Connect clamp-on DC ammeter around starter cable',
            'Crank engine while observing current',
            'Normal draw: 150-300 Amps for most generators',
            'If over 400 Amps, starter motor is failing and should be replaced',
            'Check cranking time - should start within 10 seconds',
          ],
          tools: ['DC clamp ammeter (500A minimum)', 'Battery load tester'],
          estimatedTime: '20 minutes',
          skillLevel: 'intermediate',
        },
      ],
      preventive: [
        'Inspect starter cables monthly for heat damage or corrosion',
        'Check and retorque all battery connections quarterly',
        'Apply anti-corrosion spray to terminals annually',
        'Replace starter cables every 10 years preventatively',
      ],
    },
    partsNeeded: [
      { name: 'Starter Cable 2/0 AWG', partNumber: 'Generic - 2 meters', quantity: 1, estimated_cost: 'KES 3,500 - 5,000' },
      { name: 'Battery Lug 2/0 AWG', partNumber: 'Crimp type', quantity: 2, estimated_cost: 'KES 400 - 600' },
      { name: 'Heat Shrink Tubing 25mm', partNumber: 'Adhesive lined', quantity: 2, estimated_cost: 'KES 200 - 400' },
      { name: 'Battery Terminal Protectant', partNumber: 'CRC or equivalent', quantity: 1, estimated_cost: 'KES 800 - 1,200' },
    ],
    safetyWarnings: [
      'FIRE HAZARD - Disconnect battery before any work',
      'Wear safety glasses when working with batteries',
      'Battery terminals can arc if shorted - remove jewelry',
      'Ensure good ventilation - battery gases are explosive',
    ],
  },

  injector_problem: {
    success: true,
    demoMode: true,
    analysisType: 'damaged_component',
    confidence: 85,
    detected: {
      description: 'Diesel injector with carbon buildup and fuel leak at nozzle tip',
      items: ['Carbon deposits on injector tip', 'Fuel seepage at body seal', 'Worn spray pattern visible', 'Copper washer damage'],
    },
    damage: {
      component: 'Diesel Fuel Injector',
      condition: 'Carbon fouling and seal failure',
      severity: 'moderate',
    },
    equipment: {
      brand: 'Bosch/Delphi Common Rail',
      model: 'Diesel Injection System',
    },
    diagnosis: {
      summary: 'The fuel injector shows excessive carbon buildup and a failing seal, causing poor atomization, black smoke, and fuel economy loss. This is typically caused by poor fuel quality or extended service intervals.',
      possibleCauses: [
        'Low quality fuel with high sulfur content',
        'Injector service interval exceeded (>4000 hours)',
        'Water contamination in fuel',
        'Failing injector return line',
        'Low injection pressure',
        'ECM calibration issues',
      ],
      affectedSystems: ['Fuel injection', 'Combustion', 'Emissions'],
    },
    solutions: {
      immediate: [
        {
          title: 'Reduce load and schedule service',
          steps: [
            'Reduce generator load to 50% if possible',
            'Monitor exhaust smoke color',
            'Check fuel filter for water contamination',
            'Schedule injector service within 50 hours',
          ],
          priority: 'medium',
        },
      ],
      repair: [
        {
          title: 'Remove and Test Injectors',
          steps: [
            'Clean area around injectors thoroughly',
            'Disconnect injector return lines and fuel supply',
            'Remove injector hold-down bolts (17mm socket)',
            'Carefully extract injectors using slide hammer if stuck',
            'Perform pop test: opening pressure should be 2900-3200 PSI',
            'Inspect spray pattern - should be fine mist, no drip',
            'Clean with ultrasonic cleaner if recoverable',
            'Replace copper sealing washers (ALWAYS new)',
            'Reinstall with torque spec: 25-30 ft-lbs',
          ],
          tools: ['Injector pop tester', 'Slide hammer', 'Torque wrench', '17mm socket', 'Ultrasonic cleaner'],
          estimatedTime: '3 hours',
          skillLevel: 'advanced',
        },
        {
          title: 'System Priming After Reinstallation',
          steps: [
            'Hand-prime fuel system using lift pump lever',
            'Crack injector lines at injectors',
            'Crank engine until fuel flows from each line',
            'Tighten lines to 22 ft-lbs',
            'Start engine and check for leaks',
            'Run for 10 minutes and recheck torque',
          ],
          tools: ['17mm flare nut wrench', 'Torque wrench', 'Shop towels'],
          estimatedTime: '30 minutes',
          skillLevel: 'intermediate',
        },
      ],
      preventive: [
        'Use high-quality, filtered diesel fuel',
        'Change fuel filters every 250 hours',
        'Drain water separator daily',
        'Add fuel conditioner/biocide quarterly',
        'Test injectors every 2000 hours',
      ],
    },
    partsNeeded: [
      { name: 'Injector Nozzle Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 35,000 - 55,000' },
      { name: 'Injector Copper Washer Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 1,500 - 2,500' },
      { name: 'Injector O-Ring Kit', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 2,000 - 3,500' },
      { name: 'Fuel Filter', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 2,500 - 4,000' },
    ],
    safetyWarnings: [
      'High pressure fuel system - do not work on running engine',
      'Diesel fuel is flammable - no open flames',
      'Injector spray can penetrate skin - extreme caution',
      'Clean work area prevents contamination',
    ],
  },

  avr_failure: {
    success: true,
    demoMode: true,
    analysisType: 'damaged_component',
    confidence: 90,
    detected: {
      description: 'AVR (Automatic Voltage Regulator) with burnt components and discolored board',
      items: ['Burnt resistors/capacitors', 'Heat discoloration on PCB', 'Damaged terminals', 'Smoke residue'],
    },
    damage: {
      component: 'SX460 Automatic Voltage Regulator',
      condition: 'Component failure with thermal damage',
      severity: 'critical',
    },
    equipment: {
      brand: 'Stamford',
      model: 'SX460 AVR',
    },
    diagnosis: {
      summary: 'The AVR has failed due to component burnout, likely from overvoltage, overload, or internal component failure. This causes loss of voltage regulation - output may be zero, too high, or fluctuating.',
      possibleCauses: [
        'Lightning strike or surge damage',
        'Persistent overload operation',
        'Loss of sensing signal',
        'Capacitor failure (aging)',
        'Poor ventilation causing overheating',
        'Moisture ingress in control panel',
      ],
      affectedSystems: ['Voltage regulation', 'Generator excitation', 'Load stability'],
    },
    solutions: {
      immediate: [
        {
          title: 'Shut down generator - Check for shorts',
          steps: [
            'Shut down generator immediately',
            'Disconnect all loads from generator',
            'Check for any burning smell or smoke',
            'Allow cooling for 30 minutes',
            'Do not attempt to restart until AVR replaced',
          ],
          priority: 'critical',
        },
      ],
      repair: [
        {
          title: 'Replace AVR',
          steps: [
            'Disconnect battery to remove all power',
            'Photograph all wiring connections before removal',
            'Label each wire with tape and marker',
            'Disconnect sensing wires (typically from auxiliary winding)',
            'Disconnect excitation wires (F+ and F-)',
            'Disconnect power input wires',
            'Remove mounting screws and old AVR',
            'Mount new AVR in same position',
            'Reconnect all wires per photograph/labels',
            'Double-check connections against wiring diagram',
            'Set voltage potentiometer to midpoint initially',
          ],
          tools: ['Screwdrivers (Phillips and flat)', 'Wire labels', 'Camera/phone', 'Multimeter', 'Wiring diagram'],
          estimatedTime: '1 hour',
          skillLevel: 'intermediate',
        },
        {
          title: 'Commission and Adjust Voltage',
          steps: [
            'Reconnect battery',
            'Start generator at no load',
            'Measure output voltage with multimeter',
            'Adjust VOLTS potentiometer to achieve 230V (or rated voltage)',
            'Apply 50% load and check voltage (should stay within 5%)',
            'Apply full load and verify stability',
            'Check UFRO (under-frequency rolloff) setting if applicable',
            'Run for 1 hour and recheck all values',
          ],
          tools: ['True RMS multimeter', 'Load bank (optional)', 'Small screwdriver for potentiometer'],
          estimatedTime: '1 hour',
          skillLevel: 'intermediate',
        },
      ],
      preventive: [
        'Install surge protection on generator output',
        'Ensure adequate ventilation in control panel',
        'Inspect AVR annually for signs of heat stress',
        'Keep control panel sealed from moisture',
        'Replace AVR preventatively every 15,000 hours',
      ],
    },
    partsNeeded: [
      { name: 'AVR SX460', partNumber: 'E000-24600', quantity: 1, estimated_cost: 'KES 15,000 - 22,000' },
      { name: 'Surge Protector SPD', partNumber: 'Phase/Neutral type', quantity: 1, estimated_cost: 'KES 8,000 - 15,000' },
    ],
    safetyWarnings: [
      'Disconnect all power before working on AVR',
      'Residual voltage may exist in capacitors - wait 5 minutes',
      'Do not touch terminals while generator is running',
      'High voltage present during operation - LETHAL',
    ],
  },
};

// Mock analysis for demo/development
function getMockAnalysis() {
  // Randomly select a scenario to demonstrate different analysis types
  const scenarios = Object.keys(MOCK_SCENARIOS);
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)] as keyof typeof MOCK_SCENARIOS;
  return MOCK_SCENARIOS[randomScenario];
}
