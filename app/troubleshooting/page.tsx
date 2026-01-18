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

// Complete troubleshooting decision trees for ALL services
const TROUBLESHOOT_TREES: Record<string, TroubleshootNode[]> = {
  // ========== SOLAR SYSTEM TROUBLESHOOTING ==========
  solar: [
    {
      id: 'start',
      question: 'What issue are you experiencing with your solar system?',
      options: [
        { label: '⚡ No power output', nextId: 'no-power' },
        { label: '📉 Low power/reduced output', nextId: 'low-power' },
        { label: '🔋 Battery not charging', nextId: 'battery-issue' },
        { label: '🔴 Inverter error/fault', nextId: 'inverter-error' },
        { label: '🌡️ System overheating', nextId: 'overheating' }
      ]
    },
    {
      id: 'no-power',
      question: 'Are the solar panels receiving sunlight?',
      options: [
        { label: 'Yes, clear sunny day', nextId: 'check-inverter' },
        { label: 'Panels are shaded or dirty', result: {
          diagnosis: 'Shading or Soiling Issue',
          severity: 'low',
          causes: ['Tree shadows', 'Dust accumulation', 'Bird droppings', 'Nearby building shadows'],
          solutions: ['Clean panels with water and soft cloth', 'Trim overhanging trees', 'Install bird deterrents', 'Consider panel repositioning'],
          diyPossible: true, estimatedCost: 'Free - KES 5,000', timeToFix: '1-2 hours', callExpert: false
        }}
      ]
    },
    {
      id: 'check-inverter',
      question: 'What is the inverter display showing?',
      options: [
        { label: 'No display/completely off', result: {
          diagnosis: 'Inverter Power Failure',
          severity: 'high',
          causes: ['DC disconnect open', 'Blown fuse', 'Inverter failure', 'Wiring issue'],
          solutions: ['Check DC disconnect switch', 'Inspect fuses', 'Check DC voltage from panels', 'Professional inverter diagnosis'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 200,000', timeToFix: '2-8 hours', callExpert: true
        }},
        { label: 'Showing error code', nextId: 'inverter-error' },
        { label: 'Display on but no output', result: {
          diagnosis: 'Grid/Load Connection Issue',
          severity: 'medium',
          causes: ['AC breaker tripped', 'Grid fault', 'Wiring problem', 'Inverter internal fault'],
          solutions: ['Check AC breaker', 'Verify grid power', 'Inspect output connections', 'Professional diagnosis'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 50,000', timeToFix: '1-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'low-power',
      question: 'When did you notice the reduced output?',
      options: [
        { label: 'Gradual decline over months', result: {
          diagnosis: 'Panel Degradation or Soiling',
          severity: 'low',
          causes: ['Normal panel aging', 'Accumulated dirt', 'Micro-cracks', 'Hot spot development'],
          solutions: ['Professional panel cleaning', 'Thermal imaging inspection', 'Panel performance testing', 'Consider panel replacement if over 15 years'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 100,000', timeToFix: '2-4 hours', callExpert: true
        }},
        { label: 'Sudden drop', result: {
          diagnosis: 'String or Panel Failure',
          severity: 'high',
          causes: ['Failed panel', 'Broken string fuse', 'Damaged cable', 'Junction box failure'],
          solutions: ['Check string voltages', 'Inspect panel junction boxes', 'Test individual panels', 'Replace failed components'],
          diyPossible: false, estimatedCost: 'KES 20,000 - 150,000', timeToFix: '2-6 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'battery-issue',
      question: 'What type of battery system do you have?',
      options: [
        { label: 'Lead-acid batteries', result: {
          diagnosis: 'Lead-Acid Battery Issue',
          severity: 'medium',
          causes: ['Low electrolyte', 'Sulfation', 'Dead cells', 'Charge controller issue', 'Age (3+ years)'],
          solutions: ['Check electrolyte levels', 'Test specific gravity', 'Equalize charge if flooded type', 'Test battery capacity', 'Replace if over 4 years'],
          diyPossible: true, estimatedCost: 'KES 5,000 - 100,000', timeToFix: '1-3 hours', callExpert: false
        }},
        { label: 'Lithium batteries', result: {
          diagnosis: 'Lithium Battery/BMS Issue',
          severity: 'medium',
          causes: ['BMS fault', 'Cell imbalance', 'Temperature protection', 'Communication error'],
          solutions: ['Check BMS error codes', 'Verify temperature range', 'Check communication cables', 'Professional BMS reset'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 300,000', timeToFix: '2-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'inverter-error',
      question: 'What type of error is displayed?',
      options: [
        { label: 'Overload/overcurrent', result: {
          diagnosis: 'Inverter Overload',
          severity: 'medium',
          causes: ['Too many loads connected', 'Motor starting surge', 'Short circuit on output', 'Inverter undersized'],
          solutions: ['Reduce connected load', 'Add soft starters for motors', 'Check for shorts', 'Upgrade inverter size'],
          diyPossible: true, estimatedCost: 'Free - KES 200,000', timeToFix: '30 min - 2 hours', callExpert: false
        }},
        { label: 'Over/under voltage', result: {
          diagnosis: 'Voltage Regulation Issue',
          severity: 'medium',
          causes: ['Grid voltage unstable', 'Battery voltage incorrect', 'Inverter settings', 'Faulty voltage sensor'],
          solutions: ['Check grid voltage', 'Verify battery voltage', 'Adjust inverter settings', 'Install voltage stabilizer'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 80,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'Ground fault/isolation', result: {
          diagnosis: 'Ground Fault Detected',
          severity: 'high',
          causes: ['Cable insulation damage', 'Water ingress', 'Panel frame grounding issue', 'Inverter isolation failure'],
          solutions: ['STOP system immediately', 'Inspect all wiring', 'Check for water damage', 'Professional insulation testing'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 50,000', timeToFix: '2-6 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'overheating',
      question: 'What component is overheating?',
      options: [
        { label: 'Inverter', result: {
          diagnosis: 'Inverter Overheating',
          severity: 'high',
          causes: ['Poor ventilation', 'High ambient temperature', 'Overload', 'Fan failure', 'Dust buildup'],
          solutions: ['Improve ventilation', 'Clean dust from vents', 'Check cooling fans', 'Reduce load', 'Relocate if in direct sun'],
          diyPossible: true, estimatedCost: 'Free - KES 20,000', timeToFix: '1-3 hours', callExpert: false
        }},
        { label: 'Batteries', result: {
          diagnosis: 'Battery Overheating - CRITICAL',
          severity: 'critical',
          causes: ['Overcharging', 'Internal short', 'High ambient temperature', 'BMS failure'],
          solutions: ['STOP charging immediately', 'Ensure ventilation', 'Do not touch batteries', 'Call expert immediately', 'Risk of fire/explosion'],
          diyPossible: false, estimatedCost: 'KES 50,000 - 300,000', timeToFix: '4-8 hours', callExpert: true
        }}
      ]
    }
  ],

  // ========== UPS SYSTEM TROUBLESHOOTING ==========
  ups: [
    {
      id: 'start',
      question: 'What issue are you experiencing with your UPS?',
      options: [
        { label: '🔴 UPS not turning on', nextId: 'wont-turn-on' },
        { label: '⚡ No output power', nextId: 'no-output' },
        { label: '🔋 Short backup time', nextId: 'short-backup' },
        { label: '🔔 Constant beeping', nextId: 'beeping' },
        { label: '⚠️ Error/fault display', nextId: 'error' }
      ]
    },
    {
      id: 'wont-turn-on',
      question: 'Is mains power available?',
      options: [
        { label: 'Yes, mains is on', result: {
          diagnosis: 'UPS Internal Fault',
          severity: 'high',
          causes: ['Blown internal fuse', 'Failed power supply', 'Control board failure', 'Input breaker tripped'],
          solutions: ['Check input breaker', 'Verify input voltage', 'Check internal fuses if accessible', 'Professional repair needed'],
          diyPossible: false, estimatedCost: 'KES 15,000 - 100,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: 'No, mains is off', result: {
          diagnosis: 'Battery Depleted',
          severity: 'low',
          causes: ['Batteries fully discharged', 'Long outage', 'Weak/old batteries'],
          solutions: ['Wait for mains to return', 'UPS will restart when charged', 'Consider battery replacement if frequent'],
          diyPossible: true, estimatedCost: 'Free - KES 50,000', timeToFix: '2-4 hours charging', callExpert: false
        }}
      ]
    },
    {
      id: 'no-output',
      question: 'Is the UPS displaying any information?',
      options: [
        { label: 'Display shows overload', result: {
          diagnosis: 'UPS Overloaded',
          severity: 'medium',
          causes: ['Connected load exceeds capacity', 'Motor starting surge', 'Short circuit on output'],
          solutions: ['Disconnect some loads', 'Check load calculations', 'Identify power-hungry equipment', 'Upgrade UPS if undersized'],
          diyPossible: true, estimatedCost: 'Free', timeToFix: '15-30 minutes', callExpert: false
        }},
        { label: 'Shows battery fault', result: {
          diagnosis: 'Battery Failure',
          severity: 'high',
          causes: ['Dead battery cells', 'Battery over 3 years old', 'Connection loose', 'Battery fuse blown'],
          solutions: ['Check battery connections', 'Test battery voltage', 'Replace batteries', 'Verify battery fuse'],
          diyPossible: true, estimatedCost: 'KES 20,000 - 200,000', timeToFix: '1-3 hours', callExpert: false
        }},
        { label: 'Normal display but no output', result: {
          diagnosis: 'Output Circuit Fault',
          severity: 'high',
          causes: ['Output breaker tripped', 'Inverter failure', 'Static bypass activated', 'Output fuse blown'],
          solutions: ['Check output breaker', 'Verify bypass switch position', 'Professional inverter testing'],
          diyPossible: false, estimatedCost: 'KES 30,000 - 150,000', timeToFix: '2-6 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'short-backup',
      question: 'How old are the batteries?',
      options: [
        { label: 'Less than 2 years', result: {
          diagnosis: 'Load Increase or Battery Issue',
          severity: 'medium',
          causes: ['Increased connected load', 'Defective battery', 'Charger not working properly', 'Incorrect battery type'],
          solutions: ['Audit connected load', 'Test battery capacity', 'Check charger output', 'Verify battery specifications'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 80,000', timeToFix: '1-3 hours', callExpert: true
        }},
        { label: '2-4 years', result: {
          diagnosis: 'Battery Aging',
          severity: 'medium',
          causes: ['Normal battery degradation', 'High temperature exposure', 'Deep discharge cycles'],
          solutions: ['Plan battery replacement', 'Test battery capacity', 'Consider higher quality batteries'],
          diyPossible: true, estimatedCost: 'KES 30,000 - 200,000', timeToFix: '1-2 hours', callExpert: false
        }},
        { label: 'Over 4 years', result: {
          diagnosis: 'Batteries End of Life',
          severity: 'high',
          causes: ['Natural battery aging', 'Capacity below 80%'],
          solutions: ['Replace batteries immediately', 'Use same type and capacity', 'Consider lithium upgrade'],
          diyPossible: true, estimatedCost: 'KES 40,000 - 300,000', timeToFix: '1-3 hours', callExpert: false
        }}
      ]
    },
    {
      id: 'beeping',
      question: 'What is the beep pattern?',
      options: [
        { label: 'Continuous beep', result: {
          diagnosis: 'Critical Alarm - Overload or Fault',
          severity: 'critical',
          causes: ['Severe overload', 'Internal fault', 'Battery critical', 'Output short circuit'],
          solutions: ['Reduce load immediately', 'Check for shorts', 'Note error codes', 'Call technician'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 100,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'Intermittent beep (every few seconds)', result: {
          diagnosis: 'On Battery / Low Battery Warning',
          severity: 'low',
          causes: ['Mains power failure', 'Battery running low', 'Input voltage out of range'],
          solutions: ['Check mains power', 'Reduce non-essential loads', 'Wait for mains to restore'],
          diyPossible: true, estimatedCost: 'Free', timeToFix: 'N/A', callExpert: false
        }},
        { label: 'Single beep on startup', result: {
          diagnosis: 'Normal Operation',
          severity: 'low',
          causes: ['Self-test completed', 'Normal startup'],
          solutions: ['No action needed', 'UPS is working correctly'],
          diyPossible: true, estimatedCost: 'Free', timeToFix: 'N/A', callExpert: false
        }}
      ]
    },
    {
      id: 'error',
      question: 'What type of error is shown?',
      options: [
        { label: 'Fan failure', result: {
          diagnosis: 'Cooling Fan Failure',
          severity: 'high',
          causes: ['Fan motor failure', 'Dust blockage', 'Fan connector loose'],
          solutions: ['Clean UPS vents', 'Check fan operation', 'Replace fan', 'Ensure adequate ventilation'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 40,000', timeToFix: '1-3 hours', callExpert: true
        }},
        { label: 'Rectifier/charger fault', result: {
          diagnosis: 'Charger Circuit Failure',
          severity: 'high',
          causes: ['Charger board failure', 'Input surge damage', 'Component aging'],
          solutions: ['Professional diagnosis', 'Board repair/replacement', 'Check input protection'],
          diyPossible: false, estimatedCost: 'KES 30,000 - 100,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: 'Communication fault', result: {
          diagnosis: 'Monitoring/Communication Error',
          severity: 'low',
          causes: ['Network cable disconnected', 'SNMP card issue', 'Software glitch'],
          solutions: ['Check network connection', 'Restart monitoring software', 'Update firmware'],
          diyPossible: true, estimatedCost: 'Free - KES 20,000', timeToFix: '30 min - 2 hours', callExpert: false
        }}
      ]
    }
  ],

  // ========== HVAC/AC TROUBLESHOOTING ==========
  hvac: [
    {
      id: 'start',
      question: 'What issue are you experiencing with your AC/HVAC?',
      options: [
        { label: '❄️ Not cooling', nextId: 'not-cooling' },
        { label: '💨 Weak airflow', nextId: 'weak-airflow' },
        { label: '🔊 Strange noises', nextId: 'noises' },
        { label: '💧 Water leaking', nextId: 'leaking' },
        { label: '🔴 Unit not starting', nextId: 'not-starting' }
      ]
    },
    {
      id: 'not-cooling',
      question: 'Is the outdoor unit (condenser) running?',
      options: [
        { label: 'Yes, running normally', nextId: 'cooling-check-indoor' },
        { label: 'Not running at all', result: {
          diagnosis: 'Outdoor Unit Failure',
          severity: 'high',
          causes: ['Compressor failure', 'Capacitor failure', 'Contactor issue', 'Power supply problem'],
          solutions: ['Check circuit breaker', 'Test capacitor', 'Check contactor', 'Compressor replacement if failed'],
          diyPossible: false, estimatedCost: 'KES 15,000 - 150,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: 'Running but making noise', result: {
          diagnosis: 'Compressor or Fan Issue',
          severity: 'high',
          causes: ['Compressor starting to fail', 'Fan motor bearing worn', 'Low refrigerant causing strain'],
          solutions: ['Professional diagnosis', 'Check refrigerant level', 'May need compressor replacement'],
          diyPossible: false, estimatedCost: 'KES 20,000 - 200,000', timeToFix: '2-8 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'cooling-check-indoor',
      question: 'Is cold air coming from the indoor unit?',
      options: [
        { label: 'Slightly cool but not cold', result: {
          diagnosis: 'Low Refrigerant or Dirty System',
          severity: 'medium',
          causes: ['Refrigerant leak', 'Dirty filters', 'Dirty coils', 'Blocked condenser'],
          solutions: ['Clean or replace filters', 'Clean indoor and outdoor coils', 'Check for refrigerant leaks', 'Recharge refrigerant if low'],
          diyPossible: true, estimatedCost: 'KES 3,000 - 30,000', timeToFix: '1-3 hours', callExpert: false
        }},
        { label: 'Room temperature air', result: {
          diagnosis: 'Refrigerant System Failure',
          severity: 'high',
          causes: ['Major refrigerant leak', 'Compressor not compressing', 'Expansion valve stuck', 'System blockage'],
          solutions: ['Professional leak detection', 'Pressure testing', 'Component replacement as needed'],
          diyPossible: false, estimatedCost: 'KES 15,000 - 100,000', timeToFix: '3-8 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'weak-airflow',
      question: 'When was the filter last cleaned/replaced?',
      options: [
        { label: 'Over 3 months ago or never', result: {
          diagnosis: 'Clogged Air Filter',
          severity: 'low',
          causes: ['Dust accumulation', 'Pet hair', 'Normal use'],
          solutions: ['Remove and wash filter (if reusable)', 'Replace disposable filter', 'Clean every 2-4 weeks'],
          diyPossible: true, estimatedCost: 'Free - KES 3,000', timeToFix: '15-30 minutes', callExpert: false
        }},
        { label: 'Recently cleaned', result: {
          diagnosis: 'Blower or Duct Issue',
          severity: 'medium',
          causes: ['Blower motor failing', 'Blower wheel dirty', 'Duct blockage', 'Damper closed'],
          solutions: ['Check blower wheel for dirt', 'Inspect ductwork', 'Test blower motor', 'Check damper positions'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 50,000', timeToFix: '1-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'noises',
      question: 'What type of noise is it?',
      options: [
        { label: 'Squealing/screeching', result: {
          diagnosis: 'Belt or Bearing Issue',
          severity: 'medium',
          causes: ['Worn belt', 'Dry bearings', 'Motor starting to fail'],
          solutions: ['Replace belt if applicable', 'Lubricate bearings', 'Replace motor if worn'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 40,000', timeToFix: '1-3 hours', callExpert: true
        }},
        { label: 'Rattling/vibrating', result: {
          diagnosis: 'Loose Components',
          severity: 'low',
          causes: ['Loose screws or panels', 'Debris in unit', 'Loose fan blade'],
          solutions: ['Tighten all visible screws', 'Remove debris', 'Check fan blade security'],
          diyPossible: true, estimatedCost: 'Free - KES 5,000', timeToFix: '30 min - 1 hour', callExpert: false
        }},
        { label: 'Grinding', result: {
          diagnosis: 'Motor Bearing Failure - STOP UNIT',
          severity: 'critical',
          causes: ['Bearing completely worn', 'Motor shaft damage'],
          solutions: ['Turn off immediately', 'Motor replacement needed', 'Continued use will cause more damage'],
          diyPossible: false, estimatedCost: 'KES 15,000 - 60,000', timeToFix: '2-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'leaking',
      question: 'Where is the water coming from?',
      options: [
        { label: 'From indoor unit', result: {
          diagnosis: 'Drain Line Blockage',
          severity: 'medium',
          causes: ['Clogged drain line', 'Dirty drain pan', 'Algae growth', 'Drain pump failure'],
          solutions: ['Clear drain line with vacuum or compressed air', 'Clean drain pan', 'Add algae tablets', 'Check drain pump if equipped'],
          diyPossible: true, estimatedCost: 'Free - KES 5,000', timeToFix: '30 min - 2 hours', callExpert: false
        }},
        { label: 'From outdoor unit', result: {
          diagnosis: 'Normal Condensation or Refrigerant Leak',
          severity: 'low',
          causes: ['Normal operation in humid weather', 'Defrost cycle water', 'Refrigerant leak (if oily)'],
          solutions: ['Normal if clear water', 'Check for oily residue (indicates refrigerant leak)', 'Call expert if refrigerant suspected'],
          diyPossible: true, estimatedCost: 'Free - KES 30,000', timeToFix: 'Varies', callExpert: false
        }}
      ]
    },
    {
      id: 'not-starting',
      question: 'What happens when you try to turn it on?',
      options: [
        { label: 'Nothing at all', result: {
          diagnosis: 'Power Supply Issue',
          severity: 'medium',
          causes: ['Tripped breaker', 'Blown fuse', 'Faulty thermostat', 'Control board failure'],
          solutions: ['Check and reset breaker', 'Check thermostat batteries', 'Verify power at unit', 'Professional diagnosis'],
          diyPossible: true, estimatedCost: 'Free - KES 30,000', timeToFix: '30 min - 3 hours', callExpert: false
        }},
        { label: 'Clicks but doesnt run', result: {
          diagnosis: 'Compressor Start Failure',
          severity: 'high',
          causes: ['Faulty capacitor', 'Failed start relay', 'Compressor locked', 'Low voltage'],
          solutions: ['Test and replace capacitor', 'Check start relay', 'Check voltage', 'May need compressor'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 150,000', timeToFix: '1-6 hours', callExpert: true
        }}
      ]
    }
  ],

  // ========== MOTOR TROUBLESHOOTING ==========
  motor: [
    {
      id: 'start',
      question: 'What issue are you experiencing with the motor?',
      options: [
        { label: '🔴 Motor wont start', nextId: 'wont-start' },
        { label: '🌡️ Motor overheating', nextId: 'overheating' },
        { label: '🔊 Unusual noise/vibration', nextId: 'noise' },
        { label: '⚡ Tripping breaker', nextId: 'tripping' },
        { label: '🔄 Low speed/power', nextId: 'low-power' }
      ]
    },
    {
      id: 'wont-start',
      question: 'What happens when power is applied?',
      options: [
        { label: 'Hums but doesnt turn', result: {
          diagnosis: 'Single Phase or Mechanical Lock',
          severity: 'high',
          causes: ['Single phasing (one phase missing)', 'Capacitor failure (single phase motor)', 'Bearing seized', 'Load jammed'],
          solutions: ['Check all 3 phases with multimeter', 'Test/replace capacitor', 'Try to rotate shaft by hand', 'Check driven equipment'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 80,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'Nothing at all', result: {
          diagnosis: 'Power Supply or Winding Failure',
          severity: 'high',
          causes: ['No power to motor', 'Open winding', 'Thermal overload tripped', 'Contactor not pulling in'],
          solutions: ['Check power supply', 'Reset thermal overload', 'Test contactor coil', 'Winding resistance test'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 100,000', timeToFix: '1-6 hours', callExpert: true
        }},
        { label: 'Starts then trips instantly', nextId: 'tripping' }
      ]
    },
    {
      id: 'overheating',
      question: 'Is the motor running under normal load?',
      options: [
        { label: 'Yes, normal operation', result: {
          diagnosis: 'Cooling or Electrical Issue',
          severity: 'high',
          causes: ['Blocked cooling vents', 'Fan failure', 'Voltage imbalance', 'Insulation breakdown starting'],
          solutions: ['Clean cooling vents', 'Check fan operation', 'Measure voltage on all phases', 'Insulation resistance test'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 60,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'Higher than normal load', result: {
          diagnosis: 'Overload Condition',
          severity: 'medium',
          causes: ['Driven equipment problem', 'Motor undersized', 'Misalignment', 'Bearing wear'],
          solutions: ['Reduce load', 'Check alignment', 'Inspect driven equipment', 'Consider larger motor'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 200,000', timeToFix: '2-8 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'noise',
      question: 'What type of noise?',
      options: [
        { label: 'Grinding/rough running', result: {
          diagnosis: 'Bearing Failure',
          severity: 'critical',
          causes: ['Worn bearings', 'Lack of lubrication', 'Bearing contamination'],
          solutions: ['STOP motor to prevent winding damage', 'Replace bearings', 'Check seals', 'May need rewinding if delayed'],
          diyPossible: false, estimatedCost: 'KES 15,000 - 80,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: 'Electrical humming/buzzing', result: {
          diagnosis: 'Electrical Issue',
          severity: 'medium',
          causes: ['Loose laminations', 'Voltage imbalance', 'Single phasing', 'Harmonic distortion'],
          solutions: ['Check voltage balance', 'Measure current on all phases', 'Check power quality', 'Motor inspection'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 50,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'Mechanical vibration', result: {
          diagnosis: 'Alignment or Balance Issue',
          severity: 'medium',
          causes: ['Shaft misalignment', 'Unbalanced rotor', 'Loose mounting', 'Coupling wear'],
          solutions: ['Check and correct alignment', 'Tighten mounting bolts', 'Inspect coupling', 'Dynamic balancing if needed'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 40,000', timeToFix: '1-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'tripping',
      question: 'How quickly does it trip?',
      options: [
        { label: 'Instantly on start', result: {
          diagnosis: 'Short Circuit or Ground Fault',
          severity: 'critical',
          causes: ['Winding short circuit', 'Ground fault in motor', 'Cable damage', 'Starter fault'],
          solutions: ['Do NOT restart', 'Insulation resistance test (Megger)', 'Check cables', 'Motor likely needs rewinding'],
          diyPossible: false, estimatedCost: 'KES 30,000 - 150,000', timeToFix: '4-24 hours', callExpert: true
        }},
        { label: 'After running for a while', result: {
          diagnosis: 'Overload or Thermal Issue',
          severity: 'medium',
          causes: ['Overloaded', 'Poor cooling', 'Voltage drop', 'Overload relay set too low'],
          solutions: ['Check current draw vs nameplate', 'Clean motor cooling', 'Check voltage at motor', 'Adjust overload setting'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 50,000', timeToFix: '1-4 hours', callExpert: true
        }}
      ]
    },
    {
      id: 'low-power',
      question: 'Has anything changed recently?',
      options: [
        { label: 'Power supply changes', result: {
          diagnosis: 'Voltage or Frequency Issue',
          severity: 'medium',
          causes: ['Low voltage', 'Frequency variation', 'Phase imbalance', 'VFD issue if installed'],
          solutions: ['Check voltage at motor terminals', 'Verify frequency', 'Check VFD settings', 'Install voltage stabilizer'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 100,000', timeToFix: '1-4 hours', callExpert: true
        }},
        { label: 'No changes/gradual decline', result: {
          diagnosis: 'Motor Degradation',
          severity: 'medium',
          causes: ['Winding deterioration', 'Bearing wear', 'Air gap changes', 'Age-related wear'],
          solutions: ['Motor testing (insulation, vibration)', 'Consider rewinding', 'Plan replacement', 'Predictive maintenance'],
          diyPossible: false, estimatedCost: 'KES 20,000 - 200,000', timeToFix: '1-3 days', callExpert: true
        }}
      ]
    }
  ],

  // ========== BOREHOLE PUMP TROUBLESHOOTING ==========
  borehole: [
    {
      id: 'start',
      question: 'What issue are you experiencing with the borehole pump?',
      options: [
        { label: '💧 No water coming out', nextId: 'no-water' },
        { label: '📉 Low water pressure/flow', nextId: 'low-flow' },
        { label: '⚡ Motor not running', nextId: 'motor-issue' },
        { label: '🔄 Pump cycling on/off', nextId: 'cycling' },
        { label: '🟤 Dirty/sandy water', nextId: 'dirty-water' }
      ]
    },
    {
      id: 'no-water',
      question: 'Is the pump motor running?',
      options: [
        { label: 'Yes, motor is running', nextId: 'pump-not-pumping' },
        { label: 'No, motor not running', nextId: 'motor-issue' }
      ]
    },
    {
      id: 'pump-not-pumping',
      question: 'How long has the pump been in use?',
      options: [
        { label: 'Less than 3 years', result: {
          diagnosis: 'Pump Blockage or Water Level Issue',
          severity: 'medium',
          causes: ['Water table dropped', 'Pump inlet blocked', 'Check valve stuck', 'Air lock in pipe'],
          solutions: ['Check water level in borehole', 'Wait for water table to recover', 'Check valve inspection', 'Try priming/air release'],
          diyPossible: false, estimatedCost: 'KES 5,000 - 50,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: '3-7 years', result: {
          diagnosis: 'Impeller or Wear Ring Wear',
          severity: 'high',
          causes: ['Worn impellers', 'Damaged wear rings', 'Shaft wear', 'Sand erosion'],
          solutions: ['Pull pump for inspection', 'Replace worn parts', 'Consider pump replacement if severe'],
          diyPossible: false, estimatedCost: 'KES 50,000 - 200,000', timeToFix: '4-8 hours', callExpert: true
        }},
        { label: 'Over 7 years', result: {
          diagnosis: 'Pump End of Life',
          severity: 'high',
          causes: ['Normal wear and tear', 'Seal failure', 'Motor winding degradation'],
          solutions: ['Replace pump', 'Consider more efficient model', 'Upgrade pipe size if needed'],
          diyPossible: false, estimatedCost: 'KES 100,000 - 500,000', timeToFix: '1-2 days', callExpert: true
        }}
      ]
    },
    {
      id: 'low-flow',
      question: 'Was the flow always low or did it decrease?',
      options: [
        { label: 'Gradually decreased', result: {
          diagnosis: 'Pump Wear or Borehole Silting',
          severity: 'medium',
          causes: ['Worn pump impellers', 'Borehole silting up', 'Clogged screen', 'Check valve partial blockage'],
          solutions: ['Pump inspection and servicing', 'Borehole cleaning/rehabilitation', 'Screen cleaning'],
          diyPossible: false, estimatedCost: 'KES 30,000 - 150,000', timeToFix: '4-8 hours', callExpert: true
        }},
        { label: 'Sudden decrease', result: {
          diagnosis: 'Blockage or Leak',
          severity: 'medium',
          causes: ['Pipe leak/burst', 'Valve partially closed', 'Pressure tank issue', 'Pump damage'],
          solutions: ['Check all valves are open', 'Inspect visible piping', 'Check pressure tank', 'Pull pump if needed'],
          diyPossible: false, estimatedCost: 'KES 10,000 - 100,000', timeToFix: '2-6 hours', callExpert: true
        }},
        { label: 'Always been low', result: {
          diagnosis: 'Undersized System or Low Yield',
          severity: 'medium',
          causes: ['Pump too small', 'Borehole low yield', 'Pipe too small', 'Too much head'],
          solutions: ['Borehole yield test', 'Review pump sizing', 'Check pipe sizing', 'Consider system upgrade'],
          diyPossible: false, estimatedCost: 'KES 20,000 - 300,000', timeToFix: '1-3 days', callExpert: true
        }}
      ]
    },
    {
      id: 'motor-issue',
      question: 'Is power reaching the motor?',
      options: [
        { label: 'Starter shows power', result: {
          diagnosis: 'Motor or Cable Failure',
          severity: 'high',
          causes: ['Motor winding failure', 'Submersible cable damaged', 'Seal failure (motor flooded)', 'Capacitor failure'],
          solutions: ['Insulation resistance test', 'Pull pump for inspection', 'Motor rewinding or replacement', 'Replace cable if damaged'],
          diyPossible: false, estimatedCost: 'KES 50,000 - 200,000', timeToFix: '4-8 hours', callExpert: true
        }},
        { label: 'No power at starter', result: {
          diagnosis: 'Power Supply Issue',
          severity: 'medium',
          causes: ['Tripped breaker', 'Control panel fault', 'Contactor failure', 'Overload tripped'],
          solutions: ['Check and reset breaker', 'Check control panel', 'Test contactor', 'Reset overload if tripped'],
          diyPossible: true, estimatedCost: 'KES 0 - 30,000', timeToFix: '30 min - 2 hours', callExpert: false
        }}
      ]
    },
    {
      id: 'cycling',
      question: 'How quickly does it cycle on and off?',
      options: [
        { label: 'Every few seconds', result: {
          diagnosis: 'Pressure Switch or Tank Issue',
          severity: 'medium',
          causes: ['Waterlogged pressure tank', 'Pressure switch faulty', 'Major leak in system', 'Check valve failure'],
          solutions: ['Check pressure tank air charge', 'Adjust/replace pressure switch', 'Find and fix leaks', 'Replace check valve'],
          diyPossible: true, estimatedCost: 'KES 5,000 - 50,000', timeToFix: '1-4 hours', callExpert: false
        }},
        { label: 'Every few minutes', result: {
          diagnosis: 'Minor Leak or Settings Issue',
          severity: 'low',
          causes: ['Small leak', 'Pressure switch needs adjustment', 'Check valve leaking slightly'],
          solutions: ['Check for leaks in system', 'Adjust pressure switch settings', 'Inspect check valve'],
          diyPossible: true, estimatedCost: 'KES 0 - 20,000', timeToFix: '1-2 hours', callExpert: false
        }}
      ]
    },
    {
      id: 'dirty-water',
      question: 'What does the water look like?',
      options: [
        { label: 'Sandy/gritty', result: {
          diagnosis: 'Borehole Screen or Casing Issue',
          severity: 'high',
          causes: ['Screen damage', 'Casing corrosion', 'Pump set too low', 'Gravel pack failure'],
          solutions: ['Pull pump to inspect depth', 'Borehole camera inspection', 'May need re-screening', 'Consider new borehole if severe'],
          diyPossible: false, estimatedCost: 'KES 50,000 - 500,000', timeToFix: '1-5 days', callExpert: true
        }},
        { label: 'Rusty/brown', result: {
          diagnosis: 'Iron Bacteria or Casing Corrosion',
          severity: 'medium',
          causes: ['Iron bacteria growth', 'Corroding steel casing', 'High iron content in water'],
          solutions: ['Shock chlorination', 'Iron removal filter', 'PVC casing liner if corrosion', 'Water treatment system'],
          diyPossible: false, estimatedCost: 'KES 30,000 - 200,000', timeToFix: '2-5 days', callExpert: true
        }},
        { label: 'Cloudy/milky', result: {
          diagnosis: 'Air in System or Sediment',
          severity: 'low',
          causes: ['Air entrainment', 'Fine sediment', 'New pump installation', 'Water table issues'],
          solutions: ['Let system run to clear', 'Install sediment filter', 'Check for air leaks in suction'],
          diyPossible: true, estimatedCost: 'KES 5,000 - 30,000', timeToFix: '1-3 hours', callExpert: false
        }}
      ]
    }
  ],

  // ========== GENERATOR TROUBLESHOOTING (existing) ==========
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
                    { id: 'solar', label: '☀️ Solar System', desc: 'Panels, inverters, batteries' },
                    { id: 'ups', label: '🔋 UPS System', desc: 'Uninterruptible power supply' },
                    { id: 'hvac', label: '❄️ AC/HVAC', desc: 'Air conditioning systems' },
                    { id: 'motor', label: '🔄 Motor', desc: 'Electric motors & rewinding' },
                    { id: 'borehole', label: '💧 Borehole Pump', desc: 'Submersible pumps' }
                  ].map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => setEquipmentType(eq.id)}
                      className="p-6 rounded-xl text-left transition-all bg-white/10 hover:bg-white/20 hover:scale-[1.02] hover:border-orange-500/50 border border-white/10"
                    >
                      <div className="text-3xl mb-2">{eq.label.split(' ')[0]}</div>
                      <div className="text-lg font-semibold text-white">{eq.label.split(' ').slice(1).join(' ')}</div>
                      <div className="text-sm text-gray-400">{eq.desc}</div>
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
                      href="https://wa.me/254768860665"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
                    >
                      💬 WhatsApp Expert
                    </a>
                    <a
                      href="tel:+254768860665"
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
