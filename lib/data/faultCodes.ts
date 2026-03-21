/**
 * GENERATOR FAULT CODE DATABASE
 * Comprehensive fault codes for SEO-optimized individual pages
 * Covers Cummins, DSE, ComAp, Deep Sea Electronics, Perkins
 *
 * Each fault code is structured for maximum SEO value
 * Target searches: "Cummins SPN 1514 fault code", "DSE E020 error", etc.
 */

export interface FaultCode {
  code: string;
  brand: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  possibleCauses: string[];
  troubleshootingSteps: string[];
  relatedParts: string[];
  relatedCodes: string[];
  // SEO fields
  searchKeywords: string[];
  faqQuestions: { question: string; answer: string }[];
}

export const FAULT_CODES: FaultCode[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // CUMMINS SPN FAULT CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'SPN-111',
    brand: 'Cummins',
    title: 'ECM Internal Hardware Failure',
    description: 'The Electronic Control Module (ECM) has detected an internal hardware fault. This code indicates that the ECM\'s internal circuitry or processor has experienced a failure that may affect engine performance, fuel injection timing, or sensor readings. Immediate diagnostic action is required to prevent potential engine damage or unexpected shutdowns.',
    severity: 'critical',
    category: 'ECM/Controller',
    possibleCauses: [
      'Internal ECM circuit failure or component degradation',
      'Power surge damage from generator load fluctuations',
      'Water ingress through damaged connector seals',
      'Excessive vibration causing solder joint failures',
      'Overheating due to poor ventilation or cooling system failure',
      'Manufacturing defect in ECM components'
    ],
    troubleshootingSteps: [
      'Connect Cummins INSITE diagnostic tool and record all active fault codes',
      'Check ECM power supply voltage - should read 24V DC (+/- 2V)',
      'Inspect ECM connector pins for corrosion, bent pins, or moisture',
      'Verify ground connections are secure and free from corrosion',
      'Clear fault code and perform controlled engine test run',
      'If code returns, document conditions and contact Cummins authorized service center'
    ],
    relatedParts: [
      'ECM Module (Part varies by engine model)',
      'ECM Wiring Harness',
      'ECM Connector Kit',
      'Connector Seal Kit',
      'Battery Cable Kit'
    ],
    relatedCodes: ['SPN-115', 'SPN-639', 'SPN-629'],
    searchKeywords: ['Cummins 111', 'Cummins ECM failure', 'Cummins SPN 629', 'generator ECM fault'],
    faqQuestions: [
      {
        question: 'What does Cummins fault code 111 mean?',
        answer: 'Cummins fault code 111 indicates an internal hardware failure within the Electronic Control Module (ECM). This is a critical fault that requires immediate attention as it can affect engine performance, fuel injection, and sensor readings.'
      },
      {
        question: 'Can I continue running the generator with code 111?',
        answer: 'It is not recommended to continue operating the generator with an active SPN-111 fault code. The ECM failure may cause erratic engine behavior, incorrect fuel injection, or sudden shutdown. Have the unit diagnosed by a qualified technician immediately.'
      }
    ]
  },
  {
    code: 'SPN-115',
    brand: 'Cummins',
    title: 'Engine Speed Sensor - No Signal',
    description: 'The ECM is not receiving a signal from the engine crankshaft position sensor. Without this critical signal, the ECM cannot determine engine speed or crankshaft position, preventing proper fuel injection timing and ignition. The engine may crank but not start, or may stall unexpectedly during operation.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Failed crankshaft position sensor (magnetic pickup)',
      'Damaged or corroded sensor wiring harness',
      'Sensor air gap too large due to movement or wear',
      'Damaged flywheel tone wheel (gear teeth)',
      'Corroded or water-damaged sensor connector',
      'ECM speed sensor input circuit failure'
    ],
    troubleshootingSteps: [
      'Check sensor resistance with multimeter - should read 200-900 ohms',
      'Verify sensor air gap using feeler gauge - typically 0.5mm to 1.5mm',
      'Inspect flywheel tone wheel for damaged, missing, or worn teeth',
      'Check sensor wiring continuity from sensor to ECM connector',
      'Inspect connector for corrosion, moisture, or backed-out pins',
      'If wiring and sensor check good, test ECM input circuit'
    ],
    relatedParts: [
      'Crankshaft Position Sensor',
      'Sensor O-Ring/Seal',
      'Sensor Wiring Harness',
      'ECM Connector',
      'Flywheel Assembly (if teeth damaged)'
    ],
    relatedCodes: ['SPN-111', 'SPN-190', 'SPN-723'],
    searchKeywords: ['Cummins 115', 'Cummins crank sensor', 'generator won\'t start crank sensor', 'SPN 190 no signal'],
    faqQuestions: [
      {
        question: 'Why won\'t my Cummins generator start with code 115?',
        answer: 'Code 115 indicates the ECM isn\'t receiving engine speed information from the crankshaft sensor. Without knowing engine position, the ECM cannot fire fuel injectors at the correct time, preventing the engine from starting.'
      },
      {
        question: 'How do I test a Cummins crankshaft position sensor?',
        answer: 'Use a multimeter to check resistance across the sensor terminals - it should read between 200-900 ohms. Also verify the air gap between sensor and flywheel teeth is 0.5-1.5mm using a feeler gauge.'
      }
    ]
  },
  {
    code: 'SPN-190',
    brand: 'Cummins',
    title: 'Engine Overspeed Warning',
    description: 'The engine has exceeded its maximum safe operating speed. This protection fault activates when engine RPM surpasses the manufacturer\'s specified limit, typically 10-15% above rated speed. Engine overspeed can cause catastrophic mechanical damage including connecting rod failure, piston damage, and crankshaft breakage.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Governor or actuator malfunction',
      'Fuel injection pump stuck in high fuel position',
      'Sudden load rejection (load dump)',
      'Speed sensor signal interference',
      'ECM calibration error',
      'Mechanical governor spring failure'
    ],
    troubleshootingSteps: [
      'Review fault log for conditions when overspeed occurred',
      'Check if overspeed was caused by sudden load rejection',
      'Inspect governor actuator for proper operation and response',
      'Verify fuel rack or injector pump returns to idle position',
      'Check speed sensor for intermittent signal issues',
      'Test load bank to verify proper load transfer and control'
    ],
    relatedParts: [
      'Governor Actuator',
      'Governor Control Module',
      'Speed Sensor',
      'Fuel Injection Pump',
      'Overspeed Relay'
    ],
    relatedCodes: ['SPN-115', 'SPN-723', 'SPN-91'],
    searchKeywords: ['Cummins overspeed', 'generator overspeed shutdown', 'SPN 190', 'engine overspeed protection'],
    faqQuestions: [
      {
        question: 'What causes a Cummins generator to overspeed?',
        answer: 'Generator overspeed is typically caused by sudden load rejection (when the electrical load is suddenly disconnected), governor malfunction, or fuel system issues that prevent proper speed control.'
      },
      {
        question: 'Is overspeed damage serious?',
        answer: 'Yes, overspeed can cause catastrophic engine damage including bent connecting rods, piston failure, and crankshaft damage. Always investigate and correct the cause before restarting.'
      }
    ]
  },
  {
    code: 'SPN-100',
    brand: 'Cummins',
    title: 'Engine Oil Pressure Low',
    description: 'Engine oil pressure has dropped below the minimum safe operating threshold. Low oil pressure can cause severe engine damage within minutes as bearings, pistons, and camshafts rely on pressurized oil for lubrication and cooling. This fault requires immediate engine shutdown to prevent catastrophic failure.',
    severity: 'critical',
    category: 'Lubrication System',
    possibleCauses: [
      'Low engine oil level - check dipstick immediately',
      'Worn main or rod bearings allowing oil bypass',
      'Failed or weak oil pump',
      'Oil pressure sensor/sender failure',
      'Oil filter bypass valve stuck open',
      'Incorrect oil viscosity for operating temperature'
    ],
    troubleshootingSteps: [
      'Check engine oil level - add oil if low and inspect for leaks',
      'Install mechanical oil pressure gauge to verify actual pressure',
      'Check oil condition - look for coolant contamination or metal particles',
      'Replace oil pressure sensor if mechanical gauge shows normal pressure',
      'If actual pressure is low, inspect oil pump and bearings',
      'Perform oil analysis to detect bearing wear or contamination'
    ],
    relatedParts: [
      'Oil Pressure Sensor',
      'Oil Pump Assembly',
      'Oil Filter',
      'Engine Oil (correct grade)',
      'Main Bearings',
      'Rod Bearings'
    ],
    relatedCodes: ['SPN-101', 'SPN-94', 'SPN-175'],
    searchKeywords: ['Cummins low oil pressure', 'SPN 100', 'generator oil pressure fault', 'engine oil pressure warning'],
    faqQuestions: [
      {
        question: 'Can I run the generator with low oil pressure warning?',
        answer: 'Absolutely not. Running an engine with low oil pressure will cause rapid bearing wear and can destroy the engine within minutes. Stop immediately and diagnose the cause.'
      },
      {
        question: 'Why does my generator show low oil pressure when the oil is full?',
        answer: 'If oil level is correct but pressure is low, the oil pressure sensor may be faulty. Verify with a mechanical gauge. If actual pressure is low, the oil pump or bearings may be worn.'
      }
    ]
  },
  {
    code: 'SPN-94',
    brand: 'Cummins',
    title: 'Fuel Pressure Low',
    description: 'The fuel system pressure is below the minimum required for proper injection. Low fuel pressure prevents adequate fuel delivery to the injectors, causing hard starting, loss of power, rough running, and potential engine stalling under load. Modern common-rail systems require precise fuel pressure for proper atomization.',
    severity: 'warning',
    category: 'Fuel System',
    possibleCauses: [
      'Restricted fuel filter - most common cause',
      'Air leak in fuel supply line (suction side)',
      'Failed or worn fuel transfer pump',
      'Restricted fuel tank pickup or vent',
      'Fuel pressure regulator malfunction',
      'Fuel supply line restriction or kink'
    ],
    troubleshootingSteps: [
      'Check and replace fuel filters - primary and secondary',
      'Inspect fuel lines for kinks, damage, or loose connections',
      'Test fuel supply pump output pressure and volume',
      'Check fuel tank for contamination, water, or blocked vent',
      'Inspect fuel pressure regulator operation',
      'Prime fuel system and check for air in fuel lines'
    ],
    relatedParts: [
      'Primary Fuel Filter',
      'Secondary Fuel Filter',
      'Fuel Transfer Pump',
      'Fuel Pressure Regulator',
      'Fuel Lines and Fittings',
      'Fuel/Water Separator'
    ],
    relatedCodes: ['SPN-157', 'SPN-100', 'SPN-158'],
    searchKeywords: ['Cummins fuel pressure', 'SPN 94', 'generator fuel system', 'low fuel pressure fault'],
    faqQuestions: [
      {
        question: 'What is the most common cause of low fuel pressure in generators?',
        answer: 'The most common cause is a restricted fuel filter. Fuel filters should be replaced at the manufacturer recommended intervals or sooner if fuel quality is poor.'
      },
      {
        question: 'How do I check for air in the Cummins fuel system?',
        answer: 'Check for bubbles in clear fuel line sections, listen for sucking sounds at connections, and inspect all fittings on the suction side (tank to transfer pump) for tightness.'
      }
    ]
  },
  {
    code: 'SPN-102',
    brand: 'Cummins',
    title: 'Intake Manifold Pressure High',
    description: 'The turbocharger is producing excessive boost pressure beyond normal operating parameters. Over-boost conditions can cause pre-detonation, excessive cylinder pressures, head gasket failure, and potential engine damage. This fault is often accompanied by black smoke and engine knocking.',
    severity: 'warning',
    category: 'Air Intake/Turbo',
    possibleCauses: [
      'Turbo wastegate stuck closed or binding',
      'Wastegate actuator diaphragm failure',
      'Boost control solenoid malfunction',
      'Restricted exhaust system increasing backpressure',
      'MAP sensor reading incorrectly high',
      'ECM boost control calibration error'
    ],
    troubleshootingSteps: [
      'Check wastegate actuator for free movement',
      'Verify boost control solenoid operation with multimeter',
      'Inspect exhaust system for restrictions or collapsed piping',
      'Test MAP sensor output compared to known gauge',
      'Check turbo compressor wheel for damage',
      'Verify correct turbo wastegate adjustment'
    ],
    relatedParts: [
      'Wastegate Actuator',
      'Boost Control Solenoid',
      'MAP Sensor',
      'Turbocharger Assembly',
      'Exhaust Manifold Gasket',
      'Boost Pressure Tubing'
    ],
    relatedCodes: ['SPN-105', 'SPN-106', 'SPN-411'],
    searchKeywords: ['Cummins overboost', 'turbo wastegate', 'SPN 102', 'high boost pressure generator'],
    faqQuestions: [
      {
        question: 'What does high intake manifold pressure indicate?',
        answer: 'High intake manifold pressure (overboost) indicates the turbocharger is producing more boost than designed. This is usually caused by a stuck wastegate or failed boost control system.'
      },
      {
        question: 'Can overboost damage my generator engine?',
        answer: 'Yes, sustained overboost can cause detonation, head gasket failure, piston damage, and connecting rod failure. Stop the engine and repair before continuing operation.'
      }
    ]
  },
  {
    code: 'SPN-105',
    brand: 'Cummins',
    title: 'Intake Manifold Temperature High',
    description: 'Air entering the engine from the turbocharger is excessively hot. High intake air temperature reduces engine efficiency, increases exhaust temperatures, and can cause detonation. This fault typically indicates a problem with the charge air cooler (intercooler) or ambient temperature issues.',
    severity: 'warning',
    category: 'Air Intake/Turbo',
    possibleCauses: [
      'Restricted or damaged charge air cooler (intercooler)',
      'Coolant leak in charge air cooler (if water-to-air type)',
      'Failed or stuck intercooler bypass valve',
      'Blocked cooling fins on air-to-air intercooler',
      'High ambient temperature operation',
      'Turbocharger running excessively hot'
    ],
    troubleshootingSteps: [
      'Clean charge air cooler external fins of debris and dirt',
      'Check for boost leaks in intercooler piping and connections',
      'Inspect intercooler for internal restrictions or damage',
      'Verify intercooler bypass valve operation if equipped',
      'Check turbocharger for proper operation and bearing wear',
      'Ensure adequate ventilation in generator enclosure'
    ],
    relatedParts: [
      'Charge Air Cooler (Intercooler)',
      'Intercooler Hoses',
      'Intercooler Bypass Valve',
      'Temperature Sensor',
      'Turbocharger',
      'Cooling Fan Assembly'
    ],
    relatedCodes: ['SPN-102', 'SPN-106', 'SPN-110'],
    searchKeywords: ['Cummins intake temp', 'intercooler fault', 'SPN 105', 'charge air cooler'],
    faqQuestions: [
      {
        question: 'Why is my generator intake air temperature high?',
        answer: 'High intake air temperature is usually caused by a dirty or restricted intercooler, boost leaks, or inadequate cooling airflow. In hot climates, ensure proper ventilation around the generator.'
      },
      {
        question: 'How often should I clean the charge air cooler?',
        answer: 'Clean the external fins of air-to-air intercoolers at each major service or when visibly dirty. Inspect for internal restrictions annually or if high intake temp faults occur.'
      }
    ]
  },
  {
    code: 'SPN-110',
    brand: 'Cummins',
    title: 'Engine Coolant Temperature High',
    description: 'Engine coolant temperature has exceeded the maximum safe operating limit. Overheating can cause severe engine damage including head gasket failure, piston scoring, and potential engine seizure. This is a shutdown-class fault that requires immediate attention.',
    severity: 'critical',
    category: 'Cooling System',
    possibleCauses: [
      'Low coolant level from leak or evaporation',
      'Failed thermostat stuck in closed position',
      'Radiator fins blocked with debris',
      'Failed water pump or damaged impeller',
      'Collapsed or restricted coolant hoses',
      'Failed cooling fan or fan clutch'
    ],
    troubleshootingSteps: [
      'Check coolant level in radiator and expansion tank - add if low',
      'Inspect for visible coolant leaks at hoses, clamps, and gaskets',
      'Verify cooling fan operation and proper belt tension',
      'Check thermostat operation - should open at rated temperature',
      'Clean radiator fins of any debris or blockage',
      'Test water pump for proper flow and impeller condition'
    ],
    relatedParts: [
      'Thermostat',
      'Water Pump',
      'Radiator',
      'Cooling Fan',
      'Fan Belt',
      'Coolant Temperature Sensor',
      'Coolant Hoses'
    ],
    relatedCodes: ['SPN-175', 'SPN-171', 'SPN-105'],
    searchKeywords: ['Cummins overheating', 'generator coolant', 'SPN 110', 'engine overheating'],
    faqQuestions: [
      {
        question: 'What should I do if my generator overheats?',
        answer: 'Stop the generator immediately to prevent engine damage. Allow it to cool, then check coolant level, inspect for leaks, verify fan operation, and clean the radiator of debris before restarting.'
      },
      {
        question: 'Can I add water instead of coolant in an emergency?',
        answer: 'In an emergency, clean water can be added temporarily. However, replace with proper coolant mixture as soon as possible to prevent corrosion and provide freeze/boil protection.'
      }
    ]
  },
  {
    code: 'SPN-1514',
    brand: 'Cummins',
    title: 'Engine Protection System - Derate Active',
    description: 'The Engine Protection System (EPS) has activated a power derate to protect the engine from damage. This fault indicates one or more engine parameters have exceeded safe limits, causing the ECM to reduce engine power output. Common triggers include high coolant temp, high intake temp, low oil pressure, or aftertreatment issues.',
    severity: 'warning',
    category: 'Engine Protection',
    possibleCauses: [
      'Active fault code triggering engine protection',
      'High coolant temperature approaching shutdown threshold',
      'High intake manifold temperature',
      'Low oil pressure detected',
      'Aftertreatment system fault (if equipped)',
      'Multiple minor faults combining to trigger derate'
    ],
    troubleshootingSteps: [
      'Connect diagnostic tool and read ALL active fault codes',
      'Address underlying fault codes first - they are the root cause',
      'Check all fluid levels - coolant, oil, fuel',
      'Verify cooling system operation - fan, thermostat, radiator',
      'Check for restricted air filter or exhaust',
      'Clear codes after repairs and test under load'
    ],
    relatedParts: [
      'Varies based on triggering fault',
      'Coolant Temperature Sensor',
      'Oil Pressure Sensor',
      'Intake Air Temperature Sensor',
      'ECM Module'
    ],
    relatedCodes: ['SPN-110', 'SPN-100', 'SPN-105', 'SPN-94'],
    searchKeywords: ['Cummins derate', 'SPN 1514', 'engine protection', 'power derate', 'generator derate'],
    faqQuestions: [
      {
        question: 'What does engine derate mean on my generator?',
        answer: 'Engine derate means the ECM has reduced power output to protect the engine from damage. This is triggered by another fault condition and is a protective measure, not the root cause.'
      },
      {
        question: 'How do I clear a Cummins derate condition?',
        answer: 'You must first identify and fix the underlying fault that triggered the derate. Use a diagnostic tool to read all fault codes, repair the root cause, then clear codes. The derate will automatically lift once conditions return to normal.'
      }
    ]
  },
  {
    code: 'SPN-157',
    brand: 'Cummins',
    title: 'Fuel Injector Rail Pressure Low',
    description: 'The high-pressure fuel rail in the common-rail injection system is not achieving required pressure. Modern diesel engines require very high fuel pressure (1,600-2,000+ bar) for proper atomization. Low rail pressure causes poor combustion, white smoke, hard starting, and significant power loss.',
    severity: 'critical',
    category: 'Fuel System',
    possibleCauses: [
      'Failed high-pressure fuel pump',
      'Worn or damaged fuel injector(s) leaking internally',
      'Fuel pressure regulator valve failure',
      'Air in high-pressure fuel system',
      'Restricted fuel supply to HP pump',
      'Fuel rail pressure sensor failure'
    ],
    troubleshootingSteps: [
      'Check fuel supply system first - filters, supply pump, tank',
      'Monitor actual rail pressure with diagnostic tool during cranking',
      'Perform injector leak-back test - max 80ml/min per injector',
      'Check high-pressure pump drive coupling',
      'Inspect fuel rail pressure sensor and wiring',
      'Test pressure relief valve if equipped'
    ],
    relatedParts: [
      'High Pressure Fuel Pump',
      'Fuel Injectors',
      'Fuel Rail',
      'Rail Pressure Sensor',
      'Fuel Pressure Regulator',
      'HP Fuel Lines'
    ],
    relatedCodes: ['SPN-94', 'SPN-158', 'SPN-1347'],
    searchKeywords: ['Cummins rail pressure', 'common rail fault', 'SPN 157', 'fuel rail pressure low'],
    faqQuestions: [
      {
        question: 'What causes low fuel rail pressure in common rail diesel?',
        answer: 'Low rail pressure is commonly caused by worn injectors leaking fuel back, a failing high-pressure pump, or fuel supply restrictions. An injector leak-back test can identify leaking injectors.'
      },
      {
        question: 'How do I test common rail injector leak-back?',
        answer: 'Connect clear tubes to each injector return line and measure fuel collected during cranking. More than 80ml per minute indicates a leaking injector that needs replacement.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DSE (DEEP SEA ELECTRONICS) FAULT CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'DSE-E020',
    brand: 'DSE',
    title: 'Engine Start Fail',
    description: 'The DSE controller has attempted to start the engine but the engine has not reached the preset running speed within the configured start time. This fault will stop the starter motor and prevent further start attempts until the fault is acknowledged and cleared.',
    severity: 'warning',
    category: 'Starting System',
    possibleCauses: [
      'Fuel supply issues - empty tank, air in lines, blocked filter',
      'Failed or weak starter motor',
      'Low battery voltage insufficient for cranking',
      'Fuel solenoid not energizing',
      'Speed sensor not detecting engine rotation',
      'Glow plug/preheat system failure (cold weather)'
    ],
    troubleshootingSteps: [
      'Check fuel level and ensure fuel reaches injectors',
      'Verify battery voltage - minimum 24V for cranking',
      'Check starter motor operation and engagement',
      'Verify fuel solenoid clicks when energized',
      'Check speed sensor signal during cranking (use DSE config software)',
      'Inspect glow plug operation in cold conditions'
    ],
    relatedParts: [
      'Starter Motor',
      'Batteries',
      'Fuel Solenoid',
      'Fuel Filter',
      'Speed Sensor',
      'Glow Plugs'
    ],
    relatedCodes: ['DSE-E021', 'DSE-E070', 'DSE-E090'],
    searchKeywords: ['DSE E020', 'generator start fail', 'DSE controller', 'engine won\'t start'],
    faqQuestions: [
      {
        question: 'Why does my DSE controller show E020 start fail?',
        answer: 'E020 means the engine did not reach running speed within the configured start time. Check fuel supply, battery voltage, and starter motor operation first. The speed sensor must also detect engine rotation.'
      },
      {
        question: 'How many start attempts does DSE allow before lockout?',
        answer: 'DSE controllers typically allow 3 start attempts before locking out with a start fail alarm. This is configurable in the DSE configuration software.'
      }
    ]
  },
  {
    code: 'DSE-E040',
    brand: 'DSE',
    title: 'Underspeed Warning',
    description: 'Engine speed has dropped below the minimum threshold configured in the DSE controller. This typically indicates the engine is being overloaded or is experiencing fuel delivery problems. If not corrected, it will progress to an underspeed shutdown.',
    severity: 'warning',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Generator overloaded beyond capacity',
      'Fuel filter restriction reducing power',
      'Governor malfunction not maintaining speed',
      'Air filter severely restricted',
      'Fuel quality issues (water, contamination)',
      'Turbocharger failure reducing power'
    ],
    troubleshootingSteps: [
      'Check electrical load - reduce if exceeding generator capacity',
      'Verify fuel filters are clean and not restricted',
      'Check air filter restriction indicator',
      'Test fuel system for contamination or water',
      'Verify governor is responding to speed changes',
      'Check turbo boost pressure if equipped'
    ],
    relatedParts: [
      'Fuel Filter',
      'Air Filter',
      'Governor Actuator',
      'Turbocharger',
      'Fuel Injection Pump',
      'Speed Sensor'
    ],
    relatedCodes: ['DSE-E041', 'DSE-E070', 'DSE-E020'],
    searchKeywords: ['DSE E040', 'generator underspeed', 'engine running slow', 'DSE underspeed alarm'],
    faqQuestions: [
      {
        question: 'Why is my generator showing underspeed warning?',
        answer: 'Underspeed indicates the engine cannot maintain proper RPM. This is usually caused by overloading, restricted fuel supply, or dirty air filter. Reduce load and check filters.'
      },
      {
        question: 'What is the normal speed setting for a 50Hz generator?',
        answer: 'A 50Hz generator runs at 1500 RPM (4-pole) or 3000 RPM (2-pole). The DSE underspeed threshold is typically set 5-10% below rated speed.'
      }
    ]
  },
  {
    code: 'DSE-E070',
    brand: 'DSE',
    title: 'Low Oil Pressure Shutdown',
    description: 'Engine oil pressure has dropped below the shutdown threshold and the DSE controller has stopped the engine to prevent damage. This is a critical protection fault. Do not attempt to restart until the oil pressure issue is diagnosed and resolved.',
    severity: 'critical',
    category: 'Lubrication System',
    possibleCauses: [
      'Engine oil level critically low',
      'Oil pressure sensor or sender failure',
      'Oil pump failure or wear',
      'Blocked oil filter or gallery',
      'Worn engine bearings',
      'Wrong oil viscosity for conditions'
    ],
    troubleshootingSteps: [
      'Check oil level immediately - add if low',
      'Inspect for oil leaks around engine',
      'Install mechanical pressure gauge to verify actual pressure',
      'If gauge shows good pressure, replace oil pressure sensor',
      'If actual pressure is low, inspect oil pump and bearings',
      'Check oil filter for bypass valve operation'
    ],
    relatedParts: [
      'Oil Pressure Sensor',
      'Oil Filter',
      'Oil Pump',
      'Engine Oil',
      'Main Bearings',
      'Oil Cooler'
    ],
    relatedCodes: ['DSE-E071', 'DSE-E072', 'DSE-E110'],
    searchKeywords: ['DSE E070', 'low oil pressure', 'generator oil alarm', 'DSE oil shutdown'],
    faqQuestions: [
      {
        question: 'My generator shut down on E070 low oil pressure - what do I do?',
        answer: 'Do not restart until diagnosed. Check oil level first and add if needed. If oil level is correct, the sensor may be faulty - verify with a mechanical gauge before condemning the engine.'
      },
      {
        question: 'What oil pressure should a generator maintain?',
        answer: 'Typical diesel generators should maintain 30-60 PSI (2-4 bar) at operating temperature. DSE shutdown threshold is usually set around 10-15 PSI (0.7-1.0 bar).'
      }
    ]
  },
  {
    code: 'DSE-E090',
    brand: 'DSE',
    title: 'Low Fuel Level Warning',
    description: 'The fuel tank level has dropped below the warning threshold configured in the DSE controller. This is a warning-class fault alerting operators that refueling is required soon. Continued operation without refueling will result in engine shutdown.',
    severity: 'warning',
    category: 'Fuel System',
    possibleCauses: [
      'Fuel consumption - simply needs refueling',
      'Fuel tank leak',
      'Fuel level sensor malfunction',
      'Fuel theft (check for signs of tampering)',
      'Higher than expected fuel consumption',
      'Incorrect sensor calibration'
    ],
    troubleshootingSteps: [
      'Visually verify fuel level in tank',
      'If tank shows fuel, check fuel level sensor',
      'Inspect tank for leaks or damage',
      'Verify fuel consumption matches expected rate',
      'Check fuel lines for leaks',
      'Calibrate fuel level sensor if needed'
    ],
    relatedParts: [
      'Fuel Level Sender',
      'Fuel Tank',
      'Fuel Lines',
      'Fuel Filter',
      'Tank Fittings'
    ],
    relatedCodes: ['DSE-E091', 'DSE-E094', 'DSE-E020'],
    searchKeywords: ['DSE E090', 'low fuel warning', 'generator fuel level', 'DSE fuel alarm'],
    faqQuestions: [
      {
        question: 'How accurate is the DSE fuel level reading?',
        answer: 'Accuracy depends on proper sensor calibration. DSE controllers support 2-point or multi-point calibration. Standard senders have accuracy of +/-5% of tank capacity.'
      },
      {
        question: 'Can I adjust the fuel warning level on DSE?',
        answer: 'Yes, the low fuel warning and shutdown levels are configurable through DSE Configuration Suite software. Typical settings are 20% warning and 10% shutdown.'
      }
    ]
  },
  {
    code: 'DSE-E100',
    brand: 'DSE',
    title: 'High Coolant Temperature Shutdown',
    description: 'Engine coolant temperature has exceeded the maximum safe limit and the DSE controller has shut down the engine to prevent thermal damage. This fault will lock out the controller until acknowledged. Do not restart until the cooling system is diagnosed.',
    severity: 'critical',
    category: 'Cooling System',
    possibleCauses: [
      'Low coolant level from leak or evaporation',
      'Radiator blocked with debris',
      'Thermostat stuck closed',
      'Water pump failure',
      'Cooling fan not operating',
      'Temperature sensor failure showing false high'
    ],
    troubleshootingSteps: [
      'Allow engine to cool before inspection',
      'Check coolant level in radiator and expansion tank',
      'Inspect for visible coolant leaks',
      'Clean radiator fins of any debris',
      'Verify cooling fan operates when engine is hot',
      'Test thermostat opens at correct temperature'
    ],
    relatedParts: [
      'Thermostat',
      'Water Pump',
      'Radiator',
      'Cooling Fan',
      'Temperature Sensor',
      'Coolant Hoses',
      'Radiator Cap'
    ],
    relatedCodes: ['DSE-E101', 'DSE-E070', 'DSE-E040'],
    searchKeywords: ['DSE E100', 'generator overheating', 'coolant temperature high', 'DSE thermal shutdown'],
    faqQuestions: [
      {
        question: 'What temperature causes DSE to shut down for overheating?',
        answer: 'The default DSE high temperature shutdown is typically 102-108 deg C (215-226 deg F), but this is configurable. Warning activates about 10 degrees before shutdown.'
      },
      {
        question: 'Can overheating damage my generator engine?',
        answer: 'Yes, severe overheating can cause head gasket failure, warped cylinder head, piston seizure, and other catastrophic damage. Always investigate and repair cooling issues before restarting.'
      }
    ]
  },
  {
    code: 'DSE-E110',
    brand: 'DSE',
    title: 'Emergency Stop Active',
    description: 'An emergency stop button has been pressed or the emergency stop input is active. The DSE controller has immediately shut down the engine and will not allow restart until the emergency stop is reset and the fault cleared.',
    severity: 'critical',
    category: 'Safety/Control',
    possibleCauses: [
      'Emergency stop button pressed by operator',
      'Remote emergency stop activated',
      'Emergency stop wiring fault (open circuit if N/C)',
      'Fire suppression system triggered',
      'BMS or building automation emergency signal',
      'Loose or corroded emergency stop connections'
    ],
    troubleshootingSteps: [
      'Locate and reset all emergency stop buttons',
      'Check for remote/external emergency stop inputs',
      'Verify emergency stop wiring is secure',
      'Check for fire suppression system activation',
      'Verify building management system status',
      'Test emergency stop circuit continuity'
    ],
    relatedParts: [
      'Emergency Stop Button',
      'Emergency Stop Wiring',
      'Remote E-Stop Panel',
      'E-Stop Relay',
      'Connector Terminals'
    ],
    relatedCodes: ['DSE-E111', 'DSE-E020', 'DSE-E070'],
    searchKeywords: ['DSE E110', 'emergency stop', 'generator e-stop', 'DSE shutdown'],
    faqQuestions: [
      {
        question: 'Why won\'t my generator start after pressing emergency stop?',
        answer: 'The emergency stop must be reset (usually by pulling or twisting the button) and the fault cleared on the DSE controller. Check for multiple e-stop locations.'
      },
      {
        question: 'Is DSE emergency stop normally open or normally closed?',
        answer: 'DSE emergency stop input is configurable but typically wired as normally closed (N/C) for fail-safe operation. An open circuit triggers emergency stop.'
      }
    ]
  },
  {
    code: 'DSE-E120',
    brand: 'DSE',
    title: 'Generator Over Voltage',
    description: 'The generator output voltage has exceeded the maximum safe limit. Over voltage can damage connected equipment and indicates a problem with the Automatic Voltage Regulator (AVR), generator excitation, or voltage sensing circuits.',
    severity: 'critical',
    category: 'Electrical Output',
    possibleCauses: [
      'AVR failure or malfunction',
      'AVR voltage adjustment set too high',
      'Voltage sensing circuit fault',
      'Exciter field winding issue',
      'Speed fluctuation causing voltage variation',
      'Load suddenly disconnected (load dump)'
    ],
    troubleshootingSteps: [
      'Check voltage with calibrated meter at generator terminals',
      'Verify AVR voltage potentiometer adjustment',
      'Check voltage sensing connections to AVR',
      'Inspect AVR for visible damage or burnt components',
      'Verify engine speed is stable at 1500/3000 RPM',
      'Test with resistive load bank'
    ],
    relatedParts: [
      'Automatic Voltage Regulator (AVR)',
      'Voltage Sensing Wires',
      'Exciter Stator',
      'Main Rotor',
      'Speed Governor'
    ],
    relatedCodes: ['DSE-E121', 'DSE-E122', 'DSE-E040'],
    searchKeywords: ['DSE E120', 'generator over voltage', 'high voltage output', 'AVR fault'],
    faqQuestions: [
      {
        question: 'What causes generator over voltage?',
        answer: 'Over voltage is usually caused by AVR malfunction, incorrect AVR adjustment, or sudden load rejection. The AVR should regulate output to 220V/380V +/-5%.'
      },
      {
        question: 'What voltage should a 380V generator produce?',
        answer: 'A standard 3-phase generator should produce 380V line-to-line (220V line-to-neutral) at 50Hz. Acceptable tolerance is typically +/-5% (361V to 399V).'
      }
    ]
  },
  {
    code: 'DSE-E125',
    brand: 'DSE',
    title: 'Generator Under Voltage',
    description: 'The generator output voltage has dropped below the minimum acceptable level. Under voltage can cause connected equipment to malfunction and indicates problems with AVR, excitation, speed control, or overloading.',
    severity: 'warning',
    category: 'Electrical Output',
    possibleCauses: [
      'Generator overloaded beyond capacity',
      'AVR failure or degradation',
      'Loose or corroded AVR voltage sensing wires',
      'Engine underspeed affecting voltage',
      'Exciter or main rotor winding fault',
      'Capacitor bank failure (if equipped)'
    ],
    troubleshootingSteps: [
      'Check actual load vs generator rated capacity',
      'Verify engine speed is at correct RPM',
      'Check AVR voltage sensing connections',
      'Adjust AVR voltage potentiometer',
      'Check exciter and main stator windings',
      'Test alternator with load bank'
    ],
    relatedParts: [
      'Automatic Voltage Regulator (AVR)',
      'Voltage Sensing Wires',
      'Exciter Rotor/Stator',
      'Main Stator Windings',
      'Brushes and Slip Rings'
    ],
    relatedCodes: ['DSE-E120', 'DSE-E040', 'DSE-E041'],
    searchKeywords: ['DSE E125', 'generator under voltage', 'low voltage output', 'weak generator output'],
    faqQuestions: [
      {
        question: 'Why is my generator voltage dropping under load?',
        answer: 'Voltage drop under load indicates the generator may be overloaded, the AVR is not responding properly, or there is excessive voltage drop in connections. Check load vs capacity first.'
      },
      {
        question: 'How do I adjust the voltage on my generator?',
        answer: 'Most AVRs have a voltage adjustment potentiometer. Adjust slowly while monitoring output with a meter. Only adjust with stable load and at correct speed.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMAP FAULT CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'COMAP-A001',
    brand: 'ComAp',
    title: 'Low Oil Pressure Warning',
    description: 'The ComAp controller has detected engine oil pressure below the warning threshold. This is an early warning before shutdown level is reached. Immediate attention is required to prevent engine damage.',
    severity: 'warning',
    category: 'Lubrication System',
    possibleCauses: [
      'Engine oil level getting low',
      'Oil viscosity breakdown from overheating',
      'Oil filter becoming restricted',
      'Oil pressure sensor calibration drift',
      'Bearing wear beginning',
      'Oil pump wear'
    ],
    troubleshootingSteps: [
      'Check engine oil level on dipstick',
      'Inspect oil condition - check for contamination',
      'Verify oil filter service interval',
      'Compare oil pressure to mechanical gauge',
      'Check oil temperature - hot oil reads lower pressure',
      'Listen for unusual bearing noise'
    ],
    relatedParts: [
      'Engine Oil',
      'Oil Filter',
      'Oil Pressure Sensor',
      'Oil Pressure Sender',
      'Oil Pump'
    ],
    relatedCodes: ['COMAP-A002', 'COMAP-A015', 'COMAP-A020'],
    searchKeywords: ['ComAp A001', 'oil pressure warning', 'InteliGen oil fault', 'ComAp low oil'],
    faqQuestions: [
      {
        question: 'What is the difference between ComAp A001 and A002 oil faults?',
        answer: 'A001 is a warning level - early notification that oil pressure is getting low. A002 is a shutdown level - engine will stop to prevent damage. A001 gives time to address the issue.'
      },
      {
        question: 'How do I adjust ComAp oil pressure thresholds?',
        answer: 'Use ComAp InteliConfig or InteliMonitor software to access protection settings. Oil pressure warning and shutdown levels are in the Binary Outputs configuration.'
      }
    ]
  },
  {
    code: 'COMAP-A015',
    brand: 'ComAp',
    title: 'Engine Overspeed Shutdown',
    description: 'The engine has exceeded maximum speed and the ComAp controller has initiated an emergency shutdown. Overspeed protection prevents catastrophic engine damage from mechanical failure due to excessive rotational forces.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Governor actuator failure',
      'Governor linkage disconnected',
      'Fuel rack stuck in full fuel position',
      'Sudden load rejection',
      'Electronic governor control failure',
      'Speed sensor signal interference'
    ],
    troubleshootingSteps: [
      'Review event log for conditions leading to overspeed',
      'Check if caused by load rejection event',
      'Inspect governor actuator operation',
      'Verify fuel control linkage moves freely',
      'Test governor response with InteliConfig',
      'Check for speed sensor wiring issues'
    ],
    relatedParts: [
      'Governor Actuator',
      'Governor Linkage',
      'Electronic Governor Control',
      'Speed Sensor',
      'Fuel Injection Pump'
    ],
    relatedCodes: ['COMAP-A001', 'COMAP-A016', 'COMAP-A030'],
    searchKeywords: ['ComAp A015', 'overspeed shutdown', 'generator overspeed', 'InteliGen overspeed'],
    faqQuestions: [
      {
        question: 'What RPM triggers ComAp overspeed shutdown?',
        answer: 'Default overspeed is typically 115% of rated speed - 1725 RPM for a 50Hz 1500 RPM engine. This is configurable but should not be set higher than engine manufacturer limits.'
      },
      {
        question: 'My generator overspeed when load is removed - why?',
        answer: 'This is load rejection overspeed. When large loads disconnect suddenly, the engine accelerates. A properly tuned governor should control this within limits.'
      }
    ]
  },
  {
    code: 'COMAP-A020',
    brand: 'ComAp',
    title: 'High Coolant Temperature Shutdown',
    description: 'Engine coolant temperature has reached the shutdown threshold. The ComAp controller has stopped the engine to prevent heat damage. Do not restart until the cooling system has been inspected and the cause determined.',
    severity: 'critical',
    category: 'Cooling System',
    possibleCauses: [
      'Insufficient coolant level',
      'Cooling fan or fan belt failure',
      'Thermostat stuck closed',
      'Radiator blocked or restricted',
      'Water pump failure',
      'High ambient temperature combined with heavy load'
    ],
    troubleshootingSteps: [
      'Allow engine to cool before inspection',
      'Check coolant level when cool - add if needed',
      'Inspect cooling fan for operation and damage',
      'Check fan belt tension and condition',
      'Clean radiator fins',
      'Verify thermostat opens at correct temperature'
    ],
    relatedParts: [
      'Thermostat',
      'Cooling Fan',
      'Fan Belt',
      'Water Pump',
      'Radiator',
      'Temperature Sensor'
    ],
    relatedCodes: ['COMAP-A021', 'COMAP-A001', 'COMAP-A030'],
    searchKeywords: ['ComAp A020', 'high temperature', 'overheating shutdown', 'InteliGen coolant'],
    faqQuestions: [
      {
        question: 'What is the default ComAp high temperature shutdown setting?',
        answer: 'Default high temperature shutdown is typically 100-105 deg C. Warning level is usually set 5-10 degrees below shutdown. Both are configurable in InteliConfig.'
      },
      {
        question: 'How do I reset ComAp after temperature shutdown?',
        answer: 'Fix the cooling issue first, then clear the alarm using the controller buttons or InteliMonitor software. The engine must be allowed to cool before resetting.'
      }
    ]
  },
  {
    code: 'COMAP-A030',
    brand: 'ComAp',
    title: 'Fail to Start',
    description: 'The ComAp controller has attempted to start the engine the configured number of times but the engine has not reached running speed. Further start attempts are locked out until the fault is cleared.',
    severity: 'warning',
    category: 'Starting System',
    possibleCauses: [
      'No fuel in tank or air in fuel system',
      'Dead or weak batteries',
      'Starter motor failure',
      'Fuel solenoid not operating',
      'Speed sensor not reading cranking speed',
      'ECM not receiving start command'
    ],
    troubleshootingSteps: [
      'Check fuel level and bleed fuel system',
      'Test battery voltage during cranking',
      'Verify starter engages and cranks engine',
      'Check fuel solenoid operation',
      'Use InteliMonitor to verify speed signal during crank',
      'Check ECM communication and fault codes'
    ],
    relatedParts: [
      'Batteries',
      'Starter Motor',
      'Fuel Solenoid',
      'Fuel Filters',
      'Speed Sensor',
      'Battery Cables'
    ],
    relatedCodes: ['COMAP-A001', 'COMAP-A031', 'COMAP-A015'],
    searchKeywords: ['ComAp A030', 'fail to start', 'generator won\'t start', 'InteliGen start fail'],
    faqQuestions: [
      {
        question: 'How many start attempts does ComAp allow?',
        answer: 'The default is typically 3 start attempts with a configurable pause between attempts. This can be changed in InteliConfig but should not exceed engine manufacturer recommendations.'
      },
      {
        question: 'My ComAp shows start fail but engine cranks fine - why?',
        answer: 'If the engine cranks but doesn\'t start, check fuel delivery and speed sensor. The speed sensor must detect engine rotation for the controller to recognize a running engine.'
      }
    ]
  },
  {
    code: 'COMAP-A040',
    brand: 'ComAp',
    title: 'Generator Over Frequency',
    description: 'The generator electrical frequency has exceeded the maximum threshold. Over frequency indicates engine speed is too high, which can damage sensitive electrical equipment and indicates a governor problem.',
    severity: 'warning',
    category: 'Electrical Output',
    possibleCauses: [
      'Governor set to wrong speed',
      'Electronic governor calibration error',
      'Load dump causing overshoot',
      'Governor actuator sticking',
      'Speed droop setting incorrect',
      'Frequency sensor calibration error'
    ],
    troubleshootingSteps: [
      'Check actual frequency with external meter',
      'Verify engine RPM matches frequency (1500=50Hz, 1800=60Hz)',
      'Check governor speed setting',
      'Test governor response to load changes',
      'Verify speed droop and isochronous settings',
      'Calibrate frequency input if needed'
    ],
    relatedParts: [
      'Electronic Governor',
      'Governor Actuator',
      'Speed Sensor',
      'Governor Control Unit',
      'Fuel Control Linkage'
    ],
    relatedCodes: ['COMAP-A015', 'COMAP-A041', 'COMAP-A045'],
    searchKeywords: ['ComAp A040', 'over frequency', 'high frequency', 'generator Hz high'],
    faqQuestions: [
      {
        question: 'What frequency should my generator produce?',
        answer: 'In Kenya and most of Africa, generators should produce 50Hz (+/-0.5Hz under stable load). At 50Hz, a 4-pole generator runs at 1500 RPM, and a 2-pole at 3000 RPM.'
      },
      {
        question: 'Is 52Hz damaging to equipment?',
        answer: 'Brief frequency variations are tolerable, but sustained operation above 52Hz can damage motors (they run fast and hot), transformers, and sensitive electronics. Fix promptly.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PERKINS FAULT CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'PERKINS-111',
    brand: 'Perkins',
    title: 'ECM Internal Failure',
    description: 'The Perkins Electronic Control Module has detected an internal hardware or software fault. This code requires diagnostic tool connection to identify the specific internal failure mode and determine if ECM replacement is necessary.',
    severity: 'critical',
    category: 'ECM/Controller',
    possibleCauses: [
      'Internal processor or memory failure',
      'Power supply voltage irregularities',
      'Software corruption',
      'Internal relay or driver failure',
      'Overheating damage to ECM',
      'Water or contamination ingress'
    ],
    troubleshootingSteps: [
      'Connect Perkins EST diagnostic tool',
      'Check for additional fault codes that may explain trigger',
      'Verify ECM power supply 24V +/-2V',
      'Inspect ECM connector for moisture or corrosion',
      'Clear code and test - if returns, ECM likely faulty',
      'Contact Perkins authorized dealer for ECM programming'
    ],
    relatedParts: [
      'ECM Module',
      'ECM Wiring Harness',
      'ECM Connector',
      'Power Supply Cables',
      'Connector Sealing Kit'
    ],
    relatedCodes: ['PERKINS-115', 'PERKINS-639', 'PERKINS-1514'],
    searchKeywords: ['Perkins 111', 'Perkins ECM fault', 'generator ECM failure', 'Perkins controller'],
    faqQuestions: [
      {
        question: 'Can I reprogram a Perkins ECM myself?',
        answer: 'Perkins ECMs require factory programming with specific calibration files. This must be done by an authorized Perkins dealer using EST (Electronic Service Tool) software.'
      },
      {
        question: 'What causes Perkins ECM failure?',
        answer: 'Common causes include voltage spikes from battery disconnect under load, water ingress through connector seals, extreme heat, and simple component age. Proper maintenance reduces risk.'
      }
    ]
  },
  {
    code: 'PERKINS-115',
    brand: 'Perkins',
    title: 'Engine Speed Sensor Signal Lost',
    description: 'The ECM is not receiving a valid signal from the engine speed/position sensor. Without this signal, fuel injection timing cannot be calculated and the engine will not start or will stall. This is a critical fault requiring immediate attention.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Speed sensor failure',
      'Wiring damage or disconnection',
      'Sensor gap out of specification',
      'Damaged flywheel ring gear teeth',
      'Corroded sensor connector',
      'ECM speed input circuit failure'
    ],
    troubleshootingSteps: [
      'Check sensor connector for moisture or corrosion',
      'Measure sensor resistance - typically 200-1000 ohms',
      'Verify sensor gap to flywheel - typically 0.5-1.5mm',
      'Inspect flywheel teeth for damage',
      'Check wiring continuity from sensor to ECM',
      'Use EST to verify signal during cranking'
    ],
    relatedParts: [
      'Speed/Timing Sensor',
      'Sensor Wiring Harness',
      'Sensor Connector',
      'Flywheel Ring Gear',
      'Sensor Mounting Bracket'
    ],
    relatedCodes: ['PERKINS-111', 'PERKINS-190', 'PERKINS-723'],
    searchKeywords: ['Perkins 115', 'speed sensor fault', 'Perkins crank sensor', 'engine won\'t start sensor'],
    faqQuestions: [
      {
        question: 'How do I check the Perkins speed sensor gap?',
        answer: 'Use a feeler gauge to measure the gap between sensor tip and flywheel teeth. Specification is typically 0.5-1.5mm. Too large a gap causes weak signal; too small risks sensor damage.'
      },
      {
        question: 'What type of sensor does Perkins use for engine speed?',
        answer: 'Perkins uses a magnetic pickup sensor (Variable Reluctance) on most engines. Some newer models use Hall Effect sensors. Check your engine manual for specifications.'
      }
    ]
  },
  {
    code: 'PERKINS-110',
    brand: 'Perkins',
    title: 'High Coolant Temperature',
    description: 'Engine coolant temperature has exceeded the safe operating limit. This protection fault triggers warning or shutdown depending on temperature level. Overheating can cause severe engine damage including head gasket failure and piston seizure.',
    severity: 'critical',
    category: 'Cooling System',
    possibleCauses: [
      'Low coolant level',
      'Thermostat failure',
      'Water pump failure',
      'Blocked radiator',
      'Cooling fan not operating',
      'Collapsed coolant hoses'
    ],
    troubleshootingSteps: [
      'Stop engine and allow to cool',
      'Check coolant level in radiator (when cool)',
      'Inspect for coolant leaks',
      'Verify cooling fan operates',
      'Check thermostat operation',
      'Clean radiator fins'
    ],
    relatedParts: [
      'Thermostat',
      'Water Pump',
      'Radiator',
      'Cooling Fan',
      'Temperature Sensor',
      'Coolant Hoses'
    ],
    relatedCodes: ['PERKINS-111', 'PERKINS-105', 'PERKINS-100'],
    searchKeywords: ['Perkins 110', 'Perkins overheating', 'generator high temperature', 'Perkins coolant'],
    faqQuestions: [
      {
        question: 'What coolant should I use in a Perkins engine?',
        answer: 'Perkins recommends Extended Life Coolant (ELC) meeting ASTM D6210 specification. Use 50/50 pre-mix or mix concentrate with clean water. Check for correct freezing/boiling protection.'
      },
      {
        question: 'At what temperature does a Perkins shut down?',
        answer: 'Typical shutdown temperature is 102-108 deg C depending on engine model and calibration. Warning activates approximately 8-10 degrees before shutdown threshold.'
      }
    ]
  },
  {
    code: 'PERKINS-100',
    brand: 'Perkins',
    title: 'Low Engine Oil Pressure',
    description: 'Engine oil pressure has dropped below minimum safe level. This critical fault triggers shutdown to prevent bearing damage and engine seizure. Do not restart until oil pressure issue is diagnosed and resolved.',
    severity: 'critical',
    category: 'Lubrication System',
    possibleCauses: [
      'Low oil level',
      'Oil pressure sensor failure',
      'Oil pump wear',
      'Clogged oil filter',
      'Worn bearings',
      'Wrong oil viscosity'
    ],
    troubleshootingSteps: [
      'Check oil level on dipstick',
      'Inspect for oil leaks',
      'Install mechanical pressure gauge',
      'If gauge shows good pressure, replace sensor',
      'If actual pressure low, inspect pump and bearings',
      'Check oil filter bypass valve'
    ],
    relatedParts: [
      'Oil Pressure Sensor',
      'Oil Pump',
      'Oil Filter',
      'Engine Oil',
      'Main Bearings',
      'Oil Cooler'
    ],
    relatedCodes: ['PERKINS-111', 'PERKINS-110', 'PERKINS-94'],
    searchKeywords: ['Perkins 100', 'low oil pressure', 'Perkins oil fault', 'generator oil pressure'],
    faqQuestions: [
      {
        question: 'What oil should I use in a Perkins generator engine?',
        answer: 'Perkins recommends 15W-40 multigrade diesel engine oil meeting API CJ-4 or CK-4 specification. In very cold climates, 10W-30 may be specified. Always check your manual.'
      },
      {
        question: 'What is normal oil pressure for Perkins?',
        answer: 'Normal operating oil pressure is typically 40-60 PSI (2.8-4.1 bar) at operating temperature. Idle pressure may be lower (15-25 PSI). Shutdown occurs below 10-15 PSI.'
      }
    ]
  },
  {
    code: 'PERKINS-94',
    brand: 'Perkins',
    title: 'Low Fuel Pressure',
    description: 'Fuel supply pressure to the injection system is below required specification. Low fuel pressure causes hard starting, power loss, rough running, and can lead to injector damage from inadequate lubrication.',
    severity: 'warning',
    category: 'Fuel System',
    possibleCauses: [
      'Dirty fuel filter',
      'Air leak in suction line',
      'Failing lift pump',
      'Restricted fuel line',
      'Low fuel level in tank',
      'Fuel tank vent blocked'
    ],
    troubleshootingSteps: [
      'Replace fuel filters',
      'Check for air leaks on suction side',
      'Verify fuel tank has adequate fuel',
      'Test lift pump output pressure',
      'Check tank vent for blockage',
      'Bleed fuel system of air'
    ],
    relatedParts: [
      'Primary Fuel Filter',
      'Secondary Fuel Filter',
      'Lift Pump',
      'Fuel Lines',
      'Fuel/Water Separator'
    ],
    relatedCodes: ['PERKINS-100', 'PERKINS-111', 'PERKINS-157'],
    searchKeywords: ['Perkins 94', 'low fuel pressure', 'Perkins fuel system', 'generator fuel fault'],
    faqQuestions: [
      {
        question: 'How often should Perkins fuel filters be changed?',
        answer: 'Perkins recommends fuel filter replacement every 250-500 hours or annually, whichever comes first. In areas with poor fuel quality, more frequent changes may be needed.'
      },
      {
        question: 'How do I bleed air from a Perkins fuel system?',
        answer: 'Open the bleed screw on the fuel filter housing, operate the manual lift pump or electric pump until bubble-free fuel flows, then close the bleed screw. Crank engine and repeat if needed.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL DSE CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'DSE-E130',
    brand: 'DSE',
    title: 'Reverse Power/Motoring',
    description: 'The generator is absorbing power from the grid instead of supplying it. This dangerous condition occurs when engine power drops below the power required to overcome system losses, causing the generator to act as a motor.',
    severity: 'critical',
    category: 'Electrical Output',
    possibleCauses: [
      'Engine running too slow under load',
      'Fuel supply issue reducing power',
      'Incorrect reverse power threshold setting',
      'Failed synchronization',
      'Governor not responding to load',
      'Single phasing of 3-phase supply'
    ],
    troubleshootingSteps: [
      'Check engine speed is at rated RPM',
      'Verify fuel system supplying adequate fuel',
      'Check governor response to load changes',
      'Review synchronization settings',
      'Verify all three phases present',
      'Check reverse power relay settings'
    ],
    relatedParts: [
      'Governor Actuator',
      'Fuel System',
      'Synchronizer Module',
      'Current Transformers',
      'Reverse Power Relay'
    ],
    relatedCodes: ['DSE-E040', 'DSE-E120', 'DSE-E125'],
    searchKeywords: ['DSE E130', 'reverse power', 'generator motoring', 'DSE RP fault'],
    faqQuestions: [
      {
        question: 'What is generator reverse power?',
        answer: 'Reverse power (motoring) occurs when the generator absorbs power from the grid instead of producing it. This can damage the prime mover and must trigger immediate disconnection.'
      },
      {
        question: 'What is normal reverse power setting?',
        answer: 'Typical reverse power trip is set at 5-15% of rated power with a time delay of 2-5 seconds. Settings depend on application and generator characteristics.'
      }
    ]
  },
  {
    code: 'DSE-E140',
    brand: 'DSE',
    title: 'Earth Fault Detected',
    description: 'An earth (ground) fault has been detected in the generator output circuit. Earth faults indicate dangerous leakage of current to ground, which can cause electrocution hazards, equipment damage, and fire risk.',
    severity: 'critical',
    category: 'Electrical Safety',
    possibleCauses: [
      'Damaged cable insulation',
      'Water ingress in junction boxes',
      'Failed component with insulation breakdown',
      'Incorrect wiring or connections',
      'Earth leakage in connected load',
      'CT wiring fault giving false reading'
    ],
    troubleshootingSteps: [
      'Disconnect loads and check if fault clears',
      'Use insulation tester to check cable megger values',
      'Inspect all junction boxes for moisture',
      'Check generator winding insulation resistance',
      'Verify CT and earth fault relay wiring',
      'Systematically reconnect loads to isolate faulty circuit'
    ],
    relatedParts: [
      'Earth Fault Relay',
      'Current Transformers',
      'Cable Insulation',
      'Generator Windings',
      'Junction Boxes'
    ],
    relatedCodes: ['DSE-E120', 'DSE-E125', 'DSE-E145'],
    searchKeywords: ['DSE E140', 'earth fault', 'ground fault', 'generator earth leakage'],
    faqQuestions: [
      {
        question: 'What insulation resistance is acceptable for a generator?',
        answer: 'Minimum acceptable insulation resistance is typically 1 megohm per kV of rated voltage, measured with a 500V or 1000V insulation tester. New equipment should be 100+ megohms.'
      },
      {
        question: 'Is it safe to run with an earth fault?',
        answer: 'No. Earth faults create electrocution hazard and fire risk. The generator should be shut down and the fault located and repaired before resuming operation.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL CUMMINS CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'SPN-639',
    brand: 'Cummins',
    title: 'J1939 Network Communication Error',
    description: 'The ECM has lost communication with other modules on the J1939 data network. This fault affects data exchange between ECM, transmission, instrument cluster, and other networked components.',
    severity: 'warning',
    category: 'Communication/Network',
    possibleCauses: [
      'Damaged CAN bus wiring',
      'Missing termination resistor',
      'Faulty ECM or other module',
      'Connector corrosion or damage',
      'Short circuit on CAN bus',
      'EMI interference'
    ],
    troubleshootingSteps: [
      'Check CAN bus wiring for damage',
      'Verify termination resistors present (120 ohms each end)',
      'Inspect all CAN bus connectors',
      'Use oscilloscope to check CAN signal quality',
      'Disconnect modules one at a time to isolate faulty unit',
      'Check for EMI sources near CAN wiring'
    ],
    relatedParts: [
      'CAN Bus Wiring',
      'Termination Resistors',
      'ECM Module',
      'CAN Connectors',
      'Shield Grounding'
    ],
    relatedCodes: ['SPN-111', 'SPN-629', 'SPN-2017'],
    searchKeywords: ['Cummins 639', 'J1939 fault', 'CAN bus error', 'communication fault'],
    faqQuestions: [
      {
        question: 'What is J1939 on a generator?',
        answer: 'J1939 is a CAN bus communication protocol used in heavy equipment. It allows the ECM, display, transmission, and other modules to share data over a two-wire network.'
      },
      {
        question: 'How do I test CAN bus termination?',
        answer: 'Measure resistance across CAN-H and CAN-L with all modules connected. Should read approximately 60 ohms (two 120 ohm resistors in parallel). 120 ohms indicates one missing terminator.'
      }
    ]
  },
  {
    code: 'SPN-3556',
    brand: 'Cummins',
    title: 'Aftertreatment DEF Tank Level Low',
    description: 'Diesel Exhaust Fluid (DEF/AdBlue) tank level is below minimum. For Tier 4 Final emissions compliance, adequate DEF is required. Engine derate or shutdown will occur if DEF is not replenished.',
    severity: 'warning',
    category: 'Emissions/Aftertreatment',
    possibleCauses: [
      'DEF consumed - needs refilling',
      'DEF level sensor failure',
      'DEF tank leak',
      'Frozen DEF (in cold weather)',
      'Contaminated or diluted DEF',
      'DEF heater failure in cold weather'
    ],
    troubleshootingSteps: [
      'Check DEF tank level visually',
      'Refill with quality ISO 22241 DEF',
      'Check for DEF leaks at fittings',
      'In cold weather, check if DEF is frozen',
      'Test DEF quality with refractometer',
      'Verify DEF heater operation in cold climate'
    ],
    relatedParts: [
      'DEF Tank',
      'DEF Pump',
      'DEF Level Sensor',
      'DEF Quality Sensor',
      'DEF Lines',
      'DEF Tank Heater'
    ],
    relatedCodes: ['SPN-3361', 'SPN-3362', 'SPN-4364'],
    searchKeywords: ['Cummins 3556', 'DEF level', 'AdBlue warning', 'aftertreatment fluid'],
    faqQuestions: [
      {
        question: 'What is DEF fluid for generators?',
        answer: 'DEF (Diesel Exhaust Fluid) is a urea solution sprayed into the exhaust to reduce NOx emissions. Required on Tier 4 Final engines. Also called AdBlue in some regions.'
      },
      {
        question: 'What happens if DEF runs out on a Cummins?',
        answer: 'The engine will progressively derate power, eventually limiting to a maximum of 25% power or 5 MPH. Eventually it may prevent restart. Always maintain DEF level.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL COMAP CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'COMAP-A050',
    brand: 'ComAp',
    title: 'Battery Voltage Low',
    description: 'The DC control battery voltage has dropped below the minimum operating threshold. Low battery voltage can prevent reliable engine starting and may cause controller malfunction.',
    severity: 'warning',
    category: 'Electrical/Starting',
    possibleCauses: [
      'Battery aging/failure',
      'Battery charger malfunction',
      'Excessive parasitic loads',
      'Corroded battery connections',
      'Alternator/charging system failure',
      'Battery not sized for application'
    ],
    troubleshootingSteps: [
      'Measure battery voltage with digital multimeter',
      'Check battery charger output',
      'Inspect battery terminals for corrosion',
      'Load test batteries',
      'Verify charging alternator output',
      'Check for excessive DC loads'
    ],
    relatedParts: [
      'Starting Batteries',
      'Battery Charger',
      'Charging Alternator',
      'Battery Cables',
      'Battery Terminal Connectors'
    ],
    relatedCodes: ['COMAP-A030', 'COMAP-A051', 'COMAP-A055'],
    searchKeywords: ['ComAp A050', 'low battery', 'generator battery', 'charging fault'],
    faqQuestions: [
      {
        question: 'What voltage should generator starting batteries maintain?',
        answer: 'For 24V systems, batteries should maintain 25-28V float charge. For 12V systems, 13-14V. During cranking, voltage should not drop below 18V (24V system) or 9V (12V system).'
      },
      {
        question: 'How often should generator batteries be replaced?',
        answer: 'Lead-acid starting batteries typically last 3-5 years. Perform annual load testing and replace when capacity drops below 80% of rated. AGM batteries may last longer.'
      }
    ]
  },
  {
    code: 'COMAP-A060',
    brand: 'ComAp',
    title: 'Loss of Speed Signal',
    description: 'The ComAp controller has lost the engine speed signal during operation. This can cause engine shutdown as the controller cannot determine if the engine is running or at correct speed.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Speed sensor failure',
      'Damaged sensor wiring',
      'Sensor connector fault',
      'Excessive sensor gap',
      'Damaged tone ring',
      'EMI interference on signal wire'
    ],
    troubleshootingSteps: [
      'Check speed sensor connector',
      'Measure sensor resistance',
      'Verify sensor gap to tone ring',
      'Check wiring for damage or shorts',
      'Use InteliMonitor to view speed signal',
      'Check for EMI sources near sensor wiring'
    ],
    relatedParts: [
      'Speed Sensor',
      'Sensor Connector',
      'Sensor Wiring',
      'Flywheel/Tone Ring',
      'ECM Input Circuit'
    ],
    relatedCodes: ['COMAP-A015', 'COMAP-A030', 'COMAP-A040'],
    searchKeywords: ['ComAp A060', 'speed signal lost', 'MPU fault', 'speed sensor failure'],
    faqQuestions: [
      {
        question: 'What type of speed sensor does ComAp use?',
        answer: 'ComAp controllers accept both magnetic pickup (MPU) and digital sensors. The input type is configured in InteliConfig. MPU sensors generate AC voltage proportional to speed.'
      },
      {
        question: 'How do I test a magnetic pickup speed sensor?',
        answer: 'Measure resistance (typically 100-1000 ohms). Spin a metal object past the sensor and measure AC voltage output. Check gap to tone ring is per specification (usually 0.5-2mm).'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL PERKINS CODES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    code: 'PERKINS-190',
    brand: 'Perkins',
    title: 'Engine Overspeed',
    description: 'The engine has exceeded the maximum safe operating speed limit. The ECM has initiated protective shutdown to prevent catastrophic mechanical failure from excessive rotational forces.',
    severity: 'critical',
    category: 'Engine Speed/Timing',
    possibleCauses: [
      'Governor failure',
      'Fuel rack stuck open',
      'Load rejection',
      'Speed sensor intermittent',
      'ECM governor control failure',
      'Mechanical governor spring broken'
    ],
    troubleshootingSteps: [
      'Check event log for conditions during overspeed',
      'Inspect governor actuator operation',
      'Verify fuel control returns to idle',
      'Check for load rejection events',
      'Test governor response with EST',
      'Inspect mechanical governor components'
    ],
    relatedParts: [
      'Governor Actuator',
      'Electronic Governor',
      'Fuel Control Linkage',
      'Speed Sensor',
      'Governor Control Module'
    ],
    relatedCodes: ['PERKINS-115', 'PERKINS-111', 'PERKINS-91'],
    searchKeywords: ['Perkins 190', 'overspeed', 'governor fault', 'Perkins runaway'],
    faqQuestions: [
      {
        question: 'What causes a Perkins diesel to overspeed?',
        answer: 'Common causes are governor failure preventing fuel reduction, sudden load removal, or fuel control stuck in full fuel position. Also check for engine-mounted mechanical governor issues.'
      },
      {
        question: 'Is overspeed damage covered under warranty?',
        answer: 'Generally no - overspeed is typically caused by control system failure or operating conditions, not manufacturing defect. Damage from overspeed is usually not warranty-covered.'
      }
    ]
  },
  {
    code: 'PERKINS-2387',
    brand: 'Perkins',
    title: 'Water in Fuel Detected',
    description: 'The fuel/water separator sensor has detected excessive water contamination in the fuel supply. Water in diesel fuel causes injector damage, poor combustion, and corrosion of fuel system components.',
    severity: 'warning',
    category: 'Fuel System',
    possibleCauses: [
      'Condensation in fuel tank',
      'Contaminated fuel delivery',
      'Failed fuel cap allowing rain entry',
      'Fuel/water separator full',
      'Fuel storage tank contaminated',
      'Sensor failure (false alarm)'
    ],
    troubleshootingSteps: [
      'Drain water from fuel/water separator',
      'Check separator bowl for water volume',
      'Inspect fuel tank for water layer',
      'Check fuel cap seal condition',
      'Test sensor operation if water not found',
      'Consider fuel tank cleaning if chronic'
    ],
    relatedParts: [
      'Fuel/Water Separator',
      'Water Sensor',
      'Fuel Tank',
      'Fuel Cap',
      'Separator Element',
      'Drain Valve'
    ],
    relatedCodes: ['PERKINS-94', 'PERKINS-157', 'PERKINS-111'],
    searchKeywords: ['Perkins 2387', 'water in fuel', 'fuel contamination', 'fuel separator'],
    faqQuestions: [
      {
        question: 'How often should I drain the fuel water separator?',
        answer: 'Drain the water separator at each daily inspection or at least weekly. In humid climates or with questionable fuel quality, daily checks are recommended.'
      },
      {
        question: 'Can water damage diesel injectors?',
        answer: 'Yes, water causes injector corrosion, reduces lubrication causing wear, and can cause catastrophic injector tip failure from steam expansion. Always maintain water-free fuel.'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get fault code by code identifier
 */
export function getFaultByCode(code: string): FaultCode | undefined {
  return FAULT_CODES.find(f => f.code.toLowerCase() === code.toLowerCase());
}

/**
 * Get fault codes by brand
 */
export function getFaultsByBrand(brand: string): FaultCode[] {
  return FAULT_CODES.filter(f => f.brand.toLowerCase() === brand.toLowerCase());
}

/**
 * Get fault codes by severity
 */
export function getFaultsBySeverity(severity: 'critical' | 'warning' | 'info'): FaultCode[] {
  return FAULT_CODES.filter(f => f.severity === severity);
}

/**
 * Get fault codes by category
 */
export function getFaultsByCategory(category: string): FaultCode[] {
  return FAULT_CODES.filter(f => f.category.toLowerCase().includes(category.toLowerCase()));
}

/**
 * Search fault codes by keyword
 */
export function searchFaultCodes(query: string): FaultCode[] {
  const q = query.toLowerCase();
  return FAULT_CODES.filter(f =>
    f.code.toLowerCase().includes(q) ||
    f.title.toLowerCase().includes(q) ||
    f.description.toLowerCase().includes(q) ||
    f.brand.toLowerCase().includes(q) ||
    f.searchKeywords.some(k => k.toLowerCase().includes(q))
  );
}

/**
 * Get all unique brands
 */
export function getAllBrands(): string[] {
  return [...new Set(FAULT_CODES.map(f => f.brand))];
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return [...new Set(FAULT_CODES.map(f => f.category))];
}

/**
 * Get fault code slug for URL
 */
export function getFaultSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Get fault code from slug
 */
export function getFaultFromSlug(slug: string): FaultCode | undefined {
  return FAULT_CODES.find(f => getFaultSlug(f.code) === slug);
}

/**
 * Get related faults
 */
export function getRelatedFaults(code: string): FaultCode[] {
  const fault = getFaultByCode(code);
  if (!fault) return [];

  return fault.relatedCodes
    .map(rc => FAULT_CODES.find(f => f.code === rc))
    .filter((f): f is FaultCode => f !== undefined);
}

/**
 * Generate static params for all fault codes
 */
export function generateFaultStaticParams(): { code: string }[] {
  return FAULT_CODES.map(f => ({ code: getFaultSlug(f.code) }));
}

// Statistics for marketing
export const FAULT_CODE_STATS = {
  totalCodes: FAULT_CODES.length,
  totalBrands: getAllBrands().length,
  totalCategories: getAllCategories().length,
  criticalCodes: getFaultsBySeverity('critical').length,
  warningCodes: getFaultsBySeverity('warning').length
};
