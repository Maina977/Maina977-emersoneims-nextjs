/**
 * EMERSONEIMS SOLAR MAINTENANCE & REPAIR GUIDES
 *
 * Comprehensive step-by-step guides for:
 * - Solar panel repair and maintenance
 * - Inverter troubleshooting and repair
 * - Battery maintenance and reconditioning
 * - Wiring and cable termination
 * - Fault code clearing
 * - System optimization
 *
 * This is the Solar Solution School - university-grade technical content
 */

// ==================== PANEL MAINTENANCE GUIDES ====================
export interface MaintenanceGuide {
  id: string;
  title: string;
  category: 'Panel' | 'Inverter' | 'Battery' | 'Wiring' | 'System' | 'Controller';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  tools: string[];
  safetyWarnings: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    image?: string;
    tips?: string[];
    warnings?: string[];
  }[];
  troubleshooting?: {
    symptom: string;
    causes: string[];
    solutions: string[];
  }[];
}

export const PANEL_MAINTENANCE_GUIDES: MaintenanceGuide[] = [
  {
    id: 'panel-cleaning',
    title: 'Solar Panel Cleaning - Proper Technique',
    category: 'Panel',
    difficulty: 'Basic',
    estimatedTime: '30-60 minutes',
    tools: [
      'Soft brush (non-abrasive)',
      'Squeegee with soft rubber blade',
      'Garden hose or pressure washer (low pressure)',
      'Bucket with mild soap solution',
      'Safety harness (for roof installations)',
      'Ladder with stabilizers',
      'Microfiber cloths'
    ],
    safetyWarnings: [
      'NEVER clean panels during peak sun hours (10AM-4PM) - thermal shock risk',
      'NEVER use abrasive cleaners or scrub brushes',
      'ALWAYS use fall protection on rooftops',
      'NEVER step on panels - they can crack',
      'Check for damaged cables before using water'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Schedule Cleaning Time',
        description: 'Clean panels early morning (6-9 AM) or late evening when panels are cool. Cleaning hot panels with cold water causes thermal shock and microcracks.',
        tips: ['Cloudy days are ideal', 'After dust storms, clean within 48 hours'],
        warnings: ['Hot panels + cold water = thermal shock = microcracks']
      },
      {
        stepNumber: 2,
        title: 'Visual Inspection',
        description: 'Before cleaning, inspect panels for physical damage, hotspots, discoloration, or burnt areas. Check all cables and connectors are secure.',
        tips: ['Document any damage with photos', 'Check for bird droppings, tree sap'],
      },
      {
        stepNumber: 3,
        title: 'Rinse with Water',
        description: 'Use garden hose or low-pressure washer to rinse loose dust and debris. Start from top and work down. Avoid high-pressure directly on panel edges.',
        tips: ['Use deionized water if available to prevent water spots', 'Rainwater is ideal'],
        warnings: ['Never use high-pressure jet on connectors or junction boxes']
      },
      {
        stepNumber: 4,
        title: 'Apply Cleaning Solution',
        description: 'Mix mild dish soap (1 tablespoon per gallon) with water. Apply with soft brush in gentle circular motions. Cover entire panel surface.',
        tips: ['Commercial solar cleaning solutions work best', 'Never use ammonia or alcohol-based cleaners'],
      },
      {
        stepNumber: 5,
        title: 'Gentle Scrubbing',
        description: 'Use soft brush to remove stubborn dirt, bird droppings, or tree sap. For dried bird droppings, soak for 5-10 minutes before scrubbing.',
        warnings: ['Never use abrasive pads or steel wool', 'Hard scrubbing scratches anti-reflective coating']
      },
      {
        stepNumber: 6,
        title: 'Final Rinse',
        description: 'Thoroughly rinse all soap residue from panels. Soap film reduces efficiency and can cause hotspots.',
        tips: ['Rinse from top to bottom', 'Ensure no puddles remain']
      },
      {
        stepNumber: 7,
        title: 'Dry and Inspect',
        description: 'Use squeegee with soft rubber blade to remove water, preventing mineral deposits. Final inspection for any missed spots or damage.',
        tips: ['Let air dry if possible', 'Check production increase after cleaning']
      }
    ],
    troubleshooting: [
      {
        symptom: 'Stubborn stains that won\'t come off',
        causes: ['Baked-on bird droppings', 'Tree sap residue', 'Industrial pollution'],
        solutions: ['Soak with warm water for 20 minutes', 'Use isopropyl alcohol (sparingly) on specific spots', 'Consider professional cleaning service']
      },
      {
        symptom: 'Water spots after cleaning',
        causes: ['Hard water with high mineral content', 'Soap residue'],
        solutions: ['Use deionized or distilled water', 'Add vinegar to rinse water (1:10 ratio)', 'Wipe dry with microfiber cloth']
      }
    ]
  },
  {
    id: 'panel-hotspot-repair',
    title: 'Hotspot Detection and Repair',
    category: 'Panel',
    difficulty: 'Advanced',
    estimatedTime: '2-4 hours',
    tools: [
      'Thermal imaging camera (FLIR or similar)',
      'Multimeter',
      'MC4 disconnect tool',
      'Spare bypass diodes',
      'Soldering iron (if repairing)',
      'Heat shrink tubing',
      'Safety glasses',
      'Insulated gloves'
    ],
    safetyWarnings: [
      'Panels produce dangerous DC voltage even in low light',
      'Cover panels with opaque material before working',
      'Wear arc-flash rated PPE for high-voltage systems',
      'Never work alone on rooftop systems'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Thermal Imaging Scan',
        description: 'Use thermal camera to scan all panels during peak production (11AM-2PM). Hotspots appear as bright areas significantly warmer than surrounding cells (>10°C difference).',
        tips: ['Image from multiple angles', 'Document exact cell locations'],
      },
      {
        stepNumber: 2,
        title: 'Identify Hotspot Cause',
        description: 'Hotspots are caused by: 1) Shading (partial), 2) Cell cracks, 3) Failed bypass diode, 4) Dirty cells, 5) Manufacturing defect. Check for visible damage.',
        tips: ['Clean panel first to rule out dirt', 'Check for nearby shading objects'],
      },
      {
        stepNumber: 3,
        title: 'Test Bypass Diodes',
        description: 'Disconnect panel from string. Set multimeter to diode mode. Test each bypass diode (typically 3 per panel). Forward voltage should be 0.4-0.7V. Open or shorted diodes need replacement.',
        tips: ['Junction box on panel back contains diodes', 'Mark failed diodes clearly'],
        warnings: ['Diodes can be hot after operation - wait 30 minutes']
      },
      {
        stepNumber: 4,
        title: 'Replace Failed Bypass Diode',
        description: 'Open junction box (usually weatherproof screws). Unsolder failed diode. Install replacement diode with correct polarity. Resolder connections. Test with multimeter.',
        tips: ['Use Schottky diodes rated for panel current', 'Apply thermal paste for heat dissipation'],
        warnings: ['Incorrect polarity destroys diode and panel']
      },
      {
        stepNumber: 5,
        title: 'Seal and Test',
        description: 'Apply silicone sealant to junction box. Reinstall cover. Reconnect panel to string. Monitor temperature with thermal camera over next few days.',
        tips: ['Use outdoor-rated silicone', 'Document repair for warranty'],
      }
    ],
    troubleshooting: [
      {
        symptom: 'Hotspot returns after repair',
        causes: ['Cell crack (not diode)', 'Multiple failed cells', 'Internal connection failure'],
        solutions: ['Replace panel under warranty', 'Move panel to less critical position', 'Consider panel replacement']
      },
      {
        symptom: 'Entire panel running hot',
        causes: ['Poor ventilation', 'Wrong tilt angle', 'Undersized cables'],
        solutions: ['Improve air circulation beneath panels', 'Check cable sizing', 'Verify system design']
      }
    ]
  },
  {
    id: 'panel-string-pairing',
    title: 'Solar Panel String Configuration & Pairing',
    category: 'Panel',
    difficulty: 'Intermediate',
    estimatedTime: '1-2 hours',
    tools: [
      'Multimeter',
      'Panel datasheet/specifications',
      'Cable labels/markers',
      'MC4 connectors',
      'MC4 crimping tool'
    ],
    safetyWarnings: [
      'String voltages can exceed 600V DC - lethal!',
      'Cover panels before connecting',
      'Verify inverter MPPT voltage range before configuration'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Understand String Configuration',
        description: 'Panels in SERIES increase voltage. Panels in PARALLEL increase current. Calculate: String Voltage = Vmp × Number of panels. String Current = Imp × parallel strings.',
        tips: ['Series is preferred for long cable runs', 'Never mix panel wattages in same string'],
      },
      {
        stepNumber: 2,
        title: 'Check MPPT Voltage Range',
        description: 'Your inverter/controller has an MPPT range (e.g., 100-500V). String Vmp must be within this range. Also check max Voc (cold conditions increase Voc by ~15%).',
        tips: ['Calculate cold weather Voc: Voc × 1.15', 'Stay 10% below max MPPT voltage'],
        warnings: ['Exceeding max voltage destroys inverter - no warranty!']
      },
      {
        stepNumber: 3,
        title: 'Match Panels for Strings',
        description: 'Group panels with similar Vmp and Imp (within 2%). Panels from same manufacturing batch work best. Never mix monocrystalline with polycrystalline.',
        tips: ['Check flash test data on panel label', 'Identical model numbers are ideal'],
      },
      {
        stepNumber: 4,
        title: 'Calculate String Size',
        description: 'For inverter MPPT range 100-500V with 545W panels (Vmp=41.8V, Voc=49.65V): Min panels = 100÷41.8 = 3, Max panels = 500÷(49.65×1.15) = 8. Use 6-8 panels per string.',
      },
      {
        stepNumber: 5,
        title: 'Wire String in Series',
        description: 'Connect positive of Panel 1 to negative of Panel 2, and so on. Final string has open positive (from last panel) and open negative (from first panel) going to inverter.',
        tips: ['Label each string clearly', 'Use color-coded cables: Red=Positive, Black=Negative'],
        warnings: ['Double-check polarity before connecting to inverter']
      },
      {
        stepNumber: 6,
        title: 'Verify String Voltage',
        description: 'Measure open-circuit voltage (Voc) of completed string. Should equal: Single panel Voc × number of panels ± 2%.',
        tips: ['Test at similar irradiance for comparison', 'Document readings for future reference'],
      }
    ]
  }
];

