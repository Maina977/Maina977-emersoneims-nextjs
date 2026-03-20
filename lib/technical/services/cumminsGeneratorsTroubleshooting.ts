/**
 * CUMMINS GENERATORS - Troubleshooting Trees & Error Codes
 * Decision trees for diagnosing common problems
 */

import type { TroubleshootingTree, TroubleshootingNode } from '../technicalBible';

// ==================== TROUBLESHOOTING TREES ====================

export const CUMMINS_TROUBLESHOOTING: TroubleshootingTree[] = [
  {
    id: 'cummins-no-start',
    serviceId: 'diesel-generators',
    name: 'Generator Will Not Start',
    symptom: 'Engine does not crank or fails to start when start command is given',
    startNode: 'ns-1',
    nodes: [
      {
        id: 'ns-1',
        question: 'Does the starter motor crank the engine?',
        yesNode: 'ns-fuel-1',
        noNode: 'ns-elec-1'
      },
      // Electrical branch - no crank
      {
        id: 'ns-elec-1',
        question: 'Is battery voltage above 24V?',
        yesNode: 'ns-elec-2',
        noNode: 'ns-elec-bat'
      },
      {
        id: 'ns-elec-bat',
        question: 'Will batteries accept charge?',
        yesNode: 'ns-elec-charge',
        noNode: 'ns-elec-batrep',
        severity: 'warning'
      },
      {
        id: 'ns-elec-charge',
        solution: 'Batteries are discharged. Charge batteries using external charger. Check battery charger operation. Verify charger output is 27-28V. Check for parasitic drain when engine is off.',
        severity: 'warning',
        tools: ['Battery charger', 'Multimeter', 'Clamp meter'],
        timeEstimate: '4-12 hours for charge',
        partsList: ['Check charger fuse', 'Battery charger if faulty']
      },
      {
        id: 'ns-elec-batrep',
        solution: 'Batteries have failed. Replace both batteries as a set. Use same capacity and type. Check charging system before replacing.',
        severity: 'warning',
        tools: ['Wrenches', 'Battery terminal cleaner'],
        timeEstimate: '1 hour',
        partsList: ['12V 200Ah batteries x2']
      },
      {
        id: 'ns-elec-2',
        question: 'Is there 24V at the starter solenoid main terminal?',
        yesNode: 'ns-elec-3',
        noNode: 'ns-elec-iso'
      },
      {
        id: 'ns-elec-iso',
        solution: 'Check battery isolator switch is ON. Check main fuse (typically 200-400A ANL). Check battery cable connections for corrosion or looseness.',
        severity: 'warning',
        tools: ['Multimeter', 'Wrenches'],
        timeEstimate: '30 minutes',
        partsList: ['Main fuse if blown', 'Battery cables if damaged']
      },
      {
        id: 'ns-elec-3',
        question: 'Is there 24V at starter solenoid S terminal during start attempt?',
        yesNode: 'ns-elec-starter',
        noNode: 'ns-elec-control'
      },
      {
        id: 'ns-elec-control',
        question: 'Is the controller displaying any fault codes?',
        yesNode: 'ns-elec-fault',
        noNode: 'ns-elec-circuit'
      },
      {
        id: 'ns-elec-fault',
        solution: 'Read and diagnose fault codes. Common codes preventing start: Emergency Stop active (check E-stop), Low oil pressure shutdown (check oil level), Overcrank (fuel system issue), Controller fault. Clear codes after fixing issue.',
        severity: 'warning',
        tools: ['Diagnostic software', 'Laptop'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'ns-elec-circuit',
        solution: 'Check start circuit: Verify E-stop is released and circuit is complete. Check start relay coil and contacts. Check controller start output relay. Check safety interlock switches (oil pressure bypass, etc.).',
        severity: 'warning',
        tools: ['Multimeter', 'Wiring diagram'],
        timeEstimate: '1-2 hours',
        partsList: ['Start relay if faulty']
      },
      {
        id: 'ns-elec-starter',
        solution: 'Starter motor or solenoid is faulty. Test solenoid by applying 24V directly to S terminal - should click and engage. If no click, replace solenoid. If clicks but no crank, check starter motor brushes, bendix, or motor windings. Replace starter if necessary.',
        severity: 'critical',
        tools: ['Multimeter', 'Jumper wires', 'Socket set'],
        timeEstimate: '2-4 hours',
        partsList: ['Starter motor assembly', 'Starter solenoid']
      },
      // Fuel branch - cranks but no start
      {
        id: 'ns-fuel-1',
        question: 'Is there fuel in the tank (physically verified)?',
        yesNode: 'ns-fuel-2',
        noNode: 'ns-fuel-empty'
      },
      {
        id: 'ns-fuel-empty',
        solution: 'Refill fuel tank with clean diesel. Bleed fuel system from tank through to injectors. Prime with hand primer or electric pump. Crank in short bursts until engine fires.',
        severity: 'info',
        tools: ['Fuel can', 'Rags'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'ns-fuel-2',
        question: 'Is fuel reaching the fuel filter housing? (Check for fuel at bleed screw)',
        yesNode: 'ns-fuel-3',
        noNode: 'ns-fuel-supply'
      },
      {
        id: 'ns-fuel-supply',
        question: 'Is the fuel shutoff solenoid opening? (Should click when key is on)',
        yesNode: 'ns-fuel-block',
        noNode: 'ns-fuel-solenoid'
      },
      {
        id: 'ns-fuel-solenoid',
        solution: 'Fuel shutoff solenoid not operating. Check for 24V at solenoid connector during crank. If voltage present but no click, replace solenoid. If no voltage, check wiring and controller fuel output.',
        severity: 'critical',
        tools: ['Multimeter', 'Wrenches'],
        timeEstimate: '1-2 hours',
        partsList: ['Fuel shutoff solenoid 3935649']
      },
      {
        id: 'ns-fuel-block',
        solution: 'Fuel supply blocked before filter. Check: Manual shutoff valve open, Fuel lines not kinked or blocked, Primary filter not completely plugged, Fuel tank pickup not clogged. Replace fuel water separator and bleed system.',
        severity: 'warning',
        tools: ['Wrenches', 'Filter wrench'],
        timeEstimate: '1 hour',
        partsList: ['FS1000 fuel water separator']
      },
      {
        id: 'ns-fuel-3',
        question: 'Is there fuel at the high-pressure pump inlet?',
        yesNode: 'ns-fuel-4',
        noNode: 'ns-fuel-transfer'
      },
      {
        id: 'ns-fuel-transfer',
        solution: 'Fuel transfer pump not working. Check: Hand primer operation, Transfer pump drive, Secondary fuel filter blockage. Replace FF5052 fuel filter. If still no flow, transfer pump may need replacement.',
        severity: 'warning',
        tools: ['Filter wrench', 'Wrenches'],
        timeEstimate: '1-2 hours',
        partsList: ['FF5052 fuel filter', 'Transfer pump if faulty']
      },
      {
        id: 'ns-fuel-4',
        question: 'Is the engine cranking at adequate speed (>150 RPM)?',
        yesNode: 'ns-fuel-5',
        noNode: 'ns-crank-slow'
      },
      {
        id: 'ns-crank-slow',
        solution: 'Cranking speed too slow for starting. Causes: Weak batteries, High resistance in starting circuit, Wrong oil viscosity (too thick for temperature), Engine mechanical problem. Check battery voltage during crank (should stay above 20V). Check cable connections. Verify oil viscosity matches ambient temperature.',
        severity: 'warning',
        tools: ['Multimeter', 'Battery load tester'],
        timeEstimate: '1-2 hours',
        partsList: ['Batteries if weak', 'Correct grade oil']
      },
      {
        id: 'ns-fuel-5',
        question: 'Is there any smoke from the exhaust during cranking?',
        yesNode: 'ns-fuel-smoke',
        noNode: 'ns-fuel-nofuel'
      },
      {
        id: 'ns-fuel-smoke',
        question: 'What color is the exhaust smoke?',
        yesNode: 'ns-smoke-white',
        noNode: 'ns-smoke-black'
      },
      {
        id: 'ns-smoke-white',
        solution: 'White/grey smoke indicates fuel is reaching cylinders but not igniting properly. Causes: Low compression, Incorrect injection timing, Water in fuel, Cold ambient (needs preheat). Check: Compression test, Injection timing, Drain water from fuel system, Verify preheat system working.',
        severity: 'warning',
        tools: ['Compression tester', 'Timing tools'],
        timeEstimate: '2-4 hours'
      },
      {
        id: 'ns-smoke-black',
        solution: 'Black smoke during crank indicates too much fuel or restricted air. Check: Air filter not blocked, Turbo inlet not restricted, Injector problems (stuck open). Clean or replace air filter. Inspect turbo inlet.',
        severity: 'warning',
        tools: ['Air filter', 'Flashlight'],
        timeEstimate: '1 hour',
        partsList: ['Air filter AF25957']
      },
      {
        id: 'ns-fuel-nofuel',
        solution: 'No fuel reaching cylinders. Likely causes: Air in HP fuel system, HP pump not building pressure, Injectors not opening. Bleed HP system. Check rail pressure sensor reading during crank. If no pressure building, HP pump may be faulty. If pressure OK but no injection, check injector wiring and ECM.',
        severity: 'critical',
        tools: ['Diagnostic tool', 'Fuel pressure gauge'],
        timeEstimate: '2-4 hours',
        partsList: ['HP pump if faulty', 'Injectors if faulty']
      }
    ],
    relatedFaultCodes: ['115', '122', '234', '352', '559']
  },
  {
    id: 'cummins-low-power',
    serviceId: 'diesel-generators',
    name: 'Generator Low Power Output',
    symptom: 'Generator runs but does not produce rated kW or cannot handle load',
    startNode: 'lp-1',
    nodes: [
      {
        id: 'lp-1',
        question: 'Is the engine reaching rated speed (1500 RPM for 50Hz)?',
        yesNode: 'lp-elec-1',
        noNode: 'lp-eng-1'
      },
      // Engine speed issues
      {
        id: 'lp-eng-1',
        question: 'Is the engine speed stable or hunting (fluctuating)?',
        yesNode: 'lp-eng-stable',
        noNode: 'lp-eng-hunt'
      },
      {
        id: 'lp-eng-hunt',
        solution: 'Engine speed instability (hunting). Causes: Governor/actuator fault, Fuel supply restriction, Air leak in fuel system, Sensor fault. Check: Actuator linkage and movement, Fuel filter restriction, Air bubbles in fuel, Speed sensor signal.',
        severity: 'warning',
        tools: ['Diagnostic tool', 'Multimeter'],
        timeEstimate: '2-4 hours',
        partsList: ['Governor actuator', 'Fuel filters', 'Speed sensor']
      },
      {
        id: 'lp-eng-stable',
        question: 'Is the air filter restriction indicator triggered?',
        yesNode: 'lp-eng-air',
        noNode: 'lp-eng-fuel'
      },
      {
        id: 'lp-eng-air',
        solution: 'Restricted air supply limiting power. Replace air filter elements. Check air inlet ducting for obstructions. Inspect turbo inlet hose for collapse or damage.',
        severity: 'warning',
        tools: ['Filter wrench', 'Flashlight'],
        timeEstimate: '30 minutes',
        partsList: ['AF25957 air filter', 'Safety element']
      },
      {
        id: 'lp-eng-fuel',
        question: 'Are fuel filters recently changed and fuel supply adequate?',
        yesNode: 'lp-eng-turbo',
        noNode: 'lp-eng-fuelrest'
      },
      {
        id: 'lp-eng-fuelrest',
        solution: 'Fuel restriction limiting power. Replace both fuel filters. Check fuel tank for contamination. Verify fuel supply line size adequate. Check fuel return line not restricted.',
        severity: 'warning',
        tools: ['Filter wrench', 'Fuel sampling kit'],
        timeEstimate: '1 hour',
        partsList: ['FS1000', 'FF5052']
      },
      {
        id: 'lp-eng-turbo',
        question: 'Is turbo boost pressure within specification?',
        yesNode: 'lp-eng-timing',
        noNode: 'lp-eng-turbofault'
      },
      {
        id: 'lp-eng-turbofault',
        solution: 'Turbocharger not producing adequate boost. Check: Turbo shaft for excessive play, Compressor wheel for damage, Wastegate operation, Boost hoses for leaks, Intercooler for blockage. May require turbo rebuild or replacement.',
        severity: 'critical',
        tools: ['Boost gauge', 'Dial indicator'],
        timeEstimate: '2-4 hours diagnostic',
        partsList: ['Turbocharger assembly if faulty']
      },
      {
        id: 'lp-eng-timing',
        solution: 'Engine may have internal issues limiting power. Check: Compression on all cylinders (minimum 350 PSI), Injection timing, Valve clearances, Exhaust back pressure. May require engine overhaul if compression low.',
        severity: 'critical',
        tools: ['Compression tester', 'Timing tools', 'Feeler gauges'],
        timeEstimate: '4-8 hours diagnostic'
      },
      // Electrical power issues
      {
        id: 'lp-elec-1',
        question: 'Is output voltage at rated value (400V for 3-phase)?',
        yesNode: 'lp-elec-load',
        noNode: 'lp-elec-volt'
      },
      {
        id: 'lp-elec-volt',
        question: 'Is voltage low on all phases or just some?',
        yesNode: 'lp-elec-avr',
        noNode: 'lp-elec-winding'
      },
      {
        id: 'lp-elec-avr',
        solution: 'Voltage low on all phases - AVR or excitation issue. Check: AVR voltage potentiometer setting, AVR power supply (aux winding or PMG), Exciter field resistance (15-25 ohms typical), Rotating rectifier diodes. Adjust voltage pot. Replace AVR if faulty.',
        severity: 'warning',
        tools: ['Multimeter', 'Screwdriver'],
        timeEstimate: '1-2 hours',
        partsList: ['AVR SX460 or AS440']
      },
      {
        id: 'lp-elec-winding',
        solution: 'Voltage imbalance between phases indicates winding or connection problem. Check: Main stator connections for looseness, Winding resistance between phases (should be equal), Insulation resistance to ground (minimum 2 megohms). May require alternator rewind if winding damaged.',
        severity: 'critical',
        tools: ['Multimeter', 'Megger'],
        timeEstimate: '2-4 hours diagnostic',
        partsList: ['Alternator rewind if required']
      },
      {
        id: 'lp-elec-load',
        question: 'Is the load balanced across all three phases?',
        yesNode: 'lp-elec-pf',
        noNode: 'lp-elec-unbal'
      },
      {
        id: 'lp-elec-unbal',
        solution: 'Unbalanced load causing power limitation. Generator must derate for unbalanced loads. Maximum imbalance typically 20%. Redistribute loads to balance phases. Add load balancing equipment if necessary.',
        severity: 'info',
        tools: ['Clamp meter'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'lp-elec-pf',
        question: 'Is the power factor of the load above 0.8?',
        yesNode: 'lp-elec-temp',
        noNode: 'lp-elec-pflimit'
      },
      {
        id: 'lp-elec-pflimit',
        solution: 'Low power factor loads reduce available kW. Generator rated kVA not kW. At PF 0.6, only 60% of kVA available as kW. Solutions: Add power factor correction capacitors, Replace inefficient loads, Upgrade generator size.',
        severity: 'info',
        tools: ['Power analyzer'],
        timeEstimate: 'Varies'
      },
      {
        id: 'lp-elec-temp',
        solution: 'Alternator may be thermally limited. Check: Bearing temperature (max 95°C), Winding temperature (Class H = 180°C), Ambient temperature, Cooling air flow. Clean alternator air passages. Check for blocked ventilation.',
        severity: 'warning',
        tools: ['IR thermometer', 'Temperature gauge'],
        timeEstimate: '1 hour'
      }
    ],
    relatedFaultCodes: ['122', '234', '343', '352', '415']
  },
  {
    id: 'cummins-overheating',
    serviceId: 'diesel-generators',
    name: 'Engine Overheating',
    symptom: 'Engine coolant temperature exceeds normal operating range (95°C+)',
    startNode: 'oh-1',
    nodes: [
      {
        id: 'oh-1',
        question: 'Is the coolant level correct in the expansion tank?',
        yesNode: 'oh-2',
        noNode: 'oh-lowcool'
      },
      {
        id: 'oh-lowcool',
        question: 'Is there visible external coolant leak?',
        yesNode: 'oh-leak',
        noNode: 'oh-internal'
      },
      {
        id: 'oh-leak',
        solution: 'External coolant leak causing overheating. Inspect: All hoses and clamps, Water pump weep hole, Radiator core and tanks, Thermostat housing gasket, Coolant filter housing. Repair leak and refill with 50% glycol mixture.',
        severity: 'warning',
        tools: ['Flashlight', 'Pressure tester'],
        timeEstimate: '1-4 hours',
        partsList: ['Hoses', 'Clamps', 'Gaskets as needed']
      },
      {
        id: 'oh-internal',
        solution: 'Possible internal coolant leak (head gasket, liner seals). Signs: White exhaust smoke, Coolant in oil (milky), Oil in coolant, Pressurized cooling system. Perform cooling system pressure test. If pressure drops without external leak, internal leak likely. May require head gasket replacement or liner work.',
        severity: 'critical',
        tools: ['Pressure tester', 'Combustion leak tester'],
        timeEstimate: '8-40 hours',
        partsList: ['Head gasket set', 'Liner seals']
      },
      {
        id: 'oh-2',
        question: 'Is the radiator fan operating and spinning in correct direction?',
        yesNode: 'oh-3',
        noNode: 'oh-fan'
      },
      {
        id: 'oh-fan',
        solution: 'Fan not providing adequate cooling. Check: Fan belt tension and condition, Fan clutch operation (if equipped), Fan blades for damage, Fan shroud properly installed. Replace belt if worn. Replace fan clutch if slipping.',
        severity: 'warning',
        tools: ['Belt tension gauge', 'Flashlight'],
        timeEstimate: '1-2 hours',
        partsList: ['Fan belt', 'Fan clutch if equipped']
      },
      {
        id: 'oh-3',
        question: 'Is the radiator core clean and unobstructed?',
        yesNode: 'oh-4',
        noNode: 'oh-radclean'
      },
      {
        id: 'oh-radclean',
        solution: 'Radiator core blocked reducing cooling capacity. Clean radiator core with low-pressure water from engine side outward. Use approved radiator cleaner for oil/grease contamination. For severe blockage, may need professional cleaning or radiator replacement.',
        severity: 'warning',
        tools: ['Pressure washer', 'Radiator cleaner'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'oh-4',
        question: 'Is the thermostat opening at correct temperature (82°C)?',
        yesNode: 'oh-5',
        noNode: 'oh-thermo'
      },
      {
        id: 'oh-thermo',
        solution: 'Thermostat stuck closed or opening late. Remove and test thermostat in hot water with thermometer. Should start opening at 82°C and be fully open by 95°C. Replace thermostat and gasket. Fill and bleed cooling system.',
        severity: 'warning',
        tools: ['Thermometer', 'Container for testing'],
        timeEstimate: '1-2 hours',
        partsList: ['Thermostat', 'Thermostat gasket']
      },
      {
        id: 'oh-5',
        question: 'Is the water pump functioning properly? (Check for coolant circulation)',
        yesNode: 'oh-6',
        noNode: 'oh-pump'
      },
      {
        id: 'oh-pump',
        solution: 'Water pump not circulating coolant. Check: Drive belt intact, Pump impeller not corroded or loose, Pump shaft bearing not seized. Replace water pump if impeller damaged or bearing worn.',
        severity: 'critical',
        tools: ['Flashlight', 'Belt tension gauge'],
        timeEstimate: '2-4 hours',
        partsList: ['Water pump assembly 3920779']
      },
      {
        id: 'oh-6',
        question: 'Is the coolant concentration correct (45-55% glycol)?',
        yesNode: 'oh-7',
        noNode: 'oh-coolmix'
      },
      {
        id: 'oh-coolmix',
        solution: 'Incorrect coolant mixture reduces heat transfer. Test coolant with refractometer. If outside 45-55% range, drain and refill with correct mixture. Use only Cummins-approved coolant. Check SCA additive levels.',
        severity: 'warning',
        tools: ['Refractometer', 'SCA test strips'],
        timeEstimate: '1-2 hours',
        partsList: ['Coolant', 'SCA additive']
      },
      {
        id: 'oh-7',
        solution: 'If all above checks pass, consider: Overloading beyond rated capacity, High ambient temperature exceeding rating, Exhaust restriction, Injection timing issue, Internal engine problem. Reduce load. Provide additional ventilation. Check exhaust back pressure.',
        severity: 'warning',
        tools: ['Load meter', 'Backpressure gauge'],
        timeEstimate: '2-4 hours'
      }
    ],
    relatedFaultCodes: ['144', '151', '111']
  },
  {
    id: 'cummins-low-oil-pressure',
    serviceId: 'diesel-generators',
    name: 'Low Oil Pressure',
    symptom: 'Oil pressure gauge reads low or oil pressure warning activated',
    startNode: 'op-1',
    nodes: [
      {
        id: 'op-1',
        question: 'Is engine oil level between MIN and MAX on dipstick?',
        yesNode: 'op-2',
        noNode: 'op-level'
      },
      {
        id: 'op-level',
        solution: 'Add correct grade oil (15W-40 meeting CES 20081) to bring level to MAX mark. Check for oil leaks. If oil consumption excessive, check for: Leaking gaskets/seals, Worn valve seals, Worn piston rings.',
        severity: 'critical',
        tools: ['Oil', 'Funnel'],
        timeEstimate: '15 minutes',
        partsList: ['Engine oil 15W-40']
      },
      {
        id: 'op-2',
        question: 'Is the correct oil grade installed for ambient temperature?',
        yesNode: 'op-3',
        noNode: 'op-grade'
      },
      {
        id: 'op-grade',
        solution: 'Wrong oil viscosity can cause low pressure readings. Check oil specification: Use 15W-40 for -15°C to +45°C ambient. Use 10W-30 for colder climates. Change oil if incorrect grade used.',
        severity: 'warning',
        tools: ['Oil', 'Drain pan'],
        timeEstimate: '1 hour',
        partsList: ['Correct grade engine oil', 'Oil filter LF9009']
      },
      {
        id: 'op-3',
        question: 'Is oil pressure low only at idle or at all speeds?',
        yesNode: 'op-idle',
        noNode: 'op-allspeed'
      },
      {
        id: 'op-idle',
        solution: 'Low pressure only at idle may be normal for worn engines. Normal idle pressure: 20-30 PSI minimum. Check: Pressure relief valve for debris or wear, Oil pump wear, Main bearing wear. If pressure above minimum at idle and normal at speed, continue monitoring.',
        severity: 'info',
        tools: ['Mechanical oil pressure gauge'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'op-allspeed',
        question: 'Has oil pressure suddenly dropped or gradually decreased over time?',
        yesNode: 'op-sudden',
        noNode: 'op-gradual'
      },
      {
        id: 'op-sudden',
        solution: 'Sudden pressure loss indicates serious problem. STOP ENGINE IMMEDIATELY. Check: Oil level (may have lost oil), Oil filter not loose, Oil cooler not leaking, Oil gallery plug not blown out. Do not restart until cause found and repaired.',
        severity: 'critical',
        tools: ['Flashlight', 'Inspection'],
        timeEstimate: 'Varies'
      },
      {
        id: 'op-gradual',
        question: 'Is the oil pressure sensor giving accurate readings? (Test with mechanical gauge)',
        yesNode: 'op-internal',
        noNode: 'op-sensor'
      },
      {
        id: 'op-sensor',
        solution: 'Oil pressure sensor or sender may be faulty. Install mechanical pressure gauge at sensor port. Compare readings. If mechanical gauge shows normal pressure but sensor does not, replace oil pressure sensor.',
        severity: 'warning',
        tools: ['Mechanical gauge', 'Wrenches'],
        timeEstimate: '1 hour',
        partsList: ['Oil pressure sensor']
      },
      {
        id: 'op-internal',
        solution: 'Internal engine wear causing low oil pressure. Causes: Worn main/rod bearings, Worn oil pump, Worn camshaft bearings. Oil analysis can help identify wear metals. May require engine overhaul or replacement.',
        severity: 'critical',
        tools: ['Oil analysis kit'],
        timeEstimate: 'Engine overhaul: 40-80 hours'
      }
    ],
    relatedFaultCodes: ['141', '143', '415']
  },
  {
    id: 'cummins-voltage-unstable',
    serviceId: 'diesel-generators',
    name: 'Unstable Output Voltage',
    symptom: 'Generator output voltage fluctuates or is unstable',
    startNode: 'vu-1',
    nodes: [
      {
        id: 'vu-1',
        question: 'Is the engine speed (RPM) stable?',
        yesNode: 'vu-2',
        noNode: 'vu-engine'
      },
      {
        id: 'vu-engine',
        solution: 'Engine speed instability causes voltage fluctuation. 1% speed change = 1% voltage change. Check: Governor actuator, Fuel system, Speed sensor, ECM calibration. Resolve engine hunting first.',
        severity: 'warning',
        tools: ['Tachometer', 'Diagnostic tool'],
        timeEstimate: '2-4 hours'
      },
      {
        id: 'vu-2',
        question: 'Is voltage fluctuation related to load changes?',
        yesNode: 'vu-transient',
        noNode: 'vu-continuous'
      },
      {
        id: 'vu-transient',
        solution: 'Voltage dip/overshoot on load change is normal but should recover quickly. Check: AVR stability setting (may need adjustment), Engine governor response, Load step size (reduce if too large). If equipped with PMG, should handle 300% load steps.',
        severity: 'info',
        tools: ['Oscilloscope', 'Screwdriver'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'vu-continuous',
        question: 'Is the voltage hunting (regular oscillation) or erratic (random)?',
        yesNode: 'vu-hunting',
        noNode: 'vu-erratic'
      },
      {
        id: 'vu-hunting',
        solution: 'Voltage hunting indicates AVR instability. Adjust AVR stability potentiometer: Turn CLOCKWISE to reduce gain if hunting. Small adjustments (1/8 turn). If hunting persists, AVR may be faulty or wrong model for alternator.',
        severity: 'warning',
        tools: ['Screwdriver', 'Voltmeter'],
        timeEstimate: '30 minutes',
        partsList: ['AVR if faulty']
      },
      {
        id: 'vu-erratic',
        question: 'Are the AVR sensing connections secure?',
        yesNode: 'vu-avrfault',
        noNode: 'vu-sensing'
      },
      {
        id: 'vu-sensing',
        solution: 'Loose or intermittent sensing connections cause erratic voltage. Check: All AVR terminal screws tight, Sensing wire condition, Fuses in sensing circuit not blown. Tighten connections. Replace damaged wires.',
        severity: 'warning',
        tools: ['Screwdriver', 'Multimeter'],
        timeEstimate: '1 hour'
      },
      {
        id: 'vu-avrfault',
        question: 'Is the exciter field resistance within specification (15-25 ohms)?',
        yesNode: 'vu-rectifier',
        noNode: 'vu-exciter'
      },
      {
        id: 'vu-exciter',
        solution: 'Exciter field resistance out of range indicates winding damage. If too low: Shorted turns in exciter stator. If too high: Open circuit or connection problem. Exciter stator may need rewind.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: 'Varies - rewind if needed'
      },
      {
        id: 'vu-rectifier',
        solution: 'Rotating rectifier diodes may be failing. Test each diode: Should read ~0.5V forward, infinite reverse. Any shorted or open diodes cause voltage instability. Replace complete diode pack if any faulty.',
        severity: 'warning',
        tools: ['Multimeter with diode test'],
        timeEstimate: '2-4 hours',
        partsList: ['Rotating rectifier diode pack']
      }
    ],
    relatedFaultCodes: ['155', '234', '551']
  }
];

// ==================== ERROR CODES ====================

export const CUMMINS_ERROR_CODES = [
  { code: '111', meaning: 'ECM Hardware Fault', severity: 'critical', solutions: ['Check ECM power supply', 'Inspect connectors', 'Replace ECM'] },
  { code: '115', meaning: 'Engine Speed Sensor Fault', severity: 'critical', solutions: ['Check sensor gap (0.5-1.0mm)', 'Test resistance (200-900Ω)', 'Replace sensor'] },
  { code: '122', meaning: 'Intake Manifold Pressure Sensor', severity: 'warning', solutions: ['Check boost hoses', 'Test MAP sensor', 'Replace if faulty'] },
  { code: '131', meaning: 'Throttle Position Sensor', severity: 'warning', solutions: ['Check TPS resistance sweep', 'Calibrate', 'Replace if faulty'] },
  { code: '141', meaning: 'Oil Pressure Sensor Fault', severity: 'warning', solutions: ['Check wiring', 'Test sensor', 'Replace sensor'] },
  { code: '143', meaning: 'Oil Pressure Low', severity: 'critical', solutions: ['Check oil level', 'Verify with mechanical gauge', 'Stop if confirmed low'] },
  { code: '144', meaning: 'Coolant Temperature High', severity: 'critical', solutions: ['Check coolant level', 'Inspect cooling system', 'Stop and investigate'] },
  { code: '151', meaning: 'Coolant Temperature Sensor', severity: 'warning', solutions: ['Test sensor resistance', 'Check wiring', 'Replace sensor'] },
  { code: '155', meaning: 'Intake Air Temperature Sensor', severity: 'warning', solutions: ['Test sensor', 'Check wiring', 'Replace if faulty'] },
  { code: '187', meaning: 'Sensor Supply Voltage Low', severity: 'warning', solutions: ['Check 5V supply at ECM', 'Check wiring', 'May indicate ECM fault'] },
  { code: '234', meaning: 'Engine Overspeed', severity: 'critical', solutions: ['Check governor actuator', 'Test speed sensor', 'Check for runaway cause'] },
  { code: '343', meaning: 'Intake Manifold Temp High', severity: 'warning', solutions: ['Check intercooler', 'Verify fan operation', 'Check ambient conditions'] },
  { code: '352', meaning: 'Fuel Pressure Low', severity: 'warning', solutions: ['Replace fuel filters', 'Check fuel supply', 'Test lift pump'] },
  { code: '415', meaning: 'Oil Pressure Low at Idle', severity: 'warning', solutions: ['Check oil level', 'Verify oil grade', 'Monitor trend'] },
  { code: '551', meaning: 'ECM Checksum Error', severity: 'critical', solutions: ['Re-flash ECM', 'Replace ECM if persists'] },
  { code: '559', meaning: 'Fuel Rail Pressure', severity: 'warning', solutions: ['Check HP pump', 'Test rail pressure sensor', 'Check injector return'] },
  { code: '689', meaning: 'Injector Circuit Fault', severity: 'warning', solutions: ['Check injector wiring', 'Test injector resistance', 'Replace faulty injector'] }
];

export default {
  troubleshootingTrees: CUMMINS_TROUBLESHOOTING,
  errorCodes: CUMMINS_ERROR_CODES
};
