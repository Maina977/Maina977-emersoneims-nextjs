/**
 * CUMMINS GENERATORS - Repair Procedures
 * Step-by-step repair guides with tools, parts, and safety info
 */

// ==================== REPAIR PROCEDURES ====================

export const CUMMINS_REPAIRS = [
  {
    id: 'cummins-fuel-filter-change',
    serviceId: 'diesel-generators',
    name: 'Fuel Filter Replacement',
    symptom: 'Scheduled maintenance or engine running rough',
    description: 'Replace primary fuel water separator and secondary fuel filter',
    difficulty: 'easy',
    timeEstimate: '30-45 minutes',
    tools: [
      'Filter wrench (strap type)',
      'Drain pan (5L)',
      'Rags/absorbent pads',
      'Safety glasses',
      'Nitrile gloves',
      'Hand primer (if no electric pump)'
    ],
    parts: [
      { partNumber: 'FS1000', name: 'Fuel Water Separator', quantity: 1 },
      { partNumber: 'FF5052', name: 'Secondary Fuel Filter', quantity: 1 }
    ],
    safetyWarnings: [
      'Stop engine and allow to cool',
      'No smoking or open flames - diesel is flammable',
      'Work in ventilated area',
      'Have fire extinguisher nearby',
      'Clean up spills immediately',
      'Dispose of old filters properly'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Stop generator and allow to cool for 10 minutes. Disconnect battery negative terminal.',
        warning: 'Hot surfaces can cause burns'
      },
      {
        stepNumber: 2,
        instruction: 'Place drain pan under fuel water separator. Open drain valve at bottom and drain water/sediment.',
        tip: 'If large amount of water, check fuel tank for contamination'
      },
      {
        stepNumber: 3,
        instruction: 'Using filter wrench, turn fuel water separator counterclockwise to remove. Allow remaining fuel to drain.',
        tip: 'Keep filter upright to avoid spilling'
      },
      {
        stepNumber: 4,
        instruction: 'Fill new fuel water separator with clean diesel fuel. Apply thin film of fuel to gasket.',
        warning: 'Never use contaminated fuel'
      },
      {
        stepNumber: 5,
        instruction: 'Thread new filter onto housing by hand. Once gasket contacts, tighten additional 3/4 turn BY HAND ONLY.',
        warning: 'Do not use wrench to tighten - over-tightening damages gasket'
      },
      {
        stepNumber: 6,
        instruction: 'Move drain pan under secondary filter. Remove using filter wrench.',
        checkPoint: 'Note any debris in old filter'
      },
      {
        stepNumber: 7,
        instruction: 'Pre-fill new secondary filter with clean fuel. Lubricate gasket. Install and hand-tighten plus 3/4 turn.',
        torqueSpec: 'Hand tight + 3/4 turn'
      },
      {
        stepNumber: 8,
        instruction: 'Reconnect battery. If equipped with electric priming pump, turn key to RUN and allow pump to run 30 seconds. If manual, pump hand primer until firm.',
        tip: 'Listen for change in pump sound indicating primed'
      },
      {
        stepNumber: 9,
        instruction: 'Start generator and run at idle. Check both filters for leaks. Run for 5 minutes before loading.',
        checkPoint: 'No leaks, no air bubbles in sight glass'
      },
      {
        stepNumber: 10,
        instruction: 'Record service in maintenance log: Date, hours, filter part numbers.',
        tip: 'Schedule next change at 500 hours'
      }
    ],
    testProcedure: 'Run engine at idle and full speed. Check for leaks. Verify smooth operation under load.',
    linkedFaultCodes: ['352', '559']
  },
  {
    id: 'cummins-oil-change',
    serviceId: 'diesel-generators',
    name: 'Engine Oil and Filter Change',
    symptom: 'Scheduled maintenance',
    description: 'Complete oil and filter change procedure',
    difficulty: 'easy',
    timeEstimate: '45-60 minutes',
    tools: [
      'Socket wrench 1/2" drive',
      'Socket 19mm or 3/4"',
      'Filter wrench',
      'Drain pan (20L)',
      'Funnel',
      'Torque wrench',
      'Rags'
    ],
    parts: [
      { partNumber: 'LF9009', name: 'Engine Oil Filter', quantity: 1 },
      { partNumber: 'CES20081-OIL', name: 'Engine Oil 15W-40 (20L)', quantity: 1 },
      { partNumber: 'DRAIN-WASHER', name: 'Drain Plug Washer', quantity: 1 }
    ],
    safetyWarnings: [
      'Hot oil can cause severe burns',
      'Allow engine to cool below 60°C',
      'Wear safety glasses',
      'Do not overtighten drain plug',
      'Dispose of oil at recycling facility',
      'Clean up spills immediately'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Run generator under light load for 10 minutes to warm oil. Stop engine.',
        tip: 'Warm oil drains better and carries more contaminants'
      },
      {
        stepNumber: 2,
        instruction: 'Position drain pan under oil drain plug on oil pan. Offset toward front as oil flows at angle.',
        checkPoint: 'Drain pan capacity adequate'
      },
      {
        stepNumber: 3,
        instruction: 'Using 19mm socket, loosen drain plug. As plug comes free, push in slightly and remove quickly.',
        warning: 'Oil may be hot - avoid contact'
      },
      {
        stepNumber: 4,
        instruction: 'Allow oil to drain completely - minimum 15 minutes. Rock generator gently if mounted on springs.',
        tip: 'Complete draining removes maximum contaminants'
      },
      {
        stepNumber: 5,
        instruction: 'Move drain pan under oil filter. Using filter wrench, turn counterclockwise to remove.',
        checkPoint: 'Note condition of old filter'
      },
      {
        stepNumber: 6,
        instruction: 'Clean drain plug threads and sealing surface. Clean filter mounting surface.',
        warning: 'Ensure old gasket is not stuck to mount'
      },
      {
        stepNumber: 7,
        instruction: 'Install new sealing washer on drain plug. Thread in by hand until seated.',
        torqueSpec: '50-60 Nm'
      },
      {
        stepNumber: 8,
        instruction: 'Fill new oil filter with clean oil. Apply thin film of oil to gasket.',
        tip: 'Pre-filling reduces time to oil pressure'
      },
      {
        stepNumber: 9,
        instruction: 'Install filter by hand. Once gasket contacts, tighten 3/4 to 1 turn by hand only.',
        warning: 'Do not use wrench - damages gasket'
      },
      {
        stepNumber: 10,
        instruction: 'Remove oil filler cap. Using funnel, add oil to LOW mark on dipstick first.',
        checkPoint: 'Oil type correct: 15W-40 CES 20081'
      },
      {
        stepNumber: 11,
        instruction: 'Wait 5 minutes for oil to settle. Check dipstick and add to bring to HIGH mark.',
        tip: 'Better to underfill slightly - can add after running'
      },
      {
        stepNumber: 12,
        instruction: 'Start generator. Oil pressure should register within 10 seconds. Run at idle 3-5 minutes.',
        warning: 'If no pressure in 10 seconds, STOP immediately'
      },
      {
        stepNumber: 13,
        instruction: 'Stop engine. Wait 5 minutes. Check oil level and add to HIGH mark if needed.',
        checkPoint: 'Level at HIGH mark'
      },
      {
        stepNumber: 14,
        instruction: 'Check for leaks at drain plug and filter. Record service in maintenance log.',
        checkPoint: 'No leaks, service recorded'
      }
    ],
    testProcedure: 'Run engine at idle and operating speed. Verify oil pressure normal (40-60 PSI). Check for leaks after 10 minutes running.',
    linkedFaultCodes: ['141', '143', '415']
  },
  {
    id: 'cummins-avr-replacement',
    serviceId: 'diesel-generators',
    name: 'AVR Replacement',
    symptom: 'No output voltage, unstable voltage, or AVR fault indicated',
    description: 'Remove and replace automatic voltage regulator',
    difficulty: 'advanced',
    timeEstimate: '2-3 hours',
    tools: [
      'Multimeter (True RMS)',
      'Insulated screwdrivers',
      'Torque screwdriver',
      'Insulation tester (500V)',
      'Labeling machine',
      'Camera (for photos)'
    ],
    parts: [
      { partNumber: 'SX460', name: 'Automatic Voltage Regulator', quantity: 1 },
      { partNumber: 'MOV-275V', name: 'Surge Varistor', quantity: 2 }
    ],
    safetyWarnings: [
      'LETHAL VOLTAGES - Follow lockout/tagout',
      'Disconnect and lock out all power',
      'Verify zero voltage before work',
      'Generator must be at complete stop',
      'Use insulated tools',
      'Never work alone on high voltage'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Diagnose: With generator running, measure output voltage. Record readings for comparison.',
        warning: 'High voltage - use extreme caution',
        checkPoint: 'Document: V L1-L2, L2-L3, L3-L1, all L-N'
      },
      {
        stepNumber: 2,
        instruction: 'If no voltage, try flashing field: Engine stopped, briefly connect 12V to F+ and F- (2 sec max).',
        warning: 'Flash maximum 2 seconds',
        tip: 'If output appears after restart, AVR likely faulty'
      },
      {
        stepNumber: 3,
        instruction: 'Stop generator. Apply lockout to start switch. Disconnect battery. Wait for rotation to stop.',
        checkPoint: 'Lockout applied, battery disconnected'
      },
      {
        stepNumber: 4,
        instruction: 'Wait 5 minutes for capacitors to discharge. Verify zero voltage with tester.',
        warning: 'Residual voltage can be lethal',
        checkPoint: 'Zero voltage confirmed'
      },
      {
        stepNumber: 5,
        instruction: 'Remove alternator terminal box cover. Locate AVR - typically inside terminal box.',
        tip: 'Take photos of all connections before disturbing'
      },
      {
        stepNumber: 6,
        instruction: 'Label every wire on AVR with terminal designation using labeling machine.',
        warning: 'Incorrect reconnection can damage new AVR'
      },
      {
        stepNumber: 7,
        instruction: 'Disconnect all wires from AVR. Note potentiometer positions before removal.',
        tip: 'Mark pot positions with marker'
      },
      {
        stepNumber: 8,
        instruction: 'Remove AVR mounting screws. Remove AVR. Inspect for visible damage.',
        checkPoint: 'Document any burnt components'
      },
      {
        stepNumber: 9,
        instruction: 'If not present, install surge protection varistors across sensing terminals.',
        tip: 'MOVs protect AVR from voltage spikes'
      },
      {
        stepNumber: 10,
        instruction: 'Mount new AVR with original hardware. Ensure proper insulation.',
        checkPoint: 'Secure mounting, proper insulation'
      },
      {
        stepNumber: 11,
        instruction: 'Set voltage potentiometer to mid-position. Set stability pot to factory default.',
        tip: 'Factory settings provide safe starting point'
      },
      {
        stepNumber: 12,
        instruction: 'Reconnect all wires per labels. Verify sensing configuration matches system.',
        warning: 'Verify sensing selection: 3-phase, star connected',
        checkPoint: 'All connections verified'
      },
      {
        stepNumber: 13,
        instruction: 'Remove lockout. Reconnect battery. Start with NO LOAD connected.',
        checkPoint: 'Generator started, no load'
      },
      {
        stepNumber: 14,
        instruction: 'Measure output voltage. Adjust voltage pot to achieve 400V L-L (or rated voltage).',
        torqueSpec: 'Small adjustments - 1/8 turn at a time'
      },
      {
        stepNumber: 15,
        instruction: 'Apply 50% load. Check voltage stability. Adjust stability pot if hunting (reduce gain).',
        tip: 'Small adjustments for stability'
      },
      {
        stepNumber: 16,
        instruction: 'Apply full load. Verify voltage within ±5% of nominal. Document final settings.',
        checkPoint: 'Voltage within spec at all loads'
      }
    ],
    testProcedure: 'No-load voltage ±2%. Full-load voltage ±5%. Transient recovery <0.5 sec. No hunting at any load. Phase balance within 1%.',
    linkedFaultCodes: ['155', '551']
  },
  {
    id: 'cummins-starter-replacement',
    serviceId: 'diesel-generators',
    name: 'Starter Motor Replacement',
    symptom: 'Engine does not crank, starter clicks but no engagement, slow cranking',
    description: 'Remove and replace starter motor assembly',
    difficulty: 'moderate',
    timeEstimate: '2-3 hours',
    tools: [
      'Socket set (10-24mm)',
      'Ratchet and extensions',
      'Pry bar',
      'Torque wrench',
      'Wire brush',
      'Anti-seize compound'
    ],
    parts: [
      { partNumber: '3957544', name: 'Starter Motor Assembly', quantity: 1 }
    ],
    safetyWarnings: [
      'Disconnect battery negative first',
      'Starter is heavy (15-20kg) - use support',
      'Electrical shock hazard from battery cables',
      'Support starter during removal',
      'Do not drop - damages bendix'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Disconnect battery negative terminal first, then positive terminal.',
        warning: 'Connecting jumper or tool between positive and ground causes arc flash'
      },
      {
        stepNumber: 2,
        instruction: 'Locate starter motor on engine - typically on flywheel housing, near oil filter.',
        tip: 'May need to remove shields or covers for access'
      },
      {
        stepNumber: 3,
        instruction: 'Disconnect main power cable from starter solenoid (M10 nut). Mark cable.',
        torqueSpec: 'Note: Will torque to 15Nm on install'
      },
      {
        stepNumber: 4,
        instruction: 'Disconnect signal wire from solenoid S terminal (usually spade connector).',
        tip: 'Note wire color for reinstallation'
      },
      {
        stepNumber: 5,
        instruction: 'Support starter from below. Remove mounting bolts (typically 2 or 3).',
        warning: 'Starter is heavy - do not let it fall'
      },
      {
        stepNumber: 6,
        instruction: 'Work starter out of flywheel housing. May need slight rotation to clear.',
        tip: 'Note orientation of starter'
      },
      {
        stepNumber: 7,
        instruction: 'Compare old and new starter - verify correct part, same mounting, same pinion.',
        checkPoint: 'Part numbers match, pinion same size'
      },
      {
        stepNumber: 8,
        instruction: 'Clean mounting surface on flywheel housing. Inspect ring gear teeth for damage.',
        warning: 'Damaged ring gear will destroy new starter'
      },
      {
        stepNumber: 9,
        instruction: 'Apply anti-seize to mounting bolt threads. Position new starter in housing.',
        tip: 'Align before inserting bolts'
      },
      {
        stepNumber: 10,
        instruction: 'Install mounting bolts hand-tight first. Torque in star pattern.',
        torqueSpec: '40-50 Nm'
      },
      {
        stepNumber: 11,
        instruction: 'Connect main power cable to solenoid. Apply anti-seize to terminal.',
        torqueSpec: '15 Nm'
      },
      {
        stepNumber: 12,
        instruction: 'Connect signal wire to S terminal. Ensure secure connection.',
        checkPoint: 'Secure connection, correct terminal'
      },
      {
        stepNumber: 13,
        instruction: 'Reconnect battery - positive first, then negative.',
        warning: 'Verify no tools or wires in battery area'
      },
      {
        stepNumber: 14,
        instruction: 'Test starting system. Cranking should be smooth and quick.',
        checkPoint: 'Cranks properly, starts within 5 seconds'
      }
    ],
    testProcedure: 'Verify cranking speed adequate (>150 RPM). Starter engages smoothly. No grinding noise. Starter disengages promptly after engine starts.',
    linkedFaultCodes: ['115']
  },
  {
    id: 'cummins-belt-replacement',
    serviceId: 'diesel-generators',
    name: 'Drive Belt Replacement',
    symptom: 'Belt squealing, cracking visible, charging system fault',
    description: 'Replace serpentine or V-belt driving accessories',
    difficulty: 'easy',
    timeEstimate: '30-45 minutes',
    tools: [
      'Socket set',
      'Belt tension gauge',
      'Pry bar',
      'Flashlight',
      'Marker'
    ],
    parts: [
      { partNumber: 'BELT-FAN', name: 'Fan/Accessory Belt', quantity: 1 }
    ],
    safetyWarnings: [
      'Engine must be stopped and cool',
      'Disconnect battery',
      'Keep hands clear of pulleys',
      'Rotating parts hazard'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Stop engine and disconnect battery negative terminal.',
        checkPoint: 'Engine stopped, battery disconnected'
      },
      {
        stepNumber: 2,
        instruction: 'Locate belt tensioner. Mark belt routing with marker or take photo.',
        tip: 'Photo makes reinstallation easier'
      },
      {
        stepNumber: 3,
        instruction: 'Using socket on tensioner, rotate to release tension. Slip belt off pulleys.',
        tip: 'Some tensioners rotate clockwise, some counter-clockwise'
      },
      {
        stepNumber: 4,
        instruction: 'Inspect all pulleys for wear, damage, or contamination.',
        warning: 'Damaged pulley will destroy new belt',
        checkPoint: 'Pulleys in good condition'
      },
      {
        stepNumber: 5,
        instruction: 'Route new belt per diagram/photo. Ensure ribs engage all grooved pulleys.',
        tip: 'Double-check routing before releasing tensioner'
      },
      {
        stepNumber: 6,
        instruction: 'Release tensioner to tension belt. Verify belt seated in all pulleys.',
        checkPoint: 'Belt properly seated'
      },
      {
        stepNumber: 7,
        instruction: 'Check belt tension with gauge. Deflection should be 10-15mm with moderate force.',
        torqueSpec: '10-15mm deflection at 10kg force'
      },
      {
        stepNumber: 8,
        instruction: 'Reconnect battery. Start engine and verify belt tracking correctly.',
        checkPoint: 'No squealing, belt tracks straight'
      }
    ],
    testProcedure: 'Run engine at various speeds. No squealing or slipping. Check belt tracking. Verify charging system working.',
    linkedFaultCodes: []
  },
  {
    id: 'cummins-coolant-flush',
    serviceId: 'diesel-generators',
    name: 'Cooling System Flush and Refill',
    symptom: 'Contaminated coolant, rust visible, overheating, scheduled maintenance',
    description: 'Complete cooling system flush and refill with correct coolant mix',
    difficulty: 'moderate',
    timeEstimate: '2-3 hours',
    tools: [
      'Drain pan (50L)',
      'Flush kit',
      'Refractometer',
      'Funnel',
      'Pliers',
      'Pressure tester'
    ],
    parts: [
      { partNumber: 'COOLANT-CONC', name: 'Coolant Concentrate (20L)', quantity: 1 },
      { partNumber: 'WF2076', name: 'Coolant Filter', quantity: 1 },
      { partNumber: 'THERMOSTAT', name: 'Thermostat (if needed)', quantity: 1 }
    ],
    safetyWarnings: [
      'Never open system when hot',
      'Coolant is toxic - keep away from children/pets',
      'Dispose of old coolant properly',
      'Hot coolant can cause severe burns',
      'Pressure in system - release slowly'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Allow engine to cool completely. Pressure cap must be cold to touch.',
        warning: 'Hot coolant under pressure will spray out'
      },
      {
        stepNumber: 2,
        instruction: 'Place large drain pan under radiator. Open drain cock or remove lower hose.',
        tip: 'Open pressure cap to allow faster draining'
      },
      {
        stepNumber: 3,
        instruction: 'Open engine block drains if accessible. Drain completely.',
        tip: 'May need to remove coolant filter to drain more'
      },
      {
        stepNumber: 4,
        instruction: 'Close drains. Fill system with clean water. Start engine, run until thermostat opens.',
        checkPoint: 'Thermostat opens - upper hose gets hot'
      },
      {
        stepNumber: 5,
        instruction: 'Drain water flush. Repeat steps 4-5 until water runs clear.',
        tip: 'Typically 2-3 flushes needed'
      },
      {
        stepNumber: 6,
        instruction: 'Install new coolant filter while system is empty.',
        tip: 'Pre-fill filter with coolant mix'
      },
      {
        stepNumber: 7,
        instruction: 'Close all drains. Prepare 50/50 coolant mix (50% concentrate, 50% demineralized water).',
        checkPoint: 'Mix ratio correct'
      },
      {
        stepNumber: 8,
        instruction: 'Fill system slowly through pressure cap opening. Fill expansion tank to COLD mark.',
        tip: 'Pour slowly to allow air to escape'
      },
      {
        stepNumber: 9,
        instruction: 'Start engine with cap off. Run until thermostat opens. Top up as level drops.',
        tip: 'Air purges as thermostat opens'
      },
      {
        stepNumber: 10,
        instruction: 'Install pressure cap. Run engine to operating temperature.',
        checkPoint: 'No overheating, no leaks'
      },
      {
        stepNumber: 11,
        instruction: 'Pressure test system at 103 kPa (15 PSI). Should hold pressure for 10 minutes.',
        torqueSpec: '103 kPa - no drop in 10 min'
      },
      {
        stepNumber: 12,
        instruction: 'Test coolant concentration with refractometer. Should read 45-55%.',
        checkPoint: '45-55% glycol concentration'
      }
    ],
    testProcedure: 'Run at full temperature for 30 minutes. No leaks. Temperature stable at 82-95°C. Pressure test holds.',
    linkedFaultCodes: ['144', '151']
  }
];

