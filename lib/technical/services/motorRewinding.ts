/**
 * MOTOR REWINDING - Technical Documentation
 * Complete reference for electric motor repair and rewinding
 */

// ==================== SCHEMATICS ====================

export const MOTOR_SCHEMATICS = [
  {
    id: 'motor-3ph-induction',
    serviceId: 'motors-rewinding',
    name: '3-Phase Induction Motor Construction',
    description: 'Internal construction of a squirrel cage induction motor',
    category: 'Motor Construction',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1000, height: 600 },
    layers: [
      { id: 'stator', name: 'Stator', color: '#3B82F6', visible: true },
      { id: 'rotor', name: 'Rotor', color: '#EF4444', visible: true },
      { id: 'mechanical', name: 'Mechanical', color: '#6B7280', visible: true },
    ],
    components: [
      {
        id: 'stator-core',
        name: 'Stator Core',
        type: 'component',
        x: 200, y: 150, width: 400, height: 300,
        properties: { material: 'Silicon Steel Laminations', slots: '36' },
        connectedTo: ['stator-winding'],
        layer: 'stator',
        details: 'Laminated silicon steel core with insulated slots for windings',
        specifications: {
          'Material': 'M400-50A Silicon Steel',
          'Lamination Thickness': '0.5mm',
          'Insulation': 'C5 varnish between laminations',
          'Slots': '36 semi-closed',
          'Stack Length': 'Per motor frame'
        }
      },
      {
        id: 'stator-winding',
        name: 'Stator Winding',
        type: 'component',
        x: 250, y: 180, width: 300, height: 240,
        properties: { phases: '3', connection: 'Star or Delta', class: 'F' },
        connectedTo: ['stator-core', 'terminal-box'],
        layer: 'stator',
        details: 'Three-phase copper winding with Class F insulation',
        specifications: {
          'Wire': 'Enameled copper (polyester-imide)',
          'Insulation Class': 'F (155°C)',
          'Connection': 'Star (Y) or Delta (Δ)',
          'Coil Pitch': '1-8 (short pitch)',
          'Winding Type': 'Lap or Concentric'
        }
      },
      {
        id: 'rotor-core',
        name: 'Rotor Core',
        type: 'component',
        x: 350, y: 220, width: 100, height: 160,
        properties: { type: 'Squirrel Cage', bars: 'Aluminum' },
        connectedTo: ['shaft'],
        layer: 'rotor',
        details: 'Laminated core with die-cast aluminum squirrel cage',
        specifications: {
          'Material': 'Silicon Steel Laminations',
          'Bars': 'Die-cast Aluminum',
          'Slots': '28 (skewed)',
          'End Rings': 'Aluminum',
          'Skew': '1 slot pitch'
        }
      },
      {
        id: 'shaft',
        name: 'Motor Shaft',
        type: 'component',
        x: 100, y: 280, width: 600, height: 40,
        properties: { material: 'EN8 Steel' },
        connectedTo: ['rotor-core', 'bearings', 'fan'],
        layer: 'mechanical',
        details: 'Machined steel shaft with keyway for coupling',
        specifications: {
          'Material': 'EN8 Carbon Steel',
          'Drive End': 'Keyway per BS 4235',
          'Surface Finish': 'Ra 0.8 at bearing journals'
        }
      },
      {
        id: 'de-bearing',
        name: 'Drive End Bearing',
        type: 'component',
        x: 150, y: 270, width: 60, height: 60,
        properties: { type: '6308-2RS', sealed: 'Yes' },
        connectedTo: ['shaft', 'de-bracket'],
        layer: 'mechanical',
        details: 'Deep groove ball bearing with rubber seals',
        specifications: {
          'Type': '6308-2RS',
          'Bore': '40mm',
          'OD': '90mm',
          'Width': '23mm',
          'Grease': 'Lithium EP2'
        }
      },
      {
        id: 'nde-bearing',
        name: 'Non-Drive End Bearing',
        type: 'component',
        x: 590, y: 270, width: 50, height: 60,
        properties: { type: '6307-2RS', sealed: 'Yes' },
        connectedTo: ['shaft', 'nde-bracket'],
        layer: 'mechanical',
        details: 'Smaller bearing for NDE support',
        specifications: {
          'Type': '6307-2RS',
          'Bore': '35mm',
          'OD': '80mm',
          'Width': '21mm'
        }
      },
      {
        id: 'cooling-fan',
        name: 'Cooling Fan',
        type: 'component',
        x: 650, y: 250, width: 80, height: 100,
        properties: { type: 'Axial', material: 'Aluminum/Plastic' },
        connectedTo: ['shaft'],
        layer: 'mechanical',
        details: 'Shaft-mounted axial fan for TEFC cooling'
      },
      {
        id: 'terminal-box',
        name: 'Terminal Box',
        type: 'component',
        x: 300, y: 50, width: 100, height: 80,
        properties: { terminals: '6', IP: 'IP55' },
        connectedTo: ['stator-winding'],
        layer: 'stator',
        details: 'Six terminal connection box for star/delta',
        specifications: {
          'Terminals': 'U1, V1, W1, U2, V2, W2',
          'Star': 'Link U2-V2-W2, supply to U1-V1-W1',
          'Delta': 'Link U1-W2, V1-U2, W1-V2'
        }
      }
    ],
    notes: [
      'For STAR connection: Link U2-V2-W2 together',
      'For DELTA connection: Link U1-W2, V1-U2, W1-V2',
      'Motor must have 6 accessible terminals for star-delta starting'
    ],
    relatedDiagrams: ['motor-winding-pattern', 'motor-star-delta'],
    lastUpdated: '2026-03-01'
  }
];

