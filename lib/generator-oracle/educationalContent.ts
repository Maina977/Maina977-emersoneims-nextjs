/**
 * Generator Oracle - Educational Content & Possible Causes Database
 *
 * This module provides educational troubleshooting content that:
 * 1. Helps technicians understand root causes
 * 2. Improves SEO for searches like "generator won't start Kenya"
 * 3. Turns the tool into a technical knowledge base
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PossibleCause {
  id: string;
  cause: string;
  likelihood: 'high' | 'medium' | 'low';
  explanation: string;
  checkProcedure: string[];
  requiredTools: string[];
  estimatedTime: string;
  skillLevel: 'basic' | 'intermediate' | 'advanced';
  partsNeeded?: string[];
  safetyWarnings?: string[];
  relatedFaultCodes?: string[];
}

export interface SymptomDiagnosis {
  symptom: string;
  keywords: string[]; // For SEO and search matching
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  possibleCauses: PossibleCause[];
  preventiveMeasures: string[];
  relatedFaultCodes: string[];
  videoTutorialUrl?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATIONAL DIAGNOSIS DATABASE
// Optimized for SEO: "generator won't start", "generator overheating", etc.
// ═══════════════════════════════════════════════════════════════════════════════

export const SYMPTOM_DIAGNOSES: SymptomDiagnosis[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR WON'T START - Most searched problem
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Won't Start",
    keywords: [
      "generator won't start", "generator not starting", "generator fails to start",
      "generator cranks but won't start", "generator no crank", "generator dead",
      "generator won't turn over", "generator starting problem Kenya"
    ],
    description: "The generator fails to start when the start command is given. This can manifest as no cranking, cranking but not firing, or immediate shutdown after starting.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'FLAT_BATTERY',
        cause: 'Flat or Weak Starting Battery',
        likelihood: 'high',
        explanation: 'The starting battery provides power to the starter motor and control system. A discharged or failing battery is the most common cause of starting failures, especially after extended standby periods.',
        checkProcedure: [
          'Measure battery voltage with multimeter - should be above 12.4V (24V systems: 24.8V)',
          'Check battery terminals for corrosion or loose connections',
          'Perform load test - voltage should not drop below 10.5V during cranking',
          'Check battery water level if applicable',
          'Verify battery charger is functioning (check charging current)'
        ],
        requiredTools: ['Digital multimeter', 'Battery load tester', 'Wire brush for terminals'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Replacement battery if failed', 'Terminal cleaner'],
        safetyWarnings: ['Disconnect negative terminal first', 'Avoid sparks near battery']
      },
      {
        id: 'AIR_IN_FUEL',
        cause: 'Air in Fuel System',
        likelihood: 'high',
        explanation: 'Air trapped in the fuel lines prevents proper fuel delivery to the injectors. This commonly occurs after fuel filter replacement, running out of fuel, or after extended storage.',
        checkProcedure: [
          'Check if fuel tank has adequate fuel level',
          'Inspect fuel lines for cracks, loose connections, or damage',
          'Locate fuel system bleed points (usually on fuel filter housing)',
          'Bleed fuel system by loosening bleed screw and operating manual priming pump',
          'Crank engine in short bursts while bleeding until solid fuel flows',
          'Tighten bleed screws and attempt start'
        ],
        requiredTools: ['Wrenches for bleed screws', 'Container for fuel spillage', 'Rags'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'intermediate',
        safetyWarnings: ['No smoking or open flames', 'Clean up spilled fuel immediately', 'Ensure good ventilation']
      },
      {
        id: 'STARTER_MOTOR_FAULT',
        cause: 'Starter Motor Failure',
        likelihood: 'medium',
        explanation: 'The starter motor or its solenoid may be faulty. Symptoms include clicking sounds, slow cranking, or complete silence when start command is given.',
        checkProcedure: [
          'Listen for clicking sound when start is pressed (indicates solenoid engaging)',
          'Check voltage at starter motor terminals during cranking attempt',
          'Verify starter motor ground connection',
          'Inspect starter motor pinion gear for damage',
          'Test solenoid independently if possible',
          'Check for loose starter mounting bolts'
        ],
        requiredTools: ['Digital multimeter', 'Socket set', 'Inspection light'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Starter motor or solenoid if faulty']
      },
      {
        id: 'CONTROL_PANEL_FAULT',
        cause: 'Control Panel Failure or Lockout',
        likelihood: 'medium',
        explanation: 'The generator controller may be in lockout mode due to a previous fault, or the control panel itself may have failed. Modern controllers have sophisticated protection that can prevent starting.',
        checkProcedure: [
          'Check controller display for fault codes or alarms',
          'Look for shutdown or lockout indicators',
          'Check emergency stop button is not engaged',
          'Verify all safety switches are in correct position',
          'Attempt fault reset if applicable',
          'Check controller power supply fuse'
        ],
        requiredTools: ['Controller manual for fault code reference', 'Multimeter'],
        estimatedTime: '15-45 minutes',
        skillLevel: 'intermediate',
        relatedFaultCodes: ['Emergency Stop Active', 'Controller Fault', 'Safety Circuit Open']
      },
      {
        id: 'FUEL_SOLENOID',
        cause: 'Fuel Shut-off Solenoid Failure',
        likelihood: 'medium',
        explanation: 'The fuel shut-off solenoid controls fuel flow to the injection pump. If it fails to open, no fuel reaches the engine. Often fails in the closed position.',
        checkProcedure: [
          'Locate fuel shut-off solenoid on injection pump',
          'Check for 12V/24V at solenoid when start command is active',
          'Listen for click when power is applied',
          'Manually test solenoid operation if accessible',
          'Check wiring and connections to solenoid'
        ],
        requiredTools: ['Multimeter', 'Wiring diagram'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Replacement solenoid if faulty']
      },
      {
        id: 'LOW_OIL_PRESSURE_SWITCH',
        cause: 'Oil Pressure Switch Preventing Start',
        likelihood: 'low',
        explanation: 'Some generators have a pre-lubrication system or oil pressure interlock that prevents starting if oil pressure cannot be established within a set time.',
        checkProcedure: [
          'Check engine oil level',
          'Verify oil pressure switch wiring',
          'Test oil pressure switch continuity',
          'Check if prelube pump is functioning',
          'Review controller settings for oil pressure start requirements'
        ],
        requiredTools: ['Multimeter', 'Oil pressure gauge'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Perform weekly test runs of at least 30 minutes under load',
      'Keep battery charger functioning and check battery monthly',
      'Change fuel filters at recommended intervals',
      'Keep fuel tank at least 50% full to prevent condensation',
      'Perform annual comprehensive service'
    ],
    relatedFaultCodes: ['Fail to Start', 'Overcrank', 'Low Battery Voltage', 'Fuel Pressure Low']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR OVERHEATING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Overheating",
    keywords: [
      "generator overheating", "generator high temperature", "generator running hot",
      "generator coolant temperature high", "generator thermal shutdown",
      "generator overheating problem Kenya", "generator cooling problem"
    ],
    description: "The generator engine temperature rises above normal operating range, potentially causing shutdown. Normal operating temperature is typically 80-95°C (176-203°F).",
    urgency: 'critical',
    possibleCauses: [
      {
        id: 'LOW_COOLANT',
        cause: 'Low Coolant Level',
        likelihood: 'high',
        explanation: 'Insufficient coolant reduces heat transfer capacity. May indicate a leak in the cooling system that needs to be addressed.',
        checkProcedure: [
          'Check coolant level in expansion tank (cold engine only)',
          'Inspect radiator core for visible coolant level',
          'Look for signs of coolant leaks under generator',
          'Check hoses for cracks, swelling, or soft spots',
          'Inspect water pump weep hole for leaks',
          'Pressure test cooling system if leak suspected'
        ],
        requiredTools: ['Coolant level gauge', 'Pressure tester', 'Inspection light'],
        estimatedTime: '15-45 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Correct coolant type for engine', 'Hoses if damaged'],
        safetyWarnings: ['Never open radiator cap on hot engine', 'Coolant is toxic - dispose properly']
      },
      {
        id: 'BLOCKED_RADIATOR',
        cause: 'Blocked or Dirty Radiator',
        likelihood: 'high',
        explanation: 'External debris (dust, leaves, insects) or internal scale buildup reduces radiator cooling efficiency. Common in dusty environments or after long service intervals.',
        checkProcedure: [
          'Visual inspection of radiator fins for debris blockage',
          'Check air intake screens for obstruction',
          'Verify cooling fan is spinning and pushing air correctly',
          'Check for internal blockage signs (hot inlet, cool outlet)',
          'Inspect radiator cap seal and pressure rating'
        ],
        requiredTools: ['Compressed air for cleaning', 'Soft brush', 'Water hose'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'basic',
        safetyWarnings: ['Ensure engine is off and cool before cleaning']
      },
      {
        id: 'THERMOSTAT_STUCK',
        cause: 'Thermostat Stuck Closed',
        likelihood: 'medium',
        explanation: 'A failed thermostat that remains closed prevents coolant flow to the radiator, causing rapid overheating. The engine may overheat quickly after starting.',
        checkProcedure: [
          'Check if upper radiator hose gets hot after engine reaches operating temp',
          'If lower hose remains cold while engine overheats, thermostat likely stuck',
          'Remove and test thermostat in hot water to verify opening',
          'Check thermostat housing for gasket leaks'
        ],
        requiredTools: ['Thermometer', 'Container for testing', 'Gasket scraper'],
        estimatedTime: '45-90 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['New thermostat', 'Housing gasket']
      },
      {
        id: 'WATER_PUMP_FAILURE',
        cause: 'Water Pump Failure',
        likelihood: 'medium',
        explanation: 'The water pump circulates coolant through the engine. Impeller damage, bearing failure, or seal leaks can reduce or stop circulation.',
        checkProcedure: [
          'Check for coolant leaks at water pump weep hole',
          'Listen for bearing noise from water pump',
          'Check pump drive belt tension and condition',
          'Verify pump shaft has no excessive play',
          'Remove upper hose and check for coolant flow when running'
        ],
        requiredTools: ['Mechanic stethoscope', 'Belt tension gauge'],
        estimatedTime: '30-60 minutes (diagnosis), 2-4 hours (replacement)',
        skillLevel: 'advanced',
        partsNeeded: ['Water pump', 'Gaskets', 'New coolant']
      },
      {
        id: 'FAN_BELT_BROKEN',
        cause: 'Fan Belt Broken or Slipping',
        likelihood: 'medium',
        explanation: 'The fan belt drives both the cooling fan and often the water pump. A broken or slipping belt eliminates cooling airflow and may stop coolant circulation.',
        checkProcedure: [
          'Visual inspection of belt for cracks, fraying, or glazing',
          'Check belt tension - should deflect 10-15mm with moderate pressure',
          'Look for belt debris around pulleys',
          'Check pulley alignment',
          'Listen for squealing (indicates slipping)'
        ],
        requiredTools: ['Belt tension gauge', 'Straight edge for alignment'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Replacement belt']
      },
      {
        id: 'OVERLOAD',
        cause: 'Generator Overloaded',
        likelihood: 'medium',
        explanation: 'Running the generator beyond its rated capacity causes excessive heat generation. Check if connected load exceeds generator rating.',
        checkProcedure: [
          'Check current draw on all phases using clamp meter',
          'Compare to generator rated output',
          'Check for unbalanced loads between phases',
          'Review power factor of connected loads',
          'Check ambient temperature - derate if above 40°C'
        ],
        requiredTools: ['Clamp meter', 'Power analyzer if available'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Check coolant level weekly',
      'Clean radiator fins monthly in dusty environments',
      'Replace coolant every 2 years or per manufacturer schedule',
      'Inspect belts and hoses during regular service',
      'Never exceed rated generator capacity',
      'Ensure adequate ventilation around generator'
    ],
    relatedFaultCodes: ['High Coolant Temp', 'Thermal Overload', 'Coolant Level Low', 'Fan Failure']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOW OIL PRESSURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Low Oil Pressure",
    keywords: [
      "generator low oil pressure", "oil pressure warning", "engine oil pressure low",
      "generator oil light on", "oil pressure drops", "generator lubrication problem"
    ],
    description: "The engine oil pressure falls below the safe operating threshold. This is a critical condition that can cause rapid engine damage if not addressed immediately.",
    urgency: 'critical',
    possibleCauses: [
      {
        id: 'LOW_OIL_LEVEL',
        cause: 'Low Engine Oil Level',
        likelihood: 'high',
        explanation: 'Insufficient oil in the sump cannot maintain proper pressure. May indicate oil consumption or leaks.',
        checkProcedure: [
          'Stop engine immediately',
          'Wait 5 minutes for oil to settle',
          'Check oil level on dipstick - should be between min and max marks',
          'Inspect under engine for oil leaks',
          'Check oil filler cap seal',
          'Look for blue exhaust smoke (indicates oil burning)'
        ],
        requiredTools: ['Clean rag for dipstick', 'Correct oil type'],
        estimatedTime: '10-15 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Engine oil to correct specification'],
        safetyWarnings: ['Hot oil can cause burns', 'Do not overfill']
      },
      {
        id: 'OIL_PRESSURE_SENSOR',
        cause: 'Faulty Oil Pressure Sensor/Switch',
        likelihood: 'medium',
        explanation: 'The sensor may be giving false readings. Verify actual oil pressure with mechanical gauge before assuming engine problem.',
        checkProcedure: [
          'Install mechanical oil pressure gauge at sensor port',
          'Compare mechanical gauge reading with sensor output',
          'Check sensor wiring for damage or corrosion',
          'Verify sensor ground connection',
          'Check for correct sensor type installed'
        ],
        requiredTools: ['Mechanical oil pressure gauge', 'Multimeter', 'Wrenches'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Replacement sensor if faulty']
      },
      {
        id: 'OIL_PUMP_WORN',
        cause: 'Worn Oil Pump',
        likelihood: 'low',
        explanation: 'The oil pump may be worn or damaged, reducing its ability to generate adequate pressure. More common in high-hour engines.',
        checkProcedure: [
          'Check engine hours - pump wear more likely after 10,000+ hours',
          'Verify correct oil viscosity is being used',
          'Check oil pressure at different RPMs',
          'Look for metallic particles in oil (indicates wear)',
          'Oil pump testing requires disassembly'
        ],
        requiredTools: ['Oil pressure gauge', 'Oil sample bottle'],
        estimatedTime: 'Diagnosis: 30 min, Repair: 4-8 hours',
        skillLevel: 'advanced',
        partsNeeded: ['Oil pump if faulty', 'Gaskets']
      },
      {
        id: 'WRONG_OIL_VISCOSITY',
        cause: 'Incorrect Oil Viscosity',
        likelihood: 'medium',
        explanation: 'Oil that is too thin (low viscosity) cannot maintain proper pressure. May occur after incorrect oil was added during service.',
        checkProcedure: [
          'Check oil specification on dipstick or filler cap',
          'Verify oil used matches manufacturer recommendation',
          'Consider ambient temperature - may need different viscosity',
          'Check for fuel dilution of oil (smells of diesel)',
          'If wrong oil used, drain and refill with correct grade'
        ],
        requiredTools: ['Oil specification chart', 'Drain pan'],
        estimatedTime: '30-60 minutes for oil change',
        skillLevel: 'basic',
        partsNeeded: ['Correct specification oil', 'Oil filter', 'Drain plug washer']
      }
    ],
    preventiveMeasures: [
      'Check oil level before each start',
      'Change oil at manufacturer-recommended intervals',
      'Always use correct oil specification',
      'Address oil leaks promptly',
      'Send oil samples for analysis on high-value engines'
    ],
    relatedFaultCodes: ['Low Oil Pressure', 'Oil Pressure Warning', 'Engine Protection Shutdown']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLTAGE/FREQUENCY UNSTABLE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Unstable Voltage or Frequency",
    keywords: [
      "generator voltage fluctuation", "generator frequency unstable",
      "generator power surging", "generator hunting", "generator voltage drops",
      "generator Hz fluctuating", "generator power quality problem"
    ],
    description: "The generator output voltage or frequency fluctuates outside acceptable limits. Normal should be within ±5% of rated voltage and ±0.5Hz of rated frequency.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'AVR_FAULT',
        cause: 'Automatic Voltage Regulator (AVR) Fault',
        likelihood: 'high',
        explanation: 'The AVR controls generator excitation to maintain stable voltage. A faulty AVR causes voltage swings or inability to build voltage.',
        checkProcedure: [
          'Check AVR indicator lights if present',
          'Measure AC voltage stability under varying load',
          'Check AVR input connections and sensing wires',
          'Verify excitation voltage from AVR to field',
          'Check AVR adjustment potentiometers',
          'Test with known good AVR if available'
        ],
        requiredTools: ['Multimeter', 'Oscilloscope (ideal)', 'AVR manual'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Replacement AVR if faulty']
      },
      {
        id: 'GOVERNOR_FAULT',
        cause: 'Governor System Malfunction',
        likelihood: 'high',
        explanation: 'The governor controls engine speed to maintain stable frequency. Electronic governors may have faulty sensors or actuators; mechanical governors may need adjustment.',
        checkProcedure: [
          'Check engine speed stability at no load',
          'Monitor speed response to load changes',
          'Inspect actuator linkage for binding or wear',
          'Check magnetic pickup gap (electronic governors)',
          'Verify governor gain settings',
          'Check for hunting or oscillation'
        ],
        requiredTools: ['Tachometer', 'Feeler gauges', 'Governor manual'],
        estimatedTime: '30-90 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'LOAD_IMBALANCE',
        cause: 'Unbalanced Load Between Phases',
        likelihood: 'medium',
        explanation: 'Significantly unequal loads on the three phases causes voltage imbalance and can affect frequency stability.',
        checkProcedure: [
          'Measure current on each phase',
          'Calculate phase imbalance percentage',
          'Redistribute loads if imbalance exceeds 10%',
          'Check for single-phase loads connected between phases',
          'Verify neutral conductor is properly connected'
        ],
        requiredTools: ['Clamp meter', 'Phase rotation meter'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'FUEL_SUPPLY_ISSUE',
        cause: 'Inconsistent Fuel Supply',
        likelihood: 'medium',
        explanation: 'Air in fuel system, restricted fuel filter, or failing fuel pump causes inconsistent fuel delivery, leading to speed/frequency fluctuation.',
        checkProcedure: [
          'Check fuel filters for restriction',
          'Inspect fuel supply lines for air leaks',
          'Verify fuel lift pump operation',
          'Check fuel tank vent for blockage',
          'Bleed fuel system if air is present'
        ],
        requiredTools: ['Transparent fuel line for inspection', 'Pressure gauge'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Balance loads across all phases',
      'Service fuel system regularly',
      'Check and adjust governor settings annually',
      'Test AVR function during routine maintenance',
      'Monitor power quality parameters'
    ],
    relatedFaultCodes: ['Voltage High', 'Voltage Low', 'Frequency High', 'Frequency Low', 'AVR Fault']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXCESSIVE SMOKE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Excessive Exhaust Smoke",
    keywords: [
      "generator black smoke", "generator white smoke", "generator blue smoke",
      "generator exhaust smoke", "generator smoking", "diesel generator smoke problem"
    ],
    description: "The generator produces abnormal exhaust smoke. Smoke color indicates different problems: Black = fuel issue, White = coolant/unburned fuel, Blue = oil burning.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'BLACK_SMOKE_OVERLOAD',
        cause: 'Black Smoke - Engine Overloaded',
        likelihood: 'high',
        explanation: 'Black smoke indicates incomplete combustion, often due to excessive fuel being injected. Most common cause is overloading the generator.',
        checkProcedure: [
          'Check load percentage - should not exceed 100% continuously',
          'Measure current on all phases',
          'Check air filter for restriction',
          'Verify turbocharger is functioning',
          'Check exhaust backpressure'
        ],
        requiredTools: ['Clamp meter', 'Vacuum gauge for air filter'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'BLACK_SMOKE_AIR_FILTER',
        cause: 'Black Smoke - Restricted Air Filter',
        likelihood: 'high',
        explanation: 'A blocked air filter reduces airflow to the engine, causing rich fuel mixture and black smoke.',
        checkProcedure: [
          'Remove and inspect air filter element',
          'Check air filter restriction indicator if fitted',
          'Inspect air intake ducting for blockages',
          'Clean or replace filter as needed'
        ],
        requiredTools: ['Compressed air for cleaning', 'Replacement filter'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Air filter element']
      },
      {
        id: 'WHITE_SMOKE_COOLANT',
        cause: 'White Smoke - Coolant Entering Combustion',
        likelihood: 'medium',
        explanation: 'Sweet-smelling white smoke that doesn\'t clear indicates coolant leaking into cylinders, usually from head gasket failure.',
        checkProcedure: [
          'Check coolant level - is it dropping?',
          'Look for milky residue in oil (coolant contamination)',
          'Check for bubbles in coolant expansion tank',
          'Perform cylinder leakage test',
          'Check exhaust for sweet smell'
        ],
        requiredTools: ['Coolant tester', 'Compression tester', 'Chemical test kit'],
        estimatedTime: '45-90 minutes diagnosis',
        skillLevel: 'advanced',
        partsNeeded: ['Head gasket if failed'],
        safetyWarnings: ['Engine may have serious internal damage']
      },
      {
        id: 'BLUE_SMOKE_OIL',
        cause: 'Blue Smoke - Oil Burning',
        likelihood: 'medium',
        explanation: 'Blue-tinted smoke indicates oil is entering the combustion chamber through worn rings, valve seals, or turbocharger seals.',
        checkProcedure: [
          'Check oil consumption rate',
          'Monitor crankcase pressure',
          'Check turbo for oil leaks (if equipped)',
          'Perform compression test',
          'Check valve stem seals'
        ],
        requiredTools: ['Oil consumption tracking', 'Manometer', 'Compression tester'],
        estimatedTime: '45-90 minutes diagnosis',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Never exceed rated generator capacity',
      'Replace air filters at recommended intervals',
      'Monitor coolant and oil consumption',
      'Address smoke issues promptly to prevent damage',
      'Perform regular compression tests on older engines'
    ],
    relatedFaultCodes: ['Engine Derate', 'High Exhaust Temp', 'Turbo Fault', 'Oil Consumption High']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Search symptoms by keyword for diagnostic tool
 */
