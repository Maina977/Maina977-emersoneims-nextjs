'use client';

/**
 * COMPREHENSIVE SENSOR DIAGNOSTICS PANEL
 * Complete sensor library for all generator types with troubleshooting,
 * repair procedures, and schematic diagrams
 *
 * Coverage: DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom controllers
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== SENSOR TYPES ====================
type SensorCategory = 'temperature' | 'pressure' | 'speed' | 'level' | 'electrical' | 'position' | 'flow' | 'vibration';

interface SensorData {
  id: string;
  name: string;
  category: SensorCategory;
  type: string;
  range: string;
  output: string;
  accuracy: string;
  applications: string[];
  compatibleControllers: string[];
  description: string[];
  workingPrinciple: string[];
  installation: string[];
  troubleshooting: TroubleshootingStep[];
  faultCodes: FaultCode[];
  schematic: SchematicData;
  specifications: Record<string, string>;
  commonFailures: string[];
  testProcedure: string[];
  replacementInterval: string;
  partNumbers: PartNumber[];
}

interface TroubleshootingStep {
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  solution: string[];
  tools: string[];
}

interface FaultCode {
  code: string;
  controller: string;
  description: string;
  severity: 'warning' | 'shutdown' | 'critical';
}

interface SchematicData {
  ascii: string;
  pinout: string;
  wiring: string;
}

interface PartNumber {
  brand: string;
  oem: string;
  aftermarket: string[];
}

// ==================== COMPREHENSIVE SENSOR DATABASE ====================
const SENSOR_DATABASE: SensorData[] = [
  // ==================== TEMPERATURE SENSORS ====================
  {
    id: 'coolant-temp-ntc',
    name: 'Coolant Temperature Sensor (NTC Thermistor)',
    category: 'temperature',
    type: 'NTC Thermistor',
    range: '-40°C to +150°C',
    output: 'Variable Resistance (10kΩ @ 25°C)',
    accuracy: '±1°C',
    applications: ['Diesel Generators', 'Gas Generators', 'Marine Gensets', 'Industrial Power Plants'],
    compatibleControllers: ['DSE 7320', 'DSE 7310', 'DSE 6020', 'ComAp InteliGen', 'Woodward easYgen', 'SmartGen HGM', 'PowerWizard'],
    description: [
      `The Negative Temperature Coefficient (NTC) thermistor is the most widely used temperature sensing element in diesel and gas generator applications. Unlike traditional RTD sensors, NTC thermistors exhibit a decrease in electrical resistance as temperature increases, following an exponential curve defined by the Steinhart-Hart equation. This characteristic makes them ideal for engine coolant temperature monitoring where rapid response times and high sensitivity are critical for protecting the engine from thermal damage.`,

      `In generator control systems, the coolant temperature sensor serves multiple functions beyond simple temperature display. Modern controllers like the DSE 7320 and ComAp InteliGen use coolant temperature data for cold-start fuel enrichment calculations, cooling fan activation thresholds, load acceptance delays, and emergency shutdown protection. The sensor typically threads into the cylinder head water jacket or thermostat housing, positioned to measure the hottest coolant temperature before it enters the radiator. For accurate readings, the sensor tip must be fully immersed in the coolant flow path, and air pockets must be eliminated during installation.`,

      `Proper sensor selection requires matching the resistance-temperature curve to the controller's input characteristics. Most DSE controllers expect a 10kΩ @ 25°C sensor with a B-value (beta coefficient) between 3380K and 3950K. Using sensors with incorrect characteristics will result in inaccurate temperature readings, potentially causing false alarms or failure to detect genuine overheating conditions. The sensor's response time (typically 3-10 seconds in still oil, 1-3 seconds in flowing water) affects how quickly the controller can react to sudden temperature changes, which is critical during rapid load acceptance or cooling system failures.`
    ],
    workingPrinciple: [
      `The NTC thermistor operates on the principle of semiconductor conductivity variation with temperature. The sensing element consists of metal oxide compounds (typically manganese, nickel, cobalt, and copper oxides) sintered at high temperatures to form a ceramic semiconductor. As temperature increases, more charge carriers are thermally excited from the valence band to the conduction band, increasing conductivity and reducing resistance.`,

      `The relationship between resistance and temperature follows the equation: R(T) = R₀ × exp[B × (1/T - 1/T₀)], where R₀ is the reference resistance at temperature T₀ (usually 25°C = 298.15K), B is the material constant (beta value), and T is the absolute temperature in Kelvin. This exponential characteristic provides excellent sensitivity in the operating range but requires linearization in the controller software for accurate temperature calculation.`,

      `Generator controllers typically apply a constant current (1-5mA) through the thermistor and measure the voltage drop to calculate resistance. Advanced controllers like the DSE 7320 incorporate multiple linearization points stored in firmware, allowing them to accurately interpret readings from various sensor types. The controller compares the calculated temperature against programmed setpoints for warning, pre-alarm, and shutdown thresholds.`
    ],
    installation: [
      `Before installation, verify the sensor thread size matches the engine's sensor boss (common sizes: M14×1.5, M16×1.5, 1/4" NPT, 3/8" NPT). Apply thread sealant rated for the expected temperature range—avoid using PTFE tape alone as it can contaminate the coolant system. For generators with aluminum cylinder heads, use anti-seize compound on the threads to prevent galvanic corrosion and future removal difficulties.`,

      `Torque the sensor to manufacturer specifications (typically 20-25 Nm for M14 sensors) to ensure proper thermal contact without damaging the threads. Over-tightening can crack the ceramic sensing element or strip the threads in aluminum heads. The sensor's electrical connector should face away from heat sources and vibration-prone areas. Use shielded cable for runs exceeding 2 meters to prevent electromagnetic interference from affecting readings.`,

      `After installation, bleed the cooling system completely to eliminate air pockets around the sensor. Air trapped near the sensor will cause intermittent high-temperature readings and erratic behavior. Start the engine and allow it to reach operating temperature while monitoring the sensor reading. Verify the reading matches an infrared thermometer measurement at the thermostat housing within ±3°C.`
    ],
    troubleshooting: [
      {
        symptom: 'High temperature warning with engine running cool',
        possibleCauses: [
          'Open circuit in sensor wiring',
          'Corroded connector pins',
          'Sensor element damaged (cracked ceramic)',
          'Incorrect sensor type installed',
          'Controller input circuit fault'
        ],
        diagnosticSteps: [
          'Disconnect sensor and measure resistance with multimeter (should be ~2.5kΩ at 80°C)',
          'Check wiring continuity from sensor to controller terminals',
          'Inspect connector for corrosion, bent pins, or moisture ingress',
          'Verify sensor part number matches controller requirements',
          'Substitute known-good sensor to isolate fault'
        ],
        solution: [
          'Replace sensor if resistance out of specification',
          'Repair or replace damaged wiring harness',
          'Clean and apply dielectric grease to connectors',
          'Configure controller for correct sensor type',
          'Replace controller input module if fault persists'
        ],
        tools: ['Digital Multimeter', 'Infrared Thermometer', 'Dielectric Grease', 'Wire Strippers', 'Torque Wrench']
      },
      {
        symptom: 'Temperature reading stays at minimum value',
        possibleCauses: [
          'Short circuit in sensor wiring',
          'Sensor grounded to engine block',
          'Water ingress in connector',
          'Sensor element failed short',
          'Controller ground reference fault'
        ],
        diagnosticSteps: [
          'Measure sensor resistance (should NOT be near 0Ω)',
          'Check insulation resistance between sensor wire and ground',
          'Inspect wiring for chafing against engine components',
          'Remove connector and check for water/coolant inside',
          'Measure voltage between sensor input and ground at controller'
        ],
        solution: [
          'Replace shorted sensor',
          'Repair insulation damage and reroute wiring away from sharp edges',
          'Dry connector and seal with weatherpack grease',
          'Wrap harness with protective conduit in high-wear areas',
          'Verify controller ground connections are clean and tight'
        ],
        tools: ['Megohmmeter', 'Digital Multimeter', 'Heat Shrink Tubing', 'Split Conduit', 'Weatherpack Grease']
      },
      {
        symptom: 'Erratic temperature readings',
        possibleCauses: [
          'Intermittent connection in harness',
          'EMI/RFI interference on signal wires',
          'Poor ground reference',
          'Air pocket around sensor',
          'Sensor partially unseated from boss'
        ],
        diagnosticSteps: [
          'Wiggle harness while monitoring live reading for fluctuations',
          'Route sensor wires away from alternator and ignition components',
          'Verify ground strap from engine to chassis is intact',
          'Bleed cooling system and verify sensor immersion',
          'Check sensor torque and reseat if loose'
        ],
        solution: [
          'Replace harness or repair intermittent connections',
          'Install shielded cable with shield grounded at controller end only',
          'Clean and tighten all ground connections',
          'Completely flush and refill cooling system',
          'Retorque sensor and verify proper sealing'
        ],
        tools: ['Oscilloscope', 'Shielded Cable', 'Ground Strap', 'Coolant Flush Kit', 'Torque Wrench']
      }
    ],
    faultCodes: [
      { code: 'DSE 0402', controller: 'DSE 7320/7310', description: 'Coolant Temperature Sender Open Circuit', severity: 'warning' },
      { code: 'DSE 0403', controller: 'DSE 7320/7310', description: 'Coolant Temperature Sender Short Circuit', severity: 'warning' },
      { code: 'DSE 0404', controller: 'DSE 7320/7310', description: 'High Engine Temperature Warning', severity: 'warning' },
      { code: 'DSE 0405', controller: 'DSE 7320/7310', description: 'High Engine Temperature Shutdown', severity: 'shutdown' },
      { code: 'InteliGen 1108', controller: 'ComAp InteliGen', description: 'Water Temperature Sensor Failure', severity: 'warning' },
      { code: 'InteliGen 1109', controller: 'ComAp InteliGen', description: 'Water Temperature High', severity: 'shutdown' },
      { code: 'HGM 45', controller: 'SmartGen HGM6120/7220', description: 'Water Temp Sensor Open', severity: 'warning' },
      { code: 'HGM 46', controller: 'SmartGen HGM6120/7220', description: 'Water Temp Sensor Short', severity: 'warning' },
      { code: 'PW E361', controller: 'PowerWizard 1.0/2.0', description: 'Coolant Temp Circuit Malfunction', severity: 'warning' },
      { code: 'E3200', controller: 'Woodward easYgen', description: 'Coolant Temperature Sensor Fault', severity: 'warning' }
    ],
    schematic: {
      ascii: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COOLANT TEMPERATURE SENSOR CIRCUIT                        │
│                         NTC Thermistor Wiring                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ENGINE BLOCK                           CONTROLLER                         │
│    ┌──────────┐                          ┌──────────────┐                   │
│    │          │                          │              │                   │
│    │  ┌────┐  │    SHIELDED CABLE       │   TEMP IN ●──┤← Brown Wire      │
│    │  │ R  │  │    ════════════════     │              │  (0.75mm²)        │
│    │  │ th │◄─┼────● Signal ───────────►│──●           │                   │
│    │  │    │  │        (Brown)          │   (Pin 12)   │                   │
│    │  └─┬──┘  │                         │              │                   │
│    │    │     │    ════════════════     │   GND ●──────┤← Brown/White     │
│    │    └─────┼────● Return ───────────►│──●           │  (0.75mm²)        │
│    │          │        (Brown/White)    │   (Pin 13)   │                   │
│    │          │                         │              │                   │
│    │    ┌─────┼────● Shield ──┐        │   SHIELD ●───┤← Gray Drain      │
│    │    │     │    (Gray)     │        │   (Pin SH)   │  (0.5mm²)         │
│    │    ▼     │               │        │              │                   │
│    │   GND    │               └────────┤──●           │                   │
│    │   (Engine│                        │              │                   │
│    │    Block)│                        └──────────────┘                   │
│    └──────────┘                                                           │
│                                                                              │
│    SENSOR SPECIFICATIONS:                                                    │
│    ├─ Type: NTC Thermistor (Negative Temperature Coefficient)               │
│    ├─ Resistance @ 25°C: 10,000Ω (10kΩ)                                     │
│    ├─ Resistance @ 80°C: 2,500Ω (2.5kΩ)                                     │
│    ├─ Resistance @ 100°C: 1,500Ω (1.5kΩ)                                    │
│    ├─ Beta Value (B25/85): 3380K - 3950K                                    │
│    └─ Operating Range: -40°C to +150°C                                      │
│                                                                              │
│    RESISTANCE vs TEMPERATURE CURVE:                                         │
│                                                                              │
│    Resistance (kΩ)                                                          │
│    │                                                                         │
│    50┤ ●                                                                     │
│    40┤  ●                                                                    │
│    30┤   ●                                                                   │
│    20┤    ●●                                                                 │
│    10┤      ●●●                                                              │
│     5┤         ●●●●                                                          │
│     2┤             ●●●●●●●                                                   │
│     1┤                   ●●●●●●●●●●●                                         │
│     └┼──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬─ Temperature (°C)                      │
│       0  20 40 60 80 100 120 140                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SENSOR CONNECTOR PINOUT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    2-PIN PACKARD CONNECTOR (Common DSE/ComAp)                               │
│    ┌───────────┐                                                            │
│    │  ●     ●  │   Pin 1: Signal (Brown) → Controller TEMP input           │
│    │  1     2  │   Pin 2: Ground (Brown/White) → Controller GND            │
│    └───────────┘                                                            │
│                                                                              │
│    3-PIN DEUTSCH DT04-3P (Industrial/Marine)                                │
│    ┌───────────┐                                                            │
│    │  ●  ●  ●  │   Pin A: Signal → Controller TEMP input                   │
│    │  A  B  C  │   Pin B: Ground → Controller GND                          │
│    └───────────┘   Pin C: Shield → Controller Shield/Case Ground           │
│                                                                              │
│    WIRE COLOR CODES BY MANUFACTURER:                                        │
│    ├─ DSE: Brown (Signal), Brown/White (Ground)                             │
│    ├─ ComAp: Blue (Signal), Blue/White (Ground)                             │
│    ├─ Cummins/PowerWizard: Purple (Signal), Purple/White (Ground)           │
│    └─ CAT: Yellow (Signal), Yellow/Black (Ground)                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE WIRING INSTALLATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─────────┐         SHIELDED TWISTED PAIR            ┌──────────────┐   │
│    │ SENSOR  │         (0.75mm² / 18 AWG)               │ CONTROLLER   │   │
│    │         │                                          │              │   │
│    │ ┌─────┐ │    ┌─────────────────────────────────┐  │  ┌────────┐  │   │
│    │ │ NTC │─┼────┤ BROWN ●════════════════════●────┼──┼──┤ Pin 12 │  │   │
│    │ │     │ │    │         (Signal Wire)           │  │  │ TEMP   │  │   │
│    │ └──┬──┘ │    │                                 │  │  └────────┘  │   │
│    │    │    │    │ BROWN/WHITE ●══════════════●────┼──┼──┤ Pin 13 │  │   │
│    │    └────┼────┤             (Return/Ground)     │  │  │ GND    │  │   │
│    │         │    │                                 │  │  └────────┘  │   │
│    │         │    │ SHIELD ●──────────────────●─────┼──┼──┤ CHASSIS│  │   │
│    │ Thread: │    │         (Drain Wire)      │     │  │  │ GND    │  │   │
│    │ M14×1.5 │    └─────────────────────────────────┘  │  └────────┘  │   │
│    │         │                                │        │              │   │
│    └─────────┘                                │        └──────────────┘   │
│         │                                     │              │            │
│         │                             SHIELD GROUND          │            │
│         │                             (Controller End        │            │
│         │                              ONLY - Do NOT         │            │
│         │                              ground at sensor)     │            │
│         │                                                    │            │
│    ┌────┴────┐                                         ┌─────┴─────┐     │
│    │ ENGINE  │                                         │ CONTROL   │     │
│    │ BLOCK   │                                         │ PANEL     │     │
│    │ GROUND  │◄────────── GROUND STRAP ───────────────►│ GROUND    │     │
│    └─────────┘            (25mm² minimum)              └───────────┘     │
│                                                                           │
│    INSTALLATION NOTES:                                                    │
│    ├─ Use shielded twisted pair for EMI immunity                         │
│    ├─ Ground shield at CONTROLLER END ONLY (prevents ground loops)      │
│    ├─ Keep sensor wiring away from alternator and ignition wires         │
│    ├─ Maximum cable length: 20 meters                                     │
│    ├─ Apply dielectric grease to all connectors                          │
│    └─ Torque sensor to 20-25 Nm (M14 thread)                             │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Sensing Element': 'NTC Thermistor (Metal Oxide Ceramic)',
      'Nominal Resistance': '10kΩ @ 25°C',
      'Beta Value (B25/85)': '3435K ± 1%',
      'Operating Temperature': '-40°C to +150°C',
      'Response Time (τ63%)': '< 5 seconds in oil, < 2 seconds in water',
      'Insulation Resistance': '> 100MΩ @ 500VDC',
      'Vibration Resistance': '20g, 10-500Hz',
      'Thread Size': 'M14×1.5 (standard), M16×1.5, 1/4" NPT, 3/8" NPT',
      'Wrench Size': '19mm hex',
      'Housing Material': 'Brass with nickel plating',
      'Connector Type': '2-pin Packard 150 series',
      'Wire Gauge': '0.75mm² (18 AWG) minimum',
      'Protection Rating': 'IP67'
    },
    commonFailures: [
      'Thermal shock cracking from rapid temperature changes',
      'Coolant contamination causing electrical leakage',
      'Thread corrosion in aluminum heads (galvanic)',
      'Connector pin corrosion from moisture ingress',
      'Harness chafing against engine components',
      'EMI interference from proximity to alternator'
    ],
    testProcedure: [
      '1. Disconnect sensor electrical connector',
      '2. Measure resistance between sensor terminals with digital multimeter',
      '3. Compare reading to temperature-resistance chart (10kΩ @ 25°C typical)',
      '4. Heat sensor with heat gun while monitoring resistance decrease',
      '5. Resistance should decrease smoothly without sudden jumps',
      '6. Measure insulation resistance to sensor body (should be > 100MΩ)',
      '7. Verify connector pins are clean and not corroded',
      '8. Check wiring continuity from sensor to controller terminals',
      '9. Reconnect and verify reading matches infrared thermometer'
    ],
    replacementInterval: 'Replace every 5 years or 15,000 operating hours, whichever comes first',
    partNumbers: [
      { brand: 'DSE', oem: 'DSE855-010', aftermarket: ['VDO 323-801-001-003N', 'Datcon 06390-01'] },
      { brand: 'ComAp', oem: 'IC-NT-TEMP', aftermarket: ['Bosch 0280130026', 'Delphi TS10275'] },
      { brand: 'Cummins', oem: '3865312', aftermarket: ['PAI 450650', 'Alliant Power AP63462'] },
      { brand: 'Perkins', oem: '2848A127', aftermarket: ['Europarts 61.125.01', '?"FG Wilson 10000-17460'] },
      { brand: 'CAT', oem: '1979325', aftermarket: ['Interstate McBee M-1979325', 'Costex C1979325'] }
    ]
  },

  // ==================== OIL PRESSURE SENSOR ====================
  {
    id: 'oil-pressure-vdo',
    name: 'Engine Oil Pressure Sensor (VDO/Datcon Type)',
    category: 'pressure',
    type: 'Resistive Pressure Sender',
    range: '0-10 bar (0-145 PSI)',
    output: '10-180Ω variable resistance',
    accuracy: '±3% full scale',
    applications: ['Diesel Generators', 'Marine Engines', 'Industrial Engines', 'Construction Equipment'],
    compatibleControllers: ['DSE 7320', 'DSE 7310', 'DSE 6020', 'ComAp InteliGen', 'Woodward easYgen', 'SmartGen HGM', 'PowerWizard', 'Datakom D-500'],
    description: [
      `The oil pressure sensor is one of the most critical protective devices on any generator engine, providing real-time monitoring of the lubricating oil pressure to prevent catastrophic bearing failures and engine seizure. Modern resistive-type oil pressure senders operate by varying electrical resistance proportionally to the mechanical pressure applied by the engine's oil pump. This analog output is interpreted by the generator controller to display pressure readings and activate warning or shutdown protections when pressure falls below safe operating thresholds.`,

      `Generator controllers typically monitor oil pressure at two critical points: during cranking (to verify oil pump operation before fuel delivery) and during running operation (to detect sudden pressure drops indicating pump failure, bearing wear, or oil leaks). The DSE 7320 series controllers implement a sophisticated oil pressure validation sequence that delays fuel energization until oil pressure exceeds a configurable threshold (typically 0.5-1.0 bar), preventing dry-start damage. Additionally, these controllers apply a time-delayed shutdown (usually 5-15 seconds) for low oil pressure conditions to filter out transient readings during sudden load changes or aggressive throttle maneuvers.`,

      `The VDO-standard resistive sender uses a bourdon tube or diaphragm mechanism coupled to a variable resistor (rheostat). As pressure increases, the bourdon tube straightens proportionally, moving a wiper contact along the resistive element and changing the total resistance between the sender terminals. The standard VDO scale outputs 10Ω at zero pressure and 180Ω at full scale, while some manufacturers use the inverted 180Ω to 10Ω scale. Proper controller configuration is essential—using the wrong resistance curve will result in inverted or grossly inaccurate pressure readings that defeat the protective purpose of the sensor.`
    ],
    workingPrinciple: [
      `The resistive oil pressure sender operates on the mechanical-to-electrical transducer principle using a bourdon tube pressure element. The bourdon tube is a C-shaped or helical metallic tube sealed at one end and connected to the pressurized oil gallery at the other. When internal pressure increases, the tube attempts to straighten due to differential forces on the inner and outer radii—the inner surface has a smaller area than the outer surface, creating a net force that uncoils the tube proportionally to pressure.`,

      `This mechanical movement is transferred through a linkage to a wiper arm that slides along a wire-wound resistor element. As pressure increases, the wiper moves to positions of higher or lower resistance (depending on the sender design), creating a variable resistance that the controller measures by applying a constant current (typically 10-50mA) and measuring the resulting voltage drop. High-quality senders use precious metal contacts and nichrome resistance wire to minimize contact wear and ensure long-term stability.`,

      `The controller interprets the resistance value using a calibration table or polynomial equation that accounts for the sender's specific resistance-to-pressure characteristic. Most DSE controllers allow user-configurable sender curves, enabling use of various manufacturer's sensors. The controller also applies filtering algorithms to smooth the readings and prevent false alarms from pressure pulsations caused by the oil pump's positive displacement action or engine vibration.`
    ],
    installation: [
      `Oil pressure sensors must be installed in a location that accurately represents gallery pressure while minimizing exposure to vibration and heat. The optimal mounting position is the engine block's main oil gallery, typically accessed through a dedicated sensor boss near the oil filter housing. Avoid installing in the cylinder head or high on the block where air pockets can form and cause erratic readings. The sensor thread must match the engine boss exactly—common sizes include 1/8" NPT, 1/4" NPT, M10×1.0, M14×1.5, and M16×1.5.`,

      `Apply PTFE pipe sealant or high-temperature thread sealant to male threads before installation, ensuring sealant does not enter the pressure sensing port. Tighten the sender finger-tight plus 1-2 additional turns for NPT threads, or to the specified torque (typically 15-25 Nm) for metric threads. Over-tightening can damage the sender's internal mechanism or crack the housing. After installation, verify there are no oil leaks around the sender—even minor weepage can cause electrical problems when oil contaminates the connector.`,

      `Route the electrical wiring away from exhaust manifolds, turbocharger housings, and other extreme heat sources. The sender's internal components are typically rated for ambient temperatures up to 120°C, but prolonged exposure to higher temperatures will accelerate wear and degrade accuracy. Use high-temperature wire (silicone-insulated, rated for 200°C) for the final connection to the sender if routing near hot components cannot be avoided. Secure the wiring to prevent vibration-induced fatigue failures at connection points.`
    ],
    troubleshooting: [
      {
        symptom: 'Oil pressure reads zero with engine running',
        possibleCauses: [
          'Open circuit in sender or wiring',
          'Sender internal mechanism failed',
          'Actual low oil pressure (pump failure, low oil level)',
          'Controller input circuit failure',
          'Incorrect sender type installed'
        ],
        diagnosticSteps: [
          'FIRST: Verify actual oil pressure with mechanical gauge before assuming sensor fault',
          'Check oil level on dipstick and top up if low',
          'Disconnect sender and measure resistance (should be ~10Ω with engine off)',
          'Check wiring continuity from sender to controller terminals',
          'Verify sender matches controller configuration (VDO vs inverted scale)'
        ],
        solution: [
          'If mechanical gauge confirms good pressure: replace sensor',
          'Top up oil to proper level on dipstick',
          'Repair or replace damaged wiring',
          'Reconfigure controller for correct sender type',
          'If actual low pressure: investigate oil pump, relief valve, or bearings'
        ],
        tools: ['Mechanical Oil Pressure Gauge', 'Digital Multimeter', 'Appropriate Thread Adapters', 'Engine Oil', 'PTFE Sealant']
      },
      {
        symptom: 'Oil pressure reading higher than expected',
        possibleCauses: [
          'Sender calibration drift',
          'Short circuit in wiring (partial)',
          'Wrong sender type (inverted scale)',
          'Cold oil viscosity affecting readings',
          'Oil pressure relief valve stuck closed'
        ],
        diagnosticSteps: [
          'Compare controller reading to mechanical gauge at operating temperature',
          'Check sender resistance matches pressure (use resistance-pressure chart)',
          'Verify sender part number and controller configuration',
          'Check for pinched or damaged wiring',
          'Allow engine to reach operating temperature before diagnosis'
        ],
        solution: [
          'Replace sender if calibration is off specification',
          'Repair wiring insulation damage',
          'Configure controller for correct sender curve',
          'Investigate oil pressure relief valve if actual pressure is excessive',
          'Use correct oil viscosity for ambient temperature'
        ],
        tools: ['Mechanical Oil Pressure Gauge', 'Digital Multimeter', 'Resistance-Pressure Chart', 'Infrared Thermometer']
      },
      {
        symptom: 'Low oil pressure shutdown during operation',
        possibleCauses: [
          'Actual low oil pressure (wear, dilution, pump wear)',
          'Oil level low',
          'Oil viscosity too thin (overheating, fuel dilution)',
          'Intermittent sender connection',
          'Oil pickup tube obstruction or air leak'
        ],
        diagnosticSteps: [
          'Install mechanical gauge and observe pressure at shutdown condition',
          'Check oil level and condition (look for fuel smell, milky appearance)',
          'Verify oil viscosity meets specifications for operating temperature',
          'Inspect sender connector for corrosion or loose pins',
          'Check for oil leaks at gaskets, seals, and fittings'
        ],
        solution: [
          'If actual low pressure: major engine service required',
          'Top up oil level and monitor consumption',
          'Change oil if contaminated with fuel or coolant',
          'Clean and secure sender connection',
          'Repair oil leaks and check pickup tube'
        ],
        tools: ['Mechanical Oil Pressure Gauge', 'Oil Analysis Kit', 'Refractometer (Fuel Dilution)', 'Flashlight/Borescope']
      }
    ],
    faultCodes: [
      { code: 'DSE 0422', controller: 'DSE 7320/7310', description: 'Oil Pressure Sender Open Circuit', severity: 'warning' },
      { code: 'DSE 0423', controller: 'DSE 7320/7310', description: 'Oil Pressure Sender Short Circuit', severity: 'warning' },
      { code: 'DSE 0424', controller: 'DSE 7320/7310', description: 'Low Oil Pressure Warning', severity: 'warning' },
      { code: 'DSE 0425', controller: 'DSE 7320/7310', description: 'Low Oil Pressure Shutdown', severity: 'shutdown' },
      { code: 'DSE 0426', controller: 'DSE 7320/7310', description: 'Oil Pressure Too High Warning', severity: 'warning' },
      { code: 'InteliGen 1201', controller: 'ComAp InteliGen', description: 'Oil Pressure Sensor Failure', severity: 'warning' },
      { code: 'InteliGen 1202', controller: 'ComAp InteliGen', description: 'Low Oil Pressure', severity: 'shutdown' },
      { code: 'HGM 31', controller: 'SmartGen HGM6120/7220', description: 'Oil Pressure Sender Open', severity: 'warning' },
      { code: 'HGM 32', controller: 'SmartGen HGM6120/7220', description: 'Oil Pressure Sender Short', severity: 'warning' },
      { code: 'HGM 33', controller: 'SmartGen HGM6120/7220', description: 'Low Oil Pressure', severity: 'shutdown' },
      { code: 'PW E354', controller: 'PowerWizard 1.0/2.0', description: 'Engine Oil Pressure Low', severity: 'shutdown' },
      { code: 'E3100', controller: 'Woodward easYgen', description: 'Oil Pressure Transducer Fault', severity: 'warning' }
    ],
    schematic: {
      ascii: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OIL PRESSURE SENSOR CIRCUIT                              │
│                     VDO Resistive Sender Wiring                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ENGINE OIL GALLERY                        CONTROLLER                      │
│    ┌──────────────┐                         ┌──────────────┐                │
│    │              │                         │              │                │
│    │   BOURDON    │                         │  OIL-P ●─────┤← Yellow Wire  │
│    │    TUBE      │   TWISTED PAIR          │  (Pin 10)    │  (0.75mm²)    │
│    │   ┌──────┐   │   ═══════════════       │              │                │
│    │   │  P   │◄──┼───● Signal ────────────►│──●           │                │
│    │   │  R   │   │      (Yellow)           │              │                │
│    │   │  E   │   │                         │              │                │
│    │   │  S   │   │   ═══════════════       │  OIL-GND ●───┤← Yellow/Black │
│    │   │  S   │   │                         │  (Pin 11)    │  (0.75mm²)    │
│    │   │      │   │                         │              │                │
│    │   │ ~~~  │◄──┼───● Ground ────────────►│──●           │                │
│    │   │WIPER │   │      (Yellow/Black)     │              │                │
│    │   └──────┘   │                         │              │                │
│    │              │                         │              │                │
│    │   Rvar =     │                         │              │                │
│    │   10-180Ω    │                         │              │                │
│    │              │                         └──────────────┘                │
│    └──────────────┘                                                         │
│           │                                                                  │
│           │◄─── Threaded Boss (1/8" NPT, M14×1.5, etc.)                     │
│           │                                                                  │
│    ┌──────┴──────┐                                                          │
│    │  OIL PUMP   │                                                          │
│    │   OUTPUT    │                                                          │
│    │  GALLERY    │                                                          │
│    └─────────────┘                                                          │
│                                                                              │
│    SENDER SPECIFICATIONS:                                                    │
│    ├─ Type: Bourdon Tube with Wire-Wound Rheostat                           │
│    ├─ Range: 0-10 bar (0-145 PSI)                                           │
│    ├─ Resistance: 10Ω @ 0 bar, 180Ω @ 10 bar (VDO standard)                │
│    ├─ Current Draw: 20-50mA typical                                         │
│    └─ Accuracy: ±3% of full scale                                           │
│                                                                              │
│    RESISTANCE vs PRESSURE (VDO STANDARD):                                   │
│                                                                              │
│    Resistance (Ω)                                                           │
│    │                                                                         │
│    180┤                              ●●●●●●●                                 │
│    150┤                       ●●●●●●                                         │
│    120┤                 ●●●●●                                                │
│    90 ┤           ●●●●●                                                      │
│    60 ┤      ●●●●                                                            │
│    30 ┤  ●●●                                                                 │
│    10 ┤●●                                                                    │
│       └┼──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬─ Pressure (bar)                      │
│         0  1  2  3  4  5  6  7  8  9 10                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OIL PRESSURE SENDER TYPES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    VDO STYLE (Most Common)              DATCON STYLE                        │
│    ┌─────────────┐                      ┌─────────────┐                    │
│    │     ●       │  Single terminal    │     ●       │  Single terminal   │
│    │   SIGNAL    │  (Signal output)    │   SIGNAL    │  (Signal output)   │
│    │             │                      │             │                    │
│    │   ═════     │  Body = Ground      │   ═════     │  Body = Ground     │
│    │  (Thread)   │  (Via engine block) │  (Thread)   │  (Via engine block)│
│    └─────────────┘                      └─────────────┘                    │
│                                                                              │
│    VDO RESISTANCE CURVE:               DATCON RESISTANCE CURVE:            │
│    0 bar = 10Ω                         0 bar = 0Ω                          │
│    5 bar = 95Ω                         5 bar = 40Ω                         │
│    10 bar = 180Ω                       10 bar = 80Ω                        │
│                                                                              │
│    CUMMINS/CATERPILLAR STYLE (3-Wire)                                      │
│    ┌─────────────┐                                                          │
│    │ ●   ●   ●   │                                                          │
│    │ A   B   C   │   A = 5V Supply (from controller)                       │
│    │             │   B = Signal Output (0.5-4.5V)                          │
│    │   ═════     │   C = Ground                                            │
│    │  (Thread)   │                                                          │
│    └─────────────┘   NOTE: This is an active transducer, not resistive!   │
│                                                                              │
│    WIRE COLOR CODES:                                                        │
│    ├─ DSE: Yellow (Signal), Yellow/Black (Ground)                          │
│    ├─ ComAp: Green (Signal), Green/White (Ground)                          │
│    ├─ Cummins: Gray (Signal), Purple (5V), Black (Ground)                  │
│    └─ CAT: Pink (Signal), Orange (5V), Black (Ground)                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE OIL PRESSURE WIRING                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌───────────────┐                           ┌──────────────────┐        │
│    │   OIL PRESS   │   TWISTED PAIR CABLE      │   CONTROLLER     │        │
│    │    SENDER     │   (0.75mm² / 18 AWG)      │                  │        │
│    │               │                           │                  │        │
│    │   ┌───────┐   │  ┌────────────────────┐  │   ┌──────────┐   │        │
│    │   │Bourdon│   │  │                    │  │   │          │   │        │
│    │   │ Tube  │───┼──┤ YELLOW ●═══════●───┼──┼───┤ OIL-P    │   │        │
│    │   │   ↓   │   │  │    (Signal)        │  │   │ (Pin 10) │   │        │
│    │   │ Wiper │   │  │                    │  │   │          │   │        │
│    │   │   │   │   │  │                    │  │   └──────────┘   │        │
│    │   │   ↓   │   │  │                    │  │                  │        │
│    │   │Resistor│  │  │ YELLOW/BLK ●═══●───┼──┼───┤ OIL-GND  │   │        │
│    │   └───────┘   │  │    (Ground)        │  │   │ (Pin 11) │   │        │
│    │               │  │                    │  │   │          │   │        │
│    │   Thread:     │  └────────────────────┘  │   └──────────┘   │        │
│    │   M14×1.5 or  │                          │                  │        │
│    │   1/8" NPT    │                          └──────────────────┘        │
│    └───────────────┘                                                       │
│           │                                                                 │
│           │                                                                 │
│    ┌──────┴──────┐        FOR ISOLATED GROUND SENDERS:                     │
│    │   ENGINE    │        (Two-wire connection)                            │
│    │   BLOCK     │                                                          │
│    │   (Ground   │        ┌─────────┐        ┌─────────────────┐          │
│    │    Return)  │        │ SENDER  │────────┤ Signal → Pin 10 │          │
│    └─────────────┘        │    ●    │        │ Ground → Pin 11 │          │
│                           │    ●    │────────┤                 │          │
│                           └─────────┘        └─────────────────┘          │
│                                                                              │
│    IMPORTANT INSTALLATION NOTES:                                            │
│    ├─ Use thread sealant rated for oil contact                             │
│    ├─ Do NOT use PTFE tape alone (can contaminate oil system)              │
│    ├─ Torque: 15-25 Nm depending on thread size                            │
│    ├─ Keep wiring away from exhaust components (max 120°C ambient)         │
│    ├─ Verify no oil leaks after installation                               │
│    └─ Confirm mechanical pressure with test gauge before relying on sender │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Sensing Element': 'Bourdon Tube with Wire-Wound Rheostat',
      'Pressure Range': '0-10 bar (0-145 PSI)',
      'Resistance Output': '10-180Ω (VDO standard)',
      'Accuracy': '±3% of full scale',
      'Operating Temperature': '-40°C to +120°C',
      'Burst Pressure': '20 bar (2× rated)',
      'Thread Options': 'M10×1.0, M14×1.5, M16×1.5, 1/8" NPT, 1/4" NPT',
      'Wetted Materials': 'Brass, Stainless Steel',
      'Electrical Connection': 'Spade terminal or Packard connector',
      'Current Draw': '20-50mA',
      'Vibration Resistance': '15g, 10-500Hz',
      'Protection Rating': 'IP65'
    },
    commonFailures: [
      'Bourdon tube fatigue cracking from pressure cycling',
      'Rheostat wiper wear causing open/intermittent readings',
      'Oil contamination of electrical contacts',
      'Thread seizure in aluminum blocks',
      'Diaphragm rupture in diaphragm-type senders',
      'Vibration-induced wiring fatigue'
    ],
    testProcedure: [
      '1. Remove sender from engine (have drain pan ready for oil)',
      '2. Connect multimeter to sender terminals',
      '3. Verify resistance at atmospheric pressure (should be ~10Ω for VDO)',
      '4. Apply known pressure with hand pump and pressure gauge',
      '5. Verify resistance increases linearly with pressure',
      '6. At 5 bar, resistance should be approximately 95Ω (VDO)',
      '7. At 10 bar, resistance should be approximately 180Ω (VDO)',
      '8. Check for any sticking or sudden jumps in resistance',
      '9. Verify no oil leaks from sender body under pressure',
      '10. Compare readings to manufacturer specifications'
    ],
    replacementInterval: 'Replace every 3-5 years or 10,000 operating hours, or when readings become erratic',
    partNumbers: [
      { brand: 'VDO', oem: '360-081-030-014C', aftermarket: ['Datcon 06505-00', 'Murphy ES2P-100'] },
      { brand: 'DSE', oem: 'DSE855-100', aftermarket: ['Autogauge 200180', 'Faria OP0001'] },
      { brand: 'Cummins', oem: '3967251', aftermarket: ['PAI 450550', 'Alliant Power AP63405'] },
      { brand: 'Perkins', oem: '2848A126', aftermarket: ['Europarts 61.125.02', 'FG Wilson 10000-53560'] },
      { brand: 'CAT', oem: '1946724', aftermarket: ['Interstate McBee M-1946724', 'Costex C1946724'] }
    ]
  },

  // ==================== MAGNETIC PICKUP / SPEED SENSOR ====================
  {
    id: 'mpu-speed-sensor',
    name: 'Magnetic Pickup Unit (MPU) Speed Sensor',
    category: 'speed',
    type: 'Variable Reluctance Sensor',
    range: '0-10,000 RPM (frequency dependent)',
    output: '0.5-70V AC (amplitude varies with speed)',
    accuracy: '±0.1% of frequency',
    applications: ['Diesel Generators', 'Gas Generators', 'Turbines', 'Compressors', 'Industrial Engines'],
    compatibleControllers: ['DSE 7320', 'DSE 7310', 'ComAp InteliGen', 'Woodward easYgen', 'SmartGen HGM', 'PowerWizard', 'Datakom D-500', 'Datakom D-700'],
    description: [
      `The Magnetic Pickup Unit (MPU) is the primary speed sensing device used in generator control systems to accurately measure engine crankshaft or flywheel rotational speed. Unlike active sensors that require external power, the MPU is a passive variable reluctance sensor that generates its own AC voltage signal proportional to the rate of change of magnetic flux as ferromagnetic teeth pass by the sensor tip. This self-generating characteristic makes MPUs extremely reliable and immune to power supply issues, while their simple construction (a permanent magnet with a wound coil) provides excellent durability in harsh engine environments.`,

      `Generator controllers use the MPU signal for multiple critical functions: engine speed display (RPM), frequency calculation for synchronization, overspeed/underspeed protection, and load sharing between paralleled generators. The DSE 7320 and similar advanced controllers can detect speeds as low as 20 RPM during cranking (for failed start detection) and as high as 3,500 RPM (for overspeed shutdown at 110-115% of rated speed). The controller processes the raw AC waveform through a zero-crossing detector and frequency counter, converting the signal to a digital RPM reading with update rates of 10-50 times per second for responsive governor control.`,

      `The MPU's output voltage amplitude is directly proportional to engine speed—at cranking speeds (100-200 RPM), the signal may be only 0.5-2V AC, while at rated speed (1500-3000 RPM), the signal can reach 50-70V AC peak-to-peak. This wide voltage range requires the controller's input circuitry to handle both very small signals (requiring high sensitivity) and large signals (requiring overvoltage protection). The air gap between the MPU tip and the flywheel ring gear teeth is critical—too large a gap results in weak signals at low speed, while too small a gap risks physical contact and sensor damage. The standard gap setting is 0.5-1.0mm (0.020-0.040"), measured with a non-magnetic feeler gauge when the engine is cold.`
    ],
    workingPrinciple: [
      `The Magnetic Pickup Unit operates on Faraday's law of electromagnetic induction, which states that a changing magnetic field induces a voltage in a conductor. The MPU consists of a permanent magnet (typically Alnico or rare-earth), a pole piece that concentrates the magnetic flux, and a coil of fine copper wire (typically 1,000-3,000 turns) wound around the pole piece. When stationary, the magnetic field is constant and no voltage is induced in the coil.`,

      `As a ferromagnetic tooth on the flywheel or ring gear approaches the sensor, it provides a low-reluctance path for the magnetic flux, strengthening the field through the coil. As the tooth passes directly under the sensor, the field is at maximum strength. As the tooth moves away, the flux weakens. This alternating increase and decrease in magnetic flux induces an alternating voltage in the coil according to V = -N × (dΦ/dt), where N is the number of coil turns and dΦ/dt is the rate of change of magnetic flux. The faster the teeth pass (higher RPM), the greater the rate of change and the higher the induced voltage.`,

      `The resulting output waveform is approximately sinusoidal, with the frequency equal to (Number of Teeth × RPM) / 60. For a standard 124-tooth flywheel ring gear at 1500 RPM, the output frequency is (124 × 1500) / 60 = 3,100 Hz. The controller measures this frequency and calculates RPM using the programmed tooth count. Accuracy depends on consistent tooth spacing, proper air gap, and clean signal transmission—any irregularity in tooth spacing or damage to teeth will cause speed fluctuations in the controller reading.`
    ],
    installation: [
      `Proper MPU installation begins with identifying the correct mounting location and thread size. Most generators have a dedicated MPU boss on the flywheel housing or timing gear cover, pre-machined at the correct angle to the ring gear teeth. Common thread sizes are M16×1.5 (most European engines), 5/8"-18 UNF (American engines), and M18×1.5 (larger industrial engines). The sensing tip must point directly at the gear teeth, not at an angle, for maximum signal strength and consistent readings.`,

      `Setting the air gap is the most critical installation step. Thread the MPU into the boss by hand until the tip lightly contacts the ring gear teeth (felt as a slight resistance—DO NOT force it). Then back out the sensor by the specified gap dimension, typically 0.75-1.0mm (0.030-0.040"). Lock the sensor in position with the jam nut while holding the sensor body to prevent rotation. For engines with significant thermal expansion, set the gap at operating temperature, as the gap will increase as the engine cools. Some installations use a flexible MPU mount that allows the sensor to "float" on the teeth, maintaining consistent gap despite thermal changes.`,

      `Route the MPU cable using shielded twisted pair away from high-current conductors, especially the alternator output cables and battery cables. The shield should be grounded at the controller end only to prevent ground loops. Maximum recommended cable length is 20 meters to minimize signal attenuation and noise pickup. At the controller, connect the MPU to the designated speed input terminals, typically labeled MPU+, MPU-, and MPU-SH (shield). Verify correct polarity if the controller requires it—some controllers are polarity-sensitive and will show unstable readings if reversed.`
    ],
    troubleshooting: [
      {
        symptom: 'No speed reading (0 RPM) with engine running',
        possibleCauses: [
          'Open circuit in MPU coil',
          'Broken wiring between MPU and controller',
          'Air gap too large (weak signal)',
          'Controller speed input circuit failure',
          'MPU tip damaged or contaminated with metallic debris'
        ],
        diagnosticSteps: [
          'Measure MPU coil resistance (should be 200-1000Ω depending on type)',
          'Measure AC voltage at controller terminals while cranking (should see 0.5-2V AC)',
          'Check wiring continuity from MPU to controller',
          'Verify air gap with non-magnetic feeler gauge (0.5-1.0mm typical)',
          'Inspect MPU tip for damage or metallic contamination'
        ],
        solution: [
          'Replace MPU if coil is open (infinite resistance)',
          'Repair or replace damaged wiring',
          'Readjust air gap to specification',
          'Clean MPU tip with solvent if contaminated',
          'Verify controller speed input with known-good MPU'
        ],
        tools: ['Digital Multimeter (AC voltage capable)', 'Non-magnetic Feeler Gauge', 'Oscilloscope (recommended)', 'Solvent Cleaner']
      },
      {
        symptom: 'Erratic or fluctuating speed reading',
        possibleCauses: [
          'Damaged or missing flywheel teeth',
          'Air gap inconsistent (loose MPU mounting)',
          'EMI interference on signal wires',
          'Intermittent wiring connection',
          'Ring gear runout excessive'
        ],
        diagnosticSteps: [
          'Inspect flywheel ring gear for damaged, worn, or missing teeth',
          'Check MPU mounting tightness and gap consistency',
          'View signal waveform on oscilloscope (should be clean sine wave)',
          'Wiggle harness while monitoring reading for intermittent',
          'Route wiring away from alternator and ignition components'
        ],
        solution: [
          'Replace ring gear or flywheel if teeth damaged',
          'Retighten MPU mounting and readjust gap',
          'Install shielded cable with proper grounding',
          'Repair intermittent connections',
          'Reroute wiring away from interference sources'
        ],
        tools: ['Oscilloscope', 'Inspection Mirror', 'Shielded Cable', 'Torque Wrench', 'Dial Indicator']
      },
      {
        symptom: 'Speed reading incorrect (too high or too low)',
        possibleCauses: [
          'Wrong tooth count programmed in controller',
          'MPU picking up wrong gear (camshaft instead of crankshaft)',
          'Controller calibration error',
          'Doubled signal from damaged teeth creating false pulses'
        ],
        diagnosticSteps: [
          'Count actual teeth on ring gear and verify controller setting',
          'Verify MPU is sensing crankshaft speed (not camshaft = half speed)',
          'Compare controller reading to tachometer or stroboscope',
          'Check for doubled teeth or debris causing extra pulses'
        ],
        solution: [
          'Program correct tooth count in controller',
          'Relocate MPU to crankshaft position if on camshaft',
          'Recalibrate controller speed input',
          'Clean ring gear and remove any metallic debris'
        ],
        tools: ['Stroboscope/Tachometer', 'Oscilloscope', 'Controller Programming Interface']
      }
    ],
    faultCodes: [
      { code: 'DSE 0120', controller: 'DSE 7320/7310', description: 'Loss of Speed Signal', severity: 'warning' },
      { code: 'DSE 0121', controller: 'DSE 7320/7310', description: 'Speed Signal Too Low (Check Air Gap)', severity: 'warning' },
      { code: 'DSE 0122', controller: 'DSE 7320/7310', description: 'Overspeed Shutdown', severity: 'shutdown' },
      { code: 'DSE 0123', controller: 'DSE 7320/7310', description: 'Underspeed Shutdown', severity: 'shutdown' },
      { code: 'InteliGen 1001', controller: 'ComAp InteliGen', description: 'Speed Sensor Failure', severity: 'warning' },
      { code: 'InteliGen 1002', controller: 'ComAp InteliGen', description: 'Overspeed', severity: 'shutdown' },
      { code: 'InteliGen 1003', controller: 'ComAp InteliGen', description: 'Underspeed', severity: 'shutdown' },
      { code: 'HGM 11', controller: 'SmartGen HGM6120/7220', description: 'Speed Sensor Fail', severity: 'warning' },
      { code: 'HGM 12', controller: 'SmartGen HGM6120/7220', description: 'Overspeed', severity: 'shutdown' },
      { code: 'HGM 13', controller: 'SmartGen HGM6120/7220', description: 'Underspeed', severity: 'shutdown' },
      { code: 'PW E341', controller: 'PowerWizard 1.0/2.0', description: 'Engine Speed Sensor Fault', severity: 'warning' },
      { code: 'E3020', controller: 'Woodward easYgen', description: 'Speed Pickup Failure', severity: 'warning' }
    ],
    schematic: {
      ascii: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAGNETIC PICKUP UNIT (MPU) CIRCUIT                       │
│                      Variable Reluctance Speed Sensor                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    FLYWHEEL/RING GEAR                        CONTROLLER                     │
│    ┌──────────────────┐                     ┌──────────────┐                │
│    │  ╔═╗ ╔═╗ ╔═╗ ╔═╗ │                     │              │                │
│    │  ║ ║ ║ ║ ║ ║ ║ ║ │  TEETH              │   MPU+ ●─────┤← Cyan Wire    │
│    │  ╚═╝ ╚═╝ ╚═╝ ╚═╝ │  (124 typical)      │   (Pin 16)   │  (0.75mm²)    │
│    │        │         │                     │              │                │
│    │      ┌─┴─┐       │   SHIELDED          │              │                │
│    │      │ N │       │   TWISTED PAIR      │   MPU- ●─────┤← Cyan/White   │
│    │   ┌──┤   ├──┐    │   ══════════════    │   (Pin 17)   │  (0.75mm²)    │
│    │   │  │ S │  │    │                     │              │                │
│    │   │  └───┘  │    │                     │   MPU-SH ●───┤← Gray Shield  │
│    │   │PERMANENT│    │                     │   (Pin 18)   │  (Drain Wire) │
│    │   │ MAGNET │     │                     │              │                │
│    │   │   │    │     │                     │              │                │
│    │   │ ┌─┴──┐ │     │                     │              │                │
│    │   │ │COIL│ │     │                     │              │                │
│    │   │ │~~~~│ │     │                     │              │                │
│    │   │ │ N  │ │     │                     │              │                │
│    │   │ │TURN│ │     │                     │              │                │
│    │   │ │    │ │     │                     │              │                │
│    │   │ └─┬──┘ │     │                     │              │                │
│    │   └───┴────┘     │                     │              │                │
│    │       │          │                     └──────────────┘                │
│    │      ═══         │                                                     │
│    │    AIR GAP       │                                                     │
│    │   0.5-1.0mm      │                                                     │
│    └──────────────────┘                                                     │
│                                                                              │
│    SENSOR SPECIFICATIONS:                                                    │
│    ├─ Type: Variable Reluctance (Passive, Self-Generating)                  │
│    ├─ Coil Resistance: 200-1000Ω (varies by model)                         │
│    ├─ Output Voltage: 0.5V AC @ 100 RPM to 70V AC @ 3000 RPM               │
│    ├─ Output Frequency: f = (Teeth × RPM) / 60                              │
│    └─ Air Gap: 0.5-1.0mm (0.020-0.040")                                     │
│                                                                              │
│    OUTPUT WAVEFORM:                                                         │
│                                                                              │
│    Voltage                                                                  │
│    ↑    ╭──╮    ╭──╮    ╭──╮    ╭──╮                                       │
│    │   ╱    ╲  ╱    ╲  ╱    ╲  ╱    ╲   Tooth passing                      │
│    0 ──╳──────╳──────╳──────╳──────╳── Zero crossing                       │
│    │   ╲    ╱  ╲    ╱  ╲    ╱  ╲    ╱   = Speed pulse                       │
│    ↓    ╰──╯    ╰──╯    ╰──╯    ╰──╯                                       │
│                                                                              │
│         ←──────── One Revolution ──────→                                    │
│         (Number of cycles = Number of teeth)                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MPU CONNECTOR CONFIGURATIONS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    3-PIN PACKARD (DSE Standard)           3-PIN DEUTSCH DT04-3P             │
│    ┌───────────┐                          ┌───────────┐                    │
│    │  ●  ●  ●  │                          │  ●  ●  ●  │                    │
│    │  1  2  3  │                          │  A  B  C  │                    │
│    └───────────┘                          └───────────┘                    │
│    1 = MPU+ (Cyan)                        A = MPU+ (Signal +)              │
│    2 = MPU- (Cyan/White)                  B = MPU- (Signal -)              │
│    3 = Shield (Gray)                      C = Shield/Screen                │
│                                                                              │
│    2-PIN SIMPLE (Older Systems)           INTEGRAL CABLE (Cummins Style)   │
│    ┌─────────┐                            ┌─────────────────────┐          │
│    │  ●   ●  │                            │     ┌───┐           │          │
│    │  +   -  │                            │     │MPU│═══════════│          │
│    └─────────┘                            │     └───┘   Cable   │          │
│    + = Signal                             │      2-3m integral  │          │
│    - = Return/Ground                      │      Shielded       │          │
│                                           └─────────────────────┘          │
│                                                                              │
│    WIRING BEST PRACTICES:                                                   │
│    ├─ Always use shielded twisted pair for MPU connections                 │
│    ├─ Ground shield at CONTROLLER END ONLY                                 │
│    ├─ Maximum cable length: 20 meters                                       │
│    ├─ Keep MPU wiring separate from power cables                           │
│    ├─ Minimum separation from alternator cables: 150mm                     │
│    └─ Use ferrite chokes if EMI problems persist                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE MPU INSTALLATION DIAGRAM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    FLYWHEEL HOUSING                                                         │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                                                                   │     │
│    │    RING GEAR (124 teeth)                                         │     │
│    │    ╔════════════════════════════════════════════════════════╗   │     │
│    │    ║ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ║   │     │
│    │    ╚════════════════════════════════════════════════════════╝   │     │
│    │              │                                                   │     │
│    │              │◄─ AIR GAP 0.75mm                                 │     │
│    │              │                                                   │     │
│    │         ┌────┴────┐                                             │     │
│    │         │   MPU   │◄── Threaded boss M16×1.5                   │     │
│    │         │ SENSOR  │                                             │     │
│    │         │    │    │                                             │     │
│    │         └────┼────┘                                             │     │
│    │              │                                                   │     │
│    └──────────────┼───────────────────────────────────────────────────┘     │
│                   │                                                          │
│                   │ SHIELDED TWISTED PAIR                                   │
│                   │ (Max 20m)                                               │
│                   │                                                          │
│    ┌──────────────┼──────────────────────────────────────────────────┐     │
│    │              │                CONTROL PANEL                      │     │
│    │   ┌──────────┴──────────┐                                       │     │
│    │   │                     │       ┌──────────────────┐            │     │
│    │   │  ● CYAN ═══════════════════►│ Pin 16 (MPU+)   │            │     │
│    │   │                     │       │                  │            │     │
│    │   │  ● CYAN/WHITE ═════════════►│ Pin 17 (MPU-)   │            │     │
│    │   │                     │       │                  │            │     │
│    │   │  ● GRAY (Shield) ══════════►│ Pin 18 (SH)     │            │     │
│    │   │       │             │       │    CONTROLLER   │            │     │
│    │   │       ▼             │       └──────────────────┘            │     │
│    │   │    SHIELD           │              │                        │     │
│    │   │    GROUND           │              │                        │     │
│    │   │    (here only)      │              │                        │     │
│    │   └─────────────────────┘              │                        │     │
│    │                                        │                        │     │
│    │                              ┌─────────┴─────────┐              │     │
│    │                              │   CHASSIS GROUND  │              │     │
│    │                              └───────────────────┘              │     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│    CONTROLLER SETTINGS:                                                     │
│    ├─ Tooth Count: 124 (standard flywheel ring gear)                       │
│    ├─ Pickup Type: Variable Reluctance (passive)                           │
│    ├─ Threshold: Auto or 0.5V minimum                                      │
│    └─ Gear Ratio: 1:1 (direct crankshaft sensing)                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Sensing Principle': 'Variable Reluctance (Electromagnetic Induction)',
      'Coil Resistance': '200-1000Ω (model dependent)',
      'Output Voltage': '0.5V AC @ 100 RPM to 70V AC @ 3000 RPM',
      'Frequency Range': '10Hz to 10kHz',
      'Air Gap Range': '0.5-2.0mm (0.020-0.080")',
      'Optimal Air Gap': '0.75-1.0mm (0.030-0.040")',
      'Operating Temperature': '-40°C to +125°C',
      'Thread Size': 'M16×1.5, M18×1.5, 5/8"-18 UNF',
      'Magnet Material': 'Alnico or Neodymium',
      'Housing Material': 'Stainless Steel or Brass',
      'Cable Length': '2m integral (standard), extendable to 20m',
      'Protection Rating': 'IP67',
      'Vibration Resistance': '30g, 10-2000Hz'
    },
    commonFailures: [
      'Coil open circuit from vibration-induced wire breakage',
      'Permanent magnet demagnetization from heat exposure',
      'Air gap change from mounting hardware loosening',
      'Physical damage to sensor tip from flywheel contact',
      'Corrosion of connections from moisture ingress',
      'EMI interference causing false pulses'
    ],
    testProcedure: [
      '1. Disconnect MPU from controller',
      '2. Measure coil resistance between MPU+ and MPU- (should be 200-1000Ω)',
      '3. Measure insulation resistance from coil to housing (should be > 10MΩ)',
      '4. Connect oscilloscope to MPU terminals',
      '5. Crank engine and observe waveform (should be clean sine wave)',
      '6. Voltage should increase with engine speed',
      '7. Count peaks per revolution and verify matches tooth count',
      '8. Check air gap with non-magnetic feeler gauge',
      '9. Verify mounting hardware is tight and sensor is not loose',
      '10. Inspect sensor tip for damage or metallic debris'
    ],
    replacementInterval: 'Replace every 5-7 years or when signal becomes weak/erratic. No routine replacement required if functioning properly.',
    partNumbers: [
      { brand: 'DSE', oem: 'DSE810', aftermarket: ['Picks 3015-M16', 'Woodward 1523-650'] },
      { brand: 'ComAp', oem: 'IC-NT-MPU', aftermarket: ['Barksdale 422H3-15', 'Murphy MPU'] },
      { brand: 'Cummins', oem: '3034572', aftermarket: ['PAI 450330', 'Alliant Power AP63401'] },
      { brand: 'CAT', oem: '1619960', aftermarket: ['Interstate McBee M-1619960', 'Costex C1619960'] },
      { brand: 'Woodward', oem: '1523-650-40', aftermarket: ['Dynalco MLN-M18', 'Electro-Sensors 800-007600'] }
    ]
  },

  // ==================== FUEL LEVEL SENSOR ====================
  {
    id: 'fuel-level-resistive',
    name: 'Fuel Level Sensor (Resistive Float Type)',
    category: 'level',
    type: 'Resistive Float',
    range: '0-100% (Empty to Full)',
    output: '0-190Ω or 10-180Ω (configurable)',
    accuracy: '±3% full scale',
    applications: ['Diesel Generators', 'Fuel Day Tanks', 'Bulk Storage Tanks', 'Mobile Gensets'],
    compatibleControllers: ['DSE 7320', 'DSE 7310', 'DSE 6020', 'ComAp InteliGen', 'ComAp InteliLite', 'SmartGen HGM', 'Woodward easYgen'],
    description: [
      'The resistive float fuel level sensor is the standard method for fuel quantity measurement in generator fuel tanks and day tanks. Operating on a simple yet reliable principle, the sensor uses a float connected to a variable resistor (rheostat) that changes resistance proportionally to fuel level. This technology has proven extremely reliable over decades of industrial use, requiring minimal maintenance and providing consistent readings even in harsh environments with vibration and temperature extremes.',
      'Modern fuel level sensors for generator applications typically feature either a rod-type design for tanks up to 600mm depth or a flexible probe design for deeper tanks up to 2500mm. The float material is selected based on fuel type—nitrile rubber or cork composites for diesel, fluorocarbon materials for biodiesel blends, and stainless steel or syntactic foam for aggressive fuels. The resistance element uses wire-wound construction for durability, with hermetic sealing to prevent fuel vapor ingress that could cause premature failure.',
      'Generator controllers process the fuel level signal to display real-time fuel quantity, calculate remaining runtime based on current load and consumption rate, and trigger low fuel warnings before the engine runs dry. Advanced controllers can log fuel consumption trends for predictive maintenance and theft detection. Proper calibration is essential as fuel tank geometry, sensor mounting angle, and fuel type all affect the relationship between float position and actual fuel volume.'
    ],
    workingPrinciple: [
      'The resistive fuel level sensor operates by converting mechanical float position into an electrical resistance value. Inside the sensor housing, a resistive element (typically nichrome wire wound on a ceramic or plastic former) is contacted by a wiper attached to the float arm. As the float rises and falls with the fuel level, the wiper moves along the resistive element, changing the resistance between the sensor terminals. Most sensors provide increasing resistance with increasing fuel level (empty=low resistance, full=high resistance), though some designs operate inversely.',
      'The controller applies a constant reference voltage (typically 5V or 10V) to the sensor through a precision resistor, creating a voltage divider circuit. The voltage at the sensor junction varies proportionally with the sensor resistance, and thus with fuel level. The controller ADC samples this voltage and converts it to a fuel level percentage using a calibration curve stored in memory. Most controllers support either two-point calibration (empty and full) or multi-point calibration for tanks with irregular shapes.',
      'Signal conditioning within the controller typically includes heavy filtering to smooth out readings during fuel slosh caused by engine vibration or vehicle movement. Averaging periods of 30-60 seconds are common to provide stable display readings. Some controllers implement rate-of-change limits to reject sudden implausible readings that could indicate sensor failure rather than actual fuel level changes.'
    ],
    installation: [
      'Select the appropriate sensor length for your tank depth—the float should rest on the tank bottom when the tank is empty and reach within 25mm of the tank top when full. For rectangular tanks, mount the sensor in a corner away from the fuel return line to minimize turbulence effects. For cylindrical tanks mounted horizontally, mount the sensor at the highest point to ensure accurate low-level readings. Always install a baffle plate around the sensor if mounted near fuel inlets to dampen slosh.',
      'Thread the sensor into the tank using appropriate sealant—PTFE tape alone is not recommended for fuel applications. Use a fuel-resistant liquid thread sealant or compression fitting with appropriate gasket material. Torque to specification (typically 15-25 Nm) without overtightening, which can distort the sensor housing and cause binding of the float mechanism. Ensure the float arm moves freely through its full range before completing the installation.',
      'Wire the sensor using fuel-resistant, shielded cable routed away from high-temperature zones and ignition sources. Most controllers expect a two-wire connection (signal and ground), though some sensors include a third wire for tank grounding. After installation, perform a full calibration: drain the tank to empty, record the resistance/voltage at empty, fill completely, and record the full reading. Enter these values in the controller calibration menu.'
    ],
    troubleshooting: [
      {
        symptom: 'Fuel level reading stuck at one value',
        possibleCauses: ['Float arm stuck on obstruction', 'Wiper detached from resistor', 'Internal corrosion on contacts', 'Fuel sludge preventing float movement', 'Controller input channel failure'],
        diagnosticSteps: ['Remove sensor and inspect float movement', 'Measure resistance while manually moving float', 'Check resistance varies smoothly through range', 'Inspect wiper and resistor for damage', 'Measure voltage at controller input'],
        solution: ['Clear any obstructions from tank', 'Clean or replace corroded contacts', 'Replace sensor if wiper or resistor damaged', 'Clean fuel tank and filter fuel', 'Test with substitute sensor to confirm'],
        tools: ['Multimeter', 'Test leads', 'Inspection mirror', 'Fuel-safe cleaning solvent']
      },
      {
        symptom: 'Erratic or jumping fuel level readings',
        possibleCauses: ['Loose wiper contact on resistor', 'Corroded or dirty resistor element', 'Poor electrical connections', 'EMI interference on signal wire', 'Controller input noise'],
        diagnosticSteps: ['Check all wiring connections', 'Measure resistance stability', 'Inspect shielding and grounding', 'Check for nearby EMI sources', 'Monitor controller raw input'],
        solution: ['Tighten or repair connections', 'Clean resistor with contact cleaner', 'Replace sensor if wear evident', 'Add or improve cable shielding', 'Install EMI filter if needed'],
        tools: ['Multimeter', 'Oscilloscope', 'Contact cleaner', 'Shielded cable']
      }
    ],
    faultCodes: [
      { code: 'F116', controller: 'DSE', description: 'Fuel Level Sender Open Circuit', severity: 'warning' },
      { code: 'F117', controller: 'DSE', description: 'Fuel Level Sender Short Circuit', severity: 'warning' },
      { code: 'F118', controller: 'DSE', description: 'Fuel Level Low Pre-alarm', severity: 'warning' },
      { code: 'F119', controller: 'DSE', description: 'Fuel Level Low Shutdown', severity: 'shutdown' },
      { code: 'A-FUEL-01', controller: 'ComAp', description: 'Fuel Level Input Failure', severity: 'warning' },
      { code: 'A-FUEL-02', controller: 'ComAp', description: 'Fuel Level Low Warning', severity: 'warning' },
      { code: 'A-FUEL-03', controller: 'ComAp', description: 'Fuel Level Critical - Shutdown', severity: 'shutdown' },
      { code: 'F21', controller: 'SmartGen', description: 'Fuel Level Abnormal', severity: 'warning' },
      { code: 'F22', controller: 'SmartGen', description: 'Low Fuel Alarm', severity: 'warning' }
    ],
    schematic: {
      ascii: `
┌──────────────────────────────────────────────────────────────────┐
│              FUEL LEVEL SENSOR - RESISTIVE TYPE                  │
│                     Operating Principle                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    FUEL TANK                                                      │
│    ╔═══════════════════════════════════════╗                     │
│    ║     FUEL INLET ─────────────►         ║                     │
│    ║                                       ║                     │
│    ║    ┌──────────────┐     FULL          ║                     │
│    ║    │   SENSOR     │      ●            ║                     │
│    ║    │   HOUSING    │      │            ║                     │
│    ║    │  ┌───────┐   │      │            ║                     │
│    ║    │  │ WIRE  │   │      │ FUEL       ║                     │
│    ║    │  │ WOUND │   │    ~~│~~~~        ║                     │
│    ║    │  │RESIST.│◄──┼──WIPER            ║  ← FUEL LEVEL       │
│    ║    │  │       │   │      │            ║                     │
│    ║    │  │       │   │      │            ║                     │
│    ║    │  └───────┘   │      │            ║                     │
│    ║    │              │      │            ║                     │
│    ║    │   FLOAT ARM ─┼──────┤            ║                     │
│    ║    │              │      │            ║                     │
│    ║    └──────────────┘    ◯ FLOAT        ║                     │
│    ║                         │             ║                     │
│    ║     EMPTY ──────────────●             ║                     │
│    ║                                       ║                     │
│    ║═══════════════════════════════════════╝                     │
│         ▲ FUEL OUTLET TO ENGINE                                  │
│                                                                   │
│    RESISTANCE vs LEVEL:                                          │
│    ┌────────────┬────────────┬────────────┐                     │
│    │   Level    │  Type A    │  Type B    │                     │
│    ├────────────┼────────────┼────────────┤                     │
│    │   Empty    │    0Ω      │   10Ω      │                     │
│    │   1/4      │   48Ω      │   53Ω      │                     │
│    │   1/2      │   95Ω      │   95Ω      │                     │
│    │   3/4      │  143Ω      │  138Ω      │                     │
│    │   Full     │  190Ω      │  180Ω      │                     │
│    └────────────┴────────────┴────────────┘                     │
└──────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌──────────────────────────────────────────────────────────────────┐
│                FUEL LEVEL SENSOR PINOUT                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    2-WIRE SENSOR:                  3-WIRE SENSOR:                │
│    ┌─────────────┐                ┌─────────────┐                │
│    │   ● SIGNAL  │                │   ● SIGNAL  │                │
│    │      (S)    │                │      (S)    │                │
│    │             │                │             │                │
│    │   ● GROUND  │                │   ● +5V REF │                │
│    │     (GND)   │                │      (V+)   │                │
│    └─────────────┘                │             │                │
│                                   │   ● GROUND  │                │
│    Wire Colors (typical):         │     (GND)   │                │
│    Signal: Yellow or Pink         └─────────────┘                │
│    Ground: Black                                                  │
│                                   Wire Colors (typical):          │
│                                   Signal: Yellow                  │
│                                   +5V: Red                        │
│                                   Ground: Black                   │
│                                                                   │
│    DSE CONNECTION:                ComAp CONNECTION:              │
│    Pin 1 → Signal (F+)            Analog Input → Signal          │
│    Pin 2 → Ground (F-)            GND → Ground                   │
│                                   (Configure as 0-190Ω)           │
└──────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌──────────────────────────────────────────────────────────────────┐
│               FUEL LEVEL SENSOR WIRING DIAGRAM                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌─────────────────────────────────────────────────────────┐   │
│    │                  GENERATOR CONTROLLER                    │   │
│    │                    (DSE 7320 shown)                      │   │
│    │  ┌─────────────────────────────────────────────────┐   │   │
│    │  │                                                  │   │   │
│    │  │   FUEL LEVEL INPUT                              │   │   │
│    │  │   ────────────────                              │   │   │
│    │  │                                                  │   │   │
│    │  │   Pin 26 (F+) ●───────────────────────────┐     │   │   │
│    │  │                                            │     │   │   │
│    │  │   Pin 27 (F-) ●─────────────────────┐     │     │   │   │
│    │  │                                      │     │     │   │   │
│    │  │   Internal 5V Reference ─┐          │     │     │   │   │
│    │  │                          │          │     │     │   │   │
│    │  │   ┌──────────┐          │          │     │     │   │   │
│    │  │   │   1kΩ    │          │          │     │     │   │   │
│    │  │   │ Pull-up  │◄─────────┘          │     │     │   │   │
│    │  │   └────┬─────┘                     │     │     │   │   │
│    │  │        │                           │     │     │   │   │
│    │  │        └───────► ADC Input ◄───────┴─────┘     │   │   │
│    │  │                                                  │   │   │
│    │  └──────────────────────────────────────────────────┘   │   │
│    └─────────────────────────────────────────────────────────┘   │
│                                      │         │                  │
│                               Signal │         │ Ground           │
│                                      │         │                  │
│                              ┌───────┴─────────┴───────┐         │
│                              │    JUNCTION BOX         │         │
│                              │    (if required)        │         │
│                              └───────┬─────────┬───────┘         │
│                                      │         │                  │
│                               Shielded Cable (2-core)             │
│                               Max length: 25 meters               │
│                                      │         │                  │
│                              ┌───────┴─────────┴───────┐         │
│                              │    FUEL LEVEL SENSOR    │         │
│                              │                         │         │
│                              │   ┌─────────────────┐   │         │
│                              │   │  Wire-wound     │   │         │
│                              │   │  Resistor       │   │         │
│                              │   │  0-190Ω        │   │         │
│                              │   └─────────────────┘   │         │
│                              │          │              │         │
│                              │       ◯ Float          │         │
│                              └─────────────────────────┘         │
│                                                                   │
│    NOTES:                                                        │
│    1. Use shielded cable, ground shield at controller end only   │
│    2. Keep cable away from high-current paths                    │
│    3. Install inline fuse if sensor susceptible to short         │
└──────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Resistance Range': '0-190Ω or 10-180Ω (configurable)',
      'Operating Voltage': '5-12 VDC',
      'Maximum Current': '25mA',
      'Operating Temperature': '-40°C to +85°C',
      'Tank Depth Range': '150mm to 2500mm',
      'Accuracy': '±3% of full scale',
      'Repeatability': '±1%',
      'Response Time': '< 1 second',
      'Float Material': 'Nitrile/NBR (diesel compatible)',
      'Housing Material': 'Brass or Stainless Steel',
      'Thread Size': '1-1/4" NPT, 2" NPT, G2 BSP (varies)',
      'Protection Rating': 'IP68',
      'Vibration Resistance': '20G',
      'Lifespan': '> 1 million cycles'
    },
    commonFailures: [
      'Float perforation allowing fuel ingress (sinks)',
      'Wiper contact wear causing dead spots',
      'Resistor element corrosion from fuel contamination',
      'Float arm fatigue fracture from vibration',
      'Seal failure allowing fuel vapor into housing',
      'Thread corrosion preventing removal'
    ],
    testProcedure: [
      '1. Disconnect sensor wiring from controller',
      '2. Measure resistance between Signal and Ground terminals',
      '3. Note reading (should correspond to current fuel level)',
      '4. Manually move float arm if accessible',
      '5. Verify resistance changes smoothly through range',
      '6. Check for dead spots where resistance jumps',
      '7. Measure at empty position (should be near 0Ω or 10Ω)',
      '8. Measure at full position (should be near 190Ω or 180Ω)',
      '9. Check continuity of wiring to controller',
      '10. Verify controller input matches expected reading'
    ],
    replacementInterval: 'Replace every 7-10 years or when readings become erratic. Inspect annually for signs of deterioration.',
    partNumbers: [
      { brand: 'DSE', oem: 'DSE127', aftermarket: ['KUS S3-S5 Series', 'Wema S3-E350'] },
      { brand: 'VDO', oem: '224-011-000-350G', aftermarket: ['Osculati 27.165.xx', 'Teleflex NLA'] },
      { brand: 'Rochester', oem: 'F8M0-9275-AE', aftermarket: ['AC Delco SK1203', 'Dorman 911-051'] },
      { brand: 'ComAp', oem: 'N/A (OEM sensor)', aftermarket: ['Fozmula 80410', 'Silea S5'] }
    ]
  },

  // ==================== EXHAUST TEMPERATURE SENSOR ====================
  {
    id: 'exhaust-temp-egt',
    name: 'Exhaust Gas Temperature Sensor (Type K Thermocouple)',
    category: 'temperature',
    type: 'Type K Thermocouple',
    range: '-40°C to +1200°C',
    output: '0-50mV (Type K)',
    accuracy: '±2.2°C or ±0.75% (whichever greater)',
    applications: ['Turbo Protection', 'DPF Regeneration', 'Engine Derating', 'Combustion Analysis'],
    compatibleControllers: ['DSE 7320', 'DSE 8610', 'DSE 8660', 'ComAp InteliGen', 'ComAp InteliSys', 'Woodward easYgen', 'SmartGen HGM9000'],
    description: [
      'The Type K thermocouple exhaust gas temperature (EGT) sensor is critical for monitoring engine exhaust temperatures in turbocharged diesel generators. Operating on the Seebeck effect, this sensor measures temperatures at the exhaust manifold, turbocharger inlet, or diesel particulate filter (DPF) to protect against thermal damage and optimize combustion. Type K thermocouples use a junction of Chromel (Ni-Cr) and Alumel (Ni-Al) wires, producing a voltage output proportional to the temperature difference between the hot junction (sensing tip) and cold junction (controller input).',
      'In generator applications, EGT monitoring serves multiple purposes: detecting turbocharger failures before catastrophic damage occurs, triggering DPF regeneration cycles when exhaust temperatures indicate sufficient soot loading, implementing power derating when sustained high exhaust temperatures threaten engine longevity, and identifying cylinder imbalances through per-cylinder EGT comparison. Advanced controllers like the DSE 8610 MKII support multiple EGT inputs for comprehensive exhaust system monitoring.',
      'The sensor construction features an Inconel or stainless steel sheath to withstand extreme temperatures and corrosive exhaust gases. Probe lengths vary from 50mm for manifold installations to 300mm for exhaust stack mounting. Grounded junction types offer faster response times but can introduce ground loops in some installations; isolated (ungrounded) junctions eliminate ground loop issues but respond slightly slower. Exposed junction types provide the fastest response but have limited durability in harsh exhaust environments.'
    ],
    workingPrinciple: [
      'The Seebeck effect occurs when two dissimilar metals are joined at a point (the hot junction) and a temperature difference exists between this junction and the other end of the wires (the cold junction). This temperature gradient causes charge carriers to diffuse from hot to cold regions at different rates in each metal, creating a net voltage difference. For Type K thermocouples, this voltage is approximately 41 microvolts per degree Celsius across the measurement range.',
      'Generator controllers measure this small voltage using a high-impedance, low-noise analog input with cold junction compensation. Because the thermocouple output is referenced to the cold junction temperature, the controller must measure or estimate the cold junction temperature (at its terminals) and add a compensating voltage to obtain the true hot junction temperature. This compensation is typically handled automatically by the controller firmware using an integrated cold junction temperature sensor on the input module.',
      'The measurement accuracy depends on proper cold junction compensation, thermocouple wire quality, and shielding from electromagnetic interference. Long thermocouple runs should use extension wire matched to the thermocouple type—using standard copper wire introduces additional thermocouple junctions at the connection points, causing measurement errors. Controllers typically apply averaging or filtering to EGT readings due to the pulsating nature of exhaust flow.'
    ],
    installation: [
      'Position the EGT probe at the recommended location: typically 50-100mm downstream of the exhaust valve for per-cylinder monitoring, or at the turbocharger inlet for turbo protection. Avoid locations where exhaust pulses from multiple cylinders merge, as turbulence can cause erratic readings. The probe should extend into the center of the exhaust flow stream—mounting too shallow causes low readings due to heat loss through the fitting.',
      'Use a compression fitting or weld-in boss appropriate for the exhaust pipe material. For stainless steel exhaust systems, use matching stainless hardware to prevent galvanic corrosion. Apply anti-seize compound rated for exhaust temperatures to the threads. Ensure the probe is oriented to avoid direct impingement from exhaust pulses, which can cause premature erosion of the sheath. Provide adequate strain relief for the thermocouple leads.',
      'Route thermocouple wiring away from high-current cables, ignition systems, and radio frequency sources. Use grounded metal conduit for runs through electrically noisy environments. Do not splice thermocouple wire with copper—use matching Type K extension wire or compensating cable throughout. At the controller, ensure proper polarity: the red (negative) Alumel wire typically connects to the negative input terminal. Verify the reading matches an infrared measurement at the probe location.'
    ],
    troubleshooting: [
      {
        symptom: 'EGT reading stuck at ambient temperature',
        possibleCauses: ['Thermocouple open circuit', 'Cold junction compensation failure', 'Probe burned through', 'Controller input failure'],
        diagnosticSteps: ['Measure thermocouple resistance (should be < 50Ω)', 'Check for voltage output at controller terminals', 'Inspect probe sheath for damage', 'Test with known-good thermocouple'],
        solution: ['Replace thermocouple if open circuit', 'Repair wiring connections', 'Replace damaged probe', 'Verify controller input configuration'],
        tools: ['Multimeter', 'Thermocouple simulator', 'Temperature calibrator']
      },
      {
        symptom: 'EGT reading erratic or noisy',
        possibleCauses: ['EMI interference', 'Poor connections', 'Damaged extension wire', 'Grounding issue'],
        diagnosticSteps: ['Check all wire connections', 'Inspect for damaged insulation', 'Verify shielding continuity', 'Check for ground loops'],
        solution: ['Improve shielding and routing', 'Replace damaged wire', 'Use isolated junction type', 'Separate from noise sources'],
        tools: ['Oscilloscope', 'Insulation tester', 'Shielded cable']
      }
    ],
    faultCodes: [
      { code: 'F130', controller: 'DSE', description: 'EGT Sensor Open Circuit', severity: 'warning' },
      { code: 'F131', controller: 'DSE', description: 'EGT Sensor Short Circuit', severity: 'warning' },
      { code: 'F132', controller: 'DSE', description: 'EGT High Pre-alarm', severity: 'warning' },
      { code: 'F133', controller: 'DSE', description: 'EGT High Shutdown', severity: 'shutdown' },
      { code: 'A-EGT-01', controller: 'ComAp', description: 'Exhaust Temperature Input Failure', severity: 'warning' },
      { code: 'A-EGT-02', controller: 'ComAp', description: 'Exhaust Over Temperature', severity: 'shutdown' },
      { code: 'F40', controller: 'SmartGen', description: 'EGT Sensor Fault', severity: 'warning' },
      { code: 'F41', controller: 'SmartGen', description: 'High Exhaust Temperature', severity: 'shutdown' }
    ],
    schematic: {
      ascii: `
┌──────────────────────────────────────────────────────────────────┐
│              EXHAUST GAS TEMPERATURE SENSOR                      │
│                Type K Thermocouple Construction                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌─────────────────────────────────────────────────┐           │
│    │              SENSOR ASSEMBLY                     │           │
│    │                                                  │           │
│    │    ┌────────────────────────────────────────┐   │           │
│    │    │     INCONEL/SS PROTECTION SHEATH       │   │           │
│    │    │  ┌──────────────────────────────────┐  │   │           │
│    │    │  │                                  │  │   │           │
│    │    │  │   CHROMEL (+) ═══════════════╗  │  │   │           │
│    │    │  │                              ║  │  │   │           │
│    │    │  │   ALUMEL (-) ════════════════╬══╣  │   │  HOT      │
│    │    │  │                              ║  ╠══╣  │  JUNCTION  │
│    │    │  │   MgO INSULATION ░░░░░░░░░░░░║══╣  │   │           │
│    │    │  │                              ║  │  │   │           │
│    │    │  └──────────────────────────────┘  │   │           │
│    │    │                                     │   │           │
│    │    └────────────────────────────────────────┘   │           │
│    │               ▲                                  │           │
│    │               │                                  │           │
│    │    COMPRESSION FITTING OR WELD BOSS             │           │
│    │                                                  │           │
│    └─────────────────────────────────────────────────┘           │
│                   │                  │                            │
│                   │ CHROMEL (Yellow) │ ALUMEL (Red)               │
│                   │ Positive (+)     │ Negative (-)               │
│                   │                  │                            │
│    TYPE K OUTPUT vs TEMPERATURE:                                  │
│    ┌─────────────┬─────────────┬─────────────┐                   │
│    │    Temp     │   Voltage   │   Typical   │                   │
│    ├─────────────┼─────────────┼─────────────┤                   │
│    │    0°C      │   0.000 mV  │   Cold ref  │                   │
│    │  100°C      │   4.096 mV  │   Warmup    │                   │
│    │  300°C      │  12.209 mV  │   Idle      │                   │
│    │  500°C      │  20.644 mV  │   Normal    │                   │
│    │  700°C      │  29.129 mV  │   High load │                   │
│    │  900°C      │  37.326 mV  │   Warning   │                   │
│    │ 1100°C      │  45.119 mV  │   Shutdown  │                   │
│    └─────────────┴─────────────┴─────────────┘                   │
│                                                                   │
│    JUNCTION TYPES:                                                │
│    ┌────────┐  ┌────────┐  ┌────────┐                            │
│    │GROUNDED│  │ISOLATED│  │EXPOSED │                            │
│    │   ╔═╗  │  │   ╔═╗  │  │   ╔═╗  │                            │
│    │   ║ ║  │  │   ║ ║  │  │   ║ ║  │                            │
│    │ ══╬═╬══│  │ ══╬═╬══│  │ ──╬═╬  │                            │
│    │   ╚═╝  │  │   │ │  │  │   ╚═╝  │                            │
│    │───────│  │   ╚═╝  │  │        │                            │
│    │ SHEATH │  │ OXIDE  │  │NO SHEATH│                            │
│    │CONTACT │  │BARRIER │  │ FASTEST │                            │
│    │ FAST   │  │ SLOWER │  │RESPONSE │                            │
│    └────────┘  └────────┘  └────────┘                            │
└──────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌──────────────────────────────────────────────────────────────────┐
│              EGT THERMOCOUPLE TERMINAL IDENTIFICATION            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    TYPE K THERMOCOUPLE WIRE COLORS (ANSI/ASTM):                  │
│    ┌──────────────────────────────────────────┐                  │
│    │  POSITIVE (+) CHROMEL = YELLOW           │                  │
│    │  NEGATIVE (-) ALUMEL  = RED              │                  │
│    │  OVERALL JACKET       = BROWN            │                  │
│    └──────────────────────────────────────────┘                  │
│                                                                   │
│    TYPE K THERMOCOUPLE WIRE COLORS (IEC):                        │
│    ┌──────────────────────────────────────────┐                  │
│    │  POSITIVE (+) CHROMEL = GREEN            │                  │
│    │  NEGATIVE (-) ALUMEL  = WHITE            │                  │
│    │  OVERALL JACKET       = GREEN            │                  │
│    └──────────────────────────────────────────┘                  │
│                                                                   │
│    CONNECTOR TYPES:                                               │
│    ┌─────────────────┐    ┌─────────────────┐                    │
│    │   MINI PLUG     │    │  STANDARD PLUG  │                    │
│    │   (Polarized)   │    │   (Polarized)   │                    │
│    │  ┌───┬───┐      │    │  ┌───┬───┐      │                    │
│    │  │ + │ - │      │    │  │ + │ - │      │                    │
│    │  │YEL│RED│      │    │  │YEL│RED│      │                    │
│    │  └───┴───┘      │    │  └───┴───┘      │                    │
│    │   YELLOW BODY   │    │   YELLOW BODY   │                    │
│    └─────────────────┘    └─────────────────┘                    │
│                                                                   │
│    DSE 7320/8610 CONNECTION:                                     │
│    ┌──────────────────────────────────┐                          │
│    │  TC+ (Pin xx) ← Yellow (Chromel) │                          │
│    │  TC- (Pin xx) ← Red (Alumel)     │                          │
│    │  Shield → Controller Ground      │                          │
│    └──────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌──────────────────────────────────────────────────────────────────┐
│              EGT SENSOR WIRING - GENERATOR APPLICATION           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌─────────────────────────────────────────────────────────┐   │
│    │                  GENERATOR CONTROLLER                    │   │
│    │                     (DSE 8610 shown)                     │   │
│    │  ┌─────────────────────────────────────────────────┐   │   │
│    │  │   THERMOCOUPLE INPUT MODULE                      │   │   │
│    │  │   (Cold Junction Compensated)                    │   │   │
│    │  │                                                  │   │   │
│    │  │   TC1+ (Pin 12) ●────────────────────────┐      │   │   │
│    │  │                                           │      │   │   │
│    │  │   TC1- (Pin 13) ●──────────────────┐     │      │   │   │
│    │  │                                     │     │      │   │   │
│    │  │   ┌─────────────────┐              │     │      │   │   │
│    │  │   │ COLD JUNCTION   │              │     │      │   │   │
│    │  │   │ COMPENSATION    │              │     │      │   │   │
│    │  │   │ SENSOR (CJC)    │              │     │      │   │   │
│    │  │   └─────────────────┘              │     │      │   │   │
│    │  │                                     │     │      │   │   │
│    │  │   Shield GND ●──────────┐          │     │      │   │   │
│    │  └─────────────────────────┴──────────┴─────┴──────┘   │   │
│    └─────────────────────────────────────────────────────────┘   │
│                               │          │         │              │
│                            Shield     Red(-)    Yellow(+)        │
│                               │          │         │              │
│                        ┌──────┴──────────┴─────────┴────────┐    │
│                        │      TYPE K EXTENSION WIRE          │    │
│                        │      (Matched to thermocouple)      │    │
│                        │      Max length: 50 meters          │    │
│                        └──────┬──────────┬─────────┬────────┘    │
│                               │          │         │              │
│                        ┌──────┴──────────┴─────────┴────────┐    │
│                        │       TERMINAL HEAD                 │    │
│                        │       (Transition box)              │    │
│                        └──────────────────┬─────────────────┘    │
│                                           │                       │
│                        ┌──────────────────┴─────────────────┐    │
│                        │         EGT PROBE                   │    │
│                        │    ┌─────────────────────────┐     │    │
│                        │    │   ●═══════════════════●│     │    │
│                        │    │   Type K Junction      │     │    │
│                        │    └─────────────────────────┘     │    │
│                        │                                     │    │
│                        │    Installed in exhaust manifold    │    │
│                        │    or turbo inlet                   │    │
│                        └─────────────────────────────────────┘    │
│                                                                   │
│    CRITICAL NOTES:                                                │
│    ━━━━━━━━━━━━━━                                                │
│    1. Never use copper wire - only Type K extension wire         │
│    2. Observe polarity - reversed wires give wrong reading       │
│    3. Ground shield at controller end only                       │
│    4. Keep away from high-current cables                         │
│    5. Use transition head for high-temp connections              │
└──────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Thermocouple Type': 'Type K (Chromel-Alumel)',
      'Temperature Range': '-40°C to +1200°C (probe dependent)',
      'Output': '0 to 50mV (approximately 41µV/°C)',
      'Accuracy': '±2.2°C or ±0.75% (whichever greater)',
      'Response Time': '< 1 second (exposed junction)',
      'Sheath Material': 'Inconel 600 or SS316',
      'Sheath Diameter': '3mm, 4.5mm, 6mm typical',
      'Probe Length': '50-300mm (application dependent)',
      'Wire Gauge': '24 AWG, 20 AWG typical',
      'Insulation': 'MgO (Magnesium Oxide)',
      'Connection Type': 'Mini plug, Standard plug, or hardwired',
      'Vibration Resistance': '50G'
    },
    commonFailures: [
      'Junction separation from thermal cycling',
      'Sheath erosion from exhaust impingement',
      'Extension wire damage from heat',
      'Connector corrosion from moisture',
      'Drift from metallurgical changes at high temp',
      'Ground loops causing offset errors'
    ],
    testProcedure: [
      '1. Disconnect thermocouple from controller',
      '2. Measure resistance between leads (should be < 50Ω for short probes)',
      '3. Connect thermocouple simulator to controller input',
      '4. Verify controller reads simulated temperatures accurately',
      '5. Reconnect thermocouple and compare to known reference',
      '6. Use IR thermometer to verify approximate reading',
      '7. Check for noise by monitoring raw signal',
      '8. Verify cold junction compensation is functioning',
      '9. Inspect probe for physical damage',
      '10. Check extension wire connections for corrosion'
    ],
    replacementInterval: 'Inspect annually, replace every 3-5 years or when drift exceeds 1% of reading.',
    partNumbers: [
      { brand: 'Omega', oem: 'KMQXL-125G-12', aftermarket: ['Watlow G0140', 'Pyromation K24U'] },
      { brand: 'DSE', oem: 'DSE1620', aftermarket: ['RS Pro 123-8615', 'TC Direct 405-050'] },
      { brand: 'Cummins', oem: '3930235', aftermarket: ['PAI 650640', 'Alliant AP63467'] },
      { brand: 'CAT', oem: '1353703', aftermarket: ['Costex C1353703', 'Interstate M-1353703'] }
    ]
  },

  // ==================== BOOST PRESSURE SENSOR ====================
  {
    id: 'boost-pressure-map',
    name: 'Boost Pressure Sensor (Manifold Absolute Pressure)',
    category: 'pressure',
    type: 'Piezoresistive Strain Gauge',
    range: '0-4 bar absolute (0-60 psi)',
    output: '0.5-4.5V ratiometric',
    accuracy: '±1% full scale',
    applications: ['Turbocharger Monitoring', 'Air-Fuel Ratio Control', 'Smoke Limiting', 'Engine Protection'],
    compatibleControllers: ['DSE 7320', 'DSE 7310', 'ComAp InteliGen', 'ComAp InteliLite', 'Woodward easYgen', 'SmartGen HGM', 'PowerWizard'],
    description: [
      'The boost pressure sensor, also known as a MAP (Manifold Absolute Pressure) sensor, measures the pressure in the intake manifold downstream of the turbocharger. This critical measurement enables the engine control system and generator controller to monitor turbocharger performance, implement smoke limiting functions, and protect the engine from over-boost conditions. Modern piezoresistive sensors provide fast response times and excellent accuracy across the full operating range, essential for turbocharged diesel generators operating under rapidly changing loads.',
      'In generator applications, boost pressure monitoring serves several key functions. During load acceptance, the controller monitors boost build-up rate to determine when the turbocharger has spooled sufficiently to support the load—premature load application before adequate boost pressure can cause excessive smoke and potential engine damage. The relationship between boost pressure and fuel quantity defines the smoke limit curve stored in the engine ECU, preventing over-fueling before sufficient air is available for complete combustion.',
      'Boost pressure sensors typically use silicon piezoresistive technology where a micromachined silicon diaphragm flexes under applied pressure. Resistive elements integrated into the diaphragm change resistance proportionally to the strain caused by diaphragm deflection. Most sensors are configured as Wheatstone bridges for temperature compensation and maximum sensitivity. Output is typically ratiometric (proportional to supply voltage) in the range of 0.5V to 4.5V, allowing the controller to detect both open and short circuit faults.'
    ],
    workingPrinciple: [
      'The piezoresistive boost sensor operates on the principle that mechanical stress changes the electrical resistance of silicon semiconductors. The sensing element consists of a thin silicon diaphragm with four piezoresistors diffused into the crystal structure in a Wheatstone bridge configuration. When manifold pressure acts on the diaphragm, it flexes slightly, stretching two resistors and compressing the other two. This differential resistance change produces a millivolt-level signal proportional to applied pressure.',
      'An integrated signal conditioning ASIC (Application Specific Integrated Circuit) amplifies and temperature-compensates the bridge output, converting it to the standard 0.5-4.5V output range. The ASIC also provides protection against reverse polarity, overvoltage, and EMI. Ratiometric output means the signal voltage is proportional to the supply voltage—if supply is 5.0V, output range is 0.5-4.5V; if supply drops to 4.8V, output range shifts to 0.48-4.32V. This ratiometric behavior provides inherent rejection of supply voltage variations.',
      'Generator controllers typically sample the boost pressure signal multiple times per engine revolution to capture the pulsating nature of manifold pressure in turbocharged engines. The raw readings are averaged to obtain a stable value for display and control decisions. Rate-of-change calculations help detect sudden turbocharger failures—a rapid drop in boost pressure at constant load indicates potential compressor surge or shaft failure requiring immediate attention.'
    ],
    installation: [
      'The boost pressure sensor should be installed in the intake manifold or plenum at a location representative of average manifold pressure. Avoid positions directly in the path of intake airflow, which can cause dynamic pressure errors. A short tube or boss mounted perpendicular to the airflow works best. The sensor should be mounted above the manifold to prevent condensation and oil accumulation in the pressure port, or use a drain loop if mounting below.',
      'Connect the sensor using the manufacturer-specified connector—most automotive-style MAP sensors use a 3-pin Metri-Pack or AMP Junior Timer connector. Apply dielectric grease to the connector pins to prevent moisture intrusion. Route the wiring harness away from exhaust components and high-voltage ignition sources. For installations in harsh environments, consider adding a protective boot over the connector.',
      'After installation, verify the sensor output at atmospheric pressure (engine off)—it should read approximately 1.0V for a standard 0-4 bar absolute sensor at sea level. Start the engine and verify readings at idle (typically 0.9-1.1 bar absolute) and under load (varies with turbo size, typically 1.5-3.5 bar absolute). Program the controller alarm setpoints based on engine manufacturer specifications for maximum permissible boost pressure.'
    ],
    troubleshooting: [
      {
        symptom: 'Boost pressure reading stuck at 0.5V',
        possibleCauses: ['Pressure port blocked', 'Sensor internal failure', 'Wiring open circuit', 'Reference voltage missing'],
        diagnosticSteps: ['Check for debris in pressure port', 'Verify 5V reference at sensor', 'Apply known pressure and observe output', 'Check wiring continuity'],
        solution: ['Clear blockage from port', 'Verify controller provides 5V ref', 'Replace sensor if no output', 'Repair open wiring'],
        tools: ['Multimeter', 'Pressure calibrator', 'Vacuum hand pump']
      },
      {
        symptom: 'Erratic boost readings',
        possibleCauses: ['Loose connections', 'EMI interference', 'Intake leak causing real fluctuations', 'Failing sensor'],
        diagnosticSteps: ['Check all connections', 'Monitor signal with oscilloscope', 'Inspect intake system for leaks', 'Compare with reference gauge'],
        solution: ['Tighten connections', 'Improve shielding', 'Repair intake leaks', 'Replace sensor if fault confirmed'],
        tools: ['Oscilloscope', 'Reference pressure gauge', 'Smoke machine']
      }
    ],
    faultCodes: [
      { code: 'F140', controller: 'DSE', description: 'Boost Pressure Sensor Open Circuit', severity: 'warning' },
      { code: 'F141', controller: 'DSE', description: 'Boost Pressure Sensor Short Circuit', severity: 'warning' },
      { code: 'F142', controller: 'DSE', description: 'Boost Pressure High Warning', severity: 'warning' },
      { code: 'F143', controller: 'DSE', description: 'Boost Pressure High Shutdown', severity: 'shutdown' },
      { code: 'A-BPS-01', controller: 'ComAp', description: 'Boost Pressure Input Failure', severity: 'warning' },
      { code: 'A-BPS-02', controller: 'ComAp', description: 'Over Boost Warning', severity: 'warning' },
      { code: 'F33', controller: 'SmartGen', description: 'Boost Sensor Abnormal', severity: 'warning' },
      { code: 'F34', controller: 'SmartGen', description: 'Turbo Over-boost', severity: 'shutdown' }
    ],
    schematic: {
      ascii: `
┌──────────────────────────────────────────────────────────────────┐
│              BOOST PRESSURE SENSOR (MAP TYPE)                    │
│                   Piezoresistive Construction                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    SENSOR CROSS-SECTION:                                         │
│    ┌──────────────────────────────────────────┐                  │
│    │           CONNECTOR PINS                  │                  │
│    │           │    │    │                     │                  │
│    │           │ 5V│SIG │GND                   │                  │
│    │    ┌──────┴────┴────┴─────┐              │                  │
│    │    │  SIGNAL CONDITIONING │              │                  │
│    │    │        ASIC          │              │                  │
│    │    │  ┌────────────────┐  │              │                  │
│    │    │  │ AMPLIFIER      │  │              │                  │
│    │    │  │ TEMP COMP      │  │              │                  │
│    │    │  │ PROTECTION     │  │              │                  │
│    │    │  └────────────────┘  │              │                  │
│    │    └───────────┬──────────┘              │                  │
│    │                │                          │                  │
│    │    ┌───────────┴──────────┐              │                  │
│    │    │   SILICON DIAPHRAGM   │              │                  │
│    │    │  ┌──────────────┐    │              │                  │
│    │    │  │  R1      R2  │    │              │                  │
│    │    │  │   ╲    ╱     │    │              │                  │
│    │    │  │    ╲  ╱      │    │   REFERENCE  │                  │
│    │    │  │     ╲╱       │◄───│── VACUUM     │                  │
│    │    │  │     ╱╲       │    │   CHAMBER    │                  │
│    │    │  │    ╱  ╲      │    │              │                  │
│    │    │  │   ╱    ╲     │    │              │                  │
│    │    │  │  R3      R4  │    │              │                  │
│    │    │  └──────────────┘    │              │                  │
│    │    └──────────────────────┘              │                  │
│    │                │                          │                  │
│    │                │ PRESSURE PORT            │                  │
│    │                ▼                          │                  │
│    │    ═══════════════════════               │                  │
│    │    MANIFOLD PRESSURE INPUT               │                  │
│    └──────────────────────────────────────────┘                  │
│                                                                   │
│    WHEATSTONE BRIDGE CONFIGURATION:                              │
│                                                                   │
│           +5V Reference                                           │
│               │                                                   │
│           ┌───┴───┐                                              │
│           │       │                                              │
│          [R1]   [R2]                                             │
│           │       │                                              │
│           ├───●───┤──── Signal Output (0.5-4.5V)                │
│           │       │                                              │
│          [R3]   [R4]                                             │
│           │       │                                              │
│           └───┬───┘                                              │
│               │                                                   │
│              GND                                                  │
│                                                                   │
│    OUTPUT vs PRESSURE (typical 0-4 bar sensor):                  │
│    ┌──────────┬──────────┬──────────────────┐                   │
│    │ Pressure │  Output  │   Application    │                   │
│    ├──────────┼──────────┼──────────────────┤                   │
│    │  0.0 bar │   0.5V   │   Port blocked   │                   │
│    │  1.0 bar │   1.5V   │   Atmospheric    │                   │
│    │  2.0 bar │   2.5V   │   Light boost    │                   │
│    │  3.0 bar │   3.5V   │   Normal boost   │                   │
│    │  4.0 bar │   4.5V   │   Max boost      │                   │
│    └──────────┴──────────┴──────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘`,
      pinout: `
┌──────────────────────────────────────────────────────────────────┐
│                BOOST PRESSURE SENSOR PINOUT                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    3-PIN METRI-PACK CONNECTOR (GM/Delphi style):                 │
│    ┌─────────────────────────────┐                               │
│    │     ┌───┬───┬───┐          │                               │
│    │     │ A │ B │ C │          │                               │
│    │     └───┴───┴───┘          │                               │
│    │                             │                               │
│    │   A = Ground (Black)        │                               │
│    │   B = Signal (Green/Yellow) │                               │
│    │   C = 5V Reference (Orange) │                               │
│    └─────────────────────────────┘                               │
│                                                                   │
│    3-PIN BOSCH CONNECTOR:                                        │
│    ┌─────────────────────────────┐                               │
│    │       ┌─────────┐          │                               │
│    │      ╱│ 1  2  3 │╲         │                               │
│    │     ╱ └─────────┘ ╲        │                               │
│    │                             │                               │
│    │   1 = Ground                │                               │
│    │   2 = Signal Output         │                               │
│    │   3 = 5V Supply             │                               │
│    └─────────────────────────────┘                               │
│                                                                   │
│    DSE CONTROLLER CONNECTION:                                    │
│    ┌──────────────────────────────────────────┐                  │
│    │   Pin xx (5V REF) ───────── Sensor Pin C │                  │
│    │   Pin xx (ANA IN) ───────── Sensor Pin B │                  │
│    │   Pin xx (ANA GND) ──────── Sensor Pin A │                  │
│    │   Configure: 0.5-4.5V = 0-4 bar          │                  │
│    └──────────────────────────────────────────┘                  │
│                                                                   │
│    ComAp CONNECTION:                                              │
│    ┌──────────────────────────────────────────┐                  │
│    │   +5V Supply ───────────── Sensor Pin C  │                  │
│    │   Analog Input ─────────── Sensor Pin B  │                  │
│    │   GND ──────────────────── Sensor Pin A  │                  │
│    │   Configure as ratiometric input         │                  │
│    └──────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────┘`,
      wiring: `
┌──────────────────────────────────────────────────────────────────┐
│              BOOST PRESSURE SENSOR WIRING DIAGRAM                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌─────────────────────────────────────────────────────────┐   │
│    │                  GENERATOR CONTROLLER                    │   │
│    │                     (DSE 7320 shown)                     │   │
│    │  ┌─────────────────────────────────────────────────┐   │   │
│    │  │   ANALOG INPUT MODULE                            │   │   │
│    │  │                                                  │   │   │
│    │  │   +5V REF (Pin 22) ●─────────────────────┐      │   │   │
│    │  │                                           │      │   │   │
│    │  │   ANA IN (Pin 23) ●────────────────┐     │      │   │   │
│    │  │                                     │     │      │   │   │
│    │  │   ANA GND (Pin 24) ●──────────┐    │     │      │   │   │
│    │  │                                │    │     │      │   │   │
│    │  │   ┌──────────────────────┐    │    │     │      │   │   │
│    │  │   │  12-bit ADC          │    │    │     │      │   │   │
│    │  │   │  Input protection    │◄───┴────┴─────┘      │   │   │
│    │  │   │  Filtering           │                       │   │   │
│    │  │   └──────────────────────┘                       │   │   │
│    │  └──────────────────────────────────────────────────┘   │   │
│    └─────────────────────────────────────────────────────────┘   │
│                               │         │         │               │
│                            Ground    Signal    +5V Ref            │
│                               │         │         │               │
│                        ┌──────┴─────────┴─────────┴──────┐       │
│                        │       3-CORE SHIELDED CABLE      │       │
│                        │       Max length: 10 meters      │       │
│                        └──────┬─────────┬─────────┬──────┘       │
│                               │         │         │               │
│                        ┌──────┴─────────┴─────────┴──────┐       │
│                        │     BOOST PRESSURE SENSOR        │       │
│                        │                                  │       │
│                        │   ┌──────────────────────────┐  │       │
│                        │   │        INTAKE            │  │       │
│                        │   │       MANIFOLD           │  │       │
│                        │   │         ╱ ╲              │  │       │
│                        │   │        ╱   ╲             │  │       │
│                        │   │  ═════╱═════╲═════      │  │       │
│                        │   │       │SENSOR│           │  │       │
│                        │   │       │ BOSS │           │  │       │
│                        │   │       └──────┘           │  │       │
│                        │   └──────────────────────────┘  │       │
│                        └──────────────────────────────────┘       │
│                                                                   │
│    TURBOCHARGER SYSTEM INTEGRATION:                              │
│                                                                   │
│    ┌──────────────────────────────────────────────────────┐      │
│    │                                                      │      │
│    │   AIR ──► FILTER ──► COMPRESSOR ──►┌─────────┐      │      │
│    │           INLET      (TURBO)       │ INTAKE  │      │      │
│    │                         │          │MANIFOLD │◄─SENSOR     │
│    │                         │          └─────────┘      │      │
│    │                         │               │           │      │
│    │                     ┌───┴───┐           ▼           │      │
│    │   EXHAUST ◄──────── │TURBINE│◄──── ENGINE          │      │
│    │                     └───────┘                       │      │
│    └──────────────────────────────────────────────────────┘      │
│                                                                   │
│    INSTALLATION NOTES:                                            │
│    1. Mount sensor above manifold to prevent oil pooling         │
│    2. Use short tubing if remote mounting required               │
│    3. Avoid locations with direct airflow impingement            │
│    4. Protect connector from heat and vibration                  │
└──────────────────────────────────────────────────────────────────┘`
    },
    specifications: {
      'Pressure Range': '0-4 bar absolute (0-60 psi)',
      'Output Type': 'Ratiometric 0.5-4.5V',
      'Supply Voltage': '4.75-5.25 VDC',
      'Current Consumption': '< 10mA',
      'Accuracy': '±1% full scale',
      'Response Time': '< 1 ms',
      'Operating Temperature': '-40°C to +125°C',
      'Media Temperature': '-40°C to +125°C',
      'Burst Pressure': '10 bar',
      'Vibration': '20G, 10-2000Hz',
      'Connection': '3-pin Metri-Pack or Bosch',
      'Weight': '25 grams typical'
    },
    commonFailures: [
      'Diaphragm rupture from pressure spikes',
      'Connector terminal corrosion',
      'Drift from thermal cycling',
      'Port blockage from carbon/oil deposits',
      'Internal ASIC failure',
      'Wire chafing near exhaust components'
    ],
    testProcedure: [
      '1. Verify 5V reference at sensor connector',
      '2. Measure output at atmospheric pressure (~1.5V)',
      '3. Apply known pressure using calibrator',
      '4. Verify output linearity through range',
      '5. Check for stable output (no noise)',
      '6. Inspect pressure port for blockage',
      '7. Check connector for corrosion',
      '8. Verify wiring insulation integrity',
      '9. Compare reading with reference gauge on manifold',
      '10. Monitor signal during engine operation'
    ],
    replacementInterval: 'Replace every 5-7 years or when accuracy drifts beyond 2% of full scale.',
    partNumbers: [
      { brand: 'Bosch', oem: '0261230013', aftermarket: ['Delphi PS10075', 'Standard AS312'] },
      { brand: 'DSE', oem: 'DSE855', aftermarket: ['Honeywell MLH040BGT01A', 'Sensata 100CP2-02'] },
      { brand: 'Cummins', oem: '4921501', aftermarket: ['PAI 450323', 'Alliant Power AP63492'] },
      { brand: 'CAT', oem: '2746720', aftermarket: ['Costex C2746720', 'Interstate M-2746720'] }
    ]
  }
];

// ==================== SENSOR CATEGORIES ====================
const SENSOR_CATEGORIES: { id: SensorCategory; name: string; icon: string; description: string }[] = [
  { id: 'temperature', name: 'Temperature Sensors', icon: '🌡️', description: 'Coolant, oil, exhaust, ambient temperature monitoring' },
  { id: 'pressure', name: 'Pressure Sensors', icon: '⏲️', description: 'Oil pressure, fuel pressure, boost pressure, crankcase pressure' },
  { id: 'speed', name: 'Speed Sensors', icon: '⚡', description: 'Engine RPM, alternator frequency, turbo speed' },
  { id: 'level', name: 'Level Sensors', icon: '📊', description: 'Fuel level, coolant level, oil level monitoring' },
  { id: 'electrical', name: 'Electrical Sensors', icon: '🔌', description: 'Voltage, current, power factor, frequency' },
  { id: 'position', name: 'Position Sensors', icon: '📍', description: 'Throttle position, governor actuator, valve position' },
  { id: 'flow', name: 'Flow Sensors', icon: '💧', description: 'Fuel flow, coolant flow, air flow measurement' },
  { id: 'vibration', name: 'Vibration Sensors', icon: '📳', description: 'Engine vibration, bearing condition monitoring' }
];

// ==================== MAIN COMPONENT ====================
export default function SensorDiagnosticsPanel() {
  const [selectedCategory, setSelectedCategory] = useState<SensorCategory | 'all'>('all');
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'troubleshooting' | 'schematic' | 'specs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSensors = SENSOR_DATABASE.filter(sensor => {
    const matchesCategory = selectedCategory === 'all' || sensor.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-green-500/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <span className="text-3xl">🔬</span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Sensor Diagnostics Bible
              </span>
            </h2>
            <p className="text-slate-500 text-sm">
              Comprehensive sensor library • {SENSOR_DATABASE.length} sensors • All controller brands
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sensors..."
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none min-w-[200px]"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          All Sensors
        </button>
        {SENSOR_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sensor List */}
        <div className="col-span-12 lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-2">
          {filteredSensors.map(sensor => (
            <motion.div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSensor?.id === sensor.id
                  ? 'bg-green-500/10 border-green-500/50'
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-green-500/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {SENSOR_CATEGORIES.find(c => c.id === sensor.category)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{sensor.name}</h3>
                  <p className="text-xs text-slate-400">{sensor.type}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">
                      {sensor.range}
                    </span>
                    <span className="px-2 py-0.5 bg-green-500/20 rounded text-[10px] text-green-400">
                      {sensor.faultCodes.length} fault codes
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sensor Detail */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedSensor ? (
              <motion.div
                key={selectedSensor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
              >
                {/* Sensor Header */}
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-green-500/10 to-teal-500/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedSensor.name}</h2>
                      <p className="text-sm text-slate-400 mt-1">{selectedSensor.type} • {selectedSensor.range}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedSensor.compatibleControllers.slice(0, 5).map((ctrl, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                            {ctrl}
                          </span>
                        ))}
                        {selectedSensor.compatibleControllers.length > 5 && (
                          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-500">
                            +{selectedSensor.compatibleControllers.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-4xl">
                      {SENSOR_CATEGORIES.find(c => c.id === selectedSensor.category)?.icon}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700/50">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📖' },
                    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
                    { id: 'schematic', label: 'Schematics', icon: '📐' },
                    { id: 'specs', label: 'Specifications', icon: '📋' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                        {selectedSensor.description.map((para, i) => (
                          <p key={i} className="text-slate-300 text-sm leading-relaxed mb-4">{para}</p>
                        ))}
                      </div>

                      {/* Working Principle */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Working Principle</h3>
                        {selectedSensor.workingPrinciple.map((para, i) => (
                          <p key={i} className="text-slate-300 text-sm leading-relaxed mb-4">{para}</p>
                        ))}
                      </div>

                      {/* Installation */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Installation Guide</h3>
                        {selectedSensor.installation.map((para, i) => (
                          <p key={i} className="text-slate-300 text-sm leading-relaxed mb-4">{para}</p>
                        ))}
                      </div>

                      {/* Common Failures */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Common Failure Modes</h3>
                        <ul className="space-y-2">
                          {selectedSensor.commonFailures.map((failure, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-red-400 mt-1">⚠️</span>
                              {failure}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fault Codes */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Related Fault Codes</h3>
                        <div className="grid gap-2">
                          {selectedSensor.faultCodes.map((fault, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-lg border ${
                                fault.severity === 'shutdown' ? 'bg-red-500/10 border-red-500/30' :
                                fault.severity === 'critical' ? 'bg-orange-500/10 border-orange-500/30' :
                                'bg-amber-500/10 border-amber-500/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-white">{fault.code}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  fault.severity === 'shutdown' ? 'bg-red-500/20 text-red-400' :
                                  fault.severity === 'critical' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {fault.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 mt-1">{fault.description}</p>
                              <p className="text-xs text-slate-500 mt-1">{fault.controller}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'troubleshooting' && (
                    <div className="space-y-6">
                      {selectedSensor.troubleshooting.map((step, i) => (
                        <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                            <span>🔍</span> {step.symptom}
                          </h3>

                          {/* Possible Causes */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Possible Causes:</h4>
                            <ul className="space-y-1">
                              {step.possibleCauses.map((cause, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                                  <span className="text-red-400">•</span> {cause}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Diagnostic Steps */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Diagnostic Steps:</h4>
                            <ol className="space-y-1">
                              {step.diagnosticSteps.map((diag, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                                  <span className="text-cyan-400 font-bold">{j + 1}.</span> {diag}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Solution */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Solution:</h4>
                            <ul className="space-y-1">
                              {step.solution.map((sol, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-green-400">
                                  <span>✓</span> {sol}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tools Required */}
                          <div className="p-3 bg-slate-900/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Tools Required:</h4>
                            <div className="flex flex-wrap gap-2">
                              {step.tools.map((tool, j) => (
                                <span key={j} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                  🔧 {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Test Procedure */}
                      <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                        <h3 className="text-lg font-bold text-green-400 mb-4">Bench Test Procedure</h3>
                        <ol className="space-y-2">
                          {selectedSensor.testProcedure.map((step, i) => (
                            <li key={i} className="text-sm text-slate-300">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {activeTab === 'schematic' && (
                    <div className="space-y-6">
                      {/* Main Circuit Diagram */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Circuit Diagram</h3>
                        <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-[10px] sm:text-xs text-green-400 font-mono whitespace-pre">
                            {selectedSensor.schematic.ascii}
                          </pre>
                        </div>
                      </div>

                      {/* Connector Pinout */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Connector Pinout</h3>
                        <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-[10px] sm:text-xs text-cyan-400 font-mono whitespace-pre">
                            {selectedSensor.schematic.pinout}
                          </pre>
                        </div>
                      </div>

                      {/* Complete Wiring */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Complete Wiring Installation</h3>
                        <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-[10px] sm:text-xs text-amber-400 font-mono whitespace-pre">
                            {selectedSensor.schematic.wiring}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-6">
                      {/* Technical Specifications */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Technical Specifications</h3>
                        <div className="grid gap-2">
                          {Object.entries(selectedSensor.specifications).map(([key, value], i) => (
                            <div key={i} className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                              <span className="text-sm text-slate-400">{key}</span>
                              <span className="text-sm text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Part Numbers */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">Part Numbers</h3>
                        <div className="space-y-3">
                          {selectedSensor.partNumbers.map((part, i) => (
                            <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-white">{part.brand}</span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                                  OEM: {part.oem}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {part.aftermarket.map((am, j) => (
                                  <span key={j} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-mono">
                                    {am}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Replacement Interval */}
                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
                        <h3 className="text-sm font-bold text-amber-400 mb-2">Replacement Interval</h3>
                        <p className="text-sm text-slate-300">{selectedSensor.replacementInterval}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🔬</div>
                  <h3 className="text-xl font-bold text-white mb-2">Select a Sensor</h3>
                  <p className="text-slate-400">Choose a sensor from the list to view detailed diagnostics</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">🔬</div>
          <div className="text-2xl font-black text-green-400">{SENSOR_DATABASE.length}</div>
          <div className="text-xs text-slate-500">Sensor Types</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-black text-amber-400">
            {SENSOR_DATABASE.reduce((sum, s) => sum + s.faultCodes.length, 0)}
          </div>
          <div className="text-xs text-slate-500">Fault Codes</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">🔧</div>
          <div className="text-2xl font-black text-cyan-400">
            {SENSOR_DATABASE.reduce((sum, s) => sum + s.troubleshooting.length, 0)}
          </div>
          <div className="text-xs text-slate-500">Troubleshooting Guides</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">📐</div>
          <div className="text-2xl font-black text-purple-400">{SENSOR_DATABASE.length * 3}</div>
          <div className="text-xs text-slate-500">Schematic Diagrams</div>
        </div>
      </div>
    </div>
  );
}
