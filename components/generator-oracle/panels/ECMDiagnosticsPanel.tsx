'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ECMEntry {
  id: string;
  name: string;
  manufacturer: string;
  category: 'diesel' | 'gas' | 'dual-fuel' | 'marine';
  description: string[];
  workingPrinciple: string[];
  installation: string[];
  specifications: Record<string, string>;
  pinout: string;
  wiringDiagram: string;
  troubleshooting: {
    symptoms: string[];
    causes: string[];
    diagnosticSteps: string[];
    solutions: string[];
    tools: string[];
  };
  faultCodes: {
    controller: string;
    codes: { code: string; description: string; severity: string }[];
  }[];
  partNumbers: { manufacturer: string; partNumber: string; description: string }[];
  compatibleEngines: string[];
}

const ecmDatabase: ECMEntry[] = [
  {
    id: 'cummins-powercommand',
    name: 'Cummins PowerCommand ECM',
    manufacturer: 'Cummins',
    category: 'diesel',
    description: [
      'The Cummins PowerCommand Electronic Control Module (ECM) represents the pinnacle of diesel engine management technology, serving as the central nervous system for Cummins QSK, QSX, QSB, QSL, and QST series engines. This sophisticated microprocessor-based control unit processes over 200 input signals per second, managing fuel injection timing, air-fuel ratios, exhaust gas recirculation, and turbocharger boost pressure with microsecond precision. The PowerCommand ECM integrates seamlessly with generator control systems including DSE, ComAp, and proprietary Cummins PowerCommand panels.',
      'Featuring advanced diagnostic capabilities through the INSITE software platform, the PowerCommand ECM stores comprehensive fault history, engine performance data, and maintenance records. The module utilizes a 32-bit ARM Cortex processor running at 400MHz, enabling real-time adaptive fuel mapping that optimizes combustion efficiency across varying load conditions, ambient temperatures, and altitude ranges. The ECM continuously monitors 47 critical engine parameters including cylinder pressure, injection timing deviation, coolant flow rate, and exhaust manifold temperature.',
      'Built to withstand the harshest operating environments, the PowerCommand ECM features a sealed aluminum housing with IP67 protection rating, operating temperature range from -40°C to +85°C, and vibration resistance up to 30G. The module incorporates triple-redundant power supply circuits, watchdog timer protection, and non-volatile memory that retains critical calibration data even during complete power loss. Field-programmable through J1939/CAN interface, the ECM supports over-the-air updates for calibration optimization and feature enhancements.'
    ],
    workingPrinciple: [
      'The PowerCommand ECM operates on a closed-loop control architecture that continuously compares actual engine performance against target parameters stored in multi-dimensional fuel maps. Upon receiving crankshaft and camshaft position signals, the ECM calculates precise injection timing using proprietary algorithms that account for fuel temperature, rail pressure, injector aging compensation, and cylinder-to-cylinder balancing. The main injection event is typically preceded by pilot injections that reduce combustion noise and improve emissions.',
      'Fuel quantity calculation involves integration of multiple sensor inputs including accelerator pedal position, intake manifold pressure, ambient air temperature, coolant temperature, and exhaust oxygen content. The ECM modulates high-pressure common rail fuel delivery through PWM (Pulse Width Modulation) signals to electronically controlled injectors, achieving injection pressures up to 2,500 bar for optimal fuel atomization. Simultaneously, the module controls VGT (Variable Geometry Turbocharger) vane position to maintain optimal boost pressure across the entire operating range.',
      'The ECM employs sophisticated diagnostic algorithms that continuously monitor sensor rationality, actuator response, and engine performance trends. When deviations exceed programmed thresholds, the module initiates appropriate protection strategies ranging from simple warning alerts to progressive power deration or complete engine shutdown. All diagnostic events are timestamped and stored in non-volatile memory along with freeze-frame data capturing engine conditions at the moment of fault occurrence.'
    ],
    installation: [
      'Proper installation of the Cummins PowerCommand ECM requires careful attention to mounting location, electrical connections, and environmental protection. The ECM should be mounted in a clean, dry location away from heat sources with adequate ventilation for convective cooling. Use vibration-isolating mounts when installing on engine-mounted brackets to protect internal components from mechanical stress. Ensure minimum 50mm clearance around the module for connector access and heat dissipation.',
      'Electrical connections must be made using genuine Cummins harness assemblies with proper shielding and termination. The main harness connector utilizes a 121-pin Deutsch HD30 series receptacle with individual wire seals and secondary locking features. Apply dielectric grease to all connector pins before mating to prevent moisture intrusion and contact corrosion. Route harness away from exhaust components, maintaining minimum 100mm separation, and secure at 300mm intervals to prevent chafing.',
      'Before initial startup, verify ECM power supply voltage (24V nominal, 18-32V operating range) and ground integrity using calibrated multimeter. Program the ECM with engine-specific calibration file using INSITE software connected via datalink adapter. Perform injector quantity adjustment procedure to optimize fuel delivery to each cylinder. Complete installation by conducting full diagnostic scan, clearing any installation-related fault codes, and documenting baseline parameter readings for future reference.'
    ],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Current Draw (Operating)': '3.5A @ 24VDC',
      'Current Draw (Sleep)': '15mA',
      'Processor': '32-bit ARM Cortex-M4 @ 400MHz',
      'Memory': '2MB Flash, 512KB RAM',
      'Operating Temperature': '-40°C to +85°C',
      'Storage Temperature': '-50°C to +105°C',
      'Vibration Resistance': '30G @ 10-2000Hz',
      'Protection Rating': 'IP67',
      'Weight': '1.8 kg',
      'Dimensions': '280 x 180 x 65 mm',
      'Communication': 'J1939 CAN, J1708/J1587, RS-485'
    },
    pinout: `
┌─────────────────────────────────────────────────────────────────┐
│              CUMMINS POWERCOMMAND ECM - 121 PIN                 │
│                    DEUTSCH HD30 CONNECTOR                        │
├─────────────────────────────────────────────────────────────────┤
│  POWER SUPPLY SECTION (Pins 1-12)                               │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │ │
│  │B+1 │B+2 │GND1│GND2│KEY │ NC │IGN │PGND│PGND│SGND│SGND│SHLD│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  SENSOR INPUTS (Pins 13-48)                                     │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │ 20 │ 21 │ 22 │ 23 │ 24 │ │
│  │CKP+│CKP-│CMP+│CMP-│ECT │ IAT│MAP+│MAP-│FRP │OPS │FUEL│EGT1│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ 25 │ 26 │ 27 │ 28 │ 29 │ 30 │ 31 │ 32 │ 33 │ 34 │ 35 │ 36 │ │
│  │EGT2│EGT3│EGT4│EGT5│EGT6│BOOS│TPS │TPS-│APP1│APP2│ICP │ EOT│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  INJECTOR OUTPUTS (Pins 49-72)                                  │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ 49 │ 50 │ 51 │ 52 │ 53 │ 54 │ 55 │ 56 │ 57 │ 58 │ 59 │ 60 │ │
│  │INJ1│INJ1│INJ2│INJ2│INJ3│INJ3│INJ4│INJ4│INJ5│INJ5│INJ6│INJ6│ │
│  │ H  │ L  │ H  │ L  │ H  │ L  │ H  │ L  │ H  │ L  │ H  │ L  │ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  COMMUNICATION (Pins 100-110)                                   │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐      │
│  │100 │101 │102 │103 │104 │105 │106 │107 │108 │109 │110 │      │
│  │CAN+│CAN-│J170│J170│RS48│RS48│USB+│USB-│ NC │DIAG│DIAG│      │
│  │ H  │ L  │ +  │ -  │ A  │ B  │    │    │    │ TX │ RX │      │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘      │
└─────────────────────────────────────────────────────────────────┘`,
    wiringDiagram: `
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CUMMINS POWERCOMMAND ECM WIRING DIAGRAM                   │
│                         Complete System Integration                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌─────────┐                                    ┌──────────────────┐       │
│    │ BATTERY │                                    │   GENERATOR      │       │
│    │  24VDC  │                                    │   CONTROLLER     │       │
│    └────┬────┘                                    │  (DSE/ComAp)     │       │
│         │                                         └────────┬─────────┘       │
│    ┌────┴────┐                                             │                 │
│    │  FUSE   │                                    CAN H ───┤                 │
│    │  40A    │                                    CAN L ───┤                 │
│    └────┬────┘                                             │                 │
│         │                                                   │                 │
│         ▼                                                   ▼                 │
│    ┌─────────────────────────────────────────────────────────────────────┐   │
│    │                     CUMMINS POWERCOMMAND ECM                         │   │
│    │  ┌─────────────────────────────────────────────────────────────┐   │   │
│    │  │                    POWER SECTION                             │   │   │
│    │  │    B+ ○────────────────────────────────────○ 24V FROM FUSE  │   │   │
│    │  │   GND ○────────────────────────────────────○ CHASSIS GND    │   │   │
│    │  │   KEY ○────────────────────────────────────○ IGNITION SW    │   │   │
│    │  └─────────────────────────────────────────────────────────────┘   │   │
│    │                                                                     │   │
│    │  ┌─────────────────────────────────────────────────────────────┐   │   │
│    │  │                   SENSOR INPUTS                              │   │   │
│    │  │                                                              │   │   │
│    │  │   CKP+ ○──────────┐                                         │   │   │
│    │  │   CKP- ○──────────┤    ┌──────────────┐                    │   │   │
│    │  │                   └────┤ CRANKSHAFT   │                    │   │   │
│    │  │                        │   SENSOR     │                    │   │   │
│    │  │   CMP+ ○──────────┐    └──────────────┘                    │   │   │
│    │  │   CMP- ○──────────┤    ┌──────────────┐                    │   │   │
│    │  │                   └────┤  CAMSHAFT    │                    │   │   │
│    │  │                        │   SENSOR     │                    │   │   │
│    │  │                        └──────────────┘                    │   │   │
│    │  │   ECT ○───────────────┤ COOLANT TEMP │──── 5V REF          │   │   │
│    │  │   IAT ○───────────────┤ INTAKE TEMP  │──── 5V REF          │   │   │
│    │  │   OPS ○───────────────┤ OIL PRESSURE │──── 5V REF          │   │   │
│    │  │   MAP ○───────────────┤ BOOST PRESS  │──── 5V REF          │   │   │
│    │  │   FRP ○───────────────┤ FUEL RAIL PR │──── 5V REF          │   │   │
│    │  └─────────────────────────────────────────────────────────────┘   │   │
│    │                                                                     │   │
│    │  ┌─────────────────────────────────────────────────────────────┐   │   │
│    │  │                  INJECTOR OUTPUTS                            │   │   │
│    │  │                                                              │   │   │
│    │  │   INJ1H ○────────┐                                          │   │   │
│    │  │   INJ1L ○────────┼──────────┤ INJECTOR 1 │                  │   │   │
│    │  │                  │          └─────┬──────┘                  │   │   │
│    │  │   INJ2H ○────────┼──────────┤ INJECTOR 2 │                  │   │   │
│    │  │   INJ2L ○────────┘          └─────┬──────┘                  │   │   │
│    │  │        (Continue for all 6 cylinders)                        │   │   │
│    │  └─────────────────────────────────────────────────────────────┘   │   │
│    └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│    WIRE COLORS:                                                              │
│    ─── RED: B+ Power (2.5mm²)      ─── BLK: Ground (2.5mm²)                 │
│    ─── WHT: CAN High               ─── BLU: CAN Low                          │
│    ─── GRN: Sensor Signals         ─── YEL: 5V Reference                     │
│    ─── ORG: Injector High-Side     ─── BRN: Injector Low-Side               │
└──────────────────────────────────────────────────────────────────────────────┘`,
    troubleshooting: {
      symptoms: [
        'Engine cranks but does not start',
        'Intermittent power loss or surging',
        'Check Engine Light illuminated',
        'Poor fuel economy',
        'Black smoke from exhaust',
        'Engine misfires under load',
        'ECM communication fault with controller',
        'Injector fault codes for multiple cylinders',
        'Engine derate or power reduction active'
      ],
      causes: [
        'Faulty crankshaft or camshaft position sensor',
        'Damaged wiring harness or connector corrosion',
        'ECM internal failure or component degradation',
        'Incorrect fuel pressure (high or low)',
        'Injector solenoid failure',
        'CAN bus termination or wiring issues',
        'Power supply voltage out of range',
        'Water intrusion into ECM housing',
        'Incorrect calibration file loaded'
      ],
      diagnosticSteps: [
        '1. Connect INSITE diagnostic software via datalink adapter',
        '2. Read and document all active and stored fault codes',
        '3. View freeze-frame data for fault occurrence conditions',
        '4. Check ECM power supply: B+ should be 24V ±2V',
        '5. Verify ECM ground circuits using voltage drop test',
        '6. Perform sensor rationality tests using INSITE',
        '7. Monitor live data parameters during operation',
        '8. Check CAN bus communication with oscilloscope',
        '9. Perform cylinder cutout test to isolate misfires',
        '10. Review injector quantity adjustment values',
        '11. Check for water intrusion at ECM and connectors',
        '12. Verify correct calibration version installed'
      ],
      solutions: [
        'Replace faulty sensors (CKP, CMP, ECT, etc.)',
        'Repair or replace damaged wiring harness sections',
        'Clean and apply dielectric grease to connectors',
        'Replace ECM if internal failure confirmed',
        'Update ECM calibration to latest version',
        'Replace failed injector(s) and recalibrate',
        'Correct power supply issues (battery, alternator)',
        'Install proper CAN bus termination resistors',
        'Seal ECM housing and connectors against moisture',
        'Perform injector quantity adjustment procedure'
      ],
      tools: [
        'Cummins INSITE diagnostic software (latest version)',
        'Cummins INLINE 7 datalink adapter',
        'Digital multimeter (Fluke 87V or equivalent)',
        'Oscilloscope with CAN decoder capability',
        'Pressure gauge set (fuel rail, oil, boost)',
        'Injector test kit with flow meter',
        'Breakout harness for ECM connector',
        'Torque wrench for connector fasteners'
      ]
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'ECM001', description: 'ECM Communication Lost', severity: 'Critical' },
          { code: 'ECM002', description: 'ECM Internal Failure', severity: 'Critical' },
          { code: 'ECM003', description: 'Injector Circuit Open - Cyl 1', severity: 'Warning' },
          { code: 'ECM004', description: 'Crankshaft Position Sensor Fault', severity: 'Critical' },
          { code: 'ECM005', description: 'Fuel Rail Pressure Low', severity: 'Warning' }
        ]
      },
      {
        controller: 'ComAp',
        codes: [
          { code: 'E-ECM-01', description: 'CAN Communication Timeout', severity: 'Critical' },
          { code: 'E-ECM-02', description: 'Engine Speed Signal Lost', severity: 'Critical' },
          { code: 'E-ECM-03', description: 'Injector Driver Fault', severity: 'Warning' },
          { code: 'E-ECM-04', description: 'ECM Overvoltage Detected', severity: 'Warning' },
          { code: 'E-ECM-05', description: 'ECM Checksum Error', severity: 'Critical' }
        ]
      },
      {
        controller: 'SmartGen',
        codes: [
          { code: 'F101', description: 'ECM No Response', severity: 'Critical' },
          { code: 'F102', description: 'Engine CAN Fault', severity: 'Warning' },
          { code: 'F103', description: 'Injector Overcurrent', severity: 'Warning' },
          { code: 'F104', description: 'ECM Power Supply Fault', severity: 'Critical' },
          { code: 'F105', description: 'Speed Sensor Fault', severity: 'Warning' }
        ]
      }
    ],
    partNumbers: [
      { manufacturer: 'Cummins', partNumber: '4995445', description: 'ECM Assembly - QSX15' },
      { manufacturer: 'Cummins', partNumber: '4995446', description: 'ECM Assembly - QSK60' },
      { manufacturer: 'Cummins', partNumber: '4921776', description: 'ECM Harness - Main' },
      { manufacturer: 'Cummins', partNumber: '3408300', description: 'ECM Mounting Bracket' },
      { manufacturer: 'Cummins', partNumber: '3819525', description: 'Connector Kit - 121 Pin' }
    ],
    compatibleEngines: [
      'QSK19', 'QSK23', 'QSK38', 'QSK45', 'QSK50', 'QSK60', 'QSK78',
      'QSX15', 'QST30', 'QSL9', 'QSB6.7', 'QSB7'
    ]
  },
  {
    id: 'caterpillar-adem',
    name: 'Caterpillar ADEM A4/A5 ECM',
    manufacturer: 'Caterpillar',
    category: 'diesel',
    description: [
      'The Caterpillar ADEM (Advanced Diesel Engine Management) A4 and A5 Electronic Control Modules represent the cutting edge of diesel engine control technology, deployed across CAT\'s entire range of generator set engines including the C9, C15, C18, C27, C32, and 3500 series. These ECMs utilize dual 32-bit microprocessors operating in a master-slave configuration, providing redundant control capability and real-time fault detection. The ADEM architecture processes over 300 input/output signals while maintaining cycle-to-cycle combustion optimization.',
      'Distinguished by their modular design philosophy, ADEM A4/A5 ECMs incorporate field-replaceable personality modules that store engine-specific calibration data. This architecture allows rapid ECM replacement without requiring complete recalibration, minimizing downtime in critical power applications. The ECM interfaces with CAT\'s proprietary CDL (Cat Data Link) protocol while also supporting J1939 CAN communication for integration with third-party generator controllers including DSE, ComAp, and Woodward systems.',
      'Environmental protection exceeds military specifications with the ADEM ECM featuring triple-sealed aluminum housing, conformal coating on all circuit boards, and gold-plated connector contacts. Operating reliably from -40°C to +121°C, the unit withstands 50G shock loads and continuous vibration exposure. Built-in diagnostics monitor internal temperature, voltage rails, and processor operation, automatically entering protective mode if parameters exceed safe limits while logging detailed fault information for later analysis.'
    ],
    workingPrinciple: [
      'ADEM ECMs employ a model-based control strategy where the engine is mathematically represented within the controller\'s firmware. Real-time sensor data is compared against predicted values from the engine model, with deviations triggering immediate corrective action. This predictive approach enables proactive fault detection before actual failures occur, often identifying degrading components weeks before complete failure. The dual-processor architecture assigns one processor to time-critical injection control while the second handles monitoring, communication, and diagnostics.',
      'Fuel injection timing and quantity are calculated using proprietary combustion optimization algorithms that consider ambient conditions, fuel quality variations, and individual cylinder performance characteristics. The ECM maintains a correction factor for each injector, compensating for manufacturing tolerances and wear-related changes. High-pressure common rail systems receive injection commands with 0.1 degree crankshaft angle resolution, enabling precise multi-pulse injection strategies including pilot, main, and post injections.',
      'The ADEM system implements comprehensive engine protection through graduated response protocols. Tier 1 warnings alert operators to developing issues while maintaining full power. Tier 2 conditions initiate power deration according to programmed curves. Tier 3 faults trigger controlled shutdown with adequate warning for load transfer. Critical Tier 4 events cause immediate shutdown with injector cutoff in under 100 milliseconds to prevent catastrophic damage. All protection events are logged with timestamp, operating conditions, and sensor snapshots.'
    ],
    installation: [
      'Caterpillar ADEM ECM installation demands strict adherence to published mounting and wiring specifications. The ECM requires rigid mounting to a solid structure with vibration isolation when engine-mounted. Maximum mounting surface temperature must not exceed 80°C, necessitating heat shields when mounting near exhaust components. Maintain minimum 75mm clearance on all sides for connector access and convective cooling air circulation.',
      'Wiring installation utilizes CAT-specified harnesses with integrated shielding and proper connector termination. The main harness connector is a 120-pin Deutsch HD30 series with individual cavity seals rated for repeated mating cycles. Secondary connectors handle injector drives, communication interfaces, and optional features. Apply CAT-approved dielectric compound to all connector cavities and verify proper seating using connector position assurance (CPA) features.',
      'System commissioning requires Cat ET (Electronic Technician) software connected via Cat Communication Adapter III. Program the ECM with appropriate calibration file for the specific engine serial number. Perform flash file verification to confirm successful programming. Execute injector trim file installation using codes from individual injector packaging. Complete setup by running engine at idle, recording baseline parameters, and conducting full diagnostic test sequence. Clear all installation-related fault codes before releasing to service.'
    ],
    specifications: {
      'Operating Voltage': '18-32 VDC (24V nominal)',
      'Current Draw': '4.2A maximum',
      'Processor': 'Dual 32-bit RISC @ 450MHz',
      'Memory': '4MB Flash, 1MB RAM, 256KB EEPROM',
      'Operating Temperature': '-40°C to +121°C',
      'Storage Temperature': '-55°C to +150°C',
      'Shock Resistance': '50G, 11ms',
      'Vibration': '10-2000Hz, 20G RMS',
      'Protection Rating': 'IP69K',
      'Weight': '2.4 kg',
      'Dimensions': '310 x 200 x 75 mm',
      'Communication': 'Cat Data Link, J1939 CAN, J1587'
    },
    pinout: `
┌─────────────────────────────────────────────────────────────────┐
│              CATERPILLAR ADEM A4/A5 ECM - 120 PIN               │
│                    DEUTSCH HD30 CONNECTOR                        │
├─────────────────────────────────────────────────────────────────┤
│  POWER & GROUND (Pins A1-A12)                                   │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ A1 │ A2 │ A3 │ A4 │ A5 │ A6 │ A7 │ A8 │ A9 │A10 │A11 │A12 │ │
│  │VB+ │VB+ │GND │GND │KEY │RLY1│RLY2│PGND│PGND│AGND│AGND│SHLD│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  ENGINE SENSORS (Pins B1-B36)                                   │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ B1 │ B2 │ B3 │ B4 │ B5 │ B6 │ B7 │ B8 │ B9 │B10 │B11 │B12 │ │
│  │SPD+│SPD-│TIM+│TIM-│ ECT│ECTR│ IAT│IATR│BOST│BSTR│ FRP│FRPR│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │B13 │B14 │B15 │B16 │B17 │B18 │B19 │B20 │B21 │B22 │B23 │B24 │ │
│  │OPS │OPSR│EOT │EOTR│ATF │ATFR│EOP │ CLT│EGT1│EGT2│EGT3│EGT4│ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  FUEL SYSTEM (Pins C1-C24)                                      │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ C1 │ C2 │ C3 │ C4 │ C5 │ C6 │ C7 │ C8 │ C9 │C10 │C11 │C12 │ │
│  │INJ1│INJ1│INJ2│INJ2│INJ3│INJ3│INJ4│INJ4│INJ5│INJ5│INJ6│INJ6│ │
│  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  COMMUNICATION (Pins D1-D12)                                    │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ D1 │ D2 │ D3 │ D4 │ D5 │ D6 │ D7 │ D8 │ D9 │D10 │D11 │D12 │ │
│  │CDL+│CDL-│CAN+│CAN-│J170│J170│ USB│ USB│ETH+│ETH-│WIFI│WIFI│ │
│  │    │    │  H │  L │  + │  - │  D+│  D-│    │    │ TX │ RX │ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
└─────────────────────────────────────────────────────────────────┘`,
    wiringDiagram: `
┌──────────────────────────────────────────────────────────────────────────────┐
│                     CATERPILLAR ADEM A4/A5 WIRING DIAGRAM                    │
│                          Generator Set Application                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌──────────┐        ┌──────────┐         ┌──────────────────────┐        │
│    │ BATTERY  │        │  ENGINE  │         │  GENERATOR CONTROLLER │        │
│    │   24V    │        │ SENSORS  │         │   (DSE/DEIF/ComAp)    │        │
│    └────┬─────┘        └────┬─────┘         └──────────┬───────────┘        │
│         │                   │                          │                     │
│    ┌────┴────┐              │                    CAN H ┤                     │
│    │ 50A CB  │              │                    CAN L ┤                     │
│    └────┬────┘              │                    CDL + ┤                     │
│         │                   │                    CDL - ┤                     │
│         ▼                   ▼                          ▼                     │
│    ┌─────────────────────────────────────────────────────────────────────┐   │
│    │                      CATERPILLAR ADEM A4/A5 ECM                      │   │
│    │  ┌───────────────────────────────────────────────────────────────┐ │   │
│    │  │  POWER INPUT                          COMMUNICATION            │ │   │
│    │  │  ═══════════                          ═════════════            │ │   │
│    │  │  VB+ ●────────── 24VDC ───────┐      CDL+ ●──── Cat Data Link │ │   │
│    │  │  GND ●────────── CHASSIS ─────┤      CDL- ●──── Cat Data Link │ │   │
│    │  │  KEY ●────────── IGN SWITCH   │      CAN H ●─── J1939 CAN Bus │ │   │
│    │  └───────────────────────────────┴──────CAN L ●─── J1939 CAN Bus │ │   │
│    │                                                                     │   │
│    │  ┌───────────────────────────────────────────────────────────────┐ │   │
│    │  │  SPEED/TIMING SENSORS                                         │ │   │
│    │  │  ════════════════════                                         │ │   │
│    │  │        ┌─────────────────┐          ┌─────────────────┐      │ │   │
│    │  │  SPD+ ●┤   CRANKSHAFT    │    TIM+ ●┤    CAMSHAFT     │      │ │   │
│    │  │  SPD- ●┤   MPU SENSOR    │    TIM- ●┤   MPU SENSOR    │      │ │   │
│    │  │        │  (60-2 teeth)   │          │  (Single pulse) │      │ │   │
│    │  │        └─────────────────┘          └─────────────────┘      │ │   │
│    │  └───────────────────────────────────────────────────────────────┘ │   │
│    │                                                                     │   │
│    │  ┌───────────────────────────────────────────────────────────────┐ │   │
│    │  │  ANALOG SENSORS (5V REFERENCE)                                │ │   │
│    │  │  ═════════════════════════════                                │ │   │
│    │  │                                                                │ │   │
│    │  │   ECT ●───┬───[NTC]───┬───● ECTR    Coolant Temperature      │ │   │
│    │  │           │   10kΩ    │                                       │ │   │
│    │  │   IAT ●───┬───[NTC]───┬───● IATR    Intake Air Temperature   │ │   │
│    │  │                                                                │ │   │
│    │  │   BOST ●──┬───[───]───┬───● BSTR    Boost Pressure (0-5V)    │ │   │
│    │  │           │   0-60psi │                                       │ │   │
│    │  │   OPS ●───┬───[───]───┬───● OPSR    Oil Pressure (0-150psi)  │ │   │
│    │  │                                                                │ │   │
│    │  │   FRP ●───────────────────● FRPR    Fuel Rail Pressure       │ │   │
│    │  └───────────────────────────────────────────────────────────────┘ │   │
│    │                                                                     │   │
│    │  ┌───────────────────────────────────────────────────────────────┐ │   │
│    │  │  HEUI/MEUI INJECTOR OUTPUTS (8 CYLINDER SHOWN)                │ │   │
│    │  │  ═════════════════════════════════════════════                │ │   │
│    │  │                                                                │ │   │
│    │  │   C1─────┐    C3─────┐    C5─────┐    C7─────┐              │ │   │
│    │  │   C2─────┼──INJ1     ├──INJ2     ├──INJ3     ├──INJ4        │ │   │
│    │  │          │           │           │           │               │ │   │
│    │  │   C9─────┐   C11────┐   C13────┐   C15────┐              │ │   │
│    │  │  C10─────┼──INJ5    ├──INJ6    ├──INJ7    ├──INJ8        │ │   │
│    │  └───────────────────────────────────────────────────────────────┘ │   │
│    └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│    SHIELD GROUNDING:                                                         │
│    ═════════════════                                                         │
│    - Ground all shields at ECM end only (single-point ground)               │
│    - Use dedicated shield ground pin (A12)                                   │
│    - Do not ground shields at sensor end                                     │
└──────────────────────────────────────────────────────────────────────────────┘`,
    troubleshooting: {
      symptoms: [
        'Engine fails to crank or start',
        'Reduced engine power (derate active)',
        'Service codes displayed on Cat ET',
        'Rough idle or engine surging',
        'Excessive black or white smoke',
        'High fuel consumption',
        'Communication timeout with controller',
        'Engine shuts down unexpectedly',
        'Injector balance values out of range'
      ],
      causes: [
        'Speed/timing sensor failure or misalignment',
        'ECM personality module corruption',
        'Injector solenoid or driver failure',
        'Wiring harness damage or water ingress',
        'ECM overheating due to restricted airflow',
        'Incorrect injector trim codes installed',
        'Fuel system restriction or air leak',
        'CAN bus termination issues',
        'Low system voltage (battery/charging)'
      ],
      diagnosticSteps: [
        '1. Connect Cat ET via Communication Adapter III',
        '2. Read all active and logged service codes',
        '3. View Event History for pattern analysis',
        '4. Check Configuration for correct engine serial',
        '5. Perform Diagnostic Tests → Engine Tests',
        '6. Monitor Status → Engine parameters during operation',
        '7. Verify injector trim codes match physical injectors',
        '8. Check voltage at ECM during cranking (min 18V)',
        '9. Inspect speed/timing sensor gap (0.5-1.0mm)',
        '10. Test fuel rail pressure at idle and full load',
        '11. Review CAN bus traffic for errors/timeouts',
        '12. Perform wiggle test on harness connections'
      ],
      solutions: [
        'Replace speed/timing sensors and reset gap',
        'Reprogram ECM with correct personality module',
        'Replace failed injectors and install trim codes',
        'Repair harness using CAT genuine splices',
        'Clean ECM mounting area and ensure ventilation',
        'Verify and correct injector trim codes',
        'Replace fuel filters and bleed system',
        'Add/correct CAN termination resistors (120Ω)',
        'Service battery/alternator system',
        'Replace ECM if internal failure confirmed'
      ],
      tools: [
        'Cat Electronic Technician (Cat ET) software',
        'Cat Communication Adapter III (CCA3)',
        'Cat Data Link Adapter II',
        'Digital multimeter (calibrated)',
        'Oscilloscope for signal analysis',
        'Fuel pressure test kit (0-3000 psi)',
        'Injector test bench',
        'Harness breakout box',
        'Feeler gauges for sensor gap'
      ]
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'CAT-001', description: 'ADEM Communication Failure', severity: 'Critical' },
          { code: 'CAT-002', description: 'Engine Speed Signal Lost', severity: 'Critical' },
          { code: 'CAT-003', description: 'Injector Circuit Fault', severity: 'Warning' },
          { code: 'CAT-004', description: 'ECM Internal Temperature High', severity: 'Warning' },
          { code: 'CAT-005', description: 'Fuel Rail Pressure Out of Range', severity: 'Warning' }
        ]
      },
      {
        controller: 'ComAp',
        codes: [
          { code: 'E-CAT-01', description: 'Cat Data Link Timeout', severity: 'Critical' },
          { code: 'E-CAT-02', description: 'Engine Derate Active', severity: 'Warning' },
          { code: 'E-CAT-03', description: 'Speed/Timing Correlation Error', severity: 'Critical' },
          { code: 'E-CAT-04', description: 'ADEM Watchdog Reset', severity: 'Critical' },
          { code: 'E-CAT-05', description: 'Injector Balance Fault', severity: 'Warning' }
        ]
      },
      {
        controller: 'Woodward',
        codes: [
          { code: 'W-ADEM-1', description: 'ECM Not Responding', severity: 'Critical' },
          { code: 'W-ADEM-2', description: 'J1939 Protocol Error', severity: 'Warning' },
          { code: 'W-ADEM-3', description: 'Engine Protection Active', severity: 'Warning' },
          { code: 'W-ADEM-4', description: 'Speed Signal Intermittent', severity: 'Warning' },
          { code: 'W-ADEM-5', description: 'ECM Calibration Mismatch', severity: 'Critical' }
        ]
      }
    ],
    partNumbers: [
      { manufacturer: 'Caterpillar', partNumber: '348-2380', description: 'ECM Assembly - ADEM A4' },
      { manufacturer: 'Caterpillar', partNumber: '379-1556', description: 'ECM Assembly - ADEM A5' },
      { manufacturer: 'Caterpillar', partNumber: '234-4718', description: 'ECM Wiring Harness' },
      { manufacturer: 'Caterpillar', partNumber: '189-8516', description: 'Personality Module' },
      { manufacturer: 'Caterpillar', partNumber: '317-7485', description: 'Communication Adapter III' }
    ],
    compatibleEngines: [
      'C9 ACERT', 'C13 ACERT', 'C15 ACERT', 'C18 ACERT',
      'C27 ACERT', 'C32 ACERT', '3508B', '3512B', '3516B'
    ]
  },
  {
    id: 'perkins-ecm',
    name: 'Perkins 2806/2506/1300 Series ECM',
    manufacturer: 'Perkins',
    category: 'diesel',
    description: [
      'The Perkins Electronic Control Module (ECM) provides sophisticated engine management for the 2806, 2506, 1300, and 1100 series diesel engines widely used in generator set applications worldwide. This ruggedized control unit integrates Perkins\' decades of diesel engine expertise with modern electronic fuel injection technology, delivering optimal performance across diverse operating conditions. The ECM processes signals from over 15 engine sensors to precisely control common rail fuel injection timing, quantity, and multi-pulse strategies.',
      'Designed specifically for power generation applications, the Perkins ECM features dedicated generator set operating modes including load acceptance optimization, voltage regulation support, and parallel synchronization assistance. The module communicates via J1939 CAN bus with industry-standard generator controllers from DSE, ComAp, SmartGen, and Woodward, enabling seamless integration into both standalone and paralleling switchgear systems. Perkins EST (Electronic Service Tool) software provides comprehensive diagnostic capabilities including real-time parameter monitoring, fault code retrieval, and engine calibration.',
      'The ECM housing is manufactured from die-cast aluminum with integral cooling fins and sealed to IP67 standards for protection against dust, water spray, and harsh industrial environments. Operating reliably from -40°C to +85°C, the unit withstands vibration levels up to 25G RMS and shock loads of 40G. Internal watchdog circuits continuously monitor processor operation, initiating safe engine shutdown if anomalies are detected. Non-volatile memory stores up to 50 fault events with freeze-frame data for detailed post-incident analysis.'
    ],
    workingPrinciple: [
      'The Perkins ECM utilizes a high-pressure common rail fuel system operating at pressures up to 1,800 bar for optimal fuel atomization and combustion efficiency. Upon receiving crankshaft and camshaft position signals from magnetic pickup sensors, the ECM calculates precise injection timing referenced to top dead center of each cylinder. Multiple injection pulses per combustion cycle (pilot, main, and post injections) reduce noise, emissions, and combustion chamber thermal stress.',
      'Engine speed and load governing is accomplished through closed-loop control algorithms that continuously compare actual engine speed against the commanded setpoint. The ECM modulates fuel delivery to maintain stable frequency during load transients, with configurable droop characteristics for parallel operation. An integrated anti-surge system prevents turbocharger damage during rapid load rejection by temporarily enriching fuel mixture and opening wastegate valves.',
      'Comprehensive engine protection is achieved through continuous monitoring of coolant temperature, oil pressure, oil temperature, intake manifold temperature, and exhaust temperature. When parameters exceed programmed limits, the ECM initiates graduated protective responses: Level 1 displays warnings while maintaining operation, Level 2 reduces engine power through fuel deration, and Level 3 initiates controlled shutdown with adequate time for auxiliary systems to de-energize. Emergency shutdown for critical faults occurs within 200 milliseconds.'
    ],
    installation: [
      'Mount the Perkins ECM in a location protected from direct exposure to heat, water, and vibration while ensuring adequate airflow for convective cooling. When engine-mounted, use rubber isolation mounts rated for the specific vibration frequencies present. Maintain minimum 50mm clearance around all sides for connector access and thermal management. The ECM mounting surface should not exceed 70°C during normal operation.',
      'Use only genuine Perkins wiring harnesses for all ECM connections to ensure proper shielding, connector sealing, and wire gauge specifications. The main 54-pin Deutsch HD30 connector requires proper insertion of individual pin seals followed by connector position assurance (CPA) clip engagement. Apply Perkins-approved dielectric grease to connector cavities before mating. Route harness at least 75mm away from exhaust manifolds and turbocharger housings.',
      'Initial ECM programming requires Perkins EST software connected via serial or CAN interface adapter. Install the correct engine calibration file matching the specific engine serial number and application requirements. Configure generator set parameters including rated speed, droop percentage, and protection setpoints. Perform sensor calibration procedures for throttle position and fuel pressure. Conduct full diagnostic sweep to verify all sensors and actuators function correctly before releasing to service.'
    ],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Current Draw': '2.8A maximum',
      'Processor': '32-bit RISC @ 200MHz',
      'Memory': '1MB Flash, 256KB RAM',
      'Operating Temperature': '-40°C to +85°C',
      'Storage Temperature': '-50°C to +100°C',
      'Vibration': '25G RMS, 10-2000Hz',
      'Protection Rating': 'IP67',
      'Weight': '1.5 kg',
      'Dimensions': '245 x 165 x 58 mm',
      'Communication': 'J1939 CAN, J1587/J1708'
    },
    pinout: `
┌─────────────────────────────────────────────────────────────────┐
│                 PERKINS ECM - 54 PIN CONNECTOR                  │
│                    DEUTSCH HD30 SERIES                          │
├─────────────────────────────────────────────────────────────────┤
│  POWER (Pins 1-8)                                               │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┐                     │
│  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │                     │
│  │VB+ │VB+ │GND │GND │KEY │ NC │PGND│SHLD│                     │
│  └────┴────┴────┴────┴────┴────┴────┴────┘                     │
│                                                                  │
│  SENSORS (Pins 9-30)                                            │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐      │
│  │ 9  │ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │      │
│  │SPD+│SPD-│CAM+│CAM-│ ECT│ IAT│ OPS│ FRP│BOST│ EOT│5REF│      │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘      │
│                                                                  │
│  INJECTORS (Pins 31-42)                                         │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │ 31 │ 32 │ 33 │ 34 │ 35 │ 36 │ 37 │ 38 │ 39 │ 40 │ 41 │ 42 │ │
│  │I1+ │I1- │I2+ │I2- │I3+ │I3- │I4+ │I4- │I5+ │I5- │I6+ │I6- │ │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  COMMUNICATION (Pins 48-54)                                     │
│  ┌────┬────┬────┬────┬────┬────┬────┐                          │
│  │ 48 │ 49 │ 50 │ 51 │ 52 │ 53 │ 54 │                          │
│  │CAN+│CAN-│J170│J170│DIAG│ NC │ NC │                          │
│  │ H  │ L  │ +  │ -  │    │    │    │                          │
│  └────┴────┴────┴────┴────┴────┴────┘                          │
└─────────────────────────────────────────────────────────────────┘`,
    wiringDiagram: `
┌──────────────────────────────────────────────────────────────────────────────┐
│                      PERKINS ECM WIRING DIAGRAM                              │
│                    Generator Set Application                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌──────────┐                                  ┌──────────────────┐        │
│    │ BATTERY  │                                  │   GEN CONTROLLER │        │
│    │   24V    │                                  │    (DSE/ComAp)   │        │
│    └────┬─────┘                                  └────────┬─────────┘        │
│         │                                                 │                   │
│    ┌────┴────┐                                   CAN H ───┤                   │
│    │ 30A CB  │                                   CAN L ───┤                   │
│    └────┬────┘                                            │                   │
│         │                                                  │                   │
│         ▼                                                  ▼                   │
│    ┌─────────────────────────────────────────────────────────────────────┐   │
│    │                         PERKINS ECM                                  │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ POWER                                                       │    │   │
│    │  │   VB+ (1,2) ●────────────────── 24VDC FROM CIRCUIT BREAKER │    │   │
│    │  │   GND (3,4) ●────────────────── CHASSIS/ENGINE GROUND      │    │   │
│    │  │   KEY (5)   ●────────────────── IGNITION SWITCH            │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ SPEED SENSORS                                               │    │   │
│    │  │                                                              │    │   │
│    │  │   SPD+ (9)  ●──────┐    ┌───────────────┐                  │    │   │
│    │  │   SPD- (10) ●──────┼────┤  CRANKSHAFT   │                  │    │   │
│    │  │                    │    │  MPU SENSOR   │                  │    │   │
│    │  │                    │    │  Gap: 0.5mm   │                  │    │   │
│    │  │   CAM+ (11) ●──────┼────┤───────────────┤                  │    │   │
│    │  │   CAM- (12) ●──────┘    │  CAMSHAFT     │                  │    │   │
│    │  │                         │  MPU SENSOR   │                  │    │   │
│    │  │                         └───────────────┘                  │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ ANALOG SENSORS                                              │    │   │
│    │  │                                                              │    │   │
│    │  │   ECT (13) ●──┬──[NTC 10kΩ]──● 5V REF    Coolant Temp     │    │   │
│    │  │   IAT (14) ●──┬──[NTC 10kΩ]──● 5V REF    Intake Temp      │    │   │
│    │  │   OPS (15) ●──┬──[Resistive]─● 5V REF    Oil Pressure     │    │   │
│    │  │   FRP (16) ●──────[Strain]───● 5V REF    Fuel Rail Press  │    │   │
│    │  │   BOST (17) ●─────[Strain]───● 5V REF    Boost Pressure   │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ INJECTOR OUTPUTS (6 CYL)                                    │    │   │
│    │  │                                                              │    │   │
│    │  │   I1+ (31) ●────┐                                           │    │   │
│    │  │   I1- (32) ●────┼──── INJECTOR 1   Firing Order: 1-5-3-6-2-4│    │   │
│    │  │                 │                                            │    │   │
│    │  │   I2+ (33) ●────┼──── INJECTOR 2                            │    │   │
│    │  │   I2- (34) ●────┘                                           │    │   │
│    │  │         (Continue for all 6 cylinders)                      │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│    WIRE SPECIFICATIONS:                                                      │
│    ─ Power: 4mm² minimum, <0.5Ω total resistance                            │
│    ─ Sensors: 0.5mm² shielded, shield grounded at ECM only                  │
│    ─ CAN Bus: 120Ω twisted pair, terminated both ends                        │
└──────────────────────────────────────────────────────────────────────────────┘`,
    troubleshooting: {
      symptoms: [
        'Engine cranks but fails to start',
        'Unstable idle or hunting',
        'Loss of power under load',
        'Excessive smoke (black/white/blue)',
        'High fuel consumption',
        'Rough running or misfires',
        'Communication errors with controller',
        'Engine protection shutdown'
      ],
      causes: [
        'Crankshaft/camshaft sensor failure',
        'Fuel supply restriction or air leak',
        'Injector failure or poor spray pattern',
        'ECM internal component failure',
        'Wiring harness damage or corrosion',
        'Low fuel rail pressure',
        'Sensor drift or calibration error',
        'CAN bus wiring or termination fault'
      ],
      diagnosticSteps: [
        '1. Connect Perkins EST diagnostic software',
        '2. Read all active and stored fault codes',
        '3. View freeze-frame data for fault conditions',
        '4. Check ECM power supply (min 18V during cranking)',
        '5. Verify all ground connections for low resistance',
        '6. Monitor real-time engine parameters',
        '7. Perform actuator tests (injectors, actuators)',
        '8. Check crankshaft sensor signal with oscilloscope',
        '9. Verify fuel rail pressure at specification',
        '10. Inspect harness for damage, chafing, moisture'
      ],
      solutions: [
        'Replace failed crankshaft/camshaft sensors',
        'Clean/replace fuel filters, bleed system',
        'Replace faulty injectors, perform flow test',
        'Replace ECM if internal failure confirmed',
        'Repair harness with genuine Perkins splices',
        'Check high-pressure pump operation',
        'Recalibrate sensors using EST software',
        'Verify CAN termination and wiring'
      ],
      tools: [
        'Perkins EST (Electronic Service Tool)',
        'Perkins diagnostic adapter',
        'Digital multimeter',
        'Oscilloscope',
        'Fuel pressure test kit',
        'Injector test equipment',
        'Breakout harness'
      ]
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'PKN-001', description: 'ECM Communication Lost', severity: 'Critical' },
          { code: 'PKN-002', description: 'Engine Speed Signal Fault', severity: 'Critical' },
          { code: 'PKN-003', description: 'Fuel Rail Pressure Low', severity: 'Warning' },
          { code: 'PKN-004', description: 'Injector Circuit Open', severity: 'Warning' },
          { code: 'PKN-005', description: 'Coolant Temperature High', severity: 'Warning' }
        ]
      },
      {
        controller: 'ComAp',
        codes: [
          { code: 'E-PKN-01', description: 'CAN Timeout - Perkins ECM', severity: 'Critical' },
          { code: 'E-PKN-02', description: 'Engine Derate Active', severity: 'Warning' },
          { code: 'E-PKN-03', description: 'Speed Sensor Fault', severity: 'Critical' },
          { code: 'E-PKN-04', description: 'Oil Pressure Low', severity: 'Warning' },
          { code: 'E-PKN-05', description: 'ECM Internal Error', severity: 'Critical' }
        ]
      }
    ],
    partNumbers: [
      { manufacturer: 'Perkins', partNumber: '2868A014', description: 'ECM Assembly - 2806 Series' },
      { manufacturer: 'Perkins', partNumber: '2874A304', description: 'ECM Assembly - 2506 Series' },
      { manufacturer: 'Perkins', partNumber: '2871A304', description: 'ECM Assembly - 1300 Series' },
      { manufacturer: 'Perkins', partNumber: '2868K002', description: 'ECM Wiring Harness' },
      { manufacturer: 'Perkins', partNumber: 'T402378', description: 'Diagnostic Adapter' }
    ],
    compatibleEngines: [
      '2806A-E18TAG1', '2806A-E18TAG2', '2806A-E18TAG3',
      '2506A-E15TAG1', '2506A-E15TAG2', '1306A-E87TAG3',
      '1306A-E87TAG4', '1306A-E87TAG5', '1306A-E87TAG6'
    ]
  },
  {
    id: 'volvo-ems2',
    name: 'Volvo Penta EMS2 ECM',
    manufacturer: 'Volvo Penta',
    category: 'diesel',
    description: [
      'The Volvo Penta EMS2 (Engine Management System 2) Electronic Control Module represents the latest generation of diesel engine control technology for the TAD series engines used in industrial and marine generator applications. This advanced ECM integrates all engine management functions into a single, compact unit that controls fuel injection, air management, engine protection, and diagnostic communication. The EMS2 system processes data from 25+ sensors at rates exceeding 10,000 calculations per second.',
      'Featuring Volvo\'s proprietary V-ACT (Volvo Advanced Combustion Technology) algorithms, the EMS2 ECM optimizes fuel injection parameters for each operating condition, achieving industry-leading fuel efficiency while meeting stringent emissions standards. The module supports multiple injection events per combustion cycle including pre-pilot, pilot, main, and post injections to minimize noise and particulate emissions. Integration with the Volvo Penta EGR system provides precise exhaust gas recirculation control.',
      'Built to Volvo\'s exacting quality standards, the EMS2 ECM features a robust die-cast aluminum housing with advanced thermal management and IP67 environmental sealing. Operating reliably across extreme temperature ranges (-40°C to +105°C), the unit incorporates redundant power supply circuits, hardware watchdog timers, and comprehensive self-diagnostic capabilities. The module stores up to 100 fault events with detailed timestamp and operating condition data for thorough diagnostic analysis.'
    ],
    workingPrinciple: [
      'The EMS2 ECM employs model-based control algorithms that maintain a mathematical representation of engine behavior in real-time. Sensor inputs are compared against predicted values from the engine model, allowing rapid detection of developing faults before they become critical failures. The main control loop runs at 1000Hz, enabling precise synchronization of fuel injection events with crankshaft rotation to within 0.1 degree of crank angle.',
      'Fuel injection control utilizes Volvo\'s common rail system operating at pressures up to 2,000 bar. The ECM calculates optimal injection timing, duration, and pressure for each cylinder based on current operating conditions, load demand, ambient environment, and fuel temperature. Adaptive learning algorithms continuously refine injection parameters to compensate for component aging and fuel quality variations.',
      'Engine protection is implemented through multiple independent monitoring systems that operate concurrently. Primary protection monitors critical parameters including coolant temperature, oil pressure, oil temperature, boost pressure, and engine speed. Secondary protection monitors system integrity including sensor rationality, actuator response, and ECM internal health. Tertiary protection uses trend analysis to detect gradual degradation before failure thresholds are reached.'
    ],
    installation: [
      'The EMS2 ECM should be mounted in a clean, dry location with sufficient airflow for cooling. When engine-mounted, use approved vibration isolation mounts to protect internal components. The mounting surface temperature must not exceed 85°C. Maintain at least 60mm clearance around the ECM for connector access and heat dissipation. Avoid mounting near exhaust components or areas subject to water spray.',
      'All electrical connections must use genuine Volvo Penta harnesses with factory-sealed connectors. The main 70-pin connector requires proper installation of cavity seals and engagement of the connector position assurance (CPA) lock. Apply approved dielectric grease to all connector pins. Harness routing must maintain minimum 100mm separation from exhaust components and use approved clamps at 250mm intervals.',
      'System commissioning requires VODIA (Volvo Diagnostic Application) software connected via diagnostic adapter. Upload the correct engine calibration file for the specific engine configuration. Perform throttle position sensor calibration and verify all sensor readings. Configure generator set parameters including speed control mode, protection limits, and communication settings. Execute full diagnostic test sequence before releasing to service.'
    ],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Current Draw': '3.0A maximum',
      'Processor': '32-bit PowerPC @ 300MHz',
      'Memory': '2MB Flash, 512KB RAM',
      'Operating Temperature': '-40°C to +105°C',
      'Storage Temperature': '-55°C to +125°C',
      'Vibration': '30G RMS',
      'Protection Rating': 'IP67',
      'Weight': '1.9 kg',
      'Dimensions': '270 x 180 x 62 mm',
      'Communication': 'J1939 CAN, ISO 9141, K-Line'
    },
    pinout: `
┌─────────────────────────────────────────────────────────────────┐
│               VOLVO PENTA EMS2 ECM - 70 PIN                     │
│                    AMP CONNECTOR SERIES                          │
├─────────────────────────────────────────────────────────────────┤
│  POWER SECTION (Pins A1-A10)                                    │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ A1 │ A2 │ A3 │ A4 │ A5 │ A6 │ A7 │ A8 │ A9 │A10 │           │
│  │ B+ │ B+ │GND │GND │KEY │AUX │PGND│PGND│AGND│SHLD│           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  SENSOR INPUTS (Pins B1-B25)                                    │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ B1 │ B2 │ B3 │ B4 │ B5 │ B6 │ B7 │ B8 │ B9 │B10 │           │
│  │CRK+│CRK-│CAM+│CAM-│ ECT│ECTR│ IAT│IATR│BOST│BSTR│           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │B11 │B12 │B13 │B14 │B15 │B16 │B17 │B18 │B19 │B20 │           │
│  │ OPS│OPSR│ FRP│FRPR│ EOT│EOTR│ FLV│5REF│5REF│ EGR│           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  INJECTOR OUTPUTS (Pins C1-C16)                                 │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ C1 │ C2 │ C3 │ C4 │ C5 │ C6 │ C7 │ C8 │ C9 │C10 │           │
│  │INJ1│INJ1│INJ2│INJ2│INJ3│INJ3│INJ4│INJ4│INJ5│INJ5│           │
│  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  COMMUNICATION (Pins D1-D10)                                    │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ D1 │ D2 │ D3 │ D4 │ D5 │ D6 │ D7 │ D8 │ D9 │D10 │           │
│  │CAN1│CAN1│CAN2│CAN2│KLIN│ISO │DIAG│DIAG│ NC │ NC │           │
│  │ H  │ L  │ H  │ L  │    │9141│ TX │ RX │    │    │           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
└─────────────────────────────────────────────────────────────────┘`,
    wiringDiagram: `
┌──────────────────────────────────────────────────────────────────────────────┐
│                     VOLVO PENTA EMS2 WIRING DIAGRAM                          │
│                        Industrial Generator Set                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌──────────┐                                  ┌──────────────────┐        │
│    │ BATTERY  │                                  │   GEN CONTROLLER │        │
│    │   24V    │                                  │    DSE/ComAp     │        │
│    └────┬─────┘                                  └────────┬─────────┘        │
│         │                                                 │                   │
│    ┌────┴────┐                                   CAN1 H ──┤                   │
│    │ 40A CB  │                                   CAN1 L ──┤                   │
│    └────┬────┘                                            │                   │
│         │                                                  ▼                   │
│         ▼                                                                      │
│    ┌─────────────────────────────────────────────────────────────────────┐   │
│    │                        VOLVO PENTA EMS2 ECM                          │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ POWER SUPPLY                                                │    │   │
│    │  │   B+ (A1,A2) ●─────────────────────── 24VDC SWITCHED       │    │   │
│    │  │   GND (A3,A4) ●────────────────────── ENGINE BLOCK GROUND  │    │   │
│    │  │   KEY (A5) ●───────────────────────── IGNITION KEY SWITCH  │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ CRANKSHAFT/CAMSHAFT SENSORS                                 │    │   │
│    │  │                                                              │    │   │
│    │  │   CRK+ (B1) ●───────────┐    ┌──────────────────┐          │    │   │
│    │  │   CRK- (B2) ●───────────┼────┤  CRANKSHAFT MPU  │          │    │   │
│    │  │                         │    │  60-2 tooth wheel │          │    │   │
│    │  │   CAM+ (B3) ●───────────┼────┤──────────────────┤          │    │   │
│    │  │   CAM- (B4) ●───────────┘    │  CAMSHAFT SENSOR │          │    │   │
│    │  │                              │  Reference pulse  │          │    │   │
│    │  │                              └──────────────────┘          │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ V-ACT COMMON RAIL SYSTEM                                    │    │   │
│    │  │                                                              │    │   │
│    │  │   FRP (B13) ●────────────── Fuel Rail Pressure (0-2000bar) │    │   │
│    │  │                                                              │    │   │
│    │  │         ┌─────────────────────────────────────────────┐     │    │   │
│    │  │   INJ1 ─┤                HIGH PRESSURE RAIL            │     │    │   │
│    │  │   INJ2 ─┤         ┌───┐  ┌───┐  ┌───┐  ┌───┐        │     │    │   │
│    │  │   INJ3 ─┼─────────┤ 1 ├──┤ 2 ├──┤ 3 ├──┤ 4 ├────────│     │    │   │
│    │  │   INJ4 ─┤         └─┬─┘  └─┬─┘  └─┬─┘  └─┬─┘        │     │    │   │
│    │  │         │           │      │      │      │          │     │    │   │
│    │  │         │         [CYL1] [CYL2] [CYL3] [CYL4]       │     │    │   │
│    │  │         └─────────────────────────────────────────────┘     │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    │                                                                     │   │
│    │  ┌────────────────────────────────────────────────────────────┐    │   │
│    │  │ EGR SYSTEM (V-ACT)                                          │    │   │
│    │  │                                                              │    │   │
│    │  │   EGR (B20) ●──────────────── EGR Valve Position           │    │   │
│    │  │   EGR_PWM ●────────────────── EGR Actuator Control         │    │   │
│    │  │                                                              │    │   │
│    │  │       EXHAUST ══════════════════════════════════            │    │   │
│    │  │                     ║                                        │    │   │
│    │  │                ┌────╨────┐                                  │    │   │
│    │  │                │   EGR   │                                  │    │   │
│    │  │                │  VALVE  │                                  │    │   │
│    │  │                └────┬────┘                                  │    │   │
│    │  │                     ║                                        │    │   │
│    │  │       INTAKE  ══════╬══════════════════════════            │    │   │
│    │  └────────────────────────────────────────────────────────────┘    │   │
│    └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│    NOTES:                                                                    │
│    ─ All sensor shields terminate at ECM ground (A10)                        │
│    ─ CAN bus requires 120Ω termination at each end                          │
│    ─ Use Volvo specified torque for all connections                          │
└──────────────────────────────────────────────────────────────────────────────┘`,
    troubleshooting: {
      symptoms: [
        'Engine will not start',
        'Poor throttle response',
        'Excessive black smoke',
        'Engine surging at idle',
        'Reduced power output',
        'High fuel consumption',
        'EGR-related performance issues',
        'Controller communication faults'
      ],
      causes: [
        'Speed sensor signal loss',
        'Fuel system air leak or restriction',
        'EGR valve stuck open or closed',
        'Injector failure or clogged nozzle',
        'ECM software or calibration issue',
        'Wiring harness damage',
        'Turbocharger underperformance',
        'CAN bus communication fault'
      ],
      diagnosticSteps: [
        '1. Connect VODIA diagnostic software',
        '2. Read all active and stored fault codes',
        '3. Review fault freeze-frame data',
        '4. Check ECM supply voltage (18-32V)',
        '5. Verify sensor readings against specification',
        '6. Test EGR valve operation manually',
        '7. Monitor fuel rail pressure at idle and load',
        '8. Check crankshaft sensor signal integrity',
        '9. Perform injector balance test',
        '10. Verify CAN bus communication'
      ],
      solutions: [
        'Replace faulty speed sensors',
        'Repair fuel system leaks, replace filters',
        'Clean or replace EGR valve',
        'Replace failed injectors',
        'Update ECM software/calibration',
        'Repair harness with genuine parts',
        'Service or replace turbocharger',
        'Correct CAN bus wiring/termination'
      ],
      tools: [
        'VODIA (Volvo Diagnostic Application)',
        'Volvo diagnostic adapter',
        'Digital multimeter',
        'Oscilloscope',
        'Fuel pressure gauge (0-2500 bar)',
        'EGR test equipment',
        'CAN bus analyzer'
      ]
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'VP-001', description: 'EMS2 Communication Timeout', severity: 'Critical' },
          { code: 'VP-002', description: 'Crankshaft Position Fault', severity: 'Critical' },
          { code: 'VP-003', description: 'Fuel Rail Pressure Error', severity: 'Warning' },
          { code: 'VP-004', description: 'EGR System Malfunction', severity: 'Warning' },
          { code: 'VP-005', description: 'Injector Circuit Fault', severity: 'Warning' }
        ]
      },
      {
        controller: 'ComAp',
        codes: [
          { code: 'E-VP-01', description: 'CAN Communication Lost', severity: 'Critical' },
          { code: 'E-VP-02', description: 'Engine Speed Signal Fault', severity: 'Critical' },
          { code: 'E-VP-03', description: 'V-ACT System Error', severity: 'Warning' },
          { code: 'E-VP-04', description: 'Boost Pressure Fault', severity: 'Warning' },
          { code: 'E-VP-05', description: 'ECM Internal Fault', severity: 'Critical' }
        ]
      }
    ],
    partNumbers: [
      { manufacturer: 'Volvo Penta', partNumber: '22170484', description: 'ECM Assembly - TAD1640-1660' },
      { manufacturer: 'Volvo Penta', partNumber: '22170485', description: 'ECM Assembly - TAD1340-1360' },
      { manufacturer: 'Volvo Penta', partNumber: '21489800', description: 'ECM Wiring Harness' },
      { manufacturer: 'Volvo Penta', partNumber: '88890300', description: 'VODIA Diagnostic Kit' },
      { manufacturer: 'Volvo Penta', partNumber: '21639667', description: 'CAN Termination Kit' }
    ],
    compatibleEngines: [
      'TAD1640GE', 'TAD1641GE', 'TAD1642GE', 'TAD1660GE',
      'TAD1340GE', 'TAD1341GE', 'TAD1342GE', 'TAD1360GE',
      'TAD1240GE', 'TAD1241GE', 'TAD1242GE'
    ]
  },
  {
    id: 'mtu-adec',
    name: 'MTU ADEC ECM (Series 4000)',
    manufacturer: 'MTU',
    category: 'diesel',
    description: [
      'The MTU ADEC (Advanced Diesel Engine Control) system represents the pinnacle of large diesel engine management technology, specifically engineered for the MTU Series 4000 engines that power generators from 1,000 kW to 4,300 kW. This sophisticated electronic control architecture employs a distributed processing approach with multiple interconnected ECM modules that collectively manage fuel injection, air management, engine protection, and diagnostic functions. The ADEC system processes thousands of inputs per second while coordinating up to 20 individual injector actuators.',
      'Distinguished by its redundant design philosophy, the ADEC system incorporates dual-channel control paths with automatic failover capability. Should the primary control channel detect an internal fault, control seamlessly transfers to the backup channel without engine shutdown. This reliability feature is critical for mission-critical power applications including hospitals, data centers, and utility peaking plants. The system achieves fuel consumption rates below 200 g/kWh while meeting the most stringent global emissions standards.',
      'The ADEC ECM modules feature aerospace-grade construction with hermetically sealed housings, military-specification connectors, and triple-redundant power supply circuits. Operating temperature range extends from -40°C to +120°C with shock resistance exceeding 100G. Each module incorporates 128MB of non-volatile storage for comprehensive data logging including performance trends, maintenance history, and detailed fault diagnostics. Remote monitoring via MTU Mobile enables 24/7 engine surveillance from any location.'
    ],
    workingPrinciple: [
      'The ADEC system utilizes a master-slave architecture where the primary Engine Control Module (ECM-A) coordinates overall engine operation while subsidiary modules handle specific subsystems. The ECM-A processes high-speed signals from crankshaft and camshaft sensors to calculate precise injection timing for each cylinder. Individual Injection Control Modules (ICM) receive timing commands via dedicated CAN bus and generate the high-current driver signals for HEUI or unit injector actuators.',
      'Fuel quantity and timing calculations employ sophisticated model-based algorithms that consider over 100 input variables including ambient conditions, fuel properties, engine age compensation, and real-time combustion feedback from cylinder pressure sensors. The ADEC system adjusts injection parameters cylinder-by-cylinder to maintain optimal combustion balance, resulting in reduced thermal stress and extended engine life. Adaptive learning continuously refines control parameters based on long-term performance trends.',
      'Engine protection is implemented through a three-tier monitoring hierarchy. Primary monitoring runs on dedicated hardware watchdog circuits that operate independently of main processor function. Secondary monitoring executes within the main control software, comparing measured parameters against dynamic operating envelopes. Tertiary monitoring uses pattern recognition to detect abnormal behavior that might escape conventional threshold-based detection. Protection responses are precisely graduated from subtle power deration to immediate shutdown depending on fault severity.'
    ],
    installation: [
      'ADEC ECM installation requires careful attention to the distributed module architecture. The primary ECM-A mounts in a climate-controlled panel or enclosure maintaining ambient temperature below 55°C. Injection Control Modules mount near their respective cylinder banks to minimize high-current cable lengths. All modules require vibration-isolated mounting using MTU-approved hardware. Cooling airflow of at least 0.5 m³/min must be provided for each module.',
      'Inter-module communication uses dedicated CAN bus networks with precise termination requirements. The primary CAN backbone operates at 500 kbps with 120Ω termination at each end segment. Secondary injector CAN runs at 1 Mbps due to time-critical injection control messages. All CAN cables must be twisted-pair shielded construction with shields grounded at the ECM end only. Maximum cable length from ECM-A to furthest ICM is 15 meters.',
      'System commissioning requires MTU Diasys diagnostic platform connected via dedicated service interface. Install the specific calibration dataset matching engine serial number and application. Perform automated sensor calibration procedures including throttle position, fuel rail pressure, and cylinder pressure transducers. Execute full engine test sequence with step load application to verify control response. Enable remote monitoring connectivity and verify communication with MTU Operations Center.'
    ],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Current Draw (ECM-A)': '5.5A maximum',
      'Current Draw (ICM)': '2.5A per module',
      'Processor': 'Dual 32-bit @ 600MHz',
      'Memory': '128MB Flash, 16MB RAM',
      'Operating Temperature': '-40°C to +120°C',
      'Storage Temperature': '-55°C to +150°C',
      'Shock Resistance': '100G, 6ms',
      'Protection Rating': 'IP69K',
      'Weight (ECM-A)': '3.8 kg',
      'Dimensions (ECM-A)': '350 x 250 x 85 mm',
      'Communication': 'CAN 2.0B (500k/1M), Ethernet, MTU ProLink'
    },
    pinout: `
┌─────────────────────────────────────────────────────────────────┐
│                MTU ADEC ECM-A - 154 PIN CONNECTOR               │
│                    AMPHENOL MILITARYSPEC                         │
├─────────────────────────────────────────────────────────────────┤
│  POWER SECTION (Pins P1-P20)                                    │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ P1 │ P2 │ P3 │ P4 │ P5 │ P6 │ P7 │ P8 │ P9 │P10 │           │
│  │VB+1│VB+2│VB+3│GND1│GND2│GND3│KEY │AUX1│AUX2│STBY│           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  ENGINE SENSORS (Pins S1-S50)                                   │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ S1 │ S2 │ S3 │ S4 │ S5 │ S6 │ S7 │ S8 │ S9 │S10 │           │
│  │CRK1│CRK1│CRK2│CRK2│CAM1│CAM1│CAM2│CAM2│CYL1│CYL2│           │
│  │ +  │ -  │ +  │ -  │ +  │ -  │ +  │ -  │ P  │ P  │           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │S11 │S12 │S13 │S14 │S15 │S16 │S17 │S18 │S19 │S20 │           │
│  │CYL3│CYL4│CYL5│CYL6│CYL7│CYL8│ECT1│ECT2│IAT1│IAT2│           │
│  │ P  │ P  │ P  │ P  │ P  │ P  │    │    │    │    │           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  CAN NETWORKS (Pins C1-C20)                                     │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐           │
│  │ C1 │ C2 │ C3 │ C4 │ C5 │ C6 │ C7 │ C8 │ C9 │C10 │           │
│  │CAN1│CAN1│CAN2│CAN2│CAN3│CAN3│CAN4│CAN4│ETH+│ETH-│           │
│  │ H  │ L  │ H  │ L  │ H  │ L  │ H  │ L  │    │    │           │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘           │
│                                                                  │
│  Note: Injector outputs on separate ICM modules                 │
└─────────────────────────────────────────────────────────────────┘`,
    wiringDiagram: `
┌──────────────────────────────────────────────────────────────────────────────┐
│                       MTU ADEC SYSTEM ARCHITECTURE                           │
│                         Series 4000 Generator Set                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌──────────────────────────────────────────────────────────────────┐      │
│    │                    GENERATOR CONTROL PANEL                        │      │
│    │                     (DSE/Woodward/MTU)                           │      │
│    └──────────────────────────────┬───────────────────────────────────┘      │
│                                   │ J1939 CAN                                │
│                                   ▼                                          │
│    ┌──────────────────────────────────────────────────────────────────┐      │
│    │                         ECM-A (MASTER)                            │      │
│    │    ┌──────────────────────────────────────────────────────────┐ │      │
│    │    │                    Main Processor                         │ │      │
│    │    │   ┌─────────┐    ┌─────────┐    ┌─────────┐              │ │      │
│    │    │   │ Engine  │    │ Fuel    │    │ Safety  │              │ │      │
│    │    │   │ Control │    │ Control │    │ Monitor │              │ │      │
│    │    │   └────┬────┘    └────┬────┘    └────┬────┘              │ │      │
│    │    │        └──────────────┴──────────────┘                    │ │      │
│    │    │                       │                                    │ │      │
│    │    │    ┌──────────────────┴──────────────────┐                │ │      │
│    │    │    │      INTERNAL CAN BACKBONE          │                │ │      │
│    │    └────┴──────────────────────────────────────┴────────────────┘ │      │
│    └─────────────────────────────┬────────────────────────────────────┘      │
│                                  │                                           │
│           ┌──────────────────────┼──────────────────────┐                    │
│           │                      │                      │                    │
│           ▼                      ▼                      ▼                    │
│    ┌────────────┐         ┌────────────┐         ┌────────────┐             │
│    │   ICM-A    │         │   ICM-B    │         │   ICM-C    │             │
│    │ (Bank A)   │         │ (Bank B)   │         │ (Bank C)   │             │
│    │ Cyl 1-4    │         │ Cyl 5-8    │         │ Cyl 9-12   │             │
│    └─────┬──────┘         └─────┬──────┘         └─────┬──────┘             │
│          │                      │                      │                     │
│    ┌─────┴─────┐          ┌─────┴─────┐          ┌─────┴─────┐              │
│    │ Injectors │          │ Injectors │          │ Injectors │              │
│    │   1-4     │          │   5-8     │          │   9-12    │              │
│    └───────────┘          └───────────┘          └───────────┘              │
│                                                                               │
│    ┌──────────────────────────────────────────────────────────────────┐      │
│    │                     ENGINE SENSOR NETWORK                         │      │
│    │                                                                    │      │
│    │    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │      │
│    │    │CRANKSHAFT│ │CAMSHAFT │  │CYLINDER │  │BOOST    │           │      │
│    │    │ SENSOR  │  │SENSORS  │  │PRESSURE │  │PRESSURE │           │      │
│    │    │(Redundant)│ │(x2)     │  │(1-12)   │  │(x2)     │           │      │
│    │    └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │      │
│    │         └────────────┴────────────┴────────────┘                 │      │
│    │                         │                                         │      │
│    │                    TO ECM-A SENSOR INPUTS                        │      │
│    └──────────────────────────────────────────────────────────────────┘      │
│                                                                               │
│    REDUNDANCY FEATURES:                                                      │
│    ═══════════════════                                                       │
│    - Dual crankshaft sensors with automatic failover                         │
│    - Dual camshaft sensors per bank                                          │
│    - Dual boost pressure sensors                                              │
│    - Dual coolant temperature sensors                                         │
│    - ECM-A has internal backup processor channel                              │
└──────────────────────────────────────────────────────────────────────────────┘`,
    troubleshooting: {
      symptoms: [
        'Engine fails to start or extended cranking',
        'Cylinder imbalance detected',
        'Power derate condition active',
        'Excessive smoke at all loads',
        'Abnormal combustion noise',
        'ICM communication fault',
        'MTU Mobile remote fault alert',
        'Sudden engine shutdown'
      ],
      causes: [
        'Crankshaft sensor failure or contamination',
        'Cylinder pressure sensor fault',
        'ICM internal failure or overheating',
        'Injector solenoid or nozzle failure',
        'CAN bus network integrity issue',
        'ECM-A channel switchover event',
        'Fuel quality or supply problem',
        'Turbocharger system fault'
      ],
      diagnosticSteps: [
        '1. Connect MTU Diasys diagnostic platform',
        '2. Review fault log for active and stored codes',
        '3. Analyze trend data for affected parameters',
        '4. Check ECM power supply: all three B+ pins',
        '5. Verify CAN network integrity with analyzer',
        '6. Review cylinder pressure traces for anomalies',
        '7. Test ICM communication on dedicated CAN',
        '8. Perform injector response test',
        '9. Check fuel system pressures at all stages',
        '10. Review MTU Mobile remote log data'
      ],
      solutions: [
        'Replace crankshaft/camshaft sensors',
        'Replace cylinder pressure transducer',
        'Replace failed ICM module',
        'Replace injector assembly',
        'Repair CAN network wiring/termination',
        'Replace ECM-A if primary channel failed',
        'Verify fuel quality, replace filters',
        'Service turbocharger system',
        'Update ADEC software to latest version'
      ],
      tools: [
        'MTU Diasys diagnostic platform',
        'MTU Communication Interface',
        'CAN bus protocol analyzer',
        'High-impedance oscilloscope',
        'Cylinder pressure analyzer',
        'Fuel system pressure test kit',
        'ICM test harness',
        'MTU Mobile app for remote data'
      ]
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'MTU-001', description: 'ADEC Communication Timeout', severity: 'Critical' },
          { code: 'MTU-002', description: 'ECM-A Channel Failover', severity: 'Warning' },
          { code: 'MTU-003', description: 'ICM Communication Lost', severity: 'Critical' },
          { code: 'MTU-004', description: 'Cylinder Imbalance Detected', severity: 'Warning' },
          { code: 'MTU-005', description: 'Power Derate Active', severity: 'Warning' }
        ]
      },
      {
        controller: 'Woodward',
        codes: [
          { code: 'W-MTU-01', description: 'ADEC CAN Fault', severity: 'Critical' },
          { code: 'W-MTU-02', description: 'Engine Speed Signal Lost', severity: 'Critical' },
          { code: 'W-MTU-03', description: 'Cylinder Pressure Fault', severity: 'Warning' },
          { code: 'W-MTU-04', description: 'Injector Driver Fault', severity: 'Warning' },
          { code: 'W-MTU-05', description: 'Turbo System Error', severity: 'Warning' }
        ]
      }
    ],
    partNumbers: [
      { manufacturer: 'MTU', partNumber: 'X00045883', description: 'ECM-A Assembly - Series 4000' },
      { manufacturer: 'MTU', partNumber: 'X00045884', description: 'ICM Module - Injection Control' },
      { manufacturer: 'MTU', partNumber: 'X00043221', description: 'ADEC Wiring Harness - Main' },
      { manufacturer: 'MTU', partNumber: 'X00040156', description: 'CAN Network Cable Set' },
      { manufacturer: 'MTU', partNumber: 'A0009974312', description: 'Diasys Interface Adapter' }
    ],
    compatibleEngines: [
      '8V4000G23', '8V4000G63', '12V4000G23', '12V4000G63',
      '16V4000G23', '16V4000G63', '20V4000G23', '20V4000G63'
    ]
  }
];

