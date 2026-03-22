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

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE ENGINE COMPONENT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const ENGINE_COMPONENTS_DATABASE = {
  // CYLINDER HEAD ASSEMBLY
  cylinder_head: {
    names: ['cylinder head', 'head assembly', 'engine head'],
    subComponents: ['valve seat', 'valve guide', 'combustion chamber', 'coolant passages', 'oil passages', 'head bolt holes', 'injector bore', 'glow plug bore'],
    oemParts: {
      cummins: { part: '4941496', series: ['QSB6.7', 'QSL9', 'QSC8.3'] },
      caterpillar: { part: '3116-HEAD', series: ['3116', '3126', 'C7', 'C9', 'C13', 'C15'] },
      perkins: { part: 'CH12454', series: ['1104', '1106', '400D', '800D'] },
      johnDeere: { part: 'RE531805', series: ['4045', '6068', '6090'] },
      deutz: { part: '04290808', series: ['BF4M', 'BF6M', 'TCD'] },
    },
    inspection: ['crack testing', 'surface flatness', 'valve seat condition', 'guide clearance'],
    typicalIssues: ['cracks', 'warping', 'erosion', 'pitting', 'coolant leaks', 'gasket failure'],
  },

  // VALVE TRAIN COMPONENTS
  valve_spring: {
    names: ['valve spring', 'valve springs', 'spring retainer', 'spring assembly'],
    oemParts: {
      cummins: { part: '3943198', specs: 'Free length: 56mm, Installed: 44mm @ 85lbs' },
      caterpillar: { part: '1W7669', specs: 'Free length: 58mm, Installed: 46mm @ 90lbs' },
      perkins: { part: 'T417844', specs: 'Free length: 52mm' },
    },
    inspection: ['free length', 'squareness', 'tension test', 'coil spacing'],
    typicalIssues: ['fatigue failure', 'loss of tension', 'broken coils', 'surge damage'],
    associatedParts: ['spring retainer', 'valve keeper', 'valve rotator', 'spring seat'],
  },

  valve: {
    names: ['intake valve', 'exhaust valve', 'engine valve', 'valve head'],
    types: ['intake', 'exhaust'],
    oemParts: {
      cummins_intake: { part: '3943252', diameter: '44mm' },
      cummins_exhaust: { part: '3943253', diameter: '38mm' },
      caterpillar: { part: '1W5116' },
    },
    inspection: ['stem diameter', 'face angle', 'margin thickness', 'stem tip wear'],
    typicalIssues: ['burnt face', 'stem wear', 'carbon deposits', 'bent stem', 'erosion'],
  },

  rocker_arm: {
    names: ['rocker arm', 'rocker assembly', 'valve rocker'],
    oemParts: { cummins: { part: '3943246' }, caterpillar: { part: '1W2812' } },
    inspection: ['pad wear', 'bushing clearance', 'shaft wear', 'adjusting screw'],
    typicalIssues: ['pad wear', 'shaft seizure', 'bushing failure'],
  },

  camshaft: {
    names: ['camshaft', 'cam', 'cam lobes'],
    inspection: ['lobe lift', 'journal diameter', 'straightness', 'keyway condition'],
    typicalIssues: ['lobe wear', 'scoring', 'spalling', 'timing gear wear'],
  },

  // PISTON ASSEMBLY
  piston: {
    names: ['piston', 'piston assembly', 'piston crown', 'piston skirt'],
    oemParts: {
      cummins: { part: '4941395', grades: 'Standard, +0.25mm, +0.50mm' },
      caterpillar: { part: '1972179' },
      perkins: { part: 'U5LP0035' },
    },
    inspection: ['crown condition', 'ring grooves', 'pin bore', 'skirt wear pattern'],
    typicalIssues: ['crown erosion', 'ring groove wear', 'scuffing', 'cracks', 'pin bore wear'],
    associatedParts: ['piston rings', 'piston pin', 'circlips', 'connecting rod'],
  },

  piston_ring: {
    names: ['piston ring', 'compression ring', 'oil ring', 'ring set'],
    types: ['top compression', 'second compression', 'oil control'],
    oemParts: { cummins: { part: '3943447' }, caterpillar: { part: '1979579' } },
    inspection: ['end gap', 'side clearance', 'face wear', 'tension'],
    typicalIssues: ['stuck rings', 'broken rings', 'excessive wear', 'blow-by'],
  },

  connecting_rod: {
    names: ['connecting rod', 'con rod', 'rod assembly'],
    oemParts: { cummins: { part: '3943446' }, caterpillar: { part: '1979457' } },
    inspection: ['big end bore', 'small end bore', 'straightness', 'twist', 'weight'],
    typicalIssues: ['bearing failure', 'bend', 'twist', 'bolt fatigue'],
    associatedParts: ['rod bearing', 'rod bolt', 'bushing'],
  },

  // CRANKSHAFT ASSEMBLY
  crankshaft: {
    names: ['crankshaft', 'crank', 'main journals', 'rod journals'],
    inspection: ['journal diameter', 'out-of-round', 'taper', 'hardness', 'crack detection'],
    typicalIssues: ['journal wear', 'scoring', 'fatigue cracks', 'keyway damage'],
  },

  main_bearing: {
    names: ['main bearing', 'main bearings', 'crankshaft bearing'],
    oemParts: { cummins: { part: '3943470', grades: 'STD, -0.25, -0.50' } },
    inspection: ['visual condition', 'clearance', 'crush height', 'spread'],
    typicalIssues: ['scoring', 'fatigue', 'overlay wear', 'spalling'],
  },

  // FUEL SYSTEM
  injector: {
    names: ['fuel injector', 'injector', 'diesel injector', 'nozzle'],
    oemParts: {
      cummins: { part: '4903319', type: 'common rail' },
      caterpillar: { part: '3879427', type: 'HEUI' },
      bosch: { part: '0445120231', type: 'common rail' },
    },
    inspection: ['spray pattern', 'opening pressure', 'leak-back', 'resistance'],
    typicalIssues: ['clogged nozzle', 'worn seat', 'stuck needle', 'internal leakage'],
  },

  injection_pump: {
    names: ['injection pump', 'fuel pump', 'high pressure pump', 'CP pump'],
    oemParts: { bosch: { part: '0445020150' }, delphi: { part: '9422A060A' } },
    inspection: ['output pressure', 'timing', 'metering', 'leakage'],
    typicalIssues: ['worn plungers', 'seized elements', 'timing drift', 'low pressure'],
  },

  // TURBOCHARGER
  turbocharger: {
    names: ['turbocharger', 'turbo', 'turbine', 'compressor wheel'],
    oemParts: {
      holset: { part: 'HX35', series: 'Cummins 6BT, 6CT' },
      garrett: { part: 'GT3582R', series: 'Various' },
      borgwarner: { part: 'S300', series: 'CAT, John Deere' },
    },
    inspection: ['shaft play', 'wheel condition', 'housing cracks', 'wastegate operation'],
    typicalIssues: ['shaft wear', 'compressor surge', 'oil leakage', 'boost loss'],
  },

  // COOLING SYSTEM
  water_pump: {
    names: ['water pump', 'coolant pump', 'pump assembly'],
    oemParts: { cummins: { part: '5473172' }, caterpillar: { part: '3520205' } },
    inspection: ['seal condition', 'bearing play', 'impeller', 'weep hole'],
    typicalIssues: ['seal failure', 'bearing noise', 'cavitation damage', 'impeller erosion'],
  },

  thermostat: {
    names: ['thermostat', 'engine thermostat', 'temp regulator'],
    oemParts: { cummins: { part: '3076489', temp: '82°C/180°F' } },
    inspection: ['opening temperature', 'full open temp', 'valve stroke'],
    typicalIssues: ['stuck closed', 'stuck open', 'no seal', 'incorrect temp'],
  },

  radiator: {
    names: ['radiator', 'cooling radiator', 'heat exchanger'],
    inspection: ['fin condition', 'tube blockage', 'tank condition', 'pressure test'],
    typicalIssues: ['blocked tubes', 'fin damage', 'leaks', 'corrosion'],
  },

  // ELECTRICAL
  starter_motor: {
    names: ['starter motor', 'starter', 'cranking motor'],
    oemParts: { delco_remy: { part: '10461758' }, bosch: { part: '0001231008' } },
    inspection: ['current draw', 'solenoid operation', 'brush length', 'commutator'],
    typicalIssues: ['worn brushes', 'solenoid failure', 'drive gear damage', 'overheating'],
  },

  alternator: {
    names: ['alternator', 'generator', 'charging alternator'],
    oemParts: { delco_remy: { part: '19020386' }, bosch: { part: '0124655006' } },
    inspection: ['output voltage', 'current', 'diodes', 'brush wear', 'bearing'],
    typicalIssues: ['diode failure', 'worn brushes', 'bearing noise', 'low output'],
  },

  // SENSORS
  sensors: {
    names: ['sensor', 'temperature sensor', 'pressure sensor', 'speed sensor'],
    types: ['coolant temp', 'oil pressure', 'fuel pressure', 'boost pressure', 'crank position', 'cam position'],
    inspection: ['resistance', 'voltage output', 'wiring', 'connector condition'],
    typicalIssues: ['drift', 'intermittent signal', 'corrosion', 'physical damage'],
  },

  // GASKETS & SEALS
  head_gasket: {
    names: ['head gasket', 'cylinder head gasket', 'MLS gasket'],
    oemParts: { cummins: { part: '4932209' }, caterpillar: { part: '3116HG' } },
    inspection: ['combustion leakage', 'coolant contamination', 'external leaks'],
    typicalIssues: ['blown gasket', 'fire ring failure', 'coolant passage leak', 'oil leak'],
  },

  // OIL SYSTEM
  oil_pump: {
    names: ['oil pump', 'lubrication pump', 'engine oil pump'],
    inspection: ['pressure output', 'gear backlash', 'housing wear', 'relief valve'],
    typicalIssues: ['wear', 'cavitation', 'relief valve stuck', 'low pressure'],
  },

  oil_filter: {
    names: ['oil filter', 'lube filter', 'full-flow filter'],
    oemParts: { fleetguard: { part: 'LF9009' }, caterpillar: { part: '1R0716' } },
    inspection: ['bypass condition', 'media condition', 'contamination'],
    typicalIssues: ['clogged', 'bypass open', 'collapsed media'],
  },

  // EXHAUST
  exhaust_manifold: {
    names: ['exhaust manifold', 'manifold', 'exhaust header'],
    inspection: ['cracks', 'warping', 'stud condition', 'gasket surface'],
    typicalIssues: ['cracks', 'warped flanges', 'broken studs', 'gasket leaks'],
  },
};

