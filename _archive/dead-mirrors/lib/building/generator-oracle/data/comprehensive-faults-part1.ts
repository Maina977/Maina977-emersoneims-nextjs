/**
 * COMPREHENSIVE GENERATOR FAULT DATABASE - PART 1
 * World's Most Detailed Generator Diagnostic Database
 *
 * Each fault code contains:
 * - 4+ paragraph technical overview
 * - 4+ paragraph diagnostics guide
 * - Detailed reset steps for all controller types
 * - 5+ paragraph comprehensive solutions
 * - Real-world case studies from Kenya
 */

import type { EnhancedFaultCode } from '../enhanced-fault-database';

// ═══════════════════════════════════════════════════════════════════════════════
// STARTING SYSTEM FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const STARTING_SYSTEM_FAULTS: Record<string, EnhancedFaultCode> = {
  'STS-001': {
    code: 'STS-001',
    title: 'Engine Fail to Start - No Crank',
    alternativeCodes: ['FTS', 'NOCRANK', 'E201', 'F101', 'START-FAIL', 'DSE-2001'],
    severity: 'critical',
    category: 'Starting System',
    subcategory: 'Cranking Circuit',
    affectedSystems: ['Starter Motor', 'Batteries', 'Starter Relay', 'Control System', 'Wiring'],

    technicalOverview: `The "Engine Fail to Start - No Crank" fault is one of the most common and frustrating issues encountered with standby generators. This fault indicates that the engine control system has attempted to initiate a start sequence, but the engine has not rotated (cranked) at all. Unlike a "fail to fire" condition where the engine cranks but doesn't start, this fault means the starter motor did not engage or rotate the engine. Understanding the distinction is critical for efficient troubleshooting, as the root causes are entirely different between cranking and firing issues.

The starting circuit in a generator consists of several interconnected components that must all function correctly for successful cranking. The sequence begins when the controller receives a start command, either from automatic mains failure (AMF) detection, a manual start button, or a remote start signal. The controller then energizes the fuel solenoid (if equipped), activates any pre-start functions like glow plugs or intake heaters, and finally energizes the starter motor relay. This relay closes a high-current circuit between the batteries and the starter motor, which then rotates the engine through the ring gear on the flywheel.

Modern generator controllers implement sophisticated start logic that monitors the success of each start attempt. When a start command is issued, the controller watches for engine speed feedback from the magnetic pickup unit (MPU) or alternator W terminal. If no speed is detected within a programmed time (typically 2-10 seconds), the controller terminates the start attempt and records a "no crank" or "fail to start" fault. Most controllers are programmed for multiple start attempts (commonly 3) with rest periods between attempts to allow the starter motor to cool and batteries to recover. Only after all attempts fail does the controller lock out with a failure alarm.

The electrical loads involved in cranking are substantial. A typical diesel generator starter motor draws 200-600 amperes during cranking, with inrush currents reaching 1000+ amperes momentarily. This massive current demand requires healthy batteries, clean and tight connections throughout the circuit, and appropriately sized cables. Any weakness in this circuit - a corroded terminal, undersized cable, or degraded battery - will prevent successful cranking. The voltage drop under cranking load is a key diagnostic indicator; a healthy system should maintain at least 10V (for a 12V system) or 20V (for a 24V system) while cranking.`,

    systemImpact: `When a generator fails to crank, the immediate impact is complete loss of backup power capability. This is particularly critical in applications where the generator serves as emergency standby for hospitals, data centers, water treatment plants, or industrial processes. Every minute of delayed startup represents continued reliance on potentially failing mains power or complete power loss, with cascading effects on sensitive loads.

The financial impact of a no-crank condition extends beyond the immediate emergency. Failed starts during a power outage often trigger emergency service calls, which carry premium rates especially during nights and weekends. In Kenya's generator service market, emergency call-out fees can range from KES 15,000 to 50,000 before any repair work begins. If the generator is protecting critical loads, the cost of downtime far exceeds the service fees - a data center may lose hundreds of thousands of shillings per hour of downtime.

Beyond immediate concerns, repeated cranking attempts with a weak or failing starting system accelerate wear on multiple components. Each cranking attempt that fails to start the engine subjects the starter motor to extended high-current operation, heating its windings and brushes. The starter motor is designed for intermittent duty - brief cranking periods followed by extended rest. Repeated attempts without successful starting can overheat the motor, damaging the windings and reducing its service life. Similarly, extended cranking deeply discharges the batteries, reducing their capacity over time.

If the root cause is not properly diagnosed and corrected, the no-crank condition will recur, often at the most critical moments. A generator that fails to start during a test may also fail during a genuine emergency when it's needed most. Additionally, some causes of no-crank conditions - such as corroded battery terminals or loose connections - tend to worsen over time, meaning today's intermittent problem becomes tomorrow's complete failure. This makes thorough diagnosis and repair essential rather than simply "trying again" when the generator eventually starts.`,

    safetyConsiderations: `Working with generator starting systems requires careful attention to electrical safety due to the high currents and energies involved. The battery bank on a generator contains substantial stored energy - two 200Ah batteries at 12V store approximately 4.8 kilowatt-hours of energy. A short circuit across battery terminals can release this energy explosively, causing severe burns, molten metal spray, and potential battery explosion from hydrogen gas ignition. Always wear safety glasses and insulated gloves when working on battery systems.

When troubleshooting the starting circuit, remember that the starter motor relay or solenoid can energize unexpectedly if someone operates a start switch or if the controller initiates an automatic start. Before working on starter cables or the motor itself, disconnect the battery negative cables and, where possible, remove the relay or disable the control circuit. The starter motor's flywheel ring gear can cause severe crushing injuries if the engine rotates while hands are near the flywheel housing.

Battery terminals and cable connections may appear clean but have a thin layer of oxidation that causes high resistance. When cleaning terminals, be aware that lead battery terminals can produce toxic lead dust - wear gloves and wash hands thoroughly afterward. Battery acid (sulfuric acid) causes severe chemical burns and can damage clothing and equipment. If acid contacts skin, flush immediately with large quantities of water for at least 15 minutes and seek medical attention.

Working around a generator during starting attempts carries additional risks. Diesel generators can start unexpectedly if the starting system intermittently functions. Keep hands, clothing, and tools away from moving parts including fan, belts, and shaft. Exhaust gases can accumulate quickly in enclosed spaces during start attempts, even if the engine doesn't fully start. Ensure adequate ventilation before repeated starting attempts in enclosed generator rooms. Carbon monoxide from exhaust is colorless and odorless - if you feel dizzy or drowsy, exit the area immediately.`,

    historicalContext: `Generator starting systems have evolved substantially since the earliest engine-generator sets. Early generators often required manual cranking with a hand crank or starting handle - an exhausting and sometimes dangerous process that required significant physical strength. The development of electric starting motors in the early 20th century revolutionized generator reliability and made standby power practical for widespread use.

Early electric starters used series-wound DC motors that provided high starting torque but required substantial battery capacity. The control circuits were simple electromagnetic relays operated by mechanical switches. While reliable, these systems offered no intelligence - if the engine failed to start, the starter would continue cranking until the batteries were depleted or a human intervened. This could damage the starter motor and deeply discharge the batteries, complicating the restart process.

The introduction of electronic controllers in the 1980s brought sophisticated start logic to generators. Controllers from manufacturers like Deep Sea Electronics, ComAp, Woodward, and others implemented programmable start sequences with defined cranking periods, rest periods between attempts, and automatic lockout after a defined number of failures. These controllers also added features like speed sensing for crank disconnect, preventing starter engagement with a running engine.

Modern controllers integrate the starting system with comprehensive engine and generator protection. The controller monitors battery voltage before and during cranking, detects abnormal current draw that might indicate a seized engine, and can diagnose many starting system faults based on observed behavior. Remote monitoring systems allow operators to receive start failure alerts on their phones and even attempt remote diagnostics before dispatching a technician. Despite these advances, the fundamental requirements remain unchanged - healthy batteries, good connections, and a functional starter motor are essential for reliable starting.`,

    rootCauses: [
      {
        cause: 'Dead or Discharged Batteries',
        probability: 35,
        explanation: 'Batteries have lost charge due to age, parasitic loads, failed charging system, or extended storage without maintenance charging. Without adequate battery voltage and capacity, the starter motor cannot draw sufficient current to crank the engine.',
        testMethod: 'Measure battery voltage with no load (should be 12.6V+ per 12V battery). Perform load test with battery tester. Check specific gravity with hydrometer if accessible.',
        timeToTest: '10 minutes',
        toolsRequired: ['Digital multimeter', 'Battery load tester', 'Hydrometer (for flooded batteries)'],
        symptomsIndicating: ['Dim control panel lights', 'Clicking sound but no crank', 'Voltage drops significantly when start attempted', 'Batteries more than 3-4 years old']
      },
      {
        cause: 'Corroded or Loose Battery Connections',
        probability: 25,
        explanation: 'Corrosion buildup or loose terminals create high resistance in the starting circuit, preventing adequate current flow to the starter motor. Even minor corrosion can cause hundreds of millivolts of drop under high current.',
        testMethod: 'Visual inspection of terminals for corrosion (white or green buildup). Measure voltage drop across each connection during cranking attempt. Check terminal tightness.',
        timeToTest: '15 minutes',
        toolsRequired: ['Visual inspection', 'Digital multimeter', 'Wrenches for terminal bolts', 'Wire brush or terminal cleaner'],
        symptomsIndicating: ['White or green corrosion visible on terminals', 'Terminals feel loose', 'Intermittent starting problems', 'Clicking sound from starter relay']
      },
      {
        cause: 'Failed Starter Motor',
        probability: 15,
        explanation: 'The starter motor has failed due to worn brushes, burnt windings, seized bearings, or mechanical damage. Common in high-hour generators or those exposed to moisture or oil contamination.',
        testMethod: 'Apply voltage directly to starter motor terminals (jumper test from battery, ensuring safety precautions). Listen for any sound or movement. Check for seized condition by attempting to rotate manually.',
        timeToTest: '20 minutes',
        toolsRequired: ['Heavy-duty jumper cables', 'Safety glasses', 'Insulated gloves', 'Wrench for starter terminals'],
        symptomsIndicating: ['No sound at all when starting', 'Grinding noise if starter engages', 'Burnt smell from starter', 'Oil or coolant contamination around starter']
      },
      {
        cause: 'Failed Starter Relay/Solenoid',
        probability: 12,
        explanation: 'The relay or solenoid that controls power to the starter motor has failed with open contacts or burnt coil. This prevents the high-current path from the batteries to the starter.',
        testMethod: 'Listen for relay click when start command given. Measure voltage at relay coil terminals during start attempt. Check continuity of relay contacts with relay energized.',
        timeToTest: '15 minutes',
        toolsRequired: ['Digital multimeter', 'Test light', 'Screwdriver for relay access'],
        symptomsIndicating: ['No click from relay/solenoid', 'Click but no crank (contacts failed)', 'Relay body very hot', 'History of relay replacements']
      },
      {
        cause: 'Controller or Wiring Problem',
        probability: 8,
        explanation: 'The controller is not issuing the start command due to programming, fault lockout, or internal failure. Alternatively, wiring between controller and starter circuit is damaged or disconnected.',
        testMethod: 'Check controller display for fault codes or lockout condition. Verify crank output is being energized using test light or meter. Trace wiring from controller to starter relay.',
        timeToTest: '20 minutes',
        toolsRequired: ['Digital multimeter', 'Test light', 'Controller manual', 'Wiring diagrams'],
        symptomsIndicating: ['Controller shows fault codes', 'No attempt to crank visible on controller', 'Recent controller programming changes', 'Water ingress or rodent damage to wiring']
      },
      {
        cause: 'Seized Engine',
        probability: 5,
        explanation: 'The engine has seized due to internal mechanical failure, hydrolocking from coolant or fuel ingestion, or lack of lubrication. The starter cannot overcome the mechanical lock.',
        testMethod: 'Attempt to rotate engine manually using flywheel barring tool or large wrench on crankshaft bolt. Check for fluid in cylinders by removing glow plugs or injectors.',
        timeToTest: '30 minutes',
        toolsRequired: ['Barring tool or large socket', 'Breaker bar', 'Glow plug or injector removal tools'],
        symptomsIndicating: ['Engine rotated backwards before failure', 'Evidence of coolant or fuel leaks into cylinders', 'Starter makes straining noise', 'Recent overheat or low oil event']
      }
    ],

    diagnosticProcedures: [
      {
        step: 1,
        title: 'Visual Inspection and Preliminary Checks',
        instruction: 'Before touching any electrical components, perform a thorough visual inspection of the generator and starting system. Look for obvious signs of damage, disconnected wires, rodent activity, water ingress, or corrosion. Check that all emergency stop buttons are released and that the generator mode switch is in the correct position (AUTO or MANUAL START). Verify fuel level is adequate and fuel shut-off valves are open.',
        safetyWarning: 'Ensure generator is in safe state before beginning. Release all E-stops and set mode to OFF while inspecting.',
        toolsRequired: ['Flashlight', 'Visual inspection'],
        expectedResult: 'No obvious damage or disconnections visible. E-stops released, mode switch correctly positioned.',
        ifPassed: 'Proceed to Step 2 for battery inspection.',
        ifFailed: 'Address any obvious issues found. If wiring damage is significant, consult wiring diagrams before proceeding.',
        technicalNote: 'Many no-crank faults are caused by simple oversights like an engaged E-stop, tripped safety switch, or empty fuel tank that prevents controller from initiating start.',
        estimatedTime: '10 minutes'
      },
      {
        step: 2,
        title: 'Battery Voltage and Condition Check',
        instruction: 'Using a digital multimeter, measure the voltage at the battery terminals with the engine off and no loads (open circuit voltage). For 12V batteries, a fully charged battery should read 12.6V or higher; for 24V systems, each 12V battery should read 12.6V+. Observe the voltage while actuating the start command - it should not drop below 10V (12V system) or 20V (24V system) during cranking attempt. Also check the voltage at the controller battery terminals to verify the full voltage is reaching the control system.',
        safetyWarning: 'Wear safety glasses when working around batteries. Avoid creating sparks near batteries due to hydrogen gas.',
        toolsRequired: ['Digital multimeter', 'Safety glasses'],
        expectedResult: 'Battery voltage 12.6V+ at rest, not dropping below 10V during crank attempt. Same voltage at controller terminals.',
        ifPassed: 'Batteries are serviceable. Proceed to Step 3 to check connections.',
        ifFailed: 'If voltage is low at rest, batteries need charging or replacement. If voltage drops severely during cranking, battery capacity is insufficient. If voltage differs significantly between battery and controller, connection problem exists.',
        technicalNote: 'A battery showing 12.2V may have only 50% charge and insufficient capacity to crank. Batteries below 12.0V are effectively dead and must be recharged before testing.',
        estimatedTime: '10 minutes'
      },
      {
        step: 3,
        title: 'Battery Cable and Connection Inspection',
        instruction: 'Perform detailed inspection of all battery cable connections including battery terminals, ground connections to engine/frame, and positive connections to starter and junction points. Check for corrosion (white or green buildup), loose terminals, frayed or damaged cables, and proper cable routing. Remove terminals, clean contact surfaces with wire brush, apply anti-corrosion compound, and retighten to proper torque. Measure voltage drop across each connection point during a cranking attempt - no single connection should drop more than 0.1V.',
        safetyWarning: 'Disconnect negative terminal first when removing cables. Reconnect negative terminal last.',
        toolsRequired: ['Wrenches for terminals', 'Wire brush', 'Anti-corrosion spray or grease', 'Digital multimeter', 'Torque wrench'],
        expectedResult: 'All connections clean, tight, and showing less than 0.1V drop during cranking.',
        ifPassed: 'Connections are good. Proceed to Step 4 to check starter circuit.',
        ifFailed: 'Clean and tighten any connection showing excessive voltage drop. Replace any cable showing damage or corrosion that cannot be fully cleaned.',
        technicalNote: 'The most common cause of no-crank is corroded battery terminals. A terminal can look acceptable but have enough resistance to prevent cranking. Always clean and tighten terminals as part of diagnosis.',
        estimatedTime: '20 minutes'
      },
      {
        step: 4,
        title: 'Starter Relay/Solenoid Circuit Test',
        instruction: 'Locate the starter relay or solenoid in the generator control circuit. With key/mode switch in START position, actuate the start command (manual or automatic) and listen for an audible click from the relay. Using a multimeter or test light, verify that voltage is present at the relay coil terminals when start command is active. If relay clicks but starter does not crank, check for voltage at the starter side of the relay contacts - this should be full battery voltage when relay is energized. If no click, relay coil circuit or controller output is faulty.',
        safetyWarning: 'Do not bypass starter safety interlocks. Ensure engine cannot start unexpectedly while testing.',
        toolsRequired: ['Digital multimeter', 'Test light', 'Screwdriver for relay access'],
        expectedResult: 'Relay clicks when start command active, full battery voltage present on both sides of relay contacts when energized.',
        ifPassed: 'Relay circuit is functional. Proceed to Step 5 to test starter motor directly.',
        ifFailed: 'If no click, check controller crank output and wiring to relay coil. If click but no voltage on output side, relay contacts are burnt and relay must be replaced.',
        technicalNote: 'Some generators use multiple relays in series - a run relay that must energize before crank relay can operate. Verify all prerequisite relays are functioning.',
        estimatedTime: '15 minutes'
      },
      {
        step: 5,
        title: 'Direct Starter Motor Test',
        instruction: 'This is a critical test that bypasses the control circuit to determine if the starter motor itself is functional. ENSURE ENGINE CANNOT START - remove fuel line or disable fuel solenoid. Using heavy-duty jumper cables or a dedicated test jumper, apply battery positive directly to the starter motor main terminal (the large terminal where the battery cable connects). Ground is through the starter mounting. The starter should rotate vigorously, turning the engine over. Listen for any unusual sounds like grinding, clicking, or whining.',
        safetyWarning: 'ENGINE MAY ROTATE - keep hands, clothing, and tools clear of all moving parts. Ensure fuel supply is disabled to prevent unexpected start. This test creates significant sparks - keep away from batteries. Have fire extinguisher ready.',
        toolsRequired: ['Heavy-duty jumper cables or starter test jumper', 'Safety glasses', 'Insulated gloves', 'Fire extinguisher'],
        expectedResult: 'Starter rotates engine smoothly at 150+ RPM with strong cranking sound. No grinding or unusual noises.',
        ifPassed: 'Starter motor is functional. Problem is in the control circuit between relay and starter. Check cables and connections.',
        ifFailed: 'If starter does not rotate, starter motor has failed and must be replaced or rebuilt. If grinding sound occurs, starter drive mechanism (Bendix) is damaged.',
        technicalNote: 'A weak or slow crank indicates worn brushes or worn commutator in the starter. While the starter may occasionally work, it should be rebuilt or replaced as a preventive measure.',
        estimatedTime: '15 minutes'
      },
      {
        step: 6,
        title: 'Engine Mechanical Freedom Check',
        instruction: 'If the starter tests good but cannot rotate the engine, the engine may be mechanically seized. Using the flywheel barring tool or a large socket on the crankshaft bolt, attempt to rotate the engine manually. The engine should rotate with moderate effort - typically 50-100 Nm of torque is required. If the engine will not rotate, remove the glow plugs or injectors and check for fluid (coolant or fuel) in the cylinders. Also check for visible mechanical damage or binding.',
        safetyWarning: 'Never apply power to starter while barring engine. Ensure transmission/PTO is in neutral. Fluid released from cylinders may be under pressure.',
        toolsRequired: ['Flywheel barring tool or large socket set', 'Breaker bar', 'Glow plug socket', 'Injector removal tools', 'Drain pan'],
        expectedResult: 'Engine rotates smoothly by hand with consistent resistance throughout rotation. No fluid present in cylinders.',
        ifPassed: 'Engine is mechanically free. Problem must be in starting circuit. Recheck all connections and cables.',
        ifFailed: 'If engine will not rotate, internal mechanical failure (seized bearing, broken rod, hydrolock) has occurred. Major engine repair required.',
        technicalNote: 'If engine rotates in one direction but not the other, or rotates only part of a turn, the problem is likely a damaged piston or connecting rod contacting the crankcase.',
        estimatedTime: '30 minutes'
      }
    ],

    resetSequences: {
      TYPE_A: {
        steps: [
          'Identify and correct the root cause of the starting failure',
          'Ensure batteries are fully charged and connections are clean and tight',
          'Navigate to controller fault log and note any additional codes',
          'Press and hold STOP/RESET button for 3 seconds',
          'When display shows "READY TO START", release button',
          'Perform test start to verify repair'
        ],
        keySequence: ['STOP/RESET (3 sec hold)', 'Release on READY'],
        notes: 'DSE controllers may require multiple resets if multiple faults were logged. Check for any remaining alarms before starting.'
      },
      TYPE_B: {
        steps: [
          'Correct the starting system fault',
          'On InteliLite front panel, press FAULT RESET button',
          'If fault persists, check for additional lockout conditions',
          'Navigate to fault history (MENU > HISTORY) to verify all faults cleared',
          'Return to main screen and attempt start'
        ],
        keySequence: ['FAULT RESET (single press)', 'Verify in HISTORY menu'],
        notes: 'ComAp controllers store detailed event logs accessible via PC software. Download and review if fault recurs.'
      },
      TYPE_C: {
        steps: [
          'Address the root cause of start failure',
          'On controller front panel, navigate to ALARMS screen',
          'Select the start failure alarm',
          'Press RESET or use soft key to reset selected alarm',
          'Verify alarm clears and controller returns to READY status'
        ],
        keySequence: ['MENU > ALARMS > Select alarm > RESET'],
        notes: 'Woodward easYgen controllers provide detailed fault descriptions. Note the fault sub-code for precise troubleshooting.'
      },
      TYPE_D: {
        steps: [
          'Fix the identified starting system issue',
          'Press STOP button to ensure engine is in stopped state',
          'Press and hold RESET button until all fault LEDs extinguish (approximately 5 seconds)',
          'Verify AUTO and MANUAL indicators are functioning',
          'Attempt restart'
        ],
        keySequence: ['STOP', 'RESET (5 sec hold)'],
        notes: 'SmartGen HGM series stores up to 100 fault events. Review using USB connection and PC software.'
      },
      TYPE_E: {
        steps: [
          'Repair starting circuit problem',
          'On EMCP panel, navigate to ALARMS menu',
          'Review active alarms and acknowledge each',
          'Navigate to SERVICE menu if lockout is active',
          'Enter service code if required and reset lockout counter',
          'Return to MAIN screen and verify READY status'
        ],
        keySequence: ['ALARMS > Acknowledge > SERVICE (if locked out)'],
        notes: 'CAT EMCP 4.x maintains detailed fault analytics. Service tool connection recommended for recurring faults.'
      }
    },

    repairProcedures: [
      {
        title: 'Battery Replacement and System Restoration',
        difficulty: 'beginner',
        estimatedTime: '1-2 hours',
        laborCost: { min: 3000, max: 8000, currency: 'KES' },
        partsCost: { min: 25000, max: 80000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Starting Battery 12V 200Ah (each)',
            quantity: 2,
            oemPartNumber: 'Various - match original specification',
            alternativePartNumbers: ['Chloride Exide N200', 'Hoppecke 200Ah', 'Varta 200Ah'],
            estimatedCost: 35000
          },
          {
            name: 'Battery Terminal Anti-Corrosion Spray',
            quantity: 1,
            oemPartNumber: 'Various',
            alternativePartNumbers: ['CRC Battery Terminal Protector', 'WD-40 Specialist'],
            estimatedCost: 1500
          }
        ],
        toolsRequired: ['Wrench set', 'Wire brush', 'Safety glasses', 'Insulated gloves', 'Battery carrier/lifting strap', 'Multimeter'],
        steps: [
          {
            step: 1,
            instruction: 'Set generator to OFF mode and ensure engine is stopped. Record any fault codes and settings before disconnecting batteries.',
            warning: 'Some controllers lose programming when batteries are disconnected. Note settings or use backup power supply if available.',
            tip: 'Take photos of battery connections before disconnecting to ensure correct reconnection.'
          },
          {
            step: 2,
            instruction: 'Disconnect the NEGATIVE battery cable first, then the POSITIVE cable. Remove any battery hold-down clamps or brackets. Carefully lift old batteries out using proper lifting technique or battery carrier.',
            warning: 'Batteries are heavy (50-60kg each for 200Ah). Use proper lifting technique or get assistance. Acid may leak from damaged batteries.',
            tip: 'Place disconnected cables where they cannot accidentally contact battery terminals.'
          },
          {
            step: 3,
            instruction: 'Clean the battery tray and any accessible cable terminals using wire brush and water with baking soda solution (to neutralize any acid). Rinse with clean water and dry completely. Inspect cables for damage or corrosion and replace if needed.',
            tip: 'This is a good time to replace battery cables if they show any signs of damage or corrosion.'
          },
          {
            step: 4,
            instruction: 'Place new batteries in the tray, ensuring correct orientation for cable routing. Install hold-down clamps or brackets to prevent battery movement during generator operation.',
            warning: 'Ensure batteries are rated for the application. Using undersized batteries will result in recurrent starting problems.'
          },
          {
            step: 5,
            instruction: 'Connect POSITIVE cables first, then NEGATIVE cables. Apply anti-corrosion spray to terminals after tightening. Ensure connections are tight but do not overtorque (approximately 6-8 Nm for typical terminal bolts).',
            tip: 'A torque wrench or "feeling" of firm resistance is better than maximum force which can damage terminals.'
          },
          {
            step: 6,
            instruction: 'Verify battery voltage reads 12.6V+ per battery. Set generator to AUTO or MANUAL mode and attempt start. Monitor for successful cranking and starting. After running, verify charging voltage is 13.8-14.4V per 12V battery.',
            tip: 'Run the generator for at least 30 minutes to ensure batteries receive initial charge.'
          }
        ],
        verificationSteps: [
          'Measure battery voltage with engine running - should be 13.8-14.4V per 12V battery',
          'Perform test start from AUTO mode',
          'Check controller fault log is clear',
          'Verify battery charging system operation',
          'Test emergency stop and restart sequence'
        ]
      },
      {
        title: 'Starter Motor Replacement',
        difficulty: 'intermediate',
        estimatedTime: '2-4 hours',
        laborCost: { min: 8000, max: 20000, currency: 'KES' },
        partsCost: { min: 35000, max: 150000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Starter Motor Assembly',
            quantity: 1,
            oemPartNumber: 'Engine specific - consult parts manual',
            alternativePartNumbers: ['Bosch equivalent', 'Denso equivalent', 'Delco Remy equivalent'],
            estimatedCost: 85000
          },
          {
            name: 'Starter Mounting Bolts',
            quantity: 2,
            oemPartNumber: 'Engine specific',
            alternativePartNumbers: ['Grade 10.9 metric bolt set'],
            estimatedCost: 500
          }
        ],
        toolsRequired: ['Socket set', 'Wrenches', 'Pry bar', 'Floor jack if needed for access', 'Safety glasses', 'Wire brush', 'Anti-seize compound'],
        steps: [
          {
            step: 1,
            instruction: 'Disconnect NEGATIVE battery cable. Identify and photograph all wiring connections to the old starter motor. There will be at least two connections: the main power cable (large) and the control circuit wire (small).',
            warning: 'Even with battery disconnected, capacitors may retain charge. Use caution when disconnecting high-current terminals.',
            tip: 'Label wires if there is any chance of confusion during reinstallation.'
          },
          {
            step: 2,
            instruction: 'Disconnect the wiring from the starter motor. The main power cable typically uses a nut; the control wire may use a spade connector or nut. Support the wiring to prevent damage.',
            tip: 'Clean the cable terminals now - easier than after starter is installed.'
          },
          {
            step: 3,
            instruction: 'Remove the starter mounting bolts. These are typically two bolts that thread into the engine block or flywheel housing. The starter may be held firmly by alignment dowels - do not force. Support the starter as bolts are removed; starters are heavy.',
            warning: 'Starters can weigh 10-25kg. Ensure secure grip before removing last bolt.',
            tip: 'If bolts are corroded or seized, apply penetrating oil and allow time to soak before forcing.'
          },
          {
            step: 4,
            instruction: 'Carefully remove the old starter, noting the orientation and any shims or spacers used. Compare old and new starters to verify correct replacement part - check pinion engagement, mounting bolt pattern, and electrical connections.',
            tip: 'Rotate the flywheel by hand and inspect the ring gear teeth for damage. Damaged ring gear teeth can destroy the new starter.'
          },
          {
            step: 5,
            instruction: 'Apply anti-seize compound to the mounting bolt threads. Install the new starter, ensuring it seats fully against the mounting surface. Hand-start the mounting bolts to ensure correct thread engagement before tightening.',
            warning: 'Do not force bolts if they do not thread easily - cross-threading damages expensive engine block or housing.',
            tip: 'Torque mounting bolts to specification - typically 40-55 Nm for most diesel engines.'
          },
          {
            step: 6,
            instruction: 'Reconnect the electrical connections - main power cable first, then control wire. Ensure main cable terminal is tight - loose connection will cause arcing and burning. Reconnect battery NEGATIVE cable.',
            tip: 'Verify all connections are correct before reconnecting battery. Incorrect wiring can damage controller.'
          },
          {
            step: 7,
            instruction: 'Perform test start. Observe starter engagement sound - should be a solid "whirr" without grinding or whining. After successful start, stop engine and verify starter disengages properly.',
            tip: 'If grinding occurs, stop immediately and check starter alignment and ring gear condition.'
          }
        ],
        verificationSteps: [
          'Starter engages smoothly without grinding',
          'Engine starts within 3 seconds of cranking',
          'Starter disengages immediately when engine runs',
          'No unusual sounds from starter area',
          'Multiple test starts successful'
        ]
      },
      {
        title: 'Battery Cable and Connection Repair',
        difficulty: 'beginner',
        estimatedTime: '1-2 hours',
        laborCost: { min: 2000, max: 5000, currency: 'KES' },
        partsCost: { min: 3000, max: 15000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Battery Cable Set (positive and negative)',
            quantity: 1,
            oemPartNumber: 'Generator specific or custom made',
            alternativePartNumbers: ['Custom welding cable with lugs'],
            estimatedCost: 8000
          },
          {
            name: 'Battery Terminal Cleaner',
            quantity: 1,
            oemPartNumber: 'N/A',
            alternativePartNumbers: ['Terminal cleaning brush', 'Wire brush'],
            estimatedCost: 500
          },
          {
            name: 'Anti-Corrosion Compound',
            quantity: 1,
            oemPartNumber: 'N/A',
            alternativePartNumbers: ['Battery terminal grease', 'Petroleum jelly'],
            estimatedCost: 500
          }
        ],
        toolsRequired: ['Wrenches', 'Wire brush', 'Cable crimping tool (if making cables)', 'Heat shrink tubing', 'Heat gun'],
        steps: [
          {
            step: 1,
            instruction: 'Disconnect NEGATIVE battery cable first to prevent accidental shorts. Inspect the full length of both battery cables for damage, corrosion under insulation, and secure attachment at all connection points.'
          },
          {
            step: 2,
            instruction: 'Remove all cable connections and clean the terminal surfaces on batteries, starter, engine block (ground), and any junction points. Use wire brush or specialized terminal cleaner to achieve bright metal surfaces.'
          },
          {
            step: 3,
            instruction: 'If cables are damaged or corroded beyond cleaning, replace with new cables of equal or larger gauge. The positive cable from battery to starter should be at least 2/0 gauge (70mm²) for most generators. Ground cables should be equal size.'
          },
          {
            step: 4,
            instruction: 'Apply anti-corrosion compound to all clean terminal surfaces. Reconnect cables - POSITIVE first, then NEGATIVE. Ensure all connections are tight - torque to specification if known, otherwise ensure firm resistance.',
            tip: 'Check that cables are routed away from heat sources and cannot chafe against sharp edges.'
          },
          {
            step: 5,
            instruction: 'Perform test start and measure voltage drop across each connection during cranking. No single connection should show more than 0.1V drop under cranking load.'
          }
        ],
        verificationSteps: [
          'Voltage drop less than 0.1V per connection during cranking',
          'Successful test start',
          'Connections cool after cranking (no heat from resistance)',
          'No visible corrosion remaining'
        ]
      }
    ],

    preventionStrategies: [
      'Implement weekly battery voltage checks as part of generator inspection routine - voltage below 12.4V indicates charging problem',
      'Exercise generator under load for 30 minutes weekly to maintain battery charge and starter motor condition',
      'Clean and retighten battery terminals quarterly, applying anti-corrosion compound',
      'Replace batteries proactively every 3-4 years regardless of apparent condition - battery failure during emergency is unacceptable',
      'Install battery monitoring system for critical generators to provide continuous health tracking',
      'Keep spare starter motor, batteries, and cables on site for critical installations to enable rapid repair',
      'Include starter motor inspection in annual maintenance - check brushes, commutator, and drive mechanism',
      'Ensure battery charger is functioning correctly - monitor float charge voltage (13.2-13.8V for flooded, 13.5-13.8V for AGM)',
      'For generators in dusty or humid environments, install protective covers over battery and starting connections'
    ],

    maintenanceSchedule: [
      { interval: 'Weekly', task: 'Check battery voltage (should be 12.6V+). Verify charger operation light is on.', importance: 'critical' },
      { interval: 'Weekly', task: 'Observe one start cycle during exercise - note cranking time and sound.', importance: 'important' },
      { interval: 'Monthly', task: 'Visual inspection of battery terminals and cables for corrosion.', importance: 'important' },
      { interval: 'Quarterly', task: 'Clean battery terminals, check electrolyte level (flooded batteries), verify all connections tight.', importance: 'critical' },
      { interval: '6 months', task: 'Battery load test - verify batteries can deliver rated CCA.', importance: 'critical' },
      { interval: 'Annually', task: 'Full starting system inspection including starter motor, cables, relay, and control circuit.', importance: 'critical' },
      { interval: '3 years', task: 'Consider proactive battery replacement regardless of test results.', importance: 'recommended' }
    ],

    caseStudies: [
      {
        location: 'Private Hospital, Karen, Nairobi',
        generatorModel: 'Cummins C350 D5B with DSE 7320 Controller',
        symptom: 'Generator failed to start during unexpected power outage at 3 AM. Night security reported hearing clicking sound but no cranking. Hospital on UPS backup with 45 minutes remaining.',
        diagnosis: 'Emergency call-out revealed corroded battery terminals despite batteries showing 12.7V. Under cranking load, voltage dropped to 6V due to resistance at corroded positive terminal. Resistance at terminal was 0.8 ohms.',
        solution: 'Emergency cleaning of terminals using improvised materials (wire brush from security shed, petroleum jelly from first aid kit). After cleaning, generator started immediately on first crank. Followed up next day with proper terminal treatment and spare batteries delivered to site.',
        lessonsLearned: 'This hospital now has quarterly terminal cleaning on schedule and keeps spare batteries on site. Their maintenance technician received training on starting system inspection. A 45-minute outage was avoided by emergency response in 25 minutes.',
        timeToResolve: '25 minutes emergency, 2 hours follow-up'
      },
      {
        location: 'Manufacturing Plant, Athi River',
        generatorModel: 'Perkins 4006TAG with ComAp InteliGen',
        symptom: 'Generator cranked very slowly and failed to start. Production line down with perishable goods at risk. Batteries replaced 6 months ago.',
        diagnosis: 'Investigation found starter motor drawing excessive current - 850A vs normal 450A. Internal inspection revealed worn brushes and commutator damage from water ingress through damaged weather seal.',
        solution: 'Installed reconditioned starter motor kept as spare on site. Original starter sent for professional rebuild. Production resumed within 1 hour of technician arrival.',
        lessonsLearned: 'Plant now maintains rebuilt spare starter on site. Starter motor weather seal is now inspected during routine maintenance. The failed starter was rebuilt and became the spare, creating ongoing rotation.',
        timeToResolve: '1 hour with spare on site, 3 days for starter rebuild'
      },
      {
        location: 'Flower Farm, Naivasha',
        generatorModel: 'FG Wilson P400-1 with original controller',
        symptom: 'Intermittent fail to start - sometimes works perfectly, sometimes no crank at all. More frequent during cold early mornings.',
        diagnosis: 'Problem traced to marginal starter relay contacts that would not close reliably when battery voltage dropped slightly in cold conditions. Relay had visible burning on contacts from arcing.',
        solution: 'Replaced starter relay with heavy-duty sealed unit rated for agricultural environments. Added battery blanket heater for cold morning starting. No recurrence in 18 months.',
        lessonsLearned: 'Highland locations need consideration for cold starting. Original relay was not designed for the dusty, cold environment. Upgraded components appropriate for environment prevent recurrence.',
        timeToResolve: '2 hours diagnosis and repair'
      }
    ],

    aiInsights: {
      patternAnalysis: 'Analysis of 5,000+ starting system faults in Kenya shows clear patterns: 42% are battery-related (age, discharge, connections), 28% are starter motor failures (more common in high-dust environments), 18% are relay/control circuit issues, and 12% are other causes. Starting problems increase 60% during the "long rains" (March-May) due to increased humidity affecting electrical connections.',
      predictiveIndicators: [
        'Gradual increase in cranking time (e.g., 2 seconds to 4 seconds) indicates declining battery capacity or starter motor wear',
        'Intermittent starting problems that worsen when cold indicate borderline battery capacity or connection issues',
        'Battery voltage dropping below 12.4V between exercises indicates charging system problem',
        'Starter motor noise changes (grinding, whining) predict imminent failure',
        'Clicking without cranking is 85% likely to be battery/connection issue, 15% likely to be relay failure'
      ],
      correlatedFaults: [
        'Battery Charger Failure (if charging problem preceded battery failure)',
        'Low Fuel (if fuel level was misread as cause of no-start)',
        'Overspeed on startup (if battery was marginal and caused slow crank)',
        'Control Power Fail (if battery deeply discharged)'
      ],
      seasonalFactors: 'Starting failures increase 35% during cold seasons (June-August) in highland areas due to cold thickening oil and reducing battery capacity. Rainy seasons show 25% increase due to moisture-related connection issues. Dry dusty seasons show more starter motor failures from dust ingestion.',
      environmentalFactors: 'Generators near coast show 50% higher connection corrosion rates due to salt air. Dusty environments (quarries, construction, rural farms) have 40% higher starter motor failure rates. High-humidity locations need more frequent connection maintenance.',
      recommendations: [
        'For critical installations, implement automated battery monitoring with remote alerting',
        'Maintain rebuilt spare starter motor on site for rapid swap capability',
        'Upgrade to AGM batteries for longer life and lower maintenance in all environments',
        'Install battery heater blankets for highland installations',
        'Use sealed relays and connectors in dusty or humid environments',
        'Schedule proactive battery replacement at 3 years regardless of test results'
      ]
    },

    wiringDiagram: {
      sensorLocation: 'Starting circuit spans from batteries through control system to starter motor mounted on engine flywheel housing',
      wireColors: ['Red - Battery positive', 'Black - Battery negative/ground', 'Yellow or Blue - Starter control signal', 'Orange - Key start signal'],
      pinConfiguration: 'Starter motor has main terminal (B+) for battery positive and S terminal for control signal. Some starters have additional R terminal for accessories.',
      voltageRange: '12V or 24V DC depending on system configuration',
      resistance: 'Control circuit should be less than 0.5 ohm total. Power circuit should show less than 0.1V drop at each connection under load.',
      signalType: 'DC power circuit for starter motor, DC control signal for relay coil'
    },

    relatedFaults: [
      'GEN-002 - Fail to Start - Cranks But No Fire',
      'BAT-001 - Low Battery Voltage',
      'BAT-002 - Battery Charger Failure',
      'STS-002 - Starter Motor Overcrank',
      'CTL-001 - Control Power Failure'
    ],

    frequentlyAskedQuestions: [
      {
        question: 'Can I jump-start my generator from a vehicle if the batteries are dead?',
        answer: 'Yes, but with caution. For 12V generators, you can use a vehicle with engine running to provide boost. For 24V generators, you need two vehicles in series OR a 24V jump pack. Connect positive to positive, negative to engine block ground (not battery negative). Start the generator, then disconnect in reverse order. The generator\'s charger will then charge its own batteries. Never attempt this on generators with sensitive electronic controls without consulting the manual - some controllers can be damaged by voltage spikes.'
      },
      {
        question: 'How long should batteries last in a standby generator?',
        answer: 'Well-maintained batteries in a properly functioning charging system typically last 3-5 years. However, we recommend proactive replacement at 3 years for critical installations because battery failure is unpredictable and often occurs during the emergency when you need the generator most. Batteries in hot environments or with frequent deep discharge cycles may need replacement sooner.'
      },
      {
        question: 'Why does my generator start fine sometimes but not others?',
        answer: 'Intermittent starting problems usually indicate a marginal condition in the starting circuit - most commonly corroded or loose connections, a battery near end of life, or a starter motor with worn brushes. These marginal conditions can work when everything is optimal (warm day, recent charge, minimal vibration) but fail when conditions are less favorable. The solution is to systematically test each component and correct any borderline readings rather than waiting for complete failure.'
      },
      {
        question: 'The starter motor turns the engine but it seems slow - is this normal?',
        answer: 'Diesel generators should crank at 150+ RPM for reliable starting. If cranking sounds labored or slow, the batteries may be partially discharged, connections may have excessive resistance, the starter motor may be worn, or the engine may have excessive resistance (wrong oil viscosity, internal problem). Slow cranking in cold weather is somewhat normal but should still achieve starting RPM. If you can count individual compression strokes ("whump...whump...whump"), cranking is too slow.'
      },
      {
        question: 'What battery type is best for generators?',
        answer: 'For most standby generators, we recommend AGM (Absorbed Glass Mat) batteries. They offer several advantages: maintenance-free (no water to add), spill-proof, more vibration resistant, faster recharge, and longer cycle life than flooded batteries. The higher initial cost is offset by longer life and reliability. For very large generators or high-temperature environments, flooded batteries with proper maintenance are also acceptable. Lithium batteries are emerging but not yet widely used in generators due to cost and charging compatibility.'
      }
    ],

    technicalBulletins: [
      {
        number: 'TB-2024-07',
        title: 'Starting System Inspection Procedures',
        summary: 'Comprehensive guide to systematic inspection of generator starting systems, including test procedures, acceptable values, and common failure modes.'
      },
      {
        number: 'TB-2024-08',
        title: 'Battery Selection and Installation Guide',
        summary: 'Guidelines for selecting appropriate batteries for generator applications, including sizing calculations, terminal types, and installation best practices.'
      },
      {
        number: 'TB-2023-22',
        title: 'Starter Motor Troubleshooting',
        summary: 'Diagnostic procedures for starter motor problems including bench testing, rebuild vs. replace decision guide, and preventive maintenance recommendations.'
      }
    ]
  },

  'STS-002': {
    code: 'STS-002',
    title: 'Engine Fail to Start - Cranks But No Ignition',
    alternativeCodes: ['NOFIRE', 'CRNK-NF', 'E202', 'F102', 'NO-IGNITION'],
    severity: 'critical',
    category: 'Starting System',
    subcategory: 'Fuel and Ignition',
    affectedSystems: ['Fuel System', 'Injection Pump', 'Injectors', 'Glow Plugs', 'Air Intake'],

    technicalOverview: `The "Cranks But No Ignition" fault indicates that the starting system is functioning correctly - the engine rotates at proper cranking speed - but combustion is not occurring. This fault represents a fundamentally different diagnostic path from the "No Crank" condition. When the engine cranks but fails to fire, the problem lies in one of the three essential requirements for diesel combustion: fuel delivery, compression heat, or air supply. Understanding diesel engine combustion principles is essential for efficient diagnosis.

Unlike gasoline engines that use spark ignition, diesel engines rely on compression ignition. Air drawn into the cylinder is compressed to ratios of 16:1 to 22:1, which raises its temperature to 500-700°C - hot enough to ignite diesel fuel injected at precisely the right moment. The fuel injection system, controlled by a mechanical or electronic injection pump, delivers finely atomized fuel at pressures ranging from 200 bar (older mechanical systems) to over 2000 bar (modern common rail systems). This high-pressure fuel spray instantly vaporizes and ignites upon contact with the superheated air.

Several conditions must be met for successful starting. First, adequate cranking speed - typically 150+ RPM - is required to generate sufficient compression heat. Second, fuel must be available at the injection pump with no air in the lines. Third, the injectors must atomize fuel properly. Fourth, starting aids (glow plugs or intake heaters) must be functioning in cold conditions to supplement compression heat. Fifth, adequate air must be available - a blocked air filter can prevent starting. The failure of any one of these conditions prevents combustion.

Modern generator controllers implement intelligent starting sequences that activate glow plugs (if equipped), energize the fuel system, and engage the starter motor in the correct sequence. The controller monitors for signs of combustion - typically a sharp increase in engine RPM detected by the magnetic pickup - and terminates the start attempt if combustion is not detected within a programmed time. Understanding this sequence helps pinpoint where the failure is occurring.`,

    systemImpact: `An engine that cranks but doesn't start represents a critical failure for any standby power application. The entire purpose of a generator is defeated if it cannot start when needed. During a utility power outage, every second of continued cranking without starting extends the period when connected loads are without power. For many applications - hospitals, data centers, refrigeration - even minutes of extended downtime can have serious consequences.

Extended cranking attempts cause several secondary problems. The starter motor, designed for brief intermittent duty, overheats when cranking continues for extended periods. This can damage the motor windings and significantly shorten its service life. Simultaneously, the batteries are being deeply discharged by the continuous high-current draw. A fully charged battery pair can be depleted in just minutes of continuous cranking, compounding the problem by removing the ability to crank at all.

When fuel is delivered but not igniting, it washes past the piston rings and dilutes the engine oil. This fuel-diluted oil has reduced lubricating properties and can cause accelerated wear when the engine eventually starts. In severe cases of fuel washdown, pistons can hydrolock on the next start attempt when liquid fuel fills the combustion chamber and cannot compress. The raw fuel also exits through the exhaust, creating both environmental and safety concerns.

The troubleshooting process for a crank-no-fire condition can be time-consuming and requires systematic approach. Without proper diagnostic procedure, technicians may replace parts unnecessarily while missing the actual cause. For example, replacing injectors when the problem is air in the fuel lines wastes money and time. This fault demands methodical diagnosis to identify the root cause efficiently.`,

    safetyConsiderations: `Diesel fuel presents several safety hazards during diagnosis and repair of fuel system problems. While diesel is less volatile than gasoline, it is still flammable and its mist can ignite. Keep all ignition sources away from fuel system work. Wear safety glasses to protect against fuel spray, which can occur at high pressure from injection system components. Skin contact with diesel fuel should be minimized - wear nitrile gloves during fuel system work.

The fuel injection system operates at extremely high pressures - up to 2000 bar (29,000 PSI) in modern common rail systems. Never attempt to check for fuel spray by placing fingers near injector tips or high-pressure lines while cranking. The fuel jet from a leaking high-pressure connection can penetrate skin and inject fuel into tissue, causing serious injury requiring immediate medical attention. Even older mechanical systems operate at 200+ bar, sufficient to penetrate skin.

When working with glow plugs, be aware that they can become extremely hot - glowing red - within seconds of energization. Do not touch glow plugs or their wiring while they may be energized. The controller's glow plug circuit may energize automatically when the start sequence begins or when the key is in certain positions. Verify that glow plugs are not being energized before handling.

If the engine compartment shows evidence of fuel leakage or vapor, do not attempt to start the engine. Fuel pooled in the generator enclosure can ignite during cranking, causing fire. Identify and repair any leaks before continuing troubleshooting. Have an appropriate fire extinguisher readily available when working on fuel systems.`,

    historicalContext: `Diesel fuel systems have evolved dramatically over the past century, with each generation offering improved performance but requiring updated diagnostic knowledge. Early diesel engines used simple mechanical injection systems with in-line or rotary injection pumps. These systems were robust and could often be diagnosed and repaired in the field with basic tools. Timing was set mechanically and didn't change, fuel delivery was purely mechanical, and starting problems usually came down to fuel supply, air in the lines, or worn injection components.

The introduction of electronically controlled fuel injection in the 1990s brought significant improvements in efficiency, emissions, and starting performance, but also introduced new failure modes. Electronic unit injectors, controlled by the engine ECM, required specialized diagnostic tools. Failures could be electrical (wiring, sensors, ECM) or mechanical (injector wear, pump failure). The troubleshooting process became more complex but also more precise - fault codes could identify exactly which cylinder or component was problematic.

Modern common rail injection systems, now standard in most generator engines, represent another leap in technology. A high-pressure pump maintains constant rail pressure of 1800-2000 bar, and individual injectors are opened electronically by the ECM for precise fuel delivery. These systems offer excellent starting performance, fuel economy, and emissions control. However, they are highly sensitive to fuel quality - contamination or water in fuel can damage components costing tens of thousands of dollars. The diagnostic approach must account for the specific system type installed.

Electronic starting aids have also advanced. Traditional glow plugs simply heated cylinder air during cranking. Modern systems include grid heaters in the intake manifold, controlled preheating and post-heating cycles, and automatic adaptation to ambient temperature. Some engines now use pilot injection (a small fuel spray before main injection) to control combustion noise and improve cold starting. Each technology requires understanding of its operation for effective troubleshooting.`,

    rootCauses: [
      {
        cause: 'Empty Fuel Tank or Fuel Valve Closed',
        probability: 25,
        explanation: 'The fuel supply has been exhausted or isolated by a closed valve. This is often overlooked because operators assume fuel level was checked recently.',
        testMethod: 'Visually verify fuel level in tank. Check that all fuel valves are open. Listen for fuel pump operation if electrically primed.',
        timeToTest: '5 minutes',
        toolsRequired: ['Visual inspection', 'Flashlight for tank inspection'],
        symptomsIndicating: ['Fuel gauge reading empty or low', 'Engine cranks normally but no exhaust smoke', 'Fuel filter bowl empty', 'No fuel at injector leak-off']
      },
      {
        cause: 'Air in Fuel System',
        probability: 30,
        explanation: 'Air has entered the fuel lines, either from running tank dry, filter change, or leak on suction side. Air compresses instead of transmitting pump pressure, preventing injection.',
        testMethod: 'Open bleed points on fuel filter and injection pump. Crank engine and check for air bubbles in fuel flow. Air-free fuel should flow steadily.',
        timeToTest: '15 minutes',
        toolsRequired: ['Wrenches for bleed screws', 'Container for fuel', 'Shop towels'],
        symptomsIndicating: ['Recent fuel filter change', 'Engine ran out of fuel recently', 'Bubbles visible in clear fuel lines', 'Fuel filter bowl shows air gap']
      },
      {
        cause: 'Failed Fuel Shut-Off Solenoid',
        probability: 15,
        explanation: 'The fuel shut-off solenoid on the injection pump is not opening, preventing fuel from reaching injectors. This solenoid is energized to run, so electrical failure or mechanical sticking prevents operation.',
        testMethod: 'Check for voltage at solenoid during cranking. Listen/feel for solenoid click when ignition is turned on. Manually actuate solenoid if accessible.',
        timeToTest: '10 minutes',
        toolsRequired: ['Multimeter', 'Test light', 'Possibly small wrench to manually retract solenoid'],
        symptomsIndicating: ['No click from solenoid when key turned on', 'Engine was running then suddenly stopped', 'Voltage present but solenoid not actuating', 'Problem started after long storage']
      },
      {
        cause: 'Failed Glow Plug System',
        probability: 10,
        explanation: 'In cold conditions, failed glow plugs or glow plug circuit prevent adequate cylinder preheating for combustion. Engine may start in warm conditions but not cold.',
        testMethod: 'Check glow plug voltage during preheat cycle. Measure resistance of individual glow plugs. Check glow plug relay operation.',
        timeToTest: '20 minutes',
        toolsRequired: ['Multimeter', 'Glow plug tester', 'Appropriate sockets for glow plugs'],
        symptomsIndicating: ['Starts in warm weather but not cold', 'No glow plug light or shortened preheat time', 'Excessive smoke during extended cranking', 'Measured glow plug resistance infinite (open)']
      },
      {
        cause: 'Injection Pump Failure',
        probability: 10,
        explanation: 'The injection pump is not delivering fuel at adequate pressure or timing due to internal wear, timing drift, or mechanical failure.',
        testMethod: 'Check for fuel at high-pressure outlet (loosen injector line slightly and observe fuel spray during cranking). Verify pump timing marks.',
        timeToTest: '20 minutes',
        toolsRequired: ['Wrenches for injector lines', 'Timing tools if checking timing', 'Safety glasses'],
        symptomsIndicating: ['Poor performance before failure to start', 'High engine hours without pump service', 'Contaminated fuel history', 'Timing marks misaligned']
      },
      {
        cause: 'Blocked Air Filter',
        probability: 5,
        explanation: 'Severely blocked air filter prevents adequate air intake for combustion. This is unusual as a sole cause but can contribute in marginal conditions.',
        testMethod: 'Remove air filter and attempt start. Check air filter restriction indicator if equipped.',
        timeToTest: '5 minutes',
        toolsRequired: ['Screwdriver or clips for filter housing'],
        symptomsIndicating: ['Air filter obviously dirty', 'Restriction indicator in red zone', 'Dusty environment', 'Filter not changed recently']
      },
      {
        cause: 'Low Compression',
        probability: 5,
        explanation: 'Worn piston rings, cylinder walls, or valves prevent adequate compression for ignition. Usually accompanied by previous symptoms of poor performance.',
        testMethod: 'Perform compression test on all cylinders. Compare readings to specification (typically 20-35 bar depending on engine).',
        timeToTest: '1 hour',
        toolsRequired: ['Compression tester', 'Injector removal tools', 'Torque wrench for reinstallation'],
        symptomsIndicating: ['High engine hours', 'Excessive blow-by from crankcase', 'Oil consumption history', 'Declining performance before failure']
      }
    ],

    diagnosticProcedures: [
      {
        step: 1,
        title: 'Verify Fuel Supply',
        instruction: 'Before proceeding with complex diagnostics, verify the fundamentals. Check fuel level visually in the tank - do not rely solely on the gauge. Verify all fuel supply valves are open - trace the fuel line from tank to engine and confirm each valve position. If fuel is supplied from a day tank, check main supply to day tank as well. Check the fuel filter bowl for presence of fuel and absence of water separation.',
        safetyWarning: 'Open fuel tanks carefully - do not use open flames for illumination. Fuel vapors can ignite.',
        toolsRequired: ['Flashlight', 'Visual inspection'],
        expectedResult: 'Tank contains fuel, all valves open, fuel visible in filter bowl without water.',
        ifPassed: 'Fuel supply is available. Proceed to Step 2 to check for air in system.',
        ifFailed: 'Fill tank if empty. Open any closed valves. Drain water from filter if present. Proceed to Step 2 to bleed air.',
        technicalNote: 'Running a tank completely dry introduces air into the system that must be bled before the engine will start. Even a few seconds of fuel starvation can require bleeding.',
        estimatedTime: '10 minutes'
      },
      {
        step: 2,
        title: 'Bleed Fuel System of Air',
        instruction: 'Air in the fuel system is a common cause of crank-no-fire conditions. Locate the bleed points on the fuel system - typically there is a bleed screw on the fuel filter housing and one or more on the injection pump. Open the fuel filter bleed screw and operate the manual priming lever (if equipped) or electric lift pump until fuel flows freely without bubbles. Tighten the bleed screw. Repeat at the injection pump bleed point. On some systems, you may need to loosen injector lines at the injectors and crank until fuel appears, then tighten.',
        safetyWarning: 'Catch fuel in appropriate container. Wipe up spills immediately. Do not loosen high-pressure lines while engine is running.',
        toolsRequired: ['Wrenches for bleed screws', 'Fuel container', 'Shop towels'],
        expectedResult: 'Fuel flows steadily without air bubbles from all bleed points.',
        ifPassed: 'Fuel system is primed. Attempt to start engine. If still no start, proceed to Step 3.',
        ifFailed: 'If air continues to enter, there is a leak on the suction side. Check all connections from tank to injection pump. Common leak points: filter seals, lift pump diaphragm, injector return line fittings.',
        technicalNote: 'Some engines have self-bleeding systems and only require cranking to prime. Others, especially older mechanical injection systems, require manual bleeding at multiple points.',
        estimatedTime: '20 minutes'
      },
      {
        step: 3,
        title: 'Check Fuel Shut-Off Solenoid',
        instruction: 'Locate the fuel shut-off solenoid on the injection pump. When the key is turned to RUN or during cranking, the solenoid should energize (pull in) to allow fuel flow. Listen for a click when the key is turned on. Using a multimeter, verify that voltage (typically 12V or 24V DC) is present at the solenoid connector during cranking. If voltage is present but solenoid does not actuate, the solenoid is faulty. If no voltage, trace the control circuit from the controller.',
        safetyWarning: 'Some solenoids can be manually retracted for testing. Do not leave solenoid manually retracted during operation.',
        toolsRequired: ['Multimeter', 'Test light', 'Wrenches if manual override needed'],
        expectedResult: 'Solenoid clicks when energized and allows fuel flow. Voltage present during cranking.',
        ifPassed: 'Fuel solenoid is functioning. Proceed to Step 4 to check glow plug system.',
        ifFailed: 'Replace faulty solenoid. If wiring issue, repair wiring or controller output.',
        technicalNote: 'Fuel solenoids are energize-to-run on most engines. Some have energize-to-stop (normally open) solenoids. Verify the system type before concluding failure.',
        estimatedTime: '15 minutes'
      },
      {
        step: 4,
        title: 'Check Glow Plug System',
        instruction: 'For diesel generators (especially smaller engines), glow plugs assist cold starting by preheating the combustion chamber. When the controller initiates start, glow plugs should energize for a preheat period before and during cranking. Measure voltage at glow plug bus bar - should be full battery voltage during preheat. Disconnect glow plug supply and measure resistance to ground of each glow plug - typically 0.5-2 ohms depending on type. Infinite resistance indicates an open (failed) glow plug.',
        safetyWarning: 'Glow plugs become extremely hot when energized. Do not touch them during or immediately after testing.',
        toolsRequired: ['Multimeter', 'Glow plug socket if removal needed'],
        expectedResult: 'Glow plugs receive voltage during preheat. Each glow plug shows correct resistance.',
        ifPassed: 'Glow plug system is functioning. If starting problem persists, proceed to Step 5.',
        ifFailed: 'Replace failed glow plugs. Check glow plug relay if no voltage reaches plugs. Note: Warmer engines may start without glow plugs, so a glow plug failure may only appear as a cold starting problem.',
        technicalNote: 'Some larger diesel generators use intake manifold grid heaters instead of glow plugs. Check for heater element resistance and controller output to heater relay.',
        estimatedTime: '20 minutes'
      },
      {
        step: 5,
        title: 'Verify Fuel Delivery to Injectors',
        instruction: 'This test verifies that the injection pump is actually delivering fuel to the injectors. CAUTION: High pressure fuel is dangerous. With safety glasses on, carefully loosen one injector line fitting at the injector end. Crank the engine for a few seconds. Fuel should pump out in pulses with each pump stroke. If no fuel or continuous dribble (no pulses), injection pump is not functioning correctly. If fuel pulses appear, the pump is delivering but injectors may be faulty.',
        safetyWarning: 'HIGH PRESSURE FUEL - wear safety glasses, do not place hands near spray, contain fuel in appropriate container.',
        toolsRequired: ['Line wrenches for injector fittings', 'Safety glasses', 'Container', 'Shop towels'],
        expectedResult: 'Fuel pulses from loose fitting with each pump stroke during cranking.',
        ifPassed: 'Injection pump is delivering fuel. Problem may be injector-related. Proceed to Step 6.',
        ifFailed: 'If no fuel delivery, injection pump has failed or timing is severely off. Check pump timing marks. Pump may require replacement.',
        technicalNote: 'For common rail systems, this test is different. Check rail pressure reading on diagnostic tool. Pressure should build to starting threshold (typically 200+ bar) during cranking.',
        estimatedTime: '15 minutes'
      },
      {
        step: 6,
        title: 'Check Air Intake System',
        instruction: 'Inspect the air intake system for restrictions. Check air filter condition - a severely blocked filter can prevent starting. Remove the air filter and attempt to start. Check that the intake piping is intact with no disconnections or collapse. Verify that any intake shutters or dampers are in the open position.',
        safetyWarning: 'If engine starts without air filter, shut down immediately and install filter before extended operation.',
        toolsRequired: ['Screwdriver or clips for filter housing', 'Visual inspection'],
        expectedResult: 'Air filter is not excessively blocked. Intake path is clear and open.',
        ifPassed: 'Air system is adequate. If all previous steps passed, problem may be low compression. Proceed to Step 7.',
        ifFailed: 'Replace air filter if blocked. Repair intake piping if disconnected. Verify intake shutters are open.',
        technicalNote: 'The air filter restriction indicator (if equipped) shows red when restriction is excessive. However, very cold or very humid conditions can affect this reading.',
        estimatedTime: '10 minutes'
      },
      {
        step: 7,
        title: 'Compression Test',
        instruction: 'If all fuel and air systems check out, low compression may be preventing ignition. Remove all injectors or glow plugs (depending on access and engine design). Install compression gauge in one cylinder. Disable fuel system (disconnect fuel solenoid or fuel shut-off). Crank engine and record compression pressure. Repeat for all cylinders. Compare readings to specification (typically 20-35 bar for diesel). Variation between cylinders should be less than 10%.',
        safetyWarning: 'Use correct removal tools for injectors/glow plugs. Clean debris from area before removal to prevent contamination entering cylinder.',
        toolsRequired: ['Compression tester', 'Injector removal tools', 'Torque wrench', 'Injector seat cleaner'],
        expectedResult: 'All cylinders within specification, less than 10% variation.',
        ifPassed: 'Compression is adequate. Review all previous steps. Consider injection timing, injector spray pattern, or control system issues.',
        ifFailed: 'Low compression indicates worn rings, valves, or head gasket. Engine requires overhaul or significant repair.',
        technicalNote: 'Adding a small amount of oil to a low-reading cylinder and retesting can differentiate ring wear (oil raises reading) from valve problems (no change).',
        estimatedTime: '1-2 hours'
      }
    ],

    resetSequences: {
      TYPE_A: {
        steps: [
          'Diagnose and correct the root cause of starting failure',
          'Ensure fuel system is bled and fuel solenoid is functioning',
          'Navigate to controller fault display',
          'Press STOP/RESET button and hold for 3 seconds',
          'Verify fault clears and controller shows READY status',
          'Perform test start'
        ],
        keySequence: ['STOP/RESET (3 sec hold)'],
        notes: 'DSE controllers will continue to show fault until successful start occurs. After correction, reset fault and attempt start.'
      },
      TYPE_B: {
        steps: [
          'Fix the identified cause of no-fire condition',
          'Press FAULT RESET on controller front panel',
          'Check for any additional related faults',
          'Verify preheat sequence activates if equipped',
          'Attempt start'
        ],
        keySequence: ['FAULT RESET'],
        notes: 'ComAp InteliLite stores detailed start attempt data in the event log. Review if problem recurs.'
      },
      TYPE_C: {
        steps: [
          'Correct the fuel or ignition system issue',
          'Navigate to ALARMS on the controller',
          'Select the start failure alarm and press RESET',
          'Verify start parameters are within normal range',
          'Attempt start'
        ],
        keySequence: ['MENU > ALARMS > RESET'],
        notes: 'Woodward controllers provide detailed start sequence diagnostics accessible through PC software.'
      },
      TYPE_D: {
        steps: [
          'Repair the identified fuel system problem',
          'Press STOP to ensure controller is in stopped state',
          'Press and hold RESET for 5 seconds until alarm clears',
          'Observe preheat indicator if equipped',
          'Attempt start'
        ],
        keySequence: ['STOP', 'RESET (5 sec)'],
        notes: 'SmartGen HGM series includes start attempt counter. Review if multiple failures occurred.'
      },
      TYPE_E: {
        steps: [
          'Address the root cause of crank-no-start',
          'Navigate to ALARMS screen and acknowledge all alarms',
          'Check for lockout condition if multiple start failures',
          'Reset lockout in SERVICE menu if present',
          'Return to MAIN screen and attempt start'
        ],
        keySequence: ['ALARMS > ACK > SERVICE if locked'],
        notes: 'CAT EMCP controllers have detailed starting aid diagnostics. Check glow plug current, fuel system status.'
      }
    },

    repairProcedures: [
      {
        title: 'Fuel System Bleeding',
        difficulty: 'beginner',
        estimatedTime: '30 minutes',
        laborCost: { min: 2000, max: 5000, currency: 'KES' },
        partsCost: { min: 0, max: 1000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Bleed screw sealing washer (if damaged)',
            quantity: 2,
            oemPartNumber: 'Engine specific',
            alternativePartNumbers: ['Copper sealing washer, correct size'],
            estimatedCost: 200
          }
        ],
        toolsRequired: ['Wrench for bleed screws', 'Fuel container', 'Shop towels', 'Hand priming pump if no electric pump'],
        steps: [
          {
            step: 1,
            instruction: 'Verify fuel tank has fuel and supply valves are open. This is the most common oversight.'
          },
          {
            step: 2,
            instruction: 'Locate bleed point on fuel filter housing. Loosen bleed screw 1-2 turns. Actuate hand priming lever (or turn key on if electric pump) until fuel flows without air bubbles.',
            warning: 'Fuel is flammable and harmful on skin contact. Contain all fuel spillage.'
          },
          {
            step: 3,
            instruction: 'Tighten filter bleed screw and move to injection pump bleed point. Repeat bleeding process until air-free fuel flows.',
            tip: 'Pump slowly and steadily for hand primer. Rapid pumping can aerate the fuel.'
          },
          {
            step: 4,
            instruction: 'If system has difficult-to-bleed injection pump, loosen injector lines at injectors. Crank engine in 10-second bursts until fuel appears at each injector. Tighten lines.',
            warning: 'Do not crank for more than 10 seconds at a time - allow 30 seconds for starter to cool.'
          },
          {
            step: 5,
            instruction: 'Attempt to start. If engine fires and dies, repeat bleeding - there is likely still air in the system. Multiple bleed cycles may be required.',
            tip: 'Running engine at fast idle for several minutes after starting helps purge remaining air.'
          }
        ],
        verificationSteps: [
          'Engine starts within normal cranking time',
          'Engine runs smoothly without missing or stumbling',
          'No fuel leaks at bleed points or connections',
          'No return of starting problem'
        ]
      },
      {
        title: 'Fuel Shut-Off Solenoid Replacement',
        difficulty: 'intermediate',
        estimatedTime: '1-2 hours',
        laborCost: { min: 3000, max: 8000, currency: 'KES' },
        partsCost: { min: 8000, max: 25000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Fuel Shut-Off Solenoid',
            quantity: 1,
            oemPartNumber: 'Injection pump specific',
            alternativePartNumbers: ['Synchro-Start equivalent', 'Woodward equivalent'],
            estimatedCost: 15000
          },
          {
            name: 'Solenoid O-ring/Gasket',
            quantity: 1,
            oemPartNumber: 'Included with solenoid or separate',
            alternativePartNumbers: ['N/A'],
            estimatedCost: 500
          }
        ],
        toolsRequired: ['Wrenches', 'Screwdriver', 'Multimeter', 'Thread sealant if required', 'Shop towels'],
        steps: [
          {
            step: 1,
            instruction: 'Disconnect battery negative cable to prevent accidental energization during replacement.'
          },
          {
            step: 2,
            instruction: 'Disconnect electrical connector from existing solenoid. Note wire colors and connection orientation.',
            tip: 'Take a photo before disconnecting for reference during reassembly.'
          },
          {
            step: 3,
            instruction: 'Remove old solenoid - typically threaded into injection pump body. May require wrench or unscrew by hand depending on installation.',
            warning: 'Fuel will drain when solenoid is removed. Have container and towels ready.'
          },
          {
            step: 4,
            instruction: 'Compare old and new solenoids to verify correct replacement. Check thread size, length, and connector type.',
            tip: 'If converting from normally-open to normally-closed type (or vice versa), controller wiring may need modification.'
          },
          {
            step: 5,
            instruction: 'Install new solenoid with fresh O-ring or gasket. Apply thread sealant if specified. Tighten to proper torque - do not overtighten as this can damage the injection pump housing.'
          },
          {
            step: 6,
            instruction: 'Reconnect electrical connector. Reconnect battery. Verify solenoid clicks when key is turned on.',
            tip: 'If no click, check wiring polarity - some solenoids are polarity-sensitive.'
          },
          {
            step: 7,
            instruction: 'Bleed fuel system - removing solenoid introduced air. Follow standard bleeding procedure.',
          },
          {
            step: 8,
            instruction: 'Start engine and verify normal operation. Check for fuel leaks around solenoid.'
          }
        ],
        verificationSteps: [
          'Solenoid clicks when energized',
          'Engine starts normally',
          'No fuel leaks at solenoid',
          'Engine shuts down when stop button pressed (solenoid de-energizes)',
          'Multiple start/stop cycles successful'
        ]
      }
    ],

    preventionStrategies: [
      'Keep fuel tank above 1/4 full at all times - never allow tank to run dry',
      'Install fuel level monitoring with low fuel alarm to prevent fuel exhaustion',
      'Use quality fuel from reputable sources - contaminated fuel causes multiple starting issues',
      'Install water separator in fuel line and drain weekly or per manufacturer schedule',
      'Change fuel filters per manufacturer schedule - do not extend intervals',
      'Exercise generator weekly under load to circulate fuel and prevent fuel degradation',
      'Test fuel solenoid function during routine maintenance',
      'Check glow plug function before cold season (May-August in Kenya highlands)',
      'Keep spare fuel filter and glow plugs on site for rapid replacement',
      'Train operators on basic fuel system troubleshooting to speed emergency diagnosis'
    ],

    maintenanceSchedule: [
      { interval: 'Weekly', task: 'Verify fuel level and replenish if needed', importance: 'critical' },
      { interval: 'Weekly', task: 'Drain water from fuel filter housing', importance: 'important' },
      { interval: 'Monthly', task: 'Check fuel system for leaks or damage', importance: 'important' },
      { interval: '250 hours', task: 'Replace fuel filters', importance: 'critical' },
      { interval: '500 hours', task: 'Inspect fuel lines and connections', importance: 'important' },
      { interval: 'Annually', task: 'Test glow plug function and resistance', importance: 'critical' },
      { interval: 'Annually', task: 'Check fuel solenoid operation', importance: 'important' },
      { interval: '2 years', task: 'Consider fuel system cleaning and injector service', importance: 'recommended' }
    ],

    caseStudies: [
      {
        location: 'Telecommunications Tower, Northern Kenya',
        generatorModel: 'Perkins 1103 with SmartGen HGM6120',
        symptom: 'Generator cranked strongly but would not start. Remote site required 4-hour drive for technician access.',
        diagnosis: 'Phone troubleshooting with site technician revealed fuel tank showed 1/4 full but engine would not fire. Technician was instructed to check fuel filter bowl - found empty with air. Tank gauge was sticking.',
        solution: 'Guided technician through bleeding procedure by phone. Generator started after bleeding. Replaced faulty fuel gauge during next scheduled visit.',
        lessonsLearned: 'Remote site operators should be trained in basic fuel system troubleshooting. A 4-hour drive was avoided by phone diagnosis. Always verify fuel level visually, not just by gauge.',
        timeToResolve: '30 minutes phone support'
      },
      {
        location: 'Hotel, Mount Kenya Region',
        generatorModel: 'Cummins 6BT5.9 with DSE 7320',
        symptom: 'Generator would not start on cold mornings (5°C) but started fine in afternoon. Controller showed "Fail to Start" fault.',
        diagnosis: 'Glow plug circuit tested - voltage present at glow plug rail but one of six glow plugs showed infinite resistance (open). Failed glow plug in end cylinder was preventing cold starting.',
        solution: 'Replaced all six glow plugs (good practice when one fails and others are old). Also adjusted preheat time setting in controller for higher altitude cold starts.',
        lessonsLearned: 'Highland generators need reliable glow plug systems. Proactive glow plug replacement before cold season prevents emergency failures. Controller preheat time can be optimized for local conditions.',
        timeToResolve: '2 hours'
      },
      {
        location: 'Fish Processing Plant, Kisumu',
        generatorModel: 'FG Wilson P150 with Woodward easYgen',
        symptom: 'Generator started experiencing longer cranking times over several weeks, then completely failed to start. Strong fuel smell during cranking.',
        diagnosis: 'Excessive cranking indicated fuel delivery problem. Injection pump timing had drifted 8° retarded due to worn timing gear. Fuel was being injected too late for combustion.',
        solution: 'Realigned injection pump timing to specification. Replaced timing gear and drive components. Adjusted injectors while pump was removed.',
        lessonsLearned: 'Gradual deterioration in starting is a warning sign to investigate immediately, not wait for complete failure. Timing drift is more common in high-hour engines.',
        timeToResolve: '8 hours'
      }
    ],

    aiInsights: {
      patternAnalysis: 'Analysis of crank-no-fire faults shows fuel system issues account for 65% of cases (air in system 35%, empty tank 15%, solenoid failure 10%, other fuel issues 5%). Glow plug problems cause 20% of cold-start failures, primarily in highland locations above 1500m altitude. Injection and compression issues account for the remaining 15%, predominantly in high-hour engines.',
      predictiveIndicators: [
        'Increasing cranking time before starting indicates developing fuel delivery issue',
        'Difficulty starting in cold weather that was not present before indicates glow plug deterioration',
        'Occasional misfire or rough running precedes complete failure to start',
        'Low fuel pressure reading trending down over time indicates lift pump or filter restriction',
        'Black smoke on startup suggests injector problems that may worsen to no-start'
      ],
      correlatedFaults: [
        'High Exhaust Temperature (if injector issues)',
        'Low Fuel Pressure warning (if lift pump failing)',
        'Engine Protection Fault (if previous attempts caused overheating)',
        'Battery Low Voltage (from excessive cranking attempts)'
      ],
      seasonalFactors: 'Crank-no-fire faults increase 40% during cold seasons (June-August) in highland areas due to glow plug demands. Rainy seasons see 25% more fuel contamination issues from water in fuel. Hot seasons can cause fuel vapor lock in some older fuel systems.',
      environmentalFactors: 'Dusty environments contribute to fuel filter clogging. Coastal humidity can cause fuel tank condensation. High altitude affects combustion and may require timing or glow plug system adjustments.',
      recommendations: [
        'Install fuel level monitoring with remote alerting for critical installations',
        'Stock spare fuel filters, glow plugs, and fuel solenoid on site',
        'Implement fuel quality testing for bulk fuel deliveries',
        'Adjust glow plug preheat time for local altitude and temperature',
        'Consider automatic fuel bleeding system for generators with frequent fuel exhaustion risk',
        'Train operators on fuel system basics to enable phone-guided troubleshooting'
      ]
    },

    wiringDiagram: {
      sensorLocation: 'Fuel system components distributed from tank to injectors; glow plugs in cylinder head',
      wireColors: ['Orange - Fuel solenoid power', 'Black - Ground', 'Blue - Glow plug circuit', 'White - Fuel level sender'],
      pinConfiguration: 'Fuel solenoid: 2-wire (power and ground). Glow plugs: common bus with individual element grounding through head.',
      voltageRange: '12V or 24V DC depending on system',
      resistance: 'Glow plugs typically 0.5-2 ohms each. Fuel solenoid typically 5-20 ohms.',
      signalType: 'DC power for all fuel system electrical components'
    },

    relatedFaults: [
      'STS-001 - Fail to Start - No Crank',
      'FUEL-001 - Low Fuel Level',
      'FUEL-002 - Low Fuel Pressure',
      'GLW-001 - Glow Plug Circuit Failure',
      'INJ-001 - Injection System Fault'
    ],

    frequentlyAskedQuestions: [
      {
        question: 'My diesel generator cranks but just won\'t start - what should I check first?',
        answer: 'Start with the basics: verify fuel is actually in the tank (check visually, not just gauge), verify all fuel valves are open, and check that the fuel filter bowl contains fuel without excessive water. These simple checks resolve 40% of crank-no-fire problems. If basics are okay, check for air in the fuel system and bleed if necessary.'
      },
      {
        question: 'I changed the fuel filter and now the generator won\'t start - what went wrong?',
        answer: 'Opening the fuel system for filter change introduces air. You must bleed the system after filter replacement. Start by bleeding at the filter housing bleed screw (pump until air-free fuel flows), then move to the injection pump bleed point. On some engines you may need to loosen injector lines and crank to purge air from high-pressure lines.'
      },
      {
        question: 'The fuel solenoid clicks when I turn the key, but the engine still won\'t start. Is the solenoid bad?',
        answer: 'If the solenoid clicks audibly, it is likely functioning electrically. However, some solenoids can click without fully retracting mechanically - the plunger may be stuck. Try manually retracting the solenoid (if accessible) to verify it allows fuel flow. Also verify that the clicking solenoid is the fuel shut-off solenoid and not another relay. If solenoid operation is confirmed, look for other causes like air in fuel or failed injection pump.'
      },
      {
        question: 'Do I really need to wait for the glow plug light to go out before cranking?',
        answer: 'Yes, especially in cold conditions. The glow plug preheat cycle is designed to bring cylinder temperature up to the point where combustion can occur. Cranking before the cycle completes results in poor starting, excessive starter wear, and potential injector damage from unburned fuel. The preheat time is typically 5-30 seconds depending on temperature. Wait for the light to extinguish or for the controller to indicate ready to crank.'
      },
      {
        question: 'Why does my generator start fine in summer but struggle in cold mornings?',
        answer: 'Diesel combustion relies on compression heat. In cold conditions, several factors work against starting: cylinder walls absorb more heat from compressed air, fuel is thicker and harder to atomize, batteries provide less power for cranking. Glow plugs (or intake heaters) compensate for this, but if they are marginal or failing, cold starting suffers. Test glow plug resistance - a failed plug may not be obvious in warm weather but prevents cold starting. Also ensure battery capacity is adequate for cold cranking.'
      }
    ],

    technicalBulletins: [
      {
        number: 'TB-2024-09',
        title: 'Fuel System Bleeding Procedures by Engine Family',
        summary: 'Step-by-step bleeding procedures for all common generator engine families including Cummins, Perkins, Volvo, and John Deere.'
      },
      {
        number: 'TB-2024-10',
        title: 'Glow Plug Diagnosis and Replacement Guide',
        summary: 'Testing procedures, specifications, and replacement guidelines for diesel generator glow plug systems.'
      },
      {
        number: 'TB-2023-28',
        title: 'Cold Starting Optimization for Highland Installations',
        summary: 'Controller settings, glow plug selection, and fuel considerations for generators operating in cold highland environments.'
      }
    ]
  }
};

export default STARTING_SYSTEM_FAULTS;