// ==================== INVERTER REPAIR GUIDES ====================
export const INVERTER_REPAIR_GUIDES: MaintenanceGuide[] = [
  {
    id: 'inverter-fault-codes',
    title: 'Inverter Fault Code Clearing & Diagnostics',
    category: 'Inverter',
    difficulty: 'Intermediate',
    estimatedTime: '30-60 minutes',
    tools: [
      'Inverter manual/app',
      'Multimeter',
      'WiFi/Bluetooth connection',
      'Screwdriver set',
      'Safety gloves'
    ],
    safetyWarnings: [
      'Disconnect DC and AC before opening inverter',
      'Wait 5 minutes for capacitors to discharge',
      'Never reset faults repeatedly without investigation'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Read Fault Code',
        description: 'Access inverter display or app. Note exact fault code and timestamp. Common codes: Grid fault, Isolation fault, Overvoltage, Overcurrent, Overtemperature.',
        tips: ['Take photo of fault screen', 'Check if fault is recurring'],
      },
      {
        stepNumber: 2,
        title: 'Identify Root Cause',
        description: 'Consult inverter manual for fault code meaning. Different brands use different codes. Document grid voltage, DC voltage, and temperatures at time of fault.',
      },
      {
        stepNumber: 3,
        title: 'Address Root Cause',
        description: 'Fix underlying issue before clearing fault. Grid faults: check utility connection. Isolation: check cable insulation. Overvoltage: reduce string size or add panels in parallel.',
        warnings: ['Clearing without fixing cause leads to repeated faults and equipment damage']
      },
      {
        stepNumber: 4,
        title: 'Clear Fault (Method 1: Display)',
        description: 'Navigate to Settings > Fault History > Clear/Reset. Some inverters require password (often 0000 or installer code).',
        tips: ['Default passwords: Sungrow=0001, Deye=0000, Growatt=growatt'],
      },
      {
        stepNumber: 5,
        title: 'Clear Fault (Method 2: Power Cycle)',
        description: 'Turn off AC breaker, then DC isolator. Wait 5 minutes. Turn on DC first, then AC. Inverter should restart without fault if issue resolved.',
        warnings: ['Always DC first when turning ON, AC first when turning OFF']
      },
      {
        stepNumber: 6,
        title: 'Verify Normal Operation',
        description: 'Monitor inverter for 24 hours. Check production matches expected values. If fault returns, deeper investigation needed.',
      }
    ],
    troubleshooting: [
      {
        symptom: 'Fault returns after clearing',
        causes: ['Root cause not addressed', 'Intermittent grid issues', 'Failing component'],
        solutions: ['Install grid analyzer', 'Check DC cable insulation with megger', 'Contact manufacturer support']
      },
      {
        symptom: 'Cannot clear fault - locked',
        causes: ['Critical fault requiring manufacturer intervention', 'Tamper protection active'],
        solutions: ['Contact installer or manufacturer', 'May need firmware update', 'Check warranty status']
      }
    ]
  },
  {
    id: 'inverter-fan-replacement',
    title: 'Inverter Cooling Fan Replacement',
    category: 'Inverter',
    difficulty: 'Advanced',
    estimatedTime: '1-2 hours',
    tools: [
      'Screwdriver set (Phillips, Torx)',
      'Replacement fan (exact match)',
      'Thermal paste',
      'Compressed air',
      'Multimeter',
      'ESD wrist strap'
    ],
    safetyWarnings: [
      'DISCONNECT ALL POWER - AC and DC',
      'Wait 10 minutes for capacitor discharge',
      'Ground yourself - ESD destroys electronics',
      'This may void warranty - check first'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Fan Type',
        description: 'Before opening, order exact replacement fan. Note: size (e.g., 80mm, 120mm), voltage (12V or 24V DC), connector type, and airflow direction.',
        tips: ['Take photo of fan label before removal', 'Order from manufacturer if possible'],
      },
      {
        stepNumber: 2,
        title: 'Power Down Completely',
        description: 'Turn OFF AC breaker. Turn OFF DC isolator. Disconnect DC cables at inverter. Wait 10 minutes for capacitor discharge. Verify 0V with multimeter.',
        warnings: ['Capacitors hold lethal charge for several minutes']
      },
      {
        stepNumber: 3,
        title: 'Open Inverter Housing',
        description: 'Remove cover screws (note positions - different lengths). Carefully remove cover. Note cable routing before disconnecting.',
        tips: ['Take photos at each step', 'Keep screws organized'],
      },
      {
        stepNumber: 4,
        title: 'Clean Interior',
        description: 'Use compressed air to blow out dust from heatsinks, fans, and PCB. Excessive dust is often the root cause of overheating.',
        tips: ['Clean outdoors to avoid dust settling back', 'Wear mask - dust may be conductive'],
      },
      {
        stepNumber: 5,
        title: 'Remove Failed Fan',
        description: 'Unscrew fan mounting (usually 4 screws). Disconnect fan cable from PCB. Note polarity (red=positive). Remove old fan.',
        tips: ['Check if fan spins freely - seized bearing is common failure'],
      },
      {
        stepNumber: 6,
        title: 'Install New Fan',
        description: 'Mount new fan with correct airflow direction (arrow on frame). Connect cable matching polarity. Secure mounting screws.',
        warnings: ['Reversed airflow reduces cooling by 50%']
      },
      {
        stepNumber: 7,
        title: 'Reassemble and Test',
        description: 'Reinstall cover. Reconnect DC, then AC. Power on. Verify fan spins on startup. Monitor temperatures for 24 hours.',
      }
    ]
  },
  {
    id: 'inverter-capacitor-check',
    title: 'DC Link Capacitor Inspection',
    category: 'Inverter',
    difficulty: 'Expert',
    estimatedTime: '2-3 hours',
    tools: [
      'ESR meter',
      'Capacitance meter',
      'High-voltage probe',
      'Discharge resistor',
      'Replacement capacitors',
      'Soldering station',
      'ESD protection'
    ],
    safetyWarnings: [
      'EXTREME DANGER - Capacitors hold lethal charge',
      'Use high-voltage discharge procedure',
      'Expert-only repair - improper handling causes explosion',
      'Work in well-ventilated area - capacitor failure releases toxic gas'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Safety Discharge Procedure',
        description: 'After full power down and 15-minute wait, use discharge resistor (100Ω, 50W minimum) connected across capacitor terminals. Monitor voltage decrease to <50V before touching.',
        warnings: ['NEVER SHORT CAPACITORS - causes explosion']
      },
      {
        stepNumber: 2,
        title: 'Visual Inspection',
        description: 'Look for: Bulging tops (pressure relief valve), Leaking electrolyte (brown residue), Discoloration, Burnt smell. Any of these = replace immediately.',
        tips: ['Compare to known good capacitor', 'Document findings with photos'],
      },
      {
        stepNumber: 3,
        title: 'ESR Testing',
        description: 'With capacitor discharged, measure ESR (Equivalent Series Resistance). Compare to datasheet spec. ESR >2x rated value = failing capacitor.',
        tips: ['ESR increases with age and heat exposure'],
      },
      {
        stepNumber: 4,
        title: 'Capacitance Test',
        description: 'Measure actual capacitance vs rated value. Capacitance <80% of rated = replace. Match replacement exactly: voltage rating, capacitance, temperature rating, size.',
        warnings: ['Never use lower voltage rating - explosion risk']
      },
      {
        stepNumber: 5,
        title: 'Replacement Procedure',
        description: 'Desolder failed capacitor noting polarity. Clean pads. Install new capacitor with correct polarity. Use lead-free solder. Allow cooling before testing.',
        warnings: ['Reversed polarity = immediate explosion']
      }
    ]
  }
];

