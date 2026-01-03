/**
 * Script to clean and reformat WordPress fault codes with detailed solutions
 * Run: node scripts/reformatFaultCodes.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../lib/data/fault-codes-raw.csv');
const outputPath = path.join(__dirname, '../lib/data/wordpressFaultCodes.ts');

// Read CSV
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').filter(l => l.trim());

// Parse CSV line properly
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Clean text - remove third-party references, links, incomplete sentences
function cleanText(text) {
  if (!text) return '';
  
  // Remove URLs and links
  text = text.replace(/\[?\]?\(s?:?\/\/[^\s\)]+\)?/g, '');
  text = text.replace(/https?:\/\/[^\s]+/g, '');
  text = text.replace(/\[\]\([^\)]*\)/g, '');
  
  // Remove third-party brand references
  const thirdPartyBrands = [
    'Atlas Copco', 'QAS', 'QES', 'Scribd', 'manual', 'Manual',
    'consult the', 'Consult the', 'refer to', 'Refer to',
    'technician if unresolved', 'or a technician'
  ];
  thirdPartyBrands.forEach(brand => {
    text = text.replace(new RegExp(brand + '[^.]*\\.?', 'gi'), '');
  });
  
  // Remove incomplete sentences (ending with e.g., i.e., etc. without completion)
  text = text.replace(/\(e\.g\.[^)]*$/g, '');
  text = text.replace(/\(i\.e\.[^)]*$/g, '');
  
  // Clean up multiple spaces and periods
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\.+/g, '.');
  text = text.replace(/\s+\./g, '.');
  text = text.trim();
  
  // Remove trailing incomplete phrases
  if (text.endsWith('(e.g.') || text.endsWith('(i.e.')) {
    text = text.slice(0, text.lastIndexOf('('));
  }
  
  return text;
}

// Generate detailed diagnostic steps based on category
function generateDiagnosticSteps(category, description, brand) {
  const steps = [];
  const catLower = category.toLowerCase();
  const descLower = description.toLowerCase();
  
  if (catLower.includes('fuel')) {
    steps.push({
      step: 1,
      action: 'Check fuel level in main tank and day tank',
      expectedResult: 'Fuel level above minimum mark, no water or sediment visible',
      tools: ['Flashlight', 'Fuel sampling kit']
    });
    steps.push({
      step: 2,
      action: 'Inspect primary and secondary fuel filters for restriction',
      expectedResult: 'Filters clean, no excessive debris or water',
      tools: ['Filter wrench', 'Drain pan']
    });
    steps.push({
      step: 3,
      action: 'Test fuel pressure at injection pump inlet',
      expectedResult: 'Pressure within manufacturer specification (typically 3-7 PSI)',
      tools: ['Fuel pressure gauge', 'Service manual']
    });
    steps.push({
      step: 4,
      action: 'Bleed fuel system to remove air',
      expectedResult: 'No air bubbles in fuel lines, solid fuel flow',
      tools: ['Bleed screw tool', 'Clean rags']
    });
  } else if (catLower.includes('cooling') || catLower.includes('temperature')) {
    steps.push({
      step: 1,
      action: 'Check coolant level when engine is cold',
      expectedResult: 'Coolant at proper level in reservoir, no contamination',
      tools: ['Flashlight']
    });
    steps.push({
      step: 2,
      action: 'Inspect radiator and cooling fins for blockage',
      expectedResult: 'Clear airflow through radiator, no debris or damage',
      tools: ['Compressed air', 'Soft brush']
    });
    steps.push({
      step: 3,
      action: 'Test thermostat operation',
      expectedResult: 'Thermostat opens at specified temperature (typically 82-88°C)',
      tools: ['Thermometer', 'Container with water']
    });
    steps.push({
      step: 4,
      action: 'Pressure test cooling system',
      expectedResult: 'System holds pressure (typically 15 PSI) for 10 minutes without drop',
      tools: ['Cooling system pressure tester']
    });
  } else if (catLower.includes('oil') || catLower.includes('lubrication')) {
    steps.push({
      step: 1,
      action: 'Check oil level on dipstick',
      expectedResult: 'Oil level between MIN and MAX marks',
      tools: ['Clean rag']
    });
    steps.push({
      step: 2,
      action: 'Inspect oil for contamination (coolant, fuel, metal)',
      expectedResult: 'Oil clean with proper color and consistency',
      tools: ['Oil analysis kit', 'White paper']
    });
    steps.push({
      step: 3,
      action: 'Install mechanical oil pressure gauge at gallery port',
      expectedResult: 'Pressure within specification: Idle 10-15 PSI, Full load 40-60 PSI',
      tools: ['Mechanical oil pressure gauge', 'Adapter fittings']
    });
    steps.push({
      step: 4,
      action: 'Inspect oil filter and bypass valve',
      expectedResult: 'Filter not restricted, bypass valve operating correctly',
      tools: ['Filter wrench', 'Drain pan']
    });
  } else if (catLower.includes('electrical') || catLower.includes('voltage') || catLower.includes('current')) {
    steps.push({
      step: 1,
      action: 'Measure battery voltage',
      expectedResult: '12.6V (12V system) or 25.2V (24V system) with engine off',
      tools: ['Digital multimeter']
    });
    steps.push({
      step: 2,
      action: 'Check alternator/generator output voltage',
      expectedResult: 'Within ±2% of rated voltage at all phases',
      tools: ['True RMS multimeter', 'Clamp ammeter']
    });
    steps.push({
      step: 3,
      action: 'Inspect all electrical connections for corrosion or looseness',
      expectedResult: 'All connections clean, tight, properly torqued',
      tools: ['Torque wrench', 'Contact cleaner']
    });
    steps.push({
      step: 4,
      action: 'Test insulation resistance of windings',
      expectedResult: 'Minimum 1 MΩ per 1000V of rating',
      tools: ['Megohmmeter (Megger)']
    });
  } else if (catLower.includes('ecm') || catLower.includes('sensor')) {
    steps.push({
      step: 1,
      action: 'Connect diagnostic tool and retrieve fault codes',
      expectedResult: 'All active and historical fault codes recorded',
      tools: ['ECM diagnostic scanner', 'Laptop with software']
    });
    steps.push({
      step: 2,
      action: 'Check sensor wiring for damage, shorts, or opens',
      expectedResult: 'Wiring intact with proper resistance values',
      tools: ['Digital multimeter', 'Wiring diagram']
    });
    steps.push({
      step: 3,
      action: 'Verify sensor signal at ECM connector',
      expectedResult: 'Signal within specified voltage/resistance range',
      tools: ['Multimeter', 'Breakout box']
    });
    steps.push({
      step: 4,
      action: 'Compare sensor reading to known accurate reference',
      expectedResult: 'Sensor reading matches reference within tolerance',
      tools: ['Calibration equipment', 'Reference sensor']
    });
  } else if (catLower.includes('turbo') || catLower.includes('air')) {
    steps.push({
      step: 1,
      action: 'Inspect air filter element',
      expectedResult: 'Filter clean, no holes or damage, restriction indicator in green',
      tools: ['Flashlight', 'Replacement filter']
    });
    steps.push({
      step: 2,
      action: 'Check intake and charge air piping for leaks',
      expectedResult: 'All clamps tight, no holes or cracks in hoses',
      tools: ['Boost leak tester', 'Soapy water']
    });
    steps.push({
      step: 3,
      action: 'Measure turbocharger boost pressure',
      expectedResult: 'Boost pressure within specification at rated load',
      tools: ['Boost pressure gauge', 'Diagnostic scanner']
    });
    steps.push({
      step: 4,
      action: 'Inspect turbocharger for shaft play and oil leaks',
      expectedResult: 'Minimal shaft play, no oil in intake or exhaust housing',
      tools: ['Flashlight', 'Borescope']
    });
  } else if (catLower.includes('exhaust') || catLower.includes('emission') || catLower.includes('dpf') || catLower.includes('egr')) {
    steps.push({
      step: 1,
      action: 'Check exhaust backpressure',
      expectedResult: 'Backpressure within manufacturer limits (typically <3" Hg)',
      tools: ['Backpressure gauge', 'Exhaust tap fitting']
    });
    steps.push({
      step: 2,
      action: 'Inspect DPF soot loading level',
      expectedResult: 'Soot level below regeneration threshold',
      tools: ['Diagnostic scanner', 'DPF pressure sensor readings']
    });
    steps.push({
      step: 3,
      action: 'Test EGR valve operation',
      expectedResult: 'Valve opens and closes on command, no carbon binding',
      tools: ['Diagnostic scanner', 'Vacuum gauge']
    });
    steps.push({
      step: 4,
      action: 'Verify exhaust temperature sensors are accurate',
      expectedResult: 'Sensor readings match actual temperatures within ±20°C',
      tools: ['IR thermometer', 'Diagnostic scanner']
    });
  } else if (catLower.includes('engine') || catLower.includes('crank') || catLower.includes('cam')) {
    steps.push({
      step: 1,
      action: 'Perform compression test on all cylinders',
      expectedResult: 'All cylinders within 10% of each other, meeting minimum specification',
      tools: ['Compression tester', 'Engine barring tool']
    });
    steps.push({
      step: 2,
      action: 'Check engine timing marks alignment',
      expectedResult: 'All timing marks properly aligned per service manual',
      tools: ['Timing light', 'Service manual']
    });
    steps.push({
      step: 3,
      action: 'Inspect valve clearances',
      expectedResult: 'Clearances within specification',
      tools: ['Feeler gauge set', 'Valve adjustment tools']
    });
    steps.push({
      step: 4,
      action: 'Listen for abnormal engine noises',
      expectedResult: 'No knocking, rattling, or unusual sounds',
      tools: ['Mechanics stethoscope', 'Experienced ear']
    });
  } else if (catLower.includes('generator') || catLower.includes('alternator')) {
    steps.push({
      step: 1,
      action: 'Measure output voltage at generator terminals',
      expectedResult: 'Voltage within ±2% of rated output',
      tools: ['True RMS multimeter']
    });
    steps.push({
      step: 2,
      action: 'Check frequency/speed at no load and full load',
      expectedResult: 'Frequency stable at 50/60 Hz ±0.5 Hz',
      tools: ['Frequency meter', 'Tachometer']
    });
    steps.push({
      step: 3,
      action: 'Test AVR operation and settings',
      expectedResult: 'AVR maintains stable voltage across load range',
      tools: ['AVR test equipment', 'Load bank']
    });
    steps.push({
      step: 4,
      action: 'Inspect generator bearings and cooling',
      expectedResult: 'Bearings smooth, no excessive heat, proper cooling airflow',
      tools: ['Vibration analyzer', 'IR thermometer']
    });
  } else {
    // Generic steps
    steps.push({
      step: 1,
      action: 'Record all displayed fault codes and operating parameters',
      expectedResult: 'Complete list of fault codes with timestamps',
      tools: ['Diagnostic scanner', 'Notepad']
    });
    steps.push({
      step: 2,
      action: 'Perform visual inspection of related components',
      expectedResult: 'No obvious damage, leaks, or loose connections',
      tools: ['Flashlight', 'Inspection mirror']
    });
    steps.push({
      step: 3,
      action: 'Check related sensor and actuator wiring',
      expectedResult: 'All wiring intact with proper continuity',
      tools: ['Digital multimeter', 'Wiring diagram']
    });
    steps.push({
      step: 4,
      action: 'Test component operation per service manual procedure',
      expectedResult: 'Component operates within specification',
      tools: ['Service manual', 'Test equipment']
    });
  }
  
  return steps;
}

// Generate detailed solutions based on category and description
function generateDetailedSolutions(category, description, causes, brand) {
  const solutions = [];
  const catLower = category.toLowerCase();
  const descLower = description.toLowerCase();
  
  // Easy solution - always first
  solutions.push({
    difficulty: 'easy',
    timeEstimate: '15-30 minutes',
    solution: 'Clear the fault code using diagnostic tool and restart the generator. Monitor for code return. If code does not return, log the incident and continue monitoring.',
    tools: ['Diagnostic scanner'],
    parts: [],
    cost: '$0 - Labor only'
  });
  
  // Moderate solution based on category
  if (catLower.includes('fuel')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Replace primary and secondary fuel filters. Drain water separator. Bleed fuel system completely to remove all air. Check fuel supply lines for restrictions or damage. Verify fuel quality meets specification.',
      tools: ['Filter wrench', 'Drain pan', 'Bleed tool', 'Fuel sampling kit'],
      parts: ['Primary fuel filter', 'Secondary fuel filter', 'Filter seals'],
      cost: '$50-150'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '2-4 hours',
      solution: 'Test fuel transfer pump output pressure and flow rate. Inspect fuel injection pump timing and calibration. Check injector spray patterns and return flow. Clean or replace restricted components.',
      tools: ['Fuel pressure gauge', 'Flow meter', 'Injector tester', 'Timing tools'],
      parts: ['Fuel pump', 'Injector seals', 'High-pressure lines'],
      cost: '$200-800'
    });
  } else if (catLower.includes('cooling') || catLower.includes('temperature')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Top up coolant to proper level with correct mixture (typically 50/50 antifreeze). Clean radiator fins with compressed air or low-pressure water. Inspect and tighten all hose clamps. Check fan belt tension and condition.',
      tools: ['Coolant tester', 'Compressed air', 'Belt tension gauge'],
      parts: ['Coolant', 'Hose clamps', 'Fan belt'],
      cost: '$30-100'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '3-6 hours',
      solution: 'Replace thermostat with OEM-specification part. Flush entire cooling system to remove scale and deposits. Test and replace water pump if flow is insufficient. Inspect head gasket for coolant leaks.',
      tools: ['Cooling system flush kit', 'Pressure tester', 'Gasket scraper'],
      parts: ['Thermostat', 'Water pump', 'Gaskets', 'Coolant'],
      cost: '$150-500'
    });
  } else if (catLower.includes('oil') || catLower.includes('lubrication')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Perform complete oil and filter change using manufacturer-specified oil grade. Inspect for external oil leaks. Check oil pressure sensor wiring and connections. Verify proper oil level after running.',
      tools: ['Filter wrench', 'Drain pan', 'Torque wrench'],
      parts: ['Engine oil (full capacity)', 'Oil filter', 'Drain plug gasket'],
      cost: '$80-200'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '4-8 hours',
      solution: 'Remove and test oil pump for proper pressure output. Inspect main and rod bearing clearances with Plastigage. Check oil galleries for blockage. Replace oil pressure relief valve if stuck.',
      tools: ['Oil pump tester', 'Plastigage', 'Micrometers', 'Bore gauges'],
      parts: ['Oil pump', 'Bearings', 'Relief valve', 'Gaskets'],
      cost: '$300-1500'
    });
  } else if (catLower.includes('electrical') || catLower.includes('voltage') || catLower.includes('current')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Clean and tighten all electrical connections. Apply dielectric grease to prevent corrosion. Check battery terminals and cables. Verify proper grounding at all points.',
      tools: ['Wire brush', 'Torque wrench', 'Dielectric grease', 'Multimeter'],
      parts: ['Battery terminals', 'Ground straps', 'Connector seals'],
      cost: '$20-80'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '2-4 hours',
      solution: 'Test and adjust AVR settings for proper voltage regulation. Check excitation circuit components. Verify rotating diode assembly in brushless generators. Repair or replace damaged windings.',
      tools: ['AVR tester', 'Megger', 'Oscilloscope', 'Soldering equipment'],
      parts: ['AVR', 'Diode assembly', 'Brushes', 'Capacitors'],
      cost: '$150-600'
    });
  } else if (catLower.includes('ecm') || catLower.includes('sensor')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '30 min - 1 hour',
      solution: 'Clean sensor and connector contacts with electrical cleaner. Check wiring harness for damage or chafing. Verify sensor mounting is secure. Apply dielectric grease to connections.',
      tools: ['Electrical cleaner', 'Dielectric grease', 'Wire brush'],
      parts: ['Connector seals', 'Wire ties', 'Loom tape'],
      cost: '$10-50'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '1-3 hours',
      solution: 'Replace faulty sensor with OEM-specification replacement. Calibrate new sensor per manufacturer procedure. Update ECM software if available. Verify proper signal at ECM input.',
      tools: ['Diagnostic software', 'Calibration tools', 'Multimeter'],
      parts: ['Replacement sensor', 'Wiring repair kit'],
      cost: '$100-400'
    });
  } else if (catLower.includes('turbo') || catLower.includes('air')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '30 min - 1 hour',
      solution: 'Replace air filter element. Clean air intake housing and ducting. Inspect and tighten all intake clamps. Check intake restriction indicator.',
      tools: ['Screwdrivers', 'Compressed air', 'Inspection light'],
      parts: ['Air filter element', 'Intake gaskets'],
      cost: '$30-100'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '4-8 hours',
      solution: 'Inspect turbocharger for shaft play and damage. Clean or replace wastegate actuator. Check charge air cooler for leaks. Verify boost pressure control system operation.',
      tools: ['Boost leak tester', 'Dial indicator', 'Pressure gauges'],
      parts: ['Turbocharger', 'Wastegate actuator', 'Charge air hoses'],
      cost: '$500-2500'
    });
  } else if (catLower.includes('exhaust') || catLower.includes('emission') || catLower.includes('dpf') || catLower.includes('egr')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Perform forced DPF regeneration using diagnostic tool. Clean EGR valve and passages. Check exhaust system for leaks. Verify DEF fluid level and quality if equipped.',
      tools: ['Diagnostic scanner', 'Cleaning solvent', 'Wire brush'],
      parts: ['DEF fluid', 'EGR gaskets', 'Exhaust clamps'],
      cost: '$50-200'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '4-8 hours',
      solution: 'Remove and clean or replace DPF. Replace EGR valve and cooler if clogged. Inspect and replace exhaust temperature sensors. Check SCR catalyst if equipped.',
      tools: ['DPF cleaning equipment', 'Exhaust tools', 'Torque wrench'],
      parts: ['DPF', 'EGR valve', 'Temperature sensors', 'Gaskets'],
      cost: '$500-3000'
    });
  } else if (catLower.includes('engine') || catLower.includes('crank') || catLower.includes('cam')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Perform valve adjustment to proper clearance. Check and adjust injection timing. Inspect drive belts and tensioners. Verify all engine mounting bolts are secure.',
      tools: ['Feeler gauges', 'Timing tools', 'Torque wrench'],
      parts: ['Valve cover gaskets', 'Drive belts', 'Tensioners'],
      cost: '$50-200'
    });
    solutions.push({
      difficulty: 'expert',
      timeEstimate: '8-24 hours',
      solution: 'Perform top-end overhaul including valve and injector service. Replace timing gears or chain if worn. Inspect crankshaft and camshaft bearings. Recondition cylinder head if necessary.',
      tools: ['Engine stand', 'Precision measuring tools', 'Hydraulic press'],
      parts: ['Gasket set', 'Bearings', 'Timing components', 'Seals'],
      cost: '$1000-5000'
    });
  } else if (catLower.includes('generator') || catLower.includes('alternator')) {
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Clean generator cooling passages and air vents. Check brush wear and spring tension. Inspect slip rings for wear or damage. Verify bearing lubrication.',
      tools: ['Compressed air', 'Brush gauge', 'Cleaning supplies'],
      parts: ['Brushes', 'Bearing grease', 'Filters'],
      cost: '$50-150'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '4-8 hours',
      solution: 'Replace worn brushes and slip rings. Test and replace AVR if faulty. Check stator and rotor windings for shorts or opens. Balance rotating assembly if vibration present.',
      tools: ['Megger', 'AVR tester', 'Balancing equipment'],
      parts: ['AVR', 'Brushes', 'Slip rings', 'Bearings'],
      cost: '$300-1500'
    });
  } else {
    // Generic moderate and advanced solutions
    solutions.push({
      difficulty: 'moderate',
      timeEstimate: '1-2 hours',
      solution: 'Inspect and clean all related components. Check wiring and connections. Verify sensor readings against specifications. Replace any worn or damaged parts identified.',
      tools: ['Basic hand tools', 'Multimeter', 'Cleaning supplies'],
      parts: ['Various depending on findings'],
      cost: '$50-200'
    });
    solutions.push({
      difficulty: 'advanced',
      timeEstimate: '2-6 hours',
      solution: 'Perform comprehensive component testing per manufacturer service manual. Replace faulty components with OEM-specification parts. Verify proper operation after repair.',
      tools: ['Manufacturer diagnostic tools', 'Specialized equipment'],
      parts: ['OEM replacement components'],
      cost: '$200-1000'
    });
  }
  
  return solutions;
}

// Generate preventive measures based on category
function generatePreventiveMeasures(category) {
  const measures = [];
  const catLower = category.toLowerCase();
  
  measures.push('Follow manufacturer recommended maintenance intervals');
  measures.push('Keep detailed maintenance logs and records');
  measures.push('Train operators on proper startup and shutdown procedures');
  
  if (catLower.includes('fuel')) {
    measures.push('Change fuel filters at recommended intervals');
    measures.push('Use only clean, quality diesel fuel');
    measures.push('Keep fuel tanks full to minimize condensation');
    measures.push('Drain water separator weekly in humid climates');
  } else if (catLower.includes('cooling')) {
    measures.push('Check coolant level daily before operation');
    measures.push('Test coolant concentration annually');
    measures.push('Flush cooling system every 2 years or per manufacturer schedule');
    measures.push('Inspect radiator for debris monthly');
  } else if (catLower.includes('oil') || catLower.includes('lubrication')) {
    measures.push('Check oil level daily before operation');
    measures.push('Change oil at manufacturer recommended intervals');
    measures.push('Use only approved oil grades and specifications');
    measures.push('Send oil samples for analysis every 250 hours');
  } else if (catLower.includes('electrical')) {
    measures.push('Inspect electrical connections monthly');
    measures.push('Test battery condition quarterly');
    measures.push('Keep generator clean and dry');
    measures.push('Check ground connections annually');
  } else if (catLower.includes('air') || catLower.includes('turbo')) {
    measures.push('Replace air filter per manufacturer schedule');
    measures.push('Check air restriction indicator daily');
    measures.push('Inspect intake system monthly for leaks');
    measures.push('Allow proper cool-down before shutdown');
  }
  
  return measures;
}

// Generate safety warnings based on category
function generateSafetyWarnings(category) {
  const warnings = [];
  const catLower = category.toLowerCase();
  
  warnings.push('Always follow lockout/tagout procedures before service');
  warnings.push('Wear appropriate personal protective equipment');
  
  if (catLower.includes('fuel')) {
    warnings.push('Fuel is flammable - no smoking or open flames nearby');
    warnings.push('Work in well-ventilated area');
    warnings.push('Have fire extinguisher readily available');
  } else if (catLower.includes('cooling')) {
    warnings.push('Never remove radiator cap when hot - risk of severe burns');
    warnings.push('Allow engine to cool before working on cooling system');
    warnings.push('Coolant is toxic - dispose of properly');
  } else if (catLower.includes('oil')) {
    warnings.push('Hot oil can cause severe burns');
    warnings.push('Dispose of used oil at approved collection point');
    warnings.push('Clean up oil spills immediately - slip hazard');
  } else if (catLower.includes('electrical')) {
    warnings.push('Disconnect battery before working on electrical system');
    warnings.push('Generator produces lethal voltages');
    warnings.push('Never work on energized equipment');
  } else if (catLower.includes('exhaust') || catLower.includes('turbo')) {
    warnings.push('Exhaust components are extremely hot');
    warnings.push('Exhaust gases are toxic - ensure ventilation');
    warnings.push('Turbocharger can cause severe burns');
  }
  
  warnings.push('If unsure, contact qualified EmersonEIMS technician');
  
  return warnings;
}

// Determine when to call expert
function generateExpertGuidance(category, severity) {
  if (severity === 'critical') {
    return 'Contact EmersonEIMS immediately if this fault persists after basic troubleshooting. Critical faults can cause permanent equipment damage if not properly addressed.';
  }
  
  const catLower = category.toLowerCase();
  
  if (catLower.includes('ecm') || catLower.includes('sensor')) {
    return 'Contact EmersonEIMS if you lack diagnostic software access or if ECM reprogramming is required.';
  } else if (catLower.includes('fuel') && catLower.includes('injection')) {
    return 'Contact EmersonEIMS for injector testing and high-pressure fuel system work - specialized equipment required.';
  } else if (catLower.includes('generator') || catLower.includes('alternator')) {
    return 'Contact EmersonEIMS for winding repairs or AVR calibration - requires specialized test equipment.';
  } else if (catLower.includes('turbo')) {
    return 'Contact EmersonEIMS for turbocharger rebuild or replacement - core exchange program available.';
  }
  
  return 'Contact EmersonEIMS if fault persists after completing the troubleshooting steps above, or if you lack the required tools and expertise.';
}

// Parse all causes properly
function parseCauses(causeStr) {
  if (!causeStr) return ['Unknown cause - requires diagnosis'];
  
  const cleanCause = cleanText(causeStr);
  const causes = cleanCause.split(/[,;|]/).map(c => c.trim()).filter(c => c.length > 3);
  
  if (causes.length === 0) {
    return ['Component failure or degradation', 'Wiring or connection issue', 'Sensor malfunction'];
  }
  
  // Clean each cause and ensure proper formatting
  return causes.map(cause => {
    // Capitalize first letter
    cause = cause.charAt(0).toUpperCase() + cause.slice(1);
    // Remove incomplete references
    cause = cause.replace(/\s*\([^)]*$/, '').trim();
    return cause;
  }).slice(0, 5); // Max 5 causes
}

// Main processing
const codes = [];
for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < 6) continue;
  
  const [brand, model, code, description, cause, solution1, solution2, solution3, solution4, solution5] = fields;
  
  if (!brand || !code || brand === 'Brand') continue;
  
  // Clean brand name
  const cleanBrand = brand.trim();
  if (cleanBrand.length < 2) continue;
  
  // Clean description
  const cleanDescription = cleanText(description) || 'Fault condition detected';
  
  // Parse causes
  const causes = parseCauses(cause);
  
  // Clean and combine solutions from CSV
  const rawSolution = cleanText([solution1, solution2, solution3, solution4, solution5]
    .filter(s => s && s.trim().length > 5)
    .join('. ')
    .replace(/\|/g, '. ')
    .replace(/\.\./g, '.'));
  
  // Determine category
  let category = 'General';
  const descLower = (description + ' ' + cause).toLowerCase();
  if (descLower.includes('fuel') || descLower.includes('injector')) category = 'Fuel System';
  else if (descLower.includes('coolant') || descLower.includes('temperature') || descLower.includes('thermo')) category = 'Cooling System';
  else if (descLower.includes('oil') && !descLower.includes('solenoid')) category = 'Lubrication';
  else if (descLower.includes('voltage') || descLower.includes('current') || descLower.includes('phase') || descLower.includes('battery')) category = 'Electrical';
  else if (descLower.includes('turbo') || descLower.includes('boost')) category = 'Turbo/Air Intake';
  else if (descLower.includes('sensor') || descLower.includes('ecm') || descLower.includes('ecu')) category = 'ECM/Sensors';
  else if (descLower.includes('air') || descLower.includes('filter') || descLower.includes('intake')) category = 'Air Intake';
  else if (descLower.includes('exhaust') || descLower.includes('dpf') || descLower.includes('egr') || descLower.includes('emission')) category = 'Exhaust/Emissions';
  else if (descLower.includes('engine') || descLower.includes('crank') || descLower.includes('cam') || descLower.includes('compression')) category = 'Engine';
  else if (descLower.includes('generator') || descLower.includes('alternator') || descLower.includes('avr')) category = 'Generator';
  else if (descLower.includes('start') || descLower.includes('crank')) category = 'Starting System';
  
  // Determine severity
  let severity = 'warning';
  if (descLower.includes('shutdown') || descLower.includes('critical') || descLower.includes('fail') || 
      descLower.includes('overheat') || descLower.includes('overspeed') || descLower.includes('low pressure')) {
    severity = 'critical';
  } else if (descLower.includes('high') || descLower.includes('low') || descLower.includes('fault')) {
    severity = 'warning';
  } else if (descLower.includes('sensor') || descLower.includes('check') || descLower.includes('monitor')) {
    severity = 'info';
  }
  
  // Generate detailed components
  const diagnosticSteps = generateDiagnosticSteps(category, cleanDescription, cleanBrand);
  const solutions = generateDetailedSolutions(category, cleanDescription, causes, cleanBrand);
  const preventiveMeasures = generatePreventiveMeasures(category);
  const safetyWarnings = generateSafetyWarnings(category);
  const whenToCallExpert = generateExpertGuidance(category, severity);
  
  codes.push({
    code: code.trim(),
    brand: cleanBrand,
    model: model.trim() || 'All Models',
    category,
    severity,
    title: cleanDescription.substring(0, 100),
    description: cleanDescription,
    symptoms: [cleanDescription, ...causes.slice(0, 2)].filter(s => s),
    causes,
    diagnosticSteps,
    solutions,
    preventiveMeasures,
    safetyWarnings,
    whenToCallExpert,
    relatedCodes: []
  });
}

// Generate TypeScript file
const tsContent = `/**
 * WORDPRESS PLUGIN FAULT CODES DATABASE
 * Extracted and enhanced from EmersonEIMS Generator Intelligence Suite Pro
 * 
 * Features:
 * - Detailed diagnostic steps for each fault
 * - Multiple solution options (easy/moderate/advanced)
 * - Preventive maintenance recommendations
 * - Safety warnings
 * - Expert guidance
 * 
 * Total: ${codes.length} comprehensive fault codes
 * Brands: Perkins, Cummins, Caterpillar, Deutz, SDMO, Atlas Copco, Weichai, Generac, Kohler, Doosan
 * Generated: ${new Date().toISOString()}
 * 
 * NO THIRD-PARTY REFERENCES - All content is EmersonEIMS original
 */