// ==================== WIRING DIAGRAMS ====================

export const MOTOR_WIRING = [
  {
    id: 'motor-dol-starter',
    serviceId: 'motors-rewinding',
    name: 'Direct On Line (DOL) Starter Wiring',
    description: 'Complete DOL starter circuit for 3-phase motor',
    category: 'Motor Control',
    wires: [
      {
        id: 'dol-l1',
        from: 'Isolator L1',
        to: 'Contactor L1',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: 'Per motor FLC',
        type: 'Single Core PVC',
        function: 'Phase L1 to contactor',
        maxCurrent: 'Motor FLC × 1.25',
        voltage: '400V'
      },
      {
        id: 'dol-l2',
        from: 'Isolator L2',
        to: 'Contactor L2',
        color: '#000000',
        colorName: 'Black',
        gauge: 'Per motor FLC',
        type: 'Single Core PVC',
        function: 'Phase L2 to contactor',
        maxCurrent: 'Motor FLC × 1.25',
        voltage: '400V'
      },
      {
        id: 'dol-l3',
        from: 'Isolator L3',
        to: 'Contactor L3',
        color: '#808080',
        colorName: 'Grey',
        gauge: 'Per motor FLC',
        type: 'Single Core PVC',
        function: 'Phase L3 to contactor',
        maxCurrent: 'Motor FLC × 1.25',
        voltage: '400V'
      },
      {
        id: 'dol-motor-u',
        from: 'Overload T1',
        to: 'Motor U1',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: 'Per motor FLC',
        type: 'Flexible or armored',
        function: 'Phase U to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'dol-motor-v',
        from: 'Overload T2',
        to: 'Motor V1',
        color: '#000000',
        colorName: 'Black',
        gauge: 'Per motor FLC',
        type: 'Flexible or armored',
        function: 'Phase V to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'dol-motor-w',
        from: 'Overload T3',
        to: 'Motor W1',
        color: '#808080',
        colorName: 'Grey',
        gauge: 'Per motor FLC',
        type: 'Flexible or armored',
        function: 'Phase W to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'dol-ctrl-live',
        from: 'Isolator L1',
        to: 'Stop Button NC',
        color: '#FF0000',
        colorName: 'Red',
        gauge: '1.5mm²',
        type: 'Control cable',
        function: 'Control circuit live',
        maxCurrent: '6A',
        voltage: '400V'
      },
      {
        id: 'dol-ctrl-start',
        from: 'Start Button NO',
        to: 'Contactor A1',
        color: '#000000',
        colorName: 'Black',
        gauge: '1.5mm²',
        type: 'Control cable',
        function: 'Start signal',
        maxCurrent: '6A',
        voltage: '400V'
      },
      {
        id: 'dol-ctrl-hold',
        from: 'Contactor 13',
        to: 'Start Button (parallel)',
        color: '#000000',
        colorName: 'Black',
        gauge: '1.5mm²',
        type: 'Control cable',
        function: 'Hold-in circuit',
        maxCurrent: '6A',
        voltage: '400V'
      },
      {
        id: 'dol-ctrl-neutral',
        from: 'Contactor A2',
        to: 'Overload 95-96 NC',
        color: '#0000FF',
        colorName: 'Blue',
        gauge: '1.5mm²',
        type: 'Control cable',
        function: 'Control neutral via overload',
        maxCurrent: '6A',
        voltage: '0V'
      }
    ],
    terminals: [
      { id: 't-u1', name: 'Motor U1', x: 700, y: 100, type: 'Terminal block' },
      { id: 't-v1', name: 'Motor V1', x: 700, y: 150, type: 'Terminal block' },
      { id: 't-w1', name: 'Motor W1', x: 700, y: 200, type: 'Terminal block' }
    ],
    annotations: [
      { x: 400, y: 50, text: 'Set overload relay to motor FLC' },
      { x: 400, y: 450, text: 'Control voltage = Line voltage (400V) in this circuit' }
    ],
    safetyNotes: [
      'Motor must have local isolation within sight',
      'Overload relay must be correctly sized for motor FLC',
      'Check phase rotation before starting motor with pump/compressor loads',
      'DOL starting causes 6-8× FLC inrush - check supply capacity'
    ],
    testPoints: [
      { id: 'tp-volt', name: 'Supply Voltage', expectedValue: '400V ±5%', procedure: 'Measure L1-L2, L2-L3, L3-L1' },
      { id: 'tp-flc', name: 'Running Current', expectedValue: '≤ Nameplate FLC', procedure: 'Clamp meter on each phase' },
      { id: 'tp-ir', name: 'Insulation Resistance', expectedValue: '>1MΩ at 500V', procedure: 'Megger motor windings to earth' }
    ]
  },
  {
    id: 'motor-star-delta',
    serviceId: 'motors-rewinding',
    name: 'Star-Delta Starter Wiring',
    description: 'Reduced voltage starting for larger motors',
    category: 'Motor Control',
    wires: [
      {
        id: 'sd-main-l1',
        from: 'Main Contactor 1',
        to: 'Motor U1',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'Phase L1 to U1',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V'
      },
      {
        id: 'sd-main-l2',
        from: 'Main Contactor 3',
        to: 'Motor V1',
        color: '#000000',
        colorName: 'Black',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'Phase L2 to V1',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V'
      },
      {
        id: 'sd-main-l3',
        from: 'Main Contactor 5',
        to: 'Motor W1',
        color: '#808080',
        colorName: 'Grey',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'Phase L3 to W1',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V'
      },
      {
        id: 'sd-star-u2',
        from: 'Star Contactor 2',
        to: 'Motor U2',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: '33% of DOL size',
        type: 'Per installation',
        function: 'U2 to star point',
        maxCurrent: 'FLC × 0.33',
        voltage: '230V in star'
      },
      {
        id: 'sd-star-v2',
        from: 'Star Contactor 4',
        to: 'Motor V2',
        color: '#000000',
        colorName: 'Black',
        gauge: '33% of DOL size',
        type: 'Per installation',
        function: 'V2 to star point',
        maxCurrent: 'FLC × 0.33',
        voltage: '230V in star'
      },
      {
        id: 'sd-star-w2',
        from: 'Star Contactor 6',
        to: 'Motor W2',
        color: '#808080',
        colorName: 'Grey',
        gauge: '33% of DOL size',
        type: 'Per installation',
        function: 'W2 to star point',
        maxCurrent: 'FLC × 0.33',
        voltage: '230V in star'
      },
      {
        id: 'sd-delta-w2',
        from: 'Delta Contactor 1',
        to: 'Motor W2',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'L1 to W2 in delta',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V in delta'
      },
      {
        id: 'sd-delta-u2',
        from: 'Delta Contactor 3',
        to: 'Motor U2',
        color: '#000000',
        colorName: 'Black',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'L2 to U2 in delta',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V in delta'
      },
      {
        id: 'sd-delta-v2',
        from: 'Delta Contactor 5',
        to: 'Motor V2',
        color: '#808080',
        colorName: 'Grey',
        gauge: '58% of DOL size',
        type: 'Per installation',
        function: 'L3 to V2 in delta',
        maxCurrent: 'FLC × 0.58',
        voltage: '400V in delta'
      }
    ],
    terminals: [
      { id: 't-u1', name: 'Motor U1', x: 700, y: 50, type: 'Motor terminal' },
      { id: 't-v1', name: 'Motor V1', x: 700, y: 100, type: 'Motor terminal' },
      { id: 't-w1', name: 'Motor W1', x: 700, y: 150, type: 'Motor terminal' },
      { id: 't-u2', name: 'Motor U2', x: 700, y: 250, type: 'Motor terminal' },
      { id: 't-v2', name: 'Motor V2', x: 700, y: 300, type: 'Motor terminal' },
      { id: 't-w2', name: 'Motor W2', x: 700, y: 350, type: 'Motor terminal' }
    ],
    annotations: [
      { x: 400, y: 50, text: 'STAR: U2-V2-W2 linked together via star contactor' },
      { x: 400, y: 100, text: 'DELTA: U1-W2, V1-U2, W1-V2 connected via delta contactor' },
      { x: 400, y: 450, text: 'Transition time typically 3-10 seconds' }
    ],
    safetyNotes: [
      'Motor MUST have 6 terminals accessible (not internally connected)',
      'Interlock star and delta contactors electrically AND mechanically',
      'Start current in star is still 2× FLC',
      'Starting torque is only 33% - not suitable for high inertia loads'
    ],
    testPoints: [
      { id: 'tp-star-v', name: 'Star Voltage (winding)', expectedValue: '230V per winding', procedure: 'Measure U1-U2 in star' },
      { id: 'tp-delta-v', name: 'Delta Voltage (winding)', expectedValue: '400V per winding', procedure: 'Measure U1-U2 in delta' },
      { id: 'tp-star-i', name: 'Star Current', expectedValue: '2× FLC', procedure: 'Clamp during start' },
      { id: 'tp-delta-i', name: 'Delta Current', expectedValue: 'Nameplate FLC', procedure: 'Clamp after transition' }
    ]
  }
];

