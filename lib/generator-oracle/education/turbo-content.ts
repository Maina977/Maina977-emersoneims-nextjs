/**
 * Turbocharger Educational Content
 * Turbocharger operation, maintenance, and troubleshooting
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const TURBO_CONTENT: EducationalContent[] = [
  {
    id: 'TURBO_001',
    category: 'turbocharger',
    subcategory: 'fundamentals',
    title: 'Turbocharger Fundamentals',
    slug: 'turbocharger-fundamentals-kenya',
    keywords: ['turbocharger Kenya', 'turbo operation', 'boost pressure', 'turbo system'],
    summary: 'Understanding turbocharger operation and benefits for generator engines.',
    content: [
      { heading: 'Turbocharger Purpose', paragraphs: ['Turbochargers increase engine power by forcing more air into cylinders.', 'Exhaust gas energy drives turbine wheel.', 'Turbine drives compressor wheel on common shaft.', 'Compressor pressurizes intake air (boost).'] },
      { heading: 'Operating Principle', paragraphs: ['Exhaust flows through turbine housing.', 'Turbine spins at very high speed (up to 200,000+ RPM).', 'Compressor draws in and compresses intake air.', 'Boost pressure regulated by wastegate or variable geometry.'] },
      { heading: 'Benefits', paragraphs: ['More power from same engine displacement.', 'Better fuel efficiency at rated power.', 'Improved high-altitude performance.', 'Lower emissions per kilowatt output.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Boost', 'Turbo Fault', 'Overboost'],
    relatedContent: ['TURBO_002', 'TURBO_003'],
    tools: ['Boost gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'TURBO_002',
    category: 'turbocharger',
    subcategory: 'maintenance',
    title: 'Turbocharger Maintenance Requirements',
    slug: 'turbocharger-maintenance-kenya',
    keywords: ['turbo maintenance Kenya', 'turbo care', 'turbocharger service', 'turbo lubrication'],
    summary: 'Maintaining turbochargers for long service life and reliable performance.',
    content: [
      { heading: 'Oil Requirements', paragraphs: ['Turbo bearings depend on engine oil for lubrication and cooling.', 'Use only recommended oil grade and quality.', 'Change oil at recommended intervals or sooner.', 'Oil degradation is major cause of turbo failure.'] },
      { heading: 'Air Filtration', paragraphs: ['Clean air filter is critical for turbo life.', 'Even small particles damage compressor blades at high speed.', 'Inspect and replace air filter regularly.', 'Check for intake leaks that bypass filter.'] },
      { heading: 'Operational Care', paragraphs: ['Allow engine to idle before shutdown to cool turbo.', 'Avoid high load when engine is cold.', 'Monitor boost and oil pressure regularly.', 'Investigate any unusual sounds immediately.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Turbo Fault', 'Low Oil Pressure'],
    relatedContent: ['TURBO_001', 'TURBO_003'],
    tools: ['Oil analysis', 'Air filter inspection'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'TURBO_003',
    category: 'turbocharger',
    subcategory: 'troubleshooting',
    title: 'Turbocharger Troubleshooting Guide',
    slug: 'turbocharger-troubleshooting-kenya',
    keywords: ['turbo troubleshooting Kenya', 'low boost', 'turbo problems', 'turbo diagnosis'],
    summary: 'Diagnosing common turbocharger problems and failures.',
    content: [
      { heading: 'Low Boost Pressure', paragraphs: ['Check for intake or exhaust leaks.', 'Verify wastegate operation.', 'Inspect compressor wheel for damage.', 'Check for blocked air filter.'] },
      { heading: 'Oil Leakage', paragraphs: ['Compressor side leak indicates bearing wear or seal failure.', 'Turbine side leak may be normal if exhaust side.', 'Check oil drain line for restriction.', 'Verify crankcase pressure is not excessive.'] },
      { heading: 'Noise and Vibration', paragraphs: ['Whining may indicate bearing wear.', 'Metallic scraping indicates wheel contact.', 'Cycling sound may be compressor surge.', 'Any unusual sound requires investigation.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Boost', 'Turbo Fault', 'High Exhaust Temperature'],
    relatedContent: ['TURBO_001', 'TURBO_004'],
    tools: ['Boost gauge', 'Stethoscope', 'Inspection tools'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'TURBO_004',
    category: 'turbocharger',
    subcategory: 'replacement',
    title: 'Turbocharger Replacement Procedures',
    slug: 'turbocharger-replacement-kenya',
    keywords: ['turbo replacement Kenya', 'turbocharger installation', 'new turbo', 'turbo change'],
    summary: 'Proper procedures for turbocharger removal and replacement.',
    content: [
      { heading: 'Pre-Installation', paragraphs: ['Identify and address cause of original failure.', 'Flush oil lines if contamination present.', 'Verify oil supply and drain are clear.', 'Pre-lubricate new turbo before installation.'] },
      { heading: 'Installation', paragraphs: ['Use new gaskets for all connections.', 'Connect oil feed line first.', 'Verify proper alignment before tightening.', 'Connect intake and exhaust.'] },
      { heading: 'Post-Installation', paragraphs: ['Pre-oil turbo by cranking without starting.', 'Check for leaks at all connections.', 'Verify boost pressure after startup.', 'Monitor oil pressure and temperature.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Turbo Fault'],
    relatedContent: ['TURBO_001', 'TURBO_003'],
    tools: ['Wrenches', 'New gaskets', 'Torque specifications'],
    partsPageLink: '/parts/turbocharger',
    lastUpdated: '2024-03-15'
  }
];

export const TURBO_CONTENT_COUNT = TURBO_CONTENT.length;
