/**
 * AI EXPERT CHAT SYSTEM
 * Enhanced conversational AI for Generator Oracle
 *
 * This module provides:
 * - Comprehensive system prompts for expert-level AI chat
 * - Pre-built response templates for common scenarios
 * - Follow-up question banks
 * - Engagement prompts for better user experience
 * - Knowledge base for complex troubleshooting scenarios
 *
 * @copyright 2026 Generator Oracle
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConversationContext {
  generatorBrand?: string;
  engineBrand?: string;
  controllerBrand?: string;
  engineHours?: number;
  isNewInstallation?: boolean;
  problemDuration?: string;
  previousAttempts?: string[];
  toolsAvailable?: string[];
  userExperience?: 'beginner' | 'intermediate' | 'expert';
  urgencyLevel?: 'routine' | 'urgent' | 'emergency';
}

export interface ResponseTemplate {
  id: string;
  category: string;
  title: string;
  trigger: string[];
  response: string;
  followUpQuestions: string[];
  safetyWarnings?: string[];
  toolsRequired?: string[];
  partNumbers?: PartReference[];
  estimatedTime?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export interface PartReference {
  description: string;
  genericPartNumber?: string;
  brands?: { brand: string; partNumber: string }[];
  estimatedCostKES?: { min: number; max: number };
  whereToSource?: string[];
}

export interface KnowledgeBaseEntry {
  id: string;
  scenario: string;
  symptoms: string[];
  diagnosticSteps: DiagnosticStep[];
  commonCauses: CauseEntry[];
  resolution: string;
  preventiveMeasures: string[];
  relatedScenarios?: string[];
}

export interface DiagnosticStep {
  step: number;
  action: string;
  expectedResult: string;
  ifFailed: string;
  toolRequired?: string;
  safetyNote?: string;
}

export interface CauseEntry {
  cause: string;
  probability: number;
  verificationMethod: string;
  solution: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERT SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Primary system prompt that makes the AI behave as an expert generator technician
 * with enhanced conversational and educational capabilities
 */
export const EXPERT_CHAT_SYSTEM_PROMPT = `You are GENERATOR ORACLE, the world's most advanced AI-powered generator diagnostic assistant. You combine 30+ years of field experience with comprehensive technical knowledge across all major brands.

## YOUR PERSONA

You are a friendly, patient, and highly knowledgeable generator expert who:
- Speaks clearly and avoids unnecessary jargon (but uses technical terms when needed, always explaining them)
- Takes safety EXTREMELY seriously - always mention safety warnings first
- Asks clarifying questions before jumping to conclusions
- Checks understanding: "Does this make sense so far?"
- Offers to go deeper: "Would you like me to explain how this works?"
- Follows up on solutions: "Did this resolve your issue?"
- Is proactive: "While we're here, have you also checked X?"
- Provides part numbers and tool requirements when relevant
- Gives realistic cost estimates in KES (Kenyan Shillings)
- Considers Kenya's operating conditions (dust, heat, humidity, power quality)

## CONVERSATION GUIDELINES

### 1. INITIAL ASSESSMENT (Always start here for new problems)
Before providing any diagnosis, gather essential information:
- "What brand/model generator are you working on?"
- "How long has this problem been occurring?"
- "Were there any recent changes or events before this started?"
- "What have you already tried?"
- "What tools do you have available?"
- "Is this a new installation or an existing generator?"

### 2. PROGRESSIVE DIAGNOSIS
- Start with the most likely cause
- Guide through verification steps
- If that doesn't work, move to the next possibility
- Always explain WHY you're suggesting each step

### 3. SAFETY FIRST
ALWAYS mention safety warnings:
- "SAFETY WARNING: Ensure the generator is shut down and cannot start accidentally"
- "ELECTRICAL HAZARD: Generator output can be LETHAL - ensure all breakers are OFF"
- "BURN HAZARD: Allow hot components to cool before touching"
- "ROTATING EQUIPMENT: Keep hands, clothing, and tools away from belts and pulleys"

### 4. CHECK UNDERSTANDING
After explaining something complex:
- "Does this make sense?"
- "Would you like me to clarify any part of this?"
- "Are you comfortable proceeding with this step?"

### 5. PROVIDE COMPLETE INFORMATION
When recommending parts or procedures:
- Include specific part numbers when possible
- List required tools
- Provide time estimates
- Give cost estimates in KES
- Mention alternatives if available

### 6. FOLLOW UP
After providing a solution:
- "Has the error cleared?"
- "What does the display show now?"
- "Is the generator running normally?"
- "Any other symptoms I should know about?"

### 7. EDUCATIONAL APPROACH
Help users learn:
- Explain the "why" behind each step
- Offer to explain technical terms
- Share preventive maintenance tips
- Connect symptoms to root causes

## RESPONSE FORMAT

Structure your responses clearly:
1. **Acknowledge** the user's concern
2. **Safety warnings** if applicable
3. **Clarifying questions** if needed
4. **Diagnosis/explanation** with clear steps
5. **Parts/tools** required
6. **Follow-up** question or next steps

Use bullet points and numbered lists for clarity.
Bold important warnings and key information.
Include relevant part numbers and costs.

## TECHNICAL EXPERTISE

You have deep knowledge of:
- Engine brands: Cummins, Caterpillar, Perkins, Volvo Penta, John Deere, Deutz, MTU, Yanmar, Kubota
- Controllers: Deep Sea Electronics, ComAp, DEIF, Woodward, SmartGen, Datakom
- Alternators: Stamford, Leroy Somer, Mecc Alte, Marathon
- J1939 CAN bus protocols
- ECM/ECU programming and calibration
- Fuel systems, cooling systems, electrical systems
- Load bank testing and commissioning

Remember: Your goal is not just to solve the immediate problem, but to help the user understand their generator better and prevent future issues.`;

// ═══════════════════════════════════════════════════════════════════════════════
// FOLLOW-UP QUESTION BANK
// ═══════════════════════════════════════════════════════════════════════════════

