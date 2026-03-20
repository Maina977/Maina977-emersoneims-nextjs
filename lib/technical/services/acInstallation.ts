/**
 * AC Installation & HVAC Service - Technical Bible
 * Comprehensive documentation for air conditioning systems
 */

// IEC Wire Color Standards (IEC 60446)
const IEC_WIRE_COLORS = {
  L1: 'Brown (L1)',
  L2: 'Black (L2)',
  L3: 'Grey (L3)',
  NEUTRAL: 'Blue (N)',
  PE: 'Green/Yellow (PE)',
};

export const acInstallationService = {
  id: 'ac-installation',
  name: 'AC Installation & HVAC',
  description: 'Complete air conditioning and HVAC system installation, maintenance, and repair',
  icon: '❄️',

  schematics: [
    {
      id: 'split-ac-system',
      name: 'Split AC System Overview',
      description: 'Complete split air conditioning system with indoor and outdoor units',
      category: 'system-overview',
      imageUrl: '/images/technical/ac-split-system.svg',
      components: [
        { id: 'compressor', name: 'Compressor', description: 'Rotary/scroll compressor, heart of the system', position: { x: 75, y: 60 } },
        { id: 'condenser', name: 'Condenser Coil', description: 'Outdoor heat exchanger, releases heat', position: { x: 75, y: 40 } },
        { id: 'evaporator', name: 'Evaporator Coil', description: 'Indoor heat exchanger, absorbs heat', position: { x: 25, y: 40 } },
        { id: 'expansion-valve', name: 'Expansion Valve/Capillary', description: 'Pressure reducer, meters refrigerant', position: { x: 50, y: 50 } },
        { id: 'fan-outdoor', name: 'Condenser Fan', description: 'Axial fan for outdoor heat dissipation', position: { x: 75, y: 25 } },
        { id: 'fan-indoor', name: 'Blower Fan', description: 'Cross-flow blower for air distribution', position: { x: 25, y: 25 } },
        { id: 'filter-drier', name: 'Filter Drier', description: 'Removes moisture and contaminants', position: { x: 60, y: 55 } },
        { id: 'pcb-indoor', name: 'Indoor PCB', description: 'Main control board, receives IR signals', position: { x: 25, y: 70 } },
        { id: 'pcb-outdoor', name: 'Outdoor PCB', description: 'Inverter/compressor control', position: { x: 75, y: 75 } }
      ],
      annotations: [
        { id: 'refrigerant-flow', text: 'Refrigerant Flow: Compressor → Condenser → Expansion → Evaporator → Compressor', position: { x: 50, y: 90 } },
        { id: 'high-pressure', text: 'HIGH PRESSURE SIDE (Hot)', position: { x: 75, y: 50 }, color: 'red' },
        { id: 'low-pressure', text: 'LOW PRESSURE SIDE (Cold)', position: { x: 25, y: 50 }, color: 'blue' }
      ]
    },
    {
      id: 'inverter-ac-block',
      name: 'Inverter AC Block Diagram',
      description: 'DC inverter air conditioner control system',
      category: 'block-diagram',
      imageUrl: '/images/technical/inverter-ac-block.svg',
      components: [
        { id: 'rectifier', name: 'Rectifier Bridge', description: 'AC to DC conversion', position: { x: 20, y: 50 } },
        { id: 'pfc', name: 'Power Factor Correction', description: 'Improves power factor, reduces harmonics', position: { x: 35, y: 50 } },
        { id: 'dc-bus', name: 'DC Bus Capacitors', description: 'Smooths DC voltage, energy storage', position: { x: 50, y: 50 } },
        { id: 'ipm', name: 'IPM Module', description: 'Intelligent Power Module, drives compressor', position: { x: 65, y: 50 } },
        { id: 'compressor-motor', name: 'BLDC Compressor', description: 'Brushless DC motor compressor', position: { x: 80, y: 50 } },
        { id: 'mcu', name: 'Microcontroller', description: 'Main processor, FOC control', position: { x: 50, y: 25 } },
        { id: 'current-sense', name: 'Current Sensors', description: 'Phase current measurement', position: { x: 65, y: 35 } }
      ],
      annotations: [
        { id: 'ac-input', text: '220-240V AC Input', position: { x: 10, y: 50 } },
        { id: 'dc-link', text: 'DC Bus: 310-380V DC', position: { x: 50, y: 65 } },
        { id: 'variable-freq', text: 'Variable Frequency: 15-120Hz', position: { x: 80, y: 65 } }
      ]
    },
    {
      id: 'vrf-system',
      name: 'VRF/VRV System Architecture',
      description: 'Variable Refrigerant Flow multi-zone system',
      category: 'system-overview',
      imageUrl: '/images/technical/vrf-system.svg',
      components: [
        { id: 'outdoor-unit', name: 'VRF Outdoor Unit', description: 'Multiple compressors, heat recovery capable', position: { x: 85, y: 50 } },
        { id: 'branch-controller', name: 'Branch Controller (BS Box)', description: 'Refrigerant distribution control', position: { x: 50, y: 50 } },
        { id: 'indoor-1', name: 'Cassette Unit', description: '4-way ceiling cassette', position: { x: 20, y: 20 } },
        { id: 'indoor-2', name: 'Wall Mount Unit', description: 'High wall split type', position: { x: 20, y: 40 } },
        { id: 'indoor-3', name: 'Ducted Unit', description: 'Concealed ducted system', position: { x: 20, y: 60 } },
        { id: 'indoor-4', name: 'Floor Standing', description: 'Floor console unit', position: { x: 20, y: 80 } },
        { id: 'central-controller', name: 'Central Controller', description: 'BMS integration, scheduling', position: { x: 50, y: 15 } }
      ],
      annotations: [
        { id: 'liquid-line', text: 'Liquid Line (Small Pipe)', position: { x: 65, y: 45 }, color: 'blue' },
        { id: 'gas-line', text: 'Gas Line (Large Pipe)', position: { x: 65, y: 55 }, color: 'red' },
        { id: 'communication', text: 'RS-485 Communication Bus', position: { x: 50, y: 5 }, color: 'green' }
      ]
    },
    {
      id: 'chiller-system',
      name: 'Chiller Plant Schematic',
      description: 'Central chilled water air conditioning system',
      category: 'system-overview',
      imageUrl: '/images/technical/chiller-system.svg',
      components: [
        { id: 'chiller', name: 'Water Chiller', description: 'Screw/centrifugal/scroll chiller', position: { x: 50, y: 70 } },
        { id: 'cooling-tower', name: 'Cooling Tower', description: 'Heat rejection to atmosphere', position: { x: 80, y: 30 } },
        { id: 'ahu', name: 'Air Handling Unit', description: 'Central air distribution', position: { x: 20, y: 30 } },
        { id: 'fcu', name: 'Fan Coil Units', description: 'Zone terminal units', position: { x: 20, y: 60 } },
        { id: 'chw-pump', name: 'Chilled Water Pumps', description: 'Primary/secondary pumping', position: { x: 35, y: 70 } },
        { id: 'cw-pump', name: 'Condenser Water Pumps', description: 'Cooling tower circulation', position: { x: 65, y: 50 } },
        { id: 'expansion-tank', name: 'Expansion Tank', description: 'System pressure maintenance', position: { x: 35, y: 85 } }
      ],
      annotations: [
        { id: 'chw-supply', text: 'CHW Supply: 6-7°C', position: { x: 28, y: 45 }, color: 'blue' },
        { id: 'chw-return', text: 'CHW Return: 12-14°C', position: { x: 28, y: 55 }, color: 'cyan' },
        { id: 'cw-supply', text: 'CW Supply: 30°C', position: { x: 72, y: 40 }, color: 'orange' },
        { id: 'cw-return', text: 'CW Return: 35°C', position: { x: 72, y: 60 }, color: 'red' }
      ]
    }
  ],

  wiringDiagrams: [
    {
      id: 'split-ac-wiring',
      name: 'Split AC Electrical Wiring',
      description: 'Complete wiring for single-phase split air conditioner',
      systemType: 'Single Phase 220-240V',
      wires: [
        {
          id: 'L-supply',
          from: 'MCB',
          to: 'Indoor Unit Terminal L',
          color: IEC_WIRE_COLORS.L1,
          gauge: '2.5mm²',
          function: 'Live supply to indoor unit',
          notes: 'Use 16A MCB for units up to 2.5 tons'
        },
        {
          id: 'N-supply',
          from: 'MCB',
          to: 'Indoor Unit Terminal N',
          color: IEC_WIRE_COLORS.NEUTRAL,
          gauge: '2.5mm²',
          function: 'Neutral connection',
          notes: 'Must have solid connection, loose neutral damages PCB'
        },
        {
          id: 'E-supply',
          from: 'Earth Bar',
          to: 'Indoor Unit Earth',
          color: IEC_WIRE_COLORS.PE,
          gauge: '2.5mm²',
          function: 'Protective earth',
          notes: 'MANDATORY - prevents electric shock'
        },
        {
          id: 'interconnect-L',
          from: 'Indoor Terminal 1',
          to: 'Outdoor Terminal 1',
          color: IEC_WIRE_COLORS.L1,
          gauge: '2.5mm²',
          function: 'Compressor power',
          notes: '3-core + earth cable to outdoor unit'
        },
        {
          id: 'interconnect-N',
          from: 'Indoor Terminal 2',
          to: 'Outdoor Terminal 2',
          color: IEC_WIRE_COLORS.NEUTRAL,
          gauge: '2.5mm²',
          function: 'Neutral to outdoor',
          notes: 'Some brands use different terminal numbers'
        },
        {
          id: 'interconnect-signal',
          from: 'Indoor Terminal 3',
          to: 'Outdoor Terminal 3',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Communication signal',
          notes: 'PWM signal for inverter control'
        },
        {
          id: 'interconnect-E',
          from: 'Indoor Earth',
          to: 'Outdoor Earth',
          color: IEC_WIRE_COLORS.PE,
          gauge: '2.5mm²',
          function: 'Earth bonding',
          notes: 'Bond both units to same earth'
        }
      ],
      safetyNotes: [
        'Isolate power before any work - verify with multimeter',
        'Wait 5 minutes after power off for capacitors to discharge',
        'Use RCBO (16A, 30mA) for enhanced protection',
        'Ensure cable rating matches MCB rating',
        'Outdoor unit must have weatherproof isolator within 1m'
      ],
      tools: ['Multimeter', 'Wire strippers', 'Crimping tool', 'Screwdrivers', 'Cable glands']
    },
    {
      id: 'three-phase-ac-wiring',
      name: 'Three-Phase AC Wiring',
      description: 'Commercial 3-phase air conditioner connection',
      systemType: 'Three Phase 380-415V',
      wires: [
        {
          id: 'L1-main',
          from: 'Isolator',
          to: 'Contactor Terminal L1',
          color: IEC_WIRE_COLORS.L1,
          gauge: '4mm²',
          function: 'Phase 1 supply',
          notes: 'Size based on compressor RLA'
        },
        {
          id: 'L2-main',
          from: 'Isolator',
          to: 'Contactor Terminal L2',
          color: IEC_WIRE_COLORS.L2,
          gauge: '4mm²',
          function: 'Phase 2 supply',
          notes: 'Check phase sequence before starting'
        },
        {
          id: 'L3-main',
          from: 'Isolator',
          to: 'Contactor Terminal L3',
          color: IEC_WIRE_COLORS.L3,
          gauge: '4mm²',
          function: 'Phase 3 supply',
          notes: 'Incorrect sequence = compressor runs backward'
        },
        {
          id: 'contactor-coil-L',
          from: 'Control Transformer',
          to: 'Contactor Coil A1',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Contactor coil supply',
          notes: '24V AC control voltage typical'
        },
        {
          id: 'hp-switch',
          from: 'Contactor Coil A1',
          to: 'High Pressure Switch',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'HP protection in series',
          notes: 'Opens at 28-30 bar, auto-reset'
        },
        {
          id: 'lp-switch',
          from: 'HP Switch',
          to: 'Low Pressure Switch',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'LP protection in series',
          notes: 'Opens below 2 bar, indicates low gas'
        },
        {
          id: 'thermostat',
          from: 'LP Switch',
          to: 'Thermostat',
          color: 'Red',
          gauge: '1.5mm²',
          function: 'Temperature control',
          notes: 'Set point control for compressor cycling'
        },
        {
          id: 'control-return',
          from: 'Thermostat',
          to: 'Contactor Coil A2',
          color: IEC_WIRE_COLORS.NEUTRAL,
          gauge: '1.5mm²',
          function: 'Control circuit return',
          notes: 'Complete control loop'
        }
      ],
      safetyNotes: [
        'ALWAYS check phase sequence with meter before first start',
        'Lock out/tag out main isolator during work',
        'Three-phase motors must have overload protection',
        'Check oil level in sight glass before starting',
        'Allow 12 hours crankcase heater time if power was off'
      ],
      tools: ['Phase sequence meter', 'Clamp meter', 'Manifold gauges', 'Vacuum pump', 'Torque wrench']
    },
    {
      id: 'thermostat-wiring',
      name: 'Room Thermostat Wiring',
      description: 'Standard thermostat connections for FCU/AHU',
      systemType: 'Low Voltage Control',
      wires: [
        {
          id: 'R-wire',
          from: 'Transformer 24V',
          to: 'Thermostat R Terminal',
          color: 'Red',
          gauge: '0.75mm²',
          function: '24V power to thermostat',
          notes: 'R = 24V hot, power source for thermostat'
        },
        {
          id: 'C-wire',
          from: 'Transformer Common',
          to: 'Thermostat C Terminal',
          color: IEC_WIRE_COLORS.NEUTRAL,
          gauge: '0.75mm²',
          function: 'Common/return for smart thermostats',
          notes: 'Essential for WiFi thermostats, provides continuous power'
        },
        {
          id: 'Y-wire',
          from: 'Thermostat Y Terminal',
          to: 'Compressor Contactor',
          color: 'Yellow',
          gauge: '0.75mm²',
          function: 'Cooling call signal',
          notes: 'Y1 = Stage 1 cooling, Y2 = Stage 2'
        },
        {
          id: 'G-wire',
          from: 'Thermostat G Terminal',
          to: 'Fan Relay',
          color: 'Green',
          gauge: '0.75mm²',
          function: 'Fan control signal',
          notes: 'Energizes indoor blower/fan'
        },
        {
          id: 'W-wire',
          from: 'Thermostat W Terminal',
          to: 'Heat Relay/Valve',
          color: 'White',
          gauge: '0.75mm²',
          function: 'Heating call signal',
          notes: 'For heat pump or electric heat'
        },
        {
          id: 'O-wire',
          from: 'Thermostat O Terminal',
          to: 'Reversing Valve',
          color: 'Orange',
          gauge: '0.75mm²',
          function: 'Reversing valve control',
          notes: 'O = Cooling, B = Heating (brand dependent)'
        }
      ],
      safetyNotes: [
        'Low voltage (24V) but can damage expensive control boards if shorted',
        'Never mix line voltage with low voltage wiring',
        'Label all wires before disconnecting old thermostat',
        'Take photo of existing wiring before changes',
        'Use thermostat wire rated for plenum if routed through ductwork'
      ],
      tools: ['Small screwdriver', 'Wire strippers', 'Multimeter', 'Thermostat wire (18/5 or 18/8)']
    }
  ],

  troubleshootingGuides: [
    {
      id: 'ac-not-cooling',
      title: 'AC Running But Not Cooling',
      symptoms: ['Warm air from vents', 'Compressor running but no cooling', 'High electricity bills'],
      possibleCauses: [
        'Low refrigerant charge (gas leak)',
        'Dirty evaporator coil',
        'Dirty condenser coil',
        'Failed compressor',
        'Blocked capillary/expansion valve',
        'Faulty reversing valve (heat pump)'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check air filter',
          expectedResult: 'Clean, unrestricted airflow',
          ifFails: 'Replace filter, clean if washable type'
        },
        {
          step: 2,
          action: 'Check evaporator coil',
          expectedResult: 'Clean coil, no ice formation',
          ifFails: 'Dirty coil = clean with coil cleaner. Ice = low gas or airflow issue'
        },
        {
          step: 3,
          action: 'Check condenser coil (outdoor)',
          expectedResult: 'Clean fins, no debris blocking airflow',
          ifFails: 'Clean with water hose, straighten bent fins'
        },
        {
          step: 4,
          action: 'Connect manifold gauges',
          expectedResult: 'R410A: LP 115-125 psi, HP 300-350 psi (at 35°C ambient)',
          ifFails: 'Low pressures = leak, find and repair'
        },
        {
          step: 5,
          action: 'Check compressor amp draw',
          expectedResult: 'Within nameplate RLA (Running Load Amps)',
          ifFails: 'High amps = restricted system. Low amps = low gas or weak compressor'
        },
        {
          step: 6,
          action: 'Check superheat and subcooling',
          expectedResult: 'Superheat: 5-8°C, Subcooling: 8-12°C',
          ifFails: 'Abnormal readings indicate charge or metering issues'
        }
      ],
      solutions: [
        'Clean air filter monthly',
        'Annual coil cleaning (both indoor and outdoor)',
        'Repair leaks and recharge refrigerant to spec',
        'Replace failed compressor',
        'Replace blocked TXV/capillary'
      ]
    },
    {
      id: 'ac-short-cycling',
      title: 'AC Short Cycling (Rapid On/Off)',
      symptoms: ['Compressor starts and stops frequently', 'Clicking sounds', 'Poor cooling', 'Increased wear'],
      possibleCauses: [
        'Dirty air filter restricting airflow',
        'Low refrigerant causing LP cutout',
        'Oversized unit for space',
        'Faulty thermostat or sensor',
        'High head pressure (dirty condenser)',
        'Electrical issues (loose connections)'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Time the cycle',
          expectedResult: 'Minimum 10-minute run time, 3-minute off time',
          ifFails: 'Short cycles indicate problem'
        },
        {
          step: 2,
          action: 'Check for error codes',
          expectedResult: 'No error codes on display',
          ifFails: 'Decode error: E1=sensor, E3=LP, E4=HP, etc.'
        },
        {
          step: 3,
          action: 'Check low pressure switch',
          expectedResult: 'LP above 30 psi (R410A)',
          ifFails: 'Low gas, find leak'
        },
        {
          step: 4,
          action: 'Check high pressure',
          expectedResult: 'HP below 400 psi (R410A)',
          ifFails: 'Clean condenser, check fan motor'
        },
        {
          step: 5,
          action: 'Inspect electrical connections',
          expectedResult: 'All terminals tight, no burn marks',
          ifFails: 'Tighten loose connections, replace burnt terminals'
        },
        {
          step: 6,
          action: 'Test room sensor resistance',
          expectedResult: '10kΩ at 25°C (typical NTC)',
          ifFails: 'Replace sensor'
        }
      ],
      solutions: [
        'Replace dirty air filter',
        'Repair refrigerant leak and recharge',
        'If oversized, adjust fan speed or add zoning',
        'Replace faulty thermostat/sensor',
        'Clean condenser coil and verify fan operation',
        'Repair electrical connections'
      ]
    },
    {
      id: 'compressor-not-starting',
      title: 'Compressor Not Starting',
      symptoms: ['Fan runs but compressor silent', 'Humming noise but no start', 'Tripping breaker'],
      possibleCauses: [
        'Faulty start capacitor',
        'Faulty run capacitor',
        'Locked rotor (seized compressor)',
        'Open overload protector',
        'Faulty contactor',
        'Low voltage',
        'Open motor winding'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check voltage at compressor',
          expectedResult: '220-240V (single phase) or 380-415V (three phase)',
          ifFails: 'Low voltage - check supply, wire sizing, connections'
        },
        {
          step: 2,
          action: 'Test capacitors with meter',
          expectedResult: 'Within ±10% of rated µF value',
          ifFails: 'Replace capacitor (discharge first!)'
        },
        {
          step: 3,
          action: 'Check overload protector',
          expectedResult: 'Closed circuit (continuity)',
          ifFails: 'If hot, wait 30 min. If cool but open, replace overload'
        },
        {
          step: 4,
          action: 'Measure compressor winding resistance',
          expectedResult: 'C-S: 2-5Ω, C-R: 5-15Ω, R-S: 7-20Ω (typical values)',
          ifFails: 'Open = broken winding. Shorted = compressor failed'
        },
        {
          step: 5,
          action: 'Megger test to ground',
          expectedResult: '>1MΩ insulation resistance',
          ifFails: 'Grounded winding = compressor must be replaced'
        },
        {
          step: 6,
          action: 'Check contactor contacts',
          expectedResult: 'Clean contacts, proper contact pressure',
          ifFails: 'Pitted/burnt contacts = replace contactor'
        }
      ],
      solutions: [
        'Replace faulty capacitor (match µF and voltage rating)',
        'Replace overload protector',
        'Replace contactor',
        'Install hard start kit for difficult starting compressors',
        'Replace compressor if windings failed',
        'Correct low voltage issues'
      ]
    },
    {
      id: 'water-leaking-indoor',
      title: 'Water Leaking from Indoor Unit',
      symptoms: ['Water dripping from unit', 'Water on floor/ceiling', 'Musty smell'],
      possibleCauses: [
        'Clogged drain line',
        'Dirty evaporator coil',
        'Low refrigerant (ice melting)',
        'Cracked drain pan',
        'Improper installation angle',
        'Condensate pump failure'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Check drain pan',
          expectedResult: 'Pan clear, water flowing freely',
          ifFails: 'Clear blockage, check for cracks'
        },
        {
          step: 2,
          action: 'Check drain line',
          expectedResult: 'Clear path, proper slope (1:100 minimum)',
          ifFails: 'Use nitrogen or wet/dry vac to clear blockage'
        },
        {
          step: 3,
          action: 'Check for ice on coil',
          expectedResult: 'No ice formation',
          ifFails: 'Turn off, let melt. Check gas charge and airflow'
        },
        {
          step: 4,
          action: 'Verify unit is level (or slightly tilted to drain)',
          expectedResult: 'Slight tilt toward drain outlet',
          ifFails: 'Re-level unit'
        },
        {
          step: 5,
          action: 'Test condensate pump (if equipped)',
          expectedResult: 'Pump activates when float rises',
          ifFails: 'Replace pump or float switch'
        }
      ],
      solutions: [
        'Clear drain line with nitrogen or vacuum',
        'Install drain line cleanout tee for future access',
        'Replace cracked drain pan',
        'Re-level indoor unit',
        'Replace failed condensate pump',
        'Address root cause of ice formation'
      ]
    },
    {
      id: 'inverter-error-codes',
      title: 'Inverter AC Error Code Diagnosis',
      symptoms: ['Error code on display', 'Unit not operating', 'Flashing LED patterns'],
      possibleCauses: [
        'Communication error between indoor/outdoor',
        'Sensor failure',
        'IPM module failure',
        'Compressor failure',
        'Voltage issues',
        'PCB failure'
      ],
      diagnosticSteps: [
        {
          step: 1,
          action: 'Record exact error code',
          expectedResult: 'Code documented for reference',
          ifFails: 'Check service manual for code meaning'
        },
        {
          step: 2,
          action: 'Common codes: E1/F1 = Indoor sensor',
          expectedResult: 'Room sensor: 10kΩ at 25°C, Coil sensor: 5kΩ at 25°C',
          ifFails: 'Replace sensor'
        },
        {
          step: 3,
          action: 'E5/F5 = Communication error',
          expectedResult: 'Check signal wire (Terminal 3), proper voltage',
          ifFails: 'Check wire connections, replace cable if damaged'
        },
        {
          step: 4,
          action: 'E6/F6 = Outdoor unit error',
          expectedResult: 'Check IPM module, DC voltage',
          ifFails: 'Measure DC bus (310V), check IPM for shorts'
        },
        {
          step: 5,
          action: 'P0/P1 = IPM protection',
          expectedResult: 'IPM module functioning',
          ifFails: 'Replace IPM module (requires brazing skills)'
        },
        {
          step: 6,
          action: 'Check outdoor PCB error LEDs',
          expectedResult: 'Decode LED blink pattern per service manual',
          ifFails: 'Follow manufacturer troubleshooting tree'
        }
      ],
      solutions: [
        'Replace faulty sensors',
        'Repair/replace communication cable',
        'Replace IPM module',
        'Replace outdoor PCB',
        'Replace compressor',
        'Reset by power cycling after addressing root cause'
      ]
    }
  ],

  repairProcedures: [
    {
      id: 'refrigerant-recharge',
      title: 'Refrigerant Recovery, Leak Repair & Recharge',
      difficulty: 'Advanced',
      estimatedTime: '2-4 hours',
      requiredTools: [
        'Manifold gauge set (R410A)',
        'Recovery machine',
        'Recovery cylinder',
        'Vacuum pump',
        'Micron gauge',
        'Electronic leak detector',
        'Nitrogen cylinder with regulator',
        'Brazing torch and rods',
        'Digital scale',
        'Safety glasses and gloves'
      ],
      requiredParts: [
        'Refrigerant (R410A/R32/R22 as applicable)',
        'Brazing rods (15% silver)',
        'Copper tubing for patch (if needed)',
        'Filter drier (replace when system opened)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Recover Existing Refrigerant',
          instruction: 'Connect recovery machine to service ports. Recover all refrigerant into approved cylinder. Do NOT vent to atmosphere.',
          warnings: ['Venting refrigerant is illegal', 'Use DOT-approved recovery cylinder'],
          tips: ['Record amount recovered for comparison']
        },
        {
          stepNumber: 2,
          title: 'Pressurize with Nitrogen',
          instruction: 'After recovery, pressurize system to 300 psi with dry nitrogen. Listen and spray leak detector solution on joints.',
          warnings: ['Never use oxygen - explosion hazard', 'Do not exceed system rated pressure'],
          tips: ['Start at 150 psi, increase gradually']
        },
        {
          stepNumber: 3,
          title: 'Locate and Repair Leak',
          instruction: 'Use electronic leak detector or soap bubbles. Mark leak location. Release pressure. Braze repair with nitrogen flowing.',
          warnings: ['Always flow nitrogen when brazing to prevent oxidation'],
          tips: ['Most leaks at flare joints, service valves, or vibration points']
        },
        {
          stepNumber: 4,
          title: 'Replace Filter Drier',
          instruction: 'Cut out old filter drier. Install new one with arrow pointing toward metering device. Braze connections.',
          warnings: ['Filter drier is directional - check arrow'],
          tips: ['Use heat sink paste to protect drier from brazing heat']
        },
        {
          stepNumber: 5,
          title: 'Pressure Test',
          instruction: 'Pressurize to 400 psi (R410A systems). Hold for 30 minutes minimum. Pressure should not drop.',
          warnings: ['Do not leave pressurized system unattended'],
          tips: ['Account for temperature changes affecting pressure']
        },
        {
          stepNumber: 6,
          title: 'Evacuate System',
          instruction: 'Connect vacuum pump. Pull vacuum to 500 microns minimum. Hold for 30 minutes - should not rise above 1000 microns.',
          warnings: ['Never start compressor under vacuum'],
          tips: ['Change vacuum pump oil regularly for best performance']
        },
        {
          stepNumber: 7,
          title: 'Charge Refrigerant',
          instruction: 'Weigh in exact charge per nameplate. For R410A, charge as liquid into high side (compressor off) or low side (compressor running).',
          warnings: ['R410A must be charged as liquid', 'Overcharge damages compressor'],
          tips: ['Use subcooling method to verify correct charge']
        },
        {
          stepNumber: 8,
          title: 'Verify Operation',
          instruction: 'Start system. Check pressures, superheat (5-8°C), subcooling (8-12°C). Monitor for 15 minutes.',
          warnings: ['Abnormal pressures indicate problem'],
          tips: ['Record final readings for future reference']
        }
      ],
      qualityChecks: [
        'Leak test all repaired joints',
        'Verify correct charge by weight and superheat/subcooling',
        'Check compressor amp draw within specs',
        'Verify proper airflow and temperatures',
        'Document all work performed'
      ]
    },
    {
      id: 'pcb-replacement',
      title: 'Control Board (PCB) Replacement',
      difficulty: 'Intermediate',
      estimatedTime: '1-2 hours',
      requiredTools: [
        'Screwdriver set',
        'Multimeter',
        'Needle-nose pliers',
        'Cable ties',
        'Camera/phone (for photos)'
      ],
      requiredParts: [
        'Replacement PCB (exact model match)',
        'Thermal paste (if required)',
        'Cable ties'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Document Existing Wiring',
          instruction: 'Take multiple photos of all wire connections, ribbon cables, and connector positions before disconnecting anything.',
          warnings: ['Incorrect reconnection will damage new board'],
          tips: ['Label wires if not color-coded']
        },
        {
          stepNumber: 2,
          title: 'Power Off and Discharge',
          instruction: 'Turn off power at isolator. Wait 5 minutes for capacitors to discharge. Verify 0V with multimeter.',
          warnings: ['Capacitors hold lethal charge'],
          tips: ['Use one hand rule when checking voltage']
        },
        {
          stepNumber: 3,
          title: 'Remove Old PCB',
          instruction: 'Disconnect all wire connectors, ribbon cables, and sensor plugs. Remove mounting screws. Carefully lift out PCB.',
          warnings: ['Do not force connectors'],
          tips: ['Note orientation of polarized connectors']
        },
        {
          stepNumber: 4,
          title: 'Verify Replacement',
          instruction: 'Compare old and new PCB. Verify model number, connector positions, and component layout match.',
          warnings: ['Wrong PCB will cause immediate failure'],
          tips: ['Check software version if applicable']
        },
        {
          stepNumber: 5,
          title: 'Install New PCB',
          instruction: 'Mount new PCB with original screws. Reconnect all wires matching photos taken. Verify each connection.',
          warnings: ['Reverse polarity destroys electronics'],
          tips: ['Dress wires neatly away from heat sources']
        },
        {
          stepNumber: 6,
          title: 'Program/Configure',
          instruction: 'Some boards require DIP switch settings or programming. Set according to system requirements.',
          warnings: ['Incorrect settings cause malfunction'],
          tips: ['Refer to installation manual for settings']
        },
        {
          stepNumber: 7,
          title: 'Power On and Test',
          instruction: 'Restore power. Verify no error codes. Test all functions: cooling, heating (if applicable), fan speeds, modes.',
          warnings: ['Smell of burning = immediate power off'],
          tips: ['Test remote control functions']
        }
      ],
      qualityChecks: [
        'All error codes cleared',
        'All modes functioning correctly',
        'Sensors reading accurately',
        'Communication with outdoor unit working',
        'No unusual sounds or smells'
      ]
    },
    {
      id: 'compressor-replacement',
      title: 'Compressor Replacement',
      difficulty: 'Expert',
      estimatedTime: '4-6 hours',
      requiredTools: [
        'Recovery machine and cylinder',
        'Manifold gauges',
        'Brazing equipment (oxy-acetylene)',
        'Tube cutter',
        'Vacuum pump and micron gauge',
        'Nitrogen cylinder',
        'Digital scale',
        'Multimeter',
        'Wrenches and sockets'
      ],
      requiredParts: [
        'Replacement compressor (exact match)',
        'Filter drier',
        'Refrigerant',
        'Compressor oil (if required)',
        'Brazing rods',
        'Copper tubing adapters (if needed)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Diagnose and Confirm',
          instruction: 'Verify compressor failure through electrical tests (winding resistance, megger) and mechanical tests (locked rotor).',
          warnings: ['Ensure correct diagnosis before replacement'],
          tips: ['Check warranty status first']
        },
        {
          stepNumber: 2,
          title: 'Recover Refrigerant',
          instruction: 'Recover all system refrigerant. Note: contaminated oil may require filter on recovery machine.',
          warnings: ['Burned compressor contaminates refrigerant'],
          tips: ['If oil is acidic, plan for system flush']
        },
        {
          stepNumber: 3,
          title: 'Remove Failed Compressor',
          instruction: 'Cut suction and discharge lines. Remove mounting bolts. Lift out compressor (heavy - may need assistance).',
          warnings: ['Old compressor may contain acidic oil'],
          tips: ['Plug lines immediately to prevent moisture entry']
        },
        {
          stepNumber: 4,
          title: 'Prepare System',
          instruction: 'If burnout, flush system with approved flush solvent. Install new filter drier (possibly suction line filter too).',
          warnings: ['Burnout contamination will destroy new compressor'],
          tips: ['Install 3 filter driers in series for severe burnout']
        },
        {
          stepNumber: 5,
          title: 'Install New Compressor',
          instruction: 'Position new compressor. Connect suction and discharge lines. Braze with nitrogen flowing.',
          warnings: ['Keep compressor upright until installed', 'Do not remove plug until ready to braze'],
          tips: ['Check oil level and type match']
        },
        {
          stepNumber: 6,
          title: 'Reconnect Electrical',
          instruction: 'Connect power wires to compressor terminals. Verify correct phasing for 3-phase.',
          warnings: ['Wrong phase rotation damages scroll compressors immediately'],
          tips: ['Use phase sequence meter']
        },
        {
          stepNumber: 7,
          title: 'Evacuate and Charge',
          instruction: 'Deep vacuum to 500 microns. Hold test. Charge to nameplate specification.',
          warnings: ['Never start compressor under vacuum'],
          tips: ['Triple evacuate for best results']
        },
        {
          stepNumber: 8,
          title: 'Start and Monitor',
          instruction: 'Start compressor. Monitor amps, pressures, and temperatures. Run for minimum 30 minutes.',
          warnings: ['High amps or abnormal sounds = stop immediately'],
          tips: ['Check crankcase heater is working for next startup']
        }
      ],
      qualityChecks: [
        'Amp draw within nameplate RLA',
        'Pressures normal for conditions',
        'No refrigerant leaks',
        'Oil level correct in sight glass',
        'System achieving design temperatures',
        'Document serial number and warranty'
      ]
    }
  ],

  partsReference: [
    {
      id: 'capacitors',
      name: 'AC Capacitors',
      category: 'Electrical Components',
      variants: [
        { partNumber: 'CAP-RUN-25', description: 'Run Capacitor 25µF 450V', specifications: '25µF ±5%, 450VAC, CBB65 type', compatibleModels: ['Most 1-1.5 ton units'], price: 15 },
        { partNumber: 'CAP-RUN-35', description: 'Run Capacitor 35µF 450V', specifications: '35µF ±5%, 450VAC, CBB65 type', compatibleModels: ['2-2.5 ton units'], price: 18 },
        { partNumber: 'CAP-RUN-45', description: 'Run Capacitor 45µF 450V', specifications: '45µF ±5%, 450VAC, CBB65 type', compatibleModels: ['3-5 ton units'], price: 22 },
        { partNumber: 'CAP-START-88', description: 'Start Capacitor 88-108µF', specifications: '88-108µF, 330VAC, CD60 type', compatibleModels: ['Hard start applications'], price: 12 }
      ],
      imageUrl: '/images/parts/ac-capacitor.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '1-2 days'
    },
    {
      id: 'contactors',
      name: 'AC Contactors',
      category: 'Electrical Components',
      variants: [
        { partNumber: 'CON-1P-25A', description: 'Single Pole Contactor 25A', specifications: '25A, 1P, 24V coil, NO contact', compatibleModels: ['Small split systems'], price: 25 },
        { partNumber: 'CON-2P-30A', description: 'Two Pole Contactor 30A', specifications: '30A, 2P, 24V coil, 2NO contacts', compatibleModels: ['Residential split AC'], price: 35 },
        { partNumber: 'CON-3P-40A', description: 'Three Pole Contactor 40A', specifications: '40A, 3P, 24V coil, 3NO contacts', compatibleModels: ['Commercial 3-phase AC'], price: 55 }
      ],
      imageUrl: '/images/parts/ac-contactor.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '1-2 days'
    },
    {
      id: 'fan-motors',
      name: 'Fan Motors',
      category: 'Motors',
      variants: [
        { partNumber: 'FAN-COND-25W', description: 'Condenser Fan Motor 25W', specifications: '25W, 220V, 1350RPM, ball bearing', compatibleModels: ['Small outdoor units'], price: 45 },
        { partNumber: 'FAN-COND-50W', description: 'Condenser Fan Motor 50W', specifications: '50W, 220V, 900RPM, ball bearing', compatibleModels: ['Medium outdoor units'], price: 65 },
        { partNumber: 'FAN-INDOOR', description: 'Indoor Blower Motor', specifications: 'Cross-flow type, 3-speed, 220V', compatibleModels: ['Wall mount indoor units'], price: 85 }
      ],
      imageUrl: '/images/parts/fan-motor.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '2-3 days'
    },
    {
      id: 'sensors',
      name: 'Temperature Sensors',
      category: 'Sensors',
      variants: [
        { partNumber: 'SENS-ROOM-10K', description: 'Room Temperature Sensor', specifications: '10kΩ NTC at 25°C, 2-wire', compatibleModels: ['Most split AC brands'], price: 8 },
        { partNumber: 'SENS-COIL-5K', description: 'Coil Temperature Sensor', specifications: '5kΩ NTC at 25°C, 2-wire, probe type', compatibleModels: ['Evaporator sensing'], price: 8 },
        { partNumber: 'SENS-PIPE-20K', description: 'Pipe Temperature Sensor', specifications: '20kΩ NTC at 25°C, clamp type', compatibleModels: ['Discharge pipe sensing'], price: 10 }
      ],
      imageUrl: '/images/parts/temp-sensor.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '1-2 days'
    },
    {
      id: 'refrigerant',
      name: 'Refrigerants',
      category: 'Consumables',
      variants: [
        { partNumber: 'REF-R410A-11', description: 'R410A Refrigerant 11.3kg', specifications: 'R410A, 11.3kg cylinder, virgin grade', compatibleModels: ['Modern inverter AC'], price: 180 },
        { partNumber: 'REF-R32-9', description: 'R32 Refrigerant 9kg', specifications: 'R32, 9kg cylinder, lower GWP', compatibleModels: ['New eco-friendly AC'], price: 160 },
        { partNumber: 'REF-R22-13', description: 'R22 Refrigerant 13.6kg', specifications: 'R22, 13.6kg cylinder (phasing out)', compatibleModels: ['Older AC systems'], price: 220 }
      ],
      imageUrl: '/images/parts/refrigerant.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '1-2 days'
    },
    {
      id: 'pcb-boards',
      name: 'Control Boards',
      category: 'Electronics',
      variants: [
        { partNumber: 'PCB-INDOOR-UNI', description: 'Universal Indoor PCB', specifications: 'Universal replacement, programmable', compatibleModels: ['Most non-inverter split AC'], price: 75 },
        { partNumber: 'PCB-OUTDOOR-INV', description: 'Inverter Outdoor PCB', specifications: 'Brand-specific, includes IPM', compatibleModels: ['Brand specific'], price: 250 }
      ],
      imageUrl: '/images/parts/ac-pcb.webp',
      supplier: 'GEMCO Kenya',
      leadTime: '3-5 days'
    }
  ],

  maintenanceSchedules: [
    {
      id: 'residential-ac-maintenance',
      name: 'Residential AC Maintenance Schedule',
      equipmentType: 'Split Air Conditioner',
      tasks: [
        { task: 'Clean/replace air filter', interval: 'Monthly', procedure: 'Remove filter, wash with water or replace disposable type', criticalLevel: 'high' },
        { task: 'Check thermostat operation', interval: 'Monthly', procedure: 'Verify temperature setting matches room temperature', criticalLevel: 'medium' },
        { task: 'Clean indoor unit coil', interval: 'Quarterly', procedure: 'Use coil cleaner spray, allow to foam and drain', criticalLevel: 'high' },
        { task: 'Clean drain line', interval: 'Quarterly', procedure: 'Flush with water, use wet/dry vac if slow draining', criticalLevel: 'medium' },
        { task: 'Clean outdoor unit', interval: 'Quarterly', procedure: 'Hose down condenser coil, remove debris from fins', criticalLevel: 'high' },
        { task: 'Check refrigerant pressure', interval: 'Annually', procedure: 'Connect gauges, compare to normal operating pressures', criticalLevel: 'high' },
        { task: 'Check electrical connections', interval: 'Annually', procedure: 'Inspect and tighten all terminals, check for burn marks', criticalLevel: 'high' },
        { task: 'Measure amp draw', interval: 'Annually', procedure: 'Compare to nameplate, investigate if outside tolerance', criticalLevel: 'medium' },
        { task: 'Test capacitors', interval: 'Annually', procedure: 'Check µF value with capacitor tester', criticalLevel: 'medium' },
        { task: 'Lubricate fan motors', interval: 'Annually', procedure: 'Apply 2-3 drops oil to bearings if not sealed type', criticalLevel: 'low' }
      ],
      notes: 'More frequent cleaning required in dusty environments or heavy use periods'
    },
    {
      id: 'commercial-ac-maintenance',
      name: 'Commercial HVAC Maintenance Schedule',
      equipmentType: 'Central AC / Chiller System',
      tasks: [
        { task: 'Change air filters', interval: 'Monthly', procedure: 'Replace all AHU and FCU filters per specification', criticalLevel: 'high' },
        { task: 'Check belt tension', interval: 'Monthly', procedure: 'Inspect AHU belts, tension and align as needed', criticalLevel: 'medium' },
        { task: 'Check refrigerant levels', interval: 'Monthly', procedure: 'Record pressures and compare to baseline', criticalLevel: 'high' },
        { task: 'Clean condensate pans', interval: 'Monthly', procedure: 'Treat with algaecide tablets, clean any buildup', criticalLevel: 'medium' },
        { task: 'Inspect ductwork', interval: 'Quarterly', procedure: 'Check for air leaks, damage, insulation condition', criticalLevel: 'medium' },
        { task: 'Clean cooling tower', interval: 'Quarterly', procedure: 'Chemical treatment, clean fill media and basin', criticalLevel: 'high' },
        { task: 'Test water quality', interval: 'Monthly', procedure: 'Check pH, conductivity, bacteria levels', criticalLevel: 'high' },
        { task: 'Check chiller operation', interval: 'Weekly', procedure: 'Record temperatures, pressures, amp draw', criticalLevel: 'high' },
        { task: 'Oil analysis', interval: 'Annually', procedure: 'Sample compressor oil, analyze for wear metals', criticalLevel: 'medium' },
        { task: 'Full system inspection', interval: 'Annually', procedure: 'Comprehensive check of all components and controls', criticalLevel: 'high' }
      ],
      notes: 'Maintain detailed logs for warranty compliance and predictive maintenance'
    }
  ]
};

export default acInstallationService;
