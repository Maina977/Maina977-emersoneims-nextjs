/**
 * MPU (Magnetic Pickup) Educational Content
 * Speed sensing and measurement
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const MPU_CONTENT: EducationalContent[] = [
  {
    id: 'MPU_001',
    category: 'mpu',
    subcategory: 'fundamentals',
    title: 'Magnetic Pickup (MPU) Speed Sensor Fundamentals',
    slug: 'magnetic-pickup-fundamentals-kenya',
    keywords: ['magnetic pickup Kenya', 'MPU sensor', 'speed sensor', 'RPM sensor'],
    summary: 'Understanding magnetic pickup sensors for engine speed measurement.',
    content: [
      { heading: 'MPU Purpose', paragraphs: ['Magnetic pickups sense engine speed for governor and controller.', 'Output frequency proportional to engine RPM.', 'Critical for speed control and overspeed protection.', 'Most common speed sensing method for generators.'] },
      { heading: 'Operating Principle', paragraphs: ['Permanent magnet creates magnetic field.', 'Ferrous teeth on flywheel pass through field.', 'Passing teeth create AC voltage in coil.', 'Frequency indicates speed; amplitude indicates gap.'] },
      { heading: 'Signal Characteristics', paragraphs: ['Output is AC sine wave.', 'Frequency = (teeth × RPM) / 60', 'Amplitude increases with speed.', 'Typical output: 1-10V AC depending on gap and speed.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Speed Sensor Fault', 'No Speed Signal', 'MPU Fault'],
    relatedContent: ['MPU_002', 'ACT_001'],
    tools: ['Oscilloscope', 'Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'MPU_002',
    category: 'mpu',
    subcategory: 'installation',
    title: 'MPU Installation and Gap Setting',
    slug: 'mpu-installation-gap-setting-kenya',
    keywords: ['MPU installation Kenya', 'speed sensor gap', 'MPU adjustment', 'pickup gap'],
    summary: 'Proper installation and adjustment of magnetic pickup sensors.',
    content: [
      { heading: 'Installation Location', paragraphs: ['MPU typically senses flywheel or special tone wheel.', 'Must align with teeth on ring gear.', 'Protected from debris and damage.', 'Cable routing should minimize noise pickup.'] },
      { heading: 'Gap Setting', paragraphs: ['Gap between MPU tip and teeth is critical.', 'Too large: weak signal, especially at low speed.', 'Too small: risk of contact and damage.', 'Typical gap: 0.5-1.5mm (verify specification).'] },
      { heading: 'Setting Procedure', paragraphs: ['Thread MPU in until it contacts teeth.', 'Back out specified amount (typically 1/2-1 turn).', 'Tighten locknut while holding position.', 'Verify signal at cranking speed.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Speed Sensor Fault', 'No Speed Signal'],
    relatedContent: ['MPU_001', 'MPU_003'],
    tools: ['Feeler gauge', 'Wrenches', 'Oscilloscope'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'MPU_003',
    category: 'mpu',
    subcategory: 'testing',
    title: 'MPU Testing and Troubleshooting',
    slug: 'mpu-testing-troubleshooting-kenya',
    keywords: ['MPU testing Kenya', 'speed sensor diagnosis', 'MPU troubleshooting'],
    summary: 'Testing and diagnosing magnetic pickup sensor problems.',
    content: [
      { heading: 'Static Testing', paragraphs: ['Measure coil resistance with multimeter.', 'Compare to specification (typically 200-1500 ohms).', 'Open circuit indicates broken wire.', 'Very low resistance indicates short.'] },
      { heading: 'Dynamic Testing', paragraphs: ['Use oscilloscope to observe signal during cranking.', 'Verify clean sine wave pattern.', 'Check amplitude is adequate for controller.', 'Note frequency matches expected for speed.'] },
      { heading: 'Common Problems', paragraphs: ['No signal: broken wire, open coil, excessive gap.', 'Weak signal: large gap, weak magnet, damaged tip.', 'Intermittent: loose connection, damaged cable.', 'Erratic: damaged teeth, debris, noise pickup.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Speed Sensor Fault', 'No Speed Signal', 'Erratic Speed'],
    relatedContent: ['MPU_001', 'MPU_002'],
    tools: ['Multimeter', 'Oscilloscope'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'MPU_004',
    category: 'mpu',
    subcategory: 'alternatives',
    title: 'Alternative Speed Sensing Methods',
    slug: 'alternative-speed-sensing-kenya',
    keywords: ['speed sensing Kenya', 'Hall effect sensor', 'optical sensor', 'speed measurement'],
    summary: 'Comparing different speed sensing technologies.',
    content: [
      { heading: 'Hall Effect Sensors', paragraphs: ['Active sensor requiring power supply.', 'Produces square wave digital output.', 'Works well at very low speeds.', 'More sensitive than passive MPU.'] },
      { heading: 'Optical Sensors', paragraphs: ['Uses light beam interrupted by disc.', 'Very precise and fast response.', 'Sensitive to contamination.', 'Used in clean environments.'] },
      { heading: 'Selection Criteria', paragraphs: ['MPU: rugged, simple, no power required.', 'Hall effect: low speed capability, digital output.', 'Optical: high precision, clean environment.', 'Match sensor to application requirements.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 10,
    relatedFaultCodes: ['Speed Sensor Fault'],
    relatedContent: ['MPU_001', 'SENS_001'],
    tools: ['Application requirements analysis'],
    lastUpdated: '2024-03-15'
  }
];

export const MPU_CONTENT_COUNT = MPU_CONTENT.length;