// System prompt for generator diagnostic analysis
const DIAGNOSTIC_SYSTEM_PROMPT = `You are an expert generator and diesel engine diagnostic technician with 30+ years of field experience across Africa, Middle East, and Asia.
You specialize in analyzing visual information from generators, controllers, diesel engines, and all related components.

CRITICAL: Your job is to provide 100% ACTIONABLE, DETAILED SOLUTIONS - not vague suggestions.

═══════════════════════════════════════════════════════════════════════════════
COMPONENT IDENTIFICATION DATABASE - MEMORIZE THIS FOR ACCURATE IDENTIFICATION:
═══════════════════════════════════════════════════════════════════════════════

ENGINE INTERNAL COMPONENTS:
• CYLINDER HEAD - Cast iron/aluminum component with valve seats, coolant passages, injector bores
  - Sub-components: valve seats, valve guides, combustion chamber, head bolt holes

• VALVE SPRINGS - Coiled steel springs that close valves, sits around valve stem
  - Types: inner spring, outer spring, spring retainer, valve keepers/collets
  - Visual: coiled steel, typically 2 per valve, may have damper springs

• VALVES - Intake (larger) and Exhaust (smaller, may be sodium-filled)
  - Identify by: head diameter, stem length, face angle, carbon deposits

• ROCKER ARMS - Lever mechanism that transfers cam motion to valves
  - Types: stamped steel, forged, roller tip

• CAMSHAFT - Shaft with lobes that actuate valves
  - Visual: multiple lobes, journals, timing gear on end

• PISTONS - Cylindrical with crown, ring grooves, pin bore
  - Types: flat top, bowl, articulated
  - Check for: crown erosion, ring groove wear, skirt scuffing

• PISTON RINGS - Compression (top 2) and Oil Control (bottom)
  - Check: end gap, side clearance, face condition

• CONNECTING RODS - Link piston to crankshaft
  - Check: big end bore, small end bushing, bolt condition

• CRANKSHAFT - Main rotating assembly with journals
  - Check: journal wear, scratches, hardness

• BEARINGS - Main and Rod bearings, shells or bushings
  - Visual: overlay condition, scratches, embedded particles

FUEL SYSTEM:
• INJECTORS - Precision fuel delivery, identify by electrical connector and fuel line
• INJECTION PUMP - High pressure pump, timing marks, fuel lines out
• FUEL FILTERS - Primary and Secondary, spin-on or cartridge

TURBOCHARGER:
• Visual: Compressor housing (cold side), turbine housing (hot side), center section

COOLING:
• WATER PUMP - Belt-driven, weep hole indicator
• THERMOSTAT - Wax pellet type in housing
• RADIATOR - Fin and tube construction

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
    const { image, images, context, mode, generatorMake, generatorModel, enhancedAnalysis } = await request.json();

    // Support single image or multiple images
    const imageData = images?.[0] || image;

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Create hint from mode, context, and generator info for smart mock matching
    const analysisHint = [
      mode || '',
      context || '',
      generatorMake || '',
      generatorModel || '',
    ].filter(Boolean).join(' ');

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('AI Visual Diagnostic: No API key configured, using demo mode');
      // Return mock analysis for demo/development with flag indicating demo mode
      // Use smart matching based on context and mode
      const mockResult = getMockAnalysis(analysisHint);

      // Enhance mock result with generator info if provided
      if (generatorMake || generatorModel) {
        mockResult.equipment = {
          ...mockResult.equipment,
          brand: generatorMake || mockResult.equipment?.brand || 'Unknown',
          model: generatorModel || mockResult.equipment?.model || 'Unknown',
        };
      }

      return NextResponse.json({
        success: true,
        demoMode: true,
        message: 'Running in demo mode - configure ANTHROPIC_API_KEY for live AI analysis',
        result: mockResult,
      });
    }

    const image_to_analyze = imageData;

    // Extract base64 data from data URL
    const base64Data = image_to_analyze.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = image_to_analyze.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Enhanced user prompt with context, mode, and generator info
    const userPrompt = `Analyze this generator/diesel engine image and provide a COMPLETE, DETAILED diagnosis.

