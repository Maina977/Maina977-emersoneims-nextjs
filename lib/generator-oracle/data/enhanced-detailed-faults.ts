/**
 * Enhanced Detailed Fault Codes Database
 * Comprehensive fault code library with 5+ paragraphs per section
 * Covers all major generator controller fault codes with professional-grade documentation
 */

import { DetailedFaultCode } from '@/components/generator-oracle/DetailedFaultDisplay';

// ==================== DSE FAULT CODES ====================

export const ENHANCED_DETAILED_FAULT_CODES: Record<string, DetailedFaultCode> = {

  // ==================== LOW OIL PRESSURE (190-0) ====================
  '190-0': {
    code: '190-0',
    title: 'Low Engine Oil Pressure',
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Lubrication System',

    overview: `Error code 190-0 indicates that the engine oil pressure has dropped below the minimum safe operating threshold established by the controller's protection parameters. This is one of the most critical alarms in any generator system because insufficient oil pressure will lead to catastrophic engine failure within minutes. The engine's internal components - including crankshaft bearings, connecting rod bearings, camshaft, pistons, and cylinder walls - depend entirely on a continuous film of pressurized oil to prevent metal-to-metal contact. When this film breaks down due to low pressure, friction increases exponentially, generating extreme heat and causing rapid wear that can destroy the engine in as little as 30 seconds to 2 minutes.

The oil pressure in a diesel generator engine serves multiple critical functions beyond simple lubrication. First, it creates a hydrodynamic wedge between moving surfaces, keeping them separated even under extreme loads. Second, the oil carries away heat from internal components, serving as a secondary cooling system. Third, oil pressure activates hydraulic components like valve lifters and timing tensioners in many modern engines. Fourth, the oil film seals the gaps between piston rings and cylinder walls, maintaining compression. When pressure drops, all of these functions are compromised simultaneously, which is why the controller is programmed to shut down the engine immediately rather than risk continued operation.

The severity of this alarm cannot be overstated. Unlike many other fault codes that indicate developing problems, low oil pressure represents an immediate threat to engine survival. The controller's response - immediate engine shutdown with lockout prevention of restart - reflects this urgency. Technicians must understand that this protective shutdown has potentially saved the generator from destruction, and proper diagnosis is essential before any restart attempt. The economic consequences of ignoring this warning and restarting prematurely can range from KES 500,000 for a rebuild to KES 3,000,000+ for complete engine replacement.

Understanding the oil system architecture helps in troubleshooting. The oil pump, typically gear-driven from the crankshaft, draws oil from the sump through a pickup tube with strainer. This oil passes through the main filter before entering the main oil gallery - a large passage machined into the engine block. From here, oil is distributed to main bearings, then through drilled passages in the crankshaft to rod bearings, and up through the block to the cylinder head for cam and valve lubrication. A pressure relief valve prevents over-pressurization. Any restriction or leak in this circuit can cause the pressure drop that triggers code 190-0.

Modern generator controllers monitor oil pressure continuously using either a resistive sender (variable resistance based on pressure) or a pressure transducer (4-20mA or 0-5V output). The controller compares this reading against programmed thresholds - typically a warning level around 15-20 PSI and a shutdown level around 8-12 PSI. Some controllers also monitor rate-of-change to detect sudden pressure drops. When the shutdown threshold is breached, the controller immediately de-energizes the fuel solenoid and records the event in its alarm history with timestamp, enabling post-incident analysis.`,

    diagnosticProcedure: `Begin diagnosis by verifying the actual oil pressure using a mechanical gauge connected directly to the engine's main oil gallery. Do not rely solely on the controller's reading, as the sensor or wiring could be faulty. Remove the electrical oil pressure sender and install a calibrated mechanical gauge in its place. Start the engine and observe the reading at idle - a healthy diesel engine should show 25-40 PSI (1.7-2.8 bar) at idle and 40-65 PSI (2.8-4.5 bar) at rated speed under load. If the mechanical gauge confirms low pressure, the problem is mechanical. If the mechanical gauge shows normal pressure but the controller reads low, the problem is electrical.

For mechanical low pressure issues, systematically work through the oil system from simplest to most complex causes. Start by checking the oil level on the dipstick with the engine stopped and level - oil should be between the MIN and MAX marks. Low oil level is the most common cause of this alarm and the easiest to fix. If oil level is correct, check the oil condition - if it's very thin, diluted with fuel, or has a milky appearance indicating coolant contamination, this will reduce its ability to maintain pressure. The viscosity of contaminated oil is compromised, reducing the oil pump's ability to generate adequate pressure.

Next, inspect the oil filter. A severely clogged filter can restrict flow enough to cause pressure problems, especially at cold start. Most quality oil filters have a bypass valve that opens if the filter becomes too restricted, but this bypass allows unfiltered oil to circulate. Check when the filter was last changed and consider replacing it as part of the diagnostic process. If the filter is severely clogged, this may indicate internal engine problems producing excessive debris, warranting further investigation including cutting open the old filter to examine the captured material.

Locate and inspect the oil pressure relief valve, typically found on the oil pump housing or engine block. This valve prevents over-pressurization by allowing oil to bypass back to the sump when pressure exceeds a set point (typically 60-80 PSI). A stuck-open relief valve will prevent the system from building adequate pressure at any speed. Remove the relief valve, inspect the plunger for wear or scoring, check the spring for proper tension, and clean any debris from the valve bore. The valve should move freely and return to the closed position under spring pressure.

Listen carefully for unusual engine noises that might indicate bearing wear. A low rumbling or knocking sound from the lower engine suggests main or rod bearing problems. Worn bearings have increased clearances that allow oil to escape faster than the pump can supply it, resulting in low pressure. If bearing noise is present, DO NOT run the engine further - the bearings may be on the verge of catastrophic failure. An oil sample analysis can reveal metallic particles indicative of bearing wear. If bearings are suspected, the only proper repair is engine disassembly and inspection, with bearing replacement as needed.

Additional diagnostic checks should include inspecting the oil pump pickup tube for cracks, loose connections, or blocked strainer screen. An air leak at the pickup allows the pump to cavitate, drastically reducing its output. Verify the oil pump drive is intact - some engines use a separate shaft or chain that can wear or break. On engines with external oil coolers, check that cooler passages are not blocked and that cooler bypass thermostats (if equipped) are functioning. Finally, consider the possibility of internal engine problems like a cracked block or failed oil gallery plugs that allow oil to leak internally rather than reaching the bearings.`,

    resetInstructions: `CRITICAL SAFETY WARNING: Do NOT reset this alarm until you have positively identified and corrected the root cause of the low oil pressure condition. Resetting the alarm and restarting the engine with actual low oil pressure will cause catastrophic and expensive engine damage within minutes. This alarm exists specifically to prevent such damage, and bypassing it without proper diagnosis is never appropriate. The protection system has done its job by shutting down the engine - your responsibility is to ensure the problem is fixed before allowing operation to resume.

Once you have confirmed that oil pressure is now within normal parameters (verified with a mechanical gauge if any doubt exists), you can proceed with the reset procedure. First, ensure the engine has completely stopped and the fuel system has been de-energized. Document your findings and repairs in the generator maintenance log, including the cause identified, parts replaced, and verification tests performed. This documentation is essential for warranty claims and maintenance history tracking.

For DSE controllers (4xxx, 5xxx, 7xxx, 8xxx series): Press and hold the STOP button for at least 3 seconds until the controller acknowledges the stop command. Then press the RESET button (or ALARM MUTE button on some models) to clear the shutdown alarm. The alarm LED should extinguish and the display should show ready status. If the alarm returns immediately upon reset attempt, the controller may still be seeing a fault condition - re-verify that oil pressure is actually normal.

For ComAp controllers (InteliLite, InteliGen, InteliSys): Navigate to the Alarm History screen using the front panel buttons. Select the active Low Oil Pressure alarm and press the RESET soft key. The controller will verify that the fault condition is no longer present before allowing the reset. If operating via InteliMonitor software, the reset can also be performed remotely through the software interface.

For Woodward controllers (EasyGen series): Press the SERVICE button to enter the service menu. Navigate to ACTIVE FAULTS using the arrow keys. Select the Low Oil Pressure fault and choose CLEAR or RESET. The controller will log the reset event with timestamp. Some Woodward controllers require a specific password or access level to reset shutdown-level alarms - consult your controller manual for the required access code.

For SmartGen controllers (HGM series): Press the RESET button on the front panel while the engine is stopped. If the reset is unsuccessful, navigate to ALARM HISTORY via the menu button and manually clear the alarm record. The HGM series will typically prevent reset if the oil pressure reading is still below the warning threshold, providing an additional safety check.

After successfully resetting the alarm, carefully monitor the engine during the restart and warm-up period. Oil pressure should build quickly (within 5-10 seconds) after cranking begins and should stabilize at normal levels within 30 seconds of running. If pressure is slow to build or stabilizes at a lower-than-normal level, shut down immediately and re-diagnose. The engine should be run under observation for at least 15-30 minutes before returning to unattended automatic operation, watching for any signs of recurring problems.`,

    solutionGuide: `The solution to error 190-0 depends entirely on correctly diagnosing the root cause. The most common causes in order of frequency are: insufficient oil level, failed oil pressure sender/wiring, degraded oil condition, clogged oil filter, failed oil pump, worn engine bearings, and failed oil pressure relief valve. Each requires a different repair approach, and attempting the wrong repair wastes time and money while potentially allowing the actual problem to cause further damage.

For low oil level issues (accounting for approximately 40% of 190-0 occurrences), the immediate solution is straightforward: add the correct grade of engine oil until the dipstick reads between the MIN and MAX marks. However, the complete solution requires investigating WHY the oil level was low. Check for external leaks at valve cover gaskets, oil pan gasket, front and rear main seals, oil filter housing, oil cooler connections, and oil drain plug. Use UV dye and a black light if leaks are not visually obvious. Check for internal consumption indicated by blue/white exhaust smoke, which suggests worn piston rings or valve stem seals. A generator that consumes oil should have its level checked at every daily inspection until the consumption issue is addressed.

For oil pressure sender and wiring issues (approximately 25% of cases), the repair involves either replacement or repair of the electrical components. Start by disconnecting the sender and measuring its resistance - compare against manufacturer specifications (typically 10 ohms at high pressure, 180 ohms at zero pressure for resistive senders). A sender that reads open circuit, short circuit, or doesn't vary with pressure changes needs replacement. When replacing, use genuine OEM parts - aftermarket senders often have incorrect calibration curves that cause false readings. Inspect the wiring harness from sender to controller for chafing, corrosion, rodent damage, or loose connections. Repair or replace damaged wiring, ensuring proper weather sealing at all connections.

For degraded or contaminated oil (approximately 15% of cases), perform a complete oil and filter change. Drain the old oil completely, capturing a sample for analysis if desired. Remove the old filter and note its condition - a severely contaminated filter or one with metallic debris indicates internal engine problems. Install a new genuine filter and fill with fresh oil of the correct grade (typically 15W-40 for most generator diesel engines, but verify against engine manual). If fuel dilution is suspected (oil smells of diesel, is very thin, and level is rising), investigate fuel injector and injection pump sealing. If coolant contamination is present (milky appearance, oil level rising, sweet smell), head gasket failure is likely and the engine will need disassembly.

For oil pump failure (approximately 10% of cases), replacement is the only solution. This is a moderate to advanced repair requiring removal of the oil pan and possibly the front timing cover depending on the engine design. Document the condition of the failed pump - worn gears, broken drive, or failed pressure relief - to understand why it failed. When installing the new pump, prime it with oil to ensure immediate pressure on startup. Consider replacing the oil pickup tube assembly at the same time, as these can develop cracks from vibration. After installation, pre-oil the engine by cranking with the fuel solenoid disabled until the oil pressure gauge shows pressure, before allowing the engine to start and run.

For worn engine bearings (approximately 8% of cases), this represents a major repair requiring engine overhaul or replacement. If bearing wear is confirmed through oil analysis (high copper, lead, or aluminum content), noise evaluation, or physical inspection after disassembly, the engine will need to be removed and disassembled. Depending on the extent of wear and damage to journals, the repair may involve bearing replacement only (if journals are undamaged), crankshaft grinding and undersize bearings (if journals are scored but salvageable), or crankshaft replacement (if journals are severely damaged). This repair typically costs KES 200,000-800,000 for parts and labor, making it important to consider the overall condition and value of the generator when deciding between overhaul and replacement.

Oil pressure relief valve problems (approximately 2% of cases) are usually repairable without major disassembly. Remove the relief valve (location varies by engine), disassemble and clean all components, inspect the plunger and bore for wear or scoring, check spring tension against specifications, and reassemble with new O-rings or seals as needed. If the valve body is worn or damaged, a replacement assembly is typically available. Proper relief valve operation is critical for both pressure maintenance and protection against over-pressure damage to oil coolers and filters.`,

    possibleCauses: [
      { cause: 'Insufficient engine oil level', likelihood: 'high', testMethod: 'Check dipstick with engine off and level - should be between MIN and MAX marks' },
      { cause: 'Faulty oil pressure sender or transducer', likelihood: 'high', testMethod: 'Compare controller reading with mechanical gauge installed in sender port' },
      { cause: 'Wiring fault between sender and controller', likelihood: 'medium', testMethod: 'Inspect wiring for damage, check continuity and resistance values' },
      { cause: 'Degraded, contaminated, or incorrect oil grade', likelihood: 'medium', testMethod: 'Check oil condition, viscosity, smell for fuel, appearance for coolant' },
      { cause: 'Severely clogged oil filter', likelihood: 'medium', testMethod: 'Replace filter and note pressure change; cut open old filter to inspect' },
      { cause: 'Failed or worn oil pump', likelihood: 'low', testMethod: 'Mechanical gauge test, direct pump inspection after removal' },
      { cause: 'Worn crankshaft or connecting rod bearings', likelihood: 'low', testMethod: 'Listen for knocking, perform oil analysis for metals, inspect bearings' },
      { cause: 'Stuck-open oil pressure relief valve', likelihood: 'low', testMethod: 'Remove and inspect relief valve plunger and spring' },
      { cause: 'Cracked oil pickup tube or blocked strainer', likelihood: 'low', testMethod: 'Inspect pickup assembly after oil pan removal' },
      { cause: 'Internal oil leaks (failed gallery plugs, cracked block)', likelihood: 'low', testMethod: 'Pressure test oil system, disassemble and inspect' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Check engine oil level using dipstick with engine stopped and on level surface',
        tools: ['Clean rag or paper towel', 'Flashlight'],
        expectedResult: 'Oil level visible between MIN and MAX marks on dipstick',
        ifFailed: 'Add correct grade oil to bring level to MAX mark; investigate cause of oil loss',
      },
      {
        step: 2,
        action: 'Install mechanical oil pressure gauge in place of electrical sender',
        tools: ['Mechanical oil pressure gauge (0-100 PSI)', 'Appropriate fittings', 'Thread sealant', 'Wrenches'],
        expectedResult: 'At idle: 25-40 PSI (1.7-2.8 bar). At rated speed under load: 40-65 PSI (2.8-4.5 bar)',
        ifFailed: 'If mechanical gauge confirms low pressure, problem is mechanical. If gauge shows normal but controller reads low, problem is electrical sender/wiring.',
      },
      {
        step: 3,
        action: 'If electrical fault suspected, check oil pressure sender resistance',
        tools: ['Digital multimeter', 'Manufacturer resistance specification chart'],
        expectedResult: 'Resistance varies smoothly with pressure changes per manufacturer spec (typically 10-180 ohms)',
        ifFailed: 'Replace oil pressure sender with OEM part; verify correct part number for controller',
      },
      {
        step: 4,
        action: 'Inspect wiring harness from oil pressure sender to controller',
        tools: ['Multimeter', 'Wiring diagram', 'Inspection light'],
        expectedResult: 'Good continuity from controller terminal to sender; no shorts to ground; no damaged insulation',
        ifFailed: 'Repair or replace damaged wiring sections; ensure proper weatherproof connections',
      },
      {
        step: 5,
        action: 'Check engine oil condition and filter status',
        tools: ['Oil sample container', 'White paper towel for oil inspection', 'New filter for comparison'],
        expectedResult: 'Oil should be appropriate viscosity, clean appearance, no fuel smell, no milky coloration',
        ifFailed: 'Perform complete oil and filter change; investigate source of contamination if present',
      },
      {
        step: 6,
        action: 'Inspect oil pressure relief valve operation',
        tools: ['Socket set for relief valve removal', 'Clean container', 'Inspection light', 'Spring tension gauge'],
        expectedResult: 'Plunger moves freely, spring provides appropriate tension, no debris or scoring',
        ifFailed: 'Clean and reassemble relief valve, or replace if worn; verify correct spring tension',
      },
      {
        step: 7,
        action: 'Listen for bearing noise indicating mechanical wear',
        tools: ['Mechanic stethoscope or long screwdriver', 'Ear protection'],
        expectedResult: 'Smooth engine operation with no knocking, rumbling, or grinding sounds',
        ifFailed: 'Bearing noise indicates need for engine overhaul; do not run engine further',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Verify root cause has been positively identified and corrected; confirm actual oil pressure is normal using mechanical gauge',
        warning: 'CRITICAL: Do NOT proceed if actual oil pressure is still low - catastrophic engine damage will occur',
      },
      {
        step: 2,
        instruction: 'Ensure engine is completely stopped and fuel system is de-energized',
      },
      {
        step: 3,
        instruction: 'Document diagnosis and repairs in generator maintenance log',
      },
      {
        step: 4,
        instruction: 'Press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 5,
        instruction: 'Press RESET or ALARM MUTE button to clear shutdown alarm',
        keySequence: ['RESET'],
      },
      {
        step: 6,
        instruction: 'Verify alarm has cleared from display and alarm LED is extinguished',
      },
      {
        step: 7,
        instruction: 'Start engine and observe oil pressure - should build within 5-10 seconds of cranking',
        warning: 'If pressure does not build quickly or alarm returns, stop immediately and re-diagnose',
      },
      {
        step: 8,
        instruction: 'Monitor engine operation for at least 15-30 minutes before returning to automatic mode',
      },
    ],

    repairSolutions: [
      {
        solution: 'Add Engine Oil to Correct Level',
        difficulty: 'easy',
        timeEstimate: '5-15 minutes',
        partsNeeded: ['Engine oil (correct grade per manufacturer specification)', 'Funnel'],
        toolsRequired: ['Clean rag', 'Dipstick', 'Oil container'],
        procedureSteps: [
          'Allow engine to sit for 5 minutes to let oil drain back to sump',
          'Remove oil filler cap from valve cover',
          'Insert funnel into filler opening',
          'Add oil in 500ml increments',
          'Wait 1-2 minutes after each addition for oil to drain to sump',
          'Check dipstick after each addition',
          'Stop adding when level reaches MAX mark (do not overfill)',
          'Replace and secure filler cap',
          'Start engine and verify oil pressure builds normally',
          'Recheck level after 5 minutes of operation and adjust if needed',
        ],
        costEstimate: { min: 800, max: 3000, currency: 'KES' },
      },
      {
        solution: 'Replace Oil Pressure Sender',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['OEM oil pressure sender (verify correct part number for controller)', 'Thread sealant (Loctite 567 or equivalent)'],
        toolsRequired: ['Appropriate wrench (typically 22-27mm deep socket)', 'Wire brush', 'Multimeter', 'Shop towels'],
        procedureSteps: [
          'Locate oil pressure sender on engine block (usually near oil filter on diesel engines)',
          'Disconnect electrical connector from sender',
          'Place drain cloth under sender to catch oil',
          'Use deep socket wrench to unscrew sender (expect 50-100ml oil spillage)',
          'Clean threads in engine block with wire brush',
          'Apply thread sealant to new sender threads (2-3 wraps)',
          'Install new sender hand-tight, then torque to specification (typically 25-30 Nm)',
          'Reconnect electrical connector and ensure it clicks securely',
          'Start engine and verify pressure reading is normal',
          'Check for oil leaks around sender base',
        ],
        costEstimate: { min: 3000, max: 12000, currency: 'KES' },
      },
      {
        solution: 'Complete Oil and Filter Change',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Engine oil (correct quantity and grade)', 'Oil filter (OEM recommended)', 'Drain plug washer', 'Oil sample container (optional)'],
        toolsRequired: ['Drain pan (capacity sufficient for engine oil volume)', 'Socket set', 'Filter wrench', 'Funnel', 'Torque wrench', 'Shop towels'],
        procedureSteps: [
          'Warm engine to operating temperature for 5 minutes, then shut off',
          'Position drain pan under oil sump drain plug',
          'Remove drain plug and allow oil to drain completely (minimum 10-15 minutes)',
          'Capture oil sample for analysis if contamination suspected',
          'Remove old oil filter using filter wrench - additional oil will drain',
          'Clean filter mounting surface on engine',
          'Apply thin film of new oil to new filter gasket',
          'Install new filter hand-tight plus 3/4 turn (or per filter instructions)',
          'Install drain plug with new washer, torque to specification',
          'Fill crankcase with new oil (slightly less than full capacity)',
          'Start engine and run for 1 minute, then shut off',
          'Check for leaks at drain plug and filter',
          'Wait 5 minutes, then check and adjust oil level to MAX mark',
          'Record oil change date, type, and quantity in maintenance log',
        ],
        costEstimate: { min: 5000, max: 25000, currency: 'KES' },
      },
      {
        solution: 'Oil Pump Replacement',
        difficulty: 'advanced',
        timeEstimate: '4-8 hours',
        partsNeeded: ['Oil pump assembly (OEM)', 'Oil pan gasket', 'Pickup tube O-ring or gasket', 'Fresh engine oil', 'RTV sealant (if required)'],
        toolsRequired: ['Complete socket and wrench set', 'Torque wrench', 'Engine support or crane', 'Gasket scraper', 'Parts cleaner', 'Assembly lubricant'],
        procedureSteps: [
          'Drain engine oil completely',
          'Disconnect battery negative terminal',
          'Remove components blocking oil pan access (may include exhaust, crossmember)',
          'Support engine if required for pan removal',
          'Remove oil pan bolts in reverse of tightening sequence',
          'Carefully lower oil pan, noting gasket condition',
          'Remove oil pickup tube and screen assembly',
          'Remove oil pump mounting bolts (location varies by engine)',
          'Remove old oil pump and inspect driven components',
          'Clean all mating surfaces thoroughly',
          'Pack new pump with petroleum jelly or assembly lube to ensure prime',
          'Install new pump with new gaskets, torque bolts to specification',
          'Install pickup tube with new seal, ensure secure connection',
          'Install oil pan with new gasket, torque in proper sequence',
          'Reinstall all removed components',
          'Fill with new oil, prime by cranking without fuel until pressure shows',
          'Start engine and verify immediate oil pressure',
          'Check for leaks and proper operation',
        ],
        costEstimate: { min: 35000, max: 120000, currency: 'KES' },
      },
      {
        solution: 'Engine Bearing Replacement (Major Overhaul)',
        difficulty: 'expert',
        timeEstimate: '20-40 hours',
        partsNeeded: ['Main bearing set', 'Rod bearing set', 'Thrust washers', 'Gasket set', 'All fluids', 'Possible crankshaft grinding or replacement'],
        toolsRequired: ['Engine hoist', 'Engine stand', 'Complete tool set', 'Torque wrenches', 'Plastigage', 'Micrometers', 'Dial indicators'],
        procedureSteps: [
          'Remove engine from generator set',
          'Mount engine on stand and disassemble completely',
          'Inspect crankshaft journals for wear and damage',
          'Measure all journal diameters and compare to specifications',
          'If journals are worn beyond limit, grind to next undersize',
          'Clean all oil passages thoroughly with brush and solvent',
          'Install new main bearings with correct clearance',
          'Install crankshaft with new thrust washers',
          'Check crankshaft end play with dial indicator',
          'Install pistons and connecting rods with new rod bearings',
          'Check all bearing clearances with Plastigage',
          'Reassemble engine with new gaskets throughout',
          'Prime oil system before starting',
          'Break in engine per manufacturer recommendations',
        ],
        costEstimate: { min: 250000, max: 800000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'NEVER operate engine with actual low oil pressure - catastrophic bearing damage will occur within 30-120 seconds',
      'Hot engine oil can cause severe burns - allow engine to cool before checking oil level or removing sender',
      'Used motor oil contains carcinogens - always wear nitrile gloves and avoid skin contact',
      'Properly dispose of used oil at authorized collection facility - environmental regulations apply',
      'Ensure engine cannot start accidentally while working on oil system - disconnect battery or disable fuel',
      'When working under vehicle or generator, use proper jack stands - never rely on jack alone',
      'Oil on floors creates slip hazard - clean spills immediately and use absorbent materials',
      'Wear safety glasses when working with oil under pressure',
    ],

    preventionTips: [
      'Check oil level at every daily inspection or before each use',
      'Change oil and filter at manufacturer-recommended intervals (typically 250-500 hours)',
      'Use only manufacturer-specified oil grade and quality (API CJ-4 or CK-4 for modern diesels)',
      'Address any oil leaks promptly before they cause level loss',
      'Monitor oil pressure readings during routine checks - trending downward indicates developing problems',
      'Send oil samples for analysis annually to detect wear before failure',
      'Keep oil storage containers sealed and away from contamination',
      'Install oil pressure gauge as permanent dashboard monitoring device',
      'Keep spare oil pressure sender and oil filter on site for quick replacement',
      'Document all oil-related maintenance in generator log',
    ],

    relatedCodes: ['190-1', '190-2', '190-8', '100-3', '100-4', '100-0', '101-0'],
    technicalNotes: 'Oil pressure requirements vary by engine manufacturer, model, and operating conditions. Cold start pressure will be higher than hot idle pressure due to oil viscosity changes. Typical specifications: idle (25-40 PSI), rated speed (40-65 PSI). Some engines have additional sender for warning level vs shutdown level. Always consult engine manufacturer specifications for your specific model. J1939 engines may report oil pressure via CAN bus with different SPN codes.',
  },

  // ==================== HIGH COOLANT TEMPERATURE (110-0) ====================
  '110-0': {
    code: '110-0',
    title: 'High Coolant Temperature',
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Cooling System',

    overview: `Error code 110-0 is triggered when the engine coolant temperature exceeds the maximum safe operating limit programmed in the controller, typically set between 95-105°C (203-221°F) depending on the engine and application. This protection exists to prevent severe thermal damage to the engine, including warped cylinder heads, blown head gaskets, seized pistons, damaged valve guides, and cracked engine blocks. When coolant temperature rises beyond safe limits, the aluminum or cast iron components of the engine expand beyond their design tolerances, causing mechanical interference and potential permanent damage. Additionally, excessively high temperatures cause the lubricating oil to lose its viscosity and protective properties, compounding the damage potential.

The cooling system in a diesel generator operates as a closed-loop heat rejection system designed to maintain engine temperature within a narrow optimal operating band. The water pump, typically gear-driven or belt-driven from the engine, circulates coolant through passages cast into the engine block and cylinder head, absorbing combustion heat that would otherwise destroy engine components. This heated coolant then flows through the upper radiator hose to the radiator, where it passes through thin tubes surrounded by cooling fins. Air flowing across these fins - either from a mechanically-driven fan, electric fan, or forced air in remote radiator installations - removes the heat and returns cooled fluid to the engine through the lower radiator hose. A thermostat regulates this flow to maintain optimal operating temperature, remaining mostly closed during warm-up and opening progressively as temperature rises.

The consequences of overheating extend far beyond immediate shutdown. Even a single severe overheat event can cause permanent damage that may not become apparent until later. Cylinder heads can warp imperceptibly, leading to ongoing coolant leaks and head gasket problems. Piston rings can lose their temper and sealing ability. Valve stems can gall in their guides. Coolant can be forced into the combustion chambers or oil galleries, causing additional problems. This is why the controller's protective shutdown is so important - it stops the engine before temperatures reach truly catastrophic levels, giving the technician an opportunity to diagnose and repair before permanent damage occurs.

Modern generator controllers monitor coolant temperature via a sender screwed into the engine water jacket or thermostat housing. When this reading exceeds the programmed limit, the controller immediately shuts down the engine, energizes warning outputs, and logs the event for post-incident analysis. Unlike some other alarms, high temperature conditions rarely resolve themselves and require physical intervention to correct. The exception is momentary excursions during sudden load rejection or extreme ambient conditions, but even these indicate marginal cooling system capacity that should be addressed.

Understanding the operating environment is critical for proper diagnosis. Generators in hot climates (ambient temperatures above 40°C/104°F) operate closer to their thermal limits and have less margin for cooling system degradation. Generators at high altitude have reduced air density for radiator cooling. Generators in dusty or sandy environments are prone to radiator blockage. Generators running continuously at high load generate more heat than intermittently-loaded standby units. All of these factors affect the likelihood and severity of overheating events, and should be considered when diagnosing recurring problems.`,

    diagnosticProcedure: `Start your diagnosis by allowing the engine to cool completely - working on a hot cooling system is dangerous and can cause severe burns. Wait at least 30-60 minutes after shutdown, or until the engine block is cool enough to touch comfortably. Verify the actual coolant temperature using an infrared thermometer or contact pyrometer on the engine block and radiator hoses. Compare this with the controller's reading. Normal operating temperature for most diesel generators is 82-95°C (180-203°F). If the controller shows high temperature but the engine feels normal to the touch and infrared readings are normal, suspect a faulty temperature sender or wiring issue rather than an actual overheating condition.

If actual overheating is confirmed through independent measurement, begin systematically working through the cooling system from the most common causes to the least. First, with the engine cool, carefully remove the radiator cap by turning it slowly and allowing any residual pressure to vent. Check the coolant level - it should be at the FULL mark on the expansion tank when cold, and the radiator itself should be full to the filler neck. Low coolant is the most common overheating cause and can result from external leaks (visible drips or stains), internal leaks (head gasket to combustion chambers or oil galleries), or evaporation from a missing, damaged, or incorrect pressure cap. A properly functioning pressure cap typically maintains 13-16 PSI (0.9-1.1 bar) system pressure, which raises the boiling point and prevents coolant loss.

Inspect the radiator core thoroughly for external blockage. Dirt, insects, leaves, oily deposits, and other debris on the cooling fins dramatically reduces heat transfer capability. The radiator can be cleaned with compressed air (blow from the engine side outward through the core), low-pressure water spray (take care not to bend fins), or commercial radiator cleaning solutions for oily deposits. Bent or damaged fins can be carefully straightened using a fin comb tool. If blockage is severe or recurring, consider adding a coarse screen upstream of the radiator in dusty environments. Also inspect the radiator for internal blockage by feeling temperature differences across the core - cold spots indicate blocked tubes that require professional cleaning or core replacement.

Check that the cooling fan is operating correctly. For belt-driven fans, verify the belt is present, correctly tensioned (typically 10-15mm deflection under moderate pressure), and shows no signs of cracking, glazing, or wear. For fans with viscous clutches, the fan should spin freely when cold but should lock up and spin with the engine when hot - a failed clutch (constant free-spinning or seized) will cause overheating. For electric fans, verify they energize when temperature rises above the activation setpoint. Check fan blade condition - broken, cracked, or bent blades reduce airflow significantly. Ensure the fan shroud is intact and properly positioned - the shroud focuses airflow through the radiator and missing or misaligned shrouds can reduce cooling capacity by 20-30%.

Test the thermostat by removing it from the engine and observing its operation in a container of heated water. The thermostat should begin opening at its rated temperature (typically 82°C/180°F for most diesel engines) and should be fully open approximately 10-15°C higher. A stuck-closed thermostat will cause rapid overheating because coolant cannot reach the radiator. A stuck-open thermostat will cause slow warm-up and poor fuel economy but typically won't cause overheating unless the opening is partial. If the thermostat fails the hot water test, replace it - thermostats are inexpensive insurance against overheating.

Inspect the water pump for proper operation and condition. Check for coolant weeping from the pump weep hole - this indicates the pump seal is failing and the pump should be replaced before complete failure. Feel for roughness or play in the pump bearing by grasping the fan and attempting to rock the shaft. On belt-driven pumps, verify the belt is not slipping. Check that pump impeller blades are intact - failed pumps sometimes have broken or corroded impellers that reduce flow dramatically. If internal flow is suspected to be low, use an infrared thermometer to compare temperatures at the thermostat housing and the lower radiator hose - if the lower hose is nearly as hot as the upper, coolant is not circulating properly.

Finally, if all external components check out, consider internal engine problems. A blown head gasket can allow combustion gases to pressurize the cooling system, forcing coolant out and causing overheating. Symptoms include bubbles in the coolant expansion tank, milky oil, white exhaust smoke, and pressure in the cooling system immediately after starting. A combustion leak tester (chemical test kit) can confirm head gasket failure. Blocked internal coolant passages can also cause overheating - this may require professional evaluation with pressure testing and possibly borescope inspection.`,

    resetInstructions: `Before attempting to reset this alarm, several conditions must be met to ensure safe and successful restart. The engine MUST be allowed to cool completely - attempting to add cold water or coolant to a hot engine can cause thermal shock that cracks the block or head. Allow the engine to cool naturally for at least 30-60 minutes, or longer in hot ambient conditions. Use an infrared thermometer to verify the coolant temperature has dropped below 50°C (122°F) before proceeding with any repairs or topping up coolant. Never remove a radiator cap from a hot pressurized system - the sudden pressure release can cause boiling coolant to spray out and cause severe burns.

Once the engine is cool and the underlying cause has been identified and corrected, you can proceed with the reset. Before resetting, verify that the repair was successful - refill the coolant system completely, check that all components are properly installed, and ensure there are no remaining leaks. Document the cause and repair in the generator maintenance log, including parts replaced, coolant added, and any observations about system condition. This documentation is essential for tracking recurring problems and maintaining warranty coverage.

For DSE controllers (4xxx, 5xxx, 7xxx, 8xxx series): With the engine stopped and cool, press and hold the STOP button for approximately 3 seconds. Then press the RESET or ALARM MUTE button. The shutdown LED should extinguish and the display should return to ready status. Some DSE models require navigating to the alarm screen and pressing a soft key to reset lockout-class alarms. If the alarm immediately returns after reset, the controller may still be seeing elevated temperature - verify that the coolant has actually cooled and that the temperature sender is functioning correctly.

For ComAp controllers (InteliLite, InteliGen, InteliSys): Navigate to ALARM HISTORY using the front panel controls. Select the active High Coolant Temperature alarm. Press the RESET soft key or button. The controller will verify that the fault condition is no longer present before allowing the reset. If using InteliMonitor or WebSupervisor software, the reset can also be performed through the software interface with appropriate access credentials.

For Woodward controllers (EasyGen series): Access the SERVICE menu by pressing the SERVICE button. Navigate to ACTIVE FAULTS using the navigation buttons. Select the High Coolant Temperature fault and choose CLEAR or RESET. Enter any required access code if prompted. The controller will log the reset event with timestamp and operator identification if configured.

For SmartGen controllers (HGM series): Press the RESET button on the front panel while the engine is stopped. The HGM series will typically prevent reset if the temperature reading is still above the warning threshold, providing an additional safety check. If reset is unsuccessful, navigate to ALARM HISTORY via the menu and clear the alarm record manually.

After successfully resetting the alarm, prepare to carefully monitor the engine during the restart and warm-up period. Before starting, visually verify that the cooling system is full, all components are properly installed, and there are no obvious leaks. Start the engine and observe the temperature gauge closely. The engine should warm up gradually over 5-10 minutes to normal operating temperature (82-95°C) and then stabilize. Watch for any signs of rapid temperature rise, coolant leaks, or abnormal operation. If temperature continues climbing toward the alarm point, shut down immediately and continue diagnosis - the root cause has not been adequately addressed. Run the engine under observation for at least 30 minutes at various load levels before returning to unattended automatic operation.`,

    solutionGuide: `Solving overheating issues requires matching the repair to the diagnosed cause. The repair difficulty ranges from simple tasks like adding coolant to major work like head gasket replacement. Always start with the simplest and most common causes before assuming the worst - in most cases, overheating results from maintenance neglect or minor component failure rather than catastrophic engine damage.

For low coolant level (accounting for approximately 35-40% of overheating incidents), the immediate solution is to refill the cooling system with the correct coolant mixture. Use pre-mixed coolant or mix concentrate 50/50 with distilled water - tap water contains minerals that cause scaling and corrosion. After refilling, identify and fix the source of coolant loss to prevent recurrence. Check all hoses and connections for leaks or weeping. Inspect the radiator for cracks, especially at the tanks-to-core joints on plastic-tank radiators. Examine the water pump weep hole for active dripping indicating seal failure. Check freeze plugs for corrosion or seepage. Look for coolant in the oil (milky appearance) or oil in the coolant indicating head gasket or oil cooler failure. A pressure test of the cooling system can identify leaks too small to see visually.

For external radiator blockage (approximately 20% of cases), thorough cleaning is usually sufficient. Remove the radiator shroud if necessary to access both sides of the core. Use compressed air at moderate pressure (not high-pressure air that can bend fins) to blow debris from the core, working from the engine side outward. For oily deposits or stubborn contamination, apply commercial radiator cleaner or degreaser, let soak per product instructions, then rinse with low-pressure water. Straighten any bent fins using a fin comb - damaged fins significantly reduce heat transfer. In extremely dusty environments, consider installing a sacrificial pre-screen that can be cleaned more easily than the radiator core itself. For recurring blockage, evaluate whether the radiator has adequate airflow space or if equipment layout is causing recirculation of hot air.

For fan and fan drive problems (approximately 15% of cases), the solution depends on the specific failure. Replace worn, cracked, or glazed fan belts with the correct size and type, adjusting tension per manufacturer specification. Failed viscous fan clutches must be replaced as a unit - there is no practical field repair. Test by spinning the fan when cold (should spin freely with moderate resistance) and when hot after running (should be nearly locked to the engine). Electric fan failures may be motor burnout, controller/relay failure, or temperature sensor issues - diagnose systematically. Replace damaged fan blades with OEM parts - aftermarket fans may not match the airflow characteristics required. Ensure the fan shroud is present, undamaged, and correctly positioned to optimize airflow through the radiator.

For thermostat failure (approximately 10% of cases), replacement is straightforward and inexpensive. Always replace with an OEM-quality thermostat rated for your specific engine - cheap thermostats often fail quickly or open at incorrect temperatures. When replacing, also replace the thermostat housing gasket or O-ring to prevent leaks. After installation, ensure the thermostat is properly oriented (many have a specific "up" direction for the jiggle pin to vent air). Bleed any trapped air from the cooling system after refilling - trapped air pockets cause hot spots and can prevent proper circulation. Consider keeping a spare thermostat on site for quick replacement if this is a critical application.

For water pump failure (approximately 10% of cases), replacement is required. Water pumps typically fail either through seal failure (gradual coolant leak from weep hole) or bearing failure (noise, wobble, sudden complete failure). When replacing, inspect the pump cavity in the block for contamination or damage. Install a new pump with a new gasket, ensuring correct torque on mounting bolts. On timing-gear-driven pumps, this repair may be significantly more involved. Prime the system and verify circulation before returning to service. Some technicians also replace the thermostat during water pump replacement as preventive maintenance.

For head gasket failure (approximately 5% of cases), this is a major repair requiring engine disassembly. Symptoms include persistent overheating despite normal component function, bubbles in coolant, milky oil, white exhaust smoke, and rapid pressure buildup in the cooling system. Confirm with a combustion leak test before committing to repair. The repair involves removing the cylinder head, machining the head surface flat if warped, installing a new head gasket, and properly torquing the head in the correct sequence. This repair typically costs KES 50,000-200,000 depending on engine complexity and whether the head requires additional work. In some cases, particularly with high-hour engines, replacing the generator engine may be more economical than head gasket repair.`,

    possibleCauses: [
      { cause: 'Low coolant level due to leak or evaporation', likelihood: 'high', testMethod: 'Check expansion tank and radiator level when cold; pressure test system' },
      { cause: 'Faulty coolant temperature sender giving false high reading', likelihood: 'medium', testMethod: 'Compare controller reading with infrared thermometer measurement' },
      { cause: 'Radiator externally blocked with debris', likelihood: 'medium', testMethod: 'Visual inspection of radiator fins for dirt, insects, or debris buildup' },
      { cause: 'Fan belt slipping, broken, or missing', likelihood: 'medium', testMethod: 'Inspect belt condition, presence, and proper tension' },
      { cause: 'Thermostat failed in closed position', likelihood: 'medium', testMethod: 'Remove thermostat and test opening in heated water' },
      { cause: 'Cooling fan not operating (electric) or clutch failed (viscous)', likelihood: 'medium', testMethod: 'Verify fan engages when engine is hot; check electric fan operation' },
      { cause: 'Water pump failure (impeller damage or bearing failure)', likelihood: 'low', testMethod: 'Check weep hole for leaks, feel for bearing play, verify circulation' },
      { cause: 'Radiator internally blocked or corroded', likelihood: 'low', testMethod: 'Feel for temperature differential across radiator; flow test' },
      { cause: 'Head gasket failure allowing combustion gas entry', likelihood: 'low', testMethod: 'Combustion leak test, check for bubbles in coolant, oil condition' },
      { cause: 'Incorrect coolant mixture or degraded coolant', likelihood: 'low', testMethod: 'Test coolant concentration and condition with refractometer/test strips' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Allow engine to cool completely - wait minimum 30-60 minutes',
        tools: ['Patience', 'Infrared thermometer to verify temperature'],
        expectedResult: 'Engine cool enough to safely work on (block below 50°C)',
        ifFailed: 'Continue waiting - never work on hot pressurized cooling system',
      },
      {
        step: 2,
        action: 'Carefully remove radiator cap and check coolant level in radiator and expansion tank',
        tools: ['Flashlight', 'Coolant recovery pan'],
        expectedResult: 'Coolant at proper level in both radiator and expansion tank',
        ifFailed: 'Top up coolant system; investigate source of coolant loss',
      },
      {
        step: 3,
        action: 'Inspect radiator core for external blockage from both sides',
        tools: ['Flashlight', 'Compressed air', 'Water hose'],
        expectedResult: 'Clear airflow path through radiator core with no debris or bent fins',
        ifFailed: 'Clean radiator thoroughly; straighten bent fins; repair or replace damaged core',
      },
      {
        step: 4,
        action: 'Check fan operation and fan drive belt condition and tension',
        tools: ['Belt tension gauge', 'Inspection light'],
        expectedResult: 'Fan spins freely, belt is tight and undamaged, viscous clutch locks when hot',
        ifFailed: 'Replace belt or adjust tension; replace failed fan clutch or motor',
      },
      {
        step: 5,
        action: 'Remove and test thermostat operation in heated water',
        tools: ['Container for water', 'Heat source', 'Thermometer', 'Tongs'],
        expectedResult: 'Thermostat begins opening at rated temperature, fully open 10-15°C higher',
        ifFailed: 'Replace thermostat with OEM-quality part; also replace gasket/O-ring',
      },
      {
        step: 6,
        action: 'Check water pump for leaks, bearing play, and circulation',
        tools: ['Flashlight', 'Infrared thermometer to check hose temperatures'],
        expectedResult: 'No leaks from weep hole, no shaft play, upper and lower hose temps indicate flow',
        ifFailed: 'Replace water pump assembly; inspect pump cavity for contamination',
      },
      {
        step: 7,
        action: 'Perform combustion leak test to check for head gasket failure',
        tools: ['Combustion leak test kit (chemical tester)', 'Safety glasses'],
        expectedResult: 'No color change in test fluid indicating absence of combustion gases in coolant',
        ifFailed: 'Head gasket failure confirmed; plan for head removal and gasket replacement',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Verify engine has cooled completely - coolant temperature below 50°C',
        warning: 'Never add cold coolant to hot engine or remove cap from hot pressurized system',
      },
      {
        step: 2,
        instruction: 'Confirm root cause has been identified and corrected',
      },
      {
        step: 3,
        instruction: 'Refill cooling system completely and verify no remaining leaks',
      },
      {
        step: 4,
        instruction: 'Press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 5,
        instruction: 'Press RESET or ALARM MUTE button to clear shutdown alarm',
        keySequence: ['RESET'],
      },
      {
        step: 6,
        instruction: 'Start engine and carefully monitor temperature during warm-up',
        warning: 'Temperature should rise gradually to 82-95°C and stabilize; if rising toward limit, shut down',
      },
      {
        step: 7,
        instruction: 'Run engine under observation for minimum 30 minutes at various loads before returning to automatic',
      },
    ],

    repairSolutions: [
      {
        solution: 'Refill Cooling System',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['Coolant (50/50 premix or concentrate plus distilled water)', 'Radiator cap if questionable condition'],
        toolsRequired: ['Funnel', 'Coolant drain pan', 'Flashlight'],
        procedureSteps: [
          'Ensure engine is completely cool (below 50°C)',
          'Carefully remove radiator cap - turn slowly to release any pressure',
          'If draining system, open drain petcock on radiator and engine block',
          'Fill radiator through filler neck until coolant reaches top',
          'Fill expansion tank to COLD/MIN mark',
          'Replace radiator cap - ensure it seats properly',
          'Start engine with radiator cap loose to allow air to bleed',
          'Run until thermostat opens (upper hose becomes hot)',
          'Top up as needed and secure cap',
          'Recheck level after engine cools',
        ],
        costEstimate: { min: 1000, max: 5000, currency: 'KES' },
      },
      {
        solution: 'Clean Radiator Core',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Radiator cleaner spray (if heavily soiled)', 'Water for rinsing'],
        toolsRequired: ['Compressed air (moderate pressure)', 'Water hose', 'Fin comb', 'Flashlight', 'Brushes'],
        procedureSteps: [
          'Allow engine to cool completely',
          'Remove fan shroud if necessary for access',
          'Inspect both sides of radiator core for debris',
          'Use compressed air from engine side blowing outward to remove debris',
          'For stubborn deposits, apply radiator cleaner and let soak',
          'Rinse with low-pressure water - avoid high pressure that bends fins',
          'Use fin comb to straighten any bent fins',
          'Check for damaged or leaking core sections',
          'Reinstall shroud, ensuring proper positioning',
          'Test run engine to verify temperature stays normal',
        ],
        costEstimate: { min: 500, max: 3000, currency: 'KES' },
      },
      {
        solution: 'Replace Thermostat',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Thermostat (OEM specification)', 'Thermostat housing gasket or O-ring', 'Coolant for topping up'],
        toolsRequired: ['Socket set', 'Scraper for old gasket', 'Coolant drain pan', 'Funnel'],
        procedureSteps: [
          'Allow engine to cool completely',
          'Drain coolant below thermostat level (or drain system completely)',
          'Remove thermostat housing bolts',
          'Remove housing and old thermostat - note orientation',
          'Clean gasket surfaces thoroughly',
          'Test new thermostat in hot water to verify operation',
          'Install new thermostat with correct orientation',
          'Install new gasket/O-ring and housing',
          'Torque housing bolts to specification',
          'Refill cooling system and bleed air',
          'Test run and verify normal temperature operation',
        ],
        costEstimate: { min: 2000, max: 8000, currency: 'KES' },
      },
      {
        solution: 'Replace Water Pump',
        difficulty: 'moderate',
        timeEstimate: '2-4 hours',
        partsNeeded: ['Water pump assembly (OEM)', 'Water pump gasket', 'Coolant', 'Possibly new belt'],
        toolsRequired: ['Socket and wrench set', 'Coolant drain pan', 'Gasket scraper', 'Torque wrench', 'Belt tension gauge'],
        procedureSteps: [
          'Drain cooling system completely',
          'Remove fan and fan shroud for access',
          'Remove drive belt(s)',
          'Remove water pump mounting bolts',
          'Remove old pump - inspect mounting surface',
          'Clean all gasket mating surfaces',
          'Apply thin bead of RTV if specified',
          'Install new pump with new gasket',
          'Torque bolts in sequence to specification',
          'Reinstall belts, fan, and shroud',
          'Refill cooling system and bleed air',
          'Run engine and check for leaks',
        ],
        costEstimate: { min: 15000, max: 50000, currency: 'KES' },
      },
      {
        solution: 'Head Gasket Replacement',
        difficulty: 'expert',
        timeEstimate: '8-16 hours',
        partsNeeded: ['Head gasket set', 'Head bolts (if TTY type)', 'Coolant', 'Engine oil', 'Various seals'],
        toolsRequired: ['Torque wrench', 'Complete socket set', 'Cylinder head stand', 'Straight edge', 'Feeler gauges', 'Possibly head surfacing'],
        procedureSteps: [
          'Drain coolant and oil',
          'Remove intake and exhaust manifolds',
          'Remove valve cover and rocker assembly',
          'Remove pushrods (keep in order)',
          'Remove cylinder head bolts in reverse of tightening sequence',
          'Lift off cylinder head - use help, it is heavy',
          'Inspect head for cracks and warpage with straight edge',
          'Have head surface machined if warped beyond specification',
          'Clean all surfaces thoroughly',
          'Install new head gasket (observe TOP/FRONT markings)',
          'Install head and new bolts',
          'Torque head bolts in sequence, in stages',
          'Reinstall all components',
          'Fill fluids and carefully break in engine',
        ],
        costEstimate: { min: 50000, max: 200000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'NEVER remove radiator cap from hot pressurized system - severe burns will result from escaping steam and coolant',
      'Allow engine to cool completely before working on cooling system - minimum 30-60 minutes after shutdown',
      'Coolant is toxic - keep away from children and pets; dispose of properly at authorized facility',
      'Wear safety glasses when working with cooling system - coolant can splash into eyes',
      'Support vehicle properly if working underneath - never rely on jack alone',
      'Be aware of rotating fan - keep hands, clothing, and tools clear of fan area',
      'Used coolant is environmentally hazardous - never dispose in drains or on ground',
      'After repair, monitor engine closely during restart - be prepared to shut down if temperature rises abnormally',
    ],

    preventionTips: [
      'Check coolant level weekly and top up as needed with correct mixture',
      'Inspect drive belts monthly for wear, cracks, and proper tension',
      'Clean radiator core monthly or more frequently in dusty environments',
      'Change coolant per manufacturer schedule (typically every 2-3 years or 3000 hours)',
      'Pressure test cooling system annually to identify small leaks before they cause problems',
      'Replace thermostat preventively every 3-5 years',
      'Ensure radiator has adequate clearance for airflow - maintain space around generator',
      'Consider installing auxiliary cooling in hot climate applications',
      'Monitor temperature gauge during operation - trending higher indicates developing problem',
      'Keep spare thermostat, hoses, and coolant on site for quick repairs',
    ],

    relatedCodes: ['110-1', '110-2', '110-8', '175-0', '175-1'],
    technicalNotes: 'Coolant temperature specifications vary by engine - most diesel generators operate optimally at 82-95°C (180-203°F). Operating too cool wastes fuel and causes moisture buildup; operating too hot causes damage. Most controllers have separate warning (typically 100-102°C) and shutdown (typically 105-108°C) thresholds. Coolant mixture should be 50/50 for most climates or higher concentration in extreme cold. Use only manufacturer-approved coolant types - mixing incompatible types causes silicate dropout and system damage.',
  },

  // ==================== OVERSPEED (0190) ====================
  '0190': {
    code: '0190',
    title: 'Engine Overspeed',
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Speed Control',

    overview: `Error code 0190 indicates that the engine speed has exceeded the maximum safe operating limit, triggering an immediate emergency shutdown to prevent catastrophic mechanical failure. Diesel engines in generator applications are designed to operate at precise speeds - typically 1500 RPM for 50Hz systems or 1800 RPM for 60Hz systems - and have mechanical and thermal limits that must not be exceeded. When an engine overspeeds, the centrifugal forces on rotating components increase dramatically, potentially causing connecting rod failure, piston seizure, valve float leading to valve-piston contact, flywheel fracture, and in extreme cases, complete engine disintegration with violent release of fragments.

The physics of overspeed events explains their destructive potential. Centrifugal force increases with the square of rotational speed, meaning that a 20% overspeed results in 44% higher centrifugal loading on rotating components. Connecting rod bearings, designed for normal operating loads, can be overwhelmed by these forces, causing bearing spin or rod failure. Pistons accelerate and decelerate faster at higher speeds, increasing side loading on cylinder walls. Valve springs may not close valves quickly enough (valve float), allowing pistons to strike open valves and causing immediate catastrophic damage. Flywheel and coupling components can fracture under excessive centrifugal stress, releasing high-energy fragments that can penetrate generator enclosures.

Overspeed conditions in diesel generators typically result from one of two scenarios: load rejection events or governor/fuel system failures. Load rejection occurs when electrical load is suddenly removed - for example, when a circuit breaker trips or transfer switch disconnects load. The engine, still receiving fuel for the previous load condition, suddenly has nothing to absorb its power output and accelerates rapidly until the governor can reduce fuel. Well-maintained governors can control load rejection transients, but worn or maladjusted governors may not respond quickly enough to prevent overspeed. Fuel system failures include stuck-open fuel injectors, governor actuator problems, and fuel rack mechanical binding.

Modern generator controllers monitor engine speed continuously using either a magnetic pickup sensor reading flywheel ring gear teeth or a dedicated speed sensor on the camshaft. The controller calculates instantaneous speed from these pulses and compares against programmed thresholds. When overspeed is detected, the controller immediately shuts off fuel (typically by de-energizing a fuel solenoid) and engages any additional shutdown mechanisms such as mechanical overspeed trips. The shutdown must occur rapidly because significant damage can occur within seconds of overspeed onset.

Understanding the severity thresholds helps in diagnosis. Most controllers have a warning level (typically 5-8% above rated speed, e.g., 1575-1620 RPM for a 1500 RPM engine) and a shutdown level (typically 10-15% above rated, e.g., 1650-1725 RPM). Some engines also have mechanical overspeed trips that operate independently of the electronic controller as a backup - these require manual reset after activation. An overspeed event that only triggers the controller's electronic trip suggests a moderate transient, while an event severe enough to trip the mechanical overspeed indicates a more serious control system problem or major load rejection event.`,

    diagnosticProcedure: `Begin diagnosis by reviewing the controller's event log to understand the context of the overspeed event. Note the engine speed recorded at trip, the operating conditions (load level, operating mode), and whether any other alarms occurred simultaneously. A momentary overspeed to 1650 RPM during load rejection is different from a runaway to 2000+ RPM due to fuel system failure. Also note if this is a first occurrence or a recurring problem - recurring overspeed events indicate a systematic issue requiring thorough investigation.

Verify the speed sensing system is functioning correctly before assuming an actual overspeed occurred. Connect an oscilloscope or frequency counter to the speed sensor output and observe the signal during engine running. The signal should be clean, with consistent amplitude and no dropout or noise. Magnetic pickup sensors should produce a sinusoidal signal with peak voltage proportional to speed - typically 1-10V AC at operating speed. Check sensor-to-gear clearance (typically 0.5-1.5mm per manufacturer specification) and adjust if necessary. Inspect the flywheel ring gear for damaged or missing teeth that could cause erratic speed readings. Also check the sensor wiring for damage, loose connections, or electromagnetic interference from nearby cables.

If speed sensing checks out, investigate the governor and fuel control system as the most likely cause of actual overspeed. Start by checking governor operation with the engine running at no load - observe speed stability and response to load changes. Speed should remain within ±0.5% at steady state and recover within 5-10 seconds after load changes. Excessive speed droop, hunting, or slow recovery indicates governor problems. Check governor oil level if equipped with a hydraulic governor. Inspect linkage between governor and fuel injection system for wear, binding, or misadjustment. On electronic governors, check the actuator for proper operation - it should respond smoothly to control signals across its full range.

Examine the fuel injection system for problems that could cause uncontrolled fuel delivery. Check for stuck injectors that continue delivering fuel even when commanded closed - this can be tested by removing injectors and observing spray pattern during cranking. Inspect fuel racks for binding or sticking, ensuring smooth movement through the full range. On unit injector systems, verify actuator linkage for wear or damage. On common rail systems, check rail pressure sensor and pressure relief valve operation. Worn or damaged fuel injection pumps can also cause erratic delivery leading to speed control problems.

Investigate what electrical or mechanical events triggered the overspeed if load rejection is suspected. Check for tripped circuit breakers, disconnected loads, or transfer switch events that would have suddenly removed load from the generator. Examine the generator and its connections for shorts or faults that may have caused protective devices to operate. Review any paralleling equipment operation that might have caused load shifts. Understanding what triggered the event helps determine whether the overspeed protection correctly identified a transient or whether the speed control system failed to manage a normal operational event.

Check the mechanical overspeed trip device if equipped. This is typically a spring-loaded mechanism that trips at a preset speed (usually 10-15% above rated), mechanically shutting off fuel flow. If the mechanical trip activated, it must be manually reset before the engine can restart - usually by pushing a button or lever on the fuel injection pump. A mechanical trip that activates indicates speed exceeded its threshold, which is typically higher than the electronic controller's trip point, suggesting a more severe overspeed event. If the mechanical trip activated without the electronic trip, this suggests the electronic speed sensing failed to detect the overspeed - investigate the speed sensor and controller input.`,

    resetInstructions: `IMPORTANT: Do not reset the overspeed alarm until you have positively identified and corrected the root cause of the overspeed condition. An uncontrolled engine that goes to overspeed can self-destruct within seconds, potentially causing injury to personnel and extensive equipment damage. The overspeed protection exists to prevent such catastrophes, and it should not be bypassed without proper diagnosis and repair of the underlying problem.

Before resetting, complete your diagnosis and ensure the fuel control system is functioning properly. If the overspeed was caused by a load rejection event and the governor response was normal (just slower than the controller's trip threshold), the system may be acceptable for return to service with monitoring. If the overspeed was caused by a fuel system problem or governor malfunction, these must be repaired before restart. If a mechanical overspeed trip activated, it must be manually reset at the engine before any electronic reset will be effective.

To reset the mechanical overspeed trip (if equipped): Locate the reset mechanism on the fuel injection pump - this is typically a plunger button or lever that must be pushed or pulled. The engine must be stopped and the fuel solenoid de-energized before reset will latch. Press the reset mechanism firmly until it clicks into the latched position. If it won't latch, the overspeed may still be active (engine still running from stored fuel) or the mechanism may be damaged and require repair.

For DSE controllers (4xxx, 5xxx, 7xxx, 8xxx series): With the engine stopped and mechanical trip reset (if applicable), press and hold the STOP button for 3 seconds. Then press the RESET button to clear the overspeed alarm. The alarm LED should extinguish. Some DSE models display a fault code that requires specific acknowledgment through the menu system. If the alarm immediately returns, the controller may be detecting abnormal speed reading even at rest - check speed sensor connections.

For ComAp controllers (InteliLite, InteliGen): Navigate to ALARM LIST using front panel buttons. Select the Overspeed alarm and press the CLEAR or RESET soft key. The controller logs all overspeed events for later review. If operating through InteliMonitor software, the reset can be performed remotely after confirming local conditions are safe.

For Woodward controllers (EasyGen series): Press the SERVICE button to access service menu. Navigate to ACTIVE FAULTS. Select the overspeed fault and press CLEAR. Enter access code if required for your site configuration. Note that Woodward controllers may require a cooling-off period before allowing restart after overspeed.

After resetting the alarm, prepare for a careful monitored restart. Before starting, visually verify that all guards are in place and personnel are clear of the engine. Start the engine at no load and observe speed carefully - it should stabilize at rated speed (1500/1800 RPM) within seconds of starting. Apply load gradually while monitoring speed response. If speed oscillations, hunting, or slow recovery are observed, shut down and continue diagnosis of the governor system. Do not return the generator to automatic unattended operation until you are confident the speed control system is functioning correctly.`,

    solutionGuide: `Solving overspeed problems requires identifying whether the root cause was a control system deficiency (failing to manage normal events) or an actual mechanical failure (uncontrolled fuel delivery). The repair approach differs significantly based on this determination, and misdiagnosis can lead to recurring dangerous overspeed events.

For load rejection-induced overspeed (the most common scenario, approximately 50% of cases), the solution involves improving governor response and/or reducing electrical system transients. Start by adjusting governor sensitivity if adjustable - increasing gain improves response speed but can cause instability if set too high. Check governor hydraulic oil (if applicable) for correct level and condition - contaminated or low oil causes sluggish response. Replace worn governor components including bearings, springs, and pilot valves that affect response time. On electronic governors, verify actuator operation and adjust speed droop setting if needed. Consider reducing step load sizes by load shedding programming to give the governor more time to respond. Install load banks for controlled load application if frequent load rejection occurs.

For governor and actuator failures (approximately 25% of cases), replacement or overhaul is typically required. Mechanical governors require specialized rebuilding - consider replacing with a new or factory-rebuilt unit rather than field repair. Electronic governor actuators should be tested for proper stroke and response time; replace if sluggish or erratic. Check all linkage between governor and fuel rack for wear or damage - worn linkage introduces dead band that delays governor response. On CATERPILLAR, Cummins, and other engines with factory electronic controls, ensure fuel system calibration is correct and consider reflashing ECM if problems persist.

For fuel injection system problems (approximately 15% of cases), repair or replacement of the affected components is required. Stuck-open fuel injectors must be replaced - rebuilding is possible but requires specialized knowledge and equipment. Worn fuel rack or control rod components require fuel pump overhaul or replacement. On common rail systems, a stuck-open injector can cause hydrostatic lock as well as overspeed - inspect for bent connecting rods or other damage after such failures. Clean or replace fuel filters if contamination is causing control valve sticking. Verify fuel quality - water or debris in fuel can cause injector and governor valve problems.

For speed sensor and controller input problems (approximately 10% of cases), replace the sensor with an OEM part matched to the controller. Generic sensors may have incorrect output characteristics leading to reading errors. Adjust sensor gap to manufacturer specification - typically 0.5-1.5mm from the ring gear. Replace damaged ring gear teeth if present - a missing tooth causes momentary speed reading drops that can confuse the controller. Check shield and ground connections on sensor cables to reduce electrical noise. If the controller input circuit is suspect, it may require factory repair or controller replacement.

For mechanical overspeed trip problems (if the trip activated or failed to activate appropriately), service or replace the overspeed mechanism. These devices are safety-critical and should be tested annually. Test by bringing engine to rated speed and carefully increasing speed using an external governor adjustor while monitoring for trip - the trip should activate at its rated setting (typically 110-115% of rated speed). If trip occurs too early, too late, or not at all, the mechanism requires adjustment or replacement. Some overspeed devices are field-adjustable while others must be replaced as a unit. Always restore governor to normal adjustment after testing.`,

    possibleCauses: [
      { cause: 'Load rejection event - sudden removal of electrical load', likelihood: 'high', testMethod: 'Review controller log for load conditions before trip; check breakers and transfer switch operation' },
      { cause: 'Governor response too slow for load change rate', likelihood: 'high', testMethod: 'Observe governor speed recovery time after load step; compare to specification' },
      { cause: 'Governor adjustment or calibration incorrect', likelihood: 'medium', testMethod: 'Check governor settings against manufacturer specification; adjust as needed' },
      { cause: 'Speed sensor or signal problem giving false reading', likelihood: 'medium', testMethod: 'Verify speed sensor output with oscilloscope; check gap and gear condition' },
      { cause: 'Fuel injector stuck in delivery position', likelihood: 'low', testMethod: 'Remove injectors and inspect spray pattern; check for stuck nozzles' },
      { cause: 'Fuel rack binding or stuck open', likelihood: 'low', testMethod: 'Manually operate fuel rack through full range; check for smooth movement' },
      { cause: 'Governor actuator failure (electronic governor systems)', likelihood: 'low', testMethod: 'Test actuator stroke and response to command signal' },
      { cause: 'Loss of speed feedback signal to electronic governor', likelihood: 'low', testMethod: 'Verify governor speed sensing circuit and wiring integrity' },
      { cause: 'Mechanical overspeed trip malfunction', likelihood: 'low', testMethod: 'Test trip mechanism at rated overspeed threshold' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Review controller event log for details of overspeed event',
        tools: ['Controller interface software', 'Laptop computer'],
        expectedResult: 'Clear record of speed reached, time, load condition, and related alarms',
        ifFailed: 'If no log available, proceed with systematic component testing',
      },
      {
        step: 2,
        action: 'Check speed sensor output signal during running (at normal speed)',
        tools: ['Oscilloscope or frequency counter', 'Multimeter'],
        expectedResult: 'Clean sinusoidal signal, consistent amplitude, frequency matching engine speed',
        ifFailed: 'Check sensor gap adjustment, replace sensor if signal is erratic or weak',
      },
      {
        step: 3,
        action: 'Observe governor operation during load changes',
        tools: ['Load bank or controllable load', 'Tachometer'],
        expectedResult: 'Speed recovery within specification after load step, no hunting or oscillation',
        ifFailed: 'Adjust governor, check linkage, check hydraulic oil level if applicable',
      },
      {
        step: 4,
        action: 'Inspect fuel rack and injector operation',
        tools: ['Fuel rack indicator if equipped', 'Inspection light'],
        expectedResult: 'Fuel rack moves smoothly through full range, no binding or sticking',
        ifFailed: 'Service fuel injection pump, replace stuck injectors',
      },
      {
        step: 5,
        action: 'Test mechanical overspeed trip function (annual or after event)',
        tools: ['Governor adjustment tool', 'Tachometer', 'Safety equipment'],
        expectedResult: 'Trip activates at specified overspeed threshold (typically 110-115% rated)',
        ifFailed: 'Adjust or replace overspeed trip mechanism',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Ensure root cause has been identified and corrected - do not reset without proper diagnosis',
        warning: 'Uncontrolled overspeed can destroy engine within seconds',
      },
      {
        step: 2,
        instruction: 'Reset mechanical overspeed trip at engine (if equipped and activated)',
      },
      {
        step: 3,
        instruction: 'Press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 4,
        instruction: 'Press RESET button to clear electronic overspeed alarm',
        keySequence: ['RESET'],
      },
      {
        step: 5,
        instruction: 'Start engine at no load and verify speed stabilizes at rated (1500/1800 RPM)',
        warning: 'If speed is unstable or does not reach rated, shut down and continue diagnosis',
      },
      {
        step: 6,
        instruction: 'Apply load gradually while monitoring speed response',
      },
      {
        step: 7,
        instruction: 'Test operation under load rejection conditions if practical before returning to service',
      },
    ],

    repairSolutions: [
      {
        solution: 'Governor Adjustment and Calibration',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Governor manual for specifications', 'Possibly replacement springs or diaphragms'],
        toolsRequired: ['Governor adjustment tools', 'Tachometer', 'Load bank', 'Screwdrivers'],
        procedureSteps: [
          'Review governor manual for adjustment procedures',
          'Start engine and warm up to operating temperature',
          'Check idle speed and adjust if necessary',
          'Check rated speed at no load and adjust',
          'Check speed droop under load (typically 3-5%)',
          'Check speed recovery after load step',
          'Adjust sensitivity/gain for stable operation',
          'Verify overspeed protection still functions',
          'Record all settings for future reference',
        ],
        costEstimate: { min: 2000, max: 10000, currency: 'KES' },
      },
      {
        solution: 'Governor Replacement',
        difficulty: 'advanced',
        timeEstimate: '4-8 hours',
        partsNeeded: ['New or rebuilt governor', 'Gaskets', 'Governor drive components if needed'],
        toolsRequired: ['Socket and wrench set', 'Torque wrench', 'Governor timing tools', 'Tachometer'],
        procedureSteps: [
          'Disconnect battery and disable starting',
          'Remove linkage from governor to fuel rack',
          'Remove governor mounting bolts',
          'Remove old governor - note orientation',
          'Install new governor with new gaskets',
          'Reconnect linkage and adjust for proper travel',
          'Refill governor with oil if applicable',
          'Start engine and perform full adjustment',
          'Test under all operating conditions',
        ],
        costEstimate: { min: 50000, max: 200000, currency: 'KES' },
      },
      {
        solution: 'Speed Sensor Replacement',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Speed sensor (OEM specification)', 'Sensor bracket if damaged'],
        toolsRequired: ['Wrench set', 'Feeler gauges for gap setting', 'Multimeter'],
        procedureSteps: [
          'Locate speed sensor on flywheel housing',
          'Disconnect sensor electrical connector',
          'Remove sensor mounting hardware',
          'Remove old sensor',
          'Install new sensor in bracket',
          'Adjust gap to specification (typically 0.5-1.5mm)',
          'Secure mounting hardware',
          'Reconnect electrical connector',
          'Verify signal output with multimeter or scope',
          'Test run engine and verify speed reading',
        ],
        costEstimate: { min: 5000, max: 20000, currency: 'KES' },
      },
      {
        solution: 'Fuel Injection System Service',
        difficulty: 'advanced',
        timeEstimate: '4-8 hours',
        partsNeeded: ['Fuel injector rebuild kits or new injectors', 'Injection pump seals', 'Filters'],
        toolsRequired: ['Injector removal tools', 'Injector test bench', 'Torque wrench', 'Clean work area'],
        procedureSteps: [
          'Remove fuel injectors using proper tools',
          'Test each injector for spray pattern and pressure',
          'Replace stuck or worn injectors',
          'Inspect fuel pump rack for smooth operation',
          'Replace worn rack components if binding',
          'Reinstall injectors with new seals',
          'Torque to specification',
          'Bleed fuel system',
          'Test run and verify smooth operation',
        ],
        costEstimate: { min: 30000, max: 150000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'Overspeed engines can self-destruct violently - never attempt to restart without full diagnosis',
      'Keep all personnel clear during test running after overspeed repair',
      'Ensure guards and safety shields are in place before starting',
      'Do not bypass mechanical overspeed trip under any circumstances',
      'An engine that has experienced severe overspeed may have hidden internal damage',
      'Governor and fuel system work involves precise adjustments - follow manufacturer procedures exactly',
      'Test overspeed trip function annually but approach threshold carefully',
    ],

    preventionTips: [
      'Perform annual governor calibration and inspection',
      'Test overspeed trip mechanism annually',
      'Maintain clean fuel to prevent injector sticking',
      'Service hydraulic governor oil per schedule',
      'Address speed hunting or instability promptly',
      'Configure appropriate load shedding to reduce rejection severity',
      'Consider electronic governor upgrade for improved response',
      'Monitor engine speed trends for early warning of developing problems',
      'Train operators to reduce load before shutdown when practical',
    ],

    relatedCodes: ['0190-1', '0190-8', 'GEN-F01', 'SPD-01'],
    technicalNotes: 'Rated speeds: 1500 RPM (50Hz) or 1800 RPM (60Hz). Warning typically at 5-8% above rated, shutdown at 10-15% above. Mechanical overspeed trips typically set 10-15% above rated as backup to electronic. Governor recovery time should be <5 seconds for 0-100% load step. Speed sensors typically use flywheel ring gear with 130-150 teeth depending on engine. Always verify governor type (mechanical, hydraulic, or electronic) before diagnosis.',
  },

  // ==================== GENERATOR UNDERVOLTAGE (0230) ====================
  '0230': {
    code: '0230',
    title: 'Generator Undervoltage',
    severity: 'critical',
    category: 'Electrical Protection',
    subcategory: 'Voltage Regulation',

    overview: `Error code 0230 indicates that the generator output voltage has dropped below the minimum acceptable operating level configured in the controller's protection parameters. For 50Hz systems, this typically means voltage has fallen below 370-380V line-to-line (210-220V line-to-neutral) on a nominal 400V/230V system, or the equivalent percentage below nominal for other voltage ratings. Generator undervoltage can damage connected equipment, cause motors to overheat, trip sensitive electronic loads, and indicates either an overload condition or failure in the voltage regulation system.

Understanding why undervoltage matters requires knowledge of how electrical equipment responds to low voltage. Electric motors draw more current when voltage drops, attempting to maintain power output. This increased current causes motor windings to overheat, potentially burning out insulation and destroying the motor. A motor rated for 400V that receives only 360V will draw approximately 11% more current, and this current squared relationship means motor heating increases by over 23%. Sensitive electronic equipment may malfunction or shut down to protect itself. Incandescent lighting dims visibly. Three-phase equipment may experience torque pulsations and vibration. In severe cases, contactors may drop out and motor starters may chatter.

The generator's ability to maintain voltage depends on the automatic voltage regulator (AVR) and its control of the excitation system. When load is applied to the generator, voltage naturally tends to sag due to armature reaction and winding impedance. The AVR senses this sag and immediately increases field current to the exciter or main field windings, boosting flux and restoring voltage. A properly functioning AVR can maintain voltage within ±2-3% across the full load range. When voltage sags beyond acceptable limits, either the AVR has failed, the excitation system cannot provide sufficient field current, or the engine cannot maintain the speed needed for voltage regulation.

The protection logic in the generator controller monitors all three phase voltages continuously, comparing against programmed undervoltage thresholds. Most controllers implement a time delay (typically 2-10 seconds) to prevent nuisance tripping during motor starting or other transient conditions when momentary undervoltage is expected. When voltage remains below the threshold beyond this delay, the controller typically trips the generator breaker to disconnect the load and either continues running for possible recovery or shuts down completely depending on configuration.

Diagnosing undervoltage requires understanding the interrelationship between engine speed, excitation, and load. If engine speed drops due to overload, generator frequency and voltage both fall. If excitation fails, voltage drops while frequency remains normal. If the generator is overloaded but excitation is at maximum, voltage cannot be maintained regardless of AVR function. Systematic diagnosis identifies which of these scenarios applies and directs repair efforts appropriately.`,

    diagnosticProcedure: `Begin diagnosis by determining whether the undervoltage event occurred during steady-state operation or during a load transient such as motor starting. Review the controller's event log for context - note the voltage readings at trip, the load level, engine speed, and any related alarms. An undervoltage occurring simultaneously with an engine underspeed alarm indicates the problem is in the engine or fuel system, not the electrical system. An undervoltage occurring with normal engine speed points to excitation or overload issues.

Verify the voltage measurement accuracy first. Using a calibrated true-RMS multimeter, measure all three line-to-line voltages and all three line-to-neutral voltages at the generator terminals (not at the load). Compare these readings to the controller's display. If the controller reads low but the actual voltage is normal, there may be a problem with the voltage sensing inputs - check the voltage sensing fuses (if present) and the sensing wiring. If actual voltage matches the low controller reading, the problem is real and requires further investigation.

Check engine speed while the generator is running under load. Generator voltage is directly proportional to frequency (and hence engine speed) and flux. If engine speed has dropped below rated (1500 RPM for 50Hz, 1800 RPM for 60Hz), the generator cannot produce rated voltage regardless of excitation level. Possible causes of low engine speed include fuel supply problems, governor issues, or engine overload. Address any engine speed problems before continuing with electrical diagnosis.

With engine speed confirmed normal, evaluate the excitation system. For generators with rotating exciters, check exciter output voltage (typically measured at the rotating diode assembly input) against specifications. Low exciter output indicates either AVR problems or exciter winding issues. For brushless generators with permanent magnet pilots, verify PMG output is present and correct. For generators with static exciters (compound or shunt excitation from the main stator), check the excitation power circuit components.

Test AVR functionality systematically. Most AVRs have a voltage adjustment potentiometer - verify it is correctly set for the nominal voltage and has not drifted or been misadjusted. Check all AVR connections for tightness and corrosion. Measure AVR output during operation - this is the DC voltage sent to the exciter field or main field, typically 40-100V DC depending on design. If AVR output is maximum but voltage is still low, the problem is downstream in the exciter or field circuit. If AVR output is low, the AVR may have failed or may be sensing incorrect feedback.

Evaluate the load condition versus generator rating. Calculate actual kVA load using measured voltage and current, then compare to the generator nameplate rating. If load exceeds generator capacity, voltage will sag regardless of excitation - the solution is load reduction or generator upgrade, not electrical repair. Also check for unbalanced loads across the three phases - severe imbalance can cause one phase to be significantly lower than others, potentially triggering undervoltage protection on that phase.`,

    resetInstructions: `Before resetting the undervoltage alarm, ensure the underlying cause has been identified and corrected. Simply resetting and reconnecting load when the excitation system has failed will result in immediate voltage collapse and potential equipment damage. If the undervoltage was caused by a temporary overload that has been reduced, reset may be appropriate after confirming voltage has recovered to normal levels.

Verify that generator voltage has returned to acceptable levels before attempting reset. With the generator running at no load (generator breaker open), measure all three phase voltages - they should be at or slightly above nominal (400V L-L or 415V L-L for most 50Hz systems). If voltage is still low at no load, do not reset and reconnect load until the excitation problem is repaired. If voltage is normal at no load, the previous problem may have been temporary overload.

For DSE controllers (4xxx, 5xxx, 7xxx, 8xxx series): If the generator is still running, press the STOP button to shut down. Wait for complete stop, then press RESET to clear the alarm. Restart and verify voltage before closing the generator breaker. Some configurations may allow reset with the generator running if voltage has recovered - press RESET and observe the alarm status.

For ComAp controllers (InteliLite, InteliGen, InteliSys): Navigate to ALARM LIST and select the Undervoltage alarm. Press RESET or CLEAR. If the generator was tripped, it may automatically restart in AUTO mode, or may require manual restart depending on configuration. Monitor voltage during restart to ensure it remains stable.

For Woodward controllers (EasyGen series): Access the SERVICE menu and navigate to ACTIVE FAULTS. Clear the undervoltage alarm. If automatic breaker reclosure is configured, the controller may attempt to reconnect load automatically after a delay - be prepared to intervene if voltage does not hold.

After reset, closely monitor the generator during load pickup. Apply load gradually if possible, observing voltage at each step. Voltage should remain within ±5% of nominal through the load range. Any unusual voltage sag, instability, or hunting indicates ongoing problems that require further diagnosis. Do not return to automatic operation until confident the voltage regulation is functioning correctly.`,

    solutionGuide: `Solving undervoltage problems requires matching the repair to the root cause. The main categories are excitation system failure, engine speed problems, overload conditions, and sensing/protection issues. Proper diagnosis identifies which category applies before committing to specific repairs.

For AVR failure or malfunction (approximately 30% of undervoltage cases), replacement is usually the most practical solution. AVRs contain solid-state components that age and can fail suddenly. Before replacing, verify that the AVR is actually at fault by checking input and output signals. The AVR should receive sensing voltage from the generator and produce field voltage output that varies with load to maintain constant output voltage. If no output or erratic output, replace the AVR. When installing a replacement, ensure it is compatible with your generator's excitation system - different generators require different AVR types. Set the new AVR's voltage potentiometer to match your system nominal voltage.

For exciter problems (approximately 20% of cases), diagnosis depends on exciter type. Rotating exciters can have field winding faults, rotating diode (RDA) failures, or bearing problems affecting alignment and output. Test exciter field resistance against specifications. Test rotating diodes with a multimeter diode function - each should show forward voltage drop in one direction and open circuit in the other. Replace any shorted or open diodes. For PMG excitation, verify PMG output (typically 3-phase AC that the AVR rectifies) is present and correct. Low or missing PMG output indicates PMG magnet demagnetization or winding failure requiring PMG replacement.

For main field and main stator issues (approximately 10% of cases), these require more extensive diagnosis and repair. Measure main field resistance and compare to nameplate or design specifications. Low resistance indicates shorted turns; high or infinite resistance indicates open circuit. Check for field-to-ground insulation. Main stator problems are rare but can include winding faults that reduce output capability. Stator winding repair requires specialized equipment and skills.

For engine and speed-related undervoltage (approximately 15% of cases), address the engine problems first. Ensure fuel supply is adequate and fuel quality is good. Verify governor is maintaining rated speed under load - adjust or repair governor if speed droops excessively. Check that engine is not overloaded - engine kW output equals generator kW output plus losses, and an undersized engine cannot maintain speed when the generator is fully loaded.

For load-related problems (approximately 15% of cases), the solution is either reducing load or upgrading capacity. Calculate actual load and compare to generator rating. Remember that reactive (kVAr) loads affect the generator even though they don't register on kW meters - a generator's capacity is limited by both kW and kVA. Address power factor by adding power factor correction capacitors if inductive loads are causing excessive kVAr demand. Consider load shedding to reduce step loads during motor starting. If the site consistently needs more power, a larger generator is required.

For sensing and protection system issues (approximately 10% of cases), repair or replace the faulty components. Check voltage sensing fuses and replace if blown. Verify voltage sensing wiring is intact and connections are tight. Check for proper voltage sensing location - some systems sense at the generator, others sense at the bus or load. Incorrect sensing location can cause false trips or failure to protect.`,

    possibleCauses: [
      { cause: 'AVR (Automatic Voltage Regulator) failure', likelihood: 'high', testMethod: 'Check AVR output vs load, verify sensing inputs, test with known good AVR if available' },
      { cause: 'Generator overload exceeding kVA capacity', likelihood: 'high', testMethod: 'Measure load current on all phases, calculate actual kVA, compare to rating' },
      { cause: 'Engine speed droop due to governor or fuel problems', likelihood: 'medium', testMethod: 'Measure actual engine speed under load with tachometer or frequency meter' },
      { cause: 'Exciter field or rotating diode (RDA) failure', likelihood: 'medium', testMethod: 'Measure exciter field resistance, test rotating diodes with multimeter' },
      { cause: 'Main generator field winding fault', likelihood: 'low', testMethod: 'Measure main field resistance, check field-to-ground insulation' },
      { cause: 'Voltage sensing circuit problem (fuse, wiring)', likelihood: 'low', testMethod: 'Verify sensing voltage present at controller, check fuses' },
      { cause: 'Loss of residual magnetism (initial start only)', likelihood: 'low', testMethod: 'Generator produces no voltage on start - requires field flashing' },
      { cause: 'PMG (Permanent Magnet Generator) failure on PMG-excited systems', likelihood: 'low', testMethod: 'Measure PMG output voltage with meter' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Review controller event log for context of undervoltage event',
        tools: ['Controller interface software', 'Laptop'],
        expectedResult: 'Clear understanding of conditions: load level, speed, concurrent alarms',
        ifFailed: 'Proceed with systematic testing',
      },
      {
        step: 2,
        action: 'Measure generator output voltage with calibrated multimeter',
        tools: ['True-RMS multimeter rated for generator voltage', 'Safety equipment'],
        expectedResult: 'All three phases within ±5% of nominal, balanced',
        ifFailed: 'Note which phase(s) are low; compare to controller reading',
      },
      {
        step: 3,
        action: 'Verify engine speed is at rated (1500 or 1800 RPM)',
        tools: ['Tachometer or frequency meter'],
        expectedResult: 'Speed within ±0.5% of rated at all load conditions',
        ifFailed: 'Address engine/governor problems before continuing electrical diagnosis',
      },
      {
        step: 4,
        action: 'Check load level versus generator rating',
        tools: ['Clamp ammeter', 'Power meter if available'],
        expectedResult: 'Load kVA within generator nameplate rating',
        ifFailed: 'Reduce load to within capacity; consider generator upgrade',
      },
      {
        step: 5,
        action: 'Measure AVR input (sensing voltage) and output (field voltage)',
        tools: ['Multimeter', 'AVR wiring diagram'],
        expectedResult: 'Sensing voltage matches output, field voltage varies with load, no erratic readings',
        ifFailed: 'AVR may be faulty - test with known good unit or replace',
      },
      {
        step: 6,
        action: 'Test exciter field and rotating diodes',
        tools: ['Multimeter with diode test', 'Megger for insulation'],
        expectedResult: 'Field resistance per spec, all diodes test good, no ground faults',
        ifFailed: 'Replace faulty diodes or exciter field',
      },
      {
        step: 7,
        action: 'Verify voltage sensing circuit integrity',
        tools: ['Multimeter', 'Wiring diagram'],
        expectedResult: 'Sensing fuses intact, wiring continuous, connections tight',
        ifFailed: 'Replace blown fuses, repair wiring, tighten connections',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Verify generator voltage has returned to acceptable levels at no load',
        warning: 'Do not reconnect load if voltage is still low',
      },
      {
        step: 2,
        instruction: 'Confirm root cause has been identified and corrected',
      },
      {
        step: 3,
        instruction: 'Press STOP button to shut down generator (if not already stopped)',
        keySequence: ['STOP'],
      },
      {
        step: 4,
        instruction: 'Press RESET button to clear undervoltage alarm',
        keySequence: ['RESET'],
      },
      {
        step: 5,
        instruction: 'Restart generator and verify voltage at no load before closing breaker',
      },
      {
        step: 6,
        instruction: 'Apply load gradually while monitoring voltage - should remain within ±5% of nominal',
        warning: 'If voltage drops excessively, disconnect load and continue diagnosis',
      },
    ],

    repairSolutions: [
      {
        solution: 'Replace Automatic Voltage Regulator (AVR)',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Replacement AVR (compatible with generator)', 'Possibly new wiring terminals'],
        toolsRequired: ['Screwdrivers', 'Multimeter', 'Wire strippers', 'Wiring diagram'],
        procedureSteps: [
          'Shut down generator and disconnect battery',
          'Locate AVR (usually in generator terminal box or control panel)',
          'Document all wire connections to AVR - photograph or sketch',
          'Disconnect all wires from AVR',
          'Remove AVR mounting hardware',
          'Install new AVR in same location',
          'Connect all wires per documentation',
          'Set voltage adjustment to approximate midpoint',
          'Reconnect battery and start generator (no load)',
          'Adjust voltage pot to achieve nominal voltage',
          'Test under load to verify voltage regulation',
        ],
        costEstimate: { min: 15000, max: 80000, currency: 'KES' },
      },
      {
        solution: 'Replace Exciter Rotating Diodes (RDA)',
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        partsNeeded: ['Rotating diode assembly (RDA)', 'Heat sink compound'],
        toolsRequired: ['Socket set', 'Torque wrench', 'Multimeter', 'Soldering equipment if needed'],
        procedureSteps: [
          'Shut down generator completely',
          'Remove coupling guard and exciter cover',
          'Locate rotating diode assembly on exciter rotor',
          'Test each diode with multimeter diode function',
          'Identify and replace faulty diodes',
          'Apply heat sink compound to diode mounting surfaces',
          'Torque diode mounting hardware to spec (usually 2-4 Nm)',
          'Reassemble exciter cover and coupling guard',
          'Test generator output voltage under load',
        ],
        costEstimate: { min: 10000, max: 50000, currency: 'KES' },
      },
      {
        solution: 'Governor Adjustment for Speed Droop',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Governor manual', 'Possibly new springs or linkage'],
        toolsRequired: ['Governor adjustment tools', 'Tachometer', 'Load bank'],
        procedureSteps: [
          'Start generator and warm up',
          'Measure speed at no load - adjust to rated',
          'Apply 25% load and measure speed',
          'Apply 50%, 75%, 100% load measuring speed at each step',
          'Speed should remain within 3-5% of rated through range',
          'Adjust governor for flatter droop if needed',
          'Retest voltage regulation under load',
        ],
        costEstimate: { min: 5000, max: 20000, currency: 'KES' },
      },
      {
        solution: 'Load Reduction and Power Management',
        difficulty: 'easy',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Possibly additional metering equipment'],
        toolsRequired: ['Clamp ammeter', 'Power analyzer'],
        procedureSteps: [
          'Measure and document all loads',
          'Identify largest and most critical loads',
          'Calculate total kW and kVA demand',
          'Compare to generator capacity',
          'Implement load shedding or sequencing',
          'Consider soft starters for large motors',
          'Add power factor correction if needed',
          'Document revised load schedule',
        ],
        costEstimate: { min: 0, max: 50000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'Generator voltages can be lethal - always follow electrical safety procedures',
      'Never work on energized generator circuits without proper training and equipment',
      'Do not reconnect load if voltage is not stable at normal levels',
      'Allow capacitors to discharge before working on excitation circuits',
      'Rotating equipment can cause entanglement - keep hands and clothing clear',
      'AVR and excitation circuits may retain voltage even after shutdown',
    ],

    preventionTips: [
      'Monitor voltage readings during routine operation',
      'Record voltage under various load conditions for trending',
      'Perform annual AVR and excitation system inspection',
      'Test rotating diodes during annual service',
      'Maintain proper engine governor adjustment for speed stability',
      'Match generator capacity to load requirements with appropriate margin',
      'Use soft starters or VFDs to reduce motor starting impact',
      'Install power factor correction for inductive loads',
      'Clean and tighten all excitation circuit connections annually',
    ],

    relatedCodes: ['0230-1', 'U-01', 'GEN-V01', '0231', '0232'],
    technicalNotes: 'Typical voltage tolerances: ±10% for general loads, ±5% for critical loads, ±3% for sensitive equipment. AVR regulation accuracy typically ±2% from no load to full load. Undervoltage thresholds typically set at 85-90% of nominal (e.g., 340-360V for 400V system). Time delay typically 2-10 seconds to ride through motor starting. Measure voltage at generator terminals for most accurate assessment. Remember V=4.44*f*N*Φ relationship when diagnosing - voltage depends on frequency (speed), turns (fixed), and flux (excitation).',
  },

  // ==================== FAIL TO START (0001) ====================
  '0001': {
    code: '0001',
    title: 'Engine Fail to Start',
    severity: 'critical',
    category: 'Engine Control',
    subcategory: 'Starting System',

    overview: `Error code 0001 indicates that the engine has failed to start within the programmed number of attempts. Most generator controllers are configured to make 2-5 start attempts with brief cool-down periods between attempts before declaring a fail-to-start condition and locking out the starting sequence. This protection prevents starter motor damage from extended cranking, battery depletion, and repeated unsuccessful attempts while the underlying problem remains uncorrected. A fail-to-start lockout requires manual investigation and reset before further start attempts will be allowed.

Understanding the diesel engine starting sequence helps in diagnosis. When the controller initiates a start, it typically: (1) activates the fuel solenoid or fuel rack to allow fuel delivery, (2) may activate glow plugs or intake heaters on smaller engines for cold starting assistance, (3) energizes the starting motor to crank the engine, and (4) monitors engine speed to detect when the engine has successfully started. If the engine reaches a minimum sustaining speed (typically 500-800 RPM) and maintains it for a programmed time (typically 3-10 seconds), the start is considered successful and the controller transitions to running mode. If the engine fails to reach or maintain this threshold, the start attempt is considered failed.

The most common reasons for fail-to-start conditions fall into three categories: fuel system problems, starting system problems, and air/compression issues. Fuel problems include empty tank, closed fuel valves, air in fuel lines, failed lift pumps, clogged filters, and stuck fuel injectors. Starting system problems include dead or weak batteries, failed starter motors, corroded connections, and failed starting relays. Air and compression issues include blocked air filters, stuck exhaust valves, and loss of compression due to engine wear or damage.

Modern generator controllers provide sophisticated starting controls including crank time limits (typically 10-30 seconds per attempt), crank rest periods (30-60 seconds between attempts), multiple attempt allowances (2-5 attempts), and safety interlocks that must be satisfied before starting is allowed. The controller also monitors for conditions that should abort starting, such as low oil pressure during cranking or detection of existing faults. All of this information is logged and can be valuable in diagnosing why the start failed.

A fail-to-start condition is always significant because it means the generator cannot provide emergency power when needed. Whether the generator is a standby unit that must start on mains failure or a prime power source, failure to start defeats the generator's purpose. Rapid diagnosis and repair are essential, and many sites keep critical spare parts (batteries, filters, relays) on hand for quick resolution of common fail-to-start causes.`,

    diagnosticProcedure: `Begin diagnosis by gathering information from the controller about the failed start attempts. Review the event log for details of each attempt - cranking time, speed reached, any alarms that occurred during cranking, and reason for abort if recorded. This information helps focus the diagnosis. For example, if the engine cranked vigorously but never fired, focus on fuel and injection. If cranking was slow or absent, focus on batteries and starter. If the engine fired but immediately died, focus on fuel delivery or air supply.

Check the fuel system first, as fuel problems cause the majority of fail-to-start conditions. Verify the fuel tank has adequate fuel (not just the gauge, but visually confirm or use a dipstick). Check that all fuel valves between the tank and engine are fully open. Look for obvious fuel leaks that might have drained the system. Check the primary and secondary fuel filters for clogging - a clogged filter can prevent adequate fuel flow during cranking. If the engine has been sitting unused for extended periods, fuel may have deteriorated or water may have accumulated - drain water separators and consider fuel system cleaning.

Bleed air from the fuel system if air entry is suspected. Air in diesel fuel lines prevents the injection system from developing proper pressure and prevents fuel from reaching the cylinders. Most diesel engines have bleed screws or banjo fittings that can be loosened to allow air to escape while fuel is pumped through. The manual or electric lift pump should be activated to prime fuel through the system. Continue bleeding until bubble-free fuel flows from each bleed point.

Test the starting batteries if the cranking was slow, weak, or absent. Using a battery load tester or multimeter, check open-circuit voltage (should be 12.6V+ for 12V systems, 25.2V+ for 24V systems). Check voltage during cranking - it should not drop below 10.5V (12V system) or 21V (24V system). If voltage drops excessively, the battery may be discharged, damaged, or undersized. Also check battery cable connections for corrosion or looseness, which can cause voltage drop even with good batteries. Measure current during cranking if possible - a starter that draws excessive current may be failing.

Verify the starter motor operates correctly. Listen during crank attempts - you should hear the starter engage and the engine turn over. If you hear clicking but no cranking, the starter solenoid may be engaging but the motor is not spinning (possible failed motor or seized engine). If you hear nothing, check for voltage at the starter solenoid during crank command - no voltage indicates wiring or relay problems. A starter that cranks the engine slowly even with good batteries may have worn brushes, damaged commutator, or high-resistance connections.

Check for air supply issues including blocked air filters or restricted exhaust. A severely clogged air filter can prevent the engine from drawing enough air to start. Blocked exhaust systems (rare but possible in enclosed installations) prevent the engine from expelling gases. On engines with exhaust brakes or exhaust shutoffs, verify these are in the open position allowing exhaust flow.

For persistent problems, check engine compression. Low compression can prevent an engine from starting, especially in cold conditions. Causes include worn piston rings, valve sealing issues, head gasket failure, or in extreme cases, damaged pistons or cylinders. Compression testing requires special equipment and should be performed if other causes are ruled out.`,

    resetInstructions: `Before resetting and attempting to restart, ensure you have identified and corrected the cause of the start failure. Repeated unsuccessful cranking with an uncorrected problem will deplete batteries, damage the starter motor, and may cause additional problems. The lockout exists to force diagnosis before repeated attempts.

If you have identified and corrected the problem (for example, filled an empty fuel tank and bled the system, or replaced a dead battery), you can reset the fail-to-start lockout and attempt to start again. If you have not identified the cause, consider whether it is safe to attempt another start - one careful attempt with observation may help identify the problem.

For DSE controllers (4xxx, 5xxx, 7xxx, 8xxx series): Press and hold the STOP button until the controller acknowledges (typically 3 seconds). Then press the RESET button to clear the fail-to-start lockout. The alarm LED should extinguish and the controller should show ready status. You can now press AUTO or MANUAL to initiate a start sequence.

For ComAp controllers (InteliLite, InteliGen): The fail-to-start lockout is typically cleared by pressing the RESET button or soft key. Navigate to ALARM LIST if necessary and select the fail-to-start alarm for reset. After reset, the controller returns to normal mode and will accept start commands.

For Woodward controllers (EasyGen series): Access ACTIVE FAULTS through the SERVICE menu. Select the fail-to-start fault and choose CLEAR. The controller will allow new start attempts after the fault is cleared.

For SmartGen controllers (HGM series): Press the RESET button on the front panel. The HGM series displays remaining start attempts during the sequence - after the final attempt fails, RESET is required before new attempts.

After reset, if you initiate a manual start, observe the cranking carefully. Listen for the starter engaging, watch the engine speed reading build, and note when/if the engine fires. This observation helps pinpoint remaining problems. If the engine starts successfully, allow it to run and warm up fully while monitoring for any abnormalities. If it fails again, note exactly what happened and continue diagnosis.`,

    solutionGuide: `Solving fail-to-start conditions requires matching the repair to the root cause. Systematic diagnosis identifies whether the problem is fuel delivery, starting system, air/compression, or control system related. Each category requires different repairs.

For fuel system problems (approximately 40% of fail-to-start cases), the solutions range from simple to complex. An empty or low fuel tank requires refilling and system bleeding. Closed or partially closed fuel valves require opening - trace the fuel path from tank to engine and verify each valve. Clogged fuel filters require replacement - use genuine parts and correct micron rating. Air in fuel lines requires bleeding - follow the engine manufacturer's bleed procedure, typically starting at the lift pump and progressing to the injection pump and individual injector lines. Failed lift pumps require replacement - test by disconnecting the outlet and checking for fuel flow when cranking or with manual priming lever. Stuck or failed injectors require professional testing and rebuilding or replacement. Deteriorated or contaminated fuel requires draining and replacing with fresh fuel, plus cleaning of filters and possibly tank treatment.

For starting system problems (approximately 35% of cases), battery and electrical issues predominate. Dead or weak batteries require charging or replacement - load test batteries to determine if they can hold charge or need replacement. Corroded or loose battery connections require cleaning with wire brush and tightening to proper torque with protective spray applied after. Failed starter motors require replacement or rebuilding - starters are typically rebuilt rather than repaired in the field. Failed starting relays or contactors require replacement - test by checking for voltage output when commanded and for coil resistance. Wiring problems (open circuits, high resistance) require tracing and repair. Controller output failures require controller repair or replacement.

For air and compression problems (approximately 15% of cases), solutions depend on the specific issue. Clogged air filters require replacement - inspect replaced filter for excessive contamination and consider more frequent changes or pre-filter installation. Blocked exhaust requires clearing - inspect silencer and exhaust piping for collapsed sections, blockage by debris or animals, or failed flapper valves. Low engine compression requires major engine work - compression testing identifies the severity, and repair may range from valve adjustment to complete overhaul.

For control system problems (approximately 10% of cases), the controller or its sensors and inputs may be preventing successful starting. Verify all protective interlocks are satisfied - some controllers require specific conditions (e.g., oil pressure sender connected, no active faults, mode selector in correct position) before allowing start. Check for sensor failures that might cause abort - a failed oil pressure sender might cause immediate post-start shutdown that appears as fail-to-start. Verify fuel solenoid is energizing during crank - listen for click and check for voltage. Controller software issues or configuration problems may require factory support.

In cold weather conditions, additional considerations apply. Engine block heaters should be energized and checked for proper operation. Glow plugs or intake heaters should cycle during pre-heat and may need replacement if not functioning. Use of starting fluids should be avoided on diesel engines with glow plug systems as it can cause damage. Battery capacity is significantly reduced in cold temperatures.`,

    possibleCauses: [
      { cause: 'Empty or low fuel tank', likelihood: 'high', testMethod: 'Visually check tank level, not just gauge' },
      { cause: 'Air in fuel system', likelihood: 'high', testMethod: 'Bleed fuel system at each point, check for bubbles' },
      { cause: 'Dead or weak batteries', likelihood: 'high', testMethod: 'Load test batteries, check voltage during crank' },
      { cause: 'Clogged fuel filter(s)', likelihood: 'medium', testMethod: 'Replace filters, note pressure differential if gauged' },
      { cause: 'Fuel valve(s) closed', likelihood: 'medium', testMethod: 'Trace fuel path, verify all valves fully open' },
      { cause: 'Failed lift pump', likelihood: 'medium', testMethod: 'Check for fuel at pump outlet during crank' },
      { cause: 'Starter motor failure', likelihood: 'medium', testMethod: 'Listen for starter engagement, check current draw' },
      { cause: 'Corroded or loose battery connections', likelihood: 'medium', testMethod: 'Inspect terminals, check voltage drop during crank' },
      { cause: 'Clogged air filter', likelihood: 'low', testMethod: 'Inspect filter, try starting with filter removed' },
      { cause: 'Failed fuel solenoid', likelihood: 'low', testMethod: 'Listen for click when starting, check voltage at solenoid' },
      { cause: 'Low compression', likelihood: 'low', testMethod: 'Perform compression test on all cylinders' },
      { cause: 'Controller/sensor fault', likelihood: 'low', testMethod: 'Check for additional faults, verify sensor readings' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Review controller event log for fail-to-start details',
        tools: ['Controller interface software', 'Laptop'],
        expectedResult: 'Information about crank attempts, speeds reached, reason for failure',
        ifFailed: 'Proceed with systematic physical testing',
      },
      {
        step: 2,
        action: 'Check fuel tank level and fuel system valves',
        tools: ['Flashlight', 'Tank dipstick'],
        expectedResult: 'Adequate fuel level, all valves in open position',
        ifFailed: 'Refill tank and/or open valves',
      },
      {
        step: 3,
        action: 'Test battery condition and connections',
        tools: ['Battery load tester or multimeter', 'Wire brush'],
        expectedResult: 'Batteries fully charged, connections clean and tight',
        ifFailed: 'Charge or replace batteries, clean connections',
      },
      {
        step: 4,
        action: 'Observe cranking behavior during start attempt',
        tools: ['Key or remote start capability'],
        expectedResult: 'Strong, consistent cranking at 150-250 RPM',
        ifFailed: 'If no crank: check starter/wiring. If slow crank: battery/connections. If crank OK but no start: fuel/air',
      },
      {
        step: 5,
        action: 'Bleed air from fuel system',
        tools: ['Wrenches for bleed screws', 'Container for fuel', 'Shop towels'],
        expectedResult: 'Bubble-free fuel at all bleed points',
        ifFailed: 'Continue bleeding, check for air entry point in system',
      },
      {
        step: 6,
        action: 'Check fuel filters and replace if needed',
        tools: ['Filter wrenches', 'New filters', 'Drain container'],
        expectedResult: 'Filters not excessively restricted, no water or contamination',
        ifFailed: 'Replace filters, investigate contamination source',
      },
      {
        step: 7,
        action: 'Verify fuel solenoid operation',
        tools: ['Multimeter', 'Test light'],
        expectedResult: 'Solenoid clicks when energized, voltage present during crank',
        ifFailed: 'Replace solenoid or check wiring/controller output',
      },
      {
        step: 8,
        action: 'Check air filter condition',
        tools: ['Visual inspection'],
        expectedResult: 'Filter not excessively dirty, good airflow when held to light',
        ifFailed: 'Replace air filter, investigate dust sources',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Identify and correct the cause of start failure before resetting',
        warning: 'Repeated unsuccessful cranking damages starter and depletes batteries',
      },
      {
        step: 2,
        instruction: 'Press and hold STOP button for 3 seconds',
        keySequence: ['STOP (HOLD 3s)'],
      },
      {
        step: 3,
        instruction: 'Press RESET to clear fail-to-start lockout',
        keySequence: ['RESET'],
      },
      {
        step: 4,
        instruction: 'Verify controller shows ready status with no active alarms',
      },
      {
        step: 5,
        instruction: 'Initiate start sequence and observe carefully',
        warning: 'If start fails again, do not continue repeated attempts - continue diagnosis',
      },
      {
        step: 6,
        instruction: 'After successful start, monitor engine for proper operation during warm-up',
      },
    ],

    repairSolutions: [
      {
        solution: 'Bleed Air from Fuel System',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['Clean fuel for priming', 'Shop towels'],
        toolsRequired: ['Wrenches for bleed screws', 'Drain container', 'Manual priming lever or auxiliary pump'],
        procedureSteps: [
          'Locate all fuel system bleed points (lift pump, injection pump, injector lines)',
          'Starting at point closest to tank, loosen bleed screw',
          'Operate manual priming lever or auxiliary pump',
          'Watch for bubble-free fuel flow from bleed point',
          'Tighten bleed screw and move to next point',
          'Repeat at injection pump inlet and outlet',
          'Loosen injector line nuts at injectors',
          'Crank engine briefly until fuel appears at each injector',
          'Tighten injector lines and attempt start',
          'Confirm no air reentry by checking for leaks',
        ],
        costEstimate: { min: 0, max: 1000, currency: 'KES' },
      },
      {
        solution: 'Replace Fuel Filters',
        difficulty: 'easy',
        timeEstimate: '20-40 minutes',
        partsNeeded: ['Primary fuel filter', 'Secondary fuel filter', 'Possibly filter O-rings'],
        toolsRequired: ['Filter wrenches', 'Drain container', 'Shop towels', 'Funnel'],
        procedureSteps: [
          'Locate primary (water separator) and secondary fuel filters',
          'Place drain container under filters',
          'Drain water from primary filter if equipped',
          'Remove old filters - note orientation and O-ring positions',
          'Lightly oil new filter O-rings with clean diesel',
          'Install new filters hand-tight',
          'Prime fuel system through filters',
          'Bleed air from system',
          'Start engine and check for leaks',
          'Record filter change in maintenance log',
        ],
        costEstimate: { min: 2000, max: 10000, currency: 'KES' },
      },
      {
        solution: 'Service or Replace Batteries',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Replacement batteries if needed', 'Battery terminal cleaner', 'Terminal protector spray'],
        toolsRequired: ['Battery terminal tools', 'Wire brush', 'Multimeter', 'Load tester', 'Safety glasses and gloves'],
        procedureSteps: [
          'Disconnect negative cables first, then positive',
          'Remove batteries from battery box',
          'Clean battery box and trays of any corrosion',
          'Load test batteries - replace if failed',
          'Clean terminals and cable ends with wire brush',
          'Install batteries securely in tray',
          'Connect positive cables first, then negative',
          'Torque terminals to specification',
          'Apply terminal protector spray',
          'Verify charging system operation',
        ],
        costEstimate: { min: 3000, max: 50000, currency: 'KES' },
      },
      {
        solution: 'Replace Starter Motor',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Replacement starter motor (new or rebuilt)', 'Possibly new mounting hardware'],
        toolsRequired: ['Socket set', 'Wrenches', 'Pry bar for starter removal', 'Multimeter'],
        procedureSteps: [
          'Disconnect battery negative terminal',
          'Label and disconnect wires from starter',
          'Support starter motor weight',
          'Remove mounting bolts (typically 2-3)',
          'Lower starter carefully - it is heavy',
          'Compare old and new starters for correct match',
          'Install new starter with proper alignment',
          'Install and torque mounting bolts',
          'Reconnect wires to correct terminals',
          'Reconnect battery',
          'Test starter operation',
        ],
        costEstimate: { min: 15000, max: 80000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'Never crank engine continuously for more than 30 seconds - allow 60 seconds rest between attempts',
      'Do not use starting fluid on engines with glow plugs - can cause damage or explosion',
      'Batteries produce hydrogen gas - avoid sparks and flames in battery area',
      'Do not attempt to jump-start with a running vehicle - voltage spikes can damage controller',
      'Fuel is flammable - take precautions when bleeding fuel system',
      'Starter motors become very hot after extended cranking - allow cooling',
      'Disconnect battery before working on starting circuits to prevent accidental cranking',
    ],

    preventionTips: [
      'Maintain adequate fuel level at all times - never let tank run empty',
      'Perform regular test starts (weekly for standby generators) to verify starting capability',
      'Replace fuel filters at scheduled intervals',
      'Keep batteries fully charged with regular maintenance charging',
      'Test battery condition annually or more frequently',
      'Exercise engine monthly if not in regular use',
      'Keep fuel fresh with stabilizer if not used frequently',
      'Check fuel tank for water accumulation monthly',
      'Verify block heater operation in cold climates',
    ],

    relatedCodes: ['0001-1', 'FAIL-01', 'CRK-01', 'FUEL-01'],
    technicalNotes: 'Controller typically makes 2-5 start attempts with 30-60 second rest between. Each crank attempt typically limited to 10-30 seconds. Engine must reach and maintain minimum speed (typically 500-800 RPM) for programmed time (3-10 seconds) to be considered started. Pre-crank fuel soak time may be programmed for priming. Cold start aids (glow plugs, intake heaters) cycle based on temperature sensor reading. Review these parameters in controller configuration if problems persist.',
  },
};

// Export helper function to get detailed fault code by code string
export function getDetailedFaultCode(code: string): DetailedFaultCode | undefined {
  return ENHANCED_DETAILED_FAULT_CODES[code];
}

// Export all codes as array for iteration
export function getAllDetailedFaultCodes(): DetailedFaultCode[] {
  return Object.values(ENHANCED_DETAILED_FAULT_CODES);
}

// Search function for fault codes
export function searchDetailedFaultCodes(query: string): DetailedFaultCode[] {
  const lowerQuery = query.toLowerCase();
  return getAllDetailedFaultCodes().filter(fault =>
    fault.code.toLowerCase().includes(lowerQuery) ||
    fault.title.toLowerCase().includes(lowerQuery) ||
    fault.category.toLowerCase().includes(lowerQuery) ||
    fault.overview.toLowerCase().includes(lowerQuery)
  );
}

export default ENHANCED_DETAILED_FAULT_CODES;