// ==================== PARTS LIST ====================

export const CUMMINS_PARTS = [
  {
    id: 'cummins-fs1000',
    partNumber: 'FS1000',
    name: 'Fuel Water Separator',
    description: 'Primary fuel filter with water separator, 30 micron rating',
    category: 'Filtration',
    serviceIds: ['diesel-generators'],
    price: { min: 2500, max: 4500, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-2 days',
    specifications: {
      'Micron Rating': '30 micron',
      'Thread': '1-14 UN',
      'Height': '220mm',
      'Diameter': '93mm',
      'Water Capacity': '500ml'
    },
    compatibleModels: ['QSB5.9', 'QSB6.7', 'QSK19', 'QSK23', 'QSX15', 'ISB', 'ISL'],
    replacementInterval: '500 hours or 6 months',
    image: '/parts/fs1000.jpg'
  },
  {
    id: 'cummins-ff5052',
    partNumber: 'FF5052',
    name: 'Secondary Fuel Filter',
    description: 'Fine fuel filter, 5 micron rating, spin-on type',
    category: 'Filtration',
    serviceIds: ['diesel-generators'],
    price: { min: 1500, max: 2800, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-2 days',
    specifications: {
      'Micron Rating': '5 micron',
      'Thread': '1-16 UN',
      'Height': '175mm',
      'Diameter': '77mm',
      'Flow Rate': '200 L/hr'
    },
    compatibleModels: ['QSB5.9', 'QSB6.7', 'ISB', '4BT', '6BT'],
    replacementInterval: '500 hours or 6 months'
  },
  {
    id: 'cummins-lf9009',
    partNumber: 'LF9009',
    name: 'Engine Oil Filter',
    description: 'Full-flow oil filter with bypass valve',
    category: 'Filtration',
    serviceIds: ['diesel-generators'],
    price: { min: 2000, max: 3800, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-2 days',
    specifications: {
      'Type': 'Full-flow with bypass',
      'Thread': '1-16 UN',
      'Height': '310mm',
      'Diameter': '118mm',
      'Bypass Pressure': '15 PSI'
    },
    compatibleModels: ['QSB6.7', 'QSB7', 'QSL9', 'ISB6.7'],
    replacementInterval: '500 hours or 6 months'
  },
  {
    id: 'cummins-af25957',
    partNumber: 'AF25957',
    name: 'Air Filter Element',
    description: 'Primary air filter, radial seal type',
    category: 'Filtration',
    serviceIds: ['diesel-generators'],
    price: { min: 3500, max: 6000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-2 days',
    specifications: {
      'Type': 'Radial seal',
      'Outer Diameter': '320mm',
      'Inner Diameter': '170mm',
      'Height': '410mm',
      'Efficiency': '99.9%'
    },
    compatibleModels: ['QSB6.7', 'QSB7'],
    replacementInterval: '1000 hours or as indicated'
  },
  {
    id: 'cummins-wf2076',
    partNumber: 'WF2076',
    name: 'Coolant Filter',
    description: 'Coolant filter with SCA additive',
    category: 'Filtration',
    serviceIds: ['diesel-generators'],
    price: { min: 1200, max: 2000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-2 days',
    specifications: {
      'Type': 'Spin-on with SCA',
      'Thread': '3/4-16 UN',
      'Height': '145mm',
      'SCA Units': '8 units DCA4'
    },
    compatibleModels: ['All Cummins diesel engines'],
    replacementInterval: '500 hours or 6 months'
  },
  {
    id: 'cummins-sx460',
    partNumber: 'SX460',
    name: 'Automatic Voltage Regulator',
    description: 'Standard AVR for Stamford alternators',
    category: 'Electrical',
    serviceIds: ['diesel-generators'],
    price: { min: 15000, max: 40000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-7 days',
    specifications: {
      'Regulation': '±0.5%',
      'Sensing': '190-264V single phase or 3-phase',
      'Output': '90V DC max',
      'Adjustments': 'Voltage, Stability, UFRO'
    },
    compatibleModels: ['UCI224', 'UCI274', 'HCI434', 'HCI534'],
    image: '/parts/sx460.jpg'
  },
  {
    id: 'cummins-as440',
    partNumber: 'AS440',
    name: 'AVR with PMG Sensing',
    description: 'AVR for PMG-equipped alternators',
    category: 'Electrical',
    serviceIds: ['diesel-generators'],
    price: { min: 25000, max: 55000, currency: 'KES' },
    availability: 'order',
    leadTime: '5-10 days',
    specifications: {
      'Regulation': '±0.5%',
      'PMG Input': '170-240V 3-phase',
      'Output': '90V DC max',
      'Soft Start': 'Programmable'
    },
    compatibleModels: ['UCI224', 'UCI274', 'HCI434', 'HCI534', 'HCI634'],
    image: '/parts/as440.jpg'
  },
  {
    id: 'cummins-3935649',
    partNumber: '3935649',
    name: 'Fuel Shutoff Solenoid',
    description: '24VDC fuel shutoff solenoid',
    category: 'Fuel System',
    serviceIds: ['diesel-generators'],
    price: { min: 8000, max: 18000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 days',
    specifications: {
      'Voltage': '24V DC',
      'Type': 'Energize to run',
      'Thread': 'M12x1.5',
      'Current': '2A holding'
    },
    compatibleModels: ['QSB', 'ISB', '4BT', '6BT'],
    image: '/parts/fuel-solenoid.jpg'
  },
  {
    id: 'cummins-4903472',
    partNumber: '4903472',
    name: 'Fuel Injector Assembly',
    description: 'Reman fuel injector for common rail engines',
    category: 'Fuel System',
    serviceIds: ['diesel-generators'],
    price: { min: 35000, max: 55000, currency: 'KES' },
    availability: 'special-order',
    leadTime: '7-14 days',
    specifications: {
      'Type': 'Solenoid actuated',
      'Nozzle': 'Multi-hole',
      'Pressure': 'Up to 1800 bar',
      'Control': 'ECM controlled'
    },
    compatibleModels: ['QSB6.7', 'ISB6.7'],
    image: '/parts/injector.jpg'
  },
  {
    id: 'cummins-3957544',
    partNumber: '3957544',
    name: 'Starter Motor 24V 7kW',
    description: 'Gear reduction starter motor',
    category: 'Electrical',
    serviceIds: ['diesel-generators'],
    price: { min: 35000, max: 60000, currency: 'KES' },
    availability: 'order',
    leadTime: '5-10 days',
    specifications: {
      'Voltage': '24V DC',
      'Power': '7kW',
      'Type': 'Gear reduction',
      'Teeth': '10',
      'Rotation': 'CW from drive end'
    },
    compatibleModels: ['QSB6.7', 'QSB7', 'ISB series']
  },
  {
    id: 'cummins-3920779',
    partNumber: '3920779',
    name: 'Water Pump Assembly',
    description: 'Engine coolant pump',
    category: 'Cooling',
    serviceIds: ['diesel-generators'],
    price: { min: 25000, max: 45000, currency: 'KES' },
    availability: 'order',
    leadTime: '5-10 days',
    specifications: {
      'Type': 'Centrifugal',
      'Drive': 'Belt driven',
      'Flow': '300 L/min',
      'Seal': 'Mechanical face seal'
    },
    compatibleModels: ['QSB6.7', 'ISB6.7']
  },
  {
    id: 'cummins-turbo',
    partNumber: '3802429',
    name: 'Turbocharger Assembly',
    description: 'Holset turbocharger',
    category: 'Air System',
    serviceIds: ['diesel-generators'],
    price: { min: 120000, max: 250000, currency: 'KES' },
    availability: 'special-order',
    leadTime: '10-21 days',
    specifications: {
      'Type': 'Variable geometry',
      'Model': 'HE351VE',
      'Bearing': 'Journal bearing',
      'Actuator': 'Electronic'
    },
    compatibleModels: ['QSB6.7', 'ISB6.7']
  }
];

// ==================== MAINTENANCE SCHEDULES ====================

export const CUMMINS_MAINTENANCE= {
  serviceId: 'diesel-generators',
  tasks: [
    // Daily Tasks
    {
      id: 'daily-visual',
      name: 'Visual Inspection',
      description: 'Walk-around inspection for leaks, damage, and abnormalities',
      interval: 'Daily',
      procedure: [
        'Check for fuel leaks under engine',
        'Check for oil leaks',
        'Check for coolant leaks',
        'Inspect exhaust system',
        'Verify guards in place'
      ],
      tools: ['Flashlight'],
      estimatedTime: '5 minutes',
      category: 'preventive',
      priority: 'medium'
    },
    {
      id: 'daily-fluids',
      name: 'Fluid Level Checks',
      description: 'Check all fluid levels',
      interval: 'Daily',
      procedure: [
        'Check engine oil - between marks',
        'Check coolant level - at COLD mark',
        'Check fuel level - minimum 25%',
        'Check battery electrolyte if accessible'
      ],
      tools: ['Rag', 'Flashlight'],
      estimatedTime: '5 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'daily-panel',
      name: 'Control Panel Check',
      description: 'Verify control panel status',
      interval: 'Daily',
      procedure: [
        'Check for active fault codes',
        'Verify battery voltage display',
        'Check mode switch position',
        'Verify E-stop released'
      ],
      tools: [],
      estimatedTime: '2 minutes',
      category: 'preventive',
      priority: 'high'
    },
    // Weekly Tasks
    {
      id: 'weekly-testrun',
      name: 'Weekly Test Run',
      description: 'Run generator under load',
      interval: 'Weekly',
      intervalHours: 168,
      procedure: [
        'Start and warm up 5 minutes',
        'Apply minimum 30% load',
        'Run for 30+ minutes',
        'Monitor gauges',
        'Cool down 5 minutes before stop'
      ],
      tools: ['Load bank or live load'],
      estimatedTime: '45 minutes',
      category: 'preventive',
      priority: 'critical'
    },
    {
      id: 'weekly-battery',
      name: 'Battery Inspection',
      description: 'Check battery condition',
      interval: 'Weekly',
      procedure: [
        'Check terminals for corrosion',
        'Verify connections tight',
        'Check case condition',
        'Verify charger operating'
      ],
      tools: ['Terminal cleaner', 'Wrench'],
      estimatedTime: '15 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'weekly-fuel-water',
      name: 'Drain Water Separator',
      description: 'Drain water from fuel system',
      interval: 'Weekly',
      procedure: [
        'Place container under separator',
        'Open drain valve',
        'Drain until clean fuel appears',
        'Close valve',
        'Check fuel tank for contamination'
      ],
      tools: ['Drain container'],
      estimatedTime: '10 minutes',
      category: 'preventive',
      priority: 'medium'
    },
    // Monthly Tasks
    {
      id: 'monthly-airfilter',
      name: 'Air Filter Inspection',
      description: 'Inspect and service air filter',
      interval: 'Monthly',
      procedure: [
        'Remove air cleaner cover',
        'Remove and inspect element',
        'Clean with compressed air if reusable',
        'Replace if damaged or restricted',
        'Check housing seal'
      ],
      tools: ['Compressed air', 'Flashlight'],
      parts: ['AF25957 if needed'],
      estimatedTime: '20 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'monthly-belt',
      name: 'Belt Inspection',
      description: 'Check drive belt condition',
      interval: 'Monthly',
      procedure: [
        'Inspect for cracks or fraying',
        'Check tension (10-15mm deflection)',
        'Verify pulley alignment',
        'Check for wear patterns'
      ],
      tools: ['Belt tension gauge', 'Straightedge'],
      estimatedTime: '15 minutes',
      category: 'preventive',
      priority: 'medium'
    },
    {
      id: 'monthly-coolant',
      name: 'Coolant System Check',
      description: 'Inspect cooling system',
      interval: 'Monthly',
      procedure: [
        'Test coolant concentration (45-55%)',
        'Test SCA level',
        'Inspect radiator for debris',
        'Check hoses for damage',
        'Verify clamps tight'
      ],
      tools: ['Refractometer', 'SCA test strips'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'monthly-electrical',
      name: 'Electrical Connections',
      description: 'Check electrical connections',
      interval: 'Monthly',
      procedure: [
        'Check main terminals for tightness',
        'Inspect control wiring',
        'Check earth connections',
        'Verify cable glands tight',
        'Check fuses'
      ],
      tools: ['Insulated screwdrivers', 'Torque wrench'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'high'
    },
    // 250 Hour / 6 Month Tasks
    {
      id: '250hr-oil',
      name: 'Oil and Filter Change',
      description: 'Change engine oil and filter',
      interval: '250 hours or 6 months',
      intervalHours: 250,
      procedure: [
        'Warm engine',
        'Drain old oil',
        'Replace oil filter',
        'Refill with correct grade',
        'Check for leaks'
      ],
      tools: ['Drain pan', 'Filter wrench', 'Torque wrench'],
      parts: ['LF9009', '15W-40 oil (15-20L)'],
      estimatedTime: '45 minutes',
      category: 'preventive',
      priority: 'critical'
    },
    // 500 Hour / Annual Tasks
    {
      id: '500hr-fuel-filters',
      name: 'Fuel Filter Change',
      description: 'Replace all fuel filters',
      interval: '500 hours or annually',
      intervalHours: 500,
      procedure: [
        'Replace water separator',
        'Replace secondary filter',
        'Prime fuel system',
        'Check for leaks'
      ],
      tools: ['Filter wrench', 'Drain pan'],
      parts: ['FS1000', 'FF5052'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'critical'
    },
    {
      id: '500hr-coolant-filter',
      name: 'Coolant Filter Change',
      description: 'Replace coolant filter',
      interval: '500 hours or annually',
      intervalHours: 500,
      procedure: [
        'Replace coolant filter',
        'Check SCA levels',
        'Top up coolant if needed'
      ],
      tools: ['Filter wrench'],
      parts: ['WF2076'],
      estimatedTime: '20 minutes',
      category: 'preventive',
      priority: 'high'
    },
    // 1000 Hour Tasks
    {
      id: '1000hr-air-filter',
      name: 'Air Filter Replacement',
      description: 'Replace air filter elements',
      interval: '1000 hours',
      intervalHours: 1000,
      procedure: [
        'Replace primary element',
        'Replace safety element if equipped',
        'Clean housing',
        'Reset restriction indicator'
      ],
      tools: ['New elements'],
      parts: ['AF25957', 'Safety element'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: '1000hr-valve-adjust',
      name: 'Valve Clearance Check',
      description: 'Check and adjust valve clearances',
      interval: '1000 hours',
      intervalHours: 1000,
      procedure: [
        'Remove valve cover',
        'Check clearances with feeler gauge',
        'Adjust if out of spec',
        'Replace valve cover gasket'
      ],
      tools: ['Feeler gauges', 'Wrenches', 'Torque wrench'],
      parts: ['Valve cover gasket'],
      estimatedTime: '2-4 hours',
      category: 'preventive',
      priority: 'medium'
    },
    // 2000 Hour Tasks
    {
      id: '2000hr-belts',
      name: 'Belt Replacement',
      description: 'Replace all drive belts',
      interval: '2000 hours',
      intervalHours: 2000,
      procedure: [
        'Replace all drive belts',
        'Inspect pulleys',
        'Check alignment',
        'Set proper tension'
      ],
      tools: ['Belt tension gauge', 'Wrenches'],
      parts: ['Drive belts'],
      estimatedTime: '1 hour',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: '2000hr-coolant',
      name: 'Coolant Replacement',
      description: 'Flush and replace coolant',
      interval: '2000 hours or 2 years',
      intervalHours: 2000,
      procedure: [
        'Drain cooling system',
        'Flush with clean water',
        'Replace thermostat if needed',
        'Refill with correct coolant mix'
      ],
      tools: ['Drain pan', 'Flush kit', 'Refractometer'],
      parts: ['Coolant concentrate', 'Thermostat'],
      estimatedTime: '2-3 hours',
      category: 'preventive',
      priority: 'high'
    },
    // Annual Tasks
    {
      id: 'annual-alternator',
      name: 'Alternator Inspection',
      description: 'Annual alternator check',
      interval: 'Annually',
      procedure: [
        'Test winding insulation (>2MΩ)',
        'Check bearing condition',
        'Inspect brushes if equipped',
        'Clean air passages',
        'Check AVR connections'
      ],
      tools: ['Megger', 'Stethoscope', 'Brush'],
      parts: ['Brushes if worn', 'Bearings if noisy'],
      estimatedTime: '3-4 hours',
      category: 'predictive',
      priority: 'high'
    },
    {
      id: 'annual-load-test',
      name: 'Annual Load Bank Test',
      description: 'Full capacity test',
      interval: 'Annually',
      procedure: [
        'Connect load bank',
        'Test at 25%, 50%, 75%, 100%',
        'Run at 100% for 2 hours',
        'Monitor all parameters',
        'Document results'
      ],
      tools: ['Load bank', 'Data logger'],
      estimatedTime: '4 hours',
      category: 'predictive',
      priority: 'critical'
    }
  ]
};

export default {
  repairs: CUMMINS_REPAIRS,
  parts: CUMMINS_PARTS,
  maintenance: CUMMINS_MAINTENANCE
};