${generatorMake || generatorModel ? `GENERATOR/ENGINE INFO: ${generatorMake || ''} ${generatorModel || ''}` : ''}
${mode ? `ANALYSIS MODE: ${mode} - Focus on ${mode === 'part_id' ? 'identifying parts with OEM numbers' : mode === 'predictive' ? 'predicting component lifespan and failure risk' : mode === 'component' ? 'identifying all visible components' : mode === 'damage' ? 'assessing damage severity' : mode === 'thermal' ? 'analyzing thermal patterns' : mode === 'fluid' ? 'analyzing fluid condition' : mode === 'wiring' ? 'inspecting wiring' : mode === 'nameplate' ? 'reading equipment specifications' : 'general analysis'}` : ''}

IMPORTANT REQUIREMENTS:
1. IDENTIFY ALL VISIBLE COMPONENTS - Be specific about what you see (e.g., "cylinder head", "valve springs", "piston", "turbocharger")
2. For EACH component identified, provide:
   - Component name
   - Condition assessment
   - OEM part numbers for the specified generator brand
   - Cross-reference numbers from other brands
   - Typical specifications
3. If you see a controller display with fault codes, identify EVERY code visible and provide COMPLETE solutions for each
4. If you see damaged components, assess the EXACT damage condition and provide SPECIFIC repair procedures with tools and parts
5. If you see a nameplate, extract ALL equipment information (brand, model, serial, kW, voltage, frequency, etc.)

