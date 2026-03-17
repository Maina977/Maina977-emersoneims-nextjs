/**
 * Starter System Educational Content
 * Engine starting systems and components
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const STARTER_CONTENT: EducationalContent[] = [
  {
    id: 'START_001',
    category: 'starter_system',
    subcategory: 'fundamentals',
    title: 'Engine Starting System Fundamentals',
    slug: 'starting-system-fundamentals-kenya',
    keywords: ['starter system Kenya', 'engine starting', 'starter motor', 'cranking system'],
    summary: 'Understanding engine starting systems for generators.',
    content: [
      { heading: 'Starting System Purpose', paragraphs: ['The starting system cranks the engine to initiate combustion.', 'Must rotate engine fast enough for fuel ignition.', 'Different starting methods for different applications.', 'Reliability is critical for standby generators.'] },
      { heading: 'Electric Starting', paragraphs: ['Most common method using DC starter motor.', 'Battery provides power for cranking.', 'Solenoid engages pinion with flywheel ring gear.', 'Simple, reliable, and easily maintained.'] },
      { heading: 'Air Starting', paragraphs: ['Compressed air rotates engine through special motor.', 'Used on large engines where electric is impractical.', 'Requires air storage and compressor system.', 'Very reliable for remote or offshore applications.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fail to Start', 'Starter Fault', 'Cranking Fault'],
    relatedContent: ['START_002', 'BAT_001'],
    tools: ['Multimeter', 'Battery tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'START_002',
    category: 'starter_system',
    subcategory: 'starter_motor',
    title: 'Starter Motor Operation and Testing',
    slug: 'starter-motor-testing-kenya',
    keywords: ['starter motor Kenya', 'starter testing', 'starter diagnosis', 'starter motor test'],
    summary: 'Testing and diagnosing electric starter motors.',
    content: [
      { heading: 'Starter Motor Components', paragraphs: ['Motor: converts electrical to mechanical energy.', 'Solenoid: engages pinion and completes circuit.', 'Pinion: gear that engages flywheel.', 'Overrunning clutch: prevents engine driving starter.'] },
      { heading: 'Testing Procedure', paragraphs: ['Check battery voltage first - must be adequate.', 'Verify voltage at starter solenoid when cranking.', 'Measure current draw during cranking.', 'Excessive current indicates mechanical problem.'] },
      { heading: 'Common Problems', paragraphs: ['No crank: check battery, solenoid, wiring.', 'Slow crank: low battery, high resistance, worn starter.', 'Clicking only: solenoid engaging but no current to motor.', 'Grinding: pinion not engaging properly.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Fail to Start', 'Starter Fault', 'Low Battery'],
    relatedContent: ['START_001', 'START_003'],
    tools: ['Multimeter', 'Clamp ammeter', 'Battery tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'START_003',
    category: 'starter_system',
    subcategory: 'battery',
    title: 'Starting Battery Maintenance',
    slug: 'starting-battery-maintenance-kenya',
    keywords: ['battery maintenance Kenya', 'starter battery', 'battery testing', 'battery care'],
    summary: 'Maintaining starting batteries for reliable engine cranking.',
    content: [
      { heading: 'Battery Types', paragraphs: ['Lead-acid flooded batteries require water addition.', 'AGM batteries are sealed and maintenance-free.', 'Gel batteries handle deep discharge better.', 'Choose battery type for application requirements.'] },
      { heading: 'Maintenance', paragraphs: ['Keep terminals clean and tight.', 'Check electrolyte level in flooded batteries.', 'Verify battery charger is functioning.', 'Test battery condition regularly.'] },
      { heading: 'Testing', paragraphs: ['Check open circuit voltage.', 'Perform load test to verify capacity.', 'Check specific gravity on flooded batteries.', 'Replace batteries showing weakness.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Low Battery', 'Battery Fault', 'Fail to Start'],
    relatedContent: ['START_001', 'START_002'],
    tools: ['Battery tester', 'Hydrometer', 'Terminal cleaner'],
    partsPageLink: '/parts/batteries',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'START_004',
    category: 'starter_system',
    subcategory: 'troubleshooting',
    title: 'Starting System Troubleshooting',
    slug: 'starting-system-troubleshooting-kenya',
    keywords: ['starting troubleshooting Kenya', 'engine wont start', 'cranking problems', 'no start diagnosis'],
    summary: 'Systematic approach to diagnosing starting problems.',
    content: [
      { heading: 'No Crank Diagnosis', paragraphs: ['Check battery voltage under load.', 'Verify key switch and safety circuit.', 'Check starter solenoid activation.', 'Inspect wiring and connections.'] },
      { heading: 'Slow Crank Diagnosis', paragraphs: ['Test battery capacity.', 'Check for voltage drop in cables.', 'Verify ground connections.', 'Consider engine mechanical resistance.'] },
      { heading: 'Cranks But No Start', paragraphs: ['Verify fuel supply.', 'Check fuel shutoff solenoid.', 'Bleed air from fuel system.', 'Check for sufficient cranking speed.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Fail to Start', 'Cranking Fault', 'Low Battery'],
    relatedContent: ['START_002', 'FUEL_003'],
    tools: ['Multimeter', 'Battery tester', 'Wiring diagram'],
    lastUpdated: '2024-03-15'
  }
];

export const STARTER_CONTENT_COUNT = STARTER_CONTENT.length;
