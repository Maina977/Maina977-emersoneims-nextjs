/**
 * Actuator Educational Content
 * Governor actuators, throttle control, and speed regulation
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const ACTUATOR_CONTENT: EducationalContent[] = [
  {
    id: 'ACT_001',
    category: 'actuator',
    subcategory: 'fundamentals',
    title: 'Electronic Governor Actuator Fundamentals',
    slug: 'electronic-governor-actuator-kenya',
    keywords: ['governor actuator Kenya', 'electronic governor', 'speed actuator', 'throttle actuator'],
    summary: 'Understanding electronic governor actuators and their role in engine speed control.',
    content: [
      { heading: 'Actuator Purpose', paragraphs: ['Electronic actuators control fuel delivery to maintain constant engine speed.', 'Replace mechanical governors for improved speed regulation.', 'Enable remote and automatic speed control.'] },
      { heading: 'Operating Principle', paragraphs: ['Controller sends PWM signal to actuator coil.', 'Electromagnetic force moves actuator shaft.', 'Shaft connects to fuel rack or throttle linkage.', 'Position feedback enables precise control.'] },
      { heading: 'Speed Regulation', paragraphs: ['Maintains generator frequency at 50Hz (1500 RPM for 4-pole).', 'Responds to load changes within milliseconds.', 'Typical regulation: ±0.25% to ±1% steady state.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Speed Fault', 'Actuator Fault', 'Over Speed', 'Under Speed'],
    relatedContent: ['ACT_002', 'CTRL_001'],
    tools: ['Multimeter', 'Oscilloscope'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ACT_002',
    category: 'actuator',
    subcategory: 'types',
    title: 'Actuator Types and Applications',
    slug: 'actuator-types-applications-kenya',
    keywords: ['actuator types Kenya', 'linear actuator', 'rotary actuator', 'stepper actuator'],
    summary: 'Comparing different actuator technologies for generator speed control.',
    content: [
      { heading: 'Proportional Solenoid', paragraphs: ['Simple, robust design with electromagnetic coil.', 'Linear force proportional to current.', 'Common in smaller generators.', 'Requires spring return.'] },
      { heading: 'Stepper Motor', paragraphs: ['Digital control with precise positioning.', 'Holds position without power consumption.', 'Used in modern electronic governors.', 'Complex driver electronics required.'] },
      { heading: 'Servo Motor', paragraphs: ['Highest precision with position feedback.', 'Fast response for demanding applications.', 'Used in synchronizing applications.', 'Most expensive option.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Actuator Fault', 'Speed Fault'],
    relatedContent: ['ACT_001', 'ACT_003'],
    tools: ['Specifications sheet'],
    partsPageLink: '/parts/actuators',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ACT_003',
    category: 'actuator',
    subcategory: 'diagnosis',
    title: 'Actuator Testing and Diagnosis',
    slug: 'actuator-testing-diagnosis-kenya',
    keywords: ['actuator testing Kenya', 'actuator diagnosis', 'governor troubleshooting'],
    summary: 'Systematic approach to diagnosing actuator and speed control problems.',
    content: [
      { heading: 'Electrical Testing', paragraphs: ['Measure coil resistance - compare to specifications.', 'Check for open or shorted windings.', 'Verify connector and wiring integrity.', 'Test position feedback sensor if equipped.'] },
      { heading: 'Mechanical Testing', paragraphs: ['Check for free movement through full range.', 'Verify linkage connections are secure.', 'Look for binding or sticking.', 'Check return spring condition.'] },
      { heading: 'Functional Testing', paragraphs: ['Apply control signal and observe response.', 'Verify full stroke is achieved.', 'Check for position hunting or instability.', 'Test under load conditions.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Actuator Fault', 'Speed Fault', 'Over Speed', 'Under Speed'],
    relatedContent: ['ACT_001', 'ACT_004'],
    tools: ['Multimeter', 'Power supply', 'Signal generator'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ACT_004',
    category: 'actuator',
    subcategory: 'replacement',
    title: 'Actuator Replacement and Calibration',
    slug: 'actuator-replacement-calibration-kenya',
    keywords: ['actuator replacement Kenya', 'actuator calibration', 'governor setup'],
    summary: 'Procedures for replacing and calibrating governor actuators.',
    content: [
      { heading: 'Removal', paragraphs: ['Document linkage geometry before removal.', 'Disconnect electrical connections.', 'Remove mounting bolts and actuator.', 'Inspect mounting area for damage.'] },
      { heading: 'Installation', paragraphs: ['Verify replacement actuator specifications.', 'Install with original mounting orientation.', 'Connect linkage with proper geometry.', 'Connect electrical with attention to polarity.'] },
      { heading: 'Calibration', paragraphs: ['Follow manufacturer calibration procedure.', 'Set minimum and maximum fuel positions.', 'Adjust idle and rated speed settings.', 'Verify speed droop for parallel operation.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Actuator Fault'],
    relatedContent: ['ACT_003', 'ACT_001'],
    tools: ['Wrenches', 'Multimeter', 'Speed measuring device'],
    partsPageLink: '/parts/actuators',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ACT_005',
    category: 'actuator',
    subcategory: 'linkage',
    title: 'Throttle Linkage Setup and Adjustment',
    slug: 'throttle-linkage-setup-kenya',
    keywords: ['throttle linkage Kenya', 'fuel rack linkage', 'governor linkage'],
    summary: 'Proper setup and adjustment of actuator to engine throttle linkage.',
    content: [
      { heading: 'Linkage Principles', paragraphs: ['Linkage converts actuator motion to throttle movement.', 'Proper geometry ensures linear response.', 'Binding or play causes speed instability.'] },
      { heading: 'Inspection', paragraphs: ['Check all pivot points for wear.', 'Verify rod ends are secure.', 'Look for bent or damaged components.', 'Check for interference throughout range.'] },
      { heading: 'Adjustment', paragraphs: ['Set linkage length for full throttle travel.', 'Ensure no binding at extreme positions.', 'Adjust to remove excessive play.', 'Lubricate pivot points after adjustment.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Speed Fault', 'Over Speed', 'Under Speed'],
    relatedContent: ['ACT_001', 'ACT_004'],
    tools: ['Wrenches', 'Lubricant', 'Measuring tools'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ACT_006',
    category: 'actuator',
    subcategory: 'speed_droop',
    title: 'Speed Droop Configuration for Parallel Operation',
    slug: 'speed-droop-configuration-kenya',
    keywords: ['speed droop Kenya', 'parallel operation', 'load sharing', 'droop setting'],
    summary: 'Understanding and configuring speed droop for generator parallel operation.',
    content: [
      { heading: 'What is Speed Droop', paragraphs: ['Speed droop is the intentional decrease in speed as load increases.', 'Typically 3-5% droop from no-load to full load.', 'Enables stable load sharing between paralleled generators.'] },
      { heading: 'Why Droop is Needed', paragraphs: ['Without droop, paralleled generators fight for load.', 'One generator takes all load while other motorizes.', 'Droop provides inherent stability for load sharing.'] },
      { heading: 'Configuration', paragraphs: ['Set droop percentage on governor controller.', 'All paralleled units should have same droop setting.', 'Higher droop improves stability but worsens frequency regulation.', 'Isochronous operation requires active load sharing.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Reverse Power', 'Overload'],
    relatedContent: ['PAR_001', 'ACT_001'],
    tools: ['Speed measuring device', 'Load measuring device'],
    lastUpdated: '2024-03-15'
  }
];

export const ACTUATOR_CONTENT_COUNT = ACTUATOR_CONTENT.length;
