/**
 * Injection Pump Educational Content
 * Diesel injection pumps, timing, and fuel delivery
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const INJECTOR_PUMP_CONTENT: EducationalContent[] = [
  {
    id: 'INJ_P_001',
    category: 'injector_pump',
    subcategory: 'fundamentals',
    title: 'Diesel Injection Pump Fundamentals',
    slug: 'diesel-injection-pump-fundamentals-kenya',
    keywords: ['injection pump Kenya', 'fuel pump', 'diesel pump', 'injection pump types'],
    summary: 'Understanding diesel injection pump types and operating principles.',
    content: [
      { heading: 'Injection Pump Purpose', paragraphs: ['Injection pumps deliver precisely metered fuel at high pressure.', 'Controls fuel quantity (power output) and timing (efficiency).', 'Must deliver fuel at correct instant of each engine cycle.'] },
      { heading: 'Inline Pumps', paragraphs: ['One pumping element per cylinder.', 'Elements arranged in line along camshaft.', 'Individual elements timed to each cylinder.', 'Robust design suited for large generators.'] },
      { heading: 'Rotary Pumps', paragraphs: ['Single pumping element serves all cylinders.', 'Rotor distributes fuel to each cylinder.', 'Compact design common in smaller engines.', 'Internal transfer pump provides fuel supply.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Injection Pump Fault', 'Low Fuel Pressure'],
    relatedContent: ['INJ_P_002', 'FUEL_001'],
    tools: ['Service manual'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_P_002',
    category: 'injector_pump',
    subcategory: 'timing',
    title: 'Injection Timing Verification and Adjustment',
    slug: 'injection-timing-adjustment-kenya',
    keywords: ['injection timing Kenya', 'pump timing', 'timing adjustment', 'diesel timing'],
    summary: 'Checking and adjusting injection pump timing for optimal engine performance.',
    content: [
      { heading: 'Timing Importance', paragraphs: ['Correct timing ensures efficient combustion.', 'Advanced timing causes high pressure rise and knock.', 'Retarded timing causes incomplete combustion and smoke.', 'Timing affects emissions, fuel consumption, and power.'] },
      { heading: 'Static Timing Check', paragraphs: ['Rotate engine to timing marks.', 'Check pump position relative to engine.', 'Use dial indicator for precise measurement.', 'Compare to specification.'] },
      { heading: 'Adjustment Procedure', paragraphs: ['Loosen pump mounting bolts.', 'Rotate pump to achieve correct timing.', 'Retighten bolts to specification.', 'Verify timing after tightening.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'maintenance',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Engine Knock', 'Black Smoke', 'Low Power'],
    relatedContent: ['INJ_P_001', 'INJ_P_003'],
    tools: ['Dial indicator', 'Timing pin', 'Wrenches'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_P_003',
    category: 'injector_pump',
    subcategory: 'troubleshooting',
    title: 'Injection Pump Troubleshooting Guide',
    slug: 'injection-pump-troubleshooting-kenya',
    keywords: ['pump troubleshooting Kenya', 'injection pump diagnosis', 'fuel delivery problems'],
    summary: 'Diagnosing common injection pump problems and failures.',
    content: [
      { heading: 'No Fuel Delivery', paragraphs: ['Check fuel supply to pump.', 'Verify shutoff solenoid operation.', 'Check for air in supply line.', 'Test transfer pump pressure.'] },
      { heading: 'Uneven Fuel Delivery', paragraphs: ['Causes rough running and power imbalance.', 'May indicate worn pumping elements.', 'Check individual cylinder contribution.', 'Pump calibration required for correction.'] },
      { heading: 'Internal Leakage', paragraphs: ['Reduces delivery pressure and quantity.', 'Often due to worn plungers and barrels.', 'Detected by reduced power and fuel in crankcase.', 'Pump overhaul or replacement required.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Injection Pump Fault', 'Low Power', 'Engine Rough'],
    relatedContent: ['INJ_P_001', 'INJ_P_002'],
    tools: ['Pressure gauge', 'Diagnostic tools'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_P_004',
    category: 'injector_pump',
    subcategory: 'common_rail',
    title: 'Common Rail Injection Systems',
    slug: 'common-rail-injection-kenya',
    keywords: ['common rail Kenya', 'CRDI', 'common rail system', 'electronic injection'],
    summary: 'Understanding modern common rail diesel injection systems.',
    content: [
      { heading: 'Common Rail Concept', paragraphs: ['High pressure pump supplies common rail (accumulator).', 'Rail maintains constant high pressure (up to 2000+ bar).', 'Electronic injectors control injection events.', 'ECM determines timing and quantity electronically.'] },
      { heading: 'Advantages', paragraphs: ['Flexible injection timing independent of engine position.', 'Multiple injection events per cycle possible.', 'Lower noise and emissions.', 'Better fuel economy.'] },
      { heading: 'Service Considerations', paragraphs: ['Requires specialized diagnostic tools.', 'Extreme cleanliness essential during service.', 'Higher system pressures demand careful handling.', 'Component replacement more expensive.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Rail Pressure Fault', 'Injector Fault', 'ECM Fault'],
    relatedContent: ['INJ_P_001', 'ECM_001'],
    tools: ['Diagnostic scanner', 'Pressure gauge'],
    lastUpdated: '2024-03-15'
  }
];

export const INJECTOR_PUMP_CONTENT_COUNT = INJECTOR_PUMP_CONTENT.length;
