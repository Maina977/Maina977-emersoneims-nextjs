'use client';

/**
 * COMPREHENSIVE FAULT CODE DATABASE
 * Ultra-detailed fault codes with 4+ paragraph explanations
 * Covers ALL 9 controller brands with professional-grade diagnostics
 *
 * Controllers: DSE, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, ENKO
 */

export interface ComprehensiveFaultCode {
  id: string;
  code: string;
  title: string;
  controller: string;
  controllerModels: string[];
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  category: string;
  subcategory: string;

  // 4+ PARAGRAPH DETAILED EXPLANATIONS
  overview: string;          // 4+ paragraphs explaining the fault
  technicalAnalysis: string; // 4+ paragraphs on technical details
  diagnosticProcedure: string; // 4+ paragraphs step-by-step diagnosis
  resetProcedure: string;    // 4+ paragraphs on reset methods
  solutionGuide: string;     // 4+ paragraphs on repairs
  preventionStrategy: string; // 4+ paragraphs on prevention

  // Structured Data
  triggerConditions: {
    parameter: string;
    threshold: string;
    delay: string;
  }[];

  symptoms: string[];

  possibleCauses: {
    cause: string;
    likelihood: 'high' | 'medium' | 'low';
    verification: string;
    explanation: string;
  }[];

  diagnosticSteps: {
    step: number;
    action: string;
    tools: string[];
    expectedResult: string;
    ifFailed: string;
    safetyNote?: string;
  }[];

  resetSteps: {
    controller: string;
    steps: {
      step: number;
      instruction: string;
      keySequence?: string[];
      menuPath?: string[];
    }[];
  }[];

  repairSolutions: {
    solution: string;
    difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
    timeEstimate: string;
    partsNeeded: string[];
    toolsRequired: string[];
    procedureSteps: string[];
    costEstimate: { min: number; max: number; currency: string };
    warrantyImplications: string;
  }[];

