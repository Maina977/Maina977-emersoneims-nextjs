'use client';

/**
 * COMPREHENSIVE DIAGNOSTIC Q&A SYSTEM
 * All services diagnostic troubleshooting guide
 * 17 service categories with detailed Q&A
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QAPair {
  question: string;
  answer: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  solutions?: string[];
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  qaPairs: QAPair[];
}

const DIAGNOSTIC_SERVICES: ServiceCategory[] = [
  {
    id: 'generators',
    name: 'Generators',
    icon: '⚡',
    color: 'cyan',
    qaPairs: [
      {
        question: 'Generator fails to start?',
        answer: 'Check battery charge (should be 12.5V+), fuel level, and oil level. Ensure fuel valve is open and check for air in fuel lines.',
        severity: 'high',
        solutions: [
          'Charge or replace battery',
          'Refill fuel tank',
          'Check oil level and top up',
          'Bleed air from fuel system',
          'Check starter motor connection'
        ]
      },
      {
        question: 'Generator starts but stops immediately?',
        answer: 'This indicates fuel starvation or faulty governor. Check fuel filter, fuel pump operation, and governor settings.',
        severity: 'high',
        solutions: [
          'Replace fuel filter',
          'Test fuel pump pressure (2.5-3.5 PSI)',
          'Adjust governor linkage',
          'Check for air leaks in fuel lines',
          'Clean carburetor or injectors'
        ]
      },
      {
        question: 'Generator produces no power output?',
        answer: 'Check AVR (Automatic Voltage Regulator), alternator field winding, and circuit breakers. Test with multimeter for continuity.',
        severity: 'critical',
        solutions: [
          'Test AVR output (should show 5-10V DC)',
          'Check alternator excitation',
          'Reset circuit breakers',
          'Test rotor windings for continuity',
          'Replace faulty AVR'
        ]
      },
      {
        question: 'Generator overheating?',
        answer: 'Check coolant level, radiator blockage, fan belt tension, and thermostat operation. Clean radiator fins.',
        severity: 'high',
        solutions: [
          'Top up coolant (50/50 antifreeze mix)',
          'Clean radiator fins',
          'Adjust or replace fan belt',
          'Test thermostat (opens at 82°C)',
          'Check water pump operation'
        ]
      },
      {
        question: 'Excessive black smoke from exhaust?',
        answer: 'Indicates rich fuel mixture or incomplete combustion. Check air filter, injectors, and engine timing.',
        severity: 'medium',
        solutions: [
          'Replace air filter',
          'Clean or replace fuel injectors',
          'Check injection timing',
          'Reduce load if overloaded',
          'Service turbocharger if equipped'
        ]
      },
      {
        question: 'Generator vibrating excessively?',
        answer: 'Check engine mounts, coupling alignment, and balance. Inspect for loose bolts and damaged isolators.',
        severity: 'medium',
        solutions: [
          'Tighten all mounting bolts',
          'Replace worn engine mounts',
          'Check coupling alignment (max 0.1mm)',
          'Balance alternator rotor',
          'Check for bent crankshaft'
        ]
      },
      {
        question: 'Low oil pressure warning?',
        answer: 'Check oil level immediately. If level is OK, inspect oil pump, filter, and pressure sensor. Stop engine if pressure below 20 PSI.',
        severity: 'critical',
        solutions: [
          'Add correct grade oil (15W-40 for diesels)',
          'Replace oil filter',
          'Test oil pressure sensor',
          'Check oil pump drive',
          'Inspect bearings for wear'
        ]
      },
      {
        question: 'Generator running but no voltage?',
        answer: 'AVR failure or loss of residual magnetism. Flash excitation field with 12V battery briefly.',
        severity: 'high',
        solutions: [
          'Flash field with 12V DC for 2 seconds',
          'Replace AVR',
          'Check rotor slip rings',
          'Test stator windings',
          'Verify brush contact'
        ]
      }
    ]
  },
  {
    id: 'solar',
    name: 'Solar Systems',
    icon: '☀️',
    color: 'yellow',
    qaPairs: [
      {
        question: 'Solar panels not charging batteries?',
        answer: 'Check panel orientation, shading, and connections. Test panel voltage in sunlight (should be 18-22V for 12V system).',
        severity: 'high',
        solutions: [
          'Clean panel surface',
          'Remove shading objects',
          'Test open circuit voltage',
          'Check charge controller settings',
          'Verify battery voltage'
        ]
      },
      {
        question: 'Inverter showing error code?',
        answer: 'Check specific error code in manual. Common issues: overvoltage, undervoltage, overload, or overtemperature.',
        severity: 'medium',
        solutions: [
          'Reduce AC load',
          'Check battery voltage (should be 11.5-14V)',
          'Improve ventilation',
          'Reset inverter',
          'Check wiring connections'
        ]
      },
      {
        question: 'Battery draining quickly?',
        answer: 'Test battery capacity (should hold 80%+ of rated Ah). Check for parasitic loads and overcharging.',
        severity: 'medium',
        solutions: [
          'Load test battery',
          'Check for phantom loads',
          'Adjust charge controller',
          'Replace aged batteries (5+ years)',
          'Balance battery bank'
        ]
      },
      {
        question: 'Low power output from panels?',
        answer: 'Panel degradation, dirt buildup, or bypass diode failure. Clean panels and test individual panel output.',
        severity: 'low',
        solutions: [
          'Clean panels with water and soft cloth',
          'Test each panel individually',
          'Check bypass diodes',
          'Inspect for micro-cracks',
          'Verify MPPT tracking'
        ]
      },
      {
        question: 'Inverter not switching to solar?',
        answer: 'Check battery voltage must be above 12.5V for inverter to accept solar input. Verify charge controller connection.',
        severity: 'medium',
        solutions: [
          'Charge batteries manually',
          'Check charge controller to inverter connection',
          'Verify inverter settings',
          'Test solar input terminals',
          'Reset inverter to default'
        ]
      }
    ]
  },
  {
    id: 'ac',
    name: 'Air Conditioning',
    icon: '❄️',
    color: 'blue',
    qaPairs: [
      {
        question: 'AC not cooling?',
        answer: 'Check thermostat setting, air filter, and refrigerant level. Verify compressor is running.',
        severity: 'high',
        solutions: [
          'Replace dirty air filter',
          'Check refrigerant pressure (R410A: 118 PSI low, 250 PSI high)',
          'Clean condenser coils',
          'Verify compressor operation',
          'Check for duct leaks'
        ]
      },
      {
        question: 'AC freezing up?',
        answer: 'Low airflow or low refrigerant. Check filter, blower, and refrigerant charge.',
        severity: 'medium',
        solutions: [
          'Turn off AC and let ice melt',
          'Replace air filter',
          'Check blower speed',
          'Test refrigerant charge',
          'Inspect evaporator coil'
        ]
      },
      {
        question: 'AC making loud noise?',
        answer: 'Worn compressor, loose fan blade, or debris in unit. Identify noise source and location.',
        severity: 'medium',
        solutions: [
          'Tighten fan blades',
          'Remove debris from outdoor unit',
          'Lubricate fan motors',
          'Check compressor mounts',
          'Balance condenser fan'
        ]
      },
      {
        question: 'AC tripping breaker?',
        answer: 'Overloaded circuit, short circuit, or compressor failure. Check amperage draw.',
        severity: 'high',
        solutions: [
          'Test amp draw (should be within rated specs)',
          'Check for short in wiring',
          'Test compressor run capacitor',
          'Verify correct breaker size',
          'Inspect contactor for damage'
        ]
      }
    ]
  },
  {
    id: 'ups',
    name: 'UPS Systems',
    icon: '🔋',
    color: 'purple',
    qaPairs: [
      {
        question: 'UPS not switching to battery?',
        answer: 'Dead batteries, faulty transfer switch, or low battery voltage. Test battery voltage (should be 13.5V+ for 12V battery).',
        severity: 'critical',
        solutions: [
          'Load test batteries',
          'Replace batteries if over 3 years old',
          'Check battery connections',
          'Test transfer switch operation',
          'Verify battery charger output'
        ]
      },
      {
        question: 'UPS runtime very short?',
        answer: 'Battery capacity degraded. Batteries typically last 3-5 years. Load test to verify.',
        severity: 'high',
        solutions: [
          'Perform battery capacity test',
          'Replace batteries (must replace all at once)',
          'Reduce connected load',
          'Check for phantom loads',
          'Verify charger voltage (13.8-14.4V)'
        ]
      },
      {
        question: 'UPS showing overload warning?',
        answer: 'Connected load exceeds UPS rating. Remove non-critical devices.',
        severity: 'medium',
        solutions: [
          'Calculate total wattage',
          'Remove non-essential devices',
          'Upgrade to larger UPS',
          'Check for faulty equipment drawing excess power',
          'Balance load across multiple UPS'
        ]
      },
      {
        question: 'UPS making beeping noise?',
        answer: 'On battery power (normal) or fault condition. Check display for error codes.',
        severity: 'low',
        solutions: [
          'Check if on battery (normal beep)',
          'Restore mains power',
          'Check battery status',
          'Review error code in manual',
          'Test self-test function'
        ]
      }
    ]
  },
  {
    id: 'motor-rewinding',
    name: 'Motor Rewinding',
    icon: '🔄',
    color: 'orange',
    qaPairs: [
      {
        question: 'Motor not starting after rewind?',
        answer: 'Check winding connections (delta or star), insulation resistance, and rotation direction.',
        severity: 'high',
        solutions: [
          'Verify winding connections match original',
          'Test insulation resistance (>1MΩ)',
          'Check centrifugal switch operation',
          'Verify correct voltage applied',
          'Test with known good capacitor'
        ]
      },
      {
        question: 'Motor overheating after rewind?',
        answer: 'Wrong wire gauge, incorrect turns, or ventilation issues. Check temperature rise.',
        severity: 'high',
        solutions: [
          'Verify wire gauge matches original',
          'Count turns and compare to spec',
          'Clean ventilation passages',
          'Check bearing condition',
          'Reduce load if oversized'
        ]
      },
      {
        question: 'Motor running but low power?',
        answer: 'Shorted turns, wrong winding configuration, or low voltage supply.',
        severity: 'medium',
        solutions: [
          'Test winding resistance balance',
          'Verify delta/star connection',
          'Check supply voltage under load',
          'Test for shorted turns with growler',
          'Verify no rotor rubs'
        ]
      }
    ]
  },
  {
    id: 'reticulation',
    name: 'Wire Reticulation',
    icon: '⚡',
    color: 'red',
    qaPairs: [
      {
        question: 'Voltage drop in distribution?',
        answer: 'Undersized cables, loose connections, or long cable runs. Calculate voltage drop (should be <3%).',
        severity: 'medium',
        solutions: [
          'Calculate required cable size',
          'Check all terminations',
          'Test contact resistance',
          'Upgrade to larger cable',
          'Reduce cable run length'
        ]
      },
      {
        question: 'Circuit breaker tripping frequently?',
        answer: 'Overload, short circuit, or nuisance tripping. Test actual load current.',
        severity: 'high',
        solutions: [
          'Measure load current',
          'Check for ground faults',
          'Test insulation resistance',
          'Verify correct breaker rating',
          'Balance loads across phases'
        ]
      },
      {
        question: 'Neutral to earth voltage high?',
        answer: 'Poor neutral connection, imbalanced loads, or earth fault. Should be <2V.',
        severity: 'high',
        solutions: [
          'Check neutral continuity',
          'Tighten all neutral connections',
          'Balance three-phase loads',
          'Test earth resistance (<1Ω)',
          'Inspect for damaged cables'
        ]
      }
    ]
  },
  {
    id: 'power-controls',
    name: 'Power Controls',
    icon: '🎛️',
    color: 'green',
    qaPairs: [
      {
        question: 'Controller not responding?',
        answer: 'Check power supply, verify correct voltage (12V or 24V), and inspect fuse.',
        severity: 'high',
        solutions: [
          'Test power supply voltage',
          'Replace blown fuse',
          'Check battery backup',
          'Reset controller',
          'Verify wiring connections'
        ]
      },
      {
        question: 'False alarms from controller?',
        answer: 'Sensor calibration drift or noisy signals. Check sensor readings.',
        severity: 'low',
        solutions: [
          'Calibrate sensors',
          'Check sensor wiring for interference',
          'Clean sensor contacts',
          'Update controller firmware',
          'Adjust alarm thresholds'
        ]
      }
    ]
  },
  {
    id: 'power-factor',
    name: 'Power Factor Correction',
    icon: '📊',
    color: 'indigo',
    qaPairs: [
      {
        question: 'Low power factor (<0.8)?',
        answer: 'Install capacitor banks to correct. Calculate required kVAR based on load.',
        severity: 'medium',
        solutions: [
          'Calculate kVAR requirement',
          'Install automatic PF controller',
          'Add capacitor banks in stages',
          'Check for harmonics',
          'Balance reactive loads'
        ]
      },
      {
        question: 'Capacitors overheating?',
        answer: 'Harmonics, overvoltage, or wrong rating. Test with power quality analyzer.',
        severity: 'high',
        solutions: [
          'Install harmonic filters',
          'Check supply voltage (±10%)',
          'Derate capacitors if needed',
          'Add reactors for harmonic protection',
          'Replace damaged capacitors'
        ]
      }
    ]
  },
  {
    id: 'changeover',
    name: 'Changeover Switches',
    icon: '🔀',
    color: 'pink',
    qaPairs: [
      {
        question: 'ATS not switching to generator?',
        answer: 'Check mains sensing, generator sensing, and control voltage. Verify delay timers.',
        severity: 'critical',
        solutions: [
          'Test mains sensing circuit',
          'Verify generator voltage present',
          'Check control power supply',
          'Adjust time delay settings',
          'Test contactor operation'
        ]
      },
      {
        question: 'Manual changeover stiff?',
        answer: 'Worn contacts, poor lubrication, or mechanical binding. Service switch mechanism.',
        severity: 'low',
        solutions: [
          'Lubricate moving parts',
          'Clean and dress contacts',
          'Check for corrosion',
          'Adjust spring tension',
          'Replace worn parts'
        ]
      },
      {
        question: 'Changeover arcing during switch?',
        answer: 'Load switching under power. Install break-before-make timer or reduce load.',
        severity: 'high',
        solutions: [
          'Add neutral delay (100ms)',
          'Reduce switching current',
          'Install arc suppression',
          'Check contact pressure',
          'Upgrade to larger contactor'
        ]
      }
    ]
  },
  {
    id: 'fuel-tanks',
    name: 'Fuel Tank Automation',
    icon: '⛽',
    color: 'amber',
    qaPairs: [
      {
        question: 'Level sensor reading incorrect?',
        answer: 'Calibration drift or sensor fouling. Clean and recalibrate sensor.',
        severity: 'low',
        solutions: [
          'Clean sensor probe',
          'Recalibrate sender',
          'Check wiring continuity',
          'Test sensor resistance',
          'Replace faulty sensor'
        ]
      },
      {
        question: 'Automatic pump not starting?',
        answer: 'Check float switch, relay, and pump motor. Verify control voltage.',
        severity: 'medium',
        solutions: [
          'Test float switch operation',
          'Check relay coil voltage',
          'Test pump motor',
          'Verify power supply',
          'Clean float mechanism'
        ]
      },
      {
        question: 'Fuel leak detection alarm?',
        answer: 'Inspect all connections, tank seams, and filler cap. Use leak detection solution.',
        severity: 'critical',
        solutions: [
          'Inspect tank for cracks',
          'Tighten all connections',
          'Replace damaged seals',
          'Check overflow vent',
          'Test containment bund'
        ]
      }
    ]
  },
  {
    id: 'incinerators',
    name: 'Incinerator Controls',
    icon: '🔥',
    color: 'red',
    qaPairs: [
      {
        question: 'Temperature not reaching setpoint?',
        answer: 'Check burner operation, fuel supply, and temperature sensor. Verify air flow.',
        severity: 'high',
        solutions: [
          'Clean burner nozzle',
          'Check fuel pressure',
          'Verify damper position',
          'Test temperature sensor',
          'Inspect refractory lining'
        ]
      },
      {
        question: 'Excessive smoke emission?',
        answer: 'Incomplete combustion. Adjust air-to-fuel ratio and check chamber temperature.',
        severity: 'high',
        solutions: [
          'Increase combustion air',
          'Check fuel quality',
          'Clean air passages',
          'Adjust burner settings',
          'Preheat secondary air'
        ]
      }
    ]
  },
  {
    id: 'borehole',
    name: 'Borehole Pump Repairs',
    icon: '💧',
    color: 'cyan',
    qaPairs: [
      {
        question: 'Pump not delivering water?',
        answer: 'Check water level, pump depth, foot valve, and delivery pipe for leaks.',
        severity: 'high',
        solutions: [
          'Measure static water level',
          'Lower pump if water table dropped',
          'Replace foot valve',
          'Inspect delivery pipe',
          'Check impellers for wear'
        ]
      },
      {
        question: 'Pump tripping overload?',
        answer: 'Motor overload, bearing failure, or voltage issues. Check amp draw.',
        severity: 'high',
        solutions: [
          'Measure running current',
          'Test insulation resistance',
          'Check for sand in pump',
          'Verify correct voltage',
          'Replace worn bearings'
        ]
      },
      {
        question: 'Low water pressure?',
        answer: 'Worn impellers, blocked strainer, or air in system. Check pump performance curve.',
        severity: 'medium',
        solutions: [
          'Clean strainer basket',
          'Bleed air from system',
          'Test pump head vs flow',
          'Replace worn impellers',
          'Check valve positions'
        ]
      }
    ]
  },
  {
    id: 'hammer-mills',
    name: 'Hammer Mill Fabrication',
    icon: '⚙️',
    color: 'gray',
    qaPairs: [
      {
        question: 'Excessive vibration in mill?',
        answer: 'Unbalanced rotor, worn bearings, or loose hammers. Inspect and balance.',
        severity: 'high',
        solutions: [
          'Check hammer wear',
          'Balance rotor',
          'Replace bearings',
          'Tighten all bolts',
          'Check alignment'
        ]
      },
      {
        question: 'Poor grinding quality?',
        answer: 'Worn hammers, wrong screen size, or excessive feed rate. Check hammer tips.',
        severity: 'medium',
        solutions: [
          'Replace worn hammers',
          'Install correct screen mesh',
          'Reduce feed rate',
          'Check rotor speed',
          'Clean air passages'
        ]
      }
    ]
  },
  {
    id: 'canopy',
    name: 'Generator Canopy',
    icon: '🏠',
    color: 'brown',
    qaPairs: [
      {
        question: 'Inadequate ventilation in canopy?',
        answer: 'Calculate required airflow: inlet area = radiator area × 1.5, outlet = inlet × 1.25.',
        severity: 'high',
        solutions: [
          'Enlarge inlet louvers',
          'Add exhaust fans',
          'Install weather louvers',
          'Check for blockages',
          'Add roof vents'
        ]
      },
      {
        question: 'Excessive noise from canopy?',
        answer: 'Add acoustic insulation, seal gaps, and install acoustic louvers.',
        severity: 'low',
        solutions: [
          'Install 50mm acoustic foam',
          'Seal all panel gaps',
          'Add acoustic louvers',
          'Install flexible exhaust',
          'Add vibration dampers'
        ]
      },
      {
        question: 'Canopy doors not sealing?',
        answer: 'Adjust hinges, replace rubber seals, and check door alignment.',
        severity: 'low',
        solutions: [
          'Adjust hinge positions',
          'Replace weather stripping',
          'Install magnetic catches',
          'Check door frame square',
          'Add compression locks'
        ]
      }
    ]
  },
  {
    id: 'mdb',
    name: 'MDB Fabrication',
    icon: '📦',
    color: 'slate',
    qaPairs: [
      {
        question: 'Busbar overheating?',
        answer: 'Check connection tightness, verify busbar sizing, and inspect for corrosion.',
        severity: 'critical',
        solutions: [
          'Tighten all connections (torque spec)',
          'Check busbar size vs load',
          'Clean contact surfaces',
          'Apply joint compound',
          'Check for loose neutral'
        ]
      },
      {
        question: 'Neutral to earth voltage present?',
        answer: 'Check neutral bar isolation, verify earth bonding, and test for circulating currents.',
        severity: 'medium',
        solutions: [
          'Verify neutral bar insulated',
          'Check earth conductor size',
          'Test earth resistance',
          'Inspect for stray currents',
          'Balance three-phase loads'
        ]
      }
    ]
  },
  {
    id: 'overhaul',
    name: 'Engine Overhauls',
    icon: '🔧',
    color: 'steel',
    qaPairs: [
      {
        question: 'Low compression after overhaul?',
        answer: 'Rings not seated, valve clearance wrong, or head gasket leak. Check compression (should be 300-400 PSI diesel).',
        severity: 'high',
        solutions: [
          'Run-in engine properly',
          'Adjust valve clearances',
          'Check head bolt torque',
          'Test for cylinder leak',
          'Verify ring gap correct'
        ]
      },
      {
        question: 'Oil consumption high after rebuild?',
        answer: 'Normal during run-in (first 25 hours). If persistent, check ring installation and valve seals.',
        severity: 'low',
        solutions: [
          'Complete proper run-in procedure',
          'Check ring orientation',
          'Inspect valve stem seals',
          'Verify bore finish',
          'Check oil grade (15W-40)'
        ]
      },
      {
        question: 'Engine knocking after overhaul?',
        answer: 'Check timing marks, bearing clearances, and injector timing. Stop engine if loud knocking.',
        severity: 'critical',
        solutions: [
          'Verify timing marks aligned',
          'Check main bearing clearances',
          'Test injection timing',
          'Inspect for debris in sump',
          'Verify torque converter if auto'
        ]
      }
    ]
  },
  {
    id: 'exhaust',
    name: 'Exhaust Fabrication',
    icon: '💨',
    color: 'gray',
    qaPairs: [
      {
        question: 'Excessive back pressure?',
        answer: 'Restrict back pressure to <75 mmH2O. Check for blockages, undersized pipe, or too many bends.',
        severity: 'high',
        solutions: [
          'Increase pipe diameter',
          'Reduce number of bends',
          'Clean soot buildup',
          'Check for collapsed pipe',
          'Install expansion bellows'
        ]
      },
      {
        question: 'Exhaust leaking at joints?',
        answer: 'Check flange flatness, gasket condition, and bolt torque. Use high-temp sealant.',
        severity: 'medium',
        solutions: [
          'Replace exhaust gaskets',
          'Torque bolts evenly',
          'Check flange faces flat',
          'Use graphite packing',
          'Add exhaust clamps'
        ]
      },
      {
        question: 'Resonance/vibration in exhaust?',
        answer: 'Add flexible section, change support spacing, or install resonator.',
        severity: 'low',
        solutions: [
          'Install flexible connector',
          'Add spring hangers',
          'Change support positions',
          'Install resonator chamber',
          'Use rubber isolators'
        ]
      }
    ]
  }
];

export default function AllServicesQA() {
  const [selectedService, setSelectedService] = useState<string>('generators');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentService = DIAGNOSTIC_SERVICES.find(s => s.id === selectedService) || DIAGNOSTIC_SERVICES[0];

  const filteredQAs = searchQuery
    ? currentService.qaPairs.filter(qa =>
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentService.qaPairs;

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-cyan-400">
                COMPREHENSIVE DIAGNOSTIC Q&A
              </h1>
              <p className="text-sm text-gray-400">
                Troubleshooting Guide for All Services
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-gray-900/50 border border-cyan-500/30 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Service Categories */}
          <div className="col-span-3">
            <div className="border border-cyan-500/30 bg-black/50 sticky top-8">
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-3">
                <h2 className="text-sm font-bold tracking-wider text-cyan-400">
                  SERVICES
                </h2>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {DIAGNOSTIC_SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left px-4 py-3 border transition-all ${
                      selectedService === service.id
                        ? `border-${service.color}-500 bg-${service.color}-500/20 text-${service.color}-400`
                        : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.qaPairs.length} Q&As</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Q&A Content */}
          <div className="col-span-9">
            <div className="border border-cyan-500/30 bg-black/50">
              <div className={`bg-${currentService.color}-500/10 border-b border-${currentService.color}-500/30 px-6 py-4`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{currentService.icon}</span>
                  <div>
                    <h2 className={`text-2xl font-bold text-${currentService.color}-400`}>
                      {currentService.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {filteredQAs.length} diagnostic questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {filteredQAs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-400">No results found for &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  filteredQAs.map((qa, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border ${getSeverityColor(qa.severity)} overflow-hidden`}
                    >
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === `${selectedService}-${index}` ? null : `${selectedService}-${index}`)}
                        className="w-full text-left p-4 flex items-start justify-between hover:bg-white/5 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {qa.severity && (
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                qa.severity === 'critical' ? 'border-red-500 text-red-400' :
                                qa.severity === 'high' ? 'border-orange-500 text-orange-400' :
                                qa.severity === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                'border-green-500 text-green-400'
                              }`}>
                                {qa.severity.toUpperCase()}
                              </span>
                            )}
                            <span className="text-sm font-bold text-white">{qa.question}</span>
                          </div>
                        </div>
                        <div className={`ml-4 transition-transform ${expandedQuestion === `${selectedService}-${index}` ? 'rotate-180' : ''}`}>
                          <span className="text-cyan-400">▼</span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedQuestion === `${selectedService}-${index}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-800"
                          >
                            <div className="p-4 bg-black/30">
                              <div className="mb-4">
                                <div className="text-xs text-cyan-400 font-bold mb-2">DIAGNOSIS:</div>
                                <div className="text-sm text-gray-300">{qa.answer}</div>
                              </div>

                              {qa.solutions && (
                                <div>
                                  <div className="text-xs text-green-400 font-bold mb-2">SOLUTIONS:</div>
                                  <ul className="space-y-2">
                                    {qa.solutions.map((solution, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>{solution}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Corners */}
      <div className="fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 pointer-events-none" />
    </div>
  );
}
