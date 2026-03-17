/**
 * AVR (Automatic Voltage Regulator) Educational Content
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const AVR_CONTENT: EducationalContent[] = [
  {
    id: 'AVR_001',
    category: 'avr',
    subcategory: 'fundamentals',
    title: 'AVR Fundamentals and Operating Principles',
    slug: 'avr-fundamentals-kenya',
    keywords: ['AVR Kenya', 'voltage regulator', 'generator AVR', 'automatic voltage regulator'],
    summary: 'Understanding how automatic voltage regulators maintain stable generator output voltage.',
    content: [
      { heading: 'AVR Purpose', paragraphs: ['The Automatic Voltage Regulator maintains constant output voltage regardless of load changes.', 'Without AVR, voltage would vary significantly with load, damaging connected equipment.', 'AVR adjusts generator field excitation to compensate for load changes.'] },
      { heading: 'Operating Principle', paragraphs: ['AVR senses output voltage through sensing circuits.', 'Compares actual voltage to setpoint reference.', 'Adjusts field current to increase or decrease output voltage.', 'Response time is typically 200-500 milliseconds.'] },
      { heading: 'Key Specifications', paragraphs: ['Voltage regulation accuracy: typically ±0.5% to ±1%', 'Voltage adjustment range: typically ±5% to ±10%', 'Response time determines performance under transient loads.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Under Voltage', 'Over Voltage', 'AVR Fault'],
    relatedContent: ['AVR_002', 'ALT_001'],
    tools: ['Multimeter', 'Oscilloscope'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_002',
    category: 'avr',
    subcategory: 'types',
    title: 'AVR Types and Selection Guide',
    slug: 'avr-types-selection-kenya',
    keywords: ['AVR types Kenya', 'AVR selection', 'analog AVR', 'digital AVR'],
    summary: 'Comparing different AVR technologies and selecting the right type for your application.',
    content: [
      { heading: 'Analog AVR', paragraphs: ['Traditional design using discrete components.', 'Simple, reliable, and easy to repair.', 'Limited adjustment options and slower response.', 'Common in older and smaller generators.'] },
      { heading: 'Digital AVR', paragraphs: ['Microprocessor-based control with advanced features.', 'Precise regulation with programmable parameters.', 'Built-in protection and diagnostic capabilities.', 'Faster response to transient loads.'] },
      { heading: 'Selection Criteria', paragraphs: ['Match AVR rating to generator exciter requirements.', 'Consider load characteristics - motor starting needs fast response.', 'Digital AVRs preferred for parallel operation.', 'Consider availability of spare parts in Kenya market.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['AVR Fault', 'Voltage Unstable'],
    relatedContent: ['AVR_001', 'AVR_003'],
    tools: ['Specifications sheet', 'Multimeter'],
    partsPageLink: '/parts/avr',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_003',
    category: 'avr',
    subcategory: 'adjustment',
    title: 'AVR Voltage Adjustment Procedures',
    slug: 'avr-voltage-adjustment-kenya',
    keywords: ['AVR adjustment Kenya', 'voltage setting', 'AVR calibration', 'voltage adjustment'],
    summary: 'Step-by-step procedures for adjusting generator output voltage using the AVR.',
    content: [
      { heading: 'When to Adjust', paragraphs: ['After AVR replacement.', 'When measured voltage differs from nameplate.', 'After major generator repairs.', 'When parallel operation requires matching.'] },
      { heading: 'Adjustment Procedure', paragraphs: ['Allow generator to warm up at rated speed.', 'Apply approximately 50% rated load.', 'Measure output voltage with accurate meter.', 'Adjust voltage potentiometer slowly.', 'Verify voltage at no load and full load.'] },
      { heading: 'Important Considerations', paragraphs: ['Never exceed nameplate voltage by more than 5%.', 'High voltage accelerates insulation degradation.', 'Low voltage causes motor overheating.', 'Document final settings for reference.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Under Voltage', 'Over Voltage'],
    relatedContent: ['AVR_001', 'AVR_004'],
    tools: ['Multimeter', 'Load bank', 'Screwdriver'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_004',
    category: 'avr',
    subcategory: 'troubleshooting',
    title: 'AVR Troubleshooting and Diagnosis',
    slug: 'avr-troubleshooting-kenya',
    keywords: ['AVR troubleshooting Kenya', 'AVR diagnosis', 'voltage problems', 'AVR testing'],
    summary: 'Systematic approach to diagnosing AVR and voltage regulation problems.',
    content: [
      { heading: 'No Voltage Output', paragraphs: ['Check for residual magnetism in generator.', 'Verify AVR sensing input voltage.', 'Check field circuit continuity.', 'Test AVR field output voltage.'] },
      { heading: 'Voltage Too High', paragraphs: ['Check voltage potentiometer setting.', 'Verify sensing circuit connections.', 'Test for shorted sensing diodes.', 'Check for AVR feedback problems.'] },
      { heading: 'Unstable Voltage', paragraphs: ['Check stability potentiometer setting.', 'Verify sensing connections are secure.', 'Check for engine speed fluctuations.', 'Inspect for loose AVR connections.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 16,
    relatedFaultCodes: ['AVR Fault', 'Under Voltage', 'Over Voltage', 'Voltage Unstable'],
    relatedContent: ['AVR_001', 'AVR_005'],
    tools: ['Multimeter', 'Oscilloscope', 'Test leads'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_005',
    category: 'avr',
    subcategory: 'replacement',
    title: 'AVR Replacement and Configuration',
    slug: 'avr-replacement-configuration-kenya',
    keywords: ['AVR replacement Kenya', 'AVR installation', 'AVR setup', 'new AVR'],
    summary: 'Procedures for replacing and configuring a new AVR unit.',
    content: [
      { heading: 'Pre-Replacement', paragraphs: ['Document all existing wire connections.', 'Note current potentiometer positions.', 'Verify replacement AVR specifications match original.', 'Check for any additional protection components.'] },
      { heading: 'Installation', paragraphs: ['Mount AVR securely in same location.', 'Connect wires exactly as documented.', 'Set potentiometers to mid-range initially.', 'Verify all connections are tight.'] },
      { heading: 'Initial Setup', paragraphs: ['Flash field if no residual voltage.', 'Start generator at no load.', 'Adjust voltage to nameplate rating.', 'Test stability under varying load.', 'Adjust stability if hunting occurs.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['AVR Fault'],
    relatedContent: ['AVR_003', 'AVR_004'],
    tools: ['Multimeter', 'Wrenches', 'New AVR unit'],
    partsPageLink: '/parts/avr',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_006',
    category: 'avr',
    subcategory: 'field_flashing',
    title: 'Generator Field Flashing Procedures',
    slug: 'generator-field-flashing-kenya',
    keywords: ['field flashing Kenya', 'residual magnetism', 'generator excitation', 'flash field'],
    summary: 'Restoring residual magnetism when generator produces no voltage output.',
    content: [
      { heading: 'Why Flashing is Needed', paragraphs: ['Generators require residual magnetism to self-excite.', 'Magnetism can be lost from extended shutdown, vibration, or age.', 'Without residual magnetism, AVR has no sensing input to build voltage.'] },
      { heading: 'Flashing Procedure', paragraphs: ['Disconnect AVR field output wires.', 'Connect 12V DC source to field winding with correct polarity.', 'Apply voltage briefly (1-2 seconds maximum).', 'Reconnect AVR and test for voltage buildup.'] },
      { heading: 'Safety Warnings', paragraphs: ['Never flash field with engine running.', 'Use correct polarity to maintain proper magnetic orientation.', 'Never apply voltage for extended period - field winding can burn.', 'If unsuccessful, check for open field winding.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 12,
    relatedFaultCodes: ['No Voltage Output', 'Under Voltage'],
    relatedContent: ['AVR_001', 'ALT_001'],
    tools: ['12V battery', 'Test leads', 'Multimeter'],
    safetyWarnings: ['Disconnect from load before flashing', 'Engine must be stopped'],
    lastUpdated: '2024-03-15'
  }
];

export const AVR_CONTENT_COUNT = AVR_CONTENT.length;
