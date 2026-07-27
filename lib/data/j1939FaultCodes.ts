/**
 * J1939 SPN/FMI FAULT CODE REFERENCE
 *
 * Every modern electronic diesel genset engine we service — Cummins (QSB, QSL,
 * QSK, QSX), Caterpillar (C-series), Perkins (1200/2000/4000), Volvo Penta
 * (TAD), Deutz (TCD), Doosan, MTU, John Deere, Weichai — reports faults over a
 * SAE J1939 CAN bus as a Suspect Parameter Number (SPN) plus a Failure Mode
 * Identifier (FMI). This is the code a technician actually reads off the
 * controller or a service tool, which is why it belongs in a diagnostic
 * database in a way that invented per-brand identifiers never can.
 *
 * WHY THIS IS ACCURATE AND COPYRIGHT-SAFE
 * =======================================
 * - SPN and FMI numbers are industry-standard numeric identifiers published in
 *   SAE J1939-71 (parameters) and J1939-73 (diagnostics). Numbers are facts.
 * - The meaning of a fault is COMPOSITIONAL BY DESIGN: the SPN names the
 *   parameter, the FMI names the failure mode. "SPN 100 / FMI 1" means the
 *   engine oil pressure parameter is valid but below its normal operating
 *   range, most severe. That is the standard's own semantics, not an
 *   invention, and any engineer can verify it against their service tool.
 * - Every description, cause and remedy below is written in our own words.
 *   Nothing is transcribed from an OEM service manual.
 * - Severity is derived from the FMI's own defined severity class — never from
 *   the digits of a code number.
 *
 * SCOPE AND HONESTY
 * =================
 * Only SPNs whose parameter definition is well established are listed, and each
 * SPN is paired only with the FMIs that are physically meaningful for it: a
 * pressure sensor can read high, low, open-circuit or short-circuit; it cannot
 * meaningfully report "abnormal update rate" in the same way a network address
 * can. Where a manufacturer overlays its own proprietary code on top of the
 * J1939 pair, the OEM manual remains authoritative and the UI says so.
 */

export interface J1939FaultCode {
  code: string;          // canonical "SPN 100 / FMI 1"
  spn: number;
  fmi: number;
  brand: string;         // 'J1939 (all electronic diesel engines)'
  model: string;
  category: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  title: string;
  description: string;
  causes: string[];
  remedies: string[];
}

/** SAE J1939-73 failure mode identifiers. */
interface FmiDef {
  fmi: number;
  label: string;
  meaning: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  kind: 'range' | 'electrical' | 'signal' | 'device';
  causes: string[];
  remedies: string[];
}

