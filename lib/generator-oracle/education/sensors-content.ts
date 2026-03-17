/**
 * Sensors Educational Content
 * Temperature, Pressure, Speed, Level Sensors
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const SENSORS_CONTENT: EducationalContent[] = [
  {
    id: 'SENS_001',
    category: 'sensors',
    subcategory: 'temperature',
    title: 'Engine Temperature Sensors Complete Guide',
    slug: 'engine-temperature-sensors-guide-kenya',
    keywords: ['temperature sensor Kenya', 'coolant sensor', 'NTC thermistor', 'oil temperature sensor'],
    summary: 'Complete guide to engine temperature sensors covering types, testing, and replacement procedures.',
    content: [
      {
        heading: 'Temperature Sensor Types',
        paragraphs: [
          'NTC (Negative Temperature Coefficient) thermistors are most common. Resistance decreases as temperature increases.',
          'RTD (Resistance Temperature Detector) sensors offer higher accuracy. Resistance increases with temperature.',
          'Thermocouples generate voltage proportional to temperature. Used for high-temperature measurement like exhaust.'
        ]
      },
      {
        heading: 'NTC Thermistor Testing',
        paragraphs: [
          'Measure resistance at known temperature. At 25°C, typical coolant sensors read 2000-3000 ohms.',
          'At operating temperature (90°C), resistance drops to approximately 200-300 ohms.',
          'Compare measured resistance to manufacturer specifications for accuracy.'
        ]
      },
      {
        heading: 'Common Failures',
        paragraphs: [
          'Open circuit causes infinite resistance, typically read as very cold temperature.',
          'Short circuit causes near-zero resistance, read as extremely high temperature.',
          'Drift causes incorrect readings within normal range - harder to detect without reference.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Temperature', 'Low Temperature', 'Temp Sensor Open', 'Temp Sensor Short'],
    relatedContent: ['SENS_002', 'COOL_001'],
    tools: ['Multimeter', 'Temperature chart', 'IR thermometer'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_002',
    category: 'sensors',
    subcategory: 'pressure',
    title: 'Oil Pressure Sensors and Switches',
    slug: 'oil-pressure-sensors-switches-kenya',
    keywords: ['oil pressure sensor Kenya', 'pressure switch', 'oil sender', 'low oil pressure'],
    summary: 'Guide to oil pressure monitoring systems including variable senders and pressure switches.',
    content: [
      {
        heading: 'Sensor Types',
        paragraphs: [
          'Variable resistance senders provide continuous pressure reading through resistance changes.',
          'Pressure switches provide simple on/off indication at preset pressure threshold.',
          'Electronic transducers output voltage or current signals proportional to pressure.'
        ]
      },
      {
        heading: 'Testing Procedures',
        paragraphs: [
          'Variable sender: Measure resistance at atmospheric pressure, compare to zero-pressure specification.',
          'Pressure switch: Test continuity at atmospheric pressure, verify it matches expected state (NO or NC).',
          'Always verify actual pressure with mechanical gauge before condemning sensors.'
        ]
      },
      {
        heading: 'Installation Tips',
        paragraphs: [
          'Use appropriate thread sealant rated for oil exposure.',
          'Install in location with direct oil gallery access for accurate reading.',
          'Do not over-torque - damages internal diaphragm.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Low Oil Pressure', 'Oil Pressure Sensor Fault'],
    relatedContent: ['SENS_001', 'LUBRICATION_001'],
    tools: ['Multimeter', 'Pressure gauge', 'Thread sealant'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_003',
    category: 'sensors',
    subcategory: 'speed',
    title: 'Magnetic Pickup Speed Sensors (MPU)',
    slug: 'magnetic-pickup-speed-sensors-kenya',
    keywords: ['MPU sensor Kenya', 'speed sensor', 'flywheel pickup', 'magnetic pickup'],
    summary: 'Complete guide to magnetic pickup units for engine speed sensing.',
    content: [
      {
        heading: 'MPU Operating Principle',
        paragraphs: [
          'Magnetic pickups generate AC voltage as ferrous teeth pass the sensor tip.',
          'Signal frequency is proportional to engine speed. Higher speed equals higher frequency.',
          'Signal amplitude also increases with speed - weak at cranking, strong at rated speed.'
        ]
      },
      {
        heading: 'Air Gap Adjustment',
        paragraphs: [
          'Air gap between sensor and teeth is critical for reliable operation.',
          'Typical specification: 0.5-1.0mm (0.020-0.040 inches).',
          'Thread sensor in until contacts tooth, back out specified amount, secure with locknut.'
        ]
      },
      {
        heading: 'Testing MPU Sensors',
        paragraphs: [
          'Measure coil resistance: typically 880-1200 ohms.',
          'Measure AC voltage while cranking: should be >0.5V for reliable detection.',
          'Use oscilloscope to verify clean signal waveform.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['No Speed Signal', 'Speed Sensor Fault', 'Fail to Start'],
    relatedContent: ['ECM_001', 'ACT_001'],
    tools: ['Multimeter', 'Oscilloscope', 'Feeler gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_004',
    category: 'sensors',
    subcategory: 'level',
    title: 'Fuel and Coolant Level Sensors',
    slug: 'fuel-coolant-level-sensors-kenya',
    keywords: ['fuel level sensor Kenya', 'coolant level switch', 'tank level', 'low fuel alarm'],
    summary: 'Understanding and testing level sensing systems for fuel tanks and coolant reservoirs.',
    content: [
      {
        heading: 'Level Sensor Types',
        paragraphs: [
          'Float-operated variable resistance senders change resistance as float position changes with level.',
          'Float switches provide simple high/low level indication through switch contacts.',
          'Capacitive sensors detect level changes through electrical capacitance variation.'
        ]
      },
      {
        heading: 'Fuel Level Sensing',
        paragraphs: [
          'Fuel tank senders typically use variable resistance. Resistance changes from empty to full.',
          'Some systems use dual senders for irregular tank shapes.',
          'Ground connection quality affects accuracy - corrosion causes erratic readings.'
        ]
      },
      {
        heading: 'Coolant Level Sensing',
        paragraphs: [
          'Coolant level switches typically mount in expansion tank or radiator header.',
          'Low level indication should trigger warning before engine overheats.',
          'Hot coolant expands - design accounts for level variation with temperature.'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Low Fuel', 'Low Coolant', 'Level Sensor Fault'],
    relatedContent: ['FUEL_001', 'COOL_001'],
    tools: ['Multimeter', 'Level measurement tools'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_005',
    category: 'sensors',
    subcategory: 'manifold',
    title: 'Intake Manifold Pressure and Temperature Sensors',
    slug: 'manifold-pressure-temperature-sensors-kenya',
    keywords: ['MAP sensor Kenya', 'boost sensor', 'intake temperature', 'manifold pressure'],
    summary: 'Understanding sensors that monitor intake manifold conditions for engine management.',
    content: [
      {
        heading: 'Manifold Absolute Pressure (MAP)',
        paragraphs: [
          'MAP sensors measure absolute pressure in the intake manifold.',
          'Signal indicates engine load - higher pressure means higher load on turbocharged engines.',
          'ECM uses MAP data for fuel and timing calculations.'
        ]
      },
      {
        heading: 'Boost Pressure Sensing',
        paragraphs: [
          'On turbocharged engines, MAP reading exceeds atmospheric pressure under boost.',
          'Boost control uses this feedback to regulate turbocharger output.',
          'Sensor failure affects boost control and engine protection.'
        ]
      },
      {
        heading: 'Intake Air Temperature',
        paragraphs: [
          'IAT sensor measures temperature of air entering the engine.',
          'Hot air is less dense, requiring fuel reduction.',
          'Sensor typically integrated into MAF sensor or mounted separately in intake.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['MAP Sensor Fault', 'Boost Pressure Fault', 'IAT Sensor Fault'],
    relatedContent: ['ECM_001', 'TURBO_001'],
    tools: ['Multimeter', 'Vacuum/pressure gauge', 'Diagnostic software'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_006',
    category: 'sensors',
    subcategory: 'exhaust',
    title: 'Exhaust Gas Temperature Sensors',
    slug: 'exhaust-gas-temperature-sensors-kenya',
    keywords: ['EGT sensor Kenya', 'exhaust temperature', 'thermocouple', 'pyrometer'],
    summary: 'Monitoring exhaust gas temperature for engine protection and performance analysis.',
    content: [
      {
        heading: 'EGT Measurement Purpose',
        paragraphs: [
          'Exhaust gas temperature indicates combustion efficiency and engine health.',
          'High EGT may indicate lean condition, restricted airflow, or engine overload.',
          'Individual cylinder EGT comparison identifies misfiring or fuel imbalance.'
        ]
      },
      {
        heading: 'Thermocouple Sensors',
        paragraphs: [
          'Type K thermocouples are common for EGT measurement.',
          'Generate millivolt signals proportional to temperature.',
          'Require compatible instrumentation for accurate reading.'
        ]
      },
      {
        heading: 'Installation Considerations',
        paragraphs: [
          'Mounting depth affects reading - too shallow reads cooler than actual.',
          'Probe orientation affects response time and accuracy.',
          'Protect wiring from exhaust heat.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Exhaust Temp', 'EGT Sensor Fault'],
    relatedContent: ['TURBO_001', 'EXHAUST_001'],
    tools: ['Multimeter (mV range)', 'Pyrometer', 'Thermocouple calibrator'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_007',
    category: 'sensors',
    subcategory: 'crankshaft',
    title: 'Crankshaft and Camshaft Position Sensors',
    slug: 'crankshaft-camshaft-position-sensors-kenya',
    keywords: ['crankshaft sensor Kenya', 'camshaft sensor', 'CKP sensor', 'CMP sensor'],
    summary: 'Understanding engine position sensors for injection timing and cylinder identification.',
    content: [
      {
        heading: 'Crankshaft Position Sensor (CKP)',
        paragraphs: [
          'CKP sensor provides precise crankshaft position and speed information.',
          'Essential for injection timing calculation on electronic engines.',
          'Uses reluctance (magnetic) or Hall effect sensing principles.'
        ]
      },
      {
        heading: 'Camshaft Position Sensor (CMP)',
        paragraphs: [
          'CMP sensor identifies engine cycle position for cylinder identification.',
          'Determines which cylinder is on compression stroke for sequential injection.',
          'Works in conjunction with CKP for complete engine position information.'
        ]
      },
      {
        heading: 'Diagnostics',
        paragraphs: [
          'No signal from CKP typically prevents starting entirely.',
          'CMP failure may allow starting with degraded performance.',
          'Signal quality analysis with oscilloscope reveals intermittent issues.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['CKP Sensor Fault', 'CMP Sensor Fault', 'Sync Fault'],
    relatedContent: ['ECM_001', 'ECM_008'],
    tools: ['Oscilloscope', 'Multimeter', 'Diagnostic software'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_008',
    category: 'sensors',
    subcategory: 'current',
    title: 'Generator Current Transformers (CTs)',
    slug: 'generator-current-transformers-kenya',
    keywords: ['current transformer Kenya', 'CT ratio', 'generator CT', 'metering CT'],
    summary: 'Understanding current transformers for generator protection and metering.',
    content: [
      {
        heading: 'CT Operating Principle',
        paragraphs: [
          'Current transformers produce low-current output proportional to primary current.',
          'Standard secondary current is 5A or 1A regardless of primary rating.',
          'CT ratio defines transformation - 200:5 means 200A primary produces 5A secondary.'
        ]
      },
      {
        heading: 'CT Applications',
        paragraphs: [
          'Protection CTs feed overcurrent relays for generator protection.',
          'Metering CTs provide current measurement for kW calculation.',
          'Ground fault CTs detect current imbalance indicating ground faults.'
        ]
      },
      {
        heading: 'Installation and Safety',
        paragraphs: [
          'Never open CT secondary circuit while primary is energized - dangerous voltage results.',
          'Short secondary terminals if CT must be removed from circuit.',
          'Verify CT polarity for proper relay operation.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Over Current', 'CT Fail', 'Ground Fault'],
    relatedContent: ['CTRL_001', 'SAFETY_001'],
    tools: ['CT test equipment', 'Clamp meter', 'Insulation tester'],
    safetyWarnings: ['Never open CT secondary while primary is energized'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_009',
    category: 'sensors',
    subcategory: 'vibration',
    title: 'Vibration Sensors and Monitoring',
    slug: 'vibration-sensors-monitoring-kenya',
    keywords: ['vibration sensor Kenya', 'vibration monitoring', 'bearing vibration', 'machine protection'],
    summary: 'Using vibration monitoring for predictive maintenance and equipment protection.',
    content: [
      {
        heading: 'Vibration Measurement',
        paragraphs: [
          'Vibration sensors detect mechanical motion in rotating equipment.',
          'Accelerometers measure vibration acceleration, velocity derived from integration.',
          'Velocity measurements correlate well with machine health across broad frequency range.'
        ]
      },
      {
        heading: 'Monitoring Applications',
        paragraphs: [
          'Bearing health assessment through vibration signature analysis.',
          'Imbalance detection through characteristic frequency patterns.',
          'Misalignment identification through specific vibration profiles.'
        ]
      },
      {
        heading: 'Protection Settings',
        paragraphs: [
          'Warning levels indicate developing problems requiring attention.',
          'Shutdown levels prevent operation with dangerous vibration.',
          'Settings depend on equipment type and manufacturer specifications.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Vibration', 'Vibration Warning'],
    relatedContent: ['ENG_001', 'ALTERNATOR_001'],
    tools: ['Vibration analyzer', 'Accelerometer', 'Analysis software'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_010',
    category: 'sensors',
    subcategory: 'common_rail',
    title: 'Common Rail Fuel Pressure Sensors',
    slug: 'common-rail-fuel-pressure-sensors-kenya',
    keywords: ['rail pressure sensor Kenya', 'common rail sensor', 'fuel pressure', 'CRDi sensor'],
    summary: 'Understanding fuel rail pressure sensing in common rail diesel systems.',
    content: [
      {
        heading: 'Rail Pressure Sensing',
        paragraphs: [
          'Common rail systems require precise measurement of fuel rail pressure.',
          'Pressure sensor provides feedback for high-pressure pump control.',
          'Typical rail pressures range from 200-2000+ bar depending on operating conditions.'
        ]
      },
      {
        heading: 'Sensor Operation',
        paragraphs: [
          'Strain gauge sensing element produces voltage proportional to pressure.',
          'Signal typically 0.5-4.5V corresponding to pressure range.',
          'High-precision sensors essential for accurate fuel control.'
        ]
      },
      {
        heading: 'Diagnostics',
        paragraphs: [
          'Compare actual rail pressure to commanded pressure for system health.',
          'Low actual pressure may indicate pump wear, injector leakage, or sensor fault.',
          'High actual pressure may indicate stuck pressure regulator or sensor drift.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Rail Pressure Low', 'Rail Pressure High', 'Pressure Sensor Fault'],
    relatedContent: ['ECM_005', 'INJ_001'],
    tools: ['Diagnostic software', 'Pressure gauge', 'Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_011',
    category: 'sensors',
    subcategory: 'wiring',
    title: 'Sensor Wiring Diagnosis and Repair',
    slug: 'sensor-wiring-diagnosis-kenya',
    keywords: ['sensor wiring Kenya', 'wiring diagnosis', 'connector repair', 'harness testing'],
    summary: 'Techniques for diagnosing and repairing sensor wiring faults.',
    content: [
      {
        heading: 'Common Wiring Failures',
        paragraphs: [
          'Connector corrosion causes high resistance affecting signal accuracy.',
          'Chafing wires produce intermittent shorts or opens.',
          'Water intrusion damages wiring and connectors.'
        ]
      },
      {
        heading: 'Diagnostic Techniques',
        paragraphs: [
          'Visual inspection identifies obvious damage at connectors and harness routing.',
          'Continuity testing verifies wire integrity from sensor to controller.',
          'Voltage drop testing identifies high-resistance connections.'
        ]
      },
      {
        heading: 'Repair Procedures',
        paragraphs: [
          'Clean corroded connectors with electrical cleaner.',
          'Splice damaged wires using proper crimps and heat shrink.',
          'Replace severely damaged harness sections.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Sensor Open', 'Sensor Short', 'Signal Error'],
    relatedContent: ['ECM_012', 'ELEC_001'],
    tools: ['Multimeter', 'Crimping tools', 'Heat shrink'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_012',
    category: 'sensors',
    subcategory: 'calibration',
    title: 'Sensor Calibration and Verification',
    slug: 'sensor-calibration-verification-kenya',
    keywords: ['sensor calibration Kenya', 'sensor testing', 'calibration verification'],
    summary: 'Procedures for verifying and calibrating engine sensors.',
    content: [
      {
        heading: 'Calibration Importance',
        paragraphs: [
          'Sensor accuracy directly affects engine control and protection.',
          'Drift over time causes gradual accuracy loss.',
          'Periodic verification ensures continued accuracy.'
        ]
      },
      {
        heading: 'Verification Methods',
        paragraphs: [
          'Compare sensor reading to known accurate reference.',
          'Use calibrated test equipment for reference measurements.',
          'Record results for trending over time.'
        ]
      },
      {
        heading: 'Field Calibration',
        paragraphs: [
          'Some sensors have no adjustment - replace if out of specification.',
          'Adjustable sensors can be calibrated to match reference.',
          'Document all calibration activities.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Calibration Required', 'Sensor Drift'],
    relatedContent: ['SENS_001', 'SENS_002'],
    tools: ['Calibration equipment', 'Reference standards'],
    lastUpdated: '2024-03-15'
  }
];

export const SENSORS_CONTENT_COUNT = SENSORS_CONTENT.length;
