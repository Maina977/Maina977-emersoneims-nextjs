/**
 * Safety Systems Educational Content
 * Generator safety systems, shutdowns, and protection
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const SAFETY_CONTENT: EducationalContent[] = [
  {
    id: 'SAFE_001',
    category: 'safety_systems',
    subcategory: 'fundamentals',
    title: 'Generator Safety System Fundamentals',
    slug: 'generator-safety-systems-kenya',
    keywords: ['generator safety Kenya', 'safety systems', 'protection systems', 'shutdown systems'],
    summary: 'Understanding generator safety and protection systems.',
    content: [
      { heading: 'Safety System Purpose', paragraphs: ['Safety systems protect generator, engine, and connected equipment.', 'Automatic shutdowns prevent damage from abnormal conditions.', 'Alarms provide early warning before shutdown threshold.', 'Protection hierarchy ensures critical shutdowns cannot be bypassed.'] },
      { heading: 'Protection Categories', paragraphs: ['Engine protection: oil pressure, temperature, overspeed.', 'Generator protection: voltage, frequency, current.', 'System protection: ground fault, overcurrent, reverse power.', 'External protection: emergency stop, fire suppression.'] },
      { heading: 'Alarm vs Shutdown', paragraphs: ['Alarms warn of developing conditions.', 'Shutdowns occur when condition is critical.', 'Some faults have both warning alarm and shutdown.', 'Shutdown priority prevents restart until fault cleared.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Safety Shutdown', 'Emergency Stop'],
    relatedContent: ['SAFE_002', 'CTRL_001'],
    tools: ['Controller manual'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SAFE_002',
    category: 'safety_systems',
    subcategory: 'engine_protection',
    title: 'Engine Protection Systems',
    slug: 'engine-protection-systems-kenya',
    keywords: ['engine protection Kenya', 'oil pressure shutdown', 'overspeed protection', 'high temperature shutdown'],
    summary: 'Engine protection systems that prevent catastrophic damage.',
    content: [
      { heading: 'Low Oil Pressure', paragraphs: ['Oil pressure switch or sender monitors lubrication.', 'Low pressure indicates pump failure or oil loss.', 'Running without oil pressure causes rapid bearing damage.', 'Immediate shutdown is critical.'] },
      { heading: 'High Coolant Temperature', paragraphs: ['Temperature switch or sender monitors engine temperature.', 'High temperature indicates cooling system problem.', 'Continued operation causes piston seizure and head damage.', 'Load reduction or shutdown required.'] },
      { heading: 'Overspeed', paragraphs: ['Overspeed is the most critical engine protection.', 'Occurs if governor fails or load is suddenly removed.', 'Can cause catastrophic engine destruction.', 'Mechanical and electronic overspeed protection recommended.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Oil Pressure', 'High Temperature', 'Over Speed'],
    relatedContent: ['SAFE_001', 'SENS_001'],
    tools: ['Pressure gauge', 'Temperature gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SAFE_003',
    category: 'safety_systems',
    subcategory: 'electrical_protection',
    title: 'Electrical Protection Systems',
    slug: 'electrical-protection-systems-kenya',
    keywords: ['electrical protection Kenya', 'overcurrent protection', 'ground fault protection', 'generator protection'],
    summary: 'Electrical protection systems for generator and connected loads.',
    content: [
      { heading: 'Overcurrent Protection', paragraphs: ['Circuit breakers protect against overload and short circuit.', 'Thermal protection responds to sustained overload.', 'Magnetic protection responds to high fault current.', 'Coordination ensures downstream breaker trips first.'] },
      { heading: 'Voltage Protection', paragraphs: ['Overvoltage damages sensitive equipment.', 'Undervoltage causes motor overheating.', 'Protection relays monitor voltage levels.', 'May include time delays for transient conditions.'] },
      { heading: 'Ground Fault Protection', paragraphs: ['Detects current flow to ground (earth).', 'May indicate insulation failure.', 'Protects personnel from shock hazard.', 'Different methods: residual current, zero sequence.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Overcurrent', 'Over Voltage', 'Under Voltage', 'Ground Fault'],
    relatedContent: ['SAFE_001', 'ELEC_005'],
    tools: ['Multimeter', 'Protection relay tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SAFE_004',
    category: 'safety_systems',
    subcategory: 'emergency_stop',
    title: 'Emergency Stop Systems',
    slug: 'emergency-stop-systems-kenya',
    keywords: ['emergency stop Kenya', 'E-stop', 'emergency shutdown', 'panic button'],
    summary: 'Emergency stop systems for immediate shutdown in dangerous situations.',
    content: [
      { heading: 'Emergency Stop Purpose', paragraphs: ['Provides immediate shutdown when danger is detected.', 'Must be accessible and clearly marked.', 'Should stop generator and open main breaker.', 'Highest priority - cannot be overridden.'] },
      { heading: 'System Design', paragraphs: ['Red mushroom-head button is standard.', 'Normally closed contacts ensure fail-safe operation.', 'Multiple stations may be wired in series.', 'Manual reset required after activation.'] },
      { heading: 'Testing', paragraphs: ['Test emergency stop regularly.', 'Verify all stations function.', 'Check that shutdown is immediate.', 'Verify reset procedure is required.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 10,
    relatedFaultCodes: ['Emergency Stop'],
    relatedContent: ['SAFE_001', 'CTRL_001'],
    tools: ['Visual inspection', 'Functional test'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SAFE_005',
    category: 'safety_systems',
    subcategory: 'lockout_tagout',
    title: 'Lockout/Tagout Safety Procedures',
    slug: 'lockout-tagout-procedures-kenya',
    keywords: ['lockout tagout Kenya', 'LOTO', 'safety procedures', 'maintenance safety'],
    summary: 'Lockout/tagout procedures for safe generator maintenance.',
    content: [
      { heading: 'Purpose', paragraphs: ['Prevents accidental startup during maintenance.', 'Protects personnel from electrical and mechanical hazards.', 'Required for any work on energized or rotating equipment.', 'Legal requirement in many jurisdictions.'] },
      { heading: 'Procedure', paragraphs: ['Notify all affected personnel.', 'Shut down and isolate all energy sources.', 'Apply locks and tags to isolation points.', 'Verify zero energy state before work.'] },
      { heading: 'Energy Sources to Isolate', paragraphs: ['Electrical: battery, utility connection, breakers.', 'Mechanical: starting air, fuel shutoff.', 'Potential: springs, compressed air, fuel pressure.', 'Thermal: allow cooling before work.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'safety',
    estimatedReadTime: 12,
    relatedFaultCodes: [],
    relatedContent: ['SAFE_001', 'SAFE_004'],
    tools: ['Locks', 'Tags', 'Verification equipment'],
    safetyWarnings: ['Always follow LOTO procedures - violations can be fatal'],
    lastUpdated: '2024-03-15'
  }
];

export const SAFETY_CONTENT_COUNT = SAFETY_CONTENT.length;