// ==================== BATTERY MAINTENANCE GUIDES ====================
export const BATTERY_MAINTENANCE_GUIDES: MaintenanceGuide[] = [
  {
    id: 'lithium-battery-balancing',
    title: 'Lithium Battery Cell Balancing',
    category: 'Battery',
    difficulty: 'Advanced',
    estimatedTime: '4-8 hours (automated)',
    tools: [
      'BMS monitoring software/app',
      'Multimeter',
      'Battery datasheet',
      'Temperature sensor'
    ],
    safetyWarnings: [
      'Never bypass BMS safety features',
      'Monitor temperature during balancing',
      'Stop if any cell exceeds 60°C'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Check Cell Voltage Imbalance',
        description: 'Access BMS monitoring app. Record voltage of each cell. Cells should be within 50mV (0.05V) of each other. Larger differences indicate imbalance.',
        tips: ['Best to check when battery is at 50% SOC', 'Document readings regularly'],
      },
      {
        stepNumber: 2,
        title: 'Initiate Balancing Cycle',
        description: 'Charge battery to 100% and hold at float voltage for 4-8 hours. BMS will actively balance cells during this phase, dissipating energy from higher cells.',
        tips: ['Run during cool evening hours', 'Ensure good ventilation'],
      },
      {
        stepNumber: 3,
        title: 'Monitor Balancing Progress',
        description: 'Check cell voltages hourly. Cells should converge toward equal voltage. If imbalance persists after 8 hours, cell may be failing.',
        warnings: ['Hot cells during balance may indicate internal short']
      },
      {
        stepNumber: 4,
        title: 'Verify Balance Complete',
        description: 'After balancing, discharge to 20% then charge to 80%. Check cell voltages. All should be within 20mV. Battery is balanced when consistent over 3 cycles.',
      }
    ],
    troubleshooting: [
      {
        symptom: 'One cell always lower than others',
        causes: ['Weak cell', 'Internal resistance higher', 'BMS balancing circuit failed'],
        solutions: ['Mark cell for monitoring', 'If persists, may need cell replacement (warranty claim)', 'Check BMS balancing current']
      },
      {
        symptom: 'Battery shows less capacity than rated',
        causes: ['Imbalanced cells limiting total capacity', 'Cell degradation', 'High temperature history'],
        solutions: ['Full balance cycle', 'Check SOH (State of Health) reading', 'If <80% SOH, consider replacement']
      }
    ]
  },
  {
    id: 'lead-acid-equalization',
    title: 'Lead Acid Battery Equalization Charging',
    category: 'Battery',
    difficulty: 'Intermediate',
    estimatedTime: '4-6 hours',
    tools: [
      'Hydrometer',
      'Distilled water',
      'Battery filler bottle',
      'PPE (goggles, gloves, apron)',
      'Baking soda solution (for spills)',
      'Multimeter'
    ],
    safetyWarnings: [
      'Battery acid causes severe burns',
      'Hydrogen gas is explosive - no sparks near batteries',
      'Work in well-ventilated area',
      'Never lean over battery during charging'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pre-Equalization Check',
        description: 'Check water levels in all cells - add distilled water if plates are exposed. Check specific gravity with hydrometer - readings should be similar (within 0.020).',
        tips: ['Only add water BEFORE charging', 'Record specific gravity of each cell'],
      },
      {
        stepNumber: 2,
        title: 'Configure Equalization Charge',
        description: 'Set charge controller to equalization mode (typically 10-15% above float voltage). For 48V system: normal float ~54V, equalization ~58-60V.',
        warnings: ['Excessive equalization voltage damages batteries permanently']
      },
      {
        stepNumber: 3,
        title: 'Start Equalization',
        description: 'Begin controlled overcharge. Batteries will gas (bubble) - this is normal. Ensure ventilation. Process takes 4-6 hours.',
        tips: ['Best done monthly for cycled batteries', 'Quarterly for standby batteries'],
      },
      {
        stepNumber: 4,
        title: 'Monitor Throughout',
        description: 'Check temperature hourly - stop if any battery exceeds 50°C. Listen for equal bubbling in all cells. Uneven bubbling indicates problem cell.',
        warnings: ['Overheating can cause thermal runaway']
      },
      {
        stepNumber: 5,
        title: 'Post-Equalization',
        description: 'Return charger to normal settings. Allow batteries to cool. Recheck water levels - add distilled water to just below filler well. Test specific gravity - all cells should now be equal (within 0.010).',
        tips: ['Post-equalization specific gravity should be 1.265-1.275 for fully charged'],
      }
    ],
    troubleshooting: [
      {
        symptom: 'One cell never reaches full specific gravity',
        causes: ['Sulfation', 'Shorted cell', 'Damaged plates'],
        solutions: ['Extended equalization (8 hours)', 'If no improvement, cell is failing', 'Consider battery replacement']
      },
      {
        symptom: 'Excessive water consumption',
        causes: ['Overcharging', 'High ambient temperature', 'End of battery life'],
        solutions: ['Check charge voltage settings', 'Improve ventilation', 'May indicate battery replacement needed']
      }
    ]
  },
  {
    id: 'battery-desulfation',
    title: 'Lead Acid Battery Desulfation',
    category: 'Battery',
    difficulty: 'Advanced',
    estimatedTime: '24-72 hours',
    tools: [
      'Pulse desulfator device',
      'Trickle charger',
      'Hydrometer',
      'Multimeter',
      'Temperature sensor'
    ],
    safetyWarnings: [
      'Severely sulfated batteries may not recover',
      'Process generates heat - monitor continuously',
      'Hydrogen gas risk during process'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Assess Sulfation Level',
        description: 'Symptoms: Battery won\'t hold charge, Low specific gravity even when "charged", White crystals visible on plates (if visible), High internal resistance.',
        tips: ['Mild sulfation: recoverable. Severe: may be permanent'],
      },
      {
        stepNumber: 2,
        title: 'Connect Desulfator',
        description: 'Connect pulse desulfator to battery terminals (polarity critical). Device sends high-frequency pulses that break down lead sulfate crystals.',
        warnings: ['Some desulfators generate significant heat']
      },
      {
        stepNumber: 3,
        title: 'Slow Charge Cycle',
        description: 'Apply trickle charge (C/20 rate or less) while desulfator runs. This slow charge combined with pulses gradually dissolves sulfation. Run for 24-72 hours.',
        tips: ['Monitor voltage - should gradually rise', 'If no improvement after 48 hours, battery may be unrecoverable'],
      },
      {
        stepNumber: 4,
        title: 'Test Recovery',
        description: 'Disconnect desulfator. Perform equalization charge. Test specific gravity - should have improved by 0.020-0.050. Load test battery - should hold capacity.',
      },
      {
        stepNumber: 5,
        title: 'Repeat if Necessary',
        description: 'Stubborn sulfation may require multiple cycles. If no improvement after 3 cycles, battery has permanent damage.',
      }
    ]
  }
];

