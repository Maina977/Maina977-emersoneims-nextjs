/**
 * Guided fault-finding families, expansion 1 (2026-11-25): frequency hunting,
 * overspeed shutdown, charging faults and exhaust smoke.
 *
 * Same rules as ./families: general diesel generator service practice, to be
 * reviewed by a senior technician. No machine-specific limit is written here:
 * every OEM figure (frequency band, overspeed trip, charging voltages) is a
 * question the technician answers from the manual or settings sheet for this
 * set, marked "per OEM manual — NOT VERIFIED", and rules compare against it.
 * Standards are cited by title only; their clauses and values were not checked
 * against a held copy and none are used as limits.
 *
 * Safety structure (binding, pilot protocol):
 *  - mandatorySafety is shown first in every result, before any question or check;
 *  - `actions` are done with the set stopped and isolated;
 *  - anything needing the engine running or circuits live is in `runningChecks`
 *    (withheld by the engine whenever a STOP is active) or is a question marked
 *    `needsRunning` (never offered as the next check while a STOP is active).
 */
import type { Condition, FaultFamily } from './types';
import { withScreen } from './safetyScreen';

const PRACTICE = 'General diesel generator service practice (EmersonEIMS); confirm limits and procedure in the OEM service manual for this engine.';
const ALT_PRACTICE = 'General alternator service practice (EmersonEIMS); confirm limits and procedure in the alternator and AVR manuals.';
const NV = 'cited by title only; clauses and values NOT VERIFIED against a held copy and not used as limits';
export const REF_ISO_8528_1 = `ISO 8528-1, Reciprocating internal combustion engine driven alternating current generating sets — Part 1: Application, ratings and performance (rating definitions; ${NV}).`;
export const REF_ISO_8528_5 = `ISO 8528-5, Reciprocating internal combustion engine driven alternating current generating sets — Part 5: Generating sets (performance classes, frequency and voltage behaviour; ${NV}).`;
export const REF_ISO_3046_4 = `ISO 3046-4, Reciprocating internal combustion engines — Performance — Part 4: Speed governing (${NV}).`;
export const REF_NFPA_110 = `NFPA 110, Standard for Emergency and Standby Power Systems (exercise and maintenance of standby sets; use the edition adopted for the site; ${NV}).`;
export const REF_IEEE_450 = `IEEE Std 450, IEEE Recommended Practice for Maintenance, Testing, and Replacement of Vented Lead-Acid Batteries for Stationary Applications (${NV}).`;
export const REF_IEEE_1188 = `IEEE Std 1188, IEEE Recommended Practice for Maintenance, Testing, and Replacement of Valve-Regulated Lead-Acid (VRLA) Batteries for Stationary Applications (${NV}).`;
const BCI = 'Battery Council International load-test guide: about 12.4 V at rest ≈ 75 % charge; a sound 12 V battery stays at or above 9.6 V under a load test at about 21 °C (double for 24 V systems).';
const OEM_NV = 'Per OEM manual — NOT VERIFIED. No default: enter the figure from the manual or settings sheet for this set; rules that need it stay silent until it is entered.';

const is = (q: string, value: string | string[]): Condition => ({ q, op: 'is', value });
const sys = (v12: Condition, v24: Condition): Condition => ({ any: [{ all: [is('systemVoltage', '12'), v12] }, { all: [is('systemVoltage', '24'), v24] }] });
const LOCK_OFF = 'STOP the engine, set the controller to OFF and lock it off (or remove the start-battery negative lead) so it cannot start automatically';

