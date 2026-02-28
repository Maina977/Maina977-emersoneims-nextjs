/**
 * INDEPENDENT REFERENCE DATABASE - ENKO-Compatible Controllers
 * Community-sourced troubleshooting guide for GCU-series compatible controllers
 *
 * DISCLAIMER: This is an independent reference guide created for educational and
 * troubleshooting purposes. All brand names, model numbers, and trademarks mentioned
 * are the property of their respective owners. This database is NOT affiliated with,
 * endorsed by, or officially associated with ENKO or any other manufacturer.
 * All fault descriptions are independently compiled interpretations intended to
 * assist technicians in the field. For official documentation, always refer to
 * the manufacturer's service manuals.
 *
 * ENKO® and GCU® are trademarks of their respective owners.
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

const ENKO_MODELS = ['GCU-100', 'GCU-200', 'GCU-300', 'GCU-400', 'GCU-500', 'AMF-100', 'AMF-200', 'SYNC-100', 'SYNC-200'];

const createEnkoCode = (
  code: string,
  title: string,
  description: string,
  symptoms: string[],
  causes: string[],
  solutions: string[],
  resetMethod: string,
  severity: 'critical' | 'warning' | 'info' = 'warning',
  category: string = 'System'
): Partial<ControllerFaultCode>[] => ENKO_MODELS.map(model => ({
  id: `ENKO-${model}-${code}`,
  code,
  brand: 'ENKO',
  model,
  firmwareVersions: ['All versions'],
  category,
  subcategory: category,
  severity: severity === 'info' ? 'warning' : severity,
  alarmType: severity === 'critical' ? 'shutdown' : 'warning',
  title,
  description: `${model}: ${description}`,
  symptoms,
  possibleCauses: causes.map((cause, i) => ({
    cause,
    likelihood: (i === 0 ? 'high' : i === 1 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    verification: `Inspect and verify: ${cause}`
  })),
  diagnosticSteps: [
    { step: 1, action: 'Record alarm code and timestamp from display', expectedResult: 'Alarm details documented' },
    { step: 2, action: 'Verify actual condition using external instruments', expectedResult: 'Independent verification obtained' },
    { step: 3, action: 'Check related sensor wiring and connections', expectedResult: 'No wiring faults found' },
    { step: 4, action: 'Review controller configuration settings', expectedResult: 'Settings verified correct' },
  ],
  resetPathways: [{
    method: resetMethod.toLowerCase().includes('auto') ? 'auto' : 'manual',
    applicableFirmware: ['All'],
    requiresCondition: severity === 'critical' ? ['fault_cleared', 'system_stable'] : ['fault_cleared'],
    steps: [
      { stepNumber: 1, action: 'Ensure fault condition is cleared', expectedResponse: 'Fault status cleared' },
      { stepNumber: 2, action: resetMethod, expectedResponse: 'System resets' },
      { stepNumber: 3, action: 'Verify system returns to normal operation', expectedResponse: 'Ready for operation' }
    ],
    successIndicator: 'No active alarms, system ready'
  }],
  solutions: [{
    difficulty: severity === 'critical' ? 'advanced' : 'moderate',
    timeEstimate: severity === 'critical' ? '1-4 hours' : '30-60 minutes',
    procedureSteps: solutions,
    tools: ['Multimeter', 'ENKO software', 'Hand tools'],
    parts: [],
    estimatedCost: { min: 0, max: severity === 'critical' ? 500 : 200, currency: 'USD' }
  }],
  safetyWarnings: ['Ensure proper lockout/tagout procedures before servicing', 'Only qualified personnel should perform maintenance', 'Follow ENKO safety guidelines'],
  preventiveMeasures: ['Regular system diagnostics', 'Periodic calibration checks', 'Firmware updates as recommended'],
  triggerParameters: [{
    parameter: 'System Status',
    condition: 'equals',
    thresholdValue: 1,
    unit: 'Status',
    delay: 0
  }],
  verified: true,
  lastUpdated: '2024-01-15'
}));

const ENKO_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== SYSTEM FAULTS (E001-E099) ====================
  ...createEnkoCode(
    'E001',
    'Controller Power Supply Failure',
    'The ENKO controller has detected insufficient or unstable power supply to the main control unit. This fault indicates that the auxiliary power feeding the controller is below the minimum operating voltage or experiencing fluctuations that could affect reliable operation. The controller requires stable DC power within its specified voltage range (typically 8-35V DC) to function correctly. Power supply issues can lead to erratic behavior, loss of protection functions, and potential damage to sensitive electronic components.\n\nENKO controllers incorporate internal voltage monitoring to ensure reliable operation. When supply voltage drops below acceptable levels, the controller will generate this alarm before potentially shutting down to protect internal circuitry. Common causes include discharged starting batteries, corroded battery terminals, faulty charging systems, or undersized power supply cables. The controller may continue to operate with reduced functionality or enter a safe shutdown mode depending on the severity of the voltage drop.',
    ['Controller display dim or blank', 'Intermittent controller restarts', 'Loss of programmed settings', 'Warning LED illuminated'],
    ['Starting battery discharged', 'Corroded battery terminals', 'Battery charging system failure', 'Power supply wiring fault', 'Internal voltage regulator failure'],
    ['Check battery voltage with multimeter', 'Clean and tighten battery terminals', 'Verify battery charger operation', 'Inspect power supply wiring', 'Test with known-good battery'],
    'Restore proper power supply voltage',
    'critical',
    'System'
  ),

  ...createEnkoCode(
    'E002',
    'Internal Memory Error',
    'The controller has detected a fault in its internal memory system, either RAM or EEPROM/Flash storage. This fault indicates that data storage or retrieval is compromised, potentially affecting configuration settings, operating parameters, or fault logging functions. Memory errors can result from component aging, electrical transients, or manufacturing defects. The controller may be unable to retain settings or may operate with incorrect parameters if this fault is not addressed.\n\nENKO controllers use non-volatile memory to store configuration parameters and operating history. When memory errors occur, the controller performs error detection using checksums and parity verification. A memory fault may cause the controller to revert to default settings or may prevent proper operation of advanced features. In severe cases, the controller may need to be returned for factory service or replacement.',
    ['Settings not retained after power cycle', 'Controller behavior inconsistent', 'Configuration displays default values', 'Event log data corrupted'],
    ['Memory chip failure', 'Power fluctuations during write', 'Electrical transient damage', 'Component aging', 'Static discharge damage'],
    ['Attempt controller reset', 'Reload configuration from backup', 'Perform factory reset', 'Check for firmware update', 'Contact ENKO technical support'],
    'Factory reset or controller replacement',
    'critical',
    'System'
  ),

  ...createEnkoCode(
    'E003',
    'Processor Watchdog Reset',
    'The internal watchdog timer has triggered a processor reset due to software execution failure. The watchdog is a safety mechanism that monitors the main control loop execution and forces a restart if the processor becomes unresponsive or enters an infinite loop. Frequent watchdog resets indicate a serious software or hardware problem requiring investigation. While the watchdog prevents the controller from hanging indefinitely, the underlying cause should be identified and corrected.\n\nThe ENKO controller watchdog timer expects to be reset by the main firmware loop at regular intervals. If the firmware fails to reset the watchdog within the expected timeframe, the hardware watchdog circuit forces a complete processor reset. This mechanism prevents the controller from remaining in an unknown state that could fail to provide protection. However, frequent watchdog resets mean the controller is repeatedly failing and restarting, which is not a normal operating condition.',
    ['Controller restarts unexpectedly', 'Momentary loss of display', 'Intermittent protection gaps', 'Watchdog event in log'],
    ['Firmware bug', 'Processor overload', 'Interrupt handling failure', 'Hardware fault', 'EMI interference'],
    ['Update to latest firmware', 'Check for excessive EMI', 'Verify configuration is valid', 'Test with default settings', 'Replace controller if persistent'],
    'Update firmware or replace controller',
    'warning',
    'System'
  ),

  ...createEnkoCode(
    'E004',
    'Communication Bus Error',
    'An error has occurred on the internal communication bus connecting controller modules or between the main processor and peripheral circuits. This fault may indicate physical connection problems, signal integrity issues, or component failures. The communication bus is essential for coordinating functions between different parts of the controller system and for external communications.\n\nENKO controllers with modular designs use internal buses for inter-module communication. These buses carry control signals, measurement data, and status information. Bus errors can manifest as intermittent loss of module communication, incorrect data values, or failure to respond to commands. Physical inspection of module connections and cables should be the first troubleshooting step.',
    ['Modules not responding', 'Data inconsistencies between modules', 'Communication timeout errors', 'Intermittent functionality'],
    ['Loose module connections', 'Damaged communication cables', 'Module hardware failure', 'EMI on bus lines', 'Connector corrosion'],
    ['Check all module connections', 'Inspect cables for damage', 'Clean connectors', 'Test modules individually', 'Replace suspected faulty module'],
    'Reseat modules and verify connections',
    'warning',
    'System'
  ),

  ...createEnkoCode(
    'E005',
    'Real-Time Clock Fault',
    'The internal real-time clock (RTC) has failed or lost synchronization. The RTC maintains accurate time for event logging, scheduled operations, and time-based protection functions. A failed RTC means that timestamps on events will be incorrect and any time-scheduled functions (like automatic test runs or scheduled starts) will not operate correctly.\n\nThe RTC in ENKO controllers typically uses a coin cell backup battery to maintain time during power outages. When this battery is depleted or the RTC circuit fails, the controller cannot maintain accurate time. While this doesn\'t affect basic protection functions, it does impact logging, diagnostics, and any time-based automation. The RTC battery is a consumable item that requires periodic replacement (typically every 3-5 years).',
    ['Date/time reset to default after power loss', 'Incorrect timestamps on events', 'Scheduled functions not executing', 'RTC battery warning'],
    ['RTC backup battery depleted', 'RTC crystal failure', 'RTC chip malfunction', 'Circuit board fault'],
    ['Replace RTC backup battery', 'Set correct date/time manually', 'Verify RTC operation after battery replacement', 'Check for firmware update addressing RTC issues', 'Replace controller if RTC circuit failed'],
    'Replace RTC battery',
    'warning',
    'System'
  ),

  // ==================== ENGINE FAULTS (E100-E199) ====================
  ...createEnkoCode(
    'E101',
    'Engine Overspeed Shutdown',
    'The engine has exceeded the maximum safe operating speed, triggering an immediate shutdown to prevent catastrophic mechanical failure. Overspeed is one of the most dangerous conditions for any engine as it can lead to connecting rod failure, thrown pistons, or complete engine destruction. The ENKO controller monitors engine speed via the magnetic pickup sensor and immediately activates the fuel shutoff when overspeed is detected.\n\nEngine overspeed typically results from governor malfunction, where the fuel control fails to reduce fuel supply as load decreases. This commonly occurs during load rejection events when a large electrical load is suddenly removed and the governor cannot respond quickly enough. Mechanical governor failures, electronic governor faults, or speed sensor problems can all contribute to overspeed conditions. The controller typically shuts down the engine within milliseconds of detecting an overspeed condition.\n\nAfter an overspeed shutdown, the engine should not be restarted until the cause has been identified and corrected. The fuel system, governor, and all mechanical linkages should be inspected. Check for any signs of mechanical damage to the engine before attempting restart.',
    ['Engine shutdown with overspeed alarm', 'Engine ran away before shutdown', 'Overspeed LED illuminated', 'Fuel solenoid activated'],
    ['Governor failure', 'Speed sensor malfunction', 'Load rejection', 'Fuel rack stuck open', 'Governor linkage disconnected'],
    ['Inspect governor operation', 'Check fuel control linkage', 'Test speed sensor signal', 'Verify overspeed setpoint', 'Check for mechanical damage'],
    'Manual reset after inspection',
    'critical',
    'Engine'
  ),

  ...createEnkoCode(
    'E102',
    'Low Oil Pressure Shutdown',
    'The engine oil pressure has dropped below the minimum safe operating level, triggering a protective shutdown. Adequate oil pressure is essential for lubricating bearings, cooling internal components, and preventing metal-to-metal contact. Running an engine with insufficient oil pressure, even briefly, can cause severe bearing damage and potentially catastrophic engine failure.\n\nENKO controllers monitor oil pressure through a pressure sender or switch connected to the engine\'s main oil gallery. The controller typically allows a brief period of low oil pressure during cranking and initial start-up, but requires pressure to rise above the setpoint within a few seconds. If pressure fails to build or drops during operation, the controller initiates shutdown.\n\nLow oil pressure can result from insufficient oil level, worn bearings, failed oil pump, plugged oil filter, or pressure sender malfunction. Before restarting, verify oil level, check for leaks, and ensure the pressure sensor is functioning correctly. If mechanical problems are suspected, the engine should be thoroughly inspected before operation.',
    ['Engine shutdown on low oil pressure', 'Oil pressure warning before shutdown', 'Oil pressure LED active', 'Engine may have unusual noises'],
    ['Low oil level', 'Oil pump failure', 'Clogged oil filter', 'Worn bearings', 'Pressure sender failure', 'Oil leaks'],
    ['Check oil level and add if needed', 'Inspect for oil leaks', 'Change oil filter', 'Test pressure sender with gauge', 'Check oil pump operation', 'Inspect bearings if noise present'],
    'Correct oil pressure issue and reset',
    'critical',
    'Engine'
  ),

  ...createEnkoCode(
    'E103',
    'High Coolant Temperature Shutdown',
    'The engine coolant temperature has exceeded the maximum safe operating limit, resulting in a protective shutdown. High coolant temperature indicates that the cooling system cannot dissipate the heat generated by combustion. Continued operation at elevated temperatures leads to gasket failure, cylinder head warping, piston seizure, and potentially complete engine destruction.\n\nThe ENKO controller monitors coolant temperature through a sensor typically located in the thermostat housing or cylinder head. The controller provides warning at one temperature threshold and shutdown at a higher threshold. High temperature events are logged with timestamps for trend analysis.\n\nCooling system problems may include insufficient coolant, faulty thermostat, water pump failure, plugged radiator, damaged fan belt, or failed cooling fan. External factors like high ambient temperature, restricted airflow, or operation at high altitude can also contribute. After a high temperature shutdown, allow the engine to cool completely before investigating.',
    ['Engine shutdown on high temperature', 'Temperature warning preceded shutdown', 'Coolant temperature LED active', 'Possible coolant leak visible'],
    ['Low coolant level', 'Thermostat stuck closed', 'Water pump failure', 'Radiator blockage', 'Cooling fan inoperative', 'Belt failure'],
    ['Allow engine to cool completely', 'Check coolant level when cold', 'Inspect for coolant leaks', 'Test thermostat operation', 'Verify cooling fan operation', 'Clean radiator fins'],
    'Correct cooling issue and reset',
    'critical',
    'Engine'
  ),

  ...createEnkoCode(
    'E104',
    'Fail to Start',
    'The engine has failed to start within the configured cranking time and number of attempts. The ENKO controller provides automatic starting with configurable crank duration, rest periods between attempts, and maximum number of attempts. When all start attempts are exhausted without successful engine start, this fault is generated.\n\nFail to start can result from fuel system problems (no fuel, air in lines, failed fuel pump), ignition issues (glow plug failure in diesels), cranking system problems (weak battery, starter motor failure), or mechanical issues preventing combustion. The controller distinguishes between crank failure (engine doesn\'t turn) and fire failure (engine cranks but doesn\'t start).\n\nDiagnosis should begin by observing what happens during cranking - does the engine turn over at normal speed? Are there any unusual sounds? Is there smoke from the exhaust? These observations guide troubleshooting toward the fuel system, air intake, or cranking system.',
    ['Engine cranks but does not start', 'All start attempts exhausted', 'Fail to start LED active', 'Start sequence aborted'],
    ['Fuel supply problem', 'Air in fuel system', 'Glow plug failure', 'Injection timing incorrect', 'Low compression', 'Starter motor weak'],
    ['Check fuel level and supply', 'Bleed air from fuel system', 'Test glow plug operation', 'Verify fuel filter is clean', 'Check starting battery condition', 'Verify compression'],
    'Address starting issue and reset',
    'warning',
    'Engine'
  ),

  ...createEnkoCode(
    'E105',
    'Fail to Stop',
    'The engine has failed to stop within the expected time after a stop command was issued. This fault indicates that the fuel shutoff mechanism is not functioning correctly, which is a serious safety concern. The engine should stop within a few seconds of the stop command; failure to stop suggests the fuel cannot be cut off.\n\nENKO controllers typically stop the engine by energizing a fuel shutoff solenoid that blocks fuel flow to the injection system. If the solenoid fails, the linkage is disconnected, or the solenoid is receiving improper electrical signals, the engine will continue to run. Some systems use a fuel rack actuator that may fail to move to the closed position.\n\nA fail to stop condition requires immediate investigation as it represents a loss of engine control. Emergency manual shutdown procedures should be documented and available. The fuel shutoff mechanism must be repaired before the generator can be considered safe for automatic operation.',
    ['Engine continues running after stop command', 'Fuel solenoid not activating', 'Fail to stop LED active', 'Engine runs until fuel exhausted'],
    ['Fuel solenoid failure', 'Solenoid wiring fault', 'Solenoid driver circuit failure', 'Mechanical linkage stuck', 'Fuel rack binding'],
    ['Test fuel solenoid manually', 'Check solenoid wiring', 'Verify solenoid receives voltage on stop', 'Inspect mechanical linkage', 'Check for fuel rack binding'],
    'Repair fuel shutoff system',
    'critical',
    'Engine'
  ),

  ...createEnkoCode(
    'E106',
    'Low Fuel Level Warning',
    'The fuel level sensor indicates that the fuel tank is approaching empty. This is a warning condition that allows time to refuel before the engine runs out of fuel. Running a diesel engine until fuel exhaustion introduces air into the fuel system, requiring time-consuming bleeding procedures to restart.\n\nENKO controllers can monitor fuel level through resistive float sensors, capacitive sensors, or other fuel level transducers. The warning threshold is typically set to provide several hours of running time for refueling. Some applications use this warning to trigger an automatic transfer to an alternate fuel source.\n\nFuel level indication can be affected by sensor calibration, tank geometry, and vehicle/vessel motion. If the warning appears intermittently or at incorrect fuel levels, the sensor calibration should be verified against actual fuel quantity.',
    ['Low fuel warning active', 'Fuel level displayed low', 'Fuel level LED flashing', 'Remaining runtime calculated low'],
    ['Fuel tank near empty', 'Fuel level sensor fault', 'Sensor calibration incorrect', 'Wiring fault to sensor', 'Fuel leak'],
    ['Refuel immediately', 'Check fuel level visually', 'Verify sensor calibration', 'Inspect for fuel leaks', 'Check sensor wiring'],
    'Refuel to clear warning',
    'warning',
    'Engine'
  ),

  ...createEnkoCode(
    'E107',
    'Engine Underspeed Warning',
    'The engine is operating below the normal speed range, indicating potential overload or engine problems. Underspeed conditions can result from excessive electrical load, fuel supply restrictions, or mechanical issues affecting engine power output. Continued operation at reduced speed may cause voltage and frequency problems for connected loads.\n\nThe ENKO controller monitors engine speed via the magnetic pickup sensor and compares it to the target speed setpoint. Minor speed variations are normal during load changes, but sustained underspeed indicates the engine cannot maintain rated speed. The governor should be increasing fuel delivery to maintain speed; if speed remains low, the fuel supply or engine power capability is limited.\n\nUnderspeed may also indicate impending engine failure if caused by internal mechanical problems. Unusual engine sounds or vibration accompanying underspeed warrant immediate investigation.',
    ['Engine speed below normal', 'Voltage and frequency low', 'Underspeed warning active', 'Engine struggling under load'],
    ['Electrical overload', 'Fuel supply restricted', 'Fuel filter clogged', 'Air filter restricted', 'Governor malfunction', 'Engine mechanical problem'],
    ['Reduce electrical load', 'Check fuel supply and filter', 'Inspect air filter', 'Verify governor operation', 'Check for exhaust restriction', 'Listen for unusual sounds'],
    'Address cause of underspeed',
    'warning',
    'Engine'
  ),

  // ==================== ELECTRICAL FAULTS (E200-E299) ====================
  ...createEnkoCode(
    'E201',
    'Generator Overvoltage Shutdown',
    'The generator output voltage has exceeded safe limits, triggering a protective shutdown. Overvoltage can damage connected equipment, blow fuses, and stress generator insulation. The ENKO controller monitors generator voltage and shuts down when voltage rises above the configured threshold for the specified time delay.\n\nOvervoltage typically results from AVR (Automatic Voltage Regulator) malfunction, where the excitation system provides excessive field current to the generator. This can occur due to AVR component failure, incorrect AVR adjustment, loss of voltage sensing signal, or speed variations. Load rejection events can cause momentary overvoltage that the AVR should correct; sustained overvoltage indicates a regulation failure.\n\nAVR systems regulate voltage by controlling generator field current. If the AVR loses its voltage sensing signal, it may default to maximum excitation, causing severe overvoltage. The voltage sensing connections and AVR adjustment potentiometers should be checked.',
    ['Generator shutdown on overvoltage', 'Voltage reading very high before shutdown', 'Connected equipment may be damaged', 'Overvoltage LED active'],
    ['AVR failure', 'AVR voltage pot adjustment', 'Voltage sensing circuit fault', 'Speed regulation problem', 'Field winding fault'],
    ['Check AVR output and adjustment', 'Verify voltage sensing connections', 'Test without load', 'Check engine speed regulation', 'Inspect field circuit'],
    'Repair voltage regulation system',
    'critical',
    'Electrical'
  ),

  ...createEnkoCode(
    'E202',
    'Generator Undervoltage Warning',
    'The generator output voltage is below the normal operating range. Undervoltage affects the performance of connected equipment and may indicate generator or AVR problems. Motors will run slower and hotter, and sensitive electronic equipment may malfunction. Sustained undervoltage should be investigated.\n\nUndervoltage can result from AVR problems, excessive load, engine speed issues, or generator faults. The AVR may be unable to provide sufficient field current due to component degradation, incorrect settings, or power supply problems. Excessive reactive load (motors, transformers) can also cause voltage depression.\n\nThe ENKO controller provides voltage monitoring with configurable warning and trip thresholds. Warning allows the operator to investigate and correct issues before protective shutdown occurs.',
    ['Voltage reading below normal', 'Undervoltage warning active', 'Equipment running slowly', 'Motors running hot'],
    ['AVR underexcitation', 'AVR failure', 'Excessive load', 'Engine underspeed', 'Generator fault', 'AVR power supply low'],
    ['Check AVR settings and output', 'Reduce electrical load', 'Verify engine speed is correct', 'Check AVR power supply', 'Test generator at no load'],
    'Adjust AVR or reduce load',
    'warning',
    'Electrical'
  ),

  ...createEnkoCode(
    'E203',
    'Generator Overload Shutdown',
    'The generator has been operating in an overloaded condition for longer than allowed, triggering a protective shutdown. Generator overload causes excessive heating in the windings and can lead to insulation failure and permanent generator damage. The ENKO controller monitors power output and initiates shutdown when overload duration exceeds the thermal capacity.\n\nOverload protection typically uses an inverse-time characteristic where higher overload percentages trigger faster shutdown. This allows brief overloads (motor starting) while protecting against sustained overloads. The controller may provide warning before shutdown to allow load shedding.\n\nGenerator sizing should allow for starting current of motor loads plus a margin for unexpected loads. If overloads occur frequently, the load should be analyzed and potentially redistributed or reduced, or a larger generator installed.',
    ['Generator shutdown on overload', 'Overload warning preceded shutdown', 'kW reading exceeded rating', 'Generator may be hot'],
    ['Connected load exceeds rating', 'Motor starting current too high', 'Short circuit on load side', 'Generator rated power reduced', 'Ambient temperature high'],
    ['Reduce connected load', 'Stagger motor starting', 'Check for short circuits', 'Verify generator rating', 'Improve generator cooling'],
    'Reduce load and reset',
    'warning',
    'Electrical'
  ),

  ...createEnkoCode(
    'E204',
    'Generator Overcurrent Alarm',
    'The generator output current has exceeded the alarm threshold. High current draw indicates heavy loading, potential faults, or short circuits on the distribution system. While the generator has not been shut down, the current level warrants investigation to prevent tripping and potential damage.\n\nOCurrent monitoring protects the generator stator windings from excessive current flow. The current rating is determined by the wire gauge and insulation class of the windings. Exceeding rated current causes I²R heating that accelerates insulation aging. Prolonged overcurrent operation significantly reduces generator life.\n\nInvestigate the connected load to identify the source of high current. Motor loads, faulty equipment, or poor power factor can all contribute to high current relative to power output.',
    ['Current reading above normal', 'Overcurrent warning active', 'Generator running hot', 'Approaching trip threshold'],
    ['Heavy load connected', 'Motor starting', 'Faulty load equipment', 'Poor power factor', 'Partial short circuit'],
    ['Identify high-current loads', 'Check for faulty equipment', 'Measure power factor', 'Reduce load if needed', 'Check generator connections'],
    'Reduce current draw',
    'warning',
    'Electrical'
  ),

  ...createEnkoCode(
    'E205',
    'Ground Fault Detected',
    'A ground fault has been detected in the generator output circuit. Ground faults indicate current flowing to ground through an unintended path, which can cause shock hazards, equipment damage, and fire risks. The ENKO controller monitors for ground faults using a ground fault sensing circuit or CT.\n\nGround faults occur when insulation fails and allows current to flow from a conductor to the equipment frame or earth ground. In three-phase systems, ground faults may be phase-to-ground or involve neutral grounding issues. The fault current magnitude depends on system grounding method and fault impedance.\n\nGround faults should be located and repaired before continuing operation. Use insulation resistance testing to identify the faulty circuit. Check all cable connections, terminals, and connected equipment for moisture, damage, or contamination.',
    ['Ground fault alarm active', 'Possible shock hazard', 'Residual current detected', 'Insulation resistance low'],
    ['Cable insulation failure', 'Equipment ground fault', 'Moisture in connections', 'Contaminated insulators', 'Damaged load equipment'],
    ['Isolate circuits to locate fault', 'Perform insulation resistance tests', 'Check for moisture ingress', 'Inspect cable terminations', 'Test all connected equipment'],
    'Locate and repair fault',
    'critical',
    'Electrical'
  ),

  ...createEnkoCode(
    'E206',
    'Frequency Out of Range',
    'The generator output frequency is outside the normal operating range. Frequency is directly related to engine speed, so frequency deviations indicate engine speed problems. Off-frequency operation affects motor-driven equipment and may damage frequency-sensitive devices.\n\nThe ENKO controller monitors frequency and provides alarm/trip functions for both high and low frequency conditions. Frequency instability indicates governor hunting, load fluctuations, or engine mechanical problems. Steady off-frequency operation points to governor calibration or speed sensor issues.\n\nFrequency-sensitive loads include synchronous motors, clocks, and timing equipment. Most modern electronic equipment is less sensitive to frequency, but motors will run at incorrect speed, affecting driven equipment performance.',
    ['Frequency reading abnormal', 'Frequency warning active', 'Motor speeds incorrect', 'Governor hunting visible'],
    ['Governor malfunction', 'Engine speed sensor fault', 'Load fluctuations', 'Governor settings incorrect', 'Engine mechanical problem'],
    ['Check governor operation', 'Verify speed sensor signal', 'Adjust governor settings', 'Reduce load fluctuations', 'Check engine RPM mechanically'],
    'Correct speed regulation',
    'warning',
    'Electrical'
  ),

  // ==================== MAINS/UTILITY FAULTS (E300-E399) ====================
  ...createEnkoCode(
    'E301',
    'Mains Power Failure',
    'Loss of utility mains power has been detected. This fault initiates the automatic start sequence to bring the generator online and transfer the load. The mains failure detection monitors voltage and frequency on all phases and declares a failure when parameters fall outside acceptable limits.\n\nENKO AMF (Automatic Mains Failure) controllers continuously monitor utility power quality. When mains voltage drops below the setpoint (typically 80% of nominal) or frequency deviates excessively, the controller starts the timing sequence. After a configurable delay to ride through momentary disturbances, the start signal is issued.\n\nMains failure may be complete (all voltage lost) or partial (one phase lost, voltage depressed). Three-phase monitoring detects single-phase failures that could damage motor loads. The controller should be configured for the specific utility supply characteristics and load requirements.',
    ['Mains power lost', 'Generator start initiated', 'Load transfer pending', 'Mains failure LED active'],
    ['Utility power outage', 'Utility transformer failure', 'Incoming feeder fault', 'Main breaker tripped', 'Single phase failure'],
    ['Verify utility power status', 'Check utility meter', 'Inspect incoming breaker', 'Check for local utility work', 'Verify all phases present'],
    'Utility restoration or transfer to generator',
    'info',
    'Mains'
  ),

  ...createEnkoCode(
    'E302',
    'Mains Voltage Abnormal',
    'The utility mains voltage is outside the acceptable range but has not failed completely. This condition may cause equipment problems and may indicate an impending utility failure. The ENKO controller monitors mains voltage and can initiate generator start if voltage conditions warrant.\n\nVoltage abnormalities include both undervoltage and overvoltage conditions. Sustained low voltage (brownout) causes motors to draw excessive current and overheat. Overvoltage can damage electronic equipment and stress insulation. The controller provides configurable thresholds for warning and transfer.\n\nUtility voltage problems may be system-wide or local. Check with neighbors or the utility company to determine if the problem is widespread. Local causes include poor connections, undersized wiring, or equipment problems on the premises.',
    ['Mains voltage out of specification', 'Voltage warning active', 'Equipment may be affected', 'Possible transfer pending'],
    ['Utility voltage problem', 'High utility loading', 'Poor utility connection', 'Transformer tap setting', 'Incoming cable fault'],
    ['Monitor voltage trend', 'Check utility connection quality', 'Verify meter socket connections', 'Contact utility if persistent', 'Consider voltage regulation'],
    'Monitor for utility restoration',
    'warning',
    'Mains'
  ),

  ...createEnkoCode(
    'E303',
    'Mains Frequency Abnormal',
    'The utility mains frequency is outside the normal range. Utility frequency is tightly controlled and typically varies only slightly. Significant frequency deviation indicates a major utility system disturbance that may affect equipment operation.\n\nFrequency deviations occur when utility generation and load become imbalanced. Underfrequency indicates insufficient generation while overfrequency indicates excess generation. Most equipment tolerates small frequency deviations, but sustained off-frequency operation can affect motors, transformers, and timing equipment.\n\nThe ENKO controller monitors utility frequency as part of the power quality assessment. Severe frequency deviation may trigger a transfer to generator power to protect sensitive loads. Frequency abnormalities are usually utility-wide events rather than local problems.',
    ['Mains frequency out of specification', 'Frequency warning active', 'Motor speeds affected', 'Utility disturbance likely'],
    ['Utility system imbalance', 'Major generation loss', 'Utility island operation', 'Measurement error', 'Harmonic interference'],
    ['Monitor utility situation', 'Verify measurement accuracy', 'Check for utility notices', 'Consider transfer to generator', 'Contact utility if prolonged'],
    'Wait for utility frequency restoration',
    'warning',
    'Mains'
  ),

  ...createEnkoCode(
    'E304',
    'Transfer to Generator Complete',
    'The load has been successfully transferred from utility power to generator power. This is an informational event indicating the AMF sequence has completed successfully. The generator is now supplying the load, and the controller is monitoring for utility restoration.\n\nThe transfer sequence typically involves starting the generator, waiting for voltage and frequency stabilization, verifying generator power quality, and then operating the transfer switch to connect the load to the generator and disconnect from the utility. The timing and sequence are configurable based on load requirements.\n\nAfter transfer, the controller continues to monitor utility power for restoration. When utility power is restored and stable for the configured time period, the controller will initiate return transfer to utility power.',
    ['Load now on generator power', 'Transfer complete LED active', 'Generator carrying load', 'Utility being monitored'],
    ['Normal AMF sequence completion', 'Utility power failed', 'Manual transfer initiated'],
    ['Verify generator is stable', 'Monitor generator parameters', 'Check for utility restoration', 'Verify all loads are operational'],
    'Normal operation - await utility restoration',
    'info',
    'Mains'
  ),

  ...createEnkoCode(
    'E305',
    'Return to Mains Complete',
    'The load has been successfully transferred from generator power back to utility mains power. This is an informational event indicating the return transfer sequence has completed. The generator will now go through its cooldown period before stopping.\n\nReturn transfer occurs when utility power is restored and stable for the configured verification time. The sequence reconnects the load to utility power, disconnects from the generator, and begins the generator cooldown sequence. The transfer may be immediate or delayed based on configuration and load requirements.\n\nThe generator typically runs unloaded for a cooldown period (often 3-5 minutes) to allow engine temperatures to stabilize before shutdown. This reduces thermal stress on the engine.',
    ['Load now on utility power', 'Generator entering cooldown', 'Return transfer complete', 'Normal utility operation restored'],
    ['Utility power restored', 'AMF return sequence completed'],
    ['Verify utility power is stable', 'Allow generator cooldown', 'Check that all loads operational', 'Review event log for transfer details'],
    'Normal operation - generator will shut down',
    'info',
    'Mains'
  ),

  ...createEnkoCode(
    'E306',
    'Transfer Switch Failure',
    'The automatic transfer switch (ATS) has failed to operate correctly. This is a critical fault that prevents proper transfer between utility and generator power sources. The transfer switch is the mechanical device that connects the load to either the utility or the generator.\n\nTransfer switch failures can occur in either direction - failure to transfer to generator when utility fails, or failure to return to utility when power is restored. Causes include mechanical binding, motor drive failure, control circuit problems, or feedback switch malfunction.\n\nThe transfer switch is a critical safety device that also provides isolation between the two power sources. It must never connect both sources simultaneously (paralleling) unless specifically designed for that purpose. Transfer switch problems require immediate attention to restore reliable power switching.',
    ['Transfer switch did not operate', 'Load not switched', 'Transfer failure alarm active', 'Manual intervention required'],
    ['Transfer switch mechanism stuck', 'Motor drive failure', 'Control circuit fault', 'Auxiliary contact failure', 'Mechanical obstruction'],
    ['Check transfer switch position manually', 'Verify control signals present', 'Test motor drive operation', 'Inspect mechanism for binding', 'Check auxiliary contact operation'],
    'Repair transfer switch',
    'critical',
    'Mains'
  ),

  // ==================== SYNCHRONIZATION FAULTS (E400-E499) ====================
  ...createEnkoCode(
    'E401',
    'Synchronization Failed',
    'The synchronization attempt has failed after the configured timeout period. Synchronization is the process of matching the generator voltage, frequency, and phase angle with the utility or another generator before closing the paralleling breaker. Failed synchronization indicates one or more parameters could not be matched.\n\nENKO SYNC controllers provide automatic synchronization by adjusting generator speed (frequency) and excitation (voltage) to match the bus values. The phase angle must be within the closing angle window when the breaker close command is issued. If any parameter cannot be brought within limits, synchronization fails.\n\nCommon causes include excessive bus frequency drift, inadequate governor response, AVR instability, or instrument transformer errors. The synchronizer display shows the actual parameter values to aid troubleshooting.',
    ['Synchronization timeout', 'Breaker did not close', 'Sync failed alarm active', 'Generator running but not paralleled'],
    ['Bus frequency unstable', 'Generator frequency unstable', 'Voltage mismatch too large', 'Governor response too slow', 'AVR hunting'],
    ['Check incoming source stability', 'Verify governor response', 'Adjust AVR settings', 'Check synchronizer settings', 'Verify PT/CT accuracy'],
    'Adjust for proper synchronization',
    'warning',
    'Synchronization'
  ),

  ...createEnkoCode(
    'E402',
    'Frequency Difference Too High',
    'The frequency difference between the generator and the bus exceeds the synchronizer\'s operating range. The synchronizer can only adjust generator frequency within a limited range relative to bus frequency. If the initial frequency difference is too large, automatic synchronization cannot begin.\n\nThe generator frequency is controlled by the engine governor. Before synchronization can proceed, the generator frequency must be reasonably close to bus frequency. If the generator is significantly fast or slow, the synchronizer will indicate this fault.\n\nThis condition typically occurs if the generator speed setpoint is incorrect, the governor is malfunctioning, or the speed sensor is providing incorrect feedback. The generator frequency should be manually adjusted to within the synchronizer\'s operating range.',
    ['Frequency difference alarm', 'Synchronization cannot proceed', 'Generator frequency incorrect', 'Speed adjustment required'],
    ['Governor setpoint incorrect', 'Governor malfunction', 'Speed sensor error', 'Load on generator before sync', 'Bus frequency abnormal'],
    ['Adjust generator speed manually', 'Check governor settings', 'Verify speed sensor', 'Check for residual load', 'Verify bus frequency is normal'],
    'Adjust frequency to within range',
    'warning',
    'Synchronization'
  ),

  ...createEnkoCode(
    'E403',
    'Voltage Difference Too High',
    'The voltage difference between the generator and the bus exceeds the synchronizer\'s operating range. The synchronizer can adjust generator voltage within a limited range by controlling the AVR. If the initial voltage difference is too large, automatic synchronization cannot begin.\n\nGenerator voltage is controlled by the AVR (Automatic Voltage Regulator). Before synchronization can proceed, the generator voltage must be reasonably close to bus voltage. Large voltage differences at breaker closing cause high circulating current and mechanical stress.\n\nThis condition typically occurs if the AVR setpoint is incorrect, the AVR is malfunctioning, or the voltage sensing is in error. The generator voltage should be adjusted to within the synchronizer\'s operating range before attempting synchronization.',
    ['Voltage difference alarm', 'Synchronization cannot proceed', 'Generator voltage incorrect', 'AVR adjustment required'],
    ['AVR setpoint incorrect', 'AVR malfunction', 'Voltage sensing error', 'Bus voltage abnormal', 'Generator excitation problem'],
    ['Adjust generator voltage manually', 'Check AVR settings', 'Verify voltage sensing circuit', 'Check bus voltage', 'Test AVR response'],
    'Adjust voltage to within range',
    'warning',
    'Synchronization'
  ),

  ...createEnkoCode(
    'E404',
    'Reverse Power Trip',
    'The reverse power protection has operated, opening the generator breaker due to power flowing from the bus into the generator. Reverse power (motoring) occurs when the generator\'s prime mover is unable to supply the power being demanded, causing the electrical machine to function as a motor drawing power from the system.\n\nReverse power is dangerous because it can cause mechanical damage to the prime mover. For diesel engines, motoring can cause damage if the fuel supply is interrupted while the engine is still spinning. The reverse power protection opens the breaker to disconnect the generator from the bus.\n\nReverse power may be caused by fuel supply problems, governor malfunction, or engine mechanical issues. If the generator was intentionally being shut down, reverse power may occur briefly before the breaker opens as part of the normal shutdown sequence.',
    ['Generator breaker tripped', 'Reverse power alarm', 'Power flow from bus to generator', 'Engine may have stopped'],
    ['Engine fuel exhausted', 'Fuel solenoid activated', 'Governor failure', 'Engine mechanical failure', 'Intentional shutdown'],
    ['Check engine condition', 'Verify fuel supply', 'Check governor operation', 'Review sequence of events', 'Verify protection settings'],
    'Investigate cause and reset',
    'warning',
    'Synchronization'
  ),

  ...createEnkoCode(
    'E405',
    'Loss of Synchronism',
    'The generator has lost synchronization with the bus, meaning it is no longer running at the same frequency and phase as the power system. Loss of synchronism is a serious condition that causes large power oscillations and can damage the generator and connected equipment.\n\nLoss of synchronism (pole slip) occurs when the generator cannot maintain synchronous speed with the power system. This can happen during major system disturbances, severe electrical faults, or loss of excitation. The protection must act quickly to open the breaker and prevent equipment damage.\n\nWhen a generator loses sync, it alternately accelerates and decelerates relative to the system, causing large power and current swings. These oscillations stress the generator mechanically and electrically. Quick breaker opening limits the number of pole slips and the associated damage.',
    ['Severe power oscillations', 'Breaker tripped or tripping', 'Unstable current and voltage', 'System disturbance evident'],
    ['Major system fault', 'Loss of excitation', 'Severe overload', 'Prime mover trip', 'Governor failure'],
    ['Do not reconnect without investigation', 'Check for system fault', 'Verify excitation system', 'Check governor operation', 'Inspect for mechanical damage'],
    'Investigate cause thoroughly',
    'critical',
    'Synchronization'
  ),

  // ==================== PROTECTION FAULTS (E500-E599) ====================
  ...createEnkoCode(
    'E501',
    'Short Circuit Trip',
    'The short circuit protection has operated due to detecting a current well above normal operating levels, indicating a fault on the generator output or distribution system. Short circuit currents can be many times normal full load current and can cause severe damage to equipment and wiring if not interrupted quickly.\n\nENKO controllers provide short circuit protection that operates faster than the normal overload protection for high current faults. The protection uses instantaneous or very fast time characteristics to minimize fault duration and equipment damage.\n\nAfter a short circuit trip, the fault must be located and repaired before restoring power. Short circuits can occur in cables, connections, circuit breakers, or end-use equipment. Insulation testing helps identify the faulty circuit.',
    ['Generator output breaker tripped', 'Very high current before trip', 'Short circuit alarm active', 'Possible damage at fault location'],
    ['Cable failure', 'Connection fault', 'Equipment short circuit', 'Switchgear failure', 'Water intrusion'],
    ['Do not reset without investigation', 'Locate fault by isolation', 'Perform insulation tests', 'Inspect cables and connections', 'Repair fault before resetting'],
    'Repair fault and reset',
    'critical',
    'Protection'
  ),

  ...createEnkoCode(
    'E502',
    'Earth Leakage Trip',
    'The earth leakage (ground fault) protection has operated due to detecting current flowing to earth through an unintended path. Earth leakage indicates insulation failure that allows current to flow from a live conductor to the equipment frame or earth. This is a shock hazard and must be corrected before resuming operation.\n\nThe ENKO controller monitors for earth leakage using a residual current detection method or dedicated ground fault CT. When leakage current exceeds the setpoint, the protection operates to clear the hazard.\n\nEarth leakage can be caused by moisture in equipment, damaged insulation, rodent damage to cables, or deterioration of insulating materials. The fault may be in the generator, distribution system, or connected equipment.',
    ['Protection trip on earth fault', 'Residual current alarm', 'Possible shock hazard', 'Ground fault detected'],
    ['Cable insulation damage', 'Moisture in equipment', 'Equipment insulation failure', 'Contamination', 'Connection fault to ground'],
    ['Locate fault circuit by isolation', 'Test insulation resistance', 'Check for moisture', 'Inspect cables for damage', 'Test all equipment'],
    'Repair insulation fault',
    'critical',
    'Protection'
  ),

  ...createEnkoCode(
    'E503',
    'Overtemperature Alarm',
    'A temperature sensor has detected temperature exceeding the alarm threshold. This may be engine coolant, exhaust, generator winding, or ambient temperature depending on the installed sensors and configuration. High temperature requires attention to prevent equipment damage.\n\nThe ENKO controller can monitor multiple temperature inputs and provide individual alarm and trip setpoints for each. The alarm provides early warning to allow corrective action before reaching the trip point.\n\nTemperature alarms should be investigated promptly. Check cooling systems, air flow, and operating conditions. Reducing load can help reduce temperature while the cause is investigated.',
    ['Temperature alarm active', 'High temperature indication', 'Cooling may be inadequate', 'Trip pending if not corrected'],
    ['Cooling system problem', 'Excessive load', 'High ambient temperature', 'Ventilation blocked', 'Sensor malfunction'],
    ['Check cooling system operation', 'Reduce load if possible', 'Verify ventilation', 'Check sensor accuracy', 'Improve cooling if needed'],
    'Reduce temperature to clear alarm',
    'warning',
    'Protection'
  ),

  ...createEnkoCode(
    'E504',
    'Battery Voltage Low',
    'The starting battery voltage has dropped below the acceptable level. Adequate battery voltage is essential for reliable engine starting and controller operation. Low battery voltage may prevent successful starting or cause controller malfunction.\n\nThe ENKO controller monitors the starting battery (and control battery if separate) and provides warning when voltage drops below the setpoint. Battery voltage naturally decreases over time due to self-discharge and may drop further if the charging system is not functioning correctly.\n\nLow battery can result from charger failure, battery deterioration, excessive parasitic loads, or loose connections. The battery and charging system should be tested if this alarm occurs frequently.',
    ['Battery voltage warning active', 'Starting may fail', 'Controller operation affected', 'Charging system check needed'],
    ['Battery charger failure', 'Battery deteriorated', 'Loose battery connections', 'Parasitic load draining battery', 'Charger settings incorrect'],
    ['Check battery terminal connections', 'Test battery condition', 'Verify charger operation', 'Check for parasitic loads', 'Replace battery if aged'],
    'Restore proper battery charge',
    'warning',
    'Protection'
  ),

  ...createEnkoCode(
    'E505',
    'Emergency Stop Active',
    'The emergency stop circuit has been activated, causing immediate engine shutdown. The emergency stop provides a quick way to stop the generator in dangerous situations. The engine will not start until the emergency stop is reset and the controller is manually reset.\n\nThe ENKO controller monitors the emergency stop circuit and responds immediately when activated. The e-stop may be a pushbutton at the generator, a remote station, or triggered by a safety system. All e-stop activations should be investigated to determine the cause.\n\nThe emergency stop circuit is typically wired in a failsafe configuration where opened contacts (either intentionally or due to wire break) cause shutdown. This ensures the stop function works even with wiring faults.',
    ['Engine stopped immediately', 'E-stop LED active', 'Engine will not start', 'Manual reset required'],
    ['E-stop button pressed', 'Remote e-stop activated', 'Safety system trigger', 'E-stop circuit wire broken', 'E-stop relay failure'],
    ['Identify which e-stop activated', 'Determine reason for activation', 'Reset e-stop button', 'Check e-stop circuit if not obvious', 'Reset controller after e-stop reset'],
    'Reset e-stop and controller',
    'critical',
    'Protection'
  ),

  // ==================== COMMUNICATION FAULTS (E600-E699) ====================
  ...createEnkoCode(
    'E601',
    'RS485 Communication Failure',
    'The RS485 communication port has lost connection with the remote device (SCADA, BMS, or other controller). RS485 is a serial communication standard commonly used for industrial control and monitoring. Communication failure affects remote monitoring and control capabilities.\n\nThe ENKO controller RS485 port can use various protocols including Modbus RTU. Communication failure may indicate physical layer problems (wiring, termination) or protocol issues (address, baud rate mismatch). The controller continues to operate independently but remote visibility is lost.\n\nRS485 networks require proper termination and grounding for reliable operation. Long cable runs and electrical noise can cause communication errors. The communication statistics and error counters help diagnose connection quality issues.',
    ['Remote communication lost', 'SCADA alarms on communication', 'Communication LED status abnormal', 'Remote data stale'],
    ['RS485 cable fault', 'Improper termination', 'Address conflict', 'Baud rate mismatch', 'Protocol configuration error'],
    ['Check RS485 cable connections', 'Verify proper termination', 'Confirm slave address', 'Check baud rate settings', 'Test with known-good device'],
    'Restore RS485 communication',
    'warning',
    'Communication'
  ),

  ...createEnkoCode(
    'E602',
    'CAN Bus Communication Error',
    'The CAN (Controller Area Network) bus has communication errors. CAN is used for communication between ENKO controller modules and with J1939-compatible engine controllers. CAN errors indicate physical layer or protocol problems affecting the communication network.\n\nThe CAN bus is a robust communication network used in vehicles and industrial equipment. Errors can result from physical layer problems (wiring, termination), too many nodes, or software configuration issues. CAN includes error detection and will automatically isolate faulty nodes.\n\nENKO controllers using CAN for engine data acquisition will lose engine parameters if CAN communication fails. The controller may default to using analog sensor inputs if available, or may generate alarms for missing data.',
    ['CAN communication errors', 'Engine data missing', 'Module communication affected', 'CAN bus errors in log'],
    ['CAN wiring fault', 'Incorrect termination', 'Too many nodes', 'Ground potential difference', 'EMI interference'],
    ['Check CAN wiring and connections', 'Verify 120 ohm termination', 'Check for ground loops', 'Reduce EMI exposure', 'Check node count'],
    'Repair CAN bus',
    'warning',
    'Communication'
  ),

  ...createEnkoCode(
    'E603',
    'Engine ECU Communication Lost',
    'Communication with the engine electronic control unit (ECU) has been lost. Modern electronically-controlled engines use ECU communication (typically J1939/CAN) to provide engine data to the generator controller. Loss of communication means the controller cannot monitor engine parameters or may not be able to control certain engine functions.\n\nECU communication provides access to detailed engine data including temperatures, pressures, fuel consumption, and diagnostic codes. This data is used for monitoring, protection, and maintenance functions. When communication is lost, the controller may fall back to using hardwired sensor inputs if available.\n\nCommunication loss may be caused by CAN bus problems, ECU malfunction, or configuration issues. Some controllers can continue to operate with limited functionality using backup sensors.',
    ['Engine data unavailable', 'ECU fault codes not visible', 'Engine protection limited', 'Communication timeout with ECU'],
    ['CAN bus wiring fault', 'ECU malfunction', 'Baud rate mismatch', 'J1939 address conflict', 'ECU power supply problem'],
    ['Check CAN wiring to ECU', 'Verify ECU operation', 'Confirm J1939 source address', 'Check CAN baud rate setting', 'Test ECU communication independently'],
    'Restore ECU communication',
    'warning',
    'Communication'
  ),

  ...createEnkoCode(
    'E604',
    'Ethernet Link Down',
    'The Ethernet network connection has been lost. Ethernet provides network connectivity for remote monitoring, SCADA integration, and web-based access to the controller. Loss of Ethernet connection affects all IP-based remote access and monitoring.\n\nENKO controllers with Ethernet ports can provide web server access, Modbus TCP connectivity, and integration with building management systems. When the Ethernet link goes down, all these functions are unavailable until connectivity is restored.\n\nEthernet problems may be caused by cable faults, switch problems, or network configuration issues. The link LED on the Ethernet port provides basic connectivity status. If the physical connection is good, IP configuration and network settings should be verified.',
    ['Network connection lost', 'Web interface unreachable', 'Modbus TCP failed', 'Link LED off'],
    ['Ethernet cable disconnected', 'Network switch problem', 'IP address conflict', 'DHCP server issue', 'Network firewall blocking'],
    ['Check Ethernet cable connection', 'Verify network switch status', 'Test with direct cable connection', 'Check IP configuration', 'Verify network settings'],
    'Restore Ethernet connectivity',
    'info',
    'Communication'
  ),

  // ==================== AUXILIARY FAULTS (E700-E799) ====================
  ...createEnkoCode(
    'E701',
    'Block Heater Failure',
    'The engine block heater has failed or is not operating correctly. Block heaters keep the engine warm when not running to ensure reliable starting in cold conditions. Without proper block heating, diesel engines may be difficult to start and may experience excessive wear during cold starts.\n\nThe ENKO controller can monitor block heater operation through a temperature sensor or current feedback. If the engine fails to maintain proper temperature or the heater draws no current, this fault is generated.\n\nBlock heater problems include element failure, thermostat malfunction, power supply issues, or timer problems. The heater circuit should be checked including the heating element, thermostat, and power connections.',
    ['Engine not maintaining temperature', 'Block heater current zero', 'Cold start may be difficult', 'Block heater warning active'],
    ['Heating element burned out', 'Thermostat failure', 'Power supply disconnected', 'Timer malfunction', 'Wiring fault'],
    ['Check block heater power supply', 'Measure heater resistance', 'Verify thermostat operation', 'Check timer settings', 'Inspect wiring connections'],
    'Repair or replace block heater',
    'warning',
    'Auxiliary'
  ),

  ...createEnkoCode(
    'E702',
    'Battery Charger Failure',
    'The battery charger is not functioning correctly. The battery charger maintains the starting battery at full charge while the generator is not running. Without proper charging, the battery will discharge and eventually prevent starting.\n\nThe ENKO controller monitors charger operation through battery voltage, charging current, or charger status outputs. A charger failure alarm indicates the battery is not being maintained. This is a maintenance issue that should be addressed promptly to ensure starting reliability.\n\nBattery charger problems include AC supply failure, charger component failure, output fuse blown, or setting errors. The charger output voltage and current should be verified, along with AC power supply status.',
    ['Battery not charging', 'Charger output low or zero', 'Battery voltage declining', 'Charger failure alarm'],
    ['AC power to charger lost', 'Charger component failure', 'Output fuse blown', 'Battery connections loose', 'Charger settings incorrect'],
    ['Verify AC power to charger', 'Check charger output voltage', 'Inspect charger fuses', 'Check battery connections', 'Verify charger settings'],
    'Repair or replace battery charger',
    'warning',
    'Auxiliary'
  ),

  ...createEnkoCode(
    'E703',
    'Fuel Pump Failure',
    'The electric fuel pump or fuel transfer system is not operating correctly. The fuel pump transfers fuel from the main storage tank to the generator day tank or directly to the engine. Failure of the fuel pump will eventually cause the generator to run out of fuel.\n\nENKO controllers can monitor fuel pump operation through current feedback, flow sensor, or day tank level. If the pump fails to maintain fuel supply, this alarm is generated. Fuel pump failures should be addressed promptly to prevent fuel exhaustion during extended operation.\n\nFuel pump problems include motor failure, pump wear, clogged filters, or control circuit faults. The pump should be tested along with the control signals and power supply.',
    ['Fuel level not maintaining', 'Fuel pump not running', 'Day tank level dropping', 'Fuel pump alarm active'],
    ['Fuel pump motor failure', 'Pump mechanically worn', 'Fuel filter clogged', 'Control circuit fault', 'Power supply problem'],
    ['Check fuel pump operation', 'Verify pump motor current', 'Check fuel filters', 'Test control circuit', 'Inspect pump for wear'],
    'Repair or replace fuel pump',
    'warning',
    'Auxiliary'
  ),

  ...createEnkoCode(
    'E704',
    'Ventilation Fan Failure',
    'The generator room ventilation fan is not operating correctly. Proper ventilation is essential to provide combustion air, remove exhaust heat, and prevent dangerous buildup of exhaust gases. Fan failure can lead to engine overheating and unsafe air quality in the generator room.\n\nThe ENKO controller can monitor ventilation fan status through airflow sensors, current feedback, or fan status contacts. If ventilation is inadequate, this alarm is generated. The controller may prevent starting or shut down the engine if ventilation is not available.\n\nVentilation fan problems include motor failure, belt drive problems, obstructed airflow, or control circuit faults. The fan should be visually inspected along with inlet and outlet pathways.',
    ['Ventilation inadequate', 'Room temperature elevated', 'Fan not running', 'Ventilation alarm active'],
    ['Fan motor failure', 'Belt broken or slipping', 'Airway obstructed', 'Control circuit fault', 'Overload relay tripped'],
    ['Check fan operation visually', 'Inspect drive belt if applicable', 'Check airway for obstructions', 'Verify control signals', 'Check motor overload'],
    'Repair ventilation system',
    'warning',
    'Auxiliary'
  ),

  ...createEnkoCode(
    'E705',
    'Coolant Level Low',
    'The engine coolant level is below the acceptable minimum. Low coolant can cause engine overheating and damage. The cooling system should be inspected for leaks and topped up with the correct coolant mixture.\n\nThe ENKO controller monitors coolant level through a float switch or probe in the expansion tank or radiator. This provides warning before the level drops low enough to cause overheating. The alarm allows time to add coolant and investigate for leaks.\n\nCoolant loss may be due to external leaks (hoses, radiator, water pump), internal leaks (head gasket), or normal evaporation from the expansion tank. The system should be inspected for leaks and the coolant level maintained with the correct mixture.',
    ['Low coolant warning', 'Coolant level low', 'Possible leak present', 'Check coolant system'],
    ['External coolant leak', 'Hose failure', 'Radiator leak', 'Water pump seal failure', 'Head gasket leak'],
    ['Check coolant level visually', 'Inspect for leaks', 'Check hoses and connections', 'Test radiator cap', 'Check for exhaust in coolant'],
    'Add coolant and repair leaks',
    'warning',
    'Auxiliary'
  )
];

export function getEnkoFaultCodes(): ControllerFaultCode[] {
  return ENKO_FAULT_CODES as ControllerFaultCode[];
}
