'use client';

/**
 * Detailed Fault Display Component
 * Shows comprehensive fault code information with 2+ paragraph descriptions
 * for Overview, Diagnostics, Reset Steps, and Solutions
 *
 * Replaces external diagnostic tools - provides complete repair guidance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Detailed Fault Code Interface
export interface DetailedFaultCode {
  code: string;
  title: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  category: string;
  subcategory: string;

  // Detailed Descriptions (2+ paragraphs each)
  overview: string;
  diagnosticProcedure: string;
  resetInstructions: string;
  solutionGuide: string;

  // Structured Data
  possibleCauses: Array<{
    cause: string;
    likelihood: 'high' | 'medium' | 'low';
    testMethod: string;
  }>;

  diagnosticSteps: Array<{
    step: number;
    action: string;
    tools: string[];
    expectedResult: string;
    ifFailed: string;
  }>;

  resetSteps: Array<{
    step: number;
    instruction: string;
    keySequence?: string[];
    warning?: string;
  }>;

  repairSolutions: Array<{
    solution: string;
    difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
    timeEstimate: string;
    partsNeeded: string[];
    toolsRequired: string[];
    procedureSteps: string[];
    costEstimate: { min: number; max: number; currency: string };
  }>;

  // Safety and Prevention
  safetyWarnings: string[];
  preventionTips: string[];

  // Additional Context
  relatedCodes: string[];
  technicalNotes: string;
}

// Sample Detailed Fault Codes Database
export const DETAILED_FAULT_CODES: Record<string, DetailedFaultCode> = {
  '190-0': {
    code: '190-0',
    title: 'Low Engine Oil Pressure',
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Lubrication System',

    overview: `Error code 190-0 indicates that the engine oil pressure has dropped below the minimum safe operating threshold established by the controller's protection parameters. This is one of the most critical alarms in any generator system because insufficient oil pressure will lead to catastrophic engine failure within minutes. The engine's internal components - including crankshaft bearings, connecting rod bearings, camshaft, pistons, and cylinder walls - depend entirely on a continuous film of pressurized oil to prevent metal-to-metal contact. When this film breaks down due to low pressure, friction increases exponentially, generating extreme heat and causing rapid wear that can destroy the engine in as little as 30 seconds to 2 minutes.

The oil pressure in a diesel generator engine serves multiple critical functions beyond simple lubrication. First, it creates a hydrodynamic wedge between moving surfaces, keeping them separated even under extreme loads. Second, the oil carries away heat from internal components, serving as a secondary cooling system. Third, oil pressure activates hydraulic components like valve lifters and timing tensioners in many modern engines. Fourth, the oil film seals the gaps between piston rings and cylinder walls, maintaining compression. When pressure drops, all of these functions are compromised simultaneously, which is why the controller is programmed to shut down the engine immediately rather than risk continued operation. The 190-0 code will trigger an immediate engine shutdown in most controller configurations, and the engine will not restart until the underlying cause is identified and corrected.`,

    diagnosticProcedure: `Begin diagnosis by verifying the actual oil pressure using a mechanical gauge connected directly to the engine's main oil gallery. Do not rely solely on the controller's reading, as the sensor or wiring could be faulty. Remove the electrical oil pressure sender and install a calibrated mechanical gauge in its place. Start the engine and observe the reading at idle - a healthy diesel engine should show 25-40 PSI (1.7-2.8 bar) at idle and 40-65 PSI (2.8-4.5 bar) at rated speed under load. If the mechanical gauge confirms low pressure, the problem is mechanical. If the mechanical gauge shows normal pressure but the controller reads low, the problem is electrical - either the sender, wiring, or controller input.

For mechanical low pressure issues, systematically work through the oil system from simplest to most complex causes. Start by checking the oil level on the dipstick with the engine stopped and level - oil should be between the MIN and MAX marks. Low oil level is the most common cause of this alarm and the easiest to fix. If oil level is correct, check the oil condition - if it's very thin, diluted with fuel, or has a milky appearance indicating coolant contamination, this will reduce its ability to maintain pressure. Next, inspect the oil filter - a severely clogged filter can restrict flow enough to cause pressure problems, especially at cold start. Locate and inspect the oil pressure relief valve, typically found on the oil pump or engine block - a stuck-open relief valve will prevent the system from building adequate pressure. Listen for unusual engine noises that might indicate bearing wear - a low rumbling or knocking sound from the lower engine suggests main or rod bearing problems that allow oil to escape faster than the pump can supply it.`,

    resetInstructions: `IMPORTANT: Do NOT reset this alarm until you have positively identified and corrected the root cause of the low oil pressure condition. Resetting the alarm and restarting the engine with actual low oil pressure will cause catastrophic and expensive engine damage within minutes. This alarm exists specifically to prevent such damage, and bypassing it is never appropriate.

Once you have confirmed that oil pressure is now within normal parameters (verified with a mechanical gauge if any doubt exists), you can reset the alarm using the following procedures. On most controllers, this is classified as a "shutdown" or "lockout" alarm that requires a specific reset sequence rather than simply pressing the stop button. First, ensure the engine is stopped and the cause has been corrected. Then, locate the alarm reset function - on Type A controllers, press and hold the STOP button for 3 seconds, then press RESET (or ALARM MUTE depending on model). On Type B controllers, navigate to the Alarm History screen, select the active alarm, and press the RESET soft key. On Type C and D controllers, the reset button is typically a dedicated physical button - press and hold for 2-3 seconds. On Type E controllers, press the SERVICE button, navigate to ACTIVE FAULTS, select the fault, and choose CLEAR. Some controllers require that oil pressure be above the minimum threshold before they will allow a reset - if the engine won't restart after reset, verify actual oil pressure again and check that the oil pressure sender is correctly reading the actual pressure.`,

    solutionGuide: `The solution to error 190-0 depends entirely on correctly diagnosing the root cause. The most common causes in order of frequency are: insufficient oil level, failed oil pressure sender/wiring, degraded oil condition, clogged oil filter, failed oil pump, worn engine bearings, and failed oil pressure relief valve. Each requires a different repair approach.

For low oil level issues, simply add the correct grade of oil until the dipstick reads between MIN and MAX marks. However, also investigate WHY the oil level was low - check for external leaks at gaskets, seals, and fittings, and check for internal consumption indicated by blue/white exhaust smoke. For sender/wiring issues, replace the oil pressure sender and inspect the wiring harness for damage, corrosion, or loose connections. Use manufacturer-specified genuine parts, as aftermarket sensors often have incorrect calibration. For degraded oil, perform a complete oil and filter change using the manufacturer-recommended oil grade and genuine filters. For a clogged filter, replace with a genuine part and consider reducing the change interval if this recurs. For oil pump failure, the oil pump must be replaced - this typically requires significant disassembly and is a moderate to advanced repair. For worn bearings, this indicates the engine needs a major overhaul or replacement - bearing wear cannot be corrected without complete engine disassembly. For relief valve problems, the valve can often be cleaned, inspected, and reinstalled, or replaced if the spring is weak or the valve is damaged. Always verify the repair was successful by running the engine and confirming normal oil pressure readings on both the mechanical gauge and the controller before returning the generator to service.`,

    possibleCauses: [
      { cause: 'Low oil level', likelihood: 'high', testMethod: 'Check dipstick with engine off and level' },
      { cause: 'Faulty oil pressure sender', likelihood: 'high', testMethod: 'Compare controller reading with mechanical gauge' },
      { cause: 'Wiring fault to sender', likelihood: 'medium', testMethod: 'Inspect wiring, check continuity and resistance' },
      { cause: 'Degraded or incorrect oil', likelihood: 'medium', testMethod: 'Check oil condition, grade, and change history' },
      { cause: 'Clogged oil filter', likelihood: 'medium', testMethod: 'Replace filter, note pressure change' },
      { cause: 'Failed oil pump', likelihood: 'low', testMethod: 'Mechanical gauge test, pump inspection' },
      { cause: 'Worn engine bearings', likelihood: 'low', testMethod: 'Listen for knocking, check oil for metal particles' },
      { cause: 'Stuck oil pressure relief valve', likelihood: 'low', testMethod: 'Inspect relief valve operation' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Check engine oil level using dipstick',
        tools: ['Clean rag', 'Flashlight'],
        expectedResult: 'Oil level between MIN and MAX marks',
        ifFailed: 'Add correct grade oil to MAX level, investigate cause of oil loss',
      },
      {
        step: 2,
        action: 'Install mechanical oil pressure gauge on engine',
        tools: ['Mechanical oil pressure gauge (0-100 PSI)', 'Appropriate fittings', 'Thread sealant'],
        expectedResult: 'At idle: 25-40 PSI. At rated speed: 40-65 PSI',
        ifFailed: 'If mechanical gauge shows low pressure, problem is mechanical. If shows normal, problem is electrical.',
      },
      {
        step: 3,
        action: 'Check oil pressure sender resistance',
        tools: ['Multimeter', 'Manufacturer resistance chart'],
        expectedResult: 'Resistance varies with pressure per manufacturer spec (typically 10-180 ohms)',
        ifFailed: 'Replace oil pressure sender',
      },
      {
        step: 4,
        action: 'Inspect sender wiring from controller to engine',
        tools: ['Multimeter', 'Wiring diagram'],
        expectedResult: 'Continuity from controller terminal to sender, no shorts to ground',
        ifFailed: 'Repair or replace damaged wiring',
      },
      {
        step: 5,
        action: 'Check oil condition and filter',
        tools: ['Oil sample container', 'New filter'],
        expectedResult: 'Oil should be clean, correct viscosity, no contamination',
        ifFailed: 'Perform oil and filter change, investigate contamination source',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Confirm oil pressure is now within normal range using mechanical gauge',
        warning: 'Do NOT proceed if actual oil pressure is still low',
      },
      {
        step: 2,
        instruction: 'Ensure engine is stopped',
      },
      {
        step: 3,
        instruction: 'On controller, press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 4,
        instruction: 'Press RESET or ALARM MUTE button',
        keySequence: ['RESET'],
      },
      {
        step: 5,
        instruction: 'Verify alarm has cleared from display',
      },
      {
        step: 6,
        instruction: 'Attempt to start engine and verify oil pressure stabilizes quickly',
        warning: 'If alarm returns immediately, stop engine and re-diagnose',
      },
    ],

    repairSolutions: [
      {
        solution: 'Add Engine Oil',
        difficulty: 'easy',
        timeEstimate: '5-10 minutes',
        partsNeeded: ['Engine oil (correct grade per manufacturer)', 'Funnel'],
        toolsRequired: ['Dipstick', 'Clean rag'],
        procedureSteps: [
          'Allow engine to sit for 5 minutes for oil to drain to sump',
          'Remove oil filler cap',
          'Add oil in small amounts (0.5L at a time)',
          'Check dipstick after each addition',
          'Stop when level reaches MAX mark',
          'Replace filler cap',
          'Start engine and verify pressure',
        ],
        costEstimate: { min: 500, max: 2000, currency: 'KES' },
      },
      {
        solution: 'Replace Oil Pressure Sender',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['OEM oil pressure sender', 'Thread sealant'],
        toolsRequired: ['Appropriate wrench (typically 22-27mm)', 'Wire brush', 'Multimeter'],
        procedureSteps: [
          'Locate oil pressure sender on engine block (usually near oil filter)',
          'Disconnect electrical connector',
          'Use wrench to unscrew old sender - expect some oil spillage',
          'Clean threads in engine block',
          'Apply thread sealant to new sender threads',
          'Install new sender and tighten (do not overtighten)',
          'Reconnect electrical connector',
          'Start engine and verify reading',
        ],
        costEstimate: { min: 2000, max: 8000, currency: 'KES' },
      },
      {
        solution: 'Oil and Filter Change',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Engine oil (correct quantity and grade)', 'Oil filter (OEM recommended)', 'Drain plug washer'],
        toolsRequired: ['Drain pan', 'Socket set', 'Filter wrench', 'Funnel', 'Torque wrench'],
        procedureSteps: [
          'Warm engine to operating temperature, then shut off',
          'Position drain pan under oil sump drain plug',
          'Remove drain plug and allow oil to drain completely (10-15 minutes)',
          'Remove old oil filter using filter wrench',
          'Clean filter mounting surface',
          'Apply thin film of new oil to new filter gasket',
          'Install new filter hand-tight plus 3/4 turn',
          'Install drain plug with new washer, torque to specification',
          'Fill with new oil to correct level',
          'Start engine and check for leaks',
          'Verify oil pressure is normal',
          'Recheck oil level after 5 minutes and top up if needed',
        ],
        costEstimate: { min: 3000, max: 15000, currency: 'KES' },
      },
      {
        solution: 'Oil Pump Replacement',
        difficulty: 'advanced',
        timeEstimate: '4-8 hours',
        partsNeeded: ['Oil pump assembly', 'Gaskets and seals', 'Engine oil'],
        toolsRequired: ['Complete socket and wrench set', 'Torque wrench', 'Engine crane/support', 'Oil pan removal tools'],
        procedureSteps: [
          'Drain engine oil completely',
          'Remove components blocking access to oil pump (varies by engine)',
          'Remove oil pan (may require engine lift)',
          'Remove old oil pump and pickup tube',
          'Clean mating surfaces thoroughly',
          'Prime new pump with oil before installation',
          'Install new pump with new gaskets',
          'Torque all bolts to specification',
          'Reinstall oil pan with new gasket',
          'Reinstall all removed components',
          'Fill with new oil',
          'Prime oil system before starting if possible',
          'Start engine and verify immediate oil pressure',
        ],
        costEstimate: { min: 25000, max: 80000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'NEVER operate engine with actual low oil pressure - catastrophic damage will occur within minutes',
      'Hot oil can cause severe burns - allow engine to cool before working on oil system',
      'Used motor oil is a carcinogen - wear gloves and avoid skin contact',
      'Properly dispose of used oil at authorized collection facility',
      'Ensure engine cannot start accidentally while working on oil system',
    ],

    preventionTips: [
      'Check oil level weekly or before each use',
      'Change oil and filter at manufacturer-recommended intervals',
      'Use only manufacturer-specified oil grade and quality',
      'Address any oil leaks promptly',
      'Install oil pressure gauge as permanent monitoring device',
      'Keep spare oil pressure sender on site for quick replacement',
    ],

    relatedCodes: ['190-1', '190-2', '190-8', '100-3', '100-4'],
    technicalNotes: 'Oil pressure requirements vary by engine manufacturer and operating conditions. Cold start pressure will be higher than hot idle pressure. Consult engine manual for specific pressure specifications for your model.',
  },

  '110-0': {
    code: '110-0',
    title: 'High Coolant Temperature',
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Cooling System',

    overview: `Error code 110-0 is triggered when the engine coolant temperature exceeds the maximum safe operating limit programmed in the controller, typically set between 95-105°C (203-221°F) depending on the engine and application. This protection exists to prevent severe thermal damage to the engine, including warped cylinder heads, blown head gaskets, seized pistons, damaged valve guides, and cracked engine blocks. When coolant temperature rises beyond safe limits, the aluminum or cast iron components of the engine expand beyond their design tolerances, causing mechanical interference and potential permanent damage. Additionally, excessively high temperatures cause the lubricating oil to lose its viscosity and protective properties, compounding the damage potential.

The cooling system in a diesel generator operates as a closed-loop heat rejection system. The water pump circulates coolant through passages cast into the engine block and cylinder head, absorbing combustion heat. This heated coolant then flows to the radiator where it passes through thin tubes surrounded by cooling fins. Air flowing across these fins - either from a belt-driven fan or auxiliary electric fan - removes the heat and returns cooled fluid to the engine. A thermostat regulates this flow to maintain optimal operating temperature. When any component in this system fails or becomes restricted, the engine's ability to reject heat is compromised. The controller monitors coolant temperature via a sender screwed into the engine water jacket, and when this reading exceeds the programmed limit, the controller immediately shuts down the engine to prevent damage. Unlike some other alarms, high temperature conditions rarely resolve themselves and require physical intervention to correct.`,

    diagnosticProcedure: `Start your diagnosis by verifying the actual coolant temperature. The controller's reading depends on the accuracy of the temperature sender and its wiring, so confirm with an infrared thermometer or contact pyrometer on the engine block and radiator hoses. Normal operating temperature for most diesel generators is 82-95°C (180-203°F). If the controller shows high temperature but the engine feels normal to the touch and infrared readings are normal, suspect a faulty temperature sender or wiring issue rather than an actual overheating condition.

If actual overheating is confirmed, work systematically through the cooling system. First, with the engine cool, carefully remove the radiator cap and check coolant level - it should be at the FULL mark when cold. Low coolant is the most common overheating cause and can result from external leaks (visible), internal leaks (head gasket to combustion or oil), or evaporation from a missing or faulty pressure cap. Next, inspect the radiator core for external blockage - dirt, insects, debris, or oil film on the cooling fins dramatically reduces heat transfer. The radiator can be cleaned with compressed air (blow from engine side out) or low-pressure water spray. Check that the cooling fan is operating correctly - listen for the fan running and feel for strong airflow through the radiator when the engine is hot. A slipping fan belt, failed fan clutch, or burned-out electric fan motor will prevent adequate airflow. Inspect the thermostat by removing it and testing in hot water - it should begin opening at its rated temperature (usually 82°C/180°F) and be fully open 10-15°C higher. A stuck-closed thermostat will cause rapid overheating. Finally, if all external components check out, consider internal engine problems such as a failed water pump impeller, blocked internal coolant passages, or a blown head gasket allowing combustion gases to pressurize and displace coolant.`,

    resetInstructions: `Before attempting to reset this alarm, the engine MUST be allowed to cool completely. Never add cold water or coolant to a hot engine - the thermal shock can crack the block or head. Allow the engine to cool naturally for at least 30-60 minutes, or longer in hot ambient conditions. Only when the coolant temperature has dropped below 50°C (122°F) should you proceed with diagnosis and repair.

Once the underlying cause has been identified and corrected, and the engine has cooled to safe temperatures, reset the alarm using your controller's procedure. For Type A controllers: press STOP for 3 seconds, then press RESET. For Type B: navigate to ALARM HISTORY, select the alarm, press RESET. For Type C: use the scroll wheel to find RESET ALARMS, confirm selection. For Type D: press MENU, navigate to ALARMS, select CLEAR ALL. For Type E: access SERVICE menu, select ACTIVE FAULTS, choose CLEAR. After resetting, start the engine and carefully monitor temperature. The engine should warm up gradually over 5-10 minutes to normal operating temperature (82-95°C) and then stabilize. If temperature continues climbing toward the alarm point, shut down immediately and continue diagnosis - the root cause has not been corrected.`,

    solutionGuide: `Solving overheating issues requires matching the repair to the diagnosed cause. The repair difficulty ranges from simple tasks like adding coolant to major work like head gasket replacement. Always start with the simplest and most common causes before assuming the worst.

For low coolant level, top up with the correct coolant mixture (typically 50/50 antifreeze and distilled water). Then identify and fix the source of coolant loss - check all hoses, the radiator, water pump weep hole, freeze plugs, and gasket joints for external leaks. For a dirty radiator, clean the external fins with compressed air or careful water spray, and consider a chemical flush of the internal passages if scale buildup is suspected. For fan problems, replace worn belts (check tension and condition), replace failed fan clutches (spin should lock when hot), or replace burned-out electric fan motors. For thermostat issues, always replace with an OEM-quality part rated for your engine - cheap thermostats often fail quickly or open at wrong temperatures. For water pump failure, replacement is typically straightforward but requires coolant system drain and refill. If head gasket failure is suspected (symptoms: coolant in oil, oil in coolant, white exhaust smoke, exhaust gases in coolant), this requires engine disassembly and is a major repair best left to experienced technicians. Throughout any cooling system repair, use only manufacturer-approved coolant, replace all hoses and clamps that show age or damage, and properly bleed all air from the system after refilling.`,

    possibleCauses: [
      { cause: 'Low coolant level', likelihood: 'high', testMethod: 'Check expansion tank and radiator when cold' },
      { cause: 'Faulty temperature sender', likelihood: 'medium', testMethod: 'Compare reading with infrared thermometer' },
      { cause: 'Blocked radiator (external)', likelihood: 'medium', testMethod: 'Visual inspection of radiator fins' },
      { cause: 'Fan belt slipping or broken', likelihood: 'medium', testMethod: 'Inspect belt condition and tension' },
      { cause: 'Failed thermostat (stuck closed)', likelihood: 'medium', testMethod: 'Remove and test in hot water' },
      { cause: 'Failed water pump', likelihood: 'low', testMethod: 'Check pump weep hole, feel for bearing play' },
      { cause: 'Blocked radiator (internal)', likelihood: 'low', testMethod: 'Temperature differential across radiator' },
      { cause: 'Head gasket failure', likelihood: 'low', testMethod: 'Compression test, combustion leak test' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Allow engine to cool completely (below 50°C)',
        tools: ['Patience', 'Infrared thermometer'],
        expectedResult: 'Engine cool enough to safely inspect',
        ifFailed: 'Wait longer - never work on hot cooling system',
      },
      {
        step: 2,
        action: 'Check coolant level in radiator and expansion tank',
        tools: ['Flashlight'],
        expectedResult: 'Coolant at proper level in both',
        ifFailed: 'Top up coolant and investigate source of loss',
      },
      {
        step: 3,
        action: 'Inspect radiator for external blockage',
        tools: ['Flashlight', 'Compressed air'],
        expectedResult: 'Clear airflow path through radiator core',
        ifFailed: 'Clean radiator thoroughly, inspect for damage',
      },
      {
        step: 4,
        action: 'Check fan operation and belt condition',
        tools: ['Belt tension gauge'],
        expectedResult: 'Fan spins freely, belt tight and undamaged',
        ifFailed: 'Adjust or replace belt, investigate fan drive',
      },
      {
        step: 5,
        action: 'Test thermostat operation',
        tools: ['Thermometer', 'Pot of water', 'Heat source'],
        expectedResult: 'Thermostat opens at rated temperature',
        ifFailed: 'Replace thermostat',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Ensure engine has cooled completely (below 50°C)',
        warning: 'Never work on hot cooling system - risk of burns',
      },
      {
        step: 2,
        instruction: 'Verify root cause has been identified and corrected',
      },
      {
        step: 3,
        instruction: 'Press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 4,
        instruction: 'Press RESET button',
        keySequence: ['RESET'],
      },
      {
        step: 5,
        instruction: 'Start engine and monitor temperature carefully',
        warning: 'If temperature rises quickly toward limit, shut down immediately',
      },
    ],

    repairSolutions: [
      {
        solution: 'Top Up Coolant',
        difficulty: 'easy',
        timeEstimate: '10-15 minutes',
        partsNeeded: ['Coolant (50/50 premix or concentrate)', 'Distilled water if using concentrate'],
        toolsRequired: ['Funnel'],
        procedureSteps: [
          'Ensure engine is completely cool',
          'Remove radiator cap carefully',
          'Fill radiator to top of filler neck',
          'Fill expansion tank to FULL mark',
          'Replace radiator cap',
          'Start engine and run until thermostat opens',
          'Top up expansion tank as needed',
          'Check for leaks',
        ],
        costEstimate: { min: 500, max: 2000, currency: 'KES' },
      },
      {
        solution: 'Replace Thermostat',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Thermostat (OEM spec)', 'Thermostat gasket or O-ring', 'Coolant'],
        toolsRequired: ['Socket set', 'Scraper', 'Drain pan'],
        procedureSteps: [
          'Drain coolant to below thermostat housing level',
          'Remove thermostat housing bolts',
          'Remove housing and old thermostat',
          'Clean gasket surfaces completely',
          'Install new thermostat (note orientation - spring toward engine)',
          'Install new gasket and housing',
          'Torque bolts to specification',
          'Refill cooling system',
          'Bleed air from system',
          'Test operation',
        ],
        costEstimate: { min: 2000, max: 8000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'NEVER remove radiator cap from hot engine - pressurized coolant will spray out causing severe burns',
      'Allow engine to cool completely before any cooling system work',
      'Coolant is toxic to animals and children - clean up spills and dispose properly',
      'Wear eye protection when working with cooling system',
      'If engine overheated severely, internal damage may have occurred even if it restarts',
    ],

    preventionTips: [
      'Check coolant level weekly',
      'Inspect cooling system hoses annually for cracks and swelling',
      'Replace coolant per manufacturer schedule (typically every 2-5 years)',
      'Keep radiator fins clean',
      'Replace thermostat preventively during major service',
      'Test coolant concentration annually with refractometer',
    ],

    relatedCodes: ['110-3', '110-4', '110-14', '111-0', '111-1'],
    technicalNotes: 'Operating temperature setpoints vary by engine and application. High-efficiency engines may run hotter by design. Always consult engine manual for specific temperature specifications.',
  },
};

interface DetailedFaultDisplayProps {
  faultCode: DetailedFaultCode;
  onReset?: () => void;
  className?: string;
}

export default function DetailedFaultDisplay({ faultCode, onReset, className = '' }: DetailedFaultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostic' | 'reset' | 'solution'>('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['causes']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const severityColors = {
    info: 'bg-blue-500/20 border-blue-500 text-blue-400',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    critical: 'bg-orange-500/20 border-orange-500 text-orange-400',
    shutdown: 'bg-red-500/20 border-red-500 text-red-400',
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'diagnostic', label: 'Diagnostics', icon: '🔍' },
    { id: 'reset', label: 'Reset Steps', icon: '🔄' },
    { id: 'solution', label: 'Solutions', icon: '🔧' },
  ];

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`p-4 border-l-4 ${severityColors[faultCode.severity]}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-mono font-bold text-white">{faultCode.code}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${severityColors[faultCode.severity]}`}>
                {faultCode.severity}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{faultCode.title}</h2>
            <div className="text-slate-400 text-sm mt-1">
              {faultCode.category} › {faultCode.subcategory}
            </div>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Reset Alarm
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Main Description */}
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {faultCode.overview}
                </div>
              </div>

              {/* Possible Causes */}
              <CollapsibleSection
                title="Possible Causes"
                expanded={expandedSections.includes('causes')}
                onToggle={() => toggleSection('causes')}
              >
                <div className="space-y-2">
                  {faultCode.possibleCauses.map((cause, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 bg-slate-800 rounded">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        cause.likelihood === 'high' ? 'bg-red-500/30 text-red-400' :
                        cause.likelihood === 'medium' ? 'bg-yellow-500/30 text-yellow-400' :
                        'bg-green-500/30 text-green-400'
                      }`}>
                        {cause.likelihood.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{cause.cause}</div>
                        <div className="text-slate-400 text-sm">{cause.testMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Safety Warnings */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span> Safety Warnings
                </h4>
                <ul className="space-y-1">
                  {faultCode.safetyWarnings.map((warning, idx) => (
                    <li key={idx} className="text-red-300 text-sm flex gap-2">
                      <span>•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'diagnostic' && (
            <motion.div
              key="diagnostic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Diagnostic Procedure */}
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {faultCode.diagnosticProcedure}
                </div>
              </div>

              {/* Step-by-Step Diagnostics */}
              <div className="space-y-3">
                <h4 className="text-white font-bold">Step-by-Step Diagnostic Procedure</h4>
                {faultCode.diagnosticSteps.map((step) => (
                  <div key={step.step} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{step.action}</div>
                        {step.tools.length > 0 && (
                          <div className="text-slate-400 text-sm mt-1">
                            <span className="text-slate-500">Tools:</span> {step.tools.join(', ')}
                          </div>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                            <div className="text-green-400 text-xs font-bold">Expected Result</div>
                            <div className="text-green-300 text-sm">{step.expectedResult}</div>
                          </div>
                          <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                            <div className="text-red-400 text-xs font-bold">If Failed</div>
                            <div className="text-red-300 text-sm">{step.ifFailed}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Reset Instructions */}
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {faultCode.resetInstructions}
                </div>
              </div>

              {/* Step-by-Step Reset */}
              <div className="space-y-3">
                <h4 className="text-white font-bold">Reset Procedure</h4>
                {faultCode.resetSteps.map((step) => (
                  <div key={step.step} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-white">{step.instruction}</div>
                        {step.keySequence && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {step.keySequence.map((key, idx) => (
                              <kbd key={idx} className="px-3 py-1 bg-slate-700 text-cyan-400 rounded font-mono text-sm">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                        {step.warning && (
                          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-sm">
                            ⚠️ {step.warning}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'solution' && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Solution Guide */}
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {faultCode.solutionGuide}
                </div>
              </div>

              {/* Repair Solutions */}
              <div className="space-y-4">
                <h4 className="text-white font-bold">Repair Solutions</h4>
                {faultCode.repairSolutions.map((solution, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center justify-between">
                        <h5 className="text-white font-bold">{solution.solution}</h5>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            solution.difficulty === 'easy' ? 'bg-green-500/30 text-green-400' :
                            solution.difficulty === 'moderate' ? 'bg-yellow-500/30 text-yellow-400' :
                            solution.difficulty === 'advanced' ? 'bg-orange-500/30 text-orange-400' :
                            'bg-red-500/30 text-red-400'
                          }`}>
                            {solution.difficulty.toUpperCase()}
                          </span>
                          <span className="text-slate-400 text-sm">{solution.timeEstimate}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-amber-400 font-medium">
                        Est. Cost: {solution.costEstimate.currency} {solution.costEstimate.min.toLocaleString()} - {solution.costEstimate.max.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-slate-500 text-xs font-bold mb-1">Parts Needed</div>
                        <div className="flex flex-wrap gap-1">
                          {solution.partsNeeded.map((part, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs font-bold mb-1">Tools Required</div>
                        <div className="flex flex-wrap gap-1">
                          {solution.toolsRequired.map((tool, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs font-bold mb-1">Procedure</div>
                        <ol className="space-y-1">
                          {solution.procedureSteps.map((step, i) => (
                            <li key={i} className="text-slate-300 text-sm flex gap-2">
                              <span className="text-cyan-400 font-bold">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prevention Tips */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Prevention Tips
                </h4>
                <ul className="space-y-1">
                  {faultCode.preventionTips.map((tip, idx) => (
                    <li key={idx} className="text-green-300 text-sm flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-400">
            <span className="font-medium">Related Codes:</span>{' '}
            {faultCode.relatedCodes.join(', ')}
          </div>
          <div className="text-slate-500 text-xs">
            Generated by Generator Oracle AI
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <span className="text-white font-medium">{title}</span>
        <motion.svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-slate-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
