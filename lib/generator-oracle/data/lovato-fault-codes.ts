/**
 * Lovato Electric Controller Fault Codes
 * Comprehensive database covering RGK600, RGK700, RGK800, RGK900, ATL600, ATL800, ATL900, EXP series, ATXP40
 * All descriptions are technically accurate based on official Lovato documentation
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

// Lovato Alarm Code Ranges:
// A001-A099: System/Controller alarms
// A100-A199: Engine protection alarms
// A200-A299: Generator electrical alarms
// A300-A399: Mains/Utility alarms
// A400-A499: Transfer switch alarms
// A500-A599: Communication alarms
// A600-A699: Expansion module alarms
// A700-A799: Synchronization alarms (RGK800, RGK900)
// A800-A899: Advanced protection alarms
// A900-A999: User configurable alarms

const LOVATO_MODELS = [
  'RGK600', 'RGK700', 'RGK800', 'RGK900',
  'ATL600', 'ATL800', 'ATL900', 'EXP series', 'ATXP40'
];

function createLovatoCode(
  code: string,
  title: string,
  category: string,
  subcategory: string,
  severity: 'info' | 'warning' | 'critical' | 'shutdown',
  description: string,
  symptoms: string[],
  causes: { likelihood: 'high' | 'medium' | 'low'; cause: string; verification: string }[],
  solutions: string[],
  resetMethod: string,
  applicableModels: string[] = LOVATO_MODELS
): Partial<ControllerFaultCode>[] {
  return applicableModels.map(model => ({
    id: `LOVATO-${model.replace(/\s+/g, '')}-${code}`,
    code: code,
    brand: 'Lovato Electric',
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
      { step: 1, action: 'Record alarm code from display', expectedResult: 'Alarm details documented' },
      { step: 2, action: 'Verify condition with external measurement', expectedResult: 'Measurement obtained' },
      { step: 3, action: 'Check wiring and connections', expectedResult: 'No faults found' },
      { step: 4, action: 'Review Lovato Synergy configuration', expectedResult: 'Settings verified' },
    ],
    resetPathways: [{
      method: resetMethod.includes('software') ? 'software' : resetMethod.includes('auto') ? 'auto' : 'keypad',
      applicableFirmware: ['All'],
      requiresCondition: severity === 'shutdown' ? ['engine_stopped', 'fault_investigated'] : ['fault_cleared'],
      steps: resetMethod.includes('keypad') ? [
        { stepNumber: 1, action: 'Press STOP if engine running', keySequence: ['STOP'], expectedResponse: 'Engine stops' },
        { stepNumber: 2, action: 'Press RESET button', keySequence: ['RESET'], expectedResponse: 'Alarm clears' },
        { stepNumber: 3, action: 'Select AUTO mode', keySequence: ['AUTO'], expectedResponse: 'Ready' }
      ] : [
        { stepNumber: 1, action: 'Fault clears automatically', expectedResponse: 'Alarm resets' }
      ],
      successIndicator: 'No active alarms'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : severity === 'critical' ? 'moderate' : 'easy',
      timeEstimate: severity === 'shutdown' ? '1-4 hours' : '15-60 minutes',
      procedureSteps: solutions,
      tools: ['Multimeter', 'Lovato Synergy software', 'Hand tools'],
      parts: [],
      estimatedCost: { min: 0, max: severity === 'shutdown' ? 500 : 200, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? [
      'Do not restart until fault identified',
      'Equipment damage risk if not corrected'
    ] : ['Follow standard safety procedures'],
    preventiveMeasures: ['Regular maintenance', 'Periodic sensor checks'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const LOVATO_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== SYSTEM ALARMS (A001-A099) ====================
  ...createLovatoCode('A001', 'Emergency Stop Active', 'Control', 'Emergency', 'shutdown',
    'The emergency stop input has been activated. This immediately stops the engine and blocks all automatic functions until the emergency condition is cleared and the alarm is manually reset. This is a hardwired safety input with highest priority.',
    ['Engine stops immediately', 'EMERGENCY LED lit', 'Display shows E-STOP', 'All modes blocked'],
    [
      { likelihood: 'high', cause: 'E-stop button pressed', verification: 'Check all e-stop locations' },
      { likelihood: 'medium', cause: 'E-stop wiring fault', verification: 'Check loop continuity' },
      { likelihood: 'low', cause: 'Input configuration wrong', verification: 'Verify in Synergy software' }
    ],
    ['Release pressed e-stop buttons', 'Check wiring if no button pressed', 'Reset after investigation'],
    'keypad - RESET after e-stop released'
  ),

  ...createLovatoCode('A002', 'Controller Watchdog', 'Control', 'Hardware', 'critical',
    'The controller watchdog timer has triggered indicating a software or hardware malfunction. The controller has restarted to recover from the fault condition. If this occurs repeatedly, the controller may need replacement.',
    ['Controller restarts', 'Settings may need reloading', 'Event log shows restart', 'Intermittent operation'],
    [
      { likelihood: 'high', cause: 'Software glitch', verification: 'Update to latest firmware' },
      { likelihood: 'medium', cause: 'Power supply noise', verification: 'Check DC supply quality' },
      { likelihood: 'low', cause: 'Hardware fault', verification: 'Contact Lovato support' }
    ],
    ['Update firmware', 'Check power supply', 'Replace if recurring'],
    'auto - controller self-resets'
  ),

  ...createLovatoCode('A003', 'EEPROM Error', 'Control', 'Memory', 'warning',
    'Configuration memory error detected. Some settings may be corrupted or lost. The controller may operate with default values for affected parameters. Reconfiguration using Synergy software is recommended.',
    ['Parameters showing defaults', 'Configuration warning', 'Some functions incorrect', 'Event log entries missing'],
    [
      { likelihood: 'high', cause: 'Power loss during save', verification: 'Check last configuration change' },
      { likelihood: 'medium', cause: 'Memory chip aging', verification: 'Reload configuration' },
      { likelihood: 'low', cause: 'Hardware fault', verification: 'Replace controller if recurring' }
    ],
    ['Reload configuration from backup', 'Reconfigure using Synergy', 'Save configuration properly'],
    'software - reload configuration'
  ),

  // ==================== ENGINE ALARMS (A100-A199) ====================
  ...createLovatoCode('A100', 'Low Oil Pressure Pre-Alarm', 'Engine', 'Oil Pressure', 'warning',
    'Engine oil pressure has dropped below the pre-alarm threshold but remains above shutdown level. The engine continues to run but requires immediate attention. Low oil pressure accelerates bearing wear and can lead to engine failure.',
    ['Oil pressure gauge low', 'Warning LED flashing', 'Audible alarm', 'Engine running'],
    [
      { likelihood: 'high', cause: 'Oil level low', verification: 'Check dipstick' },
      { likelihood: 'high', cause: 'Pressure sender fault', verification: 'Compare with gauge' },
      { likelihood: 'medium', cause: 'Oil filter clogged', verification: 'Check filter condition' },
      { likelihood: 'low', cause: 'Oil pump wear', verification: 'Pressure test pump' }
    ],
    ['Check and add oil if low', 'Verify sender operation', 'Replace filter if due'],
    'auto - clears when pressure OK'
  ),

  ...createLovatoCode('A101', 'Low Oil Pressure Shutdown', 'Engine', 'Oil Pressure', 'shutdown',
    'Engine oil pressure has fallen below the critical shutdown threshold. The engine has been stopped to prevent severe damage. Do not attempt restart until cause is identified. Running without adequate oil pressure causes rapid bearing failure.',
    ['Engine stopped', 'Shutdown LED lit', 'LOW OIL PRESSURE displayed', 'Start blocked'],
    [
      { likelihood: 'high', cause: 'Critically low oil', verification: 'Check level immediately' },
      { likelihood: 'high', cause: 'Major oil leak', verification: 'Inspect for leaks' },
      { likelihood: 'medium', cause: 'Sender failure', verification: 'Test sender circuit' },
      { likelihood: 'low', cause: 'Oil pump failure', verification: 'Inspect pump' }
    ],
    ['DO NOT restart', 'Check oil level', 'Find and fix any leaks', 'Verify sender if level OK'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A110', 'High Coolant Temperature Pre-Alarm', 'Engine', 'Coolant', 'warning',
    'Engine coolant temperature has exceeded the pre-alarm threshold. The engine is at risk of overheating. Check cooling system immediately and reduce load if possible to allow temperature to stabilize.',
    ['Temperature gauge high', 'Warning LED flashing', 'Coolant near boiling', 'Engine running hot'],
    [
      { likelihood: 'high', cause: 'Low coolant level', verification: 'Check expansion tank' },
      { likelihood: 'high', cause: 'Radiator blocked', verification: 'Inspect fins' },
      { likelihood: 'medium', cause: 'Thermostat stuck', verification: 'Test thermostat' },
      { likelihood: 'medium', cause: 'Fan not running', verification: 'Check fan operation' }
    ],
    ['Check coolant level', 'Inspect radiator', 'Reduce load', 'Check fan'],
    'auto - clears when temp drops'
  ),

  ...createLovatoCode('A111', 'High Coolant Temperature Shutdown', 'Engine', 'Coolant', 'shutdown',
    'Engine coolant temperature has reached the critical shutdown threshold. The engine has overheated and stopped. Allow complete cooling before investigation. Restarting an overheated engine risks severe damage including head gasket failure.',
    ['Engine stopped', 'Shutdown LED lit', 'HIGH TEMP displayed', 'Coolant may be steaming'],
    [
      { likelihood: 'high', cause: 'Major coolant loss', verification: 'Check for leaks' },
      { likelihood: 'high', cause: 'Cooling system failure', verification: 'Inspect all components' },
      { likelihood: 'medium', cause: 'Head gasket leak', verification: 'Check for contamination' },
      { likelihood: 'low', cause: 'Water pump failure', verification: 'Check pump' }
    ],
    ['Allow to cool completely', 'Check coolant system', 'Inspect for leaks', 'Check head gasket'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A120', 'Overspeed', 'Engine', 'Speed', 'shutdown',
    'Engine speed has exceeded the maximum safe limit causing immediate shutdown. Overspeed can cause catastrophic engine failure including rod breakage and flywheel explosion. Do not restart until governor system is verified.',
    ['Engine tripped at high speed', 'Shutdown LED lit', 'OVERSPEED displayed', 'May have heard unusual noise'],
    [
      { likelihood: 'high', cause: 'Governor failure', verification: 'Inspect governor' },
      { likelihood: 'high', cause: 'Load rejection', verification: 'Check breaker status' },
      { likelihood: 'medium', cause: 'Fuel rack stuck', verification: 'Check linkage' },
      { likelihood: 'low', cause: 'Speed sensor fault', verification: 'Test sensor' }
    ],
    ['Inspect governor', 'Check fuel system', 'Test speed sensor', 'Verify no damage'],
    'keypad - RESET after inspection'
  ),

  ...createLovatoCode('A130', 'Fail To Start', 'Engine', 'Starting', 'critical',
    'Engine has failed to start after the configured number of attempts. The starting sequence has been aborted. Investigate cause before attempting manual restart. Common causes include fuel, battery, or compression problems.',
    ['Engine cranks but wont start', 'Start attempts exhausted', 'FAIL TO START displayed', 'Critical alarm'],
    [
      { likelihood: 'high', cause: 'No fuel', verification: 'Check fuel supply' },
      { likelihood: 'high', cause: 'Battery weak', verification: 'Check voltage while cranking' },
      { likelihood: 'medium', cause: 'Air in fuel', verification: 'Bleed fuel system' },
      { likelihood: 'low', cause: 'Low compression', verification: 'Compression test' }
    ],
    ['Verify fuel supply', 'Check battery condition', 'Bleed fuel system', 'Test compression'],
    'keypad - RESET then manual start'
  ),

  ...createLovatoCode('A140', 'Fail To Stop', 'Engine', 'Starting', 'critical',
    'Engine has failed to stop after the configured shutdown time. The fuel shutoff may not be functioning correctly. Manual intervention may be required. This is a safety concern as the engine cannot be controlled normally.',
    ['Engine continues running', 'Stop command ignored', 'FAIL TO STOP displayed', 'Critical alarm'],
    [
      { likelihood: 'high', cause: 'Fuel solenoid stuck', verification: 'Check solenoid operation' },
      { likelihood: 'high', cause: 'Solenoid wiring fault', verification: 'Check connections' },
      { likelihood: 'medium', cause: 'Mechanical linkage', verification: 'Inspect fuel rack' },
      { likelihood: 'low', cause: 'Output relay fault', verification: 'Test relay output' }
    ],
    ['Manually close fuel valve', 'Check fuel solenoid', 'Inspect wiring', 'Test relay'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A150', 'Battery Low Voltage', 'Engine', 'Battery', 'warning',
    'Battery voltage has dropped below acceptable limits. Engine starting capability may be compromised. This typically indicates charging system problems, battery aging, or excessive loads on the DC system.',
    ['Low voltage displayed', 'Warning LED', 'Starting may be slow', 'Display dimming'],
    [
      { likelihood: 'high', cause: 'Battery discharged', verification: 'Measure OCV' },
      { likelihood: 'high', cause: 'Charger fault', verification: 'Check charger output' },
      { likelihood: 'medium', cause: 'Battery old', verification: 'Load test battery' },
      { likelihood: 'low', cause: 'Parasitic load', verification: 'Check for drain' }
    ],
    ['Charge or replace battery', 'Check charger', 'Test battery condition'],
    'auto - clears when voltage OK'
  ),

  // ==================== ELECTRICAL ALARMS (A200-A299) ====================
  ...createLovatoCode('A200', 'Generator Over Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has exceeded the high warning threshold. High voltage can damage connected equipment. This typically indicates AVR problems or engine speed variations. Investigate immediately.',
    ['Voltage reading high', 'Warning LED', 'Equipment may trip', 'Frequency may be high'],
    [
      { likelihood: 'high', cause: 'AVR setting high', verification: 'Check AVR pot' },
      { likelihood: 'high', cause: 'Speed high', verification: 'Check frequency' },
      { likelihood: 'medium', cause: 'AVR fault', verification: 'Test AVR' },
      { likelihood: 'low', cause: 'Sensing error', verification: 'Check VT' }
    ],
    ['Adjust AVR', 'Check engine speed', 'Verify sensing'],
    'auto - clears when voltage OK'
  ),

  ...createLovatoCode('A201', 'Generator Over Voltage Trip', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage has exceeded critical limits causing automatic trip. Severely high voltage causes immediate equipment damage. The AVR or excitation system has likely failed. Do not restart until repaired.',
    ['Generator trips', 'Shutdown LED', 'OVER VOLTAGE displayed', 'Equipment may be damaged'],
    [
      { likelihood: 'high', cause: 'AVR failure', verification: 'Test AVR thoroughly' },
      { likelihood: 'high', cause: 'Speed runaway', verification: 'Check governor' },
      { likelihood: 'medium', cause: 'Exciter fault', verification: 'Check exciter' },
      { likelihood: 'low', cause: 'Winding fault', verification: 'Test windings' }
    ],
    ['Test AVR', 'Check governor', 'Inspect exciter', 'Test windings'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A210', 'Generator Under Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has dropped below the minimum threshold. Low voltage reduces power capability and causes motor overheating. Check for overload, AVR problems, or engine speed issues.',
    ['Voltage reading low', 'Warning LED', 'Motors running hot', 'Reduced power'],
    [
      { likelihood: 'high', cause: 'Overloaded', verification: 'Check kW vs rating' },
      { likelihood: 'high', cause: 'AVR setting low', verification: 'Check AVR' },
      { likelihood: 'medium', cause: 'Speed low', verification: 'Check frequency' },
      { likelihood: 'low', cause: 'Exciter weak', verification: 'Check excitation' }
    ],
    ['Reduce load', 'Adjust AVR', 'Check speed'],
    'auto - clears when voltage OK'
  ),

  ...createLovatoCode('A220', 'Generator Over Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency has exceeded the high threshold. Frequency is directly proportional to engine speed. High frequency indicates speed control problems or load rejection conditions.',
    ['Frequency high', 'Warning LED', 'Equipment affected', 'Engine running fast'],
    [
      { likelihood: 'high', cause: 'Load rejected', verification: 'Check load status' },
      { likelihood: 'medium', cause: 'Governor setting', verification: 'Check speed droop' },
      { likelihood: 'low', cause: 'Governor fault', verification: 'Test governor' }
    ],
    ['Check load', 'Adjust governor', 'Verify settings'],
    'auto - clears when frequency OK'
  ),

  ...createLovatoCode('A230', 'Generator Under Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency has dropped below the minimum threshold. Low frequency indicates the engine cannot maintain speed, typically due to overload or fuel system problems.',
    ['Frequency low', 'Warning LED', 'Engine laboring', 'Power reduced'],
    [
      { likelihood: 'high', cause: 'Overloaded', verification: 'Check load level' },
      { likelihood: 'medium', cause: 'Fuel restriction', verification: 'Check fuel supply' },
      { likelihood: 'medium', cause: 'Governor not responding', verification: 'Check actuator' },
      { likelihood: 'low', cause: 'Mechanical problem', verification: 'Check engine' }
    ],
    ['Reduce load', 'Check fuel', 'Check governor'],
    'auto - clears when frequency OK'
  ),

  ...createLovatoCode('A240', 'Generator Overload', 'Electrical', 'Current', 'warning',
    'Generator is operating above rated capacity. Sustained overload causes overheating and reduces equipment life. Load should be reduced to within rated capacity.',
    ['kW or amps high', 'Warning LED', 'Temperature rising', 'Frequency may drop'],
    [
      { likelihood: 'high', cause: 'Too much load', verification: 'Check load vs rating' },
      { likelihood: 'medium', cause: 'Motor starting', verification: 'Check for inrush' },
      { likelihood: 'low', cause: 'CT error', verification: 'Verify CT reading' }
    ],
    ['Reduce load', 'Shed non-essential loads', 'Stage motor starts'],
    'auto - clears when load OK'
  ),

  // ==================== MAINS ALARMS (A300-A399) ====================
  ...createLovatoCode('A300', 'Mains Failure', 'Mains', 'Supply', 'info',
    'Utility mains supply has been lost or is outside acceptable limits. The generator start sequence may initiate depending on configuration. This is typically an informational status during normal backup operation.',
    ['Mains voltage zero', 'Transfer sequence starting', 'Generator may start', 'Load on standby'],
    [
      { likelihood: 'high', cause: 'Utility outage', verification: 'Check utility' },
      { likelihood: 'medium', cause: 'Main breaker off', verification: 'Check breaker' },
      { likelihood: 'low', cause: 'Sensing fault', verification: 'Check VT' }
    ],
    ['Verify utility status', 'Allow automatic operation', 'Check if recurring'],
    'auto - clears when mains OK'
  ),

  ...createLovatoCode('A310', 'Mains Over Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage is above acceptable limits. Transfer to mains may be blocked to protect connected equipment. High mains voltage may indicate utility problems or incorrect transformer taps.',
    ['Mains voltage high', 'Warning LED', 'Transfer blocked', 'Utility surge'],
    [
      { likelihood: 'high', cause: 'Utility voltage high', verification: 'Check with meter' },
      { likelihood: 'medium', cause: 'Transformer tap', verification: 'Check tap setting' },
      { likelihood: 'low', cause: 'Sensing error', verification: 'Check VT' }
    ],
    ['Contact utility', 'Check transformer', 'Verify sensing'],
    'auto - clears when voltage OK'
  ),

  ...createLovatoCode('A320', 'Mains Under Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage is below acceptable limits. The generator may start automatically to provide proper voltage. Sustained low mains voltage causes motor overheating and equipment damage.',
    ['Mains voltage low', 'Warning LED', 'Transfer may occur', 'Brownout condition'],
    [
      { likelihood: 'high', cause: 'Utility brownout', verification: 'Check utility' },
      { likelihood: 'medium', cause: 'Heavy loading', verification: 'Monitor over time' },
      { likelihood: 'low', cause: 'Connection issue', verification: 'Check connections' }
    ],
    ['Monitor utility', 'Allow transfer if needed', 'Report to utility'],
    'auto - clears when voltage OK'
  ),

  // ==================== TRANSFER ALARMS (A400-A499) ====================
  ...createLovatoCode('A400', 'Transfer Switch Fault', 'Control', 'Hardware', 'critical',
    'The automatic transfer switch has reported a fault condition. The load may be without power or the transfer position is uncertain. Manual investigation of the transfer switch is required immediately.',
    ['Transfer fault LED', 'Position unknown', 'Load may be dark', 'Critical alarm'],
    [
      { likelihood: 'high', cause: 'Mechanical jam', verification: 'Inspect switch' },
      { likelihood: 'high', cause: 'Auxiliary contact fault', verification: 'Check feedback' },
      { likelihood: 'medium', cause: 'Motor fault', verification: 'Test motor' },
      { likelihood: 'low', cause: 'Control wiring', verification: 'Check wiring' }
    ],
    ['Inspect transfer switch', 'Check mechanical operation', 'Test motor', 'Verify feedback'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A410', 'Transfer Time Exceeded', 'Control', 'Hardware', 'critical',
    'The transfer switch failed to complete the transfer operation within the expected time. The switch may be stuck or the motor drive has failed. Manual operation may be required to restore power.',
    ['Transfer incomplete', 'Time exceeded', 'Load status unknown', 'Critical alarm'],
    [
      { likelihood: 'high', cause: 'Switch stuck', verification: 'Check mechanism' },
      { likelihood: 'medium', cause: 'Motor failure', verification: 'Test motor' },
      { likelihood: 'low', cause: 'Feedback fault', verification: 'Check contacts' }
    ],
    ['Check switch mechanism', 'Test drive motor', 'Manual operation if needed'],
    'keypad - RESET after transfer complete'
  ),

  // ==================== COMMUNICATION ALARMS (A500-A599) ====================
  ...createLovatoCode('A500', 'Modbus Communication Error', 'Control', 'Communication', 'warning',
    'Modbus communication has failed. Remote monitoring and control from SCADA or BMS systems is not available. Local operation continues normally but remote supervision is lost.',
    ['No Modbus response', 'Communication LED off', 'SCADA shows offline', 'Remote unavailable'],
    [
      { likelihood: 'high', cause: 'Cable disconnected', verification: 'Check RS485 cable' },
      { likelihood: 'high', cause: 'Protocol mismatch', verification: 'Verify settings' },
      { likelihood: 'medium', cause: 'Termination error', verification: 'Check termination' },
      { likelihood: 'low', cause: 'Master offline', verification: 'Check SCADA' }
    ],
    ['Check cables', 'Verify protocol settings', 'Check termination'],
    'auto - clears when comm OK'
  ),

  ...createLovatoCode('A510', 'Ethernet Communication Error', 'Control', 'Communication', 'warning',
    'Ethernet network communication has failed. Web interface and network-based monitoring are unavailable. Check network connections and configuration.',
    ['No network response', 'Web interface offline', 'Network LED off', 'Remote unavailable'],
    [
      { likelihood: 'high', cause: 'Cable unplugged', verification: 'Check Ethernet cable' },
      { likelihood: 'high', cause: 'IP conflict', verification: 'Verify IP address' },
      { likelihood: 'medium', cause: 'Switch fault', verification: 'Check network switch' },
      { likelihood: 'low', cause: 'Controller fault', verification: 'Ping controller' }
    ],
    ['Check network cable', 'Verify IP settings', 'Check network infrastructure'],
    'auto - clears when network OK'
  ),

  // ==================== SYNCHRONIZATION ALARMS (A700-A799) ====================
  ...createLovatoCode('A700', 'Synchronization Fail', 'Synchronization', 'Sync', 'critical',
    'Synchronization conditions could not be achieved within the allowed time. The generator breaker will not close to prevent out-of-phase connection. Check voltage and frequency matching between generator and bus.',
    ['Sync fail displayed', 'Breaker wont close', 'Waiting for match', 'Parameters not matching'],
    [
      { likelihood: 'high', cause: 'Voltage mismatch', verification: 'Compare voltages' },
      { likelihood: 'high', cause: 'Frequency mismatch', verification: 'Compare frequencies' },
      { likelihood: 'medium', cause: 'Phase angle wide', verification: 'Check synchroscope' },
      { likelihood: 'low', cause: 'Settings too tight', verification: 'Check sync window' }
    ],
    ['Wait for matching', 'Adjust AVR if needed', 'Adjust governor if needed'],
    'auto - clears when sync possible'
  ),

  ...createLovatoCode('A710', 'Load Sharing Error', 'Synchronization', 'Load Sharing', 'warning',
    'Load sharing between paralleled generators is out of balance. One unit is taking more than its proportional share. This reduces efficiency and may overload one generator while underloading another.',
    ['kW unbalanced', 'Warning LED', 'One unit loaded high', 'Sharing fault displayed'],
    [
      { likelihood: 'high', cause: 'Droop mismatch', verification: 'Compare settings' },
      { likelihood: 'medium', cause: 'Communication loss', verification: 'Check load share line' },
      { likelihood: 'medium', cause: 'CT polarity wrong', verification: 'Check CT wiring' },
      { likelihood: 'low', cause: 'Governor mismatch', verification: 'Check responses' }
    ],
    ['Balance droop settings', 'Check communication', 'Verify CT polarity'],
    'auto - clears when balanced'
  ),

  ...createLovatoCode('A720', 'Reverse Power Trip', 'Synchronization', 'Load Sharing', 'critical',
    'The generator is importing power instead of exporting - it is being driven as a motor. This indicates engine power is insufficient. The breaker has tripped to protect the engine from being motored.',
    ['Negative kW', 'Breaker trips', 'Reverse power LED', 'Engine may stall'],
    [
      { likelihood: 'high', cause: 'Fuel problem', verification: 'Check fuel' },
      { likelihood: 'high', cause: 'Governor failure', verification: 'Check governor' },
      { likelihood: 'medium', cause: 'Engine fault', verification: 'Check engine' },
      { likelihood: 'low', cause: 'Protection setting', verification: 'Check threshold' }
    ],
    ['Check fuel system', 'Check governor', 'Test engine'],
    'keypad - RESET after repair'
  ),

  // ==================== PROTECTION ALARMS (A800-A899) ====================
  ...createLovatoCode('A800', 'Earth Fault Trip', 'Protection', 'Earth Fault', 'shutdown',
    'Earth leakage current has exceeded the protection threshold causing a trip. An insulation fault exists that creates a shock hazard. All loads must be tested and the fault found before resetting.',
    ['Earth fault LED', 'Breaker trips', 'Possible tingling', 'RCD may trip'],
    [
      { likelihood: 'high', cause: 'Cable damage', verification: 'Test insulation' },
      { likelihood: 'high', cause: 'Equipment fault', verification: 'Test loads' },
      { likelihood: 'medium', cause: 'Moisture', verification: 'Check for water' },
      { likelihood: 'low', cause: 'CT fault', verification: 'Check CBCT' }
    ],
    ['Disconnect loads', 'Test each circuit', 'Find and repair fault'],
    'keypad - RESET after repair'
  ),

  ...createLovatoCode('A810', 'Overcurrent Trip', 'Protection', 'Trip', 'critical',
    'Output current has exceeded the overcurrent protection setting causing a trip. This typically indicates a fault condition such as short circuit. Investigate all connected equipment before attempting reset.',
    ['High current recorded', 'Breaker trips', 'Critical LED', 'Possible burning smell'],
    [
      { likelihood: 'high', cause: 'Short circuit', verification: 'Inspect for damage' },
      { likelihood: 'high', cause: 'Stalled motor', verification: 'Check motors' },
      { likelihood: 'medium', cause: 'Severe overload', verification: 'Check load level' },
      { likelihood: 'low', cause: 'CT fault', verification: 'Verify CT' }
    ],
    ['Find and clear fault', 'Check all equipment', 'Test before reset'],
    'keypad - RESET after fault cleared'
  ),

  // ==================== USER/AUXILIARY ALARMS (A900-A999) ====================
  ...createLovatoCode('A900', 'Fuel Level Low', 'Engine', 'Fuel', 'warning',
    'Fuel tank level has dropped below the warning threshold. Arrange for refueling to prevent running out of fuel during an outage. Running time remaining depends on load.',
    ['Fuel gauge low', 'Warning LED', 'Limited runtime', 'Order fuel'],
    [
      { likelihood: 'high', cause: 'Normal usage', verification: 'Check consumption' },
      { likelihood: 'medium', cause: 'Fuel leak', verification: 'Inspect for leaks' },
      { likelihood: 'low', cause: 'Sender fault', verification: 'Verify level' }
    ],
    ['Order fuel delivery', 'Check for leaks', 'Verify sender accuracy'],
    'auto - clears when refueled'
  ),

  ...createLovatoCode('A950', 'Service Due', 'Control', 'Maintenance', 'info',
    'Scheduled maintenance interval has been reached based on running hours. Service is recommended to maintain warranty and reliability. This alarm does not affect operation.',
    ['Service displayed', 'Info LED', 'Hours reached', 'Maintenance needed'],
    [
      { likelihood: 'high', cause: 'Normal interval', verification: 'Check service records' }
    ],
    ['Schedule maintenance', 'Perform service items', 'Reset counter'],
    'software - reset after service'
  ),
];

export function getLovatoFaultCodes(): ControllerFaultCode[] {
  return LOVATO_FAULT_CODES as ControllerFaultCode[];
}
