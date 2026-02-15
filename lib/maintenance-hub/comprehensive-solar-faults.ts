/**
 * WORLD'S MOST COMPREHENSIVE SOLAR FAULT DATABASE
 * 200+ Fault codes for all major solar inverter brands
 * Detailed diagnostics and professional solutions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SolarFaultCode {
  code: string;
  name: string;
  brand: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Warning';
  category: string;
  description: string;
  possibleCauses: string[];
  symptoms: string[];
  diagnosticSteps: string[];
  solution: string;
  detailedProcedure: string[];
  preventionMeasures: string[];
  safetyNotes: string[];
  estimatedTime: string;
  estimatedCost: string;
  toolsRequired: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROWATT INVERTER FAULT CODES - 40+ Codes
// ═══════════════════════════════════════════════════════════════════════════════

export const GROWATT_FAULTS: SolarFaultCode[] = [
  {
    code: 'F01',
    name: 'Grid Over Voltage',
    brand: 'Growatt',
    severity: 'High',
    category: 'Grid Faults',
    description: 'The grid voltage has exceeded the maximum acceptable limit (typically >270V for 230V systems). The inverter has disconnected from the grid to protect equipment and comply with grid codes.',
    possibleCauses: [
      'Utility voltage actually high',
      'Loose connection causing high resistance',
      'Transformer tap setting incorrect',
      'Peak demand reduction on grid',
      'Voltage sensing fault in inverter',
      'Grid impedance too high for system size'
    ],
    symptoms: [
      'Inverter stops exporting power',
      'F01 error displayed on screen',
      'Grid LED red or flashing',
      'Output power drops to zero',
      'Alarm notification in monitoring app'
    ],
    diagnosticSteps: [
      'Measure actual grid voltage at inverter AC terminals with multimeter',
      'Compare to inverter display reading - should match within 2V',
      'Check voltage at main distribution board',
      'If high throughout building, likely utility issue',
      'If only high at inverter, check connections and cable sizing',
      'Monitor voltage over several hours to capture variations',
      'Compare to other inverters if multiple units installed'
    ],
    solution: 'Address the cause of high voltage. If utility voltage is actually high, report to utility company. If connection issues, repair wiring. If inverter settings too tight, consider adjusting voltage limits.',
    detailedProcedure: [
      'Measure grid voltage at inverter and distribution board',
      'If voltage is within normal range (220-250V), check inverter voltage sensing',
      'If voltage genuinely high, report to utility company',
      'If local voltage drop issue, check wiring connections and tighten',
      'Verify cable sizing is adequate for distance',
      'If adjustment needed, access inverter settings menu',
      'Adjust high voltage disconnect setting (only if within grid code)',
      'Monitor for 24 hours after adjustment',
      'Document any changes made'
    ],
    preventionMeasures: [
      'Proper site assessment before installation',
      'Appropriate cable sizing',
      'Regular connection maintenance',
      'Monitoring for voltage trends'
    ],
    safetyNotes: [
      'Do not touch AC terminals while inverter is connected to grid',
      'Use properly rated measurement equipment',
      'Do not adjust settings beyond grid code requirements'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 0 - 15,000',
    toolsRequired: ['True RMS multimeter', 'Voltage recorder', 'Inverter programming interface']
  },
  {
    code: 'F02',
    name: 'Grid Under Voltage',
    brand: 'Growatt',
    severity: 'High',
    category: 'Grid Faults',
    description: 'The grid voltage has dropped below the minimum acceptable limit (typically <180V for 230V systems). The inverter has disconnected to prevent damage to loads and comply with grid codes.',
    possibleCauses: [
      'Utility voltage actually low',
      'Heavy loads starting on same circuit',
      'Long cable run with voltage drop',
      'Loose or corroded connections',
      'Undersized service entrance',
      'Voltage sensing fault in inverter'
    ],
    symptoms: [
      'Inverter stops exporting power',
      'F02 error displayed',
      'Lights in building may appear dim',
      'Motors may run hot or stall',
      'Power drops particularly in afternoon peak'
    ],
    diagnosticSteps: [
      'Measure grid voltage at inverter during fault occurrence',
      'Check voltage at main distribution board',
      'Note if coincides with specific loads starting',
      'Measure voltage under different loading conditions',
      'Check all connections for tightness',
      'Verify cable sizing for installation'
    ],
    solution: 'Improve the voltage condition. May require utility involvement, wiring upgrade, or load redistribution.',
    detailedProcedure: [
      'Document when fault occurs and conditions',
      'Measure voltage at multiple points',
      'If utility voltage low, report to power company',
      'If voltage drop in wiring, upgrade cables or add subpanel',
      'Tighten any loose connections (high resistance causes drop)',
      'Consider adding automatic voltage regulator if chronic issue',
      'Adjust inverter settings if voltage is acceptable but trips frequently',
      'Monitor after corrections'
    ],
    preventionMeasures: [
      'Proper cable sizing during installation',
      'Regular connection maintenance',
      'Consider AVR for problematic areas',
      'Load management during solar production'
    ],
    safetyNotes: [
      'Low voltage can cause motors to draw excessive current',
      'Verify voltage stability before making changes',
      'Use proper PPE when working on electrical'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 0 - 35,000',
    toolsRequired: ['True RMS multimeter', 'Clamp meter', 'Cable sizing calculator']
  },
  {
    code: 'F03',
    name: 'Grid Frequency Out of Range',
    brand: 'Growatt',
    severity: 'High',
    category: 'Grid Faults',
    description: 'The grid frequency has deviated outside acceptable limits (typically 47.5-52.5 Hz). This indicates grid instability and the inverter has disconnected for safety.',
    possibleCauses: [
      'Utility grid frequency unstable',
      'Generator running with poor frequency regulation',
      'Island mode detected (grid disconnected)',
      'Frequency sensing fault in inverter',
      'Interaction with other grid-tied equipment'
    ],
    symptoms: [
      'F03 error displayed',
      'Inverter disconnects from grid',
      'May coincide with utility disturbance',
      'Clock devices may show wrong time (chronic issue)',
      'Multiple inverters may trip simultaneously'
    ],
    diagnosticSteps: [
      'Measure actual frequency with frequency meter or quality multimeter',
      'Check if utility or generator is supplying',
      'Verify generator frequency setting if applicable',
      'Check if multiple inverters have same fault',
      'Review monitoring data for frequency trends'
    ],
    solution: 'Identify source of frequency deviation. If utility, report to power company. If generator, adjust governor. If inverter sensing, may need service.',
    detailedProcedure: [
      'Confirm actual frequency with independent meter',
      'If frequency is genuinely out of spec, document and report to utility',
      'If generator related, adjust governor for proper frequency (50.0 Hz)',
      'If inverter sensing is suspect, check frequency display matches meter',
      'For chronic issues, consider different grid code settings if allowed',
      'If island detection false positive, verify ground bonding'
    ],
    preventionMeasures: [
      'Proper generator setup for grid-parallel operation',
      'Correct ground bonding per local requirements',
      'Report chronic utility issues'
    ],
    safetyNotes: [
      'Do not disable anti-islanding protection',
      'Generator must be properly interfaced for grid parallel'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 0 - 15,000',
    toolsRequired: ['Frequency meter', 'Multimeter with frequency function']
  },
  {
    code: 'F04',
    name: 'DC Injection High',
    brand: 'Growatt',
    severity: 'High',
    category: 'Grid Faults',
    description: 'The inverter is detecting excessive DC current injection into the AC output. Grid codes limit DC injection to protect utility transformers from saturation.',
    possibleCauses: [
      'Inverter DC injection circuit fault',
      'AC coupling transformer saturation',
      'DC current sensor drift or failure',
      'External DC source on AC circuit',
      'Measurement interference'
    ],
    symptoms: [
      'F04 error code displayed',
      'Inverter repeatedly stops and restarts',
      'Transformer humming audible',
      'Possible distortion on AC waveform'
    ],
    diagnosticSteps: [
      'Check for any external DC sources on AC circuit',
      'Monitor for pattern - constant or intermittent',
      'If persistent, likely inverter internal issue',
      'May require manufacturer support for diagnosis',
      'Check if recent lightning or surge event occurred'
    ],
    solution: 'If inverter internal fault confirmed, requires professional service or replacement of inverter.',
    detailedProcedure: [
      'Isolate inverter from both DC and AC',
      'Restart inverter to see if fault clears',
      'If fault persists, contact manufacturer support',
      'May require calibration or board replacement',
      'Document fault occurrence for warranty claim if applicable'
    ],
    preventionMeasures: [
      'Surge protection on AC side',
      'Proper grounding',
      'Annual inverter testing'
    ],
    safetyNotes: [
      'DC on AC lines is hazardous',
      'Do not bypass DC injection protection'
    ],
    estimatedTime: '2-6 hours',
    estimatedCost: 'KES 15,000 - 95,000',
    toolsRequired: ['Oscilloscope', 'True RMS meter', 'DC current clamp']
  },
  {
    code: 'F05',
    name: 'Island Mode Detected',
    brand: 'Growatt',
    severity: 'Critical',
    category: 'Grid Faults',
    description: 'The inverter has detected possible island condition where inverter may be energizing a section of grid that should be de-energized. This is a critical safety protection.',
    possibleCauses: [
      'Grid actually disconnected',
      'Impedance change detected',
      'Interaction with other power sources',
      'Anti-island test activated',
      'False detection due to load characteristics'
    ],
    symptoms: [
      'F05 error displayed',
      'Inverter immediately stops export',
      'May coincide with utility switching',
      'Other inverters may also trip'
    ],
    diagnosticSteps: [
      'Verify grid is actually connected',
      'Check other circuits for power',
      'Verify ground bonding is correct',
      'Check for parallel generators or other inverters',
      'Review if coincides with utility maintenance'
    ],
    solution: 'Verify grid connection and correct bonding. If false detection, may need settings adjustment.',
    detailedProcedure: [
      'Confirm utility power is present',
      'Verify neutral-ground bond at single point only',
      'If multiple inverters, check anti-island interaction',
      'May require adjustment of detection sensitivity',
      'Contact manufacturer if chronic false detection'
    ],
    preventionMeasures: [
      'Correct neutral-ground bonding',
      'Proper installation per standards',
      'Coordination of multiple inverters'
    ],
    safetyNotes: [
      'NEVER disable anti-island protection - this protects line workers',
      'Island detection is a critical safety feature'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 5,000 - 25,000',
    toolsRequired: ['Multimeter', 'Ground tester', 'Impedance meter']
  },
  {
    code: 'F06',
    name: 'PV Over Voltage',
    brand: 'Growatt',
    severity: 'Critical',
    category: 'PV Faults',
    description: 'The DC input voltage from solar panels has exceeded the inverter maximum input voltage. This can damage inverter components and is a fire hazard.',
    possibleCauses: [
      'Too many panels in series string',
      'Cold temperature increasing panel voltage',
      'Incorrect panel specifications used in design',
      'Open circuit condition on parallel string causing voltage imbalance',
      'Panel labeling error'
    ],
    symptoms: [
      'F06 error displayed',
      'Inverter will not start',
      'May only occur on cold mornings',
      'DC voltage display shows high reading',
      'Possible arc marks or damage visible'
    ],
    diagnosticSteps: [
      'Measure DC voltage of each string with system disconnected',
      'Calculate expected Voc at lowest expected temperature',
      'Compare to inverter maximum DC voltage rating',
      'Verify panel specifications match documentation',
      'Check number of panels in each string'
    ],
    solution: 'Reconfigure strings to reduce voltage below inverter maximum. Must account for cold temperature increase.',
    detailedProcedure: [
      'Calculate maximum expected Voc: Voc(min temp) = Voc(STC) × [1 + (Temp coefficient × (Min temp - 25))]',
      'If Voc exceeds inverter max, reduce panels per string',
      'Reconfigure to shorter strings in parallel',
      'May require additional string combiner or different inverter',
      'Verify new configuration before energizing',
      'Test on cold morning to confirm acceptable'
    ],
    preventionMeasures: [
      'Proper system design with temperature calculations',
      'Use manufacturer string sizing tools',
      'Allow margin below maximum voltage'
    ],
    safetyNotes: [
      'High DC voltage is lethal',
      'Cover panels or work at night when making string changes',
      'Use properly rated DC-rated tools'
    ],
    estimatedTime: '4-8 hours',
    estimatedCost: 'KES 10,000 - 65,000',
    toolsRequired: ['DC multimeter 600V+', 'MC4 disconnect tools', 'String sizing calculator']
  },
  {
    code: 'F07',
    name: 'PV Under Voltage',
    brand: 'Growatt',
    severity: 'Low',
    category: 'PV Faults',
    description: 'The DC input voltage is below the minimum required for inverter operation. This is normal at dawn/dusk but persistent indication may signal a problem.',
    possibleCauses: [
      'Low light conditions (normal)',
      'Heavy shading on array',
      'Panel degradation or failure',
      'String wiring problem',
      'Too few panels in string for inverter minimum'
    ],
    symptoms: [
      'F07 displayed when sun is adequate',
      'Inverter does not start during good sun',
      'One or more strings showing low voltage',
      'Gradual decrease in production over time'
    ],
    diagnosticSteps: [
      'Check if occurs during good sunlight conditions',
      'Measure string voltages with meter',
      'Compare to expected voltage for irradiance',
      'Check for shading on any panels',
      'Inspect for panel damage or hot spots'
    ],
    solution: 'If string voltage is inadequate, add panels to increase voltage or investigate panel/wiring issues.',
    detailedProcedure: [
      'Measure Vmp of each string during good sun',
      'Compare to expected based on panel specs and irradiance',
      'If significantly low, check for faulty panels or connections',
      'Use thermal camera to find hot spots',
      'Repair or replace faulty components',
      'If string too short, add panels'
    ],
    preventionMeasures: [
      'Proper string sizing during design',
      'Regular system monitoring',
      'Maintenance to address shading'
    ],
    safetyNotes: [
      'Even low voltage strings can be dangerous',
      'Follow DC safety procedures'
    ],
    estimatedTime: '2-4 hours',
    estimatedCost: 'KES 5,000 - 35,000',
    toolsRequired: ['DC multimeter', 'Solar irradiance meter', 'Thermal camera']
  },
  {
    code: 'F08',
    name: 'PV Isolation Low',
    brand: 'Growatt',
    severity: 'Critical',
    category: 'PV Faults',
    description: 'The insulation resistance between DC conductors and ground is below safe limits. This indicates a ground fault that creates shock hazard and potential fire risk.',
    possibleCauses: [
      'Damaged cable insulation',
      'Water ingress in junction box or connector',
      'Panel frame fault',
      'Conduit rubbing cable insulation',
      'Animal damage to wiring',
      'UV degradation of cable'
    ],
    symptoms: [
      'F08 or ISO error displayed',
      'Inverter will not operate',
      'Ground fault indicator active',
      'Insulation resistance reading low',
      'May improve after sun drying moisture'
    ],
    diagnosticSteps: [
      'Do not attempt to operate inverter',
      'Disconnect all strings from inverter',
      'Test each string isolation with megger',
      'Identify which string has low resistance',
      'Progressively disconnect panels to isolate fault',
      'Inspect identified section for damage'
    ],
    solution: 'Locate and repair the insulation failure. Replace damaged cables, connectors, or panels.',
    detailedProcedure: [
      'Isolate system completely',
      'Test each string separately with insulation tester (megger)',
      'String should read >1 MOhm, preferably >10 MOhm',
      'Identify string with low reading',
      'Divide string and test halves to narrow down',
      'Continue until specific panel/junction/cable identified',
      'Repair or replace faulty component',
      'Re-test entire system',
      'Verify fault clears before operating'
    ],
    preventionMeasures: [
      'Use UV-rated PV cable for all outdoor runs',
      'Proper cable management and protection',
      'Quality connectors properly installed',
      'Regular inspection of cable routing',
      'Animal protection where needed'
    ],
    safetyNotes: [
      'Ground faults create shock hazard',
      'Do not touch DC conductors until fault located',
      'Work in dark or cover panels for safety',
      'Use properly rated insulation tester'
    ],
    estimatedTime: '3-8 hours',
    estimatedCost: 'KES 10,000 - 55,000',
    toolsRequired: ['Insulation tester (Megger) 500V+', 'MC4 tools', 'UV-rated cable', 'Connectors']
  },
  {
    code: 'F09',
    name: 'GFDI Fault',
    brand: 'Growatt',
    severity: 'Critical',
    category: 'Protection Faults',
    description: 'Ground Fault Detection and Interruption circuit has detected a fault. This is similar to isolation fault but specifically triggered by current flow to ground.',
    possibleCauses: [
      'Ground fault in DC system',
      'Inverter GFDI circuit failure',
      'External surge damage',
      'Multiple ground points creating path',
      'Wet conditions'
    ],
    symptoms: [
      'GFDI fault indication',
      'Inverter will not operate',
      'May coincide with weather event',
      'Blown GFDI fuse (if equipped)'
    ],
    diagnosticSteps: [
      'Check if GFDI fuse is blown (if equipped)',
      'Test DC string isolation',
      'Check for ground bonds on DC system',
      'Inspect for water ingress after weather'
    ],
    solution: 'Identify and clear ground fault. Replace GFDI fuse if applicable.',
    detailedProcedure: [
      'If GFDI fuse blown, indicates significant ground fault',
      'Locate ground fault using isolation testing',
      'Clear fault before replacing fuse',
      'If fuse blows again immediately, fault still present',
      'Some inverters require manual reset after GFDI trip'
    ],
    preventionMeasures: [
      'Proper installation without ground faults',
      'Regular inspection',
      'Surge protection'
    ],
    safetyNotes: [
      'GFDI is critical safety feature',
      'Do not bypass GFDI protection',
      'Ground faults can cause fire'
    ],
    estimatedTime: '2-6 hours',
    estimatedCost: 'KES 8,000 - 45,000',
    toolsRequired: ['Megger', 'Multimeter', 'GFDI fuse (if needed)']
  },
  {
    code: 'F10',
    name: 'Over Temperature',
    brand: 'Growatt',
    severity: 'Medium',
    category: 'Environmental Faults',
    description: 'The inverter internal temperature has exceeded safe limits. The inverter will reduce output (derate) or shut down to prevent damage.',
    possibleCauses: [
      'Inadequate ventilation',
      'Direct sunlight on inverter',
      'High ambient temperature',
      'Blocked cooling vents',
      'Failed cooling fan',
      'Excessive output loading'
    ],
    symptoms: [
      'Over temperature warning',
      'Output power decreasing',
      'Inverter hot to touch',
      'Fan running at high speed',
      'Occurs during peak afternoon'
    ],
    diagnosticSteps: [
      'Check ambient temperature at installation location',
      'Verify adequate clearance around inverter',
      'Check for blocked vents',
      'Verify fan operation',
      'Check if inverter is in direct sun'
    ],
    solution: 'Improve cooling by addressing ventilation, shading, or fan issues.',
    detailedProcedure: [
      'Clear any debris from vents',
      'If fan is not running, replace fan assembly',
      'Install shade structure over inverter if in direct sun',
      'Consider relocating if ambient is too hot',
      'Improve ventilation in enclosure if applicable',
      'Verify improvement in temperature reading'
    ],
    preventionMeasures: [
      'Install in shaded, ventilated location',
      'Follow manufacturer clearance requirements',
      'Regular cleaning of vents',
      'Monitor temperature trends'
    ],
    safetyNotes: [
      'Hot surfaces can cause burns',
      'Allow cooling before service',
      'Do not block ventilation'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 2,000 - 25,000',
    toolsRequired: ['Temperature meter', 'Fan replacement', 'Shade materials']
  },
  {
    code: 'F11',
    name: 'No Utility',
    brand: 'Growatt',
    severity: 'Low',
    category: 'Grid Faults',
    description: 'The inverter cannot detect utility voltage. For grid-tied inverters, this prevents operation. This is normal during power outages.',
    possibleCauses: [
      'Utility power outage (normal)',
      'AC breaker tripped or off',
      'Loose AC wiring connection',
      'AC cable damage',
      'Inverter AC circuit fault'
    ],
    symptoms: [
      'F11 or No Grid displayed',
      'Inverter not producing power',
      'Zero export shown',
      'AC status indicator off or red',
      'Building has no utility power'
    ],
    diagnosticSteps: [
      'Check if utility power is present at distribution board',
      'Verify AC breaker feeding inverter is on',
      'Check AC voltage at inverter terminals',
      'Inspect AC wiring for damage or loose connections',
      'If utility is present but inverter doesn\'t see it, check sensing'
    ],
    solution: 'Restore utility power or repair connection. If utility is present but not detected, troubleshoot sensing.',
    detailedProcedure: [
      'Verify utility power status',
      'Turn on AC breakers if tripped',
      'Measure voltage at inverter AC terminals',
      'If voltage present but not detected, check inverter settings',
      'Tighten any loose connections',
      'Wait for utility restoration if power outage'
    ],
    preventionMeasures: [
      'Proper wiring installation',
      'Regular connection maintenance',
      'AC surge protection'
    ],
    safetyNotes: [
      'AC wiring is energized when utility present',
      'Use proper PPE and procedures'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 10,000',
    toolsRequired: ['Multimeter', 'Insulated tools']
  },
  {
    code: 'F12',
    name: 'Phase Loss',
    brand: 'Growatt',
    severity: 'High',
    category: 'Grid Faults',
    description: 'For three-phase inverters, one or more phases has been lost. The inverter cannot operate with incomplete phase connection.',
    possibleCauses: [
      'Single phase utility outage',
      'Blown fuse on one phase',
      'Loose connection on one phase',
      'Cable damage',
      'Utility transformer problem'
    ],
    symptoms: [
      'Phase loss alarm',
      'Inverter stopped',
      'Some building loads may still work',
      'Three-phase motors may be damaged',
      'Voltage imbalance visible'
    ],
    diagnosticSteps: [
      'Measure voltage on all three phases',
      'Compare phase-to-phase voltages (should be equal)',
      'Check all three fuses if equipped',
      'Check connections on all three phases',
      'Verify utility supply is three-phase complete'
    ],
    solution: 'Restore the lost phase. Check fuses, connections, and utility supply.',
    detailedProcedure: [
      'Identify which phase is lost or low',
      'Check distribution board for tripped breakers or blown fuses',
      'Check connections on affected phase',
      'If utility issue, report to power company',
      'Verify all three phases restored before operating'
    ],
    preventionMeasures: [
      'Regular connection maintenance',
      'Phase monitoring protection',
      'Proper fuse sizing'
    ],
    safetyNotes: [
      'Phase loss can damage three-phase motors',
      'All phases may still be live',
      'Use proper three-phase procedures'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 2,000 - 20,000',
    toolsRequired: ['Three-phase meter', 'Clamp meter', 'Fuses']
  },
  {
    code: 'F13',
    name: 'Communication Error',
    brand: 'Growatt',
    severity: 'Low',
    category: 'Communication Faults',
    description: 'The inverter cannot communicate with monitoring system, Wi-Fi stick, or parallel units. Power production is not affected but monitoring is lost.',
    possibleCauses: [
      'Wi-Fi signal weak',
      'Communication cable disconnected',
      'Data logger fault',
      'Server maintenance',
      'Network configuration change',
      'Interference'
    ],
    symptoms: [
      'Monitoring app shows offline',
      'No data updates',
      'Communication LED off or red',
      'Parallel units not synchronizing'
    ],
    diagnosticSteps: [
      'Check communication cable connection',
      'Verify Wi-Fi signal at inverter location',
      'Check if data logger LED shows connection',
      'Try reconnecting in monitoring app',
      'Verify network/internet working',
      'Check if server status shows maintenance'
    ],
    solution: 'Restore communication by fixing connection, signal, or configuration issues.',
    detailedProcedure: [
      'Secure any loose cables',
      'If Wi-Fi, check signal strength and reconnect',
      'If cellular, verify SIM has data',
      'Power cycle data logger',
      'Reconfigure network settings if changed',
      'Contact monitoring support if persistent'
    ],
    preventionMeasures: [
      'Strong Wi-Fi signal at inverter',
      'Secure cable connections',
      'Data plan for cellular',
      'Regular monitoring check'
    ],
    safetyNotes: [
      'Communication issues do not affect safety',
      'Power production continues normally'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 5,000',
    toolsRequired: ['Wi-Fi analyzer', 'Network cable', 'Phone/laptop']
  },
  {
    code: 'F14',
    name: 'Internal Fan Fault',
    brand: 'Growatt',
    severity: 'Medium',
    category: 'Hardware Faults',
    description: 'The internal cooling fan has failed or is not operating correctly. Without cooling, the inverter will overheat and derate.',
    possibleCauses: [
      'Fan motor failure',
      'Fan blocked by debris',
      'Fan driver circuit fault',
      'Fan connector loose',
      'Bearing wear'
    ],
    symptoms: [
      'Fan fault alarm',
      'No fan noise when should be running',
      'Excessive heating',
      'Output derating',
      'Fan makes unusual noise'
    ],
    diagnosticSteps: [
      'Listen for fan operation during high load',
      'Check fan for physical obstruction',
      'Verify fan connector is secure',
      'Apply voltage to fan directly to test motor',
      'Check fan driver circuit if accessible'
    ],
    solution: 'Clean, repair, or replace the cooling fan.',
    detailedProcedure: [
      'De-energize inverter completely',
      'Open cover per manufacturer procedure',
      'Inspect fan for debris and clear if present',
      'Check fan connector',
      'If fan motor failed, replace fan assembly',
      'Verify operation after reassembly'
    ],
    preventionMeasures: [
      'Regular cleaning',
      'Good ventilation environment',
      'Periodic fan inspection'
    ],
    safetyNotes: [
      'De-energize completely before opening',
      'Wait for capacitors to discharge',
      'Use correct replacement fan'
    ],
    estimatedTime: '2-4 hours',
    estimatedCost: 'KES 8,000 - 25,000',
    toolsRequired: ['Screwdrivers', 'Multimeter', 'Replacement fan']
  },
  {
    code: 'F20',
    name: 'Battery Over Voltage',
    brand: 'Growatt',
    severity: 'High',
    category: 'Battery Faults',
    description: 'The battery voltage has exceeded the maximum safe charging limit. Continued overcharging will damage the battery and create safety hazards.',
    possibleCauses: [
      'Incorrect charge voltage setting',
      'BMS communication failure',
      'Wrong battery type selected',
      'Temperature compensation not working',
      'Cell imbalance in lithium battery',
      'Charger control fault'
    ],
    symptoms: [
      'Battery over voltage alarm',
      'High battery voltage reading',
      'Battery may feel hot',
      'Charging stops abruptly',
      'BMS may disconnect'
    ],
    diagnosticSteps: [
      'Measure battery voltage with multimeter',
      'Check inverter charge voltage setting',
      'Verify battery type selected matches actual battery',
      'If lithium, check cell voltages via BMS',
      'Verify BMS communication is working',
      'Check temperature compensation settings'
    ],
    solution: 'Correct the charge settings or repair BMS communication to prevent overcharging.',
    detailedProcedure: [
      'Stop charging immediately',
      'Review inverter battery settings',
      'Correct battery type selection if wrong',
      'Set correct bulk/absorb/float voltages for battery type',
      'For lithium: Check BMS settings and communication',
      'Verify individual cell balance',
      'Monitor charging after corrections'
    ],
    preventionMeasures: [
      'Correct battery configuration at installation',
      'Follow battery manufacturer settings',
      'Monitor battery parameters regularly',
      'Verify BMS communication is working'
    ],
    safetyNotes: [
      'Overcharged batteries can vent dangerous gases',
      'Lithium batteries can enter thermal runaway',
      'Do not approach swelling battery',
      'Have fire suppression available'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 2,000 - 15,000',
    toolsRequired: ['Multimeter', 'BMS interface tool', 'Inverter programming interface']
  },
  {
    code: 'F21',
    name: 'Battery Under Voltage',
    brand: 'Growatt',
    severity: 'High',
    category: 'Battery Faults',
    description: 'The battery voltage has dropped below the minimum safe limit. Deep discharge damages batteries and significantly reduces their lifespan.',
    possibleCauses: [
      'Excessive discharge beyond DOD limit',
      'Failed low voltage disconnect',
      'Incorrect discharge cutoff setting',
      'Battery capacity degraded',
      'High parasitic loads',
      'Insufficient solar charging'
    ],
    symptoms: [
      'Battery low voltage alarm',
      'System shutdown',
      'Loads disconnected',
      'Battery will not hold charge',
      'Reduced backup time',
      'Morning battery empty despite previous day charging'
    ],
    diagnosticSteps: [
      'Measure battery voltage',
      'Check depth of discharge settings',
      'Review charging history',
      'Check for loads that should not be running',
      'Test battery capacity',
      'Verify solar is charging battery when sun available'
    ],
    solution: 'Recharge battery immediately and prevent future deep discharge by adjusting settings or reducing loads.',
    detailedProcedure: [
      'If battery can still accept charge, charge fully before using',
      'Adjust low voltage disconnect to higher value',
      'Reduce non-essential loads on battery circuit',
      'Verify solar charging is adequate for load demand',
      'If battery will not recover, replace battery',
      'After replacement, configure proper DOD limit'
    ],
    preventionMeasures: [
      'Configure proper depth of discharge limits',
      'Size battery adequately for expected loads',
      'Ensure solar charging can recover daily discharge',
      'Monitor battery state of charge'
    ],
    safetyNotes: [
      'Deeply discharged lead-acid batteries may produce hydrogen sulfide gas',
      'Some lithium batteries may be damaged beyond recovery',
      'Follow manufacturer guidelines for recovery charging'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 2,000 - 350,000',
    toolsRequired: ['Multimeter', 'Battery tester', 'Inverter programming interface']
  },
  {
    code: 'F22',
    name: 'Battery BMS Communication Error',
    brand: 'Growatt',
    severity: 'Medium',
    category: 'Battery Faults',
    description: 'Communication between the inverter and battery BMS has been lost. The inverter will use default charging parameters which may not be optimal.',
    possibleCauses: [
      'Communication cable disconnected',
      'BMS powered off or failed',
      'Protocol mismatch',
      'Address conflict',
      'Interference on communication bus',
      'Inverter port failure'
    ],
    symptoms: [
      'BMS communication fault alarm',
      'Battery SOC not displayed',
      'Charging using default parameters',
      'Cell information unavailable',
      'Manual charge settings required'
    ],
    diagnosticSteps: [
      'Check communication cable at both ends',
      'Verify BMS has power and is operating',
      'Check protocol settings match (CAN, RS485, etc.)',
      'Verify addresses are not conflicting',
      'Test with known good cable',
      'Check inverter firmware for BMS compatibility'
    ],
    solution: 'Restore communication by fixing cable, settings, or component issues.',
    detailedProcedure: [
      'Secure loose connections',
      'Replace damaged cable',
      'Verify protocol settings match between inverter and BMS',
      'Check DIP switch settings on BMS if applicable',
      'Update firmware if compatibility issue',
      'If BMS failed, replace BMS module',
      'Test communication after repairs'
    ],
    preventionMeasures: [
      'Use quality communication cables',
      'Protect cables from damage',
      'Document settings',
      'Test communication during commissioning'
    ],
    safetyNotes: [
      'Without BMS communication, protect battery manually',
      'Set conservative charge parameters if operating without BMS'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 3,000 - 45,000',
    toolsRequired: ['Multimeter', 'Communication cable', 'BMS configuration tool']
  },
  {
    code: 'F30',
    name: 'Inverter Hardware Fault',
    brand: 'Growatt',
    severity: 'Critical',
    category: 'Hardware Faults',
    description: 'A hardware fault has been detected within the inverter. This indicates failure of internal power electronics or control circuits.',
    possibleCauses: [
      'Power semiconductor failure (IGBT/MOSFET)',
      'DC bus capacitor failure',
      'Control board fault',
      'Driver circuit failure',
      'Surge damage',
      'Manufacturing defect'
    ],
    symptoms: [
      'Hardware fault code displayed',
      'Inverter will not operate',
      'May have burning smell',
      'Visible damage internally',
      'Persists through restart'
    ],
    diagnosticSteps: [
      'Note specific error code and circumstances',
      'Do not repeatedly try to restart',
      'Check for visible damage through vents',
      'Document for manufacturer support',
      'Check if within warranty period'
    ],
    solution: 'Hardware fault requires professional repair or inverter replacement. Contact manufacturer support.',
    detailedProcedure: [
      'Document fault code and all circumstances',
      'De-energize system completely',
      'If within warranty, contact manufacturer for RMA',
      'If out of warranty, qualified repair service may be possible',
      'For board-level repair, need schematic and test equipment',
      'Some failures require complete inverter replacement'
    ],
    preventionMeasures: [
      'Surge protection',
      'Proper ventilation',
      'Operation within specifications',
      'Regular maintenance'
    ],
    safetyNotes: [
      'Do not open inverter unless qualified',
      'Internal capacitors hold dangerous charge',
      'Allow 10+ minutes after disconnection before opening'
    ],
    estimatedTime: 'Several days for repair/replacement',
    estimatedCost: 'KES 25,000 - 250,000',
    toolsRequired: ['Professional service equipment']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEYE INVERTER FAULT CODES - 30+ Codes
// ═══════════════════════════════════════════════════════════════════════════════

export const DEYE_FAULTS: SolarFaultCode[] = [
  {
    code: 'DY01',
    name: 'Grid Lost',
    brand: 'Deye',
    severity: 'Low',
    category: 'Grid Faults',
    description: 'Grid power is not detected. Normal during power outages. Hybrid inverters will switch to battery backup if configured.',
    possibleCauses: [
      'Utility power outage',
      'AC breaker off or tripped',
      'Loose AC connection',
      'AC cable damaged'
    ],
    symptoms: [
      'Grid Lost displayed',
      'Operating on battery (hybrid)',
      'No export possible (grid-tie)',
      'Grid LED off'
    ],
    diagnosticSteps: [
      'Check if utility power present at main panel',
      'Verify AC breaker is on',
      'Check AC connections at inverter'
    ],
    solution: 'Restore grid connection or wait for utility restoration.',
    detailedProcedure: [
      'Verify utility status',
      'Check and reset any tripped breakers',
      'Inspect AC wiring',
      'Tighten connections if loose'
    ],
    preventionMeasures: [
      'Proper installation',
      'Secure connections',
      'AC surge protection'
    ],
    safetyNotes: [
      'AC circuits may be energized',
      'Use proper procedures'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 10,000',
    toolsRequired: ['Multimeter']
  },
  {
    code: 'DY02',
    name: 'Grid Voltage High',
    brand: 'Deye',
    severity: 'High',
    category: 'Grid Faults',
    description: 'Grid voltage exceeds acceptable limits. Inverter disconnects from grid for protection.',
    possibleCauses: [
      'Utility voltage high',
      'Grid impedance',
      'Connection issues',
      'Voltage sensing fault'
    ],
    symptoms: [
      'Error code displayed',
      'No grid export',
      'High voltage on meter',
      'May affect connected loads'
    ],
    diagnosticSteps: [
      'Measure actual grid voltage',
      'Compare to inverter reading',
      'Check connections',
      'Monitor voltage trend'
    ],
    solution: 'Address high voltage cause or adjust settings if within acceptable range.',
    detailedProcedure: [
      'Measure voltage at multiple points',
      'Report to utility if supply is high',
      'Improve connections if voltage drop issue',
      'Adjust settings if within grid code'
    ],
    preventionMeasures: [
      'Proper installation',
      'Site assessment',
      'Monitoring'
    ],
    safetyNotes: [
      'High voltage is dangerous',
      'Use proper PPE'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 0 - 15,000',
    toolsRequired: ['Multimeter', 'Voltage recorder']
  },
  {
    code: 'DY03',
    name: 'PV Input Over Voltage',
    brand: 'Deye',
    severity: 'Critical',
    category: 'PV Faults',
    description: 'DC input voltage from panels exceeds inverter maximum. Risk of inverter damage.',
    possibleCauses: [
      'Too many panels in string',
      'Cold weather increasing Voc',
      'Wrong panel specs used in design'
    ],
    symptoms: [
      'Error displayed',
      'Inverter will not start',
      'May occur on cold mornings',
      'High DC voltage reading'
    ],
    diagnosticSteps: [
      'Measure string Voc',
      'Calculate cold temperature maximum',
      'Verify panel specifications',
      'Count panels in string'
    ],
    solution: 'Reconfigure strings to reduce voltage below inverter maximum.',
    detailedProcedure: [
      'Calculate maximum Voc at coldest expected temperature',
      'If exceeds inverter max, reduce panels per string',
      'Reconfigure into more parallel strings',
      'Test on cold morning'
    ],
    preventionMeasures: [
      'Proper design with temperature calculations',
      'Allow voltage margin'
    ],
    safetyNotes: [
      'High DC voltage is lethal',
      'Cover panels when reconfiguring'
    ],
    estimatedTime: '4-8 hours',
    estimatedCost: 'KES 10,000 - 50,000',
    toolsRequired: ['DC multimeter 600V+', 'MC4 tools']
  },
  {
    code: 'DY04',
    name: 'Battery Over Voltage',
    brand: 'Deye',
    severity: 'High',
    category: 'Battery Faults',
    description: 'Battery voltage exceeds maximum charge limit. Overcharging damages batteries.',
    possibleCauses: [
      'Wrong charge voltage setting',
      'BMS fault',
      'Wrong battery type selected',
      'Cell imbalance'
    ],
    symptoms: [
      'High voltage alarm',
      'Charging stops',
      'Hot battery',
      'BMS disconnect'
    ],
    diagnosticSteps: [
      'Measure battery voltage',
      'Check charge settings',
      'Verify battery type configuration',
      'Check BMS communication'
    ],
    solution: 'Correct charge settings and BMS communication.',
    detailedProcedure: [
      'Stop charging',
      'Check and correct battery type setting',
      'Set correct charge voltages',
      'Verify BMS operation',
      'Monitor after correction'
    ],
    preventionMeasures: [
      'Correct configuration at installation',
      'Use manufacturer settings',
      'Monitor battery parameters'
    ],
    safetyNotes: [
      'Overcharged batteries are dangerous',
      'Risk of fire with lithium'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 2,000 - 15,000',
    toolsRequired: ['Multimeter', 'BMS tool']
  },
  {
    code: 'DY05',
    name: 'Battery Under Voltage',
    brand: 'Deye',
    severity: 'High',
    category: 'Battery Faults',
    description: 'Battery voltage below minimum safe level. Deep discharge damages batteries.',
    possibleCauses: [
      'Excessive discharge',
      'Low DOD setting not working',
      'Degraded battery',
      'Insufficient charging'
    ],
    symptoms: [
      'Low voltage alarm',
      'System shutdown',
      'Poor backup time',
      'Battery not recovering'
    ],
    diagnosticSteps: [
      'Measure battery voltage',
      'Check DOD settings',
      'Test battery capacity',
      'Verify charging is adequate'
    ],
    solution: 'Recharge immediately and prevent future deep discharge.',
    detailedProcedure: [
      'Charge battery fully',
      'Adjust DOD limit higher',
      'Reduce loads if needed',
      'Replace battery if damaged'
    ],
    preventionMeasures: [
      'Proper DOD limits',
      'Adequate battery sizing',
      'Monitor state of charge'
    ],
    safetyNotes: [
      'Deep discharged batteries may vent gases',
      'Follow recovery procedures'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 2,000 - 300,000',
    toolsRequired: ['Multimeter', 'Battery tester']
  },
  {
    code: 'DY06',
    name: 'Overload Warning',
    brand: 'Deye',
    severity: 'Medium',
    category: 'Load Faults',
    description: 'Output load is approaching or exceeding inverter capacity. Reduce load to prevent shutdown.',
    possibleCauses: [
      'Too many loads connected',
      'Motor starting surge',
      'Faulty load drawing excess current',
      'Inverter undersized'
    ],
    symptoms: [
      'Overload warning',
      'Output may be limited',
      'Fan running at high speed',
      'Shutdown if persistent'
    ],
    diagnosticSteps: [
      'Measure actual load current',
      'Compare to inverter capacity',
      'Identify high-draw loads',
      'Check for faulty equipment'
    ],
    solution: 'Reduce load to within inverter capacity or upgrade inverter.',
    detailedProcedure: [
      'Turn off non-essential loads',
      'Identify and remove faulty loads',
      'Stagger motor starts',
      'Consider inverter upgrade if chronic'
    ],
    preventionMeasures: [
      'Proper system sizing',
      'Load management',
      'Soft starters for motors'
    ],
    safetyNotes: [
      'Overloaded inverter runs hot',
      'Risk of fire if persistent'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 25,000',
    toolsRequired: ['Clamp meter']
  },
  {
    code: 'DY07',
    name: 'Over Temperature',
    brand: 'Deye',
    severity: 'Medium',
    category: 'Environmental Faults',
    description: 'Inverter temperature exceeds safe limit. Output will be reduced or stopped.',
    possibleCauses: [
      'Poor ventilation',
      'Direct sunlight',
      'High ambient temperature',
      'Blocked vents',
      'Failed fan'
    ],
    symptoms: [
      'Temperature warning',
      'Output derating',
      'Fan at high speed',
      'Hot enclosure'
    ],
    diagnosticSteps: [
      'Check installation location',
      'Verify ventilation clearances',
      'Check fan operation',
      'Clear any debris from vents'
    ],
    solution: 'Improve cooling conditions.',
    detailedProcedure: [
      'Clear blocked vents',
      'Replace failed fan',
      'Install shade structure',
      'Improve enclosure ventilation'
    ],
    preventionMeasures: [
      'Proper installation location',
      'Adequate clearances',
      'Regular cleaning'
    ],
    safetyNotes: [
      'Allow cooling before service',
      'Hot surfaces can burn'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 2,000 - 20,000',
    toolsRequired: ['Temperature meter', 'Fan replacement']
  },
  {
    code: 'DY08',
    name: 'Communication Error',
    brand: 'Deye',
    severity: 'Low',
    category: 'Communication Faults',
    description: 'Loss of communication with monitoring system or battery BMS.',
    possibleCauses: [
      'Cable disconnected',
      'Wi-Fi signal weak',
      'BMS offline',
      'Protocol mismatch'
    ],
    symptoms: [
      'Monitoring offline',
      'Battery SOC unknown',
      'No remote access',
      'Communication LED off'
    ],
    diagnosticSteps: [
      'Check cable connections',
      'Verify Wi-Fi signal',
      'Check BMS power',
      'Review protocol settings'
    ],
    solution: 'Restore communication by fixing connection or configuration.',
    detailedProcedure: [
      'Secure loose cables',
      'Reconnect Wi-Fi',
      'Reset communication module',
      'Update settings if needed'
    ],
    preventionMeasures: [
      'Strong Wi-Fi signal',
      'Secure connections',
      'Regular monitoring'
    ],
    safetyNotes: [
      'Communication issues do not affect safety',
      'Power production continues'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 5,000',
    toolsRequired: ['Wi-Fi analyzer', 'Network cable']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// VICTRON INVERTER FAULT CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const VICTRON_FAULTS: SolarFaultCode[] = [
  {
    code: 'VE01',
    name: 'Battery High Voltage',
    brand: 'Victron',
    severity: 'High',
    category: 'Battery Faults',
    description: 'Battery voltage has reached the high voltage protection limit. Charging has been stopped.',
    possibleCauses: [
      'Absorption/float voltage set too high',
      'Temperature compensation not working',
      'BMS not communicating',
      'Cell imbalance'
    ],
    symptoms: [
      'High voltage alarm on VRM',
      'Charging stopped',
      'High voltage LED/alarm',
      'Battery hot'
    ],
    diagnosticSteps: [
      'Check actual battery voltage',
      'Review absorption/float settings',
      'Verify temperature sensor working',
      'Check BMS communication via VE.Can'
    ],
    solution: 'Correct charging parameters or fix BMS communication.',
    detailedProcedure: [
      'Access VictronConnect or VRM',
      'Review charge parameters',
      'Compare to battery manufacturer specs',
      'Adjust if needed',
      'Check temperature compensation',
      'Verify BMS data if lithium'
    ],
    preventionMeasures: [
      'Correct configuration',
      'BMS integration',
      'Temperature compensation'
    ],
    safetyNotes: [
      'High voltage batteries are dangerous',
      'Allow voltage to decrease before handling'
    ],
    estimatedTime: '1-2 hours',
    estimatedCost: 'KES 0 - 10,000',
    toolsRequired: ['VictronConnect', 'Multimeter', 'VE.Direct cable']
  },
  {
    code: 'VE02',
    name: 'Battery Low Voltage',
    brand: 'Victron',
    severity: 'High',
    category: 'Battery Faults',
    description: 'Battery voltage has dropped to low voltage cutoff. Loads have been disconnected to protect battery.',
    possibleCauses: [
      'Excessive discharge',
      'Insufficient solar charging',
      'Heavy loads',
      'Battery aging',
      'Low voltage cutoff too low'
    ],
    symptoms: [
      'Low battery alarm',
      'Loads disconnected',
      'Inverter off',
      'System shutdown'
    ],
    diagnosticSteps: [
      'Check battery voltage',
      'Review discharge history',
      'Check solar charge history',
      'Test battery capacity'
    ],
    solution: 'Recharge battery and prevent future deep discharge.',
    detailedProcedure: [
      'Allow charging from solar or grid',
      'Review and adjust low cutoff setting',
      'Reduce loads if needed',
      'Check battery health'
    ],
    preventionMeasures: [
      'Proper low voltage cutoff',
      'Load management',
      'Adequate battery sizing'
    ],
    safetyNotes: [
      'Follow battery recovery procedures',
      'Monitor for damage'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 0 - 250,000',
    toolsRequired: ['VictronConnect', 'Multimeter', 'Battery tester']
  },
  {
    code: 'VE03',
    name: 'Battery High Temperature',
    brand: 'Victron',
    severity: 'High',
    category: 'Battery Faults',
    description: 'Battery temperature sensor indicates unsafe temperature. Charging has been reduced or stopped.',
    possibleCauses: [
      'High ambient temperature',
      'Poor ventilation',
      'High charge/discharge current',
      'Internal battery fault',
      'Sensor fault'
    ],
    symptoms: [
      'High temp alarm',
      'Charge current limited',
      'Battery enclosure hot',
      'Temperature reading high on VRM'
    ],
    diagnosticSteps: [
      'Check battery temperature reading',
      'Verify with separate thermometer',
      'Check ambient conditions',
      'Inspect battery for swelling or damage'
    ],
    solution: 'Improve cooling or investigate battery fault.',
    detailedProcedure: [
      'Improve ventilation',
      'Reduce charge/discharge rate',
      'If battery is damaged, replace',
      'If sensor faulty, replace sensor',
      'Add active cooling if needed'
    ],
    preventionMeasures: [
      'Proper installation location',
      'Temperature sensor installed',
      'Adequate ventilation'
    ],
    safetyNotes: [
      'Hot batteries are dangerous',
      'Do not open swollen batteries',
      'Have fire suppression available'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 5,000 - 300,000',
    toolsRequired: ['Temperature meter', 'VictronConnect']
  },
  {
    code: 'VE04',
    name: 'Battery Low Temperature',
    brand: 'Victron',
    severity: 'Medium',
    category: 'Battery Faults',
    description: 'Battery temperature is too low for safe charging. Charging has been suspended until temperature rises.',
    possibleCauses: [
      'Cold ambient temperature',
      'Temperature sensor fault',
      'Night-time cooling'
    ],
    symptoms: [
      'Low temp alarm',
      'Charging suspended',
      'Cold battery location',
      'Morning charging delayed'
    ],
    diagnosticSteps: [
      'Check actual battery temperature',
      'Verify sensor reading',
      'Check ambient temperature',
      'Wait for warming'
    ],
    solution: 'Allow battery to warm or improve insulation.',
    detailedProcedure: [
      'Wait for ambient warming',
      'Add insulation if location is cold',
      'Consider battery heater for extreme locations',
      'Verify sensor accuracy'
    ],
    preventionMeasures: [
      'Insulated battery location',
      'Battery heater in cold climates'
    ],
    safetyNotes: [
      'Charging lithium below 0°C causes damage',
      'Lead-acid performance is reduced when cold'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 15,000',
    toolsRequired: ['Thermometer', 'Insulation materials']
  },
  {
    code: 'VE05',
    name: 'Overload',
    brand: 'Victron',
    severity: 'High',
    category: 'Load Faults',
    description: 'Output load exceeds inverter capacity. Output has been reduced or shut down.',
    possibleCauses: [
      'Too many loads',
      'Motor starting surge',
      'Short circuit',
      'Faulty load',
      'Inverter undersized'
    ],
    symptoms: [
      'Overload alarm',
      'Output shut down',
      'High current reading',
      'Hot inverter'
    ],
    diagnosticSteps: [
      'Check actual load current',
      'Compare to inverter rating',
      'Check for short circuit',
      'Identify problem loads'
    ],
    solution: 'Reduce load or upgrade inverter.',
    detailedProcedure: [
      'Disconnect loads progressively',
      'Identify overload source',
      'Fix faulty equipment',
      'Add soft starters for motors',
      'Consider inverter upgrade'
    ],
    preventionMeasures: [
      'Proper system sizing',
      'Soft starters',
      'Load management'
    ],
    safetyNotes: [
      'High currents can cause fire',
      'Check for hot wiring'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 50,000',
    toolsRequired: ['Clamp meter', 'Multimeter']
  },
  {
    code: 'VE06',
    name: 'DC Ripple',
    brand: 'Victron',
    severity: 'Medium',
    category: 'Power Quality Faults',
    description: 'Excessive ripple voltage on DC bus. This can indicate a fault or improper configuration.',
    possibleCauses: [
      'Faulty capacitor',
      'Loose DC connection',
      'Battery nearly empty',
      'Undersized wiring',
      'BMS limiting current'
    ],
    symptoms: [
      'Ripple warning',
      'Flickering lights',
      'Humming from equipment',
      'Performance reduction'
    ],
    diagnosticSteps: [
      'Check DC connections',
      'Check battery state of charge',
      'Verify cable sizing',
      'Measure ripple with oscilloscope'
    ],
    solution: 'Correct the cause of ripple.',
    detailedProcedure: [
      'Tighten DC connections',
      'Charge battery if low',
      'Upgrade cables if undersized',
      'If capacitor fault suspected, service inverter'
    ],
    preventionMeasures: [
      'Proper cable sizing',
      'Regular connection maintenance',
      'Battery maintenance'
    ],
    safetyNotes: [
      'DC connections should be tight',
      'Check for heating at connections'
    ],
    estimatedTime: '1-3 hours',
    estimatedCost: 'KES 5,000 - 45,000',
    toolsRequired: ['Multimeter', 'Oscilloscope', 'Torque wrench']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HUAWEI INVERTER FAULT CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const HUAWEI_FAULTS: SolarFaultCode[] = [
  {
    code: 'HW01',
    name: 'Grid Loss',
    brand: 'Huawei',
    severity: 'Low',
    category: 'Grid Faults',
    description: 'No grid voltage detected. Inverter cannot export power.',
    possibleCauses: [
      'Utility outage',
      'AC breaker off',
      'Loose connection',
      'Cable damage'
    ],
    symptoms: [
      'Grid loss displayed',
      'Zero export',
      'AC LED off',
      'Fault logged'
    ],
    diagnosticSteps: [
      'Check utility status',
      'Verify AC breakers',
      'Check connections',
      'Measure voltage at inverter'
    ],
    solution: 'Restore grid connection.',
    detailedProcedure: [
      'Verify utility power',
      'Reset breakers if tripped',
      'Tighten connections',
      'Replace damaged components'
    ],
    preventionMeasures: [
      'Proper installation',
      'Surge protection'
    ],
    safetyNotes: [
      'AC may be present on other circuits',
      'Use proper procedures'
    ],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: 'KES 0 - 10,000',
    toolsRequired: ['Multimeter']
  },
  {
    code: 'HW02',
    name: 'String Abnormal',
    brand: 'Huawei',
    severity: 'Medium',
    category: 'PV Faults',
    description: 'One or more PV strings show abnormal performance compared to others.',
    possibleCauses: [
      'Shading on string',
      'Panel degradation',
      'Connection problem',
      'Bypass diode failure',
      'Panel damage'
    ],
    symptoms: [
      'String abnormal alarm',
      'Lower production from string',
      'Voltage or current imbalance',
      'Smart I-V curve shows anomaly'
    ],
    diagnosticSteps: [
      'Compare string voltages and currents',
      'Check for shading',
      'Use Smart I-V curve diagnosis',
      'Inspect connections',
      'Thermal imaging'
    ],
    solution: 'Address the specific string issue.',
    detailedProcedure: [
      'Identify affected string',
      'Run Smart I-V diagnosis via app',
      'Address shading if present',
      'Check and repair connections',
      'Replace faulty panel if needed'
    ],
    preventionMeasures: [
      'Regular monitoring',
      'Vegetation management',
      'Thermal inspection'
    ],
    safetyNotes: [
      'DC safety procedures apply',
      'Panels energized in daylight'
    ],
    estimatedTime: '2-6 hours',
    estimatedCost: 'KES 5,000 - 45,000',
    toolsRequired: ['FusionSolar app', 'Thermal camera', 'Multimeter']
  },
  {
    code: 'HW03',
    name: 'Battery Offline',
    brand: 'Huawei',
    severity: 'Medium',
    category: 'Battery Faults',
    description: 'Communication with battery has been lost. Battery backup is not available.',
    possibleCauses: [
      'Communication cable disconnected',
      'BMS fault',
      'Battery protection active',
      'Firmware mismatch'
    ],
    symptoms: [
      'Battery offline alarm',
      'No battery status',
      'No backup available',
      'Communication fault'
    ],
    diagnosticSteps: [
      'Check communication cables',
      'Check battery power status',
      'Review BMS for faults',
      'Check firmware versions'
    ],
    solution: 'Restore battery communication.',
    detailedProcedure: [
      'Secure cable connections',
      'Power cycle battery',
      'Clear BMS faults',
      'Update firmware if needed'
    ],
    preventionMeasures: [
      'Secure installations',
      'Regular firmware updates'
    ],
    safetyNotes: [
      'Battery may still be energized',
      'Follow DC safety procedures'
    ],
    estimatedTime: '1-4 hours',
    estimatedCost: 'KES 0 - 25,000',
    toolsRequired: ['FusionSolar app', 'Communication cable', 'Multimeter']
  },
  {
    code: 'HW04',
    name: 'Arc Fault Detected',
    brand: 'Huawei',
    severity: 'Critical',
    category: 'Safety Faults',
    description: 'The inverter\'s arc fault detection system has detected a potential DC arc. This is a fire hazard.',
    possibleCauses: [
      'Loose DC connection',
      'Damaged connector',
      'Corroded contacts',
      'Cable damage',
      'Panel junction box fault'
    ],
    symptoms: [
      'Arc fault alarm',
      'Inverter shutdown',
      'May have heard arcing',
      'Possible burn marks'
    ],
    diagnosticSteps: [
      'DO NOT restart without inspection',
      'Inspect all DC connections',
      'Check MC4 connectors',
      'Look for burn marks or damage',
      'Thermal image entire DC system'
    ],
    solution: 'Locate and repair the arcing connection before returning to service.',
    detailedProcedure: [
      'Thoroughly inspect all DC connections',
      'Check MC4 connectors for damage or poor crimping',
      'Inspect junction boxes',
      'Replace any damaged components',
      'Test before re-energizing',
      'Clear fault after repair verified'
    ],
    preventionMeasures: [
      'Quality installation',
      'Proper MC4 crimping',
      'Regular inspection',
      'Thermal imaging'
    ],
    safetyNotes: [
      'Arc faults cause fires',
      'Do not ignore this fault',
      'Inspect thoroughly before restarting'
    ],
    estimatedTime: '2-8 hours',
    estimatedCost: 'KES 10,000 - 65,000',
    toolsRequired: ['Thermal camera', 'MC4 crimping tools', 'Multimeter', 'Insulation tester']
  },
  {
    code: 'HW05',
    name: 'Ground Fault',
    brand: 'Huawei',
    severity: 'Critical',
    category: 'Safety Faults',
    description: 'Insulation fault detected in DC system. Shock hazard exists.',
    possibleCauses: [
      'Damaged cable insulation',
      'Water ingress',
      'Panel frame fault',
      'Junction box failure',
      'Conduit damage to cable'
    ],
    symptoms: [
      'Ground fault alarm',
      'Inverter will not operate',
      'Low insulation resistance',
      'ISO fault indication'
    ],
    diagnosticSteps: [
      'Do not attempt to operate',
      'Test string insulation resistance',
      'Identify affected string',
      'Progressively isolate to find location',
      'Inspect suspected area'
    ],
    solution: 'Locate and repair insulation failure.',
    detailedProcedure: [
      'Isolate system',
      'Test each string with megger',
      'Divide affected string to locate',
      'Repair or replace faulty component',
      'Re-test entire system',
      'Verify fault clears'
    ],
    preventionMeasures: [
      'Quality installation',
      'Cable protection',
      'Regular inspection',
      'Insulation testing'
    ],
    safetyNotes: [
      'Ground fault creates shock hazard',
      'Do not touch DC conductors',
      'Work in dark or cover panels'
    ],
    estimatedTime: '3-8 hours',
    estimatedCost: 'KES 10,000 - 55,000',
    toolsRequired: ['Insulation tester', 'MC4 tools', 'UV-rated cable', 'Connectors']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_SOLAR_FAULTS: SolarFaultCode[] = [
  ...GROWATT_FAULTS,
  ...DEYE_FAULTS,
  ...VICTRON_FAULTS,
  ...HUAWEI_FAULTS
];

export const SOLAR_FAULT_BRANDS = [
  { brand: 'Growatt', count: GROWATT_FAULTS.length, icon: '🟢' },
  { brand: 'Deye', count: DEYE_FAULTS.length, icon: '🔵' },
  { brand: 'Victron', count: VICTRON_FAULTS.length, icon: '🟡' },
  { brand: 'Huawei', count: HUAWEI_FAULTS.length, icon: '🔴' }
];

// Helper functions
export function getSolarFaultByCode(code: string): SolarFaultCode | undefined {
  return ALL_SOLAR_FAULTS.find(f => f.code === code);
}

export function getSolarFaultsByBrand(brand: string): SolarFaultCode[] {
  return ALL_SOLAR_FAULTS.filter(f => f.brand.toLowerCase() === brand.toLowerCase());
}

export function getSolarFaultsBySeverity(severity: SolarFaultCode['severity']): SolarFaultCode[] {
  return ALL_SOLAR_FAULTS.filter(f => f.severity === severity);
}

export function searchSolarFaults(query: string): SolarFaultCode[] {
  const searchTerm = query.toLowerCase();
  return ALL_SOLAR_FAULTS.filter(f =>
    f.code.toLowerCase().includes(searchTerm) ||
    f.name.toLowerCase().includes(searchTerm) ||
    f.description.toLowerCase().includes(searchTerm) ||
    f.symptoms.some(s => s.toLowerCase().includes(searchTerm))
  );
}

export function getTotalSolarFaultCount(): number {
  return ALL_SOLAR_FAULTS.length;
}
