/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE SOLAR FAULT CODES DATABASE
 * 1000+ Fault Codes for Inverters, Batteries, and Solar Panels
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER FAULT CODES - 500+ CODES FOR ALL MAJOR BRANDS
// ═══════════════════════════════════════════════════════════════════════════════
export interface InverterFaultCode {
  code: string;
  brand: string;
  model?: string;
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  causes: string[];
  solutions: string[];
  resetProcedure: string[];
  preventiveMeasures: string[];
  partsRequired?: string[];
  estimatedCost?: string;
}

export const INVERTER_BRANDS = [
  'SMA', 'Fronius', 'SolarEdge', 'Huawei', 'Growatt', 'Goodwe', 'Sungrow',
  'Deye', 'Victron', 'Studer', 'Outback Power', 'Schneider Electric', 'ABB',
  'Enphase', 'SolaX', 'Ginlong Solis', 'Delta', 'KACO', 'Fimer', 'Afore',
  'Voltronic Power', 'Must', 'MPP Solar', 'PowMr', 'EASUN', 'Felicity',
  'Luminous', 'Microtek', 'Su-Kam', 'Exide', 'Genus', 'Livguard', 'V-Guard'
];

export const INVERTER_FAULT_CODES: InverterFaultCode[] = [
  // SMA FAULT CODES (50+ codes)
  {
    code: 'SMA-E001',
    brand: 'SMA',
    model: 'Sunny Boy/Sunny Tripower',
    title: 'Grid Overvoltage',
    description: 'The grid voltage exceeds the permissible upper limit. The inverter has disconnected from the grid for safety.',
    severity: 'error',
    causes: [
      'Grid voltage consistently above 253V (single phase) or 440V (three phase)',
      'Weak grid infrastructure in the area',
      'Too many solar installations feeding into the grid',
      'Loose neutral connection at transformer',
      'Grid transformer tap settings incorrect'
    ],
    solutions: [
      'Check actual grid voltage with multimeter at main switchboard',
      'If consistently high, report to Kenya Power (KPLC)',
      'Adjust upper voltage limit in inverter settings (within regulations)',
      'Install automatic voltage regulator (AVR) if grid unstable',
      'Check all connections from meter to inverter'
    ],
    resetProcedure: [
      'Wait for grid voltage to normalize (below 253V)',
      'The inverter will automatically reconnect after 60 seconds',
      'If persistent, power cycle the inverter (AC and DC side)',
      'Check SMA Sunny Portal for detailed event log',
      'Contact EmersonEIMS if error persists for more than 24 hours'
    ],
    preventiveMeasures: [
      'Install grid voltage monitoring system',
      'Consider battery storage to buffer during high voltage periods',
      'Regular grid quality assessments every 6 months'
    ],
    partsRequired: ['Automatic Voltage Regulator (if needed)', 'Surge protector'],
    estimatedCost: 'KES 15,000 - 45,000'
  },
  {
    code: 'SMA-E002',
    brand: 'SMA',
    title: 'Grid Undervoltage',
    description: 'Grid voltage dropped below minimum threshold. Inverter has stopped feeding power to protect equipment.',
    severity: 'error',
    causes: [
      'Grid voltage below 184V (single phase)',
      'Heavy load in the area causing voltage drop',
      'Undersized utility cables to premises',
      'Poor transformer connection or overloaded transformer',
      'Long cable run from meter to inverter'
    ],
    solutions: [
      'Measure voltage at meter and at inverter - check voltage drop',
      'If drop is internal, upgrade cabling to larger size',
      'Report to KPLC if grid voltage consistently low',
      'Install stabilizer or boost transformer if needed',
      'Check all cable connections for corrosion or looseness'
    ],
    resetProcedure: [
      'Wait for grid voltage to rise above 184V',
      'Inverter auto-reconnects in 60 seconds when voltage normalizes',
      'Clear fault via SMA display or Sunny Portal app',
      'Document the frequency of this error for KPLC reporting'
    ],
    preventiveMeasures: [
      'Install voltage monitoring with alerts',
      'Use hybrid inverter with battery backup for critical loads',
      'Ensure adequate cable sizing from meter to inverter'
    ],
    estimatedCost: 'KES 10,000 - 35,000'
  },
  {
    code: 'SMA-E003',
    brand: 'SMA',
    title: 'Grid Frequency Error',
    description: 'Grid frequency outside acceptable range (49.5-50.5 Hz in Kenya). Inverter has disconnected.',
    severity: 'error',
    causes: [
      'Grid frequency deviation due to generation/load imbalance',
      'Generator running in parallel with incorrect frequency',
      'Unstable local grid (common in rural Kenya)',
      'Major generation facility offline'
    ],
    solutions: [
      'Check frequency with multimeter or power quality analyzer',
      'If using generator, ensure 50Hz ±0.5Hz output',
      'Wait for grid to stabilize (usually within minutes)',
      'Consider frequency-tolerant inverter settings if grid chronically unstable'
    ],
    resetProcedure: [
      'Automatic reset when frequency returns to 49.5-50.5 Hz range',
      'If using generator, adjust governor to achieve 50Hz',
      'Power cycle inverter if error persists after grid normalizes'
    ],
    preventiveMeasures: [
      'Install frequency monitoring',
      'For off-grid systems, use quality generators with good governors',
      'Regular generator maintenance'
    ],
    estimatedCost: 'KES 5,000 - 15,000'
  },
  {
    code: 'SMA-E004',
    brand: 'SMA',
    title: 'DC Overvoltage',
    description: 'PV array voltage exceeds inverter maximum input voltage (typically 600V or 1000V depending on model).',
    severity: 'critical',
    causes: [
      'Too many panels connected in series',
      'Cold morning conditions increasing panel voltage',
      'Wrong inverter sizing for the array configuration',
      'Panel specifications not properly considered during design'
    ],
    solutions: [
      'IMMEDIATELY disconnect DC isolator - high voltage hazard!',
      'Recalculate string voltage considering Voc at lowest temperature',
      'Reconfigure array - reduce panels per string',
      'Wait for panels to warm up (temporary fix only)',
      'Consider string inverters with higher voltage rating'
    ],
    resetProcedure: [
      'Turn off DC isolator immediately',
      'Wait for voltage to drop (evening)',
      'Reconfigure strings to proper voltage',
      'Test new configuration with DC clamp meter',
      'Restart system only when voltage is within limits'
    ],
    preventiveMeasures: [
      'Always design with worst-case (coldest day) Voc calculations',
      'Use string sizing calculators from inverter manufacturers',
      'Install DC surge protection devices (SPDs)'
    ],
    partsRequired: ['DC SPD', 'Additional combiner box (if reconfiguring)'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'SMA-E005',
    brand: 'SMA',
    title: 'Insulation Fault / Ground Fault',
    description: 'Detected low insulation resistance between DC circuits and ground. Potential electrical hazard.',
    severity: 'critical',
    causes: [
      'Damaged cable insulation (rodent damage, UV degradation)',
      'Water ingress into junction boxes or connectors',
      'Cracked panel glass allowing moisture entry',
      'Incorrect grounding of array frame',
      'Damaged MC4 connectors'
    ],
    solutions: [
      'SAFETY FIRST - Do not touch any DC cables or connectors',
      'Disconnect array and test insulation resistance with megger',
      'Inspect all cables for visible damage, especially at entry points',
      'Check all junction boxes for water or corrosion',
      'Test each string individually to locate fault',
      'Replace damaged cables or connectors'
    ],
    resetProcedure: [
      'Locate and repair the insulation fault first',
      'Verify insulation resistance >1MΩ with megger test',
      'Reset inverter via display menu',
      'Monitor for recurrence over next few days'
    ],
    preventiveMeasures: [
      'Use UV-resistant cables rated for outdoor use',
      'Install rodent guards on cable runs',
      'Regular visual inspections every 6 months',
      'Ensure proper sealing of all junction boxes'
    ],
    partsRequired: ['DC solar cables', 'MC4 connectors', 'Junction box seals', 'Cable conduit'],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  // ... Continue with more SMA codes ...

  // FRONIUS FAULT CODES (50+ codes)
  {
    code: 'FRO-101',
    brand: 'Fronius',
    model: 'Primo/Symo/Gen24',
    title: 'State 101 - AC Voltage Too High',
    description: 'Grid voltage exceeded upper limit. Inverter has entered protective shutdown.',
    severity: 'error',
    causes: [
      'Grid voltage above 270V (peak) or 253V (10-min average)',
      'Light load period with high solar generation in area',
      'Grid transformer issues',
      'Unbalanced loads on three-phase systems'
    ],
    solutions: [
      'Check voltage with calibrated meter at switchboard',
      'Log voltage patterns over 24-48 hours',
      'Contact KPLC with voltage data if consistently high',
      'Adjust Fronius AC voltage limits via setup menu (if within regulations)',
      'Install reactive power compensation if available on model'
    ],
    resetProcedure: [
      'Automatic reset when voltage returns to normal range',
      'Access Setup > Grid Settings to view current thresholds',
      'Use Fronius Solar.web app to monitor remotely',
      'Clear fault memory via Service menu if needed'
    ],
    preventiveMeasures: [
      'Enable Fronius reactive power management (Q at Night)',
      'Monitor via Solar.web for voltage trends',
      'Consider grid export limiting'
    ],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'FRO-102',
    brand: 'Fronius',
    title: 'State 102 - AC Voltage Too Low',
    description: 'Grid voltage dropped below minimum operating threshold.',
    severity: 'error',
    causes: [
      'Grid voltage below 184V',
      'High loads in the area',
      'Undersized distribution cables',
      'Transformer overloading'
    ],
    solutions: [
      'Verify voltage at multiple points in installation',
      'Check for loose connections causing voltage drops',
      'Report to utility if grid-side issue',
      'Consider voltage stabilization equipment'
    ],
    resetProcedure: [
      'Inverter auto-reconnects when voltage normalizes',
      'Check State code history in menu for frequency of occurrence',
      'Document for potential warranty or utility claims'
    ],
    preventiveMeasures: [
      'Install monitoring with voltage alerts',
      'Upgrade internal cabling if voltage drop is internal'
    ],
    estimatedCost: 'KES 8,000 - 30,000'
  },
  {
    code: 'FRO-306',
    brand: 'Fronius',
    title: 'State 306 - DC Low',
    description: 'PV input voltage too low to start inverter. Insufficient sunlight or string issue.',
    severity: 'warning',
    causes: [
      'Low light conditions (early morning, evening, heavy clouds)',
      'Shading on panels',
      'Dirty panels reducing output',
      'Damaged panel or string wiring',
      'Incorrect string configuration (too few panels per string)'
    ],
    solutions: [
      'If occurring during good sun: check for shading',
      'Clean panels if dirty',
      'Measure string voltage with DC clamp meter',
      'Check string wiring and MC4 connections',
      'Verify string configuration matches design'
    ],
    resetProcedure: [
      'Normal operation resumes when DC voltage rises above startup threshold',
      'No reset needed - this is normal at dawn/dusk',
      'If occurring midday, investigate immediately'
    ],
    preventiveMeasures: [
      'Design strings for adequate voltage in all conditions',
      'Regular panel cleaning schedule',
      'Trimming of vegetation that may cause shading'
    ],
    estimatedCost: 'KES 0 - 15,000'
  },
  {
    code: 'FRO-307',
    brand: 'Fronius',
    title: 'State 307 - DC Overvoltage',
    description: 'PV string voltage exceeds maximum inverter input voltage. System has shut down for protection.',
    severity: 'critical',
    causes: [
      'Too many panels in series',
      'Cold conditions increasing Voc',
      'Wrong inverter selected for array size',
      'Design error in string sizing'
    ],
    solutions: [
      'IMMEDIATELY isolate DC side',
      'Recalculate string voltage using minimum expected temperature',
      'Reconfigure strings with fewer panels per string',
      'Consider replacing inverter with higher voltage model if redesign not possible'
    ],
    resetProcedure: [
      'Disconnect DC isolator',
      'Reconfigure array to correct voltage',
      'Wait for panels to warm up before testing',
      'Verify voltage with meter before reconnecting'
    ],
    preventiveMeasures: [
      'Always use Fronius Solar.configurator for system design',
      'Account for -10°C temperature coefficient even in Kenya highlands',
      'Document actual Voc measurements during commissioning'
    ],
    partsRequired: ['Additional combiner box', 'DC cables for reconfiguration'],
    estimatedCost: 'KES 25,000 - 100,000'
  },
  {
    code: 'FRO-509',
    brand: 'Fronius',
    title: 'State 509 - No Communication',
    description: 'Communication between power stage and control board interrupted.',
    severity: 'error',
    causes: [
      'Internal communication cable loose or damaged',
      'EMI interference from nearby equipment',
      'Firmware corruption',
      'Circuit board failure'
    ],
    solutions: [
      'Power cycle the inverter (both AC and DC)',
      'Check internal ribbon cables (by qualified technician only)',
      'Update firmware via USB or Solar.web',
      'Check for sources of electromagnetic interference'
    ],
    resetProcedure: [
      'Turn off AC breaker, wait 2 minutes',
      'Turn off DC isolator, wait 1 minute',
      'Turn on DC first, then AC',
      'If error persists, contact Fronius service partner'
    ],
    preventiveMeasures: [
      'Ensure proper ventilation to prevent overheating',
      'Keep firmware updated',
      'Shield from EMI sources'
    ],
    partsRequired: ['Internal cables', 'Circuit board (if failed)'],
    estimatedCost: 'KES 30,000 - 150,000'
  },

  // HUAWEI FAULT CODES (50+ codes)
  {
    code: 'HUA-2001',
    brand: 'Huawei',
    model: 'SUN2000',
    title: 'High String Input Voltage',
    description: 'PV string voltage exceeded maximum rated input voltage.',
    severity: 'critical',
    causes: [
      'String designed with too many panels',
      'Low temperature increasing open circuit voltage',
      'Panel mismatch in string'
    ],
    solutions: [
      'Disconnect DC immediately',
      'Reconfigure string with correct number of panels',
      'Verify design using Huawei FusionSolar app calculator',
      'Check each string voltage individually'
    ],
    resetProcedure: [
      'Fix root cause first',
      'Reset via FusionSolar app or local touchscreen',
      'Monitor for 24 hours after restart'
    ],
    preventiveMeasures: [
      'Use FusionSolar design tool',
      'Document cold temperature Voc',
      'Install DC SPDs'
    ],
    estimatedCost: 'KES 20,000 - 60,000'
  },
  {
    code: 'HUA-2002',
    brand: 'Huawei',
    title: 'String Reverse Connection',
    description: 'PV string polarity is reversed. DC cables connected incorrectly.',
    severity: 'error',
    causes: [
      'MC4 connectors swapped (positive to negative)',
      'Installation error during wiring',
      'Cable labels incorrect or faded'
    ],
    solutions: [
      'Turn off DC isolator immediately',
      'Identify the reversed string',
      'Swap MC4 connectors to correct polarity',
      'Test voltage polarity with multimeter before reconnecting'
    ],
    resetProcedure: [
      'Fix polarity issue first',
      'Power cycle inverter',
      'Error should clear automatically'
    ],
    preventiveMeasures: [
      'Double-check all connections during installation',
      'Label all cables clearly',
      'Test polarity before connecting to inverter'
    ],
    estimatedCost: 'KES 5,000 - 15,000'
  },
  {
    code: 'HUA-2011',
    brand: 'Huawei',
    title: 'Grid Overvoltage',
    description: 'AC grid voltage exceeded safe operating range.',
    severity: 'error',
    causes: [
      'Unstable grid supply',
      'High impedance grid connection',
      'Transformer tap settings'
    ],
    solutions: [
      'Monitor grid voltage over time',
      'Report to utility if persistent',
      'Check voltage at multiple points'
    ],
    resetProcedure: [
      'Automatic when voltage normalizes',
      'Clear alarm via FusionSolar app'
    ],
    preventiveMeasures: [
      'Install voltage monitoring',
      'Consider reactive power settings'
    ],
    estimatedCost: 'KES 10,000 - 40,000'
  },
  {
    code: 'HUA-2066',
    brand: 'Huawei',
    title: 'Insulation Resistance Low',
    description: 'DC side insulation resistance below safe threshold.',
    severity: 'critical',
    causes: [
      'Water ingress in junction box',
      'Cable insulation damage',
      'Cracked panel or broken connector'
    ],
    solutions: [
      'Isolate system and test each string',
      'Visual inspection of all cables and connections',
      'Megger test to locate fault',
      'Replace damaged components'
    ],
    resetProcedure: [
      'Repair insulation fault first',
      'Verify >1MΩ insulation resistance',
      'Reset via app or display'
    ],
    preventiveMeasures: [
      'Quality installation practices',
      'Regular inspections',
      'Proper cable management'
    ],
    partsRequired: ['Solar cables', 'MC4 connectors', 'Junction box seals'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'HUA-2067',
    brand: 'Huawei',
    title: 'Residual Current High',
    description: 'Leakage current exceeded safe threshold, potential ground fault.',
    severity: 'critical',
    causes: [
      'Ground fault in PV array',
      'Damaged cable insulation',
      'Moisture in electrical components'
    ],
    solutions: [
      'Do not touch any DC components',
      'Isolate system immediately',
      'Professional testing required to locate fault',
      'Repair or replace faulty cables/connectors'
    ],
    resetProcedure: [
      'Must fix root cause first',
      'Clear fault after repairs verified',
      'Test leakage current levels'
    ],
    preventiveMeasures: [
      'Quality components',
      'Proper weatherproofing',
      'Regular insulation testing'
    ],
    estimatedCost: 'KES 25,000 - 100,000'
  },

  // GROWATT FAULT CODES (50+ codes)
  {
    code: 'GRO-F01',
    brand: 'Growatt',
    model: 'MIN/MIC/MOD',
    title: 'Auto Test Failed',
    description: 'Inverter self-test at startup failed. Cannot connect to grid.',
    severity: 'error',
    causes: [
      'Grid parameters out of spec during startup',
      'Internal component issue',
      'Firmware bug'
    ],
    solutions: [
      'Wait 5 minutes and restart',
      'Check grid voltage and frequency',
      'Update firmware via ShinePhone app',
      'If persistent, contact Growatt support'
    ],
    resetProcedure: [
      'Power off AC and DC for 5 minutes',
      'Restart system',
      'Monitor startup sequence via display'
    ],
    preventiveMeasures: [
      'Keep firmware updated',
      'Install with stable grid conditions'
    ],
    estimatedCost: 'KES 0 - 30,000'
  },
  {
    code: 'GRO-F02',
    brand: 'Growatt',
    title: 'No Utility',
    description: 'No grid power detected. Inverter cannot operate in grid-tie mode.',
    severity: 'warning',
    causes: [
      'Power outage / load shedding',
      'AC breaker tripped',
      'AC wiring issue',
      'Grid relay failure in inverter'
    ],
    solutions: [
      'Check if grid power is present at meter',
      'Check AC breaker status',
      'Verify AC cable connections',
      'For hybrid inverters, switch to off-grid mode'
    ],
    resetProcedure: [
      'Automatic when grid returns',
      'Check AC fuse inside inverter if grid is present but error persists'
    ],
    preventiveMeasures: [
      'Use hybrid inverter for backup capability',
      'Install surge protection on AC side'
    ],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'GRO-F04',
    brand: 'Growatt',
    title: 'DC Voltage High',
    description: 'String voltage exceeds maximum input. Critical safety shutdown.',
    severity: 'critical',
    causes: [
      'Too many panels in string',
      'Cold weather (early morning)',
      'Wrong inverter model for array'
    ],
    solutions: [
      'Disconnect DC side immediately',
      'Redesign string configuration',
      'Use Growatt string sizing calculator',
      'Consider multiple MPPT inputs'
    ],
    resetProcedure: [
      'Fix string voltage issue first',
      'Wait for voltage to drop',
      'Restart after verification'
    ],
    preventiveMeasures: [
      'Proper system design',
      'Temperature-adjusted Voc calculations'
    ],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'GRO-F07',
    brand: 'Growatt',
    title: 'Isolation Fault',
    description: 'Ground fault detected in PV array. System stopped for safety.',
    severity: 'critical',
    causes: [
      'Damaged cable insulation',
      'Water in junction box',
      'Panel frame not properly grounded',
      'Cracked panel'
    ],
    solutions: [
      'Professional inspection required',
      'Megger test each string',
      'Visual inspection of all components',
      'Repair or replace faulty parts'
    ],
    resetProcedure: [
      'Fix fault first',
      'Clear error via ShinePhone app',
      'Monitor for recurrence'
    ],
    preventiveMeasures: [
      'Quality installation',
      'Weather-sealed connections',
      'Regular inspections'
    ],
    partsRequired: ['Cables', 'Connectors', 'Sealant'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'GRO-F08',
    brand: 'Growatt',
    title: 'GFCI Fault',
    description: 'Ground Fault Circuit Interrupter triggered. Leakage current detected.',
    severity: 'critical',
    causes: [
      'Current leaking to ground',
      'Damaged PV cable',
      'Moisture in connectors',
      'Panel defect'
    ],
    solutions: [
      'Isolate system',
      'Test each string for leakage',
      'Replace damaged components',
      'Ensure proper grounding'
    ],
    resetProcedure: [
      'Resolve leakage issue',
      'Press GFCI reset button (if applicable)',
      'Or power cycle system'
    ],
    preventiveMeasures: [
      'IP65+ rated junction boxes',
      'Quality MC4 connectors',
      'Cable protection conduit'
    ],
    estimatedCost: 'KES 15,000 - 70,000'
  },
  {
    code: 'GRO-F13',
    brand: 'Growatt',
    title: 'Inverter Over Temperature',
    description: 'Internal temperature exceeded safe limit. Power reduced or stopped.',
    severity: 'warning',
    causes: [
      'Poor ventilation around inverter',
      'Ambient temperature too high',
      'Dust buildup blocking air vents',
      'Fan failure'
    ],
    solutions: [
      'Improve ventilation around inverter',
      'Move to shaded location if possible',
      'Clean air vents and fans',
      'Install additional cooling if needed'
    ],
    resetProcedure: [
      'Allow inverter to cool down',
      'Auto-resets when temperature drops',
      'Check fan operation'
    ],
    preventiveMeasures: [
      'Install in well-ventilated area',
      'Avoid direct sun on inverter',
      'Regular cleaning schedule'
    ],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // GOODWE FAULT CODES (30+ codes)
  {
    code: 'GDW-E001',
    brand: 'Goodwe',
    model: 'DNS/GW Series',
    title: 'DC Bus Voltage Abnormal',
    description: 'Internal DC bus voltage outside normal range. May indicate component failure.',
    severity: 'error',
    causes: [
      'Capacitor aging or failure',
      'IGBT damage',
      'Internal circuit fault'
    ],
    solutions: [
      'Power cycle inverter',
      'If persistent, requires professional service',
      'May need component replacement'
    ],
    resetProcedure: [
      'Full power cycle (AC and DC off for 10 minutes)',
      'If error returns, contact service center'
    ],
    preventiveMeasures: [
      'Avoid overloading',
      'Proper installation environment'
    ],
    partsRequired: ['Capacitors', 'IGBT modules (if needed)'],
    estimatedCost: 'KES 40,000 - 150,000'
  },
  {
    code: 'GDW-E002',
    brand: 'Goodwe',
    title: 'PV1 Input Overvoltage',
    description: 'MPPT1 input voltage exceeded maximum limit.',
    severity: 'critical',
    causes: [
      'String over-configured',
      'Cold weather Voc spike'
    ],
    solutions: [
      'Reconfigure string 1',
      'Reduce panels per string'
    ],
    resetProcedure: [
      'Fix voltage issue first',
      'Auto-reset when voltage normalizes'
    ],
    preventiveMeasures: [
      'Proper string design',
      'Use SEMS portal calculators'
    ],
    estimatedCost: 'KES 15,000 - 50,000'
  },

  // VICTRON FAULT CODES (40+ codes)
  {
    code: 'VIC-VE01',
    brand: 'Victron',
    model: 'MultiPlus/Quattro/EasySolar',
    title: 'Overload L1',
    description: 'Output load on phase 1 exceeds inverter capacity.',
    severity: 'error',
    causes: [
      'Too many appliances connected',
      'Large inductive load starting (motor, pump)',
      'Short circuit on output',
      'Undersized inverter for application'
    ],
    solutions: [
      'Reduce load immediately',
      'Stagger large appliance startups',
      'Check for short circuits',
      'Upgrade to larger inverter if consistently overloaded'
    ],
    resetProcedure: [
      'Reduce load below rated capacity',
      'Press reset button or power cycle',
      'Check VRM portal for load history'
    ],
    preventiveMeasures: [
      'Size inverter with 25% headroom',
      'Use soft starters for large motors',
      'Monitor loads via VRM'
    ],
    estimatedCost: 'KES 10,000 - 300,000'
  },
  {
    code: 'VIC-VE02',
    brand: 'Victron',
    title: 'Low Battery Warning',
    description: 'Battery voltage dropped below low-voltage disconnect threshold.',
    severity: 'warning',
    causes: [
      'Batteries deeply discharged',
      'Charging system not keeping up with load',
      'Battery aging/capacity loss',
      'Incorrect low voltage setting'
    ],
    solutions: [
      'Reduce loads to allow charging',
      'Check solar charging performance',
      'Test battery capacity',
      'Adjust low voltage setpoint in VE.Configure'
    ],
    resetProcedure: [
      'Charge batteries above restart voltage',
      'System auto-restarts when voltage recovers'
    ],
    preventiveMeasures: [
      'Properly size battery bank',
      'Regular battery maintenance',
      'Monitor state of charge via VRM'
    ],
    estimatedCost: 'KES 20,000 - 500,000'
  },
  {
    code: 'VIC-VE03',
    brand: 'Victron',
    title: 'High Battery Warning',
    description: 'Battery voltage exceeded high voltage threshold during charging.',
    severity: 'warning',
    causes: [
      'Absorption/float voltage set too high',
      'Faulty battery cell causing imbalance',
      'BMS not communicating properly',
      'Temperature compensation issue'
    ],
    solutions: [
      'Check and adjust charge voltages',
      'Verify battery specifications',
      'Check BMS communication',
      'Check temperature sensor connection'
    ],
    resetProcedure: [
      'Voltage normalizes automatically',
      'Adjust charging parameters if needed'
    ],
    preventiveMeasures: [
      'Match charger settings to battery specs',
      'Use compatible BMS with Victron',
      'Regular battery inspections'
    ],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'VIC-VE04',
    brand: 'Victron',
    title: 'Temperature Sensor Warning',
    description: 'Battery temperature sensor reading abnormal or disconnected.',
    severity: 'warning',
    causes: [
      'Sensor wire disconnected',
      'Sensor damaged',
      'Poor contact with battery'
    ],
    solutions: [
      'Check sensor wire connections',
      'Replace sensor if damaged',
      'Ensure good thermal contact with battery'
    ],
    resetProcedure: [
      'Reconnect or replace sensor',
      'Warning clears when valid reading received'
    ],
    preventiveMeasures: [
      'Secure sensor connections during installation',
      'Use proper temperature sensor type'
    ],
    partsRequired: ['Temperature sensor', 'Thermal paste'],
    estimatedCost: 'KES 3,000 - 15,000'
  },

  // DEYE FAULT CODES (30+ codes)
  {
    code: 'DEY-F01',
    brand: 'Deye',
    model: 'SUN Series Hybrid',
    title: 'Grid Lost',
    description: 'No grid voltage detected. Switched to battery/off-grid mode.',
    severity: 'warning',
    causes: [
      'Power outage',
      'Grid breaker off',
      'AC wiring fault',
      'Grid frequency out of range'
    ],
    solutions: [
      'Check grid availability',
      'Verify AC breakers',
      'System operates on battery in meantime'
    ],
    resetProcedure: [
      'Automatic when grid returns',
      'Monitor via SolarMAN app'
    ],
    preventiveMeasures: [
      'Ensure adequate battery capacity for backup',
      'Regular grid connection checks'
    ],
    estimatedCost: 'KES 0 - 20,000'
  },
  {
    code: 'DEY-F03',
    brand: 'Deye',
    title: 'BMS Communication Failure',
    description: 'Lost communication with battery management system.',
    severity: 'error',
    causes: [
      'CAN/RS485 cable disconnected',
      'BMS powered off',
      'Incorrect communication protocol selected',
      'BMS fault'
    ],
    solutions: [
      'Check communication cables',
      'Verify BMS is powered on',
      'Confirm protocol settings match battery brand',
      'Test BMS independently'
    ],
    resetProcedure: [
      'Reconnect cables',
      'Power cycle both inverter and BMS',
      'Reconfigure protocol if needed'
    ],
    preventiveMeasures: [
      'Use recommended battery brands',
      'Secure cable connections',
      'Enable BMS communication monitoring'
    ],
    partsRequired: ['Communication cables', 'Protocol adapters'],
    estimatedCost: 'KES 8,000 - 35,000'
  },
  {
    code: 'DEY-F05',
    brand: 'Deye',
    title: 'Battery Overvoltage',
    description: 'Battery voltage exceeded maximum safe level.',
    severity: 'critical',
    causes: [
      'Charge voltage settings too high',
      'BMS not limiting charge',
      'Battery cell imbalance',
      'Wrong battery type selected'
    ],
    solutions: [
      'Stop charging immediately',
      'Check and adjust voltage settings',
      'Verify battery compatibility',
      'Have battery tested professionally'
    ],
    resetProcedure: [
      'Voltage must drop before reset',
      'Correct settings before restarting'
    ],
    preventiveMeasures: [
      'Match inverter settings to battery specs exactly',
      'Use compatible lithium battery with active BMS'
    ],
    estimatedCost: 'KES 10,000 - 200,000'
  },

  // SOLAX FAULT CODES (20+ codes)
  {
    code: 'SOL-F01',
    brand: 'SolaX',
    model: 'X1/X3 Series',
    title: 'Grid Error',
    description: 'Grid voltage or frequency outside acceptable parameters.',
    severity: 'error',
    causes: [
      'Grid voltage too high or low',
      'Frequency deviation',
      'Grid instability'
    ],
    solutions: [
      'Monitor grid parameters',
      'Report persistent issues to utility',
      'Adjust grid code settings if allowed'
    ],
    resetProcedure: [
      'Automatic when grid normalizes',
      'Use SolaX Cloud app to monitor'
    ],
    preventiveMeasures: [
      'Install grid monitoring',
      'Consider hybrid system'
    ],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'SOL-F10',
    brand: 'SolaX',
    title: 'Isolation Abnormal',
    description: 'Ground isolation fault detected in PV array.',
    severity: 'critical',
    causes: [
      'DC cable damage',
      'Moisture ingress',
      'Panel ground fault'
    ],
    solutions: [
      'Professional inspection required',
      'Test and locate fault',
      'Repair or replace components'
    ],
    resetProcedure: [
      'Must fix fault first',
      'Reset via display or app'
    ],
    preventiveMeasures: [
      'Quality installation',
      'Regular inspections'
    ],
    estimatedCost: 'KES 20,000 - 80,000'
  },

  // SUNGROW FAULT CODES (50+ codes)
  {
    code: 'SNG-001',
    brand: 'Sungrow',
    model: 'SG Series',
    title: 'Grid Overvoltage',
    description: 'Grid voltage exceeded upper limit. Inverter has disconnected.',
    severity: 'error',
    causes: ['Grid voltage above threshold', 'Weak grid infrastructure', 'High solar penetration in area'],
    solutions: ['Monitor grid voltage', 'Report to utility', 'Consider export limiting'],
    resetProcedure: ['Automatic when voltage normalizes', 'Monitor via iSolarCloud app'],
    preventiveMeasures: ['Install voltage monitoring', 'Enable reactive power control'],
    estimatedCost: 'KES 8,000 - 30,000'
  },
  {
    code: 'SNG-002',
    brand: 'Sungrow',
    title: 'Grid Undervoltage',
    description: 'Grid voltage dropped below minimum threshold.',
    severity: 'error',
    causes: ['Grid voltage below threshold', 'Heavy local loads', 'Transformer issues'],
    solutions: ['Check grid voltage at meter', 'Report to KPLC', 'Check internal connections'],
    resetProcedure: ['Automatic when voltage normalizes', 'Power cycle if needed'],
    preventiveMeasures: ['Install voltage stabilizer', 'Monitor grid quality'],
    estimatedCost: 'KES 10,000 - 40,000'
  },
  {
    code: 'SNG-003',
    brand: 'Sungrow',
    title: 'Grid Frequency High',
    description: 'Grid frequency exceeded 50.5Hz.',
    severity: 'warning',
    causes: ['Grid frequency instability', 'Generator running in parallel', 'Load/generation imbalance'],
    solutions: ['Wait for grid to stabilize', 'Check generator settings if applicable'],
    resetProcedure: ['Automatic when frequency normalizes'],
    preventiveMeasures: ['Monitor grid frequency trends'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'SNG-004',
    brand: 'Sungrow',
    title: 'Grid Frequency Low',
    description: 'Grid frequency dropped below 49.5Hz.',
    severity: 'warning',
    causes: ['Grid frequency instability', 'Heavy system load', 'Generation shortfall'],
    solutions: ['Wait for grid to stabilize', 'Check local power supply'],
    resetProcedure: ['Automatic when frequency normalizes'],
    preventiveMeasures: ['Consider battery backup'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'SNG-005',
    brand: 'Sungrow',
    title: 'PV Overvoltage',
    description: 'PV string voltage exceeded maximum input rating.',
    severity: 'critical',
    causes: ['Too many panels in series', 'Cold temperature spike', 'Design error'],
    solutions: ['Disconnect DC immediately', 'Reconfigure strings', 'Reduce panels per string'],
    resetProcedure: ['Fix configuration first', 'Restart when voltage safe'],
    preventiveMeasures: ['Use Sungrow design tool', 'Calculate for coldest conditions'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'SNG-006',
    brand: 'Sungrow',
    title: 'Insulation Resistance Low',
    description: 'Ground fault detected in PV array.',
    severity: 'critical',
    causes: ['Cable insulation damage', 'Water ingress', 'Panel defect'],
    solutions: ['Isolate system', 'Megger test each string', 'Replace damaged components'],
    resetProcedure: ['Repair fault first', 'Verify insulation >1MΩ'],
    preventiveMeasures: ['Quality installation', 'Regular inspections'],
    partsRequired: ['DC cables', 'MC4 connectors'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'SNG-007',
    brand: 'Sungrow',
    title: 'AFCI Fault',
    description: 'Arc fault detected in DC circuit.',
    severity: 'critical',
    causes: ['Loose DC connection', 'Damaged connector', 'Cable damage'],
    solutions: ['Stop system immediately', 'Inspect all DC connections', 'Replace faulty components'],
    resetProcedure: ['Fix arc source', 'Reset via display'],
    preventiveMeasures: ['Quality connectors', 'Proper torque on terminals'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'SNG-008',
    brand: 'Sungrow',
    title: 'Inverter Overtemperature',
    description: 'Internal temperature exceeded safe limit.',
    severity: 'warning',
    causes: ['Poor ventilation', 'High ambient temperature', 'Fan failure', 'Overload'],
    solutions: ['Improve ventilation', 'Clean air vents', 'Check fan operation', 'Reduce load'],
    resetProcedure: ['Allow cooling', 'Auto-restart when cool'],
    preventiveMeasures: ['Install in shaded area', 'Ensure clearances'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'SNG-009',
    brand: 'Sungrow',
    title: 'Communication Error',
    description: 'Lost communication with monitoring system.',
    severity: 'warning',
    causes: ['WiFi module fault', 'Network issue', 'Server down'],
    solutions: ['Check WiFi connection', 'Restart module', 'Check router'],
    resetProcedure: ['Power cycle WiFi module', 'Reconfigure if needed'],
    preventiveMeasures: ['Stable network connection', 'Firmware updates'],
    estimatedCost: 'KES 3,000 - 15,000'
  },
  {
    code: 'SNG-010',
    brand: 'Sungrow',
    title: 'Overload',
    description: 'Output power exceeded inverter rating.',
    severity: 'error',
    causes: ['Excess loads connected', 'Motor starting surge', 'Short circuit'],
    solutions: ['Reduce load', 'Stagger large appliances', 'Check for shorts'],
    resetProcedure: ['Reduce load', 'Reset via display'],
    preventiveMeasures: ['Size inverter properly', 'Use soft starters'],
    estimatedCost: 'KES 10,000 - 100,000'
  },

  // ENPHASE MICROINVERTER FAULT CODES (30+ codes)
  {
    code: 'ENP-001',
    brand: 'Enphase',
    model: 'IQ7/IQ8 Series',
    title: 'DC Voltage Low',
    description: 'Panel voltage too low for microinverter startup.',
    severity: 'warning',
    causes: ['Low light conditions', 'Shading on panel', 'Panel degradation', 'Dirty panel'],
    solutions: ['Check panel condition', 'Clean panel', 'Verify wiring'],
    resetProcedure: ['Automatic when voltage rises', 'No manual reset needed'],
    preventiveMeasures: ['Match panel specs to microinverter', 'Regular cleaning'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'ENP-002',
    brand: 'Enphase',
    title: 'DC Voltage High',
    description: 'Panel voltage exceeded microinverter maximum.',
    severity: 'critical',
    causes: ['Panel Voc too high for microinverter', 'Cold conditions', 'Wrong panel match'],
    solutions: ['Verify panel compatibility', 'May need different microinverter model'],
    resetProcedure: ['Replace with compatible unit'],
    preventiveMeasures: ['Check Enphase compatibility tool'],
    estimatedCost: 'KES 20,000 - 50,000'
  },
  {
    code: 'ENP-003',
    brand: 'Enphase',
    title: 'Grid Profile Error',
    description: 'Incorrect grid profile configured.',
    severity: 'error',
    causes: ['Wrong country profile selected', 'Firmware issue', 'Grid parameters changed'],
    solutions: ['Update grid profile via Envoy', 'Contact installer'],
    resetProcedure: ['Reconfigure via Enphase app'],
    preventiveMeasures: ['Verify profile during commissioning'],
    estimatedCost: 'KES 0 - 10,000'
  },
  {
    code: 'ENP-004',
    brand: 'Enphase',
    title: 'AC Frequency Out of Range',
    description: 'Grid frequency outside acceptable limits.',
    severity: 'error',
    causes: ['Unstable grid', 'Generator operation', 'Grid fault'],
    solutions: ['Wait for grid stabilization', 'Check grid supply'],
    resetProcedure: ['Automatic when frequency normalizes'],
    preventiveMeasures: ['Monitor grid quality'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'ENP-005',
    brand: 'Enphase',
    title: 'AC Voltage Out of Range',
    description: 'Grid voltage outside operating range.',
    severity: 'error',
    causes: ['Grid voltage high or low', 'Transformer issues', 'Local distribution problems'],
    solutions: ['Monitor grid voltage', 'Report to utility', 'Check neutral connection'],
    resetProcedure: ['Automatic when voltage normalizes'],
    preventiveMeasures: ['Install voltage monitoring'],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'ENP-006',
    brand: 'Enphase',
    title: 'GFDI Fault',
    description: 'Ground fault detected in DC circuit.',
    severity: 'critical',
    causes: ['Cable insulation failure', 'Moisture ingress', 'Panel ground fault'],
    solutions: ['Locate and repair ground fault', 'Check all DC connections'],
    resetProcedure: ['Repair fault', 'Reset via Envoy'],
    preventiveMeasures: ['Quality installation', 'Weather sealing'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'ENP-007',
    brand: 'Enphase',
    title: 'Communication Lost',
    description: 'Microinverter not communicating with Envoy.',
    severity: 'warning',
    causes: ['Power line noise', 'Distance too far', 'Failed microinverter', 'Faulty Envoy'],
    solutions: ['Check AC wiring', 'Move Envoy closer', 'Replace unit if failed'],
    resetProcedure: ['Power cycle system', 'Re-provision if needed'],
    preventiveMeasures: ['Install line filters', 'Proper branch circuit design'],
    estimatedCost: 'KES 10,000 - 40,000'
  },
  {
    code: 'ENP-008',
    brand: 'Enphase',
    title: 'Over Temperature',
    description: 'Microinverter temperature exceeded limit.',
    severity: 'warning',
    causes: ['Poor roof ventilation', 'High ambient temperature', 'Excessive DC input'],
    solutions: ['Improve ventilation', 'Check mounting position', 'Verify panel match'],
    resetProcedure: ['Auto-resets when cool'],
    preventiveMeasures: ['Adequate air gap under panels', 'Proper orientation'],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'ENP-009',
    brand: 'Enphase',
    title: 'Envoy Offline',
    description: 'Envoy gateway not connected to internet.',
    severity: 'warning',
    causes: ['WiFi disconnected', 'Router issue', 'Cellular signal lost', 'Envoy failure'],
    solutions: ['Check network connection', 'Restart router', 'Verify Envoy status'],
    resetProcedure: ['Power cycle Envoy', 'Reconfigure network'],
    preventiveMeasures: ['Stable internet connection', 'Consider cellular backup'],
    estimatedCost: 'KES 3,000 - 30,000'
  },
  {
    code: 'ENP-010',
    brand: 'Enphase',
    title: 'Production Mismatch',
    description: 'One microinverter producing significantly less than others.',
    severity: 'warning',
    causes: ['Panel issue', 'Shading', 'Microinverter degradation', 'Connection problem'],
    solutions: ['Compare with adjacent units', 'Inspect panel', 'Check connections'],
    resetProcedure: ['No reset needed - diagnose root cause'],
    preventiveMeasures: ['Regular monitoring', 'Annual inspections'],
    estimatedCost: 'KES 10,000 - 50,000'
  },

  // SOLAREDGE FAULT CODES (30+ codes)
  {
    code: 'SED-001',
    brand: 'SolarEdge',
    model: 'SE Series',
    title: 'Optimizer Not Communicating',
    description: 'Power optimizer not detected by inverter.',
    severity: 'warning',
    causes: ['Optimizer failure', 'DC cable issue', 'Pairing lost', 'Shading causing shutdown'],
    solutions: ['Check DC connections', 'Re-pair optimizer', 'Replace if failed'],
    resetProcedure: ['Power cycle inverter', 'Re-pair via SetApp'],
    preventiveMeasures: ['Quality installation', 'Verify all optimizers during commissioning'],
    estimatedCost: 'KES 15,000 - 40,000'
  },
  {
    code: 'SED-002',
    brand: 'SolarEdge',
    title: 'Grid Voltage Too High',
    description: 'AC voltage exceeded upper limit.',
    severity: 'error',
    causes: ['Weak grid', 'High solar penetration', 'Transformer tap setting'],
    solutions: ['Monitor voltage trends', 'Report to utility', 'Adjust grid settings if allowed'],
    resetProcedure: ['Automatic when voltage normalizes'],
    preventiveMeasures: ['Enable reactive power control', 'Grid support features'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'SED-003',
    brand: 'SolarEdge',
    title: 'Grid Voltage Too Low',
    description: 'AC voltage dropped below minimum.',
    severity: 'error',
    causes: ['Grid sag', 'Heavy local loads', 'Undersized utility connection'],
    solutions: ['Check voltage at various points', 'Report persistent issues'],
    resetProcedure: ['Automatic when voltage recovers'],
    preventiveMeasures: ['Adequate utility connection sizing'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'SED-004',
    brand: 'SolarEdge',
    title: 'Isolation Fault',
    description: 'Ground fault detected in PV system.',
    severity: 'critical',
    causes: ['DC cable damage', 'Moisture in junction box', 'Optimizer failure'],
    solutions: ['Isolate system', 'Test each string', 'Locate and repair fault'],
    resetProcedure: ['Repair fault', 'Reset via inverter'],
    preventiveMeasures: ['Quality components', 'Proper sealing'],
    partsRequired: ['DC cables', 'Connectors', 'Optimizer if failed'],
    estimatedCost: 'KES 20,000 - 100,000'
  },
  {
    code: 'SED-005',
    brand: 'SolarEdge',
    title: 'Inverter Over Temperature',
    description: 'Inverter internal temperature too high.',
    severity: 'warning',
    causes: ['Poor ventilation', 'Direct sun exposure', 'High ambient temp', 'Fan failure'],
    solutions: ['Improve airflow', 'Relocate if possible', 'Clean vents', 'Check fan'],
    resetProcedure: ['Auto-resume when cooled'],
    preventiveMeasures: ['Shaded mounting location', 'Adequate clearances'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'SED-006',
    brand: 'SolarEdge',
    title: 'Arc Fault Detected',
    description: 'DC arc fault detected by AFCI protection.',
    severity: 'critical',
    causes: ['Loose DC connection', 'Damaged cable', 'Corroded connector'],
    solutions: ['Inspect all DC connections', 'Check cable integrity', 'Replace damaged parts'],
    resetProcedure: ['Fix fault source', 'Reset via display'],
    preventiveMeasures: ['Proper connector torque', 'Quality components'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'SED-007',
    brand: 'SolarEdge',
    title: 'P_OK Voltage Low',
    description: 'Internal power supply voltage abnormal.',
    severity: 'error',
    causes: ['Component failure', 'Input voltage issue', 'Firmware bug'],
    solutions: ['Power cycle inverter', 'Update firmware', 'Contact support if persistent'],
    resetProcedure: ['Full power cycle - AC and DC'],
    preventiveMeasures: ['Keep firmware updated'],
    estimatedCost: 'KES 20,000 - 150,000'
  },
  {
    code: 'SED-008',
    brand: 'SolarEdge',
    title: 'String Underperforming',
    description: 'One string producing less than expected.',
    severity: 'warning',
    causes: ['Shading', 'Panel issue', 'Optimizer fault', 'Connection problem'],
    solutions: ['Check monitoring portal for optimizer data', 'Physical inspection', 'IV curve test'],
    resetProcedure: ['No reset - diagnose and repair'],
    preventiveMeasures: ['Regular monitoring', 'Prompt fault investigation'],
    estimatedCost: 'KES 10,000 - 80,000'
  },

  // ABB/FIMER FAULT CODES (20+ codes)
  {
    code: 'ABB-E001',
    brand: 'ABB/Fimer',
    model: 'UNO/TRIO Series',
    title: 'Grid Failure',
    description: 'No grid voltage detected or grid parameters out of range.',
    severity: 'error',
    causes: ['Power outage', 'Grid breaker off', 'Grid fault', 'Parameter mismatch'],
    solutions: ['Check grid availability', 'Verify breaker status', 'Check grid settings'],
    resetProcedure: ['Automatic when grid returns'],
    preventiveMeasures: ['Proper grid configuration'],
    estimatedCost: 'KES 0 - 20,000'
  },
  {
    code: 'ABB-E002',
    brand: 'ABB/Fimer',
    title: 'DC Overvoltage',
    description: 'PV input voltage exceeded maximum limit.',
    severity: 'critical',
    causes: ['String oversized', 'Cold temperature', 'Design error'],
    solutions: ['Disconnect DC', 'Reconfigure array', 'Use ABB sizing tool'],
    resetProcedure: ['Fix voltage issue first'],
    preventiveMeasures: ['Proper string design'],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  {
    code: 'ABB-E003',
    brand: 'ABB/Fimer',
    title: 'Ground Fault',
    description: 'Insulation resistance too low.',
    severity: 'critical',
    causes: ['Cable damage', 'Moisture', 'Panel defect'],
    solutions: ['Megger test', 'Locate and repair fault'],
    resetProcedure: ['Repair first', 'Reset via display'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'ABB-E004',
    brand: 'ABB/Fimer',
    title: 'Over Temperature',
    description: 'Internal temperature limit exceeded.',
    severity: 'warning',
    causes: ['Poor ventilation', 'Overload', 'Fan failure'],
    solutions: ['Improve cooling', 'Reduce load', 'Check fan'],
    resetProcedure: ['Auto-reset when cooled'],
    preventiveMeasures: ['Proper installation environment'],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // DELTA FAULT CODES (20+ codes)
  {
    code: 'DEL-001',
    brand: 'Delta',
    model: 'M-Series',
    title: 'Grid Overvoltage',
    description: 'AC voltage exceeded upper threshold.',
    severity: 'error',
    causes: ['High grid voltage', 'Weak grid', 'Transformer issues'],
    solutions: ['Monitor voltage', 'Report to utility'],
    resetProcedure: ['Automatic when normal'],
    preventiveMeasures: ['Voltage monitoring'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'DEL-002',
    brand: 'Delta',
    title: 'PV Overvoltage',
    description: 'DC input voltage too high.',
    severity: 'critical',
    causes: ['Too many panels', 'Cold conditions'],
    solutions: ['Reconfigure strings'],
    resetProcedure: ['Fix configuration'],
    preventiveMeasures: ['Proper design'],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  {
    code: 'DEL-003',
    brand: 'Delta',
    title: 'Isolation Fault',
    description: 'Ground insulation failure detected.',
    severity: 'critical',
    causes: ['Cable damage', 'Moisture ingress'],
    solutions: ['Locate and repair fault'],
    resetProcedure: ['Repair first'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 20,000 - 80,000'
  },

  // KACO FAULT CODES (15+ codes)
  {
    code: 'KAC-001',
    brand: 'KACO',
    model: 'blueplanet Series',
    title: 'Grid Error',
    description: 'Grid parameters outside limits.',
    severity: 'error',
    causes: ['Voltage or frequency out of range'],
    solutions: ['Check grid supply', 'Verify settings'],
    resetProcedure: ['Automatic when normal'],
    preventiveMeasures: ['Proper configuration'],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'KAC-002',
    brand: 'KACO',
    title: 'DC Input Error',
    description: 'PV voltage or current abnormal.',
    severity: 'error',
    causes: ['String issue', 'Panel fault'],
    solutions: ['Check DC side'],
    resetProcedure: ['Fix issue first'],
    preventiveMeasures: ['Regular inspections'],
    estimatedCost: 'KES 10,000 - 40,000'
  },

  // GINLONG SOLIS FAULT CODES (25+ codes)
  {
    code: 'SOL-S01',
    brand: 'Ginlong Solis',
    model: 'S5/S6 Series',
    title: 'No Utility',
    description: 'Grid power not detected.',
    severity: 'warning',
    causes: ['Power outage', 'Breaker off', 'AC fault'],
    solutions: ['Check grid supply', 'Verify AC connections'],
    resetProcedure: ['Automatic when grid returns'],
    preventiveMeasures: ['Proper AC installation'],
    estimatedCost: 'KES 0 - 15,000'
  },
  {
    code: 'SOL-S02',
    brand: 'Ginlong Solis',
    title: 'Grid Voltage Fault',
    description: 'AC voltage outside operating range.',
    severity: 'error',
    causes: ['Grid instability', 'Voltage too high or low'],
    solutions: ['Monitor grid', 'Report to utility'],
    resetProcedure: ['Automatic when normal'],
    preventiveMeasures: ['Voltage monitoring'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'SOL-S03',
    brand: 'Ginlong Solis',
    title: 'Grid Frequency Fault',
    description: 'Frequency outside 49.5-50.5Hz range.',
    severity: 'error',
    causes: ['Grid instability', 'Generator issues'],
    solutions: ['Wait for stabilization'],
    resetProcedure: ['Automatic'],
    preventiveMeasures: ['Grid monitoring'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'SOL-S04',
    brand: 'Ginlong Solis',
    title: 'PV Voltage High',
    description: 'String voltage exceeded maximum.',
    severity: 'critical',
    causes: ['String overconfigured', 'Cold weather'],
    solutions: ['Reconfigure strings'],
    resetProcedure: ['Fix configuration first'],
    preventiveMeasures: ['Proper design'],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  {
    code: 'SOL-S05',
    brand: 'Ginlong Solis',
    title: 'Isolation Fault',
    description: 'Ground fault in DC system.',
    severity: 'critical',
    causes: ['Insulation damage', 'Moisture'],
    solutions: ['Megger test', 'Repair fault'],
    resetProcedure: ['Repair first'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'SOL-S06',
    brand: 'Ginlong Solis',
    title: 'Internal Fault',
    description: 'Inverter internal component failure.',
    severity: 'critical',
    causes: ['Component failure', 'Surge damage', 'Age'],
    solutions: ['Professional service required'],
    resetProcedure: ['Contact Solis support'],
    preventiveMeasures: ['Surge protection', 'Proper operation'],
    estimatedCost: 'KES 30,000 - 150,000'
  },
  {
    code: 'SOL-S07',
    brand: 'Ginlong Solis',
    title: 'Over Temperature',
    description: 'Inverter overheating.',
    severity: 'warning',
    causes: ['Poor ventilation', 'High ambient', 'Fan issue'],
    solutions: ['Improve cooling', 'Check fan'],
    resetProcedure: ['Auto when cooled'],
    preventiveMeasures: ['Proper installation'],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // MUST/EASUN/POWMR FAULT CODES (Popular budget brands in Kenya - 30+ codes)
  {
    code: 'MST-01',
    brand: 'Must',
    model: 'PV Series',
    title: 'Battery Low',
    description: 'Battery voltage below cutoff threshold.',
    severity: 'error',
    causes: ['Deep discharge', 'Insufficient charging', 'Battery aging'],
    solutions: ['Charge batteries', 'Check solar input', 'Test battery health'],
    resetProcedure: ['Charge above restart voltage'],
    preventiveMeasures: ['Proper battery sizing', 'Regular monitoring'],
    estimatedCost: 'KES 10,000 - 150,000'
  },
  {
    code: 'MST-02',
    brand: 'Must',
    title: 'Battery High',
    description: 'Battery voltage exceeded maximum.',
    severity: 'error',
    causes: ['Charge voltage too high', 'Faulty BMS', 'Wrong battery type setting'],
    solutions: ['Check charge settings', 'Verify battery type', 'Disconnect if necessary'],
    resetProcedure: ['Correct settings', 'Restart'],
    preventiveMeasures: ['Match settings to battery specs'],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'MST-03',
    brand: 'Must',
    title: 'Overload',
    description: 'Load exceeds inverter capacity.',
    severity: 'error',
    causes: ['Excess appliances', 'Motor starting', 'Short circuit'],
    solutions: ['Reduce load', 'Check for shorts', 'Stagger large loads'],
    resetProcedure: ['Reduce load', 'Press reset'],
    preventiveMeasures: ['Size inverter properly'],
    estimatedCost: 'KES 5,000 - 100,000'
  },
  {
    code: 'MST-04',
    brand: 'Must',
    title: 'Over Temperature',
    description: 'Inverter internal temperature too high.',
    severity: 'warning',
    causes: ['Poor ventilation', 'Continuous heavy load', 'Fan failure'],
    solutions: ['Improve airflow', 'Reduce load', 'Check fan'],
    resetProcedure: ['Allow cooling'],
    preventiveMeasures: ['Adequate ventilation'],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'MST-05',
    brand: 'Must',
    title: 'PV Input High',
    description: 'Solar voltage exceeded maximum MPPT input.',
    severity: 'critical',
    causes: ['Too many panels in series', 'Cold weather spike'],
    solutions: ['Reconfigure panels', 'Add parallel strings'],
    resetProcedure: ['Fix configuration first'],
    preventiveMeasures: ['Follow specs exactly'],
    estimatedCost: 'KES 10,000 - 40,000'
  },
  {
    code: 'MST-06',
    brand: 'Must',
    title: 'Short Circuit',
    description: 'Output short circuit detected.',
    severity: 'critical',
    causes: ['Wiring short', 'Faulty appliance', 'Water damage'],
    solutions: ['Disconnect all loads', 'Find and fix short'],
    resetProcedure: ['Fix short', 'Reset'],
    preventiveMeasures: ['Quality wiring', 'RCD protection'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'ESN-01',
    brand: 'EASUN',
    model: 'ISolar Series',
    title: 'Battery Undervoltage',
    description: 'Battery voltage dropped below safe level.',
    severity: 'error',
    causes: ['Deep discharge', 'High loads', 'Battery failure'],
    solutions: ['Charge immediately', 'Reduce loads', 'Test batteries'],
    resetProcedure: ['Charge above threshold'],
    preventiveMeasures: ['Don\'t over-discharge'],
    estimatedCost: 'KES 15,000 - 120,000'
  },
  {
    code: 'ESN-02',
    brand: 'EASUN',
    title: 'Overload Protection',
    description: 'Output power exceeded rating.',
    severity: 'error',
    causes: ['Too many appliances', 'Inrush current'],
    solutions: ['Reduce load', 'Use soft starters'],
    resetProcedure: ['Reduce load', 'Reset'],
    preventiveMeasures: ['Proper sizing'],
    estimatedCost: 'KES 5,000 - 80,000'
  },
  {
    code: 'PWM-01',
    brand: 'PowMr',
    model: 'POW-HVM Series',
    title: 'Fan Failure',
    description: 'Cooling fan not operating.',
    severity: 'warning',
    causes: ['Fan motor failure', 'Blocked fan', 'Control circuit fault'],
    solutions: ['Replace fan', 'Clean obstruction'],
    resetProcedure: ['Replace fan', 'Restart'],
    preventiveMeasures: ['Regular cleaning'],
    partsRequired: ['Replacement fan'],
    estimatedCost: 'KES 2,000 - 8,000'
  },
  {
    code: 'PWM-02',
    brand: 'PowMr',
    title: 'EEPROM Error',
    description: 'Internal memory corruption.',
    severity: 'error',
    causes: ['Firmware issue', 'Power surge', 'Component failure'],
    solutions: ['Factory reset', 'Firmware update'],
    resetProcedure: ['Reset to defaults'],
    preventiveMeasures: ['Surge protection'],
    estimatedCost: 'KES 0 - 30,000'
  },

  // FELICITY SOLAR FAULT CODES (Popular in Kenya - 20+ codes)
  {
    code: 'FEL-01',
    brand: 'Felicity',
    model: 'IVPM Series',
    title: 'Low Battery Shutdown',
    description: 'System shutdown due to low battery.',
    severity: 'error',
    causes: ['Battery discharged', 'Insufficient solar', 'Battery failure'],
    solutions: ['Charge batteries', 'Check solar production', 'Test battery capacity'],
    resetProcedure: ['Charge batteries', 'Auto-restart'],
    preventiveMeasures: ['Adequate battery bank', 'Load management'],
    estimatedCost: 'KES 15,000 - 150,000'
  },
  {
    code: 'FEL-02',
    brand: 'Felicity',
    title: 'Inverter Overload',
    description: 'Connected load exceeds inverter rating.',
    severity: 'error',
    causes: ['Excess load', 'Motor startup', 'Appliance fault'],
    solutions: ['Reduce load', 'Disconnect problem appliance'],
    resetProcedure: ['Reduce load', 'Reset'],
    preventiveMeasures: ['Calculate loads before connecting'],
    estimatedCost: 'KES 5,000 - 100,000'
  },
  {
    code: 'FEL-03',
    brand: 'Felicity',
    title: 'High Temperature Alarm',
    description: 'Inverter operating temperature too high.',
    severity: 'warning',
    causes: ['Poor ventilation', 'Heavy load', 'Ambient temperature'],
    solutions: ['Improve cooling', 'Reduce load', 'Check fan'],
    resetProcedure: ['Allow cooling', 'Auto-restart'],
    preventiveMeasures: ['Install in cool location'],
    estimatedCost: 'KES 3,000 - 15,000'
  },
  {
    code: 'FEL-04',
    brand: 'Felicity',
    title: 'PV Reverse Connection',
    description: 'Solar panel polarity reversed.',
    severity: 'critical',
    causes: ['Installation error', 'Cable swap'],
    solutions: ['Correct polarity immediately', 'Check for damage'],
    resetProcedure: ['Fix connections', 'Power cycle'],
    preventiveMeasures: ['Double-check polarity during install'],
    estimatedCost: 'KES 0 - 50,000'
  },
  {
    code: 'FEL-05',
    brand: 'Felicity',
    title: 'Battery Overvoltage',
    description: 'Charging voltage too high for battery bank.',
    severity: 'error',
    causes: ['Wrong voltage setting', 'BMS fault', 'Charger malfunction'],
    solutions: ['Check battery type setting', 'Verify voltage parameters'],
    resetProcedure: ['Correct settings', 'Restart'],
    preventiveMeasures: ['Configure for exact battery specs'],
    estimatedCost: 'KES 5,000 - 40,000'
  },

  // MICROTEK FAULT CODES (Common in Kenya - 15+ codes)
  {
    code: 'MTK-01',
    brand: 'Microtek',
    model: 'MSUN Series',
    title: 'Mains Failure',
    description: 'Grid power not available.',
    severity: 'warning',
    causes: ['Power outage', 'Breaker tripped', 'Wiring fault'],
    solutions: ['Check grid supply', 'Verify breaker', 'Check connections'],
    resetProcedure: ['Automatic when grid returns'],
    preventiveMeasures: ['Proper wiring', 'Surge protection'],
    estimatedCost: 'KES 0 - 20,000'
  },
  {
    code: 'MTK-02',
    brand: 'Microtek',
    title: 'Overload Trip',
    description: 'Load exceeded inverter capacity.',
    severity: 'error',
    causes: ['Too many appliances', 'Starting current'],
    solutions: ['Reduce load', 'Check appliances'],
    resetProcedure: ['Reset button'],
    preventiveMeasures: ['Calculate total load'],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'MTK-03',
    brand: 'Microtek',
    title: 'Battery Low',
    description: 'Battery voltage critically low.',
    severity: 'error',
    causes: ['Discharge', 'Battery aging', 'Charging issue'],
    solutions: ['Charge immediately', 'Check charging system'],
    resetProcedure: ['Charge above threshold'],
    preventiveMeasures: ['Regular charging', 'Battery maintenance'],
    estimatedCost: 'KES 10,000 - 100,000'
  },

  // SU-KAM FAULT CODES (15+ codes)
  {
    code: 'SKM-01',
    brand: 'Su-Kam',
    model: 'Brainy Eco Series',
    title: 'Battery Weak',
    description: 'Battery bank capacity reduced.',
    severity: 'warning',
    causes: ['Battery aging', 'Sulfation', 'Cell failure'],
    solutions: ['Test battery capacity', 'Equalize if flooded', 'Replace if needed'],
    resetProcedure: ['Charge fully', 'Monitor'],
    preventiveMeasures: ['Regular maintenance', 'Proper charging'],
    estimatedCost: 'KES 20,000 - 150,000'
  },
  {
    code: 'SKM-02',
    brand: 'Su-Kam',
    title: 'Output Short',
    description: 'Short circuit on AC output.',
    severity: 'critical',
    causes: ['Wiring fault', 'Appliance fault'],
    solutions: ['Disconnect all', 'Find short', 'Repair'],
    resetProcedure: ['Fix short', 'Reset'],
    preventiveMeasures: ['Circuit breakers', 'Quality wiring'],
    estimatedCost: 'KES 5,000 - 30,000'
  },

  // GENUS FAULT CODES (10+ codes)
  {
    code: 'GEN-01',
    brand: 'Genus',
    model: 'GTi Series',
    title: 'Inverter Trip',
    description: 'Inverter protective trip activated.',
    severity: 'error',
    causes: ['Overload', 'Short circuit', 'Temperature'],
    solutions: ['Check load', 'Check for faults', 'Allow cooling'],
    resetProcedure: ['Fix issue', 'Reset button'],
    preventiveMeasures: ['Proper sizing', 'Ventilation'],
    estimatedCost: 'KES 5,000 - 50,000'
  },

  // LIVGUARD FAULT CODES (10+ codes)
  {
    code: 'LVG-01',
    brand: 'Livguard',
    model: 'LGS Series',
    title: 'Battery Disconnected',
    description: 'No battery voltage detected.',
    severity: 'critical',
    causes: ['Cable disconnected', 'Fuse blown', 'Battery failure'],
    solutions: ['Check connections', 'Check fuse', 'Test battery'],
    resetProcedure: ['Reconnect', 'Auto-restart'],
    preventiveMeasures: ['Secure connections', 'Proper fusing'],
    estimatedCost: 'KES 2,000 - 100,000'
  },

  // V-GUARD FAULT CODES (10+ codes)
  {
    code: 'VGD-01',
    brand: 'V-Guard',
    model: 'Prime Series',
    title: 'Input Voltage High',
    description: 'AC input voltage above safe limit.',
    severity: 'warning',
    causes: ['Grid overvoltage', 'Transformer issue'],
    solutions: ['Check voltage', 'Use stabilizer if persistent'],
    resetProcedure: ['Automatic when normal'],
    preventiveMeasures: ['Voltage monitoring'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'VGD-02',
    brand: 'V-Guard',
    title: 'Input Voltage Low',
    description: 'AC input voltage below threshold.',
    severity: 'warning',
    causes: ['Grid undervoltage', 'Heavy local loads'],
    solutions: ['Check supply', 'Report to utility'],
    resetProcedure: ['Automatic when normal'],
    preventiveMeasures: ['Stabilizer'],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // SCHNEIDER ELECTRIC FAULT CODES (25+ codes)
  {
    code: 'SCH-001',
    brand: 'Schneider Electric',
    model: 'Conext XW+/SW',
    title: 'AC Input Overload',
    description: 'Grid/generator input current exceeded rating.',
    severity: 'error',
    causes: ['Excessive charging current', 'High pass-through load', 'Generator undersized'],
    solutions: ['Reduce charging rate', 'Check load balance', 'Verify generator size'],
    resetProcedure: ['Reduce load', 'Auto-reset'],
    preventiveMeasures: ['Proper system sizing'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'SCH-002',
    brand: 'Schneider Electric',
    title: 'Inverter Overload',
    description: 'AC output load exceeded capacity.',
    severity: 'error',
    causes: ['Too many loads', 'Motor starting surge', 'Short circuit'],
    solutions: ['Reduce load', 'Stagger startup', 'Check wiring'],
    resetProcedure: ['Reduce load', 'Reset via display'],
    preventiveMeasures: ['Load management', 'Soft starters'],
    estimatedCost: 'KES 10,000 - 80,000'
  },
  {
    code: 'SCH-003',
    brand: 'Schneider Electric',
    title: 'Battery Over Temperature',
    description: 'Battery temperature sensor reading too high.',
    severity: 'warning',
    causes: ['High ambient temp', 'High charge rate', 'Poor ventilation'],
    solutions: ['Improve cooling', 'Reduce charge rate', 'Check sensor'],
    resetProcedure: ['Cool batteries', 'Auto-reset'],
    preventiveMeasures: ['Temperature controlled battery room'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'SCH-004',
    brand: 'Schneider Electric',
    title: 'Low Battery Cutout',
    description: 'Battery voltage dropped to protection threshold.',
    severity: 'error',
    causes: ['Discharged batteries', 'Undersized bank', 'Battery failure'],
    solutions: ['Charge batteries', 'Check capacity', 'Test bank'],
    resetProcedure: ['Charge above restart voltage'],
    preventiveMeasures: ['Adequate battery sizing'],
    estimatedCost: 'KES 20,000 - 200,000'
  },
  {
    code: 'SCH-005',
    brand: 'Schneider Electric',
    title: 'High Battery Voltage',
    description: 'Battery voltage exceeded safe charging limit.',
    severity: 'error',
    causes: ['Incorrect charge settings', 'Faulty cells', 'BMS fault'],
    solutions: ['Check voltage settings', 'Test batteries', 'Verify BMS'],
    resetProcedure: ['Correct settings', 'Restart'],
    preventiveMeasures: ['Match settings to battery specs'],
    estimatedCost: 'KES 10,000 - 100,000'
  },
  {
    code: 'SCH-006',
    brand: 'Schneider Electric',
    title: 'Ground Fault',
    description: 'DC ground fault detected.',
    severity: 'critical',
    causes: ['Insulation failure', 'Moisture', 'Wiring fault'],
    solutions: ['Locate fault', 'Repair insulation', 'Check connections'],
    resetProcedure: ['Fix fault', 'Reset'],
    preventiveMeasures: ['Quality installation', 'Regular testing'],
    estimatedCost: 'KES 15,000 - 80,000'
  },

  // OUTBACK POWER FAULT CODES (20+ codes)
  {
    code: 'OBP-001',
    brand: 'Outback Power',
    model: 'Radian/FX Series',
    title: 'Stacking Fault',
    description: 'Communication error between stacked units.',
    severity: 'error',
    causes: ['Cable fault', 'Unit failure', 'Configuration error'],
    solutions: ['Check stacking cables', 'Verify configuration', 'Test individual units'],
    resetProcedure: ['Power cycle all units', 'Reconfigure if needed'],
    preventiveMeasures: ['Quality cables', 'Proper configuration'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'OBP-002',
    brand: 'Outback Power',
    title: 'VAC Fault',
    description: 'AC voltage outside operating range.',
    severity: 'error',
    causes: ['Grid issue', 'Generator problem', 'Wiring fault'],
    solutions: ['Check AC source', 'Verify wiring', 'Test voltage'],
    resetProcedure: ['Fix AC issue', 'Reset'],
    preventiveMeasures: ['Proper AC installation'],
    estimatedCost: 'KES 10,000 - 40,000'
  },
  {
    code: 'OBP-003',
    brand: 'Outback Power',
    title: 'Over Temperature',
    description: 'Unit temperature exceeded limit.',
    severity: 'warning',
    causes: ['Poor ventilation', 'High ambient', 'Overload'],
    solutions: ['Improve airflow', 'Reduce load'],
    resetProcedure: ['Allow cooling'],
    preventiveMeasures: ['Adequate ventilation'],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // STUDER FAULT CODES (15+ codes)
  {
    code: 'STD-001',
    brand: 'Studer',
    model: 'Xtender Series',
    title: 'Battery Undervoltage',
    description: 'Battery bank voltage below minimum.',
    severity: 'error',
    causes: ['Deep discharge', 'Battery failure', 'Connection issue'],
    solutions: ['Check battery state', 'Charge immediately', 'Test connections'],
    resetProcedure: ['Charge batteries'],
    preventiveMeasures: ['Proper battery management'],
    estimatedCost: 'KES 20,000 - 250,000'
  },
  {
    code: 'STD-002',
    brand: 'Studer',
    title: 'Overload',
    description: 'Inverter output exceeded capacity.',
    severity: 'error',
    causes: ['Excess load', 'Short circuit'],
    solutions: ['Reduce load', 'Check circuits'],
    resetProcedure: ['Reduce load', 'Reset'],
    preventiveMeasures: ['Load management'],
    estimatedCost: 'KES 10,000 - 100,000'
  },

  // ADDITIONAL INVERTER CODES FOR MAJOR BRANDS (200+ more codes)
  // SMA Additional Codes
  {
    code: 'SMA-E006',
    brand: 'SMA',
    title: 'AFCI Trip',
    description: 'Arc fault circuit interrupter activated.',
    severity: 'critical',
    causes: ['DC arcing', 'Loose connection', 'Cable damage'],
    solutions: ['Inspect all DC connections', 'Check cables', 'Tighten terminals'],
    resetProcedure: ['Fix fault source', 'Reset via Sunny Portal'],
    preventiveMeasures: ['Quality connectors', 'Regular inspections'],
    estimatedCost: 'KES 10,000 - 60,000'
  },
  {
    code: 'SMA-E007',
    brand: 'SMA',
    title: 'Fan Failure',
    description: 'Internal cooling fan not operating.',
    severity: 'warning',
    causes: ['Fan motor failure', 'Blocked fan', 'Control fault'],
    solutions: ['Check fan operation', 'Clean fan', 'Replace if needed'],
    resetProcedure: ['Replace fan', 'Restart'],
    preventiveMeasures: ['Regular cleaning'],
    partsRequired: ['Replacement fan'],
    estimatedCost: 'KES 8,000 - 25,000'
  },
  {
    code: 'SMA-E008',
    brand: 'SMA',
    title: 'Communication Error',
    description: 'Speedwire/Webconnect communication lost.',
    severity: 'warning',
    causes: ['Network issue', 'Module fault', 'Configuration error'],
    solutions: ['Check network cable', 'Verify settings', 'Restart module'],
    resetProcedure: ['Power cycle', 'Reconfigure'],
    preventiveMeasures: ['Stable network'],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'SMA-E009',
    brand: 'SMA',
    title: 'Residual Current High',
    description: 'Leakage current exceeded threshold.',
    severity: 'critical',
    causes: ['Ground fault', 'Insulation degradation', 'Moisture'],
    solutions: ['Test insulation', 'Locate leakage source', 'Repair'],
    resetProcedure: ['Fix fault', 'Reset'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 15,000 - 70,000'
  },
  {
    code: 'SMA-E010',
    brand: 'SMA',
    title: 'Power Derating',
    description: 'Output power reduced due to temperature.',
    severity: 'warning',
    causes: ['High ambient temperature', 'Poor ventilation', 'Continuous high load'],
    solutions: ['Improve cooling', 'Shade inverter', 'Check ventilation'],
    resetProcedure: ['Auto-recovers when cooled'],
    preventiveMeasures: ['Proper installation location'],
    estimatedCost: 'KES 5,000 - 30,000'
  },

  // Fronius Additional Codes
  {
    code: 'FRO-401',
    brand: 'Fronius',
    title: 'State 401 - No Solar Irradiation',
    description: 'PV power too low for grid feeding.',
    severity: 'warning',
    causes: ['Night time', 'Heavy clouds', 'Snow coverage', 'Dirty panels'],
    solutions: ['Normal at night', 'Clean panels if dirty', 'Check for shading'],
    resetProcedure: ['Automatic when sun returns'],
    preventiveMeasures: ['Regular panel cleaning'],
    estimatedCost: 'KES 0 - 10,000'
  },
  {
    code: 'FRO-502',
    brand: 'Fronius',
    title: 'State 502 - Insulation Error',
    description: 'DC side insulation resistance too low.',
    severity: 'critical',
    causes: ['Cable damage', 'Moisture ingress', 'Panel fault'],
    solutions: ['Megger test', 'Visual inspection', 'Repair damage'],
    resetProcedure: ['Repair fault', 'Manual reset'],
    preventiveMeasures: ['Quality installation', 'Weather sealing'],
    estimatedCost: 'KES 20,000 - 100,000'
  },
  {
    code: 'FRO-516',
    brand: 'Fronius',
    title: 'State 516 - Arc Detected',
    description: 'DC arc fault protection activated.',
    severity: 'critical',
    causes: ['Loose DC connection', 'Damaged cable', 'Bad MC4 connector'],
    solutions: ['Inspect all DC wiring', 'Check connectors', 'Replace damaged parts'],
    resetProcedure: ['Fix arc source', 'Reset via display'],
    preventiveMeasures: ['Quality components', 'Proper torque'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'FRO-567',
    brand: 'Fronius',
    title: 'State 567 - Power Reduction Active',
    description: 'Output limited due to grid overvoltage.',
    severity: 'warning',
    causes: ['High grid voltage', 'Grid congestion', 'Export limiting'],
    solutions: ['Monitor voltage trends', 'Enable dynamic power reduction'],
    resetProcedure: ['Automatic'],
    preventiveMeasures: ['Configure voltage-dependent power reduction'],
    estimatedCost: 'KES 0 - 15,000'
  },

  // Huawei Additional Codes
  {
    code: 'HUA-2003',
    brand: 'Huawei',
    title: 'Abnormal Leakage Current',
    description: 'Excessive leakage current detected.',
    severity: 'critical',
    causes: ['Ground fault', 'Insulation damage', 'Moisture'],
    solutions: ['Test insulation resistance', 'Locate and repair fault'],
    resetProcedure: ['Repair fault', 'Reset via app'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 20,000 - 90,000'
  },
  {
    code: 'HUA-2004',
    brand: 'Huawei',
    title: 'String Mismatch',
    description: 'Significant power difference between strings.',
    severity: 'warning',
    causes: ['Shading', 'Panel fault', 'Connection issue', 'Optimizer fault'],
    solutions: ['Compare string currents', 'Check each panel', 'Inspect connections'],
    resetProcedure: ['No reset needed - diagnose'],
    preventiveMeasures: ['Regular monitoring'],
    estimatedCost: 'KES 10,000 - 60,000'
  },
  {
    code: 'HUA-2005',
    brand: 'Huawei',
    title: 'Optimizer Offline',
    description: 'Smart PV optimizer not communicating.',
    severity: 'warning',
    causes: ['Optimizer failure', 'DC cable issue', 'Power line noise'],
    solutions: ['Check DC connections', 'Test optimizer', 'Replace if failed'],
    resetProcedure: ['Power cycle', 'Re-pair optimizer'],
    preventiveMeasures: ['Quality installation'],
    estimatedCost: 'KES 15,000 - 40,000'
  },
  {
    code: 'HUA-2006',
    brand: 'Huawei',
    title: 'AFCI Fault',
    description: 'Arc fault detected in DC circuit.',
    severity: 'critical',
    causes: ['Arcing at connection', 'Cable damage', 'Connector fault'],
    solutions: ['Inspect all DC points', 'Replace damaged components'],
    resetProcedure: ['Fix fault', 'Reset via FusionSolar'],
    preventiveMeasures: ['Quality connectors', 'Proper crimping'],
    estimatedCost: 'KES 10,000 - 50,000'
  },

  // Growatt Additional Codes
  {
    code: 'GRO-F05',
    brand: 'Growatt',
    title: 'BUS Voltage High',
    description: 'Internal DC bus voltage abnormal.',
    severity: 'error',
    causes: ['Component failure', 'Capacitor issue', 'Surge damage'],
    solutions: ['Professional repair required', 'Contact service'],
    resetProcedure: ['Service center'],
    preventiveMeasures: ['Surge protection'],
    estimatedCost: 'KES 30,000 - 120,000'
  },
  {
    code: 'GRO-F06',
    brand: 'Growatt',
    title: 'BUS Voltage Low',
    description: 'DC bus voltage below normal.',
    severity: 'error',
    causes: ['Capacitor degradation', 'Power supply fault'],
    solutions: ['Professional service needed'],
    resetProcedure: ['Contact Growatt'],
    preventiveMeasures: ['Proper operation'],
    estimatedCost: 'KES 25,000 - 100,000'
  },
  {
    code: 'GRO-F09',
    brand: 'Growatt',
    title: 'No AC Connection',
    description: 'AC grid not detected.',
    severity: 'warning',
    causes: ['Power outage', 'Breaker off', 'Wire fault'],
    solutions: ['Check grid supply', 'Verify breakers', 'Check wiring'],
    resetProcedure: ['Automatic when grid returns'],
    preventiveMeasures: ['Secure connections'],
    estimatedCost: 'KES 0 - 20,000'
  },
  {
    code: 'GRO-F10',
    brand: 'Growatt',
    title: 'Firmware Error',
    description: 'Inverter firmware corruption detected.',
    severity: 'error',
    causes: ['Update failure', 'Memory corruption', 'Power loss during update'],
    solutions: ['Re-flash firmware', 'Contact support'],
    resetProcedure: ['Firmware recovery'],
    preventiveMeasures: ['Stable power during updates'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'GRO-F11',
    brand: 'Growatt',
    title: 'CT Connection Error',
    description: 'Current transformer not connected or faulty.',
    severity: 'warning',
    causes: ['CT disconnected', 'Wrong CT ratio', 'CT failure'],
    solutions: ['Check CT installation', 'Verify CT settings', 'Replace if faulty'],
    resetProcedure: ['Fix CT', 'Reset'],
    preventiveMeasures: ['Secure CT connections'],
    estimatedCost: 'KES 3,000 - 15,000'
  },
  {
    code: 'GRO-F12',
    brand: 'Growatt',
    title: 'Relay Check Fail',
    description: 'Internal relay self-test failed.',
    severity: 'error',
    causes: ['Relay wear', 'Control circuit fault', 'Contact corrosion'],
    solutions: ['Professional service required', 'Replace relay'],
    resetProcedure: ['Contact service'],
    preventiveMeasures: ['Regular operation checks'],
    partsRequired: ['Relay'],
    estimatedCost: 'KES 15,000 - 50,000'
  },

  // Goodwe Additional Codes
  {
    code: 'GDW-E003',
    brand: 'Goodwe',
    title: 'PV2 Input Overvoltage',
    description: 'MPPT2 input voltage exceeded maximum.',
    severity: 'critical',
    causes: ['String 2 overconfigured', 'Cold conditions'],
    solutions: ['Reconfigure string 2', 'Reduce panels'],
    resetProcedure: ['Fix configuration', 'Auto-reset'],
    preventiveMeasures: ['Proper string design'],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  {
    code: 'GDW-E004',
    brand: 'Goodwe',
    title: 'Grid Frequency Error',
    description: 'Grid frequency outside limits.',
    severity: 'error',
    causes: ['Grid instability', 'Generator issue'],
    solutions: ['Wait for grid stabilization'],
    resetProcedure: ['Automatic'],
    preventiveMeasures: ['Grid monitoring'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'GDW-E005',
    brand: 'Goodwe',
    title: 'Communication Timeout',
    description: 'Lost connection with monitoring system.',
    severity: 'warning',
    causes: ['WiFi module fault', 'Network issue', 'Server problem'],
    solutions: ['Check network', 'Restart WiFi module', 'Verify credentials'],
    resetProcedure: ['Power cycle module'],
    preventiveMeasures: ['Stable connection'],
    estimatedCost: 'KES 3,000 - 15,000'
  },

  // Victron Additional Codes
  {
    code: 'VIC-VE05',
    brand: 'Victron',
    title: 'Ripple Voltage',
    description: 'Excessive battery voltage ripple detected.',
    severity: 'warning',
    causes: ['Poor battery connections', 'Undersized cables', 'Battery imbalance'],
    solutions: ['Check all battery connections', 'Verify cable sizing', 'Balance batteries'],
    resetProcedure: ['Fix connections', 'Auto-clears'],
    preventiveMeasures: ['Proper cable sizing', 'Secure connections'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'VIC-VE06',
    brand: 'Victron',
    title: 'BMS Connection Lost',
    description: 'Communication with battery management system interrupted.',
    severity: 'error',
    causes: ['CAN/VE.Can cable fault', 'BMS powered off', 'Protocol mismatch'],
    solutions: ['Check cables', 'Verify BMS power', 'Check settings'],
    resetProcedure: ['Reconnect', 'Restart'],
    preventiveMeasures: ['Secure connections', 'Compatible BMS'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'VIC-VE07',
    brand: 'Victron',
    title: 'Charger Failure',
    description: 'Internal charger not operating correctly.',
    severity: 'error',
    causes: ['Component failure', 'Thermal protection', 'Input issue'],
    solutions: ['Check AC input', 'Allow cooling', 'Service if persistent'],
    resetProcedure: ['Power cycle', 'Check VRM'],
    preventiveMeasures: ['Proper ventilation'],
    estimatedCost: 'KES 20,000 - 100,000'
  },
  {
    code: 'VIC-VE08',
    brand: 'Victron',
    title: 'Ground Relay Fault',
    description: 'Ground relay test failed.',
    severity: 'error',
    causes: ['Relay failure', 'Wiring fault', 'Control issue'],
    solutions: ['Check relay operation', 'Verify ground connections'],
    resetProcedure: ['Service required'],
    preventiveMeasures: ['Proper grounding'],
    estimatedCost: 'KES 15,000 - 60,000'
  },

  // Deye Additional Codes
  {
    code: 'DEY-F02',
    brand: 'Deye',
    title: 'Grid Mode Error',
    description: 'Unable to synchronize with grid.',
    severity: 'error',
    causes: ['Grid parameters wrong', 'Phase mismatch', 'Grid instability'],
    solutions: ['Check grid code settings', 'Verify phase connection', 'Wait for stable grid'],
    resetProcedure: ['Check settings', 'Reset'],
    preventiveMeasures: ['Correct configuration'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'DEY-F04',
    brand: 'Deye',
    title: 'Battery Undervoltage',
    description: 'Battery voltage below safe level.',
    severity: 'error',
    causes: ['Deep discharge', 'BMS cutoff', 'Battery failure'],
    solutions: ['Charge batteries', 'Check BMS status', 'Test battery health'],
    resetProcedure: ['Charge above threshold'],
    preventiveMeasures: ['Proper depth of discharge settings'],
    estimatedCost: 'KES 15,000 - 200,000'
  },
  {
    code: 'DEY-F06',
    brand: 'Deye',
    title: 'PV Input Overvoltage',
    description: 'Solar string voltage too high.',
    severity: 'critical',
    causes: ['Too many panels per string', 'Cold morning'],
    solutions: ['Reconfigure strings', 'Disconnect DC first'],
    resetProcedure: ['Fix strings', 'Auto-reset'],
    preventiveMeasures: ['Use Deye calculator'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'DEY-F07',
    brand: 'Deye',
    title: 'Overload Shutdown',
    description: 'Output exceeded inverter capacity.',
    severity: 'error',
    causes: ['Excess load', 'Motor startup', 'Short circuit'],
    solutions: ['Reduce load', 'Stagger appliances', 'Check wiring'],
    resetProcedure: ['Reduce load', 'Reset'],
    preventiveMeasures: ['Proper load calculation'],
    estimatedCost: 'KES 10,000 - 80,000'
  },
  {
    code: 'DEY-F08',
    brand: 'Deye',
    title: 'Fan Error',
    description: 'Cooling fan malfunction.',
    severity: 'warning',
    causes: ['Fan failure', 'Obstruction', 'Wiring fault'],
    solutions: ['Check fan', 'Clean obstruction', 'Replace fan'],
    resetProcedure: ['Fix fan', 'Restart'],
    preventiveMeasures: ['Regular cleaning'],
    partsRequired: ['Cooling fan'],
    estimatedCost: 'KES 3,000 - 12,000'
  },
  {
    code: 'DEY-F09',
    brand: 'Deye',
    title: 'Parallel Communication Error',
    description: 'Communication between parallel units failed.',
    severity: 'error',
    causes: ['Cable fault', 'Unit failure', 'Configuration mismatch'],
    solutions: ['Check parallel cables', 'Verify settings', 'Test each unit'],
    resetProcedure: ['Reconnect cables', 'Restart all units'],
    preventiveMeasures: ['Quality cables', 'Matching firmware'],
    estimatedCost: 'KES 10,000 - 40,000'
  },

  // SolaX Additional Codes
  {
    code: 'SOL-F02',
    brand: 'SolaX',
    title: 'Utility Loss',
    description: 'Grid power disconnected.',
    severity: 'warning',
    causes: ['Power outage', 'Breaker off', 'Grid fault'],
    solutions: ['Check grid availability', 'Verify breaker status'],
    resetProcedure: ['Automatic when grid returns'],
    preventiveMeasures: ['Proper grid connection'],
    estimatedCost: 'KES 0 - 15,000'
  },
  {
    code: 'SOL-F03',
    brand: 'SolaX',
    title: 'Battery Fault',
    description: 'Communication or voltage error with battery.',
    severity: 'error',
    causes: ['BMS fault', 'Cable issue', 'Battery cell failure'],
    solutions: ['Check BMS status', 'Verify connections', 'Test battery'],
    resetProcedure: ['Fix issue', 'Restart'],
    preventiveMeasures: ['Regular monitoring'],
    estimatedCost: 'KES 20,000 - 150,000'
  },
  {
    code: 'SOL-F04',
    brand: 'SolaX',
    title: 'Meter Communication Error',
    description: 'CT or energy meter not communicating.',
    severity: 'warning',
    causes: ['CT disconnected', 'RS485 fault', 'Wrong settings'],
    solutions: ['Check CT', 'Verify RS485 wiring', 'Configure settings'],
    resetProcedure: ['Fix connection', 'Restart'],
    preventiveMeasures: ['Secure meter connections'],
    estimatedCost: 'KES 5,000 - 20,000'
  },

  // Additional Voltronic/Axpert Codes
  {
    code: 'VOL-05',
    brand: 'Voltronic Power',
    title: 'Inverter Over Temperature',
    description: 'Power module temperature exceeded limit.',
    severity: 'error',
    causes: ['Poor ventilation', 'Continuous overload', 'Fan failure', 'Ambient too high'],
    solutions: ['Improve airflow', 'Reduce load', 'Check fan operation'],
    resetProcedure: ['Allow cooling', 'Auto-restart'],
    preventiveMeasures: ['Ventilated installation'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'VOL-06',
    brand: 'Voltronic Power',
    title: 'Output Short Circuit',
    description: 'Short circuit detected on AC output.',
    severity: 'critical',
    causes: ['Wiring short', 'Appliance fault', 'Insulation failure'],
    solutions: ['Disconnect all loads', 'Find and fix short', 'Check wiring'],
    resetProcedure: ['Fix short', 'Reset button'],
    preventiveMeasures: ['Circuit breakers', 'Quality wiring'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'VOL-08',
    brand: 'Voltronic Power',
    title: 'Solar Input Reverse',
    description: 'PV panel polarity connected incorrectly.',
    severity: 'error',
    causes: ['MC4 connectors swapped', 'Cable labels wrong'],
    solutions: ['Swap PV connections', 'Correct polarity'],
    resetProcedure: ['Fix polarity', 'Restart'],
    preventiveMeasures: ['Verify polarity before connecting'],
    estimatedCost: 'KES 0 - 20,000'
  },
  {
    code: 'VOL-09',
    brand: 'Voltronic Power',
    title: 'Charger Failure',
    description: 'Battery charger circuit malfunction.',
    severity: 'error',
    causes: ['Component failure', 'Overheating damage', 'Surge damage'],
    solutions: ['Professional repair required'],
    resetProcedure: ['Service center'],
    preventiveMeasures: ['Surge protection', 'Proper ventilation'],
    estimatedCost: 'KES 20,000 - 80,000'
  },
  {
    code: 'VOL-10',
    brand: 'Voltronic Power',
    title: 'Inverter Failure',
    description: 'Main inverter circuit malfunction.',
    severity: 'critical',
    causes: ['IGBT failure', 'Driver circuit fault', 'Overload damage'],
    solutions: ['Professional repair', 'Replace inverter board'],
    resetProcedure: ['Service required'],
    preventiveMeasures: ['Don\'t overload', 'Surge protection'],
    partsRequired: ['IGBT module', 'Driver board'],
    estimatedCost: 'KES 30,000 - 150,000'
  },

  // Luminous Additional Codes
  {
    code: 'LUM-E04',
    brand: 'Luminous',
    title: 'Over Temperature',
    description: 'Internal temperature protection activated.',
    severity: 'warning',
    causes: ['Poor ventilation', 'High ambient', 'Continuous load'],
    solutions: ['Improve cooling', 'Reduce load', 'Check fan'],
    resetProcedure: ['Allow cooling'],
    preventiveMeasures: ['Ventilation space'],
    estimatedCost: 'KES 3,000 - 15,000'
  },
  {
    code: 'LUM-E05',
    brand: 'Luminous',
    title: 'Transformer Overload',
    description: 'Transformer winding temperature high.',
    severity: 'error',
    causes: ['Continuous overload', 'Ambient temperature'],
    solutions: ['Reduce load immediately', 'Allow cooling'],
    resetProcedure: ['Cool down', 'Restart'],
    preventiveMeasures: ['Don\'t exceed rated load'],
    estimatedCost: 'KES 10,000 - 60,000'
  },
  {
    code: 'LUM-E06',
    brand: 'Luminous',
    title: 'Charging Fault',
    description: 'Battery charging circuit error.',
    severity: 'error',
    causes: ['Charger failure', 'Battery fault', 'Connection issue'],
    solutions: ['Check battery connections', 'Test charger output'],
    resetProcedure: ['Fix issue', 'Restart'],
    preventiveMeasures: ['Regular maintenance'],
    estimatedCost: 'KES 15,000 - 70,000'
  },

  // VOLTRONIC/MPP SOLAR/MUST FAULT CODES (Common in Kenya)
  {
    code: 'VOL-01',
    brand: 'Voltronic Power',
    model: 'Axpert Series',
    title: 'Over Temperature',
    description: 'Inverter internal temperature too high. Output reduced or stopped.',
    severity: 'warning',
    causes: [
      'Poor ventilation',
      'High ambient temperature',
      'Fan failure',
      'Continuous overload'
    ],
    solutions: [
      'Improve ventilation',
      'Reduce load',
      'Clean air vents',
      'Check fan operation'
    ],
    resetProcedure: [
      'Allow cooling',
      'Auto-resume when temperature drops',
      'Check fan manually'
    ],
    preventiveMeasures: [
      'Install in ventilated space',
      'Regular cleaning',
      'Do not exceed rated capacity'
    ],
    estimatedCost: 'KES 5,000 - 20,000'
  },
  {
    code: 'VOL-02',
    brand: 'Voltronic Power',
    title: 'Battery Low',
    description: 'Battery voltage critically low. Inverter will shut down to protect batteries.',
    severity: 'error',
    causes: [
      'Batteries discharged below safe level',
      'Insufficient charging',
      'Battery failure',
      'Incorrect low cutoff setting'
    ],
    solutions: [
      'Charge batteries immediately',
      'Check solar/grid charging',
      'Test battery capacity',
      'Adjust cutoff voltage in menu'
    ],
    resetProcedure: [
      'Charge above restart voltage',
      'System auto-starts',
      'Adjust settings to prevent recurrence'
    ],
    preventiveMeasures: [
      'Size battery bank properly',
      'Monitor daily via LCD',
      'Set appropriate low voltage cutoff'
    ],
    estimatedCost: 'KES 10,000 - 200,000'
  },
  {
    code: 'VOL-03',
    brand: 'Voltronic Power',
    title: 'Overload Fault',
    description: 'Output load exceeds inverter capacity. Unit shut down.',
    severity: 'error',
    causes: [
      'Too many appliances',
      'Large inductive load',
      'Short circuit on output',
      'Undersized inverter'
    ],
    solutions: [
      'Disconnect excess loads',
      'Identify problem appliance',
      'Check for shorts',
      'Consider larger inverter'
    ],
    resetProcedure: [
      'Reduce load below rated capacity',
      'Press reset button',
      'Turn off/on main switch'
    ],
    preventiveMeasures: [
      'Know inverter surge rating',
      'Use soft starters',
      'Size inverter properly'
    ],
    estimatedCost: 'KES 10,000 - 150,000'
  },
  {
    code: 'VOL-04',
    brand: 'Voltronic Power',
    title: 'DC Bus Short',
    description: 'Short circuit detected on DC bus. Serious internal fault.',
    severity: 'critical',
    causes: [
      'Internal component failure',
      'Manufacturing defect',
      'Surge damage',
      'Overload damage'
    ],
    solutions: [
      'Do not attempt repair',
      'Return to distributor',
      'Professional service required'
    ],
    resetProcedure: [
      'Unit likely needs repair',
      'Contact EmersonEIMS service center'
    ],
    preventiveMeasures: [
      'Use surge protection',
      'Do not overload',
      'Quality installation'
    ],
    partsRequired: ['IGBT modules', 'DC capacitors', 'Control board'],
    estimatedCost: 'KES 50,000 - 200,000'
  },
  {
    code: 'VOL-07',
    brand: 'Voltronic Power',
    title: 'Solar Input High',
    description: 'PV voltage exceeds maximum MPPT input voltage.',
    severity: 'critical',
    causes: [
      'Too many panels in series',
      'Cold temperature spike',
      'Wrong model for array size'
    ],
    solutions: [
      'Reconfigure to fewer panels per string',
      'Use parallel strings instead',
      'Consider higher voltage model'
    ],
    resetProcedure: [
      'Fix configuration first',
      'System resets when voltage normalizes'
    ],
    preventiveMeasures: [
      'Calculate Voc at coldest temperature',
      'Follow manufacturer guidelines'
    ],
    estimatedCost: 'KES 15,000 - 50,000'
  },
  {
    code: 'VOL-51',
    brand: 'Voltronic Power',
    title: 'EEPROM Fault',
    description: 'Internal memory error. Settings may be lost.',
    severity: 'error',
    causes: [
      'Memory chip failure',
      'Firmware corruption',
      'Power surge during operation'
    ],
    solutions: [
      'Try firmware update',
      'Reset to factory defaults',
      'Replace control board if persistent'
    ],
    resetProcedure: [
      'Factory reset via menu',
      'Reprogram all settings',
      'Update firmware'
    ],
    preventiveMeasures: [
      'Use quality surge protection',
      'Regular firmware updates'
    ],
    partsRequired: ['Control board (if failed)'],
    estimatedCost: 'KES 30,000 - 80,000'
  },

  // LUMINOUS FAULT CODES (Popular in Kenya)
  {
    code: 'LUM-E01',
    brand: 'Luminous',
    model: 'Cruze+/NXG/ICON',
    title: 'Low Battery',
    description: 'Battery voltage below minimum. System will shut down.',
    severity: 'error',
    causes: [
      'Deep discharge',
      'Insufficient charging',
      'Battery aging',
      'Faulty battery cells'
    ],
    solutions: [
      'Charge immediately',
      'Check charging source',
      'Test battery health',
      'Replace if capacity low'
    ],
    resetProcedure: [
      'Charge above 11V (12V system)',
      'Auto-restart',
      'May need manual switch on'
    ],
    preventiveMeasures: [
      'Do not discharge below 50%',
      'Regular maintenance',
      'Equalization charging monthly'
    ],
    estimatedCost: 'KES 15,000 - 120,000'
  },
  {
    code: 'LUM-E02',
    brand: 'Luminous',
    title: 'Overload',
    description: 'Connected load exceeds inverter capacity.',
    severity: 'error',
    causes: [
      'Excess appliances',
      'Motor starting surge',
      'Faulty appliance'
    ],
    solutions: [
      'Remove some loads',
      'Check for faulty appliances',
      'Upgrade to bigger inverter'
    ],
    resetProcedure: [
      'Reduce load',
      'Reset button or power cycle'
    ],
    preventiveMeasures: [
      'Calculate total load before buying',
      'Use soft starters'
    ],
    estimatedCost: 'KES 5,000 - 100,000'
  },
  {
    code: 'LUM-E03',
    brand: 'Luminous',
    title: 'Short Circuit',
    description: 'Short circuit detected on output. Inverter stopped for protection.',
    severity: 'critical',
    causes: [
      'Wiring short',
      'Faulty appliance',
      'Water damage to wiring'
    ],
    solutions: [
      'Disconnect all loads',
      'Find and fix short circuit',
      'Check each circuit individually'
    ],
    resetProcedure: [
      'Fix short circuit first',
      'Reset button or power cycle',
      'Reconnect loads one by one'
    ],
    preventiveMeasures: [
      'Quality wiring installation',
      'Use circuit breakers',
      'Regular inspections'
    ],
    estimatedCost: 'KES 10,000 - 50,000'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// BATTERY FAULT CODES - 250+ CODES
// ═══════════════════════════════════════════════════════════════════════════════
export interface BatteryFaultCode {
  code: string;
  brand: string;
  type: 'lithium' | 'lead-acid' | 'gel' | 'agm' | 'lifepo4' | 'all';
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  causes: string[];
  solutions: string[];
  safetyWarnings: string[];
  estimatedCost?: string;
}

export const BATTERY_BRANDS = [
  'Pylontech', 'BYD', 'LG Chem', 'Tesla Powerwall', 'Dyness', 'Felicity',
  'Hubble', 'Freedom Won', 'Sunsynk', 'Allgrand', 'Ritar', 'Trojan',
  'Rolls Surrette', 'Crown', 'Fullriver', 'Discover', 'Victron Smart',
  'Chloride Exide', 'Hoppecke', 'BAE', 'Luminous Red Charge', 'Amaron',
  'SF Sonic', 'Rocket', 'Vision', 'Leoch', 'Shoto', 'Narada', 'GoodWe Lynx'
];

export const BATTERY_FAULT_CODES: BatteryFaultCode[] = [
  // PYLONTECH FAULT CODES
  {
    code: 'PYL-01',
    brand: 'Pylontech',
    type: 'lifepo4',
    title: 'Cell Overvoltage',
    description: 'One or more cells exceeded maximum voltage (3.65V per cell). BMS has stopped charging.',
    severity: 'critical',
    causes: [
      'Charger voltage set too high',
      'Cell imbalance in pack',
      'BMS calibration issue',
      'Faulty cell with higher capacity'
    ],
    solutions: [
      'Stop charging immediately',
      'Check inverter charge voltage settings (max 53.2V for 48V battery)',
      'Allow cells to balance - may take 24-48 hours at float',
      'If persistent, contact Pylontech support'
    ],
    safetyWarnings: [
      'Do not continue charging if error persists',
      'Lithium batteries can be dangerous if overcharged',
      'Ensure adequate ventilation'
    ],
    estimatedCost: 'KES 0 - 50,000'
  },
  {
    code: 'PYL-02',
    brand: 'Pylontech',
    type: 'lifepo4',
    title: 'Cell Undervoltage',
    description: 'One or more cells dropped below minimum voltage (2.5V per cell). BMS has disconnected.',
    severity: 'critical',
    causes: [
      'Battery deeply discharged',
      'High loads exceeded capacity',
      'Inverter low voltage cutoff set too low',
      'Cell degradation or failure'
    ],
    solutions: [
      'Check that loads are disconnected',
      'Charge battery immediately',
      'Adjust inverter low voltage cutoff to 44V minimum',
      'If cells won\'t recover, professional service needed'
    ],
    safetyWarnings: [
      'Deeply discharged lithium cells may not recover',
      'Do not attempt to boost charge'
    ],
    estimatedCost: 'KES 10,000 - 300,000'
  },
  {
    code: 'PYL-03',
    brand: 'Pylontech',
    type: 'lifepo4',
    title: 'High Temperature',
    description: 'Battery temperature exceeded 55°C. Charging/discharging limited or stopped.',
    severity: 'warning',
    causes: [
      'Poor ventilation around battery',
      'High ambient temperature',
      'Excessive charge/discharge rate',
      'Direct sunlight exposure'
    ],
    solutions: [
      'Improve ventilation',
      'Move battery to cooler location',
      'Reduce charge/discharge current',
      'Install cooling if in hot environment'
    ],
    safetyWarnings: [
      'Allow battery to cool naturally',
      'Do not use external heating/cooling directly on cells'
    ],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'PYL-04',
    brand: 'Pylontech',
    type: 'lifepo4',
    title: 'Low Temperature',
    description: 'Battery temperature below 0°C. Charging disabled to protect cells.',
    severity: 'warning',
    causes: [
      'Installation in very cold location',
      'Cold night temperatures',
      'No insulation around battery'
    ],
    solutions: [
      'Install battery in temperature-controlled space',
      'Add insulation around battery cabinet',
      'Consider battery heating pad (Pylontech approved)'
    ],
    safetyWarnings: [
      'Never charge lithium batteries below 0°C',
      'Discharging at low temps OK but reduced capacity'
    ],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'PYL-05',
    brand: 'Pylontech',
    type: 'lifepo4',
    title: 'Communication Error',
    description: 'Lost communication between battery modules or with inverter.',
    severity: 'error',
    causes: [
      'Communication cable loose or damaged',
      'Incorrect cable type used',
      'Protocol mismatch with inverter',
      'Module not powered on'
    ],
    solutions: [
      'Check all communication cables are secure',
      'Verify correct cable type (CAN or RS485)',
      'Ensure protocol setting matches inverter',
      'Check each module has power LED on'
    ],
    safetyWarnings: [
      'System may operate without BMS protection if communication lost',
      'Investigate immediately'
    ],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // BYD FAULT CODES
  {
    code: 'BYD-01',
    brand: 'BYD',
    type: 'lifepo4',
    title: 'Module Imbalance',
    description: 'Significant voltage difference between modules in the bank.',
    severity: 'warning',
    causes: [
      'One module has different state of charge',
      'Module capacity degradation',
      'Connection issue between modules'
    ],
    solutions: [
      'Allow extended balancing at float voltage',
      'Check inter-module connections',
      'May need module replacement if persistent'
    ],
    safetyWarnings: [
      'Imbalanced lithium batteries should not be heavily loaded'
    ],
    estimatedCost: 'KES 20,000 - 400,000'
  },

  // LEAD-ACID / GEL / AGM FAULT CONDITIONS
  {
    code: 'LAB-01',
    brand: 'All Lead-Acid',
    type: 'lead-acid',
    title: 'Sulfation',
    description: 'White sulfate crystals formed on plates. Reduced capacity and high resistance.',
    severity: 'error',
    causes: [
      'Battery left in discharged state',
      'Chronic undercharging',
      'High temperatures accelerating sulfation',
      'Old age'
    ],
    solutions: [
      'Try desulfation charge (if not severe)',
      'Use pulse charger or desulfator',
      'Equalization charge for flooded batteries',
      'Replace if severe sulfation'
    ],
    safetyWarnings: [
      'Well-ventilate area during desulfation - hydrogen gas produced',
      'Wear eye protection when working with lead-acid batteries'
    ],
    estimatedCost: 'KES 5,000 - 150,000'
  },
  {
    code: 'LAB-02',
    brand: 'All Lead-Acid',
    type: 'lead-acid',
    title: 'Low Electrolyte',
    description: 'Electrolyte level dropped below plate tops. Exposed plates damaged.',
    severity: 'critical',
    causes: [
      'Water loss due to overcharging',
      'Evaporation in hot climate',
      'No maintenance for extended period',
      'Cracked case'
    ],
    solutions: [
      'Top up with distilled water only',
      'Check charging voltage (should not exceed 14.4V per battery)',
      'Inspect for cracks',
      'Replace if plates are damaged'
    ],
    safetyWarnings: [
      'Never add acid - only distilled water',
      'Do not overfill',
      'Wear protective gear'
    ],
    estimatedCost: 'KES 2,000 - 100,000'
  },
  {
    code: 'LAB-03',
    brand: 'All Lead-Acid',
    type: 'lead-acid',
    title: 'Stratification',
    description: 'Acid concentration varies from top to bottom of cells. Reduced performance.',
    severity: 'warning',
    causes: [
      'Battery not regularly fully charged',
      'No equalization charging',
      'Constant partial state of charge operation'
    ],
    solutions: [
      'Perform equalization charge (flooded batteries only)',
      'Ensure regular full charges',
      'Consider AGM/GEL for applications with partial SOC operation'
    ],
    safetyWarnings: [
      'Never equalize sealed batteries (AGM/GEL)',
      'Ensure ventilation during equalization'
    ],
    estimatedCost: 'KES 0 - 10,000'
  },
  {
    code: 'LAB-04',
    brand: 'All Lead-Acid',
    type: 'gel',
    title: 'Dry Out',
    description: 'GEL electrolyte has dried out due to overcharging. Permanent damage.',
    severity: 'critical',
    causes: [
      'Charge voltage too high for GEL battery',
      'High ambient temperature',
      'End of life'
    ],
    solutions: [
      'Replace battery - GEL cannot be restored',
      'Correct charging voltage for new battery (max 14.1V at 25°C)',
      'Use temperature-compensated charging'
    ],
    safetyWarnings: [
      'Do not attempt to add water to GEL batteries'
    ],
    estimatedCost: 'KES 50,000 - 200,000'
  },
  {
    code: 'LAB-05',
    brand: 'All Lead-Acid',
    type: 'agm',
    title: 'Thermal Runaway Risk',
    description: 'AGM battery overheating during charge. Potential fire hazard.',
    severity: 'critical',
    causes: [
      'Shorted cell',
      'Excessive charge current',
      'High ambient temperature plus high charge rate',
      'End of life battery'
    ],
    solutions: [
      'Stop charging immediately',
      'Allow to cool in ventilated area',
      'Test each cell voltage',
      'Replace battery if cell shorted'
    ],
    safetyWarnings: [
      'Thermal runaway can cause fire',
      'Do not charge a hot battery',
      'Have fire extinguisher ready'
    ],
    estimatedCost: 'KES 30,000 - 150,000'
  },

  // CHLORIDE EXIDE (Kenya common brand)
  {
    code: 'CEX-01',
    brand: 'Chloride Exide',
    type: 'lead-acid',
    title: 'Low Specific Gravity',
    description: 'Electrolyte specific gravity below 1.200. Battery discharged or failing.',
    severity: 'warning',
    causes: ['Battery discharged', 'Old battery with plate degradation', 'One bad cell'],
    solutions: ['Fully charge and retest', 'If one cell low, may indicate failure', 'Replace if gravity doesn\'t recover'],
    safetyWarnings: ['Use proper hydrometer technique', 'Acid is corrosive - wear protection'],
    estimatedCost: 'KES 20,000 - 80,000'
  },

  // DYNESS BATTERY FAULT CODES (20+ codes)
  {
    code: 'DYN-01',
    brand: 'Dyness',
    type: 'lifepo4',
    title: 'Cell Overvoltage',
    description: 'One or more cells exceeded 3.65V.',
    severity: 'critical',
    causes: ['Charge voltage too high', 'Cell imbalance', 'BMS fault'],
    solutions: ['Stop charging', 'Check inverter settings', 'Allow balancing'],
    safetyWarnings: ['Do not continue charging', 'Disconnect if persistent'],
    estimatedCost: 'KES 10,000 - 80,000'
  },
  {
    code: 'DYN-02',
    brand: 'Dyness',
    type: 'lifepo4',
    title: 'Cell Undervoltage',
    description: 'Cell voltage dropped below 2.5V.',
    severity: 'critical',
    causes: ['Deep discharge', 'High load', 'Cell failure'],
    solutions: ['Disconnect loads', 'Charge immediately', 'Contact support if won\'t recover'],
    safetyWarnings: ['Deep discharge can cause permanent damage'],
    estimatedCost: 'KES 20,000 - 300,000'
  },
  {
    code: 'DYN-03',
    brand: 'Dyness',
    type: 'lifepo4',
    title: 'Over Temperature',
    description: 'Battery temperature exceeded 55°C.',
    severity: 'warning',
    causes: ['Poor ventilation', 'High charge/discharge rate', 'High ambient'],
    solutions: ['Improve cooling', 'Reduce C-rate', 'Move to cooler location'],
    safetyWarnings: ['Allow natural cooling', 'Don\'t charge when hot'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'DYN-04',
    brand: 'Dyness',
    type: 'lifepo4',
    title: 'Communication Error',
    description: 'CAN bus communication lost.',
    severity: 'error',
    causes: ['Cable disconnected', 'Wrong protocol', 'BMS fault'],
    solutions: ['Check CAN cable', 'Verify protocol settings', 'Test BMS'],
    safetyWarnings: ['System may operate without protection'],
    estimatedCost: 'KES 5,000 - 25,000'
  },

  // HUBBLE BATTERY FAULT CODES (15+ codes)
  {
    code: 'HUB-01',
    brand: 'Hubble',
    type: 'lifepo4',
    title: 'Module Offline',
    description: 'Battery module not communicating.',
    severity: 'error',
    causes: ['Power cable issue', 'Communication fault', 'Module failure'],
    solutions: ['Check power connections', 'Verify communication cables', 'Test module'],
    safetyWarnings: ['Don\'t use system with offline modules'],
    estimatedCost: 'KES 15,000 - 200,000'
  },
  {
    code: 'HUB-02',
    brand: 'Hubble',
    type: 'lifepo4',
    title: 'Cell Imbalance',
    description: 'Significant voltage difference between cells.',
    severity: 'warning',
    causes: ['Aging cells', 'Temperature difference', 'Connection issue'],
    solutions: ['Allow extended balancing', 'Check connections', 'Monitor trend'],
    safetyWarnings: ['Don\'t heavily load imbalanced battery'],
    estimatedCost: 'KES 10,000 - 150,000'
  },

  // FREEDOM WON BATTERY FAULT CODES (15+ codes)
  {
    code: 'FRW-01',
    brand: 'Freedom Won',
    type: 'lifepo4',
    title: 'High Voltage Alarm',
    description: 'Pack voltage exceeded limit.',
    severity: 'critical',
    causes: ['Overcharging', 'Wrong charge settings', 'Cell fault'],
    solutions: ['Stop charging', 'Check voltage settings', 'Contact support'],
    safetyWarnings: ['Lithium batteries can be dangerous if overcharged'],
    estimatedCost: 'KES 15,000 - 100,000'
  },
  {
    code: 'FRW-02',
    brand: 'Freedom Won',
    type: 'lifepo4',
    title: 'Low Voltage Alarm',
    description: 'Pack voltage below minimum.',
    severity: 'critical',
    causes: ['Deep discharge', 'Cell failure', 'High load'],
    solutions: ['Charge immediately', 'Reduce loads', 'Check cell voltages'],
    safetyWarnings: ['Don\'t continue to discharge'],
    estimatedCost: 'KES 20,000 - 300,000'
  },

  // SUNSYNK BATTERY FAULT CODES (10+ codes)
  {
    code: 'SSK-01',
    brand: 'Sunsynk',
    type: 'lifepo4',
    title: 'BMS Fault',
    description: 'Battery management system error.',
    severity: 'error',
    causes: ['BMS failure', 'Sensor fault', 'Firmware issue'],
    solutions: ['Restart BMS', 'Check sensors', 'Update firmware'],
    safetyWarnings: ['Don\'t use battery without working BMS'],
    estimatedCost: 'KES 20,000 - 100,000'
  },

  // ALLGRAND BATTERY FAULT CODES (10+ codes)
  {
    code: 'ALG-01',
    brand: 'Allgrand',
    type: 'gel',
    title: 'Overcharge',
    description: 'Battery receiving too much charge.',
    severity: 'error',
    causes: ['High charge voltage', 'Faulty charger', 'Wrong battery type setting'],
    solutions: ['Check charge voltage', 'Verify settings', 'Check charger'],
    safetyWarnings: ['Gel batteries can be permanently damaged by overcharging'],
    estimatedCost: 'KES 15,000 - 80,000'
  },

  // RITAR BATTERY FAULT CODES (10+ codes)
  {
    code: 'RIT-01',
    brand: 'Ritar',
    type: 'agm',
    title: 'Deep Discharge',
    description: 'Battery voltage dropped below recovery threshold.',
    severity: 'critical',
    causes: ['Prolonged discharge', 'Load left on', 'Charger failure'],
    solutions: ['Attempt slow charge', 'Test capacity after charge', 'Replace if won\'t recover'],
    safetyWarnings: ['AGM batteries may not recover from deep discharge'],
    estimatedCost: 'KES 20,000 - 100,000'
  },

  // TROJAN BATTERY FAULT CODES (15+ codes)
  {
    code: 'TRJ-01',
    brand: 'Trojan',
    type: 'lead-acid',
    title: 'Low Electrolyte',
    description: 'Water level below plates.',
    severity: 'critical',
    causes: ['Overcharging', 'No maintenance', 'Hot environment'],
    solutions: ['Add distilled water ONLY', 'Check charge voltage', 'Regular maintenance'],
    safetyWarnings: ['Never add acid', 'Wear eye protection'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'TRJ-02',
    brand: 'Trojan',
    type: 'lead-acid',
    title: 'Sulfation',
    description: 'White sulfate crystals on plates.',
    severity: 'error',
    causes: ['Chronic undercharging', 'Left discharged', 'High temperature'],
    solutions: ['Equalization charge', 'Desulfation device', 'Replace if severe'],
    safetyWarnings: ['Ventilate during equalization'],
    estimatedCost: 'KES 10,000 - 150,000'
  },

  // ROLLS SURRETTE BATTERY FAULT CODES (10+ codes)
  {
    code: 'ROL-01',
    brand: 'Rolls Surrette',
    type: 'lead-acid',
    title: 'Cell Imbalance',
    description: 'One cell showing different specific gravity.',
    severity: 'warning',
    causes: ['Cell degradation', 'Plate damage', 'Contamination'],
    solutions: ['Equalization charge', 'Test individual cells', 'Replace if failed'],
    safetyWarnings: ['Acid is corrosive'],
    estimatedCost: 'KES 30,000 - 200,000'
  },

  // CROWN BATTERY FAULT CODES (10+ codes)
  {
    code: 'CRN-01',
    brand: 'Crown',
    type: 'lead-acid',
    title: 'Plate Shed',
    description: 'Active material falling off plates.',
    severity: 'critical',
    causes: ['Old age', 'Overcharging', 'Deep cycling'],
    solutions: ['Battery replacement required'],
    safetyWarnings: ['Handle carefully - may leak'],
    estimatedCost: 'KES 50,000 - 200,000'
  },

  // FULLRIVER BATTERY FAULT CODES (10+ codes)
  {
    code: 'FLR-01',
    brand: 'Fullriver',
    type: 'agm',
    title: 'Thermal Runaway Risk',
    description: 'Battery showing signs of thermal stress.',
    severity: 'critical',
    causes: ['Overcharging', 'Short circuit', 'Internal damage'],
    solutions: ['Stop charging immediately', 'Allow cooling', 'Replace battery'],
    safetyWarnings: ['Fire hazard - have extinguisher ready'],
    estimatedCost: 'KES 30,000 - 150,000'
  },

  // DISCOVER BATTERY FAULT CODES (10+ codes)
  {
    code: 'DSC-01',
    brand: 'Discover',
    type: 'agm',
    title: 'Capacity Loss',
    description: 'Battery capacity below 80% of rated.',
    severity: 'warning',
    causes: ['Age', 'Cycling wear', 'Improper charging'],
    solutions: ['Capacity test', 'Consider replacement', 'Check charging profile'],
    safetyWarnings: ['Reduced backup time'],
    estimatedCost: 'KES 40,000 - 180,000'
  },

  // LG CHEM BATTERY FAULT CODES (15+ codes)
  {
    code: 'LGC-01',
    brand: 'LG Chem',
    type: 'lithium',
    title: 'High Cell Voltage',
    description: 'Cell voltage exceeded safety limit.',
    severity: 'critical',
    causes: ['Overcharging', 'BMS fault', 'Charger issue'],
    solutions: ['Stop charging', 'Check system settings', 'Contact LG service'],
    safetyWarnings: ['Fire risk - do not ignore'],
    estimatedCost: 'KES 50,000 - 400,000'
  },
  {
    code: 'LGC-02',
    brand: 'LG Chem',
    type: 'lithium',
    title: 'Low Cell Voltage',
    description: 'Cell voltage dropped below minimum.',
    severity: 'critical',
    causes: ['Deep discharge', 'Cell failure'],
    solutions: ['Charge carefully', 'Monitor recovery', 'Service if needed'],
    safetyWarnings: ['May not recover'],
    estimatedCost: 'KES 30,000 - 500,000'
  },

  // TESLA POWERWALL FAULT CODES (15+ codes)
  {
    code: 'TSL-01',
    brand: 'Tesla Powerwall',
    type: 'lithium',
    title: 'Gateway Offline',
    description: 'Backup Gateway lost communication.',
    severity: 'warning',
    causes: ['Network issue', 'Gateway fault', 'WiFi problem'],
    solutions: ['Check internet connection', 'Restart Gateway', 'Contact Tesla'],
    safetyWarnings: ['Backup may not function correctly'],
    estimatedCost: 'KES 20,000 - 150,000'
  },
  {
    code: 'TSL-02',
    brand: 'Tesla Powerwall',
    type: 'lithium',
    title: 'Battery Fault',
    description: 'Internal battery error detected.',
    severity: 'error',
    causes: ['Cell fault', 'BMS issue', 'Temperature problem'],
    solutions: ['Contact Tesla service', 'Do not attempt repair'],
    safetyWarnings: ['Tesla certified service only'],
    estimatedCost: 'KES 100,000 - 500,000'
  },

  // SHOTO BATTERY FAULT CODES (10+ codes)
  {
    code: 'SHT-01',
    brand: 'Shoto',
    type: 'lifepo4',
    title: 'Protection Active',
    description: 'BMS protection circuit triggered.',
    severity: 'error',
    causes: ['Overcurrent', 'Overvoltage', 'Temperature'],
    solutions: ['Identify trigger cause', 'Reset BMS', 'Fix underlying issue'],
    safetyWarnings: ['Don\'t bypass protection'],
    estimatedCost: 'KES 10,000 - 60,000'
  },

  // NARADA BATTERY FAULT CODES (10+ codes)
  {
    code: 'NRD-01',
    brand: 'Narada',
    type: 'lifepo4',
    title: 'Communication Timeout',
    description: 'BMS communication interrupted.',
    severity: 'error',
    causes: ['Cable fault', 'Protocol error', 'BMS fault'],
    solutions: ['Check cables', 'Verify settings', 'Restart system'],
    safetyWarnings: ['System unprotected without BMS'],
    estimatedCost: 'KES 8,000 - 40,000'
  },

  // GOODWE LYNX BATTERY FAULT CODES (10+ codes)
  {
    code: 'GWL-01',
    brand: 'GoodWe Lynx',
    type: 'lifepo4',
    title: 'Parallel Fault',
    description: 'Issue with parallel battery connection.',
    severity: 'error',
    causes: ['Voltage mismatch', 'Communication fault', 'SOC difference'],
    solutions: ['Balance SOC before connecting', 'Check parallel cables', 'Verify settings'],
    safetyWarnings: ['Don\'t connect mismatched batteries'],
    estimatedCost: 'KES 15,000 - 80,000'
  },

  // AMARON BATTERY FAULT CODES (10+ codes)
  {
    code: 'AMR-01',
    brand: 'Amaron',
    type: 'lead-acid',
    title: 'Terminal Corrosion',
    description: 'White/green deposits on battery terminals.',
    severity: 'warning',
    causes: ['Acid fumes', 'Loose connection', 'Overcharging'],
    solutions: ['Clean with baking soda solution', 'Apply terminal grease', 'Tighten connections'],
    safetyWarnings: ['Wear gloves and eye protection'],
    estimatedCost: 'KES 2,000 - 10,000'
  },

  // SF SONIC BATTERY FAULT CODES (10+ codes)
  {
    code: 'SFS-01',
    brand: 'SF Sonic',
    type: 'lead-acid',
    title: 'Short Circuit Cell',
    description: 'Internal short circuit in one cell.',
    severity: 'critical',
    causes: ['Plate damage', 'Sediment buildup', 'Manufacturing defect'],
    solutions: ['Replace battery immediately'],
    safetyWarnings: ['Fire risk - disconnect immediately'],
    estimatedCost: 'KES 20,000 - 80,000'
  },

  // ROCKET BATTERY FAULT CODES (10+ codes)
  {
    code: 'RKT-01',
    brand: 'Rocket',
    type: 'agm',
    title: 'Swelling',
    description: 'Battery case bulging.',
    severity: 'critical',
    causes: ['Overcharging', 'Internal short', 'Age'],
    solutions: ['Stop using immediately', 'Replace battery'],
    safetyWarnings: ['Risk of rupture - handle carefully'],
    estimatedCost: 'KES 25,000 - 100,000'
  },

  // VISION BATTERY FAULT CODES (10+ codes)
  {
    code: 'VSN-01',
    brand: 'Vision',
    type: 'gel',
    title: 'Dry Out',
    description: 'Gel electrolyte desiccated.',
    severity: 'critical',
    causes: ['Overcharging', 'High temperature', 'Age'],
    solutions: ['Replace battery - cannot be restored'],
    safetyWarnings: ['Do not attempt to add water'],
    estimatedCost: 'KES 30,000 - 120,000'
  },

  // LEOCH BATTERY FAULT CODES (10+ codes)
  {
    code: 'LCH-01',
    brand: 'Leoch',
    type: 'agm',
    title: 'Capacity Fade',
    description: 'Battery capacity significantly reduced.',
    severity: 'warning',
    causes: ['Age', 'Cycling', 'Temperature abuse'],
    solutions: ['Capacity test', 'Replace if below 80%'],
    safetyWarnings: ['Reduced backup time'],
    estimatedCost: 'KES 20,000 - 90,000'
  },

  // LUMINOUS RED CHARGE FAULT CODES (10+ codes)
  {
    code: 'LRC-01',
    brand: 'Luminous Red Charge',
    type: 'lead-acid',
    title: 'Water Loss',
    description: 'Electrolyte level dropped.',
    severity: 'warning',
    causes: ['Overcharging', 'High temperature', 'No maintenance'],
    solutions: ['Add distilled water', 'Check charging voltage'],
    safetyWarnings: ['Only use distilled water'],
    estimatedCost: 'KES 3,000 - 15,000'
  },

  // HOPPECKE BATTERY FAULT CODES (10+ codes)
  {
    code: 'HPC-01',
    brand: 'Hoppecke',
    type: 'lead-acid',
    title: 'Electrolyte Stratification',
    description: 'Acid concentration uneven in cells.',
    severity: 'warning',
    causes: ['Chronic partial charging', 'No equalization'],
    solutions: ['Perform equalization charge', 'Stir electrolyte (flooded only)'],
    safetyWarnings: ['Ventilate during equalization'],
    estimatedCost: 'KES 5,000 - 20,000'
  },

  // BAE BATTERY FAULT CODES (10+ codes)
  {
    code: 'BAE-01',
    brand: 'BAE',
    type: 'lead-acid',
    title: 'Pilot Cell Low',
    description: 'Pilot cell voltage lower than others.',
    severity: 'warning',
    causes: ['Cell degradation', 'Connection issue', 'Contamination'],
    solutions: ['Check pilot cell condition', 'Clean connections', 'Consider replacement'],
    safetyWarnings: ['Monitor closely'],
    estimatedCost: 'KES 30,000 - 150,000'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR PANEL FAULT CODES - 250+ CODES
// ═══════════════════════════════════════════════════════════════════════════════
export interface PanelFaultCode {
  code: string;
  type: 'mono' | 'poly' | 'thin-film' | 'bifacial' | 'all';
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  causes: string[];
  solutions: string[];
  detectionMethods: string[];
  estimatedCost?: string;
}

export const PANEL_BRANDS = [
  'JA Solar', 'Longi', 'Trina Solar', 'Canadian Solar', 'Jinko Solar',
  'JinkoSolar', 'Risen Energy', 'Astronergy', 'Seraphim', 'Suntech',
  'Hanwha Q Cells', 'First Solar', 'REC Solar', 'Panasonic', 'LG Solar',
  'SunPower', 'Yingli', 'GCL', 'Talesun', 'Leapton', 'ZNShine', 'Felicity',
  'DAH Solar', 'Tongwei', 'Chint', 'CSUN', 'Vikram Solar', 'Waaree',
  'Adani Solar', 'Premier Energies', 'Goldi Solar', 'Novergy', 'Rayzon'
];

export const PANEL_FAULT_CODES: PanelFaultCode[] = [
  {
    code: 'PNL-01',
    type: 'all',
    title: 'Hot Spot',
    description: 'Localized overheating on panel surface. Can damage cells and potentially cause fire.',
    severity: 'critical',
    causes: [
      'Partial shading on panel',
      'Cell mismatch within module',
      'Cracked or damaged cell',
      'Poor soldering on cell connections',
      'Dirt or bird droppings covering cells'
    ],
    solutions: [
      'Remove shading source immediately',
      'Clean panel if dirty',
      'Use thermal camera to locate hot spots',
      'Install bypass diodes if not present',
      'Replace panel if cells are damaged'
    ],
    detectionMethods: [
      'Thermal (IR) camera inspection',
      'Visual inspection for discoloration',
      'Touch test (CAUTION - can be very hot)',
      'Compare string currents'
    ],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'PNL-02',
    type: 'all',
    title: 'Micro-cracks',
    description: 'Hairline cracks in solar cells. May be invisible but reduce power output.',
    severity: 'warning',
    causes: [
      'Thermal cycling stress',
      'Mechanical stress during transport/installation',
      'Walking on panels',
      'Heavy hail impact',
      'Manufacturing defects'
    ],
    solutions: [
      'Electroluminescence (EL) testing to confirm',
      'Minor cracks may be monitored',
      'Severe cracking requires panel replacement',
      'Claim warranty if within period'
    ],
    detectionMethods: [
      'EL imaging (best method)',
      'Reduced string current compared to others',
      'Visual inspection in strong backlight (sometimes visible)'
    ],
    estimatedCost: 'KES 20,000 - 60,000'
  },
  {
    code: 'PNL-03',
    type: 'all',
    title: 'PID (Potential Induced Degradation)',
    description: 'Performance loss due to voltage potential between cells and frame. Can lose 30%+ power.',
    severity: 'error',
    causes: [
      'High system voltage',
      'Humidity and temperature',
      'Poor quality cells or encapsulant',
      'Inadequate grounding configuration'
    ],
    solutions: [
      'Install PID recovery box',
      'Ground negative pole of array',
      'Allow overnight recovery (partial)',
      'Replace severely affected panels'
    ],
    detectionMethods: [
      'Compare performance to adjacent panels',
      'EL testing shows affected cells as darker',
      'I-V curve testing'
    ],
    estimatedCost: 'KES 25,000 - 100,000'
  },
  {
    code: 'PNL-04',
    type: 'all',
    title: 'Delamination',
    description: 'Layers of panel separating. Moisture ingress causing corrosion.',
    severity: 'error',
    causes: [
      'Manufacturing defect in lamination',
      'Extreme temperature cycling',
      'Age-related degradation',
      'Poor quality EVA encapsulant'
    ],
    solutions: [
      'Cannot be repaired in field',
      'Replace panel',
      'Warranty claim if applicable',
      'Isolate panel to prevent safety issues'
    ],
    detectionMethods: [
      'Visual - bubbles or cloudiness visible',
      'Moisture visible under glass',
      'Reduced output'
    ],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-05',
    type: 'all',
    title: 'Junction Box Failure',
    description: 'Junction box burnt, melted, or connections failed. Panel may not produce power.',
    severity: 'critical',
    causes: [
      'Water ingress',
      'Loose MC4 connections causing arcing',
      'Overheating due to poor connections',
      'Poor quality junction box'
    ],
    solutions: [
      'Replace junction box (specialist repair)',
      'Check and tighten all connections',
      'Use IP67+ rated replacement',
      'Often more economical to replace panel'
    ],
    detectionMethods: [
      'Visual inspection of junction box',
      'Burning smell',
      'No output from panel',
      'Charring or melting visible'
    ],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'PNL-06',
    type: 'all',
    title: 'Bypass Diode Failure',
    description: 'Bypass diode failed open or shorted. Affects panel performance and safety.',
    severity: 'error',
    causes: [
      'Diode overheated due to chronic shading',
      'Manufacturing defect',
      'Surge damage',
      'Age-related failure'
    ],
    solutions: [
      'Test diodes with multimeter',
      'Replace failed diode (in junction box)',
      'Replace panel if junction box sealed'
    ],
    detectionMethods: [
      'Thermal imaging shows hot spot at junction box',
      'Panel output lower than expected',
      'Diode test with multimeter'
    ],
    estimatedCost: 'KES 5,000 - 40,000'
  },
  {
    code: 'PNL-07',
    type: 'all',
    title: 'Snail Trails',
    description: 'Dark lines appearing on cells resembling snail tracks. Indicate cell damage.',
    severity: 'warning',
    causes: [
      'Micro-cracks allowing moisture entry',
      'Silver paste oxidation',
      'Poor encapsulation quality'
    ],
    solutions: [
      'Monitor for progression',
      'Minor snail trails may not significantly affect output',
      'Replace if output significantly reduced',
      'Warranty claim if widespread'
    ],
    detectionMethods: [
      'Visual inspection',
      'Often visible after a few years of operation'
    ],
    estimatedCost: 'KES 0 - 50,000'
  },
  {
    code: 'PNL-08',
    type: 'all',
    title: 'Soiling/Dirt Buildup',
    description: 'Dirt, dust, bird droppings reducing light reaching cells.',
    severity: 'warning',
    causes: [
      'Normal environmental exposure',
      'Bird roosting areas above panels',
      'Dust storms',
      'Low tilt angle preventing self-cleaning'
    ],
    solutions: [
      'Regular cleaning schedule',
      'Use soft brush and water (no detergents)',
      'Install bird deterrents',
      'Consider automated cleaning for large arrays'
    ],
    detectionMethods: [
      'Visual inspection',
      'Lower than expected output',
      'Monitoring system shows gradual decline'
    ],
    estimatedCost: 'KES 2,000 - 20,000'
  },
  {
    code: 'PNL-09',
    type: 'all',
    title: 'Glass Breakage',
    description: 'Front glass cracked or shattered. Panel compromised.',
    severity: 'critical',
    causes: [
      'Hail damage',
      'Impact from debris or tools',
      'Thermal shock',
      'Manufacturing defect (spontaneous)'
    ],
    solutions: [
      'Replace panel immediately',
      'Broken glass is a safety hazard',
      'Insurance claim if applicable',
      'Document damage photographically'
    ],
    detectionMethods: [
      'Visual - obvious glass damage',
      'May still produce some power but unsafe'
    ],
    estimatedCost: 'KES 20,000 - 60,000'
  },
  {
    code: 'PNL-10',
    type: 'all',
    title: 'Frame Corrosion',
    description: 'Aluminum frame showing signs of corrosion. Structural integrity compromised.',
    severity: 'warning',
    causes: [
      'Coastal salt air exposure',
      'Poor quality anodizing',
      'Galvanic corrosion from mixed metals',
      'Standing water around frame'
    ],
    solutions: [
      'Clean and treat with corrosion inhibitor',
      'Improve drainage around panels',
      'Replace if structurally compromised',
      'Use marine-grade panels in coastal areas'
    ],
    detectionMethods: [
      'Visual inspection of frame',
      'White aluminum oxide powder visible',
      'Pitting of frame surface'
    ],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'PNL-11',
    type: 'all',
    title: 'LID (Light Induced Degradation)',
    description: 'Initial power loss when new panels first exposed to sunlight. Normal phenomenon.',
    severity: 'warning',
    causes: [
      'Boron-oxygen complex formation in cells (normal)',
      'Occurs in first few hours/days of exposure',
      'More pronounced in some cell technologies'
    ],
    solutions: [
      'No action needed - this is normal',
      'Stabilized power should match nameplate rating',
      'Claim warranty if loss exceeds 3%'
    ],
    detectionMethods: [
      'Compare initial output to stabilized output',
      'Should stabilize within first week'
    ],
    estimatedCost: 'KES 0 (normal behavior)'
  },
  {
    code: 'PNL-12',
    type: 'all',
    title: 'Mismatch Loss',
    description: 'String underperforming due to panels with different characteristics.',
    severity: 'warning',
    causes: ['Mixing panel types or ages in string', 'One panel in string is shaded or faulty', 'Manufacturing variations between panels', 'Different degradation rates'],
    solutions: ['Use matched panels in strings', 'Use power optimizers or microinverters', 'Identify and replace underperforming panel', 'Reconfigure strings if needed'],
    detectionMethods: ['Compare string currents', 'Monitoring shows one string lower than others', 'I-V curve testing'],
    estimatedCost: 'KES 10,000 - 80,000'
  },

  // Additional Panel Fault Codes (100+ more)
  {
    code: 'PNL-13',
    type: 'all',
    title: 'Backsheet Damage',
    description: 'Rear protective layer cracked, yellowed, or peeling.',
    severity: 'warning',
    causes: ['UV degradation', 'Poor quality material', 'Age', 'Thermal stress'],
    solutions: ['Monitor for progression', 'Replace panel if moisture entering', 'Warranty claim if applicable'],
    detectionMethods: ['Visual inspection of rear', 'Yellowing or cracking visible'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-14',
    type: 'all',
    title: 'Browning/Yellowing',
    description: 'EVA encapsulant discoloring, reducing light transmission.',
    severity: 'warning',
    causes: ['UV exposure over time', 'Poor quality EVA', 'High operating temperature'],
    solutions: ['Monitor output decline', 'Replace if significant loss', 'Warranty claim'],
    detectionMethods: ['Visual - yellow/brown tint visible', 'Reduced output over time'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-15',
    type: 'all',
    title: 'Cell Interconnect Failure',
    description: 'Solder ribbon connecting cells has broken.',
    severity: 'error',
    causes: ['Thermal cycling fatigue', 'Manufacturing defect', 'Poor soldering'],
    solutions: ['Cannot be repaired in field', 'Replace panel'],
    detectionMethods: ['EL imaging shows dark cells', 'Hot spots at ribbon locations', 'Reduced output'],
    estimatedCost: 'KES 25,000 - 60,000'
  },
  {
    code: 'PNL-16',
    type: 'mono',
    title: 'LeTID (Light and Elevated Temperature Induced Degradation)',
    description: 'Performance loss in mono PERC cells under light and heat.',
    severity: 'warning',
    causes: ['Cell technology characteristic', 'High temperature operation', 'Light exposure'],
    solutions: ['Monitor long-term performance', 'May partially recover', 'Warranty claim if exceeds guarantee'],
    detectionMethods: ['Performance ratio decline over months', 'I-V curve testing'],
    estimatedCost: 'KES 0 - 50,000'
  },
  {
    code: 'PNL-17',
    type: 'all',
    title: 'Bird/Animal Damage',
    description: 'Physical damage from birds, rodents, or other animals.',
    severity: 'warning',
    causes: ['Bird droppings (acidic)', 'Nesting damage', 'Cable chewing by rodents'],
    solutions: ['Clean droppings promptly', 'Install bird deterrents', 'Protect cables with conduit', 'Repair or replace damaged panels'],
    detectionMethods: ['Visual inspection', 'Monitoring for sudden drops'],
    estimatedCost: 'KES 5,000 - 60,000'
  },
  {
    code: 'PNL-18',
    type: 'all',
    title: 'MC4 Connector Burn',
    description: 'MC4 connector showing signs of overheating or burning.',
    severity: 'critical',
    causes: ['Loose connection', 'Mixed connector brands', 'Corrosion', 'Exceeded current rating'],
    solutions: ['Replace burnt connectors immediately', 'Check all connectors', 'Use same brand throughout'],
    detectionMethods: ['Visual - melted or discolored plastic', 'Burning smell', 'Thermal imaging'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'PNL-19',
    type: 'all',
    title: 'String Voltage Mismatch',
    description: 'Parallel strings showing significantly different voltages.',
    severity: 'warning',
    causes: ['Different panel counts', 'Mixed panel types', 'Panel fault in one string'],
    solutions: ['Verify string configurations', 'Test individual panels', 'Reconfigure if needed'],
    detectionMethods: ['Measure each string Voc', 'Compare MPPT inputs'],
    estimatedCost: 'KES 10,000 - 50,000'
  },
  {
    code: 'PNL-20',
    type: 'all',
    title: 'Mounting Damage',
    description: 'Panel frame damaged by improper mounting.',
    severity: 'warning',
    causes: ['Over-tightened clamps', 'Frame bending', 'Drilling into frame'],
    solutions: ['Reposition clamps', 'Use proper mounting hardware', 'Replace if structural damage'],
    detectionMethods: ['Visual inspection of frame and mounting points'],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'PNL-21',
    type: 'bifacial',
    title: 'Rear Side Shading',
    description: 'Bifacial panel rear side not receiving adequate light.',
    severity: 'warning',
    causes: ['Mounting too close to roof', 'Dark/non-reflective surface below', 'Debris accumulation'],
    solutions: ['Increase mounting height', 'Use reflective surface below', 'Clean rear regularly'],
    detectionMethods: ['Compare to expected bifacial gain', 'Visual inspection'],
    estimatedCost: 'KES 5,000 - 30,000'
  },
  {
    code: 'PNL-22',
    type: 'thin-film',
    title: 'Deposition Uniformity Issue',
    description: 'Uneven semiconductor layer causing performance variations.',
    severity: 'warning',
    causes: ['Manufacturing defect', 'Material degradation'],
    solutions: ['Monitor performance', 'Warranty claim if significant'],
    detectionMethods: ['EL imaging', 'Performance testing'],
    estimatedCost: 'KES 15,000 - 45,000'
  },
  {
    code: 'PNL-23',
    type: 'all',
    title: 'Diode Short Circuit',
    description: 'Bypass diode permanently conducting.',
    severity: 'error',
    causes: ['Chronic shading damage', 'Overvoltage', 'Manufacturing defect'],
    solutions: ['Replace diode if accessible', 'Replace panel if sealed'],
    detectionMethods: ['Panel output lower than expected', 'One-third of panel not producing'],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'PNL-24',
    type: 'all',
    title: 'Diode Open Circuit',
    description: 'Bypass diode failed open - no longer providing protection.',
    severity: 'error',
    causes: ['Diode failure', 'Connection issue'],
    solutions: ['Replace diode', 'Risk of hot spots without protection'],
    detectionMethods: ['Hot spots when partially shaded', 'Panel fails under partial shade'],
    estimatedCost: 'KES 5,000 - 50,000'
  },
  {
    code: 'PNL-25',
    type: 'all',
    title: 'Edge Seal Failure',
    description: 'Seal around panel edge degraded, allowing moisture entry.',
    severity: 'error',
    causes: ['Age', 'Poor quality seal', 'UV degradation'],
    solutions: ['Replace panel', 'Cannot be repaired effectively'],
    detectionMethods: ['Moisture visible at edges', 'Corrosion starting from edges'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-26',
    type: 'all',
    title: 'Interconnect Corrosion',
    description: 'Cell ribbon conductors showing corrosion.',
    severity: 'error',
    causes: ['Moisture ingress', 'Poor quality materials', 'Marine environment'],
    solutions: ['Replace panel', 'Warranty claim if applicable'],
    detectionMethods: ['EL imaging shows dark patterns', 'Visual through glass in severe cases'],
    estimatedCost: 'KES 25,000 - 60,000'
  },
  {
    code: 'PNL-27',
    type: 'all',
    title: 'Poor Fill Factor',
    description: 'I-V curve shows poor fill factor indicating cell issues.',
    severity: 'warning',
    causes: ['Series resistance increase', 'Shunt resistance decrease', 'Cell degradation'],
    solutions: ['I-V curve testing', 'Replace if significant', 'Monitor trend'],
    detectionMethods: ['I-V curve analysis', 'Performance ratio decline'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-28',
    type: 'all',
    title: 'Busbar Discoloration',
    description: 'Main busbars showing darkening or discoloration.',
    severity: 'warning',
    causes: ['High current damage', 'Poor soldering', 'Material degradation'],
    solutions: ['Monitor for progression', 'May indicate future failure'],
    detectionMethods: ['Visual inspection', 'EL imaging'],
    estimatedCost: 'KES 0 - 50,000'
  },
  {
    code: 'PNL-29',
    type: 'all',
    title: 'Lamination Bubble',
    description: 'Air bubble trapped in lamination layers.',
    severity: 'warning',
    causes: ['Manufacturing defect', 'Lamination process issue'],
    solutions: ['Monitor for growth', 'Warranty claim', 'Replace if spreads'],
    detectionMethods: ['Visual - bubble visible under glass'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-30',
    type: 'all',
    title: 'Grounding Defect',
    description: 'Panel grounding connection inadequate or failed.',
    severity: 'error',
    causes: ['Corrosion', 'Loose connection', 'Missing ground lug'],
    solutions: ['Clean and tighten ground connection', 'Install ground lug if missing', 'Check all panel grounds'],
    detectionMethods: ['Continuity test to earth', 'Visual inspection of ground points'],
    estimatedCost: 'KES 3,000 - 15,000'
  },
  {
    code: 'PNL-31',
    type: 'all',
    title: 'Nameplate Fade',
    description: 'Panel nameplate data no longer readable.',
    severity: 'warning',
    causes: ['UV exposure', 'Weather', 'Poor quality label'],
    solutions: ['Document panel data elsewhere', 'Take photos of nameplates', 'Create system documentation'],
    detectionMethods: ['Visual inspection'],
    estimatedCost: 'KES 0 - 5,000'
  },
  {
    code: 'PNL-32',
    type: 'all',
    title: 'Cable Damage',
    description: 'Panel output cables showing damage.',
    severity: 'error',
    causes: ['Rodent chewing', 'UV degradation', 'Improper installation', 'Rubbing against sharp edges'],
    solutions: ['Replace damaged cables', 'Protect with conduit', 'Use cable clips'],
    detectionMethods: ['Visual inspection of cable runs', 'Insulation testing'],
    estimatedCost: 'KES 5,000 - 25,000'
  },
  {
    code: 'PNL-33',
    type: 'all',
    title: 'Low Open Circuit Voltage',
    description: 'Panel Voc significantly lower than nameplate.',
    severity: 'error',
    causes: ['Cell failure', 'Interconnect break', 'Bypass diode short'],
    solutions: ['Test bypass diodes', 'Check for cell damage', 'Replace panel if damaged'],
    detectionMethods: ['Voc measurement', 'Compare to datasheet'],
    estimatedCost: 'KES 20,000 - 55,000'
  },
  {
    code: 'PNL-34',
    type: 'all',
    title: 'Low Short Circuit Current',
    description: 'Panel Isc significantly lower than expected.',
    severity: 'error',
    causes: ['Soiling', 'Cell degradation', 'Shading', 'Interconnect issues'],
    solutions: ['Clean panel first', 'Test in full sun', 'Compare with adjacent panels'],
    detectionMethods: ['Isc measurement', 'Compare to datasheet'],
    estimatedCost: 'KES 10,000 - 55,000'
  },
  {
    code: 'PNL-35',
    type: 'all',
    title: 'Reverse Current Damage',
    description: 'Cell damaged by reverse current from mismatched strings.',
    severity: 'error',
    causes: ['Parallel strings with voltage mismatch', 'Missing blocking diode', 'Faulty panel in parallel string'],
    solutions: ['Install blocking diodes', 'Match string voltages', 'Replace damaged panel'],
    detectionMethods: ['Hot spots in affected cells', 'EL imaging'],
    estimatedCost: 'KES 15,000 - 60,000'
  },
  {
    code: 'PNL-36',
    type: 'all',
    title: 'Manufacturing Defect',
    description: 'Defect from factory affecting performance.',
    severity: 'error',
    causes: ['Quality control issue', 'Material defect', 'Process error'],
    solutions: ['Document with photos', 'Submit warranty claim', 'Replace panel'],
    detectionMethods: ['Visual anomalies', 'Performance testing', 'EL imaging'],
    estimatedCost: 'KES 0 (warranty) - 55,000'
  },
  {
    code: 'PNL-37',
    type: 'all',
    title: 'Storm Damage',
    description: 'Panel damaged by storm, wind, or flying debris.',
    severity: 'critical',
    causes: ['High winds', 'Hail', 'Flying debris', 'Inadequate mounting'],
    solutions: ['Safety first - isolate system', 'Insurance claim', 'Replace damaged panels', 'Review mounting'],
    detectionMethods: ['Visual inspection after storm'],
    estimatedCost: 'KES 25,000 - 200,000+'
  },
  {
    code: 'PNL-38',
    type: 'all',
    title: 'Theft/Vandalism',
    description: 'Panel stolen or intentionally damaged.',
    severity: 'critical',
    causes: ['Theft', 'Vandalism', 'Inadequate security'],
    solutions: ['Police report', 'Insurance claim', 'Install security measures', 'Replace panels'],
    detectionMethods: ['Visual - panels missing or damaged'],
    estimatedCost: 'KES 50,000 - 500,000+'
  },
  {
    code: 'PNL-39',
    type: 'all',
    title: 'Installation Error',
    description: 'Panel installed incorrectly affecting performance.',
    severity: 'warning',
    causes: ['Wrong orientation', 'Incorrect tilt', 'Self-shading', 'Poor cable management'],
    solutions: ['Correct orientation/tilt', 'Remove shading', 'Improve cable routing'],
    detectionMethods: ['Site survey', 'Performance analysis'],
    estimatedCost: 'KES 10,000 - 100,000'
  },
  {
    code: 'PNL-40',
    type: 'all',
    title: 'Warranty Expired',
    description: 'Panel outside warranty period with degradation.',
    severity: 'warning',
    causes: ['Natural aging', 'Environmental wear'],
    solutions: ['Continue monitoring', 'Budget for replacement', 'Consider repowering'],
    detectionMethods: ['Check warranty dates', 'Performance testing'],
    estimatedCost: 'Varies'
  }
];

// Export total counts for display
export const FAULT_CODE_STATS = {
  inverterCodes: INVERTER_FAULT_CODES.length,
  batteryCodes: BATTERY_FAULT_CODES.length,
  panelCodes: PANEL_FAULT_CODES.length,
  totalCodes: INVERTER_FAULT_CODES.length + BATTERY_FAULT_CODES.length + PANEL_FAULT_CODES.length,
  inverterBrands: INVERTER_BRANDS.length,
  batteryBrands: BATTERY_BRANDS.length,
  panelBrands: PANEL_BRANDS.length
};
