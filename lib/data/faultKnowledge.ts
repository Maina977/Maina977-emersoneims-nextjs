/**
 * FAULT KNOWLEDGE LAYER — diagnostic content for the fault types our code
 * database maps to.
 *
 * WHAT THIS IS
 * ============
 * lib/data/verifiedFaultCodes.ts holds 2,155 real brand/model/code entries, but
 * each carries only a fault name and a few fragments — 311 of them have no
 * remedy at all. A fault name is not enough to work from. This module supplies
 * the engineering content: what the fault actually means, what the technician
 * will observe, an ordered diagnostic sequence with the reading expected at each
 * step, the corrective work, the safety constraints and the tools needed.
 *
 * The 2,155 codes resolve to 642 distinct fault types, and the distribution is
 * heavily concentrated — the entries below cover roughly two thirds of every
 * code in the database.
 *
 * WHY THIS IS LEGITIMATE
 * ======================
 * - The code-to-fault-type mapping comes from our own curated CSV. Nothing here
 *   invents what a code means.
 * - The diagnostic content is general engineering for that fault type, valid on
 *   any engine exhibiting it, written from first principles in our own words.
 *   Nothing is transcribed from a manufacturer's manual.
 * - Severity is engineering judgement about the physical condition — low oil
 *   pressure stops an engine, a restricted air filter does not — never a
 *   function of the code number.
 * - Typical values are given as ranges and always with the instruction to
 *   confirm against the engine's own specification. An engine spec card beats a
 *   generic range every time, and the text says so.
 *
 * HOW TO EXTEND
 * =============
 * Add an entry with `match` values written lower-case. Every code whose
 * description normalises to one of those strings inherits the content.
 */

export interface DiagnosticStep {
  step: number;
  action: string;
  expect: string;
  tools?: string[];
}

export interface FaultKnowledge {
  /** Lower-case fault descriptions that resolve to this entry. */
  match: string[];
  system: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  summary: string;
  symptoms: string[];
  diagnosis: DiagnosticStep[];
  remedy: string[];
  safety: string[];
  tools: string[];
  preventive: string[];
}

