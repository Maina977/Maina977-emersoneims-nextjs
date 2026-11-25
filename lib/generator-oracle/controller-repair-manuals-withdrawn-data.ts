/**
 * WITHDRAWN DATA (safety withdrawal, management rule, 2026-11-25; review findings S8 and R3).
 *
 * The Repair Manuals "Repair Procedures" and "Fault Codes" (Common Faults) data, moved
 * unchanged out of controller-repair-manuals.ts so it is no longer in the Repair Manuals
 * client chunk. No shutdown alarm started with STOP or do-not-restart; reset steps included
 * "Test run", "Start engine" and "Test at rated speed"; figures had no OEM source.
 * NOTHING MAY IMPORT THIS FILE until the data is corrected and independently re-verified.
 * tests/regression/oracle-safety-withdrawal-2026-11-25.test.ts enforces that.
 */
import type { CommonFault, RepairProcedure } from './controller-repair-manuals';

export const WITHDRAWN_REPAIR_MANUAL_DATA: Record<string, { repairProcedures: RepairProcedure[]; commonFaults: CommonFault[] }> = {
  "dse": {
    repairProcedures: [
    {
      id: 'dse-display-fail',
      title: 'Display Not Working',
      symptom: 'LCD display blank or partially illuminated',
      possibleCauses: ['Low battery voltage', 'Display flex cable loose', 'LCD module failure', 'Backlight failure'],
      diagnosticSteps: [
        'Measure battery voltage at controller terminals (should be 8-35V DC)',
        'Check for corrosion on display connector',
        'Press buttons to check if backlight toggles',
        'Connect via USB to verify controller is running',
      ],
      repairSteps: [
        'If battery voltage low, charge or replace battery',
        'Clean display connector with contact cleaner',
        'Reseat display flex cable (remove 4 screws, disconnect, reconnect)',
        'If display module failed, replace complete display assembly',
      ],
      testProcedure: [
        'Apply power and verify display illuminates within 2 seconds',
        'Check all display segments activate during self-test',
        'Verify touchscreen response (if applicable)',
        'Confirm readings match connected sensors',
      ],
      estimatedTime: '30-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Display assembly (if replacing)', 'Contact cleaner'],
      specialTools: ['Torx T10 screwdriver', 'ESD wrist strap'],
      safetyPrecautions: ['Disconnect battery before repair', 'Use ESD protection', 'Do not flex LCD panel'],
    },
    {
      id: 'dse-no-start',
      title: 'Engine Cranks But Does Not Start',
      symptom: 'Starter motor engages but engine fails to start',
      possibleCauses: ['No fuel', 'Fuel solenoid not energizing', 'Speed sensing failure', 'Wrong MPU configuration'],
      diagnosticSteps: [
        'Check fuel solenoid output (G2) - should be +DC when cranking',
        'Verify MPU signal on display (should show RPM during cranking)',
        'Check fuel level sender reading',
        'Inspect fuel solenoid wiring',
      ],
      repairSteps: [
        'If no fuel output: Check relay configuration in DSE Suite',
        'If no MPU signal: Check MPU wiring and air gap (0.5-1.0mm)',
        'Test fuel solenoid manually with direct +12V',
        'Reconfigure MPU settings (pulses per revolution)',
      ],
      testProcedure: [
        'Attempt start - verify fuel solenoid pulls in',
        'Monitor RPM signal during cranking (should be 100-300 RPM)',
        'Verify engine starts and runs smoothly',
        'Check for any alarm codes after start',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Fuel solenoid (if failed)', 'MPU sensor (if failed)'],
      specialTools: ['Multimeter', 'Feeler gauges', 'DSE Configuration Suite'],
      safetyPrecautions: ['Keep clear of moving parts', 'Ensure fuel shutoff available', 'Fire extinguisher nearby'],
    },
    {
      id: 'dse-comms-fail',
      title: 'Communication Failure',
      symptom: 'Cannot connect via RS485/Ethernet/USB',
      possibleCauses: ['Wrong baud rate', 'Incorrect Modbus address', 'Cable fault', 'Port damage', 'Protocol mismatch'],
      diagnosticSteps: [
        'Check cable continuity with multimeter',
        'Verify RS485 A/B polarity (swap if needed)',
        'Check Modbus address setting (default 1)',
        'Verify baud rate (default 19200)',
        'Test with different cable',
      ],
      repairSteps: [
        'Correct cable wiring per pinout diagram',
        'Set matching baud rate on both ends',
        'Add 120Ω termination resistor on RS485 if end of line',
        'Update firmware if protocol version mismatch',
        'Replace communication module if port damaged',
      ],
      testProcedure: [
        'Connect with DSE Configuration Suite and verify communication',
        'Read/write a parameter to confirm bidirectional communication',
        'Monitor for communication errors over 10-minute period',
        'Verify all connected devices see controller on network',
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['RS485 cable', '120Ω termination resistor'],
      specialTools: ['Multimeter', 'RS485 protocol analyzer (optional)'],
      safetyPrecautions: ['Disconnect power before changing wiring'],
    },
  ],
    commonFaults: [
    {
      code: 'DSE-001',
      title: 'Emergency Stop',
      description: 'Emergency stop button activated or wiring fault',
      severity: 'shutdown',
      causes: ['E-stop button pressed', 'E-stop wiring open circuit', 'E-stop input configured incorrectly'],
      solutions: ['Release E-stop button and reset', 'Check E-stop wiring continuity', 'Verify input configuration'],
      resetProcedure: ['Clear fault on controller', 'Reset E-stop button', 'Press Reset on controller front panel'],
    },
    {
      code: 'DSE-002',
      title: 'Low Oil Pressure',
      description: 'Engine oil pressure below safety threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault', 'Oil leak', 'Wrong oil viscosity'],
      solutions: ['Check and top up oil', 'Replace oil pump', 'Test/replace sender', 'Find and fix leak', 'Use correct oil grade'],
      resetProcedure: ['Fix root cause', 'Clear alarm', 'Test run and monitor pressure'],
    },
    {
      code: 'DSE-003',
      title: 'High Engine Temperature',
      description: 'Coolant temperature exceeded safety limit',
      severity: 'shutdown',
      causes: ['Low coolant', 'Radiator blocked', 'Fan failure', 'Thermostat stuck', 'Water pump failure'],
      solutions: ['Top up coolant', 'Clean radiator fins', 'Repair/replace fan', 'Replace thermostat', 'Replace water pump'],
      resetProcedure: ['Allow engine to cool', 'Fix cooling issue', 'Clear alarm and test'],
    },
    {
      code: 'DSE-004',
      title: 'Over Speed',
      description: 'Engine speed exceeded maximum safe limit',
      severity: 'shutdown',
      causes: ['Governor failure', 'Actuator fault', 'Fuel rack stuck', 'Load rejection', 'Speed sensor fault'],
      solutions: ['Check governor operation', 'Test actuator', 'Free fuel rack', 'Check load circuit', 'Calibrate speed sensor'],
      resetProcedure: ['Investigate cause before reset', 'Clear alarm', 'Start with no load'],
    },
  ],
  },
  "comap": {
    repairProcedures: [
    {
      id: 'comap-pcb-replace',
      title: 'Main PCB Replacement',
      symptom: 'Multiple faults, erratic behavior, or no power',
      possibleCauses: ['Lightning damage', 'Overvoltage', 'Moisture ingress', 'Component failure'],
      diagnosticSteps: [
        'Visual inspection for burnt components',
        'Check for moisture damage',
        'Verify power supply voltages',
        'Test with known good controller',
      ],
      repairSteps: [
        'Remove all wiring connections (label first)',
        'Unscrew mounting bolts',
        'Remove old controller',
        'Install new controller',
        'Reconnect all wiring',
        'Upload saved configuration',
      ],
      testProcedure: [
        'Power up and verify display operation',
        'Check all inputs reading correctly',
        'Test all outputs with lamp test',
        'Perform start/stop test',
        'Verify communication links',
      ],
      estimatedTime: '2-4 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement controller', 'Cable ties'],
      specialTools: ['InteliConfig software', 'USB cable', 'Digital camera for wiring photos'],
      safetyPrecautions: ['Disconnect battery', 'Label all wires', 'Backup configuration before replacement'],
    },
  ],
    commonFaults: [
    {
      code: 'SdBin1',
      title: 'Binary Input 1 Shutdown',
      description: 'Shutdown triggered by binary input 1 (typically emergency stop)',
      severity: 'shutdown',
      causes: ['E-stop activated', 'Wire break', 'Wrong input polarity configured'],
      solutions: ['Check E-stop position', 'Test wire continuity', 'Verify input polarity setting'],
      resetProcedure: ['Clear fault condition', 'Press RESET button', 'Check for recurring fault'],
    },
  ],
  },
  "woodward": {
    repairProcedures: [
    {
      id: 'woodward-speed-fault',
      title: 'Speed Signal Loss',
      symptom: 'Engine fails to synchronize or shows 0 RPM',
      possibleCauses: ['MPU air gap incorrect', 'MPU failure', 'Cable damage', 'Speed input fault'],
      diagnosticSteps: [
        'Check MPU signal with oscilloscope (should be 1-5Vpp)',
        'Verify MPU air gap (0.5-1.0mm typical)',
        'Test cable continuity',
        'Check input configuration',
      ],
      repairSteps: [
        'Adjust MPU air gap if incorrect',
        'Replace MPU if no signal',
        'Repair/replace cable if damaged',
        'Reconfigure speed input parameters',
      ],
      testProcedure: [
        'Crank engine and verify RPM display',
        'Run at rated speed and check stability',
        'Verify synchronization capability',
      ],
      estimatedTime: '1-3 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['MPU sensor if required'],
      specialTools: ['Oscilloscope', 'Feeler gauges'],
      safetyPrecautions: ['Engine must be stopped for MPU adjustment'],
    },
  ],
    commonFaults: [
    {
      code: 'E01',
      title: 'Emergency Stop',
      description: 'Emergency stop activated',
      severity: 'shutdown',
      causes: ['E-stop pressed', 'Wiring fault'],
      solutions: ['Reset E-stop', 'Check wiring'],
      resetProcedure: ['Release E-stop', 'Press Reset'],
    },
  ],
  },
  "smartgen": {
    repairProcedures: [
    {
      id: 'smartgen-button-fail',
      title: 'Button Not Responding',
      symptom: 'Front panel buttons do not work',
      possibleCauses: ['Membrane switch worn', 'Flex cable loose', 'PCB fault'],
      diagnosticSteps: ['Check if any buttons work', 'Inspect flex cable connection'],
      repairSteps: ['Reseat flex cable', 'Replace membrane keypad if worn', 'Replace controller if PCB fault'],
      testProcedure: ['Test all buttons', 'Verify functions'],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Membrane keypad if replacing'],
      specialTools: ['Small screwdriver'],
      safetyPrecautions: ['Disconnect power'],
    },
  ],
    commonFaults: [
    {
      code: 'AL01',
      title: 'Low Oil Pressure',
      description: 'Oil pressure below threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Sender fault', 'Oil pump failure'],
      solutions: ['Check oil level', 'Test sender', 'Check pump'],
      resetProcedure: ['Fix cause', 'Reset alarm'],
    },
  ],
  },
  "powerwizard": {
    repairProcedures: [
    {
      id: 'pw-ecm-comm',
      title: 'ECM Communication Fault',
      symptom: 'Controller cannot communicate with engine ECM',
      possibleCauses: ['CAN wiring fault', 'ECM failure', 'Controller fault'],
      diagnosticSteps: [
        'Check CAN wiring continuity',
        'Verify CAN termination resistors',
        'Check ECM diagnostic codes',
      ],
      repairSteps: [
        'Repair CAN wiring if faulty',
        'Add/remove termination resistors as needed',
        'Reset controller and ECM',
      ],
      testProcedure: ['Verify ECM data appears on controller', 'Test start/stop functions'],
      estimatedTime: '1-3 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['CAN cable', '120Ω resistor'],
      specialTools: ['Cat ET software', 'CAN analyzer'],
      safetyPrecautions: ['Only Cat-trained technicians'],
    },
  ],
    commonFaults: [
    {
      code: 'E360',
      title: 'Low Oil Pressure',
      description: 'Engine oil pressure below threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault'],
      solutions: ['Check oil', 'Check pump', 'Test sender'],
      resetProcedure: ['Fix cause', 'Clear with Cat ET'],
    },
  ],
  },
  "datakom": {
    repairProcedures: [
    {
      id: 'datakom-keypad-stuck',
      title: 'Keypad Buttons Stuck or Not Responding',
      symptom: 'One or more front panel buttons are stuck, unresponsive, or require excessive pressure',
      possibleCauses: [
        'Membrane keypad wear after years of use',
        'Moisture ingress causing corrosion under membrane',
        'Flex cable connector loose or oxidized',
        'Debris or contamination under rubber membrane',
        'Static discharge damage to keypad matrix circuit',
        'PCB trace damage under button contacts'
      ],
      diagnosticSteps: [
        'Power off controller and disconnect battery supply',
        'Remove front panel screws (usually 4x M3 Phillips)',
        'Carefully separate front panel from main enclosure',
        'Inspect membrane keypad for visible damage, bubbles, or contamination',
        'Check flex cable connection for corrosion or loose pins',
        'Use multimeter in continuity mode to test button matrix',
        'Each button should show open circuit when released, short when pressed',
        'Check PCB traces under membrane for corrosion or damage',
        'Test button response in Rainbow software diagnostic mode'
      ],
      repairSteps: [
        'Clean membrane underside with isopropyl alcohol (99%)',
        'Clean PCB button contacts with electronics cleaner spray',
        'If flex cable oxidized, clean contacts with pencil eraser then IPA',
        'Re-seat flex cable connector firmly ensuring all pins aligned',
        'For stuck buttons, carefully flex membrane to free mechanism',
        'If membrane damaged, order replacement membrane keypad assembly',
        'Apply thin layer of silicone grease to rubber button guides',
        'Reassemble ensuring gasket seals properly',
        'Test all buttons before final assembly'
      ],
      testProcedure: [
        'Enter Rainbow software diagnostic mode',
        'Press each button and verify response on screen',
        'Test button combinations (Start+Stop, etc.)',
        'Verify display shows correct button presses',
        'Test button response time - should be immediate',
        'Check for ghost presses (buttons triggering without pressing)'
      ],
      estimatedTime: '45-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Membrane keypad assembly (if damaged)', 'Silicone grease', 'Replacement gasket'],
      specialTools: ['Phillips screwdriver set', 'Plastic spudger', 'Isopropyl alcohol 99%', 'Electronics contact cleaner', 'ESD wrist strap'],
      safetyPrecautions: ['Disconnect ALL power before opening', 'Use ESD protection - static can damage electronics', 'Do not force membrane - it tears easily', 'Keep moisture away from open controller']
    },
    {
      id: 'datakom-display-failure',
      title: 'LCD Display Blank, Dim, or Showing Artifacts',
      symptom: 'Display shows no content, partial content, strange characters, or very dim backlight',
      possibleCauses: [
        'Backlight LED failure (common after 50,000+ hours)',
        'LCD ribbon cable loose or damaged',
        'LCD controller IC failure on display module',
        'Main PCB display driver circuit fault',
        'Power supply 5V rail failure or low voltage',
        'Extreme temperature damage to LCD fluid',
        'Static discharge damage to LCD controller'
      ],
      diagnosticSteps: [
        'Check if backlight glows at all - shine flashlight at angle to see faint text',
        'Measure 5V supply at LCD connector (should be 4.9-5.1V)',
        'Check contrast setting in configuration - may be set too low',
        'Inspect LCD ribbon cable for cracks, especially at fold points',
        'Check for corrosion at LCD connector pins',
        'Test with known-good display module if available',
        'Check display in Rainbow software - data should update even if LCD dead',
        'Measure display contrast control voltage (typically 0-5V variable)'
      ],
      repairSteps: [
        'If backlight only: LED backlight strip can be replaced separately',
        'Clean LCD connector with electronics cleaner',
        'Re-seat ribbon cable, ensure latching mechanism engaged',
        'If ribbon damaged, replace entire LCD module',
        'Check and re-solder any cold joints on display connector',
        'Replace LCD contrast trimmer pot if erratic',
        'For LCD module replacement: transfer any configuration first',
        'Adjust contrast after replacement for optimal viewing angle',
        'Calibrate brightness for installation environment'
      ],
      testProcedure: [
        'Power on and observe boot sequence on display',
        'Check all display segments illuminate during self-test',
        'Navigate through all menu screens',
        'Test display at viewing angles (should be readable ±30°)',
        'Check display updates in real-time with parameter changes',
        'Test contrast across temperature range if possible'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['LCD display module', 'LCD ribbon cable', 'LED backlight strip', 'Contrast potentiometer'],
      specialTools: ['Fine-tip soldering iron', 'Hot air rework station (for SMD)', 'Multimeter', 'Oscilloscope (for advanced diagnosis)'],
      safetyPrecautions: ['Handle LCD carefully - glass breaks easily', 'Do not touch LCD surface with bare fingers', 'Keep polarizer protected from scratches', 'Avoid excessive heat on LCD - damages liquid crystal']
    },
    {
      id: 'datakom-pcb-power-circuit',
      title: 'Controller Power Circuit Failure - No Power or Intermittent',
      symptom: 'Controller does not power on, powers intermittently, or resets randomly',
      possibleCauses: [
        'Input protection diode failed (reverse polarity damage)',
        'Main fuse or PTC thermistor open',
        'DC-DC converter IC failed',
        'Electrolytic capacitors dried out or bulging',
        'Voltage regulator IC overheated or failed',
        'Input power connector corroded or loose',
        'PCB trace burned due to overcurrent',
        'ESD damage to power management IC'
      ],
      diagnosticSteps: [
        'Measure input voltage at controller terminals (should be 8-35V DC)',
        'Check input fuse/PTC continuity',
        'Verify reverse polarity protection diode is not shorted',
        'Measure voltage after input protection circuit',
        'Check 5V and 3.3V regulated supply rails',
        'Look for bulging or leaking electrolytic capacitors',
        'Feel for excessively hot components (careful - may be hot)',
        'Check for burned PCB traces near power input',
        'Measure current draw - no load should be 50-150mA typical',
        'Listen for high-pitched whine indicating switching regulator issues'
      ],
      repairSteps: [
        'Replace any visibly damaged components (burned, bulging)',
        'Replace all electrolytic capacitors over 5 years old',
        'If input diode shorted, replace with appropriate rated Schottky',
        'For regulator IC failure, replace with exact part number',
        'Repair burned traces with jumper wire of appropriate gauge',
        'Clean and re-tin all power connector pins',
        'Apply conformal coating to prevent future corrosion',
        'Add transient suppression if source is electrically noisy',
        'Test power consumption after repair'
      ],
      testProcedure: [
        'Connect to variable power supply with current limiting',
        'Slowly increase voltage from 0V monitoring current',
        'Normal startup current briefly spikes then settles to 50-150mA',
        'Test full operating voltage range (8V to 35V)',
        'Run for extended period monitoring for overheating',
        'Test power cycling - should start reliably every time',
        'Verify watchdog timer functions correctly'
      ],
      estimatedTime: '60-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Electrolytic capacitor kit', 'Schottky diodes', 'Voltage regulator ICs', 'PTC fuses'],
      specialTools: ['Digital oscilloscope', 'ESR meter for capacitors', 'SMD soldering station', 'Thermal camera or IR thermometer', 'Current-limited power supply'],
      safetyPrecautions: ['Capacitors may hold charge - discharge before working', 'Failed switching regulators can be VERY hot', 'Verify polarity before reconnecting power', 'Do not exceed voltage ratings during testing']
    },
    {
      id: 'datakom-communication-port',
      title: 'RS485/RS232/USB Communication Port Not Working',
      symptom: 'Cannot connect to controller via communication ports, intermittent connection, garbled data',
      possibleCauses: [
        'ESD damage to RS485/RS232 transceiver IC',
        'Incorrect baud rate or protocol settings',
        'Cable pinout incorrect or cable damaged',
        'Termination resistor missing or wrong value',
        'Ground loop issues causing noise',
        'USB interface IC failure',
        'Protocol converter fault (if using RS485-USB adapter)'
      ],
      diagnosticSteps: [
        'Verify communication settings match between devices',
        'Test with short cable first to eliminate cable issues',
        'Check RS485 A/B line voltage (idle should be 200mV-5V differential)',
        'Use oscilloscope to view waveforms during communication attempt',
        'Test RS485 transceiver IC with multimeter (pin voltages)',
        'Verify USB device enumerates in computer device manager',
        'Try different USB cable and port',
        'Test loopback by shorting TX to RX'
      ],
      repairSteps: [
        'Replace damaged transceiver IC (common: MAX485, SP485)',
        'Check and replace TVS protection diodes on comm lines',
        'Clean communication port connector pins',
        'Verify termination: 120Ω between A and B for long runs',
        'Install proper grounding to prevent ground loops',
        'For USB, replace USB interface IC if device not enumerating',
        'Update USB drivers on computer',
        'Re-flash controller firmware if communication protocol corrupted'
      ],
      testProcedure: [
        'Connect communication cable',
        'Open Rainbow software and attempt connection',
        'Verify real-time data updates properly',
        'Test configuration read/write',
        'Test event log download',
        'Verify Modbus register access if used for SCADA',
        'Test at maximum cable length specified'
      ],
      estimatedTime: '30-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['RS485 transceiver IC', 'TVS diodes', 'USB interface IC', '120Ω termination resistor'],
      specialTools: ['Oscilloscope', 'Protocol analyzer (optional)', 'USB cable tester', 'RS485 breakout board'],
      safetyPrecautions: ['ESD protection essential when handling ICs', 'Disconnect power before component replacement', 'Verify correct IC orientation before soldering']
    },
    {
      id: 'datakom-relay-failure',
      title: 'Output Relay Stuck On, Stuck Off, or Chattering',
      symptom: 'Relay outputs not activating, staying on permanently, or chattering rapidly',
      possibleCauses: [
        'Relay coil open circuit',
        'Relay contacts welded closed (overcurrent)',
        'Relay contacts pitted or burned (arc damage)',
        'Relay driver transistor failed',
        'Flyback diode failed allowing voltage spikes',
        'Relay socket contact corrosion',
        'Power supply to relay circuit failed',
        'Control logic output stuck (firmware issue)'
      ],
      diagnosticSteps: [
        'Listen for relay click when output should activate',
        'Measure relay coil voltage when activated (should match relay rating)',
        'Check relay coil resistance (typically 150-500Ω)',
        'Measure relay contact continuity when activated',
        'Check if relay removable - test on bench with external voltage',
        'Verify driver transistor switches properly',
        'Check flyback diode is not shorted',
        'Test in Rainbow software manual output mode'
      ],
      repairSteps: [
        'If relay removable, replace with same type and rating',
        'For PCB-mounted relays, desolder and replace',
        'Replace failed driver transistor',
        'Replace damaged flyback diode',
        'Clean relay socket contacts if applicable',
        'Upgrade relay contact rating if loads are heavy',
        'Install external relay module for high-current loads',
        'Add arc suppression across contacts for inductive loads'
      ],
      testProcedure: [
        'Use Rainbow software to toggle each output',
        'Listen for distinct click from each relay',
        'Measure contact closure with multimeter',
        'Test with actual load connected',
        'Verify timing is correct for start/stop sequences',
        'Run multiple on/off cycles to verify reliability'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement relay (match exactly)', 'Driver transistors', 'Flyback diodes', 'Relay socket'],
      specialTools: ['Soldering station', 'Desoldering pump/wick', 'Relay tester', 'Inrush current clamp'],
      safetyPrecautions: ['Relay contacts may carry dangerous voltages', 'Disconnect load circuits before testing', 'Verify relay ratings match application', 'Watch for back-EMF from inductive loads']
    }
  ],
    commonFaults: [
    {
      code: 'F01',
      title: 'Low Fuel Level',
      description: 'Fuel level below warning threshold',
      severity: 'warning',
      causes: ['Low fuel', 'Sender fault'],
      solutions: ['Refuel', 'Check sender'],
      resetProcedure: ['Auto-clears when fuel level rises'],
    },
    {
      code: 'F02',
      title: 'Low Oil Pressure',
      description: 'Oil pressure below safety threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault', 'Wiring issue'],
      solutions: ['Check oil level', 'Inspect oil pump', 'Test sender', 'Check wiring'],
      resetProcedure: ['Clear alarm after correcting issue', 'Press RESET button'],
    },
    {
      code: 'F03',
      title: 'High Coolant Temperature',
      description: 'Engine temperature exceeded safe limit',
      severity: 'shutdown',
      causes: ['Low coolant', 'Radiator blocked', 'Fan failure', 'Thermostat stuck', 'Water pump failure'],
      solutions: ['Check coolant level', 'Clean radiator', 'Test fan operation', 'Replace thermostat'],
      resetProcedure: ['Allow engine to cool', 'Fix root cause', 'Reset controller'],
    }
  ],
  },
  "lovato": {
    repairProcedures: [
    {
      id: 'lovato-touchscreen-calibration',
      title: 'Touchscreen Not Responding or Miscalibrated',
      symptom: 'Touch inputs not registering, wrong location detection, or erratic touch behavior',
      possibleCauses: [
        'Touchscreen needs recalibration after firmware update',
        'Resistive touch layer degradation',
        'Flex cable connector loose',
        'Moisture under touchscreen surface',
        'ESD damage to touch controller IC',
        'Screen protector interfering with touch'
      ],
      diagnosticSteps: [
        'Access touchscreen calibration menu (hold corner 10 seconds on boot)',
        'Check if touch works in some areas but not others',
        'Inspect screen surface for damage or contamination',
        'Remove any screen protector and test',
        'Check flex cable connection inside unit',
        'Test with stylus vs finger - resistive screens respond to pressure'
      ],
      repairSteps: [
        'Run touchscreen calibration routine from service menu',
        'Touch all four corners and center when prompted',
        'Clean screen with electronics-safe glass cleaner',
        'If calibration fails, re-seat touch panel flex cable',
        'Replace touchscreen assembly if digitizer damaged',
        'Apply Lovato-approved screen protector only',
        'Update firmware to latest version after replacement'
      ],
      testProcedure: [
        'Test touch response in all four corners',
        'Draw diagonal lines across screen - should be smooth',
        'Test all menu buttons respond correctly',
        'Verify touch works with wet fingers (RGK800/900)',
        'Test touch accuracy on small UI elements'
      ],
      estimatedTime: '15-45 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Touchscreen assembly (if damaged)', 'Screen protector'],
      specialTools: ['Plastic spudger', 'Microfiber cloth', 'IPA cleaner'],
      safetyPrecautions: ['Power off before opening', 'Do not press hard on LCD', 'Handle flex cables gently']
    },
    {
      id: 'lovato-input-circuit-failure',
      title: 'Analog/Digital Input Not Reading Correctly',
      symptom: 'Sensor readings incorrect, input stuck high/low, or intermittent input failures',
      possibleCauses: [
        'Input protection TVS diode shorted',
        'Input resistor divider network damage',
        'ADC reference voltage drift',
        'Input connector corrosion',
        'Sensor wiring fault',
        'Input multiplexer IC failure',
        'Ground loop interference'
      ],
      diagnosticSteps: [
        'Disconnect sensor and measure input voltage directly',
        'Check input impedance matches specification',
        'Verify input scaling configuration in Synergy',
        'Measure reference voltages on PCB',
        'Test with calibrated signal source',
        'Check for cross-talk between adjacent inputs',
        'Verify ground connections are solid'
      ],
      repairSteps: [
        'Replace shorted protection components',
        'Clean input connectors with contact cleaner',
        'Re-calibrate input using Synergy software',
        'Replace input conditioning circuitry if damaged',
        'Verify and correct wiring if needed',
        'Install proper shielding for sensitive inputs',
        'Add filtering capacitors if noise issues persist'
      ],
      testProcedure: [
        'Apply known voltage/resistance and verify reading',
        'Test full scale range of input',
        'Check linearity with multiple test points',
        'Verify alarm setpoints trigger correctly',
        'Test with actual sensor connected'
      ],
      estimatedTime: '45-90 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['TVS diodes', 'Precision resistors', 'Filter capacitors'],
      specialTools: ['Calibrated multimeter', 'Signal generator', 'Oscilloscope', 'Synergy software'],
      safetyPrecautions: ['Disconnect external sensors before testing', 'Use ESD protection', 'Verify input voltage limits']
    },
    {
      id: 'lovato-memory-corruption',
      title: 'Configuration Lost or Corrupted After Power Cycle',
      symptom: 'Settings reset to defaults, event log cleared, or random configuration changes',
      possibleCauses: [
        'EEPROM/Flash memory wear-out',
        'Battery backup failed (RTC battery)',
        'Power supply brownout during save',
        'Firmware corruption',
        'EMI interference during write operations',
        'Memory IC failure'
      ],
      diagnosticSteps: [
        'Check RTC battery voltage (should be 3.0V)',
        'Read/compare configuration multiple times',
        'Check event log for power interruption records',
        'Verify power supply stability with oscilloscope',
        'Test by making small change and power cycling',
        'Check for EMI sources near controller'
      ],
      repairSteps: [
        'Replace RTC battery (CR2032 typical)',
        'Export configuration backup before any work',
        'Re-flash firmware if corruption suspected',
        'Factory reset and reconfigure if persistent',
        'Install UPS or power conditioning if supply unstable',
        'Replace controller if memory IC failed',
        'Move away from EMI sources'
      ],
      testProcedure: [
        'Make configuration change and save',
        'Power cycle multiple times',
        'Verify settings retained each time',
        'Check RTC maintains time after power off',
        'Test event log storage and retrieval'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['CR2032 battery', 'Backup configuration file'],
      specialTools: ['Synergy software', 'Oscilloscope', 'Battery tester'],
      safetyPrecautions: ['Back up configuration before any work', 'Use quality replacement batteries', 'Allow capacitors to discharge before battery replacement']
    }
  ],
    commonFaults: [
    { code: 'A001', title: 'Low Oil Pressure', description: 'Oil pressure below setpoint', severity: 'shutdown', causes: ['Low oil', 'Sensor fault', 'Engine damage'], solutions: ['Check oil level', 'Replace sensor', 'Inspect engine'], resetProcedure: ['Fix issue', 'Press RESET'] },
    { code: 'A002', title: 'High Temperature', description: 'Coolant temperature too high', severity: 'shutdown', causes: ['Low coolant', 'Fan fault', 'Blocked radiator'], solutions: ['Add coolant', 'Fix fan', 'Clean radiator'], resetProcedure: ['Cool engine', 'Press RESET'] },
    { code: 'A003', title: 'Over Speed', description: 'Engine RPM exceeded limit', severity: 'shutdown', causes: ['Governor fault', 'Load rejection'], solutions: ['Check governor', 'Verify fuel system'], resetProcedure: ['Press RESET'] }
  ],
  },
  "siemens": {
    repairProcedures: [
    {
      id: 'siemens-ethernet-port-failure',
      title: 'Profinet/Ethernet Communication Port Not Working',
      symptom: 'No network connection, link LED off, SCADA communication lost, or intermittent drops',
      possibleCauses: [
        'RJ45 port physical damage',
        'Ethernet PHY chip failure',
        'Network isolation transformer damage from lightning',
        'Incorrect IP configuration',
        'Network switch port failure',
        'Cable fault or wrong cable type',
        'EMI interference on network cable'
      ],
      diagnosticSteps: [
        'Check link LED status on both controller and switch',
        'Try different Ethernet cable (Cat6 shielded recommended)',
        'Connect laptop directly to controller port',
        'Ping controller IP address from network',
        'Check IP configuration in DIGSI software',
        'Inspect RJ45 port for bent or corroded pins',
        'Test port with Ethernet cable tester',
        'Check for surge damage on network isolation components'
      ],
      repairSteps: [
        'Replace RJ45 connector module if physically damaged',
        'Re-solder or replace network isolation transformer',
        'Replace Ethernet PHY IC (requires SMD rework station)',
        'Update network driver firmware via USB/serial',
        'Install surge protector on Ethernet line',
        'Use shielded Cat6 cable with proper grounding',
        'Replace communication module if port completely failed',
        'Contact Siemens service for PHY chip replacement'
      ],
      testProcedure: [
        'Verify link LED illuminates when cable connected',
        'Ping controller from multiple network locations',
        'Test sustained data transfer for 1 hour',
        'Verify SCADA communication restores automatically',
        'Test under high network traffic conditions',
        'Confirm Profinet/Modbus TCP communication works'
      ],
      estimatedTime: '60-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['RJ45 connector module', 'Network isolation transformer', 'Ethernet PHY IC', 'Shielded Ethernet cable'],
      specialTools: ['SMD rework station', 'Network cable tester', 'Oscilloscope', 'DIGSI software', 'Siemens programming cable'],
      safetyPrecautions: ['Disconnect power before board work', 'Use ESD protection', 'Siemens certified technicians recommended for IC replacement']
    },
    {
      id: 'siemens-touchscreen-failure',
      title: 'Touchscreen Display Blank, Flickering, or Unresponsive',
      symptom: 'Display not showing, backlight failure, touch not registering, or screen artifacts',
      possibleCauses: [
        'Backlight inverter failure',
        'LCD panel damage',
        'Display ribbon cable loose or damaged',
        'Display driver board failure',
        'Touch controller IC malfunction',
        'Power supply to display insufficient',
        'Firmware display driver corruption'
      ],
      diagnosticSteps: [
        'Check if backlight comes on (shine flashlight at screen)',
        'Listen for inverter whine indicating partial function',
        'Check display ribbon cable connections',
        'Test display with external monitor if available',
        'Access controller via DIGSI to check display config',
        'Measure display power rails (typically 12V, 5V, 3.3V)',
        'Check for visual damage to LCD panel'
      ],
      repairSteps: [
        'Re-seat display ribbon cable connections',
        'Replace backlight inverter board',
        'Replace CCFL tubes or LED backlight strip',
        'Replace complete LCD assembly',
        'Replace touch controller board',
        'Re-flash display firmware via DIGSI',
        'Replace display power supply circuitry',
        'Order Siemens replacement HMI module'
      ],
      testProcedure: [
        'Verify full screen illumination uniformity',
        'Test touch response in all areas of screen',
        'Run display test pattern from service menu',
        'Operate for extended period to check stability',
        'Test at various brightness levels',
        'Verify all menu screens display correctly'
      ],
      estimatedTime: '90-240 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['LCD assembly', 'Backlight inverter', 'Touch controller board', 'Display ribbon cable'],
      specialTools: ['Anti-static mat', 'Torx screwdrivers', 'DIGSI software', 'Multimeter', 'Replacement display module'],
      safetyPrecautions: ['High voltage on backlight inverter - disconnect power', 'Handle LCD carefully to prevent cracking', 'Use ESD protection']
    },
    {
      id: 'siemens-io-module-failure',
      title: 'Digital/Analog I/O Module Not Responding',
      symptom: 'Input/output channels not working, module LED errors, or intermittent I/O failures',
      possibleCauses: [
        'I/O module not seated properly in backplane',
        'Backplane connector damage',
        'Module internal failure from overvoltage',
        'Field wiring fault damaging input circuit',
        'Module firmware corruption',
        'Power supply to I/O bus insufficient',
        'Profibus/Profinet communication to module lost'
      ],
      diagnosticSteps: [
        'Check module status LEDs for error codes',
        'Inspect module seating in backplane',
        'Use DIGSI to read module diagnostics',
        'Test I/O module with known good field signals',
        'Swap suspected module with known good spare',
        'Check backplane bus voltage and communication',
        'Measure field wiring for shorts or overvoltage',
        'Review event log for I/O fault timestamps'
      ],
      repairSteps: [
        'Re-seat I/O module firmly in backplane',
        'Clean backplane connector contacts',
        'Replace damaged I/O module with spare',
        'Update module firmware via DIGSI',
        'Repair field wiring causing damage',
        'Install transient protection on field inputs',
        'Replace backplane if connector damaged',
        'Configure replacement module with saved parameters'
      ],
      testProcedure: [
        'Verify all channels read/write correctly',
        'Test with simulated inputs across full range',
        'Operate all outputs and verify field response',
        'Monitor for intermittent faults over time',
        'Confirm module appears healthy in DIGSI',
        'Test under load conditions'
      ],
      estimatedTime: '30-120 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement I/O module', 'Backplane connector', 'Transient suppressors'],
      specialTools: ['DIGSI software', 'Module extraction tool', 'Signal generator', 'Multimeter'],
      safetyPrecautions: ['Power down system before module removal', 'Handle modules by edges only', 'Use ESD protection']
    },
    {
      id: 'siemens-firmware-corruption',
      title: 'Controller Firmware Corrupted or Boot Failure',
      symptom: 'Controller stuck in boot loop, firmware checksum errors, or incomplete startup',
      possibleCauses: [
        'Power loss during firmware update',
        'Corrupted firmware file uploaded',
        'Flash memory degradation',
        'EMI during firmware write operation',
        'Battery backup failure losing boot config',
        'Malicious firmware modification attempt'
      ],
      diagnosticSteps: [
        'Observe boot LED sequence for error patterns',
        'Check if recovery mode accessible',
        'Connect via serial console for boot messages',
        'Verify firmware file integrity (checksum)',
        'Check battery backup voltage',
        'Review update history in DIGSI logs',
        'Test flash memory diagnostics if available'
      ],
      repairSteps: [
        'Enter recovery/service mode (hold specific keys at boot)',
        'Re-flash firmware using DIGSI recovery procedure',
        'Use Siemens factory recovery USB if available',
        'Replace flash memory chip if degraded',
        'Restore configuration from backup after re-flash',
        'Replace battery backup',
        'Contact Siemens support for bricked units',
        'Factory reset if all else fails'
      ],
      testProcedure: [
        'Verify complete boot sequence succeeds',
        'Check firmware version matches expected',
        'Test all controller functions post-recovery',
        'Verify configuration restored correctly',
        'Monitor for any boot issues over multiple cycles',
        'Run full system diagnostics'
      ],
      estimatedTime: '60-240 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Firmware recovery USB', 'Flash memory chip (if replacing)', 'Battery backup'],
      specialTools: ['DIGSI software', 'Serial console cable', 'Recovery USB drive', 'Programming cable'],
      safetyPrecautions: ['Ensure stable power during firmware operations', 'Back up all configuration before attempting', 'Use only official Siemens firmware files']
    },
    {
      id: 'siemens-power-supply-failure',
      title: 'Internal Power Supply Failure or Instability',
      symptom: 'Controller not powering on, random reboots, or unstable operation',
      possibleCauses: [
        'Input fuse blown',
        'DC-DC converter failure',
        'Capacitor degradation (bulging/leaking)',
        'Voltage regulator overheating',
        'Input overvoltage/undervoltage condition',
        'Power connector corrosion',
        'Inrush current damage'
      ],
      diagnosticSteps: [
        'Measure input voltage at controller terminals',
        'Check input fuse continuity',
        'Measure all internal voltage rails (24V, 12V, 5V, 3.3V)',
        'Inspect capacitors for bulging or leakage',
        'Check power connector for corrosion or damage',
        'Test with known good external power supply',
        'Monitor voltage stability with oscilloscope',
        'Check thermal condition of regulators'
      ],
      repairSteps: [
        'Replace blown fuse with correct rating',
        'Replace failed capacitors with high-quality replacements',
        'Replace DC-DC converter module',
        'Re-solder loose power connections',
        'Clean and treat corroded connectors',
        'Install external voltage regulator if needed',
        'Add inrush current limiting',
        'Replace power supply board if major failure'
      ],
      testProcedure: [
        'Verify all voltage rails within specification',
        'Test under full load conditions',
        'Monitor for voltage ripple with oscilloscope',
        'Operate for extended period checking stability',
        'Test startup and shutdown cycles',
        'Verify power consumption normal'
      ],
      estimatedTime: '45-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Fuses', 'Electrolytic capacitors', 'DC-DC converter module', 'Voltage regulators'],
      specialTools: ['Oscilloscope', 'Multimeter', 'Soldering station', 'Thermal camera', 'Variable power supply'],
      safetyPrecautions: ['Capacitors hold charge - discharge before work', 'Verify no power before repairs', 'Use proper voltage rated components']
    }
  ],
    commonFaults: [
    { code: 'E001', title: 'Communication Timeout', description: 'Network communication lost', severity: 'warning', causes: ['Network fault', 'Cable issue'], solutions: ['Check cables', 'Verify network config'], resetProcedure: ['Fix issue', 'Auto-reset'] },
    { code: 'E002', title: 'Module Fault', description: 'I/O module not responding', severity: 'critical', causes: ['Module failure', 'Backplane issue'], solutions: ['Re-seat module', 'Replace module'], resetProcedure: ['Fix module', 'Restart system'] },
    { code: 'E003', title: 'Watchdog Reset', description: 'System watchdog triggered', severity: 'warning', causes: ['Firmware hang', 'High CPU load'], solutions: ['Update firmware', 'Check load'], resetProcedure: ['Automatic restart'] }
  ],
  },
  "enko": {
    repairProcedures: [
    {
      id: 'enko-lcd-display-failure',
      title: 'LCD Display Not Working, Dim, or Showing Partial Text',
      symptom: 'Display blank, faded text, missing segments, or flickering display',
      possibleCauses: [
        'LCD module failure',
        'Display ribbon cable loose',
        'Contrast adjustment incorrect',
        'LCD driver IC failure',
        'Backlight LED failure (if equipped)',
        'Power supply to LCD insufficient',
        'Cold temperature affecting LCD response'
      ],
      diagnosticSteps: [
        'Check if display shows anything at power-on',
        'Adjust contrast potentiometer (if accessible)',
        'Verify DC power supply voltage is correct',
        'Check display ribbon cable connection',
        'Test at room temperature if cold environment',
        'Listen for relay clicks indicating controller is running',
        'Connect via RS232 to verify controller is responsive'
      ],
      repairSteps: [
        'Re-seat LCD ribbon cable connector',
        'Adjust contrast potentiometer clockwise/counterclockwise',
        'Replace LCD module (common failure point)',
        'Clean ribbon cable contacts with IPA',
        'Check and repair display power supply circuit',
        'Replace backlight LEDs if equipped and failed',
        'Warm controller if cold-related issue'
      ],
      testProcedure: [
        'Verify all text segments visible',
        'Check display updates when values change',
        'Test at minimum and maximum contrast',
        'Verify display at different viewing angles',
        'Test in cold conditions if applicable'
      ],
      estimatedTime: '20-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['LCD module', 'Ribbon cable', 'Contrast potentiometer'],
      specialTools: ['Small screwdriver for contrast adjustment', 'Multimeter', 'IPA cleaner'],
      safetyPrecautions: ['Disconnect battery before opening', 'Handle LCD glass carefully']
    },
    {
      id: 'enko-keypad-not-responding',
      title: 'Keypad Buttons Stuck, Not Working, or Erratic Response',
      symptom: 'Buttons unresponsive, multiple button presses required, or ghost button presses',
      possibleCauses: [
        'Membrane keypad worn out',
        'Keypad flex cable disconnected',
        'Button contact corrosion',
        'Keypad matrix scanning IC failure',
        'Moisture ingress under keypad',
        'Physical damage to buttons',
        'Debris under keypad membrane'
      ],
      diagnosticSteps: [
        'Test each button individually',
        'Check for stuck buttons by feeling resistance',
        'Inspect keypad surface for damage or wear',
        'Open unit and check flex cable connection',
        'Look for moisture or corrosion on PCB',
        'Test button resistance with multimeter',
        'Check if issue is worse with certain buttons'
      ],
      repairSteps: [
        'Clean button contacts with IPA and cotton swab',
        'Re-seat keypad flex cable connector',
        'Replace membrane keypad overlay',
        'Clean PCB button contacts',
        'Apply silicone lubricant to stuck buttons',
        'Replace entire keypad assembly if worn',
        'Dry out moisture and apply conformal coating',
        'Replace if physical damage present'
      ],
      testProcedure: [
        'Test all buttons multiple times',
        'Verify button labels match function',
        'Test rapid button pressing',
        'Verify no false button triggers',
        'Test button operation through all menus'
      ],
      estimatedTime: '20-45 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Membrane keypad overlay', 'Keypad flex cable', 'Contact cleaner'],
      specialTools: ['IPA cleaner', 'Small brush', 'Multimeter', 'Plastic spudger'],
      safetyPrecautions: ['Power off before opening', 'Do not damage flex cable']
    },
    {
      id: 'enko-sensor-input-failure',
      title: 'Analog Sensor Input Reading Incorrectly or Stuck',
      symptom: 'Temperature, pressure, or other sensor readings wrong, stuck at 0, or erratic values',
      possibleCauses: [
        'Sensor wiring fault (open or short)',
        'Input terminal corrosion',
        'Sensor failure (external)',
        'Input protection component failed',
        'ADC failure on controller',
        'Incorrect sensor type configured',
        'Ground loop interference'
      ],
      diagnosticSteps: [
        'Measure sensor output at controller terminals',
        'Verify sensor configuration matches installed sensor',
        'Check wiring for breaks or shorts',
        'Measure sensor directly to confirm good output',
        'Inspect input terminals for corrosion',
        'Test with known good sensor or signal simulator',
        'Check ground connections'
      ],
      repairSteps: [
        'Clean and tighten terminal connections',
        'Replace sensor wiring if damaged',
        'Replace external sensor if faulty',
        'Correct sensor type configuration',
        'Replace input protection components if shorted',
        'Install shielded cable if interference present',
        'Add separate ground for sensor circuit'
      ],
      testProcedure: [
        'Apply known temperature/pressure and verify reading',
        'Test across full sensor range',
        'Monitor reading stability over time',
        'Verify alarm setpoints trigger correctly',
        'Test with engine running for vibration interference'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement sensor', 'Terminal connectors', 'Shielded cable'],
      specialTools: ['Multimeter', 'Temperature probe', 'Signal simulator'],
      safetyPrecautions: ['Disconnect battery before terminal work', 'Verify sensor voltage levels']
    },
    {
      id: 'enko-relay-output-failure',
      title: 'Relay Output Not Switching or Stuck On/Off',
      symptom: 'Start relay not energizing, fuel solenoid not activating, or relay stuck closed',
      possibleCauses: [
        'Relay coil burned out',
        'Relay contacts welded closed',
        'Output transistor/driver failure',
        'Wiring fault to load',
        'Load drawing too much current',
        'Flyback diode missing causing damage',
        'Relay socket corrosion'
      ],
      diagnosticSteps: [
        'Listen for relay click when activated via menu',
        'Measure voltage at relay output terminals',
        'Check relay coil continuity with multimeter',
        'Inspect relay contacts for welding/pitting',
        'Measure load current draw',
        'Check output transistor with diode test',
        'Verify software output state matches physical'
      ],
      repairSteps: [
        'Replace failed relay (match ratings)',
        'Replace output driver transistor',
        'Clean relay socket contacts',
        'Add flyback/snubber diode across relay coil',
        'Install external relay for high-current loads',
        'Reduce load current if exceeding rating',
        'Replace entire output board if multiple failures'
      ],
      testProcedure: [
        'Manually activate each output via test menu',
        'Measure output voltage/continuity',
        'Test with actual load connected',
        'Verify relay releases cleanly',
        'Test rapid on/off cycling',
        'Monitor relay temperature during operation'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement relay', 'Output transistor', 'Flyback diode', 'Relay socket'],
      specialTools: ['Multimeter', 'Soldering iron', 'Relay extraction tool'],
      safetyPrecautions: ['Disconnect all loads before testing', 'Verify relay voltage/current ratings', 'Use proper relay for inductive loads']
    },
    {
      id: 'enko-rs232-communication-failure',
      title: 'RS232/RS485 Communication Port Not Working',
      symptom: 'Cannot connect via PC software, no data transmission, or garbled data',
      possibleCauses: [
        'Wrong COM port selected in software',
        'Baud rate mismatch',
        'RS232 level converter IC failure',
        'Serial cable fault or wrong pinout',
        'USB-RS232 adapter driver issue',
        'TX/RX lines swapped',
        'EMI interference on serial line'
      ],
      diagnosticSteps: [
        'Verify COM port in Windows Device Manager',
        'Check cable continuity pin-to-pin',
        'Verify TX/RX pinout matches documentation',
        'Try different USB-RS232 adapter',
        'Check baud rate setting (usually 9600 or 19200)',
        'Measure RS232 voltage levels (should be ±3-15V)',
        'Test with serial terminal program'
      ],
      repairSteps: [
        'Install correct USB-RS232 driver',
        'Make cable with correct pinout (2-3-5 or custom)',
        'Replace MAX232 or similar level converter IC',
        'Clean serial port connector',
        'Set correct baud rate in controller and software',
        'Use shielded serial cable',
        'Replace serial port connector if damaged'
      ],
      testProcedure: [
        'Send and receive test commands',
        'Verify Enko software connects successfully',
        'Read and write parameters',
        'Test data transfer at various baud rates',
        'Confirm stable communication over extended period'
      ],
      estimatedTime: '20-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['RS232 cable', 'MAX232 IC', 'USB-RS232 adapter', 'DB9 connector'],
      specialTools: ['Serial cable tester', 'Oscilloscope', 'Enko configurator software', 'Serial terminal program'],
      safetyPrecautions: ['RS232 voltages can damage TTL devices', 'Verify pinout before connecting']
    }
  ],
    commonFaults: [
    { code: 'E01', title: 'Low Oil Pressure', description: 'Oil pressure below minimum', severity: 'shutdown', causes: ['Low oil', 'Sensor fault'], solutions: ['Add oil', 'Check sensor'], resetProcedure: ['Fix issue', 'Press RESET'] },
    { code: 'E02', title: 'High Temperature', description: 'Engine overheat', severity: 'shutdown', causes: ['Low coolant', 'Fan fault'], solutions: ['Add coolant', 'Check fan'], resetProcedure: ['Cool engine', 'Press RESET'] },
    { code: 'E03', title: 'Fail to Start', description: 'Engine did not start', severity: 'critical', causes: ['Fuel issue', 'Starter fault'], solutions: ['Check fuel', 'Check starter'], resetProcedure: ['Fix issue', 'Retry'] },
    { code: 'E04', title: 'Over Speed', description: 'Engine RPM too high', severity: 'shutdown', causes: ['Governor fault'], solutions: ['Check governor'], resetProcedure: ['Press RESET'] },
    { code: 'E05', title: 'Under Speed', description: 'Engine RPM too low', severity: 'warning', causes: ['Load too high', 'Fuel issue'], solutions: ['Reduce load', 'Check fuel'], resetProcedure: ['Fix issue', 'Auto-reset'] }
  ],
  },
  "vodia": {
    repairProcedures: [
    {
      id: 'vodia-no-comm',
      title: 'No Communication with Engine ECU',
      symptom: 'VODIA cannot establish connection with engine control unit',
      possibleCauses: ['Faulty diagnostic cable', 'CAN bus wiring fault', 'ECU not powered', 'Wrong protocol selected', 'ECU hardware failure'],
      diagnosticSteps: [
        'Check ignition is ON and wait 30 seconds for ECU boot',
        'Verify battery voltage (minimum 11.5V for 12V systems)',
        'Check diagnostic connector pins for corrosion or damage',
        'Measure CAN-H to CAN-L voltage (should be ~2.5V difference)',
        'Try different USB port or PC',
      ],
      repairSteps: [
        'Clean diagnostic connector contacts with electrical contact cleaner',
        'Check CAN bus wiring continuity from connector to ECU',
        'Verify ECU power supply fuse (typically 10-15A)',
        'Replace diagnostic cable if damaged',
        'Update VODIA software and database to latest version',
      ],
      testProcedure: [
        'Connect VODIA and verify "Connecting..." message appears',
        'Check engine identification displays correctly',
        'Read fault codes to verify full communication',
        'Monitor live data to confirm bidirectional communication',
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Diagnostic cable (if faulty)', 'ECU fuse'],
      specialTools: ['Multimeter', 'Oscilloscope (for CAN waveform)', 'VODIA interface'],
      safetyPrecautions: ['Do not start engine during ECU diagnostics', 'Disconnect battery if replacing ECU'],
    },
    {
      id: 'vodia-injector-fault',
      title: 'Common Rail Injector Fault',
      symptom: 'Fault codes indicating injector malfunction, rough running, smoke',
      possibleCauses: ['Injector electrical failure', 'Injector mechanical wear', 'Incorrect IQA code', 'Wiring harness fault', 'ECU driver failure'],
      diagnosticSteps: [
        'Read fault codes - note specific cylinder affected',
        'Use VODIA injector test function to actuate each injector',
        'Monitor injection quantity correction values',
        'Measure injector resistance (0.3-1.0Ω typical)',
        'Check injector connector for water ingress',
      ],
      repairSteps: [
        'If IQA code incorrect: Re-program using code on injector body',
        'If electrical fault: Check harness, replace connector if corroded',
        'If mechanical fault: Replace injector and program new IQA code',
        'Clear fault codes and perform injector calibration',
        'Run engine and monitor fuel trim values',
      ],
      testProcedure: [
        'Clear all fault codes',
        'Start engine and run for 5 minutes at idle',
        'Increase to rated speed and apply load',
        'Monitor injection correction - should be within ±5%',
        'Check for smoke and rough running',
        'Verify no new fault codes appear',
      ],
      estimatedTime: '2-4 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['Replacement injector', 'Copper sealing washers', 'O-rings'],
      specialTools: ['VODIA5/6', 'Torque wrench', 'Injector removal tool', 'Cylinder pressure tester'],
      safetyPrecautions: ['Relieve fuel pressure before removal', 'Do not touch injector tip', 'Use new sealing washers', 'Torque to specification'],
    },
    {
      id: 'vodia-turbo-fault',
      title: 'Turbocharger/Boost Pressure Fault',
      symptom: 'Low power, excessive smoke, turbo-related fault codes',
      possibleCauses: ['Boost pressure sensor failure', 'Turbo wastegate stuck', 'Air leak in charge air system', 'Turbo bearing wear', 'VGT actuator failure'],
      diagnosticSteps: [
        'Read fault codes for boost pressure errors',
        'Monitor boost pressure in VODIA - compare to specification',
        'Check turbo inlet restriction (air filter)',
        'Inspect charge air cooler piping for leaks',
        'Test wastegate/VGT actuator operation with VODIA',
      ],
      repairSteps: [
        'If sensor faulty: Replace boost pressure sensor',
        'If air leak: Replace damaged hoses or clamps',
        'If wastegate stuck: Clean or replace actuator',
        'If turbo worn: Check for shaft play, replace if >0.05mm axial',
        'Reset adaptations after repair',
      ],
      testProcedure: [
        'Clear fault codes',
        'Start and warm engine to operating temperature',
        'Monitor boost pressure at rated speed under load',
        'Boost should reach rated value within 3 seconds',
        'Check for abnormal turbo noise',
        'Verify no new fault codes',
      ],
      estimatedTime: '2-6 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['Boost pressure sensor', 'Charge air hoses', 'Turbo gaskets'],
      specialTools: ['VODIA', 'Boost pressure gauge', 'Smoke machine'],
      safetyPrecautions: ['Allow turbo to cool before service', 'Do not touch hot exhaust components', 'Use new gaskets'],
    },
    {
      id: 'vodia-ecu-update',
      title: 'ECU Software Update Procedure',
      symptom: 'ECU software outdated, new features required, bulletin requires update',
      possibleCauses: ['Factory software needs update', 'Service bulletin requires flash', 'New emission requirements', 'Bug fix required'],
      diagnosticSteps: [
        'Connect VODIA and read current ECU software version',
        'Check Volvo Penta Service Bulletin for required version',
        'Download latest software package from VODIA server',
        'Verify battery charger connected (mandatory for update)',
        'Ensure stable PC power supply',
      ],
      repairSteps: [
        'Connect battery charger set to 14V/28V',
        'DO NOT disconnect or turn off ignition during update',
        'Select ECU update function in VODIA',
        'Follow on-screen prompts exactly',
        'Wait for "Update Complete" message (10-30 minutes)',
        'Perform ECU reset if prompted',
      ],
      testProcedure: [
        'Verify new software version displays in VODIA',
        'Clear all fault codes',
        'Start engine and check for faults',
        'Verify all engine functions operate correctly',
        'Check adaptations are reset and relearned',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['None (software only)'],
      specialTools: ['VODIA with valid license', 'Battery charger', 'Stable power supply'],
      safetyPrecautions: ['Never interrupt update process', 'Maintain stable power', 'Do not start engine during update', 'Have backup ECU available'],
    },
    {
      id: 'vodia-sensor-calibration',
      title: 'Sensor Calibration and Zero Point Reset',
      symptom: 'Incorrect sensor readings, drift after sensor replacement',
      possibleCauses: ['Sensor replaced without calibration', 'Environmental drift', 'Contamination affecting readings'],
      diagnosticSteps: [
        'Compare sensor readings to known good values',
        'Check for related fault codes',
        'Verify sensor wiring and connections',
        'Check calibration date in VODIA',
      ],
      repairSteps: [
        'Access sensor calibration menu in VODIA',
        'For pressure sensors: Apply known pressure and calibrate',
        'For temperature sensors: Verify at known temperature',
        'For position sensors: Follow VODIA guided calibration',
        'Save calibration values to ECU',
      ],
      testProcedure: [
        'Verify sensor reads correctly at multiple points',
        'Check no calibration fault codes',
        'Run engine and monitor values under load',
        'Compare to specification values',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Calibration equipment if required'],
      specialTools: ['VODIA', 'Pressure calibrator', 'Temperature reference'],
      safetyPrecautions: ['Ensure engine is stopped for static calibrations', 'Follow Volvo Penta calibration procedures exactly'],
    },
  ],
    commonFaults: [
    { code: 'MID128 PID110', title: 'Coolant Temperature Sensor Fault', description: 'Engine coolant temperature signal out of range', severity: 'warning', causes: ['Sensor failure', 'Wiring fault', 'Connector corrosion'], solutions: ['Check wiring', 'Replace sensor', 'Clean connector'], resetProcedure: ['Clear code with VODIA', 'Verify repair', 'Run engine to confirm'] },
    { code: 'MID128 PID100', title: 'Oil Pressure Sensor Fault', description: 'Engine oil pressure signal abnormal', severity: 'shutdown', causes: ['Sensor failure', 'Low oil pressure actual', 'Wiring fault'], solutions: ['Verify oil level', 'Check actual pressure', 'Replace sensor'], resetProcedure: ['Address root cause', 'Clear code with VODIA', 'Start engine and verify'] },
    { code: 'MID128 PID190', title: 'Engine Overspeed', description: 'Engine speed exceeded maximum limit', severity: 'shutdown', causes: ['Governor failure', 'Load rejection', 'Throttle fault'], solutions: ['Check governor', 'Verify throttle operation', 'Check load connections'], resetProcedure: ['Identify cause', 'Repair fault', 'Clear code', 'Test at rated speed'] },
    { code: 'MID128 SID001', title: 'Injector Cylinder 1 Fault', description: 'Cylinder 1 injector electrical fault', severity: 'critical', causes: ['Injector coil failure', 'Wiring open/short', 'ECU driver fault'], solutions: ['Measure injector resistance', 'Check wiring', 'Replace injector'], resetProcedure: ['Replace injector if faulty', 'Program IQA code', 'Clear faults', 'Test run'] },
    { code: 'MID128 PID102', title: 'Boost Pressure Low', description: 'Turbocharger boost pressure below threshold', severity: 'warning', causes: ['Air leak', 'Turbo failure', 'Wastegate stuck open'], solutions: ['Check air system', 'Inspect turbo', 'Test wastegate'], resetProcedure: ['Fix air leaks', 'Repair turbo', 'Clear code', 'Load test'] },
    { code: 'MID128 PID168', title: 'Battery Voltage Low', description: 'System voltage below operating threshold', severity: 'warning', causes: ['Battery weak', 'Alternator fault', 'High resistance connections'], solutions: ['Test battery', 'Check alternator', 'Clean connections'], resetProcedure: ['Charge/replace battery', 'Repair alternator', 'Clear code'] },
    { code: 'MID128 SID254', title: 'ECU Internal Fault', description: 'Engine control unit internal error', severity: 'critical', causes: ['ECU hardware failure', 'Software corruption', 'Power supply fault'], solutions: ['Reset ECU', 'Reflash software', 'Replace ECU'], resetProcedure: ['Try ECU reset', 'Reflash if possible', 'Replace ECU if persistent'] },
    { code: 'MID128 PID94', title: 'Fuel Pressure Low', description: 'Common rail fuel pressure below minimum', severity: 'shutdown', causes: ['Fuel filter blocked', 'Lift pump failure', 'High pressure pump worn', 'Fuel leak'], solutions: ['Replace filters', 'Check lift pump', 'Test HP pump', 'Inspect for leaks'], resetProcedure: ['Fix fuel system', 'Prime system', 'Clear codes', 'Start and verify pressure'] },
  ],
  },
};
