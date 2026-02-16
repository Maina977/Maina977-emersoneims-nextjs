/**
 * Enhanced Detailed Fault Codes Database - Part 2
 * Additional comprehensive fault codes covering electrical, fuel, battery, and communication systems
 */

import { DetailedFaultCode } from '@/components/generator-oracle/DetailedFaultDisplay';

export const ENHANCED_DETAILED_FAULT_CODES_PART2: Record<string, DetailedFaultCode> = {

  // ==================== GENERATOR OVERLOAD (0240) ====================
  '0240': {
    code: '0240',
    title: 'Generator Overload',
    severity: 'critical',
    category: 'Electrical Protection',
    subcategory: 'Load Management',

    overview: `Error code 0240 indicates that the generator is producing more power than its rated capacity, a condition that stresses both the engine and alternator beyond their design limits. Overload can be measured in terms of kW (real power), kVA (apparent power), or amperes on individual phases. Most controllers use multiple overload detection methods: sustained power above nameplate rating, current exceeding rated ampacity on any phase, or engine loading beyond its rated output. When overload is detected and persists beyond the programmed delay period, the controller takes protective action ranging from warning alarms to load shedding to complete shutdown.

The consequences of prolonged overload are severe for both the generator and connected loads. The alternator windings heat up proportionally to current squared, meaning a 20% overload causes 44% more heating than rated operation. This excess heat degrades winding insulation, shortens bearing life, and can cause permanent damage if temperatures exceed limits. The engine, working harder to drive the overloaded alternator, consumes more fuel, runs hotter, and experiences accelerated wear. Meanwhile, voltage begins to droop as the excitation system reaches its limits, causing the very problems undervoltage protection is designed to prevent.

Understanding power relationships helps diagnose overload causes. A generator's capacity is limited by both kW (determined mainly by the engine's power output) and kVA (determined mainly by the alternator's current-carrying capacity). A heavily inductive load like motors has a low power factor, meaning it requires more current (and hence more kVA) for a given kW output. A generator rated at 100kVA and 80kW can supply 80kW at unity power factor, but only about 64kW at 0.8 power factor while using full kVA capacity. Many overload situations involve power factor rather than pure overloading.

Three-phase load balance is another critical factor. Generator ratings assume reasonably balanced loading across all three phases. Severe imbalance causes one phase to be heavily loaded while others are light, potentially triggering single-phase overcurrent protection while total load is within rating. Measuring current on all three phases identifies imbalance issues. Additionally, harmonic loads from modern electronic equipment can cause current readings higher than expected for the actual power consumption, stressing the alternator even though kW demand seems acceptable.

Transient overloads during motor starting are normal and expected. Large motors can draw 6-8 times their running current during startup, causing momentary voltage dips and apparent overload conditions. Controllers typically have delay settings to ride through motor starting transients without tripping. However, frequent or prolonged starting transients (such as from undersized motors or stuck loads) can still cause problems over time.`,

    diagnosticProcedure: `Begin diagnosis by measuring the actual load on the generator using calibrated instruments. Record all three line currents, all three line-to-line voltages, and calculate power factor if your instruments allow. Compare the measured load against the generator nameplate ratings for kW, kVA, and rated current. This establishes whether true overload exists or whether the protection system is malfunctioning.

Identify what load changes preceded the overload alarm. Review the controller's event log to see when the overload occurred and what other events coincide. A sudden step from normal to overload suggests a large load came online - perhaps a motor starting or a transfer switch picking up additional load. A gradual increase suggests growing ambient temperature, generator derating, or progressive addition of small loads. Understanding the timeline helps identify the cause.

Check for load imbalance across the three phases. Ideally, all three phase currents should be within 10% of each other. Larger imbalances indicate unequal load distribution that should be corrected by moving single-phase loads between phases. Severe imbalance (one phase more than 25% different from average) should be corrected before resuming normal operation to prevent neutral overheating and unbalanced voltage conditions.

Evaluate the power factor of the load. Low power factor (below 0.8) significantly increases current demand for a given kW output, potentially causing current-based overload trips even when engine loading seems acceptable. Power factor can be measured directly with a power meter or calculated from kW, kVA, or voltage and current measurements. If power factor is low, consider adding power factor correction capacitors.

Review any derated capacity due to altitude, temperature, or other factors. Generators operating above 1000 meters altitude or in ambient temperatures above 40°C must be derated from their nameplate values. A generator rated 100kW at standard conditions might only be capable of 85kW in hot, high-altitude conditions. Verify the generator's derated capacity for your actual operating conditions and compare against measured load.

Check that all cooling systems are operating correctly, as impaired cooling effectively derates the generator. Verify radiator fan operation, alternator cooling air paths, and room ventilation. High alternator winding temperatures cause the alternator to reach thermal limits sooner, triggering overload protection at power levels below nameplate rating.`,

    resetInstructions: `Before resetting the overload alarm, ensure the load has been reduced to within the generator's capacity. Simply resetting and reconnecting the same overload will result in immediate re-tripping and potential damage. Identify which loads contributed to the overload and either reduce them or verify they have cycled off.

If the overload was caused by transient conditions (such as motor starting) that have passed, reset may be appropriate after verifying current load is within capacity. If the overload was caused by sustained excessive load, reduce load first by turning off non-essential equipment or by load shedding through the building's electrical system.

For DSE controllers: If the generator is still running at reduced load (breaker tripped but engine running), press RESET to clear the alarm and attempt breaker reclosure. If the generator has shut down, press STOP for 3 seconds, then RESET, then restart the generator. Verify load before closing the generator breaker.

For ComAp controllers: Navigate to ALARM LIST and reset the overload alarm. If load has been reduced and automatic breaker reclosure is configured, the controller may attempt to reconnect load automatically. Be prepared to intervene if overload recurs.

For Woodward controllers: Clear the fault through the SERVICE menu. Verify the overload timer has reset before attempting to reconnect load. Some Woodward controllers have configurable reclosure sequences that can be initiated after fault clearing.

After reset, monitor the load closely during reconnection. If possible, reconnect loads gradually rather than all at once, observing generator response at each step. If overload protection activates again at a lower-than-expected load level, investigate generator capacity issues such as cooling system problems, sensor calibration, or actual component derating.`,

    solutionGuide: `Solving overload problems requires either reducing the load or increasing the available generation capacity. The appropriate solution depends on whether the overload is temporary (motor starting, peak demand periods) or sustained (continuous load exceeds generator capacity).

For sustained overload exceeding generator capacity, the permanent solution is either load reduction or capacity increase. Load reduction approaches include efficiency improvements (replacing old motors with high-efficiency models, LED lighting conversions), load management (preventing multiple large loads from running simultaneously through interlocking or sequencing), and demand response (allowing non-critical loads to be curtailed during peak periods). Capacity increase means either upgrading to a larger generator or adding a second generator in parallel operation.

For transient overloads during motor starting, several solutions can reduce the impact without changing the generator. Soft starters or variable frequency drives (VFDs) dramatically reduce motor starting current, typically to 2-3 times rated instead of 6-8 times rated. Star-delta starters or auto-transformer starters provide reduced-voltage starting at lower cost than VFDs. Load sequencing ensures only one large motor starts at a time, with delays between starts. Some generators can accept brief overloads during starting - verify that protection settings include appropriate time delays for motor starting without compromising protection.

For power factor-related issues causing current overload while kW is acceptable, add power factor correction capacitors. Size capacitors to bring overall power factor to 0.9-0.95 (avoid overcorrection which can cause leading power factor problems). Capacitors can be installed at main distribution or at individual large motor loads. Note that power factor correction does not reduce actual kW demand - it only reduces kVA and current.

For load imbalance issues, redistribute single-phase loads among the three phases to achieve better balance. This may require rewiring of distribution panels or relocation of single-phase equipment. Document the phase assignment of each load to enable ongoing balance management. For severely unbalanced loads that cannot be redistributed (such as large single-phase equipment), consider installing a phase balancer or upgrading to a larger generator with more headroom.

If the generator cannot support the required load even after optimization, generator replacement or addition is required. Size the new generator with appropriate margin (typically 70-80% loading at maximum expected demand) and consider future load growth. For critical facilities, consider parallel generator systems that provide redundancy and right-sizing capability.`,

    possibleCauses: [
      { cause: 'Total connected load exceeds generator capacity', likelihood: 'high', testMethod: 'Measure actual load and compare to generator nameplate rating' },
      { cause: 'Large motor starting causing transient overload', likelihood: 'high', testMethod: 'Observe load during motor starting; check for soft starters' },
      { cause: 'Low power factor increasing current demand', likelihood: 'medium', testMethod: 'Measure power factor; compare kW to kVA load' },
      { cause: 'Unbalanced load concentrating current on one phase', likelihood: 'medium', testMethod: 'Measure current on all three phases; calculate imbalance' },
      { cause: 'Generator derated due to altitude or temperature', likelihood: 'medium', testMethod: 'Verify operating conditions vs. generator rating conditions' },
      { cause: 'Cooling system impairment reducing effective capacity', likelihood: 'low', testMethod: 'Check cooling fans, ventilation, radiator condition' },
      { cause: 'Overcurrent or overload sensor malfunction', likelihood: 'low', testMethod: 'Compare sensor readings with external meter measurements' },
      { cause: 'Controller protection settings too sensitive', likelihood: 'low', testMethod: 'Review overload thresholds and delays in configuration' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure actual generator load (kW, kVA, amperes, power factor)',
        tools: ['Power analyzer or clamp meter and power meter', 'True-RMS instruments'],
        expectedResult: 'Load measurements within generator ratings',
        ifFailed: 'Identify source of excess load; reduce or redistribute',
      },
      {
        step: 2,
        action: 'Check load balance across three phases',
        tools: ['Clamp ammeter'],
        expectedResult: 'All phase currents within 10% of average',
        ifFailed: 'Redistribute single-phase loads among phases',
      },
      {
        step: 3,
        action: 'Review power factor of load',
        tools: ['Power factor meter or power analyzer'],
        expectedResult: 'Power factor 0.85 or higher',
        ifFailed: 'Consider power factor correction capacitors',
      },
      {
        step: 4,
        action: 'Verify generator is not derated for operating conditions',
        tools: ['Generator manual', 'Thermometer', 'Altimeter'],
        expectedResult: 'Operating within standard conditions or load adjusted for derating',
        ifFailed: 'Apply derating factor and reduce load accordingly',
      },
      {
        step: 5,
        action: 'Check cooling system operation',
        tools: ['Visual inspection', 'Temperature measurements'],
        expectedResult: 'All cooling systems operating normally',
        ifFailed: 'Repair cooling system before loading to capacity',
      },
      {
        step: 6,
        action: 'Review recent load additions or changes',
        tools: ['Load inventory', 'Controller event log'],
        expectedResult: 'Understanding of what changed before overload',
        ifFailed: 'Investigate new or modified loads',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Reduce load to within generator capacity before resetting',
        warning: 'Reconnecting same overload will cause immediate re-trip',
      },
      {
        step: 2,
        instruction: 'Verify current load is acceptable using external meters',
      },
      {
        step: 3,
        instruction: 'Press RESET to clear overload alarm',
        keySequence: ['RESET'],
      },
      {
        step: 4,
        instruction: 'If generator breaker tripped, close breaker to reconnect load',
      },
      {
        step: 5,
        instruction: 'Reconnect loads gradually while monitoring generator',
        warning: 'Do not reconnect all loads simultaneously',
      },
      {
        step: 6,
        instruction: 'Monitor load and generator response for at least 15 minutes',
      },
    ],

    repairSolutions: [
      {
        solution: 'Install Soft Starters for Large Motors',
        difficulty: 'moderate',
        timeEstimate: '2-4 hours per motor',
        partsNeeded: ['Soft starter sized for motor HP/kW', 'Control wiring', 'Mounting hardware'],
        toolsRequired: ['Electrician tools', 'Multimeter', 'Motor circuit analysis'],
        procedureSteps: [
          'Identify motors with problematic starting current',
          'Select soft starter rated for motor nameplate current',
          'De-energize motor circuit and lock out',
          'Install soft starter between power supply and motor',
          'Wire control circuit per soft starter instructions',
          'Set starting parameters (ramp time, current limit)',
          'Test operation and adjust as needed',
          'Document installation for future reference',
        ],
        costEstimate: { min: 50000, max: 200000, currency: 'KES' },
      },
      {
        solution: 'Add Power Factor Correction Capacitors',
        difficulty: 'moderate',
        timeEstimate: '2-4 hours',
        partsNeeded: ['Power factor correction capacitors (kVAr sized to load)', 'Contactors if switched', 'Protection fuses'],
        toolsRequired: ['Electrician tools', 'Power factor meter', 'Wiring supplies'],
        procedureSteps: [
          'Measure current power factor under typical load',
          'Calculate required capacitor kVAr for target power factor',
          'Select capacitors rated for system voltage',
          'Install capacitors at main distribution or at large loads',
          'Add protection and disconnect means',
          'Test power factor improvement under load',
          'Verify no overcorrection (leading power factor)',
        ],
        costEstimate: { min: 30000, max: 150000, currency: 'KES' },
      },
      {
        solution: 'Redistribute Single-Phase Loads',
        difficulty: 'moderate',
        timeEstimate: '2-8 hours',
        partsNeeded: ['Possibly new wiring or breakers'],
        toolsRequired: ['Electrician tools', 'Clamp ammeter', 'Circuit tracers'],
        procedureSteps: [
          'Measure current on all three phases',
          'Identify distribution of single-phase loads',
          'Plan redistribution to balance phases',
          'De-energize circuits to be modified',
          'Move loads between phases as planned',
          'Re-measure phase currents to verify balance',
          'Update panel schedules and documentation',
        ],
        costEstimate: { min: 10000, max: 50000, currency: 'KES' },
      },
      {
        solution: 'Generator Upgrade or Addition',
        difficulty: 'expert',
        timeEstimate: 'Days to weeks (major project)',
        partsNeeded: ['Larger generator or additional generator', 'Associated switchgear and controls'],
        toolsRequired: ['Professional installation by generator supplier'],
        procedureSteps: [
          'Calculate total load including growth projections',
          'Select generator with appropriate capacity and margin',
          'Plan installation including fuel, exhaust, ventilation',
          'Obtain permits and approvals',
          'Install generator and commissioning testing',
          'Integrate with existing system if paralleling',
          'Train operators on new equipment',
        ],
        costEstimate: { min: 500000, max: 5000000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'Overloaded generators can overheat and cause fires - do not ignore overload alarms',
      'Do not bypass or disable overload protection',
      'Always de-energize circuits before working on electrical systems',
      'Power factor correction capacitors store dangerous charge even when disconnected',
      'Verify load is reduced before resetting and reconnecting',
      'Monitor generator closely after clearing overload condition',
    ],

    preventionTips: [
      'Size generator with 20-30% margin above maximum expected load',
      'Perform annual load survey to identify creeping demand growth',
      'Sequence motor starting to prevent simultaneous starts',
      'Install soft starters or VFDs on large motors',
      'Maintain power factor above 0.85 with correction capacitors',
      'Balance single-phase loads across three phases',
      'Account for derating factors in hot climates or at altitude',
      'Monitor load regularly and trend for early warning of growth',
    ],

    relatedCodes: ['0240-1', 'LOAD-01', 'CUR-01', '0230', '0250'],
    technicalNotes: 'Generator overload protection typically has two thresholds: warning (typically 100-110% of rated) with time delay, and trip (typically 110-125% of rated) with shorter delay. Some controllers use inverse-time characteristics similar to circuit breakers. Motor starting transients typically allowed for 10-30 seconds depending on controller settings. Always verify both kW and kVA loading - a generator can be overloaded on current (kVA) while kW seems acceptable if power factor is low.',
  },

  // ==================== LOW BATTERY VOLTAGE (0320) ====================
  '0320': {
    code: '0320',
    title: 'Low Battery Voltage',
    severity: 'warning',
    category: 'Electrical',
    subcategory: 'DC System',

    overview: `Error code 0320 indicates that the DC battery voltage supplying the generator control system has dropped below acceptable operating limits. Most generator controllers require stable DC power in the range of 8-35V (for 12V systems, typically 10.5-16V; for 24V systems, typically 21-32V) to operate properly. When battery voltage drops too low, the controller may malfunction, produce erratic readings, fail to operate output relays, or shut down completely. More critically, low battery voltage often indicates that there won't be enough starting power available when the generator needs to start, potentially causing a fail-to-start condition at the worst possible time.

The battery system in a generator installation serves multiple critical functions. First, it powers the generator controller continuously, maintaining settings, monitoring for start commands, and enabling remote communication. Second, it powers the starting motor during engine cranking, requiring high current delivery capability. Third, on some installations, it powers safety systems, cooling system controls, and fuel system components. A compromised battery system affects all of these functions and can render the generator unable to start or operate correctly.

Battery voltage drops for several reasons, each requiring different corrective action. A discharged battery has depleted its stored energy through normal use, parasitic loads, or lack of recharging - this simply needs recharging. A failed battery has internal damage preventing it from holding charge - this requires replacement. A charging system failure means the alternator or battery charger isn't replenishing battery energy - this requires charging system diagnosis and repair. Excessive parasitic loads can drain the battery faster than normal - identifying and eliminating these loads resolves the problem.

The warning threshold is intentionally set above the level where the controller fails, giving advance notice to correct the problem before it causes operational failures. However, the warning also indicates that starting capability is compromised - a battery that can't maintain voltage during normal operation certainly can't deliver the hundreds of amps needed for engine cranking. The fail-to-start scenario that often follows low battery conditions is more serious than the low battery alarm itself.

For generators in standby service, low battery is particularly critical because the generator may be called to start at any time, including during utility power failures when no external charging is available. Standby generators typically have battery chargers that maintain full charge during normal operation, so a low battery alarm on a standby generator indicates charger failure or recent extended operation without recharge.`,

    diagnosticProcedure: `Begin diagnosis by measuring actual battery voltage with a calibrated multimeter at the battery terminals. Compare this reading to the controller's displayed value to verify measurement accuracy. For a 12V system, healthy resting voltage should be 12.4-12.8V; for 24V systems, 24.8-25.6V. Lower readings indicate a discharged or failing battery. Higher readings during charging (up to 14.5V for 12V or 29V for 24V) are normal; higher than this indicates charging system problems.

Perform a load test on the battery to determine if it can still deliver adequate current. A battery load tester applies a heavy load (typically half the CCA rating) for 15 seconds while monitoring voltage. A healthy battery maintains voltage above 9.6V (12V system) or 19.2V (24V system) during the test. Batteries that drop below these thresholds during load testing should be replaced regardless of resting voltage, as they will not reliably start the engine.

Inspect the battery and cables for physical problems. Look for corroded terminals (white or green deposits), which cause resistance and voltage drop. Check cable tightness - loose connections cause intermittent problems and high-resistance failures. Examine battery cases for cracks or bulging that indicate internal damage. Check electrolyte level in serviceable batteries - low fluid levels cause reduced capacity and permanent damage if plates are exposed.

Evaluate the charging system to ensure proper recharging capability. For generators with engine-driven alternators, verify alternator output while running - should be 13.8-14.5V (12V system) or 27.6-29V (24V system). For generators with standalone battery chargers, check charger operation - output voltage and current should be within specifications. Trace the charging circuit for problems including blown fuses, tripped breakers, or damaged wiring. If the charger shows no output, it may require repair or replacement.

Check for parasitic loads draining the battery during non-operation periods. With the generator stopped and charger disconnected, measure current draw from the battery using a clamp ammeter on the battery cable or an in-line ammeter. Normal standby current for most controllers is 50-200mA; significantly higher currents indicate parasitic loads that should be identified and eliminated or reduced.

Review operating history to understand the context of low voltage. Has the generator been running frequently without recharge time? Has it been sitting unused with a failed charger? Did a recent start failure deplete the battery? Understanding how the battery became discharged helps identify corrective actions beyond simply recharging.`,

    resetInstructions: `The low battery alarm typically clears automatically when battery voltage returns to acceptable levels after charging. However, simply recharging a battery without addressing the root cause will result in recurring low battery conditions. Ensure the charging system is functioning and any parasitic loads are addressed before considering the problem resolved.

If the battery was simply discharged due to extended cranking attempts or temporary charger interruption, recharging should resolve the issue. Connect a battery charger and monitor voltage rise over several hours - a healthy battery should accept charge and reach full voltage. Once voltage is adequate, the alarm should clear automatically on most controllers.

For DSE controllers: The low battery warning typically auto-resets when voltage rises above the configured threshold plus hysteresis (usually 1-2V above the warning setpoint). No manual reset is required unless a lockout condition resulted from the low battery.

For ComAp controllers: Battery warnings are typically self-clearing conditions. Verify battery voltage is in normal range and the warning should clear. Check the ALARM HISTORY to confirm the alarm is no longer active.

For SmartGen controllers: Low battery conditions are monitored continuously and alarms clear when voltage normalizes. If the generator failed to start due to low battery, reset the fail-to-start lockout after charging.

After the alarm clears, verify the charging system is maintaining proper voltage. Monitor battery voltage over several days to ensure it remains stable. If voltage gradually drops even with the charger operating, either the charger is inadequate, there are parasitic loads, or the battery is failing and requires replacement.`,

    solutionGuide: `Solving low battery problems requires addressing both the immediate condition (discharged battery) and the underlying cause (why it discharged). Simply recharging repeatedly without fixing the root cause results in recurring problems and potential starting failures.

For discharged but healthy batteries, recharging restores normal operation. Use an appropriate charger (automotive charger for 12V, 24V charger for 24V systems) and charge until fully recovered - several hours minimum, overnight preferred. Monitor charging to ensure the battery accepts charge and voltage rises appropriately. A battery that won't accept charge or has very low initial voltage may be sulfated from extended discharge and may require special recovery charging or replacement.

For failed batteries that won't hold charge despite proper charging, replacement is the only solution. Replace with equivalent or better capacity (match CCA rating and group size). Dispose of old batteries properly at authorized recycling facilities. When installing new batteries, clean and tighten all connections and verify proper charging system operation.

For charging system failures, diagnose and repair or replace the faulty components. Engine-driven alternator problems may involve the alternator itself, voltage regulator, wiring, or drive belt. Test alternator output independently if possible. Standalone battery chargers may have failed power supplies, control circuits, or connections - some can be repaired while others require replacement. Ensure charger capacity is adequate for the battery size and any parasitic loads.

For parasitic load problems, identify and eliminate or reduce the excessive current draw. Common culprits include aftermarket accessories, failed diodes in alternators allowing reverse current flow, relay coils remaining energized, or control system faults. Methodically disconnect circuits while monitoring current draw to isolate the source. Once found, repair or remove the offending load.

For generators in locations without reliable charging power, consider installing solar trickle chargers or connecting to a reliable auxiliary power source. Battery maintenance chargers with smart charging profiles help maintain batteries in long-term standby service.

Consider battery chemistry upgrades for improved performance. AGM (Absorbed Glass Mat) batteries offer better cycling capability and longer life than flooded lead-acid in generator applications. Lithium starter batteries provide superior power density and cycle life but require compatible charging systems. Match battery choice to application requirements and available charging infrastructure.`,

    possibleCauses: [
      { cause: 'Battery discharged due to extended cranking or charger interruption', likelihood: 'high', testMethod: 'Review operating history, check charger connection and operation' },
      { cause: 'Battery charger failure', likelihood: 'high', testMethod: 'Measure charger output voltage and current' },
      { cause: 'Battery at end of service life', likelihood: 'medium', testMethod: 'Load test battery, check age and maintenance history' },
      { cause: 'Corroded or loose battery connections', likelihood: 'medium', testMethod: 'Inspect terminals, measure voltage drop across connections' },
      { cause: 'Excessive parasitic loads draining battery', likelihood: 'medium', testMethod: 'Measure standby current draw with clamp meter' },
      { cause: 'Alternator failure on engine-driven charging systems', likelihood: 'low', testMethod: 'Measure alternator output while running' },
      { cause: 'Short circuit in wiring or equipment', likelihood: 'low', testMethod: 'Check for hot wires, blown fuses, burning smell' },
      { cause: 'Battery low on electrolyte (flooded batteries only)', likelihood: 'low', testMethod: 'Check electrolyte level in each cell' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure battery voltage at terminals with multimeter',
        tools: ['Digital multimeter'],
        expectedResult: '12.4V+ for 12V systems, 24.8V+ for 24V systems at rest',
        ifFailed: 'Battery is discharged or failed - charge and retest or replace',
      },
      {
        step: 2,
        action: 'Perform load test on battery',
        tools: ['Battery load tester'],
        expectedResult: 'Voltage stays above 9.6V (12V) or 19.2V (24V) under load',
        ifFailed: 'Battery has insufficient capacity - replace',
      },
      {
        step: 3,
        action: 'Inspect battery terminals and cables',
        tools: ['Visual inspection', 'Wire brush', 'Wrenches'],
        expectedResult: 'Clean terminals, tight connections, no damage',
        ifFailed: 'Clean terminals, tighten connections, replace damaged cables',
      },
      {
        step: 4,
        action: 'Check charging system output',
        tools: ['Multimeter'],
        expectedResult: 'Charger or alternator producing proper voltage (13.8-14.5V or 27.6-29V)',
        ifFailed: 'Diagnose and repair charging system',
      },
      {
        step: 5,
        action: 'Measure parasitic current draw',
        tools: ['Clamp ammeter or in-line ammeter'],
        expectedResult: 'Standby current 50-200mA typical',
        ifFailed: 'Identify and eliminate excessive loads',
      },
      {
        step: 6,
        action: 'Check electrolyte level (flooded batteries)',
        tools: ['Flashlight'],
        expectedResult: 'Electrolyte covers plates in all cells',
        ifFailed: 'Add distilled water to proper level',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Connect battery charger and begin charging',
      },
      {
        step: 2,
        instruction: 'Monitor charging progress - voltage should rise over several hours',
      },
      {
        step: 3,
        instruction: 'Continue charging until battery reaches full voltage (12.7V or 25.4V)',
      },
      {
        step: 4,
        instruction: 'Low battery alarm should clear automatically when voltage is adequate',
      },
      {
        step: 5,
        instruction: 'If alarm persists, check controller voltage sensing calibration',
      },
      {
        step: 6,
        instruction: 'Verify charging system is maintaining voltage over following days',
      },
    ],

    repairSolutions: [
      {
        solution: 'Battery Charging and Maintenance',
        difficulty: 'easy',
        timeEstimate: '4-8 hours (charging time)',
        partsNeeded: ['Distilled water for flooded batteries', 'Terminal cleaner'],
        toolsRequired: ['Battery charger', 'Wire brush', 'Wrenches', 'Safety glasses and gloves'],
        procedureSteps: [
          'Disconnect battery from generator (negative first)',
          'Inspect and clean terminals with wire brush',
          'Check electrolyte level and add water if needed (flooded type)',
          'Connect battery charger (positive to positive, negative to negative)',
          'Set appropriate charge rate (10% of Ah rating typical)',
          'Charge until battery reaches full voltage',
          'Reconnect battery (positive first, then negative)',
          'Verify controller operation and charging',
        ],
        costEstimate: { min: 0, max: 2000, currency: 'KES' },
      },
      {
        solution: 'Battery Replacement',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Replacement battery (correct group size and CCA)', 'Terminal protector spray'],
        toolsRequired: ['Wrenches', 'Wire brush', 'Safety glasses and gloves'],
        procedureSteps: [
          'Record any settings that may be lost during disconnection',
          'Disconnect negative cable first, then positive',
          'Remove battery hold-down hardware',
          'Lift out old battery - they are heavy',
          'Place new battery in tray and secure',
          'Clean cable terminals with wire brush',
          'Connect positive cable first, then negative',
          'Apply terminal protector spray',
          'Verify proper operation',
          'Dispose of old battery at recycling center',
        ],
        costEstimate: { min: 8000, max: 40000, currency: 'KES' },
      },
      {
        solution: 'Battery Charger Replacement',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Replacement battery charger', 'Possibly new wiring'],
        toolsRequired: ['Electrician tools', 'Multimeter'],
        procedureSteps: [
          'De-energize AC power to existing charger',
          'Document wiring connections',
          'Remove old charger',
          'Mount new charger',
          'Connect AC power wiring',
          'Connect DC output to battery circuit',
          'Apply power and verify output',
          'Adjust output voltage if required',
        ],
        costEstimate: { min: 15000, max: 60000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'Batteries produce explosive hydrogen gas - avoid sparks and flames',
      'Battery acid is corrosive - wear eye protection and gloves',
      'Batteries are heavy - use proper lifting techniques',
      'Disconnect negative terminal first to prevent shorts',
      'Never short-circuit battery terminals - explosive results possible',
      'Allow charging in ventilated area',
    ],

    preventionTips: [
      'Maintain battery charger in proper operation at all times',
      'Inspect batteries monthly for corrosion, damage, and electrolyte level',
      'Load test batteries annually or after every significant discharge',
      'Replace batteries before they fail (typically every 3-5 years)',
      'Keep terminals clean and tight',
      'Ensure adequate charging time after each start event',
      'Consider battery monitoring system for remote/critical applications',
    ],

    relatedCodes: ['0320-1', 'BAT-01', 'CHG-01', '0001'],
    technicalNotes: 'Typical battery voltage levels: 12V system - fully charged 12.6-12.8V, 75% 12.4V, 50% 12.2V, 25% 12.0V, discharged below 11.8V. 24V system - double these values. Charging voltage should be 2.3-2.4V per cell (13.8-14.4V for 12V, 27.6-28.8V for 24V) for float charge and higher for equalization. Battery CCA (Cold Cranking Amps) rating should exceed engine starting requirements, typically 1.5-2x engine displacement in CCA. AGM batteries prefer 14.4-14.6V charging voltage.',
  },

  // ==================== COMMUNICATION LOSS (0500) ====================
  '0500': {
    code: '0500',
    title: 'Communication Failure',
    severity: 'warning',
    category: 'Control',
    subcategory: 'Communication',

    overview: `Error code 0500 indicates a failure in the communication link between the generator controller and connected devices or systems. Modern generator controllers use various communication protocols including Modbus RTU/TCP, CANbus (J1939 for engine data), Ethernet, RS-485, and proprietary protocols to exchange data with building management systems, remote monitoring platforms, parallel generators, and diagnostic interfaces. When communication is lost, the controller cannot report status, receive commands, or coordinate with other systems, potentially compromising both monitoring and control functions.

The criticality of communication failure depends on how the generator system is configured. For standalone generators with local control, communication loss is primarily a monitoring concern - the generator continues operating normally but remote operators cannot see its status. For generators in parallel operation, communication loss may affect load sharing and synchronization, potentially requiring the affected unit to drop out of parallel. For generators managed by building automation systems, loss of communication may affect start/stop control, load management, and alarm reporting.

Understanding the communication architecture helps in diagnosis. Most systems have multiple communication paths: local connections (Modbus, CANbus) for direct device communication, network connections (Ethernet, cellular) for remote monitoring, and engine interfaces (J1939, proprietary) for engine ECM data. A communication failure alarm indicates which specific link has failed - the diagnostic approach depends on which communication path is affected.

Communication failures can be intermittent or complete, and the symptoms differ. Complete failure (no communication at all) suggests physical problems like cable damage, connector issues, or equipment failure. Intermittent failure (occasional dropouts or timeouts) suggests noise interference, marginal signal levels, or protocol conflicts. Error statistics in the controller (if available) help distinguish between these scenarios.

The time sensitivity of communication alarms varies by application. A brief communication glitch during electrical transients may cause a momentary alarm that self-clears. Sustained communication loss indicates a genuine problem requiring attention. Most controllers have configurable timeout periods before declaring communication failure, typically 10-60 seconds depending on the protocol and application requirements.`,

    diagnosticProcedure: `Begin diagnosis by identifying which communication link has failed - the alarm details typically indicate Modbus, Ethernet, CANbus, or other specific protocol. Different protocols have different diagnostic approaches, so accurate identification is essential. Check the controller display or event log for specific details about the communication failure.

For Modbus communication failures (most common), verify physical connectivity first. Check RS-485 cables for damage, loose connections, or corrosion at terminals. Verify that RS-485 termination resistors (typically 120 ohms) are properly installed at both ends of the bus - missing or incorrect termination causes signal reflections and communication errors. Verify polarity of A/B (or D+/D-) connections - reversed polarity prevents communication. Use an oscilloscope or RS-485 signal analyzer to verify signal levels and quality if available.

For Ethernet communication failures, standard network troubleshooting applies. Verify physical cable connections at both ends. Check for link lights on both the controller and switch/router. Test network connectivity using ping from a computer on the same network. Verify IP address configuration including address, subnet mask, gateway, and any required static routes. Check firewall settings that might block required ports. For remote monitoring systems, verify internet connectivity and cloud service availability.

For J1939/CANbus failures (engine communication), check the CAN cable condition and connector integrity. Verify proper CAN termination (120 ohms at each end of the bus). Use a CAN diagnostic tool to verify bus traffic if available. Check that all CAN addresses are unique and correctly configured. Some ECM communication issues stem from firmware mismatches between controller and engine.

For intermittent communication problems, look for sources of electromagnetic interference. Generators produce significant electrical noise during operation that can couple into communication cables. Ensure proper cable routing away from power cables. Verify shielding is properly grounded at one end only (grounding at both ends can cause ground loops). Check for loose connections that make intermittent contact.

Review controller configuration for communication settings. Baud rate, parity, stop bits, and slave address must match between communicating devices. Timeout settings may need adjustment for longer cable runs or slower devices. Protocol version mismatches can cause intermittent issues - ensure compatible versions on all devices.`,

    resetInstructions: `Communication failure alarms typically self-clear when communication is restored. Once the physical problem is corrected and communication resumes, the controller should recognize the restored link and clear the alarm automatically within the configured timeout period. However, if the alarm persists, manual action may be required.

Before attempting reset, verify that communication has actually been restored by checking for successful data exchange between devices. For Modbus, this might be verified using a Modbus master/simulator tool. For Ethernet, verify network connectivity and try accessing the controller's web interface if equipped. For CANbus, verify engine data is displaying correctly on the controller.

For DSE controllers: Communication alarms typically auto-reset when communication is restored. If the alarm persists after communication verification, navigate to ALARM HISTORY and clear the communication alarm. Verify communication parameters match between devices.

For ComAp controllers: Communication faults generally self-clear. If manual reset is needed, use the RESET function in the alarm menu. Verify GenConfig settings match the connected devices.

For SmartGen controllers: Communication alarms reset automatically when communication is restored and maintained for the configured timeout period. If using HGM Cloud, verify both local network and cloud connectivity.

After the alarm clears, monitor communication stability over the next several hours or days. Intermittent problems may cause recurring alarms that indicate underlying issues requiring further investigation. Check error counters if available to track communication quality over time.`,

    solutionGuide: `Solving communication failures requires identifying the failure mode (physical, configuration, or interference) and applying the appropriate remedy. Most communication problems are caused by physical issues that are straightforward to repair.

For physical cable problems (approximately 50% of communication failures), repair or replace the damaged cables. Use proper communication cables with correct impedance characteristics (shielded twisted pair for RS-485, CAT5e or better for Ethernet, proper CAN cables for J1939). Ensure connectors are properly installed - poor crimps and cold solder joints are common failure points. Verify cable routing avoids sharp bends, abrasion points, and proximity to power cables. Add proper strain relief at connection points to prevent cable damage from vibration.

For termination and biasing problems (approximately 20% of cases), install or correct termination resistors. RS-485 requires 120-ohm termination at each end of the bus - not in the middle, not at one end only. Some RS-485 devices have built-in termination that can be enabled; verify configuration. Add proper biasing resistors if the bus has long idle periods - RS-485 transceivers need proper bias to avoid floating inputs. CAN bus similarly requires 120-ohm termination at each physical end.

For configuration mismatches (approximately 15% of cases), verify and correct communication settings. Both devices must use the same baud rate, data bits, parity, and stop bits for serial protocols. Verify slave addresses are unique and correctly referenced. Check that protocol versions are compatible - newer controllers may support features that older devices don't recognize. Update firmware on all devices if compatibility issues are suspected.

For electromagnetic interference problems (approximately 10% of cases), improve cable routing and shielding. Route communication cables away from power cables - at least 12 inches separation, crossing at right angles where they must cross. Use shielded cables with the shield grounded at one end only. Consider fiber optic cables for long runs in high-noise environments. Add ferrite cores to cables near noise sources if needed.

For network connectivity problems (Ethernet systems), address network infrastructure issues. Verify switch/router operation and port configuration. Check for IP address conflicts. Verify VLAN configuration if used. Ensure adequate bandwidth and low latency for time-critical applications. Consider dedicated network infrastructure for critical generator communication.`,

    possibleCauses: [
      { cause: 'Damaged or disconnected communication cable', likelihood: 'high', testMethod: 'Visual inspection, cable continuity test' },
      { cause: 'Incorrect or missing RS-485 termination', likelihood: 'high', testMethod: 'Measure resistance at bus ends, verify termination resistors' },
      { cause: 'Communication parameter mismatch', likelihood: 'medium', testMethod: 'Compare settings between devices' },
      { cause: 'Network connectivity issue (Ethernet)', likelihood: 'medium', testMethod: 'Ping test, check link lights, trace network path' },
      { cause: 'Electromagnetic interference', likelihood: 'medium', testMethod: 'Observe error rate vs. operating conditions' },
      { cause: 'Device failure (controller or connected device)', likelihood: 'low', testMethod: 'Test communication with known-good device' },
      { cause: 'Firmware incompatibility', likelihood: 'low', testMethod: 'Verify firmware versions, check compatibility documentation' },
      { cause: 'IP address conflict (Ethernet)', likelihood: 'low', testMethod: 'Scan network for duplicate addresses' },
    ],

    diagnosticSteps: [
      {
        step: 1,
        action: 'Identify which communication link has failed from alarm details',
        tools: ['Controller display or event log'],
        expectedResult: 'Clear identification of failed link (Modbus, Ethernet, CAN, etc.)',
        ifFailed: 'Review all communication connections systematically',
      },
      {
        step: 2,
        action: 'Inspect physical cabling and connections',
        tools: ['Visual inspection', 'Multimeter for continuity'],
        expectedResult: 'Cables intact, connections tight, no visible damage',
        ifFailed: 'Repair or replace damaged cables and connectors',
      },
      {
        step: 3,
        action: 'Verify termination and biasing (RS-485)',
        tools: ['Multimeter', 'Termination resistors if needed'],
        expectedResult: 'Proper termination at bus ends (120 ohms each)',
        ifFailed: 'Install or correct termination resistors',
      },
      {
        step: 4,
        action: 'Verify communication settings match between devices',
        tools: ['Configuration software', 'Device manuals'],
        expectedResult: 'All settings match (baud rate, parity, addresses)',
        ifFailed: 'Correct mismatched settings',
      },
      {
        step: 5,
        action: 'Test network connectivity (Ethernet systems)',
        tools: ['Computer on same network', 'Ping command'],
        expectedResult: 'Successful ping response from controller',
        ifFailed: 'Troubleshoot network path, check switch/router',
      },
      {
        step: 6,
        action: 'Test communication with known-good device or tool',
        tools: ['Modbus simulator, terminal program, or diagnostic tool'],
        expectedResult: 'Successful communication with test device',
        ifFailed: 'Indicates controller port failure - may need repair/replacement',
      },
    ],

    resetSteps: [
      {
        step: 1,
        instruction: 'Correct physical or configuration problem causing communication failure',
      },
      {
        step: 2,
        instruction: 'Verify communication is now working using diagnostic tools or monitoring software',
      },
      {
        step: 3,
        instruction: 'Communication alarm should clear automatically once link is restored',
      },
      {
        step: 4,
        instruction: 'If alarm persists, navigate to ALARM HISTORY and manually clear',
        keySequence: ['MENU', 'ALARMS', 'CLEAR'],
      },
      {
        step: 5,
        instruction: 'Monitor communication stability over following hours/days',
      },
    ],

    repairSolutions: [
      {
        solution: 'Replace Communication Cable',
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        partsNeeded: ['Appropriate communication cable (RS-485, Ethernet, CAN)', 'Connectors if not terminated'],
        toolsRequired: ['Wire strippers', 'Crimp tools if needed', 'Screwdrivers'],
        procedureSteps: [
          'Identify correct cable type for protocol',
          'Measure required cable length',
          'Route new cable avoiding power cables',
          'Terminate or connect cable ends',
          'Connect to devices',
          'Verify communication restored',
          'Secure cable with proper strain relief',
        ],
        costEstimate: { min: 2000, max: 15000, currency: 'KES' },
      },
      {
        solution: 'Install RS-485 Termination',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['120-ohm termination resistors (or built-in termination jumpers)'],
        toolsRequired: ['Screwdriver', 'Soldering iron if needed'],
        procedureSteps: [
          'Identify physical ends of RS-485 bus',
          'Install 120-ohm resistor across A and B (D+ and D-) at each end',
          'Verify resistance with multimeter',
          'Test communication',
        ],
        costEstimate: { min: 100, max: 500, currency: 'KES' },
      },
      {
        solution: 'Configure Communication Parameters',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        partsNeeded: ['Configuration software', 'Communication settings documentation'],
        toolsRequired: ['Laptop with configuration software', 'Configuration cable'],
        procedureSteps: [
          'Document current settings on both devices',
          'Identify mismatched parameters',
          'Modify settings to match',
          'Save configuration',
          'Test communication',
          'Document final working settings',
        ],
        costEstimate: { min: 0, max: 0, currency: 'KES' },
      },
      {
        solution: 'Install EMI Protection',
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        partsNeeded: ['Ferrite cores', 'Shielded cable if needed', 'Cable ties'],
        toolsRequired: ['Basic hand tools'],
        procedureSteps: [
          'Identify sources of electromagnetic interference',
          'Reroute cables away from power conductors',
          'Add ferrite cores to communication cables',
          'Verify or improve cable shielding',
          'Ground shield at one end only',
          'Test communication under various operating conditions',
        ],
        costEstimate: { min: 1000, max: 10000, currency: 'KES' },
      },
    ],

    safetyWarnings: [
      'De-energize circuits before working on communication wiring',
      'Follow electrical safety procedures for all wiring work',
      'Communication equipment may have low-voltage safety certifications that can be voided by improper connections',
      'Verify equipment is suitable for the installation environment',
    ],

    preventionTips: [
      'Use proper cable types and termination for each protocol',
      'Route communication cables away from power cables',
      'Use shielded cables in high-noise environments',
      'Properly terminate RS-485 and CAN buses',
      'Document all communication settings',
      'Test communication after any changes to the system',
      'Monitor communication error statistics when available',
      'Include communication testing in routine maintenance',
    ],

    relatedCodes: ['0500-1', 'COM-01', 'MOD-01', 'CAN-01'],
    technicalNotes: 'RS-485: Typical baud rates 9600-115200, max distance 1200m with proper termination. Ethernet: Use CAT5e or better, 100m max segment length. CAN/J1939: 250k or 500k baud typical, max 40m at 500k. Modbus: Addresses 1-247, timeout typically 1-5 seconds. Always match settings between communicating devices exactly.',
  },
};

export default ENHANCED_DETAILED_FAULT_CODES_PART2;