${context ? `Additional context from technician: ${context}` : ''}

CRITICAL: Be thorough and specific. Technicians in the field need:
- Exact component identification (NOT generic descriptions)
- OEM part numbers specific to ${generatorMake || 'the identified'} ${generatorModel || 'engine'}
- Step-by-step repair procedures (numbered steps)
- Required tools with sizes
- Test values and specifications
- Predictive maintenance recommendations
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

// Additional Engine Component Scenarios
const ENGINE_COMPONENT_SCENARIOS = {
  cylinder_head: {
    success: true,
    demoMode: true,
    analysisType: 'component_identification',
    confidence: 98,
    detected: {
      description: 'Diesel engine cylinder head with valve assemblies and springs visible',
      items: ['Cylinder head casting', 'Valve springs (intake and exhaust)', 'Valve spring retainers', 'Valve keepers/collets', 'Combustion chambers', 'Valve seats', 'Valve guides', 'Head bolt holes', 'Coolant passages'],
    },
    equipment: {
      brand: 'Cummins',
      model: 'QSB6.7 / 6BT Series',
      type: 'Inline 6-Cylinder Diesel Engine',
    },
    componentIdentification: {
      primaryComponent: 'Cylinder Head Assembly',
      subComponents: [
        { name: 'Valve Springs', quantity: 12, condition: 'Requires inspection', specs: 'Free length: 56mm, Installed: 44mm @ 85lbs' },
        { name: 'Intake Valves', quantity: 6, condition: 'Check for carbon buildup', specs: 'Head diameter: 44mm' },
        { name: 'Exhaust Valves', quantity: 6, condition: 'Check for burning/erosion', specs: 'Head diameter: 38mm' },
        { name: 'Valve Spring Retainers', quantity: 12, condition: 'Check for cracks', specs: 'Steel, hardened' },
        { name: 'Valve Keepers/Collets', quantity: 24, condition: 'Check for wear grooves', specs: '3-groove design' },
      ],
      oemPartNumbers: {
        cylinderHead: { part: '4941496', brand: 'Cummins', price: 'KES 185,000 - 250,000' },
        valveSpringSet: { part: '3943198', brand: 'Cummins', price: 'KES 12,000 - 18,000' },
        intakeValve: { part: '3943252', brand: 'Cummins', price: 'KES 3,500 per valve' },
        exhaustValve: { part: '3943253', brand: 'Cummins', price: 'KES 4,200 per valve' },
        headGasketSet: { part: '4932209', brand: 'Cummins', price: 'KES 25,000 - 35,000' },
        valveGuideSet: { part: '3943180', brand: 'Cummins', price: 'KES 15,000 - 22,000' },
      },
      crossReferences: [
        { brand: 'Caterpillar', headPart: 'C6.6-HEAD', equivalent: 'Similar design' },
        { brand: 'Perkins', headPart: 'CH12454', equivalent: '1106D series' },
        { brand: 'John Deere', headPart: 'RE531805', equivalent: '6068 series' },
      ],
    },
    diagnosis: {
      summary: 'Cylinder head assembly identified with valve train components. Inspection recommended to assess valve spring tension, valve seating, and gasket surfaces before reassembly.',
      possibleCauses: [
        'If removed for overhaul: check for warping with straightedge',
        'Measure valve spring free length - replace if <52mm',
        'Check valve stem-to-guide clearance',
        'Inspect combustion chamber for cracks',
        'Verify valve seat condition',
      ],
      affectedSystems: ['Engine top-end', 'Valve train', 'Cooling system', 'Compression'],
    },
    solutions: {
      immediate: [
        {
          title: 'Cylinder Head Inspection Procedure',
          steps: [
            'Clean all surfaces with approved solvent - do not use wire brush on gasket surfaces',
            'Check head flatness with precision straightedge and feeler gauges',
            'Maximum warpage: 0.10mm (0.004") for 6-cylinder head',
            'If warped, machine or replace - do not exceed maximum deck height reduction',
            'Visually inspect for cracks in combustion chambers and coolant passages',
            'Pressure test head at 275 kPa (40 PSI) for 10 minutes',
          ],
          priority: 'high',
        },
      ],
      repair: [
        {
          title: 'Valve Spring Testing & Replacement',
          steps: [
            'Remove valve spring retainer and keepers using valve spring compressor',
            'Measure free length of each spring - specification: 56mm minimum',
            'Test spring tension at installed height (44mm) - should be 85 lbs minimum',
            'Check spring squareness - maximum out-of-square: 1.5mm',
            'Replace any spring below specification',
            'Inspect retainers for cracks or wear',
            'Check keepers/collets for wear grooves - replace if worn',
            'Lubricate valve stems before reassembly',
            'Install keepers with spring compressed - verify proper seating',
          ],
          tools: ['Valve spring compressor', 'Spring tension tester', 'Dial caliper', 'Magnetic keeper installer', 'Torque wrench'],
          estimatedTime: '3 hours for complete valve train',
          skillLevel: 'advanced',
        },
        {
          title: 'Cylinder Head Installation',
          steps: [
            'Clean cylinder block deck surface thoroughly',
            'Install new head gasket - DRY, no sealant',
            'Position cylinder head carefully',
            'Install new head bolts - never reuse torque-to-yield bolts',
            'Torque in sequence: Step 1: 40 Nm, Step 2: 80 Nm, Step 3: +90°, Step 4: +90°',
            'Install pushrods, rocker arms, and valve bridges',
            'Adjust valve lash: Intake 0.30mm, Exhaust 0.61mm (engine cold)',
            'Install fuel injectors with new sealing washers',
            'Connect all coolant and oil passages',
            'Prime oil system before starting',
          ],
          tools: ['Torque wrench (Nm)', 'Torque angle gauge', 'Feeler gauges', 'Service manual', 'Head bolt sequence diagram'],
          estimatedTime: '6-8 hours complete assembly',
          skillLevel: 'advanced',
        },
      ],
      preventive: [
        'Change coolant every 2 years or 3,000 hours using correct SCA concentration',
        'Avoid rapid temperature changes - warm up and cool down properly',
        'Use quality fuel to prevent injector tip carbon buildup',
        'Check and adjust valve lash every 1,000 hours',
        'Monitor coolant level and condition weekly',
      ],
    },
    partsNeeded: [
      { name: 'Valve Spring Set (12 pcs)', partNumber: '3943198', quantity: 1, estimated_cost: 'KES 12,000 - 18,000' },
      { name: 'Head Gasket Set', partNumber: '4932209', quantity: 1, estimated_cost: 'KES 25,000 - 35,000' },
      { name: 'Valve Keeper/Collet Set', partNumber: '3943194', quantity: 1, estimated_cost: 'KES 4,500 - 6,500' },
      { name: 'Head Bolt Set (new)', partNumber: '3943630', quantity: 1, estimated_cost: 'KES 8,000 - 12,000' },
      { name: 'Valve Stem Seals Set', partNumber: '3943182', quantity: 1, estimated_cost: 'KES 3,500 - 5,000' },
    ],
    safetyWarnings: [
      'Cylinder head is heavy (50+ kg) - use proper lifting equipment',
      'Never use compressed air in spark plug/injector holes without securing head',
      'Torque-to-yield bolts MUST be replaced - reuse causes failure',
      'Allow engine to cool completely before removal to prevent warping',
    ],
    specifications: {
      headFlatness: 'Maximum 0.10mm (0.004") variance',
      surfaceFinish: '1.6 - 3.2 Ra (microinches: 63-125)',
      valveSinkLimit: 'Maximum 1.5mm below head surface',
      springFreeLength: '56mm minimum',
      springTension: '85 lbs @ 44mm installed height',
      intakeValveDiameter: '44mm',
      exhaustValveDiameter: '38mm',
      valveStemDiameter: '8mm',
      guideClearance: '0.025-0.076mm',
    },
  },

  valve_springs: {
    success: true,
    demoMode: true,
    analysisType: 'component_identification',
    confidence: 97,
    detected: {
      description: 'Engine valve springs with retainers visible - diesel engine valve train components',
      items: ['Valve springs (coiled)', 'Spring retainers (steel caps)', 'Valve keepers/collets', 'Spring seats', 'Inner damper springs (if equipped)'],
    },
    equipment: {
      brand: 'Diesel Engine',
      model: 'Common Design - Multiple Manufacturers',
      type: 'Valve Train Components',
    },
    componentIdentification: {
      primaryComponent: 'Valve Spring Assembly',
      specifications: {
        springType: 'Single or Dual (with inner damper)',
        material: 'Chrome-silicon or Chrome-vanadium steel',
        coating: 'Shot-peened with phosphate coating',
        wiresPerInch: 'Progressive rate common on diesel',
      },
      oemPartNumbers: {
        cummins: { part: '3943198', engine: 'QSB/QSL', price: 'KES 1,500-2,000/spring' },
        caterpillar: { part: '1W7669', engine: 'C7/C9/C13', price: 'KES 1,800-2,500/spring' },
        perkins: { part: 'T417844', engine: '1104/1106', price: 'KES 1,200-1,800/spring' },
        johnDeere: { part: 'R520354', engine: '4045/6068', price: 'KES 1,400-2,000/spring' },
        generic: { part: 'VS-DIESEL-56', specs: '56mm free length', price: 'KES 800-1,200/spring' },
      },
    },
    diagnosis: {
      summary: 'Valve springs identified. These are critical components that maintain valve closure. Springs weaken over time due to heat cycles and fatigue.',
      inspectionRequired: [
        'Measure free length - compare to specification',
        'Test tension at installed height using spring tester',
        'Check squareness on flat surface',
        'Look for rust, pitting, or corrosion',
        'Check for any cracks or broken coils',
      ],
      failureSigns: [
        'Engine misfires at high RPM',
        'Loss of power',
        'Valve float symptoms',
        'Unusual valve train noise',
        'Failed emissions test',
      ],
    },
    solutions: {
      immediate: [
        {
          title: 'Valve Spring Inspection Procedure',
          steps: [
            'Remove valve spring using proper compressor tool',
            'Measure free length with calibrated caliper',
            'Compare to specification: typically 52-58mm for diesel engines',
            'If more than 2mm below spec, replace the spring',
            'Test spring tension if tester available',
            'Visual check for rust, pitting, or scoring',
            'Check spring squareness - max 1.5mm lean',
          ],
          priority: 'high',
        },
      ],
      repair: [
        {
          title: 'Valve Spring Replacement',
          steps: [
            'Rotate engine to TDC for cylinder being serviced',
            'Apply shop air to cylinder through spark plug hole to hold valves up (alternative: use rope through plug hole)',
            'Install valve spring compressor and compress spring',
            'Remove keepers using magnetic tool',
            'Remove retainer and spring',
            'Inspect valve stem for wear',
            'Install new spring with tight coils toward head',
            'Install retainer and keepers',
            'Release compressor slowly, verify keepers are seated',
            'Tap retainer gently with plastic hammer to seat keepers',
          ],
          tools: ['Valve spring compressor', 'Magnetic keeper tool', 'Shop air with adapter', 'Plastic hammer', 'Caliper'],
          estimatedTime: '30 minutes per valve',
          skillLevel: 'intermediate',
        },
      ],
      preventive: [
        'Replace all valve springs during major overhaul',
        'Use correct RPM range - avoid over-revving',
        'Maintain proper valve lash to prevent excessive spring stress',
        'Avoid overheating - damages spring temper',
      ],
    },
    partsNeeded: [
      { name: 'Valve Spring (individual)', partNumber: 'Engine-specific', quantity: 12, estimated_cost: 'KES 1,500 - 2,500 each' },
      { name: 'Valve Spring Set (all 12)', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 12,000 - 25,000' },
      { name: 'Valve Keepers/Collets Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 4,000 - 6,000' },
      { name: 'Spring Retainer Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 5,000 - 8,000' },
    ],
    safetyWarnings: [
      'Compressed valve springs store extreme energy - use proper tools',
      'Never put face near compressed spring - can eject keepers with force',
      'Wear safety glasses at all times during this procedure',
      'Ensure valve is held up before releasing spring pressure',
    ],
  },

  piston_assembly: {
    success: true,
    demoMode: true,
    analysisType: 'component_identification',
    confidence: 96,
    detected: {
      description: 'Diesel engine piston with rings, pin, and connecting rod assembly',
      items: ['Piston crown', 'Ring grooves (3)', 'Compression rings (2)', 'Oil control ring', 'Piston pin/wrist pin', 'Circlips', 'Connecting rod', 'Rod bearings'],
    },
    equipment: {
      brand: 'Diesel Engine',
      model: 'Common Design - Multiple Manufacturers',
      type: 'Reciprocating Assembly Components',
    },
    componentIdentification: {
      primaryComponent: 'Piston and Connecting Rod Assembly',
      oemPartNumbers: {
        cummins: { piston: '4941395', rings: '3943447', rod: '3943446', bearing: '3943471' },
        caterpillar: { piston: '1972179', rings: '1979579', rod: '1979457' },
        perkins: { piston: 'U5LP0035', rings: 'U5LR0004' },
      },
    },
    diagnosis: {
      summary: 'Piston assembly components identified. Critical inspection points include ring groove wear, pin bore condition, and rod bearing clearance.',
      inspectionRequired: [
        'Measure piston-to-bore clearance',
        'Check ring end gap and side clearance',
        'Inspect pin bore for wear',
        'Check rod big end bore diameter',
        'Measure rod bearing clearance with Plastigage',
      ],
    },
    partsNeeded: [
      { name: 'Piston Kit (with rings & pin)', partNumber: 'Engine-specific', quantity: 6, estimated_cost: 'KES 15,000 - 25,000 each' },
      { name: 'Piston Ring Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 18,000 - 28,000 per set' },
      { name: 'Rod Bearing Set', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 12,000 - 18,000' },
    ],
  },

  turbocharger: {
    success: true,
    demoMode: true,
    analysisType: 'component_identification',
    confidence: 95,
    detected: {
      description: 'Diesel engine turbocharger assembly with compressor and turbine sections',
      items: ['Compressor housing (cold side)', 'Turbine housing (hot side)', 'Center section/CHRA', 'Wastegate actuator', 'Oil inlet line', 'Oil drain', 'Inlet/outlet flanges'],
    },
    equipment: {
      brand: 'Holset/Garrett/BorgWarner',
      model: 'Common Diesel Turbocharger',
      type: 'Exhaust-Driven Forced Induction',
    },
    componentIdentification: {
      primaryComponent: 'Turbocharger Assembly',
      oemPartNumbers: {
        holset: { part: 'HX35', engine: 'Cummins 6BT/6CT', price: 'KES 65,000 - 95,000' },
        garrett: { part: 'GT3582R', engine: 'Various', price: 'KES 55,000 - 85,000' },
        borgwarner: { part: 'S300', engine: 'CAT/JD', price: 'KES 70,000 - 100,000' },
      },
    },
    diagnosis: {
      summary: 'Turbocharger identified. Check for shaft play, oil leakage, and boost pressure. Most turbo failures are caused by oil starvation or contamination.',
      inspectionRequired: [
        'Check shaft radial play (should be <0.15mm)',
        'Check shaft axial play (should be <0.05mm)',
        'Inspect compressor wheel for damage',
        'Check for oil in intake or exhaust',
        'Verify wastegate operation',
      ],
    },
    partsNeeded: [
      { name: 'Turbocharger Assembly (new)', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 65,000 - 120,000' },
      { name: 'Turbocharger Rebuild Kit', partNumber: 'CHRA-specific', quantity: 1, estimated_cost: 'KES 25,000 - 40,000' },
      { name: 'Oil Feed Line', partNumber: 'Engine-specific', quantity: 1, estimated_cost: 'KES 3,500 - 6,000' },
    ],
  },
};

// Merge all scenarios
const ALL_SCENARIOS = {
  ...MOCK_SCENARIOS,
  ...ENGINE_COMPONENT_SCENARIOS,
};

// Smart mock analysis that tries to match image context
function getMockAnalysis(imageHint?: string) {
  // If we have a hint about the image, try to match scenario
  if (imageHint) {
    const hint = imageHint.toLowerCase();
    if (hint.includes('valve') || hint.includes('spring')) {
      return ENGINE_COMPONENT_SCENARIOS.valve_springs;
    }
    if (hint.includes('cylinder') || hint.includes('head')) {
      return ENGINE_COMPONENT_SCENARIOS.cylinder_head;
    }
    if (hint.includes('piston') || hint.includes('ring') || hint.includes('rod')) {
      return ENGINE_COMPONENT_SCENARIOS.piston_assembly;
    }
    if (hint.includes('turbo')) {
      return ENGINE_COMPONENT_SCENARIOS.turbocharger;
    }
    if (hint.includes('injector') || hint.includes('nozzle')) {
      return MOCK_SCENARIOS.injector_problem;
    }
    if (hint.includes('avr') || hint.includes('voltage')) {
      return MOCK_SCENARIOS.avr_failure;
    }
    if (hint.includes('wire') || hint.includes('cable') || hint.includes('burn')) {
      return MOCK_SCENARIOS.damaged_component;
    }
  }

  // Default: randomly select from all scenarios
  const scenarios = Object.keys(ALL_SCENARIOS);
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)] as keyof typeof ALL_SCENARIOS;
  return ALL_SCENARIOS[randomScenario];
}
