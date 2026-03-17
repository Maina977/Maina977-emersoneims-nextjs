/**
 * Parallel Operation Educational Content
 * Generator synchronization and parallel operation
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const PARALLEL_CONTENT: EducationalContent[] = [
  {
    id: 'PAR_001',
    category: 'parallel_operation',
    subcategory: 'fundamentals',
    title: 'Generator Parallel Operation Fundamentals',
    slug: 'parallel-operation-fundamentals-kenya',
    keywords: ['parallel operation Kenya', 'generator synchronization', 'parallel generators', 'load sharing'],
    summary: 'Understanding the principles of operating generators in parallel.',
    content: [
      { heading: 'Why Parallel Operation', paragraphs: ['Increased total capacity by combining generators.', 'Redundancy - one unit can fail without total loss.', 'Efficiency - run fewer units at optimal load.', 'Flexibility - match capacity to varying load.'] },
      { heading: 'Requirements for Paralleling', paragraphs: ['Same voltage (within tolerance).', 'Same frequency (matched speed).', 'Same phase rotation (ABC matches ABC).', 'Synchronized - in phase with each other.'] },
      { heading: 'Synchronization', paragraphs: ['Generators must be synchronized before connecting.', 'Phase angle must be near zero degrees.', 'Slight frequency difference ensures proper closure.', 'Closing out of sync causes severe damage.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Sync Fault', 'Phase Rotation Fault'],
    relatedContent: ['PAR_002', 'PAR_003'],
    tools: ['Synchroscope', 'Phase rotation meter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'PAR_002',
    category: 'parallel_operation',
    subcategory: 'synchronization',
    title: 'Synchronization Methods and Equipment',
    slug: 'synchronization-methods-kenya',
    keywords: ['synchronization Kenya', 'synchroscope', 'sync check relay', 'auto sync'],
    summary: 'Methods and equipment for synchronizing generators.',
    content: [
      { heading: 'Manual Synchronization', paragraphs: ['Operator uses synchroscope to match generators.', 'Adjust incoming generator speed to match bus.', 'Close breaker when synchroscope shows match.', 'Requires skill and attention.'] },
      { heading: 'Automatic Synchronization', paragraphs: ['Controller automatically matches speed and phase.', 'Closes breaker when conditions are correct.', 'Faster and more reliable than manual.', 'Standard on modern controllers.'] },
      { heading: 'Sync Check Relay', paragraphs: ['Backup protection that verifies sync conditions.', 'Prevents breaker closure if conditions wrong.', 'Should be used even with auto sync.', 'Last line of defense against out-of-sync closure.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Sync Fault', 'Sync Check Fail'],
    relatedContent: ['PAR_001', 'PAR_003'],
    tools: ['Synchroscope', 'Sync check relay', 'Frequency meter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'PAR_003',
    category: 'parallel_operation',
    subcategory: 'load_sharing',
    title: 'Load Sharing Methods and Configuration',
    slug: 'load-sharing-methods-kenya',
    keywords: ['load sharing Kenya', 'kW load sharing', 'kVAR sharing', 'droop load sharing'],
    summary: 'Methods for sharing load between paralleled generators.',
    content: [
      { heading: 'Real Power (kW) Sharing', paragraphs: ['Controlled by governor/speed control.', 'Droop mode: inherent sharing based on speed droop.', 'Isochronous mode: active sharing with master/slave.', 'Both units should carry proportional load.'] },
      { heading: 'Reactive Power (kVAR) Sharing', paragraphs: ['Controlled by AVR/voltage control.', 'Cross-current compensation prevents circulating current.', 'VAR/PF controllers actively balance reactive load.', 'Unbalanced reactive causes one unit to overheat.'] },
      { heading: 'Configuration', paragraphs: ['Set identical droop on all units.', 'Configure load sharing lines between controllers.', 'Calibrate CT inputs for accurate measurement.', 'Test load sharing under varying conditions.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Load Share Fault', 'Reverse Power', 'Overload'],
    relatedContent: ['PAR_001', 'ACT_006'],
    tools: ['Power analyzer', 'Controller configuration'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'PAR_004',
    category: 'parallel_operation',
    subcategory: 'protection',
    title: 'Parallel Operation Protection',
    slug: 'parallel-operation-protection-kenya',
    keywords: ['reverse power Kenya', 'paralleling protection', 'generator protection'],
    summary: 'Protection systems for generators operating in parallel.',
    content: [
      { heading: 'Reverse Power Protection', paragraphs: ['Detects when generator is motoring (taking power).', 'Can indicate prime mover failure.', 'Protects engine from damage.', 'Typically set at 5-15% of rated power.'] },
      { heading: 'Overcurrent Protection', paragraphs: ['Protects against overload and fault conditions.', 'May include instantaneous and time-delay elements.', 'Coordination with downstream protection required.', 'Different settings for parallel vs island mode.'] },
      { heading: 'Loss of Excitation', paragraphs: ['Detects when field current is lost.', 'Generator absorbs reactive power, can destabilize system.', 'Protection trips generator breaker.', 'Prevents cascading system failure.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Reverse Power', 'Overcurrent', 'Loss of Field'],
    relatedContent: ['PAR_001', 'SAFE_003'],
    tools: ['Protection relay tester', 'Power analyzer'],
    lastUpdated: '2024-03-15'
  }
];

export const PARALLEL_CONTENT_COUNT = PARALLEL_CONTENT.length;
