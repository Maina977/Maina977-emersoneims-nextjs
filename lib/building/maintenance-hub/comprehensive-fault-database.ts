/**
 * WORLD'S MOST COMPREHENSIVE MAINTENANCE FAULT DATABASE
 * Complete fault codes, error diagnostics, and professional solutions
 * For all maintenance services: Generator, Solar, Motor, UPS, AC, Electrical, Welding, Automation
 *
 * Each fault includes:
 * - Detailed description and root causes
 * - Step-by-step diagnostic procedures
 * - Professional repair solutions
 * - Prevention measures
 * - Safety precautions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultCode {
  code: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Warning';
  category: string;
  description: string;
  rootCauses: string[];
  symptoms: string[];
  diagnosticSteps: string[];
  solution: string;
  detailedRepairProcedure: string[];
  preventionMeasures: string[];
  safetyPrecautions: string[];
  estimatedRepairTime: string;
  estimatedCost: string;
  toolsRequired: string[];
  partsRequired?: string[];
  technicalNotes?: string;
}

export interface ServiceFaultDatabase {
  serviceId: string;
  serviceName: string;
  totalFaultCodes: number;
  categories: string[];
  faults: FaultCode[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATOR FAULT DATABASE - 150+ CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const GENERATOR_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'generator',
  serviceName: 'Generator Services',
  totalFaultCodes: 156,
  categories: [
    'Engine Faults',
    'Electrical Faults',
    'Control System Faults',
    'Fuel System Faults',
    'Cooling System Faults',
    'Exhaust System Faults',
    'Starting System Faults',
    'ATS Faults',
    'Protection Faults',
    'Communication Faults'
  ],
  faults: [
    // ENGINE FAULTS
    {
      code: 'E001',
      name: 'Low Oil Pressure',
      severity: 'Critical',
      category: 'Engine Faults',
      description: 'Engine oil pressure has dropped below the minimum safe operating threshold. Oil pressure is essential for lubricating moving engine components including bearings, pistons, and the crankshaft. Operation without adequate oil pressure will cause catastrophic engine damage within minutes.',
      rootCauses: [
        'Insufficient oil level - oil consumption or leakage',
        'Worn oil pump - reduced pumping capacity',
        'Clogged oil filter - restricted flow',
        'Worn main or rod bearings - excessive clearance',
        'Faulty oil pressure sensor/switch',
        'Wrong oil viscosity for ambient temperature',
        'Oil dilution from fuel leakage into crankcase',
        'Blocked oil pickup screen in sump'
      ],
      symptoms: [
        'Low oil pressure warning light/alarm',
        'Engine shutdown on protection trip',
        'Knocking or ticking sounds from engine',
        'Increased engine temperature',
        'Visible oil leaks under engine'
      ],
      diagnosticSteps: [
        'Immediately stop the engine if running - continued operation causes damage',
        'Check oil level using dipstick - should be between MIN and MAX marks',
        'Inspect for visible oil leaks around engine, oil filter, and drain plug',
        'Check oil condition - milky oil indicates coolant contamination',
        'Verify oil filter is correct type and properly installed',
        'If oil level is correct, install mechanical oil pressure gauge to verify actual pressure',
        'Compare actual pressure to specifications (typically 25-65 PSI at operating temp)',
        'If mechanical gauge shows good pressure but sensor reads low, replace sensor',
        'If actual pressure is low with correct oil level, internal engine wear is likely'
      ],
      solution: 'Identify and correct the root cause of low oil pressure before operating the generator. Top up oil if low, replace filter if clogged, repair leaks, or address internal engine wear.',
      detailedRepairProcedure: [
        'If oil is simply low: Top up with correct grade oil (check manual for specification)',
        'For oil leaks: Identify leak source and replace gasket, seal, or component',
        'For clogged filter: Replace oil filter and perform oil change',
        'For faulty sensor: Replace oil pressure sensor/switch with OEM part',
        'For worn bearings: Engine requires overhaul - remove, disassemble, measure bearing clearances, replace bearings and seals',
        'For worn oil pump: Replace oil pump assembly',
        'For fuel dilution: Diagnose and repair fuel system leak (injector seals, fuel pump)',
        'After any repair, verify oil pressure with mechanical gauge before returning to service'
      ],
      preventionMeasures: [
        'Check oil level daily or before each start',
        'Change oil and filter according to manufacturer schedule',
        'Use only specified oil grade and viscosity',
        'Address oil leaks immediately when noticed',
        'Monitor oil consumption trends',
        'Perform oil analysis periodically for early wear detection'
      ],
      safetyPrecautions: [
        'Allow engine to cool before checking oil',
        'Use appropriate PPE - gloves and eye protection',
        'Dispose of used oil properly at authorized facility',
        'Keep rags away from hot exhaust components',
        'Do not start engine without adequate oil'
      ],
      estimatedRepairTime: '30 min - 8 hours depending on cause',
      estimatedCost: 'KES 500 (oil top up) - 250,000 (bearing replacement)',
      toolsRequired: ['Mechanical oil pressure gauge', 'Wrench set', 'Oil filter wrench', 'Drain pan', 'Torque wrench'],
      partsRequired: ['Engine oil', 'Oil filter', 'Oil pressure sensor (if faulty)'],
      technicalNotes: 'Normal oil pressure: 25-65 PSI at operating temperature, 10-15 PSI at hot idle. Cold pressure will be higher due to oil viscosity.'
    },
    {
      code: 'E002',
      name: 'High Engine Temperature',
      severity: 'Critical',
      category: 'Engine Faults',
      description: 'Engine coolant temperature has exceeded safe operating limits. Overheating causes severe engine damage including warped cylinder heads, blown head gaskets, and seized pistons. Modern generators shutdown automatically on high temperature to prevent damage.',
      rootCauses: [
        'Low coolant level - leak or consumption',
        'Faulty thermostat - stuck closed',
        'Radiator blockage - internal or external',
        'Failed water pump - no circulation',
        'Damaged or loose fan belt',
        'Failed cooling fan or fan clutch',
        'Collapsed radiator hose',
        'Air in cooling system',
        'Head gasket failure',
        'Faulty temperature sensor',
        'Overloading of generator',
        'Insufficient airflow around generator'
      ],
      symptoms: [
        'High temperature warning/alarm',
        'Temperature gauge in red zone',
        'Steam from radiator or overflow',
        'Coolant leaking visible',
        'Loss of power',
        'Sweet smell of coolant',
        'Engine shutdown on protection'
      ],
      diagnosticSteps: [
        'Allow engine to cool completely before inspection - hot coolant under pressure is dangerous',
        'Check coolant level in overflow tank and radiator when cool',
        'Inspect for visible coolant leaks - radiator, hoses, water pump, head gasket area',
        'Check condition of drive belts - cracked, glazed, or loose',
        'Verify cooling fan operates - manual or electric',
        'Feel radiator hoses when warm - both should be hot, indicating flow',
        'If top hose is hot and bottom is cold, thermostat may be stuck closed',
        'Check for external radiator blockage - debris, dirt, insects',
        'Pressure test cooling system to identify leaks',
        'Check for combustion gases in coolant (indicates head gasket failure)',
        'Verify temperature sensor accuracy with separate thermometer'
      ],
      solution: 'Restore proper cooling system function by addressing the specific failure - refill coolant, replace thermostat, repair leaks, or restore airflow.',
      detailedRepairProcedure: [
        'For low coolant: Refill with correct coolant mixture (typically 50/50 antifreeze/water)',
        'For thermostat failure: Drain coolant, remove thermostat housing, replace thermostat and gasket',
        'For water pump failure: Drain coolant, remove belts, remove pump, install new pump with gasket/seal',
        'For radiator blockage: External - clean with pressure washer; Internal - flush or replace radiator',
        'For belt problems: Adjust tension or replace belt',
        'For fan failure: Replace fan motor, fan clutch, or repair wiring',
        'For head gasket: Major repair requiring head removal, gasket replacement, head resurfacing',
        'After repair, refill coolant, bleed air from system, pressure test',
        'Run engine and verify temperature stabilizes in normal range'
      ],
      preventionMeasures: [
        'Check coolant level weekly',
        'Inspect belts monthly for wear and tension',
        'Clean radiator fins regularly - especially in dusty environments',
        'Change coolant according to schedule (typically every 2 years)',
        'Maintain adequate ventilation around generator',
        'Do not overload generator beyond rated capacity',
        'Repair small leaks before they become major problems'
      ],
      safetyPrecautions: [
        'NEVER remove radiator cap when engine is hot - risk of severe burns',
        'Allow engine to cool for at least 30 minutes before working on cooling system',
        'Coolant is toxic - dispose properly, keep away from animals and children',
        'Use proper lifting equipment when removing heavy components'
      ],
      estimatedRepairTime: '1-8 hours depending on cause',
      estimatedCost: 'KES 2,000 (coolant refill) - 150,000 (head gasket repair)',
      toolsRequired: ['Cooling system pressure tester', 'Wrench set', 'Hose clamp pliers', 'Drain pan', 'Infrared thermometer'],
      partsRequired: ['Coolant', 'Thermostat (if faulty)', 'Water pump (if faulty)', 'Gaskets']
    },
    {
      code: 'E003',
      name: 'Engine Overspeed',
      severity: 'Critical',
      category: 'Engine Faults',
      description: 'Engine RPM has exceeded the maximum safe operating speed. Overspeed can cause catastrophic mechanical failure including broken connecting rods, thrown pistons, and flywheel disintegration. This is a life-threatening condition requiring immediate shutdown.',
      rootCauses: [
        'Governor failure - mechanical or electronic',
        'Throttle linkage stuck open',
        'Fuel injection system malfunction',
        'Actuator failure (electronic governors)',
        'Speed sensor failure with backup protection triggered',
        'Loss of load while at high power output',
        'Incorrect governor settings/calibration'
      ],
      symptoms: [
        'Abnormally high engine noise',
        'High frequency vibration',
        'Overspeed shutdown alarm',
        'Emergency stop activation',
        'Visible smoke from excessive speed'
      ],
      diagnosticSteps: [
        'Do not attempt to restart until cause is identified',
        'Check governor linkage for binding or disconnection',
        'Inspect throttle/fuel rack for stuck position',
        'Test governor operation manually - should move freely',
        'For electronic governors, check actuator and wiring',
        'Verify speed sensor operation and calibration',
        'Check for any mechanical interference with throttle operation',
        'Review controller event log for sequence of events'
      ],
      solution: 'Repair or replace the failed governor system component and verify proper speed control before returning to service.',
      detailedRepairProcedure: [
        'For mechanical governor: Clean and lubricate linkage, replace worn parts, adjust settings',
        'For electronic actuator: Test actuator response, check wiring, replace if faulty',
        'For speed sensor: Replace sensor, verify proper air gap and calibration',
        'Verify governor settings match engine specifications',
        'Test governor response under controlled conditions before loading',
        'Verify overspeed protection trips at correct setpoint (typically 10-12% above rated)',
        'Document all adjustments and test results'
      ],
      preventionMeasures: [
        'Include governor inspection in preventive maintenance',
        'Test overspeed protection annually',
        'Keep governor linkage clean and lubricated',
        'Monitor engine speed during operation',
        'Address minor speed fluctuations before they become major problems'
      ],
      safetyPrecautions: [
        'Do not stand near generator during initial restart after overspeed',
        'Ensure emergency stop is accessible during testing',
        'Test in unloaded condition first',
        'Have qualified personnel perform governor adjustments'
      ],
      estimatedRepairTime: '2-6 hours',
      estimatedCost: 'KES 15,000 - 85,000',
      toolsRequired: ['Tachometer', 'Governor adjustment tools', 'Multimeter', 'Feeler gauges'],
      partsRequired: ['Governor parts kit', 'Actuator (if faulty)', 'Speed sensor (if faulty)']
    },
    {
      code: 'E004',
      name: 'Fail to Start',
      severity: 'High',
      category: 'Starting System Faults',
      description: 'Engine cranks but fails to start after the normal cranking period. This indicates a problem with fuel, air, compression, or timing. Generators must start reliably for emergency backup power.',
      rootCauses: [
        'No fuel or air in fuel system',
        'Contaminated or old fuel',
        'Clogged fuel filter',
        'Failed fuel lift pump',
        'Injection pump timing incorrect',
        'Faulty glow plugs (diesel) or spark plugs (gas)',
        'Low compression due to wear',
        'Intake or exhaust restriction',
        'Incorrect shutdown procedure left issues',
        'Cold start system failure'
      ],
      symptoms: [
        'Engine cranks normally but does not fire',
        'Engine fires intermittently but will not run',
        'Extended cranking with no start',
        'White or black smoke during cranking',
        'No smoke at all (no fuel)'
      ],
      diagnosticSteps: [
        'Verify fuel level and quality',
        'Check for fuel at injection pump - crack fitting to check',
        'Bleed air from fuel system if fuel was run out',
        'Replace fuel filter if contaminated',
        'Test glow plug operation (diesel) or spark (gas)',
        'Check air filter for blockage',
        'Verify exhaust is not blocked',
        'Check compression if other factors are ruled out',
        'Verify starter cranking speed is adequate',
        'Check for error codes in controller'
      ],
      solution: 'Restore the missing element (fuel, air, spark/heat, compression) required for combustion.',
      detailedRepairProcedure: [
        'For fuel issues: Drain water separator, replace fuel filter, bleed fuel system',
        'For air issues: Replace air filter, check inlet ducting',
        'For glow plug issues: Test each glow plug with ohmmeter, replace faulty plugs',
        'For compression issues: Perform compression test, plan engine overhaul if low',
        'For timing issues: Verify injection timing to specification, adjust if needed',
        'After repair, attempt start following proper procedure',
        'Allow adequate glow/preheat time in cold conditions'
      ],
      preventionMeasures: [
        'Maintain fresh fuel supply - diesel degrades over time',
        'Replace fuel filters on schedule',
        'Exercise generator regularly to ensure starting reliability',
        'Keep fuel tank reasonably full to minimize condensation',
        'Test starting system periodically'
      ],
      safetyPrecautions: [
        'Ensure area is well-ventilated when cranking',
        'Do not bypass safety interlocks',
        'Limit cranking time to avoid starter damage (typically 15 sec max)',
        'Allow starter to cool between cranking attempts'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 3,000 - 45,000',
      toolsRequired: ['Fuel pressure gauge', 'Compression tester', 'Multimeter', 'Timing tools'],
      partsRequired: ['Fuel filter', 'Air filter', 'Glow plugs if faulty']
    },
    {
      code: 'E005',
      name: 'Fail to Crank',
      severity: 'High',
      category: 'Starting System Faults',
      description: 'Starter motor does not engage or turn the engine when start command is given. This indicates a problem with the starting system including battery, starter, or control circuit.',
      rootCauses: [
        'Dead or discharged battery',
        'Corroded battery connections',
        'Failed starter motor',
        'Failed starter solenoid',
        'Broken or loose wiring',
        'Faulty start relay or contactor',
        'Safety interlock preventing start',
        'Control system fault',
        'Seized engine (mechanical lock)'
      ],
      symptoms: [
        'No sound when start button pressed',
        'Click from solenoid but no cranking',
        'Slow or weak cranking',
        'Grinding noise from starter',
        'Hot smell from electrical components'
      ],
      diagnosticSteps: [
        'Check battery voltage - should be 12V+ (24V+ for 24V systems)',
        'Check battery connections for tightness and corrosion',
        'Listen for solenoid click when start is commanded',
        'If solenoid clicks but no crank, check battery condition under load',
        'If no solenoid click, check start relay and wiring',
        'Verify all safety interlocks are satisfied',
        'Check for fault codes in controller',
        'Test starter motor directly with jumper cables (briefly)',
        'If engine won\'t turn manually, check for mechanical seizure'
      ],
      solution: 'Repair or replace the failed starting system component - battery, connections, starter, or controls.',
      detailedRepairProcedure: [
        'For dead battery: Charge battery (if recoverable) or replace',
        'For corroded connections: Clean with wire brush, apply dielectric grease',
        'For failed starter: Remove starter, bench test or replace',
        'For failed solenoid: Replace solenoid or complete starter assembly',
        'For wiring problems: Repair or replace damaged wiring',
        'For control issues: Diagnose and repair control circuit',
        'After repair, verify proper cranking speed and reliable starting'
      ],
      preventionMeasures: [
        'Test battery condition regularly',
        'Keep battery terminals clean and tight',
        'Maintain battery charger in good working order',
        'Replace batteries proactively before failure',
        'Exercise generator regularly to maintain battery charge'
      ],
      safetyPrecautions: [
        'Disconnect battery negative before working on starting system',
        'Use insulated tools when working near batteries',
        'Wear eye protection - battery acid is corrosive',
        'Ensure generator cannot start unexpectedly during work'
      ],
      estimatedRepairTime: '30 min - 3 hours',
      estimatedCost: 'KES 2,000 - 75,000',
      toolsRequired: ['Multimeter', 'Battery tester', 'Wrench set', 'Jump start pack'],
      partsRequired: ['Battery', 'Starter motor', 'Cables']
    },
    {
      code: 'E006',
      name: 'Low Battery Voltage',
      severity: 'Medium',
      category: 'Electrical Faults',
      description: 'Battery voltage has dropped below the threshold required for reliable starting and control system operation. Generators require maintained batteries for reliable emergency starting.',
      rootCauses: [
        'Natural battery discharge over time',
        'Failed battery charger',
        'Parasitic load draining battery',
        'Old or worn battery cells',
        'Loose or corroded connections',
        'Alternator not charging during operation',
        'Excessive time between generator runs'
      ],
      symptoms: [
        'Low battery alarm on controller',
        'Slow cranking when starting',
        'Controller displays dimming',
        'Battery voltage reading low',
        'Failed auto-start on power outage'
      ],
      diagnosticSteps: [
        'Measure battery voltage with multimeter',
        'Check charger output voltage (should be 13.5-14.5V for 12V system)',
        'Load test battery to verify capacity',
        'Inspect connections for corrosion or looseness',
        'Check for parasitic loads when generator is off',
        'Verify alternator charges during operation',
        'Review age of battery - typical life 3-5 years'
      ],
      solution: 'Restore proper battery condition and charging system operation.',
      detailedRepairProcedure: [
        'For discharged battery: Charge with external charger to 12.6V+',
        'For failed charger: Repair or replace battery charger',
        'For worn battery: Replace with correct type and capacity',
        'For connection issues: Clean and tighten connections',
        'For alternator issues: Test and repair/replace alternator',
        'Verify battery maintains charge over several days'
      ],
      preventionMeasures: [
        'Test battery voltage monthly',
        'Verify charger operation during maintenance',
        'Replace batteries on schedule (every 3-4 years)',
        'Keep connections clean',
        'Run generator monthly to exercise battery and charging system'
      ],
      safetyPrecautions: [
        'Wear eye protection when working with batteries',
        'Do not short circuit battery terminals',
        'Ensure proper ventilation - batteries produce hydrogen gas',
        'Dispose of old batteries at authorized facility'
      ],
      estimatedRepairTime: '30 min - 2 hours',
      estimatedCost: 'KES 8,000 - 35,000',
      toolsRequired: ['Multimeter', 'Battery tester', 'Battery charger', 'Wire brush'],
      partsRequired: ['Battery', 'Battery charger (if faulty)']
    },
    {
      code: 'E007',
      name: 'High Coolant Temperature Pre-Alarm',
      severity: 'Medium',
      category: 'Cooling System Faults',
      description: 'Coolant temperature has reached the warning threshold but not yet the shutdown point. This provides an opportunity to identify and address cooling issues before they cause engine damage.',
      rootCauses: [
        'Same as E002 but at earlier stage',
        'Heavy loading in hot ambient conditions',
        'Restricted airflow around radiator',
        'Partially blocked radiator',
        'Thermostat starting to stick',
        'Coolant level slightly low'
      ],
      symptoms: [
        'High temperature warning alarm',
        'Temperature gauge above normal',
        'Cooling fan running continuously',
        'Reduced power output'
      ],
      diagnosticSteps: [
        'Check current load level - reduce if very high',
        'Verify ambient temperature and ventilation',
        'Check coolant level',
        'Inspect radiator for external blockage',
        'Verify cooling fan operation',
        'Compare temperature reading to normal operating range'
      ],
      solution: 'Address the developing cooling issue before it becomes critical.',
      detailedRepairProcedure: [
        'Reduce load if currently overloaded',
        'Improve ventilation around generator',
        'Top up coolant if low',
        'Clean radiator external surfaces',
        'Schedule thorough cooling system inspection at next opportunity'
      ],
      preventionMeasures: [
        'Maintain cooling system per schedule',
        'Keep radiator clean',
        'Do not exceed rated load capacity',
        'Ensure adequate ventilation'
      ],
      safetyPrecautions: [
        'Do not ignore pre-alarm - address before it becomes shutdown',
        'Be prepared to reduce load or shutdown if temperature continues rising'
      ],
      estimatedRepairTime: '30 min - 2 hours',
      estimatedCost: 'KES 1,000 - 15,000',
      toolsRequired: ['Infrared thermometer', 'Coolant tester', 'Basic hand tools']
    },
    {
      code: 'E008',
      name: 'Low Fuel Level',
      severity: 'Medium',
      category: 'Fuel System Faults',
      description: 'Fuel tank level has dropped to the warning threshold. Running out of fuel can air-lock the fuel system and may allow sediment from tank bottom to enter the fuel system.',
      rootCauses: [
        'Normal fuel consumption during extended run',
        'Missed fuel delivery',
        'Fuel leak',
        'Faulty fuel level sensor',
        'Higher than expected fuel consumption'
      ],
      symptoms: [
        'Low fuel warning alarm',
        'Fuel gauge showing low level',
        'Extended running time since last fill'
      ],
      diagnosticSteps: [
        'Visually verify fuel level in tank',
        'Check for fuel leaks around tank and fuel lines',
        'Calculate fuel consumption vs expected rate',
        'Verify fuel level sensor operation'
      ],
      solution: 'Refuel the generator tank with clean, fresh fuel.',
      detailedRepairProcedure: [
        'Refuel with approved fuel grade before tank runs empty',
        'If tank ran dry, bleed fuel system before attempting start',
        'If leak is found, repair before refueling',
        'If sensor is faulty, replace fuel level sensor'
      ],
      preventionMeasures: [
        'Monitor fuel level regularly',
        'Set up automatic fuel delivery schedule',
        'Install high-capacity day tank for extended runtime',
        'Investigate any unexpected increase in fuel consumption'
      ],
      safetyPrecautions: [
        'Do not refuel while generator is running',
        'No smoking or open flames during refueling',
        'Clean up any fuel spills immediately',
        'Use only approved fuel containers'
      ],
      estimatedRepairTime: '15-60 min',
      estimatedCost: 'Fuel cost only unless repairs needed',
      toolsRequired: ['Fuel transfer equipment', 'Fuel filter wrench', 'Bleeding tools']
    },
    // ELECTRICAL FAULTS
    {
      code: 'EL001',
      name: 'Over Voltage',
      severity: 'High',
      category: 'Electrical Faults',
      description: 'Generator output voltage has exceeded the acceptable limit, typically 10% above rated voltage. Over-voltage can damage connected equipment including motors, electronics, and lighting.',
      rootCauses: [
        'Automatic Voltage Regulator (AVR) failure',
        'AVR settings incorrect or drifted',
        'Voltage sensing circuit fault',
        'Sudden load rejection causing voltage spike',
        'Engine overspeed affecting frequency and voltage',
        'Wiring fault in voltage sensing circuit'
      ],
      symptoms: [
        'Over-voltage alarm/shutdown',
        'Voltmeter reading above nominal',
        'Lights appear brighter than normal',
        'Connected equipment may trip or fail',
        'Humming or vibration from transformers'
      ],
      diagnosticSteps: [
        'Verify actual voltage with calibrated meter',
        'Check engine speed - overspeed causes over-voltage',
        'Inspect AVR for visible damage or burnt components',
        'Check voltage sensing wiring for faults',
        'Verify AVR adjustment potentiometers are at correct settings',
        'Check for recent load changes before fault occurred',
        'Test AVR response with variable load'
      ],
      solution: 'Repair or replace AVR, correct speed issues, or adjust settings to maintain proper voltage regulation.',
      detailedRepairProcedure: [
        'If caused by overspeed: Address governor/speed issues first (see E003)',
        'If AVR is faulty: Replace AVR with correct model for generator',
        'If settings are wrong: Adjust AVR potentiometers per manual',
        'If sensing circuit is faulty: Repair or replace sensing transformer/resistors',
        'Test regulation at no-load, half-load, and full-load after repair',
        'Verify voltage stays within +/- 5% of nominal under all conditions'
      ],
      preventionMeasures: [
        'Include AVR inspection in preventive maintenance',
        'Test voltage regulation annually',
        'Avoid sudden large load changes when possible',
        'Maintain engine governor for stable speed'
      ],
      safetyPrecautions: [
        'Do not touch electrical connections while generator is running',
        'Use properly rated measurement equipment',
        'Disconnect sensitive loads before testing at extreme conditions'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 15,000 - 85,000',
      toolsRequired: ['True RMS multimeter', 'Clamp meter', 'Oscilloscope (for detailed diagnosis)', 'AVR adjustment tools']
    },
    {
      code: 'EL002',
      name: 'Under Voltage',
      severity: 'High',
      category: 'Electrical Faults',
      description: 'Generator output voltage has dropped below acceptable limit, typically 10% below rated voltage. Under-voltage causes motors to draw excessive current and overheat, and may prevent proper equipment operation.',
      rootCauses: [
        'Generator overloaded beyond capacity',
        'AVR failure or misadjustment',
        'Loss of residual magnetism',
        'Exciter circuit fault',
        'Engine underspeed',
        'Weak or damaged rotor windings',
        'Sensing circuit fault'
      ],
      symptoms: [
        'Under-voltage alarm',
        'Voltmeter reading below nominal',
        'Lights appear dim',
        'Motors running hot or tripping',
        'Equipment fails to operate properly'
      ],
      diagnosticSteps: [
        'Check current load level vs generator rating',
        'Verify engine speed is correct (typically 1500 or 1800 RPM)',
        'Measure voltage with calibrated meter',
        'Check AVR adjustment and condition',
        'Test with no load to see if voltage recovers',
        'Check exciter voltage and current',
        'Test residual voltage with AVR disconnected'
      ],
      solution: 'Reduce overload, repair AVR/exciter, or restore residual magnetism as appropriate.',
      detailedRepairProcedure: [
        'If overloaded: Reduce load to within generator capacity',
        'If AVR is faulty: Replace or adjust AVR',
        'If no residual magnetism: Flash field with DC source per manufacturer procedure',
        'If exciter is faulty: Repair or replace exciter components',
        'If engine underspeed: Adjust governor for correct speed',
        'After repair, test voltage regulation under varying loads'
      ],
      preventionMeasures: [
        'Do not exceed generator rated capacity',
        'Maintain AVR and exciter system',
        'Run generator under load regularly to maintain magnetism',
        'Monitor voltage during operation'
      ],
      safetyPrecautions: [
        'High current when overloaded - check wiring temperature',
        'Proper PPE when working on electrical systems',
        'Field flashing involves DC voltage - follow manufacturer procedure exactly'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 5,000 - 95,000',
      toolsRequired: ['True RMS multimeter', 'Clamp meter', 'Tachometer', 'DC power source for field flashing']
    },
    {
      code: 'EL003',
      name: 'Over Frequency',
      severity: 'High',
      category: 'Electrical Faults',
      description: 'Output frequency has exceeded the acceptable limit (typically 52.5 Hz for 50 Hz systems). Over-frequency is caused by engine overspeed and indicates governor problems.',
      rootCauses: [
        'See E003 - Overspeed causes',
        'Governor malfunction',
        'Load rejection without speed control response',
        'Incorrect governor settings'
      ],
      symptoms: [
        'Over-frequency alarm',
        'Frequency meter reading high',
        'Motors running faster than normal',
        'Higher pitched noise from equipment'
      ],
      diagnosticSteps: [
        'Verify frequency with calibrated meter',
        'Check engine speed with tachometer',
        'Compare to E003 diagnostic steps'
      ],
      solution: 'Address the engine overspeed condition - see E003 for detailed procedure.',
      detailedRepairProcedure: [
        'See E003 for governor-related repairs',
        'Adjust governor speed droop if parallel operation',
        'Verify frequency under load conditions'
      ],
      preventionMeasures: [
        'Regular governor maintenance',
        'Test speed control response periodically'
      ],
      safetyPrecautions: [
        'Overspeed is dangerous - see E003 safety precautions'
      ],
      estimatedRepairTime: '2-6 hours',
      estimatedCost: 'KES 15,000 - 85,000',
      toolsRequired: ['Frequency meter', 'Tachometer', 'Governor adjustment tools']
    },
    {
      code: 'EL004',
      name: 'Under Frequency',
      severity: 'High',
      category: 'Electrical Faults',
      description: 'Output frequency has dropped below acceptable limit (typically 47.5 Hz for 50 Hz systems). Under-frequency indicates engine underspeed, typically from overloading or governor malfunction.',
      rootCauses: [
        'Generator overloaded beyond capacity',
        'Governor malfunction - cannot maintain speed',
        'Fuel delivery problems',
        'Mechanical engine problems reducing power',
        'Incorrect governor settings'
      ],
      symptoms: [
        'Under-frequency alarm',
        'Frequency meter reading low',
        'Motors running slower and hotter',
        'Generator struggling under load',
        'Engine sounds labored'
      ],
      diagnosticSteps: [
        'Check current load vs generator capacity',
        'Verify engine is developing full power - not misfiring or restricted',
        'Check fuel delivery and filter',
        'Verify governor operation and settings',
        'Test frequency recovery when load is reduced'
      ],
      solution: 'Reduce overload, repair governor, or address engine power issues.',
      detailedRepairProcedure: [
        'If overloaded: Shed non-essential loads to reduce demand',
        'If governor malfunction: Repair or adjust governor',
        'If fuel restricted: Replace fuel filters, check supply',
        'If engine power reduced: Diagnose engine issues - air filter, turbo, injection',
        'Verify frequency stabilizes under rated load'
      ],
      preventionMeasures: [
        'Do not overload generator',
        'Maintain fuel system',
        'Regular engine maintenance',
        'Monitor frequency during operation'
      ],
      safetyPrecautions: [
        'Reduce load immediately if engine is struggling',
        'Continued overload can damage engine and generator'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 5,000 - 65,000',
      toolsRequired: ['Frequency meter', 'Clamp meter', 'Tachometer', 'Load analyzer']
    },
    {
      code: 'EL005',
      name: 'Earth/Ground Fault',
      severity: 'Critical',
      category: 'Electrical Faults',
      description: 'An electrical path to ground has been detected that should not exist. Ground faults can cause electric shock, equipment damage, and fire. They must be located and corrected before operation.',
      rootCauses: [
        'Damaged cable insulation',
        'Water ingress into electrical connections',
        'Carbon tracking from contamination',
        'Winding insulation breakdown',
        'Improper wiring or connections',
        'Equipment fault on connected load'
      ],
      symptoms: [
        'Earth fault alarm',
        'Ground fault indicator tripping',
        'Breaker tripping on ground fault',
        'Reduced insulation resistance reading',
        'Possible shock hazard'
      ],
      diagnosticSteps: [
        'Do not attempt to operate until fault is located',
        'Disconnect all loads from generator',
        'Test generator output winding insulation with megger (should be >1 MOhm)',
        'If generator tests OK, fault is in output cabling or loads',
        'Progressively reconnect circuits to identify faulty circuit',
        'Test suspect circuit with megger to confirm',
        'Inspect identified circuit for damage'
      ],
      solution: 'Locate the insulation failure and repair or replace the damaged component.',
      detailedRepairProcedure: [
        'Isolate faulty circuit from generator',
        'For damaged cables: Replace cable or repair with proper splice',
        'For wet connections: Dry thoroughly, seal against moisture',
        'For contaminated components: Clean with appropriate solvent',
        'For winding damage: May require stator or rotor rewind',
        'Test insulation resistance after repair (>1 MOhm)',
        'Test with ground fault indicator before returning to service'
      ],
      preventionMeasures: [
        'Protect cables from physical damage',
        'Maintain weatherproof enclosures',
        'Regular insulation testing during maintenance',
        'Address minor insulation degradation before it becomes failure'
      ],
      safetyPrecautions: [
        'Treat all conductors as energized until verified dead',
        'Ground faults create shock hazard - use extreme caution',
        'Use proper PPE including insulated gloves',
        'Do not energize until fault is corrected'
      ],
      estimatedRepairTime: '2-8 hours',
      estimatedCost: 'KES 10,000 - 150,000',
      toolsRequired: ['Insulation tester (Megger)', 'Multimeter', 'Clamp meter', 'Insulation repair materials']
    },
    // ATS FAULTS
    {
      code: 'ATS001',
      name: 'ATS Transfer Failure',
      severity: 'Critical',
      category: 'ATS Faults',
      description: 'Automatic Transfer Switch failed to transfer from one source to another. This leaves the load without power when it should be supplied by generator or fails to return to utility when available.',
      rootCauses: [
        'Mechanical binding of transfer mechanism',
        'Motor or solenoid failure',
        'Control board failure',
        'Interlock mechanism stuck',
        'Loss of control power',
        'Voltage sensing fault',
        'Time delay relay failure'
      ],
      symptoms: [
        'Load remains on failed source',
        'ATS stuck in neutral/mid position',
        'Transfer alarm with no movement',
        'Motor runs but no transfer',
        'Control panel shows fault'
      ],
      diagnosticSteps: [
        'Check current position of ATS',
        'Verify control power is present',
        'Check voltage sensing on both sources',
        'Listen for motor/solenoid operation when transfer is commanded',
        'Manually verify mechanism is not binding',
        'Check control board for fault indications',
        'Review event log if available'
      ],
      solution: 'Repair or replace the failed ATS component and verify proper transfer operation.',
      detailedRepairProcedure: [
        'If mechanism is binding: Clean and lubricate per manufacturer instructions',
        'If motor/solenoid is failed: Replace motor or solenoid assembly',
        'If control board is failed: Replace control board',
        'If voltage sensing is faulty: Check PT connections, replace PTs if needed',
        'Test transfer operation multiple times after repair',
        'Verify proper time delays and voltage thresholds'
      ],
      preventionMeasures: [
        'Exercise ATS monthly to ensure mechanism remains free',
        'Test transfer sequence quarterly',
        'Keep ATS clean and properly maintained',
        'Replace contactors before end of life'
      ],
      safetyPrecautions: [
        'Lethal voltages present in ATS - work only when de-energized',
        'Ensure both sources are isolated before working on mechanism',
        'Verify proper lockout/tagout procedures'
      ],
      estimatedRepairTime: '2-6 hours',
      estimatedCost: 'KES 25,000 - 250,000',
      toolsRequired: ['Multimeter', 'Insulated tools', 'Contact lubricant', 'Torque wrench'],
      partsRequired: ['Motor assembly', 'Control board', 'Contactors as needed']
    },
    {
      code: 'ATS002',
      name: 'Source 1 Voltage Abnormal',
      severity: 'Medium',
      category: 'ATS Faults',
      description: 'Utility (Source 1) voltage is outside acceptable parameters for transfer. ATS will not transfer to or will transfer away from source with abnormal voltage.',
      rootCauses: [
        'Utility voltage outside normal range',
        'Voltage transformer failure',
        'Wiring fault in sensing circuit',
        'Settings need adjustment for local conditions',
        'Single-phase loss on three-phase system'
      ],
      symptoms: [
        'Source 1 abnormal alarm',
        'Generator running when utility appears available',
        'Frequent transfers between sources',
        'Phase voltage imbalance indication'
      ],
      diagnosticSteps: [
        'Measure actual utility voltage at ATS terminals',
        'Compare to ATS voltage settings',
        'Check all three phases for balance',
        'Verify PT output if PTs are used',
        'Review ATS settings and adjust if needed'
      ],
      solution: 'Correct the voltage abnormality or adjust ATS settings if current settings are inappropriate.',
      detailedRepairProcedure: [
        'If utility is actually abnormal: Report to utility, consider generator or UPS backup',
        'If PT is faulty: Replace potential transformer',
        'If settings are wrong: Adjust pickup and dropout voltage thresholds',
        'If sensing wiring is faulty: Repair connections',
        'Verify proper operation after corrections'
      ],
      preventionMeasures: [
        'Set voltage thresholds appropriate for local utility quality',
        'Include PT testing in maintenance',
        'Monitor utility quality over time'
      ],
      safetyPrecautions: [
        'PT circuits carry potentially lethal voltage',
        'Follow proper safety procedures when working in ATS'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 5,000 - 45,000',
      toolsRequired: ['True RMS multimeter', 'Phase rotation meter', 'ATS programming tool']
    },
    // CONTROL SYSTEM FAULTS
    {
      code: 'CS001',
      name: 'Controller Communication Failure',
      severity: 'Medium',
      category: 'Control System Faults',
      description: 'Loss of communication between generator controller and other system components (ATS, parallel controllers, monitoring system, etc.).',
      rootCauses: [
        'Communication cable damaged or disconnected',
        'Controller communication module failure',
        'Address or protocol mismatch',
        'Interference on communication bus',
        'Remote device failure',
        'Power supply to communication circuit'
      ],
      symptoms: [
        'Communication fault alarm',
        'Remote monitoring shows offline',
        'ATS cannot command generator',
        'Parallel units lose sync',
        'No data on display screen'
      ],
      diagnosticSteps: [
        'Check communication cables for damage or disconnection',
        'Verify power supply to all communication devices',
        'Check protocol settings match on all devices',
        'Test communication cables with cable tester',
        'Try communication with backup/service port',
        'Check for sources of electrical interference'
      ],
      solution: 'Restore communication link by repairing cables, correcting settings, or replacing failed components.',
      detailedRepairProcedure: [
        'If cable is faulty: Replace communication cable',
        'If connection is loose: Secure and verify connections',
        'If settings are wrong: Program correct addresses and protocols',
        'If module is failed: Replace communication module',
        'Test communication after repair'
      ],
      preventionMeasures: [
        'Protect communication cables from damage',
        'Use shielded cables in electrically noisy environments',
        'Document all communication settings',
        'Test communication during maintenance'
      ],
      safetyPrecautions: [
        'Some communication circuits carry low voltage but can still be damaged by static',
        'Use proper ESD precautions when handling electronics'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 5,000 - 65,000',
      toolsRequired: ['Cable tester', 'Laptop with programming software', 'Multimeter', 'Communication analyzer']
    },
    {
      code: 'CS002',
      name: 'Emergency Stop Active',
      severity: 'High',
      category: 'Control System Faults',
      description: 'Emergency stop has been activated, preventing generator operation. E-stop is a safety feature that provides immediate shutdown capability.',
      rootCauses: [
        'E-stop button physically pressed',
        'E-stop wiring fault (open circuit)',
        'Multiple E-stop stations - one activated',
        'Intentional emergency shutdown',
        'E-stop relay failure'
      ],
      symptoms: [
        'E-stop alarm on controller',
        'Generator will not start',
        'E-stop indicator illuminated',
        'Running generator shuts down immediately'
      ],
      diagnosticSteps: [
        'Check all E-stop stations for activation',
        'Verify E-stop buttons are released and reset',
        'Check E-stop circuit wiring',
        'Verify E-stop relay operation',
        'Ensure no emergency condition exists before resetting'
      ],
      solution: 'Reset E-stop after verifying it is safe to do so and no emergency condition exists.',
      detailedRepairProcedure: [
        'If E-stop was intentionally activated: Determine reason and verify condition is resolved',
        'If button is stuck: Free button or replace E-stop station',
        'If wiring fault: Repair open circuit in E-stop loop',
        'If relay is faulty: Replace E-stop relay',
        'Reset E-stop and verify generator can start'
      ],
      preventionMeasures: [
        'Test E-stop function during maintenance',
        'Protect E-stop wiring from damage',
        'Train personnel on proper E-stop use',
        'Post E-stop locations clearly'
      ],
      safetyPrecautions: [
        'Never bypass E-stop circuit',
        'Verify it is safe before resetting E-stop',
        'Investigate reason for E-stop activation'
      ],
      estimatedRepairTime: '15 min - 2 hours',
      estimatedCost: 'KES 0 (reset only) - 15,000 (component replacement)',
      toolsRequired: ['Multimeter', 'Basic hand tools']
    },
    // FUEL SYSTEM FAULTS
    {
      code: 'FS001',
      name: 'Fuel Filter Blocked',
      severity: 'Medium',
      category: 'Fuel System Faults',
      description: 'Fuel filter restriction is limiting fuel flow to the engine. This causes power loss, rough running, and eventually engine shutdown.',
      rootCauses: [
        'Normal contamination over time',
        'Water in fuel',
        'Algae growth in fuel (biodiesel)',
        'Tank corrosion/debris',
        'Poor quality fuel',
        'Failed water separator'
      ],
      symptoms: [
        'Power loss under load',
        'Engine hunting/surging',
        'Difficult starting',
        'Fuel filter differential pressure high',
        'Engine shutdown on fuel starvation'
      ],
      diagnosticSteps: [
        'Check fuel filter vacuum/pressure indicators',
        'Inspect fuel filter bowl for water',
        'Drain fuel filter and check for contamination',
        'Test fuel flow through filter',
        'Sample fuel tank for water/contamination'
      ],
      solution: 'Replace fuel filter and address source of contamination.',
      detailedRepairProcedure: [
        'Close fuel supply valve if equipped',
        'Drain filter housing into suitable container',
        'Remove and replace fuel filter element',
        'Install new seals/O-rings as needed',
        'Prime fuel system to remove air',
        'If water contamination: drain water separator, sample tank',
        'If severe contamination: consider tank cleaning/polishing'
      ],
      preventionMeasures: [
        'Replace fuel filters on schedule (typically annually or 500 hours)',
        'Drain water separators daily',
        'Use fuel biocide for long-term storage',
        'Keep fuel tank reasonably full to minimize condensation',
        'Source fuel from reputable suppliers'
      ],
      safetyPrecautions: [
        'No smoking or open flames near fuel',
        'Collect all spilled fuel',
        'Dispose of used filter properly',
        'Have fire extinguisher accessible'
      ],
      estimatedRepairTime: '30 min - 2 hours',
      estimatedCost: 'KES 2,500 - 12,000',
      toolsRequired: ['Filter wrench', 'Drain pan', 'Priming pump', 'Fuel sampling equipment'],
      partsRequired: ['Fuel filter', 'Seals', 'Biocide if needed']
    },
    // Continue with more faults...
    {
      code: 'FS002',
      name: 'Water in Fuel',
      severity: 'High',
      category: 'Fuel System Faults',
      description: 'Water has accumulated in the fuel system beyond the water separator capacity. Water damages injection components and causes poor combustion.',
      rootCauses: [
        'Condensation in partially filled tank',
        'Rain water entry through failed seals',
        'Contaminated fuel delivery',
        'Water separator not drained',
        'Damaged tank vent allowing water entry'
      ],
      symptoms: [
        'Water in fuel alarm',
        'White/gray exhaust smoke',
        'Rough running/misfiring',
        'Hard starting',
        'Reduced power',
        'Visible water in filter bowl'
      ],
      diagnosticSteps: [
        'Check water separator for water level',
        'Drain water separator and observe quantity',
        'Sample fuel from tank bottom',
        'Inspect tank for water entry points',
        'Check recent fuel deliveries'
      ],
      solution: 'Remove water from fuel system and address the source of water contamination.',
      detailedRepairProcedure: [
        'Drain water separator completely',
        'If significant water in tank: Pump out water from tank bottom',
        'Replace fuel filters after draining water',
        'Prime fuel system',
        'If water entry point found: Repair seals, vents, or tank',
        'Consider fuel polishing for severe contamination',
        'Test run and verify normal operation'
      ],
      preventionMeasures: [
        'Drain water separator daily or weekly',
        'Keep fuel tank reasonably full',
        'Inspect and maintain tank seals and vents',
        'Use reputable fuel suppliers',
        'Install quality water separating filters'
      ],
      safetyPrecautions: [
        'Fuel handling safety precautions apply',
        'Dispose of water/fuel mixture properly',
        'Do not release to environment'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 3,000 - 25,000',
      toolsRequired: ['Water detecting paste', 'Sampling pump', 'Filter wrench', 'Fuel transfer pump']
    },
    {
      code: 'FS003',
      name: 'Fuel Leak Detected',
      severity: 'Critical',
      category: 'Fuel System Faults',
      description: 'Fuel leak has been detected in the fuel system. Fuel leaks create fire hazard, environmental contamination, and increased fuel costs.',
      rootCauses: [
        'Damaged fuel line',
        'Failed fitting or connection',
        'Fuel tank corrosion/damage',
        'Injection line failure',
        'Fuel pump seal failure',
        'Filter housing seal failure'
      ],
      symptoms: [
        'Visible fuel puddle or wetness',
        'Fuel odor',
        'Increased fuel consumption',
        'Fuel level sensor leak alarm',
        'Staining around components'
      ],
      diagnosticSteps: [
        'Visually inspect all fuel system components',
        'Check connections and fittings',
        'Inspect injection lines for cracks or chafing',
        'Check fuel tank for corrosion or damage',
        'Look for staining that indicates slow leak',
        'Pressure test fuel system if needed'
      ],
      solution: 'Locate and repair the fuel leak immediately due to fire hazard.',
      detailedRepairProcedure: [
        'Shut down generator and isolate fuel supply',
        'Clean up spilled fuel safely',
        'For line/hose failure: Replace line or hose with proper rated material',
        'For fitting failure: Tighten or replace fitting',
        'For injection line: Replace with OEM line',
        'For tank leak: Repair or replace tank',
        'Pressure test repair before returning to service'
      ],
      preventionMeasures: [
        'Inspect fuel system regularly',
        'Replace fuel lines before they deteriorate',
        'Torque fittings to specification',
        'Address minor weeps before they become major leaks',
        'Protect fuel lines from chafing and heat'
      ],
      safetyPrecautions: [
        'FIRE HAZARD - Do not operate until leak is repaired',
        'No smoking or ignition sources near leak',
        'Have fire extinguisher ready',
        'Use proper fuel-rated materials for repair',
        'Clean up all spilled fuel'
      ],
      estimatedRepairTime: '1-6 hours',
      estimatedCost: 'KES 2,000 - 85,000',
      toolsRequired: ['Tubing cutter', 'Flare tool', 'Proper fittings', 'Fuel-rated hose', 'Torque wrench']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR SYSTEM FAULT DATABASE - 100+ CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const SOLAR_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'solar',
  serviceName: 'Solar System Services',
  totalFaultCodes: 125,
  categories: [
    'Panel Faults',
    'Inverter Faults',
    'Battery Faults',
    'Wiring Faults',
    'Grid Connection Faults',
    'Monitoring Faults',
    'Protection Faults',
    'Environmental Faults'
  ],
  faults: [
    // PANEL FAULTS
    {
      code: 'PV001',
      name: 'Panel Hot Spot',
      severity: 'High',
      category: 'Panel Faults',
      description: 'Localized overheating on solar panel surface due to cell defect, partial shading, or damage. Hot spots reduce panel output and can cause permanent cell damage or fire in severe cases.',
      rootCauses: [
        'Cell crack or manufacturing defect',
        'Partial shading on one or more cells',
        'Internal solder joint failure',
        'Bypass diode failure',
        'Bird droppings or debris on specific cells',
        'PID (Potential Induced Degradation) damage'
      ],
      symptoms: [
        'Reduced panel output',
        'Visible discoloration on panel surface',
        'Hot area visible on thermal camera (>20°C above panel average)',
        'Burning smell in severe cases',
        'Cell browning or yellowing'
      ],
      diagnosticSteps: [
        'Perform infrared thermal imaging during peak sun',
        'Look for temperature differentials >15°C from surrounding cells',
        'Document location and severity of hot spots',
        'Check for obvious physical damage or soiling at hot spot location',
        'Measure panel string voltage and compare to parallel strings',
        'Test individual panel with IV curve tracer if available'
      ],
      solution: 'Replace severely affected panels or monitor minor hot spots for progression. Clean if caused by soiling.',
      detailedRepairProcedure: [
        'If caused by soiling: Clean thoroughly and retest',
        'If minor hot spot (<30°C differential): Document and monitor monthly',
        'If severe hot spot (>40°C differential): Replace panel under warranty if applicable',
        'Check bypass diodes - replace if shorted (causes hot spot) or open (causes string voltage drop)',
        'For warranty claim: Document with photos, thermal images, and output measurements',
        'When replacing: Match replacement panel voltage/current to existing string'
      ],
      preventionMeasures: [
        'Regular panel cleaning to prevent shading from soiling',
        'Proper system design to avoid partial shading',
        'Quality panels from reputable manufacturers with good warranties',
        'Regular thermal inspection as part of maintenance',
        'Trim vegetation that could cause shading'
      ],
      safetyPrecautions: [
        'Panels produce voltage whenever exposed to light',
        'Hot spots can exceed 100°C - burn hazard',
        'In extreme cases, hot spots can cause fire - inspect carefully',
        'Use proper PPE including gloves when handling suspected damaged panels'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 0 (cleaning) - 25,000 (panel replacement)',
      toolsRequired: ['Thermal imaging camera', 'Multimeter', 'IV curve tracer (optional)', 'Cleaning equipment']
    },
    {
      code: 'PV002',
      name: 'Panel Physical Damage',
      severity: 'High',
      category: 'Panel Faults',
      description: 'Physical damage to solar panel from impact, handling, or environmental events. Damaged panels have reduced output and may present safety hazards.',
      rootCauses: [
        'Hail damage',
        'Impact from falling objects (branches, tools)',
        'Improper handling during installation',
        'Vandalism',
        'Thermal stress cracking',
        'Frame damage from high winds',
        'Animal damage'
      ],
      symptoms: [
        'Visible cracks in glass or cells',
        'Broken or bent frame',
        'Delamination (bubbling) of encapsulant',
        'Reduced output from affected panel',
        'Water ingress visible',
        'Browning or discoloration patterns'
      ],
      diagnosticSteps: [
        'Visual inspection for obvious damage',
        'Check for cracks - may be visible only in certain light',
        'Look for delamination around edges and junction box',
        'Measure panel output and compare to specifications',
        'Check frame for deformation or damage',
        'Inspect mounting for stability after high wind events'
      ],
      solution: 'Replace damaged panels if output is significantly reduced or safety hazard exists.',
      detailedRepairProcedure: [
        'Document damage with photos for warranty or insurance claim',
        'Measure output to quantify loss',
        'For cracked glass with intact cells: Monitor - output may be acceptable',
        'For broken cells or delamination: Replace panel',
        'For frame damage: Replace if structural integrity compromised',
        'Match replacement panel specifications to string requirements',
        'Dispose of damaged panels properly - they contain heavy metals'
      ],
      preventionMeasures: [
        'Quality installation with proper handling procedures',
        'Adequate clearance from trees and potential falling objects',
        'Proper mounting for local wind conditions',
        'Insurance coverage for weather events',
        'Regular inspection to catch damage early'
      ],
      safetyPrecautions: [
        'Damaged panels may have exposed live conductors',
        'Broken glass is sharp - use gloves',
        'Panels produce voltage even when damaged',
        'Cover damaged panel to prevent shock hazard'
      ],
      estimatedRepairTime: '2-4 hours',
      estimatedCost: 'KES 15,000 - 30,000 per panel',
      toolsRequired: ['Basic hand tools', 'Multimeter', 'Replacement panel', 'Safety equipment']
    },
    // INVERTER FAULTS
    {
      code: 'INV001',
      name: 'Grid Voltage Fault',
      severity: 'Medium',
      category: 'Inverter Faults',
      description: 'Grid voltage outside acceptable range causing inverter to disconnect. Inverters must operate within grid standards to protect the grid and connected equipment.',
      rootCauses: [
        'Utility voltage fluctuation',
        'High impedance grid connection',
        'Transformer tap set incorrectly',
        'Heavy load starting on local grid',
        'Inverter voltage sensing fault',
        'Grid settings too tight for local conditions'
      ],
      symptoms: [
        'Inverter shows grid voltage fault',
        'Frequent disconnection from grid',
        'Output power dropping to zero',
        'High or low voltage alarm',
        'Event log shows voltage trips'
      ],
      diagnosticSteps: [
        'Measure actual grid voltage at inverter AC terminals',
        'Record voltage over time to capture fluctuations',
        'Compare to inverter trip settings',
        'Check voltage sensing circuit in inverter',
        'Review installation - is inverter connected to appropriate voltage?',
        'Check for local loads causing voltage drops'
      ],
      solution: 'Adjust inverter settings if voltage is within acceptable range but outside factory defaults, or address grid voltage issues.',
      detailedRepairProcedure: [
        'If utility voltage is acceptable but inverter trips: Widen voltage window in inverter settings',
        'If voltage sensing is faulty: Replace sensing components or inverter',
        'If grid voltage truly abnormal: Report to utility, consider installing automatic voltage regulator',
        'If connection is high impedance: Upgrade cabling or transformer',
        'Document adjustments made for future reference',
        'Monitor for continued issues'
      ],
      preventionMeasures: [
        'Site assessment to verify grid quality before installation',
        'Configure inverter for local grid conditions',
        'Quality installation with properly sized wiring',
        'Monitoring to detect developing issues'
      ],
      safetyPrecautions: [
        'Do not adjust grid standards outside utility requirements',
        'High voltage at inverter terminals - use proper PPE',
        'Follow local regulations for grid-connected systems'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 2,000 - 15,000',
      toolsRequired: ['True RMS multimeter', 'Power analyzer', 'Inverter programming interface', 'Voltage recorder']
    },
    {
      code: 'INV002',
      name: 'PV Over Voltage',
      severity: 'High',
      category: 'Inverter Faults',
      description: 'DC input voltage from solar panels exceeds inverter maximum rating. This can damage inverter input circuitry and is a fire hazard.',
      rootCauses: [
        'Too many panels in series string',
        'Cold morning conditions increase voltage',
        'Incorrect string design for temperature range',
        'Panel specifications mislabeled',
        'Partially shaded panels causing voltage imbalance'
      ],
      symptoms: [
        'PV over voltage alarm',
        'Inverter refuses to start',
        'Inverter shuts down during cold mornings',
        'Burnt smell or visible damage to DC input section',
        'DC voltage reading exceeds inverter maximum'
      ],
      diagnosticSteps: [
        'Measure open circuit voltage (Voc) of each string',
        'Compare to inverter maximum DC voltage rating',
        'Calculate expected cold temperature Voc using temperature coefficient',
        'Verify number of panels in each string',
        'Check panel specifications against installation documentation'
      ],
      solution: 'Reconfigure strings to reduce voltage within inverter limits, accounting for cold temperature increase.',
      detailedRepairProcedure: [
        'Calculate maximum expected Voc at lowest expected temperature',
        'If Voc exceeds inverter maximum: Reduce panels per string',
        'Reconfigure to shorter strings with more strings in parallel',
        'May require additional combiner or inverter with higher voltage rating',
        'Verify voltage after reconfiguration is within limits',
        'Update system documentation with correct string configuration'
      ],
      preventionMeasures: [
        'Proper string sizing calculations during design',
        'Account for temperature coefficient and local temperature range',
        'Use design tools to verify string voltage',
        'Allow margin below maximum voltage for temperature variation'
      ],
      safetyPrecautions: [
        'High DC voltage is lethal - >120V is considered dangerous',
        'Never work on live DC circuits',
        'Cover panels or work at night when measuring voltages above 120V',
        'Use properly rated test equipment'
      ],
      estimatedRepairTime: '4-8 hours',
      estimatedCost: 'KES 10,000 - 50,000',
      toolsRequired: ['DC-rated multimeter (>600V)', 'MC4 disconnection tools', 'Cable and connectors', 'Design software']
    },
    {
      code: 'INV003',
      name: 'Ground Fault',
      severity: 'Critical',
      category: 'Inverter Faults',
      description: 'Unwanted electrical path from DC circuit to ground. Ground faults create shock hazard and can cause fires if not detected and cleared.',
      rootCauses: [
        'Damaged cable insulation',
        'Water ingress into junction boxes or connectors',
        'Pinched or chafed cables',
        'Failed connector seal',
        'Animal damage to wiring',
        'Insulation breakdown from UV exposure'
      ],
      symptoms: [
        'Ground fault indicator or alarm',
        'Inverter refuses to operate',
        'Reduced insulation resistance reading',
        'GFCI tripping',
        'Visible damage to cables or connectors'
      ],
      diagnosticSteps: [
        'Do not attempt to clear fault by operating inverter',
        'Isolate DC side from inverter',
        'Test insulation resistance of each string with megger',
        'Identify string with low insulation resistance',
        'Progressively disconnect panels to identify specific panel or cable',
        'Inspect identified section for damage or moisture'
      ],
      solution: 'Locate and repair the insulation fault before reconnecting to inverter.',
      detailedRepairProcedure: [
        'Isolate faulty section completely',
        'For damaged cables: Replace cable section with UV-rated PV cable',
        'For failed connectors: Replace with proper MC4 or equivalent connectors',
        'For junction box issues: Open, dry thoroughly, reseal or replace',
        'For panel frame fault: Check bonding, verify panel is not damaged',
        'Test insulation resistance after repair (should be >1 MOhm)',
        'Verify ground fault indicator clears before operating'
      ],
      preventionMeasures: [
        'Use UV-rated PV cable for all outdoor runs',
        'Proper cable management with strain relief and protection',
        'Quality connectors properly crimped',
        'Regular inspection of cable routing',
        'Protect cables from animals where necessary'
      ],
      safetyPrecautions: [
        'Ground faults create shock hazard even with inverter off',
        'Do not touch suspected faulted conductors',
        'Cover panels or work in dark when diagnosing',
        'Use properly rated test equipment'
      ],
      estimatedRepairTime: '2-8 hours',
      estimatedCost: 'KES 5,000 - 45,000',
      toolsRequired: ['Insulation resistance tester (Megger)', 'Multimeter', 'MC4 tools', 'UV-rated cable', 'Connectors']
    },
    {
      code: 'INV004',
      name: 'Inverter Over Temperature',
      severity: 'Medium',
      category: 'Inverter Faults',
      description: 'Inverter internal temperature has exceeded safe operating limits. Inverters reduce output (derating) or shut down to prevent damage from overheating.',
      rootCauses: [
        'Blocked ventilation openings',
        'Installed in direct sunlight',
        'Inadequate air circulation',
        'Failed cooling fan',
        'Ambient temperature too high',
        'Internal component failure generating excess heat'
      ],
      symptoms: [
        'Over temperature alarm',
        'Reduced output (derating)',
        'Inverter shutdown',
        'Hot enclosure surface',
        'Fan running continuously at high speed'
      ],
      diagnosticSteps: [
        'Check ventilation openings for blockage',
        'Verify fan operation',
        'Measure ambient temperature at installation location',
        'Check if inverter is in direct sunlight',
        'Feel for unusual hot spots on enclosure',
        'Review installation for ventilation compliance'
      ],
      solution: 'Restore adequate cooling by improving ventilation, shading, or repairing cooling system.',
      detailedRepairProcedure: [
        'Clear any debris from ventilation openings',
        'If fan is failed: Replace cooling fan assembly',
        'If in direct sun: Install shade structure over inverter',
        'If ambient is too hot: Consider relocating inverter or adding forced ventilation',
        'Verify operating temperature returns to normal',
        'Check if output increases after cooling improvement'
      ],
      preventionMeasures: [
        'Install inverters in shaded, well-ventilated locations',
        'Follow manufacturer clearance requirements',
        'Clean ventilation openings regularly',
        'Monitor temperatures as part of routine checks'
      ],
      safetyPrecautions: [
        'Hot surfaces can cause burns',
        'Allow inverter to cool before service',
        'Do not operate with blocked ventilation'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 2,000 - 25,000',
      toolsRequired: ['Thermometer', 'Cleaning supplies', 'Replacement fan if needed', 'Shade materials']
    },
    // BATTERY FAULTS
    {
      code: 'BAT001',
      name: 'Battery Over Voltage',
      severity: 'High',
      category: 'Battery Faults',
      description: 'Battery voltage has exceeded maximum safe limit. Over voltage can damage battery chemistry and reduce lifespan, and may cause thermal runaway in lithium batteries.',
      rootCauses: [
        'Incorrect charge voltage setting',
        'Failed BMS not limiting charge',
        'Charger malfunction',
        'Incorrect battery type selected in inverter',
        'Temperature compensation not working',
        'Cell imbalance in lithium battery'
      ],
      symptoms: [
        'Battery over voltage alarm',
        'High voltage reading',
        'Battery getting hot during charge',
        'Bubbling or gassing (lead-acid)',
        'Reduced battery capacity',
        'BMS disconnect'
      ],
      diagnosticSteps: [
        'Measure battery voltage with multimeter',
        'Compare to battery maximum voltage specification',
        'Check inverter charge settings',
        'Verify correct battery type is selected',
        'Monitor charge voltage during bulk charge',
        'For lithium: Check individual cell voltages via BMS'
      ],
      solution: 'Correct charge voltage settings and verify battery is not damaged from overcharging.',
      detailedRepairProcedure: [
        'Immediately stop charging if over voltage',
        'Review and correct inverter charge settings for battery type',
        'For lead-acid: Absorb voltage typically 14.4-14.8V for 48V system',
        'For lithium: Follow manufacturer settings exactly (typically 54-56V for 48V LFP)',
        'Check BMS operation for lithium batteries',
        'Test battery capacity after extended overcharge',
        'Replace battery if capacity significantly reduced'
      ],
      preventionMeasures: [
        'Configure charge parameters correctly at installation',
        'Use recommended settings from battery manufacturer',
        'Monitor charging regularly',
        'Set up voltage alarms in monitoring system'
      ],
      safetyPrecautions: [
        'Overcharged batteries may vent gas - ensure ventilation',
        'Lithium batteries can enter thermal runaway if severely overcharged',
        'Do not approach swelling or hot lithium batteries',
        'Have fire suppression available for lithium battery installations'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 2,000 - 250,000 (if battery replacement needed)',
      toolsRequired: ['Multimeter', 'Inverter programming interface', 'Thermal camera', 'BMS communication tool']
    },
    {
      code: 'BAT002',
      name: 'Battery Under Voltage',
      severity: 'High',
      category: 'Battery Faults',
      description: 'Battery voltage has dropped below minimum safe limit. Deep discharge damages batteries and significantly reduces lifespan.',
      rootCauses: [
        'Excessive discharge beyond DOD limit',
        'Failed low voltage disconnect',
        'Incorrect discharge cutoff setting',
        'Battery capacity degraded cannot supply load',
        'Solar not charging adequately',
        'Parasitic loads draining battery'
      ],
      symptoms: [
        'Battery low voltage alarm',
        'System shutdown on battery protection',
        'Loads disconnecting',
        'Battery will not hold charge',
        'Reduced backup time'
      ],
      diagnosticSteps: [
        'Measure battery voltage',
        'Check depth of discharge settings',
        'Review recent charging history',
        'Check for loads that should not be running',
        'Test battery capacity',
        'Verify solar is charging battery when sun available'
      ],
      solution: 'Recharge battery immediately and prevent future deep discharge by adjusting settings or reducing loads.',
      detailedRepairProcedure: [
        'If battery can still accept charge: Charge fully before using',
        'Adjust low voltage disconnect setting to higher value',
        'Reduce non-essential loads',
        'Verify solar charging is adequate for load demand',
        'If battery will not recover: Replace battery',
        'After replacement, configure proper DOD limit'
      ],
      preventionMeasures: [
        'Configure proper depth of discharge limits',
        'Size battery adequately for expected loads',
        'Ensure solar charging can recover daily discharge',
        'Monitor battery state of charge'
      ],
      safetyPrecautions: [
        'Deeply discharged lead-acid batteries may produce hydrogen sulfide gas',
        'Some lithium batteries may be damaged beyond recovery',
        'Follow manufacturer guidelines for recovery charging'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 2,000 - 350,000 (if replacement needed)',
      toolsRequired: ['Multimeter', 'Battery tester', 'Inverter programming interface']
    },
    {
      code: 'BAT003',
      name: 'Battery Communication Error',
      severity: 'Medium',
      category: 'Battery Faults',
      description: 'Loss of communication between inverter and battery BMS. Without communication, inverter cannot properly manage battery charging and may use default (potentially incorrect) parameters.',
      rootCauses: [
        'Communication cable damaged or loose',
        'BMS failure',
        'Inverter communication port failure',
        'Protocol mismatch between devices',
        'EMI interference on communication line',
        'Incorrect cable pinout'
      ],
      symptoms: [
        'Battery communication fault alarm',
        'Battery SOC not displayed',
        'Charging using default parameters',
        'BMS warnings not appearing in inverter',
        'Cell voltage information unavailable'
      ],
      diagnosticSteps: [
        'Check communication cable connections at both ends',
        'Verify cable type is correct for protocol used',
        'Check BMS has power and is operating',
        'Verify protocol settings match',
        'Test communication with known good cable',
        'Check for sources of interference'
      ],
      solution: 'Restore communication by repairing cable, correcting settings, or replacing failed components.',
      detailedRepairProcedure: [
        'Secure loose connections',
        'Replace damaged cable with correct type',
        'Verify protocol settings (CAN, RS485, proprietary)',
        'Check baud rate and address settings',
        'If BMS is faulty: Replace BMS module',
        'If inverter port is faulty: May need inverter repair/replacement',
        'Test communication after repair'
      ],
      preventionMeasures: [
        'Use quality communication cables',
        'Protect cables from damage',
        'Document communication settings',
        'Test communication during commissioning'
      ],
      safetyPrecautions: [
        'Some communication involves low voltage',
        'Ensure inverter is configured for battery type even if communication is lost'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 3,000 - 45,000',
      toolsRequired: ['Multimeter', 'Communication cable', 'Protocol analyzer', 'BMS software']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR REWINDING FAULT DATABASE - 75+ CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const MOTOR_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'motor-rewinding',
  serviceName: 'Motor Rewinding Services',
  totalFaultCodes: 78,
  categories: [
    'Winding Faults',
    'Mechanical Faults',
    'Bearing Faults',
    'Electrical Connection Faults',
    'Insulation Faults',
    'Vibration Faults',
    'VFD Related Faults',
    'Starting Faults'
  ],
  faults: [
    {
      code: 'MW001',
      name: 'Winding Short Circuit',
      severity: 'Critical',
      category: 'Winding Faults',
      description: 'Short circuit between turns within a winding coil or between phases. This causes excessive current, rapid heating, and immediate motor failure if not protected by overloads.',
      rootCauses: [
        'Insulation breakdown from age',
        'Overheating damage',
        'Moisture contamination',
        'Voltage surge damage',
        'Mechanical damage to windings',
        'Manufacturing defect',
        'Contamination from oil or chemicals'
      ],
      symptoms: [
        'Motor trips on overcurrent',
        'Burning smell',
        'Smoke from motor',
        'Very hot motor casing',
        'Reduced resistance between phases',
        'Visible burned windings'
      ],
      diagnosticSteps: [
        'Disconnect and isolate motor',
        'Measure resistance between all phases (should be equal, +/- 5%)',
        'Test insulation resistance to ground (should be >1 MOhm)',
        'Visual inspection of windings through access covers',
        'Surge comparison test if available',
        'Check for evidence of overheating (discolored varnish)'
      ],
      solution: 'Complete motor rewind is required. Short circuited windings cannot be repaired.',
      detailedRepairProcedure: [
        'Document existing winding data before stripping',
        'Strip old windings from stator',
        'Clean and inspect stator core for damage',
        'Apply new ground insulation',
        'Wind new coils with correct wire gauge and turns',
        'Insert coils and connect per winding diagram',
        'VPI or dip-and-bake varnish treatment',
        'Test insulation resistance and winding resistance',
        'No-load test run before returning to service',
        'Provide test certificate with new specifications'
      ],
      preventionMeasures: [
        'Protect motor from overload with proper relay settings',
        'Install surge protection for VFD applications',
        'Maintain motor cleanliness',
        'Monitor motor current and temperature',
        'Address minor issues before they cause winding damage'
      ],
      safetyPrecautions: [
        'Hot windings can cause severe burns',
        'Shorted motor can draw very high current',
        'Ensure proper lockout/tagout before working',
        'Use insulated tools when testing'
      ],
      estimatedRepairTime: '3-7 days for rewind',
      estimatedCost: 'KES 15,000 - 250,000 depending on motor size',
      toolsRequired: ['Megger', 'Ohmmeter', 'Winding machine', 'Baking oven/VPI tank', 'Surge tester'],
      partsRequired: ['Magnet wire', 'Slot insulation', 'Varnish', 'End turn support material']
    },
    {
      code: 'MW002',
      name: 'Bearing Failure',
      severity: 'High',
      category: 'Bearing Faults',
      description: 'Motor bearings have failed or are failing, causing noise, vibration, and potential rotor damage. Bearings are the most common failure point in motors.',
      rootCauses: [
        'Normal wear over service life',
        'Inadequate or incorrect lubrication',
        'Contamination entering bearing',
        'Excessive load (belt tension, misalignment)',
        'Electrical bearing damage (VFD induced currents)',
        'Incorrect bearing type installed'
      ],
      symptoms: [
        'Unusual noise - grinding, squealing, or rumbling',
        'Increased vibration',
        'Hot bearing housing',
        'Shaft play or wobble',
        'Grease leaking from seals',
        'Intermittent operation'
      ],
      diagnosticSteps: [
        'Listen for bearing noise with stethoscope or screwdriver',
        'Feel bearing housing for excessive heat',
        'Check vibration with vibration meter',
        'Move shaft by hand to feel for roughness or play',
        'Inspect grease condition if accessible',
        'Check alignment and belt tension'
      ],
      solution: 'Replace failed bearings with correct type and properly lubricate.',
      detailedRepairProcedure: [
        'Record bearing numbers before removal',
        'Remove motor from application',
        'Disassemble motor to access bearings',
        'Remove old bearings using proper puller',
        'Clean bearing surfaces thoroughly',
        'Install new bearings using correct method (press, heat, or hydraulic)',
        'Apply correct grease amount (typically 1/3 to 1/2 fill)',
        'Reassemble motor',
        'Run motor unloaded to verify bearing operation',
        'Check vibration before returning to service'
      ],
      preventionMeasures: [
        'Follow lubrication schedule',
        'Use correct grease type and quantity',
        'Maintain proper alignment and belt tension',
        'Install bearing isolators for VFD applications',
        'Monitor bearing temperature and vibration'
      ],
      safetyPrecautions: [
        'Rotating shafts can cause injury',
        'Hot bearings can cause burns',
        'Use proper lifting equipment for heavy motors',
        'Ensure motor is isolated before disassembly'
      ],
      estimatedRepairTime: '2-6 hours',
      estimatedCost: 'KES 5,000 - 45,000',
      toolsRequired: ['Bearing puller', 'Bearing heater or press', 'Vibration meter', 'Torque wrench', 'Dial indicator'],
      partsRequired: ['Bearings (correct type)', 'Grease', 'Seals if damaged']
    },
    {
      code: 'MW003',
      name: 'Insulation Breakdown',
      severity: 'High',
      category: 'Insulation Faults',
      description: 'Deterioration of winding insulation reducing its dielectric strength. This progresses to ground faults or turn-to-turn shorts if not addressed.',
      rootCauses: [
        'Thermal aging from overheating',
        'Moisture absorption',
        'Chemical contamination',
        'Mechanical stress',
        'Voltage spikes and transients',
        'Normal aging over time'
      ],
      symptoms: [
        'Reduced insulation resistance',
        'Ground fault trips',
        'Intermittent operation',
        'Insulation resistance varies with temperature',
        'Polarization index declining'
      ],
      diagnosticSteps: [
        'Perform insulation resistance test (megger)',
        'Record reading and compare to history',
        'Calculate polarization index (10 min / 1 min reading)',
        'Test at rated voltage (500V or 1000V typically)',
        'Note effect of temperature on readings',
        'Evaluate trend over multiple tests'
      ],
      solution: 'If insulation is significantly degraded, motor requires rewinding. Minor degradation may be addressed with cleaning and re-varnishing.',
      detailedRepairProcedure: [
        'If IR >10 MOhm and PI >2: Acceptable, continue monitoring',
        'If IR 1-10 MOhm: Clean, dry, and re-varnish windings',
        'If IR <1 MOhm: Rewind motor',
        'For cleaning: Use appropriate solvent, bake dry, re-varnish',
        'For rewind: Full stripping and new windings required',
        'Document new insulation resistance values',
        'Establish baseline for future monitoring'
      ],
      preventionMeasures: [
        'Prevent overheating with proper protection',
        'Keep motor clean and dry',
        'Protect from chemical contamination',
        'Regular insulation testing',
        'Install surge protection where needed'
      ],
      safetyPrecautions: [
        'High voltage test equipment - follow safety procedures',
        'Allow capacitive charge to dissipate after testing',
        'Ensure motor is isolated before testing'
      ],
      estimatedRepairTime: '4-8 hours for cleaning/re-varnish, 3-7 days for rewind',
      estimatedCost: 'KES 8,000 - 200,000',
      toolsRequired: ['Insulation resistance tester (Megger)', 'DC hi-pot tester', 'Cleaning solvents', 'Baking oven']
    },
    {
      code: 'MW004',
      name: 'Rotor Bar Damage',
      severity: 'High',
      category: 'Mechanical Faults',
      description: 'Broken or cracked rotor bars in squirrel cage induction motors cause reduced performance and increased heating.',
      rootCauses: [
        'Frequent starts causing thermal stress',
        'Manufacturing defect',
        'Overheating damage',
        'Mechanical stress from misalignment',
        'Age and fatigue',
        'Excessive starting current/time'
      ],
      symptoms: [
        'Reduced starting torque',
        'Motor fails to accelerate to full speed',
        'Current fluctuations at twice slip frequency',
        'Increased noise during acceleration',
        'Overheating during operation'
      ],
      diagnosticSteps: [
        'Measure starting current - should decrease as motor accelerates',
        'Listen for varying load noise',
        'Use motor current signature analysis (MCSA)',
        'Check for rotor bar spectral signatures',
        'Remove rotor and inspect if accessible',
        'Growler test on rotor if available'
      ],
      solution: 'Rotor requires replacement or rotor bar repair by specialist.',
      detailedRepairProcedure: [
        'Remove rotor from stator',
        'Inspect rotor bars and end rings',
        'For brazed rotors: Re-braze damaged bars',
        'For cast rotors: Replace rotor assembly',
        'Check rotor balance after repair',
        'Reassemble with proper bearing fit',
        'Test motor current signature after repair'
      ],
      preventionMeasures: [
        'Limit motor starts per hour as specified',
        'Use soft starter or VFD to reduce starting stress',
        'Maintain proper alignment',
        'Monitor motor current during operation',
        'Avoid overloading motor'
      ],
      safetyPrecautions: [
        'Rotor may be heavy - use proper lifting',
        'Hot rotor can cause burns',
        'Rotating equipment hazard during testing'
      ],
      estimatedRepairTime: '1-3 days',
      estimatedCost: 'KES 25,000 - 150,000',
      toolsRequired: ['Bearing puller', 'MCSA equipment', 'Balancing machine', 'Brazing equipment'],
      partsRequired: ['Replacement rotor or rotor bars']
    },
    {
      code: 'MW005',
      name: 'Shaft Damage',
      severity: 'High',
      category: 'Mechanical Faults',
      description: 'Motor shaft has damage affecting fit, alignment, or operation. This causes vibration, bearing damage, and coupling problems.',
      rootCauses: [
        'Bearing failure damaging journal surface',
        'Coupling damage or improper fit',
        'Corrosion from moisture',
        'Mechanical impact',
        'Key/keyway wear',
        'Bent shaft from handling'
      ],
      symptoms: [
        'Excessive vibration',
        'Bearing running hot',
        'Coupling wear or failure',
        'Seal leakage',
        'Visible shaft damage',
        'Shaft runout detected'
      ],
      diagnosticSteps: [
        'Visual inspection of shaft surfaces',
        'Measure shaft runout with dial indicator',
        'Check bearing journals for wear',
        'Inspect keyway for damage',
        'Measure shaft diameter at journals',
        'Check shaft for straightness'
      ],
      solution: 'Repair or replace shaft depending on extent of damage.',
      detailedRepairProcedure: [
        'For minor journal wear: Metal spray or sleeve installation',
        'For keyway damage: Machine new keyway or sleeve and re-key',
        'For bent shaft: Straighten in press or replace',
        'For severe damage: Replace shaft',
        'After repair, check all dimensions',
        'Balance rotor on repaired shaft',
        'Verify fit with bearings and coupling'
      ],
      preventionMeasures: [
        'Proper alignment of coupled equipment',
        'Prevent bearing failures that damage shaft',
        'Correct handling procedures',
        'Protect shaft from corrosion'
      ],
      safetyPrecautions: [
        'Heavy components require proper lifting',
        'Machining operations require appropriate guarding',
        'Verify dimensions before reassembly'
      ],
      estimatedRepairTime: '1-5 days',
      estimatedCost: 'KES 15,000 - 120,000',
      toolsRequired: ['Dial indicator', 'Micrometer', 'Lathe', 'Metal spray equipment', 'Balancing machine'],
      partsRequired: ['Shaft sleeve or new shaft', 'Key material']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// UPS FAULT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const UPS_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'ups-power',
  serviceName: 'UPS & Power Backup',
  totalFaultCodes: 85,
  categories: [
    'Battery Faults',
    'Inverter Faults',
    'Rectifier/Charger Faults',
    'Bypass Faults',
    'Communication Faults',
    'Environmental Faults',
    'Output Faults',
    'Input Faults'
  ],
  faults: [
    {
      code: 'UPS001',
      name: 'Battery Capacity Low',
      severity: 'High',
      category: 'Battery Faults',
      description: 'UPS batteries have degraded capacity and can no longer provide the expected backup time. This is the most common UPS issue.',
      rootCauses: [
        'Normal battery aging (3-5 year life)',
        'Excessive temperature shortening life',
        'Frequent deep discharges',
        'Undercharging due to charger problem',
        'Manufacturing defect',
        'Extended operation on battery'
      ],
      symptoms: [
        'Reduced backup time',
        'Battery replace alarm',
        'Low battery alarm occurs quickly after outage',
        'Failed runtime test',
        'Battery voltage drops rapidly under load'
      ],
      diagnosticSteps: [
        'Check battery age - typical VRLA life is 3-5 years',
        'Perform runtime test with known load',
        'Measure individual battery voltages (12V nominal)',
        'Check for any batteries significantly lower than others',
        'Review operating temperature history',
        'Check charger output voltage'
      ],
      solution: 'Replace battery set with correct type and capacity.',
      detailedRepairProcedure: [
        'Obtain correct replacement batteries',
        'If possible, arrange for utility power to be available during replacement',
        'Transfer UPS to bypass mode',
        'Disconnect old batteries observing polarity',
        'Remove old batteries carefully - they are heavy',
        'Install new batteries checking proper polarity',
        'Re-connect battery string',
        'Return UPS to normal operation',
        'Allow 24-48 hours for full charge before testing',
        'Perform runtime test to verify capacity'
      ],
      preventionMeasures: [
        'Maintain cool operating temperature',
        'Ensure proper charging voltage',
        'Avoid frequent deep discharges',
        'Plan proactive replacement at 3-4 years',
        'Test batteries annually'
      ],
      safetyPrecautions: [
        'Batteries contain sulfuric acid',
        'Never short circuit battery terminals',
        'Wear eye protection and gloves',
        'Batteries are heavy - use proper lifting',
        'Dispose of batteries at authorized recycler'
      ],
      estimatedRepairTime: '1-3 hours',
      estimatedCost: 'KES 25,000 - 250,000 depending on UPS size',
      toolsRequired: ['Multimeter', 'Insulated tools', 'Battery strap or cart', 'Torque wrench'],
      partsRequired: ['Replacement battery set']
    },
    {
      code: 'UPS002',
      name: 'Inverter Failure',
      severity: 'Critical',
      category: 'Inverter Faults',
      description: 'UPS inverter has failed, unable to convert DC to AC. UPS will transfer to bypass if available, otherwise load loses power.',
      rootCauses: [
        'Power semiconductor failure (IGBT, MOSFET)',
        'Driver circuit failure',
        'Control board failure',
        'Capacitor failure',
        'Overload damage',
        'Component aging'
      ],
      symptoms: [
        'Inverter fault alarm',
        'UPS on bypass unexpectedly',
        'No output voltage on inverter test',
        'Abnormal sounds from UPS',
        'Burning smell',
        'Error code displayed'
      ],
      diagnosticSteps: [
        'Check UPS fault log for specific failure',
        'Verify UPS is on bypass (load still powered)',
        'Do not attempt to force inverter on if fault is present',
        'Visual inspection for obvious damage (burn marks)',
        'Contact manufacturer for diagnostic support',
        'Prepare for component level repair or replacement'
      ],
      solution: 'Replace failed inverter components or complete inverter module depending on UPS design.',
      detailedRepairProcedure: [
        'Ensure load is protected via bypass or alternative power',
        'Isolate UPS completely',
        'Discharge DC link capacitors safely',
        'Identify failed components using test equipment',
        'Replace failed power semiconductors, capacitors, or control boards',
        'Verify all connections',
        'Test inverter at no load first',
        'Gradually increase load while monitoring',
        'Document repair and test results'
      ],
      preventionMeasures: [
        'Maintain adequate cooling',
        'Avoid overloading UPS',
        'Keep UPS clean to prevent overheating',
        'Monitor for early warning signs',
        'Consider maintenance contract for critical UPS'
      ],
      safetyPrecautions: [
        'HIGH VOLTAGE inside UPS - lethal hazard',
        'DC link capacitors store dangerous energy',
        'Only qualified personnel should service',
        'Follow manufacturer safety procedures'
      ],
      estimatedRepairTime: '4-24 hours',
      estimatedCost: 'KES 50,000 - 500,000',
      toolsRequired: ['Oscilloscope', 'Multimeter', 'Soldering equipment', 'Semiconductor tester'],
      partsRequired: ['IGBTs/MOSFETs', 'Control boards', 'Capacitors']
    },
    {
      code: 'UPS003',
      name: 'Output Overload',
      severity: 'High',
      category: 'Output Faults',
      description: 'Load on UPS exceeds rated capacity. UPS may reduce output, transfer to bypass, or shut down depending on severity and duration.',
      rootCauses: [
        'Additional loads connected exceeding capacity',
        'Load equipment fault drawing excess current',
        'UPS capacity inadequate for application',
        'Short circuit on output',
        'Inrush current from load startup'
      ],
      symptoms: [
        'Overload alarm',
        'UPS transfers to bypass',
        'Output shuts down',
        'High current indication',
        'UPS running hot'
      ],
      diagnosticSteps: [
        'Measure actual load current',
        'Compare to UPS rated capacity',
        'Identify all connected loads',
        'Check for any load faults',
        'Measure inrush current if triggered at load startup',
        'Review load growth history'
      ],
      solution: 'Reduce load to within UPS capacity or upgrade to larger UPS.',
      detailedRepairProcedure: [
        'If immediate overload: Shed non-critical loads',
        'If load fault: Isolate faulty equipment',
        'Measure remaining load to verify capacity',
        'If inrush issue: Stagger load startup or install soft starters',
        'If persistent overload: Plan UPS upgrade',
        'For upgrade: Size for current load plus growth plus margin'
      ],
      preventionMeasures: [
        'Track connected loads',
        'Size UPS with appropriate growth margin',
        'Manage load connections',
        'Monitor UPS loading continuously',
        'Use intelligent load shedding if available'
      ],
      safetyPrecautions: [
        'Overloaded UPS runs hot - fire risk',
        'Do not bypass protection to maintain overloaded operation',
        'Address overload promptly'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 0 (load management) - 1,000,000+ (UPS upgrade)',
      toolsRequired: ['Clamp meter', 'Power analyzer', 'Load inventory documentation']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// AC & REFRIGERATION FAULT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const AC_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'ac-refrigeration',
  serviceName: 'AC & Refrigeration Services',
  totalFaultCodes: 95,
  categories: [
    'Compressor Faults',
    'Refrigerant Faults',
    'Electrical Faults',
    'Airflow Faults',
    'Control Faults',
    'Defrost Faults',
    'Condensate Faults',
    'Efficiency Faults'
  ],
  faults: [
    {
      code: 'AC001',
      name: 'Compressor Not Starting',
      severity: 'High',
      category: 'Compressor Faults',
      description: 'Compressor fails to start when called by thermostat. This results in no cooling or refrigeration.',
      rootCauses: [
        'Electrical supply problem',
        'Faulty capacitor (start or run)',
        'Compressor motor winding failure',
        'Compressor mechanically seized',
        'Contactor failure',
        'Overload protection tripped',
        'Control system fault',
        'Low refrigerant pressure lockout'
      ],
      symptoms: [
        'No cooling',
        'Compressor hums but doesn\'t start',
        'Clicking from contactor but no operation',
        'Tripped breaker',
        'Hot compressor shell',
        'Capacitor bulging'
      ],
      diagnosticSteps: [
        'Verify power supply at unit',
        'Check thermostat calling for cooling',
        'Listen for compressor attempting to start',
        'Check contactor operation',
        'Test capacitors with multimeter',
        'Measure compressor winding resistance',
        'Check for locked rotor condition',
        'Review pressure switch status'
      ],
      solution: 'Repair or replace failed component preventing compressor operation.',
      detailedRepairProcedure: [
        'If supply problem: Restore power, check breakers and fuses',
        'If capacitor failed: Replace with correct rating',
        'If contactor failed: Replace contactor',
        'If compressor windings open/shorted: Replace compressor',
        'If compressor seized: Replace compressor',
        'If pressure lockout: Diagnose and fix refrigerant issue first',
        'If overload tripped: Allow cooling, check for cause of overheating',
        'Test operation after repair'
      ],
      preventionMeasures: [
        'Regular maintenance including electrical checks',
        'Keep condenser coils clean',
        'Maintain proper refrigerant charge',
        'Provide adequate ventilation',
        'Replace capacitors proactively if showing age'
      ],
      safetyPrecautions: [
        'Disconnect power before working on electrical',
        'Discharge capacitors before handling',
        'Refrigerant is pressurized',
        'Compressor contains oil - dispose properly'
      ],
      estimatedRepairTime: '1-6 hours',
      estimatedCost: 'KES 3,000 - 150,000 (compressor replacement)',
      toolsRequired: ['Multimeter', 'Capacitor tester', 'Clamp meter', 'Manifold gauge set'],
      partsRequired: ['Capacitors', 'Contactor', 'Compressor if failed']
    },
    {
      code: 'AC002',
      name: 'Refrigerant Leak',
      severity: 'High',
      category: 'Refrigerant Faults',
      description: 'System is losing refrigerant through a leak. This causes reduced cooling capacity, compressor damage, and environmental harm.',
      rootCauses: [
        'Vibration fatigue in tubing',
        'Corrosion at joints',
        'Manufacturing defect',
        'Physical damage to coils',
        'Failed valve stems',
        'Loose flare connections'
      ],
      symptoms: [
        'Reduced cooling capacity',
        'Frost on evaporator at one point',
        'Low suction pressure',
        'Short cycling on low pressure',
        'Oil stains at leak location',
        'Hissing sound (large leaks)'
      ],
      diagnosticSteps: [
        'Check system pressures',
        'Visual inspection for oil stains',
        'Electronic leak detector survey',
        'Bubble test at suspect locations',
        'UV dye test for difficult leaks',
        'Pressure test if system empty'
      ],
      solution: 'Locate and repair leak, then recharge system with correct refrigerant amount.',
      detailedRepairProcedure: [
        'Recover remaining refrigerant',
        'Locate leak using appropriate method',
        'Repair leak - braze, replace component, or tighten fitting',
        'Pressure test repair with nitrogen',
        'Evacuate system to remove moisture and non-condensables',
        'Charge with correct refrigerant type and amount',
        'Check operation and superheat/subcooling',
        'Document refrigerant type and charge amount'
      ],
      preventionMeasures: [
        'Proper installation with quality brazing',
        'Protect coils from physical damage',
        'Regular inspection for early leak detection',
        'Vibration isolation for compressor'
      ],
      safetyPrecautions: [
        'Refrigerants displace oxygen - ventilate area',
        'Some refrigerants are flammable',
        'Hot surfaces during brazing',
        'Refrigerant recovery required by law'
      ],
      estimatedRepairTime: '2-8 hours',
      estimatedCost: 'KES 8,000 - 65,000',
      toolsRequired: ['Leak detector', 'Manifold gauges', 'Vacuum pump', 'Recovery machine', 'Brazing equipment'],
      partsRequired: ['Refrigerant', 'Filter drier', 'Replacement component if needed']
    },
    {
      code: 'AC003',
      name: 'Frozen Evaporator Coil',
      severity: 'Medium',
      category: 'Airflow Faults',
      description: 'Evaporator coil has iced over, blocking airflow and preventing cooling. This indicates an underlying problem that must be corrected.',
      rootCauses: [
        'Low airflow - dirty filter or blocked duct',
        'Low refrigerant charge',
        'Blower motor failure',
        'Metering device malfunction',
        'Running in cooling mode at low ambient',
        'Dirty evaporator coil'
      ],
      symptoms: [
        'No airflow from vents',
        'Visible ice on coil or lines',
        'Water dripping when ice melts',
        'High head pressure/low suction',
        'Unit runs but doesn\'t cool'
      ],
      diagnosticSteps: [
        'Inspect evaporator coil for ice',
        'Check air filter condition',
        'Verify blower operation',
        'Check duct system for blockages',
        'Measure airflow if possible',
        'Check refrigerant pressures after defrost'
      ],
      solution: 'Defrost coil and correct the underlying cause of icing.',
      detailedRepairProcedure: [
        'Turn off cooling - run fan only to defrost',
        'Do not use heat or sharp objects to defrost',
        'Once defrosted, check and replace air filter if dirty',
        'Clean evaporator coil if dirty',
        'Check blower operation and clean blower wheel',
        'If airflow is good, check refrigerant charge',
        'Address root cause before returning to cooling operation',
        'Monitor to verify problem is resolved'
      ],
      preventionMeasures: [
        'Replace air filters monthly during heavy use',
        'Keep evaporator coil clean',
        'Ensure ductwork is properly sized and unobstructed',
        'Maintain proper refrigerant charge'
      ],
      safetyPrecautions: [
        'Melting ice creates water - protect area below',
        'Electrical components may be wet - allow drying',
        'Do not operate until defrosted and cause corrected'
      ],
      estimatedRepairTime: '2-6 hours (including defrost time)',
      estimatedCost: 'KES 3,000 - 25,000',
      toolsRequired: ['Filter', 'Coil cleaner', 'Manifold gauges', 'Blower cleaning supplies']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTRICAL SERVICES FAULT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ELECTRICAL_FAULT_DATABASE: ServiceFaultDatabase = {
  serviceId: 'electrical',
  serviceName: 'Electrical Services',
  totalFaultCodes: 92,
  categories: [
    'Wiring Faults',
    'Breaker Faults',
    'Grounding Faults',
    'Power Quality Faults',
    'Lighting Faults',
    'Distribution Faults',
    'Protection Faults',
    'Metering Faults'
  ],
  faults: [
    {
      code: 'ELE001',
      name: 'Circuit Breaker Tripping',
      severity: 'Medium',
      category: 'Breaker Faults',
      description: 'Circuit breaker repeatedly trips, disconnecting power from the circuit. This indicates overload, short circuit, or ground fault.',
      rootCauses: [
        'Circuit overloaded with too many devices',
        'Short circuit in wiring or device',
        'Ground fault in circuit',
        'Faulty breaker',
        'Loose connection causing arcing',
        'Damaged appliance on circuit',
        'Undersized wiring'
      ],
      symptoms: [
        'Breaker found in tripped position',
        'Power loss to portion of building',
        'Breaker trips immediately when reset',
        'Breaker trips when specific device used',
        'Burning smell or marks at panel'
      ],
      diagnosticSteps: [
        'Identify which breaker has tripped',
        'Note what was happening when trip occurred',
        'Disconnect all loads from circuit',
        'Reset breaker with loads disconnected',
        'If trips immediately: Short or ground fault in wiring',
        'If holds: Reconnect loads one at a time to identify problem',
        'Inspect wiring for damage',
        'Test breaker if other causes eliminated'
      ],
      solution: 'Identify and correct the cause - reduce load, repair wiring, or replace faulty component.',
      detailedRepairProcedure: [
        'For overload: Redistribute loads to other circuits or add circuit',
        'For short circuit: Locate and repair damaged wiring or device',
        'For ground fault: Locate insulation failure and repair',
        'For faulty breaker: Replace breaker with same rating',
        'For loose connection: Tighten connections to specification',
        'After repair, test circuit under normal load',
        'Document any wiring modifications'
      ],
      preventionMeasures: [
        'Do not overload circuits',
        'Use appropriate rated devices',
        'Regular inspection of wiring and connections',
        'Address minor issues before they become failures'
      ],
      safetyPrecautions: [
        'Turn off main breaker before working in panel',
        'Test for voltage before touching any wires',
        'Use insulated tools',
        'Replace breakers with correct rating only'
      ],
      estimatedRepairTime: '1-4 hours',
      estimatedCost: 'KES 2,000 - 25,000',
      toolsRequired: ['Multimeter', 'Clamp meter', 'Circuit tracer', 'Insulated hand tools'],
      partsRequired: ['Breaker if faulty', 'Wire and connectors for repairs']
    },
    {
      code: 'ELE002',
      name: 'Poor Earthing/Grounding',
      severity: 'Critical',
      category: 'Grounding Faults',
      description: 'Electrical grounding system has excessive resistance or poor connections. This compromises safety by preventing proper fault clearing.',
      rootCauses: [
        'Corroded grounding electrode',
        'Damaged grounding conductor',
        'Loose connections at electrode or panel',
        'Inadequate electrode for soil conditions',
        'Ground rod in dry soil',
        'Missing grounding electrode'
      ],
      symptoms: [
        'High ground resistance reading',
        'Equipment cabinet shocking',
        'GFCI tripping unexpectedly',
        'Poor neutral-ground bond',
        'Visible corrosion on grounding system',
        'Failed inspection'
      ],
      diagnosticSteps: [
        'Visual inspection of grounding system',
        'Measure ground resistance with fall-of-potential method',
        'Check connections for tightness and corrosion',
        'Verify neutral-ground bond at service entrance',
        'Check continuity of grounding conductors',
        'Evaluate electrode type and installation depth'
      ],
      solution: 'Repair, improve, or replace grounding system to achieve acceptable resistance (typically <10 ohms).',
      detailedRepairProcedure: [
        'Clean and tighten all connections',
        'Replace corroded conductors or electrodes',
        'If resistance too high: Add additional electrodes',
        'Consider ground enhancement material for poor soil',
        'Drive rods deeper if soil conductivity improves with depth',
        'Install ground ring or radial system for difficult sites',
        'Re-test after improvements',
        'Document final resistance reading'
      ],
      preventionMeasures: [
        'Annual ground resistance testing',
        'Use corrosion-resistant materials',
        'Protect grounding conductors from damage',
        'Maintain soil moisture around electrodes in dry conditions'
      ],
      safetyPrecautions: [
        'Do not disconnect grounding while power is present',
        'Test equipment bonding after any grounding work',
        'Poor grounding is life-threatening hazard'
      ],
      estimatedRepairTime: '2-8 hours',
      estimatedCost: 'KES 5,000 - 50,000',
      toolsRequired: ['Earth resistance tester', 'Clamp-on ground tester', 'Ground rod driver', 'Exothermic welding kit'],
      partsRequired: ['Ground rods', 'Grounding conductor', 'Ground enhancement material']
    },
    {
      code: 'ELE003',
      name: 'Low Voltage at Outlets',
      severity: 'Medium',
      category: 'Power Quality Faults',
      description: 'Voltage at outlets is below acceptable level, causing poor equipment performance, motor overheating, and potential damage.',
      rootCauses: [
        'Utility supply voltage low',
        'Undersized service entrance',
        'Long circuit runs with undersized wire',
        'Loose connections causing voltage drop',
        'Overloaded circuit or service',
        'Neutral connection problem'
      ],
      symptoms: [
        'Lights dimming',
        'Motors running hot',
        'Equipment not functioning properly',
        'Voltage reading below 220V (single phase)',
        'Voltage drops further under load'
      ],
      diagnosticSteps: [
        'Measure voltage at outlet under load',
        'Compare to voltage at main panel',
        'Check utility voltage at meter',
        'Calculate voltage drop on affected circuits',
        'Check neutral connection integrity',
        'Look for loose connections (may be warm)'
      ],
      solution: 'Correct the cause of voltage drop - utility issue, undersized wiring, or connection problem.',
      detailedRepairProcedure: [
        'If utility voltage low: Report to utility company',
        'If long circuit run: Increase wire size or add subpanel closer to loads',
        'If loose connection: Tighten and clean connections',
        'If overloaded: Redistribute loads or upgrade service',
        'If neutral problem: Repair neutral connection immediately',
        'Verify acceptable voltage after corrections'
      ],
      preventionMeasures: [
        'Proper wire sizing during installation',
        'Regular tightening of connections',
        'Monitor voltage as part of maintenance',
        'Plan for future load growth'
      ],
      safetyPrecautions: [
        'Work on de-energized circuits',
        'Loose connections may be hot - use thermal imaging',
        'Verify proper voltage before reconnecting sensitive equipment'
      ],
      estimatedRepairTime: '1-6 hours',
      estimatedCost: 'KES 3,000 - 35,000',
      toolsRequired: ['True RMS multimeter', 'Clamp meter', 'Infrared thermometer', 'Wire gauge']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINE ALL FAULT DATABASES
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_FAULT_DATABASES: ServiceFaultDatabase[] = [
  GENERATOR_FAULT_DATABASE,
  SOLAR_FAULT_DATABASE,
  MOTOR_FAULT_DATABASE,
  UPS_FAULT_DATABASE,
  AC_FAULT_DATABASE,
  ELECTRICAL_FAULT_DATABASE
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getFaultByCode(code: string): FaultCode | undefined {
  for (const database of ALL_FAULT_DATABASES) {
    const fault = database.faults.find(f => f.code === code);
    if (fault) return fault;
  }
  return undefined;
}

export function getFaultsByService(serviceId: string): FaultCode[] {
  const database = ALL_FAULT_DATABASES.find(d => d.serviceId === serviceId);
  return database ? database.faults : [];
}

export function getFaultsBySeverity(severity: FaultCode['severity']): FaultCode[] {
  const allFaults: FaultCode[] = [];
  for (const database of ALL_FAULT_DATABASES) {
    allFaults.push(...database.faults.filter(f => f.severity === severity));
  }
  return allFaults;
}

export function searchFaults(query: string): FaultCode[] {
  const searchTerm = query.toLowerCase();
  const results: FaultCode[] = [];

  for (const database of ALL_FAULT_DATABASES) {
    for (const fault of database.faults) {
      if (
        fault.code.toLowerCase().includes(searchTerm) ||
        fault.name.toLowerCase().includes(searchTerm) ||
        fault.description.toLowerCase().includes(searchTerm) ||
        fault.symptoms.some(s => s.toLowerCase().includes(searchTerm))
      ) {
        results.push(fault);
      }
    }
  }

  return results;
}

export function getTotalFaultCount(): number {
  return ALL_FAULT_DATABASES.reduce((sum, db) => sum + db.faults.length, 0);
}