export const FAULT_KNOWLEDGE: FaultKnowledge[] = [
  // ─────────────────────────────────────────────────────────── LUBRICATION ──
  {
    match: ['oil pressure low', 'low oil pressure', 'engine oil pressure low'],
    system: 'Lubrication',
    severity: 'shutdown',
    summary: 'Oil pressure has fallen below the level the engine needs to keep a hydrodynamic film between its bearings and journals. Below that film, metal contacts metal and damage begins in seconds rather than minutes. This is a stop-now condition on any diesel engine, and it is the single fault where continuing to run to "see what happens" is most likely to destroy the engine.',
    symptoms: ['Low oil pressure alarm or shutdown on the controller', 'Gauge reading below normal for the speed and oil temperature', 'Knocking or rumbling from the bottom end in advanced cases', 'Pressure that falls away as the oil warms up'],
    diagnosis: [
      { step: 1, action: 'Stop the engine. Do not restart it to reproduce the fault.', expect: 'Engine stopped and isolated before any further work', tools: [] },
      { step: 2, action: 'Check the oil level on the dipstick with the set stopped and standing level', expect: 'Level between the marks; note if it is at or below minimum', tools: ['Clean rag'] },
      { step: 3, action: 'Inspect the oil for fuel or coolant dilution — smell it and look for a milky appearance or an over-full sump', expect: 'Oil smells of oil, not diesel; no emulsion; level not above maximum', tools: [] },
      { step: 4, action: 'Fit a mechanical gauge to the main oil gallery test point and run the engine briefly', expect: 'Independent reading confirms or refutes the sender. This step decides whether you are chasing an engine fault or a sensor fault.', tools: ['Mechanical oil pressure gauge and adaptor'] },
      { step: 5, action: 'Compare the mechanical reading against the engine specification at idle and at rated speed, at normal operating temperature', expect: 'Typically a few bar at rated speed and appreciably lower at idle — always confirm the figure on the engine spec card rather than a generic range', tools: ['Engine specification data'] },
      { step: 6, action: 'If pressure is genuinely low, check the oil grade against specification and inspect the filter and its anti-drain and bypass arrangement', expect: 'Correct grade for ambient temperature; filter not collapsed or bypassing', tools: ['Filter wrench'] },
      { step: 7, action: 'Inspect the pressure relief valve for a stuck-open condition or debris on the seat', expect: 'Valve free, seat clean, spring intact', tools: ['Basic hand tools'] },
      { step: 8, action: 'If supply-side items are sound, assess pump condition and bearing clearance — falling pressure that worsens when hot points to worn clearances', expect: 'A decision on whether the engine requires internal inspection', tools: ['Oil sample kit', 'Workshop measuring equipment'] },
    ],
    remedy: [
      'Correct the oil level with the specified grade — do not mix grades to make up quantity',
      'Replace the oil filter, and change the oil if it is diluted or contaminated',
      'Replace a faulty pressure sender only after a mechanical gauge has proved the reading wrong',
      'Free or replace a defective relief valve and clean any debris found on its seat',
      'Where the pump or bearing clearances are the cause, plan an internal inspection rather than returning the set to service',
    ],
    safety: [
      'Do not run an engine with confirmed low oil pressure — bearing damage begins almost immediately',
      'Hot oil scalds. Allow the engine to cool before opening the system',
      'Isolate the starting circuit before working near rotating parts',
    ],
    tools: ['Mechanical oil pressure gauge', 'Digital multimeter', 'Filter wrench', 'Oil sample kit'],
    preventive: ['Change oil and filter on the hours interval, not the calendar', 'Take an oil sample at each service and trend wear metals', 'Use the specified grade for the site ambient temperature', 'Investigate any downward trend in pressure before it becomes an alarm'],
  },
  {
    match: ['oil pressure high', 'high oil pressure', 'high oil pressure; system reaction initiated'],
    system: 'Lubrication',
    severity: 'warning',
    summary: 'Indicated oil pressure is above the normal band. On a warm engine this is far more often a measurement or viscosity problem than a real over-pressure, because the relief valve should cap system pressure. Genuine high pressure usually means the relief valve is not opening or a passage downstream is restricted.',
    symptoms: ['Pressure reading above normal, particularly on a cold start', 'Reading that does not fall as the oil warms', 'Possible filter housing or cooler seepage in sustained cases'],
    diagnosis: [
      { step: 1, action: 'Note whether the reading is high only when cold or also at full operating temperature', expect: 'Cold-only elevation is normal behaviour for thick oil', tools: [] },
      { step: 2, action: 'Confirm the oil grade in the sump matches the specification for the ambient temperature', expect: 'Correct viscosity grade; an over-heavy grade raises cold pressure markedly', tools: [] },
      { step: 3, action: 'Verify the indicated pressure against a mechanical gauge at the gallery test point', expect: 'Agreement between the two; disagreement indicts the sender or its wiring', tools: ['Mechanical oil pressure gauge'] },
      { step: 4, action: 'If pressure is genuinely high when hot, inspect the relief valve for a stuck-closed condition', expect: 'Valve free to lift at its set pressure', tools: ['Basic hand tools'] },
      { step: 5, action: 'Check the filter and cooler for restriction that raises upstream pressure', expect: 'Free flow through filter and cooler', tools: ['Filter wrench'] },
    ],
    remedy: ['Drain and refill with the correct viscosity grade where the wrong oil is in use', 'Free or replace a relief valve that is not lifting', 'Replace a restricted filter or clean the oil cooler', 'Replace the sender where a mechanical gauge disproves the indicated reading'],
    safety: ['Hot pressurised oil causes serious burns — do not crack fittings on a running or hot engine'],
    tools: ['Mechanical oil pressure gauge', 'Filter wrench', 'Digital multimeter'],
    preventive: ['Use the specified grade year round rather than switching seasonally without checking', 'Replace the relief valve during major overhaul'],
  },
  {
    match: ['oil temperature high', 'engine oil temperature high', 'high oil temperature'],
    system: 'Lubrication',
    severity: 'critical',
    summary: 'Oil temperature is above its normal band. Oil that runs hot thins, loses film strength and oxidises far faster, so a sustained high reading shortens bearing life even when nothing fails immediately. Rising oil temperature with normal coolant temperature points at the oil cooler or at genuine mechanical load rather than at the cooling system generally.',
    symptoms: ['High oil temperature alarm', 'Oil temperature climbing while coolant temperature stays normal', 'Darkened oil and a shortened service life between changes', 'Falling oil pressure when hot as viscosity drops'],
    diagnosis: [
      { step: 1, action: 'Record oil temperature and coolant temperature together', expect: 'Both high suggests a cooling-system problem; oil alone high isolates the oil circuit', tools: ['Service tool or panel readout'] },
      { step: 2, action: 'Measure the actual electrical load and compare against the set rating', expect: 'Load within the rating for the duty class', tools: ['Clamp meter'] },
      { step: 3, action: 'Inspect the oil cooler for external blockage and internal fouling', expect: 'Clear passages, no external debris blanket', tools: ['Inspection light'] },
      { step: 4, action: 'Check the oil level and grade', expect: 'Correct level and specified grade; a low level heats faster', tools: [] },
      { step: 5, action: 'Verify the reading against an independent probe on the sump or gallery', expect: 'Agreement within a few degrees', tools: ['Infrared or contact thermometer'] },
    ],
    remedy: ['Reduce load to within rating where the set is being overloaded', 'Clean or replace a fouled oil cooler', 'Correct the oil level and grade', 'Restore engine-room ventilation where high ambient is driving the temperature', 'Replace the sender where an independent probe disproves the reading'],
    safety: ['Hot oil scalds — allow cooling before opening the circuit'],
    tools: ['Clamp meter', 'Infrared thermometer', 'Service tool'],
    preventive: ['Clean the oil cooler at each major service', 'Keep the engine room within its design ambient', 'Trend oil temperature against load rather than watching for the alarm'],
  },
  // ────────────────────────────────────────────────────────────── COOLING ──
  {
    match: ['coolant temperature high', 'high coolant temperature', 'engine coolant temperature high', 'engine overheating'],
    system: 'Cooling',
    severity: 'shutdown',
    summary: 'Coolant temperature is above its normal operating band. On a generator installation this is far more often a ventilation or radiator airflow problem than an engine fault — the engine is rejecting the heat it is designed to reject, and the room is failing to carry it away. Diagnose the installation before the engine.',
    symptoms: ['High coolant temperature alarm or shutdown', 'Loss of power as the ECU derates to protect the engine', 'Coolant loss through the expansion cap', 'Engine room noticeably hot, or hot air recirculating to the radiator'],
    diagnosis: [
      { step: 1, action: 'Stop the engine and allow a controlled cool-down. Never open a hot pressure cap.', expect: 'System below 60 °C before any cap is disturbed', tools: [] },
      { step: 2, action: 'Check the coolant level once cool and inspect for external leaks', expect: 'Level correct; no wet joints, hose weeping or core staining', tools: ['Inspection light'] },
      { step: 3, action: 'Inspect the radiator core face for dust, oil film, debris or insect blanketing', expect: 'Clean core with clear passages, checked from both faces', tools: ['Inspection light'] },
      { step: 4, action: 'Measure engine-room inlet and outlet free area against the radiator face area, and check for hot-air recirculation', expect: 'Inlet and outlet free area generous relative to the radiator face; discharge not returning to the intake', tools: ['Tape measure'] },
      { step: 5, action: 'Verify the fan drive — belt tension and condition, or fan clutch engagement where fitted', expect: 'Belt correctly tensioned and undamaged; fan driving at speed', tools: ['Belt tension gauge'] },
      { step: 6, action: 'Test the thermostat opening temperature off the engine in heated water', expect: 'Opens at its rated temperature and opens fully', tools: ['Thermometer', 'Heat source'] },
      { step: 7, action: 'Pressure-test the cooling system and the pressure cap', expect: 'System holds its rated pressure; cap relieves at its rating', tools: ['Cooling system pressure tester'] },
      { step: 8, action: 'Measure the actual load and confirm the set is not being run above its duty rating', expect: 'Load within rating for the duty class', tools: ['Clamp meter'] },
    ],
    remedy: [
      'Clean the radiator core from the fan side outward and remove any recirculation path',
      'Correct engine-room ventilation — this resolves more overheating complaints on generator sets than any engine repair',
      'Replace a thermostat that opens late or partially',
      'Replace worn belts and correct tension; repair or replace a fan clutch that will not engage',
      'Repair leaks and refill with the specified pre-mixed coolant, then bleed the system properly',
      'Reduce load or uprate the set where the duty rating is genuinely exceeded',
    ],
    safety: [
      'A hot pressurised cooling system will discharge scalding coolant and steam if opened — wait for it to cool',
      'Keep clear of the fan; it can start under thermostatic control without warning on some installations',
    ],
    tools: ['Cooling system pressure tester', 'Infrared thermometer', 'Belt tension gauge', 'Clamp meter'],
    preventive: ['Clean the radiator core on a schedule matched to site dust, not a generic interval', 'Pressure-test the system annually', 'Replace coolant hoses on age rather than on appearance', 'Verify ventilation free area at commissioning and after any building alteration'],
  },
  {
    match: ['coolant level low', 'low coolant level', 'engine coolant level low'],
    system: 'Cooling',
    severity: 'critical',
    summary: 'Coolant has fallen below the level sensor. Coolant does not get consumed in normal operation, so a genuine low level means it is leaving the system somewhere. Treating a repeating low-level alarm as a top-up task rather than a leak is how engines end up overheating with a full expansion bottle.',
    symptoms: ['Low coolant level alarm, often before any temperature rise', 'Coolant traces beneath the set or on the block', 'Repeated need to top up between services', 'White exhaust vapour or coolant in the oil where the loss is internal'],
    diagnosis: [
      { step: 1, action: 'Check the actual level cold at both the radiator and the expansion bottle', expect: 'Confirms whether the alarm is real or a sensor fault', tools: [] },
      { step: 2, action: 'Inspect externally for leaks at hoses, clamps, the water pump weep hole, the core and the heater circuit', expect: 'Dry joints; staining marks a historic leak even when currently dry', tools: ['Inspection light', 'Mirror'] },
      { step: 3, action: 'Pressure-test the cooling system cold and watch for a falling gauge', expect: 'Holds rated pressure for the test period', tools: ['Cooling system pressure tester'] },
      { step: 4, action: 'If no external leak is found, check for internal loss — oil condition, exhaust vapour and combustion gas in the coolant', expect: 'Clean oil, no persistent white vapour, no combustion gas present', tools: ['Combustion gas test kit'] },
      { step: 5, action: 'Test the level sensor and its wiring where the level is proven correct', expect: 'Sensor switches at the correct level and reads through to the controller', tools: ['Digital multimeter'] },
    ],
    remedy: ['Repair the leak found and refill with the specified pre-mixed coolant', 'Replace the pressure cap if it is not holding its rating', 'Replace the water pump where the weep hole is passing coolant', 'Escalate an internal loss for head, gasket or liner investigation', 'Bleed the system fully after refilling so the sensor reads true'],
    safety: ['Do not open a hot system', 'Coolant is toxic — contain it and keep it away from drains and livestock'],
    tools: ['Cooling system pressure tester', 'Combustion gas test kit', 'Digital multimeter'],
    preventive: ['Record top-up quantities so a slow leak becomes visible as a trend', 'Replace hoses on age', 'Check the cap at every service — it is cheap and frequently the cause'],
  },
  {
    match: ['coolant temperature low', 'low coolant temperature', 'engine coolant temperature low'],
    system: 'Cooling',
    severity: 'warning',
    summary: 'The engine is not reaching its designed operating temperature. This matters more on generator sets than it appears to: an engine running cold does not burn fuel completely, which glazes bores, dilutes oil and produces the wet-stacking deposits that later present as loss of power. A thermostat stuck open is the usual cause.',
    symptoms: ['Coolant temperature below normal once warmed through', 'Extended time to reach operating temperature', 'Wet, oily exhaust residue and black deposits at the stack', 'Poor response to load and higher fuel consumption'],
    diagnosis: [
      { step: 1, action: 'Run the set to normal operating condition and record the stabilised coolant temperature', expect: 'Temperature settles in the designed band rather than well below it', tools: ['Service tool or panel readout'] },
      { step: 2, action: 'Establish the average load factor over a typical run', expect: 'A set spending its life lightly loaded will run cold regardless of the thermostat', tools: ['Clamp meter'] },
      { step: 3, action: 'Test the thermostat off the engine in heated water', expect: 'Closed when cold and opening at its rated temperature', tools: ['Thermometer', 'Heat source'] },
      { step: 4, action: 'Verify the reading against an independent probe on the housing', expect: 'Agreement within a few degrees', tools: ['Infrared thermometer'] },
    ],
    remedy: ['Replace a thermostat that is stuck open or opening early — never run without a thermostat to cure an overheating complaint elsewhere', 'Correct the duty pattern: load-bank a set that is chronically lightly loaded, or resize it', 'Replace the sender where an independent probe disproves the reading'],
    safety: ['Allow the system to cool before removing the thermostat housing'],
    tools: ['Thermometer', 'Infrared thermometer', 'Clamp meter'],
    preventive: ['Replace the thermostat at major service intervals', 'Run a monthly loaded exercise rather than a no-load run'],
  },
  // ───────────────────────────────────────────────────────────────── FUEL ──
  {
    match: ['low fuel rail pressure', 'fuel rail pressure low'],
    system: 'Fuel',
    severity: 'critical',
    summary: 'The high-pressure fuel circuit is not achieving its commanded rail pressure. Because rail pressure governs injection quantity and timing, the engine responds with hard starting, low power and often a protective derate. Work the supply side first — filters, air ingress and lift pressure account for most cases and cost far less to correct than the high-pressure pump.',
    symptoms: ['Hard starting or a failure to start', 'Loss of power and inability to accept load', 'Rough running, particularly under load', 'Derate or shutdown reported by the ECU'],
    diagnosis: [
      { step: 1, action: 'Check the fuel level and confirm the supply valve is open and the tank is drawing from where you think it is', expect: 'Adequate fuel and an open path to the engine', tools: [] },
      { step: 2, action: 'Drain the water separator and inspect what comes out', expect: 'Clean fuel, no water layer, no biological growth', tools: ['Container'] },
      { step: 3, action: 'Replace or bypass-test the primary and secondary filters if they are near their interval', expect: 'Restriction removed as a variable before deeper work', tools: ['Filter wrench'] },
      { step: 4, action: 'Measure lift pump supply pressure at the inlet to the high-pressure pump', expect: 'Supply pressure within the engine specification — an underfed HP pump cannot build rail pressure', tools: ['Low-pressure gauge'] },
      { step: 5, action: 'Inspect the suction side for air ingress: loose unions, perished hose, a leaking filter seal or a cracked pickup', expect: 'No air bubbles visible in a clear section of the supply line', tools: ['Clear hose section'] },
      { step: 6, action: 'Read actual against commanded rail pressure on the service tool through a start and load', expect: 'Actual tracking commanded; a wide gap isolates the high-pressure side', tools: ['Service tool'] },
      { step: 7, action: 'Check the return flow from the injectors and from the pressure relief valve', expect: 'Return within specification — excessive return indicates a leaking injector or an open relief valve', tools: ['Return flow measuring kit'] },
    ],
    remedy: [
      'Replace fuel filters and drain the water separator, then bleed the system correctly',
      'Repair air ingress on the suction side — replace perished hose and reseal unions',
      'Replace a lift pump that cannot meet its supply pressure',
      'Replace a pressure relief valve that is venting rail pressure to return',
      'Replace injectors with excessive return leakage',
      'Refer the high-pressure pump for overhaul only once supply-side causes are eliminated',
    ],
    safety: [
      'Common-rail systems hold extreme pressure. Never slacken a high-pressure union on a running engine and observe the manufacturer\'s stand-down time before working on the rail',
      'A high-pressure fuel jet penetrates skin and causes serious injury — never search for a leak with your hand',
      'Diesel on hot exhaust components is a fire risk — clean spillage before restarting',
    ],
    tools: ['Service tool with live data', 'Low-pressure fuel gauge', 'Return flow measuring kit', 'Filter wrench'],
    preventive: ['Change fuel filters on the hours interval', 'Drain the water separator weekly', 'Keep tanks full during long shutdowns to limit condensation', 'Polish stored fuel where the set runs infrequently'],
  },
  {
    match: ['high fuel rail pressure', 'fuel rail pressure high'],
    system: 'Fuel',
    severity: 'critical',
    summary: 'Rail pressure is above the commanded value. The regulating element has lost control of the circuit — most often the pressure control valve, the rail pressure sensor reading low and causing over-correction, or a restricted return path. Sustained over-pressure stresses the rail, pipes and injectors.',
    symptoms: ['Rough running and harsh combustion noise', 'Smoke and poor combustion quality', 'Derate or shutdown on rail pressure protection', 'Fault recurring shortly after a reset'],
    diagnosis: [
      { step: 1, action: 'Read actual against commanded rail pressure on the service tool', expect: 'Actual above commanded confirms a regulation fault rather than a reporting artefact', tools: ['Service tool'] },
      { step: 2, action: 'Inspect the return line and its filter or restrictor for blockage', expect: 'Free return flow to tank', tools: [] },
      { step: 3, action: 'Test the pressure control or metering valve electrically and check its drive from the ECU', expect: 'Winding resistance within specification and a valid drive signal present', tools: ['Digital multimeter', 'Service tool'] },
      { step: 4, action: 'Assess the rail pressure sensor for a low-reading drift by comparing behaviour at known conditions', expect: 'Sensor plausible at key-on and at idle', tools: ['Service tool'] },
    ],
    remedy: ['Clear the restricted return path', 'Replace a failed pressure control or metering valve', 'Replace a drifting rail pressure sensor', 'Refer the high-pressure pump where control components test sound'],
    safety: ['Observe the stand-down period before opening any high-pressure component', 'Never slacken a rail union with the engine running'],
    tools: ['Service tool', 'Digital multimeter'],
    preventive: ['Maintain fuel cleanliness — contamination is what damages control valves', 'Replace filters on schedule'],
  },
  {
    match: ['fuel injector fault', 'engine injector failure', 'injector fault', 'injector failure'],
    system: 'Injection',
    severity: 'critical',
    summary: 'The ECU has detected a fault on an injector circuit. This is usually electrical — an open or shorted solenoid, or damaged harness — but can also be mechanical, where the injector is electrically sound and hydraulically failed. Establish which before ordering parts, because injectors are among the most expensive components on the engine to replace speculatively.',
    symptoms: ['Misfire, rough idle or uneven running', 'Loss of power and smoke', 'Knock or hunting at light load', 'Excess fuel returning from one cylinder'],
    diagnosis: [
      { step: 1, action: 'Identify which cylinder the code refers to and confirm against the firing order', expect: 'A specific cylinder identified rather than a general injector fault', tools: ['Service tool'] },
      { step: 2, action: 'Measure the injector solenoid resistance at the injector, not at the loom end', expect: 'Resistance within the engine specification and consistent with the other injectors', tools: ['Digital multimeter'] },
      { step: 3, action: 'Test the harness separately from the injector by disconnecting and re-measuring', expect: 'Separates a harness fault from an injector fault', tools: ['Digital multimeter'] },
      { step: 4, action: 'Measure return flow per injector under running conditions', expect: 'Return balanced across cylinders and within specification; one high return identifies a leaking injector', tools: ['Return flow measuring kit'] },
      { step: 5, action: 'Perform a cylinder cut-out or contribution test where the ECU supports it', expect: 'The suspect cylinder contributes measurably less', tools: ['Service tool'] },
      { step: 6, action: 'Where the injector is electrically sound, have it bench-tested for spray pattern and opening pressure', expect: 'Clean atomised pattern at the correct opening pressure', tools: ['Injector test bench'] },
    ],
    remedy: [
      'Repair or replace damaged harness and connectors where the fault is external to the injector',
      'Replace or recondition an injector that fails return-flow or bench testing',
      'Code new injectors to the ECU where the system requires trim or correction values — omitting this leaves the engine running badly on new parts',
      'Correct the fuel contamination that caused the failure, or the replacement will follow the original',
    ],
    safety: ['High-pressure fuel injection penetrates skin — never test a spray pattern in open air by hand', 'Observe the stand-down period before opening the high-pressure circuit', 'Keep ignition sources away from vented fuel'],
    tools: ['Digital multimeter', 'Service tool', 'Return flow measuring kit', 'Injector test bench'],
    preventive: ['Maintain fuel cleanliness and filter discipline', 'Drain water separators weekly', 'Record injector trim codes when they are fitted'],
  },
  {
    match: ['fuel temperature high', 'high fuel temperature', 'engine fuel temperature high'],
    system: 'Fuel',
    severity: 'warning',
    summary: 'Fuel is entering the injection system hotter than intended. Hot fuel is less dense, so the engine makes less power from the same commanded quantity, and many ECUs derate deliberately to protect the injection equipment. On generator installations the usual cause is a day-tank return arrangement that recirculates hot return fuel straight back to the suction.',
    symptoms: ['Loss of available power, often worse late in a long run', 'Derate reported by the ECU', 'Day tank noticeably warm to the touch', 'Fault appearing only on extended runs, not on short tests'],
    diagnosis: [
      { step: 1, action: 'Measure fuel temperature at the engine inlet and compare with the tank temperature', expect: 'Inlet not markedly hotter than tank; a large difference points at recirculation', tools: ['Contact thermometer'] },
      { step: 2, action: 'Trace the return line and establish where it enters the day tank', expect: 'Return entering at the top and separated from the suction point by a baffle, not discharging next to the pickup', tools: [] },
      { step: 3, action: 'Check day-tank capacity against the engine return rate and the run duration', expect: 'Tank large enough to allow return fuel to give up heat', tools: [] },
      { step: 4, action: 'Inspect any fuel cooler for blockage or airflow obstruction where one is fitted', expect: 'Clear core and unobstructed airflow', tools: ['Inspection light'] },
      { step: 5, action: 'Verify the temperature sensor against an independent probe', expect: 'Agreement within a few degrees', tools: ['Contact thermometer', 'Digital multimeter'] },
    ],
    remedy: ['Re-route the return to enter the tank away from the suction, with a baffle between them', 'Increase day-tank capacity or add a fuel cooler where the duty demands it', 'Improve engine-room ventilation where ambient is driving tank temperature', 'Replace a drifting fuel temperature sensor'],
    safety: ['Fuel system work must be done with the engine stopped and cool', 'Contain spillage — diesel on hot exhaust is a fire risk'],
    tools: ['Contact thermometer', 'Digital multimeter'],
    preventive: ['Design day-tank returns correctly at installation — this fault is almost always built in rather than developed', 'Keep the engine room within its design ambient'],
  },
  // ──────────────────────────────────────────────────────── AIR AND BOOST ──
  {
    match: ['turbo boost low', 'low turbo boost', 'boost pressure low', 'turbocharger boost low'],
    system: 'Air Intake',
    severity: 'critical',
    summary: 'Boost pressure is below the level expected for the fuel being delivered. The engine is short of air, so combustion is incomplete — the classic signature is black smoke with loss of power. Leaks in the charge-air path are more common than turbocharger failure and much cheaper to fix, so pressure-test before condemning the turbo.',
    symptoms: ['Loss of power, especially when load is applied', 'Black smoke under load', 'Turbo noise changed in pitch, or a whistle indicating a leak', 'Higher exhaust temperature for the same load'],
    diagnosis: [
      { step: 1, action: 'Check the air filter restriction indicator and inspect the element', expect: 'Restriction within limit — a blocked filter starves the compressor', tools: ['Inspection light'] },
      { step: 2, action: 'Inspect the entire charge-air path for leaks: hoses, clamps, the cooler and its end tanks', expect: 'No oil traces or soot marks at joints, which mark escaping charge air', tools: ['Inspection light'] },
      { step: 3, action: 'Pressure-test the charge-air system to find leaks not visible at rest', expect: 'System holds test pressure', tools: ['Charge-air pressure test kit'] },
      { step: 4, action: 'Compare actual boost against the engine specification at rated load using the service tool', expect: 'Boost within specification for that load and ambient', tools: ['Service tool'] },
      { step: 5, action: 'Check the wastegate or variable-geometry actuator for free movement and correct response to command', expect: 'Actuator strokes fully and follows the commanded position', tools: ['Service tool', 'Hand vacuum or air supply'] },
      { step: 6, action: 'Inspect the turbocharger for shaft play, wheel damage and oil leakage at both ends', expect: 'Minimal axial and radial play, undamaged wheels, no oil carry-over', tools: ['Dial indicator', 'Inspection light'] },
      { step: 7, action: 'Measure exhaust back-pressure where boost remains low with a sound turbo', expect: 'Back-pressure within specification — a blocked silencer or DPF starves the turbine', tools: ['Back-pressure gauge'] },
    ],
    remedy: ['Replace the air filter and correct the source of dust ingress', 'Repair charge-air leaks — replace perished hoses and renew clamps rather than over-tightening them', 'Free or replace a seized wastegate or VGT actuator', 'Replace or recondition a turbocharger with damaged wheels or excessive shaft play', 'Clear exhaust restriction where back-pressure is high'],
    safety: ['Turbocharger surfaces reach extreme temperatures — allow full cooling before handling', 'Never run the engine with the intake open; a dropped item destroys the compressor wheel'],
    tools: ['Charge-air pressure test kit', 'Service tool', 'Dial indicator', 'Back-pressure gauge'],
    preventive: ['Service air filters on restriction, not calendar', 'Allow the specified cool-down run before shutdown to protect turbo bearings', 'Keep oil changes on interval — turbo bearing failures usually begin as oil problems'],
  },
  {
    match: ['turbo overspeed', 'turbocharger overspeed'],
    system: 'Air Intake',
    severity: 'critical',
    summary: 'The turbocharger is rotating faster than its design limit. This is a genuine mechanical hazard — the compressor wheel can burst — and it usually results from the control system trying to make boost that the air path is not delivering, or from operation at altitude where the compressor must spin faster for the same pressure ratio.',
    symptoms: ['Turbo overspeed alarm or protective derate', 'Audible high-pitched turbo noise', 'Fault appearing at high load or at altitude', 'Boost reading inconsistent with turbo speed'],
    diagnosis: [
      { step: 1, action: 'Reduce load and stop the set if the alarm is active — do not continue running at high load', expect: 'Set brought to a safe condition', tools: [] },
      { step: 2, action: 'Inspect the intake and charge-air path for leaks downstream of the compressor', expect: 'No leaks — a downstream leak makes the control system demand ever more boost', tools: ['Charge-air pressure test kit'] },
      { step: 3, action: 'Verify the boost sensor reading against an independent gauge', expect: 'Agreement; a boost sensor reading low drives over-speed', tools: ['Pressure gauge'] },
      { step: 4, action: 'Check the VGT or wastegate position against command', expect: 'Actuator responding correctly and not stuck in a closed position', tools: ['Service tool'] },
      { step: 5, action: 'Confirm site altitude and ambient are within the engine derate assumptions', expect: 'Operation within the derating schedule for the site', tools: ['Engine derate data'] },
      { step: 6, action: 'Inspect the turbocharger for damage before returning to service', expect: 'Wheels undamaged, shaft play within limits', tools: ['Dial indicator', 'Inspection light'] },
    ],
    remedy: ['Repair charge-air leaks so the control system is no longer chasing lost pressure', 'Replace a boost sensor reading low', 'Free or replace a VGT actuator stuck closed', 'Apply the correct altitude derate for the site', 'Replace a turbocharger that has been over-sped and shows damage'],
    safety: ['A burst compressor wheel is a projectile hazard — do not run the set at load with an active overspeed alarm', 'Allow full cooling before inspection'],
    tools: ['Charge-air pressure test kit', 'Service tool', 'Dial indicator'],
    preventive: ['Pressure-test the charge-air system at major services', 'Apply site altitude derating at commissioning'],
  },
  {
    match: ['air filter restriction', 'air filter restricted', 'air inlet restriction'],
    system: 'Air Intake',
    severity: 'warning',
    summary: 'Differential pressure across the air filter has reached its limit. The element is doing its job and is now full. Left in place it starves the engine of air, which shows as black smoke, lost power and raised exhaust temperature. The correct trigger for replacement is this measurement, not the calendar.',
    symptoms: ['Restriction indicator showing red or latched', 'Black smoke and reduced power under load', 'Exhaust temperature higher than normal for the load', 'Visibly loaded element on inspection'],
    diagnosis: [
      { step: 1, action: 'Read the restriction indicator and inspect the element in good light', expect: 'Indicator consistent with the visual condition of the element', tools: ['Inspection light'] },
      { step: 2, action: 'Measure the actual differential across the filter at rated load where a gauge point exists', expect: 'Differential within the engine specification', tools: ['Manometer or differential gauge'] },
      { step: 3, action: 'Inspect the housing, seals and inlet ducting for leaks that admit unfiltered air', expect: 'Sealed path from filter to turbo — dust past the filter destroys the engine', tools: ['Inspection light'] },
      { step: 4, action: 'Identify why the element loaded early if the interval was short', expect: 'A site dust source, a damaged pre-cleaner or a missing rain cap identified', tools: [] },
    ],
    remedy: ['Replace the element — do not blow it out with compressed air, which damages the medium and drives dust through', 'Renew damaged seals and repair ducting so unfiltered air cannot bypass the filter', 'Fit or repair a pre-cleaner where site dust loading is high', 'Reset the restriction indicator after replacement'],
    safety: ['Stop the engine before opening the intake', 'Ensure nothing is left in the ducting — a dropped item will destroy the compressor wheel'],
    tools: ['Differential pressure gauge', 'Inspection light'],
    preventive: ['Change elements on measured restriction', 'Fit pre-cleaners on dusty sites', 'Inspect ducting and seals at every service'],
  },
  {
    match: ['manifold pressure sensor fault', 'manifold pressure sensor failure', 'boost pressure sensor fault'],
    system: 'Air Intake',
    severity: 'warning',
    summary: 'The ECU has rejected the signal from the intake manifold pressure sensor. Because this reading is used to set fuelling, a faulty sensor commonly produces poor running and smoke as well as the fault code. Distinguish a sensor failure from a wiring fault and from a blocked sensing passage before replacing anything.',
    symptoms: ['Manifold or boost pressure sensor fault code', 'Poor running, smoke or a derate', 'Implausible boost reading on the service tool', 'Fault appearing intermittently with vibration'],
    diagnosis: [
      { step: 1, action: 'Read the live sensor value with the engine stopped and the key on', expect: 'Approximately ambient barometric pressure — a value far from ambient at rest indicts the sensor or its circuit', tools: ['Service tool'] },
      { step: 2, action: 'Verify the sensor supply voltage at the connector', expect: 'Supply present and stable at the specified value', tools: ['Digital multimeter'] },
      { step: 3, action: 'Check the signal and ground circuits back to the ECU for continuity and shorts', expect: 'Continuity good, no short to supply or ground', tools: ['Digital multimeter'] },
      { step: 4, action: 'Inspect any sensing passage or port for blockage with oil or soot', expect: 'Clear passage to the manifold', tools: ['Inspection light'] },
      { step: 5, action: 'Disconnect the sensor and observe how the reported value changes', expect: 'A predictable open-circuit response, separating harness from sensor', tools: ['Service tool'] },
    ],
    remedy: ['Repair harness damage and corroded terminals before replacing the sensor', 'Clear a blocked sensing passage', 'Replace the sensor where supply and wiring test good', 'Clear the code and confirm the live value is plausible at rest and under load'],
    safety: ['Isolate the battery before disconnecting ECU connectors'],
    tools: ['Service tool', 'Digital multimeter'],
    preventive: ['Protect harnesses from chafing at every clamp and pass-through', 'Apply dielectric grease to sensor connectors in humid environments'],
  },
  // ─────────────────────────────────────────────────── SPEED AND POSITION ──
  {
    match: ['crankshaft position sensor fault', 'crankshaft position sensor failure', 'engine speed sensor failure', 'camshaft position sensor fault', 'camshaft position sensor failure', 'synchronization signal error (crankshaft/camshaft)'],
    system: 'Speed & Position',
    severity: 'critical',
    summary: 'The ECU has lost or rejected the crankshaft or camshaft position signal. These signals establish engine position, so a total loss usually prevents starting altogether and an intermittent loss produces sudden stops that are difficult to reproduce. Air gap and trigger-wheel condition are the first things to check — sensors are replaced far more often than they actually fail.',
    symptoms: ['Engine cranks but will not start', 'Sudden stop with no warning, then a normal restart', 'No or erratic engine speed displayed while cranking', 'Fault appearing with vibration or when hot'],
    diagnosis: [
      { step: 1, action: 'Inspect the sensor and its connector for damage, corrosion and security', expect: 'Clean, dry, undamaged connector fully latched', tools: ['Inspection light'] },
      { step: 2, action: 'Measure the sensor winding resistance where it is an inductive type', expect: 'Resistance within the engine specification; open or short condemns the sensor', tools: ['Digital multimeter'] },
      { step: 3, action: 'Check the air gap between sensor and trigger wheel against specification', expect: 'Gap within the specified range and even around the wheel', tools: ['Feeler gauge'] },
      { step: 4, action: 'Inspect the trigger wheel for damaged, missing or debris-packed teeth', expect: 'All teeth intact and clean; ferrous debris on a magnetic sensor tip is a common cause', tools: ['Inspection mirror', 'Inspection light'] },
      { step: 5, action: 'Capture the signal on an oscilloscope while cranking', expect: 'Clean, consistent waveform with the expected missing-tooth pattern', tools: ['Oscilloscope'] },
      { step: 6, action: 'Wiggle-test the harness while monitoring, especially where it passes near injector and starter cabling', expect: 'Signal stable under movement; interference indicates routing or screening problems', tools: ['Oscilloscope'] },
    ],
    remedy: ['Clean ferrous debris from the sensor tip and the trigger wheel', 'Set the air gap to specification', 'Repair or re-route harness damage and restore screening separation from high-current cabling', 'Replace the sensor where resistance or waveform testing condemns it', 'Repair or replace a damaged trigger wheel'],
    safety: ['Isolate the starting circuit before working near the flywheel or trigger wheel', 'Engine may start unexpectedly during signal testing — keep clear of rotating parts'],
    tools: ['Digital multimeter', 'Oscilloscope', 'Feeler gauge', 'Inspection mirror'],
    preventive: ['Check sensor security and air gap at major services', 'Keep signal cabling separated from power cabling', 'Inspect the trigger wheel whenever the flywheel housing is opened'],
  },
  {
    match: ['engine overspeed shutdown', 'engine overspeed', 'overspeed'],
    system: 'Speed & Position',
    severity: 'shutdown',
    summary: 'The engine exceeded its overspeed limit and the protection stopped it. This is a serious event: an overspeeding diesel can destroy itself, and on a generator set it also means the set was momentarily out of control of its load. Never simply reset and restart — establish why speed was not controlled first.',
    symptoms: ['Overspeed shutdown latched on the controller', 'Audible rise in engine speed before the stop', 'Event often coincident with a sudden load rejection', 'Possible mechanical damage in severe cases'],
    diagnosis: [
      { step: 1, action: 'Do not restart until the cause is understood. Record the event log and the conditions at the time.', expect: 'Event captured with load and speed data', tools: ['Service tool', 'Controller event log'] },
      { step: 2, action: 'Establish whether a large load was rejected at the moment of the event', expect: 'Load rejection explains a transient overspeed and points at governor response rather than a fault', tools: ['Controller log'] },
      { step: 3, action: 'Inspect the governor actuator and its linkage for freedom, wear and correct return', expect: 'Linkage free with no slack, returning fully to the low-fuel position', tools: ['Basic hand tools'] },
      { step: 4, action: 'Check governor settings and stability parameters against commissioning values', expect: 'Settings as commissioned and not altered', tools: ['Service tool'] },
      { step: 5, action: 'Verify the speed signal quality — a spurious high reading can trigger the trip without real overspeed', expect: 'Clean speed signal consistent with an independent measurement', tools: ['Oscilloscope', 'Tachometer'] },
      { step: 6, action: 'Inspect the engine for damage before returning it to service: valve train, pistons and turbo', expect: 'No evidence of contact or over-stress damage', tools: ['Borescope'] },
      { step: 7, action: 'Prove the overspeed protection itself functions correctly', expect: 'Protection trips at its set point during a controlled test', tools: ['Service tool'] },
    ],
    remedy: ['Repair or replace a sticking governor actuator or worn linkage', 'Restore governor settings to commissioned values and re-tune stability under load steps', 'Correct a faulty speed signal or sensor where the trip was spurious', 'Address the load-rejection behaviour — step-load management or a governor with faster response', 'Repair engine damage found before returning the set to service'],
    safety: ['Treat an overspeed as a potential mechanical failure — inspect before restarting', 'Keep personnel clear during any controlled overspeed protection test', 'Never disable overspeed protection to keep a set running'],
    tools: ['Service tool', 'Oscilloscope', 'Tachometer', 'Borescope'],
    preventive: ['Test overspeed protection at commissioning and periodically thereafter', 'Inspect governor linkage at every major service', 'Manage step loads within the set\'s acceptance capability'],
  },
  {
    match: ['engine underspeed', 'underspeed'],
    system: 'Speed & Position',
    severity: 'critical',
    summary: 'The engine is running below its target speed and cannot recover. On a generator set this directly drags output frequency down, so connected equipment is at risk as well as the engine. The engine is being asked for more torque than it can produce — because it is overloaded, starved of fuel or air, or because the governor is not commanding enough fuel.',
    symptoms: ['Speed and output frequency below target', 'Heavy black smoke as the engine struggles', 'Speed falling further as load increases', 'Underspeed alarm or shutdown'],
    diagnosis: [
      { step: 1, action: 'Measure the actual electrical load and compare against the set rating', expect: 'Load within rating — overload is the most common cause and the cheapest to confirm', tools: ['Clamp meter', 'Power quality meter'] },
      { step: 2, action: 'Check for fuel starvation: filter restriction, water in fuel and supply pressure', expect: 'Clean filters, no water, supply pressure within specification', tools: ['Low-pressure gauge', 'Filter wrench'] },
      { step: 3, action: 'Check air side restriction — filter condition and charge-air leaks', expect: 'Restriction within limit and no charge-air leaks', tools: ['Inspection light'] },
      { step: 4, action: 'Verify the governor actuator reaches its full-fuel position on demand', expect: 'Actuator strokes fully without binding', tools: ['Service tool'] },
      { step: 5, action: 'Read any active derate on the service tool', expect: 'Identifies a protective derate as the cause rather than a mechanical shortfall', tools: ['Service tool'] },
      { step: 6, action: 'If fuel, air and governing are sound, assess engine mechanical condition by compression test', expect: 'Compression even across cylinders and within specification', tools: ['Compression test kit'] },
    ],
    remedy: ['Reduce load to within the set rating, or uprate the set for the duty', 'Replace restricted fuel filters and correct water contamination', 'Repair air restriction and charge-air leaks', 'Repair a governor actuator that cannot reach full fuel', 'Resolve the underlying fault causing a protective derate', 'Refer for mechanical assessment where compression is low'],
    safety: ['Underspeed drags output frequency down — disconnect sensitive load before extended troubleshooting', 'Do not defeat protective derates to force the set to carry load'],
    tools: ['Clamp meter', 'Service tool', 'Compression test kit', 'Low-pressure fuel gauge'],
    preventive: ['Load-test at commissioning and after any load addition', 'Keep filter changes on the hours interval', 'Review connected load whenever equipment is added to the building'],
  },
  // ──────────────────────────────────────────────────────────── EXHAUST ──
  {
    match: ['exhaust temperature high', 'high exhaust temperature', 'exhaust gas temperature high', 'exhaust temperature sensor failure'],
    system: 'Exhaust',
    severity: 'critical',
    summary: 'Exhaust gas temperature is above its normal band. EGT is the most direct indicator of how hard the engine is working and how well it is burning fuel, so a high reading means either genuine overload, poor combustion, or restricted flow. Sustained high EGT damages valves, pistons and the turbine.',
    symptoms: ['High exhaust temperature alarm or derate', 'Loss of power accompanying the temperature rise', 'Visible smoke and audible change in exhaust note', 'Turbo housing glowing in severe cases'],
    diagnosis: [
      { step: 1, action: 'Measure the actual load and compare against the set rating and duty class', expect: 'Load within rating — overload is the first and most common explanation', tools: ['Clamp meter'] },
      { step: 2, action: 'Check air supply: filter restriction, charge-air leaks and intake temperature', expect: 'Adequate clean air at the expected boost and temperature', tools: ['Charge-air pressure test kit'] },
      { step: 3, action: 'Measure exhaust back-pressure at rated load', expect: 'Back-pressure within specification; a restricted silencer, long duct or loaded DPF raises EGT directly', tools: ['Back-pressure gauge'] },
      { step: 4, action: 'Assess combustion quality from exhaust appearance and fuel system condition', expect: 'Clean combustion; black smoke indicates over-fuelling or insufficient air', tools: ['Service tool'] },
      { step: 5, action: 'Compare EGT across cylinders or banks where individual measurement exists', expect: 'Even distribution; one high cylinder points at an injector', tools: ['Pyrometer', 'Service tool'] },
      { step: 6, action: 'Verify the sensor against an independent measurement before acting on the reading alone', expect: 'Agreement between sensor and independent probe', tools: ['Infrared or contact pyrometer'] },
    ],
    remedy: ['Reduce load to within rating', 'Restore air supply — replace filters and repair charge-air leaks', 'Clear exhaust restriction and correct undersized or over-long exhaust runs', 'Service or replace injectors producing poor combustion', 'Replace a failed EGT sensor once an independent probe disproves the reading'],
    safety: ['Exhaust components operate at extreme temperature and cause severe burns — allow full cooling', 'High EGT with visible glow is a fire risk; shut down and allow controlled cooling'],
    tools: ['Back-pressure gauge', 'Pyrometer', 'Clamp meter', 'Charge-air pressure test kit'],
    preventive: ['Design exhaust systems to the engine back-pressure limit at installation', 'Load-bank test annually and record EGT against load', 'Keep air filtration on measured restriction'],
  },
  {
    match: ['dpf high soot load', 'dpf soot load high', 'particulate filter blocked', 'dpf regeneration required'],
    system: 'Exhaust',
    severity: 'warning',
    summary: 'The diesel particulate filter has accumulated soot beyond its target level. On generator sets this is usually a duty-cycle problem rather than a component failure — a set that spends its life lightly loaded never reaches the exhaust temperature needed for passive regeneration, so soot accumulates until the engine derates. Distinguish soot, which burns off, from ash, which does not.',
    symptoms: ['High soot load warning or a regeneration request', 'Progressive loss of power as the derate deepens', 'Rising exhaust back-pressure', 'Repeated regeneration cycles at shortening intervals'],
    diagnosis: [
      { step: 1, action: 'Read soot load and ash load separately on the service tool', expect: 'Distinguishes a regenerable soot condition from an ash condition requiring service cleaning', tools: ['Service tool'] },
      { step: 2, action: 'Review the duty cycle — average load factor and typical run duration', expect: 'Identifies chronic light-load running as the underlying cause', tools: ['Controller logs'] },
      { step: 3, action: 'Check the differential pressure sensor and its sensing lines for blockage or damage', expect: 'Clear lines and a plausible differential reading', tools: ['Digital multimeter', 'Inspection light'] },
      { step: 4, action: 'Verify that exhaust temperature reaches the level required for regeneration during normal operation', expect: 'Temperature adequate for passive regeneration, or an active system functioning', tools: ['Service tool'] },
      { step: 5, action: 'Check for upstream faults that inhibit regeneration, such as injector or boost problems', expect: 'No active faults blocking the regeneration strategy', tools: ['Service tool'] },
    ],
    remedy: ['Carry out a service-tool initiated regeneration where conditions allow', 'Correct the duty cycle — schedule loaded exercise runs rather than no-load running', 'Replace or clear a blocked differential pressure sensing line', 'Send the filter for professional cleaning where ash load is high, since ash does not burn off', 'Resolve upstream engine faults preventing regeneration'],
    safety: ['Exhaust temperatures during regeneration are extremely high — keep the area clear and ensure discharge is safely directed', 'Do not carry out regeneration in an enclosed space or near flammable material'],
    tools: ['Service tool', 'Back-pressure gauge', 'Digital multimeter'],
    preventive: ['Run a monthly loaded exercise at a substantial proportion of nameplate', 'Right-size the set to the load rather than heavily oversizing', 'Track regeneration frequency as a maintenance indicator'],
  },
  {
    match: ['egr valve fault', 'egr valve failure', 'engine exhaust gas recirculation valve failure', 'actuator error egr-valve'],
    system: 'Emissions',
    severity: 'warning',
    summary: 'The EGR valve is not achieving its commanded position. The overwhelmingly common cause is carbon build-up making the valve stick mechanically, which the ECU reports as a control fault. Establish whether the valve is electrically faulty or simply seized before replacing it.',
    symptoms: ['EGR valve position or control fault code', 'Rough running, smoke or a derate', 'Loss of power under load', 'Fault clearing temporarily after a reset and then returning'],
    diagnosis: [
      { step: 1, action: 'Command the valve through its full travel with the service tool and compare position feedback against command', expect: 'Feedback tracks command smoothly through the full range', tools: ['Service tool'] },
      { step: 2, action: 'Measure the actuator winding resistance and check the drive circuit', expect: 'Resistance within specification and a valid drive present', tools: ['Digital multimeter'] },
      { step: 3, action: 'Remove and inspect the valve for carbon build-up and check it moves freely by hand', expect: 'Valve free through full travel; heavy deposits confirm mechanical sticking', tools: ['Basic hand tools', 'Inspection light'] },
      { step: 4, action: 'Inspect the EGR cooler and passages for restriction', expect: 'Clear gas path; a blocked cooler loads the valve and raises temperatures', tools: ['Inspection light'] },
      { step: 5, action: 'Check the position feedback sensor separately from the actuator', expect: 'Plausible feedback across the travel range', tools: ['Digital multimeter', 'Service tool'] },
    ],
    remedy: ['Clean carbon deposits from the valve and seat where the actuator tests sound', 'Clear or replace a blocked EGR cooler', 'Replace the valve assembly where the actuator or feedback sensor is genuinely failed', 'Address the underlying poor combustion that accelerated the carbon build-up'],
    safety: ['EGR components run extremely hot — allow full cooling before removal', 'Carbon dust is a respiratory irritant; avoid breathing it during cleaning'],
    tools: ['Service tool', 'Digital multimeter', 'Basic hand tools'],
    preventive: ['Clean the EGR valve during major services on engines with a history of sticking', 'Maintain injector condition, since poor combustion accelerates deposits', 'Avoid chronic light-load running, which increases deposit formation'],
  },
  // ─────────────────────────────────────────────────────────── ELECTRICAL ──
  {
    match: ['alternator under voltage', 'alternator undervoltage', 'low battery voltage', 'charge alternator failure', 'battery charging fault'],
    system: 'Electrical',
    severity: 'critical',
    summary: 'The charging system is not maintaining battery voltage. On a standby generator this is the single most consequential electrical fault, because the set will start and run perfectly during a test and then fail to start on the day it is needed. The battery is the most common failure point on standby plant, and charging faults are what kill batteries.',
    symptoms: ['Charge failure or low battery voltage alarm', 'Slow cranking, worsening over weeks', 'Battery requiring frequent replacement', 'Set failing to start on demand despite passing recent tests'],
    diagnosis: [
      { step: 1, action: 'Measure battery voltage at rest, then with the engine running', expect: 'A clear rise when running — no rise means the charging path is not working', tools: ['Digital multimeter'] },
      { step: 2, action: 'Measure charging voltage at the battery terminals and again at the alternator output', expect: 'A significant difference between the two indicates cable or connection resistance rather than an alternator fault', tools: ['Digital multimeter'] },
      { step: 3, action: 'Inspect and clean the battery terminals, earth strap and charging cable connections', expect: 'Clean, tight, corrosion-free connections with a sound earth path', tools: ['Terminal brush', 'Spanners'] },
      { step: 4, action: 'Check the charging alternator drive belt for tension, glazing and slip', expect: 'Correct tension, no glazing, no slip under load', tools: ['Belt tension gauge'] },
      { step: 5, action: 'Where a mains-powered float charger is fitted, verify its output independently of the engine', expect: 'Charger delivering its rated float voltage', tools: ['Digital multimeter'] },
      { step: 6, action: 'Load-test the battery, or measure its capacity, rather than judging it on voltage alone', expect: 'Battery holding capacity above its replacement threshold', tools: ['Battery load tester'] },
    ],
    remedy: ['Clean and re-terminate corroded connections and apply protective grease — this resolves a large share of charging complaints', 'Replace or re-tension a slipping drive belt', 'Replace a failed charging alternator or its regulator', 'Replace a failed float charger on standby installations', 'Replace batteries that fail a capacity test rather than waiting for a no-start'],
    safety: ['Batteries produce explosive hydrogen — no sparks or flames, and disconnect the earth lead first', 'Battery acid causes burns; wear eye protection', 'Ensure the set cannot start while working on the charging system'],
    tools: ['Digital multimeter', 'Battery load tester', 'Belt tension gauge', 'Terminal brush'],
    preventive: ['Test battery capacity annually rather than relying on voltage', 'Keep terminals clean and greased', 'Verify float charger operation at every service', 'Record battery installation dates so age is known'],
  },
  {
    match: ['alternator over voltage', 'alternator overvoltage', 'high battery voltage'],
    system: 'Electrical',
    severity: 'critical',
    summary: 'Charging voltage is above the safe band. Over-charging boils electrolyte out of the battery, shortens its life dramatically and can damage the connected control electronics. The voltage regulator or its sensing connection is almost always responsible.',
    symptoms: ['High battery voltage alarm', 'Batteries needing frequent topping up, or a hot battery case', 'Electrolyte smell in the battery compartment', 'Repeated failures of control electronics'],
    diagnosis: [
      { step: 1, action: 'Measure charging voltage at the battery terminals with the engine running', expect: 'Voltage within the specified band for the system and temperature', tools: ['Digital multimeter'] },
      { step: 2, action: 'Check the regulator sensing connection where the regulator senses remotely', expect: 'Sound sensing connection — a poor sense lead makes the regulator over-compensate', tools: ['Digital multimeter'] },
      { step: 3, action: 'Verify any temperature compensation is functioning where fitted', expect: 'Compensation reducing voltage appropriately as temperature rises', tools: ['Digital multimeter'] },
      { step: 4, action: 'Test the float charger output separately from the engine-driven alternator', expect: 'Identifies which source is over-charging', tools: ['Digital multimeter'] },
      { step: 5, action: 'Inspect the batteries for damage from over-charging before returning to service', expect: 'No case distortion, excessive heat or electrolyte loss', tools: ['Inspection light'] },
    ],
    remedy: ['Repair the regulator sensing connection', 'Replace a failed voltage regulator or charging alternator', 'Replace an over-charging float charger', 'Replace batteries damaged by sustained over-charging'],
    safety: ['Over-charged batteries vent hydrogen aggressively — ventilate before working', 'Hot batteries can rupture; allow cooling and approach with care'],
    tools: ['Digital multimeter', 'Battery load tester'],
    preventive: ['Verify charging voltage at every service', 'Fit temperature-compensated charging in hot environments'],
  },
  {
    match: ['ecm power supply fault', 'control panel power supply failure', 'ecu power supply fault'],
    system: 'Control',
    severity: 'critical',
    summary: 'The engine controller has detected a problem with its own supply. Because every sensor reading and every output depends on a stable supply, this fault frequently appears alongside a scatter of unrelated-looking sensor codes. Diagnose the supply first — replacing sensors while the supply is unstable wastes parts and time.',
    symptoms: ['ECU power supply fault, often with multiple other sensor codes at once', 'Controller resetting, or display dropping out under vibration or cranking', 'Intermittent faults that clear and return without pattern', 'Loss of stored data or event log'],
    diagnosis: [
      { step: 1, action: 'Measure supply voltage at the controller connector, not at the battery, with the engine stopped and again while cranking', expect: 'Voltage holding within the controller specification through cranking', tools: ['Digital multimeter'] },
      { step: 2, action: 'Measure voltage drop along the supply and ground paths under load', expect: 'Minimal drop — a significant drop identifies resistance in a cable or terminal', tools: ['Digital multimeter'] },
      { step: 3, action: 'Inspect and clean the controller ground connection to the block or frame', expect: 'Clean, tight, low-resistance earth', tools: ['Terminal brush', 'Spanners'] },
      { step: 4, action: 'Inspect the connector for corrosion, moisture, backed-out or spread pins', expect: 'Clean dry pins with correct tension, fully latched', tools: ['Inspection light', 'Pin tension tool'] },
      { step: 5, action: 'Wiggle-test the supply harness while monitoring voltage', expect: 'Stable voltage under movement; instability identifies an intermittent connection', tools: ['Digital multimeter'] },
      { step: 6, action: 'Check for supply disturbance from the charging system or from a failing battery', expect: 'Clean supply without excessive ripple or excursion', tools: ['Oscilloscope'] },
    ],
    remedy: ['Clean and re-terminate the ground and supply connections and protect them against moisture', 'Repair or replace harness sections with excessive voltage drop', 'Replace corroded connectors rather than attempting repeated cleaning', 'Correct a charging system fault producing supply disturbance', 'Replace the controller only once supply, ground and harness are proven sound'],
    safety: ['Isolate the battery before disconnecting controller connectors', 'Protect the controller from static discharge when handling'],
    tools: ['Digital multimeter', 'Oscilloscope', 'Terminal brush', 'Inspection light'],
    preventive: ['Inspect and grease control connections annually', 'Keep the controller enclosure sealed against moisture and dust', 'Address charging faults promptly, since they propagate into control electronics'],
  },
  {
    match: ['ecm internal memory error', 'control panel memory error', 'ecu internal fault', 'ecm internal hardware failure'],
    system: 'Control',
    severity: 'critical',
    summary: 'The controller has failed an internal self-check. Before accepting that the module has failed, rule out the two things that commonly cause a genuine module to report an internal fault: an unstable supply and an interrupted software or calibration operation. Record the fault history before clearing anything, because clearing it discards the evidence.',
    symptoms: ['Internal memory or hardware fault reported by the controller', 'Erratic behaviour, unexpected resets or a frozen display', 'Settings or calibration not retained through a power cycle', 'Loss of communication with other modules'],
    diagnosis: [
      { step: 1, action: 'Record all active and stored faults and the event history before clearing anything', expect: 'Evidence preserved for diagnosis and for any warranty claim', tools: ['Service tool'] },
      { step: 2, action: 'Verify supply voltage stability at the controller through cranking and load', expect: 'Stable supply within specification — an unstable supply causes genuine internal faults', tools: ['Digital multimeter', 'Oscilloscope'] },
      { step: 3, action: 'Check the controller ground integrity', expect: 'Low-resistance ground to the block or frame', tools: ['Digital multimeter'] },
      { step: 4, action: 'Establish whether a software or calibration update was interrupted', expect: 'Identifies an incomplete flash as the cause, which is recoverable', tools: ['Service tool'] },
      { step: 5, action: 'Inspect for moisture ingress, heat damage and physical damage to the module', expect: 'Dry, undamaged module mounted within its temperature environment', tools: ['Inspection light'] },
      { step: 6, action: 'Attempt a controlled re-flash of software and calibration where the manufacturer supports it', expect: 'Successful completion clears a corrupted-memory condition', tools: ['Service tool'] },
    ],
    remedy: ['Correct supply and ground faults first', 'Re-flash software and calibration where an interrupted update is the cause', 'Improve mounting or ventilation where heat is implicated', 'Seal against moisture ingress', 'Replace the controller where self-test continues to fail after supply, ground and software are proven, and re-load the correct calibration for the engine build'],
    safety: ['Isolate the battery before removing the controller', 'Observe static-discharge precautions', 'Ensure the engine cannot start while the control system is disconnected'],
    tools: ['Service tool', 'Digital multimeter', 'Oscilloscope'],
    preventive: ['Maintain a stable, well-grounded supply', 'Never interrupt a software update — ensure a reliable supply before starting one', 'Keep a record of the calibration part number fitted to each set'],
  },
  {
    match: ['can communication loss - ecm to panel', 'can communication loss - ecm to governor', 'can communication loss', 'ats communication error', 'communication failure'],
    system: 'Control',
    severity: 'critical',
    summary: 'Two modules that should be exchanging data over the CAN bus have lost contact. On a generator set this typically breaks the link between the engine ECU and the control panel or governor, so the panel can no longer read engine data or command speed. Bus faults are physical far more often than they are software: termination, wiring and connectors account for most cases.',
    symptoms: ['Communication loss alarm between named devices', 'Engine data missing or frozen on the panel display', 'Loss of speed control or inability to start remotely', 'Fault appearing intermittently with vibration or temperature'],
    diagnosis: [
      { step: 1, action: 'Confirm both modules have power and ground', expect: 'A module without power cannot communicate — check this before the bus itself', tools: ['Digital multimeter'] },
      { step: 2, action: 'With everything powered down, measure resistance across CAN-High and CAN-Low', expect: 'Approximately 60 ohms, representing two 120 ohm terminators in parallel. Around 120 ohms means one terminator is missing; a very low or very high reading indicates a short or an open bus.', tools: ['Digital multimeter'] },
      { step: 3, action: 'Inspect the bus wiring for damage, and check that the twisted pair remains twisted and screened where specified', expect: 'Intact twisted pair with screening earthed at one point only', tools: ['Inspection light'] },
      { step: 4, action: 'Inspect connectors at each node for corrosion, moisture and pin tension', expect: 'Clean dry pins, fully latched connectors', tools: ['Inspection light', 'Pin tension tool'] },
      { step: 5, action: 'Check bus routing relative to power cabling, particularly starter and injector cables', expect: 'Separation maintained; a bus routed alongside high-current cabling picks up interference', tools: [] },
      { step: 6, action: 'Wiggle-test the harness at each connector while monitoring communication status', expect: 'Communication stable under movement', tools: ['Service tool'] },
      { step: 7, action: 'Where the bus is physically sound, verify that module software and baud rate settings are compatible', expect: 'Matched configuration across nodes', tools: ['Service tool'] },
    ],
    remedy: ['Restore correct termination — fit or replace a missing or failed terminating resistor', 'Repair damaged bus wiring, maintaining the twisted pair and screening arrangement', 'Replace corroded connectors and restore pin tension', 'Re-route the bus away from high-current cabling', 'Correct mismatched module configuration or software versions', 'Replace a node that will not communicate once wiring and termination are proven'],
    safety: ['Isolate before disconnecting module connectors', 'A set may behave unpredictably when communication is restored — ensure the area is clear before reconnecting'],
    tools: ['Digital multimeter', 'Service tool', 'Oscilloscope', 'Inspection light'],
    preventive: ['Verify 60 ohm termination at commissioning and record it', 'Maintain separation between signal and power cabling', 'Inspect and protect connectors at annual service'],
  },
  // ────────────────────────────────────────────── STARTING AND AUXILIARIES ──
  {
    match: ['starter relay failure', 'starter motor fault', 'fail to crank', 'engine fails to crank'],
    system: 'Starting',
    severity: 'critical',
    summary: 'The engine is not cranking on demand. On standby plant this is discovered at the worst possible moment, so it deserves systematic diagnosis rather than parts replacement. Work outward from the battery: most no-crank faults are supply, connection or relay problems rather than a failed starter motor.',
    symptoms: ['No crank on the start command, or a single click', 'Slow or laboured cranking', 'Starter engaging then dropping out', 'Intermittent starting that worsens over time'],
    diagnosis: [
      { step: 1, action: 'Measure battery voltage at rest and again during the crank attempt', expect: 'Voltage holding above the minimum for the system during cranking; a large collapse indicts the battery', tools: ['Digital multimeter'] },
      { step: 2, action: 'Measure voltage drop across each connection in the starting circuit while cranking', expect: 'Minimal drop across each joint; a significant drop locates the bad connection precisely', tools: ['Digital multimeter'] },
      { step: 3, action: 'Verify the start command reaches the starter solenoid', expect: 'Command voltage present at the solenoid when start is requested', tools: ['Digital multimeter'] },
      { step: 4, action: 'Check the control switch position and any start interlocks or emergency stops in the circuit', expect: 'Controller in the correct mode and no interlock inhibiting the start', tools: ['Service tool'] },
      { step: 5, action: 'Test the starter relay and its drive circuit', expect: 'Relay operating with a valid coil drive and clean contacts', tools: ['Digital multimeter'] },
      { step: 6, action: 'Inspect the ring gear and starter pinion for damaged teeth where engagement is noisy or intermittent', expect: 'Undamaged teeth and clean engagement', tools: ['Inspection light', 'Barring tool'] },
    ],
    remedy: ['Clean and re-terminate high-resistance connections — this is the most common fix and costs nothing but time', 'Replace batteries that fail a capacity test', 'Replace a failed starter relay or solenoid', 'Repair the start command circuit or a failed interlock', 'Replace the starter motor once supply, command and connections are proven', 'Repair ring gear damage before it prevents starting entirely'],
    safety: ['Isolate before working on starting circuits — the engine can start unexpectedly', 'Starter circuits carry very high current; a shorted spanner will weld and burn', 'Batteries vent hydrogen; avoid sparks at the terminals'],
    tools: ['Digital multimeter', 'Battery load tester', 'Terminal brush', 'Barring tool'],
    preventive: ['Test start the set on a schedule and log cranking behaviour', 'Test battery capacity annually', 'Keep starting-circuit connections clean and protected'],
  },
  {
    match: ['fuel solenoid valve failure', 'fuel solenoid fault', 'fuel shutoff valve fault'],
    system: 'Fuel',
    severity: 'critical',
    summary: 'The fuel shutoff or run solenoid is not operating correctly. A solenoid that fails to energise prevents the engine starting; one that fails to de-energise prevents it stopping, which is the more serious condition because it defeats a safety function.',
    symptoms: ['Engine cranks but will not fire', 'Engine will not stop on command', 'No audible click from the solenoid at the start command', 'Intermittent starting and stopping behaviour'],
    diagnosis: [
      { step: 1, action: 'Listen and feel for solenoid operation at the start command', expect: 'A distinct operation felt or heard at the solenoid', tools: [] },
      { step: 2, action: 'Measure the voltage at the solenoid terminals during the start command', expect: 'Full system voltage present when commanded', tools: ['Digital multimeter'] },
      { step: 3, action: 'Measure the solenoid winding resistance', expect: 'Within specification; open or shorted condemns the solenoid', tools: ['Digital multimeter'] },
      { step: 4, action: 'Where a pull and hold arrangement is used, verify both circuits independently', expect: 'Both windings healthy and correctly sequenced', tools: ['Digital multimeter'] },
      { step: 5, action: 'Check the mechanical linkage or plunger for freedom and correct travel', expect: 'Free movement through full travel without binding', tools: ['Basic hand tools'] },
    ],
    remedy: ['Repair the supply or control circuit where voltage is not reaching the solenoid', 'Replace a solenoid that fails resistance testing', 'Free or replace a binding linkage or plunger', 'Verify the engine stops correctly on command before returning the set to service'],
    safety: ['An engine that will not shut down on command is a serious hazard — establish a manual means of stopping it before any test', 'Isolate before working on fuel system electrics'],
    tools: ['Digital multimeter', 'Basic hand tools'],
    preventive: ['Function-test the shutdown solenoid at every service', 'Keep linkages clean and free'],
  },
  {
    match: ['engine preheating relay failure', 'glow plug fault', 'inlet air heater fault', 'preheat failure'],
    system: 'Starting',
    severity: 'warning',
    summary: 'The cold-start aid is not operating. The engine will usually still start in warm conditions, so the fault is often ignored until a cold morning, when it presents as prolonged cranking, white smoke and heavy fuel dilution of the oil.',
    symptoms: ['Preheat or glow relay fault code', 'Hard starting when cold, easy starting when warm', 'White smoke and rough running for the first minutes', 'Extended cranking before firing'],
    diagnosis: [
      { step: 1, action: 'Confirm the preheat command is issued by the controller under cold conditions', expect: 'Command present for the expected duration', tools: ['Service tool'] },
      { step: 2, action: 'Measure voltage at the heater or glow plug supply during the preheat period', expect: 'Full supply voltage present while commanded', tools: ['Digital multimeter'] },
      { step: 3, action: 'Measure current draw during preheat', expect: 'Current consistent with the number of elements — a low reading indicates open elements', tools: ['Clamp meter'] },
      { step: 4, action: 'Test individual glow plugs or heater elements for continuity', expect: 'Each element within its resistance specification', tools: ['Digital multimeter'] },
      { step: 5, action: 'Test the preheat relay and its drive circuit', expect: 'Relay operating cleanly with a valid coil drive', tools: ['Digital multimeter'] },
    ],
    remedy: ['Replace failed glow plugs or heater elements', 'Replace a failed preheat relay', 'Repair the supply circuit where voltage is absent', 'Verify cold-start performance after repair rather than assuming it'],
    safety: ['Heater elements remain hot after operation — allow cooling', 'Isolate before working on the preheat circuit'],
    tools: ['Digital multimeter', 'Clamp meter', 'Service tool'],
    preventive: ['Test the preheat system before the cold season on sites that experience one', 'Replace glow plugs as a set rather than individually'],
  },
  {
    match: ['fuel pump relay failure', 'fuel pump fault', 'lift pump failure'],
    system: 'Fuel',
    severity: 'critical',
    summary: 'The fuel transfer or lift pump circuit has failed. Without adequate supply pressure the high-pressure pump cannot build rail pressure, so this presents as hard starting, loss of power and often a low rail pressure code alongside it.',
    symptoms: ['Fuel pump relay or circuit fault code', 'Hard starting or failure to start', 'Loss of power under load', 'Low rail pressure faults appearing at the same time'],
    diagnosis: [
      { step: 1, action: 'Listen for pump operation at key-on where the system primes', expect: 'Audible pump run for the priming period', tools: [] },
      { step: 2, action: 'Measure supply voltage at the pump during operation', expect: 'Full system voltage present when commanded', tools: ['Digital multimeter'] },
      { step: 3, action: 'Measure pump current draw', expect: 'Within specification — high current indicates a seizing pump, low or none indicates an open circuit', tools: ['Clamp meter'] },
      { step: 4, action: 'Measure delivered fuel pressure at the inlet to the high-pressure pump', expect: 'Supply pressure within the engine specification', tools: ['Low-pressure fuel gauge'] },
      { step: 5, action: 'Test the relay and its control circuit', expect: 'Relay operating with a valid drive and clean contacts', tools: ['Digital multimeter'] },
      { step: 6, action: 'Check filters and the suction path for restriction that loads the pump', expect: 'Clean filters and an unrestricted suction path', tools: ['Filter wrench'] },
    ],
    remedy: ['Replace a failed relay', 'Repair the supply or control circuit', 'Replace a pump that cannot deliver its specified pressure', 'Replace restricted filters and clear the suction path', 'Bleed the system correctly after any fuel system work'],
    safety: ['Contain fuel spillage and keep it away from hot exhaust components', 'Isolate before working on fuel system electrics'],
    tools: ['Digital multimeter', 'Clamp meter', 'Low-pressure fuel gauge', 'Filter wrench'],
    preventive: ['Change fuel filters on the hours interval', 'Keep the tank free of water and sediment'],
  },
  {
    match: ['governor failure', 'governor fault', 'engine throttle actuator failure', 'actuator fault'],
    system: 'Control',
    severity: 'critical',
    summary: 'The speed-governing element is not controlling engine speed correctly. On a generator set this directly affects output frequency and the ability to accept load, so it is both an engine problem and a power-quality problem. Distinguish an electrical actuator fault from a mechanically bound linkage before replacing the actuator.',
    symptoms: ['Speed hunting or instability, particularly on load change', 'Inability to reach or hold rated speed', 'Frequency wandering outside acceptable limits', 'Actuator or governor fault code'],
    diagnosis: [
      { step: 1, action: 'Observe speed and frequency behaviour at no load and through load steps', expect: 'Characterises the fault as hunting, drift or failure to respond', tools: ['Power quality meter', 'Service tool'] },
      { step: 2, action: 'Check the actuator and linkage move freely through full travel by hand with the engine stopped', expect: 'Free movement with no binding and full return', tools: ['Basic hand tools'] },
      { step: 3, action: 'Measure the actuator winding resistance and verify the drive signal from the controller', expect: 'Resistance within specification and a valid drive present', tools: ['Digital multimeter', 'Oscilloscope'] },
      { step: 4, action: 'Verify the speed feedback signal quality', expect: 'Clean, stable speed signal — the governor cannot control on a noisy input', tools: ['Oscilloscope'] },
      { step: 5, action: 'Compare governor gain and stability settings against commissioning values', expect: 'Settings as commissioned; drifted settings explain hunting without any component failure', tools: ['Service tool'] },
      { step: 6, action: 'Rule out fuel restriction, which mimics a governing fault under load', expect: 'Fuel supply adequate through the load range', tools: ['Low-pressure fuel gauge'] },
    ],
    remedy: ['Free or replace a binding linkage and correct any wear or slack', 'Replace a failed actuator once wiring and drive are proven', 'Restore governor settings to commissioned values and re-tune under real load steps', 'Correct a noisy or intermittent speed signal', 'Resolve fuel restriction where it is the underlying cause'],
    safety: ['Keep clear of linkages during testing — they move without warning', 'A governing fault can produce overspeed; ensure overspeed protection is functional before extended testing'],
    tools: ['Service tool', 'Digital multimeter', 'Oscilloscope', 'Power quality meter'],
    preventive: ['Record governor settings at commissioning', 'Inspect linkage freedom at every major service', 'Re-verify stability after any load change on site'],
  },
  {
    match: ['alternator circuit breaker trip', 'generator breaker trip', 'output breaker trip'],
    system: 'Electrical',
    severity: 'critical',
    summary: 'The generator output breaker has tripped. The breaker did its job — the task is to establish what it was protecting against. Resetting without diagnosis risks repeating the fault into a genuine short circuit or overload.',
    symptoms: ['Output breaker tripped and load lost', 'Trip occurring on load application or under sustained load', 'Possible protective relay indication accompanying the trip', 'Repeated trips after reset'],
    diagnosis: [
      { step: 1, action: 'Record the protection indication and any relay targets before resetting anything', expect: 'The protection function that operated identified — overcurrent, earth fault, reverse power or another', tools: ['Controller log'] },
      { step: 2, action: 'Measure the load current per phase and compare against the set rating', expect: 'Load within rating and reasonably balanced across phases', tools: ['Clamp meter'] },
      { step: 3, action: 'Insulation-test the outgoing circuits before re-energising where a short is suspected', expect: 'Insulation resistance within acceptable limits', tools: ['Insulation tester'] },
      { step: 4, action: 'Check the protection settings against the coordination study and the set rating', expect: 'Settings correct and graded against downstream devices', tools: ['Protection settings record'] },
      { step: 5, action: 'Inspect the breaker contacts for damage or welding', expect: 'Clean contacts operating correctly', tools: ['Inspection light'] },
      { step: 6, action: 'Where the trip occurred on load application, assess the starting current of the connected load', expect: 'Inrush within the set and breaker capability', tools: ['Power quality meter'] },
    ],
    remedy: ['Locate and repair the fault on the outgoing circuit before re-energising', 'Reduce or redistribute load where the set is overloaded or unbalanced', 'Correct protection settings that are mis-graded', 'Replace a damaged breaker', 'Apply soft starting or step loading where inrush is causing the trip'],
    safety: ['Treat all generator terminals as live until proven dead and isolated', 'A generator can be back-energised from the load side — prove dead at the point of work', 'Insulation testing requires the circuit to be isolated and equipment disconnected'],
    tools: ['Clamp meter', 'Insulation tester', 'Power quality meter'],
    preventive: ['Keep a protection settings record and verify after any change', 'Load-test annually', 'Review connected load whenever equipment is added'],
  },
  {
    match: ['engine cooling fan failure', 'alternator cooling fan failure', 'cooling fan fault'],
    system: 'Cooling',
    severity: 'critical',
    summary: 'A cooling fan is not operating correctly. Because the fault only manifests as overheating once the set is loaded, it is frequently discovered during an outage rather than during a no-load test. Check drive, control and obstruction in that order.',
    symptoms: ['Fan fault code, or overheating only under load', 'Fan not turning, or turning slowly', 'Audible belt slip or squeal', 'Coolant or alternator temperature rising with load'],
    diagnosis: [
      { step: 1, action: 'Observe the fan during a loaded run from a safe position', expect: 'Fan turning at the expected speed and direction', tools: [] },
      { step: 2, action: 'Check belt condition and tension where belt driven', expect: 'Correct tension, no glazing, no slip under load', tools: ['Belt tension gauge'] },
      { step: 3, action: 'Where an electric fan is fitted, verify supply voltage and current at the motor', expect: 'Supply present and current within specification', tools: ['Digital multimeter', 'Clamp meter'] },
      { step: 4, action: 'Test the fan control circuit, thermostat or clutch engagement', expect: 'Fan commanded on at the correct temperature and engaging fully', tools: ['Service tool', 'Digital multimeter'] },
      { step: 5, action: 'Inspect for obstruction, damaged blades and guard interference', expect: 'Undamaged blades and clear airflow path', tools: ['Inspection light'] },
    ],
    remedy: ['Replace or re-tension a slipping belt', 'Replace a failed fan motor or clutch', 'Repair the fan control circuit or replace a failed thermostat', 'Clear obstructions and replace damaged blades', 'Verify the repair under real load, not at no load'],
    safety: ['Never work near a fan that could start under thermostatic or automatic control — isolate first', 'A damaged fan blade can disintegrate at speed; replace rather than repair'],
    tools: ['Belt tension gauge', 'Digital multimeter', 'Clamp meter', 'Service tool'],
    preventive: ['Inspect belts at every service and replace on age', 'Test fan operation under load during annual load-bank testing'],
  },
  {
    match: ['fuel level sensor failure', 'fuel level sensor fault', 'low fuel level'],
    system: 'Fuel',
    severity: 'warning',
    summary: 'The fuel level indication is faulty or the level is genuinely low. On standby plant a level fault matters more than it appears: the set may report adequate fuel and then run out during an extended outage. Confirm the real level physically before assuming a sensor fault, and treat unexplained losses as possible theft or leakage rather than sender drift.',
    symptoms: ['Implausible or frozen level reading', 'Level alarm with a visibly full tank, or the reverse', 'Reading jumping erratically with vibration', 'Fuel consumption not matching run hours'],
    diagnosis: [
      { step: 1, action: 'Dip the tank physically and compare against the indicated level', expect: 'Establishes whether the fault is in the reading or the fuel', tools: ['Dip stick or tape'] },
      { step: 2, action: 'Where the level is genuinely low, reconcile consumption against run hours', expect: 'Consumption consistent with load and hours; a large discrepancy indicates leakage or theft', tools: ['Controller run-hour log'] },
      { step: 3, action: 'Inspect the tank, pipework and fittings for leaks', expect: 'No wet joints, staining or ground contamination', tools: ['Inspection light'] },
      { step: 4, action: 'Measure sender resistance through its travel where accessible', expect: 'Smooth resistance change across the range without dead spots', tools: ['Digital multimeter'] },
      { step: 5, action: 'Check sender wiring and ground for continuity and corrosion', expect: 'Sound wiring with a good ground reference', tools: ['Digital multimeter'] },
    ],
    remedy: ['Replace a sender that shows dead spots or an implausible characteristic', 'Repair wiring and restore the ground reference', 'Repair fuel leaks found and secure the installation where loss is unexplained', 'Refill and re-verify the indication across the range'],
    safety: ['No ignition sources near an open tank', 'Fuel vapour accumulates in confined spaces — ventilate before working', 'Contain spillage away from drains'],
    tools: ['Digital multimeter', 'Dip tape', 'Inspection light'],
    preventive: ['Reconcile fuel consumption against run hours monthly so losses become visible', 'Secure tanks and fill points on exposed sites', 'Verify level indication at each service'],
  },
  {
    match: ['control panel display failure', 'display fault', 'hmi failure'],
    system: 'Control',
    severity: 'warning',
    summary: 'The control panel display has failed or become unreadable. The set may continue to run and protect itself normally, but the operator has lost visibility, which makes safe operation and fault diagnosis considerably harder. Treat the loss of indication as a genuine operational risk even where the engine is unaffected.',
    symptoms: ['Blank, frozen, dim or corrupted display', 'Backlight failed but data still present', 'Display resetting intermittently', 'Controls responding while indication is absent'],
    diagnosis: [
      { step: 1, action: 'Confirm the controller itself is powered and operating, separately from the display', expect: 'Establishes whether this is a display fault or a controller fault', tools: ['Digital multimeter'] },
      { step: 2, action: 'Measure supply voltage at the panel and check for stability', expect: 'Stable supply within specification', tools: ['Digital multimeter'] },
      { step: 3, action: 'Inspect the display ribbon or connector where accessible', expect: 'Fully seated, undamaged connector', tools: ['Inspection light'] },
      { step: 4, action: 'Check whether data is still available through a service tool or remote connection', expect: 'Confirms the controller is functioning behind a failed display', tools: ['Service tool'] },
      { step: 5, action: 'Assess the panel environment for heat, moisture, vibration and direct sunlight', expect: 'Conditions within the equipment rating', tools: ['Thermometer'] },
    ],
    remedy: ['Reseat or replace a damaged display connection', 'Replace the display or controller as the manufacturer supports', 'Improve panel environment where heat or moisture is implicated', 'Restore stable supply where voltage is the cause'],
    safety: ['Isolate before opening the control panel', 'Do not operate a set with no indication of its protective status for longer than necessary to arrange repair'],
    tools: ['Digital multimeter', 'Service tool', 'Inspection light'],
    preventive: ['Keep panels sealed and within their temperature rating', 'Shade panels exposed to direct sun', 'Verify indication at every service'],
  },
  {
    match: ['engine air intake temperature high', 'intake air temperature high', 'air inlet temperature high'],
    system: 'Air Intake',
    severity: 'warning',
    summary: 'Intake air temperature is above its normal band. Hot air is less dense, so the engine makes less power and many ECUs derate deliberately to protect it. On generator installations this is almost always an engine-room ventilation problem — hot air recirculating from the radiator discharge back to the intake is the classic cause.',
    symptoms: ['High intake temperature warning or derate', 'Loss of available power, worse as the run continues', 'Engine room noticeably hot', 'Fault absent on short runs, present on long ones'],
    diagnosis: [
      { step: 1, action: 'Measure intake air temperature and compare against ambient outside the building', expect: 'Intake close to outside ambient; a large difference confirms recirculation or room heating', tools: ['Contact or infrared thermometer'] },
      { step: 2, action: 'Trace the airflow path and look for hot discharge returning to the intake', expect: 'Clear separation between the radiator discharge and the air intake', tools: ['Smoke source or airflow indicator'] },
      { step: 3, action: 'Check ventilation openings and louvres for obstruction and adequate free area', expect: 'Free area generous relative to the radiator face and louvres fully open', tools: ['Tape measure'] },
      { step: 4, action: 'Inspect the charge-air cooler where fitted for blockage or airflow obstruction', expect: 'Clean core and unobstructed airflow', tools: ['Inspection light'] },
      { step: 5, action: 'Verify the sensor against an independent probe', expect: 'Agreement within a few degrees', tools: ['Contact thermometer'] },
    ],
    remedy: ['Separate the radiator discharge from the intake with ducting or baffles to stop recirculation', 'Increase ventilation free area or fit assisted ventilation', 'Clean the charge-air cooler', 'Replace a drifting intake temperature sensor', 'Apply the correct derate where high ambient cannot be avoided'],
    safety: ['Engine rooms with poor ventilation may accumulate exhaust gas — ensure adequate air change before extended work inside'],
    tools: ['Infrared thermometer', 'Tape measure', 'Inspection light'],
    preventive: ['Verify ventilation design at commissioning against the radiator face area', 'Re-check after any building alteration or louvre replacement', 'Keep louvres and screens clear'],
  },
  {
    match: ['accelerator pedal cable break or short circuit', 'handthrottle; signal out of range', 'speed demand signal fault', 'throttle signal fault'],
    system: 'Control',
    severity: 'warning',
    summary: 'The external speed or throttle demand signal is outside its valid range. On a generator set this is the signal that tells the engine what speed to run, so a fault typically leaves the engine at a default speed or prevents it accepting a speed command at all. Check the wiring and the source device before the ECU.',
    symptoms: ['Signal out of range or open-circuit fault', 'Engine running at a fixed default speed', 'No response to speed adjustment', 'Fault appearing with vibration or connector movement'],
    diagnosis: [
      { step: 1, action: 'Read the live signal value on the service tool through its full commanded range', expect: 'Smooth change across the range without dropouts or jumps', tools: ['Service tool'] },
      { step: 2, action: 'Measure the signal voltage or current at the ECU connector', expect: 'Within the valid range for the input type', tools: ['Digital multimeter'] },
      { step: 3, action: 'Verify the supply and ground provided to the demand device', expect: 'Both present and stable', tools: ['Digital multimeter'] },
      { step: 4, action: 'Check the wiring for open circuit, short to supply and short to ground', expect: 'Continuity good and no shorts', tools: ['Digital multimeter'] },
      { step: 5, action: 'Substitute a known-good signal source where the installation allows', expect: 'Correct response confirms the fault lies in the original source or its wiring', tools: ['Signal simulator'] },
    ],
    remedy: ['Repair open or shorted wiring and protect it against chafing', 'Replace a failed demand device or potentiometer', 'Restore supply and ground to the demand circuit', 'Re-calibrate the input range where the system provides for it'],
    safety: ['Isolate before disconnecting ECU connectors', 'Engine speed may change unexpectedly during signal testing — keep clear'],
    tools: ['Service tool', 'Digital multimeter', 'Signal simulator'],
    preventive: ['Protect signal wiring from vibration and chafing', 'Keep signal cabling separated from power cabling'],
  },
  {
    match: ['alternator voltage sensor failure', 'alternator frequency sensor failure', 'voltage sensing fault'],
    system: 'Electrical',
    severity: 'critical',
    summary: 'The controller has lost or rejected its voltage or frequency sensing from the generator output. Because sensing drives both regulation and protection, this fault can leave the set unregulated or cause a spurious protection trip. Sensing fuses and connections are the usual cause and should be checked first.',
    symptoms: ['Sensing fault reported by the controller', 'Output voltage unstable or uncontrolled', 'Spurious protection trips', 'Panel indicating zero or implausible voltage while output is present'],
    diagnosis: [
      { step: 1, action: 'Isolate the set safely, then check the sensing fuses', expect: 'All sensing fuses intact — a blown sensing fuse is a very common cause', tools: ['Digital multimeter'] },
      { step: 2, action: 'With the set running and appropriate safety precautions, compare panel-indicated voltage against a direct measurement at the terminals', expect: 'Agreement between panel and independent measurement', tools: ['Digital multimeter', 'Power quality meter'] },
      { step: 3, action: 'Inspect sensing wiring and terminations for damage and looseness', expect: 'Secure, undamaged connections at both ends', tools: ['Inspection light'] },
      { step: 4, action: 'Where current transformers are involved, verify ratio, polarity and that no CT secondary is open circuit', expect: 'Correct ratio and polarity with no open secondary', tools: ['Clamp meter'] },
      { step: 5, action: 'Check frequency sensing consistency against measured engine speed', expect: 'Frequency consistent with speed and pole count', tools: ['Tachometer', 'Power quality meter'] },
    ],
    remedy: ['Replace blown sensing fuses and establish why they blew', 'Repair damaged sensing wiring and re-terminate loose connections', 'Correct CT ratio or polarity errors', 'Replace a failed sensing module or controller once wiring is proven'],
    safety: [
      'Generator output terminals are lethal — prove dead and isolate before working, and treat the set as capable of back-energisation',
      'NEVER open-circuit a current transformer secondary while primary current flows: dangerous voltages appear across the open terminals. Short the secondary before disconnecting.',
      'Live measurement should only be undertaken with appropriate instruments, PPE and competence',
    ],
    tools: ['Digital multimeter', 'Power quality meter', 'Clamp meter', 'Insulation tester'],
    preventive: ['Check sensing fuses at every service', 'Verify panel indication against an independent instrument annually', 'Record CT ratios in the commissioning pack'],
  },
];

/** Normalise a fault description for matching. */
export function normaliseFault(description: string): string {
  return String(description || '')
    .toLowerCase()
    .replace(/[‐-―]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[.;:]+$/, '')
    .trim();
}

const INDEX = new Map<string, FaultKnowledge>();
for (const k of FAULT_KNOWLEDGE) {
  for (const m of k.match) INDEX.set(normaliseFault(m), k);
}

/**
 * Look up diagnostic content for a fault description. Exact normalised match
 * first, then a conservative containment match so that descriptions carrying an
 * extra qualifier still resolve. Returns null rather than guessing — an absent
 * entry must render as absent, never as generic filler.
 */
export function getFaultKnowledge(description: string): FaultKnowledge | null {
  const n = normaliseFault(description);
  if (!n) return null;
  const exact = INDEX.get(n);
  if (exact) return exact;
  for (const [key, val] of INDEX) {
    if (key.length >= 12 && (n.includes(key) || key.includes(n))) return val;
  }
  return null;
}

export const FAULT_KNOWLEDGE_COUNT = FAULT_KNOWLEDGE.length;
