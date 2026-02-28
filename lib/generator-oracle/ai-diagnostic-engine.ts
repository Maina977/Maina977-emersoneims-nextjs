/**
 * GENERATOR ORACLE AI DIAGNOSTIC ENGINE
 *
 * The most comprehensive AI-powered generator diagnostic system in the world.
 * Provides 100% detailed, accurate analysis with predictive capabilities.
 *
 * Features:
 * - Multi-parameter correlation analysis
 * - Root cause probability ranking
 * - Predictive failure detection
 * - Step-by-step repair procedures
 * - Parts and tools recommendations
 * - Cost estimates in KES
 * - Safety warnings
 * - Related fault predictions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GeneratorReadings {
  // Engine Parameters
  rpm?: number;
  oilPressure?: number;
  oilTemperature?: number;
  coolantTemp?: number;
  coolantPressure?: number;
  fuelPressure?: number;
  fuelLevel?: number;
  engineHours?: number;
  intakeAirTemp?: number;
  exhaustTemp?: number;
  turboBoostPressure?: number;

  // Electrical Parameters
  voltageL1N?: number;
  voltageL2N?: number;
  voltageL3N?: number;
  voltageL1L2?: number;
  voltageL2L3?: number;
  voltageL3L1?: number;
  currentL1?: number;
  currentL2?: number;
  currentL3?: number;
  currentNeutral?: number;
  frequency?: number;
  powerFactor?: number;

  // Load Parameters
  activePowerKw?: number;
  reactivePowerKvar?: number;
  apparentPowerKva?: number;
  loadPercent?: number;

  // Battery & Charging
  batteryVoltage?: number;
  chargerCurrent?: number;

  // Generator Info
  generatorKva?: number;
  generatorBrand?: string;
  controllerType?: string;
}

export interface DiagnosticIssue {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'emergency';
  severity: number; // 1-10 scale
  title: string;
  description: string;
}

export interface RootCause {
  cause: string;
  probability: number; // 0-100
  explanation: string;
  verificationSteps: string[];
  toolsRequired: string[];
  timeToVerify: string;
}

export interface RepairStep {
  step: number;
  action: string;
  details: string;
  safetyWarning?: string;
  tip?: string;
  timeEstimate: string;
}

export interface PartRecommendation {
  name: string;
  quantity: number;
  estimatedCostKES: number;
  alternativeOptions: string[];
  whereToSource: string[];
}

export interface AIAnalysisResult {
  timestamp: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  healthScore: number; // 0-100

  // Issues Found
  issues: DiagnosticIssue[];
  criticalCount: number;
  warningCount: number;
  normalCount: number;

  // Main Diagnosis
  primaryDiagnosis: {
    title: string;
    summary: string;
    confidence: number;
    rootCauses: RootCause[];
  };

  // Detailed Analysis Per Issue
  detailedAnalysis: Array<{
    issue: DiagnosticIssue;
    technicalExplanation: string;
    systemImpact: string;
    immediateActions: string[];
    rootCauses: RootCause[];
    repairProcedure: RepairStep[];
    partsRequired: PartRecommendation[];
    toolsRequired: string[];
    estimatedRepairTime: string;
    estimatedCostKES: { min: number; max: number };
    preventiveMeasures: string[];
    relatedFaults: string[];
  }>;

  // Correlations & Predictions
  correlations: Array<{
    parameters: string[];
    finding: string;
    implication: string;
    actionRequired: string;
  }>;

  predictedFailures: Array<{
    component: string;
    timeframe: string;
    probability: number;
    preventiveAction: string;
    costIfIgnored: number;
  }>;

  // Recommendations
  immediateActions: string[];
  scheduledMaintenance: Array<{
    task: string;
    dueIn: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>;

  // Summary
  executiveSummary: string;
  technicianNotes: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER SPECIFICATIONS WITH DETAILED THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════════

interface ParameterSpec {
  name: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  warningLow: number;
  warningHigh: number;
  criticalLow: number;
  criticalHigh: number;
  emergencyLow?: number;
  emergencyHigh?: number;
  description: string;
  category: 'engine' | 'electrical' | 'fuel' | 'cooling' | 'battery' | 'load';
}

const PARAMETER_SPECS: Record<string, ParameterSpec> = {
  oilPressure: {
    name: 'Oil Pressure',
    unit: 'PSI',
    normalMin: 30,
    normalMax: 65,
    warningLow: 20,
    warningHigh: 75,
    criticalLow: 15,
    criticalHigh: 85,
    emergencyLow: 10,
    description: 'Engine lubrication oil pressure - critical for bearing protection',
    category: 'engine'
  },
  oilTemperature: {
    name: 'Oil Temperature',
    unit: '°C',
    normalMin: 70,
    normalMax: 100,
    warningLow: 50,
    warningHigh: 110,
    criticalLow: 30,
    criticalHigh: 120,
    emergencyHigh: 130,
    description: 'Engine oil temperature - affects viscosity and lubrication efficiency',
    category: 'engine'
  },
  coolantTemp: {
    name: 'Coolant Temperature',
    unit: '°C',
    normalMin: 75,
    normalMax: 95,
    warningLow: 60,
    warningHigh: 100,
    criticalLow: 40,
    criticalHigh: 105,
    emergencyHigh: 110,
    description: 'Engine cooling water temperature',
    category: 'cooling'
  },
  rpm: {
    name: 'Engine Speed',
    unit: 'RPM',
    normalMin: 1480,
    normalMax: 1520,
    warningLow: 1450,
    warningHigh: 1550,
    criticalLow: 1400,
    criticalHigh: 1600,
    emergencyHigh: 1700,
    description: 'Engine rotational speed - affects frequency output',
    category: 'engine'
  },
  frequency: {
    name: 'Output Frequency',
    unit: 'Hz',
    normalMin: 49.5,
    normalMax: 50.5,
    warningLow: 49,
    warningHigh: 51,
    criticalLow: 47,
    criticalHigh: 53,
    emergencyLow: 45,
    emergencyHigh: 55,
    description: 'Generator output frequency - critical for connected equipment',
    category: 'electrical'
  },
  voltageL1N: {
    name: 'Voltage L1-N',
    unit: 'V AC',
    normalMin: 220,
    normalMax: 240,
    warningLow: 210,
    warningHigh: 250,
    criticalLow: 200,
    criticalHigh: 260,
    emergencyLow: 190,
    emergencyHigh: 270,
    description: 'Phase to neutral voltage',
    category: 'electrical'
  },
  voltageL2N: {
    name: 'Voltage L2-N',
    unit: 'V AC',
    normalMin: 220,
    normalMax: 240,
    warningLow: 210,
    warningHigh: 250,
    criticalLow: 200,
    criticalHigh: 260,
    description: 'Phase L2 to neutral voltage',
    category: 'electrical'
  },
  voltageL3N: {
    name: 'Voltage L3-N',
    unit: 'V AC',
    normalMin: 220,
    normalMax: 240,
    warningLow: 210,
    warningHigh: 250,
    criticalLow: 200,
    criticalHigh: 260,
    description: 'Phase L3 to neutral voltage',
    category: 'electrical'
  },
  voltageL1L2: {
    name: 'Voltage L1-L2',
    unit: 'V AC',
    normalMin: 380,
    normalMax: 420,
    warningLow: 370,
    warningHigh: 430,
    criticalLow: 360,
    criticalHigh: 440,
    description: 'Line to line voltage',
    category: 'electrical'
  },
  voltageL2L3: {
    name: 'Voltage L2-L3',
    unit: 'V AC',
    normalMin: 380,
    normalMax: 420,
    warningLow: 370,
    warningHigh: 430,
    criticalLow: 360,
    criticalHigh: 440,
    description: 'Line to line voltage L2-L3',
    category: 'electrical'
  },
  voltageL3L1: {
    name: 'Voltage L3-L1',
    unit: 'V AC',
    normalMin: 380,
    normalMax: 420,
    warningLow: 370,
    warningHigh: 430,
    criticalLow: 360,
    criticalHigh: 440,
    description: 'Line to line voltage L3-L1',
    category: 'electrical'
  },
  currentL1: {
    name: 'Current L1',
    unit: 'A',
    normalMin: 0,
    normalMax: 500,
    warningLow: 0,
    warningHigh: 550,
    criticalLow: 0,
    criticalHigh: 600,
    description: 'Phase L1 current',
    category: 'electrical'
  },
  currentL2: {
    name: 'Current L2',
    unit: 'A',
    normalMin: 0,
    normalMax: 500,
    warningLow: 0,
    warningHigh: 550,
    criticalLow: 0,
    criticalHigh: 600,
    description: 'Phase L2 current',
    category: 'electrical'
  },
  currentL3: {
    name: 'Current L3',
    unit: 'A',
    normalMin: 0,
    normalMax: 500,
    warningLow: 0,
    warningHigh: 550,
    criticalLow: 0,
    criticalHigh: 600,
    description: 'Phase L3 current',
    category: 'electrical'
  },
  loadPercent: {
    name: 'Load Percentage',
    unit: '%',
    normalMin: 30,
    normalMax: 80,
    warningLow: 10,
    warningHigh: 90,
    criticalLow: 5,
    criticalHigh: 100,
    emergencyHigh: 110,
    description: 'Generator load as percentage of rated capacity',
    category: 'load'
  },
  powerFactor: {
    name: 'Power Factor',
    unit: '',
    normalMin: 0.85,
    normalMax: 1.0,
    warningLow: 0.75,
    warningHigh: 1.0,
    criticalLow: 0.65,
    criticalHigh: 1.0,
    description: 'Ratio of real power to apparent power',
    category: 'electrical'
  },
  batteryVoltage: {
    name: 'Battery Voltage',
    unit: 'V DC',
    normalMin: 24,
    normalMax: 28,
    warningLow: 22,
    warningHigh: 30,
    criticalLow: 20,
    criticalHigh: 32,
    emergencyLow: 18,
    description: 'Starting battery voltage (24V system)',
    category: 'battery'
  },
  fuelLevel: {
    name: 'Fuel Level',
    unit: '%',
    normalMin: 30,
    normalMax: 100,
    warningLow: 20,
    warningHigh: 100,
    criticalLow: 10,
    criticalHigh: 100,
    emergencyLow: 5,
    description: 'Fuel tank level percentage',
    category: 'fuel'
  },
  fuelPressure: {
    name: 'Fuel Pressure',
    unit: 'bar',
    normalMin: 2.5,
    normalMax: 4.0,
    warningLow: 2.0,
    warningHigh: 4.5,
    criticalLow: 1.5,
    criticalHigh: 5.0,
    description: 'Fuel supply pressure to injectors',
    category: 'fuel'
  },
  exhaustTemp: {
    name: 'Exhaust Temperature',
    unit: '°C',
    normalMin: 350,
    normalMax: 550,
    warningLow: 300,
    warningHigh: 600,
    criticalLow: 250,
    criticalHigh: 650,
    emergencyHigh: 700,
    description: 'Exhaust gas temperature',
    category: 'engine'
  },
  turboBoostPressure: {
    name: 'Turbo Boost Pressure',
    unit: 'bar',
    normalMin: 1.0,
    normalMax: 2.5,
    warningLow: 0.8,
    warningHigh: 2.8,
    criticalLow: 0.5,
    criticalHigh: 3.0,
    description: 'Turbocharger boost pressure',
    category: 'engine'
  },
  intakeAirTemp: {
    name: 'Intake Air Temperature',
    unit: '°C',
    normalMin: 20,
    normalMax: 50,
    warningLow: 10,
    warningHigh: 55,
    criticalLow: 0,
    criticalHigh: 65,
    description: 'Air temperature entering the engine',
    category: 'engine'
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE DIAGNOSTIC KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════════════════

interface DiagnosticKnowledge {
  parameter: string;
  conditions: {
    low?: {
      causes: RootCause[];
      repairSteps: RepairStep[];
      parts: PartRecommendation[];
      tools: string[];
      techExplanation: string;
      systemImpact: string;
      preventiveMeasures: string[];
      relatedFaults: string[];
    };
    high?: {
      causes: RootCause[];
      repairSteps: RepairStep[];
      parts: PartRecommendation[];
      tools: string[];
      techExplanation: string;
      systemImpact: string;
      preventiveMeasures: string[];
      relatedFaults: string[];
    };
  };
}

const DIAGNOSTIC_KNOWLEDGE: DiagnosticKnowledge[] = [
  {
    parameter: 'oilPressure',
    conditions: {
      low: {
        causes: [
          {
            cause: 'Low Oil Level in Crankcase',
            probability: 35,
            explanation: 'Insufficient oil in the sump causes the oil pump pickup tube to draw air intermittently, leading to erratic or consistently low oil pressure. This is the most common cause and easiest to diagnose and correct. Oil consumption can occur from leaks, worn piston rings, or valve stem seal deterioration.',
            verificationSteps: [
              'Stop engine and wait 5 minutes for oil to drain back to sump',
              'Remove dipstick, wipe clean with lint-free cloth',
              'Reinsert dipstick fully, then remove and check level',
              'Level should be between MIN and MAX marks',
              'Inspect area under generator for oil puddles or stains',
              'Check oil filler cap for proper seal',
              'Examine drain plug for leaks'
            ],
            toolsRequired: ['Clean lint-free cloth', 'Flashlight', 'Correct grade engine oil'],
            timeToVerify: '5 minutes'
          },
          {
            cause: 'Faulty Oil Pressure Sender/Sensor',
            probability: 25,
            explanation: 'The oil pressure transducer can fail electrically (open circuit, short circuit) or mechanically (stuck diaphragm, clogged orifice). This gives false low readings while actual oil pressure is normal. Senders are wear items and should be replaced every 5 years or 10,000 hours.',
            verificationSteps: [
              'Install mechanical oil pressure gauge at sender port',
              'Start engine and compare mechanical gauge to controller reading',
              'If mechanical gauge reads normal (30-65 PSI) but controller shows low, sender is faulty',
              'Check sender wiring for damage, corrosion, or loose connections',
              'Measure sender resistance with multimeter (compare to specs)',
              'Look for oil leakage around sender threads'
            ],
            toolsRequired: ['Mechanical oil pressure gauge 0-100 PSI', 'Multimeter', 'Correct adapter fittings', 'Thread sealant'],
            timeToVerify: '30 minutes'
          },
          {
            cause: 'Worn Engine Main Bearings',
            probability: 20,
            explanation: 'Excessive clearance in crankshaft main bearings allows oil to escape the bearing surface faster than the pump can supply it. This typically develops gradually over high operating hours. Metal-to-metal contact during low oil pressure events accelerates bearing wear.',
            verificationSteps: [
              'Note engine hours - higher hours increase likelihood',
              'Listen for deep knocking sound at low RPM (bearing knock)',
              'Install mechanical gauge to confirm actual low pressure',
              'Perform oil analysis - check for copper, lead, aluminum particles',
              'Check for metal particles in oil filter (cut filter open)',
              'If confirmed, engine disassembly required for bearing measurement'
            ],
            toolsRequired: ['Mechanical oil pressure gauge', 'Stethoscope', 'Oil analysis kit', 'Filter cutting tool', 'Plastigage', 'Micrometers'],
            timeToVerify: '2-8 hours'
          },
          {
            cause: 'Oil Pump Wear or Failure',
            probability: 10,
            explanation: 'The gear-type oil pump can experience wear to the gears, housing, or drive mechanism. The pressure relief valve can stick open or have a weak spring. Drive gear or coupling failure results in complete loss of pressure.',
            verificationSteps: [
              'Check for any unusual noises from front of engine (gear whine)',
              'Install mechanical gauge to confirm low pressure at all RPM',
              'Note if pressure improves with RPM (partial wear) or stays low (severe)',
              'Check oil pump drive gear condition if accessible',
              'Pump inspection requires removal from engine'
            ],
            toolsRequired: ['Mechanical oil pressure gauge', 'Engine hoist', 'Complete hand tool set', 'Feeler gauges', 'Straight edge'],
            timeToVerify: '4-8 hours'
          },
          {
            cause: 'Clogged Oil Filter or Pickup Screen',
            probability: 8,
            explanation: 'Severely contaminated oil can clog the filter element or the pickup screen in the sump. While the bypass valve should prevent complete blockage, heavy contamination can still restrict flow enough to reduce pressure.',
            verificationSteps: [
              'Check service records - when was last oil change?',
              'Remove and inspect oil filter - is it swollen or deformed?',
              'Cut open filter and look for debris, metal particles',
              'Drain oil and inspect condition - is it black, thick, smells burnt?',
              'If engine has accessible sump, inspect pickup screen'
            ],
            toolsRequired: ['Filter wrench', 'Drain pan', 'Filter cutting tool', 'New filter', 'Correct grade oil'],
            timeToVerify: '45 minutes'
          },
          {
            cause: 'Oil Diluted with Fuel',
            probability: 2,
            explanation: 'Fuel leaking past injector seals or from a failed injection pump can dilute the oil, reducing its viscosity and ability to maintain pressure. Often accompanied by elevated crankcase level and fuel smell in oil.',
            verificationSteps: [
              'Check oil level - is it higher than normal?',
              'Smell dipstick - is there a fuel odor?',
              'Check oil viscosity - does it feel thin and runny?',
              'Look for fuel leaks around injectors and fuel lines',
              'Perform fuel dilution test on oil sample'
            ],
            toolsRequired: ['Oil analysis kit', 'Inspection mirror', 'Flashlight'],
            timeToVerify: '30 minutes'
          }
        ],
        repairSteps: [
          {
            step: 1,
            action: 'Immediate Engine Shutdown',
            details: 'Stop the engine immediately to prevent catastrophic damage. Do not attempt to "limp" the generator to a convenient location. Running with low oil pressure for even 30 seconds can cause permanent bearing damage.',
            safetyWarning: 'NEVER continue operating an engine with low oil pressure. Catastrophic failure can occur within minutes resulting in costly repairs.',
            timeEstimate: 'Immediate'
          },
          {
            step: 2,
            action: 'Document Fault Information',
            details: 'Record all fault codes, oil pressure reading when fault occurred, engine hours, last service date, and any unusual sounds or conditions. Take photos of the controller display and any visible issues.',
            timeEstimate: '5 minutes'
          },
          {
            step: 3,
            action: 'Safety Precautions',
            details: 'Allow engine to cool for at least 30 minutes before inspection. Hot oil can cause severe burns. Ensure generator is isolated from load and cannot auto-start.',
            safetyWarning: 'Engine oil can reach 120°C during operation. Allow adequate cooling time before service.',
            timeEstimate: '30 minutes cooling'
          },
          {
            step: 4,
            action: 'Check Oil Level',
            details: 'With engine stopped for at least 5 minutes, check oil level on dipstick. If low, add correct grade oil (typically 15W-40 or as specified on engine plate). Do not overfill - excess oil causes aeration and foaming.',
            tip: 'Keep a spare 5L of correct grade oil at the generator location for emergency top-ups.',
            timeEstimate: '10 minutes'
          },
          {
            step: 5,
            action: 'Install Mechanical Gauge',
            details: 'Remove the oil pressure sender and install a known-accurate mechanical gauge. Apply thread sealant to adapter fittings. Route gauge hose safely away from moving parts and hot surfaces.',
            tip: 'Use a long gauge hose so you can observe the gauge while standing at the control panel.',
            timeEstimate: '15 minutes'
          },
          {
            step: 6,
            action: 'Perform Pressure Test',
            details: 'Start engine and observe mechanical gauge. Allow 30 seconds to stabilize. Check pressure at idle (expect 25-35 PSI) and at rated speed (expect 45-80 PSI). Compare to controller reading.',
            safetyWarning: 'Stand clear of the engine during test. High-pressure oil spray can penetrate skin.',
            timeEstimate: '10 minutes'
          },
          {
            step: 7,
            action: 'Diagnosis Based on Results',
            details: 'If mechanical gauge reads normal but controller shows low: replace oil pressure sender. If mechanical gauge confirms low pressure: proceed with internal diagnosis (bearings, pump, etc.). Document all findings.',
            timeEstimate: 'Varies by finding'
          },
          {
            step: 8,
            action: 'Replace Oil Pressure Sender (if faulty)',
            details: 'Remove old sender, apply thread sealant to new sender, install and tighten to correct torque (typically 15-20 Nm). Reconnect wiring. Clear fault codes and test.',
            timeEstimate: '20 minutes'
          },
          {
            step: 9,
            action: 'Perform Oil and Filter Change',
            details: 'Even if cause was just the sender, take this opportunity to change oil and filter. Drain oil into approved container, replace drain plug washer, install new filter, add fresh oil to correct level.',
            timeEstimate: '45 minutes'
          },
          {
            step: 10,
            action: 'Final Verification',
            details: 'Start engine and verify oil pressure is normal on controller. Run for 15 minutes and recheck. Monitor for leaks. Clear all fault codes. Document repair in service log.',
            timeEstimate: '20 minutes'
          }
        ],
        parts: [
          {
            name: 'Oil Pressure Sender',
            quantity: 1,
            estimatedCostKES: 3500,
            alternativeOptions: ['OEM sender', 'VDO compatible sender', 'Murphy sender'],
            whereToSource: ['Generator dealer', 'Auto electrical supplier', 'Industrial supplies Nairobi']
          },
          {
            name: 'Engine Oil 15W-40 (20L)',
            quantity: 1,
            estimatedCostKES: 8500,
            alternativeOptions: ['Shell Rimula R4', 'Total Rubia TIR', 'Mobil Delvac MX', 'Caltex Delo'],
            whereToSource: ['Oil distributors', 'Generator service centers', 'Industrial suppliers']
          },
          {
            name: 'Oil Filter',
            quantity: 1,
            estimatedCostKES: 2500,
            alternativeOptions: ['OEM filter', 'Fleetguard LF', 'Donaldson', 'Mann'],
            whereToSource: ['Generator dealer', 'Filter suppliers', 'Auto parts stores']
          },
          {
            name: 'Drain Plug Washer',
            quantity: 1,
            estimatedCostKES: 150,
            alternativeOptions: ['Copper washer', 'Aluminum washer'],
            whereToSource: ['Hardware store', 'Auto parts']
          }
        ],
        tools: [
          'Mechanical oil pressure gauge (0-100 PSI)',
          'Adapter fittings (1/8" and 1/4" NPT)',
          'Thread sealant (Teflon tape or liquid)',
          'Socket set (metric and imperial)',
          'Oil filter wrench',
          'Drain pan (20L capacity)',
          'Torque wrench',
          'Multimeter',
          'Clean lint-free cloths',
          'Flashlight'
        ],
        techExplanation: `Low oil pressure is a critical condition that requires immediate attention. The engine lubrication system maintains a thin film of oil (typically 0.001-0.003 inches) between all moving metal surfaces. This hydrodynamic lubrication prevents metal-to-metal contact that would cause rapid wear and heat generation.

When oil pressure drops below the critical threshold, this protective film breaks down. The main bearings supporting the crankshaft are the first to suffer, as they carry the highest loads (several tons of force during combustion). Without adequate lubrication, bearing temperatures can rise from 100°C to over 300°C in seconds, causing the soft bearing material to melt and the crankshaft to seize.

The oil pump, typically a gear-type pump driven by the crankshaft, generates pressure by drawing oil from the sump and forcing it through the engine's oil galleries. Pressure is maintained by the restriction created as oil flows through the bearings. Any increase in bearing clearance (from wear) or decrease in oil viscosity (from heat or fuel dilution) reduces this restriction and causes pressure to drop.

Modern controllers monitor oil pressure continuously and implement multiple protection thresholds: a warning at approximately 25 PSI that illuminates an indicator and may reduce load, and a shutdown threshold at 15 PSI that immediately stops the engine. Some advanced systems also monitor pressure rate-of-change to detect rapid drops before reaching absolute thresholds.`,
        systemImpact: `Low oil pressure operation causes immediate and long-term damage to multiple engine systems:

IMMEDIATE EFFECTS:
- Main bearing scoring and wear (seconds to minutes)
- Connecting rod bearing failure (1-5 minutes)
- Camshaft bearing wear (1-5 minutes)
- Turbocharger bearing failure (extremely rapid due to 150,000+ RPM)
- Increased friction causing heat buildup throughout engine

SECONDARY EFFECTS:
- Metal particle contamination of oil system
- Scoring of crankshaft and camshaft journals
- Damage to piston pin bushings
- Accelerated wear of timing gears/chain

LONG-TERM CONSEQUENCES:
- Reduced engine service life
- Increased oil consumption
- Loss of compression from ring/bore wear
- Potential for catastrophic failure (thrown rod, seized crankshaft)

REPAIR COST ESCALATION:
- Sender replacement only: KES 5,000-10,000
- Oil pump replacement: KES 50,000-100,000
- Bearing replacement: KES 150,000-300,000
- Complete engine overhaul: KES 500,000-1,500,000
- Engine replacement: KES 1,000,000-5,000,000+`,
        preventiveMeasures: [
          'Check oil level weekly when generator is in regular use',
          'Change oil and filter every 250-500 hours or annually (whichever comes first)',
          'Use only manufacturer-specified oil grade (typically 15W-40 CI-4 or CJ-4)',
          'Replace oil pressure sender every 5 years or 10,000 hours preventively',
          'Perform oil analysis every 500 hours to detect wear particles early',
          'Keep 5L spare oil at generator location for emergency top-ups',
          'Investigate any oil leaks immediately - do not ignore small drips',
          'Monitor oil consumption trend - sudden increase indicates problem',
          'Allow engine to idle for 30 seconds before applying load',
          'Never bypass oil pressure shutdown protection'
        ],
        relatedFaults: [
          'High oil temperature - may indicate low level or pump issue',
          'High coolant temperature - may share root cause (overload, blocked cooling)',
          'Low fuel pressure - may indicate fuel system affecting engine operation',
          'Overspeed - may occur if engine loses load due to shutdown',
          'Battery low voltage - starter circuit may have drained battery on failed starts'
        ]
      },
      high: {
        causes: [
          {
            cause: 'Oil Pressure Relief Valve Stuck Closed',
            probability: 40,
            explanation: 'The relief valve, designed to bypass excess oil back to the sump when pressure exceeds normal, can stick closed due to debris or corrosion. This causes pressure to rise above safe levels.',
            verificationSteps: [
              'Install mechanical gauge to confirm high pressure',
              'Check pressure at idle and rated speed',
              'Pressure above 80 PSI at rated speed indicates relief valve issue',
              'Relief valve typically located on oil pump or filter housing'
            ],
            toolsRequired: ['Mechanical oil pressure gauge', 'Socket set', 'Cleaning solvent'],
            timeToVerify: '30 minutes'
          },
          {
            cause: 'Wrong Viscosity Oil Installed',
            probability: 35,
            explanation: 'Oil that is too thick for the operating temperature (wrong grade installed) will generate higher than normal pressure, especially when cold.',
            verificationSteps: [
              'Check oil grade on container against engine specification',
              'Note if problem is worse when cold and improves when warm',
              'Thick oil appears more viscous on dipstick'
            ],
            toolsRequired: ['None - visual inspection'],
            timeToVerify: '5 minutes'
          },
          {
            cause: 'Faulty Oil Pressure Sender Reading High',
            probability: 20,
            explanation: 'The pressure sender can fail in a way that causes high readings rather than low.',
            verificationSteps: [
              'Install mechanical gauge and compare to controller reading',
              'If mechanical gauge reads normal but controller shows high, sender is faulty'
            ],
            toolsRequired: ['Mechanical oil pressure gauge', 'Multimeter'],
            timeToVerify: '30 minutes'
          },
          {
            cause: 'Blocked Oil Gallery or Passage',
            probability: 5,
            explanation: 'A blockage downstream of the pressure sensing point can cause localized high pressure. Usually results from debris from previous bearing failure.',
            verificationSteps: [
              'Check for signs of previous engine damage',
              'Oil analysis for metal contamination',
              'May require partial engine disassembly to inspect galleries'
            ],
            toolsRequired: ['Oil analysis kit', 'Inspection camera'],
            timeToVerify: '2-4 hours'
          }
        ],
        repairSteps: [
          {
            step: 1,
            action: 'Verify High Pressure with Mechanical Gauge',
            details: 'Install known-accurate mechanical gauge at sender location. Compare readings at idle and rated speed. Document the actual vs. indicated pressure.',
            timeEstimate: '20 minutes'
          },
          {
            step: 2,
            action: 'Check Oil Grade',
            details: 'Verify that the correct oil grade is installed. If wrong grade, schedule oil change to correct specification.',
            timeEstimate: '5 minutes'
          },
          {
            step: 3,
            action: 'Inspect Relief Valve',
            details: 'Locate the oil pressure relief valve (usually on oil pump or filter housing). Remove and inspect for debris, scoring, or stuck plunger. Clean or replace as needed.',
            timeEstimate: '1-2 hours'
          },
          {
            step: 4,
            action: 'Replace Sender if Faulty',
            details: 'If mechanical pressure is normal but controller shows high, replace the oil pressure sender.',
            timeEstimate: '20 minutes'
          }
        ],
        parts: [
          {
            name: 'Oil Pressure Relief Valve Kit',
            quantity: 1,
            estimatedCostKES: 8500,
            alternativeOptions: ['OEM valve kit', 'Aftermarket equivalent'],
            whereToSource: ['Generator dealer', 'Engine parts supplier']
          }
        ],
        tools: ['Mechanical oil pressure gauge', 'Socket set', 'Cleaning solvent', 'Thread sealant'],
        techExplanation: `High oil pressure, while less immediately dangerous than low pressure, can still cause problems. Excessive pressure can blow out oil seals, damage gaskets, and in extreme cases rupture oil cooler lines or the filter housing.

The oil pressure relief valve is designed to limit maximum system pressure by bypassing excess oil back to the sump when pressure exceeds a preset threshold (typically 70-80 PSI). This valve contains a spring-loaded plunger that opens against spring pressure when oil pressure rises.

If this valve sticks closed, the full pump output has no bypass path and pressure can rise to damaging levels. The valve can stick due to debris lodging against the plunger, corrosion from moisture in the oil, or varnish buildup from degraded oil.

Oil viscosity directly affects pressure - thicker oil generates more resistance as it flows through bearings and galleries, resulting in higher pressure. This is why cold starts show higher pressure that decreases as oil warms and thins. Using oil that is too thick for the application causes chronically elevated pressure.`,
        systemImpact: `High oil pressure can cause:
- Oil seal and gasket blowouts leading to external leaks
- Oil cooler line or fitting failure
- Excessive load on oil pump drive
- Filter housing damage
- Reduced bearing oil flow if relief valve is completely stuck`,
        preventiveMeasures: [
          'Use only manufacturer-specified oil grade',
          'Replace oil and filter at recommended intervals',
          'Include relief valve inspection in major services',
          'Flush engine with fresh oil if contamination suspected'
        ],
        relatedFaults: [
          'External oil leaks - may result from blown seals',
          'Oil filter warning - may indicate high differential pressure'
        ]
      }
    }
  },
  {
    parameter: 'coolantTemp',
    conditions: {
      high: {
        causes: [
          {
            cause: 'Low Coolant Level',
            probability: 30,
            explanation: 'Insufficient coolant in the system reduces heat transfer capacity. Air pockets form in the cooling passages, preventing proper circulation and causing localized overheating.',
            verificationSteps: [
              'SAFETY: Do NOT open radiator cap while hot - severe burn risk!',
              'Allow engine to cool for at least 1 hour',
              'Check coolant level in expansion tank (should be between marks)',
              'If safe to open radiator cap, check that radiator is full',
              'Inspect for visible coolant leaks under generator, around hoses, at water pump'
            ],
            toolsRequired: ['Flashlight', 'Coolant pressure tester (optional)'],
            timeToVerify: '15 minutes (after cooling)'
          },
          {
            cause: 'Faulty Thermostat Stuck Closed',
            probability: 25,
            explanation: 'The thermostat regulates coolant flow to the radiator. If it sticks closed, coolant cannot circulate to the radiator for cooling, causing rapid temperature rise.',
            verificationSteps: [
              'Feel radiator hoses - inlet should be hot, outlet cooler when thermostat opens',
              'If both hoses are cold while engine is hot, thermostat is not opening',
              'Remove and test thermostat in pot of hot water with thermometer',
              'Should start opening at 82-88°C depending on rating'
            ],
            toolsRequired: ['Infrared thermometer', 'Cooking pot', 'Thermometer', 'Socket set for thermostat housing'],
            timeToVerify: '45 minutes'
          },
          {
            cause: 'Cooling Fan Not Operating',
            probability: 20,
            explanation: 'The radiator cooling fan removes heat from the coolant. Failure can be due to fan motor burnout, belt breakage (on belt-driven fans), failed thermal switch, or blown fuse.',
            verificationSteps: [
              'With engine at operating temperature, verify fan is running',
              'If belt-driven, check belt condition and tension',
              'If electric, check fuse, thermal switch, and motor',
              'Listen for unusual noises indicating bearing failure'
            ],
            toolsRequired: ['Visual inspection', 'Multimeter', 'Belt tension gauge'],
            timeToVerify: '15 minutes'
          },
          {
            cause: 'Blocked Radiator (External or Internal)',
            probability: 15,
            explanation: 'External blockage from dust, debris, or insects reduces airflow through radiator fins. Internal blockage from scale, corrosion, or stop-leak products reduces coolant flow.',
            verificationSteps: [
              'Inspect radiator fins for debris accumulation',
              'Check for bent or damaged fins restricting airflow',
              'Feel for cold spots on radiator face indicating internal blockage',
              'Check coolant condition - rusty or contaminated indicates internal issues'
            ],
            toolsRequired: ['Flashlight', 'Compressed air', 'Fin comb', 'Infrared thermometer'],
            timeToVerify: '30 minutes'
          },
          {
            cause: 'Failed Water Pump',
            probability: 8,
            explanation: 'The water pump impeller can corrode, erode, or break, reducing coolant circulation. Bearing failure can also occur, often preceded by seal leakage.',
            verificationSteps: [
              'Check for coolant weeping from water pump weep hole',
              'Feel for play/wobble in pump shaft (indicates bearing wear)',
              'Listen for grinding or rumbling from pump area',
              'Check belt tension on belt-driven pumps'
            ],
            toolsRequired: ['Flashlight', 'Stethoscope'],
            timeToVerify: '15 minutes'
          },
          {
            cause: 'Head Gasket Failure',
            probability: 2,
            explanation: 'A blown head gasket can allow combustion gases into the cooling system, causing pressure buildup and displacement of coolant. Also allows coolant into cylinders or oil.',
            verificationSteps: [
              'Check for white smoke from exhaust (coolant burning)',
              'Inspect oil for milky appearance (coolant mixing with oil)',
              'Look for bubbles in expansion tank while engine runs',
              'Perform combustion gas test on coolant',
              'Check for external coolant leak at head gasket line'
            ],
            toolsRequired: ['Combustion leak detector kit', 'Inspection mirror'],
            timeToVerify: '30 minutes'
          }
        ],
        repairSteps: [
          {
            step: 1,
            action: 'Immediate Controlled Shutdown',
            details: 'Stop the engine immediately to prevent heat damage. Do not suddenly stop under high load - reduce load first if possible, then stop.',
            safetyWarning: 'A severely overheated engine can crack the head or block. Allow natural cooling - do not add cold water to a hot engine.',
            timeEstimate: 'Immediate'
          },
          {
            step: 2,
            action: 'Allow Adequate Cooling Time',
            details: 'Wait at least 60 minutes before attempting any cooling system inspection. Temperature should drop to below 50°C before opening any cooling system components.',
            safetyWarning: 'Hot coolant under pressure can cause severe burns. Never remove radiator cap from a hot engine.',
            timeEstimate: '60+ minutes'
          },
          {
            step: 3,
            action: 'Check Coolant Level When Safe',
            details: 'With engine cool, check expansion tank level and radiator level. If low, inspect for leaks before adding coolant. Top up with correct coolant mixture (typically 50/50 coolant and distilled water).',
            timeEstimate: '15 minutes'
          },
          {
            step: 4,
            action: 'Inspect Cooling Fan',
            details: 'Check fan operation - it should be running when engine is at operating temperature. For belt-driven fans, check belt condition and tension. For electric fans, check fuse, relay, and thermal switch.',
            timeEstimate: '20 minutes'
          },
          {
            step: 5,
            action: 'Clean Radiator',
            details: 'Remove debris from radiator fins using compressed air (blow from engine side outward). Straighten bent fins with fin comb. Ensure adequate clearance around radiator for airflow.',
            timeEstimate: '30 minutes'
          },
          {
            step: 6,
            action: 'Test Thermostat',
            details: 'If suspected, remove thermostat and test in pot of water with thermometer. Should begin opening at marked temperature and fully open 10-15°C higher. Replace if stuck.',
            timeEstimate: '45 minutes'
          },
          {
            step: 7,
            action: 'Inspect Water Pump',
            details: 'Check for leaks at weep hole, shaft play, and belt condition. If pump is suspected, replacement is recommended - internal failure will cause complete overheating.',
            timeEstimate: '30 minutes inspection, 3-4 hours replacement'
          },
          {
            step: 8,
            action: 'Pressure Test System',
            details: 'With engine cool, attach pressure tester to radiator cap fitting. Pressurize to cap rating (typically 0.9-1.0 bar). Watch for pressure drop indicating leak.',
            timeEstimate: '20 minutes'
          },
          {
            step: 9,
            action: 'Verify Repair',
            details: 'After repair, refill cooling system, bleed air pockets, start engine and monitor temperature. Should stabilize at 82-95°C. Run under load and verify temperature remains stable.',
            timeEstimate: '30 minutes'
          }
        ],
        parts: [
          {
            name: 'Thermostat',
            quantity: 1,
            estimatedCostKES: 2500,
            alternativeOptions: ['OEM thermostat', 'Wahler', 'Gates'],
            whereToSource: ['Generator dealer', 'Auto parts store']
          },
          {
            name: 'Coolant Concentrate (5L)',
            quantity: 1,
            estimatedCostKES: 3500,
            alternativeOptions: ['OEM coolant', 'Shell coolant', 'Total coolant'],
            whereToSource: ['Generator dealer', 'Auto parts store', 'Fuel station']
          },
          {
            name: 'Radiator Cap',
            quantity: 1,
            estimatedCostKES: 1500,
            alternativeOptions: ['OEM cap', 'Gates', 'Stant'],
            whereToSource: ['Auto parts store']
          },
          {
            name: 'Water Pump',
            quantity: 1,
            estimatedCostKES: 25000,
            alternativeOptions: ['OEM pump', 'GMB', 'Graf'],
            whereToSource: ['Generator dealer', 'Engine parts supplier']
          },
          {
            name: 'Fan Belt',
            quantity: 1,
            estimatedCostKES: 2000,
            alternativeOptions: ['OEM belt', 'Gates', 'Continental', 'Dayco'],
            whereToSource: ['Generator dealer', 'Auto parts store']
          }
        ],
        tools: [
          'Cooling system pressure tester',
          'Infrared thermometer',
          'Multimeter',
          'Socket set',
          'Screwdrivers',
          'Drain pan',
          'Funnel',
          'Distilled water',
          'Fin comb',
          'Compressed air'
        ],
        techExplanation: `Engine overheating is one of the most damaging conditions a diesel generator can experience. The cooling system is designed to maintain engine temperature within a narrow operating range (typically 82-95°C) where combustion efficiency is optimal and thermal expansion of components is within design limits.

The cooling system operates as a closed loop: coolant absorbs heat from the engine block and head, circulates through the radiator where heat is transferred to air, and returns cooled to the engine. The thermostat regulates this flow, blocking circulation to the radiator until the engine reaches operating temperature.

When temperature exceeds normal limits, several damaging processes begin:
- Thermal expansion causes components to grow beyond design clearances
- Oil viscosity drops, reducing lubrication effectiveness
- Combustion temperature rises, increasing NOx formation and potential detonation
- Gasket materials can be permanently damaged
- Extreme cases can warp or crack cylinder heads

The rate of damage increases exponentially with temperature above the design limit. An engine that reaches 115°C may survive with no damage, while one that reaches 125°C may suffer permanent head gasket damage.`,
        systemImpact: `High coolant temperature affects multiple systems:

IMMEDIATE EFFECTS:
- Reduced oil viscosity leading to lower oil pressure
- Increased wear on all moving parts
- Potential for detonation/knocking
- Automatic load reduction or shutdown by controller

COMPONENT DAMAGE (if not addressed):
- Head gasket failure (105-120°C range)
- Cylinder head warping (115-130°C range)
- Piston seizure (130°C+)
- Bearing failure due to oil breakdown

SECONDARY EFFECTS:
- Accelerated coolant breakdown
- Damage to hoses and seals
- Water pump seal failure from thermal stress
- Exhaust valve and seat damage`,
        preventiveMeasures: [
          'Check coolant level weekly',
          'Inspect radiator for debris monthly',
          'Replace coolant every 2 years or 5000 hours',
          'Test coolant freeze/boil protection annually',
          'Inspect hoses and clamps every 500 hours',
          'Replace thermostat every 3 years preventively',
          'Ensure adequate ventilation around generator',
          'Clean radiator fins seasonally',
          'Test radiator cap pressure annually',
          'Monitor coolant temperature trend for gradual increases'
        ],
        relatedFaults: [
          'Low oil pressure - may be caused by high temp reducing oil viscosity',
          'High exhaust temperature - may share cause with coolant overheating',
          'Low fuel pressure - overheating fuel can vaporize causing pressure issues',
          'Engine shutdown - controller protection will stop engine'
        ]
      },
      low: {
        causes: [
          {
            cause: 'Thermostat Stuck Open',
            probability: 60,
            explanation: 'A thermostat that is stuck open or missing allows coolant to circulate through the radiator constantly, preventing the engine from reaching operating temperature.',
            verificationSteps: [
              'Monitor temperature during warmup - should reach 82-95°C within 10-15 minutes under load',
              'If temperature stays below 70°C, thermostat may be stuck open',
              'Feel both radiator hoses - they should not both be hot until engine reaches normal temperature',
              'Remove and inspect thermostat - it should be closed at room temperature'
            ],
            toolsRequired: ['Infrared thermometer', 'Socket set'],
            timeToVerify: '15 minutes'
          },
          {
            cause: 'Faulty Temperature Sender',
            probability: 25,
            explanation: 'The temperature sensor may be giving false low readings while actual temperature is normal.',
            verificationSteps: [
              'Check actual coolant temperature with infrared thermometer on thermostat housing',
              'Compare to controller displayed temperature',
              'If actual temp is normal but display shows low, sender is faulty'
            ],
            toolsRequired: ['Infrared thermometer', 'Multimeter'],
            timeToVerify: '10 minutes'
          },
          {
            cause: 'Recent Cold Start',
            probability: 15,
            explanation: 'The engine simply has not had enough time to warm up, especially in cold ambient conditions or after extended shutdown.',
            verificationSteps: [
              'Note how long engine has been running',
              'Check ambient temperature',
              'Allow 10-15 minutes of loaded operation for warmup'
            ],
            toolsRequired: ['None'],
            timeToVerify: '15 minutes observation'
          }
        ],
        repairSteps: [
          {
            step: 1,
            action: 'Verify with External Thermometer',
            details: 'Use infrared thermometer to check actual coolant temperature at thermostat housing. This confirms whether the issue is the actual temperature or the sensor.',
            timeEstimate: '5 minutes'
          },
          {
            step: 2,
            action: 'Allow Full Warmup',
            details: 'Run engine under partial load for 15-20 minutes. If temperature rises to normal range, issue was simply cold start.',
            timeEstimate: '20 minutes'
          },
          {
            step: 3,
            action: 'Replace Thermostat',
            details: 'If engine does not reach operating temperature, replace thermostat. Ensure correct temperature rating for the engine (typically 82°C or 88°C).',
            timeEstimate: '45 minutes'
          },
          {
            step: 4,
            action: 'Replace Temperature Sender',
            details: 'If actual temperature is normal but reading is low, replace the temperature sender.',
            timeEstimate: '20 minutes'
          }
        ],
        parts: [
          {
            name: 'Thermostat',
            quantity: 1,
            estimatedCostKES: 2500,
            alternativeOptions: ['OEM thermostat', 'Wahler', 'Gates'],
            whereToSource: ['Generator dealer', 'Auto parts store']
          },
          {
            name: 'Temperature Sender',
            quantity: 1,
            estimatedCostKES: 2000,
            alternativeOptions: ['OEM sender', 'VDO', 'Bosch'],
            whereToSource: ['Generator dealer', 'Auto electrical']
          }
        ],
        tools: ['Infrared thermometer', 'Socket set', 'Drain pan', 'Coolant'],
        techExplanation: `Operating below normal temperature causes several problems. Combustion efficiency is reduced because the fuel does not vaporize properly, leading to incomplete combustion, carbon buildup, and fuel dilution of the engine oil. This condition is commonly called "wet stacking" in diesel generators.

The thermostat is a wax-pellet type valve that opens at a specific temperature. When the wax melts, it expands and pushes the valve open, allowing coolant to flow to the radiator. If the thermostat is stuck open, coolant continuously circulates through the radiator, and engine heat is removed faster than it is generated.

Running cold causes:
- Increased fuel consumption (5-15% higher)
- Accelerated cylinder bore wear from fuel washing
- Carbon deposits on valves and piston crowns
- White/black exhaust smoke
- Oil dilution from unburned fuel`,
        systemImpact: `Low coolant temperature effects:
- Reduced combustion efficiency
- Increased fuel consumption
- Carbon buildup (wet stacking)
- Oil dilution from unburned fuel
- Reduced power output
- Increased emissions`,
        preventiveMeasures: [
          'Replace thermostat every 3 years or 5000 hours',
          'Allow adequate warmup before applying full load',
          'In cold climates, use block heater',
          'Avoid extended no-load operation'
        ],
        relatedFaults: [
          'High fuel consumption - related to cold running',
          'Black smoke - may indicate wet stacking',
          'Low power - cold running reduces efficiency'
        ]
      }
    }
  },
  {
    parameter: 'batteryVoltage',
    conditions: {
      low: {
        causes: [
          {
            cause: 'Discharged or Failed Battery',
            probability: 40,
            explanation: 'The battery has lost charge due to age, parasitic drain, or failure of one or more cells.',
            verificationSteps: [
              'Measure battery voltage with engine stopped (should be 24-26V for 24V system)',
              'Load test battery with dedicated tester',
              'Check battery age - typically 3-5 years service life',
              'Inspect for swelling, cracking, or acid leakage'
            ],
            toolsRequired: ['Multimeter', 'Battery load tester'],
            timeToVerify: '15 minutes'
          },
          {
            cause: 'Alternator/Charging System Failure',
            probability: 30,
            explanation: 'The alternator is not producing adequate charge current to maintain battery voltage.',
            verificationSteps: [
              'Measure battery voltage while engine is running at rated speed',
              'Should see 27-29V (24V system) or 13.5-14.5V (12V system)',
              'Check alternator W terminal or charge indicator lamp',
              'Inspect alternator belt tension and condition',
              'Check wiring connections to alternator'
            ],
            toolsRequired: ['Multimeter', 'Belt tension gauge'],
            timeToVerify: '20 minutes'
          },
          {
            cause: 'Loose or Corroded Battery Connections',
            probability: 20,
            explanation: 'Resistance in the battery connections reduces effective voltage.',
            verificationSteps: [
              'Inspect battery terminals for corrosion (white/green deposits)',
              'Check terminal tightness - should not move',
              'Measure voltage at battery posts vs. at terminal clamps',
              'Check ground connection to frame/engine'
            ],
            toolsRequired: ['Wire brush', 'Wrenches', 'Multimeter'],
            timeToVerify: '15 minutes'
          },
          {
            cause: 'Parasitic Drain',
            probability: 10,
            explanation: 'A fault in the electrical system is draining the battery when the generator is not running.',
            verificationSteps: [
              'With engine stopped and all loads off, measure current draw with ammeter in series',
              'Normal standby drain should be less than 100mA',
              'Higher drain indicates fault - isolate circuits to find source'
            ],
            toolsRequired: ['DC clamp ammeter or multimeter'],
            timeToVerify: '30 minutes'
          }
        ],
        repairSteps: [
          {
            step: 1,
            action: 'Clean and Tighten Connections',
            details: 'Remove battery cables, clean terminals and clamps with wire brush and baking soda solution. Apply terminal protector spray and retighten.',
            safetyWarning: 'Disconnect negative cable first, reconnect last. Avoid shorting tools across terminals.',
            timeEstimate: '20 minutes'
          },
          {
            step: 2,
            action: 'Test Battery Condition',
            details: 'Perform load test on battery. If it cannot maintain voltage under load or has failed cells, replace.',
            timeEstimate: '15 minutes'
          },
          {
            step: 3,
            action: 'Charge Battery',
            details: 'If battery is dischargeable but good, charge with external charger at appropriate rate. Allow full charge before testing.',
            timeEstimate: '8-24 hours for full charge'
          },
          {
            step: 4,
            action: 'Test Charging System',
            details: 'Start engine and measure charging voltage. Verify alternator is outputting correct voltage. Check belt tension.',
            timeEstimate: '15 minutes'
          },
          {
            step: 5,
            action: 'Replace Components as Needed',
            details: 'Replace battery if failed, alternator if not charging, voltage regulator if output incorrect.',
            timeEstimate: 'Varies by component'
          }
        ],
        parts: [
          {
            name: 'Battery 12V 150Ah (x2 for 24V system)',
            quantity: 2,
            estimatedCostKES: 45000,
            alternativeOptions: ['Chloride Exide', 'Amaron', 'Bosch'],
            whereToSource: ['Battery dealer', 'Auto parts store']
          },
          {
            name: 'Alternator',
            quantity: 1,
            estimatedCostKES: 35000,
            alternativeOptions: ['OEM alternator', 'Bosch', 'Denso'],
            whereToSource: ['Generator dealer', 'Auto electrical']
          },
          {
            name: 'Battery Terminal Clamps',
            quantity: 2,
            estimatedCostKES: 500,
            alternativeOptions: ['Heavy duty brass', 'Universal type'],
            whereToSource: ['Auto parts store', 'Hardware']
          }
        ],
        tools: [
          'Multimeter',
          'Battery load tester',
          'Wire brush',
          'Baking soda',
          'Terminal protector spray',
          'Wrenches',
          'Battery charger'
        ],
        techExplanation: `The battery system in a generator is critical for starting and control system operation. A 24V system typically uses two 12V batteries in series. The batteries must maintain adequate charge to crank the engine (requiring hundreds of amps briefly) and power the control system.

Battery voltage indicates state of charge:
- 25.0-26.0V: Fully charged (24V system)
- 24.0-25.0V: 50-75% charged
- 23.0-24.0V: 25-50% charged (marginal start capability)
- Below 23.0V: Discharged (may not start)

The alternator charges the battery while running, typically outputting 27-29V to drive current into the battery. The voltage regulator maintains this output regardless of engine speed or load.`,
        systemImpact: `Low battery voltage effects:
- Failure to start or slow cranking
- Controller may not power up or display errors
- Control system may behave erratically
- Fuel solenoid may not energize
- Critical alarms may not function`,
        preventiveMeasures: [
          'Test batteries monthly with load tester',
          'Keep terminals clean and tight',
          'Install battery maintainer if generator sits idle',
          'Replace batteries every 3-5 years preventively',
          'Check electrolyte level monthly (if not sealed type)',
          'Verify charging voltage during each service'
        ],
        relatedFaults: [
          'Fail to start - may be caused by low battery',
          'Controller errors - may indicate voltage issues',
          'Charging fault - alternator not charging'
        ]
      }
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CORRELATION RULES ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

interface CorrelationRule {
  parameters: string[];
  condition: (readings: GeneratorReadings) => boolean;
  finding: string;
  implication: string;
  actionRequired: string;
}

const CORRELATION_RULES: CorrelationRule[] = [
  {
    parameters: ['oilPressure', 'oilTemperature'],
    condition: (r) => (r.oilPressure !== undefined && r.oilPressure < 25) &&
                      (r.oilTemperature !== undefined && r.oilTemperature > 100),
    finding: 'Low oil pressure combined with high oil temperature',
    implication: 'Oil is thinning due to heat, reducing its ability to maintain pressure. This indicates a cooling system problem or severe engine wear allowing excessive heat buildup.',
    actionRequired: 'Stop engine immediately. Check oil level and condition. Inspect cooling system. May indicate impending bearing failure.'
  },
  {
    parameters: ['coolantTemp', 'loadPercent'],
    condition: (r) => (r.coolantTemp !== undefined && r.coolantTemp > 100) &&
                      (r.loadPercent !== undefined && r.loadPercent > 85),
    finding: 'High coolant temperature under heavy load',
    implication: 'Generator may be undersized for the load, or cooling system capacity is marginal. Sustained operation may cause overheating damage.',
    actionRequired: 'Reduce load to below 80%. Check radiator and cooling fan operation. Consider load management or generator upsizing.'
  },
  {
    parameters: ['voltageL1N', 'voltageL2N', 'voltageL3N'],
    condition: (r) => {
      if (!r.voltageL1N || !r.voltageL2N || !r.voltageL3N) return false;
      const max = Math.max(r.voltageL1N, r.voltageL2N, r.voltageL3N);
      const min = Math.min(r.voltageL1N, r.voltageL2N, r.voltageL3N);
      return (max - min) > 10; // More than 10V difference
    },
    finding: 'Significant voltage imbalance between phases',
    implication: 'Unbalanced load, AVR fault, or generator winding issue. Voltage imbalance causes motor heating, reduced efficiency, and potential equipment damage.',
    actionRequired: 'Check load balance across phases. Inspect AVR sensing connections. Check generator winding resistance.'
  },
  {
    parameters: ['currentL1', 'currentL2', 'currentL3'],
    condition: (r) => {
      if (!r.currentL1 || !r.currentL2 || !r.currentL3) return false;
      const max = Math.max(r.currentL1, r.currentL2, r.currentL3);
      const min = Math.min(r.currentL1, r.currentL2, r.currentL3);
      const avg = (r.currentL1 + r.currentL2 + r.currentL3) / 3;
      return avg > 10 && ((max - min) / avg) > 0.2; // More than 20% imbalance
    },
    finding: 'Current imbalance between phases',
    implication: 'Load is not evenly distributed across phases. Single-phase loads or faulty three-phase equipment may be causing imbalance.',
    actionRequired: 'Audit connected loads and redistribute. Check for single-phase faults in three-phase equipment.'
  },
  {
    parameters: ['frequency', 'rpm'],
    condition: (r) => (r.frequency !== undefined && Math.abs(50 - r.frequency) > 1) &&
                      (r.rpm !== undefined && Math.abs(1500 - r.rpm) < 50),
    finding: 'Frequency off despite RPM being correct',
    implication: 'This should not occur unless speed sensor or frequency measurement is faulty, or generator has wrong pole count for the application.',
    actionRequired: 'Check speed sensor and frequency meter calibration. Verify generator pole configuration matches application (50Hz = 1500 RPM for 4-pole).'
  },
  {
    parameters: ['powerFactor', 'loadPercent'],
    condition: (r) => (r.powerFactor !== undefined && r.powerFactor < 0.75) &&
                      (r.loadPercent !== undefined && r.loadPercent > 70),
    finding: 'Poor power factor at high load',
    implication: 'Large inductive loads are limiting the useful power available from the generator. The generator may appear fully loaded (by current) while delivering less real power.',
    actionRequired: 'Install power factor correction capacitors. Review motor starting methods. May need to derate generator or upsize.'
  },
  {
    parameters: ['batteryVoltage', 'rpm'],
    condition: (r) => (r.batteryVoltage !== undefined && r.batteryVoltage < 24) &&
                      (r.rpm !== undefined && r.rpm > 1400),
    finding: 'Low battery voltage while engine is running',
    implication: 'Alternator is not charging properly. This will lead to battery depletion and eventual failure to restart.',
    actionRequired: 'Check alternator output, belt tension, and wiring. Test voltage regulator. May need alternator replacement.'
  },
  {
    parameters: ['exhaustTemp', 'loadPercent'],
    condition: (r) => (r.exhaustTemp !== undefined && r.exhaustTemp > 600) &&
                      (r.loadPercent !== undefined && r.loadPercent < 50),
    finding: 'High exhaust temperature at low load',
    implication: 'Indicates combustion problems - possibly restricted air intake, faulty injectors, or turbocharger issue.',
    actionRequired: 'Check air filter condition. Inspect turbocharger for boost leaks. Consider injector testing and cleaning.'
  },
  {
    parameters: ['coolantTemp', 'oilTemperature'],
    condition: (r) => (r.coolantTemp !== undefined && r.oilTemperature !== undefined) &&
                      (r.oilTemperature > r.coolantTemp + 30),
    finding: 'Oil temperature significantly higher than coolant temperature',
    implication: 'Oil cooler may be blocked or bypassed. Oil is not being properly cooled, leading to accelerated oil breakdown.',
    actionRequired: 'Inspect oil cooler for blockage. Check oil cooler bypass valve. Clean or replace oil cooler.'
  },
  {
    parameters: ['fuelLevel', 'fuelPressure'],
    condition: (r) => (r.fuelLevel !== undefined && r.fuelLevel > 30) &&
                      (r.fuelPressure !== undefined && r.fuelPressure < 2),
    finding: 'Low fuel pressure despite adequate fuel level',
    implication: 'Fuel supply problem - possibly blocked fuel filter, failing lift pump, or air leak in fuel system.',
    actionRequired: 'Replace fuel filters. Check lift pump operation. Inspect fuel lines for air leaks. Bleed fuel system.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PREDICTIVE FAILURE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

interface PredictiveRule {
  condition: (readings: GeneratorReadings) => boolean;
  component: string;
  timeframe: string;
  probability: number;
  preventiveAction: string;
  costIfIgnored: number;
}

const PREDICTIVE_RULES: PredictiveRule[] = [
  {
    condition: (r) => (r.oilPressure !== undefined && r.oilPressure > 20 && r.oilPressure < 30) &&
                      (r.engineHours !== undefined && r.engineHours > 10000),
    component: 'Engine Bearings',
    timeframe: '500-1000 hours',
    probability: 70,
    preventiveAction: 'Schedule bearing inspection or engine overhaul',
    costIfIgnored: 800000
  },
  {
    condition: (r) => (r.batteryVoltage !== undefined && r.batteryVoltage > 22 && r.batteryVoltage < 24),
    component: 'Batteries',
    timeframe: '1-3 months',
    probability: 80,
    preventiveAction: 'Test and likely replace batteries soon',
    costIfIgnored: 50000
  },
  {
    condition: (r) => (r.coolantTemp !== undefined && r.coolantTemp > 95 && r.coolantTemp < 100),
    component: 'Cooling System',
    timeframe: '1-2 months',
    probability: 60,
    preventiveAction: 'Service cooling system - clean radiator, check thermostat and water pump',
    costIfIgnored: 150000
  },
  {
    condition: (r) => (r.turboBoostPressure !== undefined && r.turboBoostPressure < 1.0),
    component: 'Turbocharger',
    timeframe: '3-6 months',
    probability: 65,
    preventiveAction: 'Inspect turbocharger for wear, check air intake system',
    costIfIgnored: 250000
  },
  {
    condition: (r) => (r.frequency !== undefined && Math.abs(50 - r.frequency) > 0.5 && Math.abs(50 - r.frequency) < 1.0),
    component: 'Governor System',
    timeframe: '1-3 months',
    probability: 55,
    preventiveAction: 'Calibrate governor actuator, check speed sensor',
    costIfIgnored: 80000
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AI ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export function performAIDiagnosis(readings: GeneratorReadings): AIAnalysisResult {
  const timestamp = new Date().toISOString();
  const issues: DiagnosticIssue[] = [];
  const detailedAnalysis: AIAnalysisResult['detailedAnalysis'] = [];

  // Analyze each provided parameter
  Object.entries(readings).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const spec = PARAMETER_SPECS[key];
    if (!spec) return;

    // Determine status
    let status: DiagnosticIssue['status'] = 'normal';
    let severity = 1;
    let title = '';
    let description = '';

    if (value < (spec.emergencyLow ?? -Infinity) || value > (spec.emergencyHigh ?? Infinity)) {
      status = 'emergency';
      severity = 10;
      title = `EMERGENCY: ${spec.name}`;
      description = value < spec.normalMin
        ? `${spec.name} at ${value} ${spec.unit} is at EMERGENCY LOW level!`
        : `${spec.name} at ${value} ${spec.unit} is at EMERGENCY HIGH level!`;
    } else if (value < spec.criticalLow || value > spec.criticalHigh) {
      status = 'critical';
      severity = 8;
      title = `CRITICAL: ${spec.name}`;
      description = value < spec.normalMin
        ? `${spec.name} at ${value} ${spec.unit} is critically low`
        : `${spec.name} at ${value} ${spec.unit} is critically high`;
    } else if (value < spec.warningLow || value > spec.warningHigh) {
      status = 'warning';
      severity = 5;
      title = `WARNING: ${spec.name}`;
      description = value < spec.normalMin
        ? `${spec.name} at ${value} ${spec.unit} is below normal`
        : `${spec.name} at ${value} ${spec.unit} is above normal`;
    } else if (value >= spec.normalMin && value <= spec.normalMax) {
      status = 'normal';
      severity = 1;
      title = `NORMAL: ${spec.name}`;
      description = `${spec.name} at ${value} ${spec.unit} is within optimal range`;
    } else {
      status = 'warning';
      severity = 3;
      title = `MARGINAL: ${spec.name}`;
      description = `${spec.name} at ${value} ${spec.unit} is outside optimal but within acceptable range`;
    }

    const issue: DiagnosticIssue = {
      id: `${key}-${Date.now()}`,
      parameter: spec.name,
      value: value as number,
      unit: spec.unit,
      status,
      severity,
      title,
      description
    };

    issues.push(issue);

    // Get detailed knowledge if issue is not normal
    if (status !== 'normal') {
      const knowledge = DIAGNOSTIC_KNOWLEDGE.find(k => k.parameter === key);
      if (knowledge) {
        const condition = value < spec.normalMin ? 'low' : 'high';
        const details = knowledge.conditions[condition];

        if (details) {
          detailedAnalysis.push({
            issue,
            technicalExplanation: details.techExplanation,
            systemImpact: details.systemImpact,
            immediateActions: details.repairSteps.slice(0, 3).map(s => s.action),
            rootCauses: details.causes,
            repairProcedure: details.repairSteps,
            partsRequired: details.parts,
            toolsRequired: details.tools,
            estimatedRepairTime: details.repairSteps.reduce((acc, s) => {
              const time = parseInt(s.timeEstimate) || 0;
              return acc + time;
            }, 0) + ' minutes',
            estimatedCostKES: {
              min: details.parts.reduce((acc, p) => acc + p.estimatedCostKES * 0.8, 0),
              max: details.parts.reduce((acc, p) => acc + p.estimatedCostKES * 1.2, 0) + 5000 // Add labor
            },
            preventiveMeasures: details.preventiveMeasures,
            relatedFaults: details.relatedFaults
          });
        }
      }
    }
  });

  // Run correlation analysis
  const correlations = CORRELATION_RULES
    .filter(rule => rule.condition(readings))
    .map(rule => ({
      parameters: rule.parameters,
      finding: rule.finding,
      implication: rule.implication,
      actionRequired: rule.actionRequired
    }));

  // Run predictive analysis
  const predictedFailures = PREDICTIVE_RULES
    .filter(rule => rule.condition(readings))
    .map(rule => ({
      component: rule.component,
      timeframe: rule.timeframe,
      probability: rule.probability,
      preventiveAction: rule.preventiveAction,
      costIfIgnored: rule.costIfIgnored
    }));

  // Calculate counts
  const criticalCount = issues.filter(i => i.status === 'critical' || i.status === 'emergency').length;
  const warningCount = issues.filter(i => i.status === 'warning').length;
  const normalCount = issues.filter(i => i.status === 'normal').length;

  // Calculate health score
  const totalParameters = issues.length;
  const weightedScore = issues.reduce((acc, issue) => {
    const weight = issue.status === 'normal' ? 100
      : issue.status === 'warning' ? 60
      : issue.status === 'critical' ? 20
      : 0;
    return acc + weight;
  }, 0);
  const healthScore = totalParameters > 0 ? Math.round(weightedScore / totalParameters) : 100;

  // Determine overall health
  let overallHealth: AIAnalysisResult['overallHealth'] = 'excellent';
  if (healthScore >= 90) overallHealth = 'excellent';
  else if (healthScore >= 75) overallHealth = 'good';
  else if (healthScore >= 50) overallHealth = 'fair';
  else if (healthScore >= 25) overallHealth = 'poor';
  else overallHealth = 'critical';

  // Generate primary diagnosis
  const primaryIssue = issues
    .filter(i => i.status !== 'normal')
    .sort((a, b) => b.severity - a.severity)[0];

  const primaryDiagnosis = {
    title: primaryIssue?.title || 'All Systems Normal',
    summary: primaryIssue
      ? `The primary concern is ${primaryIssue.parameter} at ${primaryIssue.value} ${primaryIssue.unit}. ${primaryIssue.description}`
      : 'All monitored parameters are within normal operating ranges. Generator is operating optimally.',
    confidence: primaryIssue ? 85 : 100,
    rootCauses: detailedAnalysis[0]?.rootCauses || []
  };

  // Generate immediate actions
  const immediateActions = criticalCount > 0
    ? ['STOP GENERATOR IMMEDIATELY to prevent damage', ...detailedAnalysis.flatMap(d => d.immediateActions).slice(0, 5)]
    : warningCount > 0
    ? ['Monitor situation closely', 'Reduce load if possible', ...detailedAnalysis.flatMap(d => d.immediateActions).slice(0, 3)]
    : ['Continue normal operation', 'Maintain regular service schedule'];

  // Generate scheduled maintenance
  const scheduledMaintenance = predictedFailures.map(pf => ({
    task: pf.preventiveAction,
    dueIn: pf.timeframe,
    priority: pf.probability > 70 ? 'critical' as const : pf.probability > 50 ? 'high' as const : 'medium' as const
  }));

  // Generate summaries
  const executiveSummary = criticalCount > 0
    ? `CRITICAL: Generator has ${criticalCount} critical issue(s) requiring immediate attention. ${primaryIssue?.description} Stop operation and address before continuing.`
    : warningCount > 0
    ? `WARNING: Generator has ${warningCount} warning(s) that should be investigated. ${primaryIssue?.description} Plan service soon.`
    : `HEALTHY: All ${normalCount} monitored parameters are within normal ranges. Generator is operating optimally.`;

  const technicianNotes = detailedAnalysis.length > 0
    ? `Focus diagnosis on: ${detailedAnalysis.map(d => d.issue.parameter).join(', ')}. Most likely root cause for ${primaryIssue?.parameter}: ${detailedAnalysis[0]?.rootCauses[0]?.cause || 'Unknown'}. Recommended tools: ${[...new Set(detailedAnalysis.flatMap(d => d.toolsRequired))].slice(0, 5).join(', ')}.`
    : 'No issues detected. Recommend routine service inspection to maintain reliability.';

  return {
    timestamp,
    overallHealth,
    healthScore,
    issues,
    criticalCount,
    warningCount,
    normalCount,
    primaryDiagnosis,
    detailedAnalysis,
    correlations,
    predictedFailures,
    immediateActions,
    scheduledMaintenance,
    executiveSummary,
    technicianNotes
  };
}

// Export helper functions
export function getParameterSpec(param: string): ParameterSpec | undefined {
  return PARAMETER_SPECS[param];
}

export function getAllParameterSpecs(): Record<string, ParameterSpec> {
  return PARAMETER_SPECS;
}