// ==================== WIRING GUIDES ====================
export const WIRING_GUIDES: MaintenanceGuide[] = [
  {
    id: 'mc4-termination',
    title: 'MC4 Connector Termination',
    category: 'Wiring',
    difficulty: 'Intermediate',
    estimatedTime: '10-15 minutes per connector',
    tools: [
      'MC4 connectors (male and female)',
      'MC4 crimping tool (specific)',
      'Wire strippers',
      'Solar cable (4mm² or 6mm²)',
      'Multimeter',
      'MC4 spanner tool'
    ],
    safetyWarnings: [
      'Work with panels covered or at night',
      'Verify polarity before final connection',
      'Use only IP67 rated connectors for outdoor use'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare Cable',
        description: 'Cut cable to required length. Strip 8mm of insulation from end. Do not nick copper strands. Twist strands gently to keep together.',
        tips: ['Use double-insulated solar cable (TÜV certified)', 'Never use standard electrical cable outdoors'],
      },
      {
        stepNumber: 2,
        title: 'Insert Metal Pin',
        description: 'Thread the gland nut and seal onto cable first (easy to forget!). Insert stripped cable into metal crimp pin until conductor is visible through inspection hole.',
        warnings: ['Forgetting gland nut requires starting over']
      },
      {
        stepNumber: 3,
        title: 'Crimp Connection',
        description: 'Place pin in MC4 crimping tool. Crimp firmly twice - once on conductor section, once on insulation grip. Verify crimp is secure with firm pull.',
        tips: ['Good crimp should hold >50N pull force', 'Two crimps minimum'],
      },
      {
        stepNumber: 4,
        title: 'Assemble Connector Body',
        description: 'Insert crimped pin into connector body until it clicks. Pin should not pull out. Thread gland nut and tighten to 2-3Nm.',
        warnings: ['Under-tightened gland = water ingress = fire risk']
      },
      {
        stepNumber: 5,
        title: 'Verify Connection',
        description: 'Set multimeter to continuity. Test from cable end to connector tip. Should show <0.1Ω. Pull test connector - should not separate.',
        tips: ['Test both male and female before connecting'],
      },
      {
        stepNumber: 6,
        title: 'Connect MC4 Pair',
        description: 'Push male into female until click. Connection should be finger-tight only. Use MC4 disconnect tool (not screwdrivers) to separate if needed.',
        warnings: ['Mismatched connector brands can have poor contact']
      }
    ]
  },
  {
    id: 'cable-sizing-calculation',
    title: 'Solar Cable Sizing Calculations',
    category: 'Wiring',
    difficulty: 'Intermediate',
    estimatedTime: '30 minutes',
    tools: [
      'Calculator',
      'Cable specifications table',
      'System specifications',
      'Measuring tape'
    ],
    safetyWarnings: [
      'Undersized cables cause fire',
      'Always size for worst-case (coldest temperature, highest current)',
      'Consider future expansion'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Determine Maximum Current',
        description: 'For DC cables: Current = Panel Isc × 1.25 (safety factor). For AC cables: Current = Inverter rated output current × 1.25.',
        tips: ['Use Isc not Imp for sizing - Isc is worst case'],
      },
      {
        stepNumber: 2,
        title: 'Measure Cable Length',
        description: 'Measure actual route (not straight line). Include: roof penetration, wall runs, inverter location. Double the distance for DC cables (positive and negative).',
        tips: ['Add 10% for routing adjustments'],
      },
      {
        stepNumber: 3,
        title: 'Calculate Voltage Drop',
        description: 'Formula: Vd = (2 × L × I × R) / 1000. Where L=length(m), I=current(A), R=resistance(Ω/km). Voltage drop should be <3% for DC, <2% for AC.',
        tips: ['Lower voltage systems need larger cables for same power'],
      },
      {
        stepNumber: 4,
        title: 'Select Cable Size',
        description: 'Use cable specification table. Select cable where: 1) Current capacity exceeds max current, AND 2) Voltage drop is within limit.',
        tips: ['When in doubt, go one size up'],
      },
      {
        stepNumber: 5,
        title: 'Example Calculation',
        description: 'System: 5kW, 48V battery, 20m cable run. Max current: 5000W ÷ 48V = 104A. For 6mm² cable (resistance 3.08Ω/km): Vd = 2×20×104×3.08/1000 = 12.8V = 26.7% - TOO HIGH! Need 25mm² (0.727Ω/km): Vd = 3.0V = 6.3% - Still marginal. Use 35mm².',
      }
    ]
  },
  {
    id: 'dc-breaker-installation',
    title: 'DC Circuit Breaker & Isolator Installation',
    category: 'Wiring',
    difficulty: 'Advanced',
    estimatedTime: '1-2 hours',
    tools: [
      'DC-rated circuit breaker',
      'DC isolator switch',
      'Screwdrivers',
      'Wire ferrules',
      'Crimping tool',
      'Torque screwdriver',
      'DIN rail'
    ],
    safetyWarnings: [
      'DC arcs do not self-extinguish like AC - use only DC-rated components',
      'Never use AC breakers for DC circuits',
      'Verify voltage and current ratings exceed system specifications'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Select DC-Rated Components',
        description: 'For 500Voc system with 20A: Breaker must be rated ≥500V DC and ≥25A. Isolator rated ≥500V DC. Never use AC breakers - they cannot interrupt DC arc.',
        warnings: ['AC breakers used for DC will weld contacts closed']
      },
      {
        stepNumber: 2,
        title: 'Install DIN Rail',
        description: 'Mount DIN rail in weatherproof enclosure. Ensure adequate spacing between components for heat dissipation.',
        tips: ['Use IP65 enclosure for outdoor installation'],
      },
      {
        stepNumber: 3,
        title: 'Mount Isolator (First in line)',
        description: 'Clip isolator onto DIN rail. This is the main disconnect for maintenance. Wires from solar panels connect to LINE side (top).',
        tips: ['Label clearly: "DANGER - DC DISCONNECT"'],
      },
      {
        stepNumber: 4,
        title: 'Mount Circuit Breaker',
        description: 'Clip breaker after isolator. Load side of isolator connects to line side of breaker. Observe polarity for unipolar breakers.',
        tips: ['Consider surge protection device between isolator and breaker'],
      },
      {
        stepNumber: 5,
        title: 'Terminate Cables',
        description: 'Strip cables 10mm. Install ferrules for stranded wire. Tighten terminals to manufacturer specification (typically 1.2-2.0Nm for small terminals).',
        warnings: ['Loose terminals cause overheating and fires']
      },
      {
        stepNumber: 6,
        title: 'Label and Test',
        description: 'Label all breakers with circuit identification. Test isolator function. Test breaker trip by pressing test button (if equipped).',
      }
    ]
  }
];

