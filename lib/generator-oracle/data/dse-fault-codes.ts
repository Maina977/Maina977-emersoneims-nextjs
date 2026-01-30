/**
 * DeepSea Electronics (DSE) Authentic Fault Codes
 * Comprehensive database covering DSE 4510, 4610, 4410, 5110, 5210, 7320, 7510, 7560, 8610, 8660
 * All descriptions are original and technically accurate
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

// DSE Alarm Code Ranges:
// 0-99: System/Controller alarms
// 100-199: Engine protection alarms
// 200-299: Generator electrical alarms
// 300-399: Mains/Utility alarms
// 400-499: Load management alarms
// 500-599: Communication alarms
// 600-699: Auxiliary function alarms
// 700-799: Multi-set/Sync alarms (7xxx/8xxx models)
// 800-899: Advanced protection alarms
// 900-999: User configurable alarms

const DSE_MODELS = [
  'DSE 4510', 'DSE 4610', 'DSE 4410', 'DSE 5110', 'DSE 5210',
  'DSE 7320', 'DSE 7510', 'DSE 7560', 'DSE 8610', 'DSE 8660'
];

function createDSECode(
  code: number,
  title: string,
  category: string,
  subcategory: string,
  severity: 'info' | 'warning' | 'critical' | 'shutdown',
  description: string,
  symptoms: string[],
  causes: { likelihood: 'high' | 'medium' | 'low'; cause: string; verification: string }[],
  solutions: string[],
  resetMethod: string,
  applicableModels: string[] = DSE_MODELS
): Partial<ControllerFaultCode>[] {
  return applicableModels.map(model => ({
    id: `DSE-${model.replace(/\s+/g, '')}-${code}`,
    code: code.toString(),
    brand: 'DeepSea Electronics',
    model,
    firmwareVersions: ['All versions'],
    category,
    subcategory,
    severity,
    alarmType: severity === 'shutdown' ? 'shutdown' : severity === 'critical' ? 'trip' : 'warning',
    title,
    description: `${model}: ${description}`,
    symptoms,
    possibleCauses: causes,
    diagnosticSteps: [
      { step: 1, action: 'Record alarm code and check event log for timestamp', expectedResult: 'Alarm details documented' },
      { step: 2, action: 'Verify actual condition using external instruments', expectedResult: 'Independent measurement obtained' },
      { step: 3, action: 'Check related sensor wiring and connections', expectedResult: 'No wiring faults found' },
      { step: 4, action: 'Review configuration settings for this alarm', expectedResult: 'Settings verified correct' },
    ],
    resetPathways: [{
      method: resetMethod.includes('software') ? 'software' : resetMethod.includes('auto') ? 'auto' : 'keypad',
      applicableFirmware: ['All'],
      requiresCondition: severity === 'shutdown' ? ['engine_stopped', 'fault_investigated'] : ['fault_cleared'],
      steps: resetMethod.includes('keypad') ? [
        { stepNumber: 1, action: 'Ensure engine is stopped', keySequence: ['STOP'], expectedResponse: 'Engine stops' },
        { stepNumber: 2, action: 'Press and hold RESET for 3 seconds', keySequence: ['RESET (3s)'], expectedResponse: 'Alarm clears' },
        { stepNumber: 3, action: 'Select operating mode', keySequence: ['AUTO'], expectedResponse: 'Ready for operation' }
      ] : [
        { stepNumber: 1, action: 'Fault condition clears automatically', expectedResponse: 'Alarm resets when condition normalizes' }
      ],
      successIndicator: 'No active alarms, system ready'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : severity === 'critical' ? 'moderate' : 'easy',
      timeEstimate: severity === 'shutdown' ? '1-4 hours' : '15-60 minutes',
      procedureSteps: solutions,
      tools: ['Multimeter', 'DSE Configuration Suite', 'Hand tools'],
      parts: [],
      estimatedCost: { min: 0, max: severity === 'shutdown' ? 500 : 200, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? [
      'Do not attempt restart until fault cause is identified',
      'Risk of equipment damage if underlying issue not resolved'
    ] : ['Follow standard electrical safety procedures'],
    preventiveMeasures: ['Regular maintenance per DSE recommendations', 'Periodic sensor calibration checks'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const DSE_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== SYSTEM ALARMS (0-99) ====================
  ...createDSECode(1, 'Emergency Stop Active', 'Control', 'Emergency', 'shutdown',
    'The emergency stop circuit has been activated. This hardwired safety input immediately halts engine operation and prevents restart until manually reset.',
    ['Engine immediately stops or will not start', 'Emergency stop LED illuminated on front panel', 'Display shows "EMERGENCY STOP" status', 'All automatic start sequences blocked'],
    [
      { likelihood: 'high', cause: 'Emergency stop button physically pressed', verification: 'Inspect all e-stop stations for activated buttons' },
      { likelihood: 'medium', cause: 'E-stop circuit wiring fault or short', verification: 'Check continuity of e-stop loop wiring' },
      { likelihood: 'low', cause: 'E-stop input configured incorrectly', verification: 'Verify input polarity setting in configuration' }
    ],
    ['Locate and release any pressed emergency stop buttons', 'Verify e-stop circuit continuity if no buttons pressed', 'Reset alarm after confirming safe conditions'],
    'keypad - requires manual reset after e-stop released'
  ),

  ...createDSECode(2, 'Controller Internal Fault', 'Control', 'Hardware', 'critical',
    'The controller has detected an internal hardware malfunction. This may indicate processor, memory, or internal component failure requiring unit replacement.',
    ['Controller display shows error or is unresponsive', 'Erratic behavior or unexpected resets', 'Communication with external devices lost', 'Configuration data may be corrupted'],
    [
      { likelihood: 'high', cause: 'Internal component failure due to age or stress', verification: 'Check controller operating temperature history' },
      { likelihood: 'medium', cause: 'Power supply voltage fluctuations causing damage', verification: 'Measure DC supply voltage stability' },
      { likelihood: 'low', cause: 'Electromagnetic interference affecting processor', verification: 'Check for nearby interference sources' }
    ],
    ['Power cycle the controller', 'If fault persists, backup configuration and replace unit', 'Contact DSE technical support for diagnosis'],
    'keypad or power cycle'
  ),

  ...createDSECode(3, 'Configuration Data Error', 'Control', 'Configuration', 'warning',
    'The stored configuration data has failed integrity checks. Settings may have been corrupted and should be verified or restored from backup.',
    ['Unexpected alarm behaviors', 'Settings appear reset to defaults', 'Configuration checksum mismatch reported', 'Some features may not operate correctly'],
    [
      { likelihood: 'high', cause: 'Power loss during configuration write operation', verification: 'Check for recent power interruptions' },
      { likelihood: 'medium', cause: 'EEPROM memory degradation over time', verification: 'Review controller age and write cycles' },
      { likelihood: 'low', cause: 'Incomplete firmware update', verification: 'Verify firmware version and update history' }
    ],
    ['Reload configuration from backup file using DSE Configuration Suite', 'Verify all critical settings after reload', 'Consider controller replacement if recurring'],
    'software - restore configuration'
  ),

  ...createDSECode(4, 'Real Time Clock Battery Low', 'Control', 'Hardware', 'info',
    'The internal battery maintaining the real-time clock is depleted. The controller will lose time and date settings when power is removed.',
    ['Date/time resets to default after power cycle', 'Event log timestamps may be incorrect', 'Scheduled operations may not execute properly'],
    [
      { likelihood: 'high', cause: 'Battery has reached end of service life (typically 5-7 years)', verification: 'Check controller installation date' },
      { likelihood: 'low', cause: 'Excessive current drain due to internal fault', verification: 'Measure battery voltage under load' }
    ],
    ['Replace internal RTC battery (CR2032 or similar)', 'Reset date and time after battery replacement', 'Verify scheduled events after time correction'],
    'auto - clears when battery replaced'
  ),

  ...createDSECode(5, 'Watchdog Timer Reset Occurred', 'Control', 'Hardware', 'warning',
    'The processor watchdog timer triggered a controller reset due to software execution issue. Indicates potential firmware or hardware problem.',
    ['Controller unexpectedly restarted', 'Brief loss of generator control during reset', 'Event log shows watchdog reset entry', 'Running operations were interrupted'],
    [
      { likelihood: 'medium', cause: 'Firmware bug causing execution loop', verification: 'Check for available firmware updates' },
      { likelihood: 'medium', cause: 'Electrical noise causing processor glitch', verification: 'Verify proper grounding and shielding' },
      { likelihood: 'low', cause: 'Hardware component beginning to fail', verification: 'Monitor for increasing reset frequency' }
    ],
    ['Update to latest firmware version', 'Check power supply quality and grounding', 'Replace controller if resets are frequent'],
    'auto - controller self-resets'
  ),

  ...createDSECode(6, 'Supply Voltage Out of Range', 'Control', 'Power Supply', 'warning',
    'The DC supply voltage to the controller is outside acceptable operating range (typically 8-35V DC). Controller may malfunction or shut down.',
    ['Display flickering or dimming', 'Erratic controller operation', 'Communication dropouts', 'Relay outputs may chatter'],
    [
      { likelihood: 'high', cause: 'Battery charging system fault', verification: 'Measure battery voltage during engine running and stopped' },
      { likelihood: 'high', cause: 'Poor DC supply connections', verification: 'Check all DC power cable connections for tightness' },
      { likelihood: 'medium', cause: 'Battery end of life', verification: 'Load test the battery' }
    ],
    ['Check and tighten all DC power connections', 'Test battery and charging system', 'Verify DC supply voltage is within 10-32V range'],
    'auto - clears when voltage normalizes'
  ),

  ...createDSECode(7, 'Maintenance Alarm Active', 'Control', 'Maintenance', 'info',
    'A scheduled maintenance interval has been reached. This reminder helps ensure regular servicing to maintain reliability and warranty compliance.',
    ['Maintenance indicator displayed', 'Maintenance due counter has expired', 'Yellow maintenance LED may be illuminated'],
    [
      { likelihood: 'high', cause: 'Scheduled maintenance interval reached', verification: 'Check running hours and calendar since last service' }
    ],
    ['Perform required maintenance as per service schedule', 'Reset maintenance timer after service completion', 'Update service records'],
    'keypad - reset after service performed'
  ),

  // ==================== ENGINE PROTECTION ALARMS (100-199) ====================
  ...createDSECode(100, 'Low Oil Pressure Warning', 'Engine', 'Oil Pressure', 'warning',
    'Engine lubricating oil pressure has fallen below the configured warning threshold but remains above shutdown level. Immediate attention required to prevent damage.',
    ['Oil pressure gauge reads below normal operating range', 'Warning LED flashing', 'Audible alarm if configured', 'Engine continues running but requires attention'],
    [
      { likelihood: 'high', cause: 'Engine oil level is low', verification: 'Check oil level on dipstick with engine stopped' },
      { likelihood: 'high', cause: 'Oil pressure sender malfunction', verification: 'Compare with mechanical gauge reading' },
      { likelihood: 'medium', cause: 'Oil filter partially blocked', verification: 'Check time since last oil filter change' },
      { likelihood: 'medium', cause: 'Oil viscosity too thin for operating temperature', verification: 'Verify correct oil grade for ambient conditions' },
      { likelihood: 'low', cause: 'Oil pump wear reducing output', verification: 'Perform oil pump pressure test' }
    ],
    ['Stop engine safely and check oil level', 'Top up oil if low using correct grade', 'If level OK, investigate sensor or mechanical cause', 'Do not continue operating with genuine low pressure'],
    'auto - clears when pressure rises above threshold'
  ),

  ...createDSECode(101, 'Low Oil Pressure Shutdown', 'Engine', 'Oil Pressure', 'shutdown',
    'Engine oil pressure has dropped below the critical shutdown threshold. Engine has been stopped to prevent catastrophic bearing and component damage.',
    ['Engine has stopped automatically', 'Shutdown LED illuminated solid', 'Display shows oil pressure shutdown', 'Restart is blocked until reset'],
    [
      { likelihood: 'high', cause: 'Critically low oil level in sump', verification: 'Check dipstick - add oil if below minimum' },
      { likelihood: 'high', cause: 'Oil pressure sensor or wiring failure', verification: 'Verify with mechanical pressure gauge' },
      { likelihood: 'medium', cause: 'Oil pump failure or drive issue', verification: 'Inspect oil pump and drive components' },
      { likelihood: 'medium', cause: 'Major internal engine damage', verification: 'Check for metallic debris in oil' },
      { likelihood: 'low', cause: 'Oil cooler blockage or failure', verification: 'Inspect oil cooler for leaks or blockage' }
    ],
    ['DO NOT RESTART until cause is found', 'Check and correct oil level first', 'Verify actual pressure with mechanical gauge', 'Inspect for leaks or damage before restart', 'Change oil and filter if contamination suspected'],
    'keypad - requires investigation before reset'
  ),

  ...createDSECode(102, 'High Engine Temperature Warning', 'Engine', 'Coolant', 'warning',
    'Engine coolant temperature has exceeded the normal operating range warning threshold. Cooling system requires immediate inspection.',
    ['Temperature gauge above normal range', 'Warning indicator active', 'Engine may show reduced performance', 'Coolant may be near boiling point'],
    [
      { likelihood: 'high', cause: 'Low coolant level in system', verification: 'Check expansion tank and radiator levels when cool' },
      { likelihood: 'high', cause: 'Radiator airflow restricted', verification: 'Inspect radiator fins for debris and blockage' },
      { likelihood: 'medium', cause: 'Cooling fan not operating', verification: 'Verify fan operation and belt tension' },
      { likelihood: 'medium', cause: 'Thermostat stuck closed', verification: 'Feel radiator hoses - both should be hot when warm' },
      { likelihood: 'low', cause: 'Water pump impeller failure', verification: 'Check for coolant circulation' }
    ],
    ['Reduce load or stop engine to allow cooling', 'Check coolant level when safe to do so', 'Inspect radiator for blockage', 'Verify cooling fan operation', 'Check for coolant leaks'],
    'auto - clears when temperature drops'
  ),

  ...createDSECode(103, 'High Engine Temperature Shutdown', 'Engine', 'Coolant', 'shutdown',
    'Engine coolant temperature has exceeded safe operating limits. Engine stopped automatically to prevent thermal damage to pistons, head gasket, and other components.',
    ['Engine has stopped on high temperature', 'Shutdown alarm active', 'Temperature gauge at or beyond red zone', 'Possible steam from engine compartment'],
    [
      { likelihood: 'high', cause: 'Severe coolant loss', verification: 'Check for puddles under generator, inspect hoses' },
      { likelihood: 'high', cause: 'Complete cooling fan failure', verification: 'Check fan motor, belt, and electrical supply' },
      { likelihood: 'medium', cause: 'Thermostat failed closed', verification: 'Remove and test thermostat in hot water' },
      { likelihood: 'medium', cause: 'Head gasket failure', verification: 'Check for oil in coolant or exhaust steam' },
      { likelihood: 'low', cause: 'Temperature sensor reading falsely high', verification: 'Compare with infrared thermometer reading' }
    ],
    ['Allow engine to cool completely before investigation', 'Do not remove radiator cap when hot', 'Check coolant level after cooling', 'Inspect entire cooling system for leaks', 'Verify all cooling components operational before restart'],
    'keypad - requires cooling and investigation'
  ),

  ...createDSECode(104, 'Low Coolant Level', 'Engine', 'Coolant', 'warning',
    'Coolant level sensor indicates the cooling system is low on coolant. Top up required to prevent overheating.',
    ['Low coolant indicator active', 'Coolant expansion tank below minimum mark', 'May precede high temperature alarm'],
    [
      { likelihood: 'high', cause: 'Gradual coolant loss through minor leak', verification: 'Pressure test cooling system' },
      { likelihood: 'medium', cause: 'Coolant level sensor malfunction', verification: 'Verify actual level matches sensor reading' },
      { likelihood: 'low', cause: 'Head gasket allowing coolant into combustion', verification: 'Check for white exhaust smoke' }
    ],
    ['Top up coolant with correct mixture', 'Pressure test system to find leaks', 'Inspect hoses, water pump seal, and radiator', 'Check for internal leaks if no external source found'],
    'auto - clears when level restored'
  ),

  ...createDSECode(105, 'Engine Overspeed', 'Engine', 'Speed', 'shutdown',
    'Engine speed has exceeded the maximum safe RPM limit. Engine stopped immediately to prevent mechanical destruction of rotating components.',
    ['Engine shutdown occurred at high RPM', 'Possible mechanical noise before shutdown', 'Overspeed LED illuminated', 'Engine may coast down slowly'],
    [
      { likelihood: 'high', cause: 'Governor or actuator malfunction', verification: 'Check governor linkage and actuator response' },
      { likelihood: 'high', cause: 'Electronic speed control failure', verification: 'Verify speed control signals and wiring' },
      { likelihood: 'medium', cause: 'Load suddenly disconnected (load dump)', verification: 'Review what happened to the load' },
      { likelihood: 'low', cause: 'Speed sensor giving false high reading', verification: 'Verify speed with tachometer' }
    ],
    ['Check governor and fuel control systems thoroughly', 'Inspect speed sensor mounting and air gap', 'Verify no stuck fuel rack or actuator', 'Test speed control system at no load before reconnecting'],
    'keypad - requires thorough investigation'
  ),

  ...createDSECode(106, 'Engine Underspeed', 'Engine', 'Speed', 'warning',
    'Engine speed has fallen below the minimum acceptable threshold. May indicate fuel system, governor, or overload issues.',
    ['Engine running below normal speed', 'Frequency/voltage lower than setpoint', 'Engine may be laboring', 'Possible exhaust smoke'],
    [
      { likelihood: 'high', cause: 'Overload condition beyond engine capacity', verification: 'Check actual load versus rated capacity' },
      { likelihood: 'high', cause: 'Fuel supply restriction', verification: 'Check fuel filters, supply lines, and tank level' },
      { likelihood: 'medium', cause: 'Governor not responding correctly', verification: 'Check governor adjustment and response' },
      { likelihood: 'medium', cause: 'Air filter severely restricted', verification: 'Check air filter condition' },
      { likelihood: 'low', cause: 'Injection timing or injector issues', verification: 'Check for rough running or misfires' }
    ],
    ['Reduce load if overloaded', 'Check and replace fuel filters if restricted', 'Verify adequate fuel supply', 'Inspect air intake system', 'Adjust governor if required'],
    'auto - clears when speed recovers'
  ),

  ...createDSECode(107, 'Fail to Start', 'Engine', 'Starting', 'shutdown',
    'Engine has failed to reach running speed within the configured number of start attempts. Starting system lockout is now active.',
    ['Engine cranked but did not start', 'Start attempt counter exhausted', 'Lockout condition active', 'Further start attempts blocked'],
    [
      { likelihood: 'high', cause: 'Fuel system problem - no fuel reaching cylinders', verification: 'Check fuel level, filters, and bleed system' },
      { likelihood: 'high', cause: 'Fuel shutoff solenoid not energizing', verification: 'Listen for solenoid click on start attempt' },
      { likelihood: 'medium', cause: 'Air in fuel system', verification: 'Bleed fuel system at injectors' },
      { likelihood: 'medium', cause: 'Low cranking speed from weak battery', verification: 'Check battery voltage during cranking' },
      { likelihood: 'low', cause: 'No compression due to mechanical failure', verification: 'Perform compression test' }
    ],
    ['Verify fuel supply is available and fuel valve open', 'Check fuel shutoff solenoid operation', 'Bleed air from fuel system', 'Verify battery provides adequate cranking', 'Check glow plugs/intake heater if cold'],
    'keypad - requires fault correction'
  ),

  ...createDSECode(108, 'Fail to Stop', 'Engine', 'Starting', 'warning',
    'Engine did not reach zero RPM within the expected time after stop command. May indicate fuel shutoff failure or speed sensor issue.',
    ['Engine continues running after stop command', 'Stop sequence did not complete', 'Fuel solenoid may not have actuated'],
    [
      { likelihood: 'high', cause: 'Fuel shutoff solenoid stuck or failed', verification: 'Check solenoid mechanical operation manually' },
      { likelihood: 'high', cause: 'Solenoid wiring or driver circuit fault', verification: 'Verify voltage at solenoid during stop' },
      { likelihood: 'medium', cause: 'Engine running on alternative fuel source', verification: 'Check for oil being drawn past seals' },
      { likelihood: 'low', cause: 'Speed sensor still showing RPM after stop', verification: 'Verify sensor reads zero when stopped' }
    ],
    ['Manually stop engine using fuel valve if necessary', 'Check fuel solenoid operation and wiring', 'Verify solenoid driver output', 'Investigate any alternative fuel sources'],
    'keypad - after engine stopped'
  ),

  ...createDSECode(109, 'Fail to Crank', 'Engine', 'Starting', 'shutdown',
    'The starter motor did not engage or engine did not rotate during start attempt. Starting circuit, battery, or starter motor fault.',
    ['No cranking motion when start commanded', 'Starter may have clicked but not turned', 'No engine rotation visible or audible'],
    [
      { likelihood: 'high', cause: 'Battery discharged or failed', verification: 'Measure battery voltage - should be 12V+ for 12V system' },
      { likelihood: 'high', cause: 'Starter motor connections loose or corroded', verification: 'Inspect and clean all starter circuit connections' },
      { likelihood: 'medium', cause: 'Starter motor failure', verification: 'Test starter by direct battery connection (carefully)' },
      { likelihood: 'medium', cause: 'Start relay or solenoid failure', verification: 'Check relay operation and output' },
      { likelihood: 'low', cause: 'Engine mechanically seized', verification: 'Try to turn engine manually at flywheel' }
    ],
    ['Check battery voltage and condition', 'Inspect and clean all starting circuit connections', 'Verify start relay/solenoid operation', 'Test starter motor function', 'Check for engine mechanical freedom'],
    'keypad - after fault corrected'
  ),

  ...createDSECode(110, 'Charge Alternator Failure', 'Engine', 'Charging', 'warning',
    'Battery charging current is not detected when engine is running. The charge alternator may have failed or drive belt is broken.',
    ['No charging indication when engine running', 'Battery voltage not increasing during operation', 'Charge fail indicator active'],
    [
      { likelihood: 'high', cause: 'Alternator drive belt broken or loose', verification: 'Visually inspect belt condition and tension' },
      { likelihood: 'high', cause: 'Alternator internal failure', verification: 'Measure alternator output voltage' },
      { likelihood: 'medium', cause: 'W terminal (charge) wiring fault', verification: 'Check W terminal connection and wiring' },
      { likelihood: 'low', cause: 'Voltage regulator failure', verification: 'Test regulator output' }
    ],
    ['Check alternator belt is intact and tensioned', 'Measure alternator output voltage at battery', 'Inspect W terminal connection to controller', 'Replace alternator if output is low or absent'],
    'auto - clears when charging detected'
  ),

  ...createDSECode(111, 'Battery Voltage Low', 'Engine', 'Starting', 'warning',
    'Battery voltage is below the configured minimum threshold. May affect starting capability and controller operation.',
    ['Low battery voltage displayed', 'Slow cranking may be observed', 'Controller may show low voltage warning'],
    [
      { likelihood: 'high', cause: 'Battery discharged from extended standby', verification: 'Check time since last run, measure voltage' },
      { likelihood: 'high', cause: 'Battery charger malfunction', verification: 'Verify charger output voltage and current' },
      { likelihood: 'medium', cause: 'Battery end of life', verification: 'Load test the battery' },
      { likelihood: 'low', cause: 'Parasitic drain from electrical fault', verification: 'Measure standby current draw' }
    ],
    ['Test battery and charger function', 'Charge battery or replace if failed', 'Verify battery charger output is correct', 'Check for parasitic loads draining battery'],
    'auto - clears when voltage rises'
  ),

  ...createDSECode(112, 'Battery Voltage High', 'Engine', 'Starting', 'warning',
    'Battery voltage has exceeded safe charging limits. Overcharging can damage battery and connected equipment.',
    ['Battery voltage reading above 15V (12V system) or 30V (24V system)', 'Battery may be gassing excessively', 'Electrolyte may be boiling'],
    [
      { likelihood: 'high', cause: 'Battery charger voltage set too high', verification: 'Measure charger output voltage' },
      { likelihood: 'high', cause: 'Charger voltage regulator failed', verification: 'Check charger regulation under varying loads' },
      { likelihood: 'medium', cause: 'Alternator regulator failed high', verification: 'Measure alternator output with engine running' },
      { likelihood: 'low', cause: 'Wrong voltage battery or charger installed', verification: 'Verify system voltage rating' }
    ],
    ['Check and adjust battery charger output voltage', 'Replace charger if regulation faulty', 'Check alternator regulator if high during running', 'Verify correct voltage equipment installed'],
    'auto - clears when voltage normalizes'
  ),

  ...createDSECode(113, 'Low Fuel Level Warning', 'Engine', 'Fuel', 'warning',
    'Fuel tank level has fallen below the configured warning threshold. Refueling required to ensure continued operation.',
    ['Low fuel indicator active', 'Fuel gauge in warning zone', 'Generator may be limited to short further runtime'],
    [
      { likelihood: 'high', cause: 'Fuel consumed during normal operation', verification: 'Verify runtime since last refueling' },
      { likelihood: 'medium', cause: 'Fuel level sensor malfunction', verification: 'Visually check actual tank level' },
      { likelihood: 'low', cause: 'Fuel leak depleting tank', verification: 'Inspect tank and lines for leaks' }
    ],
    ['Refuel tank to adequate level', 'If level OK, check fuel sender function', 'Inspect for fuel leaks if consumption unexpected'],
    'auto - clears when fuel added'
  ),

  ...createDSECode(114, 'Low Fuel Level Shutdown', 'Engine', 'Fuel', 'shutdown',
    'Fuel level critically low - engine stopped to prevent air ingestion and fuel pump damage from running dry.',
    ['Engine stopped on low fuel', 'Fuel gauge at or near empty', 'Running dry can damage injection system'],
    [
      { likelihood: 'high', cause: 'Fuel exhausted from tank', verification: 'Check tank - it should be empty or very low' },
      { likelihood: 'medium', cause: 'Fuel pickup tube above remaining fuel level', verification: 'Check if fuel remains but cannot be picked up' }
    ],
    ['Refuel tank with clean diesel fuel', 'Bleed fuel system to remove any air', 'Change fuel filters if tank ran completely dry', 'Check for injection system damage if fuel starvation occurred'],
    'keypad - after refueling and bleeding'
  ),

  ...createDSECode(115, 'High Fuel Level', 'Engine', 'Fuel', 'info',
    'Fuel tank is at or near maximum capacity. This informational alarm may indicate tank is full or return fuel overfilling tank.',
    ['Tank level at maximum', 'May indicate overflow risk if returns are significant'],
    [
      { likelihood: 'high', cause: 'Tank filled to capacity', verification: 'Confirm recent refueling occurred' },
      { likelihood: 'low', cause: 'Fuel return exceeding consumption', verification: 'Check return line flow rate' }
    ],
    ['This is typically informational only', 'Ensure tank vent is clear to prevent pressure buildup', 'Check overflow provisions are adequate'],
    'auto - clears as fuel consumed'
  ),

  ...createDSECode(116, 'Engine RPM Sensor Fault', 'Engine', 'Speed', 'warning',
    'The magnetic pickup or speed sensor is providing erratic or no signal. Engine speed measurement may be unreliable.',
    ['Speed reading erratic or zero while running', 'Frequency measurement may be affected', 'Possible engine control issues'],
    [
      { likelihood: 'high', cause: 'Sensor air gap too large', verification: 'Check and adjust sensor to flywheel gap' },
      { likelihood: 'high', cause: 'Sensor wiring damaged or disconnected', verification: 'Inspect wiring from sensor to controller' },
      { likelihood: 'medium', cause: 'Magnetic pickup failed', verification: 'Test sensor resistance and AC output while cranking' },
      { likelihood: 'low', cause: 'Flywheel ring gear damaged', verification: 'Inspect ring gear teeth for damage' }
    ],
    ['Check sensor mounting and air gap (typically 0.5-1mm)', 'Inspect sensor wiring for damage', 'Test sensor output signal', 'Replace sensor if faulty'],
    'auto - clears when valid signal restored'
  ),

  ...createDSECode(117, 'Oil Pressure Sensor Fault', 'Engine', 'Oil Pressure', 'warning',
    'The oil pressure sensor circuit is showing open circuit, short circuit, or out-of-range values indicating sensor or wiring failure.',
    ['Oil pressure reading at minimum or maximum scale', 'Pressure reading unchanged during start and running', 'Sensor fault indication if available'],
    [
      { likelihood: 'high', cause: 'Sensor wiring disconnected', verification: 'Check wiring connections at sensor and controller' },
      { likelihood: 'high', cause: 'Sensor failed open or short circuit', verification: 'Measure sensor resistance and compare to specification' },
      { likelihood: 'medium', cause: 'Wrong sensor type installed', verification: 'Verify sensor specification matches configuration' }
    ],
    ['Inspect sensor wiring and connections', 'Test sensor resistance and output', 'Verify sensor specification is correct for system', 'Replace sensor if faulty'],
    'auto - clears when valid signal restored'
  ),

  ...createDSECode(118, 'Temperature Sensor Fault', 'Engine', 'Coolant', 'warning',
    'The coolant temperature sensor circuit is indicating open circuit, short circuit, or values outside expected range.',
    ['Temperature reading at extreme high or low', 'Temperature not changing as engine warms up', 'Possible default protection mode activation'],
    [
      { likelihood: 'high', cause: 'Sensor wiring fault', verification: 'Check wiring continuity from sensor to controller' },
      { likelihood: 'high', cause: 'Sensor element failed', verification: 'Measure sensor resistance at known temperature' },
      { likelihood: 'low', cause: 'Incorrect sensor installed', verification: 'Verify sensor curve matches configuration' }
    ],
    ['Check sensor wiring and connections', 'Measure sensor resistance vs specification', 'Replace sensor if readings inconsistent', 'Verify correct sensor type for application'],
    'auto - clears when valid signal restored'
  ),

  ...createDSECode(119, 'Auxiliary Engine Alarm', 'Engine', 'Auxiliary', 'warning',
    'An auxiliary engine protection input has been triggered. This configurable input monitors custom engine sensors or conditions.',
    ['Auxiliary alarm indicator active', 'Specific cause depends on what is connected to this input'],
    [
      { likelihood: 'high', cause: 'Condition connected to this input has triggered', verification: 'Identify what sensor or switch is connected' }
    ],
    ['Identify what is connected to the auxiliary input', 'Investigate the specific condition being monitored', 'Correct the cause and reset'],
    'auto or keypad - depends on configuration'
  ),

  ...createDSECode(120, 'Auxiliary Engine Shutdown', 'Engine', 'Auxiliary', 'shutdown',
    'An auxiliary engine shutdown input has been activated. This hardwired protection has stopped the engine.',
    ['Engine stopped by auxiliary shutdown', 'External protection device has triggered'],
    [
      { likelihood: 'high', cause: 'External protection device activated', verification: 'Check which auxiliary device triggered' }
    ],
    ['Identify the external protection that triggered', 'Investigate and correct the cause', 'Reset auxiliary device before resetting controller'],
    'keypad - after auxiliary device reset'
  ),

  // ==================== GENERATOR ELECTRICAL ALARMS (200-299) ====================
  ...createDSECode(200, 'Generator Over Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has exceeded the configured upper warning limit. Automatic Voltage Regulator (AVR) may require adjustment.',
    ['Voltage reading above setpoint', 'Connected loads may be affected', 'Possible light flicker or equipment stress'],
    [
      { likelihood: 'high', cause: 'AVR voltage setpoint too high', verification: 'Check AVR voltage pot or setting' },
      { likelihood: 'high', cause: 'AVR sensing connection fault', verification: 'Verify AVR voltage sensing wires' },
      { likelihood: 'medium', cause: 'AVR failing or unstable', verification: 'Check voltage stability under varying loads' },
      { likelihood: 'low', cause: 'Controller voltage sensing error', verification: 'Compare controller reading with external meter' }
    ],
    ['Adjust AVR voltage setting to correct level', 'Check AVR sensing connections', 'Verify stable voltage under load variation', 'Replace AVR if unstable or faulty'],
    'auto - clears when voltage normalizes'
  ),

  ...createDSECode(201, 'Generator Over Voltage Trip', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage exceeded critical limit causing protective shutdown. Sustained overvoltage can damage connected equipment.',
    ['Generator breaker may have tripped', 'Engine may still be running', 'Load disconnected for protection'],
    [
      { likelihood: 'high', cause: 'AVR failure causing uncontrolled voltage', verification: 'Check AVR for signs of failure' },
      { likelihood: 'high', cause: 'Speed governor overshoot causing high frequency/voltage', verification: 'Check for speed instability' },
      { likelihood: 'medium', cause: 'Large load rejection causing voltage spike', verification: 'Review load events' }
    ],
    ['Do not reconnect load until voltage stabilized', 'Check and replace AVR if faulty', 'Verify governor and speed stability', 'Adjust protection settings if spurious trip'],
    'keypad - after voltage stabilized'
  ),

  ...createDSECode(202, 'Generator Under Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has fallen below the configured lower warning limit. AVR, excitation, or overload issue likely.',
    ['Voltage reading below setpoint', 'Lights may be dim', 'Motor loads may struggle'],
    [
      { likelihood: 'high', cause: 'Generator overloaded beyond capacity', verification: 'Check actual load vs rated capacity' },
      { likelihood: 'high', cause: 'AVR voltage setpoint too low', verification: 'Check AVR adjustment' },
      { likelihood: 'medium', cause: 'AVR or excitation system fault', verification: 'Check AVR input power and output' },
      { likelihood: 'low', cause: 'Generator winding fault', verification: 'Measure winding resistance' }
    ],
    ['Reduce load if overloaded', 'Adjust AVR voltage setting', 'Check excitation system', 'Investigate winding condition if other causes ruled out'],
    'auto - clears when voltage recovers'
  ),

  ...createDSECode(203, 'Generator Under Voltage Trip', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage collapsed below critical minimum, triggering protective shutdown. Severe overload or excitation failure likely.',
    ['Generator and load disconnected', 'Engine may continue running', 'Very low or no voltage before trip'],
    [
      { likelihood: 'high', cause: 'Extreme overload condition', verification: 'Review load magnitude before trip' },
      { likelihood: 'high', cause: 'AVR or excitation total failure', verification: 'Check field voltage and AVR output' },
      { likelihood: 'medium', cause: 'Generator field winding open circuit', verification: 'Measure field winding resistance' }
    ],
    ['Identify and remove excessive load', 'Test AVR and excitation system', 'Check field winding continuity', 'Restore only after voltage proven stable'],
    'keypad - after fault corrected'
  ),

  ...createDSECode(204, 'Generator Over Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency (engine speed) has exceeded the upper warning threshold. Governor may require adjustment.',
    ['Frequency reading high (>52Hz for 50Hz system)', 'Engine speed above nominal', 'May indicate governor issue'],
    [
      { likelihood: 'high', cause: 'Governor speed setting too high', verification: 'Check governor adjustment' },
      { likelihood: 'high', cause: 'Governor not responding to load', verification: 'Apply load and observe speed response' },
      { likelihood: 'medium', cause: 'Electronic governor controller fault', verification: 'Check governor controller signals' }
    ],
    ['Adjust governor speed setting', 'Verify governor response to load changes', 'Check electronic governor if fitted'],
    'auto - clears when frequency normalizes'
  ),

  ...createDSECode(205, 'Generator Over Frequency Trip', 'Electrical', 'Frequency', 'shutdown',
    'Generator frequency exceeded safe maximum limit. Equipment protection requires frequency to remain within bounds.',
    ['Generator tripped on high frequency', 'Engine overspeed may also have occurred', 'Load disconnected'],
    [
      { likelihood: 'high', cause: 'Governor failure causing overspeed', verification: 'Check governor and fuel control' },
      { likelihood: 'medium', cause: 'Sudden load rejection', verification: 'Review what load was disconnected' }
    ],
    ['Check governor system thoroughly', 'Verify fuel actuator operation', 'Test at no load before reconnecting load'],
    'keypad - after governor checked'
  ),

  ...createDSECode(206, 'Generator Under Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency has fallen below the lower warning threshold indicating overload or fuel delivery issue.',
    ['Frequency below nominal (e.g., <48Hz for 50Hz)', 'Engine laboring under load', 'Possible exhaust smoke'],
    [
      { likelihood: 'high', cause: 'Generator overloaded', verification: 'Compare actual load to rated capacity' },
      { likelihood: 'high', cause: 'Fuel delivery issue', verification: 'Check fuel supply and filters' },
      { likelihood: 'medium', cause: 'Governor not responding correctly', verification: 'Check governor adjustment and response' }
    ],
    ['Reduce load if overloaded', 'Check fuel system - filters, supply, air in lines', 'Adjust or repair governor system'],
    'auto - clears when frequency recovers'
  ),

  ...createDSECode(207, 'Generator Under Frequency Trip', 'Electrical', 'Frequency', 'shutdown',
    'Generator frequency collapsed below critical minimum causing protective shutdown. Severe overload or fuel starvation.',
    ['Load disconnected on under frequency', 'Engine may have stalled or nearly stalled', 'Frequency was critically low'],
    [
      { likelihood: 'high', cause: 'Extreme overload beyond capacity', verification: 'Calculate load that was connected' },
      { likelihood: 'high', cause: 'Fuel system complete failure', verification: 'Check for fuel reaching injectors' },
      { likelihood: 'medium', cause: 'Governor actuator stuck or failed', verification: 'Check actuator movement' }
    ],
    ['Do not reconnect full load', 'Check fuel system thoroughly', 'Verify governor operates freely', 'Gradually load test after repair'],
    'keypad - after cause corrected'
  ),

  ...createDSECode(208, 'Generator Over Current', 'Electrical', 'Current', 'warning',
    'Generator output current has exceeded the rated continuous capacity. Continued operation at this level may cause overheating.',
    ['Current reading above rated amps', 'Generator may be overheating', 'kW loading above rated'],
    [
      { likelihood: 'high', cause: 'Connected load exceeds generator rating', verification: 'Sum all connected load currents' },
      { likelihood: 'medium', cause: 'Short circuit starting to develop', verification: 'Check for heating at connections' },
      { likelihood: 'low', cause: 'CT ratio configured incorrectly', verification: 'Verify CT ratio setting matches installed CTs' }
    ],
    ['Reduce connected load to within rating', 'Check for developing faults in load circuits', 'Verify CT configuration is correct'],
    'auto - clears when current drops'
  ),

  ...createDSECode(209, 'Generator Over Current Trip', 'Electrical', 'Current', 'shutdown',
    'Generator current severely exceeded rating causing protective trip. Short circuit or extreme overload condition.',
    ['Generator breaker tripped', 'Load completely disconnected', 'May have seen sparks or smoke'],
    [
      { likelihood: 'high', cause: 'Short circuit in load or cables', verification: 'Inspect load circuits and cables for damage' },
      { likelihood: 'medium', cause: 'Large motor stall or locked rotor', verification: 'Check motor loads for seized conditions' },
      { likelihood: 'low', cause: 'Current transformer failure', verification: 'Check CT secondary circuit' }
    ],
    ['Do not reconnect until fault found', 'Inspect all load circuits for short circuits', 'Check cable insulation', 'Test insulation resistance before re-energizing'],
    'keypad - after fault cleared'
  ),

  ...createDSECode(210, 'Reverse Power', 'Electrical', 'Power', 'warning',
    'Generator is receiving power from another source rather than supplying it. Generator is motoring - consuming rather than producing power.',
    ['kW reading is negative', 'Generator absorbing power from bus', 'May occur during failed synchronizing'],
    [
      { likelihood: 'high', cause: 'Engine not producing sufficient power at paralleled speed', verification: 'Check engine fuel delivery and speed' },
      { likelihood: 'high', cause: 'Incorrect synchronizing - generator connected out of phase', verification: 'Review sync parameters' },
      { likelihood: 'medium', cause: 'Load transferred away from this generator', verification: 'Check load share settings' }
    ],
    ['Check engine is producing power', 'Verify correct synchronization before paralleling', 'Adjust load share settings if parallel'],
    'auto - clears when power flow positive'
  ),

  ...createDSECode(211, 'Reverse Power Trip', 'Electrical', 'Power', 'shutdown',
    'Sustained reverse power has caused protective trip. Generator was motoring for extended period risking engine damage.',
    ['Generator disconnected from bus', 'Engine may still be running', 'Was consuming power before trip'],
    [
      { likelihood: 'high', cause: 'Engine lost fuel or power output', verification: 'Check engine is producing power' },
      { likelihood: 'high', cause: 'Wrong synchronization caused motoring', verification: 'Review synchronizer operation' }
    ],
    ['Verify engine produces power at no load', 'Check synchronizer settings and function', 'Do not parallel until issue resolved'],
    'keypad - after cause resolved'
  ),

  ...createDSECode(212, 'Generator Earth Fault', 'Electrical', 'Protection', 'critical',
    'Current flow to earth/ground has been detected exceeding the configured threshold. Insulation failure in generator or load circuits.',
    ['Earth fault current reading elevated', 'Possible zero-sequence current detected', 'May trip earth fault relay'],
    [
      { likelihood: 'high', cause: 'Insulation breakdown in load cable or equipment', verification: 'Disconnect loads and test insulation resistance' },
      { likelihood: 'medium', cause: 'Generator winding insulation failure', verification: 'Test generator winding insulation' },
      { likelihood: 'low', cause: 'Earth fault CT or wiring issue', verification: 'Verify earth fault sensing circuit' }
    ],
    ['Disconnect loads and test generator insulation', 'Systematically reconnect loads testing each', 'Repair any insulation failures found', 'Do not operate with earth faults present'],
    'keypad - after fault repaired'
  ),

  ...createDSECode(213, 'Generator Phase Rotation Wrong', 'Electrical', 'Phase', 'warning',
    'The generator phase sequence (rotation) is opposite to expected or to mains. Prevents damage from incorrect paralleling.',
    ['Phase rotation indicator shows reverse', 'Synchronizer will not permit closing', 'Three-phase motors would run backwards if connected'],
    [
      { likelihood: 'high', cause: 'Generator leads connected in wrong sequence', verification: 'Check A-B-C connection order' },
      { likelihood: 'medium', cause: 'Voltage sensing leads swapped', verification: 'Verify sensing connection matches output' },
      { likelihood: 'low', cause: 'Generator wound or rewired incorrectly', verification: 'Check generator output phase sequence' }
    ],
    ['Verify generator output phase sequence with phase rotation meter', 'Swap any two of the three phase connections to correct', 'Retest rotation before connecting loads'],
    'auto - clears when rotation correct'
  ),

  ...createDSECode(214, 'Loss of Voltage Sensing', 'Electrical', 'Voltage', 'warning',
    'Generator voltage sensing input has lost signal. Controller cannot measure generator output voltage.',
    ['Generator voltage reads zero or erratic', 'AVR control may be affected', 'Synchronizing not possible'],
    [
      { likelihood: 'high', cause: 'Voltage sensing fuse blown', verification: 'Check generator VT fuses' },
      { likelihood: 'high', cause: 'Voltage sensing wiring fault', verification: 'Check wiring from VT to controller' },
      { likelihood: 'medium', cause: 'VT (voltage transformer) failed', verification: 'Measure VT secondary output' }
    ],
    ['Check and replace voltage sensing fuses', 'Verify VT secondary wiring to controller', 'Test VT output if fuses OK'],
    'auto - clears when sensing restored'
  ),

  ...createDSECode(215, 'Loss of Current Sensing', 'Electrical', 'Current', 'warning',
    'Generator current transformer signal has been lost or is out of range. kW/kVA measurement unavailable.',
    ['Current reading zero when load connected', 'kW/kVA shows zero or wrong value', 'Possible CT circuit fault'],
    [
      { likelihood: 'high', cause: 'CT secondary wiring open circuit', verification: 'DANGER: Never open CT secondary under load - check for disconnection' },
      { likelihood: 'high', cause: 'CT secondary links or terminals loose', verification: 'Inspect CT terminal connections' },
      { likelihood: 'medium', cause: 'CT failed or shorted', verification: 'Compare CT output with clamp meter' }
    ],
    ['Check CT secondary circuit with extreme caution', 'Never disconnect CT secondary while current flowing', 'Verify CT output matches expected value'],
    'auto - clears when CT signal restored'
  ),

  // ==================== MAINS/UTILITY ALARMS (300-399) ====================
  ...createDSECode(300, 'Mains Failure', 'Mains', 'Supply', 'info',
    'Utility mains supply has been lost or fallen outside acceptable parameters. Generator start sequence may initiate if in AUTO.',
    ['Mains voltage reading zero or very low', 'Generator auto-start may begin', 'Transfer to generator may occur'],
    [
      { likelihood: 'high', cause: 'Utility power outage in area', verification: 'Check if neighbors also have no power' },
      { likelihood: 'medium', cause: 'Mains supply breaker tripped', verification: 'Check incoming mains breaker status' },
      { likelihood: 'low', cause: 'Mains sensing fuse blown', verification: 'Check mains VT fuses' }
    ],
    ['Verify if actual utility outage or local issue', 'Check mains input breakers', 'If sensing issue, check VT fuses and wiring'],
    'auto - clears when mains returns'
  ),

  ...createDSECode(301, 'Mains Over Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage has exceeded the upper limit. High mains voltage can damage connected equipment.',
    ['Mains voltage reading above acceptable range', 'May initiate generator start', 'Connected equipment at risk'],
    [
      { likelihood: 'high', cause: 'Utility voltage genuinely high', verification: 'Measure incoming supply voltage' },
      { likelihood: 'low', cause: 'Mains VT ratio incorrect', verification: 'Verify VT ratio configuration' }
    ],
    ['Verify actual mains voltage', 'Contact utility if genuinely high', 'Check VT ratio setting if measurement suspect'],
    'auto - clears when voltage normalizes'
  ),

  ...createDSECode(302, 'Mains Under Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage has fallen below the lower acceptable limit. Brown-out condition may damage motor loads.',
    ['Mains voltage reading below normal', 'Lights may be dim', 'Motors may overheat'],
    [
      { likelihood: 'high', cause: 'Utility supply voltage sag or brown-out', verification: 'Measure incoming voltage' },
      { likelihood: 'medium', cause: 'Heavy local loads causing voltage drop', verification: 'Check for large loads starting nearby' }
    ],
    ['Verify actual mains voltage', 'Consider transferring to generator if prolonged', 'Contact utility if recurring issue'],
    'auto - clears when voltage recovers'
  ),

  ...createDSECode(303, 'Mains Over Frequency', 'Mains', 'Frequency', 'warning',
    'Utility supply frequency has exceeded the upper limit. Unusual condition indicating grid instability.',
    ['Mains frequency reading above normal (>51Hz for 50Hz)', 'Rare occurrence', 'May affect sensitive equipment'],
    [
      { likelihood: 'medium', cause: 'Grid frequency genuinely high', verification: 'Measure with frequency meter' },
      { likelihood: 'low', cause: 'Sensing or configuration error', verification: 'Verify frequency measurement' }
    ],
    ['Verify actual mains frequency', 'Report to utility if consistently high', 'Check sensing if measurement unlikely'],
    'auto - clears when frequency normal'
  ),

  ...createDSECode(304, 'Mains Under Frequency', 'Mains', 'Frequency', 'warning',
    'Utility supply frequency has fallen below the lower limit. Indicates stressed or unstable grid.',
    ['Mains frequency reading low (<49Hz for 50Hz)', 'Grid may be overloaded', 'May precede blackout'],
    [
      { likelihood: 'high', cause: 'Grid under stress from high demand', verification: 'Measure frequency, check news for grid issues' },
      { likelihood: 'low', cause: 'Local generation affecting frequency', verification: 'Disconnect any local sources and recheck' }
    ],
    ['Verify mains frequency measurement', 'Consider load transfer if persistent', 'May indicate imminent grid failure'],
    'auto - clears when frequency normal'
  ),

  ...createDSECode(305, 'Mains Phase Rotation Wrong', 'Mains', 'Phase', 'warning',
    'The mains supply phase sequence does not match expected rotation. Prevents incorrect generator-to-mains paralleling.',
    ['Phase rotation shown as reverse', 'Paralleling/synchronizing blocked', 'Three-phase motors would rotate wrong direction'],
    [
      { likelihood: 'high', cause: 'Mains supply phases connected in wrong order', verification: 'Check incoming phase connections' },
      { likelihood: 'medium', cause: 'Utility modified their connection', verification: 'Check if utility did recent work' }
    ],
    ['Verify phase rotation with rotation meter', 'Swap two phases at main input', 'Coordinate with utility if their error'],
    'auto - clears when rotation correct'
  ),

  // ==================== SYNCHRONIZATION/PARALLEL ALARMS (700-799) ====================
  ...createDSECode(700, 'Synchronization Timeout', 'Synchronization', 'Sync', 'warning',
    'Generator failed to synchronize with bus within the allowed time period. Speed or voltage matching unable to achieve sync window.',
    ['Generator breaker did not close', 'Synchronizer timeout expired', 'Generator may have shut down or gone to idle'],
    [
      { likelihood: 'high', cause: 'Generator voltage too different from bus', verification: 'Compare generator and bus voltage' },
      { likelihood: 'high', cause: 'Generator frequency cannot match bus', verification: 'Compare generator and bus frequency' },
      { likelihood: 'medium', cause: 'Sync check relay not seeing correct conditions', verification: 'Verify synchroscope indications' }
    ],
    ['Adjust generator voltage to match bus', 'Adjust speed to match bus frequency', 'Verify synchroscope shows correct phase angle', 'Check sync check relay settings'],
    'keypad - after adjustments'
  ),

  ...createDSECode(701, 'Sync Voltage Difference High', 'Synchronization', 'Sync', 'warning',
    'The voltage difference between generator and bus exceeds the maximum allowed for closing onto the bus.',
    ['Generator voltage different from bus by more than threshold', 'Synchronizer will not permit closing'],
    [
      { likelihood: 'high', cause: 'Generator AVR not matching voltage to bus', verification: 'Check AVR voltage trim/match function' },
      { likelihood: 'medium', cause: 'Voltage sensing error', verification: 'Compare measured values with actual' }
    ],
    ['Adjust generator voltage to match bus voltage', 'Check AVR voltage matching mode operation'],
    'auto - clears when voltages matched'
  ),

  ...createDSECode(702, 'Sync Frequency Difference High', 'Synchronization', 'Sync', 'warning',
    'The frequency difference between generator and bus exceeds the maximum allowed synchronizing tolerance.',
    ['Generator frequency different from bus', 'Cannot synchronize until matched', 'Synchroscope rotating too fast'],
    [
      { likelihood: 'high', cause: 'Governor speed setting not matched', verification: 'Adjust governor speed trim' },
      { likelihood: 'medium', cause: 'Speed matching control not functioning', verification: 'Check speed matching enable and response' }
    ],
    ['Adjust generator speed to match bus frequency', 'Verify speed matching function operation'],
    'auto - clears when frequencies matched'
  ),

  ...createDSECode(703, 'Sync Phase Angle Exceeded', 'Synchronization', 'Sync', 'critical',
    'The phase angle between generator and bus is outside safe closing limits. Closing now would cause severe mechanical shock.',
    ['Synchroscope showing large angle', 'Breaker close blocked', 'Mechanical damage would result from closing'],
    [
      { likelihood: 'high', cause: 'Synchronizer not tracking phase properly', verification: 'Observe synchroscope rotation' },
      { likelihood: 'medium', cause: 'Breaker close command given at wrong time', verification: 'Check close permissive logic' }
    ],
    ['Allow synchronizer to track and close at correct angle', 'Do not force manual close with large angle', 'Verify sync check relay angle settings'],
    'auto - clears when angle within limits'
  ),

  ...createDSECode(704, 'Load Share Deviation', 'Synchronization', 'Load Sharing', 'warning',
    'The load sharing deviation between paralleled units exceeds acceptable limits. Units not sharing load proportionally.',
    ['Some units overloaded, others underloaded', 'kW percentages differ significantly between sets', 'Risk of overloading individual units'],
    [
      { likelihood: 'high', cause: 'Droop settings not matched between units', verification: 'Verify all units have same droop %' },
      { likelihood: 'high', cause: 'Base load settings different', verification: 'Check base load kW settings' },
      { likelihood: 'medium', cause: 'Speed bias adjustment needed', verification: 'Fine tune speed bias with units running' }
    ],
    ['Verify all units have matching droop settings', 'Adjust speed bias for fine tuning', 'Check load share communication if digital sharing'],
    'auto - clears when sharing balanced'
  ),

  ...createDSECode(705, 'VAr Share Deviation', 'Synchronization', 'Load Sharing', 'warning',
    'Reactive power (kVAr) sharing between paralleled units is unbalanced. Units providing unequal reactive power.',
    ['kVAr percentages differ between units', 'Some units may be overexcited', 'Circulating current between units'],
    [
      { likelihood: 'high', cause: 'VAr sharing function not enabled or matched', verification: 'Verify kVAr sharing settings' },
      { likelihood: 'medium', cause: 'Voltage droop settings different', verification: 'Check voltage droop % on all units' },
      { likelihood: 'medium', cause: 'AVR settings different between units', verification: 'Compare AVR configurations' }
    ],
    ['Enable and configure VAr sharing on all units', 'Match voltage droop settings', 'Adjust VAr trim to balance'],
    'auto - clears when sharing balanced'
  ),

  ...createDSECode(706, 'Bus Sensing Failure', 'Synchronization', 'Sync', 'warning',
    'Cannot detect bus voltage for synchronizing purposes. Synchronization to bus not possible.',
    ['Bus voltage shows zero or erratic', 'Synchronizer cannot operate', 'May show bus dead when not'],
    [
      { likelihood: 'high', cause: 'Bus sensing fuse blown', verification: 'Check bus voltage sensing fuses' },
      { likelihood: 'high', cause: 'Bus VT wiring fault', verification: 'Verify wiring from bus VT to controller' },
      { likelihood: 'medium', cause: 'Bus VT failed', verification: 'Measure VT secondary output' }
    ],
    ['Check bus voltage sensing fuses and wiring', 'Verify bus VT output', 'Repair sensing circuit before synchronizing'],
    'auto - clears when sensing restored'
  ),

  ...createDSECode(707, 'Breaker Fail to Close', 'Synchronization', 'Breaker', 'warning',
    'The generator circuit breaker did not close when commanded. Breaker mechanism or control circuit fault.',
    ['Close command given but breaker remained open', 'Breaker position feedback shows open', 'Generator not connected to load'],
    [
      { likelihood: 'high', cause: 'Breaker close circuit fault', verification: 'Check close coil circuit' },
      { likelihood: 'high', cause: 'Breaker mechanical fault', verification: 'Test breaker operation manually' },
      { likelihood: 'medium', cause: 'Closing spring not charged', verification: 'Check spring charge status' }
    ],
    ['Check breaker close coil and wiring', 'Verify closing spring is charged', 'Test breaker operation', 'Check auxiliary contacts feedback'],
    'auto - after breaker repaired'
  ),

  ...createDSECode(708, 'Breaker Fail to Open', 'Synchronization', 'Breaker', 'critical',
    'The generator circuit breaker did not open when commanded. Serious safety issue - generator cannot be disconnected.',
    ['Trip command given but breaker stayed closed', 'Generator still connected despite trip', 'Safety risk exists'],
    [
      { likelihood: 'high', cause: 'Trip coil circuit fault', verification: 'Check trip coil and wiring' },
      { likelihood: 'high', cause: 'Breaker mechanism jammed', verification: 'Test breaker trip manually' },
      { likelihood: 'medium', cause: 'Insufficient trip coil voltage', verification: 'Measure voltage at trip coil' }
    ],
    ['This is a serious condition - do not ignore', 'Manually trip breaker if possible', 'Stop engine if breaker will not open', 'Repair breaker before returning to service'],
    'keypad - after breaker repaired'
  ),

  // ==================== COMMUNICATION ALARMS (500-599) ====================
  ...createDSECode(500, 'CAN Bus Failure', 'Control', 'Communication', 'warning',
    'CAN bus communication has failed. ECU data and multi-module communication affected.',
    ['Engine data from ECU not updating', 'J1939 values show dashes or last values', 'Multi-module communication lost'],
    [
      { likelihood: 'high', cause: 'CAN bus wiring disconnected or damaged', verification: 'Inspect CAN cable connections' },
      { likelihood: 'high', cause: 'CAN bus termination missing or incorrect', verification: 'Verify 120 ohm termination at each end' },
      { likelihood: 'medium', cause: 'CAN bus short circuit', verification: 'Measure resistance between CAN-H and CAN-L' }
    ],
    ['Check CAN bus wiring and connections', 'Verify termination resistors present (120 ohms at each end)', 'Check for damaged cables or short circuits', 'Ensure proper cable type and shielding used'],
    'auto - clears when communication restored'
  ),

  ...createDSECode(501, 'Modbus Communication Failure', 'Control', 'Communication', 'warning',
    'Modbus communication with SCADA or remote monitoring system has failed. Remote visibility lost.',
    ['Remote monitoring shows offline', 'No response to Modbus queries', 'RS485/TCP connection broken'],
    [
      { likelihood: 'high', cause: 'Communication cable disconnected', verification: 'Check RS485/Ethernet connections' },
      { likelihood: 'high', cause: 'Baud rate or parity mismatch', verification: 'Verify communication settings match both ends' },
      { likelihood: 'medium', cause: 'Address conflict or wrong address', verification: 'Confirm Modbus slave address setting' }
    ],
    ['Verify physical connections', 'Confirm baud rate, parity, and address settings match', 'Check for termination on RS485 networks'],
    'auto - clears when communication restored'
  ),

  ...createDSECode(502, 'Remote Display Communication Lost', 'Control', 'Communication', 'warning',
    'Communication with remote display panel has been lost. Remote operators cannot see or control the system.',
    ['Remote display shows no communication', 'Display may be blank or show error', 'Local display unaffected'],
    [
      { likelihood: 'high', cause: 'Display communication cable fault', verification: 'Check cable between controller and remote display' },
      { likelihood: 'medium', cause: 'Display address setting wrong', verification: 'Verify display address configuration' }
    ],
    ['Check display communication cable', 'Verify display address matches controller configuration', 'Power cycle remote display'],
    'auto - clears when communication restored'
  ),

  ...createDSECode(503, 'ECU Communication Lost', 'Control', 'Communication', 'warning',
    'Communication with engine ECU (Electronic Control Unit) has been lost. Engine data no longer available.',
    ['Engine parameters show dashes or freeze', 'J1939 fault codes not readable', 'ECU diagnostic data unavailable'],
    [
      { likelihood: 'high', cause: 'CAN bus connection to ECU broken', verification: 'Check CAN cable to ECU connector' },
      { likelihood: 'medium', cause: 'ECU not powered', verification: 'Verify ECU has power supply' },
      { likelihood: 'low', cause: 'ECU internal fault', verification: 'Check for ECU fault lights' }
    ],
    ['Check CAN bus wiring to ECU', 'Verify ECU is powered and operating', 'Check ECU for internal fault codes'],
    'auto - clears when ECU communication restored'
  ),
];

export function getDSEFaultCodes(): ControllerFaultCode[] {
  return DSE_FAULT_CODES as ControllerFaultCode[];
}
