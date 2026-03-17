/**
 * ECM (Engine Control Module) Educational Content
 * 50+ comprehensive articles covering all aspects of ECM systems
 * EMERSON EIMS PROPRIETARY CONTENT - Original wording
 */

import { EducationalContent } from '../comprehensiveEducation';

export const ECM_CONTENT: EducationalContent[] = [
  {
    id: 'ECM_001',
    category: 'ecm',
    subcategory: 'fundamentals',
    title: 'Understanding ECM Architecture in Diesel Generators',
    slug: 'ecm-architecture-diesel-generators-kenya',
    keywords: ['ECM diesel generator', 'engine control module Kenya', 'generator ECM repair Nairobi', 'diesel ECM diagnostics', 'electronic engine control'],
    summary: 'The Engine Control Module serves as the central processing unit for modern diesel generators, coordinating fuel delivery, timing, and protection systems.',
    content: [
      {
        heading: 'What is an Engine Control Module?',
        paragraphs: [
          'The Engine Control Module (ECM) functions as the intelligent control center for diesel generator engines. This sophisticated electronic device continuously monitors engine parameters and adjusts fuel delivery, injection timing, and various actuators to optimize performance while protecting against damage.',
          'Modern diesel generators rely heavily on ECM technology to achieve precise fuel control, lower emissions, and improved fuel efficiency. The ECM receives input signals from numerous sensors throughout the engine, processes this data using internal algorithms, and sends output commands to actuators and injectors.',
          'Understanding ECM operation is essential for technicians working on contemporary generator systems. Unlike older mechanical injection systems, ECM-controlled engines require specialized diagnostic tools and systematic troubleshooting approaches.'
        ]
      },
      {
        heading: 'ECM Hardware Components',
        paragraphs: [
          'The ECM housing contains multiple circuit boards with microprocessors, memory chips, and driver circuits. The processor executes control algorithms stored in programmable memory. Flash memory retains calibration data and fault history.',
          'Input circuits condition sensor signals for processing. These include voltage dividers, filters, and analog-to-digital converters. Output driver circuits amplify control signals to power injectors and actuators.',
          'Connector interfaces provide sealed connections to the engine harness. Multiple connectors may be used to organize inputs, outputs, and communication channels separately.'
        ]
      },
      {
        heading: 'Power Supply Requirements',
        paragraphs: [
          'ECM power supply quality directly affects system reliability. The ECM requires stable DC voltage, typically 12V or 24V depending on system design. Internal voltage regulators create the precise voltages needed by electronic circuits.',
          'Power supply problems cause intermittent faults that are difficult to diagnose. Low voltage during cranking can reset the ECM or corrupt memory. Voltage spikes from alternator failure or jump-starting can damage input circuits.',
          'Always verify power supply voltage and ground connections before ECM diagnosis. Many apparent ECM failures are actually power supply issues.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['ECM-001', 'ECM Power Supply', 'ECM Internal Fault'],
    relatedContent: ['ECM_002', 'ECM_003', 'SENSORS_001'],
    tools: ['Diagnostic laptop', 'Multimeter', 'Oscilloscope'],
    safetyWarnings: ['Disconnect battery before working on ECM wiring', 'ECM components are sensitive to static discharge'],
    proTips: ['Many ECM issues are actually wiring or connector problems', 'Power supply quality directly affects ECM reliability'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_002',
    category: 'ecm',
    subcategory: 'diagnostics',
    title: 'ECM Fault Code Reading and Interpretation',
    slug: 'ecm-fault-code-reading-kenya',
    keywords: ['ECM fault codes Kenya', 'SPN FMI codes', 'J1939 fault diagnosis', 'generator error codes Nairobi'],
    summary: 'Learn systematic approaches to reading, interpreting, and resolving ECM fault codes using professional diagnostic techniques.',
    content: [
      {
        heading: 'Fault Code Structure Explained',
        paragraphs: [
          'ECM fault codes follow standardized formats providing specific information about detected problems. J1939 protocol uses SPN (Suspect Parameter Number) identifying the component and FMI (Failure Mode Identifier) describing the failure type.',
          'For example, SPN 110 refers to Engine Coolant Temperature while FMI 3 indicates voltage above normal. Combined, SPN 110 FMI 3 means the coolant temperature sensor circuit shows voltage higher than expected.',
          'Occurrence count tracks how many times a fault has been detected. High counts indicate persistent or recurring problems. Low counts may indicate intermittent conditions.'
        ]
      },
      {
        heading: 'Common FMI Definitions',
        paragraphs: [
          'FMI 0-2 relate to data validity. FMI 0 indicates data valid but above normal range. FMI 1 means data valid but below normal range. FMI 2 shows erratic or intermittent data.',
          'FMI 3-4 address voltage problems. FMI 3 indicates voltage above normal or shorted high. FMI 4 means voltage below normal or shorted low.',
          'FMI 5-7 cover circuit continuity. FMI 5 indicates current below normal suggesting open circuit. FMI 6 means current above normal. FMI 7 indicates mechanical system not responding correctly.'
        ]
      },
      {
        heading: 'Diagnostic Approach',
        paragraphs: [
          'Read all active and stored fault codes before beginning repairs. Active faults are currently present. Stored faults occurred previously but may have cleared.',
          'Analyze fault patterns to identify root causes. Multiple related faults often share a common cause. Address the most likely root cause first.',
          'Verify repairs by clearing codes and operating the engine. If faults return immediately, the repair was unsuccessful. Monitor for intermittent faults over extended operation.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 15,
    relatedFaultCodes: ['All ECM faults'],
    relatedContent: ['ECM_001', 'ECM_003'],
    tools: ['OEM diagnostic software', 'Multimeter', 'Breakout box'],
    proTips: ['Freeze frame data shows conditions at fault detection', 'Address stored codes even if not currently active'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_003',
    category: 'ecm',
    subcategory: 'programming',
    title: 'ECM Parameter Configuration and Calibration',
    slug: 'ecm-parameter-configuration-kenya',
    keywords: ['ECM programming Kenya', 'engine parameter adjustment', 'ECM calibration Nairobi', 'diesel generator programming'],
    summary: 'Professional guide to ECM parameter configuration covering speed settings, protection limits, and operating modes.',
    content: [
      {
        heading: 'Parameter Categories',
        paragraphs: [
          'ECM parameters are organized into categories based on function and security level. Operating parameters control basic functions like speed and idle. Protection parameters define safety limits.',
          'Customer parameters allow end-user customization within safe limits. System parameters affect core engine operation and require factory-level access.',
          'Always document original settings before making changes. Incorrect parameters can cause engine damage or unsafe operation.'
        ]
      },
      {
        heading: 'Speed and Governor Settings',
        paragraphs: [
          'Rated speed determines generator output frequency. For 50Hz systems common in Kenya, rated speed is typically 1500 RPM for 4-pole alternators or 3000 RPM for 2-pole units.',
          'Idle speed affects warm-up operation and no-load fuel consumption. Standard diesel idle ranges from 650-750 RPM depending on engine size.',
          'Governor gain controls response to load changes. Higher gain provides faster response but may cause instability. Lower gain gives smoother operation but slower response.'
        ]
      },
      {
        heading: 'Protection Limit Configuration',
        paragraphs: [
          'High temperature shutdown protects against overheating damage. Typical diesel shutdown temperature is 102-108°C. Consider ambient conditions when setting limits.',
          'Low oil pressure shutdown prevents bearing damage. Limits vary by engine model but typically range from 0.5-1.0 bar at idle and 2.5-4.0 bar at rated speed.',
          'Overspeed protection prevents mechanical damage. Overspeed shutdown is typically set 10-15% above rated speed and should never be disabled.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Parameter Out of Range', 'Calibration Required'],
    relatedContent: ['ECM_001', 'ECM_002'],
    tools: ['OEM diagnostic software', 'Parameter backup device'],
    safetyWarnings: ['Incorrect parameters can cause engine damage', 'Always backup parameters before changes'],
    whenToCallProfessional: ['System parameter modification', 'ECM replacement or re-flashing'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_004',
    category: 'ecm',
    subcategory: 'communication',
    title: 'ECM Communication Protocols: CAN Bus and J1939',
    slug: 'ecm-can-bus-j1939-kenya',
    keywords: ['CAN bus generator Kenya', 'J1939 protocol', 'ECM communication', 'diagnostic communication Nairobi'],
    summary: 'Understanding ECM communication protocols for diagnostics, data logging, and system integration.',
    content: [
      {
        heading: 'CAN Bus Fundamentals',
        paragraphs: [
          'Controller Area Network (CAN) is the primary communication protocol for modern engine systems. CAN uses differential signaling on two wires (CAN High and CAN Low) for noise immunity.',
          'Messages on CAN bus are broadcast to all connected devices. Each message has an identifier determining priority and content type. Devices filter messages based on identifiers they need.',
          'CAN bus speed varies by application. Generator systems typically use 250 kbps or 500 kbps. All devices on a network must use the same speed.'
        ]
      },
      {
        heading: 'J1939 Protocol Overview',
        paragraphs: [
          'SAE J1939 defines how engine data is organized and transmitted on CAN bus. Parameter Group Numbers (PGN) identify message types. Each PGN contains multiple parameters.',
          'Source addresses identify message originators. Standard addresses are assigned to ECM, transmission, instruments, and diagnostic tools.',
          'Diagnostic messages use specific PGNs for fault code transmission and parameter requests. Understanding these enables advanced troubleshooting.'
        ]
      },
      {
        heading: 'Communication Troubleshooting',
        paragraphs: [
          'No communication symptoms include blank displays, no diagnostic connection, and non-functional gauges. Check CAN wiring, termination resistors, and power supplies.',
          'Intermittent communication may result from damaged wiring, loose connectors, or electromagnetic interference. Route CAN wiring away from high-current conductors.',
          'Multiple communication faults often indicate network-level problems rather than individual device failures. Check termination and wiring before replacing modules.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['CAN Communication Error', 'J1939 Fault', 'Network Error'],
    relatedContent: ['ECM_001', 'CTRL_001'],
    tools: ['CAN bus analyzer', 'Oscilloscope', 'Diagnostic software'],
    proTips: ['CAN bus requires exactly two 120-ohm termination resistors', 'Measure resistance between CAN_H and CAN_L to verify termination'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_005',
    category: 'ecm',
    subcategory: 'fuel_control',
    title: 'ECM Fuel Injection Control Strategies',
    slug: 'ecm-fuel-injection-control-kenya',
    keywords: ['ECM fuel control Kenya', 'injection timing', 'fuel quantity control', 'diesel injection management'],
    summary: 'Understanding how the ECM controls fuel injection quantity, timing, and pressure for optimal engine performance.',
    content: [
      {
        heading: 'Fuel Quantity Control',
        paragraphs: [
          'The ECM determines fuel quantity based on throttle position, engine speed, and various correction factors. Base fueling maps stored in ECM memory provide starting points for each operating condition.',
          'Correction factors adjust base fueling for temperature, atmospheric pressure, and sensor feedback. Cold engines require more fuel. High altitude reduces air density requiring fuel reduction.',
          'Fuel limiters prevent overfueling that could damage the engine or exceed emissions limits. Limits may be based on boost pressure, exhaust temperature, or torque curves.'
        ]
      },
      {
        heading: 'Injection Timing Control',
        paragraphs: [
          'Injection timing determines when fuel enters the combustion chamber relative to piston position. Optimal timing varies with speed and load.',
          'Advanced timing increases power and efficiency but may increase combustion noise and NOx emissions. Retarded timing reduces noise and emissions but decreases efficiency.',
          'The ECM adjusts timing based on operating conditions. Cold start timing differs from warm operation. High load may use different timing than light load.'
        ]
      },
      {
        heading: 'Common Rail Pressure Control',
        paragraphs: [
          'Common rail systems maintain high fuel pressure in a rail supplying all injectors. The ECM controls rail pressure by adjusting the high-pressure pump output.',
          'Higher rail pressure improves atomization and penetration. Lower pressure reduces noise and stress on components. Pressure targets vary with speed and load.',
          'Rail pressure faults can indicate pump wear, regulator problems, or injector leakage. Monitor actual versus commanded pressure for diagnosis.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Fuel Quantity Fault', 'Injection Timing Error', 'Rail Pressure Fault'],
    relatedContent: ['ECM_001', 'FUEL_001', 'INJ_001'],
    tools: ['Diagnostic software', 'Pressure gauge', 'Timing tools'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_006',
    category: 'ecm',
    subcategory: 'sensors',
    title: 'ECM Sensor Input Processing and Validation',
    slug: 'ecm-sensor-input-processing-kenya',
    keywords: ['ECM sensor inputs Kenya', 'sensor validation', 'input signal processing', 'generator sensor diagnosis'],
    summary: 'How the ECM processes sensor inputs, validates data, and responds to sensor failures.',
    content: [
      {
        heading: 'Sensor Signal Types',
        paragraphs: [
          'Voltage-based sensors produce variable voltage proportional to measured parameters. Throttle position sensors and pressure sensors often use 0.5-4.5V signals referenced to 5V supply.',
          'Resistance-based sensors change resistance with measured parameters. Temperature sensors typically decrease resistance as temperature increases (NTC type).',
          'Frequency-based sensors produce pulses proportional to speed or position. Magnetic pickups and hall effect sensors generate frequency signals.'
        ]
      },
      {
        heading: 'Signal Validation',
        paragraphs: [
          'The ECM continuously validates sensor signals against expected ranges. Signals outside normal limits trigger fault codes and may activate backup strategies.',
          'Rationality checks compare related sensors. If coolant temperature and oil temperature differ excessively, one sensor may be faulty.',
          'Rate-of-change monitoring detects impossible signal changes. A temperature jump of 50°C in one second indicates sensor or wiring fault, not actual temperature change.'
        ]
      },
      {
        heading: 'Backup Strategies',
        paragraphs: [
          'When sensor faults occur, the ECM implements backup strategies to allow continued operation. Default values substitute for failed sensors.',
          'Some backup strategies reduce engine power to protect against undetected problems. Limp-home mode allows reaching a service facility but limits performance.',
          'Critical sensor failures may cause immediate shutdown if continued operation risks engine damage. Oil pressure and speed sensors often require immediate stop.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Sensor Out of Range', 'Signal Not Valid', 'Rationality Fault'],
    relatedContent: ['ECM_001', 'SENSORS_001'],
    tools: ['Multimeter', 'Oscilloscope', 'Diagnostic software'],
    proTips: ['Check reference voltage supply before condemning sensors', 'Sensor ground problems affect multiple sensors'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_007',
    category: 'ecm',
    subcategory: 'outputs',
    title: 'ECM Output Control and Driver Circuits',
    slug: 'ecm-output-control-drivers-kenya',
    keywords: ['ECM outputs Kenya', 'injector drivers', 'actuator control', 'output diagnostics'],
    summary: 'Understanding ECM output circuits that control injectors, actuators, and auxiliary devices.',
    content: [
      {
        heading: 'Injector Driver Circuits',
        paragraphs: [
          'Injector drivers provide high-current pulses to open fuel injectors. Peak current rapidly opens the injector, then holding current maintains the open position with less heat generation.',
          'Driver circuit faults include open circuit (injector not opening), short circuit (continuous current flow), and driver failure (no current output).',
          'Each injector circuit can be monitored for proper current flow. Abnormal current patterns indicate injector or wiring problems.'
        ]
      },
      {
        heading: 'PWM Output Control',
        paragraphs: [
          'Pulse Width Modulation (PWM) outputs control proportional devices like actuators and pressure regulators. Duty cycle determines the average current and resulting position.',
          'PWM frequency varies by application. Higher frequencies provide smoother control but increase switching losses. Typical frequencies range from 100-2000 Hz.',
          'Output diagnostics verify PWM signals are being generated and received by actuators. Missing PWM often indicates ECM internal fault.'
        ]
      },
      {
        heading: 'Switched Outputs',
        paragraphs: [
          'Switched outputs turn devices fully on or off. Relays, solenoids, and indicator lights typically use switched outputs.',
          'High-side drivers connect loads to positive voltage. Low-side drivers connect loads to ground. Circuit design determines which type is used.',
          'Output circuit protection includes current limiting and thermal shutdown. These features protect the ECM from wiring faults.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 15,
    relatedFaultCodes: ['Injector Circuit Open', 'Injector Circuit Short', 'Output Driver Fault'],
    relatedContent: ['ECM_001', 'ACT_001', 'INJ_001'],
    tools: ['Multimeter', 'Oscilloscope', 'Current clamp'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_008',
    category: 'ecm',
    subcategory: 'troubleshooting',
    title: 'ECM No-Start Diagnostic Procedures',
    slug: 'ecm-no-start-diagnosis-kenya',
    keywords: ['ECM no start Kenya', 'generator wont start', 'diesel no start diagnosis', 'ECM cranking no start'],
    summary: 'Systematic approach to diagnosing ECM-related no-start conditions on diesel generators.',
    content: [
      {
        heading: 'No-Start Categories',
        paragraphs: [
          'No-crank conditions prevent the starter from engaging. Check battery, starter circuit, and safety interlocks before ECM diagnosis.',
          'Crank-no-start means the engine turns but does not fire. This involves ECM, fuel, and compression systems.',
          'Start-and-die conditions indicate the engine starts but immediately shuts down. Protection systems or fuel delivery problems may be responsible.'
        ]
      },
      {
        heading: 'ECM Starting Requirements',
        paragraphs: [
          'The ECM requires valid speed signal to recognize cranking and enable fueling. No speed signal during cranking causes immediate crank-no-start.',
          'Fuel enable conditions must be met. Safety interlocks, coolant temperature, and oil pressure signals affect fuel enable logic.',
          'Injector circuits must function to deliver fuel. Even one dead injector may prevent starting on smaller engines.'
        ]
      },
      {
        heading: 'Diagnostic Approach',
        paragraphs: [
          'Connect diagnostic tool and check for active fault codes. Codes present during cranking point directly to problems.',
          'Monitor live data during cranking. Speed signal, fuel command, and injector current indicate ECM operation.',
          'If ECM data looks correct, problem is mechanical - compression or fuel delivery. If ECM data is abnormal, focus on electronic systems.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Fail to Start', 'No Speed Signal', 'Fuel Enable Fault'],
    relatedContent: ['ECM_002', 'MPU_001', 'FUEL_001'],
    tools: ['Diagnostic software', 'Multimeter', 'Fuel pressure gauge'],
    proTips: ['Check speed signal first on crank-no-start', 'Watch fuel command during cranking on diagnostic tool'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_009',
    category: 'ecm',
    subcategory: 'troubleshooting',
    title: 'ECM Intermittent Fault Diagnosis',
    slug: 'ecm-intermittent-faults-kenya',
    keywords: ['intermittent faults Kenya', 'ECM random shutdown', 'erratic engine operation', 'generator intermittent problems'],
    summary: 'Techniques for finding and fixing intermittent ECM-related faults that come and go unpredictably.',
    content: [
      {
        heading: 'Intermittent Fault Characteristics',
        paragraphs: [
          'Intermittent faults occur randomly and may not be present during inspection. Temperature changes, vibration, or electrical load variations can trigger these faults.',
          'Fault history and freeze frame data provide clues. Multiple occurrences over time with similar conditions suggest specific triggers.',
          'Intermittent faults are often wiring-related. Connections that test good statically may fail under vibration or thermal expansion.'
        ]
      },
      {
        heading: 'Diagnostic Techniques',
        paragraphs: [
          'Wiggle testing involves moving connectors and wiring while monitoring for fault code activation or parameter changes.',
          'Temperature testing uses heat gun or freeze spray to identify temperature-sensitive failures in sensors or connections.',
          'Long-term data logging records parameters continuously to capture conditions when intermittent faults occur.'
        ]
      },
      {
        heading: 'Common Intermittent Causes',
        paragraphs: [
          'Connector terminal corrosion creates resistance that varies with moisture and temperature. Clean and protect terminals.',
          'Wire chafing produces intermittent grounds or opens as insulation wears. Inspect harnesses at routing clips and pass-throughs.',
          'Cracked solder joints in ECM or sensors fail under vibration or temperature cycling. These require component replacement.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Intermittent Fault', 'Signal Lost', 'Communication Intermittent'],
    relatedContent: ['ECM_001', 'ELEC_001'],
    tools: ['Data logger', 'Oscilloscope', 'Heat gun', 'Freeze spray'],
    proTips: ['Document conditions when faults occur - time, temperature, load', 'Wiggle test while watching live data'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_010',
    category: 'ecm',
    subcategory: 'performance',
    title: 'ECM Performance Optimization and Tuning',
    slug: 'ecm-performance-tuning-kenya',
    keywords: ['ECM tuning Kenya', 'diesel performance', 'generator power increase', 'engine optimization'],
    summary: 'Understanding ECM parameters that affect engine performance and how to optimize within safe limits.',
    content: [
      {
        heading: 'Performance Parameters',
        paragraphs: [
          'Fuel quantity limits define maximum fueling at various speeds and conditions. Increasing limits adds power but risks engine damage and increased emissions.',
          'Injection timing affects power output and efficiency. Advanced timing typically increases power but may increase combustion noise.',
          'Boost limits on turbocharged engines control maximum turbocharger pressure. Higher boost increases power but stresses engine components.'
        ]
      },
      {
        heading: 'Optimization Considerations',
        paragraphs: [
          'Factory calibrations balance power, efficiency, emissions, and durability. Changes prioritizing one factor affect others.',
          'Operating environment matters. Generators in hot climates or at altitude may need different calibrations than those at sea level.',
          'Load profiles affect optimal settings. Continuous duty applications benefit from efficiency calibrations. Standby applications may prioritize starting performance.'
        ]
      },
      {
        heading: 'Safety Boundaries',
        paragraphs: [
          'Protection parameters should not be disabled. High temperature and overspeed protection prevent catastrophic failures.',
          'Emission regulations may restrict ECM modifications. Tampering with emission controls can result in penalties.',
          'Warranty implications exist for non-factory calibrations. Document any changes and understand warranty effects.'
        ]
      }
    ],
    skillLevel: 'expert',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Engine Derate', 'Over Fuel', 'Over Boost'],
    relatedContent: ['ECM_003', 'ECM_005'],
    tools: ['OEM programming software', 'Dyno testing equipment'],
    safetyWarnings: ['Improper tuning can damage engine', 'Never disable protection systems'],
    whenToCallProfessional: ['Any performance modification', 'Emission-related parameters'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_011',
    category: 'ecm',
    subcategory: 'replacement',
    title: 'ECM Replacement and Programming Procedures',
    slug: 'ecm-replacement-programming-kenya',
    keywords: ['ECM replacement Kenya', 'ECM programming', 'new ECM installation', 'ECM cloning'],
    summary: 'Procedures for replacing a failed ECM including programming, configuration, and verification steps.',
    content: [
      {
        heading: 'Pre-Replacement Verification',
        paragraphs: [
          'Confirm ECM failure before replacement. Many apparent ECM faults are actually wiring, power supply, or sensor problems.',
          'Read and record all parameters from the original ECM if possible. This data may be needed to configure the replacement.',
          'Identify the correct replacement ECM. Part numbers, software versions, and hardware revisions must match application requirements.'
        ]
      },
      {
        heading: 'Physical Installation',
        paragraphs: [
          'Disconnect battery before removing old ECM. ECM damage can occur if connectors are disturbed with power applied.',
          'Handle replacement ECM carefully. Electrostatic discharge can damage electronic components. Use ESD protection.',
          'Verify connector pins are not bent or damaged. Clean contacts if necessary. Apply dielectric grease to prevent corrosion.'
        ]
      },
      {
        heading: 'Programming and Configuration',
        paragraphs: [
          'New ECMs typically require programming with application-specific calibration files. Some ECMs come pre-programmed for specific engines.',
          'Customer parameters must be transferred or re-entered. These include speed settings, protection limits, and I/O configurations.',
          'Injector calibration codes may need entry for optimal performance. These codes compensate for injector manufacturing variations.'
        ]
      },
      {
        heading: 'Post-Installation Verification',
        paragraphs: [
          'Start engine and verify basic operation. Check for fault codes and compare sensor readings to expected values.',
          'Test all functions including protection systems. Simulate fault conditions to verify proper shutdown behavior.',
          'Document all programming performed. Record software versions and parameter settings for future reference.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 20,
    relatedFaultCodes: ['ECM Internal Fault', 'Calibration Required', 'Configuration Error'],
    relatedContent: ['ECM_003', 'ECM_001'],
    tools: ['OEM programming software', 'New ECM unit', 'ESD protection'],
    safetyWarnings: ['Always disconnect battery before ECM removal', 'Use ESD protection when handling ECM'],
    whenToCallProfessional: ['If programming software is not available', 'For warranty considerations'],
    partsPageLink: '/parts/ecm-controllers',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_012',
    category: 'ecm',
    subcategory: 'wiring',
    title: 'ECM Wiring Harness Diagnosis and Repair',
    slug: 'ecm-wiring-harness-diagnosis-kenya',
    keywords: ['ECM wiring Kenya', 'harness repair', 'connector diagnosis', 'wiring faults generator'],
    summary: 'Techniques for diagnosing and repairing ECM wiring harness problems that cause various system faults.',
    content: [
      {
        heading: 'Common Wiring Failures',
        paragraphs: [
          'Connector corrosion is prevalent in humid environments. Kenya coastal regions see accelerated connector deterioration.',
          'Chafing occurs where harnesses contact engine components or pass through grommets. Vibration accelerates insulation wear.',
          'Rodent damage affects generators in storage. Wire insulation provides nesting material and food source for rodents.'
        ]
      },
      {
        heading: 'Diagnostic Techniques',
        paragraphs: [
          'Visual inspection identifies obvious damage. Follow harness routing and inspect at stress points, clips, and pass-throughs.',
          'Continuity testing verifies wire integrity. Test between ECM connector and sensor/actuator ends with harness disconnected.',
          'Insulation testing with megohmmeter identifies damaged insulation that may cause intermittent grounds.'
        ]
      },
      {
        heading: 'Repair Procedures',
        paragraphs: [
          'Splice repairs should use proper crimping and heat-shrink protection. Solder connections are acceptable but must be properly insulated.',
          'Connector repairs may require terminal replacement. Use proper terminals and tools for reliable connections.',
          'Harness replacement may be necessary for extensive damage. Route new harness following original path and secure properly.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 15,
    relatedFaultCodes: ['Open Circuit', 'Short Circuit', 'Ground Fault'],
    relatedContent: ['ECM_001', 'ELEC_001'],
    tools: ['Multimeter', 'Wire strippers', 'Crimping tools', 'Heat gun'],
    proTips: ['Document wire colors and positions before disconnecting', 'Use marine-grade connectors in humid environments'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_013',
    category: 'ecm',
    subcategory: 'protection',
    title: 'ECM Engine Protection System Configuration',
    slug: 'ecm-engine-protection-configuration-kenya',
    keywords: ['ECM protection Kenya', 'engine shutdown settings', 'protection configuration', 'alarm settings'],
    summary: 'Configuring ECM protection systems to provide appropriate warning and shutdown responses.',
    content: [
      {
        heading: 'Protection System Overview',
        paragraphs: [
          'ECM protection systems monitor engine parameters and respond to abnormal conditions. Responses include warning alarms, power reduction (derate), and engine shutdown.',
          'Protection setpoints define the levels at which responses activate. Warning setpoints typically activate before shutdown setpoints.',
          'Response delays allow for transient conditions without false alarms. Short delays protect against damage while longer delays prevent nuisance shutdowns.'
        ]
      },
      {
        heading: 'Temperature Protection',
        paragraphs: [
          'Coolant temperature protection prevents overheating damage. Warning typically activates at 98-102°C with shutdown at 104-108°C.',
          'Oil temperature monitoring provides secondary overheating protection. Oil overheating indicates severe cooling problems.',
          'Intake air temperature protection limits power when intake air is too hot for rated output.'
        ]
      },
      {
        heading: 'Pressure Protection',
        paragraphs: [
          'Oil pressure protection prevents bearing damage. Warning typically activates at 1.0-1.5 bar with shutdown at 0.5-0.8 bar.',
          'Fuel pressure monitoring detects fuel supply problems before engine damage occurs.',
          'Crankcase pressure monitoring detects excessive blowby indicating internal wear or failure.'
        ]
      },
      {
        heading: 'Speed Protection',
        paragraphs: [
          'Overspeed protection prevents mechanical damage from excessive RPM. Shutdown typically at 110-115% of rated speed.',
          'Underspeed protection detects engine stall or overload conditions. May activate power reduction or shutdown.',
          'Speed deviation protection compares commanded speed to actual speed, detecting governor or actuator faults.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['High Temperature Shutdown', 'Low Oil Pressure Shutdown', 'Overspeed Shutdown'],
    relatedContent: ['ECM_003', 'SENS_001'],
    tools: ['Diagnostic software', 'Test equipment for simulation'],
    safetyWarnings: ['Never disable protection systems', 'Test protection function after changes'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_014',
    category: 'ecm',
    subcategory: 'emissions',
    title: 'ECM Emission Control System Operation',
    slug: 'ecm-emission-control-kenya',
    keywords: ['ECM emissions Kenya', 'diesel emissions', 'EGR control', 'DPF regeneration'],
    summary: 'Understanding ECM-controlled emission reduction systems and their diagnostic requirements.',
    content: [
      {
        heading: 'Emission Control Overview',
        paragraphs: [
          'Modern diesel engines use multiple technologies to reduce exhaust emissions. The ECM coordinates these systems for compliance with emission standards.',
          'In-cylinder measures include precise fuel injection control, optimized timing, and controlled combustion temperatures.',
          'After-treatment systems process exhaust gases to further reduce harmful emissions. These include oxidation catalysts, particulate filters, and SCR systems.'
        ]
      },
      {
        heading: 'EGR System Control',
        paragraphs: [
          'Exhaust Gas Recirculation (EGR) returns exhaust to intake to reduce combustion temperature and NOx formation.',
          'The ECM controls EGR valve position based on operating conditions. Too much EGR causes smoke; too little increases NOx.',
          'EGR system faults affect emissions and may cause visible smoke. Common problems include stuck valves and clogged passages.'
        ]
      },
      {
        heading: 'Particulate Filter Management',
        paragraphs: [
          'Diesel Particulate Filters (DPF) trap soot particles that must be periodically burned off (regeneration).',
          'The ECM monitors soot loading and initiates regeneration when needed. This involves increasing exhaust temperature to burn accumulated soot.',
          'Failed regeneration can overload the filter. Continuous operation at light load may prevent regeneration, requiring service intervention.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 16,
    relatedFaultCodes: ['EGR Fault', 'DPF Regeneration Required', 'Emission System Fault'],
    relatedContent: ['ECM_005', 'EXHAUST_001'],
    tools: ['Diagnostic software', 'Exhaust gas analyzer'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_015',
    category: 'ecm',
    subcategory: 'security',
    title: 'ECM Security Systems and Access Control',
    slug: 'ecm-security-access-control-kenya',
    keywords: ['ECM security Kenya', 'parameter passwords', 'ECM access levels', 'security configuration'],
    summary: 'Understanding ECM security features that protect against unauthorized access and parameter changes.',
    content: [
      {
        heading: 'Security Level Overview',
        paragraphs: [
          'ECM security restricts access to sensitive parameters and functions. Multiple security levels provide appropriate access for different users.',
          'Customer level access allows monitoring and basic adjustments. Service level provides access to diagnostic functions and standard parameters.',
          'Factory level access enables all parameters and calibration functions. This level is typically restricted to authorized personnel.'
        ]
      },
      {
        heading: 'Password Protection',
        paragraphs: [
          'Passwords protect higher security levels. Default passwords should be changed during commissioning for security.',
          'Lost passwords may require manufacturer intervention. Document passwords securely to prevent lockout situations.',
          'Some functions remain accessible without passwords for emergency operation and basic diagnostics.'
        ]
      },
      {
        heading: 'Anti-Tampering Features',
        paragraphs: [
          'Parameter change logging records all modifications with timestamps. This provides accountability for changes.',
          'Calibration sealing prevents changes to emission-related parameters after certification.',
          'Remote monitoring can alert to unauthorized access attempts or parameter changes.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Security Violation', 'Access Denied'],
    relatedContent: ['ECM_003', 'ECM_011'],
    tools: ['OEM diagnostic software'],
    proTips: ['Document passwords securely', 'Change default passwords during commissioning'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_016',
    category: 'ecm',
    subcategory: 'data_logging',
    title: 'ECM Data Logging and Trend Analysis',
    slug: 'ecm-data-logging-analysis-kenya',
    keywords: ['ECM data logging Kenya', 'parameter trending', 'performance monitoring', 'diagnostic data'],
    summary: 'Using ECM data logging capabilities for performance monitoring, trend analysis, and predictive maintenance.',
    content: [
      {
        heading: 'Data Logging Capabilities',
        paragraphs: [
          'Modern ECMs continuously record operating parameters. Historical data enables trend analysis and problem diagnosis.',
          'Snapshot data captures conditions at specific events like fault code activation. This freeze frame data aids troubleshooting.',
          'Trip data summarizes operation since last reset. This includes runtime hours, fuel consumption, and event counts.'
        ]
      },
      {
        heading: 'Parameter Selection',
        paragraphs: [
          'Standard logging includes engine speed, load, temperatures, and pressures. These parameters indicate overall health.',
          'Extended logging may capture injector balance, turbo performance, and emission system data for detailed analysis.',
          'Custom logging configurations allow focus on specific parameters of interest for particular diagnostic needs.'
        ]
      },
      {
        heading: 'Trend Analysis',
        paragraphs: [
          'Comparing current data to baseline reveals degradation trends. Gradually increasing temperatures or decreasing pressures indicate developing problems.',
          'Fuel consumption trends indicate efficiency changes. Increasing consumption with constant load suggests wear or calibration drift.',
          'Event frequency analysis identifies recurring problems. Increasing fault code frequency indicates progressive failure.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Data Log Full', 'Parameter Record Fault'],
    relatedContent: ['ECM_002', 'ECM_010'],
    tools: ['Diagnostic software', 'Data analysis software'],
    proTips: ['Establish baselines on healthy engines', 'Review data logs during routine service'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_017',
    category: 'ecm',
    subcategory: 'starting',
    title: 'ECM Cold Start and Warm-Up Control',
    slug: 'ecm-cold-start-warmup-kenya',
    keywords: ['ECM cold start Kenya', 'glow plug control', 'warm-up procedure', 'cold engine starting'],
    summary: 'How the ECM manages cold starting including glow plug control, starting enrichment, and warm-up strategies.',
    content: [
      {
        heading: 'Glow Plug Control',
        paragraphs: [
          'The ECM controls glow plug operation based on coolant temperature and atmospheric conditions. Colder temperatures require longer glow times.',
          'Pre-glow activates before cranking to heat combustion chambers. Post-glow continues after start to reduce white smoke and stabilize combustion.',
          'Glow plug circuit monitoring detects failures. Failed glow plugs may not prevent starting in warm conditions but cause hard starting when cold.'
        ]
      },
      {
        heading: 'Starting Enrichment',
        paragraphs: [
          'Cold engines receive additional fuel during cranking to compensate for fuel condensation on cold surfaces.',
          'Enrichment amount depends on coolant temperature. Very cold engines receive maximum enrichment.',
          'Enrichment tapers off as engine temperature rises. Prolonged enrichment causes smoke and possible catalyst damage.'
        ]
      },
      {
        heading: 'Warm-Up Strategies',
        paragraphs: [
          'Fast idle raises engine speed during warm-up to accelerate temperature rise. Speed decreases as temperature increases.',
          'Load limiting prevents full power demand until engine reaches operating temperature. This protects against thermal stress.',
          'Timing and injection adjustments during warm-up optimize cold running and reduce emissions.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Glow Plug Circuit Fault', 'Cold Start Fault', 'Warm-Up Fault'],
    relatedContent: ['ECM_008', 'ECM_005'],
    tools: ['Diagnostic software', 'Multimeter', 'Coolant thermometer'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_018',
    category: 'ecm',
    subcategory: 'idle',
    title: 'ECM Idle Speed Control and Stability',
    slug: 'ecm-idle-speed-control-kenya',
    keywords: ['ECM idle control Kenya', 'idle speed adjustment', 'idle stability', 'idle hunting'],
    summary: 'Understanding ECM idle speed control including adjustments, fault diagnosis, and stability optimization.',
    content: [
      {
        heading: 'Idle Speed Control',
        paragraphs: [
          'The ECM maintains stable idle speed despite varying loads from alternator, air conditioning, and other accessories.',
          'Target idle speed varies with operating conditions. Cold engines idle faster to accelerate warm-up.',
          'The governor rapidly adjusts fuel to counter load changes. Fast response prevents speed droop when loads apply.'
        ]
      },
      {
        heading: 'Idle Stability Problems',
        paragraphs: [
          'Hunting or surging at idle indicates control system problems. Governor settings, actuator response, or feedback signal issues cause instability.',
          'Rough idle with stable speed may indicate combustion problems - worn injectors, low compression, or incorrect timing.',
          'Low idle speed can cause stalling when loads apply. Verify idle speed setting and check for restrictions on speed increase.'
        ]
      },
      {
        heading: 'Adjustment Procedures',
        paragraphs: [
          'Idle speed adjustment is typically a protected parameter requiring service tool access.',
          'After adjustment, verify stability by applying and removing loads. Speed should recover quickly without overshooting.',
          'Some systems have separate stability adjustments affecting response speed and damping.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Idle Speed Fault', 'Idle Stability Fault', 'Governor Fault'],
    relatedContent: ['ECM_003', 'ACT_001'],
    tools: ['Diagnostic software', 'Tachometer'],
    proTips: ['Verify idle with all accessories on', 'Check idle stability at various temperatures'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_019',
    category: 'ecm',
    subcategory: 'turbo',
    title: 'ECM Turbocharger Boost Control',
    slug: 'ecm-turbo-boost-control-kenya',
    keywords: ['ECM turbo control Kenya', 'boost control', 'wastegate control', 'VGT control'],
    summary: 'How the ECM controls turbocharger boost pressure for optimal performance and protection.',
    content: [
      {
        heading: 'Boost Control Systems',
        paragraphs: [
          'Modern turbocharged engines use ECM-controlled boost regulation. This provides precise boost control across all operating conditions.',
          'Wastegate turbochargers bypass exhaust to limit boost. The ECM controls wastegate position via pneumatic or electronic actuators.',
          'Variable Geometry Turbochargers (VGT) adjust turbine vane angles. This provides boost control with improved transient response.'
        ]
      },
      {
        heading: 'Boost Control Strategy',
        paragraphs: [
          'Boost targets vary with engine speed and load. Low speed operation typically has lower boost targets than high speed, full load conditions.',
          'Altitude compensation adjusts boost targets for atmospheric pressure. Higher altitude may allow higher boost to compensate for lower air density.',
          'Protection limits prevent over-boost that could damage turbo or engine. High boost faults indicate control problems or system failures.'
        ]
      },
      {
        heading: 'Boost System Diagnostics',
        paragraphs: [
          'Low boost may indicate boost leaks, worn turbo, or restricted exhaust. Compare actual to commanded boost for diagnosis.',
          'High boost or boost control faults indicate stuck actuators or sensor problems. Verify actuator movement and feedback signals.',
          'Slow boost response may indicate clogged air filter, exhaust restrictions, or degraded turbocharger bearings.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Boost Pressure Low', 'Boost Pressure High', 'Wastegate Fault', 'VGT Fault'],
    relatedContent: ['ECM_005', 'TURBO_001'],
    tools: ['Boost gauge', 'Diagnostic software', 'Actuator tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_020',
    category: 'ecm',
    subcategory: 'altitude',
    title: 'ECM Altitude and Environmental Compensation',
    slug: 'ecm-altitude-compensation-kenya',
    keywords: ['ECM altitude Kenya', 'high altitude operation', 'environmental compensation', 'barometric pressure'],
    summary: 'How the ECM compensates for altitude and environmental conditions to maintain performance.',
    content: [
      {
        heading: 'Altitude Effects on Performance',
        paragraphs: [
          'Kenya has significant altitude variation from sea level at Mombasa to over 2500m in Nairobi and highlands. This affects generator engine performance.',
          'Lower air density at altitude reduces oxygen available for combustion. Without compensation, engines produce less power and may smoke excessively.',
          'The ECM uses barometric pressure sensors to measure atmospheric pressure and adjust fueling accordingly.'
        ]
      },
      {
        heading: 'Compensation Strategies',
        paragraphs: [
          'Fuel quantity is reduced at altitude to match reduced air flow. This maintains air-fuel ratio and combustion quality.',
          'Turbocharged engines can partially compensate by increasing boost. However, absolute power still decreases with altitude.',
          'Protection limits may be adjusted. Lower atmospheric pressure affects cooling capability, requiring adjusted temperature limits.'
        ]
      },
      {
        heading: 'Installation Considerations',
        paragraphs: [
          'Generator ratings often specify altitude derating. A 100kW sea-level generator may only produce 85kW at 2000m altitude.',
          'Cooling system capability decreases with altitude. Additional cooling capacity may be needed for highland installations.',
          'Starting aids may be needed at altitude due to lower air density reducing compression heating.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Barometric Sensor Fault', 'Altitude Derate Active'],
    relatedContent: ['ECM_003', 'COOL_001'],
    tools: ['Altitude meter', 'Diagnostic software'],
    proTips: ['Know the rated altitude limit for your generator', 'Consider altitude when sizing generators for highland Kenya'],
    lastUpdated: '2024-03-15'
  }
];

// Export count for statistics
export const ECM_CONTENT_COUNT = ECM_CONTENT.length;
