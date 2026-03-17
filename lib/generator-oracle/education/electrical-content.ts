/**
 * Electrical System Educational Content
 * Generator electrical systems, wiring, and connections
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const ELECTRICAL_CONTENT: EducationalContent[] = [
  {
    id: 'ELEC_001',
    category: 'electrical',
    subcategory: 'fundamentals',
    title: 'Generator Electrical System Fundamentals',
    slug: 'generator-electrical-system-kenya',
    keywords: ['generator electrical Kenya', 'electrical system', 'generator wiring', 'electrical fundamentals'],
    summary: 'Understanding the electrical systems and circuits in diesel generator sets.',
    content: [
      { heading: 'System Overview', paragraphs: ['Generator electrical systems include starting, charging, control, and output circuits.', 'DC systems (typically 12V or 24V) power starting and control.', 'AC output provides power to connected loads.', 'Proper understanding prevents electrical damage and unsafe conditions.'] },
      { heading: 'DC Control System', paragraphs: ['Battery provides power for starting and control.', 'Charging system maintains battery condition.', 'Controller uses DC power for operation.', 'DC circuits include safety shutdowns and alarms.'] },
      { heading: 'AC Output System', paragraphs: ['Generator produces AC power at specified voltage and frequency.', 'Main circuit breaker protects generator and wiring.', 'Distribution panel routes power to loads.', 'Protection devices prevent overload and fault conditions.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Electrical Fault', 'Battery Fault'],
    relatedContent: ['ELEC_002', 'BAT_001'],
    tools: ['Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ELEC_002',
    category: 'electrical',
    subcategory: 'wiring',
    title: 'Generator Wiring Diagrams and Schematics',
    slug: 'generator-wiring-diagrams-kenya',
    keywords: ['wiring diagram Kenya', 'electrical schematic', 'generator wiring', 'circuit diagram'],
    summary: 'Understanding and using wiring diagrams for troubleshooting and repairs.',
    content: [
      { heading: 'Diagram Types', paragraphs: ['Schematic diagrams show electrical relationships.', 'Wiring diagrams show physical wire routing.', 'Component location diagrams show physical positions.', 'Each type serves different troubleshooting needs.'] },
      { heading: 'Reading Schematics', paragraphs: ['Learn common electrical symbols.', 'Follow current flow from source to load.', 'Identify series vs parallel circuits.', 'Trace circuits to understand function.'] },
      { heading: 'Using Diagrams', paragraphs: ['Locate diagram in service manual or control panel.', 'Identify circuit being troubleshot.', 'Trace wires and components.', 'Compare actual wiring to diagram.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Electrical Fault', 'Wiring Fault'],
    relatedContent: ['ELEC_001', 'ELEC_003'],
    tools: ['Service manual', 'Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ELEC_003',
    category: 'electrical',
    subcategory: 'connections',
    title: 'Electrical Connection Maintenance',
    slug: 'electrical-connection-maintenance-kenya',
    keywords: ['electrical connections Kenya', 'wire connections', 'terminal maintenance', 'connection corrosion'],
    summary: 'Maintaining electrical connections for reliable generator operation.',
    content: [
      { heading: 'Connection Problems', paragraphs: ['Loose connections cause voltage drops and heating.', 'Corrosion increases resistance.', 'Vibration can loosen connections over time.', 'Poor connections are a common cause of intermittent faults.'] },
      { heading: 'Inspection', paragraphs: ['Visually inspect for corrosion or discoloration.', 'Check terminal tightness.', 'Look for signs of overheating - melted insulation, discoloration.', 'Use thermal camera to identify hot connections.'] },
      { heading: 'Maintenance', paragraphs: ['Clean corroded connections with appropriate cleaner.', 'Tighten loose connections to proper torque.', 'Apply corrosion inhibitor where appropriate.', 'Replace damaged terminals or connectors.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Electrical Fault', 'High Resistance'],
    relatedContent: ['ELEC_001', 'ELEC_004'],
    tools: ['Contact cleaner', 'Wire brush', 'Torque wrench', 'Thermal camera'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ELEC_004',
    category: 'electrical',
    subcategory: 'grounding',
    title: 'Generator Grounding and Bonding',
    slug: 'generator-grounding-bonding-kenya',
    keywords: ['generator grounding Kenya', 'earthing', 'bonding', 'electrical safety'],
    summary: 'Proper grounding and bonding for electrical safety and protection.',
    content: [
      { heading: 'Grounding Purpose', paragraphs: ['Grounding provides a path for fault current to return to source.', 'Enables protective devices to operate during faults.', 'Protects personnel from electrical shock.', 'Stabilizes system voltage.'] },
      { heading: 'Grounding Requirements', paragraphs: ['Generator frame must be grounded.', 'Neutral grounding depends on system configuration.', 'Ground electrode must have low resistance.', 'Follow local electrical codes and regulations.'] },
      { heading: 'Testing', paragraphs: ['Measure ground electrode resistance.', 'Verify continuity of grounding conductors.', 'Check bonding connections.', 'Document test results for records.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Ground Fault', 'Earth Fault'],
    relatedContent: ['ELEC_001', 'ELEC_005'],
    tools: ['Ground resistance tester', 'Multimeter'],
    safetyWarnings: ['Improper grounding creates shock hazard'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ELEC_005',
    category: 'electrical',
    subcategory: 'protection',
    title: 'Electrical Protection Devices',
    slug: 'electrical-protection-devices-kenya',
    keywords: ['circuit breaker Kenya', 'electrical protection', 'fuses', 'overcurrent protection'],
    summary: 'Understanding electrical protection devices and their functions.',
    content: [
      { heading: 'Circuit Breakers', paragraphs: ['Circuit breakers protect against overcurrent and short circuits.', 'Thermal-magnetic breakers protect against overload and fault.', 'Main breaker protects generator output.', 'Branch breakers protect individual circuits.'] },
      { heading: 'Fuses', paragraphs: ['Fuses provide overcurrent protection by melting.', 'Must be replaced after operation.', 'Fast-blow fuses protect sensitive equipment.', 'Slow-blow fuses tolerate inrush current.'] },
      { heading: 'Protective Relays', paragraphs: ['Relays provide sophisticated protection functions.', 'Over/under voltage protection.', 'Over/under frequency protection.', 'Differential protection for large generators.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Overcurrent', 'Over Voltage', 'Under Voltage'],
    relatedContent: ['ELEC_001', 'ELEC_004'],
    tools: ['Multimeter', 'Test equipment'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ELEC_006',
    category: 'electrical',
    subcategory: 'troubleshooting',
    title: 'Electrical Troubleshooting Techniques',
    slug: 'electrical-troubleshooting-techniques-kenya',
    keywords: ['electrical troubleshooting Kenya', 'fault finding', 'electrical diagnosis', 'multimeter testing'],
    summary: 'Systematic approach to diagnosing electrical problems in generators.',
    content: [
      { heading: 'Voltage Testing', paragraphs: ['Measure voltage at source and load.', 'Compare actual to expected values.', 'Voltage drops indicate high resistance or open circuits.', 'Zero voltage indicates open circuit upstream.'] },
      { heading: 'Continuity Testing', paragraphs: ['Test with circuit de-energized.', 'Verify circuit path is complete.', 'Check switches, fuses, and connections.', 'Identify open circuits.'] },
      { heading: 'Systematic Approach', paragraphs: ['Start at known good point.', 'Work toward suspected problem area.', 'Use divide-and-conquer strategy for complex circuits.', 'Document findings and measurements.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Electrical Fault', 'Open Circuit', 'Short Circuit'],
    relatedContent: ['ELEC_002', 'ELEC_003'],
    tools: ['Multimeter', 'Test leads', 'Wiring diagram'],
    lastUpdated: '2024-03-15'
  }
];

export const ELECTRICAL_CONTENT_COUNT = ELECTRICAL_CONTENT.length;