  safetyWarnings: string[];
  preventionTips: string[];
  relatedCodes: string[];
  technicalSpecifications: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE FAULT CODE DATABASE - 4+ PARAGRAPH EXPLANATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPREHENSIVE_FAULT_CODES: Record<string, ComprehensiveFaultCode> = {

  // ════════════════════════════════════════════════════════════════
  // LOW OIL PRESSURE - Universal across all 9 controllers
  // ════════════════════════════════════════════════════════════════
  'LOW_OIL_PRESSURE': {
    id: 'LOW_OIL_PRESSURE',
    code: '190-0 / ALM-01 / E01 / F001',
    title: 'Low Engine Oil Pressure',
    controller: 'Universal',
    controllerModels: [
      'DSE 4510/4610/5110/7320/8610',
      'ComAp InteliLite/InteliGen',
      'Woodward EasyGen 3000/3500',
      'SmartGen HGM6100/9500',
      'CAT PowerWizard 1.0/2.0',
      'Datakom DKG-309/509/D-500',
      'Lovato RGK600/700/800',
      'Siemens SICAM/SENTRON',
      'ENKO GCU-100/200/300'
    ],
    severity: 'shutdown',
    category: 'Engine Protection',
    subcategory: 'Lubrication System',

    overview: `Low engine oil pressure is one of the most critical alarms in any generator control system, representing an immediate threat to engine integrity that requires instant protective action. When this alarm triggers, it indicates that the lubricating oil pressure has dropped below the minimum safe operating threshold established in the controller's protection parameters. The consequences of operating with insufficient oil pressure are catastrophic and irreversible - the engine can sustain terminal damage within 30 seconds to 2 minutes of continued operation. This is why all nine major controller brands (DSE, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, and ENKO) implement this as an immediate shutdown alarm with no override capability in standard configurations.

The fundamental purpose of engine oil extends far beyond simple lubrication. First and foremost, pressurized oil creates a hydrodynamic film between all moving metal surfaces - crankshaft main bearings, connecting rod bearings, camshaft journals, rocker arm assemblies, piston pins, and timing gear trains. This film prevents metal-to-metal contact even under extreme loads and speeds. Without adequate pressure (typically 25-65 PSI depending on engine speed and design), this film breaks down and friction increases exponentially. Second, the oil serves as a critical heat transfer medium, carrying heat away from hot spots like piston crowns and turbocharger bearings to the oil cooler or sump. Third, in many modern engines, oil pressure actuates hydraulic components including valve lifters, timing chain tensioners, and variable valve timing mechanisms. Fourth, the oil film between piston rings and cylinder walls maintains compression by sealing combustion gases.

When oil pressure drops below safe thresholds, all these functions fail simultaneously. The first components to suffer are typically the connecting rod bearings due to the extreme loads they experience during the power stroke. As these bearings begin to wipe (lose their bearing surface), metal particles contaminate the oil and rapidly propagate damage throughout the engine. The crankshaft journals score, main bearings fail, and within minutes the engine can seize completely. Even if the engine doesn't seize immediately, the damage to precision-machined surfaces makes a complete rebuild mandatory. Some insurers consider oil starvation damage to be operator negligence rather than a covered failure, making proper response to this alarm critical from both a mechanical and financial standpoint.

The alarm threshold settings vary by controller brand and engine application. DSE controllers typically trigger at 0.5-1.0 bar (7-15 PSI) with a 5-10 second delay to prevent false alarms during cranking when oil pressure is building. ComAp and Woodward use similar thresholds with configurable delays. SmartGen controllers often have separate low oil pressure warning and shutdown thresholds. CAT PowerWizard controllers integrate with CAT engine ECMs for precise oil pressure monitoring tied to engine speed. Datakom, Lovato, Siemens, and ENKO controllers all provide adjustable thresholds to match different engine requirements. Understanding your specific controller's settings is essential for proper diagnosis - the alarm may be genuine low pressure, or it may be a sensor/wiring fault causing false readings.`,

    technicalAnalysis: `The oil pressure system in a diesel generator engine operates on fundamental hydraulic principles that every technician must understand to effectively diagnose problems. The engine-driven oil pump, typically a gear-type or gerotor design mounted in the front cover or oil pan, draws oil from the sump through a pickup tube with a mesh screen. The pump pressurizes this oil and delivers it through the main oil gallery - a large-diameter passage drilled through the length of the engine block. From this main gallery, smaller passages branch off to feed the crankshaft main bearings, and from there oil travels through drilled passages in the crankshaft itself to supply the connecting rod bearings. Additional galleries feed the cylinder head for cam bearings and valve train components, and on turbocharged engines, dedicated lines supply the turbocharger bearings.

The system pressure is regulated by a pressure relief valve, typically located on the oil pump body or in the engine block near the pump outlet. This valve consists of a spring-loaded piston that opens when system pressure exceeds the spring's preset value (typically 65-85 PSI), redirecting excess oil back to the sump. This protects the system from overpressure at high engine speeds while ensuring adequate pressure at idle. If this relief valve sticks open or its spring weakens, maximum system pressure will be limited and low-pressure alarms may occur especially at idle or low speeds. Conversely, a stuck-closed relief valve can cause dangerously high pressures that may burst filters or blow out gaskets.

The oil pressure sender (also called sender unit or pressure transducer) that communicates with the generator controller is typically a variable-resistance device screwed into the main oil gallery or a port in the oil filter housing. As pressure increases, the internal mechanism moves a wiper across a resistive element, changing the electrical resistance. The controller interprets this resistance as a pressure value based on a calibration curve specific to the sender type. Common resistance ranges are 10-180 ohms (low pressure = high resistance) or 0-90 ohms (low pressure = low resistance) depending on manufacturer. A failed sender, corroded connector, or damaged wire can send false readings to the controller, triggering alarms when actual oil pressure is normal.

The oil itself plays a crucial role in system pressure. Oil viscosity (thickness) directly affects the pump's ability to develop pressure and the bearings' ability to maintain a hydrodynamic film. Cold, thick oil creates higher pressures but flows poorly to distant bearings. Hot, thin oil flows well but may not maintain adequate bearing clearances. Contaminated oil - whether diluted with fuel from injector leakage, contaminated with coolant from a head gasket failure, or simply degraded from extended service - loses its ability to maintain proper viscosity under all conditions. Oil that appears milky indicates coolant contamination and requires immediate attention. Oil that smells of diesel indicates fuel dilution and similarly requires investigation. Black, gritty oil suggests excessive wear particles are circulating through the system accelerating damage. All these conditions can contribute to low oil pressure conditions that trigger the alarm.`,

    diagnosticProcedure: `Effective diagnosis of a low oil pressure alarm requires a systematic approach that differentiates between actual low pressure (mechanical problem) and false readings (electrical problem). Never assume the alarm is false without verification - the cost of being wrong is an engine that costs more to rebuild than to replace. The diagnostic process should be performed with the engine stopped and cool whenever possible, and extreme caution should be exercised if the engine must be run during testing.

Begin by gathering information about the circumstances of the alarm. Was the engine running under load when it occurred? Had it been running for a long time (suggesting heat-related oil thinning) or did it happen shortly after a cold start (suggesting pump priming issues)? Was there any unusual noise from the engine immediately before shutdown - knocking, rumbling, or metallic sounds that might indicate bearing damage? Has this alarm occurred before? Has any recent maintenance been performed - oil change, filter replacement, or other work that might have introduced air into the system or disturbed connections? This background information helps prioritize the diagnostic steps.

The first physical check should always be the oil level. With the engine stopped and on level ground, wait at least 5 minutes for oil to drain back to the sump, then check the dipstick. The oil level should be between the MIN and MAX marks - many engines have problems if overfilled (aerated oil that foams and loses pressure) or underfilled (obvious). Note the oil's appearance: normal oil should be brown to black and translucent when spread thin, with appropriate viscosity for the temperature. Milky appearance indicates coolant contamination. Strong fuel smell indicates injector problems. Metallic glitter indicates severe wear. Any of these conditions requires further investigation regardless of level.

The definitive test for distinguishing between actual low pressure and sender/wiring faults is to install a mechanical oil pressure gauge directly in the engine's oil system. Remove the electrical oil pressure sender and install a calibrated mechanical gauge with appropriate fittings in its place. Start the engine (briefly if you suspect actual low pressure) and read the gauge at idle and at rated speed if possible. A healthy diesel engine should show 25-40 PSI (1.7-2.8 bar) at idle and 40-65 PSI (2.8-4.5 bar) at rated speed. If the mechanical gauge confirms low pressure, you have a mechanical problem - do not run the engine further until resolved. If the mechanical gauge shows normal pressure but the controller was reading low, you have an electrical problem with the sender, wiring, or controller input.

For electrical diagnosis, start with the oil pressure sender itself. Measure the resistance between the sender terminal and ground with the engine stopped (zero pressure) and compare to the manufacturer's specification - typically near the high end of the range (90-180 ohms for many types) at zero pressure. If you can apply known pressures with a hand pump, you can verify the sender tracks correctly across its range. A sender that reads incorrectly or intermittently should be replaced with an OEM or quality aftermarket part - cheap sensors are a common source of repeat problems. Inspect the wiring harness from sender to controller for damage, corrosion, chafing, or poor connections. A wire shorted to ground will read as low pressure on most systems. Check the controller's input by disconnecting the sender and measuring what the controller reads with the input open (should read high/infinite resistance) and with the input jumpered to ground (should read zero resistance). If the controller doesn't respond correctly to these tests, the controller input circuit may be damaged.`,

    resetProcedure: `Before attempting to reset a low oil pressure alarm, you MUST verify that actual oil pressure is now within safe operating parameters. Resetting this alarm and restarting the engine without correcting the underlying cause will result in catastrophic engine damage. This alarm exists specifically to prevent such damage, and the controller engineers designed it without easy bypass for good reason. Never reset this alarm based solely on "it might have been a false alarm" thinking - verify with measurements.

Once you have positively confirmed through mechanical gauge testing that oil pressure is adequate, or have corrected the cause of the actual low pressure condition, you can proceed with the reset procedure. The exact reset method varies by controller brand and model. For DeepSea (DSE) controllers, the typical procedure is: ensure engine is stopped, press and hold the STOP button for 3 seconds (this acknowledges the shutdown condition), then press the RESET button (or ALARM ACK/MUTE depending on model). On some DSE models, you may need to cycle through the alarm display using arrow keys and press RESET while the alarm is displayed. DSE 7000 and 8000 series controllers with touch screens may require accessing the Alarm List from the menu and selecting Clear All or Reset for the specific alarm.

For ComAp controllers (InteliLite, InteliGen, InteliSys series), access the alarm screen by pressing the ALARM or HORN button, navigate to the active alarm using the arrow keys, and press the RESET or ACK button. Some ComAp controllers require two sequential resets - one to acknowledge and one to clear. The InteliConfig or InteliMonitor software can also be used to remotely reset alarms if the controller is connected to a computer or network. Note that ComAp controllers may have "Final Attempt" logic that locks out restart after multiple consecutive failures - this requires accessing configuration settings to clear.

Woodward controllers (EasyGen 3000/3500, GCP-30) typically use a dedicated RESET button or menu navigation. Press MENU, navigate to ALARMS, select the active alarm, and choose RESET or CLEAR. The Load Share (LS-5) panels may require resetting from the master controller. CAT PowerWizard controllers follow similar logic but may also require resetting faults through the engine ECM using CAT Electronic Technician (CAT ET) software for certain alarm classes. SmartGen controllers (HGM series) usually have a RESET button that clears acknowledged alarms when pressed after the fault condition has cleared. Datakom controllers (DKG series, D-series) use the RESET button or menu-based clearing similar to DSE. Lovato controllers access resets through their programming software or front panel buttons. Siemens protection devices require specialized software (DIGSI) for configuration and alarm management. ENKO controllers typically use straightforward button-based reset sequences documented in their manuals.

After resetting the alarm and before starting the engine, perform a pre-start inspection: verify oil level is correct, visually inspect for leaks, and if possible, pre-prime the oil system using the engine's priming pump (if equipped) or by cranking the engine briefly with the fuel shutoff closed or injectors disabled. When you start the engine, watch the oil pressure reading immediately - it should climb to at least 15-20 PSI within 5-10 seconds of starting. If pressure doesn't build quickly, shut down immediately and do not attempt further starts until the cause is identified. Monitor the system closely for the first several minutes of operation to ensure pressure remains stable and the alarm doesn't recur.`,

    solutionGuide: `The appropriate solution for a low oil pressure condition depends entirely on correctly diagnosing the root cause. The repair difficulty ranges from adding a quart of oil (anyone can do it) to replacing the oil pump (requires significant engine disassembly) or even rebuilding the engine (major undertaking). Always start with the simplest and most common causes before assuming the worst - but also don't ignore evidence of serious problems just because you hope it's something simple.

For low oil level issues - the most common cause of this alarm - the immediate fix is simply adding the correct grade of oil until the dipstick reads between MIN and MAX marks. However, this is treating the symptom, not the disease. You must investigate WHY the oil level was low. Check for external leaks at all gaskets (valve cover, oil pan, front cover, rear main seal), at all sensors and fittings, at the oil filter and cooler, and anywhere oil lines run. Check for internal consumption: blue-white exhaust smoke indicates oil burning past rings or valve seals; dropping coolant level without visible leaks may indicate head gasket failure allowing oil to enter coolant passages. Monitor the oil level over subsequent operating hours to establish consumption rate.

For oil pressure sender or wiring faults, replacement is straightforward but quality matters. Always use OEM or quality aftermarket senders - the cheapest options often have incorrect calibration or short service life. When installing, use appropriate thread sealant (not Teflon tape which can contaminate the oil system if it enters the engine), and don't overtighten - these senders are often brass and easily damaged. After replacement, verify the controller reads correctly by comparison with a mechanical gauge. For wiring faults, repair or replace damaged sections using marine-grade tinned wire and weatherproof connectors. Ensure proper grounding - a floating ground can cause erratic readings.

For degraded oil conditions, the solution is an oil and filter change using manufacturer-specified products. However, also investigate the cause of degradation. Fuel dilution (oil smells like diesel) indicates injector problems, failed injection pump seals, or frequent short-cycle operation that doesn't allow the engine to reach proper operating temperature. Coolant contamination (milky oil) indicates head gasket failure, cracked head or block, or failed oil cooler. These underlying causes must be addressed or the new oil will quickly degrade. For engines with severely contaminated oil, consider an engine flush product or multiple oil changes at short intervals to ensure all contaminated oil is removed.

For mechanical failures - failed oil pump, stuck relief valve, worn bearings - repairs become progressively more involved. A stuck or weak relief valve can sometimes be cleaned and reinstalled, but replacement is recommended. Oil pump replacement typically requires oil pan removal and possibly front cover removal depending on engine design. This is a moderate to advanced repair requiring proper tools and knowledge. Worn bearings indicate serious engine wear and are not repairable without major disassembly. A bearing knock, especially one that varies with engine speed and load, indicates the engine needs overhaul or replacement. At this point, get a detailed assessment of the engine's condition before investing in repairs - it may be more economical to install a remanufactured long block than to rebuild the existing engine.`,

    preventionStrategy: `Preventing low oil pressure problems begins with establishing and following a rigorous maintenance schedule based on the engine manufacturer's recommendations - or more frequent intervals in harsh operating conditions. This includes regular oil and filter changes, oil level checks, and periodic oil analysis to catch developing problems before they cause failures.

Oil level monitoring should be part of every pre-start inspection and weekly at minimum for continuously operating generators. Train all operators to check oil level correctly: engine stopped, on level ground, wait for oil to drain back (5 minutes minimum), wipe dipstick, insert fully, remove and read. The level should be between MIN and MAX - overfilling is almost as bad as underfilling as it causes foaming and aeration that reduces effective pressure. Log oil additions to track consumption rate over time - gradually increasing consumption indicates developing wear.

Oil and filter changes should follow manufacturer intervals for normal duty service, but be shortened for generators operating in dusty environments, extreme temperatures, with frequent short-cycle starts, or with load factors above 70%. Most diesel generator engines specify 250-500 hour oil change intervals, with filters changed at every oil change. Use only the specified oil grade (typically 15W-40 or 10W-30 for diesel generators) from reputable brands meeting appropriate specifications (API CK-4, ACEA E9, etc.). Never mix different oil types or brands unless specifically approved. Always use genuine or quality equivalent filters - cheap filters may have inferior media or bypass valves that allow unfiltered oil to circulate.

Oil analysis provides early warning of developing problems. Send samples at regular intervals (typically every oil change or every 500 hours) to a qualified laboratory. They will test for wear metals (iron, copper, lead, aluminum indicating component wear), contamination (silicon from dirt ingestion, sodium/potassium from coolant, fuel dilution), and oil condition (viscosity, oxidation, nitration, acid/base number). Establishing baseline values for your specific engine allows trending that can detect abnormal wear long before it causes low pressure or other symptoms. Many suppliers offer subscription programs that make this affordable even for single generators.

Finally, respond promptly to any oil-related warning signs: oil leaks, unusual oil consumption, changes in oil appearance or smell, abnormal noises from the engine, or occasional low pressure warnings that self-clear. These early indicators often precede failure by days or weeks - enough time to schedule repairs that prevent more serious damage. Never ignore a low oil pressure alarm as "probably just a sensor" without verification, and never reset and restart without understanding why the alarm occurred.`,

    triggerConditions: [
      { parameter: 'Oil Pressure', threshold: '< 0.5-1.5 bar (7-22 PSI) depending on controller', delay: '5-15 seconds after start' },
      { parameter: 'Engine RPM', threshold: 'Must be above crank/idle speed for alarm to be valid', delay: 'Instant validation' },
    ],

    symptoms: [
      'Oil pressure warning light illuminated',
      'Low oil pressure reading on controller display',
      'Engine shutdown with alarm code displayed',
      'Knocking or rumbling noise from engine (if bearing damage)',
      'Oil warning horn sounding',
      'Visible oil leaks under engine',
      'Blue/white exhaust smoke (oil burning)',
      'Oil level low on dipstick',
    ],

    possibleCauses: [
      {
        cause: 'Low oil level in sump',
        likelihood: 'high',
        verification: 'Check dipstick with engine stopped and level',
        explanation: 'Insufficient oil means pump may draw air or cavitate, causing pressure drop'
      },
      {
        cause: 'Faulty oil pressure sender',
        likelihood: 'high',
        verification: 'Compare controller reading with mechanical gauge',
        explanation: 'Sender internal failure or incorrect calibration causes false low readings'
      },
      {
        cause: 'Wiring fault to sender',
        likelihood: 'medium',
        verification: 'Inspect wiring, check continuity and resistance to ground',
        explanation: 'Damaged wire, poor connection, or short to ground mimics low pressure'
      },
      {
        cause: 'Degraded or incorrect oil viscosity',
        likelihood: 'medium',
        verification: 'Check oil condition, verify grade, review change history',
        explanation: 'Thin oil from overheating, dilution, or wrong grade cannot maintain pressure'
      },
      {
        cause: 'Clogged oil filter',
        likelihood: 'medium',
        verification: 'Replace filter, note pressure change before/after',
        explanation: 'Severely restricted filter forces oil through bypass, reducing system pressure'
      },
      {
        cause: 'Failed oil pump',
        likelihood: 'low',
        verification: 'Mechanical gauge test, pump inspection if accessible',
        explanation: 'Worn gears, broken drive, or failed relief valve prevents pressure generation'
      },
      {
        cause: 'Worn engine bearings',
        likelihood: 'low',
        verification: 'Listen for knocking, check oil for metal particles',
        explanation: 'Excessive clearance allows oil to escape faster than pump can supply'
      },
      {
        cause: 'Stuck-open relief valve',
        likelihood: 'low',
        verification: 'Inspect relief valve if accessible, check spring tension',
        explanation: 'Oil bypasses back to sump instead of building system pressure'
      },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Check engine oil level using dipstick',
        tools: ['Clean rag', 'Flashlight', 'Correct grade engine oil if needed'],
        expectedResult: 'Oil level between MIN and MAX marks, oil appears normal',
        ifFailed: 'Add oil to MAX level if low. If contaminated (milky, smells of fuel), do not run - investigate further.',
        safetyNote: 'Engine must be stopped for at least 5 minutes for accurate reading'
      },
      {
        step: 2,
        action: 'Install mechanical oil pressure gauge for verification',
        tools: ['Mechanical oil pressure gauge 0-100 PSI', 'Appropriate adapter fittings', 'Thread sealant', 'Wrenches'],
        expectedResult: 'At idle: 25-40 PSI (1.7-2.8 bar). At rated speed: 40-65 PSI (2.8-4.5 bar)',
        ifFailed: 'Low on mechanical gauge = mechanical problem. Normal on mechanical gauge = electrical problem.',
        safetyNote: 'Run engine briefly only - stop immediately if pressure doesn\'t build'
      },
      {
        step: 3,
        action: 'Test oil pressure sender resistance (if electrical fault suspected)',
        tools: ['Multimeter', 'Manufacturer resistance specifications'],
        expectedResult: 'Resistance varies with pressure per spec (typically 10-180 ohms)',
        ifFailed: 'Replace sender if readings incorrect or erratic',
        safetyNote: 'Disconnect battery before removing sender wiring'
      },
      {
        step: 4,
        action: 'Inspect sender wiring from engine to controller',
        tools: ['Multimeter', 'Wiring diagram', 'Inspection light'],
        expectedResult: 'Continuity from controller terminal to sender, no shorts to ground, connections clean',
        ifFailed: 'Repair damaged wiring, clean or replace corroded connectors',
        safetyNote: 'Check for pinched wires near moving parts or hot surfaces'
      },
      {
        step: 5,
        action: 'Verify oil condition and filter status',
        tools: ['Oil sample container', 'New filter', 'Drain pan'],
        expectedResult: 'Oil clean and correct viscosity, filter not clogged or bypassing',
        ifFailed: 'Change oil and filter, send sample for analysis if contamination suspected',
        safetyNote: 'Hot oil causes severe burns - allow engine to cool first'
      },
      {
        step: 6,
        action: 'Inspect for oil leaks',
        tools: ['Flashlight', 'Mirror', 'UV dye and light if needed'],
        expectedResult: 'No visible leaks at any gasket, seal, or connection',
        ifFailed: 'Repair leaks - tighten connections, replace gaskets/seals as needed',
        safetyNote: 'Oil on hot exhaust components is a fire hazard'
      },
    ],

    resetSteps: [
      {
        controller: 'DSE (DeepSea Electronics) - All Models',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal (use mechanical gauge if any doubt)' },
          { step: 2, instruction: 'Ensure engine is stopped' },
          { step: 3, instruction: 'Press and hold STOP button for 3 seconds to acknowledge shutdown', keySequence: ['STOP (hold 3s)'] },
          { step: 4, instruction: 'Press RESET button (or ALARM ACK on older models)', keySequence: ['RESET'] },
          { step: 5, instruction: 'For DSE 7000/8000 series: MENU → Alarms → Clear All', menuPath: ['MENU', 'Alarms', 'Clear All'] },
        ]
      },
      {
        controller: 'ComAp - InteliLite, InteliGen, InteliSys',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press ALARM or HORN button to access alarm list', keySequence: ['ALARM'] },
          { step: 3, instruction: 'Use arrow keys to highlight the active alarm', keySequence: ['↑/↓'] },
          { step: 4, instruction: 'Press RESET or ACK button', keySequence: ['RESET'] },
          { step: 5, instruction: 'Some models require second reset press to clear', keySequence: ['RESET'] },
        ]
      },
      {
        controller: 'Woodward - EasyGen 3000/3500, GCP-30',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press MENU button', keySequence: ['MENU'] },
          { step: 3, instruction: 'Navigate to ALARMS using arrow keys', menuPath: ['MENU', 'ALARMS'] },
          { step: 4, instruction: 'Select active alarm and press RESET/CLEAR', keySequence: ['ENTER', 'RESET'] },
        ]
      },
      {
        controller: 'SmartGen - HGM6100, HGM9500 Series',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Wait for alarm condition to clear from inputs' },
          { step: 3, instruction: 'Press RESET button firmly', keySequence: ['RESET'] },
          { step: 4, instruction: 'Alarm should clear - if not, check AUTO/MANUAL mode' },
        ]
      },
      {
        controller: 'CAT PowerWizard 1.0/2.0',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press CLEAR ALARM button', keySequence: ['CLEAR ALARM'] },
          { step: 3, instruction: 'For ECM-related faults, connect CAT ET software' },
          { step: 4, instruction: 'Navigate to Diagnostics → Active Codes → Clear', menuPath: ['Diagnostics', 'Active Codes', 'Clear'] },
        ]
      },
      {
        controller: 'Datakom - DKG-309, DKG-509, D-500 Series',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press and hold RESET button for 2 seconds', keySequence: ['RESET (hold 2s)'] },
          { step: 3, instruction: 'For D-500: MENU → ALARMS → RESET', menuPath: ['MENU', 'ALARMS', 'RESET'] },
        ]
      },
      {
        controller: 'Lovato - RGK600, RGK700, RGK800 Series',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press ESC to access main screen', keySequence: ['ESC'] },
          { step: 3, instruction: 'Press and hold STOP for 3 seconds', keySequence: ['STOP (hold 3s)'] },
          { step: 4, instruction: 'Press RESET button', keySequence: ['RESET'] },
        ]
      },
      {
        controller: 'Siemens - SICAM, SENTRON PAC',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Connect DIGSI software for SICAM devices' },
          { step: 3, instruction: 'Navigate to Fault Records → Clear', menuPath: ['Fault Records', 'Clear'] },
          { step: 4, instruction: 'For SENTRON: Press RESET on front panel', keySequence: ['RESET'] },
        ]
      },
      {
        controller: 'ENKO - GCU-100, GCU-200, GCU-300',
        steps: [
          { step: 1, instruction: 'Verify oil pressure is now normal' },
          { step: 2, instruction: 'Press STOP button to acknowledge', keySequence: ['STOP'] },
          { step: 3, instruction: 'Press RESET button to clear alarm', keySequence: ['RESET'] },
          { step: 4, instruction: 'Check LED indicators confirm cleared status' },
        ]
      },
    ],

    repairSolutions: [
      {
        solution: 'Add Engine Oil to Correct Level',
        difficulty: 'easy',
        timeEstimate: '10-15 minutes',
        partsNeeded: ['Engine oil - correct grade per manufacturer (typically 15W-40 or 10W-30)', 'Funnel'],
        toolsRequired: ['Dipstick', 'Clean rag', 'Oil pour spout or funnel'],
        procedureSteps: [
          'Ensure engine has been stopped for at least 5 minutes',
          'Locate and remove dipstick, wipe clean',
          'Reinsert dipstick fully, remove and read oil level',
          'If below MIN mark, remove oil filler cap',
          'Add oil in 0.5 liter increments using funnel',
          'Wait 2 minutes between additions for oil to drain to sump',
          'Check dipstick after each addition',
          'Stop adding when level reaches MAX mark - do not overfill',
          'Replace oil filler cap securely',
          'Start engine and verify oil pressure is normal',
          'Check for leaks at filter, drain plug, and gaskets',
        ],
        costEstimate: { min: 500, max: 3000, currency: 'KES' },
        warrantyImplications: 'Low oil level may indicate neglect affecting warranty - document cause'
      },
      {
        solution: 'Replace Oil Pressure Sender',
        difficulty: 'easy',
        timeEstimate: '20-45 minutes',
        partsNeeded: ['OEM or quality aftermarket oil pressure sender', 'Thread sealant (Loctite 545 or equivalent)', 'Small amount of engine oil'],
        toolsRequired: ['Appropriate wrench (typically 22-27mm)', 'Wire brush', 'Multimeter', 'Clean rags', 'Small container for oil spillage'],
        procedureSteps: [
          'Disconnect battery negative terminal',
          'Locate oil pressure sender on engine (usually near oil filter or on main gallery)',
          'Place container to catch oil spillage',
          'Disconnect electrical connector from sender',
          'Use appropriate wrench to remove sender - expect some oil to spill',
          'Inspect old sender for damage or contamination',
          'Clean threads in engine block with wire brush',
          'Apply thread sealant to new sender threads (2-3 threads from tip)',
          'Install new sender hand-tight, then 1/4 to 1/2 turn with wrench - do not overtighten',
          'Reconnect electrical connector - ensure positive engagement',
          'Reconnect battery',
          'Check oil level and top up if needed (for spilled oil)',
          'Start engine and verify pressure reading is normal',
          'Compare reading to mechanical gauge if available',
        ],
        costEstimate: { min: 2000, max: 8000, currency: 'KES' },
        warrantyImplications: 'Sender replacement typically does not affect warranty'
      },
      {
        solution: 'Complete Oil and Filter Change',
        difficulty: 'easy',
        timeEstimate: '45-90 minutes',
        partsNeeded: ['Engine oil - full capacity per manufacturer (typically 12-25 liters for generators)', 'Oil filter - OEM or quality equivalent', 'Drain plug washer/gasket', 'Rags and absorbent material'],
        toolsRequired: ['Drain pan (capacity larger than engine oil capacity)', 'Socket set with extension', 'Oil filter wrench', 'Torque wrench', 'Funnel', 'Safety glasses', 'Nitrile gloves'],
        procedureSteps: [
          'Run engine to operating temperature (oil drains more completely when warm)',
          'Position drain pan under oil sump drain plug',
          'Remove drain plug and allow oil to drain completely - minimum 15 minutes',
          'While draining, remove old oil filter using filter wrench',
          'Clean oil filter mounting surface thoroughly',
          'Apply thin film of new oil to new filter gasket',
          'Install new filter hand-tight plus 3/4 turn - do not use wrench',
          'Inspect drain plug and washer - replace washer if damaged',
          'Install drain plug with new washer, torque to specification (typically 25-40 Nm)',
          'Remove drain pan and clean any spills',
          'Remove oil filler cap and fill with new oil to specified capacity',
          'Install filler cap',
          'Start engine and run for 2-3 minutes',
          'Stop engine and wait 5 minutes',
          'Check oil level and top up to MAX mark',
          'Check for leaks at filter and drain plug',
          'Record service in maintenance log with date, hours, and oil used',
        ],
        costEstimate: { min: 5000, max: 25000, currency: 'KES' },
        warrantyImplications: 'Regular oil changes required to maintain warranty - keep records'
      },
      {
        solution: 'Replace Oil Pump Assembly',
        difficulty: 'advanced',
        timeEstimate: '6-12 hours',
        partsNeeded: ['Oil pump assembly', 'Oil pump pickup tube and screen', 'Oil pan gasket', 'Front cover gasket (if applicable)', 'RTV sealant', 'New engine oil and filter'],
        toolsRequired: ['Complete socket and wrench set', 'Torque wrench', 'Engine crane or support', 'Gasket scraper', 'Cleaning solvent', 'Priming tool or drill', 'Service manual'],
        procedureSteps: [
          'Drain engine oil completely',
          'Disconnect battery and tag all removed components',
          'Remove components blocking access (belts, pulleys, brackets)',
          'Support engine if required to remove mount',
          'Remove oil pan bolts in reverse of torque sequence',
          'Carefully lower oil pan - may need to rotate crankshaft for clearance',
          'Remove oil pump pickup tube',
          'Remove oil pump mounting bolts',
          'Remove old oil pump - note orientation and drive engagement',
          'Clean all mating surfaces thoroughly',
          'Prime new oil pump by filling with oil and rotating',
          'Install new pump with new gasket, torque bolts to spec',
          'Install new pickup tube - ensure screen is not damaged',
          'Clean oil pan and inspect for damage',
          'Install oil pan with new gasket, torque in specified sequence',
          'Reinstall all removed components',
          'Fill with new oil',
          'Prime oil system - crank without starting if possible',
          'Start engine and verify immediate oil pressure',
          'Check for leaks at all gaskets',
        ],
        costEstimate: { min: 35000, max: 120000, currency: 'KES' },
        warrantyImplications: 'Major repair - document thoroughly, may require factory inspection for warranty'
      },
    ],

    safetyWarnings: [
      'NEVER operate engine with confirmed low oil pressure - catastrophic damage occurs within minutes',
      'NEVER reset alarm and restart without verifying actual oil pressure with mechanical gauge',
      'Hot engine oil causes severe burns - allow engine to cool before service',
      'Used motor oil is carcinogenic - wear gloves and avoid skin contact',
      'Properly dispose of used oil at authorized collection facility - illegal to dump',
      'Ensure engine cannot start accidentally while working underneath',
      'Support engine securely before removing oil pan on engines with pan-mounted mounts',
      'Oil on hot exhaust manifold is a fire hazard - clean up spills immediately',
    ],

    preventionTips: [
      'Check oil level before every start or at least weekly',
      'Change oil and filter at manufacturer-recommended intervals (typically 250-500 hours)',
      'Use only manufacturer-specified oil grade and quality level',
      'Send oil samples for analysis every 250-500 hours to detect wear trends',
      'Address any oil leaks promptly - small leaks become big problems',
      'Install permanent mechanical oil pressure gauge for real-time monitoring',
      'Keep quality spare oil pressure sender on site for quick replacement',
      'Log all oil additions to track consumption trends',
      'Investigate any unusual oil consumption, color, or smell immediately',
      'Pre-start inspection should include visual check under engine for fresh leaks',
    ],

    relatedCodes: ['190-1 (Oil Pressure Low Warning)', '190-2 (Oil Pressure Sensor Fault)', '100-3 (Oil Temp High)', '100-4 (Oil Filter Differential)', '111-0 (Coolant Level Low)'],

    technicalSpecifications: {
      'Normal Idle Pressure': '25-40 PSI (1.7-2.8 bar)',
      'Normal Running Pressure': '40-65 PSI (2.8-4.5 bar)',
      'Typical Alarm Threshold': '10-15 PSI (0.7-1.0 bar)',
      'Alarm Delay': '5-15 seconds after engine start',
      'Sender Type': 'Variable resistance 10-180 ohms typical',
      'Oil Change Interval': '250-500 hours or annually',
      'Oil Capacity Range': '12-45 liters depending on engine size',
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getComprehensiveFaultCode(codeId: string): ComprehensiveFaultCode | undefined {
  return COMPREHENSIVE_FAULT_CODES[codeId];
}

export function getAllComprehensiveFaultCodes(): ComprehensiveFaultCode[] {
  return Object.values(COMPREHENSIVE_FAULT_CODES);
}

export function searchComprehensiveFaultCodes(query: string): ComprehensiveFaultCode[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(COMPREHENSIVE_FAULT_CODES).filter(code =>
    code.title.toLowerCase().includes(lowerQuery) ||
    code.code.toLowerCase().includes(lowerQuery) ||
    code.overview.toLowerCase().includes(lowerQuery) ||
    code.category.toLowerCase().includes(lowerQuery)
  );
}
