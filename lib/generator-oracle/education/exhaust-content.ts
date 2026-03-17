/**
 * Exhaust System Educational Content
 * Exhaust systems, emissions, and related components
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const EXHAUST_CONTENT: EducationalContent[] = [
  {
    id: 'EXH_001',
    category: 'exhaust',
    subcategory: 'fundamentals',
    title: 'Generator Exhaust System Fundamentals',
    slug: 'exhaust-system-fundamentals-kenya',
    keywords: ['exhaust system Kenya', 'generator exhaust', 'exhaust components', 'exhaust design'],
    summary: 'Understanding generator exhaust system design and components.',
    content: [
      { heading: 'Exhaust System Purpose', paragraphs: ['Safely routes exhaust gases away from generator and personnel.', 'Reduces noise through silencer/muffler.', 'May include emission control components.', 'Must handle high temperatures and corrosive gases.'] },
      { heading: 'System Components', paragraphs: ['Exhaust manifold collects gases from cylinders.', 'Turbocharger (if equipped) extracts energy.', 'Silencer/muffler reduces noise.', 'Piping routes exhaust to safe discharge point.'] },
      { heading: 'Design Considerations', paragraphs: ['Backpressure must be within limits.', 'Support system to handle thermal expansion.', 'Insulation protects personnel and reduces heat.', 'Rain cap prevents water entry when not running.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Exhaust Temperature', 'Exhaust Restriction'],
    relatedContent: ['EXH_002', 'TURBO_001'],
    tools: ['Temperature measurement', 'Backpressure gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'EXH_002',
    category: 'exhaust',
    subcategory: 'backpressure',
    title: 'Exhaust Backpressure Measurement and Limits',
    slug: 'exhaust-backpressure-kenya',
    keywords: ['exhaust backpressure Kenya', 'exhaust restriction', 'backpressure measurement'],
    summary: 'Measuring and managing exhaust backpressure for optimal performance.',
    content: [
      { heading: 'Backpressure Effects', paragraphs: ['Excessive backpressure reduces engine power.', 'Increases exhaust temperature.', 'Increases fuel consumption.', 'Can damage valves and turbocharger.'] },
      { heading: 'Measurement', paragraphs: ['Measure at exhaust manifold or turbo outlet.', 'Use water manometer or pressure gauge.', 'Measure at rated load.', 'Compare to manufacturer limit.'] },
      { heading: 'Causes of High Backpressure', paragraphs: ['Undersized piping or silencer.', 'Excessive pipe length or bends.', 'Blocked silencer or catalyst.', 'Crushed or restricted piping.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Exhaust Temperature', 'Exhaust Restriction', 'Low Power'],
    relatedContent: ['EXH_001', 'EXH_003'],
    tools: ['Backpressure gauge', 'Manometer'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'EXH_003',
    category: 'exhaust',
    subcategory: 'temperature',
    title: 'Exhaust Temperature Monitoring',
    slug: 'exhaust-temperature-monitoring-kenya',
    keywords: ['exhaust temperature Kenya', 'EGT monitoring', 'pyrometer', 'high exhaust temp'],
    summary: 'Monitoring exhaust temperatures to detect engine problems.',
    content: [
      { heading: 'Temperature Importance', paragraphs: ['Exhaust temperature indicates combustion conditions.', 'High temperature may indicate overload or injection problems.', 'Temperature imbalance indicates cylinder problem.', 'Critical for turbocharged engine protection.'] },
      { heading: 'Measurement Methods', paragraphs: ['Thermocouple probes installed in exhaust.', 'Individual cylinder monitoring provides diagnostic value.', 'Combined exhaust temperature simpler but less informative.', 'Pyrometer displays and records temperatures.'] },
      { heading: 'Interpreting Readings', paragraphs: ['All cylinders should be similar (within 50°C).', 'High cylinder indicates over-fueling or late timing.', 'Low cylinder indicates under-fueling or misfiring.', 'Overall high indicates overload or restriction.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Exhaust Temperature', 'Exhaust Temp Imbalance'],
    relatedContent: ['EXH_001', 'SENS_001'],
    tools: ['Pyrometer', 'IR thermometer', 'Thermocouple'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'EXH_004',
    category: 'exhaust',
    subcategory: 'smoke',
    title: 'Exhaust Smoke Analysis and Diagnosis',
    slug: 'exhaust-smoke-analysis-kenya',
    keywords: ['exhaust smoke Kenya', 'black smoke', 'white smoke', 'blue smoke diagnosis'],
    summary: 'Diagnosing engine problems through exhaust smoke analysis.',
    content: [
      { heading: 'Black Smoke', paragraphs: ['Indicates incomplete combustion of fuel.', 'Causes: overload, restricted air, injector problems.', 'Check air filter, turbo, and injection system.', 'May indicate engine is beyond rated capacity.'] },
      { heading: 'White Smoke', paragraphs: ['Can indicate unburned fuel or coolant.', 'Cold startup white smoke is normal.', 'Persistent white smoke may indicate head gasket leak.', 'Sweet smell suggests coolant is burning.'] },
      { heading: 'Blue Smoke', paragraphs: ['Indicates oil burning in combustion.', 'On startup: valve guide wear.', 'Under load: piston ring wear.', 'Continuous: severe oil consumption.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Black Smoke', 'White Smoke', 'Oil Consumption'],
    relatedContent: ['EXH_001', 'ENG_006'],
    tools: ['Visual observation', 'Smoke meter'],
    lastUpdated: '2024-03-15'
  }
];

export const EXHAUST_CONTENT_COUNT = EXHAUST_CONTENT.length;
