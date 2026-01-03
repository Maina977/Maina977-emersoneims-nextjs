'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Troubleshooting decision tree structure
interface TroubleshootNode {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextId?: string;
    result?: TroubleshootResult;
  }[];
}

interface TroubleshootResult {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  causes: string[];
  solutions: string[];
  diyPossible: boolean;
  estimatedCost: string;
  timeToFix: string;
  relatedCodes?: string[];
  callExpert: boolean;
}

// Complete troubleshooting decision trees
const TROUBLESHOOT_TREES: Record<string, TroubleshootNode[]> = {
  generator: [
    {
      id: 'start',
      question: 'What issue are you experiencing with your generator?',
      options: [
        { label: '🚫 Generator won\'t start', nextId: 'wont-start' },
        { label: '💨 Smoke from exhaust', nextId: 'smoke' },
        { label: '🌡️ Overheating', nextId: 'overheat' },
        { label: '⚡ No power output', nextId: 'no-output' },
        { label: '🔊 Unusual noise/vibration', nextId: 'noise' },
        { label: '🛑 Shuts down unexpectedly', nextId: 'shutdown' },
        { label: '⚠️ Warning light/error code', nextId: 'error-code' },
        { label: '💧 Fluid leak', nextId: 'leak' }
      ]
    },
    {
      id: 'wont-start',
      question: 'What happens when you try to start the generator?',
      options: [
        { label: 'Nothing at all - completely dead', nextId: 'dead-start' },
        { label: 'Cranks but doesn\'t fire', nextId: 'cranks-no-fire' },
        { label: 'Clicks but won\'t crank', nextId: 'clicks' },
        { label: 'Starts briefly then dies', nextId: 'starts-dies' }
      ]
    },
    {
      id: 'dead-start',
      question: 'Have you checked the battery?',
      options: [
        { label: 'Battery is dead/low', result: {
          diagnosis: 'Dead or Discharged Battery',
          severity: 'low',
          causes: ['Battery not charging', 'Faulty battery charger', 'Old battery (3+ years)', 'Parasitic drain'],
          solutions: ['Charge battery with external charger', 'Check battery charger output (13.5-14.5V)', 'Test battery load capacity', 'Replace battery if over 3 years old'],
          diyPossible: true,
          estimatedCost: 'KES 8,000 - 25,000 (new battery)',
          timeToFix: '30 minutes - 2 hours',
          relatedCodes: ['E1010', 'BAT01'],
          callExpert: false
        }},
        { label: 'Battery seems fine (12.6V+)', nextId: 'battery-ok' },
        { label: 'Not sure how to check', result: {
          diagnosis: 'Potential Electrical Issue',
          severity: 'medium',
          causes: ['Dead battery', 'Faulty starter', 'Electrical connection issues', 'Control panel fault'],
          solutions: ['Have battery tested (should read 12.6V+ when charged)', 'Check battery terminals for corrosion', 'Inspect main fuses', 'Check emergency stop button is released'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 50,000 depending on issue',
          timeToFix: '1-4 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'battery-ok',
      question: 'Is the emergency stop button released and control switch in correct position?',
      options: [
        { label: 'Yes, all switches correct', result: {
          diagnosis: 'Starter Motor or Control System Fault',
          severity: 'medium',
          causes: ['Faulty starter motor', 'Starter solenoid failure', 'Control panel issue', 'Wiring problem'],
          solutions: ['Check starter motor connections', 'Test starter solenoid', 'Inspect control panel for errors', 'Check main fuse and circuit breaker'],
          diyPossible: false,
          estimatedCost: 'KES 15,000 - 80,000',
          timeToFix: '2-6 hours',
          relatedCodes: ['E1001', 'STR01'],
          callExpert: true
        }},
        { label: 'Emergency stop was engaged!', result: {
          diagnosis: 'Emergency Stop Engaged',
          severity: 'low',
          causes: ['Emergency stop button pressed', 'Safety interlock activated'],
          solutions: ['Release emergency stop button by twisting/pulling', 'Reset the control panel', 'Check for any safety interlocks'],
          diyPossible: true,
          estimatedCost: 'Free',
          timeToFix: '5 minutes',
          callExpert: false
        }}
      ]
    },
    {
      id: 'cranks-no-fire',
      question: 'How long has the generator been sitting unused?',
      options: [
        { label: 'Less than 2 weeks', nextId: 'fuel-check' },
        { label: '2 weeks - 3 months', nextId: 'fuel-stale' },
        { label: 'More than 3 months', result: {
          diagnosis: 'Stale Fuel / Fuel System Issues',
          severity: 'medium',
          causes: ['Degraded/stale fuel', 'Clogged fuel filter', 'Air in fuel lines', 'Fuel pump failure', 'Injector issues'],
          solutions: ['Drain old fuel completely', 'Replace fuel filter', 'Bleed air from fuel system', 'Add fresh diesel fuel', 'Check fuel pump operation'],
          diyPossible: true,
          estimatedCost: 'KES 5,000 - 25,000',
          timeToFix: '1-3 hours',
          relatedCodes: ['E1001', 'F101', 'F102'],
          callExpert: false
        }}
      ]
    },
    {
      id: 'fuel-check',
      question: 'Is there fuel in the tank and is it clean diesel?',
      options: [
        { label: 'Tank is empty or very low', result: {
          diagnosis: 'Empty Fuel Tank',
          severity: 'low',
          causes: ['Fuel depleted', 'Fuel gauge malfunction'],
          solutions: ['Add fresh diesel fuel', 'Bleed air from fuel system after refueling', 'Prime the fuel system', 'Check fuel gauge accuracy'],
          diyPossible: true,
          estimatedCost: 'Fuel cost only',
          timeToFix: '15-30 minutes',
          callExpert: false
        }},
        { label: 'Fuel looks contaminated (water/dirt)', result: {
          diagnosis: 'Contaminated Fuel',
          severity: 'medium',
          causes: ['Water in fuel', 'Dirt/debris in tank', 'Bacterial growth in fuel'],
          solutions: ['Drain fuel tank completely', 'Clean fuel tank', 'Replace fuel filter', 'Add fresh, clean diesel', 'Consider fuel biocide treatment'],
          diyPossible: true,
          estimatedCost: 'KES 10,000 - 30,000',
          timeToFix: '2-4 hours',
          relatedCodes: ['F201', 'F202'],
          callExpert: false
        }},
        { label: 'Fuel is full and clean', result: {
          diagnosis: 'Fuel Delivery or Injection Issue',
          severity: 'high',
          causes: ['Clogged fuel filter', 'Faulty fuel pump', 'Injector problems', 'Air in fuel lines', 'Fuel solenoid failure'],
          solutions: ['Replace fuel filter', 'Check fuel pump pressure', 'Bleed fuel system', 'Test fuel solenoid operation', 'Professional injector testing'],
          diyPossible: false,
          estimatedCost: 'KES 15,000 - 100,000',
          timeToFix: '2-8 hours',
          relatedCodes: ['E1001', 'E2001', 'F101'],
          callExpert: true
        }}
      ]
    },
    {
      id: 'fuel-stale',
      question: 'Have you tried replacing the fuel filter?',
      options: [
        { label: 'Yes, filter is new', result: {
          diagnosis: 'Air in Fuel System',
          severity: 'medium',
          causes: ['Air entered fuel lines during storage', 'Loose fuel connections', 'Fuel pump not priming'],
          solutions: ['Bleed air from fuel system at injector bleed points', 'Check all fuel line connections', 'Prime fuel pump manually if equipped', 'Crank in short bursts (10 sec) with 30 sec rest'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 5,000',
          timeToFix: '30 minutes - 2 hours',
          callExpert: false
        }},
        { label: 'No, haven\'t changed filter', result: {
          diagnosis: 'Clogged Fuel Filter',
          severity: 'low',
          causes: ['Filter blocked from old fuel residue', 'Sediment accumulation', 'Normal wear'],
          solutions: ['Replace fuel filter', 'Drain water separator if equipped', 'Bleed air from system after filter change', 'Add fresh fuel'],
          diyPossible: true,
          estimatedCost: 'KES 3,000 - 8,000',
          timeToFix: '30 minutes - 1 hour',
          callExpert: false
        }}
      ]
    },
    {
      id: 'clicks',
      question: 'Is the clicking coming from near the starter motor?',
      options: [
        { label: 'Yes, rapid clicking', result: {
          diagnosis: 'Low Battery Voltage or Poor Connections',
          severity: 'low',
          causes: ['Battery too weak to turn starter', 'Corroded battery terminals', 'Loose cable connections'],
          solutions: ['Charge or replace battery', 'Clean battery terminals with wire brush', 'Tighten all battery cable connections', 'Check ground cable condition'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 25,000',
          timeToFix: '30 minutes - 2 hours',
          callExpert: false
        }},
        { label: 'Single loud click', result: {
          diagnosis: 'Starter Solenoid or Motor Failure',
          severity: 'medium',
          causes: ['Faulty starter solenoid', 'Starter motor failure', 'Seized engine (worst case)'],
          solutions: ['Test starter solenoid', 'Check if engine turns freely by hand', 'Inspect starter motor', 'Professional starter repair/replacement'],
          diyPossible: false,
          estimatedCost: 'KES 25,000 - 80,000',
          timeToFix: '2-6 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'starts-dies',
      question: 'How long does it run before dying?',
      options: [
        { label: 'Less than 5 seconds', result: {
          diagnosis: 'Fuel Delivery Issue',
          severity: 'medium',
          causes: ['Fuel solenoid not staying open', 'Control panel fault', 'Low fuel pressure', 'Air in fuel system'],
          solutions: ['Check fuel solenoid operation', 'Inspect control panel for faults', 'Test fuel pressure', 'Bleed fuel system thoroughly'],
          diyPossible: false,
          estimatedCost: 'KES 10,000 - 50,000',
          timeToFix: '1-4 hours',
          relatedCodes: ['E1010', 'F101'],
          callExpert: true
        }},
        { label: '5-30 seconds', result: {
          diagnosis: 'Sensor or Safety Shutdown',
          severity: 'medium',
          causes: ['Low oil pressure sensor', 'Overspeed protection', 'Coolant temperature sensor', 'Safety interlock'],
          solutions: ['Check oil level', 'Inspect sensors and connections', 'Review fault codes on display', 'Check safety interlocks'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 30,000',
          timeToFix: '1-3 hours',
          relatedCodes: ['E1004', 'E1003', 'S101'],
          callExpert: true
        }},
        { label: '1-5 minutes', result: {
          diagnosis: 'Operating Parameter Fault',
          severity: 'medium',
          causes: ['Overheating', 'Low oil pressure', 'Governor/speed control issue', 'Load imbalance'],
          solutions: ['Check coolant level', 'Verify oil level and quality', 'Inspect for cooling system blockages', 'Check governor settings'],
          diyPossible: false,
          estimatedCost: 'KES 10,000 - 60,000',
          timeToFix: '2-6 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'smoke',
      question: 'What color is the smoke?',
      options: [
        { label: '⬛ Black smoke', nextId: 'black-smoke' },
        { label: '⬜ White smoke', nextId: 'white-smoke' },
        { label: '🔵 Blue smoke', nextId: 'blue-smoke' }
      ]
    },
    {
      id: 'black-smoke',
      question: 'When does the black smoke appear?',
      options: [
        { label: 'Only during startup (clears after)', result: {
          diagnosis: 'Normal Cold Start Behavior',
          severity: 'low',
          causes: ['Cold engine combustion', 'Rich fuel mixture during warm-up'],
          solutions: ['Allow proper warm-up time (3-5 minutes)', 'This is normal if it clears within 1-2 minutes', 'Check air filter if excessive'],
          diyPossible: true,
          estimatedCost: 'Free',
          timeToFix: 'N/A - Normal operation',
          callExpert: false
        }},
        { label: 'Continuous during operation', result: {
          diagnosis: 'Air Intake or Fuel System Problem',
          severity: 'medium',
          causes: ['Clogged air filter', 'Turbocharger issue', 'Faulty injectors', 'Incorrect injection timing', 'Overloading'],
          solutions: ['Replace air filter', 'Check turbo boost pressure', 'Have injectors tested', 'Verify injection timing', 'Reduce electrical load'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 80,000',
          timeToFix: '1-6 hours',
          relatedCodes: ['E1015', 'A101', 'T101'],
          callExpert: true
        }},
        { label: 'Only under heavy load', result: {
          diagnosis: 'Overloading or Fuel System Issue',
          severity: 'medium',
          causes: ['Generator overloaded', 'Worn injectors', 'Turbo lag or failure', 'Governor not responding'],
          solutions: ['Reduce connected load', 'Test injector spray pattern', 'Check turbocharger operation', 'Verify load percentage on panel'],
          diyPossible: false,
          estimatedCost: 'KES 10,000 - 100,000',
          timeToFix: '2-8 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'white-smoke',
      question: 'Is the white smoke thick with a sweet smell?',
      options: [
        { label: 'Yes, sweet smell, thick smoke', result: {
          diagnosis: 'Coolant Entering Combustion Chamber - CRITICAL',
          severity: 'critical',
          causes: ['Blown head gasket', 'Cracked cylinder head', 'Cracked engine block', 'Failed cylinder liner seal'],
          solutions: ['STOP RUNNING IMMEDIATELY', 'Do not operate until repaired', 'Professional diagnosis required', 'Head gasket or major engine repair needed'],
          diyPossible: false,
          estimatedCost: 'KES 80,000 - 500,000+',
          timeToFix: '1-5 days',
          relatedCodes: ['E1021', 'C201'],
          callExpert: true
        }},
        { label: 'Thin white smoke, no smell', result: {
          diagnosis: 'Condensation or Cold Weather Startup',
          severity: 'low',
          causes: ['Moisture in exhaust system', 'Cold weather condensation', 'Normal until engine warms'],
          solutions: ['Allow engine to warm up fully', 'Run for 15-20 minutes to clear', 'Normal in cold/humid conditions'],
          diyPossible: true,
          estimatedCost: 'Free',
          timeToFix: 'N/A - Normal',
          callExpert: false
        }},
        { label: 'White smoke with fuel smell', result: {
          diagnosis: 'Unburned Fuel in Exhaust',
          severity: 'medium',
          causes: ['Faulty injector (not atomizing)', 'Low compression', 'Incorrect timing', 'Engine running too cold'],
          solutions: ['Test injectors', 'Compression test', 'Check injection timing', 'Verify thermostat operation'],
          diyPossible: false,
          estimatedCost: 'KES 20,000 - 100,000',
          timeToFix: '2-8 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'blue-smoke',
      question: 'When is the blue smoke most noticeable?',
      options: [
        { label: 'On startup then clears', result: {
          diagnosis: 'Valve Stem Seal Wear',
          severity: 'medium',
          causes: ['Worn valve stem seals', 'Oil pooling in head overnight'],
          solutions: ['Replace valve stem seals', 'Monitor oil consumption', 'Plan for repair during next major service'],
          diyPossible: false,
          estimatedCost: 'KES 40,000 - 120,000',
          timeToFix: '1-2 days',
          callExpert: true
        }},
        { label: 'Continuous during operation', result: {
          diagnosis: 'Worn Piston Rings or Cylinder Wear',
          severity: 'high',
          causes: ['Worn piston rings', 'Cylinder bore wear', 'Turbo seal failure'],
          solutions: ['Engine overhaul required', 'Replace piston rings', 'Hone or replace cylinders', 'Check turbo for oil leaks'],
          diyPossible: false,
          estimatedCost: 'KES 150,000 - 600,000',
          timeToFix: '3-7 days',
          relatedCodes: ['O101', 'E401'],
          callExpert: true
        }}
      ]
    },
    {
      id: 'overheat',
      question: 'What is the coolant level?',
      options: [
        { label: 'Low or empty', result: {
          diagnosis: 'Low Coolant / Cooling System Leak',
          severity: 'high',
          causes: ['Coolant leak', 'Radiator damage', 'Hose failure', 'Water pump leak'],
          solutions: ['STOP engine immediately', 'Allow to cool before opening radiator', 'Inspect for leaks', 'Refill with proper coolant mix (50/50)', 'Pressure test cooling system'],
          diyPossible: true,
          estimatedCost: 'KES 5,000 - 50,000',
          timeToFix: '1-4 hours',
          relatedCodes: ['E1003', 'C101'],
          callExpert: false
        }},
        { label: 'Coolant level is fine', nextId: 'overheat-full' }
      ]
    },
    {
      id: 'overheat-full',
      question: 'Is the radiator blocked or dirty?',
      options: [
        { label: 'Yes, radiator is dirty/blocked', result: {
          diagnosis: 'Restricted Airflow to Radiator',
          severity: 'medium',
          causes: ['Dirty radiator fins', 'Debris blocking airflow', 'Failed cooling fan', 'Poor ventilation in enclosure'],
          solutions: ['Clean radiator with compressed air or water', 'Remove debris from around generator', 'Check cooling fan operation', 'Ensure adequate ventilation'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 20,000',
          timeToFix: '30 minutes - 2 hours',
          callExpert: false
        }},
        { label: 'Radiator is clean', result: {
          diagnosis: 'Thermostat, Water Pump, or Internal Issue',
          severity: 'high',
          causes: ['Stuck thermostat', 'Failed water pump', 'Internal blockage', 'Head gasket failure'],
          solutions: ['Test thermostat operation', 'Check water pump flow', 'Flush cooling system', 'Professional diagnosis needed'],
          diyPossible: false,
          estimatedCost: 'KES 15,000 - 150,000',
          timeToFix: '2-8 hours',
          relatedCodes: ['E1020', 'C102'],
          callExpert: true
        }}
      ]
    },
    {
      id: 'no-output',
      question: 'Is the generator engine running normally?',
      options: [
        { label: 'Yes, engine runs fine', nextId: 'no-output-running' },
        { label: 'No, engine has issues too', nextId: 'start' }
      ]
    },
    {
      id: 'no-output-running',
      question: 'What does the voltage meter show?',
      options: [
        { label: 'Zero volts', result: {
          diagnosis: 'AVR, Excitation, or Winding Failure',
          severity: 'high',
          causes: ['Failed AVR (Automatic Voltage Regulator)', 'Loss of residual magnetism', 'Broken excitation wiring', 'Stator/rotor winding damage'],
          solutions: ['Test AVR output', 'Flash the field to restore magnetism', 'Inspect excitation circuit', 'Winding resistance test'],
          diyPossible: false,
          estimatedCost: 'KES 30,000 - 200,000',
          timeToFix: '2-8 hours',
          relatedCodes: ['V101', 'G101'],
          callExpert: true
        }},
        { label: 'Low voltage (below 200V)', result: {
          diagnosis: 'AVR or Speed Control Issue',
          severity: 'medium',
          causes: ['AVR malfunction', 'Engine running below rated speed', 'Faulty speed sensor', 'Governor issue'],
          solutions: ['Check engine RPM (should be 1500 for 50Hz)', 'Adjust AVR voltage setting if accessible', 'Test speed sensor', 'Check governor operation'],
          diyPossible: false,
          estimatedCost: 'KES 15,000 - 80,000',
          timeToFix: '1-4 hours',
          callExpert: true
        }},
        { label: 'Normal voltage (220-240V)', result: {
          diagnosis: 'Output Breaker or Connection Issue',
          severity: 'low',
          causes: ['Output circuit breaker tripped', 'Loose terminal connections', 'Faulty output contactor'],
          solutions: ['Reset output circuit breaker', 'Check and tighten all output connections', 'Test with multimeter at output terminals', 'Inspect contactor if equipped'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 20,000',
          timeToFix: '30 minutes - 2 hours',
          callExpert: false
        }}
      ]
    },
    {
      id: 'noise',
      question: 'What type of noise is it?',
      options: [
        { label: 'Knocking/banging from engine', result: {
          diagnosis: 'Internal Engine Damage - STOP IMMEDIATELY',
          severity: 'critical',
          causes: ['Rod bearing failure', 'Piston damage', 'Timing gear damage', 'Valve train failure'],
          solutions: ['STOP ENGINE IMMEDIATELY', 'Do not restart until inspected', 'Major engine repair or overhaul likely needed', 'Professional diagnosis required'],
          diyPossible: false,
          estimatedCost: 'KES 100,000 - 800,000',
          timeToFix: '3-10 days',
          callExpert: true
        }},
        { label: 'High-pitched whine/squeal', result: {
          diagnosis: 'Belt, Bearing, or Turbo Issue',
          severity: 'medium',
          causes: ['Loose or worn belt', 'Failing bearing (alternator, water pump)', 'Turbocharger bearing wear'],
          solutions: ['Inspect and tension/replace belts', 'Check bearing play in pulleys', 'Listen to turbo with stethoscope', 'Replace worn components'],
          diyPossible: false,
          estimatedCost: 'KES 10,000 - 100,000',
          timeToFix: '1-6 hours',
          callExpert: true
        }},
        { label: 'Electrical humming/buzzing', result: {
          diagnosis: 'Electrical Component Vibration',
          severity: 'low',
          causes: ['Loose electrical connections', 'Transformer hum', 'Contactor chatter', 'ATS relay issue'],
          solutions: ['Tighten all electrical connections', 'Check contactors for proper closure', 'Inspect ATS operation', 'Normal if minor hum'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 30,000',
          timeToFix: '30 minutes - 2 hours',
          callExpert: false
        }},
        { label: 'Excessive vibration', result: {
          diagnosis: 'Mounting or Balance Issue',
          severity: 'medium',
          causes: ['Loose mounting bolts', 'Worn vibration isolators', 'Coupling misalignment', 'Imbalanced rotating components'],
          solutions: ['Tighten all mounting hardware', 'Replace anti-vibration mounts', 'Check engine-alternator alignment', 'Balance rotating components'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 50,000',
          timeToFix: '1-4 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'shutdown',
      question: 'What warning/fault was displayed before shutdown?',
      options: [
        { label: 'High temperature warning', result: {
          diagnosis: 'Overheat Protection Activated',
          severity: 'high',
          causes: ['Cooling system failure', 'Low coolant', 'Blocked radiator', 'Failed thermostat'],
          solutions: ['Wait for engine to cool', 'Check coolant level', 'Inspect for leaks', 'Clean radiator', 'Check cooling fan'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 50,000',
          timeToFix: '1-4 hours',
          relatedCodes: ['E1003', 'E1020'],
          callExpert: false
        }},
        { label: 'Low oil pressure', result: {
          diagnosis: 'Oil Pressure Protection Activated',
          severity: 'critical',
          causes: ['Low oil level', 'Oil pump failure', 'Oil leak', 'Worn bearings', 'Wrong oil viscosity'],
          solutions: ['Check oil level immediately', 'Inspect for leaks', 'Do NOT restart until oil level correct', 'If level OK, oil pump/bearing issue - call expert'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 300,000',
          timeToFix: '1-8 hours',
          relatedCodes: ['E1004', 'O101'],
          callExpert: true
        }},
        { label: 'Overspeed', result: {
          diagnosis: 'Overspeed Protection Activated',
          severity: 'high',
          causes: ['Governor failure', 'Speed sensor fault', 'Fuel system issue', 'Load rejection'],
          solutions: ['Check for fault codes', 'Inspect governor/actuator', 'Test speed sensor', 'Review load connection sequence'],
          diyPossible: false,
          estimatedCost: 'KES 20,000 - 100,000',
          timeToFix: '2-6 hours',
          relatedCodes: ['E360', 'E1030'],
          callExpert: true
        }},
        { label: 'No warning - just stopped', result: {
          diagnosis: 'Fuel, Electrical, or Sensor Issue',
          severity: 'medium',
          causes: ['Ran out of fuel', 'Loose connection', 'Sensor fault', 'Control board issue'],
          solutions: ['Check fuel level', 'Inspect all electrical connections', 'Review fault history on controller', 'Check for intermittent faults'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 80,000',
          timeToFix: '1-4 hours',
          callExpert: true
        }}
      ]
    },
    {
      id: 'error-code',
      question: 'Do you have the error code number?',
      description: 'Check the display panel for a code like E1001, SPN-xxx, or similar',
      options: [
        { label: 'Yes, I have the code', result: {
          diagnosis: 'Use Our Diagnostic Suite for Detailed Analysis',
          severity: 'medium',
          causes: ['Error code indicates specific fault'],
          solutions: ['Go to our Diagnostic Suite', 'Enter your error code for detailed causes and solutions', 'Our database has 9,000+ codes for all major brands'],
          diyPossible: true,
          estimatedCost: 'Depends on fault',
          timeToFix: 'Depends on fault',
          callExpert: false
        }},
        { label: 'No code, just warning light', result: {
          diagnosis: 'Warning Indicator Active',
          severity: 'medium',
          causes: ['Various - depends on which light', 'Could be oil, temp, battery, or general fault'],
          solutions: ['Identify which warning light is on', 'Check corresponding system (oil level, coolant, battery)', 'Consult operator manual for light meaning', 'Use Diagnostic Suite for fault codes'],
          diyPossible: true,
          estimatedCost: 'KES 0 - 50,000',
          timeToFix: '30 minutes - 4 hours',
          callExpert: false
        }}
      ]
    },
    {
      id: 'leak',
      question: 'What color/type of fluid is leaking?',
      options: [
        { label: 'Black/dark brown (oil)', result: {
          diagnosis: 'Engine Oil Leak',
          severity: 'medium',
          causes: ['Worn gaskets or seals', 'Loose drain plug', 'Cracked oil pan', 'Valve cover gasket'],
          solutions: ['Identify leak source', 'Tighten drain plug', 'Replace leaking gasket/seal', 'Monitor oil level closely'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 50,000',
          timeToFix: '1-6 hours',
          callExpert: true
        }},
        { label: 'Green/orange (coolant)', result: {
          diagnosis: 'Coolant System Leak',
          severity: 'high',
          causes: ['Failed hose', 'Radiator damage', 'Water pump seal', 'Head gasket (if in oil)'],
          solutions: ['Identify leak location', 'Replace failed hose or clamp', 'Repair/replace radiator', 'Pressure test cooling system'],
          diyPossible: true,
          estimatedCost: 'KES 3,000 - 80,000',
          timeToFix: '1-4 hours',
          relatedCodes: ['C101', 'E1003'],
          callExpert: false
        }},
        { label: 'Clear/yellow (diesel)', result: {
          diagnosis: 'Fuel System Leak - FIRE HAZARD',
          severity: 'critical',
          causes: ['Loose fuel line fitting', 'Cracked fuel line', 'Leaking injector seal', 'Damaged fuel tank'],
          solutions: ['STOP generator immediately', 'No smoking or open flames nearby', 'Identify and repair leak source', 'Clean up spilled fuel safely'],
          diyPossible: false,
          estimatedCost: 'KES 5,000 - 40,000',
          timeToFix: '1-4 hours',
          callExpert: true
        }}
      ]
    }
  ]
};

export default function TroubleshootingWizardPage() {
  const [equipmentType, setEquipmentType] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<TroubleshootResult | null>(null);

  const currentTree = equipmentType ? TROUBLESHOOT_TREES[equipmentType] : null;
  const currentNode = currentTree?.find(n => n.id === currentNodeId);

  const handleOptionClick = (option: { label: string; nextId?: string; result?: TroubleshootResult }) => {
    if (option.result) {
      setResult(option.result);
    } else if (option.nextId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextId);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
    } else if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentNodeId(prev);
    } else {
      setEquipmentType(null);
      setCurrentNodeId('start');
    }
  };

  const handleReset = () => {
    setEquipmentType(null);
    setCurrentNodeId('start');
    setHistory([]);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              🔧 Interactive Troubleshooting Wizard
            </h1>
            <p className="text-xl text-gray-300">
              Answer a few questions to diagnose your equipment problem
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wizard Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress & Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              disabled={!equipmentType && !result}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>
            <div className="text-gray-400 text-sm">
              {history.length > 0 && `Step ${history.length + 1}`}
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
            >
              Start Over
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Equipment Selection */}
            {!equipmentType && !result && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  What equipment needs troubleshooting?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: 'generator', label: '⚡ Generator', desc: 'Diesel/petrol generators' },
                    { id: 'solar', label: '☀️ Solar System', desc: 'Panels, inverters, batteries', disabled: true },
                    { id: 'ups', label: '🔋 UPS System', desc: 'Uninterruptible power', disabled: true },
                    { id: 'hvac', label: '❄️ AC/HVAC', desc: 'Air conditioning', disabled: true }
                  ].map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => !eq.disabled && setEquipmentType(eq.id)}
                      disabled={eq.disabled}
                      className={`p-6 rounded-xl text-left transition-all ${
                        eq.disabled 
                          ? 'bg-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-white/20 hover:scale-[1.02] hover:border-orange-500/50 border border-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">{eq.label.split(' ')[0]}</div>
                      <div className="text-lg font-semibold text-white">{eq.label.split(' ').slice(1).join(' ')}</div>
                      <div className="text-sm text-gray-400">{eq.desc}</div>
                      {eq.disabled && <div className="text-xs text-orange-400 mt-2">Coming soon</div>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Question Node */}
            {equipmentType && currentNode && !result && (
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentNode.question}
                </h2>
                {currentNode.description && (
                  <p className="text-gray-400 mb-6">{currentNode.description}</p>
                )}
                <div className="space-y-3">
                  {currentNode.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-orange-500/50 rounded-xl text-left text-white font-medium transition-all hover:scale-[1.01]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Diagnosis Header */}
                <div className={`border rounded-2xl p-6 ${getSeverityColor(result.severity)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">🔍 Diagnosis</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getSeverityColor(result.severity)}`}>
                      {result.severity} severity
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{result.diagnosis}</h3>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{result.diyPossible ? '✅' : '🔧'}</div>
                    <div className="text-sm text-gray-400">DIY Possible</div>
                    <div className="font-bold text-white">{result.diyPossible ? 'Yes' : 'Expert Needed'}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm text-gray-400">Est. Cost</div>
                    <div className="font-bold text-white">{result.estimatedCost}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">⏱️</div>
                    <div className="text-sm text-gray-400">Time to Fix</div>
                    <div className="font-bold text-white">{result.timeToFix}</div>
                  </div>
                </div>

                {/* Causes */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">⚠️ Possible Causes</h3>
                  <ul className="space-y-2">
                    {result.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <span className="text-orange-400">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">✅ Recommended Solutions</h3>
                  <ol className="space-y-3">
                    {result.solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        {solution}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Related Codes */}
                {result.relatedCodes && result.relatedCodes.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📋 Related Error Codes</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.relatedCodes.map(code => (
                        <Link
                          key={code}
                          href={`/diagnostic-suite?code=${code}`}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          {code}
                        </Link>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                      Click a code to see detailed information in our Diagnostic Suite
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {result.callExpert ? '📞 Expert Assistance Recommended' : '🔧 Need Further Help?'}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://wa.me/254768860655"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
                    >
                      💬 WhatsApp Expert
                    </a>
                    <a
                      href="tel:+254768860655"
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
                    >
                      📞 Call Now
                    </a>
                    <Link
                      href="/booking"
                      className="px-6 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors"
                    >
                      📅 Book Service
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
