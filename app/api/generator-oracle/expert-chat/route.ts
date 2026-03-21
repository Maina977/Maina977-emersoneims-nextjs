import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  buildExpertSystemPrompt,
  findMatchingTemplate,
  findKnowledgeBaseEntry,
  formatTemplateForAI,
  formatKnowledgeBaseForAI,
  getFollowUpQuestions,
  getEngagementPrompt,
  type ConversationContext,
} from '@/lib/generator-oracle/aiExpertSystem';

/**
 * EXPERT AI CHAT API ENDPOINT
 *
 * This is the core of Generator Oracle's value proposition.
 * It provides AI-powered diagnosis WITHOUT any external hardware.
 *
 * The AI acts as a 30-year veteran generator technician who can:
 * - Diagnose problems through intelligent questioning
 * - Provide step-by-step repair procedures
 * - Explain fault codes from ANY controller
 * - Estimate repair costs
 * - Guide ECM/ECU procedures
 *
 * Enhanced with:
 * - Clarifying questions before answers
 * - Understanding checks
 * - Follow-up prompts
 * - Proactive suggestions
 * - Part numbers and tool requirements
 * - Safety warnings
 */

// Comprehensive generator knowledge for the AI
const GENERATOR_KNOWLEDGE = `
## SUPPORTED MANUFACTURERS

### Engine Manufacturers:
- Cummins (QSB, QSK, QSM, QSX, QST, ISB, ISC, ISL, ISM, ISX, B-series, C-series, N14, K-series, VTA)
- Caterpillar (C-series: C4.4, C7, C9, C13, C15, C18, C27, C32 | 3500 series | 3400 series)
- Volvo Penta (TAD series, TWD series, D-series)
- Perkins (400 series, 800 series, 1100 series, 1200 series, 1500 series, 2000 series, 4000 series)
- John Deere (4045, 6068, 6090, PowerTech, Tier 4)
- Deutz (TCD series, BFM series, air-cooled F-series)
- MTU (2000 series, 4000 series, Tognum)
- MAN (D-series, E-series)
- Doosan (DV, DP series)
- Yanmar (TNV, TNM series)
- Kubota (D-series, V-series)
- Kohler (Command PRO, Aegis, Diesel)
- Honda (GX series)
- Lister Petter (Alpha, Delta, TR, TS series)
- Iveco/FPT (Cursor, NEF, F-series)
- Weichai (WP series)
- SDEC (SC series)
- Mitsubishi (S-series)
- Isuzu (4J, 6H, 6W series)

### Controller Manufacturers:
- Deep Sea Electronics (DSE 3xxx, 4xxx, 5xxx, 6xxx, 7xxx, 8xxx series)
- ComAp (InteliGen, InteliLite, InteliSys, InteliDrive, MRS series)
- Woodward (EasyGen, GCP, SPM)
- SmartGen (HGM series 6xxx, 7xxx, 8xxx, 9xxx)
- Datakom (DKG series, D-series)
- Lovato (RGK series)
- Bernini (BE series)
- DEIF (AGC series)
- Comap (InteliCompact)
- Sices (GC series)

### Alternator Manufacturers:
- Stamford (HCI, UCI, MVC, PI series)
- Leroy Somer (LSA series)
- Mecc Alte (ECO, ECP series)
- Marathon (DVR, Magnaplus)
- Linz Electric (PRO, SLS series)
- Marelli Motori (MJB series)

## COMMON FAULT CODE RANGES BY CONTROLLER

### Deep Sea Electronics (DSE)
- 100-199: Utility/Mains faults
- 200-299: Generator/load faults
- 300-399: Engine faults
- 400-499: Communication faults
- 500-599: System faults
- 1000+: Warning alarms

### ComAp Controllers
- 1-99: System alarms
- 100-199: Engine protection
- 200-299: Electrical protection
- 300-399: Generator protection
- 400-499: Communication

### SmartGen (HGM Series)
- Single digit: Critical shutdowns
- 10-30: Engine protection
- 30-50: Electrical faults
- 50-70: Communication
- 70-90: System warnings

## J1939 CAN BUS DIAGNOSTIC CODES

### Common SPNs (Suspect Parameter Numbers):
- 91: Throttle Position
- 100: Oil Pressure
- 102: Turbo Boost Pressure
- 110: Engine Coolant Temperature
- 157: Injector Metering Rail Pressure
- 174: Fuel Temperature
- 190: Engine Speed
- 247: Vehicle Reference Speed
- 520: Engine Hours
- 524: Status Lamp Codes
- 639: J1939 Network Info
- 723: Secondary Engine Speed
- 2791: Engine Protection Shutdown Override

### Common FMIs (Failure Mode Indicators):
- 0: Data Valid But Above Normal Range
- 1: Data Valid But Below Normal Range
- 2: Data Erratic, Intermittent, or Incorrect
- 3: Voltage Above Normal or Shorted High
- 4: Voltage Below Normal or Shorted Low
- 5: Current Below Normal or Open Circuit
- 6: Current Above Normal or Grounded Circuit
- 7: Mechanical System Not Responding
- 8: Abnormal Frequency
- 9: Abnormal Update Rate
- 10: Abnormal Rate of Change
- 11: Failure Not Identifiable
- 12: Bad Intelligent Device or Component
- 13: Out of Calibration
- 14: Special Instructions
- 15-19: Reserved
- 20-30: Manufacturer Specific
- 31: Condition Exists

## ECM/ECU RESET AND CALIBRATION

### Cummins INSITE Required Tasks (Software-Guided):
1. Engine Parameter Adjustment
2. Speed/Governor Configuration
3. Protection System Calibration
4. Idle Speed Adjustment
5. High Idle Speed Setting
6. Fan Control Parameters
7. PTO Configuration

### Caterpillar ET Software Tasks:
1. Parameter Configuration
2. Timing Calibration
3. Speed Control Setup
4. Protection Limits
5. Diagnostic Tests

### General ECM Reset Procedure (Most Manufacturers):
1. Turn ignition to OFF
2. Disconnect negative battery terminal
3. Wait 30 seconds
4. Press and hold starter button for 30 seconds (drains capacitors)
5. Wait 5 minutes
6. Reconnect battery
7. Turn ignition ON, do not start
8. Wait for ECM to complete self-initialization (2-3 minutes)
9. Start engine and let idle for 5 minutes
10. Verify fault codes cleared

## DIAGNOSTIC DECISION TREES

### Engine Won't Start:
1. Check battery voltage (minimum 12.4V for 12V, 24.8V for 24V system)
2. Verify fuel supply and quality
3. Check air filter restriction
4. Verify starter engagement
5. Check fuel shutoff solenoid
6. Verify timing/injection pump
7. Check ECM power supply
8. Verify camshaft/crankshaft sensors
9. Check for air in fuel system

### Engine Overheating:
1. Check coolant level
2. Verify thermostat operation
3. Inspect radiator for blockage
4. Check water pump operation
5. Verify fan operation
6. Inspect hoses for collapse
7. Check for head gasket failure
8. Verify coolant concentration
9. Check for exhaust restriction

### Low Power Output:
1. Check fuel quality and supply
2. Verify air filter condition
3. Check turbocharger operation
4. Verify timing settings
5. Check injector condition
6. Verify governor operation
7. Check exhaust restriction
8. Verify altitude/temperature compensation

### Electrical Issues (AVR/Alternator):
1. Check AVR adjustment potentiometers
2. Verify excitation circuit
3. Test rotor resistance
4. Check stator windings
5. Verify diode rectifier
6. Test voltage regulator
7. Check field circuit breaker
8. Verify sensing circuit

## PARTS COST ESTIMATES (KES)

### Common Parts:
- Fuel Filter: 1,500 - 8,000
- Oil Filter: 1,200 - 6,000
- Air Filter: 2,500 - 15,000
- Coolant Thermostat: 3,500 - 12,000
- Water Pump: 15,000 - 85,000
- Starter Motor: 25,000 - 150,000
- Alternator (charging): 35,000 - 200,000
- Fuel Injector: 15,000 - 80,000 each
- Injection Pump: 80,000 - 450,000
- Turbocharger: 65,000 - 350,000
- AVR (Voltage Regulator): 12,000 - 85,000
- Controller Module: 45,000 - 350,000
- ECM/ECU: 150,000 - 850,000
- Coolant Hose: 2,500 - 15,000
- Drive Belt: 3,500 - 18,000
- Battery (12V 100Ah): 18,000 - 35,000
- Radiator: 45,000 - 250,000
- Cylinder Head Gasket: 25,000 - 120,000

### Labor Rates:
- Basic Service: 5,000 - 15,000
- Major Service: 15,000 - 45,000
- Injector Service: 25,000 - 65,000
- Major Overhaul: 150,000 - 500,000
- ECM Programming: 15,000 - 45,000

## DETAILED ECM REPROGRAMMING GUIDES

### Cummins ECM Reprogramming (Complete Guide):
**Software Required:** Cummins INSITE Pro v8.7 or later
**Hardware Required:**
- Cummins Inline 7 adapter (P/N 4918416) or Inline 6 (P/N 2892092)
- OBD-II to 9-pin adapter (P/N 3164652) for engines without 9-pin connector
- USB cable (included with adapter)
- Laptop with Windows 10 Pro (8GB RAM minimum)

**Step-by-Step Procedure:**
1. Connect Inline adapter to engine diagnostic port (usually near ECM)
2. Connect USB to laptop, launch INSITE
3. Power on generator (key ON, engine OFF)
4. Click "Connect" in INSITE - should detect engine automatically
5. Go to "Calibration" > "Download Calibration"
6. Select correct calibration file for your engine (match CPL/ESN)
7. Click "Program" - DO NOT interrupt power during programming (5-10 minutes)
8. After completion, cycle key OFF then ON
9. Clear all fault codes
10. Perform "Trip Reset" to initialize adaptive values
11. Start engine, let idle for 15 minutes to relearn

**⚠️ WARNINGS:**
- Ensure battery is fully charged (12.6V+) before programming
- Connect battery charger during programming
- Never disconnect during programming - will brick ECM
- Backup existing calibration first

### Caterpillar ECM Programming:
**Software Required:** CAT Electronic Technician (ET) 2023A or newer
**Hardware Required:**
- CAT Comm Adapter III (P/N 538-5051)
- 9-pin Deutsch connector cable
- Laptop with Windows 10

**Procedure:**
1. Connect Comm Adapter to engine service connector
2. Launch CAT ET, select correct engine serial number
3. Go to "Service" > "Calibrations" > "Flash File"
4. Download appropriate flash file from SIS Web
5. Click "Flash Programming" - follow prompts
6. Programming takes 15-20 minutes
7. Perform "Trip Reset" after completion
8. Run injector trim calibration if replacing ECM

### Volvo Penta ECM Programming:
**Software:** VODIA (Volvo Diagnostic Application)
**Hardware:** Volvo 88890300 interface

**Procedure:**
1. Connect interface to engine diagnostic port
2. Open VODIA, connect to engine
3. Navigate to "Programming" > "Software Update"
4. Select correct software package
5. Follow on-screen prompts
6. Cycle power after completion

## ECM NOT COMMUNICATING - COMPLETE DIAGNOSIS

### When new ECM won't communicate after replacement:

**Step 1 - Verify Power Supply:**
- Pin 1 (Battery +): Should have 24V/12V constant
- Pin 2 (Ground): Should have 0 ohms to chassis ground
- Pin 3 (Key Switch): Should have 24V/12V when key ON
- Use multimeter to verify all three

**Step 2 - Check CAN Bus Wiring:**
- CAN High (Pin varies by ECM): Should be ~2.5V with key ON
- CAN Low: Should be ~2.5V with key ON
- Difference between CAN H and CAN L: ~2V during communication
- Termination resistance: 60 ohms between CAN H and CAN L (with both ends connected)

**Step 3 - Termination Resistors:**
- Most CAN networks need 120-ohm resistor at each end
- Total network resistance should be 60 ohms
- Missing termination = no communication

**Step 4 - ECM Initialization:**
Many new ECMs require initialization before first use:
- Cummins: Requires INSITE to "Unlock" and configure
- Caterpillar: Needs flash programming with engine serial data
- Some ECMs need VIN/ESN programming before operation

**Step 5 - Common Issues:**
1. Wrong ECM part number for application
2. Software mismatch between ECM and controller
3. Damaged CAN bus wiring during installation
4. Incorrect pin-out (especially on rebuilt ECMs)
5. ECM not configured for generator application (vehicle vs genset mode)

## GENERATOR TRIPS ON LOAD - COMPLETE DIAGNOSIS

### Diagnostic Flowchart:

**At what load percentage does it trip?**

**25-30% Load Trip:**
- Check fuel supply rate - may be restricted
- Verify fuel pump output pressure (should be 3-5 bar for most engines)
- Check for air leaks in fuel suction line
- Verify fuel return line not restricted

**50% Load Trip:**
- Governor response issue - check actuator
- Verify turbocharger wastegate operation
- Check intercooler for blockage
- Verify fuel rack/throttle full movement

**75%+ Load Trip:**
- Check exhaust backpressure (should be <3" H2O)
- Verify injector condition - possible worn injectors
- Check valve clearances
- Verify engine timing

**Electrical Causes (any load):**
- AVR instability - check voltage sensing wires
- Excitation circuit fault - test rotating diodes
- Load sensing CT ratio incorrect
- Voltage droop/compensation misadjusted

### Testing Procedure:
1. Connect load bank in 10% increments
2. Monitor voltage, frequency, coolant temp, exhaust temp at each step
3. Log all parameters - look for anomaly just before trip
4. Check fault code immediately after trip (before clearing)
5. Compare exhaust temperatures between cylinders (variation >50°C indicates problem)

## INJECTOR DIAGNOSTICS - DETAILED

### "Only Some Injectors Firing":

**How to identify which injectors are not firing:**
1. **Temperature method:** Use IR thermometer on exhaust manifold at each port - cold port = dead cylinder
2. **Cylinder cut-out:** Use diagnostic tool to disable each injector - no RPM change = already not firing
3. **Visual inspection:** Remove valve cover, observe pushrod movement (mechanical injectors)

**Back-Leak Test Procedure:**
1. Disconnect fuel return line from injectors
2. Attach clear tubes to each injector return
3. Crank engine for 10 seconds
4. Compare fuel flow from each injector
5. Excessive flow (>10ml/min) indicates worn injector

**Injector Opening Pressure Test:**
1. Remove injector from engine
2. Connect to injector test bench
3. Pump slowly until injector opens
4. Record opening pressure:
   - Most engines: 200-250 bar (2900-3600 psi)
   - Common rail: 350-400 bar (5000-5800 psi)
5. Pressure should hold for 10 seconds without dripping

**Common Injector Part Numbers:**

| Engine | OEM Part# | Aftermarket | Price (KES) |
|--------|-----------|-------------|-------------|
| Cummins 6BT | 3919350 | Bosch 0432131743 | 18,000-25,000 |
| Cummins 6CT | 3802316 | Bosch 0432193635 | 22,000-30,000 |
| CAT 3406 | 7W7026 | Aftermarket 127-8209 | 35,000-45,000 |
| Perkins 1104 | 2645A749 | Delphi EJBR02501Z | 15,000-20,000 |

**Injector Replacement Procedure:**
1. Release fuel system pressure
2. Disconnect electrical connector (electronic injectors)
3. Remove fuel lines - cap immediately
4. Remove hold-down clamp/bolts (torque: 25-30 Nm typically)
5. Remove injector with slide hammer if stuck
6. Clean injector bore thoroughly
7. Install new copper washer (always replace)
8. Install injector - hand-tight first
9. Torque to specification (varies by engine)
10. Reconnect fuel lines - check for leaks
11. Bleed air from system
12. Start engine, check for fuel leaks
13. Clear fault codes, perform injector trim if electronic

## FUEL INJECTION PUMP TROUBLESHOOTING

### Symptoms of Pump Failure:
- Hard starting
- Loss of power
- Black smoke
- Hunting/surging at idle
- Complete no-start

### Testing Fuel Delivery:
1. Disconnect fuel line at injector
2. Crank engine - fuel should pulse strongly
3. No fuel = pump failure or restriction
4. Weak fuel = worn pump or air leak

### Injection Timing Check:
1. Remove valve cover
2. Set cylinder 1 to TDC compression stroke
3. Check timing marks on pump/engine
4. Timing off by 1 degree = significant power loss

### Fuel Pump Part Numbers:
- Cummins 6BT: Bosch 0460426401 / Cummins 3977353
- Cummins 6CT: Bosch 0460426369 / Cummins 4988593
- Perkins 1104: Delphi 9320A224G
- CAT 3306: CAT 1W6753

## CONTROLLER-TO-ECM COMMUNICATION

### DSE Controller to Cummins ECM:
**Protocol:** J1939 CAN Bus @ 250kbps
**Wiring:**
- CAN High: DSE Pin A (Yellow wire) to ECM CAN H
- CAN Low: DSE Pin B (Green wire) to ECM CAN L
- Ground: DSE Pin C to engine ground

**Common Issues:**
1. Baud rate mismatch - ensure both at 250kbps
2. Address conflict - ECM should be 0x00, controller typically 0x17
3. Missing termination resistor

### ComAp to Various ECMs:
**Supported Protocols:**
- J1939 (Cummins, CAT, Volvo)
- MDEC (CAT older engines)
- EDC (MTU)

**Configuration:**
1. In InteliConfig, go to Setpoints > Engine
2. Select correct engine type
3. Set CAN baud rate (usually 250k)
4. Enable J1939 parameters needed
5. Download configuration to controller

## TOOLS REQUIRED FOR PROFESSIONAL DIAGNOSTICS

### Essential Tools:
1. **Digital Multimeter** - Fluke 87V or equivalent (KES 35,000-50,000)
2. **Clamp Ammeter** - for AC/DC current (KES 15,000-25,000)
3. **Diagnostic Laptop** - Windows 10, 8GB RAM, USB 3.0
4. **OBD Adapter** - Cummins Inline 7 or universal J1939
5. **Oscilloscope** - 2-channel minimum for CAN bus (KES 80,000+)
6. **Fuel Pressure Gauge** - 0-10 bar (KES 8,000-15,000)
7. **Compression Tester** - diesel-rated (KES 12,000-20,000)
8. **Injector Tester** - pop tester (KES 25,000-45,000)
9. **Megger/Insulation Tester** - for alternator testing (KES 30,000-50,000)
10. **Torque Wrench** - 10-100 Nm range (KES 8,000-15,000)

### Software Licenses:
- Cummins INSITE Pro: ~$2,500/year subscription
- CAT ET: ~$3,000/year subscription
- DSE Configuration Suite: Free download
- ComAp InteliConfig: Free download
- SmartGen SG72 Software: Free download
`;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Build conversation context if provided
    const conversationContext: ConversationContext | undefined = context;

    // Get the last user message to find relevant templates/knowledge
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    const userQuery = lastUserMessage?.content || '';

    // Find matching template or knowledge base entry
    const matchingTemplate = findMatchingTemplate(userQuery);
    const matchingKnowledge = findKnowledgeBaseEntry(userQuery);

    // Build contextual additions
    let contextualKnowledge = '';
    if (matchingTemplate) {
      contextualKnowledge += `\n\n## RELEVANT TEMPLATE FOR THIS QUERY\n`;
      contextualKnowledge += formatTemplateForAI(matchingTemplate);
    }
    if (matchingKnowledge) {
      contextualKnowledge += `\n\n## RELEVANT KNOWLEDGE BASE ENTRY\n`;
      contextualKnowledge += formatKnowledgeBaseForAI(matchingKnowledge);
    }

    // Get follow-up questions for variety
    const verificationQuestions = getFollowUpQuestions('verification', 2);
    const engagementPrompt = getEngagementPrompt('afterSolution');

    // Build the enhanced system prompt using the expert system
    const expertSystemPrompt = buildExpertSystemPrompt(conversationContext);
    const enhancedSystemPrompt = `${systemPrompt || expertSystemPrompt}

${GENERATOR_KNOWLEDGE}

${contextualKnowledge}

## SUGGESTED FOLLOW-UP QUESTIONS FOR THIS RESPONSE
After providing your answer, consider asking one of these:
${verificationQuestions.map(q => `- "${q}"`).join('\n')}

## ENGAGEMENT PROMPT
${engagementPrompt}

## YOUR INTERACTION STYLE - BE ENGAGING AND THOROUGH

You are an interactive diagnostic expert. You MUST engage with the technician throughout the troubleshooting process.

### ALWAYS ASK FOLLOW-UP QUESTIONS:
After EVERY response, include at least ONE of these:
- "Did this solve your issue?" / "Has the fault cleared?"
- "What does the display show now?"
- "Are you still experiencing the problem?"
- "Have you completed these steps?"
- "What happened when you tried this?"
- "Do you need me to explain any step in more detail?"
- "What tools do you have available?"
- "Would you like the part numbers for replacement?"

### WHEN PROVIDING SOLUTIONS:
1. Give step-by-step procedures with EXACT details
2. Include specific part numbers (e.g., "Cummins Part# 4921684, Caterpillar Part# 238-8091")
3. List required tools: "You'll need: 10mm socket, torque wrench (25-30 Nm), multimeter"
4. Include safety warnings: "⚠️ SAFETY: Disconnect battery before proceeding"
5. Estimate time: "This should take approximately 45 minutes"
6. Add verification steps: "After replacing, start the engine and check for fault codes"

### FOR ECM/CONTROLLER ISSUES:
When someone says "ECM not communicating" or similar:
1. First ask: "What exactly happens? No response at all, or intermittent?"
2. Guide through: CAN bus wiring check, termination resistors, power supply verification
3. Provide pin-by-pin testing procedures
4. Include oscilloscope patterns if relevant
5. Explain ECM initialization requirements for new ECM installation

### FOR REPROGRAMMING REQUESTS:
When someone needs ECM reprogramming:
1. Identify exact ECM model and engine
2. Provide software requirements:
   - Cummins: INSITE Pro (version X.X), adapter cable P/N 3164655
   - Caterpillar: CAT ET (Electronic Technician), CAT Comm Adapter III
   - Perkins: EST (Electronic Service Tool)
   - Volvo: VODIA diagnostic software
3. Step-by-step programming procedure
4. Warn about risks and backup procedures
5. Include authorization/license requirements if any

### FOR "GENERATOR SHUTTING DOWN ON LOAD":
This is complex - guide thoroughly:
1. Ask: "At what load percentage does it shut down? 25%? 50%? 75%?"
2. Ask: "Any fault codes displayed? What are they?"
3. Check: Fuel system capacity, governor response, exhaust restriction
4. Check: Electrical - AVR stability, excitation circuit, load sensing
5. Check: Mechanical - turbo lag, injector timing, compression
6. Provide testing procedures for each possibility

### FOR INJECTOR PROBLEMS:
When someone reports "only some injectors working":
1. Ask: "Which cylinders? How did you determine this?"
2. Guide through: Individual injector testing procedure
3. Explain: Back-leak test, spray pattern test, opening pressure test
4. Provide: Injector part numbers by engine model
5. Include: Torque specs, replacement procedure, bleeding procedure

### ALWAYS PROVIDE:
- ✅ Exact part numbers (OEM and aftermarket alternatives)
- ✅ Tool specifications with sizes
- ✅ Torque specifications in Nm
- ✅ Wire colors and pin numbers
- ✅ Testing procedures with expected values
- ✅ Cost estimates in KES
- ✅ Safety warnings with ⚠️ symbol
- ✅ Follow-up questions to verify resolution

### RESPONSE FORMAT:
Use clear formatting:
- **Bold** for important terms
- Numbered lists for procedures
- Bullet points for options
- Tables for specifications when helpful
- Include emojis for visual cues: ⚠️ (warning), ✅ (done), 🔧 (tool needed), 💰 (cost)

REMEMBER: Your goal is to guide the technician to a complete solution. Don't leave them hanging - always check if they need more help!
`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: enhancedSystemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Extract text content
    const textContent = response.content.find(c => c.type === 'text');
    const content = textContent ? textContent.text : 'I apologize, I could not generate a response.';

    // Parse response for metadata (optional enhancement)
    const metadata: Record<string, unknown> = {};

    // Detect urgency level from content
    if (content.toLowerCase().includes('critical') || content.toLowerCase().includes('immediately stop')) {
      metadata.urgency = 'critical';
    } else if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('as soon as possible')) {
      metadata.urgency = 'high';
    } else if (content.toLowerCase().includes('warning') || content.toLowerCase().includes('attention')) {
      metadata.urgency = 'medium';
    }

    // Detect if diagnosis is complete
    if (content.toLowerCase().includes('diagnosis:') || content.toLowerCase().includes('the problem is')) {
      metadata.diagnosisComplete = true;
    }

    // Add template/knowledge match info to metadata
    if (matchingTemplate) {
      metadata.matchedTemplate = matchingTemplate.id;
      metadata.templateCategory = matchingTemplate.category;
    }
    if (matchingKnowledge) {
      metadata.matchedKnowledge = matchingKnowledge.id;
    }

    // Suggest follow-up questions
    metadata.suggestedFollowUps = verificationQuestions;

    return NextResponse.json({
      content,
      metadata,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Expert chat API error:', error);

    // Return a proper error response with fallback content
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        fallbackContent: `I'm experiencing a temporary connection issue. While I reconnect, here are some general troubleshooting tips:

**For Starting Issues:**
1. Check battery voltage (should be >12.4V for 12V systems)
2. Verify fuel supply and filter condition
3. Check for air in fuel system
4. Verify starter motor engagement

**For Overheating:**
1. Check coolant level and condition
2. Verify thermostat operation
3. Inspect radiator for blockage
4. Check water pump operation

**For Electrical Issues:**
1. Check AVR adjustment
2. Verify excitation circuit
3. Test alternator output
4. Check circuit breakers

Please try your question again or use the other diagnostic panels for detailed guidance.`,
        metadata: {},
      },
      { status: 503 } // Service temporarily unavailable
    );
  }
}

// Also support GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Generator Oracle Expert AI Chat',
    capabilities: [
      'Diagnosis',
      'Fault Code Interpretation',
      'Repair Guidance',
      'Parts Identification',
      'Cost Estimation',
      'ECM/ECU Procedures',
      'All Manufacturers',
    ],
  });
}
