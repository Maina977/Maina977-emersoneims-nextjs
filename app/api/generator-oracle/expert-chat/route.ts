import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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
`;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Build the enhanced system prompt
    const enhancedSystemPrompt = `${systemPrompt}

${GENERATOR_KNOWLEDGE}

RESPONSE FORMAT GUIDELINES:
- Be conversational but efficient
- Use bullet points for lists
- Bold important terms using **term**
- Provide specific values and ranges
- Always include safety warnings where applicable
- Format repair steps as numbered lists
- Include cost estimates in KES where relevant
- Ask clarifying questions when needed (but max 3-4 before diagnosis)
`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
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

    return NextResponse.json({
      content,
      metadata,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Expert chat API error:', error);

    // Return a helpful error response
    return NextResponse.json(
      {
        error: 'Failed to process request',
        content: `I'm experiencing a temporary connection issue. While I reconnect, here are some general troubleshooting tips:

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
      { status: 200 } // Return 200 with fallback content
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
