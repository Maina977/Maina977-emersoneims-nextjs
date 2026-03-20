/**
 * Hospital Incinerators Service - Technical Bible
 * Comprehensive documentation for medical waste incineration systems
 */

import { ServiceDocumentation, IEC_WIRE_COLORS } from '../technicalBible';

export const hospitalIncineratorsService: ServiceDocumentation = {
  id: 'hospital-incinerators',
  name: 'Hospital Incinerators',
  description: 'Medical waste incineration systems installation, operation, maintenance, and repair',
  icon: '🔥',

  schematics: [
    {
      id: 'dual-chamber-incinerator',
      name: 'Dual Chamber Incinerator System',
      description: 'Two-stage medical waste incineration system with primary and secondary chambers',
      category: 'system-overview',
      imageUrl: '/images/technical/incinerator-dual-chamber.svg',
      components: [
        { id: 'primary-chamber', name: 'Primary Chamber', description: 'Initial combustion chamber, 600-800°C', position: { x: 30, y: 50 } },
        { id: 'secondary-chamber', name: 'Secondary Chamber', description: 'After-burner chamber, 1000-1100°C minimum', position: { x: 60, y: 35 } },
        { id: 'primary-burner', name: 'Primary Burner', description: 'Diesel/gas burner for primary chamber', position: { x: 15, y: 50 } },
        { id: 'secondary-burner', name: 'Secondary Burner', description: 'After-burner for complete combustion', position: { x: 45, y: 35 } },
        { id: 'loading-door', name: 'Loading Door', description: 'Hydraulic or manual waste loading door', position: { x: 30, y: 70 } },
        { id: 'ash-door', name: 'Ash Removal Door', description: 'Bottom door for ash extraction', position: { x: 30, y: 85 } },
        { id: 'stack', name: 'Chimney Stack', description: 'Exhaust stack with emission monitoring', position: { x: 80, y: 15 } },
        { id: 'control-panel', name: 'Control Panel', description: 'PLC-based combustion control system', position: { x: 10, y: 25 } },
        { id: 'blower', name: 'Combustion Air Blower', description: 'Forced draft air supply', position: { x: 20, y: 65 } }
      ],
      annotations: [
        { id: 'residence-time', text: 'Gas Residence Time: >2 seconds at 1100°C', position: { x: 60, y: 50 }, color: 'orange' },
        { id: 'emission-standard', text: 'Meets WHO/NEMA Emission Standards', position: { x: 80, y: 5 }, color: 'green' },
        { id: 'waste-flow', text: 'Waste → Primary (pyrolysis) → Secondary (oxidation) → Clean Exhaust', position: { x: 50, y: 95 } }
      ]
    },
    {
      id: 'burner-assembly',
      name: 'Diesel Burner Assembly',
      description: 'Pressure jet diesel burner for incinerator',
      category: 'component-detail',
      imageUrl: '/images/technical/incinerator-burner.svg',
      components: [
        { id: 'fuel-pump', name: 'Fuel Pump', description: 'Gear pump, 100-300 psi output', position: { x: 15, y: 50 } },
        { id: 'nozzle', name: 'Atomizing Nozzle', description: 'Spray nozzle, sizes 0.5-3.0 GPH', position: { x: 75, y: 50 } },
        { id: 'solenoid', name: 'Fuel Solenoid Valve', description: 'NC solenoid for fuel shutoff', position: { x: 40, y: 50 } },
        { id: 'igniter', name: 'Ignition Electrode', description: 'High voltage spark igniter', position: { x: 70, y: 35 } },
        { id: 'flame-eye', name: 'Flame Detector', description: 'UV or IR flame sensor', position: { x: 85, y: 45 } },
        { id: 'air-damper', name: 'Air Damper', description: 'Combustion air adjustment', position: { x: 25, y: 65 } },
        { id: 'burner-motor', name: 'Burner Motor', description: 'Drives pump and fan', position: { x: 10, y: 50 } },
        { id: 'blast-tube', name: 'Blast Tube', description: 'Directs flame into chamber', position: { x: 60, y: 50 } }
      ],
      annotations: [
        { id: 'ignition-sequence', text: 'Pre-purge → Ignition → Flame prove → Run', position: { x: 50, y: 90 } },
        { id: 'lockout', text: 'Lockout if no flame in 10 seconds', position: { x: 85, y: 60 }, color: 'red' }
      ]
    },
    {
      id: 'emission-control',
      name: 'Emission Control System',
      description: 'Air pollution control devices for incinerator exhaust',
      category: 'system-overview',
      imageUrl: '/images/technical/incinerator-emission.svg',
      components: [
        { id: 'quench-tower', name: 'Quench Tower', description: 'Rapid gas cooling with water spray', position: { x: 20, y: 50 } },
        { id: 'scrubber', name: 'Wet Scrubber', description: 'Removes acid gases (HCl, SO2)', position: { x: 40, y: 50 } },
        { id: 'baghouse', name: 'Baghouse Filter', description: 'Particulate removal, fabric filters', position: { x: 60, y: 50 } },
        { id: 'activated-carbon', name: 'Activated Carbon Bed', description: 'Dioxin and mercury removal', position: { x: 75, y: 50 } },
        { id: 'id-fan', name: 'Induced Draft Fan', description: 'Maintains negative pressure', position: { x: 90, y: 50 } },
        { id: 'stack', name: 'Emission Stack', description: 'With CEMS monitoring', position: { x: 95, y: 30 } },
        { id: 'cems', name: 'CEMS System', description: 'Continuous Emission Monitoring', position: { x: 90, y: 15 } }
      ],
      annotations: [
        { id: 'temp-drop', text: 'Gas temp: 1100°C → 200°C in <2 sec', position: { x: 20, y: 35 }, color: 'blue' },
        { id: 'particulate', text: 'Particulate: <10 mg/Nm³', position: { x: 60, y: 35 }, color: 'green' },
        { id: 'dioxin', text: 'Dioxin: <0.1 ng TEQ/Nm³', position: { x: 75, y: 35 }, color: 'green' }
      ]
    },
    {
      id: 'control-system',
      name: 'Incinerator Control System',
      description: 'PLC-based combustion control architecture',
      category: 'block-diagram',
      imageUrl: '/images/technical/incinerator-control.svg',
      components: [
        { id: 'plc', name: 'PLC Controller', description: 'Main logic controller', position: { x: 50, y: 50 } },
        { id: 'hmi', name: 'HMI Touch Panel', description: 'Operator interface', position: { x: 50, y: 20 } },
        { id: 'temp-primary', name: 'Primary Temp Sensor', description: 'K-type thermocouple', position: { x: 20, y: 40 } },
        { id: 'temp-secondary', name: 'Secondary Temp Sensor', description: 'K-type thermocouple', position: { x: 20, y: 60 } },
        { id: 'pressure', name: 'Draft Pressure Sensor', description: 'Differential pressure transmitter', position: { x: 20, y: 80 } },
        { id: 'flame-1', name: 'Primary Flame Detector', description: 'UV sensor', position: { x: 80, y: 40 } },
        { id: 'flame-2', name: 'Secondary Flame Detector', description: 'UV sensor', position: { x: 80, y: 60 } },
        { id: 'door-switch', name: 'Door Interlock Switches', description: 'Safety interlocks', position: { x: 80, y: 80 } }
      ],
      annotations: [
        { id: 'safety', text: 'Failsafe: Any sensor failure = Safe shutdown', position: { x: 50, y: 90 }, color: 'red' },
        { id: 'modbus', text: 'Modbus RTU to BMS', position: { x: 50, y: 10 }, color: 'blue' }
      ]
    }
  ],

  wiringDiagrams: [
    {
      id: 'incinerator-power',
      name: 'Incinerator Power Distribution',
      description: 'Three-phase power wiring for incinerator system',
      systemType: 'Three Phase 380-415V',
      wires: [
        {
          id: 'L1-main',
          from: 'Main Isolator',
          to: 'Control Panel Bus L1',
          color: IEC_WIRE_COLORS.L1,
          gauge: '16mm²',
          function: 'Phase 1 main supply',
          notes: 'Size based on total connected load'
        },
        {
          id: 'L2-main',
          from: 'Main Isolator',
          to: 'Control Panel Bus L2',
          color: IEC_WIRE_COLORS.L2,
          gauge: '16mm²',
          function: 'Phase 2 main supply',
          notes: 'Balance loads across phases'
        },
        {
          id: 'L3-main',
          from: 'Main Isolator',
          to: 'Control Panel Bus L3',
          color: IEC_WIRE_COLORS.L3,
          gauge: '16mm²',
          function: 'Phase 3 main supply',
          notes: 'Include phase monitor relay'
        },
        {
          id: 'N-main',
          from: 'Main Isolator',
          to: 'Control Panel Bus N',
          color: IEC_WIRE_COLORS.NEUTRAL,
          gauge: '16mm²',
          function: 'Neutral',
          notes: 'Required for single-phase control loads'
        },
        {
          id: 'PE-main',
          from: 'Earth Bar',
          to: 'Control Panel Earth',
          color: IEC_WIRE_COLORS.PE,
          gauge: '16mm²',
          function: 'Protective earth',
          notes: 'Bond all metal parts to earth'
        },
        {
          id: 'blower-L1',
          from: 'Blower Contactor T1',
          to: 'Blower Motor U',
          color: IEC_WIRE_COLORS.L1,
          gauge: '4mm²',
          function: 'Blower motor phase 1',
          notes: 'Use fire-rated cable near chamber'
        },
        {
          id: 'blower-L2',
          from: 'Blower Contactor T2',
          to: 'Blower Motor V',
          color: IEC_WIRE_COLORS.L2,
          gauge: '4mm²',
          function: 'Blower motor phase 2',
          notes: 'Verify rotation direction'
        },
        {
          id: 'blower-L3',
          from: 'Blower Contactor T3',
          to: 'Blower Motor W',
          color: IEC_WIRE_COLORS.L3,
          gauge: '4mm²',
          function: 'Blower motor phase 3',
          notes: 'Include thermal overload'
        }
      ],
      safetyNotes: [
        'Main isolator must be lockable for maintenance',
        'Emergency stop buttons at loading door and control panel',
        'All motors must have thermal overload protection',
        'Use fire-rated cables within 2m of combustion chamber',
        'Maintain separation between power and signal cables'
      ],
      tools: ['Multimeter', 'Clamp meter', 'Phase sequence meter', 'Megger', 'Torque screwdriver']
    },
    {
      id: 'burner-control',
      name: 'Burner Control Circuit',
      description: 'Safety interlock wiring for diesel burner',
      systemType: 'Low Voltage Control (24VDC)',
      wires: [
        {
          id: '24V-supply',
          from: 'Power Supply +24V',
          to: 'Safety Loop Start',
          color: 'Red',
          gauge: '1.5mm²',
          function: '24V DC control power',
          notes: 'Fused at 5A'
        },
        {
          id: 'e-stop',
          from: 'Safety Loop',
          to: 'Emergency Stop (NC)',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Emergency stop interlock',
          notes: 'Series connection, NC contact'
        },
        {
          id: 'door-interlock',
          from: 'E-Stop',
          to: 'Door Interlock Switch (NC)',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Door safety interlock',
          notes: 'Prevents operation with door open'
        },
        {
          id: 'high-temp',
          from: 'Door Switch',
          to: 'High Temp Limit (NC)',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Over-temperature protection',
          notes: 'Manual reset type, trips at 1200°C'
        },
        {
          id: 'low-fuel',
          from: 'High Temp',
          to: 'Low Fuel Level (NC)',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Fuel level interlock',
          notes: 'Prevents dry running'
        },
        {
          id: 'pressure-sw',
          from: 'Low Fuel',
          to: 'Air Pressure Switch (NO)',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Combustion air proving',
          notes: 'Must prove airflow before ignition'
        },
        {
          id: 'flame-signal',
          from: 'Flame Detector',
          to: 'Burner Controller',
          color: 'White',
          gauge: '1.5mm²',
          function: 'Flame sensing signal',
          notes: 'UV sensor output to controller'
        },
        {
          id: 'ignition',
          from: 'Burner Controller',
          to: 'Ignition Transformer',
          color: 'Orange',
          gauge: '2.5mm²',
          function: 'Igniter power',
          notes: '10kV output - HIGH VOLTAGE'
        },
        {
          id: 'fuel-valve',
          from: 'Burner Controller',
          to: 'Fuel Solenoid Valve',
          color: 'Yellow',
          gauge: '1.5mm²',
          function: 'Fuel valve control',
          notes: 'NC valve, energize to open'
        }
      ],
      safetyNotes: [
        'All safety switches in series - break any = shutdown',
        'Never bypass safety interlocks',
        'High voltage present at ignition transformer',
        'Flame failure must trigger lockout within 3 seconds',
        'Manual reset required after lockout'
      ],
      tools: ['Multimeter', 'Combustion analyzer', 'IR thermometer']
    },
    {
      id: 'thermocouple-wiring',
      name: 'Thermocouple Wiring',
      description: 'Temperature sensor connections',
      systemType: 'Instrumentation',
      wires: [
        {
          id: 'tc-primary-pos',
          from: 'Primary TC (+)',
          to: 'PLC AI Ch1 (+)',
          color: 'Yellow',
          gauge: 'K-type extension wire',
          function: 'Primary chamber temperature positive',
          notes: 'Use proper K-type extension wire, not copper'
        },
        {
          id: 'tc-primary-neg',
          from: 'Primary TC (-)',
          to: 'PLC AI Ch1 (-)',
          color: 'Red',
          gauge: 'K-type extension wire',
          function: 'Primary chamber temperature negative',
          notes: 'Observe polarity - reversed = wrong reading'
        },
        {
          id: 'tc-secondary-pos',
          from: 'Secondary TC (+)',
          to: 'PLC AI Ch2 (+)',
          color: 'Yellow',
          gauge: 'K-type extension wire',
          function: 'Secondary chamber temperature positive',
          notes: 'Critical for emission compliance'
        },
        {
          id: 'tc-secondary-neg',
          from: 'Secondary TC (-)',
          to: 'PLC AI Ch2 (-)',
          color: 'Red',
          gauge: 'K-type extension wire',
          function: 'Secondary chamber temperature negative',
          notes: 'Range: 0-1300°C'
        },
        {
          id: 'tc-stack-pos',
          from: 'Stack TC (+)',
          to: 'PLC AI Ch3 (+)',
          color: 'Yellow',
          gauge: 'K-type extension wire',
          function: 'Stack temperature positive',
          notes: 'Required for CEMS compliance'
        },
        {
          id: 'shield',
          from: 'TC Cable Shield',
          to: 'Panel Ground',
          color: 'Bare/Green',
          gauge: 'Shield drain',
          function: 'EMI shielding',
          notes: 'Ground shield at one end only'
        }
      ],
      safetyNotes: [
        'Never use copper wire for thermocouple extension',
        'Route TC cables away from power cables',
        'Use shielded cable in electrically noisy environments',
        'Proper cold junction compensation required',
        'Calibrate annually'
      ],
      tools: ['TC calibrator', 'Multimeter with TC function', 'Temperature simulator']
    }
  ],

  troubleshootingGuides: [
    {
      id: 'burner-no-ignition',
      title: 'Burner Fails to Ignite',
      symptoms: ['Burner motor runs but no flame', 'Ignition spark present but no fire', 'Lockout after ignition attempt'],
      possibleCauses: [
        'No fuel supply',
        'Air in fuel line',
        'Clogged fuel nozzle',
        'Faulty fuel solenoid valve',
        'Incorrect air/fuel ratio',
        'Weak ignition spark',
        'Contaminated fuel'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check fuel level in tank',
          expectedResult: 'Adequate fuel level (>25%)',
          ifFails: 'Refill fuel tank, bleed air from lines'
        },
        {
          step: 2,
          action: 'Verify fuel pressure at burner',
          expectedResult: '100-150 psi (diesel burner typical)',
          ifFails: 'Check pump, filter, lines for blockage'
        },
        {
          step: 3,
          action: 'Inspect fuel nozzle spray pattern',
          expectedResult: 'Fine, even cone spray',
          ifFails: 'Clean or replace nozzle'
        },
        {
          step: 4,
          action: 'Check solenoid valve operation',
          expectedResult: 'Valve clicks open when energized',
          ifFails: 'Check coil continuity, replace if faulty'
        },
        {
          step: 5,
          action: 'Verify spark at electrodes',
          expectedResult: 'Strong blue spark jumping gap',
          ifFails: 'Adjust gap (3-4mm), clean or replace electrodes'
        },
        {
          step: 6,
          action: 'Check ignition transformer output',
          expectedResult: '8-12kV AC at secondary',
          ifFails: 'Replace ignition transformer'
        },
        {
          step: 7,
          action: 'Inspect air damper position',
          expectedResult: 'Correct position for fuel rate',
          ifFails: 'Adjust air damper, verify combustion analysis'
        }
      ],
      solutions: [
        'Bleed air from fuel system',
        'Replace clogged fuel nozzle',
        'Replace faulty solenoid valve',
        'Replace ignition transformer',
        'Adjust air/fuel ratio using combustion analyzer',
        'Replace contaminated fuel, clean tank'
      ]
    },
    {
      id: 'low-secondary-temp',
      title: 'Secondary Chamber Temperature Too Low',
      symptoms: ['Cannot reach 1100°C', 'Emissions exceed limits', 'Incomplete combustion smell'],
      possibleCauses: [
        'Insufficient fuel to secondary burner',
        'Excessive air leakage',
        'Damaged refractory lining',
        'Primary chamber overloaded',
        'Faulty temperature sensor',
        'Control system malfunction'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Verify secondary burner operation',
          expectedResult: 'Strong, stable flame in secondary',
          ifFails: 'Check burner as per ignition troubleshooting'
        },
        {
          step: 2,
          action: 'Inspect for air leaks at doors and seals',
          expectedResult: 'No visible gaps, doors seal tightly',
          ifFails: 'Replace door seals, adjust latches'
        },
        {
          step: 3,
          action: 'Check refractory condition',
          expectedResult: 'No cracks, spalling, or holes',
          ifFails: 'Schedule refractory repair/replacement'
        },
        {
          step: 4,
          action: 'Reduce waste loading rate',
          expectedResult: 'Temperature rises with reduced load',
          ifFails: 'Issue may be burner capacity'
        },
        {
          step: 5,
          action: 'Verify thermocouple accuracy',
          expectedResult: 'Reading matches portable pyrometer',
          ifFails: 'Replace thermocouple'
        },
        {
          step: 6,
          action: 'Check PLC control output to burner',
          expectedResult: 'Modulating output increasing with demand',
          ifFails: 'Check PLC programming and analog output'
        }
      ],
      solutions: [
        'Increase secondary burner fuel rate',
        'Repair air leaks at doors and penetrations',
        'Schedule refractory repair',
        'Reduce waste loading to match capacity',
        'Replace faulty thermocouple',
        'Recalibrate control system'
      ]
    },
    {
      id: 'excessive-smoke',
      title: 'Excessive Smoke from Stack',
      symptoms: ['Visible black smoke', 'Complaints from neighbors', 'Opacity meter alarm'],
      possibleCauses: [
        'Insufficient secondary chamber temperature',
        'Overloaded primary chamber',
        'Improper waste segregation',
        'Air supply insufficient',
        'Malfunctioning emission control equipment'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check secondary chamber temperature',
          expectedResult: '>1100°C (minimum for complete combustion)',
          ifFails: 'Increase secondary burner firing rate'
        },
        {
          step: 2,
          action: 'Review waste loading records',
          expectedResult: 'Within rated capacity, proper segregation',
          ifFails: 'Reduce loading rate, improve segregation'
        },
        {
          step: 3,
          action: 'Verify combustion air flow',
          expectedResult: 'Adequate draft, blower operating correctly',
          ifFails: 'Check blower, clean air intakes, adjust dampers'
        },
        {
          step: 4,
          action: 'Check residence time',
          expectedResult: '>2 seconds in secondary at 1100°C',
          ifFails: 'Reduce waste feed rate'
        },
        {
          step: 5,
          action: 'Inspect scrubber operation',
          expectedResult: 'Water circulating, spray nozzles clear',
          ifFails: 'Clean nozzles, check pump, refill water'
        },
        {
          step: 6,
          action: 'Check baghouse differential pressure',
          expectedResult: 'Within normal range (50-150mm WC)',
          ifFails: 'Replace filter bags, check for holes'
        }
      ],
      solutions: [
        'Maintain secondary temperature >1100°C',
        'Enforce proper waste segregation',
        'Reduce waste feed rate',
        'Repair air supply system',
        'Service emission control equipment',
        'Train operators on proper loading technique'
      ]
    },
    {
      id: 'flame-failure',
      title: 'Flame Failure During Operation',
      symptoms: ['Burner shuts down unexpectedly', 'Flame failure alarm', 'Lockout condition'],
      possibleCauses: [
        'Fuel supply interruption',
        'Dirty flame detector',
        'Fuel nozzle partially blocked',
        'Air supply fluctuation',
        'Control board malfunction',
        'Electrical interference'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check for fuel supply interruption',
          expectedResult: 'Steady fuel pressure, tank not empty',
          ifFails: 'Refill tank, check for blockages'
        },
        {
          step: 2,
          action: 'Clean flame detector lens',
          expectedResult: 'Clear, unobstructed lens',
          ifFails: 'Clean with soft cloth, replace if damaged'
        },
        {
          step: 3,
          action: 'Verify flame detector signal',
          expectedResult: 'Strong signal when flame present',
          ifFails: 'Replace flame detector'
        },
        {
          step: 4,
          action: 'Check air supply stability',
          expectedResult: 'Consistent airflow, no surging',
          ifFails: 'Check blower, damper position, filter'
        },
        {
          step: 5,
          action: 'Review control panel for errors',
          expectedResult: 'No fault codes',
          ifFails: 'Address specific fault code'
        },
        {
          step: 6,
          action: 'Check for electrical noise',
          expectedResult: 'Signal cables properly shielded',
          ifFails: 'Improve cable routing and shielding'
        }
      ],
      solutions: [
        'Ensure stable fuel supply',
        'Clean or replace flame detector',
        'Stabilize combustion air supply',
        'Shield signal cables from interference',
        'Replace faulty control components'
      ]
    }
  ],

  repairProcedures: [
    {
      id: 'refractory-repair',
      title: 'Refractory Lining Repair',
      difficulty: 'Expert',
      estimatedTime: '2-5 days (including cure time)',
      requiredTools: [
        'Cold chisel and hammer',
        'Wire brush',
        'Mixing paddle and drill',
        'Trowels (various sizes)',
        'Refractory anchor installation tools',
        'Water spray bottle',
        'Temperature monitoring equipment',
        'PPE (heat-resistant gloves, face shield, respirator)'
      ],
      requiredParts: [
        'Castable refractory (1400°C rated)',
        'Refractory mortar',
        'Ceramic fiber blanket',
        'Stainless steel anchors',
        'Plastic sheeting for curing'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Cool Down and Inspection',
          instruction: 'Allow incinerator to cool completely (<50°C). Inspect all refractory surfaces, mark damaged areas.',
          warnings: ['Never work on hot refractory - severe burn risk', 'Use dust mask - silica hazard'],
          tips: ['Take photos for documentation']
        },
        {
          stepNumber: 2,
          title: 'Remove Damaged Material',
          instruction: 'Chip out all loose, cracked, or spalled refractory back to sound material. Square up repair edges.',
          warnings: ['Wear eye protection', 'Work in well-ventilated area'],
          tips: ['Depth should be minimum 25mm for castable repairs']
        },
        {
          stepNumber: 3,
          title: 'Install Anchors (if needed)',
          instruction: 'For large repairs, weld stainless steel anchors to shell. Space 200-300mm apart in grid pattern.',
          warnings: ['Ensure shell is not burned through'],
          tips: ['V-shaped or Y-shaped anchors work best']
        },
        {
          stepNumber: 4,
          title: 'Mix Castable',
          instruction: 'Mix castable refractory per manufacturer instructions. Use exact water ratio. Mix only what can be placed in 20 minutes.',
          warnings: ['Too much water weakens refractory', 'Do not remix after initial set'],
          tips: ['Use clean tools and water']
        },
        {
          stepNumber: 5,
          title: 'Apply Castable',
          instruction: 'Dampen repair area. Pack castable firmly, working from bottom up. Use trowel to smooth surface. For vertical repairs, apply in layers.',
          warnings: ['Avoid air pockets'],
          tips: ['Ram material firmly around anchors']
        },
        {
          stepNumber: 6,
          title: 'Initial Cure',
          instruction: 'Cover with plastic sheeting. Keep moist for 24-48 hours. Ambient temperature should be >10°C.',
          warnings: ['Do not fire until properly cured'],
          tips: ['Light mist spray if needed to keep moist']
        },
        {
          stepNumber: 7,
          title: 'Controlled Dry-Out',
          instruction: 'Remove plastic. Allow air dry 24 hours. Then heat slowly: 50°C/hour to 250°C, hold 4 hours. Then 50°C/hour to 500°C, hold 4 hours.',
          warnings: ['Rapid heating causes steam explosion', 'Vent doors during initial heat-up'],
          tips: ['Use thermocouple to monitor ramp rate']
        },
        {
          stepNumber: 8,
          title: 'Full Cure Firing',
          instruction: 'Continue heating 50°C/hour to operating temperature. Hold at operating temperature for 4 hours. Refractory is now cured.',
          warnings: ['Never exceed refractory rated temperature'],
          tips: ['Document cure cycle for records']
        }
      ],
      qualityChecks: [
        'No cracks after cure cycle',
        'Tap test: solid sound, not hollow',
        'No delamination at edges',
        'Surface hard and dense',
        'Color uniform (varies by material)'
      ]
    },
    {
      id: 'burner-service',
      title: 'Diesel Burner Annual Service',
      difficulty: 'Intermediate',
      estimatedTime: '2-4 hours',
      requiredTools: [
        'Combustion analyzer',
        'Fuel pressure gauge',
        'Electrode setting gauge',
        'Nozzle wrench',
        'Screwdrivers and wrenches',
        'Wire brush and cleaning supplies',
        'Multimeter'
      ],
      requiredParts: [
        'Fuel nozzle (annual replacement)',
        'Fuel filter',
        'Ignition electrodes (if worn)',
        'Photocell/flame detector (inspect, replace if needed)',
        'Pump strainer',
        'Gaskets'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Isolate and Lock Out',
          instruction: 'Turn off fuel supply. Isolate electrical supply. Lock out and tag all energy sources.',
          warnings: ['Verify zero energy before proceeding'],
          tips: ['Follow facility LOTO procedure']
        },
        {
          stepNumber: 2,
          title: 'Remove Burner Assembly',
          instruction: 'Disconnect fuel line, electrical connections. Remove mounting bolts. Slide burner out from mounting flange.',
          warnings: ['Burner is heavy - may need assistance'],
          tips: ['Note orientation and alignment']
        },
        {
          stepNumber: 3,
          title: 'Replace Fuel Nozzle',
          instruction: 'Remove and discard old nozzle. Install new nozzle of correct size and spray pattern. Torque to specification.',
          warnings: ['Do not over-tighten - damages sealing surface'],
          tips: ['Verify nozzle matches burner specification']
        },
        {
          stepNumber: 4,
          title: 'Inspect and Set Electrodes',
          instruction: 'Check electrode tips for wear. Replace if eroded. Set gap per manufacturer spec (typically 3-4mm).',
          warnings: ['Ceramic insulators are fragile'],
          tips: ['Use electrode setting gauge for accuracy']
        },
        {
          stepNumber: 5,
          title: 'Clean Photocell/Flame Detector',
          instruction: 'Remove flame detector. Clean lens with soft cloth and appropriate cleaner. Check wiring condition.',
          warnings: ['Do not use abrasive cleaners'],
          tips: ['Replace if lens is cracked or discolored']
        },
        {
          stepNumber: 6,
          title: 'Service Fuel Pump',
          instruction: 'Replace pump strainer. Check pump pressure. Adjust if needed. Replace pump filter.',
          warnings: ['Contain any fuel spillage'],
          tips: ['Note pressure before and after for records']
        },
        {
          stepNumber: 7,
          title: 'Clean Air Passages',
          instruction: 'Clean blast tube interior. Check air damper movement. Clean combustion air inlet filter/screen.',
          warnings: ['Ensure no loose debris enters chamber'],
          tips: ['Vacuum debris, do not blow into chamber']
        },
        {
          stepNumber: 8,
          title: 'Reinstall and Test',
          instruction: 'Reinstall burner. Reconnect fuel and electrical. Remove lockout. Start burner and verify operation.',
          warnings: ['Watch for fuel leaks'],
          tips: ['Let burner run through complete cycle']
        },
        {
          stepNumber: 9,
          title: 'Combustion Analysis',
          instruction: 'Use combustion analyzer to check: CO2 (11-13%), O2 (3-6%), CO (<100ppm), smoke (0-1). Adjust air damper as needed.',
          warnings: ['Incomplete combustion produces CO - dangerous'],
          tips: ['Document readings for comparison over time']
        }
      ],
      qualityChecks: [
        'Burner starts and proves flame reliably',
        'Combustion readings within specification',
        'No fuel leaks',
        'Flame detector responds correctly',
        'No abnormal sounds or vibration'
      ]
    },
    {
      id: 'thermocouple-replacement',
      title: 'Thermocouple Replacement',
      difficulty: 'Basic',
      estimatedTime: '1-2 hours',
      requiredTools: [
        'Wrenches (for compression fittings)',
        'Screwdrivers',
        'Wire cutters/strippers',
        'Multimeter with TC function',
        'Portable thermometer for verification'
      ],
      requiredParts: [
        'K-type thermocouple (correct length and sheath material)',
        'K-type extension wire (if needed)',
        'Compression fitting/thermowell'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Identify Correct Replacement',
          instruction: 'Verify thermocouple type (K, J, etc.), length, sheath diameter, and connection type match existing unit.',
          warnings: ['Wrong type gives incorrect readings'],
          tips: ['K-type is most common for incinerators (yellow/red wires)']
        },
        {
          stepNumber: 2,
          title: 'Cool Chamber',
          instruction: 'Allow chamber to cool to safe handling temperature (<50°C) or use appropriate PPE for warm work.',
          warnings: ['Thermocouples and thermowells retain heat'],
          tips: ['Work on cool unit when possible']
        },
        {
          stepNumber: 3,
          title: 'Disconnect at Panel',
          instruction: 'At PLC or transmitter, disconnect existing thermocouple wires. Note terminal positions.',
          warnings: ['Observe polarity'],
          tips: ['Label wires if not already marked']
        },
        {
          stepNumber: 4,
          title: 'Remove Old Thermocouple',
          instruction: 'Loosen compression fitting or unscrew from thermowell. Withdraw thermocouple from chamber.',
          warnings: ['Tip may be brittle if from high-temp service'],
          tips: ['If stuck, do not force - may need to replace thermowell']
        },
        {
          stepNumber: 5,
          title: 'Install New Thermocouple',
          instruction: 'Insert new thermocouple to correct depth. Secure with compression fitting. Do not over-tighten.',
          warnings: ['Proper insertion depth critical for accurate reading'],
          tips: ['Mark depth on new TC before insertion']
        },
        {
          stepNumber: 6,
          title: 'Connect Wiring',
          instruction: 'Route extension wire to panel. Connect positive to positive (yellow to yellow for K-type).',
          warnings: ['Reversed polarity gives wrong reading direction'],
          tips: ['Use proper TC extension wire, not copper']
        },
        {
          stepNumber: 7,
          title: 'Verify Operation',
          instruction: 'Power on system. Verify reading at ambient temperature makes sense. Heat chamber and verify reading increases.',
          warnings: ['Faulty TC can give normal room temp but fail at high temp'],
          tips: ['Compare to adjacent TC or portable pyrometer']
        }
      ],
      qualityChecks: [
        'Reading matches reference thermometer at ambient',
        'Reading tracks properly as temperature changes',
        'No error codes from PLC',
        'Compression fitting is leak-tight',
        'Extension wire properly routed and secured'
      ]
    }
  ],

  partsReference: [
    {
      id: 'burner-nozzles',
      name: 'Burner Nozzles',
      category: 'Burner Components',
      variants: [
        { partNumber: 'NOZ-0.75-60', description: 'Fuel Nozzle 0.75 GPH 60°', specifications: '0.75 GPH, 60° spray, hollow cone', compatibleModels: ['Small incinerators 50-100kg/hr'], price: 35 },
        { partNumber: 'NOZ-1.5-60', description: 'Fuel Nozzle 1.5 GPH 60°', specifications: '1.5 GPH, 60° spray, hollow cone', compatibleModels: ['Medium incinerators 100-200kg/hr'], price: 35 },
        { partNumber: 'NOZ-2.5-60', description: 'Fuel Nozzle 2.5 GPH 60°', specifications: '2.5 GPH, 60° spray, hollow cone', compatibleModels: ['Large incinerators 200-500kg/hr'], price: 40 },
        { partNumber: 'NOZ-3.5-80', description: 'Fuel Nozzle 3.5 GPH 80°', specifications: '3.5 GPH, 80° spray, hollow cone', compatibleModels: ['Very large units'], price: 45 }
      ],
      imageUrl: '/images/parts/burner-nozzle.webp',
      supplier: 'Incinerator Spares Ltd',
      leadTime: '3-5 days'
    },
    {
      id: 'thermocouples',
      name: 'High Temperature Thermocouples',
      category: 'Instrumentation',
      variants: [
        { partNumber: 'TC-K-300', description: 'K-Type TC 300mm Inconel', specifications: 'K-type, 300mm length, Inconel 600 sheath, 0-1200°C', compatibleModels: ['All incinerators'], price: 85 },
        { partNumber: 'TC-K-500', description: 'K-Type TC 500mm Inconel', specifications: 'K-type, 500mm length, Inconel 600 sheath, 0-1200°C', compatibleModels: ['Large chamber penetration'], price: 110 },
        { partNumber: 'TC-N-300', description: 'N-Type TC 300mm', specifications: 'N-type, 300mm length, for higher accuracy', compatibleModels: ['CEMS applications'], price: 120 }
      ],
      imageUrl: '/images/parts/thermocouple-incinerator.webp',
      supplier: 'Instrumentation Supplies Kenya',
      leadTime: '2-3 days'
    },
    {
      id: 'flame-detectors',
      name: 'Flame Detectors',
      category: 'Safety Devices',
      variants: [
        { partNumber: 'FD-UV-SIEMENS', description: 'Siemens QRA UV Detector', specifications: 'UV flame detector, self-checking', compatibleModels: ['Siemens burner controls'], price: 350 },
        { partNumber: 'FD-UV-HONEYWELL', description: 'Honeywell C7027 UV Detector', specifications: 'UV minipeeper, 1/2" mount', compatibleModels: ['Honeywell controls'], price: 280 },
        { partNumber: 'FD-IR-FIREYE', description: 'Fireye IR Detector', specifications: 'Infrared detector for oil flames', compatibleModels: ['Fireye systems'], price: 320 }
      ],
      imageUrl: '/images/parts/flame-detector.webp',
      supplier: 'Combustion Controls Ltd',
      leadTime: '5-7 days'
    },
    {
      id: 'ignition-transformers',
      name: 'Ignition Transformers',
      category: 'Burner Components',
      variants: [
        { partNumber: 'IGN-TRANS-10KV', description: 'Ignition Transformer 10kV', specifications: '220V primary, 10kV secondary, 23mA', compatibleModels: ['Most oil burners'], price: 150 },
        { partNumber: 'IGN-TRANS-12KV', description: 'Ignition Transformer 12kV', specifications: '220V primary, 12kV secondary, 20mA', compatibleModels: ['Heavy oil applications'], price: 180 }
      ],
      imageUrl: '/images/parts/ignition-transformer.webp',
      supplier: 'Incinerator Spares Ltd',
      leadTime: '5-7 days'
    },
    {
      id: 'refractory-materials',
      name: 'Refractory Materials',
      category: 'Consumables',
      variants: [
        { partNumber: 'REF-CAST-1400', description: 'Castable Refractory 1400°C', specifications: '25kg bag, 1400°C rating, dense castable', compatibleModels: ['Primary chamber repairs'], price: 85 },
        { partNumber: 'REF-CAST-1600', description: 'Castable Refractory 1600°C', specifications: '25kg bag, 1600°C rating, high alumina', compatibleModels: ['Secondary chamber, high stress areas'], price: 120 },
        { partNumber: 'REF-FIBER-1260', description: 'Ceramic Fiber Blanket', specifications: '25mm thick, 1260°C, 7.6m roll', compatibleModels: ['Insulation, backing'], price: 95 },
        { partNumber: 'REF-MORTAR', description: 'Refractory Mortar', specifications: '25kg bucket, air-setting', compatibleModels: ['Brick joints, minor repairs'], price: 45 }
      ],
      imageUrl: '/images/parts/refractory-material.webp',
      supplier: 'Refractory Solutions EA',
      leadTime: '3-5 days'
    },
    {
      id: 'fuel-pumps',
      name: 'Fuel Pumps',
      category: 'Burner Components',
      variants: [
        { partNumber: 'PUMP-SUNTEC-A2', description: 'Suntec A2 Fuel Pump', specifications: 'Single stage, 100PSI, 3GPH', compatibleModels: ['Small-medium burners'], price: 220 },
        { partNumber: 'PUMP-DANFOSS-BFP', description: 'Danfoss BFP Pump', specifications: 'Two stage, 150PSI, 5GPH', compatibleModels: ['Medium-large burners'], price: 280 },
        { partNumber: 'PUMP-WEBSTER-2M', description: 'Webster 2M Pump', specifications: 'Single stage, 100PSI, 3GPH', compatibleModels: ['Various burners'], price: 200 }
      ],
      imageUrl: '/images/parts/fuel-pump.webp',
      supplier: 'Combustion Controls Ltd',
      leadTime: '5-7 days'
    }
  ],

  maintenanceSchedules: [
    {
      id: 'incinerator-daily',
      name: 'Daily Incinerator Checks',
      equipmentType: 'Medical Waste Incinerator',
      tasks: [
        { task: 'Visual inspection of combustion', interval: 'Daily', procedure: 'Observe flame color and stability through sight glass', criticalLevel: 'high' },
        { task: 'Check chamber temperatures', interval: 'Daily', procedure: 'Record primary and secondary temps, verify >1100°C secondary', criticalLevel: 'high' },
        { task: 'Check fuel level', interval: 'Daily', procedure: 'Verify adequate fuel for planned operation', criticalLevel: 'high' },
        { task: 'Remove ash', interval: 'Daily', procedure: 'Allow to cool, remove ash to approved container', criticalLevel: 'medium' },
        { task: 'Check for alarms', interval: 'Daily', procedure: 'Review any logged alarms, investigate causes', criticalLevel: 'high' },
        { task: 'Inspect loading area', interval: 'Daily', procedure: 'Clean up any spilled waste, check door seals', criticalLevel: 'medium' },
        { task: 'Log operating hours', interval: 'Daily', procedure: 'Record hours for maintenance scheduling', criticalLevel: 'low' }
      ],
      notes: 'Operator training required. Keep detailed logs for regulatory compliance.'
    },
    {
      id: 'incinerator-weekly',
      name: 'Weekly Incinerator Maintenance',
      equipmentType: 'Medical Waste Incinerator',
      tasks: [
        { task: 'Clean flame detector lens', interval: 'Weekly', procedure: 'Wipe lens with soft cloth, check alignment', criticalLevel: 'high' },
        { task: 'Check door seals', interval: 'Weekly', procedure: 'Inspect for wear, damage, proper seating', criticalLevel: 'medium' },
        { task: 'Verify safety interlocks', interval: 'Weekly', procedure: 'Test door switch, e-stop, temp limits', criticalLevel: 'high' },
        { task: 'Inspect refractory (visual)', interval: 'Weekly', procedure: 'Look for cracks, spalling through sight glass and doors', criticalLevel: 'medium' },
        { task: 'Check blower operation', interval: 'Weekly', procedure: 'Listen for bearing noise, check belt tension', criticalLevel: 'medium' },
        { task: 'Clean air inlet filters', interval: 'Weekly', procedure: 'Remove and clean or replace combustion air filters', criticalLevel: 'medium' }
      ],
      notes: 'Schedule during non-operating hours. Document all findings.'
    },
    {
      id: 'incinerator-monthly',
      name: 'Monthly Incinerator Service',
      equipmentType: 'Medical Waste Incinerator',
      tasks: [
        { task: 'Combustion analysis', interval: 'Monthly', procedure: 'Test flue gas: O2, CO2, CO. Adjust burners if needed.', criticalLevel: 'high' },
        { task: 'Calibrate temperature instruments', interval: 'Monthly', procedure: 'Verify TC readings against reference, calibrate transmitters', criticalLevel: 'high' },
        { task: 'Inspect fuel system', interval: 'Monthly', procedure: 'Check lines, filters, pumps for leaks and condition', criticalLevel: 'high' },
        { task: 'Test all alarms', interval: 'Monthly', procedure: 'Simulate alarm conditions, verify proper response', criticalLevel: 'high' },
        { task: 'Service scrubber (if equipped)', interval: 'Monthly', procedure: 'Clean spray nozzles, check pump, test pH', criticalLevel: 'medium' },
        { task: 'Inspect stack and CEMS', interval: 'Monthly', procedure: 'Check stack condition, clean CEMS probes', criticalLevel: 'medium' }
      ],
      notes: 'Requires qualified technician. Submit reports to environmental authority.'
    },
    {
      id: 'incinerator-annual',
      name: 'Annual Incinerator Overhaul',
      equipmentType: 'Medical Waste Incinerator',
      tasks: [
        { task: 'Complete refractory inspection', interval: 'Annually', procedure: 'Cool completely, internal inspection, repair as needed', criticalLevel: 'high' },
        { task: 'Burner service', interval: 'Annually', procedure: 'Replace nozzles, electrodes, filters. Full combustion tune-up.', criticalLevel: 'high' },
        { task: 'Electrical system check', interval: 'Annually', procedure: 'Thermography, megger motors, tighten connections', criticalLevel: 'high' },
        { task: 'Control system review', interval: 'Annually', procedure: 'Check PLC, calibrate all instruments, update software', criticalLevel: 'medium' },
        { task: 'Replace door seals', interval: 'Annually', procedure: 'Install new rope seals on all doors', criticalLevel: 'medium' },
        { task: 'Emission stack test', interval: 'Annually', procedure: 'Third-party emission testing per regulations', criticalLevel: 'high' },
        { task: 'Safety system certification', interval: 'Annually', procedure: 'Full test of all safety systems, document results', criticalLevel: 'high' }
      ],
      notes: 'Plan 1-2 week shutdown. Coordinate with waste management for alternative disposal.'
    }
  ]
};

export default hospitalIncineratorsService;