export function searchSymptoms(query: string): SymptomDiagnosis[] {
  const lowerQuery = query.toLowerCase();
  return SYMPTOM_DIAGNOSES.filter(diagnosis =>
    diagnosis.keywords.some(kw => kw.toLowerCase().includes(lowerQuery)) ||
    diagnosis.symptom.toLowerCase().includes(lowerQuery) ||
    diagnosis.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get possible causes for a symptom
 */
export function getPossibleCauses(symptomId: string): PossibleCause[] {
  const diagnosis = SYMPTOM_DIAGNOSES.find(d =>
    d.symptom.toLowerCase().replace(/\s+/g, '_') === symptomId.toLowerCase()
  );
  return diagnosis?.possibleCauses || [];
}

/**
 * Get all symptoms for SEO content generation
 */
export function getAllSymptoms(): string[] {
  return SYMPTOM_DIAGNOSES.map(d => d.symptom);
}

/**
 * Get all keywords for search optimization
 */
export function getAllKeywords(): string[] {
  return SYMPTOM_DIAGNOSES.flatMap(d => d.keywords);
}

/**
 * Get diagnosis by urgency level
 */
export function getDiagnosesByUrgency(urgency: 'critical' | 'high' | 'medium' | 'low'): SymptomDiagnosis[] {
  return SYMPTOM_DIAGNOSES.filter(d => d.urgency === urgency);
}