// ==================== TROUBLESHOOTING ====================

export const MOTOR_TROUBLESHOOTING = [
  {
    id: 'motor-wont-start',
    serviceId: 'motors-rewinding',
    name: 'Motor Won\'t Start',
    description: 'Motor fails to start when power applied',
    category: 'Starting',
    severity: 'critical',
    initialSymptom: 'Motor does not rotate when switched on',
    estimatedTime: '20-60 minutes',
    nodes: [
      { id: 'start', question: 'Is there a humming sound from the motor?', yesNode: 'humming', noNode: 'no-hum' },
      { id: 'humming', question: 'Is the motor shaft free to rotate by hand (with power off)?', yesNode: 'shaft-free', noNode: 'shaft-locked' },
      { id: 'shaft-locked', solution: 'Mechanical problem - bearing seizure, coupling jam, or driven equipment locked. Disconnect motor from load and try again.', severity: 'critical', tools: ['Spanners', 'Bearing puller'] },
      { id: 'shaft-free', question: 'Check voltage at motor terminals - is it correct (400V ±5%)?', yesNode: 'voltage-ok', noNode: 'voltage-problem' },
      { id: 'voltage-problem', solution: 'Low voltage or missing phase. Check supply, fuses, contactors, overload relay. Single phasing causes humming and overheating.', severity: 'critical', tools: ['Multimeter'] },
      { id: 'voltage-ok', solution: 'Motor winding fault. Megger test: should be >1MΩ to earth. Check winding resistance - all phases should be equal ±5%. May need rewinding.', severity: 'critical', tools: ['Insulation tester', 'Low resistance ohmmeter'], partsList: ['Complete rewind'] },
      { id: 'no-hum', question: 'Is voltage present at the motor terminals?', yesNode: 'voltage-at-motor', noNode: 'no-voltage' },
      { id: 'no-voltage', solution: 'Check supply: isolator, fuses, contactor, overload. Test contactor coil. Check control circuit including emergency stops.', severity: 'warning', tools: ['Multimeter', 'Test lamp'] },
      { id: 'voltage-at-motor', solution: 'Motor has open circuit winding. Check terminal connections first. Measure winding resistance - open circuit reads infinite. Motor needs rewinding.', severity: 'critical', tools: ['Low resistance ohmmeter'], partsList: ['Complete rewind'] }
    ]
  },
  {
    id: 'motor-overheating',
    serviceId: 'motors-rewinding',
    name: 'Motor Overheating',
    description: 'Motor runs excessively hot',
    category: 'Thermal',
    severity: 'warning',
    initialSymptom: 'Motor too hot to touch or tripping on overload',
    estimatedTime: '30-60 minutes',
    nodes: [
      { id: 'start', question: 'Is the motor overloaded (current > nameplate FLC)?', yesNode: 'overloaded', noNode: 'not-overloaded' },
      { id: 'overloaded', solution: 'Reduce mechanical load or use larger motor. Check for increased friction in driven equipment. Check for blocked ventilation on fan/pump.', severity: 'warning', tools: ['Clamp meter'] },
      { id: 'not-overloaded', question: 'Is cooling adequate (fan running, vents clear)?', yesNode: 'cooling-ok', noNode: 'cooling-problem' },
      { id: 'cooling-problem', solution: 'Clean cooling fins and fan. Check fan is not damaged. Ensure motor is not enclosed without ventilation. For inverter duty, may need forced cooling.', severity: 'info', tools: ['Compressed air', 'Brush'] },
      { id: 'cooling-ok', question: 'Is voltage correct and balanced (<2% imbalance)?', yesNode: 'voltage-balanced', noNode: 'voltage-unbalanced' },
      { id: 'voltage-unbalanced', solution: 'Voltage imbalance causes significant extra heating. Check supply, connections, and transformer taps. 3.5% imbalance = 25% extra heating!', severity: 'warning', tools: ['Multimeter'] },
      { id: 'voltage-balanced', question: 'Are all three phase currents equal (within 5%)?', yesNode: 'currents-balanced', noNode: 'currents-unbalanced' },
      { id: 'currents-unbalanced', solution: 'Unbalanced currents indicate winding fault (shorted turns). Motor needs testing and probable rewind.', severity: 'critical', tools: ['Clamp meter', 'Winding analyzer'], partsList: ['Complete rewind'] },
      { id: 'currents-balanced', solution: 'Check insulation resistance - may be degraded. Check for excessive ambient temperature. Consider motor may be undersized for duty cycle.', severity: 'info', tools: ['Insulation tester', 'Thermometer'] }
    ]
  },
  {
    id: 'motor-vibration',
    serviceId: 'motors-rewinding',
    name: 'Motor Vibration',
    description: 'Excessive vibration from motor',
    category: 'Mechanical',
    severity: 'warning',
    initialSymptom: 'Motor vibrates excessively during operation',
    estimatedTime: '30-90 minutes',
    nodes: [
      { id: 'start', question: 'Does vibration change when motor is disconnected from load?', yesNode: 'coupling-related', noNode: 'motor-only' },
      { id: 'coupling-related', solution: 'Check coupling alignment using dial indicators or laser. Maximum misalignment typically 0.05mm. Check for worn coupling elements.', severity: 'warning', tools: ['Dial indicator', 'Laser aligner', 'Straight edge'] },
      { id: 'motor-only', question: 'Does vibration reduce if motor speed is reduced (if on VFD)?', yesNode: 'speed-related', noNode: 'not-speed-related' },
      { id: 'speed-related', solution: 'Possible resonance at certain speed. Check for loose parts, soft foot. May need to avoid certain speed ranges on VFD.', severity: 'warning', tools: ['Vibration meter', 'Feeler gauges'] },
      { id: 'not-speed-related', question: 'Is there a bearing noise (grinding, rumbling)?', yesNode: 'bearing-fault', noNode: 'no-bearing-noise' },
      { id: 'bearing-fault', solution: 'Bearing replacement required. Check shaft journals for wear. Use correct bearing fit - inner race interference, outer race slip fit.', severity: 'critical', tools: ['Stethoscope', 'Bearing puller', 'Induction heater'], partsList: ['Bearings (DE and NDE)'], timeEstimate: '2-4 hours' },
      { id: 'no-bearing-noise', solution: 'Check rotor balance. May need rebalancing after rewind. Check for broken rotor bars (causes 2× slip frequency vibration).', severity: 'warning', tools: ['Vibration analyzer', 'Rotor bar tester'] }
    ]
  }
];

