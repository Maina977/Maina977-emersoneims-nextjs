/**
 * INDEPENDENT REFERENCE DATABASE - Siemens-Compatible Controllers
 * Community-sourced troubleshooting guide for power management controllers
 *
 * DISCLAIMER: This is an independent reference guide created for educational and
 * troubleshooting purposes. All brand names, model numbers, and trademarks mentioned
 * are the property of their respective owners. This database is NOT affiliated with,
 * endorsed by, or officially associated with Siemens AG or any other manufacturer.
 * All fault descriptions are independently compiled interpretations intended to
 * assist technicians in the field. For official documentation, always refer to
 * the manufacturer's service manuals.
 *
 * Siemens®, SICAM®, SIPROTEC®, and SENTRON® are registered trademarks of Siemens AG.
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

const SIEMENS_MODELS = ['SICAM A8000', 'SICAM PAS', 'SIPROTEC 7SJ', 'SIPROTEC 7SD', 'SIPROTEC 7SL', 'SIPROTEC 7UT', 'SIPROTEC 7SA', 'SENTRON PAC'];

const createSiemensCode = (
  code: string,
  title: string,
  description: string,
  symptoms: string[],
  causes: string[],
  solutions: string[],
  resetMethod: string,
  severity: 'critical' | 'warning' | 'info' = 'warning',
  category: string = 'System'
): Partial<ControllerFaultCode>[] => SIEMENS_MODELS.map(model => ({
  id: `SIEMENS-${model.replace(/\s+/g, '-')}-${code}`,
  code,
  brand: 'Siemens',
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
    { step: 1, action: 'Record alarm code and check event log', expectedResult: 'Alarm details documented' },
    { step: 2, action: 'Verify actual condition using DIGSI software', expectedResult: 'Independent verification obtained' },
    { step: 3, action: 'Check related sensor wiring and connections', expectedResult: 'No wiring faults found' },
    { step: 4, action: 'Review protection settings configuration', expectedResult: 'Settings verified correct' },
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
    successIndicator: 'No active alarms, protection ready'
  }],
  solutions: [{
    difficulty: severity === 'critical' ? 'advanced' : 'moderate',
    timeEstimate: severity === 'critical' ? '1-4 hours' : '30-60 minutes',
    procedureSteps: solutions,
    tools: ['DIGSI software', 'Multimeter', 'Test equipment'],
    parts: [],
    estimatedCost: { min: 0, max: severity === 'critical' ? 500 : 200, currency: 'USD' }
  }],
  safetyWarnings: ['Ensure proper lockout/tagout procedures before servicing', 'Only qualified personnel should perform maintenance', 'Follow Siemens safety guidelines'],
  preventiveMeasures: ['Regular system diagnostics', 'Periodic calibration verification', 'Firmware updates as recommended'],
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

const SIEMENS_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== SYSTEM FAULTS (S001-S099) ====================
  ...createSiemensCode(
    'S001',
    'System Self-Test Failure',
    'The Siemens controller has detected a failure during the power-on self-test (POST) sequence. This comprehensive diagnostic routine checks CPU integrity, memory allocation, communication interfaces, and internal peripheral functionality. A POST failure indicates that one or more critical system components did not pass verification, potentially compromising the reliability of protection and control functions. The system may enter a safe mode or refuse to initialize fully until the underlying issue is resolved. This fault requires immediate attention as it affects the fundamental operation of the protection relay or controller.\n\nSiemens SIPROTEC and SICAM devices implement rigorous self-test protocols to ensure operational integrity. When a self-test failure occurs, the device logs detailed diagnostic information that can be retrieved through DIGSI software or the front panel interface. Understanding the specific test that failed is crucial for effective troubleshooting. Common causes include memory corruption from power disturbances, aging electronic components, or firmware inconsistencies following interrupted updates.',
    ['Controller fails to initialize', 'Error LED illuminated', 'Display shows system error', 'Protection functions unavailable'],
    ['Memory module failure', 'CPU malfunction', 'Firmware corruption', 'Power supply instability', 'Internal component failure'],
    ['Perform power cycle reset', 'Check firmware integrity and version', 'Run extended diagnostics via DIGSI', 'Verify power supply stability', 'Replace controller if persistent'],
    'Power cycle and reinitialize',
    'critical',
    'System'
  ),

  ...createSiemensCode(
    'S002',
    'Watchdog Timer Timeout',
    'The internal watchdog timer has detected a system hang condition where the main processor failed to reset the watchdog within the expected time window. This protective mechanism prevents the controller from remaining in an undefined state that could lead to incorrect protection decisions. When the watchdog triggers, it forces a system reset to restore normal operation. Frequent watchdog timeouts may indicate software issues, processor overload, or hardware problems requiring investigation.\n\nThe watchdog timer is a critical safety feature in Siemens protection relays that ensures continuous, reliable operation. It monitors the execution of the main control loop and expects periodic "kicks" from the software. If the software becomes trapped in an infinite loop, encounters a deadlock, or the processor becomes overwhelmed, the watchdog will trigger. Modern Siemens devices log watchdog events with timestamps and context information to aid in root cause analysis.',
    ['Unexpected system restarts', 'Temporary loss of protection', 'Watchdog LED indicator', 'Event log entries'],
    ['Software hang condition', 'Processor overload', 'Interrupt handling issues', 'Firmware bugs', 'EMI interference'],
    ['Review system load and configuration', 'Update to latest firmware', 'Check for electromagnetic interference', 'Verify configuration complexity', 'Contact Siemens support if persistent'],
    'Automatic reset after watchdog timeout',
    'critical',
    'System'
  ),

  ...createSiemensCode(
    'S003',
    'Configuration Checksum Error',
    'The stored configuration data has failed checksum verification, indicating potential corruption of the settings that define how the device operates. Configuration data includes protection settings, communication parameters, I/O assignments, and other critical operational parameters. A checksum error means the calculated checksum of the current configuration does not match the stored verification value, suggesting data integrity has been compromised. The device may operate with default settings or enter a safe mode until valid configuration is restored.\n\nSiemens devices use sophisticated error detection mechanisms to verify configuration integrity. When a checksum error is detected, the device will typically refuse to use the corrupted configuration and may fall back to factory defaults or a previously known-good configuration backup. This protection prevents the device from operating with incorrect settings that could lead to misoperation. Configuration should be restored from a known-good backup using DIGSI software.',
    ['Settings not retained', 'Device using default values', 'Configuration mismatch warnings', 'Protection settings incorrect'],
    ['EEPROM/Flash degradation', 'Interrupted configuration write', 'Power loss during save', 'Memory hardware failure', 'Software bug'],
    ['Reload configuration from backup', 'Verify configuration via DIGSI', 'Perform factory reset and reconfigure', 'Check for firmware updates', 'Replace memory module if persistent'],
    'Reload valid configuration file',
    'critical',
    'System'
  ),

  ...createSiemensCode(
    'S004',
    'Real-Time Clock Failure',
    'The internal real-time clock (RTC) has malfunctioned or lost synchronization with the system time reference. Accurate timekeeping is essential for event logging, fault recording, time-stamped measurements, and synchronized protection schemes. An RTC failure affects the reliability of sequence-of-events recording and may impact time-coordinated protection functions. The device may show incorrect timestamps or fail to maintain time across power cycles.\n\nSiemens protection devices rely on precise timekeeping for many functions including disturbance recording, event timestamping, and in some cases, synchrophasor measurements. The RTC typically has a backup battery to maintain time during power outages. RTC failures often indicate a depleted backup battery, which is a normal maintenance item. However, persistent failures after battery replacement may indicate RTC circuit problems. Time synchronization via SNTP, IRIG-B, or PTP protocols can provide external time reference even if the internal RTC has issues.',
    ['Incorrect timestamps on events', 'Time drift after power cycles', 'Synchronization failures', 'Inaccurate fault records'],
    ['RTC backup battery depleted', 'RTC oscillator failure', 'Time synchronization lost', 'Circuit board fault', 'Temperature extremes'],
    ['Replace RTC backup battery', 'Configure external time sync (SNTP/IRIG-B)', 'Verify time sync source availability', 'Recalibrate RTC if possible', 'Replace main board if RTC circuit failed'],
    'Replace battery and resynchronize time',
    'warning',
    'System'
  ),

  ...createSiemensCode(
    'S005',
    'Internal Communication Bus Error',
    'An error has been detected on the internal communication bus that connects various modules and subsystems within the device. This bus enables data exchange between the CPU, I/O modules, communication interfaces, and other internal components. A bus error may result in loss of communication between modules, incorrect data transfer, or system instability. The nature of the error (timeout, parity, framing) provides clues to the underlying cause.\n\nSiemens modular devices use high-speed internal buses to ensure reliable data exchange between components. Bus errors can be transient (caused by EMI or power disturbances) or persistent (indicating hardware failure). The device typically logs detailed information about bus errors including the failing module, error type, and frequency. Persistent bus errors affecting specific modules may indicate connector problems, cable issues in rack-mounted systems, or module hardware failure.',
    ['Intermittent module communication', 'Data inconsistencies', 'Module not responding', 'System performance degradation'],
    ['Module connector issues', 'Internal cable fault', 'EMI interference', 'Module hardware failure', 'Backplane problems'],
    ['Check module seating and connectors', 'Inspect internal cabling', 'Relocate away from EMI sources', 'Swap module positions for testing', 'Replace faulty module'],
    'Reseat modules and restart',
    'critical',
    'System'
  ),

  // ==================== PROTECTION FAULTS (P001-P099) ====================
  ...createSiemensCode(
    'P001',
    'Overcurrent Protection Pickup',
    'The overcurrent protection function (ANSI 50/51) has detected current exceeding the configured pickup threshold. This is a fundamental protection function that monitors phase and ground currents to detect fault conditions or overload situations. The pickup indicates that current has risen above the set threshold and timing has begun. Depending on the protection scheme, this may lead to a trip command if the overcurrent condition persists beyond the configured time delay.\n\nSiemens SIPROTEC overcurrent protection offers multiple stages with independent pickup levels and time characteristics. The protection can be configured for definite time or inverse time characteristics (IEC or ANSI curves). When pickup occurs, the relay begins timing toward trip. Understanding the pickup level, time characteristic, and actual measured current is essential for determining whether the protection is operating correctly for the given system conditions. Coordination with upstream and downstream protection devices ensures selective fault clearing.',
    ['Trip initiation', 'Overcurrent LED active', 'Current readings elevated', 'Timing toward trip'],
    ['Short circuit fault', 'Overload condition', 'Incorrect CT ratio setting', 'Starting current inrush', 'Setting too sensitive'],
    ['Identify and clear the fault', 'Verify CT connections and ratios', 'Review overcurrent settings', 'Check coordination with other protection', 'Adjust pickup if too sensitive'],
    'Auto-reset when current falls below pickup',
    'warning',
    'Protection'
  ),

  ...createSiemensCode(
    'P002',
    'Earth Fault Protection Operated',
    'The earth fault protection function (ANSI 50N/51N or 50G/51G) has detected ground current indicating an insulation failure or ground fault in the protected circuit. Earth faults can cause equipment damage, safety hazards, and system instability if not cleared promptly. The protection may be configured for sensitive or non-sensitive earth fault detection depending on the grounding system type and protection requirements.\n\nEarth fault protection in Siemens relays can use various measurement methods including residual current (calculated from phase CTs), core balance CT, or dedicated ground CT. The choice depends on the required sensitivity and grounding system. High-resistance grounded systems require sensitive earth fault detection, while solidly grounded systems may use conventional earth fault protection. The relay provides detailed fault records including fault current magnitude, fault inception angle, and event timestamps for analysis.',
    ['Ground fault trip', 'Earth fault LED active', 'Residual current present', 'Insulation alarm'],
    ['Cable insulation failure', 'Equipment ground fault', 'CT wiring error', 'Moisture ingress', 'Incorrect neutral connection'],
    ['Perform insulation resistance testing', 'Inspect cables and terminations', 'Check for moisture in equipment', 'Verify CT polarity and connections', 'Clear fault and test before re-energizing'],
    'Clear fault condition and reset',
    'critical',
    'Protection'
  ),

  ...createSiemensCode(
    'P003',
    'Differential Protection Trip',
    'The differential protection function (ANSI 87) has operated due to detecting a difference between currents entering and leaving the protected zone that exceeds the configured threshold. Differential protection provides fast, selective protection for transformers, generators, busbars, and other equipment by comparing currents at zone boundaries. A differential trip indicates an internal fault within the protected zone requiring immediate investigation.\n\nSiemens differential protection uses sophisticated algorithms to distinguish internal faults from external faults and through-fault conditions. Features include harmonic restraint for transformer inrush, cross-blocking logic, and adaptive stabilization. When differential protection operates, it typically trips all breakers bounding the protected zone simultaneously. Fault records provide valuable information including differential and restraint currents, harmonic content, and the operating characteristic point for analysis of the trip decision.',
    ['Zone isolation', 'Differential trip indication', 'All zone breakers open', 'Lockout condition'],
    ['Internal fault in protected equipment', 'CT saturation on external fault', 'CT ratio mismatch', 'CT wiring error', 'Equipment insulation failure'],
    ['Do not re-energize without investigation', 'Inspect protected equipment thoroughly', 'Check CT ratios and connections', 'Review fault records and oscillography', 'Test equipment before re-energizing'],
    'Manual reset after investigation',
    'critical',
    'Protection'
  ),

  ...createSiemensCode(
    'P004',
    'Distance Protection Zone 1 Trip',
    'Distance protection Zone 1 (ANSI 21-1) has operated, indicating a fault detected within the first protective zone, typically set to reach approximately 80-85% of the protected line. Zone 1 is set to trip instantaneously without intentional time delay to clear faults quickly while maintaining selectivity. A Zone 1 trip indicates a fault close to the relay location on the protected line.\n\nSiemens distance protection implements sophisticated fault detection algorithms that measure impedance to the fault location. The relay calculates apparent impedance from voltage and current measurements and compares it to the configured reach settings. Zone 1 underreach ensures selective operation by not tripping for faults beyond the protected line terminal. Fault location estimation provides valuable information for patrol and repair activities. The relay records detailed fault data including fault type, fault loop impedance, and fault distance.',
    ['Instantaneous line trip', 'Zone 1 operation flag', 'Fault distance indication', 'Line locked out'],
    ['Line fault within Zone 1 reach', 'Incorrect reach setting', 'CVT transient issues', 'CT/VT ratio errors', 'Close-in fault'],
    ['Inspect line within Zone 1 reach', 'Review fault records for location', 'Check relay settings against line parameters', 'Verify CT and VT ratios', 'Coordinate with line patrol'],
    'Manual reset after fault clearance',
    'critical',
    'Protection'
  ),

  ...createSiemensCode(
    'P005',
    'Undervoltage Protection Alarm',
    'The undervoltage protection function (ANSI 27) has detected voltage below the configured threshold. Sustained undervoltage can damage motors, cause equipment malfunction, and indicate system problems. The protection may be configured with time delay to ride through brief voltage dips while responding to sustained undervoltage conditions.\n\nSiemens undervoltage protection monitors phase voltages and can be configured for phase-to-phase or phase-to-neutral measurement. Multiple stages with different voltage thresholds and time delays can be configured for alarm and trip functions. Understanding the cause of undervoltage is essential - it may indicate local problems (transformer tap position, heavy load) or system-wide issues (generation deficit, transmission constraints). The relay records voltage levels, pickup/dropout times, and associated system conditions.',
    ['Undervoltage alarm active', 'Voltage readings low', 'Equipment operation affected', 'Potential trip pending'],
    ['System undervoltage condition', 'Transformer tap position', 'Heavy system load', 'VT failure', 'Local equipment fault'],
    ['Monitor voltage recovery', 'Check system conditions', 'Verify VT connections and operation', 'Adjust transformer taps if applicable', 'Investigate if condition persists'],
    'Auto-reset when voltage recovers',
    'warning',
    'Protection'
  ),

  ...createSiemensCode(
    'P006',
    'Overvoltage Protection Operated',
    'The overvoltage protection function (ANSI 59) has detected voltage exceeding the configured threshold. Overvoltage can damage equipment insulation, cause flashovers, and stress electrical components. Sources of overvoltage include load rejection, capacitor switching, ferroresonance, and generator AVR malfunction. Prompt response to overvoltage conditions protects expensive equipment from damage.\n\nSiemens overvoltage protection provides multiple stages for alarm and trip functions with configurable voltage thresholds and time delays. The protection can distinguish between temporary overvoltage (load rejection) and sustained conditions requiring intervention. Neutral displacement monitoring provides additional protection for ground faults in resistance-grounded systems. The relay records peak voltage levels, duration, and system conditions at the time of operation.',
    ['Overvoltage trip or alarm', 'Voltage readings high', 'Equipment stress indication', 'Insulation concerns'],
    ['Load rejection', 'AVR malfunction', 'Capacitor bank switching', 'Ferroresonance', 'VT circuit problem'],
    ['Reduce generator excitation', 'Switch out capacitor banks', 'Check AVR operation', 'Investigate ferroresonance if suspected', 'Verify VT operation'],
    'Manual reset after voltage normalized',
    'critical',
    'Protection'
  ),

  // ==================== MEASUREMENT FAULTS (M001-M099) ====================
  ...createSiemensCode(
    'M001',
    'Current Transformer Circuit Failure',
    'The monitoring function has detected an abnormality in the current transformer (CT) circuit indicating open circuit, short circuit, or incorrect connection. CT circuit integrity is essential for accurate current measurement and correct protection operation. A CT circuit failure compromises the reliability of current-based protection functions and measurement accuracy.\n\nSiemens relays include sophisticated CT supervision functions that monitor for CT circuit problems. These functions can detect open CT secondaries (a dangerous condition), CT saturation, and connection errors. Detection methods include monitoring for asymmetry between phases, checking for loss of current during loaded conditions, and analyzing current waveforms. When a CT failure is detected, the relay may block affected protection functions to prevent misoperation.',
    ['Current reading abnormal or zero', 'CT supervision alarm', 'Protection functions blocked', 'Measurement errors'],
    ['Open CT secondary', 'CT wiring fault', 'CT terminal connection loose', 'CT ratio setting incorrect', 'CT hardware failure'],
    ['Check CT secondary wiring', 'Verify terminal connections', 'Measure CT secondary resistance', 'Confirm CT ratio settings', 'Test CT with injection equipment'],
    'Restore CT circuit integrity and reset',
    'critical',
    'Measurement'
  ),

  ...createSiemensCode(
    'M002',
    'Voltage Transformer Failure',
    'The monitoring function has detected a problem with the voltage transformer (VT) or capacitive voltage transformer (CVT) circuit. Accurate voltage measurement is essential for protection functions including distance protection, undervoltage/overvoltage protection, and synchrocheck. A VT failure affects the reliability of voltage-based protection and measurement functions.\n\nSiemens relays implement VT supervision using various methods including fuse failure detection, voltage-current consistency checks, and comparison with backup VT sources. When a VT failure is detected, voltage-dependent protection functions may be blocked or modified to maintain security. The relay can be configured to alarm or to switch to alternative protection functions that do not require voltage measurement.',
    ['Voltage reading zero or abnormal', 'VT supervision alarm', 'Distance protection blocked', 'Sync check unavailable'],
    ['VT fuse blown', 'VT secondary wiring fault', 'CVT ferroresonance', 'VT terminal fault', 'VT primary failure'],
    ['Check VT fuses', 'Inspect secondary wiring', 'Verify terminal connections', 'Test VT ratio and burden', 'Check for ferroresonance damping'],
    'Restore VT circuit and reset',
    'critical',
    'Measurement'
  ),

  ...createSiemensCode(
    'M003',
    'Frequency Measurement Out of Range',
    'The measured system frequency is outside the normal operating range, indicating a significant generation-load imbalance or isolation from the main power system. Frequency deviations can damage equipment, affect protection timing, and indicate serious system disturbances. Monitoring frequency provides insight into overall system health and stability.\n\nSiemens relays provide accurate frequency measurement and protection functions (ANSI 81O/U) to respond to frequency excursions. Underfrequency typically indicates generation deficit while overfrequency indicates generation excess. The relay can implement multiple frequency stages for load shedding or generation tripping schemes. Frequency rate-of-change (df/dt) measurement provides early warning of developing disturbances.',
    ['Frequency reading abnormal', 'Frequency alarm active', 'Load shedding potential', 'Generator protection concern'],
    ['Generation-load imbalance', 'Island operation', 'System disturbance', 'Measurement error', 'VT circuit issue'],
    ['Monitor system frequency', 'Prepare load shedding if needed', 'Check generator governor response', 'Verify VT circuit integrity', 'Coordinate with system operator'],
    'Auto-reset when frequency normalizes',
    'warning',
    'Measurement'
  ),

  ...createSiemensCode(
    'M004',
    'Power Factor Abnormal',
    'The measured power factor is outside the expected range, indicating a significant reactive power imbalance. Abnormal power factor can indicate equipment problems, incorrect capacitor bank operation, or unusual load conditions. Maintaining proper power factor is important for efficient power system operation and avoiding utility penalties.\n\nSiemens power metering functions provide accurate power factor measurement for all three phases. The power factor indication can help identify issues such as failed power factor correction capacitors, unusual motor loads, or harmonic distortion affecting the measurement. The relay can alarm on power factor excursions to alert operators to investigate the cause.',
    ['Power factor reading abnormal', 'Reactive power imbalance', 'Capacitor bank status question', 'Energy efficiency concern'],
    ['Capacitor bank failure', 'Motor load change', 'Incorrect VAR compensation', 'Measurement issue', 'Harmonic distortion'],
    ['Check capacitor bank operation', 'Review load conditions', 'Verify measurement connections', 'Analyze harmonic content', 'Adjust VAR compensation'],
    'Reset after investigation',
    'info',
    'Measurement'
  ),

  // ==================== COMMUNICATION FAULTS (C001-C099) ====================
  ...createSiemensCode(
    'C001',
    'IEC 61850 Communication Failure',
    'The IEC 61850 communication link has failed, affecting GOOSE messaging, MMS reporting, and sampled values exchange with other devices. IEC 61850 provides standardized communication for substation automation, and communication failure may impact protection scheme coordination, remote monitoring, and control capabilities.\n\nSiemens SIPROTEC devices fully support IEC 61850 communication including GOOSE for fast protection signaling, MMS for SCADA communication, and sampled values for process bus applications. When IEC 61850 communication fails, the relay continues to provide standalone protection but loses the benefits of coordinated protection schemes and remote visibility. The relay maintains detailed communication statistics and logs that aid in troubleshooting network issues.',
    ['GOOSE messages not received', 'MMS connection lost', 'Remote monitoring unavailable', 'Protection coordination affected'],
    ['Network switch failure', 'Ethernet cable fault', 'IP address conflict', 'VLAN configuration issue', 'Firewall blocking'],
    ['Check Ethernet connections', 'Verify network switch operation', 'Confirm IP addressing', 'Review VLAN configuration', 'Check network traffic with analyzer'],
    'Restore network connectivity',
    'warning',
    'Communication'
  ),

  ...createSiemensCode(
    'C002',
    'DNP3 Communication Timeout',
    'The DNP3 communication link to the master station has timed out, indicating loss of SCADA connectivity. DNP3 provides reliable communication between the relay and the control center for monitoring, control, and event reporting. Communication timeout affects remote visibility and control capabilities.\n\nSiemens devices support DNP3 communication over serial and TCP/IP links. The DNP3 implementation includes authentication options for security. When communication times out, the relay queues events locally until communication is restored. The relay maintains detailed communication statistics including message counts, error rates, and link status information for troubleshooting.',
    ['SCADA communication lost', 'Remote indications stale', 'Control commands rejected', 'Event backlog accumulating'],
    ['Communication link failure', 'Master station offline', 'Serial/network cable fault', 'Configuration mismatch', 'DNP address incorrect'],
    ['Check communication cables', 'Verify master station status', 'Confirm DNP addresses', 'Review port configuration', 'Test with DNP3 analyzer'],
    'Restore communication link',
    'warning',
    'Communication'
  ),

  ...createSiemensCode(
    'C003',
    'Time Synchronization Lost',
    'The external time synchronization source (SNTP, IRIG-B, PTP/IEEE 1588) has been lost. Accurate time is essential for event timestamping, fault recording, and synchronized measurements. Loss of time synchronization affects the accuracy of event sequence recording and may impact time-coordinated protection schemes.\n\nSiemens devices support multiple time synchronization protocols. IRIG-B provides microsecond accuracy over dedicated connections, while SNTP and PTP operate over the Ethernet network. When time sync is lost, the relay continues to maintain time using its internal RTC but accuracy will drift over time. The relay indicates time quality in event records and measurements to flag data recorded without external synchronization.',
    ['Time quality indication degraded', 'Event timestamps questionable', 'Synchrophasor data affected', 'Coordination uncertainty'],
    ['Time server offline', 'IRIG-B signal lost', 'Network connectivity issue', 'Antenna problem for GPS', 'PTP grandmaster failure'],
    ['Check time source availability', 'Verify IRIG-B connections', 'Test network to time server', 'Inspect GPS antenna', 'Configure backup time source'],
    'Restore time synchronization',
    'warning',
    'Communication'
  ),

  ...createSiemensCode(
    'C004',
    'Modbus Communication Error',
    'Modbus communication has encountered errors indicating problems with the serial or TCP link to the master system. Modbus errors may include timeout, CRC errors, exception responses, or connection failures. Communication quality affects the reliability of data exchange with the control system.\n\nSiemens devices support Modbus RTU (serial) and Modbus TCP communication protocols. The Modbus implementation provides access to measurements, status information, and control functions through a mapped register model. Communication errors may indicate wiring problems, configuration mismatches, or interference on serial links. The relay logs communication statistics that help identify the nature and frequency of errors.',
    ['Modbus communication failures', 'Register read errors', 'Control command failures', 'Data update delayed'],
    ['Serial wiring fault', 'RS-485 termination missing', 'Baud rate mismatch', 'Slave address conflict', 'TCP connection timeout'],
    ['Check serial connections', 'Verify RS-485 termination', 'Confirm baud rate and parity', 'Review slave address settings', 'Test with Modbus analyzer'],
    'Correct configuration and restart',
    'warning',
    'Communication'
  ),

  // ==================== HARDWARE FAULTS (H001-H099) ====================
  ...createSiemensCode(
    'H001',
    'Binary Input Module Failure',
    'A binary input module has failed or is not responding to the main processor. Binary inputs provide status information from external contacts including breaker position, disconnector status, and alarm contacts. Loss of binary inputs affects the relay\'s knowledge of external equipment status and may impact protection and control logic.\n\nSiemens modular devices allow configuration of multiple binary input modules for various applications. Each input can be configured for voltage threshold, debounce time, and logical function. Module self-diagnostics detect hardware failures and communication problems. When a module failure is detected, affected inputs should be considered in an unknown state and related automation functions may need manual oversight.',
    ['Binary input readings stuck', 'Module communication error', 'Input status unknown', 'Automation logic affected'],
    ['Module hardware failure', 'Module connector loose', 'Internal bus communication', 'Power supply to module', 'Module software issue'],
    ['Check module seating', 'Verify module power indicator', 'Try replacement module', 'Check internal bus connections', 'Update module firmware'],
    'Replace failed module',
    'warning',
    'Hardware'
  ),

  ...createSiemensCode(
    'H002',
    'Binary Output Relay Failure',
    'A binary output relay has failed verification testing, indicating potential failure to operate when commanded. Binary outputs provide trip and close commands to breakers and other switchgear. Failure of binary outputs compromises the relay\'s ability to clear faults and control equipment.\n\nSiemens relays include output relay supervision functions that verify output operation during commanded state changes. Some devices also support periodic automatic testing of output relays. When an output failure is detected, the affected output should be taken out of service and alternative means of control established. Output relay failures are uncommon but are critical faults requiring immediate attention.',
    ['Output supervision alarm', 'Trip command may fail', 'Control function compromised', 'Output test failed'],
    ['Output relay welded contacts', 'Output relay coil failure', 'Driver circuit fault', 'Wiring overload damage', 'Module failure'],
    ['Verify output operation manually', 'Check output circuit loading', 'Test with reduced load', 'Replace output module', 'Establish backup trip path'],
    'Replace output module or relay',
    'critical',
    'Hardware'
  ),

  ...createSiemensCode(
    'H003',
    'Power Supply Voltage Low',
    'The internal power supply voltage has dropped below acceptable limits. Adequate power supply voltage is essential for reliable relay operation. Low voltage may affect processor operation, output relay holding, and communication interfaces. Severe undervoltage will cause the relay to shut down.\n\nSiemens devices typically accept a wide range of auxiliary power supply voltages (e.g., 24-250V DC, 100-240V AC). Internal monitoring tracks the supply voltage and provides early warning of developing problems. Power supply issues may indicate problems with the station battery, AC supply, or internal power supply module degradation. The relay records minimum and maximum supply voltage values for trend analysis.',
    ['Low voltage alarm', 'System stability concerns', 'Potential shutdown pending', 'Output relay chattering'],
    ['Station battery low', 'AC supply brownout', 'Power supply module degrading', 'Power cable connection', 'Fuse partially blown'],
    ['Check station battery voltage', 'Verify AC supply', 'Inspect power connections', 'Check power supply fuses', 'Replace power supply module'],
    'Restore proper supply voltage',
    'warning',
    'Hardware'
  ),

  ...createSiemensCode(
    'H004',
    'Temperature Alarm High',
    'The internal temperature sensor has detected a high temperature condition. Elevated temperature accelerates component aging, may affect measurement accuracy, and in extreme cases causes equipment failure. The relay is designed to operate within a specified temperature range, and temperatures approaching the limits require attention.\n\nSiemens devices monitor internal temperature and typically specify an operating range of -20°C to +55°C or similar. High temperature may be caused by high ambient temperature, poor ventilation, heavy load on power supply, or internal fault generating heat. The relay reduces the operating temperature by reducing clock speeds or shutting down non-essential functions if temperature becomes critical.',
    ['Temperature alarm active', 'Possible derating required', 'Enclosure ventilation concern', 'Component stress'],
    ['High ambient temperature', 'Enclosure ventilation blocked', 'Heavy processing load', 'Adjacent equipment heat', 'Internal fan failure'],
    ['Improve enclosure ventilation', 'Reduce ambient temperature', 'Check for blocked airflow', 'Verify internal fan operation', 'Move heat-generating equipment'],
    'Reduce temperature and reset',
    'warning',
    'Hardware'
  ),

  ...createSiemensCode(
    'H005',
    'Analog Input Channel Failure',
    'An analog input channel has failed self-test or calibration verification. Analog inputs measure current and voltage signals from CTs and VTs. Failure of an analog input channel affects measurement accuracy and may impact protection functions using that channel.\n\nSiemens relays include self-test functions that verify analog input channel operation by checking internal reference signals and monitoring for drift. When a channel failure is detected, measurements from that channel become unreliable. The relay may substitute values or block functions dependent on the failed channel. Analog input failures may indicate A/D converter problems, input circuit damage from transients, or calibration drift.',
    ['Measurement channel error', 'Values incorrect or zero', 'Protection function affected', 'Self-test failure'],
    ['A/D converter failure', 'Input circuit damage', 'Calibration drift', 'Reference voltage failure', 'Module hardware fault'],
    ['Run diagnostic tests', 'Verify with injection test', 'Check for transient damage', 'Recalibrate if possible', 'Replace module'],
    'Replace or recalibrate affected module',
    'critical',
    'Hardware'
  ),

  // ==================== BREAKER FAULTS (B001-B099) ====================
  ...createSiemensCode(
    'B001',
    'Breaker Failure Protection Initiated',
    'The breaker failure protection (ANSI 50BF) has been initiated due to a breaker failing to clear a fault within the expected time after receiving a trip command. Breaker failure protection provides backup clearing by tripping upstream breakers when the primary breaker fails to operate. This is a critical protection function that prevents prolonged fault exposure.\n\nSiemens breaker failure protection monitors breaker status and current flow after issuing a trip command. If current continues flowing beyond the configured breaker failure time, the relay issues a breaker failure trip to backup breakers. The protection can be configured to use current supervision, breaker position contacts, or both for reliable detection. Breaker failure operation indicates a serious equipment problem requiring immediate investigation.',
    ['Backup breakers tripping', 'Breaker failure relay operated', 'Extended fault duration', 'Primary breaker still closed'],
    ['Breaker mechanism failure', 'Trip coil failure', 'Control circuit problem', 'Breaker stuck', 'Trip circuit supervision failed'],
    ['Do not re-close failed breaker', 'Inspect breaker mechanism', 'Check trip coil resistance', 'Verify control circuit', 'Test with manual trip attempt'],
    'Manual reset after breaker repair',
    'critical',
    'Breaker'
  ),

  ...createSiemensCode(
    'B002',
    'Trip Circuit Supervision Failure',
    'The trip circuit supervision (TCS) function has detected a problem with the breaker trip circuit. TCS continuously monitors the integrity of the trip circuit to ensure it will function when needed. A TCS failure indicates that the trip path may not be able to operate the breaker, compromising protection reliability.\n\nSiemens trip circuit supervision monitors the trip coil and circuit continuity without actually tripping the breaker. This is typically done by passing a small supervision current through the circuit. TCS can detect open circuits (broken wires, blown fuses), short circuits, and trip coil failures. When TCS detects a failure, immediate investigation is required to restore trip capability.',
    ['TCS alarm active', 'Trip path integrity compromised', 'Breaker may not trip', 'Immediate investigation required'],
    ['Trip coil failure', 'Trip circuit wiring fault', 'Trip circuit fuse blown', 'Auxiliary contact failure', 'TCS relay circuit issue'],
    ['Check trip coil resistance', 'Inspect trip circuit wiring', 'Verify trip fuses', 'Test auxiliary contacts', 'Trace circuit for open/short'],
    'Restore trip circuit integrity',
    'critical',
    'Breaker'
  ),

  ...createSiemensCode(
    'B003',
    'Close Circuit Supervision Failure',
    'The close circuit supervision function has detected a problem with the breaker close circuit. Similar to trip circuit supervision, this monitors the integrity of the close path to ensure the breaker can be closed when commanded. A close circuit failure affects the ability to restore service after fault clearing.\n\nBreaker close circuit supervision monitors the close coil and circuit continuity. While less critical than trip circuit supervision, close circuit integrity is important for service restoration and automatic reclosing functions. Close circuit failures should be investigated and repaired to maintain full operational capability.',
    ['Close circuit alarm', 'Breaker cannot be closed', 'Reclosing blocked', 'Service restoration affected'],
    ['Close coil failure', 'Close circuit wiring fault', 'Close circuit fuse blown', 'Motor spring not charged', 'Auxiliary contact failure'],
    ['Check close coil resistance', 'Inspect close circuit wiring', 'Verify close fuses', 'Check spring charge status', 'Test auxiliary contacts'],
    'Restore close circuit integrity',
    'warning',
    'Breaker'
  ),

  ...createSiemensCode(
    'B004',
    'Breaker Wear Counter High',
    'The breaker operation counter has reached a level indicating that maintenance inspection is due. Breakers have a limited number of operations before maintenance is required, especially for fault interruptions which cause more wear than normal operations. High operation count triggers preventive maintenance alerts.\n\nSiemens relays track breaker operations and can distinguish between normal operations and fault interruptions. Fault interruptions are weighted more heavily in wear calculations. The relay can track multiple operation counters (close operations, trip operations, fault interruptions) and alarm at configurable thresholds. Timely maintenance extends breaker life and prevents unexpected failures.',
    ['Maintenance alarm active', 'Operation count high', 'Breaker inspection due', 'Wear limit approaching'],
    ['Normal accumulated operations', 'Frequent fault interruptions', 'Counter threshold too low', 'Incorrect counter settings'],
    ['Schedule breaker maintenance', 'Review fault frequency', 'Inspect breaker contacts', 'Check arc chute condition', 'Reset counter after maintenance'],
    'Perform maintenance and reset counter',
    'info',
    'Breaker'
  ),

  // ==================== GENERATOR FAULTS (G001-G099) ====================
  ...createSiemensCode(
    'G001',
    'Generator Reverse Power',
    'The reverse power protection (ANSI 32R) has detected power flowing from the system into the generator, indicating the generator is operating as a motor. Reverse power operation can damage turbine blades, cause overheating, and indicate a loss of prime mover power. The protection trips the generator breaker to prevent damage.\n\nSiemens generator protection provides reverse power detection with adjustable sensitivity and time delay. The protection measures real power flow direction and magnitude. Reverse power may be caused by loss of fuel, steam valve closure, prime mover failure, or grid disturbance. The time delay allows for momentary power swings while catching sustained reverse power conditions.',
    ['Generator breaker tripped', 'Reverse power alarm', 'Motoring condition detected', 'Prime mover status check'],
    ['Loss of prime mover power', 'Fuel supply interrupted', 'Steam valve closed', 'Governor failure', 'Grid disturbance'],
    ['Check prime mover status', 'Verify fuel supply', 'Inspect governor operation', 'Check for mechanical issues', 'Review trip sequence'],
    'Restore prime mover and reset',
    'critical',
    'Generator'
  ),

  ...createSiemensCode(
    'G002',
    'Loss of Field Detection',
    'The loss of field protection (ANSI 40) has detected that the generator is losing or has lost excitation. Loss of field causes the generator to absorb reactive power from the system, operate as an induction generator, and can lead to rotor overheating and system voltage depression. Prompt action is required to prevent damage.\n\nSiemens loss of field protection uses impedance-based detection with offset and diameter settings that create a characteristic in the R-X plane. When the measured impedance enters the characteristic, the protection operates after a time delay. Modern implementations may include multiple zones and coordination with voltage depression detection. The protection distinguishes between complete loss of field and partial reduction in excitation.',
    ['Generator tripped', 'Loss of field alarm', 'VAR absorption from system', 'Voltage depression'],
    ['Exciter failure', 'Field breaker tripped', 'AVR malfunction', 'Field winding fault', 'Slip ring brush problems'],
    ['Check exciter operation', 'Verify field breaker status', 'Inspect AVR', 'Check field winding resistance', 'Inspect slip rings and brushes'],
    'Restore excitation and reset',
    'critical',
    'Generator'
  ),

  ...createSiemensCode(
    'G003',
    'Generator Overexcitation',
    'The overexcitation protection (ANSI 24) has detected that the generator is being operated at a volts-per-hertz ratio exceeding safe limits. Overexcitation causes core saturation, increased losses, and potential damage to generator and transformer insulation. This condition commonly occurs during startup, shutdown, or load rejection events.\n\nSiemens overexcitation protection monitors the volts-per-hertz ratio and can have multiple stages with inverse or definite time characteristics. The protection limits the thermal stress on iron cores by preventing sustained overexcitation. Coordination with the AVR volts-per-hertz limiter provides coordinated protection. The relay records the V/Hz level and duration for analysis.',
    ['V/Hz alarm or trip', 'Overexcitation detected', 'Core heating concern', 'Voltage/frequency imbalance'],
    ['AVR malfunction', 'Voltage regulator setpoint high', 'Load rejection', 'Frequency depression', 'Manual voltage raise'],
    ['Reduce generator voltage', 'Check AVR operation', 'Verify frequency', 'Review V/Hz limiter settings', 'Check for AVR hunting'],
    'Reduce V/Hz ratio and reset',
    'warning',
    'Generator'
  ),

  ...createSiemensCode(
    'G004',
    'Generator Stator Earth Fault',
    'The stator earth fault protection (ANSI 64G/59N/27TN) has detected a ground fault in the generator stator winding. Stator ground faults can cause significant damage to the generator core if not cleared quickly. The protection may use neutral overvoltage, third harmonic undervoltage, or other methods to detect faults covering up to 100% of the stator winding.\n\nSiemens generator stator earth fault protection can implement multiple methods for comprehensive coverage. Traditional 59N protection covers most of the winding, while 27TN (third harmonic) protection extends coverage to include faults near the neutral. The protection must be coordinated with the generator grounding method. High-impedance grounded generators limit fault current but still require fast fault clearing to prevent core damage.',
    ['Generator tripped', 'Stator earth fault alarm', 'Neutral voltage elevated', 'Core damage risk'],
    ['Stator winding insulation failure', 'End winding fault', 'Bushing failure', 'Connection box fault', 'Moisture in generator'],
    ['Do not re-energize', 'Perform insulation testing', 'Inspect stator visually', 'Check for moisture', 'Test winding thoroughly'],
    'Repair stator and test before restart',
    'critical',
    'Generator'
  ),

  ...createSiemensCode(
    'G005',
    'Generator Negative Sequence Current',
    'The negative sequence current protection (ANSI 46) has detected unbalanced current flow that creates heating in the generator rotor. Negative sequence current causes double-frequency currents in the rotor that can overheat the rotor body and damper windings. The generator has a limited capability to withstand negative sequence current.\n\nSiemens negative sequence protection measures the unbalance and provides both alarm and trip functions based on the I2²t thermal characteristic of the generator. The protection is typically set based on the generator\'s continuous and short-time negative sequence current capability. Causes include unbalanced loads, open phase conditions, and unbalanced system faults.',
    ['Negative sequence alarm or trip', 'Rotor heating concern', 'Unbalanced condition detected', 'Generator capability stress'],
    ['Unbalanced system load', 'Open phase condition', 'CT wiring error', 'Asymmetrical fault', 'Transmission line imbalance'],
    ['Check for unbalanced loads', 'Verify all phases intact', 'Review CT connections', 'Check transmission line', 'Reduce generator load'],
    'Clear unbalance and reset',
    'warning',
    'Generator'
  ),

  // ==================== TRANSFORMER FAULTS (T001-T099) ====================
  ...createSiemensCode(
    'T001',
    'Transformer Differential Trip',
    'The transformer differential protection (ANSI 87T) has operated, indicating an internal fault within the transformer protection zone. Transformer differential protection compares currents entering and leaving the transformer, accounting for ratio differences, vector group, and tap position. A differential trip indicates a serious internal fault requiring immediate investigation.\n\nSiemens transformer differential protection includes sophisticated algorithms for CT ratio matching, vector group compensation, and harmonic restraint for magnetizing inrush. The protection provides high sensitivity for internal faults while maintaining security against external faults and switching transients. Second and fourth harmonic restraint prevents false tripping during energization. Fault records provide valuable information including differential and restraint currents.',
    ['Transformer isolated', 'Differential trip indication', 'All transformer breakers open', 'Lockout active'],
    ['Winding insulation failure', 'Turn-to-turn fault', 'Bushing failure', 'Tap changer fault', 'CT saturation on external fault'],
    ['Do not re-energize', 'Perform dissolved gas analysis', 'Inspect transformer thoroughly', 'Check Buchholz relay status', 'Test windings before re-energizing'],
    'Investigate and repair before reset',
    'critical',
    'Transformer'
  ),

  ...createSiemensCode(
    'T002',
    'Transformer Overcurrent Trip',
    'The transformer overcurrent protection (ANSI 50/51) has operated due to current exceeding the configured threshold for the configured time. Transformer overcurrent protection provides backup protection for transformer and downstream faults. The protection may indicate transformer overload, downstream fault, or through-fault condition.\n\nSiemens transformer overcurrent protection can be implemented with multiple stages having different time characteristics. Coordination with downstream protection ensures selective fault clearing. The relay records the fault current magnitude and trip time for analysis. Frequent overcurrent trips may indicate protection coordination issues or changing load patterns.',
    ['Transformer de-energized', 'Overcurrent trip indication', 'Backup protection operated', 'Downstream fault possible'],
    ['Downstream fault', 'Transformer overload', 'Protection coordination issue', 'Cold load pickup', 'Setting too sensitive'],
    ['Identify fault location', 'Check downstream equipment', 'Review transformer loading', 'Verify protection coordination', 'Check for cold load inrush'],
    'Clear fault and reset',
    'warning',
    'Transformer'
  ),

  ...createSiemensCode(
    'T003',
    'Transformer Oil Temperature High',
    'The oil temperature has exceeded the alarm threshold, indicating the transformer is operating at elevated temperature. High oil temperature accelerates insulation aging and may indicate overload, cooling system problems, or internal fault. Continued operation at high temperature reduces transformer life.\n\nSiemens relay can receive transformer temperature information from RTD inputs or through communication protocols. Multiple temperature thresholds can be configured for alarm, fan start, and trip functions. Temperature monitoring helps optimize transformer loading while protecting against thermal damage. Trend analysis of temperature data reveals developing problems.',
    ['Temperature alarm active', 'Cooling status concern', 'Load reduction recommended', 'Insulation aging accelerated'],
    ['Transformer overloaded', 'Ambient temperature high', 'Cooling fans failed', 'Oil circulation blocked', 'Internal fault heating'],
    ['Reduce transformer load', 'Check cooling system operation', 'Verify fan and pump status', 'Check ambient temperature', 'Inspect for internal fault signs'],
    'Reduce load and restore cooling',
    'warning',
    'Transformer'
  ),

  ...createSiemensCode(
    'T004',
    'Transformer Winding Temperature High',
    'The calculated or measured winding temperature has exceeded safe limits. Winding hot spot temperature is the ultimate limit for transformer loading. Exceeding the winding temperature limit risks insulation damage and reduced transformer life. Immediate load reduction is typically required.\n\nWinding temperature may be directly measured by fiber optic sensors or calculated from oil temperature plus a thermal model increment. The hot spot temperature is the highest temperature in the winding and determines the maximum allowable loading. Emergency overload ratings permit short-term elevated temperatures at the expense of accelerated aging.',
    ['Winding temperature critical', 'Immediate action required', 'Insulation damage risk', 'Load reduction mandatory'],
    ['Severe overload', 'Cooling system failure', 'Ambient temperature extreme', 'Internal fault', 'Blocked cooling ducts'],
    ['Reduce load immediately', 'Maximize cooling system', 'Check all fans and pumps', 'Prepare to de-energize if needed', 'Investigate cause'],
    'Reduce temperature to safe level',
    'critical',
    'Transformer'
  ),

  ...createSiemensCode(
    'T005',
    'Buchholz Relay Alarm',
    'The Buchholz relay has generated a gas accumulation alarm, indicating gases are being generated within the transformer. Gas accumulation typically indicates developing internal faults such as overheating, partial discharge, or arcing. The alarm should be investigated by gas analysis to determine the nature and severity of the problem.\n\nThe Buchholz relay is a mechanical device installed in the pipe between the transformer tank and conservator. It detects gas accumulation (slow-developing faults) and sudden oil movement (major faults). Gas accumulation triggers an alarm while sudden oil movement triggers a trip. Dissolved gas analysis of the accumulated gas provides diagnostic information about the type of fault developing.',
    ['Gas accumulation alarm', 'Potential developing fault', 'DGA recommended', 'Monitor closely'],
    ['Overheating developing', 'Partial discharge activity', 'Low-energy arcing', 'Normal gassing of new oil', 'Air ingress'],
    ['Sample gas for analysis', 'Perform dissolved gas analysis', 'Review recent loading', 'Check for overheating signs', 'Monitor and trend'],
    'Investigate through gas analysis',
    'warning',
    'Transformer'
  )
];

export function getSiemensFaultCodes(): ControllerFaultCode[] {
  return SIEMENS_FAULT_CODES as ControllerFaultCode[];
}