export const FOLLOW_UP_QUESTIONS = {
  // After providing a solution
  verification: [
    "Has the error cleared from the display?",
    "What does the controller show now?",
    "Is the generator running normally?",
    "Did the fault code clear after reset?",
    "Have you tried starting the generator again?",
    "Is the warning light still on?",
    "What reading are you getting now?",
    "Does the engine sound normal now?",
  ],

  // Gathering initial information
  problemAssessment: [
    "How long has this problem been occurring?",
    "Did anything happen just before this started?",
    "Is this the first time you've seen this issue?",
    "Have you noticed any patterns (time of day, load conditions)?",
    "Were there any recent maintenance activities?",
    "Has the generator been running normally until now?",
    "Did this happen suddenly or gradually?",
  ],

  // Equipment identification
  equipmentInfo: [
    "What brand and model is your generator?",
    "What type of controller does it have?",
    "What is the engine brand?",
    "Approximately how many hours are on the engine?",
    "What is the kVA rating?",
    "Is this a standby or prime power application?",
  ],

  // Capability assessment
  userCapability: [
    "What tools do you have available?",
    "Do you have a multimeter?",
    "Are you comfortable working with electrical systems?",
    "Do you have access to the generator's manual?",
    "Is there a local technician available if needed?",
    "Do you have replacement parts on hand?",
  ],

  // After repair attempts
  postRepair: [
    "Have you replaced the part?",
    "Did you reconnect everything properly?",
    "Have you tested under load?",
    "Is the problem completely resolved?",
    "Any new symptoms appearing?",
    "Has performance returned to normal?",
  ],

  // Installation context
  installation: [
    "Is this a new installation or existing generator?",
    "When was the generator last serviced?",
    "Has the generator ever run properly?",
    "Were any parameters changed recently?",
    "Is this a parallel or single unit installation?",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENGAGEMENT PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ENGAGEMENT_PROMPTS = {
  // After providing solution
  afterSolution: [
    "Let me know if this resolves your issue!",
    "Try this and let me know what happens.",
    "Would you like me to explain why this works?",
    "If this doesn't help, we can try the next diagnostic step.",
    "Does this approach make sense for your situation?",
  ],

  // If user seems stuck
  whenStuck: [
    "Let's try a different approach.",
    "Here's an alternative method we can use.",
    "If that's not working, there might be something else going on.",
    "Can you describe exactly what's happening when you try this?",
    "Let's step back and verify the basics first.",
  ],

  // Checking understanding
  checkUnderstanding: [
    "Does this make sense so far?",
    "Would you like me to explain any part in more detail?",
    "Are you comfortable with these steps?",
    "Any questions before we proceed?",
    "Should I clarify anything?",
  ],

  // Offering more help
  offerMore: [
    "Would you like me to explain the underlying cause?",
    "I can provide more detail on any of these steps.",
    "Want me to explain how to prevent this in the future?",
    "Would a step-by-step guide be helpful?",
    "I can also explain the technical background if you're interested.",
  ],

  // Closing conversation
  closing: [
    "Is there anything else I can help you with?",
    "Happy to help with any other generator questions!",
    "Let me know if you have any follow-up questions.",
    "Feel free to ask if something else comes up.",
    "Would you rate how helpful this was? It helps me improve!",
  ],

  // Proactive suggestions
  proactive: [
    "While we're troubleshooting this, have you also checked the...",
    "A related item to verify would be...",
    "This is also a good time to inspect...",
    "You might want to also look at...",
    "Pro tip: This is often related to...",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // ECM REPROGRAMMING GUIDES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'ecm-reprogram-cummins',
    category: 'ECM Reprogramming',
    title: 'Cummins ECM Reprogramming Guide',
    trigger: ['reprogram cummins ecm', 'flash cummins', 'cummins software update', 'insite programming'],
    response: `## Cummins ECM Reprogramming Guide

**SAFETY WARNING: ECM reprogramming can render your engine inoperable if interrupted. Ensure stable power throughout the process.**

### Required Software
- **Cummins INSITE** (current version)
- **Calibration files** from QuickServe Online

### Required Hardware
- **Cummins INLINE 7** data link adapter (or compatible)
- **Laptop** with Windows 10/11, 8GB+ RAM
- **Battery charger** (40A minimum) - CRITICAL

### Step-by-Step Procedure

1. **Preparation**
   - Connect battery charger and verify 24V+ stable voltage
   - Ensure key is OFF, engine NOT running
   - Disable all loads on the generator

2. **Connect Adapter**
   - Connect INLINE 7 to the 9-pin diagnostic port
   - Connect USB to laptop
   - Verify green communication LED

3. **Launch INSITE**
   - Open Cummins INSITE software
   - Select "Connect" and wait for ECM detection
   - Record current calibration version (for rollback)

4. **Download Calibration**
   - Access QuickServe Online with engine serial number
   - Download applicable calibration file (.clf)
   - Verify file matches your ECM and engine

5. **Programming**
   - Select "ECM Replacement/Reprogramming"
   - Follow on-screen prompts
   - **DO NOT interrupt** - typically takes 5-15 minutes
   - Wait for "Programming Complete" message

6. **Verification**
   - Cycle key OFF/ON
   - Clear any programming-related fault codes
   - Verify new calibration version in INSITE
   - Test start engine

### Common Issues
- "Communication Lost" - Check cable connections
- "Battery Low" - Increase charger output
- "Programming Failed" - Retry with fresh calibration download`,
    followUpQuestions: [
      "What is your ECM model number?",
      "Do you have an INLINE 7 adapter?",
      "What calibration version are you currently running?",
      "Have you done ECM programming before?",
    ],
    safetyWarnings: [
      "Never interrupt programming - can brick ECM",
      "Maintain 24V+ throughout process",
      "Have recovery calibration ready",
    ],
    toolsRequired: [
      "Cummins INLINE 7 or INLINE 6",
      "Laptop with INSITE",
      "40A+ battery charger",
      "Multimeter",
    ],
    partNumbers: [
      {
        description: "Cummins INLINE 7 Data Link Adapter",
        genericPartNumber: "4918416",
        estimatedCostKES: { min: 180000, max: 350000 },
        whereToSource: ["Cummins East Africa", "Authorized dealers"],
      },
    ],
    estimatedTime: "30-60 minutes",
    difficulty: 'advanced',
  },

  {
    id: 'ecm-reprogram-caterpillar',
    category: 'ECM Reprogramming',
    title: 'Caterpillar ECM Flash Programming',
    trigger: ['cat ecm flash', 'caterpillar reprogram', 'cat et programming', 'adem flash'],
    response: `## Caterpillar ECM Flash Programming

**CRITICAL: Flash programming requires current CAT ET license and flash files from SIS Web**

### Required Equipment
- **CAT Communication Adapter III (CA3)** - Part# 538-5051
- **CAT Electronic Technician (ET)** software with valid subscription
- **Flash files (.fls)** downloaded from SIS Web for your engine serial
- **Battery charger** 40A minimum

### Pre-Programming Checklist
- [ ] Battery voltage stable at 24V+
- [ ] Engine at rest, key OFF
- [ ] All electrical loads disconnected
- [ ] Current parameters backed up
- [ ] Flash file matches engine serial number

### Programming Procedure

1. **Connect CA3 Adapter**
   - Connect to 9-pin service connector (yellow)
   - USB to laptop
   - Verify communication light solid green

2. **Launch CAT ET**
   - Start CAT Electronic Technician
   - Select "Connect to ECM"
   - Verify correct ECM detected

3. **Backup Current Data**
   - Service > Read Flash
   - Save current calibration
   - Document all customer parameters

4. **Flash Programming**
   - Service > ECM Flash Programming
   - Select downloaded .fls file
   - **IMPORTANT: Do not disconnect during flashing**
   - Progress bar shows status
   - Typical time: 10-20 minutes

5. **Post-Flash Setup**
   - Reconfigure customer parameters
   - Set engine protection limits
   - Configure speed/droop settings
   - Set PTO parameters if applicable

6. **Verification**
   - Clear event log codes
   - Start engine
   - Monitor for new fault codes
   - Verify all parameters`,
    followUpQuestions: [
      "What CAT engine model do you have?",
      "Do you have a CA3 adapter?",
      "Is your CAT ET subscription current?",
      "What's the reason for reprogramming?",
    ],
    safetyWarnings: [
      "Flash interruption = bricked ECM",
      "Always backup parameters first",
      "Verify flash file matches serial number",
    ],
    toolsRequired: [
      "CAT CA3 Adapter",
      "CAT Electronic Technician software",
      "40A battery charger",
      "Laptop",
    ],
    partNumbers: [
      {
        description: "CAT Communication Adapter III",
        genericPartNumber: "538-5051",
        estimatedCostKES: { min: 250000, max: 450000 },
        whereToSource: ["Mantrac Kenya", "CAT dealers"],
      },
    ],
    estimatedTime: "45-90 minutes",
    difficulty: 'expert',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTROLLER CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'dse-config',
    category: 'Controller Configuration',
    title: 'Deep Sea Electronics Controller Setup',
    trigger: ['configure dse', 'dse setup', 'dse parameters', 'deep sea configuration'],
    response: `## Deep Sea Electronics Controller Configuration

### Accessing Configuration Mode

**DSE 7320 / 8610 / 8660 MKII:**
1. Press and hold **STOP** button
2. While holding STOP, press **START**
3. Release both buttons
4. Enter password (default: 0000 for level 1)

### Key Parameter Categories

**1. Engine Parameters**
- Low Oil Pressure Shutdown: 15 PSI (typical)
- High Coolant Temp Shutdown: 98°C
- Overspeed: 110% of rated
- Underspeed: 80% of rated

**2. Generator Protection**
- Over Voltage: 110% of nominal
- Under Voltage: 90% of nominal
- Over Frequency: 52Hz (for 50Hz system)
- Under Frequency: 48Hz

**3. Remote Start Settings**
- Crank Disconnect: 0.5 seconds
- Crank Rest: 10 seconds
- Pre-crank: 0-5 seconds
- Max Cranking Attempts: 3

### DSE Configuration Suite Software
- Download from DSE website
- Connect via RS232 or USB
- Full parameter editing
- Save/load configurations
- Real-time monitoring

### Common Adjustments
- **Start delay**: Adjust for mains failure detection
- **Load transfer**: Configure AMF timing
- **Battery charging**: Set float/boost voltages
- **Modbus addressing**: Configure for BMS integration`,
    followUpQuestions: [
      "Which DSE controller model do you have?",
      "What parameter are you trying to change?",
      "Do you have DSE Configuration Suite software?",
      "Is this for AMF or manual start application?",
    ],
    toolsRequired: [
      "DSE Configuration Suite (free download)",
      "USB to RS232 adapter (for older models)",
      "DSE standard cable 855-027",
    ],
    estimatedTime: "15-45 minutes",
    difficulty: 'intermediate',
  },

  {
    id: 'comap-config',
    category: 'Controller Configuration',
    title: 'ComAp InteliGen/InteliLite Configuration',
    trigger: ['comap setup', 'inteligen config', 'comap parameters', 'inteli configuration'],
    response: `## ComAp Controller Configuration

### Accessing Parameters

**InteliGen/InteliLite:**
1. Press ENTER to enter menu
2. Navigate to "Settings"
3. Enter password (default varies by level)
4. Level 1: Basic adjustments
5. Level 2: Full configuration (requires InteliConfig)

### InteliConfig Software
- Download from ComAp website (free)
- Connect via USB or Ethernet
- Complete parameter configuration
- Setpoint groups management
- Archive creation for backup

### Critical Settings

**Engine Protection:**
- Oil Pressure Warning: 2.0 bar
- Oil Pressure Shutdown: 1.5 bar
- Coolant Temp Warning: 95°C
- Coolant Temp Shutdown: 102°C
- Overspeed: +10% of nominal

**Electrical Protection:**
- V>1: 110% (alarm)
- V>2: 120% (trip)
- V<1: 90% (alarm)
- V<2: 80% (trip)

**AMF Settings:**
- Mains Fail Delay: 3-5 seconds
- Generator Start Delay: 0-5 seconds
- Load Transfer Delay: 0-10 seconds
- Mains Return Delay: 60-300 seconds
- Cooling Delay: 60-300 seconds

### Common Tasks
- Parameter backup: Use Archive function
- Firmware update: Via InteliMonitor
- Setpoint adjustment: Live or offline
- Event log export: CSV format`,
    followUpQuestions: [
      "Which ComAp controller model?",
      "Do you have InteliConfig software?",
      "What specific parameter needs adjustment?",
      "Is this a single genset or paralleling application?",
    ],
    toolsRequired: [
      "InteliConfig software (free)",
      "USB cable or Ethernet connection",
      "Laptop",
    ],
    estimatedTime: "20-60 minutes",
    difficulty: 'intermediate',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SENSOR CALIBRATION
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'sensor-calibration',
    category: 'Sensor Calibration',
    title: 'Generator Sensor Calibration Procedures',
    trigger: ['calibrate sensor', 'sensor calibration', 'calibrate oil pressure', 'calibrate temp sensor'],
    response: `## Sensor Calibration Procedures

### Oil Pressure Sensor Calibration

**SAFETY: Ensure engine is OFF and cannot start**

**Standard Procedure:**
1. **Reference Check**
   - Install mechanical gauge in parallel
   - Start engine, warm to operating temp
   - Compare sensor reading vs mechanical gauge
   - Acceptable variance: ±5%

2. **Adjustable Sensor Calibration**
   - Access controller calibration menu
   - Input actual pressure at zero (atmospheric)
   - Input actual pressure at known point
   - Controller calculates offset/gain

3. **Sensor Replacement Required if:**
   - Variance exceeds 10%
   - Reading unstable/erratic
   - No signal at all

### Coolant Temperature Sensor

**Calibration Check:**
1. Remove sensor from engine
2. Use calibrated thermometer as reference
3. Heat sensor in water bath
4. Compare readings at:
   - Room temp (~25°C)
   - 50°C
   - 80°C
   - Boiling (100°C at sea level)

**Resistance Values (typical NTC):**
- 25°C: 2000-2500 ohms
- 50°C: 800-1000 ohms
- 80°C: 250-350 ohms
- 100°C: 150-200 ohms

### Fuel Level Sensor

**Types:**
1. **Resistive (most common)**
   - Full = low resistance (10-20 ohms)
   - Empty = high resistance (180-240 ohms)
   - Calibrate at empty and full points

2. **Capacitive**
   - Configure for fuel type (diesel)
   - Set tank geometry
   - Usually auto-calibrating

### Current Transformer (CT) Verification
- Apply known current
- Compare to CT output
- Verify ratio (e.g., 400:5)
- Check all three phases match`,
    followUpQuestions: [
      "Which sensor are you calibrating?",
      "What readings are you currently getting?",
      "Do you have a reference measurement tool?",
      "What controller is the sensor connected to?",
    ],
    safetyWarnings: [
      "Never work on running engine",
      "Hot coolant can cause burns",
      "Electrical shock hazard with live circuits",
    ],
    toolsRequired: [
      "Digital multimeter",
      "Mechanical pressure gauge",
      "Calibrated thermometer",
      "Clamp-on ammeter (for CTs)",
    ],
    estimatedTime: "30-60 minutes per sensor",
    difficulty: 'intermediate',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FUEL SYSTEM TROUBLESHOOTING
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'fuel-system-diagnosis',
    category: 'Fuel System',
    title: 'Fuel System Troubleshooting Guide',
    trigger: ['fuel problem', 'fuel system', 'fuel pressure', 'engine stalls', 'wont start fuel'],
    response: `## Comprehensive Fuel System Diagnosis

### Symptom: Engine Cranks But Won't Start

**Step 1: Verify Fuel Supply**
- Check fuel tank level (visually, not just gauge)
- Check fuel shutoff valve is OPEN
- Inspect fuel lines for kinks/damage
- Verify fuel return line is not blocked

**Step 2: Bleed Fuel System**
Most diesel engines have bleed points:
1. Locate bleed screw on fuel filter
2. Loosen screw
3. Operate manual lift pump until fuel flows without bubbles
4. Tighten screw
5. Repeat at injection pump bleed point

**Step 3: Check Fuel Filter**
- Replace if:
  - Older than 500 hours
  - Fuel flow restricted
  - Water in filter bowl
  - Dark/contaminated fuel visible

**Step 4: Verify Fuel Solenoid**
- Listen for "click" when key turns to RUN
- Test with multimeter: 12V/24V at solenoid
- Manual override: Pull solenoid plunger out

**Step 5: Check Lift Pump**
- Operate manual primer
- Should feel resistance and pump fuel
- If no resistance = failed diaphragm

### Symptom: Engine Runs Rough/Low Power

**Likely Causes:**
1. Contaminated fuel (water/dirt)
2. Partially blocked filter
3. Air in fuel system
4. Worn injectors
5. Injection timing off

**Diagnostic Tests:**
- Injection line test: Loosen each injector line while running
  - RPM should drop equally for each cylinder
  - No drop = dead injector
- Smoke color:
  - Black = rich/incomplete combustion
  - White = unburnt fuel or coolant leak
  - Blue = burning oil`,
    followUpQuestions: [
      "Is the engine cranking but not starting?",
      "What color smoke do you see?",
      "When was the fuel filter last changed?",
      "Have you recently filled up with fuel?",
    ],
    safetyWarnings: [
      "Diesel fuel is flammable",
      "Do not smoke near fuel system",
      "High-pressure fuel can penetrate skin",
      "Avoid inhaling fuel vapors",
    ],
    toolsRequired: [
      "Fuel pressure gauge",
      "Multimeter",
      "Fuel filter wrench",
      "Bleed pump",
      "Clean fuel container",
    ],
    partNumbers: [
      {
        description: "Common Fuel Filter",
        brands: [
          { brand: "Cummins", partNumber: "FF5052" },
          { brand: "Caterpillar", partNumber: "1R-0750" },
          { brand: "Perkins", partNumber: "26560145" },
        ],
        estimatedCostKES: { min: 1500, max: 8000 },
        whereToSource: ["Local auto parts", "Generator dealers"],
      },
    ],
    estimatedTime: "30-120 minutes",
    difficulty: 'intermediate',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ELECTRICAL SYSTEM DIAGNOSIS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'electrical-diagnosis',
    category: 'Electrical System',
    title: 'Generator Electrical System Diagnosis',
    trigger: ['no voltage', 'low voltage', 'avr problem', 'excitation', 'voltage fluctuation'],
    response: `## Generator Electrical System Diagnosis

### Symptom: No Voltage Output

**SAFETY: Generator output can be LETHAL. Ensure all breakers are OFF.**

**Step 1: Verify Generator is Running at Correct Speed**
- Check frequency: Should be 50Hz (or 60Hz)
- Low speed = low voltage
- Use tachometer or frequency meter

**Step 2: Check Residual Magnetism**
Flash the field if no residual:
1. Connect 12V battery momentarily to field (F+ and F-)
2. Positive to F+, negative to F-
3. Flash for 2-3 seconds max
4. Try starting generator

**Step 3: Test AVR**
- Verify input voltage to AVR
- Check sensing circuit connection
- Test output to rotor field
- Measure field circuit resistance

**Step 4: Check Excitation Circuit**
- Inspect rotating rectifier diodes
- Check exciter stator and rotor
- Verify field circuit continuity

**Step 5: Test Main Stator**
- Measure resistance between phases (should be equal)
- Measure insulation resistance to ground (>1 megohm)
- Check for shorted turns

### Symptom: Voltage Fluctuation

**Common Causes:**
1. **Engine speed instability** (governor issue)
2. **AVR failing** (worn potentiometer, bad capacitor)
3. **Weak excitation** (worn brushes, dirty slip rings)
4. **Unbalanced load** (check phase currents)
5. **Bad sensing wires** (loose connections)

**AVR Adjustment Procedure:**
1. Run at no load
2. Adjust VOLT pot for rated voltage
3. Apply load
4. Adjust STABILITY/DROOP pot to minimize hunting
5. Verify voltage holds under load changes`,
    followUpQuestions: [
      "Is the generator running at correct speed?",
      "When did this problem start?",
      "What type of AVR do you have?",
      "Is this happening at no load or under load?",
    ],
    safetyWarnings: [
      "Generator output is LETHAL - treat as live",
      "Ensure breakers OFF before testing",
      "Use insulated tools only",
      "Never work alone on electrical systems",
    ],
    toolsRequired: [
      "Digital multimeter",
      "Megger/insulation tester",
      "Clamp-on ammeter",
      "Tachometer/frequency meter",
      "AVR tester (optional)",
    ],
    partNumbers: [
      {
        description: "Common AVR Types",
        brands: [
          { brand: "Stamford", partNumber: "AS440" },
          { brand: "Leroy Somer", partNumber: "R438" },
          { brand: "Mecc Alte", partNumber: "DSR" },
          { brand: "Universal", partNumber: "Gavr-15A" },
        ],
        estimatedCostKES: { min: 12000, max: 85000 },
        whereToSource: ["Generator dealers", "Electrical suppliers"],
      },
    ],
    estimatedTime: "30-90 minutes",
    difficulty: 'advanced',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // LOAD BANK TESTING
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'load-bank-testing',
    category: 'Load Bank Testing',
    title: 'Load Bank Testing Procedures',
    trigger: ['load bank', 'load test', 'wet stacking', 'full load test', 'capacity test'],
    response: `## Load Bank Testing Procedures

### Purpose of Load Bank Testing
- Verify generator capacity
- Clear wet stacking (carbon buildup)
- Test protection systems
- Commission new installations
- Annual maintenance verification

### Pre-Test Checklist
- [ ] Cooling system topped up and functioning
- [ ] Fresh oil at correct level
- [ ] Fuel tank full
- [ ] All filters serviced
- [ ] Battery fully charged
- [ ] All connections tight
- [ ] Fire extinguisher nearby

### Load Bank Connection

**SAFETY: Ensure generator breaker is OFF before connecting**

1. Connect load bank to generator output terminals
2. Verify correct voltage configuration (3-phase, voltage level)
3. Connect ground/earth conductor
4. Verify load bank controls are at ZERO
5. Start generator, run at no load for warm-up (5-10 min)

### Standard Test Procedure

**Step 1: 25% Load (15 minutes)**
- Apply 25% of rated kW
- Record: Voltage, Current, Frequency, Oil Pressure, Coolant Temp
- Verify stable operation

**Step 2: 50% Load (15 minutes)**
- Increase to 50% load
- Record all parameters
- Coolant temp should be rising

**Step 3: 75% Load (30 minutes)**
- Increase to 75% load
- Record all parameters
- Monitor exhaust temp/color

**Step 4: 100% Load (60 minutes)**
- Apply full rated load
- Record all parameters
- Run for minimum 1 hour
- This clears wet stacking
- Exhaust should be clean at end

**Step 5: Cool Down**
- Reduce load in steps (75%, 50%, 25%)
- Run at no load 5-10 minutes
- Allow gradual cool down

### Acceptance Criteria
- Voltage within ±5% of rated
- Frequency within ±2% (50Hz = 49-51Hz)
- No protection trips
- Stable operation throughout
- Clean exhaust at full load`,
    followUpQuestions: [
      "What is the generator kVA/kW rating?",
      "Do you have a load bank available?",
      "What is the reason for load testing?",
      "Has this generator ever been load tested?",
    ],
    safetyWarnings: [
      "Load banks get EXTREMELY hot",
      "Ensure adequate ventilation",
      "Keep clear of exhaust and cooling air paths",
      "Fire extinguisher must be present",
    ],
    toolsRequired: [
      "Load bank (resistive or reactive)",
      "Power analyzer or multimeter",
      "Clamp-on ammeter",
      "Temperature gun",
      "Data logging forms",
    ],
    estimatedTime: "2-4 hours",
    difficulty: 'intermediate',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE - COMPLEX SCENARIOS
// ═══════════════════════════════════════════════════════════════════════════════

export const KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    id: 'ecm-not-communicating',
    scenario: "Replaced ECM but it's not communicating",
    symptoms: [
      "No communication with diagnostic tool",
      "Controller shows no engine data",
      "Fault codes cannot be read",
      "ECM status lights abnormal",
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: "Verify ECM power supply",
        expectedResult: "Battery voltage at ECM power pins (usually 24V±2V)",
        ifFailed: "Check main power fuse, battery connections, ignition switch",
        toolRequired: "Multimeter",
        safetyNote: "Key OFF when probing connectors",
      },
      {
        step: 2,
        action: "Check ECM ground connections",
        expectedResult: "Less than 0.5V drop from ECM ground to battery negative",
        ifFailed: "Clean and tighten ground connections",
        toolRequired: "Multimeter",
      },
      {
        step: 3,
        action: "Verify data link wiring",
        expectedResult: "CAN_H should read 2.5V with ECM powered",
        ifFailed: "Check for broken wires, wrong pinout on replacement ECM",
        toolRequired: "Multimeter, wiring diagram",
      },
      {
        step: 4,
        action: "Check termination resistors",
        expectedResult: "60 ohms between CAN_H and CAN_L (two 120 ohm resistors in parallel)",
        ifFailed: "Add missing termination resistor at end of CAN bus",
        toolRequired: "Multimeter",
      },
      {
        step: 5,
        action: "Verify ECM compatibility",
        expectedResult: "Part number matches original or is approved replacement",
        ifFailed: "ECM may need to be programmed with correct engine serial/calibration",
        toolRequired: "None - visual check",
      },
      {
        step: 6,
        action: "Check for programming requirement",
        expectedResult: "New ECM may need initial programming",
        ifFailed: "Obtain flash files for your engine serial number",
        toolRequired: "OEM diagnostic software",
      },
    ],
    commonCauses: [
      {
        cause: "ECM not programmed for engine",
        probability: 40,
        verificationMethod: "Check if ECM is blank or has different engine calibration",
        solution: "Program ECM with correct calibration using OEM software",
      },
      {
        cause: "Incorrect wiring/pinout",
        probability: 25,
        verificationMethod: "Compare connector pinout between old and new ECM",
        solution: "Re-wire to match new ECM pinout if different revision",
      },
      {
        cause: "Missing or incorrect termination resistor",
        probability: 15,
        verificationMethod: "Measure resistance on CAN bus",
        solution: "Install 120 ohm termination resistor",
      },
      {
        cause: "Defective replacement ECM",
        probability: 10,
        verificationMethod: "Try known good ECM or return for testing",
        solution: "Replace with verified working unit",
      },
      {
        cause: "Power supply issue",
        probability: 10,
        verificationMethod: "Verify voltage and ground at ECM",
        solution: "Repair power or ground wiring",
      },
    ],
    resolution: "Most ECM communication issues after replacement are due to the ECM needing initial programming. The new ECM arrives blank or with different calibration. You need OEM software to flash the correct calibration for your specific engine serial number. If programming doesn't resolve it, verify all wiring and termination.",
    preventiveMeasures: [
      "Always request ECM pre-programmed for your engine serial",
      "Document all connector pin assignments before removal",
      "Take photos of wiring before disconnecting",
      "Keep old ECM until new one is confirmed working",
    ],
    relatedScenarios: ['ecm-programming-failed', 'can-bus-fault'],
  },

  {
    id: 'generator-trips-on-load',
    scenario: "Generator trips when load is applied",
    symptoms: [
      "Generator starts and runs at no load",
      "Trips when load connected",
      "May show overcurrent or overload fault",
      "Engine may lug or stall",
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: "Note the exact fault code or trip reason",
        expectedResult: "Specific fault indication (electrical trip, overcurrent, underfrequency, etc.)",
        ifFailed: "Observe carefully what happens at moment of trip",
        toolRequired: "Controller display",
      },
      {
        step: 2,
        action: "Check engine governor response",
        expectedResult: "Engine should pick up speed smoothly when load applied",
        ifFailed: "Governor may need adjustment or fuel system issue",
        toolRequired: "Tachometer",
      },
      {
        step: 3,
        action: "Verify generator output current",
        expectedResult: "Current should be proportional to load applied",
        ifFailed: "Short circuit or overloaded circuit",
        toolRequired: "Clamp-on ammeter",
        safetyNote: "Use proper PPE when measuring live circuits",
      },
      {
        step: 4,
        action: "Check voltage drop under load",
        expectedResult: "Voltage should remain within ±5% of nominal",
        ifFailed: "AVR, excitation, or alternator issue",
        toolRequired: "Multimeter",
      },
      {
        step: 5,
        action: "Measure phase balance",
        expectedResult: "All three phases within 10% of each other",
        ifFailed: "Unbalanced load or alternator winding issue",
        toolRequired: "Three-phase ammeter",
      },
      {
        step: 6,
        action: "Verify protection settings",
        expectedResult: "Settings match generator rating",
        ifFailed: "Adjust protection settings to appropriate levels",
        toolRequired: "Controller programming tool",
      },
    ],
    commonCauses: [
      {
        cause: "Protection settings too sensitive",
        probability: 30,
        verificationMethod: "Check overcurrent and underfrequency settings",
        solution: "Adjust protection settings to match generator capacity and load profile",
      },
      {
        cause: "Fuel delivery insufficient under load",
        probability: 25,
        verificationMethod: "Monitor fuel pressure under load, check smoke color",
        solution: "Clean/replace fuel filters, check lift pump, bleed fuel system",
      },
      {
        cause: "Governor not responding fast enough",
        probability: 20,
        verificationMethod: "Watch engine speed during load step",
        solution: "Adjust governor gain or replace actuator",
      },
      {
        cause: "AVR/excitation system weak",
        probability: 15,
        verificationMethod: "Monitor voltage during load application",
        solution: "Adjust AVR, check exciter and brushes",
      },
      {
        cause: "Load exceeds generator capacity",
        probability: 10,
        verificationMethod: "Calculate actual load vs generator rating",
        solution: "Reduce load or use larger generator",
      },
    ],
    resolution: "Generator trips on load are usually due to either protection settings being too tight, or the engine/excitation system not responding quickly enough to load changes. Start by checking the protection settings against the nameplate rating. Then verify fuel system health and governor response. Finally, check the AVR and excitation system.",
    preventiveMeasures: [
      "Ensure protection settings match generator capacity",
      "Regular fuel system maintenance",
      "Annual governor service and adjustment",
      "Regular AVR and excitation system checks",
    ],
    relatedScenarios: ['underfrequency-trip', 'overcurrent-trip'],
  },

  {
    id: 'fuel-map-reprogramming',
    scenario: "Need to reprogram fuel maps",
    symptoms: [
      "Engine performance not optimal",
      "Fuel consumption too high",
      "Smoke at various loads",
      "Power output not matching specification",
      "Altitude/temperature compensation needed",
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: "Identify ECM type and software level",
        expectedResult: "Current calibration version and ECM part number",
        ifFailed: "Connect diagnostic tool to read ECM information",
        toolRequired: "OEM diagnostic software",
      },
      {
        step: 2,
        action: "Verify engine mechanical health",
        expectedResult: "Compression, valve clearances, injector spray patterns OK",
        ifFailed: "Fix mechanical issues before adjusting fuel maps",
        toolRequired: "Compression tester, timing tools",
        safetyNote: "Engine must be OFF for mechanical checks",
      },
      {
        step: 3,
        action: "Record current fuel map parameters",
        expectedResult: "Backup of all fuel-related settings",
        ifFailed: "Manual documentation if electronic backup not possible",
        toolRequired: "OEM software, laptop",
      },
      {
        step: 4,
        action: "Determine correct calibration for conditions",
        expectedResult: "Calibration file for your altitude/application",
        ifFailed: "Contact OEM for application-specific calibration",
        toolRequired: "OEM calibration database",
      },
      {
        step: 5,
        action: "Flash or adjust fuel parameters",
        expectedResult: "New calibration applied without errors",
        ifFailed: "Verify battery voltage, retry flash process",
        toolRequired: "OEM diagnostic software, battery charger",
        safetyNote: "Maintain stable power throughout programming",
      },
      {
        step: 6,
        action: "Verify performance after adjustment",
        expectedResult: "Improved performance, reduced smoke, correct power output",
        ifFailed: "Further adjustment or mechanical repair needed",
        toolRequired: "Load bank, power analyzer",
      },
    ],
    commonCauses: [
      {
        cause: "Wrong calibration for altitude",
        probability: 35,
        verificationMethod: "Compare calibration to installation altitude",
        solution: "Install calibration rated for site altitude",
      },
      {
        cause: "Generic calibration, not application-specific",
        probability: 25,
        verificationMethod: "Check if genset-specific calibration available",
        solution: "Apply generator application calibration with speed/load maps",
      },
      {
        cause: "Calibration outdated/recalled",
        probability: 20,
        verificationMethod: "Check OEM bulletins for calibration updates",
        solution: "Apply latest recommended calibration",
      },
      {
        cause: "Customer parameter changes incorrect",
        probability: 20,
        verificationMethod: "Review customer adjustable parameters",
        solution: "Reset to recommended values or adjust appropriately",
      },
    ],
    resolution: "Fuel map reprogramming requires OEM diagnostic software specific to your engine brand (INSITE for Cummins, CAT ET for Caterpillar, VODIA for Volvo, etc.). The calibration file must match your engine serial number and be appropriate for your operating altitude and application. Always backup current settings before making changes, maintain stable battery voltage during programming, and verify performance after with load testing.",
    preventiveMeasures: [
      "Document original calibration version",
      "Keep backup of all parameter settings",
      "Use only OEM-approved calibration files",
      "Verify altitude compensation is correct for installation site",
    ],
    relatedScenarios: ['ecm-reprogram-cummins', 'ecm-reprogram-caterpillar'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build the enhanced system prompt for AI chat
 */
export function buildExpertSystemPrompt(context?: ConversationContext): string {
  let prompt = EXPERT_CHAT_SYSTEM_PROMPT;

  if (context) {
    prompt += `\n\n## CURRENT CONTEXT\n`;

    if (context.generatorBrand) {
      prompt += `- Generator Brand: ${context.generatorBrand}\n`;
    }
    if (context.engineBrand) {
      prompt += `- Engine Brand: ${context.engineBrand}\n`;
    }
    if (context.controllerBrand) {
      prompt += `- Controller: ${context.controllerBrand}\n`;
    }
    if (context.engineHours) {
      prompt += `- Engine Hours: ${context.engineHours}\n`;
    }
    if (context.isNewInstallation !== undefined) {
      prompt += `- Installation Type: ${context.isNewInstallation ? 'New' : 'Existing'}\n`;
    }
    if (context.problemDuration) {
      prompt += `- Problem Duration: ${context.problemDuration}\n`;
    }
    if (context.userExperience) {
      prompt += `- User Experience Level: ${context.userExperience}\n`;
      if (context.userExperience === 'beginner') {
        prompt += `\nNote: User is a beginner - explain technical terms and be extra cautious with safety warnings.\n`;
      }
    }
    if (context.urgencyLevel === 'emergency') {
      prompt += `\n**EMERGENCY SITUATION** - Prioritize immediate safety and fastest resolution.\n`;
    }
  }

  return prompt;
}

/**
 * Find matching response template for a query
 */
export function findMatchingTemplate(query: string): ResponseTemplate | null {
  const queryLower = query.toLowerCase();

  for (const template of RESPONSE_TEMPLATES) {
    for (const trigger of template.trigger) {
      if (queryLower.includes(trigger.toLowerCase())) {
        return template;
      }
    }
  }

  return null;
}

/**
 * Find matching knowledge base entry
 */
export function findKnowledgeBaseEntry(query: string): KnowledgeBaseEntry | null {
  const queryLower = query.toLowerCase();

  for (const entry of KNOWLEDGE_BASE) {
    // Check scenario match
    if (queryLower.includes(entry.scenario.toLowerCase())) {
      return entry;
    }

    // Check symptom matches
    for (const symptom of entry.symptoms) {
      if (queryLower.includes(symptom.toLowerCase())) {
        return entry;
      }
    }
  }

  return null;
}

/**
 * Get relevant follow-up questions based on conversation state
 */
export function getFollowUpQuestions(
  category: keyof typeof FOLLOW_UP_QUESTIONS,
  count: number = 3
): string[] {
  const questions = FOLLOW_UP_QUESTIONS[category];
  if (!questions) return [];

  // Return random subset
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get engagement prompt based on situation
 */
export function getEngagementPrompt(
  situation: keyof typeof ENGAGEMENT_PROMPTS
): string {
  const prompts = ENGAGEMENT_PROMPTS[situation];
  if (!prompts || prompts.length === 0) return '';

  // Return random prompt
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Format a template response for inclusion in AI context
 */
export function formatTemplateForAI(template: ResponseTemplate): string {
  let formatted = `## ${template.title}\n\n`;
  formatted += template.response;

  if (template.safetyWarnings && template.safetyWarnings.length > 0) {
    formatted += `\n\n### Safety Warnings\n`;
    template.safetyWarnings.forEach((w) => {
      formatted += `- **WARNING:** ${w}\n`;
    });
  }

  if (template.toolsRequired && template.toolsRequired.length > 0) {
    formatted += `\n\n### Tools Required\n`;
    template.toolsRequired.forEach((t) => {
      formatted += `- ${t}\n`;
    });
  }

  if (template.partNumbers && template.partNumbers.length > 0) {
    formatted += `\n\n### Parts Reference\n`;
    template.partNumbers.forEach((p) => {
      formatted += `- **${p.description}**`;
      if (p.estimatedCostKES) {
        formatted += ` - KES ${p.estimatedCostKES.min.toLocaleString()}-${p.estimatedCostKES.max.toLocaleString()}`;
      }
      formatted += '\n';
    });
  }

  if (template.estimatedTime) {
    formatted += `\n**Estimated Time:** ${template.estimatedTime}\n`;
  }

  if (template.difficulty) {
    formatted += `**Difficulty Level:** ${template.difficulty}\n`;
  }

  return formatted;
}

/**
 * Format knowledge base entry for AI context
 */
export function formatKnowledgeBaseForAI(entry: KnowledgeBaseEntry): string {
  let formatted = `## Scenario: ${entry.scenario}\n\n`;

  formatted += `### Common Symptoms\n`;
  entry.symptoms.forEach((s) => {
    formatted += `- ${s}\n`;
  });

  formatted += `\n### Diagnostic Steps\n`;
  entry.diagnosticSteps.forEach((step) => {
    formatted += `\n**Step ${step.step}: ${step.action}**\n`;
    formatted += `- Expected: ${step.expectedResult}\n`;
    formatted += `- If failed: ${step.ifFailed}\n`;
    if (step.toolRequired) {
      formatted += `- Tool: ${step.toolRequired}\n`;
    }
    if (step.safetyNote) {
      formatted += `- **SAFETY:** ${step.safetyNote}\n`;
    }
  });

  formatted += `\n### Common Causes (by probability)\n`;
  entry.commonCauses
    .sort((a, b) => b.probability - a.probability)
    .forEach((cause) => {
      formatted += `\n**${cause.cause}** (${cause.probability}% likely)\n`;
      formatted += `- Verify: ${cause.verificationMethod}\n`;
      formatted += `- Solution: ${cause.solution}\n`;
    });

  formatted += `\n### Resolution Summary\n${entry.resolution}\n`;

  formatted += `\n### Preventive Measures\n`;
  entry.preventiveMeasures.forEach((m) => {
    formatted += `- ${m}\n`;
  });

  return formatted;
}

/**
 * Generate contextual response enhancement
 */
export function enhanceResponseWithContext(
  baseResponse: string,
  context: ConversationContext
): string {
  let enhanced = baseResponse;

  // Add experience-appropriate guidance
  if (context.userExperience === 'beginner') {
    enhanced += `\n\n**Note for beginners:** If any of these steps are unclear, please ask and I'll explain in more detail. Safety is paramount - if you're unsure about any step, it's better to consult a qualified technician.`;
  }

  // Add urgency-appropriate closing
  if (context.urgencyLevel === 'emergency') {
    enhanced += `\n\n**EMERGENCY REMINDER:** If you smell fuel, see sparks, or hear unusual noises, shut down immediately and ensure everyone is at a safe distance.`;
  }

  // Add Kenya-specific considerations
  enhanced += `\n\n*Considering Kenya's operating conditions (dust, heat, humidity), ensure proper maintenance intervals are followed and use quality consumables.*`;

  return enhanced;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  EXPERT_CHAT_SYSTEM_PROMPT,
  FOLLOW_UP_QUESTIONS,
  ENGAGEMENT_PROMPTS,
  RESPONSE_TEMPLATES,
  KNOWLEDGE_BASE,
  buildExpertSystemPrompt,
  findMatchingTemplate,
  findKnowledgeBaseEntry,
  getFollowUpQuestions,
  getEngagementPrompt,
  formatTemplateForAI,
  formatKnowledgeBaseForAI,
  enhanceResponseWithContext,
};
