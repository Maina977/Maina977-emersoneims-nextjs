/**
 * Engine Educational Content
 * Diesel engine operation, maintenance, and troubleshooting
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const ENGINE_CONTENT: EducationalContent[] = [
  {
    id: 'ENG_001',
    category: 'engine',
    subcategory: 'fundamentals',
    title: 'Diesel Engine Operating Principles',
    slug: 'diesel-engine-operating-principles-kenya',
    keywords: ['diesel engine Kenya', 'engine operation', 'compression ignition', 'diesel cycle'],
    summary: 'Understanding the fundamental operating principles of diesel engines in generator applications.',
    content: [
      { heading: 'The Diesel Cycle', paragraphs: ['Diesel engines operate on the compression ignition principle.', 'Air is compressed to high pressure and temperature.', 'Fuel injected into hot compressed air ignites spontaneously.', 'No spark plugs needed - compression provides ignition.'] },
      { heading: 'Four Stroke Operation', paragraphs: ['Intake stroke draws air into cylinder.', 'Compression stroke compresses air to ignition temperature.', 'Power stroke - fuel injection and combustion drive piston down.', 'Exhaust stroke expels combustion gases.'] },
      { heading: 'Diesel Advantages', paragraphs: ['Higher efficiency than gasoline engines.', 'Better suited for continuous operation.', 'Longer service life with proper maintenance.', 'Safer fuel storage - diesel less volatile than petrol.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Engine Fault'],
    relatedContent: ['ENG_002', 'FUEL_001'],
    tools: [],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ENG_002',
    category: 'engine',
    subcategory: 'components',
    title: 'Major Engine Components and Functions',
    slug: 'engine-components-functions-kenya',
    keywords: ['engine components Kenya', 'cylinder block', 'crankshaft', 'pistons'],
    summary: 'Overview of major diesel engine components and their functions.',
    content: [
      { heading: 'Cylinder Block and Head', paragraphs: ['Cylinder block houses pistons and crankshaft.', 'Cylinder head contains valves and often injectors.', 'Head gasket seals combustion chambers.', 'Cooling passages run through block and head.'] },
      { heading: 'Moving Parts', paragraphs: ['Pistons transmit combustion force to crankshaft.', 'Connecting rods link pistons to crankshaft.', 'Crankshaft converts reciprocating motion to rotation.', 'Flywheel provides rotating mass for smooth operation.'] },
      { heading: 'Valve Train', paragraphs: ['Intake valves control air entry.', 'Exhaust valves release combustion gases.', 'Camshaft times valve operation.', 'Push rods and rocker arms transfer camshaft motion.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Engine Fault', 'Low Compression'],
    relatedContent: ['ENG_001', 'ENG_003'],
    tools: [],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ENG_003',
    category: 'engine',
    subcategory: 'compression',
    title: 'Compression Testing and Analysis',
    slug: 'compression-testing-analysis-kenya',
    keywords: ['compression test Kenya', 'cylinder compression', 'engine compression', 'low compression'],
    summary: 'Performing and interpreting compression tests to assess engine condition.',
    content: [
      { heading: 'Why Test Compression', paragraphs: ['Compression testing reveals internal engine condition.', 'Low compression causes hard starting, low power, and high fuel consumption.', 'Helps identify whether engine needs overhaul.'] },
      { heading: 'Test Procedure', paragraphs: ['Warm engine to operating temperature.', 'Disable fuel and starting system.', 'Remove all injectors or glow plugs.', 'Install compression gauge in cylinder.', 'Crank engine and record reading.', 'Repeat for all cylinders.'] },
      { heading: 'Interpreting Results', paragraphs: ['Compare readings to manufacturer specifications.', 'All cylinders should be within 10% of each other.', 'Low cylinder may indicate ring or valve problem.', 'Wet test (add oil) helps distinguish rings from valves.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Compression', 'Hard Start', 'Low Power'],
    relatedContent: ['ENG_001', 'ENG_004'],
    tools: ['Compression gauge', 'Wrenches', 'Engine oil'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ENG_004',
    category: 'engine',
    subcategory: 'valve_adjustment',
    title: 'Valve Clearance Adjustment Procedures',
    slug: 'valve-clearance-adjustment-kenya',
    keywords: ['valve adjustment Kenya', 'valve clearance', 'tappet adjustment', 'valve lash'],
    summary: 'Maintaining proper valve clearances for reliable engine operation.',
    content: [
      { heading: 'Valve Clearance Purpose', paragraphs: ['Clearance allows for thermal expansion when hot.', 'Too tight - valves may not fully close, causing burning.', 'Too loose - noisy operation, reduced valve opening.', 'Check and adjust at recommended service intervals.'] },
      { heading: 'Adjustment Procedure', paragraphs: ['Rotate engine to TDC compression stroke for cylinder being adjusted.', 'Use feeler gauge to check clearance between rocker and valve stem.', 'Loosen locknut, turn adjuster to achieve specified clearance.', 'Tighten locknut while holding adjuster, recheck clearance.'] },
      { heading: 'Typical Specifications', paragraphs: ['Specifications vary by engine manufacturer.', 'Intake typically 0.15-0.25mm', 'Exhaust typically 0.30-0.40mm (larger due to higher temperature).', 'Always verify against engine service manual.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Engine Noise', 'Low Power', 'Low Compression'],
    relatedContent: ['ENG_002', 'ENG_003'],
    tools: ['Feeler gauges', 'Wrenches', 'Service manual'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ENG_005',
    category: 'engine',
    subcategory: 'break_in',
    title: 'New and Rebuilt Engine Break-In Procedures',
    slug: 'engine-break-in-procedures-kenya',
    keywords: ['engine break-in Kenya', 'new engine', 'rebuilt engine', 'run-in procedure'],
    summary: 'Proper break-in procedures for new and rebuilt engines to ensure long service life.',
    content: [
      { heading: 'Break-In Importance', paragraphs: ['New and rebuilt engines require careful break-in.', 'Allows rings to seat against cylinder walls.', 'Allows bearings to develop proper oil film.', 'Prevents premature wear and oil consumption.'] },
      { heading: 'Break-In Procedure', paragraphs: ['Initial run at no load for 15-30 minutes.', 'Gradually increase load over first 50-100 hours.', 'Avoid sustained high load during break-in period.', 'Allow engine to warm up before loading.'] },
      { heading: 'Monitoring During Break-In', paragraphs: ['Check oil level frequently.', 'Watch for coolant leaks.', 'Monitor oil pressure and temperature.', 'Change oil after initial break-in period.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Oil Consumption', 'Low Oil Pressure'],
    relatedContent: ['ENG_001', 'LUB_001'],
    tools: ['Load bank', 'Oil level dipstick', 'Temperature gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ENG_006',
    category: 'engine',
    subcategory: 'troubleshooting',
    title: 'Engine Performance Troubleshooting Guide',
    slug: 'engine-performance-troubleshooting-kenya',
    keywords: ['engine troubleshooting Kenya', 'low power', 'rough running', 'engine diagnosis'],
    summary: 'Systematic approach to diagnosing common engine performance problems.',
    content: [
      { heading: 'Low Power Diagnosis', paragraphs: ['Check air filter restriction.', 'Verify fuel supply and quality.', 'Check turbo boost pressure if equipped.', 'Test compression.', 'Check injection timing.'] },
      { heading: 'Rough Running', paragraphs: ['Check for faulty injector.', 'Verify fuel quality and filtration.', 'Check for air leaks in fuel system.', 'Test individual cylinder contribution.'] },
      { heading: 'Excessive Smoke', paragraphs: ['Black smoke: excess fuel or restricted air.', 'Blue smoke: oil burning - worn rings or guides.', 'White smoke: unburned fuel or coolant leak.', 'Diagnose based on smoke color and timing.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Low Power', 'Engine Rough', 'High Exhaust Temperature'],
    relatedContent: ['ENG_003', 'FUEL_010'],
    tools: ['Smoke meter', 'Compression gauge', 'Boost gauge'],
    lastUpdated: '2024-03-15'
  }
];

export const ENGINE_CONTENT_COUNT = ENGINE_CONTENT.length;