// ==================== SYSTEM CONFIGURATION GUIDES ====================
export const SYSTEM_GUIDES: MaintenanceGuide[] = [
  {
    id: 'hybrid-system-commissioning',
    title: 'Hybrid Solar System Commissioning',
    category: 'System',
    difficulty: 'Expert',
    estimatedTime: '4-8 hours',
    tools: [
      'Multimeter',
      'Clamp meter',
      'Commissioning checklist',
      'Laptop with monitoring software',
      'Grid analyzer (optional)',
      'Thermal camera (optional)'
    ],
    safetyWarnings: [
      'Work methodically through each step',
      'Never energize system with faults present',
      'Verify grid isolation before battery/solar connection'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pre-Commissioning Inspection',
        description: 'Visual inspection of all components. Verify: mounting secure, cables properly routed, no damage, labels present, adequate ventilation.',
        tips: ['Use checklist - don\'t rely on memory', 'Take photos for documentation'],
      },
      {
        stepNumber: 2,
        title: 'DC String Verification',
        description: 'With DC isolator OFF, measure Voc of each string. Should match: Panel Voc × number in string ±5%. Check polarity at combiner box.',
        warnings: ['Reversed polarity destroys inverter instantly']
      },
      {
        stepNumber: 3,
        title: 'Insulation Resistance Test',
        description: 'Using megger (insulation tester), test between: Positive to ground, Negative to ground, Positive to Negative. All readings should be >1MΩ for systems <500V.',
        tips: ['Low readings indicate damaged insulation - find and fix before proceeding'],
      },
      {
        stepNumber: 4,
        title: 'Battery Commissioning',
        description: 'Verify battery voltage matches inverter configuration. Check BMS communication. Verify cell balance within specification. Record serial numbers.',
        tips: ['Charge battery to 100% before first use'],
      },
      {
        stepNumber: 5,
        title: 'Grid Connection Verification',
        description: 'With AC breaker OFF, verify grid voltage and frequency at inverter AC input. Should be within inverter operating range (typically 220-240V, 49.5-50.5Hz for Kenya).',
        tips: ['Poor grid quality causes frequent faults'],
      },
      {
        stepNumber: 6,
        title: 'Inverter Power-Up Sequence',
        description: 'Sequence: 1) Turn on battery, 2) Turn on DC isolator, 3) Turn on AC breaker. Wait for inverter to boot and establish grid connection. Monitor for errors.',
        tips: ['Some inverters require specific sequence - check manual'],
      },
      {
        stepNumber: 7,
        title: 'System Testing',
        description: 'Verify: Solar production matches expected (irradiance × array size × 0.8), Battery charging/discharging, Grid export/import working, Backup mode (disconnect grid temporarily).',
      },
      {
        stepNumber: 8,
        title: 'Configure Monitoring',
        description: 'Set up WiFi/4G monitoring. Verify data appears in cloud dashboard. Configure alerts for faults. Provide customer with monitoring access.',
        tips: ['Show customer how to read monitoring app'],
      }
    ]
  },
  {
    id: 'generator-integration',
    title: 'Generator Integration with Solar System',
    category: 'System',
    difficulty: 'Expert',
    estimatedTime: '4-6 hours',
    tools: [
      'ATS (Automatic Transfer Switch) or Smart Generator Input',
      'Generator remote start module',
      'CT (Current Transformer) clamps',
      'Relay modules',
      'Control cables'
    ],
    safetyWarnings: [
      'Never parallel generator with grid without proper synchronization',
      'Generator exhaust must vent outdoors',
      'Fuel systems require proper ventilation'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Determine Integration Method',
        description: 'Options: 1) Smart Generator Input (hybrid inverter feature), 2) External ATS, 3) Manual changeover. Smart Generator Input is preferred for seamless integration.',
        tips: ['Check if your inverter has generator support - most hybrids do'],
      },
      {
        stepNumber: 2,
        title: 'Configure Generator Start Signals',
        description: 'Hybrid inverters provide dry contact output for generator start. Connect to generator auto-start module. Configure: Low battery trigger (e.g., 20% SOC), Grid fail trigger.',
        tips: ['Add time delay (30 seconds) to prevent hunting'],
      },
      {
        stepNumber: 3,
        title: 'Wire Generator to Inverter',
        description: 'Connect generator output to inverter Generator Input (NOT AC input). This allows inverter to charge batteries from generator while also powering loads.',
        warnings: ['Wrong connection can back-feed and damage generator']
      },
      {
        stepNumber: 4,
        title: 'Configure Inverter Generator Settings',
        description: 'Settings: Generator charging current (typically 80% of generator capacity), Charge termination SOC, Generator run time limits, Priority (Solar > Battery > Generator).',
        tips: ['Don\'t run generator at <30% load - causes wet stacking'],
      },
      {
        stepNumber: 5,
        title: 'Test All Scenarios',
        description: 'Test: Grid available (generator should never start), Grid fail + battery low (generator starts), Battery full (generator stops), Solar available (generator not needed).',
      }
    ]
  }
];

