/**
 * Lubrication System Educational Content
 * Engine lubrication, oil analysis, and maintenance
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const LUBRICATION_CONTENT: EducationalContent[] = [
  {
    id: 'LUB_001',
    category: 'lubrication',
    subcategory: 'fundamentals',
    title: 'Engine Lubrication System Fundamentals',
    slug: 'lubrication-system-fundamentals-kenya',
    keywords: ['lubrication system Kenya', 'engine oil', 'oil system', 'lubrication fundamentals'],
    summary: 'Understanding diesel engine lubrication systems and their importance.',
    content: [
      { heading: 'Lubrication Purpose', paragraphs: ['Lubrication reduces friction between moving parts.', 'Oil film prevents metal-to-metal contact.', 'Also provides cooling, cleaning, and sealing.', 'Adequate lubrication is critical for engine life.'] },
      { heading: 'System Components', paragraphs: ['Oil pump pressurizes and circulates oil.', 'Oil filter removes contaminants.', 'Oil cooler controls oil temperature.', 'Galleries and passages distribute oil to components.'] },
      { heading: 'Oil Flow Path', paragraphs: ['Pump draws oil from sump.', 'Oil passes through filter.', 'Pressurized oil flows to main bearings.', 'Drains back to sump by gravity.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Low Oil Pressure', 'High Oil Temperature', 'Oil Level Low'],
    relatedContent: ['LUB_002', 'LUB_003'],
    tools: ['Oil pressure gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LUB_002',
    category: 'lubrication',
    subcategory: 'oil_selection',
    title: 'Engine Oil Selection and Specifications',
    slug: 'engine-oil-selection-kenya',
    keywords: ['engine oil Kenya', 'oil grade', 'oil specifications', 'diesel oil'],
    summary: 'Selecting the correct engine oil for generator applications.',
    content: [
      { heading: 'Viscosity Grades', paragraphs: ['SAE grades indicate oil thickness.', 'Multi-grade oils (15W-40) work across temperature range.', 'W rating is cold temperature performance.', 'Second number is hot temperature viscosity.'] },
      { heading: 'Performance Specifications', paragraphs: ['API classifications (CI-4, CJ-4) indicate quality level.', 'Higher letters indicate improved performance.', 'Must meet or exceed engine manufacturer requirements.', 'Check for compatibility with emission systems.'] },
      { heading: 'Selection for Kenya', paragraphs: ['15W-40 is common choice for Kenya climate.', 'Higher quality oils handle dusty conditions better.', 'Consider oil change intervals when selecting grade.', 'Use same brand and type consistently.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Oil Quality Fault'],
    relatedContent: ['LUB_001', 'LUB_003'],
    tools: ['Specifications manual'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LUB_003',
    category: 'lubrication',
    subcategory: 'maintenance',
    title: 'Oil Change Procedures and Intervals',
    slug: 'oil-change-procedures-kenya',
    keywords: ['oil change Kenya', 'oil service', 'filter change', 'oil maintenance'],
    summary: 'Proper oil change procedures for generator engines.',
    content: [
      { heading: 'Change Intervals', paragraphs: ['Follow manufacturer recommended intervals.', 'Hours of operation is primary measure.', 'Consider operating conditions - dusty, hot environments need shorter intervals.', 'Oil analysis can help optimize intervals.'] },
      { heading: 'Change Procedure', paragraphs: ['Warm engine to operating temperature.', 'Drain oil completely into appropriate container.', 'Replace oil filter with genuine part.', 'Fill with correct quantity of new oil.', 'Run engine and check for leaks.', 'Verify oil level after running.'] },
      { heading: 'Best Practices', paragraphs: ['Dispose of used oil properly.', 'Record oil change date and hours.', 'Inspect drained oil for contamination.', 'Check oil level daily during operation.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Oil Level Low', 'Oil Quality Fault'],
    relatedContent: ['LUB_001', 'LUB_004'],
    tools: ['Drain pan', 'Filter wrench', 'Funnel', 'New oil and filter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LUB_004',
    category: 'lubrication',
    subcategory: 'analysis',
    title: 'Oil Analysis and Condition Monitoring',
    slug: 'oil-analysis-condition-monitoring-kenya',
    keywords: ['oil analysis Kenya', 'oil testing', 'condition monitoring', 'oil sampling'],
    summary: 'Using oil analysis to monitor engine condition and optimize maintenance.',
    content: [
      { heading: 'Analysis Benefits', paragraphs: ['Detects wear before failure occurs.', 'Identifies contamination sources.', 'Helps optimize oil change intervals.', 'Provides trending data over time.'] },
      { heading: 'What Analysis Measures', paragraphs: ['Wear metals: iron, copper, lead, aluminum.', 'Contaminants: silicon (dirt), sodium (coolant).', 'Oil condition: viscosity, oxidation, nitration.', 'Additives: depletion indicates oil aging.'] },
      { heading: 'Sampling Procedure', paragraphs: ['Sample while oil is warm and circulating.', 'Use clean sampling equipment.', 'Take sample from same location each time.', 'Send to laboratory promptly.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Oil Quality Fault', 'Wear Detected'],
    relatedContent: ['LUB_001', 'LUB_003'],
    tools: ['Sampling kit', 'Sample bottles', 'Laboratory services'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LUB_005',
    category: 'lubrication',
    subcategory: 'troubleshooting',
    title: 'Oil Pressure and System Troubleshooting',
    slug: 'oil-pressure-troubleshooting-kenya',
    keywords: ['low oil pressure Kenya', 'oil pressure problems', 'oil system diagnosis'],
    summary: 'Diagnosing oil pressure and lubrication system problems.',
    content: [
      { heading: 'Low Oil Pressure Causes', paragraphs: ['Low oil level - check and add oil.', 'Wrong oil viscosity - verify correct grade.', 'Worn oil pump - test pump output.', 'Worn bearings - increased clearances.', 'Faulty pressure sender - verify with mechanical gauge.'] },
      { heading: 'High Oil Pressure', paragraphs: ['Cold oil - allow warmup.', 'Blocked filter - replace filter.', 'Incorrect oil viscosity - too thick.', 'Relief valve stuck closed - inspect valve.'] },
      { heading: 'Oil Consumption', paragraphs: ['External leaks - inspect all seals and gaskets.', 'Worn valve guides - blue smoke on startup.', 'Worn rings - blue smoke under load.', 'Crankcase ventilation problem - check PCV.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Oil Pressure', 'High Oil Pressure', 'High Oil Consumption'],
    relatedContent: ['LUB_001', 'SENS_002'],
    tools: ['Mechanical pressure gauge', 'Oil level dipstick'],
    lastUpdated: '2024-03-15'
  }
];

export const LUBRICATION_CONTENT_COUNT = LUBRICATION_CONTENT.length;