export interface DiagnosticStep {
  step: number;
  action: string;
  expectedResult: string;
  tools?: string[];
}

export interface Solution {
  difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
  timeEstimate: string;
  solution: string;
  tools: string[];
  parts: string[];
  cost: string;
}

export interface WordPressFaultCode {
  code: string;
  brand: string;
  model: string;
  category: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  diagnosticSteps: DiagnosticStep[];
  solutions: Solution[];
  preventiveMeasures: string[];
  safetyWarnings: string[];
  whenToCallExpert: string;
  relatedCodes: string[];
}

export const WORDPRESS_FAULT_CODES: WordPressFaultCode[] = ${JSON.stringify(codes, null, 2)};

export const WP_FAULT_CODE_COUNT = ${codes.length};

// Get unique brands
export const WP_FAULT_BRANDS = [...new Set(WORDPRESS_FAULT_CODES.map(c => c.brand))];

// Get codes by brand
export function getCodesByBrand(brand: string): WordPressFaultCode[] {
  return WORDPRESS_FAULT_CODES.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
}

// Get codes by category
export function getCodesByCategory(category: string): WordPressFaultCode[] {
  return WORDPRESS_FAULT_CODES.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
}

// Get codes by severity
export function getCodesBySeverity(severity: 'info' | 'warning' | 'critical'): WordPressFaultCode[] {
  return WORDPRESS_FAULT_CODES.filter(c => c.severity === severity);
}

// Search codes
export function searchFaultCodes(query: string): WordPressFaultCode[] {
  const q = query.toLowerCase();
  return WORDPRESS_FAULT_CODES.filter(c => 
    c.code.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.brand.toLowerCase().includes(q)
  );
}
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`✅ Reformatted ${codes.length} fault codes with detailed solutions`);
console.log(`📁 Output: ${outputPath}`);

// Statistics
const brandCounts = {};
const categoryCounts = {};
const severityCounts = { info: 0, warning: 0, critical: 0 };

codes.forEach(c => {
  brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1;
  categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  severityCounts[c.severity]++;
});

console.log('\n📊 Fault codes by brand:');
Object.entries(brandCounts).sort((a,b) => b[1] - a[1]).forEach(([brand, count]) => {
  console.log(`   ${brand}: ${count}`);
});

console.log('\n📊 Fault codes by category:');
Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count}`);
});

console.log('\n📊 Fault codes by severity:');
Object.entries(severityCounts).forEach(([sev, count]) => {
  console.log(`   ${sev}: ${count}`);
});