// ==================== COMMON FAULT CODES BY BRAND ====================
export interface FaultCode {
  brand: string;
  code: string;
  description: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Critical';
  causes: string[];
  solutions: string[];
}

export const INVERTER_FAULT_CODES: FaultCode[] = [
  // Sungrow
  { brand: 'Sungrow', code: 'F001', description: 'Grid Overvoltage', severity: 'Error', causes: ['Grid voltage >270V', 'Poor grid quality', 'Too many solar systems on circuit'], solutions: ['Wait for grid to normalize', 'Contact utility', 'Install voltage stabilizer'] },
  { brand: 'Sungrow', code: 'F002', description: 'Grid Undervoltage', severity: 'Error', causes: ['Grid voltage <175V', 'Grid overloaded', 'Long distance from transformer'], solutions: ['Check grid supply', 'Contact utility', 'Install voltage stabilizer'] },
  { brand: 'Sungrow', code: 'F003', description: 'Grid Overfrequency', severity: 'Error', causes: ['Grid frequency >51Hz', 'Grid instability'], solutions: ['Automatic recovery when grid stabilizes'] },
  { brand: 'Sungrow', code: 'F004', description: 'Grid Underfrequency', severity: 'Error', causes: ['Grid frequency <49Hz', 'Heavy grid load'], solutions: ['Automatic recovery when grid stabilizes'] },
  { brand: 'Sungrow', code: 'F005', description: 'Isolation Fault', severity: 'Critical', causes: ['DC cable insulation failure', 'Water ingress', 'Panel frame not grounded'], solutions: ['Check all DC connections', 'Megger test cables', 'Check panel grounding'] },
  { brand: 'Sungrow', code: 'F006', description: 'DC Overvoltage', severity: 'Critical', causes: ['Too many panels in string', 'Cold weather increasing Voc'], solutions: ['Reduce panels per string', 'Check MPPT voltage range'] },
  { brand: 'Sungrow', code: 'F007', description: 'DC Overcurrent', severity: 'Error', causes: ['Short circuit in DC cables', 'Ground fault'], solutions: ['Check DC cables', 'Check panel connections'] },
  { brand: 'Sungrow', code: 'F009', description: 'Overtemperature', severity: 'Warning', causes: ['Blocked ventilation', 'High ambient temperature', 'Failed fan'], solutions: ['Improve ventilation', 'Clean air filters', 'Check fan operation'] },

  // Deye
  { brand: 'Deye', code: 'E001', description: 'No Grid', severity: 'Info', causes: ['Grid disconnected', 'Grid breaker off'], solutions: ['Check grid connection', 'Wait for grid restoration'] },
  { brand: 'Deye', code: 'E002', description: 'Grid Voltage Fault', severity: 'Error', causes: ['Grid voltage out of range'], solutions: ['Check grid quality', 'Adjust grid voltage parameters if allowed'] },
  { brand: 'Deye', code: 'E003', description: 'Grid Frequency Fault', severity: 'Error', causes: ['Grid frequency out of range'], solutions: ['Wait for grid to stabilize'] },
  { brand: 'Deye', code: 'E006', description: 'PV Input Overvoltage', severity: 'Critical', causes: ['String voltage too high'], solutions: ['Reduce panels per string', 'Check cold weather Voc'] },
  { brand: 'Deye', code: 'E008', description: 'Isolation Fault', severity: 'Critical', causes: ['Ground fault in PV system'], solutions: ['Check insulation of all DC cables', 'Check panel frames'] },
  { brand: 'Deye', code: 'E010', description: 'Battery Overvoltage', severity: 'Critical', causes: ['BMS fault', 'Incorrect battery settings'], solutions: ['Check battery BMS', 'Verify battery voltage settings'] },
  { brand: 'Deye', code: 'E011', description: 'Battery Undervoltage', severity: 'Warning', causes: ['Battery empty', 'BMS cutoff'], solutions: ['Charge battery', 'Check BMS settings'] },
  { brand: 'Deye', code: 'E020', description: 'Overtemperature', severity: 'Warning', causes: ['Poor ventilation', 'High ambient temp'], solutions: ['Improve cooling', 'Reduce load'] },

  // Growatt
  { brand: 'Growatt', code: 'Error 102', description: 'Grid Lost', severity: 'Info', causes: ['Grid power outage'], solutions: ['System switches to battery backup', 'Automatic reconnection when grid returns'] },
  { brand: 'Growatt', code: 'Error 103', description: 'Grid Voltage High', severity: 'Error', causes: ['Grid overvoltage >275V'], solutions: ['Wait for grid normalization', 'Contact utility'] },
  { brand: 'Growatt', code: 'Error 104', description: 'Grid Voltage Low', severity: 'Error', causes: ['Grid undervoltage <175V'], solutions: ['Check grid connection', 'Contact utility'] },
  { brand: 'Growatt', code: 'Error 105', description: 'Grid Frequency High', severity: 'Error', causes: ['Frequency >52Hz'], solutions: ['Automatic recovery'] },
  { brand: 'Growatt', code: 'Error 106', description: 'Grid Frequency Low', severity: 'Error', causes: ['Frequency <48Hz'], solutions: ['Automatic recovery'] },
  { brand: 'Growatt', code: 'Error 114', description: 'PV1 Overvoltage', severity: 'Critical', causes: ['MPPT1 voltage exceeds limit'], solutions: ['Reduce string length'] },
  { brand: 'Growatt', code: 'Error 116', description: 'PV ISO Low', severity: 'Critical', causes: ['PV insulation resistance too low'], solutions: ['Check cables, connectors, panel frames'] },
  { brand: 'Growatt', code: 'Error 120', description: 'Inverter Overtemp', severity: 'Warning', causes: ['Internal temperature too high'], solutions: ['Improve ventilation', 'Clean dust'] },

  // Victron
  { brand: 'Victron', code: 'VE Error 2', description: 'Battery Voltage Too High', severity: 'Critical', causes: ['Overcharging', 'Wrong voltage setting'], solutions: ['Check charger settings', 'Check battery type selection'] },
  { brand: 'Victron', code: 'VE Error 3', description: 'Remote Temperature Sensor Failure', severity: 'Warning', causes: ['Sensor disconnected or failed'], solutions: ['Check sensor connection', 'Replace sensor'] },
  { brand: 'Victron', code: 'VE Error 4', description: 'Remote Temperature Sensor - Battery Temperature Out of Range', severity: 'Warning', causes: ['Battery too hot or cold'], solutions: ['Improve battery ventilation/insulation'] },
  { brand: 'Victron', code: 'VE Error 17', description: 'Controller Overtemperature', severity: 'Warning', causes: ['Poor ventilation', 'High ambient'], solutions: ['Improve cooling'] },
  { brand: 'Victron', code: 'VE Error 18', description: 'Controller Over-current', severity: 'Error', causes: ['Short circuit', 'Too much PV'], solutions: ['Check wiring', 'Reduce PV array'] },
  { brand: 'Victron', code: 'VE Error 33', description: 'PV Over-voltage', severity: 'Critical', causes: ['PV voltage too high'], solutions: ['Reduce panels per string'] },
  { brand: 'Victron', code: 'VE Error 34', description: 'PV Over-current', severity: 'Error', causes: ['PV current too high'], solutions: ['Check array configuration'] },
  { brand: 'Victron', code: 'VE Error 38', description: 'Input Shutdown - Excessive Battery Voltage', severity: 'Critical', causes: ['Battery voltage dangerously high'], solutions: ['Disconnect PV immediately', 'Check BMS'] },
  { brand: 'Victron', code: 'VE Error 116', description: 'Calibration Data Lost', severity: 'Critical', causes: ['EEPROM failure'], solutions: ['Contact Victron support - warranty issue'] },
];

// ==================== EXPORT ALL GUIDES ====================
export const ALL_MAINTENANCE_GUIDES = [
  ...PANEL_MAINTENANCE_GUIDES,
  ...INVERTER_REPAIR_GUIDES,
  ...BATTERY_MAINTENANCE_GUIDES,
  ...WIRING_GUIDES,
  ...SYSTEM_GUIDES
];

export function getGuidesByCategory(category: string): MaintenanceGuide[] {
  return ALL_MAINTENANCE_GUIDES.filter(g => g.category === category);
}

export function getGuidesByDifficulty(difficulty: string): MaintenanceGuide[] {
  return ALL_MAINTENANCE_GUIDES.filter(g => g.difficulty === difficulty);
}

export function getFaultCodesByBrand(brand: string): FaultCode[] {
  return INVERTER_FAULT_CODES.filter(f => f.brand.toLowerCase() === brand.toLowerCase());
}
