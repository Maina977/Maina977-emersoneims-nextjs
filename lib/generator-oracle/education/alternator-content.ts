/**
 * Alternator Educational Content
 * Generator alternator/genend construction and operation
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const ALTERNATOR_CONTENT: EducationalContent[] = [
  {
    id: 'ALT_001',
    category: 'alternator',
    subcategory: 'fundamentals',
    title: 'AC Generator (Alternator) Fundamentals',
    slug: 'alternator-fundamentals-kenya',
    keywords: ['alternator Kenya', 'generator alternator', 'AC generator', 'genend'],
    summary: 'Understanding how alternators generate AC electricity.',
    content: [
      { heading: 'Generation Principle', paragraphs: ['Alternators convert mechanical energy to electrical energy.', 'Rotating magnetic field induces voltage in stationary windings.', 'Field winding on rotor creates magnetic poles.', 'Stator windings carry the output current.'] },
      { heading: 'Excitation System', paragraphs: ['Field winding requires DC current to create magnetic field.', 'Brushless alternators use rotating exciter and diodes.', 'Brushed alternators use slip rings and carbon brushes.', 'AVR controls field current to regulate output voltage.'] },
      { heading: 'Output Characteristics', paragraphs: ['Frequency determined by speed and pole count: f = (N × P) / 120', 'For 50Hz at 1500 RPM, 4 poles required.', 'Voltage determined by field strength and speed.', 'Power capacity determined by conductor size and cooling.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Under Voltage', 'Over Voltage', 'Alternator Fault'],
    relatedContent: ['ALT_002', 'AVR_001'],
    tools: ['Multimeter', 'Megger'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ALT_002',
    category: 'alternator',
    subcategory: 'testing',
    title: 'Alternator Winding Testing',
    slug: 'alternator-winding-testing-kenya',
    keywords: ['winding test Kenya', 'insulation test', 'megger test', 'alternator testing'],
    summary: 'Testing alternator windings to verify condition and detect faults.',
    content: [
      { heading: 'Resistance Testing', paragraphs: ['Measure winding resistance with digital multimeter.', 'Compare phases - should be equal within 5%.', 'Compare to manufacturer specifications.', 'High resistance indicates damaged conductors.'] },
      { heading: 'Insulation Testing', paragraphs: ['Use megger (insulation resistance tester) at rated voltage.', 'Test winding to ground insulation.', 'Minimum 1 megohm per 1000V rating plus 1 megohm.', 'Low insulation indicates moisture or degradation.'] },
      { heading: 'Surge Testing', paragraphs: ['Detects turn-to-turn shorts not found by other tests.', 'Requires specialized surge comparison tester.', 'Compares waveforms between phases.', 'Differences indicate shorted turns.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Winding Fault', 'Ground Fault', 'Alternator Fault'],
    relatedContent: ['ALT_001', 'ALT_003'],
    tools: ['Multimeter', 'Megger', 'Surge tester'],
    safetyWarnings: ['Disconnect all power before testing'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ALT_003',
    category: 'alternator',
    subcategory: 'bearings',
    title: 'Alternator Bearing Maintenance',
    slug: 'alternator-bearing-maintenance-kenya',
    keywords: ['alternator bearing Kenya', 'bearing maintenance', 'bearing noise', 'bearing replacement'],
    summary: 'Maintaining alternator bearings for long service life.',
    content: [
      { heading: 'Bearing Types', paragraphs: ['Most alternators use sealed ball bearings.', 'Some larger units use sleeve bearings.', 'Sealed bearings are lubricated for life.', 'Regreasable bearings require periodic service.'] },
      { heading: 'Bearing Problems', paragraphs: ['Noise indicates wear or damage.', 'Vibration may indicate bearing problem.', 'Excessive heat at bearing housing.', 'Lubricant leakage or contamination.'] },
      { heading: 'Replacement', paragraphs: ['Requires disassembly of alternator.', 'Use proper bearing puller to avoid damage.', 'Install new bearing with correct fit.', 'Verify smooth rotation after assembly.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'maintenance',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Bearing Fault', 'Vibration High', 'Alternator Noise'],
    relatedContent: ['ALT_001', 'ALT_004'],
    tools: ['Bearing puller', 'Press', 'Stethoscope'],
    partsPageLink: '/parts/alternator',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ALT_004',
    category: 'alternator',
    subcategory: 'brushes',
    title: 'Alternator Brush and Slip Ring Service',
    slug: 'alternator-brush-slip-ring-kenya',
    keywords: ['alternator brush Kenya', 'slip ring', 'brush replacement', 'brush maintenance'],
    summary: 'Servicing brushes and slip rings on brush-type alternators.',
    content: [
      { heading: 'Brush Function', paragraphs: ['Brushes transfer DC current to rotating field.', 'Carbon brushes ride on copper slip rings.', 'Spring pressure maintains contact.', 'Wear is normal and requires periodic replacement.'] },
      { heading: 'Inspection', paragraphs: ['Check brush length against minimum specification.', 'Inspect for chipping or uneven wear.', 'Check spring pressure.', 'Inspect slip ring surface condition.'] },
      { heading: 'Service', paragraphs: ['Replace worn brushes before reaching minimum length.', 'Bed new brushes to slip ring curvature.', 'Clean slip rings if dirty or glazed.', 'Machine slip rings if grooved or worn.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Brush Wear', 'No Voltage', 'Voltage Unstable'],
    relatedContent: ['ALT_001', 'AVR_001'],
    tools: ['Brush gauge', 'Sandpaper', 'Contact cleaner'],
    partsPageLink: '/parts/alternator',
    lastUpdated: '2024-03-15'
  }
];

export const ALTERNATOR_CONTENT_COUNT = ALTERNATOR_CONTENT.length;