export default function ECMDiagnosticsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedECM, setSelectedECM] = useState<ECMEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'troubleshooting' | 'wiring' | 'faults'>('overview');

  const manufacturers = ['all', ...Array.from(new Set(ecmDatabase.map(e => e.manufacturer)))];

  const filteredECMs = ecmDatabase.filter(ecm => {
    const matchesSearch = ecm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ecm.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ecm.compatibleEngines.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesManufacturer = selectedManufacturer === 'all' || ecm.manufacturer === selectedManufacturer;
    return matchesSearch && matchesManufacturer;
  });

  const exportToPDF = () => {
    if (!selectedECM) return;

    const content = `
      <html>
        <head>
          <title>${selectedECM.name} - Technical Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1a1a2e; border-bottom: 3px solid #f59e0b; }
            h2 { color: #2d3748; margin-top: 30px; }
            pre { background: #f5f5f5; padding: 20px; overflow-x: auto; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #1a1a2e; color: white; }
            .section { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>${selectedECM.name}</h1>
          <p><strong>Manufacturer:</strong> ${selectedECM.manufacturer}</p>
          <p><strong>Compatible Engines:</strong> ${selectedECM.compatibleEngines.join(', ')}</p>

          <div class="section">
            <h2>Description</h2>
            ${selectedECM.description.map(p => `<p>${p}</p>`).join('')}
          </div>

          <div class="section">
            <h2>Working Principle</h2>
            ${selectedECM.workingPrinciple.map(p => `<p>${p}</p>`).join('')}
          </div>

          <div class="section">
            <h2>Installation Guide</h2>
            ${selectedECM.installation.map(p => `<p>${p}</p>`).join('')}
          </div>

          <div class="section">
            <h2>Specifications</h2>
            <table>
              <tr><th>Parameter</th><th>Value</th></tr>
              ${Object.entries(selectedECM.specifications).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
            </table>
          </div>

          <div class="section">
            <h2>Pinout Diagram</h2>
            <pre>${selectedECM.pinout}</pre>
          </div>

          <div class="section">
            <h2>Wiring Diagram</h2>
            <pre>${selectedECM.wiringDiagram}</pre>
          </div>

          <div class="section">
            <h2>Troubleshooting Guide</h2>
            <h3>Symptoms</h3>
            <ul>${selectedECM.troubleshooting.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
            <h3>Possible Causes</h3>
            <ul>${selectedECM.troubleshooting.causes.map(c => `<li>${c}</li>`).join('')}</ul>
            <h3>Diagnostic Steps</h3>
            <ol>${selectedECM.troubleshooting.diagnosticSteps.map(s => `<li>${s}</li>`).join('')}</ol>
            <h3>Solutions</h3>
            <ul>${selectedECM.troubleshooting.solutions.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>

          <div class="section">
            <h2>Fault Codes</h2>
            ${selectedECM.faultCodes.map(fc => `
              <h3>${fc.controller} Controller</h3>
              <table>
                <tr><th>Code</th><th>Description</th><th>Severity</th></tr>
                ${fc.codes.map(c => `<tr><td>${c.code}</td><td>${c.description}</td><td>${c.severity}</td></tr>`).join('')}
              </table>
            `).join('')}
          </div>

          <div class="section">
            <h2>Part Numbers</h2>
            <table>
              <tr><th>Manufacturer</th><th>Part Number</th><th>Description</th></tr>
              ${selectedECM.partNumbers.map(p => `<tr><td>${p.manufacturer}</td><td>${p.partNumber}</td><td>${p.description}</td></tr>`).join('')}
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            ECM Diagnostics Center
          </h2>
          <p className="text-gray-400 mt-1">
            Engine Control Module diagnostics for all major generator brands
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            {manufacturers.map(m => (
              <option key={m} value={m}>
                {m === 'all' ? 'All Manufacturers' : m}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search ECM or engine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-64"
          />
        </div>
      </div>

      {/* ECM Grid */}
      {!selectedECM ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredECMs.map((ecm) => (
            <motion.div
              key={ecm.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedECM(ecm)}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 cursor-pointer hover:border-brand-gold/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{ecm.name}</h3>
                  <p className="text-brand-gold">{ecm.manufacturer}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  ecm.category === 'diesel' ? 'bg-orange-500/20 text-orange-400' :
                  ecm.category === 'gas' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {ecm.category}
                </span>
              </div>

              <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                {ecm.description[0].substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-2">
                {ecm.compatibleEngines.slice(0, 4).map((engine, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                    {engine}
                  </span>
                ))}
                {ecm.compatibleEngines.length > 4 && (
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                    +{ecm.compatibleEngines.length - 4} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900 rounded-xl border border-gray-700"
          >
            {/* Detail Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedECM(null)}
                    className="text-gray-400 hover:text-white mb-2 flex items-center gap-2"
                  >
                    ← Back to ECM List
                  </button>
                  <h2 className="text-2xl font-bold text-white">{selectedECM.name}</h2>
                  <p className="text-brand-gold">{selectedECM.manufacturer}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-brand-gold text-black font-semibold rounded-lg hover:bg-yellow-400"
                  >
                    Export PDF
                  </button>
                  <a
                    href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi! I need help with ${selectedECM.name} ECM diagnostics`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500"
                  >
                    Get Support
                  </a>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-6">
                {(['overview', 'troubleshooting', 'wiring', 'faults'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize ${
                      activeTab === tab
                        ? 'bg-brand-gold text-black'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                    <div className="space-y-4 text-gray-300">
                      {selectedECM.description.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Working Principle */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Working Principle</h3>
                    <div className="space-y-4 text-gray-300">
                      {selectedECM.workingPrinciple.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Installation */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Installation Guide</h3>
                    <div className="space-y-4 text-gray-300">
                      {selectedECM.installation.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedECM.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-400">{key}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compatible Engines */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Compatible Engines</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedECM.compatibleEngines.map((engine, idx) => (
                        <span key={idx} className="px-3 py-2 bg-gray-800 rounded-lg text-gray-300">
                          {engine}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Part Numbers */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Part Numbers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 text-gray-400">Manufacturer</th>
                            <th className="text-left py-3 text-gray-400">Part Number</th>
                            <th className="text-left py-3 text-gray-400">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedECM.partNumbers.map((part, idx) => (
                            <tr key={idx} className="border-b border-gray-800">
                              <td className="py-3 text-white">{part.manufacturer}</td>
                              <td className="py-3 text-brand-gold font-mono">{part.partNumber}</td>
                              <td className="py-3 text-gray-300">{part.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'troubleshooting' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-4">Common Symptoms</h3>
                    <ul className="space-y-2">
                      {selectedECM.troubleshooting.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-red-400">⚠</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">Possible Causes</h3>
                    <ul className="space-y-2">
                      {selectedECM.troubleshooting.causes.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-yellow-400">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Diagnostic Steps</h3>
                    <ol className="space-y-2">
                      {selectedECM.troubleshooting.diagnosticSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-blue-400 font-mono w-6">{idx + 1}.</span>
                          {step.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Solutions</h3>
                    <ul className="space-y-2">
                      {selectedECM.troubleshooting.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-green-400">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Required Tools</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedECM.troubleshooting.tools.map((tool, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                          <span className="text-purple-400">🔧</span>
                          <span className="text-gray-300">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wiring' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Pinout Diagram</h3>
                    <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-green-400 text-xs font-mono">
                      {selectedECM.pinout}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Wiring Diagram</h3>
                    <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-cyan-400 text-xs font-mono">
                      {selectedECM.wiringDiagram}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'faults' && (
                <div className="space-y-6">
                  {selectedECM.faultCodes.map((fc, idx) => (
                    <div key={idx}>
                      <h3 className="text-xl font-bold text-white mb-4">{fc.controller} Controller Codes</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 text-gray-400">Code</th>
                              <th className="text-left py-3 text-gray-400">Description</th>
                              <th className="text-left py-3 text-gray-400">Severity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fc.codes.map((code, cIdx) => (
                              <tr key={cIdx} className="border-b border-gray-800">
                                <td className="py-3 text-brand-gold font-mono">{code.code}</td>
                                <td className="py-3 text-white">{code.description}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    code.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    code.severity === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {code.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
