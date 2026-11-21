/**
 * Guided fault-finding families (P1-A, 2026-11-14). Content: general diesel
 * generator service practice, to be reviewed by a senior technician and
 * referenced to OEM manuals per machine. Machine-specific limits are never
 * written here: they are questions answered from the OEM manual (for example
 * "OEM minimum oil pressure"), and rules compare against those answers.
 */
import type { Condition, FaultFamily } from './types';

const PRACTICE = 'General diesel generator service practice (EmersonEIMS); confirm limits and procedure in the OEM service manual for this engine.';
const ALT_PRACTICE = 'General alternator service practice (EmersonEIMS); confirm limits and procedure in the alternator and AVR manuals.';
const BCI = 'Battery Council International load-test guide: about 12.4 V at rest ≈ 75 % charge; a sound 12 V battery stays at or above 9.6 V under a load test at about 21 °C (double for 24 V systems).';

const is = (q: string, value: string | string[]): Condition => ({ q, op: 'is', value });
const sys = (v12: Condition, v24: Condition): Condition => ({ any: [{ all: [is('systemVoltage', '12'), v12] }, { all: [is('systemVoltage', '24'), v24] }] });

// ─── 1. Will not crank / cranks slowly ───────────────────────────────────────
export const NO_CRANK: FaultFamily = {
  id: 'no-crank',
  title: 'Will not crank, or cranks slowly',
  keywords: /\b(won'?t|will not|does not|doesn'?t|not) crank|no crank|slow crank|clicks?\b|starter (does nothing|clicks)|dead battery|flat battery/i,
  review: 'technician review pending',
  questions: [
    { id: 'systemVoltage', kind: 'choice', text: 'Starting system voltage', options: [{ value: '12', label: '12 V' }, { value: '24', label: '24 V' }] },
    { id: 'barOver', kind: 'choice', text: 'With the set isolated, does the engine turn over by hand (barring tool)?', options: [{ value: 'turns', label: 'Turns freely' }, { value: 'stiff', label: 'Turns but stiff' }, { value: 'locked', label: 'Will not turn' }, { value: 'not-tried', label: 'Not tried' }], help: 'Only with the set switched OFF, isolated and locked off.' },
    { id: 'restVoltage', kind: 'number', text: 'Battery voltage at rest (engine off, 1 h after charging)', unit: 'V', min: 0, max: 32 },
    { id: 'crankVoltage', kind: 'number', text: 'Battery voltage while cranking', unit: 'V', min: 0, max: 32 },
    // No built-in "holds its voltage" figure: the minimum comes from the starter / engine manual for this set.
    { id: 'oemMinCrankVoltage', kind: 'number', text: 'OEM minimum battery voltage while cranking (starter or engine manual)', unit: 'V', min: 5, max: 30 },
    { id: 'starterSound', kind: 'choice', text: 'What does the starter do?', options: [{ value: 'nothing', label: 'Nothing' }, { value: 'click', label: 'Clicks only' }, { value: 'slow', label: 'Turns slowly' }, { value: 'normal', label: 'Turns at normal speed' }] },
    { id: 'eStop', kind: 'choice', text: 'Emergency stop', options: [{ value: 'released', label: 'Released' }, { value: 'pressed', label: 'Pressed' }, { value: 'unknown', label: 'Not checked' }] },
    { id: 'controllerAlarm', kind: 'choice', text: 'Does the controller show an alarm or refuse the start?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'terminals', kind: 'choice', text: 'Battery terminals and starter cables', options: [{ value: 'clean', label: 'Clean and tight' }, { value: 'corroded', label: 'Corroded or loose' }, { value: 'hot', label: 'Get hot when cranking' }] },
  ],
  stopRules: [
    { when: is('barOver', 'locked'), level: 'STOP', message: 'STOP: the engine will not turn by hand. Do not try to free it with the starter. Suspect seizure, hydraulic lock (coolant or fuel in a cylinder) or a jammed coupling; inspect before any further attempt.' },
    { when: { q: 'crankVoltage', op: 'ge', value: 0 }, level: 'CAUTION', message: 'Batteries give off explosive gas: no sparks or flames near them; disconnect the negative lead first; wear eye protection.' },
  ],
  causes: [
    {
      id: 'battery', title: 'Discharged or failed battery',
      evidence: [
        { when: sys({ q: 'restVoltage', op: 'lt', value: 12.4 }, { q: 'restVoltage', op: 'lt', value: 24.8 }), effect: 'strongly', because: 'Rest voltage below about 75 % charge (BCI)' },
        { when: sys({ q: 'crankVoltage', op: 'lt', value: 9.6 }, { q: 'crankVoltage', op: 'lt', value: 19.2 }), effect: 'strongly', because: 'Voltage collapses below the BCI load-test level while cranking' },
        { when: is('starterSound', ['click', 'slow']), effect: 'supports', because: 'Starter clicks or turns slowly' },
        { when: { q: 'crankVoltage', op: 'gtRef', ref: 'oemMinCrankVoltage' }, effect: 'contradicts', because: 'Battery stays above the OEM minimum cranking voltage' },
      ],
      actions: ['Charge the battery fully and re-test at rest and under load (BCI load test or a conductance tester).', 'Replace a battery that fails the load test; check the charger/alternator output afterwards.'],
      reference: BCI,
    },
    {
      id: 'cables', title: 'Poor battery or starter cable connection',
      evidence: [
        { when: is('terminals', ['corroded', 'hot']), effect: 'strongly', because: 'Corroded, loose or hot terminals' },
        { when: { all: [sys({ q: 'restVoltage', op: 'ge', value: 12.4 }, { q: 'restVoltage', op: 'ge', value: 24.8 }), is('starterSound', ['click', 'slow'])] }, effect: 'supports', because: 'Good battery but weak cranking' },
        { when: is('terminals', 'clean'), effect: 'contradicts', because: 'Terminals clean and tight' },
      ],
      actions: ['Isolate, clean and tighten the battery terminals and the starter main and earth cables.', 'Measure voltage drop across each cable while cranking (positive and earth paths).'],
      reference: PRACTICE,
    },
    {
      id: 'starter', title: 'Starter motor or solenoid fault',
      evidence: [
        { when: { all: [is('starterSound', ['click', 'nothing']), { q: 'crankVoltage', op: 'gtRef', ref: 'oemMinCrankVoltage' }] }, effect: 'strongly', because: 'Battery stays above the OEM minimum cranking voltage but the starter does not turn' },
        { when: is('starterSound', 'normal'), effect: 'excludes', because: 'The starter turns the engine normally' },
      ],
      actions: ['Check the solenoid supply and the main contacts; bench-test the starter.'],
      reference: PRACTICE,
    },
    {
      id: 'interlock', title: 'Start inhibited: emergency stop, controller or interlock',
      evidence: [
        { when: is('eStop', 'pressed'), effect: 'strongly', because: 'Emergency stop pressed' },
        { when: is('controllerAlarm', 'yes'), effect: 'strongly', because: 'Controller shows an alarm or refuses the start' },
        { when: { all: [is('starterSound', 'nothing'), is('controllerAlarm', 'no'), is('eStop', 'released')] }, effect: 'supports', because: 'No starter action with no alarm: check the start output and relay' },
      ],
      actions: ['Find out why the emergency stop was pressed before releasing it.', 'Read the controller alarm and event log; check the crank relay output.'],
      reference: PRACTICE,
    },
    {
      id: 'seized', title: 'Engine seized or hydraulically locked',
      evidence: [
        { when: is('barOver', 'locked'), effect: 'strongly', because: 'Engine will not turn by hand' },
        { when: is('barOver', 'stiff'), effect: 'supports', because: 'Engine is stiff to turn' },
        { when: is('barOver', 'turns'), effect: 'excludes', because: 'Engine turns freely by hand' },
      ],
      actions: ['Do not crank. Remove injectors to check for liquid in a cylinder; inspect for bearing seizure; check the oil for coolant or fuel.'],
      reference: PRACTICE,
    },
  ],
};

// ─── 2. Cranks but will not start ────────────────────────────────────────────
export const NO_START: FaultFamily = {
  id: 'no-start',
  title: 'Cranks but will not start',
  keywords: /cranks? (but|and) (won'?t|will not|does not|doesn'?t) (start|fire)|won'?t start|will not start|no start|turns over but/i,
  review: 'technician review pending',
  questions: [
    { id: 'fuelLevel', kind: 'choice', text: 'Fuel in the tank (checked by dip, not only the gauge)', options: [{ value: 'ok', label: 'Enough' }, { value: 'low', label: 'Low or empty' }, { value: 'unknown', label: 'Not checked' }] },
    { id: 'fuelAtFilter', kind: 'choice', text: 'Does fuel reach the filter and the injection pump (crack a bleed screw)?', options: [{ value: 'yes', label: 'Yes, solid fuel' }, { value: 'bubbles', label: 'Air bubbles' }, { value: 'no', label: 'No fuel' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'shutoff', kind: 'choice', text: 'Fuel shut-off solenoid / ECM fuel enable during cranking', options: [{ value: 'energised', label: 'Energised (clicks / voltage present)' }, { value: 'not-energised', label: 'Not energised' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'crankRpm', kind: 'number', text: 'Cranking speed', unit: 'rpm', min: 0, max: 800 },
    { id: 'oemMinCrankRpm', kind: 'number', text: 'OEM minimum cranking speed for starting (manual)', unit: 'rpm', min: 30, max: 400 },
    { id: 'smoke', kind: 'choice', text: 'Exhaust while cranking', options: [{ value: 'none', label: 'Nothing' }, { value: 'white', label: 'White/grey vapour' }, { value: 'black', label: 'Black' }] },
    { id: 'ecmCode', kind: 'choice', text: 'Active ECM/controller fault code (speed sensor, fuel, ECM power)?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'cold', kind: 'choice', text: 'Cold start conditions and cold-start aid', options: [{ value: 'warm', label: 'Warm / not relevant' }, { value: 'aid-ok', label: 'Cold, aid working' }, { value: 'aid-failed', label: 'Cold, aid not working' }] },
  ],
  stopRules: [
    { when: is('fuelAtFilter', ['yes', 'bubbles', 'no', 'not-checked']), level: 'CAUTION', message: 'Diesel under pressure can penetrate skin: never feel for leaks by hand; collect spilled fuel; no flames. Follow the starter duty cycle in the manual (crank, then rest) to avoid burning out the starter.' },
  ],
  causes: [
    {
      id: 'no-fuel', title: 'No fuel or fuel starvation',
      evidence: [
        { when: is('fuelLevel', 'low'), effect: 'strongly', because: 'Tank low or empty' },
        { when: is('fuelAtFilter', 'no'), effect: 'strongly', because: 'No fuel at the filter or pump' },
        { when: is('smoke', 'none'), effect: 'supports', because: 'No smoke while cranking: no fuel is being injected' },
        { when: is('fuelAtFilter', 'yes'), effect: 'contradicts', because: 'Solid fuel reaches the pump' },
      ],
      actions: ['Fill the tank; check the supply valve, pick-up, lift pump and water separator.', 'Replace blocked filters; bleed the system.'],
      reference: PRACTICE,
    },
    {
      id: 'air', title: 'Air in the fuel system',
      evidence: [
        { when: is('fuelAtFilter', 'bubbles'), effect: 'strongly', because: 'Air bubbles at the bleed point' },
        { when: is('smoke', 'none'), effect: 'supports', because: 'No smoke while cranking' },
      ],
      actions: ['Bleed the low-pressure system; find the air leak (loose fittings, cracked line, filter seal, low tank).'],
      reference: PRACTICE,
    },
    {
      id: 'shutoff', title: 'Fuel shut-off solenoid or ECM fuel enable not working',
      evidence: [
        { when: is('shutoff', 'not-energised'), effect: 'strongly', because: 'Shut-off solenoid / fuel enable not energised while cranking' },
        { when: { all: [is('fuelAtFilter', 'yes'), is('smoke', 'none')] }, effect: 'supports', because: 'Fuel at the pump but none injected' },
        { when: is('shutoff', 'energised'), effect: 'contradicts', because: 'Shut-off solenoid energised' },
      ],
      actions: ['Check the solenoid supply, fuse and relay from the controller; check the solenoid plunger and linkage.'],
      reference: PRACTICE,
    },
    {
      id: 'crank-speed', title: 'Cranking speed too low to start',
      evidence: [
        { when: { q: 'crankRpm', op: 'ltRef', ref: 'oemMinCrankRpm' }, effect: 'strongly', because: 'Cranking speed below the OEM minimum' },
        { when: { q: 'crankRpm', op: 'gtRef', ref: 'oemMinCrankRpm' }, effect: 'excludes', because: 'Cranking speed above the OEM minimum' },
      ],
      actions: ['Use the "will not crank / cranks slowly" checks: battery, cables, starter, oil grade for the temperature.'],
      reference: PRACTICE,
    },
    {
      id: 'ecm', title: 'ECM, speed sensor or start permissive fault',
      evidence: [
        { when: is('ecmCode', 'yes'), effect: 'strongly', because: 'Active ECM/controller fault code' },
        { when: is('ecmCode', 'no'), effect: 'contradicts', because: 'No active fault code' },
      ],
      actions: ['Look up the active code in the Fault Code tab; check the speed sensor gap and wiring, and the ECM supply and earth while cranking.'],
      reference: PRACTICE,
    },
    {
      id: 'cold-start', title: 'Cold start aid not working',
      evidence: [
        { when: is('cold', 'aid-failed'), effect: 'strongly', because: 'Cold conditions with the start aid not working' },
        { when: is('smoke', 'white'), effect: 'supports', because: 'White vapour: fuel injected but not burning (low compression temperature)' },
        { when: is('cold', 'warm'), effect: 'excludes', because: 'Warm conditions' },
      ],
      actions: ['Test the glow plugs or intake heater and their relay/timer; use the OEM-approved cold-start procedure only.'],
      reference: PRACTICE,
    },
    {
      id: 'compression', title: 'Low compression or injection timing fault',
      evidence: [
        { when: { all: [is('smoke', 'white'), is('cold', ['warm', 'aid-ok'])] }, effect: 'supports', because: 'White vapour in warm conditions or with a working start aid' },
        { when: { all: [is('fuelAtFilter', 'yes'), is('shutoff', 'energised'), is('ecmCode', 'no')] }, effect: 'supports', because: 'Fuel and electrics check out' },
      ],
      actions: ['Compression test per the OEM procedure; check injection timing after any pump or timing work.'],
      reference: PRACTICE,
    },
  ],
};

// ─── 3. Low oil pressure (critical) ──────────────────────────────────────────
export const LOW_OIL_PRESSURE: FaultFamily = {
  id: 'low-oil-pressure',
  title: 'Low oil pressure / oil starvation',
  keywords: /oil pressure|low oil|oil starvation|lube|lubrication/i,
  review: 'technician review pending',
  questions: [
    { id: 'oilPressure', kind: 'number', text: 'Oil pressure measured', unit: 'kPa', min: 0, max: 1500, help: '1 bar = 100 kPa; 1 psi = 6.895 kPa.' },
    { id: 'oemMinOilPressure', kind: 'number', text: 'OEM minimum oil pressure at this speed (manual)', unit: 'kPa', min: 20, max: 800 },
    { id: 'gauge', kind: 'choice', text: 'How was it measured?', options: [{ value: 'mechanical', label: 'Mechanical test gauge' }, { value: 'sender', label: 'Panel sender / display only' }] },
    { id: 'mechanicalAgrees', kind: 'choice', text: 'Does a mechanical gauge show normal pressure while the panel shows low?', options: [{ value: 'yes', label: 'Yes, mechanical reading is normal' }, { value: 'no', label: 'No, both are low' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'oilLevel', kind: 'choice', text: 'Oil level on the dipstick (engine stopped, level ground)', options: [{ value: 'ok', label: 'Between the marks' }, { value: 'low', label: 'Below the low mark' }, { value: 'high', label: 'Above the full mark' }] },
    { id: 'oilCondition', kind: 'choice', text: 'Oil condition', options: [{ value: 'normal', label: 'Normal' }, { value: 'fuel', label: 'Thin, smells of diesel' }, { value: 'milky', label: 'Milky / mayonnaise' }, { value: 'metal', label: 'Metal particles or glitter' }] },
    { id: 'knock', kind: 'choice', text: 'Any knocking or bearing noise?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'recentWork', kind: 'choice', text: 'Recent work', options: [{ value: 'none', label: 'None' }, { value: 'oil-service', label: 'Oil and filter change' }, { value: 'overhaul', label: 'Overhaul or bearing work' }] },
    { id: 'oilTemp', kind: 'number', text: 'Oil temperature', unit: '°C', min: -40, max: 200 },
    { id: 'oemMaxOilTemp', kind: 'number', text: 'OEM maximum oil temperature (manual)', unit: '°C', min: 60, max: 160 },
  ],
  stopRules: [
    { when: { q: 'oilPressure', op: 'ltRef', ref: 'oemMinOilPressure' }, level: 'STOP', message: 'STOP the engine: oil pressure is below the OEM minimum. Running on can destroy the bearings in minutes. Do not restart until the cause is found.' },
    { when: is('knock', 'yes'), level: 'STOP', message: 'STOP: knocking with an oil pressure problem points to bearing damage. Do not restart; inspect the bearings and the oil filter for metal.' },
    { when: is('oilCondition', ['metal', 'milky']), level: 'STOP', message: 'STOP: metal or coolant in the oil. Do not run until the source is found (bearings; head gasket, oil cooler or liners).' },
    { when: is('oilLevel', 'low'), level: 'STOP', message: 'STOP: oil level below the low mark. Do not run until topped up to the mark with the correct grade and the leak or consumption is found.' },
  ],
  causes: [
    {
      id: 'level', title: 'Low oil level (leak or consumption)',
      evidence: [
        { when: is('oilLevel', 'low'), effect: 'strongly', because: 'Level below the low mark' },
        { when: is('oilLevel', 'ok'), effect: 'excludes', because: 'Level between the marks' },
      ],
      actions: ['Top up with the OEM grade; find external leaks; check consumption (blue smoke, breather).'],
      reference: PRACTICE,
    },
    {
      id: 'sender', title: 'Sender, wiring or display fault (pressure actually normal)',
      evidence: [
        { when: is('mechanicalAgrees', 'yes'), effect: 'strongly', because: 'A mechanical gauge reads normal' },
        { when: is('mechanicalAgrees', 'no'), effect: 'excludes', because: 'The mechanical gauge also reads low' },
        { when: is('gauge', 'sender'), effect: 'supports', because: 'Only the panel reading is available' },
      ],
      actions: ['Confirm with a mechanical gauge before any engine work; check the sender, its wiring and the controller calibration.'],
      reference: PRACTICE,
    },
    {
      id: 'dilution', title: 'Fuel dilution of the oil',
      evidence: [
        { when: is('oilCondition', 'fuel'), effect: 'strongly', because: 'Oil thin and smells of diesel' },
        { when: is('oilLevel', 'high'), effect: 'supports', because: 'Level above full (fuel adding to the sump)' },
      ],
      actions: ['Find the fuel leak into the sump (injector, lift pump diaphragm, injection pump seal); change the oil and filter after the repair.'],
      reference: PRACTICE,
    },
    {
      id: 'coolant', title: 'Coolant in the oil',
      evidence: [{ when: is('oilCondition', 'milky'), effect: 'strongly', because: 'Milky oil' }],
      actions: ['Pressure-test the cooling system, oil cooler and head gasket; check liners; change the oil after the repair.'],
      reference: PRACTICE,
    },
    {
      id: 'service', title: 'Wrong oil or filter, or filter not primed after a service',
      evidence: [
        { when: is('recentWork', 'oil-service'), effect: 'strongly', because: 'Oil and filter changed recently' },
        { when: is('recentWork', 'none'), effect: 'contradicts', because: 'No recent oil service' },
      ],
      actions: ['Check the filter part number and that the correct grade was used; prime the filter per the manual.'],
      reference: PRACTICE,
    },
    {
      id: 'bearings', title: 'Worn or damaged bearings',
      evidence: [
        { when: is('oilCondition', 'metal'), effect: 'strongly', because: 'Metal in the oil' },
        { when: is('knock', 'yes'), effect: 'strongly', because: 'Knocking' },
        { when: is('recentWork', 'overhaul'), effect: 'supports', because: 'Recent overhaul or bearing work (clearances, priming, debris)' },
      ],
      actions: ['Do not run. Drop the sump, inspect main and big-end bearings and journals; measure clearances.'],
      reference: PRACTICE,
    },
    {
      id: 'pump', title: 'Oil pump, pick-up or relief valve fault',
      evidence: [
        { when: { all: [is('oilLevel', 'ok'), is('mechanicalAgrees', 'no'), is('oilCondition', 'normal')] }, effect: 'supports', because: 'Level, oil and gauge check out, but pressure is still low' },
        { when: is('recentWork', 'overhaul'), effect: 'supports', because: 'Pump or pick-up disturbed during an overhaul' },
      ],
      actions: ['Inspect the pick-up screen, pump and pressure relief valve per the manual.'],
      reference: PRACTICE,
    },
    {
      id: 'hot-oil', title: 'Oil too hot (thin)',
      evidence: [
        { when: { q: 'oilTemp', op: 'gtRef', ref: 'oemMaxOilTemp' }, effect: 'strongly', because: 'Oil temperature above the OEM maximum' },
        { when: { q: 'oilTemp', op: 'ltRef', ref: 'oemMaxOilTemp', factor: 0.9 }, effect: 'contradicts', because: 'Oil temperature well within the OEM maximum' },
      ],
      actions: ['Use the overheating checks; check the oil cooler and load.'],
      reference: PRACTICE,
    },
  ],
};

// ─── 4. Overheating / high coolant temperature ───────────────────────────────
export const OVERHEATING: FaultFamily = {
  id: 'overheating',
  title: 'Overheating / high coolant temperature',
  keywords: /overheat|high (coolant|engine|water) temp|coolant temp|running hot|boil/i,
  review: 'technician review pending',
  questions: [
    { id: 'coolantTemp', kind: 'number', text: 'Coolant temperature', unit: '°C', min: -40, max: 150 },
    { id: 'oemAlarmCoolantTemp', kind: 'number', text: 'OEM high coolant temperature alarm (manual)', unit: '°C', min: 70, max: 125 },
    { id: 'coolantLevel', kind: 'choice', text: 'Coolant level (only when cold)', options: [{ value: 'ok', label: 'Correct' }, { value: 'low', label: 'Low' }, { value: 'not-checked', label: 'Not checked (engine hot)' }] },
    { id: 'gasBubbles', kind: 'choice', text: 'Bubbles or exhaust smell in the expansion tank while running?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'belt', kind: 'choice', text: 'Fan and water-pump belt', options: [{ value: 'ok', label: 'Correct tension' }, { value: 'slack', label: 'Slack or glazed' }, { value: 'broken', label: 'Broken' }] },
    { id: 'radiator', kind: 'choice', text: 'Radiator core (both faces)', options: [{ value: 'clean', label: 'Clean' }, { value: 'blocked', label: 'Dirty or blocked' }] },
    { id: 'airflow', kind: 'choice', text: 'Room or canopy airflow', options: [{ value: 'ok', label: 'Free inlet and outlet' }, { value: 'recirculating', label: 'Hot air recirculating' }, { value: 'restricted', label: 'Inlet or outlet restricted' }] },
    { id: 'loadPct', kind: 'number', text: 'Load', unit: '% of rating', min: 0, max: 150 },
    { id: 'thermostat', kind: 'choice', text: 'Thermostat test', options: [{ value: 'ok', label: 'Opens correctly' }, { value: 'stuck', label: 'Stuck closed' }, { value: 'not-tested', label: 'Not tested' }] },
    { id: 'sensorCheck', kind: 'choice', text: 'Does an independent thermometer agree with the panel?', options: [{ value: 'agrees', label: 'Agrees' }, { value: 'panel-high', label: 'Panel reads higher' }, { value: 'not-checked', label: 'Not checked' }] },
  ],
  stopRules: [
    { when: { q: 'coolantTemp', op: 'gtRef', ref: 'oemAlarmCoolantTemp' }, level: 'STOP', message: 'Take the load off and STOP the engine: coolant above the OEM alarm. Running on can warp the head and seize pistons. Never pour cold water into a hot engine.' },
    { when: is('gasBubbles', 'yes'), level: 'STOP', message: 'STOP: combustion gas in the coolant suggests a head gasket, cracked head or liner. Do not keep topping up and running.' },
    { when: is('coolantLevel', ['low', 'not-checked']), level: 'CAUTION', message: 'Do not open the radiator or expansion-tank cap while hot: coolant under pressure scalds. Let the engine cool first.' },
  ],
  causes: [
    { id: 'low-coolant', title: 'Low coolant / leak', evidence: [{ when: is('coolantLevel', 'low'), effect: 'strongly', because: 'Coolant low' }, { when: is('coolantLevel', 'ok'), effect: 'excludes', because: 'Coolant at the correct level' }], actions: ['When cold, top up with the correct coolant mix; pressure-test for leaks (hoses, radiator, water pump seal).'], reference: PRACTICE },
    { id: 'gasket', title: 'Head gasket, cracked head or liner', evidence: [{ when: is('gasBubbles', 'yes'), effect: 'strongly', because: 'Combustion gas in the coolant' }, { when: is('gasBubbles', 'no'), effect: 'contradicts', because: 'No gas in the coolant' }], actions: ['Combustion-gas (block) test; pressure test; inspect the head and liners.'], reference: PRACTICE },
    { id: 'belt', title: 'Fan or water-pump belt', evidence: [{ when: is('belt', ['slack', 'broken']), effect: 'strongly', because: 'Belt slack, glazed or broken' }, { when: is('belt', 'ok'), effect: 'excludes', because: 'Belt correct' }], actions: ['Isolate the set, then replace or tension the belt to the OEM figure.'], reference: PRACTICE },
    { id: 'radiator', title: 'Blocked radiator', evidence: [{ when: is('radiator', 'blocked'), effect: 'strongly', because: 'Radiator core dirty or blocked' }, { when: is('radiator', 'clean'), effect: 'excludes', because: 'Radiator clean' }], actions: ['Clean the core from the fan side outwards with low-pressure air or water; check internal blockage by temperature drop across the core.'], reference: PRACTICE },
    { id: 'airflow', title: 'Hot air recirculation or restricted room airflow', evidence: [{ when: is('airflow', ['recirculating', 'restricted']), effect: 'strongly', because: 'Room or canopy airflow problem' }, { when: is('airflow', 'ok'), effect: 'excludes', because: 'Free airflow' }], actions: ['Clear the inlet and outlet; duct the radiator discharge outside; check louvres open.'], reference: PRACTICE },
    { id: 'overload', title: 'Overload', evidence: [{ when: { q: 'loadPct', op: 'gt', value: 100 }, effect: 'strongly', because: 'Load above the rating' }, { when: { q: 'loadPct', op: 'le', value: 80 }, effect: 'contradicts', because: 'Load well within the rating' }], actions: ['Reduce load to within the rating at site conditions (altitude and temperature derating).'], reference: PRACTICE },
    { id: 'thermostat', title: 'Thermostat stuck closed', evidence: [{ when: is('thermostat', 'stuck'), effect: 'strongly', because: 'Thermostat stuck closed' }, { when: is('thermostat', 'ok'), effect: 'excludes', because: 'Thermostat opens correctly' }], actions: ['Replace the thermostat with the OEM rating.'], reference: PRACTICE },
    { id: 'sensor', title: 'Temperature sender or display fault', evidence: [{ when: is('sensorCheck', 'panel-high'), effect: 'strongly', because: 'Panel reads higher than an independent thermometer' }, { when: is('sensorCheck', 'agrees'), effect: 'excludes', because: 'Independent reading agrees' }], actions: ['Check the sender and wiring; do not ignore a real overheat to "fix" a sender.'], reference: PRACTICE },
  ],
};

// ─── 5. Knocking, bearing noise, seizure (always stop) ──────────────────────
export const KNOCK_SEIZURE: FaultFamily = {
  id: 'knock-seizure',
  title: 'Knocking, bearing noise or seizure',
  keywords: /knock|bearing|seiz|metal (in|particles)|big.?end|main bearing|connecting rod/i,
  review: 'technician review pending',
  questions: [
    { id: 'where', kind: 'choice', text: 'Where is the noise?', options: [{ value: 'engine', label: 'Engine block / sump' }, { value: 'top', label: 'Top of the engine (valve cover)' }, { value: 'generator-end', label: 'Alternator / generator end' }, { value: 'unsure', label: 'Not sure' }] },
    { id: 'when', kind: 'choice', text: 'When is it loudest?', options: [{ value: 'load', label: 'Under load' }, { value: 'idle', label: 'At idle / when off load' }, { value: 'always', label: 'All the time' }] },
    { id: 'metal', kind: 'choice', text: 'Metal in the oil filter or sump?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'pressureLow', kind: 'choice', text: 'Oil pressure', options: [{ value: 'low', label: 'Low' }, { value: 'normal', label: 'Normal (mechanical gauge)' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'afterOverhaul', kind: 'choice', text: 'Recent overhaul?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { id: 'smoke', kind: 'choice', text: 'Exhaust', options: [{ value: 'normal', label: 'Normal' }, { value: 'black', label: 'Black smoke' }, { value: 'white', label: 'White smoke' }] },
  ],
  stopRules: [
    { when: is('where', ['engine', 'top', 'generator-end', 'unsure']), level: 'STOP', message: 'STOP THE SET: knocking, bearing noise or seizure can wreck the crankshaft, break a connecting rod or destroy the alternator. Do not restart or try to free it with the starter; inspect first.' },
  ],
  causes: [
    { id: 'bearing', title: 'Main or big-end bearing failure', evidence: [{ when: is('metal', 'yes'), effect: 'strongly', because: 'Metal in the oil' }, { when: is('pressureLow', 'low'), effect: 'strongly', because: 'Low oil pressure' }, { when: is('where', 'engine'), effect: 'supports', because: 'Noise from the block or sump' }, { when: is('when', 'load'), effect: 'supports', because: 'Louder under load' }, { when: is('where', 'generator-end'), effect: 'excludes', because: 'Noise from the alternator end' }], actions: ['Drop the sump; inspect bearings and journals; measure clearances; find the cause (oil starvation, contamination, clearance).'], reference: PRACTICE },
    { id: 'post-overhaul', title: 'Post-overhaul fault: clearances, priming, debris or timing', evidence: [{ when: is('afterOverhaul', 'yes'), effect: 'strongly', because: 'Recent overhaul' }, { when: is('afterOverhaul', 'no'), effect: 'excludes', because: 'No recent overhaul' }], actions: ['Check bearing and piston clearances, oil gallery plugs, pump priming, injection timing and torque records.'], reference: PRACTICE },
    { id: 'combustion', title: 'Combustion knock (injector or timing)', evidence: [{ when: is('smoke', ['black', 'white']), effect: 'supports', because: 'Smoke with the knock' }, { when: is('where', 'top'), effect: 'supports', because: 'Noise from the top of the engine' }, { when: { all: [is('metal', 'no'), is('pressureLow', 'normal')] }, effect: 'supports', because: 'No metal and normal pressure' }], actions: ['Cylinder cut-out test to find the cylinder; test injectors; check injection timing.'], reference: PRACTICE },
    { id: 'valvetrain', title: 'Valve train (clearance, broken spring, rocker)', evidence: [{ when: is('where', 'top'), effect: 'strongly', because: 'Noise from the valve cover' }, { when: is('when', 'idle'), effect: 'supports', because: 'Noticeable at idle' }], actions: ['Check valve clearances and springs per the manual.'], reference: PRACTICE },
    { id: 'alternator-bearing', title: 'Alternator bearing or coupling', evidence: [{ when: is('where', 'generator-end'), effect: 'strongly', because: 'Noise from the generator end' }, { when: is('where', 'engine'), effect: 'excludes', because: 'Noise from the engine' }], actions: ['Isolate; check bearing play, heat and grease; check coupling alignment and the flex plate.'], reference: ALT_PRACTICE },
  ],
};

// ─── 6. No or low output voltage ─────────────────────────────────────────────
export const NO_VOLTAGE: FaultFamily = {
  id: 'no-voltage',
  title: 'No output voltage, low voltage or unstable voltage',
  keywords: /no (output )?voltage|low voltage|voltage (low|unstable|hunting)|no output|avr|excitation|not producing power/i,
  review: 'technician review pending',
  questions: [
    { id: 'frequency', kind: 'number', text: 'Frequency', unit: 'Hz', min: 0, max: 70 },
    { id: 'ratedFrequency', kind: 'choice', text: 'Rated frequency', options: [{ value: '50', label: '50 Hz' }, { value: '60', label: '60 Hz' }] },
    // No built-in "at rated" band: the steady-state limit comes from the governor / controller settings for this set.
    { id: 'oemMinFrequency', kind: 'number', text: 'Lowest steady-state frequency allowed for this set (governor or controller settings sheet, OEM manual)', unit: 'Hz', min: 30, max: 70 },
    { id: 'voltage', kind: 'number', text: 'Output voltage, line to line', unit: 'V', min: 0, max: 15000 },
    { id: 'ratedVoltage', kind: 'number', text: 'Rated voltage, line to line', unit: 'V', min: 100, max: 15000 },
    { id: 'avrFuse', kind: 'choice', text: 'AVR fuse and supply', options: [{ value: 'ok', label: 'Fuse OK, supply present' }, { value: 'blown', label: 'Fuse blown' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'residual', kind: 'choice', text: 'Residual voltage with the AVR disconnected (excitation off)', options: [{ value: 'present', label: 'A few volts present' }, { value: 'none', label: 'None' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'sensing', kind: 'choice', text: 'AVR sensing wiring', options: [{ value: 'ok', label: 'Tight and correct' }, { value: 'loose', label: 'Loose or disconnected' }] },
    { id: 'diodes', kind: 'choice', text: 'Rotating rectifier diodes (tested isolated)', options: [{ value: 'ok', label: 'All good' }, { value: 'failed', label: 'One or more failed' }, { value: 'not-checked', label: 'Not checked' }] },
    { id: 'insulation', kind: 'number', text: 'Winding insulation resistance', unit: 'MΩ', min: 0, max: 100000, help: 'Insulation tester, AVR and controller disconnected first.' },
    { id: 'oemMinInsulation', kind: 'number', text: 'Minimum insulation resistance (alternator manual)', unit: 'MΩ', min: 0.1, max: 10000 },
    { id: 'loadPct', kind: 'number', text: 'Load', unit: '% of rating', min: 0, max: 200 },
  ],
  stopRules: [
    { when: { q: 'insulation', op: 'ltRef', ref: 'oemMinInsulation' }, level: 'STOP', message: 'STOP: insulation below the alternator manufacturer minimum. Do not run: risk of winding failure and of live metalwork. Dry out or repair the windings before running.' },
    { when: { q: 'voltage', op: 'ge', value: 0 }, level: 'CAUTION', message: 'Alternator and panel terminals are lethal while running: stop the set, isolate and lock off before touching wiring; prove dead with an approved tester; measure live only with rated instruments.' },
  ],
  causes: [
    { id: 'speed', title: 'Low engine speed (frequency low)', evidence: [{ when: { any: [{ all: [is('ratedFrequency', '50'), { q: 'frequency', op: 'lt', value: 47.5 }] }, { all: [is('ratedFrequency', '60'), { q: 'frequency', op: 'lt', value: 57 }] }] }, effect: 'strongly', because: 'Frequency more than 5 % below rated: the AVR reduces voltage when underspeed' }, { when: { q: 'frequency', op: 'gtRef', ref: 'oemMinFrequency' }, effect: 'excludes', because: 'Frequency above the lowest steady-state frequency allowed for this set' }], actions: ['Use the speed/governor checks first: the AVR protects the alternator by reducing voltage when the engine is underspeed.'], reference: ALT_PRACTICE },
    { id: 'avr-supply', title: 'AVR fuse or supply', evidence: [{ when: is('avrFuse', 'blown'), effect: 'strongly', because: 'AVR fuse blown' }, { when: is('avrFuse', 'ok'), effect: 'excludes', because: 'Fuse and supply OK' }], actions: ['Replace the fuse with the correct rating; find why it blew (shorted diode, wiring) before running.'], reference: ALT_PRACTICE },
    { id: 'residual', title: 'Loss of residual magnetism', evidence: [{ when: is('residual', 'none'), effect: 'strongly', because: 'No residual voltage' }, { when: is('residual', 'present'), effect: 'excludes', because: 'Residual voltage present' }], actions: ['Flash the field per the alternator manual (polarity and voltage as specified).'], reference: ALT_PRACTICE },
    { id: 'sensing', title: 'AVR sensing wiring', evidence: [{ when: is('sensing', 'loose'), effect: 'strongly', because: 'Sensing wiring loose or disconnected' }, { when: is('sensing', 'ok'), effect: 'excludes', because: 'Sensing wiring correct' }], actions: ['Isolate; re-make the sensing connections to the wiring diagram for this AVR.'], reference: ALT_PRACTICE },
    { id: 'diodes', title: 'Rotating rectifier (diode) failure', evidence: [{ when: is('diodes', 'failed'), effect: 'strongly', because: 'Diode failed on test' }, { when: is('diodes', 'ok'), effect: 'excludes', because: 'Diodes test good' }, { when: is('avrFuse', 'blown'), effect: 'supports', because: 'A shorted diode often blows the AVR fuse' }], actions: ['Replace the full diode set and the surge suppressor per the manual.'], reference: ALT_PRACTICE },
    { id: 'winding', title: 'Winding insulation fault', evidence: [{ when: { q: 'insulation', op: 'ltRef', ref: 'oemMinInsulation' }, effect: 'strongly', because: 'Insulation below the manufacturer minimum' }, { when: { q: 'insulation', op: 'gtRef', ref: 'oemMinInsulation', factor: 10 }, effect: 'contradicts', because: 'Insulation well above the minimum' }], actions: ['Dry out per the manual; re-test; rewind if it does not recover.'], reference: ALT_PRACTICE },
    { id: 'avr', title: 'AVR failure or setting', evidence: [{ when: { all: [is('avrFuse', 'ok'), is('residual', 'present'), is('sensing', 'ok'), is('diodes', 'ok')] }, effect: 'strongly', because: 'Supply, residual, sensing and diodes check out' }, { when: { all: [{ q: 'voltage', op: 'gtRef', ref: 'ratedVoltage', factor: 0.95 }, { q: 'voltage', op: 'ltRef', ref: 'ratedVoltage', factor: 1.05 }] }, effect: 'excludes', because: 'Voltage within ±5 % of rated' }], actions: ['Check the AVR settings (voltage, stability, under-frequency roll-off); replace the AVR with the correct model if it does not regulate.'], reference: ALT_PRACTICE },
    { id: 'overload', title: 'Overload or a heavy motor start pulling voltage down', evidence: [{ when: { q: 'loadPct', op: 'gt', value: 100 }, effect: 'strongly', because: 'Load above the rating' }, { when: { q: 'loadPct', op: 'lt', value: 10 }, effect: 'excludes', because: 'Little or no load' }], actions: ['Reduce load; stage motor starts; check the motor-start dip with the Calculators tab.'], reference: ALT_PRACTICE },
  ],
};

export const FAMILIES: FaultFamily[] = [NO_CRANK, NO_START, LOW_OIL_PRESSURE, OVERHEATING, KNOCK_SEIZURE, NO_VOLTAGE];

/** The family whose symptom words match a description, or null. */
export function familyFor(description: string): FaultFamily | null {
  // Safety-critical families first.
  const order = [KNOCK_SEIZURE, LOW_OIL_PRESSURE, OVERHEATING, NO_START, NO_CRANK, NO_VOLTAGE];
  return order.find((f) => f.keywords.test(description)) ?? null;
}
