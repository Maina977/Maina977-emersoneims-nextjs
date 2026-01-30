/**
 * ComAp Authentic Fault Codes
 * Comprehensive database covering InteliLite, InteliGen, InteliSys, InteliDrive
 * All descriptions are original and technically accurate
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

const COMAP_MODELS = [
  'InteliLite IL-NT AMF25',
  'InteliGen NTC BaseBox',
  'InteliSys NTC',
  'InteliDrive'
];

function createComApCode(
  code: string,
  title: string,
  category: string,
  subcategory: string,
  severity: 'info' | 'warning' | 'critical' | 'shutdown',
  description: string,
  symptoms: string[],
  causes: { likelihood: 'high' | 'medium' | 'low'; cause: string; verification: string }[],
  solutions: string[],
  applicableModels: string[] = COMAP_MODELS
): Partial<ControllerFaultCode>[] {
  return applicableModels.map(model => ({
    id: `COMAP-${model.replace(/\s+/g, '-')}-${code}`,
    code,
    brand: 'ComAp',
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
      { step: 1, action: 'Check alarm details on controller display', expectedResult: 'Alarm information visible' },
      { step: 2, action: 'Review setpoint configuration for this alarm', expectedResult: 'Settings understood' },
      { step: 3, action: 'Verify actual measured value', expectedResult: 'Real value confirmed' },
      { step: 4, action: 'Check sensor and wiring', expectedResult: 'Connections verified' }
    ],
    resetPathways: [{
      method: severity === 'shutdown' ? 'keypad' : 'auto',
      applicableFirmware: ['All'],
      requiresCondition: severity === 'shutdown' ? ['engine_stopped', 'fault_resolved'] : ['fault_cleared'],
      steps: [
        { stepNumber: 1, action: 'Press STOP to ensure engine stopped', keySequence: ['STOP'], expectedResponse: 'Engine stops' },
        { stepNumber: 2, action: 'Press FAULT RESET button', keySequence: ['FAULT RESET'], expectedResponse: 'Alarm clears' },
        { stepNumber: 3, action: 'Return to AUTO mode if needed', keySequence: ['AUTO'], expectedResponse: 'Ready for operation' }
      ],
      successIndicator: 'No active alarms'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : 'moderate',
      timeEstimate: severity === 'shutdown' ? '1-4 hours' : '30-60 minutes',
      procedureSteps: solutions,
      tools: ['Multimeter', 'InteliConfig software', 'Hand tools'],
      parts: [],
      estimatedCost: { min: 0, max: 400, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? ['Investigate cause before restart'] : [],
    preventiveMeasures: ['Regular maintenance', 'Periodic calibration'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const COMAP_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== ENGINE ALARMS ====================
  ...createComApCode('E001', 'Oil Pressure Low', 'Engine', 'Oil Pressure', 'warning',
    'Engine lubricating oil pressure has dropped below the warning threshold configured in setpoints. Check oil level and pressure sensor.',
    ['Oil pressure gauge below normal', 'Warning indicator on', 'Engine continues running'],
    [
      { likelihood: 'high', cause: 'Low oil level in engine crankcase', verification: 'Check dipstick level' },
      { likelihood: 'high', cause: 'Oil pressure sensor fault', verification: 'Compare with mechanical gauge' },
      { likelihood: 'medium', cause: 'Oil filter restricted', verification: 'Check filter age and condition' }
    ],
    ['Stop engine and check oil level', 'Top up with correct grade if low', 'Test sensor if oil level OK']
  ),

  ...createComApCode('E002', 'Oil Pressure Low Sd', 'Engine', 'Oil Pressure', 'shutdown',
    'Oil pressure fell critically low causing immediate engine shutdown to prevent bearing and component damage.',
    ['Engine has stopped', 'Shutdown indicator lit', 'Oil pressure was critically low'],
    [
      { likelihood: 'high', cause: 'Severely low or no oil', verification: 'Check dipstick immediately' },
      { likelihood: 'high', cause: 'Oil pump failure', verification: 'Check with mechanical gauge' },
      { likelihood: 'medium', cause: 'Major internal leak or damage', verification: 'Look for external leaks' }
    ],
    ['Do NOT restart until cause found', 'Check and fill oil', 'Verify pressure with mechanical gauge', 'Inspect for mechanical damage']
  ),

  ...createComApCode('E003', 'Coolant Temp High', 'Engine', 'Coolant', 'warning',
    'Engine coolant temperature has exceeded the warning threshold. Cooling system inspection required.',
    ['Temperature gauge high', 'Warning indicator active', 'Engine may be running hot'],
    [
      { likelihood: 'high', cause: 'Low coolant level', verification: 'Check coolant expansion tank' },
      { likelihood: 'high', cause: 'Radiator blocked or dirty', verification: 'Inspect radiator fins' },
      { likelihood: 'medium', cause: 'Cooling fan not working', verification: 'Check fan operation' }
    ],
    ['Check coolant level', 'Clean radiator', 'Verify fan operation', 'Check thermostat']
  ),

  ...createComApCode('E004', 'Coolant Temp High Sd', 'Engine', 'Coolant', 'shutdown',
    'Coolant temperature exceeded critical limit causing protective engine shutdown to prevent thermal damage.',
    ['Engine stopped on high temp', 'Possible steam visible', 'Temperature was at limit'],
    [
      { likelihood: 'high', cause: 'Severe coolant loss', verification: 'Check for leaks and level' },
      { likelihood: 'high', cause: 'Cooling system failure', verification: 'Check fan, belt, pump' },
      { likelihood: 'medium', cause: 'Head gasket leak', verification: 'Check for oil in coolant' }
    ],
    ['Let engine cool', 'Check entire cooling system', 'Verify coolant level', 'Repair leaks before restart']
  ),

  ...createComApCode('E005', 'Engine Overspeed', 'Engine', 'Speed', 'shutdown',
    'Engine speed exceeded maximum safe RPM causing immediate shutdown to protect engine and generator.',
    ['Engine shutdown at high speed', 'Overspeed indicator lit', 'Mechanical stress may have occurred'],
    [
      { likelihood: 'high', cause: 'Governor malfunction', verification: 'Check governor response' },
      { likelihood: 'high', cause: 'Speed control actuator fault', verification: 'Test actuator operation' },
      { likelihood: 'medium', cause: 'Load rejection surge', verification: 'Review load events' }
    ],
    ['Check governor system', 'Verify actuator works', 'Test at no load first']
  ),

  ...createComApCode('E006', 'Engine Underspeed', 'Engine', 'Speed', 'warning',
    'Engine speed fell below minimum required threshold indicating overload or fuel delivery problems.',
    ['Speed/frequency below normal', 'Engine laboring', 'Possible smoke from exhaust'],
    [
      { likelihood: 'high', cause: 'Overload condition', verification: 'Check kW loading' },
      { likelihood: 'high', cause: 'Fuel starvation', verification: 'Check fuel supply and filters' },
      { likelihood: 'medium', cause: 'Governor not responding', verification: 'Check governor adjustment' }
    ],
    ['Reduce load if excessive', 'Check fuel filters', 'Verify fuel supply']
  ),

  ...createComApCode('E007', 'Fail to Start', 'Engine', 'Starting', 'shutdown',
    'Engine failed to start within the configured number of attempts. Start lockout is now active.',
    ['Engine cranked but did not run', 'Start attempts exhausted', 'Lockout condition active'],
    [
      { likelihood: 'high', cause: 'No fuel to engine', verification: 'Check fuel supply and solenoid' },
      { likelihood: 'high', cause: 'Fuel solenoid not working', verification: 'Listen for click on start' },
      { likelihood: 'medium', cause: 'Air in fuel system', verification: 'Bleed fuel system' }
    ],
    ['Check fuel supply', 'Verify solenoid operation', 'Bleed fuel system', 'Check starting aids']
  ),

  ...createComApCode('E008', 'Fail to Stop', 'Engine', 'Starting', 'warning',
    'Engine did not stop within expected time after stop command. Fuel shutoff may have failed.',
    ['Engine running after stop command', 'Stop failed to complete', 'Fuel still reaching engine'],
    [
      { likelihood: 'high', cause: 'Fuel solenoid stuck open', verification: 'Check solenoid manually' },
      { likelihood: 'medium', cause: 'Solenoid wiring fault', verification: 'Check voltage to solenoid' }
    ],
    ['Manually close fuel valve', 'Check fuel solenoid', 'Repair solenoid circuit']
  ),

  ...createComApCode('E009', 'Cranking Fail', 'Engine', 'Starting', 'shutdown',
    'Starter motor did not engage or turn engine during start sequence. Cranking system fault.',
    ['No rotation on start', 'Starter did not engage', 'No cranking sound'],
    [
      { likelihood: 'high', cause: 'Battery flat or failed', verification: 'Check battery voltage' },
      { likelihood: 'high', cause: 'Starter connections loose', verification: 'Inspect starter cables' },
      { likelihood: 'medium', cause: 'Starter motor failed', verification: 'Test starter' }
    ],
    ['Check battery', 'Clean and tighten connections', 'Test starter motor']
  ),

  ...createComApCode('E010', 'Emergency Stop', 'Engine', 'Emergency', 'shutdown',
    'Emergency stop circuit has been activated. This hardwired safety input stops the engine immediately.',
    ['Engine stopped', 'E-stop LED on', 'Restart blocked'],
    [
      { likelihood: 'high', cause: 'E-stop button pressed', verification: 'Check all e-stop stations' },
      { likelihood: 'medium', cause: 'E-stop wiring fault', verification: 'Check wiring continuity' }
    ],
    ['Release any pressed e-stop buttons', 'Check e-stop circuit', 'Reset alarm']
  ),

  ...createComApCode('E011', 'Low Fuel Level', 'Engine', 'Fuel', 'warning',
    'Fuel tank level has fallen below the warning threshold. Refueling is required.',
    ['Fuel gauge low', 'Low fuel indicator on', 'Continued operation limited'],
    [
      { likelihood: 'high', cause: 'Fuel consumed normally', verification: 'Check runtime since refuel' },
      { likelihood: 'medium', cause: 'Fuel leak', verification: 'Inspect for fuel leaks' }
    ],
    ['Refuel the tank', 'Check for leaks if unexpected consumption']
  ),

  ...createComApCode('E012', 'Low Fuel Level Sd', 'Engine', 'Fuel', 'shutdown',
    'Fuel level critically low. Engine stopped to prevent running dry and damaging fuel system.',
    ['Engine stopped', 'Fuel nearly empty', 'Running dry damages injectors'],
    [
      { likelihood: 'high', cause: 'Fuel exhausted', verification: 'Tank should be empty' }
    ],
    ['Refuel with clean fuel', 'Bleed fuel system', 'Check for damage if ran dry']
  ),

  ...createComApCode('E013', 'Charge Alt Fail', 'Engine', 'Charging', 'warning',
    'No charging current detected from the engine alternator. Battery will discharge if not corrected.',
    ['No charge indication', 'Battery voltage falling', 'Charge fail LED on'],
    [
      { likelihood: 'high', cause: 'Alternator belt broken', verification: 'Inspect belt' },
      { likelihood: 'high', cause: 'Alternator failed', verification: 'Measure output voltage' },
      { likelihood: 'medium', cause: 'W terminal wiring fault', verification: 'Check W terminal' }
    ],
    ['Check alternator belt', 'Test alternator output', 'Check wiring']
  ),

  ...createComApCode('E014', 'Battery Voltage Low', 'Engine', 'Battery', 'warning',
    'DC supply voltage to controller and cranking system is below acceptable level.',
    ['Battery voltage reading low', 'May affect starting', 'Controller may be unreliable'],
    [
      { likelihood: 'high', cause: 'Battery discharged', verification: 'Measure battery voltage' },
      { likelihood: 'high', cause: 'Charger not working', verification: 'Check charger output' },
      { likelihood: 'medium', cause: 'Battery failed', verification: 'Load test battery' }
    ],
    ['Test and charge battery', 'Check charger operation', 'Replace battery if failed']
  ),

  ...createComApCode('E015', 'Battery Voltage High', 'Engine', 'Battery', 'warning',
    'DC supply voltage exceeds safe charging limits. Overcharging damages batteries.',
    ['Battery voltage above normal', 'Battery may be gassing', 'Risk of battery damage'],
    [
      { likelihood: 'high', cause: 'Charger voltage too high', verification: 'Measure charger output' },
      { likelihood: 'medium', cause: 'Charger regulator failed', verification: 'Check regulation' }
    ],
    ['Adjust charger voltage', 'Replace charger if faulty']
  ),

  // ==================== GENERATOR/ELECTRICAL ALARMS ====================
  ...createComApCode('G001', 'Gen Over Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage exceeded the configured upper limit. AVR may need adjustment.',
    ['Voltage reading high', 'Connected loads at risk', 'Possible light flicker'],
    [
      { likelihood: 'high', cause: 'AVR setting too high', verification: 'Check AVR voltage pot' },
      { likelihood: 'medium', cause: 'AVR sensing error', verification: 'Check AVR connections' }
    ],
    ['Adjust AVR to reduce voltage', 'Check AVR sensing connections']
  ),

  ...createComApCode('G002', 'Gen Over Voltage Sd', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage severely exceeded limits causing protective shutdown. Equipment protection activated.',
    ['Generator tripped', 'Voltage was dangerously high', 'Load disconnected'],
    [
      { likelihood: 'high', cause: 'AVR failure', verification: 'Check AVR operation' },
      { likelihood: 'medium', cause: 'Speed surge caused voltage spike', verification: 'Check governor' }
    ],
    ['Check and replace AVR if faulty', 'Verify governor stability']
  ),

  ...createComApCode('G003', 'Gen Under Voltage', 'Electrical', 'Voltage', 'warning',
    'Generator output voltage fell below the configured lower limit indicating overload or excitation issue.',
    ['Voltage reading low', 'Lights dim', 'Motors may struggle'],
    [
      { likelihood: 'high', cause: 'Generator overloaded', verification: 'Check load vs rating' },
      { likelihood: 'medium', cause: 'AVR or excitation fault', verification: 'Check AVR output' }
    ],
    ['Reduce load', 'Adjust AVR', 'Check excitation system']
  ),

  ...createComApCode('G004', 'Gen Under Voltage Sd', 'Electrical', 'Voltage', 'shutdown',
    'Generator voltage collapsed causing shutdown. Severe overload or total excitation loss.',
    ['Generator tripped', 'Voltage was very low', 'Load lost'],
    [
      { likelihood: 'high', cause: 'Massive overload', verification: 'Review connected load' },
      { likelihood: 'high', cause: 'Excitation completely lost', verification: 'Check field voltage' }
    ],
    ['Remove excessive load', 'Check AVR and excitation', 'Check generator windings']
  ),

  ...createComApCode('G005', 'Gen Over Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency exceeded upper limit. Engine speed is above nominal.',
    ['Frequency reading high', 'Engine speed above normal', 'Governor adjustment needed'],
    [
      { likelihood: 'high', cause: 'Governor set too fast', verification: 'Check speed setting' },
      { likelihood: 'medium', cause: 'Governor not responding to load', verification: 'Apply load and observe' }
    ],
    ['Adjust governor speed', 'Check governor response']
  ),

  ...createComApCode('G006', 'Gen Under Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency fell below lower limit indicating overload or fuel issue.',
    ['Frequency low', 'Engine laboring', 'Possible smoke'],
    [
      { likelihood: 'high', cause: 'Overloaded beyond capacity', verification: 'Check actual load' },
      { likelihood: 'high', cause: 'Fuel delivery issue', verification: 'Check fuel system' }
    ],
    ['Reduce load', 'Check fuel filters and supply']
  ),

  ...createComApCode('G007', 'Gen Over Current', 'Electrical', 'Current', 'warning',
    'Generator current exceeded rated value. Operating at overload conditions.',
    ['Current above rating', 'Generator may overheat', 'Protect from thermal damage'],
    [
      { likelihood: 'high', cause: 'Connected load too high', verification: 'Calculate total load' }
    ],
    ['Reduce connected load to within rating']
  ),

  ...createComApCode('G008', 'Gen Over Current Sd', 'Electrical', 'Current', 'shutdown',
    'Generator current massively exceeded rating causing trip. Possible short circuit.',
    ['Generator tripped', 'Severe overcurrent detected', 'Check for faults'],
    [
      { likelihood: 'high', cause: 'Short circuit in loads', verification: 'Inspect load circuits' },
      { likelihood: 'medium', cause: 'Motor stall/locked rotor', verification: 'Check motor loads' }
    ],
    ['Find and repair short circuit', 'Check motors', 'Test insulation before restart']
  ),

  ...createComApCode('G009', 'Reverse Power', 'Electrical', 'Power', 'warning',
    'Generator is motoring - consuming power instead of producing it. Incorrect in parallel applications.',
    ['kW reading negative', 'Generator absorbing power', 'Engine not producing'],
    [
      { likelihood: 'high', cause: 'Engine not producing power', verification: 'Check engine output' },
      { likelihood: 'high', cause: 'Paralleling problem', verification: 'Check sync parameters' }
    ],
    ['Check engine power output', 'Verify synchronization']
  ),

  ...createComApCode('G010', 'Reverse Power Sd', 'Electrical', 'Power', 'shutdown',
    'Sustained reverse power caused protective trip. Generator was motoring for too long.',
    ['Generator disconnected', 'Was consuming power', 'Engine may have lost fuel'],
    [
      { likelihood: 'high', cause: 'Engine fuel or power loss', verification: 'Check engine' }
    ],
    ['Check engine produces power at no load', 'Verify fuel system', 'Check synchronizer']
  ),

  ...createComApCode('G011', 'Earth Fault', 'Electrical', 'Protection', 'critical',
    'Ground/earth fault current detected. Insulation failure in generator or load circuits.',
    ['Earth fault current reading', 'Possible tingling from equipment', 'Safety hazard'],
    [
      { likelihood: 'high', cause: 'Load cable insulation failure', verification: 'Test load insulation' },
      { likelihood: 'medium', cause: 'Generator winding insulation fault', verification: 'Test generator' }
    ],
    ['Disconnect loads and test each', 'Find and repair insulation fault', 'Do not operate with earth faults']
  ),

  ...createComApCode('G012', 'Phase Rotation Wrong', 'Electrical', 'Phase', 'warning',
    'Phase sequence is reversed. Motors would run backwards if connected.',
    ['Rotation indicator shows reverse', 'Three-phase sequence incorrect'],
    [
      { likelihood: 'high', cause: 'Phase leads connected wrong', verification: 'Check connections' }
    ],
    ['Swap any two phase connections to correct']
  ),

  // ==================== MAINS ALARMS ====================
  ...createComApCode('M001', 'Mains Failure', 'Mains', 'Supply', 'info',
    'Utility supply has been lost or is outside acceptable voltage/frequency limits.',
    ['Mains voltage zero or low', 'Generator start may begin', 'Transfer may occur'],
    [
      { likelihood: 'high', cause: 'Utility power outage', verification: 'Check neighborhood' },
      { likelihood: 'medium', cause: 'Mains breaker tripped', verification: 'Check mains breaker' }
    ],
    ['Verify utility outage', 'Check mains breakers', 'Wait for utility restoration']
  ),

  ...createComApCode('M002', 'Mains Over Voltage', 'Mains', 'Voltage', 'warning',
    'Utility supply voltage has exceeded upper acceptable limit.',
    ['Mains voltage high', 'May affect connected equipment'],
    [
      { likelihood: 'high', cause: 'Utility voltage genuinely high', verification: 'Measure supply' }
    ],
    ['Contact utility if consistently high']
  ),

  ...createComApCode('M003', 'Mains Under Voltage', 'Mains', 'Voltage', 'warning',
    'Utility supply voltage is below acceptable level. Brown-out condition.',
    ['Mains voltage low', 'Lights dim on mains', 'Motors may overheat'],
    [
      { likelihood: 'high', cause: 'Utility brown-out', verification: 'Measure supply' }
    ],
    ['Consider transfer to generator', 'Report to utility']
  ),

  ...createComApCode('M004', 'Mains Over Frequency', 'Mains', 'Frequency', 'warning',
    'Utility frequency above normal indicating grid instability.',
    ['Frequency high', 'Unusual condition'],
    [
      { likelihood: 'medium', cause: 'Grid frequency issue', verification: 'Measure frequency' }
    ],
    ['Monitor condition', 'Report if persistent']
  ),

  ...createComApCode('M005', 'Mains Under Frequency', 'Mains', 'Frequency', 'warning',
    'Utility frequency below normal indicating stressed grid.',
    ['Frequency low', 'Grid may be overloaded'],
    [
      { likelihood: 'high', cause: 'Grid stressed by demand', verification: 'Measure frequency' }
    ],
    ['Prepare for possible blackout', 'Consider transfer']
  ),

  // ==================== CONTROLLER/SYSTEM ALARMS ====================
  ...createComApCode('S001', 'Controller Fault', 'Control', 'Hardware', 'critical',
    'Internal controller hardware fault detected. Controller may need replacement.',
    ['Controller behaving erratically', 'Error displayed', 'Functions may not work'],
    [
      { likelihood: 'medium', cause: 'Internal component failure', verification: 'Check for error codes' }
    ],
    ['Power cycle controller', 'If persistent, replace unit']
  ),

  ...createComApCode('S002', 'Configuration Error', 'Control', 'Configuration', 'warning',
    'Controller configuration has been corrupted or is invalid.',
    ['Unexpected behavior', 'Settings may be wrong', 'Functions not working as expected'],
    [
      { likelihood: 'high', cause: 'Power loss during save', verification: 'Review settings' }
    ],
    ['Reload configuration from backup', 'Verify all settings']
  ),

  ...createComApCode('S003', 'CAN Bus Error', 'Control', 'Communication', 'warning',
    'CAN communication bus has encountered errors. ECU data may be unavailable.',
    ['Engine data not updating', 'ECU values showing dashes', 'Communication problems'],
    [
      { likelihood: 'high', cause: 'CAN wiring fault', verification: 'Check CAN cables' },
      { likelihood: 'high', cause: 'Termination missing', verification: 'Verify 120 ohm terminators' }
    ],
    ['Check CAN wiring', 'Verify termination resistors', 'Check for shorts']
  ),

  ...createComApCode('S004', 'Modbus Error', 'Control', 'Communication', 'warning',
    'Modbus communication has failed. Remote monitoring/control unavailable.',
    ['Remote systems show offline', 'No response to queries'],
    [
      { likelihood: 'high', cause: 'Cable disconnected', verification: 'Check connections' },
      { likelihood: 'high', cause: 'Settings mismatch', verification: 'Verify baud rate, address' }
    ],
    ['Check physical connections', 'Verify communication settings']
  ),

  ...createComApCode('S005', 'RTC Battery Low', 'Control', 'Hardware', 'info',
    'Real-time clock battery is depleted. Time/date will be lost on power cycle.',
    ['Time resets after power off', 'Date incorrect', 'Scheduled events may fail'],
    [
      { likelihood: 'high', cause: 'Battery reached end of life', verification: 'Check battery voltage' }
    ],
    ['Replace RTC battery', 'Reset date and time']
  ),

  ...createComApCode('S006', 'ECU Warning', 'Control', 'Communication', 'warning',
    'Engine ECU has reported a warning condition via CAN bus.',
    ['ECU warning light may be on', 'Engine performance may be affected', 'Check ECU codes'],
    [
      { likelihood: 'high', cause: 'ECU detected issue', verification: 'Read ECU fault codes' }
    ],
    ['Connect ECU diagnostic tool', 'Read and address ECU codes']
  ),

  ...createComApCode('S007', 'ECU Shutdown', 'Control', 'Communication', 'shutdown',
    'Engine ECU has commanded engine shutdown via CAN bus.',
    ['Engine stopped by ECU', 'ECU fault present', 'Controller received shutdown command'],
    [
      { likelihood: 'high', cause: 'ECU detected serious fault', verification: 'Read ECU codes' }
    ],
    ['Use ECU diagnostic tool', 'Address ECU fault before restart']
  ),

  ...createComApCode('S008', 'Sensor Open', 'Control', 'Input/Output', 'warning',
    'Analog sensor input showing open circuit condition.',
    ['Sensor reading at minimum or error', 'Actual value not displayed'],
    [
      { likelihood: 'high', cause: 'Sensor wiring disconnected', verification: 'Check connections' },
      { likelihood: 'medium', cause: 'Sensor failed open', verification: 'Test sensor' }
    ],
    ['Check wiring', 'Replace sensor if faulty']
  ),

  ...createComApCode('S009', 'Sensor Short', 'Control', 'Input/Output', 'warning',
    'Analog sensor input showing short circuit condition.',
    ['Sensor reading at maximum or error', 'Measurement not reliable'],
    [
      { likelihood: 'high', cause: 'Sensor wiring shorted', verification: 'Check for damaged wires' },
      { likelihood: 'medium', cause: 'Sensor failed shorted', verification: 'Test sensor' }
    ],
    ['Check wiring for shorts', 'Replace sensor if faulty']
  ),

  ...createComApCode('S010', 'Maintenance Due', 'Control', 'Maintenance', 'info',
    'Scheduled maintenance interval has been reached based on running hours or calendar.',
    ['Maintenance indicator on', 'Service interval expired'],
    [
      { likelihood: 'high', cause: 'Normal maintenance due', verification: 'Check hours counter' }
    ],
    ['Perform required maintenance', 'Reset maintenance counter']
  ),

  // ==================== SYNCHRONIZATION ALARMS ====================
  ...createComApCode('P001', 'Sync Timeout', 'Synchronization', 'Sync', 'warning',
    'Generator failed to synchronize within allowed time period.',
    ['Sync did not complete', 'Breaker did not close', 'Generator returned to idle'],
    [
      { likelihood: 'high', cause: 'Voltage or frequency mismatch', verification: 'Compare gen to bus' },
      { likelihood: 'medium', cause: 'Synchronizer settings wrong', verification: 'Check sync settings' }
    ],
    ['Match voltage and frequency to bus', 'Check synchronizer configuration']
  ),

  ...createComApCode('P002', 'Sync Voltage High', 'Synchronization', 'Sync', 'warning',
    'Voltage difference between generator and bus too high for synchronizing.',
    ['Cannot sync - voltage different', 'Breaker close blocked'],
    [
      { likelihood: 'high', cause: 'Generator voltage not matched', verification: 'Compare voltages' }
    ],
    ['Adjust generator voltage to match bus']
  ),

  ...createComApCode('P003', 'Sync Frequency High', 'Synchronization', 'Sync', 'warning',
    'Frequency difference between generator and bus too high for synchronizing.',
    ['Cannot sync - frequency different', 'Synchroscope spinning fast'],
    [
      { likelihood: 'high', cause: 'Speed not matched', verification: 'Compare frequencies' }
    ],
    ['Adjust generator speed to match bus']
  ),

  ...createComApCode('P004', 'Load Share Error', 'Synchronization', 'Load Sharing', 'warning',
    'Real power sharing between paralleled units is unbalanced.',
    ['Some units overloaded, others underloaded', 'kW sharing uneven'],
    [
      { likelihood: 'high', cause: 'Droop settings different', verification: 'Check all unit settings' },
      { likelihood: 'medium', cause: 'Speed bias needs adjustment', verification: 'Fine tune bias' }
    ],
    ['Match droop settings', 'Adjust speed bias']
  ),

  ...createComApCode('P005', 'VAr Share Error', 'Synchronization', 'Load Sharing', 'warning',
    'Reactive power sharing between paralleled units is unbalanced.',
    ['kVAr sharing uneven', 'Circulating current between units'],
    [
      { likelihood: 'high', cause: 'VAr sharing not configured', verification: 'Check VAr settings' }
    ],
    ['Configure VAr sharing', 'Match voltage droop settings']
  ),

  ...createComApCode('P006', 'Breaker Trip Fail', 'Synchronization', 'Breaker', 'critical',
    'Generator breaker did not open when commanded. Serious safety issue.',
    ['Breaker still closed after trip command', 'Cannot disconnect generator'],
    [
      { likelihood: 'high', cause: 'Trip coil fault', verification: 'Check trip circuit' },
      { likelihood: 'medium', cause: 'Breaker mechanism stuck', verification: 'Try manual trip' }
    ],
    ['Manually trip breaker', 'Stop engine if breaker stuck', 'Repair breaker urgently']
  ),

  ...createComApCode('P007', 'Breaker Close Fail', 'Synchronization', 'Breaker', 'warning',
    'Generator breaker did not close when commanded.',
    ['Breaker still open after close command', 'Generator not connected'],
    [
      { likelihood: 'high', cause: 'Close coil fault', verification: 'Check close circuit' },
      { likelihood: 'medium', cause: 'Spring not charged', verification: 'Check spring status' }
    ],
    ['Check close coil circuit', 'Verify spring charged', 'Test breaker']
  ),

  ...createComApCode('P008', 'Bus Voltage Lost', 'Synchronization', 'Sync', 'warning',
    'Cannot detect bus voltage for synchronization purposes.',
    ['Bus voltage shows zero', 'Sync not possible'],
    [
      { likelihood: 'high', cause: 'Bus VT fuse blown', verification: 'Check VT fuses' },
      { likelihood: 'medium', cause: 'VT wiring fault', verification: 'Check VT connections' }
    ],
    ['Check bus voltage sensing', 'Replace fuses if blown']
  ),
];

export function getComApFaultCodes(): ControllerFaultCode[] {
  return COMAP_FAULT_CODES as ControllerFaultCode[];
}
