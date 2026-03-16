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
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR STOPS UNEXPECTEDLY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Stops Unexpectedly",
    keywords: [
      "generator shuts down", "generator stops running", "generator sudden shutdown",
      "generator cuts out", "generator stalls", "generator dies while running"
    ],
    description: "The generator unexpectedly shuts down during operation. This can be caused by protection systems, fuel issues, or mechanical failures.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'FUEL_STARVATION',
        cause: 'Fuel Starvation',
        likelihood: 'high',
        explanation: 'Empty tank, blocked fuel filter, or air in fuel system causing fuel supply interruption.',
        checkProcedure: [
          'Check fuel tank level',
          'Inspect fuel filters for blockage',
          'Check for air leaks in fuel supply lines',
          'Verify fuel lift pump operation',
          'Check fuel tank vent'
        ],
        requiredTools: ['Fuel pressure gauge', 'Clear fuel line'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'OVERHEAT_SHUTDOWN',
        cause: 'Overheat Protection Shutdown',
        likelihood: 'high',
        explanation: 'Engine temperature exceeded safe limits, triggering automatic shutdown.',
        checkProcedure: [
          'Check coolant level and condition',
          'Verify radiator fan operation',
          'Check for blocked radiator fins',
          'Test temperature sensor accuracy',
          'Check thermostat operation'
        ],
        requiredTools: ['Infrared thermometer', 'Coolant tester'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'LOW_OIL_SHUTDOWN',
        cause: 'Low Oil Pressure Shutdown',
        likelihood: 'medium',
        explanation: 'Oil pressure dropped below minimum threshold, triggering protective shutdown.',
        checkProcedure: [
          'Check oil level on dipstick',
          'Look for oil leaks under generator',
          'Verify oil pressure sensor operation',
          'Check oil grade and condition'
        ],
        requiredTools: ['Oil pressure gauge', 'Multimeter'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic'
      },
      {
        id: 'OVERLOAD_SHUTDOWN',
        cause: 'Overload Protection Activated',
        likelihood: 'medium',
        explanation: 'Generator exceeded its rated capacity, causing automatic shutdown.',
        checkProcedure: [
          'Check total load on generator',
          'Look for short circuits in connected loads',
          'Verify all breakers are properly sized',
          'Check for motor starting inrush'
        ],
        requiredTools: ['Clamp meter', 'Power analyzer'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Maintain adequate fuel reserve',
      'Clean radiator regularly in dusty conditions',
      'Monitor oil level weekly',
      'Avoid overloading the generator',
      'Check protection setpoints annually'
    ],
    relatedFaultCodes: ['High Temperature', 'Low Oil Pressure', 'Over Current', 'Fuel Low']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR MAKING UNUSUAL NOISE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Making Unusual Noise",
    keywords: [
      "generator noise", "generator knocking", "generator rattling", "generator grinding",
      "generator whining", "generator squealing", "generator loud noise"
    ],
    description: "The generator produces abnormal sounds during operation. Different noises indicate different problems requiring immediate attention.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'LOOSE_PARTS',
        cause: 'Loose Components or Guards',
        likelihood: 'high',
        explanation: 'Vibration causes bolts and guards to work loose over time, creating rattling noises.',
        checkProcedure: [
          'Inspect all access panels and guards',
          'Check engine mounting bolts',
          'Verify exhaust system connections',
          'Check alternator mounting',
          'Inspect belt guards and covers'
        ],
        requiredTools: ['Socket set', 'Torque wrench'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic'
      },
      {
        id: 'BELT_WEAR',
        cause: 'Worn or Misaligned Belt',
        likelihood: 'medium',
        explanation: 'A worn, glazed, or misaligned belt produces squealing or chirping sounds.',
        checkProcedure: [
          'Inspect belt for cracks, glazing, or wear',
          'Check belt tension',
          'Verify pulley alignment',
          'Look for pulley bearing wear',
          'Check for debris in pulley grooves'
        ],
        requiredTools: ['Belt tension gauge', 'Straight edge'],
        estimatedTime: '20-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Drive belt if worn']
      },
      {
        id: 'BEARING_FAILURE',
        cause: 'Bearing Failure - Engine or Alternator',
        likelihood: 'low',
        explanation: 'Grinding or rumbling noise may indicate failing bearings in engine or alternator.',
        checkProcedure: [
          'Use stethoscope to isolate noise source',
          'Check for play in alternator bearings',
          'Listen for engine main bearing noise',
          'Check idler pulley bearings'
        ],
        requiredTools: ['Mechanic stethoscope', 'Bearing clearance gauges'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        safetyWarnings: ['Stop immediately if grinding noise - bearing failure can cause catastrophic damage']
      },
      {
        id: 'INJECTOR_KNOCK',
        cause: 'Injector Knock or Diesel Knock',
        likelihood: 'medium',
        explanation: 'Sharp knocking sound from engine, often caused by incorrect injection timing or faulty injector.',
        checkProcedure: [
          'Isolate knocking cylinder by loosening injector lines',
          'Check injection timing',
          'Test injector spray pattern',
          'Check fuel quality'
        ],
        requiredTools: ['Injector tester', 'Timing tools'],
        estimatedTime: '60-120 minutes',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Tighten bolts during routine maintenance',
      'Replace belts before failure',
      'Listen for changes during routine checks',
      'Use quality fuel and oil',
      'Follow service intervals'
    ],
    relatedFaultCodes: ['Vibration High', 'Bearing Temp High', 'Alternator Fault']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR CRANKS BUT WON'T FIRE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Cranks But Won't Fire",
    keywords: [
      "generator cranks no start", "generator turns over but won't start",
      "generator cranking but not starting", "diesel cranks no fire"
    ],
    description: "The starter motor turns the engine over but it fails to fire and run. This indicates fuel, air, or combustion issues.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'NO_FUEL_DELIVERY',
        cause: 'No Fuel Reaching Injectors',
        likelihood: 'high',
        explanation: 'Fuel is not being delivered to the combustion chambers due to blockage or pump failure.',
        checkProcedure: [
          'Crack injector lines while cranking - check for fuel spray',
          'Check fuel shut-off solenoid operation',
          'Verify fuel pump is priming',
          'Check for blocked fuel filter',
          'Ensure fuel rack is moving'
        ],
        requiredTools: ['Wrenches for injector lines', 'Multimeter'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        safetyWarnings: ['Fire hazard - have extinguisher ready']
      },
      {
        id: 'GLOW_PLUG_FAILURE',
        cause: 'Glow Plug System Failure',
        likelihood: 'high',
        explanation: 'In cold conditions, failed glow plugs prevent cylinder pre-heating needed for combustion.',
        checkProcedure: [
          'Check glow plug relay/timer operation',
          'Measure glow plug resistance (0.5-2 ohms typical)',
          'Verify glow plug supply voltage',
          'Check wiring connections',
          'Test individual glow plugs'
        ],
        requiredTools: ['Multimeter', 'Glow plug tester'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Glow plugs if failed']
      },
      {
        id: 'LOW_COMPRESSION',
        cause: 'Low Compression',
        likelihood: 'low',
        explanation: 'Worn rings, damaged valves, or blown head gasket causing insufficient compression for ignition.',
        checkProcedure: [
          'Perform compression test on all cylinders',
          'Compare readings - should be within 10% across cylinders',
          'Do wet test if compression is low',
          'Check valve clearances'
        ],
        requiredTools: ['Compression tester', 'Feeler gauges'],
        estimatedTime: '60-90 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'FUEL_SOLENOID_STUCK',
        cause: 'Fuel Shut-off Solenoid Not Opening',
        likelihood: 'medium',
        explanation: 'The electric solenoid that allows fuel flow is stuck closed or not receiving power.',
        checkProcedure: [
          'Listen/feel for solenoid click when key turns on',
          'Check voltage at solenoid connector',
          'Manually operate solenoid if possible',
          'Check wiring and fuses'
        ],
        requiredTools: ['Multimeter', 'Test light'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Test glow plugs before cold season',
      'Keep fuel system maintained',
      'Replace fuel filters regularly',
      'Monitor compression during major services',
      'Exercise generator monthly'
    ],
    relatedFaultCodes: ['Fail to Start', 'Glow Plug Fault', 'Fuel System Fault', 'Low Compression']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NO OUTPUT VOLTAGE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "No Output Voltage",
    keywords: [
      "generator no voltage", "generator no power output", "generator producing no electricity",
      "alternator not producing voltage", "generator running but no power"
    ],
    description: "The engine runs but the alternator produces zero or very low voltage output.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'AVR_FAILURE',
        cause: 'AVR (Automatic Voltage Regulator) Failure',
        likelihood: 'high',
        explanation: 'The AVR controls excitation to the alternator field. If it fails, no voltage is produced.',
        checkProcedure: [
          'Check AVR indicator LEDs if present',
          'Measure sensing voltage to AVR',
          'Test AVR output to field',
          'Try substitute AVR if available',
          'Check for burnt components'
        ],
        requiredTools: ['Multimeter', 'Spare AVR for testing'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['AVR if failed']
      },
      {
        id: 'LOSS_OF_RESIDUAL',
        cause: 'Loss of Residual Magnetism',
        likelihood: 'medium',
        explanation: 'After long storage, the rotor loses residual magnetism needed to start the excitation process.',
        checkProcedure: [
          'Apply 12V DC briefly to field winding to re-flash',
          'Connect correct polarity to field terminals',
          'Start generator immediately after flashing',
          'Verify voltage builds up normally'
        ],
        requiredTools: ['12V battery', 'Jumper wires'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'intermediate',
        safetyWarnings: ['Use correct polarity', 'Brief application only']
      },
      {
        id: 'DIODE_FAILURE',
        cause: 'Rotating Rectifier Diode Failure',
        likelihood: 'medium',
        explanation: 'The diodes that convert exciter AC to DC for the main field may be open or shorted.',
        checkProcedure: [
          'Access rotating rectifier assembly',
          'Test each diode with multimeter in diode mode',
          'Check for open circuit (infinite both ways) or short (low both ways)',
          'Replace failed diodes or entire assembly'
        ],
        requiredTools: ['Multimeter', 'Insulated tools'],
        estimatedTime: '60-120 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Diode set or rectifier assembly']
      },
      {
        id: 'BRUSH_WORN',
        cause: 'Worn Carbon Brushes',
        likelihood: 'medium',
        explanation: 'Brushes that transfer current to slip rings may be worn past minimum length.',
        checkProcedure: [
          'Remove brush holder assembly',
          'Measure brush length against minimum specification',
          'Check brush spring pressure',
          'Inspect slip ring surface condition'
        ],
        requiredTools: ['Calipers', 'Spring gauge'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Carbon brush set']
      }
    ],
    preventiveMeasures: [
      'Run generator monthly even in standby',
      'Check AVR connections during service',
      'Replace brushes at recommended intervals',
      'Monitor voltage output trends',
      'Keep excitation system clean and dry'
    ],
    relatedFaultCodes: ['Under Voltage', 'Excitation Fault', 'AVR Fail', 'No Volt Sensing']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLANT LEAKING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Coolant Leaking",
    keywords: [
      "generator coolant leak", "generator antifreeze leak", "generator water leak",
      "radiator leaking", "generator losing coolant"
    ],
    description: "Coolant is escaping from the cooling system. Must be addressed to prevent overheating.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'HOSE_LEAK',
        cause: 'Damaged or Loose Hose',
        likelihood: 'high',
        explanation: 'Rubber hoses deteriorate over time, developing cracks or loosening at clamp connections.',
        checkProcedure: [
          'Visually inspect all coolant hoses',
          'Feel hoses for soft spots or cracks',
          'Check all hose clamps are tight',
          'Pressure test system to reveal hidden leaks',
          'Check heater hoses if equipped'
        ],
        requiredTools: ['Cooling system pressure tester', 'Screwdriver'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Replacement hoses', 'Clamps']
      },
      {
        id: 'RADIATOR_LEAK',
        cause: 'Radiator Damage or Corrosion',
        likelihood: 'medium',
        explanation: 'Radiator core tubes can corrode or be damaged by debris, causing leaks.',
        checkProcedure: [
          'Pressure test radiator',
          'Inspect for visible wet areas or deposits',
          'Check tank-to-core seams',
          'Look for damage from debris'
        ],
        requiredTools: ['Pressure tester', 'Flashlight'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Radiator if damaged']
      },
      {
        id: 'WATER_PUMP_SEAL',
        cause: 'Water Pump Seal Failure',
        likelihood: 'medium',
        explanation: 'The water pump shaft seal wears over time, allowing coolant to leak past the bearing.',
        checkProcedure: [
          'Look for coolant at water pump weep hole',
          'Check for coolant residue on pump body',
          'Inspect pump pulley for wobble (bearing wear)',
          'Check for noise from pump bearing'
        ],
        requiredTools: ['Flashlight', 'Inspection mirror'],
        estimatedTime: '20-30 minutes diagnosis',
        skillLevel: 'intermediate',
        partsNeeded: ['Water pump if failed']
      },
      {
        id: 'HEAD_GASKET_EXTERNAL',
        cause: 'External Head Gasket Leak',
        likelihood: 'low',
        explanation: 'Head gasket failure can cause external coolant leak at head-to-block joint.',
        checkProcedure: [
          'Clean area and look for fresh coolant at head joint',
          'Check for overheating history',
          'Look for coolant in oil or oil in coolant',
          'Perform combustion leak test'
        ],
        requiredTools: ['Combustion leak tester', 'Pressure tester'],
        estimatedTime: '45-90 minutes diagnosis',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Replace coolant hoses every 5 years',
      'Use correct coolant type and mixture',
      'Pressure test annually',
      'Check coolant level weekly',
      'Address small leaks immediately'
    ],
    relatedFaultCodes: ['Low Coolant', 'High Temperature', 'Coolant Level Low']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUEL CONSUMPTION HIGH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "High Fuel Consumption",
    keywords: [
      "generator using too much fuel", "generator high fuel consumption",
      "generator burning more diesel", "generator fuel economy poor"
    ],
    description: "The generator consumes more fuel than expected for the load being served.",
    urgency: 'low',
    possibleCauses: [
      {
        id: 'OVERLOADING',
        cause: 'Generator Overloaded',
        likelihood: 'high',
        explanation: 'Running above rated capacity causes inefficient operation and excess fuel consumption.',
        checkProcedure: [
          'Measure actual load vs rated capacity',
          'Check load profile throughout operation',
          'Look for high inrush from motor loads',
          'Calculate fuel consumption per kWh'
        ],
        requiredTools: ['Power analyzer', 'Clamp meter'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'INJECTOR_PROBLEMS',
        cause: 'Worn or Dirty Injectors',
        likelihood: 'medium',
        explanation: 'Worn injectors produce poor spray pattern causing incomplete combustion and waste fuel.',
        checkProcedure: [
          'Check for black smoke (rich running)',
          'Measure exhaust gas temperature by cylinder',
          'Remove and test injector spray pattern',
          'Check injection pressure'
        ],
        requiredTools: ['Injector tester', 'Pyrometer'],
        estimatedTime: '60-120 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Injector nozzles if worn']
      },
      {
        id: 'AIR_RESTRICTION',
        cause: 'Restricted Air Intake',
        likelihood: 'medium',
        explanation: 'Blocked air filter reduces oxygen causing rich fuel mixture and wasted fuel.',
        checkProcedure: [
          'Check air filter restriction indicator',
          'Inspect air filter element',
          'Check intake ducting for blockages',
          'Verify turbo inlet is clear'
        ],
        requiredTools: ['Manometer for restriction measurement'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Air filter if dirty']
      },
      {
        id: 'TIMING_WRONG',
        cause: 'Incorrect Injection Timing',
        likelihood: 'low',
        explanation: 'Retarded injection timing causes late combustion, reducing efficiency.',
        checkProcedure: [
          'Check injection timing with timing light/indicator',
          'Compare to factory specification',
          'Look for timing adjustment marks',
          'Check timing belt/chain condition'
        ],
        requiredTools: ['Injection timing tools', 'Dial indicator'],
        estimatedTime: '60-90 minutes',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Size generator correctly for load',
      'Replace air and fuel filters regularly',
      'Service injectors at recommended intervals',
      'Monitor fuel consumption trends',
      'Keep engine properly tuned'
    ],
    relatedFaultCodes: ['High Exhaust Temp', 'Air Filter Restricted', 'Engine Derate']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTROLLER NOT RESPONDING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Controller Not Responding",
    keywords: [
      "generator controller blank", "generator display not working",
      "generator control panel dead", "generator no display", "DSE not working"
    ],
    description: "The controller/control panel shows no display or is unresponsive to inputs.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'NO_POWER_TO_CONTROLLER',
        cause: 'No DC Power Supply',
        likelihood: 'high',
        explanation: 'Controller requires DC power from battery. No power means no operation.',
        checkProcedure: [
          'Check battery voltage at controller terminals',
          'Verify main DC fuses are intact',
          'Check battery isolator switch position',
          'Test wiring continuity to controller',
          'Check for corroded connections'
        ],
        requiredTools: ['Multimeter', 'Test light'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic'
      },
      {
        id: 'FUSE_BLOWN',
        cause: 'Blown Control Fuse',
        likelihood: 'high',
        explanation: 'A blown fuse in the control circuit removes power to the controller.',
        checkProcedure: [
          'Locate control circuit fuses',
          'Test each fuse with multimeter',
          'Check for fuse holder corrosion',
          'Identify cause before replacing fuse'
        ],
        requiredTools: ['Multimeter'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Replacement fuses']
      },
      {
        id: 'CONTROLLER_FAILURE',
        cause: 'Controller Internal Failure',
        likelihood: 'low',
        explanation: 'Internal electronics have failed due to voltage spike, age, or component failure.',
        checkProcedure: [
          'Verify power supply is within specification',
          'Check for signs of burning or damage',
          'Try controller reset if available',
          'Check for firmware corruption',
          'Contact manufacturer for diagnosis'
        ],
        requiredTools: ['Multimeter', 'Manufacturer software'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Replacement controller if failed']
      },
      {
        id: 'DISPLAY_FAILURE',
        cause: 'Display Module Failure',
        likelihood: 'medium',
        explanation: 'Display/LCD may have failed while controller electronics still work.',
        checkProcedure: [
          'Check if LEDs on controller light up',
          'Try remote monitoring if available',
          'Check display ribbon cable connection',
          'Verify backlight function'
        ],
        requiredTools: ['Visual inspection'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Protect from voltage surges',
      'Keep connections clean and tight',
      'Check battery regularly',
      'Install surge protection',
      'Keep firmware updated'
    ],
    relatedFaultCodes: ['Controller Fault', 'Low Battery', 'Communication Error']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR VIBRATING EXCESSIVELY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Excessive Vibration",
    keywords: [
      "generator vibrating", "generator shaking", "generator vibration problem",
      "generator rough running", "generator unbalanced"
    ],
    description: "The generator exhibits abnormal vibration during operation, which can indicate mechanical issues.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'MOUNT_FAILURE',
        cause: 'Worn Anti-Vibration Mounts',
        likelihood: 'high',
        explanation: 'Rubber isolation mounts deteriorate over time, allowing vibration to transmit.',
        checkProcedure: [
          'Visually inspect anti-vibration mounts',
          'Look for cracked or collapsed rubber',
          'Check mount bolt tightness',
          'Compare vibration at engine vs frame'
        ],
        requiredTools: ['Flashlight', 'Socket set'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Anti-vibration mounts']
      },
      {
        id: 'ENGINE_MISFIRE',
        cause: 'Engine Misfiring',
        likelihood: 'medium',
        explanation: 'One or more cylinders not firing properly causes uneven running and vibration.',
        checkProcedure: [
          'Check exhaust gas temperature per cylinder',
          'Listen for irregular engine sound',
          'Check injector operation',
          'Perform compression test'
        ],
        requiredTools: ['Pyrometer', 'Mechanic stethoscope'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'COUPLING_DAMAGE',
        cause: 'Damaged Engine-Alternator Coupling',
        likelihood: 'medium',
        explanation: 'The flexible coupling between engine and alternator may be worn or damaged.',
        checkProcedure: [
          'Inspect coupling rubber elements',
          'Check for coupling misalignment',
          'Look for wear on coupling faces',
          'Check coupling bolt tightness'
        ],
        requiredTools: ['Alignment tools', 'Dial indicator'],
        estimatedTime: '45-90 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Coupling elements if worn']
      },
      {
        id: 'ALTERNATOR_BEARING',
        cause: 'Alternator Bearing Wear',
        likelihood: 'low',
        explanation: 'Worn alternator bearings cause vibration that increases with speed.',
        checkProcedure: [
          'Check for play at alternator shaft',
          'Listen for bearing noise',
          'Feel for localized vibration at alternator',
          'Check bearing temperature'
        ],
        requiredTools: ['Dial indicator', 'Vibration meter'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Replace anti-vibration mounts every 5-7 years',
      'Check coupling alignment annually',
      'Monitor vibration levels regularly',
      'Address misfires immediately',
      'Keep mounting bolts tight'
    ],
    relatedFaultCodes: ['Vibration High', 'Bearing Temp High', 'Engine Rough Running']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OIL LEAKING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Oil Leaking",
    keywords: [
      "generator oil leak", "generator leaking oil", "engine oil leak",
      "generator oil puddle", "oil dripping from generator"
    ],
    description: "Engine oil is leaking from the generator. Identify and fix before oil level drops critically.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'VALVE_COVER_GASKET',
        cause: 'Valve Cover Gasket Leak',
        likelihood: 'high',
        explanation: 'The gasket between valve cover and cylinder head deteriorates, causing oil seepage.',
        checkProcedure: [
          'Clean engine top and observe for fresh oil',
          'Check valve cover bolt tightness',
          'Look for oil at gasket edges',
          'Check PCV system function'
        ],
        requiredTools: ['Cleaning solvent', 'Torque wrench'],
        estimatedTime: '20-45 minutes diagnosis',
        skillLevel: 'basic',
        partsNeeded: ['Valve cover gasket']
      },
      {
        id: 'SUMP_GASKET',
        cause: 'Oil Sump/Pan Gasket Leak',
        likelihood: 'medium',
        explanation: 'Gasket between sump and block fails, allowing oil to leak at the bottom of engine.',
        checkProcedure: [
          'Look for oil at sump flange',
          'Check sump bolt tightness',
          'Clean and observe over time',
          'Check for impact damage to sump'
        ],
        requiredTools: ['Flashlight', 'Inspection mirror'],
        estimatedTime: '20-40 minutes diagnosis',
        skillLevel: 'intermediate',
        partsNeeded: ['Sump gasket']
      },
      {
        id: 'CRANKSHAFT_SEAL',
        cause: 'Crankshaft Seal Leak',
        likelihood: 'medium',
        explanation: 'Front or rear crankshaft oil seal has worn, causing leak at the seal location.',
        checkProcedure: [
          'Check for oil behind crankshaft pulley (front seal)',
          'Look for oil at flywheel housing (rear seal)',
          'Clean area and run to confirm source',
          'Check crankcase pressure'
        ],
        requiredTools: ['Flashlight', 'Inspection mirror'],
        estimatedTime: '30-60 minutes diagnosis',
        skillLevel: 'advanced',
        partsNeeded: ['Crankshaft seal']
      },
      {
        id: 'OIL_FILTER_GASKET',
        cause: 'Oil Filter Gasket Leak',
        likelihood: 'high',
        explanation: 'Oil filter not sealing properly, or old gasket stuck causing double gasket.',
        checkProcedure: [
          'Check oil filter is tight',
          'Look for old gasket stuck to housing',
          'Verify correct filter installed',
          'Check for housing damage'
        ],
        requiredTools: ['Filter wrench'],
        estimatedTime: '10-20 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Oil filter if needed']
      }
    ],
    preventiveMeasures: [
      'Torque oil filter correctly',
      'Always remove old filter gasket',
      'Replace gaskets during major service',
      'Check crankcase ventilation',
      'Monitor oil level weekly'
    ],
    relatedFaultCodes: ['Low Oil Level', 'Low Oil Pressure']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BATTERY NOT CHARGING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Battery Not Charging",
    keywords: [
      "generator battery not charging", "battery charger not working",
      "generator low battery", "battery going flat", "charger fault"
    ],
    description: "The generator's battery charging system is not maintaining the starting battery.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'CHARGER_FAILURE',
        cause: 'Battery Charger Module Failure',
        likelihood: 'high',
        explanation: 'The automatic battery charger has failed internally.',
        checkProcedure: [
          'Check AC input to charger',
          'Measure DC output voltage (should be ~13.8V for 12V system)',
          'Check charger indicator lights',
          'Test with known good charger if available'
        ],
        requiredTools: ['Multimeter'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Battery charger if failed']
      },
      {
        id: 'CHARGER_FUSE',
        cause: 'Charger Fuse or Breaker Tripped',
        likelihood: 'high',
        explanation: 'Supply fuse or internal fuse has blown, cutting power to charger.',
        checkProcedure: [
          'Check supply fuses to charger',
          'Check internal charger fuses',
          'Reset breaker if applicable',
          'Verify AC supply present'
        ],
        requiredTools: ['Multimeter'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Fuses']
      },
      {
        id: 'BATTERY_FAILED',
        cause: 'Battery Unable to Accept Charge',
        likelihood: 'medium',
        explanation: 'The battery is sulfated or damaged and cannot hold a charge.',
        checkProcedure: [
          'Test battery with load tester',
          'Check electrolyte level and condition',
          'Measure battery voltage during charge',
          'Check for swelling or damage'
        ],
        requiredTools: ['Battery load tester', 'Hydrometer'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Battery if failed']
      },
      {
        id: 'WIRING_FAULT',
        cause: 'Charging Wiring Fault',
        likelihood: 'medium',
        explanation: 'Broken or corroded wiring preventing charge current from reaching battery.',
        checkProcedure: [
          'Inspect charging cables for damage',
          'Check battery terminal connections',
          'Measure voltage drop in charging circuit',
          'Check for corrosion at connections'
        ],
        requiredTools: ['Multimeter', 'Wire brush'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Check charger function monthly',
      'Keep battery terminals clean',
      'Test battery annually',
      'Verify charger float voltage setting',
      'Replace battery every 3-5 years'
    ],
    relatedFaultCodes: ['Low Battery', 'Battery Charger Fail', 'Battery Low']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR WON'T STOP
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Generator Won't Stop",
    keywords: [
      "generator won't shut off", "generator keeps running",
      "generator can't stop", "emergency stop not working", "fuel solenoid stuck"
    ],
    description: "The generator continues running when stop command is given. Safety concern.",
    urgency: 'critical',
    possibleCauses: [
      {
        id: 'SOLENOID_STUCK_OPEN',
        cause: 'Fuel Solenoid Stuck Open',
        likelihood: 'high',
        explanation: 'The fuel shut-off solenoid is mechanically stuck in the open position.',
        checkProcedure: [
          'Check solenoid movement when stop pressed',
          'Manually close fuel supply to stop engine',
          'Test solenoid with direct power',
          'Check for debris preventing closure'
        ],
        requiredTools: ['Multimeter', 'Manual fuel valve'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Fuel solenoid if failed'],
        safetyWarnings: ['Know location of manual fuel shutoff']
      },
      {
        id: 'STOP_CIRCUIT_FAULT',
        cause: 'Stop Circuit Wiring Fault',
        likelihood: 'medium',
        explanation: 'Broken wire or connection preventing stop signal reaching solenoid.',
        checkProcedure: [
          'Check stop button operation',
          'Trace wiring from controller to solenoid',
          'Check for voltage at solenoid when stop pressed',
          'Verify controller output'
        ],
        requiredTools: ['Multimeter', 'Wiring diagram'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'CONTROLLER_STOP_FAULT',
        cause: 'Controller Stop Output Failure',
        likelihood: 'low',
        explanation: 'Controller is not sending stop signal due to internal fault.',
        checkProcedure: [
          'Check controller stop output with meter',
          'Try manual stop on controller',
          'Reset controller',
          'Check for error codes'
        ],
        requiredTools: ['Multimeter'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'RACK_STUCK',
        cause: 'Fuel Rack Stuck',
        likelihood: 'low',
        explanation: 'Mechanical fuel rack in injection pump is stuck in fuel delivery position.',
        checkProcedure: [
          'Check governor linkage movement',
          'Verify fuel rack moves freely',
          'Check for seized injection pump',
          'Inspect linkage for damage'
        ],
        requiredTools: ['Visual inspection'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        safetyWarnings: ['May require manual fuel cutoff']
      }
    ],
    preventiveMeasures: [
      'Test stop function regularly',
      'Know manual fuel cutoff location',
      'Service fuel solenoid annually',
      'Keep linkages lubricated',
      'Install secondary emergency stop'
    ],
    relatedFaultCodes: ['Stop Fail', 'Fuel Solenoid Fault', 'Emergency Stop Active']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNSTABLE RPM / HUNTING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Unstable RPM / Hunting",
    keywords: [
      "generator surging", "generator hunting", "generator rpm fluctuating",
      "generator speed unstable", "governor hunting"
    ],
    description: "Engine speed fluctuates continuously, causing frequency and voltage variations.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'AIR_IN_FUEL_SYSTEM',
        cause: 'Air in Fuel System',
        likelihood: 'high',
        explanation: 'Air entering fuel system causes intermittent fuel starvation and speed fluctuation.',
        checkProcedure: [
          'Check for loose fuel connections',
          'Inspect fuel lines for cracks',
          'Check fuel filter bowl for air bubbles',
          'Bleed fuel system completely'
        ],
        requiredTools: ['Clear fuel line', 'Wrenches'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'GOVERNOR_MALFUNCTION',
        cause: 'Governor/Actuator Problem',
        likelihood: 'medium',
        explanation: 'Electronic governor or mechanical governor not responding correctly to load changes.',
        checkProcedure: [
          'Check governor gain settings',
          'Verify actuator responds to commands',
          'Check MPU signal quality',
          'Adjust stability settings'
        ],
        requiredTools: ['Governor configuration tool', 'Oscilloscope'],
        estimatedTime: '45-90 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'DIRTY_FUEL',
        cause: 'Contaminated Fuel',
        likelihood: 'medium',
        explanation: 'Water or particles in fuel cause inconsistent combustion and speed variation.',
        checkProcedure: [
          'Drain and inspect fuel filter bowl',
          'Check fuel tank for water/sediment',
          'Test fuel quality',
          'Replace fuel filters'
        ],
        requiredTools: ['Sample container', 'Fuel test kit'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Fuel filters']
      },
      {
        id: 'LOW_LOAD_HUNTING',
        cause: 'Low Load Operation',
        likelihood: 'medium',
        explanation: 'Some generators hunt at very low loads - this is normal for certain governor types.',
        checkProcedure: [
          'Check if hunting occurs only at low load',
          'Add dummy load to test',
          'Review governor specifications',
          'Adjust low load stability if adjustable'
        ],
        requiredTools: ['Load bank', 'Governor manual'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Keep fuel system air-tight',
      'Use clean, quality fuel',
      'Service fuel filters regularly',
      'Maintain proper load levels',
      'Check governor settings annually'
    ],
    relatedFaultCodes: ['Frequency High', 'Frequency Low', 'Governor Fault', 'Speed Deviation']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BREAKER TRIPPING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Output Breaker Tripping",
    keywords: [
      "generator breaker tripping", "generator mcb tripping",
      "generator overload tripping", "output breaker opening"
    ],
    description: "The output circuit breaker repeatedly trips, disconnecting loads.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'ACTUAL_OVERLOAD',
        cause: 'Genuine Overload Condition',
        likelihood: 'high',
        explanation: 'Total connected load exceeds breaker and generator rating.',
        checkProcedure: [
          'Measure total load current',
          'Check breaker rating vs generator capacity',
          'Identify high current loads',
          'Check for motor starting inrush'
        ],
        requiredTools: ['Clamp meter', 'Power analyzer'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'SHORT_CIRCUIT',
        cause: 'Short Circuit in Load Circuit',
        likelihood: 'medium',
        explanation: 'A fault in connected equipment or wiring causing high current.',
        checkProcedure: [
          'Disconnect loads and close breaker',
          'Reconnect loads one at a time',
          'Check wiring for damage',
          'Use insulation tester on circuits'
        ],
        requiredTools: ['Insulation tester', 'Multimeter'],
        estimatedTime: '30-90 minutes',
        skillLevel: 'intermediate',
        safetyWarnings: ['Isolate before testing', 'Short circuits can cause fires']
      },
      {
        id: 'BREAKER_FAULTY',
        cause: 'Faulty or Weak Breaker',
        likelihood: 'medium',
        explanation: 'Breaker has weakened trip mechanism, tripping below rated current.',
        checkProcedure: [
          'Compare actual trip current to rating',
          'Check breaker heat/damage history',
          'Test with injection tester if available',
          'Replace if tripping below rating'
        ],
        requiredTools: ['Primary injection tester'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Replacement breaker if faulty']
      },
      {
        id: 'LOOSE_CONNECTION',
        cause: 'Loose Connection Causing Heat',
        likelihood: 'medium',
        explanation: 'Loose terminal causes heat which can trigger thermal trip mechanism.',
        checkProcedure: [
          'Use thermal camera if available',
          'Check breaker terminals for tightness',
          'Look for discoloration from heat',
          'Re-torque all connections'
        ],
        requiredTools: ['Thermal camera', 'Torque wrench'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Size breaker correctly for load',
      'Distribute loads evenly',
      'Torque connections to specification',
      'Avoid sustained overloads',
      'Check thermal condition periodically'
    ],
    relatedFaultCodes: ['Over Current', 'Breaker Open', 'Short Circuit', 'Overload']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATOR SLOW TO START
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Slow Cranking Speed",
    keywords: [
      "generator cranking slowly", "generator slow to start",
      "starter turning slow", "weak cranking", "battery weak"
    ],
    description: "The engine cranks too slowly to start, or takes excessive time to reach firing speed.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'WEAK_BATTERY',
        cause: 'Weak or Discharged Battery',
        likelihood: 'high',
        explanation: 'Battery has insufficient charge to crank engine at proper speed.',
        checkProcedure: [
          'Check battery voltage (should be >12.4V for 12V system)',
          'Load test battery',
          'Check battery age',
          'Verify charger is working'
        ],
        requiredTools: ['Battery load tester', 'Multimeter'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Battery if failed']
      },
      {
        id: 'POOR_CONNECTIONS',
        cause: 'Corroded Battery Cables',
        likelihood: 'high',
        explanation: 'Corroded or loose battery connections cause high resistance and reduced cranking power.',
        checkProcedure: [
          'Inspect battery terminals for corrosion',
          'Check cable tightness',
          'Clean terminals with wire brush',
          'Measure voltage drop during cranking'
        ],
        requiredTools: ['Wire brush', 'Multimeter'],
        estimatedTime: '15-30 minutes',
        skillLevel: 'basic'
      },
      {
        id: 'STARTER_WORN',
        cause: 'Worn Starter Motor',
        likelihood: 'medium',
        explanation: 'Starter motor brushes or bearings are worn, reducing cranking efficiency.',
        checkProcedure: [
          'Measure cranking current (high current indicates wear)',
          'Listen for starter noise',
          'Check starter mounting tightness',
          'Bench test starter if removed'
        ],
        requiredTools: ['Clamp meter', 'Starter tester'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Starter motor if failed']
      },
      {
        id: 'ENGINE_RESISTANCE',
        cause: 'High Engine Resistance',
        likelihood: 'low',
        explanation: 'Internal engine problems creating excessive resistance to turning.',
        checkProcedure: [
          'Check oil viscosity is correct',
          'Try bar over by hand (with injectors out)',
          'Check for hydro-lock (fluid in cylinders)',
          'Listen for abnormal sounds'
        ],
        requiredTools: ['Bar-over tool', 'Correct grade oil'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        safetyWarnings: ['Never bar over with injectors in - risk of injury']
      }
    ],
    preventiveMeasures: [
      'Test battery annually',
      'Clean terminals every 6 months',
      'Use correct oil viscosity',
      'Exercise generator monthly',
      'Replace battery every 3-5 years'
    ],
    relatedFaultCodes: ['Low Battery', 'Fail to Start', 'Cranking Fault', 'Low Cranking Speed']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TURBOCHARGER PROBLEMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Turbocharger Problems",
    keywords: [
      "turbo not working", "generator turbo failure", "turbo noise",
      "turbo oil leak", "low boost pressure"
    ],
    description: "Issues with the turbocharger affecting engine performance and power output.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'TURBO_BEARING_WEAR',
        cause: 'Turbo Bearing Wear',
        likelihood: 'medium',
        explanation: 'Turbocharger shaft bearings worn, causing noise and potential failure.',
        checkProcedure: [
          'Check for shaft play (radial and axial)',
          'Listen for whistling or grinding noise',
          'Check oil supply to turbo',
          'Inspect for oil leakage at seals'
        ],
        requiredTools: ['Dial indicator', 'Boost gauge'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        partsNeeded: ['Turbocharger if worn']
      },
      {
        id: 'LOW_OIL_SUPPLY',
        cause: 'Restricted Oil Supply to Turbo',
        likelihood: 'medium',
        explanation: 'Blocked oil feed line or low oil pressure starving turbo bearings.',
        checkProcedure: [
          'Check oil pressure',
          'Inspect turbo oil feed line',
          'Verify oil drain is not blocked',
          'Check oil filter restriction'
        ],
        requiredTools: ['Oil pressure gauge'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'BOOST_LEAK',
        cause: 'Boost Pressure Leak',
        likelihood: 'high',
        explanation: 'Air leak in turbo ducting or intercooler reducing boost pressure.',
        checkProcedure: [
          'Check all boost hose clamps',
          'Inspect hoses for cracks or damage',
          'Pressure test intercooler',
          'Check turbo outlet pipe connections'
        ],
        requiredTools: ['Pressure tester', 'Smoke machine'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'WASTEGATE_FAULT',
        cause: 'Wastegate Stuck or Maladjusted',
        likelihood: 'medium',
        explanation: 'Wastegate not controlling boost pressure correctly.',
        checkProcedure: [
          'Check wastegate actuator rod movement',
          'Verify boost pressure at rated load',
          'Check actuator diaphragm',
          'Adjust wastegate if needed'
        ],
        requiredTools: ['Boost gauge', 'Pressure pump'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Use quality oil and change regularly',
      'Allow turbo to cool before shutdown',
      'Check boost hoses during service',
      'Monitor boost pressure trends',
      'Avoid sustained high loads on cold engine'
    ],
    relatedFaultCodes: ['Low Boost', 'Turbo Fault', 'Engine Derate', 'High Exhaust Temp']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ALTERNATOR OVERHEATING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Alternator Overheating",
    keywords: [
      "alternator hot", "generator overheating alternator", "alternator temperature high",
      "winding temperature alarm"
    ],
    description: "The alternator is running hotter than normal, risking winding damage.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'OVERLOAD_ALT',
        cause: 'Continuous Overload',
        likelihood: 'high',
        explanation: 'Running above rated capacity generates excess heat in windings.',
        checkProcedure: [
          'Check actual kW vs alternator rating',
          'Check power factor of load',
          'Monitor winding temperature',
          'Reduce load if overloaded'
        ],
        requiredTools: ['Power analyzer', 'RTD/thermocouple reader'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'COOLING_BLOCKED',
        cause: 'Blocked Cooling Air Flow',
        likelihood: 'high',
        explanation: 'Debris blocking alternator cooling air vents or fan not working.',
        checkProcedure: [
          'Inspect air inlet screens for blockage',
          'Check cooling fan operation',
          'Clean air passages',
          'Verify ambient temperature is acceptable'
        ],
        requiredTools: ['Compressed air', 'Flashlight'],
        estimatedTime: '20-45 minutes',
        skillLevel: 'basic'
      },
      {
        id: 'UNBALANCED_LOAD',
        cause: 'Heavily Unbalanced Load',
        likelihood: 'medium',
        explanation: 'Single-phase loads causing current imbalance create excess heating in rotor.',
        checkProcedure: [
          'Measure current on all phases',
          'Calculate imbalance percentage',
          'Redistribute loads if >10% imbalance',
          'Check for single-phase faults'
        ],
        requiredTools: ['Clamp meter'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      },
      {
        id: 'BEARING_FRICTION',
        cause: 'Bearing Drag or Failure',
        likelihood: 'low',
        explanation: 'Failing bearings create friction heat.',
        checkProcedure: [
          'Feel for localized heat at bearings',
          'Listen for bearing noise',
          'Check bearing temperature with thermometer',
          'Check for bearing play'
        ],
        requiredTools: ['IR thermometer', 'Stethoscope'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate'
      }
    ],
    preventiveMeasures: [
      'Never exceed alternator rating',
      'Keep cooling passages clean',
      'Balance loads across phases',
      'Monitor winding temperatures',
      'Maintain adequate ventilation'
    ],
    relatedFaultCodes: ['Winding Temp High', 'Bearing Temp High', 'Over Current', 'Alternator Fault']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUEL CONTAMINATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Fuel Contamination",
    keywords: [
      "water in diesel", "diesel bug", "contaminated fuel",
      "bad fuel", "fuel quality problem"
    ],
    description: "Fuel is contaminated with water, microbial growth (diesel bug), or debris.",
    urgency: 'medium',
    possibleCauses: [
      {
        id: 'WATER_IN_FUEL',
        cause: 'Water Contamination',
        likelihood: 'high',
        explanation: 'Water enters through condensation, leaking fill cap, or contaminated supply.',
        checkProcedure: [
          'Check fuel filter bowl for water',
          'Use water detecting paste on tank dipstick',
          'Check fuel cap seal',
          'Inspect tank breather'
        ],
        requiredTools: ['Water paste', 'Sample container'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Fuel filters after draining']
      },
      {
        id: 'DIESEL_BUG',
        cause: 'Microbial Growth (Diesel Bug)',
        likelihood: 'medium',
        explanation: 'Bacteria and fungi grow at water/fuel interface, blocking filters and injectors.',
        checkProcedure: [
          'Check fuel color (should not be dark or cloudy)',
          'Look for slime in fuel filter',
          'Test fuel with microbial test kit',
          'Check for rotten egg smell'
        ],
        requiredTools: ['Diesel bug test kit', 'Flashlight'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'intermediate',
        partsNeeded: ['Biocide treatment', 'Fuel filters']
      },
      {
        id: 'PARTICULATE_CONTAMINATION',
        cause: 'Dirt and Debris in Fuel',
        likelihood: 'medium',
        explanation: 'Particles from tank rust, dirty containers, or poor handling.',
        checkProcedure: [
          'Inspect fuel filter for debris',
          'Take fuel sample and let settle',
          'Check tank for rust',
          'Review fueling practices'
        ],
        requiredTools: ['Clear sample container'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'basic',
        partsNeeded: ['Fuel filters']
      },
      {
        id: 'WRONG_FUEL',
        cause: 'Incorrect Fuel Type',
        likelihood: 'low',
        explanation: 'Petrol, kerosene, or other fuel mixed with diesel.',
        checkProcedure: [
          'Check fuel smell (petrol has distinct odor)',
          'Review recent fueling',
          'Test fuel gravity/density',
          'Do not run engine if wrong fuel suspected'
        ],
        requiredTools: ['Fuel tester', 'Hydrometer'],
        estimatedTime: '20-40 minutes',
        skillLevel: 'intermediate',
        safetyWarnings: ['Do not start engine with contaminated fuel']
      }
    ],
    preventiveMeasures: [
      'Drain water from tank monthly',
      'Keep tank full to reduce condensation',
      'Use fuel from reputable suppliers',
      'Treat stored fuel with biocide',
      'Change fuel filters regularly'
    ],
    relatedFaultCodes: ['Fuel Contamination', 'Fuel Filter Blocked', 'Water in Fuel']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARALLEL OPERATION PROBLEMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    symptom: "Parallel Operation Failure",
    keywords: [
      "generator won't synchronize", "parallel fault", "sync check fault",
      "load sharing problem", "generators fighting"
    ],
    description: "Issues when operating multiple generators in parallel - synchronization or load sharing failures.",
    urgency: 'high',
    possibleCauses: [
      {
        id: 'FREQUENCY_MISMATCH',
        cause: 'Frequency/Speed Mismatch',
        likelihood: 'high',
        explanation: 'Generators not running at same speed, preventing synchronization.',
        checkProcedure: [
          'Check frequency of both units',
          'Verify speed droop settings match',
          'Adjust governor settings',
          'Check MPU signals'
        ],
        requiredTools: ['Frequency meter', 'Synchroscope'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'VOLTAGE_MISMATCH',
        cause: 'Voltage Level Mismatch',
        likelihood: 'medium',
        explanation: 'Output voltages not equal, causing circulation current when paralleled.',
        checkProcedure: [
          'Measure voltage on both units',
          'Check AVR settings match',
          'Verify voltage droop settings',
          'Adjust as needed'
        ],
        requiredTools: ['True RMS voltmeter'],
        estimatedTime: '30-45 minutes',
        skillLevel: 'advanced'
      },
      {
        id: 'PHASE_ROTATION_WRONG',
        cause: 'Incorrect Phase Rotation',
        likelihood: 'medium',
        explanation: 'Phase sequence ABC vs CBA prevents parallel connection.',
        checkProcedure: [
          'Check phase rotation with meter',
          'Verify CT connections',
          'Check main cable connections',
          'Swap any two phases if needed'
        ],
        requiredTools: ['Phase rotation meter'],
        estimatedTime: '30-60 minutes',
        skillLevel: 'advanced',
        safetyWarnings: ['Incorrect rotation causes reverse power']
      },
      {
        id: 'LOAD_SHARING_FAULT',
        cause: 'Load Sharing Module Fault',
        likelihood: 'medium',
        explanation: 'Load sharing electronics not communicating or configured incorrectly.',
        checkProcedure: [
          'Check load share signal connections',
          'Verify load share module settings',
          'Test communication between units',
          'Check kW/kVAR transducer operation'
        ],
        requiredTools: ['Multimeter', 'Configuration software'],
        estimatedTime: '45-90 minutes',
        skillLevel: 'advanced'
      }
    ],
    preventiveMeasures: [
      'Test parallel operation monthly',
      'Keep governor and AVR settings documented',
      'Verify settings after any adjustments',
      'Train operators on parallel procedures',
      'Maintain synchronization equipment'
    ],
    relatedFaultCodes: ['Sync Fail', 'Reverse Power', 'Phase Rotation', 'Load Share Fault']
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
