// Repair Guide Library for Generator Maintenance Companion

export type DifficultyLevel = 'easy' | 'moderate' | 'advanced' | 'expert';

export interface RepairStep {
  stepNumber: number;
  instruction: string;
  image?: string;
  torqueSpec?: string;
  warning?: string;
  tip?: string;
  checkPoint?: string;
}

export interface RepairGuide {
  id: string;
  title: string;
  symptom: string;
  description: string;
  affectedParts: string[];
  difficulty: DifficultyLevel;
  timeEstimate: string;
  tools: string[];
  safetyWarnings: string[];
  steps: RepairStep[];
  linkedFaultCodes: string[];
  partNumbers: string[];
  category: 'engine' | 'fuel' | 'cooling' | 'electrical' | 'control' | 'exhaust' | 'general';
  applicableModels: string[];
}

export const repairGuides: RepairGuide[] = [
  // Engine Repairs
  {
    id: 'oil-leak-valve-seals',
    title: 'Oil Leaking from Engine - Valve Seal Replacement',
    symptom: 'Oil leaking, blue smoke at startup, oil consumption >0.5L/hour',
    description: 'When valve seals wear, oil seeps past the valve stems into the combustion chamber, causing blue smoke especially at startup and increased oil consumption.',
    affectedParts: ['valve-seals', 'inlet-valves', 'exhaust-valves'],
    difficulty: 'advanced',
    timeEstimate: '4-6 hours',
    tools: [
      'Valve spring compressor',
      'Torque wrench (0-100 Nm)',
      'Socket set (10-24mm)',
      'Seal removal tool',
      'Magnetic pickup tool',
      'Compressed air source',
      'Clean rags',
      'Oil drain pan'
    ],
    safetyWarnings: [
      'Engine must be completely cool before starting',
      'Disconnect battery negative terminal',
      'Ensure fuel supply is shut off',
      'Keep work area well ventilated',
      'Use proper lifting equipment for valve cover'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Drain engine oil into a clean container. Note the oil quantity and condition for analysis.',
        warning: 'Hot oil can cause severe burns. Ensure engine is cool.',
        checkPoint: 'Record oil quantity drained'
      },
      {
        stepNumber: 2,
        instruction: 'Remove valve cover by loosening bolts in reverse torque sequence (outside to inside).',
        torqueSpec: 'Note: Reassembly torque 25 Nm'
      },
      {
        stepNumber: 3,
        instruction: 'Rotate engine to TDC (Top Dead Center) on cylinder 1. Verify timing marks align.',
        tip: 'Mark the rocker arm positions with paint marker before removal'
      },
      {
        stepNumber: 4,
        instruction: 'Remove rocker arms and push rods for the cylinder being serviced. Keep in order for reinstallation.',
        warning: 'Do not mix up rocker arms and push rods - they are wear-matched'
      },
      {
        stepNumber: 5,
        instruction: 'Apply compressed air to the spark plug hole to keep valves seated while compressing springs.',
        tip: 'Maintain 80-100 PSI air pressure throughout seal replacement'
      },
      {
        stepNumber: 6,
        instruction: 'Compress valve spring using spring compressor tool. Remove keepers, retainer, and spring.',
        warning: 'Valve springs are under high tension. Keep face away from spring'
      },
      {
        stepNumber: 7,
        instruction: 'Remove old valve seal using seal removal tool. Inspect valve stem for wear or scoring.',
        checkPoint: 'Valve stem diameter should be within spec (check service manual)'
      },
      {
        stepNumber: 8,
        instruction: 'Lubricate new seal with clean engine oil. Install seal using appropriate driver tool.',
        tip: 'Do not reuse old seals - always install new ones'
      },
      {
        stepNumber: 9,
        instruction: 'Reinstall spring, retainer, and keepers. Release spring compressor carefully.',
        checkPoint: 'Verify keepers are fully seated in retainer grooves'
      },
      {
        stepNumber: 10,
        instruction: 'Repeat process for remaining valves. Reinstall push rods and rocker arms.',
        torqueSpec: 'Rocker arm torque: 30 Nm'
      },
      {
        stepNumber: 11,
        instruction: 'Install new valve cover gasket. Torque bolts in sequence (inside to outside).',
        torqueSpec: 'Valve cover bolts: 25 Nm'
      },
      {
        stepNumber: 12,
        instruction: 'Refill engine oil to correct level. Start engine and check for leaks.',
        checkPoint: 'Run engine for 5 minutes, verify no blue smoke'
      }
    ],
    linkedFaultCodes: ['DSE-1443', 'CUM-148', 'DSE-1441'],
    partNumbers: ['VS-3802820', 'VCG-3802821'],
    category: 'engine',
    applicableModels: ['All diesel generators 20kVA+']
  },
  {
    id: 'generator-wont-start',
    title: 'Generator Won\'t Start - Diagnostic Flowchart',
    symptom: 'Engine cranks but won\'t start, or no cranking at all',
    description: 'Systematic diagnosis of no-start conditions covering battery, fuel, air, and control system issues.',
    affectedParts: ['starter-motor', 'fuel-pump', 'solenoid', 'magnetic-pickup', 'battery-charger'],
    difficulty: 'moderate',
    timeEstimate: '1-3 hours',
    tools: [
      'Multimeter',
      'Battery load tester',
      'Fuel pressure gauge',
      'Compressed air',
      'Basic hand tools',
      'Jumper cables (heavy duty)',
      'Fuel sample jar'
    ],
    safetyWarnings: [
      'Keep fire extinguisher nearby when testing fuel system',
      'Wear safety glasses during cranking tests',
      'Do not bypass safety circuits',
      'Disconnect battery when working on starter'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Check battery voltage with multimeter. Should read 12.4V+ at rest, 10.5V+ during cranking.',
        checkPoint: 'Battery voltage: ___V at rest, ___V cranking'
      },
      {
        stepNumber: 2,
        instruction: 'If battery is low, charge or replace. Check battery terminals are clean and tight.',
        tip: 'Corroded terminals can cause high resistance and starting problems'
      },
      {
        stepNumber: 3,
        instruction: 'Verify emergency stop is not engaged. Check all safety switches (oil pressure, coolant, etc.).',
        warning: 'Never bypass safety switches permanently'
      },
      {
        stepNumber: 4,
        instruction: 'Check controller for fault codes. Note any active or logged faults.',
        checkPoint: 'Recorded fault codes: ___'
      },
      {
        stepNumber: 5,
        instruction: 'If no crank: Test starter motor by jumping solenoid. Listen for engagement.',
        warning: 'Stand clear of rotating parts during cranking test'
      },
      {
        stepNumber: 6,
        instruction: 'If cranks but no start: Check fuel supply. Prime fuel system and bleed air.',
        tip: 'Pump primer until solid stream of fuel, no bubbles'
      },
      {
        stepNumber: 7,
        instruction: 'Check fuel solenoid operation. You should hear click when key is turned to ON.',
        checkPoint: 'Solenoid clicks: Yes / No'
      },
      {
        stepNumber: 8,
        instruction: 'Verify fuel is reaching injectors. Crack injector line and crank briefly.',
        warning: 'High pressure fuel - keep clear and use rags to catch fuel'
      },
      {
        stepNumber: 9,
        instruction: 'Check air filter is not blocked. Inspect for debris or water.',
        checkPoint: 'Air filter condition: Clean / Dirty / Blocked'
      },
      {
        stepNumber: 10,
        instruction: 'Check magnetic pickup signal. Use multimeter on AC millivolts during cranking.',
        tip: 'Should see 1-5 VAC signal during cranking'
      },
      {
        stepNumber: 11,
        instruction: 'If all above check out: Perform compression test on each cylinder.',
        checkPoint: 'Compression readings: Cyl1:___ Cyl2:___ Cyl3:___ Cyl4:___'
      },
      {
        stepNumber: 12,
        instruction: 'Review findings and proceed to specific repair based on diagnosis.',
        tip: 'Most common causes: Low battery (40%), fuel issue (30%), solenoid (15%), other (15%)'
      }
    ],
    linkedFaultCodes: ['DSE-4261', 'DSE-4271', 'DSE-1621', 'DSE-4211'],
    partNumbers: ['SM-3957597', 'SOL-3935649', 'FP-4954200', 'MPU-3034572'],
    category: 'general',
    applicableModels: ['All diesel generators']
  },
  {
    id: 'low-power-output',
    title: 'Low Power Output - AVR and Alternator Check',
    symptom: 'Generator cannot reach full load, voltage drops under load',
    description: 'Diagnosis and repair of power output issues related to AVR, alternator, and excitation system.',
    affectedParts: ['avr', 'alternator', 'stator', 'rotor', 'brushes', 'rectifier'],
    difficulty: 'advanced',
    timeEstimate: '2-4 hours',
    tools: [
      'Multimeter with clamp meter',
      'Insulation resistance tester (Megger)',
      'Variable load bank (or load)',
      'Oscilloscope (optional)',
      'AVR adjustment tool',
      'Infrared thermometer'
    ],
    safetyWarnings: [
      'DANGER: High voltage present - de-energize before internal inspection',
      'Lock out/tag out main breaker',
      'Allow capacitors to discharge (5 minutes minimum)',
      'Never touch terminals while running'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'With no load, measure output voltage on all three phases (or single phase). Record readings.',
        checkPoint: 'L1-N: ___V, L2-N: ___V, L3-N: ___V (should be 220-240V)'
      },
      {
        stepNumber: 2,
        instruction: 'Check voltage balance between phases. Maximum difference should be <3%.',
        tip: 'Imbalance indicates stator or connection issue'
      },
      {
        stepNumber: 3,
        instruction: 'Apply load in steps (25%, 50%, 75%, 100%). Record voltage at each step.',
        checkPoint: 'Voltage drop from no-load to full-load should be <5%'
      },
      {
        stepNumber: 4,
        instruction: 'Check frequency at each load point. Should maintain 50Hz ±0.5Hz.',
        checkPoint: 'Frequency at full load: ___Hz'
      },
      {
        stepNumber: 5,
        instruction: 'If voltage drops excessively: Check AVR adjustment. Increase voltage trim pot slowly.',
        warning: 'Do not exceed 260V no-load voltage',
        tip: 'Small adjustments - 1/4 turn at a time'
      },
      {
        stepNumber: 6,
        instruction: 'Shut down and lock out. Check excitation circuit brushes for wear.',
        checkPoint: 'Brush length: ___mm (minimum 10mm typical)'
      },
      {
        stepNumber: 7,
        instruction: 'Test stator insulation resistance with Megger at 500V. Should be >1 MΩ.',
        checkPoint: 'Stator insulation: ___MΩ'
      },
      {
        stepNumber: 8,
        instruction: 'Test rotor insulation resistance. Should be >1 MΩ.',
        checkPoint: 'Rotor insulation: ___MΩ'
      },
      {
        stepNumber: 9,
        instruction: 'Check rectifier diodes using diode test mode. Each should show 0.5-0.7V forward.',
        checkPoint: 'All diodes test OK: Yes / No'
      },
      {
        stepNumber: 10,
        instruction: 'Inspect wiring connections for looseness or corrosion. Re-torque all terminals.',
        torqueSpec: 'Terminal bolts: 8-12 Nm'
      },
      {
        stepNumber: 11,
        instruction: 'If AVR is faulty, replace with same model. Configure settings per manual.',
        tip: 'Note AVR settings before removal'
      },
      {
        stepNumber: 12,
        instruction: 'Restart and retest at full load. Verify stable voltage and frequency.',
        checkPoint: 'Final test: ___V at ___% load'
      }
    ],
    linkedFaultCodes: ['DSE-3141', 'DSE-3142', 'DSE-3111', 'DSE-3121'],
    partNumbers: ['AVR-4936882', 'BR-4936884', 'REC-4936883'],
    category: 'electrical',
    applicableModels: ['All synchronous generators']
  },
  {
    id: 'black-smoke-exhaust',
    title: 'Excessive Black Smoke - Injector and Turbo Cleaning',
    symptom: 'Black smoke under load, poor fuel economy, power loss',
    description: 'Black smoke indicates incomplete combustion from over-fueling, restricted air, or worn injectors.',
    affectedParts: ['injector-nozzle', 'turbocharger', 'fuel-filter-primary', 'fuel-filter-secondary', 'inlet-valves'],
    difficulty: 'advanced',
    timeEstimate: '3-5 hours',
    tools: [
      'Injector puller',
      'Injector test bench (or dealer service)',
      'Air filter pressure gauge',
      'Turbo boost gauge',
      'Carbon cleaning solvent',
      'Torque wrench',
      'New sealing washers'
    ],
    safetyWarnings: [
      'Hot exhaust components - allow to cool',
      'Injectors operate at extreme pressure',
      'Wear eye protection during cleaning',
      'Proper ventilation for solvent use'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Check air filter condition and inlet restriction. Replace if dirty.',
        checkPoint: 'Air filter restriction: ___inches H2O (max 25")'
      },
      {
        stepNumber: 2,
        instruction: 'Check turbo boost pressure at full load. Compare to specifications.',
        checkPoint: 'Boost pressure: ___bar (typical 1.2-2.0 bar)'
      },
      {
        stepNumber: 3,
        instruction: 'Inspect turbo for shaft play and damage. Spin by hand - should rotate freely.',
        warning: 'Never use compressed air on turbo - can cause overspeed damage',
        checkPoint: 'Turbo shaft play: Axial:___mm Radial:___mm'
      },
      {
        stepNumber: 4,
        instruction: 'If turbo is carbon-fouled, clean with approved solvent. Do not use wire brushes.',
        tip: 'Soak overnight in diesel fuel for heavy carbon'
      },
      {
        stepNumber: 5,
        instruction: 'Check intercooler (if equipped) for leaks and blockage. Pressure test if possible.',
        checkPoint: 'Intercooler condition: OK / Leaking / Blocked'
      },
      {
        stepNumber: 6,
        instruction: 'Remove fuel injectors. Note cylinder positions for reinstallation.',
        warning: 'Do not mix up injector positions',
        torqueSpec: 'Note removal torque for reference'
      },
      {
        stepNumber: 7,
        instruction: 'Inspect injector tips for carbon buildup and damage. Clean or replace as needed.',
        tip: 'Ultrasonic cleaning is most effective'
      },
      {
        stepNumber: 8,
        instruction: 'Test injector spray pattern and opening pressure on test bench.',
        checkPoint: 'Opening pressure: ___bar (spec: 175-200 bar typical)'
      },
      {
        stepNumber: 9,
        instruction: 'Replace injector sealing washers with new ones. Never reuse.',
        warning: 'Old washers can cause combustion gas leaks'
      },
      {
        stepNumber: 10,
        instruction: 'Reinstall injectors with correct torque sequence.',
        torqueSpec: 'Injector hold-down: 25-30 Nm'
      },
      {
        stepNumber: 11,
        instruction: 'Check inlet valve condition via borescope if smoke persists.',
        tip: 'Carbon on inlet valves causes poor air flow'
      },
      {
        stepNumber: 12,
        instruction: 'Replace fuel filters. Bleed fuel system. Start and test under load.',
        checkPoint: 'Smoke cleared at full load: Yes / No'
      }
    ],
    linkedFaultCodes: ['DSE-1611', 'DSE-2261', 'CUM-271', 'CUM-431'],
    partNumbers: ['FI-4928990', 'TC-4955305', 'FF-3890017', 'FF-3890018'],
    category: 'fuel',
    applicableModels: ['All turbocharged diesel generators']
  },
  {
    id: 'overheating',
    title: 'Engine Overheating - Cooling System Inspection',
    symptom: 'High temperature alarms, coolant loss, steam from engine',
    description: 'Systematic diagnosis of overheating covering all cooling system components.',
    affectedParts: ['radiator', 'water-pump', 'thermostat', 'coolant-hoses', 'fan-belt', 'cooling-fan'],
    difficulty: 'moderate',
    timeEstimate: '2-4 hours',
    tools: [
      'Cooling system pressure tester',
      'Infrared thermometer',
      'Coolant refractometer',
      'Radiator fin comb',
      'Belt tension gauge',
      'Thermostat tester'
    ],
    safetyWarnings: [
      'NEVER open radiator cap on hot engine',
      'Hot coolant can cause severe burns',
      'Keep clear of rotating fan',
      'Allow engine to cool completely before service'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'With engine COLD, check coolant level in radiator and overflow tank.',
        checkPoint: 'Coolant level: ___% full'
      },
      {
        stepNumber: 2,
        instruction: 'Check coolant condition with refractometer. Should be -30°C protection minimum.',
        checkPoint: 'Freeze protection: ___°C'
      },
      {
        stepNumber: 3,
        instruction: 'Pressure test cooling system at 15 PSI for 15 minutes. Watch for pressure drop.',
        checkPoint: 'Pressure held: Yes / No (drop ___PSI)'
      },
      {
        stepNumber: 4,
        instruction: 'Inspect all hoses for cracks, swelling, or softness. Squeeze hoses when cold.',
        tip: 'Soft or mushy hoses indicate internal deterioration'
      },
      {
        stepNumber: 5,
        instruction: 'Check radiator fins for blockage (debris, bugs, oil). Clean with low pressure water.',
        warning: 'High pressure can damage fins',
        checkPoint: 'Fins blocked: ___%'
      },
      {
        stepNumber: 6,
        instruction: 'Inspect fan belt tension and condition. Check for cracks, glazing, or fraying.',
        checkPoint: 'Belt deflection: ___mm (spec: 10-15mm typical)'
      },
      {
        stepNumber: 7,
        instruction: 'Start engine and warm up. Verify thermostat opens (feel upper radiator hose get hot).',
        checkPoint: 'Thermostat opens at: ___°C (spec: 82-88°C typical)'
      },
      {
        stepNumber: 8,
        instruction: 'Use IR thermometer to check temperature across radiator. Should be even distribution.',
        tip: 'Cold spots indicate internal blockage'
      },
      {
        stepNumber: 9,
        instruction: 'Check water pump for leaks at weep hole and shaft seal.',
        checkPoint: 'Water pump leak: Yes / No'
      },
      {
        stepNumber: 10,
        instruction: 'Verify cooling fan engages at proper temperature. Check viscous clutch if equipped.',
        tip: 'Viscous fan should resist rotation when hot'
      },
      {
        stepNumber: 11,
        instruction: 'Flush cooling system if coolant is contaminated or overdue for service.',
        warning: 'Dispose of old coolant properly - it is toxic'
      },
      {
        stepNumber: 12,
        instruction: 'Refill with correct coolant mixture. Bleed air from system. Pressure test again.',
        checkPoint: 'Operating temp after repair: ___°C'
      }
    ],
    linkedFaultCodes: ['DSE-2151', 'DSE-2153', 'DSE-2155', 'CUM-351', 'CUM-354'],
    partNumbers: ['RAD-3970185', 'WP-4891252', 'TH-3076489', 'CH-3920709', 'FB-3911562'],
    category: 'cooling',
    applicableModels: ['All liquid-cooled generators']
  },
  {
    id: 'mpu-replacement',
    title: 'Magnetic Pickup Failure - Sensor Replacement',
    symptom: 'Speed/frequency errors, overspeed trips, engine won\'t start',
    description: 'The magnetic pickup senses engine speed for governor and controller. Failure causes major operational issues.',
    affectedParts: ['magnetic-pickup'],
    difficulty: 'easy',
    timeEstimate: '30-60 minutes',
    tools: [
      'Socket set',
      'Feeler gauges',
      'Multimeter',
      'Thread sealant',
      'Clean rags'
    ],
    safetyWarnings: [
      'Disconnect battery before working on sensor',
      'Engine must be completely stopped',
      'Keep tools away from flywheel ring gear'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Locate the magnetic pickup sensor on the flywheel housing or timing cover.',
        tip: 'Usually has a 2-wire connector'
      },
      {
        stepNumber: 2,
        instruction: 'Disconnect the sensor wiring connector. Note wire colors for reconnection.',
        checkPoint: 'Wire colors: ___'
      },
      {
        stepNumber: 3,
        instruction: 'Test old sensor resistance with multimeter. Should be 200-800 ohms typically.',
        checkPoint: 'Old sensor resistance: ___Ω'
      },
      {
        stepNumber: 4,
        instruction: 'Remove the sensor by unscrewing from housing. Count the turns for depth reference.',
        checkPoint: 'Turns to remove: ___'
      },
      {
        stepNumber: 5,
        instruction: 'Inspect flywheel ring gear teeth for damage or debris.',
        warning: 'Damaged teeth will cause speed reading errors'
      },
      {
        stepNumber: 6,
        instruction: 'Apply thread sealant to new sensor threads (if required by manufacturer).',
        tip: 'Some sensors come pre-applied with sealant'
      },
      {
        stepNumber: 7,
        instruction: 'Install new sensor and screw in until it lightly contacts ring gear.',
        warning: 'Do not over-tighten - can damage sensor tip'
      },
      {
        stepNumber: 8,
        instruction: 'Back out sensor to achieve correct air gap using feeler gauge.',
        checkPoint: 'Air gap: 0.5-1.0mm typical (check service manual)',
        torqueSpec: 'Lock nut: 15 Nm'
      },
      {
        stepNumber: 9,
        instruction: 'Reconnect wiring connector. Ensure secure connection.',
        tip: 'Apply dielectric grease to connector'
      },
      {
        stepNumber: 10,
        instruction: 'Reconnect battery. Start engine and verify speed/frequency display.',
        checkPoint: 'Speed reading: ___RPM, Frequency: ___Hz'
      },
      {
        stepNumber: 11,
        instruction: 'Clear any fault codes from controller related to speed sensing.',
        checkPoint: 'Fault codes cleared: Yes / No'
      },
      {
        stepNumber: 12,
        instruction: 'Run generator under load. Verify stable frequency and no overspeed trips.',
        checkPoint: 'Load test passed: Yes / No'
      }
    ],
    linkedFaultCodes: ['DSE-4211', 'DSE-4212', 'CUM-115'],
    partNumbers: ['MPU-3034572'],
    category: 'control',
    applicableModels: ['All generators with magnetic pickup speed sensing']
  },
  {
    id: 'piston-ring-compression',
    title: 'Piston Ring Wear Signs - Compression Test Guide',
    symptom: 'Loss of power, excessive oil consumption, blue smoke',
    description: 'Compression testing to diagnose piston ring wear and other internal engine issues.',
    affectedParts: ['piston-rings', 'cylinder-head', 'head-gasket', 'inlet-valves', 'exhaust-valves'],
    difficulty: 'moderate',
    timeEstimate: '1-2 hours',
    tools: [
      'Compression tester gauge',
      'Spark plug socket (for SI engines) or injector removal tools',
      'Oil squirt can',
      'Battery charger',
      'Notepad for recording'
    ],
    safetyWarnings: [
      'Disable fuel system before testing',
      'Disable ignition system (if applicable)',
      'Battery must be fully charged for accurate results',
      'Keep clear of rotating parts'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Warm engine to operating temperature, then shut down.',
        tip: 'Cold compression test gives lower readings'
      },
      {
        stepNumber: 2,
        instruction: 'Disable fuel injection system to prevent starting during test.',
        warning: 'Do not allow engine to start with tester installed'
      },
      {
        stepNumber: 3,
        instruction: 'Remove all injectors (diesel) or spark plugs (gas). Keep in cylinder order.',
        tip: 'Label each injector with cylinder number'
      },
      {
        stepNumber: 4,
        instruction: 'Install compression gauge adapter in cylinder 1.',
        checkPoint: 'Ensure adapter is fully seated'
      },
      {
        stepNumber: 5,
        instruction: 'Crank engine for 4-5 compression strokes. Record highest reading.',
        checkPoint: 'Cylinder 1: ___bar'
      },
      {
        stepNumber: 6,
        instruction: 'Repeat for each cylinder. Record all readings.',
        checkPoint: 'Cyl1:___ Cyl2:___ Cyl3:___ Cyl4:___ Cyl5:___ Cyl6:___'
      },
      {
        stepNumber: 7,
        instruction: 'Compare readings. All should be within 10% of each other. Typical: 25-35 bar.',
        tip: 'Low readings indicate wear or damage'
      },
      {
        stepNumber: 8,
        instruction: 'For low cylinders: Perform wet test by adding 15ml oil through injector hole.',
        tip: 'Oil temporarily seals rings for comparison'
      },
      {
        stepNumber: 9,
        instruction: 'Retest low cylinder with oil added. Compare to dry reading.',
        checkPoint: 'Wet test increase: ___bar'
      },
      {
        stepNumber: 10,
        instruction: 'Interpretation: Large increase (>20%) = ring wear. Little increase = valve or head gasket issue.',
        tip: 'Adjacent low cylinders often indicate head gasket failure between them'
      },
      {
        stepNumber: 11,
        instruction: 'Reinstall injectors with new sealing washers. Torque to specification.',
        torqueSpec: 'Injector hold-down: 25-30 Nm'
      },
      {
        stepNumber: 12,
        instruction: 'Reconnect fuel system. Start engine and verify no leaks.',
        checkPoint: 'All connections tight, no fuel leaks'
      }
    ],
    linkedFaultCodes: ['DSE-1441', 'DSE-1442', 'CUM-145'],
    partNumbers: ['PR-4089500', 'HG-4089349'],
    category: 'engine',
    applicableModels: ['All internal combustion generators']
  },
  {
    id: 'turbo-inspection',
    title: 'Turbocharger Not Spinning Properly - Inspection and Cleaning',
    symptom: 'Changed turbo whistle, black smoke, loss of power, slow response',
    description: 'Turbocharger inspection for bearing wear, carbon buildup, and foreign object damage.',
    affectedParts: ['turbocharger', 'exhaust-manifold'],
    difficulty: 'advanced',
    timeEstimate: '2-4 hours',
    tools: [
      'Socket set',
      'Turbo-safe cleaning solvent',
      'Dial indicator',
      'Inspection mirror',
      'Borescope (optional)',
      'New gaskets',
      'Clean lint-free rags'
    ],
    safetyWarnings: [
      'Allow exhaust system to cool completely',
      'Never use compressed air to spin turbo',
      'Wear gloves - turbo components have sharp edges',
      'Keep foreign objects out of turbo openings'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'With engine off and cool, remove air intake pipe from compressor inlet.',
        tip: 'Cover intake opening to prevent debris entry'
      },
      {
        stepNumber: 2,
        instruction: 'Inspect compressor wheel for damage, erosion, or buildup.',
        checkPoint: 'Compressor wheel condition: Good / Damaged / Dirty'
      },
      {
        stepNumber: 3,
        instruction: 'Spin compressor wheel by hand. Should rotate freely without scraping.',
        warning: 'Scraping sound indicates bearing failure or wheel contact'
      },
      {
        stepNumber: 4,
        instruction: 'Check shaft radial play by moving wheel side-to-side.',
        checkPoint: 'Radial play: ___mm (max 0.10mm typical)'
      },
      {
        stepNumber: 5,
        instruction: 'Check shaft axial play by pushing/pulling wheel in shaft direction.',
        checkPoint: 'Axial play: ___mm (max 0.15mm typical)'
      },
      {
        stepNumber: 6,
        instruction: 'Remove exhaust inlet pipe to inspect turbine wheel.',
        warning: 'Exhaust side will have more carbon buildup'
      },
      {
        stepNumber: 7,
        instruction: 'Inspect turbine wheel for cracks, erosion, or missing blade tips.',
        checkPoint: 'Turbine wheel condition: Good / Damaged / Carbon-coated'
      },
      {
        stepNumber: 8,
        instruction: 'Check for oil leaks at compressor and turbine seals.',
        tip: 'Light oil film is normal; heavy oil indicates seal wear'
      },
      {
        stepNumber: 9,
        instruction: 'If carbon buildup is present, soak in turbo-safe cleaner overnight.',
        warning: 'Do not use wire brushes or abrasives'
      },
      {
        stepNumber: 10,
        instruction: 'Check oil supply and drain lines for blockage or kinks.',
        checkPoint: 'Oil lines clear: Yes / No'
      },
      {
        stepNumber: 11,
        instruction: 'Reinstall turbo with new gaskets. Verify all connections secure.',
        torqueSpec: 'Manifold nuts: 25-30 Nm, V-band clamp: 8-10 Nm'
      },
      {
        stepNumber: 12,
        instruction: 'Pre-oil turbo by cranking without starting, or use oil squirt in supply line.',
        warning: 'Never start engine with dry turbo bearings',
        checkPoint: 'Turbo pre-oiled: Yes'
      }
    ],
    linkedFaultCodes: ['DSE-2261', 'DSE-2262', 'CUM-431', 'CUM-432'],
    partNumbers: ['TC-4955305'],
    category: 'exhaust',
    applicableModels: ['All turbocharged generators']
  }
];