// ==================== REPAIR PROCEDURES ====================

export const MOTOR_REPAIRS = [
  {
    id: 'motor-bearing-replacement',
    serviceId: 'motors-rewinding',
    name: 'Motor Bearing Replacement',
    description: 'Replace worn or damaged motor bearings',
    category: 'Mechanical',
    difficulty: 'medium',
    estimatedTime: '2-4 hours',
    safetyWarnings: [
      'Isolate and lock out motor before work',
      'Allow motor to cool if it was running',
      'Support motor properly - can be heavy',
      'Wear safety glasses when using bearing puller'
    ],
    requiredTools: [
      'Bearing puller set',
      'Bearing heater or induction heater',
      'Soft face mallet',
      'Snap ring pliers',
      'Torque wrench',
      'Dial indicator',
      'Feeler gauges',
      'Clean rags'
    ],
    requiredParts: [
      { partNumber: 'Per motor', description: 'DE Bearing (e.g., 6308-2RS)', quantity: 1 },
      { partNumber: 'Per motor', description: 'NDE Bearing (e.g., 6307-2RS)', quantity: 1 },
      { partNumber: 'N/A', description: 'Bearing grease (Lithium EP2)', quantity: 1 }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Preparation',
        instruction: 'Isolate motor, disconnect cables, remove from mounting. Clean exterior.',
        warning: 'Ensure motor is completely de-energized',
        duration: '15 min'
      },
      {
        stepNumber: 2,
        title: 'Remove Fan Cover',
        instruction: 'Remove fan cover bolts and lift off cover',
        tip: 'Note bolt positions as they may be different lengths',
        duration: '5 min'
      },
      {
        stepNumber: 3,
        title: 'Remove Cooling Fan',
        instruction: 'Remove fan retaining clip/bolt. Pull fan off shaft.',
        tip: 'Some fans are pressed on - use puller if necessary',
        duration: '5 min'
      },
      {
        stepNumber: 4,
        title: 'Remove End Brackets',
        instruction: 'Remove through bolts. Carefully remove NDE bracket first.',
        warning: 'Support rotor to prevent damage to windings',
        tip: 'Mark bracket and frame positions for reassembly',
        duration: '15 min'
      },
      {
        stepNumber: 5,
        title: 'Remove Rotor',
        instruction: 'Carefully withdraw rotor from stator bore',
        warning: 'Do not drag rotor against stator - will damage windings',
        tip: 'Use cardboard sleeve to protect stator bore',
        duration: '10 min'
      },
      {
        stepNumber: 6,
        title: 'Remove Old Bearings',
        instruction: 'Use bearing puller to remove bearings from shaft',
        warning: 'Pull on inner race only - never on outer race',
        tip: 'Heat bearing with torch if very tight',
        duration: '20 min'
      },
      {
        stepNumber: 7,
        title: 'Inspect Shaft',
        instruction: 'Check shaft journals for wear, scoring, or corrosion',
        tip: 'Journals should be smooth with slight interference fit for bearing',
        duration: '10 min'
      },
      {
        stepNumber: 8,
        title: 'Heat New Bearings',
        instruction: 'Heat bearings to 80-100°C using induction heater',
        warning: 'Never heat bearings with open flame - damages grease',
        tip: 'Bearing should slip on easily when properly heated',
        duration: '15 min'
      },
      {
        stepNumber: 9,
        title: 'Install New Bearings',
        instruction: 'Slide heated bearing onto shaft until seated against shoulder',
        warning: 'Do not hammer on bearing - can cause damage',
        tip: 'Use tube that fits on inner race if needed',
        duration: '10 min'
      },
      {
        stepNumber: 10,
        title: 'Reassemble Motor',
        instruction: 'Reverse disassembly procedure. Ensure rotor runs free.',
        tip: 'Torque through bolts evenly in star pattern',
        duration: '30 min'
      },
      {
        stepNumber: 11,
        title: 'Check End Play',
        instruction: 'Measure axial movement with dial indicator. Typically 0.05-0.2mm.',
        tip: 'Excessive play indicates incorrect bearing fit',
        duration: '10 min'
      },
      {
        stepNumber: 12,
        title: 'Test Run',
        instruction: 'Reconnect and run motor. Check for noise, vibration, temperature.',
        warning: 'Stop immediately if abnormal noise or vibration',
        tip: 'Run for 30 minutes and check bearing temperature (<70°C)',
        duration: '30 min'
      }
    ],
    verificationSteps: [
      'Rotor spins freely by hand',
      'No grinding or scraping noise',
      'Bearing temperature <70°C after 30 min run',
      'Vibration within acceptable limits',
      'Motor draws normal running current'
    ],
    commonMistakes: [
      'Using wrong bearing size or type',
      'Hammering bearing onto shaft',
      'Overgreasing sealed bearings',
      'Not checking shaft journal condition',
      'Incorrect end play'
    ]
  },
  {
    id: 'motor-rewind',
    serviceId: 'motors-rewinding',
    name: 'Complete Motor Rewind',
    description: 'Remove old winding and install new winding',
    category: 'Electrical',
    difficulty: 'expert',
    estimatedTime: '8-16 hours',
    safetyWarnings: [
      'Remove all power before starting',
      'Wear gloves when handling winding wire',
      'Use eye protection when stripping insulation',
      'Ensure good ventilation when applying varnish'
    ],
    requiredTools: [
      'Winding data recording sheets',
      'Coil pulling tools',
      'Coil forming equipment',
      'Slot wedge driver',
      'Lacing cord needle',
      'Insulation resistance tester',
      'Surge tester',
      'Vacuum impregnation tank',
      'Baking oven'
    ],
    requiredParts: [
      { partNumber: 'Per motor', description: 'Magnet wire (per winding data)', quantity: 1 },
      { partNumber: 'Per motor', description: 'Slot insulation (Nomex/DMD)', quantity: 1 },
      { partNumber: 'Per motor', description: 'Slot wedges', quantity: 1 },
      { partNumber: 'N/A', description: 'Varnish (Class F or H)', quantity: 1 },
      { partNumber: 'N/A', description: 'Lacing cord', quantity: 1 }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Record Winding Data',
        instruction: 'Before removing old winding: count coils per pole per phase, turns per coil, wire size, span, connection',
        warning: 'CRITICAL - incorrect data means motor will not work correctly',
        duration: '60 min'
      },
      {
        stepNumber: 2,
        title: 'Remove Old Winding',
        instruction: 'Burn out old winding in oven at 350°C or strip manually',
        warning: 'Burning produces fumes - use extraction',
        tip: 'Check core for damage after winding removal',
        duration: '120 min'
      },
      {
        stepNumber: 3,
        title: 'Clean and Inspect Core',
        instruction: 'Clean slots, check for burnt laminations, test core losses',
        tip: 'Core losses should be checked with loop test',
        duration: '60 min'
      },
      {
        stepNumber: 4,
        title: 'Install Slot Insulation',
        instruction: 'Cut and fit slot insulation (Nomex or DMD) to all slots',
        tip: 'Insulation should extend 2-3mm beyond core',
        duration: '60 min'
      },
      {
        stepNumber: 5,
        title: 'Wind Coils',
        instruction: 'Wind coils on former per recorded data. Count turns carefully.',
        warning: 'Wrong turn count will change motor characteristics',
        duration: '180 min'
      },
      {
        stepNumber: 6,
        title: 'Insert Coils',
        instruction: 'Insert coils into slots following winding pattern',
        tip: 'Use slot wedge driver to avoid wire damage',
        duration: '120 min'
      },
      {
        stepNumber: 7,
        title: 'Install Phase Insulation',
        instruction: 'Install phase-to-phase insulation between coil groups',
        duration: '30 min'
      },
      {
        stepNumber: 8,
        title: 'Make Connections',
        instruction: 'Connect coils per recorded pattern. Braze or crimp joints.',
        warning: 'Verify star/delta configuration matches original',
        duration: '60 min'
      },
      {
        stepNumber: 9,
        title: 'Lace End Turns',
        instruction: 'Lace end turns with cord to prevent movement',
        tip: 'Tight lacing prevents vibration damage',
        duration: '60 min'
      },
      {
        stepNumber: 10,
        title: 'Test Before Varnishing',
        instruction: 'Megger test and surge test before varnishing',
        warning: 'Fix any faults now - very difficult after varnishing',
        tip: 'Surge test detects shorted turns',
        duration: '30 min'
      },
      {
        stepNumber: 11,
        title: 'Varnish Impregnation',
        instruction: 'Vacuum pressure impregnate with Class F/H varnish',
        duration: '120 min'
      },
      {
        stepNumber: 12,
        title: 'Bake',
        instruction: 'Bake in oven per varnish specification (typically 150°C for 4 hours)',
        duration: '240 min'
      },
      {
        stepNumber: 13,
        title: 'Final Test',
        instruction: 'Megger test, surge test, hi-pot test, winding resistance',
        tip: 'Compare resistance to original - should match within 5%',
        duration: '30 min'
      }
    ],
    verificationSteps: [
      'Insulation resistance >10MΩ at 500V (new winding)',
      'Surge test shows no inter-turn faults',
      'Winding resistance balanced within 2%',
      'Hi-pot test passed (2× rated voltage + 1000V for 1 minute)',
      'Motor runs at correct speed and current'
    ],
    commonMistakes: [
      'Incorrect winding data recorded',
      'Wrong wire gauge used',
      'Incorrect number of turns',
      'Wrong coil span',
      'Poor connections causing hot spots',
      'Insufficient varnish penetration'
    ]
  }
];

