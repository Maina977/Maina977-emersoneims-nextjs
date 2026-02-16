/**
 * COMPREHENSIVE GENERATOR FAULT DATABASE - PART 2
 * Cooling System and Lubrication Faults
 * World's Most Detailed Generator Diagnostic Database
 */

import type { EnhancedFaultCode } from '../enhanced-fault-database';

// ═══════════════════════════════════════════════════════════════════════════════
// COOLING SYSTEM FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const COOLING_SYSTEM_FAULTS: Record<string, EnhancedFaultCode> = {
  'COOL-001': {
    code: 'COOL-001',
    title: 'Low Coolant Level - Warning',
    alternativeCodes: ['LCL', 'COOLANT-LOW', 'E301', 'F201', 'DSE-2112'],
    severity: 'warning',
    category: 'Cooling System',
    subcategory: 'Coolant Level',
    affectedSystems: ['Radiator', 'Expansion Tank', 'Coolant Hoses', 'Water Pump', 'Head Gasket'],

    technicalOverview: `The Low Coolant Level warning is a critical early-detection alert that indicates the engine cooling system has lost a sufficient quantity of coolant to trigger the low-level sensor. This fault serves as a proactive warning designed to alert operators before the situation escalates to an overheating shutdown. The cooling system is a closed, pressurized circuit that should maintain stable coolant levels between service intervals. Any loss of coolant indicates a problem that will worsen if not addressed - either an external leak, an internal leak into combustion or oil systems, or evaporation through a failed pressure cap.

The coolant level sensor is typically a float switch or resistance-type sensor mounted in the radiator top tank or in the expansion/recovery tank. When coolant level drops below the sensor position, the circuit opens (or resistance changes) and the controller detects the low level condition. Some systems use multiple sensors for warning and shutdown thresholds. The sensor must be in contact with coolant to indicate a full condition, so any air in the system above the sensor position will trigger the warning.

Understanding the cooling system's design helps in diagnosing the cause of coolant loss. A typical generator cooling system includes the radiator, engine water jackets, thermostat housing, water pump, hoses, heater core (if equipped), and expansion tank. The system is filled with a mixture of water and antifreeze/coolant (typically 50/50) that provides corrosion protection, freezing protection, and slightly elevated boiling point. System pressure (typically 7-15 PSI / 0.5-1 bar) raises the boiling point further, preventing coolant loss through evaporation under normal operation.

Coolant loss can occur through several mechanisms. External leaks through damaged hoses, failed water pump seals, corroded radiator cores, or loose connections are visible and relatively easy to locate. Internal leaks through failed head gaskets or cracked cylinder heads allow coolant to enter the combustion chamber (producing white exhaust smoke and eventual hydrolocking) or the oil system (creating a milky emulsion that destroys bearings). Slow evaporation through a faulty pressure cap or overflow system can also gradually reduce level. Each type of leak has characteristic symptoms that guide diagnosis.`,

    systemImpact: `When coolant level drops, the cooling system's ability to remove heat from the engine is compromised in several ways. First, reduced coolant volume means less thermal mass to absorb and transport heat. Second, if level drops below the water pump inlet, cavitation or air entrainment can occur, dramatically reducing circulation. Third, air pockets in the system can create hot spots where coolant does not flow, leading to localized overheating even if average temperature seems acceptable.

The immediate risk of low coolant is engine overheating. Diesel engines generate tremendous heat during combustion - approximately one-third of fuel energy becomes heat that must be removed by the cooling system. For a 250 kVA generator, this represents roughly 80-100 kW of heat rejection requirement. If the cooling system cannot handle this load due to low coolant, temperatures rise rapidly. Unlike automotive applications where an overheated engine simply results in a tow truck call, generator overheating during a power outage can have cascading consequences for connected loads.

Internal coolant leaks present additional dangers beyond simple overheating. Coolant entering the combustion chamber through a failed head gasket causes white exhaust smoke, reduced power, and can hydrolock the engine if sufficient liquid accumulates in a cylinder. Coolant entering the oil system dilutes and emulsifies the oil, destroying its lubricating properties. The resulting bearing damage can occur quickly and is expensive to repair. The sweet smell of antifreeze in exhaust or a milky appearance in oil are critical warning signs requiring immediate shutdown.

A low coolant warning that goes unaddressed will eventually progress to high temperature shutdown. However, damage may occur before shutdown threshold is reached, especially if localized overheating causes cylinder head warping or gasket failure. The cost difference between addressing a low coolant warning (perhaps a hose repair) and repairing an overheating-damaged engine (head gasket, machine work, possible engine replacement) is enormous. Prompt response to low coolant warnings is essential preventive maintenance.`,

    safetyConsiderations: `Working with cooling systems requires respect for several hazards. Hot pressurized coolant can cause severe burns. Never remove a radiator cap or open any part of the cooling system when the engine is hot or has recently run. System pressure raises coolant boiling point above 100°C, so coolant that appears calm can instantly flash to steam when pressure is released, spraying scalding liquid. If you must check a warm system, cover the cap with a thick cloth and release pressure very slowly.

Engine coolant (antifreeze) is toxic. The ethylene glycol base is poisonous to humans and animals, and its sweet taste makes it attractive to children and pets. Handle coolant carefully, wearing nitrile gloves to prevent skin absorption. Clean up spills immediately and thoroughly. Dispose of used coolant properly through designated recycling facilities - never pour down drains or on the ground. Keep coolant containers sealed and secured away from children and animals.

When searching for external leaks, be aware of hot surfaces throughout the engine compartment. Exhaust manifolds, turbocharger housings, and engine blocks retain dangerous heat for extended periods after shutdown. Coolant that has sprayed from a leak may make surfaces slippery. Use appropriate lighting rather than feeling with hands to locate leaks.

If internal leak is suspected (coolant entering combustion chamber or oil), do not attempt to continue operating the engine. Running an engine with coolant-contaminated oil will cause rapid bearing failure. Running with coolant in a cylinder risks hydrolock - liquid cannot compress, so if enough coolant accumulates, piston or connecting rod damage will occur when the engine attempts to start. Internal leaks require professional diagnosis and repair before the engine is operated.`,

    historicalContext: `Engine cooling systems have evolved from simple thermosiphon arrangements to sophisticated electronically-controlled systems. Early engines relied on natural convection to circulate coolant - hot coolant rose through passages in the engine block, flowed through a high-mounted radiator where it cooled, and descended back to the engine. These systems were simple but limited in cooling capacity, restricting engine output and operating conditions.

The addition of mechanical water pumps, driven by the engine, enabled higher coolant flow rates and more compact engine designs. Pressurized systems, introduced in the 1930s-40s, raised boiling points and allowed higher operating temperatures for improved efficiency. The thermostat, a simple but elegant temperature-responsive valve, enabled engines to warm up quickly while preventing overheating. These fundamental components remain in use today, a testament to the effectiveness of proven designs.

Coolant chemistry has advanced significantly. Early engines used plain water, which promoted corrosion and froze in cold climates. The introduction of ethylene glycol-based antifreeze provided freezing protection and raised boiling point. Modern long-life coolants include sophisticated additive packages that protect dissimilar metals (iron, aluminum, brass, solder) throughout the cooling system, lubricate water pump seals, and maintain pH stability for 5 or more years. However, these benefits require using the correct coolant type for the engine.

Electronic monitoring of cooling system parameters became standard in generator applications by the 1990s. Simple mechanical temperature gauges gave way to electronic sensors feeding information to comprehensive controllers. Modern systems can monitor multiple temperature points, coolant level, and even coolant condition. This enables predictive maintenance - addressing issues based on trending data before failures occur. The low coolant warning is a direct product of this electronic monitoring, providing valuable early warning that was not available with older systems.`,

    rootCauses: [
      {
        cause: 'External Coolant Leak',
        probability: 45,
        explanation: 'Coolant is leaking from a visible external point - hose, connection, radiator, water pump, or freeze plug. This is the most common cause and usually the easiest to locate and repair.',
        testMethod: 'Visual inspection of entire cooling system when cold. Look for wet areas, white/green residue from dried coolant, or active drips. Pressure test system with cooling system pressure tester.',
        timeToTest: '20 minutes',
        toolsRequired: ['Flashlight', 'Inspection mirror', 'Cooling system pressure tester'],
        symptomsIndicating: ['Coolant puddle under generator', 'Visible wet spots on hoses or connections', 'White or green crusty deposits', 'Steam when engine is hot']
      },
      {
        cause: 'Failed Radiator Pressure Cap',
        probability: 20,
        explanation: 'The radiator pressure cap is not maintaining system pressure, allowing coolant to boil over into the overflow at lower-than-normal temperatures. Coolant is lost through the overflow system.',
        testMethod: 'Inspect cap seal condition. Test cap pressure rating with cap pressure tester - should hold within 10% of rated pressure.',
        timeToTest: '10 minutes',
        toolsRequired: ['Radiator cap pressure tester', 'Visual inspection'],
        symptomsIndicating: ['Overflow tank full or overflowing', 'Coolant loss with no visible leak', 'Cap seal shows cracks or damage', 'System doesn\'t hold pressure']
      },
      {
        cause: 'Internal Head Gasket Leak',
        probability: 15,
        explanation: 'Failed head gasket allows coolant to enter combustion chamber or oil system. Coolant is consumed internally with no visible external leak.',
        testMethod: 'Check exhaust for white smoke (coolant in combustion). Check oil for milky appearance (coolant in oil). Perform combustion gas test on radiator coolant.',
        timeToTest: '30 minutes',
        toolsRequired: ['Combustion leak tester kit', 'Oil inspection'],
        symptomsIndicating: ['White exhaust smoke', 'Milky oil on dipstick', 'Bubbles in radiator when running', 'Oily film on coolant surface', 'Coolant loss with no external leak']
      },
      {
        cause: 'Faulty Coolant Level Sensor',
        probability: 10,
        explanation: 'The sensor is giving false low readings due to stuck float, corroded contacts, or wiring issue. Actual coolant level may be normal.',
        testMethod: 'Visually verify actual coolant level. Test sensor resistance or continuity in both positions. Check wiring for damage.',
        timeToTest: '15 minutes',
        toolsRequired: ['Visual inspection', 'Multimeter for sensor testing'],
        symptomsIndicating: ['Coolant level appears normal visually', 'Sensor warning intermittent', 'Corrosion visible on sensor', 'Recent electrical work in area']
      },
      {
        cause: 'Water Pump Seal Leak',
        probability: 10,
        explanation: 'The water pump shaft seal has failed, allowing coolant to escape through the weep hole in the pump body. This is normal end-of-life failure for water pumps.',
        testMethod: 'Inspect water pump weep hole (small hole in pump body below shaft) for coolant seepage. Check for play in pump shaft.',
        timeToTest: '10 minutes',
        toolsRequired: ['Flashlight', 'Visual inspection'],
        symptomsIndicating: ['Coolant dripping from pump area', 'Pink/green residue near pump weep hole', 'Pump shaft has excessive play', 'Squealing noise from pump area']
      }
    ],

    diagnosticProcedures: [
      {
        step: 1,
        title: 'Verify Coolant Level and System Condition',
        instruction: 'With the engine COLD and stopped, safely remove the radiator cap (or expansion tank cap) and visually check coolant level. For radiator-filled systems, level should be visible near the top of the radiator neck. For expansion tank systems, level should be between MIN and MAX marks. Observe coolant condition - should be clean with proper color for coolant type (green, orange, pink, or blue depending on formulation). Note any oil contamination (milky appearance) or rust particles.',
        safetyWarning: 'NEVER remove radiator cap on a hot engine. System may be pressurized even after shutdown. Allow engine to cool below 50°C before opening.',
        toolsRequired: ['Flashlight', 'Visual inspection'],
        expectedResult: 'Coolant level at appropriate mark, clean condition, proper color.',
        ifPassed: 'If level is actually adequate, sensor may be faulty. Proceed to Step 6 to check sensor.',
        ifFailed: 'Coolant level is low. Top up to proper level and proceed to Step 2 to find the cause of loss.',
        technicalNote: 'Record the amount of coolant needed to refill. Significant loss (more than 1 liter) indicates a definite leak that must be found.',
        estimatedTime: '10 minutes'
      },
      {
        step: 2,
        title: 'Visual Inspection for External Leaks',
        instruction: 'With engine cold and clean (wash if necessary to see fresh leaks), perform detailed visual inspection of the entire cooling system. Check all hoses - upper and lower radiator hoses, heater hoses, bypass hoses - for cracks, swelling, or wet spots at connections. Inspect radiator for signs of leakage (often appearing as white/green deposits from evaporated coolant). Check water pump area including weep hole. Inspect thermostat housing and all connections. Check engine freeze plugs if accessible.',
        safetyWarning: 'Engine may have hot spots even when ambient temperature seems acceptable. Use caution.',
        toolsRequired: ['Flashlight', 'Inspection mirror', 'Clean rags'],
        expectedResult: 'All components dry with no evidence of leakage.',
        ifPassed: 'No external leak visible. Proceed to Step 3 for pressure test.',
        ifFailed: 'Leak identified at specific location. Note location and proceed to repair or replacement of leaking component.',
        technicalNote: 'Small leaks may only be visible while system is hot and pressurized. If no leak visible cold, pressure test will reveal it.',
        estimatedTime: '20 minutes'
      },
      {
        step: 3,
        title: 'Cooling System Pressure Test',
        instruction: 'With engine cold, remove radiator cap and attach cooling system pressure tester. Pump tester to bring system to cap rated pressure (stamped on cap, typically 7-15 PSI). Observe pressure gauge - system should hold pressure with minimal drop over 15 minutes. If pressure drops, watch and listen for leaks. Coolant may appear at a leak point that was not visible without pressure.',
        safetyWarning: 'Do not exceed rated cap pressure - system components are designed for specific maximum pressure.',
        toolsRequired: ['Cooling system pressure tester', 'Appropriate adapter for radiator'],
        expectedResult: 'System holds pressure with less than 1 PSI drop over 15 minutes.',
        ifPassed: 'No external leak detected under pressure. Proceed to Step 4 to check for internal leak.',
        ifFailed: 'Pressure drops and leak visible - repair indicated component. If pressure drops but no visible leak, internal leak likely.',
        technicalNote: 'A very slow pressure drop (0.5 PSI over 15 minutes) may be acceptable due to tester fit and temperature changes. Rapid drop indicates definite leak.',
        estimatedTime: '20 minutes'
      },
      {
        step: 4,
        title: 'Check for Internal Leak - Combustion Test',
        instruction: 'Internal head gasket leaks can allow combustion gases into the cooling system. Using a combustion leak detector (block tester), draw air from the radiator filler through the detector fluid while engine idles. The fluid changes color (typically blue to yellow/green) if combustion gases are present. Alternatively, observe radiator filler with cap removed while engine warms up - bubbles appearing indicate combustion gases entering cooling system.',
        safetyWarning: 'Keep face away from radiator opening. Hot coolant can splash as bubbles rise.',
        toolsRequired: ['Combustion leak detector kit', 'Safety glasses'],
        expectedResult: 'No color change in test fluid, no bubbles in coolant.',
        ifPassed: 'No combustion leak detected. Proceed to Step 5 to check for coolant in oil.',
        ifFailed: 'Combustion leak detected - head gasket failure (or cracked head). Requires engine repair.',
        technicalNote: 'Ensure coolant level is not so low that tester draws coolant liquid rather than air/gas. Top up if necessary before testing.',
        estimatedTime: '15 minutes'
      },
      {
        step: 5,
        title: 'Check for Coolant in Oil System',
        instruction: 'Check engine oil on dipstick for evidence of coolant contamination. Coolant in oil appears as a milky or chocolate-milk colored emulsion. Also check underside of oil filler cap for same appearance. If found, this indicates internal leak (head gasket, cracked block, or failed oil cooler if equipped) allowing coolant into lubrication system.',
        safetyWarning: 'If coolant is found in oil, DO NOT run the engine - oil has lost lubricating properties and bearing damage will result.',
        toolsRequired: ['Visual inspection of dipstick and filler cap'],
        expectedResult: 'Oil is normal color with no evidence of emulsion.',
        ifPassed: 'Oil is not contaminated. If all tests pass, leak may be intermittent, very slow, or sensor-related. Proceed to Step 6.',
        ifFailed: 'Coolant in oil - serious internal leak. Engine must not be run until repaired.',
        technicalNote: 'Small amounts of moisture condensation in oil during short-run periods is normal and should not be confused with coolant contamination. Coolant contamination is obvious and significant.',
        estimatedTime: '5 minutes'
      },
      {
        step: 6,
        title: 'Test Coolant Level Sensor',
        instruction: 'Locate the coolant level sensor (usually in radiator top tank or expansion tank). Disconnect the sensor electrical connector. With coolant at proper level (sensor submerged), measure sensor resistance or continuity - should indicate "full" state per manufacturer specification. Lower coolant level or manually push sensor float down - reading should change to "low" state. If sensor does not respond correctly, replace sensor.',
        safetyWarning: 'Avoid spilling coolant when checking sensor function.',
        toolsRequired: ['Multimeter', 'Sensor specification sheet'],
        expectedResult: 'Sensor reads correctly in both full and low positions.',
        ifPassed: 'Sensor is functional. If fault persists with good level and good sensor, check wiring between sensor and controller.',
        ifFailed: 'Sensor is faulty and gives false low reading. Replace sensor.',
        technicalNote: 'Float-type sensors can stick due to scale buildup. Try tapping sensor body gently to free float before condemning sensor.',
        estimatedTime: '15 minutes'
      }
    ],

    resetSequences: {
      TYPE_A: {
        steps: [
          'Identify and repair source of coolant loss',
          'Refill cooling system to proper level with correct coolant type',
          'Bleed air from system if required (check for bleed ports)',
          'Press STOP/RESET on controller for 3 seconds',
          'Verify fault clears and level warning extinguishes',
          'Start engine and verify level remains stable as system warms'
        ],
        keySequence: ['STOP/RESET (3 sec hold)'],
        notes: 'DSE controllers will not clear fault until sensor indicates adequate level. Ensure system is properly filled before attempting reset.'
      },
      TYPE_B: {
        steps: [
          'Repair coolant leak and refill system',
          'Run engine briefly to circulate coolant and reveal any air pockets',
          'Top up as needed after air bleeding',
          'Press FAULT RESET on controller',
          'Monitor level during extended test run'
        ],
        keySequence: ['FAULT RESET'],
        notes: 'ComAp controllers log the duration of low level condition. Review event log if recurring.'
      },
      TYPE_C: {
        steps: [
          'Address the cause of coolant loss',
          'Fill system and bleed air',
          'Navigate to ALARMS screen on controller',
          'Select Low Coolant alarm and press RESET',
          'Confirm alarm clears'
        ],
        keySequence: ['MENU > ALARMS > RESET'],
        notes: 'Woodward controllers may require both level restoration and fault reset.'
      },
      TYPE_D: {
        steps: [
          'Correct coolant leak and restore level',
          'Press RESET button until alarm LED extinguishes',
          'Verify coolant level indicator shows normal',
          'Test run to confirm no recurrence'
        ],
        keySequence: ['RESET (hold until clear)'],
        notes: 'SmartGen HGM controllers have adjustable level warning delays. Check if delay is appropriate for system.'
      },
      TYPE_E: {
        steps: [
          'Repair leak and refill cooling system',
          'Navigate to ALARMS and acknowledge Low Coolant',
          'Verify SERVICE menu shows no additional coolant-related faults',
          'Return to main display and confirm normal status'
        ],
        keySequence: ['ALARMS > ACK'],
        notes: 'CAT EMCP controllers may log extensive coolant history data. Review trends if problem recurs.'
      }
    },

    repairProcedures: [
      {
        title: 'Radiator Hose Replacement',
        difficulty: 'beginner',
        estimatedTime: '1 hour',
        laborCost: { min: 2000, max: 5000, currency: 'KES' },
        partsCost: { min: 3000, max: 15000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Radiator Hose (upper or lower)',
            quantity: 1,
            oemPartNumber: 'Engine/generator specific',
            alternativePartNumbers: ['Gates equivalent', 'Dayco equivalent'],
            estimatedCost: 6000
          },
          {
            name: 'Hose Clamps',
            quantity: 2,
            oemPartNumber: 'Size appropriate',
            alternativePartNumbers: ['Stainless T-bolt clamps recommended'],
            estimatedCost: 500
          },
          {
            name: 'Coolant for top-up',
            quantity: 5,
            oemPartNumber: 'Matching coolant type',
            alternativePartNumbers: ['Long-life coolant, correct color'],
            estimatedCost: 3000
          }
        ],
        toolsRequired: ['Pliers for clamps', 'Screwdriver', 'Drain pan', 'Funnel', 'Clean rags'],
        steps: [
          {
            step: 1,
            instruction: 'Ensure engine is cold. Place drain pan under radiator. Open radiator drain and/or remove lower hose to drain coolant below the hose to be replaced.',
            warning: 'Hot coolant causes burns. Allow adequate cooling time.',
            tip: 'If coolant is still good and clean, catch it for reuse.'
          },
          {
            step: 2,
            instruction: 'Release hose clamps at both ends of the hose to be replaced. If clamps are spring type, use pliers. If screw clamps, loosen screws.',
            tip: 'Photograph clamp positions before removal to ensure correct reinstallation.'
          },
          {
            step: 3,
            instruction: 'Twist and pull hose to remove from fittings. If stuck, carefully cut the old hose at the fitting (do not score the fitting). Remove any old hose material from the fitting surfaces.',
            warning: 'Do not use screwdriver to pry under hose - this can damage sealing surfaces.'
          },
          {
            step: 4,
            instruction: 'Install new hose clamps on new hose before fitting. Slide hose onto fittings - should fit firmly but not require excessive force. Position clamps properly (approximately 1/4" from hose end) and tighten.',
            tip: 'Applying a small amount of coolant to fittings helps hose slide on.'
          },
          {
            step: 5,
            instruction: 'Close radiator drain if opened. Refill cooling system with proper coolant mixture (typically 50/50 antifreeze and clean water). Fill slowly to minimize air entrapment. Bleed air if system has bleed ports.',
            tip: 'Fill to proper level, run engine to operating temperature with cap off, then top up as air bleeds out.'
          },
          {
            step: 6,
            instruction: 'Install radiator cap. Run engine to operating temperature and verify thermostat opens (upper hose becomes hot). Check for leaks at new hose connections. Recheck coolant level after cool-down.',
            tip: 'Recheck clamp tightness after heat cycling - clamps may need slight readjustment.'
          }
        ],
        verificationSteps: [
          'No leaks at hose connections',
          'Coolant level stable after running',
          'System reaches normal operating temperature',
          'Low coolant warning cleared',
          'Hoses secure with no rubbing on other components'
        ]
      },
      {
        title: 'Water Pump Replacement',
        difficulty: 'intermediate',
        estimatedTime: '3-5 hours',
        laborCost: { min: 8000, max: 20000, currency: 'KES' },
        partsCost: { min: 15000, max: 50000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Water Pump Assembly',
            quantity: 1,
            oemPartNumber: 'Engine specific',
            alternativePartNumbers: ['Aisin equivalent', 'GMB equivalent'],
            estimatedCost: 30000
          },
          {
            name: 'Water Pump Gasket',
            quantity: 1,
            oemPartNumber: 'Typically included with pump',
            alternativePartNumbers: ['Fel-Pro equivalent'],
            estimatedCost: 2000
          },
          {
            name: 'Coolant',
            quantity: 10,
            oemPartNumber: 'Matching type',
            alternativePartNumbers: ['Long-life coolant'],
            estimatedCost: 6000
          },
          {
            name: 'Thermostat (replace while accessible)',
            quantity: 1,
            oemPartNumber: 'Engine specific',
            alternativePartNumbers: ['Wahler equivalent', 'Stant equivalent'],
            estimatedCost: 3000
          }
        ],
        toolsRequired: ['Socket set', 'Torque wrench', 'Gasket scraper', 'Drain pan', 'Gasket sealant if required'],
        steps: [
          {
            step: 1,
            instruction: 'Allow engine to cool completely. Drain cooling system into clean container. Remove drive belt(s) to access water pump.',
            warning: 'Note belt routing before removal. Take photos if necessary.'
          },
          {
            step: 2,
            instruction: 'Remove components blocking access to water pump (may include alternator bracket, tensioner, fan shroud, or other accessories depending on engine layout).',
            tip: 'Organize and label bolts - they may be different lengths.'
          },
          {
            step: 3,
            instruction: 'Disconnect hoses attached to water pump. Remove mounting bolts and carefully remove pump, catching any residual coolant.',
            warning: 'Pump may be stuck due to gasket sealer. Do not pry against sealing surfaces.'
          },
          {
            step: 4,
            instruction: 'Clean gasket surfaces thoroughly. Remove all old gasket material without gouging aluminum surfaces. Ensure bolt holes are clean.',
            tip: 'A brass brush works well for cleaning without damaging surfaces.'
          },
          {
            step: 5,
            instruction: 'Install new gasket (use sealant if specified by manufacturer). Install new water pump and tighten bolts in correct sequence to specified torque.',
            warning: 'Follow torque specification - over-torquing can crack housing; under-torquing causes leaks.'
          },
          {
            step: 6,
            instruction: 'Reconnect hoses, reinstall accessories, and install belt(s). Verify proper belt tension and routing.',
            tip: 'While system is apart, inspect thermostat and replace if of uncertain age.'
          },
          {
            step: 7,
            instruction: 'Refill cooling system slowly. Bleed air from system. Start engine and allow to reach operating temperature. Check for leaks. Recheck coolant level after cool-down.',
            tip: 'It may take several heat cycles to fully purge air from system. Monitor level for first few days.'
          }
        ],
        verificationSteps: [
          'No coolant leaks',
          'Pump shaft rotates smoothly',
          'Proper belt tension',
          'Coolant circulates (upper hose hot when thermostat opens)',
          'Normal operating temperature reached',
          'No unusual noise from pump area'
        ]
      }
    ],

    preventionStrategies: [
      'Check coolant level weekly as part of routine generator inspection',
      'Use correct coolant type per engine manufacturer specification - mixing types can cause damage',
      'Replace coolant per manufacturer schedule (typically every 2-5 years depending on type)',
      'Inspect cooling system components during routine maintenance for early signs of wear',
      'Address small leaks immediately before they become large failures',
      'Install coolant level monitoring with remote alerting for critical installations',
      'Test coolant with refractometer to verify proper concentration (freeze protection)',
      'Pressure test cooling system during annual maintenance to find developing leaks',
      'Replace radiator pressure cap every 2-3 years as preventive measure',
      'Keep spare hoses and clamps on site for rapid repair capability'
    ],

    maintenanceSchedule: [
      { interval: 'Weekly', task: 'Visual check of coolant level and condition', importance: 'critical' },
      { interval: 'Monthly', task: 'Inspect hoses, clamps, and connections for deterioration', importance: 'important' },
      { interval: 'Quarterly', task: 'Test coolant freeze protection and condition', importance: 'important' },
      { interval: '6 months', task: 'Pressure test cooling system', importance: 'recommended' },
      { interval: 'Annually', task: 'Full inspection including water pump weep hole, thermostat function', importance: 'critical' },
      { interval: '2 years', task: 'Replace radiator cap as preventive measure', importance: 'recommended' },
      { interval: 'Per manufacturer', task: 'Complete coolant flush and refill (typically 2-5 years)', importance: 'critical' }
    ],

    caseStudies: [
      {
        location: 'Office Complex, Westlands, Nairobi',
        generatorModel: 'Cummins 6CTAA8.3 with DSE 7320',
        symptom: 'Low coolant warning recurring every 2-3 weeks. No visible external leak. Coolant level slowly dropping.',
        diagnosis: 'Detailed inspection found pinhole leak in radiator core, only visible when system hot and pressurized. Leak was so small that coolant evaporated before dripping.',
        solution: 'Radiator removed and sent for professional repair/re-core. Alternative: replace radiator for more severe damage. System refilled with fresh coolant.',
        lessonsLearned: 'Small leaks require pressure testing to locate. Had leak continued, eventual overheat would have been far more expensive than radiator repair.',
        timeToResolve: '4 hours including radiator removal/reinstallation after shop repair'
      },
      {
        location: 'Factory, Industrial Area, Mombasa',
        generatorModel: 'Perkins 1104 with ComAp InteliGen',
        symptom: 'Sudden low coolant warning after generator successfully passed weekly exercise. No prior symptoms.',
        diagnosis: 'Inspection found lower radiator hose had burst - significant coolant loss. Hose showed age-related deterioration (cracking, softening) that was not previously noticed.',
        solution: 'Replaced both upper and lower radiator hoses, thermostat housing hoses, and all clamps as preventive measure. System refilled. Implemented quarterly hose inspection.',
        lessonsLearned: 'Rubber hoses deteriorate with heat and age even if they look acceptable. In Mombasa\'s coastal climate, hose life is shorter due to humidity and salt air. Proactive replacement at 5 years is recommended.',
        timeToResolve: '2 hours'
      },
      {
        location: 'Hotel, Naivasha',
        generatorModel: 'FG Wilson P200 with Woodward easYgen',
        symptom: 'Low coolant alarm with no apparent coolant loss - level appeared normal.',
        diagnosis: 'Coolant level sensor float was stuck in low position due to scale buildup. Float would not rise with coolant level.',
        solution: 'Cleaned sensor and restored float movement. However, scale buildup indicated overdue coolant service. Performed complete coolant flush and installed fresh coolant.',
        lessonsLearned: 'False low level alarms can indicate overdue maintenance. The sensor didn\'t fail - the condition of the coolant (scale-forming) was the real problem.',
        timeToResolve: '3 hours including coolant flush'
      }
    ],

    aiInsights: {
      patternAnalysis: 'Analysis of low coolant faults shows: 50% are external leaks (hoses lead at 25%, radiator 15%, water pump 10%), 25% are pressure cap failures (coolant lost through overflow), 15% are internal leaks (head gasket most common), and 10% are sensor/false alarms. In Kenya\'s climate, hose degradation is accelerated by heat cycling and should be proactively replaced.',
      predictiveIndicators: [
        'Gradual increase in make-up coolant needed indicates developing leak',
        'Intermittent low level alarm suggests sensor degradation or marginal level',
        'White exhaust smoke indicates internal leak - requires immediate attention',
        'Visible weeping at water pump weep hole indicates seal failure within 3-6 months',
        'Hoses soft or spongy on squeeze are past service life'
      ],
      correlatedFaults: [
        'High Coolant Temperature (occurs after level drops critically low)',
        'Engine Protection Shutdown (if overheat occurs)',
        'Low Oil Pressure (if coolant enters oil and causes bearing damage)',
        'Starting Failure (if hydrolocking occurs from internal leak)'
      ],
      seasonalFactors: 'In Kenya, cooling system problems increase during hot dry seasons (January-March) due to higher heat loads and evaporation. Coastal areas see more corrosion-related failures year-round.',
      environmentalFactors: 'Dusty environments clog radiator fins, indirectly contributing to overheating if low coolant compounds the problem. Coastal salt air accelerates corrosion of radiator cores and hose clamps.',
      recommendations: [
        'Install transparent coolant overflow tank for easy visual level monitoring',
        'Use stainless steel hose clamps to prevent corrosion-related failures',
        'Stock spare radiator hoses, cap, and thermostat on site',
        'Implement coolant analysis program for critical installations',
        'Consider using extended-life coolant to reduce maintenance frequency',
        'Add coolant level monitoring to remote monitoring system for early warning'
      ]
    },

    wiringDiagram: {
      sensorLocation: 'Coolant level sensor mounted in radiator top tank or expansion tank, below minimum safe level',
      wireColors: ['Brown - Sensor signal', 'Black - Ground'],
      pinConfiguration: 'Typically 2-wire: signal and ground. Float-type or resistance-type.',
      voltageRange: 'Signal voltage varies with controller - typically 0-5V analog or switched 12V/24V',
      resistance: 'Float type: open/closed contact. Resistance type: variable per manufacturer spec.',
      signalType: 'Switch (open/closed) or analog resistance'
    },

    relatedFaults: [
      '110-0 - High Engine Coolant Temperature',
      'COOL-002 - Coolant Level Critical',
      'ENG-OVH - Engine Overheat Shutdown',
      'HEAD-GSK - Head Gasket Failure Indication'
    ],

    frequentlyAskedQuestions: [
      {
        question: 'Can I just add water if the coolant is low?',
        answer: 'In an emergency, yes - adding water is better than running with low coolant. However, water alone provides no corrosion protection and will reduce freeze protection. As soon as possible, either top up with proper coolant or drain some of the diluted mixture and replace with concentrated coolant to restore proper ratio (typically 50% antifreeze, 50% water).'
      },
      {
        question: 'My coolant looks rusty - is this a problem?',
        answer: 'Yes. Rust-colored coolant indicates corrosion inside the cooling system, usually from overdue coolant service or use of incorrect coolant type. This rust can clog passages, damage the water pump seal, and reduce cooling efficiency. The system needs to be flushed thoroughly and refilled with fresh coolant. The cause of the corrosion (wrong coolant, overdue service, air entering system) should be identified and corrected.'
      },
      {
        question: 'How do I know which coolant type to use?',
        answer: 'Always use the coolant type specified by the engine manufacturer. Different coolant types (IAT, OAT, HOAT) use different corrosion inhibitor chemistries that should not be mixed. The original coolant color (green, orange, pink, blue) is not a reliable guide since colors vary by manufacturer. Check the engine manual or consult with the manufacturer\'s dealer. When in doubt, flush completely and refill with the recommended type.'
      },
      {
        question: 'The low coolant light came on briefly then went out - should I worry?',
        answer: 'Yes, investigate. A brief warning indicates coolant level is marginal - just at the sensor threshold. Check actual level and top up if needed. More importantly, determine why level has dropped. If you\'ve been topping up more frequently than before, a small leak is developing and should be found before it becomes a major failure.'
      },
      {
        question: 'Is it okay to run with a missing radiator cap?',
        answer: 'No. The radiator cap is not just a cover - it maintains system pressure which raises the boiling point of coolant. Without the cap, coolant can boil at lower temperatures, causing overheating and coolant loss. A missing or faulty cap will cause continuous coolant loss through the overflow. Always install a proper cap rated for the system pressure.'
      }
    ],

    technicalBulletins: [
      {
        number: 'TB-2024-11',
        title: 'Coolant Types and Compatibility Guide',
        summary: 'Comprehensive guide to coolant types (IAT, OAT, HOAT), color coding, compatibility, and proper selection for various engine families.'
      },
      {
        number: 'TB-2024-12',
        title: 'Cooling System Inspection and Testing Procedures',
        summary: 'Detailed inspection procedures, pressure testing techniques, and acceptance criteria for generator cooling systems.'
      },
      {
        number: 'TB-2023-35',
        title: 'Internal Coolant Leak Diagnosis Guide',
        summary: 'Step-by-step procedures for diagnosing head gasket failures, cracked blocks, and other internal coolant leaks.'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LUBRICATION SYSTEM FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const LUBRICATION_FAULTS: Record<string, EnhancedFaultCode> = {
  'LUB-001': {
    code: 'LUB-001',
    title: 'Low Oil Level - Warning',
    alternativeCodes: ['LOL', 'OIL-LOW', 'E401', 'F301', 'DSE-2113'],
    severity: 'warning',
    category: 'Lubrication System',
    subcategory: 'Oil Level',
    affectedSystems: ['Engine', 'Oil Pan', 'Oil Pump', 'Bearings', 'Turbocharger'],

    technicalOverview: `The Low Oil Level warning is a critical alert indicating that engine oil quantity has dropped below the safe operating threshold. Engine oil performs multiple essential functions: lubricating moving parts to prevent metal-to-metal contact, cooling components that cannot be reached by the liquid cooling system, cleaning by carrying contaminants to the filter, sealing the interface between piston rings and cylinder walls, and protecting against corrosion. Inadequate oil level compromises all these functions and leads to accelerated wear and potential catastrophic failure.

The oil level sensing system typically uses a float switch or capacitive sensor mounted in the oil pan. When oil level drops below the sensor position, the controller receives a signal triggering the warning. Some systems have multiple sensors for warning and shutdown thresholds, while others use a single sensor with the controller providing time delay before shutdown. Understanding the specific configuration is important for interpreting the alarm behavior.

Oil level drops during normal operation for several reasons. All engines consume some oil during operation as a thin film on the cylinder wall is either burned or scraped into the combustion chamber. This consumption rate varies by engine design, age, and operating conditions but typically ranges from 0.1% to 0.5% of fuel consumption for a healthy engine. Higher consumption indicates wear that should be investigated. Oil can also be lost through external leaks at gaskets, seals, or connections.

The relationship between oil level and oil pressure is critical. The oil pump draws oil from the pan through a pickup tube and screen. If oil level drops below the pickup, the pump draws air, causing erratic pressure and oil starvation to bearings. Even if level is above the pickup, a low level reduces the oil reservoir, meaning the same oil circulates more frequently, running hotter and degrading faster. The thermal capacity of the oil charge is reduced, raising operating temperatures throughout the lubrication system.`,

    systemImpact: `Operating an engine with low oil level initiates a cascade of damaging effects. The immediate concern is oil starvation - if level drops below the pickup tube, the pump draws air and pressure collapses. This can occur suddenly during operation on slopes or during acceleration/deceleration that causes oil to slosh away from the pickup. Even brief oil starvation causes bearing damage that may not be immediately apparent but reduces engine life.

With reduced oil volume, the thermal load on each liter of oil increases proportionally. Oil that normally operates at 100°C may reach 120°C or higher, accelerating oxidation that breaks down the oil's molecular structure. Viscosity decreases, reducing the oil film thickness at bearing surfaces. Simultaneously, the oil must carry more contaminants per liter since the filter's contaminant capacity hasn't changed but the oil volume has decreased. This perfect storm of conditions - higher temperature, thinner oil, more contaminants - accelerates wear throughout the engine.

The turbocharger is particularly vulnerable to low oil conditions. Turbo bearings spin at speeds up to 150,000 RPM supported only by a thin oil film. Any reduction in oil supply to the turbo causes immediate bearing damage. Unlike engine bearings that can tolerate momentary low pressure, turbo bearings have no reserve capacity. Additionally, the turbo requires oil flow for cooling - the turbine side can reach temperatures of 900°C, and oil flow carries this heat away. Turbocharger replacement is one of the most common expensive consequences of running with low oil.

Long-term low oil operation causes premature engine wear throughout. Main bearings, rod bearings, and camshaft bearings all suffer accelerated wear. Piston rings and cylinder walls experience increased friction. Timing gears and chains wear faster. The cumulative effect is a shortened engine life and increased maintenance costs. A generator that could have run 30,000 hours may be worn out at 15,000 hours due to chronic marginal oil level operation.`,

    safetyConsiderations: `Used engine oil is classified as a hazardous waste due to contaminants absorbed during service including heavy metals, polycyclic aromatic hydrocarbons, and other potentially carcinogenic compounds. Always wear nitrile gloves when handling used oil or checking dipsticks. Avoid prolonged skin contact - wash thoroughly if skin exposure occurs. Never dispose of used oil in drains, on the ground, or in regular trash. Use designated oil recycling facilities.

Hot engine oil causes burns. After operation, oil can remain at temperatures exceeding 100°C for extended periods. Allow adequate cooling before draining oil or working on oil system components. Even checking the dipstick shortly after shutdown risks burns from the hot dipstick and potential oil splash.

When investigating oil leaks, be aware of other hot engine components. Exhaust manifolds and turbochargers can cause severe burns. Oil on hot exhaust components creates fire risk - clean any oil spills before running the engine. Have a fire extinguisher rated for Class B fires (flammable liquids) readily available when working around hot engines or open oil systems.

If low oil level results from internal leak into the fuel system or cooling system, additional hazards exist. Oil contaminating fuel creates combustion problems and possible injector damage. Oil in the cooling system damages hoses, seals, and water pump components. These conditions require professional diagnosis and repair - do not attempt to simply change oil and continue operation.`,

    historicalContext: `Engine lubrication systems have evolved from simple splash lubrication in early engines to sophisticated pressurized systems with electronic monitoring. Early engines relied on scoops on connecting rods dipping into oil collected in the crankcase, splashing oil onto cylinder walls and bearings. These systems were adequate for low-speed, low-output engines but could not support the demands of modern diesel performance.

Pressurized lubrication, using a gear-type pump driven by the engine, became standard by the 1930s. Oil galleries drilled through the block and crank delivered oil to all critical bearing surfaces. Pressure relief valves and filters improved reliability. Full-flow filtration, routing all oil through the filter, became common by the 1960s. These mechanical systems were reliable but provided no warning of problems until damage occurred.

Electronic oil level and pressure monitoring began appearing in generator applications in the 1980s. Early systems used simple float switches that triggered alarms or shutdowns. Modern controllers monitor pressure, temperature, and level continuously, implementing sophisticated protection strategies. Some systems even monitor oil condition using sensors that detect contamination or degradation.

The development of improved lubricant chemistry has paralleled mechanical advances. Modern diesel engine oils (API CJ-4, CK-4, FA-4 ratings) contain additive packages that provide exceptional wear protection, keep engines clean through detergent action, neutralize combustion acids, and maintain viscosity over extended drain intervals. These advances allow engines to operate reliably for thousands of hours - but only when proper oil level is maintained. The fundamental requirement of having enough oil in the engine remains unchanged regardless of how sophisticated the oil chemistry.`,

    rootCauses: [
      {
        cause: 'External Oil Leak',
        probability: 40,
        explanation: 'Oil is leaking from the engine through gaskets, seals, connections, or damaged components. External leaks are visible and usually leave evidence on the engine or ground beneath.',
        testMethod: 'Clean engine exterior and run at operating temperature. Inspect entire engine for fresh oil seepage. Common leak points: valve cover gasket, oil pan gasket, front and rear main seals, oil filter, oil cooler connections.',
        timeToTest: '30 minutes',
        toolsRequired: ['Flashlight', 'Inspection mirror', 'Clean rags'],
        symptomsIndicating: ['Oil spots under generator', 'Visible wet areas on engine', 'Oil drips when running', 'Oil smell when hot']
      },
      {
        cause: 'Normal Oil Consumption (Extended Interval)',
        probability: 25,
        explanation: 'Engine has consumed oil through normal operation and the service interval has been exceeded without adding oil. All engines consume some oil; this should be monitored and replenished.',
        testMethod: 'Review maintenance records for oil service interval. Check current level on dipstick. Note hours since last oil service.',
        timeToTest: '10 minutes',
        toolsRequired: ['Maintenance records', 'Dipstick reading'],
        symptomsIndicating: ['Extended hours since last service', 'Gradual level decrease over time', 'No visible leaks', 'Level consistently drops between checks']
      },
      {
        cause: 'Excessive Oil Consumption (Engine Wear)',
        probability: 15,
        explanation: 'Engine is consuming oil faster than normal due to worn piston rings, valve seals, or turbocharger seals. Oil is burned in combustion or passed into exhaust.',
        testMethod: 'Monitor oil consumption rate over multiple service intervals. Compare to manufacturer specification. Check exhaust for blue smoke indicating oil burning.',
        timeToTest: 'Multiple intervals',
        toolsRequired: ['Consumption records', 'Visual exhaust inspection'],
        symptomsIndicating: ['Blue exhaust smoke', 'Oil consumption exceeds 0.5% of fuel', 'High engine hours', 'Declining performance']
      },
      {
        cause: 'Faulty Oil Level Sensor',
        probability: 10,
        explanation: 'The oil level sensor is giving a false low reading due to stuck float, contaminated contacts, or wiring issue. Actual level may be normal.',
        testMethod: 'Verify actual oil level with dipstick. Test sensor operation by simulating low level condition. Check wiring for damage.',
        timeToTest: '15 minutes',
        toolsRequired: ['Dipstick verification', 'Multimeter for sensor test'],
        symptomsIndicating: ['Dipstick shows normal level', 'Intermittent alarm', 'Alarm after oil service', 'Sensor visible and appears damaged']
      },
      {
        cause: 'Recent Oil Service Error',
        probability: 10,
        explanation: 'Oil was recently changed but not filled to proper level. Incorrect quantity added, or drain plug/filter left loose allowing immediate loss.',
        testMethod: 'Check level on dipstick. Verify drain plug is tight. Verify oil filter is properly installed. Check area for recent large oil spill.',
        timeToTest: '10 minutes',
        toolsRequired: ['Dipstick', 'Visual inspection', 'Wrench for drain plug'],
        symptomsIndicating: ['Recent oil service', 'Large oil spill under generator', 'Loose drain plug', 'Oil filter not tight']
      }
    ],

    diagnosticProcedures: [
      {
        step: 1,
        title: 'Verify Oil Level on Dipstick',
        instruction: 'With engine stopped for at least 5 minutes (to allow oil to drain back to pan), remove dipstick, wipe clean, reinsert fully, and remove to read level. Level should be between MIN and MAX marks. Note the exact level and whether the oil appears clean or contaminated.',
        safetyWarning: 'Engine and oil may be hot shortly after operation. Allow cooling time or use appropriate protection.',
        toolsRequired: ['Clean rag for wiping dipstick'],
        expectedResult: 'Oil level between MIN and MAX marks. Oil appears clean with proper viscosity.',
        ifPassed: 'If level is adequate but alarm occurred, sensor may be faulty or oil was low and has been added. Proceed to Step 6 to check sensor.',
        ifFailed: 'Oil level is low. Add oil to correct level and proceed to Step 2 to find cause of loss.',
        technicalNote: 'On engines with oil coolers or large remote filters, oil drains back to pan slowly. Wait at least 5 minutes after shutdown for accurate reading.',
        estimatedTime: '5 minutes'
      },
      {
        step: 2,
        title: 'External Leak Inspection',
        instruction: 'With engine clean (wash if necessary to see fresh leaks), perform detailed visual inspection of entire engine for oil seepage. Check valve cover gasket(s), oil pan gasket, oil filter and its mounting pad, oil cooler and lines (if equipped), front crankshaft seal area, rear main seal area, oil pressure sender, and any other oil system connections.',
        safetyWarning: 'Engine components may be hot. Avoid touching exhaust manifold and turbocharger.',
        toolsRequired: ['Flashlight', 'Inspection mirror', 'Clean rags'],
        expectedResult: 'All areas dry with no evidence of oil seepage.',
        ifPassed: 'No external leak found. Proceed to Step 3 to check for internal consumption.',
        ifFailed: 'Oil leak identified at specific location. Repair or replace leaking component.',
        technicalNote: 'Small seepage at gaskets may be acceptable if not causing significant oil loss. Large drips or running leaks require immediate repair.',
        estimatedTime: '20 minutes'
      },
      {
        step: 3,
        title: 'Check for Oil Consumption Through Combustion',
        instruction: 'Run engine at operating temperature and observe exhaust color. Blue or gray smoke indicates oil burning. This can be due to worn piston rings (smoke worse under load), worn valve seals (smoke on deceleration or startup), or turbocharger seal failure (constant smoke). Quantity of smoke correlates with severity of consumption.',
        safetyWarning: 'Do not stand directly behind exhaust. Do not breathe exhaust fumes.',
        toolsRequired: ['Visual observation'],
        expectedResult: 'Exhaust is clear or light colored (water vapor on cold days is normal).',
        ifPassed: 'Engine is not burning significant oil. Proceed to Step 4 to check turbo.',
        ifFailed: 'Blue smoke indicates internal oil consumption. Refer to compression test and turbo inspection to identify source. Engine repair may be required.',
        technicalNote: 'A slight blue haze on cold start that clears after warm-up usually indicates valve seal wear - common in older engines and may be acceptable if oil consumption is not excessive.',
        estimatedTime: '15 minutes'
      },
      {
        step: 4,
        title: 'Inspect Turbocharger for Oil Leakage',
        instruction: 'If engine is turbocharged, remove air intake pipe from turbocharger compressor inlet. Inspect inside of compressor housing and impeller for oil accumulation. Oil in the compressor side indicates turbo seal failure. Also check turbo shaft play by grasping impeller and checking for excessive radial (side-to-side) movement. Some movement is normal; excessive play indicates bearing wear.',
        safetyWarning: 'Engine must be stopped and turbo must be cool before inspection.',
        toolsRequired: ['Screwdriver or tool for intake clamp', 'Flashlight'],
        expectedResult: 'Compressor housing and impeller dry or with minimal oil film. Shaft play within specification.',
        ifPassed: 'Turbocharger is not primary cause of oil consumption. Proceed to Step 5.',
        ifFailed: 'Oil in compressor or excessive shaft play indicates turbo requiring rebuild or replacement.',
        technicalNote: 'Some minor oil misting in compressor housing can occur if PCV system is not properly maintained. Check crankcase breather system as well.',
        estimatedTime: '15 minutes'
      },
      {
        step: 5,
        title: 'Calculate Oil Consumption Rate',
        instruction: 'Establish actual oil consumption rate over multiple service intervals. Record oil level at each check, amount added, and running hours. Calculate consumption as liters per 100 running hours or as percentage of fuel consumption. Compare to manufacturer specification (typically less than 0.3-0.5% of fuel consumption is acceptable for a healthy engine).',
        safetyWarning: 'None for calculation - paper exercise.',
        toolsRequired: ['Service records', 'Calculator'],
        expectedResult: 'Oil consumption within manufacturer specification.',
        ifPassed: 'Consumption is normal - ensure regular level checks and top-up as needed.',
        ifFailed: 'Excessive consumption indicates internal engine wear. Plan for overhaul or increased monitoring.',
        technicalNote: 'Oil consumption naturally increases somewhat with engine age. A significant step increase may indicate specific component failure rather than general wear.',
        estimatedTime: '20 minutes'
      },
      {
        step: 6,
        title: 'Test Oil Level Sensor',
        instruction: 'Locate oil level sensor (usually threaded into side of oil pan). Disconnect electrical connector and test sensor per manufacturer specification. Float-type sensors should show continuity change between submerged and exposed positions. Resistance-type sensors should show specified resistance change. Also check wiring from sensor to controller for damage.',
        safetyWarning: 'Ensure engine is stopped before working near oil pan.',
        toolsRequired: ['Multimeter', 'Sensor specification sheet'],
        expectedResult: 'Sensor responds correctly to level change. Wiring is intact.',
        ifPassed: 'Sensor is functional. If alarm persists with good level and good sensor, check controller input or look for intermittent conditions.',
        ifFailed: 'Sensor is faulty - replace. Verify problem is resolved after replacement.',
        technicalNote: 'Float-type sensors can stick due to sludge buildup. If sensor is marginal, improve oil change frequency to reduce sludge.',
        estimatedTime: '20 minutes'
      }
    ],

    resetSequences: {
      TYPE_A: {
        steps: [
          'Add oil to bring level within proper range on dipstick',
          'Identify and repair any oil leak source',
          'Press STOP/RESET on controller for 3 seconds',
          'Verify alarm clears',
          'Monitor level for recurrence'
        ],
        keySequence: ['STOP/RESET (3 sec hold)'],
        notes: 'DSE controllers require oil level to be adequate for reset. Some models have lockout if level was critically low.'
      },
      TYPE_B: {
        steps: [
          'Correct oil level to proper range',
          'Address root cause of oil loss',
          'Press FAULT RESET on controller',
          'Verify normal oil level indication'
        ],
        keySequence: ['FAULT RESET'],
        notes: 'ComAp controllers log duration of low level condition. Review for recurring pattern.'
      },
      TYPE_C: {
        steps: [
          'Restore oil level',
          'Navigate to ALARMS',
          'Select Low Oil Level alarm',
          'Press RESET'
        ],
        keySequence: ['MENU > ALARMS > RESET'],
        notes: 'Woodward controllers may display additional oil system diagnostics in SERVICE menu.'
      },
      TYPE_D: {
        steps: [
          'Add oil as needed',
          'Press RESET button until alarm clears',
          'Verify oil level indicator shows normal'
        ],
        keySequence: ['RESET (hold until clear)'],
        notes: 'SmartGen controllers have configurable oil level warning delays.'
      },
      TYPE_E: {
        steps: [
          'Correct oil level',
          'Navigate to ALARMS and acknowledge',
          'Verify SERVICE menu shows no oil-related faults',
          'Return to main display'
        ],
        keySequence: ['ALARMS > ACK'],
        notes: 'CAT EMCP controllers provide oil consumption trending data accessible through service tool.'
      }
    },

    repairProcedures: [
      {
        title: 'Oil Level Correction and Service',
        difficulty: 'beginner',
        estimatedTime: '30 minutes',
        laborCost: { min: 1000, max: 3000, currency: 'KES' },
        partsCost: { min: 2000, max: 8000, currency: 'KES' },
        partsRequired: [
          {
            name: 'Engine Oil (correct grade)',
            quantity: 5,
            oemPartNumber: 'Per engine specification',
            alternativePartNumbers: ['API CI-4 or CJ-4 15W-40 typical'],
            estimatedCost: 4000
          }
        ],
        toolsRequired: ['Funnel', 'Clean rag', 'Oil container'],
        steps: [
          {
            step: 1,
            instruction: 'Identify correct oil type for the engine (check service manual or door sticker). Common diesel generator oils are 15W-40 API CI-4 or CJ-4.',
            tip: 'Using incorrect oil can cause damage. When in doubt, consult manufacturer.'
          },
          {
            step: 2,
            instruction: 'With engine stopped and level on dipstick, add oil in small quantities (0.5L at a time). Recheck level after each addition. Do not overfill.',
            warning: 'Overfilling oil causes foaming, loss through breather, and potential seal damage.'
          },
          {
            step: 3,
            instruction: 'Fill to MAX mark on dipstick. Record quantity added and engine hours for consumption tracking.',
            tip: 'If more than 2-3 liters needed, investigate cause rather than just topping up.'
          },
          {
            step: 4,
            instruction: 'Start engine and verify oil pressure is normal. Check for any new leaks around filler or recently disturbed areas.',
          },
          {
            step: 5,
            instruction: 'Clear fault on controller and verify warning extinguishes. Run engine for several minutes and recheck level.',
            tip: 'After adding oil, some systems require running to circulate oil to full filter and cooler.'
          }
        ],
        verificationSteps: [
          'Oil level between MIN and MAX marks',
          'Low oil warning cleared',
          'Oil pressure normal when running',
          'No new leaks introduced'
        ]
      }
    ],

    preventionStrategies: [
      'Check oil level weekly as part of routine inspection - more frequently for high-use generators',
      'Record oil level at each check to track consumption trends',
      'Change oil per manufacturer schedule - do not extend intervals',
      'Use correct oil type (viscosity and specification) for the engine and conditions',
      'Address small leaks promptly before they become large problems',
      'Install low oil level monitoring with remote alerting for critical installations',
      'Keep oil inventory on site to enable immediate top-up',
      'Train operators to check oil as part of pre-start inspection',
      'Investigate any sudden increase in oil consumption'
    ],

    maintenanceSchedule: [
      { interval: 'Daily (if running)', task: 'Check oil level on dipstick before start', importance: 'critical' },
      { interval: 'Weekly', task: 'Check oil level even if generator has not run', importance: 'important' },
      { interval: '250 hours or 6 months', task: 'Change oil and filter', importance: 'critical' },
      { interval: '500 hours', task: 'Oil analysis to monitor engine condition', importance: 'recommended' },
      { interval: 'Annually', task: 'Full lubrication system inspection including all seals and gaskets', importance: 'important' }
    ],

    caseStudies: [
      {
        location: 'School, Kiambu County',
        generatorModel: 'Perkins 1104 with DSE 7310',
        symptom: 'Low oil warning after every exercise. Level appeared adequate on dipstick.',
        diagnosis: 'Oil level sensor was installed at wrong angle during previous service, causing float to stick. Sensor itself was functional.',
        solution: 'Repositioned sensor to correct angle. Also added more frequent dipstick checks to school\'s maintenance routine.',
        lessonsLearned: 'After any service involving the oil pan area, verify sensor function. Combination of electronic monitoring and manual checking provides redundancy.',
        timeToResolve: '1 hour'
      }
    ],

    aiInsights: {
      patternAnalysis: 'Low oil level faults are 60% due to missed maintenance checks, 25% external leaks, 10% excessive consumption, and 5% sensor issues. Most low oil conditions are completely preventable with routine inspection.',
      predictiveIndicators: [
        'Increasing oil consumption rate predicts developing engine wear',
        'Oil level dropping between weekly checks but not between services indicates slow leak',
        'Sudden oil loss indicates acute failure (new leak, gasket blow-out)'
      ],
      correlatedFaults: ['190-0 Low Oil Pressure', 'High Oil Temperature', 'Engine Knock Detected'],
      seasonalFactors: 'Oil consumption may increase slightly in very hot weather due to reduced viscosity. Generators in cold highland areas should use appropriate oil weight.',
      environmentalFactors: 'Dusty environments accelerate oil filter loading, potentially affecting oil consumption. Generators near coast may have more gasket corrosion issues.',
      recommendations: [
        'Implement weekly oil level checks as non-negotiable routine',
        'Install oil level monitoring with remote alerting',
        'Track consumption trends - investigate sudden changes',
        'Consider oil analysis program for critical engines'
      ]
    },

    wiringDiagram: {
      sensorLocation: 'Oil level sensor mounted in oil pan, typically at minimum safe oil level',
      wireColors: ['Brown - Signal', 'Black - Ground'],
      pinConfiguration: 'Float switch: 2-wire, contact open or closed based on level',
      voltageRange: '12V or 24V switched signal',
      resistance: 'Contact type: open circuit when low, closed circuit when OK (or reverse)',
      signalType: 'Switched DC signal'
    },

    relatedFaults: ['190-0 Low Oil Pressure', 'LUB-002 High Oil Temperature', 'LUB-003 Oil Pressure Sensor Fail'],

    frequentlyAskedQuestions: [
      {
        question: 'How often should I check oil level?',
        answer: 'For standby generators, check weekly even if the generator has not run. For running generators, check daily before starting. This simple habit prevents the majority of oil-related failures.'
      },
      {
        question: 'My generator uses some oil between changes - is this normal?',
        answer: 'Yes, all engines consume some oil. Normal consumption is typically 0.1-0.3% of fuel consumption. For a generator running 100 hours between services, this might be 0.5-2 liters. Higher consumption may indicate wear requiring investigation. Zero consumption would actually be unusual and might indicate an inaccurate level reading.'
      }
    ],

    technicalBulletins: [
      {
        number: 'TB-2024-13',
        title: 'Engine Oil Selection Guide',
        summary: 'Comprehensive guide to selecting correct oil type, viscosity, and specification for various diesel generator engines and operating conditions.'
      }
    ]
  }
};

export default { ...COOLING_SYSTEM_FAULTS, ...LUBRICATION_FAULTS };
