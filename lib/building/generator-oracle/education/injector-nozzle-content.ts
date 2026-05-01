/**
 * Injector Nozzle Educational Content
 * Fuel injection nozzles, atomization, and spray patterns
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const INJECTOR_NOZZLE_CONTENT: EducationalContent[] = [
  {
    id: 'INJ_N_001',
    category: 'injector_nozzle',
    subcategory: 'fundamentals',
    title: 'Diesel Injector Nozzle Fundamentals',
    slug: 'diesel-injector-nozzle-fundamentals-kenya',
    keywords: ['injector nozzle Kenya', 'diesel nozzle', 'fuel injector', 'injection nozzle'],
    summary: 'Understanding diesel injector nozzle construction and operation.',
    content: [
      { heading: 'Nozzle Function', paragraphs: ['Injector nozzles atomize fuel for efficient combustion.', 'Proper atomization creates fine droplets that burn completely.', 'Nozzle design affects spray pattern, penetration, and fuel distribution.'] },
      { heading: 'Nozzle Types', paragraphs: ['Pintle nozzles create conical spray pattern.', 'Hole-type nozzles use multiple small holes for fine atomization.', 'Modern engines use multi-hole nozzles for precise control.'] },
      { heading: 'Operating Principle', paragraphs: ['High pressure fuel lifts needle valve from seat.', 'Fuel sprays through holes or around pintle.', 'Spring returns needle when pressure drops.', 'Opening pressure is critical specification.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Injector Fault', 'Poor Combustion', 'Black Smoke'],
    relatedContent: ['INJ_N_002', 'INJ_P_001'],
    tools: ['Nozzle tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_N_002',
    category: 'injector_nozzle',
    subcategory: 'testing',
    title: 'Injector Nozzle Testing Procedures',
    slug: 'injector-nozzle-testing-kenya',
    keywords: ['nozzle testing Kenya', 'injector test', 'spray pattern test', 'nozzle pop test'],
    summary: 'Testing injector nozzles to verify proper operation and spray pattern.',
    content: [
      { heading: 'Pop Test', paragraphs: ['Pop pressure test verifies opening pressure.', 'Connect nozzle to hand pump tester.', 'Pump pressure until nozzle pops.', 'Compare pressure reading to specification.'] },
      { heading: 'Spray Pattern Test', paragraphs: ['Observe spray pattern during pop test.', 'Spray should be symmetrical and well atomized.', 'Streaming or dribbling indicates worn nozzle.', 'Uneven pattern indicates blocked holes.'] },
      { heading: 'Seat Leakage Test', paragraphs: ['Apply pressure just below pop pressure.', 'Observe nozzle tip for any leakage.', 'Should hold pressure for 10+ seconds.', 'Leakage indicates worn seat or needle.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Injector Fault', 'Low Power', 'Black Smoke'],
    relatedContent: ['INJ_N_001', 'INJ_N_003'],
    tools: ['Nozzle tester', 'Test fluid', 'Clean container'],
    safetyWarnings: ['High pressure fuel spray is dangerous - never direct at skin'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_N_003',
    category: 'injector_nozzle',
    subcategory: 'service',
    title: 'Injector Nozzle Service and Replacement',
    slug: 'injector-nozzle-service-kenya',
    keywords: ['nozzle service Kenya', 'injector replacement', 'nozzle overhaul', 'injector rebuild'],
    summary: 'Servicing and replacing injector nozzles for optimal engine performance.',
    content: [
      { heading: 'Removal Procedure', paragraphs: ['Clean area around injector before removal.', 'Disconnect return line.', 'Loosen injection line carefully.', 'Remove injector using proper tool.', 'Cap all open ports immediately.'] },
      { heading: 'Nozzle Replacement', paragraphs: ['Use only quality replacement nozzles.', 'Clean injector body thoroughly.', 'Install new nozzle with proper torque.', 'Test assembly before installation.'] },
      { heading: 'Installation', paragraphs: ['Install new copper washer/seal.', 'Install injector and torque properly.', 'Connect lines without cross-threading.', 'Bleed air from system and test.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Injector Fault'],
    relatedContent: ['INJ_N_002', 'INJ_P_001'],
    tools: ['Injector puller', 'Torque wrench', 'New seals'],
    partsPageLink: '/parts/fuel-injection',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'INJ_N_004',
    category: 'injector_nozzle',
    subcategory: 'problems',
    title: 'Common Injector Nozzle Problems',
    slug: 'injector-nozzle-problems-kenya',
    keywords: ['injector problems Kenya', 'nozzle failure', 'injector symptoms', 'bad injector'],
    summary: 'Identifying and understanding common injector nozzle failure modes.',
    content: [
      { heading: 'Low Pop Pressure', paragraphs: ['Indicates worn spring or needle/seat.', 'Causes over-fueling and smoke.', 'May cause engine knock.', 'Requires nozzle replacement or rebuild.'] },
      { heading: 'High Pop Pressure', paragraphs: ['Indicates carbon buildup or obstruction.', 'Causes incomplete combustion.', 'Results in hard starting.', 'May respond to cleaning or need replacement.'] },
      { heading: 'Poor Spray Pattern', paragraphs: ['Caused by blocked holes or worn needle.', 'Creates uneven fuel distribution.', 'Results in rough running and smoke.', 'Cleaning may help, otherwise replace.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Injector Fault', 'Black Smoke', 'Engine Rough'],
    relatedContent: ['INJ_N_002', 'INJ_N_003'],
    tools: ['Nozzle tester'],
    lastUpdated: '2024-03-15'
  }
];

export const INJECTOR_NOZZLE_CONTENT_COUNT = INJECTOR_NOZZLE_CONTENT.length;