// Get repair guide by ID
export const getRepairGuideById = (id: string): RepairGuide | undefined => {
  return repairGuides.find(guide => guide.id === id);
};

// Get guides by category
export const getGuidesByCategory = (category: RepairGuide['category']): RepairGuide[] => {
  return repairGuides.filter(guide => guide.category === category);
};

// Get guides by difficulty
export const getGuidesByDifficulty = (difficulty: DifficultyLevel): RepairGuide[] => {
  return repairGuides.filter(guide => guide.difficulty === difficulty);
};

// Search guides
export const searchGuides = (query: string): RepairGuide[] => {
  const lowercaseQuery = query.toLowerCase();
  return repairGuides.filter(guide =>
    guide.title.toLowerCase().includes(lowercaseQuery) ||
    guide.symptom.toLowerCase().includes(lowercaseQuery) ||
    guide.description.toLowerCase().includes(lowercaseQuery) ||
    guide.affectedParts.some(part => part.toLowerCase().includes(lowercaseQuery)) ||
    guide.linkedFaultCodes.some(code => code.toLowerCase().includes(lowercaseQuery))
  );
};

// Get guides by fault code
export const getGuidesByFaultCode = (faultCode: string): RepairGuide[] => {
  return repairGuides.filter(guide =>
    guide.linkedFaultCodes.some(code => code.toLowerCase() === faultCode.toLowerCase())
  );
};

// Difficulty display helpers
export const difficultyColors: Record<DifficultyLevel, string> = {
  easy: '#10B981', // Emerald
  moderate: '#F59E0B', // Amber
  advanced: '#EF4444', // Red
  expert: '#7C3AED' // Purple
};

export const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: 'Easy - Basic Tools',
  moderate: 'Moderate - Some Experience',
  advanced: 'Advanced - Skilled Technician',
  expert: 'Expert - Specialist Required'
};