// ==================== PARTS CATALOG ====================

export const MOTOR_PARTS = [
  {
    partNumber: '6308-2RS',
    name: 'Ball Bearing 6308-2RS',
    description: 'Deep groove ball bearing with rubber seals',
    category: 'Bearings',
    brand: 'SKF/FAG/NSK',
    specifications: {
      'Bore': '40mm',
      'OD': '90mm',
      'Width': '23mm',
      'Dynamic Load': '42.3kN',
      'Speed Limit': '7000 RPM'
    },
    compatibility: ['Motors frame 132-160'],
    priceRange: { min: 1500, max: 3000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day'
  },
  {
    partNumber: '6307-2RS',
    name: 'Ball Bearing 6307-2RS',
    description: 'Deep groove ball bearing with rubber seals',
    category: 'Bearings',
    brand: 'SKF/FAG/NSK',
    specifications: {
      'Bore': '35mm',
      'OD': '80mm',
      'Width': '21mm'
    },
    compatibility: ['Motors frame 112-132'],
    priceRange: { min: 1200, max: 2500, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day'
  },
  {
    partNumber: 'NOMEX-410-0.25',
    name: 'Nomex 410 Slot Insulation',
    description: 'Aramid paper slot insulation 0.25mm',
    category: 'Insulation',
    brand: 'DuPont',
    specifications: {
      'Thickness': '0.25mm',
      'Thermal Class': '220°C (Class R)',
      'Dielectric Strength': '24kV/mm'
    },
    compatibility: ['All motors'],
    priceRange: { min: 5000, max: 8000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    notes: 'Per roll (50m)'
  },
  {
    partNumber: 'WIRE-CLASS-F',
    name: 'Enameled Copper Wire Class F',
    description: 'Magnet wire for motor rewinding',
    category: 'Winding Wire',
    brand: 'Various',
    specifications: {
      'Conductor': 'Electrolytic copper',
      'Insulation': 'Polyester-imide',
      'Thermal Class': 'F (155°C)',
      'Sizes': '0.5mm to 4mm diameter'
    },
    compatibility: ['All motors'],
    priceRange: { min: 2000, max: 15000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    notes: 'Price per kg, varies by diameter'
  },
  {
    partNumber: 'VARNISH-1110',
    name: 'Impregnating Varnish Class H',
    description: 'Polyester varnish for winding impregnation',
    category: 'Varnish',
    brand: 'Various',
    specifications: {
      'Thermal Class': 'H (180°C)',
      'Type': 'Solventless polyester',
      'Cure': '4 hours at 150°C'
    },
    compatibility: ['All motors'],
    priceRange: { min: 8000, max: 15000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 days',
    notes: 'Per 5L can'
  }
];

// ==================== MAINTENANCE ====================

export const MOTOR_MAINTENANCE = [
  {
    id: 'motor-monthly',
    serviceId: 'motors-rewinding',
    name: 'Motor Monthly Inspection',
    description: 'Basic monthly inspection for motors',
    frequency: 'monthly',
    estimatedDuration: '15 minutes per motor',
    requiredTools: ['Clamp meter', 'Infrared thermometer', 'Visual'],
    tasks: [
      {
        id: 'm1',
        name: 'Visual Inspection',
        description: 'Check for damage, dirt, oil leaks',
        procedure: ['Check motor exterior', 'Check ventilation openings', 'Check cable entries'],
        acceptanceCriteria: 'Clean, no damage, vents clear',
        category: 'preventive',
        priority: 'medium'
      },
      {
        id: 'm2',
        name: 'Temperature Check',
        description: 'Measure bearing and winding temperature',
        procedure: ['Measure with IR thermometer', 'Compare to historical values'],
        acceptanceCriteria: 'Bearings <70°C, frame <Class temp',
        category: 'predictive',
        priority: 'high'
      },
      {
        id: 'm3',
        name: 'Current Check',
        description: 'Measure and record running current',
        procedure: ['Clamp all three phases', 'Check balance', 'Compare to FLC'],
        acceptanceCriteria: 'Current ≤FLC, phases within 5%',
        category: 'predictive',
        priority: 'high'
      }
    ]
  },
  {
    id: 'motor-annual',
    serviceId: 'motors-rewinding',
    name: 'Motor Annual Service',
    description: 'Comprehensive annual motor service',
    frequency: 'annually',
    estimatedDuration: '2-4 hours',
    requiredTools: ['Insulation tester', 'Vibration meter', 'Bearing grease', 'Tools'],
    tasks: [
      {
        id: 'a1',
        name: 'Insulation Test',
        description: 'Megger test winding insulation',
        procedure: ['Isolate motor', 'Test each phase to earth at 500V', 'Calculate PI if required'],
        acceptanceCriteria: '>1MΩ minimum, ideally >100MΩ per kV + 1MΩ',
        category: 'preventive',
        priority: 'critical'
      },
      {
        id: 'a2',
        name: 'Vibration Analysis',
        description: 'Measure and analyze vibration',
        procedure: ['Measure at DE and NDE', 'Horizontal, vertical, axial', 'Compare to baseline'],
        acceptanceCriteria: 'Velocity <4.5mm/s RMS for general purpose',
        category: 'predictive',
        priority: 'high'
      },
      {
        id: 'a3',
        name: 'Bearing Lubrication',
        description: 'Regrease bearings if grease fittings provided',
        procedure: ['Calculate grease quantity', 'Add grease slowly while running', 'Do not over-grease'],
        acceptanceCriteria: 'Bearing temperature stable after greasing',
        category: 'preventive',
        priority: 'high',
        notes: 'Do NOT grease sealed bearings (2RS)'
      },
      {
        id: 'a4',
        name: 'Alignment Check',
        description: 'Check motor-to-load alignment',
        procedure: ['Use dial indicator or laser', 'Check angular and offset', 'Adjust as needed'],
        acceptanceCriteria: 'Within coupling manufacturer tolerance',
        category: 'preventive',
        priority: 'high'
      }
    ]
  }
];

export default {
  schematics: MOTOR_SCHEMATICS,
  wiringDiagrams: MOTOR_WIRING,
  troubleshooting: MOTOR_TROUBLESHOOTING,
  repairs: MOTOR_REPAIRS,
  parts: MOTOR_PARTS,
  maintenance: MOTOR_MAINTENANCE
};
