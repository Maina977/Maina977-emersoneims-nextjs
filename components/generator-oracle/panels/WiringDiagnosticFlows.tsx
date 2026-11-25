'use client';

/**
 * WITHDRAWN (safety withdrawal, management rule, 2026-11-25; review finding S7).
 *
 * The Wiring Diagrams > Diagnostics troubleshooting flows, moved unchanged out of
 * WiringDiagramsPanel.tsx. NOTHING MAY IMPORT THIS FILE until the flows are
 * corrected and independently re-verified: STOP and do-not-restart as step 1 for
 * low oil pressure, high temperature and overspeed; no running or cranking step
 * before a STOP is cleared; no figure without an OEM source.
 * tests/regression/oracle-safety-withdrawal-2026-11-25.test.ts enforces that no
 * shipped source imports it.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ControllerModel } from './WiringDiagramsPanel';

// ==================== DIAGNOSTIC TROUBLESHOOTING FLOWS ====================
interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  testPoint: { location: string; probes: string };
  expectedValue: string;
  failureIndicates: string;
  solution: string[];
  nextIfPass: string | null;
  nextIfFail: string | null;
  tools: string[];
  safetyWarning?: string;
}

interface DiagnosticFlow {
  id: string;
  symptom: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  steps: DiagnosticStep[];
  commonCauses: { cause: string; probability: number }[];
  partsNeeded: { name: string; partNumber: string; estimated: string }[];
}

export const DIAGNOSTIC_TROUBLESHOOTING: { [circuitId: string]: DiagnosticFlow[] } = {
  'power': [
    {
      id: 'no-power',
      symptom: 'Controller has no power / display blank',
      description: 'Generator controller shows no signs of life - no LEDs, no display, completely dead',
      category: 'Power Supply',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage at Battery Terminals',
          description: 'Measure voltage directly at battery terminals to verify battery condition',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: '12.4-14.4V (12V system) or 24.8-28.8V (24V system)',
          failureIndicates: 'Dead/discharged battery or charging system failure',
          solution: [
            'If voltage < 12V (12V system) or < 24V (24V system): Battery is discharged',
            'Check battery age - typical life is 3-5 years',
            'Load test battery: Should maintain >9.6V under 200A load for 12V systems',
            'Check alternator/charger output while engine running',
            'Replace battery if fails load test or is >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect battery before any major work. Hydrogen gas may be present - no sparks near battery.'
        },
        {
          id: 'step2',
          title: 'Check Voltage at Main Fuse Input',
          description: 'Verify power is reaching the main fuse from battery',
          testPoint: { location: 'Main fuse input terminal', probes: 'Red to fuse input, Black to chassis ground' },
          expectedValue: 'Same as battery voltage (within 0.2V)',
          failureIndicates: 'Open circuit between battery and fuse box - damaged cable or loose connection',
          solution: [
            'Inspect battery cable for damage, corrosion, or loose terminals',
            'Check battery isolator switch if equipped - ensure it is ON',
            'Clean and tighten all connections',
            'Check for corroded or burnt cable at terminals',
            'Replace battery cable if damaged (use minimum 2.5mm² / 14 AWG)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush', '10mm wrench']
        },
        {
          id: 'step3',
          title: 'Check Voltage at Main Fuse Output',
          description: 'Verify main fuse is not blown',
          testPoint: { location: 'Main fuse output terminal', probes: 'Red to fuse output, Black to chassis ground' },
          expectedValue: 'Same as input voltage (fuse intact)',
          failureIndicates: 'Blown main fuse - indicates short circuit or overload occurred',
          solution: [
            'DO NOT just replace fuse - find the cause first!',
            'Disconnect all loads from fuse output',
            'Check for short circuit to ground on output wiring',
            'Inspect wiring harness for chafed insulation',
            'Check controller for signs of damage/burning',
            'Once cause found and fixed, replace fuse with correct rating (typically 30A)'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Fuse puller'],
          safetyWarning: 'Never replace fuse with higher rating. This can cause fire.'
        },
        {
          id: 'step4',
          title: 'Check Voltage at Controller B+ Terminal',
          description: 'Verify power is reaching controller power input',
          testPoint: { location: 'Controller terminal B+ (Pin 1 typically)', probes: 'Red to B+ pin, Black to B- pin' },
          expectedValue: '8-35V DC (check controller spec)',
          failureIndicates: 'Open circuit between fuse and controller',
          solution: [
            'Trace wiring from fuse output to controller',
            'Check for damaged wire, loose connector, or corroded terminal',
            'Inspect any intermediate fuses or circuit breakers',
            'Check connector pins for pushed-out or damaged contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: minimum 2.5mm² for power supply'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Connector pin tool']
        },
        {
          id: 'step5',
          title: 'Verify Ground Connection',
          description: 'Check controller ground circuit integrity',
          testPoint: { location: 'Controller B- to chassis', probes: 'Measure resistance between B- and engine block' },
          expectedValue: '< 0.5 Ohms (near zero resistance)',
          failureIndicates: 'Poor ground connection causing controller malfunction',
          solution: [
            'Clean ground connection at chassis/engine block',
            'Check ground cable for damage or corrosion',
            'Ensure ground bolt is tight and making good metal contact',
            'Add secondary ground if primary is questionable',
            'Ground should be to unpainted metal surface'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter set to Ohms', 'Wire brush', 'Wrench']
        }
      ],
      commonCauses: [
        { cause: 'Dead or discharged battery', probability: 35 },
        { cause: 'Blown main fuse', probability: 25 },
        { cause: 'Loose or corroded battery terminal', probability: 20 },
        { cause: 'Faulty battery isolator switch', probability: 10 },
        { cause: 'Damaged power cable', probability: 7 },
        { cause: 'Failed controller (internal fault)', probability: 3 }
      ],
      partsNeeded: [
        { name: 'Main Fuse 30A', partNumber: 'MIDI-30A', estimated: 'KES 500-800' },
        { name: 'Battery Cable 2.5mm²', partNumber: 'BAT-CABLE-25', estimated: 'KES 300/m' },
        { name: 'Battery Terminal Clamp', partNumber: 'BAT-TERM-UNI', estimated: 'KES 400-600' }
      ]
    },
    {
      id: 'low-voltage',
      symptom: 'Controller resets / erratic behavior / dim display',
      description: 'Controller powers on but behaves erratically, resets randomly, or display is dim',
      category: 'Power Supply',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage Under Load',
          description: 'Measure voltage while cranking or with loads active',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should not drop below 10V (12V) or 20V (24V) while cranking',
          failureIndicates: 'Weak battery or poor connections causing voltage drop',
          solution: [
            'Battery capacity test required - replace if fails',
            'Check battery age (>4 years = suspect)',
            'Verify battery is correct capacity for application',
            'Check charging system output',
            'Look for parasitic drain when engine off'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check for Voltage Drop in Supply Circuit',
          description: 'Measure voltage drop across each connection point while loaded',
          testPoint: { location: 'Each connection from battery to controller', probes: 'Across each connection' },
          expectedValue: '< 0.2V drop at each connection point',
          failureIndicates: 'High resistance connection causing power loss',
          solution: [
            'Clean and tighten the connection showing high drop',
            'Apply dielectric grease after cleaning',
            'Replace terminals if corroded beyond cleaning',
            'Upgrade wire gauge if voltage drop persists',
            'Consider adding parallel power feed for long runs'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Charging Alternator Output',
          description: 'Verify alternator is charging battery properly when engine runs',
          testPoint: { location: 'Battery terminals with engine running', probes: 'Red to B+, Black to B-' },
          expectedValue: '13.8-14.4V (12V) or 27.6-28.8V (24V) at 1500 RPM',
          failureIndicates: 'Alternator not charging - battery will discharge',
          solution: [
            'Check alternator belt tension and condition',
            'Test alternator diodes with multimeter diode test',
            'Check D+ (field excite) wire connection',
            'Verify voltage regulator operation',
            'Replace alternator if output is low/absent'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Belt tension gauge']
        }
      ],
      commonCauses: [
        { cause: 'Weak/failing battery', probability: 40 },
        { cause: 'High resistance in power connections', probability: 25 },
        { cause: 'Faulty alternator/charger', probability: 20 },
        { cause: 'Undersized power wiring', probability: 10 },
        { cause: 'Excessive electrical load', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Battery (as specified)', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Terminals', partNumber: 'BAT-TERM-HD', estimated: 'KES 800-1,200' },
        { name: 'Alternator Belt', partNumber: 'Engine-specific', estimated: 'KES 2,000-5,000' }
      ]
    }
  ],
  'starting': [
    {
      id: 'no-crank',
      symptom: 'Engine does not crank when start command given',
      description: 'Start button pressed or auto-start commanded, but engine does not turn over at all',
      category: 'Starting System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Start Command from Controller',
          description: 'Check if controller is outputting start signal',
          testPoint: { location: 'Controller START output pin', probes: 'Red to START pin, Black to B-' },
          expectedValue: 'Battery voltage (B+) when start commanded',
          failureIndicates: 'Controller not sending start signal - check configuration or input conditions',
          solution: [
            'Check controller is in AUTO or MANUAL RUN mode',
            'Verify no active alarms blocking start (check fault codes)',
            'Check E-Stop is not engaged',
            'Verify run signal input if using external start',
            'Check controller programming - start parameters',
            'Reset controller if necessary'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Ensure engine cannot start unexpectedly during testing. Remove fuel shut-off connection if needed.'
        },
        {
          id: 'step2',
          title: 'Check Start Relay Coil Activation',
          description: 'Verify start relay coil is receiving power',
          testPoint: { location: 'Start relay coil terminals K1', probes: 'Across relay coil terminals' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between controller and relay',
          solution: [
            'Check wiring from controller START output to relay coil',
            'Inspect connectors for corrosion or damage',
            'Check for blown inline fuse if present',
            'Verify relay coil resistance (typical 50-150 ohms)',
            'Bypass controller output temporarily to test (jumper wire)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Start Relay Contact Operation',
          description: 'Verify relay contacts are closing when coil energized',
          testPoint: { location: 'Start relay output contacts', probes: 'Across N/O contacts' },
          expectedValue: '< 0.5 Ohms when coil energized (contacts closed)',
          failureIndicates: 'Relay contacts burnt/welded or relay failed',
          solution: [
            'Manually press relay to check mechanical operation',
            'Listen for relay click when coil energized',
            'Check contact resistance - should be near zero',
            'If contacts burnt, replace relay',
            'Use correct relay rating: minimum 30A for starter circuit'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Relay puller']
        },
        {
          id: 'step4',
          title: 'Check Voltage at Starter Solenoid',
          description: 'Verify battery voltage reaches starter solenoid S terminal',
          testPoint: { location: 'Starter solenoid S (signal) terminal', probes: 'Red to S terminal, Black to engine block' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between start relay and starter solenoid',
          solution: [
            'Check wiring from relay to solenoid for damage',
            'Verify all connections are tight and clean',
            'Check for neutral safety switch in circuit (if equipped)',
            'Inspect solenoid terminal for corrosion',
            'Bypass suspected switches to isolate fault'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step5',
          title: 'Test Starter Motor Directly',
          description: 'Apply battery voltage directly to starter solenoid to test motor',
          testPoint: { location: 'Starter solenoid', probes: 'Jumper from B+ to S terminal' },
          expectedValue: 'Engine should crank',
          failureIndicates: 'Starter motor or solenoid failure',
          solution: [
            'Check battery cables to starter - must handle 200+ amps',
            'Verify ground strap from engine to chassis',
            'Check starter mounting bolts are tight',
            'Test starter on bench if accessible',
            'Check ring gear for damage',
            'Replace starter if confirmed faulty'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Heavy jumper wire (10mm² min)', 'Wrench set'],
          safetyWarning: 'Engine will crank! Ensure in neutral, parking brake set, clear of rotating parts.'
        }
      ],
      commonCauses: [
        { cause: 'Faulty start relay', probability: 25 },
        { cause: 'Controller in wrong mode / alarm active', probability: 20 },
        { cause: 'Poor electrical connections', probability: 20 },
        { cause: 'Failed starter motor', probability: 15 },
        { cause: 'Neutral safety switch fault', probability: 10 },
        { cause: 'E-Stop engaged', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Start Relay 30A', partNumber: 'RELAY-30A-12V', estimated: 'KES 1,500-2,500' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' },
        { name: 'Starter Solenoid', partNumber: 'Engine-specific', estimated: 'KES 5,000-12,000' }
      ]
    },
    {
      id: 'slow-crank',
      symptom: 'Engine cranks slowly or struggles to turn over',
      description: 'Starter engages but engine turns over slowly, may not reach starting RPM',
      category: 'Starting System',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage During Cranking',
          description: 'Monitor voltage drop while engine is cranking',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should stay above 10V (12V system) or 20V (24V system)',
          failureIndicates: 'Weak battery - cannot deliver required cranking current',
          solution: [
            'Perform battery load test',
            'Check battery specific gravity if accessible',
            'Verify battery is correct CCA rating for engine',
            'Check for parasitic drain',
            'Replace battery if fails test or >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check Voltage Drop on Positive Cable',
          description: 'Measure voltage loss in positive battery cable during cranking',
          testPoint: { location: 'Battery B+ to Starter B+', probes: 'Red at battery, Black at starter' },
          expectedValue: '< 0.5V drop during cranking',
          failureIndicates: 'High resistance in positive cable or connections',
          solution: [
            'Clean battery terminal and starter connection',
            'Check cable for internal corrosion (green color)',
            'Verify correct cable gauge (minimum 16mm² / 6 AWG)',
            'Replace cable if corroded or undersized',
            'Ensure terminals are crimped/soldered properly'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Ground Circuit Voltage Drop',
          description: 'Measure voltage loss in ground circuit during cranking',
          testPoint: { location: 'Engine block to Battery B-', probes: 'Red at engine, Black at battery' },
          expectedValue: '< 0.3V drop during cranking',
          failureIndicates: 'Poor ground connection restricting current flow',
          solution: [
            'Clean ground connection at engine block',
            'Check ground strap for damage or corrosion',
            'Verify ground is to clean, unpainted surface',
            'Add additional ground strap if needed',
            'Check battery negative terminal condition'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush']
        },
        {
          id: 'step4',
          title: 'Check Engine Mechanical Resistance',
          description: 'Verify engine is not mechanically seized or tight',
          testPoint: { location: 'Crankshaft bolt', probes: 'Manual rotation test' },
          expectedValue: 'Engine should turn freely by hand with socket on crank',
          failureIndicates: 'Mechanical engine problem - hydro-lock, bearing failure, etc.',
          solution: [
            'Remove glow plugs/injectors and retry cranking',
            'If easier, check for hydro-lock (coolant/oil in cylinder)',
            'Inspect for mechanical damage',
            'Check valve timing if recently serviced',
            'Engine repair may be required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Large socket and breaker bar', 'Wrench set'],
          safetyWarning: 'Ensure engine cannot start. Remove fuel and ignition connections.'
        }
      ],
      commonCauses: [
        { cause: 'Weak/discharged battery', probability: 40 },
        { cause: 'Poor battery cable connections', probability: 25 },
        { cause: 'Undersized battery cables', probability: 15 },
        { cause: 'Starter motor wear', probability: 12 },
        { cause: 'Engine mechanical issue', probability: 8 }
      ],
      partsNeeded: [
        { name: 'Battery', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Cables', partNumber: '16mm² Cable', estimated: 'KES 500/m' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' }
      ]
    }
  ],
  'sensing': [
    {
      id: 'oil-pressure-fault',
      symptom: 'Low Oil Pressure warning/shutdown',
      description: 'Controller shows low oil pressure alarm or shuts down due to oil pressure fault',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Actual Oil Level',
          description: 'Check engine oil level on dipstick - most common cause',
          testPoint: { location: 'Engine dipstick', probes: 'Visual inspection' },
          expectedValue: 'Oil level between MIN and MAX marks',
          failureIndicates: 'Low oil level - add oil immediately',
          solution: [
            'Add correct grade oil (typically 15W-40 for diesel generators)',
            'Check for oil leaks under engine',
            'Inspect oil cooler connections',
            'Check turbo oil feed/drain lines',
            'Monitor consumption - should be <0.5L per 100 hours'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Clean rag', 'Correct grade oil'],
          safetyWarning: 'Allow engine to cool 5 minutes for accurate reading. Hot oil can burn.'
        },
        {
          id: 'step2',
          title: 'Test Oil Pressure Sensor Resistance',
          description: 'Check sensor output at atmospheric pressure (engine off)',
          testPoint: { location: 'Oil pressure sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: '10-20 Ohms at 0 PSI (VDO type) or 240 Ohms (US type)',
          failureIndicates: 'Sensor failure - stuck or damaged',
          solution: [
            'Compare reading to sensor specification sheet',
            'If open circuit (OL) or short circuit (0 Ohms) - replace sensor',
            'Clean sensor connector and retry',
            'Check for oil contamination of connector',
            'Replace sensor if out of spec'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Wiring from Sensor to Controller',
          description: 'Verify wiring integrity',
          testPoint: { location: 'Controller OIL input', probes: 'Measure resistance from controller to sensor' },
          expectedValue: 'Same as sensor reading (< 2 Ohms difference)',
          failureIndicates: 'Wiring fault - open or high resistance',
          solution: [
            'Inspect wiring for damage, chafing, or corrosion',
            'Check connector pins for pushed out or bent contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: 0.75mm² minimum'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step4',
          title: 'Verify Actual Oil Pressure with Mechanical Gauge',
          description: 'Install test gauge to measure real oil pressure',
          testPoint: { location: 'Oil pressure sensor port', probes: 'Mechanical gauge installation' },
          expectedValue: '25-65 PSI at operating temperature (varies by engine)',
          failureIndicates: 'Actual low oil pressure - engine problem!',
          solution: [
            'DO NOT RUN ENGINE with actual low oil pressure',
            'Check oil pump drive gear/chain',
            'Inspect oil pump pickup screen for blockage',
            'Check oil filter condition - replace if overdue',
            'Verify correct oil viscosity for temperature',
            'Internal engine wear may require rebuild'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Mechanical oil pressure gauge', 'Appropriate fitting'],
          safetyWarning: 'Running engine with low oil pressure will cause catastrophic damage in minutes.'
        }
      ],
      commonCauses: [
        { cause: 'Low oil level', probability: 35 },
        { cause: 'Faulty oil pressure sensor', probability: 30 },
        { cause: 'Wiring/connector problem', probability: 15 },
        { cause: 'Clogged oil filter', probability: 10 },
        { cause: 'Actual low oil pressure (pump/engine wear)', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Oil Pressure Sensor', partNumber: 'VDO 360-081-030-003', estimated: 'KES 4,000-7,000' },
        { name: 'Oil Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Engine Oil 15W-40 5L', partNumber: 'Shell Rimula R4', estimated: 'KES 4,000-6,000' }
      ]
    },
    {
      id: 'coolant-temp-fault',
      symptom: 'High Temperature warning/shutdown or wrong temp reading',
      description: 'Controller shows overtemp alarm, shuts down, or displays incorrect temperature',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Visual Inspection of Cooling System',
          description: 'Check coolant level, radiator condition, and for leaks',
          testPoint: { location: 'Radiator and expansion tank', probes: 'Visual inspection' },
          expectedValue: 'Coolant at correct level, no leaks, radiator clean',
          failureIndicates: 'Cooling system problem - actual overheating risk',
          solution: [
            'Top up coolant if low (50/50 antifreeze mix)',
            'Check for leaks at hoses, radiator, water pump',
            'Clean radiator fins if blocked with debris',
            'Check fan belt tension and condition',
            'Verify fan is spinning when engine hot'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Flashlight', 'Coolant pressure tester'],
          safetyWarning: 'Never open radiator cap when hot! Steam can cause severe burns.'
        },
        {
          id: 'step2',
          title: 'Test Coolant Temperature Sensor Resistance',
          description: 'Measure sensor resistance at known temperature',
          testPoint: { location: 'Coolant temp sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: 'NTC type: ~2500 Ohms at 20C, ~300 Ohms at 80C (varies by sensor)',
          failureIndicates: 'Sensor failure - incorrect readings',
          solution: [
            'Compare to sensor resistance chart for your sensor',
            'If reading is way off spec - replace sensor',
            'Clean connector contacts',
            'Check for coolant contamination of connector',
            'Replace sensor if out of specification'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Infrared thermometer']
        },
        {
          id: 'step3',
          title: 'Verify Controller Calibration',
          description: 'Check controller is configured for correct sensor type',
          testPoint: { location: 'Controller configuration', probes: 'Software/configuration check' },
          expectedValue: 'Sensor type matches installed sensor (NTC, PT100, etc.)',
          failureIndicates: 'Configuration mismatch causing wrong readings',
          solution: [
            'Check controller configuration for sensor type',
            'Verify sensor curve/range settings',
            'Match controller to actual sensor installed',
            'Use DSE/ComAp configuration software if needed',
            'Factory reset and reconfigure if necessary'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Configuration software', 'USB cable']
        },
        {
          id: 'step4',
          title: 'Verify Actual Engine Temperature',
          description: 'Use infrared thermometer to check real temperature',
          testPoint: { location: 'Thermostat housing', probes: 'IR thermometer aim' },
          expectedValue: '80-95C at operating temperature (varies by engine)',
          failureIndicates: 'If high: Actual overheating. If normal: Sensor/wiring fault',
          solution: [
            'If actually overheating: Stop engine, investigate cooling system',
            'Check thermostat is opening (housing should get hot)',
            'Verify water pump operation (flow in radiator)',
            'Check radiator cap seal',
            'Flush cooling system if contaminated'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Infrared thermometer']
        }
      ],
      commonCauses: [
        { cause: 'Low coolant level', probability: 25 },
        { cause: 'Faulty temperature sensor', probability: 25 },
        { cause: 'Blocked radiator', probability: 15 },
        { cause: 'Failed thermostat', probability: 15 },
        { cause: 'Wiring/connector problem', probability: 10 },
        { cause: 'Fan belt slip/failure', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Coolant Temperature Sensor', partNumber: 'Engine-specific NTC', estimated: 'KES 2,000-5,000' },
        { name: 'Thermostat', partNumber: 'Engine-specific', estimated: 'KES 3,000-8,000' },
        { name: 'Radiator Hose Set', partNumber: 'Engine-specific', estimated: 'KES 4,000-10,000' }
      ]
    },
    {
      id: 'speed-sensor-fault',
      symptom: 'No RPM reading / Overspeed fault / Erratic RPM display',
      description: 'Controller shows 0 RPM, false overspeed, or jumpy speed reading',
      category: 'Engine Sensing',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check MPU Sensor Air Gap',
          description: 'Verify magnetic pickup sensor is correctly positioned',
          testPoint: { location: 'MPU sensor tip to flywheel teeth', probes: 'Feeler gauge' },
          expectedValue: '0.5-1.0mm (0.020-0.040") air gap typical',
          failureIndicates: 'Gap too large = weak signal, too small = sensor damage risk',
          solution: [
            'Adjust MPU position - thread in until touches tooth, back off 1/2 turn',
            'Use feeler gauge for precise adjustment',
            'Check for flywheel teeth damage',
            'Ensure sensor is tight after adjustment',
            'Clean any metal debris from sensor tip'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Feeler gauge set', 'Appropriate wrench']
        },
        {
          id: 'step2',
          title: 'Test MPU Sensor Output',
          description: 'Measure AC voltage output while cranking',
          testPoint: { location: 'MPU sensor terminals', probes: 'AC Voltage, across sensor wires' },
          expectedValue: '0.5-5V AC while cranking (varies by sensor and speed)',
          failureIndicates: 'Weak or no signal - sensor failure',
          solution: [
            'Check sensor resistance (typically 200-2000 Ohms)',
            'Verify polarity connection (some controllers are polarity sensitive)',
            'Check for damaged sensor cable',
            'Replace sensor if no output',
            'Verify correct sensor type for controller'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter set to AC Volts']
        },
        {
          id: 'step3',
          title: 'Check Shielded Cable and Grounding',
          description: 'Verify MPU cable shielding is correctly connected',
          testPoint: { location: 'MPU shield wire', probes: 'Continuity check' },
          expectedValue: 'Shield connected to controller ground ONLY (not both ends)',
          failureIndicates: 'Ground loop causing interference',
          solution: [
            'Connect shield at controller end only',
            'Ensure shield is not touching engine ground at sensor end',
            'Route cable away from high-current wires',
            'Use twisted pair + shield cable',
            'Keep cable as short as practical'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step4',
          title: 'Check Controller Speed Settings',
          description: 'Verify flywheel teeth count and pickup configuration',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'Teeth count matches actual flywheel',
          failureIndicates: 'Wrong teeth count = wrong RPM display',
          solution: [
            'Count actual flywheel teeth (common: 113, 124, 140)',
            'Configure controller for correct teeth count',
            'Check pickup type setting (MPU/VR vs Hall effect)',
            'Verify pickup threshold voltage setting',
            'Save configuration and test'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Flashlight for counting teeth']
        }
      ],
      commonCauses: [
        { cause: 'Incorrect sensor air gap', probability: 30 },
        { cause: 'Faulty MPU sensor', probability: 25 },
        { cause: 'Shielding/grounding problem', probability: 20 },
        { cause: 'Wrong teeth count configuration', probability: 15 },
        { cause: 'Damaged sensor cable', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Magnetic Pickup Sensor', partNumber: 'MPU-5/8-18-UNF', estimated: 'KES 8,000-15,000' },
        { name: 'Shielded Cable 0.75mm²', partNumber: '2C-SHIELD-075', estimated: 'KES 400/m' }
      ]
    }
  ],
  'fuel': [
    {
      id: 'no-fuel',
      symptom: 'Engine cranks but does not start - no fuel',
      description: 'Engine turns over normally but will not fire. Fuel system suspect.',
      category: 'Fuel System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Fuel Tank Level',
          description: 'Check actual fuel level in tank',
          testPoint: { location: 'Fuel tank', probes: 'Visual or gauge check' },
          expectedValue: 'Minimum 1/4 tank for reliable operation',
          failureIndicates: 'Out of fuel or fuel gauge inaccurate',
          solution: [
            'Add fuel if tank is empty',
            'Check fuel gauge sender operation',
            'Bleed fuel system after running dry (diesel)',
            'Prime fuel pump if equipped with manual primer'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Fuel container if needed']
        },
        {
          id: 'step2',
          title: 'Check Fuel Solenoid Operation',
          description: 'Verify fuel solenoid opens when engine running',
          testPoint: { location: 'Fuel solenoid terminals', probes: 'DC Voltage during cranking' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Solenoid not energized - wiring or controller issue',
          solution: [
            'Check FUEL output from controller',
            'Verify solenoid coil continuity (typical 8-30 Ohms)',
            'Check for seized solenoid plunger',
            'Listen for solenoid click when energized',
            'Manually open solenoid to test (remove wire, apply B+)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Fuel Supply to Injection Pump',
          description: 'Verify fuel is reaching the injection pump',
          testPoint: { location: 'Injection pump inlet', probes: 'Crack fitting and crank' },
          expectedValue: 'Steady flow of fuel when cranking',
          failureIndicates: 'Fuel supply blockage or pump failure',
          solution: [
            'Check fuel filter condition - replace if overdue',
            'Inspect fuel lines for kinks or damage',
            'Verify fuel lift pump operation',
            'Check for air in fuel system - bleed as needed',
            'Check fuel tank pickup/strainer'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Open-end wrench', 'Container for fuel'],
          safetyWarning: 'Fuel is flammable. No smoking. Contain spills immediately.'
        },
        {
          id: 'step4',
          title: 'Check Injection Pump and Injectors',
          description: 'Verify injection pump is delivering fuel to injectors',
          testPoint: { location: 'Injector line union', probes: 'Crack fitting and crank' },
          expectedValue: 'Fuel spurts from loosened injector line',
          failureIndicates: 'Injection pump failure or timing issue',
          solution: [
            'If no fuel at injector - check injection pump timing',
            'Verify pump is mechanically driven (gear/belt)',
            'Check pump spline/coupling',
            'Injection pump may need professional service',
            'Check injector spray pattern'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Injector line wrench', 'Container'],
          safetyWarning: 'Diesel under high pressure can penetrate skin. Keep clear of spray.'
        }
      ],
      commonCauses: [
        { cause: 'Fuel solenoid not opening', probability: 30 },
        { cause: 'Clogged fuel filter', probability: 25 },
        { cause: 'Air in fuel system', probability: 20 },
        { cause: 'Empty fuel tank', probability: 10 },
        { cause: 'Fuel lift pump failure', probability: 10 },
        { cause: 'Injection pump failure', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Fuel Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Fuel Solenoid', partNumber: 'Engine-specific', estimated: 'KES 8,000-20,000' },
        { name: 'Fuel Lift Pump', partNumber: 'Engine-specific', estimated: 'KES 10,000-25,000' }
      ]
    }
  ],
  'generator': [
    {
      id: 'no-voltage',
      symptom: 'Generator produces no voltage output',
      description: 'Engine runs at correct speed but generator output is 0V or very low',
      category: 'Generator Output',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check Generator Voltage at Output Terminals',
          description: 'Measure voltage directly at generator output terminals',
          testPoint: { location: 'Generator output terminals L1-N', probes: 'AC Voltage L1 to Neutral' },
          expectedValue: '220-240V AC at rated speed (50Hz: 1500RPM, 60Hz: 1800RPM)',
          failureIndicates: 'No/low voltage at generator output',
          solution: [
            'Verify engine is running at correct speed (1500/1800 RPM)',
            'Check AVR (Automatic Voltage Regulator) condition',
            'Verify excitation supply to AVR',
            'Check for field flash procedure if generator was dormant'
          ],
          nextIfPass: 'step2',
          nextIfFail: 'step3',
          tools: ['AC Voltmeter', 'Tachometer/frequency meter']
        },
        {
          id: 'step2',
          title: 'Check Voltage at Controller Input',
          description: 'Verify voltage is reaching the controller sensing inputs',
          testPoint: { location: 'Controller GEN-L1 to GEN-N', probes: 'AC Voltage' },
          expectedValue: 'Same as generator output (±5V)',
          failureIndicates: 'Sensing circuit fault - fuses, wiring',
          solution: [
            'Check voltage sensing fuses (usually 1-2A)',
            'Inspect wiring from generator to controller',
            'Verify correct phase connection',
            'Check for loose terminals'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step3',
          title: 'Check AVR Power Supply',
          description: 'Verify AVR is receiving power',
          testPoint: { location: 'AVR input terminals', probes: 'AC Voltage at AVR input' },
          expectedValue: 'Auxiliary winding voltage or PMG output (varies by system)',
          failureIndicates: 'No power to AVR - cannot regulate',
          solution: [
            'Check auxiliary winding output',
            'If PMG equipped, verify PMG output',
            'Check AVR fuses and connections',
            'Inspect wiring to AVR',
            'AVR may need replacement if input OK but no output'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step4',
          title: 'Check Field Circuit and Brushes',
          description: 'Verify excitation field circuit is complete',
          testPoint: { location: 'Field winding at slip rings', probes: 'Resistance measurement' },
          expectedValue: 'Typically 5-15 Ohms (check generator data)',
          failureIndicates: 'Open field winding or worn brushes',
          solution: [
            'Inspect brush condition and spring pressure',
            'Check slip ring surface condition',
            'Measure field winding resistance',
            'Check diode pack if brushless type',
            'Replace brushes if worn below limit'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Ohmmeter', 'Brush wear gauge']
        },
        {
          id: 'step5',
          title: 'Field Flash Procedure',
          description: 'Re-establish residual magnetism',
          testPoint: { location: 'Field terminals', probes: 'Apply DC voltage briefly' },
          expectedValue: 'Generator should start producing voltage',
          failureIndicates: 'May indicate deeper winding issue',
          solution: [
            'Disconnect AVR field output wires',
            'Apply 12V DC to field F+ and F- briefly (2-3 seconds)',
            'Observe polarity (check generator manual)',
            'Reconnect AVR and test',
            'If still no output - stator/rotor winding test required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['12V DC source', 'Test leads'],
          safetyWarning: 'Field flashing must be done with engine stopped or at low speed. Observe correct polarity.'
        }
      ],
      commonCauses: [
        { cause: 'Lost residual magnetism', probability: 25 },
        { cause: 'AVR failure', probability: 25 },
        { cause: 'Worn brushes/slip rings', probability: 20 },
        { cause: 'Blown voltage sensing fuses', probability: 15 },
        { cause: 'Field winding open circuit', probability: 10 },
        { cause: 'Engine underspeed', probability: 5 }
      ],
      partsNeeded: [
        { name: 'AVR (Automatic Voltage Regulator)', partNumber: 'Generator-specific', estimated: 'KES 15,000-45,000' },
        { name: 'Brush Set', partNumber: 'Generator-specific', estimated: 'KES 5,000-12,000' },
        { name: 'Voltage Sensing Fuses', partNumber: '2A Glass Fuse', estimated: 'KES 200-500' }
      ]
    }
  ],
  'protection': [
    {
      id: 'e-stop-fault',
      symptom: 'Engine will not start - E-Stop indication or protection fault',
      description: 'Controller shows E-Stop active or protection input triggered preventing start',
      category: 'Protection',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Physical E-Stop Button',
          description: 'Verify E-Stop button is not pressed/latched',
          testPoint: { location: 'E-Stop button', probes: 'Physical inspection' },
          expectedValue: 'Button should be in released (OUT) position',
          failureIndicates: 'E-Stop engaged - system working correctly',
          solution: [
            'Twist/pull to release mushroom head type',
            'Turn key to release if key-reset type',
            'Replace button if stuck or damaged',
            'Clear fault on controller after releasing'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['None']
        },
        {
          id: 'step2',
          title: 'Check E-Stop Circuit Continuity',
          description: 'Verify E-Stop circuit is complete (NC contacts)',
          testPoint: { location: 'E-Stop terminals at controller', probes: 'Continuity across E-Stop input' },
          expectedValue: '< 1 Ohm (circuit closed) when E-Stop released',
          failureIndicates: 'Open circuit - wiring fault or switch failure',
          solution: [
            'Check wiring from E-Stop to controller',
            'Verify NC (Normally Closed) contacts are used',
            'Check for damaged cable',
            'Test E-Stop switch continuity directly',
            'Repair/replace damaged wiring'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step3',
          title: 'Check for Multiple E-Stop Loops',
          description: 'Verify all E-Stops in series are released',
          testPoint: { location: 'All E-Stop stations', probes: 'Physical and electrical check' },
          expectedValue: 'All E-Stop buttons released, circuit complete',
          failureIndicates: 'One of multiple E-Stops is engaged',
          solution: [
            'Locate all E-Stop stations on genset',
            'Release any engaged E-Stop',
            'Check for remote E-Stop connections',
            'Verify end-of-line resistor if used'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Wiring diagram']
        },
        {
          id: 'step4',
          title: 'Check Controller E-Stop Configuration',
          description: 'Verify E-Stop input is configured correctly',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'E-Stop input configured as Normally Closed (NC)',
          failureIndicates: 'Wrong configuration - NO vs NC',
          solution: [
            'Check controller configuration for E-Stop input type',
            'Should be set to NC (Normally Closed) for safety',
            'Reconfigure if set incorrectly',
            'Verify input voltage threshold settings'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Controller manual']
        }
      ],
      commonCauses: [
        { cause: 'E-Stop button engaged', probability: 40 },
        { cause: 'Broken wire in E-Stop circuit', probability: 25 },
        { cause: 'Faulty E-Stop switch', probability: 15 },
        { cause: 'Multiple E-Stop loop issue', probability: 10 },
        { cause: 'Controller configuration error', probability: 10 }
      ],
      partsNeeded: [
        { name: 'E-Stop Button Assembly', partNumber: 'E-STOP-MUSHROOM-NC', estimated: 'KES 2,000-5,000' },
        { name: 'E-Stop Cable', partNumber: '2-CORE-1.0MM', estimated: 'KES 200/m' }
      ]
    }
  ],
  'communication': [
    {
      id: 'can-fault',
      symptom: 'CAN communication fault / No data from ECU',
      description: 'Controller shows CAN error, no engine data on J1939, or ECU communication failure',
      category: 'Communication',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check CAN Bus Termination',
          description: 'Verify 120 Ohm termination resistors are present',
          testPoint: { location: 'CAN-H to CAN-L at network ends', probes: 'Resistance measurement (network powered off)' },
          expectedValue: '60 Ohms (two 120 Ohm resistors in parallel)',
          failureIndicates: 'Missing or extra termination',
          solution: [
            'Should have exactly TWO 120 Ohm terminators - one at each end',
            'Measure: 60 Ohms = correct, 120 Ohms = one terminator, 40 Ohms = three, Open = none',
            'Add or remove terminators as needed',
            'Terminators often built into ECU and controller'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect power before measuring CAN termination.'
        },
        {
          id: 'step2',
          title: 'Check CAN Bus Wiring',
          description: 'Verify CAN-H and CAN-L wiring integrity',
          testPoint: { location: 'CAN connectors', probes: 'Visual and continuity check' },
          expectedValue: 'Twisted pair, shielded cable, no shorts or opens',
          failureIndicates: 'Wiring fault disrupting communication',
          solution: [
            'Check for continuity from ECU to controller',
            'Verify no short between CAN-H and CAN-L',
            'Verify no short to ground or power',
            'Use twisted pair cable rated for CAN bus',
            'Maximum cable length: 40m for 250kbps J1939'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Cable tester']
        },
        {
          id: 'step3',
          title: 'Check CAN Bus Voltage Levels',
          description: 'Measure CAN bus voltages during operation',
          testPoint: { location: 'CAN-H and CAN-L to ground', probes: 'DC Voltage' },
          expectedValue: 'CAN-H: 2.5-3.5V, CAN-L: 1.5-2.5V (recessive state)',
          failureIndicates: 'Bus driver fault or short circuit',
          solution: [
            'If CAN-H stuck high or low - check for short',
            'If CAN-L stuck - same',
            'Disconnect devices one by one to find fault',
            'Check for damaged transceiver chip',
            'Verify ground reference between devices'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Oscilloscope (advanced)']
        },
        {
          id: 'step4',
          title: 'Verify J1939 Source Addresses',
          description: 'Check for address conflicts on the bus',
          testPoint: { location: 'Controller diagnostics', probes: 'Software check' },
          expectedValue: 'Each device should have unique source address',
          failureIndicates: 'Address conflict preventing communication',
          solution: [
            'Typical addresses: Engine ECU=0, Controller=128',
            'Check controller J1939 configuration',
            'Verify baud rate matches (J1939 = 250 kbps)',
            'Check protocol: J1939 vs proprietary',
            'Use CAN bus analyzer to monitor traffic'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'CAN analyzer (advanced)']
        }
      ],
      commonCauses: [
        { cause: 'Wrong or missing termination', probability: 30 },
        { cause: 'Wiring fault (short/open)', probability: 25 },
        { cause: 'Baud rate mismatch', probability: 15 },
        { cause: 'Address conflict', probability: 10 },
        { cause: 'Failed CAN transceiver', probability: 10 },
        { cause: 'Ground potential difference', probability: 10 }
      ],
      partsNeeded: [
        { name: 'CAN Termination Resistor', partNumber: '120-OHM-0.25W', estimated: 'KES 100-200' },
        { name: 'CAN Bus Cable (Twisted Pair)', partNumber: 'CAN-2X0.5-SHLD', estimated: 'KES 300/m' }
      ]
    }
  ]
};

// ==================== DIAGNOSTIC FLOW COMPONENT ====================
export function DiagnosticFlowPanel({
  circuitId,
  controller
}: {
  circuitId: string;
  controller: ControllerModel;
}) {
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [stepResults, setStepResults] = useState<{ [stepId: string]: 'pass' | 'fail' | null }>({});

  const diagnostics = DIAGNOSTIC_TROUBLESHOOTING[circuitId] || [];

  const handleStepResult = (stepId: string, result: 'pass' | 'fail') => {
    setStepResults(prev => ({ ...prev, [stepId]: result }));
    setCompletedSteps(prev => new Set([...prev, stepId]));

    const step = selectedDiagnostic?.steps[currentStep];
    if (step) {
      const nextStepId = result === 'pass' ? step.nextIfPass : step.nextIfFail;
      if (nextStepId) {
        const nextIndex = selectedDiagnostic?.steps.findIndex(s => s.id === nextStepId);
        if (nextIndex !== undefined && nextIndex >= 0) {
          setCurrentStep(nextIndex);
        }
      }
    }
  };

  const resetDiagnostic = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepResults({});
  };

  if (diagnostics.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        <span className="text-4xl mb-4 block">🔧</span>
        No diagnostic flows available for this circuit yet.
        <p className="text-sm mt-2">Select another circuit or use the schematic view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagnostic Selection */}
      {!selectedDiagnostic ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Select Your Symptom
          </h3>
          <p className="text-slate-400 text-sm">
            Choose the symptom you are experiencing for step-by-step diagnostic guidance
          </p>
          <div className="grid gap-4">
            {diagnostics.map((diag) => (
              <motion.button
                key={diag.id}
                onClick={() => { setSelectedDiagnostic(diag); resetDiagnostic(); }}
                className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 text-left transition-all group"
                whileHover={{ scale: 1.01, x: 5 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {diag.symptom}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">{diag.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                        {diag.estimatedTime}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        diag.difficulty === 'Basic' ? 'bg-green-500/20 text-green-400' :
                        diag.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {diag.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                        {diag.steps.length} Steps
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDiagnostic(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span>←</span> Back to Symptoms
            </button>
            <button
              onClick={resetDiagnostic}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700"
            >
              Restart Diagnostic
            </button>
          </div>

          {/* Diagnostic Title */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white">{selectedDiagnostic.symptom}</h3>
            <p className="text-slate-400 text-sm mt-1">{selectedDiagnostic.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {selectedDiagnostic.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  completedSteps.has(step.id)
                    ? stepResults[step.id] === 'pass' ? 'bg-green-500' : 'bg-red-500'
                    : idx === currentStep
                      ? 'bg-cyan-500'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            Step {currentStep + 1} of {selectedDiagnostic.steps.length}
          </div>

          {/* Current Step Card */}
          {selectedDiagnostic.steps[currentStep] && (
            <motion.div
              key={selectedDiagnostic.steps[currentStep].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-5"
            >
              {/* Step Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {currentStep + 1}
                  </span>
                  <h4 className="text-lg font-bold text-white">{selectedDiagnostic.steps[currentStep].title}</h4>
                </div>
                <p className="text-slate-300">{selectedDiagnostic.steps[currentStep].description}</p>
              </div>

              {/* Safety Warning */}
              {selectedDiagnostic.steps[currentStep].safetyWarning && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
                    <span>⚠️</span> SAFETY WARNING
                  </div>
                  <p className="text-red-300 text-sm">{selectedDiagnostic.steps[currentStep].safetyWarning}</p>
                </div>
              )}

              {/* Test Point */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-amber-400 font-bold text-sm mb-2">🎯 TEST POINT</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Probes:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.probes}</p>
                  </div>
                </div>
              </div>

              {/* Expected Value */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-bold text-sm mb-1">✓ EXPECTED VALUE</div>
                <p className="text-green-300 font-medium">{selectedDiagnostic.steps[currentStep].expectedValue}</p>
              </div>

              {/* Tools Needed */}
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-400 text-sm">Tools needed:</span>
                {selectedDiagnostic.steps[currentStep].tools.map((tool, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg">
                    🔧 {tool}
                  </span>
                ))}
              </div>

              {/* Result Buttons */}
              <div className="border-t border-slate-700 pt-4 mt-4">
                <p className="text-slate-400 text-sm mb-3">What was your measurement result?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleStepResult(selectedDiagnostic.steps[currentStep].id, 'pass');
                      if (currentStep < selectedDiagnostic.steps.length - 1 && selectedDiagnostic.steps[currentStep].nextIfPass) {
                        // Already handled in handleStepResult
                      } else if (currentStep < selectedDiagnostic.steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg font-bold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✓</span> PASS - Value is Good
                  </button>
                  <button
                    onClick={() => handleStepResult(selectedDiagnostic.steps[currentStep].id, 'fail')}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✗</span> FAIL - Problem Found
                  </button>
                </div>
              </div>

              {/* Solution (shown when FAIL) */}
              {stepResults[selectedDiagnostic.steps[currentStep].id] === 'fail' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="text-red-400 font-bold mb-2">
                    🔴 {selectedDiagnostic.steps[currentStep].failureIndicates}
                  </div>
                  <div className="text-white font-bold mb-2 text-sm">SOLUTION:</div>
                  <ul className="space-y-2">
                    {selectedDiagnostic.steps[currentStep].solution.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400 mt-0.5">{idx + 1}.</span>
                        {sol}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Common Causes */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>📊</span> Common Causes (Probability)
            </h4>
            <div className="space-y-2">
              {selectedDiagnostic.commonCauses.map((cause, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                      style={{ width: `${cause.probability}%` }}
                    />
                  </div>
                  <span className="text-slate-300 text-sm whitespace-nowrap w-32">{cause.cause}</span>
                  <span className="text-cyan-400 font-bold text-sm w-12">{cause.probability}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parts Needed */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🛒</span> Parts You May Need
            </h4>
            <div className="grid gap-2">
              {selectedDiagnostic.partsNeeded.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{part.name}</div>
                    <div className="text-slate-500 text-xs">P/N: {part.partNumber}</div>
                  </div>
                  <div className="text-amber-400 font-bold text-sm">{part.estimated}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

