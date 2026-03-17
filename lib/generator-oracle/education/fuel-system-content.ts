/**
 * Fuel System Educational Content
 * Fuel delivery, filtration, injection, and contamination
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const FUEL_SYSTEM_CONTENT: EducationalContent[] = [
  {
    id: 'FUEL_001',
    category: 'fuel_system',
    subcategory: 'fundamentals',
    title: 'Diesel Fuel System Complete Overview',
    slug: 'diesel-fuel-system-overview-kenya',
    keywords: ['diesel fuel system Kenya', 'fuel delivery', 'generator fuel system', 'diesel fuel flow'],
    summary: 'Comprehensive overview of diesel fuel system components, flow path, and operating principles.',
    content: [
      {
        heading: 'Fuel System Components',
        paragraphs: [
          'The diesel fuel system delivers precisely metered quantities of clean fuel to the engine at high pressure and correct timing.',
          'Components include storage tank, transfer pump, filtration system, injection pump, injection lines, and injector nozzles.',
          'System reliability directly affects generator dependability. Fuel quality in Kenya requires particular attention.'
        ]
      },
      {
        heading: 'Low Pressure Circuit',
        paragraphs: [
          'The low pressure circuit moves fuel from tank to injection pump inlet.',
          'Transfer pumps may be mechanical (engine-driven) or electric (for priming).',
          'Fuel filtration removes water and particles before reaching high-pressure components.'
        ]
      },
      {
        heading: 'High Pressure Circuit',
        paragraphs: [
          'High pressure circuit includes injection pump, lines, and injector nozzles.',
          'Traditional systems use mechanical injection pumps. Modern systems may use common rail.',
          'Injection pressures range from 150-2000+ bar depending on system type.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Fuel System Fault', 'Low Fuel Pressure'],
    relatedContent: ['FUEL_002', 'INJ_001'],
    tools: ['Fuel pressure gauge', 'Flow meter'],
    safetyWarnings: ['High pressure diesel injection is extremely dangerous'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_002',
    category: 'fuel_system',
    subcategory: 'filtration',
    title: 'Fuel Filtration Systems and Water Separation',
    slug: 'fuel-filtration-water-separation-kenya',
    keywords: ['fuel filter Kenya', 'water separator', 'fuel filtration', 'diesel filter'],
    summary: 'Understanding fuel filtration systems including water separators for clean fuel delivery.',
    content: [
      {
        heading: 'Filtration Importance',
        paragraphs: [
          'Diesel injection components require extremely clean fuel. Particles as small as 5 microns can damage injectors.',
          'Multi-stage filtration progressively removes contaminants. Primary filters catch larger debris, secondary filters provide fine filtration.',
          'In Kenya conditions, filtration is critical due to variable fuel quality from different suppliers.'
        ]
      },
      {
        heading: 'Water Separation',
        paragraphs: [
          'Water in diesel causes injector damage, corrosion, and poor combustion.',
          'Water separators use coalescing media that causes small droplets to combine and settle.',
          'Regular draining of water collection bowls prevents accumulation.'
        ]
      },
      {
        heading: 'Filter Service',
        paragraphs: [
          'Replace filters at recommended intervals - more frequently in dusty conditions.',
          'Pre-fill new filters with clean diesel before installation.',
          'Bleed fuel system after filter change to remove air.'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fuel Filter Restricted', 'Water in Fuel'],
    relatedContent: ['FUEL_001', 'FUEL_003'],
    tools: ['Filter wrench', 'Clean diesel', 'Drain container'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_003',
    category: 'fuel_system',
    subcategory: 'bleeding',
    title: 'Fuel System Bleeding and Priming Procedures',
    slug: 'fuel-system-bleeding-priming-kenya',
    keywords: ['fuel bleeding Kenya', 'diesel priming', 'air in fuel', 'fuel system bleed'],
    summary: 'Step-by-step procedures for bleeding air from diesel fuel systems.',
    content: [
      {
        heading: 'When Bleeding is Required',
        paragraphs: [
          'Air enters fuel system when running out of fuel, changing filters, or after any system opening.',
          'Air in the system prevents proper fuel delivery, causing no-start or rough running.',
          'Complete bleeding is essential for reliable operation.'
        ]
      },
      {
        heading: 'Bleeding Procedure',
        paragraphs: [
          'Locate bleed points on fuel filter housing and injection pump inlet.',
          'Open bleed screw slightly. Operate hand priming pump or electric lift pump.',
          'Continue pumping until bubble-free fuel flows. Tighten bleed screw.',
          'Move to next bleed point in sequence toward injectors.'
        ]
      },
      {
        heading: 'Bleeding Without Hand Pump',
        paragraphs: [
          'Some systems use electric lift pumps that prime automatically.',
          'Crank engine in short bursts (10 seconds max) to draw fuel through.',
          'Loosen injector lines at injector end, crank until fuel appears, retighten.'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'repair',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fail to Start', 'Air in Fuel', 'Fuel System Fault'],
    relatedContent: ['FUEL_002', 'FUEL_001'],
    tools: ['Wrenches', 'Rags', 'Container for fuel'],
    safetyWarnings: ['Fire hazard - clean spilled fuel immediately'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_004',
    category: 'fuel_system',
    subcategory: 'contamination',
    title: 'Diesel Fuel Contamination Prevention and Treatment',
    slug: 'diesel-fuel-contamination-kenya',
    keywords: ['diesel contamination Kenya', 'water in diesel', 'diesel bug', 'fuel treatment'],
    summary: 'Identifying, preventing, and treating common diesel fuel contamination problems.',
    content: [
      {
        heading: 'Contamination Types',
        paragraphs: [
          'Water contamination causes corrosion and injector damage. Enters through condensation or poor handling.',
          'Particulate contamination includes dirt, rust, and debris. Damages injection components.',
          'Microbial growth (diesel bug) creates sludge that blocks filters. Grows at water/fuel interface.'
        ]
      },
      {
        heading: 'Prevention',
        paragraphs: [
          'Buy fuel from reputable suppliers. Avoid suspicious or discount sources.',
          'Keep tanks full to minimize condensation space.',
          'Drain water from tanks and filters regularly.',
          'Use biocide additives to prevent microbial growth in stored fuel.'
        ]
      },
      {
        heading: 'Treatment',
        paragraphs: [
          'Minor water contamination: drain and filter fuel, replace filters.',
          'Microbial contamination: treat with biocide, polish fuel, clean tank.',
          'Severe contamination: drain tank completely, clean, refill with fresh fuel.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Water in Fuel', 'Fuel Contaminated', 'Filter Blocked'],
    relatedContent: ['FUEL_002', 'FUEL_001'],
    tools: ['Fuel test kit', 'Biocide treatment', 'Fuel polishing equipment'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_005',
    category: 'fuel_system',
    subcategory: 'transfer_pump',
    title: 'Fuel Transfer Pump Diagnosis and Service',
    slug: 'fuel-transfer-pump-service-kenya',
    keywords: ['fuel pump Kenya', 'transfer pump', 'lift pump', 'fuel pump diagnosis'],
    summary: 'Diagnosing and servicing fuel transfer pumps for reliable fuel delivery.',
    content: [
      {
        heading: 'Transfer Pump Types',
        paragraphs: [
          'Mechanical pumps are driven by the engine camshaft or gear train.',
          'Electric pumps operate independently, providing fuel before engine starts.',
          'Some systems use both for priming (electric) and running (mechanical).'
        ]
      },
      {
        heading: 'Diagnosis',
        paragraphs: [
          'Check output pressure at injection pump inlet. Typical specification: 0.5-3 bar.',
          'Check flow rate by measuring fuel delivered in set time.',
          'Electric pump: verify power supply and listen for operation.'
        ]
      },
      {
        heading: 'Common Problems',
        paragraphs: [
          'Diaphragm failure (mechanical pumps) - no output, possible fuel in crankcase.',
          'Worn vanes (rotary pumps) - reduced pressure and flow.',
          'Failed check valves - fuel drains back causing hard starting.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Fuel Pressure', 'Fuel Pump Fault'],
    relatedContent: ['FUEL_001', 'FUEL_003'],
    tools: ['Fuel pressure gauge', 'Flow meter'],
    partsPageLink: '/parts/fuel-system',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_006',
    category: 'fuel_system',
    subcategory: 'lines',
    title: 'Fuel Line Inspection and Replacement',
    slug: 'fuel-line-inspection-replacement-kenya',
    keywords: ['fuel line Kenya', 'fuel hose', 'injection line', 'fuel pipe'],
    summary: 'Inspecting and replacing fuel lines to prevent leaks and maintain system integrity.',
    content: [
      {
        heading: 'Fuel Line Types',
        paragraphs: [
          'Low pressure lines use rubber or reinforced hoses. Flexible for vibration isolation.',
          'High pressure lines are steel tubes rated for extreme pressure. No flexibility.',
          'Return lines carry excess fuel back to tank at low pressure.'
        ]
      },
      {
        heading: 'Inspection Points',
        paragraphs: [
          'Check rubber hoses for cracks, swelling, or softening.',
          'Inspect steel lines for rust, kinks, or chafing damage.',
          'Verify all connections are secure with no weeping.'
        ]
      },
      {
        heading: 'Replacement Procedures',
        paragraphs: [
          'Use only correct specification replacement lines.',
          'Route lines away from heat sources and moving parts.',
          'Secure lines properly to prevent vibration damage.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fuel Leak', 'Air in Fuel'],
    relatedContent: ['FUEL_001', 'FUEL_003'],
    tools: ['Line wrenches', 'New lines', 'Cable ties'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_007',
    category: 'fuel_system',
    subcategory: 'tank',
    title: 'Fuel Tank Maintenance and Cleaning',
    slug: 'fuel-tank-maintenance-cleaning-kenya',
    keywords: ['fuel tank Kenya', 'tank cleaning', 'fuel storage', 'tank maintenance'],
    summary: 'Maintaining fuel tanks to ensure clean fuel supply and prevent contamination.',
    content: [
      {
        heading: 'Tank Design Considerations',
        paragraphs: [
          'Properly designed tanks include fill/vent provisions, low point drain, and return fuel inlet positioning.',
          'Tank material (steel or plastic) affects maintenance requirements.',
          'Baffles prevent fuel sloshing but can trap sediment.'
        ]
      },
      {
        heading: 'Regular Maintenance',
        paragraphs: [
          'Drain water from tank low point regularly.',
          'Inspect fill cap seal for damage that allows water entry.',
          'Check vent for blockage that could cause vacuum or pressure.'
        ]
      },
      {
        heading: 'Tank Cleaning',
        paragraphs: [
          'Complete cleaning may be needed if contamination is severe.',
          'Drain tank completely and remove sediment.',
          'Inspect interior for rust (steel tanks) and treat if necessary.',
          'Refill with fresh, clean fuel.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'maintenance',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Water in Fuel', 'Fuel Contaminated'],
    relatedContent: ['FUEL_004', 'FUEL_002'],
    tools: ['Drain container', 'Cleaning equipment', 'Tank treatment'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_008',
    category: 'fuel_system',
    subcategory: 'solenoid',
    title: 'Fuel Shutoff Solenoid Diagnosis and Replacement',
    slug: 'fuel-shutoff-solenoid-kenya',
    keywords: ['fuel solenoid Kenya', 'shutoff solenoid', 'stop solenoid', 'fuel valve'],
    summary: 'Diagnosing and replacing fuel shutoff solenoids for reliable starting and stopping.',
    content: [
      {
        heading: 'Solenoid Function',
        paragraphs: [
          'The fuel shutoff solenoid controls fuel flow to enable engine starting and stopping.',
          'Energize-to-run types require power to allow fuel flow.',
          'Energize-to-stop types require power pulse to shut off fuel.'
        ]
      },
      {
        heading: 'Diagnosis',
        paragraphs: [
          'No start: check power supply to solenoid when key is on.',
          'Wont stop: verify solenoid receives stop signal. Check for mechanical binding.',
          'Listen/feel for solenoid operation when commands are given.'
        ]
      },
      {
        heading: 'Replacement',
        paragraphs: [
          'Verify replacement matches original specification.',
          'Note wire connections before removal.',
          'Install with new sealing washers if applicable.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fail to Start', 'Wont Stop', 'Fuel Solenoid Fault'],
    relatedContent: ['ECM_008', 'CTRL_008'],
    tools: ['Multimeter', 'Wrenches'],
    partsPageLink: '/parts/fuel-system',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_009',
    category: 'fuel_system',
    subcategory: 'quality',
    title: 'Diesel Fuel Quality Standards in Kenya',
    slug: 'diesel-fuel-quality-standards-kenya',
    keywords: ['diesel quality Kenya', 'fuel standards', 'KEBS diesel', 'fuel testing'],
    summary: 'Understanding diesel fuel quality requirements and testing for generator applications.',
    content: [
      {
        heading: 'Kenya Fuel Standards',
        paragraphs: [
          'Kenya Bureau of Standards (KEBS) specifies diesel fuel requirements.',
          'Sulfur content limits have progressively tightened for emission reduction.',
          'Cetane number requirements affect cold starting and combustion quality.'
        ]
      },
      {
        heading: 'Quality Parameters',
        paragraphs: [
          'Cetane number indicates ignition quality. Higher is better for starting.',
          'Viscosity affects injector spray pattern and lubrication.',
          'Water and sediment content must be minimal.'
        ]
      },
      {
        heading: 'Field Testing',
        paragraphs: [
          'Visual inspection: clear fuel without cloudiness or sediment.',
          'Water detection: water paste changes color when water present.',
          'Laboratory testing available for detailed analysis.'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Fuel Quality Fault'],
    relatedContent: ['FUEL_004', 'FUEL_001'],
    tools: ['Water paste', 'Sample container', 'Visual inspection'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'FUEL_010',
    category: 'fuel_system',
    subcategory: 'troubleshooting',
    title: 'Fuel System Troubleshooting Flowchart',
    slug: 'fuel-system-troubleshooting-flowchart-kenya',
    keywords: ['fuel troubleshooting Kenya', 'fuel diagnosis', 'fuel system flowchart'],
    summary: 'Systematic approach to diagnosing common fuel system problems.',
    content: [
      {
        heading: 'No Start - Fuel Related',
        paragraphs: [
          'Check fuel level - obvious but often overlooked.',
          'Verify fuel reaches injection pump - crack line at pump inlet.',
          'Check for air in system - bubbles in clear line section.',
          'Verify shutoff solenoid operation.'
        ]
      },
      {
        heading: 'Rough Running',
        paragraphs: [
          'Check for air leaks in suction lines.',
          'Inspect fuel filters for restriction.',
          'Verify fuel quality - water or contamination.',
          'Check injector balance.'
        ]
      },
      {
        heading: 'Loss of Power',
        paragraphs: [
          'Verify fuel supply pressure and flow.',
          'Check for restricted filters.',
          'Inspect injection timing.',
          'Check turbo boost if applicable.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Fail to Start', 'Low Power', 'Engine Rough'],
    relatedContent: ['FUEL_001', 'FUEL_003', 'INJ_001'],
    tools: ['Pressure gauge', 'Clear hose', 'Multimeter'],
    lastUpdated: '2024-03-15'
  }
];

export const FUEL_SYSTEM_CONTENT_COUNT = FUEL_SYSTEM_CONTENT.length;