// ─── 7. Frequency unstable / governor hunting ───────────────────────────────
export const FREQUENCY_HUNTING: FaultFamily = {
  id: 'frequency-hunting',
  title: 'Frequency unstable / governor hunting (speed surging)',
  keywords: /\bhunt(s|ing)?\b|surg(e|es|ing)\b|frequency (is )?(unstable|fluctuat\w*|swing\w*|vari\w*|drift\w*)|unstable frequency|(speed|rpm) (is )?(unstable|fluctuat\w*|swing\w*|surg\w*)|governor/i,
  review: 'technician review pending',
  references: [REF_ISO_8528_5, REF_ISO_3046_4],
  mandatorySafety: [
    `Before touching the governor actuator, fuel linkage, speed sensor or their wiring: ${LOCK_OFF}, and isolate the generator output. On an automatic-start set the linkage, fan and belts can move without warning.`,
    'Never adjust the linkage or reach past a guard on a running engine; readings are taken only from the panel or with rated instruments on fixed test points, and only when no STOP applies.',
  ],
  questions: [
    { id: 'overspeedTrip', kind: 'choice', text: 'Has the hunting caused an overspeed shutdown?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'linkage', kind: 'choice', text: 'Actuator and fuel linkage moved through full travel by hand (set stopped and isolated)', options: [{ value: 'ok', label: 'Moves freely, no play' }, { value: 'sticking', label: 'Sticks or binds' }, { value: 'worn', label: 'Worn joints / play' }, { value: 'disconnected', label: 'Disconnected, broken or seized' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'parallel', kind: 'choice', text: 'Is the set running in parallel (with other sets or the mains)?', options: [{ value: 'single', label: 'No, runs alone' }, { value: 'parallel', label: 'Yes, in parallel' }] },
    { id: 'freqSwing', kind: 'number', text: 'Frequency swing at steady load, peak to peak (panel or meter, watched for at least a minute)', unit: 'Hz', min: 0, max: 30, needsRunning: true, help: 'Swing = highest minus lowest frequency seen. Read from the panel; do not open covers on a running set.' },
    { id: 'oemMaxSwing', kind: 'number', text: 'Steady-state frequency band allowed for this set, peak to peak (governor/controller settings sheet or the agreed ISO 8528-5 performance class)', unit: 'Hz', min: 0.01, max: 10, help: OEM_NV, oemLimit: { direction: 'max', parameter: 'Steady-state frequency band allowed' } },
    { id: 'whenObserved', kind: 'choice', text: 'When does it hunt?', options: [{ value: 'no-load', label: 'At no load' }, { value: 'steady-load', label: 'At steady load' }, { value: 'load-change', label: 'After load changes' }, { value: 'always', label: 'All the time' }] },
    { id: 'governorType', kind: 'choice', text: 'Governor type', options: [{ value: 'mechanical', label: 'Mechanical governor' }, { value: 'electronic', label: 'Electronic governor + actuator' }, { value: 'ecm', label: 'Engine ECM (electronic engine)' }] },
    { id: 'fuelSupply', kind: 'choice', text: 'Fuel supply (dip, water separator, filters, suction side; set stopped)', options: [{ value: 'ok', label: 'Correct' }, { value: 'air', label: 'Air in the fuel' }, { value: 'restricted', label: 'Filter or suction restricted' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'speedSensor', kind: 'choice', text: 'Speed sensor (magnetic pickup) gap, cable and connector (set stopped and isolated)', options: [{ value: 'ok', label: 'Correct' }, { value: 'fault', label: 'Loose, damaged, wrong gap or fault code' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'gainChanged', kind: 'choice', text: 'Were the governor gain/stability settings changed recently (or the governor/controller replaced)?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'loadType', kind: 'choice', text: 'Type of load', options: [{ value: 'steady', label: 'Steady' }, { value: 'cyclic', label: 'Cyclic (crusher, welder, pumps starting often)' }, { value: 'non-linear', label: 'Mostly drives / UPS / rectifiers' }, { value: 'none', label: 'No load' }] },
    { id: 'voltageHunts', kind: 'choice', text: 'Does the voltage swing at the same time?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], needsRunning: true },
  ],
  stopRules: [
    { when: is('overspeedTrip', 'yes'), level: 'STOP', message: 'STOP: the hunting has reached an overspeed shutdown. Do not reset and restart. Use the "Overspeed shutdown" workflow first: linkage, actuator, speed sensor and trip setting are checked with the set stopped and isolated.' },
    { when: is('linkage', 'disconnected'), level: 'STOP', message: 'STOP: a disconnected, broken or seized fuel linkage can let the engine overspeed. Do not run until it is repaired and moves freely through its full travel (checked with the set stopped and isolated).' },
    { when: is('parallel', 'parallel'), level: 'CAUTION', message: 'Open the generator circuit breaker and take the set out of parallel before diagnosing: a hunting set in parallel can cause reverse power and breaker trips. Do not re-synchronise until its frequency is stable. Synchronising limits are NOT VERIFIED here; use the controller settings sheet.', underStop: 'Keep the generator circuit breaker open and the set out of parallel; do not re-synchronise until the fault is found and cleared.' },
  ],
  limits: [
    { id: 'swing-band', reading: 'freqSwing', limit: 'oemMaxSwing', protective: false,
      shutdown: 'STOP: the frequency swing has reached the band entered as a shutdown value. Open the generator breaker and stop the set; check the linkage, actuator and governor with the set isolated.',
      warning: 'CAUTION: the frequency swing has reached the band entered (warning value): transfer or shed sensitive loads (UPS, drives, IT, medical) before further diagnosis.' },
  ],
  causes: [
    {
      id: 'linkage', title: 'Actuator or fuel linkage sticking or worn',
      evidence: [
        { when: is('linkage', ['sticking', 'worn', 'disconnected']), effect: 'strongly', because: 'Linkage sticks, binds, has play or is disconnected' },
        { when: is('whenObserved', 'no-load'), effect: 'supports', because: 'Hunting at no load points to the linkage or governor settings rather than the load' },
        { when: is('governorType', 'mechanical'), effect: 'supports', because: 'Mechanical governors are sensitive to linkage friction and wear' },
        { when: is('linkage', 'ok'), effect: 'excludes', because: 'Linkage moves freely through full travel' },
      ],
      actions: ['With the set stopped and isolated: clean, free or replace the sticking or worn linkage joints; check the actuator moves the rack through full travel with no binding.'],
      reference: `${PRACTICE} ${REF_ISO_3046_4}`,
    },
    {
      id: 'gain', title: 'Governor gain / stability setting',
      evidence: [
        { when: is('gainChanged', 'yes'), effect: 'strongly', because: 'Settings changed or governor/controller replaced recently' },
        { when: is('whenObserved', 'no-load'), effect: 'supports', because: 'Hunting at no load' },
        { when: is('gainChanged', 'no'), effect: 'contradicts', because: 'No recent change to the governor settings' },
      ],
      actions: ['Compare the governor/controller gain and stability settings with the settings sheet or commissioning record for this set; restore the recorded values.'],
      runningChecks: ['Only when no STOP is active: re-tune gain and stability per the governor manual with a frequency meter connected — no load first, then load steps — by a technician trained on that governor, guards in place.'],
      reference: `${PRACTICE} ${REF_ISO_3046_4}`,
    },
    {
      id: 'fuel', title: 'Fuel supply: air in the fuel or restriction',
      evidence: [
        { when: is('fuelSupply', ['air', 'restricted']), effect: 'strongly', because: 'Air in the fuel, or a restricted filter or suction' },
        { when: is('whenObserved', ['steady-load', 'always']), effect: 'supports', because: 'Hunting at steady load: fuel starvation shows when fuel demand is high' },
        { when: is('fuelSupply', 'ok'), effect: 'contradicts', because: 'Fuel supply checked correct' },
      ],
      actions: ['With the set stopped and isolated: check the tank by dip, the water separator and filters; find air leaks on the suction side (fittings, filter seals, cracked pipe); bleed per the OEM procedure.'],
      runningChecks: ['Only when no STOP is active: watch the fuel sight glass or return line for bubbles at no load, from outside the guards.'],
      reference: PRACTICE,
    },
    {
      id: 'sensor', title: 'Speed sensor (magnetic pickup) signal fault',
      evidence: [
        { when: is('speedSensor', 'fault'), effect: 'strongly', because: 'Speed sensor loose, damaged, wrong gap or fault code' },
        { when: is('speedSensor', 'ok'), effect: 'excludes', because: 'Speed sensor checked correct' },
        { when: is('governorType', 'mechanical'), effect: 'excludes', because: 'A mechanical governor does not use the magnetic pickup to control speed' },
      ],
      actions: ['With the set stopped and isolated: set the pickup gap per the OEM manual, clean metal debris from the tip, check the screened cable (screen earthed at one end only, per the governor manual) and the connector.'],
      runningChecks: ['Only when no STOP is active: measure the pickup AC signal at the governor/controller terminals while cranking or running, with rated instruments and guards in place.'],
      reference: PRACTICE,
    },
    {
      id: 'load', title: 'Cyclic or non-linear load interacting with the governor',
      evidence: [
        { when: is('loadType', 'cyclic'), effect: 'strongly', because: 'Cyclic load' },
        { when: is('loadType', 'non-linear'), effect: 'supports', because: 'Mostly drives, UPS or rectifiers' },
        { when: is('whenObserved', 'load-change'), effect: 'supports', because: 'Hunting follows load changes' },
        { when: is('loadType', 'steady'), effect: 'contradicts', because: 'Steady load' },
        { when: { any: [is('whenObserved', 'no-load'), is('loadType', 'none')] }, effect: 'excludes', because: 'Hunts with no load connected' },
      ],
      actions: ['Identify cyclic or non-linear loads and compare the set rating with the load profile (Calculators tab); discuss governor settings for the load with the governor supplier.'],
      runningChecks: ['Only when no STOP is active: log frequency with and without the suspect load connected.'],
      reference: `${PRACTICE} ${REF_ISO_8528_5}`,
    },
    {
      id: 'avr', title: 'AVR and governor interacting (voltage swings too)',
      evidence: [
        { when: is('voltageHunts', 'yes'), effect: 'strongly', because: 'Voltage swings with the frequency' },
        { when: is('voltageHunts', 'no'), effect: 'excludes', because: 'Voltage is steady' },
      ],
      actions: ['Check the AVR stability and under-frequency roll-off settings against the AVR manual; with the set stopped and isolated, check the AVR sensing connections.'],
      reference: ALT_PRACTICE,
    },
    {
      id: 'parallel', title: 'Load sharing in parallel',
      evidence: [
        { when: is('parallel', 'parallel'), effect: 'strongly', because: 'Running in parallel' },
        { when: is('parallel', 'single'), effect: 'excludes', because: 'Runs alone' },
      ],
      actions: ['Check the load-sharing lines, droop / isochronous selection and the controller load-sharing settings against the commissioning record.'],
      reference: `${PRACTICE} ${REF_ISO_8528_5}`,
    },
    {
      id: 'within-band', title: 'Swing within the band entered for this set (no governing fault shown by this reading)',
      evidence: [
        { when: { q: 'freqSwing', op: 'ltRef', ref: 'oemMaxSwing' }, effect: 'strongly', because: 'Measured swing is inside the band entered for this set' },
        { when: { q: 'freqSwing', op: 'geRef', ref: 'oemMaxSwing' }, effect: 'excludes', because: 'Measured swing has reached or exceeded the band entered for this set' },
      ],
      actions: ['Check the meter type and its calibration; record the reading. A swing inside the band does not by itself show a fault; it is not a pass against ISO 8528-5 unless the band entered is the agreed one.'],
      runningChecks: ['Only when no STOP is active: repeat the measurement at steady load for long enough to be representative.'],
      reference: REF_ISO_8528_5,
    },
  ],
};

// ─── 8. Overspeed shutdown / runaway ─────────────────────────────────────────
export const OVERSPEED: FaultFamily = {
  id: 'overspeed',
  title: 'Overspeed shutdown or runaway',
  keywords: /over.?speed|run.?away|over.?rev/i,
  review: 'technician review pending',
  references: [REF_ISO_3046_4, REF_ISO_8528_5],
  mandatorySafety: [
    `An overspeed shutdown is a protective trip: do not reset and restart to "see if it happens again". ${LOCK_OFF} before any check on the linkage, actuator, speed sensor or wiring.`,
    'If an engine runs away (keeps accelerating or will not stop): keep clear of the plane of the fan, flywheel and coupling; use the emergency stop and the fuel shut-off, and the air-intake shut-off if one is fitted. Never try to block the air intake by hand or with objects.',
  ],
  questions: [
    { id: 'tripSource', kind: 'choice', text: 'What shut the set down?', options: [{ value: 'controller', label: 'Controller overspeed alarm' }, { value: 'ecm', label: 'Engine ECM overspeed code' }, { value: 'mechanical-device', label: 'Mechanical overspeed device' }, { value: 'unknown', label: 'Not known' }] },
    { id: 'runaway', kind: 'choice', text: 'Did the engine keep accelerating, or not stop when commanded?', options: [{ value: 'no', label: 'No, it shut down' }, { value: 'yes', label: 'Yes (runaway)' }] },
    { id: 'oilIntake', kind: 'choice', text: 'Oil in the intake / at the turbo outlet, or sump above the full mark (set stopped, isolated, cooled)?', options: [{ value: 'none', label: 'Neither' }, { value: 'oil-in-intake', label: 'Oil in the intake or turbo outlet' }, { value: 'sump-overfull', label: 'Sump above the full mark' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'linkage', kind: 'choice', text: 'Actuator and fuel linkage moved through full travel by hand (set stopped and isolated)', options: [{ value: 'ok', label: 'Moves freely' }, { value: 'sticking', label: 'Sticks or binds' }, { value: 'disconnected', label: 'Disconnected, broken or seized' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'whenTripped', kind: 'choice', text: 'When did it trip?', options: [{ value: 'start', label: 'During start-up' }, { value: 'load-rejection', label: 'When load was removed / breaker opened' }, { value: 'steady', label: 'At steady running' }, { value: 'stopping', label: 'While stopping' }] },
    { id: 'peakRpm', kind: 'number', text: 'Highest speed in the controller/ECM event log', unit: 'rpm', min: 0, max: 5000 },
    { id: 'oemTripRpm', kind: 'number', text: 'Overspeed trip setting for this set (controller/ECM settings sheet)', unit: 'rpm', min: 300, max: 5000, help: OEM_NV, oemLimit: { direction: 'max', parameter: 'Overspeed trip setting' } },
    { id: 'ratedRpm', kind: 'number', text: 'Rated speed (rating plate)', unit: 'rpm', min: 300, max: 4000, ratingPlate: true },
    { id: 'speedSensor', kind: 'choice', text: 'Speed sensor gap, screened cable and connector (set stopped and isolated)', options: [{ value: 'ok', label: 'Correct' }, { value: 'fault', label: 'Loose, damaged, wrong gap or interference' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'settingsChanged', kind: 'choice', text: 'Controller/ECM settings changed, or controller replaced, recently?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
  ],
  stopRules: [
    { when: is('runaway', 'yes'), level: 'STOP', message: 'STOP — RUNAWAY: an engine that will not stop or keeps accelerating may be running on engine oil (turbo seal, overfull crankcase) or on a jammed fuel rack. Keep clear. Do not restart until the source of the uncontrolled fuel is found and repaired and a senior technician has authorised a supervised test.' },
    { when: is('tripSource', ['controller', 'ecm', 'mechanical-device', 'unknown']), level: 'STOP', message: 'STOP: overspeed shutdown. Do not restart until the linkage moves freely, the speed-sensor path and the trip setting have been checked with the set stopped and isolated, and the cause below is found. A test run afterwards is a supervised step authorised by a senior technician; it is not part of this guide.' },
    { when: is('oilIntake', ['oil-in-intake', 'sump-overfull']), level: 'STOP', message: 'STOP: oil in the intake or an overfull sump can feed the engine and cause a runaway. Do not run until the source is found and corrected.' },
    { when: is('linkage', 'disconnected'), level: 'STOP', message: 'STOP: a disconnected, broken or seized fuel linkage can leave the fuel rack open. Do not run until it is repaired.' },
  ],
  limits: [
    { id: 'overspeed-trip', reading: 'peakRpm', limit: 'oemTripRpm', protective: true,
      shutdown: 'STOP: the logged speed has reached the overspeed trip setting entered. Do not restart until the cause is found (see the checks below).',
      warning: 'CAUTION: the logged speed has reached the overspeed warning value entered: find the cause before the set returns to service.' },
  ],
  causes: [
    {
      id: 'governor-response', title: 'Governor or actuator too slow on load rejection',
      evidence: [
        { when: is('whenTripped', 'load-rejection'), effect: 'strongly', because: 'Tripped when load was removed' },
        { when: { q: 'peakRpm', op: 'geRef', ref: 'oemTripRpm' }, effect: 'supports', because: 'Logged speed at or above the trip setting entered: a real overspeed' },
        { when: is('whenTripped', ['start', 'stopping']), effect: 'contradicts', because: 'Tripped at start or stop, not on a load change' },
      ],
      actions: ['Compare the governor gain/stability and actuator settings with the commissioning record; with the set stopped and isolated, check the actuator and linkage move freely.'],
      reference: `${PRACTICE} ${REF_ISO_3046_4}`,
    },
    {
      id: 'linkage', title: 'Fuel linkage or actuator sticking or disconnected',
      evidence: [
        { when: is('linkage', ['sticking', 'disconnected']), effect: 'strongly', because: 'Linkage sticks or is disconnected' },
        { when: is('linkage', 'ok'), effect: 'excludes', because: 'Linkage moves freely through full travel' },
      ],
      actions: ['With the set stopped and isolated: repair or replace the linkage and joints; confirm the rack returns to the no-fuel position by itself.'],
      reference: PRACTICE,
    },
    {
      id: 'sensor-false', title: 'False trip from a faulty or noisy speed signal',
      evidence: [
        { when: is('speedSensor', 'fault'), effect: 'strongly', because: 'Speed sensor loose, damaged, wrong gap or interference' },
        { when: { q: 'peakRpm', op: 'ltRef', ref: 'oemTripRpm' }, effect: 'supports', because: 'Logged peak below the trip setting entered: the trip may come from a corrupted speed signal' },
        { when: is('speedSensor', 'ok'), effect: 'contradicts', because: 'Speed sensor checked correct' },
      ],
      actions: ['With the set stopped and isolated: set the pickup gap per the OEM manual; check the screened cable routing away from power cables, the screen earth and the connector.'],
      reference: PRACTICE,
    },
    {
      id: 'settings', title: 'Wrong overspeed setpoint, flywheel-teeth or pole setting',
      evidence: [
        { when: is('settingsChanged', 'yes'), effect: 'strongly', because: 'Settings changed or controller replaced recently' },
        { when: { q: 'oemTripRpm', op: 'leRef', ref: 'ratedRpm' }, effect: 'strongly', because: 'The trip setting entered is at or below the rated speed: the setting, or the entry, is wrong' },
        { when: is('settingsChanged', 'no'), effect: 'contradicts', because: 'No recent settings change' },
      ],
      actions: ['Compare the overspeed setpoint, the flywheel-teeth (or pole-pair) count and the speed source with the settings sheet for this set; correct them with the controller/ECM software.'],
      reference: PRACTICE,
    },
    {
      id: 'oil-fuel', title: 'Engine running on its own oil (turbo seal, overfull crankcase)',
      evidence: [
        { when: is('oilIntake', ['oil-in-intake', 'sump-overfull']), effect: 'strongly', because: 'Oil in the intake or sump overfull' },
        { when: is('runaway', 'yes'), effect: 'supports', because: 'Engine ran away' },
        { when: is('oilIntake', 'none'), effect: 'excludes', because: 'No oil in the intake and sump level correct' },
      ],
      actions: ['With the set stopped, isolated and cooled: inspect the turbo seals, intake and crankcase breather; find why the sump is overfull (fuel or coolant in the oil) and change the oil.'],
      reference: PRACTICE,
    },
    {
      id: 'start-fuel', title: 'Over-fuelling during start-up',
      evidence: [
        { when: is('whenTripped', 'start'), effect: 'strongly', because: 'Tripped during start-up' },
        { when: is('whenTripped', ['load-rejection', 'steady', 'stopping']), effect: 'contradicts', because: 'Did not trip during start-up' },
      ],
      actions: ['Compare the start fuel limit / speed ramp settings and the actuator rest position with the governor or ECM documentation for this set.'],
      reference: PRACTICE,
    },
  ],
};

// ─── 9. Battery not charging / overcharging ─────────────────────────────────
const chargeBand: Condition = { all: [{ q: 'runVoltage', op: 'gtRef', ref: 'oemChargeMin' }, { q: 'runVoltage', op: 'ltRef', ref: 'oemChargeMax' }] };
export const CHARGING: FaultFamily = {
  id: 'charging',
  title: 'Battery not charging, or overcharging (engine alternator or mains charger)',
  keywords: /not charging|no charge|charg(e|ing) (fail\w*|fault|alarm|light|lamp)|battery (keeps going flat|charger|overcharg\w*|boiling|swollen|hot)|charger|overcharg\w*|charge alternator|alternator (not charging|belt)/i,
  review: 'technician review pending',
  references: [BCI, REF_IEEE_450, REF_IEEE_1188],
  mandatorySafety: [
    'Batteries give off explosive hydrogen: no sparks, flames or smoking near them; wear eye protection; disconnect the negative lead first and reconnect it last.',
    `Belt, charging-alternator and wiring checks only after you ${LOCK_OFF}. The fan and belt can start without warning on an automatic-start set.`,
  ],
  questions: [
    { id: 'batteryCondition', kind: 'choice', text: 'Battery condition (look and smell; do not touch a hot battery)', options: [{ value: 'normal', label: 'Normal' }, { value: 'hot-swollen', label: 'Hot or swollen case' }, { value: 'gassing', label: 'Strong gassing or rotten-egg smell' }, { value: 'electrolyte-low', label: 'Electrolyte low (vented cells)' }] },
    { id: 'belt', kind: 'choice', text: 'Charging-alternator belt (set stopped and isolated)', options: [{ value: 'ok', label: 'Correct tension' }, { value: 'slack', label: 'Slack or glazed' }, { value: 'broken', label: 'Broken or missing' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'systemVoltage', kind: 'choice', text: 'Battery system voltage', options: [{ value: '12', label: '12 V' }, { value: '24', label: '24 V' }] },
    { id: 'source', kind: 'choice', text: 'Which charging source is in question?', options: [{ value: 'alternator', label: 'Engine charging alternator' }, { value: 'charger', label: 'Mains battery charger' }, { value: 'both', label: 'Both / not known' }] },
    { id: 'runVoltage', kind: 'number', text: 'Battery voltage at the terminals with the engine running at rated speed (DC meter, keep clear of the belt and fan)', unit: 'V', min: 0, max: 40, needsRunning: true },
    { id: 'oemChargeMin', kind: 'number', text: 'Lowest regulated charging voltage for this alternator (alternator or engine manual)', unit: 'V', min: 5, max: 40, help: OEM_NV, oemLimit: { direction: 'min', parameter: 'Lowest regulated charging voltage' } },
    { id: 'oemChargeMax', kind: 'number', text: 'Highest regulated charging voltage for this alternator (alternator or engine manual)', unit: 'V', min: 5, max: 40, help: OEM_NV, oemLimit: { direction: 'max', parameter: 'Highest regulated charging voltage' } },
    { id: 'restVoltage', kind: 'number', text: 'Battery voltage at rest (engine off, charger off, after at least 1 h)', unit: 'V', min: 0, max: 32 },
    { id: 'chargeAlarm', kind: 'choice', text: 'Charge-fail alarm or lamp while running?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], needsRunning: true },
    { id: 'excitation', kind: 'choice', text: 'Alternator excitation (D+ / warning-lamp) wire and plugs (set stopped and isolated)', options: [{ value: 'ok', label: 'Intact and tight' }, { value: 'open', label: 'Broken, loose or lamp open' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'terminals', kind: 'choice', text: 'Battery terminals and charging cables', options: [{ value: 'clean', label: 'Clean and tight' }, { value: 'corroded', label: 'Corroded or loose' }] },
    { id: 'chargerSupply', kind: 'choice', text: 'Mains supply to the battery charger (breaker on, supply indicator)', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent / breaker off' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'chargerOutput', kind: 'choice', text: 'Battery charger output / display', options: [{ value: 'normal', label: 'Charging normally' }, { value: 'none', label: 'No output' }, { value: 'alarm', label: 'Charger alarm' }, { value: 'not-checked', label: 'Not checked' }] },
  ],
  stopRules: [
    { when: is('batteryCondition', 'hot-swollen'), level: 'STOP', message: 'STOP: a hot or swollen battery can be in thermal runaway. Stop the engine and switch off and isolate the mains battery charger; keep sparks and flames away and ventilate. Do not disconnect or move it until it has cooled; then replace it.' },
    { when: is('batteryCondition', 'gassing'), level: 'STOP', message: 'STOP charging: strong gassing or a rotten-egg smell means overcharging or a failed cell. Stop the engine, switch off and isolate the charger and ventilate the room; no sparks or flames.' },
    { when: is('belt', 'broken'), level: 'STOP', message: 'STOP: a broken or missing belt. On many engines the same belt drives the water pump and fan, so running on risks overheating. Do not run until it is replaced (set stopped and isolated).' },
    { when: is('source', ['charger', 'both']), level: 'CAUTION', message: 'The battery charger has mains voltage inside: isolate and lock off its supply before opening it. Only a competent electrician works inside the charger.' },
  ],
  limits: [
    { id: 'charge-max', reading: 'runVoltage', limit: 'oemChargeMax', protective: false,
      shutdown: 'STOP the engine: the charging voltage has reached the highest value entered for this alternator (shutdown value). Overcharging boils the battery and can damage the controller and ECM. Do not run until the regulator fault is found.',
      warning: 'CAUTION: the charging voltage has reached the highest value entered (warning value). Watch the battery for heat or gassing; repair the regulator before the set returns to normal duty.' },
    { id: 'charge-min', reading: 'runVoltage', limit: 'oemChargeMin', protective: false,
      shutdown: 'STOP the engine: the charging voltage has reached the lowest value entered and the source classifies it as a shutdown value; check the charging alternator and belt with the set isolated.',
      warning: 'CAUTION: the charging voltage has reached the lowest value entered (warning value): the battery is not being charged and the set may fail to start next time.' },
  ],
  causes: [
    {
      id: 'belt', title: 'Charging-alternator belt slack or broken',
      evidence: [
        { when: is('belt', ['slack', 'broken']), effect: 'strongly', because: 'Belt slack, glazed or broken' },
        { when: is('source', 'charger'), effect: 'contradicts', because: 'Only the mains charger is in question' },
        { when: is('belt', 'ok'), effect: 'excludes', because: 'Belt tension correct' },
      ],
      actions: ['With the set stopped and isolated: replace or tension the belt to the OEM figure; check pulley alignment.'],
      reference: PRACTICE,
    },
    {
      id: 'alt-under', title: 'Charging alternator or regulator not charging',
      evidence: [
        { when: { q: 'runVoltage', op: 'leRef', ref: 'oemChargeMin' }, effect: 'strongly', because: 'Running battery voltage at or below the lowest charging voltage entered' },
        { when: is('chargeAlarm', 'yes'), effect: 'supports', because: 'Charge-fail alarm while running' },
        { when: is('source', 'charger'), effect: 'contradicts', because: 'Only the mains charger is in question' },
        { when: chargeBand, effect: 'excludes', because: 'Running battery voltage inside the charging band entered' },
      ],
      actions: ['With the set stopped and isolated: check the alternator output and earth cables and plugs; then have the alternator and regulator bench-tested.'],
      runningChecks: ['Only when no STOP is active: with the set running and guards in place, measure the voltage at the alternator output terminal and at the battery to find a drop in the charging cable (DC meter; keep clear of the belt and fan).'],
      reference: `${PRACTICE} ${BCI}`,
    },
    {
      id: 'alt-over', title: 'Regulator overcharging',
      evidence: [
        { when: { q: 'runVoltage', op: 'geRef', ref: 'oemChargeMax' }, effect: 'strongly', because: 'Running battery voltage at or above the highest charging voltage entered' },
        { when: is('batteryCondition', 'gassing'), effect: 'supports', because: 'Battery gassing' },
        { when: { q: 'runVoltage', op: 'ltRef', ref: 'oemChargeMax' }, effect: 'excludes', because: 'Running battery voltage below the highest charging voltage entered' },
      ],
      actions: ['Repair or replace the regulator; check the regulator sensing wire if it is battery-sensed; check the battery for overcharge damage before returning it to service.'],
      reference: PRACTICE,
    },
    {
      id: 'excitation', title: 'Alternator excitation (D+ / warning-lamp) circuit open',
      evidence: [
        { when: is('excitation', 'open'), effect: 'strongly', because: 'Excitation wire broken or loose, or lamp open' },
        { when: is('chargeAlarm', 'yes'), effect: 'supports', because: 'Charge-fail alarm while running' },
        { when: is('excitation', 'ok'), effect: 'excludes', because: 'Excitation wire and plugs intact' },
      ],
      actions: ['With the set stopped and isolated: repair the excitation wire, plug or lamp circuit to the wiring diagram for this engine.'],
      reference: PRACTICE,
    },
    {
      id: 'connections', title: 'Corroded or loose battery or charging connections',
      evidence: [
        { when: is('terminals', 'corroded'), effect: 'strongly', because: 'Terminals or cables corroded or loose' },
        { when: is('terminals', 'clean'), effect: 'contradicts', because: 'Terminals clean and tight' },
      ],
      actions: ['With the set stopped and isolated (negative lead off first): clean and tighten the battery terminals and the charging cables; protect the terminals.'],
      reference: PRACTICE,
    },
    {
      id: 'battery', title: 'Battery will not hold charge (failed or sulphated)',
      evidence: [
        { when: { all: [sys({ q: 'restVoltage', op: 'lt', value: 12.4 }, { q: 'restVoltage', op: 'lt', value: 24.8 }), chargeBand] }, effect: 'strongly', because: 'Charging voltage inside the band entered, but the battery rests below about 75 % charge (BCI)' },
        { when: is('batteryCondition', 'hot-swollen'), effect: 'strongly', because: 'Battery hot or swollen' },
        { when: is('batteryCondition', ['electrolyte-low', 'gassing']), effect: 'supports', because: 'Electrolyte low or battery gassing' },
      ],
      actions: ['Charge fully, rest, then load-test (BCI) or test with a conductance tester; replace a battery that fails. Vented cells: electrolyte level and specific gravity per IEEE 450. VRLA: see IEEE 1188.'],
      reference: `${BCI} ${REF_IEEE_450} ${REF_IEEE_1188}`,
    },
    {
      id: 'charger-supply', title: 'No mains supply to the battery charger',
      evidence: [
        { when: is('chargerSupply', 'absent'), effect: 'strongly', because: 'Charger supply absent or breaker off' },
        { when: is('source', 'alternator'), effect: 'contradicts', because: 'Only the engine alternator is in question' },
        { when: is('chargerSupply', 'present'), effect: 'excludes', because: 'Charger supply present' },
      ],
      actions: ['Find why the charger breaker or fuse is off; an electrician checks the supply circuit, isolated before anything is opened.'],
      reference: PRACTICE,
    },
    {
      id: 'charger', title: 'Mains battery charger fault or wrong setting',
      evidence: [
        { when: { all: [is('chargerSupply', 'present'), is('chargerOutput', ['none', 'alarm'])] }, effect: 'strongly', because: 'Supply present but no output or a charger alarm' },
        { when: is('source', 'alternator'), effect: 'contradicts', because: 'Only the engine alternator is in question' },
        { when: is('chargerOutput', 'normal'), effect: 'excludes', because: 'Charger output normal' },
      ],
      actions: ['Read the charger alarm; compare its float and boost settings with the charger manual and the battery maker’s data; repair or replace (isolated, by an electrician).'],
      reference: `${PRACTICE} ${REF_IEEE_450}`,
    },
  ],
  // Plausibility only (not OEM limits): a band entered for a 12 V system above
  // 18 V, or for a 24 V system below 18 V, belongs to the other system voltage.
  crossChecks: [
    { when: { q: 'oemChargeMax', op: 'leRef', ref: 'oemChargeMin' }, refuse: ['oemChargeMin', 'oemChargeMax'], reason: 'Charging band: the highest charging voltage entered is at or below the lowest; check both entries' },
    { when: { all: [is('systemVoltage', '12'), { any: [{ q: 'oemChargeMin', op: 'gt', value: 18 }, { q: 'oemChargeMax', op: 'gt', value: 18 }] }] }, refuse: ['oemChargeMin', 'oemChargeMax'], reason: 'Charging band: a value above 18 V was entered for a 12 V system; check the system voltage or the entry' },
    { when: { all: [is('systemVoltage', '24'), { any: [{ q: 'oemChargeMin', op: 'lt', value: 18 }, { q: 'oemChargeMax', op: 'lt', value: 18 }] }] }, refuse: ['oemChargeMin', 'oemChargeMax'], reason: 'Charging band: a value below 18 V was entered for a 24 V system; check the system voltage or the entry' },
  ],
};

// ─── 10. Excessive exhaust smoke ─────────────────────────────────────────────
export const EXHAUST_SMOKE: FaultFamily = {
  id: 'exhaust-smoke',
  title: 'Excessive exhaust smoke (black, blue or white)',
  keywords: /smok(e|es|ing|y)\b|(black|blue|white|grey|gray) exhaust|exhaust (smoke|haze)|\bsoot|wet.?stack/i,
  review: 'technician review pending',
  references: [REF_ISO_8528_1, REF_NFPA_110],
  mandatorySafety: [
    'Exhaust gas contains carbon monoxide: the set must never run in an enclosed or poorly ventilated space.',
    `The exhaust manifold, turbocharger and silencer stay hot long after stopping. Intake, turbo and injector checks only after you ${LOCK_OFF} and the engine has cooled.`,
  ],
  questions: [
    { id: 'coolantLoss', kind: 'choice', text: 'Coolant level falling with no external leak (checked cold)?', options: [{ value: 'none', label: 'No loss' }, { value: 'losing', label: 'Losing coolant' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'oilCondition', kind: 'choice', text: 'Oil on the dipstick (engine stopped)', options: [{ value: 'normal', label: 'Normal' }, { value: 'milky', label: 'Milky / mayonnaise' }, { value: 'fuel', label: 'Thin, smells of diesel' }] },
    { id: 'turboOil', kind: 'choice', text: 'Oil in the intake pipe or at the turbo compressor outlet (set stopped, isolated, cooled)', options: [{ value: 'none', label: 'None' }, { value: 'oil', label: 'Oil present' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'colour', kind: 'choice', text: 'Smoke colour', options: [{ value: 'black', label: 'Black / dark grey' }, { value: 'blue', label: 'Blue / blue-grey' }, { value: 'white', label: 'White' }], needsRunning: true },
    { id: 'smell', kind: 'choice', text: 'Exhaust smell', options: [{ value: 'normal', label: 'Normal' }, { value: 'sweet', label: 'Sweet (coolant)' }, { value: 'raw-fuel', label: 'Raw diesel' }] },
    { id: 'loadPct', kind: 'number', text: 'Load when smoking (panel or log)', unit: '% of rating', min: 0, max: 150 },
    { id: 'when', kind: 'choice', text: 'When is it worst?', options: [{ value: 'cold-start', label: 'After a cold start' }, { value: 'light-load', label: 'At light or no load' }, { value: 'full-load', label: 'At high load / load steps' }, { value: 'always', label: 'All the time' }] },
    { id: 'airFilter', kind: 'choice', text: 'Air filter and restriction indicator (set stopped)', options: [{ value: 'ok', label: 'Clean, indicator OK' }, { value: 'restricted', label: 'Dirty or indicator tripped' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'injectors', kind: 'choice', text: 'Injectors (removed and tested, or cylinder cut-out by the OEM procedure)', options: [{ value: 'tested-ok', label: 'Tested good' }, { value: 'failed', label: 'One or more failed' }, { value: 'not-tested', label: 'Not tested' }] },
    { id: 'oilUse', kind: 'choice', text: 'Oil consumption', options: [{ value: 'normal', label: 'Normal' }, { value: 'high', label: 'High' }] },
    { id: 'blowby', kind: 'choice', text: 'Crankcase breather fumes', options: [{ value: 'normal', label: 'Normal' }, { value: 'heavy', label: 'Heavy' }] },
    { id: 'lightLoad', kind: 'choice', text: 'Long periods of running at light or no load?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'waterInFuel', kind: 'choice', text: 'Water separator / fuel sample', options: [{ value: 'clean', label: 'Clean' }, { value: 'water', label: 'Water present' }, { value: 'not-checked', label: 'Not checked' }] },
  ],
  stopRules: [
    // Coolant entering the cylinders: white smoke with coolant loss or a sweet smell, OR coolant loss with a sweet smell whatever the colour (safety review F8).
    { when: { any: [{ all: [is('colour', 'white'), { any: [is('coolantLoss', 'losing'), is('smell', 'sweet')] }] }, { all: [is('coolantLoss', 'losing'), is('smell', 'sweet')] }] }, level: 'STOP', message: 'STOP: coolant loss with white smoke or a sweet exhaust smell points to coolant entering the cylinders (head gasket, cracked head or liner). Do not run or crank: a hydraulic lock can bend a connecting rod. Inspect first. Never open the radiator cap while hot.' },
    { when: is('coolantLoss', 'losing'), level: 'CAUTION', message: 'Coolant loss: do not open the radiator or expansion-tank cap while hot (pressurised coolant scalds). Check it cold.' },
    { when: is('oilCondition', 'milky'), level: 'STOP', message: 'STOP: milky oil means coolant in the oil. Do not run until the source is found (head gasket, oil cooler, liners).' },
    { when: is('oilCondition', 'fuel'), level: 'STOP', message: 'STOP: oil thinned by fuel can starve the bearings. Do not run until the fuel leak into the sump is found and the oil and filter are changed.' },
    { when: is('turboOil', 'oil'), level: 'STOP', message: 'STOP: oil in the intake or at the turbo outlet. A failed turbo seal can feed oil into the engine and cause a runaway, and the turbo can fail completely. Do not run until inspected.' },
    { when: { q: 'loadPct', op: 'gt', value: 100 }, level: 'CAUTION', message: 'The load entered is above 100 % of the rating: reduce the load to within the rating for this duty (ISO 8528-1 rating definitions, OEM data) or stop the set. Running overloaded overheats and damages the engine.', underStop: 'Recorded for the investigation: the load was above 100 % of the rating when the fault was seen.' },
  ],
  causes: [
    {
      id: 'air', title: 'Air intake restriction (black smoke)',
      evidence: [
        { when: is('airFilter', 'restricted'), effect: 'strongly', because: 'Air filter dirty or restriction indicator tripped' },
        { when: is('colour', 'black'), effect: 'supports', because: 'Black smoke: more fuel than the air can burn' },
        { when: is('colour', ['blue', 'white']), effect: 'contradicts', because: 'Blue or white smoke, not black' },
        { when: is('airFilter', 'ok'), effect: 'excludes', because: 'Air filter clean and indicator OK' },
      ],
      actions: ['With the set stopped and isolated: replace the air filter element; check the intake ducting, the intercooler and the turbo inlet for blockage.'],
      reference: PRACTICE,
    },
    {
      id: 'overload', title: 'Overload (black smoke)',
      evidence: [
        { when: { all: [is('colour', 'black'), { q: 'loadPct', op: 'gt', value: 100 }] }, effect: 'strongly', because: 'Black smoke with the load above the rating' },
        { when: { q: 'loadPct', op: 'le', value: 80 }, effect: 'contradicts', because: 'Load well within the rating' },
        { when: is('colour', ['blue', 'white']), effect: 'excludes', because: 'Overload gives black smoke, not blue or white' },
      ],
      actions: ['Compare the connected load with the rating at site conditions (altitude and temperature derating per the OEM data) from the load list and the Calculators tab.'],
      runningChecks: ['Only when no STOP is active: reduce the load to within the rating.'],
      reference: `${PRACTICE} ${REF_ISO_8528_1}`,
    },
    {
      id: 'injectors', title: 'Faulty injectors (black or white smoke)',
      evidence: [
        { when: is('injectors', 'failed'), effect: 'strongly', because: 'Injector failed on test' },
        { when: is('colour', 'black'), effect: 'supports', because: 'Black smoke' },
        { when: is('smell', 'raw-fuel'), effect: 'supports', because: 'Raw-fuel smell' },
        { when: is('injectors', 'tested-ok'), effect: 'excludes', because: 'Injectors tested good' },
      ],
      actions: ['With the set stopped and isolated: remove and test the injectors per the OEM procedure; replace or recondition failed ones; check injection timing if the pump was disturbed.'],
      reference: PRACTICE,
    },
    {
      id: 'turbo-seal', title: 'Turbocharger oil seal leaking (blue smoke)',
      evidence: [
        { when: is('turboOil', 'oil'), effect: 'strongly', because: 'Oil in the intake or at the turbo outlet' },
        { when: is('colour', 'blue'), effect: 'supports', because: 'Blue smoke: burning oil' },
        { when: is('oilUse', 'high'), effect: 'supports', because: 'High oil consumption' },
        { when: is('turboOil', 'none'), effect: 'excludes', because: 'No oil in the intake or at the turbo outlet' },
      ],
      actions: ['With the set stopped, isolated and cooled: check turbo shaft play and the oil drain line for restriction; repair or replace the turbo.'],
      reference: PRACTICE,
    },
    {
      id: 'wear', title: 'Worn piston rings, liners or valve guides (blue smoke)',
      evidence: [
        { when: is('blowby', 'heavy'), effect: 'strongly', because: 'Heavy crankcase breather fumes' },
        { when: { all: [is('colour', 'blue'), is('oilUse', 'high')] }, effect: 'supports', because: 'Blue smoke with high oil consumption' },
        { when: is('colour', 'black'), effect: 'contradicts', because: 'Black smoke, not blue' },
      ],
      actions: ['Plan a compression and blow-by test per the OEM procedure; plan an overhaul if confirmed.'],
      runningChecks: ['Only when no STOP is active: compression test (cranking) and blow-by measurement per the OEM procedure.'],
      reference: PRACTICE,
    },
    {
      id: 'wet-stacking', title: 'Light-load running (wet stacking): unburnt fuel and oil in the exhaust',
      evidence: [
        { when: is('lightLoad', 'yes'), effect: 'strongly', because: 'Long periods of light or no-load running' },
        { when: is('when', 'light-load'), effect: 'supports', because: 'Worst at light or no load' },
        { when: is('lightLoad', 'no'), effect: 'excludes', because: 'No long light-load running' },
      ],
      actions: ['Review the duty: size the set to the load (Calculators tab) and follow the exercise and loading requirements of the OEM manual, and of NFPA 110 where the site follows it.'],
      runningChecks: ['Only when no STOP is active: a supervised run at higher load (site load or a load bank) per the OEM procedure, observing from outside the exhaust path whether the smoke clears.'],
      reference: `${PRACTICE} ${REF_NFPA_110}`,
    },
    {
      id: 'coolant', title: 'Coolant entering the cylinders (white smoke)',
      evidence: [
        { when: is('coolantLoss', 'losing'), effect: 'strongly', because: 'Coolant loss with no external leak' },
        { when: is('smell', 'sweet'), effect: 'strongly', because: 'Sweet exhaust smell' },
        { when: is('colour', 'white'), effect: 'supports', because: 'White smoke' },
        { when: is('colour', 'black'), effect: 'excludes', because: 'Black smoke, not white' },
      ],
      actions: ['Do not run. Pressure-test the cooling system (cold) and do a combustion-gas (block) test; inspect the head gasket, head and liners.'],
      doNotRun: true,
      reference: PRACTICE,
    },
    {
      id: 'cold-unburnt', title: 'Unburnt fuel after a cold start (cold-start aid, compression, timing)',
      evidence: [
        { when: { all: [is('colour', 'white'), is('when', 'cold-start')] }, effect: 'strongly', because: 'White smoke after a cold start' },
        { when: is('smell', 'raw-fuel'), effect: 'supports', because: 'Raw-fuel smell' },
        { when: is('when', 'full-load'), effect: 'contradicts', because: 'Worst at high load, not after a cold start' },
      ],
      actions: ['With the set isolated: test the glow plugs or intake heater and their relay; check the injection timing marks; see the "Cranks but will not start" cold-start checks.'],
      runningChecks: ['Only when no STOP is active: compression test (cranking) per the OEM procedure.'],
      reference: PRACTICE,
    },
    {
      id: 'water-fuel', title: 'Water in the fuel (white smoke)',
      evidence: [
        { when: is('waterInFuel', 'water'), effect: 'strongly', because: 'Water in the separator or fuel sample' },
        { when: is('colour', 'white'), effect: 'supports', because: 'White smoke' },
        { when: is('waterInFuel', 'clean'), effect: 'excludes', because: 'Separator and fuel sample clean' },
      ],
      actions: ['Drain the water separator and tank sump; replace the filters; find the water source (tank vents, condensation, supply); bleed per the OEM procedure.'],
      reference: PRACTICE,
    },
  ],
};

// The cross-family safety screen is asked first in every family (safety review F3).
for (const f of [FREQUENCY_HUNTING, OVERSPEED, CHARGING, EXHAUST_SMOKE]) withScreen(f);

export const EXPANSION_FAMILIES: FaultFamily[] = [FREQUENCY_HUNTING, OVERSPEED, CHARGING, EXHAUST_SMOKE];
