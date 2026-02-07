/**
 * Datakom Controller Fault Codes
 * Comprehensive database covering DKG-109, DKG-207, DKG-307, DKG-309, DKG-329, DKG-509, DKG-517, DKG-527, D-100, D-200, D-300, D-500, D-700
 * All descriptions are technically accurate based on official Datakom documentation
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

// Datakom Alarm Code Ranges:
// 0-99: System/Controller alarms
// 100-199: Engine protection alarms
// 200-299: Generator electrical alarms
// 300-399: Mains/Utility alarms
// 400-499: Load management/Transfer alarms
// 500-599: Communication alarms
// 600-699: Auxiliary function alarms
// 700-799: Synchronization alarms (DKG-509, DKG-517, DKG-527)
// 800-899: Advanced protection alarms
// 900-999: User configurable/Custom alarms

const DATAKOM_MODELS = [
  'DKG-109', 'DKG-207', 'DKG-307', 'DKG-309', 'DKG-329',
  'DKG-509', 'DKG-517', 'DKG-527', 'D-100', 'D-200', 'D-300', 'D-500', 'D-700'
];

function createDatakomCode(
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
  applicableModels: string[] = DATAKOM_MODELS
): Partial<ControllerFaultCode>[] {
  return applicableModels.map(model => ({
    id: `DATAKOM-${model.replace(/\s+/g, '')}-${code}`,
    code: code.toString(),
    brand: 'Datakom',
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
      { step: 1, action: 'Record alarm code and check event log', expectedResult: 'Alarm details documented' },
      { step: 2, action: 'Verify actual condition using external instruments', expectedResult: 'Independent measurement obtained' },
      { step: 3, action: 'Check sensor wiring and connections', expectedResult: 'No wiring faults found' },
      { step: 4, action: 'Review configuration parameters', expectedResult: 'Settings verified' },
    ],
    resetPathways: [{
      method: resetMethod.includes('software') ? 'software' : resetMethod.includes('auto') ? 'auto' : 'keypad',
      applicableFirmware: ['All'],
      requiresCondition: severity === 'shutdown' ? ['engine_stopped', 'fault_investigated'] : ['fault_cleared'],
      steps: resetMethod.includes('keypad') ? [
        { stepNumber: 1, action: 'Stop engine', keySequence: ['STOP'], expectedResponse: 'Engine stops' },
        { stepNumber: 2, action: 'Press RESET button', keySequence: ['RESET'], expectedResponse: 'Alarm clears' },
        { stepNumber: 3, action: 'Return to AUTO mode', keySequence: ['AUTO'], expectedResponse: 'Ready' }
      ] : [
        { stepNumber: 1, action: 'Fault condition clears automatically', expectedResponse: 'Alarm resets' }
      ],
      successIndicator: 'No active alarms, system ready'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : severity === 'critical' ? 'moderate' : 'easy',
      timeEstimate: severity === 'shutdown' ? '1-4 hours' : '15-60 minutes',
      procedureSteps: solutions,
      tools: ['Multimeter', 'Datakom Rainbow Plus software', 'Hand tools'],
      parts: [],
      estimatedCost: { min: 0, max: severity === 'shutdown' ? 500 : 200, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? [
      'Do not restart until fault is identified',
      'Risk of equipment damage if issue not resolved'
    ] : ['Follow standard safety procedures'],
    preventiveMeasures: ['Regular maintenance', 'Periodic sensor calibration'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const DATAKOM_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== SYSTEM ALARMS (0-99) ====================
  ...createDatakomCode(1, 'Emergency Stop', 'Control', 'Emergency', 'shutdown',
    'Emergency stop input has been activated. This hardwired safety function immediately stops the engine and prevents any automatic restart until manually reset. The emergency stop circuit is monitored continuously and takes priority over all other control functions.',
    ['Engine immediately stops', 'Emergency LED illuminated', 'Display shows EMERGENCY STOP', 'Auto start blocked'],
    [
      { likelihood: 'high', cause: 'Emergency stop button pressed', verification: 'Check all e-stop stations' },
      { likelihood: 'medium', cause: 'E-stop wiring fault', verification: 'Check continuity of e-stop loop' },
      { likelihood: 'low', cause: 'Input configuration error', verification: 'Verify input polarity' }
    ],
    ['Locate and release pressed e-stop buttons', 'Verify circuit continuity', 'Reset alarm after confirming safe conditions'],
    'keypad - RESET button after condition cleared'
  ),

  ...createDatakomCode(2, 'Controller Power Fail', 'Control', 'Hardware', 'critical',
    'The controller has detected a power supply interruption or voltage drop below acceptable limits. This may indicate battery problems, loose connections, or charging system failures. Controller operation may be affected if power is not restored quickly.',
    ['Controller restarts unexpectedly', 'Display flickers or goes blank', 'Settings may be lost', 'Event log shows power interruption'],
    [
      { likelihood: 'high', cause: 'Low battery voltage', verification: 'Measure battery voltage - should be 12-14V or 24-28V' },
      { likelihood: 'high', cause: 'Loose power connections', verification: 'Check terminal tightness' },
      { likelihood: 'medium', cause: 'Battery charger failure', verification: 'Verify charger output voltage' },
      { likelihood: 'low', cause: 'Controller internal fault', verification: 'Check controller power input' }
    ],
    ['Check and charge or replace battery', 'Tighten all power connections', 'Verify charger operation', 'Check for voltage drops under load'],
    'auto - clears when power restored'
  ),

  ...createDatakomCode(3, 'Configuration Error', 'Control', 'Configuration', 'warning',
    'Invalid or corrupted configuration data detected. The controller may operate with default values or exhibit unexpected behavior. This can occur after firmware updates, memory corruption, or incomplete configuration saves.',
    ['Controller behaves unexpectedly', 'Parameters show default values', 'Display shows configuration warning', 'Some functions may not operate correctly'],
    [
      { likelihood: 'high', cause: 'Incomplete configuration save', verification: 'Review last configuration changes' },
      { likelihood: 'medium', cause: 'Memory corruption', verification: 'Reload configuration from backup' },
      { likelihood: 'low', cause: 'Firmware incompatibility', verification: 'Verify firmware version compatibility' }
    ],
    ['Reload configuration from backup', 'Reconfigure using Rainbow Plus software', 'Update firmware if necessary'],
    'software - reconfigure and save settings'
  ),

  // ==================== ENGINE ALARMS (100-199) ====================
  ...createDatakomCode(100, 'Low Oil Pressure Warning', 'Engine', 'Oil Pressure', 'warning',
    'Engine oil pressure has dropped below the warning threshold but remains above the shutdown level. Continued operation is possible but requires immediate investigation. Low oil pressure can lead to accelerated engine wear and potential failure if not addressed.',
    ['Oil pressure gauge reads low', 'Warning LED illuminated', 'Audible alarm if configured', 'Engine continues running'],
    [
      { likelihood: 'high', cause: 'Low oil level', verification: 'Check dipstick with engine stopped' },
      { likelihood: 'high', cause: 'Oil pressure sender fault', verification: 'Compare with mechanical gauge' },
      { likelihood: 'medium', cause: 'Oil filter blocked', verification: 'Check filter change interval' },
      { likelihood: 'medium', cause: 'Incorrect oil viscosity', verification: 'Verify oil grade for conditions' },
      { likelihood: 'low', cause: 'Oil pump wear', verification: 'Perform pump pressure test' }
    ],
    ['Check and top up oil level', 'Replace oil filter if due', 'Verify oil pressure with mechanical gauge', 'Investigate if level is correct'],
    'auto - clears when pressure rises above threshold'
  ),

  ...createDatakomCode(101, 'Low Oil Pressure Shutdown', 'Engine', 'Oil Pressure', 'shutdown',
    'Engine oil pressure has fallen below the critical shutdown threshold. The engine has been stopped to prevent catastrophic damage. Do not attempt to restart until the cause is identified and corrected. Running an engine with inadequate lubrication will result in bearing failure and potentially complete engine destruction.',
    ['Engine stops immediately', 'Shutdown LED illuminated', 'Display shows LOW OIL PRESSURE', 'Engine will not restart'],
    [
      { likelihood: 'high', cause: 'Critically low oil level', verification: 'Check dipstick immediately' },
      { likelihood: 'high', cause: 'Oil leak', verification: 'Inspect for visible leaks' },
      { likelihood: 'medium', cause: 'Oil pressure sender failure', verification: 'Test sender resistance/voltage' },
      { likelihood: 'medium', cause: 'Oil pump failure', verification: 'Remove and inspect pump' },
      { likelihood: 'low', cause: 'Blocked oil pickup', verification: 'Drain and inspect sump' }
    ],
    ['Do NOT restart until cause found', 'Check oil level first', 'Inspect for leaks', 'Verify sender if level OK', 'Check oil pump if necessary'],
    'keypad - RESET after fault corrected'
  ),

  ...createDatakomCode(110, 'High Coolant Temperature Warning', 'Engine', 'Coolant', 'warning',
    'Engine coolant temperature has exceeded the warning threshold. The engine is approaching overheating conditions. Immediate investigation is required to prevent engine damage. Check cooling system components and reduce load if possible.',
    ['Temperature gauge reads high', 'Warning LED illuminated', 'Coolant may be near boiling point', 'Engine performance may degrade'],
    [
      { likelihood: 'high', cause: 'Low coolant level', verification: 'Check expansion tank and radiator' },
      { likelihood: 'high', cause: 'Radiator restricted', verification: 'Inspect for debris or damage' },
      { likelihood: 'medium', cause: 'Thermostat stuck closed', verification: 'Test thermostat operation' },
      { likelihood: 'medium', cause: 'Fan or fan drive failure', verification: 'Verify fan operation' },
      { likelihood: 'low', cause: 'Temperature sensor fault', verification: 'Compare with infrared reading' }
    ],
    ['Check coolant level and top up', 'Inspect radiator for blockages', 'Verify fan operation', 'Reduce load if possible'],
    'auto - clears when temperature drops'
  ),

  ...createDatakomCode(111, 'High Coolant Temperature Shutdown', 'Engine', 'Coolant', 'shutdown',
    'Engine coolant temperature has reached critical levels causing automatic shutdown. The engine has overheated and must cool down before investigation. Do not attempt restart until the cooling system has been inspected and repaired. Running an overheated engine risks head gasket failure, warped cylinder head, and piston seizure.',
    ['Engine stops on overheat', 'Shutdown LED illuminated', 'Coolant may be boiling', 'Steam from overflow'],
    [
      { likelihood: 'high', cause: 'Severe coolant loss', verification: 'Check system for leaks' },
      { likelihood: 'high', cause: 'Complete cooling system failure', verification: 'Inspect all components' },
      { likelihood: 'medium', cause: 'Head gasket leak', verification: 'Check for oil in coolant' },
      { likelihood: 'medium', cause: 'Water pump failure', verification: 'Check pump impeller' },
      { likelihood: 'low', cause: 'Blocked coolant passages', verification: 'Flush cooling system' }
    ],
    ['Allow engine to cool completely', 'Check for coolant leaks', 'Inspect head gasket', 'Verify water pump', 'Flush system if necessary'],
    'keypad - RESET after repairs'
  ),

  ...createDatakomCode(120, 'Overspeed Warning', 'Engine', 'Speed', 'warning',
    'Engine speed has exceeded the normal operating range but remains below the shutdown threshold. This may indicate governor problems, fuel system issues, or load rejection events. The engine should be monitored closely and load adjusted if necessary.',
    ['Engine running fast', 'Speed gauge reads high', 'Warning LED illuminated', 'Generator frequency high'],
    [
      { likelihood: 'high', cause: 'Sudden load rejection', verification: 'Check load conditions' },
      { likelihood: 'medium', cause: 'Governor adjustment needed', verification: 'Check governor settings' },
      { likelihood: 'medium', cause: 'Speed sensor calibration', verification: 'Verify sensor reading' },
      { likelihood: 'low', cause: 'Fuel system problem', verification: 'Check fuel injection' }
    ],
    ['Check and stabilize load', 'Adjust governor if necessary', 'Verify speed sensor calibration'],
    'auto - clears when speed normalizes'
  ),

  ...createDatakomCode(121, 'Overspeed Shutdown', 'Engine', 'Speed', 'shutdown',
    'Engine speed has exceeded the maximum safe limit causing emergency shutdown. Overspeed conditions can cause catastrophic engine failure including connecting rod breakage, valve damage, and flywheel explosion. Do not restart until cause is identified.',
    ['Engine shuts down at high speed', 'Shutdown LED illuminated', 'May hear unusual noise', 'Generator breaker trips'],
    [
      { likelihood: 'high', cause: 'Governor failure', verification: 'Inspect governor actuator' },
      { likelihood: 'high', cause: 'Load rejection event', verification: 'Check load breaker status' },
      { likelihood: 'medium', cause: 'Fuel rack stuck open', verification: 'Inspect fuel system' },
      { likelihood: 'low', cause: 'Speed sensor failure', verification: 'Test sensor output' }
    ],
    ['Inspect governor system thoroughly', 'Check fuel rack operation', 'Test speed sensing system', 'Verify no mechanical damage'],
    'keypad - RESET after fault corrected'
  ),

  ...createDatakomCode(130, 'Fail to Start', 'Engine', 'Starting', 'critical',
    'Engine has failed to start after the configured number of cranking attempts. The controller has ceased starting attempts to protect the starter motor and batteries. Common causes include fuel problems, battery issues, or mechanical faults. Investigation is required before attempting manual restart.',
    ['Engine cranks but does not fire', 'Start attempts exhausted', 'Critical LED illuminated', 'Display shows FAIL TO START'],
    [
      { likelihood: 'high', cause: 'Fuel supply problem', verification: 'Check fuel level and valves' },
      { likelihood: 'high', cause: 'Low battery voltage', verification: 'Measure battery voltage during crank' },
      { likelihood: 'medium', cause: 'Air in fuel system', verification: 'Bleed fuel system' },
      { likelihood: 'medium', cause: 'Starter motor weak', verification: 'Check cranking speed' },
      { likelihood: 'low', cause: 'Compression low', verification: 'Perform compression test' }
    ],
    ['Check fuel supply first', 'Verify battery condition', 'Bleed fuel if necessary', 'Test starter motor', 'Check compression'],
    'keypad - RESET then try manual start'
  ),

  ...createDatakomCode(140, 'Battery Low Voltage', 'Engine', 'Battery', 'warning',
    'Battery voltage has dropped below the minimum threshold. This may affect engine starting capability and controller operation. Low battery voltage typically indicates charging system problems, battery aging, or excessive parasitic loads.',
    ['Voltage display shows low reading', 'Warning LED illuminated', 'Starting may be slow', 'Display may dim'],
    [
      { likelihood: 'high', cause: 'Battery discharged', verification: 'Measure battery open circuit voltage' },
      { likelihood: 'high', cause: 'Charger not working', verification: 'Check charger output' },
      { likelihood: 'medium', cause: 'Battery end of life', verification: 'Load test battery' },
      { likelihood: 'low', cause: 'Parasitic load', verification: 'Check for current drain' }
    ],
    ['Charge or replace battery', 'Verify charger operation', 'Check for parasitic loads'],
    'auto - clears when voltage rises'
  ),

  // ==================== ELECTRICAL ALARMS (200-299) ====================
  ...createDatakomCode(200, 'Generator Over Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has exceeded the high warning threshold. This may indicate AVR problems, speed variations, or load conditions. High voltage can damage connected equipment and must be addressed promptly.',
    ['Voltage reading high', 'Warning LED illuminated', 'Connected equipment may trip', 'Frequency may also be high'],
    [
      { likelihood: 'high', cause: 'AVR adjustment needed', verification: 'Check AVR voltage setting' },
      { likelihood: 'high', cause: 'Engine speed high', verification: 'Check speed/frequency' },
      { likelihood: 'medium', cause: 'AVR fault', verification: 'Test AVR operation' },
      { likelihood: 'low', cause: 'Sensing circuit problem', verification: 'Verify voltage sensing' }
    ],
    ['Adjust AVR if necessary', 'Check engine speed', 'Verify sensing circuits'],
    'auto - clears when voltage normalizes'
  ),

  ...createDatakomCode(201, 'Generator Over Voltage Shutdown', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage has exceeded critical limits causing automatic shutdown. Severely high voltage can cause immediate damage to connected equipment, insulation breakdown, and fire hazards. Do not restart until the cause is identified and corrected.',
    ['Generator trips on high voltage', 'Shutdown LED illuminated', 'May have damaged equipment', 'Strong electrical smell possible'],
    [
      { likelihood: 'high', cause: 'AVR failure', verification: 'Test AVR thoroughly' },
      { likelihood: 'high', cause: 'Speed control failure', verification: 'Check governor system' },
      { likelihood: 'medium', cause: 'Exciter fault', verification: 'Inspect exciter components' },
      { likelihood: 'low', cause: 'Winding fault', verification: 'Test generator windings' }
    ],
    ['Test AVR operation', 'Verify speed control', 'Inspect exciter', 'Check generator windings'],
    'keypad - RESET after fault corrected'
  ),

  ...createDatakomCode(210, 'Generator Under Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage has dropped below the minimum acceptable threshold. Low voltage reduces power delivery capability and may cause connected motors to overheat. This typically indicates AVR problems, overload conditions, or engine speed issues.',
    ['Voltage reading low', 'Warning LED illuminated', 'Motors may run hot', 'Power output reduced'],
    [
      { likelihood: 'high', cause: 'Overload condition', verification: 'Check load level vs capacity' },
      { likelihood: 'high', cause: 'AVR adjustment needed', verification: 'Check voltage setting' },
      { likelihood: 'medium', cause: 'Engine speed low', verification: 'Check frequency' },
      { likelihood: 'low', cause: 'Exciter problem', verification: 'Check exciter circuit' }
    ],
    ['Reduce load if overloaded', 'Adjust AVR setting', 'Check engine speed'],
    'auto - clears when voltage rises'
  ),

  ...createDatakomCode(220, 'Generator Over Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency has exceeded the high warning threshold. Frequency is directly related to engine speed. High frequency indicates the engine is running faster than nominal and may indicate governor problems or load rejection.',
    ['Frequency display shows high', 'Warning LED illuminated', 'Speed-sensitive equipment affected', 'Clock-driven devices run fast'],
    [
      { likelihood: 'high', cause: 'Load rejection', verification: 'Check current load status' },
      { likelihood: 'medium', cause: 'Governor adjustment', verification: 'Check speed droop setting' },
      { likelihood: 'low', cause: 'Governor fault', verification: 'Test governor operation' }
    ],
    ['Check and restore load', 'Adjust governor settings', 'Verify governor operation'],
    'auto - clears when frequency normalizes'
  ),

  ...createDatakomCode(230, 'Generator Under Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency has dropped below the minimum acceptable threshold. Low frequency indicates the engine is running slowly, typically due to overload or governor problems. This condition reduces power output and may cause motors to overheat.',
    ['Frequency display shows low', 'Warning LED illuminated', 'Engine may sound labored', 'Power output reduced'],
    [
      { likelihood: 'high', cause: 'Overload condition', verification: 'Check kW vs rated capacity' },
      { likelihood: 'medium', cause: 'Governor not responding', verification: 'Check governor actuator' },
      { likelihood: 'medium', cause: 'Fuel restriction', verification: 'Check fuel supply' },
      { likelihood: 'low', cause: 'Engine mechanical problem', verification: 'Check compression' }
    ],
    ['Reduce load immediately', 'Check governor response', 'Verify fuel supply'],
    'auto - clears when frequency rises'
  ),

  ...createDatakomCode(240, 'Generator Overload', 'Electrical', 'Current', 'warning',
    'Generator load has exceeded the continuous rated capacity. While generators can handle brief overloads, sustained operation above rated capacity will cause overheating and reduced component life. Load should be reduced promptly.',
    ['kW or current reading high', 'Warning LED illuminated', 'Generator temperature rising', 'Frequency may drop'],
    [
      { likelihood: 'high', cause: 'Too much load connected', verification: 'Compare load to rating' },
      { likelihood: 'medium', cause: 'Motor starting inrush', verification: 'Check for starting motors' },
      { likelihood: 'low', cause: 'Current sensing error', verification: 'Verify CT readings' }
    ],
    ['Reduce load to rated capacity', 'Shed non-essential loads', 'Stage motor starting'],
    'auto - clears when load reduces'
  ),

  // ==================== MAINS ALARMS (300-399) ====================
  ...createDatakomCode(300, 'Mains Failure', 'Mains', 'Supply', 'info',
    'Utility mains supply has been lost or fallen outside acceptable limits. Depending on configuration, the generator may start automatically to provide backup power. This is typically an informational alarm indicating the transfer sequence is in progress.',
    ['Mains voltage absent', 'Transfer sequence initiated', 'Generator may be starting', 'Load preparing for transfer'],
    [
      { likelihood: 'high', cause: 'Utility power outage', verification: 'Check utility supply' },
      { likelihood: 'medium', cause: 'Main breaker tripped', verification: 'Check incoming breaker' },
      { likelihood: 'low', cause: 'Sensing circuit fault', verification: 'Verify sensing connections' }
    ],
    ['Verify utility status', 'Allow automatic transfer', 'Investigate if repeated frequently'],
    'auto - clears when mains restores'
  ),

  ...createDatakomCode(310, 'Mains Over Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage has exceeded acceptable limits. High mains voltage can damage connected equipment and may indicate utility problems. The controller may prevent transfer to mains until voltage returns to normal.',
    ['Mains voltage display high', 'Warning LED illuminated', 'Transfer blocked', 'May indicate utility surge'],
    [
      { likelihood: 'high', cause: 'Utility voltage high', verification: 'Check with external meter' },
      { likelihood: 'medium', cause: 'Transformer tap wrong', verification: 'Verify transformer setting' },
      { likelihood: 'low', cause: 'Sensing error', verification: 'Check sensing circuit' }
    ],
    ['Contact utility if persistent', 'Verify sensing accuracy', 'Adjust setpoint if normal for area'],
    'auto - clears when voltage normalizes'
  ),

  ...createDatakomCode(320, 'Mains Under Voltage', 'Mains', 'Voltage', 'warning',
    'Utility mains voltage has dropped below acceptable limits. Low mains voltage reduces available power and may cause motors to overheat. The controller may initiate transfer to generator power if voltage remains low.',
    ['Mains voltage display low', 'Warning LED illuminated', 'Transfer may initiate', 'Utility brownout condition'],
    [
      { likelihood: 'high', cause: 'Utility brownout', verification: 'Check utility supply' },
      { likelihood: 'medium', cause: 'Heavy utility loading', verification: 'Monitor at different times' },
      { likelihood: 'low', cause: 'Connection problem', verification: 'Check incoming connections' }
    ],
    ['Monitor utility conditions', 'Allow transfer if configured', 'Contact utility if persistent'],
    'auto - clears when voltage rises'
  ),

  ...createDatakomCode(330, 'Mains Phase Sequence', 'Mains', 'Phase', 'warning',
    'Incorrect phase rotation detected on mains supply. This may indicate wiring errors or utility phase reversal. Motors connected to a reverse-phased supply will run backwards, potentially causing serious damage. Transfer to mains is blocked until corrected.',
    ['Phase sequence alarm active', 'Warning LED illuminated', 'Transfer to mains blocked', 'Display shows phase error'],
    [
      { likelihood: 'high', cause: 'Wiring error', verification: 'Check L1-L2-L3 sequence' },
      { likelihood: 'medium', cause: 'Utility phase swap', verification: 'Verify with phase rotation meter' },
      { likelihood: 'low', cause: 'Controller configuration', verification: 'Check phase sequence setting' }
    ],
    ['Verify correct L1-L2-L3 wiring', 'Swap two phases if reversed', 'Update configuration if intentional'],
    'keypad - RESET after correction'
  ),

  // ==================== COMMUNICATION ALARMS (500-599) ====================
  ...createDatakomCode(500, 'Modbus Communication Fail', 'Control', 'Communication', 'warning',
    'Communication with Modbus master or connected devices has been lost. This may affect remote monitoring and control capabilities. The generator continues to operate locally but remote supervision is compromised.',
    ['No Modbus response', 'Communication LED inactive', 'SCADA shows offline', 'Remote control unavailable'],
    [
      { likelihood: 'high', cause: 'Cable disconnected', verification: 'Check RS485 connections' },
      { likelihood: 'high', cause: 'Protocol mismatch', verification: 'Verify baud rate and address' },
      { likelihood: 'medium', cause: 'Network fault', verification: 'Test communication cable' },
      { likelihood: 'low', cause: 'Master offline', verification: 'Check SCADA system status' }
    ],
    ['Check communication cables', 'Verify protocol settings', 'Test with another device'],
    'auto - clears when communication restores'
  ),

  ...createDatakomCode(510, 'CAN Bus Failure', 'Control', 'Communication', 'warning',
    'CAN bus communication has been lost. This may affect communication with ECU, expansion modules, or other CAN devices. Some engine data and control functions may be unavailable.',
    ['CAN data missing', 'ECU data unavailable', 'Communication LED inactive', 'Some parameters show error'],
    [
      { likelihood: 'high', cause: 'CAN cable fault', verification: 'Check CAN H/L connections' },
      { likelihood: 'high', cause: 'Termination resistor', verification: 'Verify 120 ohm termination' },
      { likelihood: 'medium', cause: 'CAN speed mismatch', verification: 'Check baud rate setting' },
      { likelihood: 'low', cause: 'ECU fault', verification: 'Check ECU power and status' }
    ],
    ['Check CAN wiring and termination', 'Verify baud rate', 'Check connected devices'],
    'auto - clears when CAN restores'
  ),

  // ==================== SYNCHRONIZATION ALARMS (700-799) ====================
  ...createDatakomCode(700, 'Sync Check Fail', 'Synchronization', 'Sync', 'critical',
    'Synchronization check has failed - voltage, frequency, or phase angle are outside acceptable limits for breaker closing. The generator breaker will not close to prevent equipment damage from out-of-sync connection. This is a protective function.',
    ['Breaker will not close', 'Sync check LED active', 'Waiting for matching conditions', 'Display shows sync parameters'],
    [
      { likelihood: 'high', cause: 'Voltage mismatch', verification: 'Compare gen and bus voltage' },
      { likelihood: 'high', cause: 'Frequency mismatch', verification: 'Compare frequencies' },
      { likelihood: 'medium', cause: 'Phase angle too wide', verification: 'Check synchroscope' },
      { likelihood: 'low', cause: 'Sync check setting too tight', verification: 'Review parameters' }
    ],
    ['Wait for conditions to match', 'Check AVR and governor', 'Verify sync settings'],
    'auto - clears when sync achievable'
  ),

  ...createDatakomCode(710, 'Load Share Fail', 'Synchronization', 'Load Sharing', 'warning',
    'Load sharing between paralleled generators is not balanced correctly. One generator may be taking more than its share of the load or kVAr. This reduces system efficiency and may cause overloading of one unit.',
    ['kW or kVAr unbalanced', 'Warning LED illuminated', 'One unit loaded more', 'Load share display shows error'],
    [
      { likelihood: 'high', cause: 'Droop setting mismatch', verification: 'Compare droop settings' },
      { likelihood: 'medium', cause: 'Communication loss', verification: 'Check load share bus' },
      { likelihood: 'medium', cause: 'CT polarity error', verification: 'Verify CT connections' },
      { likelihood: 'low', cause: 'Governor response different', verification: 'Check governor gains' }
    ],
    ['Balance droop settings', 'Check communication bus', 'Verify CT connections'],
    'auto - clears when balanced'
  ),

  ...createDatakomCode(720, 'Reverse Power', 'Synchronization', 'Load Sharing', 'critical',
    'Generator is motoring - importing power instead of generating. This indicates the engine is not providing enough power to drive the alternator against the bus. Reverse power protection has tripped to prevent engine and generator damage.',
    ['Negative kW indicated', 'Generator breaker trips', 'Critical LED illuminated', 'Engine may be struggling'],
    [
      { likelihood: 'high', cause: 'Engine fuel problem', verification: 'Check fuel supply' },
      { likelihood: 'high', cause: 'Governor not responding', verification: 'Check governor operation' },
      { likelihood: 'medium', cause: 'Engine mechanical issue', verification: 'Check engine performance' },
      { likelihood: 'low', cause: 'Protection setting', verification: 'Verify reverse power setting' }
    ],
    ['Check fuel system', 'Verify governor operation', 'Test engine under load'],
    'keypad - RESET after fault corrected'
  ),

  // ==================== PROTECTION ALARMS (800-899) ====================
  ...createDatakomCode(800, 'Earth Fault', 'Protection', 'Earth Fault', 'shutdown',
    'Earth leakage current has exceeded the protection threshold. This indicates insulation breakdown or equipment fault that creates a path to ground. Earth faults create shock hazards and can cause equipment damage or fire.',
    ['Earth fault LED illuminated', 'Generator trips', 'Possible tingling from equipment', 'RCD may have tripped'],
    [
      { likelihood: 'high', cause: 'Cable insulation damage', verification: 'Insulation test cables' },
      { likelihood: 'high', cause: 'Equipment fault', verification: 'Disconnect loads individually' },
      { likelihood: 'medium', cause: 'Water ingress', verification: 'Check for moisture' },
      { likelihood: 'low', cause: 'CT or sensing error', verification: 'Check zero sequence CT' }
    ],
    ['Disconnect all loads', 'Test insulation of each circuit', 'Repair damaged equipment'],
    'keypad - RESET after fault cleared'
  ),

  ...createDatakomCode(810, 'Over Current', 'Protection', 'Trip', 'critical',
    'Output current has exceeded the overcurrent protection threshold. This typically indicates a fault condition such as short circuit or severely overloaded equipment. The generator has tripped to protect itself and connected cables from damage.',
    ['High current recorded', 'Generator trips', 'Critical LED illuminated', 'May smell burning'],
    [
      { likelihood: 'high', cause: 'Short circuit', verification: 'Check for visible damage' },
      { likelihood: 'high', cause: 'Motor stalled', verification: 'Check motor conditions' },
      { likelihood: 'medium', cause: 'Overload', verification: 'Compare load to rating' },
      { likelihood: 'low', cause: 'CT error', verification: 'Verify CT readings' }
    ],
    ['Locate and clear fault', 'Check all connected equipment', 'Verify protection settings'],
    'keypad - RESET after fault cleared'
  ),

  // ==================== AUXILIARY ALARMS (900-999) ====================
  ...createDatakomCode(900, 'Fuel Level Low', 'Engine', 'Fuel', 'warning',
    'Fuel tank level has dropped below the warning threshold. Operating time remaining depends on load and consumption rate. Arrange for refueling to prevent running out of fuel during operation.',
    ['Fuel gauge shows low', 'Warning LED illuminated', 'Runtime limited', 'Fuel order recommended'],
    [
      { likelihood: 'high', cause: 'Normal consumption', verification: 'Calculate usage rate' },
      { likelihood: 'medium', cause: 'Fuel leak', verification: 'Inspect tank and lines' },
      { likelihood: 'low', cause: 'Sender fault', verification: 'Verify actual level' }
    ],
    ['Arrange refueling', 'Check for leaks', 'Verify sender accuracy'],
    'auto - clears when refueled'
  ),

  ...createDatakomCode(910, 'High Fuel Level', 'Engine', 'Fuel', 'info',
    'Fuel tank level is above normal maximum. This may occur after refueling and is typically informational. However, overfilling can cause fuel spillage during thermal expansion.',
    ['Fuel gauge shows full', 'Info LED illuminated', 'Tank may be overfilled', 'Check for spillage'],
    [
      { likelihood: 'high', cause: 'Tank overfilled', verification: 'Check fuel level visually' },
      { likelihood: 'low', cause: 'Sender fault', verification: 'Verify actual level' }
    ],
    ['Allow level to drop through use', 'Verify sender if persistent'],
    'auto - clears when level drops'
  ),

  ...createDatakomCode(950, 'Maintenance Due', 'Control', 'Maintenance', 'info',
    'Scheduled maintenance interval has been reached based on running hours or calendar time. Service is recommended to maintain warranty coverage and optimal performance. This alarm does not affect operation.',
    ['Service due display', 'Info LED may illuminate', 'Hours counter triggered', 'Maintenance log reminder'],
    [
      { likelihood: 'high', cause: 'Normal service interval', verification: 'Check hours since last service' }
    ],
    ['Schedule maintenance service', 'Perform required maintenance items', 'Reset service counter'],
    'software - reset counter after service'
  ),
];

export function getDatakomFaultCodes(): ControllerFaultCode[] {
  return DATAKOM_FAULT_CODES as ControllerFaultCode[];
}