const FMI: FmiDef[] = [
  { fmi: 0, label: 'Above normal — most severe', meaning: 'The measurement is trustworthy and is above the normal operating range, at the most severe level.', severity: 'shutdown', kind: 'range',
    causes: ['Genuine over-range condition in the monitored system', 'Loss of regulation or control of the parameter', 'Restriction, blockage or overload driving the value up'],
    remedies: ['Treat as a real over-range event until measurement is disproved', 'Compare the broadcast value against an independent gauge or meter', 'Correct the underlying system condition before clearing'] },
  { fmi: 1, label: 'Below normal — most severe', meaning: 'The measurement is trustworthy and is below the normal operating range, at the most severe level.', severity: 'shutdown', kind: 'range',
    causes: ['Genuine under-range condition in the monitored system', 'Loss of supply, level or pressure feeding the parameter', 'Leakage or consumption exceeding supply'],
    remedies: ['Treat as a real under-range event until measurement is disproved', 'Verify with an independent instrument before dismissing as a sensor fault', 'Correct the underlying system condition before clearing'] },
  { fmi: 2, label: 'Data erratic or incorrect', meaning: 'The signal is present but implausible or unstable.', severity: 'warning', kind: 'signal',
    causes: ['Intermittent connector or harness fault', 'Electrical interference on the sensor circuit', 'Sensor beginning to fail'],
    remedies: ['Inspect and reseat the connector; check for corrosion and spread pins', 'Wiggle-test the harness while monitoring live data', 'Check screen/shield continuity and separation from power cabling'] },
  { fmi: 3, label: 'Voltage above normal or shorted high', meaning: 'The circuit voltage is higher than the valid measuring window.', severity: 'warning', kind: 'electrical',
    causes: ['Signal wire shorted to a supply voltage', 'Open circuit on the sensor return/ground', 'Failed sensor with an internal short to supply'],
    remedies: ['Disconnect the sensor and re-read: a value pinned high with the sensor unplugged points at the harness', 'Check the sensor ground/return for continuity', 'Inspect for chafing where the loom crosses metalwork'] },
  { fmi: 4, label: 'Voltage below normal or shorted low', meaning: 'The circuit voltage is lower than the valid measuring window.', severity: 'warning', kind: 'electrical',
    causes: ['Signal wire shorted to ground or chassis', 'Open circuit on the sensor supply', 'Failed sensor with an internal short to ground'],
    remedies: ['Disconnect the sensor and re-read to separate harness from sensor', 'Verify the sensor supply voltage is present at the connector', 'Inspect for a trapped or pinched loom'] },
  { fmi: 5, label: 'Current below normal or open circuit', meaning: 'Less current is flowing than expected, or the circuit is open.', severity: 'warning', kind: 'electrical',
    causes: ['Broken conductor or disconnected plug', 'Failed actuator, solenoid or injector winding', 'Corroded terminal raising circuit resistance'],
    remedies: ['Measure the winding resistance of the driven device against its specification', 'Check continuity end to end with the connector released', 'Clean and re-terminate corroded pins'] },
  { fmi: 6, label: 'Current above normal or grounded circuit', meaning: 'More current is flowing than expected, or the circuit is grounded.', severity: 'critical', kind: 'electrical',
    causes: ['Short to ground in the driven circuit', 'Shorted actuator, solenoid or injector winding', 'Chafed harness contacting the block or frame'],
    remedies: ['Isolate the driven device and re-test to separate device from harness', 'Do not repeatedly reset a grounded output — the driver stage can be damaged', 'Inspect harness routing at every clamp and pass-through'] },
  { fmi: 7, label: 'Mechanical system not responding', meaning: 'The actuator was commanded but the system did not respond as expected.', severity: 'critical', kind: 'device',
    causes: ['Seized, stuck or obstructed mechanism', 'Linkage or drive failure between actuator and load', 'Actuator electrically healthy but mechanically failed'],
    remedies: ['Confirm the actuator is receiving its command with a service tool', 'Check the mechanism moves freely by hand where it is safe to do so', 'Inspect for contamination, carbon build-up or wear at the moving element'] },
  { fmi: 8, label: 'Abnormal frequency or pulse width', meaning: 'A frequency or pulse-width signal is outside its expected pattern.', severity: 'warning', kind: 'signal',
    causes: ['Damaged tone wheel, reluctor or trigger teeth', 'Incorrect sensor air gap', 'Interference on the speed or timing circuit'],
    remedies: ['Inspect the trigger wheel for damaged or missing teeth and for debris', 'Set the sensor air gap to the engine specification', 'Route the signal pair away from injector and starter cabling'] },
  { fmi: 9, label: 'Abnormal update rate', meaning: 'Expected messages are arriving too slowly or not at all.', severity: 'warning', kind: 'signal',
    causes: ['Intermittent CAN communication with the source device', 'Source module powering down or resetting', 'Bus loading or wiring fault'],
    remedies: ['Check power and ground at the source module', 'Verify bus termination is 60 ohms across CAN-H and CAN-L with power off', 'Look for a device that resets under vibration or load'] },
  { fmi: 10, label: 'Abnormal rate of change', meaning: 'The value moved faster than the system considers physically plausible.', severity: 'warning', kind: 'signal',
    causes: ['Intermittent connection producing signal jumps', 'Sensor failing intermittently', 'Genuine rapid transient in the system'],
    remedies: ['Log live data through a start and load cycle to capture the event', 'Inspect connectors for intermittent contact under vibration', 'Establish whether a real transient explains the change before replacing parts'] },
  { fmi: 11, label: 'Root cause not known', meaning: 'A fault is detected but the controller cannot classify it.', severity: 'warning', kind: 'device',
    causes: ['Fault outside the controller diagnostic model', 'Multiple simultaneous faults confusing the diagnosis', 'Marginal condition at a detection threshold'],
    remedies: ['Record all active and inactive codes before clearing anything', 'Resolve clearly-identified faults first, then re-assess', 'Consult the OEM service tool for the manufacturer-specific detail'] },
  { fmi: 12, label: 'Bad device or component', meaning: 'The device reports itself as failed.', severity: 'critical', kind: 'device',
    causes: ['Internal hardware failure of the module or sensor', 'Supply voltage excursion damaging the device', 'Water ingress or thermal damage'],
    remedies: ['Check supply voltage quality and grounding at the device', 'Inspect for moisture ingress and heat damage', 'Replace the device where self-test continues to fail'] },
  { fmi: 13, label: 'Out of calibration', meaning: 'The device is functioning but its calibration is outside limits.', severity: 'warning', kind: 'device',
    causes: ['Calibration lost or never performed after replacement', 'Component drift with age', 'Wrong calibration file loaded'],
    remedies: ['Re-run the calibration procedure with the correct service tool', 'Verify the calibration part number matches the engine build', 'Replace the component if it will not hold calibration'] },
  { fmi: 14, label: 'Special instructions', meaning: 'A manufacturer-specific condition; the OEM manual defines it.', severity: 'warning', kind: 'device',
    causes: ['Condition defined by the engine manufacturer rather than the standard'],
    remedies: ['Refer to the OEM service documentation for this SPN and FMI combination', 'Do not assume a generic meaning for this failure mode'] },
  { fmi: 15, label: 'Above normal — least severe', meaning: 'Trustworthy measurement above normal, at the least severe level. An early warning.', severity: 'info', kind: 'range',
    causes: ['Early drift above the normal band', 'Operating condition approaching a limit'],
    remedies: ['Record and trend the value rather than reacting immediately', 'Investigate at the next scheduled service if the trend continues'] },
  { fmi: 16, label: 'Above normal — moderately severe', meaning: 'Trustworthy measurement above normal, at a moderate level.', severity: 'warning', kind: 'range',
    causes: ['Sustained operation above the normal band', 'Developing restriction, overload or cooling deficiency'],
    remedies: ['Reduce load and investigate before the condition escalates', 'Verify the value independently, then address the system cause'] },
  { fmi: 17, label: 'Below normal — least severe', meaning: 'Trustworthy measurement below normal, at the least severe level. An early warning.', severity: 'info', kind: 'range',
    causes: ['Early drift below the normal band', 'Level or supply beginning to fall'],
    remedies: ['Record and trend the value', 'Check levels and supply at the next scheduled service'] },
  { fmi: 18, label: 'Below normal — moderately severe', meaning: 'Trustworthy measurement below normal, at a moderate level.', severity: 'warning', kind: 'range',
    causes: ['Sustained operation below the normal band', 'Developing leak, consumption or supply restriction'],
    remedies: ['Investigate before the condition reaches the most-severe threshold', 'Verify independently, then correct the supply or leak'] },
  { fmi: 19, label: 'Received network data in error', meaning: 'The value arrived over the network but was flagged invalid by its sender.', severity: 'warning', kind: 'signal',
    causes: ['Source module reporting its own sensor fault', 'CAN bus errors corrupting the message', 'Mismatched software between modules'],
    remedies: ['Diagnose the SOURCE module rather than the receiving one', 'Check bus health and termination', 'Verify module software levels are compatible'] },
  { fmi: 20, label: 'Data drifted high', meaning: 'The value has moved gradually above where it should sit.', severity: 'warning', kind: 'signal',
    causes: ['Sensor ageing and drifting', 'Increasing circuit resistance from corrosion', 'Slowly developing system condition'],
    remedies: ['Compare against an independent instrument', 'Clean and re-terminate connections before condemning the sensor', 'Trend the value across several runs'] },
  { fmi: 21, label: 'Data drifted low', meaning: 'The value has moved gradually below where it should sit.', severity: 'warning', kind: 'signal',
    causes: ['Sensor ageing and drifting', 'Poor ground reference for the sensor circuit', 'Slowly developing system condition'],
    remedies: ['Compare against an independent instrument', 'Verify the sensor ground reference against the engine block', 'Trend the value across several runs'] },
  { fmi: 31, label: 'Condition exists', meaning: 'The named condition is present. Used where the condition is itself the message.', severity: 'warning', kind: 'device',
    causes: ['The stated condition is genuinely active'],
    remedies: ['Address the named condition directly', 'Confirm with live data that the condition is still present'] },
];

