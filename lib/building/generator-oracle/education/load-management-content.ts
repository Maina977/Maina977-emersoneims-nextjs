/**
 * Load Management Educational Content
 * Load control, management, and optimization
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const LOAD_MANAGEMENT_CONTENT: EducationalContent[] = [
  {
    id: 'LOAD_001',
    category: 'load_management',
    subcategory: 'fundamentals',
    title: 'Generator Load Management Fundamentals',
    slug: 'load-management-fundamentals-kenya',
    keywords: ['load management Kenya', 'generator loading', 'load control', 'power management'],
    summary: 'Understanding generator load management principles and practices.',
    content: [
      { heading: 'Load Management Purpose', paragraphs: ['Ensures generator operates within safe limits.', 'Prevents overloading and equipment damage.', 'Optimizes fuel efficiency.', 'Maintains power quality for connected equipment.'] },
      { heading: 'Load Types', paragraphs: ['Resistive loads: heaters, incandescent lights.', 'Inductive loads: motors, transformers.', 'Non-linear loads: computers, VFDs, LED lights.', 'Each type affects generator differently.'] },
      { heading: 'Loading Considerations', paragraphs: ['Rated load is continuous capability.', 'Standby rating allows limited overload.', 'Motor starting creates high transient loads.', 'Power factor affects actual kVA load.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Overload', 'Under Load'],
    relatedContent: ['LOAD_002', 'LOAD_003'],
    tools: ['Power analyzer', 'Load meter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LOAD_002',
    category: 'load_management',
    subcategory: 'motor_starting',
    title: 'Motor Starting and Transient Loads',
    slug: 'motor-starting-loads-kenya',
    keywords: ['motor starting Kenya', 'inrush current', 'transient loads', 'motor starting methods'],
    summary: 'Managing motor starting loads on generators.',
    content: [
      { heading: 'Motor Starting Challenge', paragraphs: ['Motors draw 5-8 times rated current during starting.', 'This high current causes voltage dip.', 'Voltage dip can affect other equipment.', 'Generator must be sized for starting loads.'] },
      { heading: 'Starting Methods', paragraphs: ['Direct-on-line (DOL): full voltage, highest inrush.', 'Star-delta: reduced starting current, common method.', 'Soft starter: electronic controlled ramp up.', 'VFD: variable frequency, lowest starting impact.'] },
      { heading: 'Generator Sizing', paragraphs: ['Consider largest motor starting requirement.', 'Voltage dip should stay within 15-20%.', 'Generator kVA often determined by starting needs.', 'Consult starting kVA calculations.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Under Voltage', 'Overload'],
    relatedContent: ['LOAD_001', 'AVR_001'],
    tools: ['Power analyzer', 'Inrush meter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LOAD_003',
    category: 'load_management',
    subcategory: 'non_linear',
    title: 'Non-Linear Loads and Harmonics',
    slug: 'non-linear-loads-harmonics-kenya',
    keywords: ['harmonics Kenya', 'non-linear loads', 'VFD harmonics', 'generator harmonics'],
    summary: 'Understanding and managing non-linear loads and harmonics.',
    content: [
      { heading: 'Non-Linear Loads', paragraphs: ['Draw current in pulses rather than sine wave.', 'Common: VFDs, UPS systems, computers, LED lighting.', 'Create harmonic currents that distort voltage.', 'Increasingly common in modern facilities.'] },
      { heading: 'Harmonic Effects', paragraphs: ['Generator heating from harmonic currents.', 'Voltage distortion affecting sensitive equipment.', 'Nuisance tripping of protective devices.', 'Interference with communication systems.'] },
      { heading: 'Mitigation', paragraphs: ['Derate generator for harmonic loads.', 'Use 12-pulse or 18-pulse VFDs.', 'Add harmonic filters if needed.', 'Specify low-harmonic equipment.'] }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Harmonic Fault', 'Generator Overheating'],
    relatedContent: ['LOAD_001', 'ELEC_001'],
    tools: ['Power quality analyzer', 'Harmonic analyzer'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LOAD_004',
    category: 'load_management',
    subcategory: 'load_shedding',
    title: 'Load Shedding and Priority Management',
    slug: 'load-shedding-priority-kenya',
    keywords: ['load shedding Kenya', 'load priority', 'load control', 'power rationing'],
    summary: 'Implementing load shedding and priority control systems.',
    content: [
      { heading: 'Load Shedding Purpose', paragraphs: ['Automatically removes non-critical loads during overload.', 'Prevents total generator shutdown.', 'Maintains power to critical equipment.', 'Common in standby applications.'] },
      { heading: 'Implementation', paragraphs: ['Identify and categorize loads by priority.', 'Wire loads through controlled breakers or contactors.', 'Controller monitors load and sheds when threshold exceeded.', 'Restores loads when capacity available.'] },
      { heading: 'Priority Levels', paragraphs: ['Critical: life safety, essential systems - never shed.', 'Priority: important equipment - shed last.', 'Non-critical: comfort loads - shed first.', 'Document and communicate load priorities.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Overload'],
    relatedContent: ['LOAD_001', 'CTRL_001'],
    tools: ['Load controller', 'Current transformers'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'LOAD_005',
    category: 'load_management',
    subcategory: 'efficiency',
    title: 'Generator Loading for Optimal Efficiency',
    slug: 'generator-loading-efficiency-kenya',
    keywords: ['generator efficiency Kenya', 'fuel efficiency', 'optimal loading', 'fuel consumption'],
    summary: 'Operating generators at optimal load for fuel efficiency.',
    content: [
      { heading: 'Efficiency vs Loading', paragraphs: ['Generator efficiency varies with load.', 'Peak efficiency typically at 75-80% load.', 'Very light loads (<30%) are inefficient.', 'Overloading reduces life and increases wear.'] },
      { heading: 'Light Load Problems', paragraphs: ['Wet stacking from incomplete combustion.', 'Carbon buildup on valves and injectors.', 'Poor fuel economy.', 'Accelerated lubricant degradation.'] },
      { heading: 'Optimization Strategies', paragraphs: ['Right-size generator for actual loads.', 'Use multiple smaller units for varying loads.', 'Load bank exercise if sustained light loading.', 'Monitor fuel consumption per kWh.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Under Load', 'Wet Stacking'],
    relatedContent: ['LOAD_001', 'ENG_001'],
    tools: ['Fuel flow meter', 'Power meter'],
    lastUpdated: '2024-03-15'
  }
];

export const LOAD_MANAGEMENT_CONTENT_COUNT = LOAD_MANAGEMENT_CONTENT.length;