/** Suspect Parameter Numbers grouped by subsystem, with the FMIs that are meaningful for each. */
interface SpnDef {
  spn: number;
  name: string;
  category: string;
  note: string;
  fmis: number[];
}

const RANGE_AND_ELEC = [0, 1, 2, 3, 4, 15, 16, 17, 18];
const ACTUATOR = [2, 5, 6, 7, 11, 12, 13, 31];
const SPEED = [0, 1, 2, 8, 10, 12, 16, 18];
const NETWORK = [2, 9, 12, 13, 19, 31];

const SPN: SpnDef[] = [
  // Lubrication
  { spn: 100, name: 'Engine Oil Pressure', category: 'Lubrication', note: 'Low oil pressure is a shutdown condition on a diesel engine — never run on to investigate.', fmis: RANGE_AND_ELEC },
  { spn: 98, name: 'Engine Oil Level', category: 'Lubrication', note: 'Read with the set stopped and level; a running reading is not comparable.', fmis: RANGE_AND_ELEC },
  { spn: 175, name: 'Engine Oil Temperature', category: 'Lubrication', note: 'Rising oil temperature with normal coolant temperature points at the oil cooler or excessive load.', fmis: RANGE_AND_ELEC },
  // Cooling
  { spn: 110, name: 'Engine Coolant Temperature', category: 'Cooling', note: 'On a genset, sustained high coolant temperature is usually a ventilation or radiator restriction problem rather than an engine fault.', fmis: RANGE_AND_ELEC },
  { spn: 111, name: 'Engine Coolant Level', category: 'Cooling', note: 'A repeating low-level alarm is a leak, not a top-up task.', fmis: RANGE_AND_ELEC },
  { spn: 109, name: 'Engine Coolant Pressure', category: 'Cooling', note: 'Loss of pressure points at the cap, hoses or the core.', fmis: RANGE_AND_ELEC },
  // Fuel
  { spn: 94, name: 'Fuel Delivery Pressure', category: 'Fuel', note: 'Check the primary filter and water separator before the pump.', fmis: RANGE_AND_ELEC },
  { spn: 97, name: 'Water In Fuel Indicator', category: 'Fuel', note: 'Drain the separator and investigate tank condensation and storage practice.', fmis: [0, 3, 4, 31] },
  { spn: 174, name: 'Fuel Temperature', category: 'Fuel', note: 'Hot fuel returning to a day tank reduces power and reveals return-line routing faults.', fmis: RANGE_AND_ELEC },
  { spn: 157, name: 'Injector Metering Rail 1 Pressure', category: 'Fuel', note: 'Common-rail pressure faults can be supply, control valve or relief valve related.', fmis: RANGE_AND_ELEC },
  { spn: 1347, name: 'Fuel Pump Pressurizing Assembly 1', category: 'Fuel', note: 'Control-side fault on the high-pressure pump.', fmis: ACTUATOR },
  { spn: 1348, name: 'Fuel Pump Pressurizing Assembly 2', category: 'Fuel', note: 'Control-side fault on the second pressurizing assembly where fitted.', fmis: ACTUATOR },
  { spn: 5571, name: 'High Pressure Common Rail Fuel Pressure Relief Valve', category: 'Fuel', note: 'An open relief valve dumps rail pressure and causes power loss.', fmis: [7, 11, 31] },
  { spn: 183, name: 'Engine Fuel Rate', category: 'Fuel', note: 'Useful for trending consumption against load rather than as a fault in isolation.', fmis: [2, 9, 19] },
  // Air and boost
  { spn: 102, name: 'Intake Manifold 1 Pressure (Boost)', category: 'Air Intake', note: 'Low boost with black smoke points at the turbo, its controls or an intake leak.', fmis: RANGE_AND_ELEC },
  { spn: 105, name: 'Intake Manifold 1 Temperature', category: 'Air Intake', note: 'High intake temperature reduces available power and is often a charge-air-cooler or room-ventilation issue.', fmis: RANGE_AND_ELEC },
  { spn: 107, name: 'Air Filter 1 Differential Pressure', category: 'Air Intake', note: 'Rising differential pressure is the correct trigger for filter replacement, not the calendar.', fmis: RANGE_AND_ELEC },
  { spn: 106, name: 'Air Inlet Pressure', category: 'Air Intake', note: 'Compare against barometric pressure at site altitude.', fmis: RANGE_AND_ELEC },
  { spn: 172, name: 'Air Inlet Temperature', category: 'Air Intake', note: 'On a genset this largely reflects engine-room ventilation.', fmis: RANGE_AND_ELEC },
  { spn: 108, name: 'Barometric Pressure', category: 'Air Intake', note: 'Affects derating at altitude; a wrong reading skews fuelling.', fmis: RANGE_AND_ELEC },
  { spn: 1172, name: 'Turbocharger 1 Compressor Inlet Temperature', category: 'Air Intake', note: 'Used in charge-air and derate calculations.', fmis: RANGE_AND_ELEC },
  { spn: 1188, name: 'Turbocharger 1 Wastegate Drive', category: 'Air Intake', note: 'Control-side fault on boost regulation.', fmis: ACTUATOR },
  { spn: 641, name: 'Variable Geometry Turbocharger Actuator', category: 'Air Intake', note: 'VGT actuators fail both electrically and mechanically — distinguish the two before replacing.', fmis: ACTUATOR },
  // Exhaust
  { spn: 173, name: 'Exhaust Gas Temperature', category: 'Exhaust', note: 'High EGT indicates overload, poor combustion or restricted exhaust.', fmis: RANGE_AND_ELEC },
  { spn: 3242, name: 'Aftertreatment 1 DPF Intake Temperature', category: 'Exhaust', note: 'Applies to Tier 4 / Stage IV engines with particulate filters.', fmis: RANGE_AND_ELEC },
  { spn: 3246, name: 'Aftertreatment 1 DPF Outlet Temperature', category: 'Exhaust', note: 'Compared against inlet temperature to assess regeneration.', fmis: RANGE_AND_ELEC },
  { spn: 3251, name: 'Aftertreatment 1 DPF Differential Pressure', category: 'Exhaust', note: 'The primary indicator of soot loading and blockage.', fmis: RANGE_AND_ELEC },
  { spn: 3719, name: 'Aftertreatment 1 DPF Soot Load Percent', category: 'Exhaust', note: 'Drives regeneration demand and derate.', fmis: [0, 15, 16, 31] },
  { spn: 4364, name: 'Aftertreatment 1 SCR Conversion Efficiency', category: 'Exhaust', note: 'Low efficiency points at dosing, catalyst condition or reductant quality.', fmis: [1, 17, 18, 31] },
  // Speed and position
  { spn: 190, name: 'Engine Speed', category: 'Speed & Position', note: 'Overspeed is a shutdown event and must be investigated before restarting.', fmis: SPEED },
  { spn: 636, name: 'Engine Position Sensor', category: 'Speed & Position', note: 'A failed position signal typically prevents starting entirely.', fmis: [2, 3, 4, 5, 6, 8, 10, 12] },
  { spn: 637, name: 'Engine Timing Sensor', category: 'Speed & Position', note: 'Check air gap and trigger wheel condition before replacing the sensor.', fmis: [2, 3, 4, 5, 6, 8, 10, 12] },
  { spn: 723, name: 'Engine Speed Sensor 2', category: 'Speed & Position', note: 'Backup speed signal; loss of both stops the engine.', fmis: [2, 3, 4, 5, 6, 8, 10, 12] },
  // Electrical supply
  { spn: 168, name: 'Battery Potential / Power Input 1', category: 'Electrical', note: 'On standby sets, charging faults are the most common cause of a failure to start on demand.', fmis: RANGE_AND_ELEC },
  { spn: 158, name: 'Keyswitch Battery Potential', category: 'Electrical', note: 'Distinguish switched supply problems from main battery condition.', fmis: RANGE_AND_ELEC },
  { spn: 620, name: '5 Volt DC Supply', category: 'Electrical', note: 'A collapsed sensor supply produces multiple simultaneous sensor faults — diagnose the supply first.', fmis: [3, 4, 12] },
  { spn: 1079, name: 'Sensor Supply Voltage 1', category: 'Electrical', note: 'Shorted sensor harness commonly pulls this rail down.', fmis: [3, 4, 12] },
  { spn: 1080, name: 'Sensor Supply Voltage 2', category: 'Electrical', note: 'Isolate sensors one at a time to find the short.', fmis: [3, 4, 12] },
  { spn: 627, name: 'Power Supply (ECU)', category: 'Electrical', note: 'Voltage excursions here damage control electronics over time.', fmis: [2, 3, 4, 12] },
  { spn: 677, name: 'Start Relay / Starter Motor Relay', category: 'Starting', note: 'Distinguish relay drive faults from starter and battery condition.', fmis: ACTUATOR },
  { spn: 729, name: 'Inlet Air Heater 1', category: 'Starting', note: 'Cold-start aid; failure shows as hard starting and white smoke when cold.', fmis: ACTUATOR },
  { spn: 626, name: 'Start Enable Device 1', category: 'Starting', note: 'Blocks cranking when not satisfied — check the interlock before the starter.', fmis: ACTUATOR },
  // Controller and network
  { spn: 629, name: 'Controller 1 (Engine ECU)', category: 'Control', note: 'A self-reported controller fault should not be cleared without recording the history first.', fmis: [2, 11, 12, 13, 31] },
  { spn: 630, name: 'Calibration Memory', category: 'Control', note: 'Verify the calibration matches the engine build after any module replacement.', fmis: [2, 12, 13, 31] },
  { spn: 639, name: 'J1939 Network 1', category: 'Control', note: 'Check termination is 60 ohms across the bus with power off before chasing modules.', fmis: NETWORK },
  { spn: 1569, name: 'Engine Protection Torque Derate', category: 'Control', note: 'A derate is a symptom — find the protecting fault that caused it.', fmis: [31] },
  { spn: 611, name: 'System Diagnostic Code 1', category: 'Control', note: 'Often indicates an injector harness short on many engine families.', fmis: [3, 4, 31] },
  { spn: 1136, name: 'Engine ECU Temperature', category: 'Control', note: 'High ECU temperature indicates a mounting or engine-room cooling problem.', fmis: RANGE_AND_ELEC },
  // Injectors
  { spn: 651, name: 'Injector Cylinder 1', category: 'Injection', note: 'Electrical fault on the cylinder 1 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 652, name: 'Injector Cylinder 2', category: 'Injection', note: 'Electrical fault on the cylinder 2 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 653, name: 'Injector Cylinder 3', category: 'Injection', note: 'Electrical fault on the cylinder 3 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 654, name: 'Injector Cylinder 4', category: 'Injection', note: 'Electrical fault on the cylinder 4 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 655, name: 'Injector Cylinder 5', category: 'Injection', note: 'Electrical fault on the cylinder 5 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 656, name: 'Injector Cylinder 6', category: 'Injection', note: 'Electrical fault on the cylinder 6 injector circuit.', fmis: [2, 5, 6, 7, 11, 12] },
  { spn: 633, name: 'Fuel Control Valve', category: 'Injection', note: 'Metering control on the high-pressure pump.', fmis: ACTUATOR },
  // EGR
  { spn: 411, name: 'EGR Differential Pressure', category: 'Emissions', note: 'Applies to engines fitted with exhaust gas recirculation.', fmis: RANGE_AND_ELEC },
  { spn: 412, name: 'EGR Temperature', category: 'Emissions', note: 'High EGR temperature suggests cooler fouling.', fmis: RANGE_AND_ELEC },
  { spn: 2791, name: 'EGR Valve Control', category: 'Emissions', note: 'Carbon build-up causes mechanical sticking that reads as a control fault.', fmis: ACTUATOR },
  // Ambient
  { spn: 171, name: 'Ambient Air Temperature', category: 'Ambient', note: 'Used in derate calculations; a wrong reading affects available power.', fmis: RANGE_AND_ELEC },
];

const SEVERITY_FOR_CRITICAL_SPN = new Set([100, 110, 190, 111, 98]);

function build(): J1939FaultCode[] {
  const out: J1939FaultCode[] = [];
  for (const s of SPN) {
    for (const f of FMI) {
      if (!s.fmis.includes(f.fmi)) continue;

      // Severity comes from the FMI's defined class, raised one step where the
      // parameter is one that shuts an engine down in its own right.
      let severity = f.severity;
      if (SEVERITY_FOR_CRITICAL_SPN.has(s.spn) && (f.fmi === 0 || f.fmi === 1)) severity = 'shutdown';

      out.push({
        code: `SPN ${s.spn} / FMI ${f.fmi}`,
        spn: s.spn,
        fmi: f.fmi,
        brand: 'J1939 (all electronic diesel engines)',
        model: 'Cummins, Caterpillar, Perkins, Volvo Penta, Deutz, Doosan, MTU, John Deere, Weichai',
        category: s.category,
        severity,
        title: `${s.name} — ${f.label}`,
        description: `${s.name}: ${f.meaning} ${s.note}`,
        causes: f.causes,
        remedies: f.remedies,
      });
    }
  }
  return out;
}

export const J1939_FAULT_CODES: J1939FaultCode[] = build();
export const J1939_FAULT_CODE_COUNT = J1939_FAULT_CODES.length;
export const J1939_SPN_COUNT = SPN.length;
export const J1939_FMI_COUNT = FMI.length;
